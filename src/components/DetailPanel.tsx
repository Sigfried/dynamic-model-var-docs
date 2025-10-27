import React from 'react';
import type { ClassNode, EnumDefinition, SlotDefinition, VariableSpec, SelectedElement } from '../types';

interface DetailPanelProps {
  selectedElement?: SelectedElement;
  onNavigate?: (elementName: string, elementType: 'class' | 'enum' | 'slot') => void;
  onClose?: () => void;
  enums?: Map<string, EnumDefinition>;
  slots?: Map<string, SlotDefinition>;
  classes?: Map<string, ClassNode>;
  dialogWidth?: number;
  hideHeader?: boolean;  // Hide the element name header (when shown in dialog/panel header)
  hideCloseButton?: boolean;  // Hide the internal close button (when handled externally)
}

function isEnumDefinition(element: SelectedElement): element is EnumDefinition {
  return 'permissible_values' in element;
}

function isSlotDefinition(element: SelectedElement): element is SlotDefinition {
  return 'slot_uri' in element || ('range' in element && !('children' in element) && !('permissible_values' in element));
}

function isVariableSpec(element: SelectedElement): element is VariableSpec {
  return 'variableLabel' in element && 'bdchmElement' in element;
}

// Primitive types in LinkML
const PRIMITIVE_TYPES = new Set([
  'string', 'integer', 'boolean', 'float', 'double', 'decimal',
  'date', 'datetime', 'time', 'uriorcurie', 'uri', 'ncname'
]);

type RangeCategory = 'primitive' | 'enum' | 'class' | 'unknown';

function categorizeRange(range: string): RangeCategory {
  if (!range || range === 'unknown') return 'unknown';
  if (PRIMITIVE_TYPES.has(range.toLowerCase())) return 'primitive';
  if (range.endsWith('Enum')) return 'enum';
  return 'class';
}

// Slot/attribute information with source tracking
interface SlotInfo {
  name: string;
  definition: any; // Property or slot definition with range, required, etc.
  source: 'inline' | 'slot' | 'inherited'; // Where this slot comes from
  sourceDetail?: string; // e.g., slot name or parent class name
  isRefined?: boolean; // Whether slot_usage refinements are applied
}

/**
 * Collect all slots/attributes for a class including:
 * - Inline attributes
 * - Referenced top-level slots
 * - Inherited slots from parent classes
 * - slot_usage refinements applied
 */
function collectAllSlots(
  classNode: ClassNode,
  classesMap: Map<string, ClassNode>,
  slotsMap: Map<string, SlotDefinition>
): SlotInfo[] {
  const slotMap = new Map<string, SlotInfo>();

  // Walk up the inheritance chain from root to current class
  const inheritanceChain: ClassNode[] = [];
  let current: ClassNode | undefined = classNode;
  while (current) {
    inheritanceChain.unshift(current); // Add to front
    current = current.parent ? classesMap.get(current.parent) : undefined;
  }

  // Process each class in the chain (root to leaf)
  for (const cls of inheritanceChain) {
    const isCurrentClass = cls.name === classNode.name;

    // Add inline attributes (properties)
    if (cls.properties) {
      for (const [propName, propDef] of Object.entries(cls.properties)) {
        slotMap.set(propName, {
          name: propName,
          definition: { ...propDef },
          source: isCurrentClass ? 'inline' : 'inherited',
          sourceDetail: isCurrentClass ? undefined : cls.name
        });
      }
    }

    // Add referenced slots
    if (cls.slots && cls.slots.length > 0) {
      for (const slotName of cls.slots) {
        const slotDef = slotsMap.get(slotName);
        if (slotDef) {
          slotMap.set(slotName, {
            name: slotName,
            definition: { ...slotDef },
            source: isCurrentClass ? 'slot' : 'inherited',
            sourceDetail: isCurrentClass ? slotName : cls.name
          });
        }
      }
    }
  }

  // Apply slot_usage refinements for the current class
  if (classNode.slot_usage) {
    for (const [slotName, refinements] of Object.entries(classNode.slot_usage)) {
      const existing = slotMap.get(slotName);
      if (existing) {
        // Apply refinements (overwrite with new values)
        existing.definition = {
          ...existing.definition,
          ...refinements
        };
        existing.isRefined = true;
      }
    }
  }

  return Array.from(slotMap.values()).sort((a, b) => a.name.localeCompare(b.name));
}

