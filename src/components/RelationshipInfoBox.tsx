/**
 * RelationshipInfoBox - Displays relationship information when hovering over items
 *
 * Shows:
 * - Outgoing relationships (inheritance, slots with attribute names)
 * - Incoming relationships (subclasses, used by attributes, variables)
 *
 * Appears when user hovers over an item in the tree/panels.
 * Positioned relative to the hovered item's DOM node, can upgrade to persistent mode on interaction.
 *
 * Architecture: Uses DataService to fetch relationship data by item ID - maintains view/model separation!
 * Uses DataService - never accesses model layer directly.
 * UI layer uses "item" terminology
 */

import { useState, useEffect, useRef } from 'react';
import type { DataService } from '../services/DataService';
import type { EdgeInfo } from '../models/Element';

interface RelationshipInfoBoxProps {
  itemId: string | null;
  itemDomId: string | null;  // DOM node ID for positioning
  dataService: DataService | null;
  onNavigate?: (itemName: string, itemSection: string) => void;
  onUpgrade?: () => void;  // Callback when box should upgrade to persistent mode
}

export default function RelationshipInfoBox({ itemId, itemDomId, dataService, onNavigate, onUpgrade }: RelationshipInfoBoxProps) {
  // State for debounced/lingering item display
  const [displayedItemId, setDisplayedItemId] = useState<string | null>(null);
  const [boxPosition, setBoxPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [expandedSections, setExpandedSections] = useState<{
    subclasses: boolean;
    usedBy: boolean;
    variables: boolean;
    slots: boolean;
    inheritedSlots: Record<string, boolean>; // Track each ancestor separately
  }>({
    subclasses: false,
    usedBy: false,
    variables: false,
    slots: false,
    inheritedSlots: {}
  });
  const hoverTimerRef = useRef<number | null>(null);
  const lingerTimerRef = useRef<number | null>(null);
  const upgradeTimerRef = useRef<number | null>(null);

  // Debounced hover effect - position based on item DOM node
  useEffect(() => {
    // Clear any existing timers
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    if (lingerTimerRef.current) {
      clearTimeout(lingerTimerRef.current);
      lingerTimerRef.current = null;
    }

    if (itemId && itemDomId) {
      // Item hovered - show after short delay (ignore quick pass-overs)
      hoverTimerRef.current = setTimeout(() => {
        setDisplayedItemId(itemId);

        // Position box relative to the hovered item's DOM node
        const itemNode = document.getElementById(itemDomId);
        if (!itemNode) {
          console.warn(`[RelationshipInfoBox] Could not find DOM node with id "${itemDomId}"`);
          return;
        }

        const itemRect = itemNode.getBoundingClientRect();
        const estimatedBoxHeight = 400; // Typical box height for centering
        const maxBoxHeight = window.innerHeight * 0.8; // max-h-[80vh] for viewport constraints

        // Find the rightmost edge of visible panels
        const leftPanel = document.querySelector('[data-panel-position="left"]')?.parentElement?.parentElement;
        const rightPanel = document.querySelector('[data-panel-position="right"]')?.parentElement?.parentElement;

        let rightmostEdge = 0;
        if (rightPanel) {
          rightmostEdge = rightPanel.getBoundingClientRect().right;
        } else if (leftPanel) {
          rightmostEdge = leftPanel.getBoundingClientRect().right;
        }

        // Position to the right of panels, 20px margin
        const idealX = Math.max(370, rightmostEdge + 20);

        // Clamp X to viewport (box width ~400px, leave 10px margin on right)
        const boxWidth = 400;
        const maxX = window.innerWidth - boxWidth - 10;
        const xPosition = Math.min(idealX, maxX);

        // Vertically center box relative to item, using estimated height for better centering
        const itemCenterY = itemRect.top + (itemRect.height / 2);
        const idealY = itemCenterY - (estimatedBoxHeight / 2);

        // Clamp to viewport with margins (use maxBoxHeight for worst-case bounds)
        const minY = 10;
        const maxY = window.innerHeight - maxBoxHeight - 10;
        const yPosition = Math.max(minY, Math.min(idealY, maxY));

        setBoxPosition({
          x: xPosition,
          y: yPosition
        });
      }, 300);
    } else if (displayedItemId) {
      // Item unhovered but we have a displayed item - linger for 1.5s
      lingerTimerRef.current = setTimeout(() => {
        setDisplayedItemId(null);
      }, 1500);
    }

    return () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
      if (lingerTimerRef.current) clearTimeout(lingerTimerRef.current);
    };
  }, [itemId, itemDomId, displayedItemId]);

  // Handlers for upgrading to persistent mode
  const handleBoxMouseEnter = () => {
    // Cancel linger timer when hovering over the box
    if (lingerTimerRef.current) {
      clearTimeout(lingerTimerRef.current);
      lingerTimerRef.current = null;
    }

    // After 1.5s hover, trigger upgrade callback
    upgradeTimerRef.current = setTimeout(() => {
      onUpgrade?.();
    }, 1500);
  };

  const handleBoxMouseLeave = () => {
    // Cancel upgrade timer when leaving the box
    if (upgradeTimerRef.current) {
      clearTimeout(upgradeTimerRef.current);
      upgradeTimerRef.current = null;
    }

    // Start linger timer when leaving the box
    lingerTimerRef.current = setTimeout(() => {
      setDisplayedItemId(null);
    }, 1500);
  };

  const handleBoxClick = () => {
    // Clicking immediately triggers upgrade
    onUpgrade?.();
    if (upgradeTimerRef.current) {
      clearTimeout(upgradeTimerRef.current);
      upgradeTimerRef.current = null;
    }
  };

  if (!displayedItemId || !dataService) {
    return null;
  }

  // Get relationship data from data service (new graph-based format)
  const relationshipData = dataService.getRelationshipsNew(displayedItemId);

  if (!relationshipData) return null;

  // Transform EdgeInfo[] arrays into display structure
  const { thisItem, outgoing, incoming } = relationshipData;

  // Group outgoing edges by type
  const inheritanceEdge = outgoing.find(e => e.edgeType === 'inheritance');
  const directSlots = outgoing.filter(e => e.edgeType === 'property' && !e.inheritedFrom);

  // Group inherited slots by ancestor
  const inheritedSlotsMap = new Map<string, EdgeInfo[]>();
  outgoing
    .filter(e => e.edgeType === 'property' && e.inheritedFrom)
    .forEach(edge => {
      const ancestor = edge.inheritedFrom!;
      if (!inheritedSlotsMap.has(ancestor)) {
        inheritedSlotsMap.set(ancestor, []);
      }
      inheritedSlotsMap.get(ancestor)!.push(edge);
    });

  // Group incoming edges by type
  const incomingInheritance = incoming.filter(e => e.edgeType === 'inheritance');
  const incomingProperties = incoming.filter(e => e.edgeType === 'property');
  const incomingVariables = incoming.filter(e => e.edgeType === 'variable_mapping');

  // Helper to make item names clickable
  const makeClickable = (
    itemId: string,
    displayName: string,
    section: string,
    className: string
  ) => {
    if (!onNavigate) {
      return <span className={className}>{displayName}</span>;
    }
    return (
      <button
        onClick={() => onNavigate(itemId, section)}
        className={`${className} hover:underline cursor-pointer`}
      >
        {displayName}
      </button>
    );
  };

  // Helper to render collapsible list with "... N more" button for large lists
  const renderCollapsibleList = <T,>(
    items: T[],
    sectionKey: 'subclasses' | 'usedBy' | 'variables' | 'slots',
    renderItem: (item: T, idx: number) => React.ReactNode,
    threshold: number = 20
  ) => {
    const isExpanded = expandedSections[sectionKey];
    const shouldCollapse = items.length > threshold;
    const visibleItems = shouldCollapse && !isExpanded ? items.slice(0, 10) : items;
    const remainingCount = items.length - 10;

    return (
      <>
        {visibleItems.map(renderItem)}
        {shouldCollapse && !isExpanded && (
          <button
            onClick={() => setExpandedSections(prev => ({ ...prev, [sectionKey]: true }))}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer mt-1"
          >
            ... {remainingCount} more (click to expand)
          </button>
        )}
        {shouldCollapse && isExpanded && (
          <button
            onClick={() => setExpandedSections(prev => ({ ...prev, [sectionKey]: false }))}
            className="text-sm text-gray-600 dark:text-gray-400 hover:underline cursor-pointer mt-1"
          >
            (collapse)
          </button>
        )}
      </>
    );
  };

  // Helper to render collapsible inherited slots for a specific ancestor
  const renderCollapsibleInheritedSlots = (
    ancestorName: string,
    edges: EdgeInfo[],
    threshold: number = 20
  ) => {
    const isExpanded = expandedSections.inheritedSlots[ancestorName] || false;
    const shouldCollapse = edges.length > threshold;
    const visibleEdges = shouldCollapse && !isExpanded ? edges.slice(0, 10) : edges;
    const remainingCount = edges.length - 10;

    return (
      <>
        {visibleEdges.map((edge, edgeIdx) => {
          const isSelfRef = edge.otherItem.id === thisItem.id;
          return (
            <div key={edgeIdx} className="text-sm text-gray-900 dark:text-gray-100">
              <span className="text-green-600 dark:text-green-400">{edge.label || 'unknown'}</span>
              {' → '}
              {makeClickable(
                edge.otherItem.id,
                edge.otherItem.displayName,
                edge.otherItem.typeDisplayName.toLowerCase(),
                isSelfRef ? "text-orange-600 dark:text-orange-400" : "text-blue-600 dark:text-blue-400"
              )}
              <span className="text-gray-500 dark:text-gray-400 text-xs ml-1">
                ({edge.otherItem.typeDisplayName}{isSelfRef ? ', self-ref' : ''})
              </span>
            </div>
          );
        })}
        {shouldCollapse && !isExpanded && (
          <button
            onClick={() => setExpandedSections(prev => ({
              ...prev,
              inheritedSlots: { ...prev.inheritedSlots, [ancestorName]: true }
            }))}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer mt-1"
          >
            ... {remainingCount} more (click to expand)
          </button>
        )}
        {shouldCollapse && isExpanded && (
          <button
            onClick={() => setExpandedSections(prev => ({
              ...prev,
              inheritedSlots: { ...prev.inheritedSlots, [ancestorName]: false }
            }))}
            className="text-sm text-gray-600 dark:text-gray-400 hover:underline cursor-pointer mt-1"
          >
            (collapse)
          </button>
        )}
      </>
    );
  };

  const hasOutgoing = inheritanceEdge || directSlots.length > 0 || inheritedSlotsMap.size > 0;
  const hasIncoming = incomingInheritance.length > 0 || incomingProperties.length > 0 || incomingVariables.length > 0;

  if (!hasOutgoing && !hasIncoming) {
    return (
      <div
        className="fixed w-[500px] bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-[60]"
        style={{ left: `${boxPosition.x}px`, top: `${boxPosition.y}px` }}
        onMouseEnter={handleBoxMouseEnter}
        onMouseLeave={handleBoxMouseLeave}
        onClick={handleBoxClick}
      >
        <div className={`${thisItem.color} px-4 py-2 rounded-t-lg border-b`}>
          <h3 className="font-semibold text-white">
            {thisItem.displayName} relationships
          </h3>
        </div>
        <div className="p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">No relationships found</p>
        </div>
      </div>
    );
  }

  // Count relationships
  const outgoingCount = (inheritanceEdge ? 1 : 0) + directSlots.length;
  const incomingCount = incomingInheritance.length + incomingProperties.length + incomingVariables.length;

  return (
    <div
      className="fixed w-[500px] bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-[60] max-h-[80vh] flex flex-col"
      style={{ left: `${boxPosition.x}px`, top: `${boxPosition.y}px` }}
      onMouseEnter={handleBoxMouseEnter}
      onMouseLeave={handleBoxMouseLeave}
      onClick={handleBoxClick}
    >
      <div className={`${thisItem.color} px-4 py-2 rounded-t-lg border-b`}>
        <h3 className="font-semibold text-white flex items-center gap-2">
          <span>{thisItem.displayName} relationships</span>
          <span className="text-sm font-normal opacity-90">
            [↗ {outgoingCount} outgoing] [↙ {incomingCount} incoming]
          </span>
        </h3>
      </div>
      <div className="p-4 overflow-y-auto">

        {/* Outgoing Relationships */}
      {hasOutgoing && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Outgoing:</h4>

          {/* Inheritance */}
          {inheritanceEdge && (
            <div className="mb-3">
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Inheritance:</div>
              <div className="ml-3 text-sm text-gray-900 dark:text-gray-100">
                → {makeClickable(
                  inheritanceEdge.otherItem.id,
                  inheritanceEdge.otherItem.displayName,
                  inheritanceEdge.otherItem.typeDisplayName.toLowerCase(),
                  "text-blue-600 dark:text-blue-400"
                )}
                <span className="text-gray-500 dark:text-gray-400 text-xs ml-1">
                  ({inheritanceEdge.otherItem.typeDisplayName})
                </span>
              </div>
            </div>
          )}

          {/* Slots */}
          {directSlots.length > 0 && (
            <div>
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Slots:</div>
              <div className="ml-3 space-y-1">
                {renderCollapsibleList(
                  directSlots,
                  'slots',
                  (edge, idx) => {
                    const isSelfRef = edge.otherItem.id === thisItem.id;
                    return (
                      <div key={idx} className="text-sm text-gray-900 dark:text-gray-100">
                        <span className="text-green-600 dark:text-green-400">{edge.label || 'unknown'}</span>
                        {' → '}
                        {makeClickable(
                          edge.otherItem.id,
                          edge.otherItem.displayName,
                          edge.otherItem.typeDisplayName.toLowerCase(),
                          isSelfRef ? "text-orange-600 dark:text-orange-400" : "text-blue-600 dark:text-blue-400"
                        )}
                        <span className="text-gray-500 dark:text-gray-400 text-xs ml-1">
                          ({edge.otherItem.typeDisplayName}{isSelfRef ? ', self-ref' : ''})
                        </span>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          )}

          {/* Inherited Slots */}
          {inheritedSlotsMap.size > 0 && (
            <div className="mt-3">
              {Array.from(inheritedSlotsMap.entries()).map(([ancestorName, ancestorEdges], groupIdx) => (
                <div key={groupIdx} className="mb-2">
                  <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Inherited from {ancestorName}:
                  </div>
                  <div className="ml-3 space-y-1">
                    {renderCollapsibleInheritedSlots(ancestorName, ancestorEdges)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Incoming Relationships */}
      {hasIncoming && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Incoming:</h4>

          {/* Subclasses */}
          {incomingInheritance.length > 0 && (
            <div className="mb-3">
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Subclasses ({incomingInheritance.length}):
              </div>
              <div className="ml-3 space-y-0.5">
                {renderCollapsibleList(
                  incomingInheritance,
                  'subclasses',
                  (edge, idx) => (
                    <div key={idx} className="text-sm text-gray-900 dark:text-gray-100">
                      • {makeClickable(
                        edge.otherItem.id,
                        edge.otherItem.displayName,
                        edge.otherItem.typeDisplayName.toLowerCase(),
                        "text-blue-600 dark:text-blue-400"
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* Used By Attributes */}
          {incomingProperties.length > 0 && (
            <div className="mb-3">
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Used By ({incomingProperties.length}):
              </div>
              <div className="ml-3 space-y-0.5">
                {renderCollapsibleList(
                  incomingProperties,
                  'usedBy',
                  (edge, idx) => (
                    <div key={idx} className="text-sm text-gray-900 dark:text-gray-100">
                      {makeClickable(
                        edge.otherItem.id,
                        edge.otherItem.displayName,
                        edge.otherItem.typeDisplayName.toLowerCase(),
                        "text-blue-600 dark:text-blue-400"
                      )}
                      <span className="text-gray-500 dark:text-gray-400">.</span>
                      <span className="text-green-600 dark:text-green-400">{edge.label || 'unknown'}</span>
                      <span className="text-gray-500 dark:text-gray-400 text-xs ml-1">
                        ({edge.otherItem.typeDisplayName})
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* Variables */}
          {incomingVariables.length > 0 && (
            <div>
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Variables ({incomingVariables.length}):
              </div>
              <div className="ml-3 space-y-0.5">
                {renderCollapsibleList(
                  incomingVariables,
                  'variables',
                  (edge, idx) => (
                    <div key={idx} className="text-sm text-gray-900 dark:text-gray-100">
                      • {makeClickable(
                        edge.otherItem.id,
                        edge.otherItem.displayName,
                        edge.otherItem.typeDisplayName.toLowerCase(),
                        "text-purple-600 dark:text-purple-400"
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
}
