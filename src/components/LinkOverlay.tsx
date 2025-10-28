/**
 * LinkOverlay - SVG layer for rendering links between elements
 *
 * This component:
 * - Queries DOM for visible element positions via data attributes
 * - Builds Element instances and extracts relationships
 * - Uses linkHelpers to filter and render SVG paths
 */

import { useMemo, useRef, useState, useEffect } from 'react';
import type { ClassNode, EnumDefinition, SlotDefinition, VariableSpec } from '../types';
import { ClassElement, EnumElement, SlotElement, VariableElement, type ElementCollection } from '../models/Element';
import { getAllElementTypeIds, type ElementTypeId } from '../models/ElementRegistry';
import {
  buildLinks,
  generateSelfRefPath,
  getLinkColor,
  getLinkStrokeWidth,
  getElementTypeColor,
  getLinkGradientId,
  type Link,
  type LinkFilterOptions
} from '../utils/linkHelpers';

export interface LinkOverlayProps {
  /** Elements visible in left panel (filtered collections) */
  leftPanel: Map<ElementTypeId, ElementCollection>;
  /** Elements visible in right panel (filtered collections) */
  rightPanel: Map<ElementTypeId, ElementCollection>;
  /** Filter options for controlling which links to show */
  filterOptions?: LinkFilterOptions;
  /** Currently hovered element for link highlighting */
  hoveredElement?: { type: ElementTypeId; name: string } | null;
  /** All slots from model (needed for ClassElement constructor) */
  allSlots?: Map<string, SlotDefinition>;
}

