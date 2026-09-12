/**
 * Dragging an overlay by its header (docs/HELP_PACKAGE_PLAN.md §1b).
 *
 * ⚠️ **What jsdom can and cannot say here.** It has no layout, so every
 * `getBoundingClientRect()` is a zero rect (docs/TESTING.md) — and the hook reads
 * one, to start a drag from where the element already sits. So `FRAME` below
 * fakes a plausible one; without it the clamps are computed against a 0×0 box and
 * the numbers mean nothing.
 *
 * What jsdom cannot answer at all is whether the dragged popover LANDS where it
 * was dropped once CSS anchor positioning is out of the way: `position-area`,
 * `inset` from the UA's popover rules and a `transform` all fight an inline
 * `left`, and only a browser settles that. So these pin the arithmetic and the
 * click contract; the placement itself is checked by eye.
 *
 * `setPointerCapture` / `releasePointerCapture` are stubbed: jsdom implements
 * neither, and calling one throws rather than degrading.
 */

import { describe, test, expect, beforeAll, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { useDragged } from '../help/useDragged';

const VW = 1400;
const VH = 900;
/** Where the overlay sits before anything is dragged: a 416px panel at the
 *  layout's top right, which is HelpPanel's real `top-14 right-4`. The width is
 *  just a fixture — this tests the drag hook, not the panel, whose width has
 *  been a `panelLayout.ts` constant rather than a class since 2026-09-11. */
const FRAME = { left: VW - 416 - 16, top: 56, width: 416, height: 300 };

beforeAll(() => {
  Object.assign(Element.prototype, {
    setPointerCapture() {},
    releasePointerCapture() {},
  });
  Object.defineProperty(window, 'innerWidth', { value: VW, configurable: true });
  Object.defineProperty(window, 'innerHeight', { value: VH, configurable: true });
});

/** A minimal overlay: a draggable frame, a header handle, and a button inside
 *  the handle that must keep working. */
function Overlay({ onPress }: { onPress?: () => void }) {
  const drag = useDragged();
  return (
    <div
      data-draggable=""
      data-testid="frame"
      ref={el => {
        // jsdom lays nothing out, and the hook reads this to find its origin.
        if (el) el.getBoundingClientRect = () =>
          ({ ...FRAME, right: FRAME.left + FRAME.width, bottom: FRAME.top + FRAME.height,
             x: FRAME.left, y: FRAME.top, toJSON: () => ({}) }) as DOMRect;
      }}
      style={drag.offset ? { position: 'fixed', ...drag.offset } : undefined}
    >
      <div data-testid="handle" onPointerDown={drag.onPointerDown}>
        header
        <button onClick={onPress}>×</button>
      </div>
      <button data-testid="reset" onClick={drag.reset}>put back</button>
      <span data-testid="state">{drag.offset ? `${drag.offset.left},${drag.offset.top}` : 'none'}</span>
    </div>
  );
}

/** One drag, in the three events a pointer drag really is. */
function dragBy(handle: Element, dx: number, dy: number) {
  fireEvent.pointerDown(handle, { button: 0, pointerId: 1, clientX: 0, clientY: 0 });
  fireEvent.pointerMove(handle, { pointerId: 1, clientX: dx, clientY: dy });
  fireEvent.pointerUp(handle, { pointerId: 1, clientX: dx, clientY: dy });
}

describe('useDragged', () => {
  test('does nothing until something is dragged', () => {
    const { getByTestId } = render(<Overlay />);
    expect(getByTestId('state').textContent).toBe('none');
    // The null is load-bearing: while it holds, the caller's own placement runs
    // untouched, so nothing has to reimplement a layout to be draggable.
    expect(getByTestId('frame').getAttribute('style')).toBeNull();
  });

  test('a drag moves the frame by the pointer delta', () => {
    const { getByTestId } = render(<Overlay />);
    dragBy(getByTestId('handle'), -300, 120);
    // From where it SAT, not from the origin: the first drag must not jump.
    expect(getByTestId('state').textContent)
      .toBe(`${FRAME.left - 300},${FRAME.top + 120}`);
    expect(getByTestId('frame').style.position).toBe('fixed');
  });

  test('a movement under the slop is a CLICK, not a drag', () => {
    /*
     * The bug this guards is the one the diagram's node drag hit in 2026-08:
     * `pointerdown` fires before `click`, so a handle that captures the pointer
     * on every press eats the clicks of everything inside it. 2px of hand
     * tremor while pressing the × must still close the panel.
     */
    const onPress = vi.fn();
    const { getByTestId, getByRole } = render(<Overlay onPress={onPress} />);
    const handle = getByTestId('handle');
    fireEvent.pointerDown(handle, { button: 0, pointerId: 1, clientX: 0, clientY: 0 });
    fireEvent.pointerMove(handle, { pointerId: 1, clientX: 2, clientY: 1 });
    fireEvent.pointerUp(handle, { pointerId: 1, clientX: 2, clientY: 1 });
    expect(getByTestId('state').textContent).toBe('none');
    fireEvent.click(getByRole('button', { name: '×' }));
    expect(onPress).toHaveBeenCalled();
  });

  test('a press on a control inside the handle starts no drag at all', () => {
    const { getByTestId, getByRole } = render(<Overlay />);
    const button = getByRole('button', { name: '×' });
    fireEvent.pointerDown(button, { button: 0, pointerId: 1, clientX: 0, clientY: 0 });
    fireEvent.pointerMove(getByTestId('handle'), { pointerId: 1, clientX: 200, clientY: 200 });
    expect(getByTestId('state').textContent).toBe('none');
  });

  test('a non-primary button starts no drag', () => {
    // A right-click on the header is a context menu, not the start of a move.
    const { getByTestId } = render(<Overlay />);
    const handle = getByTestId('handle');
    fireEvent.pointerDown(handle, { button: 2, pointerId: 1, clientX: 0, clientY: 0 });
    fireEvent.pointerMove(handle, { pointerId: 1, clientX: 200, clientY: 200 });
    expect(getByTestId('state').textContent).toBe('none');
  });

  test('reset returns to the caller`s own placement', () => {
    const { getByTestId } = render(<Overlay />);
    dragBy(getByTestId('handle'), -300, 120);
    fireEvent.click(getByTestId('reset'));
    expect(getByTestId('state').textContent).toBe('none');
    expect(getByTestId('frame').getAttribute('style')).toBe('');
  });

  test('the frame cannot be dragged fully off screen', () => {
    /*
     * Not a containment test — parking an overlay mostly off screen is a
     * legitimate "get it out of my way". Just enough that the header you would
     * grab to bring it back never leaves.
     */
    const { getByTestId } = render(<Overlay />);
    dragBy(getByTestId('handle'), 9999, 9999);
    expect(getByTestId('state').textContent).toBe(`${VW - 40},${VH - 40}`);
  });

  test('nor fully off the left edge', () => {
    const { getByTestId } = render(<Overlay />);
    dragBy(getByTestId('handle'), -9999, 0);
    // 40px of a 416px panel still showing, so its left edge is off screen.
    expect(getByTestId('state').textContent).toBe(`${40 - FRAME.width},${FRAME.top}`);
  });

  test('a drag never moves the frame above the top of the viewport', () => {
    // Dragged past the top, the header would be unreachable — there is nothing
    // above the viewport to grab it from.
    const { getByTestId } = render(<Overlay />);
    dragBy(getByTestId('handle'), 0, -9999);
    expect(getByTestId('state').textContent).toBe(`${FRAME.left},0`);
  });

  test('a cancelled pointer tears its listeners down', () => {
    /*
     * Otherwise the next press stacks a second `pointermove` listener on the
     * same handle and the frame moves at double speed — the classic symptom of a
     * drag that only unbinds on `pointerup`.
     */
    const { getByTestId } = render(<Overlay />);
    const handle = getByTestId('handle');
    fireEvent.pointerDown(handle, { button: 0, pointerId: 1, clientX: 0, clientY: 0 });
    fireEvent.pointerCancel(handle, { pointerId: 1 });
    dragBy(handle, 100, 50);
    expect(getByTestId('state').textContent)
      .toBe(`${FRAME.left + 100},${FRAME.top + 50}`);
  });
});
