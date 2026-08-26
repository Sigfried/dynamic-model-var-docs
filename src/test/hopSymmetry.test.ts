import { describe, test, expect, beforeAll } from 'vitest';
import { loadModelData } from '../utils/dataLoader';
import { DataService } from '../services/DataService';

/**
 * "Default should be one hop either direction" (Siggie, 2026-08-25).
 *
 * The two directions are NOT symmetric in the model, and this pins down which
 * is which so the asymmetry is a known design fact rather than a surprise:
 *
 * - UP (owners) is automatic, capped, and chipped. Owners of a selected class
 *   are drawn without asking, because a value object's owners ARE the answer
 *   to "what is this".
 * - DOWN (owned) is on demand, per row. Every entity-ranged row whose range is
 *   off-canvas is an expand affordance; nothing downward is drawn by default,
 *   because the fan-out downward is unbounded in a way the upward one is not.
 *
 * So "one hop either direction" is true of what is REACHABLE, not of what is
 * drawn. The remaining gap is a way to see, from the box, what it owns without
 * expanding the rows one at a time -- the downward equivalent of chips.
 */
describe('one hop in either direction', () => {
  let ds: DataService;
  beforeAll(async () => { ds = new DataService(await loadModelData()); });

  test('UP: owners of a selection are drawn without being asked for', () => {
    const g = ds.getOwnershipSubgraph(['BodySite']);
    const drawn = g.nodes.map(n => n.id).filter(id => id !== 'BodySite');
    expect(drawn.length).toBeGreaterThan(0);
    // ...but not transitively: the owners' owners stay off.
    expect(drawn).not.toContain('ResearchStudyCollection');
  });

  test('DOWN: what a class owns is reachable but NOT drawn by default', () => {
    // Participant owns plenty. Selecting it alone should not drag them in --
    // that is the blowup one-hop-down would cause if it were automatic.
    const g = ds.getOwnershipSubgraph(['Participant']);
    const ids = new Set(g.nodes.map(n => n.id));
    const owned = g.nodes
      .find(n => n.id === 'Participant')!
      .slots.filter(s => !s.flipped && !s.isLoop)
      .map(s => s.range);
    expect(owned.length).toBeGreaterThan(0);
    // The rows naming them exist (that IS the affordance), but the classes
    // themselves are not on the canvas.
    const drawnOwned = owned.filter(r => ids.has(r));
    expect(drawnOwned.length).toBeLessThan(owned.length);
  });

  test('DOWN: expanding a row pulls exactly that class in, one hop', () => {
    const before = ds.getOwnershipSubgraph(['Participant']);
    const target = before.nodes
      .find(n => n.id === 'Participant')!
      .slots.find(s => !s.flipped && !s.isLoop
        && !before.nodes.some(n => n.id === s.range))?.range;
    expect(target).toBeDefined();

    const after = ds.getOwnershipSubgraph(['Participant'], [target!]);
    expect(after.nodes.map(n => n.id)).toContain(target!);
  });

  test('every drawn node is reachable in ONE hop from the selection', () => {
    // The property that keeps the canvas legible: no node appears that is not
    // either selected, a direct owner, or explicitly expanded. This is what
    // pathToRoot deliberately gives up.
    const g = ds.getOwnershipSubgraph(['BodySite', 'Participant']);
    const sel = new Set(['BodySite', 'Participant']);
    const owners = new Set<string>();
    for (const id of sel) {
      for (const o of g.drawnOwners.get(id) ?? []) owners.add(o);
    }
    for (const n of g.nodes) {
      expect(
        sel.has(n.id) || owners.has(n.id),
        `${n.id} is drawn but is neither selected nor a direct owner`,
      ).toBe(true);
    }
  });
});
