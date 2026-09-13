/**
 * Dump the REAL ownership classifier's verdicts as JSON, so the sync audit
 * doesn't have to reimplement it.
 *
 * scripts/audit_schema_sync.py needs, for every (class, slot) site, the
 * ownership verdict the app would actually draw. Retyping the rules in Python
 * meant two copies of one piece of logic that silently disagree when the TS
 * gains a rule -- silent wrongness inside the tool built to catch silent
 * wrongness. This imports classifySlotEdgeExplained directly instead.
 *
 * Run via vitest (which already handles the TS + path resolution):
 *   npx vitest run scripts/dump_classifier.ts --reporter=silent
 *
 * Reads a processed.json path from CLASSIFIER_INPUT and writes JSON to
 * CLASSIFIER_OUTPUT, both absolute. Uses env rather than argv because vitest
 * owns the command line.
 */

import { readFileSync, writeFileSync } from 'fs';
import { test } from 'vitest';
import {
  classifySlotEdgeExplained,
  ENTITY_ROOT,
  SKIP_SUBCLASS_EXPANSION,
  REFERRED_TO_ENTITIES,
  NAMED_BACK_POINTERS,
  ASSOCIATION_SLOTS,
} from '../src/models/containmentGraph';

interface SlotDef {
  id: string;
  name?: string;
  range?: string;
  multivalued?: boolean;
}

interface ClassDef {
  parent?: string;
  slots?: Array<{ id: string } | string>;
}

interface Processed {
  classes: Record<string, ClassDef>;
  slots: Record<string, SlotDef>;
}

// Named *.test.ts only because that is what vitest's include pattern picks up;
// this is a tool, not a test. It skips in an ordinary suite run so `vitest run`
// stays green -- audit_schema_sync.py supplies the env vars that enable it.
const input = process.env.CLASSIFIER_INPUT;
const output = process.env.CLASSIFIER_OUTPUT;

test.skipIf(!input || !output)('dump classifier verdicts', () => {
  const schema: Processed = JSON.parse(readFileSync(input!, 'utf8'));
  const classNames = new Set(Object.keys(schema.classes));

  // Every (class, slot) site whose range is a class, with the verdict the app
  // would draw. Keyed by class because the override sets are keyed by slot
  // NAME alone -- the audit needs to see how many sites a name covers.
  const sites = Object.entries(schema.classes).flatMap(([className, cls]) =>
    (cls.slots ?? []).flatMap(ref => {
      const id = typeof ref === 'string' ? ref : ref.id;
      const defn = schema.slots[id];
      if (!defn) return [];
      const slotName = defn.name ?? id;
      const range = defn.range ?? '';
      const multivalued = Boolean(defn.multivalued);
      if (!classNames.has(range)) return [];
      const { verdict, rule } = classifySlotEdgeExplained(className, slotName, range, multivalued);
      return [{ class: className, slot: slotName, range, multivalued, verdict, rule }];
    }),
  );

  writeFileSync(
    output!,
    JSON.stringify(
      {
        sites,
        // The audit reports stale members of these, so it reads them from here
        // rather than regexing the TS source.
        sets: {
          REFERRED_TO_ENTITIES: [...REFERRED_TO_ENTITIES],
          NAMED_BACK_POINTERS: [...NAMED_BACK_POINTERS],
          ASSOCIATION_SLOTS: [...ASSOCIATION_SLOTS],
          SKIP_SUBCLASS_EXPANSION: [...SKIP_SUBCLASS_EXPANSION],
        },
        entityRoot: ENTITY_ROOT,
      },
      null,
      2,
    ),
  );
});
