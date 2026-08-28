/**
 * The tour's state stack, driven through the real app.
 *
 * `tourStateStack.test.ts` pins the model in isolation; this pins the BRIDGE —
 * that pushing a step's `Change:` actually reaches the URL and the canvas, that
 * `back` pops it, and that leaving unwinds. Those are the three things the old
 * absolute-state design got wrong in ways unit tests could not see, because the
 * damage was done by `url.search = query` replacing params nobody mentioned.
 *
 * Deliberately drives the SHIPPING tour content rather than a fixture: the
 * migration from `State:` to `Change:` was a semantic inversion of text that did
 * not visibly change, so a test against invented steps would not have caught a
 * step left un-migrated.
 */

import { describe, test, expect, beforeAll, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { loadModelData } from '../utils/dataLoader';
import ExploreApp from '../explore/ExploreApp';

const params = () => new URLSearchParams(window.location.search);
const sel = () => params().get('sel');

/*
 * jsdom implements neither `scrollIntoView` nor the Popover API, and HelpLayer
 * uses both to place the popover. Stubbed here rather than in setup.ts so the
 * other suites keep running against unmodified jsdom — none of them mount the
 * tour, and this is placement, which is not what these tests are about.
 *
 * `showPopover` is a no-op, so the popover keeps the UA's `display: none` and
 * testing-library treats its contents as inaccessible. Hence `hidden: true` on
 * every query below: these tests are about the state the buttons DRIVE, not
 * about whether jsdom can lay a top-layer element out.
 */
beforeAll(() => {
  Element.prototype.scrollIntoView = () => {};
  Object.assign(HTMLElement.prototype, {
    showPopover() {},
    hidePopover() {},
  });
});

const button = (name: RegExp | string) =>
  screen.getByRole('button', { name, hidden: true });

describe('tour state stack, end to end', () => {
  beforeAll(async () => { await loadModelData(); });

  beforeEach(() => {
    localStorage.clear();
    window.history.replaceState(null, '', '/dynamic-model-var-docs/');
  });

  /** Render, then walk the tour to the first step that puts something on the canvas. */
  const startTour = async () => {
    render(<ExploreApp />);
    await screen.findByRole('heading', { name: /BDCHM Explorer/i });
    fireEvent.click(button(/take the tour/i));
    await screen.findByRole('button', { name: /next/i, hidden: true });
  };

  /** Advance one position. Returns false once the tour has ended. */
  const next = () => {
    const el = screen.queryByRole('button', { name: /next|done/i, hidden: true });
    if (!el) return false;
    fireEvent.click(el);
    return true;
  };
  const back = () => fireEvent.click(button(/back/i));

  test('? starts the tour, and a second ? leaves it', async () => {
    /*
     * `?` used to toggle HELP MODE, which is disabled (HELP_MODE_ENABLED is
     * false), so the key did nothing at all — the most guessable shortcut on
     * the page bound to the one feature that is off (Siggie, 2026-08-28).
     *
     * A toggle rather than a plain start: `startTour` resets to step 0, so
     * binding it raw would make a second `?` silently restart a tour in
     * progress instead of leaving it.
     */
    render(<ExploreApp />);
    await screen.findByRole('heading', { name: /BDCHM Explorer/i });
    expect(screen.queryByRole('button', { name: /next/i, hidden: true })).toBeNull();

    fireEvent.keyDown(document, { key: '?' });
    await screen.findByRole('button', { name: /next/i, hidden: true });

    fireEvent.keyDown(document, { key: '?' });
    await waitFor(() =>
      expect(screen.queryByRole('button', { name: /next/i, hidden: true })).toBeNull());
  });

  test('? is ignored while typing, so it can be typed into a field', async () => {
    // Guarded by `isInputFocused`: the shortcut must not swallow a question
    // mark someone is writing.
    render(<ExploreApp />);
    await screen.findByRole('heading', { name: /BDCHM Explorer/i });
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.focus();
    fireEvent.keyDown(document, { key: '?' });
    expect(screen.queryByRole('button', { name: /next/i, hidden: true })).toBeNull();
    input.remove();
  });

  test('a step adds its own selection and back takes it away again', async () => {
    await startTour();
    expect(sel()).toBeNull();          // steps 1-2 are exposition: they add nothing

    // Walk forward until a step actually selects something.
    for (let i = 0; i < 12 && !sel(); i++) next();
    await waitFor(() => expect(sel()).toBeTruthy());
    const added = sel()!;

    back();
    await waitFor(() => expect(sel()).not.toBe(added));
  });

  test("a step does NOT reset a setting it never names", async () => {
    /*
     * THE bug. Siggie had a non-default setting, started the tour, and every
     * step carrying a `State:` snapped it back to the default, because no step
     * writes that param and an absolute query replaces everything. Nothing
     * warned; the canvas just changed density mid-tour.
     */
    window.history.replaceState(null, '', '/dynamic-model-var-docs/?sibs=0&dir=DOWN');
    await startTour();

    for (let i = 0; i < 12 && !sel(); i++) next();
    await waitFor(() => expect(sel()).toBeTruthy());

    expect(params().get('sibs')).toBe('0');
    expect(params().get('dir')).toBe('DOWN');
  });

  test("the viewer's own selection survives the whole tour", async () => {
    // Replaces both the entry snapshot and the "your changes will be
    // discarded" warning: the tour composes on top of the viewer's state
    // instead of replacing it, so there is nothing to restore and nothing to
    // apologise for.
    window.history.replaceState(null, '', '/dynamic-model-var-docs/?sel=Visit');
    await startTour();

    // All the way to the end, so the final `done` unwinds the stack too.
    for (let i = 0; i < 20 && next(); i++) { /* walk */ }
    await waitFor(() => expect(sel()).toBe('Visit'));
  });

  test("a class the viewer unticks mid-tour stays off for the rest of it", async () => {
    /*
     * The viewer overrules the tour, end to end.
     *
     * Scope note, so this test is not read as more than it is: it walks the
     * tour FORWARD, and the shipping tour's remaining moves are between beats
     * of one step, which push nothing. So it pins the compose path — an
     * unticked class does not creep back on subsequent positions — and not the
     * pop path. **The pop path is where `reconcile` earns its keep** (a stack
     * still holding the id re-adds it when the frame that pushed it is
     * examined), and it is pinned directly, and adversarially, in
     * `tourStateStack.test.ts` — "unticking a class the tour pushed keeps it
     * gone across the next pop".
     */
    await startTour();
    for (let i = 0; i < 12 && !sel(); i++) next();
    await waitFor(() => expect(sel()).toBeTruthy());
    const pushed = sel()!.split('~')[0];

    const box = () => document.querySelector<HTMLInputElement>(
      `[data-class-row="${pushed}"] input[type="checkbox"]`,
    );
    await waitFor(() => expect(box()).toBeTruthy());
    fireEvent.click(box()!);
    await waitFor(() => expect(sel()?.split('~') ?? []).not.toContain(pushed));

    for (let i = 0; i < 20 && next(); i++) { /* to the end */ }
    await waitFor(() => expect(sel()?.split('~') ?? []).not.toContain(pushed));
  });

  test('leaving mid-tour unwinds what the tour added, and only that', async () => {
    window.history.replaceState(null, '', '/dynamic-model-var-docs/?sel=Visit');
    await startTour();

    for (let i = 0; i < 12 && (sel() ?? '') === 'Visit'; i++) next();
    await waitFor(() => expect(sel()).not.toBe('Visit'));

    fireEvent.click(button('✕'));
    await waitFor(() => expect(sel()).toBe('Visit'));
  });
});
