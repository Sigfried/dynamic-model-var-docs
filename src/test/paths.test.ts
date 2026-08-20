import { describe, test, expect } from 'vitest';
import {
  pathFromSections, roundedPathFromSections, smoothPathFromSections, sectionPoints,
  simplifyPoints, mergeTail, polyline,
} from '../explore/graph-core/paths';
import type { Point } from '../explore/graph-core/types';
import type { EdgeSection } from '../explore/graph-core/types';

/**
 * Pure-geometry tests for the edge path builders (graph-core/paths).
 *
 * These matter because the renderer's two modes are both built on them and
 * neither is covered by any DOM test — jsdom has no SVG geometry. The curved
 * mode in particular shipped broken for months: it drew a single cubic between
 * the two endpoints and used ELK's bend points only to pick leaving/arriving
 * directions, so the curve ignored the route and cut through nodes.
 */

/** One ELK section with the given start, bends, end. */
function sec(pts: [number, number][]): EdgeSection[] {
  const [start, ...rest] = pts;
  const end = rest.pop()!;
  return [{
    startPoint: { x: start[0], y: start[1] },
    endPoint: { x: end[0], y: end[1] },
    bendPoints: rest.map(([x, y]) => ({ x, y })),
  }];
}

/** Every coordinate pair in a path string, in order. */
function coords(d: string): [number, number][] {
  return [...d.matchAll(/(-?[\d.]+),(-?[\d.]+)/g)].map(m => [Number(m[1]), Number(m[2])]);
}

const STRAIGHT = sec([[0, 0], [100, 0]]);
const ELBOW = sec([[0, 0], [50, 0], [50, 100]]);
const STAIRS = sec([[0, 0], [40, 0], [40, 50], [80, 50], [80, 100]]);

describe('sectionPoints', () => {
  test('returns start, bends and end in order', () => {
    expect(sectionPoints(ELBOW)).toEqual([
      { x: 0, y: 0 }, { x: 50, y: 0 }, { x: 50, y: 100 },
    ]);
  });

  test('empty for missing sections', () => {
    expect(sectionPoints(undefined)).toEqual([]);
    expect(sectionPoints([])).toEqual([]);
  });
});

describe('roundedPathFromSections', () => {
  test('radius 0 reproduces the square-cornered polyline exactly', () => {
    // The generalization claim: orthogonal mode is this builder at radius 0.
    for (const s of [STRAIGHT, ELBOW, STAIRS]) {
      expect(roundedPathFromSections(s, 0)).toBe(pathFromSections(s));
    }
  });

  test('a corner becomes a quadratic whose control point is the bend', () => {
    const d = roundedPathFromSections(ELBOW, 10);
    // Straight in to 10px before the bend, curve through it, straight out.
    expect(d).toBe('M0,0L40,0Q50,0 50,10L50,100');
  });

  test('endpoints are preserved exactly — edges still meet their ports', () => {
    for (const s of [ELBOW, STAIRS]) {
      const pts = sectionPoints(s);
      const c = coords(roundedPathFromSections(s, 10));
      expect(c[0]).toEqual([pts[0].x, pts[0].y]);
      expect(c[c.length - 1]).toEqual([pts[pts.length - 1].x, pts[pts.length - 1].y]);
    }
  });

  test('fillets never overshoot the midpoint of a short segment', () => {
    // Adjacent corners 20px apart with a 50px radius: without clamping, the
    // two fillets would cross and the edge would visibly double back.
    const short = sec([[0, 0], [20, 0], [20, 20], [40, 20]]);
    const c = coords(roundedPathFromSections(short, 50));
    for (const [x, y] of c) {
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThanOrEqual(40);
      expect(y).toBeGreaterThanOrEqual(0);
      expect(y).toBeLessThanOrEqual(20);
    }
  });

  test('a straight run is left alone (no bends to round)', () => {
    expect(roundedPathFromSections(STRAIGHT, 10)).toBe('M0,0L100,0');
  });
});

