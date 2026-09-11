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
 * Every class-ranged slot is classified with an OwnershipVerdict
 * (see classifySlotEdge). Three categories: 'own-fwd' (owns), 'own-bkwd'
 * (belongs to), 'association' (no ownership claim, both ends arrowed, but
 * still ordered like own-bkwd). **ASSOCIATION_SLOTS is empty as of
 * 2026-09-11**, so no association edge is produced from this schema; the
 * category and its rendering are kept while `ownership-rules-declarative` is
 * designed (see the set's comment, and docs/OWNERSHIP_RULES_PLAN.md).
 * Rules, in the order they are tried:
 *
 *   - slot in ASSOCIATION_SLOTS              : 'association'  (tested first —
 *                                              these exist to defeat Rule 1;
 *                                              currently empty)
 *   - slot in BACKWARD_DESPITE_MULTIVALUED   : 'own-bkwd'
 *   - slot in CARDINALITY_SPLIT_OWN_FWD      : 'own-fwd'      (Exception 2b)
 *   - Rule 1: multi-valued slot → class      : 'own-fwd'      (owner has-a
 *                                              collection of them)
 *   - Exception 2a: single-valued → a target with no independent existence
 *                                            : 'own-fwd'
 *   - Rule 2: single-valued → other entity   : 'own-bkwd'     (FK back-ref:
 *                                              the target owns the source)
 *   - is_a relationships                     : emitted as kind:"subclass" edges
 *
 * See docs/OWNERSHIP_CLASSIFICATION.md for every edge + rationale.
 *
 * This module is model-layer (it reads the SchemaGraph). Components reach it
 * only through DataService.getContainmentGraph().
 */

import type { SchemaGraph } from './SchemaTypes';
import { getSlotEdgesForClass, getParentClass, getSubclasses } from './Graph';

export type OwnershipVerdict = 'own-fwd' | 'own-bkwd' | 'association' | 'excluded';

// Value-object classes: single-valued slots pointing to these are forward
// ownership (the owner has-a value object), never flipped.
export const SINGLE_VALUE_OWNER_TARGETS = new Set<string>([
  'Quantity', 'TimePoint', 'TimePeriod', 'BodySite', 'CauseOfDeath',
  'QuestionnaireResponseValue',
  'QuestionnaireResponseValueDecimal', 'QuestionnaireResponseValueBoolean',
  'QuestionnaireResponseValueInteger', 'QuestionnaireResponseValueTimePoint',
  'QuestionnaireResponseValueString',
  'Substance', 'BiologicProduct',
  // Adjudicated 2026-08-19. Activity is is_a: Entity but has no identity of
  // its own (activity_type + time_duration only) and nothing references it
  // except Context.activity — so the FK-inversion default misfires on it:
  // single-valued + entity range alone made it own-bkwd ("Activity owns
  // Context"), stranding Activity at layer 0 as a false root while Context
  // sank to layer 6. Forward now: Context -> Activity, Activity at layer 7.
  'Activity',
  // Added 2026-09-11 with TASKS `drop-association` step 1. A container has no
  // independent existence from the specimen in it, so `Specimen.contained_in`
  // is an Exception 2a target rather than an owner: the specimen owns its
  // container, not the reverse.
  //
  // Keyed by RANGE, so it catches both single-valued slots ranging here —
  // `Specimen.contained_in` and `SpecimenContainer.parent_container`. The
  // latter is a self-loop, drawn as a ⟲ marker on its own row, so nothing
  // about it changes.
  //
  // This is also what keeps the graph acyclic once ASSOCIATION_SLOTS is empty.
  // Leaving contained_in backward while `container` goes forward reinstates
  // the graph's only non-self cycle, Specimen → SpecimenStorageActivity →
  // SpecimenContainer → Specimen — the one association existed to break.
  // Pinned by containmentGraph.test.ts, "contained_in must stay forward".
  'SpecimenContainer',
]);

// Slots that make no ownership claim: both ends arrowed, ordered like
// own-bkwd but rendered distinctly. These exist specifically to defeat Rule 1
// (multivalued would otherwise read as forward ownership).
//
// EMPTY since 2026-09-11 (TASKS `drop-association`, step 1). The two remaining
// members became ordinary Rule 1 forward ownership:
//   - related_document: a Document connects to nothing but its Specimen and
//     its own `focus`, so it belongs to that specimen.
//   - container: no clear direction between container and storage activity,
//     but not important enough to justify a whole edge kind.
// `Specimen.contained_in` flipped forward in the same change, via
// SpecimenContainer joining SINGLE_VALUE_OWNER_TARGETS below — that is what
// keeps the graph acyclic without this set. See containmentGraph.test.ts,
// "contained_in must stay forward".
//
// The machinery this set feeds (the `association` DrawnKind, its EDGE_COLORS
// entry, the RelationPosition, the legend row, {{edge:association}}) is
// deliberately still in place while TASKS `ownership-rules-declarative` is
// designed: association is the only worked example of an edge kind that is
// dashed, arrowed at BOTH ends, claims no ownership, and yet layers like
// own-bkwd, so it is the test case for making edge kinds configurable.
// Deletion is step 3, after the declaration can express it as config.
// Full rationale: docs/OWNERSHIP_RULES_PLAN.md.
//
// Historical: the pre-2026-08-25 8-slot set also held originating_site,
// associated_artifact (was associated_assay until upstream 28007df),
// transport_origin, transport_destination, related_questionnaire_item,
// has_questionnaire_item.
export const ASSOCIATION_SLOTS = new Set<string>([]);

// Exception 2b: cardinality splits a family. Both have multivalued siblings
// that are own-fwd; dimensional_measures also ranges on a *Set. Asserted, not
// derived — a structural "collection class" test over-collects (Person,
// Questionnaire, ResearchStudyCollection).
export const CARDINALITY_SPLIT_OWN_FWD = new Set<string>([
  'creation_activity',                  // cf. processing/storage/transport_activity
  'dimensional_measures',               // cf. quality/quantity_measure
]);

// Multivalued slots that still point UP: parent_specimen walks the derivation
// tree, so the parent owns the child.
export const BACKWARD_DESPITE_MULTIVALUED = new Set<string>([
  'parent_specimen',
]);

/**
 * Classify one class-ranged slot edge. Override wins; otherwise the default
 * FK-inversion heuristic (see module header).
 */
export function classifySlotEdge(
  slotName: string,
  range: string,
  multivalued: boolean,
): OwnershipVerdict {
  return classifySlotEdgeExplained(slotName, range, multivalued).verdict;
}

/**
 * Which of the module-header rules decided a slot's verdict.
 *
 * `excluded`/`override` pre-empt the default heuristic; the other three ARE the
 * default heuristic, in the order it tries them.
 */
export type OwnershipRule =
  | 'association'           // slot in ASSOCIATION_SLOTS
  | 'entity-ranged'         // range is Entity: always forward
  | 'backward-multivalued'  // slot in BACKWARD_DESPITE_MULTIVALUED
  | 'cardinality-split'     // slot in CARDINALITY_SPLIT_OWN_FWD (Exception 2b)
  | 'multivalued'           // Rule 1: multi-valued slot → class
  | 'value-object'          // Exception 2a: single-valued → no independent existence
  | 'fk-inversion'          // Rule 2: single-valued slot → other entity
  | 'range-subtree';        // Rule 3: an own-fwd slot's range includes its subclasses

/** Human-readable statement of each rule, for the legend. */
export const OWNERSHIP_RULE_TEXT: Record<OwnershipRule, string> = {
  'entity-ranged': 'The range is Entity, the universal root. A slot pointing at Entity is '
    + 'never a foreign key back to an owner, so ownership always runs forward regardless of '
    + 'cardinality — otherwise single-valued sites would draw Entity as the owner.',
  'association': 'A named association: the slot connects two things without either owning '
    + 'the other. Both ends are arrowed. These are listed explicitly because they are '
    + 'multivalued, so Rule 1 would otherwise read them as forward ownership.',
  'backward-multivalued': 'Multivalued, but pointing UP rather than down: parent_specimen '
    + 'walks the derivation tree, so the parent owns the child and ownership runs backward.',
  'cardinality-split': 'Cardinality splits a family. These are single-valued but have '
    + 'multivalued siblings that are forward-owned, so they are forced forward to keep the '
    + 'family consistent (Exception 2b).',
  'range-subtree': 'A slot whose range is a parent class accepts any of its subclasses, so '
    + 'whatever owns the parent through that slot owns each subclass too (Rule 3). These '
    + 'edges are induced from the declared one, not read from a slot of their own.',
  'multivalued': 'A multi-valued slot pointing at a class means the owner has-a collection '
    + 'of them, so ownership runs forward: owner → range.',
  'value-object': 'A single-valued slot pointing at a target with NO INDEPENDENT EXISTENCE '
    + '(Quantity, TimePoint, and the like) is forward ownership — the value belongs to '
    + 'whoever holds it (Exception 2a).',
  'fk-inversion': 'A single-valued slot pointing at another ENTITY reads as a foreign key, so '
    + 'ownership runs BACKWARD: the target owns the source, not the other way round.',
};
/**
 * Classify one class-ranged slot edge, reporting which rule fired.
 *
 * `classifySlotEdge` delegates here so the legend and the graph can never
 * disagree about why an edge was classified the way it was.
 */
export function classifySlotEdgeExplained(
  slotName: string,
  range: string,
  multivalued: boolean,
): { verdict: OwnershipVerdict; rule: OwnershipRule } {
  // Association first: these exist to defeat Rule 1, so they must be tested
  // before the multivalued rule that they are defeating.
  if (ASSOCIATION_SLOTS.has(slotName)) return { verdict: 'association', rule: 'association' };
  if (BACKWARD_DESPITE_MULTIVALUED.has(slotName)) return { verdict: 'own-bkwd', rule: 'backward-multivalued' };
  if (CARDINALITY_SPLIT_OWN_FWD.has(slotName)) return { verdict: 'own-fwd', rule: 'cardinality-split' };
  // Entity-ranged: always forward, regardless of cardinality. Entity is the
  // universal root, so a slot pointing AT it is never a foreign key back to an
  // owner — Rule 2 would reverse the 7 single-valued `focus` sites and draw
  // Entity as the owner of Document/Observation, which is backwards.
  if (range === ENTITY_ROOT) return { verdict: 'own-fwd', rule: 'entity-ranged' };
  // Rule 1
  if (multivalued) return { verdict: 'own-fwd', rule: 'multivalued' };
  // Exception 2a
  if (SINGLE_VALUE_OWNER_TARGETS.has(range)) return { verdict: 'own-fwd', rule: 'value-object' };
  // Rule 2
  return { verdict: 'own-bkwd', rule: 'fk-inversion' };
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

/** The universal root. Both a drawn range node and an excluded inheritance parent. */
export const ENTITY_ROOT = 'Entity';

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

      const verdict = classifySlotEdge(slot.slotName, rng, slot.multivalued);
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
