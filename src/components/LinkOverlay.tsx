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
import { ClassElement, EnumElement, SlotElement, VariableElement } from '../models/Element';
import {
  buildLinks,
  generateSelfRefPath,
  getLinkColor,
  getLinkStrokeWidth,
  type Link,
  type LinkFilterOptions
} from '../utils/linkHelpers';

export interface LinkOverlayProps {
  /** Elements visible in left panel */
  leftPanel: {
    classes: ClassNode[];
    enums: Map<string, EnumDefinition>;
    slots: Map<string, SlotDefinition>;
    variables: VariableSpec[];
  };
  /** Elements visible in right panel */
  rightPanel: {
    classes: ClassNode[];
    enums: Map<string, EnumDefinition>;
    slots: Map<string, SlotDefinition>;
    variables: VariableSpec[];
  };
  /** Filter options for controlling which links to show */
  filterOptions?: LinkFilterOptions;
}

export default function LinkOverlay({
  leftPanel,
  rightPanel,
  filterOptions = {}
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
    // Build set of element names in each panel for cross-panel filtering
    const leftElements = new Set<string>();
    const rightElements = new Set<string>();

    leftPanel.classes.forEach(c => leftElements.add(c.name));
    leftPanel.enums.forEach((_, name) => leftElements.add(name));
    leftPanel.slots.forEach((_, name) => leftElements.add(name));
    leftPanel.variables.forEach(v => leftElements.add(v.variableLabel));

    rightPanel.classes.forEach(c => rightElements.add(c.name));
    rightPanel.enums.forEach((_, name) => rightElements.add(name));
    rightPanel.slots.forEach((_, name) => rightElements.add(name));
    rightPanel.variables.forEach(v => rightElements.add(v.variableLabel));

    // Combine all slots for ClassElement constructor
    const allSlots = new Map([...leftPanel.slots, ...rightPanel.slots]);

    const leftLinks: Link[] = [];
    const rightLinks: Link[] = [];

    // Helper to process elements from a panel
    const processElements = (
      classes: ClassNode[],
      enums: Map<string, EnumDefinition>,
      slots: Map<string, SlotDefinition>,
      variables: VariableSpec[],
      targetPanel: Set<string>,
      linksArray: Link[]
    ) => {
      // Classes
      classes.forEach(classData => {
        const element = new ClassElement(classData, allSlots);
        const relationships = element.getRelationships();
        const classLinks = buildLinks('class', classData.name, relationships, {
          ...filterOptions,
          showInheritance: false, // Disable inheritance - tree already shows this
        });
        // Only keep cross-panel links (or self-refs)
        const crossPanelLinks = classLinks.filter(link =>
          link.relationship.isSelfRef || targetPanel.has(link.target.name)
        );
        linksArray.push(...crossPanelLinks);
      });

      // Enums
      enums.forEach(enumData => {
        const element = new EnumElement(enumData);
        const relationships = element.getRelationships();
        const enumLinks = buildLinks('enum', enumData.name, relationships, filterOptions);
        const crossPanelLinks = enumLinks.filter(link =>
          link.relationship.isSelfRef || targetPanel.has(link.target.name)
        );
        linksArray.push(...crossPanelLinks);
      });

      // Slots
      slots.forEach(slotData => {
        const element = new SlotElement(slotData);
        const relationships = element.getRelationships();
        const slotLinks = buildLinks('slot', slotData.name, relationships, filterOptions);
        const crossPanelLinks = slotLinks.filter(link =>
          link.relationship.isSelfRef || targetPanel.has(link.target.name)
        );
        linksArray.push(...crossPanelLinks);
      });

      // Variables
      variables.forEach(variableData => {
        const element = new VariableElement(variableData);
        const relationships = element.getRelationships();
        const variableLinks = buildLinks('variable', variableData.variableLabel, relationships, filterOptions);
        const crossPanelLinks = variableLinks.filter(link =>
          link.relationship.isSelfRef || targetPanel.has(link.target.name)
        );
        linksArray.push(...crossPanelLinks);
      });
    };

    // Only process left→right to avoid bidirectional duplicate links
    // For cross-panel relationships, we only draw left→right
    // (If users want to see right→left relationships, they can swap panels)
    processElements(
      leftPanel.classes,
      leftPanel.enums,
      leftPanel.slots,
      leftPanel.variables,
      rightElements,
      leftLinks
    );

    // Right panel: only process self-referential links (not cross-panel)
    // This avoids drawing both A→B and B→A for bidirectional relationships
    const processRightPanelSelfRefs = () => {
      // Only collect self-referential links from right panel
      rightPanel.classes.forEach(classData => {
        const element = new ClassElement(classData, allSlots);
        const relationships = element.getRelationships();
        const classLinks = buildLinks('class', classData.name, relationships, {
          ...filterOptions,
          showInheritance: false,
        });
        const selfRefs = classLinks.filter(link => link.relationship.isSelfRef);
        rightLinks.push(...selfRefs);
      });

      // Self-refs for other types (enums don't have relationships, slots/variables typically don't have self-refs)
      // but include for completeness
      rightPanel.slots.forEach(slotData => {
        const element = new SlotElement(slotData);
        const relationships = element.getRelationships();
        const slotLinks = buildLinks('slot', slotData.name, relationships, filterOptions);
        const selfRefs = slotLinks.filter(link => link.relationship.isSelfRef);
        rightLinks.push(...selfRefs);
      });
    };

    processRightPanelSelfRefs();

    return { leftPanelLinks: leftLinks, rightPanelLinks: rightLinks };
  }, [
    leftPanel.classes, leftPanel.enums, leftPanel.slots, leftPanel.variables,
    rightPanel.classes, rightPanel.enums, rightPanel.slots, rightPanel.variables,
    filterOptions
  ]);

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

  // Helper to get marker ID based on link color and hover state
  const getMarkerIdForColor = (color: string, isHovered: boolean = false): string => {
    const suffix = isHovered ? '-hover' : '';
    if (color.includes('#10b981')) return `arrow-green${suffix}`;  // class→class
    if (color.includes('#a855f7')) return `arrow-purple${suffix}`; // class→enum
    if (color.includes('#f97316')) return `arrow-orange${suffix}`; // variable→class
    if (color.includes('#3b82f6')) return `arrow-blue${suffix}`;   // inheritance
    return `arrow-gray${suffix}`; // slot→class/enum
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

        const color = getLinkColor(link.relationship);
        const strokeWidth = getLinkStrokeWidth(link.relationship);

        // Generate unique key for this link
        const linkKey = `${sourcePanel}-${link.source.type}-${link.source.name}-${link.target.type}-${link.target.name}-${index}`;
        const isHovered = hoveredLinkKey === linkKey;

        const markerId = getMarkerIdForColor(color, isHovered);

        // Don't add arrows to self-referential links (they look weird on loops)
        const markerEnd = link.relationship.isSelfRef ? undefined : `url(#${markerId})`;

        return (
          <path
            key={linkKey}
            d={pathData}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            markerEnd={markerEnd}
            opacity={0.2}
            className="transition-all duration-150 hover:opacity-100 hover:stroke-[3] cursor-pointer"
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
      {/* Arrow marker definitions - one for each link color */}
      {/* Note: Markers have opacity built into fill to match line opacity at 0.2 */}
      <defs>
        {/* Green arrow for class→class links */}
        <marker
          id="arrow-green"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" fillOpacity="0.3" />
        </marker>

        {/* Purple arrow for class→enum links */}
        <marker
          id="arrow-purple"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#a855f7" fillOpacity="0.3" />
        </marker>

        {/* Orange arrow for variable→class links */}
        <marker
          id="arrow-orange"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#f97316" fillOpacity="0.3" />
        </marker>

        {/* Blue arrow for inheritance (if enabled) */}
        <marker
          id="arrow-blue"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" fillOpacity="0.3" />
        </marker>

        {/* Gray arrow for slot→class/enum links */}
        <marker
          id="arrow-gray"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#6b7280" fillOpacity="0.3" />
        </marker>

        {/* Hover state markers - full opacity for highlighted links */}
        <marker
          id="arrow-green-hover"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
        </marker>

        <marker
          id="arrow-purple-hover"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#a855f7" />
        </marker>

        <marker
          id="arrow-orange-hover"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#f97316" />
        </marker>

        <marker
          id="arrow-blue-hover"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
        </marker>

        <marker
          id="arrow-gray-hover"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#6b7280" />
        </marker>
      </defs>
      {renderLinks()}
    </svg>
  );
}
