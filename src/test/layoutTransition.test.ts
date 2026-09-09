/**
 * Boxes must SURVIVE the gap between a spec change and ELK returning.
 *
 * The regression this pins (2026-09-09): `useGraphLayout` nulls `layout` the
 * instant a new spec arrives, and the canvas rendered inside `{layout && ...}`.
 * So every node box unmounted on the click and remounted when ELK came back —
 * which is both the flash Siggie reported as "a total repaint on every
 * select/deselect" AND the reason the boxes never appeared to animate: a
 * freshly-mounted element has no previous transform to transition from.
 *
 * The fix is NOT to relax the staleness guard (see useGraphLayout.test.ts —
 * serving a stale layout crashes on "Routed edge … missing from view model").
 * It is that positions may fall back to the previous generation while CONTENT
 * always comes from the current view model.
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
const hookSrc = readFileSync(
  resolve(__dirname, '../explore/graph-core/useGraphLayout.ts'), 'utf8',
);

describe('layout transition', () => {
  test('the canvas renders on ANY geometry, not only a current layout', () => {
    // `{layout && ...}` was the unmount. The gate must accept the previous
    // generation's extent too, or the boxes have nowhere to be.
    expect(src).toMatch(/const geom = layout \?\? previous\?\.layout \?\? null/);
    expect(src).toContain('{geom && (');
    expect(src).not.toContain('{layout && (');
  });

  test('box POSITIONS fall back to the previous generation', () => {
    expect(src).toMatch(
      /const src = layout\?\.nodes \?\? previous\?\.layout\.nodes \?\? \[\]/,
    );
  });

  test('edges are drawn only from the CURRENT generation', () => {
    // The staleness crash was an edge looked up in a view model that no longer
    // had it. Positions may be stale; a vm lookup may never be.
    expect(src).toMatch(/\(layout\?\.edges \?\? \[\]\)\.map/);
    expect(src).not.toMatch(/\bgeom\.edges\b/);
  });

  test('the hook still refuses to serve a superseded layout as current', () => {
    // `previous` is an ADDITIONAL channel, not a loosening of the guard.
    expect(hookSrc).toMatch(/const fresh = state && state\.spec === spec \? state\.layout : null/);
    expect(hookSrc).toMatch(/const previous = state && state\.spec !== spec \? state : null/);
  });

  test('departing boxes render through the normal box loop', () => {
    // They were briefly inert silhouettes drawn from coordinates alone. Siggie,
    // 2026-09-09: *"i don't like the inert silhouette. just put the real box
    // back. if user messes with it, that's their problem."* So a departing box
    // keeps its rows, relation bar and handlers — it is only fading.
    expect(src).toContain('[...vm.nodes, ...leaving].map(n => {');
    expect(src).not.toContain('function LeavingBox');
    // Which requires its NodeVM, not just its position, to be retained.
    expect(src).toMatch(/vms: new Map\(shownVmRef\.current\.map/);
  });

  test('a departed box is RETIRED, not merely faded', () => {
    /*
     * The bug this pins: a leaving box faded to opacity 0 and then stayed
     * mounted forever. `leaving` derives from the retained outgoing
     * generation, which only changes when a NEW transition starts, so nothing
     * ever unmounted it — Siggie saw boxes stacked on each other, and a class
     * deselected out of the URL still occupying the canvas.
     */
    expect(src).toMatch(/outgoingRef\.current\.vms\.delete\(id\)/);
    expect(src).toMatch(/outgoingRef\.current\.pos\.delete\(id\)/);
    // The retained set is a ref, so a re-render has to be forced explicitly or
    // the deletes are invisible to the tree.
    expect(src).toMatch(/setRetired/);
  });

  test('edge arrival is its own knob, not the box animation', () => {
    // Siggie, 2026-09-09: "i want to control when they arrive -- not gated on
    // box animation finishing."
    expect(src).toContain('const wait = edgeArriveMs();');
    expect(src).not.toMatch(/wait = animMs\(\)/);
  });
});
