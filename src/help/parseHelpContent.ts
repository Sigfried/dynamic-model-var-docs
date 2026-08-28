/**
 * Parse the structured help-content.md into typed data.
 * Pure function, no dependencies beyond types.
 *
 * Ported from icd11-playground (web/src/utils/parseHelpContent.ts). The
 * `change`, `tour`, `anchor`, `action` and `beats` fields are dmvd additions;
 * everything else is unchanged. Kept dependency-free so it can move into the
 * shared help package without edits (docs/HELP_PACKAGE_PLAN.md).
 *
 * The authoring format is specified in the header comment of help-content.md
 * — that comment is the spec. This file is its implementation.
 */

/**
 * What a step points at. The parser deliberately does NOT interpret the
 * `kind:argument` form: resolving `entity-row:Participant` to an element needs
 * to know what a dmvd entity row IS, and this file has to stay host-agnostic
 * for the package extraction. The host registers resolvers; see
 * `HelpEntry.anchor`.
 */
export type HelpAnchor =
  /** No anchor: centre the popover, ring nothing. Authored as `Anchor: none`. */
  | { kind: 'none' }
  /** `kind:argument`, resolved by a host-registered resolver at runtime. */
  | { kind: string; arg: string };

/**
 * One beat within a tour step: the step keeps its popover and advances
 * through these before moving on. Covers both nested sub-steps and
 * reveal-the-next-bullet, which are the same mechanism.
 */
export interface TourBeat {
  /** Markdown shown for this beat. */
  text: string;
  /**
   * Keep what is already showing and add this beat below it, instead of
   * replacing the popover's contents with this beat alone.
   *
   * **Beats REPLACE by default; `Keep: true` is the opt-in to accumulate.**
   *
   * This is the inverse of what shipped earlier the same day, and the reason
   * is that accumulation did not do the one job it was for. Under
   * accumulate-by-default the newest text sits at the BOTTOM of a growing
   * block, and however hard the old text is dimmed the eye still has to find
   * where to start -- a blue rule and an entrance animation were both tried
   * first (see WORKLOG). Siggie, 2026-08-28: *"the blue line isn't quite doing
   * it. let's change the default to Clear: true."* A beat that replaces has no
   * such problem: what is on screen IS the new thing.
   *
   * Accumulation stays available because a genuine reveal-the-list step still
   * wants it -- it just is not what most beats are.
   */
  keep?: boolean;
  /** Overrides the step's anchor while this beat is showing. */
  anchor?: HelpAnchor;
  /** What the tour DID on entering this beat; rendered in its own band. */
  action?: string;
  /** What this beat ADDS to the app state, as a URL query. See `HelpEntry.change`. */
  change?: string;
  /** Overrides the step's `Highlight:` for this beat. */
  highlight?: Highlight;
  /** Overrides the step's `Position:` for this beat. */
  position?: PopoverSide;
  /** Overrides the step's `OffsetX:` for this beat. */
  offsetX?: Offset;
}

