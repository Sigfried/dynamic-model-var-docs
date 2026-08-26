import { describe, test, expect, beforeAll } from 'vitest';
import { loadModelData } from '../utils/dataLoader';
import { DataService } from '../services/DataService';
import { DEFAULT_OWNER_CAP } from '../models/ownershipSubgraph';

/**
 * Owner chips as add/remove toggles, and the cap that decides which owners are
 * drawn (Siggie, 2026-08-25: "the fix for how many parents to show ... should
 * be a cap, and then the parent chips should be toggles allowing you to
 * add/remove").
 *
 * Two behaviours are asserted here because both were previously impossible:
 *
 * 1. `ownerCap` is a CAP, not an all-or-nothing gate. It used to read
 *    `owners.length <= ownerCap`, so BodySite (6 owners) drew ZERO under the
 *    default of 5 and looked unowned — the control worked backwards on
 *    exactly the crowded nodes you notice.
 * 2. `suppressedOwners` lets a drawn owner be dismissed. Expansion could not
 *    express this: a capped-in owner was never expanded, so there was no
 *    expansion to remove.
 */
describe('owner cap + suppression', () => {
  let ds: DataService;
  beforeAll(async () => { ds = new DataService(await loadModelData()); });

  const ownersOf = (id: string, opts = {}) => {
    const g = ds.getOwnershipSubgraph([id], [], opts);
    return {
      drawn: g.nodes.map(n => n.id).filter(x => x !== id),
      chipped: g.hiddenOwners.get(id) ?? [],
      reportedDrawn: g.drawnOwners.get(id) ?? [],
    };
  };

  test('drawnOwners reports exactly the owners that are on the canvas', () => {
    // The UI renders chips from drawnOwners + hiddenOwners and decides each
    // chip's on/off state from which list it came from. If drawnOwners
    // disagreed with the actual node set, chips would lie about what is drawn.
    const { drawn, reportedDrawn } = ownersOf('BodySite');
    expect([...reportedDrawn].sort()).toEqual([...drawn].sort());
  });

  test('dismissing a drawn owner REMOVES it — nothing takes its place', () => {
    // Siggie, 2026-08-26, on the earlier behaviour: "'I closed it and another
    // appeared' is not good". Closing something must mean it is gone. The cap
    // is a ceiling, not a quota to keep full, so the canvas simply drops below
    // it. Suppression is therefore applied AFTER the cap, not before.
    const before = ownersOf('BodySite');
    expect(before.drawn.length).toBe(DEFAULT_OWNER_CAP);

    const victim = before.drawn[0];
    const after = ownersOf('BodySite', { suppressedOwners: [victim] });

    expect(after.drawn).not.toContain(victim);
    expect(after.drawn.length).toBe(DEFAULT_OWNER_CAP - 1);
    // The rest are untouched — dismissing one owner does not reshuffle others.
    expect(after.drawn).toEqual(before.drawn.filter(o => o !== victim));
  });

  test('a suppressed owner stays chipped, never silently vanishes', () => {
    // The chip is the only way back, so a dismissed owner MUST remain listed.
    const { drawn } = ownersOf('BodySite');
    const after = ownersOf('BodySite', { suppressedOwners: drawn });
    for (const o of drawn) {
      expect(after.drawn).not.toContain(o);
      expect(after.chipped).toContain(o);
    }
  });

  test('dismissing every drawn owner empties the canvas of owners', () => {
    // The follow-on from the rule above: with nothing promoted, closing all
    // the drawn owners leaves none — and the chipped one that was never drawn
    // stays chipped rather than being pulled in.
    const first = ownersOf('BodySite');
    const after = ownersOf('BodySite', { suppressedOwners: first.drawn });
    expect(after.drawn).toEqual([]);
  });

  test('suppression never drops an owner from the union of both lists', () => {
    // The invariant that makes dismissal safe: chips + boxes always cover
    // every direct owner, whatever has been suppressed.
    const total = ownersOf('Quantity', { ownerCap: 0 }).chipped.length;
    expect(total).toBeGreaterThan(8);
    const some = ownersOf('Quantity', { ownerCap: 8 }).drawn.slice(0, 3);
    const after = ownersOf('Quantity', { ownerCap: 8, suppressedOwners: some });
    expect(after.drawn.length + after.chipped.length).toBe(total);
    for (const o of some) expect(after.chipped).toContain(o);
  });

  test('an explicitly expanded class outranks its suppression', () => {
    // ExploreApp clears the suppression on expand, but the model must not
    // depend on that: expansions are core nodes and are always drawn.
    const before = ownersOf('BodySite');
    const owner = before.drawn[0];
    const g = ds.getOwnershipSubgraph(['BodySite'], [owner], {
      suppressedOwners: [owner],
    });
    expect(g.nodes.map(n => n.id)).toContain(owner);
  });

  test('suppressing an unrelated class changes nothing', () => {
    const before = ownersOf('BodySite');
    const after = ownersOf('BodySite', { suppressedOwners: ['Questionnaire'] });
    expect(after.drawn.sort()).toEqual(before.drawn.sort());
    expect(after.chipped.sort()).toEqual(before.chipped.sort());
  });
  test('a class whose ownership edges are all FLIPPED still offers a way forward', () => {
    // Organization owns 14 things, but every edge is stored on the other class
    // (Observation.performed_by -> Organization), so its box has no rows for
    // them. Selecting it alone drew a lone box with nothing to click -- a dead
    // end, even though the tree showed "14". The downward chips are the fix.
    const g = ds.getOwnershipSubgraph(['Organization']);
    const node = g.nodes.find(n => n.id === 'Organization')!;
    expect(node.slots.filter(s => !s.flipped && !s.isLoop)).toEqual([]);
    expect((g.hiddenOwners.get('Organization') ?? []).length).toBe(0);
    // ...and yet there is somewhere to go.
    expect((g.hiddenOwned.get('Organization') ?? []).length).toBeGreaterThan(0);
  });

  test('owned chips disappear as their targets are added', () => {
    const before = ds.getOwnershipSubgraph(['Organization']);
    const target = (before.hiddenOwned.get('Organization') ?? [])[0];
    const after = ds.getOwnershipSubgraph(['Organization'], [target]);
    expect(after.nodes.map(n => n.id)).toContain(target);
    expect(after.hiddenOwned.get('Organization') ?? []).not.toContain(target);
  });
});
