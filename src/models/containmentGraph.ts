/**
 * Ownership graph derivation ("ownership" is the current term; this module
 * retains its historical "containment" naming until a broader rename).
 *
 * Produces the flat {nodes, edges} graph the ownership diagram consumes,
 * derived from the live SchemaGraph. Originally a TypeScript port of the
 * heuristic in scripts/extract_containment_tree.py + extract_has_a_graph.py.
 *
 * Every class-ranged slot is classified with an OwnershipVerdict
 * (see classifySlotEdge). Default heuristic (FK inversion), in order:
 *   - range in EXCLUDE_HAS_A_TARGETS         : 'excluded' (edge dropped)
 *   - multi-valued slot → class              : 'own-fwd'  (owner has-a range)
 *   - single-valued slot → value object      : 'own-fwd'
 *   - single-valued slot → other entity      : 'own-flip' (FK back-reference:
 *                                              the target owns the source)
 * OWNERSHIP_OVERRIDES pre-empts the default per slot name. Adjudicated
 * 2026-07-13 — see docs/OWNERSHIP_CLASSIFICATION.md for every edge + rationale.
 *   - is_a relationships                     : emitted as kind:"subclass" edges
 *
 * This module is model-layer (it reads the SchemaGraph). Components reach it
 * only through DataService.getContainmentGraph().
 */

import type { SchemaGraph } from './SchemaTypes';
import { getSlotEdgesForClass, getParentClass } from './Graph';

export type OwnershipVerdict = 'own-fwd' | 'own-flip' | 'ref' | 'excluded';

// Value-object classes: single-valued slots pointing to these are forward
// ownership (the owner has-a value object), never flipped.
export const VALUE_OBJECTS = new Set<string>([
  'Quantity', 'TimePoint', 'TimePeriod', 'BodySite', 'CauseOfDeath',
  'QuestionnaireResponseValue',
  'QuestionnaireResponseValueDecimal', 'QuestionnaireResponseValueBoolean',
  'QuestionnaireResponseValueInteger', 'QuestionnaireResponseValueTimePoint',
  'QuestionnaireResponseValueString',
  'Substance', 'BiologicProduct',
  // Adjudicated 2026-08-19. Activity is is_a: Entity but has no identity of
  // its own (activity_type + time_duration only) and nothing references it
  // except Context.activity — so the FK-inversion default misfires on it:
  // single-valued + entity range alone made it own-flip ("Activity owns
  // Context"), stranding Activity at layer 0 as a false root while Context
  // sank to layer 6. Forward now: Context -> Activity, Activity at layer 7.
  'Activity',
]);

// Per-slot verdicts that pre-empt the default heuristic. These encode the
// 2026-07-13 adjudication (docs/OWNERSHIP_CLASSIFICATION.md); entries marked
// (default) restate what the heuristic would do anyway and exist to record
// that the classification was a decision, not an accident.
export const OWNERSHIP_OVERRIDES = new Map<string, OwnershipVerdict>([
  // Non-owning associational references.
  ['originating_site', 'ref'],          // site of origin is provenance
  ['associated_assay', 'ref'],          // assay is method metadata
  ['transport_origin', 'ref'],
  ['transport_destination', 'ref'],
  ['related_questionnaire_item', 'ref'],
  ['has_questionnaire_item', 'ref'],    // answer points at its question;
                                        // owner is QuestionnaireResponse
  ['container', 'ref'],                 // storage activity uses containers
  ['related_document', 'ref'],
  // Forward ownership despite single-valued entity range.
  ['creation_activity', 'own-fwd'],     // consistent w/ processing/storage/
                                        // transport_activity (own-fwd)
  ['dimensional_measures', 'own-fwd'],  // same family as quality/quantity_measure
  // Flipped despite multivalued: parent_specimen points UP the derivation
  // tree, so the parent owns the child.
  ['parent_specimen', 'own-flip'],
  // (default) adjudicated ownership, previously refs in NO_FLIP_SLOTS:
  ['performed_by', 'own-flip'],         // Organization owns performed work
  ['associated_person', 'own-flip'],    // Person owns Participant
  ['contained_in', 'own-flip'],         // Container owns Specimen
  ['related_imaging_study', 'own-flip'],// ImagingStudy owns ImagingFile
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
  if (EXCLUDE_HAS_A_TARGETS.has(range)) return 'excluded';
  const override = OWNERSHIP_OVERRIDES.get(slotName);
  if (override) return override;
  if (multivalued) return 'own-fwd';
  if (VALUE_OBJECTS.has(range)) return 'own-fwd';
  return 'own-flip';
}

// Targets excluded as has-a ranges: abstract refs that don't point to a
// specific class — they'd appear everywhere and add noise.
export const EXCLUDE_HAS_A_TARGETS = new Set<string>([
  'Entity',
]);

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

export type ContainmentEdgeKind = 'has-a' | 'ref' | 'subclass';

export interface ContainmentEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  cardinality: string;
  flipped: boolean;
  kind: ContainmentEdgeKind;
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

/** LinkML cardinality label from required/multivalued. */
function cardinalityLabel(required: boolean, multivalued: boolean): string {
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
      const flipped = verdict === 'own-flip';
      const [source, target] = flipped ? [rng, cname] : [cname, rng];
      pushEdge({
        source,
        target,
        label: slot.slotName,
        cardinality: card,
        flipped,
        kind: verdict === 'ref' ? 'ref' : 'has-a',
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
