/**
 * RelationMenu — the cascading "N related" menu on each entity box.
 *
 * Replaces the two wrapped chip strips (`owned by` / `owns`). Those failed on
 * three counts, all measured (docs/TASKS.md, "Chip strips → relation counts +
 * menu"):
 *
 *  1. They could express only two of the five relation positions, and showed
 *     ASSOCIATIONS in neither — Specimen ↔ Document was unreachable.
 *  2. They were `flex-wrap` with a height ESTIMATED IN JS while the browser did
 *     the real wrapping, so the reserved band and the drawn band diverged and
 *     the rows below overlapped. Observation, with 13 owners over three wrapped
 *     lines, was the worst case. A fixed-size trigger makes box height
 *     deterministic — which is why the strips were replaced rather than the
 *     estimator patched.
 *  3. They showed the cost of a click only after the click.
 *
 * Shape (Siggie, deciding D3): a trigger reading "N related", branching to
 * "N belong to me by my attribute", "N belong to me by their attribute",
 * "N I belong to", "N associated with" — five branches after Siggie chose the
 * declaring side as a top-level split. Leaf items toggle: an entity already on
 * the canvas is GREYED and clicking REMOVES it (Siggie: "is there any reason
 * not to allow clicking one of these ... to re-hide it?" — no).
 *
 * Rendered in a portal because the box it hangs off is inside the zoom/pan
 * transform and has `overflow` ancestors; a menu positioned in that space gets
 * clipped and scaled with the canvas.
 */

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { RelationGroupVM } from './OwnershipGraphView';

export interface RelationMenuProps {
  /** The class the menu hangs off — named in every tooltip. */
  label: string;
  groups: RelationGroupVM[];
  /** Distinct related classes, for the trigger's count. */
  relatedCount: number;
  /** How many of them are on the canvas — the trigger's second number. */
  shownCount: number;
  /** Put an entity on the canvas. */
  onAdd: (classId: string) => void;
  /** Take a DRAWN entity off it. */
  onRemove: (classId: string) => void;
  /** Open its detail drawer — the leaf's secondary action. */
  onInspect?: (classId: string) => void;
}

/** Where a submenu opens, in viewport coordinates. */
type Anchor = { x: number; y: number };

/** Floor for a width-capped submenu: narrower than this and the names are
 *  unreadable, so it is better to overflow slightly than to shrink further. */
const MIN_SUBMENU_W = 140;

export function RelationMenu({
  label, groups, relatedCount, shownCount, onAdd, onRemove, onInspect,
}: RelationMenuProps) {
  const [anchor, setAnchor] = useState<Anchor | null>(null);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close on any outside click or Escape. The menu lives in a portal, so an
  // outside click is anything not inside a [data-relation-menu] subtree —
  // ancestry in the DOM, not in the React tree.
  useEffect(() => {
    if (!anchor) return;
    const close = (ev: Event) => {
      const t = ev.target as HTMLElement | null;
      if (t?.closest('[data-relation-menu]')) return;
      setAnchor(null);
      setOpenGroup(null);
    };
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') { setAnchor(null); setOpenGroup(null); }
    };
    // Capture phase: the canvas stops propagation on its own handlers, so a
    // bubbling listener never sees clicks on boxes.
    document.addEventListener('mousedown', close, true);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', close, true);
      document.removeEventListener('keydown', onKey);
    };
  }, [anchor]);

  if (!groups.length) return null;

  const open = (ev: React.MouseEvent) => {
    ev.stopPropagation();
    if (anchor) { setAnchor(null); setOpenGroup(null); return; }
    const r = triggerRef.current?.getBoundingClientRect();
    if (r) setAnchor({ x: r.left, y: r.bottom + 2 });
  };

  return (
    <>
      <button
        ref={triggerRef}
        data-relation-menu
        data-relation-trigger
        data-no-drag
        data-help-id="relation-menu"
        title={`${relatedCount} entities related to ${label}, ${shownCount} of them`
          + ` on the diagram — click to browse them`}
        onClick={open}
        className={`flex items-center gap-1 text-[9px] leading-none px-1.5 py-0.5
                    rounded border
                    border-amber-300 dark:border-amber-700
                    bg-amber-50 dark:bg-amber-950/40
                    text-amber-900 dark:text-amber-200
                    hover:bg-amber-200 dark:hover:bg-amber-800
                    ${anchor ? 'bg-amber-200 dark:bg-amber-800' : ''}`}
      >
        {/* A bare count read as a static badge rather than an opener (Siggie:
            "doesn't look like beginning of a cascading menu"). The stacked-bars
            glyph plus the caret says "this opens a list" before the hover. */}
        <span aria-hidden className="opacity-60">☰</span>
        <span className="tabular-nums">{relatedCount}</span>
        <span>related</span>
        {/* Second number is the state the menu would otherwise hide: how much
            of this box's neighbourhood is already on the canvas. */}
        <span className="opacity-70">· {shownCount} shown</span>
        <span aria-hidden className="opacity-60">▾</span>
      </button>
      {anchor && createPortal(
        <MenuPanel
          anchor={anchor}
          label={label}
          groups={groups}
          openGroup={openGroup}
          setOpenGroup={setOpenGroup}
          onAdd={onAdd}
          onRemove={onRemove}
          onInspect={onInspect}
        />,
        document.body,
      )}
    </>
  );
}

