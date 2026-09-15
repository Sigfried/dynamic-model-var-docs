/**
 * `{{kind:arg}}` placeholders: the substitution grammar, and dmvd's resolvers
 * for it.
 *
 * Two layers, tested separately because they live on opposite sides of the
 * package seam. `fillPlaceholders` is the package's and knows only the syntax;
 * `helpTextResolvers` is dmvd's and knows what a BDCHM class is.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fillPlaceholders, placeholdersIn } from '../help/parseHelpContent';
import { loadModelData } from '../utils/dataLoader';
import { DataService } from '../services/DataService';
import { helpTextResolvers } from '../explore/helpTextResolvers';

describe('fillPlaceholders', () => {
  const resolvers = {
    'model-description': (a: string) =>
      (a === 'Participant' ? 'A person in a study.' : undefined),
  };

  it('substitutes a resolved placeholder in place', () => {
    expect(fillPlaceholders('Before. {{model-description:Participant}} After.', resolvers))
      .toBe('Before. A person in a study. After.');
  });

  it('composes with authored prose around it', () => {
    // The reason placeholders beat a whole-field override: a step can frame
    // the model's own words rather than being replaced by them.
    const out = fillPlaceholders(
      'The model says:\n\n{{model-description:Participant}}\n\nWhich is why…',
      resolvers,
    );
    expect(out).toContain('The model says:');
    expect(out).toContain('A person in a study.');
    expect(out).toContain('Which is why…');
  });

  it('LEAVES an unresolved name visible rather than blanking it', () => {
    /*
     * The schema-drift case, and the whole reason this does not fall back to
     * an empty string: a class renamed upstream should name itself on screen,
     * not silently punch a hole in a step's prose.
     */
    expect(fillPlaceholders('x {{model-description:Gone}} y', resolvers))
      .toBe('x {{model-description:Gone}} y');
  });

  it('leaves an unregistered kind visible', () => {
    expect(fillPlaceholders('x {{nope:Participant}} y', resolvers))
      .toBe('x {{nope:Participant}} y');
  });

  it('tolerates whitespace inside the braces', () => {
    // Invisible in a markdown file, so failing on it would be a mystery.
    expect(fillPlaceholders('{{ model-description : Participant }}', resolvers))
      .toBe('A person in a study.');
  });

  it('is a no-op with no resolvers at all', () => {
    // A host that registers none must behave exactly as before.
    expect(fillPlaceholders('{{a:b}}', undefined)).toBe('{{a:b}}');
  });

  it('reads an arg containing dots', () => {
    // So a slot-shaped kind (`Visit.associated_participant`) stays possible
    // without changing the grammar.
    expect(placeholdersIn('{{slot-description:Visit.associated_participant}}'))
      .toEqual([['slot-description', 'Visit.associated_participant']]);
  });
});

