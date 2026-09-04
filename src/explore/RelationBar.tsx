/**
 * RelationBar — the `←─ N     M ─→` chip on each entity box, and the two
 * popovers behind it.
 *
 * Replaces the cascading RelationMenu (Siggie, 2026-09-04: "i hate the
 * cascading menu for related entities"). That menu made you traverse five
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
import type { RelationPosition } from '../services/DataService';

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

export interface RelationBarProps {
  /** The class this bar belongs to — named in the popover header. */
  label: string;
  rows: readonly RelationRowVM[];
  onAdd: (classId: string) => void;
  onRemove: (classId: string) => void;
  onInspect?: (classId: string) => void;
}

type Side = 'left' | 'right';

export function RelationBar({ label, rows, onAdd, onRemove, onInspect }: RelationBarProps) {
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
  anchor, side, label, rows, onAdd, onRemove, onInspect,
}: {
  anchor: { x: number; y: number };
  side: Side;
  label: string;
  rows: readonly RelationRowVM[];
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
  onInspect?: (id: string) => void;
}) {
  const { ref, pos } = useClamped(anchor);

  /* Sorted by the class at the other end, so the popover reads as a list of
     CLASSES with their attributes, not a list of attributes. */
  const sorted = [...rows].sort((a, b) =>
    a.other.localeCompare(b.other) || a.slot.localeCompare(b.slot));

  const allDrawn = sorted.every(r => r.drawn);
  const distinct = [...new Set(sorted.map(r => r.other))];

  return (
    <div
      ref={ref}
      data-relation-bar
      onMouseEnter={cancelClose}
      onMouseLeave={scheduleClose}
      style={{ left: pos.x, top: pos.y }}
      className="fixed z-50 max-w-[34rem] max-h-[60vh] overflow-y-auto py-1
                 rounded-md border border-gray-300 dark:border-slate-600
                 bg-white dark:bg-slate-800 shadow-xl
                 text-gray-900 dark:text-gray-100"
    >
      <div className="px-3 py-1 border-b border-gray-200 dark:border-slate-700">
        <div className="text-[11px] font-semibold">
          {side === 'left'
            ? <><b>{label}</b> belongs to {distinct.length}</>
            : <><b>{label}</b> owns {distinct.length}</>}
        </div>
        <div className="text-[10px] text-gray-400 dark:text-slate-500">
          {side === 'left' ? 'drawn to its left' : 'drawn to its right'}
        </div>
      </div>

      <button
        onClick={() => distinct.forEach(id => (allDrawn ? onRemove(id) : onAdd(id)))}
        className="block w-full text-left px-3 py-1 text-[11px]
                   text-blue-600 dark:text-blue-400
                   hover:bg-gray-100 dark:hover:bg-slate-700"
      >
        {allDrawn ? `hide all ${distinct.length}` : `add all ${distinct.length}`}
      </button>

      <table className="w-full text-[11px]">
        <tbody>
          {sorted.map(r => {
            const kind = POSITION_AXIS[r.position].kind;
            return (
              <tr
                key={`${r.declaredBy}.${r.slot}->${r.other}`}
                onClick={() => (r.drawn ? onRemove(r.other) : onAdd(r.other))}
                className={`cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700
                            ${r.drawn ? 'opacity-55' : ''}`}
              >
                {/* Qualified slot name: the prefix is what says which class
                    declares the relationship, so the glyph does not have to. */}
                <td className="pl-3 pr-2 py-0.5 font-mono whitespace-nowrap">
                  <span className="text-gray-400 dark:text-slate-500">{r.declaredBy}.</span>
                  <span>{r.slot}</span>
                </td>
                <td className="px-1 py-0.5 align-middle">
                  <EdgeSample kind={kind} width={38} />
                </td>
                <td className="px-2 py-0.5 font-mono text-gray-500 dark:text-slate-400
                               whitespace-nowrap tabular-nums">
                  {r.cardinality}
                </td>
                <td className="pr-2 py-0.5 whitespace-nowrap">
                  <span className="text-blue-600 dark:text-blue-400">{r.other}</span>
                </td>
                <td className="pr-3 py-0.5 text-right">
                  {onInspect && (
                    <button
                      onClick={ev => { ev.stopPropagation(); onInspect(r.other); }}
                      aria-label={`Open ${r.other}'s details`}
                      className="text-gray-300 hover:text-gray-600 dark:text-slate-600
                                 dark:hover:text-slate-300"
                    >
                      ⓘ
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