export interface HelpEntry {
  id: string;
  title: string;
  description: string;
  interactions: string[];
  shortcut?: string;
  context?: string;
  /**
   * What this entry points at. Omitted in the markdown means "the element
   * tagged `data-help-id="<id>"`", which is normalised here to
   * `{ kind: 'help-id', arg: id }` so consumers never special-case the
   * default. `Anchor: none` gives `{ kind: 'none' }`.
   */
  anchor: HelpAnchor;
  /**
   * One sentence saying what the tour just did to the app, in the tour's own
   * voice. A step that changes the view without saying so reads as a
   * description of whatever appeared -- the bug this field exists to fix.
   */
  action?: string;
  /**
   * Storage key under which this entry's ALERTS may be dismissed for good.
   *
   * Only alerts, and only when the author asks for it: a `> blockquote` in an
   * entry with no `Once:` is permanent, which is what you want for a caution
   * that is true every time you read the step. `Once:` is for the other kind
   * — the orientation note a first-time visitor needs and a returning one
   * should not have to dismiss again.
   *
   * The KEY is authored rather than derived from the entry id so that the same
   * "you can leave with Escape" note can be written into several entries and
   * silenced by all of them at once, and so renaming an entry does not
   * resurrect a note the viewer already put away.
   */
  once?: string;
  /**
   * What this step ADDS to the app state, as a URL query in the same
   * vocabulary as a share link (e.g. `sel=BodySite~Person`).
   *
   * A DELTA, not a state: a param the step does not name is a param the step
   * does not touch. Entering the step pushes this onto the tour's stack and
   * `back` pops it, so `back` is exact without the step having to describe the
   * whole world — and so a field no step mentions is never disturbed.
   *
   * This was `state`, a full absolute query, until 2026-08-27. The rename is
   * load-bearing: the values look identical either way, and reading an old one
   * as a delta inverts its meaning (docs/TASKS.md item 2).
   */
  change?: string;
  /**
   * Which SIDE of the anchor the popover goes on: `left`, `right`, `top` or
   * `bottom`. Authored as `Position: bottom`.
   *
   * Unset means the automatic rule (across the diagram's growth axis inside
   * the canvas, otherwise the side of the anchor with more room). This is the
   * override for when that rule picks badly — Siggie, 2026-08-28, after the
   * relation-menu anchor put the popover straight over the menu it was
   * describing.
   */
  position?: PopoverSide;
  /**
   * How hard to point at the anchor: `Highlight: ring` draws the ring without
   * the scrim, `none` draws nothing at all. Unset means ring-plus-scrim.
   *
   * `none` still resolves the anchor, so the anchor keeps positioning the
   * popover. Emphasis and placement are separate jobs and a step should be
   * able to ask for one without the other (Siggie, 2026-08-28).
   */
  highlight?: Highlight;
  /**
   * Horizontal nudge in CSS pixels, applied after placement. `OffsetX: 260`,
   * or in terms of the anchor's own size: `OffsetX: anchor.width * 1.3`.
   *
   * The multiplier form is the useful one for the canvas: every entity box is
   * the same width today, so `anchor.width * 1.3` clears one box plus a gutter
   * and leaves room for the box the step is about to add (Siggie's own
   * example). Writing it relative to the anchor rather than as a constant
   * keeps it correct if NODE_W changes.
   */
  offsetX?: Offset;
  /**
   * Which tour this entry is a step of, e.g. `Tour: Walkthrough`. Entries
   * without it are help-only: reachable in help mode, never visited by a tour.
   *
   * **The name is the whole field; ORDER COMES FROM THE FILE.** This was a
   * 1-based number until 2026-08-28, which made inserting a step a
   * renumbering of every step after it, and made a duplicate or a gap a silent
   * reorder. Position is now the entry's position in `help-content.md`, so
   * moving a step is moving its block and there is no number to collide.
   *
   * A bare `- **Tour:**` with no value means the default tour, so a file with
   * one tour never has to name it.
   */
  tour?: string;
  /**
   * Where this entry sits in the source file. The tour is ordered by it, so
   * the parser has to record it: `content.entries` is a Map and sections are
   * parsed block by block, neither of which preserves a usable index on its
   * own.
   */
  order: number;
  /**
   * Ordered beats within this step. Absent means the step is a single
   * implicit beat, which is how every step written before beats existed
   * continues to behave.
   */
  beats?: TourBeat[];
}

/**
 * A `## Section` grouping. Organises the source file; nothing in the app
 * renders a section's `title` or `body` today — the popover shows one entry at
 * a time, and both the tour and help mode reach entries through
 * `HelpContent.entries`, never through sections.
 *
 * **`body` is unused, not unsupported.** It is parsed and kept for a help mode
 * that wants section intros. Do not conclude from "nothing reads it" that
 * sections can be flattened away: their `---` separators are what
 * `parseHelpContent` splits on, and they keep the content file legible.
 */
export interface HelpSection {
  id: string;
  title: string;
  /** Text between the `##` heading and the first `###` entry. Rendered nowhere. */
  body: string;
  entries: HelpEntry[];
}

export interface HelpContent {
  sections: HelpSection[];
  entries: Map<string, HelpEntry>;
}

/**
 * One navigable position in the tour: a step, plus which of its beats is
 * showing. This is the shape the tour mechanism (S3b) navigates -- flattening
 * happens here so the mechanism never has to know that beats are nested.
 */
