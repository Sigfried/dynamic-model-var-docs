/**
 * Zoom/pan machinery ported from icd11-playground NodeLinkView.
 *
 * Structure: a scroll container holds a spacer div (sized to zoomed content,
 * so native scrollbars provide panning) which holds a wrapper div that gets
 * a GPU-composited CSS scale transform. Zoom bypasses React entirely: the
 * transform is applied in a requestAnimationFrame, and the spacer resize
 * (which triggers layout reflow) is debounced to ~100ms.
 *
 * Ctrl/Cmd+wheel (and trackpad pinch, which browsers report as ctrl+wheel)
 * zooms; plain wheel scrolls natively.
 *
 * Panning is drag-to-pan on the background (mouse or touch), implemented by
 * moving the container's scroll offsets. Scrollbars alone were not enough:
 * fit-to-view clamps the content to fit, which leaves nothing to scroll, so
 * there was no way to pan a fitted graph at all. Drags starting on an
 * interactive element (a node, a button) are ignored so clicking a node still
 * opens the drawer.
 */

import { useCallback, useEffect, useRef } from 'react';

export interface ZoomPan {
  /** Attach to the overflow-auto scroll container. */
  containerRef: React.RefObject<HTMLDivElement | null>;
  /** Attach to the spacer div (direct child of container). */
  spacerRef: React.RefObject<HTMLDivElement | null>;
  /** Attach to the transformed wrapper (direct child of spacer). */
  wrapperRef: React.RefObject<HTMLDivElement | null>;
  /** Set absolute zoom level (clamped). */
  applyZoom: (level: number) => void;
  /** Multiply current zoom. */
  zoomBy: (factor: number) => void;
  zoomToFit: () => void;
  getZoom: () => number;
  /** True until the user takes manual zoom control (button or ctrl+wheel). */
  isAutoFit: () => boolean;
  /** Tell the hook the unscaled content size (call when layout changes). */
  setContentSize: (width: number, height: number) => void;
}


/**
 * The width/height a fit should actually aim at — the container, minus any
 * part of it the tour popover is sitting on.
 *
 * The popover is rendered in the browser's TOP LAYER (Popover API, no
 * z-index), so nothing in the canvas can be stacked above it and no amount of
 * repositioning boxes will reveal what it covers. Fitting the diagram to the
 * full container therefore lays boxes out underneath it: Siggie clicked
 * `cause_of_death` on tour step 2 and the box it added landed behind the
 * popover (screenshot 2026-08-28).
 *
 * This is the cheap half of the fix. It does NOT reposition the popover or
 * reserve space for it in general — it just stops the fit from aiming at
 * pixels that are known to be covered right now. Only the horizontal overlap
 * is deducted: the popover is a fixed 320px-wide column, so the space it
 * leaves beside it is usable, whereas deducting its height would throw away a
 * full-width band for no reason.
 *
 * Reads the live rect rather than taking tour state as a prop, because the
 * popover's position is decided by `popoverPosition` in HelpLayer and mirrored
 * state would just be a second thing to keep in sync. No popover open (the
 * normal case) → the container's own size, i.e. exactly the old behaviour.
 */
function fitViewport(container: HTMLElement): { w: number; h: number } {
  const w = container.clientWidth;
  const h = container.clientHeight;
  const pop = document.querySelector('[data-help-popover]');
  if (!pop || !(pop as HTMLElement).matches(':popover-open')) return { w, h };
  const p = pop.getBoundingClientRect();
  const c = container.getBoundingClientRect();
  const overlap = Math.min(p.right, c.right) - Math.max(p.left, c.left);
  if (overlap <= 0) return { w, h };
  // Never fit into a sliver: if the popover covers most of the canvas, the
  // old full-width fit is the lesser evil.
  const MIN_FRACTION = 0.4;
  return { w: Math.max(w - overlap, w * MIN_FRACTION), h };
}

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

  const syncSpacer = useCallback(() => {
    const spacer = spacerRef.current;
    if (spacer) {
      spacer.style.width = `${sizeRef.current.w * zoomRef.current}px`;
      spacer.style.height = `${sizeRef.current.h * zoomRef.current}px`;
    }
  }, []);

  const setZoom = useCallback((level: number) => {
    zoomRef.current = Math.min(max, Math.max(min, level));
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const wrapper = wrapperRef.current;
      if (wrapper) wrapper.style.transform = `scale(${zoomRef.current})`;
    });
    if (spacerTimerRef.current) clearTimeout(spacerTimerRef.current);
    spacerTimerRef.current = setTimeout(() => {
      spacerTimerRef.current = null;
      syncSpacer();
    }, 100);
  }, [min, max, syncSpacer]);

  // Public entry point: any caller-driven zoom is a deliberate user action.
  const applyZoom = useCallback((level: number) => {
    autoFitRef.current = false;
    setZoom(level);
  }, [setZoom]);

  const zoomBy = useCallback(
    (factor: number) => applyZoom(zoomRef.current * factor),
    [applyZoom],
  );

  const setContentSize = useCallback((width: number, height: number) => {
    sizeRef.current = { w: width, h: height };
    const wrapper = wrapperRef.current;
    if (wrapper) {
      wrapper.style.width = `${width}px`;
      wrapper.style.height = `${height}px`;
      wrapper.style.transformOrigin = '0 0';
      wrapper.style.transform = `scale(${zoomRef.current})`;
    }
    syncSpacer();
  }, [syncSpacer]);

  // Fitting does NOT count as taking manual control — it is what auto-fit
  // does on every re-layout, and the ⛶ button asks for the same thing.
  const zoomToFit = useCallback(() => {
    const container = containerRef.current;
    const { w, h } = sizeRef.current;
    if (!container || !w || !h) return;
    autoFitRef.current = true;
    const avail = fitViewport(container);
    setZoom(Math.min(avail.w / w, avail.h / h, 1));
    syncSpacer();
    requestAnimationFrame(() => {
      container.scrollLeft = 0;
      container.scrollTop = 0;
    });
  }, [setZoom, syncSpacer]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      applyZoom(zoomRef.current * (1 - e.deltaY * 0.005));
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
