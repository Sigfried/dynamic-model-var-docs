/**
 * Is this a dev session a HUMAN is looking at?
 *
 * `import.meta.env.DEV` answers "is this the dev server", which is a different
 * question: the e2e suite drives the dev server too. Dev-only affordances
 * change what those tests see -- the help popover's address tag adds 22.7px to
 * its height, and the ELK timing recorder writes a row per layout, so a test
 * run pollutes the data it collects.
 *
 * So **gate dev-only behavior on this, not on `import.meta.env.DEV`**, and a
 * new dev affordance is off in the tests by default with nobody having to
 * remember anything. Siggie, 2026-09-19: *"so if we ever add any other
 * behavior on dev, it automatically gets turned off for e2e"*.
 *
 * `e2e/probe.fixture.ts` sets the flag through Playwright's `addInitScript`,
 * which runs before any app code on every navigation, so it is reliably there
 * by the time this is read. Nothing in the app writes it and it does not
 * persist, so a crashed run cannot leave a browser stuck in this mode.
 *
 * Production is unaffected: `import.meta.env.DEV` is statically false there, so
 * this folds to `false` and the guarded code is dropped.
 *
 * ⚠️ `src/help/devExtras.ts` is a deliberate copy of this. The help package
 * imports nothing from outside itself, and a shared module would be the first
 * breach of that boundary; three lines duplicated is the cheaper price.
 */
declare global {
  interface Window {
    /** Set only by the e2e harness. See `DEV_EXTRAS`. */
    __E2E__?: boolean;
  }
}

export const DEV_EXTRAS =
  import.meta.env.DEV && !(typeof window !== 'undefined' && window.__E2E__);
