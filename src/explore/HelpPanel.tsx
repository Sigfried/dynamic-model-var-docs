/**
 * HelpPanel — the floating shell the ownership legend and the example cases
 * each open into.
 *
 * Extracted when the two-tab pane was split (NEXT_SESSION_EDGE_DISPLAY §2.2).
 * They are separate panels now precisely so either can be closed without the
 * other, but they still want identical chrome, and two copies of a sticky
 * header with a close button is how they start to drift.
 *
 * `offset` staggers a second open panel so it does not land exactly on the
 * first. Not a window manager — the panels are not draggable, and two is the
 * most that can be open.
 */

import { useEffect, type ReactNode } from 'react';

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
  // Escape closes, matching the drawer and the menu that opened this.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className={`absolute top-14 z-30 w-[26rem] max-h-[80vh] overflow-y-auto
                  rounded-lg border border-gray-300 dark:border-slate-600
                  bg-white dark:bg-slate-800 shadow-xl
                  text-gray-900 dark:text-gray-100
                  ${offset ? 'right-[27rem]' : 'right-4'}`}
    >
      <div className="sticky top-0 flex items-baseline justify-between gap-2 px-4 py-2
                      border-b border-gray-200 dark:border-slate-700
                      bg-white dark:bg-slate-800">
        <div>
          <h2 className="text-sm font-semibold">{title}</h2>
          {subtitle && (
            <p className="text-[11px] text-gray-500 dark:text-gray-400">{subtitle}</p>
          )}
        </div>
        <button
          onClick={onClose}
          title="Close (Esc)"
          className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-lg leading-none"
        >
          ×
        </button>
      </div>
      <div className="px-4 py-2">{children}</div>
    </div>
  );
}
