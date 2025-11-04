// Must only import Element from models/, never concrete subclasses or DTOs
/**
 * RelationshipSidebar - Displays relationship information when hovering over elements
 *
 * Shows:
 * - Outgoing relationships (inheritance, properties with attribute names)
 * - Incoming relationships (subclasses, used by attributes, variables)
 *
 * Appears when user hovers over an element in the tree/panels.
 * Fixed position in top-right corner.
 *
 * Architecture: Component defines RelationshipData interface specifying what it needs.
 * Element provides data via getRelationshipData() that adapts to this contract.
 */

import type { Element } from '../models/Element';
import type { ElementTypeId } from '../models/ElementRegistry';

/**
 * RelationshipData - Data contract for relationship sidebar
 * Component defines this interface; Element provides data via getRelationshipData()
 */
export interface RelationshipData {
  elementName: string;
  elementType: ElementTypeId;

  // Outgoing relationships (from this element)
  outgoing: {
    inheritance?: {
      target: string;
      targetType: ElementTypeId;
    };
    properties: Array<{
      attributeName: string;   // "specimen_type", "parent_specimen"
      target: string;          // "SpecimenTypeEnum", "Specimen"
      targetType: ElementTypeId;
      isSelfRef: boolean;
    }>;
  };

  // Incoming relationships (to this element)
  incoming: {
    subclasses: string[];      // Classes that inherit from this
    usedByAttributes: Array<{
      className: string;       // "Specimen"
      attributeName: string;   // "specimen_type"
      sourceType: ElementTypeId;
    }>;
    variables: number;         // Count of variables mapped to this class
  };
}

interface RelationshipSidebarProps {
  element: Element | null;
}

export default function RelationshipSidebar({ element }: RelationshipSidebarProps) {
  if (!element) return null;

  // Get relationship data from element (adapts to component's contract)
  const details = element.getRelationshipData();

  const hasOutgoing = details.outgoing.inheritance || details.outgoing.properties.length > 0;
  const hasIncoming =
    details.incoming.subclasses.length > 0 ||
    details.incoming.usedByAttributes.length > 0 ||
    details.incoming.variables > 0;

  if (!hasOutgoing && !hasIncoming) {
    return (
      <div className="fixed top-4 right-4 w-80 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-4 z-50">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Relationships: {details.elementName}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">No relationships found</p>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 w-80 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-4 z-50 max-h-[80vh] overflow-y-auto">
      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
        Relationships: <span className="text-blue-600 dark:text-blue-400">{details.elementName}</span>
      </h3>

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
  );
}
