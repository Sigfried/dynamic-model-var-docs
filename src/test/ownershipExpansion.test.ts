/**
 * Adding a class from the diagram (docs/EXPLORE_VIZ.md build step 3 remainder).
 *
 * The content policy since 2026-08-27: the diagram shows exactly what is
 * selected, plus the opt-in ownership paths to root. Everything else arrives by
 * clicking an attribute row or a relation-menu item — and **that click selects
 * it**, so there is no second `expansions` input and no dimmed tier.
 *
 * These used to pass `expansions` as a separate argument. They now pass a
 * larger selection, which is the whole of the change: a class is on the canvas
 * for exactly one reason.
 */

import { describe, test, expect, beforeAll } from 'vitest';
import { loadModelData } from '../utils/dataLoader';
import { DataService } from '../services/DataService';

describe('getOwnershipSubgraph: adding a class', () => {
  let ds: DataService;

  beforeAll(async () => {
    ds = new DataService(await loadModelData());
  });

  test('an added class joins the canvas as a full selection', () => {
    const before = ds.getOwnershipSubgraph(['Observation']);
    expect(before.nodes.some(n => n.id === 'Quantity')).toBe(false);

    const after = ds.getOwnershipSubgraph(['Observation', 'Quantity']);
    const q = after.nodes.find(n => n.id === 'Quantity');
    expect(q, 'Quantity should be on canvas after being added').toBeTruthy();
    // Not 'context': adding is selecting, so the left panel's checkbox is
    // ticked and the box is a first-class node rather than dimmed.
    expect(q!.role).toBe('selected');
  });

  test('adding brings the edge that motivated it', () => {
    const after = ds.getOwnershipSubgraph(['Observation', 'Quantity']);
    const edge = after.edges.find(
      e => (e.source === 'Observation' && e.target === 'Quantity') ||
           (e.source === 'Quantity' && e.target === 'Observation'),
    );
    expect(edge, 'the Observation→Quantity edge should be drawn').toBeTruthy();
  });

  test('adding does not change layers of nodes already present', () => {
    const before = ds.getOwnershipSubgraph(['Observation']);
    const after = ds.getOwnershipSubgraph(['Observation', 'Quantity']);
    const layerOf = (g: typeof before) => new Map(g.nodes.map(n => [n.id, n.layer]));
    const [a, b] = [layerOf(before), layerOf(after)];
    for (const [id, layer] of a) {
      expect(b.get(id), `${id} should keep its layer across expansion`).toBe(layer);
    }
  });

  test('a duplicated id yields one node, still selected', () => {
    // ExploreApp cannot produce this now that there is a single Set, but the
    // data layer must not emit a duplicate box for it either.
    const g = ds.getOwnershipSubgraph(['Observation', 'Quantity', 'Quantity']);
    const matches = g.nodes.filter(n => n.id === 'Quantity');
    expect(matches).toHaveLength(1);
    expect(matches[0].role).toBe('selected');
  });

  test('unknown ids fail loudly', () => {
    expect(() => ds.getOwnershipSubgraph(['Observation', 'NoSuchClass'])).toThrow(
      /NoSuchClass/,
    );
  });

  test('Context reaches Activity — the 2026-08-12 sync pair', () => {
    const g = ds.getOwnershipSubgraph(['Context', 'Activity']);
    expect(g.nodes.some(n => n.id === 'Activity')).toBe(true);
    const edge = g.edges.find(e => e.slotName === 'activity');
    expect(edge, 'the Context.activity edge should be drawn').toBeTruthy();
  });
});
