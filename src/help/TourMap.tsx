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
 * popover it's going to be cramped and awkward"*. The popover is already
 * short of room — `EST_H` mis-clamps tall ones (docs/TASKS.md item 8) — and an
 * outline of a twenty-position tour is not a thing to nest inside a card that
 * is itself trying to point at something.
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
 * It lives in `src/help/` rather than beside the app's panels because a tour
 * outline is a fact about TOURS, which is this package's subject. It knows
 * nothing about BDCHM and would move with the package.
 */

import { useEffect, useMemo } from 'react';
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
    content, tours, tourMeta, tourName, positions, position, goToStep, startTour,
  } = useHelp();

  // Escape closes, matching every other panel and the popover itself.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

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

  const stepButton = (r: Row, current: boolean, onClick: () => void) => (
    <button
      key={r.index}
      onClick={onClick}
      aria-current={current ? 'step' : undefined}
      className={`help-map-step${current ? ' help-map-step-here' : ''}`}
    >
      <span className="help-map-num">{r.step}</span>
      <span className="help-map-title">{r.title}</span>
      {/* Beats are what makes a step long, so the count is the honest warning
          that this row is not one screenful. Hidden when there are none. */}
      {r.beatCount > 0 && (
        <span className="help-map-beats" title={`${r.beatCount} beats`}>
          {r.beatCount}
        </span>
      )}
    </button>
  );

  return (
    <div
      role="dialog"
      aria-label={scope === 'all' ? 'All tours' : 'Tour outline'}
      className="help-map"
    >
      <div className="help-map-head">
        <div>
          <h2>{scope === 'all' ? 'Tours' : (tourName ?? 'This tour')}</h2>
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
                name === tourName && r.step === here,
                /*
                 * Starting a tour and then jumping is two moves, not one:
                 * `startTour` computes its own first position (it cannot go
                 * through `goTo`, whose `positions` memo still holds the
                 * OUTGOING tour — see HelpProvider), so a jump issued in the
                 * same tick would read that stale list too. Deferring to the
                 * next frame lets the memo settle.
                 *
                 * Already running: no restart, just the jump — restarting
                 * would throw away the frames the viewer walked in.
                 */
                () => {
                  if (name === tourName) goToStep(r.index);
                  else {
                    startTour(name);
                    if (r.index > 0) requestAnimationFrame(() => goToStep(r.index));
                  }
                  onClose();
                },
              ))}
            </section>
          ))}
      </div>
    </div>
  );
}
