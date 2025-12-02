/**
 * LinkOverlay - SVG layer for rendering links between items
 *
 * This component:
 * - Queries DOM for visible item positions via data attributes
 * - Gets relationships from DataService
 * - Uses linkHelpers to filter and render SVG paths
 *
 * Architecture: Uses DataService - maintains view/model separation!
 * UI layer uses "item" terminology
 */

import { useRef, useState, useEffect } from 'react';
// TODO: Uncomment when migrating to EdgeInfo (see TASKS.md Phase 2 Step 3)
// import type { EdgeInfo } from '../contracts/ComponentData';
import type { DataService } from '../services/DataService';
import {
  generateSelfRefPath,
  getLinkColor,
  getLinkStrokeWidth,
  getLinkGradientId,
  type LinkFilterOptions
} from '../utils/linkHelpers';
import type { ItemHoverData } from './Section';
import { decontextualizeId } from '../utils/idContextualization';
import { getElementLinkTooltipColor, type ElementTypeId } from '../config/appConfig';
import { EDGE_TYPES, getEdgeTypesForLinks } from '../models/SchemaTypes';

/**
 * LinkTooltipData - Data for link hover tooltips
 */
export interface LinkTooltipData {
  relationshipType: string;       // "inheritance", "slot", "maps_to", etc.
  relationshipLabel?: string;      // Slot name (for slot relationships)
  sourceName: string;
  sourceType: string;              // "class", "enum", etc.
  targetName: string;
  targetType: string;
}

/**
 * LinkTooltip - Displays relationship information on link hover
 */
function LinkTooltip({ data, x, y }: { data: LinkTooltipData; x: number; y: number }) {
  const formatRelationshipType = (type: string): string => {
    switch (type) {
      case 'inherits':
      case EDGE_TYPES.INHERITANCE:
        return 'inherits from';
      case EDGE_TYPES.CLASS_RANGE:
      case EDGE_TYPES.CLASS_SLOT:
      case EDGE_TYPES.SLOT_RANGE:
        return data.relationshipLabel ? `slot: ${data.relationshipLabel}` : 'slot';
      case EDGE_TYPES.MAPS_TO:
        return 'maps to';
      default:
        return type;
    }
  };

  // Get element-type-specific colors
  const sourceColor = getElementLinkTooltipColor(data.sourceType as ElementTypeId);
  const targetColor = getElementLinkTooltipColor(data.targetType as ElementTypeId);

  return (
    <div
      className="absolute bg-gray-900 text-white text-sm px-3 py-2 rounded shadow-lg pointer-events-none z-50"
      style={{
        left: x + 10,
        top: y + 10,
        maxWidth: '300px'
      }}
    >
      <div className="font-semibold mb-1">{formatRelationshipType(data.relationshipType)}</div>
      <div className="text-gray-300">
        <span className={sourceColor}>{data.sourceName}</span>
        <span className="text-gray-400"> ({data.sourceType})</span>
      </div>
      <div className="text-gray-400 text-xs my-1">↓</div>
      <div className="text-gray-300">
        <span className={targetColor}>{data.targetName}</span>
        <span className="text-gray-400"> ({data.targetType})</span>
      </div>
    </div>
  );
}

export interface LinkOverlayProps {
  /** Section IDs visible - used to trigger re-computation when panels change */
  leftSections: string[];
  rightSections: string[];
  /** Data service for fetching item relationships */
  dataService: DataService | null;
  /** Filter options for controlling which links to show */
  filterOptions?: LinkFilterOptions;
  /** Currently hovered item for link highlighting */
  hoveredItem?: ItemHoverData | null;
}

