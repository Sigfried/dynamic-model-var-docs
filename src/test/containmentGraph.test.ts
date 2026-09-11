import { describe, test, expect, beforeAll } from 'vitest';
import { loadModelData } from '../utils/dataLoader';
import { DataService } from '../services/DataService';
import type { ContainmentGraph } from '../services/DataService';
import {
  SINGLE_VALUE_OWNER_TARGETS, ASSOCIATION_SLOTS,
  SKIP_SUBCLASS_EXPANSION, classifySlotEdge, subtreeOf, ENTITY_ROOT,
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

    // Rule 3 edges have no slot of their own to recompute from; the next test
    // derives them independently.
    const declared = graph.edges.filter(e => e.kind !== 'subclass' && e.inducedFrom === undefined);
    for (const e of declared) {
      const exp = expected.get([e.source, e.target, e.label].join('|'));
      expect(exp, `unexpected edge ${e.source}->${e.target} via ${e.label}`).toBeDefined();
      expect(e.flipped, `flip for ${e.label}`).toBe(exp!.flipped);
      expect(e.cardinality, `cardinality for ${e.label}`).toBe(exp!.cardinality);
      expect(e.kind, `kind for ${e.label}`).toBe(exp!.kind);
    }
    // and every expected edge was produced
    const produced = new Set(declared.map(e => [e.source, e.target, e.label].join('|')));
    for (const k of expected.keys()) {
      expect(produced.has(k), `missing expected edge ${k}`).toBe(true);
    }
  });

  test('Rule 3: a forward-owned range includes its subtree, as induced edges', async () => {
    /*
     * Siggie, 2026-09-10: "a class owning a parent necessarily owns all its
     * children as well". A slot ranged on a parent accepts any subclass, so
     * ObservationSet.observations holds MeasurementObservations too. Without
     * these edges a subclass nothing names directly is a root in the DAG and
     * lands in layer 0, dragging its merged box to the far left.
     *
     * Derived independently of the builder: from every declared forward edge,
     * walk the range's subclasses. Backward edges are deliberately NOT
     * induced (no own-bkwd range has subclasses today), nor is Entity.
     */
    const data = await loadModelData();
    const nodeIds = new Set(graph.nodes.map(n => n.id));
    const declaredKeys = new Set(graph.edges
      .filter(e => e.kind !== 'subclass' && e.inducedFrom === undefined)
      .map(e => [e.source, e.target, e.label].join('|')));
    const expected = new Map<string, string>();
    for (const e of graph.edges) {
      if (e.kind !== 'has-a' || e.flipped || e.isLoop || e.inducedFrom !== undefined) continue;
      if (e.target === ENTITY_ROOT) continue;
      for (const child of subtreeOf(data.graph, e.target)) {
        if (!nodeIds.has(child) || child === e.source) continue;
        const key = [e.source, child, e.label].join('|');
        if (!declaredKeys.has(key)) expected.set(key, e.target);
      }
    }
    const induced = graph.edges.filter(e => e.inducedFrom !== undefined);
    expect(new Map(induced.map(e => [[e.source, e.target, e.label].join('|'), e.inducedFrom!])))
      .toEqual(expected);
    for (const e of induced) {
      expect(e.kind).toBe('has-a');
      expect(e.flipped).toBe(false);
      expect(e.isLoop).toBe(false);
    }
    // Measured 2026-09-10: 3 declared edges induce 10 — Observation's and
    // QuestionnaireResponseValue's five children each, and none from
    // ImagingFile.derived_from → File, whose only subclass is ImagingFile
    // itself (a self-loop, skipped). A change here is a schema change (a new
    // subclass or a new parent-ranged slot), not a bug.
    expect(induced.length).toBe(10);
    expect(new Set(induced.map(e => e.inducedFrom))).toEqual(
      new Set(['Observation', 'QuestionnaireResponseValue']));
  });

  /*
   * ASSOCIATION_SLOTS is empty as of 2026-09-11 (TASKS `drop-association`
   * step 1), so this schema produces no association edge. The classifier
   * branch and the rendering it feeds are still present on purpose — see the
   * set's comment in containmentGraph.ts.
   *
   * Both shapes are asserted: that nothing is classified association today,
   * and that anything which WERE would still be ordered target-first. The
   * second half is what a restored association has to keep satisfying.
   */
  test('no association edges: the set is empty', () => {
    expect(ASSOCIATION_SLOTS.size).toBe(0);
    expect(graph.edges.filter(e => e.kind === 'association')).toEqual([]);
  });

  test('any association edge would still be ordered like own-bkwd', () => {
    for (const e of graph.edges) {
      if (e.kind !== 'association') continue;
      expect(e.flipped, e.label).toBe(true);
    }
  });

  /*
   * The two slots that used to be association are now plain Rule 1 forward
   * ownership. Named explicitly rather than swept, because the point is that
   * these specific verdicts changed and should not drift back silently.
   */
  test('the former association slots are forward ownership', () => {
    for (const slot of ['related_document', 'container'] as const) {
      const edges = graph.edges.filter(e => e.label === slot);
      expect(edges.length, slot).toBeGreaterThan(0);
      for (const e of edges) {
        expect(e.kind, slot).toBe('has-a');
        expect(e.verdict, slot).toBe('own-fwd');
        expect(e.flipped, slot).toBe(false);
      }
    }
  });

  /*
   * Why `Specimen.contained_in` is part of drop-association rather than a
   * separate cosmetic choice: it is the flip that keeps the graph acyclic.
   *
   * With `container` forward (Rule 1) and `contained_in` left backward
   * (Rule 2), the layering graph regains its only non-self cycle —
   * Specimen → SpecimenStorageActivity → SpecimenContainer → Specimen — which
   * is precisely what the association kind was introduced to break. Flipping
   * contained_in forward dissolves it, and Exception 2a justifies the flip
   * independently (a container has no existence apart from its specimen).
   *
   * This test recomputes BOTH variants from live slot data so it cannot go
   * stale against the schema, and fails if someone drops SpecimenContainer
   * from SINGLE_VALUE_OWNER_TARGETS without understanding the consequence.
   *
   * A cycle here is information rather than an emergency — the layering code
   * tolerates one (Siggie, 2026-09-11) — but it should never reappear by
   * accident.
   */
  test('contained_in must stay forward: reverting it reinstates the cycle', async () => {
    const data = await loadModelData();
    const nodeIds = new Set(graph.nodes.map(n => n.id));

    /** Layering edges (source drawn before target) under a given classifier. */
    const layeringEdges = (treatContainerAsValueObject: boolean) => {
      const out: Array<{ s: string; t: string; via: string }> = [];
      for (const cname of nodeIds) {
        for (const slot of getSlotEdgesForClass(data.graph, cname)) {
          if (!nodeIds.has(slot.range)) continue;
          let verdict = classifySlotEdge(slot.slotName, slot.range, slot.multivalued);
          if (!treatContainerAsValueObject && slot.range === 'SpecimenContainer'
              && !slot.multivalued) {
            verdict = 'own-bkwd';               // the pre-2026-09-11 verdict
          }
          const [s, t] = verdict === 'own-fwd'
            ? [cname, slot.range] : [slot.range, cname];
          if (s !== t) out.push({ s, t, via: `${cname}.${slot.slotName}` });
        }
      }
      return out;
    };

    const hasCycle = (edges: Array<{ s: string; t: string }>) => {
      const adj = new Map<string, string[]>();
      for (const e of edges) {
        if (!adj.has(e.s)) adj.set(e.s, []);
        adj.get(e.s)!.push(e.t);
      }
      const state = new Map<string, number>();     // 0 unseen, 1 on stack, 2 done
      let found = false;
      const visit = (n: string) => {
        state.set(n, 1);
        for (const next of adj.get(n) ?? []) {
          const st = state.get(next) ?? 0;
          if (st === 1) found = true;
          else if (st === 0) visit(next);
        }
        state.set(n, 2);
      };
      for (const n of nodeIds) if ((state.get(n) ?? 0) === 0) visit(n);
      return found;
    };

    expect(hasCycle(layeringEdges(true)), 'as shipped: acyclic').toBe(false);
    expect(hasCycle(layeringEdges(false)), 'contained_in reverted: cycle returns').toBe(true);
  });

  /*
   * Self-loops are rendered as a ⟲ marker on the slot's own row, never as a
   * routed edge, so they are invisible to layering. The count is pinned
   * because it has drifted once already and was otherwise re-derived by hand
   * every time someone wondered. 6 as measured 2026-08-31 and unchanged by
   * drop-association. A change here is a schema change, not a bug.
   */
  test('self-loop count is stable', () => {
    const loops = graph.edges.filter(e => e.isLoop);
    expect(new Set(loops.map(e => e.label))).toEqual(new Set([
      'derived_from', 'part_of', 'parent_specimen',
      'parent_container', 'index_time_point',
    ]));
    expect(loops.length).toBe(6);        // part_of occurs twice
  });

  test('SINGLE_VALUE_OWNER_TARGETS ranges are never flipped (forward ownership)', () => {
    for (const e of graph.edges.filter(e => e.kind === 'has-a')) {
      // an unflipped edge's range is its target; a flipped edge's range is its source
      const range = e.flipped ? e.source : e.target;
      if (SINGLE_VALUE_OWNER_TARGETS.has(range)) expect(e.flipped, `${e.label}->${range}`).toBe(false);
    }
  });

  /*
   * Rule 1 now has NO exceptions, so every multivalued slot runs forward.
   *
   * `BACKWARD_DESPITE_MULTIVALUED` held exactly one member —
   * `Specimen.parent_specimen`, a SELF-LOOP. A self-loop is rendered as a ⟲
   * marker on its own row and never emitted as a layering edge, so its
   * direction is unobservable and the rule bought nothing. Deleted 2026-09-11
   * with TASKS `ownership-rules`; the edge is now forward, and `parent_specimen`
   * is still in the pinned self-loop set below, where its visible behaviour is.
   */
  test('Rule 1 has no exceptions: every multivalued slot runs forward', () => {
    const mv = graph.edges.filter(
      e => e.kind === 'has-a' && e.cardinality.endsWith('..*'));
    expect(mv.length).toBeGreaterThan(20);
    for (const e of mv) expect(e.flipped, `${e.label} (${e.cardinality})`).toBe(false);
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
