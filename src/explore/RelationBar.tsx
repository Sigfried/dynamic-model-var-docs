/**
 * RelationBar — the `←─ N     M ─→` chip on each entity box, and the two
 * popovers behind it.
 *
 * Replaces the cascading relation menu, deleted 2026-09-04 (Siggie: "i hate
 * the cascading menu for related entities"). That menu made you traverse five
 * branches to find one class, and the branch labels ("belong to me by their
 * attribute") were the only place the vocabulary appeared, so reading them was
 * mandatory. Here the split is spatial and needs no vocabulary at all.
 *
 * ## The two arrows are POSITION, not verdict
 *
 * This is the distinction that matters, and it is easy to collapse by mistake:
 *
 *   - The arrows ON THE CHIP mean "to my left" and "to my right". Classes are
 *     laid out owner-first, so everything that OWNS me is drawn to my left and
 *     everything I OWN is drawn to my right. `←─ N` is therefore "N classes I
 *     belong to"; `M ─→` is "M classes I own".
 *
 *   - The glyph ON EACH ROW is the edge's KIND, which is a different fact: it
 *     says which end of the line carries the arrowhead, and therefore which
 *     class declares the slot.
 *
 * Both kinds appear on both sides. Of the four classes that own `Observation`,
 * three do so because Observation declares a single-valued pointer at them
 * (own-bkwd, `--<`) and one because ObservationSet declares a collection of
 * them (own-fwd, `-->`). A reader scanning the left popover sees both glyphs,
 * and that is the information the glyph carries — not the side, which the
 * heading already gave.
 *
 * The five RelationPositions decompose onto exactly these two axes:
 *
 *   position        side   kind          glyph
 *   owned-mine      left   own-bkwd      --<     I point at it; it owns me
 *   owned-theirs    left   own-fwd       -->     it collects me
 *   owns-mine       right  own-fwd       -->     I collect it
 *   owns-theirs     right  own-bkwd      --<     it points at me
 *   association     left   association   <-->    neither owns the other
 *
 * `association` sits on the left because the layout orders its target first,
 * exactly as own-bkwd does — geometry, not an ownership claim.
 *
 * Opens on hover with a close grace period, like the menu it replaces; the
 * popover portals to the body because the box lives inside the zoom/pan
 * transform, where a positioned child would be clipped and scaled.
 */

import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import EdgeSample, { type DrawnKind } from './EdgeSample';
import type { RelationPosition, SiblingColor } from '../services/DataService';

/** Which side of the box a position sits on, and how its edge is drawn. */
const POSITION_AXIS: Record<RelationPosition, { side: 'left' | 'right'; kind: DrawnKind }> = {
  'owned-mine': { side: 'left', kind: 'own-bkwd' },
  'owned-theirs': { side: 'left', kind: 'own-fwd' },
  'owns-mine': { side: 'right', kind: 'own-fwd' },
  'owns-theirs': { side: 'right', kind: 'own-bkwd' },
  'association': { side: 'left', kind: 'association' },
};

/** Same grace period as the old menu: the pointer has to cross a 2px gap. */
const CLOSE_DELAY_MS = 300;

/** At most one popover open across every box on the canvas. */
const openListeners = new Set<(id: string | null) => void>();
let closeTimer: ReturnType<typeof setTimeout> | undefined;
function cancelClose() {
  if (closeTimer !== undefined) { clearTimeout(closeTimer); closeTimer = undefined; }
}
function setOpen(id: string | null) {
  cancelClose();
  for (const fn of openListeners) fn(id);
}
function scheduleClose() {
  cancelClose();
  closeTimer = setTimeout(() => { closeTimer = undefined; setOpen(null); }, CLOSE_DELAY_MS);
}

/** One relationship, flattened for display. */
export interface RelationRowVM {
  /** The class at the other end. */
  other: string;
  position: RelationPosition;
  slot: string;
  /** Which class declares the slot — the qualified name's prefix. */
  declaredBy: string;
  cardinality: string;
  /** Already on the canvas: the row toggles it OFF rather than on. */
  drawn: boolean;
}

/** P3 colour for a class, or undefined when it has none of its own. */
export type ColorOf = (classId: string) => SiblingColor | undefined;

