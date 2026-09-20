/**
 * Zoom/pan machinery ported from icd11-playground NodeLinkView.
 *
 * Structure: a scroll container holds a spacer div (sized to zoomed content,
 * so native scrollbars provide panning) which holds a wrapper div that gets
 * a GPU-composited CSS scale transform. Zoom bypasses React entirely: the
 * transform is applied in a requestAnimationFrame.
 *
 * Ctrl/Cmd+wheel (and trackpad pinch, which browsers report as ctrl+wheel)
 * zooms; plain wheel scrolls natively.
 *
 * TWO ZOOM PATHS, and the difference is animation (see ./anim.ts):
 *
 * - DISCRETE (`zoomToFit`, the +/−/1:1 buttons): one step to a known level, so
 *   the wrapper transitions over `animMs()` in step with the node boxes and
 *   the spacer, and the scroll reset is smooth. Without this the boxes slide
 *   to their new ELK positions inside a frame that snapped instantly, which
 *   is why selection changes read as unanimated.
 * - LIVE (ctrl+wheel / pinch): a stream of levels, one per event. A transition
 *   here would leave the wrapper permanently `animMs()` behind the fingers
 *   driving it, so this path stays instant and the spacer resize (a layout
 *   reflow) is debounced ~100ms so it does not run per wheel tick.
 *
 * Panning is drag-to-pan on the background (mouse or touch), implemented by
 * moving the container's scroll offsets. Scrollbars alone were not enough:
 * fit-to-view clamps the content to fit, which leaves nothing to scroll, so
 * there was no way to pan a fitted graph at all. Drags starting on an
 * interactive element (a node, a button) are ignored so clicking a node still
 * opens the drawer.
 *
 * PAN SLACK: the spacer carries padding of PAN_SLACK × the container's size on
 * every side, so there is always room to pan — a fitted diagram included.
 * Without it a box the fit placed under the floating toolbar could not be
 * moved out from under it, and a box dragged above the content's top edge
 * left the scrollable area for good (Siggie, 2026-09-09: *"if i drag a box
 * off the screen to the top i can never get it back again"*). The fit scrolls
 * to the padding's inner corner, so a fitted diagram still sits where it did.
 */

import { useCallback, useEffect, useRef } from 'react';
import { animMs } from './anim';

/**
 * Room to pan beyond the content, as a fraction of the container's size on
 * EACH side.
 *
 * HALVED to 0.25 on 2026-09-19, when the popover moved inside the canvas.
 * Siggie's conjecture, which the placement plan rests on: the extra space to
 * pan into at fit-to-view was added *so the tops of overflowing popovers could
 * be reached*, and that is why a fitted diagram scrolls at all. Confirmed in
 * the comment below, which cites "anything floated over the canvas" — the
 * popover — as half its purpose. That half is now unnecessary: a popover is in
 * the canvas and bounded by `--help-vh`, so it cannot overflow the viewport
 * and be unreachable.
 *
 * What the slack still buys is the OTHER half, and it is why this is not zero:
 * a box dragged past the content's edge must be draggable back (Siggie,
 * 2026-09-09: *"if i drag a box off the screen to the top i can never get it
 * back again"*). A quarter-viewport is room to recover a dragged box without a
 * fitted diagram floating in the middle of a scroll area twice its size.
 */
export const PAN_SLACK = 0.25;

/**
 * Room added to the WRAPPER (not the content) for an anchored tour popover to
 * be placed in. See `setContentSize` for why it is needed.
 *
 * 800px is a little more than the tallest popover the tours produce (the
 * `why` step, ~670px) — enough that one anchored on the lowest or rightmost
 * box still has its authored side available. It is NOT free: the wrapper is
 * inside the scroll area, so every pixel here is pannable emptiness at
 * fit-to-view, which is the thing Siggie objected to. Keep it near the
 * popover's height rather than rounding it up for comfort.
 */
const HELP_ROOM = 800;

