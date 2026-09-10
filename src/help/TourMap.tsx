/**
 * TourMap — the outline of a tour (or of every tour), as a floating panel.
 *
 * **The problem it fixes.** Siggie, 2026-09-08, on tour 1 having grown to ten
 * beats in one step: *"the user is not going to have any real sense of where
 * they are in it or what's coming up"*. And separately, that tours are *"sort
 * of hidden behind the Guided tours button"*.
 *
 * Those are the same data at two zoom levels, so this is one component with a
 * `scope`:
 *
 *  - `scope: 'tour'` — the running tour's steps, opened from the ⊞ beside the
 *    popover's counter. Clicking a step jumps to it.
 *  - `scope: 'all'` — every tour with its steps, opened from the chooser's
 *    **Overview** row. Clicking a step starts that tour and jumps.
 *
 * **Why a panel and not an expansion of the popover.** It was drafted as a
 * collapsible outline inside the popover; Siggie: *"if it's hanging off the
 * popover it's going to be cramped and awkward"*. An outline of a
 * twenty-position tour is not a thing to nest inside a card that is itself
 * trying to point at something.
 *
 * **Why the ⊞ is on the counter line and not its own line.** Also Siggie:
 * *"i don't think it needs its own line"*. It sits with the position readout
 * because that is what it is a bigger version of.
 *
 * ⚠️ This is a THIRD floating overlay, beside the legend and the example
 * cases, and it inherits their unfixed problem — see BACKLOG § "Overlays: one
 * model, draggable and resizable". It does not make that worse, but it does
 * make it one instance more expensive to keep ignoring.
 *
 * ⚠️ It is also the only one of the three in the TOP LAYER, because it is the
 * only one that has to sit above the step popover. Any future "one overlay
 * model" has to account for that: a z-index scheme covering the legend and the
 * example cases cannot place this one, since no z-index outranks the top
 * layer. See the `showPopover` effect below.
 *
 * It lives in `src/help/` rather than beside the app's panels because a tour
 * outline is a fact about TOURS, which is this package's subject. It knows
 * nothing about BDCHM and would move with the package.
 */

import { useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useHelp } from './helpContext';
import { tourPositions } from './parseHelpContent';

export interface TourMapProps {
  /** One tour's steps, or every tour's. */
  scope: 'tour' | 'all';
  onClose: () => void;
}

/** One row: a step, with the position index that reaches it. */
interface Row {
  /** Index into the tour's own positions. */
  index: number;
  step: number;
  title: string;
  beatCount: number;
}

/**
 * The STEPS of a tour, not its positions.
 *
 * `positions` is beat-level — a ten-beat step is eleven positions — so a map
 * built from it would list one step eleven times. A row is a step's FIRST
 * position, which is also exactly where a jump should land: arriving at a step
 * mid-reveal would show a description the viewer has not read yet with three
 * beats already under it.
 *
 * ⚠️ **Take the first position per step, not `beatIndex === -1`.** Only a step
 * WITH beats has an opening position at -1; a beatless step has exactly one
 * position and it is numbered 0. Filtering on -1 therefore drops every
 * beatless step from the map — silently, since the remaining rows all look
 * right. Caught by `tourMap.test.ts`, which is why its fixture deliberately
 * mixes a step that has beats with one that does not.
 */
function rowsFor(positions: ReturnType<typeof tourPositions>): Row[] {
  const seen = new Set<number>();
  return positions
    .map((p, index) => ({ p, index }))
    .filter(({ p }) => {
      if (seen.has(p.step)) return false;
      seen.add(p.step);
      return true;
    })
    .map(({ p, index }) => ({
      index,
      step: p.step,
      title: p.entry.title,
      beatCount: p.beatCount,
    }));
}