describe("dmvd's text resolvers", () => {
  let resolve: ReturnType<typeof helpTextResolvers>;
  let dataService: DataService;

  beforeAll(async () => {
    dataService = new DataService(await loadModelData());
    resolve = helpTextResolvers(dataService);
  }, 30_000);

  it('returns the real schema description for a class', () => {
    const d = resolve['model-description']('Participant');
    expect(d).toBeDefined();
    expect(d).toMatch(/participant/i);
  });

  it('returns undefined for a class the schema does not have', () => {
    expect(resolve['model-description']('NoSuchClass')).toBeUndefined();
  });

  it('gives every categorized class a description', () => {
    /*
     * This is what makes a generated Tour 1 viable, so it is worth pinning:
     * a class that loses its description upstream would otherwise show a bare
     * `{{model-description:X}}` in the tour, and this says so first.
     */
    const missing = dataService.getCategoryGroups()
      .flatMap(g => g.classIds)
      .filter(id => !resolve['model-description'](id));
    expect(missing).toEqual([]);
  });

  it('resolves a category id to its display label', () => {
    expect(resolve['category-label']('admin')).toBe('Admin / Study');
    expect(resolve['category-label']('nope')).toBeUndefined();
  });

  /*
   * `ownership-count` exists so prose stops transcribing numbers a schema sync
   * can move. These pin the GRAMMAR and the invariants, deliberately not the
   * values — asserting `declared === 149` here would recreate exactly the
   * hand-copied constant the resolver removes, in the file that is supposed to
   * prove it is unnecessary. `data-integrity` is where a value is pinned.
   */
  describe('ownership-count', () => {
    it('answers the schema-wide totals, which must sum', () => {
      const n = (k: string) => Number(resolve['ownership-count'](k));
      expect(n('forward') + n('backward')).toBe(n('declared'));
      expect(n('declared')).toBeGreaterThan(0);
    });

    it('answers a rule count as `<rule-id>.<field>`', () => {
      const n = (k: string) => Number(resolve['ownership-count'](k));
      const rule = 'owns-target-forward-by-default';
      // Distinct owners/attrs/owned can never exceed the pairs they are drawn
      // from — the check that would catch the two being computed off different
      // sets, which is how two counts on one line come to disagree.
      for (const f of ['owners', 'attrs', 'owned']) {
        expect(n(`${rule}.${f}`)).toBeGreaterThan(0);
        expect(n(`${rule}.${f}`)).toBeLessThanOrEqual(n(`${rule}.total`));
      }
    });

    it('sums every slot rule\'s total to the declared count', () => {
      // The legend's three sections and the intro's 149 read the same data, so
      // a rule added or retired cannot leave the prose narrating a stale whole.
      const n = (k: string) => Number(resolve['ownership-count'](k));
      const slotRules = [
        'owns-target-forward-by-default',
        'belongs-to-target-backward-by-entity',
        'belongs-to-target-backward-by-attribute',
      ];
      expect(slotRules.reduce((s, r) => s + n(`${r}.total`), 0))
        .toBe(n('declared'));
    });

    it('leaves an unknown key unresolved rather than answering zero', () => {
      // A retired rule id must name itself on screen and fail the content
      // test; `0` would render as a plausible number and hide the drift.
      expect(resolve['ownership-count']('nope')).toBeUndefined();
      expect(resolve['ownership-count']('nope.total')).toBeUndefined();
      expect(resolve['ownership-count']('owns-target-forward-by-default.nope'))
        .toBeUndefined();
    });

    it('excludes induced pairs from `declared`', () => {
      // Rule 3 reads no attribute, so counting its edges among "the attributes
      // in the schema" would inflate a number the schema can be checked against.
      const n = (k: string) => Number(resolve['ownership-count'](k));
      expect(n('child-following-parent.total')).toBeGreaterThan(0);
      expect(n('declared')).toBeLessThan(
        n('declared') + n('child-following-parent.total'));
    });
  });
});

/**
 * Every placeholder the CONTENT FILE actually writes must resolve.
 *
 * This is the schema-drift guard the design leans on: `fillPlaceholders`
 * deliberately leaves an unresolved name visible rather than blanking it, and
 * this test is what makes that visible at CI time instead of mid-tour. An
 * upstream sync that renames a class fails here, naming the class and the kind.
 */
describe('the content file resolves against the live schema', () => {
  it('has no placeholder that would render as literal braces', async () => {
    const markdown = readFileSync(
      resolve(__dirname, '../explore/help-content.md'), 'utf8',
    );
    const resolvers = helpTextResolvers(new DataService(await loadModelData()));

    const unresolved = placeholdersIn(markdown)
      .filter(([kind, arg]) => resolvers[kind as keyof typeof resolvers]?.(arg) === undefined)
      .map(([kind, arg]) => `{{${kind}:${arg}}}`);

    expect(
      unresolved,
      `Placeholders in help-content.md that do not resolve: ${unresolved.join(', ')}`,
    ).toEqual([]);
  }, 30_000);
});
