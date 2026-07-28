/**
 * OwnershipGraphView — the layered ownership DAG (docs/EXPLORE_VIZ.md).
 *
 * Bindings over graph-core: HTML entity nodes (title + attribute rows) are
 * absolutely positioned over an SVG edge layer. Layout and edge routing are
 * both ELK's (layered, orthogonal): each drawn edge attaches to a
 * fixed-position ELK port at its slot's attribute row on the storage-side
 * node, and its other end to a header-level port on the peer — so edges
 * "point at the entity name" and routing sees the real attach points.
 *
 * Channel rules:
 *  - ownership: amber solid, drawn owner → member (normalized). Flipped
 *    storage direction is marked at the member end: the arrowhead points
 *    BACK toward the owner (the member stores the FK).
 *  - reference: gray dashed, drawn in FK direction.
 *  - is-a: never an arrow in the ownership plane — chips on the nodes.
 *  - self-loops: ⟲ marker on the slot's own row, not a routed edge.
 * No floating edge labels: the row an edge lands on names the slot.
 *
 * Row policy: by default a node shows the rows that carry a drawn edge
 * (plus ⟲ self-loops); a "+N more" footer expands to ALL entity-ranged
 * slots (dimmed rows = ranges not on canvas; future expand-on-demand).
 *
 * Talks to services/DataService only (per app architecture rules);
 * graph-core is pure layout code with zero app imports.
 */

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import type {
  DataService, OwnershipSubgraph, OwnershipSubgraphEdge, OwnershipSubgraphNode,
} from '../services/DataService';
import { useGraphLayout, useZoomPan, pathFromSections, anchoredPath } from './graph-core';
import type { AnchorDir, EdgeSection, GraphSpec, GraphSpecPort, Point } from './graph-core';

const NODE_W = 240;
const HEADER_H = 30;
const ROW_H = 20;
const FOOTER_H = 18;
const PAD = 28;

type Direction = 'RIGHT' | 'DOWN';
type EdgeStyle = 'orthogonal' | 'curved';

interface RowVM {
  slot: string;
  range: string;
  /** 'plain' = scalar/enum-valued attribute — listed when expanded, never an edge. */
  channel: 'ownership' | 'reference' | 'plain';
  flipped: boolean;
  cardinality: string;
  isLoop: boolean;
  /** Carries a drawn edge (or is a self-loop) — rendered with full emphasis. */
  connected: boolean;
}

interface NodeVM extends OwnershipSubgraphNode {
  isaParents: string[];
  subclassCount: number;
  /** Rows currently displayed (connected first; all when expanded). */
  rows: RowVM[];
  hiddenCount: number;
  expanded: boolean;
  height: number;
}

interface ViewModel {
  nodes: NodeVM[];
  /** Routed edges: ownership + reference, minus self-loops (row ⟲ markers). */
  edges: OwnershipSubgraphEdge[];
}

/** The node whose attribute row stores the slot (edge anchor side). */
function hostOf(e: OwnershipSubgraphEdge): string {
  return e.storageDirection === 'flipped' ? e.target : e.source;
}

