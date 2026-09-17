/**
 * Hover must not engage on a redraw that happens under a stationary cursor.
 *
 * The bug (Siggie, 2026-09-17): stepping a tour relays out the canvas, a box
 * lands under the motionless pointer, and the browser fires a genuine
 * `mouseenter` on it — so `applyHover` dims every other box and edge. It reads
 * as though the tour highlighted something, competing with the spotlight that
 * is actually doing the pointing, and it does NOT clear on a small movement:
 * the browser really believes the pointer is inside that box, so it persists
 * until the cursor leaves the box entirely.
 *
 * The fix suppresses hover from each vm/layout change until a real
 * `pointermove`. That is correct however a given browser resolves
 * hover-on-insertion, which is why it is written as a suppression window
 * rather than by trying to identify the synthetic event.
 *
 * Structural assertions over the source, in the style of dragPins.test.ts and
 * layoutTransition.test.ts: reaching this through a render would need ELK (no
 * layout in jsdom) AND real hit-testing, which jsdom does not model at all —
 * it cannot place a cursor, so it cannot produce the event under test.
 */

import { describe, test, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const src = readFileSync(
  resolve(__dirname, '../explore/OwnershipGraphView.tsx'), 'utf8',
);

describe('hover after a redraw', () => {
  test('applyHover bails while suppressed, but never on a clear', () => {
    // A null target must always pass: suppression must not strand dimming
    // that is already painted on screen.
    expect(src).toMatch(
      /if \(hoverSuppressedRef\.current && target\) return;/,
    );
  });

  test('the vm/layout effect arms suppression and clears existing dimming', () => {
    const effect = /hoverSuppressedRef\.current = true;\s*\n\s*applyHover\(null\);/;
    expect(src, 'the redraw effect must both arm and clear').toMatch(effect);
  });

  test('a real pointermove releases it, once, on window', () => {
    // `window`, not the wrapper: when a tour steps, the pointer may be over a
    // box, the toolbar, or off the canvas entirely, and any of those moving
    // means the viewer is driving again.
    expect(src).toMatch(
      /window\.addEventListener\('pointermove', release, \{ once: true, passive: true \}\)/,
    );
    expect(src).toMatch(
      /const release = \(\) => \{ hoverSuppressedRef\.current = false; \};/,
    );
    expect(src).toMatch(
      /return \(\) => window\.removeEventListener\('pointermove', release\);/,
    );
  });

  test('suppression is a ref, so arming it does not itself cause a render', () => {
    expect(src).toMatch(/const hoverSuppressedRef = useRef\(false\);/);
    expect(src).not.toMatch(/useState\(false\)[^\n]*hoverSuppress/i);
  });
});
