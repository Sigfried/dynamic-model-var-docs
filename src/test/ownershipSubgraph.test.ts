import { describe, test, expect, beforeAll } from 'vitest';
import { loadModelData } from '../utils/dataLoader';
import { DataService } from '../services/DataService';
import type { OwnershipSubgraph } from '../services/DataService';
import { buildOwnershipDag } from '../models/ownershipSubgraph';

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

  test('ownership paths-to-root: every context node touches ownership structure', () => {
    // Context nodes exist only as (or on) ownership paths of selected nodes —
    // each must be incident to at least one ownership edge.
    const g = ds.getOwnershipSubgraph(['MeasurementObservation']);
    const touched = new Set<string>();
    for (const e of g.edges.filter(e => e.type === 'ownership' && !e.isLoop)) {
      touched.add(e.source);
      touched.add(e.target);
    }
    for (const n of g.nodes.filter(n => n.role === 'context')) {
      expect(touched.has(n.id), `context node ${n.id} touches no ownership edge`).toBe(true);
    }
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

  test('sunk layers: an owner sits directly above its topmost member', () => {
    // Person owns only Participant, so sinking puts it exactly one layer up —
    // not stranded at the root layer.
    const g = ds.getOwnershipSubgraph(['Participant']);
    const person = nodeById(g, 'Person')!;
    const participant = nodeById(g, 'Participant')!;
    expect(person.layer).toBe(participant.layer - 1);
  });

  test('layers are stable across selections (maxDepth over the full DAG)', () => {
    const a = ds.getOwnershipSubgraph(['MeasurementObservation']);
    const b = ds.getOwnershipSubgraph(['MeasurementObservation', 'Specimen', 'Condition']);
    for (const n of a.nodes) {
      const other = nodeById(b, n.id);
      if (other) expect(other.layer, n.id).toBe(n.layer);
    }
  });

  test('reference/isa edges need at least one explicitly-requested endpoint', () => {
    const sel = ['Specimen', 'BodySite'];
    const expansions = ['Assay'];
    const g = ds.getOwnershipSubgraph(sel, expansions);
    const core = new Set([...sel, ...expansions]);
    for (const e of g.edges.filter(e => e.type !== 'ownership')) {
      expect(
        core.has(e.source) || core.has(e.target),
        `${e.type} ${e.source}->${e.target} connects two pure-context nodes`,
      ).toBe(true);
    }
  });

  test('refs from a selected node to a visible context node are drawn', () => {
    // Participant.originating_site → Organization; Organization enters the
    // canvas as a context ancestor, and the ref should draw (the row shows
    // undimmed, so a missing edge would contradict the display).
    const g = ds.getOwnershipSubgraph(['Participant', 'MeasurementObservationSet']);
    if (g.nodes.some(n => n.id === 'Organization')) {
      expect(g.edges.some(e => e.slotName === 'originating_site' && e.target === 'Organization'))
        .toBe(true);
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

  test('every drawn edge slot has an attribute row on its storage-side node', () => {
    const g = ds.getOwnershipSubgraph(['Participant', 'Specimen', 'MeasurementObservation']);
    const byId = new Map(g.nodes.map(n => [n.id, n]));
    for (const e of g.edges.filter(e => e.type !== 'isa')) {
      const host = e.storageDirection === 'flipped' ? e.target : e.source;
      const slots = byId.get(host)!.slots;
      expect(slots.map(s => s.slot), `${host} should store ${e.slotName}`)
        .toContain(e.slotName);
    }
  });

  test('node slot lists are selection-independent', () => {
    const a = ds.getOwnershipSubgraph(['Participant']);
    const b = ds.getOwnershipSubgraph(['Participant', 'Specimen', 'Visit']);
    const pa = a.nodes.find(n => n.id === 'Participant')!;
    const pb = b.nodes.find(n => n.id === 'Participant')!;
    expect(pa.slots).toEqual(pb.slots);
    expect(pa.slots.length).toBeGreaterThan(0);
  });

  test('ownership cycles are self-loops only (no multi-node cycles)', () => {
    // buildOwnershipDag excludes self-loops before construction, so any
    // backedge supergroup reports would be a real A→…→A ownership cycle.
    // The renderer assumes there are none (layer(owner) < layer(member)
    // globally); if the schema ever grows one, this fails and the viz
    // needs a cycle treatment.
    const dag = buildOwnershipDag(ds.getContainmentGraph());
    expect(dag.backedges.map(b => `${b.parent.id}->${b.child.id}`)).toEqual([]);
  });

  test('nodes are sorted by layer then id', () => {
    const g = ds.getOwnershipSubgraph(['MeasurementObservation', 'Specimen']);
    const sorted = [...g.nodes].sort((a, b) => a.layer - b.layer || a.id.localeCompare(b.id));
    expect(g.nodes.map(n => n.id)).toEqual(sorted.map(n => n.id));
  });
});
