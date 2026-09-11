/**
 * How an edge LOOKS — the one place it is decided.
 *
 * The canvas (`OwnershipGraphView`), the legend's samples and the relation
 * popover's rows (`EdgeSample`), and the tour's inline arrows all draw from
 * this module, so a change to a head's shape, a dash pattern or a colour lands
 * everywhere at once. Before 2026-09-10 the canvas and `EdgeSample` each
 * carried their own marker geometry, and the canvas itself drew two sizes of
 * head: the shared convergence head at 12×18 and the per-edge markers at 9×12.
 * Forward edges mostly converge and backward edges never do, so forward heads
 * read as bigger — Siggie: "i've never really liked the forward arrowhead
 * being bigger than the backward arrowhead". One geometry now.
 *
 * Colours stay in `appConfig.EDGE_COLORS` (P2 of the three palettes) and are
 * re-exported through `kinds` so a consumer needs only this module.
 *
 * **Per-kind appearance is NOT declared here.** It comes from
 * `OWNERSHIP_VERDICTS` (src/models/ownershipRules.ts, reached through
 * DataService), the one declaration that also holds each rule's predicate,
 * verdict and human text — so adding an edge kind is one entry there rather
 * than an edit in five files. What stays here is the geometry every kind
 * shares: head size, stroke widths, the dash pattern, the marker glyphs.
 */

import { EDGE_COLORS } from '../config/appConfig';
import { OWNERSHIP_VERDICTS } from '../services/DataService';

/**
 * The verdicts that draw. `excluded` never becomes an edge.
 *
 * `association` is listed explicitly because no slot classifies as it since
 * 2026-09-11, so it is absent from OWNERSHIP_VERDICTS and its style is
 * supplied below. Deleting it is step 3 of TASKS
 * `ownership-rules-declarative`; see docs/OWNERSHIP_RULES_PLAN.md.
 */
export type DrawnKind = 'own-fwd' | 'own-bkwd' | 'association';

/** Which way a head points relative to the path's own direction. */
export type HeadDirection = 'forward' | 'backward';

export interface EdgeKindStyle {
  color: string;
  /** Where heads sit: at the path's end, or at both ends (association). */
  heads: 'end' | 'both';
  /** The head at the END points along the path (forward) or back down it. */
  headDirection: HeadDirection;
  dashed: boolean;
  /** Reference edges are secondary: thinner stroke, slightly smaller head. */
  secondary: boolean;
  /** The legend's and the tour's name for it, in A/B form. */
  label: string;
}

export const EDGE_STYLE = {
  /**
   * Every head, everywhere, in canvas px: `len` from base to tip along the
   * path, `span` across the base. Sized off the 12px entity title so a head
   * reads as belonging to the name it points at (~1em across, ~1.5em long).
   */
  head: { len: 18, span: 12 },
  /** Reference heads and strokes are this fraction of an ownership edge's. */
  secondaryScale: 0.85,
  /** Gap between a node's border and the head's TIP; 0 = tip on the border. */
  gap: 0,
  stroke: { own: 1.4, ownHover: 2.6, refFactor: 0.75 },
  dash: '5 4',
  kinds: {
    'own-fwd': OWNERSHIP_VERDICTS['own-fwd'],
    'own-bkwd': OWNERSHIP_VERDICTS['own-bkwd'],
    /*
     * No live example since ASSOCIATION_SLOTS emptied (2026-09-11), so this is
     * the only kind still declared here rather than in OWNERSHIP_VERDICTS.
     *
     * It is ALSO the acceptance criterion for the declaration: an edge kind
     * that is dashed, arrowed at BOTH ends, claims no ownership and yet layers
     * like own-bkwd must be expressible by moving this object into
     * OWNERSHIP_VERDICTS and adding one rule entry — nothing else.
     * `ownershipRules.test.ts` proves that.
     */
    'association': {
      color: EDGE_COLORS.association, heads: 'both', headDirection: 'forward',
      dashed: true, secondary: true, label: 'A and B are associated',
    },
  } satisfies Record<DrawnKind, EdgeKindStyle>,
} as const;

export const DRAWN_KINDS = Object.keys(EDGE_STYLE.kinds) as DrawnKind[];

/**
 * A head glyph in a 10×7 box, tip on the right for `forward` and on the left
 * for `backward`. Two glyphs, not one turned around: `orient="auto-start-
 * reverse"` flips only a markerSTART, and the backward head sits at the same
 * END as the forward one but points the other way.
 */
export function headGlyph(direction: HeadDirection): string {
  return direction === 'forward' ? 'M0,0 L10,3.5 L0,7 Z' : 'M10,0 L0,3.5 L10,7 Z';
}

/**
 * Everything an SVG `<marker>` needs to draw one head of the shared geometry.
 *
 * `refX` is the point of the glyph that sits on the path's END: for BOTH
 * directions it is the end nearer the path, so the head always lies BEYOND
 * the line, never on top of it. A forward head has its base on the path end
 * and its tip beyond; a backward head has its TIP on the path end and its
 * base beyond, toward the box. The path is trimmed by `head.len` so that
 * "beyond" reaches exactly to the box (see `EDGE_STYLE.gap`). Until
 * 2026-09-10 the backward head's BASE sat on the path end, so the line ran
 * under the whole head and it read as a barb on the line rather than a head
 * at its end — half of why backward heads looked smaller.
 *
 * `scale` shrinks the whole head (secondary edges; the legend's samples).
 * `markerUnits="userSpaceOnUse"` so the head does not also scale with stroke.
 */
export function headMarker(direction: HeadDirection, scale = 1) {
  const { len, span } = EDGE_STYLE.head;
  // refX=0 for BOTH: the forward glyph has its base at x=0, the backward glyph
  // its tip at x=0, and x=0 is what sits on the path's end.
  return {
    viewBox: '0 0 10 7',
    refX: 0,
    refY: 3.5,
    markerWidth: len * scale,
    markerHeight: span * scale,
    markerUnits: 'userSpaceOnUse' as const,
    orient: 'auto-start-reverse' as const,
    d: headGlyph(direction),
  };
}

/** Stroke width for a kind, at rest or hovered. */
export function strokeFor(kind: DrawnKind, hover = false): number {
  const base = hover ? EDGE_STYLE.stroke.ownHover : EDGE_STYLE.stroke.own;
  return EDGE_STYLE.kinds[kind].secondary ? base * EDGE_STYLE.stroke.refFactor : base;
}

/** How far a path is cut back from a box so its head lands ON the border. */
export function headTrim(kind: DrawnKind): number {
  const s = EDGE_STYLE.kinds[kind].secondary ? EDGE_STYLE.secondaryScale : 1;
  return EDGE_STYLE.head.len * s + EDGE_STYLE.gap;
}
