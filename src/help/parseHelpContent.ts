/**
 * Parse the structured help-content.md into typed data.
 * Pure function, no dependencies beyond types.
 *
 * Ported from icd11-playground (web/src/utils/parseHelpContent.ts). The
 * `state`, `tour`, `anchor`, `action` and `beats` fields are dmvd additions;
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
  /** Overrides the step's anchor while this beat is showing. */
  anchor?: HelpAnchor;
  /** What the tour DID on entering this beat; rendered in its own band. */
  action?: string;
  /** Full absolute URL query for this beat. Never a diff. */
  state?: string;
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
   * URL query string this step puts the app into before showing its popover
   * (e.g. `sel=BodySite~Person`). FULL and ABSOLUTE, never a diff from the
   * previous step: that is what makes `back` land exactly.
   */
  state?: string;
  /**
   * Position in the guided tour, 1-based. Entries without it are help-only:
   * reachable in help mode, never visited by the tour.
   */
  tour?: number;
  /**
   * Ordered beats within this step. Absent means the step is a single
   * implicit beat, which is how every step written before beats existed
   * continues to behave.
   */
  beats?: TourBeat[];
}

export interface HelpSection {
  id: string;
  title: string;
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
  /** 1-based step number, i.e. `entry.tour`. */
  step: number;
  /** 0-based index into `entry.beats`, or 0 for a step with no beats. */
  beatIndex: number;
  /** The beat itself, if this step has any. */
  beat?: TourBeat;
  /** Beat text if there is one, else the step's description. */
  text: string;
  /** Beat's anchor if it overrides, else the step's. */
  anchor: HelpAnchor;
  /** Beat's action if it has one, else the step's. */
  action?: string;
  /** Beat's state if it has one, else the step's. */
  state?: string;
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

/** Extract a field value like "**Title:** ..." from the lines */
function extractField(lines: string[], label: string): string | undefined {
  const prefix = `- **${label}:**`;
  const idx = lines.findIndex(l => l.trimStart().startsWith(prefix));
  if (idx === -1) return undefined;
  return lines[idx].trimStart().slice(prefix.length).trim();
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
      else if (key === 'state') current.state = value.trim();
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

function parseEntry(block: string): HelpEntry | null {
  const lines = block.split('\n');
  const headerLine = lines[0];
  const match = headerLine.match(/^###\s+(.+)$/);
  if (!match) return null;

  const id = match[1].trim();
  const title = extractField(lines, 'Title') ?? id;
  const description = extractField(lines, 'Description') ?? '';
  const interactions = extractBulletList(lines, 'Interactions');
  const shortcut = extractField(lines, 'Shortcut');
  const context = extractField(lines, 'Context');
  const anchor = parseAnchor(extractField(lines, 'Anchor'), id);
  const action = extractField(lines, 'Action');
  const state = extractField(lines, 'State');
  const beats = extractBeats(lines, id);
  const tourRaw = extractField(lines, 'Tour');
  const tourNum = tourRaw === undefined ? undefined : Number(tourRaw);
  // A non-numeric Tour: field is an authoring mistake; drop it rather than
  // sorting NaN into the middle of the tour order.
  const tour = tourNum !== undefined && Number.isFinite(tourNum) ? tourNum : undefined;

  return {
    id, title, description, interactions, shortcut, context,
    anchor, action, state, tour, beats,
  };
}

function parseSection(block: string): HelpSection {
  const lines = block.split('\n');
  const headerLine = lines[0];
  const titleMatch = headerLine.match(/^##\s+(.+)$/);
  const title = titleMatch ? titleMatch[1].trim() : 'Unknown';
  const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  // Body = everything between the ## header and the first ### entry
  const bodyLines: string[] = [];
  let i = 1;
  for (; i < lines.length; i++) {
    if (lines[i].startsWith('### ')) break;
    bodyLines.push(lines[i]);
  }
  const body = bodyLines.join('\n').trim();

  // Split remaining into ### entry blocks
  const entries: HelpEntry[] = [];
  const entryBlocks = block.split(/(?=^### )/m);
  for (const entryBlock of entryBlocks) {
    if (!entryBlock.startsWith('### ')) continue;
    const entry = parseEntry(entryBlock.trim());
    if (entry) entries.push(entry);
  }

  return { id, title, body, entries };
}

/** Tour steps in order. Entries with no `Tour:` field are help-only. */
export function tourSteps(content: HelpContent): HelpEntry[] {
  return [...content.entries.values()]
    .filter(e => e.tour !== undefined)
    .sort((a, b) => a.tour! - b.tour!);
}

/**
 * Every navigable position in the tour, in order: each step expanded into its
 * beats, a beatless step contributing exactly one position.
 *
 * This is the seam with the tour mechanism -- it navigates this flat list and
 * never has to know beats are nested. `back` is `positions[i - 1]`, and since
 * every position carries a full absolute `state`, arriving at one from either
 * direction gives the same view.
 */
export function tourPositions(content: HelpContent): TourPosition[] {
  const positions: TourPosition[] = [];
  for (const entry of tourSteps(content)) {
    const step = entry.tour!;
    if (!entry.beats || entry.beats.length === 0) {
      positions.push({
        entry, step, beatIndex: 0,
        text: entry.description,
        anchor: entry.anchor,
        action: entry.action,
        state: entry.state,
      });
      continue;
    }
    entry.beats.forEach((beat, beatIndex) => {
      positions.push({
        entry, step, beatIndex, beat,
        text: beat.text,
        // A beat inherits the step's anchor/action/state unless it overrides.
        anchor: beat.anchor ?? entry.anchor,
        action: beat.action ?? (beatIndex === 0 ? entry.action : undefined),
        state: beat.state ?? entry.state,
      });
    });
  }
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

  for (const block of sectionBlocks) {
    // Skip blocks that don't start with ## (e.g., the # title)
    if (!block.match(/^## /m)) continue;

    const section = parseSection(block);
    sections.push(section);
    for (const entry of section.entries) {
      entries.set(entry.id, entry);
    }
  }

  return { sections, entries };
}
