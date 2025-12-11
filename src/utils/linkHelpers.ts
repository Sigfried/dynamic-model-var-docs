/**
 * Link Helpers - Pure functions for SVG link geometry calculations
 */

/**
 * Calculate the center point of a bounding box
 */
function getRectCenter(rect: DOMRect): { x: number; y: number } {
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
}

/**
 * Generate SVG path for self-referential links (looping curves)
 */
export function generateSelfRefPath(rect: DOMRect): string {
  const center = getRectCenter(rect);
  const loopSize = 30;

  const startX = center.x + rect.width / 2;
  const startY = center.y;

  const cp1x = startX + loopSize;
  const cp1y = startY - loopSize;
  const cp2x = startX + loopSize;
  const cp2y = startY + loopSize;

  return `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${startX} ${startY}`;
}

/**
 * Get gradient ID for a link based on source and target types
 */
export function getLinkGradientId(sourceType: string, targetType: string): string {
  return `gradient-${sourceType}-${targetType}`;
}
