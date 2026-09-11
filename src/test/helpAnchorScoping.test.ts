/**
 * Two rules that a browser enforces and jsdom cannot, pinned against the CSS
 * source and the built stylesheet instead.
 *
 * Both are 2026-09-09 regressions, and both were invisible to every existing
 * test because the failure is in the CASCADE, not in any value a test could read
 * off an element: jsdom does not implement CSS anchor positioning at all.
 */

import { describe, test, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const css = readFileSync(resolve(__dirname, '../help/help.css'), 'utf8');

/** `.help-popover { ... }` — the bare rule, not the `[data-anchored]` one. */
function barePopoverRule(): string {
  // The declaration block of the rule whose selector list is exactly
  // `.help-popover, .help-map` or `.help-popover`.
  const m = /\n\.help-popover(?:,\s*\.help-map)?\s*\{([\s\S]*?)\n\}/.exec(css);
  return m?.[1] ?? '';
}

describe('the anchor machinery is scoped to an anchored step', () => {
  /*
   * THE BUG THIS PINS (Siggie, 2026-09-09): *"every popover after that ends up
   * in the same place... forwards and backwards"*, and step 9 `why` rendering
   * invisible.
   *
   * An unanchored step is placed by an inline `left`/`top`/`transform` from
   * `popoverPosition`. While `position-anchor: --help-anchor` sat on the BARE
   * class it applied to those steps too, resolving to nothing — so the default
   * `position-area` could not resolve, the browser walked `position-try-fallbacks`
   * to `--help-shift`, and that fallback's `inset: 8px auto auto 8px` BEAT the
   * inline style. Position-try declarations overriding inline is the whole point
   * of position-try, and the one way an inline `top` can lose.
   *
   * It stuck across steps because it is a property of the element's placement
   * state, not of the step.
   */
  test('`position-anchor` is NOT on the bare .help-popover rule', () => {
    expect(barePopoverRule()).not.toMatch(/position-anchor/);
  });

  test('`position-try-fallbacks` is NOT on the bare .help-popover rule', () => {
    expect(barePopoverRule()).not.toMatch(/position-try-fallbacks/);
  });

  test('both live on the [data-anchored] rule instead', () => {
    const m = /\.help-popover\[data-anchored\]\s*\{([\s\S]*?)\n\}/.exec(css);
    expect(m, '.help-popover[data-anchored] rule is missing').not.toBeNull();
    expect(m![1]).toMatch(/position-anchor:\s*--help-anchor/);
    expect(m![1]).toMatch(/position-try-fallbacks:/);
  });

  test('the spotlight still names its anchor', () => {
    /*
     * The collateral loss of the split above. The commit that scoped the
     * popover's `position-anchor` (4cd814d) also deleted it from
     * `.help-spotlight`, whose four `anchor()` calls then had no default anchor
     * and were invalid: the ring collapsed to a 4px box at the page origin and
     * its 9999px shadow dimmed the whole viewport with no hole in it. No test
     * mentioned the spotlight, so it shipped (Siggie, 2026-09-09: *"why am i
     * not seeing highlighting in the tour?"*).
     *
     * The scoping argument does not apply here: the spotlight is rendered only
     * when the anchor resolved, so its name never points at nothing.
     */
    const m = /\n\.help-spotlight\s*\{([\s\S]*?)\n\}/.exec(css);
    expect(m, '.help-spotlight rule is missing').not.toBeNull();
    expect(m![1]).toMatch(/position-anchor:\s*--help-anchor/);
    expect(m![1]).toMatch(/anchor\(left\)/);
  });

  test('NO fallback abandons the anchor', () => {
    /*
     * The guarantee the whole placement scheme rests on. Siggie, 2026-09-09:
     * *"all it really needs to do (since we're not going to succeed at getting
     * the popover to avoid everything) is not go on top of what it's anchored
     * on."* `position-area` gives that for free — but only while an area is in
     * effect.
     *
     * `--help-shift` used to be `position-area: none; inset: 8px auto auto 8px`,
     * pinning the popover to the viewport's top-left corner. That is the one
     * placement that can cover the element the step points at, and it fired
     * whenever a tall box left no room on any side — the misplacement at 3.2 and
     * 8.2 that persisted forwards and backwards.
     *
     * So: every `@position-try` block here must name a real area, and none may
     * set `position-area: none` or drive placement with raw `inset`.
     */
    const blocks = [...css.matchAll(/@position-try\s+(--[\w-]+)\s*\{([\s\S]*?)\n\}/g)];
    expect(blocks.length, 'no @position-try blocks found').toBeGreaterThan(0);
    for (const [, name, body] of blocks) {
      expect(body, `${name} drops the anchor`).not.toMatch(/position-area:\s*none/);
      expect(body, `${name} places by raw inset`).not.toMatch(/^\s*inset:/m);
      expect(body, `${name} names no area`).toMatch(/position-area:\s*\S/);
    }
  });

  test('every named fallback is actually listed in position-try-fallbacks', () => {
    // A block nothing references is dead, and a name in the list with no block
    // is silently skipped — both leave the last resort weaker than it reads.
    const declared = [...css.matchAll(/@position-try\s+(--[\w-]+)/g)].map(m => m[1]);
    const listed = /position-try-fallbacks:([\s\S]*?);/.exec(css)?.[1] ?? '';
    for (const name of declared) {
      expect(listed, `${name} is declared but never used`).toContain(name);
    }
  });

  test('the preferred SIDE re-resolves with the element, not once per step', () => {
    /*
     * THE BUG (Siggie, 2026-09-09): *"still getting misplacement at 3.2 and
     * forwards/backwards from there"*, at a step that differed between a warm
     * profile (3.2) and incognito (8.2).
     *
     * `anchorSide` asks "is this element inside an LR canvas" -- a question
     * about the ELEMENT, which often does not exist when the step opens (the box
     * arrives with the render the `Change:` causes) and is destroyed and rebuilt
     * on every ELK relayout. It was a `useMemo` keyed on the step, so it ran
     * once, usually too early, got null, and left the side undefined for that
     * step and every later one.
     *
     * With no side an LR step prefers BESIDE the box, finds no room, flips twice
     * and falls through to `--help-shift` -- the top-left corner. Relayout
     * timing is why the first bitten step moved around.
     *
     * Pinned structurally: the value must be published from the tagging effect,
     * which the MutationObserver re-runs, and must NOT be a `useMemo` again.
     */
    const tsx = readFileSync(resolve(__dirname, '../help/HelpLayer.tsx'), 'utf8');
    expect(tsx).toMatch(/setAnchorSide\(el\?\.closest\('\[data-graph-direction\]'\)/);
    expect(tsx, 'anchorSide must not go back to a step-keyed useMemo')
      .not.toMatch(/const anchorSide = useMemo/);
  });

  test('HelpLayer sets the attribute the rule keys on', () => {
    // The CSS and the component have to agree on the name, and nothing else
    // would catch them drifting apart.
    const tsx = readFileSync(resolve(__dirname, '../help/HelpLayer.tsx'), 'utf8');
    // `&& !drag.offset`: a dragged popover drops the machinery too (2026-09-10).
    expect(tsx).toMatch(/data-anchored=\{anchored && !drag\.offset \? '' : undefined\}/);
  });
});
