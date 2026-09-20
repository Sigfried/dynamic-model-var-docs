import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { expect, test } from './probe.fixture';
import { goToAddress, openStep, placement, settle } from './helpers/tour';

/**
 * An authored `Position:` is OBEYED.
 *
 * This is the assertion no vitest in this repo can make. `helpPlacement.test.ts`
 * asserts that the stylesheet TEXT contains a declaration; that is a claim about
 * CSS source, and it stayed green through three placement bugs.
 *
 * These passed on 2026-09-19, when the popover moved inside the canvas's zoom
 * wrapper (BACKLOG §Placement). Do not "fix" a future failure by weakening an
 * assertion: each one is a property Siggie asked for in words.
 *
 * What the bug turned out to be, since three sessions guessed wrong before
 * anyone measured it: the popover is placed by `position-area`, which places
 * it WITHIN ITS CONTAINING BLOCK. Once the popover became a child of the zoom
 * wrapper, and the wrapper was sized exactly to the content box, a popover
 * anchored on the lowest node had no room below it — so `block-end`
 * bottom-aligned it to the wrapper's edge and it landed on the box it was
 * pointing at. `HELP_ROOM` in `useZoomPan.ts` is the fix, and it is the
 * wrapper that grows, not the content.
 *
 * ⚠️ Two things that were blamed and are NOT the cause, both measured:
 * `position: fixed` and the top-layer clamp (gone with the top layer, and the
 * symptom survived it), and the node boxes' `x`/`y` transform (switching them
 * to `left`/`top` changed none of these numbers).
 */

const TOUR = 'using-the-explorer';

/** `Position: bottom` means the popover's top edge is at or below the anchor's bottom. */
const expectBelow = (p: Awaited<ReturnType<typeof placement>>) => {
  expect(p.anchor, `${p.address}: anchor did not resolve`).not.toBeNull();
  expect(
    p.popover.top,
    `${p.address}: authored Position: bottom, but the popover's top (${p.popover.top.toFixed(1)}) `
    + `is above the anchor's bottom (${p.anchor!.bottom.toFixed(1)}) -- it flipped off the authored side`,
  ).toBeGreaterThanOrEqual(p.anchor!.bottom - 1);
};

test.describe('an authored Position: is obeyed', () => {
  test('beat 3 places below its anchor (the one that always worked)', async ({ page }) => {
    await openStep(page, TOUR, 3);
    expectBelow(await goToAddress(page, 'rows-and-dots~3'));
  });

  test('beat 4 places below its anchor even when it barely does not fit', async ({ page }) => {
    await openStep(page, TOUR, 3);
    const p = await goToAddress(page, 'rows-and-dots~4');
    // The regression: a ~520px popover into ~500px of room below the anchor.
    // Under `position: fixed` that shortfall slid it back over the anchor.
    expectBelow(p);
  });

  /*
   * The constraint that `position: absolute` alone FAILED, and the reason it
   * was reverted. Whatever obeys the authored side must also leave the reader
   * able to reach the nav row -- either by fitting on screen, or by being
   * scrollable to. A popover that obeys `Position: bottom` and puts back/next
   * off the bottom of the window with no way to scroll there is not a fix.
   *
   * Deliberately NOT asserting "does not overflow": overflowing is allowed
   * (Siggie, 2026-09-18). Being unreachable is not.
   */
  test('the back/next row can always be reached', async ({ page }) => {
    await openStep(page, TOUR, 3);
    await goToAddress(page, 'rows-and-dots~4');
    const reachable = await page.evaluate(() => {
      const nav = document.querySelector('.help-tour-nav');
      if (!nav) return { found: false, visible: false };
      const onScreen = () => {
        const r = nav.getBoundingClientRect();
        return r.bottom <= innerHeight + 1 && r.top >= -1;
      };
      if (onScreen()) return { found: true, visible: true, scrolled: false };
      // Not on screen as placed: can anything scroll it into view?
      nav.scrollIntoView({ block: 'nearest' });
      return { found: true, visible: onScreen(), scrolled: true };
    });
    expect(reachable.found, 'no nav row rendered').toBe(true);
    expect(
      reachable.visible,
      'the popover\'s back/next row is off screen and cannot be scrolled to',
    ).toBe(true);
  });

  test('the popover never covers the element it is anchored to', async ({ page }) => {
    await openStep(page, TOUR, 3);
    for (const beat of ['rows-and-dots~3', 'rows-and-dots~4']) {
      const p = await goToAddress(page, beat);
      if (!p.anchor) continue;
      const overlaps =
        p.popover.left < p.anchor.right && p.popover.right > p.anchor.left
        && p.popover.top < p.anchor.bottom && p.popover.bottom > p.anchor.top;
      expect(overlaps, `${beat}: popover overlaps its own anchor`).toBe(false);
    }
  });
});

