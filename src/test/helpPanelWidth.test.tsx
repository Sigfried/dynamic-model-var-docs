import { describe, test, expect } from 'vitest';
import { render } from '@testing-library/react';
import HelpPanel from '../explore/HelpPanel';
import {
  PANEL_MIN_PX, PANEL_WIDTH_FRACTION, offsetRightPx, panelInsetPx,
} from '../explore/panelLayout';

/**
 * Two open panels must sit BESIDE each other, and that is arithmetic between
 * numbers that used to be Tailwind string literals in two different files
 * (`w-[26rem]` here, `right-[27rem]` there). Widening the legend in that
 * arrangement would have slid the cases pane under it with nothing failing.
 *
 * They are derived from one module now; this is what says so.
 *
 * ⚠️ These are claims about STYLE TEXT, not geometry — jsdom has no layout.
 * Whether the canvas actually clears the panel is an e2e question
 * (docs/TESTING.md); what vitest can pin is that the numbers agree.
 */
describe('HelpPanel width and offset', () => {
  const panelOf = (el: HTMLElement) =>
    el.querySelector('[data-draggable]') as HTMLElement;

  test('a stepped-aside panel starts clear of the legend', () => {
    expect(offsetRightPx(1440)).toBeGreaterThan(
      Math.max(PANEL_MIN_PX.legend, 1440 * PANEL_WIDTH_FRACTION));
  });

  test('width comes from the kind, and defaults to the narrower panel', () => {
    const expected = (k: keyof typeof PANEL_MIN_PX) =>
      Math.max(PANEL_MIN_PX[k], window.innerWidth * PANEL_WIDTH_FRACTION);

    const wide = panelOf(render(
      <HelpPanel title="w" onClose={() => {}} kind="legend">x</HelpPanel>,
    ).container);
    expect(wide.style.width).toBe(`${expected('legend')}px`);

    const plain = panelOf(render(
      <HelpPanel title="p" onClose={() => {}}>x</HelpPanel>,
    ).container);
    expect(plain.style.width).toBe(`${expected('cases')}px`);
  });

  /*
   * The legend's floor is set by its pivot tables, the cases pane's by prose.
   * Not pinned to the widest pivot (487px of content, measured 2026-09-22):
   * Siggie set the floor below that by eye (99c5f0c).
   */
  test('the legend opens wider than the cases pane', () => {
    expect(PANEL_MIN_PX.legend).toBeGreaterThan(PANEL_MIN_PX.cases);
  });

  test('offset drives `right` inline, and drops the class that would fight it', () => {
    const off = panelOf(render(
      <HelpPanel title="o" onClose={() => {}} offset>x</HelpPanel>,
    ).container);
    expect(off.style.right).toBe(`${offsetRightPx(window.innerWidth)}px`);
    expect(off.className).not.toContain('right-4');

    const on = panelOf(render(
      <HelpPanel title="n" onClose={() => {}}>x</HelpPanel>,
    ).container);
    expect(on.style.right).toBe('');
    expect(on.className).toContain('right-4');
  });

  /*
   * The height cap has to be an inline `maxHeight`, never a `max-h-*` class.
   * A CSS max also caps `resize: both`, so dragging the corner down just
   * stopped — which reads as the grip being broken rather than as a limit
   * (Siggie, 2026-09-11). `max-h-[80vh]` also left a fifth of the viewport
   * unused by default.
   */
  test('the height cap leaves no room-to-grow on the table', () => {
    const el = panelOf(render(
      <HelpPanel title="h" onClose={() => {}}>x</HelpPanel>,
    ).container);
    expect(el.className).not.toMatch(/\bmax-h-/);
    expect(el.style.maxHeight).toBe('calc(100vh - 4.5rem)');
    expect(el.style.resize).toBe('both');
  });

  test('a wide panel still fits a narrow viewport', () => {
    const el = panelOf(render(
      <HelpPanel title="m" onClose={() => {}} kind="legend">x</HelpPanel>,
    ).container);
    expect(el.style.maxWidth).toBe('calc(100vw - 2rem)');
  });

  /*
   * The sticky header must out-stack the pivot tables' POSITIONED descendants
   * (`.lt-label` is `position: relative`, `.lt-toggle` `absolute`). Without a
   * z-index those paint over it in tree order, so group labels scrolled across
   * the header while plain rows went under — Siggie, 2026-09-22, and the
   * "some stuff, not everything" tell.
   */
  test('the sticky header stacks above the scrolling body', () => {
    const el = panelOf(render(
      <HelpPanel title="s" onClose={() => {}}>x</HelpPanel>,
    ).container);
    const header = el.querySelector('.sticky') as HTMLElement;
    expect(header.className).toMatch(/\bz-\d+/);
  });
});

/**
 * The canvas's right inset — bug (a) of TASKS `panel-refit`. `HelpPanel` is an
 * overlay that never enters layout, so the canvas cannot see it and has to be
 * told how much room to leave.
 */
describe('panelInsetPx', () => {
  test('nothing open means no inset', () => {
    expect(panelInsetPx({ legend: false, cases: false }, 1440)).toBe(0);
  });

  test('either panel alone reserves its own width', () => {
    const legend = panelInsetPx({ legend: true, cases: false }, 1440);
    const cases = panelInsetPx({ legend: false, cases: true }, 1440);
    expect(legend).toBeGreaterThan(PANEL_MIN_PX.legend);
    expect(cases).toBeGreaterThan(PANEL_MIN_PX.cases);
  });

  test('both open reaches further left than either alone', () => {
    const both = panelInsetPx({ legend: true, cases: true }, 1440);
    expect(both).toBeGreaterThan(panelInsetPx({ legend: true, cases: false }, 1440));
    expect(both).toBeGreaterThan(panelInsetPx({ legend: false, cases: true }, 1440));
  });

  /* The floors are what stop a narrow window from collapsing a panel below its
     own content; above them the fraction governs. */
  test('the fraction governs on a wide viewport, the floor on a narrow one', () => {
    expect(panelInsetPx({ legend: true, cases: false }, 3000))
      .toBeGreaterThan(panelInsetPx({ legend: true, cases: false }, 1000));
    expect(panelInsetPx({ legend: true, cases: false }, 600))
      .toBe(panelInsetPx({ legend: true, cases: false }, 800));
  });
});
