/**
 * siblingMerge — collapse classes that share a parent into ONE box.
 *
 * The modelling question this answers (Siggie, 2026-08-25): inheritance is
 * real and worth showing, but drawing it as edges crowds the graph out of
 * legibility — 37 classes hang off `Entity` alone. So is-a is rendered as
 * ADJACENCY, not as a line: siblings on the canvas become a single box titled
 * by their parent, in which
 *
 *   - rows the parent declares are shared by every sibling and read as the
 *     box's own (no swatch, full-strength type);
 *   - rows a sibling declares itself carry that sibling's colour swatch, so
 *     "which slot belongs to whom" is answered in place rather than by a line
 *     leaving the box.
 *
 * `Entity` is never a merge parent — SKIP_SUBCLASS_EXPANSION excludes it from
 * is-a edges for the same reason it is useless here: a box titled "Entity"
 * holding 37 classes is the crowding, relocated.
 *
 * This is a pass over the ViewModel, deliberately: nodes are addressed by id
 * and rows by slot name everywhere downstream (buildSpec's ports, rowY, the
 * renderer), so a merged node is just another node and merged edges are just
 * edges with rewritten endpoints. Nothing in layout or routing knows this
 * happened.
 */

import { GRAPH_COLORS } from '../config/appConfig';

/**
 * Colour for the nth child of a merged box. The palette itself lives in
 * appConfig (GRAPH_COLORS.siblings) — never inline a colour here.
 *
 * Wraps rather than throwing when a box has more children than the palette:
 * a recycled colour is a legibility problem, a crash is a broken canvas. If
 * boxes routinely exceed the palette, lengthen it there.
 */
export function siblingColor(index: number): string {
  const p = GRAPH_COLORS.siblings;
  return p[index % p.length];
}

/** One class folded into a merged box. */
export interface MergedMember {
  id: string;
  label: string;
  color: string;
}

/**
 * Group ids by parent. EVERY class with a mergeable parent forms a group, even
 * a lone child.
 *
 * Siggie, 2026-08-25: *"when any entity with a parent is shown, it merges the
 * parent even if the parent (and no other sibling) is not selected."* The
 * earlier rule — 2+ siblings required — meant a box's shape depended on what
 * ELSE happened to be selected: `MeasurementObservation` alone showed its own
 * flat attribute list, while adding a sibling reorganised it into shared rows
 * plus child blocks. Same class, different anatomy, for reasons outside it.
 *
 * Merging unconditionally makes the parent's rows the top block ALWAYS, which
 * is also what makes slot order stable: shared rows come first in the parent's
 * declared order, then each child's own rows in theirs.
 *
 * `order` fixes member (and therefore colour) assignment: sorted by id, so a
 * sibling keeps its colour as unrelated classes come and go from the canvas.
 */
export function groupSiblings(
  ids: string[],
  parentOf: (id: string) => string | undefined,
  isMergeableParent: (parent: string) => boolean,
): Map<string, string[]> {
  const byParent = new Map<string, string[]>();
  for (const id of [...ids].sort()) {
    const parent = parentOf(id);
    if (!parent || !isMergeableParent(parent)) continue;
    byParent.set(parent, [...(byParent.get(parent) ?? []), id]);
  }
  return byParent;
}

/** Id of the box a group of siblings merges into. Namespaced so it can never
 *  collide with a real class id — the parent may itself be on canvas as an
 *  ordinary node, and that node is NOT this box. */
export function mergedIdFor(parent: string): string {
  return `merged::${parent}`;
}

export function isMergedId(id: string): boolean {
  return id.startsWith('merged::');
}

/** The parent class a merged id was built from. */
export function parentOfMergedId(id: string): string {
  return id.slice('merged::'.length);
}

/**
 * A row as `withChildHeaders` needs to see it. The view's RowVM is a superset;
 * stated structurally so the grouping policy does not depend on the view's
 * row type.
 */
export interface HeadableRow {
  owners?: MergedMember[];
}

/**
 * Insert a child's name as a header row above the block of rows it declares.
 *
 * Replaces the earlier colour-swatch-per-row scheme (Siggie, 2026-08-25: "i'm
 * not sure i like the swatches"): with five children the swatch legend could
 * not fit in the box header, and a swatch answers "whose is this?" one row at
 * a time rather than showing each child as a thing with a shape. A header per
 * block scales to any number of children and reads as an outline.
 *
 * Shared (parent) rows come first and get NO header — they are the box's
 * subject, and labelling them would imply they are just another block.
 *
 * Rows must already be sorted so each child's rows are contiguous; a header is
 * inserted wherever the owning child changes. `makeHeader` builds the header
 * row, so the caller owns the row type and this stays view-agnostic.
 */
export function withChildHeaders<T extends HeadableRow>(
  rows: T[],
  members: MergedMember[],
  makeHeader: (child: MergedMember) => T,
): T[] {
  if (!members.length) return rows;
  const byChild = new Map<string, T[]>(members.map(m => [m.id, []]));
  const shared: T[] = [];
  for (const r of rows) {
    // A row several children declare independently is filed under the first of
    // them in member order; its remaining owners still show on the row.
    const owner = r.owners?.length
      ? [...r.owners].sort(
          (a, b) => members.findIndex(m => m.id === a.id)
            - members.findIndex(m => m.id === b.id))[0]
      : undefined;
    if (owner) byChild.get(owner.id)?.push(r);
    else shared.push(r);
  }
  // EVERY member gets a header, including one that adds no rows of its own.
  // Emitting headers only for children that own rows made three of the
  // Observation subclasses invisible — SpecimenQuality/QuantityObservation and
  // DimensionalObservation each add nothing to Observation, so selecting them
  // drew a box with no sign they were there. "This subclass adds nothing" is
  // information, and it is the answer to "why did my selection not appear".
  return [
    ...shared,
    ...members.flatMap(m => [makeHeader(m), ...(byChild.get(m.id) ?? [])]),
  ];
}
