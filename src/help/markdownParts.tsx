/**
 * The pieces `<HelpMarkdown>` is built from — the component table, the widget
 * image renderer, the URL transform and the plugin list.
 *
 * Split out of `HelpMarkdown.tsx` so that file exports ONLY a component, which
 * is what Fast Refresh needs to hot-reload it (`react-refresh/only-export-components`).
 * Most callers want `<HelpMarkdown>` and should not import from here; the one
 * real exception is `HelpLayer`, whose popover drives `<Markdown>` directly —
 * its content is already placeholder-filled by the provider, and a `Once:`
 * entry needs a per-entry component table.
 */

import { defaultUrlTransform } from 'react-markdown';
import remarkDirective from 'remark-directive';
import type { PluggableList } from 'unified';
import type { WidgetRenderer } from './helpContext';
import { remarkStyleDirectives } from './styleDirectives';

/**
 * Markdown link handling for every popover.
 *
 * Links in a `Description:` are references out to the LinkML schema, the BDCHM
 * docs and so on. Following one in the same tab would leave the app, and the
 * tour's state stack goes with it -- so they open in a new tab, with the
 * `noreferrer` that `target="_blank"` needs to not hand the opened page a
 * handle on this one.
 */
export const MARKDOWN_COMPONENTS = {
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
    <a href={href} target="_blank" rel="noreferrer">{children}</a>
  ),
  /**
   * A markdown blockquote is the popover's ALERT.
   *
   * Chosen over a new `Alert:` entry field on purpose: an alert is a bit of a
   * step's prose, not a property of the step, so it has to be placeable
   * *within* a description or a beat -- before the text, after it, or as the
   * whole of it. A field can only ever sit in one fixed slot, and every beat
   * would have needed its own copy of the field to say anything urgent.
   * `>` costs the author one character and works in every markdown block the
   * popover renders.
   *
   * Styled unlike the `Action:` band, which is also a tinted rule-left box:
   * that one is the tour reporting what it just did to the app, this one is
   * the tour telling you something you need to know. Amber vs. blue, and a
   * `!` rather than a `✓`.
   */
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <div className="help-popover-alert" role="note">
      <span className="help-popover-alert-mark" aria-hidden="true">!</span>
      <div>{children}</div>
    </div>
  ),
};

/** The URL scheme an inline widget image uses: `widget:<name>:<arg>`. */
const WIDGET_SCHEME = 'widget:';

/**
 * `react-markdown` drops URLs whose scheme it does not know, `widget:` among
 * them; ordinary images and links keep the default (safe) treatment.
 */
export const urlTransform = (url: string) =>
  url.startsWith(WIDGET_SCHEME) ? url : defaultUrlTransform(url);

/**
 * The `img` component: a `widget:` image is drawn by the host's widget of that
 * name, or falls back to its alt text when the host has none; anything else is
 * an ordinary image.
 *
 * This is how prose gets an arrow drawn the way the canvas draws it
 * (`{{edge:own-fwd}}` → `![A owns B](widget:edge:own-fwd)` → EdgeSample),
 * without `react-markdown` having to render raw HTML and without the package
 * knowing what an edge is (Siggie, 2026-09-10: "I would like to be able to
 * use the arrow images in the tour").
 */
export function widgetImg(widgets: Record<string, WidgetRenderer> | undefined) {
  return function Img({ src, alt }: { src?: string; alt?: string }) {
    if (src?.startsWith(WIDGET_SCHEME)) {
      const rest = src.slice(WIDGET_SCHEME.length);
      const colon = rest.indexOf(':');
      const name = colon === -1 ? rest : rest.slice(0, colon);
      const arg = colon === -1 ? '' : rest.slice(colon + 1);
      const drawn = widgets?.[name]?.(arg);
      return drawn ?? <span>{alt}</span>;
    }
    return <img src={src} alt={alt} />;
  };
}

/** Order matters: `remark-directive` parses `:s[…]{…}`; the second gives `s`
 *  its meaning, with the host's colour names. Memoise per `colors` identity at
 *  the call site so the array is stable across renders. */
export const remarkPluginsFor = (colors: Record<string, string> | undefined): PluggableList =>
  [remarkDirective, [remarkStyleDirectives, { colors }]];
