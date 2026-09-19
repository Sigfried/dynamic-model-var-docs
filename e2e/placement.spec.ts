import { expect, test } from './probe.fixture';
import { goToAddress, openStep, placement, settle } from './helpers/tour';

/**
 * An authored `Position:` is OBEYED.
 *
 * This is the assertion no vitest in this repo can make. `helpPlacement.test.ts`
 * asserts that the stylesheet TEXT contains a declaration; that is a claim about
 * CSS source, and it stayed green through three placement bugs.
 *
 * ⚠️ **THESE TESTS ARE EXPECTED TO FAIL RIGHT NOW.** That is the point: they
 * pin the bug `popover-placement` is open against, so that whatever fixes it
 * has something to prove it. Do not "fix" them by weakening the assertion.
 *
 * The bug (measured 2026-09-18/19): step 3 beat 4 of *Using the Explorer*
 * authors `Position: bottom` on `node-box:Person` and lands ABOVE the anchor's
 * bottom. Beat 3 authors the same side on the same kind of anchor and places
 * correctly; they differ only in height.
 *
 * The mechanism, measured in a standalone repro: `.help-popover` is
 * `position: fixed`, and a fixed box's containing block is the VIEWPORT, so it
 * cannot overflow -- when it does not fit in the cell `position-area` chose,
 * the browser shifts it back inside, which only a tall popover triggers.
 *
 * ⚠️ `position: absolute` makes these pass and is NOT on its own the fix: it
 * trades this symptom for a popover clipped at the fold with its back/next row
 * unreachable. It was shipped and reverted. See
 * [BACKLOG §Placement](../docs/BACKLOG.md#placement) for the DOM-structure
 * approach to start from, and WORKLOG 2026-09-19 for the five hypotheses
 * already falsified.
 *
 * ⚠️ It was NOT the `flip-block` fallback. That fix was implemented first and
 * measured to change nothing.
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
    expect(Math.abs(again.popover.top - first.popover.top), 'popover top moved after back-stepping').toBeLessThan(2);
    expect(Math.abs(again.popover.left - first.popover.left), 'popover left moved after back-stepping').toBeLessThan(2);
  });
});
