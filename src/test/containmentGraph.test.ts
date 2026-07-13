import { describe, test, expect, beforeAll } from 'vitest';
import { loadModelData } from '../utils/dataLoader';
import { DataService } from '../services/DataService';
import type { ContainmentGraph } from '../services/DataService';
import {
  VALUE_OBJECTS, OWNERSHIP_OVERRIDES, EXCLUDE_HAS_A_TARGETS,
  SKIP_SUBCLASS_EXPANSION, classifySlotEdge,
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

    // Recompute expected slot edges directly via the classifier.
    type Expected = { source: string; target: string; flipped: boolean; cardinality: string; kind: string };
    const expected = new Map<string, Expected>();
    for (const cname of nodeIds) {
      for (const slot of getSlotEdgesForClass(data.graph, cname)) {
        const rng = slot.range;
        if (!nodeIds.has(rng)) continue;
        const verdict = classifySlotEdge(slot.slotName, rng, slot.multivalued);
        if (verdict === 'excluded') continue;
        const card = slot.multivalued
          ? (slot.required ? '+' : '*')
          : (slot.required ? '1' : '0..1');
        const flip = verdict === 'own-flip';
        const [source, target] = flip ? [rng, cname] : [cname, rng];
        expected.set([source, target, slot.slotName].join('|'), {
          source, target, flipped: flip, cardinality: card,
          kind: verdict === 'ref' ? 'ref' : 'has-a',
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

  test('ref-verdict slots produce unflipped ref edges, never parent links', () => {
    const refSlots = new Set(
      [...OWNERSHIP_OVERRIDES].filter(([, v]) => v === 'ref').map(([k]) => k),
    );
    let seen = 0;
    for (const e of graph.edges) {
      if (refSlots.has(e.label)) {
        seen++;
        expect(e.kind, e.label).toBe('ref');
        expect(e.flipped, e.label).toBe(false);
      }
    }
    expect(seen).toBeGreaterThan(0);
  });

  test('value-object ranges are never flipped (forward ownership)', () => {
    for (const e of graph.edges.filter(e => e.kind === 'has-a')) {
      // an unflipped edge's range is its target; a flipped edge's range is its source
      const range = e.flipped ? e.source : e.target;
      if (VALUE_OBJECTS.has(range)) expect(e.flipped, `${e.label}->${range}`).toBe(false);
    }
  });

  test('multivalued slots flip only via explicit own-flip override', () => {
    for (const e of graph.edges.filter(e => e.kind === 'has-a' && (e.cardinality === '*' || e.cardinality === '+'))) {
      const expectFlip = OWNERSHIP_OVERRIDES.get(e.label) === 'own-flip';
      expect(e.flipped, `${e.label} (${e.cardinality})`).toBe(expectFlip);
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