/**
 * The top-level panel: one row per relation position, each opening a submenu.
 *
 * Kept flush against the viewport by `useClamped`, since a box near the right
 * or bottom edge would otherwise open a menu half off-screen — and the canvas
 * pans, so "near the edge" is not a rare case.
 */
function MenuPanel({
  anchor, label, groups, openGroup, setOpenGroup, onAdd, onRemove, onInspect,
}: {
  anchor: Anchor;
  label: string;
  groups: RelationGroupVM[];
  openGroup: string | null;
  setOpenGroup: (g: string | null) => void;
} & Pick<RelationMenuProps, 'onAdd' | 'onRemove' | 'onInspect'>) {
  const { ref, style } = useClamped(anchor);
  const active = groups.find(g => g.position === openGroup);

  return (
    <div
      ref={ref}
      data-relation-menu
      style={style}
      className="fixed z-50 min-w-[13rem] rounded border shadow-lg text-[11px]
                 border-gray-300 dark:border-slate-600
                 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100"
    >
      <div className="px-2 py-1 border-b border-gray-200 dark:border-slate-600
                      text-[9px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
        {label} — related entities
      </div>
      {groups.map(g => (
        <button
          key={g.position}
          data-relation-group={g.position}
          onMouseEnter={() => setOpenGroup(g.position)}
          onClick={ev => {
            ev.stopPropagation();
            setOpenGroup(openGroup === g.position ? null : g.position);
          }}
          className={`flex w-full items-center gap-2 px-2 py-1 text-left
                      hover:bg-amber-50 dark:hover:bg-amber-900/40
                      ${openGroup === g.position ? 'bg-amber-50 dark:bg-amber-900/40' : ''}`}
        >
          <span className="tabular-nums font-semibold shrink-0">{g.items.length}</span>
          <span className="flex-1 truncate">{g.label}</span>
          <span className="text-gray-400 shrink-0">▸</span>
        </button>
      ))}
      {active && (
        <Submenu
          group={active}
          label={label}
          onAdd={onAdd}
          onRemove={onRemove}
          onInspect={onInspect}
        />
      )}
    </div>
  );
}

/**
 * The leaf list for one position.
 *
 * Opens to the RIGHT of the parent panel when there is room and to the left
 * otherwise; both are absolute against the parent, so it follows the panel if
 * the panel was itself clamped.
 *
 * Each item shows the slots that put the entity in this position, so the
 * declaring side stays legible next to the branch label that names it.
 */
function Submenu({
  group, label, onAdd, onRemove, onInspect,
}: {
  group: RelationGroupVM;
  label: string;
} & Pick<RelationMenuProps, 'onAdd' | 'onRemove' | 'onInspect'>) {
  const ref = useRef<HTMLDivElement>(null);
  const [flip, setFlip] = useState(false);
  /** Set only when the panel fits on neither side; see the effect below. */
  const [maxW, setMaxW] = useState<number | undefined>(undefined);

  /*
   * The flip is decided from the PARENT's right edge plus this panel's own
   * width — never from this panel's measured position.
   *
   * Measuring our own `right` was self-referential and produced a menu that
   * hung off the viewport (Siggie, 2026-08-27, screenshot of ObservationSet).
   * The effect re-runs on `group.position`, so switching branches measured the
   * panel while the PREVIOUS branch's flip was still applied: sitting on the
   * left it is comfortably inside the viewport, so the test said "no flip
   * needed", `flip` went false, and the panel jumped right and overflowed —
   * with nothing left to trigger another measurement. Parent geometry and our
   * own width are both independent of `flip`, so this cannot oscillate.
   *
   * Covered by RelationMenuPlacement.test.tsx. If you change WHICH properties
   * are read here, update that file's stubs to match — jsdom returns zeroes
   * for anything unstubbed, so the tests would keep passing while measuring
   * nothing. See docs/TESTING.md, "Testing code that measures layout".
   */
  useLayoutEffect(() => {
    const el = ref.current;
    const parent = el?.offsetParent as HTMLElement | null;
    if (!el || !parent) return;
    const p = parent.getBoundingClientRect();
    const w = el.offsetWidth;
    const M = 4;
    // Room on the right is the test; falling back to the left only helps if
    // there is actually room there.
    const right = window.innerWidth - M - p.right;
    const left = p.left - M;
    if (w <= right) {          // fits on the right: the preferred side
      setFlip(false); setMaxW(undefined);
    } else if (w <= left) {    // only the left fits
      setFlip(true); setMaxW(undefined);
    } else {
      // Neither gutter fits — a narrow window, or a box near the middle of
      // one. Take the roomier side and CAP the width to it rather than
      // overflowing the viewport; the list scrolls and long names truncate.
      setFlip(left > right);
      setMaxW(Math.max(Math.max(left, right), MIN_SUBMENU_W));
    }
  }, [group.position]);

  return (
    <div
      ref={ref}
      data-relation-menu
      data-relation-submenu={group.position}
      style={maxW === undefined ? undefined : { maxWidth: maxW, minWidth: 0 }}
      className={`absolute top-0 max-h-[60vh] min-w-[14rem] overflow-y-auto rounded border shadow-lg
                  border-gray-300 dark:border-slate-600
                  bg-white dark:bg-slate-800
                  ${flip ? 'right-full mr-0.5' : 'left-full ml-0.5'}`}
    >
      <div className="sticky top-0 px-2 py-1 border-b text-[9px]
                      border-gray-200 dark:border-slate-600
                      bg-white dark:bg-slate-800
                      text-gray-500 dark:text-gray-400">
        {group.items.length} {group.label}
      </div>
      {group.items.map(item => (
        <div
          key={item.other}
          data-relation-item={item.other}
          data-relation-drawn={item.drawn ? '' : undefined}
          className="flex items-center gap-1 px-2 py-0.5 hover:bg-amber-50 dark:hover:bg-amber-900/40"
        >
          <button
            title={item.drawn
              ? `${item.other} is on the diagram — click to remove it`
              : `Add ${item.other} to the diagram (${group.label} ${label})`}
            onClick={ev => {
              ev.stopPropagation();
              if (item.drawn) onRemove(item.other); else onAdd(item.other);
            }}
            /* Drawn items are DIMMED, not struck through: strikethrough reads
               as "deleted / unavailable", and these are the live ones (Siggie,
               2026-08-27: "gray out but don't strikeout"). */
            className={`flex-1 min-w-0 text-left ${item.drawn
              ? 'text-gray-400 dark:text-gray-500'
              : 'text-gray-800 dark:text-gray-100'}`}
          >
            <span className="block truncate">{item.other}</span>
            <span className="block truncate text-[9px] text-gray-400 dark:text-gray-500">
              {item.slots.join(', ')}
            </span>
          </button>
          {/* Removing is the non-obvious half of the toggle, so a drawn item
              gets an explicit ✕ as well as the struck-through label. */}
          {item.drawn && (
            <button
              data-relation-remove={item.other}
              title={`Remove ${item.other} from the diagram`}
              onClick={ev => { ev.stopPropagation(); onRemove(item.other); }}
              className="text-[10px] leading-none px-1 rounded text-gray-400 shrink-0
                         hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/40"
            >
              ✕
            </button>
          )}
          {onInspect && (
            <button
              title={`Open ${item.other}'s details`}
              onClick={ev => { ev.stopPropagation(); onInspect(item.other); }}
              className="text-[10px] leading-none px-1 rounded text-gray-400 shrink-0
                         hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-900/40"
            >
              ⓘ
            </button>
          )}
        </div>
      ))}
      {/* The count is visible BEFORE the click, which is the point: "add all"
          used to hide its cost. On Participant that reads "add all 21".
          Suppressed when only ONE item is addable — there "add all 1" is a
          second control that does exactly what the item above it does. */}
      {group.items.filter(i => !i.drawn).length > 1 && (
        <button
          data-relation-add-all={group.position}
          onClick={ev => {
            ev.stopPropagation();
            group.items.filter(i => !i.drawn).forEach(i => onAdd(i.other));
          }}
          className="w-full px-2 py-1 border-t text-left text-[9px] underline
                     border-gray-200 dark:border-slate-600
                     text-amber-800 dark:text-amber-300
                     hover:bg-amber-100 dark:hover:bg-amber-900/60"
        >
          add all {group.items.filter(i => !i.drawn).length}
        </button>
      )}
    </div>
  );
}

/**
 * Position a fixed panel at `anchor`, pulled back inside the viewport.
 *
 * Measured after mount rather than estimated: the panel's height depends on
 * how many positions the class occupies, which varies from one to five.
 */
function useClamped(anchor: Anchor) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(anchor);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const M = 6;
    setPos({
      x: Math.max(M, Math.min(anchor.x, window.innerWidth - r.width - M)),
      y: Math.max(M, Math.min(anchor.y, window.innerHeight - r.height - M)),
    });
  }, [anchor]);

  return { ref, style: { left: pos.x, top: pos.y } };
}