test.describe('placement is stable across back-stepping', () => {
  /**
   * Siggie's actual complaint is that placement differs depending on how you
   * ARRIVED at a step. This pins the property directly: the same beat reached
   * forwards and then again after stepping back must land in the same place.
   *
   * ⚠️ IN CANVAS COORDINATES, not viewport ones, and the difference is not a
   * weakening of the assertion. The popover is mounted inside the canvas and
   * scrolls with it, so its viewport rect moves when the canvas is scrolled
   * even though it was placed identically — and a beat's `Action:` does scroll
   * the canvas, by a different amount depending on which way you arrived.
   *
   * Measured 2026-09-19, arriving forwards and then backwards at the same
   * beat: `offsetTop` 289 both ways and the 12px anchor gap held both ways,
   * while `scrollTop` was 159 vs 473 — and 657.5 − 343.5 = 314 is exactly that
   * scroll difference. The viewport comparison this replaces was measuring the
   * scroll, which is why it stayed red through three placement fixes aimed at
   * the wrong thing (WORKLOG 2026-09-18/19).
   *
   * The gap to the anchor is asserted alongside it, so a popover that really
   * did move relative to what it points at still fails.
   */
  test('a beat lands in the same place arrived at forwards and backwards', async ({ page }) => {
    await openStep(page, TOUR, 3);
    const first = await goToAddress(page, 'rows-and-dots~3');

    await page.locator('.help-tour-next').first().click();
    await settle(page);
    // The back button carries no class; its title is the handle.
    await page.locator('.help-tour-nav button[title^="Previous"]').first().click();
    await settle(page);

    const again = await placement(page);
    expect(again.address, 'back did not return to the same beat').toBe(first.address);
    expect(first.canvas, 'popover is not mounted in a canvas').not.toBeNull();
    expect(again.canvas, 'popover is not mounted in a canvas').not.toBeNull();
    expect(Math.abs(again.canvas!.top - first.canvas!.top),
      'popover top moved after back-stepping').toBeLessThan(2);
    expect(Math.abs(again.canvas!.left - first.canvas!.left),
      'popover left moved after back-stepping').toBeLessThan(2);
    // And it is still the same distance from the thing it points at.
    const gap = (p: typeof first) => p.popover.top - p.anchor!.bottom;
    expect(Math.abs(gap(again) - gap(first)),
      'popover moved relative to its anchor').toBeLessThan(2);
  });
});

/**
 * Every authored `Position:` is a value CSS actually accepts.
 *
 * `Position:` is passed to `position-area` verbatim, so the format tracks none
 * of that property's grammar and an author can write any of it. The cost is
 * that a typo is silent: the browser drops an invalid `position-area` and the
 * popover falls back to automatic placement, which looks like a placement bug
 * rather than a spelling one.
 *
 * So the browser's own parser is the validator. This cannot be a vitest --
 * jsdom implements no `CSS.supports` at all, so the check has to run where a
 * real CSS parser is (measured 2026-09-20, after I claimed the opposite).
 */
test('every authored Position: is a valid position-area', async ({ page }) => {
  // ESM spec: `__dirname` is not defined here (measured 2026-09-20).
  const markdown = readFileSync(
    fileURLToPath(new URL('../src/explore/help-content.md', import.meta.url)), 'utf8');

  /* Field lines only -- `Position: bottom`, with the optional `**` the content
     file uses for emphasis on a field name. */
  const authored = [...markdown.matchAll(/^\s*-\s*\*{0,2}Position:?\*{0,2}\s*(.+?)\s*$/gim)]
    .map(m => m[1].replace(/\*/g, '').trim().toLowerCase())
    .filter(Boolean);
  expect(authored.length, 'no Position: fields found -- has the field been renamed?')
    .toBeGreaterThan(0);

  await page.goto('/');
  const bad: string[] = [];
  for (const value of [...new Set(authored)]) {
    const ok = await page.evaluate(
      v => CSS.supports('position-area', v), value);
    if (!ok) bad.push(value);
  }
  expect(bad, `Position: values the browser rejects as position-area -- each `
    + `silently falls back to automatic placement:\n  ${bad.join('\n  ')}`).toEqual([]);
});