export interface TourPosition {
  entry: HelpEntry;
  /**
   * 1-based step number WITHIN ITS TOUR, computed from file order rather than
   * read off the entry — `entry.tour` is the tour's name now, not a position.
   */
  step: number;
  /**
   * 0-based index into `entry.beats`; **-1 at a step's opening position**,
   * which shows the description alone before any beat has revealed. A step
   * with no beats has exactly that one position.
   */
  beatIndex: number;
  /**
   * How many beats this step has, for the reveal dots beside the counter.
   * 0 when the step has none, in which case the popover shows no dots.
   */
  beatCount: number;
  /** The beat itself, if this step has any. */
  beat?: TourBeat;
  /** Emphasis for this position; a beat's wins over its step's. */
  highlight?: Highlight;
  /** Placement override for this position; a beat's wins over its step's. */
  position?: PopoverSide;
  /** Horizontal nudge for this position; a beat's wins over its step's. */
  offsetX?: Offset;
  /**
   * Everything showing at this position, oldest first: the step's description
   * followed by each beat revealed so far. The LAST block is the one that just
   * appeared; the popover renders the earlier ones dimmed, so a reveal reads as
   * "and now this" rather than as a page of equal-weight prose.
   *
   * A step with no beats has exactly one block. A beat with `Clear: true`
   * starts the list over at itself.
   */
  blocks: string[];
  /**
   * `blocks` joined, which is what a consumer that just wants the text of this
   * position should read. Kept because it is the older shape and because
   * nothing outside the popover needs to know about the reveal.
   */
  text: string;
  /** Beat's anchor if it overrides, else the step's. */
  anchor: HelpAnchor;
  /** Beat's action if it has one, else the step's. */
  action?: string;
  /**
   * What this POSITION pushes onto the tour's state stack, or undefined if it
   * pushes nothing. A beat's own `Change:` if it declares one; otherwise the
   * step's, but only on its first beat — see `tourPositions`.
   */
  change?: string;
}

/**
 * How much emphasis the anchor gets, as authored by `Highlight:`.
 *
 *  - `dim` (the default): the ring PLUS the scrim over everything else.
 *  - `ring`: the ring alone. For a step whose anchor is one control among
 *    several the reader is meant to compare, where dimming the rest hides the
 *    context the step is talking about.
 *  - `none`: draw nothing. The anchor still resolves, so it still POSITIONS
 *    the popover -- which is the point: a step can point the popover at
 *    something without visually seizing it.
 */
export type Highlight = 'dim' | 'ring' | 'none';

/** A side of the anchor, as authored by `Position:`. */
export type PopoverSide = 'left' | 'right' | 'top' | 'bottom';

/**
 * A parsed `OffsetX:` — pixels, or a multiple of one of the anchor's own
 * dimensions.
 *
 * Deliberately NOT a general expression. `anchor.width * 1.3` is the shape
 * Siggie asked for, and a closed grammar that covers it is a regex; anything
 * that would evaluate authored arithmetic is a code path taking input from a
 * markdown file, for no reader-visible gain.
 */
export type Offset =
  | { px: number }
  | { of: 'width' | 'height'; times: number };

/**
 * `Highlight: ring|dim|none`. Like `Position:`, an unrecognised value is
 * ignored rather than throwing, so a typo costs the override and not the tour.
 */
function parseHighlight(value: string | undefined): Highlight | undefined {
  const v = value?.trim().toLowerCase();
  return v === 'dim' || v === 'ring' || v === 'none' ? v : undefined;
}

/**
 * `Position: left|right|top|bottom`. Anything else is ignored rather than
 * throwing — a typo should cost the override, not the tour.
 */
function parsePosition(value: string | undefined): PopoverSide | undefined {
  const v = value?.trim().toLowerCase();
  return v === 'left' || v === 'right' || v === 'top' || v === 'bottom' ? v : undefined;
}

/**
 * `OffsetX: 260` | `OffsetX: anchor.width * 1.3` | `OffsetX: -anchor.height`.
 *
 * `parentBox` is accepted as a synonym for `anchor`: that is the word Siggie
 * used when asking for the field, and an author who writes it means the thing
 * the popover is anchored to.
 */
function parseOffset(value: string | undefined): Offset | undefined {
  const v = value?.trim();
  if (!v) return undefined;

  const num = Number(v);
  if (Number.isFinite(num)) return { px: num };

  const m = v.match(/^(-)?(?:anchor|parentBox)\.(width|height)(?:\s*\*\s*(-?[\d.]+))?$/i);
  if (!m) return undefined;
  const [, neg, dim, mult] = m;
  const times = mult === undefined ? 1 : Number(mult);
  if (!Number.isFinite(times)) return undefined;
  return { of: dim.toLowerCase() as 'width' | 'height', times: neg ? -times : times };
}

