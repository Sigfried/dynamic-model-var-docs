/**
 * Drag an overlay by its header, for as long as it is open.
 *
 * The cheap half of the overlay work (docs/HELP_PACKAGE_PLAN.md §1b). Siggie,
 * 2026-09-08: *"don't do any heavy lifting for the overlays."* Two surfaces use
 * it — the tour's step popover and dmvd's legend / example-cases frame — and
 * neither PERSISTS a dragged position: it lasts while the thing is open and the
 * next open comes back where the layout puts it. That is deliberate, not a
 * shortcut. An overlay dragged somewhere useful for one step is usually in the
 * way of the next, and remembering it would need a place to remember per what:
 * per step, per panel, per selection?
 *
 * ## What it returns
 *
 * `offset` is null until the first real drag, and that null is load-bearing:
 * while it is null the CALLER's own placement runs untouched (the popover's
 * `position-area`, the panel's `right-4`), so nothing has to reimplement a
 * layout in order to be draggable. Once it is non-null the caller switches to
 * absolute coordinates. `reset()` returns to null.
 *
 * ## Why this is possible at all
 *
 * Only because §1 deleted the measured positioning. While a `resize` listener, a
 * capture-phase `scroll` listener and a 250ms interval were all recomputing the
 * popover's `left`/`top`, a dragged position was stomped by whichever fired
 * next. Nothing recomputes it now — the browser tracks the anchor in CSS — so a
 * dragged coordinate simply stays. Dragging was listed as *unblocked by* task 8
 * for that reason.
 */

import { useCallback, useState } from 'react';

export interface Dragged {
  /**
   * Viewport coordinates the caller should place the element at, or null while
   * it has never been dragged (leave the caller's own placement alone).
   */
  offset: { left: number; top: number } | null;
  /** `onPointerDown` for the drag handle. */
  onPointerDown: (ev: React.PointerEvent) => void;
  /** Back to the caller's own placement. */
  reset: () => void;
}

/** Below this, a pointer-down-move-up is a CLICK and the handle's own controls
 *  must still get it. Same threshold the diagram's node drag uses. */
const SLOP = 3;

/** How much of the element must stay on screen, in px. Enough to see and grab,
 *  not enough to stop you parking the thing at an edge. */
const KEEP = 40;

export function useDragged(): Dragged {
  const [offset, setOffset] = useState<{ left: number; top: number } | null>(null);

  const onPointerDown = useCallback((ev: React.PointerEvent) => {
    if (ev.button !== 0) return;
    /*
     * Not from a control. `pointerdown` fires before `click`, so capturing the
     * pointer here would eat the close button's and the tour nav's clicks
     * entirely -- the same bug the diagram's node drag hit in 2026-08 and fixed
     * the same way.
     */
    if ((ev.target as HTMLElement)
      .closest('button, a, input, select, textarea, [role="button"], [data-no-drag]')) return;

    /*
     * The element's CURRENT box is the drag's origin, whether it got there from
     * `position-area`, from a Tailwind `right-4`, or from an earlier drag. So
     * the first drag starts exactly where the reader sees the thing, with no
     * jump, and the caller's placement never has to be replicated here.
     */
    const el = (ev.currentTarget as HTMLElement).closest('[data-draggable]')
      ?? ev.currentTarget as HTMLElement;
    const box = el.getBoundingClientRect();
    const startX = ev.clientX;
    const startY = ev.clientY;
    const base = { left: box.left, top: box.top };

    const handle = ev.currentTarget as HTMLElement;
    handle.setPointerCapture(ev.pointerId);
    let moved = false;

    const move = (e: PointerEvent) => {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (!moved && Math.hypot(dx, dy) < SLOP) return;
      moved = true;
      /*
       * Clamped so a strip of the element stays reachable. Not a full containment
       * test -- an overlay dragged mostly off screen is a legitimate "park it out
       * of the way" -- just enough that the header you would grab to bring it
       * back never leaves.
       *
       * `KEEP - width` is the leftmost position with `KEEP` px still on screen;
       * `innerWidth - KEEP` the rightmost. `Math.min` LAST on each axis, so when
       * the two bounds cross (an element wider than the viewport) the low bound
       * wins and the element stays anchored at the left rather than jumping.
       * Downward is clamped and upward is not symmetric: there is nothing above
       * the viewport to grab a header from, so `top` never goes negative.
       */
      const next = {
        left: Math.max(Math.min(base.left + dx, window.innerWidth - KEEP),
                       KEEP - box.width),
        top: Math.min(Math.max(base.top + dy, 0), window.innerHeight - KEEP),
      };
      setOffset(next);
    };
    const up = (e: PointerEvent) => {
      handle.releasePointerCapture(e.pointerId);
      handle.removeEventListener('pointermove', move);
      handle.removeEventListener('pointerup', up);
      handle.removeEventListener('pointercancel', up);
    };
    handle.addEventListener('pointermove', move);
    handle.addEventListener('pointerup', up);
    // A cancelled pointer (a system gesture, a lost capture) must still tear the
    // listeners down, or the next pointerdown stacks a second set of them.
    handle.addEventListener('pointercancel', up);
  }, []);

  const reset = useCallback(() => setOffset(null), []);

  return { offset, onPointerDown, reset };
}
