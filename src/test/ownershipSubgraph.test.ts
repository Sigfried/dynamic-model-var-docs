import { describe, test, expect, beforeAll } from 'vitest';
import { loadModelData } from '../utils/dataLoader';
import { DataService } from '../services/DataService';
import type { OwnershipSubgraph } from '../services/DataService';

/**
 * getOwnershipSubgraph() drives the Explore viz (docs/EXPLORE_VIZ.md). Like
 * the containment tests, we assert properties against the live schema rather
 * than pinning fixtures, so the suite survives legitimate schema edits.
 */
describe('getOwnershipSubgraph', () => {
  let ds: DataService;

  beforeAll(async () => {
    ds = new DataService(await loadModelData());
  });

  const nodeById = (g: OwnershipSubgraph, id: string) =>
    g.nodes.find(n => n.id === id);

  test('selected nodes are role:selected; everything else is context', () => {
    const sel = ['Participant', 'Condition'];
    const g = ds.getOwnershipSubgraph(sel);
    for (const n of g.nodes) {
      expect(n.role).toBe(sel.includes(n.id) ? 'selected' : 'context');
    }
    for (const id of sel) expect(nodeById(g, id)).toBeDefined();
  });

  test('ownership paths-to-root: context nodes chain up to a root', () => {
    // Every context node must reach a layer-0 node by following ownership
    // edges upward, and selected nodes must connect into that structure.
    const g = ds.getOwnershipSubgraph(['MeasurementObservation']);
    const ownersOf = new Map<string, string[]>();
    for (const e of g.edges.filter(e => e.type === 'ownership' && !e.isLoop)) {
      ownersOf.set(e.target, [...(ownersOf.get(e.target) ?? []), e.source]);
    }
    for (const n of g.nodes) {
      if (n.layer === 0) continue;
      expect(ownersOf.get(n.id)?.length, `${n.id} (layer ${n.layer}) has no in-edge`)
        .toBeGreaterThan(0);
    }
    expect(g.nodes.some(n => n.layer === 0)).toBe(true);
  });

  test('poly-parent case: Participant has ≥2 ownership in-edges (Person + ResearchStudy)', () => {
    const g = ds.getOwnershipSubgraph(['Participant']);
    const owners = g.edges
      .filter(e => e.type === 'ownership' && e.target === 'Participant' && !e.isLoop)
      .map(e => e.source);
    expect(owners).toContain('Person');
    expect(owners).toContain('ResearchStudy');
  });

  test('owners sit above members: non-loop ownership edges go down layers', () => {
    const g = ds.getOwnershipSubgraph(
      ['Participant', 'MeasurementObservationSet', 'MeasurementObservation', 'Specimen'],
    );
    for (const e of g.edges.filter(e => e.type === 'ownership' && !e.isLoop)) {
      const s = nodeById(g, e.source)!;
      const t = nodeById(g, e.target)!;
      expect(s.layer, `${e.source}(${s.layer}) -> ${e.target}(${t.layer}) via ${e.slotName}`)
        .toBeLessThan(t.layer);
    }
  });

  test('layers are stable across selections (maxDepth over the full DAG)', () => {
    const a = ds.getOwnershipSubgraph(['MeasurementObservation']);
    const b = ds.getOwnershipSubgraph(['MeasurementObservation', 'Specimen', 'Condition']);
    for (const n of a.nodes) {
      const other = nodeById(b, n.id);
      if (other) expect(other.layer, n.id).toBe(n.layer);
    }
  });

  test('reference and isa edges only connect explicitly-requested nodes', () => {
    const sel = ['Specimen', 'BodySite'];
    const expansions = ['Assay'];
    const g = ds.getOwnershipSubgraph(sel, expansions);
    const core = new Set([...sel, ...expansions]);
    for (const e of g.edges.filter(e => e.type !== 'ownership')) {
      expect(core.has(e.source), `${e.type} ${e.source}->${e.target}`).toBe(true);
      expect(core.has(e.target), `${e.type} ${e.source}->${e.target}`).toBe(true);
    }
  });

  test('every edge endpoint is a returned node', () => {
    const g = ds.getOwnershipSubgraph(['QuestionnaireResponse', 'Participant'], ['Questionnaire']);
    const ids = new Set(g.nodes.map(n => n.id));
    for (const e of g.edges) {
      expect(ids.has(e.source), e.source).toBe(true);
      expect(ids.has(e.target), e.target).toBe(true);
    }
  });

  test('expansions appear as context nodes', () => {
    const g = ds.getOwnershipSubgraph(['Specimen'], ['Assay']);
    expect(nodeById(g, 'Assay')?.role).toBe('context');
  });

  test('flipped ownership edges are marked for re-verbed labels', () => {
    // associated_person: Person owns Participant, stored member-side.
    const g = ds.getOwnershipSubgraph(['Participant']);
    const e = g.edges.find(e => e.slotName === 'associated_person');
    expect(e).toBeDefined();
    expect(e!.type).toBe('ownership');
    expect(e!.storageDirection).toBe('flipped');
    expect(e!.source).toBe('Person');
    expect(e!.target).toBe('Participant');
  });

  test('self-loops are flagged, not layer violations', () => {
    // ResearchStudy part_of ResearchStudy
    const g = ds.getOwnershipSubgraph(['ResearchStudy']);
    const loops = g.edges.filter(e => e.isLoop);
    expect(loops.length).toBeGreaterThan(0);
    for (const e of loops) expect(e.source).toBe(e.target);
  });

  test('isolated classes are selectable and come back alone', () => {
    const g = ds.getOwnershipSubgraph(['Demography']);
    expect(nodeById(g, 'Demography')).toBeDefined();
  });

  test('unknown ids fail loudly', () => {
    expect(() => ds.getOwnershipSubgraph(['NoSuchClass'])).toThrow(/NoSuchClass/);
    expect(() => ds.getOwnershipSubgraph(['Specimen'], ['NopeToo'])).toThrow(/NopeToo/);
  });

  test('nodes are sorted by layer then id', () => {
    const g = ds.getOwnershipSubgraph(['MeasurementObservation', 'Specimen']);
    const sorted = [...g.nodes].sort((a, b) => a.layer - b.layer || a.id.localeCompare(b.id));
    expect(g.nodes.map(n => n.id)).toEqual(sorted.map(n => n.id));
  });
});
