/**
 * Ownership subgraph for the Explore viz (docs/EXPLORE_VIZ.md, data layer).
 *
 * Takes the full classified ownership graph (models/containmentGraph) and a
 * selection, and returns the drawable subgraph per the content policy:
 * **nothing is drawn that was not selected.** Selected entities and the edges
 * among them, and that is all. What a node relates to but does not draw is
 * reported in `hiddenOwners` / `hiddenOwned` so the UI can offer it.
 *
 * **The automatic owner draw is gone (2026-08-27, Siggie).** Every selected
 * node used to pull in up to `DEFAULT_OWNER_CAP = 5` of its direct owners
 * unasked, so `sel=MeasurementObservation` drew SIX boxes and
 * `sel=BodySite~Participant` drew TEN. Ticking one checkbox has to draw one
 * box. The `ownerCap` option (`0 / ≤5 / all` in the toolbar) and the
 * `suppressedOwners` dismissal set both existed only to bound that automatic
 * draw, so removing it takes them with it: with nothing drawn unasked, there
 * is nothing to cap and nothing to dismiss that is not simply deselected.
 *
 * This also retires `expansions` as a separate input. Expanding IS selecting
 * now, so a class is on the canvas for exactly one reason and the
 * selected/expanded distinction — long complained about, deferred twice as too
 * risky — stops existing rather than needing to be tracked.
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

/**
 * Where another class sits relative to THIS one, from this class's point of
 * view. Four ownership positions plus association (docs/TASKS.md, "Chip strips
 * → relation counts + menu"):
 *
 * |              | declared on me   | declared on them  |
 * |--------------|------------------|-------------------|
 * | I own it     | `owns-mine`      | `owns-theirs`     |
 * | it owns me   | `owned-mine`     | `owned-theirs`    |
 *
 * The DAG erases this: `containmentGraph` flips `own-bkwd` at build time, so
 * `parents`/`children` carry direction only and "mine because I say so" is
 * indistinguishable from "mine because it says so" — the exact distinction
 * Siggie asked the menu to show. It is recovered here from the FULL edge list,
 * which still carries `flipped` and `verdict`, rather than by threading the
 * verdict through the DAG.
 */
export type RelationPosition =
  | 'owns-mine'      // I own it, by my own attribute (own-fwd declared here)
  | 'owns-theirs'    // I own it, by an attribute on IT (own-bkwd, flipped here)
  | 'owned-mine'     // I belong to it, by my own attribute (own-bkwd declared here)
  | 'owned-theirs'   // I belong to it, by an attribute on IT (own-fwd on them)
  | 'association';   // named association, neither owns the other

/**
 * Siggie's labels, which describe the READER's situation rather than the
 * classifier (cf. OwnershipLegend.tsx, which describes the rule that fired).
 *
 * Plural by default; `relationPositionLabel` picks the singular when a branch
 * holds exactly one entity ("1 belongs to me by my attribute"). The `I belong
 * to` pair takes its verb from "I", so it does not inflect.
 *
 * All four ownership labels name the declaring side the same way — "by my
 * attribute" / "by their attribute" — so they read as one paradigm rather than
 * two unrelated pairs (Siggie, choosing between wordings 2026-08-27).
 */
export const RELATION_POSITION_LABEL: Record<RelationPosition, string> = {
  'owns-mine': 'belong to me by my attribute',
  'owns-theirs': 'belong to me by their attribute',
  'owned-mine': 'I belong to, by my attribute',
  'owned-theirs': 'I belong to, by their attribute',
  'association': 'associated with',
};

/** The plural verb replaced when a branch holds one entity. Only the two
 *  `owns-*` labels have a subject that inflects. */
const RELATION_POSITION_LABEL_ONE: Partial<Record<RelationPosition, string>> = {
  'owns-mine': 'belongs to me by my attribute',
  'owns-theirs': 'belongs to me by their attribute',
};

/** A position's label, agreeing with `count`. */
export function relationPositionLabel(p: RelationPosition, count: number): string {
  return (count === 1 && RELATION_POSITION_LABEL_ONE[p]) || RELATION_POSITION_LABEL[p];
}