export interface RelationBarProps {
  /** The class this bar belongs to — named in the popover header. */
  label: string;
  rows: readonly RelationRowVM[];
  onAdd: (classId: string) => void;
  onRemove: (classId: string) => void;
  onInspect?: (classId: string) => void;
  /** P3 colour per class, so each end of a row wears its own box's colour. */
  colorOf?: ColorOf;
  /**
   * The box's own attribute rows, in the order the box lists them.
   *
   * The popover sorts to match (Siggie, 2026-09-04: "my row order was based on
   * the slot row order in the entity"), so scanning from a box row to the same
   * relationship in the popover does not mean re-finding it in a different
   * order. Relations whose slot is declared elsewhere have no row here and sort
   * to the end.
   */
  slotOrder?: readonly string[];
}

type Side = 'left' | 'right';

export function RelationBar({
  label, rows, onAdd, onRemove, onInspect, colorOf, slotOrder,
}: RelationBarProps) {
  const [open, setOpenSide] = useState<Side | null>(null);
  const [anchor, setAnchor] = useState<{ x: number; y: number } | null>(null);
  const leftRef = useRef<HTMLButtonElement>(null);
  const rightRef = useRef<HTMLButtonElement>(null);
  const id = useId();

  useEffect(() => {
    const onOpen = (which: string | null) => {
      if (which === id) return;
      setOpenSide(null);
      setAnchor(null);
    };
    openListeners.add(onOpen);
    return () => { openListeners.delete(onOpen); };
  }, [id]);

  useEffect(() => {
    if (!open) return;
    const close = (ev: Event) => {
      const t = ev.target as HTMLElement | null;
      if (t?.closest('[data-relation-bar]')) return;
      setOpen(null);
    };
    const onKey = (ev: KeyboardEvent) => { if (ev.key === 'Escape') setOpen(null); };
    // Capture phase: the canvas stops propagation on its own handlers.
    document.addEventListener('mousedown', close, true);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', close, true);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  /* Counts are of DISTINCT classes, not edges: two slots pointing at the same
     class is one related class. The rows below still list both, because which
     attribute carries a relationship is the thing a reader is looking for. */
  const bySide = (side: Side) =>
    rows.filter(r => POSITION_AXIS[r.position].side === side);
  const countOf = (side: Side) =>
    new Set(bySide(side).map(r => r.other)).size;

  const nLeft = countOf('left');
  const nRight = countOf('right');
  if (nLeft === 0 && nRight === 0) return null;

  const show = (side: Side, el: HTMLButtonElement | null) => {
    const r = el?.getBoundingClientRect();
    if (!r) return;
    setOpen(id);            // closes every other bar first
    setOpenSide(side);
    setAnchor({ x: r.left, y: r.bottom + 2 });
  };

  /*
   * NO `title` ON THE CHIP. A native tooltip appears ON TOP of the popover the
   * same hover just opened, covering its first rows — the exact failure
   * NEXT_SESSION_EDGE_DISPLAY §3.4 records for the old relation-menu trigger,
   * reproduced here within minutes of the bar shipping (Siggie, screenshot
   * 2026-09-04). The popover's own header says what the chip would have said,
   * so the tooltip was never carrying anything unique.
   */
  const chip = (side: Side, n: number, ref: React.RefObject<HTMLButtonElement | null>) => {
    const active = open === side;
    return (
      <button
        ref={ref}
        data-relation-bar
        data-no-drag
        disabled={n === 0}
        aria-label={side === 'left'
          ? `${n} classes ${label} belongs to`
          : `${n} classes ${label} owns`}
        onMouseEnter={() => n > 0 && show(side, ref.current)}
        onMouseLeave={scheduleClose}
        onClick={ev => {
          ev.stopPropagation();
          if (n === 0) return;
          if (active) setOpen(null); else show(side, ref.current);
        }}
        className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] leading-none
                    tabular-nums transition-colors
                    ${n === 0
                      ? 'text-gray-300 dark:text-slate-600 cursor-default'
                      : active
                        ? 'bg-sky-200 dark:bg-sky-800 text-sky-900 dark:text-sky-100'
                        : 'text-sky-800 dark:text-sky-200 hover:bg-sky-100 dark:hover:bg-sky-900'}`}
      >
        {side === 'left'
          ? <><span aria-hidden>←</span>{n}</>
          : <>{n}<span aria-hidden>→</span></>}
      </button>
    );
  };

  return (
    <>
      {chip('left', nLeft, leftRef)}
      {/* The box's own name sits between the two counts, so each arrow reads
          as pointing at THIS box rather than floating free. */}
      <span className="flex-1 min-w-0 text-center text-[9px] text-gray-400
                       dark:text-slate-500 truncate select-none">
        related
      </span>
      {chip('right', nRight, rightRef)}
      {open && anchor && createPortal(
        <RelationPopover
          anchor={anchor}
          side={open}
          label={label}
          rows={bySide(open)}
          onAdd={onAdd}
          onRemove={onRemove}
          onInspect={onInspect}
          colorOf={colorOf}
          slotOrder={slotOrder}
        />,
        document.body,
      )}
    </>
  );
}

/** Keeps a popover inside the viewport: a box near the right edge would
 *  otherwise open one half off-screen, and the canvas pans. */
function useClamped(anchor: { x: number; y: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(anchor);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const pad = 8;
    setPos({
      x: Math.max(pad, Math.min(anchor.x, window.innerWidth - r.width - pad)),
      y: Math.max(pad, Math.min(anchor.y, window.innerHeight - r.height - pad)),
    });
  }, [anchor]);
  return { ref, pos };
}

function RelationPopover({
  anchor, side, label, rows, onAdd, onRemove, onInspect, colorOf, slotOrder,
}: {
  anchor: { x: number; y: number };
  side: Side;
  label: string;
  rows: readonly RelationRowVM[];
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
  onInspect?: (id: string) => void;
  colorOf?: ColorOf;
  slotOrder?: readonly string[];
}) {
  const { ref, pos } = useClamped(anchor);

  /*
   * Ordered by the BOX's own attribute rows, so the popover lists relationships
   * in the order you already see them on the box rather than alphabetically.
   *
   * A relation declared by some other class (`ObservationSet.observations`
   * reaching in) has no row of its own here, so it sorts after everything that
   * does, then alphabetically among its peers.
   */
  const rank = (r: RelationRowVM) => {
    const i = slotOrder?.indexOf(r.slot) ?? -1;
    return i === -1 ? Number.MAX_SAFE_INTEGER : i;
  };
  const sorted = [...rows].sort((a, b) =>
    rank(a) - rank(b)
    || a.other.localeCompare(b.other)
    || a.slot.localeCompare(b.slot));

  const allDrawn = sorted.every(r => r.drawn);
  const distinct = [...new Set(sorted.map(r => r.other))];

  return (
    <div
      ref={ref}
      data-relation-bar
      onMouseEnter={cancelClose}
      onMouseLeave={scheduleClose}
      style={{ left: pos.x, top: pos.y }}
      /* Sized to the CONTENT, not to a guessed width: qualified slot names run
         long (`MeasurementObservationSet.observations`) and truncating them
         hides the half of the row that says who declares the relationship.
         `w-max` lets the table set the width; the viewport cap is what stops
         it running off-screen, and useClamped keeps it in view. */
      className="fixed z-50 w-max max-w-[min(46rem,calc(100vw-2rem))] max-h-[60vh]
                 overflow-y-auto overflow-x-hidden py-1
                 rounded-md border border-gray-300 dark:border-slate-600
                 bg-white dark:bg-slate-800 shadow-xl
                 text-gray-900 dark:text-gray-100"
    >
      {/* No "drawn to its left" subtitle — the rows are IN diagram order, so
          the layout says it (Siggie, 2026-09-04). */}
      <div className="px-3 py-1 border-b border-gray-200 dark:border-slate-700">
        {/*
          Counts BOTH numbers, because they differ and the difference confused
          the reader: "add all 4 is correct but confusing because there are more
          than four rows" (Siggie, 2026-09-04). Four distinct entities reached
          through seven attributes — one entity can be reached by several slots.
          Deliberately NOT explaining which class declares which; that detail is
          in the rows.
        */}
        <div className="text-[11px] font-semibold">
          <b>{label}</b>{' '}
          {side === 'left' ? 'belongs to' : 'owns'}{' '}
          {distinct.length} {distinct.length === 1 ? 'entity' : 'distinct entities'}
          {sorted.length !== distinct.length && (
            <span className="font-normal text-gray-500 dark:text-slate-400">
              {' '}through {sorted.length} attributes
            </span>
          )}
        </div>
      </div>

      <button
        onClick={() => distinct.forEach(id => (allDrawn ? onRemove(id) : onAdd(id)))}
        className="block w-full text-left px-3 py-1 text-[11px]
                   text-blue-600 dark:text-blue-400
                   hover:bg-gray-100 dark:hover:bg-slate-700"
      >
        {/* "entities", matching the header — the bare number read as a row
            count, which it is not. */}
        {allDrawn
          ? `hide all ${distinct.length} entities`
          : `add all ${distinct.length} entities`}
      </button>

      <table className="w-full text-[11px]">
        <tbody>
          {sorted.map(r => {
            const kind = POSITION_AXIS[r.position].kind;
            /*
             * DIAGRAM ORDER, always: owner on the left, owned on the right —
             * the same order the canvas lays boxes out, so a row and the line
             * it describes read the same way round. The popover's SIDE decides
             * which of the two ends is this box (left side ⇒ the other class
             * owns me), never the edge's kind.
             *
             * Each end is written as `Class.slot` when that class DECLARES the
             * slot, and as a bare class name otherwise, so the qualified half
             * is always the end that holds the attribute. On a merged box the
             * declarer is often a CHILD rather than the box's title, which is
             * why this end is named by `declaredBy` and not by `label`.
             */
            const mine = r.declaredBy === r.other ? label : r.declaredBy;
            const owner = side === 'left' ? r.other : mine;
            const owned = side === 'left' ? mine : r.other;
            return (
              <tr
                key={`${r.declaredBy}.${r.slot}->${r.other}`}
                className="hover:bg-gray-100 dark:hover:bg-slate-700"
              >
                {/*
                  Show/hide is its OWN control (Siggie, 2026-09-04). Clicking
                  the row used to toggle the entity, which left no way to open
                  a detail panel from here and forced drawn rows to be washed
                  out just to say "clicking me removes it". Now the button
                  carries that state and the row stays at full contrast.
                */}
                <td className="pl-2 pr-1 py-0.5">
                  <button
                    onClick={ev => {
                      ev.stopPropagation();
                      (r.drawn ? onRemove : onAdd)(r.other);
                    }}
                    aria-label={r.drawn
                      ? `Remove ${r.other} from the diagram`
                      : `Add ${r.other} to the diagram`}
                    className={`w-4 h-4 rounded-sm leading-none text-[11px]
                                flex items-center justify-center border
                                ${r.drawn
                                  ? 'border-sky-300 bg-sky-50 text-sky-700 hover:bg-sky-200 dark:border-sky-700 dark:bg-sky-950 dark:text-sky-300'
                                  : 'border-gray-300 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:border-slate-600 dark:hover:bg-slate-600'}`}
                  >
                    {r.drawn ? '−' : '+'}
                  </button>
                </td>
                <td className="pl-1 pr-2 py-0.5 text-right whitespace-nowrap">
                  <End cls={owner} row={r} colorOf={colorOf} onInspect={onInspect} />
                </td>
                <td className="px-2 py-0.5 font-mono text-gray-400 dark:text-slate-500
                               whitespace-nowrap tabular-nums text-right">
                  {r.cardinality}
                </td>
                <td className="px-1 py-0.5 align-middle">
                  <EdgeSample kind={kind} width={30} />
                </td>
                <td className="pr-3 py-0.5 whitespace-nowrap">
                  <End cls={owned} row={r} colorOf={colorOf} onInspect={onInspect} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/**
 * One end of a row: a class name, qualified with its slot when that class is
 * the one declaring the relationship.
 *
 * Colour is the class's OWN P3 sibling colour — the same one its box header
 * and its rows wear on the canvas, so `MeasurementObservation` is the same
 * blue here as it is there, and rows belonging to the parent stay in the
 * default ink. That is what makes a row scannable against the diagram
 * (Siggie, 2026-09-04: "blue because it's a blue child class on both sides").
 *
 * **The class NAME is what opens details** — not the whole row, and not a
 * separate ⓘ button, which was redundant with it (Siggie, 2026-09-04). Adding
 * and hiding is the `+`/`−` control instead, so the two actions a row offers
 * are on two different targets rather than competing for one click.
 *
 * The slot suffix is not a click target: it names an attribute, and there is
 * nothing to open for one here.
 */
function End({ cls, row, colorOf, onInspect }: {
  cls: string;
  row: RelationRowVM;
  colorOf?: ColorOf;
  onInspect?: (id: string) => void;
}) {
  const color = colorOf?.(cls);
  // The declaring end shows `Class.slot`; the other end is a bare class name.
  const qualified = cls === row.declaredBy;
  const style = color ? { color: color.text } : undefined;
  return (
    <span className="font-mono">
      {onInspect ? (
        <button
          onClick={ev => { ev.stopPropagation(); onInspect(cls); }}
          title={`Open ${cls}'s details`}
          className="hover:underline"
          style={style}
        >
          {cls}
        </button>
      ) : (
        <span style={style}>{cls}</span>
      )}
      {qualified && (
        <span
          className={color ? 'opacity-80' : 'text-gray-500 dark:text-slate-400'}
          style={style}
        >
          .{row.slot}
        </span>
      )}
    </span>
  );
}
