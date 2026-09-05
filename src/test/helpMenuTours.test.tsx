/**
 * The Help menu's Tours submenu (docs/tasks.md item 2).
 *
 * Two things are being pinned, and only the first is about the menu:
 *
 *  1. The submenu lists EVERY tour the content file declares, and picking one
 *     starts THAT tour.
 *  2. `startTour` is reached with the tour's name. Before 2026-09-05 it took no
 *     argument and the provider navigated `tourPositions(content)` with no
 *     name, so only the first tour in the file could ever run — a second tour
 *     parsed cleanly, passed every content test, and was unreachable. A test
 *     that only checked the menu rendered five items would not have caught it.
 */

import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import HelpMenu from '../explore/HelpMenu';
import { HelpContext, type HelpApi } from '../help/helpContext';
import { parseHelpContent } from '../help/parseHelpContent';

/** A help API with only the parts HelpMenu touches; the rest throw if used. */
function api(over: Partial<HelpApi>): HelpApi {
  return {
    helpMode: false,
    toggleHelpMode: () => {},
    exitHelpMode: () => {},
    tourIndex: null,
    startTour: () => {},
    endTour: () => {},
    tours: [],
    tourName: undefined,
    nextStep: () => {},
    prevStep: () => {},
    positions: [],
    position: undefined,
    stepCount: 0,
    content: parseHelpContent(''),
    activeId: null,
    showEntry: () => {},
    dismissEntry: () => {},
    resolveAnchor: () => null,
    centerRect: () => null,
    ...over,
  };
}

function mount(over: Partial<HelpApi>) {
  render(
    <HelpContext.Provider value={api(over)}>
      <HelpMenu
        onOpenLegend={() => {}}
        onOpenCases={() => {}}
        legendOpen={false}
        casesOpen={false}
      />
    </HelpContext.Provider>,
  );
  fireEvent.click(screen.getByRole('button', { name: /^help/i }));
}

/*
 * The planned five. `Reading the diagram` is spelled here as the tour name it
 * will have; note it COLLIDES by accessible name with the `graph-canvas-reading`
 * help entry lower in the same menu, which is why the assertions below scope to
 * the submenu rather than searching the whole tree. Worth knowing before
 * authoring: two menu items reading identically is a real thing a user meets,
 * not a test artefact.
 */
const TOURS = [
  'What BDCHM covers', 'Getting oriented', 'Reading the diagram',
  'Ownership', 'Inheritance',
];

/** The open submenu, so a tour name is not confused with a help entry. */
const submenu = () => screen.getByRole('button', { name: /^tours/i })
  .parentElement!.querySelector('div')!;

describe('Help ▾ → Tours', () => {
  test('every tour the content declares is listed, in order', () => {
    mount({ tours: TOURS });
    fireEvent.click(screen.getByRole('button', { name: /^tours/i }));
    const items = [...submenu().querySelectorAll('button')].map(b => b.textContent);
    expect(items).toEqual(TOURS);
  });

  test('picking one starts THAT tour, by name', () => {
    // The assertion the whole change is for. `startTour()` with no argument
    // would satisfy a "does it call startTour" test and still run the wrong
    // tour — the exact bug this replaced.
    const startTour = vi.fn();
    mount({ tours: TOURS, startTour });
    fireEvent.click(screen.getByRole('button', { name: /^tours/i }));
    const item = [...submenu().querySelectorAll('button')]
      .find(b => b.textContent === 'Ownership')!;
    fireEvent.click(item);
    expect(startTour).toHaveBeenCalledWith('Ownership');
  });

  test('a single tour needs no submenu', () => {
    // A submenu in front of the only thing behind it is a hover for nothing.
    const startTour = vi.fn();
    mount({ tours: ['Walkthrough'], startTour });
    expect(screen.queryByRole('button', { name: /^tours/i })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: /take the tour/i }));
    // No name: the file's first tour, which is the only one.
    expect(startTour).toHaveBeenCalledWith();
  });

  test('the tour list is not hard-coded in the menu', () => {
    // It comes from the content file via `tourNames`, so adding a tour is an
    // edit to help-content.md and nothing else.
    mount({ tours: ['Only one thing', 'And another'] });
    fireEvent.click(screen.getByRole('button', { name: /^tours/i }));
    const items = [...submenu().querySelectorAll('button')].map(b => b.textContent);
    expect(items).toEqual(['Only one thing', 'And another']);
  });

  test('the pill is gone, so the menu is the only way in', () => {
    // Deleted with this change: two entry points to one thing drift apart, and
    // the pill could only ever start the file's first tour.
    mount({ tours: TOURS });
    expect(screen.queryByRole('button', { name: /take the tour/i })).toBeNull();
  });
});

describe('help-only entries stay reachable', () => {
  /**
   * `HELP_ENTRIES` is the ONLY door to a help-only entry: the other route was
   * help mode's `?` hints, and `HELP_MODE_ENABLED` is false, so a
   * `data-help-id` tag anchors and rings but opens nothing when clicked.
   *
   * `node-dismiss` was tagged in `OwnershipGraphView` and listed nowhere — a
   * documented entry with no way in, since help mode was switched off.
   */
  test('every contextually-tagged entry has a menu item', () => {
    const showEntry = vi.fn();
    mount({ tours: TOURS, showEntry });
    for (const label of [
      /reading the diagram/i, /relation bar/i, /merged boxes/i,
      /closing a box/i, /sharing what you see/i,
    ]) {
      expect(screen.getByRole('button', { name: label })).toBeTruthy();
    }
    fireEvent.click(screen.getByRole('button', { name: /closing a box/i }));
    expect(showEntry).toHaveBeenCalledWith('node-dismiss');
  });
});
