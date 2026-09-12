/**
 * Ownership graph derivation ("ownership" is the current term; this module
 * retains its historical "containment" naming until a broader rename).
 *
 * Produces the flat {nodes, edges} graph the ownership diagram consumes,
 * derived from the live SchemaGraph. Originally a TypeScript port of a pair of
 * Python prototypes (`scripts/extract_containment_tree.py` and
 * `extract_has_a_graph.py`, deleted 2026-09-05 — see git history); the rules
 * here have since been rewritten and are the only live implementation.
 *
 * Every class-ranged slot is classified with an OwnershipVerdict (see
 * `classifySlotEdge`). **The rules are declared in `./ownershipRules`** — one
 * ordered table holding each rule's predicate, verdict, human text and drawn
 * appearance — and re-exported below; this module applies them and builds the
 * graph. `is_a` relationships are emitted separately, as kind:"subclass" edges.
 *
 * `ASSOCIATION_SLOTS` is empty as of 2026-09-11, so no association edge is
 * produced from this schema. The category and its rendering are kept
 * deliberately — they are the worked example proving an edge kind is
 * expressible as configuration; see ownershipRules.ts's header.
 *
 * See docs/OWNERSHIP_CLASSIFICATION.md for every edge + rationale.
 *
 * This module is model-layer (it reads the SchemaGraph). Components reach it
 * only through DataService.getContainmentGraph().
 */

import type { SchemaGraph } from './SchemaTypes';
import { getSlotEdgesForClass, getParentClass, getSubclasses } from './Graph';

/*
 * The rules themselves now live in ONE declaration, `./ownershipRules` — the
 * predicate, the verdict, the human text and the drawn appearance of every
 * rule in a single table (TASKS `ownership-rules`). They are
 * re-exported here because this module's path is what the rest of the app,
 * and a good deal of prose, already points at.
 *
 * Read docs/OWNERSHIP_CLASSIFICATION.md for what the rules MEAN, and
 * ownershipRules.ts for how they are declared.
 */
export type {
  OwnershipVerdict, OwnershipRule, SlotFacts, VerdictSpec, DrawnVerdict,
  Layering, HeadPlacement, HeadDirection,
} from './ownershipRules';
export {
  OWNERSHIP_RULES, OWNERSHIP_VERDICTS, OWNERSHIP_RULE_TEXT, ENTITY_ROOT,
  ASSOCIATION_SLOTS, SINGLE_VALUE_OWNER_TARGETS,
  OWNERSHIP_RULE_LABEL, ruleRank, parentRuleOf,
} from './ownershipRules';

import {
  classify, ENTITY_ROOT,
  type OwnershipVerdict, type OwnershipRule,
} from './ownershipRules';

/**
 * Classify one class-ranged slot edge.
 *
 * Delegates to `classifySlotEdgeExplained` and discards the rule.
 */
export function classifySlotEdge(
  slotName: string,
  range: string,
  multivalued: boolean,
  required?: boolean,
): OwnershipVerdict {
  return classifySlotEdgeExplained(slotName, range, multivalued, required).verdict;
}

/**
 * Classify one class-ranged slot edge, reporting which rule fired.
 *
 * `classifySlotEdge` delegates here so the legend and the graph can never
 * disagree about why an edge was classified the way it was. **Keep this
 * shape** — the classifier explaining itself is what made the original
 * incoherence visible.
 *
 * `required` is optional because no rule reads it (see `SlotFacts.required`).
 * It is passed where it is to hand, so a future rule that wants it finds the
 * plumbing already there rather than a signature to thread.
 */
export function classifySlotEdgeExplained(
  slotName: string,
  range: string,
  multivalued: boolean,
  required?: boolean,
): { verdict: OwnershipVerdict; rule: OwnershipRule } {
  return classify({ slotName, range, multivalued, required });
}

