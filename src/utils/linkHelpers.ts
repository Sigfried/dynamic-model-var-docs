/**
 * Link Helpers - Pure functions for working with element relationships and SVG links
 *
 * These utilities are thoroughly tested in src/test/linkLogic.test.ts
 */

import type { Relationship } from '../models/Element';

/**
 * Represents a link between two elements for SVG rendering
 */
export interface Link {
  source: { type: string; name: string };
  target: { type: string; name: string };
  relationship: Relationship;
}

/**
 * Filter options for controlling which links are displayed
 */
export interface LinkFilterOptions {
  /** Show inheritance relationships (is_a) */
  showInheritance?: boolean;
  /** Show property relationships (class attributes/slots) */
  showProperties?: boolean;
  /** Show only enum-typed properties */
  onlyEnums?: boolean;
  /** Show only class-typed properties */
  onlyClasses?: boolean;
  /** Include self-referential links (e.g., Specimen.parent_specimen → Specimen) */
  includeSelfRefs?: boolean;
  /** Set of element names that are currently visible (links to hidden elements are excluded) */
  visibleElements?: Set<string>;
}

/**
 * Filter relationships based on options
 *
 * @param relationships - Array of relationships to filter
 * @param options - Filter criteria
 * @returns Filtered relationships
 */
export function filterRelationships(
  relationships: Relationship[],
  options: LinkFilterOptions = {}
): Relationship[] {
  const {
    showInheritance = true,
    showProperties = true,
    onlyEnums = false,
    onlyClasses = false,
    includeSelfRefs = false,
    visibleElements,
  } = options;

  let filtered = relationships;

  // Filter by relationship type
  if (!showInheritance) {
    filtered = filtered.filter(r => r.type !== 'inherits');
  }
  if (!showProperties) {
    filtered = filtered.filter(r => r.type !== 'property');
  }

  // Filter by target type
  if (onlyEnums) {
    filtered = filtered.filter(r => r.targetType === 'enum');
  }
  if (onlyClasses) {
    filtered = filtered.filter(r => r.targetType === 'class');
  }

  // Filter self-referential
  if (!includeSelfRefs) {
    filtered = filtered.filter(r => !r.isSelfRef);
  }

  // Filter by visibility
  if (visibleElements) {
    filtered = filtered.filter(r => visibleElements.has(r.target));
  }

  return filtered;
}

/**
 * Build Link objects from an element's relationships
 *
 * @param sourceType - Type of the source element
 * @param sourceName - Name of the source element
 * @param relationships - Relationships from the source element
 * @param filterOptions - Optional filtering criteria
 * @returns Array of Link objects ready for rendering
 */
export function buildLinks(
  sourceType: string,
  sourceName: string,
  relationships: Relationship[],
  filterOptions?: LinkFilterOptions
): Link[] {
  const filtered = filterOptions
    ? filterRelationships(relationships, filterOptions)
    : relationships;

  return filtered.map(rel => ({
    source: { type: sourceType, name: sourceName },
    target: { type: rel.targetType, name: rel.target },
    relationship: rel,
  }));
}

/**
 * Calculate the center point of a bounding box
 *
 * @param rect - DOMRect from getBoundingClientRect()
 * @returns Object with x, y coordinates
 */
export function getRectCenter(rect: DOMRect): { x: number; y: number } {
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
}

/**
 * Calculate anchor points for link connections
 * Returns the best edge point (top, right, bottom, left) based on relative positions
 *
 * @param sourceRect - Source element bounding box
 * @param targetRect - Target element bounding box
 * @returns Source and target anchor points
 */
export function calculateAnchorPoints(
  sourceRect: DOMRect,
  targetRect: DOMRect
): {
  source: { x: number; y: number };
  target: { x: number; y: number };
} {
  const sourceCenter = getRectCenter(sourceRect);
  const targetCenter = getRectCenter(targetRect);

  // Calculate angle between centers
  const dx = targetCenter.x - sourceCenter.x;
  const dy = targetCenter.y - sourceCenter.y;
  const angle = Math.atan2(dy, dx);

  // Determine which edge of source rect to use
  const sourceEdge = getEdgePoint(sourceRect, angle);

  // Determine which edge of target rect to use (opposite direction)
  const targetAngle = angle + Math.PI;
  const targetEdge = getEdgePoint(targetRect, targetAngle);

  return {
    source: sourceEdge,
    target: targetEdge,
  };
}

