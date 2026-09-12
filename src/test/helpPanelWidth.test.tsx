import { describe, test, expect } from 'vitest';
import { render } from '@testing-library/react';
import HelpPanel from '../explore/HelpPanel';
import { PANEL_WIDTH_REM, OFFSET_RIGHT_REM } from '../explore/panelLayout';

/**
 * Two open panels must sit BESIDE each other, and that is arithmetic between
 * two numbers that used to be Tailwind string literals in two different files
 * (`w-[26rem]` here, `right-[27rem]` there). Widening the legend to 36rem in
 * that arrangement would have slid the cases pane under it with nothing
 * failing — the kind of break only a person opening both panels would see.
 *
 * They are derived from one constant now; this is what says so.
 */
describe('HelpPanel width and offset', () => {
  const panelOf = (el: HTMLElement) =>
    el.querySelector('[data-draggable]') as HTMLElement;

  test('a stepped-aside panel starts clear of the legend', () => {
    expect(OFFSET_RIGHT_REM).toBeGreaterThan(PANEL_WIDTH_REM.legend);
  });

  test('width comes from the prop, and defaults to the narrower panel', () => {
    const wide = panelOf(render(
      <HelpPanel title="w" onClose={() => {}} widthRem={PANEL_WIDTH_REM.legend}>x</HelpPanel>,
    ).container);
    expect(wide.style.width).toBe(`${PANEL_WIDTH_REM.legend}rem`);

    const plain = panelOf(render(
      <HelpPanel title="p" onClose={() => {}}>x</HelpPanel>,
    ).container);
    expect(plain.style.width).toBe(`${PANEL_WIDTH_REM.cases}rem`);
  });

  test('offset drives `right` inline, and drops the class that would fight it', () => {
    const off = panelOf(render(
      <HelpPanel title="o" onClose={() => {}} offset>x</HelpPanel>,
    ).container);
    expect(off.style.right).toBe(`${OFFSET_RIGHT_REM}rem`);
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
      <HelpPanel title="m" onClose={() => {}} widthRem={99}>x</HelpPanel>,
    ).container);
    expect(el.style.maxWidth).toBe('calc(100vw - 2rem)');
  });
});
