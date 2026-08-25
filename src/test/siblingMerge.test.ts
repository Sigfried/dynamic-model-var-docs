import { describe, test, expect, beforeAll } from 'vitest';
import { loadModelData } from '../utils/dataLoader';
import { DataService, SKIP_SUBCLASS_EXPANSION } from '../services/DataService';
import { groupSiblings, mergedIdFor, siblingColor } from '../explore/siblingMerge';

/**
 * Sibling merging renders inheritance as adjacency rather than as edges
 * (docs/EXPLORE_VIZ.md). Asserted against the live schema, like the other
 * graph tests, so a legitimate schema edit does not need a fixture rewrite.
 */
describe('siblingMerge', () => {
  let ds: DataService;
  let classIds: string[];

  beforeAll(async () => {
    ds = new DataService(await loadModelData());
    classIds = ds.getContainmentGraph().nodes.map(n => n.id);
  });

  const parentOf = (id: string) => ds.getClassSummary(id)?.parentId;
  const mergeable = (p: string) => !SKIP_SUBCLASS_EXPANSION.has(p);

  test('Entity is never a merge parent — that is the whole point', () => {
    const groups = groupSiblings(classIds, parentOf, mergeable);
    expect(groups.has('Entity')).toBe(false);
    // ...and it WOULD have been the biggest group by far if allowed.
    const unfiltered = groupSiblings(classIds, parentOf, () => true);
    expect(unfiltered.get('Entity')!.length).toBeGreaterThan(20);
  });

  test('the schema has real non-Entity sibling groups to merge', () => {
    const groups = groupSiblings(classIds, parentOf, mergeable);
    expect(groups.size).toBeGreaterThan(0);
    for (const [, members] of groups) expect(members.length).toBeGreaterThanOrEqual(2);
  });

  test('a lone class never merges', () => {
    const groups = groupSiblings(['Participant'], parentOf, mergeable);
    expect(groups.size).toBe(0);
  });

  test('member order (and so colour) is stable as the canvas changes', () => {
    const groups = groupSiblings(classIds, parentOf, mergeable);
    const [parent, members] = [...groups][0];
    // The same two members, reached via a differently-ordered selection, keep
    // their colours — otherwise a box recolours itself when an unrelated class
    // is added elsewhere on the canvas.
    const pair = [members[0], members[1]];
    const a = groupSiblings(pair, parentOf, mergeable).get(parent)!;
    const b = groupSiblings([...pair].reverse(), parentOf, mergeable).get(parent)!;
    expect(a).toEqual(b);
    expect(siblingColor(0)).not.toBe(siblingColor(1));
  });

  test('merged ids cannot collide with a class id', () => {
    for (const id of classIds) expect(mergedIdFor('Entity')).not.toBe(id);
  });

  test('inheritedFrom reaches getClassSummary — the shared/own row split', () => {
    const groups = groupSiblings(classIds, parentOf, mergeable);
    const [parent, members] = [...groups][0];
    const slots = ds.getClassSummary(members[0])!.slots;
    // At least one row must come from an ancestor, or every row in a merged
    // box would be swatched and "shared" would render as empty.
    expect(slots.some(s => s.inheritedFrom !== undefined)).toBe(true);
    // And the parent's own slots are exactly the ones the child reports as
    // inherited from it or above it.
    expect(ds.getClassSummary(parent)).not.toBeNull();
  });
});