/**
 * Get the point on the edge of a rectangle in the direction of the given angle
 *
 * @param rect - DOMRect
 * @param angle - Angle in radians
 * @returns Point on the edge
 */
function getEdgePoint(rect: DOMRect, angle: number): { x: number; y: number } {
  const center = getRectCenter(rect);
  const halfWidth = rect.width / 2;
  const halfHeight = rect.height / 2;

  // Normalize angle to [0, 2π)
  const normalizedAngle = ((angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

  // Determine which edge based on angle
  // Right edge: -π/4 to π/4
  // Bottom edge: π/4 to 3π/4
  // Left edge: 3π/4 to 5π/4
  // Top edge: 5π/4 to 7π/4

  if (normalizedAngle < Math.PI / 4 || normalizedAngle >= 7 * Math.PI / 4) {
    // Right edge
    return { x: center.x + halfWidth, y: center.y };
  } else if (normalizedAngle < 3 * Math.PI / 4) {
    // Bottom edge
    return { x: center.x, y: center.y + halfHeight };
  } else if (normalizedAngle < 5 * Math.PI / 4) {
    // Left edge
    return { x: center.x - halfWidth, y: center.y };
  } else {
    // Top edge
    return { x: center.x, y: center.y - halfHeight };
  }
}

/**
 * Generate SVG path string for a bezier curve between two points
 *
 * @param source - Source point
 * @param target - Target point
 * @param curvature - Curve intensity (0 = straight line, 1 = moderate curve)
 * @returns SVG path data string
 */
export function generateBezierPath(
  source: { x: number; y: number },
  target: { x: number; y: number },
  curvature: number = 0.3
): string {
  const dx = target.x - source.x;
  const dy = target.y - source.y;

  // Calculate control points for cubic bezier
  const controlOffset = Math.max(Math.abs(dx), Math.abs(dy)) * curvature;

  // Control point 1: offset from source
  const cp1x = source.x + controlOffset;
  const cp1y = source.y;

  // Control point 2: offset from target
  const cp2x = target.x - controlOffset;
  const cp2y = target.y;

  return `M ${source.x} ${source.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${target.x} ${target.y}`;
}

/**
 * Generate SVG path for self-referential links (looping curves)
 *
 * @param rect - Element bounding box
 * @returns SVG path data string
 */
export function generateSelfRefPath(rect: DOMRect): string {
  const center = getRectCenter(rect);
  const loopSize = 30; // Size of the loop

  // Create a loop that goes out from the right edge and loops back
  const startX = center.x + rect.width / 2;
  const startY = center.y;

  const cp1x = startX + loopSize;
  const cp1y = startY - loopSize;
  const cp2x = startX + loopSize;
  const cp2y = startY + loopSize;

  const endX = startX;
  const endY = startY;

  return `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`;
}

/**
 * Get color for link based on relationship type
 *
 * @param relationship - Relationship object
 * @returns CSS color string
 */
export function getLinkColor(relationship: Relationship): string {
  switch (relationship.type) {
    case 'inherits':
      return '#3b82f6'; // Blue for inheritance
    case 'property':
      if (relationship.targetType === 'enum') {
        return '#a855f7'; // Purple for enums
      }
      return '#10b981'; // Green for class references
    default:
      return '#6b7280'; // Gray for unknown
  }
}

/**
 * Get stroke width for link based on relationship type
 *
 * @param relationship - Relationship object
 * @returns Stroke width in pixels
 */
export function getLinkStrokeWidth(relationship: Relationship): number {
  switch (relationship.type) {
    case 'inherits':
      return 2; // Thicker for inheritance
    case 'property':
      return 1.5;
    default:
      return 1;
  }
}
