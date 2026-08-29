/**
 * Where an UNANCHORED popover lands.
 *
 * `<HelpProvider centerOn>` names a region to centre over horizontally; these
 * pin that the region drives the horizontal placement, that it never pushes
 * the popover off-screen, and that the viewport behaviour is what you get when
 * no region is named or it is not mounted.
 *
 * NOTE: dmvd passes no `centerOn` as of 2026-08-29, so it is the last case —
 * viewport, both axes — that the app actually runs. These stay because the
 * capability is the package's, not dmvd's: the region path is still supported
 * and still has to keep working for the next host that wants it.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
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

/**
 * A CLOSED popover must not paint.
 *
 * The shell renders unconditionally and its contents are gated on `entry`, so
 * anything that keeps the closed shell visible shows as an empty bordered
 * rectangle over the canvas on page load — which is what shipped, because
 * `.help-popover { display: flex }` on the bare class overrides the UA
 * stylesheet's `[popover]:not(:popover-open) { display: none }` (Siggie,
 * 2026-08-29: "what's that rectangle doing there?").
 *
 * Asserted against the CSS text: jsdom does not implement the Popover API's
 * UA rules, so a rendering test would pass either way.
 */
describe('a closed popover is not painted', () => {
  const css = readFileSync(resolve(__dirname, '../help/help.css'), 'utf8');

  /** The body of a rule, by exact selector. */
  const ruleFor = (selector: string) =>
    css.match(new RegExp(`\\n${selector.replace('.', '\\.')}\\s*\\{([^}]*)\\}`))?.[1];

  it('does not set `display` on the bare .help-popover class', () => {
    const bare = ruleFor('.help-popover');
    expect(bare, 'the .help-popover rule should exist').toBeDefined();
    expect(bare).not.toMatch(/(^|[;\s])display\s*:/);
  });

  it('sets `display` only under :popover-open', () => {
    expect(ruleFor('.help-popover:popover-open')).toMatch(/display\s*:\s*flex/);
  });
});

/**
 * The host restyles the popover through CSS custom properties, and its
 * override sheet must LOAD AFTER the package's. Both rules are a bare
 * `.help-popover`, so specificity cannot break the tie -- only source order
 * can, and that order is an import line in `ExploreApp.tsx` that looks
 * incidental and reorders easily (an editor's organise-imports would do it).
 *
 * Siggie, 2026-08-29: "you can't put this in /src/help -- that's for the whole
 * package. i want to change for this dmvd only."
 */
describe('dmvd overrides the popover font size without touching the package', () => {
  /* Comments are stripped first. Both files EXPLAIN the px sizes they replaced
     and show an example override, so matching raw text finds prose, not
     declarations -- which is exactly how these two assertions first failed. */
  const decomment = (s: string) => s.replace(/\/\*[\s\S]*?\*\//g, '');
  const pkg = decomment(readFileSync(resolve(__dirname, '../help/help.css'), 'utf8'));
  const app = decomment(readFileSync(resolve(__dirname, '../explore/helpTheme.css'), 'utf8'));
  const explore = readFileSync(resolve(__dirname, '../explore/ExploreApp.tsx'), 'utf8');

  it('sizes every popover child in em, not px', () => {
    // A px font-size on a child would ignore the base and silently opt out of
    // the one knob. `.help-hint` is deliberately exempt: it is a fixed-position
    // dot outside the popover, not popover text.
    // `(?<!-)` so the CUSTOM PROPERTY `--help-font-size: 13px` -- which is the
    // base and must be px -- is not read as a child opting out.
    const pxSized = [...pkg.matchAll(/^(\.help-[^{]*)\{([^}]*)\}/gms)]
      .filter(([, sel, body]) =>
        /(?<!-)font-size:\s*[\d.]+px/.test(body) && !sel.includes('.help-hint'))
      .map(([, sel]) => sel.trim());
    expect(pxSized).toEqual([]);
  });

  it('keeps the package default in help.css', () => {
    expect(pkg).toMatch(/--help-font-size:\s*13px/);
  });

  it("puts dmvd's value in the app sheet, not the package", () => {
    expect(app).toMatch(/--help-font-size:\s*\d+px/);
    // Exactly one declaration in the package: the default. A second would mean
    // an app value had crept back in.
    expect(pkg.match(/--help-font-size:\s*\d+px/g)).toHaveLength(1);
  });

  it('imports the override sheet after the package CSS', () => {
    // HelpLayer is what imports help.css, so its import marks where the
    // package styles land.
    const helpLayer = explore.indexOf("from '../help/HelpLayer'");
    const theme = explore.indexOf("'./helpTheme.css'");
    expect(helpLayer, 'HelpLayer import not found').toBeGreaterThan(-1);
    expect(theme, 'helpTheme.css import not found').toBeGreaterThan(-1);
    expect(theme).toBeGreaterThan(helpLayer);
  });
});
