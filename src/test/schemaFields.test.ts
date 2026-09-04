import { describe, test, expect } from 'vitest';
import { readFileSync } from 'fs';
import {
  EXPECTED_SLOT_FIELDS,
  EXPECTED_ENUM_FIELDS,
  EXPECTED_TYPE_FIELDS,
  EXPECTED_CLASS_FIELDS,
} from '../utils/dataLoader';

/**
 * Unexpected-field detection, formerly scripts/validate-schema.ts.
 *
 * The old script read bdchm.metadata.json -- an artifact the e8b8bd0 pipeline
 * change deleted -- so it had been crashing on startup, and nothing noticed
 * because it was a manual `npx tsx` command (with tsx not even installed).
 * The check it performed is still worth having: it asks whether the app's
 * TypeScript knows about every field present in the data it loads. A sync that
 * introduces a new LinkML construct shows up here and nowhere else.
 *
 * Now a test against bdchm.processed.json -- the file dataLoader actually reads
 * -- so it runs on every `vitest run` instead of waiting to be remembered.
 *
 * The expected-field lists are IMPORTED from dataLoader rather than copied.
 * They already exist there to drive its runtime warning; a second copy here
 * would drift, and then this test would be asserting against a fiction.
 */

const PROCESSED = 'public/source_data/HM/bdchm.processed.json';

interface Section {
  label: string;
  key: 'slots' | 'enums' | 'classes' | 'types';
  expected: string[];
}

const SECTIONS: Section[] = [
  { label: 'slot', key: 'slots', expected: EXPECTED_SLOT_FIELDS },
  { label: 'enum', key: 'enums', expected: EXPECTED_ENUM_FIELDS },
  { label: 'class', key: 'classes', expected: EXPECTED_CLASS_FIELDS },
  { label: 'type', key: 'types', expected: EXPECTED_TYPE_FIELDS },
];

/**
 * Fields present in the data that no expected-list mentions, with a few
 * example keys each so the failure message points somewhere.
 */
function unexpectedFields(
  entities: Record<string, unknown>,
  expected: string[],
): Map<string, string[]> {
  const expectedSet = new Set(expected);
  const found = new Map<string, string[]>();
  for (const [key, entity] of Object.entries(entities)) {
    if (!entity || typeof entity !== 'object') continue;  // e.g. the _comment string
    for (const field of Object.keys(entity)) {
      if (expectedSet.has(field)) continue;
      const examples = found.get(field) ?? [];
      if (examples.length < 5) examples.push(key);
      found.set(field, examples);
    }
  }
  return found;
}

describe('processed.json fields vs. dataLoader expectations', () => {
  const schema = JSON.parse(readFileSync(PROCESSED, 'utf-8')) as Record<
    string,
    Record<string, unknown>
  >;

  test.each(SECTIONS)('$label definitions carry no unmodelled fields', ({ key, expected }) => {
    const found = unexpectedFields(schema[key] ?? {}, expected);
    const detail = [...found.entries()]
      .map(([field, examples]) => `  ${field} (e.g. ${examples.join(', ')})`)
      .join('\n');
    expect(
      [...found.keys()],
      `Fields in ${PROCESSED} that dataLoader neither uses nor ignores:\n${detail}\n\n` +
        'Either handle the field, or add it to the matching EXPECTED_*_FIELDS ' +
        'list in src/utils/dataLoader.ts with a comment saying why it is ignored.',
    ).toEqual([]);
  });

  /**
   * Slot keys are name-scoped: a slot declared on several classes is stored as
   * `name-Class` with `name` holding the bare name. Anything else is a key the
   * UI would render wrongly, since it displays the bare name.
   */
  test('slot keys are either the bare name or name-Class', () => {
    const bad = Object.entries(schema.slots ?? {})
      .filter(([key, defn]) => {
        if (!defn || typeof defn !== 'object') return false;
        const name = (defn as { name?: string }).name;
        if (!name) return false;
        return key !== name && !key.startsWith(`${name}-`);
      })
      .map(([key, defn]) => `${key} (name: ${(defn as { name?: string }).name})`);
    expect(bad, `Slot keys disagreeing with their name field: ${bad.join(', ')}`).toEqual([]);
  });

  test('class and enum keys match their name field', () => {
    const bad: string[] = [];
    for (const key of ['classes', 'enums'] as const) {
      for (const [id, defn] of Object.entries(schema[key] ?? {})) {
        if (!defn || typeof defn !== 'object') continue;
        const name = (defn as { name?: string }).name;
        if (name && name !== id) bad.push(`${key}.${id} (name: ${name})`);
      }
    }
    expect(bad, `Keys disagreeing with their name field: ${bad.join(', ')}`).toEqual([]);
  });
});
