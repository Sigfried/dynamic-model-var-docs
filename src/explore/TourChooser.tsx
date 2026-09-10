/**
 * TourChooser — the `Guided tours` button in the header, and the popover it
 * opens listing every tour with its description.
 *
 * **Why it is not the Help menu's Tours submenu.** It was, briefly: Help ▾ →
 * Tours listed the names in a cascading submenu. Siggie, 2026-09-05: *"It's too
 * hard to get to tours now"* — two hovers deep, in a menu whose other items are
 * reference material, for the thing a first-time visitor most needs. So the
 * tours get their own button on the header line, and the menu keeps the legend,
 * the cases and the help topics.
 *
 * That is NOT the `take the tour` pill coming back. The pill was argument-less
 * and could only ever start the file's first tour, which is exactly what broke
 * once there were several. This lists them and starts the one you pick.
 *
 * **A popover rather than a menu** because each row carries a sentence of
 * description as well as a name — `TourMetadata:` in the content file — and a
 * hover menu is the wrong shape for text you are meant to read before choosing.
 */

import { useEffect, useRef, useState } from 'react';
import { useHelp } from '../help/helpContext';
import TourMap from '../help/TourMap';

export default function TourChooser() {
  const { tours, tourMeta, startTour } = useHelp();
  const [open, setOpen] = useState(false);
  /*
   * The overview panel: every tour with its steps.
   *
   * A row here rather than a step list nested under each tour, which is what
   * this was first drafted as. Siggie, 2026-09-08: *"maybe the first item
   * should be 'Overview' or something instead of the first tour, and this
   * could also bring up a popover. don't want to crowd everything under the
   * menu"*. So the chooser stays a short list of names and the detail is one
   * click away.
   */
  // Provider state, not local: `?` opens the same Overview (2026-09-10).
  const { overviewOpen: overview, setOverviewOpen: setOverview } = useHelp();
  const boxRef = useRef<HTMLDivElement>(null);

  // Escape closes, and so does a click outside. Capture phase for the same
  // reason HelpMenu uses it: the canvas stops propagation on its own handlers.
  useEffect(() => {
    if (!open) return;
    const onDown = (ev: Event) => {
      const t = ev.target as HTMLElement | null;
      if (t?.closest('[data-tour-chooser]')) return;
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

  // Nothing to choose from: no button rather than one that opens an empty box.
  if (tours.length === 0) return null;

  return (
    <span
      data-tour-chooser
      data-help-id="tour-chooser"
      className="relative"
      /*
       * Opens on HOVER as well as click. Siggie, 2026-09-08: the tours are
       * "already hard to get to; at bare minimum it should appear on hover,
       * not just click". Only opening — leaving does not close, or the list
       * would vanish while you were reaching for a row below the button.
       * Closing stays with the click-outside and Escape handlers.
       */
      onMouseEnter={() => setOpen(true)}
    >
      <button
        /*
         * CLICK opens the overview, not the list (TASKS 1b, Siggie 2026-09-09).
         * Hover already opens the list, so a click on the same button was a
         * second way to do the same thing; the overview -- every tour with
         * every step -- is the thing a click had no route to except through
         * the list's first row.
         */
        onClick={() => { setOpen(false); setOverview(true); }}
        title="Guided walks through the app and the model; click for the overview"
        /* A filled pill, for the reason the old `take the tour` pill was one:
           as another underlined blue link it would read as chrome among the
           four already in this header. */
        className="text-sm font-semibold px-2.5 py-1 rounded-full bg-white/95
                   text-blue-700 shadow-sm hover:bg-white hover:shadow"
      >
        Guided tours
      </button>
      {open && (
        <div
          ref={boxRef}
          role="dialog"
          aria-label="Guided tours"
          className="absolute right-0 top-full mt-1 z-40 w-80 p-1
                     rounded-md border border-gray-300 dark:border-slate-600
                     bg-white dark:bg-slate-800 shadow-xl
                     text-gray-900 dark:text-gray-100"
        >
          <p className="px-3 pt-2 pb-1 text-[11px] text-gray-500 dark:text-gray-400">
            Each one stands on its own. Leave any tour with <kbd>Esc</kbd>.
          </p>
          <button
            data-tour-overview
            onClick={() => { setOpen(false); setOverview(true); }}
            className="block w-full text-left px-3 py-2 rounded
                       hover:bg-gray-100 dark:hover:bg-slate-700"
          >
            <span className="block text-xs font-semibold">Overview</span>
            <span className="block text-[11px] text-gray-500 dark:text-gray-400">
              {/* Counted, not written: "all five" would go stale the next
                  time a tour is split. */}
              All {tours.length} tours and every step in them — start anywhere.
            </span>
          </button>
          <div className="my-1 border-t border-gray-200 dark:border-slate-700" />
          {tours.map(name => (
            <button
              key={name}
              onClick={() => { setOpen(false); startTour(name); }}
              className="block w-full text-left px-3 py-2 rounded
                         hover:bg-gray-100 dark:hover:bg-slate-700"
            >
              <span className="block text-xs font-semibold">{name}</span>
              {/* Missing metadata is not an error: the tour still runs, it
                  just has no sentence to show. */}
              {tourMeta.get(name)?.description && (
                <span className="block text-[11px] text-gray-500 dark:text-gray-400">
                  {tourMeta.get(name)!.description}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
      {overview && <TourMap scope="all" onClose={() => setOverview(false)} />}
    </span>
  );
}