/** Parse an `Anchor:` value into a HelpAnchor. `fallbackId` is the entry id. */
export function parseAnchor(raw: string | undefined, fallbackId: string): HelpAnchor {
  const value = raw?.trim();
  // Omitted: point at the element tagged with this entry's own id. This is
  // what every pre-Anchor help entry means, so they keep working untouched.
  if (!value) return { kind: 'help-id', arg: fallbackId };
  if (value === 'none') return { kind: 'none' };
  const colon = value.indexOf(':');
  // A bare id with no colon is shorthand for `help-id:<id>`.
  if (colon === -1) return { kind: 'help-id', arg: value };
  return { kind: value.slice(0, colon).trim(), arg: value.slice(colon + 1).trim() };
}

/**
 * The spec lives in the document as a rendered `## Format` section rather than
 * an HTML comment, so it can be read as markdown wherever the file is opened.
 * Its `###` sub-headings are prose, not entries, so the section is skipped by
 * name. Renaming the section in the markdown means renaming it here.
 */
const SPEC_SECTION = 'Format';

/**
 * The tour a bare `- **Tour:**` joins. Named tours exist so one file can hold
 * several walks over the same entries (Siggie, 2026-08-28), but the common
 * case is one tour, and making every step write its name would be noise.
 */
export const DEFAULT_TOUR = 'Walkthrough';

/**
 * Sections whose `###` headings are prose, not entries, and so are skipped by
 * name. `Format` is the spec; `TODO` is the authoring scratchpad at the top of
 * the file. Without this a heading like `### Original unfinished draft text`
 * parses as an entry with an anchor pointing at nothing — which is exactly
 * what happened when the TODO section was added (Siggie, 2026-08-28: "Not sure
 * if parser will complain about it").
 */
const PROSE_SECTIONS = new Set([SPEC_SECTION, 'TODO']);

/**
 * Structural markup that ends a multi-line field: the `<details>`/`</details>`
 * wrappers that let each `## Section` fold when the file is read on GitHub,
 * and their `<summary>`. These sit in the file for the READER; they are never
 * part of an entry's content.
 */
const SECTION_MARKUP = /^<\/?(?:details|summary)\b[^>]*>$/i;

/**
 * Extract a field value like "**Title:** ..." from the lines.
 *
 * A field whose name is prefixed with `_` is PARKED: still written down, but
 * treated as absent. `- **_Tour:** 4` drops the entry out of the tour while
 * leaving it available as help, which is how a step that is written but not
 * ready stays in the file without appearing.
 */
function extractField(lines: string[], label: string): string | undefined {
  // `- **_Tour:**` simply does not match `- **Tour:**`, so parking a field is
  // just a non-match. Spelled out because it looks like an omission otherwise.
  const prefix = `- **${label}:**`;
  const idx = lines.findIndex(l => l.trimStart().startsWith(prefix));
  if (idx === -1) return undefined;
  return lines[idx].trimStart().slice(prefix.length).trim();
}

/**
 * Extract a field as a multi-line MARKDOWN BLOCK: the text after the colon,
 * plus every following line up to the next entry-level `- **Field:**`.
 *
 * **Why this exists.** `extractField` stops at the end of its own line, so an
 * authored `Description:` was one paragraph with no bullets, no line breaks and
 * no second paragraph — Siggie's "the format really does not capture my
 * intent": a draft written as one flowing block had to be split across
 * `Description:` / `Context:` / `Interactions:`, which reordered it. A field
 * read as a block can hold the draft as written.
 *
 * Continuation lines are DEDENTED by the common indent of the block, because
 * markdown reads four leading spaces as a code fence — the authored indent is
 * there to show the lines belong to the field, and must not survive into the
 * markdown.
 */