export default function TourMap({ scope, onClose }: TourMapProps) {
  const {
    content, tours, tourMeta, tourName, tourIndex, positions, position,
    goToStep, startTour,
  } = useHelp();

  /*
   * Escape closes the MAP, and only the map. Capture phase on window, and
   * the event is stopped, because the provider's Escape handler is a capture
   * listener on document that ends the whole tour and stops propagation
   * itself. Registered as a plain bubble listener (until 2026-09-10) this
   * never ran: Escape closed the tour and the map together, and `mapOpen`
   * in the layer stayed true, so the next tour opened with the map already
   * up. Siggie: *"ESC should close the map, 2nd ESC close the tour."*
   * Window capture is the one phase that runs before document capture.
   */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      e.stopPropagation();
      e.preventDefault();
      onClose();
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [onClose]);

  /*
   * The map has to be in the TOP LAYER, not merely at a high z-index.
   *
   * The step popover is `popover="manual"` and calls `showPopover()`, which
   * promotes it to the browser's top layer -- above every z-index there is.
   * So the map's `z-index: 2147483646`, commented "under the popover, over the
   * app", could not do the first half of that job: opening the outline from
   * the ⊞ drew it BEHIND the popover it was launched from (Siggie,
   * 2026-09-08, from a screenshot). No z-index value can win against the top
   * layer; the map has to join it.
   *
   * Within the top layer, elements stack in ORDER OF PROMOTION -- last shown
   * is on top. The map is always opened while the popover is already showing,
   * so it lands above it, which is what we want. It is `manual` rather than
   * `auto` for the same reason the popover is: `auto` popovers close each
   * other via light dismiss, so an `auto` map would hide the very popover it
   * is an outline of.
   */
  const backdropRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = backdropRef.current;
    // Feature-detected: jsdom implements no part of the Popover API, and a
    // browser without it still renders the map correctly on the z-index above
    // -- just underneath the step popover, which is the bug this fixes and not
    // a crash. Calling it unguarded took all twelve tourMap tests down.
    if (!el || typeof el.showPopover !== 'function') return;
    el.showPopover();
    return () => { if (el.matches(':popover-open')) el.hidePopover(); };
  }, []);

  /*
   * In `all` scope every tour's rows are computed from the CONTENT, not from
   * `positions` — `positions` holds only the running tour, and the overview
   * has to describe tours that are not running (usually all of them, since it
   * is reachable before any tour starts).
   */
  const allRows = useMemo(
    () => (scope === 'all'
      ? tours.map(name => ({ name, rows: rowsFor(tourPositions(content, name)) }))
      : []),
    [scope, tours, content],
  );

  const here = position?.step;

  /*
   * The tour actually RUNNING, which is not the same question as `tourName`.
   *
   * `tourName` is the last tour started; `tourIndex === null` means none is
   * running now. Reading the name alone sent a click on a finished tour's
   * step down the "already running, just jump" path and into a `goToStep`
   * that no-ops on a null index -- the map closed and nothing started
   * (Siggie, 2026-09-08). `endTour` clears the name now, so this is belt and
   * braces; it is kept because the failure is silent and the check is free.
   */
  const running = tourIndex === null ? undefined : tourName;

  const stepButton = (r: Row, current: boolean, onClick: () => void) => (
    <button
      key={r.index}
      onClick={onClick}
      aria-current={current ? 'step' : undefined}
      className={`help-map-step${current ? ' help-map-step-here' : ''}`}
    >
      <span className="help-map-num">{r.step}</span>
      <span className="help-map-title">{r.title}</span>
      {/* How many screens this step runs to. A step with several is the
          thing that makes a tour feel longer than its step count suggests,
          so the number is the honest warning.

          "beats" is AUTHORING vocabulary (it is the content file's field
          name) and does not belong in front of a viewer -- Siggie,
          2026-09-08: "don't use the term 'beats' in the title text". */}
      {r.beatCount > 0 && (
        <span
          className="help-map-beats"
          title={`${r.beatCount + 1} screens in this step`}
        >
          {r.beatCount + 1}
        </span>
      )}
    </button>
  );

  /*
   * Portalled to `document.body`, and NOT rendered where it is called from.
   *
   * The chooser mounts this from inside its own `[data-tour-chooser]` span,
   * which carries `onMouseEnter` to open the menu and is what its
   * click-outside handler treats as "inside". As a child, the map therefore
   * REOPENED the menu on hover and kept it open on click — both reported by
   * Siggie, 2026-09-08, from a screenshot. A fixed-position panel has no
   * business being a descendant of the button that opened it.
   */
  return createPortal(
    <div
      ref={backdropRef}
      popover="manual"
      className="help-map-backdrop"
      onMouseDown={onClose}
    >
      <div
        role="dialog"
        aria-label={scope === 'all' ? 'All tours' : 'Tour outline'}
        className="help-map"
        /* The backdrop closes on mousedown; the panel must not, or every click
           inside it would close the thing being clicked. */
        onMouseDown={e => e.stopPropagation()}
      >
        <div className="help-map-head">
          <div>
            <h2>{scope === 'all' ? 'Tours' : (running ?? 'This tour')}</h2>
            <p>
              {scope === 'all'
                ? 'Every guided walk, and what is in it. Click any step to start there.'
                : 'Click any step to jump to it.'}
            </p>
          </div>
          <button onClick={onClose} title="Close (Esc)" className="help-map-close">✕</button>
        </div>

        <div className="help-map-body">
          {scope === 'tour'
            ? rowsFor(positions).map(r => stepButton(
              r,
              r.step === here,
              () => { goToStep(r.index); onClose(); },
            ))
            : allRows.map(({ name, rows }) => (
              <section key={name} className="help-map-tour">
                <button
                  className="help-map-tourname"
                  onClick={() => { startTour(name); onClose(); }}
                >
                  {name}
                </button>
                {tourMeta.get(name)?.description && (
                  <p className="help-map-blurb">{tourMeta.get(name)!.description}</p>
                )}
                {rows.map(r => stepButton(
                  r,
                  running === name && r.step === here,
                  /*
                   * A tour already running is a JUMP -- no restart, which
                   * would throw away the frames the viewer walked in. Any
                   * other tour is started AT the step, in one call.
                   *
                   * That second argument exists because doing it in two here
                   * did not work: `startTour(name)` then
                   * `requestAnimationFrame(() => goToStep(i))` deferred into a
                   * closure holding the PRE-start `goToStep`, whose
                   * `tourIndex` was still null, so the jump hit that guard and
                   * vanished. The provider settles both moves against the same
                   * freshly computed positions instead.
                   */
                  () => {
                    if (running === name) goToStep(r.index);
                    else startTour(name, r.index);
                    onClose();
                  },
                ))}
              </section>
            ))}
        </div>
      </div>
    </div>,
    document.body,
  );
}
