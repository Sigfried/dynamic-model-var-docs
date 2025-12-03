/**
 * Tests for adaptive layout space calculation and mode determination
 */

import { describe, it, expect } from 'vitest';
import {
  calculateRemainingSpace,
  determineDisplayMode,
  calculateDisplayMode,
  PANEL_MAX_WIDTH,
  EMPTY_PANEL_WIDTH,
  GUTTER_WIDTH,
  SPACE_THRESHOLD,
  type DisplayMode
} from '../utils/layoutHelpers';

describe('calculateRemainingSpace', () => {
  it('calculates space with both panels populated', () => {
    const result = calculateRemainingSpace(1920, 1, 1);

    expect(result.leftWidth).toBe(PANEL_MAX_WIDTH);
    expect(result.rightWidth).toBe(PANEL_MAX_WIDTH);
    expect(result.gutterWidth).toBe(GUTTER_WIDTH);
    expect(result.usedSpace).toBe(PANEL_MAX_WIDTH + PANEL_MAX_WIDTH + GUTTER_WIDTH);
    expect(result.remainingSpace).toBe(1920 - (PANEL_MAX_WIDTH + PANEL_MAX_WIDTH + GUTTER_WIDTH));
  });

  it('calculates space with one panel empty (left)', () => {
    const result = calculateRemainingSpace(1920, 0, 1);

    expect(result.leftWidth).toBe(EMPTY_PANEL_WIDTH);
    expect(result.rightWidth).toBe(PANEL_MAX_WIDTH);
    expect(result.gutterWidth).toBe(0); // No gutter when one panel is empty
    expect(result.usedSpace).toBe(EMPTY_PANEL_WIDTH + PANEL_MAX_WIDTH);
    expect(result.remainingSpace).toBe(1920 - (EMPTY_PANEL_WIDTH + PANEL_MAX_WIDTH));
  });

  it('calculates space with one panel empty (right)', () => {
    const result = calculateRemainingSpace(1920, 1, 0);

    expect(result.leftWidth).toBe(PANEL_MAX_WIDTH);
    expect(result.rightWidth).toBe(EMPTY_PANEL_WIDTH);
    expect(result.gutterWidth).toBe(0); // No gutter when one panel is empty
    expect(result.usedSpace).toBe(PANEL_MAX_WIDTH + EMPTY_PANEL_WIDTH);
    expect(result.remainingSpace).toBe(1920 - (PANEL_MAX_WIDTH + EMPTY_PANEL_WIDTH));
  });

  it('calculates space with both panels empty', () => {
    const result = calculateRemainingSpace(1920, 0, 0);

    expect(result.leftWidth).toBe(EMPTY_PANEL_WIDTH);
    expect(result.rightWidth).toBe(EMPTY_PANEL_WIDTH);
    expect(result.gutterWidth).toBe(0);
    expect(result.usedSpace).toBe(EMPTY_PANEL_WIDTH + EMPTY_PANEL_WIDTH);
    expect(result.remainingSpace).toBe(1920 - (EMPTY_PANEL_WIDTH + EMPTY_PANEL_WIDTH));
  });

  it('handles multiple sections in panels (should still use max width)', () => {
    const result = calculateRemainingSpace(1920, 3, 2);

    // Even with multiple sections, panel width is still PANEL_MAX_WIDTH
    expect(result.leftWidth).toBe(PANEL_MAX_WIDTH);
    expect(result.rightWidth).toBe(PANEL_MAX_WIDTH);
  });

  it('returns correct windowWidth in result', () => {
    const result = calculateRemainingSpace(2560, 1, 1);
    expect(result.windowWidth).toBe(2560);
  });
});

