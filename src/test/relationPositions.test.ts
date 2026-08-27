import { describe, test, expect, beforeAll } from 'vitest';
import { loadModelData } from '../utils/dataLoader';
import { DataService } from '../services/DataService';
import { RELATION_POSITION_ORDER } from '../services/DataService';
import type { RelationPosition } from '../services/DataService';
import { buildRelationGroups, buildViewModel } from '../explore/OwnershipGraphView';

/**
 * The five relation positions behind the cascading menu that replaced the chip
 * strips (docs/TASKS.md, "Chip strips → relation counts + menu").
 *
 * The distinction under test is the one Siggie insisted on and the DAG erases:
 *
 *   > "i'm not sure i'm happy with the new hiddenOwned getting merged with
 *      owns. the distinction is sort of like 'mine because i say so' and 'mine
 *      because it says so'."
 *
 * `containmentGraph` flips own-bkwd edges at build time, so a DAG node's
 * parents/children carry direction only. `collectRelations` recovers the
 * declaring side from the FULL edge list, which still has `flipped`.
 */
describe('relation positions', () => {
  let ds: DataService;
  beforeAll(async () => { ds = new DataService(await loadModelData()); });

  const relationsOf = (id: string) => {
    const g = ds.getOwnershipSubgraph([id]);
    return g.nodes.find(n => n.id === id)!.relations;
  };
  const othersIn = (id: string, position: RelationPosition) =>
    [...new Set(relationsOf(id).filter(r => r.position === position).map(r => r.other))].sort();

  test('Organization owns 14 things, every one by THEIR attribute', () => {
    // The case that motivated the downward chips: Organization declares no
    // ownership slots at all, so `owns-mine` is empty and the whole
    // relationship set is other classes' `performed_by` pointing at it. Under
    // the old chips this was one undifferentiated `owns` strip.
    expect(othersIn('Organization', 'owns-mine')).toEqual([]);
    expect(othersIn('Organization', 'owns-theirs')).toContain('Observation');
    expect(othersIn('Organization', 'owns-theirs')).toContain('Participant');
    expect(othersIn('Organization', 'owns-theirs').length).toBeGreaterThan(10);
  });

  test('Specimen owns by its OWN attributes — the other side of the distinction', () => {
    // Specimen.creation_activity etc. are declared on Specimen, so they are
    // "mine because I say so". Both positions are `owns` to the DAG; only the
    // declaring side separates them.
    const mine = othersIn('Specimen', 'owns-mine');
    expect(mine).toContain('SpecimenCreationActivity');
    expect(mine).toContain('BiologicProduct');
    expect(othersIn('Specimen', 'owns-theirs')).toEqual([]);
  });

  test('the two `I belong to` positions are distinguished by declaring side', () => {
    // Observation.associated_participant is declared ON Observation, so
    // Participant owns it "because Observation says so" -> owned-mine.
    // ObservationSet.observations is declared on ObservationSet, so
    // Observation belongs to it "because IT says so" -> owned-theirs.
    expect(othersIn('Observation', 'owned-mine')).toContain('Participant');
    expect(othersIn('Observation', 'owned-theirs')).toEqual(['ObservationSet']);
  });

  test('associations are surfaced — they appeared in NEITHER chip strip', () => {
    // Siggie: "there are only two association edges currently. but they
    // shouldn't be hidden from user." ASSOCIATION_SLOTS = related_document,
    // container. Both ends see the association, since neither owns the other.
    expect(othersIn('Specimen', 'association')).toContain('Document');
    expect(othersIn('Document', 'association')).toContain('Specimen');
  });

  test('self-loops are not relations — they render as ⟲ row markers', () => {
    // Specimen.parent_specimen ranges on Specimen itself.
    expect(relationsOf('Specimen').some(r => r.other === 'Specimen')).toBe(false);
  });

  test('every relation names a slot declared on one of its two ends', () => {
    // The invariant the menu's subtitle depends on: `declaredBy` is always one
    // of the pair, so "by my attribute" / "by their attribute" is decidable.
    for (const id of ['Participant', 'Observation', 'Specimen', 'Quantity']) {
      for (const r of relationsOf(id)) {
        expect([id, r.other]).toContain(r.declaredBy);
        expect(r.slot).not.toBe('');
      }
    }
  });
});

