/**
 * OwnershipGraphView — the layered ownership DAG (docs/EXPLORE_VIZ.md).
 *
 * Bindings over graph-core: HTML entity nodes (title + attribute rows) are
 * absolutely positioned over an SVG edge layer. Layout and edge routing are
 * both ELK's (layered, orthogonal). An edge joins an ATTRIBUTE on one class to
 * another class AS A WHOLE, so its two ends are not alike:
 *  - the ATTRIBUTE END attaches to a fixed-position ELK port at its slot's own
 *    row, and is the only end that names a slot;
 *  - the ENTITY END attaches to a header-level port on the target class, which
 *    has no corresponding row, so edges "point at the entity name".
 * Routing therefore sees the real attach points.
 *
 * Channel rules:
 *  - ownership: amber solid, drawn owner → member (normalized). Flipped
 *    storage direction is marked at the member end: the arrowhead points
 *    BACK toward the owner (the member stores the FK).
 *  - reference: gray dashed, drawn in FK direction.
 *  - is-a: never an arrow in the ownership plane — chips on the nodes.
 *  - self-loops: ⟲ marker on the slot's own row, not a routed edge.
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
  AttributeSummary,
  DataService, OwnershipSubgraph, OwnershipSubgraphEdge, OwnershipSubgraphNode,
} from '../services/DataService';
import { cardinalityLabel } from '../services/DataService';
import {
  useGraphLayout, useZoomPan, roundedPath, sectionPoints, mergeTail,
  smoothStepPath,
  arrowPath,
} from './graph-core';
import type { EdgeSection, GraphSpec, GraphSpecPort, PlacedNode, Point } from './graph-core';

/** Where a convergence group's single arrowhead sits: `base` is the centre of
 *  its base (every merging edge terminates there, none draws a head of its own)
 *  and `dir` is the unit vector it points along. */
type MergeTarget = { base: Point; dir: Point };

const NODE_W = 240;
const HEADER_H = 30;
const ROW_H = 20;
/** One wrapped line of owner chips. */
const OWNERS_LINE_H = 15;
/** Vertical padding around the owner-chip strip. */
const OWNERS_PAD = 8;

/**
 * Height of the owner-chip strip. Chips wrap, so the strip grows with the
 * number of owners; estimated from label widths since the real wrap happens
 * in the browser and ELK needs a height up front. Over-estimating costs a few
 * px of blank node; under-estimating clips chips, so round up.
 */
function ownersStripHFor(owners: string[]): number {
  if (!owners.length) return 0;
  const CHAR_W = 4.6;      // ~9px font
  const CHIP_PAD = 10;
  const AVAIL = NODE_W - 16;
  let line = 52;           // "owned by" label
  let lines = 1;
  for (const o of [...owners, 'add all']) {
    const w = o.length * CHAR_W + CHIP_PAD;
    if (line + w > AVAIL) { lines++; line = w; }
    else line += w + 4;
  }
  return lines * OWNERS_LINE_H + OWNERS_PAD;
}
const FOOTER_H = 18;
const PAD = 28;

