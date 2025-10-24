/**
 * Layout calculation utilities for adaptive detail panel display
 */

export const PANEL_MAX_WIDTH = 450;
export const EMPTY_PANEL_WIDTH = 180;
export const GUTTER_WIDTH = 160;
export const SPACE_THRESHOLD = 600;

export type DisplayMode = 'stacked' | 'dialog';

export interface SpaceCalculation {
  windowWidth: number;
  leftWidth: number;
  rightWidth: number;
  gutterWidth: number;
  usedSpace: number;
  remainingSpace: number;
}

/**
 * Calculate the remaining horizontal space after accounting for panels and gutter
 */
export function calculateRemainingSpace(
  windowWidth: number,
  leftSectionsCount: number,
  rightSectionsCount: number
): SpaceCalculation {
  // Calculate panel widths
  const leftWidth = leftSectionsCount === 0 ? EMPTY_PANEL_WIDTH : PANEL_MAX_WIDTH;
  const rightWidth = rightSectionsCount === 0 ? EMPTY_PANEL_WIDTH : PANEL_MAX_WIDTH;
  const gutterWidth = (leftSectionsCount > 0 && rightSectionsCount > 0) ? GUTTER_WIDTH : 0;

  // Calculate remaining space
  const usedSpace = leftWidth + rightWidth + gutterWidth;
  const remainingSpace = windowWidth - usedSpace;

  return {
    windowWidth,
    leftWidth,
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
  return remainingSpace >= threshold ? 'stacked' : 'dialog';
}

/**
 * Calculate display mode from window width and panel sections
 */
export function calculateDisplayMode(
  windowWidth: number,
  leftSectionsCount: number,
  rightSectionsCount: number,
  threshold: number = SPACE_THRESHOLD
): { mode: DisplayMode; spaceInfo: SpaceCalculation } {
  const spaceInfo = calculateRemainingSpace(windowWidth, leftSectionsCount, rightSectionsCount);
  const mode = determineDisplayMode(spaceInfo.remainingSpace, threshold);

  return { mode, spaceInfo };
}
