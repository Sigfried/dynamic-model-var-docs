/**
 * The `Guided tours` button and its chooser popover (docs/tasks.md item 2).
 *
 * Three things are pinned, and only the first is about the widget:
 *
 *  1. The chooser lists every tour the content file declares, with the
 *     description from its `TourMetadata:` block, and picking one starts THAT
 *     tour.
 *  2. `startTour` is reached WITH THE TOUR'S NAME. Before 2026-09-05 it took no
 *     argument and the provider navigated `tourPositions(content)` with no
 *     name, so only the first tour in the file could ever run — a second tour
 *     parsed cleanly, passed every content test, and was unreachable. A test
 *     that only checked "startTour was called" would not have caught it.
 *  3. Every help-only entry still has a way in, now that the Help menu is the
 *     only route to one.
 */

import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import HelpMenu from '../explore/HelpMenu';
import TourChooser from '../explore/TourChooser';
import { HelpContext, type HelpApi } from '../help/helpContext';
import { parseHelpContent, type TourMeta } from '../help/parseHelpContent';

/** A help API with only the parts these components touch. */
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
    tourMeta: new Map<string, TourMeta>(),
    nextStep: () => {},
    prevStep: () => {},
    goToStep: () => {},
    positions: [],
    position: undefined,
    stepCount: 0,
    content: parseHelpContent(''),
    activeId: null,
    showEntry: () => {},
    dismissEntry: () => {},
    resolveAnchor: () => null,
    centerRect: () => null,
    showAddresses: false,
    toggleAddresses: () => {},
    ...over,
  };
}

const TOURS = [
  'The BioData Catalyst Harmonized Model', 'Getting oriented',
  'Ownership', 'Inheritance',
];

const META = new Map<string, TourMeta>([
  ['Ownership', { name: 'Ownership', description: 'What the arrows mean' }],
]);

/** Render the chooser and open it. */
function openChooser(over: Partial<HelpApi>) {
  render(
    <HelpContext.Provider value={api(over)}>
      <TourChooser />
    </HelpContext.Provider>,
  );
  fireEvent.click(screen.getByRole('button', { name: /guided tours/i }));
  return screen.getByRole('dialog', { name: /guided tours/i });
}

/**
 * The TOUR rows, which is what every assertion below is about.
 *
 * The chooser's first row is `Overview` — it opens the all-tours map rather
 * than starting anything, so it is chrome, not a tour, and counting it would
 * make "every tour the content declares is listed" fail on a row that
 * declares no tour.
 */
const rows = (box: HTMLElement) =>
  [...box.querySelectorAll('button:not([data-tour-overview])')]
    .map(b => b.textContent ?? '');

describe('Guided tours chooser', () => {
  test('every tour the content declares is listed, in order', () => {
    const box = openChooser({ tours: TOURS });
    expect(rows(box).map(t => t.replace(/What the arrows mean/, '').trim()))
      .toEqual(TOURS);
  });

  test('picking one starts THAT tour, by name', () => {
    // The assertion the whole change is for. `startTour()` with no argument
    // would satisfy a "was startTour called" test and still run the wrong tour.
    const startTour = vi.fn();
    const box = openChooser({ tours: TOURS, startTour });
    const item = [...box.querySelectorAll('button')]
      .find(b => b.textContent?.startsWith('Ownership'))!;
    fireEvent.click(item);
    expect(startTour).toHaveBeenCalledWith('Ownership');
  });

  test("a tour's description is shown beside its name", () => {
    // `TourMetadata:` in the content file. This is the reason the chooser is a
    // popover rather than a menu: there is a sentence to read per row.
    const box = openChooser({ tours: TOURS, tourMeta: META });
    expect(box.textContent).toContain('What the arrows mean');
  });

  test('a tour with no metadata still appears', () => {
    // Missing metadata is not an error: the tour runs, it just has no sentence.
    const startTour = vi.fn();
    const box = openChooser({ tours: TOURS, tourMeta: META, startTour });
    const item = [...box.querySelectorAll('button')]
      .find(b => b.textContent?.startsWith('Inheritance'))!;
    fireEvent.click(item);
    expect(startTour).toHaveBeenCalledWith('Inheritance');
  });

  test('the list is not hard-coded in the component', () => {
    // It comes from the content file via `tourNames`, so adding a tour is an
    // edit to help-content.md and nothing else.
    const box = openChooser({ tours: ['Only one thing', 'And another'] });
    expect(rows(box)).toEqual(['Only one thing', 'And another']);
  });

  test('no tours means no button, rather than one opening an empty box', () => {
    render(
      <HelpContext.Provider value={api({ tours: [] })}>
        <TourChooser />
      </HelpContext.Provider>,
    );
    expect(screen.queryByRole('button', { name: /guided tours/i })).toBeNull();
  });
});

describe('the Help menu', () => {
  function openMenu(over: Partial<HelpApi>) {
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

  test('it no longer offers the tours', () => {
    // They were a cascading `Tours ▸` submenu here until 2026-09-05 — two
    // hovers deep, in a menu of reference material, for the thing a first-time
    // visitor most needs. They have their own header button now, and the old
    // `take the tour` pill is not back either.
    openMenu({ tours: TOURS });
    expect(screen.queryByRole('button', { name: /^tours/i })).toBeNull();
    expect(screen.queryByRole('button', { name: /take the tour/i })).toBeNull();
  });

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
    openMenu({ tours: TOURS, showEntry });
    for (const label of [
      /reading the diagram/i, /relation bar/i, /merged boxes/i,
      /closing a box/i, /sharing what you see/i,
    ]) {
      expect(screen.getByRole('button', { name: label })).toBeTruthy();
    }
    fireEvent.click(screen.getByRole('button', { name: /closing a box/i }));
    expect(showEntry).toHaveBeenCalledWith('node-dismiss');
  });

  /*
   * TEMPORARY (docs/TASKS.md item 3c) — delete with the toggle.
   *
   * Vitest runs with `import.meta.env.DEV` true, which is what
   * `ADDRESS_TOGGLE_ENABLED` reads, so the item is present here. That is also
   * the limit of what this can pin: it cannot prove the item is ABSENT from a
   * production build, because the flag is resolved at build time and this
   * process is not that build.
   */
  test('the authoring toggle is offered, and flips the flag', () => {
    const toggleAddresses = vi.fn();
    openMenu({ tours: TOURS, toggleAddresses });
    fireEvent.click(screen.getByRole('button', { name: /show content ids/i }));
    expect(toggleAddresses).toHaveBeenCalled();
  });

  test('the toggle shows a check when addresses are on', () => {
    openMenu({ tours: TOURS, showAddresses: true });
    const item = screen.getByRole('button', { name: /show content ids/i });
    expect(item.textContent).toContain('\u2713');
  });
});
