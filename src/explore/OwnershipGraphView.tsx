/**
 * OwnershipGraphView — the layered ownership DAG (docs/EXPLORE_VIZ.md).
 *
 * Bindings over graph-core: HTML entity nodes (title + attribute rows) are
 * absolutely positioned over an SVG edge layer. Channel rules:
 *  - ownership: amber solid, drawn owner → member (normalized). Edges whose
 *    storage direction was flipped get a re-verbed label ("owns · via slot"),
 *    never the bare slot name pointing the wrong way.
 *  - reference: gray dashed, drawn in FK direction, slot-name label.
 *  - is-a: never an arrow in the ownership plane — rendered as chips on the
 *    nodes (parent: "▷ N", child: "⊳ Parent").
 *  - self-loops: "⟲ slot" chip on the node, not a routed edge.
 * Edges anchor at the attribute row of the slot's storage-side node
 * (Azimutt-style); the other endpoint attaches to the node boundary.
 *
 * Talks to services/DataService only (per app architecture rules);
 * graph-core is pure layout code with zero app imports.
 */

import { useEffect, useId, useMemo } from 'react';
import type { DataService, OwnershipSubgraph, OwnershipSubgraphEdge } from '../services/DataService';
import {
  useGraphLayout, useZoomPan, anchoredPath, anchoredPathPoint,
} from './graph-core';
import type { AnchorDir, GraphSpec, PlacedNode, Point } from './graph-core';

const NODE_W = 210;
const HEADER_H = 30;
const ROW_H = 20;
const PAD = 28;

interface RowVM {
  slot: string;
  cardinality: string;
  channel: 'ownership' | 'reference';
}

interface NodeVM {
  id: string;
  label: string;
  role: 'selected' | 'context';
  layer: number;
  abstract: boolean;
  description: string;
  rows: RowVM[];
  isaParents: string[];
  subclassCount: number;
  loops: string[];
  height: number;
}

interface ViewModel {
  nodes: NodeVM[];
  /** Drawable (routed) edges: ownership + reference, minus self-loops. */
  edges: OwnershipSubgraphEdge[];
}

/** The node whose attribute row stores the slot (edge anchor side). */
function hostOf(e: OwnershipSubgraphEdge): string {
  return e.storageDirection === 'flipped' ? e.target : e.source;
}

function buildViewModel(sub: OwnershipSubgraph): ViewModel {
  const rowsByNode = new Map<string, RowVM[]>();
  const isaParents = new Map<string, string[]>();
  const subclassCount = new Map<string, number>();
  const loops = new Map<string, string[]>();
  const edges: OwnershipSubgraphEdge[] = [];

  for (const e of sub.edges) {
    if (e.type === 'isa') {
      isaParents.set(e.target, [...(isaParents.get(e.target) ?? []), e.source]);
      subclassCount.set(e.source, (subclassCount.get(e.source) ?? 0) + 1);
      continue;
    }
    if (e.isLoop) {
      loops.set(e.source, [...(loops.get(e.source) ?? []), e.slotName]);
      continue;
    }
    const host = hostOf(e);
    const rows = rowsByNode.get(host) ?? [];
    if (!rows.some(r => r.slot === e.slotName)) {
      rows.push({
        slot: e.slotName,
        cardinality: e.cardinality,
        channel: e.type === 'reference' ? 'reference' : 'ownership',
      });
      rowsByNode.set(host, rows);
    }
    edges.push(e);
  }

  const nodes = sub.nodes.map((n): NodeVM => {
    const rows = rowsByNode.get(n.id) ?? [];
    return {
      ...n,
      rows,
      isaParents: isaParents.get(n.id) ?? [],
      subclassCount: subclassCount.get(n.id) ?? 0,
      loops: loops.get(n.id) ?? [],
      height: HEADER_H + rows.length * ROW_H + (rows.length ? 5 : 0),
    };
  });

  return { nodes, edges };
}

interface EndPoint {
  pt: Point;
  dir: AnchorDir;
  /** Non-row anchors sharing a node side get spread apart by this key. */
  spreadKey?: string;
}

