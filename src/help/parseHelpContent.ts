/**
 * Parse the structured help-content.md into typed data.
 * Pure function, no dependencies beyond types.
 *
 * Ported from icd11-playground (web/src/utils/parseHelpContent.ts), unchanged
 * except for the `State` and `Tour` fields below. Kept dependency-free so it
 * can move into the shared help package without edits.
 */

export interface HelpEntry {
  id: string;
  title: string;
  description: string;
  interactions: string[];
  shortcut?: string;
  context?: string;
  /**
   * URL query string this step puts the app into before showing its popover
   * (e.g. `sel=BodySite~Person`). Steps like "examine the resulting graph"
   * only make sense once something is selected, and an unattended gh-pages
   * visitor will not have selected it -- so the tour applies the state and
   * SAYS it did.
   */
  state?: string;
  /**
   * Position in the guided tour, 1-based. Entries without it are help-only:
   * reachable in help mode, never visited by the tour.
   */
  tour?: number;
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
  const state = extractField(lines, 'State');
  const tourRaw = extractField(lines, 'Tour');
  const tourNum = tourRaw === undefined ? undefined : Number(tourRaw);
  // A non-numeric Tour: field is an authoring mistake; drop it rather than
  // sorting NaN into the middle of the tour order.
  const tour = tourNum !== undefined && Number.isFinite(tourNum) ? tourNum : undefined;

  return { id, title, description, interactions, shortcut, context, state, tour };
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

export function parseHelpContent(markdown: string): HelpContent {
  // Remove the HTML comment block at the top
  const cleaned = markdown.replace(/<!--[\s\S]*?-->/, '').trim();

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