function buildViewModel(
  sub: OwnershipSubgraph,
  expandedNodes: Set<string>,
  plainSlotsFor: (id: string) => Array<{ name: string; range: string }>,
): ViewModel {
  const isaParents = new Map<string, string[]>();
  const subclassCount = new Map<string, number>();
  const edges: OwnershipSubgraphEdge[] = [];
  const drawn = new Set<string>();

  for (const e of sub.edges) {
    if (e.type === 'isa') {
      isaParents.set(e.target, [...(isaParents.get(e.target) ?? []), e.source]);
      subclassCount.set(e.source, (subclassCount.get(e.source) ?? 0) + 1);
    } else if (!e.isLoop) {
      edges.push(e);
      drawn.add(`${hostOf(e)}|${e.slotName}`);
    }
  }

  const nodes = sub.nodes.map((n): NodeVM => {
    const entityRows = n.slots.map((s): RowVM => ({
      ...s,
      connected: s.isLoop || drawn.has(`${n.id}|${s.slot}`),
    }));
    const entityNames = new Set(entityRows.map(r => r.slot));
    // Scalar/enum-valued attributes: everything getClassSummary lists that
    // isn't already an entity-ranged row.
    const plainRows = plainSlotsFor(n.id)
      .filter(s => !entityNames.has(s.name))
      .map((s): RowVM => ({
        slot: s.name, range: s.range, channel: 'plain',
        flipped: false, cardinality: '', isLoop: false, connected: false,
      }));
    const connected = entityRows.filter(r => r.connected);
    const hidden = [...entityRows.filter(r => !r.connected), ...plainRows];
    const expanded = expandedNodes.has(n.id);
    const rows = expanded ? [...connected, ...hidden] : connected;
    return {
      ...n,
      isaParents: isaParents.get(n.id) ?? [],
      subclassCount: subclassCount.get(n.id) ?? 0,
      rows,
      hiddenCount: hidden.length,
      expanded,
      height: HEADER_H + rows.length * ROW_H
        + (hidden.length ? FOOTER_H : 0) + (rows.length ? 5 : 0),
    };
  });

  return { nodes, edges };
}

/** Self-loop marker: SVG so size/alignment don't depend on font metrics. */
function LoopIcon({ title }: { title: string }) {
  return (
    <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="false"
      className="shrink-0 text-amber-600 dark:text-amber-400">
      <title>{title}</title>
      {/* 300° arc with a 60° gap on the right; arrowhead at the top end
          pointing into the gap, so the loop reads as an arrow, not an O */}
      <path d="M12.33 10.5 A5 5 0 1 1 12.33 5.5" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M13.7 7.9 L10.6 6.7 L13.7 4.2 Z" fill="currentColor" />
    </svg>
  );
}

/** y-center of a slot's displayed row, relative to the node's top-left. */
function rowY(node: NodeVM, slot: string): number {
  const idx = node.rows.findIndex(r => r.slot === slot);
  if (idx < 0) throw new Error(`No displayed row for ${slot} on ${node.id}`);
  return HEADER_H + idx * ROW_H + ROW_H / 2;
}

/**
 * ELK spec. Each drawn edge gets a fixed-position port at its slot row on
 * the storage-side node (east when the host is the drawn source, west when
 * it receives). The free end gets a header-level port (side by drawn
 * direction — top/bottom center in DOWN mode), so edges land on the entity
 * name instead of an arbitrary border point.
 */
function buildSpec(vm: ViewModel, direction: Direction): GraphSpec {
  const portsByNode = new Map<string, GraphSpecPort[]>();
  const addPort = (node: NodeVM, id: string, x: number, y: number): string => {
    const ports = portsByNode.get(node.id) ?? [];
    if (!ports.some(p => p.id === id)) {
      ports.push({ id, x, y });
      portsByNode.set(node.id, ports);
    }
    return id;
  };

  const nodeById = new Map(vm.nodes.map(n => [n.id, n]));
  const edges = vm.edges.map(e => {
    const host = nodeById.get(hostOf(e));
    const free = nodeById.get(hostOf(e) === e.source ? e.target : e.source);
    if (!host || !free) throw new Error(`Edge ${e.id} endpoint missing from subgraph`);
    const flipped = e.storageDirection === 'flipped';
    const y = rowY(host, e.slotName);
    const rowPort = addPort(
      host, `${host.id}::row:${e.slotName}`, flipped ? 0 : NODE_W, y,
    );
    const freeIsSource = free.id === e.source;
    const headerPort = direction === 'RIGHT'
      ? addPort(free, `${free.id}::hdr:${freeIsSource ? 'out' : 'in'}`,
          freeIsSource ? NODE_W : 0, HEADER_H / 2)
      : addPort(free, `${free.id}::hdr:${freeIsSource ? 'out' : 'in'}`,
          NODE_W / 2, freeIsSource ? free.height : 0);
    return {
      id: e.id,
      source: e.source,
      target: e.target,
      sourcePort: flipped ? headerPort : rowPort,
      targetPort: flipped ? rowPort : headerPort,
    };
  });

  return {
    nodes: vm.nodes.map(n => ({
      id: n.id,
      width: NODE_W,
      height: n.height,
      partition: n.layer,
      ports: portsByNode.get(n.id),
    })),
    edges,
  };
}

