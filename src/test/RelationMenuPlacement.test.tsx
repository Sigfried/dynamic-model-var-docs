import { describe, test, expect, vi, afterEach } from 'vitest';
import { render, fireEvent, cleanup } from '@testing-library/react';
import { RelationMenu } from '../explore/RelationMenu';
import type { RelationGroupVM } from '../explore/OwnershipGraphView';

/**
 * Where the cascade's submenu opens.
 *
 * ⚠️ READ `docs/TESTING.md`, "Testing code that measures layout", BEFORE
 * EDITING. jsdom has no layout engine, so a test like this passes vacuously
 * unless every property the component reads is stubbed — and an unstubbed one
 * makes a CORRECT fix look broken. That is not hypothetical; it happened while
 * writing this file.
 *
 * Split from RelationMenu.test.tsx because these tests have to fake layout:
 * jsdom reports every element as 0×0 with a null `offsetParent`, so the flip
 * logic would see zeroes and every assertion would pass vacuously. `stubLayout`
 * supplies plausible geometry; the numbers are the component's own Tailwind
 * widths (parent `min-w-[13rem]` = 208px, submenu `min-w-[14rem]` = 224px).
 * Keep those in sync with the component if its widths change — nothing here
 * reads the real CSS.
 *
 * The bug that motivated the file: the submenu measured ITS OWN `right` to
 * decide whether to flip, which is self-referential. Switching branches re-ran
 * the measurement while the previous branch's flip was still applied — from the
 * left it looks like it fits, so the flip cleared, the panel jumped right, and
 * it hung off the viewport with nothing left to re-measure (Siggie, 2026-08-27).
 */

const PARENT_W = 208;
const SUB_W = 224;

/** Fake enough layout for the flip logic to have something real to read. */
function stubLayout(innerWidth: number, triggerLeft = 600) {
  Object.defineProperty(window, 'innerWidth', { value: innerWidth, configurable: true });
  Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true });
  const isSub = (el: HTMLElement) => el.hasAttribute('data-relation-submenu');

  Object.defineProperty(HTMLElement.prototype, 'offsetParent', {
    configurable: true,
    get(this: HTMLElement) { return isSub(this) ? this.parentElement : null; },
  });
  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
    configurable: true,
    get(this: HTMLElement) { return isSub(this) ? SUB_W : 0; },
  });
  Element.prototype.getBoundingClientRect = function (this: Element) {
    const el = this as HTMLElement;
    if (el.hasAttribute('data-relation-trigger')) {
      return { left: triggerLeft, right: triggerLeft + 120, top: 100, bottom: 120 } as DOMRect;
    }
    if (el.hasAttribute('data-relation-menu') && !isSub(el)) {
      // The panel is `fixed` and positioned by useClamped, so its own style is
      // the truth about where it ended up.
      const left = parseFloat(el.style.left || String(triggerLeft));
      return { left, right: left + PARENT_W, top: 122, bottom: 322,
               width: PARENT_W, height: 200 } as DOMRect;
    }
    return { left: 0, right: 0, top: 0, bottom: 0, width: 0, height: 0 } as DOMRect;
  };
}

describe('RelationMenu submenu placement', () => {
  const groups: RelationGroupVM[] = [
    {
      position: 'owns-mine', label: 'belong to me by my attribute',
      items: [{ other: 'A', slots: ['a'], drawn: false },
              { other: 'B', slots: ['b'], drawn: false }],
    },
    {
      position: 'owned-mine', label: 'I belong to, by my attribute',
      items: [{ other: 'Organization', slots: ['performed_by'], drawn: true },
              { other: 'Participant', slots: ['associated_participant'], drawn: true },
              { other: 'Visit', slots: ['associated_visit'], drawn: true }],
    },
  ];

  const openMenu = () => {
    render(
      <RelationMenu label="ObservationSet" groups={groups}
        relatedCount={5} shownCount={3} onAdd={vi.fn()} onRemove={vi.fn()} />,
    );
    fireEvent.click(document.querySelector('[data-relation-trigger]') as HTMLElement);
  };
  const openBranch = (i: number) => {
    fireEvent.click(document.querySelectorAll('[data-relation-group]')[i] as HTMLElement);
    return document.querySelector('[data-relation-submenu]') as HTMLElement;
  };
  /** Where the submenu's right edge lands, given which side it opened on. */
  const rightEdge = (sub: HTMLElement) => {
    const panel = sub.parentElement as HTMLElement;
    const pl = parseFloat(panel.style.left);
    const w = sub.style.maxWidth ? parseFloat(sub.style.maxWidth) : SUB_W;
    return sub.className.includes('right-full') ? pl : pl + PARENT_W + w;
  };

  // stubLayout patches shared prototypes. Vitest isolates files today, but the
  // patches are restored anyway so this cannot become a spooky failure in a
  // neighbouring file if that ever changes.
  const original = {
    rect: Element.prototype.getBoundingClientRect,
    parent: Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetParent'),
    width: Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth'),
    w: window.innerWidth,
    h: window.innerHeight,
  };
  afterEach(() => {
    cleanup();
    Element.prototype.getBoundingClientRect = original.rect;
    if (original.parent) Object.defineProperty(HTMLElement.prototype, 'offsetParent', original.parent);
    if (original.width) Object.defineProperty(HTMLElement.prototype, 'offsetWidth', original.width);
    Object.defineProperty(window, 'innerWidth', { value: original.w, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: original.h, configurable: true });
  });

  test('opens leftward when the right gutter cannot hold it', () => {
    stubLayout(676);
    openMenu();
    const sub = openBranch(1);
    expect(sub.className).toContain('right-full');
    expect(rightEdge(sub)).toBeLessThanOrEqual(676);
  });

  test('stays put across branch switches — the overflow bug', () => {
    /*
     * The regression test. Before the fix this sequence produced
     * right-full=false on the second switch and a right edge of 894 against a
     * 676px viewport: the flip was computed from the flipped panel's own
     * position, so it un-flipped itself and never measured again.
     */
    stubLayout(676);
    openMenu();
    for (const i of [1, 0, 1, 0]) {
      const sub = openBranch(i);
      expect(sub.className).toContain('right-full');
      expect(rightEdge(sub)).toBeLessThanOrEqual(676);
    }
  });

  test('caps its width when neither gutter can hold it', () => {
    // 208 + 224 = 432 > 400, so no side fits. Rather than overflow, it takes
    // the roomier side and shrinks to it.
    stubLayout(400);
    openMenu();
    const sub = openBranch(1);
    const capped = parseFloat(sub.style.maxWidth);
    expect(capped).toBeGreaterThan(0);
    expect(capped).toBeLessThan(SUB_W);
    // min-w-[14rem] would otherwise defeat the cap.
    expect(parseFloat(sub.style.minWidth)).toBe(0);
    expect(rightEdge(sub)).toBeLessThanOrEqual(400);
  });

  test('does not cap when there is room — a wide window keeps full width', () => {
    stubLayout(1600, 200);
    openMenu();
    const sub = openBranch(1);
    expect(sub.className).toContain('left-full');
    expect(sub.style.maxWidth).toBe('');
  });
});
