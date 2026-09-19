/**
 * DEV-ONLY, TEMPORARY (2026-09-09). Delete with `scripts/elkTimingPlugin.ts`.
 *
 * Question being answered: is an ELK layout ever slow enough to justify the
 * "Computing layout…" overlay? The overlay covers the canvas with a
 * translucent sheet, which is fine over a blank gap but ruins an animated
 * transition — so before keeping it, measure.
 *
 * Timings go to temp/elk-timings.jsonl via the dev-server middleware.
 * `import.meta.env.DEV` is statically false in a production build, so the
 * whole thing is dropped by the bundler.
 *
 * Gated on `DEV_EXTRAS` rather than `import.meta.env.DEV` so an e2e run does
 * not write a row per layout into the data this is collecting.
 */
import { DEV_EXTRAS } from '../../devExtras';

export function recordElkTiming(row: {
  ms: number;
  nodes: number;
  edges: number;
  direction: string;
  /** Worker was cold (recreated after a cancel), so this includes startup. */
  cold: boolean;
}): void {
  if (!DEV_EXTRAS) return;
  // Fire-and-forget: never let instrumentation delay or break a layout.
  void fetch('/__elk-timing', {
    method: 'POST',
    body: JSON.stringify({ ...row, ms: Math.round(row.ms * 10) / 10, at: new Date().toISOString() }),
  }).catch(() => {});
}
