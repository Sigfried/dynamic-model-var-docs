/**
 * graph-core public types.
 *
 * graph-core is the layout/zoom engine extracted from icd11-playground's
 * NodeLinkView. It knows nothing about the app: no DataService, no stores,
 * no model types — nodes are opaque {id, width, height} boxes. This is the
 * future package-extraction boundary (see docs/EXPLORE_VIZ.md, Renderer).
 */

export interface Point {
  x: number;
  y: number;
}

/** Fixed-position edge attach point on a node (ELK port). Coordinates are
 *  relative to the node's top-left corner; ids must be globally unique. */
export interface GraphSpecPort {
  id: string;
  x: number;
  y: number;
}

export interface GraphSpecNode {
  id: string;
  width: number;
  height: number;
  /**
   * Optional layer constraint (ELK partition). When the layout runs with
   * usePartitions, nodes with a lower partition are always placed before —
   * i.e. above, in DOWN direction — nodes with a higher one.
   */
  partition?: number;
  /** When present, the node gets FIXED_POS port constraints and edges may
   *  reference these ports; edge routing accounts for the attach points. */
  ports?: GraphSpecPort[];
}

export interface GraphSpecEdge {
  id: string;
  source: string;
  target: string;
  /** Attach to a specific port (must belong to source/target node). */
  sourcePort?: string;
  targetPort?: string;
}

export interface GraphSpec {
  nodes: GraphSpecNode[];
  edges: GraphSpecEdge[];
}

export interface PlacedNode {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface EdgeSection {
  startPoint: Point;
  endPoint: Point;
  bendPoints?: Point[];
}

export interface RoutedEdge {
  id: string;
  source: string;
  target: string;
  /** ELK's routed polyline, when the engine was asked to route edges. */
  sections?: EdgeSection[];
}

export interface LayoutResult {
  nodes: PlacedNode[];
  edges: RoutedEdge[];
  /** Tight content bounds (nodes only; origin at 0,0). */
  width: number;
  height: number;
}

export interface LayoutEngineOptions {
  direction?: 'DOWN' | 'RIGHT' | 'UP' | 'LEFT';
  /** In-layer node spacing (px). */
  nodeSpacing?: number;
  /** Between-layer spacing (px). */
  layerSpacing?: number;
  /** Honor GraphSpecNode.partition as a hard layer assignment. */
  usePartitions?: boolean;
  /** Extra raw ELK layoutOptions merged onto the root (tuning escape hatch). */
  extraLayoutOptions?: Record<string, string>;
}
