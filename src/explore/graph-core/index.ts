/**
 * graph-core: layout/zoom/path engine for node-link graph views.
 * Zero imports from DataService, stores, or model types — see types.ts.
 */

export type {
  Point, GraphSpec, GraphSpecNode, GraphSpecEdge, GraphSpecPort,
  PlacedNode, RoutedEdge, EdgeSection, LayoutResult, LayoutEngineOptions,
} from './types';
export { ElkLayoutEngine } from './elkLayout';
export {
  pathFromSections, roundedPathFromSections, smoothPathFromSections,
  roundedPath, smoothPath, polyline, sectionPoints, simplifyPoints, mergeTail, mergeCut, smoothStepPath,
  anchoredPath, anchoredPathPoint, arrowPath,
} from './paths';
export type { AnchorDir } from './paths';
export { useGraphLayout } from './useGraphLayout';
export { useZoomPan } from './useZoomPan';
export type { ZoomPan } from './useZoomPan';
export {
  ANIM_MS, BOX_FADE_MS, ENTER_DELAY_MS, EDGE_FADE_MS, EDGE_ARRIVE_MS,
  HOVER_MS, SPINNER_DELAY_MS, ANIM_EASE, sec,
  animMs, fadeMs, enterDelayMs, edgeFadeMs, edgeArriveMs, hoverMs,
  prefersReducedMotion,
} from './anim';
