import { defineConfig, devices } from '@playwright/test';

/**
 * Placement tests, which VITEST CANNOT WRITE.
 *
 * jsdom implements no CSS anchor positioning, so every placement assertion in
 * `src/test/` is a claim about stylesheet TEXT, not about geometry. That gap is
 * where three wrong fixes lived on 2026-09-18. These tests measure real rects
 * in a real browser.
 *
 * ⚠️ Starts its OWN server on 4173. It must never depend on the dev server
 * Siggie keeps on 5173 -- that one is hand started and not always up.
 *
 * This is the trustworthy way to run the suite, and it is Siggie's and CI's:
 * `playwright test` LAUNCHES a browser, which the sandbox denies Claude.
 * `playwright.probe.config.ts` is the one Claude can run. When they disagree,
 * this one wins.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  /* `list` prints to the terminal as it goes; `html` is what `make e2e-report`
     opens afterwards. `open: 'never'` keeps a failing run from launching a
     browser on its own. */
  reporter: process.env.CI
    ? 'github'
    : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:4173/dynamic-model-var-docs/',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1600, height: 1000 } },
    },
  ],
  webServer: {
    command: 'npm run build && npx vite preview --port 4173 --strictPort',
    url: 'http://localhost:4173/dynamic-model-var-docs/',
    /* ⚠️ Never reuse: an adopted leftover server skips `npm run build`, so the
       suite silently tests a stale bundle. Worth the ~2s rebuild. */
    reuseExistingServer: false,
    timeout: 180_000,
  },
});
