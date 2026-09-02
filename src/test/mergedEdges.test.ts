import { describe, test, expect, beforeAll } from 'vitest';
import { loadModelData } from '../utils/dataLoader';
import { DataService, SKIP_SUBCLASS_EXPANSION } from '../services/DataService';
import type { AttributeSummary } from '../services/DataService';
import { buildViewModel, mergeSiblings, buildSpec } from '../explore/OwnershipGraphView';
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
    const base = buildViewModel(
      sub, new Set(), id => plain.get(id) ?? [], r => ds.getRangeColor(r), r => ds.getTargetColor(r),
    );
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
      id => ds.siblingColorIndexOf(id),
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

  test('edges anchored on different rows get different PORTS', () => {
    /**
     * The anchor test above passed all along while the bug was live: the view
     * model was right and the failure was one step later, in buildSpec. The
     * row port id was keyed on `${host}::row:${slot}` — the slot NAME alone —
     * so a merged box's parent row and its children's overrides all claimed
     * one id. addPort keeps the first registration per id, so every later
     * edge silently inherited the first one's y and left the wrong row.
     *
     * Visible as: all three coloured `observations` edges leaving one row
     * instead of their own. Which row won depended only on enumeration order
     * (the parent's when Observation was selected, DimensionalObservationSet's
     * when it was not), which is why it looked like two different bugs.
     *
     * Assert on the ports, not the anchors — that is the layer that broke.
     */
    const vm = merged([
      'ObservationSet', 'MeasurementObservationSet', 'SdohObservationSet',
      'DimensionalObservationSet',
      'Observation', 'MeasurementObservation', 'SdohObservation',
      'DimensionalObservation',
    ]);
    const box = vm.nodes.find(n => isMergedId(n.id) && n.label === 'ObservationSet')!;
    const spec = buildSpec(vm, 'RIGHT');
    const obs = vm.edges.filter(e =>
      e.slotName === 'observations' && e.source === box.id);
    expect(obs.length).toBeGreaterThan(1);

    const specById = new Map(spec.edges.map(e => [e.id, e]));
    const ports = obs.map(e => specById.get(e.id)?.sourcePort);
    expect(ports.every(p => p !== undefined)).toBe(true);
    // One distinct port per edge: this is the assertion the old id failed.
    expect(new Set(ports).size).toBe(obs.length);

    // And each port sits at a distinct y — the symptom users actually saw.
    const boxPorts = new Map(
      (spec.nodes.find(n => n.id === box.id)?.ports ?? []).map(p => [p.id, p.y]));
    const ys = ports.map(p => boxPorts.get(p!));
    expect(new Set(ys).size).toBe(obs.length);
  });

  const OBS_ALL = [
    'ObservationSet', 'MeasurementObservationSet', 'SdohObservationSet',
    'DimensionalObservationSet',
    'Observation', 'MeasurementObservation', 'SdohObservation',
    'DimensionalObservation',
  ];

  test('a narrowed edge lands on its CHILD header, not the box header', () => {
    /*
     * `<X>ObservationSet.observations` is narrowed by slot_usage to
     * `<X>Observation`. Landing all of them on the merged Observation box's
     * header says only "an Observation", which is the one thing the narrowing
     * exists to refine — each set holds its OWN kind.
     *
     * Four arrival rows expected: the three children, plus Observation itself
     * carrying the un-narrowed `ObservationSet.observations` on the parent row.
     */
    const vm = merged(OBS_ALL);
    const spec = buildSpec(vm, 'RIGHT');
    const target = vm.nodes.find(n => isMergedId(n.id) && n.label === 'Observation')!;
    const specById = new Map(spec.edges.map(e => [e.id, e]));
    const arriving = vm.edges.filter(e => e.target === target.id);
    expect(arriving.length).toBe(4);

    const onChild = arriving.filter(e =>
      specById.get(e.id)?.targetPort?.includes('::mhdr:'));
    // Three narrowed, one un-narrowed on the box header.
    expect(onChild.length).toBe(3);
    expect(arriving.length - onChild.length).toBe(1);

    // Each child-header port sits at the y of that member's header ROW, which
    // is below the box header band — the visible point of the whole change.
    const ports = new Map(
      (spec.nodes.find(n => n.id === target.id)?.ports ?? []).map(p => [p.id, p.y]));
    const headerBandY = Math.min(...arriving
      .map(e => specById.get(e.id)!.targetPort!)
      .filter(p => !p.includes('::mhdr:'))
      .map(p => ports.get(p)!));
    for (const e of onChild) {
      expect(ports.get(specById.get(e.id)!.targetPort!)!)
        .toBeGreaterThan(headerBandY);
    }
  });

  test('GUARD: no two edges arrive at the same child-header row', () => {
    /*
     * This is a SCHEMA assertion wearing a test's clothing, and a failure here
     * does NOT mean the code broke.
     *
     * Child-header arrivals skip convergence merging entirely and draw their
     * own arrowhead, which is only safe because no member of a multi-child
     * family currently has more than one inbound edge (measured 2026-08-31,
     * re-measured 2026-09-02). If this fails, the schema grew a second slot
     * narrowing to the same child: the shortcut no longer holds and
     * `mergeTargets` must become row-aware — key on arrival row, take the
     * position from the row's y instead of HEADER_H/2.
     *
     * Do not "fix" this by deleting the assertion.
     */
    const vm = merged(OBS_ALL);
    const spec = buildSpec(vm, 'RIGHT');
    const seen = new Map<string, number>();
    for (const e of spec.edges) {
      const p = e.targetPort;
      if (!p?.includes('::mhdr:')) continue;
      seen.set(p, (seen.get(p) ?? 0) + 1);
    }
    expect(seen.size).toBeGreaterThan(0);        // the case must be exercised
    for (const [port, n] of seen) {
      expect(`${port} carries ${n}`).toBe(`${port} carries 1`);
    }
  });

  test('a child-header edge takes no fan lane', () => {
    /*
     * Both fan passes must agree on the exclusion. Counting a row-targeted
     * edge in `freeEndTotal` but not assigning it a slot (or the reverse)
     * reserves a lane nothing uses and mis-centres every edge that does.
     *
     * Observable as: the box-header ports on the merged Observation box are
     * centred on the header band. With one un-narrowed arrival, that single
     * lane must sit exactly at the band's midpoint.
     */
    const vm = merged(OBS_ALL);
    const spec = buildSpec(vm, 'RIGHT');
    const target = vm.nodes.find(n => isMergedId(n.id) && n.label === 'Observation')!;
    const boxPorts = (spec.nodes.find(n => n.id === target.id)?.ports ?? [])
      .filter(p => p.id.includes('::hdr:in:'));
    expect(boxPorts.length).toBe(1);
    /*
     * A lone lane is centred on the header band. Had the three narrowed edges
     * been counted by `freeEndTotal` without taking a slot, this port would be
     * one of four lanes and sit ABOVE centre.
     *
     * Asserted against the same box WITHOUT its narrowed arrivals rather than
     * against HEADER_H, which is a private layout constant: selecting only the
     * parent pair leaves exactly one box-header arrival, and a correct
     * exclusion puts both at the identical y.
     */
    const solo = buildSpec(merged(['ObservationSet', 'Observation']), 'RIGHT');
    const soloTarget = solo.nodes.find(n =>
      n.id.endsWith('::Observation') || n.id === 'Observation')!;
    const soloPort = (soloTarget.ports ?? [])
      .find(p => p.id.includes('::hdr:in:'))!;
    expect(soloPort).toBeDefined();
    expect(boxPorts[0].y).toBe(soloPort.y);
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
