/**
 * Ownership graph derivation ("ownership" is the current term; this module
 * retains its historical "containment" naming until a broader rename).
 *
 * Produces the flat {nodes, edges} graph the ownership diagram consumes,
 * derived from the live SchemaGraph. Originally a TypeScript port of the
 * heuristic in scripts/extract_containment_tree.py + extract_has_a_graph.py.
 *
 * Every class-ranged slot is classified with an OwnershipVerdict
 * (see classifySlotEdge). Three categories: 'own-fwd' (owns), 'own-bkwd'
 * (belongs to), 'association' (no ownership claim, both ends arrowed, but
 * still ordered like own-bkwd). Rules, in the order they are tried:
 *
 *   - slot in ASSOCIATION_SLOTS              : 'association'  (tested first —
 *                                              these exist to defeat Rule 1)
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
import { getSlotEdgesForClass, getParentClass } from './Graph';

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
]);

// Slots that make no ownership claim: both ends arrowed, ordered like
// own-bkwd but rendered distinctly. These exist specifically to defeat Rule 1
// (multivalued would otherwise read as forward ownership).
//
// Settled 2026-08-25: the six single-valued members of the old 8-slot set were
// dropped. Rule 2 already sends them to own-bkwd, which layers identically, so
// membership changed only their rendering — and none ranges on a
// single-value-owner target, so Exception 2a does not intercept them. Only the
// two genuinely-multivalued associations remain.
//
// To restore the 8-slot behaviour, add back: originating_site,
// associated_assay, transport_origin, transport_destination,
// related_questionnaire_item, has_questionnaire_item.
export const ASSOCIATION_SLOTS = new Set<string>([
  'related_document',
  'container',                          // storage activity uses containers
]);

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
  | 'backward-multivalued'  // slot in BACKWARD_DESPITE_MULTIVALUED
  | 'cardinality-split'     // slot in CARDINALITY_SPLIT_OWN_FWD (Exception 2b)
  | 'multivalued'           // Rule 1: multi-valued slot → class
  | 'value-object'          // Exception 2a: single-valued → no independent existence
  | 'fk-inversion';         // Rule 2: single-valued slot → other entity

/** Human-readable statement of each rule, for the legend. */
export const OWNERSHIP_RULE_TEXT: Record<OwnershipRule, string> = {
  'association': 'A named association: the slot connects two things without either owning '
    + 'the other. Both ends are arrowed. These are listed explicitly because they are '
    + 'multivalued, so Rule 1 would otherwise read them as forward ownership.',
  'backward-multivalued': 'Multivalued, but pointing UP rather than down: parent_specimen '
    + 'walks the derivation tree, so the parent owns the child and ownership runs backward.',
  'cardinality-split': 'Cardinality splits a family. These are single-valued but have '
    + 'multivalued siblings that are forward-owned, so they are forced forward to keep the '
    + 'family consistent (Exception 2b).',
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

// Classes whose subclasses are NOT emitted as is-a edges (the universal root
// would add 34 edges of pure noise).
export const SKIP_SUBCLASS_EXPANSION = new Set<string>([
  'Entity',
]);

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

/** LinkML cardinality label from required/multivalued.
 *  Exported so unconnected (scalar-ranged) rows in the ownership view label
 *  cardinality the same way drawn edges do, rather than reimplementing it. */
export function cardinalityLabel(required: boolean, multivalued: boolean): string {
  if (multivalued) return required ? '+' : '*';
  return required ? '1' : '0..1';
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
  // slot edges (own + inherited), matching extract_has_a_graph.py which keeps
  // inherited edges.
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
