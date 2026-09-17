/**
 * `[Link Text](https://example.com){{target:replace}}` — where a link opens.
 *
 * Help links open in a new tab by default, because following one in the same
 * tab leaves the app and the tour's state stack goes with it. That default is
 * wrong for exactly one case: a link INTO this app — another tour, a share
 * link — which wants to navigate in place.
 *
 * So the target is authored, per link, rather than inferred from the URL.
 * Siggie, 2026-09-17, rejecting a bespoke `tour:` URL scheme built for the
 * same job: *"you did an awful lot of work to get the tour link to work
 * special and i think you should probably undo it all and just include the
 * link as a regular `<a>` but give a way to specify."* A general knob on an
 * ordinary link beats a second kind of link — it also covers `_blank` on a
 * tour that has chosen `replace` as its default, and anything else a `target`
 * attribute can say.
 *
 * **Values.** `replace` navigates in place (an `<a>` with no `target`);
 * anything else becomes the `target` attribute, so `{{target:_blank}}` is the
 * explicit spelling of the default.
 *
 * **Why a TEXT transform and not a remark plugin.** This was written as a
 * plugin first, and `remark-directive` ate it: in `{{target:replace}}` the
 * `:replace` parses as a text DIRECTIVE, so the tree holds
 * `text("{{target") · textDirective(replace) · text("}} ok")` and there is no
 * `{{target:…}}` node left to find. That is the same collision
 * `styleDirectives.ts` documents for unresolved `{{kind:arg}}` placeholders,
 * and the reason `:s[…]{…}` uses directive syntax rather than braces.
 *
 * So this runs BEFORE markdown is parsed, like `fillPlaceholders` — which is
 * where `{{…}}` syntax belongs anyway. It rewrites the marker into a title-
 * less HTML anchor that react-markdown will pass through the `a` component
 * with the attribute already on it.
 *
 * **An orphan is left visible.** A `{{target:…}}` that follows no link stays
 * on screen as written, like an unresolved placeholder, rather than being
 * silently swallowed — the author can see they wrote it somewhere it does
 * nothing.
 */

/** The prop the marker becomes, read by `MARKDOWN_COMPONENTS.a`. */
export const TARGET_ATTR = 'data-help-target';

/**
 * A markdown link followed by `{{target:value}}`.
 *
 * The marker may be separated from the link by a newline, because a
 * hand-wrapped paragraph in the content file breaks wherever it fits, and an
 * author should not have to keep the two on one line. Any run of whitespace
 * is allowed and is consumed with the marker.
 */
const LINK_THEN_TARGET =
  /\[([^\]]*)\]\(\s*([^)\s]*)(?:\s+"([^"]*)")?\s*\)\s*\{\{\s*target\s*:\s*([^}\s]+)\s*\}\}/gi;

/**
 * Marker written into a link's TITLE, the one slot markdown link syntax has
 * for extra data that reaches the component. `MARKDOWN_COMPONENTS.a` reads it
 * off `title` and strips it, so it never shows as a tooltip.
 *
 * An authored title, if there was one, is kept after the marker.
 */
export const TARGET_TITLE_PREFIX = 'help-target:';

/**
 * Rewrite `[text](url){{target:x}}` so the target survives markdown parsing.
 *
 * Markdown has no syntax for an arbitrary attribute on a link, and the popover
 * does not load `rehype-raw`, so a raw `<a>` would render as text. The title
 * slot is the one piece of link syntax that carries a free string through to
 * the component, so the marker travels there and is stripped on the way out.
 */
export function applyLinkTargets(markdown: string): string {
  if (!markdown.includes('{{')) return markdown;
  return markdown.replace(
    LINK_THEN_TARGET,
    (_whole, text: string, url: string, title: string | undefined, value: string) =>
      `[${text}](${url} "${TARGET_TITLE_PREFIX}${value}${title ? ` ${title}` : ''}")`,
  );
}
