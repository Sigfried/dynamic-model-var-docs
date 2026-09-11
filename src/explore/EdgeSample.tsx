/**
 * One edge, drawn the way the canvas draws it, at legend size.
 *
 * Shared by the Ownership legend, the relation popover's rows, and — through
 * the `edge` widget — the tour's prose (`{{edge:own-fwd}}`). Everything about
 * the look comes from `edgeStyle.ts`: the head glyph and its proportions, the
 * dash, the colour, which ends carry heads and which way they point. This file
 * only scales that geometry down to a 14px-tall sample, so a change there is
 * a change here.
 */

import { useId } from 'react';
import { EDGE_STYLE, headMarker, type DrawnKind } from './edgeStyle';

export type { DrawnKind } from './edgeStyle';

const SAMPLE_STROKE = 2;
/** Sample heads are the canvas heads at half size: 9 long, 6 across. */
const SAMPLE_HEAD_SCALE = 0.5;

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
  const style = EDGE_STYLE.kinds[kind];
  const scale = SAMPLE_HEAD_SCALE * (style.secondary ? EDGE_STYLE.secondaryScale : 1);
  const { d, ...marker } = headMarker(style.headDirection, scale);
  const headLen = marker.markerWidth;
  const head = `es-${uid}`;

  // The line stops where the head begins, at both ends for association, so
  // the head lies beyond the line exactly as on the canvas.
  const x1 = style.heads === 'both' ? 1 + headLen : 1;
  const x2 = width - 1 - headLen;

  return (
    <svg
      width={width} height="14" viewBox={`0 0 ${width} 14`}
      className={`shrink-0 ${className ?? ''}`} aria-hidden
    >
      <defs>
        <marker id={head} {...marker}>
          <path d={d} fill={style.color} />
        </marker>
      </defs>
      <line
        x1={x1} y1="7" x2={x2} y2="7"
        stroke={style.color} strokeWidth={SAMPLE_STROKE}
        strokeDasharray={style.dashed ? EDGE_STYLE.dash : undefined}
        markerStart={style.heads === 'both' ? `url(#${head})` : undefined}
        markerEnd={`url(#${head})`}
      />
    </svg>
  );
}
