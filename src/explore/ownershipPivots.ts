/**
 * How the legend's pair lists are GROUPED — the pivots, their counts, and the
 * column-aligned tree each one opens.
 *
 * Pure data shaping, in its own module so `OwnershipLegend.tsx` exports only a
 * component (`react-refresh/only-export-components`) and so the trees can be
 * asserted directly rather than through the DOM.
 *
 * The design, the exploration behind it, and the per-pivot header layouts:
 * docs/LEGEND_ORIENTATION.md. The rendering technique (nested CSS subgrid) is
 * documented in `temp/legend-tables-reference.html`, which Siggie generated as
 * the visual reference for all twelve pivots. ⚠️ `temp/` is gitignored, so that
 * file is NOT in the repo — the layouts it settled are transcribed into
 * `SHAPES` below and into docs/LEGEND_ORIENTATION.md §header layout.
 */

import type { OwnershipPair } from '../services/DataService';

/**
 * The four pivots every rule's count line offers, in the order it shows them.
 *
 * **Owner-first and owned-last in EVERY section** — the finding this rewrite
 * exists for. The panel used to group every section on `p.range`, which is the
 * target of the DECLARATION; but `own-bkwd` flips ownership, so one key landed
 * on opposite roles depending on the section — `BodySite` heading a group meant
 * "the owned thing" under the forward rule and `Participant` heading one meant
 * "the owner" under the backward rule, at the same visual level with no cue.
 * Siggie, reading it: *"the legend dropdowns are just really incomprehensible."*
 *
 * Grouping by ROLE rather than by structural position makes the top-level row
 * mean one thing everywhere. `owner`/`owned` are already computed as-drawn on
 * every `OwnershipPair` and were previously unused here.
 *
 * ⚠️ Grouping uniformly by `owned` or by `owner` ALONE was tried and breaks a
 * section either way — by `owned` takes the by-entity rule from 5 rows to 25,
 * destroying the five-entity list that IS that rule's content. The fix is the
 * owner→attribute→owned ORDER, not one uniform key.
 */
export const PIVOTS = ['owners', 'attrs', 'owned', 'total'] as const;
export type Pivot = typeof PIVOTS[number];

/**
 * What each pivot is called, and what its popover spells out.
 *
 * `total` rather than a fourth noun: it counts the same things `attrs` counts
 * distinctly, and a fourth noun would read as a fourth category. The long form
 * carries `(target)`/`(source)` because which structural end plays the owner
 * flips between the forward and backward rules — which is the whole confusion
 * this panel had.
 *
 * ⚠️ Rejected: `owner.attrs` for the total. It is wrong for belongs-to, where
 * the attribute is declared on the OWNED entity — the misattribution trap again.
 */
export const PIVOT_LABEL: Record<Pivot, { short: string; long: (fwd: boolean) => string }> = {
  owners: { short: 'owners', long: f => `entities that own (the ${f ? 'source' : 'target'})` },
  attrs: { short: 'attrs', long: () => 'distinct attribute names' },
  owned: { short: 'owned', long: f => `entities that are owned (the ${f ? 'target' : 'source'})` },
  total: { short: 'total', long: () => 'attributes in all' },
};

/**
 * Which pivots open with their rows already EXPANDED — all but `attrs`.
 *
 * Opening a pivot should SHOW you the grouping, not hand you a list of closed
 * folders: the per-node triangles are for adjusting what you are looking at,
 * not for assembling it. (Siggie, 2026-09-15, on the first cut, where only
 * `total` seeded open: *"now everything but total is collapsed and you have to
 * click on each row at each level to see what's in it"*.)
 *
 * `attrs` is the exception, and only because it is the IDENTICAL tree to
 * `total` — both group by attribute name. Landing collapsed is what makes it a
 * different view of the same rows rather than a duplicate of the one next to
 * it: `total` is "show me the attributes", `attrs` is "show me how many names
 * cover them", which is read off the closed rows.
 *
 * ⚠️ `total` briefly had no expansion at all on the owns side, on the grounds
 * that it duplicates `attrs`. Reversed: the duplication is the point, and
 * these two default states are what make it worth having twice.
 */
export const STARTS_OPEN: Partial<Record<Pivot, boolean>> =
  { owners: true, owned: true, total: true };

/** Which field of a pair each pivot groups its TOP level on. */
const TOP_KEY: Record<Pivot, (p: OwnershipPair) => string> = {
  owners: p => p.owner,
  attrs: p => p.slotName,
  owned: p => p.owned,
  total: p => p.slotName,          // same grouping as `attrs`; see STARTS_OPEN
};

