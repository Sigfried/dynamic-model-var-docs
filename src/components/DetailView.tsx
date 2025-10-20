import React from 'react';
import type { ClassNode, EnumDefinition, SlotDefinition } from '../types';

type SelectedEntity = ClassNode | EnumDefinition | SlotDefinition;

interface DetailViewProps {
  selectedEntity?: SelectedEntity;
  onNavigate?: (entityName: string, entityType: 'class' | 'enum' | 'slot') => void;
  enums?: Map<string, EnumDefinition>;
  slots?: Map<string, SlotDefinition>;
  classes?: Map<string, ClassNode>;
}

function isEnumDefinition(entity: SelectedEntity): entity is EnumDefinition {
  return 'permissible_values' in entity;
}

function isSlotDefinition(entity: SelectedEntity): entity is SlotDefinition {
  return 'slot_uri' in entity || ('range' in entity && !('children' in entity) && !('permissible_values' in entity));
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

export default function DetailView({ selectedEntity, onNavigate, enums, slots, classes }: DetailViewProps) {
  const [showLegend, setShowLegend] = React.useState(false);

  // Helper function to determine entity type and navigate
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

  if (!selectedEntity) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <p className="text-lg">Select a class, enum, or slot to view details</p>
        </div>
      </div>
    );
  }

  // Handle enum details
  if (isEnumDefinition(selectedEntity)) {
    return (
      <div className="h-full overflow-y-auto bg-white dark:bg-slate-800 text-left">
        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-6 py-4">
          <h1 className="text-2xl font-bold text-left">{selectedEntity.name}</h1>
          <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">Enumeration</p>
        </div>

        <div className="p-6 space-y-6 text-left">
          {selectedEntity.description && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-gray-700 dark:text-gray-300">{selectedEntity.description}</p>
            </div>
          )}

          <div>
            <h2 className="text-lg font-semibold mb-2">
              Permissible Values ({selectedEntity.permissible_values.length})
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-slate-700">
                    <th className="border border-gray-300 dark:border-slate-600 px-4 py-2 text-left">Value</th>
                    <th className="border border-gray-300 dark:border-slate-600 px-4 py-2 text-left">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedEntity.permissible_values.map((value, idx) => (
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
          </div>

          {selectedEntity.usedByClasses.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-2">
                Used By Classes ({selectedEntity.usedByClasses.length})
              </h2>
              <div className="flex flex-wrap gap-2">
                {selectedEntity.usedByClasses.map(className => (
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
  if (isSlotDefinition(selectedEntity)) {
    return (
      <div className="h-full overflow-y-auto bg-white dark:bg-slate-800 text-left">
        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-6 py-4">
          <h1 className="text-2xl font-bold text-left">{selectedEntity.name}</h1>
          <p className="text-sm text-green-600 dark:text-green-400 mt-1">Slot</p>
        </div>

        <div className="p-6 space-y-6 text-left">
          {selectedEntity.description && (
            <div>
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-gray-700 dark:text-gray-300">{selectedEntity.description}</p>
            </div>
          )}

          <div>
            <h2 className="text-lg font-semibold mb-2">Properties</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <tbody>
                  {selectedEntity.range && (
                    <tr className="hover:bg-gray-50 dark:hover:bg-slate-700">
                      <td className="border border-gray-300 dark:border-slate-600 px-4 py-2 font-semibold">Range</td>
                      <td className="border border-gray-300 dark:border-slate-600 px-4 py-2 font-mono text-sm">
                        {selectedEntity.range}
                      </td>
                    </tr>
                  )}
                  {selectedEntity.slot_uri && (
                    <tr className="hover:bg-gray-50 dark:hover:bg-slate-700">
                      <td className="border border-gray-300 dark:border-slate-600 px-4 py-2 font-semibold">URI</td>
                      <td className="border border-gray-300 dark:border-slate-600 px-4 py-2 font-mono text-sm">
                        {selectedEntity.slot_uri}
                      </td>
                    </tr>
                  )}
                  {selectedEntity.identifier !== undefined && (
                    <tr className="hover:bg-gray-50 dark:hover:bg-slate-700">
                      <td className="border border-gray-300 dark:border-slate-600 px-4 py-2 font-semibold">Identifier</td>
                      <td className="border border-gray-300 dark:border-slate-600 px-4 py-2 text-sm">
                        {selectedEntity.identifier ? 'Yes' : 'No'}
                      </td>
                    </tr>
                  )}
                  {selectedEntity.required !== undefined && (
                    <tr className="hover:bg-gray-50 dark:hover:bg-slate-700">
                      <td className="border border-gray-300 dark:border-slate-600 px-4 py-2 font-semibold">Required</td>
                      <td className="border border-gray-300 dark:border-slate-600 px-4 py-2 text-sm">
                        {selectedEntity.required ? 'Yes' : 'No'}
                      </td>
                    </tr>
                  )}
                  {selectedEntity.multivalued !== undefined && (
                    <tr className="hover:bg-gray-50 dark:hover:bg-slate-700">
                      <td className="border border-gray-300 dark:border-slate-600 px-4 py-2 font-semibold">Multivalued</td>
                      <td className="border border-gray-300 dark:border-slate-600 px-4 py-2 text-sm">
                        {selectedEntity.multivalued ? 'Yes' : 'No'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {selectedEntity.usedByClasses.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-2">
                Used By Classes ({selectedEntity.usedByClasses.length})
              </h2>
              <div className="flex flex-wrap gap-2">
                {selectedEntity.usedByClasses.map(className => (
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
  const selectedClass = selectedEntity as ClassNode;

  return (
    <div className="h-full overflow-y-auto bg-white dark:bg-slate-800 text-left">
      <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-6 py-4">
        <h1 className="text-2xl font-bold text-left">{selectedClass.name}</h1>
        {selectedClass.parent && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 text-left">
            extends {selectedClass.parent}
          </p>
        )}
      </div>

      <div className="p-6 space-y-6 text-left">
        {/* Description */}
        {selectedClass.description && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-gray-700 dark:text-gray-300">{selectedClass.description}</p>
          </div>
        )}

        {/* Required Properties */}
        {selectedClass.requiredProperties && selectedClass.requiredProperties.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Required Properties</h2>
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
            <h2 className="text-lg font-semibold mb-2">
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

        {/* Properties */}
        {selectedClass.properties && Object.keys(selectedClass.properties).length > 0 && (
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-lg font-semibold">
                Properties ({Object.keys(selectedClass.properties).length})
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
                      Property
                    </th>
                    <th className="border border-gray-300 dark:border-slate-600 px-4 py-2 text-left">
                      Type
                    </th>
                    <th className="border border-gray-300 dark:border-slate-600 px-4 py-2 text-left">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(selectedClass.properties).map(([propName, propDef]) => {
                    const range = propDef.range || 'unknown';
                    const category = categorizeRange(range);
                    const colorClass = getRangeColor(category);
                    const clickable = isRangeClickable(range);

                    return (
                      <tr key={propName} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                        <td className="border border-gray-300 dark:border-slate-600 px-4 py-2 font-mono text-sm">
                          <div className="flex items-center gap-2">
                            <span>{propName}</span>
                            {propDef.required && (
                              <span className="text-red-600 dark:text-red-400" title="Required">
                                *
                              </span>
                            )}
                            {propDef.multivalued && (
                              <span className="text-gray-600 dark:text-gray-400 text-xs" title="Multivalued">
                                []
                              </span>
                            )}
                          </div>
                        </td>
                        <td className={`border border-gray-300 dark:border-slate-600 px-4 py-2 text-sm font-mono ${colorClass}`}>
                          {propDef.multivalued && 'array<'}
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
                          {propDef.multivalued && '>'}
                        </td>
                        <td className="border border-gray-300 dark:border-slate-600 px-4 py-2 text-sm">
                          {propDef.description || '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Variables */}
        {selectedClass.variables && selectedClass.variables.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-2">
              Mapped Variables ({selectedClass.variables.length})
            </h2>
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
          </div>
        )}

        {/* No variables message */}
        {(!selectedClass.variables || selectedClass.variables.length === 0) && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Mapped Variables</h2>
            <p className="text-gray-500 dark:text-gray-400">No variables mapped to this class</p>
          </div>
        )}
      </div>
    </div>
  );
}
