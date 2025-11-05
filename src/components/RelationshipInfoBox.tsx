// Must only import Element from models/, never concrete subclasses or DTOs
/**
 * RelationshipInfoBox - Displays relationship information when hovering over elements
 *
 * Shows:
 * - Outgoing relationships (inheritance, slots with attribute names)
 * - Incoming relationships (subclasses, used by attributes, variables)
 *
 * Appears when user hovers over an element in the tree/panels.
 * Initially positioned near cursor, becomes draggable on interaction.
 *
 * Architecture: Component defines RelationshipData interface specifying what it needs.
 * Element provides data via getRelationshipData() that adapts to this contract.
 */

import type { Element } from '../models/Element';
import { getHeaderColor } from '../utils/panelHelpers';
import type { ElementTypeId } from '../models/ElementRegistry';

/**
 * RelationshipData - Data contract for relationship info box
 * Component defines this interface; Element provides data via getRelationshipData()
 */
interface SlotInfo {
  attributeName: string;   // "specimen_type", "parent_specimen"
  target: string;          // "SpecimenTypeEnum", "Specimen"
  targetType: string;
  isSelfRef: boolean;
}

export interface RelationshipData {
  elementName: string;
  elementType: string;

  // Outgoing relationships (from this element)
  outgoing: {
    inheritance?: {
      target: string;
      targetType: string;
    };
    slots: SlotInfo[];
    inheritedSlots: Array<{
      ancestorName: string;
      slots: SlotInfo[];
    }>;
  };

  // Incoming relationships (to this element)
  incoming: {
    subclasses: string[];      // Classes that inherit from this
    usedByAttributes: Array<{
      className: string;       // "Specimen"
      attributeName: string;   // "specimen_type"
      sourceType: string;
    }>;
    variables: number;         // Count of variables mapped to this class
  };
}

interface RelationshipInfoBoxProps {
  element: Element | null;
  onNavigate?: (elementName: string, elementType: 'class' | 'enum' | 'slot' | 'variable') => void;
}

export default function RelationshipInfoBox({ element, onNavigate }: RelationshipInfoBoxProps) {
  if (!element) return null;

  // Get relationship data from element (adapts to component's contract)
  const details = element.getRelationshipData();

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

  const hasOutgoing = details.outgoing.inheritance || details.outgoing.slots.length > 0;
  const hasIncoming =
    details.incoming.subclasses.length > 0 ||
    details.incoming.usedByAttributes.length > 0 ||
    details.incoming.variables > 0;

  if (!hasOutgoing && !hasIncoming) {
    const headerColor = getHeaderColor(element.type as ElementTypeId);
    return (
      <div className="fixed top-4 right-4 w-[500px] bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50">
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

  const headerColor = getHeaderColor(element.type as ElementTypeId);

  // Count relationships
  const outgoingCount = (details.outgoing.inheritance ? 1 : 0) + details.outgoing.slots.length;
  const incomingCount = details.incoming.subclasses.length + details.incoming.usedByAttributes.length + (details.incoming.variables > 0 ? 1 : 0);

  return (
    <div className="fixed top-4 right-4 w-[500px] bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50 max-h-[80vh] flex flex-col">
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
                {details.outgoing.slots.map((prop, idx) => (
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
                ))}
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
                    {ancestorGroup.slots.map((slot, slotIdx) => (
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
                {details.incoming.subclasses.map((subclass, idx) => (
                  <div key={idx} className="text-sm text-gray-900 dark:text-gray-100">
                    • {makeClickable(subclass, 'class', "text-blue-600 dark:text-blue-400")}
                  </div>
                ))}
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
                {details.incoming.usedByAttributes.map((usage, idx) => (
                  <div key={idx} className="text-sm text-gray-900 dark:text-gray-100">
                    {makeClickable(usage.className, 'class', "text-blue-600 dark:text-blue-400")}
                    <span className="text-gray-500 dark:text-gray-400">.</span>
                    <span className="text-green-600 dark:text-green-400">{usage.attributeName}</span>
                    <span className="text-gray-500 dark:text-gray-400 text-xs ml-1">({usage.sourceType})</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Variables */}
          {details.incoming.variables > 0 && (
            <div>
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Variables:</div>
              <div className="ml-3 text-sm">
                <span className="text-purple-600 dark:text-purple-400 font-medium">{details.incoming.variables}</span>
                <span className="text-gray-900 dark:text-gray-100"> variable{details.incoming.variables > 1 ? 's' : ''} mapped to this class</span>
              </div>
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
}
