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

  const headAtStart = kind === 'own-bkwd';
  const bothEnds = kind === 'association';
  const head = `es-${uid}`;

  // Leave room for whichever ends carry a head, so the glyph is not clipped.
  const x1 = headAtStart || bothEnds ? 6 : 1;
  const x2 = headAtStart ? width - 1 : width - 6;

  return (
    <svg
      width={width} height="14" viewBox={`0 0 ${width} 14`}
      className={`shrink-0 ${className ?? ''}`} aria-hidden
    >
      <defs>
        {/* orient="auto-start-reverse" is what lets ONE marker serve either
            end: on markerStart it turns 180°, so a forward-pointing glyph
            points back out of the line. Same trick the canvas uses. */}
        <marker
          id={head} markerWidth="5" markerHeight="5" refX="4.5" refY="2.5"
          orient="auto-start-reverse" markerUnits="userSpaceOnUse"
        >
          <path d="M0,0 L5,2.5 L0,5 z" fill={color} />
        </marker>
      </defs>
      <line
        x1={x1} y1="7" x2={x2} y2="7"
        stroke={color} strokeWidth={SAMPLE_STROKE}
        strokeDasharray={kind === 'association' ? '5 4' : undefined}
        markerStart={headAtStart || bothEnds ? `url(#${head})` : undefined}
        markerEnd={headAtStart ? undefined : `url(#${head})`}
      />
    </svg>
  );
}
