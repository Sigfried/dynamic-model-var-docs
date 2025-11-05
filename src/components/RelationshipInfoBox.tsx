/**
 * RelationshipInfoBox - Displays relationship information when hovering over items
 *
 * Shows:
 * - Outgoing relationships (inheritance, slots with attribute names)
 * - Incoming relationships (subclasses, used by attributes, variables)
 *
 * Appears when user hovers over an item in the tree/panels.
 * Initially positioned near cursor, can upgrade to persistent mode on interaction.
 *
 * Architecture: Uses DataService to fetch relationship data by item ID - maintains view/model separation!
 * This component never sees Element instances, only plain data objects.
 * UI layer terminology: "item" (model layer uses "element")
 */

import { useState, useEffect, useRef } from 'react';
import type { DataService, RelationshipData } from '../services/DataService';
import { getHeaderColor } from '../utils/panelHelpers';
import type { ElementTypeId } from '../models/ElementRegistry';

interface RelationshipInfoBoxProps {
  itemId: string | null;
  dataService: DataService | null;
  cursorPosition?: { x: number; y: number } | null;
  onNavigate?: (itemName: string, itemType: 'class' | 'enum' | 'slot' | 'variable') => void;
  onUpgrade?: () => void;  // Callback when box should upgrade to persistent mode
}

