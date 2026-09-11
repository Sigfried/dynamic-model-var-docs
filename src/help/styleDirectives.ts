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
 * `nowrap`, `center` — mapped to a fixed CSS declaration or two each. Anything else, and any value
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
  // `display:block` so it works on a span too: an inline element cannot
  // centre its own text, so a centred span becomes a centred line.
  center: () => 'display:block;text-align:center',
};

/** The directive name this plugin gives meaning to. */
export const STYLE_DIRECTIVE = 's';

const SAFE_VALUE = /^[\w.#%(),\s-]*$/;

/** Directive attributes → one inline `style` string, whitelisted. */
export function styleOf(attributes: Record<string, string | null | undefined> | null | undefined): string {
  const decls: string[] = [];
  for (const [prop, raw] of Object.entries(attributes ?? {})) {
    if (!(prop in PROPS)) continue;
    const value = (raw ?? '').trim();
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

function visit(node: Node): void {
  if (DIRECTIVES.has(node.type)) {
    const inline = node.type === 'textDirective';
    const style = node.name === STYLE_DIRECTIVE ? styleOf(node.attributes) : '';
    node.data = {
      ...node.data,
      hName: inline ? 'span' : 'div',
      hProperties: style ? { style, className: 'help-styled' } : {},
    };
  }
  for (const c of node.children ?? []) visit(c);
}

/** The plugin, to run AFTER `remark-directive`: `remarkPlugins={[remarkDirective, remarkStyleDirectives]}`. */
export function remarkStyleDirectives() {
  return (tree: unknown) => { visit(tree as Node); };
}
