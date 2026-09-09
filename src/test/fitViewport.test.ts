/**
 * Fitting the diagram around an open tour popover.
 *
 * The popover is in the browser's TOP LAYER, so nothing in the canvas can be
 * stacked above it — a fit that aims at the full container lays boxes out
 * underneath it and they are simply invisible.
 *
 * ⚠️ Narrowing the fit is only half of it, and the missing half is what this
 * file mostly pins: the diagram has to be PUT in the space that was left.
 * `zoomToFit` scrolled to `0,0` unconditionally, so a popover covering the
 * canvas's LEFT made the fit narrower and then parked the diagram back
 * underneath it (Siggie, 2026-09-09: the ⊞ category button "does not fit to the
 * canvas"). `freeLeft` is where the caller must scroll to.
 *
 * jsdom lays nothing out, so both the container and the popover get faked rects.
 * That is the whole input to this function — it reads two rects and
 * `clientWidth`/`clientHeight` — so faking them tests the real arithmetic.
 */

import { describe, test, expect, beforeEach } from 'vitest';
import { fitViewport } from '../explore/graph-core/useZoomPan';

const CANVAS = { left: 380, top: 64, width: 1020, height: 836 };

function rect(r: { left: number; top: number; width: number; height: number }) {
  return () => ({
    ...r, right: r.left + r.width, bottom: r.top + r.height,
    x: r.left, y: r.top, toJSON: () => ({}),
  }) as DOMRect;
}

/** The canvas container, sized like the real one beside a 380px left panel. */
function container(): HTMLElement {
  const el = document.createElement('div');
  Object.defineProperty(el, 'clientWidth', { value: CANVAS.width });
  Object.defineProperty(el, 'clientHeight', { value: CANVAS.height });
  el.getBoundingClientRect = rect(CANVAS);
  document.body.appendChild(el);
  return el;
}

/** An OPEN popover at the given box. `matches(':popover-open')` is what
 *  `fitViewport` gates on, and jsdom does not implement the Popover API. */
function popover(box: { left: number; top: number; width: number; height: number }) {
  const el = document.createElement('div');
  el.setAttribute('data-help-popover', '');
  el.getBoundingClientRect = rect(box);
  el.matches = (sel: string) => sel === ':popover-open';
  document.body.appendChild(el);
  return el;
}

beforeEach(() => { document.body.innerHTML = ''; });

describe('fitViewport', () => {
  test('no popover: the container, and no scroll offset', () => {
    // The ordinary case, and it must stay byte-for-byte the old behaviour.
    expect(fitViewport(container()))
      .toEqual({ w: CANVAS.width, h: CANVAS.height, freeLeft: 0 });
  });

  test('a popover that misses the canvas entirely changes nothing', () => {
    // Sitting over the left panel, not the canvas.
    popover({ left: 0, top: 100, width: 360, height: 400 });
    expect(fitViewport(container()))
      .toEqual({ w: CANVAS.width, h: CANVAS.height, freeLeft: 0 });
  });

  test('a popover on the RIGHT narrows the fit and leaves the left free', () => {
    // 300px of the popover overlaps the canvas's right edge.
    popover({ left: 1100, top: 100, width: 400, height: 400 });
    const got = fitViewport(container());
    expect(got.w).toBe(CANVAS.width - 300);
    // Free space is already at the left, so the origin is right and the caller
    // must not scroll.
    expect(got.freeLeft).toBe(0);
  });

  test('a popover on the LEFT narrows the fit AND reports the free offset', () => {
    /*
     * THE REGRESSION. Popover from x=380 to x=840, i.e. the canvas's left 460px.
     * The fit is narrowed by 460 — and then the diagram must be scrolled 460 to
     * the right, or it lands under the popover the narrowing just made room
     * around, exactly as before the fix.
     */
    popover({ left: 380, top: 100, width: 460, height: 400 });
    const got = fitViewport(container());
    expect(got.w).toBe(CANVAS.width - 460);
    expect(got.freeLeft).toBe(460);
  });

  test('a popover overhanging the canvas`s left edge still reports free space', () => {
    // Starts over the left panel and runs into the canvas: only the part inside
    // the canvas counts, both for the width and for the offset.
    popover({ left: 200, top: 100, width: 500, height: 400 });
    const got = fitViewport(container());
    expect(got.w).toBe(CANVAS.width - (700 - 380));
    expect(got.freeLeft).toBe(700 - 380);
  });

  test('never fits into a sliver', () => {
    /*
     * A popover covering nearly the whole canvas: the old full-width fit is the
     * lesser evil, because fitting a diagram into 40px produces nothing legible.
     */
    popover({ left: 380, top: 64, width: 1000, height: 800 });
    expect(fitViewport(container()).w).toBe(CANVAS.width * 0.4);
  });

  test('height is never deducted', () => {
    // Deducting it would throw away a full-width band for no reason: the space
    // beside a popover is usable, the space above and below it is not a shape
    // the diagram can use.
    popover({ left: 380, top: 100, width: 460, height: 400 });
    expect(fitViewport(container()).h).toBe(CANVAS.height);
  });

  test('a CLOSED popover in the DOM is ignored', () => {
    // The shell renders unconditionally and is hidden by the UA stylesheet
    // until opened; only `:popover-open` means it is covering anything.
    const el = popover({ left: 380, top: 100, width: 460, height: 400 });
    el.matches = () => false;
    expect(fitViewport(container()))
      .toEqual({ w: CANVAS.width, h: CANVAS.height, freeLeft: 0 });
  });
});
