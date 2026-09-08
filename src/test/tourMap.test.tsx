/**
 * The tour map — the outline panel behind the ⊞ on the popover's counter line
 * and behind the chooser's `Overview` row.
 *
 * What is pinned here is the thing a reader of `TourMap.tsx` would most
 * reasonably get wrong: the map lists STEPS, but `goToStep` takes an index
 * into POSITIONS, which are beat-level. A ten-beat step is eleven positions,
 * so a map built naively off the array index jumps to the wrong place — and
 * silently, because every index is valid.
 */

import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TourMap from '../help/TourMap';
import { HelpContext, type HelpApi } from '../help/helpContext';
import { parseHelpContent, tourPositions, type TourMeta } from '../help/parseHelpContent';

/** Two steps; the first has two beats, so steps and positions cannot coincide. */
const MD = `
## Demo
- **TourMetadata:**
- **Description:** A demo tour

### first
- **Title:** The first step
- **Tour:** Demo
- **Description:** Opening text.
- **Beats:**
  1. one
     - Description: Beat one.
  2. two
     - Description: Beat two.

### second
- **Title:** The second step
- **Tour:** Demo
- **Description:** Second text.
`;

const content = parseHelpContent(MD);
const positions = tourPositions(content, 'Demo');

function api(over: Partial<HelpApi>): HelpApi {
  return {
    helpMode: false,
    toggleHelpMode: () => {},
    exitHelpMode: () => {},
    tourIndex: 0,
    startTour: () => {},
    endTour: () => {},
    tours: ['Demo'],
    tourName: 'Demo',
    tourMeta: new Map<string, TourMeta>(),
    nextStep: () => {},
    prevStep: () => {},
    goToStep: () => {},
    positions,
    position: positions[0],
    stepCount: 2,
    content,
    activeId: 'first',
    showEntry: () => {},
    dismissEntry: () => {},
    resolveAnchor: () => null,
    centerRect: () => null,
    showAddresses: false,
    toggleAddresses: () => {},
    setTextResolvers: () => {},
    ...over,
  };
}

const renderMap = (scope: 'tour' | 'all', over: Partial<HelpApi> = {}) => {
  const onClose = vi.fn();
  render(
    <HelpContext.Provider value={api(over)}>
      <TourMap scope={scope} onClose={onClose} />
    </HelpContext.Provider>,
  );
  return onClose;
};

/** The step rows, by their visible title. */
const stepTitles = () =>
  [...document.querySelectorAll('.help-map-step')].map(b => b.textContent ?? '');

describe('the tour map', () => {
  test('lists one row per STEP, not one per beat', () => {
    // The tour is 2 steps and 4 positions (opening + 2 beats, then opening).
    // A map off `positions` directly would show four rows, three of them the
    // same step.
    expect(positions).toHaveLength(4);
    renderMap('tour');
    expect(stepTitles()).toHaveLength(2);
    expect(stepTitles()[0]).toContain('The first step');
    expect(stepTitles()[1]).toContain('The second step');
  });

  test('a step row jumps to that step\'s OPENING position', () => {
    // The assertion the whole file is for. Step 2 is position 3, not position
    // 1 — an off-by-beats bug lands mid-reveal on step 1 and looks plausible.
    const goToStep = vi.fn();
    renderMap('tour', { goToStep });
    fireEvent.click([...document.querySelectorAll('.help-map-step')][1]);
    expect(goToStep).toHaveBeenCalledWith(3);
  });

  test('clicking a step closes the map', () => {
    // It opens over the diagram it is about to change; leaving it up would
    // hide the thing the jump just drew.
    const onClose = renderMap('tour', { goToStep: () => {} });
    fireEvent.click([...document.querySelectorAll('.help-map-step')][0]);
    expect(onClose).toHaveBeenCalled();
  });

  test('the current step is marked, and only it', () => {
    renderMap('tour');
    const here = document.querySelectorAll('.help-map-step-here');
    expect(here).toHaveLength(1);
    expect(here[0].textContent).toContain('The first step');
  });

  test('a step shows its beat count, and a beatless one shows none', () => {
    // The count is the honest warning that a row is not one screenful — the
    // thing that makes a ten-beat category step legible in the outline.
    renderMap('tour');
    const rows = [...document.querySelectorAll('.help-map-step')];
    expect(rows[0].querySelector('.help-map-beats')?.textContent).toBe('2');
    expect(rows[1].querySelector('.help-map-beats')).toBeNull();
  });

  test('the overview scope lists every tour, from the content', () => {
    // `positions` holds only the RUNNING tour, so the overview has to compute
    // each tour's rows from `content` — otherwise a tour that is not running
    // shows a name and no steps.
    renderMap('all', { tourName: undefined, tourIndex: null, position: undefined });
    expect(screen.getByText('Demo')).toBeTruthy();
    expect(stepTitles()).toHaveLength(2);
  });

  test('the overview starts a tour that is not running before jumping', () => {
    const startTour = vi.fn();
    const goToStep = vi.fn();
    renderMap('all', {
      tourName: undefined, tourIndex: null, position: undefined, startTour, goToStep,
    });
    fireEvent.click([...document.querySelectorAll('.help-map-step')][0]);
    expect(startTour).toHaveBeenCalledWith('Demo');
    // Step 1 is position 0, which `startTour` already opens on — so no jump.
    expect(goToStep).not.toHaveBeenCalled();
  });
});
