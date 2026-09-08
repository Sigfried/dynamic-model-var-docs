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
import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { autoWidth, popoverPosition } from '../help/HelpLayer';

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
    /*
     * Every declaration in the PACKAGE is the package default, whichever
     * surface it is on. There are two now — `.help-popover` and `.help-map`,
     * which is `fixed` and so cannot inherit the popover's — and there will be
     * one per surface that needs the knob.
     *
     * This asserted `toHaveLength(1)` until the map landed. That was a proxy
     * for the real rule ("no dmvd value in the package") that happened to hold
     * while there was one surface, and it failed on a second legitimate
     * DEFAULT. The rule is checked directly now, so adding a surface does not
     * fail and an app value creeping back in still does.
     */
    const inPackage = pkg.match(/--help-font-size:\s*(\d+)px/g) ?? [];
    expect(inPackage.length).toBeGreaterThan(0);
    for (const decl of inPackage) expect(decl).toMatch(/13px/);
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

/**
 * `autoWidth` — the width a step gets when it authors no `Width:`.
 *
 * These pin the SHAPE of the curve (monotonic, clamped, floored at the old
 * flat default) rather than exact pixel values, which are tuning and should be
 * free to move. The one place a number is asserted is the floor, because
 * that is a compatibility promise: auto width replaced a constant 320, and
 * every existing unauthored step is short enough to sit on it.
 */
describe('autoWidth', () => {
  it('never goes below the old flat default', () => {
    for (const text of ['', 'short', 'a'.repeat(200)]) {
      expect(autoWidth(text)).toBeGreaterThanOrEqual(320);
    }
  });

  it('leaves a typical short step exactly where it was', () => {
    /*
     * Most authored beats are one or two sentences, and those must come out at
     * the old flat 320 rather than being nudged a few px for no visible reason.
     *
     * 150 chars is comfortably inside the floor region and stays there across
     * retunings; the exact length at which the curve leaves 320 is TUNING
     * (it has already moved once, from ~270 to ~180 when ASPECT went 2.0→3.0)
     * and pinning it would make this test fail for the wrong reason.
     */
    expect(autoWidth('a'.repeat(150))).toBe(320);
  });

  it('never exceeds the widest width an author asks for', () => {
    expect(autoWidth('a'.repeat(100_000))).toBeLessThanOrEqual(800);
  });

  it('grows with the amount of text', () => {
    const widths = [400, 800, 1600, 3200].map(n => autoWidth('a'.repeat(n)));
    for (let i = 1; i < widths.length; i++) {
      expect(widths[i]).toBeGreaterThanOrEqual(widths[i - 1]);
    }
    // ...and actually grows somewhere in that range, rather than being pinned
    // flat at a clamp the whole way.
    expect(widths.at(-1)!).toBeGreaterThan(widths[0]);
  });

  it('ignores surrounding whitespace', () => {
    expect(autoWidth('  \n\n  hello  \n ')).toBe(autoWidth('hello'));
  });

  it('keeps a long popover from running absurdly tall', () => {
    /*
     * The property the tuning actually exists to hold: at the chosen width,
     * text should not need a wildly out-of-band number of lines. Checked as a
     * height estimate rather than by asserting a width, so retuning CHAR_W /
     * LINE_H / ASPECT together does not break the test for the wrong reason.
     */
    const chars = 1500;
    const w = autoWidth('a'.repeat(chars));
    const estHeight = (chars * 8 / w) * 24;
    expect(estHeight).toBeLessThan(600);
  });
});

/**
 * A TALL popover stays on screen.
 *
 * REGRESSION (2026-09-08, "popover getting cut off again"). Every anchored
 * placement clamped and chose against `EST_H = 260`, a constant guess at the
 * popover's height, and set no `maxHeight` at all — so a step whose text comes
 * from the model, and which is nearer 400px tall, was placed with 260px of
 * room and simply hung off the bottom of the screen.
 *
 * The constant did TWO jobs badly. It also gated the LR "put it below the box"
 * rule, so a popover that could not fit below still went below instead of
 * falling through to the beside-with-more-room rule.
 */
