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
import { resetTourRequest } from '../explore/exploreState';

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
    // `?tour=1` is latched on first read so it can outlive the URL rewrite;
    // one module instance serves every test here, so each simulated page load
    // has to clear it.
    resetTourRequest();
  });

  /**
   * Render, then walk the tour to the first step that puts something on the
   * canvas.
   *
   * Goes in through the `Guided tours` button, which is the only door: the
   * `take the tour` pill was deleted with docs/tasks.md item 2 (two entry
   * points to one thing drift apart, and being argument-less it could only
   * ever start the file's first tour), and the Help ▾ → Tours submenu that
   * briefly replaced it was itself replaced by the chooser — two hovers deep
   * was too far (Siggie, 2026-09-05).
   *
   * Runs the OWNERSHIP tour by name, not whichever tour is listed first. These
   * tests are about the state stack — they need an exposition opener that
   * draws nothing, then several steps that each push a DIFFERENT selection —
   * and the file's first tour is a category walk whose steps all draw. Naming
   * the tour also means adding one to the content file cannot silently
   * retarget them. (It was `Walkthrough` until that tour was split into the
   * four app tours on 2026-09-09; `Getting oriented` would not do, because its
   * spine steps re-push the class the untick test below removes.)
   */
  const startTour = async () => {
    render(<ExploreApp />);
    await screen.findByRole('heading', { name: /BDCHM Explorer/i });
    // Hover opens the list; a click opens the overview instead (TASKS 1b).
    fireEvent.mouseEnter(button(/guided tours/i));
    const chooser = await screen.findByRole('dialog', { name: /guided tours/i });
    const ownership = [...chooser.querySelectorAll('button')]
      .find(b => /^ownership/i.test(b.textContent ?? ''))!;
    fireEvent.click(ownership);
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

  test('?tour=1 opens the tour and removes itself from the URL', async () => {
    /*
     * A link that drops someone straight into the tour (Siggie, 2026-08-28).
     *
     * The param must NOT survive: `writeExploreState` mutates the live URL
     * rather than rebuilding it, so anything nobody deletes stays in the
     * address bar forever -- a `tour=1` left there would restart the tour on
     * every reload and be copied into whatever the visitor shared next.
     */
    window.history.replaceState(null, '', '/dynamic-model-var-docs/?tour=1&sel=Person');
    render(<ExploreApp />);
    // `next|done`: the link starts the file's FIRST tour, which is today a
    // one-step introduction whose only forward control says "done".
    await screen.findByRole('button', { name: /next|done/i, hidden: true });
    // Consumed...
    expect(params().get('tour')).toBeNull();
    /*
     * ...and the viewer's selection is SUPPRESSED, not destroyed.
     *
     * This used to assert `sel()` was still `Person`, which held only while
     * the first tour's opening step drew nothing. That step carries an empty
     * `Only:` now, so it enters region 1 and `held` stops contributing —
     * exactly what a replace is supposed to do. `Person` is off screen and
     * still in `held`, and the next test walks it back. Since 2026-09-10 the
     * first tour is Ownership, whose opening step selects three classes, so
     * "suppressed" reads as "Person is not among what is drawn".
     */
    expect(sel()?.split('~') ?? []).not.toContain('Person');
  });

  test('an empty `Only:` suppresses the entry selection rather than eating it', async () => {
    /*
     * The guarantee a replace rests on: `Only:` can hide the viewer's
     * selection but must never be able to delete it, because `back` has to be
     * able to restore it and leaving the tour has to hand it back.
     *
     * The regression this pins: `onTourStart` used to re-read `sel` from the
     * URL at call time, and a `?tour=1&sel=X` link is a race — the mount
     * effect consuming `tour=1` and the first step both write the URL first.
     * `held` started empty, so the replace swept a selection it should have
     * suppressed and `X` was gone for good.
     */
    window.history.replaceState(null, '', '/dynamic-model-var-docs/?tour=1&sel=Person');
    render(<ExploreApp />);
    await screen.findByRole('button', { name: /next|done/i, hidden: true });
    // Suppressed by the opening step's `Only:` — whatever that step selects,
    // the viewer's Person is not among it. (The first tour's opening step
    // used to carry an EMPTY `Only:`, so this used to be `toBeNull()`.)
    expect(sel()?.split('~') ?? []).not.toContain('Person');
    // Leaving the tour hands the viewer back what was theirs all along.
    fireEvent.click(button(/done|✕|close/i));
    await waitFor(() => expect(sel()).toBe('Person'));
  });

  test('an ordinary visit does not open the tour', async () => {
    // The complement, and the thing that would break silently: if arrival
    // fired the tour unconditionally it would fire for every visitor and on
    // every shared link.
    render(<ExploreApp />);
    await screen.findByRole('heading', { name: /BDCHM Explorer/i });
    expect(screen.queryByRole('button', { name: /next/i, hidden: true })).toBeNull();
  });

  test('? opens the tours Overview, and a second ? closes it; no tour starts', async () => {
    /*
     * Siggie, 2026-09-10: "instead of having ? bring up tour 1 have it bring
     * up the tour overview". Starting the first tour was the 2026-08-28
     * binding, right with one tour and wrong with five. Before that `?`
     * toggled HELP MODE, which is disabled, so the key did nothing at all.
     *
     * A toggle, so a second press closes what the first opened.
     */
    render(<ExploreApp />);
    await screen.findByRole('heading', { name: /BDCHM Explorer/i });

    fireEvent.keyDown(document, { key: '?' });
    await screen.findByRole('dialog', { name: 'All tours', hidden: true });
    expect(screen.queryByRole('button', { name: /next|done/i, hidden: true })).toBeNull();

    fireEvent.keyDown(document, { key: '?' });
    await waitFor(() =>
      expect(screen.queryByRole('dialog', { name: 'All tours', hidden: true })).toBeNull());
  });

  /** `?` opens the Overview; the first tour's name in it starts that tour. */
  const startFirstTourFromOverview = async () => {
    fireEvent.keyDown(document, { key: '?' });
    await screen.findByRole('dialog', { name: 'All tours', hidden: true });
    const first = [...document.querySelectorAll('.help-map-tourname')]
      .find(b => /BioData Catalyst/.test(b.textContent ?? ''))!;
    fireEvent.click(first);
    await screen.findByRole('button', { name: /next|done/i, hidden: true });
  };

  test('Escape closes an open map first, and the tour only on the second press', async () => {
    /*
     * Siggie, 2026-09-10: "ESC should close the map, 2nd ESC close the tour."
     * Before: the provider's document-capture Escape ended the tour and
     * stopped propagation, so the map's own listener never ran and `mapOpen`
     * survived into the next tour, which opened with the map already up.
     */
    render(<ExploreApp />);
    await screen.findByRole('heading', { name: /BDCHM Explorer/i });
    await startFirstTourFromOverview();

    fireEvent.click(screen.getByTitle('Show the tour outline'));
    expect(screen.getByRole('dialog', { name: 'Tour outline', hidden: true })).toBeTruthy();

    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() =>
      expect(screen.queryByRole('dialog', { name: 'Tour outline', hidden: true })).toBeNull());
    // The tour is still running.
    expect(screen.getByRole('button', { name: /next|done/i, hidden: true })).toBeTruthy();

    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() =>
      expect(screen.queryByRole('button', { name: /next|done/i, hidden: true })).toBeNull());

    // And a map left open at exit does not come back with the next tour.
    await startFirstTourFromOverview();
    fireEvent.click(screen.getByTitle('Show the tour outline'));
    fireEvent.keyDown(document, { key: '?' }); // in a tour, ? still ends it; map still up
    await waitFor(() =>
      expect(screen.queryByRole('button', { name: /next|done/i, hidden: true })).toBeNull());
    await startFirstTourFromOverview();
    expect(screen.queryByRole('dialog', { name: 'Tour outline', hidden: true })).toBeNull();
  });

  test('a dragged popover drops the anchor machinery, and the next step gets it back', async () => {
    /*
     * Siggie, 2026-09-10: after a step flips from bottom to top, dragging the
     * popover "moves in the opposite direction to my cursor". The drag sets
     * `position-area: none` inline, but an active position-try fallback's
     * declarations override inline style, so the flipped area stayed in
     * charge and the dragged coordinates were read inside the anchor's cell.
     * `data-anchored` is what scopes `position-anchor` and the fallbacks
     * (help.css), so a dragged popover must not carry it. jsdom cannot show
     * the misplacement itself; it can show the attribute.
     */
    Object.assign(Element.prototype, { setPointerCapture() {}, releasePointerCapture() {} });
    // `Getting oriented`, not Ownership: its opening steps anchor on the
    // selection panel, which exists in jsdom. A diagram anchor needs the ELK
    // layout, which does not run here, so it would never resolve.
    render(<ExploreApp />);
    await screen.findByRole('heading', { name: /BDCHM Explorer/i });
    fireEvent.mouseEnter(button(/guided tours/i));
    const chooser = await screen.findByRole('dialog', { name: /guided tours/i });
    fireEvent.click([...chooser.querySelectorAll('button')]
      .find(b => /^getting oriented/i.test(b.textContent ?? ''))!);
    await screen.findByRole('button', { name: /next/i, hidden: true });
    const popover = () => document.querySelector('[data-help-popover]')!;
    // Its first two steps are `Anchor: none`; the third anchors on the panel.
    const untilAnchored = async () => {
      for (let i = 0; i < 8 && !popover().hasAttribute('data-anchored'); i++) {
        next();
        await new Promise(r => setTimeout(r, 0));
      }
      await waitFor(() => expect(popover().hasAttribute('data-anchored')).toBe(true));
    };
    await untilAnchored();

    const handle = popover().querySelector('.help-popover-title')!;
    fireEvent.pointerDown(handle, { button: 0, pointerId: 1, clientX: 100, clientY: 100 });
    fireEvent.pointerMove(handle, { pointerId: 1, clientX: 160, clientY: 150 });
    fireEvent.pointerUp(handle, { pointerId: 1, clientX: 160, clientY: 150 });
    expect(popover().hasAttribute('data-anchored')).toBe(false);
    expect((popover() as HTMLElement).style.positionArea).toBe('none');

    // The drag is an answer to THIS step's placement; the next anchored step
    // gets the machinery back.
    next();
    await untilAnchored();
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
    expect(screen.queryByRole('dialog', { name: 'All tours', hidden: true })).toBeNull();
    input.remove();
  });

  test('a step adds its own selection and back takes it away again', async () => {
    await startTour();
    // The opening step may itself select (Ownership's does, since Siggie's
    // 2026-09-10 rewrite), so the property is "the NEXT selecting step changes
    // it, and back changes it back" — not "the tour starts empty".
    const first = sel();
    for (let i = 0; i < 12 && sel() === first; i++) next();
    await waitFor(() => expect(sel()).not.toBe(first));
    const added = sel();

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

    // All the way to the end, so the final `done` unwinds the stack too. A
    // tick between clicks: the popover element is remounted per position
    // (see HelpLayer's `popoverKey`), so the next button has to be re-found
    // after each step lands rather than clicked twenty times where it stood.
    for (let i = 0; i < 80 && next(); i++) await new Promise(r => setTimeout(r, 0));
    await waitFor(() => expect(sel()).toBe('Visit'));
  });

  test("a class the viewer unticks mid-tour stays off for the rest of it", async () => {
    /*
     * The viewer overrules the tour, end to end.
     *
     * Scope note, so this test is not read as more than it is: it walks the
     * tour FORWARD, and every later step of the shipping tour replaces the
     * canvas with a selection that does not name the unticked class again. So
     * it pins the compose path — an unticked class does not creep back on
     * subsequent positions — and not the pop path. **The pop path is where `reconcile` earns its keep** (a stack
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

  test('a class ticked mid-tour is still there after the tour ends', async () => {
    /*
     * The exit path, which changed shape with the `held`/`temp_held` rewrite
     * (WORKLOG 2026-09-07). Ending used to unwind by popping once per
     * pushed frame, so what the viewer kept was whatever the pops left behind.
     * Now the viewer's half is STORED, and `onTourEnd` publishes it in one
     * move — so this pins the thing that would break if the tour-start signal
     * never arrived, or if a mid-tour tick landed in the wrong set: the class
     * would be composed away as the tour's and vanish at the exit.
     */
    window.history.replaceState(null, '', '/dynamic-model-var-docs/?sel=Visit');
    await startTour();

    // Walk to a step that draws something, so the tick happens over a canvas
    // the tour is contributing to rather than an empty one.
    for (let i = 0; i < 12 && !sel(); i++) next();
    await waitFor(() => expect(sel()).toBeTruthy());

    const box = () => document.querySelector<HTMLInputElement>(
      '[data-class-row="Specimen"] input[type="checkbox"]',
    );
    await waitFor(() => expect(box()).toBeTruthy());
    fireEvent.click(box()!);
    await waitFor(() => expect(sel()?.split('~') ?? []).toContain('Specimen'));

    fireEvent.click(button('✕'));
    // Both survive: `Visit` was theirs before the tour, `Specimen` during it.
    await waitFor(() =>
      expect((sel()?.split('~') ?? []).sort()).toEqual(['Specimen', 'Visit']));
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
