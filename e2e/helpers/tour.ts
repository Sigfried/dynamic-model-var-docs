import type { Page } from '@playwright/test';

/**
 * Driving a tour from a test, and measuring where its popover lands.
 *
 * ⚠️ IDENTIFY A BEAT BY READING THE PAGE. `?tour=&step=N` opens the step on its
 * DESCRIPTION, which is not a beat -- one click in and you are on beat 1. The
 * popover carries its own address in `data-step-address`: `rows-and-dots` for
 * the description, then `rows-and-dots~1`, `~2`, ... for beats.
 * `.help-tour-count` ("3 / 8") is the STEP counter and reads the same on every
 * beat of a step, so it cannot tell them apart.
 *
 * ⚠️ `data-step-address`, NOT the visible `.help-popover-address` tag: the tag
 * is gated on `import.meta.env.DEV` and renders nothing in the production
 * build this suite serves.
 *
 * Counting clicks is not wrong in itself, but it is not self-checking: a wrong
 * assumption about where a step starts survives every later step. Reading the
 * address fails loudly instead.
 */

export interface Placement {
  address: string;
  anchored: boolean;
  /** The authored/base `position-area`. NOTE it reports the authored value even
   *  when a fallback has relocated the popover, so it cannot detect a flip --
   *  compare the rects for that. */
  positionArea: string;
  popover: { top: number; bottom: number; left: number; right: number; height: number; width: number };
  anchor: { top: number; bottom: number; left: number; right: number; height: number } | null;
}

/** Read the popover's address, or null when no popover is open. */
export const address = (page: Page) =>
  page.evaluate(() =>
    document.querySelector('.help-popover:popover-open')?.getAttribute('data-step-address') ?? null);

/** Measure the open popover and the element its `--help-anchor` resolved to. */
export const placement = (page: Page): Promise<Placement> =>
  page.evaluate(() => {
    const pop = document.querySelector('.help-popover:popover-open');
    if (!pop) throw new Error('no open popover');
    const p = pop.getBoundingClientRect();
    const cs = getComputedStyle(pop);

    let anchor: DOMRect | null = null;
    for (const el of document.querySelectorAll('*')) {
      const name = getComputedStyle(el).anchorName;
      if (name && name.includes('--help-anchor')) {
        const r = el.getBoundingClientRect();
        if (r.width || r.height) anchor = r;
        break;
      }
    }
    const rect = (r: DOMRect) =>
      ({ top: r.top, bottom: r.bottom, left: r.left, right: r.right, height: r.height, width: r.width });
    return {
      address: pop.getAttribute('data-step-address') ?? '',
      anchored: pop.hasAttribute('data-anchored'),
      positionArea: cs.positionArea || cs.getPropertyValue('position-area'),
      popover: rect(p),
      anchor: anchor ? rect(anchor) : null,
    };
  });

/** Open a tour step and wait for its popover. */
/**
 * ⚠️ `ids=0` is load-bearing, not tidiness. The address tag is ON by default in
 * dev, and it makes the popover **22.7px taller** (measured: 563.9 with it,
 * 541.2 without, and the top edge moves by the same amount). Without this, the
 * probe config measures a popover production does not have, and its numbers
 * drift from `make e2e` -- which serves a production build where the tag
 * cannot render at all.
 */
export async function openStep(page: Page, tour: string, step: number) {
  await page.goto(`?tour=${tour}&step=${step}&ids=0`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.help-popover:popover-open', { timeout: 20_000 });
  await settle(page);
}

/**
 * Click forward until the popover's address matches, then measure it.
 * Throws rather than measuring the wrong beat if it never appears.
 */
export async function goToAddress(page: Page, want: string, maxClicks = 12): Promise<Placement> {
  for (let i = 0; i <= maxClicks; i++) {
    const at = await address(page);
    if (at === want) return placement(page);
    const next = page.locator('.help-tour-next');
    if (!(await next.count())) break;
    await next.first().click();
    await settle(page);
  }
  throw new Error(`never reached "${want}" (stopped at "${await address(page)}")`);
}

/** Let the canvas animation and anchor positioning settle. */
export const settle = async (page: Page) => {
  await page.waitForTimeout(700);
  await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
};
