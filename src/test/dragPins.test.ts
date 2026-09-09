/**
 * Drag pins are dropped on every relayout.
 *
 * A pin is an offset from where ELK put a box, so it is meaningful only against
 * the arrangement it was measured in. Once ELK re-runs, the same dx/dy displaces
 * the box from a position that no longer exists.
 *
 * Siggie's rule, 2026-09-09: *"other than zoom/pan and dragging other boxes, i
 * can't think of any canvas change that should hold on to pins."* Both of those
 * leave `layout` untouched — zoom is a wrapper transform that bypasses React,
 * and a drag feeds `placed`, never `spec` — so keying the clear on `layout` says
 * exactly that.
 *
 * ⚠️ Structural, not behavioural, and that is a real limit. Reaching this through
 * a render means running ELK, which does not run in jsdom (docs/TESTING.md), so
 * there is no way here to drag a box and assert where it lands. What this can do
 * is pin the DEPENDENCY, which is the whole content of the fix: `pins` used to
 * clear on `subgraph` (selection only), which held pins across LR↔TB, the
 * siblings toggle, expand/collapse and merge mode — all of which move every box.
 */

import { describe, test, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const src = readFileSync(
  resolve(__dirname, '../explore/OwnershipGraphView.tsx'), 'utf8',
);

describe('drag pins', () => {
  test('both pins and nudges clear on `layout`, not on `subgraph`', () => {
    expect(src).toMatch(/useEffect\(\(\) => setNudges\(new Map\(\)\), \[layout\]\)/);
    expect(src).toMatch(/useEffect\(\(\) => setPins\(new Map\(\)\), \[layout\]\)/);
    expect(src, 'pins must not go back to clearing on selection alone')
      .not.toMatch(/setPins\(new Map\(\)\), \[subgraph\]/);
  });

  test('nothing about a drag feeds back into the layout', () => {
    /*
     * What makes clearing on `layout` safe rather than self-defeating: if a drop
     * could trigger a relayout, the pin it just created would be wiped
     * immediately. `pins`/`nudges` are consumed by `placed` (render-only); the
     * layout comes from `spec`, which is built from `vm` and `direction`.
     */
    const spec = /const spec = useMemo\(\(\) => buildSpec\(([^)]*)\), \[([^\]]*)\]\)/
      .exec(src);
    expect(spec, 'buildSpec call not found — this test needs rewriting').not.toBeNull();
    expect(spec![1]).not.toMatch(/pins|nudges|placed/);
    expect(spec![2]).not.toMatch(/pins|nudges|placed/);
  });

  test('the in-flight transition is keyed on nudges, not pins', () => {
    // A box must follow the cursor without an ANIM_MS lag WHILE dragging, and
    // animate normally otherwise. Keying this on `pins` would leave a dropped
    // box permanently unanimated.
    // Comments may sit between the ? and : arms, so match across lines and
    // strip them before asserting on the arms themselves.
    const ternary = /transition: nudges\.has\(n\.id\)([\s\S]*?),\n/.exec(src);
    expect(ternary, 'transition ternary not found — this test needs rewriting')
      .not.toBeNull();
    const body = ternary![1].replace(/\/\/[^\n]*/g, '');
    const [dragArm, restArm] = body.split(':');
    // Dragging: no `transform` transition at all (the opacity fade may stay,
    // it has nothing to do with position).
    expect(dragArm).not.toMatch(/transform/);
    // Not dragging: transform eases, on the shared constant rather than a
    // literal, so the boxes cannot drift out of step with the canvas zoom.
    expect(restArm).toMatch(/transform \$\{animMs\(\)\}ms/);
  });
});
