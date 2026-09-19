import { defineConfig, devices } from '@playwright/test';

/**
 * Placement tests, which VITEST CANNOT WRITE.
 *
 * jsdom implements no CSS anchor positioning, so every placement assertion in
 * `src/test/` is a claim about stylesheet TEXT, not about geometry. That gap is
 * where three wrong fixes lived on 2026-09-18. These tests measure real rects
 * in a real browser.
 *
 * ⚠️ This config starts its OWN server on 4173 via `vite preview`. It must
 * never depend on the dev server Siggie keeps on 5173 -- that one is hand
 * started, is not always up, and Claude cannot kill an orphan of it.
 *
 * ⚠️ Claude cannot RUN this suite: Bash runs under a Seatbelt sandbox that
 * denies Chromium's Mach port registration, so Playwright cannot launch a
 * browser (see the Makefile). Claude probes by connecting to a browser Siggie
 * started. This suite is for Siggie and for CI, and `make probe-*` is the
 * interactive equivalent.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
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
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
