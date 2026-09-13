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
  const setup = async () => {
    const ds = new DataService(await loadModelData());
    render(<OwnershipLegend dataService={ds} onClose={() => {}} onSelect={() => {}} />);
    const counts = () => screen.getAllByRole('button')
      .filter(b => /\d+\s*(entities|attributes)/.test(b.textContent ?? ''));
    return { counts };
  };

  test('every disclosure starts collapsed', async () => {
    const { counts } = await setup();
    expect(counts().length).toBe(8);          // 3 slot rules + induced, x2
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

  test('the two counts on one rule are independent', async () => {
    const { counts } = await setup();
    const find = (re: RegExp) => counts().find(b => re.test(b.textContent ?? ''))!;
    fireEvent.click(find(/30\s*entities/));
    expect(find(/30\s*entities/).getAttribute('aria-expanded')).toBe('true');
    expect(find(/89\s*attributes/).getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(find(/89\s*attributes/));
    expect(find(/30\s*entities/).getAttribute('aria-expanded')).toBe('true');
  });

  /*
   * The formatting rule: an entity named by ONE attribute sits on the entity's
   * own line, and only a genuine list indents. Most entities are single, so
   * this is most of the panel's height.
   */
  test('a lone attribute is inline; several nest', async () => {
    const { counts } = await setup();
    fireEvent.click(counts().find(b => /89\s*attributes/.test(b.textContent ?? ''))!);
    const items = Array.from(document.querySelectorAll('ul.font-mono > li'));
    const activity = items.find(li => li.textContent?.startsWith('Activity'))!;
    expect(activity.textContent).toBe('Activity: Context.activity');
    expect(activity.querySelector('ul')).toBeNull();

    const bodySite = items.find(li => li.textContent?.startsWith('BodySite'))!;
    expect(bodySite.querySelector('ul')).not.toBeNull();
    expect(bodySite.querySelectorAll('ul > li').length).toBe(6);
  });
});
