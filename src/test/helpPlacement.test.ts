/**
 * Where an UNANCHORED popover lands.
 *
 * `Anchor: none` used to centre on the whole viewport, which put a wide intro
 * popover half over the left panel — the very thing several of those steps
 * describe. `<HelpProvider centerOn>` names a region to centre over instead;
 * these pin that the region drives the horizontal placement, that it never
 * pushes the popover off-screen, and that the old viewport behaviour is what
 * you get when no region is named or it is not mounted.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { popoverPosition } from '../help/HelpLayer';

const VW = 1400;
const VH = 900;

/** The graph panel in a typical layout: left panel 380px wide, canvas to its right. */
const CANVAS = new DOMRect(380, 64, VW - 380, VH - 64);

beforeAll(() => {
  Object.defineProperty(window, 'innerWidth', { value: VW, configurable: true });
  Object.defineProperty(window, 'innerHeight', { value: VH, configurable: true });
});

/** Centre of a placement, given the width it was asked for. */
const centreOf = (style: React.CSSProperties, width: number) =>
  (style.left as number) + width / 2;

describe('unanchored popover placement', () => {
  it('centres on the viewport when no region is given', () => {
    const s = popoverPosition(null, undefined, undefined, 320);
    expect(centreOf(s, 320)).toBe(VW / 2);
  });

  it('centres on the viewport when the region is not mounted', () => {
    const s = popoverPosition(null, undefined, undefined, 320, null);
    expect(centreOf(s, 320)).toBe(VW / 2);
  });

  it('centres on the region when one is given', () => {
    const s = popoverPosition(null, undefined, undefined, 320, CANVAS);
    expect(centreOf(s, 320)).toBe(CANVAS.left + CANVAS.width / 2);
  });

  it('sits clear of the panel the region excludes', () => {
    // The whole point: a popover centred over the canvas must not overlap the
    // left panel that the step is talking about.
    const s = popoverPosition(null, undefined, undefined, 480, CANVAS);
    expect(s.left as number).toBeGreaterThanOrEqual(CANVAS.left);
  });

  it('stays on screen when the popover is wider than the region', () => {
    const narrow = new DOMRect(VW - 200, 0, 200, VH);
    const s = popoverPosition(null, undefined, undefined, 900, narrow);
    expect(s.left as number).toBeGreaterThanOrEqual(8);
    expect((s.left as number) + 900).toBeLessThanOrEqual(VW - 8);
  });

  it('keeps centring vertically on the viewport midline', () => {
    // The popover's height is unknown at placement time, so vertical centring
    // stays a `-50%` translate off the viewport midline regardless of region.
    const s = popoverPosition(null, undefined, undefined, 320, CANVAS);
    expect(s.top).toBe('50%');
    expect(s.transform).toBe('translateY(-50%)');
  });

  it('ignores the region once there is a real anchor', () => {
    const anchor = new DOMRect(400, 300, 120, 40);
    const withRegion = popoverPosition(anchor, undefined, undefined, 320, CANVAS);
    const without = popoverPosition(anchor, undefined, undefined, 320, null);
    expect(withRegion).toEqual(without);
  });
});
