/**
 * SelectionTable — the Explore SPA's left-hand entity multi-select
 * (docs/EXPLORE_VIZ.md, "Layout" region 1).
 *
 * The count-badge columns were removed on 2026-08-27 to give the name column
 * back its width, so the badge-parity test that used to live here is gone
 * too. What remains guards the selection contract: every categorized class is
 * listed exactly once, with one checkbox, and nesting never cascades.
 */

import { describe, test, expect, beforeAll, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { loadModelData } from '../utils/dataLoader';
import { DataService } from '../services/DataService';
import SelectionTable from '../explore/SelectionTable';
import { categoryView } from '../config/categoryView';

describe('SelectionTable', () => {
  let ds: DataService;

  beforeAll(async () => {
    ds = new DataService(await loadModelData());
  });

  const renderTable = (selected: string[] = []) => {
    const onToggle = vi.fn();
    const onShowCategory = vi.fn();
    const result = render(
      <SelectionTable
        dataService={ds}
        selectedIds={new Set(selected)}
        onToggle={onToggle}
        onShowCategory={onShowCategory}
      />,
    );
    return { onToggle, onShowCategory, ...result };
  };

  test('renders every categorized class with a checkbox', () => {
    renderTable();
    const groups = ds.getCategoryGroups();
    const allIds = groups.flatMap(g => g.classIds);
    expect(allIds.length).toBeGreaterThan(0);

    for (const id of allIds) {
      expect(screen.getAllByText(id).length, `${id} should be listed`).toBeGreaterThan(0);
    }
    expect(screen.getAllByRole('checkbox').length).toBe(allIds.length);
  });

  test('Context and Activity are selectable (2026-08-12 sync regression)', () => {
    const { onToggle } = renderTable();
    for (const id of ['Context', 'Activity']) {
      const row = screen.getByText(id).closest('label')!;
      const box = within(row).getByRole('checkbox');
      fireEvent.click(box);
      expect(onToggle).toHaveBeenCalledWith(id);
    }
  });

  test('checked state reflects selectedIds', () => {
    renderTable(['Participant']);
    const row = screen.getByText('Participant').closest('label')!;
    expect((within(row).getByRole('checkbox') as HTMLInputElement).checked).toBe(true);

    const other = screen.getByText('Visit').closest('label')!;
    expect((within(other).getByRole('checkbox') as HTMLInputElement).checked).toBe(false);
  });

  const groupOf = (classId: string) =>
    ds.getCategoryGroups().find(g => g.classIds.includes(classId))!;

  test('category headers show selected-of-total', () => {
    const obs = groupOf('Context');
    renderTable(['Context']);

    const header = screen.getByText(obs.label).closest('button')!;
    expect(header.textContent).toContain(`1 / ${obs.classIds.length}`);
  });

  test('category headers show no count when nothing is selected', () => {
    // The bare category total was dropped 2026-08-27; only selected-of-total
    // survives, so an unselected group's header carries no number at all.
    const obs = groupOf('Context');
    renderTable();

    const header = screen.getByText(obs.label).closest('button')!;
    expect(header.textContent).not.toMatch(/\d/);
  });

  test('collapsing a category hides its rows', () => {
    const obs = groupOf('Context');
    renderTable();

    const header = screen.getByText(obs.label).closest('button')!;
    expect(screen.queryAllByText('Context').length).toBeGreaterThan(0);
    fireEvent.click(header);
    expect(screen.queryByText('Context')).toBeNull();
  });

  /**
   * The content-view control (docs/TOURS_AND_CONTENT.md §1): one per category
   * header, replacing the canvas with that category's members plus its pins.
   */
  describe('content view control', () => {
    const controlFor = (categoryId: string) =>
      document.querySelector(`[data-show-category="${categoryId}"]`) as HTMLElement;

    test('every category header carries one', () => {
      renderTable();
      for (const g of ds.getCategoryGroups()) {
        expect(controlFor(g.id), `${g.id} needs a content-view control`).not.toBeNull();
      }
      expect(document.querySelectorAll('[data-show-category]').length)
        .toBe(ds.getCategoryGroups().length);
    });

    test('clicking it asks for the members plus the pins', () => {
      const { onShowCategory } = renderTable();
      const clinical = ds.getCategoryGroups().find(g => g.id === 'clinical')!;
      fireEvent.click(controlFor('clinical'));

      const drawn: string[] = onShowCategory.mock.calls[0][0];
      // Members are all there...
      for (const id of clinical.classIds) expect(drawn).toContain(id);
      // ...and so is the context the category does not make sense without.
      for (const id of ['Participant', 'Visit', 'Person']) expect(drawn).toContain(id);
      // But not the value types the mechanical rule would have swept in.
      expect(drawn).not.toContain('TimePoint');
      expect(drawn).not.toContain('Quantity');
    });

    test('a category with no pins asks for exactly its members', () => {
      const { onShowCategory } = renderTable();
      const survey = ds.getCategoryGroups().find(g => g.id === 'survey')!;
      expect(survey.pins).toEqual([]);
      fireEvent.click(controlFor('survey'));
      expect(onShowCategory.mock.calls[0][0]).toEqual(survey.classIds);
    });

    test('it does not toggle the category collapse', () => {
      // Two controls on one row: the draw click must not reach the header
      // button behind it and fold the category away.
      renderTable();
      expect(screen.queryAllByText('Context').length).toBeGreaterThan(0);
      fireEvent.click(controlFor('observation'));
      expect(screen.queryAllByText('Context').length).toBeGreaterThan(0);
    });

    test('it does not select anything on its own', () => {
      // Drawing a view is not ticking 12 checkboxes one at a time; the host
      // replaces the whole selection in one move.
      const { onToggle } = renderTable();
      fireEvent.click(controlFor('lab'));
      expect(onToggle).not.toHaveBeenCalled();
    });

    test('the control is absent when the host offers no canvas', () => {
      render(
        <SelectionTable dataService={ds} selectedIds={new Set()} onToggle={vi.fn()} />,
      );
      expect(document.querySelectorAll('[data-show-category]').length).toBe(0);
    });
  });

  describe('categoryView', () => {
    test('members first, then pins', () => {
      expect(categoryView({ classIds: ['A', 'B'], pins: ['C'] })).toEqual(['A', 'B', 'C']);
    });

    test('dedupes a pin that is also a member', () => {
      // A duplicate id in the selection would toggle two rows for one class.
      // Reachable in practice: BodySite is a member of clinical and lab, and
      // a pin of observation.
      expect(categoryView({ classIds: ['A', 'B'], pins: ['B', 'C'] })).toEqual(['A', 'B', 'C']);
    });

    test('every real category view is duplicate-free', () => {
      for (const g of ds.getCategoryTrees()) {
        const view = categoryView(g);
        expect(new Set(view).size, `${g.id} draws a class twice`).toBe(view.length);
      }
    });
  });

  /**
   * In-category is-a nesting (S1, 2026-08-27). The contract these guard is
   * that nesting is PRESENTATION ONLY: every class keeps exactly one checkbox
   * and toggling a parent must not touch its subclasses.
   */
  describe('is-a nesting', () => {
    /*
     * A class may be listed in more than one category (entityCategories.ts),
     * so it can have SEVERAL rows. `rowOf` keeps returning the first, which is
     * what tests about a single-listed class want; `rowsOf` and `depthIn` are
     * for the dual-listed ones, where "the" row is ambiguous.
     */
    const rowsOf = (classId: string) =>
      [...document.querySelectorAll(`[data-class-row="${classId}"]`)] as HTMLElement[];

    const rowOf = (classId: string) => rowsOf(classId)[0];

    /** Left padding encodes depth (0.75rem + 1rem per level). */
    const depthOfRow = (row: HTMLElement) =>
      Math.round((parseFloat(row.style.paddingLeft) - 0.75) / 1);

    const depthOf = (classId: string) => depthOfRow(rowOf(classId));

    /** Every depth this class renders at, one per listing, ascending. */
    const depthsOf = (classId: string) => rowsOf(classId).map(depthOfRow).sort();

    test('subclasses nest under an is-a parent in the same category', () => {
      renderTable();
      // Measured pairs: parent at depth 0, child at depth 1.
      for (const [parent, child] of [
        ['Observation', 'MeasurementObservation'],
        ['ObservationSet', 'SdohObservationSet'],
        ['Exposure', 'DrugExposure'],
        ['File', 'ImagingFile'],
        ['QuestionnaireResponseValue', 'QuestionnaireResponseValueString'],
      ]) {
        expect(depthOf(parent), `${parent} is a category root`).toBe(0);
        expect(depthOf(child), `${child} nests under ${parent}`).toBe(1);
      }
    });

    test('nesting matches the schema graph, not a hand-curated map', () => {
      renderTable();
      const trees = ds.getCategoryTrees();
      /*
       * Nesting is decided PER LISTING: the same class nests in a category
       * that holds its parent and stays a root in one that does not. So
       * collect the depth each category implies and compare against the set of
       * depths actually rendered, rather than asking for "the" depth.
       */
      const expected = new Map<string, number[]>();
      for (const group of trees) {
        const inCategory = new Set(group.classIds);
        for (const id of group.classIds) {
          const parent = ds.getIsaParent(id);
          const nested = parent !== null && inCategory.has(parent);
          expected.set(id, [...(expected.get(id) ?? []), nested ? 1 : 0]);
        }
      }
      for (const [id, depths] of expected) {
        expect(depthsOf(id), `${id} depths, one per listing`).toEqual([...depths].sort());
      }
    });

    test('a dual-listed class nests beside its parent and stays a root elsewhere', () => {
      renderTable();
      /*
       * These two used to be in `lab` ONLY, which made them unreachable from
       * the Observation hierarchy — the only route was clicking a Specimen row
       * on the canvas, and Observation looked like it had three children
       * instead of five. Since 2026-09-04 they are listed in `observation` too.
       *
       * The two listings behave differently BY DESIGN: under `observation` the
       * parent is present, so the row nests; under `lab` it is not, so the row
       * stays a root and keeps the "↳ Observation" hint saying what it extends.
       */
      for (const id of ['SpecimenQualityObservation', 'SpecimenQuantityObservation']) {
        expect(ds.getIsaParent(id)).toBe('Observation');
        expect(depthsOf(id), `${id} is listed twice`).toEqual([0, 1]);
        const root = rowsOf(id).find(r => depthOfRow(r) === 0)!;
        expect(root.textContent, `${id}'s root listing says what it extends`)
          .toContain('Observation');
      }
    });

    test('every categorized class still renders exactly one checkbox', () => {
      renderTable();
      const allIds = ds.getCategoryTrees().flatMap(g => g.classIds);
      expect(screen.getAllByRole('checkbox').length).toBe(allIds.length);
      for (const id of allIds) {
        expect(within(rowOf(id)).getAllByRole('checkbox').length, id).toBe(1);
      }
    });

    test('toggling a parent does not cascade to its subclasses', () => {
      const { onToggle } = renderTable(['Observation']);
      // Parent checked, subclass untouched — selection has no is-a semantics.
      expect((within(rowOf('Observation')).getByRole('checkbox') as HTMLInputElement).checked)
        .toBe(true);
      expect((within(rowOf('MeasurementObservation')).getByRole('checkbox') as HTMLInputElement).checked)
        .toBe(false);

      fireEvent.click(within(rowOf('Observation')).getByRole('checkbox'));
      expect(onToggle).toHaveBeenCalledTimes(1);
      expect(onToggle).toHaveBeenCalledWith('Observation');
    });

    test('Entity never appears — it is uncategorized by design', () => {
      renderTable();
      expect(ds.getCategoryTrees().flatMap(g => g.classIds)).not.toContain('Entity');
      expect(document.querySelector('[data-class-row="Entity"]')).toBeNull();
    });
  });
});

/**
 * The tree builder itself. Kept separate from the render tests because S3's
 * tour and any future selector both read this shape.
 */
describe('DataService.getCategoryTrees', () => {
  let ds: DataService;
  beforeAll(async () => {
    ds = new DataService(await loadModelData());
  });

  test('holds exactly the classes getCategoryGroups() does, losing none to nesting', () => {
    const groups = ds.getCategoryGroups();
    const trees = ds.getCategoryTrees();
    expect(trees.map(t => t.id)).toEqual(groups.map(g => g.id));

    const flatten = (nodes: { classId: string; children: unknown[] }[]): string[] =>
      nodes.flatMap(n => [
        n.classId,
        ...flatten(n.children as { classId: string; children: unknown[] }[]),
      ]);

    for (const tree of trees) {
      const group = groups.find(g => g.id === tree.id)!;
      expect(tree.classIds).toEqual(group.classIds);
      // Every member is reachable from the roots exactly once.
      expect(flatten(tree.roots).sort()).toEqual([...group.classIds].sort());
    }
  });

  test('outOfCategoryParent names only parents in another VISIBLE category', () => {
    const visible = new Set(ds.getCategoryGroups().flatMap(g => g.classIds));
    for (const tree of ds.getCategoryTrees()) {
      const inCategory = new Set(tree.classIds);
      for (const root of tree.roots) {
        const parent = ds.getIsaParent(root.classId);
        if (parent && !inCategory.has(parent) && visible.has(parent)) {
          expect(root.outOfCategoryParent).toBe(parent);
        } else {
          expect(root.outOfCategoryParent, `${root.classId}`).toBeUndefined();
        }
      }
    }
  });

  /**
   * Regression: every root extends `Entity`, so keying the hint on "parent not
   * in this category" put "↳ Entity" on 44 of 53 rows and buried the two hints
   * that mean something. Measured with a render probe, not reasoned about.
   */
  test('Entity is never named as an out-of-category parent', () => {
    const named = ds.getCategoryTrees()
      .flatMap(t => t.roots)
      .map(r => r.outOfCategoryParent)
      .filter((p): p is string => p !== undefined);
    expect(named).not.toContain('Entity');
    expect(new Set(named)).toEqual(new Set(['Observation']));
  });
});
