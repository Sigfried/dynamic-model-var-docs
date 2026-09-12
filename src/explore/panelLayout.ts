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
   * The legend lists `Class.slot → Range (owner: X)` rows in 10px monospace.
   * Measured 2026-09-11 over all 159: median 52 characters, p90 76, max 95
   * (`QuestionnaireResponseItem.has_questionnaire_item → QuestionnaireItem
   * (owner: QuestionnaireItem)`). At ~6px per character plus the panel's
   * padding, 36rem clears p90 with room and wraps only the longest handful —
   * sizing for the max would mean a ~40rem panel for one row.
   */
  legend: 36,
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