describe('a tall popover is kept on screen', () => {
  /** ~435 characters: a real BDCHM class description. */
  const LONG = 'x'.repeat(435);

  it('never extends past the bottom of the viewport', () => {
    // Anchored low, which is where the clipping showed up.
    const anchor = new DOMRect(110, 550, 350, 560);
    const s = popoverPosition(anchor, undefined, undefined, 500, null, LONG);
    const top = s.top as number;
    const maxH = parseInt(String(s.maxHeight), 10);
    expect(top + maxH).toBeLessThanOrEqual(VH);
  });

  it('always caps its height, at every anchored placement', () => {
    /*
     * The bug was an ABSENT maxHeight, so pin that every branch sets one:
     * authored side, beside-the-anchor, and the canvas rule below.
     */
    const anchor = new DOMRect(110, 550, 350, 560);
    for (const side of [undefined, 'left', 'right', 'top', 'bottom'] as const) {
      const s = popoverPosition(anchor, side, undefined, 500, null, LONG);
      expect(s.maxHeight, `side=${side}`).toBeDefined();
      const top = s.top as number;
      expect(top + parseInt(String(s.maxHeight), 10), `side=${side}`)
        .toBeLessThanOrEqual(VH);
    }
  });

  it('slides UP to fit rather than being squeezed to a sliver', () => {
    /*
     * Clamping alone put a 500px popover at top 712 in a 900px viewport and
     * capped it to 180px — a sliver with two thirds of the screen empty above
     * it. A tall popover anchored low should move up the screen.
     */
    const anchor = new DOMRect(110, 700, 350, 150);
    const s = popoverPosition(anchor, undefined, undefined, 500, null, LONG);
    expect(parseInt(String(s.maxHeight), 10)).toBeGreaterThan(300);
  });

  it('leaves a short popover where it was', () => {
    // The fix must not move the steps that were already placed correctly.
    const anchor = new DOMRect(110, 200, 350, 40);
    const short = popoverPosition(anchor, undefined, undefined, 320, null, 'A short beat.');
    expect(short.top as number).toBeGreaterThan(8);
    expect(short.top as number).toBeLessThan(VH / 2);
  });
});

/**
 * Choosing a SIDE. Siggie, 2026-09-08: "it would have been nice if it had
 * figured out to anchor right instead of bottom. that's entirely manual right
 * now, right?" — it is not; the automatic rule was just deciding on the wrong
 * number.
 */
describe('the LR below-the-box rule yields when there is no room', () => {
  const canvas = () => {
    document.body.innerHTML = '<div data-graph-direction="RIGHT"></div>';
    const c = document.querySelector('[data-graph-direction]')!;
    c.getBoundingClientRect = () => new DOMRect(0, 100, VW, VH - 100);
    return c;
  };

  afterEach(() => { document.body.innerHTML = ''; });

  it('goes BESIDE a low box when the popover is too tall to fit below', () => {
    canvas();
    // A tall box low on the canvas: 560 tall starting at 550, so "below" is
    // off-screen for anything but a very short popover.
    const anchor = new DOMRect(110, 550, 350, 560);
    const s = popoverPosition(anchor, undefined, undefined, 500, null, 'x'.repeat(435));
    // Beside means to the RIGHT of the box here, since that is the empty half.
    expect(s.left as number).toBeGreaterThanOrEqual(anchor.right);
  });

  it('still goes below a box with room under it', () => {
    // The rule exists so the popover does not stand where ELK lays out the
    // next box; it must keep working when it can.
    canvas();
    const anchor = new DOMRect(110, 150, 350, 80);
    const s = popoverPosition(anchor, undefined, undefined, 320, null, 'A short beat.');
    expect(s.top as number).toBeGreaterThanOrEqual(anchor.bottom);
  });
});
