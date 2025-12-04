/**
 * RelationshipInfoContent - Displays relationship information for items
 *
 * Pure content component (no positioning), for use inside FloatingBox.
 *
 * Shows:
 * - Outgoing relationships (inheritance, slots with attribute names)
 * - Incoming relationships (subclasses, used by attributes, variables)
 *
 * Architecture: Uses DataService - maintains view/model separation.
 */

import { useState } from 'react';
import type { DataService } from '../services/DataService';
import { APP_CONFIG, getElementLinkColor, type ElementTypeId } from '../config/appConfig';
import { EDGE_TYPES, type EdgeInfo, type EdgeType } from '../models/SchemaTypes';

// All edge types for querying relationships
const ALL_EDGE_TYPES: EdgeType[] = [
  EDGE_TYPES.INHERITANCE,
  EDGE_TYPES.CLASS_RANGE,
  EDGE_TYPES.CLASS_SLOT,
  EDGE_TYPES.SLOT_RANGE,
  EDGE_TYPES.MAPS_TO,
];

// ============================================================================
// RelationshipInfoContent - Pure content component for use inside FloatingBox
// ============================================================================

interface RelationshipInfoContentProps {
  itemId: string;
  dataService: DataService;
  onNavigate?: (itemName: string, itemSection: string) => void;
}

/**
 * Pure content component - renders relationship info without positioning/chrome.
 * Designed to be wrapped by FloatingBox which provides header, border, positioning.
 */
