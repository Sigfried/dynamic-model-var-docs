import { describe, test, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { loadModelData } from '../utils/dataLoader';
import { DataService } from '../services/DataService';
import OwnershipLegend from '../explore/OwnershipLegend';
import { PIVOTS, shapeOf } from '../explore/ownershipPivots';

/**
 * The legend's pivots (`legend-list-orientation`, shipped 2026-09-15;
 * docs/LEGEND_ORIENTATION.md is the spec `SHAPES` transcribes).
 *
 * **Rewritten 2026-09-15 from the two-counts version**, deliberately and not as
 * a regression. The old file pinned `N entities` / `M attributes` as two depths
 * of one list grouped by `p.range`; that grouping is the thing
 * docs/LEGEND_ORIENTATION.md removed. Each rule now offers FOUR pivots over the
 * same pairs, grouped owner → attribute → owned.
 *
 * What survives from the old design, because it was never about the grouping:
 * everything starts collapsed, a disclosure closes again and takes its rows
 * with it, rules stay independent, a lone attribute sits inline, every
 * attribute row carries cardinality, and a name click reports one class.
 */
/**
 * The OUTERMOST node rows of an open pivot.
 *
 * `.lt` is the table; its direct `.lt-node` children are the top level. The
 * `>` matters — `PivotTable` is recursive and a nested level is also
 * `.lt-node`, so a loose selector counts rows at every depth (that mistake
 * read the backward rule's 5 owners as 14 while the component was right).
 */
const TOP_ROWS = '.lt > .lt-node';
/**
 * A top row's own NAME — the label minus its disclosure glyph, its arrow, and
 * its `.lt-count` badge, which would otherwise run onto the name (`Condition2`).
 */
const labelOf = (el: Element) => {
  const lab = el.querySelector('.lt-label')!.cloneNode(true) as Element;
  lab.querySelectorAll('.lt-count, .lt-toggle, .lt-arrow').forEach(n => n.remove());
  return lab.textContent!.replace(/\u00a0/g, ' ').trim();
};

describe('ownership legend pivots', () => {
  const setup = async (onSelect: (ids: string[]) => void = () => {}) => {
    const ds = new DataService(await loadModelData());
    render(<OwnershipLegend dataService={ds} onClose={() => {}} onSelect={onSelect} />);
    /** The expandable pivots — `total` on the owns side is a count, not a button. */
    const pivots = () => screen.getAllByRole('button')
      .filter(b => /\d+\s*(owners|attrs|owned|total)/.test(b.textContent ?? ''));
    const find = (re: RegExp) => pivots().find(b => re.test(b.textContent ?? ''))!;
    const topRows = () => Array.from(document.querySelectorAll(TOP_ROWS)).map(labelOf);
    return { pivots, find, topRows };
  };

  test('every pivot starts collapsed', async () => {
    const { pivots } = await setup();
    /*
     * 3 slot rules x 4 pivots = 12, all expandable. `total` on the owns side
     * briefly had no dropdown (it duplicates `attrs`); reversed 2026-09-15 —
     * the duplication is the point, and the two differ in DEFAULT STATE, with
     * `total` opening expanded.
     */
    expect(pivots().length).toBe(12);
    for (const b of pivots()) {
      expect(b.getAttribute('aria-expanded'), b.textContent ?? '').toBe('false');
    }
  });

  test('a pivot closes again, and closing removes its rows', async () => {
    const { find } = await setup();
    /*
     * NOT `Condition.affected_body_site` — that now appears in the intro as the
     * own-fwd example, so it is on screen before anything is opened. A sentinel
     * has to be a string only the ROWS produce.
     */
    const rows = () =>
      document.body.textContent!.match(/Person\.cause_of_death/g)?.length ?? 0;

    expect(rows()).toBe(0);
    fireEvent.click(find(/30\s*owned/));
    expect(find(/30\s*owned/).getAttribute('aria-expanded')).toBe('true');
    expect(rows()).toBeGreaterThan(0);
    fireEvent.click(find(/30\s*owned/));
    expect(find(/30\s*owned/).getAttribute('aria-expanded')).toBe('false');
    expect(rows()).toBe(0);                   // the 2026-09-13 bug: it must go away
  });

  /*
   * **Opening a pivot REPLACES the previous expansion** (Siggie, 2026-09-14).
   * Two simultaneous groupings of the same pairs would rebuild exactly the
   * ambiguity this rewrite removes — two lists of the same things, keyed
   * differently, at the same visual level.
   */
  test('opening one pivot closes the other three on the same rule', async () => {
    const { find } = await setup();
    fireEvent.click(find(/38\s*owners/));
    expect(find(/38\s*owners/).getAttribute('aria-expanded')).toBe('true');
    expect(find(/30\s*owned/).getAttribute('aria-expanded')).toBe('false');
    expect(find(/52\s*attrs/).getAttribute('aria-expanded')).toBe('false');

    fireEvent.click(find(/52\s*attrs/));
    expect(find(/52\s*attrs/).getAttribute('aria-expanded')).toBe('true');
    expect(find(/38\s*owners/).getAttribute('aria-expanded')).toBe('false');
  });

  test('rules stay independent of each other', async () => {
    // Comparing one rule's shape against another's is what the count line is for.
    const { find } = await setup();
    fireEvent.click(find(/38\s*owners/));
    fireEvent.click(find(/5\s*owners/));       // the entity-keyed exception
    expect(find(/38\s*owners/).getAttribute('aria-expanded')).toBe('true');
    expect(find(/5\s*owners/).getAttribute('aria-expanded')).toBe('true');
  });

  /*
   * The finding the whole rewrite rests on: the top-level row means the OWNER
   * in every section. Before, it was the owned thing under the forward rule and
   * the owner under the backward ones, at the same visual level with no cue.
   */
  describe('owner-first in every section', () => {
    test('the forward rule\'s owners pivot lists DECLARING classes', async () => {
      const { find, topRows } = await setup();
      fireEvent.click(find(/38\s*owners/));
      const rows = topRows();
      expect(rows.length).toBe(38);
      // Condition declares affected_body_site, so it owns BodySite.
      expect(rows).toContain('Condition');
    });

    test('the backward rule\'s owners pivot lists TARGET classes', async () => {
      /*
       * `own-bkwd` flips ownership, so here the owner is the range. This is
       * the pair of assertions that would have caught the old panel: both
       * sections say "owners" and they read off opposite structural ends.
       */
      const { find, topRows } = await setup();
      fireEvent.click(find(/5\s*owners/));
      const rows = topRows();
      expect(rows.length).toBe(5);
      expect(rows).toContain('Participant');
    });

    test('the by-attribute rule is 2 owners over 5 owned', async () => {
      /*
       * Under the old range grouping its 2 rows "matched nothing" and looked
       * arbitrary. Owner-first, those two entities ARE the owners, and the
       * section reads consistently with the rest.
       * ⚠️ A 2026-09-14 probe printed this as `5 owners / 2 owned`; the
       * script's labels were swapped, not the scheme.
       */
      const { find, topRows } = await setup();
      fireEvent.click(find(/2\s*owners/));
      expect(topRows().length).toBe(2);
    });
  });

  /*
   * The attribute-name pivot is the insight no other view in the app offers —
   * `Organization → performed_by (11) → {11 classes}` is a sentence. It needs
   * the middle level, which only the backward rules get.
   */
  test('a backward owners pivot nests attribute names under the owner', async () => {
    const { find } = await setup();
    fireEvent.click(find(/5\s*owners/));
    const org = Array.from(document.querySelectorAll(TOP_ROWS))
      .find(n => labelOf(n) === 'Organization');
    expect(org).toBeDefined();
    // A nested LEVEL, not a flat run of leaves.
    expect(org!.querySelector('.lt-kids > .lt-node')).not.toBeNull();
    expect(org!.textContent).toContain('performed_by');
  });

  test('the forward owners pivot does NOT nest attribute names', async () => {
    /*
     * Forward, the owner IS the declaring class, so owners → attrs would nest
     * a class over its own attribute names 1:1 — a re-sort, not a grouping.
     * Its children are leaves.
     */
    const { find } = await setup();
    fireEvent.click(find(/38\s*owners/));
    const condition = Array.from(document.querySelectorAll(TOP_ROWS))
      .find(n => labelOf(n) === 'Condition')!;
    expect(condition.querySelector('.lt-kids > .lt-node')).toBeNull();
    expect(condition.querySelectorAll('.lt-leaf').length).toBe(2);
  });

  /*
   * The columns, which are the point of the rewrite's second round: a row is
   * `name | arrow | target` landing in the same tracks as the header, not a
   * run of text. `legendTable.css` keeps them aligned through the subgrid
   * chain; these pin what lands in each cell.
   */
  describe('the leaf columns', () => {
    test('a forward leaf is attribute | —▶ | target', async () => {
      const { find } = await setup();
      fireEvent.click(find(/38\s*owners/));
      const condition = Array.from(document.querySelectorAll(TOP_ROWS))
        .find(n => labelOf(n) === 'Condition')!;
      const leaf = condition.querySelector('.lt-leaf')!;
      // The BARE attribute name here — the owner column already named the class.
      expect(leaf.querySelector('.lt-c1')!.textContent).toBe('affected_body_site0..1');
      // A real EdgeSample SVG, not a glyph — the legend never approximates
      // the ink the canvas strokes.
      expect(leaf.querySelector('.lt-arrow svg')).not.toBeNull();
      expect(leaf.querySelector('.lt-c2')!.textContent).toBe('BodySite');
    });

    test('a leaf arrow is NEVER mirrored — the verdict supplies the direction', () => {
      /*
       * `own-fwd` draws `——▶` and `own-bkwd` draws `——◀` natively
       * (`headDirection` in OWNERSHIP_VERDICTS), so a leaf takes the verdict's
       * own arrow and reads left-to-right in both.
       *
       * ⚠️ Mirroring on `!forward` is the bug Siggie caught 2026-09-15: it
       * flipped all four backward tables into `◀——` while the rule line above
       * them still read `——◀`.
       */
      return setup().then(({ find }) => {
        for (const re of [/25\s*owned/, /38\s*owners/]) {
          fireEvent.click(find(re));
          for (const svg of document.querySelectorAll('.lt-leaf .lt-arrow svg')) {
            expect(svg.getAttribute('style') ?? '').not.toContain('scaleX(-1)');
          }
          fireEvent.click(find(re));
        }
      });
    });

    test('`owns: owned` right-aligns its label, with one arrow on that row', async () => {
      /*
       * That pivot groups by the OWNED end, so the entity every arrow points at
       * would otherwise sit above the attributes pointing at it — the one place
       * `owner → attribute → owned` runs backwards.
       *
       * The fix is the LAYOUT, not the arrow (Siggie, 2026-09-15: "it breaks
       * the owner → attr → owned pattern; can we figure out a way to fix
       * that?"). The label is right-aligned into the last track and the arrow
       * goes on its row pointing at it:
       *
       *                            ——▶ BodySite
       *     Condition.affected_body_site
       *     ImagingFile.anatomical_site
       */
      const { find } = await setup();
      fireEvent.click(find(/30\s*owned/));
      const node = document.querySelector('.lt > .lt-node')!;
      const label = node.querySelector('.lt-label')!;
      expect(label.className).toContain('lt-label-right');

      /*
       * ONE arrow, on the label's own row and BEFORE the name, so the row reads
       * `——▶ BodySite` and the entity still ends the line. Not repeated per
       * leaf — that said the same thing N times.
       */
      expect(label.querySelectorAll('.lt-arrow svg').length).toBe(1);
      expect(node.querySelector('.lt-leaf .lt-arrow')).toBeNull();
      // Arrow first, name second (DOM order; the toggle's place is CSS).
      const kids = Array.from(label.children).map(c => c.className);
      expect(kids.indexOf('lt-arrow')).toBeLessThan(
        kids.findIndex(c => c.includes('cursor-pointer')));
      /*
       * The disclosure follows the label to the right edge. On an ordinary row
       * it sits in the indent track beside the name; on a right-aligned one
       * that edge is nowhere near the name, leaving the control stranded far
       * from the entity it opens (Siggie, 2026-09-15). Asserted through the
       * class, since jsdom does not apply the stylesheet.
       */
      expect(label.className).toContain('lt-label-right');
      expect(label.querySelector('.lt-toggle')).not.toBeNull();
    });

    test('a leaf drops what the levels above it already said', async () => {
      /*
       * `belongs to: owners` nests target → attribute → source, so by the time
       * a leaf renders, the target AND the attribute name are both above it.
       * The leaf is therefore the bare SOURCE class — no target column, and no
       * `Class.slot` repeating the attribute down the whole group (Siggie,
       * 2026-09-15: "i did mean src, not src.attr because attr is right above
       * it … gets rid of a lot of repetition").
       *
       * ⚠️ `attrs` keeps the QUALIFIED form: there the attribute name is two
       * levels up with the target in between, so the leaf has to say it.
       */
      const { find } = await setup();
      fireEvent.click(find(/5\s*owners/));
      const leaf = document.querySelector('.lt-leaf')!;
      expect(leaf.querySelector('.lt-c2')).toBeNull();
      expect(leaf.querySelector('.lt-c1')!.textContent).toMatch(/^\w+\s*\d/);
      expect(leaf.querySelector('.lt-c1')!.textContent).not.toMatch(/\w\.\w/);

      fireEvent.click(find(/5\s*owners/));
      fireEvent.click(find(/9\s*attrs/));
      expect(document.querySelector('.lt-leaf .lt-c1')!.textContent)
        .toMatch(/^\w+\.\w+/);
    });

    test('no leaf repeats what its immediate parent said', async () => {
      /*
       * The rule behind `src` vs `src.attr` (Siggie, 2026-09-15). A leaf whose
       * parent level is the ATTRIBUTE NAME shows the bare source class —
       * `additive → SpecimenContainer`, not `SpecimenContainer.additive`
       * eleven times over. A leaf under an ENTITY level keeps the qualified
       * form, because the attribute has not been named above it.
       *
       * Asserted over the SHAPES table rather than one rendering, so a new
       * pivot cannot quietly reintroduce the repetition.
       */
      const offenders: string[] = [];
      const checked: string[] = [];
      for (const fwd of [true, false]) {
        for (const pv of PIVOTS) {
          const shape = shapeOf(pv, fwd);
          if (shape.levels[shape.levels.length - 1] !== 'attr') continue;
          const what = `${fwd ? 'owns' : 'belongs to'}/${pv}`;
          checked.push(what);
          if (shape.leaf.includes('srcAttr')) offenders.push(what);
        }
      }
      // The shapes this rule actually governs, so the assertion below cannot
      // pass by finding nothing to check.
      expect(checked).toEqual([
        'owns/attrs', 'owns/total', 'belongs to/owners',
      ]);
      expect(offenders).toEqual([]);
    });

    test('each pivot carries a header naming its columns', async () => {
      const { find } = await setup();
      fireEvent.click(find(/38\s*owners/));
      const heads = Array.from(document.querySelectorAll('.lt-head .lt-h'))
        .map(h => h.textContent!.replace(/\u00a0/g, ' ').trim());
      expect(heads).toEqual(['Source entity', 'Attribute name', 'Target entity', '']);
      // The fourth cell is the arrow column: an EdgeSample, so it has no text.
      expect(document.querySelector('.lt-head .lt-h-arrow svg')).not.toBeNull();
    });

    test('the header changes with the pivot', async () => {
      const { find } = await setup();
      fireEvent.click(find(/5\s*owners/));
      const heads = Array.from(document.querySelectorAll('.lt-head .lt-h'))
        .map(h => h.textContent!.replace(/\u00a0/g, ' ').trim());
      // Backward: the owner is the TARGET, and the arrow arrives at its label.
      expect(heads[0]).toBe('Target entity');
      expect(document.querySelector('.lt-head .lt-h .lt-arrow svg')).not.toBeNull();
      expect(heads[1]).toBe('Attribute name');
    });
  });

  /*
   * Cardinality on every attribute row, in the notation the Cardinality
   * section defines. It replaced a `↠` that appeared on multivalued rows only
   * and so read as arbitrary — and which could not distinguish `0..1` from
   * `1..1` at all, since both were simply unmarked.
   */
  test('every attribute row carries a cardinality label', async () => {
    const { find } = await setup();
    fireEvent.click(find(/52\s*attrs/));
    const cards = Array.from(document.querySelectorAll('.lt-leaf .lt-card'))
      .map(c => c.textContent!.trim());
    expect(cards.length).toBeGreaterThan(50);
    expect(cards.every(c => /^\d\.\.[1*]$/.test(c) || c === 'loop')).toBe(true);
    // The distinction the old marker could not make: both were unmarked.
    expect(cards).toContain('1..1');
    expect(cards).toContain('0..1');
  });

  /*
   * **No single-child collapsing.** An earlier cut folded a one-child group
   * onto its parent's line; commented out of the spec until the columns settle
   * (Siggie, 2026-09-15), because a folded row does not line up with the header
   * its siblings align to. So EVERY node nests, including one-attribute ones.
   */
  test('every node nests, including a one-attribute group', async () => {
    const { find } = await setup();
    fireEvent.click(find(/30\s*owned/));
    const items = Array.from(document.querySelectorAll(TOP_ROWS));

    const activity = items.find(n => labelOf(n) === 'Activity')!;
    expect(activity.querySelectorAll('.lt-leaf').length).toBe(1);
    expect(activity.querySelector('.lt-leaf')!.textContent).toContain('Context.activity');

    const bodySite = items.find(n => labelOf(n) === 'BodySite')!;
    expect(bodySite.querySelectorAll('.lt-leaf').length).toBe(6);
  });

  /*
   * Per-node disclosure: every node opens on its own, which is what makes
   * `STARTS_OPEN` a default rather than a fixed state.
   */
  test('a node closes without closing its neighbours', async () => {
    /*
     * The per-node triangles ADJUST what a pivot already showed you; they are
     * not how you assemble it. So the interesting direction is closing one row
     * of an expanded pivot, not opening one of a collapsed pivot.
     */
    const { find } = await setup();
    fireEvent.click(find(/38\s*owners/));
    const rowFor = (name: string) => Array.from(document.querySelectorAll(TOP_ROWS))
      .find(n => labelOf(n) === name)!;
    expect(rowFor('Condition').hasAttribute('data-open')).toBe(true);

    fireEvent.click(rowFor('Condition').querySelector('.lt-toggle')!);
    expect(rowFor('Condition').hasAttribute('data-open')).toBe(false);
    expect(rowFor('Consent').hasAttribute('data-open')).toBe(true);
  });

  test('a two-level pivot seeds BOTH depths open', async () => {
    // Seeding only the top level still made the reader click into every owner
    // to reach the attribute names beneath it (Siggie, 2026-09-15).
    const { find } = await setup();
    fireEvent.click(find(/5\s*owners/));
    const org = Array.from(document.querySelectorAll(TOP_ROWS))
      .find(n => labelOf(n) === 'Organization')!;
    expect(org.hasAttribute('data-open')).toBe(true);
    const inner = org.querySelectorAll('.lt-kids > .lt-node');
    expect(inner.length).toBeGreaterThan(1);
    for (const n of inner) expect(n.hasAttribute('data-open')).toBe(true);
  });

  /*
   * A name in the legend ADDS to the canvas. It used to run `applyCase`, which
   * clears the selection first, so following a name out of the legend wiped the
   * diagram the reader had the legend open to understand (Siggie, 2026-09-13).
   *
   * The component only reports WHICH ids were clicked — that it adds rather
   * than replaces is ExploreApp's wiring (`addToCanvas`, not `applyCase`), so
   * what is pinned here is that one click names exactly one class.
   */
  test('clicking a name reports exactly that one class', async () => {
    const picked: string[][] = [];
    const { find } = await setup(ids => picked.push(ids));
    fireEvent.click(find(/30\s*owned/));

    const row = Array.from(document.querySelectorAll(TOP_ROWS))
      .find(n => labelOf(n) === 'BodySite')!;
    // The class link, not the disclosure triangle that precedes it.
    fireEvent.click(row.querySelector('.lt-label button:not(.lt-toggle)')!);

    expect(picked).toEqual([['BodySite']]);
  });

  /*
   * The intro's counts are LIVE (`{{ownership-count:…}}`). A placeholder that
   * failed to resolve would render as literal braces, which is the visible
   * failure mode the resolver is designed around — so assert none survives.
   */
  test('the intro prose resolves every count placeholder', async () => {
    await setup();
    const text = document.body.textContent!;
    expect(text).not.toContain('{{');
    // The accounting that anchors the panel: 149 = 89 + 60.
    expect(text.replace(/\s+/g, ' ')).toMatch(/149 attributes in the schema/);
  });
});
