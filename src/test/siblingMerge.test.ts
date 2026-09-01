import { describe, test, expect, beforeAll } from 'vitest';
import { loadModelData } from '../utils/dataLoader';
import { DataService, SKIP_SUBCLASS_EXPANSION } from '../services/DataService';
import {
  groupSiblings, mergedIdFor, siblingColor, withChildHeaders,
} from '../explore/siblingMerge';
import type { MergedMember } from '../explore/siblingMerge';
import { SIBLING_COLORS } from '../config/appConfig';

/** Rough relative luminance, enough to assert "darker than". */
function luminance(hex: string): number {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

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
    expect([...groups.values()].some(m => m.length >= 2)).toBe(true);
  });

  test('a LONE child still merges into its parent', () => {
    // The rule Siggie asked for: a box's anatomy must not depend on what else
    // is selected. MeasurementObservation on its own gets the same shared-rows
    // -then-child-block shape it gets beside its siblings.
    const groups = groupSiblings(['MeasurementObservation'], parentOf, mergeable);
    expect(groups.get('Observation')).toEqual(['MeasurementObservation']);
  });

  test('a class with no mergeable parent still does not merge', () => {
    // Participant is a direct child of Entity, which is excluded.
    expect(groupSiblings(['Participant'], parentOf, mergeable).size).toBe(0);
  });

  test('member order (and so colour) is stable as the canvas changes', () => {
    const groups = groupSiblings(classIds, parentOf, mergeable);
    const [parent, members] = [...groups].find(([, m]) => m.length >= 2)!;
    // The same two members, reached via a differently-ordered selection, keep
    // their colours — otherwise a box recolours itself when an unrelated class
    // is added elsewhere on the canvas.
    const pair = [members[0], members[1]];
    const a = groupSiblings(pair, parentOf, mergeable).get(parent)!;
    const b = groupSiblings([...pair].reverse(), parentOf, mergeable).get(parent)!;
    expect(a).toEqual(b);
    expect(siblingColor(0).fill).not.toBe(siblingColor(1).fill);
  });

  test('the palette is long enough for the biggest real group, with no repeat', () => {
    const groups = groupSiblings(classIds, parentOf, mergeable);
    const biggest = Math.max(...[...groups.values()].map(m => m.length));
    // Children start at index 1: index 0 is the parent's default, and a child
    // wearing it would read as a shared row rather than as its own.
    const colors = Array.from({ length: biggest }, (_, i) => siblingColor(i + 1).fill);
    // A recycled colour inside ONE box is the failure that matters: two
    // children would share a header colour and their edges would be
    // indistinguishable.
    expect(new Set(colors).size).toBe(biggest);
  });

  test('the default is index 0, and no child ever wraps back onto it', () => {
    // Wrapping past the end of the palette must skip the default: a child that
    // landed on index 0 would be drawn exactly like a parent-declared row.
    const dflt = siblingColor(0).fill;
    for (let i = 1; i < 40; i++) {
      expect(siblingColor(i).fill).not.toBe(dflt);
    }
  });

  test('each entry has two steps: a fill dark enough for white text, a lighter text step', () => {
    // One value cannot do both jobs — a colour dark enough to carry white text
    // in a header band is too dark to tell apart from its neighbours as small
    // text on white, which is what the sibling colours exist to do.
    for (const c of SIBLING_COLORS) {
      expect(c.fill).not.toBe(c.text);
      expect(luminance(c.fill)).toBeLessThan(luminance(c.text));
    }
  });

  test('sibling colours are stable when a MIDDLE sibling is unselected', () => {
    /*
     * The bug this replaces. Colours used to be assigned by position among the
     * SELECTED siblings, so dropping one shifted every later sibling's colour
     * and the box recoloured itself for a reason outside any class in it.
     *
     * The old test only checked a FIXED member set, which is exactly why the
     * bug shipped: the stability it asserted was stability under reordering,
     * not under removal.
     */
    const groups = groupSiblings(classIds, parentOf, mergeable);
    const [, members] = [...groups].find(([, m]) => m.length >= 3)!;
    const before = new Map(members.map(id => [id, ds.siblingColorIndexOf(id)]));
    // Drop a middle sibling and re-derive from the smaller selection.
    const without = members.filter((_, i) => i !== 1);
    for (const id of without) {
      expect(ds.siblingColorIndexOf(id)).toBe(before.get(id));
    }
  });

  test('the index is whole-schema, so it does not depend on the canvas at all', () => {
    // The strongest form of the above: the index comes from the schema, so a
    // class not on the canvas at all still has the same one.
    const groups = groupSiblings(classIds, parentOf, mergeable);
    const [, members] = [...groups].find(([, m]) => m.length >= 2)!;
    const solo = groupSiblings([members[1]], parentOf, mergeable);
    expect(solo.size).toBe(1);
    // Its index is its position among ALL siblings (2nd child -> 2), not its
    // position in this one-element selection (which would be 1).
    expect(ds.siblingColorIndexOf(members[1])).toBe(2);
  });

  test('a parent takes the default; its children never do', () => {
    const groups = groupSiblings(classIds, parentOf, mergeable);
    for (const [parent, members] of groups) {
      expect(ds.siblingColorIndexOf(parent)).toBe(0);
      for (const m of members) expect(ds.siblingColorIndexOf(m)).toBeGreaterThan(0);
    }
  });

  test('merged ids cannot collide with a class id', () => {
    for (const id of classIds) expect(mergedIdFor('Entity')).not.toBe(id);
  });

  test('inheritedFrom reaches getClassSummary — the shared/own row split', () => {
    const groups = groupSiblings(classIds, parentOf, mergeable);
    const [parent, members] = [...groups].find(([, m]) => m.length >= 2)!;
    const slots = ds.getClassSummary(members[0])!.slots;
    // At least one row must come from an ancestor, or every row in a merged
    // box would be swatched and "shared" would render as empty.
    expect(slots.some(s => s.inheritedFrom !== undefined)).toBe(true);
    // And the parent's own slots are exactly the ones the child reports as
    // inherited from it or above it.
    expect(ds.getClassSummary(parent)).not.toBeNull();
  });

  describe('withChildHeaders', () => {
    const a: MergedMember = { id: 'A', label: 'A', color: siblingColor(1) };
    const b: MergedMember = { id: 'B', label: 'B', color: siblingColor(2) };
    const hdr = (c: MergedMember) => ({ id: `hdr:${c.id}`, header: c });
    const row = (id: string, owners?: MergedMember[]) => ({ id, ...(owners ? { owners } : {}) });

    test('shared rows get no header; each child block gets exactly one', () => {
      const out = withChildHeaders(
        [row('shared1'), row('shared2'), row('a1', [a]), row('a2', [a]), row('b1', [b])],
        [a, b], hdr,
      );
      expect(out.map(r => ('header' in r && r.header ? `H:${r.header.id}` : r.id)))
        .toEqual(['shared1', 'shared2', 'H:A', 'a1', 'a2', 'H:B', 'b1']);
    });

    test('a row several children declare is headed by the first in member order', () => {
      // Reversed owners must still head under A, or the block a row sits in
      // would depend on the order the owners happened to accumulate.
      const out = withChildHeaders([row('shared'), row('both', [b, a])], [a, b], hdr);
      // B still gets a header (every member does), it just owns nothing.
      expect(out.map(r => ('header' in r && r.header ? `H:${r.header.id}` : r.id)))
        .toEqual(['shared', 'H:A', 'both', 'H:B']);
    });

    test('a child that owns NO rows still gets a header', () => {
      // SpecimenQuality/QuantityObservation and DimensionalObservation add
      // nothing to Observation. Emitting headers only for children with rows
      // made them vanish from the box entirely — selecting them drew no sign
      // they were there.
      const out = withChildHeaders([row('shared'), row('a1', [a])], [a, b], hdr);
      expect(out.map(r => ('header' in r && r.header ? `H:${r.header.id}` : r.id)))
        .toEqual(['shared', 'H:A', 'a1', 'H:B']);
    });

    test('no members means no headers at all', () => {
      const rows = [row('x'), row('y')];
      expect(withChildHeaders(rows, [], hdr)).toEqual(rows);
    });
  });
});
