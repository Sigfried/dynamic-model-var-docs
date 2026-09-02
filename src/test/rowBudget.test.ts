import { describe, test, expect, beforeAll } from 'vitest';
import { loadModelData } from '../utils/dataLoader';
import { DataService } from '../services/DataService';
import { buildViewModel } from '../explore/OwnershipGraphView';

/**
 * What a COLLAPSED box shows.
 *
 * Until 2026-08-28 the rule was "only the connected rows" — the ones with an
 * edge. That hid too much: Person has nine attributes and one of them
 * (`cause_of_death`) is entity-ranged, so a collapsed Person was a single row
 * plus `+ 8 more attributes`, a box that said almost nothing about the class it
 * names (Siggie, screenshot). Collapsing exists to cap TALL boxes, so it should
 * cap them and leave short ones alone.
 *
 * The rule now is a row budget, filled connected-first. These tests pin the
 * three things that can go wrong with that: a short box getting a footer it
 * does not need, a long box not being capped, and a connected row being cut —
 * which matters beyond looks, because an edge that arrives at a row the box is
 * not drawing has no anchor to point at.
 *
 * Deliberately NOT importing ROW_BUDGET: a test that reads the constant it is
 * checking passes for any value of it, including a wrong one. The numbers here
 * are written out, so changing the budget makes a test fail and asks whether
 * the new value is intended.
 */
describe('collapsed boxes show a budget of rows, not just connected ones', () => {
  let ds: DataService;
  beforeAll(async () => { ds = new DataService(await loadModelData()); });

  /**
   * One node's view model, collapsed (nothing in `expandedNodes`).
   *
   * `sel` is the whole selection, not just the node wanted back: a row counts
   * as `connected` only when its edge is actually DRAWN, which needs the class
   * at the other end on the canvas too. Asking for Person alone gives a Person
   * with no connected rows at all.
   */
  const collapsed = (id: string, sel: string[] = [id]) => {
    const vm = buildViewModel(
      ds.getOwnershipSubgraph(sel), new Set(),
      c => ds.getClassSummary(c)?.slots ?? [],
      r => ds.getRangeColor(r), r => ds.getTargetColor(r),
    );
    const node = vm.nodes.find(n => n.id === id);
    if (!node) throw new Error(`${id} not in its own subgraph`);
    return node;
  };

  test('Person shows six rows collapsed, not the one that has an edge', () => {
    // The reported case. One connected attribute used to mean one visible row.
    const person = collapsed('Person');
    expect(person.rows.length).toBe(6);
    expect(person.expanded).toBe(false);
    // It is capped, so it still offers the footer.
    expect(person.hiddenCount).toBe(person.allRows.length - 6);
    expect(person.hiddenCount).toBeGreaterThan(0);
  });

  test('a connected row is never cut, and comes first', () => {
    // An edge arriving at an undrawn row has nothing to anchor to, so connected
    // rows fill the budget before anything else and survive it.
    // Both ends on the canvas, so `cause_of_death` actually carries an edge —
    // the state Siggie's screenshot was in.
    const person = collapsed('Person', ['Person', 'CauseOfDeath']);
    const connected = person.allRows.filter(r => r.connected);
    expect(connected.length).toBeGreaterThan(0);
    for (const row of connected) {
      expect(person.rows.some(r => r.slot === row.slot)).toBe(true);
    }
    // Connected first: the visible prefix is exactly the connected rows.
    expect(person.rows.slice(0, connected.length).every(r => r.connected)).toBe(true);
  });

  test('a box that fits the budget is force-expanded with no footer', () => {
    // Subsumes the old all-scalars case: BodySite is force-expanded now because
    // it is short, not because it has no edges. A footer here would be a
    // control that does nothing.
    const short = ds.getContainmentGraph().nodes
      .map(n => collapsed(n.id))
      .find(n => n.allRows.length > 0 && n.allRows.length <= 6);
    expect(short, 'no class short enough to exercise this').toBeDefined();
    expect(short!.expanded).toBe(true);
    expect(short!.hiddenCount).toBe(0);
    expect(short!.rows.length).toBe(short!.allRows.length);
  });

  test('every row stays reachable: rows + hiddenCount covers allRows', () => {
    // The budget must not make a slot unreachable in BOTH states — the
    // invariant allSlotsVisible.test.ts guards from the schema side.
    for (const n of ds.getContainmentGraph().nodes.map(c => collapsed(c.id))) {
      expect(n.rows.length + n.hiddenCount).toBe(n.allRows.length);
    }
  });
});