/**
 * Menu order. The two `I belong to` positions sit adjacent so they read as a
 * pair in the cascade; they are separate branches because the declaring side
 * is what you would edit to change the relationship.
 */
export const RELATION_POSITION_ORDER: readonly RelationPosition[] = [
  'owns-mine', 'owns-theirs', 'owned-mine', 'owned-theirs', 'association',
];

/** One related class, as seen from a given class. */
export interface RelationEntry {
  /** The class at the other end. */
  other: string;
  position: RelationPosition;
  /** The slot carrying the relationship, and the class that declares it. */
  slot: string;
  declaredBy: string;
  cardinality: string;
}

/**
 * Every class related to `id`, grouped by position — the data behind the
 * relation menu that replaced the wrapped chip strips. Self-loops are excluded
 * (they render as ⟲ row markers, and "related to itself" is not a menu item).
 *
 * A pair can occupy more than one position at once (two classes can each
 * declare a slot pointing at the other), so entries are per EDGE, not per
 * class; the UI dedupes within a position.
 */
export function collectRelations(full: ContainmentGraph): Map<string, RelationEntry[]> {
  const byNode = new Map<string, RelationEntry[]>();
  const add = (id: string, e: RelationEntry) => {
    const list = byNode.get(id) ?? [];
    // One entry per (other, position, slot): the same slot inherited by several
    // classes reaches the same pair more than once.
    if (!list.some(x => x.other === e.other && x.position === e.position && x.slot === e.slot)) {
      list.push(e);
      byNode.set(id, list);
    }
  };
  for (const e of full.edges) {
    if (e.kind === 'subclass' || e.isLoop) continue;
    // Edges are normalized owner → member, with `flipped` recording that the
    // slot is stored on the member (the target) rather than the source.
    const declaredBy = e.flipped ? e.target : e.source;
    const [owner, member] = [e.source, e.target];
    const common = { slot: e.label, declaredBy, cardinality: e.cardinality };
    if (e.verdict === 'association') {
      add(owner, { other: member, position: 'association', ...common });
      add(member, { other: owner, position: 'association', ...common });
      continue;
    }
    // From the OWNER's side it owns the member; from the MEMBER's side it
    // belongs to the owner. Which of the two sub-positions applies depends on
    // which end declares the slot.
    add(owner, {
      other: member,
      position: declaredBy === owner ? 'owns-mine' : 'owns-theirs',
      ...common,
    });
    add(member, {
      other: owner,
      position: declaredBy === member ? 'owned-mine' : 'owned-theirs',
      ...common,
    });
  }
  return byNode;
}

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
   * ALL entity-ranged slots stored on this class (selection-independent),
   * whether or not their range is currently visible. Rows whose range is
   * off-canvas are the expand-on-demand affordances.
   *
   * NOT in schema order — this list is built by walking the edge set, so it
   * inherits graphology's insertion order. Consumers that display it sort by
   * getClassSummary's slot list, which is authoritative (OwnershipGraphView's
   * buildViewModel).
   */
  slots: OwnershipNodeSlot[];
  /**
   * Every class related to this one, grouped-ready by position — the data
   * behind the relation menu. Selection-independent like `slots`; whether each
   * entry is currently DRAWN is a property of the canvas, so the UI reads that
   * from the node set rather than from here.
   */
  relations: RelationEntry[];
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
   * Direct owners of selected classes that are NOT on the canvas — the "what
   * uses this?" answer that path-to-root gives by drawing the whole upstream
   * graph. Since the automatic owner draw was removed this is normally EVERY
   * direct owner; it is empty only when pathToRoot is on (those owners are
   * drawn as real nodes) or when the owner happens to be selected too.
   */
  hiddenOwners: Map<string, string[]>;
  /**
   * What each selected class OWNS that is not on the canvas — the downward
   * counterpart of `hiddenOwners`.
   *
   * Not simply "rows you could expand": a class whose ownership edges are all
   * flipped has no such rows at all, and would otherwise be a dead end.
   */
  hiddenOwned: Map<string, string[]>;
}

