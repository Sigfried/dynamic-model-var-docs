import { describe, test, expect, afterEach } from 'vitest';
import { render, fireEvent, cleanup, screen } from '@testing-library/react';
import { RelationBar, type RelationRowVM } from '../explore/RelationBar';

/**
 * The relation popover groups rows by is-a family (Siggie, 2026-09-10:
 * Participant's 22 owned entities listed alphabetically hid that most of them
 * are one Observation family). A row whose class's parent has a row for the
 * same slot follows that row, marked; anything else keeps the flat order.
 */

/** Participant owns `other` through a slot `other` declares — the right side. */
const row = (other: string, slot: string, declaredBy = other): RelationRowVM => ({
  other, slot, declaredBy, position: 'owns-theirs', cardinality: '1..1', drawn: false,
});

const PARENT: Record<string, string | undefined> = {
  MeasurementObservation: 'Observation',
  SdohObservation: 'Observation',
  MeasurementObservationSet: 'ObservationSet',
  DrugExposure: 'Exposure',
};

function openRight(rows: RelationRowVM[], parentOf?: (id: string) => string | undefined) {
  render(
    <RelationBar label="Participant" rows={rows} onAdd={() => {}} onRemove={() => {}}
      parentOf={parentOf} />,
  );
  fireEvent.mouseEnter(screen.getByLabelText(/classes Participant owns/));
  return [...document.querySelectorAll('tbody tr')].map(tr => ({
    text: tr.textContent!.replace(/\s+/g, ' ').trim(),
    depth: Number(tr.getAttribute('data-family-depth')),
  }));
}

describe('relation popover: rows grouped by family', () => {
  afterEach(cleanup);

  test('children follow their parent row and are marked, whatever the alphabet says', () => {
    const rows = [
      row('Condition', 'associated_participant'),
      row('MeasurementObservation', 'associated_participant'),
      row('Observation', 'associated_participant'),
      row('SdohObservation', 'associated_participant'),
      row('Visit', 'associated_participant'),
    ];
    const got = openRight(rows, id => PARENT[id]);
    expect(got.map(g => g.depth)).toEqual([0, 0, 1, 1, 0]);
    // Alphabetical would put MeasurementObservation before Observation.
    expect(got.map(g => g.text.includes('↳'))).toEqual([false, false, true, true, false]);
    // The owned end reads `Class.slot`; the class before the dot is the other.
    const names = got.map(g => /([A-Z]\w*)\.associated_participant/.exec(g.text)![1]);
    expect(names).toEqual([
      'Condition', 'Observation', 'MeasurementObservation', 'SdohObservation', 'Visit',
    ]);
  });

  test('a child whose parent has no row for that slot stays flat', () => {
    // DrugExposure's parent Exposure is absent, and MeasurementObservationSet's
    // parent is present but through a DIFFERENT slot, so neither nests.
    const rows = [
      row('DrugExposure', 'associated_participant'),
      row('ObservationSet', 'associated_participant'),
      row('MeasurementObservationSet', 'some_other_slot'),
    ];
    const got = openRight(rows, id => PARENT[id]);
    expect(got.map(g => g.depth)).toEqual([0, 0, 0]);
    expect(got.some(g => g.text.includes('↳'))).toBe(false);
  });

  test('without parentOf the order is the plain sorted order', () => {
    const rows = [
      row('Observation', 'associated_participant'),
      row('MeasurementObservation', 'associated_participant'),
    ];
    const got = openRight(rows);
    expect(got.map(g => /([A-Z]\w*)\.associated_participant/.exec(g.text)![1]))
      .toEqual(['MeasurementObservation', 'Observation']);
    expect(got.every(g => g.depth === 0)).toBe(true);
  });
});
