/**
 * The back button and the category content view (`showCategoryView` in
 * ExploreApp.tsx; reasoning in WORKLOG.md 2026-09-04).
 *
 * Driven through the real app rather than unit-tested, because the thing that
 * can break is the SEQUENCE: a click sets a ref, an effect consumes it and
 * writes the URL, the browser navigates, and a `popstate` listener reads the
 * state back out. Every piece can be right while the order is wrong — the
 * write effect firing after the restore and pushing a fresh entry would make
 * back look dead, and no unit test would see it.
 *
 * `exploreState.test.ts` covers which verb each write uses. This covers what
 * the viewer experiences.
 */

import { describe, test, expect, beforeAll, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { loadModelData } from '../utils/dataLoader';
import { DataService } from '../services/DataService';
import ExploreApp from '../explore/ExploreApp';
import { resetTourRequest } from '../explore/exploreState';
import { categoryView } from '../config/categoryView';

const params = () => new URLSearchParams(window.location.search);
const selIds = () => (params().get('sel') ?? '').split('~').filter(Boolean);

/**
 * What the PANEL says is on the canvas — the ticked checkboxes.
 *
 * Assertions here rather than on `sel` alone, and the difference is not
 * pedantry: jsdom's `history.back()` moves `window.location` whether or not
 * anything reacts to it, so a URL-only assertion passes even with the
 * `popstate` listener deleted. Measured — removing that listener left five of
 * six URL-based tests green. This is the reading that actually fails.
 */
const checkedIds = () => [...new Set(
  // Deduped: a dual-listed class renders one row per listing (BodySite in
  // clinical AND lab), and both tick together — that is one class on the
  // canvas, which is what `sel` holds too.
  [...document.querySelectorAll('[data-class-row]')]
    .filter(row => (row.querySelector('input[type=checkbox]') as HTMLInputElement).checked)
    .map(row => row.getAttribute('data-class-row')!),
)].sort();

beforeAll(() => {
  Element.prototype.scrollIntoView = () => {};
  Object.assign(HTMLElement.prototype, { showPopover() {}, hidePopover() {} });
});

/**
 * Press the browser's back button and let the app react.
 *
 * jsdom navigates asynchronously and fires `popstate` on the task queue, so
 * the event has to be awaited rather than assumed — and the state updates it
 * triggers have to be flushed, hence `act`.
 */
const goBack = async () => {
  await act(async () => {
    const landed = new Promise<void>(resolve => {
      window.addEventListener('popstate', () => resolve(), { once: true });
    });
    window.history.back();
    await landed;
  });
};

describe('category content view and browser history', () => {
  let ds: DataService;

  beforeAll(async () => { ds = new DataService(await loadModelData()); });

  beforeEach(() => {
    localStorage.clear();
    window.history.replaceState(null, '', '/dynamic-model-var-docs/');
    resetTourRequest();
  });

  const drawCategory = (categoryId: string) => {
    const control = document.querySelector(
      `[data-show-category="${categoryId}"]`,
    ) as HTMLElement;
    fireEvent.click(control);
  };

  const start = async () => {
    render(<ExploreApp />);
    await screen.findByRole('heading', { name: /BDCHM Explorer/i });
  };

  const groupOf = (id: string) => ds.getCategoryTrees().find(g => g.id === id)!;

  test('drawing a category puts its members and pins on the canvas', async () => {
    await start();
    drawCategory('clinical');

    const expected = [...categoryView(groupOf('clinical'))].sort();
    await waitFor(() => expect(checkedIds()).toEqual(expected));
    expect(selIds().sort()).toEqual(expected);
  });

  test('back returns to the canvas that was there before', async () => {
    await start();
    // A canvas the viewer built by hand, so the restored state is recognisably
    // theirs and not just "the previous category". Named rather than indexed:
    // Person is in no category the test draws, so it cannot be confused with
    // something a view put there.
    const row = document.querySelector('[data-class-row="Person"]')!;
    fireEvent.click(row.querySelector('input[type=checkbox]')!);
    await waitFor(() => expect(selIds()).toEqual(['Person']));
    const before = selIds();

    drawCategory('survey');
    await waitFor(() => expect(selIds().length).toBeGreaterThan(1));

    await goBack();
    await waitFor(() => expect(checkedIds()).toEqual(before));
    expect(selIds()).toEqual(before);
  });

  test('the restored canvas reaches the checkboxes, not just the URL', async () => {
    // The URL is the transport; the panel is what the viewer looks at. An
    // early version restored one and not the other.
    await start();
    drawCategory('survey');
    const drawn = categoryView(groupOf('survey'));
    await waitFor(() => expect(selIds().length).toBe(drawn.length));

    const boxFor = (id: string) => {
      const row = document.querySelector(`[data-class-row="${id}"]`)!;
      return row.querySelector('input[type=checkbox]') as HTMLInputElement;
    };
    expect(boxFor(drawn[0]).checked).toBe(true);

    await goBack();
    await waitFor(() => expect(boxFor(drawn[0]).checked).toBe(false));
  });

  test('two views deep, back walks them one at a time', async () => {
    await start();
    drawCategory('survey');
    const survey = categoryView(groupOf('survey'));
    await waitFor(() => expect(selIds().length).toBe(survey.length));

    drawCategory('clinical');
    const clinical = categoryView(groupOf('clinical'));
    await waitFor(() => expect(selIds().sort()).toEqual([...clinical].sort()));

    await goBack();
    await waitFor(() => expect(checkedIds()).toEqual([...survey].sort()));

    await goBack();
    await waitFor(() => expect(checkedIds()).toEqual([]));
  });

  test('ticking a checkbox is not a history stop', async () => {
    /*
     * The rule the whole design turns on: only a whole-canvas jump pushes. If
     * ordinary edits pushed, back would replay the session one click at a time
     * and never leave the page.
     */
    await start();
    drawCategory('survey');
    const survey = categoryView(groupOf('survey'));
    await waitFor(() => expect(selIds().length).toBe(survey.length));

    // Three ordinary edits on top of the view. Deliberately UNticking rows
    // the view drew — `getAllByRole('checkbox')[0]` would be whatever sits at
    // the top of the whole panel, which is a different category.
    for (const id of survey.slice(0, 3)) {
      const row = document.querySelector(`[data-class-row="${id}"]`)!;
      fireEvent.click(row.querySelector('input[type=checkbox]')!);
    }
    await waitFor(() => expect(selIds().length).toBe(survey.length - 3));

    // ONE press goes back past all three, to what was there before the view.
    await goBack();
    await waitFor(() => expect(checkedIds()).toEqual([]));
  });

  test('re-drawing the view already on screen adds no second entry', async () => {
    // Otherwise the first back press appears to do nothing.
    await start();
    drawCategory('survey');
    const survey = categoryView(groupOf('survey'));
    await waitFor(() => expect(selIds().length).toBe(survey.length));

    drawCategory('survey');
    await waitFor(() => expect(selIds().length).toBe(survey.length));

    await goBack();
    await waitFor(() => expect(checkedIds()).toEqual([]));
  });
});
