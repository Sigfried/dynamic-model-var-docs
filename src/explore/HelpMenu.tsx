/**
 * HelpMenu — the header's cascading Help menu.
 *
 * Replaces the `example cases` header link and the two-tab pane behind it
 * (NEXT_SESSION_EDGE_DISPLAY §2.2). Those tabs put the ownership legend and the
 * example cases side by side as peers, which they are not: the legend is a
 * permanent feature deriving every slot classification live from the
 * classifier, and the cases are a working set that keeps shrinking. Tabbing
 * them together said otherwise.
 *
 * The menu is what a lost reader opens, so the three things they might want —
 * the tour, the legend, an example — are one hover apart. The legend and the
 * cases open as INDEPENDENT panels: either can be closed without the other,
 * which is the concrete thing the tabs made impossible.
 *
 * Help-content sections are surfaced through `showEntry`, the same call help
 * mode used to make. Help MODE stays off (HELP_MODE_ENABLED) — this reaches
 * individual entries without reinstating the mode around them.
 *
 * Hover-to-open with a close grace period, matching RelationBar's popovers.
 * The two do not share code: RelationBar portals out of a zoom/pan transform
 * and coordinates "at most one open" across dozens of instances. This one is a
 * singleton in normal document flow, and inheriting that machinery would cost
 * more than the ~40 lines it saves.
 */

import { useEffect, useRef, useState } from 'react';
import { useHelp } from '../help/helpContext';

/** Matches RelationBar's CLOSE_DELAY_MS: the pointer has to cross a gap
 *  between trigger and panel, and between panel and submenu. */
const CLOSE_DELAY_MS = 300;

export interface HelpMenuProps {
  /** Open the ownership legend panel. */
  onOpenLegend: () => void;
  /** Open the example-cases panel. */
  onOpenCases: () => void;
  /** Whether each panel is already showing, so the item can say "close". */
  legendOpen: boolean;
  casesOpen: boolean;
}

/**
 * Help-content sections offered in the menu.
 *
 * Ids are `### ` entry ids in help-content.md. Kept to entries that stand on
 * their own out of tour order — a step whose text says "now click the checkbox"
 * is meaningless here.
 */
const HELP_ENTRIES: ReadonlyArray<{ id: string; label: string }> = [
  { id: 'graph-canvas-reading', label: 'Reading the diagram' },
  { id: 'relation-bar', label: 'The relation bar' },
  { id: 'toolbar-siblings', label: 'Inheritance and merged boxes' },
  { id: 'copy-link', label: 'Sharing what you see' },
];

export default function HelpMenu({
  onOpenLegend, onOpenCases, legendOpen, casesOpen,
}: HelpMenuProps) {
  const { startTour, showEntry } = useHelp();
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const cancelClose = () => {
    if (closeTimer.current !== undefined) {
      clearTimeout(closeTimer.current);
      closeTimer.current = undefined;
    }
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  };
  useEffect(() => cancelClose, []);

  // Escape closes, and so does a click anywhere outside the tree. Capture
  // phase for the same reason RelationBar uses it: the canvas stops
  // propagation on its own handlers.
  useEffect(() => {
    if (!open) return;
    const onDown = (ev: Event) => {
      const t = ev.target as HTMLElement | null;
      if (t?.closest('[data-help-menu]')) return;
      setOpen(false);
    };
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown, true);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown, true);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  /** Every item closes the menu: each one either opens a panel, starts the
   *  tour, or shows a popover, and none of them is a thing you do twice. */
  const pick = (fn: () => void) => () => { setOpen(false); fn(); };

  return (
    <span
      data-help-menu
      data-help-id="help-menu"
      className="relative"
      onMouseEnter={() => { cancelClose(); setOpen(true); }}
      onMouseLeave={scheduleClose}
    >
      <button
        onClick={() => setOpen(v => !v)}
        title="Legend, example cases and help topics"
        className={`text-sm underline hover:text-white ${open ? 'text-white' : 'text-blue-100'}`}
      >
        Help <span aria-hidden className="opacity-70">▾</span>
      </button>
      {open && (
        <div
          className="absolute right-0 top-full mt-1 z-40 w-60 py-1
                     rounded-md border border-gray-300 dark:border-slate-600
                     bg-white dark:bg-slate-800 shadow-xl
                     text-gray-900 dark:text-gray-100"
        >
          <MenuItem onClick={pick(startTour)}>
            Take the tour
            <Hint>a short guided walk</Hint>
          </MenuItem>

          <Separator />

          <MenuItem onClick={pick(onOpenLegend)}>
            {legendOpen ? 'Hide ownership legend' : 'Ownership legend'}
            <Hint>every relationship in the schema, by rule</Hint>
          </MenuItem>
          <MenuItem onClick={pick(onOpenCases)}>
            {casesOpen ? 'Hide example cases' : 'Example cases'}
            <Hint>selections worth looking at</Hint>
          </MenuItem>

          <Separator />

          {HELP_ENTRIES.map(e => (
            <MenuItem key={e.id} onClick={pick(() => showEntry(e.id))}>
              {e.label}
            </MenuItem>
          ))}
        </div>
      )}
    </span>
  );
}

function MenuItem({ onClick, children }: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="block w-full text-left px-3 py-1.5 text-xs
                 hover:bg-gray-100 dark:hover:bg-slate-700"
    >
      {children}
    </button>
  );
}

/** Second line on an item, for the ones whose name does not say what they do. */
function Hint({ children }: { children: React.ReactNode }) {
  return (
    <span className="block text-[10px] text-gray-400 dark:text-gray-500">
      {children}
    </span>
  );
}

function Separator() {
  return <div className="my-1 border-t border-gray-200 dark:border-slate-700" />;
}
