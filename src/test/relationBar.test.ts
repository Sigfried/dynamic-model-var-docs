/**
 * The `←─ N   M ─→` bar's two axes, pinned against the real schema.
 *
 * These exist because the two axes were conflated repeatedly while the bar was
 * being designed (2026-09-04), in both directions, by both of us. They are
 * genuinely independent and the confusion is cheap to re-introduce:
 *
 *   SIDE  — which way the class sits on the canvas. Layout is owner-first, so
 *           everything that OWNS me is drawn to my left and everything I own
 *           to my right. This is what the two chip counts split on.
 *   KIND  — the edge's verdict, i.e. which end carries the arrowhead, i.e.
 *           which class declares the slot. This is what each ROW's little
 *           edge sample shows.
 *
 * The trap is assuming these are the same fact, which would make the row
 * samples redundant with the heading. They are not: BOTH kinds appear on BOTH
 * sides, and the tests below assert exactly that on real classes.
 */

import { describe, test, expect, beforeAll } from 'vitest';
import { loadModelData } from '../utils/dataLoader';
import { DataService } from '../services/DataService';
import { collectRelations } from '../models/ownershipSubgraph';
import { buildRelationRows } from '../explore/OwnershipGraphView';
import type { RelationRowVM } from '../explore/RelationBar';
import type { RelationPosition } from '../services/DataService';

/** Mirrors POSITION_AXIS in RelationBar.tsx. Duplicated deliberately: if the
 *  component's table is edited, this copy should have to be edited too. */
const AXIS: Record<RelationPosition, { side: 'left' | 'right'; kind: string }> = {
  'owned-mine': { side: 'left', kind: 'own-bkwd' },
  'owned-theirs': { side: 'left', kind: 'own-fwd' },
  'owns-mine': { side: 'right', kind: 'own-fwd' },
  'owns-theirs': { side: 'right', kind: 'own-bkwd' },
  'association': { side: 'left', kind: 'association' },
};

describe('relation bar axes', () => {
  let rowsFor: (cls: string) => RelationRowVM[];

  beforeAll(async () => {
    const ds = new DataService(await loadModelData());
    const all = collectRelations(ds.getContainmentGraph());
    rowsFor = (cls: string) =>
      buildRelationRows(all.get(cls) ?? [], () => false, id => id === cls);
  });

  const side = (rows: RelationRowVM[], s: 'left' | 'right') =>
    rows.filter(r => AXIS[r.position].side === s);
  const kindsOn = (rows: RelationRowVM[], s: 'left' | 'right') =>
    new Set(side(rows, s).map(r => AXIS[r.position].kind));

  test('the side is ownership: left = I belong to, right = I own', () => {
    const rows = rowsFor('Observation');
    const left = side(rows, 'left').map(r => r.other);
    const right = side(rows, 'right').map(r => r.other);

    // Observation belongs to these four: three because it points at them,
    // one because ObservationSet collects it.
    expect(new Set(left)).toEqual(
      new Set(['Organization', 'Participant', 'Visit', 'ObservationSet']),
    );
    // And owns these, all by its own attributes.
    expect(new Set(right)).toEqual(new Set(['Context', 'Entity', 'Quantity']));
  });

  test('BOTH edge kinds appear on the SAME side — the row glyph is not the heading', () => {
    // The whole reason each row draws its own edge sample. On Observation's
    // left, `ObservationSet.observations` is own-fwd while the other three
    // are own-bkwd; a reader cannot infer either one from the side.
    expect(kindsOn(rowsFor('Observation'), 'left'))
      .toEqual(new Set(['own-bkwd', 'own-fwd']));

    // And symmetrically on a right side: SpecimenContainer owns Specimen
    // (which points AT it, own-bkwd) and Substance (which it collects,
    // own-fwd).
    expect(kindsOn(rowsFor('SpecimenContainer'), 'right'))
      .toEqual(new Set(['own-bkwd', 'own-fwd']));
  });

  test('a row names the class that DECLARES the slot, which is not always the box', () => {
    const left = side(rowsFor('Observation'), 'left');
    const collected = left.find(r => r.other === 'ObservationSet');
    // Declared on ObservationSet, not on Observation — so the popover must
    // print the prefix rather than assume the box's own name.
    expect(collected).toMatchObject({
      declaredBy: 'ObservationSet',
      slot: 'observations',
      cardinality: '1..*',
    });

    const points = left.find(r => r.other === 'Participant');
    expect(points).toMatchObject({
      declaredBy: 'Observation',
      slot: 'associated_participant',
      cardinality: '1..1',
    });
  });

  test('association sits on the left: it is laid out target-first, like own-bkwd', () => {
    // Not an ownership claim — geometry. Specimen.related_document is the case.
    const left = side(rowsFor('Specimen'), 'left');
    const assoc = left.find(r => r.other === 'Document');
    expect(assoc?.position).toBe('association');
  });

  test('self-loops are excluded — they render as ⟲ row markers, not relations', () => {
    // Specimen.parent_specimen points at Specimen.
    expect(rowsFor('Specimen').some(r => r.other === 'Specimen')).toBe(false);
  });

  test('every position maps to a side and a kind', () => {
    // A new RelationPosition must be placed deliberately, not defaulted.
    const ds = new Set<string>();
    for (const cls of ['Observation', 'Specimen', 'Participant', 'Visit']) {
      for (const r of rowsFor(cls)) ds.add(r.position);
    }
    expect(ds.size).toBeGreaterThan(2);
    for (const p of ds) expect(AXIS[p as RelationPosition]).toBeDefined();
  });
});
