/**
 * Shared panel-layout constants for the 3-panel views (Kitchen Sink / Focus).
 *
 * These govern the fixed/constrained panel widths and the flex gutters between
 * panels. The gutters give LinkOverlay's connector curves room to render, so
 * both LayoutManager and FocusView must use the same values to stay consistent.
 */

/** Width of a collapsed/empty panel (px). */
export const EMPTY_PANEL_WIDTH = 180;

/** Maximum width a populated panel may grow to (px). */
export const MAX_PANEL_WIDTH = 450;

/** Minimum width of an inter-panel gutter — keeps links visible (px). */
export const MIN_GUTTER_WIDTH = 80;

/** Minimum gutter width in Focus, where gutters are meant to be small and
 *  (eventually) user-resizable rather than flex-filling wide. */
export const FOCUS_GUTTER_WIDTH = 28;

/** Minimum width of a populated panel (px). */
export const MIN_PANEL_WIDTH = 300;
