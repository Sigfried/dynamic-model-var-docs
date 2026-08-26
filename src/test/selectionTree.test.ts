import { describe, test, expect, beforeAll } from 'vitest';
import { loadModelData } from '../utils/dataLoader';
import { DataService } from '../services/DataService';

/**
 * The DAG tree replaces the flat category checkbox list as the Explore
 * selector (Siggie, 2026-08-26). These assert the DATA the widget is handed,
 * which is the part that can silently make the selector useless — the widget's
 * own rendering is its responsibility, not ours.
 *
 * The failure worth guarding: `levelsExpanded={0}` shows only the ROOTS. If
 * the ownership DAG had one root, or a hundred, the collapsed tree would be
 * unusable in opposite ways, and nothing in the type system says otherwise.
 */
describe('SelectionTree data contract', () => {
  let ds: DataService;
  beforeAll(async () => { ds = new DataService(await loadModelData()); });

  test('every class in the graph is present as a node', () => {
    // The tree is the ONLY selector once the list is retired, so a class
    // missing here is a class that cannot be selected at all. The old flat
    // list drew from ENTITY_CATEGORIES, a hand-curated allowlist; this draws
    // from the graph, so it cannot silently omit a newly-synced class.
    const nodes = ds.getContainmentNodes();
    const ids = new Set(nodes.map(n => n.id));
    for (const n of ds.getContainmentGraph().nodes) {
      expect(ids.has(n.id), `${n.id} is not selectable in the tree`).toBe(true);
    }
  });

  test('collapsed, the tree shows a usable number of roots', () => {
    // Roots = nodes with no parents; those are what levelsExpanded={0} shows.
    const nodes = ds.getContainmentNodes();
    const roots = nodes.filter(n => (n.parentIds ?? []).length === 0);
    expect(roots.length).toBeGreaterThan(1);   // not one mega-root
    expect(roots.length).toBeLessThan(nodes.length); // real nesting exists
  });

  test('every parent id refers to a real node', () => {
    // A dangling parentId would drop its subtree out of the tree entirely,
    // making those classes unreachable without any error.
    const nodes = ds.getContainmentNodes();
    const ids = new Set(nodes.map(n => n.id));
    const dangling: string[] = [];
    for (const n of nodes) {
      for (const p of n.parentIds ?? []) {
        if (!ids.has(p)) dangling.push(`${n.id} -> ${p}`);
      }
    }
    expect(dangling, `Dangling parent links: ${dangling.join(', ')}`).toEqual([]);
  });

  test('no node lists itself as its own parent', () => {
    // Self-loops are real in this schema (Specimen.parent_specimen), but as
    // parent links they would nest a node inside itself.
    const selfParents = ds.getContainmentNodes()
      .filter(n => (n.parentIds ?? []).includes(n.id))
      .map(n => n.id);
    expect(selfParents, `Self-parenting nodes: ${selfParents.join(', ')}`).toEqual([]);
  });

  test('every class is reachable from some root by walking parents up', () => {
    // Guards the case that would hide classes: a cycle with no entry point.
    const nodes = ds.getContainmentNodes();
    const byId = new Map(nodes.map(n => [n.id, n]));
    const unreachable: string[] = [];
    for (const n of nodes) {
      const seen = new Set<string>();
      let cur: string[] = [n.id];
      let hitRoot = false;
      while (cur.length && !hitRoot) {
        const next: string[] = [];
        for (const id of cur) {
          if (seen.has(id)) continue;
          seen.add(id);
          const parents = byId.get(id)?.parentIds ?? [];
          if (parents.length === 0) { hitRoot = true; break; }
          next.push(...parents);
        }
        cur = next;
      }
      if (!hitRoot) unreachable.push(n.id);
    }
    expect(unreachable, `Classes with no path to a root: ${unreachable.join(', ')}`).toEqual([]);
  });
});
