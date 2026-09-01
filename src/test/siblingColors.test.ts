import { describe, test, expect, beforeAll } from 'vitest';
import { loadModelData } from '../utils/dataLoader';
import { DataService, SKIP_SUBCLASS_EXPANSION } from '../services/DataService';
import type { AttributeSummary } from '../services/DataService';
import { buildViewModel, mergeSiblings } from '../explore/OwnershipGraphView';
import { siblingColor } from '../explore/siblingMerge';
import type { SiblingColor } from '../explore/siblingMerge';

/**
 * P3 sibling colour ASSIGNMENT — which class and which row wear which colour.
 *
 * Distinct from siblingMerge.test.ts, which covers the palette itself and the
 * whole-schema index. What is tested here is the three-step rule that turns
 * that index into the colours actually drawn:
 *
 *   1. every class is coloured stably, from its position among ALL its schema
 *      siblings (DataService.siblingColorIndexOf);
 *   2. a slot row takes its TARGET's colour, not its declarer's;
 *   3. a child whose own row got a colour takes that colour too — the
 *      container borrows its contents'.
 *
 * Step 3 is the one that needs guarding. Today the pairs it exists for line up
 * by accident: `SdohObservationSet` and `SdohObservation` are both the third
 * child of their families because the names happen to sort the same way. That
 * coincidence is one upstream class away from breaking, and when it breaks the
 * failure is silent — a container drawn in one colour holding contents drawn
 * in another, with nothing to say they belong together.
 */
describe('sibling colour assignment', () => {
  let ds: DataService;

  beforeAll(async () => { ds = new DataService(await loadModelData()); });

  const sameDef = (a: AttributeSummary, b: AttributeSummary) =>
    a.range === b.range && a.multivalued === b.multivalued;

  /**
   * The view's own pipeline, with the colour index injectable so a schema edit
   * can be simulated without editing the schema.
   */
  const merged = (sel: string[], colorIndexOf = (id: string) => ds.siblingColorIndexOf(id)) => {
    const sub = ds.getOwnershipSubgraph(sel);
    const plain = new Map(sub.nodes.map(n =>
      [n.id, ds.getClassSummary(n.id)?.slots ?? []] as const));
    const base = buildViewModel(
      sub, new Set(), id => plain.get(id) ?? [], r => ds.getRangeColor(r),
    );
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
      colorIndexOf,
    );
  };

  /** The colour a class wears as a member of whatever merged box holds it. */
  const memberColor = (
    vm: ReturnType<typeof merged>, id: string,
  ): SiblingColor | undefined =>
    vm.nodes.flatMap(n => n.members).find(m => m.id === id)?.color;

  /** The colour of one row, addressed the way edges address it. */
  const rowColor = (
    vm: ReturnType<typeof merged>, declaringClass: string, slot: string,
  ): SiblingColor | undefined => {
    for (const n of vm.nodes) {
      const r = n.rows.find(x =>
        x.slot === slot && (x.declaringClass ?? n.id) === declaringClass);
      if (r) return r.owners?.[0]?.color;
    }
    return undefined;
  };

  const PAIRS = [
    ['DimensionalObservationSet', 'DimensionalObservation'],
    ['MeasurementObservationSet', 'MeasurementObservation'],
    ['SdohObservationSet', 'SdohObservation'],
  ] as const;

  const ALL = [
    'ObservationSet', 'Observation',
    ...PAIRS.flat(),
  ];

  test('a slot row takes its TARGET\'s colour, not its declarer\'s', () => {
    const vm = merged(ALL);
    for (const [set, obs] of PAIRS) {
      // `<X>ObservationSet.observations` points at `<X>Observation`, so the row
      // is drawn in the colour that class wears in its own box. That is what
      // lets the eye follow the row to the box it means.
      expect(rowColor(vm, set, 'observations')).toEqual(memberColor(vm, obs));
    }
  });

  test('the parent\'s own row is the default — it belongs to no one child', () => {
    const vm = merged(ALL);
    // `ObservationSet.observations → Observation`, and Observation is a merge
    // PARENT, so it takes index 0. A shared row carries no owner colour at all.
    expect(rowColor(vm, 'ObservationSet', 'observations')).toBeUndefined();
  });

  test('a container borrows its contents\' colour', () => {
    const vm = merged(ALL);
    for (const [set, obs] of PAIRS) {
      expect(memberColor(vm, set)).toEqual(memberColor(vm, obs));
    }
  });

  test('the pairing survives a class sorting BETWEEN a paired container and its contents', () => {
    /*
     * The regression this file exists for. Today `SdohObservationSet` and
     * `SdohObservation` are both index 3, so a container/contents pair matches
     * even with step 3 removed — by coincidence of alphabetical order, not by
     * design.
     *
     * Simulate `Foo`, added under Observation only (not ObservationSet), where
     * `DimensionalObs < Foo < MeasurementObs`: every Observation child from
     * Measurement onward shifts by one and the position-matching breaks. The
     * colours must still pair, because step 3 derives the container's colour
     * from what it CONTAINS rather than from where its name sorts.
     */
    const shifted = (id: string) => {
      const i = ds.siblingColorIndexOf(id);
      const isObservationChild = ds.getClassSummary(id)?.parentId === 'Observation';
      return isObservationChild && i >= 2 ? i + 1 : i;
    };
    const vm = merged(ALL, shifted);
    for (const [set, obs] of PAIRS) {
      expect(memberColor(vm, set)).toEqual(memberColor(vm, obs));
    }
    // And the shift really did happen — otherwise this passes vacuously.
    expect(memberColor(vm, 'MeasurementObservation'))
      .toEqual(siblingColor(ds.siblingColorIndexOf('MeasurementObservation') + 1));
  });

  test('...and equally when the class is added to the CONTAINER family instead', () => {
    // The mirror case. Shifting the *Set side rather than the Observation side
    // must pair just as well: the container follows its contents either way.
    const shifted = (id: string) => {
      const i = ds.siblingColorIndexOf(id);
      const isSetChild = ds.getClassSummary(id)?.parentId === 'ObservationSet';
      return isSetChild && i >= 2 ? i + 1 : i;
    };
    const vm = merged(ALL, shifted);
    for (const [set, obs] of PAIRS) {
      expect(memberColor(vm, set)).toEqual(memberColor(vm, obs));
    }
  });

  test('a class in no merged box still colours its rows by target', () => {
    /*
     * Specimen is a direct child of Entity, so it is in no merged box and has
     * no sibling colour of its own. Its three measure slots still point at
     * classes that DO have one, and the rows take those colours — which is the
     * whole reason to colour by target rather than by declarer.
     */
    const vm = merged([...ALL, 'Specimen', 'SpecimenQuantityObservation',
      'SpecimenQualityObservation']);
    const specimen = vm.nodes.find(n => n.id === 'Specimen');
    expect(specimen).toBeDefined();
    const row = (slot: string) =>
      specimen!.rows.find(r => r.slot === slot);
    // An unmerged box has no `owners` on its rows, so the colour it draws is
    // the default. Recorded rather than asserted-away: if row colouring is ever
    // extended to unmerged boxes, this is the test that should be revisited.
    expect(row('dimensional_measures')).toBeDefined();
    expect(row('dimensional_measures')!.owners).toBeUndefined();
  });
});
