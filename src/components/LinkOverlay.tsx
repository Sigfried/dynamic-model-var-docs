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

import { useMemo, useRef, useState, useEffect } from 'react';
import type { DataService } from '../services/DataService';
import {
  generateSelfRefPath,
  getLinkColor,
  getLinkStrokeWidth,
  getLinkGradientId,
  type LinkFilterOptions
} from '../utils/linkHelpers';
import type { ItemHoverData } from './Section';
import {decontextualizeId} from '../utils/idContextualization';

/**
 * LinkTooltipData - Data for link hover tooltips
 */
export interface LinkTooltipData {
  relationshipType: string;       // "is_a", "property", etc.
  relationshipLabel?: string;      // Property name (for property relationships)
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
        return 'inherits from';
      case 'property':
        return data.relationshipLabel ? `property: ${data.relationshipLabel}` : 'property';
      default:
        return type;
    }
  };

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
        <span className="text-blue-300">{data.sourceName}</span>
        <span className="text-gray-400"> ({data.sourceType})</span>
      </div>
      <div className="text-gray-400 text-xs my-1">↓</div>
      <div className="text-gray-300">
        <span className="text-blue-300">{data.targetName}</span>
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
/*
 * ============================================================================
 * FUTURE REFACTOR: Simpler DOM-based link generation (post-demo)
 * ============================================================================
 *
 * PROBLEM WITH CURRENT APPROACH:
 * - Complex logic tracking which sections are in which physical panels
 * - Need to pass leftPhysicalPanel/rightPhysicalPanel props
 * - Error-prone when panel configurations change
 *
 * PROPOSED SIMPLER APPROACH:
 * Query DOM directly for visible items, get their relationships, find targets in DOM.
 * The DOM becomes the source of truth for what's visible and where.
 *
 * BENEFITS:
 * - Much simpler! No panel tracking needed
 * - Automatically works with any panel configuration
 * - Directly uses contextualized IDs from DOM
 *
 * REQUIREMENTS FOR THIS APPROACH:
 * 1. Add 'item' class to all displayed items in Section.tsx:
 *    <div id="mp-associated_participant" class="item flex items-center ..." ...>
 *
 * 2. Use DataService.getRelationshipsNew() (already implemented, works great!)
 *    - Returns EdgeInfo with proper target IDs
 *    - Issue: Uses *Proposal types (EdgeInfoProposal, etc.)
 *    - Blocked by: Want to rename Proposal types to main types, but that
 *      requires merging Element/ElementPreRefactor which is too risky for demo
 *
 * 3. Fix querySelectorAll selector:
 *    - Current: `[id$="${id}"]` matches any ID ending with target
 *    - Problem: "participant" matches "associated_participant"
 *    - Better: `[id="lp-${id}"], [id="mp-${id}"], [id="rp-${id}"]`
 *
 * IMPLEMENTATION SKETCH (incomplete, needs work):
 */
/*
import type { Relationship } from '../models/Element';
import type {
  LinkPair,
  RelationshipData as RelationshipDataNew
} from '../models/Element';
import { decontextualizeId } from '../utils/idContextualization';

interface getIdPairsForLinksProps {
  dataService?: DataService | null;
}
function getIdPairsForLinks({dataService}: getIdPairsForLinksProps): [string, string][] {
  if (!dataService) return []
  const idPairs = new Map<string, [string, string]>();
  const items = document.getElementsByClassName('item')

  for (const item of items) {
    const dcItemId = decontextualizeId(item.id)  // lp-Specimen → Specimen

    // TODO: Use getRelationshipsNew() once types are renamed
    // const relationships = dataService.getRelationshipsNew(dcItemId) || [];
    const linkedItemDcIds = relationships.map((rel) => rel.targetId) // Get target IDs

    for (const targetId of linkedItemDcIds) {
      // Find target in DOM (check all possible contexts)
      const selector = `[id="lp-${targetId}"], [id="mp-${targetId}"], [id="rp-${targetId}"]`;
      const linkedItems = document.querySelectorAll(selector)

      for (const linkedItem of linkedItems) {
        // Store pair: [sourceContextualizedId, targetContextualizedId]
        idPairs.set(`${item.id}→${linkedItem.id}`, [item.id, linkedItem.id]);
      }
    }
  }

  return Array.from(idPairs.values());
}

function LinkOverlayProposal({idPairs}: {idPairs: [string, string][]}) {
  // Render SVG links using the contextualized ID pairs
  // Much simpler than current approach!
}
*/
/*
 * END FUTURE REFACTOR
 * ============================================================================
 */

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

  // Build links from visible items in DOM - use useMemo to prevent infinite loop
  const linkPairs = useMemo(() => {
    if (!dataService) return [];

    // Query DOM for all visible items with class 'item'
    const items = document.querySelectorAll('.item');
    const pairs = new Map<string, [string, string]>();

    items.forEach(item => {
      const contextualizedId = item.id; // e.g., "lp-Specimen"
      const elementName = decontextualizeId(contextualizedId); // e.g., "Specimen"

      // Get the panel this item is in
      const sourcePanel = item.getAttribute('data-panel-position');

      // Get relationships for this item
      const relationships = dataService.getRelationshipsForLinking(elementName);
      if (!relationships) return;

      // For each relationship target, find it in the DOM
      relationships.forEach(rel => {
        const targetName = rel.target;

        // Try to find target in DOM with any context prefix
        const targetSelector = `[id="lp-${targetName}"], [id="mp-${targetName}"], [id="rp-${targetName}"]`;
        const targetElement = document.querySelector(targetSelector);

        if (targetElement) {
          const targetPanel = targetElement.getAttribute('data-panel-position');

          // Only draw cross-panel links (not same-panel links)
          // Exception: allow self-referential links
          if (sourcePanel === targetPanel && contextualizedId !== targetElement.id) {
            return; // Skip same-panel non-self-ref links
          }

          // In 3-panel mode, only draw links between adjacent panels
          // Skip left→right links (they should go through middle)
          if (sourcePanel === 'left' && targetPanel === 'right') {
            return; // Skip non-adjacent panel links
          }
          if (sourcePanel === 'right' && targetPanel === 'left') {
            return; // Skip non-adjacent panel links
          }

          // Store pair: [sourceContextualizedId, targetContextualizedId]
          const pairKey = `${contextualizedId}→${targetElement.id}`;
          pairs.set(pairKey, [contextualizedId, targetElement.id]);
        }
      });
    });

    return Array.from(pairs.values());
  }, [dataService, leftSections, rightSections]);

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

    // Render each link pair
    linkPairs.forEach(([sourceId, targetId], index) => {
      // Find items in DOM using contextualized IDs (already have the correct prefixes)
      const sourceItem = document.getElementById(sourceId);
      const targetItem = document.getElementById(targetId);

      // Skip if either item not found in DOM
      if (!sourceItem || !targetItem) {
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
        const adjustedRect = {
          ...sourceRect,
          left: sourceRect.left - svgRect.left,
          right: sourceRect.right - svgRect.left,
          top: sourceRect.top - svgRect.top,
          bottom: sourceRect.bottom - svgRect.top,
          x: sourceRect.x - svgRect.left,
          y: sourceRect.y - svgRect.top
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