function getRangeColor(category: RangeCategory): string {
  switch (category) {
    case 'primitive':
      return 'text-green-700 dark:text-green-400';
    case 'enum':
      return 'text-purple-700 dark:text-purple-400';
    case 'class':
      return 'text-blue-700 dark:text-blue-400';
    default:
      return 'text-gray-500 dark:text-gray-400';
  }
}

function TypeLegend() {
  return (
    <div className="absolute right-0 top-0 mt-8 mr-4 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg shadow-lg p-4 text-sm z-10 min-w-[200px]">
      <h4 className="font-semibold mb-2">Type Categories</h4>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-green-700 dark:text-green-400 font-mono">primitive</span>
          <span className="text-gray-600 dark:text-gray-400 text-xs">string, integer, etc.</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-purple-700 dark:text-purple-400 font-mono">enum</span>
          <span className="text-gray-600 dark:text-gray-400 text-xs">constrained values</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-blue-700 dark:text-blue-400 font-mono">class</span>
          <span className="text-gray-600 dark:text-gray-400 text-xs">other model classes</span>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-slate-600 space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-red-600 dark:text-red-400">*</span>
          <span className="text-gray-600 dark:text-gray-400 text-xs">required</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-600 dark:text-gray-400">[]</span>
          <span className="text-gray-600 dark:text-gray-400 text-xs">multivalued</span>
        </div>
      </div>
    </div>
  );
}

