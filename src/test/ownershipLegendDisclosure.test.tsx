import { describe, test, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { loadModelData } from '../utils/dataLoader';
import { DataService } from '../services/DataService';
import OwnershipLegend from '../explore/OwnershipLegend';

/**
 * The legend's disclosures (TASKS `legend-two-counts`).
 *
 * Each rule carries two independent counts, which is two ways for the panel to
 * mislead: a list that will not close, and two open lists of the same entity
 * names reading as one. Both were reported on 2026-09-13, so both are pinned.
 */
describe('ownership legend disclosures', () => {
  const setup = async (onSelect: (ids: string[]) => void = () => {}) => {
    const ds = new DataService(await loadModelData());
    render(<OwnershipLegend dataService={ds} onClose={() => {}} onSelect={onSelect} />);
    const counts = () => screen.getAllByRole('button')
      .filter(b => /\d+\s*(entities|attributes)/.test(b.textContent ?? ''));
    return { counts };
  };

  test('every disclosure starts collapsed', async () => {
    const { counts } = await setup();
    // 3 slot rules x2. Was 8 until 2026-09-15, when the induced section was
    // removed: those edges serve layout only and are no longer shown anywhere
    // (TASKS `induced-clutter`, OWNERSHIP_CLASSIFICATION §Rule 3).
    expect(counts().length).toBe(6);
    for (const b of counts()) {
      expect(b.getAttribute('aria-expanded'), b.textContent ?? '').toBe('false');
    }
  });

  test('a disclosure closes again, and closing removes its rows', async () => {
    const { counts } = await setup();
    const attrs = () => counts().find(b => /89\s*attributes/.test(b.textContent ?? ''))!;
    const rows = () =>
      document.body.textContent!.match(/Condition\.affected_body_site/g)?.length ?? 0;

    expect(rows()).toBe(0);
    fireEvent.click(attrs());
    expect(attrs().getAttribute('aria-expanded')).toBe('true');
    expect(rows()).toBe(1);
    fireEvent.click(attrs());
    expect(attrs().getAttribute('aria-expanded')).toBe('false');
    expect(rows()).toBe(0);                   // the reported bug: it must go away
  });

  /*
   * The two counts are two DEPTHS of one list, so opening one closes the other
   * on that rule — holding both would be holding one list in two states.
   */
  test('opening one count closes the other on the same rule', async () => {
    const { counts } = await setup();
    const find = (re: RegExp) => counts().find(b => re.test(b.textContent ?? ''))!;
    fireEvent.click(find(/30\s*entities/));
    expect(find(/30\s*entities/).getAttribute('aria-expanded')).toBe('true');
    expect(find(/89\s*attributes/).getAttribute('aria-expanded')).toBe('false');

    fireEvent.click(find(/89\s*attributes/));
    expect(find(/89\s*attributes/).getAttribute('aria-expanded')).toBe('true');
    expect(find(/30\s*entities/).getAttribute('aria-expanded')).toBe('false');
  });

  test('rules stay independent of each other', async () => {
    const { counts } = await setup();
    const find = (re: RegExp) => counts().find(b => re.test(b.textContent ?? ''))!;
    fireEvent.click(find(/30\s*entities/));
    fireEvent.click(find(/5\s*entities/));    // the range-keyed exception
    expect(find(/30\s*entities/).getAttribute('aria-expanded')).toBe('true');
    expect(find(/5\s*entities/).getAttribute('aria-expanded')).toBe('true');
  });

  /*
   * Both depths render the SAME rows. This is the one that would have caught
   * the 2026-09-13 misreading, where the two counts rendered two different
   * listings and the entity view lost its per-entity counts.
   */
  test('both depths list the same entities', async () => {
    const { counts } = await setup();
    const find = (re: RegExp) => counts().find(b => re.test(b.textContent ?? ''))!;
    const topRows = () => Array.from(document.querySelectorAll('ul.font-mono > li'))
      .map(li => li.textContent!.match(/^[A-Za-z]+/)![0]);

    fireEvent.click(find(/30\s*entities/));
    const collapsed = topRows();
    fireEvent.click(find(/89\s*attributes/));
    expect(topRows()).toEqual(collapsed);
    expect(collapsed.length).toBe(30);
  });

  test('the collapsed view carries a per-entity attribute count', async () => {
    const { counts } = await setup();
    fireEvent.click(counts().find(b => /30\s*entities/.test(b.textContent ?? ''))!);
    // \u00a0 throughout: the badge uses &nbsp; so a count never wraps away
    // from its noun, or from the entity name it belongs to.
    // The badge is also the row's disclosure, so it carries a chevron.
    const rows = Array.from(document.querySelectorAll('ul.font-mono > li'))
      .map(li => li.textContent!.trim().replace(/\u00a0/g, ' ').replace(/[⌄⌃]/g, ''));
    expect(rows).toContain('BodySite 6 attributes');
    expect(rows).toContain('Activity 1 attribute');       // singular
  });

  /*
   * The formatting rule: an entity named by ONE attribute sits on the entity's
   * own line, and only a genuine list indents. Most entities are single, so
   * this is most of the panel's height.
   */
  /*
   * Each entity row opens on its own. The two counts set every row in a rule
   * at once; nothing but this toggles ONE, and the entity name cannot serve
   * because clicking it selects the class on the canvas.
   */
  describe('per-entity rows', () => {
    const rowText = () => Array.from(document.querySelectorAll('ul.font-mono > li'))
      .map(li => li.textContent!.replace(/\u00a0/g, ' '));

    test('a row opens without opening its neighbours', async () => {
      const { counts } = await setup();
      fireEvent.click(counts().find(b => /30\s*entities/.test(b.textContent ?? ''))!);
      expect(rowText().some(r => r.includes('Condition.affected_body_site'))).toBe(false);

      const badge = screen.getAllByRole('button')
        .find(b => /6\s*attributes/.test(b.textContent ?? ''))!;   // BodySite's own
      fireEvent.click(badge);

      const rows = rowText();
      expect(rows.find(r => r.startsWith('BodySite'))).toContain('Condition.affected_body_site');
      expect(rows.find(r => r.startsWith('CauseOfDeath'))).not.toContain('.');
    });

    test('clicking a rule count clears per-row overrides', async () => {
      const { counts } = await setup();
      fireEvent.click(counts().find(b => /30\s*entities/.test(b.textContent ?? ''))!);
      fireEvent.click(screen.getAllByRole('button')
        .find(b => /6\s*attributes/.test(b.textContent ?? ''))!);
      // "show me all the attributes" must not leave hand-opened rows shut.
      fireEvent.click(counts().find(b => /89\s*attributes/.test(b.textContent ?? ''))!);
      const rows = rowText();
      expect(rows.find(r => r.startsWith('CauseOfDeath'))).toContain('Person.cause_of_death');
      expect(rows.find(r => r.startsWith('BodySite'))).toContain('Condition.affected_body_site');
    });
  });

  /*
   * Cardinality on every attribute row, in the notation the Cardinality
   * section defines. It replaced a `↠` that appeared on multivalued rows only
   * and so read as arbitrary — and which could not distinguish `0..1` from
   * `1..1` at all, since both were simply unmarked.
   */
  test('every attribute row carries a cardinality label', async () => {
    const { counts } = await setup();
    fireEvent.click(counts().find(b => /89\s*attributes/.test(b.textContent ?? ''))!);
    const rows = Array.from(document.querySelectorAll('ul.font-mono li'))
      .map(li => li.textContent!.replace(/\u00a0/g, ' '))
      .filter(t => t.includes('.') && !/\battributes$/.test(t));
    expect(rows.length).toBeGreaterThan(50);
    expect(rows.filter(r => !/\d\.\.[1*]/.test(r))).toEqual([]);
    // The distinction the old marker could not make: both were unmarked.
    expect(rows.some(r => r.endsWith('1..1'))).toBe(true);
    expect(rows.some(r => r.endsWith('0..1'))).toBe(true);
  });

  test('a lone attribute is inline; several nest', async () => {
    const { counts } = await setup();
    fireEvent.click(counts().find(b => /89\s*attributes/.test(b.textContent ?? ''))!);
    const items = Array.from(document.querySelectorAll('ul.font-mono > li'));
    const activity = items.find(li => li.textContent?.startsWith('Activity'))!;
    // Inline, and the badge is suppressed: the one attribute is already there.
    expect(activity.textContent!.replace(/\u00a0/g, ' '))
      .toBe('Activity: Context.activity 1..1');
    expect(activity.querySelector('ul')).toBeNull();

    const bodySite = items.find(li => li.textContent?.startsWith('BodySite'))!;
    expect(bodySite.querySelector('ul')).not.toBeNull();
    expect(bodySite.querySelectorAll('ul > li').length).toBe(6);
  });

  /*
   * A name in the legend ADDS to the canvas. It used to run `applyCase`, which
   * clears the selection first, so following a name out of the legend wiped
   * the diagram the reader had the legend open to understand (Siggie,
   * 2026-09-13). The legend lists pairs, and a pair is worth seeing next to
   * what is already drawn.
   *
   * The component only reports WHICH ids were clicked — that it adds rather
   * than replaces is ExploreApp's wiring (`addToCanvas`, not `applyCase`), so
   * what is pinned here is that one click names exactly one class.
   */
  test('clicking a name reports exactly that one class', async () => {
    const picked: string[][] = [];
    const { counts } = await setup(ids => picked.push(ids));
    fireEvent.click(counts().find(b => /30\s*entities/.test(b.textContent ?? ''))!);

    const row = Array.from(document.querySelectorAll('ul.font-mono > li'))
      .find(li => li.textContent!.startsWith('BodySite'))!;
    fireEvent.click(row.querySelector('button')!);      // the entity name link

    expect(picked).toEqual([['BodySite']]);
  });
});