interface EdgeGeometry {
  edge: OwnershipSubgraphEdge;
  start: EndPoint;
  end: EndPoint;   // arrow side (drawn target)
  dimmed: boolean;
}

function computeEdgeGeometry(
  vm: ViewModel,
  placed: Map<string, PlacedNode>,
  roles: Map<string, 'selected' | 'context'>,
): EdgeGeometry[] {
  const rowsByNode = new Map(vm.nodes.map(n => [n.id, n.rows]));

  const geos = vm.edges.flatMap((edge): EdgeGeometry[] => {
    const host = hostOf(edge);
    const other = edge.source === host ? edge.target : edge.source;
    const hp = placed.get(host);
    const op = placed.get(other);
    if (!hp || !op) return []; // layout still catching up to a new subgraph
    const idx = rowsByNode.get(host)?.findIndex(r => r.slot === edge.slotName) ?? -1;
    if (idx < 0) throw new Error(`No attribute row for ${edge.slotName} on ${host}`);

    const hostCx = hp.x + hp.width / 2;
    const otherCx = op.x + op.width / 2;
    const side: AnchorDir = otherCx >= hostCx ? 'right' : 'left';
    const rowEnd: EndPoint = {
      pt: {
        x: side === 'right' ? hp.x + hp.width : hp.x,
        y: hp.y + HEADER_H + idx * ROW_H + ROW_H / 2,
      },
      dir: side,
    };

    const hostCy = hp.y + hp.height / 2;
    const otherCy = op.y + op.height / 2;
    let otherEnd: EndPoint;
    if (otherCy > hostCy + 10) {
      otherEnd = { pt: { x: otherCx, y: op.y }, dir: 'up', spreadKey: `${other}:top` };
    } else if (otherCy < hostCy - 10) {
      otherEnd = { pt: { x: otherCx, y: op.y + op.height }, dir: 'down', spreadKey: `${other}:bottom` };
    } else {
      const s: AnchorDir = hostCx >= otherCx ? 'right' : 'left';
      otherEnd = {
        pt: { x: s === 'right' ? op.x + op.width : op.x, y: otherCy },
        dir: s,
        spreadKey: `${other}:${s}`,
      };
    }

    // Arrow points into the drawn target: for flipped ownership the slot row
    // is on the member (drawn target); otherwise the row is on the source.
    const [start, end] = edge.storageDirection === 'flipped'
      ? [otherEnd, rowEnd]
      : [rowEnd, otherEnd];
    const dimmed = roles.get(edge.source) === 'context' || roles.get(edge.target) === 'context';
    return [{ edge, start, end, dimmed }];
  });

  // Spread boundary anchors that share a node side so edges don't stack.
  const groups = new Map<string, EndPoint[]>();
  for (const g of geos) {
    for (const ep of [g.start, g.end]) {
      if (ep.spreadKey) groups.set(ep.spreadKey, [...(groups.get(ep.spreadKey) ?? []), ep]);
    }
  }
  for (const eps of groups.values()) {
    if (eps.length < 2) continue;
    eps.forEach((ep, i) => {
      const offset = (i - (eps.length - 1) / 2) * 16;
      if (ep.dir === 'up' || ep.dir === 'down') ep.pt.x += offset;
      else ep.pt.y += offset;
    });
  }

  return geos;
}

