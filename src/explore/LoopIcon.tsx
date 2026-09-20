/**
 * The self-loop marker, drawn the way the canvas draws it.
 *
 * Shared by the canvas row list and — through the `loop` widget — the tour's
 * prose (`{{loop}}`). An entity whose attribute points at its own kind gets no
 * edge: a line from a box to itself would be noise, so the row carries this
 * mark instead.
 *
 * SVG rather than a text glyph so size and alignment don't depend on font
 * metrics.
 */

import { RANGE_COLORS } from '../config/appConfig';

/**
 * What the mark means with no entity or attribute named — the widget's title
 * in prose, where there is no row to name. The canvas names both.
 */
export const LOOP_TITLE =
  'Self-referential: this entity can belong to another entity of the same type';

export interface LoopIconProps {
  /** Hover text: on the canvas, the row's own entity and attribute; in prose,
   *  the widget's alt text, which defaults to `LOOP_TITLE`. */
  title: string;
  className?: string;
}

export default function LoopIcon({ title, className }: LoopIconProps) {
  return (
    <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="false"
      data-widget="loop" className={`shrink-0 ${className ?? ''}`}
      style={{ color: RANGE_COLORS.entity }}>
      <title>{title}</title>
      {/* 300° arc with a 60° gap on the right; arrowhead at the top end
          pointing into the gap, so the loop reads as an arrow, not an O */}
      <path d="M12.33 10.5 A5 5 0 1 1 12.33 5.5" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M13.7 7.9 L10.6 6.7 L13.7 4.2 Z" fill="currentColor" />
    </svg>
  );
}
