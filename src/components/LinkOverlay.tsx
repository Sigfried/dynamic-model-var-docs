/**
 * LinkOverlay - SVG layer for rendering links between items
 *
 * Performance optimization: Uses direct DOM manipulation for scroll updates
 * to avoid React re-renders. React only re-renders when links are added/removed.
 *
 * Architecture: Uses DataService - maintains view/model separation!
 */

import { useRef, useState, useEffect, useCallback } from 'react';
import type { DataService } from '../services/DataService';
import {
  generateSelfRefPath,
  getLinkGradientId,
} from '../utils/linkHelpers';
import type { ItemHoverData } from './Section';
import { splitId, panelPrefixes, contextualizeId } from '../utils/idContextualization';
import { getElementLinkTooltipColor, type ElementTypeId } from '../config/appConfig';
import { EDGE_TYPES, getEdgeTypesForLinks, type EdgeInfo } from '../models/SchemaTypes';

/**
 * LinkTooltipData - Data for link hover tooltips
 */
export interface LinkTooltipData {
  relationshipType: string;
  relationshipLabel?: string;
  sourceName: string;
  sourceType: string;
  targetName: string;
  targetType: string;
}

// Stored link data for direct DOM updates
interface LinkInfo {
  sourceId: string;
  targetId: string;
  edge: EdgeInfo;
  isSelfRef: boolean;
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

  const sourceColor = getElementLinkTooltipColor(data.sourceType as ElementTypeId);
  const targetColor = getElementLinkTooltipColor(data.targetType as ElementTypeId);

  return (
    <div
      className="absolute bg-gray-900 text-white text-sm px-3 py-2 rounded shadow-lg pointer-events-none z-50"
      style={{ left: x + 10, top: y + 10, maxWidth: '300px' }}
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
  leftSections: string[];
  rightSections: string[];
  dataService: DataService | null;
  hoveredItem?: ItemHoverData | null;
}

export default function LinkOverlay({
  leftSections,
  rightSections,
  dataService,
  hoveredItem
}: LinkOverlayProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredLinkKey, setHoveredLinkKey] = useState<string | null>(null);
  const [tooltipData, setTooltipData] = useState<{ data: LinkTooltipData; x: number; y: number } | null>(null);
  const hoverTimeoutRef = useRef<number | null>(null);

  // Store link data for direct DOM updates
  const linkInfoRef = useRef<Map<string, LinkInfo>>(new Map());
  // Version to trigger React re-render when links change structurally
  const [structuralVersion, setStructuralVersion] = useState(0);

  // Path calculation helpers (pure functions, no DOM access)
  const calculateCrossPanelAnchors = useCallback((
    sourceRect: DOMRect,
    targetRect: DOMRect
  ): { source: { x: number; y: number }; target: { x: number; y: number } } => {
    const sourceIsLeft = sourceRect.left < targetRect.left;
    if (sourceIsLeft) {
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
  }, []);

  const generateDirectionalBezierPath = useCallback((
    source: { x: number; y: number },
    target: { x: number; y: number },
    curvature: number = 0.25
  ): string => {
    const dx = target.x - source.x;
    const dy = target.y - source.y;
    const horizontalOffset = Math.abs(dx) * curvature;
    const verticalInfluence = Math.min(Math.abs(dy) * 0.1, 50);
    const controlOffset = horizontalOffset + verticalInfluence;

    if (dx > 0) {
      return `M ${source.x} ${source.y} C ${source.x + controlOffset} ${source.y}, ${target.x - controlOffset} ${target.y}, ${target.x} ${target.y}`;
    } else {
      return `M ${source.x} ${source.y} C ${source.x - controlOffset} ${source.y}, ${target.x + controlOffset} ${target.y}, ${target.x} ${target.y}`;
    }
  }, []);

  // Calculate path for a single link
  const calculatePathForLink = useCallback((
    linkInfo: LinkInfo,
    svgRect: DOMRect
  ): string | null => {
    const sourceEl = document.getElementById(linkInfo.sourceId);
    const targetEl = document.getElementById(linkInfo.targetId);
    if (!sourceEl || !targetEl) return null;

    const sourceRect = sourceEl.getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();

    if (linkInfo.isSelfRef) {
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
      return generateSelfRefPath(adjustedRect);
    } else {
      const { source, target } = calculateCrossPanelAnchors(sourceRect, targetRect);
      const adjustedSource = { x: source.x - svgRect.left, y: source.y - svgRect.top };
      const adjustedTarget = { x: target.x - svgRect.left, y: target.y - svgRect.top };
      return generateDirectionalBezierPath(adjustedSource, adjustedTarget);
    }
  }, [calculateCrossPanelAnchors, generateDirectionalBezierPath]);

  // Direct DOM update for path positions (no React re-render)
  const updatePathPositions = useCallback(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const svgRect = svg.getBoundingClientRect();

    linkInfoRef.current.forEach((linkInfo, key) => {
      const pathEl = svg.querySelector(`[data-link-id="${key}"]`) as SVGPathElement | null;
      if (!pathEl) return;

      const newPath = calculatePathForLink(linkInfo, svgRect);
      if (newPath) {
        pathEl.setAttribute('d', newPath);
      }
    });
  }, [calculatePathForLink]);

