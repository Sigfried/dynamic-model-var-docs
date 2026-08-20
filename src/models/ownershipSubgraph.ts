/**
 * Ownership subgraph for the Explore viz (docs/EXPLORE_VIZ.md, data layer).
 *
 * Takes the full classified ownership graph (models/containmentGraph) and a
 * selection, and returns the drawable subgraph per the content policy:
 * selected entities, edges among them, explicit expansions, and each node's
 * DIRECT owners (one hop, up to `ownerCap`) as dimmed 'context' nodes. Owners
 * past the cap are returned in `hiddenOwners` for chip rendering instead.
 * With `pathToRoot` on, the one-hop walk is replaced by the full transitive
 * ancestors-to-root.
 *
 * pathToRoot defaults OFF. Ancestors fan OUT rather than up a spine: a value
 * object is owned by everything that stores one, and each of those owners
 * drags in its own path to root, so the walk is a reverse-reachability
 * closure. Measured against the live schema: selecting BodySite pulled 15
 * context nodes / 32 edges, and Quantity pulled 29 of the schema's 53 classes
 * with 87 edges — from a single checkbox. That also swamped expand-on-demand,
 * which assumes a small canvas you grow deliberately.
 *
 * Backbone: supergroup/dag — `fromEdges` builds the ownership DAG (cycle
 * edges demoted to backedges), `parents` gives the default one-hop owners
 * while `ancestors()` yields the opt-in paths-to-root, and
 * per-node `maxDepth` over the FULL DAG is the layer assignment, so a node
 * keeps its layer as the selection changes.
 *
 * Model-layer module: components reach it only through
 * DataService.getOwnershipSubgraph().
 */

import { fromEdges } from 'supergroup/dag';
import type { Supergroup } from 'supergroup';
import type { ContainmentGraph } from './containmentGraph';

export type OwnershipNodeRole = 'selected' | 'context';
export type OwnershipEdgeType = 'ownership' | 'reference' | 'isa';

/** One entity-ranged slot stored on a class (its attribute row in the viz). */
export interface OwnershipNodeSlot {
  slot: string;
  /** The class this slot points at (the storage-direction range). */
  range: string;
  channel: 'ownership' | 'reference';
  /** Flipped ownership: this class is the member; range is its owner. */
  flipped: boolean;
  cardinality: string;
  isLoop: boolean;
}

export interface OwnershipSubgraphNode {
  id: string;
  label: string;
  role: OwnershipNodeRole;
  /** Sunk layer in the full ownership DAG (see computeSunkLayers) — stable
   *  across selection changes. */
  layer: number;
  abstract: boolean;
  description: string;
  /**
   * ALL entity-ranged slots stored on this class (schema order, selection-
   * independent), whether or not their range is currently visible. Rows whose
   * range is off-canvas are the expand-on-demand affordances.
   */
  slots: OwnershipNodeSlot[];
}

export interface OwnershipSubgraphEdge {
  id: string;
  /** Drawn direction: owner → member for ownership; FK direction for refs. */
  source: string;
  target: string;
  type: OwnershipEdgeType;
  /** '' for isa edges. */
  slotName: string;
  /** 'flipped' ownership edges need a re-verbed label, never the bare slot name. */
  storageDirection: 'forward' | 'flipped';
  cardinality: string;
  isLoop: boolean;
}

export interface OwnershipSubgraph {
  nodes: OwnershipSubgraphNode[];
  edges: OwnershipSubgraphEdge[];
  /**
   * Owners of selected/expanded classes that are NOT on the canvas — the
   * "what uses this?" answer that path-to-root used to give by drawing the
   * whole upstream graph. Rendered as chips on the node; empty when
   * pathToRoot is on (those owners are drawn as real nodes instead).
   */
  hiddenOwners: Map<string, string[]>;
}

/**
 * Owners drawn per node before falling back to chips. Lowered 8 → 5
 * (2026-08-19, Siggie): 8 was picked without discussion, and a node with 6-8
 * drawn owners crowds the canvas enough that the converging edges are hard to
 * follow even with fanned ports.
 */