describe('determineDisplayMode', () => {
  it('returns "stacked" when remaining space equals threshold', () => {
    const mode = determineDisplayMode(SPACE_THRESHOLD);
    expect(mode).toBe('stacked');
  });

  it('returns "stacked" when remaining space exceeds threshold', () => {
    const mode = determineDisplayMode(SPACE_THRESHOLD + 100);
    expect(mode).toBe('stacked');
  });

  it('returns "cascade" when remaining space is below threshold', () => {
    const mode = determineDisplayMode(SPACE_THRESHOLD - 1);
    expect(mode).toBe('cascade');
  });

  it('returns "cascade" when remaining space is 0', () => {
    const mode = determineDisplayMode(0);
    expect(mode).toBe('cascade');
  });

  it('returns "cascade" when remaining space is negative', () => {
    const mode = determineDisplayMode(-100);
    expect(mode).toBe('cascade');
  });

  it('accepts custom threshold', () => {
    const customThreshold = 800;
    expect(determineDisplayMode(799, customThreshold)).toBe('cascade');
    expect(determineDisplayMode(800, customThreshold)).toBe('stacked');
    expect(determineDisplayMode(801, customThreshold)).toBe('stacked');
  });
});

describe('calculateDisplayMode', () => {
  it('returns "stacked" mode for wide window with both panels', () => {
    // 1920px window - 450 - 450 - 160 = 860px remaining (> 600 threshold)
    const result = calculateDisplayMode(1920, 1, 1);
    expect(result.mode).toBe('stacked');
    expect(result.spaceInfo.remainingSpace).toBeGreaterThan(SPACE_THRESHOLD);
  });

  it('returns "dialog" mode for narrow window with both panels', () => {
    // 1200px window - 450 - 450 - 160 = 140px remaining (< 600 threshold)
    const result = calculateDisplayMode(1200, 1, 1);
    expect(result.mode).toBe('cascade');
    expect(result.spaceInfo.remainingSpace).toBeLessThan(SPACE_THRESHOLD);
  });

  it('returns "stacked" mode for medium window with one empty panel', () => {
    // 1400px window - 450 - 180 - 0 = 770px remaining (> 600 threshold)
    const result = calculateDisplayMode(1400, 1, 0);
    expect(result.mode).toBe('stacked');
  });

  it('returns "dialog" mode at exact boundary', () => {
    // Calculate the exact window width that gives SPACE_THRESHOLD remaining
    // usedSpace = 450 + 450 + 160 = 1060
    // windowWidth = 1060 + 600 = 1660
    const result = calculateDisplayMode(1660, 1, 1);
    expect(result.mode).toBe('stacked'); // >= threshold
    expect(result.spaceInfo.remainingSpace).toBe(SPACE_THRESHOLD);
  });

  it('returns correct spaceInfo with all measurements', () => {
    const result = calculateDisplayMode(1920, 2, 3);

    expect(result.spaceInfo).toHaveProperty('windowWidth', 1920);
    expect(result.spaceInfo).toHaveProperty('leftWidth');
    expect(result.spaceInfo).toHaveProperty('rightWidth');
    expect(result.spaceInfo).toHaveProperty('gutterWidth');
    expect(result.spaceInfo).toHaveProperty('usedSpace');
    expect(result.spaceInfo).toHaveProperty('remainingSpace');
  });

  it('accepts custom threshold', () => {
    const customThreshold = 800;

    // 1920 - 1060 = 860, which is >= 800
    const result1 = calculateDisplayMode(1920, 1, 1, false, customThreshold);
    expect(result1.mode).toBe('stacked');

    // 1800 - 1060 = 740, which is < 800
    const result2 = calculateDisplayMode(1800, 1, 1, false, customThreshold);
    expect(result2.mode).toBe('cascade');
  });
});

describe('Real-world scenarios', () => {
  it('typical desktop monitor (1920x1080) with both panels should use stacked mode', () => {
    const result = calculateDisplayMode(1920, 1, 1);
    expect(result.mode).toBe('stacked');
  });

  it('laptop screen (1366x768) with both panels should use cascade mode', () => {
    const result = calculateDisplayMode(1366, 1, 1);
    expect(result.mode).toBe('cascade');
  });

  it('ultrawide monitor (2560x1440) with both panels should use stacked mode', () => {
    const result = calculateDisplayMode(2560, 1, 1);
    expect(result.mode).toBe('stacked');
  });

  it('tablet landscape (1024x768) with both panels should use cascade mode', () => {
    const result = calculateDisplayMode(1024, 1, 1);
    expect(result.mode).toBe('cascade');
  });

  it('4K monitor (3840x2160) with both panels should use stacked mode', () => {
    const result = calculateDisplayMode(3840, 1, 1);
    expect(result.mode).toBe('stacked');
  });
});
