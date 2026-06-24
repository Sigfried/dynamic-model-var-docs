/**
 * Containment graph derivation.
 *
 * Produces the flat {nodes, edges} graph the has-a / containment diagram
 * consumes, derived from the live SchemaGraph. This is the TypeScript port of
 * the heuristic in scripts/extract_containment_tree.py + extract_has_a_graph.py.
 * The hand-tuned public/containment-graph.json is the golden fixture: this
 * module reproduces it exactly (verified in containmentGraph.test.ts).
 *
 * Heuristic (FK inversion for containment):
 *   - multi-valued slot → class            : forward containment (owner has-a range)
 *   - single-valued slot → value object     : forward containment
 *   - single-valued slot → other entity     : FK back-reference → FLIP
 *                                             (the target "contains" the source)
 *   - NO_FLIP_SLOTS                          : associational refs, never flipped
 *   - EXCLUDE_HAS_A_TARGETS                  : too-abstract targets, edge dropped
 *   - is_a relationships                     : emitted as kind:"subclass" edges
 *
 * This module is model-layer (it reads the SchemaGraph). Components reach it
 * only through DataService.getContainmentGraph().
 */

import type { SchemaGraph } from './SchemaTypes';
import { getSlotEdgesForClass, getParentClass } from './Graph';

// Value-object classes: single-valued slots pointing to these are forward
// containment (the owner has-a value object), never flipped.
export const VALUE_OBJECTS = new Set<string>([
  'Quantity', 'TimePoint', 'TimePeriod', 'BodySite', 'CauseOfDeath',
  'QuestionnaireResponseValue',
  'QuestionnaireResponseValueDecimal', 'QuestionnaireResponseValueBoolean',
  'QuestionnaireResponseValueInteger', 'QuestionnaireResponseValueTimePoint',
  'QuestionnaireResponseValueString',
  'Substance', 'BiologicProduct',
]);

// Single-valued entity-ranged slots that should NOT be flipped: these are
// associational references, not containment back-references.
export const NO_FLIP_SLOTS = new Set<string>([
  'performed_by',
  'originating_site',
  'associated_assay',
  'transport_origin',
  'transport_destination',
  'focus',
  'related_imaging_study',
  'document',
  'associated_person',
  'creation_activity',
  'contained_in',
  'dimensional_measures',
  'related_questionnaire_item',
]);

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

export type ContainmentEdgeKind = 'has-a' | 'subclass';

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

  // has-a edges (with FK inversion). Iterate every class's slot edges (own +
  // inherited), matching extract_has_a_graph.py which keeps inherited edges.
  for (const cname of classIds) {
    for (const slot of getSlotEdgesForClass(graph, cname)) {
      const rng = slot.range;
      if (!included.has(rng)) continue;           // range not a class in scope
      if (EXCLUDE_HAS_A_TARGETS.has(rng)) continue;

      const card = cardinalityLabel(slot.required, slot.multivalued);
      const shouldFlip =
        !slot.multivalued &&
        !VALUE_OBJECTS.has(rng) &&
        !NO_FLIP_SLOTS.has(slot.slotName);

      const [source, target] = shouldFlip ? [rng, cname] : [cname, rng];
      pushEdge({
        source,
        target,
        label: slot.slotName,
        cardinality: card,
        flipped: shouldFlip,
        kind: 'has-a',
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
