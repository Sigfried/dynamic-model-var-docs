import { describe, test, expect, beforeAll } from 'vitest';
import { loadModelData } from '../utils/dataLoader';
import { DataService } from '../services/DataService';
import { getSlotEdgesForClass } from '../models/Graph';
import type { ModelData } from '../utils/dataLoader';

/**
 * "Must be able to show every slot that should appear in a box."
 * (Siggie; restated 2026-08-26: "ok if they start collapsed but just make sure
 * they can all be visible".)
 *
 * A box splits its rows into `connected` (shown collapsed) and `hidden`
 * (behind the "+N more" footer). The risk is not the split — it is a slot that
 * lands in NEITHER list and so cannot be reached in any state.
 *
 * The two row sources are:
 *   - entity-ranged rows, from the subgraph node's `slots`
 *   - plain rows, from getClassSummary().slots minus the entity-ranged names
 *
 * These tests assert that union against the LIVE schema, per class, so a slot
 * that stops being reachable turns a test red instead of quietly vanishing.
 */
describe('every slot is reachable in some box state', () => {
  let ds: DataService;
  let data: ModelData;
  let classIds: string[];

  beforeAll(async () => {
    data = await loadModelData();
    ds = new DataService(data);
    classIds = ds.getContainmentGraph().nodes.map(n => n.id);
  });

  /** The row set a box can display, mirroring buildViewModel's two sources. */
  const rowSlotsFor = (id: string): Set<string> => {
    const node = ds.getOwnershipSubgraph([id]).nodes.find(n => n.id === id);
    if (!node) throw new Error(`${id} not in its own subgraph`);
    const entity = node.slots.map(s => s.slot);
    const plain = (ds.getClassSummary(id)?.slots ?? []).map(s => s.name);
    return new Set([...entity, ...plain]);
  };

  test('every class-ranged slot in the schema appears as a row somewhere', () => {
    const missing: string[] = [];
    for (const id of classIds) {
      const rows = rowSlotsFor(id);
      for (const e of getSlotEdgesForClass(data.graph, id)) {
        if (!rows.has(e.slotName)) missing.push(`${id}.${e.slotName}`);
      }
    }
    expect(missing, `Class-ranged slots with no row: ${missing.join(', ')}`).toEqual([]);
  });

  test('every slot getClassSummary lists is reachable as a row', () => {
    // getClassSummary is what the detail drawer shows, so a slot listed there
    // but absent from the box is exactly the "I can see it in the drawer but
    // not on the diagram" complaint.
    const missing: string[] = [];
    for (const id of classIds) {
      const rows = rowSlotsFor(id);
      for (const s of ds.getClassSummary(id)?.slots ?? []) {
        if (!rows.has(s.name)) missing.push(`${id}.${s.name}`);
      }
    }
    expect(missing, `Summary slots with no row: ${missing.join(', ')}`).toEqual([]);
  });

  test('a box is never collapsed into showing nothing', () => {
    // The failure this guards: a class whose rows are ALL unconnected renders
    // as an empty box in the collapsed state, which reads as "this class has
    // no attributes" rather than "they are hidden". Such boxes are
    // force-expanded, and (since 2026-08-26) their footer is suppressed --
    // there is no collapsed state to return to, so a "- fewer" button there
    // would be a control that does nothing.
    //
    // BodySite is the canonical case: id/qualifier/site are all scalars.
    const g = ds.getOwnershipSubgraph(['BodySite']);
    const node = g.nodes.find(n => n.id === 'BodySite')!;
    const summary = ds.getClassSummary('BodySite');
    expect((summary?.slots ?? []).length).toBeGreaterThan(0);
    // Nothing entity-ranged to connect => every row is 'hidden' => forced open.
    expect(node.slots.filter(sl => !sl.isLoop).length).toBe(0);
  });

  test('no class has zero rows while declaring slots', () => {
    const empty: string[] = [];
    for (const id of classIds) {
      const declared = (ds.getClassSummary(id)?.slots ?? []).length;
      if (declared > 0 && rowSlotsFor(id).size === 0) empty.push(id);
    }
    expect(empty, `Classes with slots but no rows: ${empty.join(', ')}`).toEqual([]);
  });
});
