/**
 * Line numbers for help-content.md, so a failing content test names a place in
 * the file rather than only an entry id.
 *
 * The parser does not retain line numbers, and teaching it to would change
 * production types for a test-only need. A step id is unique and a beat's
 * numbered line is stable enough to find by scanning the raw markdown, so the
 * tests locate them here instead.
 *
 * Every function returns a `file:line` string ready to paste into an editor,
 * and degrades to the bare id if the scan finds nothing — a failure message
 * that is merely less precise beats one that throws while reporting another
 * failure.
 */

const FILE = 'src/explore/help-content.md';

/** 1-indexed line of `### <id>`, or undefined. */
function entryLine(src: string, id: string): number | undefined {
  const lines = src.split('\n');
  const i = lines.findIndex(l => l.trimEnd() === `### ${id}`);
  return i === -1 ? undefined : i + 1;
}

/**
 * 1-indexed line of the `n`th beat (1-based) inside entry `id`.
 *
 * Beats are `  <number>. <label>` lines between this `###` heading and the
 * next. The authored numbers are unreliable — markdown renumbers them, and
 * dmvd's content has three beats all labelled `1.` — so this counts
 * POSITIONALLY and ignores what the number says.
 */
function beatLine(src: string, id: string, n: number): number | undefined {
  const start = entryLine(src, id);
  if (start === undefined) return undefined;
  const lines = src.split('\n');
  let seen = 0;
  for (let i = start; i < lines.length; i++) {
    if (lines[i].startsWith('### ')) break;
    if (/^\s{2,4}\d+\.\s/.test(lines[i]) && ++seen === n) return i + 1;
  }
  return undefined;
}

/**
 * `src/explore/help-content.md:412` for a step, or `…:418 (beat 3 "Visit
 * connection")` for a beat. `beatIndex` is 1-based; omit it for the step
 * itself.
 */
export function where(
  src: string,
  id: string,
  beatIndex?: number,
  beatLabel?: string,
): string {
  const line = beatIndex === undefined
    ? entryLine(src, id)
    : beatLine(src, id, beatIndex) ?? entryLine(src, id);
  if (line === undefined) return id;
  const beat = beatIndex === undefined
    ? ''
    : ` (beat ${beatIndex}${beatLabel ? ` "${beatLabel}"` : ''})`;
  return `${FILE}:${line}${beat}`;
}