/**
 * One of the four cell kinds a row can show. The renderer maps these to tracks.
 *
 * `attr` is the BARE attribute name (`performed_by`); `srcAttr` is the
 * qualified one (`Condition.affected_body_site`). They are different
 * renderings of the same slot, not the same string — which is the thing I
 * misread out of the spec first time round.
 */
export type Field = 'entity' | 'attr' | 'srcAttr' | 'target';

/**
 * The shape one pivot renders: what its header says, what each level shows,
 * and whether a leaf carries an arrow and a target column.
 *
 * Twelve pivots (3 rules x 4), but only three column SHAPES — see the table in
 * LEGEND_ORIENTATION. `levels` is the label field per nesting depth, so its
 * length IS the tree depth; `leaf` is what the innermost row shows.
 */
export interface PivotShape {
  /** Field shown as each level's node label, outermost first. */
  levels: Field[];
  /** Fields in the leaf row: one, or a name + target pair flanking the arrow. */
  leaf: Field[];
  /** Header caption per level, then per leaf column. */
  headers: string[];
  /**
   * Where the direction arrow goes.
   * - `leaf`: its own column between the leaf's two fields
   * - `label:<n>`: glued to level n's label, meaning "arrows ARRIVE here"
   */
  arrow: 'leaf' | `label:${number}`;
  /**
   * Push the node label to the RIGHT edge, and give every leaf its own arrow.
   *
   * For `owns: owned` only, and it is a LAYOUT fix, not an arrow fix. That
   * pivot groups by the owned end, so the entity that every arrow points AT
   * sits above the attributes pointing at it — the one place the panel's
   * `owner → attribute → owned` reading runs backwards.
   *
   * Right-aligning the label puts the owned entity last on the line again, so
   * each row reads `Condition.affected_body_site ——▶ BodySite` across the
   * group, with the label as a shared right-hand column:
   *
   * ```
   *                                BodySite
   *   Condition.affected_body_site ——▶
   *   ImagingFile.anatomical_site  ——▶
   * ```
   *
   * ⚠️ **This replaced mirroring the arrow**, which was wrong twice over: it
   * drew `◀——` for an `own-fwd` edge, and it papered over a column-ORDER
   * problem with an arrow change. Siggie, 2026-09-15: *"it breaks the
   * owner → attr → owned pattern; can we figure out a way to fix that?"*
   */
  rightAlignLabel?: boolean;
}

const ENTITY = 'Target entity', SOURCE = 'Source entity';
const ATTR = 'Attribute name', SRC_ATTR = 'Source.attribute';

/**
 * The twelve layouts, as `[pivot][direction]`.
 *
 * Read against `temp/legend-tables-reference.html` (gitignored; see the header)
 * and docs/LEGEND_ORIENTATION.md §header layout, which is the durable copy. Every top-level row is the OWNER in all of them; what varies
 * is how far the tree goes before reaching a leaf and whether the target needs
 * its own column (it does not when the level above already named it).
 */
const SHAPES: Record<Pivot, { fwd: PivotShape; bkwd: PivotShape }> = {
  /*
   * Forward the owner IS the declaring class, so owner → attr → target is one
   * level plus a two-field leaf. Backward the owner is the TARGET, and one
   * owner genuinely fans across several attribute names
   * (`Organization —◀ → performed_by → 11 classes`), so the middle level earns
   * its place and the leaf needs no target column — the top label is the target.
   */
  owners: {
    fwd: { levels: ['entity'], leaf: ['attr', 'target'], arrow: 'leaf',
           headers: [SOURCE, ATTR, ENTITY] },
    bkwd: { levels: ['entity', 'attr'], leaf: ['srcAttr'], arrow: 'label:0',
            headers: [ENTITY, ATTR, SRC_ATTR] },
  },
  attrs: {
    fwd: { levels: ['attr'], leaf: ['srcAttr', 'target'], arrow: 'leaf',
           headers: [ATTR, SRC_ATTR, ENTITY] },
    bkwd: { levels: ['attr', 'entity'], leaf: ['srcAttr'], arrow: 'label:1',
            headers: [ATTR, ENTITY, SRC_ATTR] },
  },
  /*
   * `owned` is the one shape with NO target column in either direction: the
   * top label is the owned entity, so every leaf under it would repeat it.
   * Forward that leaves a bare `Source.attribute`; backward the owned thing is
   * the declaring class, so the leaf regains attr + target.
   */
  owned: {
    /* The label is the OWNED entity, so it is right-aligned and every leaf
       carries its own arrow pointing at it — see `rightAlignLabel`. */
    fwd: { levels: ['entity'], leaf: ['srcAttr'], arrow: 'leaf',
           rightAlignLabel: true, headers: [SRC_ATTR, ENTITY] },
    bkwd: { levels: ['entity'], leaf: ['attr', 'target'], arrow: 'leaf',
            headers: [SOURCE, ATTR, ENTITY] },
  },
  /*
   * `total` is `attrs` already expanded — the SAME tree, differing only in the
   * state it opens in (`STARTS_OPEN`). So its backward shape nests the target
   * under the attribute name exactly as `attrs` does; a flat
   * `attr → src.attr | tgt` was a transcription error (Siggie, 2026-09-15:
   * *"it's supposed to be the same as attribute names, just expanded"*).
   */
  total: {
    fwd: { levels: ['attr'], leaf: ['srcAttr', 'target'], arrow: 'leaf',
           headers: [ATTR, SRC_ATTR, ENTITY] },
    bkwd: { levels: ['attr', 'entity'], leaf: ['srcAttr'], arrow: 'label:1',
            headers: [ATTR, ENTITY, SRC_ATTR] },
  },
};

