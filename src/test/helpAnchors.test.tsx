/**
 * The anchor tags: that every element the tour points at actually wears the
 * string the content file names.
 *
 * REPLACED `helpResolvers.test.ts`, which tested five lookup functions against a
 * hand-copied DOM (docs/HELP_PACKAGE_PLAN.md §1a). That shape had a hole its own
 * header admitted: the fixture was a COPY of the render sites, so renaming an
 * attribute in the app while leaving the copy alone kept every test green and
 * broke the tour. With flat tags there is nothing to copy — the render site emits
 * the whole anchor string, so a test can compare the app's own output against the
 * content file's own anchors, which is what these do.
 *
 * Two halves, because the two panels are reachable in different ways under jsdom:
 *
 *  - **the left panel** renders for real (`SelectionTable`), so its tags are read
 *    off the DOM;
 *  - **the diagram** needs ELK, which never lays out here, so its tags are
 *    computed from the real pipeline (`buildViewModel` → `mergeSiblings`) —
 *    docs/TESTING.md, and the probe pattern of `mergedEdges.test.ts`. The tag
 *    builders live in `helpAnchors.ts` and take a `NodeVM`/`RowVM`, so a test can
 *    call them on the real pipeline's output.
 */

import { describe, test, expect, beforeAll } from 'vitest';
import { render } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadModelData } from '../utils/dataLoader';
import { DataService, SKIP_SUBCLASS_EXPANSION } from '../services/DataService';
import type { AttributeSummary } from '../services/DataService';
import SelectionTable from '../explore/SelectionTable';
import { buildViewModel, mergeSiblings } from '../explore/OwnershipGraphView';
import {
  ANCHOR_KINDS, categoryRowTag, childHeaderTag, entityCheckboxTag, entityRowTag,
  nodeBoxAnchor, nodeBoxTag, slotRowAnchor, slotRowTag,
} from '../explore/helpAnchors';
import { parseHelpContent } from '../help/parseHelpContent';
import { ENTITY_CATEGORIES } from '../config/entityCategories';
import { isMergedId, parentOfMergedId } from '../explore/siblingMerge';

const content = parseHelpContent(
  readFileSync(resolve(__dirname, '../explore/help-content.md'), 'utf8'),
);

let ds: DataService;
beforeAll(async () => { ds = new DataService(await loadModelData()); });

/** The view's own pipeline: subgraph → view model → merge. Same wiring as
 *  `mergedEdges.test.ts`; a helper here rather than shared because the callbacks
 *  are the VIEW's, and a shared fixture would let one test's convenience change
 *  what another believes the view does. */
function merged(selection: string[]) {
  const sub = ds.getOwnershipSubgraph(selection);
  const plain = new Map(sub.nodes.map(n =>
    [n.id, ds.getClassSummary(n.id)?.slots ?? []] as const));
  const base = buildViewModel(
    sub, new Set(), id => plain.get(id) ?? [],
    r => ds.getRangeColor(r), r => ds.getTargetColor(r),
  );
  const sameDef = (a: AttributeSummary, b: AttributeSummary) =>
    a.range === b.range && a.multivalued === b.multivalued;
  return mergeSiblings(
    base,
    id => ds.getClassSummary(id)?.parentId,
    p => !SKIP_SUBCLASS_EXPANSION.has(p),
    (classId, slot) => {
      const own = ds.getClassSummary(classId)?.slots.find(a => a.name === slot);
      if (!own) return undefined;
      if (!own.inheritedFrom) return classId;
      const inh = ds.getClassSummary(own.inheritedFrom)?.slots
        .find(a => a.name === slot);
      return inh && sameDef(own, inh) ? own.inheritedFrom : classId;
    },
    id => {
      const s = ds.getClassSummary(id);
      return { description: s?.description ?? '', abstract: s?.isAbstract ?? false };
    },
    (classId, slot) => {
      const i = ds.getClassSummary(classId)?.slots
        .findIndex(a => a.name === slot) ?? -1;
      return i < 0 ? Number.MAX_SAFE_INTEGER : i;
    },
    id => ds.siblingColorIndexOf(id),
  );
}

/** Every `data-help-id` the diagram would emit for a selection. */
function diagramTags(selection: string[]): Set<string> {
  const tags = new Set<string>();
  for (const n of merged(selection).nodes) {
    tags.add(nodeBoxAnchor(n));
    for (const r of n.rows) {
      if (r.header) tags.add(childHeaderTag(r.header.id));
      else tags.add(slotRowAnchor(n, r));
    }
  }
  return tags;
}

