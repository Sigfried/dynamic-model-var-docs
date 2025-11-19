/**
 * Layout calculation utilities for adaptive detail panel display
 */

export const PANEL_MAX_WIDTH = 450;
export const EMPTY_PANEL_WIDTH = 180;
export const GUTTER_WIDTH = 160;
export const SPACE_THRESHOLD = 600;

export type DisplayMode = 'stacked' | 'cascade';

export interface SpaceCalculation {
  windowWidth: number;
  leftWidth: number;
  middleWidth: number;
  rightWidth: number;
  gutterWidth: number;
  usedSpace: number;
  remainingSpace: number;
}

/**
 * Calculate the remaining horizontal space after accounting for panels and gutters
 */
export function calculateRemainingSpace(
  windowWidth: number,
  leftSectionsCount: number,
  rightSectionsCount: number,
  middlePanelVisible: boolean = false
): SpaceCalculation {
  // Calculate panel widths
  const leftWidth = leftSectionsCount === 0 ? EMPTY_PANEL_WIDTH : PANEL_MAX_WIDTH;
  const rightWidth = rightSectionsCount === 0 ? EMPTY_PANEL_WIDTH : PANEL_MAX_WIDTH;
  const middleWidth = middlePanelVisible ? PANEL_MAX_WIDTH : 0;

  // Calculate gutter width:
  // - 2-panel mode: 1 gutter between left and right
  // - 3-panel mode: 2 gutters (left-middle, middle-right)
  let gutterWidth = 0;
  if (middlePanelVisible) {
    gutterWidth = 2 * GUTTER_WIDTH; // Two gutters in 3-panel mode
  } else if (leftSectionsCount > 0 && rightSectionsCount > 0) {
    gutterWidth = GUTTER_WIDTH; // One gutter in 2-panel mode
  }

  // Calculate remaining space
  const usedSpace = leftWidth + middleWidth + rightWidth + gutterWidth;
  const remainingSpace = windowWidth - usedSpace;

  return {
    windowWidth,
    leftWidth,
    middleWidth,
    rightWidth,
    gutterWidth,
    usedSpace,
    remainingSpace
  };
}

/**
 * Determine display mode based on available space
 */
export function determineDisplayMode(
  remainingSpace: number,
  threshold: number = SPACE_THRESHOLD
): DisplayMode {
  return remainingSpace >= threshold ? 'stacked' : 'cascade';
}

/**
 * Calculate display mode from window width and panel sections
 */
export function calculateDisplayMode(
  windowWidth: number,
  leftSectionsCount: number,
  rightSectionsCount: number,
  middlePanelVisible: boolean = false,
  threshold: number = SPACE_THRESHOLD
): { mode: DisplayMode; spaceInfo: SpaceCalculation } {
  const spaceInfo = calculateRemainingSpace(windowWidth, leftSectionsCount, rightSectionsCount, middlePanelVisible);
  const mode = determineDisplayMode(spaceInfo.remainingSpace, threshold);

  return { mode, spaceInfo };
}
