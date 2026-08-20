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

/** The routed points of an edge: start, ELK's bends, end. */
export function sectionPoints(sections: EdgeSection[] | undefined): Point[] {
  if (!sections?.length) return [];
  const s = sections[0];
  return [s.startPoint, ...(s.bendPoints ?? []), s.endPoint];
}

/** Polyline path from ELK's routed edge sections. */
export function pathFromSections(sections: EdgeSection[] | undefined): string {
  const pts = sectionPoints(sections);
  if (!pts.length) return '';
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join('');
}

/** Move `dist` from `from` toward `to`, never overshooting the midpoint (so
 *  adjacent corners on a short segment can't produce crossing fillets). */
function toward(from: Point, to: Point, dist: number): Point {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy);
  if (len < 1e-6) return { ...from };
  const k = Math.min(dist, len / 2) / len;
  return { x: from.x + dx * k, y: from.y + dy * k };
}

/**
 * Polyline with rounded corners: straight runs preserved, each bend replaced
 * by a quadratic fillet of at most `radius`. This is the orthogonal renderer —
 * `radius: 0` reproduces pathFromSections exactly, and larger radii let
 * converging edges sweep together near the node instead of meeting at hard
 * right angles.
 */
export function roundedPath(pts: Point[], radius: number): string {
  if (pts.length < 2) return polyline(pts);
  if (radius <= 0) return polyline(pts);

  let d = `M${pts[0].x},${pts[0].y}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const inPt = toward(pts[i], pts[i - 1], radius);
    const outPt = toward(pts[i], pts[i + 1], radius);
    d += `L${inPt.x},${inPt.y}Q${pts[i].x},${pts[i].y} ${outPt.x},${outPt.y}`;
  }
  const last = pts[pts.length - 1];
  return `${d}L${last.x},${last.y}`;
}

/** Straight polyline through the given points. */
export function polyline(pts: Point[]): string {
  if (!pts.length) return '';
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join('');
}

export function roundedPathFromSections(
  sections: EdgeSection[] | undefined,
  radius: number,
): string {
  return roundedPath(sectionPoints(sections), radius);
}

/**
 * Replace the tail of a routed path with a curve converging on `target`.
 *
 * Edges that share a destination are routed by ELK through separate, tightly
 * fanned ports so their orthogonal runs stay distinct — but drawing them all
 * the way to those ports leaves N arrowheads stacked in a band beside the node.
 * This keeps the routed run up to `mergeDist` from the end, then sweeps each
 * edge into one shared point, so a convergence reads as one arrival.
 *
 * The tail is a cubic whose first control point continues the incoming
 * direction, so the straight run flows into the curve without a kink.
 *
 * `mergeDist <= 0` disables merging (path returned unchanged).
 */
export function mergeTail(
  pts: Point[],
  target: Point,
  mergeDist: number,
  render: (pts: Point[]) => string,
): string {
  if (pts.length < 2 || mergeDist <= 0) return render(pts);

  // Walk back from the end until we've accumulated mergeDist of path length;
  // everything before that point is drawn as routed, the rest becomes the tail.
  let acc = 0;
  let cut = pts.length - 1;
  let cutPoint = pts[pts.length - 1];
  for (let i = pts.length - 1; i > 0; i--) {
    const seg = Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
    if (acc + seg >= mergeDist) {
      const k = (mergeDist - acc) / seg;
      cutPoint = {
        x: pts[i].x + (pts[i - 1].x - pts[i].x) * k,
        y: pts[i].y + (pts[i - 1].y - pts[i].y) * k,
      };
      cut = i - 1;
      break;
    }
    acc += seg;
    cut = i - 1;
  }

  const head = [...pts.slice(0, cut + 1), cutPoint];
  const prev = head[head.length - 2] ?? cutPoint;
  const dx = cutPoint.x - prev.x;
  const dy = cutPoint.y - prev.y;
  const len = Math.hypot(dx, dy) || 1;
  const reach = Math.min(mergeDist * 0.55, Math.hypot(target.x - cutPoint.x, target.y - cutPoint.y) * 0.6);
  const c1 = { x: cutPoint.x + (dx / len) * reach, y: cutPoint.y + (dy / len) * reach };
  // Second control sits back along the shared approach so every edge arrives
  // at the same angle — the arrowhead then reads as one, not N overlapping.
  const c2 = { x: target.x - (dx / len) * reach * 0.5, y: target.y - (dy / len) * reach * 0.5 };

  return `${render(head)}C${c1.x},${c1.y} ${c2.x},${c2.y} ${target.x},${target.y}`;
}

/**
 * Drop points that sit (nearly) on the line between their neighbours.
 *
 * ELK's orthogonal routes contain runs of collinear and near-collinear points.
 * Smoothing through every one of them produces small oscillations — the wobble
 * that made curved mode look poor even after it started following the route.
 * Collapsing those runs first gives one clean sweep per real turn.
 */
export function simplifyPoints(pts: Point[], tolerance = 1.5): Point[] {
  if (pts.length < 3) return pts;
  const out = [pts[0]];
  for (let i = 1; i < pts.length - 1; i++) {
    const a = out[out.length - 1];
    const b = pts[i];
    const c = pts[i + 1];
    // Perpendicular distance from b to the line a→c.
    const dx = c.x - a.x;
    const dy = c.y - a.y;
    const len = Math.hypot(dx, dy);
    const dist = len < 1e-6
      ? Math.hypot(b.x - a.x, b.y - a.y)
      : Math.abs(dy * b.x - dx * b.y + c.x * a.y - c.y * a.x) / len;
    if (dist > tolerance) out.push(b);
  }
  out.push(pts[pts.length - 1]);
  return out;
}

/**
 * Smooth curve through ALL routed points (Catmull-Rom converted to cubics).
 *
 * The previous curved mode drew a single cubic between the two endpoints and
 * used the bend points only to pick leaving/arriving directions — so the curve
 * ignored ELK's route entirely and sailed through whatever the orthogonal path
 * was routing around. Following every point keeps the route's shape; the
 * simplify pass keeps that from turning into a wobble.
 */
export function smoothPath(raw: Point[], tension = 0.5): string {
  const pts = simplifyPoints(raw);
  if (pts.length < 3) return polyline(raw);

  let d = `M${pts[0].x},${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1 = { x: p1.x + ((p2.x - p0.x) / 6) * tension, y: p1.y + ((p2.y - p0.y) / 6) * tension };
    const c2 = { x: p2.x - ((p3.x - p1.x) / 6) * tension, y: p2.y - ((p3.y - p1.y) / 6) * tension };
    d += `C${c1.x},${c1.y} ${c2.x},${c2.y} ${p2.x},${p2.y}`;
  }
  return d;
}

export function smoothPathFromSections(
  sections: EdgeSection[] | undefined,
  tension = 0.5,
): string {
  return smoothPath(sectionPoints(sections), tension);
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
