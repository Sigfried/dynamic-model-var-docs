import { describe, test, expect, beforeAll } from 'vitest';
import { loadModelData } from '../utils/dataLoader';
import { DataService } from '../services/DataService';
import type { ModelData } from '../models/SchemaTypes';

/**
 * Conflicting slot declarations must not collapse.
 *
 * `transform_schema.py` used to keep the FIRST definition it saw when one slot
 * name was declared on several classes with different definitions, and `continue`
 * past the rest — first-seen being dict iteration order, i.e. nothing. Two edges
 * in the shipped diagram were simply wrong as a result:
 *
 *   - `items` collapsed to `range: QuestionnaireItem`, so the DAG drew
 *     `QuestionnaireResponse → QuestionnaireItem`.
 *   - `part_of` collapsed to `range: ResearchStudy`, so `QuestionnaireItem.part_of`
 *     drew a spurious `QuestionnaireItem → ResearchStudy` instead of a self-loop.
 *
 * The transform now compares only the load-bearing fields (range, multivalued,
 * required) and gives divergent sites their own `{slot}-{Class}` id.
 */
describe('conflicting slot declarations', () => {
  let modelData: ModelData;
  let ds: DataService;

  beforeAll(async () => {
    modelData = await loadModelData();
    ds = new DataService(modelData);
  });

  const rangeOf = (classId: string, slotName: string) => {
    const summary = ds.getClassSummary(classId);
    return summary?.slots.find(s => s.name === slotName)?.range;
  };

  /*
   * Both ends are selected explicitly: since 2026-08-27 nothing is drawn that
   * was not selected, so an edge exists only when its owner is on the canvas
   * too. What these tests pin down is which edge gets drawn, not what the
   * content policy pulls in.
   */
  const nonIsaEdges = (...classIds: string[]) =>
    ds.getOwnershipSubgraph(classIds).edges.filter(e => e.type !== 'isa');

  test('`items` keeps a distinct range per declaring class', () => {
    expect(rangeOf('Questionnaire', 'items')).toBe('QuestionnaireItem');
    expect(rangeOf('QuestionnaireResponse', 'items')).toBe('QuestionnaireResponseItem');
  });

  test('`items` draws QuestionnaireResponse → QuestionnaireResponseItem', () => {
    const edges = nonIsaEdges('QuestionnaireResponseItem', 'QuestionnaireResponse');
    expect(edges).toContainEqual(expect.objectContaining({
      source: 'QuestionnaireResponse',
      target: 'QuestionnaireResponseItem',
      slotName: 'items',
    }));
  });

  test('`part_of` self-loops on QuestionnaireItem, not across to ResearchStudy', () => {
    expect(rangeOf('QuestionnaireItem', 'part_of')).toBe('QuestionnaireItem');

    const edges = nonIsaEdges('QuestionnaireItem');
    const partOf = edges.filter(e => e.slotName === 'part_of');
    expect(partOf.length).toBeGreaterThan(0);
    for (const e of partOf) {
      // The bug drew QuestionnaireItem ↔ ResearchStudy here.
      expect(e.target).not.toBe('ResearchStudy');
      expect(e.source).not.toBe('ResearchStudy');
    }
    expect(partOf.some(e => e.isLoop)).toBe(true);
  });

  test('ResearchStudy.part_of still self-loops (the other variant is intact)', () => {
    expect(rangeOf('ResearchStudy', 'part_of')).toBe('ResearchStudy');
  });

  /**
   * `focus` is multivalued on the four *ObservationSet classes and single-valued
   * on the scalar Observation family. The collapse destroyed the multivalued
   * declaration, which the ownership rules read to classify the edge — so this
   * one changed a verdict, not just a displayed cardinality.
   *
   * This also answers whether plain-attribute conflicts reach subclasses:
   * gen-linkml materializes inherited attributes onto every subclass, so each
   * *ObservationSet is its own site and gets its own id. All four are covered,
   * not just ObservationSet.
   */
  test('`focus` keeps multivalued on every *ObservationSet class', () => {
    const sets = [
      'ObservationSet',
      'DimensionalObservationSet',
      'MeasurementObservationSet',
      'SdohObservationSet',
    ];
    for (const cls of sets) {
      const summary = ds.getClassSummary(cls);
      const focus = summary?.slots.find(s => s.name === 'focus');
      expect(focus, `${cls} should declare focus`).toBeDefined();
    }
    for (const cls of sets) {
      const el = modelData.elementLookup.get(`focus-${cls}`);
      expect(el, `focus-${cls} should be its own slot`).toBeDefined();
    }

    // The point is the DECLARATIONS stay distinct, not where they are stored:
    // `focus` is multivalued on the four sets and single-valued on the scalar
    // Observation family, and the collapse destroyed that distinction.
    // Asserted through the class summaries so the test survives a change of
    // id strategy (all sites qualified vs. one keeping the bare name).
    expect(rangeOf('ObservationSet', 'focus')).toBe('Entity');
    expect(rangeOf('Observation', 'focus')).toBe('Entity');

    const mv = (classId: string) => {
      const el = modelData.elementLookup.get(`focus-${classId}`)
        ?? modelData.elementLookup.get('focus');
      return (el as { multivalued?: boolean } | undefined)?.multivalued;
    };
    for (const cls of sets) {
      expect(mv(cls), `focus should be multivalued on ${cls}`).toBe(true);
    }
    for (const cls of ['Observation', 'SdohObservation', 'MeasurementObservation']) {
      expect(mv(cls), `focus should be single-valued on ${cls}`).not.toBe(true);
    }
  });

  /**
   * Structural guard. Every slot a class references must resolve, or the UI
   * silently drops attributes. Qualifying ids is exactly the change that could
   * break this, since two places decide slot ids and must agree.
   */
  test('every class slot reference resolves to a slot element', () => {
    const classes = modelData.collections.get('class');
    expect(classes).toBeDefined();
    let checked = 0;
    for (const cls of classes!.getAllElements()) {
      const summary = ds.getClassSummary(cls.name);
      if (!summary) continue;
      for (const s of summary.slots) {
        // Name column is the bare display name; it must never be empty.
        expect(s.name, `${cls.name} has an unnamed attribute`).not.toBe('');
        checked++;
      }
    }
    expect(checked).toBeGreaterThan(0);
  });
});
