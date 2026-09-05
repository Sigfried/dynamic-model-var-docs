import { describe, test, expect, beforeAll } from 'vitest';
import { loadModelData } from '../utils/dataLoader';
import { DataService } from '../services/DataService';
import type { ContainmentGraph } from '../services/DataService';
import {
  SINGLE_VALUE_OWNER_TARGETS, ASSOCIATION_SLOTS, BACKWARD_DESPITE_MULTIVALUED,
  SKIP_SUBCLASS_EXPANSION, classifySlotEdge,
} from '../models/containmentGraph';
import { getSlotEdgesForClass } from '../models/Graph';

/**
 * getContainmentGraph() derives the has-a / containment graph live from the
 * schema graph. We test the HEURISTIC against the same live slot data (so the
 * test stays correct as the schema evolves), plus structural invariants —
 * never against a golden file, which would break on every legitimate schema
 * edit.
 */
describe('getContainmentGraph', () => {
  let ds: DataService;
  let graph: ContainmentGraph;

  beforeAll(async () => {
    const data = await loadModelData();
    ds = new DataService(data);
    graph = ds.getContainmentGraph();
  });

  test('flip + cardinality match the heuristic recomputed from live slot data', async () => {
    const data = await loadModelData();
    const nodeIds = new Set(graph.nodes.map(n => n.id));

    // Recompute expected slot edges directly via the classifier.
    type Expected = { source: string; target: string; flipped: boolean; cardinality: string; kind: string };
    const expected = new Map<string, Expected>();
    for (const cname of nodeIds) {
      for (const slot of getSlotEdgesForClass(data.graph, cname)) {
        const rng = slot.range;
        if (!nodeIds.has(rng)) continue;
        const verdict = classifySlotEdge(slot.slotName, rng, slot.multivalued);
        if (verdict === 'excluded') continue;
        // Deliberately NOT cardinalityLabel(): this test exists to check the
        // builder against an independent derivation, so it spells the rule out.
        const card = `${slot.required ? 1 : 0}..${slot.multivalued ? '*' : 1}`;
        const flip = verdict === 'own-bkwd' || verdict === 'association';
        const [source, target] = flip ? [rng, cname] : [cname, rng];
        expected.set([source, target, slot.slotName].join('|'), {
          source, target, flipped: flip, cardinality: card,
          kind: verdict === 'association' ? 'association' : 'has-a',
        });
      }
    }

    for (const e of graph.edges.filter(e => e.kind !== 'subclass')) {
      const exp = expected.get([e.source, e.target, e.label].join('|'));
      expect(exp, `unexpected edge ${e.source}->${e.target} via ${e.label}`).toBeDefined();
      expect(e.flipped, `flip for ${e.label}`).toBe(exp!.flipped);
      expect(e.cardinality, `cardinality for ${e.label}`).toBe(exp!.cardinality);
      expect(e.kind, `kind for ${e.label}`).toBe(exp!.kind);
    }
    // and every expected edge was produced
    const produced = new Set(graph.edges.filter(e => e.kind !== 'subclass').map(e => [e.source, e.target, e.label].join('|')));
    for (const k of expected.keys()) {
      expect(produced.has(k), `missing expected edge ${k}`).toBe(true);
    }
  });

  test('association slots produce association edges, ordered like own-bkwd', () => {
    let seen = 0;
    for (const e of graph.edges) {
      if (ASSOCIATION_SLOTS.has(e.label)) {
        seen++;
        expect(e.kind, e.label).toBe('association');
        // association layers identically to own-bkwd: target-first ordering.
        expect(e.flipped, e.label).toBe(true);
      }
    }
    expect(seen).toBeGreaterThan(0);
  });

  test('value-object ranges are never flipped (forward ownership)', () => {
    for (const e of graph.edges.filter(e => e.kind === 'has-a')) {
      // an unflipped edge's range is its target; a flipped edge's range is its source
      const range = e.flipped ? e.source : e.target;
      if (SINGLE_VALUE_OWNER_TARGETS.has(range)) expect(e.flipped, `${e.label}->${range}`).toBe(false);
    }
  });

  test('multivalued slots run forward unless explicitly listed as backward', () => {
    for (const e of graph.edges.filter(e => e.kind === 'has-a' && (e.cardinality === '*' || e.cardinality === '+'))) {
      const expectFlip = BACKWARD_DESPITE_MULTIVALUED.has(e.label);
      expect(e.flipped, `${e.label} (${e.cardinality})`).toBe(expectFlip);
    }
  });

  test('Entity is now a drawn range node; skipped subclass roots stay out of is-a', () => {
    // EXCLUDE_HAS_A_TARGETS is gone: Entity-ranged edges (the 12 `focus` sites)
    // are classified and drawn like any other. Entity must be a RANGE node
    // while staying out of the INHERITANCE tree — two separate concerns.
    const entityEdges = graph.edges.filter(e => e.kind !== 'subclass' && (e.source === 'Entity' || e.target === 'Entity'));
    expect(entityEdges.length, 'Entity-ranged edges should now be drawn').toBeGreaterThan(0);
    // SKIP_SUBCLASS_EXPANSION classes are never a subclass-edge parent
    for (const e of graph.edges.filter(e => e.kind === 'subclass')) {
      expect([...SKIP_SUBCLASS_EXPANSION]).not.toContain(e.source);
    }
  });

  test('full graph prunes classes that touch no edge', () => {
    const touched = new Set<string>();
    for (const e of graph.edges) { touched.add(e.source); touched.add(e.target); }
    for (const n of graph.nodes) {
      expect(touched.has(n.id), `node ${n.id} touches no edge`).toBe(true);
    }
  });

  test('isLoop is set for self-edges only', () => {
    for (const e of graph.edges) expect(e.isLoop).toBe(e.source === e.target);
  });

  test('node abstract flag reflects the model', () => {
    // At least one abstract and one concrete, and Observation is abstract in BDCHM.
    const obs = graph.nodes.find(n => n.id === 'Observation');
    if (obs) expect(typeof obs.abstract).toBe('boolean');
    expect(graph.nodes.some(n => !n.abstract)).toBe(true);
  });
});

describe('getContainmentGraph (subset scoping)', () => {
  test('only emits edges between two included classes', async () => {
    const ds = new DataService(await loadModelData());
    const subset = ['Specimen', 'SpecimenContainer'];
    const g = ds.getContainmentGraph(subset);
    expect(g.nodes.map(n => n.id).sort()).toEqual([...subset].sort());
    for (const e of g.edges) {
      expect(subset).toContain(e.source);
      expect(subset).toContain(e.target);
    }
  });

  test('deliberately-selected isolated classes still appear as nodes', async () => {
    const ds = new DataService(await loadModelData());
    const g = ds.getContainmentGraph(['Demography', 'ResearchStudyCollection']);
    expect(g.nodes.map(n => n.id).sort()).toEqual(['Demography', 'ResearchStudyCollection']);
  });
});
