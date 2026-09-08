import { describe, test, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  parseHelpContent, tourSteps, tourPositions, tourNames, parseAnchor,
  DEFAULT_TOUR,
} from '../help/parseHelpContent';
import { stripAlerts } from '../help/HelpLayer';
import { DEFAULTS, INSTRUCTION_PARAMS } from '../explore/exploreState';

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
  resolve(__dirname, '../explore/help-content.md'), 'utf8',
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

  test('every entry id is unique', () => {
    /*
     * Pinned 2026-09-07, when the `###` slug became an ADDRESS a popover shows
     * (docs/TASKS.md item 3c): an author reads an id off the screen and
     * searches for it, so two blocks answering to one id is now a wrong
     * answer, not just untidy.
     *
     * It fails silently otherwise. `content.entries` is a Map built with
     * `entries.set(entry.id, entry)`, so a duplicate `### ` slug OVERWRITES
     * the earlier entry -- the popover, the Help menu and every `Anchor:`
     * pointing at it all quietly resolve to the last one in the file.
     * Compares against the section list, which keeps every entry parsed.
     */
    const all = content.sections.flatMap(s => s.entries).map(e => e.id);
    const dupes = all.filter((id, i) => all.indexOf(id) !== i);
    expect(dupes, `Duplicate entry ids: ${[...new Set(dupes)].join(', ')}`)
      .toEqual([]);
  });

  test('a position address names its entry, and its beat when it has one', () => {
    // The address is what item 3c put on screen: the entry slug, plus the
    // 1-based beat ordinal for a beat. A step's OPENING position (beatIndex
    // -1) addresses as the bare slug -- it is the step's own text.
    /*
     * ACROSS EVERY TOUR, not just the default one. `tourPositions(content)`
     * with no name runs the FIRST tour in the file, which today is the
     * one-step BDCHM intro -- no beats, so it exercises only the bare-slug
     * half and this test passed with the beat half deleted. Beats live in the
     * Walkthrough.
     */
    const positions = tourNames(content).flatMap(t => tourPositions(content, t));
    expect(positions.length).toBeGreaterThan(0);
    // The beat half has to be reachable or the assertion below is vacuous.
    expect(positions.some(p => p.beatCount > 0)).toBe(true);
    for (const p of positions) {
      const expected = p.beatIndex > 0 || (p.beatIndex === 0 && p.beatCount > 0)
        ? `${p.entry.id} \u25b8${p.beatIndex + 1}`
        : p.entry.id;
      expect(p.address, `address for ${p.entry.id} beat ${p.beatIndex}`)
        .toBe(expected);
      /*
       * What the tag COPIES is the markdown header, not the address: it has to
       * paste into a file search and match one line. A bare id also matches
       * every prose mention of the word, and an id carrying the beat ordinal
       * matches nothing.
       */
      expect(p.searchFor, `searchFor ${p.entry.id}`).toBe(`### ${p.entry.id}`);
    }
  });

  test("every entry's searchFor actually finds its header in the file", () => {
    // The point of the string is that it can be pasted into a search, so pin
    // that against the real file rather than against the parser's own idea of
    // it: a heading style change here would otherwise pass silently.
    const positions = tourNames(content).flatMap(t => tourPositions(content, t));
    for (const p of positions) {
      const hits = markdown.split('\n').filter(l => l.trimEnd() === p.searchFor);
      expect(hits.length, `"${p.searchFor}" should match exactly one line`)
        .toBe(1);
    }
  });

  test('the tour has steps, in file order', () => {
    // Ordering is by position in the file (2026-08-28), which replaced the
    // authored 1..n numbering: a number made inserting a step a renumbering of
    // every step after it, and a gap or a duplicate silently reordered the
    // tour. There is no longer a number to get wrong -- what this pins is that
    // the steps come back in the order they are written.
    expect(steps.length).toBeGreaterThan(0);
    const orders = steps.map(s => s.order);
    expect(orders).toEqual([...orders].sort((a, b) => a - b));
    // Every step belongs to the tour it was asked for.
    expect(new Set(steps.map(s => s.tour)).size).toBe(1);
  });

  test('no entry still carries an old numeric Tour:', () => {
    /*
     * `Tour:` held a 1-based number until 2026-08-28 and holds a tour NAME
     * now. A leftover `Tour: 3` parses cleanly as a tour named "3" -- a
     * one-step tour nobody asked for, and a step silently missing from the
     * real one. Cheap to catch, invisible otherwise.
     */
    const numeric = [...content.entries.values()]
      .filter(e => e.tour !== undefined && /^\d/.test(e.tour))
      .map(e => `${e.id} (Tour: ${e.tour})`);
    expect(numeric, `Entries with an unmigrated numeric Tour:: ${numeric.join(', ')}`)
      .toEqual([]);
  });

  test('positions are numbered 1..n across the tour', () => {
    // The number the viewer sees ("4.2 / 6") is computed from rank now, so it
    // is the thing worth pinning rather than the field it used to read.
    const stepNumbers = [...new Set(positions.map(p => p.step))];
    expect(stepNumbers).toEqual(
      Array.from({ length: steps.length }, (_, i) => i + 1),
    );
  });

  test('every Change: field is a parseable query string naming known params', () => {
    // The live field list, not a historical one: `exp`, `hidden` and `owners`
    // went with task 1 (expanding became selecting), and a step still naming
    // one would push a frame that composes to nothing.
    /*
     * Derived from `DEFAULTS` plus the instruction params, rather than typed
     * out: a hand-kept copy of this list goes stale the moment a param is
     * added, and it did — `panels` was rejected here while working correctly
     * everywhere else.
     */
    const known = new Set([...Object.keys(DEFAULTS), ...INSTRUCTION_PARAMS]);
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

  test('an entry field parses with or without the bold markers', () => {
    /*
     * `- Width: 500` and `- **Width:** 500` both work.
     *
     * They did not always: `extractField` matched only the bold form, so a
     * field written the way BEAT fields are written parsed as nothing at all --
     * no error, the step just rendered as though it were absent. That is how
     * `Width:` shipped broken on the intro step. Siggie: "the parser should
     * just strip ** from the field lines (can't imagine needing them for
     * something else)".
     */
    const withBold = parseHelpContent(`
## S

### e

- **Title:** T
- **Width:** 500
- **Description:** D
`).entries.get('e')!;
    const without = parseHelpContent(`
## S

### e

- Title: T
- Width: 500
- Description: D
`).entries.get('e')!;
    expect(without.width).toBe(withBold.width);
    expect(without.title).toBe(withBold.title);
    expect(without.width).toBe(500);
  });

  test('field names are case-insensitive, like beat fields already were', () => {
    // The beat reader lower-cased its field names from the start, so requiring
    // capitals at entry level was an inconsistency rather than a rule
    // (Siggie, 2026-08-28: "what about case sensitivity for field names").
    const e = parseHelpContent(`
## S

### e

- title: T
- WIDTH: 500
- **Description:** D
`).entries.get('e')!;
    expect(e.title).toBe('T');
    expect(e.width).toBe(500);
    expect(e.description).toBe('D');
  });

  test('a prose bullet with a colon is not read as a field', () => {
    // `fieldOf` requires the name to be a single word, so a description's
    // bullet list -- which routinely contains colons -- cannot be misread.
    const e = parseHelpContent(`
## S

### e

- **Title:** T
- **Description:** D
  - one thing: with a colon in it
  - another: here
`).entries.get('e')!;
    expect(e.description).toContain('one thing: with a colon in it');
  });

  test("a beat's field is not mistaken for its step's", () => {
    /*
     * The bold markers used to be what kept these apart. With both spellings
     * accepted, `extractField` searches only ABOVE `- **Beats:**` instead --
     * without that, a beat's `Change:` read as the entry's and the step pushed
     * it twice.
     */
    const md = parseHelpContent(`
## S

### e

- **Title:** T
- **Tour:** Walkthrough
- **Description:** D
- **Beats:**
  1. one
     - Change: sel=Person
     - Anchor: none
`);
    const entry = md.entries.get('e')!;
    expect(entry.change).toBeUndefined();
    expect(entry.anchor.kind).toBe('help-id');   // the default, not the beat's
    expect(entry.beats?.[0].change).toBe('sel=Person');
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

  test('a step with beats gets an opening position plus one per beat', () => {
    /*
     * tourPositions is the seam the tour mechanism navigates, so its
     * arithmetic is worth pinning: beatless steps must not vanish, a step's
     * beats must not collapse into one, and a step WITH beats must open on its
     * own description before any beat reveals (2026-08-28) -- without that
     * opening position the step starts on description+beat-1 together and the
     * setup can never be read alone.
     */
    const expected = steps.reduce(
      (n, s) => n + (s.beats?.length ? s.beats.length + 1 : 1), 0,
    );
    expect(positions.length).toBe(expected);
  });

  test('a step with beats opens on its description alone', () => {
    for (const step of steps) {
      if (!step.beats?.length) continue;
      const opening = positions.find(p => p.entry.id === step.id);
      expect(opening!.beatIndex, `${step.id} opens on a beat`).toBe(-1);
      expect(opening!.blocks, `${step.id} opening blocks`).toEqual([step.description]);
    }
  });

  test('every tour position has text and an anchor', () => {
    const bad = positions
      .filter(p => !p.text || !p.anchor)
      .map(p => `${p.entry.id}#${p.beatIndex}`);
    expect(bad, `Tour positions with no text/anchor: ${bad.join(', ')}`).toEqual([]);
  });

  test("a step's change is pushed once, by the position that opens it", () => {
    /*
     * Under absolute state every beat re-applied its step's full query, which
     * was harmless: re-applying the same absolute state is idempotent. Pushing
     * the same DELTA once per beat is not — a four-beat step would stack four
     * identical frames and `back` would crawl out of them one useless pop at a
     * time.
     *
     * Since the step opens on its own position (beatIndex -1), that is where
     * its change belongs; a BEAT pushes only a change it declares itself.
     * Letting beat 0 also inherit it would double-push the very thing this
     * guards against.
     */
    for (const p of positions) {
      if (p.beat?.change) continue;
      const expected = p.beat ? undefined : p.entry.change;
      expect(p.change, `${p.entry.id}#${p.beatIndex}`).toBe(expected);
    }
  });

  test('a step pushes its change exactly once across all its positions', () => {
    // The arithmetic the test above implies, stated directly.
    for (const step of steps) {
      if (!step.change) continue;
      const pushes = positions
        .filter(p => p.entry.id === step.id && p.change === step.change);
      expect(pushes.length, `${step.id} pushes its change ${pushes.length}x`).toBe(1);
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
    //
    // An empty `Only:` is the same exemption for the same reason. It draws
    // nothing; it only declines to inherit, which is what an opening step
    // wants — there is no transition to narrate, and a `✓` receipt for one
    // would be the noise this rule exists to prevent.
    const silent = positions
      .filter(p => p.change && !p.action)
      .map(p => `${p.entry.id}#${p.beatIndex}`);
    /*
     * A WARNING, not a failure (Siggie, 2026-09-08). The rule is real — a step
     * that alters the canvas silently is the bug the format exists to fix —
     * but as an error it blocked authoring on a judgement the author is better
     * placed to make, and the honest remedy is sometimes to show the change
     * rather than narrate it (see the `Action:` TODO in help-content.md).
     *
     * The enforcement that matters now lives in the APP: the popover shows
     * this same warning while the author is looking at the step, gated on the
     * dev-only `showAddresses` switch. See `HelpLayer.tsx`.
     */
    if (silent.length) {
      console.warn(
        `[help-content] positions that change the app without an Action:: ${silent.join(', ')}`,
      );
    }
  });

});

describe('the spec section', () => {
  test('is not parsed as content', () => {
    // The spec lives in the document as a rendered `## Format` section so it
    // can be read as markdown. Its ### sub-headings are prose; if the skip
    // broke, "Anchors" and "Beats" would show up as help entries.
    expect(content.sections.map(s => s.title)).not.toContain('Format');
    for (const stray of ['Structure', 'Anchors', 'Beats', 'Actions', 'Alerts', 'Change']) {
      expect(
        [...content.entries.keys()],
        `spec sub-heading "${stray}" leaked in as an entry`,
      ).not.toContain(stray);
    }
  });
});

describe('alerts and Once:', () => {
  /**
   * An alert is a markdown blockquote, so nothing in the PARSER knows about
   * it -- these tests pin the authoring contract that the renderer depends on,
   * plus the one field that does exist.
   */

  test('Once: parses, and is absent when not written', () => {
    const parsed = parseHelpContent(`
## Bits

### noted

- **Title:** T
- **Description:** D

  > Heed this.
- **Once:** intro
- **Anchor:** none

### plain

- **Title:** T
- **Description:** D
- **Anchor:** none
`);
    expect(parsed.entries.get('noted')!.once).toBe('intro');
    expect(parsed.entries.get('plain')!.once).toBeUndefined();
  });

  test('an alert stays inside the description block', () => {
    // The block reader runs to the next `- **Field:**`, and a blockquote is
    // neither that nor a terminator. If this regressed, the alert would be
    // silently dropped from the description rather than fail loudly.
    const e = parseHelpContent(`
## Bits

### noted

- **Title:** T
- **Description:** Before.

  > Heed this.

  After.
- **Anchor:** none
`).entries.get('noted')!;
    expect(e.description).toContain('> Heed this.');
    expect(e.description).toContain('After.');
  });

  test('stripAlerts removes a whole alert and nothing else', () => {
    const block = 'Before.\n\n> Line one.\n> Line two.\n\nAfter.';
    expect(stripAlerts(block)).toBe('Before.\n\nAfter.');
  });

  test('stripAlerts empties a block that was only an alert', () => {
    // The renderer filters these out; a block left as whitespace would render
    // as a dimmed blank gap where the note used to be.
    expect(stripAlerts('> Just the note.')).toBe('');
  });

  test('every authored alert prefixes all of its lines', () => {
    /*
     * The one authoring trap in the format. Markdown's lazy continuation makes
     * an unprefixed second line part of the quote when RENDERING, but
     * `stripAlerts` works line by line, so that line survives a dismissal and
     * is left stranded outside the note that explained it.
     */
    const stranded: string[] = [];
    for (const entry of content.entries.values()) {
      const blocks = [entry.description, ...(entry.beats ?? []).map(b => b.text)];
      for (const block of blocks) {
        const lines = block.split('\n');
        lines.forEach((line, i) => {
          const prev = lines[i - 1];
          if (prev === undefined || !/^\s{0,3}>/.test(prev)) return;
          if (/^\s{0,3}>/.test(line) || line.trim() === '') return;
          stranded.push(`${entry.id}: "${line.trim()}"`);
        });
      }
    }
    expect(
      stranded,
      `Alert continuation lines missing their "> ": ${stranded.join('; ')}`,
    ).toEqual([]);
  });

  test('an alert that can be dismissed says so with Once:', () => {
    /*
     * Not the reverse rule -- an entry may carry `Once:` before its alert is
     * written. This one catches the real slip: authoring the intro note and
     * forgetting the field, so the viewer meets it on every visit forever.
     * Only checked for the FIRST tour step, since that is the orientation
     * case; a mid-tour caution is meant to be permanent.
     */
    const first = steps[0];
    if (!first) return;
    if (first.description.includes('\n> ') || first.description.startsWith('> ')) {
      expect(
        first.once,
        `tour step 1 (${first.id}) has an alert but no Once: to dismiss it`,
      ).toBeTruthy();
    }
  });
});

describe('parking a field with _', () => {
  const parked = parseHelpContent(`
## Bits

### thing

- **Title:** T
- **Description:** D
- **_Tour:** Walkthrough
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
- **_Tour:** Walkthrough
- **Change:** sel=Yes
`);
    const e = mixed.entries.get('thing')!;
    expect(e.tour).toBeUndefined();
    expect(e.change).toBe('sel=Yes');
  });
});

describe('multi-line Description:', () => {
  /*
   * `Description:` used to stop at the end of its own line, so an authored
   * draft written as one flowing block had to be split across
   * Description/Context/Interactions -- Siggie, 2026-08-28: "the way you
   * implemented the format really does not capture my intent... it lost the
   * bullets". It is read as a markdown block now.
   */
  const md = parseHelpContent(`
## Bits

### thing

- **Title:** T
- **Description:** Opening sentence.

  A second paragraph, with a list:
  - one
  - two
- **Anchor:** none
`);
  const e = md.entries.get('thing')!;

  test('keeps the lines that follow the colon', () => {
    expect(e.description).toContain('A second paragraph');
    expect(e.description).toContain('- one');
    expect(e.description).toContain('- two');
  });

  test('does not stop at the blank line between paragraphs', () => {
    // Stopping there would silently drop everything after it, which is the
    // failure mode worth pinning: it loses content without an error.
    expect(e.description.split('\n\n').length).toBeGreaterThan(1);
  });

  test('dedents, so markdown does not read the block as a code fence', () => {
    // Four leading spaces are a code block in markdown. The authored indent
    // shows the lines belong to the field; it must not survive into the value.
    for (const line of e.description.split('\n')) {
      expect(line.startsWith('    ')).toBe(false);
    }
  });

  test('the next entry field ends the block', () => {
    expect(e.description).not.toContain('Anchor');
    expect(e.anchor).toEqual({ kind: 'none' });
  });

  test('a single-line description is unchanged', () => {
    const one = parseHelpContent(`
## Bits

### thing

- **Title:** T
- **Description:** Just the one line.
- **Anchor:** none
`);
    expect(one.entries.get('thing')!.description).toBe('Just the one line.');
  });
});

describe('beats replace by default', () => {
  /*
   * Beats REPLACE what is showing; `Keep: true` opts into accumulating.
   *
   * This is the inverse of the accumulate-by-default model that shipped
   * earlier the same day, and it is the second reversal of this decision --
   * worth stating why rather than reading it as churn. Accumulation put the
   * newest text at the BOTTOM of a growing block, so the reader had to hunt
   * for where to start. Deeper dimming, a blue rule and an entrance animation
   * were all tried before giving up on it (see WORKLOG); Siggie, 2026-08-28:
   * "the blue line isn't quite doing it. let's change the default to
   * Clear: true". When a beat replaces, what is on screen IS the new thing.
   */
  const md = parseHelpContent(`
## Bits

### step

- **Title:** T
- **Tour:** Walkthrough
- **Description:** The intro.
- **Anchor:** none
- **Beats:**
  1. one
     - Description: First reveal.
  2. two
     - Description: Second reveal.
`);
  const pos = tourPositions(md);

  test('the step opens on its own text, alone', () => {
    // Siggie, 2026-08-28: "the popover starts on Beat 1, it should start on
    // the stuff before Beat 1."
    expect(pos[0].beatIndex).toBe(-1);
    expect(pos[0].blocks).toEqual(['The intro.']);
  });

  test('each beat replaces what was showing', () => {
    expect(pos[1].blocks).toEqual(['First reveal.']);
    expect(pos[2].blocks).toEqual(['Second reveal.']);
  });

  test('the description does not survive the first beat', () => {
    // The whole point of the inversion: under the old default the intro sat
    // above every beat for the rest of the step.
    expect(pos[1].blocks).not.toContain('The intro.');
  });

  test('text is the blocks joined, for consumers that want one string', () => {
    expect(pos[2].text).toBe('Second reveal.');
  });

  test('a two-beat step is three positions', () => {
    expect(pos.length).toBe(3);
    expect(pos.map(p => p.beatIndex)).toEqual([-1, 0, 1]);
  });

  test('every position knows how many beats its step has', () => {
    // What the popover draws its reveal dots from.
    expect(pos.map(p => p.beatCount)).toEqual([2, 2, 2]);
  });

  test('a step with no beats is a single block', () => {
    const plain = parseHelpContent(`
## Bits

### step

- **Title:** T
- **Tour:** Walkthrough
- **Description:** Just this.
- **Anchor:** none
`);
    const p = tourPositions(plain)[0];
    expect(p.blocks).toEqual(['Just this.']);
    expect(p.text).toBe('Just this.');
    // No beats means no dots.
    expect(p.beatCount).toBe(0);
    expect(tourPositions(plain).length).toBe(1);
  });

  test('a step with an empty description starts from the first beat', () => {
    const noDesc = parseHelpContent(`
## Bits

### step

- **Title:** T
- **Tour:** Walkthrough
- **Description:**
- **Anchor:** none
- **Beats:**
  1. one
     - Description: Only this.
`);
    // With nothing to show before the first beat there is no opening
    // position -- the step starts on beat 1 because that is all it has.
    const p = tourPositions(noDesc);
    expect(p[0].beatIndex).toBe(0);
    expect(p[0].blocks).toEqual(['Only this.']);
  });
});

describe('Keep: on a beat', () => {
  const md = parseHelpContent(`
## Bits

### step

- **Title:** T
- **Tour:** Walkthrough
- **Description:** The intro.
- **Anchor:** none
- **Beats:**
  1. one
     - Description: Keeps the intro.
     - Keep: true
  2. two
     - Description: Fresh thought.
  3. three
     - Description: Keeps the fresh thought.
     - Keep: true
`);
  const pos = tourPositions(md);

  // Positions are: [0] the opening (description alone), then one per beat.
  test('a Keep: beat adds to what is showing', () => {
    expect(pos[1].blocks).toEqual(['The intro.', 'Keeps the intro.']);
  });

  test('a beat without Keep: replaces, even after one that kept', () => {
    expect(pos[2].blocks).toEqual(['Fresh thought.']);
  });

  test('Keep: accumulates onto whatever the previous beat left showing', () => {
    expect(pos[3].blocks).toEqual(['Fresh thought.', 'Keeps the fresh thought.']);
  });

  test('the opening position is the description alone', () => {
    expect(pos[0].blocks).toEqual(['The intro.']);
  });

  test('a bare `- Keep:` counts as true', () => {
    // It is a marker; writing it without a value plainly means it.
    const bare = parseHelpContent(`
## Bits

### step

- **Title:** T
- **Tour:** Walkthrough
- **Description:** Intro.
- **Anchor:** none
- **Beats:**
  1. one
     - Description: Added.
     - Keep:
`);
    expect(tourPositions(bare)[1].blocks).toEqual(['Intro.', 'Added.']);
  });

  test('`Keep: false` is not a keep', () => {
    const off = parseHelpContent(`
## Bits

### step

- **Title:** T
- **Tour:** Walkthrough
- **Description:** Intro.
- **Anchor:** none
- **Beats:**
  1. one
     - Description: Replaces.
     - Keep: false
`);
    expect(tourPositions(off)[1].blocks).toEqual(['Replaces.']);
  });

  test('no authored beat has empty text', () => {
    /*
     * Empty beat text used to be INVISIBLE: under the accumulating default the
     * blocks above it filled the popover, so a blank beat looked like nothing
     * had gone wrong. Now that a beat replaces, it is the only block and the
     * position renders blank. Caught exactly this in `selection-tree` when the
     * default was inverted.
     */
    const empty: string[] = [];
    for (const entry of content.entries.values()) {
      (entry.beats ?? []).forEach((b, i) => {
        if (!b.text.trim()) empty.push(`${entry.id} beat ${i + 1}`);
      });
    }
    expect(empty, `Beats with no text: ${empty.join(', ')}`).toEqual([]);
  });

  test('a leftover `Clear:` is inert, not an accidental keep', () => {
    /*
     * `Clear:` was the OLD field and meant the opposite. It is gone, so it now
     * parses as an unknown field and is ignored -- which happens to leave the
     * beat replacing, i.e. doing what `Clear: true` asked for. That is the
     * safe direction, and this test pins it so a stale `Clear:` in a draft
     * cannot silently start accumulating.
     */
    const stale = parseHelpContent(`
## Bits

### step

- **Title:** T
- **Tour:** Walkthrough
- **Description:** Intro.
- **Anchor:** none
- **Beats:**
  1. one
     - Description: Fresh.
     - Clear: true
`);
    expect(tourPositions(stale)[1].blocks).toEqual(['Fresh.']);
  });
});

describe('<details> section wrappers', () => {
  /*
   * Each `## Section` is wrapped in `<details>` so the file folds on GitHub.
   * The wrapper puts a `</details>` after the LAST entry of each section --
   * inside that entry's block, since nothing else ends it -- so a multi-line
   * field has to stop at it. Otherwise the closing tag is swallowed into the
   * description and rendered as literal text in the popover.
   */
  const md = parseHelpContent(`
<details open>
<summary><b>Sec</b></summary>

## Sec

### last

- **Title:** T
- **Description:** Line one.

  Line two.

</details>
`);

  test('a closing tag does not leak into the last entry', () => {
    const d = md.entries.get('last')!.description;
    expect(d).not.toContain('details');
    expect(d).toBe('Line one.\n\nLine two.');
  });

  test('the wrapped section still parses', () => {
    expect(md.sections.map(s => s.title)).toEqual(['Sec']);
    expect([...md.entries.keys()]).toEqual(['last']);
  });

  test('every `## ` section is inside a fold', () => {
    /*
     * The point of the wrapper is uniformity -- an unwrapped section renders as
     * a loose fragment between two folds.
     *
     * This checks CONTAINMENT, not a one-to-one match with the summaries.
     * There are legitimately more folds than headings: a `<details>` can nest
     * (the TODO section folds its "Original unfinished draft text" separately),
     * and a fold need not have a `## ` heading at all -- the TODO block itself
     * has none, which is what makes the parser skip it at the `^## ` guard
     * before PROSE_SECTIONS is even consulted.
     */
    const headings = [...markdown.matchAll(/^## (.+)$/gm)]
      .map(m => m[1].trim())
      // The spec quotes `## Section Title` inside a fenced example.
      .filter(h => !h.startsWith('Section Title'));
    const summaries = new Set(
      [...markdown.matchAll(/<summary><b>(.+?)<\/b><\/summary>/g)].map(m => m[1].trim()),
    );
    const unwrapped = headings.filter(h => !summaries.has(h));
    expect(unwrapped, `Sections with no <summary>: ${unwrapped.join(', ')}`).toEqual([]);
  });

  test('open/closed tags balance', () => {
    // Only tags at the start of a line are structure; the spec section
    // discusses `<details>` in prose and those mentions must not be counted.
    const opens = (markdown.match(/^<details[ >]/gm) ?? []).length;
    const closes = (markdown.match(/^<\/details>/gm) ?? []).length;
    expect(closes).toBe(opens);
  });
});

describe('named tours', () => {
  /*
   * `Tour:` names a tour and file order gives the position (2026-08-28,
   * Siggie: "file order, but maybe `Tour: Walkthrough` so that multiple tours
   * could be used"). One field does both jobs, and there is no number to
   * renumber.
   */
  const md = parseHelpContent(`
## Bits

### c

- **Title:** C
- **Tour:** Walkthrough
- **Description:** D
- **Anchor:** none

### a

- **Title:** A
- **Tour:** Deep dive
- **Description:** D
- **Anchor:** none

### b

- **Title:** B
- **Tour:** Walkthrough
- **Description:** D
- **Anchor:** none
`);

  test('a tour holds only its own steps, in file order', () => {
    expect(tourSteps(md, 'Walkthrough').map(e => e.id)).toEqual(['c', 'b']);
    expect(tourSteps(md, 'Deep dive').map(e => e.id)).toEqual(['a']);
  });

  test('tours are listed in the order their first step appears', () => {
    expect(tourNames(md)).toEqual(['Walkthrough', 'Deep dive']);
  });

  test('no tour named means the first one in the file', () => {
    expect(tourSteps(md).map(e => e.id)).toEqual(['c', 'b']);
  });

  test('step numbers come from rank in the tour, not from a field', () => {
    expect(tourPositions(md, 'Walkthrough').map(p => p.step)).toEqual([1, 2]);
  });

  test('a bare Tour: with no value joins the default tour', () => {
    const bare = parseHelpContent(`
## Bits

### thing

- **Title:** T
- **Tour:**
- **Description:** D
- **Anchor:** none
`);
    expect(bare.entries.get('thing')!.tour).toBe(DEFAULT_TOUR);
    expect(tourSteps(bare).map(e => e.id)).toEqual(['thing']);
  });

  test('inserting a step renumbers nothing', () => {
    // The point of the change: adding a step is a paste, and no other entry
    // in the file has to be touched.
    const withNew = parseHelpContent(`
## Bits

### c

- **Title:** C
- **Tour:** Walkthrough
- **Description:** D
- **Anchor:** none

### inserted

- **Title:** I
- **Tour:** Walkthrough
- **Description:** D
- **Anchor:** none

### b

- **Title:** B
- **Tour:** Walkthrough
- **Description:** D
- **Anchor:** none
`);
    expect(tourSteps(withNew).map(e => e.id)).toEqual(['c', 'inserted', 'b']);
  });
});

describe('prose sections', () => {
  test('a TODO section is not parsed as entries', () => {
    // Siggie added a `## TODO` section to the content file and asked "Not sure
    // if parser will complain about it" -- it did: its `###` headings became
    // entries anchored at nothing, failing two tests.
    const md = parseHelpContent(`
## TODO

### Some note to self

Prose, not an entry.

---

## Bits

### thing

- **Title:** T
- **Description:** D
- **Anchor:** none
`);
    expect([...md.entries.keys()]).toEqual(['thing']);
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

describe('Position: and OffsetX:', () => {
  /*
   * Placement overrides (Siggie, 2026-08-28). The automatic rules reason about
   * the diagram's growth axis and the emptier half of the viewport; neither can
   * know that a step is about to open a menu into the space it just picked.
   * These are the escape hatch, authored per step or per beat.
   *
   * `OffsetX` deliberately takes a CLOSED grammar rather than an expression:
   * pixels, or a multiple of one of the anchor's own dimensions.
   * `anchor.width * 1.3` is the shape asked for -- every entity box is the same
   * width, so it clears one box plus a gutter -- and covering it needs a regex,
   * not something that evaluates authored arithmetic.
   */
  const parse = (fields: string) => parseHelpContent(`
## Bits

### step

- **Title:** T
- **Tour:** Walkthrough
- **Description:** D
${fields}
`).entries.get('step')!;

  test('Highlight: takes ring, dim and none', () => {
    // `ring` drops the scrim but keeps the ring; `none` draws nothing while
    // the anchor still resolves, so it still positions the popover.
    expect(parse('- **Highlight:** ring').highlight).toBe('ring');
    expect(parse('- **Highlight:** none').highlight).toBe('none');
    expect(parse('- **Highlight:** DIM').highlight).toBe('dim');
    expect(parse('- **Highlight:** sparkly').highlight).toBeUndefined();
    // Unset is the default treatment, applied at render rather than at parse.
    expect(parse('').highlight).toBeUndefined();
  });

  test('Width: takes a pixel count and rejects a too-narrow one', () => {
    // The default 320 suits a step's worth of prose; the intro, which explains
    // what the app IS, reads badly in a narrow column (Siggie, 2026-08-28).
    expect(parse('- **Width:** 480').width).toBe(480);
    // Below ~240 the prose is a column of single words, so it is not honoured.
    expect(parse('- **Width:** 120').width).toBeUndefined();
    expect(parse('- **Width:** wide').width).toBeUndefined();
    expect(parse('').width).toBeUndefined();
  });

  test('Position: takes the four sides and ignores anything else', () => {
    expect(parse('- **Position:** bottom').position).toBe('bottom');
    expect(parse('- **Position:** LEFT').position).toBe('left');
    // A typo costs the override, not the tour.
    expect(parse('- **Position:** sideways').position).toBeUndefined();
    expect(parse('').position).toBeUndefined();
  });

  test('OffsetX: reads a plain pixel count', () => {
    expect(parse('- **OffsetX:** 260').offsetX).toEqual({ px: 260 });
    expect(parse('- **OffsetX:** -40').offsetX).toEqual({ px: -40 });
  });

  test('OffsetX: reads a multiple of the anchor\'s own size', () => {
    // The form Siggie asked for, and the reason the field is relative.
    expect(parse('- **OffsetX:** anchor.width * 1.3').offsetX)
      .toEqual({ of: 'width', times: 1.3 });
    // A bare dimension means one of it.
    expect(parse('- **OffsetX:** anchor.height').offsetX)
      .toEqual({ of: 'height', times: 1 });
    // `parentBox` is a synonym: it is the word used when asking for the field.
    expect(parse('- **OffsetX:** parentBox.width * 2').offsetX)
      .toEqual({ of: 'width', times: 2 });
    expect(parse('- **OffsetX:** -anchor.width').offsetX)
      .toEqual({ of: 'width', times: -1 });
  });

  test('OffsetX: rejects anything outside the grammar', () => {
    // Nothing here should reach an evaluator, so nothing here should parse.
    for (const bad of ['anchor.left', 'width * 2', 'anchor.width + 10', 'foo()']) {
      expect(parse(`- **OffsetX:** ${bad}`).offsetX).toBeUndefined();
    }
  });

  test('a beat inherits its step\'s placement and can override it', () => {
    const md = parseHelpContent(`
## Bits

### step

- **Title:** T
- **Tour:** Walkthrough
- **Description:** D
- **Position:** bottom
- **OffsetX:** anchor.width * 1.3
- **Highlight:** ring
- **Width:** 460
- **Beats:**
  1. inherits
  2. overrides
     - Position: right
     - Highlight: none
`);
    const [, first, second] = tourPositions(md);
    // Inherited like `anchor` is: a beat that does not move the popover keeps
    // the step's placement rather than snapping back to automatic.
    expect(first.position).toBe('bottom');
    expect(first.offsetX).toEqual({ of: 'width', times: 1.3 });
    expect(first.highlight).toBe('ring');
    expect(first.width).toBe(460);
    expect(second.width).toBe(460);
    expect(second.position).toBe('right');
    expect(second.highlight).toBe('none');
    // The override is per-field: OffsetX still comes from the step.
    expect(second.offsetX).toEqual({ of: 'width', times: 1.3 });
  });
});

/**
 * `Only:` — the replacing change verb (docs/tasks.md item 3).
 *
 * The parser's half: `Only:` and `Change:` write the SAME field, and the
 * difference is a flag beside it. One field rather than two because `change`
 * is threaded as a bare query string from here to the host's push handler, and
 * a second parallel string would double every one of those sites and let a
 * step declare both at once.
 */
describe('Only:', () => {
  const one = (body: string) =>
    parseHelpContent(`\n## S\n\n### e\n\n- **Title:** T\n- **Description:** D\n${body}`)
      .entries.get('e')!;

  test('it carries the query and marks it as replacing', () => {
    const e = one('- **Only:** sel=Visit~TimePeriod\n');
    expect(e.change).toBe('sel=Visit~TimePeriod');
    expect(e.replace).toBe(true);
  });

  test('a plain Change: is not marked', () => {
    // `replace` stays undefined rather than false, so an additive entry is
    // shaped exactly as it was before this field existed.
    const e = one('- **Change:** sel=Visit\n');
    expect(e.change).toBe('sel=Visit');
    expect(e.replace).toBeUndefined();
  });

  test('Change: wins when both are written, by PRESENCE not truthiness', () => {
    // An empty `Change:` is meaningful — it pushes an empty frame — so
    // "which did the author write" cannot be decided by which value is truthy.
    const e = one('- **Change:**\n- **Only:** sel=Visit\n');
    expect(e.change).toBe('');
    expect(e.replace).toBeUndefined();
  });

  test('a beat can replace on its own', () => {
    const e = one('- **Beats:**\n  1. one\n     - Only: sel=Specimen\n');
    expect(e.beats?.[0].change).toBe('sel=Specimen');
    expect(e.beats?.[0].replace).toBe(true);
  });

  test('the flag reaches the positions the tour navigates', () => {
    // The seam: `tourPositions` is what the mechanism walks, so a flag the
    // parser sets and the position drops would be silently additive.
    const c = parseHelpContent(
      '\n## S\n\n### e\n\n- **Title:** T\n- **Tour:** W\n- **Description:** D\n'
      + '- **Only:** sel=Visit\n- **Action:** Drew Visit.\n',
    );
    expect(tourPositions(c)[0].replace).toBe(true);
  });

  test('a `## ` heading starts a section with or without a `---`', () => {
    /*
     * The heading IS the boundary. Splitting on `^---$` meant a heading with no
     * separator above it was absorbed into the section before it, and nothing
     * failed loudly: the entries still parsed and their tours still appeared,
     * because tours come from each entry's `Tour:` field rather than from
     * sections. What vanished was the absorbed section's own `TourMetadata:`
     * description — a tour silently lost its subtitle in the chooser.
     */
    const body = (sep: string) => [
      '# Title', '',
      '## Tour A',
      '- **TourMetadata:**',
      '- **Description:** first',
      '',
      '### a',
      '- **Title:** A',
      '- **Tour:** Tour A',
      '- **Description:** d',
      '',
      sep,
      '## Tour B',
      '- **TourMetadata:**',
      '- **Description:** second',
      '',
      '### b',
      '- **Title:** B',
      '- **Tour:** Tour B',
      '- **Description:** d',
    ].filter(l => l !== null).join('\n');

    for (const sep of ['---', '']) {
      const c = parseHelpContent(body(sep));
      const label = sep ? 'with ---' : 'without ---';
      expect(c.sections.map(x => x.title), label).toEqual(['Tour A', 'Tour B']);
      // The description is the half that used to disappear.
      expect([...c.tourMeta.keys()], label).toEqual(['Tour A', 'Tour B']);
      expect(c.tourMeta.get('Tour B')?.description, label).toBe('second');
      expect([...c.entries.keys()], label).toEqual(['a', 'b']);
    }
  });

  test('`---` between sections is decorative, not a second boundary', () => {
    // It must not produce an empty section or shift entry order.
    const c = parseHelpContent([
      '# T', '', '---', '',
      '## One',
      '', '### a',
      '- **Title:** A',
      '- **Description:** d',
      '', '---', '',
      '## Two',
      '', '### b',
      '- **Title:** B',
      '- **Description:** d',
    ].join('\n'));
    expect(c.sections.map(x => x.title)).toEqual(['One', 'Two']);
    expect([...c.entries.values()].map(e => e.order)).toEqual([0, 1]);
  });

  test('a beat with no Description: shows no text at all', () => {
    /*
     * A beat that only moves the anchor or pushes a `Change:` is a real thing
     * to author (Siggie, 2026-09-08), so the numbered line must NOT leak in as
     * a fallback — there would be no way to suppress it.
     */
    const c = parseHelpContent([
      '## S', '',
      '### n',
      '- **Title:** N',
      '- **Tour:** T',
      '- **Description:** intro',
      '- **Beats:**',
      '  1. just moves the anchor',
      '     - Anchor: none',
      '  2. says something',
      '     - Description: Here is the text.',
    ].join('\n'));
    const beats = tourPositions(c).filter(p => p.entry.id === 'n' && p.beatIndex >= 0);
    expect(beats[0].blocks.filter(Boolean)).toEqual([]);
    expect(beats[0].text).toBe('');
    // The label is still there for the author, just not for the viewer.
    expect(beats[0].beat!.text).toBe('just moves the anchor');
    expect(beats[1].blocks).toEqual(['Here is the text.']);
  });

  test('a beat Description: can run to several lines', () => {
    const c = parseHelpContent([
      '## S', '',
      '### d',
      '- **Title:** D',
      '- **Tour:** T',
      '- **Description:** d',
      '- **Beats:**',
      '  1. label',
      '     - Description:',
      '       First line.',
      '       - a bullet',
      '       - another',
      '     - Anchor: none',
    ].join('\n'));
    const beat = c.entries.get('d')!.beats![0];
    expect(beat.text).toBe('label');
    expect(beat.description).toBe('First line.\n- a bullet\n- another');
    // The field after the block still parses — the indent ended it, not a guess.
    expect(beat.anchor?.kind).toBe('none');
  });

  test('`Width:` is sticky across beats, and only Width', () => {
    const c = parseHelpContent([
      '## S',
      '',
      '### w',
      '- **Title:** W',
      '- **Tour:** T',
      '- **Description:** d',
      '- **Width:** 800',
      '- **Anchor:** help-id:x',
      '- **Beats:**',
      '  1. one',
      '     - Width: 300',
      '  2. two',
      '  3. three',
      '     - Width: 500',
      '  4. four',
    ].join('\n'));
    const w = tourPositions(c).filter(p => p.entry.id === 'w' && p.beatIndex >= 0);
    expect(w.map(p => p.width)).toEqual([300, 300, 500, 500]);
    // The anchor still inherits from the step rather than sticking.
    expect(w.every(p => p.anchor?.kind === 'help-id')).toBe(true);
  });

  test('a replacing step that draws something has to say what it did', () => {
    // A step that silently SWAPS the canvas is worse than one that silently
    // adds, so a replace naming classes needs an `Action:`.
    //
    // An empty `Only:` is exempt: it swaps nothing, because the tour has drawn
    // nothing yet. It says "start clean", which the viewer sees rather than
    // needs told. Requiring a receipt there forced authors to write a sentence
    // describing a no-op — the `bdchm` opening step is exactly this case.
    const silent = positions
      .filter(p => p.replace && p.change && !p.action)
      .map(p => p.entry.id);
    // Warning, not failure — same reasoning as the rule above.
    if (silent.length) {
      console.warn(`[help-content] replacing steps without an Action:: ${silent.join(', ')}`);
    }
  });
});

/**
 * Named tours (docs/tasks.md item 2).
 *
 * The parser has supported `Tour: <name>` since 2026-08-28, but nothing could
 * SELECT one: `HelpProvider` called `tourPositions(content)` with no name, so
 * only the first tour in the file was ever runnable and a second one parsed
 * cleanly, passed every test, and was unreachable.
 */
describe('tour selection', () => {
  const two = parseHelpContent(`
## S

### a

- **Title:** A
- **Tour:** First
- **Description:** D

### b

- **Title:** B
- **Tour:** Second
- **Description:** D

### c

- **Title:** C
- **Tour:** First
- **Description:** D
`);

  test('every tour in the file is listed, in file order', () => {
    expect(tourNames(two)).toEqual(['First', 'Second']);
  });

  test('a named tour sees only its own steps', () => {
    expect(tourSteps(two, 'First').map(e => e.id)).toEqual(['a', 'c']);
    expect(tourSteps(two, 'Second').map(e => e.id)).toEqual(['b']);
  });

  test('no name means the FIRST tour, not every step', () => {
    expect(tourSteps(two).map(e => e.id)).toEqual(['a', 'c']);
  });

  test('step numbers are per-tour, so each one counts from 1', () => {
    // The counter's denominator comes from `tourSteps(content, name).length`;
    // numbering across tours would show "2 / 1" on a one-step tour.
    expect(tourPositions(two, 'First').map(p => p.step)).toEqual([1, 2]);
    expect(tourPositions(two, 'Second').map(p => p.step)).toEqual([1]);
  });

  test('an unknown tour name yields no steps rather than falling back', () => {
    // What makes `startTour('typo')` a visible no-op instead of silently
    // running whichever tour happens to be first.
    expect(tourSteps(two, 'Nope')).toEqual([]);
    expect(tourPositions(two, 'Nope')).toEqual([]);
  });
});

/**
 * `TourMetadata:` — what a tour IS, as opposed to what its steps say.
 *
 * Authored in a section's BODY (between the `## ` heading and the first `### `
 * entry) rather than on an entry, because it describes the tour as a whole and
 * a tour has no entry of its own — its steps are entries.
 */
describe('TourMetadata', () => {
  const meta = (body: string) =>
    parseHelpContent(`\n## A Tour\n${body}\n\n### e\n\n- **Title:** T\n- **Description:** D`);

  test('it names the tour and carries a description', () => {
    const c = meta('- **TourMetadata:** A Tour\n- **Description:** What it covers');
    expect(c.tourMeta.get('A Tour')?.description).toBe('What it covers');
  });

  test('a bare TourMetadata: takes the section heading as the name', () => {
    // Removes the third copy of the name. `<summary>` and `## heading` are
    // already pinned to each other by the fold test; this one was pinned to
    // nothing, so a typo silently produced metadata for a tour that does not
    // exist.
    const c = meta('- **TourMetadata:**\n- **Description:** What it covers');
    expect(c.tourMeta.get('A Tour')?.description).toBe('What it covers');
  });

  test('a section without it declares no tour metadata', () => {
    expect(meta('Just some prose.').tourMeta.size).toBe(0);
  });

  test('the description may run to a paragraph', () => {
    const c = meta(
      '- **TourMetadata:**\n- **Description:** One sentence.\n\n  And another.',
    );
    expect(c.tourMeta.get('A Tour')?.description).toContain('And another');
  });

  /**
   * THE GUARD. Metadata is matched to steps by NAME, and nothing else checks
   * that the two agree: a tour whose `TourMetadata:` says one thing and whose
   * steps' `Tour:` says another parses cleanly, and the chooser silently shows
   * no description — the same shape of silent failure as the unreachable
   * second tour this whole change fixed.
   */
  test('every declared tour has steps, and every tour with steps is declared', () => {
    const declared = [...content.tourMeta.keys()];
    const walked = tourNames(content);

    const orphaned = declared.filter(n => !walked.includes(n));
    expect(
      orphaned,
      `TourMetadata for tours with no steps (name does not match any `
      + `\`Tour:\` field): ${orphaned.join(', ')}`,
    ).toEqual([]);

    const undescribed = walked.filter(n => !declared.includes(n));
    expect(
      undescribed,
      `Tours with steps but no TourMetadata block, so the chooser shows no `
      + `description: ${undescribed.join(', ')}`,
    ).toEqual([]);
  });
});
