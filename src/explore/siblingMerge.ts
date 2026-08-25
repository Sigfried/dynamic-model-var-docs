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

/** Swatch colours for a sibling's own rows. Chosen to stay distinguishable
 *  from the channel dots (amber = ownership, gray = reference) and from each
 *  other in both themes. Cycles if a parent ever has more siblings than this
 *  on canvas at once. */
export const SIBLING_COLORS = [
  '#2563eb', // blue
  '#16a34a', // green
  '#db2777', // pink
  '#9333ea', // purple
  '#0891b2', // cyan
  '#ca8a04', // yellow-dark
  '#dc2626', // red
  '#4f46e5', // indigo
] as const;

export function siblingColor(index: number): string {
  return SIBLING_COLORS[index % SIBLING_COLORS.length];
}

/** One class folded into a merged box. */
export interface MergedMember {
  id: string;
  label: string;
  color: string;
}

/**
 * Group ids by parent, keeping only groups of 2+ that share a mergeable
 * parent. Classes with no parent, an unmergeable parent, or no sibling on
 * canvas are left alone.
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
  for (const [parent, members] of byParent) {
    if (members.length < 2) byParent.delete(parent);
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
