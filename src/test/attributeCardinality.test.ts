import { describe, test, expect, beforeAll } from 'vitest';
import { loadModelData } from '../utils/dataLoader';
import { DataService, cardinalityLabel } from '../services/DataService';

/**
 * Every attribute row carries a cardinality, drawn or not.
 *
 * The ownership view showed cardinality only on rows backed by a drawn edge,
 * because the label was attached to edges and `getClassSummary` re-parsed the
 * rendered Attributes table — which prints required/multivalued as 'Yes'/'No'
 * and so dropped the booleans. Scalar- and enum-ranged attributes are never
 * drawn, so they showed a blank cardinality forever; `Document.url` is `1..*`
 * and read as though it had no cardinality at all.
 *
 * Cardinality is a fact about the attribute, not about whether the row happens
 * to be connected to something, so it comes from the model now.
 */
describe('attribute cardinality', () => {
  let ds: DataService;

  beforeAll(async () => {
    ds = new DataService(await loadModelData());
  });

  const label = (classId: string, slotName: string) => {
    const s = ds.getClassSummary(classId)?.slots.find(x => x.name === slotName);
    return s ? cardinalityLabel(s.required, s.multivalued) : undefined;
  };

  test('cardinalityLabel covers the four LinkML combinations', () => {
    expect(cardinalityLabel(true, true)).toBe('+');
    expect(cardinalityLabel(false, true)).toBe('*');
    expect(cardinalityLabel(true, false)).toBe('1');
    expect(cardinalityLabel(false, false)).toBe('0..1');
  });

  test('scalar-ranged attributes have a cardinality, not a blank', () => {
    // Never drawn as edges, so these are exactly the rows that used to be blank.
    expect(label('Document', 'url')).toBe('+');          // required + multivalued
    expect(label('Document', 'identity')).toBe('*');
    expect(label('Document', 'id')).toBe('1');
    expect(label('Document', 'document_type')).toBe('0..1');
  });

  test('an Entity-ranged attribute has a cardinality even while undrawn', () => {
    // `Entity` is in EXCLUDE_HAS_A_TARGETS, so `focus` draws no edge today. The
    // cardinality must not depend on that — and must survive the exclusion
    // being lifted by the ownership-classification work.
    expect(label('Document', 'focus')).toBe('0..1');
    expect(label('ObservationSet', 'focus')).toBe('*');
  });

  /**
   * The one that actually pins the reported bug. The data being right is not
   * enough — the view built its unconnected rows with a hardcoded blank, so
   * this asserts the rows the graph renders, not just what DataService returns.
   */
  /**
   * The rows the ownership view builds come straight from these values, so
   * this covers the data the view reads. It does NOT cover the one line in
   * OwnershipGraphView that calls cardinalityLabel — that lives inside a
   * module-private buildViewModel, and rendering the component in jsdom does
   * not produce rows (layout is async via an ELK worker; see
   * useGraphLayout.test.ts). Exporting buildViewModel to reach it trips
   * react-refresh/only-export-components; extracting it into its own module
   * with the node-geometry constants it uses is the real fix, and is worth
   * doing when that file is next opened for other reasons.
   */
  test('the values the ownership rows are built from are complete', () => {
    const slots = ds.getClassSummary('Document')!.slots;
    expect(slots.length).toBeGreaterThan(0);
    for (const s of slots) {
      expect(cardinalityLabel(s.required, s.multivalued),
        `${s.name} would render a blank cardinality`).not.toBe('');
    }
  });

  test('every attribute of every class yields a cardinality', () => {
    const valid = new Set(['+', '*', '1', '0..1']);
    let checked = 0;
    for (const classId of ds.getItemNamesForType('class')) {
      for (const s of ds.getClassSummary(classId)?.slots ?? []) {
        expect(valid.has(cardinalityLabel(s.required, s.multivalued)),
          `${classId}.${s.name} produced no cardinality`).toBe(true);
        checked++;
      }
    }
    expect(checked).toBeGreaterThan(0);
  });

  /**
   * getClassSummary used to re-parse the rendered table. It now reads the model
   * directly, so this pins that the two still agree — a drift here would mean
   * the graph's rows and the Kitchen Sink table disagree about a class's
   * attributes.
   */
  test('summary slots match the rendered Attributes table, in order', () => {
    for (const classId of ['Document', 'ObservationSet', 'Participant', 'Visit']) {
      const summary = ds.getClassSummary(classId)!;
      const detail = ds.getDetailContent(classId);
      const table = detail.sections.find(s => s.sectionId === 'attributes');
      const rows = (table?.tableContent ?? []) as string[][];

      expect(rows.length, 'no rows compared - test would pass vacuously').toBeGreaterThan(0);
      expect(summary.slots.map(s => s.name)).toEqual(rows.map(r => r[0]));
      // Columns 3/4 are the 'Yes'/'No' renderings of the same booleans.
      expect(summary.slots.map(s => (s.required ? 'Yes' : 'No')))
        .toEqual(rows.map(r => r[3]));
      expect(summary.slots.map(s => (s.multivalued ? 'Yes' : 'No')))
        .toEqual(rows.map(r => r[4]));
    }
  });
});
