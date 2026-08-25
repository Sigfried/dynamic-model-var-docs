import { describe, test, expect, beforeAll } from 'vitest';
import { loadModelData } from '../utils/dataLoader';
import { DataService } from '../services/DataService';
import type { OwnershipPairGroup, ConvergenceInfo } from '../services/DataService';
import { classifySlotEdge, classifySlotEdgeExplained } from '../models/containmentGraph';
import { getSlotEdgesForClass } from '../models/Graph';

/**
 * The ownership legend is only useful if it describes the graph that is
 * actually drawn. Its whole value is letting Siggie spot routing cases the
 * curated example set missed, so a legend that quietly disagrees with the
 * builder is worse than none.
 *
 * These assert the two ways it could drift: the explained classifier diverging
 * from the plain one, and the pair enumeration diverging from the edges the
 * containment graph emits.
 */
describe('ownership legend', () => {
  let ds: DataService;
  let groups: OwnershipPairGroup[];

  beforeAll(async () => {
    ds = new DataService(await loadModelData());
    groups = ds.getOwnershipPairGroups();
  });

  test('classifySlotEdgeExplained agrees with classifySlotEdge on every live slot', async () => {
    const data = await loadModelData();
    const classIds = ds.getContainmentGraph().nodes.map(n => n.id);
    let checked = 0;
    for (const cname of classIds) {
      for (const slot of getSlotEdgesForClass(data.graph, cname)) {
        const plain = classifySlotEdge(slot.slotName, slot.range, slot.multivalued);
        const { verdict } = classifySlotEdgeExplained(
          slot.slotName, slot.range, slot.multivalued,
        );
        expect(verdict).toBe(plain);
        checked++;
      }
    }
    expect(checked).toBeGreaterThan(50);
  });

  test('every group\'s rule actually produces that group\'s verdict', () => {
    expect(groups.length).toBeGreaterThan(0);
    for (const g of groups) {
      expect(g.pairs.length).toBeGreaterThan(0);
      expect(g.ruleText).toBeTruthy();
      for (const p of g.pairs) {
        const { verdict, rule } = classifySlotEdgeExplained(
          p.slotName, p.range, p.multivalued,
        );
        expect(verdict).toBe(g.verdict);
        expect(rule).toBe(g.rule);
      }
    }
  });

  test('owner/owned is the drawn direction: reversed for own-bkwd + association', () => {
    for (const g of groups) {
      for (const p of g.pairs) {
        if (g.verdict === 'own-bkwd' || g.verdict === 'association') {
          expect(p.owner).toBe(p.range);
          expect(p.owned).toBe(p.declaredOn);
        } else {
          expect(p.owner).toBe(p.declaredOn);
          expect(p.owned).toBe(p.range);
        }
      }
    }
  });

  test('the pairs match the has-a/ref edges the containment graph emits', () => {
    const graph = ds.getContainmentGraph();
    const nodeIds = new Set(graph.nodes.map(n => n.id));
    // The graph prunes isolated nodes and drops 'excluded'; compare only the
    // pairs that survive both filters.
    const fromLegend = groups
      .filter(g => g.verdict !== 'excluded')
      .flatMap(g => g.pairs)
      .filter(p => nodeIds.has(p.owner) && nodeIds.has(p.owned))
      .map(p => `${p.owner}->${p.owned}:${p.slotName}`)
      .sort();
    const fromGraph = graph.edges
      .filter(e => e.kind !== 'subclass')
      .map(e => `${e.source}->${e.target}:${e.label}`)
      .sort();
    expect(fromLegend).toEqual(fromGraph);
  });

  test('convergence ranking counts slot-edges, and TimePoint outruns its owner count', () => {
    const ranking: ConvergenceInfo[] = ds.getConvergenceRanking();
    expect(ranking.length).toBeGreaterThan(0);
    // Sorted by edge count, descending.
    for (let i = 1; i < ranking.length; i++) {
      expect(ranking[i - 1].edgeCount).toBeGreaterThanOrEqual(ranking[i].edgeCount);
    }
    const tp = ranking.find(r => r.entity === 'TimePoint');
    expect(tp).toBeDefined();
    // The point of counting edges rather than owners: the Specimen*Activity
    // classes each own TimePoint twice (date_started, date_ended), so the
    // corridor is more crowded than the owner list suggests.
    expect(tp!.edgeCount).toBeGreaterThan(tp!.owners.length);
    // No self-loops in the ranking — a loop is a marker, not an approach.
    for (const r of ranking) expect(r.owners).not.toContain(r.entity);
  });
});

/**
 * The example cases name class ids as string literals, so a schema sync that
 * renames or drops a class turns a case into a silently-empty canvas. Cheap to
 * catch here; confusing to debug by eye.
 */
describe('example cases', () => {
  test('every named class exists in the schema', async () => {
    const { EXAMPLE_CASES } = await import('../explore/exampleCases');
    const ds = new DataService(await loadModelData());
    const missing: string[] = [];
    let cases = 0;
    for (const group of EXAMPLE_CASES) {
      for (const c of group.cases) {
        cases++;
        for (const id of [...c.sel, ...(c.exp ?? [])]) {
          if (!ds.itemExists(id)) missing.push(`${c.name}: ${id}`);
        }
      }
    }
    expect(missing).toEqual([]);
    expect(cases).toBeGreaterThan(10);
  });

  test('case names are unique (they key the list)', async () => {
    const { EXAMPLE_CASES } = await import('../explore/exampleCases');
    const names = EXAMPLE_CASES.flatMap(g => g.cases.map(c => c.name));
    expect(new Set(names).size).toBe(names.length);
  });
});
