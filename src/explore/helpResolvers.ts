/**
 * dmvd's anchor resolvers: how the tour finds a ROW, not just a panel.
 *
 * The parser splits an `Anchor:` field into `{ kind, arg }` and deliberately
 * stops there — resolving `entity-row:Participant` means knowing what a dmvd
 * entity row IS, which `src/help/` must not, so it can be extracted as a
 * package (docs/HELP_PACKAGE_PLAN.md). These live on the dmvd side of that
 * seam and are handed to `<HelpProvider resolvers={...}>`.
 *
 * The four kinds, and where their markup is:
 *
 * | Kind | Element | Marked at |
 * |---|---|---|
 * | `entity-row:<E>` | that class's row in the left panel | `SelectionTable.tsx` (`data-class-row`), `SelectionTree.tsx` (`data-entity-row`) |
 * | `entity-checkbox:<E>` | the checkbox in that row | found within the row |
 * | `slot-row:<E>.<slot>` | one attribute row in a diagram box | `OwnershipGraphView.tsx` (`data-row` + `data-declaring-class`) |
 * | `node-box:<E>` | a whole entity box | `OwnershipGraphView.tsx` (`data-node-id`) |
 *
 * **Returning null is normal.** The row may be collapsed, scrolled out of a
 * virtualised list, or on a diagram the current selection does not include.
 * The help layer degrades to an unringed popover; nothing throws. That is also
 * why these are queried live on every measure rather than captured once: the
 * diagram destroys and rebuilds boxes as it relayouts.
 */

/** `[attr="value"]`, escaped. Class ids are LinkML names, but a hand-authored
 *  anchor is still arbitrary text and must not be able to break the selector. */
const attrIs = (attr: string, value: string) => `[${attr}="${CSS.escape(value)}"]`;

/**
 * The left panel, whichever selector is mounted in it.
 *
 * Scoped because a second `DagBrowser` lives in the Focus view: an unscoped
 * query for a row would happily ring the one in the other view.
 */
const selectionPanel = () => document.querySelector('[data-help-id="selection-tree"]');

/**
 * An entity's row in the left panel.
 *
 * The panel has two modes and they mark rows differently: the table (`list`,
 * the default) puts `data-class-row` on the whole `<label>`, while the tree
 * hands rows to the DagBrowser widget, whose row wrapper carries no node id at
 * all — so dmvd marks the one span it controls and this walks up to the
 * widget's `.dbw-row` for the full-width rect.
 *
 * In the tree the same class can appear more than once (polyhierarchy: the
 * "★ also under" rows), and a collapsing row stays mounted, mid-animation, at
 * zero height. Both are handled by preferring the first match that is actually
 * showing.
 */
function entityRow(entity: string): Element | null {
  const panel = selectionPanel();
  if (!panel) return null;

  const table = panel.querySelector(attrIs('data-class-row', entity));
  if (table) return table;

  const marks = [...panel.querySelectorAll(attrIs('data-entity-row', entity))];
  const rows = marks.map(m => m.closest('.dbw-row') ?? m);
  // A row inside a collapsing section is still in the DOM but has no height;
  // ringing it draws a line across the panel at an arbitrary place.
  return rows.find(r => r.getBoundingClientRect().height > 0) ?? rows[0] ?? null;
}

/**
 * The checkbox in that row. Built on `entityRow` rather than on its own
 * selector: neither mode marks the input itself, and "the checkbox of the row
 * we would have rung" is exactly the right definition anyway.
 */
function entityCheckbox(entity: string): Element | null {
  return entityRow(entity)?.querySelector('input[type="checkbox"]') ?? null;
}

/**
 * A whole entity box on the diagram.
 *
 * Sibling merge complicates identity: merged siblings share one box whose id
 * is `merged::<parent>`, and a merged CHILD has no box of its own. So an
 * anchor naming a class falls back to that class's merged box, and then to any
 * box that lists it as a member — which is where a viewer would look for it.
 */
function nodeBox(entity: string): Element | null {
  const own = document.querySelector(attrIs('data-node-id', entity));
  if (own) return own;

  const merged = document.querySelector(attrIs('data-node-id', `merged::${entity}`));
  if (merged) return merged;

  // A class merged INTO a sibling box has no box of its own. Its rows do carry
  // its name, so the box containing them is where a viewer would look for it.
  const row = document.querySelector(attrIs('data-declaring-class', entity));
  return row?.closest('[data-node-id]') ?? null;
}

/**
 * One attribute row inside a box, from `<Entity>.<slot>`.
 *
 * Split on the LAST dot: LinkML slot names use underscores, never dots, so
 * anything before the final dot is the class — which keeps working if a
 * namespaced class id ever shows up.
 *
 * Inside a merged box `data-row` is not unique (the parent's slot plus each
 * child's narrowed override all carry the same name), so the declaring class
 * decides. An unmerged box needs no such tiebreak: its `data-node-id` already
 * said which class these rows belong to.
 */
function slotRow(arg: string): Element | null {
  const dot = arg.lastIndexOf('.');
  if (dot === -1) return null;
  const entity = arg.slice(0, dot);
  const slot = arg.slice(dot + 1);

  const box = nodeBox(entity);
  if (!box) return null;

  const declared = box.querySelector(
    `${attrIs('data-row', slot)}${attrIs('data-declaring-class', entity)}`,
  );
  if (declared) return declared;
  // Rows a merged box drew for its parent carry no declaring class, and an
  // unmerged box never sets one; either way the slot name alone is enough.
  return box.querySelector(attrIs('data-row', slot));
}

/** The table handed to `<HelpProvider resolvers={...}>`. */
export const helpResolvers = {
  'entity-row': entityRow,
  'entity-checkbox': entityCheckbox,
  'slot-row': slotRow,
  'node-box': nodeBox,
};