export interface ZoomPan {
  /** Attach to the overflow-auto scroll container. */
  containerRef: React.RefObject<HTMLDivElement | null>;
  /** Attach to the spacer div (direct child of container). */
  spacerRef: React.RefObject<HTMLDivElement | null>;
  /** Attach to the transformed wrapper (direct child of spacer). */
  wrapperRef: React.RefObject<HTMLDivElement | null>;
  /**
   * Set absolute zoom level (clamped). Eases by default; pass `animate: false`
   * for a live, per-event zoom (see the two-paths note above).
   */
  applyZoom: (level: number, animate?: boolean) => void;
  /** Multiply current zoom. */
  zoomBy: (factor: number) => void;
  zoomToFit: () => void;
  getZoom: () => number;
  /** True until the user takes manual zoom control (button or ctrl+wheel). */
  isAutoFit: () => boolean;
  /** Tell the hook the unscaled content size (call when layout changes). */
  setContentSize: (width: number, height: number) => void;
}


/*
 * FITTING NO LONGER DODGES THE TOUR POPOVER, deliberately (2026-09-09).
 *
 * There used to be a `fitViewport` here that shrank the fit by the popover's
 * horizontal overlap with the canvas. It was added because the popover is in the
 * browser's TOP LAYER — nothing in the canvas can stack above it — so a fit
 * aimed at the full container lays boxes out underneath it and they are simply
 * invisible (Siggie, 2026-08-28: a box added on tour step 2 landed behind the
 * popover).
 *
 * It never worked, and produced two bugs of its own: it could fit the diagram
 * into a sliver, and because `zoomToFit` scrolled to the origin it parked the
 * diagram right back under the popover it had just made room around. Siggie,
 * 2026-09-09: *"why don't you just remove any attempt for zoom to account for
 * popovers?"*
 *
 * The right fix is that the popover should not sit over the canvas in the first
 * place — a placement problem, in HelpLayer, where the popover's position is
 * actually decided. Compensating for it here meant this file tracking a rect it
 * does not own, guessing which side was free, and getting both wrong.
 *
 * So: a fit fits the container. Do not reintroduce popover-awareness here.
 */


