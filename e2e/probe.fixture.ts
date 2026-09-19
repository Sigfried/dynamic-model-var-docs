import { chromium, test as base, type Page } from '@playwright/test';

/**
 * The `test` every spec imports. Two jobs.
 *
 * **1. Tell the app it is under test.** `addInitScript` runs before any app
 * code on every navigation, so `window.__E2E__` is set by the time
 * `DEV_EXTRAS` is read (`src/devExtras.ts`). Dev affordances that would change
 * what a test measures are off without a spec having to ask, and a new one is
 * off by default too, which is the point.
 *
 * This applies to BOTH configs. It is a no-op against the production build
 * `make e2e` serves, where the dev branches are already compiled out, but it
 * means a spec behaves the same whichever way it was run.
 *
 * **2. Run in Siggie's browser when asked.** `USE_PROBE_BROWSER=1` connects to
 * the browser `make probe-browser` started rather than launching one, which is
 * the only way Claude can run the suite: the sandbox denies a browser launch
 * and allows a localhost connection. The runner's own `connectOptions` cannot
 * do this -- it speaks the Playwright server protocol, not CDP, and fails the
 * handshake with a 404 against 9222 -- so overriding the `browser` fixture is
 * the supported route. Unset, this is plain `@playwright/test`.
 */
const useProbe = !!process.env.USE_PROBE_BROWSER;

const markAsTest = async ({ page }: { page: Page }, use: (p: Page) => Promise<void>) => {
  await page.addInitScript(() => { window.__E2E__ = true; });
  await use(page);
};

export const test = useProbe
  ? base.extend({
      browser: [async ({}, use) => {
        const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
        // Detaches from the debug browser; does NOT close Siggie's window.
        await use(browser);
        await browser.close();
      }, { scope: 'worker', timeout: 30_000 }],
      page: markAsTest,
    })
  : base.extend({ page: markAsTest });

export { expect } from '@playwright/test';