export default function LinkOverlay({
  leftSections,
  rightSections,
  dataService,
  hoveredItem
}: LinkOverlayProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [, setScrollTick] = useState(0);
  const [hoveredLinkKey, setHoveredLinkKey] = useState<string | null>(null);
  const [tooltipData, setTooltipData] = useState<{ data: LinkTooltipData; x: number; y: number } | null>(null);
  const hoverTimeoutRef = useRef<number | null>(null);

  // Add scroll listener to update link positions
  useEffect(() => {
    const handleScroll = () => {
      setScrollTick(tick => tick + 1);
    };

    // Listen for expansion state changes (when sections expand/collapse)
    const handleExpansionChange = () => {
      // Use requestAnimationFrame to wait for DOM to update
      requestAnimationFrame(() => {
        setScrollTick(tick => tick + 1);
      });
    };

    // Listen for scroll events on the window
    window.addEventListener('scroll', handleScroll, true); // Use capture to catch all scrolls
    window.addEventListener('expansionStateChanged', handleExpansionChange);

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('expansionStateChanged', handleExpansionChange);
    };
  }, []);

  // Force redraw when panel data changes (after DOM updates)
  useEffect(() => {
    // Use requestAnimationFrame to wait for DOM to be committed
    const frameId = requestAnimationFrame(() => {
      setScrollTick(tick => tick + 1);
    });

    return () => cancelAnimationFrame(frameId);
  }, [leftSections, rightSections, dataService]);

  // Build link pairs from visible items in DOM
  const buildLinkPairs = (): [string, string][] => {
    if (!dataService) return [];

    const middlePanelVisible = document.querySelector('[data-panel-position="middle"]') !== null;
    const edgeTypes = getEdgeTypesForLinks(middlePanelVisible);
    const itemEls = document.querySelectorAll('.item');
    const pairs = new Map<string, [string, string]>();

    itemEls.forEach(itemEl => {
      const contextualizedId = itemEl.id;
      const itemId = decontextualizeId(contextualizedId);
      const sourcePanel = itemEl.getAttribute('data-panel-position');

      // Get edges filtered by panel mode (CLASS_RANGE for 2-panel, CLASS_SLOT+SLOT_RANGE for 3-panel)
      const edges = dataService.getEdgesForItem(itemId, edgeTypes);

      for (const edge of edges) {
        // Only process edges where this item is the source (edges go left→right)
        if (edge.sourceItem.id !== itemId) continue;

        const targetId = edge.targetItem.id;
        const selector = `[id="lp-${targetId}"], [id="mp-${targetId}"], [id="rp-${targetId}"]`;
        const targetEl = document.querySelector(selector);
        if (!targetEl) continue;

        const targetPanel = targetEl.getAttribute('data-panel-position');
        const isSelfRef = contextualizedId === targetEl.id;

        // Skip same-panel links (unless self-ref)
        if (sourcePanel === targetPanel && !isSelfRef) continue;

        const pairKey = `${contextualizedId}→${targetEl.id}`;
        pairs.set(pairKey, [contextualizedId, targetEl.id]);
      }
    });

    return Array.from(pairs.values());
  };

  // Calculate anchor points for cross-panel links based on actual positions
  const calculateCrossPanelAnchors = (
    sourceRect: DOMRect,
    targetRect: DOMRect
  ): { source: { x: number; y: number }; target: { x: number; y: number } } => {
    // Determine direction based on actual DOM positions
    const sourceIsLeft = sourceRect.left < targetRect.left;

    if (sourceIsLeft) {
      // Source is to the left of target: connect from right edge to left edge
      return {
        source: { x: sourceRect.right, y: sourceRect.top + sourceRect.height / 2 },
        target: { x: targetRect.left, y: targetRect.top + targetRect.height / 2 }
      };
    } else {
      // Source is to the right of target: connect from left edge to right edge
      return {
        source: { x: sourceRect.left, y: sourceRect.top + sourceRect.height / 2 },
        target: { x: targetRect.right, y: targetRect.top + targetRect.height / 2 }
      };
    }
  };

  // Generate bezier path with correct curve direction
  const generateDirectionalBezierPath = (
    source: { x: number; y: number },
    target: { x: number; y: number },
    curvature: number = 0.25
  ): string => {
    const dx = target.x - source.x;
    const dy = target.y - source.y;

    // Use horizontal distance for control offset, limit influence of vertical distance
    const horizontalOffset = Math.abs(dx) * curvature;
    const verticalInfluence = Math.min(Math.abs(dy) * 0.1, 50); // Cap vertical influence at 50px
    const controlOffset = horizontalOffset + verticalInfluence;

    // Determine direction and adjust control points accordingly
    if (dx > 0) {
      // Left to right: curve forward
      const cp1x = source.x + controlOffset;
      const cp1y = source.y;
      const cp2x = target.x - controlOffset;
      const cp2y = target.y;
      return `M ${source.x} ${source.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${target.x} ${target.y}`;
    } else {
      // Right to left: curve backward (mirror the control points)
      const cp1x = source.x - controlOffset;
      const cp1y = source.y;
      const cp2x = target.x + controlOffset;
      const cp2y = target.y;
      return `M ${source.x} ${source.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${target.x} ${target.y}`;
    }
  };

  // Helper to get marker ID based on target item type and hover state
  const getMarkerIdForTargetType = (targetType: string, isHovered: boolean = false): string => {
    const suffix = isHovered ? '-hover' : '';
    switch (targetType) {
      case 'class':
        return `arrow-blue${suffix}`;   // Blue for class targets
      case 'enum':
        return `arrow-purple${suffix}`; // Purple for enum targets
      case 'slot':
        return `arrow-green${suffix}`;  // Green for slot targets
      case 'variable':
        return `arrow-orange${suffix}`; // Orange for variable targets
      default:
        return `arrow-gray${suffix}`;
    }
  };

  // Render links as SVG paths
  const renderLinks = () => {
    const allRenderedLinks: (React.JSX.Element | null)[] = [];

    // Get SVG position for coordinate adjustment
    const svgRect = svgRef.current?.getBoundingClientRect();
    if (!svgRect) return allRenderedLinks;

    // Skip if no dataService
    if (!dataService) return allRenderedLinks;

    // Build link pairs fresh from current DOM state
    const linkPairs = buildLinkPairs();

    // Render each link pair
    linkPairs.forEach(([sourceId, targetId], index) => {
      // Find items in DOM using contextualized IDs (already have the correct prefixes)
      const sourceItem = document.getElementById(sourceId);
      const targetItem = document.getElementById(targetId);

      // Skip if either item not found in DOM
      if (!sourceItem || !targetItem) {
        console.error("this should not happen")
        return;
      }

      // Get element names for relationship lookup
      const sourceName = decontextualizeId(sourceId);
      const targetName = decontextualizeId(targetId);

      // Get relationship info for this pair
      const relationships = dataService.getRelationshipsForLinking(sourceName);
      if (!relationships || relationships.length === 0) return;

      const relationship = relationships.find(r => r.target === targetName);
      if (!relationship) return;

      const sourceRect = sourceItem.getBoundingClientRect();
      const targetRect = targetItem.getBoundingClientRect();

      // Determine link direction for gradient selection
      const isLeftToRight = sourceRect.left < targetRect.left;

      // Determine source type from panel position or relationship type
      // In middle panel = slot, otherwise determine from relationship
      const sourceType = sourceItem.getAttribute('data-panel-position') === 'middle' ? 'slot' :
        relationship.type.includes('slot') || relationship.label?.includes('slot') ? 'class' : 'class';
      const targetType = relationship.targetSection;

      // Check if self-referential (source and target are same element)
      const isSelfRef = sourceId === targetId;

      // Generate path - adjust coordinates to be relative to SVG origin
      let pathData: string;
      if (isSelfRef) {
        // Create adjusted DOMRect for self-ref path
        // Explicitly include width/height since DOMRect getters don't spread properly
        const adjustedRect = {
          left: sourceRect.left - svgRect.left,
          right: sourceRect.right - svgRect.left,
          top: sourceRect.top - svgRect.top,
          bottom: sourceRect.bottom - svgRect.top,
          x: sourceRect.x - svgRect.left,
          y: sourceRect.y - svgRect.top,
          width: sourceRect.width,
          height: sourceRect.height
        } as DOMRect;
        pathData = generateSelfRefPath(adjustedRect);
      } else {
        // Use cross-panel anchor calculation based on actual DOM positions
        const { source, target } = calculateCrossPanelAnchors(sourceRect, targetRect);

        // Adjust coordinates to be relative to SVG origin
        const adjustedSource = { x: source.x - svgRect.left, y: source.y - svgRect.top };
        const adjustedTarget = { x: target.x - svgRect.left, y: target.y - svgRect.top };

        pathData = generateDirectionalBezierPath(adjustedSource, adjustedTarget);
      }

      // Get gradient with correct direction
      let color = getLinkColor(relationship, sourceType);
      // If gradient and going right-to-left, use reverse gradient
      if (color.startsWith('url(#') && !isLeftToRight) {
        color = color.replace(')', '-reverse)');
      }
      const strokeWidth = getLinkStrokeWidth(relationship);

      // Generate unique key for this link
      const linkKey = `${sourceId}-${targetId}-${index}`;

      // Check if link should be highlighted (either direct hover or item hover match)
      const matchesHoveredItem = !!hoveredItem && (
        (sourceId === hoveredItem.id) ||
        (targetId === hoveredItem.id)
      );
      const isHovered = hoveredLinkKey === linkKey || matchesHoveredItem;

      const markerId = getMarkerIdForTargetType(targetType, isHovered);

      // Don't add arrows to self-referential links (they look weird on loops)
      const markerEnd = isSelfRef ? undefined : `url(#${markerId})`;

      allRenderedLinks.push(
        <path
          key={linkKey}
          d={pathData}
          fill="none"
          stroke={color}
          markerEnd={markerEnd}
          opacity={isHovered ? 1.0 : 0.2}
          strokeWidth={isHovered ? 3 : strokeWidth}
          className="transition-all cursor-pointer"
          style={{ pointerEvents: 'stroke' }}
          onMouseEnter={(e: React.MouseEvent) => {
            setHoveredLinkKey(linkKey);
            // Show tooltip after brief delay
            if (hoverTimeoutRef.current) {
              clearTimeout(hoverTimeoutRef.current);
            }
            hoverTimeoutRef.current = window.setTimeout(() => {
              setTooltipData({
                data: {
                  relationshipType: relationship.type,
                  relationshipLabel: relationship.label,
                  sourceName: sourceName,
                  sourceType: sourceType,
                  targetName: targetName,
                  targetType: targetType
                },
                x: e.clientX,
                y: e.clientY
              });
            }, 300);
          }}
          onMouseLeave={() => {
            setHoveredLinkKey(null);
            setTooltipData(null);
            // Clear timeout when mouse leaves
            if (hoverTimeoutRef.current) {
              clearTimeout(hoverTimeoutRef.current);
              hoverTimeoutRef.current = null;
            }
          }}
        />
      );
    });

    return allRenderedLinks;
  };

  return (
    <>
      <svg
        ref={svgRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          width: '100%',
          height: '100%',
          zIndex: 1
        }}
      >
        {/* Gradient and marker definitions */}
        <defs>
        {/* Gradients for all source→target combinations */}
        {/* Create both left-to-right and right-to-left versions */}
        {(() => {
          const createGradient = (sourceType: string, targetType: string, reverse = false) => {
            const id = reverse ? `${getLinkGradientId(sourceType, targetType)}-reverse` : getLinkGradientId(sourceType, targetType);
            const [x1, x2] = reverse ? ["100%", "0%"] : ["0%", "100%"];

            return (
              <linearGradient
                key={reverse ? `${sourceType}-${targetType}-reverse` : `${sourceType}-${targetType}`}
                id={id}
                x1={x1} y1="0%" x2={x2} y2="0%"
              >
                <stop offset="0%" stopColor={dataService!.getColorForItemType(sourceType)} stopOpacity="0.5" />
                <stop offset="100%" stopColor={dataService!.getColorForItemType(targetType)} stopOpacity="0.5" />
              </linearGradient>
            );
          };

          // Get all available item types from DataService
          const allTypes = dataService?.getAvailableItemTypes() || [];
          return allTypes.flatMap(sourceType =>
            allTypes.flatMap(targetType => [
              createGradient(sourceType, targetType, false),
              createGradient(sourceType, targetType, true)
            ])
          );
        })()}

        {/* Arrow markers - one for each target item type */}
        {(() => {
          const markerConfigs = [
            { id: 'blue', color: '#3b82f6' },
            { id: 'purple', color: '#a855f7' },
            { id: 'green', color: '#10b981' },
            { id: 'orange', color: '#f97316' },
            { id: 'gray', color: '#6b7280' }
          ];

          const createMarker = (id: string, color: string, hover = false) => {
            const markerId = hover ? `arrow-${id}-hover` : `arrow-${id}`;
            const markerSize = hover ? 7 : 6;
            const fillOpacity = hover ? undefined : 0.3;

            return (
              <marker
                key={markerId}
                id={markerId}
                viewBox="0 0 10 10"
                refX="0"
                refY="5"
                markerWidth={markerSize}
                markerHeight={markerSize}
                orient="auto"
                markerUnits="userSpaceOnUse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill={color} fillOpacity={fillOpacity} />
              </marker>
            );
          };

          return markerConfigs.flatMap(({ id, color }) => [
            createMarker(id, color, false),
            createMarker(id, color, true)
          ]);
        })()}
      </defs>
      {renderLinks()}
    </svg>
      {tooltipData && <LinkTooltip data={tooltipData.data} x={tooltipData.x} y={tooltipData.y} />}
    </>
  );
}
