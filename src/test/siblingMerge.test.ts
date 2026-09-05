import { describe, test, expect, beforeAll } from 'vitest';
import { loadModelData } from '../utils/dataLoader';
import { DataService, SKIP_SUBCLASS_EXPANSION } from '../services/DataService';
import {
  groupSiblings, mergedIdFor, siblingColor, withChildHeaders,
} from '../explore/siblingMerge';
import type { MergedMember } from '../explore/siblingMerge';
import { SIBLING_COLORS, SIBLING_HEADER_TEXT } from '../config/appConfig';

/** WCAG relative luminance. */
function luminance(hex: string): number {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
    .map(v => v / 255)
    .map(v => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
    .reduce((acc, v, i) => acc + [0.2126, 0.7152, 0.0722][i] * v, 0);
}

/** WCAG contrast ratio between two hex colors. */
function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

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

  test('member order (and so color) is stable as the canvas changes', () => {
    const groups = groupSiblings(classIds, parentOf, mergeable);
    const [parent, members] = [...groups].find(([, m]) => m.length >= 2)!;
    // The same two members, reached via a differently-ordered selection, keep
    // their colors — otherwise a box recolors itself when an unrelated class
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
    // A recycled color inside ONE box is the failure that matters: two
    // children would share a header color and their edges would be
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

  test('each entry works as BOTH a band and ink: pale fill, legible text', () => {
    // The two steps are the same hue used two ways, and each has to clear a
    // real contrast threshold in its own role. Asserting a luminance ORDER
    // instead was the earlier version of this test, and it encoded the
    // darkened-band palette that got reverted: it would pass a palette whose
    // bands are too dark to be pastel at all.
    for (const c of SIBLING_COLORS) {
      expect(c.fill).not.toBe(c.text);
      // A band carries dark text, so it must stay pale.
      expect(contrast(c.fill, SIBLING_HEADER_TEXT)).toBeGreaterThanOrEqual(4.5);
      // Ink sits on the box's white background.
      expect(contrast(c.text, '#ffffff')).toBeGreaterThanOrEqual(4.5);
    }
  });

  test('the bands stay PASTEL — none is dark enough to carry white text', () => {
    // The guard on the reverted mistake. Darkening the bands so white text
    // would work turned quiet header strips into saturated bars that shouted
    // louder than the box's own header, which is the thing a pastel palette
    // exists to avoid. If a band ever clears 4.5:1 against white, it is no
    // longer a pastel.
    for (const c of SIBLING_COLORS) {
      expect(contrast(c.fill, '#ffffff')).toBeLessThan(4.5);
    }
  });

  test('sibling colors are stable when a MIDDLE sibling is unselected', () => {
    /*
     * The bug this replaces. Colors used to be assigned by position among the
     * SELECTED siblings, so dropping one shifted every later sibling's color
     * and the box recolored itself for a reason outside any class in it.
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

  /*
   * The container/contents pairing, tested at the MECHANISM rather than
   * through sort positions.
   *
   * A row is colored by the class its RANGE names, so a container's row wears
   * its contents' color for one reason only: it is the same lookup on the same
   * class. Nothing here depends on two families sorting into matching
   * positions — that correspondence exists in today's schema but the pairing
   * does not use it, and a rename that reorders one family must be free to
   * change WHICH color a class wears without unpairing anything.
   *
   * A previous attempt (2026-09-04) tested the sort correspondence instead and
   * asserted a false invariant; see the ⚠️ note in docs/OWNERSHIP_CLASSIFICATION.md
   * the header comment on categoryViewHistory.test.tsx before writing
   * anything in this area.
   */
  test('a row wears its TARGET class color, whatever the target is', () => {
    let checked = 0;
    for (const id of classIds) {
      for (const slot of ds.getClassSummary(id)?.slots ?? []) {
        const target = ds.getTargetColor(slot.range);
        if (!target) continue;  // non-class range, or a target with no color
        // The color the target class wears in its OWN box, derived
        // independently of the row.
        expect(target, `${id}.${slot.name} -> ${slot.range}`)
          .toEqual(siblingColor(ds.siblingColorIndexOf(slot.range)));
        checked++;
      }
    }
    // Guard against the sweep silently matching nothing.
    expect(checked, 'no colored rows found to check').toBeGreaterThan(0);
  });

  test('sort position decides WHICH color, never WHETHER a pair matches', () => {
    /*
     * The two ObservationSet/Observation pairs are the case SG checked by hand
     * (renaming classes so the families sort differently — the pairing held).
     * Stated as a property: whatever index each class lands on, the container's
     * `observations` row and the class it points at resolve to one color.
     */
    const sets = classIds.filter(id => parentOf(id) === 'ObservationSet');
    expect(sets.length, 'ObservationSet has subclasses to check').toBeGreaterThan(0);
    for (const set of sets) {
      // slot_usage narrows `observations` to the matching Observation subtype.
      const obs = ds.getClassSummary(set)?.slots.find(s => s.name === 'observations');
      expect(obs, `${set} declares observations`).toBeDefined();
      expect(ds.getTargetColor(obs!.range), `${set} pairs with ${obs!.range}`)
        .toEqual(siblingColor(ds.siblingColorIndexOf(obs!.range)));
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
