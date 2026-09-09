/**
 * Boxes must SURVIVE the gap between a spec change and ELK returning, and a
 * dropped box must LEAVE.
 *
 * The regressions these pin (2026-09-09):
 *  - `{layout && ...}` around the canvas unmounted every box on the click and
 *    remounted it when ELK came back — the "total repaint" on every select,
 *    and the reason boxes never appeared to animate (a freshly-mounted element
 *    has no previous transform to ease from).
 *  - the hand-rolled replacement (a retained outgoing generation, a
 *    retirement timer, a forced re-render) faded departing boxes for a moment
 *    and then left them on the canvas — boxes stacked on each other, a class
 *    deselected out of the URL still occupying its old spot.
 *
 * Both are now `motion/react`'s job: AnimatePresence keeps a removed child
 * mounted until its exit animation finishes, then unmounts it. What the source
 * must keep doing is (a) render on ANY layout's coordinates, current or
 * superseded, and (b) join ELK's ids against the view model ONLY from the
 * current generation (see useGraphLayout.test.ts for the crash that guards).
 *
 * These are structural assertions over the source, in the style of
 * dragPins.test.ts: reaching this through a render would need ELK, which does
 * not run in jsdom.
 */

import { describe, test, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const src = readFileSync(
  resolve(__dirname, '../explore/OwnershipGraphView.tsx'), 'utf8',
);

describe('layout transition', () => {
  test('the canvas renders on ANY geometry, not only a current layout', () => {
    // `{layout && ...}` was the unmount. The gate must accept a superseded
    // generation's extent too, or the boxes have nowhere to be.
    expect(src).toMatch(/const geom = latest\?\.layout \?\? null/);
    expect(src).toContain('{geom && (');
    expect(src).not.toContain('{layout && (');
  });

  test('`layout` is the current generation only', () => {
    expect(src).toMatch(/const layout = latest\?\.spec === spec \? latest\.layout : null/);
  });

  test('box POSITIONS come from whatever layout exists', () => {
    expect(src).toMatch(/new Map\(\(geom\?\.nodes \?\? \[\]\)\.map/);
  });

  test('edges are drawn only from the CURRENT generation', () => {
    // The staleness crash was an edge looked up in a view model that no longer
    // had it. Positions may be stale; a vm lookup may never be.
    expect(src).toMatch(/\(layout\?\.edges \?\? \[\]\)\.map/);
    expect(src).not.toMatch(/\bgeom\.edges\b/);
  });

  test('departure is AnimatePresence, not hand-rolled retention', () => {
    // The box loop is a direct child of AnimatePresence, iterating the LIVE
    // view model: a dropped node's element is kept by the presence, not by us.
    expect(src).toMatch(/<AnimatePresence initial=\{false\}>\s*\{vm\.nodes\.map\(n => \{/);
    expect(src).toContain('<motion.div');
    for (const relic of ['outgoingRef', 'shownVmRef', 'setRetired', 'FADE_RETIRE_SLACK_MS', 'const leaving', 'const entering']) {
      expect(src, relic).not.toContain(relic);
    }
  });

  test('every duration reaches motion through the knobs, in seconds', () => {
    // motion takes seconds; the knobs are milliseconds. `sec()` is the only
    // conversion, and no literal duration appears in a transition.
    expect(src).toMatch(/duration: sec\(fadeMs\(\)\)/);
    expect(src).toMatch(/delay: sec\(enterDelayMs\(\)\)/);
    expect(src).toMatch(/sec\(nudges\.has\(n\.id\) \? 0 : animMs\(\)\)/);
    expect(src).not.toMatch(/duration: \d/);
  });

  test('edge arrival is its own knob, not the box animation', () => {
    // Siggie, 2026-09-09: "i want to control when they arrive -- not gated on
    // box animation finishing."
    expect(src).toMatch(/const wait = freshDrawRef\.current \? 0 : edgeArriveMs\(\);/);
    expect(src).not.toMatch(/wait = .*animMs\(\)/);
  });
});
