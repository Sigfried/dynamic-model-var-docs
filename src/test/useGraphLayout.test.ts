/**
 * Generation contract for useGraphLayout.
 *
 * Regression: unchecking an entity (repro: select Person + Participant, then
 * uncheck Participant) crashed OwnershipGraphView with
 *   "Routed edge edge-80 missing from view model"
 * because layout is async (ELK runs in a worker) while the view model is a
 * synchronous useMemo. React re-rendered with the new view model while the
 * hook still held the PREVIOUS spec's result, so the render mapped over stale
 * routed-edge ids and looked them up in a view model that no longer had them.
 *
 * The fix is not to soften that throw — a routed edge missing from the current
 * view model is a real invariant violation worth failing on. It is that every
 * result is handed back PAIRED WITH THE SPEC it was computed from, so a caller
 * can tell a current generation (ids joinable) from a superseded one (only the
 * coordinates are safe — the positions boxes keep while the next layout runs).
 */

import { describe, it, expect, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useGraphLayout } from '../explore/graph-core/useGraphLayout';
import type { GraphSpec, LayoutResult } from '../explore/graph-core/types';

// Resolve each ELK run by hand so the "new spec in, old result still held"
// window the bug lived in is directly reproducible.
const deferrals: Array<(r: LayoutResult) => void> = [];

vi.mock('../explore/graph-core/elkLayout', () => ({
  ElkLayoutEngine: class {
    layout(): Promise<LayoutResult> {
      return new Promise(resolve => { deferrals.push(resolve); });
    }
    cancel() {}
    dispose() {}
  },
}));

const specOf = (ids: string[]): GraphSpec => ({
  nodes: ids.map(id => ({ id, width: 10, height: 10 })),
  edges: ids.slice(1).map((id, i) => ({ id: `e-${ids[i]}-${id}`, source: ids[i], target: id })),
});

const resultFor = (spec: GraphSpec): LayoutResult => ({
  nodes: spec.nodes.map(n => ({ id: n.id, x: 0, y: 0, width: n.width, height: n.height })),
  edges: spec.edges.map(e => ({ id: e.id, source: e.source, target: e.target, sections: [] })),
  width: 100,
  height: 100,
});

describe('useGraphLayout generations', () => {
  it('marks a superseded result by its spec, and replaces it when the new one lands', async () => {
    deferrals.length = 0;
    const wide = specOf(['Person', 'Participant', 'Observation']);
    const narrow = specOf(['Person']);

    const { result, rerender } = renderHook(
      ({ spec }) => useGraphLayout(spec),
      { initialProps: { spec: wide } },
    );

    // First layout settles: the wide spec's edges are on screen.
    await act(async () => { deferrals[0](resultFor(wide)); });
    await waitFor(() => expect(result.current.latest).not.toBeNull());
    expect(result.current.latest!.spec).toBe(wide);
    expect(result.current.latest!.layout.edges.map(e => e.id))
      .toEqual(['e-Person-Participant', 'e-Participant-Observation']);

    // Uncheck: a narrower spec arrives before its layout has been computed.
    // The wide result is still held — its coordinates are what the boxes sit
    // at through the gap — but it is visibly NOT the narrow spec's, which is
    // the caller's cue not to join its ids against the fresh view model.
    rerender({ spec: narrow });
    expect(result.current.latest!.spec).toBe(wide);
    expect(result.current.latest!.spec).not.toBe(narrow);
    expect(result.current.inProgress).toBe(true);

    // Once the narrow run lands, it is the latest and it is current.
    await act(async () => { deferrals[1](resultFor(narrow)); });
    await waitFor(() => expect(result.current.latest!.spec).toBe(narrow));
    expect(result.current.latest!.layout.nodes.map(n => n.id)).toEqual(['Person']);
    expect(result.current.latest!.layout.edges).toEqual([]);
    expect(result.current.inProgress).toBe(false);
  });

  it('reports inProgress until the first layout for a spec arrives', async () => {
    deferrals.length = 0;
    const spec = specOf(['Person', 'Participant']);
    const { result } = renderHook(() => useGraphLayout(spec));

    expect(result.current.latest).toBeNull();
    expect(result.current.inProgress).toBe(true);

    await act(async () => { deferrals[0](resultFor(spec)); });
    await waitFor(() => expect(result.current.inProgress).toBe(false));
    expect(result.current.latest!.layout.nodes).toHaveLength(2);
  });

  it('clears the layout when the spec empties out (last entity unchecked)', async () => {
    deferrals.length = 0;
    const spec = specOf(['Person']);
    const { result, rerender } = renderHook(
      ({ spec }) => useGraphLayout(spec),
      { initialProps: { spec } },
    );
    await act(async () => { deferrals[0](resultFor(spec)); });
    await waitFor(() => expect(result.current.latest).not.toBeNull());

    rerender({ spec: specOf([]) });
    expect(result.current.latest).toBeNull();
    expect(result.current.inProgress).toBe(false);
  });
});
