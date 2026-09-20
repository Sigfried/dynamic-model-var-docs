/**
 * `:s[text]{size=.7em bg=pink}` and `:::s{color=blue} … :::` — styling a span
 * or a block of help prose, with the prose inside still markdown.
 *
 * The syntax is `remark-directive`'s (the generic-directive proposal for
 * markdown): `:name[content]{attrs}` inline, `:::name{attrs}` … `:::` for a
 * block. This plugin gives the `s` directive its meaning: the content becomes
 * a `<span>` or `<div>` carrying the styles its attributes name. A text
 * resolver could not have done this — it runs before markdown, so it could
 * neither wrap formatted text nor know where a range ends. Siggie,
 * 2026-09-11: "that one seems much better".
 *
 * Attributes are a short whitelist — `size`, `color`, `bg`, `opacity`,
 * `nowrap`, `sup`, `center` (block form only) — mapped to one CSS declaration each. Anything else, and any value
 * with characters outside the plain CSS value set, is dropped, so the content
 * file cannot become a general CSS surface. A directive of another name is
 * rendered as plain content, so a typo loses the styling and not the text.
 */

const PROPS: Record<string, (v: string) => string> = {
  size: v => `font-size:${v}`,
  color: v => `color:${v}`,
  bg: v => `background-color:${v}`,
  opacity: v => `opacity:${v}`,
  nowrap: () => 'white-space:nowrap',
  center: () => 'text-align:center',
  /*
   * A footnote marker: `an ownership:s[*]{sup} relationship`, and the same
   * `:s[*]{sup}` opening the note itself.
   *
   * Bold is part of the attribute rather than something the author adds around
   * it (`**:s[*]{sup}**`), because a superscript `*` at .75em is easy to miss
   * and a marker nobody notices is not a marker — Siggie, 2026-09-20.
   * `line-height:0` keeps the raised glyph from stretching its line.
   */
  sup: () => 'vertical-align:super;font-size:.75em;font-weight:700;line-height:0',
};

/**
 * Attributes that only mean something on the block form. `text-align` on an
 * inline span does nothing (a span has no line of its own to align within),
 * and forcing `display:block` would stop `:s[…]` sharing a line with other
 * text — Siggie, 2026-09-11. So on `:s[…]` these are dropped.
 */
const BLOCK_ONLY = new Set(['center']);

/** The directive name this plugin gives meaning to. */
export const STYLE_DIRECTIVE = 's';

const SAFE_VALUE = /^[\w.#%(),\s-]*$/;

/**
 * Attributes whose value may be a NAME from the host's palette
 * (`color=own-fwd`, `bg=entity`) rather than a CSS colour. The package knows
 * no colours; the host hands a `{name: css}` map to `<HelpProvider colors>`,
 * so content can wear the same colours the canvas and legend draw with and
 * follow them when they change. A name not in the map is passed through as
 * CSS, so `color=blue` still works.
 */
const PALETTE_PROPS = new Set(['color', 'bg']);

export type ColorMap = Record<string, string>;

/** Directive attributes → one inline `style` string, whitelisted. */
export function styleOf(
  attributes: Record<string, string | null | undefined> | null | undefined,
  inline = false,
  colors?: ColorMap,
): string {
  const decls: string[] = [];
  for (const [prop, raw] of Object.entries(attributes ?? {})) {
    if (!(prop in PROPS) || (inline && BLOCK_ONLY.has(prop))) continue;
    let value = (raw ?? '').trim();
    if (PALETTE_PROPS.has(prop)) value = colors?.[value] ?? value;
    // `url(` is the one thing the value set would otherwise let through.
    if (!SAFE_VALUE.test(value) || /url\s*\(/i.test(value)) continue;
    decls.push(PROPS[prop](value));
  }
  return decls.join(';');
}

interface Node {
  type: string;
  name?: string;
  attributes?: Record<string, string | null | undefined> | null;
  children?: Node[];
  data?: { hName?: string; hProperties?: Record<string, unknown> };
}

const DIRECTIVES = new Set(['textDirective', 'leafDirective', 'containerDirective']);

/**
 * A directive that is not ours, and carries no bracketed content, put back as
 * the literal text the author wrote.
 *
 * `remark-directive` parses ANY `:name` as a directive, which collides with the
 * `{{kind:arg}}` placeholder syntax: in an UNRESOLVED `{{model-description:Gone}}`
 * the `:Gone}` is read as a directive named `Gone`, and since a nameless
 * directive has no children it rendered as an empty span — so the placeholder
 * reached the screen as `{{model-description}}`, stripped of the very argument
 * that says which name went missing.
 *
 * That silently broke the contract `fillPlaceholders` is built on: an
 * unresolved placeholder is left visible SO THAT schema drift names itself on
 * screen. Naming the kind and dropping the class is the half that does not
 * help. (Found 2026-09-15 while testing `<HelpMarkdown>`; it was never
 * legend-specific — every tour placeholder had it.)
 *
 * Only the CHILDLESS case is restored. `:x[text]{a=1}` keeps the existing
 * behaviour — the text survives, the unknown styling is dropped — because
 * there the author's content is in the brackets and is not at risk.
 */
function literalize(node: Node): void {
  const attrs = Object.entries(node.attributes ?? {})
    .map(([k, v]) => (v === null || v === undefined || v === '' ? k : `${k}=${v}`))
    .join(' ');
  node.type = 'text';
  (node as Node & { value: string }).value =
    `:${node.name ?? ''}${attrs ? `{${attrs}}` : ''}`;
  delete node.data;
  delete node.children;
}

function visit(node: Node, colors: ColorMap | undefined): void {
  if (DIRECTIVES.has(node.type)) {
    const inline = node.type === 'textDirective';
    if (node.name !== STYLE_DIRECTIVE && !node.children?.length) {
      literalize(node);
      return;
    }
    const style = node.name === STYLE_DIRECTIVE ? styleOf(node.attributes, inline, colors) : '';
    node.data = {
      ...node.data,
      hName: inline ? 'span' : 'div',
      hProperties: style ? { style, className: 'help-styled' } : {},
    };
  }
  for (const c of node.children ?? []) visit(c, colors);
}

/**
 * The plugin, to run AFTER `remark-directive`:
 * `remarkPlugins={[remarkDirective, [remarkStyleDirectives, { colors }]]}`.
 */
export function remarkStyleDirectives(options: { colors?: ColorMap } = {}) {
  return (tree: unknown) => { visit(tree as Node, options.colors); };
}
