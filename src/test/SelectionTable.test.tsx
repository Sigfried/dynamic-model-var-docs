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

describe('SelectionTable', () => {
  let ds: DataService;

  beforeAll(async () => {
    ds = new DataService(await loadModelData());
  });

  const renderTable = (selected: string[] = []) => {
    const onToggle = vi.fn();
    const result = render(
      <SelectionTable
        dataService={ds}
        selectedIds={new Set(selected)}
        onToggle={onToggle}
      />,
    );
    return { onToggle, ...result };
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
   * In-category is-a nesting (S1, 2026-08-27). The contract these guard is
   * that nesting is PRESENTATION ONLY: every class keeps exactly one checkbox
   * and toggling a parent must not touch its subclasses.
   */
  describe('is-a nesting', () => {
    const rowOf = (classId: string) =>
      document.querySelector(`[data-class-row="${classId}"]`) as HTMLElement;

    /** Left padding encodes depth (0.75rem + 1rem per level). */
    const depthOf = (classId: string) => {
      const px = rowOf(classId).style.paddingLeft;
      return Math.round((parseFloat(px) - 0.75) / 1);
    };

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
      for (const group of trees) {
        const inCategory = new Set(group.classIds);
        for (const id of group.classIds) {
          const parent = ds.getIsaParent(id);
          const nested = parent !== null && inCategory.has(parent);
          expect(depthOf(id), `${id} depth`).toBe(nested ? 1 : 0);
        }
      }
    });

    test('a class whose is-a parent is in another category stays a root and says so', () => {
      renderTable();
      // Both are in `lab`; their parent Observation is in `observation`.
      for (const id of ['SpecimenQualityObservation', 'SpecimenQuantityObservation']) {
        expect(ds.getIsaParent(id)).toBe('Observation');
        expect(depthOf(id), `${id} cannot nest across categories`).toBe(0);
        expect(rowOf(id).textContent, `${id} shows what it extends`).toContain('Observation');
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
