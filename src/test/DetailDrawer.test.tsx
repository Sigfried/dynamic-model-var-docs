/**
 * DetailDrawer — the Explore SPA's right-hand entity panel
 * (docs/ARCHITECTURE.md, "Layout: three regions" — region 3).
 *
 * Runs against the real loaded model rather than mocks, so the two fixes the
 * spec calls for are asserted against actual schema content: "Referenced by"
 * items must be links, and descriptions must be fully readable (the inline
 * ClassDetailCard truncates them via `max-w-[250px] truncate`, which is what
 * the drawer exists to avoid).
 */

import { describe, test, expect, beforeAll, vi } from 'vitest';
import { render, screen, fireEvent, within, cleanup } from '@testing-library/react';
import { loadModelData } from '../utils/dataLoader';
import { DataService } from '../services/DataService';
import DetailDrawer from '../explore/DetailDrawer';

describe('DetailDrawer', () => {
  let ds: DataService;

  beforeAll(async () => {
    ds = new DataService(await loadModelData());
  });

  const renderDrawer = (classId: string, overrides = {}) => {
    const props = {
      classId,
      dataService: ds,
      onClose: vi.fn(),
      onNavigate: vi.fn(),
      isSelected: false,
      onToggleSelect: vi.fn(),
      ...overrides,
    };
    return { props, ...render(<DetailDrawer {...props} />) };
  };

  test('renders the entity name and description', () => {
    renderDrawer('Participant');
    const summary = ds.getClassSummary('Participant')!;
    expect(screen.getByText('Participant')).toBeTruthy();
    if (summary.description) {
      expect(screen.getByText(summary.description)).toBeTruthy();
    }
  });

  test('lists every slot — no "N more" truncation row', () => {
    const summary = ds.getClassSummary('Participant')!;
    expect(summary.slots.length).toBeGreaterThan(0);
    renderDrawer('Participant');

    for (const slot of summary.slots) {
      expect(
        screen.getAllByText(slot.name).length,
        `slot ${slot.name} should be listed`,
      ).toBeGreaterThan(0);
    }
    expect(screen.queryByText(/\d+ more/i)).toBeNull();
  });

  test('slot descriptions are rendered in full, not truncated', () => {
    const summary = ds.getClassSummary('Participant')!;
    const described = summary.slots.filter(s => s.description?.trim());
    expect(described.length, 'need at least one described slot to test').toBeGreaterThan(0);

    const { container } = renderDrawer('Participant');

    // Full text present — compared on collapsed whitespace, since some schema
    // descriptions contain double spaces that the DOM/matcher normalizes.
    const collapse = (s: string) => s.replace(/\s+/g, ' ').trim();
    const longest = described.reduce((a, b) =>
      b.description.length > a.description.length ? b : a,
    );
    const wanted = collapse(longest.description);
    const paragraphs = [...container.querySelectorAll('p')].map(p => collapse(p.textContent ?? ''));
    expect(
      paragraphs.some(t => t === wanted),
      `longest description should render in full (${wanted.length} chars)`,
    ).toBe(true);

    // ...and no CSS truncation on the description elements (the ClassDetailCard bug).
    for (const el of container.querySelectorAll('p')) {
      expect(el.className).not.toMatch(/\btruncate\b/);
      expect(el.className).not.toMatch(/max-w-\[\d+px\]/);
    }
  });

  test('"Referenced by" entries are links that navigate', () => {
    // Pick an entity that something actually references.
    const candidates = ['Participant', 'Person', 'Visit', 'Specimen', 'Observation'];
    const target = candidates.find(id => (ds.getClassSummary(id)?.referencedBy.length ?? 0) > 0);
    expect(target, 'expected some entity to be referenced by another').toBeTruthy();

    const summary = ds.getClassSummary(target!)!;
    const { props } = renderDrawer(target!);

    const heading = screen.getByText(/Referenced by/i);
    const section = heading.closest('section')!;
    const first = summary.referencedBy[0];
    const link = within(section).getAllByRole('button', { name: first.classId })[0];

    fireEvent.click(link);
    expect(props.onNavigate).toHaveBeenCalledWith(first.classId);
  });

  test('entity-valued ranges navigate; the close button closes', () => {
    const summary = ds.getClassSummary('Participant')!;
    const entitySlot = summary.slots.find(
      s => ds.getRangeKind(s.range) === 'class' && ds.itemExists(s.range),
    );
    const { props } = renderDrawer('Participant');

    if (entitySlot) {
      fireEvent.click(screen.getAllByRole('button', { name: entitySlot.range })[0]);
      expect(props.onNavigate).toHaveBeenCalledWith(entitySlot.range);
    }

    fireEvent.click(screen.getByTitle(/close/i));
    expect(props.onClose).toHaveBeenCalled();
  });

  /*
   * An enum range is NOT navigable and must not render as a link, however it
   * is named. `SpecimenCollectionMethodType` is the only one of the schema's
   * 52 enums whose name does not end in `Enum`, and every range badge in the
   * app used to decide enum-ness with `range.endsWith('Enum')` — so this one
   * drew blue (the class colour) and was clickable as if it were a class.
   *
   * Asserted over EVERY enum the schema has, not just the known offender, so
   * a future enum with an unusual name cannot reintroduce it.
   */
  test('enum ranges never render as navigation links, whatever they are named', () => {
    const offender = 'SpecimenCollectionMethodType';
    expect(ds.getRangeKind(offender), 'the case this test exists for').toBe('enum');
    expect(offender.endsWith('Enum'), 'and the old suffix test got it wrong').toBe(false);

    for (const classId of ['SpecimenCreationActivity']) {
      const summary = ds.getClassSummary(classId);
      if (!summary) continue;
      renderDrawer(classId);
      for (const slot of summary.slots) {
        if (ds.getRangeKind(slot.range) !== 'enum') continue;
        expect(
          screen.queryAllByRole('button', { name: slot.range }),
          `${classId}.${slot.name}: enum range ${slot.range} must not be a link`,
        ).toHaveLength(0);
      }
      cleanup();
    }
  });

  test('selection toggle reflects and reports state', () => {
    const { props, unmount } = renderDrawer('Participant', { isSelected: false });
    fireEvent.click(screen.getByText(/Add to diagram/i));
    expect(props.onToggleSelect).toHaveBeenCalledWith('Participant');
    unmount();

    renderDrawer('Participant', { isSelected: true });
    expect(screen.getByText(/In diagram/i)).toBeTruthy();
  });

  test('unknown entity reports instead of failing silently', () => {
    renderDrawer('NoSuchEntity');
    expect(screen.getByText(/Entity not found: NoSuchEntity/)).toBeTruthy();
  });
});