export const shapeOf = (pivot: Pivot, forward: boolean): PivotShape =>
  SHAPES[pivot][forward ? 'fwd' : 'bkwd'];

/** A node in a pivot's expansion: a label, its pairs, and its children. */
export interface PivotNode {
  key: string;
  pairs: OwnershipPair[];
  children?: PivotNode[];
}

/** Group pairs by one key, sorted by name — the one primitive every tree uses. */
function groupBy(
  pairs: readonly OwnershipPair[],
  key: (p: OwnershipPair) => string,
): PivotNode[] {
  const m = new Map<string, OwnershipPair[]>();
  for (const p of pairs) {
    const l = m.get(key(p));
    if (l) l.push(p); else m.set(key(p), [p]);
  }
  return [...m.entries()]
    .map(([k, ps]) => ({ key: k, pairs: ps }))
    .sort((a, b) => a.key.localeCompare(b.key));
}

/** The pair field a level's label is read from. */
const FIELD: Record<Field, (p: OwnershipPair) => string> = {
  entity: p => p.owner,                                 // overridden per level below
  attr: p => p.slotName,
  srcAttr: p => `${p.declaredOn}.${p.slotName}`,
  target: p => p.range,
};

/**
 * How many distinct values a pivot has — the number on the count line.
 *
 * Read off the SAME key function the expansion groups by, so a count can never
 * disagree with the list it opens.
 */
export function pivotCount(pairs: readonly OwnershipPair[], pivot: Pivot): number {
  return pivot === 'total'
    ? pairs.length
    : new Set(pairs.map(TOP_KEY[pivot])).size;
}

/**
 * The tree one pivot opens, to whatever depth its shape declares.
 *
 * ⚠️ **A merged column must be adjacent to what it groups** — the second
 * finding of the exploration. Grouping the attribute column when it sits LAST
 * drags its edges backward across its neighbour into a hairball; next to the
 * owner it produces `performed_by (11)`, which is the insight no other view in
 * the app offers.
 *
 * ⚠️ **No single-child collapsing.** An earlier cut folded a one-child group
 * onto its parent's line; that is commented out of the spec until the columns
 * settle (Siggie, 2026-09-15), because a folded row does not line up with the
 * header its siblings align to.
 */
export function pivotTree(
  pairs: readonly OwnershipPair[], pivot: Pivot, forward: boolean,
): PivotNode[] {
  const { levels } = shapeOf(pivot, forward);
  const build = (ps: readonly OwnershipPair[], depth: number): PivotNode[] => {
    /*
     * The `entity` field means the OWNER at the top level and the target
     * further down — `attrs`/bkwd nests target under attribute name, where the
     * owner has already been named by the rule itself. Both read `p.owner` for
     * a backward pair, since there the owner IS the target.
     */
    const field = levels[depth];
    const key = field === 'entity' && depth > 0 && !forward
      ? (p: OwnershipPair) => p.owner
      : depth === 0 ? TOP_KEY[pivot] : FIELD[field];
    const nodes = groupBy(ps, key);
    return depth === levels.length - 1
      ? nodes
      : nodes.map(n => ({ ...n, children: build(n.pairs, depth + 1) }));
  };
  return build(pairs, 0);
}