export default function LinkOverlay({
  leftPanel,
  rightPanel,
  filterOptions = {},
  hoveredElement,
  allSlots = new Map()
}: LinkOverlayProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [, setScrollTick] = useState(0);
  const [hoveredLinkKey, setHoveredLinkKey] = useState<string | null>(null);
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
  }, [leftPanel, rightPanel]);

  // Build links from visible elements - use useMemo to prevent infinite loop
  const { leftPanelLinks, rightPanelLinks } = useMemo(() => {
    // Helper to get element name (handles variable's variableLabel)
    const getElementName = (element: ClassNode | EnumDefinition | SlotDefinition | VariableSpec, type: ElementTypeId): string => {
      if (type === 'variable') {
        return (element as VariableSpec).variableLabel;
      }
      return (element as ClassNode | EnumDefinition | SlotDefinition).name;
    };

    // Build set of element names in each panel for cross-panel filtering
    const leftElements = new Set<string>();
    const rightElements = new Set<string>();

    // Generic iteration over collections
    leftPanel.forEach((collection, typeId) => {
      collection.getAllElements().forEach(element => {
        leftElements.add(getElementName(element, typeId));
      });
    });

    rightPanel.forEach((collection, typeId) => {
      collection.getAllElements().forEach(element => {
        rightElements.add(getElementName(element, typeId));
      });
    });

    const leftLinks: Link[] = [];
    const rightLinks: Link[] = [];

    // Helper to create Element instance based on type
    const createElement = (elementData: ClassNode | EnumDefinition | SlotDefinition | VariableSpec, type: ElementTypeId) => {
      switch (type) {
        case 'class':
          return new ClassElement(elementData as ClassNode, allSlots);
        case 'enum':
          return new EnumElement(elementData as EnumDefinition);
        case 'slot':
          return new SlotElement(elementData as SlotDefinition);
        case 'variable':
          return new VariableElement(elementData as VariableSpec);
      }
    };

    // Helper to process elements from a panel (generic over collections)
    const processElements = (
      collections: Map<ElementTypeId, ElementCollection>,
      targetPanel: Set<string>,
      linksArray: Link[],
      options: typeof filterOptions = filterOptions
    ) => {
      collections.forEach((collection, typeId) => {
        collection.getAllElements().forEach(elementData => {
          const element = createElement(elementData, typeId);
          const relationships = element.getRelationships();
          const elementName = getElementName(elementData, typeId);

          const links = buildLinks(typeId, elementName, relationships, {
            ...options,
            ...(typeId === 'class' ? { showInheritance: false } : {}) // Disable inheritance for classes
          });

          // Only keep cross-panel links (or self-refs)
          const crossPanelLinks = links.filter(link =>
            link.relationship.isSelfRef || targetPanel.has(link.target.name)
          );
          linksArray.push(...crossPanelLinks);
        });
      });
    };

    // Process left panel (all cross-panel relationships)
    processElements(leftPanel, rightElements, leftLinks);

    // Process right panel (all relationships EXCEPT class→class cross-panel)
    // Class→class is bidirectional in the schema, so we only draw left→right
    // All other relationship types (class→enum, class→slot, variable→class, slot→enum) are one-way
    rightPanel.forEach((collection, typeId) => {
      collection.getAllElements().forEach(elementData => {
        const element = createElement(elementData, typeId);
        const relationships = element.getRelationships();
        const elementName = getElementName(elementData, typeId);

        const links = buildLinks(typeId, elementName, relationships, {
          ...filterOptions,
          ...(typeId === 'class' ? { showInheritance: false } : {})
        });

        // Special handling for class→class to avoid bidirectional duplicates
        const filteredLinks = links.filter(link => {
          if (link.relationship.isSelfRef) return true; // Always keep self-refs
          if (!leftElements.has(link.target.name)) return false; // Not cross-panel

          // For class→class links, filter out to avoid bidirectional duplicates
          if (typeId === 'class' && link.target.type === 'class') {
            return false;
          }

          return true; // Keep all other cross-panel links
        });

        rightLinks.push(...filteredLinks);
      });
    });

    return { leftPanelLinks: leftLinks, rightPanelLinks: rightLinks };
  }, [leftPanel, rightPanel, filterOptions, allSlots]);

  // Helper to find element in DOM with panel position
  const findElement = (type: string, name: string, panelPosition: 'left' | 'right'): HTMLElement | null => {
    return document.querySelector(`[data-element-type="${type}"][data-element-name="${name}"][data-panel-position="${panelPosition}"]`);
  };

  // Calculate anchor points for cross-panel links (simplified for left-right layout)
  const calculateCrossPanelAnchors = (
    sourceRect: DOMRect,
    targetRect: DOMRect,
    sourcePanel: 'left' | 'right'
  ): { source: { x: number; y: number }; target: { x: number; y: number } } => {
    // For left panel: connect from right edge, vertically centered
    // For right panel: connect from left edge, vertically centered
    if (sourcePanel === 'left') {
      return {
        source: { x: sourceRect.right, y: sourceRect.top + sourceRect.height / 2 },
        target: { x: targetRect.left, y: targetRect.top + targetRect.height / 2 }
      };
    } else {
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

  // Helper to get marker ID based on target element type and hover state
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

    // Helper to render links from a specific panel
    const renderLinksFromPanel = (links: Link[], sourcePanel: 'left' | 'right') => {
      const targetPanel = sourcePanel === 'left' ? 'right' : 'left';

      return links.map((link, index) => {
        // For self-refs, both source and target are in the same panel
        const sourcePanelPos = sourcePanel;
        const targetPanelPos = link.relationship.isSelfRef ? sourcePanel : targetPanel;

        const sourceEl = findElement(link.source.type, link.source.name, sourcePanelPos);
        const targetEl = findElement(link.target.type, link.target.name, targetPanelPos);

        // Skip if either element not found in DOM
        if (!sourceEl || !targetEl) {
          return null;
        }

        const sourceRect = sourceEl.getBoundingClientRect();
        const targetRect = targetEl.getBoundingClientRect();

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
          // Use simplified cross-panel anchor calculation for cleaner horizontal links
          const { source, target } = calculateCrossPanelAnchors(sourceRect, targetRect, sourcePanel);

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
        const linkKey = `${sourcePanel}-${link.source.type}-${link.source.name}-${link.target.type}-${link.target.name}-${index}`;

        // Check if link should be highlighted (either direct hover or element hover match)
        const matchesHoveredElement = !!hoveredElement && (
          (link.source.type === hoveredElement.type && link.source.name === hoveredElement.name) ||
          (link.target.type === hoveredElement.type && link.target.name === hoveredElement.name)
        );
        const isHovered = hoveredLinkKey === linkKey || matchesHoveredElement;

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
            onMouseEnter={() => {
              setHoveredLinkKey(linkKey);
              // Debounce console.log
              if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
              }
              hoverTimeoutRef.current = window.setTimeout(() => {
                console.log(`Link: ${link.source.name} (${link.source.type}) → ${link.target.name} (${link.target.type})`, link.relationship);
              }, 300);
            }}
            onMouseLeave={() => {
              setHoveredLinkKey(null);
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
          const createGradient = (sourceType: ElementTypeId, targetType: ElementTypeId, reverse = false) => {
            const id = reverse ? `${getLinkGradientId(sourceType, targetType)}-reverse` : getLinkGradientId(sourceType, targetType);
            const [x1, x2] = reverse ? ["100%", "0%"] : ["0%", "100%"];

            return (
              <linearGradient
                key={reverse ? `${sourceType}-${targetType}-reverse` : `${sourceType}-${targetType}`}
                id={id}
                x1={x1} y1="0%" x2={x2} y2="0%"
              >
                <stop offset="0%" stopColor={getElementTypeColor(sourceType)} stopOpacity="0.5" />
                <stop offset="100%" stopColor={getElementTypeColor(targetType)} stopOpacity="0.5" />
              </linearGradient>
            );
          };

          const elementTypeIds = getAllElementTypeIds();
          return elementTypeIds.flatMap(sourceType =>
            elementTypeIds.flatMap(targetType => [
              createGradient(sourceType, targetType, false),
              createGradient(sourceType, targetType, true)
            ])
          );
        })()}

        {/* Arrow markers - one for each target element type */}
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
  );
}
