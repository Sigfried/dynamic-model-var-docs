import { describe, test, expect } from 'vitest';
import {
  pathFromSections, roundedPathFromSections, smoothPathFromSections, sectionPoints,
  roundedPath,
  simplifyPoints, mergeTail, polyline, arrowPath, mergeCut, smoothStepPath,
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

  // The tail was a cubic until 2026-08-19. It rendered visually straight
  // anyway, and its seam with the routed head could not be rounded, which is
  // what produced the hard right angles in 'bend' mode.
  test('the tail is straight — no cubic is emitted', () => {
    expect(mergeTail(PTS, TARGET, 40, polyline)).not.toMatch(/C/);
  });

  test('the cut is an ordinary corner, so roundedPath rounds it', () => {
    // A quadratic at the join is the tell: roundedPath emits Q per interior
    // corner, and the cut must now be one of them.
    const d = mergeTail(PTS, TARGET, 40, p => roundedPath(p, 10));
    expect(d).toMatch(/Q/);
    expect(coords(d)[coords(d).length - 1]).toEqual([TARGET.x, TARGET.y]);
  });

  test('a cut landing exactly on a routed corner emits no zero-length segment', () => {
    // 'bend' mode cuts exactly at the last corner, so cutPoint coincides with
    // it; a duplicated point would round a zero-length segment.
    const last = PTS[PTS.length - 1];
    const prev = PTS[PTS.length - 2];
    const exact = Math.hypot(last.x - prev.x, last.y - prev.y);
    const c = coords(mergeTail(PTS, TARGET, exact, polyline));
    for (let i = 1; i < c.length; i++) {
      expect([c[i][0] - c[i - 1][0], c[i][1] - c[i - 1][1]]).not.toEqual([0, 0]);
    }
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

describe('mergeCut', () => {
  const PTS_C = sectionPoints(STAIRS);

  test('the cut sits mergeDist of path length back from the end', () => {
    const { cutPoint } = mergeCut(PTS_C, 40);
    // Accumulate the path from the cut to the end; it must equal mergeDist.
    const tail = [cutPoint, ...PTS_C.slice(mergeCut(PTS_C, 40).cut + 1)];
    let len = 0;
    for (let i = 1; i < tail.length; i++) {
      len += Math.hypot(tail[i].x - tail[i - 1].x, tail[i].y - tail[i - 1].y);
    }
    expect(len).toBeCloseTo(40, 6);
  });

  test('a distance longer than the path clamps to the start', () => {
    const { cut } = mergeCut(PTS_C, 10_000);
    expect(cut).toBe(0);
  });

  test('agrees with the cut mergeTail actually draws', () => {
    // The renderer ranks approaches by this point, so a drift between the two
    // would order the fan by one geometry and draw it with another.
    const { cutPoint } = mergeCut(PTS_C, 40);
    const drawn = coords(mergeTail(PTS_C, { x: 200, y: 50 }, 40, polyline));
    const match = drawn.some(
      ([x, y]) => Math.abs(x - cutPoint.x) < 1e-6 && Math.abs(y - cutPoint.y) < 1e-6,
    );
    expect(match).toBe(true);
  });
});

describe('arrowPath — the one head per convergence', () => {
  const coordsOf = (d: string) =>
    [...d.matchAll(/(-?[\d.]+),(-?[\d.]+)/g)].map(m => [Number(m[1]), Number(m[2])]);

  test('LR: base is vertical, tip is len along +x', () => {
    // span across the base, len from base to point.
    const d = arrowPath({ x: 100, y: 50 }, { x: 1, y: 0 }, 12, 18);
    expect(coordsOf(d)).toEqual([[100, 56], [118, 50], [100, 44]]);
  });

  test('TB swaps the axes: base is horizontal, tip is len along +y', () => {
    // Same span/len, but the arrow points down — the base must run across x.
    const d = arrowPath({ x: 100, y: 50 }, { x: 0, y: 1 }, 12, 18);
    expect(coordsOf(d)).toEqual([[94, 50], [100, 68], [106, 50]]);
  });

  test('points back the other way for an incoming arrival', () => {
    const d = arrowPath({ x: 100, y: 50 }, { x: -1, y: 0 }, 12, 18);
    expect(coordsOf(d)[1]).toEqual([82, 50]);
  });

  test('the base centre is the midpoint of the two base corners', () => {
    // Every converging edge terminates here, so it must be exactly centred.
    const [a, , b] = coordsOf(arrowPath({ x: 40, y: 90 }, { x: 0, y: -1 }, 12, 18));
    expect([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]).toEqual([40, 90]);
  });

  test('normalizes a non-unit direction', () => {
    const d = arrowPath({ x: 0, y: 0 }, { x: 5, y: 0 }, 12, 18);
    expect(coordsOf(d)[1]).toEqual([18, 0]);
  });

  test('closes the triangle', () => {
    expect(arrowPath({ x: 0, y: 0 }, { x: 1, y: 0 }, 12, 18)).toMatch(/Z$/);
  });
});

describe('arrowPath — a convergence head always points INTO its node', () => {
  const tipOf = (d: string) =>
    [...d.matchAll(/(-?[\d.]+),(-?[\d.]+)/g)].map(m => [Number(m[1]), Number(m[2])])[1];

  // Regression: the side of the node a head sits on and the way it points are
  // independent. Deriving `dir` from the side sign drew every merged head
  // backwards (2026-08-19). The head terminates edges landing on the class, so
  // it points at the class from whichever border it sits on.
  const NODE = { x: 100, y: 50, w: 240, h: 80 };
  const back = 21; // ARROW_GAP + ARROW_LEN at the shipped sizes

  test('LR near border (west): base outside, tip points east into the node', () => {
    const base = { x: NODE.x - back, y: NODE.y };
    const tip = tipOf(arrowPath(base, { x: 1, y: 0 }, 12, 18));
    expect(tip[0]).toBeGreaterThan(base.x);
    expect(tip[0]).toBeLessThan(NODE.x);
  });

  test('LR far border (east): base outside, tip points west into the node', () => {
    const base = { x: NODE.x + NODE.w + back, y: NODE.y };
    const tip = tipOf(arrowPath(base, { x: -1, y: 0 }, 12, 18));
    expect(tip[0]).toBeLessThan(base.x);
    expect(tip[0]).toBeGreaterThan(NODE.x + NODE.w);
  });

  test('TB near border (north): tip points south into the node', () => {
    const base = { x: NODE.x, y: NODE.y - back };
    const tip = tipOf(arrowPath(base, { x: 0, y: 1 }, 12, 18));
    expect(tip[1]).toBeGreaterThan(base.y);
    expect(tip[1]).toBeLessThan(NODE.y);
  });

  test('TB far border (south): tip points north into the node', () => {
    const base = { x: NODE.x, y: NODE.y + NODE.h + back };
    const tip = tipOf(arrowPath(base, { x: 0, y: -1 }, 12, 18));
    expect(tip[1]).toBeLessThan(base.y);
    expect(tip[1]).toBeGreaterThan(NODE.y + NODE.h);
  });
});

describe('smoothStepPath — drag-time orthogonal routing', () => {
  const R = { x: 1, y: 0 };
  const L = { x: -1, y: 0 };
  const D = { x: 0, y: 1 };
  const U = { x: 0, y: -1 };

  test('every segment is axis-aligned', () => {
    // The whole point is that a dragged edge still READS as orthogonal; a
    // diagonal segment would look like a different kind of edge.
    const pts = smoothStepPath({ x: 0, y: 0 }, { x: 200, y: 80 }, R, L);
    for (let i = 1; i < pts.length; i++) {
      const dx = Math.abs(pts[i].x - pts[i - 1].x);
      const dy = Math.abs(pts[i].y - pts[i - 1].y);
      expect(Math.min(dx, dy)).toBeLessThan(1e-6);
    }
  });

  test('starts and ends exactly at the anchors', () => {
    const from = { x: 10, y: 20 };
    const to = { x: 300, y: 140 };
    const pts = smoothStepPath(from, to, R, L);
    expect(pts[0]).toEqual(from);
    expect(pts[pts.length - 1]).toEqual(to);
  });

  test('leaves along fromDir and arrives against toDir', () => {
    const pts = smoothStepPath({ x: 0, y: 0 }, { x: 200, y: 80 }, R, L);
    expect(pts[1].x).toBeGreaterThan(pts[0].x);          // stubs out to the east
    const last = pts[pts.length - 1];
    const prev = pts[pts.length - 2];
    expect(prev.x).toBeLessThan(last.x);                  // arrives heading east
  });

  test('a straight shot collapses to two points', () => {
    // simplifyPoints must drop the redundant mid-channel when the anchors
    // already line up, or a straight edge gains phantom bends.
    const pts = smoothStepPath({ x: 0, y: 50 }, { x: 200, y: 50 }, R, L);
    expect(pts).toHaveLength(2);
  });

  test('routes vertically for a TB layout', () => {
    const pts = smoothStepPath({ x: 0, y: 0 }, { x: 90, y: 200 }, D, U);
    expect(pts[1].y).toBeGreaterThan(pts[0].y);
    for (let i = 1; i < pts.length; i++) {
      const dx = Math.abs(pts[i].x - pts[i - 1].x);
      const dy = Math.abs(pts[i].y - pts[i - 1].y);
      expect(Math.min(dx, dy)).toBeLessThan(1e-6);
    }
  });
});