function dirBetween(a: Point, b: Point): AnchorDir {
  if (Math.abs(b.x - a.x) >= Math.abs(b.y - a.y)) return b.x >= a.x ? 'right' : 'left';
  return b.y >= a.y ? 'down' : 'up';
}

/** Pull the routed end back along its final segment (so back-pointing
 *  arrowheads don't abut the node border). */
function trimSectionsEnd(sections: EdgeSection[] | undefined, dist: number): EdgeSection[] | undefined {
  if (!sections?.length) return sections;
  const s = sections[0];
  const prev = s.bendPoints?.length ? s.bendPoints[s.bendPoints.length - 1] : s.startPoint;
  const dx = s.endPoint.x - prev.x;
  const dy = s.endPoint.y - prev.y;
  const len = Math.hypot(dx, dy);
  if (len < 1) return sections;
  const k = Math.min(dist, len * 0.8) / len;
  const endPoint = { x: s.endPoint.x - dx * k, y: s.endPoint.y - dy * k };
  return [{ ...s, endPoint }, ...sections.slice(1)];
}

/** Curved rendering of an ELK-routed edge: cubic between the routed
 *  endpoints, leaving/arriving along the routed segment directions. */
function curvedFromSections(sections: EdgeSection[] | undefined): string {
  if (!sections?.length) return '';
  const s = sections[0];
  const pts = [s.startPoint, ...(s.bendPoints ?? []), s.endPoint];
  if (pts.length < 2) return '';
  const d0 = dirBetween(pts[0], pts[1]);
  const d1 = dirBetween(pts[pts.length - 1], pts[pts.length - 2]);
  return anchoredPath(pts[0], d0, pts[pts.length - 1], d1);
}

