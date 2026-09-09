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
import { autoWidth, navMinWidth, popoverPosition } from '../help/HelpLayer';

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
    const s = popoverPosition(false, undefined, undefined, 320);
    expect(centreOf(s, 320)).toBe(VW / 2);
  });

  it('centres on the viewport when the region is not mounted', () => {
    const s = popoverPosition(false, undefined, undefined, 320, null);
    expect(centreOf(s, 320)).toBe(VW / 2);
  });

  it('centres on the region when one is given', () => {
    const s = popoverPosition(false, undefined, undefined, 320, CANVAS);
    expect(centreOf(s, 320)).toBe(CANVAS.left + CANVAS.width / 2);
  });

  it('sits clear of the panel the region excludes', () => {
    // The whole point: a popover centred over the canvas must not overlap the
    // left panel that the step is talking about.
    const s = popoverPosition(false, undefined, undefined, 480, CANVAS);
    expect(s.left as number).toBeGreaterThanOrEqual(CANVAS.left);
  });

  it('stays on screen when the popover is wider than the region', () => {
    const narrow = new DOMRect(VW - 200, 0, 200, VH);
    const s = popoverPosition(false, undefined, undefined, 900, narrow);
    expect(s.left as number).toBeGreaterThanOrEqual(8);
    expect((s.left as number) + 900).toBeLessThanOrEqual(VW - 8);
  });

  it('keeps centring vertically on the viewport midline', () => {
    // The popover's height is unknown at placement time, so vertical centring
    // stays a `-50%` translate off the viewport midline regardless of region.
    const s = popoverPosition(false, undefined, undefined, 320, CANVAS);
    expect(s.top).toBe('50%');
    expect(s.transform).toBe('translateY(-50%)');
  });

  it('ignores the region once there is a real anchor', () => {
    const withRegion = popoverPosition(true, undefined, undefined, 320, CANVAS);
    const without = popoverPosition(true, undefined, undefined, 320, null);
    expect(withRegion).toEqual(without);
  });

  it('hands an anchored popover to CSS instead of placing it', () => {
    /*
     * The migration's central claim, as an assertion: with an anchor there is
     * no computed geometry at all. Anything that reintroduced a measured
     * `left`/`top` here would be the kludge coming back.
     */
    const s = popoverPosition(true, undefined, undefined, 320, null);
    expect(s.positionArea).toBeDefined();
    expect(s.left).toBeUndefined();
    expect(s.top).toBeUndefined();
    expect(s.maxHeight).toBeUndefined();
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
});

/**
 * `navMinWidth` — the floor the tour's NAV ROW imposes, independent of text.
 *
 * `autoWidth` legitimately puts a one-line beat on the 320 floor, but the row
 * under it carries a fixed set of controls plus one reveal dot per beat, does
 * not wrap, and overflowed: Siggie, 2026-09-08, of the 11-screen `admin-study`
 * step -- "too narrow popover mangling the status line". The popover takes the
 * larger of the two.
 *
 * Pins the SHAPE, not the pixels: the constants are an estimate in the same
 * spirit as `CHAR_W` and should be free to retune.
 */