type Direction = 'RIGHT' | 'DOWN';

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
  /**
   * Owners of this class that aren't drawn — the "what uses this?" answer
   * path-to-root used to give by drawing the entire upstream graph. Empty
   * when pathToRoot is on, since those owners are then real nodes.
   */
  hiddenOwners: string[];
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
  plainSlotsFor: (id: string) => AttributeSummary[],
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
    // Schema order. The subgraph's slot lists come out in graph-insertion
    // order (collectNodeSlots walks the edge set, and the edges come from
    // graphology's outbound iteration), which is arbitrary — it put date_ended
    // before date_started and valid_to before valid_from. getClassSummary
    // lists every attribute of the class in the order bdchm declares them, so
    // it is the authoritative index; anything missing from it sorts last
    // rather than disappearing.
    const schemaOrder = new Map(
      plainSlotsFor(n.id).map((s, i) => [s.name, i] as const),
    );
    const bySchema = (a: { slot: string }, b: { slot: string }) =>
      (schemaOrder.get(a.slot) ?? Number.MAX_SAFE_INTEGER)
      - (schemaOrder.get(b.slot) ?? Number.MAX_SAFE_INTEGER);

    const entityRows = n.slots.map((s): RowVM => ({
      ...s,
      connected: s.isLoop || drawn.has(`${n.id}|${s.slot}`),
    })).sort(bySchema);
    const entityNames = new Set(entityRows.map(r => r.slot));
    // Scalar/enum-valued attributes: everything getClassSummary lists that
    // isn't already an entity-ranged row.
    const plainRows = plainSlotsFor(n.id)
      .filter(s => !entityNames.has(s.name))
      .map((s): RowVM => ({
        slot: s.name, range: s.range, channel: 'plain',
        // Same label drawn edges use. These rows have no edge to carry it —
        // scalar/enum ranges are never drawn — but the cardinality is a fact
        // about the attribute, not about whether it happens to be drawn.
        flipped: false, cardinality: cardinalityLabel(s.required, s.multivalued),
        isLoop: false, connected: false,
      }));
    const connected = entityRows.filter(r => r.connected);
    // Entity-ranged and plain rows interleave by schema order once hidden,
    // rather than showing all the entity ones then all the scalars.
    const hidden = [...entityRows.filter(r => !r.connected), ...plainRows]
      .sort(bySchema);
    // A node whose attributes are all scalars (BodySite: id/qualifier/site)
    // has nothing connected, so collapsed it renders as an empty box offering
    // to reveal its only content. Show the attributes instead.
    const expanded = expandedNodes.has(n.id) || connected.length === 0;
    const rows = expanded ? [...connected, ...hidden] : connected;
    const owners = sub.hiddenOwners.get(n.id) ?? [];
    return {
      ...n,
      isaParents: isaParents.get(n.id) ?? [],
      subclassCount: subclassCount.get(n.id) ?? 0,
      hiddenOwners: owners,
      rows,
      hiddenCount: hidden.length,
      expanded,
      height: HEADER_H + ownersStripHFor(owners) + rows.length * ROW_H
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

/** Top of the row list: below the header, and below the owners strip if shown. */
function rowsTop(node: NodeVM): number {
  return HEADER_H + ownersStripHFor(node.hiddenOwners);
}

/** y-center of a slot's displayed row, relative to the node's top-left. */
function rowY(node: NodeVM, slot: string): number {
  const idx = node.rows.findIndex(r => r.slot === slot);
  if (idx < 0) throw new Error(`No displayed row for ${slot} on ${node.id}`);
  return rowsTop(node) + idx * ROW_H + ROW_H / 2;
}

/** Gap between adjacent entity-end ports (px). Small on purpose: the fan is a
 *  routing device, not a visual one — see buildSpec. */
const ENTITY_FAN_GAP = 4;

/** Corner radius for orthogonal edges. Large enough that a tight fan of
 *  converging edges sweeps into the header rather than meeting it at hard
 *  right angles; 0 would render exactly like the old square-cornered mode. */
const CORNER_R = 10;

/** Entity title font size (px). The node body is Tailwind `text-xs`, and the
 *  title span inherits it, so 1em at the title is 12px. The single convergence
 *  arrowhead is sized off this so it reads as belonging to the name it points
 *  at, rather than to an arbitrary px scale. */
const TITLE_EM = 12;

/** The one arrowhead per convergence, sized off the title text: ~1em across the
 *  BASE, ~1.5em from base to point. In LR the arrow points along x, so the base
 *  is vertical (span = height, len = along x); for TB the arrow points down and
 *  the two swap — handled at draw time, not here. */
const ARROW_SPAN = TITLE_EM;        // base width, ~1em
const ARROW_LEN = TITLE_EM * 1.5;   // base → point, ~1.5em

/** Gap between a node's border and the arrowhead TIP, so the whole head is
 *  visible against the canvas rather than half-buried in the border. */
const ARROW_GAP = 0;

/** Reference edges are secondary; their heads are a touch smaller. */
const REF_SCALE = 0.85;


/** Edge stroke widths. Kept here rather than inline because the hover value is
 *  applied by direct DOM styling in the RAF pass, far from the render that sets
 *  the default — as literals the two silently drift apart. References stay
 *  proportionally lighter than ownership. */
const STROKE_OWN = 0.8;
const STROKE_OWN_HOVER = 1.6;
const STROKE_REF = STROKE_OWN * 0.67;
const STROKE_REF_HOVER = STROKE_OWN_HOVER * 0.67;

/**
 * Where converging edges stop being separate lines and become one.
 * Four candidates, switchable in the toolbar so they can be compared on real
 * data. Kept deliberately: Siggie wants to see all four rendered with the
 * single convergence arrowhead before one is settled on. Until then, do not
 * delete the losers — there is no winner yet.
 *  - 'near'  ~40px: parallel and distinct until close to the node, then sweep
 *            together. Each edge stays traceable to its owner.
 *  - 'far'   ~120px: converge early, so the approach reads as one trunk that
 *            splits back to its sources. Quieter near the node, harder to trace.
 *  - 'bend'  at ELK's last corner: adaptive per edge, but the distance then
 *            varies between nodes and layouts.
 *  - 'off'   no merging — every edge runs to its own fanned port.
 */
export type MergeMode = 'near' | 'far' | 'bend' | 'off';

/** Merge distance in px for a mode, given the edge's routed points. */
function mergeDistFor(mode: MergeMode, pts: Point[]): number {
  if (mode === 'off' || pts.length < 2) return 0;
  if (mode === 'near') return 40;
  if (mode === 'far') return 120;
  // 'bend': distance from the end back to the last routed corner.
  //
  // NB: cutting exactly here puts the corner at the seam between the routed
  // head and the merge curve, and roundedPath cannot round a seam corner (it
  // rounds only corners with segments on BOTH sides). That is why this mode
  // shows hard right angles. Overshooting by CORNER_R*1.5 to swallow the
  // corner was tried on 2026-08-19 and is WORSE: when the last segment is
  // short the cut lands past the corner, onto the long run before it, so the
  // approaches get replaced by curve far too early and bunch into a cramped
  // parallel bundle. Fix the rounding at the seam, not the cut distance.
  const end = pts[pts.length - 1];
  const prev = pts[pts.length - 2];
  return Math.hypot(end.x - prev.x, end.y - prev.y);
}

/** Per-edge offset for a fan of `total` ports, shrunk to stay inside `limit`
 *  px overall however many edges converge. */
function fanSpread(total: number, limit: number): number {
  if (total < 2) return 0;
  return Math.min(ENTITY_FAN_GAP, limit / (total - 1));
}

/**
 * ELK spec. Each drawn edge gets a fixed-position port at its slot's row on
 * the ATTRIBUTE-end node (east when that node is the drawn source, west when
 * it receives) — the end that genuinely names a slot. The ENTITY end (the peer
 * class, which has no corresponding row) gets a header-level port, tightly
 * fanned, so edges land on the entity name rather than beside an unrelated
 * attribute row.
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

  /**
   * Entity-end ports fan out instead of all sharing one header point: six
   * edges converging on BodySite through a single ::hdr:in port produced
   * overlapping orthogonal runs that read as an edge between two unrelated
   * owners. One port per edge, ordered, keeps ELK's runs distinct.
   *
   * The fan is deliberately TIGHT (ENTITY_FAN_GAP px apart, centred on the
   * header) — it exists only so ELK routes the approach lanes separately, not
   * as a visual feature. An earlier version spread ports over the whole header
   * band and spilled below it, so arrows landed beside attribute rows and
   * falsely implied "this edge is about that row". Only the ATTRIBUTE end
   * carries row meaning; the entity end points at the class as a whole.
   */
  const freeEndTotal = new Map<string, number>();
  for (const e of vm.edges) {
    const freeId = hostOf(e) === e.source ? e.target : e.source;
    const side = `${freeId}|${freeId === e.source ? 'out' : 'in'}`;
    freeEndTotal.set(side, (freeEndTotal.get(side) ?? 0) + 1);
  }

  /**
   * NB: fan slot index here is just a distinct lane per edge — it deliberately
   * carries NO ordering meaning. Ordering the ports by any pre-layout proxy
   * (row y, owner name) is guesswork, because which approach arrives from where
   * is ELK's decision and is not known until after layout. An attempt to sort
   * by row y made things worse (2026-08-20): it gave the top row the straight
   * shot and forced every lower one to climb over it.
   *
   * Re-ordering the approaches at render time by where each routed path
   * arrives from was also tried and reverted: it spread the arrival points
   * across the arrowhead base, which is not what was wanted. The lanes are
   * therefore unordered, and ELK decides which approach uses which.
   */
  const freeEndSlot = new Map<string, number>();

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
    const side = `${free.id}|${freeIsSource ? 'out' : 'in'}`;
    const total = freeEndTotal.get(side) ?? 1;
    const idx = freeEndSlot.get(side) ?? 0;
    freeEndSlot.set(side, idx + 1);
    // Tight fan centred on the header: just enough separation for ELK to route
    // each approach in its own lane, never spilling past the header band.
    const spread = fanSpread(total, HEADER_H - 4);
    const offset = HEADER_H / 2 + (idx - (total - 1) / 2) * spread;
    const headerPort = direction === 'RIGHT'
      ? addPort(free, `${free.id}::hdr:${freeIsSource ? 'out' : 'in'}:${idx}`,
          freeIsSource ? NODE_W : 0, offset)
      : addPort(free, `${free.id}::hdr:${freeIsSource ? 'out' : 'in'}:${idx}`,
          NODE_W / 2 + (idx - (total - 1) / 2) * fanSpread(total, NODE_W / 2),
          freeIsSource ? free.height : 0);
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

/** The mirror of trimSectionsEnd, for the START vertex.
 *
 *  Only association edges need it, because only they carry a markerStart.
 *  arrow-assoc uses refX=0, which puts the marker's BASE on the path vertex and
 *  its tip ARROW_LEN beyond — and since the node boxes are opaque divs stacked
 *  ON TOP of this SVG layer, a tip that overshoots the border is painted over
 *  and the arrowhead simply vanishes. (It showed up only when hovering a dimmed
 *  box, which is translucent.) Pulling the start back by the head's own length
 *  puts the tip on the border instead of behind it. */
function trimSectionsStart(sections: EdgeSection[] | undefined, dist: number): EdgeSection[] | undefined {
  if (!sections?.length) return sections;
  const s = sections[0];
  const next = s.bendPoints?.length ? s.bendPoints[0] : s.endPoint;
  const dx = next.x - s.startPoint.x;
  const dy = next.y - s.startPoint.y;
  const len = Math.hypot(dx, dy);
  if (len < 1) return sections;
  const k = Math.min(dist, len * 0.8) / len;
  const startPoint = { x: s.startPoint.x + dx * k, y: s.startPoint.y + dy * k };
  return [{ ...s, startPoint }, ...sections.slice(1)];
}

export default function OwnershipGraphView({
  dataService,
  selectedIds,
  onNodeClick,
  expandedIds,
  onExpand,
  onCollapse,
  pathToRoot = false,
  onTogglePathToRoot,
}: {
  dataService: DataService;
  selectedIds: Set<string>;
  onNodeClick?: (id: string) => void;
  /** Expand-on-demand: extra classes pulled onto the canvas, drawn as context. */
  expandedIds?: Set<string>;
  /** Clicking a dimmed entity row pulls its range in. */
  onExpand?: (classId: string) => void;
  /** Dismiss an expanded context node. */
  onCollapse?: (classId: string) => void;
  /** Draw each selected class's ownership ancestors as dimmed context nodes. */
  pathToRoot?: boolean;
  onTogglePathToRoot?: () => void;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const markerId = (name: string) => `${name}-${uid}`;

  const [direction, setDirection] = useState<Direction>(
    () => (localStorage.getItem('explore-nl-dir') as Direction) || 'RIGHT',
  );
  const [mergeMode, setMergeMode] = useState<MergeMode>(
    () => (localStorage.getItem('explore-nl-merge') as MergeMode) || 'near',
  );
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  // Expansions that duplicate the selection are dropped: a selected class is
  // already visible, and passing it as an expansion would not change the
  // subgraph but would let a stale id linger in the URL.
  const expansionList = useMemo(
    () => [...(expandedIds ?? [])].filter(id => !selectedIds.has(id)).sort(),
    [expandedIds, selectedIds],
  );
  const subgraph = useMemo(
    () => dataService.getOwnershipSubgraph(
      [...selectedIds].sort(), expansionList, { pathToRoot },
    ),
    [dataService, selectedIds, expansionList, pathToRoot],
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
  const [nudges, setNudges] = useState<Map<string, { dx: number; dy: number }>>(new Map());
  /**
   * Nodes moved by a completed drag, id → offset from ELK's placement. The
   * node STAYS where it was dropped and its edges are re-routed by our own
   * geometry (see dragRoutes); ELK is not re-run.
   *
   * Feeding the dropped coordinates back to ELK was tried on 2026-08-20 and
   * does not work. Honouring supplied x/y needs the INTERACTIVE layering /
   * crossing-minimisation strategies, and those read coordinates as ORDERING
   * HINTS, not positions: ELK infers which layer and what sequence the node
   * belongs in, then re-places it wherever that layer falls. Dropping BodySite
   * at the far right moved it somewhere else entirely, and on one graph the
   * layout hung. ELK is a batch layouter; it has no "keep this here" mode.
   */
  const [pins, setPins] = useState<Map<string, { dx: number; dy: number }>>(new Map());

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
    if (!layout) return;
    zp.setContentSize(contentW, contentH);
    // Default to fit-to-view: re-fit whenever a new layout lands, until the
    // user takes manual zoom control (a +/−/1:1 click or ctrl+wheel), after
    // which their chosen level is left alone.
    if (zp.isAutoFit()) zp.zoomToFit();
  // eslint-disable-next-line react-hooks/exhaustive-deps -- zp fns are stable
  }, [layout, contentW, contentH]);

  /**
   * Manual node nudges, id → {dx, dy}, applied on top of ELK's placement.
   *
   * A probe, not a feature: ELK's routing choices depend on where the boxes
   * sit, and dragging one is the only way to see WHICH choice changes without
   * re-running a whole selection. Edges keep ELK's original routing, so a
   * dragged box shows its edges leaving from the old geometry — that mismatch
   * is the point (it is exactly what ELK decided, unsmoothed).
   */

  // The in-flight delta is spent once it becomes a pin; pins themselves
  // survive re-layouts of the same selection.
  useEffect(() => setNudges(new Map()), [layout]);
  // Selection changes invalidate pins: the node may not even be on canvas.
  useEffect(() => setPins(new Map()), [subgraph]);

  const placedRef = useRef<Map<string, PlacedNode>>(new Map());
  // Set when a drag actually moved something, so the click that ends the drag
  // does not also open the drawer (dragging a node popped it up in the detail
  // pane, 2026-08-20).
  const draggedRef = useRef(false);
  const nudgesRef = useRef(nudges);
  nudgesRef.current = nudges;
  const placed = useMemo(() => {
    const m = new Map((layout?.nodes ?? []).map(n => [n.id, n]));
    // A dropped pin and an in-flight drag are the same kind of offset; the
    // live one wins while the pointer is down.
    const offsets = new Map(pins);
    for (const [id, o] of nudges) offsets.set(id, o);
    for (const [id, { dx, dy }] of offsets) {
      const n = m.get(id);
      if (n) m.set(id, { ...n, x: n.x + dx, y: n.y + dy });
    }
    placedRef.current = m;
    return m;
  }, [layout, nudges, pins]);

  /**
   * Drag a node box. Pointer capture keeps the drag alive when the cursor
   * leaves the box; the delta is divided by zoom so a drag tracks the cursor
   * at any zoom level.
   */
  const startDrag = useCallback((id: string, ev: React.PointerEvent) => {
    if (ev.button !== 0) return;
    // Only drag from inert parts of the box. Starting a drag on a chip, an
    // "add all" link, a row or the × swallowed their click: pointerdown fires
    // first, and capturing the pointer here meant the later click never
    // reached them (2026-08-20).
    if ((ev.target as HTMLElement).closest('button, a, [role="button"], [data-no-drag]')) return;
    ev.stopPropagation();
    const startX = ev.clientX;
    const startY = ev.clientY;
    const z = zp.getZoom() || 1;
    const base = nudges.get(id) ?? { dx: 0, dy: 0 };
    const el = ev.currentTarget as HTMLElement;
    el.setPointerCapture(ev.pointerId);
    let moved = false;
    const move = (e: PointerEvent) => {
      const dx = (e.clientX - startX) / z;
      const dy = (e.clientY - startY) / z;
      if (!moved && Math.hypot(dx, dy) < 3) return;  // let a click stay a click
      moved = true;
      draggedRef.current = true;
      setNudges(prev => new Map(prev).set(id, { dx: base.dx + dx, dy: base.dy + dy }));
    };
    const up = (e: PointerEvent) => {
      el.releasePointerCapture(e.pointerId);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      // Drop keeps the node where it was left. The offset persists across
      // re-layouts of the same selection, so the arrangement is yours to keep.
      if (moved) {
        const n = nudgesRef.current.get(id);
        if (n) setPins(prev => new Map(prev).set(id, n));
      }
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- zp is a stable ref holder
  }, [nudges]);
  const roles = useMemo(
    () => new Map(vm.nodes.map(n => [n.id, n.role])),
    [vm],
  );
  const edgeById = useMemo(
    () => new Map(vm.edges.map(e => [e.id, e])),
    [vm],
  );

  /**
   * One arrowhead per convergence: the shared arrival point per (node, side).
   *
   * Edges do NOT carry markers of their own — N stacked markers were the blobby
   * wedge this replaces. Instead every edge in a group terminates at the CENTRE
   * OF THE BASE of a single arrowhead, which is drawn once per group (see
   * `arrowPath`). So the point recorded here is the base centre, which sits
   * ARROW_LEN further out from the border than the tip: tip at ARROW_GAP off
   * the border, base a whole arrow-length beyond that.
   *
   * `dir` is the unit vector the arrow points along (tipward). In LR that is
   * ±x with a vertical base; in TB it is ±y with a horizontal base, which is
   * what swaps the arrow's span/length axes.
   *
   * Keyed the same way buildSpec keys its fan, so a group merges iff ELK fanned
   * it. Only ENTITY-end arrivals merge — the attribute end is anchored at its
   * slot's own row and must stay there.
   */
  const mergeTargets = useMemo(() => {
    const byKey = new Map<string, MergeTarget>();
    if (!layout) return byKey;
    for (const e of vm.edges) {
      const entityId = hostOf(e) === e.source ? e.target : e.source;
      const node = placed.get(entityId);
      if (!node) continue;
      const entityIsSource = entityId === e.source;
      const key = `${entityId}|${entityIsSource ? 'out' : 'in'}`;
      if (byKey.has(key)) continue;
      // Which BORDER the head sits on, and which way it POINTS, are separate
      // questions — conflating them drew every merged head backwards.
      //
      // Side: an edge drawn out of the entity leaves by the far border (east in
      // LR, south in TB); one drawn into it arrives at the near border.
      //
      // Direction: ALWAYS into the node. This head terminates edges landing on
      // the class, so it points at the class whichever end the edge was drawn
      // from — inward from the border it sits on, i.e. the opposite of the
      // outward offset. Hence `dir` is the negation of the side sign.
      const farSide = entityIsSource;
      const back = ARROW_GAP + ARROW_LEN;
      byKey.set(key, direction === 'RIGHT'
        ? {
            // base sits `back` OUTSIDE the border; the tip is ARROW_LEN inward
            // from there, landing ARROW_GAP off the border.
            base: {
              x: farSide ? node.x + NODE_W + back : node.x - back,
              y: node.y + HEADER_H / 2,
            },
            dir: { x: farSide ? -1 : 1, y: 0 },
          }
        : {
            base: {
              x: node.x + NODE_W / 2,
              y: farSide ? node.y + node.height + back : node.y - back,
            },
            dir: { x: 0, y: farSide ? -1 : 1 },
          });
    }
    return byKey;
  }, [vm, placed, layout, direction]);

  /**
   * Synthesised routes for edges touching a nudged node, id → points.
   *
   * ELK's bendpoints describe where the boxes WERE, so a dragged box leaves
   * its edges stranded. ELK cannot be re-run per frame — it is a batch
   * layouter, and it would re-place every other node, destroying the
   * comparison. React Flow's dagre/elk examples hit the same wall and answer
   * it the same way: the engine places nodes once, and edge paths are
   * recomputed from current positions on every render (their edges are
   * `SmoothStep`, which is what `smoothStepPath` reproduces).
   *
   * Only edges with a nudged endpoint are rerouted; everything else keeps
   * ELK's real routing, so the canvas stays mostly authentic.
   */
  const dragRoutes = useMemo(() => {
    const byEdge = new Map<string, Point[]>();
    const dbg = new URLSearchParams(window.location.search).has('dbg');
    const moved = new Set([...pins.keys(), ...nudges.keys()]);
    if (!layout || moved.size === 0) return byEdge;
    if (dbg) console.log(`[drag] moved: ${[...moved].join(', ')}`);
    const nodeVm = new Map(vm.nodes.map(n => [n.id, n]));
    for (const e of vm.edges) {
      const hostId = hostOf(e);
      const entityId = hostId === e.source ? e.target : e.source;
      if (!moved.has(hostId) && !moved.has(entityId)) continue;
      const host = placed.get(hostId);
      const entity = placed.get(entityId);
      const hostVm = nodeVm.get(hostId);
      if (!host || !entity || !hostVm) continue;
      const flipped = e.storageDirection === 'flipped';
      const lr = direction === 'RIGHT';
      // Attribute end: the slot's own row. Entity end: the header.
      let y: number;
      try {
        y = rowY(hostVm, e.slotName);
      } catch {
        // Row not currently displayed (collapsed node): there is no anchor to
        // route from, so the edge keeps ELK's stale route. Logged because a
        // silent skip here looks identical to "reroute is broken".
        if (dbg) console.log(`   SKIP ${hostId}.${e.slotName}: row not displayed`);
        continue;
      }
      const attrAt = lr
        ? { x: host.x + (flipped ? 0 : NODE_W), y: host.y + y }
        : { x: host.x + NODE_W / 2, y: host.y + y };
      const attrDir = lr
        ? { x: flipped ? -1 : 1, y: 0 }
        : { x: 0, y: 1 };
      // The entity end meets the near border at header height.
      const entityIsSource = entityId === e.source;
      const entAt = lr
        ? {
            x: entityIsSource ? entity.x + NODE_W : entity.x,
            y: entity.y + HEADER_H / 2,
          }
        : {
            x: entity.x + NODE_W / 2,
            y: entityIsSource ? entity.y + entity.height : entity.y,
          };
      const entDir = lr
        ? { x: entityIsSource ? 1 : -1, y: 0 }
        : { x: 0, y: entityIsSource ? 1 : -1 };
      byEdge.set(e.id, smoothStepPath(attrAt, entAt, attrDir, entDir));
      if (dbg) console.log(`   reroute ${hostId}.${e.slotName} -> ${entityId}`);
    }
    if (dbg) console.log(`[drag] rerouted ${byEdge.size} edge(s)`);
    return byEdge;
  }, [layout, nudges, pins, vm, placed, direction]);

  /**
   * TEMPORARY probe (2026-08-20): dump what ELK actually routed for each
   * convergence, so the "why is one approach a bare diagonal" question can be
   * answered from real bend points instead of inferred. Enable with ?dbg=1.
   * Remove once the diagonal is understood.
   */
  useEffect(() => {
    if (!layout || !new URLSearchParams(window.location.search).has('dbg')) return;
    const groups = new Map<string, string[]>();
    for (const e of layout.edges) {
      const spec = edgeById.get(e.id);
      if (!spec) continue;
      const pts = sectionPoints(e.sections);
      if (pts.length < 2) continue;
      const entityId = hostOf(spec) === spec.source ? spec.target : spec.source;
      // Count real direction changes, and flag a segment that is neither
      // horizontal nor vertical — a bare diagonal ELK chose not to step.
      let bends = 0;
      let diagonals = 0;
      for (let i = 1; i < pts.length; i++) {
        const dx = Math.abs(pts[i].x - pts[i - 1].x);
        const dy = Math.abs(pts[i].y - pts[i - 1].y);
        if (dx > 0.5 && dy > 0.5) diagonals++;
        if (i > 1) bends++;
      }
      const from = hostOf(spec);
      groups.set(entityId, [
        ...(groups.get(entityId) ?? []),
        `${from}.${spec.slotName}  pts=${pts.length} bends=${bends}`
        + `${diagonals ? ` DIAGONAL x${diagonals}` : ''}`
        + `  start=(${Math.round(pts[0].x)},${Math.round(pts[0].y)})`
        + ` end=(${Math.round(pts[pts.length - 1].x)},${Math.round(pts[pts.length - 1].y)})`,
      ]);
    }
    for (const [entity, lines] of groups) {
      if (lines.length < 2) continue;
      console.log(`\n=== approaches to ${entity} (${lines.length}) ===`);
      const node = placed.get(entity);
      if (node) console.log(`   box at (${Math.round(node.x)},${Math.round(node.y)}) h=${Math.round(node.height)}`);
      lines.forEach(l => console.log('   ' + l));
    }
  }, [layout, edgeById, placed]);

  /**
   * The arrowheads actually drawn: one per convergence group that has at least
   * one merging edge. A group whose edges all fall back to their own markers
   * (merge off, or flipped edges that keep their attribute-row anchor) must NOT
   * get a head here, or it would float unattached beside the node.
   *
   * Channel and dimming come from the group's edges: mixed groups render amber
   * if any ownership edge arrives, since ownership is the stronger signal.
   */
  const arrowheads = useMemo(() => {
    const heads = new Map<
      string,
      MergeTarget & { isOwn: boolean; dimmed: boolean; edgeIds: string[] }
    >();
    if (!layout) return heads;
    for (const e of layout.edges) {
      const spec = edgeById.get(e.id);
      if (!spec || spec.storageDirection === 'flipped') continue;
      if (mergeDistFor(mergeMode, sectionPoints(e.sections)) <= 0) continue;
      const entityId = hostOf(spec) === spec.source ? spec.target : spec.source;
      const key = `${entityId}|${entityId === spec.source ? 'out' : 'in'}`;
      const t = mergeTargets.get(key);
      if (!t) continue;
      const isOwn = spec.type === 'ownership';
      const dimmed =
        roles.get(spec.source) === 'context' || roles.get(spec.target) === 'context';
      const prev = heads.get(key);
      heads.set(key, prev
        ? {
            ...prev,
            isOwn: prev.isOwn || isOwn,
            dimmed: prev.dimmed && dimmed,
            edgeIds: [...prev.edgeIds, e.id],
          }
        : { ...t, isOwn, dimmed, edgeIds: [e.id] });
    }
    return heads;
  }, [layout, edgeById, mergeTargets, mergeMode, roles]);

  /**
   * A row is an expand-on-demand affordance when it points at an entity that
   * isn't on the canvas yet. Plain (scalar/enum) rows have no node to add, and
   * self-loops point back at their own node, so neither is expandable.
   */
  const onCanvas = useMemo(() => new Set(vm.nodes.map(n => n.id)), [vm]);
  const isExpandable = useCallback(
    (r: RowVM) =>
      !!onExpand && r.channel !== 'plain' && !r.isLoop && !onCanvas.has(r.range),
    [onExpand, onCanvas],
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
          // Thicken relative to this edge's own channel, so a hovered dashed
          // reference doesn't jump to ownership weight.
          p.style.strokeWidth = String(
            p.dataset.channel === 'reference' ? STROKE_REF_HOVER : STROKE_OWN_HOVER,
          );
        } else {
          p.style.opacity = '0.38'; // [sg] changed this...needs to live in config
          p.style.strokeWidth = '';
        }
      });
      // A convergence arrowhead belongs to a GROUP of edges, so it stays lit
      // while any one of them is highlighted and dims only when none is —
      // otherwise hovering one edge of a merge left its head greyed out.
      svg.querySelectorAll<SVGPathElement>('path[data-arrowhead]').forEach(p => {
        const ids = (p.dataset.arrowhead ?? '').split(' ');
        if (!edgeSet) p.style.opacity = '';
        else p.style.opacity = ids.some(id => edgeSet.has(id)) ? '1' : '0.08';
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
  const setMerge = (m: MergeMode) => {
    localStorage.setItem('explore-nl-merge', m);
    setMergeMode(m);
  };

  const attributesWord = dataService.getConceptLabel('attribute', true).toLowerCase();

  const toolBtn = (active: boolean) =>
    `px-2 py-0.5 text-xs rounded border ${active
      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
      : 'border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700'}`;

  return (
    <div className="relative w-full h-full">
      {/* Toolbar */}
      <div data-pan-ignore className="absolute top-2 right-2 z-10 flex gap-1 items-center">
        {onTogglePathToRoot && (
          <>
            <button
              className={toolBtn(pathToRoot)}
              title={pathToRoot
                ? 'Hide owners: show only what you selected'
                : 'Show every owner up to the root (can pull in most of the schema)'}
              onClick={onTogglePathToRoot}
            >
              ⇱ roots
            </button>
            <span className="w-px h-4 bg-gray-300 dark:bg-slate-600 mx-1" />
          </>
        )}
        <button className={toolBtn(direction === 'RIGHT')} title="Layout left to right"
          onClick={() => setDir('RIGHT')}>LR</button>
        <button className={toolBtn(direction === 'DOWN')} title="Layout top down"
          onClick={() => setDir('DOWN')}>TB</button>
        <span className="w-px h-4 bg-gray-300 dark:bg-slate-600 mx-1" />
        {/* Merge-point comparison — temporary, for picking one by eye. */}
        <button className={toolBtn(mergeMode === 'near')}
          title="Merge converging edges near the node (~40px)"
          onClick={() => setMerge('near')}>⋙</button>
        <button className={toolBtn(mergeMode === 'far')}
          title="Merge converging edges early (~120px)"
          onClick={() => setMerge('far')}>⋙⋙</button>
        <button className={toolBtn(mergeMode === 'bend')}
          title="Merge at ELK's last corner"
          onClick={() => setMerge('bend')}>⌙</button>
        <button className={toolBtn(mergeMode === 'off')}
          title="No merging — every edge runs to its own port"
          onClick={() => setMerge('off')}>≡</button>
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

      <div ref={zp.containerRef} className="w-full h-full overflow-auto cursor-grab">
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
                  {/*
                    Markers here are ONLY for edges that do not converge: an
                    edge arriving at a merge group carries no marker at all and
                    stops at the shared arrowhead's base, which is drawn once per
                    group below. Stacking a marker on every edge of a group was
                    the blobby wedge this replaces — ~6 identical heads piled up.

                    markerUnits="userSpaceOnUse": without it markers scale by
                    strokeWidth, so a 9-unit marker on a 1.8px ownership stroke
                    rendered ~16px wide. refX=0 keeps the TIP at the path's end.
                  */}
                  <defs>
                    {/* An edge that does NOT converge (merge off, or the only
                        edge of its group) still needs a head of its own. */}
                    <marker id={markerId('arrow-own')} viewBox="0 0 10 7" refX="0" refY="3.5"
                      markerWidth={ARROW_SPAN} markerHeight={ARROW_SPAN * 0.75}
                      markerUnits="userSpaceOnUse" orient="auto-start-reverse">
                      <path d="M0,0L10,3.5L0,7Z" fill="#d97706" />
                    </marker>
                    {/* flipped storage: the head sits at the ATTRIBUTE end (its
                        own row, never merged) and points BACK toward the owner,
                        because the member stores the FK. */}
                    <marker id={markerId('arrow-own-back')} viewBox="0 0 10 7" refX="10" refY="3.5"
                      markerWidth={ARROW_SPAN} markerHeight={ARROW_SPAN * 0.75}
                      markerUnits="userSpaceOnUse" orient="auto-start-reverse">
                      <path d="M10,0L0,3.5L10,7Z" fill="#d97706" />
                    </marker>
                    {/* association: no ownership claim, so BOTH ends are
                        arrowed, each head pointing INTO the entity it sits next
                        to. Slate rather than the old #9ca3af, which was too
                        faint to see against the background.

                        ONE marker serves both ends: that is what
                        orient="auto-start-reverse" is for. On markerEnd its +x
                        axis runs forward along the path; on markerStart the
                        "-start-reverse" half turns it 180deg so +x runs
                        backward, out of the source node. A forward-pointing
                        glyph (tip at x=10) therefore points outward at BOTH
                        ends, and refX=0 keeps the base on the path vertex with
                        the tip overshooting into the node, exactly as for
                        arrow-own.

                        The previous arrow-assoc-start reversed twice - the
                        marker by auto-start-reverse AND the glyph by drawing
                        the tip at x=0 - so the two cancelled and the start head
                        pointed back down the edge instead of into its node. */}
                    <marker id={markerId('arrow-assoc')} viewBox="0 0 10 7" refX="0" refY="3.5"
                      markerWidth={ARROW_SPAN * REF_SCALE} markerHeight={ARROW_SPAN * 0.75 * REF_SCALE}
                      markerUnits="userSpaceOnUse" orient="auto-start-reverse">
                      <path d="M0,0L10,3.5L0,7Z" fill="#64748b" />
                    </marker>
                  </defs>
                  <g transform={`translate(${PAD}, ${PAD})`}>
                    {/* The one arrowhead per convergence. Drawn before the edges
                        so a stroke that overshoots its base by a fraction of a
                        px is covered by the head rather than crossing it. */}
                    {[...arrowheads].map(([key, a]) => (
                      <path
                        key={`head-${key}`}
                        data-arrowhead={a.edgeIds.join(' ')}
                        d={arrowPath(a.base, a.dir, ARROW_SPAN, ARROW_LEN)}
                        fill={a.isOwn ? '#d97706' : '#64748b'}
                        opacity={a.dimmed ? 0.4 : 1}
                        style={{ transition: 'opacity 120ms' }}
                      />
                    ))}
                    {layout.edges.map(e => {
                      const spec = edgeById.get(e.id);
                      if (!spec) throw new Error(`Routed edge ${e.id} missing from view model`);
                      const flipped = spec.storageDirection === 'flipped';
                      // Merge the entity-end tail into the group's shared
                      // arrival point (see mergeTargets). Flipped edges end at
                      // an attribute row, which must keep its own anchor.
                      const entityId = hostOf(spec) === spec.source ? spec.target : spec.source;
                      const target = flipped
                        ? undefined
                        : mergeTargets.get(`${entityId}|${entityId === spec.source ? 'out' : 'in'}`);
                      // A merging edge stops at the shared arrowhead's BASE and
                      // draws no head of its own, so its own tail needs no trim
                      // — mergeTail replaces it wholesale. A non-merging edge
                      // still carries a marker, so trim back far enough for the
                      // head to sit on the canvas rather than in the border.
                      // A dragged node's edges use the synthesised route; the
                      // rest keep ELK's real bendpoints.
                      const dragged = dragRoutes.get(e.id);
                      const willMerge = !!target
                        && mergeDistFor(mergeMode, dragged ?? sectionPoints(e.sections)) > 0;
                      const isAssoc = spec.type !== 'ownership';
                      const trimmedEnd = willMerge
                        ? e.sections
                        : trimSectionsEnd(
                            e.sections, ARROW_SPAN + ARROW_GAP + (flipped ? 2 : 0),
                          );
                      // Associations are arrowed at BOTH ends, so both ends
                      // need clearance from the opaque node box.
                      const sections = isAssoc
                        ? trimSectionsStart(trimmedEnd, ARROW_LEN + ARROW_GAP)
                        : trimmedEnd;
                      const pts = dragged ?? sectionPoints(sections);
                      const render = (p: Point[]) => roundedPath(p, CORNER_R);
                      const dist = mergeDistFor(mergeMode, pts);
                      const d = target && dist > 0
                        ? mergeTail(pts, target.base, dist, render)
                        : render(pts);
                      if (!d) return null;
                      const isOwn = spec.type === 'ownership';
                      const dimmed =
                        roles.get(e.source) === 'context' || roles.get(e.target) === 'context';
                      // No marker on a merged edge: the group's one arrowhead is
                      // drawn separately. Flipped edges head back at their own
                      // attribute row; references keep their smaller head.
                      const marker = willMerge
                        ? undefined
                        : isOwn ? (flipped ? 'arrow-own-back' : 'arrow-own') : 'arrow-assoc';
                      return (
                        <g key={e.id}>
                          <path
                            data-edge-id={e.id}
                            data-channel={isOwn ? 'ownership' : 'reference'}
                            d={d}
                            fill="none"
                            opacity={dimmed ? 0.4 : 1}
                            stroke={isOwn ? '#d97706' : '#64748b'}
                            strokeWidth={isOwn ? STROKE_OWN : STROKE_REF}
                            strokeDasharray={isOwn ? undefined : '5 4'}
                            markerEnd={marker ? `url(#${markerId(marker)})` : undefined}
                            markerStart={!isOwn && !willMerge ? `url(#${markerId('arrow-assoc')})` : undefined}
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
                      data-pan-ignore
                      data-pinned={pins.has(n.id) ? '' : undefined}
                      onPointerDown={ev => startDrag(n.id, ev)}
                      onDoubleClick={ev => {
                        // Double-click releases a pin, so a drag is undoable
                        // without clearing the whole selection.
                        if (!pins.has(n.id)) return;
                        ev.stopPropagation();
                        setPins(prev => {
                          const next = new Map(prev);
                          next.delete(n.id);
                          return next;
                        });
                      }}
                      onClick={() => {
                        if (draggedRef.current) { draggedRef.current = false; return; }
                        onNodeClick?.(n.id);
                      }}
                      onMouseEnter={() => applyHover({ kind: 'node', id: n.id })}
                      onMouseLeave={() => applyHover(null)}
                      className={`absolute rounded-md text-xs bg-white dark:bg-slate-800 ${
                        nudges.has(n.id) ? '' : '[transition:transform_300ms,opacity_120ms]'
                      } cursor-pointer ${context
                        ? 'opacity-60 border border-dashed border-gray-400 dark:border-slate-500'
                        : pins.has(n.id)
                          ? 'border-2 border-amber-500 dark:border-amber-400 shadow-md'
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
                          {/* Dismiss — only on nodes the user pulled in, not on
                              path-to-root context, which the selection implies. */}
                          {expandedIds?.has(n.id) && (
                            <button
                              data-dismiss={n.id}
                              title={`Remove ${n.label} from the canvas`}
                              onClick={ev => { ev.stopPropagation(); onCollapse?.(n.id); }}
                              className="text-[10px] leading-none px-1 rounded text-gray-400
                                         hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/40"
                            >
                              ✕
                            </button>
                          )}
                        </span>
                      </div>
                      {/* Owners left off the canvas. Clicking one pulls it in,
                          the same affordance a dimmed attribute row offers. */}
                      {n.hiddenOwners.length > 0 && (
                        <div
                          className="flex flex-wrap items-center gap-x-1 gap-y-0.5 px-2 py-1 border-b
                                     border-gray-200 dark:border-slate-600
                                     bg-amber-50/60 dark:bg-amber-950/30"
                          style={{ height: ownersStripHFor(n.hiddenOwners) }}
                        >
                          <span className="text-[9px] text-gray-500 dark:text-gray-400 shrink-0">
                            owned by
                          </span>
                          {/* Every owner is listed and clickable — a silently
                              truncated "+3" hid names with no way to reach them. */}
                          {n.hiddenOwners.map(owner => (
                            <button
                              key={owner}
                              data-owner-chip={owner}
                              title={`${owner} owns ${n.label} — click to add it`}
                              onClick={ev => { ev.stopPropagation(); onExpand?.(owner); }}
                              className="text-[9px] leading-none px-1 py-0.5 rounded max-w-full truncate
                                         bg-amber-100 dark:bg-amber-900/60
                                         text-amber-900 dark:text-amber-200
                                         hover:bg-amber-200 dark:hover:bg-amber-800"
                            >
                              {owner}
                            </button>
                          ))}
                          <button
                            title={`Add all ${n.hiddenOwners.length} owners of ${n.label}`}
                            onClick={ev => {
                              ev.stopPropagation();
                              n.hiddenOwners.forEach(o => onExpand?.(o));
                            }}
                            className="text-[9px] leading-none px-1 py-0.5 rounded shrink-0
                                       text-amber-800 dark:text-amber-300 underline
                                       hover:bg-amber-200 dark:hover:bg-amber-800"
                          >
                            add all
                          </button>
                        </div>
                      )}
                      {n.rows.map(r => (
                        <div
                          key={r.slot}
                          data-row={r.slot}
                          data-expandable={isExpandable(r) ? '' : undefined}
                          data-no-drag={isExpandable(r) ? '' : undefined}
                          title={r.channel === 'plain'
                            ? `${r.slot}: ${r.range}`
                            : `${r.slot} → ${r.range} (${r.cardinality})${r.flipped ? ' — owner side' : ''}` +
                              (isExpandable(r) ? ` — click to add ${r.range}` : '')}
                          onClick={isExpandable(r)
                            ? ev => { ev.stopPropagation(); onExpand?.(r.range); }
                            : undefined}
                          className={`flex items-center gap-1.5 px-2 text-[11px] ${r.connected
                            ? 'text-gray-700 dark:text-gray-300'
                            : 'text-gray-400 dark:text-gray-500'} ${isExpandable(r)
                              ? 'cursor-pointer hover:bg-sky-50 dark:hover:bg-sky-900/30 hover:text-sky-700 dark:hover:text-sky-300'
                              : ''}`}
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
