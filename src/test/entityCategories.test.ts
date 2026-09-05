import { describe, test, expect, beforeAll } from 'vitest';
import { loadModelData } from '../utils/dataLoader';
import {
  ENTITY_CATEGORIES,
  SUBCLASS_OF,
  DEFAULT_PINS,
  UNCATEGORIZED_BY_DESIGN,
  findUncategorizedClasses,
} from '../config/entityCategories';

/**
 * ENTITY_CATEGORIES is a hand-curated allowlist: the Entity Explorer and the
 * Focus selector both map categories -> classes, never the reverse, so a class
 * in no category is invisible in the UI with no warning.
 *
 * That rots on every upstream schema sync. The 2026-08-12 sync (778afca) added
 * Context and Activity; both silently vanished until someone noticed Context
 * missing from the entity list. These tests assert the config against the LIVE
 * schema so the next sync turns red instead of quietly hiding classes.
 */
describe('entityCategories config vs. live schema', () => {
  let classIds: string[];

  beforeAll(async () => {
    const data = await loadModelData();
    const classes = data.collections.get('class');
    if (!classes) throw new Error('No "class" collection in loaded model data');
    classIds = classes.getAllElements().map(el => el.name);
  });

  test('every schema class is categorized or explicitly excluded', () => {
    const uncategorized = findUncategorizedClasses(classIds);
    expect(
      uncategorized,
      `Schema classes missing from ENTITY_CATEGORIES: ${uncategorized.join(', ')}.\n` +
        'Add each to a category in src/config/entityCategories.ts, or — if it ' +
        'should never appear in the entity list — record it in ' +
        'UNCATEGORIZED_BY_DESIGN with the reason.',
    ).toEqual([]);
  });

  test('no category lists a class that no longer exists in the schema', () => {
    const known = new Set(classIds);
    const stale = ENTITY_CATEGORIES.flatMap(cat =>
      cat.classIds.filter(id => !known.has(id)).map(id => `${cat.id}:${id}`),
    );
    expect(stale, `Categorized classes absent from the schema: ${stale.join(', ')}`).toEqual([]);
  });

  test('UNCATEGORIZED_BY_DESIGN entries still exist and stay out of categories', () => {
    const known = new Set(classIds);
    const categorized = new Set(ENTITY_CATEGORIES.flatMap(cat => cat.classIds));
    for (const [id, reason] of Object.entries(UNCATEGORIZED_BY_DESIGN)) {
      expect(known.has(id), `${id} is excluded by design but not in the schema`).toBe(true);
      expect(categorized.has(id), `${id} is excluded by design but also categorized`).toBe(false);
      expect(reason.length, `${id} needs a non-empty exclusion reason`).toBeGreaterThan(0);
    }
  });

  /*
   * Was "no class is listed in two categories", which forbade exactly the
   * change made 2026-09-04. Retired deliberately, per the audit in TASKS.md
   * ("a class should appear in SEVERAL CATEGORIES"): categories are an imposed
   * navigation aid, not a second superclass, so a class CAN belong to more
   * than one.
   *
   * Kept as an allowlist rather than dropped: dual-listing costs a row in two
   * places and has to be a decision, not a paste error. Add an id here when
   * adding one to a second category.
   */
  const DUAL_LISTED = new Set([
    'SpecimenQualityObservation',
    'SpecimenQuantityObservation',
    // Anatomy is both clinical and specimen-related: Condition, Procedure and
    // ImagingStudy name a body site, and so does
    // SpecimenCreationActivity.collection_site (2026-09-04).
    'BodySite',
  ]);

  test('only deliberately dual-listed classes appear in two categories', () => {
    const seen = new Map<string, string>();
    const dupes: string[] = [];
    for (const cat of ENTITY_CATEGORIES) {
      for (const id of cat.classIds) {
        const prev = seen.get(id);
        if (prev && !DUAL_LISTED.has(id)) dupes.push(`${id} (${prev} + ${cat.id})`);
        else if (!prev) seen.set(id, cat.id);
      }
    }
    expect(dupes, `Undeclared multi-category classes: ${dupes.join(', ')}`).toEqual([]);
  });

  test('every DUAL_LISTED class really is in two categories', () => {
    // The allowlist must not outlive the listing it documents.
    for (const id of DUAL_LISTED) {
      const cats = ENTITY_CATEGORIES.filter(c => c.classIds.includes(id)).map(c => c.id);
      expect(cats.length, `${id} is allowlisted but listed in ${cats.join(', ') || 'none'}`)
        .toBeGreaterThan(1);
    }
  });

  test('SUBCLASS_OF pairs are real classes and match the schema is_a', async () => {
    const data = await loadModelData();
    const known = new Set(classIds);
    const problems: string[] = [];
    for (const [child, parent] of Object.entries(SUBCLASS_OF)) {
      if (!known.has(child)) problems.push(`${child} (child) not in schema`);
      if (!known.has(parent)) problems.push(`${parent} (parent) not in schema`);
      // The indentation hint must not contradict the actual schema hierarchy.
      const actual = data.graph.classes?.[child]?.is_a;
      if (actual && actual !== parent) {
        problems.push(`${child}: SUBCLASS_OF says ${parent}, schema is_a says ${actual}`);
      }
    }
    expect(problems, problems.join('; ')).toEqual([]);
  });

  /**
   * Indentation is only rendered when the parent is in the SAME category
   * (EntityTable guards with classIdSet.has(parentId)), and it only looks
   * right when the parent is listed first. Cross-category pairs — e.g. the
   * Specimen*Observation classes sit in `lab` while Observation sits in
   * `observation` — are legitimate and simply render unindented, so they are
   * reported rather than failed.
   */
  test('same-category SUBCLASS_OF pairs list the parent before the child', () => {
    const problems: string[] = [];
    const crossCategory: string[] = [];
    for (const [child, parent] of Object.entries(SUBCLASS_OF)) {
      const cat = ENTITY_CATEGORIES.find(c => c.classIds.includes(child));
      if (!cat) {
        problems.push(`${child} not in any category`);
        continue;
      }
      const pi = cat.classIds.indexOf(parent);
      if (pi === -1) {
        crossCategory.push(`${child} (in ${cat.id}) vs parent ${parent}`);
        continue;
      }
      if (pi > cat.classIds.indexOf(child)) {
        problems.push(`${parent} listed after child ${child} in ${cat.id}`);
      }
    }
    if (crossCategory.length) {
      console.info(
        `SUBCLASS_OF pairs spanning categories (render unindented by design): ${crossCategory.join(', ')}`,
      );
    }
    expect(problems, problems.join('; ')).toEqual([]);
  });

  /*
   * `pins` (content-view context classes) is unrelated to `DEFAULT_PINS`
   * (first-visit canvas selection) below, despite the shared word.
   *
   * A stale pin is INVISIBLE at runtime — it just draws one extra box, or
   * silently drops out of getCategoryGroups' itemExists filter — so these are
   * the only thing that will notice a sync breaking one.
   */
  test('pins reference real classes', () => {
    const known = new Set(classIds);
    const bad = ENTITY_CATEGORIES.flatMap(cat =>
      cat.pins.filter(id => !known.has(id)).map(id => `${cat.id}:${id}`),
    );
    expect(bad, `Pinned classes absent from the schema: ${bad.join(', ')}`).toEqual([]);
  });

  test('a category never pins one of its own members', () => {
    // A member is already drawn; pinning it says "this category needs an
    // outside class" about a class that is not outside. Cheap to write by
    // accident once BodySite is a member of two categories and a pin of a
    // third.
    const bad = ENTITY_CATEGORIES.flatMap(cat =>
      cat.pins.filter(id => cat.classIds.includes(id)).map(id => `${cat.id}:${id}`),
    );
    expect(bad, `Categories pinning their own members: ${bad.join(', ')}`).toEqual([]);
  });

  test('pins are unique within a category', () => {
    const bad = ENTITY_CATEGORIES
      .filter(cat => new Set(cat.pins).size !== cat.pins.length)
      .map(cat => cat.id);
    expect(bad, `Duplicate pins in: ${bad.join(', ')}`).toEqual([]);
  });

  /*
   * The curatorial rule from the `pins` doc comment in entityCategories.ts,
   * asserted rather
   * than merely written down: value types are NOT pinned. Siggie rejected the
   * mechanically derived pin set for exactly this — "Do NOT pin
   * TimePoint/TimePeriod to Admin. It clutters up the diagram and gives it no
   * additional explanatory value."
   *
   * BodySite is deliberately absent from this list: it LOOKS like a value type
   * but carries domain content (site: AnatomicSiteEnum), and "where on the
   * body" is part of what a measurement is. Size is not the test.
   */
  test('value types are never pinned', () => {
    const VALUE_TYPES = ['TimePoint', 'TimePeriod', 'Quantity', 'Context'];
    const bad = ENTITY_CATEGORIES.flatMap(cat =>
      cat.pins.filter(id => VALUE_TYPES.includes(id)).map(id => `${cat.id}:${id}`),
    );
    expect(
      bad,
      `Value types pinned (see the pins doc comment in entityCategories.ts — reopen the ` +
        `decision there before deleting this test): ${bad.join(', ')}`,
    ).toEqual([]);
  });

  test('DEFAULT_PINS reference real, categorized classes', () => {
    const known = new Set(classIds);
    const categorized = new Set(ENTITY_CATEGORIES.flatMap(cat => cat.classIds));
    for (const id of DEFAULT_PINS) {
      expect(known.has(id), `default pin ${id} is not in the schema`).toBe(true);
      expect(categorized.has(id), `default pin ${id} is not in any category`).toBe(true);
    }
  });
});
