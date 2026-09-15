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

/** Default panel widths, in rem. Both panels stay resizable by their corner. */
export const PANEL_WIDTH_REM = {
  /*
   * The legend's pivot tables are column-aligned (`legendTable.css`), so a row
   * that does not fit does not wrap — it widens the table, and the panel clips
   * it. Measured 2026-09-15 over all twelve pivots with the leaf rendered as
   * `name + cardinality | arrow | target`: median ~392px, max ~506px (the
   * `QuestionnaireResponseItem.response_value → QuestionnaireResponseValue`
   * row, which is worst in three pivots at once). 34rem = 544px clears the max
   * with room for the panel's own padding.
   *
   * It was 30rem until then, sized for a FLAT list of `Class.slot` rows with
   * no target column — that listing wrapped gracefully and this one cannot.
   * It was briefly 36rem in 2026-09-11, when the rows carried a redundant
   * `(owner: X)` suffix; dropping the suffix was the better half of that fix.
   */
  legend: 34,
  cases: 26,
} as const;

/** Gap between a panel and one stepped aside from it. */
const PANEL_GAP_REM = 1;

/**
 * Where a panel stepped aside from the legend starts.
 *
 * Keyed to the LEGEND's width because that is the only panel ever offset past:
 * `ExploreApp` offsets the cases pane, and only while the legend is open.
 */
export const OFFSET_RIGHT_REM = PANEL_WIDTH_REM.legend + PANEL_GAP_REM;
