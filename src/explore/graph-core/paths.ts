/**
 * SVG path builders for graph edges. Pure geometry, no DOM.
 */

import type { EdgeSection, Point } from './types';

export type AnchorDir = 'up' | 'down' | 'left' | 'right';

const DIR: Record<AnchorDir, Point> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

/** Polyline path from ELK's routed edge sections. */
export function pathFromSections(sections: EdgeSection[] | undefined): string {
  if (!sections?.length) return '';
  const s = sections[0];
  const pts = [s.startPoint, ...(s.bendPoints ?? []), s.endPoint];
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join('');
}

/** Control points for the anchored cubic: extend along each anchor direction,
 *  proportional to distance but clamped so long edges don't sweep wildly. */
function controls(p0: Point, d0: AnchorDir, p1: Point, d1: AnchorDir, tension: number) {
  const dist = Math.hypot(p1.x - p0.x, p1.y - p0.y);
  const k = Math.max(24, Math.min(140, dist * tension));
  return [
    { x: p0.x + DIR[d0].x * k, y: p0.y + DIR[d0].y * k },
    { x: p1.x + DIR[d1].x * k, y: p1.y + DIR[d1].y * k },
  ];
}

/**
 * Cubic bezier between two anchor points, each leaving/entering its node in
 * a given direction (control points extend along the anchor directions).
 */
export function anchoredPath(
  p0: Point, d0: AnchorDir,
  p1: Point, d1: AnchorDir,
  tension = 0.45,
): string {
  const [c0, c1] = controls(p0, d0, p1, d1, tension);
  return `M${p0.x},${p0.y}C${c0.x},${c0.y} ${c1.x},${c1.y} ${p1.x},${p1.y}`;
}

/** Point at parameter t on the same cubic anchoredPath() draws (for labels). */
export function anchoredPathPoint(
  p0: Point, d0: AnchorDir,
  p1: Point, d1: AnchorDir,
  t: number,
  tension = 0.45,
): Point {
  const [c0, c1] = controls(p0, d0, p1, d1, tension);
  const u = 1 - t;
  return {
    x: u * u * u * p0.x + 3 * u * u * t * c0.x + 3 * u * t * t * c1.x + t * t * t * p1.x,
    y: u * u * u * p0.y + 3 * u * u * t * c0.y + 3 * u * t * t * c1.y + t * t * t * p1.y,
  };
}
