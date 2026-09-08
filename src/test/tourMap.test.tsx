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

  test('a multi-screen step shows how many, a single-screen one shows none', () => {
    // The count is the honest warning that a row is not one screenful — the
    // thing that makes a ten-beat category step legible in the outline.
    //
    // It counts SCREENS, so a step with 2 beats reads `3`: the opening
    // position (the description alone) is one of them. "beats" is the content
    // file's field name and is deliberately not shown to a viewer — Siggie,
    // 2026-09-08. A step with no beats has one screen and shows no badge,
    // since a badge reading `1` is noise.
    renderMap('tour');
    const rows = [...document.querySelectorAll('.help-map-step')];
    expect(rows[0].querySelector('.help-map-beats')?.textContent).toBe('3');
    expect(rows[1].querySelector('.help-map-beats')).toBeNull();
  });

  test('no viewer-facing text says "beat"', () => {
    // Siggie, 2026-09-08: "don't use the term 'beats' in the title text". It
    // is the authoring format's field name; a viewer has no reason to meet it.
    // Checks `title` attributes too, which is where it actually leaked.
    renderMap('tour');
    const panel = document.querySelector('.help-map')!;
    expect(panel.textContent?.toLowerCase()).not.toContain('beat');
    for (const el of panel.querySelectorAll('[title]')) {
      expect(el.getAttribute('title')?.toLowerCase()).not.toContain('beat');
    }
  });

  test('it renders outside whatever mounted it', () => {
    /*
     * The bug Siggie hit, 2026-09-08: *"i clicked overview, overview appeared;
     * Guided tours menu disappeared; when i mouseover the overview the Guided
     * tour menu reappears. And when i click on a step, it persists."*
     *
     * The chooser mounts the map from inside its own `[data-tour-chooser]`
     * span, which carries `onMouseEnter` to open the menu and is what its
     * click-outside handler treats as "inside". As a DOM child the map
     * therefore reopened the menu on hover and kept it open on click. It is
     * portalled to `document.body` now, so mounting it from anywhere leaves
     * it outside that subtree.
     */
    const onClose = vi.fn();
    render(
      <HelpContext.Provider value={api({})}>
        <div data-mounted-here>
          <TourMap scope="tour" onClose={onClose} />
        </div>
      </HelpContext.Provider>,
    );
    const panel = document.querySelector('.help-map')!;
    expect(panel).toBeTruthy();
    expect(panel.closest('[data-mounted-here]')).toBeNull();
  });

  test('clicking the backdrop closes it, clicking the panel does not', () => {
    const onClose = renderMap('tour');
    fireEvent.mouseDown(document.querySelector('.help-map')!);
    expect(onClose).not.toHaveBeenCalled();
    fireEvent.mouseDown(document.querySelector('.help-map-backdrop')!);
    expect(onClose).toHaveBeenCalled();
  });

  test('the overview scope lists every tour, from the content', () => {
    // `positions` holds only the RUNNING tour, so the overview has to compute
    // each tour's rows from `content` — otherwise a tour that is not running
    // shows a name and no steps.
    renderMap('all', { tourName: undefined, tourIndex: null, position: undefined });
    expect(screen.getByText('Demo')).toBeTruthy();
    expect(stepTitles()).toHaveLength(2);
  });

  test('the overview starts a tour that is not running, AT the clicked step', () => {
    /*
     * One call, not `startTour` then a deferred `goToStep`. That pair was the
     * first implementation and never worked: the deferred closure captured the
     * PRE-start `goToStep`, whose `tourIndex` was still null, so it returned at
     * its own guard and the jump vanished. Deep-linking to any step but the
     * first silently opened the tour at step 1.
     */
    const startTour = vi.fn();
    const goToStep = vi.fn();
    renderMap('all', {
      tourName: undefined, tourIndex: null, position: undefined, startTour, goToStep,
    });
    // Step 2's POSITION index is 3, not 1: step 1 contributes an opening
    // position plus its two beats. Same off-by-beats trap the jump test pins.
    fireEvent.click([...document.querySelectorAll('.help-map-step')][1]);
    expect(startTour).toHaveBeenCalledWith('Demo', 3);
    expect(goToStep).not.toHaveBeenCalled();
  });

  test('a FINISHED tour is restarted, not treated as still running', () => {
    /*
     * The dead-click Siggie hit, 2026-09-08: *"clicking a step just dismisses
     * the overview map but brings up no tour"*.
     *
     * `tourName` was never cleared on exit, so after running a tour and
     * leaving it, every step of THAT tour took the "already running, just
     * jump" branch -- into a `goToStep` that returns immediately on a null
     * `tourIndex`. The map closed and nothing began.
     *
     * `endTour` clears the name now; the map also derives "running" from
     * `tourIndex` rather than from the name, because the failure is silent.
     */
    const startTour = vi.fn();
    const goToStep = vi.fn();
    renderMap('all', {
      // The post-endTour state as it USED to be: index cleared, name lingering.
      tourName: 'Demo', tourIndex: null, position: undefined, startTour, goToStep,
    });
    fireEvent.click([...document.querySelectorAll('.help-map-step')][1]);
    expect(startTour).toHaveBeenCalledWith('Demo', 3);
    expect(goToStep).not.toHaveBeenCalled();
  });

  test('a step of the RUNNING tour jumps rather than restarting', () => {
    // The other side of the same branch: restarting would throw away the
    // frames the viewer already walked in.
    const startTour = vi.fn();
    const goToStep = vi.fn();
    renderMap('all', { startTour, goToStep });
    fireEvent.click([...document.querySelectorAll('.help-map-step')][1]);
    expect(goToStep).toHaveBeenCalledWith(3);
    expect(startTour).not.toHaveBeenCalled();
  });
});
