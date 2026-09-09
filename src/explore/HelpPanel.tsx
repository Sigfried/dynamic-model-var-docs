/**
 * HelpPanel — the floating shell the ownership legend and the example cases
 * each open into.
 *
 * Extracted when the two-tab pane was split (docs/archive/NEXT_SESSION_EDGE_DISPLAY.md §2.2).
 * They are separate panels now precisely so either can be closed without the
 * other, but they still want identical chrome, and two copies of a sticky
 * header with a close button is how they start to drift.
 *
 * **Draggable by its header, and resizable from its corner** (§1b of
 * docs/HELP_PACKAGE_PLAN.md). One frame serves both panels, so both got it from
 * one change — which is the reason the plan paired them. Neither position nor
 * size is remembered: reopening puts the panel back where the layout puts it.
 *
 * ⚠️ This does NOT fix the symptom that opened the overlay item — the legend
 * still COVERS the detail drawer, because the drawer is an in-flow `w-96` column
 * and making it an overlay is the layout change that item is really about. What
 * this buys is that you can drag the legend off it.
 *
 * `offset` staggers a second open panel so it does not land exactly on the
 * first. Still not a window manager: two is the most that can be open, and
 * dragging is per-open, so there is no arrangement to manage.
 */

import { useEffect, type ReactNode } from 'react';
import { useDragged } from '../help/useDragged';

export interface HelpPanelProps {
  title: string;
  /** One line under the title on what this panel is for. */
  subtitle?: string;
  onClose: () => void;
  /** Steps the panel right, so a second one does not cover the first. */
  offset?: boolean;
  children: ReactNode;
}

export default function HelpPanel({
  title, subtitle, onClose, offset, children,
}: HelpPanelProps) {
  const drag = useDragged();

  // Escape closes, matching the drawer and the menu that opened this.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const moved = drag.offset !== null;

  return (
    <div
      data-draggable=""
      /* Placement is Tailwind's until the panel is dragged, then it is `fixed`
         viewport coordinates. `absolute`/`right-*` and an explicit `left` cannot
         both drive it, so the classes go when the inline style arrives.

         `resize: both` is the free native resizer the plan wanted, and it needs
         a non-`visible` overflow to appear — which `overflow-y-auto` already
         gives. It only offers the corner grip; nothing here implements one. */
      style={{
        resize: 'both',
        ...(drag.offset ? { position: 'fixed', ...drag.offset, right: 'auto' } : {}),
      }}
      className={`z-30 w-[26rem] max-h-[80vh] overflow-y-auto
                  rounded-lg border border-gray-300 dark:border-slate-600
                  bg-white dark:bg-slate-800 shadow-xl
                  text-gray-900 dark:text-gray-100
                  ${moved ? '' : `absolute top-14 ${offset ? 'right-[27rem]' : 'right-4'}`}`}
    >
      <div
        onPointerDown={drag.onPointerDown}
        /* The whole header is the handle, close button excluded by the hook's
           `button` test. `sticky` so it stays reachable once the body scrolls —
           which also means it stays the grab point on a tall panel. */
        className="sticky top-0 flex items-baseline justify-between gap-2 px-4 py-2
                   border-b border-gray-200 dark:border-slate-700
                   bg-white dark:bg-slate-800 cursor-grab active:cursor-grabbing
                   select-none"
      >
        <div>
          <h2 className="text-sm font-semibold">{title}</h2>
          {subtitle && (
            <p className="text-[11px] text-gray-500 dark:text-gray-400">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {moved && (
            <button
              onClick={drag.reset}
              title="Put it back"
              /* Only once it has moved: an always-on reset is a control for a
                 state the panel is usually not in. */
              className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200
                         text-xs leading-none px-1"
            >
              ⤺
            </button>
          )}
          <button
            onClick={onClose}
            title="Close (Esc)"
            className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-lg leading-none"
          >
            ×
          </button>
        </div>
      </div>
      <div className="px-4 py-2">{children}</div>
    </div>
  );
}