// NOTE: EXCLUDE_HAS_A_TARGETS is gone (2026-08-25). It dropped every
// Entity-ranged edge before classification, which hid the 12 `focus`/Entity
// sites entirely. Entity is already in classIds and was only disappearing
// because pruneIsolated removed it when nothing touched it. Entity-ranged
// edges now classify normally and draw forward.
//
// The inheritance exclusion is a SEPARATE concern and stays below: Entity must
// be a range node while staying out of the inheritance tree. Keeping these as
// two side-by-side sets is what conflated the two cases originally.

// Classes whose subclasses are NOT emitted as is-a edges (the universal root
// would add 34 edges of pure noise).
export const SKIP_SUBCLASS_EXPANSION = new Set<string>([
  'Entity',
]);

/**
 * Every is-a descendant of `classId`, transitively, in discovery order.
 * Rule 3's "the range includes its subtree"; also what the legend enumerates
 * so its pairs and the graph's induced edges cannot disagree.
 */
export function subtreeOf(graph: SchemaGraph, classId: string): string[] {
  const out: string[] = [];
  const walk = (c: string) => {
    for (const s of getSubclasses(graph, c)) { out.push(s); walk(s); }
  };
  walk(classId);
  return out;
}

export interface ContainmentNode {
  id: string;
  label: string;
  abstract: boolean;
  description: string;
}

export type ContainmentEdgeKind = 'has-a' | 'association' | 'subclass';

export interface ContainmentEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  cardinality: string;
  flipped: boolean;
  kind: ContainmentEdgeKind;
  /** The rule verdict this edge came from; absent on subclass edges. */
  verdict?: OwnershipVerdict;
  /**
   * Rule 3: set when this edge was INDUCED from a declared one whose range is
   * this target's ancestor — the value is that declared range. The slot named
   * by `label` is declared on `source` with range `inducedFrom`, not with
   * range `target`; anything that recomputes edges from slot data has to
   * skip these or derive them the same way (`subtreeOf`).
   */
  inducedFrom?: string;
  isLoop: boolean;
}

export interface ContainmentGraph {
  nodes: ContainmentNode[];
  edges: ContainmentEdge[];
}

/** Per-class metadata the builder needs but the SchemaGraph node does not store. */
export interface ClassMeta {
  abstract: boolean;
  description: string;
}

/**
 * LinkML cardinality label from required/multivalued: `0..1`, `1..1`, `0..*`,
 * `1..*`.
 *
 * Exported so unconnected (scalar-ranged) rows in the ownership view label
 * cardinality the same way drawn edges do, rather than reimplementing it.
 *
 * **One notation, not two (Siggie, 2026-09-04.)** These used to be `0..1` /
 * `1` / `*` / `+` — a UML-style range for the optional-single case and
 * regex-style quantifiers for the rest. Each pair was self-consistent and the
 * four together were not, which raised the fair question of why a required
 * single-valued slot showed `1` while a required multivalued one showed `+`
 * when both are simply required. Writing the bounds out makes required-ness
 * the left digit in every case and multivalued-ness the right, so the four
 * labels differ only where the facts do.
 */
export function cardinalityLabel(required: boolean, multivalued: boolean): string {
  return `${required ? 1 : 0}..${multivalued ? '*' : 1}`;
}

/**
 * Build the containment {nodes, edges} for a set of classes.
 *
 * @param graph       the live schema graph
 * @param classIds    classes to include as nodes (the full class set, or a
 *                    selected subset). Edges are only emitted between two
 *                    classes that are both in this set.
 * @param classMeta   abstract/description per class id (from the Element layer)
 * @param opts.pruneIsolated  drop nodes that touch no edge (used for the full
 *                    graph, which otherwise carries the universal root and a
 *                    couple of unconnected classes). Off for explicit subsets,
 *                    where a deliberately-selected isolated class should show.
 */