  // Build link data from DOM
  const buildLinkData = useCallback((): Map<string, LinkInfo> => {
    if (!dataService) return new Map();

    const middlePanelVisible = document.querySelector('[data-panel-position="middle"]') !== null;
    const panelOrder = middlePanelVisible ? { lp: 1, mp: 2, rp: 3 } : { lp: 1, rp: 2 };
    const edgeTypes = getEdgeTypesForLinks(middlePanelVisible);
    const itemEls = document.querySelectorAll('.item');
    const links = new Map<string, LinkInfo>();

    itemEls.forEach(itemEl => {
      const contextualizedId = itemEl.id;
      let idParts = splitId(contextualizedId);
      let panelPrefix: ('lp' | 'mp' | 'rp') = idParts[0];
      const itemId: string = idParts[1];
      const itemPanelNum = panelOrder[panelPrefix]!;

      const edges = dataService.getEdgesForItem(itemId, edgeTypes);

      for (const edge of edges) {
        if (edge.sourceItem.id !== itemId) continue;

        const targetId = edge.targetItem.id;
        const selector = panelPrefixes.map(p => `[id="${contextualizeId({ id: targetId, context: p })}"]`).join(', ');
        const targetEls: NodeListOf<Element> = document.querySelectorAll(selector);

        for (const _targetEl of targetEls) {
          if (contextualizedId === _targetEl.id) {
            const key = `${contextualizedId}→${contextualizedId}`;
            links.set(key, { sourceId: contextualizedId, targetId: contextualizedId, edge, isSelfRef: true });
            break;
          } else if (_targetEl.id > contextualizedId) {
            idParts = splitId(_targetEl.id);
            panelPrefix = idParts[0];
            const targetPanelNum = panelOrder[panelPrefix]!;
            if (targetPanelNum - itemPanelNum !== 1) continue;
            const key = `${contextualizedId}→${_targetEl.id}`;
            links.set(key, { sourceId: contextualizedId, targetId: _targetEl.id, edge, isSelfRef: false });
          }
        }
      }
    });

    return links;
  }, [dataService]);

  // Check if link structure changed
  const hasStructuralChange = useCallback((newLinks: Map<string, LinkInfo>): boolean => {
    if (newLinks.size !== linkInfoRef.current.size) return true;
    for (const key of newLinks.keys()) {
      if (!linkInfoRef.current.has(key)) return true;
    }
    return false;
  }, []);

