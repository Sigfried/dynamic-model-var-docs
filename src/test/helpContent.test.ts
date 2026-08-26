import { describe, test, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { parseHelpContent, tourSteps } from '../help/parseHelpContent';

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

  test('every tour step that needs a selection brings its own state', () => {
    // The tour is for someone arriving from a link with nobody explaining it,
    // so a step must never depend on the visitor having already clicked
    // something. Step 1 is the exception: it introduces the app.
    const needsState = steps.slice(1);
    const missing = needsState.filter(s => !s.state).map(s => s.id);
    expect(
      missing,
      `Tour steps after the first with no State: ${missing.join(', ')}`,
    ).toEqual([]);
  });

  test('every State: field is a parseable query string naming known params', () => {
    const known = new Set(['sel', 'exp', 'hidden', 'detail', 'roots', 'sibs',
      'dir', 'merge', 'owners']);
    const bad: string[] = [];
    for (const s of steps) {
      if (!s.state) continue;
      for (const [k] of new URLSearchParams(s.state)) {
        if (!known.has(k)) bad.push(`${s.id}: unknown param "${k}"`);
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

  test('every entry id is actually tagged in the app', () => {
    // A `data-help-id` that no longer exists yields help for something that
    // isn't there, and a tour step anchored to nothing. Greps the source
    // rather than rendering, so it catches the id being renamed anywhere.
    const src = ['explore', 'help', 'components'].flatMap(dir => {
      const base = resolve(__dirname, `../${dir}`);
      return readdirSync(base, { recursive: true })
        .filter((f): f is string => typeof f === 'string' && /\.tsx?$/.test(f))
        .map(f => readFileSync(resolve(base, f), 'utf8'));
    }).join('\n');

    const untagged = [...content.entries.keys()]
      .filter(id => !src.includes(`data-help-id="${id}"`));
    expect(
      untagged,
      `Help entries with no data-help-id in the app: ${untagged.join(', ')}`,
    ).toEqual([]);
  });

  test('entry ids are unique', () => {
    // The registry is a Map, so a duplicate id silently overwrites the first
    // entry and its help simply disappears.
    const ids = content.sections.flatMap(s => s.entries.map(e => e.id));
    expect(ids.length).toBe(new Set(ids).size);
  });
});
