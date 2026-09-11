/**
 * dmvd's TEXT resolvers: what a `{{kind:arg}}` placeholder in help content is
 * replaced with.
 *
 * The same seam as `helpResolvers.ts`, for the same reason. Resolving
 * `{{model-description:Participant}}` means knowing what a BDCHM class is,
 * which `src/help/` must not (docs/HELP_PACKAGE_PLAN.md); the package only
 * knows how to find `{{kind:arg}}` and hand `arg` to whoever registered
 * `kind`. These are handed to `<HelpProvider textResolvers={...}>`.
 *
 * **Why placeholders rather than deriving text from the step's `Anchor:`.**
 * Siggie, 2026-09-08: "i prefer explicit". A step anchored at
 * `entity-row:Participant` could have silently gained that class's
 * description, which is less to type but hides where the text came from and
 * has no answer for a step with no anchor. A placeholder says so at the point
 * the text lands, and composes with authored prose around it — you can write
 * a sentence of framing and then drop the model's own words in beneath it,
 * which a whole-field override could not do.
 *
 * | Kind | Fills with |
 * |---|---|
 * | `{{model-description:<Class>}}` | that class's `description` from the schema |
 * | `{{enum-description:<Enum>}}` | that enumeration's `description` |
 * | `{{category-label:<id>}}` | a category's display label (`admin` → "Admin / Study") |
 *
 * **Returning undefined leaves the placeholder standing**, visibly, in the
 * popover. That is the designed behaviour for a name the schema no longer has
 * — an upstream sync renaming a class is exactly the drift this has to
 * survive, and a literal `{{model-description:Gone}}` on screen names the
 * missing thing where a silently empty popover would hide it. `helpContent`
 * tests assert every placeholder in the content file resolves, so the drift
 * shows up as a red test first.
 */

import type { DataService } from '../services/DataService';
import { ENTITY_CATEGORIES } from '../config/entityCategories';
import EdgeSample from './EdgeSample';
import { EDGE_STYLE, type DrawnKind } from './edgeStyle';

/**
 * An empty description is a MISS, not a hit.
 *
 * `getClassDescription` returns `''` both for "no such class" and for "a class
 * the schema documents with nothing" — indistinguishable here, and in both
 * cases substituting the empty string would silently delete the placeholder
 * and leave a step with a hole in its prose. Leaving the placeholder visible
 * says which class has no description, which is a schema gap worth seeing.
 */
const nonEmpty = (s: string | undefined): string | undefined =>
  s && s.trim() ? s.trim() : undefined;

export function helpTextResolvers(dataService: DataService) {
  return {
    'model-description': (classId: string) =>
      nonEmpty(dataService.getClassDescription(classId)),

    'enum-description': (enumId: string) =>
      nonEmpty(dataService.getEnumDetail(enumId)?.description),

    /* The LABEL, not the id: content says `{{category-label:admin}}` and gets
       "Admin / Study", so a category renamed in config does not leave stale
       prose in the tour. Read from the config rather than from
       `getCategoryGroups()` so it still resolves for a category whose classes
       are all missing — the label is a fact about the config either way. */
    'category-label': (id: string) =>
      nonEmpty(ENTITY_CATEGORIES.find(c => c.id === id)?.label),

    /*
     * `{{edge:own-fwd}}` — the arrow as the canvas draws it, inline in prose.
     * Resolves to a markdown image whose URL names a WIDGET; the help layer
     * hands `widget:` images to the host's widget map (see `helpWidgets`),
     * which draws an `EdgeSample`. The alt text is the legend's label, so a
     * reader without the widget still gets "A owns B". An unknown kind stays
     * a visible placeholder, like every other resolver here.
     */
    'edge': (kind: string) =>
      kind in EDGE_STYLE.kinds
        ? `![${EDGE_STYLE.kinds[kind as DrawnKind].label}](widget:edge:${kind})`
        : undefined,
  };
}

/**
 * Inline widgets the tour's markdown can embed as `![alt](widget:<name>:<arg>)`.
 * The `edge` resolver above writes that URL; this is what draws it.
 */
export const helpWidgets = {
  edge: (kind: string) =>
    kind in EDGE_STYLE.kinds
      ? <EdgeSample kind={kind as DrawnKind} width={40} className="help-inline-widget" />
      : null,
};
