/**
 * Expand-on-demand data behavior (docs/EXPLORE_VIZ.md build step 3 remainder).
 *
 * The content policy: the diagram shows selected entities, edges among them,
 * and their ownership paths to root; everything else arrives by expansion,
 * "dimmed and dismissible". These assert the subgraph honors `expansions` —
 * the UI affordance (clicking a dimmed row) is wired on top in
 * OwnershipGraphView.
 */

import { describe, test, expect, beforeAll } from 'vitest';
import { loadModelData } from '../utils/dataLoader';
import { DataService } from '../services/DataService';

describe('getOwnershipSubgraph expansions', () => {
  let ds: DataService;

  beforeAll(async () => {
    ds = new DataService(await loadModelData());
  });

  test('an expanded class joins the canvas as dimmed context', () => {
    const before = ds.getOwnershipSubgraph(['Observation']);
    expect(before.nodes.some(n => n.id === 'Quantity')).toBe(false);

    const after = ds.getOwnershipSubgraph(['Observation'], ['Quantity']);
    const q = after.nodes.find(n => n.id === 'Quantity');
    expect(q, 'Quantity should be on canvas after expansion').toBeTruthy();
    expect(q!.role, 'expanded nodes are context, not selected').toBe('context');
  });

  test('expansion brings the edge that motivated it', () => {
    const after = ds.getOwnershipSubgraph(['Observation'], ['Quantity']);
    const edge = after.edges.find(
      e => (e.source === 'Observation' && e.target === 'Quantity') ||
           (e.source === 'Quantity' && e.target === 'Observation'),
    );
    expect(edge, 'the Observation→Quantity edge should be drawn').toBeTruthy();
  });

  test('expanding does not change layers of nodes already present', () => {
    const before = ds.getOwnershipSubgraph(['Observation']);
    const after = ds.getOwnershipSubgraph(['Observation'], ['Quantity']);
    const layerOf = (g: typeof before) => new Map(g.nodes.map(n => [n.id, n.layer]));
    const [a, b] = [layerOf(before), layerOf(after)];
    for (const [id, layer] of a) {
      expect(b.get(id), `${id} should keep its layer across expansion`).toBe(layer);
    }
  });

  test('selecting a class that was expanded promotes it to selected', () => {
    const g = ds.getOwnershipSubgraph(['Observation', 'Quantity'], []);
    expect(g.nodes.find(n => n.id === 'Quantity')!.role).toBe('selected');
  });

  test('an id in both selection and expansions stays selected', () => {
    // ExploreApp filters this case out, but the data layer must not produce a
    // duplicate or downgrade the node to context.
    const g = ds.getOwnershipSubgraph(['Observation', 'Quantity'], ['Quantity']);
    const matches = g.nodes.filter(n => n.id === 'Quantity');
    expect(matches).toHaveLength(1);
    expect(matches[0].role).toBe('selected');
  });

  test('unknown expansion ids fail loudly', () => {
    expect(() => ds.getOwnershipSubgraph(['Observation'], ['NoSuchClass'])).toThrow(
      /NoSuchClass/,
    );
  });

  test('Context expands to Activity — the 2026-08-12 sync pair', () => {
    const g = ds.getOwnershipSubgraph(['Context'], ['Activity']);
    expect(g.nodes.some(n => n.id === 'Activity')).toBe(true);
    const edge = g.edges.find(e => e.slotName === 'activity');
    expect(edge, 'the Context.activity edge should be drawn').toBeTruthy();
  });
});
