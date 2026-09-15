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
        const plain = classifySlotEdge(cname, slot.slotName, slot.range, slot.multivalued);
        const { verdict } = classifySlotEdgeExplained(
          cname, slot.slotName, slot.range, slot.multivalued,
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
        // An induced pair comes from a declared forward pair: the attribute
        // classifies against the DECLARED range, and that must come out
        // forward, or there was nothing to induce from.
        //
        // `p.declaredOn` is not optional here — `belongs-to-target-backward-by-attribute` is
        // keyed `Class.slot`, so dropping the class would silently stop that
        // exception firing and the pairs would compare equal by luck.
        const { verdict, rule } = classifySlotEdgeExplained(
          p.declaredOn, p.slotName, p.inducedFrom ?? p.range, p.multivalued,
        );
        expect(verdict).toBe(g.verdict);
        if (p.inducedFrom !== undefined) {
          expect(g.rule).toBe('child-following-parent');
          expect(verdict).toBe('own-fwd');
        } else {
          expect(rule).toBe(g.rule);
        }
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
  /*
   * Facts about the PAIRS, not about the panel.
   *
   * ⚠️ These were written for the old two-counts legend, which grouped every
   * section on `p.range`. That panel is gone — it groups owner → attribute →
   * owned now (docs/LEGEND_ORIENTATION.md) — and these tests survived the
   * rewrite untouched, because `byTargetEntity` below is re-implemented
   * LOCALLY and what it pins is the shape of the DATA: attributes sum to
   * pairs, and the range-keyed exception is few entities over many attributes.
   *
   * So do not "fix" them to match the panel's grouping. If the panel is what
   * you are changing, `ownershipLegendDisclosure.test.tsx` is the file.
   */
  describe('the pairs, grouped by range', () => {
    const byTargetEntity = (pairs: OwnershipPairGroup['pairs']) => {
      const m = new Map<string, typeof pairs>();
      for (const p of pairs) {
        const l = m.get(p.range);
        if (l) l.push(p); else m.set(p.range, [p]);
      }
      return m;
    };

    test('attributes sum to the pair count, and entities are distinct ranges', () => {
      for (const g of groups) {
        const m = byTargetEntity(g.pairs);
        expect([...m.values()].reduce((n, ps) => n + ps.length, 0), g.rule)
          .toBe(g.pairs.length);
        expect(m.size, g.rule).toBe(new Set(g.pairs.map(p => p.range)).size);
        // Entities never outnumber attributes: every entity has >=1 attribute.
        expect(m.size, g.rule).toBeLessThanOrEqual(g.pairs.length);
      }
    });

    /*
     * The shape that motivated grouping by target at all. A range-keyed rule
     * is a SHORT list of entities against a long list of attributes; an
     * attribute-keyed one is not. If these ever converge, the legend's two
     * counts have stopped telling the reader anything the one count did not.
     */
    test('the range-keyed exception is few entities over many attributes', () => {
      const byEntity = groups.find(g => g.rule === 'belongs-to-target-backward-by-entity')!;
      const byAttr = groups.find(g => g.rule === 'belongs-to-target-backward-by-attribute')!;

      expect(byTargetEntity(byEntity.pairs).size).toBe(5);
      expect(byEntity.pairs.length).toBeGreaterThan(40);

      // The attribute-keyed one is the opposite shape: its 5 attributes land
      // on only 2 entities, and BOTH are owned by some other attribute — which
      // is exactly why it cannot be keyed by range. See ownershipRules.ts.
      expect(byTargetEntity(byAttr.pairs).size).toBe(2);
      const fwd = groups.find(g => g.rule === 'owns-target-forward-by-default')!;
      for (const range of byTargetEntity(byAttr.pairs).keys()) {
        expect(fwd.pairs.some(p => p.range === range), `${range} is owned by something`)
          .toBe(true);
      }
    });

    test('the induced group is separated from the slot rules', () => {
      // It is rendered in its own section, not as a fourth rule, so the split
      // the legend makes must actually be available in the data.
      const slotRules = groups.filter(g => g.rule !== 'child-following-parent');
      const induced = groups.filter(g => g.rule === 'child-following-parent');
      expect(slotRules.length).toBe(3);
      expect(induced.length).toBe(1);
      expect(induced[0].pairs.every(p => p.inducedFrom !== undefined)).toBe(true);
      expect(slotRules.every(g => g.pairs.every(p => p.inducedFrom === undefined))).toBe(true);
    });
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