export default function RelationshipInfoBox({ itemId, dataService, cursorPosition, onNavigate, onUpgrade }: RelationshipInfoBoxProps) {
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
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lingerTimerRef = useRef<NodeJS.Timeout | null>(null);
  const upgradeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced hover effect
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

    if (itemId) {
      // Item hovered - show after short delay (ignore quick pass-overs)
      hoverTimerRef.current = setTimeout(() => {
        setDisplayedItemId(itemId);
        // Position box in white space to the right of all visible panels
        if (cursorPosition) {
          const boxWidth = 500;
          const maxBoxHeight = window.innerHeight * 0.8; // max-h-[80vh]

          // Find the rightmost edge of visible panels
          // Check for elements with data-panel-position to determine panel width
          const leftPanel = document.querySelector('[data-panel-position="left"]')?.parentElement?.parentElement;
          const rightPanel = document.querySelector('[data-panel-position="right"]')?.parentElement?.parentElement;

          let rightmostEdge = 0;
          if (rightPanel) {
            rightmostEdge = rightPanel.getBoundingClientRect().right;
          } else if (leftPanel) {
            rightmostEdge = leftPanel.getBoundingClientRect().right;
          }

          // Position in white space with small margin
          const xPosition = Math.max(370, rightmostEdge + 20);

          // Calculate available space below and above cursor
          const spaceBelow = window.innerHeight - cursorPosition.y;
          const spaceAbove = cursorPosition.y;

          // Decide whether to position above or below cursor
          let yPosition: number;
          if (spaceBelow < maxBoxHeight + 20 && spaceAbove > spaceBelow) {
            // Not enough space below but more space above - position above cursor
            yPosition = Math.max(10, cursorPosition.y - maxBoxHeight - 20);
          } else {
            // Position near cursor Y, clamped to viewport
            yPosition = Math.min(
              Math.max(10, cursorPosition.y - 100), // Offset slightly above cursor
              window.innerHeight - maxBoxHeight - 10 // 10px margin from bottom
            );
          }

          setBoxPosition({
            x: xPosition,
            y: Math.max(10, yPosition) // Ensure at least 10px from top
          });
        }
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
  }, [itemId, displayedItemId, cursorPosition]);

  // Handlers for upgrading to persistent mode
  const handleBoxMouseEnter = () => {
    // Cancel linger timer when hovering over the box
    if (lingerTimerRef.current) {
      clearTimeout(lingerTimerRef.current);
      lingerTimerRef.current = null;
    }

    // After 1.5s hover, trigger upgrade callback
    upgradeTimerRef.current = setTimeout(() => {
      if (onUpgrade) {
        onUpgrade();
      }
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
      setDisplayedElement(null);
    }, 1500);
  };

  const handleBoxClick = () => {
    // Clicking immediately triggers upgrade
    if (onUpgrade) {
      onUpgrade();
    }
    if (upgradeTimerRef.current) {
      clearTimeout(upgradeTimerRef.current);
      upgradeTimerRef.current = null;
    }
  };

  if (!displayedItemId || !dataService) return null;

  // Get relationship data from data service
  const details = dataService.getRelationships(displayedItemId);

  if (!details) return null;

  // Helper to make element names clickable
  const makeClickable = (
    name: string,
    type: 'class' | 'enum' | 'slot' | 'variable',
    className: string
  ) => {
    if (!onNavigate) {
      return <span className={className}>{name}</span>;
    }
    return (
      <button
        onClick={() => onNavigate(name, type)}
        className={`${className} hover:underline cursor-pointer`}
      >
        {name}
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
    slots: SlotInfo[],
    threshold: number = 20
  ) => {
    const isExpanded = expandedSections.inheritedSlots[ancestorName] || false;
    const shouldCollapse = slots.length > threshold;
    const visibleSlots = shouldCollapse && !isExpanded ? slots.slice(0, 10) : slots;
    const remainingCount = slots.length - 10;

    return (
      <>
        {visibleSlots.map((slot, slotIdx) => (
          <div key={slotIdx} className="text-sm text-gray-900 dark:text-gray-100">
            <span className="text-green-600 dark:text-green-400">{slot.attributeName}</span>
            {' → '}
            {makeClickable(
              slot.target,
              slot.targetType as 'class' | 'enum' | 'slot',
              slot.isSelfRef ? "text-orange-600 dark:text-orange-400" : "text-blue-600 dark:text-blue-400"
            )}
            <span className="text-gray-500 dark:text-gray-400 text-xs ml-1">
              ({slot.targetType}{slot.isSelfRef ? ', self-ref' : ''})
            </span>
          </div>
        ))}
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

  const hasOutgoing = details.outgoing.inheritance || details.outgoing.slots.length > 0;
  const hasIncoming =
    details.incoming.subclasses.length > 0 ||
    details.incoming.usedByAttributes.length > 0 ||
    details.incoming.variables.length > 0;

  if (!hasOutgoing && !hasIncoming) {
    const headerColor = getHeaderColor(details.elementType as ElementTypeId);
    return (
      <div
        className="fixed w-[500px] bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50"
        style={{ left: `${boxPosition.x}px`, top: `${boxPosition.y}px` }}
        onMouseEnter={handleBoxMouseEnter}
        onMouseLeave={handleBoxMouseLeave}
        onClick={handleBoxClick}
      >
        <div className={`${headerColor} px-4 py-2 rounded-t-lg border-b`}>
          <h3 className="font-semibold text-white">
            {details.elementName} relationships
          </h3>
        </div>
        <div className="p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">No relationships found</p>
        </div>
      </div>
    );
  }

  const headerColor = getHeaderColor(details.elementType as ElementTypeId);

  // Count relationships
  const outgoingCount = (details.outgoing.inheritance ? 1 : 0) + details.outgoing.slots.length;
  const incomingCount = details.incoming.subclasses.length + details.incoming.usedByAttributes.length + details.incoming.variables.length;

  return (
    <div
      className="fixed w-[500px] bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50 max-h-[80vh] flex flex-col"
      style={{ left: `${boxPosition.x}px`, top: `${boxPosition.y}px` }}
      onMouseEnter={handleBoxMouseEnter}
      onMouseLeave={handleBoxMouseLeave}
      onClick={handleBoxClick}
    >
      <div className={`${headerColor} px-4 py-2 rounded-t-lg border-b`}>
        <h3 className="font-semibold text-white flex items-center gap-2">
          <span>{details.elementName} relationships</span>
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
          {details.outgoing.inheritance && (
            <div className="mb-3">
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Inheritance:</div>
              <div className="ml-3 text-sm text-gray-900 dark:text-gray-100">
                → {makeClickable(details.outgoing.inheritance.target, 'class', "text-blue-600 dark:text-blue-400")}
                <span className="text-gray-500 dark:text-gray-400 text-xs ml-1">({details.outgoing.inheritance.targetType})</span>
              </div>
            </div>
          )}

          {/* Slots */}
          {details.outgoing.slots.length > 0 && (
            <div>
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Slots:</div>
              <div className="ml-3 space-y-1">
                {renderCollapsibleList(
                  details.outgoing.slots,
                  'slots',
                  (prop, idx) => (
                    <div key={idx} className="text-sm text-gray-900 dark:text-gray-100">
                      <span className="text-green-600 dark:text-green-400">{prop.attributeName}</span>
                      {' → '}
                      {makeClickable(
                        prop.target,
                        prop.targetType as 'class' | 'enum' | 'slot',
                        prop.isSelfRef ? "text-orange-600 dark:text-orange-400" : "text-blue-600 dark:text-blue-400"
                      )}
                      <span className="text-gray-500 dark:text-gray-400 text-xs ml-1">
                        ({prop.targetType}{prop.isSelfRef ? ', self-ref' : ''})
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* Inherited Slots */}
          {details.outgoing.inheritedSlots.length > 0 && (
            <div className="mt-3">
              {details.outgoing.inheritedSlots.map((ancestorGroup, groupIdx) => (
                <div key={groupIdx} className="mb-2">
                  <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Inherited from {ancestorGroup.ancestorName}:
                  </div>
                  <div className="ml-3 space-y-1">
                    {renderCollapsibleInheritedSlots(ancestorGroup.ancestorName, ancestorGroup.slots)}
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
          {details.incoming.subclasses.length > 0 && (
            <div className="mb-3">
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Subclasses ({details.incoming.subclasses.length}):
              </div>
              <div className="ml-3 space-y-0.5">
                {renderCollapsibleList(
                  details.incoming.subclasses,
                  'subclasses',
                  (subclass, idx) => (
                    <div key={idx} className="text-sm text-gray-900 dark:text-gray-100">
                      • {makeClickable(subclass, 'class', "text-blue-600 dark:text-blue-400")}
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* Used By Attributes */}
          {details.incoming.usedByAttributes.length > 0 && (
            <div className="mb-3">
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Used By ({details.incoming.usedByAttributes.length}):
              </div>
              <div className="ml-3 space-y-0.5">
                {renderCollapsibleList(
                  details.incoming.usedByAttributes,
                  'usedBy',
                  (usage, idx) => (
                    <div key={idx} className="text-sm text-gray-900 dark:text-gray-100">
                      {makeClickable(usage.className, 'class', "text-blue-600 dark:text-blue-400")}
                      <span className="text-gray-500 dark:text-gray-400">.</span>
                      <span className="text-green-600 dark:text-green-400">{usage.attributeName}</span>
                      <span className="text-gray-500 dark:text-gray-400 text-xs ml-1">({usage.sourceType})</span>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* Variables */}
          {details.incoming.variables.length > 0 && (
            <div>
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Variables ({details.incoming.variables.length}):
              </div>
              <div className="ml-3 space-y-0.5">
                {renderCollapsibleList(
                  details.incoming.variables,
                  'variables',
                  (variable, idx) => (
                    <div key={idx} className="text-sm text-gray-900 dark:text-gray-100">
                      • {makeClickable(variable.name, 'variable', "text-purple-600 dark:text-purple-400")}
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
