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

  test('the `--help-shift` fallback still clears the area it overrides', () => {
    // Without `position-area: none` its insets have nothing to resolve against.
    const m = /@position-try --help-shift\s*\{([\s\S]*?)\n\}/.exec(css);
    expect(m, '@position-try --help-shift is missing').not.toBeNull();
    expect(m![1]).toMatch(/position-area:\s*none/);
  });

  test('HelpLayer sets the attribute the rule keys on', () => {
    // The CSS and the component have to agree on the name, and nothing else
    // would catch them drifting apart.
    const tsx = readFileSync(resolve(__dirname, '../help/HelpLayer.tsx'), 'utf8');
    expect(tsx).toMatch(/data-anchored=\{anchored \? '' : undefined\}/);
  });
});
