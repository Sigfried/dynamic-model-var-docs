/**
 * Where the floating help panels sit and how wide they are.
 *
 * Its own module because these are consumed by `HelpPanel` AND by the panels
 * that open into it, and a component file that also exports constants trips
 * `react-refresh/only-export-components` — the lint rule that already fires ten
 * times in OwnershipGraphView and should not grow a eleventh here.
 *
 * The two numbers must AGREE: a panel stepped aside has to start clear of the
 * one it steps around. They were Tailwind literals in two files (`w-[26rem]`
 * here, `right-[27rem]` there), so widening the legend would have slid the
 * cases pane underneath it with nothing failing. `helpPanelWidth.test.tsx`
 * pins the relationship.
 */

/**
 * Panel widths: a fraction of the VIEWPORT, floored.
 *
 * They were fixed rem (legend 34 = 544px, cases 26 = 416px), which is what made
 * the legend eat the canvas — Siggie, 2026-09-22: *"on a narrow viewport the
 * legend can eat up the entire canvas area."* A fraction shrinks with the
 * window; the floor stops it shrinking past its own content.
 *
 * `HelpPanel` still caps at `calc(100vw - 2rem)`, which now only binds below
 * ~600px viewport — narrower than the floors. Both panels stay resizable by
 * their corner; these are the OPENING sizes, and the inset is frozen to them.
 */
export const PANEL_WIDTH_FRACTION = 0.35;

/**
 * The narrowest each panel opens at, in px.
 *
 * **legend — 520.** Its pivot tables (`legendTable.css`) are column-aligned, so
 * a row that does not fit does not wrap. Measured 2026-09-22 over all twelve
 * pivots at a 900px panel: the widest is `total` on the owns side at **487px**
 * of content (the others: 433, 426, 387, 375, 361, 325, 249, 241, 237, 165,
 * 163). Plus the panel's own `px-4` on both sides = ~519. Consistent with the
 * ~506px measured 2026-09-15 by a different route.
 *
 * Below this the tables scroll sideways rather than clip — `.lt-scroll` — so
 * the floor is about the COMMON case reading well, not about correctness.
 *
 * **cases — 380.** Confirmed by eye at 380 (Siggie, 2026-09-22): it is prose
 * and short link rows, with no column-aligned table to clip. 380 is also where
 * the legend's four-pivot count line stops wrapping, measured the same day.
 */
export const PANEL_MIN_PX = {
  legend: 520,
  cases: 380,
} as const;

/** Gap between a panel and one stepped aside from it, in px. */
const PANEL_GAP_PX = 16;

/** `right-4` — the margin a docked panel leaves at the viewport edge. */
const PANEL_EDGE_PX = 16;

/** A panel's opening width at this viewport. */
export function panelWidthPx(
  which: keyof typeof PANEL_MIN_PX,
  viewportPx: number,
): number {
  return Math.max(PANEL_MIN_PX[which], viewportPx * PANEL_WIDTH_FRACTION);
}

/**
 * Where a panel stepped aside from the legend starts, as a distance from the
 * right edge.
 *
 * Keyed to the LEGEND's width because that is the only panel ever offset past:
 * `ExploreApp` offsets the cases pane, and only while the legend is open.
 */
export function offsetRightPx(viewportPx: number): number {
  return panelWidthPx('legend', viewportPx) + PANEL_GAP_PX;
}

/**
 * How much room on the RIGHT the canvas should leave for the open panels —
 * bug (a) of TASKS `panel-refit`.
 *
 * `HelpPanel` is `absolute top-14 right-4` / `z-30`, an overlay that never
 * enters layout, so the canvas's container keeps its full width and the node
 * boxes draw underneath it. Measured 2026-09-22 at 1600px: opening the legend
 * changed the scroll container's width by nothing at all (1280 either way).
 * The canvas cannot see the panel, so it has to be told.
 *
 * It is exactly the panel's opening width — no cap. A cap was drafted and cut
 * (Siggie, 2026-09-22): the panels are viewport-relative now, so they cannot
 * eat the canvas the way a fixed 34rem could, and a second limit on top of
 * `panelWidthPx`'s own floor would only disagree with it.
 *
 * ⚠️ FROZEN AT OPEN TIME, by Siggie's rule. This takes the panel's OPENING
 * width; it deliberately does not track a corner-resize or a drag. A dragged
 * panel drops its inset with NO redraw — the canvas may use the full width at
 * its next natural redraw, nothing moves under the user's hand, and a box
 * ending up under a dragged panel is accepted.
 *
 * @param panels    which panels are docked (open and never dragged)
 * @param viewportPx `window.innerWidth`, which the panel widths are relative to
 */
export function panelInsetPx(
  panels: { legend: boolean; cases: boolean },
  viewportPx: number,
): number {
  // The cases pane steps aside only while the legend is open, so the two open
  // together reach further left than either alone.
  if (panels.legend && panels.cases) {
    return offsetRightPx(viewportPx) + panelWidthPx('cases', viewportPx) + PANEL_EDGE_PX;
  }
  if (panels.legend) return panelWidthPx('legend', viewportPx) + PANEL_EDGE_PX;
  if (panels.cases) return panelWidthPx('cases', viewportPx) + PANEL_EDGE_PX;
  return 0;
}
