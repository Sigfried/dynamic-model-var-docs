/**
 * The help system's markdown, callable on ANY string by any component.
 *
 * The whole pipeline used to be private to `HelpLayer.tsx`, which meant the tour's
 * prose could use `{{edge:own-fwd}}`, `:s[…]{color=own-fwd}` and the rest while
 * every other string in the app rendered as plain text. The legend's
 * `OWNERSHIP_RULES[].text` was the case that forced the extraction (TASKS
 * `markdown-everywhere` item (a)): it is prose about edges, rendered beside
 * hand-drawn edge samples, and could say nothing the tour can say.
 *
 * **The seam is deliberately NOT "make the legend a help entry"** — Siggie's
 * own first thought, rejected immediately as too complicated. A panel is not a
 * tour step: it has no anchor, no position in a tour, and no id worth
 * authoring. Exporting the PROCESSING instead lets any component call it on a
 * string it already has, and leaves the help registry alone. The parts this is
 * assembled from live in `markdownParts.tsx`, so this file can export only a
 * component and stay hot-reloadable.
 *
 * What a caller gets, identical to what a popover gets:
 * - `{{kind:arg}}` placeholders, through the host's text resolvers
 * - `![alt](widget:name:arg)` inline widgets, through the host's widget map
 * - `:s[…]{color=…}` style directives, against the host's colour names
 * - links that open in a new tab, and blockquotes styled as alerts
 *
 * All three host-supplied pieces are read off the help context, so a caller
 * passes a string and nothing else. Outside a `<HelpProvider>` the markdown
 * still renders and only the enrichments are missing — see `useHelpIfAny` for
 * why this does not throw the way the tour's own components do.
 */

import { useMemo } from 'react';
import Markdown from 'react-markdown';
import { useHelpIfAny } from './helpContext';
import { fillPlaceholders } from './parseHelpContent';
import {
  MARKDOWN_COMPONENTS, remarkPluginsFor, urlTransform, widgetImg,
} from './markdownParts';

/**
 * Render one markdown string the way a popover renders its prose.
 *
 * **Placeholders are filled HERE**, unlike in the popover. The provider fills
 * the content file once at parse time, so `HelpLayer` receives finished prose
 * and never calls `fillPlaceholders`; a caller handing us an arbitrary string
 * has been through no such pass. Filling at render is the cost of accepting a
 * string from anywhere, and it is cheap — `fillPlaceholders` returns the input
 * untouched when it holds no `{{`.
 *
 * `components` merges over the defaults rather than replacing them, so a caller
 * overriding one element (the `Once:` alert box is the one real case) keeps the
 * link and widget handling it did not ask about.
 */
export default function HelpMarkdown({ children, components }: {
  children: string;
  /** Overrides merged over the defaults — link, alert and widget handling. */
  components?: Record<string, React.ComponentType<never>>;
}) {
  const help = useHelpIfAny();
  const { widgets, colors, textResolvers } = help ?? {};
  const remarkPlugins = useMemo(() => remarkPluginsFor(colors), [colors]);
  const table = useMemo(
    () => ({ ...MARKDOWN_COMPONENTS, img: widgetImg(widgets), ...components }),
    [widgets, components],
  );
  const filled = useMemo(
    () => fillPlaceholders(children, textResolvers),
    [children, textResolvers],
  );
  return (
    <Markdown components={table} urlTransform={urlTransform} remarkPlugins={remarkPlugins}>
      {filled}
    </Markdown>
  );
}
