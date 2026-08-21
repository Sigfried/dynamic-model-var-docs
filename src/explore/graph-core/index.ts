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
