/**
 * `{{size:.7em; bg:pink}} … {{size:clear}}` — styling a span or a block of
 * help prose, with the prose between still rendered as markdown.
 *
 * A remark plugin, not a text resolver. A resolver runs before markdown and
 * can only emit markdown, which has no way to say "make this smaller" and no
 * way to say where the smaller part ends. Here the opening and closing
 * placeholders are found in the parsed tree, and everything between them is
 * wrapped in one element carrying the styles — so `**bold**`, `` `code` ``
 * and inline widgets inside the range keep working.
 *
 * Grammar (Siggie, 2026-09-11: "`{{size: .7em; bg-color:pink; opacity:.4}}`
 * … then `{{size:clear}}` or something to end"):
 *
 *   {{<prop>:<value>[; <prop>:<value>]*}}     open
 *   {{<prop>:clear}}                          close (any prop; `style` too)
 *
 * `prop` is one of a short whitelist — `size`, `color`, `bg` (`bg-color`,
 * `background`), `opacity`, `nowrap` — mapped to a CSS declaration each.
 * Anything else, and any value with characters outside the plain CSS value
 * set, is ignored, so the content file cannot become a general CSS surface.
 *
 * INLINE when the open and close sit in the same paragraph: the range is a
 * `<span>`. BLOCK when an open (or close) is a paragraph of its own: the
 * paragraph is replaced by the marker and the blocks that follow, up to the
 * closing paragraph, are wrapped in a `<div>`. An unclosed open runs to the
 * end of its container; a stray close is dropped.
 *
 * Text resolvers never see these: a placeholder whose kind has no resolver
 * is left in the text (`fillPlaceholders`), which is what lets it reach here.
 */

const PROPS: Record<string, (v: string) => string | undefined> = {
  size: v => `font-size:${v}`,
  color: v => `color:${v}`,
  bg: v => `background-color:${v}`,
  'bg-color': v => `background-color:${v}`,
  background: v => `background-color:${v}`,
  opacity: v => `opacity:${v}`,
  nowrap: () => 'white-space:nowrap',
};

/** The kinds this plugin claims; `style` opens with only `prop:value` pairs. */
export const STYLE_KINDS = ['style', ...Object.keys(PROPS)];

const MARKER = new RegExp(
  `\\{\\{\\s*(${STYLE_KINDS.join('|')})\\s*:\\s*([^}]*?)\\s*\\}\\}`, 'g',
);
const SAFE_VALUE = /^[\w.#%(),\s-]*$/;

/** Parse an open marker's declarations into one inline `style` string. */
export function styleOf(kind: string, arg: string): string {
  const parts = arg.split(';').map(s => s.trim()).filter(Boolean);
  const decls: string[] = [];
  parts.forEach((part, i) => {
    let prop: string;
    let value: string;
    const colon = part.indexOf(':');
    if (i === 0 && kind !== 'style' && colon === -1) { prop = kind; value = part; }
    else if (colon === -1) { return; }
    else { prop = part.slice(0, colon).trim(); value = part.slice(colon + 1).trim(); }
    // `url(` is the one thing the value set would otherwise let through.
    if (!(prop in PROPS) || !SAFE_VALUE.test(value) || /url\s*\(/i.test(value)) return;
    const d = PROPS[prop](value);
    if (d) decls.push(d);
  });
  return decls.join(';');
}

interface Node {
  type: string;
  value?: string;
  children?: Node[];
  data?: { hName?: string; hProperties?: Record<string, unknown> };
}
interface Marker extends Node { type: 'styleMarker'; style: string | null }

const isMarker = (n: Node): n is Marker => n.type === 'styleMarker';

/** Split one text node around markers. */
function splitText(node: Node): Node[] {
  const text = node.value ?? '';
  if (!text.includes('{{')) return [node];
  const out: Node[] = [];
  let last = 0;
  for (const m of text.matchAll(MARKER)) {
    const [whole, kind, arg] = m;
    if (m.index! > last) out.push({ type: 'text', value: text.slice(last, m.index) });
    out.push({
      type: 'styleMarker',
      style: arg.trim().toLowerCase() === 'clear' ? null : styleOf(kind, arg),
    } as Marker);
    last = m.index! + whole.length;
  }
  if (last < text.length) out.push({ type: 'text', value: text.slice(last) });
  return out;
}

const blank = (n: Node) => n.type === 'text' && !(n.value ?? '').trim();

function transform(parent: Node): void {
  if (!parent.children) return;
  // Depth first, so a paragraph has already split its text into markers.
  for (const c of parent.children) transform(c);

  let kids = parent.children.flatMap(c => c.type === 'text' ? splitText(c) : [c]);
  // A paragraph that is nothing but markers (and whitespace) is a BLOCK
  // marker. Leave its markers unwrapped here; the level above hoists them.
  if (parent.type === 'paragraph' && kids.some(isMarker) && kids.every(k => isMarker(k) || blank(k))) {
    parent.children = kids.filter(isMarker);
    return;
  }
  // ...and this is the level above: the hoist, in the paragraph's place.
  kids = kids.flatMap(c =>
    c.type === 'paragraph' && c.children?.some(isMarker) && c.children.every(k => isMarker(k) || blank(k))
      ? c.children.filter(isMarker)
      : [c]);

  const hName = parent.type === 'paragraph' || parent.type === 'strong'
    || parent.type === 'emphasis' || parent.type === 'link' ? 'span' : 'div';
  const out: Node[] = [];
  let open: { style: string; children: Node[] } | null = null;
  for (const c of kids) {
    if (isMarker(c)) {
      if (open) { out.push(wrap(open, hName)); open = null; }
      if (c.style !== null) open = { style: c.style, children: [] };
      continue;
    }
    (open ? open.children : out).push(c);
  }
  if (open) out.push(wrap(open, hName));
  parent.children = out;
}

function wrap(range: { style: string; children: Node[] }, hName: string): Node {
  return {
    type: 'styleRange',
    data: { hName, hProperties: { style: range.style, className: 'help-styled' } },
    children: range.children,
  };
}

/** The plugin: `remarkPlugins={[remarkStyleRanges]}`. */
export function remarkStyleRanges() {
  return (tree: unknown) => { transform(tree as Node); };
}