function edgeLabel(e: OwnershipSubgraphEdge): string {
  if (e.type === 'ownership' && e.storageDirection === 'flipped') {
    return `owns · via ${e.slotName}`;
  }
  return e.slotName;
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

  const subgraph = useMemo(
    () => dataService.getOwnershipSubgraph([...selectedIds].sort()),
    [dataService, selectedIds],
  );
  const vm = useMemo(() => buildViewModel(subgraph), [subgraph]);

  const spec = useMemo((): GraphSpec => ({
    nodes: vm.nodes.map(n => ({
      id: n.id, width: NODE_W, height: n.height, partition: n.layer,
    })),
    edges: vm.edges.map(e => ({ id: e.id, source: e.source, target: e.target })),
  }), [vm]);

  const { layout, inProgress } = useGraphLayout(spec, {
    direction: 'DOWN', usePartitions: true, nodeSpacing: 40, layerSpacing: 64,
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
  const edgeGeos = useMemo(
    () => (layout ? computeEdgeGeometry(vm, placed, roles) : []),
    [layout, vm, placed, roles],
  );

  return (
    <div className="relative w-full h-full">
      {/* Zoom toolbar */}
      <div className="absolute top-2 right-2 z-10 flex gap-1">
        {([
          ['+', () => zp.zoomBy(1.3), 'Zoom in'],
          ['−', () => zp.zoomBy(1 / 1.3), 'Zoom out'],
          ['1:1', () => zp.applyZoom(1), 'Reset zoom'],
          ['⛶', () => zp.zoomToFit(), 'Fit to view'],
        ] as const).map(([txt, fn, title]) => (
          <button
            key={txt}
            onClick={fn}
            title={title}
            className="px-2 py-0.5 text-xs rounded border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700"
          >
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
                  className="absolute top-0 left-0 pointer-events-none"
                  width={contentW}
                  height={contentH}
                >
                  <defs>
                    <marker id={markerId('arrow-own')} viewBox="0 0 10 7" refX="9" refY="3.5"
                      markerWidth="9" markerHeight="6.5" orient="auto-start-reverse">
                      <path d="M0,0L10,3.5L0,7Z" fill="#d97706" />
                    </marker>
                    <marker id={markerId('arrow-ref')} viewBox="0 0 10 7" refX="9" refY="3.5"
                      markerWidth="8" markerHeight="5.5" orient="auto-start-reverse">
                      <path d="M0,0L10,3.5L0,7Z" fill="#9ca3af" />
                    </marker>
                  </defs>
                  {edgeGeos.map(({ edge, start, end, dimmed }) => {
                    const shift = (p: Point): Point => ({ x: p.x + PAD, y: p.y + PAD });
                    const p0 = shift(start.pt);
                    const p1 = shift(end.pt);
                    const isOwn = edge.type === 'ownership';
                    const mid = anchoredPathPoint(p0, start.dir, p1, end.dir, 0.5);
                    return (
                      <g key={edge.id} opacity={dimmed ? 0.4 : 1}>
                        <path
                          d={anchoredPath(p0, start.dir, p1, end.dir)}
                          fill="none"
                          stroke={isOwn ? '#d97706' : '#9ca3af'}
                          strokeWidth={isOwn ? 1.8 : 1.2}
                          strokeDasharray={isOwn ? undefined : '5 4'}
                          markerEnd={`url(#${markerId(isOwn ? 'arrow-own' : 'arrow-ref')})`}
                        />
                        <text
                          x={mid.x}
                          y={mid.y - 4}
                          textAnchor="middle"
                          className={`text-[9px] ${isOwn
                            ? 'fill-amber-800 dark:fill-amber-400'
                            : 'fill-gray-500 dark:fill-gray-400'} stroke-white dark:stroke-slate-900`}
                          style={{ paintOrder: 'stroke', strokeWidth: 3 }}
                        >
                          {edgeLabel(edge)}
                        </text>
                      </g>
                    );
                  })}
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
                      className={`absolute rounded-md text-xs bg-white dark:bg-slate-800 transition-transform duration-300 cursor-pointer ${context
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
                          {n.loops.map(slot => (
                            <span key={slot} title={`self-referential: ${slot}`}
                              className="text-[9px] px-1 rounded bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200">
                              ⟲ {slot}
                            </span>
                          ))}
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
                          className="flex items-center gap-1.5 px-2 text-[11px] text-gray-700 dark:text-gray-300"
                          style={{ height: ROW_H }}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${r.channel === 'ownership' ? 'bg-amber-500' : 'bg-gray-400'}`} />
                          <span className="truncate">{r.slot}</span>
                          <span className="ml-auto text-[9px] text-gray-400">{r.cardinality}</span>
                        </div>
                      ))}
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