export function buildContainmentGraph(
  graph: SchemaGraph,
  classIds: string[],
  classMeta: (classId: string) => ClassMeta,
  opts: { pruneIsolated?: boolean } = {},
): ContainmentGraph {
  const included = new Set(classIds);

  const edges: ContainmentEdge[] = [];
  let idx = 0;
  const pushEdge = (e: Omit<ContainmentEdge, 'id' | 'isLoop'>) => {
    edges.push({ ...e, id: `edge-${idx++}`, isLoop: e.source === e.target });
  };

  // Ownership + reference edges, per classifySlotEdge. Iterate every class's
  // slot edges, INCLUDING inherited ones — a subclass's diagram has to show
  // what it inherits, not only what it declares.
  for (const cname of classIds) {
    for (const slot of getSlotEdgesForClass(graph, cname)) {
      const rng = slot.range;
      if (!included.has(rng)) continue;           // range not a class in scope

      const verdict = classifySlotEdge(slot.slotName, rng, slot.multivalued, slot.required);
      if (verdict === 'excluded') continue;

      const card = cardinalityLabel(slot.required, slot.multivalued);
      // `association` is ordered like own-bkwd (target first) but rendered
      // differently — both ends arrowed. Only the rendering differs, which is
      // why the two layer identically.
      const flipped = verdict === 'own-bkwd' || verdict === 'association';
      const [source, target] = flipped ? [rng, cname] : [cname, rng];
      pushEdge({
        source,
        target,
        label: slot.slotName,
        cardinality: card,
        flipped,
        kind: verdict === 'association' ? 'association' : 'has-a',
        verdict,
      });
    }
  }

  /*
   * Rule 3 — a forward-owned range includes its subtree. `ObservationSet.
   * observations: Observation[]` holds MeasurementObservations as readily as
   * Observations, so ObservationSet owns every Observation subclass, and the
   * induced edges say so. Without them a subclass nothing names directly has
   * no owner at all: it is a root in the DAG, lands in layer 0, and drags the
   * merged box it shares with its parent to the far left of the canvas —
   * disconnected from the box that owns the family (Siggie, 2026-09-10, on
   * QuestionnaireResponseValue). Inherited slots already give the BACKWARD
   * direction for free — a subclass carries its parent's `associated_
   * participant`, so Participant owns each child — and this is the forward
   * dual of that.
   *
   * Forward edges only: no own-bkwd edge in the schema has a range with
   * subclasses (measured 2026-09-10), and Entity is skipped for the reason
   * SKIP_SUBCLASS_EXPANSION exists — its subtree is every class.
   */
  for (const e of [...edges]) {
    if (e.kind !== 'has-a' || e.flipped || e.isLoop || e.target === ENTITY_ROOT) continue;
    for (const child of subtreeOf(graph, e.target)) {
      if (!included.has(child) || child === e.source) continue;
      if (edges.some(x => x.source === e.source && x.target === child && x.label === e.label)) continue;
      const { id: _id, isLoop: _loop, ...rest } = e;
      pushEdge({ ...rest, target: child, inducedFrom: e.target });
    }
  }

  // subclass (is-a) edges: parent → child, for child→parent inheritance edges
  // where both ends are in scope and the parent isn't a skipped root.
  for (const cname of classIds) {
    const parent = getParentClass(graph, cname);
    if (parent && included.has(parent) && !SKIP_SUBCLASS_EXPANSION.has(parent)) {
      pushEdge({
        source: parent,
        target: cname,
        label: '',
        cardinality: '',
        flipped: false,
        kind: 'subclass',
      });
    }
  }

  // Build nodes; optionally prune classes that touch no edge.
  let nodeIds = classIds;
  if (opts.pruneIsolated) {
    const touched = new Set<string>();
    for (const e of edges) {
      touched.add(e.source);
      touched.add(e.target);
    }
    nodeIds = classIds.filter(id => touched.has(id));
  }

  const nodes: ContainmentNode[] = nodeIds.map(id => {
    const meta = classMeta(id);
    return { id, label: id, abstract: meta.abstract, description: meta.description };
  });

  return { nodes, edges };
}
