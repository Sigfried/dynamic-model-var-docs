import { describe, test, expect, beforeAll } from 'vitest';
import { loadModelData } from '../utils/dataLoader';
import { DataService, SKIP_SUBCLASS_EXPANSION } from '../services/DataService';
import type { AttributeSummary } from '../services/DataService';
import { buildViewModel, mergeSiblings } from '../explore/OwnershipGraphView';
import { isMergedId } from '../explore/siblingMerge';

/**
 * Edges surviving the sibling merge.
 *
 * This file exists because a real bug shipped invisibly: dropping every
 * child's copy of an inherited slot's edge on the theory that the parent
 * would contribute its own. The parent is usually NOT on the canvas, so the
 * edge vanished — selecting DimensionalObservation drew Organization,
 * Participant and Visit as unconnected boxes. Nothing in the suite touched
 * the merged edge path, so 247 tests stayed green.
 */
describe('merged-box edges', () => {
  let ds: DataService;

  beforeAll(async () => {
    ds = new DataService(await loadModelData());
  });

  /** The view's own pipeline: subgraph → view model → merge. */
  const merged = (sel: string[]) => {
    const sub = ds.getOwnershipSubgraph(sel);
    const plain = new Map(sub.nodes.map(n =>
      [n.id, ds.getClassSummary(n.id)?.slots ?? []] as const));
    const base = buildViewModel(sub, new Set(), id => plain.get(id) ?? []);
    const sameDef = (a: AttributeSummary, b: AttributeSummary) =>
      a.range === b.range && a.multivalued === b.multivalued;
    return mergeSiblings(
      base,
      id => ds.getClassSummary(id)?.parentId,
      p => !SKIP_SUBCLASS_EXPANSION.has(p),
      (classId, slot) => {
        const own = ds.getClassSummary(classId)?.slots.find(a => a.name === slot);
        if (!own) return undefined;
        if (!own.inheritedFrom) return classId;
        const inh = ds.getClassSummary(own.inheritedFrom)?.slots
          .find(a => a.name === slot);
        return inh && sameDef(own, inh) ? own.inheritedFrom : classId;
      },
      id => {
        const s = ds.getClassSummary(id);
        return { description: s?.description ?? '', abstract: s?.isAbstract ?? false };
      },
      (classId, slot) => {
        const i = ds.getClassSummary(classId)?.slots
          .findIndex(a => a.name === slot) ?? -1;
        return i < 0 ? Number.MAX_SAFE_INTEGER : i;
      },
      new Set(),
    );
  };

  test('no drawn node is left without an edge — the reported bug', () => {
    // The selection from the report, with the classes DimensionalObservation
    // points at now named explicitly: since 2026-08-27 nothing is drawn that
    // was not selected, so they no longer arrive on their own. The bug is the
    // same one either way — a drawn box with no edge is unexplained.
    const vm = merged([
      'DimensionalObservation', 'Organization', 'Participant', 'Visit',
    ]);
    const touched = new Set(vm.edges.flatMap(e => [e.source, e.target]));
    const stranded = vm.nodes.filter(n => !touched.has(n.id)).map(n => n.id);
    expect(stranded).toEqual([]);
  });

  test('an inherited slot draws ONE edge per box, not one per child', () => {
    // All five children inherit associated_visit unchanged. Before merging
    // that is five edges into what becomes a single anchor row. Visit is
    // selected because the edges only exist with both ends on the canvas.
    const vm = merged([
      'Observation', 'MeasurementObservation', 'SdohObservation',
      'DimensionalObservation', 'SpecimenQualityObservation',
      'SpecimenQuantityObservation', 'Visit',
    ]);
    const box = vm.nodes.find(n => isMergedId(n.id) && n.label === 'Observation');
    expect(box).toBeDefined();
    const visitEdges = vm.edges.filter(e =>
      e.slotName === 'associated_visit'
      && (e.source === box!.id || e.target === box!.id));
    expect(visitEdges).toHaveLength(1);
  });

  test('a slot_usage override keeps its own edge alongside the shared one', () => {
    // Each ObservationSet child narrows `observations` to its own Observation
    // subtype. Those are genuinely different relationships and must not
    // collapse into the parent's.
    // Both ends must be selected: an edge whose target is off-canvas is
    // filtered out of the subgraph before merging ever sees it.
    const vm = merged([
      'ObservationSet', 'MeasurementObservationSet', 'SdohObservationSet',
      'DimensionalObservationSet',
      'Observation', 'MeasurementObservation', 'SdohObservation',
      'DimensionalObservation',
    ]);
    const box = vm.nodes.find(n => isMergedId(n.id) && n.label === 'ObservationSet');
    const obs = vm.edges.filter(e =>
      e.slotName === 'observations'
      && (e.source === box!.id || e.target === box!.id));
    // One per narrowing child, plus the parent's own.
    expect(obs.length).toBeGreaterThan(1);
    // Each anchors on a DIFFERENT row, which is what keeps them distinct.
    const anchors = new Set(obs.map(e =>
      (e as { anchorClass?: string }).anchorClass));
    expect(anchors.size).toBe(obs.length);
  });

  test('a merged box shows every row — nothing is collapsed away', () => {
    // Siggie: "show all of them. let the box flow over bottom of page if
    // needed." A merged box is a comparison, so hiding the rows that differ
    // defeats it — and an unconnected child block rendered EMPTY, which reads
    // as "adds nothing" when it means "hidden".
    const vm = merged(['MeasurementObservation', 'SdohObservation']);
    const box = vm.nodes.find(n => isMergedId(n.id))!;
    expect(box.hiddenCount).toBe(0);
    // Every attribute row of allRows is displayed; rows also carries headers.
    const shown = box.rows.filter(r => !r.header);
    expect(shown).toHaveLength(box.allRows.length);
    // MeasurementObservation's 9 own slots are all present, connected or not.
    for (const slot of ['range_low', 'range_high', 'body_position', 'qualifier']) {
      expect(shown.some(r => r.slot === slot), `missing ${slot}`).toBe(true);
    }
  });

  test('every edge anchor resolves to a displayed row', () => {
    // rowY throws when an edge names a row the box does not show; that throw
    // blanks the canvas, so it is worth asserting directly.
    const vm = merged(['MeasurementObservation', 'SdohObservation']);
    const byId = new Map(vm.nodes.map(n => [n.id, n]));
    for (const e of vm.edges) {
      const host = e.storageDirection === 'flipped' ? e.target : e.source;
      const node = byId.get(host);
      expect(node, `host ${host} missing for ${e.id}`).toBeDefined();
      expect(
        node!.rows.some(r => r.slot === e.slotName && !r.header),
        `no row ${e.slotName} on ${host}`,
      ).toBe(true);
    }
  });
});
