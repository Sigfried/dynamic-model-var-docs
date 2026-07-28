/**
 * OwnershipGraphView — the layered ownership DAG (docs/EXPLORE_VIZ.md).
 *
 * Bindings over graph-core: HTML entity nodes (title + attribute rows) are
 * absolutely positioned over an SVG edge layer. Layout and edge routing are
 * both ELK's (layered, left→right, orthogonal sections): each drawn edge
 * attaches to a fixed-position ELK port at its slot's attribute row on the
 * storage-side node, so crossing minimization and routing account for the
 * real attach points (the icd11 NodeLinkView approach, plus ports).
 *
 * Channel rules:
 *  - ownership: amber solid, drawn owner → member (normalized). No floating
 *    edge labels — the row the edge attaches to names the slot.
 *  - reference: gray dashed, drawn in FK direction.
 *  - is-a: never an arrow in the ownership plane — chips on the nodes
 *    (parent: "▷ N", child: "⊳ Parent").
 *  - self-loops: ⟲ marker on the slot's own row, not a routed edge.
 * Nodes list ALL their entity-ranged slots (schema order, selection-
 * independent); rows whose range is off-canvas are dimmed — these become
 * the expand-on-demand affordances.
 *
 * Talks to services/DataService only (per app architecture rules);
 * graph-core is pure layout code with zero app imports.
 */

import { useEffect, useId, useMemo } from 'react';
import type {
  DataService, OwnershipSubgraph, OwnershipSubgraphEdge, OwnershipSubgraphNode,
} from '../services/DataService';
import { useGraphLayout, useZoomPan, pathFromSections } from './graph-core';
import type { GraphSpec, GraphSpecPort } from './graph-core';

const NODE_W = 240;
const HEADER_H = 30;
const ROW_H = 20;
const PAD = 28;

interface NodeVM extends OwnershipSubgraphNode {
  isaParents: string[];
  subclassCount: number;
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

const portId = (nodeId: string, slot: string) => `${nodeId}::${slot}`;

function buildViewModel(sub: OwnershipSubgraph): ViewModel {
  const isaParents = new Map<string, string[]>();
  const subclassCount = new Map<string, number>();
  const edges: OwnershipSubgraphEdge[] = [];

  for (const e of sub.edges) {
    if (e.type === 'isa') {
      isaParents.set(e.target, [...(isaParents.get(e.target) ?? []), e.source]);
      subclassCount.set(e.source, (subclassCount.get(e.source) ?? 0) + 1);
    } else if (!e.isLoop) {
      edges.push(e);
    }
  }

  const nodes = sub.nodes.map((n): NodeVM => ({
    ...n,
    isaParents: isaParents.get(n.id) ?? [],
    subclassCount: subclassCount.get(n.id) ?? 0,
    height: HEADER_H + n.slots.length * ROW_H + (n.slots.length ? 5 : 0),
  }));

  return { nodes, edges };
}

/** y-center of a slot's row, relative to the node's top-left. */
function rowY(node: NodeVM, slot: string): number {
  const idx = node.slots.findIndex(s => s.slot === slot);
  if (idx < 0) throw new Error(`No attribute row for ${slot} on ${node.id}`);
  return HEADER_H + idx * ROW_H + ROW_H / 2;
}

/**
 * ELK spec: one port per drawn edge's slot row on its storage-side node.
 * Direction is RIGHT (owners left), so forward-stored slots exit the host's
 * east side and flipped ones receive on the host's west side — both flow
 * with the layout.
 */
function buildSpec(vm: ViewModel): GraphSpec {
  const portsByNode = new Map<string, GraphSpecPort[]>();
  const addPort = (node: NodeVM, slot: string, side: 'east' | 'west'): string => {
    const id = portId(node.id, slot);
    const ports = portsByNode.get(node.id) ?? [];
    if (!ports.some(p => p.id === id)) {
      ports.push({ id, x: side === 'east' ? NODE_W : 0, y: rowY(node, slot) });
      portsByNode.set(node.id, ports);
    }
    return id;
  };

  const nodeById = new Map(vm.nodes.map(n => [n.id, n]));
  const edges = vm.edges.map(e => {
    const host = nodeById.get(hostOf(e));
    if (!host) throw new Error(`Edge ${e.id} host missing from subgraph`);
    const flipped = e.storageDirection === 'flipped';
    const pid = addPort(host, e.slotName, flipped ? 'west' : 'east');
    return {
      id: e.id,
      source: e.source,
      target: e.target,
      ...(flipped ? { targetPort: pid } : { sourcePort: pid }),
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
  const spec = useMemo(() => buildSpec(vm), [vm]);

  const { layout, inProgress } = useGraphLayout(spec, {
    direction: 'RIGHT',
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
  const visibleIds = useMemo(() => new Set(vm.nodes.map(n => n.id)), [vm]);

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
                  <g transform={`translate(${PAD}, ${PAD})`}>
                    {layout.edges.map(e => {
                      const d = pathFromSections(e.sections);
                      if (!d) return null;
                      const isOwn = subgraph.edges.find(se => se.id === e.id)?.type === 'ownership';
                      const dimmed =
                        roles.get(e.source) === 'context' || roles.get(e.target) === 'context';
                      return (
                        <path
                          key={e.id}
                          d={d}
                          fill="none"
                          opacity={dimmed ? 0.4 : 1}
                          stroke={isOwn ? '#d97706' : '#9ca3af'}
                          strokeWidth={isOwn ? 1.8 : 1.2}
                          strokeDasharray={isOwn ? undefined : '5 4'}
                          markerEnd={`url(#${markerId(isOwn ? 'arrow-own' : 'arrow-ref')})`}
                        />
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
                      {n.slots.map(s => {
                        const connected = s.isLoop || visibleIds.has(s.range);
                        return (
                          <div
                            key={s.slot}
                            data-row={s.slot}
                            title={`${s.slot} → ${s.range} (${s.cardinality})${s.flipped ? ' — owner side' : ''}`}
                            className={`flex items-center gap-1.5 px-2 text-[11px] ${connected
                              ? 'text-gray-700 dark:text-gray-300'
                              : 'opacity-45 text-gray-500 dark:text-gray-400'}`}
                            style={{ height: ROW_H }}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.channel === 'ownership' ? 'bg-amber-500' : 'bg-gray-400'}`} />
                            <span className="truncate">{s.slot}</span>
                            {s.isLoop && <span className="text-amber-600 dark:text-amber-400">⟲</span>}
                            <span className="ml-auto text-[9px] text-gray-400 truncate max-w-[80px]">
                              {s.range} {s.cardinality}
                            </span>
                          </div>
                        );
                      })}
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
