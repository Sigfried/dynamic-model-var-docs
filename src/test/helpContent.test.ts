import { describe, test, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  parseHelpContent, tourSteps, tourPositions, parseAnchor,
} from '../help/parseHelpContent';

/**
 * The help content is authored as markdown and parsed into typed data, so a
 * formatting slip degrades silently: a mistyped field name yields an entry
 * with an empty description rather than an error, and a `data-help-id` that no
 * longer exists in the app yields a step that points at nothing.
 *
 * These tests are the proofreader. They run against the REAL content file, so
 * an authoring mistake fails the build instead of shipping to the one
 * stakeholder who will see this unattended.
 */
const markdown = readFileSync(
  resolve(__dirname, '../help/help-content.md'), 'utf8',
);
const content = parseHelpContent(markdown);
const steps = tourSteps(content);
const positions = tourPositions(content);

/**
 * Anchor kinds the dmvd app knows how to resolve. `help-id` is the built-in;
 * the rest are dmvd-specific resolvers registered by the host in
 * `explore/helpResolvers.ts` (and tested in `helpResolvers.test.ts`). Listed
 * here so a typo like `entity_row:` fails the build rather than silently
 * anchoring nothing.
 */
const ANCHOR_KINDS = new Set([
  'help-id', 'entity-row', 'entity-checkbox', 'slot-row', 'node-box',
]);

describe('help content', () => {
  test('parses into sections and entries', () => {
    expect(content.sections.length).toBeGreaterThan(0);
    expect(content.entries.size).toBeGreaterThan(0);
  });

  test('every entry has a title and a description', () => {
    const thin = [...content.entries.values()]
      .filter(e => !e.title || !e.description)
      .map(e => e.id);
    expect(thin, `Entries missing title/description: ${thin.join(', ')}`).toEqual([]);
  });

  test('the tour has steps, numbered 1..n with no gaps or repeats', () => {
    // A duplicate or missing number silently reorders the tour, which is the
    // kind of thing nobody notices until a stakeholder is watching.
    expect(steps.length).toBeGreaterThan(0);
    expect(steps.map(s => s.tour)).toEqual(
      Array.from({ length: steps.length }, (_, i) => i + 1),
    );
  });

  test('every Change: field is a parseable query string naming known params', () => {
    // The live field list, not a historical one: `exp`, `hidden` and `owners`
    // went with task 1 (expanding became selecting), and a step still naming
    // one would push a frame that composes to nothing.
    const known = new Set(['sel', 'detail', 'roots', 'sibs', 'dir', 'merge']);
    const bad: string[] = [];
    // Checks beats too -- a beat can carry its own Change:.
    for (const p of positions) {
      if (!p.change) continue;
      for (const [k] of new URLSearchParams(p.change)) {
        if (!known.has(k)) bad.push(`${p.entry.id}: unknown param "${k}"`);
      }
    }
    expect(bad, bad.join('; ')).toEqual([]);
  });

  test('interactions parse as lists, not as one run-on string', () => {
    const withInteractions = [...content.entries.values()]
      .filter(e => e.interactions.length > 0);
    expect(withInteractions.length).toBeGreaterThan(0);
    for (const e of withInteractions) {
      for (const item of e.interactions) {
        expect(item.length, `${e.id} has an empty interaction`).toBeGreaterThan(0);
        expect(item.startsWith('- '), `${e.id} interaction kept its bullet`).toBe(false);
      }
    }
  });

  test('every anchor names a known kind', () => {
    const bad: string[] = [];
    for (const e of content.entries.values()) {
      if (e.anchor.kind !== 'none' && !ANCHOR_KINDS.has(e.anchor.kind)) {
        bad.push(`${e.id}: unknown anchor kind "${e.anchor.kind}"`);
      }
      for (const b of e.beats ?? []) {
        if (b.anchor && b.anchor.kind !== 'none' && !ANCHOR_KINDS.has(b.anchor.kind)) {
          bad.push(`${e.id} beat: unknown anchor kind "${b.anchor.kind}"`);
        }
      }
    }
    expect(bad, bad.join('; ')).toEqual([]);
  });

  test('every help-id anchor is actually tagged in the app', () => {
    // A `data-help-id` that no longer exists yields help for something that
    // isn't there, and a tour step anchored to nothing. Greps the source
    // rather than rendering, so it catches the id being renamed anywhere.
    //
    // CHANGED with the Anchor: field. This used to check every entry ID
    // against the DOM, which forced an entry's identity to double as its
    // selector -- the constraint that made two steps unable to point at the
    // same element. Now identity is free and only ANCHORS must resolve.
    // Non-`help-id` kinds are resolved at runtime by host-registered
    // resolvers, so they cannot be checked by grepping for an attribute.
    const src = ['explore', 'help', 'components'].flatMap(dir => {
      const base = resolve(__dirname, `../${dir}`);
      return readdirSync(base, { recursive: true })
        .filter((f): f is string => typeof f === 'string' && /\.tsx?$/.test(f))
        .map(f => readFileSync(resolve(base, f), 'utf8'));
    }).join('\n');

    const wanted = new Set<string>();
    for (const e of content.entries.values()) {
      if (e.anchor.kind === 'help-id') wanted.add(e.anchor.arg);
      for (const b of e.beats ?? []) {
        if (b.anchor?.kind === 'help-id') wanted.add(b.anchor.arg);
      }
    }

    const untagged = [...wanted]
      .filter(id => !src.includes(`data-help-id="${id}"`));
    expect(
      untagged,
      `Anchors with no data-help-id in the app: ${untagged.join(', ')}`,
    ).toEqual([]);
  });

  test('entry ids are unique', () => {
    // The registry is a Map, so a duplicate id silently overwrites the first
    // entry and its help simply disappears.
    const ids = content.sections.flatMap(s => s.entries.map(e => e.id));
    expect(ids.length).toBe(new Set(ids).size);
  });

  test('a step with no beats is one position; a step with beats is one each', () => {
    // tourPositions is the seam the tour mechanism navigates, so its
    // arithmetic is worth pinning: beatless steps must not vanish, and a
    // step's beats must not collapse into one.
    const expected = steps.reduce((n, s) => n + Math.max(1, s.beats?.length ?? 1), 0);
    expect(positions.length).toBe(expected);
  });

  test('every tour position has text and an anchor', () => {
    const bad = positions
      .filter(p => !p.text || !p.anchor)
      .map(p => `${p.entry.id}#${p.beatIndex}`);
    expect(bad, `Tour positions with no text/anchor: ${bad.join(', ')}`).toEqual([]);
  });

  test('only a step\'s FIRST beat pushes its change', () => {
    /*
     * Under absolute state every beat re-applied its step's full query, which
     * was harmless: re-applying the same absolute state is idempotent. Pushing
     * the same DELTA once per beat is not — a four-beat step would stack four
     * identical frames and `back` would crawl out of them one useless pop at a
     * time. So the step's change belongs to beat 0, and a later beat pushes
     * only a change it declares itself.
     */
    for (const p of positions) {
      if (!p.beat || p.beat.change) continue;
      expect(p.change, `${p.entry.id}#${p.beatIndex}`)
        .toBe(p.beatIndex === 0 ? p.entry.change : undefined);
    }
  });

  test('a position that changes something says what it did', () => {
    // The bug this format exists to fix: a step silently altered the diagram
    // and the popover read as a description of whatever appeared.
    //
    // Truthiness is now the right test, where under absolute state it was the
    // bug: an empty `Change:` means "change nothing", so it needs no Action:.
    // An empty `State:` meant the DEFAULT view — clearing the diagram — which
    // very much did.
    const silent = positions
      .filter(p => p.change && !p.action)
      .map(p => `${p.entry.id}#${p.beatIndex}`);
    expect(
      silent,
      `Tour positions that change the app without saying so: ${silent.join(', ')}`,
    ).toEqual([]);
  });

});

