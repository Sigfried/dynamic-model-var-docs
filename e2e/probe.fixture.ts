import { chromium, test as base } from '@playwright/test';

/**
 * A `test` that runs in the browser `make probe-browser` started, instead of
 * launching one.
 *
 * The sandbox denies Claude a browser LAUNCH but allows a localhost
 * connection, so `connectOverCDP` is what lets Claude run the suite at all.
 * The runner's own `connectOptions` cannot do it -- that speaks the Playwright
 * server protocol, not CDP, and pointing it at 9222 fails the handshake with a
 * 404. Overriding the `browser` fixture is the supported route.
 *
 * `USE_PROBE_BROWSER=1` selects it; unset, this is plain `@playwright/test`,
 * so `make e2e` keeps launching its own browser exactly as before.
 */
const useProbe = !!process.env.USE_PROBE_BROWSER;

export const test = useProbe
  ? base.extend({
      browser: [async ({}, use) => {
        const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
        // Detaches from the debug browser; does NOT close Siggie's window.
        await use(browser);
        await browser.close();
      }, { scope: 'worker', timeout: 30_000 }],
    })
  : base;

export { expect } from '@playwright/test';
