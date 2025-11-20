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
  buildLinks,
  generateSelfRefPath,
  getLinkColor,
  getLinkStrokeWidth,
  getLinkGradientId,
  type Link,
  type LinkFilterOptions
} from '../utils/linkHelpers';
import type { ItemHoverData } from './Section';
import { contextualizeId } from '../utils/idContextualization';

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
  /** Section IDs visible in left panel (from LinkOverlay's perspective) */
  leftSections: string[];
  /** Section IDs visible in right panel (from LinkOverlay's perspective) */
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
  filterOptions = {},
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

  // Build links from visible items - use useMemo to prevent infinite loop
  const { leftPanelLinks, rightPanelLinks } = useMemo(() => {
    if (!dataService) return { leftPanelLinks: [], rightPanelLinks: [] };

    // Build set of item names in each panel for cross-panel filtering
    const leftItems = new Set<string>();
    const rightItems = new Set<string>();

    // Get all item IDs for each panel section
    leftSections.forEach(sectionId => {
      // @ts-expect-error TEMPORARY: string vs ElementTypeId - will be removed in Step 7 (Link Overlay Refactor)
      // TODO: See TASKS.md Step 7 - refactor to use ds.getLinkData(leftItemIds, rightItemIds)
      const itemIds = dataService.getItemNamesForType(sectionId); // Returns IDs (name === id currently)
      itemIds.forEach(id => leftItems.add(id));
    });

    rightSections.forEach(sectionId => {
      // @ts-expect-error TEMPORARY: string vs ElementTypeId - will be removed in Step 7 (Link Overlay Refactor)
      // TODO: See TASKS.md Step 7 - refactor to use ds.getLinkData(leftItemIds, rightItemIds)
      const itemIds = dataService.getItemNamesForType(sectionId); // Returns IDs (name === id currently)
      itemIds.forEach(id => rightItems.add(id));
    });

    const leftLinks: Link[] = [];
    const rightLinks: Link[] = [];

    // Helper to process items from a panel
    const processItems = (
      sections: string[],
      sourcePanel: Set<string>,
      targetPanel: Set<string>,
      linksArray: Link[],
      options: typeof filterOptions = filterOptions
    ) => {
      sections.forEach(sectionId => {
        // @ts-expect-error TEMPORARY: string vs ElementTypeId - will be removed in Step 7 (Link Overlay Refactor)
        // TODO: See TASKS.md Step 7 - refactor to use ds.getLinkData(leftItemIds, rightItemIds)
        const itemIds = dataService.getItemNamesForType(sectionId); // Returns IDs (name === id currently)
        itemIds.forEach(itemId => {
          const relationships = dataService.getRelationshipsForLinking(itemId);
          if (!relationships) return;

          const links = buildLinks(sectionId, itemId, relationships, {
            ...options,
            ...(sectionId === 'class' ? { showInheritance: false } : {}) // Disable inheritance for classes
          });

          // Only keep cross-panel links (target in target panel AND not in source panel) or self-refs
          const crossPanelLinks = links.filter(link =>
            link.relationship.isSelfRef ||
            (targetPanel.has(link.target.id) && !sourcePanel.has(link.target.id))
          );
          linksArray.push(...crossPanelLinks);
        });
      });
    };

    // Process left panel (all cross-panel relationships)
    processItems(leftSections, leftItems, rightItems, leftLinks);

    // Process right panel (all relationships EXCEPT class→class cross-panel)
    // Class→class is bidirectional in the schema, so we only draw left→right
    // All other relationship types (class→enum, class→slot, variable→class, slot→enum) are one-way
    rightSections.forEach(sectionId => {
      // @ts-expect-error TEMPORARY: string vs ElementTypeId - will be removed in Step 7 (Link Overlay Refactor)
      // TODO: See TASKS.md Step 7 - refactor to use ds.getLinkData(leftItemIds, rightItemIds)
      const itemIds = dataService.getItemNamesForType(sectionId); // Returns IDs (name === id currently)
      itemIds.forEach(itemId => {
        const relationships = dataService.getRelationshipsForLinking(itemId);
        if (!relationships) return;

        const links = buildLinks(sectionId, itemId, relationships, {
          ...filterOptions,
          ...(sectionId === 'class' ? { showInheritance: false } : {})
        });

        // Special handling for class→class to avoid bidirectional duplicates
        const filteredLinks = links.filter(link => {
          if (link.relationship.isSelfRef) return true; // Always keep self-refs

          // Must be cross-panel: target in left panel AND not in right panel
          if (!leftItems.has(link.target.id) || rightItems.has(link.target.id)) return false;

          // For class→class links, filter out to avoid bidirectional duplicates
          if (sectionId === 'class' && link.target.type === 'class') {
            return false;
          }

          return true; // Keep all other cross-panel links
        });

        rightLinks.push(...filteredLinks);
      });
    });

    return { leftPanelLinks: leftLinks, rightPanelLinks: rightLinks };
  }, [leftSections, rightSections, dataService, filterOptions]);

  // Helper to find item in DOM using contextualized ID
  // Try all possible panel positions since items may be in left, middle, or right panels physically
  const findItem = (itemName: string): HTMLElement | null => {
    const contexts = ['left-panel', 'middle-panel', 'right-panel'];

    for (const context of contexts) {
      const domId = contextualizeId({ id: itemName, context });
      const element = document.getElementById(domId);
      if (element) return element;
    }

    return null;
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

    // Helper to render links from a specific logical panel (left or right from LinkOverlay's perspective)
    const renderLinksFromPanel = (links: Link[], logicalSourcePanel: 'left' | 'right') => {
      return links.map((link, index) => {
        // Find items in DOM using contextualized IDs
        const sourceItem = findItem(link.source.id);
        const targetItem = findItem(link.target.id);

        // Skip if either item not found in DOM
        if (!sourceItem || !targetItem) {
          return null;
        }

        const sourceRect = sourceItem.getBoundingClientRect();
        const targetRect = targetItem.getBoundingClientRect();

        // Determine link direction for gradient selection
        const isLeftToRight = sourceRect.left < targetRect.left;

        // Generate path - adjust coordinates to be relative to SVG origin
        let pathData: string;
        if (link.relationship.isSelfRef) {
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
        let color = getLinkColor(link.relationship, link.source.type);
        // If gradient and going right-to-left, use reverse gradient
        if (color.startsWith('url(#') && !isLeftToRight) {
          color = color.replace(')', '-reverse)');
        }
        const strokeWidth = getLinkStrokeWidth(link.relationship);

        // Generate unique key for this link
        const linkKey = `${logicalSourcePanel}-${link.source.type}-${link.source.id}-${link.target.type}-${link.target.id}-${index}`;

        // Check if link should be highlighted (either direct hover or item hover match)
        const matchesHoveredItem = !!hoveredItem && (
          (link.source.type === hoveredItem.type && link.source.id === hoveredItem.id) ||
          (link.target.type === hoveredItem.type && link.target.id === hoveredItem.id)
        );
        const isHovered = hoveredLinkKey === linkKey || matchesHoveredItem;

        const markerId = getMarkerIdForTargetType(link.target.type, isHovered);

        // Don't add arrows to self-referential links (they look weird on loops)
        const markerEnd = link.relationship.isSelfRef ? undefined : `url(#${markerId})`;

        return (
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
                    relationshipType: link.relationship.type,
                    relationshipLabel: link.relationship.label,
                    sourceName: link.source.id, // ID used as display name (id === name currently)
                    sourceType: link.source.type,
                    targetName: link.target.id, // ID used as display name (id === name currently)
                    targetType: link.target.type
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
    };

    allRenderedLinks.push(...renderLinksFromPanel(leftPanelLinks, 'left'));
    allRenderedLinks.push(...renderLinksFromPanel(rightPanelLinks, 'right'));

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