export interface OwnershipSubgraphOptions {
  /** Walk each selected node's ownership ancestors in as dimmed context. */
  pathToRoot?: boolean;
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
        channel: e.kind === 'association' ? 'reference' : 'ownership',
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
 * @param selectedIds classes the user selected — the ONLY thing drawn, apart
 *                    from the opt-in pathToRoot ancestors
 */
export function buildOwnershipSubgraph(
  full: ContainmentGraph,
  dag: OwnershipDag,
  selectedIds: string[],
  options: OwnershipSubgraphOptions = {},
): OwnershipSubgraph {
  const { pathToRoot = false } = options;
  const byId = new Map(dag.nodes.map(n => [n.id, n]));
  const resolve = (id: string) => {
    const n = byId.get(id);
    if (!n) throw new Error(`Class not in ownership graph: ${id}`);
    return n;
  };

  const selected = new Set(selectedIds);
  const visible = new Set(selected);
  for (const id of selected) resolve(id); // fail loudly on unknown ids
  /*
   * The ONLY thing that adds a node the user did not tick is the opt-in
   * pathToRoot walk. There used to be an `else` branch here drawing each
   * selected node's direct owners up to `ownerCap`; that is the automatic
   * draw removed on 2026-08-27, and with it the whole notion of a node being
   * on the canvas for a reason other than selection.
   */
  if (pathToRoot) {
    for (const id of selected) {
      for (const a of resolve(id).ancestors()) visible.add(a.id);
    }
  }

  /**
   * Direct owners that are not drawn — one hop up only, since the chip
   * answers "what uses this?" and walking further is what produced the
   * closure pathToRoot was turned off for.
   *
   * There is no `drawnOwners` counterpart any more. It existed so an owner
   * drawn by the cap could be told apart from one that was not, and be
   * dismissed; now an owner is on the canvas only if it was selected, so the
   * relation menu reads its drawn-ness from the node set directly.
   */
  const hiddenOwners = new Map<string, string[]>();
  const hiddenOwned = new Map<string, string[]>();
  for (const id of selected) {
    const hidden = resolve(id).parents
      .map(p => p.id)
      .filter(pid => !visible.has(pid))
      .sort();
    if (hidden.length) hiddenOwners.set(id, hidden);

    /*
     * The DOWNWARD equivalent: what this class owns that is not on the canvas.
     *
     * Needed because a class whose ownership edges are all FLIPPED has no rows
     * for them — the slot is stored on the other class — so there is nothing
     * on its box to click. Organization is the case Siggie hit: it owns 14
     * things, every edge flipped (`Observation.performed_by -> Organization`),
     * so selecting it drew a lone box with no way forward, even though the
     * tree showed 14 relationships.
     *
     * Reported as ids only; the UI renders them as chips like the owners.
     */
    const owned = resolve(id).children
      .map(c => c.id)
      .filter(cid => !visible.has(cid))
      .sort();
    if (owned.length) hiddenOwned.set(id, owned);
  }

  const edges = full.edges
    .filter(e => {
      if (!visible.has(e.source) || !visible.has(e.target)) return false;
      // Reference and isa edges need one SELECTED endpoint: with pathToRoot on,
      // the ancestors are context the user did not ask for, and the web among
      // themselves is not what they were drawn for. Without it every visible
      // node is selected, so this only ever excludes path context.
      return e.kind === 'has-a' || selected.has(e.source) || selected.has(e.target);
    })
    .map(e => ({
      id: e.id,
      source: e.source,
      target: e.target,
      type: (e.kind === 'has-a' ? 'ownership'
        : e.kind === 'association' ? 'reference' : 'isa') as OwnershipEdgeType,
      slotName: e.kind === 'subclass' ? '' : e.label,
      storageDirection: (e.flipped ? 'flipped' : 'forward') as 'forward' | 'flipped',
      cardinality: e.cardinality,
      isLoop: e.isLoop,
    }));

  const meta = new Map(full.nodes.map(n => [n.id, n]));
  const slotsByNode = collectNodeSlots(full);
  const relationsByNode = collectRelations(full);
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
        relations: relationsByNode.get(id) ?? [],
      };
    })
    .sort((a, b) => a.layer - b.layer || a.id.localeCompare(b.id));

  return { nodes, edges, hiddenOwners, hiddenOwned };
}
