import { describe, test, expect, beforeAll } from 'vitest';
import { loadModelData } from '../utils/dataLoader';
import { DataService } from '../services/DataService';
import { RELATION_POSITION_ORDER } from '../models/ownershipSubgraph';

/** THROWAWAY PROBE — measure the four ownership positions per class. */
describe('probe', () => {
  let ds: DataService;
  beforeAll(async () => { ds = new DataService(await loadModelData()); });

  test('four positions', () => {
    const lines: string[] = [];
    for (const target of ['Observation', 'Organization', 'Specimen', 'Quantity', 'Document']) {
      const g = ds.getOwnershipSubgraph([target]);
      const n = g.nodes.find(x => x.id === target)!;
      lines.push(`### ${target} (${n.relations.length} entries)`);
      for (const pos of RELATION_POSITION_ORDER) {
        const es = n.relations.filter(r => r.position === pos);
        const others = [...new Set(es.map(r => r.other))];
        lines.push(`  ${pos} (${others.length}): ${others.join(', ')}`);
      }
    }
    expect(lines.join('\n')).toBe('SENTINEL');
  });
});
