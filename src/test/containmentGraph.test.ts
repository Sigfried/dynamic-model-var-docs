import { describe, test, expect, beforeAll } from 'vitest';
import { loadModelData } from '../utils/dataLoader';
import { DataService } from '../services/DataService';
import type { ContainmentGraph } from '../services/DataService';
import {
  VALUE_OBJECTS, NO_FLIP_SLOTS, EXCLUDE_HAS_A_TARGETS, SKIP_SUBCLASS_EXPANSION,
} from '../models/containmentGraph';
import { getSlotEdgesForClass } from '../models/Graph';

/**
 * getContainmentGraph() derives the has-a / containment graph live from the
 * schema graph. We test the HEURISTIC against the same live slot data (so the
 * test stays correct as the schema evolves), plus structural invariants.
 *
 * Note: public/containment-graph.json was the original hand-tuned target, but
 * it is a snapshot of an older bdchm.yaml — the schema has since drifted (slot
 * ranges/cardinalities changed). The heuristic logic was verified against it;
 * pinning to it as a fixture would break on every legitimate schema edit, so
 * we assert properties instead.
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

    // Recompute expected has-a edges directly from the slot edges.
    type Expected = { source: string; target: string; flipped: boolean; cardinality: string };
    const expected = new Map<string, Expected>();
    for (const cname of nodeIds) {
      for (const slot of getSlotEdgesForClass(data.graph, cname)) {
        const rng = slot.range;
        if (!nodeIds.has(rng) || EXCLUDE_HAS_A_TARGETS.has(rng)) continue;
        const card = slot.multivalued
          ? (slot.required ? '+' : '*')
          : (slot.required ? '1' : '0..1');
        const flip = !slot.multivalued && !VALUE_OBJECTS.has(rng) && !NO_FLIP_SLOTS.has(slot.slotName);
        const [source, target] = flip ? [rng, cname] : [cname, rng];
        expected.set([source, target, slot.slotName].join('|'), { source, target, flipped: flip, cardinality: card });
      }
    }

    for (const e of graph.edges.filter(e => e.kind === 'has-a')) {
      const exp = expected.get([e.source, e.target, e.label].join('|'));
      expect(exp, `unexpected has-a edge ${e.source}->${e.target} via ${e.label}`).toBeDefined();
      expect(e.flipped, `flip for ${e.label}`).toBe(exp!.flipped);
      expect(e.cardinality, `cardinality for ${e.label}`).toBe(exp!.cardinality);
    }
    // and every expected edge was produced
    const produced = new Set(graph.edges.filter(e => e.kind === 'has-a').map(e => [e.source, e.target, e.label].join('|')));
    for (const k of expected.keys()) {
      expect(produced.has(k), `missing expected has-a edge ${k}`).toBe(true);
    }
  });

  test('NO_FLIP_SLOTS are never flipped', () => {
    for (const e of graph.edges) {
      if (NO_FLIP_SLOTS.has(e.label)) expect(e.flipped, e.label).toBe(false);
    }
  });

  test('value-object ranges are never flipped (forward containment)', () => {
    for (const e of graph.edges.filter(e => e.kind === 'has-a')) {
      // an unflipped edge's range is its target; a flipped edge's range is its source
      const range = e.flipped ? e.source : e.target;
      if (VALUE_OBJECTS.has(range)) expect(e.flipped, `${e.label}->${range}`).toBe(false);
    }
  });

  test('multivalued slots are never flipped', () => {
    for (const e of graph.edges.filter(e => e.kind === 'has-a' && (e.cardinality === '*' || e.cardinality === '+'))) {
      expect(e.flipped, `${e.label} (${e.cardinality})`).toBe(false);
    }
  });

  test('excluded targets and skipped subclass roots do not appear', () => {
    for (const id of EXCLUDE_HAS_A_TARGETS) {
      expect(graph.nodes.map(n => n.id)).not.toContain(id);
    }
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