describe('the spec section', () => {
  test('is not parsed as content', () => {
    // The spec lives in the document as a rendered `## Format` section so it
    // can be read as markdown. Its ### sub-headings are prose; if the skip
    // broke, "Anchors" and "Beats" would show up as help entries.
    expect(content.sections.map(s => s.title)).not.toContain('Format');
    for (const stray of ['Structure', 'Anchors', 'Beats', 'Actions', 'Change']) {
      expect(
        [...content.entries.keys()],
        `spec sub-heading "${stray}" leaked in as an entry`,
      ).not.toContain(stray);
    }
  });
});

describe('parking a field with _', () => {
  const parked = parseHelpContent(`
## Bits

### thing

- **Title:** T
- **Description:** D
- **_Tour:** 4
- **_Change:** sel=Nope
- **Anchor:** none
`);

  test('a parked field reads as absent', () => {
    const e = parked.entries.get('thing')!;
    expect(e.tour).toBeUndefined();
    expect(e.change).toBeUndefined();
  });

  test('the entry survives as help-only', () => {
    // Parking Tour: must not delete the entry -- the point is to keep written
    // work in the file while removing it from the tour.
    const e = parked.entries.get('thing')!;
    expect(e.title).toBe('T');
    expect(e.anchor).toEqual({ kind: 'none' });
    expect(tourSteps(parked)).toEqual([]);
  });

  test('an unparked field beside a parked one still reads', () => {
    const mixed = parseHelpContent(`
## Bits

### thing

- **Title:** T
- **Description:** D
- **_Tour:** 4
- **Change:** sel=Yes
`);
    const e = mixed.entries.get('thing')!;
    expect(e.tour).toBeUndefined();
    expect(e.change).toBe('sel=Yes');
  });
});

describe('parseAnchor', () => {
  test('omitted anchor falls back to the entry id as a help-id', () => {
    expect(parseAnchor(undefined, 'graph-canvas'))
      .toEqual({ kind: 'help-id', arg: 'graph-canvas' });
    expect(parseAnchor('', 'graph-canvas'))
      .toEqual({ kind: 'help-id', arg: 'graph-canvas' });
  });

  test('"none" parses to the anchorless form', () => {
    expect(parseAnchor('none', 'x')).toEqual({ kind: 'none' });
  });

  test('a bare id is shorthand for help-id', () => {
    expect(parseAnchor('selection-tree', 'x'))
      .toEqual({ kind: 'help-id', arg: 'selection-tree' });
  });

  test('kind:argument splits on the FIRST colon only', () => {
    // `slot-row:Entity.slot` is the common case; a resolver argument is free
    // to contain further punctuation without the parser mangling it.
    expect(parseAnchor('slot-row:MeasurementObservation.observation_type', 'x'))
      .toEqual({ kind: 'slot-row', arg: 'MeasurementObservation.observation_type' });
    expect(parseAnchor('entity-row:Participant', 'x'))
      .toEqual({ kind: 'entity-row', arg: 'Participant' });
  });
});
