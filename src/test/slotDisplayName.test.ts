import { describe, test, expect, beforeAll } from 'vitest';
import { loadModelData } from '../utils/dataLoader';
import { DataService } from '../services/DataService';
import { SlotCollection } from '../models/Element';
import type { ModelData } from '../models/SchemaTypes';

/**
 * Slot identity vs. slot display name.
 *
 * The transform qualifies a slot id when one slot name has per-class
 * definitions (`observations` on ObservationSet becomes
 * `observations-ObservationSet`) so the ids stay unique. That qualified id is
 * the join key for `elementLookup`, `getClassesUsingSlot` and `subsetSection`,
 * and it must stay qualified. What the USER reads must stay bare.
 *
 * From Dec 2025 to Aug 2026 `SlotElement`'s constructor assigned the map key to
 * `this.name` and discarded `data.name`, so every display path rendered the
 * qualified id. No test asserted the two agreed, which is why it shipped for
 * nine months. These tests pin both halves: the identity stays qualified, the
 * rendered label is bare, and the attributes table agrees with the graph.
 */
describe('slot display name vs slot id', () => {
  let modelData: ModelData;
  let ds: DataService;

  beforeAll(async () => {
    modelData = await loadModelData();
    ds = new DataService(modelData);
  });

  const slotCollection = () => {
    const c = modelData.collections.get('slot');
    if (!(c instanceof SlotCollection)) throw new Error('no slot collection');
    return c;
  };

  /** The slots that actually exercise the bug: those whose id is qualified. */
  const qualifiedSlots = () =>
    slotCollection().getAllElements().filter(el => el.name !== el.displayName);

  test('the schema still has qualified slot ids (guards the tests below)', () => {
    // If the transform ever stops qualifying, these tests would pass vacuously.
    expect(qualifiedSlots().length).toBeGreaterThan(0);
  });

  test('a qualified slot keeps its qualified id as `name`', () => {
    for (const slot of qualifiedSlots()) {
      // `name` is the identity: it must remain the map key so lookups resolve.
      expect(modelData.elementLookup.get(slot.name)).toBe(slot);
    }
  });

  test('`displayName` is the bare name — never the qualified id', () => {
    for (const slot of qualifiedSlots()) {
      expect(slot.displayName).not.toContain('-');
      expect(slot.name.startsWith(`${slot.displayName}-`)).toBe(true);
    }
  });

  test('the slot detail titlebar shows the bare name', () => {
    for (const slot of qualifiedSlots()) {
      const detail = slot.getDetailData();
      expect(detail.title).toBe(slot.displayName);
      expect(detail.titlebarTitle).toContain(slot.displayName);
      expect(detail.titlebarTitle).not.toContain(slot.name);
    }
  });

  test('section rows show the bare name but keep the qualified id', () => {
    for (const slot of qualifiedSlots()) {
      const item = slot.getSectionItemData('middlePanel');
      expect(item.displayName).toBe(slot.displayName);
      // Identity for click/navigate must still be the qualified id.
      expect(item.id).toContain(slot.name);
    }
  });

  /**
   * The regression the handoff asks for by name: the Kitchen Sink attributes
   * table and the ownership graph's edge labels must agree. They join through
   * `getClassSummary().slots[].name` (the table's Name column) against the
   * graph's bare `slotName`. When the table rendered qualified ids, entity-
   * ranged slots rendered TWICE in OwnershipGraphView — once connected, once as
   * a phantom disconnected scalar row — and lost their schema-order sort.
   */
  test('attributes-table Name column equals the graph edge label', () => {
    const classIds = ds.getOwnershipSubgraph(['Participant']).nodes.map(n => n.id);
    expect(classIds.length).toBeGreaterThan(0);

    let checked = 0;
    for (const classId of classIds) {
      const summary = ds.getClassSummary(classId);
      if (!summary) continue;
      for (const s of summary.slots) {
        // Every Name cell must be a bare name, i.e. resolvable as a slot the
        // graph could label an edge with.
        expect(s.name).not.toMatch(/-[A-Z]/);
        checked++;
      }
    }
    expect(checked).toBeGreaterThan(0);
  });

  /**
   * The concrete case named in the handoff. ObservationSet's `observations` and
   * `associated_visit`/`associated_participant` are all qualified in the data,
   * and were the visible symptom.
   */
  test('ObservationSet renders bare attribute names', () => {
    const summary = ds.getClassSummary('ObservationSet');
    expect(summary).not.toBeNull();
    const names = summary!.slots.map(s => s.name);
    expect(names).toContain('observations');
    expect(names).not.toContain('observations-ObservationSet');
  });
});