function extractBlockField(lines: string[], label: string): string | undefined {
  const prefix = `- **${label}:**`;
  const idx = lines.findIndex(l => l.trimStart().startsWith(prefix));
  if (idx === -1) return undefined;

  const first = lines[idx].trimStart().slice(prefix.length).trim();
  const rest: string[] = [];
  for (let i = idx + 1; i < lines.length; i++) {
    // Any entry-level field ends the block. A blank line does NOT: a field can
    // hold two paragraphs, and stopping at the blank would silently drop the
    // second.
    if (lines[i].trimStart().startsWith('- **')) break;
    // So does the structural markup around a section. `## Section` blocks are
    // wrapped in `<details>` so the file folds when read on GitHub, which puts
    // a `</details>` after the LAST entry of each section -- inside that
    // entry's block, since nothing else ends it. Without this the closing tag
    // is swallowed into the description and rendered as literal text in the
    // popover.
    if (SECTION_MARKUP.test(lines[i].trim())) break;
    rest.push(lines[i]);
  }
  // Trailing blanks are the gap before the next field, not part of the value.
  while (rest.length && rest[rest.length - 1].trim() === '') rest.pop();
  if (rest.length === 0) return first;

  const indents = rest.filter(l => l.trim() !== '')
    .map(l => l.length - l.trimStart().length);
  const dedent = Math.min(...indents);
  const body = rest.map(l => l.slice(dedent)).join('\n');
  // The first line is already dedented (it followed the colon), so it joins
  // the block at column 0 whatever the continuation's indent was.
  return first ? `${first}\n${body}` : body;
}

/** Extract bullet list items under a field header like "- **Interactions:**" */
function extractBulletList(lines: string[], label: string): string[] {
  const prefix = `- **${label}:**`;
  const headerIdx = lines.findIndex(l => l.trimStart().startsWith(prefix));
  if (headerIdx === -1) return [];

  const results: string[] = [];
  for (let i = headerIdx + 1; i < lines.length; i++) {
    const trimmed = lines[i].trimStart();
    // Stop at next field or blank line or non-indented content
    if (trimmed.startsWith('- **') || trimmed === '') break;
    if (trimmed.startsWith('- ')) {
      results.push(trimmed.slice(2).trim());
    }
  }
  return results;
}

/**
 * Parse the `- **Beats:**` block: an ordered list, each item optionally
 * followed by indented `- Field: value` lines.
 *
 * Beat fields are plain (`- Anchor: x`), not bold (`- **Anchor:** x`), which
 * is what lets `extractBulletList`-style scanning tell a beat's own fields
 * apart from the entry fields that follow the block.
 */
function extractBeats(lines: string[], entryId: string): TourBeat[] | undefined {
  const headerIdx = lines.findIndex(l => l.trimStart().startsWith('- **Beats:**'));
  if (headerIdx === -1) return undefined;

  const beats: TourBeat[] = [];
  let current: TourBeat | null = null;
  const push = () => { if (current) beats.push(current); };

  for (let i = headerIdx + 1; i < lines.length; i++) {
    const trimmed = lines[i].trimStart();
    // An entry-level field ends the block; blank lines are allowed inside it.
    if (trimmed.startsWith('- **')) break;
    if (trimmed === '') continue;

    const numbered = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (numbered) {
      push();
      current = { text: numbered[2].trim() };
      continue;
    }

    // `- Field: value` attached to the beat above it.
    const field = trimmed.match(/^-\s+([A-Za-z]+):\s*(.*)$/);
    if (field && current) {
      const [, name, value] = field;
      const key = name.toLowerCase();
      if (key === 'anchor') current.anchor = parseAnchor(value, entryId);
      else if (key === 'action') current.action = value.trim();
      else if (key === 'change') current.change = value.trim();
      else if (key === 'highlight') current.highlight = parseHighlight(value);
      else if (key === 'position') current.position = parsePosition(value);
      else if (key === 'offsetx') current.offsetX = parseOffset(value);
      // `- Keep: true`. A bare `- Keep:` counts too: it is a marker, and an
      // author who writes it without a value plainly means it.
      else if (key === 'keep') current.keep = value.trim() !== 'false';
      continue;
    }

    // A plain continuation line wraps the beat's text.
    if (current && !trimmed.startsWith('-')) {
      current.text = `${current.text} ${trimmed}`.trim();
    }
  }
  push();

  return beats.length > 0 ? beats : undefined;
}

