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
  /** Tell the hook the unscaled content size (call when layout changes). */
  setContentSize: (width: number, height: number) => void;
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

  const syncSpacer = useCallback(() => {
    const spacer = spacerRef.current;
    if (spacer) {
      spacer.style.width = `${sizeRef.current.w * zoomRef.current}px`;
      spacer.style.height = `${sizeRef.current.h * zoomRef.current}px`;
    }
  }, []);

  const applyZoom = useCallback((level: number) => {
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

  const zoomToFit = useCallback(() => {
    const container = containerRef.current;
    const { w, h } = sizeRef.current;
    if (!container || !w || !h) return;
    applyZoom(Math.min(container.clientWidth / w, container.clientHeight / h, 1));
    syncSpacer();
    requestAnimationFrame(() => {
      container.scrollLeft = 0;
      container.scrollTop = 0;
    });
  }, [applyZoom, syncSpacer]);

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

  return {
    containerRef, spacerRef, wrapperRef,
    applyZoom, zoomBy, zoomToFit,
    getZoom: () => zoomRef.current,
    setContentSize,
  };
}
