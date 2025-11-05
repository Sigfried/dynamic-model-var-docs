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
export interface RelationshipData {
  elementName: string;
  elementType: string;

  // Outgoing relationships (from this element)
  outgoing: {
    inheritance?: {
      target: string;
      targetType: string;
    };
    properties: Array<{
      attributeName: string;   // "specimen_type", "parent_specimen"
      target: string;          // "SpecimenTypeEnum", "Specimen"
      targetType: string;
      isSelfRef: boolean;
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
}

export default function RelationshipInfoBox({ element }: RelationshipInfoBoxProps) {
  if (!element) return null;

  // Get relationship data from element (adapts to component's contract)
  const details = element.getRelationshipData();

  const hasOutgoing = details.outgoing.inheritance || details.outgoing.properties.length > 0;
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
  const outgoingCount = (details.outgoing.inheritance ? 1 : 0) + details.outgoing.properties.length;
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
                → <span className="text-blue-600 dark:text-blue-400">{details.outgoing.inheritance.target}</span>
                <span className="text-gray-500 dark:text-gray-400 text-xs ml-1">({details.outgoing.inheritance.targetType})</span>
              </div>
            </div>
          )}

          {/* Properties */}
          {details.outgoing.properties.length > 0 && (
            <div>
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Properties:</div>
              <div className="ml-3 space-y-1">
                {details.outgoing.properties.map((prop, idx) => (
                  <div key={idx} className="text-sm text-gray-900 dark:text-gray-100">
                    <span className="text-green-600 dark:text-green-400">{prop.attributeName}</span>
                    {' → '}
                    <span className="text-blue-600 dark:text-blue-400">{prop.target}</span>
                    <span className="text-gray-500 dark:text-gray-400 text-xs ml-1">
                      ({prop.targetType}{prop.isSelfRef ? ', self-ref' : ''})
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

          {/* Subclasses */}
          {details.incoming.subclasses.length > 0 && (
            <div className="mb-3">
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                Subclasses ({details.incoming.subclasses.length}):
              </div>
              <div className="ml-3 space-y-0.5">
                {details.incoming.subclasses.map((subclass, idx) => (
                  <div key={idx} className="text-sm text-gray-900 dark:text-gray-100">
                    • <span className="text-blue-600 dark:text-blue-400">{subclass}</span>
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
                    <span className="text-blue-600 dark:text-blue-400">{usage.className}</span>
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
              <div className="ml-3 text-sm text-gray-900 dark:text-gray-100">
                {details.incoming.variables} variable{details.incoming.variables > 1 ? 's' : ''} mapped to this class
              </div>
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
}
