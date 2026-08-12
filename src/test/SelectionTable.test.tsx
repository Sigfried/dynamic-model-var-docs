/**
 * SelectionTable — the Explore SPA's left-hand entity multi-select
 * (docs/EXPLORE_VIZ.md, "Layout" region 1).
 *
 * The spec asks for "checkboxes + count-badge columns" matching the
 * Explorer's entity table. These tests assert the badges carry the SAME
 * numbers the Explorer computes, from the same DataService accessors, so the
 * two tables cannot silently drift apart.
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

  test('count badges match the Explorer\'s numbers for the same class', () => {
    renderTable();

    // Spot-check across categories, including a class with zero of some kinds.
    for (const id of ['Participant', 'Observation', 'Context', 'Activity', 'Quantity']) {
      const row = screen.getByText(id).closest('label')!;
      const ranges = ds.getRangeCountsByType(id);
      const expected = [
        ds.getSlotCount(id),
        ranges.cls,
        ranges.enm,
        ranges.typ,
        ds.getVariableCount(id),
      ];
      // Zeros render as '·' so the eye lands on non-empty counts.
      const rendered = [...row.querySelectorAll('[data-count-badge]')]
        .map(s => s.textContent ?? '')
        .map(t => (t === '·' ? 0 : Number(t)));

      expect(rendered, `${id} badge counts`).toEqual(expected);
    }
  });

  test('category headers show selected-of-total and collapse', () => {
    renderTable(['Context']);
    const groups = ds.getCategoryGroups();
    const obs = groups.find(g => g.classIds.includes('Context'))!;

    const header = screen.getByText(obs.label).closest('button')!;
    expect(header.textContent).toContain(`1 / ${obs.classIds.length}`);

    // Collapsing hides the group's rows.
    expect(screen.queryAllByText('Context').length).toBeGreaterThan(0);
    fireEvent.click(header);
    expect(screen.queryByText('Context')).toBeNull();
  });
});