export const DEFAULT_OWNER_CAP = 5;

export interface OwnershipSubgraphOptions {
  /** Walk each selected node's ownership ancestors in as dimmed context. */
  pathToRoot?: boolean;
  /**
   * Draw each core node's DIRECT owners (one hop, not transitive) as context.
   * A value object's owners are the interesting thing about it — BodySite's
   * six owners are the answer to "what is BodySite", not a footnote to expand
   * one chip at a time. Above the cap the owners stay chips, since drawing
   * ~20 of them (Quantity) is the blowup this replaced.
   */
  ownerCap?: number;
}

export type OwnershipDag = Supergroup<unknown>;

/**
 * Per-class stored-slot lists derived from the full edge set: an edge's slot
 * lives on its storage-side class (the source, or the target when flipped),
 * and points at the other end.
 */
export function collectNodeSlots(full: ContainmentGraph): Map<string, OwnershipNodeSlot[]> {
  const byNode = new Map<string, OwnershipNodeSlot[]>();
  for (const e of full.edges) {
    if (e.kind === 'subclass') continue;
    const host = e.flipped ? e.target : e.source;
    const range = e.flipped ? e.source : e.target;
    const slots = byNode.get(host) ?? [];
    if (!slots.some(s => s.slot === e.label)) {
      slots.push({
        slot: e.label,
        range,
        channel: e.kind === 'ref' ? 'reference' : 'ownership',
        flipped: e.flipped,
        cardinality: e.cardinality,
        isLoop: e.isLoop,
      });
      byNode.set(host, slots);
    }
  }
  return byNode;
}

/**
 * Build the ownership DAG over the full graph's has-a edges. Self-loops are
 * skipped (they render as loop badges, not layer violations); parallel
 * ownership edges between the same pair collapse to one DAG edge (the drawn
 * edge set keeps them all). Nodes with no ownership edges become isolated
 * DAG roots, so a deliberately-selected isolated class still resolves.
 */
export function buildOwnershipDag(full: ContainmentGraph): OwnershipDag {
  const seen = new Set<string>();
  const edges: [string, string][] = [];
  for (const e of full.edges) {
    if (e.kind !== 'has-a' || e.isLoop) continue;
    const key = `${e.source}\0${e.target}`;
    if (seen.has(key)) continue;
    seen.add(key);
    edges.push([e.source, e.target]);
  }
  return fromEdges(edges, full.nodes.map(n => ({ id: n.id, name: n.label })));
}

/**
 * Layer assignment: "sunk" layers. The DAG's internal structure (nodes that
 * own something) defines the layering: every owner sinks to exactly one
 * layer above its topmost owning child, so Organization/Person don't strand
 * at the root layer just because they're roots. Leaf classes (own nothing —
 * mostly value objects) don't anchor their owners; they dangle one layer
 * below their deepest owner. Preserves layer(owner) < layer(member)
 * everywhere and is selection-independent.
 */
export function computeSunkLayers(dag: OwnershipDag): Map<string, number> {
  const layers = new Map<string, number>();
  // Children always have greater maxDepth than their parents, so descending
  // maxDepth order processes every owning child before its parents.
  const internal = dag.nodes
    .filter(n => n.children.length > 0)
    .sort((a, b) => (b.maxDepth ?? 0) - (a.maxDepth ?? 0));
  for (const n of internal) {
    const owningChildren = n.children.filter(c => c.children.length > 0);
    layers.set(n.id, owningChildren.length
      ? Math.min(...owningChildren.map(c => layers.get(c.id)!)) - 1
      : n.maxDepth ?? 0);
  }
  for (const n of dag.nodes) {
    if (n.children.length > 0) continue;
    layers.set(n.id, n.parents.length
      ? Math.max(...n.parents.map(p => layers.get(p.id)!)) + 1
      : n.maxDepth ?? 0);
  }
  return layers;
}

