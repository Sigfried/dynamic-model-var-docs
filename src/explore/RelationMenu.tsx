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
 * The trigger opens on HOVER and each group leads with "add all" / "hide all"
 * (Siggie, 2026-08-27): with nothing drawn unasked, the menu is the main way
 * to grow the canvas, so it should not cost a click to look inside one. It
 * closes on leaving the whole tree, after a grace period — see CLOSE_DELAY_MS.
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

import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { RelationGroupVM } from './OwnershipGraphView';

/**
 * Which menu is open, shared across every instance — at most one, ever.
 *
 * Open state used to be per-instance `useState` with no coordination, which
 * was survivable while opening took a CLICK (the outside-click listener closed
 * the previous one first). On HOVER it broke immediately: the listener bails
 * on any `[data-relation-menu]` subtree, so moving the pointer from one box's
 * trigger to another's left BOTH menus on screen (Siggie, screenshot
 * 2026-08-27). Hovering a trigger has to close whatever else is open, and a
 * shared subscription is what makes "at most one" structural rather than a
 * cleanup someone has to remember.
 */
const openListeners = new Set<(id: string | null) => void>();
function setOpenMenu(id: string | null) {
  cancelClose();
  for (const fn of openListeners) fn(id);
}

/**
 * Grace period before a menu the pointer has left actually closes.
 *
 * Opening stays INSTANT (Siggie, 2026-08-28: "the no-delay increases
 * discoverability") — sweeping the pointer over a box is how you find out the
 * menu is there. What was broken is the other half: there was no
 * `onMouseLeave` at all, so a pointer that merely flitted across a trigger left
 * the menu open until an outside click, Escape, or another box's trigger
 * (screenshot 2026-08-28).
 *
 * A bare close-on-leave is unusable here — the tree has real gaps in it: 2px
 * between trigger and panel, 2px between panel and submenu, and the submenu is
 * a sibling that overhangs the panel. Crossing any of those would close the
 * menu out from under a pointer that is on its way to an item. So the timer is
 * cancelled by re-entering ANY part of the tree, which is exactly the
 * `[data-relation-menu]` set the outside-click listener already uses.
 *
 * Module-level rather than per-instance for the same reason `openListeners`
 * is: moving from one box to the next has to cancel the FIRST box's pending
 * close, and that timer belongs to an instance the second one cannot reach.
 */
const CLOSE_DELAY_MS = 300;
let closeTimer: ReturnType<typeof setTimeout> | undefined;
function cancelClose() {
  if (closeTimer !== undefined) { clearTimeout(closeTimer); closeTimer = undefined; }
}
function scheduleClose() {
  cancelClose();
  closeTimer = setTimeout(() => { closeTimer = undefined; setOpenMenu(null); }, CLOSE_DELAY_MS);
}

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
  const id = useId();

  // Another instance opening closes this one. Subscribed unconditionally —
  // an instance that is currently closed still has to hear that it lost, or
  // it could never learn it had been superseded.
  useEffect(() => {
    const onOpen = (which: string | null) => {
      if (which === id) return;
      setAnchor(null);
      setOpenGroup(null);
    };
    openListeners.add(onOpen);
    return () => { openListeners.delete(onOpen); };
  }, [id]);

  // Close on any outside click or Escape. The menu lives in a portal, so an
  // outside click is anything not inside a [data-relation-menu] subtree —
  // ancestry in the DOM, not in the React tree.
  useEffect(() => {
    if (!anchor) return;
    const close = (ev: Event) => {
      const t = ev.target as HTMLElement | null;
      if (t?.closest('[data-relation-menu]')) return;
      setOpenMenu(null);
    };
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') setOpenMenu(null);
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

  /*
   * Opens on HOVER (Siggie, 2026-08-27: "open the cascading relation menus on
   * hover. click is then needed only to expand"). Click still toggles, so the
   * menu is reachable without a pointer and a stray hover can be dismissed by
   * clicking the trigger.
   */
  const open = () => {
    const r = triggerRef.current?.getBoundingClientRect();
    if (!r) return;
    // Announce FIRST: this closes every other instance, including any whose
    // menu the pointer just left.
    setOpenMenu(id);
    setAnchor({ x: r.left, y: r.bottom + 2 });
  };
  const toggle = (ev: React.MouseEvent) => {
    ev.stopPropagation();
    if (anchor) setOpenMenu(null); else open();
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
          + ` on the diagram — hover to browse them`}
        onMouseEnter={open}
        onMouseLeave={scheduleClose}
        onClick={toggle}
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
      onMouseEnter={cancelClose}
      onMouseLeave={scheduleClose}
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
  const addable = group.items.filter(i => !i.drawn);
  const drawnItems = group.items.filter(i => i.drawn);

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
      onMouseEnter={cancelClose}
      onMouseLeave={scheduleClose}
      style={maxW === undefined ? undefined : { maxWidth: maxW, minWidth: 0 }}
      className={`absolute top-0 max-h-[60vh] min-w-[14rem] overflow-y-auto rounded border shadow-lg
                  border-gray-300 dark:border-slate-600
                  bg-white dark:bg-slate-800
                  ${flip ? 'right-full mr-0.5' : 'left-full ml-0.5'}`}
    >
      <div className="sticky top-0 border-b
                      border-gray-200 dark:border-slate-600
                      bg-white dark:bg-slate-800">
        <div className="px-2 py-1 text-[9px] text-gray-500 dark:text-gray-400">
          {group.items.length} {group.label}
        </div>
        {/*
          Group-level add/hide, at the TOP of the group (Siggie, 2026-08-27).
          It used to sit at the bottom and offer only "add all".

          "hide all" removes EVERY entity in the group, including ones that
          were selected in their own right — the group control is about what is
          on the canvas, not about how each entity got there. That is the same
          premise as "add" ticking the checkbox: one record of what is drawn.

          The counts are visible before the click, which is the point: on
          Participant this reads "add all 21".
        */}
        <div className="flex items-center gap-2 px-2 pb-1 text-[9px]">
          {/* "add all 1" is a second control doing exactly what the single item
              below it does (Siggie: "no add all if count is 1"); same for
              "hide all 1". */}
          {addable.length > 1 && (
            <button
              data-relation-add-all={group.position}
              onClick={ev => { ev.stopPropagation(); addable.forEach(i => onAdd(i.other)); }}
              className="underline text-amber-800 dark:text-amber-300
                         hover:text-amber-950 dark:hover:text-amber-100"
            >
              add all {addable.length}
            </button>
          )}
          {drawnItems.length > 1 && (
            <button
              data-relation-hide-all={group.position}
              onClick={ev => { ev.stopPropagation(); drawnItems.forEach(i => onRemove(i.other)); }}
              className="underline text-gray-500 dark:text-gray-400
                         hover:text-red-600 dark:hover:text-red-400"
            >
              hide all {drawnItems.length}
            </button>
          )}
        </div>
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
              : `Add ${item.other} to the diagram and tick its checkbox`
                + ` (${group.label} ${label})`}
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
