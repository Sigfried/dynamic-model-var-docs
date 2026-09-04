/**
 * EdgeSample — one edge, drawn the way the canvas draws it.
 *
 * Used by the ownership legend and by the relation popovers. Shared because
 * the two have to agree: a sample that points the wrong way next to a canvas
 * line that points the other is worse than no sample at all. That is not
 * hypothetical — the legend shipped for a day with `markerEnd` on all three
 * kinds, so "A belongs to B" rendered `-->` when the canvas draws `--<`
 * (Siggie, 2026-09-04).
 *
 * The three kinds, and where each puts its arrowhead:
 *
 *   own-fwd      A ──────▶ B    head at the TARGET end.
 *   own-bkwd     A ◀────── B    head at the ATTRIBUTE end, pointing BACK at
 *                              the owner, because the member stores the FK.
 *   association  A ◀─ ─ ─▶ B    both ends, dashed, no ownership claim.
 *
 * All three are LAID OUT owner-first (left to right); only the head placement
 * differs. So `own-bkwd` is not "a line drawn right-to-left" — it is a line
 * that arrives from the left with its head turned back around. Getting that
 * wrong is exactly the bug above.
 *
 * Colors come from EDGE_COLORS, never a Tailwind approximation, so the sample
 * cannot drift from the stroke it explains.
 */

import { useId } from 'react';
import { EDGE_COLORS } from '../config/appConfig';
import type { OwnershipVerdict } from '../services/DataService';

/** The verdicts that actually DRAW. `excluded` names an edge that is not
 *  rendered at all, so there is no sample of it to show. */
export type DrawnKind = Exclude<OwnershipVerdict, 'excluded'>;

/**
 * Wider than the canvas's 1.4px.
 *
 * The canvas width is tuned for long routed runs at whatever zoom the reader
 * is at; reproducing it in a 44px sample makes the kinds harder to tell apart,
 * not easier. This is a diagram of an edge, not a measurement of one — the
 * COLOR and the head placement are what have to be faithful.
 */
const SAMPLE_STROKE = 2;

export interface EdgeSampleProps {
  kind: DrawnKind;
  /** Overall width; the line spans it minus room for the heads. */
  width?: number;
  className?: string;
}

export default function EdgeSample({ kind, width = 44, className }: EdgeSampleProps) {
  // useId: several samples share a page, and duplicate marker ids would make
  // every one of them adopt the first one's fill.
  const uid = useId().replace(/:/g, '');
  const color = kind === 'association'
    ? EDGE_COLORS.association
    : kind === 'own-bkwd' ? EDGE_COLORS.ownBkwd : EDGE_COLORS.ownFwd;

  const bkwd = kind === 'own-bkwd';
  const bothEnds = kind === 'association';
  const head = `es-${uid}`;

  /*
   * BOTH heads sit at the RIGHT end of the sample; only the direction differs.
   *
   *   own-fwd   this  ──▶  other      this owns it
   *   own-bkwd  other ◀──  this       the other owns this
   *
   * The right end is where the row's own class sits, and the arrow points away
   * from or back at it. What makes this readable is that the CALLER reverses
   * the columns to match: for own-bkwd the other class moves to the LEFT,
   * because that is the side the diagram draws it on.
   *
   * Getting the two out of step is the bug this shipped with: a left-pointing
   * head with the other class still on the right reads as "Participant points
   * at Visit" when the schema says the reverse (Siggie, screenshot
   * 2026-09-04). Head placement and column order are one decision.
   */
  const x1 = bothEnds ? 6 : 1;
  const x2 = width - 6;

  return (
    <svg
      width={width} height="14" viewBox={`0 0 ${width} 14`}
      className={`shrink-0 ${className ?? ''}`} aria-hidden
    >
      <defs>
        {/*
          Two glyphs, not one turned around.

          `orient="auto-start-reverse"` only flips a marker placed at
          markerSTART — which is what association uses to arrow both ends from
          a single def. It cannot help own-bkwd, whose head is at markerEND,
          the same end as own-fwd's, but points the other way. So the backward
          head is drawn mirrored (tip at x=0), with refX moved to that tip.
        */}
        <marker
          id={head} markerWidth="5" markerHeight="5"
          refX={bkwd ? 0.5 : 4.5} refY="2.5"
          orient="auto-start-reverse" markerUnits="userSpaceOnUse"
        >
          <path d={bkwd ? 'M5,0 L0,2.5 L5,5 z' : 'M0,0 L5,2.5 L0,5 z'} fill={color} />
        </marker>
      </defs>
      <line
        x1={x1} y1="7" x2={x2} y2="7"
        stroke={color} strokeWidth={SAMPLE_STROKE}
        strokeDasharray={kind === 'association' ? '5 4' : undefined}
        markerStart={bothEnds ? `url(#${head})` : undefined}
        markerEnd={`url(#${head})`}
      />
    </svg>
  );
}