  // Scroll/resize handler - direct DOM update only
  useEffect(() => {
    let rafId: number | null = null;

    const handlePositionUpdate = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          rafId = null;
          updatePathPositions();
        });
      }
    };

    window.addEventListener('scroll', handlePositionUpdate, true);
    window.addEventListener('resize', handlePositionUpdate);

    return () => {
      window.removeEventListener('scroll', handlePositionUpdate, true);
      window.removeEventListener('resize', handlePositionUpdate);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [updatePathPositions]);

  // Structural changes - rebuild link data and trigger React re-render
  useEffect(() => {
    const checkStructure = () => {
      const newLinks = buildLinkData();
      if (hasStructuralChange(newLinks)) {
        linkInfoRef.current = newLinks;
        setStructuralVersion(v => v + 1);
      } else {
        // Just update positions, no re-render needed
        updatePathPositions();
      }
    };

    // Wait for DOM to settle
    const frameId = requestAnimationFrame(checkStructure);

    // Also listen for expansion changes
    const handleExpansion = () => requestAnimationFrame(checkStructure);
    window.addEventListener('expansionStateChanged', handleExpansion);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('expansionStateChanged', handleExpansion);
    };
  }, [leftSections, rightSections, dataService, buildLinkData, hasStructuralChange, updatePathPositions]);

  // Helper to get marker ID based on target item type
  const getMarkerIdForTargetType = (targetType: string, isHovered: boolean = false): string => {
    const suffix = isHovered ? '-hover' : '';
    switch (targetType) {
      case 'class': return `arrow-blue${suffix}`;
      case 'enum': return `arrow-purple${suffix}`;
      case 'slot': return `arrow-green${suffix}`;
      case 'variable': return `arrow-orange${suffix}`;
      default: return `arrow-gray${suffix}`;
    }
  };

  // Render links from stored data
  const renderLinks = () => {
    const svg = svgRef.current;
    if (!svg || !dataService) return [];

    const svgRect = svg.getBoundingClientRect();
    const links: React.JSX.Element[] = [];

    linkInfoRef.current.forEach((linkInfo, key) => {
      const { sourceId, targetId, edge, isSelfRef } = linkInfo;

      const pathData = calculatePathForLink(linkInfo, svgRect);
      if (!pathData) return;

      const sourceEl = document.getElementById(sourceId);
      const targetEl = document.getElementById(targetId);
      if (!sourceEl || !targetEl) return;

      const sourceRect = sourceEl.getBoundingClientRect();
      const targetRect = targetEl.getBoundingClientRect();
      const isLeftToRight = sourceRect.left < targetRect.left;

      const sourceType = edge.sourceItem.type;
      const targetType = edge.targetItem.type;

      const gradientId = getLinkGradientId(sourceType, targetType);
      let color = `url(#${gradientId})`;
      if (!isLeftToRight) {
        color = color.replace(')', '-reverse)');
      }

      const strokeWidth = edge.edgeType === EDGE_TYPES.INHERITANCE ? 2 : 1.5;

      const matchesHoveredItem = !!hoveredItem && (
        sourceId === hoveredItem.id || targetId === hoveredItem.id
      );
      const isHovered = hoveredLinkKey === key || matchesHoveredItem;
      const markerId = getMarkerIdForTargetType(targetType, isHovered);
      const markerEnd = isSelfRef ? undefined : `url(#${markerId})`;

      links.push(
        <path
          key={key}
          data-link-id={key}
          d={pathData}
          fill="none"
          stroke={color}
          markerEnd={markerEnd}
          opacity={isHovered ? 1.0 : 0.2}
          strokeWidth={isHovered ? 3 : strokeWidth}
          className="transition-opacity cursor-pointer"
          style={{ pointerEvents: 'stroke' }}
          onMouseEnter={(e: React.MouseEvent) => {
            setHoveredLinkKey(key);
            if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
            hoverTimeoutRef.current = window.setTimeout(() => {
              setTooltipData({
                data: {
                  relationshipType: edge.edgeType,
                  relationshipLabel: edge.label,
                  sourceName: edge.sourceItem.displayName,
                  sourceType,
                  targetName: edge.targetItem.displayName,
                  targetType
                },
                x: e.clientX,
                y: e.clientY
              });
            }, 300);
          }}
          onMouseLeave={() => {
            setHoveredLinkKey(null);
            setTooltipData(null);
            if (hoverTimeoutRef.current) {
              clearTimeout(hoverTimeoutRef.current);
              hoverTimeoutRef.current = null;
            }
          }}
        />
      );
    });

    return links;
  };

  // Force re-render when structuralVersion changes (used by renderLinks)
  void structuralVersion;

  return (
    <>
      <svg
        ref={svgRef}
        className="absolute inset-0 pointer-events-none"
        style={{ width: '100%', height: '100%', zIndex: 1 }}
      >
        <defs>
          {/* Gradients for all source→target combinations */}
          {(() => {
            const createGradient = (sourceType: string, targetType: string, reverse = false) => {
              const id = reverse ? `${getLinkGradientId(sourceType, targetType)}-reverse` : getLinkGradientId(sourceType, targetType);
              const [x1, x2] = reverse ? ["100%", "0%"] : ["0%", "100%"];
              return (
                <linearGradient key={`${sourceType}-${targetType}${reverse ? '-rev' : ''}`} id={id} x1={x1} y1="0%" x2={x2} y2="0%">
                  <stop offset="0%" stopColor={dataService!.getColorForItemType(sourceType)} stopOpacity="0.5" />
                  <stop offset="100%" stopColor={dataService!.getColorForItemType(targetType)} stopOpacity="0.5" />
                </linearGradient>
              );
            };
            const allTypes = dataService?.getAvailableItemTypes() || [];
            return allTypes.flatMap(sourceType =>
              allTypes.flatMap(targetType => [
                createGradient(sourceType, targetType, false),
                createGradient(sourceType, targetType, true)
              ])
            );
          })()}

          {/* Arrow markers */}
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
                <marker key={markerId} id={markerId} viewBox="0 0 10 10" refX="0" refY="5"
                  markerWidth={markerSize} markerHeight={markerSize} orient="auto" markerUnits="userSpaceOnUse">
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
