/**
 * What a category's content view draws — the ⊞ control on each category
 * header in the Explore selector. See `docs/TOURS_AND_CONTENT.md` §1.
 *
 * Its own module rather than a helper inside `SelectionTable.tsx` because a
 * component file may only export components (react-refresh/only-export-
 * components), and because this is a statement about the CONFIG — it belongs
 * beside `EntityCategory.pins`, whose meaning it implements.
 *
 * `src/config/` is a leaf that imports nothing, so the parameter is typed
 * structurally rather than as `CategoryGroup`/`CategoryTree` from
 * `services/DataService`. Both satisfy it.
 */

/** The two fields a content view is composed from. */
export interface CategoryViewSource {
  readonly classIds: readonly string[];
  readonly pins: readonly string[];
}

/**
 * The class ids a category's content view draws: its members, then its pins.
 *
 * Members first so the category itself leads and the borrowed classes read as
 * context. Deduped because a pin CAN also be a member of another category and
 * so could arrive twice — `BodySite` is a member of both `clinical` and `lab`
 * and a pin of `observation` — and a duplicate id in the selection would
 * toggle two rows for one class.
 */
export function categoryView(group: CategoryViewSource): string[] {
  return [...new Set([...group.classIds, ...group.pins])];
}