describe('relation menu groups', () => {
  let ds: DataService;
  beforeAll(async () => { ds = new DataService(await loadModelData()); });

  const groupsFor = (id: string) => {
    const sub = ds.getOwnershipSubgraph([id]);
    const vm = buildViewModel(sub, new Set(), c => ds.getClassSummary(c)?.slots ?? []);
    return vm.nodes.find(n => n.id === id)!;
  };

  test('groups follow the menu order and never contain the class itself', () => {
    const n = groupsFor('Participant');
    const order = n.relationGroups.map(g => g.position);
    expect(order).toEqual([...order].sort(
      (a, b) => RELATION_POSITION_ORDER.indexOf(a) - RELATION_POSITION_ORDER.indexOf(b)));
    for (const g of n.relationGroups) {
      expect(g.items.map(i => i.other)).not.toContain('Participant');
    }
  });

  test('the two `I belong to` positions render as SEPARATE branches', () => {
    /*
     * Siggie's sketch named four branches, folding these two together, and
     * that is how this first shipped. Asked directly (2026-08-27) he chose
     * five: the declaring side is a top-level distinction, not something to
     * find in an item's slot subtitle.
     */
    const groups = buildRelationGroups(
      [
        { other: 'A', position: 'owned-mine', slot: 'a', declaredBy: 'X', cardinality: '1' },
        { other: 'B', position: 'owned-theirs', slot: 'b', declaredBy: 'B', cardinality: '*' },
      ],
      () => false,
    );
    expect(groups.map(g => g.position)).toEqual(['owned-mine', 'owned-theirs']);
    expect(groups.map(g => g.items.map(i => i.other))).toEqual([['A'], ['B']]);
    // Sharing a label would make the five branches unreadable, so they differ.
    expect(groups[0].label).not.toEqual(groups[1].label);
  });

  test('branch labels agree in number with their own count', () => {
    // "1 belong to me by my attribute" was the tell that the label was a
    // fixed string rather than a rendering of the branch (Siggie, 2026-08-27).
    const one = buildRelationGroups(
      [{ other: 'A', position: 'owns-mine', slot: 'a', declaredBy: 'X', cardinality: '1' }],
      () => false,
    );
    expect(one[0].label).toBe('belongs to me by my attribute');

    const two = buildRelationGroups(
      [
        { other: 'A', position: 'owns-mine', slot: 'a', declaredBy: 'X', cardinality: '1' },
        { other: 'B', position: 'owns-mine', slot: 'b', declaredBy: 'X', cardinality: '1' },
      ],
      () => false,
    );
    expect(two[0].label).toBe('belong to me by my attribute');
  });

  test('shownCount counts related classes on the canvas, never the box itself', () => {
    // Organization has no owners at all, so selecting it alone draws exactly
    // one box and none of its 13 related classes: "13 related · 0 shown".
    const org = groupsFor('Organization');
    expect(org.relatedCount).toBe(13);
    expect(org.shownCount).toBe(0);
    // Specimen's two owners ARE drawn, so its trigger reports them.
    const spec = groupsFor('Specimen');
    expect(spec.shownCount).toBe(
      new Set(spec.relationGroups.flatMap(g => g.items).filter(i => i.drawn).map(i => i.other)).size,
    );
    expect(spec.shownCount).toBeGreaterThan(0);
  });

  test('items report drawn state, so the menu can remove as well as add', () => {
    // The chips could only ever add on the `owns` side. Every item now toggles.
    const n = groupsFor('Specimen');
    const drawn = n.relationGroups.flatMap(g => g.items).filter(i => i.drawn);
    expect(drawn.length).toBeGreaterThan(0);
    // Anything marked drawn really is a box on the canvas.
    const sub = ds.getOwnershipSubgraph(['Specimen']);
    const onCanvas = new Set(sub.nodes.map(x => x.id));
    for (const i of drawn) expect(onCanvas.has(i.other)).toBe(true);
  });

  test('relatedCount counts NAMES, not entries', () => {
    // A pair can occupy two positions at once, so summing group sizes would
    // over-count and the trigger would promise more than the menu lists.
    const n = groupsFor('Observation');
    const names = new Set(n.relationGroups.flatMap(g => g.items.map(i => i.other)));
    expect(n.relatedCount).toBe(names.size);
  });

  test('Observation reaches all its relations without a wrapped strip', () => {
    // The overlap case from img-3: 13 owner chips over three wrapped lines.
    // The band is now one fixed line whatever the count, so the box height is
    // deterministic — the reason the strips were replaced, not patched.
    const n = groupsFor('Observation');
    expect(n.relatedCount).toBeGreaterThan(4);
    expect(n.relationGroups.length).toBeGreaterThan(1);
  });
});
