/**
 * dmvd's anchor tags: the string every anchorable element wears so the tour can
 * point at it.
 *
 * REPLACED `helpResolvers.ts`, a table of one lookup function per kind
 * (docs/HELP_PACKAGE_PLAN.md §1a). Each element now carries its WHOLE anchor in
 * `data-help-id` — `node-box:Participant`,
 * `slot-row:MeasurementObservation.observation_type` — written at the render
 * site, and the help package finds it with one `querySelector`.
 *
 * This stays on the dmvd side of the package seam for the same reason the
 * resolvers did: knowing that a class has a row, or that a merged child has a
 * header strip instead of a box, is dmvd's knowledge. What changed is only HOW
 * the element is found. The parser still splits `kind:argument` and stops, and
 * the host still decides what each kind means — by choosing which elements to
 * interpolate it onto. The package matches a string it never interprets.
 *
 * | Kind | Element | Tagged at |
 * |---|---|---|
 * | `entity-row:<E>` | that class's row in the left panel, LIST MODE | `SelectionTable.tsx` |
 * | `entity-checkbox:<E>` | the checkbox in that row | `SelectionTable.tsx` |
 * | `category-row:<id>` | a category's header bar, LIST MODE | `SelectionTable.tsx` |
 * | `node-box:<E>` | a whole entity box | `OwnershipGraphView.tsx` |
 * | `child-header:<E>` | a merged child's header strip | `OwnershipGraphView.tsx` |
 * | `slot-row:<E>.<slot>` | one attribute row in a box | `OwnershipGraphView.tsx` |
 *
 * `help-id:<id>` is the seventh kind and the only one the package owns: it is a
 * hand-written literal (`data-help-id="graph-canvas"`), not built here.
 *
 * **Not resolving is normal, not an error.** A box is only tagged when the
 * current selection draws it; a row only when its box is expanded. The help
 * layer degrades to an unringed popover. Two cases are deliberately shaped that
 * way:
 *
 *  - **`node-box:` on a merged CHILD does not resolve.** Merged siblings share
 *    one box, titled by their parent; a child has no box, only a header strip
 *    inside the parent's. The old resolver fell back to "the box containing a row
 *    this class declares", which returned the PARENT's box under the CHILD's
 *    name — and returned null for a child that narrows nothing. Same anchor, two
 *    meanings, failing silently either way. Siggie, 2026-09-08: *"it's not a
 *    nodeBox, there's no reason to try to look for it as if it were."* A merged
 *    child is addressed `child-header:`.
 *  - **`entity-row:` does not resolve in TREE mode.** The row rect there is
 *    DagBrowser's own `.dbw-row` wrapper, which dmvd does not render and cannot
 *    tag. Every live `entity-row` anchor is authored for list mode, the default.
 */

import { isMergedId, parentOfMergedId } from './siblingMerge';
import type { NodeVM, RowVM } from './OwnershipGraphView';

/**
 * Every kind built here. A content file's anchors are checked against this, so a
 * typo like `entity_row:` fails the build instead of silently pointing at
 * nothing.
 *
 * The one list, in the one file that builds them — which is the point of this
 * module. It used to be maintained separately in the test and went stale:
 * `category-row` worked, the content used it, and the only thing that failed was
 * the copy. Adding a builder below without adding its kind here breaks the same
 * way, so `helpAnchors.test.ts` pins the two together.
 */
export const ANCHOR_KINDS = [
  'entity-row', 'entity-checkbox', 'category-row',
  'node-box', 'child-header', 'slot-row',
] as const;

export type AnchorKind = typeof ANCHOR_KINDS[number];

/** The left panel's row for a class, and the checkbox inside it.
 *
 *  The checkbox is TAGGED rather than derived as "the input inside the row":
 *  deriving it would mean the help package knowing that `entity-checkbox` is an
 *  input nested in an `entity-row`, which is kind INTERPRETATION in package code
 *  and the one thing the seam forbids. */
export const entityRowTag = (classId: string) => `entity-row:${classId}`;
export const entityCheckboxTag = (classId: string) => `entity-checkbox:${classId}`;

/** A category's header bar, by its **id** — the short slug in
 *  `config/entityCategories.ts` (`admin`, `clinical`, …), not its display label,
 *  which is prose and changes. */
export const categoryRowTag = (categoryId: string) => `category-row:${categoryId}`;

/** A whole entity box. `classId` is the class the box is TITLED by, which for a
 *  merged box is the parent, not the synthetic `merged::` node id. */
export const nodeBoxTag = (classId: string) => `node-box:${classId}`;

/** A merged child's header strip — its only addressable element. */
export const childHeaderTag = (classId: string) => `child-header:${classId}`;

/**
 * One attribute row, as `<DeclaringClass>.<slot>`.
 *
 * The declaring class is what makes this unique, and flattening it into the
 * string is the point: a merged box holds several rows with one slot name (the
 * parent's, plus each child's narrowed override), so the pair
 * (`slot`, `declaringClass`) identifies a row and NO single selector expresses a
 * pair. Written whole it is just an attribute value.
 *
 * The anchor splits on the LAST dot, so a namespaced class id would still work:
 * LinkML slot names use underscores, never dots.
 */
export const slotRowTag = (declaringClass: string, slot: string) =>
  `slot-row:${declaringClass}.${slot}`;

/**
 * The CLASS a box stands for, which is not always its node id: a merged box's id
 * is `merged::<parent>`, and the class it is titled by is that parent. The author
 * writes the class they know (`node-box:ObservationSet`), never the synthetic id.
 */
const nodeClassOf = (node: NodeVM) =>
  isMergedId(node.id) ? parentOfMergedId(node.id) : node.id;

/**
 * The diagram's two tags, from the node and row a render site already has.
 *
 * They live here rather than in the view so the vocabulary and every string that
 * uses it stay in one file — and so a test can import them without dragging in a
 * component module. `import type` for the view models, so this is not a runtime
 * dependency and there is no cycle.
 */
export const nodeBoxAnchor = (node: NodeVM) => nodeBoxTag(nodeClassOf(node));

/** `declaringClass` is set only on a merged box's rows; on an unmerged one the
 *  box's own class already said it, so that is the fallback. */
export const slotRowAnchor = (node: NodeVM, row: RowVM) =>
  slotRowTag(row.declaringClass ?? nodeClassOf(node), row.slot);