function parseEntry(block: string, order: number): HelpEntry | null {
  const lines = block.split('\n');
  const headerLine = lines[0];
  const match = headerLine.match(/^###\s+(.+)$/);
  if (!match) return null;

  const id = match[1].trim();
  const title = extractField(lines, 'Title') ?? id;
  // Description is the one field read as a multi-line block, so a step can
  // hold the prose as drafted. The rest stay single-line by design — see
  // `extractBlockField`.
  const description = extractBlockField(lines, 'Description') ?? '';
  const interactions = extractBulletList(lines, 'Interactions');
  const shortcut = extractField(lines, 'Shortcut');
  const context = extractField(lines, 'Context');
  const anchor = parseAnchor(extractField(lines, 'Anchor'), id);
  const action = extractField(lines, 'Action');
  const once = extractField(lines, 'Once');
  const change = extractField(lines, 'Change');
  const highlight = parseHighlight(extractField(lines, 'Highlight'));
  const position = parsePosition(extractField(lines, 'Position'));
  const offsetX = parseOffset(extractField(lines, 'OffsetX'));
  const beats = extractBeats(lines, id);
  const tourRaw = extractField(lines, 'Tour');
  // `Tour:` names a tour; a bare `- **Tour:**` with no value joins the default
  // one, so a file with a single tour never has to write its name. A parked
  // `_Tour:` does not match at all and leaves this undefined, which is what
  // drops the entry out of the tour while keeping it as help.
  const tour = tourRaw === undefined ? undefined : (tourRaw || DEFAULT_TOUR);

  return {
    id, title, description, interactions, shortcut, context,
    anchor, action, once, change, highlight, position, offsetX, tour, order, beats,
  };
}

/**
 * @param nextOrder  running file-order counter; the tour is ordered by it, so
 *                   it has to keep counting ACROSS sections rather than
 *                   restarting per block.
 */
function parseSection(block: string, nextOrder: () => number): HelpSection {
  const lines = block.split('\n');
  // FIND the heading rather than assuming line 0. Each section is wrapped in
  // `<details>`/`<summary>` so the file folds on GitHub, which puts two lines
  // above the `## `. Reading line 0 gave every section the title 'Unknown' and
  // swallowed the wrapper into `body`.
  const headerIdx = lines.findIndex(l => /^##\s+/.test(l));
  const titleMatch = headerIdx === -1 ? null : lines[headerIdx].match(/^##\s+(.+)$/);
  const title = titleMatch ? titleMatch[1].trim() : 'Unknown';
  const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  // Body = everything between the ## header and the first ### entry
  const bodyLines: string[] = [];
  for (let i = headerIdx + 1; i < lines.length; i++) {
    if (lines[i].startsWith('### ')) break;
    // The wrapper's own markup is not section prose.
    if (SECTION_MARKUP.test(lines[i].trim())) continue;
    bodyLines.push(lines[i]);
  }
  const body = bodyLines.join('\n').trim();

  // Split remaining into ### entry blocks
  const entries: HelpEntry[] = [];
  const entryBlocks = block.split(/(?=^### )/m);
  for (const entryBlock of entryBlocks) {
    if (!entryBlock.startsWith('### ')) continue;
    const entry = parseEntry(entryBlock.trim(), nextOrder());
    if (entry) entries.push(entry);
  }

  return { id, title, body, entries };
}

/**
 * Every tour named in the file, in the order their first step appears.
 * One tour is the normal case; the list exists so a second one can be offered
 * without the host hardcoding its name.
 */
export function tourNames(content: HelpContent): string[] {
  const seen = new Set<string>();
  for (const e of [...content.entries.values()].sort((a, b) => a.order - b.order)) {
    if (e.tour) seen.add(e.tour);
  }
  return [...seen];
}

/**
 * Steps of one tour, in FILE ORDER. Entries with no `Tour:` field are
 * help-only.
 *
 * Ordering by file position rather than an authored number is what makes
 * inserting a step a paste rather than a renumber, and what makes a gap or a
 * duplicate impossible to write.
 */
export function tourSteps(content: HelpContent, tour?: string): HelpEntry[] {
  const name = tour ?? tourNames(content)[0];
  return [...content.entries.values()]
    .filter(e => e.tour !== undefined && e.tour === name)
    .sort((a, b) => a.order - b.order);
}

/**
 * Every navigable position in the tour, in order: each step expanded into its
 * beats, a beatless step contributing exactly one position.
 *
 * This is the seam with the tour mechanism -- it navigates this flat list and
 * never has to know beats are nested. `back` is `positions[i - 1]`, reached by
 * popping the `change` the position being LEFT pushed, so the two directions
 * are inverses rather than both being an absolute apply.
 */
export function tourPositions(content: HelpContent, tour?: string): TourPosition[] {
  const positions: TourPosition[] = [];
  tourSteps(content, tour).forEach((entry, i) => {
    // The step number is the entry's rank in this tour, not a field on it.
    const step = i + 1;
    if (!entry.beats || entry.beats.length === 0) {
      positions.push({
        entry, step, beatIndex: 0, beatCount: 0,
        blocks: [entry.description],
        text: entry.description,
        anchor: entry.anchor,
        action: entry.action,
        change: entry.change,
        highlight: entry.highlight,
        position: entry.position,
        offsetX: entry.offsetX,
      });
      return;
    }
    /*
     * The step's own text IS the first beat, and beats ADD to what is showing
     * rather than replacing it (Siggie, 2026-08-28: "the stuff outside the
     * Beats section is actually the first beat / by default, the beat text is
     * additive on top of that").
     *
     * The old model replaced the body with each beat's text, which forced the
     * author to repeat the description in beat one to avoid it vanishing --
     * `relationship-kinds` does exactly that, and the note beside it asks
     * whether the repetition "reads as a stutter". Under this model it is not
     * a stutter to fix, it is a beat to delete.
     */
    let showing = entry.description ? [entry.description] : [];

    /*
     * THE OPENING POSITION: the step's own text, alone, before any beat has
     * revealed. If the description is beat one then it needs a position of its
     * own -- without one the step opens on description+beat-1 together and the
     * setup can never be read by itself, which is the bug Siggie caught in the
     * `selection-tree` screenshot ("the popover starts on Beat 1, it should
     * start on the stuff before Beat 1").
     *
     * `beatIndex: -1` marks it: it is not one of the authored beats, and the
     * counter shows a bare `2 / 6` there while the beats add reveal dots.
     */
    if (showing.length > 0) {
      positions.push({
        entry, step, beatIndex: -1, beatCount: entry.beats!.length,
        blocks: showing,
        text: showing.join('\n\n'),
        anchor: entry.anchor,
        action: entry.action,
        // The step's own change belongs to the position that opens it.
        change: entry.change,
        highlight: entry.highlight,
        position: entry.position,
        offsetX: entry.offsetX,
      });
    }

    entry.beats.forEach((beat, beatIndex) => {
      // A beat REPLACES what is showing unless it asks to `Keep:` it.
      showing = beat.keep ? [...showing, beat.text] : [beat.text];
      positions.push({
        entry, step, beatIndex, beat, beatCount: entry.beats!.length,
        blocks: showing,
        text: showing.join('\n\n'),
        anchor: beat.anchor ?? entry.anchor,
        action: beat.action,
        // Inherited like `anchor`: a beat that does not move the popover keeps
        // the step's placement rather than snapping back to automatic.
        highlight: beat.highlight ?? entry.highlight,
        position: beat.position ?? entry.position,
        offsetX: beat.offsetX ?? entry.offsetX,
        /*
         * A beat inherits the step's anchor and action, but NOT its `change`
         * or `action`: the OPENING position above owns both, and a beat pushes
         * only a `change` it declares itself.
         *
         * Under absolute state every beat re-applied the step's full query,
         * which was harmless because re-applying the same absolute state is
         * idempotent. Pushing the same delta once per beat is NOT — a
         * four-beat step would push four frames and `back` would crawl out of
         * them one useless pop at a time. Since 2026-08-28 the step opens on
         * its own position, so that is where its change belongs; letting beat
         * 0 also push it would double-count the very thing this guards.
         */
        change: beat.change,
      });
    });
  });
  return positions;
}

export function parseHelpContent(markdown: string): HelpContent {
  // Remove the HTML comment blocks (the format spec at the top, and the
  // TODO(siggie) notes left beside entries during translation).
  const cleaned = markdown.replace(/<!--[\s\S]*?-->/g, '').trim();

  // Split on --- separators (section boundaries)
  const sectionBlocks = cleaned.split(/^---$/m).map(b => b.trim()).filter(Boolean);

  const sections: HelpSection[] = [];
  const entries = new Map<string, HelpEntry>();
  // File order, counted across sections — it is what orders the tour.
  let order = 0;

  for (const block of sectionBlocks) {
    // Skip blocks that don't start with ## (e.g., the # title)
    if (!block.match(/^## /m)) continue;
    // Skip prose sections: their ### sub-headings are documentation and notes,
    // not entries.
    const heading = block.match(/^##\s+(.+)$/m)?.[1].trim();
    if (heading && PROSE_SECTIONS.has(heading)) continue;

    const section = parseSection(block, () => order++);
    sections.push(section);
    for (const entry of section.entries) {
      entries.set(entry.id, entry);
    }
  }

  return { sections, entries };
}