export function useZoomPan(opts: { min?: number; max?: number } = {}): ZoomPan {
  const { min = 0.2, max = 2 } = opts;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const spacerRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const zoomRef = useRef(1);
  const sizeRef = useRef({ w: 0, h: 0 });
  const rafRef = useRef<number | null>(null);
  const spacerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Cleared the first time the user zooms deliberately, so a re-layout stops
  // re-fitting under them and respects the zoom level they chose.
  const autoFitRef = useRef(true);
  // Cleared by the first fit, which is the one that must not animate.
  const firstFitRef = useRef(true);

  // The slack in px, from the container's current size.
  const slack = useCallback(() => {
    const c = containerRef.current;
    return c
      ? { x: c.clientWidth * PAN_SLACK, y: c.clientHeight * PAN_SLACK }
      : { x: 0, y: 0 };
  }, []);

  const syncSpacer = useCallback((ms: number) => {
    const spacer = spacerRef.current;
    if (spacer) {
      const { x, y } = slack();
      spacer.style.transition = ms ? `width ${ms}ms, height ${ms}ms` : '';
      // border-box (Tailwind's preflight), so the padding is inside the
      // width: the content box is exactly the zoomed content.
      spacer.style.padding = `${y}px ${x}px`;
      spacer.style.width = `${sizeRef.current.w * zoomRef.current + 2 * x}px`;
      spacer.style.height = `${sizeRef.current.h * zoomRef.current + 2 * y}px`;
    }
  }, [slack]);

  const setZoom = useCallback((level: number, animate: boolean) => {
    zoomRef.current = Math.min(max, Math.max(min, level));
    const ms = animate ? animMs() : 0;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const wrapper = wrapperRef.current;
      if (!wrapper) return;
      // Set per zoom, not once at mount: the same wrapper serves both paths,
      // and a live wheel zoom must clear a transition a previous fit left on.
      wrapper.style.transition = ms ? `transform ${ms}ms` : '';
      wrapper.style.transform = `scale(${zoomRef.current})`;
      /*
       * Publish the zoom, and the viewport height expressed in the CONTENT
       * coordinates the wrapper's descendants are laid out in.
       *
       * The tour popover is the consumer, and what it needs changed when it
       * moved inside this transform. It used to be `fixed` and top-layer, so
       * it scaled with nothing and needed `--graph-zoom` to size its FONT
       * against boxes that did scale. Now it scales with them for free, and
       * that font code is deleted (docs/BACKLOG.md §Placement, step 3).
       *
       * What it still cannot express for itself is the VIEWPORT: `100vh`
       * inside a scaled box means 100vh of screen applied to unscaled
       * content, so a `max-height: 100vh` at zoom 0.5 is two viewports tall
       * on screen. `--help-vh` is that height pre-divided by the zoom.
       *
       * On the wrapper, not the documentElement: these are facts about this
       * canvas's coordinate system, and they inherit to exactly the subtree
       * that is in it. `--graph-zoom` stays on documentElement as well, since
       * it is a general fact about the canvas and cheap to publish.
       */
      document.documentElement.style.setProperty('--graph-zoom', String(zoomRef.current));
      wrapper.style.setProperty('--help-vh', `${window.innerHeight / zoomRef.current}px`);
    });

    if (spacerTimerRef.current) {
      clearTimeout(spacerTimerRef.current);
      spacerTimerRef.current = null;
    }
    if (ms) {
      // In step with the transform, not 100ms behind it: the spacer is the
      // scrollable extent, so resizing it late re-clamps scroll offsets
      // mid-animation and jerks the whole canvas.
      syncSpacer(ms);
    } else {
      spacerTimerRef.current = setTimeout(() => {
        spacerTimerRef.current = null;
        syncSpacer(0);
      }, 100);
    }
  }, [min, max, syncSpacer]);

  // Public entry point: any caller-driven zoom is a deliberate user action.
  // `animate` defaults on — the wheel handler is the one caller that opts out.
  const applyZoom = useCallback((level: number, animate = true) => {
    autoFitRef.current = false;
    setZoom(level, animate);
  }, [setZoom]);

  const zoomBy = useCallback(
    (factor: number) => applyZoom(zoomRef.current * factor),
    [applyZoom],
  );

  const setContentSize = useCallback((width: number, height: number) => {
    sizeRef.current = { w: width, h: height };
    const wrapper = wrapperRef.current;
    if (wrapper) {
      // The wrapper's own width/height are the UNSCALED content box, which
      // changes only when ELK produces a differently-sized graph. Never
      // transitioned: that is the drawing surface resizing, not a zoom, and
      // animating it would clip or reveal boxes mid-flight.
      //
      // PLUS `HELP_ROOM`, which is not drawing surface: it is somewhere for an
      // anchored tour popover to be PLACED. The popover is a child of this
      // wrapper now (docs/BACKLOG.md §Placement), and CSS anchor positioning
      // places it within its containing block -- so a wrapper sized exactly to
      // the content leaves a box anchored on the lowest node nowhere to go
      // below it, and `position-area: block-end` bottom-aligns it to the
      // wrapper's edge instead, landing it ON the box it points at.
      //
      // Measured 2026-09-19: with the wrapper at the content height the
      // popover sat at 234.5 against an anchor bottom of 499.5; widened, it
      // moved to 511.5, correctly below. Growth is bottom/right only
      // (`transform-origin: 0 0`), so no box moves and no fit changes --
      // `sizeRef` deliberately keeps the CONTENT size, which is what
      // `zoomToFit` and the spacer measure.
      wrapper.style.width = `${width + HELP_ROOM}px`;
      wrapper.style.height = `${height + HELP_ROOM}px`;
      wrapper.style.transformOrigin = '0 0';
      wrapper.style.transform = `scale(${zoomRef.current})`;
    }
    // Zoom is unchanged here, so the spacer only tracks the new content box.
    syncSpacer(0);
  }, [syncSpacer]);

  // Fitting does NOT count as taking manual control — it is what auto-fit
  // does on every re-layout, and the ⛶ button asks for the same thing.
  const zoomToFit = useCallback(() => {
    const container = containerRef.current;
    const { w, h } = sizeRef.current;
    if (!container || !w || !h) return;
    autoFitRef.current = true;
    // The FIRST fit has nothing to animate from — the graph has just appeared,
    // and easing it from an arbitrary scale 1 reads as a gratuitous zoom-in
    // on load rather than as a response to anything the user did.
    const animate = !firstFitRef.current;
    firstFitRef.current = false;
    setZoom(Math.min(container.clientWidth / w, container.clientHeight / h, 1), animate);
    requestAnimationFrame(() => {
      // To the content's origin, i.e. just past the slack. Always reachable:
      // the spacer is never narrower than twice the slack.
      const { x, y } = slack();
      // `scrollTo` with `behavior` so the scroll eases alongside the scale
      // instead of teleporting the diagram out from under it. `behavior` is
      // not honoured everywhere (and jsdom has no scrollTo at all), so fall
      // back to the assignments this replaced.
      if (typeof container.scrollTo === 'function') {
        container.scrollTo({ left: x, top: y, behavior: animate ? 'smooth' : 'auto' });
      } else {
        container.scrollLeft = x;
        container.scrollTop = y;
      }
    });
  }, [setZoom, slack]);

  /*
   * `--help-vh` tracks the WINDOW as well as the zoom, so a resize that does
   * not change the zoom still has to republish it. Without this a popover
   * keeps the height bound from whatever the window was when the zoom last
   * moved, which on a shrink lets it run off the bottom.
   */
  useEffect(() => {
    const republish = () => {
      const wrapper = wrapperRef.current;
      if (wrapper) {
        wrapper.style.setProperty('--help-vh', `${window.innerHeight / zoomRef.current}px`);
      }
    };
    republish();
    window.addEventListener('resize', republish);
    return () => window.removeEventListener('resize', republish);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      // `false`: the LIVE path. One level per wheel event, so a transition
      // would just lag the fingers driving it.
      applyZoom(zoomRef.current * (1 - e.deltaY * 0.005), false);
    };
    container.addEventListener('wheel', onWheel, { passive: false });
    return () => container.removeEventListener('wheel', onWheel);
  }, [applyZoom]);

  // --- Drag-to-pan -------------------------------------------------------
  // Panning moves the container's scroll offsets rather than the wrapper's
  // transform, so it composes with the zoom transform and with the native
  // scrollbars instead of fighting them.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let panning = false;
    let startX = 0, startY = 0, startLeft = 0, startTop = 0;
    let moved = false;

    // A drag beginning on a node/button is that element's interaction, not a
    // pan — otherwise clicking a node to open the drawer would drag the canvas.
    const onBackground = (target: EventTarget | null) =>
      target instanceof Element && !target.closest('[data-pan-ignore]');

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0 || !onBackground(e.target)) return;
      panning = true;
      moved = false;
      startX = e.clientX;
      startY = e.clientY;
      startLeft = container.scrollLeft;
      startTop = container.scrollTop;
      container.style.cursor = 'grabbing';
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!panning) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      // Small jitter during a click shouldn't capture the pointer and swallow
      // the click that follows.
      if (!moved && Math.hypot(dx, dy) < 3) return;
      if (!moved) {
        moved = true;
        container.setPointerCapture(e.pointerId);
      }
      e.preventDefault();
      container.scrollLeft = startLeft - dx;
      container.scrollTop = startTop - dy;
    };

    const endPan = (e: PointerEvent) => {
      if (!panning) return;
      panning = false;
      container.style.cursor = '';
      if (container.hasPointerCapture(e.pointerId)) {
        container.releasePointerCapture(e.pointerId);
      }
    };

    container.addEventListener('pointerdown', onPointerDown);
    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerup', endPan);
    container.addEventListener('pointercancel', endPan);
    return () => {
      container.removeEventListener('pointerdown', onPointerDown);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerup', endPan);
      container.removeEventListener('pointercancel', endPan);
    };
  }, []);

  return {
    containerRef, spacerRef, wrapperRef,
    applyZoom, zoomBy, zoomToFit,
    getZoom: () => zoomRef.current,
    isAutoFit: () => autoFitRef.current,
    setContentSize,
  };
}