/**
 * Extract the drawable subgraph for a selection.
 *
 * Edge policy: ownership edges are emitted whenever both endpoints are
 * visible (they form the paths-to-root); reference and isa edges when both
 * endpoints are visible AND at least one was explicitly asked for (selected
 * or expanded) — pure path-context nodes contribute their ownership
 * structure and their direct relationships to the nodes you asked about,
 * but not the web among themselves.
 *
 * @param full        the full (unpruned) classified graph the DAG was built from
 * @param dag         buildOwnershipDag(full)
 * @param selectedIds classes the user selected
 * @param expansions  extra classes pulled in by expand-on-demand (role 'context')
 */
export function buildOwnershipSubgraph(
  full: ContainmentGraph,
  dag: OwnershipDag,
  selectedIds: string[],
  expansions: string[] = [],
  options: OwnershipSubgraphOptions = {},
): OwnershipSubgraph {
  const { pathToRoot = false, ownerCap = DEFAULT_OWNER_CAP } = options;
  const byId = new Map(dag.nodes.map(n => [n.id, n]));
  const resolve = (id: string) => {
    const n = byId.get(id);
    if (!n) throw new Error(`Class not in ownership graph: ${id}`);
    return n;
  };

  const selected = new Set(selectedIds);
  const core = new Set([...selectedIds, ...expansions]);
  const visible = new Set(core);
  for (const id of core) resolve(id); // fail loudly on unknown expansions too
  if (pathToRoot) {
    for (const id of selected) {
      for (const a of resolve(id).ancestors()) visible.add(a.id);
    }
  } else {
    // One hop up, per node, only when the count stays legible. Not transitive:
    // the owners' own owners stay off, which is what keeps this from becoming
    // the reverse-reachability closure pathToRoot was turned off for.
    for (const id of core) {
      const owners = resolve(id).parents;
      if (owners.length && owners.length <= ownerCap) {
        for (const o of owners) visible.add(o.id);
      }
    }
  }

  // Direct owners left off the canvas become chips rather than nodes. Only
  // one hop up: the chip answers "what uses this?", and walking further is
  // what produced the closure pathToRoot was turned off for.
  const hiddenOwners = new Map<string, string[]>();
  for (const id of core) {
    const owners = resolve(id).parents
      .map(p => p.id)
      .filter(pid => !visible.has(pid))
      .sort();
    if (owners.length) hiddenOwners.set(id, owners);
  }

  const edges = full.edges
    .filter(e => {
      if (!visible.has(e.source) || !visible.has(e.target)) return false;
      return e.kind === 'has-a' || core.has(e.source) || core.has(e.target);
    })
    .map(e => ({
      id: e.id,
      source: e.source,
      target: e.target,
      type: (e.kind === 'has-a' ? 'ownership'
        : e.kind === 'ref' ? 'reference' : 'isa') as OwnershipEdgeType,
      slotName: e.kind === 'subclass' ? '' : e.label,
      storageDirection: (e.flipped ? 'flipped' : 'forward') as 'forward' | 'flipped',
      cardinality: e.cardinality,
      isLoop: e.isLoop,
    }));

  const meta = new Map(full.nodes.map(n => [n.id, n]));
  const slotsByNode = collectNodeSlots(full);
  const sunkLayers = computeSunkLayers(dag);
  const nodes = [...visible]
    .map((id): OwnershipSubgraphNode => {
      const m = meta.get(id);
      if (!m) throw new Error(`Class in DAG but not in graph nodes: ${id}`);
      const layer = sunkLayers.get(id);
      if (layer === undefined) throw new Error(`No layer for ${id}`);
      return {
        id,
        label: m.label,
        role: selected.has(id) ? 'selected' : 'context',
        layer,
        abstract: m.abstract,
        description: m.description,
        slots: slotsByNode.get(id) ?? [],
      };
    })
    .sort((a, b) => a.layer - b.layer || a.id.localeCompare(b.id));

  return { nodes, edges, hiddenOwners };
}