describe('simplifyPoints', () => {
  test('drops collinear points, keeps real corners', () => {
    // The wobble fix: ELK emits runs of collinear points, and smoothing through
    // each one produced small oscillations instead of one clean sweep.
    const withCollinear: Point[] = [
      { x: 0, y: 0 }, { x: 10, y: 0 }, { x: 20, y: 0 }, { x: 30, y: 0 },
      { x: 30, y: 40 },
    ];
    expect(simplifyPoints(withCollinear)).toEqual([
      { x: 0, y: 0 }, { x: 30, y: 0 }, { x: 30, y: 40 },
    ]);
  });

  test('keeps a deviation larger than the tolerance', () => {
    const jog: Point[] = [{ x: 0, y: 0 }, { x: 10, y: 8 }, { x: 20, y: 0 }];
    expect(simplifyPoints(jog)).toHaveLength(3);
  });

  test('endpoints always survive', () => {
    const pts: Point[] = [{ x: 0, y: 0 }, { x: 5, y: 0 }, { x: 10, y: 0 }];
    const out = simplifyPoints(pts);
    expect(out[0]).toEqual(pts[0]);
    expect(out[out.length - 1]).toEqual(pts[2]);
  });
});

describe('mergeTail', () => {
  const TARGET: Point = { x: 200, y: 50 };
  const PTS = sectionPoints(STAIRS);

  test('ends exactly at the shared target — one arrival point, one arrowhead', () => {
    const c = coords(mergeTail(PTS, TARGET, 40, polyline));
    expect(c[c.length - 1]).toEqual([TARGET.x, TARGET.y]);
  });

  test('different edges converging on one target all end there', () => {
    // The point of merging: N edges from different sources, one arrival.
    const other = [{ x: 0, y: 300 }, { x: 90, y: 300 }, { x: 90, y: 60 }];
    for (const pts of [PTS, other]) {
      const c = coords(mergeTail(pts, TARGET, 40, polyline));
      expect(c[c.length - 1]).toEqual([TARGET.x, TARGET.y]);
    }
  });

  test('keeps the routed start — only the tail is replaced', () => {
    const c = coords(mergeTail(PTS, TARGET, 40, polyline));
    expect(c[0]).toEqual([PTS[0].x, PTS[0].y]);
  });

  test('disabled at mergeDist 0 (renders the route untouched)', () => {
    expect(mergeTail(PTS, TARGET, 0, polyline)).toBe(polyline(PTS));
  });

  test('a merge distance longer than the path still terminates at the target', () => {
    const c = coords(mergeTail(PTS, TARGET, 10_000, polyline));
    expect(c[c.length - 1]).toEqual([TARGET.x, TARGET.y]);
  });
});

describe('smoothPathFromSections', () => {
  test('passes through the routed corners, not just the endpoints', () => {
    // The old curved mode dropped the bends entirely; this is the regression
    // guard. Real corners (post-simplify) must appear as cubic destinations.
    const d = smoothPathFromSections(STAIRS);
    const c = coords(d);
    for (const p of simplifyPoints(sectionPoints(STAIRS))) {
      expect(c).toContainEqual([p.x, p.y]);
    }
  });

  test('emits one cubic per simplified segment', () => {
    const segments = simplifyPoints(sectionPoints(STAIRS)).length - 1;
    expect([...smoothPathFromSections(STAIRS).matchAll(/C/g)]).toHaveLength(segments);
  });

  test('falls back to the polyline when there is nothing to smooth', () => {
    // Fewer than 3 points is a single straight run — a curve would be a lie.
    expect(smoothPathFromSections(STRAIGHT)).toBe(pathFromSections(STRAIGHT));
    expect(smoothPathFromSections(undefined)).toBe('');
  });

  test('endpoints are preserved exactly', () => {
    const pts = sectionPoints(STAIRS);
    const c = coords(smoothPathFromSections(STAIRS));
    expect(c[0]).toEqual([pts[0].x, pts[0].y]);
    expect(c[c.length - 1]).toEqual([pts[pts.length - 1].x, pts[pts.length - 1].y]);
  });
});
