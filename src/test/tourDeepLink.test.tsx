/**
 * `startTour(name, at)` — starting a tour AT a step, and what `endTour` clears.
 *
 * Both pin bugs Siggie hit in the browser on 2026-09-08, and both are of the
 * same shape: **state that outlives the thing it describes**, read by a new
 * caller that had every reason to trust it.
 *
 *  - `tourName` survived `endTour`, so "which tour is running" answered a tour
 *    that had finished. Harmless while the popover was the only reader; the
 *    tour map reads it to choose between starting and jumping, and a stale
 *    name sent every click down the jump path into a guard that returns.
 *  - Deep-linking was `startTour(name)` followed by a deferred `goToStep(i)`.
 *    The deferred closure held the PRE-start `goToStep`, whose `tourIndex` was
 *    still null — so the jump hit that guard and vanished, silently.
 *
 * Tested against the provider rather than the map, because the map's own tests
 * stub `startTour` and so cannot see what it actually does.
 */

import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HelpProvider } from '../help/HelpProvider';
import { useHelp } from '../help/helpContext';

/** Three steps, the first with two beats, so positions and steps differ. */
const MD = `
## Demo
- **TourMetadata:**
- **Description:** A demo tour

### first
- **Title:** First
- **Tour:** Demo
- **Description:** Opening.
- **Change:** sel=Person
- **Action:** Drew Person.
- **Beats:**
  1. one
     - Description: Beat one.
  2. two
     - Description: Beat two.

### second
- **Title:** Second
- **Tour:** Demo
- **Description:** Second.
- **Change:** sel=Visit
- **Action:** Drew Visit.

### third
- **Title:** Third
- **Tour:** Demo
- **Description:** Third.
`;

/** Reports the live tour state, and exposes the calls the test needs. */
function Probe() {
  const { startTour, endTour, tourName, tourIndex, position } = useHelp();
  return (
    <div>
      <span data-name>{tourName ?? '(none)'}</span>
      <span data-index>{tourIndex === null ? '(null)' : String(tourIndex)}</span>
      <span data-title>{position?.entry.title ?? '(none)'}</span>
      <button onClick={() => startTour('Demo')}>start</button>
      <button onClick={() => startTour()}>start default</button>
      <button onClick={() => startTour('Demo', 3)}>start at 3</button>
      <button onClick={() => startTour('Demo', 99)}>start out of range</button>
      <button onClick={endTour}>end</button>
    </div>
  );
}

const read = (attr: string) =>
  document.querySelector(`[data-${attr}]`)!.textContent;

function setup() {
  const onJumpChanges = vi.fn();
  const onPushChange = vi.fn();
  render(
    <HelpProvider markdown={MD} onPushChange={onPushChange} onJumpChanges={onJumpChanges}>
      <Probe />
    </HelpProvider>,
  );
  return { onJumpChanges, onPushChange };
}

const click = (label: string) =>
  fireEvent.click(screen.getByRole('button', { name: label }));

describe('startTour with a position', () => {
  test('opens on that position, not the first', () => {
    // Position 3 is step 2's opening ("Second"): step 1 contributes an opening
    // plus its two beats. Landing on step 1 is exactly the silent failure the
    // deferred-goToStep version produced.
    setup();
    click('start at 3');
    expect(read('index')).toBe('3');
    expect(read('title')).toBe('Second');
  });

  test('replays every change up to it, in ONE host update', () => {
    /*
     * A step's canvas is what the steps before it built, so a deep link cannot
     * push only the target's own change — and a step whose `Change:` is absent
     * inherits entirely. One call, so the canvas does not churn through the
     * intermediate selections.
     */
    const { onJumpChanges, onPushChange } = setup();
    click('start at 3');
    expect(onJumpChanges).toHaveBeenCalledTimes(1);
    const [changes, pops] = onJumpChanges.mock.calls[0];
    expect(pops).toBe(0);
    expect(changes.map((c: { query: string }) => c.query)).toEqual(['sel=Person', 'sel=Visit']);
    expect(onPushChange).not.toHaveBeenCalled();
  });

  test('still opens normally with no position given', () => {
    const { onJumpChanges, onPushChange } = setup();
    click('start');
    expect(read('index')).toBe('0');
    expect(read('title')).toBe('First');
    // The opening step is a plain push; there is nothing to replay.
    expect(onJumpChanges).not.toHaveBeenCalled();
    expect(onPushChange).toHaveBeenCalledWith('sel=Person', undefined);
  });

  test('an out-of-range position starts the tour rather than nothing', () => {
    // A stale deep link is still a request to take this tour.
    setup();
    click('start out of range');
    expect(read('index')).not.toBe('(null)');
    expect(read('title')).toBe('Third');
  });

  test('startTour() with no name names the first tour', () => {
    /*
     * `?tour=` arrives with no name (and `?` did too, until it started opening
     * the Overview instead). The steps always came out right, because the
     * parser falls back to the first tour, but `tourName` stayed undefined for
     * the whole run and the label above the popover title went missing
     * (2026-09-10). The default has to be resolved into the state, not left
     * implicit.
     */
    setup();
    click('start default');
    expect(read('index')).toBe('0');
    expect(read('name')).toBe('Demo');
  });
});

describe('endTour', () => {
  test('clears the tour NAME, not just the index', () => {
    /*
     * The dead-click: Siggie, *"clicking a step just dismisses the overview
     * map but brings up no tour"*. `tourName` outlived every exit, so the map
     * read a finished tour as the running one.
     */
    setup();
    click('start');
    expect(read('name')).toBe('Demo');
    click('end');
    expect(read('index')).toBe('(null)');
    expect(read('name')).toBe('(none)');
  });
});
