import { defineConfig, devices } from '@playwright/test';

/**
 * Run the placement suite in the browser `make probe-browser` already started,
 * against the dev server on 5173.
 *
 * WHY: `playwright test` LAUNCHES a browser, which the sandbox denies Claude
 * (Mach port refusal) -- that is why `make e2e` is Siggie-only. CONNECTING to
 * a running browser is an ordinary localhost connection and IS allowed, so
 * with `make probe-browser` up, Claude can run this suite itself.
 *
 * NOT a replacement for `playwright.config.ts`. That one is hermetic: it
 * builds and serves its own PRODUCTION bundle on 4173, and is what CI and any
 * trustworthy final claim use. This one measures whatever the dev server has
 * right now, including uncommitted edits -- which is what makes it good for
 * iterating and unfit for a final verdict. When the two disagree, 4173 wins.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:5173/dynamic-model-var-docs/',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 1600, height: 1000 } } },
  ],
});
