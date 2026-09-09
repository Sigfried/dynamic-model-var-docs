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
 */

import { useCallback, useEffect, useRef } from 'react';
import { animMs } from './anim';

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

  const syncSpacer = useCallback((ms: number) => {
    const spacer = spacerRef.current;
    if (spacer) {
      spacer.style.transition = ms ? `width ${ms}ms, height ${ms}ms` : '';
      spacer.style.width = `${sizeRef.current.w * zoomRef.current}px`;
      spacer.style.height = `${sizeRef.current.h * zoomRef.current}px`;
    }
  }, []);

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
      wrapper.style.width = `${width}px`;
      wrapper.style.height = `${height}px`;
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
      // `scrollTo` with `behavior` so the scroll eases alongside the scale
      // instead of teleporting the diagram out from under it. `behavior` is
      // not honoured everywhere (and jsdom has no scrollTo at all), so fall
      // back to the assignments this replaced.
      if (typeof container.scrollTo === 'function') {
        container.scrollTo({ left: 0, top: 0, behavior: animate ? 'smooth' : 'auto' });
      } else {
        container.scrollLeft = 0;
        container.scrollTop = 0;
      }
    });
  }, [setZoom]);

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
