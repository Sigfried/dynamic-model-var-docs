import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { RelationMenu } from '../explore/RelationMenu';
import type { RelationGroupVM } from '../explore/OwnershipGraphView';

/**
 * The relation menu's presentation rules, all of which came from Siggie
 * looking at the first render (2026-08-27). They live in the component rather
 * than in `buildRelationGroups`, so the model tests in relationPositions.ts
 * cannot reach them.
 */
describe('RelationMenu', () => {
  const group = (items: Array<[string, boolean]>): RelationGroupVM => ({
    position: 'owns-mine',
    label: 'belong to me by my attribute',
    items: items.map(([other, drawn]) => ({ other, slots: ['s'], drawn })),
  });

  /** Open the trigger, then its one branch, and hand back the submenu. */
  const openBranch = (groups: RelationGroupVM[], shownCount = 0) => {
    const relatedCount = new Set(groups.flatMap(g => g.items.map(i => i.other))).size;
    render(
      <RelationMenu
        label="Thing" groups={groups}
        relatedCount={relatedCount} shownCount={shownCount}
        onAdd={vi.fn()} onRemove={vi.fn()}
      />,
    );
    fireEvent.click(document.querySelector('[data-relation-trigger]') as HTMLElement);
    fireEvent.click(document.querySelector('[data-relation-group]') as HTMLElement);
    return document.querySelector('[data-relation-submenu]') as HTMLElement;
  };

  test('the trigger reports both counts, not just the total', () => {
    // "13 related" alone hid how much of the neighbourhood was already drawn.
    render(
      <RelationMenu
        label="Organization" groups={[group([['A', true], ['B', false], ['C', false]])]}
        relatedCount={3} shownCount={1}
        onAdd={vi.fn()} onRemove={vi.fn()}
      />,
    );
    const trigger = screen.getByRole('button');
    expect(trigger.textContent).toContain('3');
    expect(trigger.textContent).toContain('related');
    expect(trigger.textContent).toContain('1 shown');
  });

  test('a drawn item is dimmed, never struck through', () => {
    // Siggie: "for items already displayed, gray out but don't strikeout" —
    // strikethrough reads as deleted, and these are the live ones.
    const menu = openBranch([group([['Drawn', true], ['Undrawn', false]])]);
    const drawn = within(menu).getByText('Drawn').closest('button')!;
    expect(drawn.className).not.toContain('line-through');
    expect(drawn.className).toContain('text-gray-400');
    const undrawn = within(menu).getByText('Undrawn').closest('button')!;
    expect(undrawn.className).not.toContain('text-gray-400');
  });

  test('`add all` is suppressed when only one item is addable', () => {
    // "add all 1" is a second control doing exactly what the item above it
    // does (Siggie: "no add all if count is 1").
    const one = openBranch([group([['Only', false]])]);
    expect(one.querySelector('[data-relation-add-all]')).toBeNull();
  });

  test('`add all` appears once a second item is addable, and names the cost', () => {
    const two = openBranch([group([['A', false], ['B', false], ['C', true]])]);
    const addAll = two.querySelector('[data-relation-add-all]')!;
    // Counts only the ADDABLE ones — C is already on the canvas.
    expect(addAll.textContent).toBe('add all 2');
  });

  test('the trigger opens on hover — click is only needed to expand', () => {
    // Siggie, 2026-08-27: with nothing drawn unasked, the menu is the main way
    // to grow the canvas, so looking inside one should not cost a click.
    render(
      <RelationMenu
        label="Thing" groups={[group([['A', false]])]}
        relatedCount={1} shownCount={0}
        onAdd={vi.fn()} onRemove={vi.fn()}
      />,
    );
    expect(document.querySelector('[data-relation-group]')).toBeNull();
    fireEvent.mouseEnter(document.querySelector('[data-relation-trigger]') as HTMLElement);
    expect(document.querySelector('[data-relation-group]')).not.toBeNull();
  });

  test('hovering one trigger closes any menu already open', () => {
    // Open state used to be per-instance with no coordination. On hover that
    // left BOTH menus on screen when the pointer crossed from one box to
    // another (Siggie, screenshot 2026-08-27). At most one, ever.
    render(
      <>
        <RelationMenu
          label="A" groups={[group([['X', false]])]}
          relatedCount={1} shownCount={0}
          onAdd={vi.fn()} onRemove={vi.fn()}
        />
        <RelationMenu
          label="B" groups={[group([['Y', false]])]}
          relatedCount={1} shownCount={0}
          onAdd={vi.fn()} onRemove={vi.fn()}
        />
      </>,
    );
    const [a, b] = [...document.querySelectorAll('[data-relation-trigger]')];
    fireEvent.mouseEnter(a);
    expect(document.querySelectorAll('[data-relation-group]')).toHaveLength(1);
    fireEvent.mouseEnter(b);
    expect(document.querySelectorAll('[data-relation-group]')).toHaveLength(1);
  });

  test('`hide all` removes every drawn entity in the group', () => {
    // It hides them even though each was selected in its own right: the group
    // control is about what is on the canvas, not how each entity got there.
    const onRemove = vi.fn();
    render(
      <RelationMenu
        label="Thing" groups={[group([['A', true], ['B', true], ['C', false]])]}
        relatedCount={3} shownCount={2}
        onAdd={vi.fn()} onRemove={onRemove}
      />,
    );
    fireEvent.click(document.querySelector('[data-relation-trigger]') as HTMLElement);
    fireEvent.click(document.querySelector('[data-relation-group]') as HTMLElement);
    const hideAll = document.querySelector('[data-relation-hide-all]')!;
    expect(hideAll.textContent).toBe('hide all 2');
    fireEvent.click(hideAll);
    expect(onRemove.mock.calls.map(c => c[0])).toEqual(['A', 'B']);
  });

  test('the group controls lead the group, above its items', () => {
    // Siggie asked for "add all" at the TOP of each menu group; it used to sit
    // below the last item, where its cost was read after the scroll.
    const menu = openBranch([group([['A', false], ['B', false]])]);
    const addAll = menu.querySelector('[data-relation-add-all]')!;
    const firstItem = menu.querySelector('[data-relation-item]')!;
    expect(addAll.compareDocumentPosition(firstItem))
      .toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });

  test('a one-item branch reads its label in the singular', () => {
    // The label is supplied by buildRelationGroups, which inflects it; this
    // pins that the menu renders what it is given rather than re-deriving.
    render(
      <RelationMenu
        label="Thing"
        groups={[{ ...group([['Only', false]]), label: 'belongs to me by my attribute' }]}
        relatedCount={1} shownCount={0}
        onAdd={vi.fn()} onRemove={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByRole('button'));
    const branch = document.querySelector('[data-relation-group]') as HTMLElement;
    expect(branch.textContent).toContain('belongs to me by my attribute');
  });
});
