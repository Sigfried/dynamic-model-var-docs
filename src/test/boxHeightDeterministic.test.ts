import { describe, test, expect, beforeAll } from 'vitest';
import { loadModelData } from '../utils/dataLoader';
import { DataService } from '../services/DataService';
import { buildViewModel } from '../explore/OwnershipGraphView';
import type { NodeVM } from '../explore/OwnershipGraphView';

/**
 * Box height is DETERMINISTIC — the fix behind replacing the chip strips.
 *
 * The strips were `flex-wrap`: the browser decided how many lines they took,
 * while the height was ESTIMATED IN JS from label widths so ELK had a number up
 * front. The two necessarily disagreed on some boxes, and where the estimate
 * was low the rows below overlapped the chips. Observation was the worst case
 * (13 owner chips over three wrapped lines).
 *
 * The estimate is gone: the relation band is one fixed line whatever the count,
 * so height is a pure function of the row count. These assert that from the
 * outside — no internal constants imported — so the invariant survives a
 * change to any of the individual sizes. It would break the moment anyone
 * reintroduced a band whose height is measured from text.
 */
describe('deterministic box height', () => {
  let ds: DataService;
  beforeAll(async () => { ds = new DataService(await loadModelData()); });

  const vmFor = (sel: string[]) =>
    buildViewModel(
      ds.getOwnershipSubgraph(sel), new Set(),
      c => ds.getClassSummary(c)?.slots ?? [],
      r => ds.getRangeColor(r),
    );

  /** Boxes alike in every input to the height formula except their relations. */
  const comparable = (nodes: NodeVM[]) => {
    const key = (n: NodeVM) =>
      `${n.rows.length}|${n.hiddenCount > 0}|${n.relationGroups.length > 0}`;
    const byKey = new Map<string, NodeVM[]>();
    for (const n of nodes) byKey.set(key(n), [...(byKey.get(key(n)) ?? []), n]);
    return byKey;
  };

  test('two boxes alike in row count agree on height, however they relate', () => {
    /*
     * The direct statement of the bug: box height used to vary with the number
     * and LENGTH OF THE OWNER NAMES, because the estimator counted characters
     * to guess how the strip would wrap. Organization (14 relations, all one
     * position) and a class with one relation now reserve the same band.
     */
    const vm = vmFor([
      'Organization', 'Observation', 'Specimen', 'Participant', 'Quantity',
      'Visit', 'Document', 'Condition',
    ]);
    for (const [k, group] of comparable(vm.nodes)) {
      const heights = new Set(group.map(n => n.height));
      expect(heights.size, `${k}: ${group.map(n => `${n.id}=${n.height}`).join(' ')}`).toBe(1);
    }
  });

  test('height is linear in row count — no text-dependent term', () => {
    // If any band were still measured from labels, the per-row delta between
    // two otherwise-alike boxes would not be constant.
    const vm = vmFor([
      'Organization', 'Observation', 'Specimen', 'Participant', 'Quantity',
      'Visit', 'Document', 'Condition', 'ResearchStudy', 'Person',
    ]);
    const withBand = vm.nodes.filter(n => n.relationGroups.length > 0 && n.hiddenCount === 0);
    const deltas = new Set<number>();
    for (const a of withBand) {
      for (const b of withBand) {
        if (a.rows.length === b.rows.length || !a.rows.length || !b.rows.length) continue;
        deltas.add((a.height - b.height) / (a.rows.length - b.rows.length));
      }
    }
    expect(deltas.size, `per-row height deltas: ${[...deltas].join(', ')}`).toBe(1);
  });

  test('the box that used to overlap now reserves one band like every other', () => {
    // Observation carried 13 owner chips over three wrapped lines in img-3.
    // It has the most relation groups of any class and still costs one band.
    const vm = vmFor(['Observation', 'Document']);
    const obs = vm.nodes.find(n => n.id === 'Observation')!;
    const doc = vm.nodes.find(n => n.id === 'Document');
    expect(obs.relationGroups.length).toBeGreaterThan(1);
    if (doc && doc.rows.length === obs.rows.length && doc.hiddenCount === obs.hiddenCount) {
      expect(obs.height).toBe(doc.height);
    }
    // Whatever else is true, the rows fit inside the box.
    for (const n of vm.nodes) expect(n.height).toBeGreaterThan(n.rows.length * 20);
  });
});