describe('the left panel tags its rows with their whole anchor', () => {
  const renderTable = () => render(
    <SelectionTable
      dataService={ds}
      selectedIds={new Set()}
      onToggle={() => {}}
      onShowCategory={() => {}}
    />,
  );

  test('every class row and its checkbox', () => {
    const { container } = renderTable();
    const missing = ds.getCategoryGroups().flatMap(g => g.classIds)
      .flatMap(id => [entityRowTag(id), entityCheckboxTag(id)])
      .filter(tag => !container.querySelector(`[data-help-id="${tag}"]`));
    expect(missing, `Untagged: ${missing.join(', ')}`).toEqual([]);
  });

  test('a class listed in two categories yields two rows, and that is allowed', () => {
    /*
     * REGRESSION (2026-09-09). Flat tags are not unique: `BodySite`,
     * `SpecimenQualityObservation` and `SpecimenQuantityObservation` are listed
     * in two categories each, so each renders TWICE. `resolveAnchor` used
     * `querySelector` and took the first in document order — which, if that
     * copy sits in a collapsed category, is a zero-height element the popover
     * then anchors to. It prefers the first VISIBLE match now.
     *
     * Pinned as a fact about the app, not a defect: dual listing is deliberate
     * (see DUAL_LISTED in entityCategories.test.ts). What must not regress is
     * the resolver silently assuming one match.
     */
    const { container } = renderTable();
    const counts = new Map<string, number>();
    for (const el of container.querySelectorAll('[data-help-id]')) {
      const tag = el.getAttribute('data-help-id')!;
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
    expect(counts.get(entityRowTag('BodySite'))).toBe(2);
    expect(counts.get(entityCheckboxTag('BodySite'))).toBe(2);
  });

  test('the checkbox tag is on the input, not on the row', () => {
    // Tagged rather than derived as "the input inside the row": deriving it
    // would put kind INTERPRETATION in package code, which the §2 seam forbids.
    const { container } = renderTable();
    const box = container.querySelector(`[data-help-id="${entityCheckboxTag('Person')}"]`);
    expect(box?.tagName).toBe('INPUT');
    expect(box?.getAttribute('type')).toBe('checkbox');
  });

  test('the row tag is on the full-width label, so the ring spans the row', () => {
    const { container } = renderTable();
    const row = container.querySelector(`[data-help-id="${entityRowTag('Person')}"]`);
    expect(row?.tagName).toBe('LABEL');
    // The checkbox lives inside it -- that is what made "the input in the row"
    // a workable definition before, and it is still the shape authors expect.
    expect(row?.querySelector('input[type="checkbox"]')).not.toBeNull();
  });

  test('every category header, by id and not by label', () => {
    const { container } = renderTable();
    const missing = ENTITY_CATEGORIES.map(c => categoryRowTag(c.id))
      .filter(tag => !container.querySelector(`[data-help-id="${tag}"]`));
    expect(missing, `Untagged: ${missing.join(', ')}`).toEqual([]);
    // The bar, not the label button, so a ring includes the ⊞ content-view
    // control -- a step pointing at a category is usually about to say "press
    // it". Pinned because the mark is easy to "tidy" onto the button.
    const bar = container.querySelector(`[data-help-id="${categoryRowTag('admin')}"]`);
    expect(bar?.querySelector('[data-show-category]')).not.toBeNull();
  });
});

describe('the diagram tags its boxes and rows with their whole anchor', () => {
  test('an unmerged box is tagged by its own class', () => {
    expect(diagramTags(['Person'])).toContain('node-box:Person');
  });

  test('a merged box is tagged by the PARENT it is titled by', () => {
    // The node id is `merged::Observation`; the author writes the class.
    const vm = merged(['MeasurementObservation']);
    const box = vm.nodes.find(n => isMergedId(n.id))!;
    expect(nodeBoxAnchor(box)).toBe(`node-box:${parentOfMergedId(box.id)}`);
    expect(box.id).not.toBe(parentOfMergedId(box.id));   // it really is synthetic
  });

  test('a merged CHILD is tagged `child-header:`, and NOT `node-box:`', () => {
    /*
     * The deliberate behaviour change of §1a. Siggie, 2026-09-08: *"it's not a
     * nodeBox, there's no reason to try to look for it as if it were."*
     *
     * The resolver this replaced fell back to "the box containing a row this
     * class declares", which returned the PARENT's box under the CHILD's name --
     * so `node-box:MeasurementObservation` rang the Observation box and looked
     * like it worked. There is no fallback chain now: the box tags itself, the
     * header tags itself, and an anchor either matches or it does not.
     */
    const tags = diagramTags(['MeasurementObservation']);
    expect(tags).toContain('child-header:MeasurementObservation');
    expect(tags).not.toContain('node-box:MeasurementObservation');
  });

  test('a merged child that narrows nothing still gets a header', () => {
    // SpecimenQualityObservation has no rows of its own, so the old resolver's
    // "find a row it declares" fallback returned null for it -- the same anchor
    // failing a SECOND, different way. A header strip exists regardless.
    const tags = diagramTags(['Specimen', 'SpecimenQualityObservation']);
    expect(tags).toContain('child-header:SpecimenQualityObservation');
  });

  test('a slot row carries the declaring class, which is what makes it unique', () => {
    /*
     * The pair problem, solved at the source. A merged box holds several rows
     * named `observations` -- the parent's, plus each child's narrowed override
     * -- so `data-row` alone did not identify one and the resolver had to query
     * `(data-row, data-declaring-class)` TOGETHER, which no single selector
     * expresses. Flattened into one string the pair is just an attribute value.
     */
    const vm = merged(['MeasurementObservationSet', 'ObservationSet']);
    const box = vm.nodes.find(n => isMergedId(n.id))!;
    const observations = box.rows.filter(r => !r.header && r.slot === 'observations');
    expect(observations.length).toBeGreaterThan(1);      // the ambiguity is real
    const tags = observations.map(r => slotRowAnchor(box, r));
    expect(new Set(tags).size).toBe(tags.length);        // and the tags resolve it
    expect(tags).toContain('slot-row:ObservationSet.observations');
    expect(tags).toContain('slot-row:MeasurementObservationSet.observations');
  });

  test('an unmerged box falls back to its own class for the declaring class', () => {
    // `declaringClass` is set only on a merged box's rows; elsewhere the box's
    // own id already said it, so the tag must supply it or the anchor would read
    // `slot-row:undefined.<slot>`.
    const vm = merged(['Person']);
    const box = vm.nodes.find(n => n.id === 'Person')!;
    const row = box.rows.find(r => !r.header)!;
    expect(row.declaringClass).toBeUndefined();
    expect(slotRowAnchor(box, row)).toBe(`slot-row:Person.${row.slot}`);
  });
});

/**
 * The end-to-end check: every diagram anchor the SHIPPING content file names
 * matches a tag the diagram would emit for that step's own selection.
 *
 * This is the test §1a asked for by name — `help-content.md`'s one `slot-row`
 * anchor is a merged child's narrowed row, i.e. exactly the case flat tags
 * change — generalised to every step, since the same question applies to all 48
 * of them. It caught three live anchors on merged children when 8a landed
 * (`node-box:MeasurementObservation` twice, `node-box:SpecimenQualityObservation`
 * once), each of which had been silently ringing the parent's box or nothing.
 *
 * Steps with no `Change:` are SKIPPED, not failed: they inherit whatever
 * selection the viewer or an earlier step left, so there is no canvas to check
 * them against. That is a real gap and it needs the browser, not a bigger test.
 */
test('every diagram anchor in the content file matches a tag its step emits', () => {
  const bad: string[] = [];
  for (const e of content.entries.values()) {
    // Spotlights are anchors too: same grammar, same tags, same failure mode.
    const anchors = [
      e.anchor, e.spotlight,
      ...(e.beats ?? []).flatMap(b => [b.anchor, b.spotlight]),
    ].filter(a => a && ['node-box', 'child-header', 'slot-row'].includes(a.kind));
    if (!anchors.length) continue;

    const change = e.change ?? '';
    const sel = /(?:^|&)sel=([^&]*)/.exec(change);
    const cat = /(?:^|&)cat=([^&]*)/.exec(change);
    let selection: string[] = [];
    if (sel) selection = decodeURIComponent(sel[1]).split('~').filter(Boolean);
    else if (cat) {
      const group = ENTITY_CATEGORIES.find(c => c.id === cat[1]);
      // `cat=` draws the category's members PLUS its pins.
      if (group) selection = [...new Set([...group.classIds, ...group.pins])];
    }
    // A beat's own `Change:` ADDS to the canvas (`Only:` on a beat replaces,
    // but the anchors checked here are the step's whole set, so the union is
    // the generous reading): a beat anchored on the box it just added is fine.
    for (const b of e.beats ?? []) {
      const bsel = /(?:^|&)sel=([^&]*)/.exec(b.change ?? '');
      if (bsel) selection.push(...decodeURIComponent(bsel[1]).split('~').filter(Boolean));
    }
    if (!selection.length) continue;

    const tags = diagramTags(selection);
    for (const a of anchors) {
      const tag = `${a!.kind}:${(a as { arg: string }).arg}`;
      if (!tags.has(tag)) bad.push(`${e.id}: ${tag} (selection: ${selection.join('~')})`);
    }
  }
  expect(bad, `Anchors naming no element the step's own canvas tags — each `
    + `degrades to an unringed popover: ${bad.join('; ')}`).toEqual([]);
});

test('ANCHOR_KINDS and the builders name the same six kinds', () => {
  /*
   * They drift apart silently otherwise, in both directions: a kind listed but
   * never emitted passes the content check and then anchors nothing, and a
   * builder whose kind is missing from the list makes every anchor using it fail
   * as a typo. This pairing is why the vocabulary lives in the module that builds
   * the tags rather than in the test that checks them — it was a separate copy
   * once and went stale.
   */
  const emitted = [
    entityRowTag('X'), entityCheckboxTag('X'), categoryRowTag('X'),
    nodeBoxTag('X'), childHeaderTag('X'), slotRowTag('X', 's'),
  ].map(tag => tag.slice(0, tag.indexOf(':')));
  expect(emitted.sort()).toEqual([...ANCHOR_KINDS].sort());
});