describe('navMinWidth', () => {
  it('is what actually rescues the case that was mangling', () => {
    // A 75-character beat -- `admin-study`'s ResearchStudy beat, the one in
    // Siggie's screenshot. The text alone asks for the 320 floor; the row's
    // controls need more, and the larger of the two is what ships.
    const text = 'a'.repeat(75);
    expect(autoWidth(text)).toBe(320);
    expect(navMinWidth()).toBeGreaterThan(autoWidth(text));
  });

  it('does not depend on how many screens the step has', () => {
    /*
     * The dots are excluded from the floor ON PURPOSE: they wrap, so a long
     * step uses a second short row rather than forcing a wider popover. A
     * first version added per-dot width and capped it at twelve, which was
     * two mechanisms for one job (Siggie, 2026-09-08: "i don't know about
     * limiting the dot number. better might be to allow the dots to wrap").
     *
     * This takes no argument now, so the guarantee is structural rather than
     * asserted -- what this test pins is that the CSS keeps its half of the
     * bargain.
     */
    const css = readFileSync(resolve(__dirname, '../help/help.css'), 'utf8');
    const dots = css.match(/\.help-tour-dots\s*\{([^}]*)\}/)?.[1] ?? '';
    expect(dots).toMatch(/flex-wrap:\s*wrap/);
    // ...and the controls beside them must NOT wrap or shrink, or the row
    // would break up instead of the dots giving way.
    expect(css).toMatch(/\.help-tour-nav button,\s*\n\.help-tour-count\s*\{\s*flex:\s*none/);
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
 * **The shape of this test changed with the anchor-positioning migration**
 * (task 8), and deliberately so. The bug was an `maxHeight` that some BRANCH
 * forgot, and it was checked by walking every branch and asserting the number
 * each one computed. There are no branches now and no numbers: `max-height` is
 * one unconditional declaration in `help.css`, and staying on screen is
 * `position-try-fallbacks` working against the popover's real height rather
 * than arithmetic working against a guess at it.
 *
 * So this pins the CSS, the way the dots-wrap test above already does. That is
 * a WEAKER assertion than the old one and the right one: what it can still
 * catch is someone deleting the declaration that makes the guarantee, and the
 * class of bug it used to catch — one branch out of five forgetting — cannot
 * happen to a rule that has no branches.
 */
describe('a tall popover is kept on screen', () => {
  /* Comments stripped first, as in the font-size block below: this rule
     EXPLAINS at length what each declaration replaced, so matching raw text
     finds prose rather than declarations — including a comment that names
     `position-visibility` in order to say it is deliberately absent. */
  const css = readFileSync(resolve(__dirname, '../help/help.css'), 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '');
  const popover = css.match(/\n\.help-popover\s*\{([\s\S]*?)\n\}/)?.[1] ?? '';

  it('caps the popover at the viewport height, unconditionally', () => {
    expect(popover).toMatch(/max-height:\s*calc\(100vh/);
  });

  it('scrolls the BODY rather than growing past that cap', () => {
    // The cap is only survivable because the prose scrolls inside it and the
    // nav row keeps its place; a cap with no scroll just clips the text.
    expect(css).toMatch(/\.help-popover-body\s*\{[^}]*overflow-y:\s*auto/);
    expect(css).toMatch(/\.help-popover:popover-open\s*\{[^}]*display:\s*flex/);
  });

  it('flips out of a side that does not fit instead of hanging off it', () => {
    // What replaced the flip/clamp arithmetic. Both axes, plus a last-resort
    // fallback for an anchor too close to a corner for either flip.
    expect(popover).toMatch(/position-try-fallbacks:[^;]*flip-block/);
    expect(popover).toMatch(/position-try-fallbacks:[^;]*flip-inline/);
    expect(css).toMatch(/@position-try\s+--help-shift\s*\{/);
  });

  it('does not hide itself when the anchor scrolls away', () => {
    /*
     * `position-visibility: no-overflow` would make a popover vanish
     * mid-sentence when the reader scrolls away from its anchor. Recorded as a
     * decision rather than an oversight: the tour scrolls the anchor into view
     * when the step opens, and the reader is free to scroll off it afterwards.
     */
    expect(popover).not.toMatch(/position-visibility/);
  });
});

/**
 * Choosing a SIDE. Siggie, 2026-09-08: "it would have been nice if it had
 * figured out to anchor right instead of bottom. that's entirely manual right
 * now, right?" — it is not.
 *
 * The RULE survives the migration; the way it is expressed does not. It used
 * to be "below the box if `below + wantH <= vh - 8`, otherwise beside", which
 * asked whether the popover fit — and got it wrong, because `wantH` was a
 * guess. Now the growth axis picks a PREFERRED side and
 * `position-try-fallbacks` supplies the "and if there is no room there" half
 * against the real size. So what is testable here is the preference, and the
 * fallback is pinned above.
 */
describe('the popover prefers the axis the diagram does not grow along', () => {
  it('goes BELOW a box in an LR diagram', () => {
    /*
     * Siggie, 2026-08-28: in LR the graph grows rightwards, so a popover on
     * the right stands exactly where ELK will lay out the next box. Clicking
     * `cause_of_death` on step 2 put the new box under it twice running.
     */
    const s = popoverPosition(true, undefined, undefined, 320, null, 'below');
    expect(String(s.positionArea)).toMatch(/^block-end/);
  });

  it('goes BESIDE a box otherwise', () => {
    const s = popoverPosition(true, undefined, undefined, 320, null);
    expect(String(s.positionArea)).toMatch(/^inline-end/);
  });

  it('lets an authored Position: beat the automatic rule', () => {
    // Siggie, 2026-08-28: the automatic rule cannot know that a step is about
    // to open a menu into the space it just chose.
    const s = popoverPosition(true, 'left', undefined, 320, null, 'below');
    expect(String(s.positionArea)).toMatch(/^inline-start/);
  });

  it('states an OffsetX against the anchor rather than a measured width', () => {
    /*
     * `OffsetX: anchor.width * 1.3` clears one entity box plus a gutter, and
     * is relative precisely so it stays correct if NODE_W changes. It used to
     * need a measured `r.width` to multiply; `anchor-size()` says it directly.
     */
    const s = popoverPosition(true, undefined, { of: 'width', times: 1.3 }, 320, null);
    expect(s.marginLeft).toBe('calc(anchor-size(width) * 1.3)');
  });

  it('still takes a plain pixel OffsetX', () => {
    const s = popoverPosition(true, undefined, { px: 260 }, 320, null);
    expect(s.marginLeft).toBe('260px');
  });
});