export default function OwnershipGraphView({
  dataService,
  selectedIds,
  onNodeClick,
}: {
  dataService: DataService;
  selectedIds: Set<string>;
  onNodeClick?: (id: string) => void;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const markerId = (name: string) => `${name}-${uid}`;

  const [direction, setDirection] = useState<Direction>(
    () => (localStorage.getItem('explore-nl-dir') as Direction) || 'RIGHT',
  );
  const [edgeStyle, setEdgeStyle] = useState<EdgeStyle>(
    () => (localStorage.getItem('explore-nl-edges') as EdgeStyle) || 'orthogonal',
  );
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const subgraph = useMemo(
    () => dataService.getOwnershipSubgraph([...selectedIds].sort()),
    [dataService, selectedIds],
  );
  const plainSlots = useMemo(
    () => new Map(subgraph.nodes.map(n =>
      [n.id, dataService.getClassSummary(n.id)?.slots ?? []] as const)),
    [dataService, subgraph],
  );
  const vm = useMemo(
    () => buildViewModel(subgraph, expandedNodes, id => plainSlots.get(id) ?? []),
    [subgraph, expandedNodes, plainSlots],
  );
  const spec = useMemo(() => buildSpec(vm, direction), [vm, direction]);

  const { layout, inProgress } = useGraphLayout(spec, {
    direction,
    usePartitions: true,
    nodeSpacing: 28,
    layerSpacing: 72,
    extraLayoutOptions: {
      'elk.spacing.edgeNode': '18',
      'elk.spacing.edgeEdge': '12',
      'elk.layered.spacing.edgeNodeBetweenLayers': '18',
      'elk.layered.spacing.edgeEdgeBetweenLayers': '10',
    },
  });

  const zp = useZoomPan();
  const contentW = (layout?.width ?? 0) + PAD * 2;
  const contentH = (layout?.height ?? 0) + PAD * 2;
  useEffect(() => {
    if (layout) zp.setContentSize(contentW, contentH);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- zp fns are stable
  }, [layout, contentW, contentH]);

  const placed = useMemo(
    () => new Map((layout?.nodes ?? []).map(n => [n.id, n])),
    [layout],
  );
  const roles = useMemo(
    () => new Map(vm.nodes.map(n => [n.id, n.role])),
    [vm],
  );
  const edgeById = useMemo(
    () => new Map(vm.edges.map(e => [e.id, e])),
    [vm],
  );

  // --- Hover emphasis (icd11 pattern: RAF-throttled direct DOM styling,
  // no React state, so rapid mouse movement can't cause render storms) ---
  const svgRef = useRef<SVGSVGElement | null>(null);
  const hoverRafRef = useRef<number | null>(null);
  const pendingHoverRef = useRef<{ kind: 'node' | 'edge'; id: string } | null | undefined>(undefined);
  const adjacency = useMemo(() => {
    const nodeEdges = new Map<string, string[]>();
    const edgeEnds = new Map<string, [string, string]>();
    for (const e of vm.edges) {
      edgeEnds.set(e.id, [e.source, e.target]);
      for (const nid of [e.source, e.target]) {
        nodeEdges.set(nid, [...(nodeEdges.get(nid) ?? []), e.id]);
      }
    }
    return { nodeEdges, edgeEnds };
  }, [vm]);
  const adjacencyRef = useRef(adjacency);
  adjacencyRef.current = adjacency;

  const applyHover = useCallback((target: { kind: 'node' | 'edge'; id: string } | null) => {
    pendingHoverRef.current = target;
    if (hoverRafRef.current !== null) return;
    hoverRafRef.current = requestAnimationFrame(() => {
      hoverRafRef.current = null;
      const t = pendingHoverRef.current;
      pendingHoverRef.current = undefined;
      const svg = svgRef.current;
      const wrapper = zp.wrapperRef.current;
      if (t === undefined || !svg || !wrapper) return;

      let edgeSet: Set<string> | null = null;
      let nodeSet: Set<string> | null = null;
      if (t) {
        const { nodeEdges, edgeEnds } = adjacencyRef.current;
        if (t.kind === 'node') {
          edgeSet = new Set(nodeEdges.get(t.id) ?? []);
          nodeSet = new Set([t.id]);
          for (const eid of edgeSet) {
            for (const nid of edgeEnds.get(eid) ?? []) nodeSet.add(nid);
          }
        } else {
          edgeSet = new Set([t.id]);
          nodeSet = new Set(edgeEnds.get(t.id) ?? []);
        }
      }

      svg.querySelectorAll<SVGPathElement>('path[data-edge-id]').forEach(p => {
        const id = p.dataset.edgeId ?? '';
        if (!edgeSet) {
          p.style.opacity = '';
          p.style.strokeWidth = '';
        } else if (edgeSet.has(id)) {
          p.style.opacity = '1';
          p.style.strokeWidth = '2.6';
        } else {
          p.style.opacity = '0.08';
          p.style.strokeWidth = '';
        }
      });
      wrapper.querySelectorAll<HTMLElement>('[data-node-id]').forEach(el => {
        const id = el.dataset.nodeId ?? '';
        el.style.opacity = !nodeSet ? '' : nodeSet.has(id) ? '1' : '0.25';
      });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps -- zp.wrapperRef is a stable ref
  }, []);

  // Clear stale inline hover styles when the graph changes under the cursor.
  useEffect(() => applyHover(null), [vm, layout, applyHover]);

  const toggleExpanded = (id: string) =>
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const setDir = (d: Direction) => {
    localStorage.setItem('explore-nl-dir', d);
    setDirection(d);
  };
  const setEdges = (s: EdgeStyle) => {
    localStorage.setItem('explore-nl-edges', s);
    setEdgeStyle(s);
  };

  const attributesWord = dataService.getConceptLabel('attribute', true).toLowerCase();

  const toolBtn = (active: boolean) =>
    `px-2 py-0.5 text-xs rounded border ${active
      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
      : 'border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700'}`;

  return (
    <div className="relative w-full h-full">
      {/* Toolbar */}
      <div className="absolute top-2 right-2 z-10 flex gap-1 items-center">
        <button className={toolBtn(direction === 'RIGHT')} title="Layout left to right"
          onClick={() => setDir('RIGHT')}>LR</button>
        <button className={toolBtn(direction === 'DOWN')} title="Layout top down"
          onClick={() => setDir('DOWN')}>TB</button>
        <span className="w-px h-4 bg-gray-300 dark:bg-slate-600 mx-1" />
        <button className={toolBtn(edgeStyle === 'orthogonal')} title="Orthogonal edges"
          onClick={() => setEdges('orthogonal')}>⌐</button>
        <button className={toolBtn(edgeStyle === 'curved')} title="Curved edges"
          onClick={() => setEdges('curved')}>∿</button>
        <span className="w-px h-4 bg-gray-300 dark:bg-slate-600 mx-1" />
        {([
          ['+', () => zp.zoomBy(1.3), 'Zoom in'],
          ['−', () => zp.zoomBy(1 / 1.3), 'Zoom out'],
          ['1:1', () => zp.applyZoom(1), 'Reset zoom'],
          ['⛶', () => zp.zoomToFit(), 'Fit to view'],
        ] as const).map(([txt, fn, title]) => (
          <button key={txt} onClick={fn} title={title} className={toolBtn(false)}>
            {txt}
          </button>
        ))}
      </div>

      {inProgress && (
        <div className="absolute inset-0 z-10 flex items-center justify-center text-sm text-gray-400 bg-white/50 dark:bg-slate-900/50">
          Computing layout…
        </div>
      )}

      <div ref={zp.containerRef} className="w-full h-full overflow-auto">
        <div ref={zp.spacerRef}>
          <div ref={zp.wrapperRef} className="relative">
            {layout && (
              <>
                <svg
                  ref={svgRef}
                  className="absolute top-0 left-0 pointer-events-none"
                  width={contentW}
                  height={contentH}
                >
                  <defs>
                    <marker id={markerId('arrow-own')} viewBox="0 0 10 7" refX="9" refY="3.5"
                      markerWidth="9" markerHeight="6.5" orient="auto-start-reverse">
                      <path d="M0,0L10,3.5L0,7Z" fill="#d97706" />
                    </marker>
                    {/* flipped storage: arrowhead at the member end points BACK
                        toward the owner (the member stores the FK) */}
                    <marker id={markerId('arrow-own-back')} viewBox="0 0 10 7" refX="9" refY="3.5"
                      markerWidth="9" markerHeight="6.5" orient="auto-start-reverse">
                      <path d="M10,0L0,3.5L10,7Z" fill="#d97706" />
                    </marker>
                    <marker id={markerId('arrow-ref')} viewBox="0 0 10 7" refX="9" refY="3.5"
                      markerWidth="8" markerHeight="5.5" orient="auto-start-reverse">
                      <path d="M0,0L10,3.5L0,7Z" fill="#9ca3af" />
                    </marker>
                  </defs>
                  <g transform={`translate(${PAD}, ${PAD})`}>
                    {layout.edges.map(e => {
                      const spec = edgeById.get(e.id);
                      if (!spec) throw new Error(`Routed edge ${e.id} missing from view model`);
                      const flipped = spec.storageDirection === 'flipped';
                      // back-pointing arrowheads get breathing room off the border
                      const sections = flipped ? trimSectionsEnd(e.sections, 5) : e.sections;
                      const d = edgeStyle === 'curved'
                        ? curvedFromSections(sections)
                        : pathFromSections(sections);
                      if (!d) return null;
                      const isOwn = spec.type === 'ownership';
                      const dimmed =
                        roles.get(e.source) === 'context' || roles.get(e.target) === 'context';
                      const marker = isOwn ? (flipped ? 'arrow-own-back' : 'arrow-own') : 'arrow-ref';
                      return (
                        <g key={e.id}>
                          <path
                            data-edge-id={e.id}
                            d={d}
                            fill="none"
                            opacity={dimmed ? 0.4 : 1}
                            stroke={isOwn ? '#d97706' : '#9ca3af'}
                            strokeWidth={isOwn ? 1.8 : 1.2}
                            strokeDasharray={isOwn ? undefined : '5 4'}
                            markerEnd={`url(#${markerId(marker)})`}
                            style={{ transition: 'opacity 120ms, stroke-width 120ms' }}
                          />
                          {/* invisible fat hit area for edge hover */}
                          <path
                            d={d}
                            fill="none"
                            stroke="transparent"
                            strokeWidth={11}
                            style={{ pointerEvents: 'stroke' }}
                            onMouseEnter={() => applyHover({ kind: 'edge', id: e.id })}
                            onMouseLeave={() => applyHover(null)}
                          />
                        </g>
                      );
                    })}
                  </g>
                </svg>

                {vm.nodes.map(n => {
                  const p = placed.get(n.id);
                  if (!p) return null;
                  const context = n.role === 'context';
                  return (
                    <div
                      key={n.id}
                      data-node-id={n.id}
                      onClick={() => onNodeClick?.(n.id)}
                      onMouseEnter={() => applyHover({ kind: 'node', id: n.id })}
                      onMouseLeave={() => applyHover(null)}
                      className={`absolute rounded-md text-xs bg-white dark:bg-slate-800 [transition:transform_300ms,opacity_120ms] cursor-pointer ${context
                        ? 'opacity-60 border border-dashed border-gray-400 dark:border-slate-500'
                        : 'border-2 border-slate-500 dark:border-slate-400 shadow-md'}`}
                      style={{
                        width: NODE_W,
                        height: n.height,
                        transform: `translate(${p.x + PAD}px, ${p.y + PAD}px)`,
                      }}
                    >
                      <div
                        className="flex items-center gap-1 px-2 rounded-t-[4px] bg-slate-100 dark:bg-slate-700 border-b border-gray-200 dark:border-slate-600"
                        style={{ height: HEADER_H }}
                      >
                        <span className={`font-semibold truncate ${n.abstract ? 'italic' : ''}`} title={n.description || n.id}>
                          {n.label}
                        </span>
                        <span className="ml-auto flex gap-1 shrink-0">
                          {n.isaParents.map(parent => (
                            <span key={parent} title={`is-a ${parent}`}
                              className="text-[9px] px-1 rounded bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200">
                              ⊳ {parent}
                            </span>
                          ))}
                          {n.subclassCount > 0 && (
                            <span title={`${n.subclassCount} subclasses shown`}
                              className="text-[9px] px-1 rounded bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200">
                              ▷ {n.subclassCount}
                            </span>
                          )}
                        </span>
                      </div>
                      {n.rows.map(r => (
                        <div
                          key={r.slot}
                          data-row={r.slot}
                          title={r.channel === 'plain'
                            ? `${r.slot}: ${r.range}`
                            : `${r.slot} → ${r.range} (${r.cardinality})${r.flipped ? ' — owner side' : ''}`}
                          className={`flex items-center gap-1.5 px-2 text-[11px] ${r.connected
                            ? 'text-gray-700 dark:text-gray-300'
                            : 'text-gray-400 dark:text-gray-500'}`}
                          style={{ height: ROW_H }}
                        >
                          {r.channel === 'plain' ? (
                            <span className="w-1.5 h-1.5 rounded-full shrink-0 border border-gray-400 dark:border-gray-500" />
                          ) : (
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${r.channel === 'ownership' ? 'bg-amber-500' : 'bg-gray-400'} ${r.connected ? '' : 'opacity-60'}`} />
                          )}
                          <span className="truncate">{r.slot}</span>
                          {r.isLoop && (
                            <LoopIcon title={`self-referential: a ${r.range} can own another ${r.range} via ${r.slot}`} />
                          )}
                          <span className="ml-auto text-[9px] text-gray-400 dark:text-gray-500 truncate max-w-[90px]">
                            {r.range} {r.cardinality}
                          </span>
                        </div>
                      ))}
                      {n.hiddenCount > 0 && (
                        <button
                          className="w-full text-left px-2 text-[10px] text-sky-600 dark:text-sky-400 hover:underline"
                          style={{ height: FOOTER_H }}
                          title={`${attributesWord} without an edge on the current canvas, plus plain (non-entity) ${attributesWord}`}
                          onClick={ev => {
                            ev.stopPropagation();
                            toggleExpanded(n.id);
                          }}
                        >
                          {n.expanded ? `− fewer ${attributesWord}` : `+ ${n.hiddenCount} more ${attributesWord}`}
                        </button>
                      )}
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