export function RelationshipInfoContent({ itemId, dataService, onNavigate }: RelationshipInfoContentProps) {
  const [expandedSections, setExpandedSections] = useState<{
    subclasses: boolean;
    usedBy: boolean;
    variables: boolean;
    slots: boolean;
    inheritedSlots: Record<string, boolean>;
  }>({
    subclasses: false,
    usedBy: false,
    variables: false,
    slots: false,
    inheritedSlots: {}
  });

  // Get item info and edges directly from graph
  const thisItem = dataService.getItemInfo(itemId);
  if (!thisItem) {
    return <p className="text-sm text-gray-500 dark:text-gray-400 p-4">Item not found</p>;
  }

  // Get all edges for this item and split by direction
  const allEdges = dataService.getEdgesForItem(itemId, ALL_EDGE_TYPES);
  const outgoing = allEdges.filter(e => e.sourceItem.id === itemId);
  const incoming = allEdges.filter(e => e.targetItem.id === itemId);

  // Group outgoing edges by type
  const inheritanceEdge = outgoing.find(e => e.edgeType === EDGE_TYPES.INHERITANCE);
  const directSlots = outgoing.filter(e => e.edgeType === EDGE_TYPES.CLASS_RANGE && !e.inheritedFrom);
  const slotRangeEdges = outgoing.filter(e => e.edgeType === EDGE_TYPES.SLOT_RANGE);

  // Group inherited slots by ancestor
  const inheritedSlotsMap = new Map<string, EdgeInfo[]>();
  outgoing
    .filter(e => e.edgeType === EDGE_TYPES.CLASS_RANGE && e.inheritedFrom)
    .forEach(edge => {
      const ancestor = edge.inheritedFrom!;
      if (!inheritedSlotsMap.has(ancestor)) {
        inheritedSlotsMap.set(ancestor, []);
      }
      inheritedSlotsMap.get(ancestor)!.push(edge);
    });

  // Group incoming edges by type
  const incomingInheritance = incoming.filter(e => e.edgeType === EDGE_TYPES.INHERITANCE);
  const incomingProperties = incoming.filter(e => e.edgeType === EDGE_TYPES.CLASS_RANGE);
  const incomingClassSlot = incoming.filter(e => e.edgeType === EDGE_TYPES.CLASS_SLOT);
  const incomingVariables = incoming.filter(e => e.edgeType === EDGE_TYPES.MAPS_TO);

  // Helper to make item names clickable
  const makeClickable = (
    targetItemId: string,
    displayName: string,
    elementType: ElementTypeId,
    isSelfRef: boolean = false
  ) => {
    const className = isSelfRef
      ? 'text-orange-600 dark:text-orange-400'
      : getElementLinkColor(elementType);

    if (!onNavigate) {
      return <span className={className}>{displayName}</span>;
    }
    return (
      <button
        onClick={() => onNavigate(targetItemId, elementType)}
        className={`${className} hover:underline cursor-pointer`}
      >
        {displayName}
      </button>
    );
  };

  // Helper to render collapsible list
  const renderCollapsibleList = <T,>(
    items: T[],
    sectionKey: 'subclasses' | 'usedBy' | 'variables' | 'slots',
    renderItem: (item: T, idx: number) => React.ReactNode,
    threshold: number = APP_CONFIG.layout.collapsibleListSize
  ) => {
    const isExpanded = expandedSections[sectionKey];
    const shouldCollapse = items.length > threshold;
    const visibleItems = shouldCollapse && !isExpanded ? items.slice(0, APP_CONFIG.layout.collapsedPreviewCount) : items;
    const remainingCount = items.length - APP_CONFIG.layout.collapsedPreviewCount;

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

  // Helper to render collapsible inherited slots
  const renderCollapsibleInheritedSlots = (
    ancestorName: string,
    edges: EdgeInfo[],
    threshold: number = APP_CONFIG.layout.collapsibleListSize
  ) => {
    const isExpanded = expandedSections.inheritedSlots[ancestorName] || false;
    const shouldCollapse = edges.length > threshold;
    const visibleEdges = shouldCollapse && !isExpanded ? edges.slice(0, APP_CONFIG.layout.collapsedPreviewCount) : edges;
    const remainingCount = edges.length - APP_CONFIG.layout.collapsedPreviewCount;

    return (
      <>
        {visibleEdges.map((edge, edgeIdx) => {
          const isSelfRef = edge.targetItem.id === thisItem.id;
          return (
            <div key={edgeIdx} className="text-sm text-gray-900 dark:text-gray-100">
              <span className={getElementLinkColor('slot')}>{edge.label || 'unknown'}</span>
              {' → '}
              {makeClickable(
                edge.targetItem.id,
                edge.targetItem.displayName,
                edge.targetItem.type as ElementTypeId,
                isSelfRef
              )}
              <span className="text-gray-500 dark:text-gray-400 text-xs ml-1">
                ({edge.targetItem.typeDisplayName}{isSelfRef ? ', self-ref' : ''})
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

  const hasOutgoing = inheritanceEdge || directSlots.length > 0 || inheritedSlotsMap.size > 0 || slotRangeEdges.length > 0;
  const hasIncoming = incomingInheritance.length > 0 || incomingProperties.length > 0 || incomingClassSlot.length > 0 || incomingVariables.length > 0;

  if (!hasOutgoing && !hasIncoming) {
    return <p className="text-sm text-gray-500 dark:text-gray-400 p-4">No relationships found</p>;
  }

  return (
    <div className="p-4 overflow-y-auto">
      {/* Outgoing Relationships */}
      {hasOutgoing && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Outgoing:</h4>

          {inheritanceEdge && (
            <div className="mb-3">
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Inheritance:</div>
              <div className="ml-3 text-sm text-gray-900 dark:text-gray-100">
                → {makeClickable(
                  inheritanceEdge.targetItem.id,
                  inheritanceEdge.targetItem.displayName,
                  inheritanceEdge.targetItem.type as ElementTypeId
                )}
                <span className="text-gray-500 dark:text-gray-400 text-xs ml-1">
                  ({inheritanceEdge.targetItem.typeDisplayName})
                </span>
              </div>
            </div>
          )}

          {directSlots.length > 0 && (
            <div>
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Slots:</div>
              <div className="ml-3 space-y-1">
                {renderCollapsibleList(
                  directSlots,
                  'slots',
                  (edge, idx) => {
                    const isSelfRef = edge.targetItem.id === thisItem.id;
                    return (
                      <div key={idx} className="text-sm text-gray-900 dark:text-gray-100">
                        <span className={getElementLinkColor('slot')}>{edge.label || 'unknown'}</span>
                        {' → '}
                        {makeClickable(
                          edge.targetItem.id,
                          edge.targetItem.displayName,
                          edge.targetItem.type as ElementTypeId,
                          isSelfRef
                        )}
                        <span className="text-gray-500 dark:text-gray-400 text-xs ml-1">
                          ({edge.targetItem.typeDisplayName}{isSelfRef ? ', self-ref' : ''})
                        </span>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          )}

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

          {slotRangeEdges.length > 0 && (
            <div className="mb-3">
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Range:</div>
              <div className="ml-3 space-y-1">
                {slotRangeEdges.map((edge, idx) => (
                  <div key={idx} className="text-sm text-gray-900 dark:text-gray-100">
                    → {makeClickable(
                      edge.targetItem.id,
                      edge.targetItem.displayName,
                      edge.targetItem.type as ElementTypeId
                    )}
                    <span className="text-gray-500 dark:text-gray-400 text-xs ml-1">
                      ({edge.targetItem.typeDisplayName})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Incoming Relationships */}
      {hasIncoming && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Incoming:</h4>

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
                        edge.sourceItem.id,
                        edge.sourceItem.displayName,
                        edge.sourceItem.type as ElementTypeId
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          )}

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
                        edge.sourceItem.id,
                        edge.sourceItem.displayName,
                        edge.sourceItem.type as ElementTypeId
                      )}
                      <span className="text-gray-500 dark:text-gray-400">.</span>
                      <span className={getElementLinkColor('slot')}>{edge.label || 'unknown'}</span>
                      <span className="text-gray-500 dark:text-gray-400 text-xs ml-1">
                        ({edge.sourceItem.typeDisplayName})
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {incomingClassSlot.length > 0 && (
            <div className="mb-3">
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Used By Classes ({incomingClassSlot.length}):
              </div>
              <div className="ml-3 space-y-0.5">
                {incomingClassSlot.map((edge, idx) => (
                  <div key={idx} className="text-sm text-gray-900 dark:text-gray-100">
                    • {makeClickable(
                      edge.sourceItem.id,
                      edge.sourceItem.displayName,
                      edge.sourceItem.type as ElementTypeId
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

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
                        edge.sourceItem.id,
                        edge.sourceItem.displayName,
                        edge.sourceItem.type as ElementTypeId
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
  );
}