export default function DetailPanel({ selectedElement, onNavigate, onClose, enums, slots, classes, dialogWidth = 900, hideHeader = false, hideCloseButton = false }: DetailPanelProps) {
  const useTwoColumnsForVariables = dialogWidth >= 1700;
  const useTwoColumnsForEnums = dialogWidth >= 1000;
  const [showLegend, setShowLegend] = React.useState(false);

  // Helper function to determine element type and navigate
  const handleRangeClick = (rangeName: string) => {
    if (!onNavigate) return;

    if (enums?.has(rangeName)) {
      onNavigate(rangeName, 'enum');
    } else if (slots?.has(rangeName)) {
      onNavigate(rangeName, 'slot');
    } else if (classes?.has(rangeName)) {
      onNavigate(rangeName, 'class');
    }
  };

  // Helper function to determine if a range is clickable
  const isRangeClickable = (rangeName: string): boolean => {
    return !!(enums?.has(rangeName) || slots?.has(rangeName) || classes?.has(rangeName));
  };

  if (!selectedElement) {
    return null; // Hide panel when nothing is selected
  }

  // Handle variable details
  if (isVariableSpec(selectedElement)) {
    return (
      <div className="h-full overflow-y-auto bg-white dark:bg-slate-800 text-left">
        {!hideHeader && (
          <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-6 py-4">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-left">{selectedElement.variableLabel}</h1>
                <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">Variable</p>
              </div>
              {onClose && !hideCloseButton && (
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  title="Close detail panel"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}

        <div className="p-4 space-y-3 text-left">
          {selectedElement.variableDescription && (
            <div>
              <h2 className="text-lg font-semibold mb-1">Description</h2>
              <p className="text-gray-700 dark:text-gray-300">{selectedElement.variableDescription}</p>
            </div>
          )}

          <div>
            <h2 className="text-lg font-semibold mb-1">Specifications</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <tbody>
                  <tr className="hover:bg-gray-50 dark:hover:bg-slate-700">
                    <td className="border border-gray-300 dark:border-slate-600 px-4 py-2 font-semibold">BDCHM Element</td>
                    <td className="border border-gray-300 dark:border-slate-600 px-4 py-2 font-mono text-sm">
                      <button
                        onClick={() => handleRangeClick(selectedElement.bdchmElement)}
                        className={`${classes?.has(selectedElement.bdchmElement) ? 'text-blue-700 dark:text-blue-400 underline hover:opacity-70 transition-opacity' : ''}`}
                      >
                        {selectedElement.bdchmElement}
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-slate-700">
                    <td className="border border-gray-300 dark:border-slate-600 px-4 py-2 font-semibold">Data Type</td>
                    <td className="border border-gray-300 dark:border-slate-600 px-4 py-2 text-sm">
                      {selectedElement.dataType}
                    </td>
                  </tr>
                  {selectedElement.ucumUnit && (
                    <tr className="hover:bg-gray-50 dark:hover:bg-slate-700">
                      <td className="border border-gray-300 dark:border-slate-600 px-4 py-2 font-semibold">UCUM Unit</td>
                      <td className="border border-gray-300 dark:border-slate-600 px-4 py-2 font-mono text-sm">
                        {selectedElement.ucumUnit}
                      </td>
                    </tr>
                  )}
                  {selectedElement.curie && (
                    <tr className="hover:bg-gray-50 dark:hover:bg-slate-700">
                      <td className="border border-gray-300 dark:border-slate-600 px-4 py-2 font-semibold">CURIE</td>
                      <td className="border border-gray-300 dark:border-slate-600 px-4 py-2 font-mono text-sm">
                        {selectedElement.curie}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle enum details
  if (isEnumDefinition(selectedElement)) {
    return (
      <div className="h-full overflow-y-auto bg-white dark:bg-slate-800 text-left">
        {!hideHeader && (
          <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-6 py-4">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-left">{selectedElement.name}</h1>
                <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">Enumeration</p>
              </div>
              {onClose && !hideCloseButton && (
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  title="Close detail panel"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}

        <div className="p-4 space-y-3 text-left">
          {selectedElement.description && (
            <div>
              <h2 className="text-lg font-semibold mb-1">Description</h2>
              <p className="text-gray-700 dark:text-gray-300">{selectedElement.description}</p>
            </div>
          )}

          {selectedElement.permissible_values.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-1">
                Permissible Values ({selectedElement.permissible_values.length})
              </h2>
              {useTwoColumnsForEnums && selectedElement.permissible_values.length > 10 ? (
              // Two-column layout for wide dialogs with many permissible values
              <div className="grid grid-cols-2 gap-4">
                {[0, 1].map(columnIndex => {
                  const halfLength = Math.ceil(selectedElement.permissible_values.length / 2);
                  const startIdx = columnIndex * halfLength;
                  const columnValues = selectedElement.permissible_values.slice(startIdx, startIdx + halfLength);

                  return (
                    <div key={columnIndex} className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-50 dark:bg-slate-700">
                            <th className="border border-gray-300 dark:border-slate-600 px-2 py-2 text-left text-sm">Value</th>
                            <th className="border border-gray-300 dark:border-slate-600 px-2 py-2 text-left text-sm">Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          {columnValues.map((value, idx) => (
                            <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                              <td className="border border-gray-300 dark:border-slate-600 px-2 py-2 font-mono text-sm">
                                {value.key}
                              </td>
                              <td className="border border-gray-300 dark:border-slate-600 px-2 py-2 text-sm">
                                {value.description || '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                })}
              </div>
            ) : (
              // Single-column layout for narrow dialogs or few values
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-slate-700">
                      <th className="border border-gray-300 dark:border-slate-600 px-4 py-2 text-left">Value</th>
                      <th className="border border-gray-300 dark:border-slate-600 px-4 py-2 text-left">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedElement.permissible_values.map((value, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                        <td className="border border-gray-300 dark:border-slate-600 px-4 py-2 font-mono text-sm">
                          {value.key}
                        </td>
                        <td className="border border-gray-300 dark:border-slate-600 px-4 py-2 text-sm">
                          {value.description || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            </div>
          )}

          {selectedElement.usedByClasses.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-1">
                Used By Classes ({selectedElement.usedByClasses.length})
              </h2>
              <div className="flex flex-wrap gap-2">
                {selectedElement.usedByClasses.map(className => (
                  <button
                    key={className}
                    onClick={() => handleRangeClick(className)}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-mono hover:bg-blue-200 dark:hover:bg-blue-800 cursor-pointer transition-colors"
                  >
                    {className}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Handle slot details
  if (isSlotDefinition(selectedElement)) {
    return (
      <div className="h-full overflow-y-auto bg-white dark:bg-slate-800 text-left">
        {!hideHeader && (
          <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-6 py-4">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-left">{selectedElement.name}</h1>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">Slot</p>
              </div>
              {onClose && !hideCloseButton && (
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  title="Close detail panel"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}

        <div className="p-4 space-y-3 text-left">
          {selectedElement.description && (
            <div>
              <h2 className="text-lg font-semibold mb-1">Description</h2>
              <p className="text-gray-700 dark:text-gray-300">{selectedElement.description}</p>
            </div>
          )}

          <div>
            <h2 className="text-lg font-semibold mb-1">Properties</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <tbody>
                  {selectedElement.range && (
                    <tr className="hover:bg-gray-50 dark:hover:bg-slate-700">
                      <td className="border border-gray-300 dark:border-slate-600 px-4 py-2 font-semibold">Range</td>
                      <td className="border border-gray-300 dark:border-slate-600 px-4 py-2 font-mono text-sm">
                        {selectedElement.range}
                      </td>
                    </tr>
                  )}
                  {selectedElement.slot_uri && (
                    <tr className="hover:bg-gray-50 dark:hover:bg-slate-700">
                      <td className="border border-gray-300 dark:border-slate-600 px-4 py-2 font-semibold">URI</td>
                      <td className="border border-gray-300 dark:border-slate-600 px-4 py-2 font-mono text-sm">
                        {selectedElement.slot_uri}
                      </td>
                    </tr>
                  )}
                  {selectedElement.identifier !== undefined && (
                    <tr className="hover:bg-gray-50 dark:hover:bg-slate-700">
                      <td className="border border-gray-300 dark:border-slate-600 px-4 py-2 font-semibold">Identifier</td>
                      <td className="border border-gray-300 dark:border-slate-600 px-4 py-2 text-sm">
                        {selectedElement.identifier ? 'Yes' : 'No'}
                      </td>
                    </tr>
                  )}
                  {selectedElement.required !== undefined && (
                    <tr className="hover:bg-gray-50 dark:hover:bg-slate-700">
                      <td className="border border-gray-300 dark:border-slate-600 px-4 py-2 font-semibold">Required</td>
                      <td className="border border-gray-300 dark:border-slate-600 px-4 py-2 text-sm">
                        {selectedElement.required ? 'Yes' : 'No'}
                      </td>
                    </tr>
                  )}
                  {selectedElement.multivalued !== undefined && (
                    <tr className="hover:bg-gray-50 dark:hover:bg-slate-700">
                      <td className="border border-gray-300 dark:border-slate-600 px-4 py-2 font-semibold">Multivalued</td>
                      <td className="border border-gray-300 dark:border-slate-600 px-4 py-2 text-sm">
                        {selectedElement.multivalued ? 'Yes' : 'No'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {selectedElement.usedByClasses.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-1">
                Used By Classes ({selectedElement.usedByClasses.length})
              </h2>
              <div className="flex flex-wrap gap-2">
                {selectedElement.usedByClasses.map(className => (
                  <button
                    key={className}
                    onClick={() => handleRangeClick(className)}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-mono hover:bg-blue-200 dark:hover:bg-blue-800 cursor-pointer transition-colors"
                  >
                    {className}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Handle class details (original code)
  const selectedClass = selectedElement as ClassNode;

  return (
    <div className="h-full overflow-y-auto bg-white dark:bg-slate-800 text-left">
      {!hideHeader && (
        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-6 py-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-left">{selectedClass.name}</h1>
              {selectedClass.parent && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 text-left">
                  extends {selectedClass.parent}
                </p>
              )}
            </div>
            {onClose && !hideCloseButton && (
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                title="Close detail panel"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}

      <div className="p-4 space-y-3 text-left">
        {/* Description */}
        {selectedClass.description && (
          <div>
            <h2 className="text-lg font-semibold mb-1">Description</h2>
            <p className="text-gray-700 dark:text-gray-300">{selectedClass.description}</p>
          </div>
        )}

        {/* Required Properties */}
        {selectedClass.requiredProperties && selectedClass.requiredProperties.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-1">Required Properties</h2>
            <div className="flex flex-wrap gap-2">
              {selectedClass.requiredProperties.map(prop => (
                <span
                  key={prop}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-mono"
                >
                  {prop}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Enum References */}
        {selectedClass.enumReferences && selectedClass.enumReferences.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-1">
              Referenced Enums ({selectedClass.enumReferences.length})
            </h2>
            <div className="flex flex-wrap gap-2">
              {selectedClass.enumReferences.map(enumName => (
                <button
                  key={enumName}
                  onClick={() => handleRangeClick(enumName)}
                  className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm font-mono hover:bg-purple-200 dark:hover:bg-purple-800 cursor-pointer transition-colors"
                >
                  {enumName}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Slots (includes inline attributes, referenced slots, and inherited) */}
        {(() => {
          const allSlots = classes && slots ? collectAllSlots(selectedClass, classes, slots) : [];
          return allSlots.length > 0 && (
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-lg font-semibold">
                  Slots ({allSlots.length})
                </h2>
                <button
                  onMouseEnter={() => setShowLegend(true)}
                  onMouseLeave={() => setShowLegend(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  title="Show legend"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              {showLegend && <TypeLegend />}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-slate-700">
                      <th className="border border-gray-300 dark:border-slate-600 px-4 py-2 text-left">
                        Slot
                      </th>
                      <th className="border border-gray-300 dark:border-slate-600 px-4 py-2 text-left">
                        Type
                      </th>
                      <th className="border border-gray-300 dark:border-slate-600 px-4 py-2 text-left">
                        Source
                      </th>
                      <th className="border border-gray-300 dark:border-slate-600 px-4 py-2 text-left">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {allSlots.map((slotInfo) => {
                      const range = slotInfo.definition.range || 'unknown';
                      const category = categorizeRange(range);
                      const colorClass = getRangeColor(category);
                      const clickable = isRangeClickable(range);

                      return (
                        <tr key={slotInfo.name} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                          <td className="border border-gray-300 dark:border-slate-600 px-4 py-2 font-mono text-sm">
                            <div className="flex items-center gap-2">
                              <span>{slotInfo.name}</span>
                              {slotInfo.definition.required && (
                                <span className="text-red-600 dark:text-red-400" title="Required">
                                  *
                                </span>
                              )}
                              {slotInfo.definition.multivalued && (
                                <span className="text-gray-600 dark:text-gray-400 text-xs" title="Multivalued">
                                  []
                                </span>
                              )}
                              {slotInfo.isRefined && (
                                <span className="text-blue-600 dark:text-blue-400 text-sm font-bold" title="Refined via slot_usage">
                                  ⚡
                                </span>
                              )}
                            </div>
                          </td>
                          <td className={`border border-gray-300 dark:border-slate-600 px-4 py-2 text-sm font-mono ${colorClass}`}>
                            {slotInfo.definition.multivalued && 'array<'}
                            {clickable ? (
                              <button
                                onClick={() => handleRangeClick(range)}
                                className="underline hover:opacity-70 transition-opacity"
                              >
                                {range}
                              </button>
                            ) : (
                              <span>{range}</span>
                            )}
                            {slotInfo.definition.multivalued && '>'}
                          </td>
                          <td className="border border-gray-300 dark:border-slate-600 px-4 py-2 text-xs">
                            {slotInfo.source === 'inline' && 'Inline'}
                            {slotInfo.source === 'slot' && slotInfo.sourceDetail && (
                              <button
                                onClick={() => handleRangeClick(slotInfo.sourceDetail!)}
                                className="text-green-700 dark:text-green-400 underline hover:opacity-70"
                              >
                                Slot: {slotInfo.sourceDetail}
                              </button>
                            )}
                            {slotInfo.source === 'inherited' && slotInfo.sourceDetail && (
                              <button
                                onClick={() => handleRangeClick(slotInfo.sourceDetail!)}
                                className="text-gray-600 dark:text-gray-400 underline hover:opacity-70"
                              >
                                ← {slotInfo.sourceDetail}
                              </button>
                            )}
                          </td>
                          <td className="border border-gray-300 dark:border-slate-600 px-4 py-2 text-sm">
                            {slotInfo.definition.description || '-'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })()}

        {/* Variables */}
        {selectedClass.variables && selectedClass.variables.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-1">
              Mapped Variables ({selectedClass.variables.length})
            </h2>
            {useTwoColumnsForVariables && selectedClass.variables.length > 10 ? (
              // Two-column layout for wide dialogs with many variables
              <div className="grid grid-cols-2 gap-4">
                {[0, 1].map(columnIndex => {
                  const halfLength = Math.ceil(selectedClass.variables.length / 2);
                  const startIdx = columnIndex * halfLength;
                  const columnVars = selectedClass.variables.slice(startIdx, startIdx + halfLength);

                  return (
                    <div key={columnIndex} className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-50 dark:bg-slate-700">
                            <th className="border border-gray-300 dark:border-slate-600 px-2 py-2 text-left text-sm">
                              Label
                            </th>
                            <th className="border border-gray-300 dark:border-slate-600 px-2 py-2 text-left text-sm">
                              Data Type
                            </th>
                            <th className="border border-gray-300 dark:border-slate-600 px-2 py-2 text-left text-sm">
                              Unit
                            </th>
                            <th className="border border-gray-300 dark:border-slate-600 px-2 py-2 text-left text-sm">
                              CURIE
                            </th>
                            <th className="border border-gray-300 dark:border-slate-600 px-2 py-2 text-left text-sm">
                              Description
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {columnVars.map((variable, idx) => (
                            <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                              <td className="border border-gray-300 dark:border-slate-600 px-2 py-2 text-sm font-medium">
                                {variable.variableLabel}
                              </td>
                              <td className="border border-gray-300 dark:border-slate-600 px-2 py-2 text-sm">
                                {variable.dataType}
                              </td>
                              <td className="border border-gray-300 dark:border-slate-600 px-2 py-2 text-sm font-mono">
                                {variable.ucumUnit || '-'}
                              </td>
                              <td className="border border-gray-300 dark:border-slate-600 px-2 py-2 text-sm font-mono">
                                {variable.curie || '-'}
                              </td>
                              <td className="border border-gray-300 dark:border-slate-600 px-2 py-2 text-sm">
                                {variable.variableDescription || '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                })}
              </div>
            ) : (
              // Single-column layout for narrow dialogs or few variables
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-slate-700">
                      <th className="border border-gray-300 dark:border-slate-600 px-4 py-2 text-left">
                        Label
                      </th>
                      <th className="border border-gray-300 dark:border-slate-600 px-4 py-2 text-left">
                        Data Type
                      </th>
                      <th className="border border-gray-300 dark:border-slate-600 px-4 py-2 text-left">
                        Unit
                      </th>
                      <th className="border border-gray-300 dark:border-slate-600 px-4 py-2 text-left">
                        CURIE
                      </th>
                      <th className="border border-gray-300 dark:border-slate-600 px-4 py-2 text-left">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedClass.variables.map((variable, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                        <td className="border border-gray-300 dark:border-slate-600 px-4 py-2 text-sm font-medium">
                          {variable.variableLabel}
                        </td>
                        <td className="border border-gray-300 dark:border-slate-600 px-4 py-2 text-sm">
                          {variable.dataType}
                        </td>
                        <td className="border border-gray-300 dark:border-slate-600 px-4 py-2 text-sm font-mono">
                          {variable.ucumUnit || '-'}
                        </td>
                        <td className="border border-gray-300 dark:border-slate-600 px-4 py-2 text-sm font-mono">
                          {variable.curie || '-'}
                        </td>
                        <td className="border border-gray-300 dark:border-slate-600 px-4 py-2 text-sm">
                          {variable.variableDescription || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* No variables message */}
        {(!selectedClass.variables || selectedClass.variables.length === 0) && (
          <div>
            <h2 className="text-lg font-semibold mb-1">Mapped Variables</h2>
            <p className="text-gray-500 dark:text-gray-400">No variables mapped to this class</p>
          </div>
        )}
      </div>
    </div>
  );
}
