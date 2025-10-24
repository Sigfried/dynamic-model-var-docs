import type { VariableSpec } from '../types';
import { useExpansionState } from '../hooks/useExpansionState';

interface VariablesSectionProps {
  variables: VariableSpec[];
  onSelectVariable: (variable: VariableSpec) => void;
  selectedVariable?: VariableSpec;
  position?: 'left' | 'right';
}

export default function VariablesSection({ variables, onSelectVariable, selectedVariable, position }: VariablesSectionProps) {
  // Group variables by class
  const groupedVariables = variables.reduce((acc, variable) => {
    const className = variable.bdchmElement;
    if (!acc[className]) {
      acc[className] = [];
    }
    acc[className].push(variable);
    return acc;
  }, {} as Record<string, VariableSpec[]>);

  // Sort class names and variables within each group
  const sortedClasses = Object.keys(groupedVariables).sort((a, b) => a.localeCompare(b));
  sortedClasses.forEach(className => {
    groupedVariables[className].sort((a, b) => a.variableLabel.localeCompare(b.variableLabel));
  });

  // Use shared expansion state hook (persisted to URL with key 'evc')
  const [expandedClasses, toggleClass] = useExpansionState('evc', new Set());

  return (
    <div className="bg-white dark:bg-slate-800 text-left">
      <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-4 py-3 z-10">
        <h2 className="text-lg font-semibold text-left">Variables ({variables.length})</h2>
      </div>
      <div className="p-2">
        {sortedClasses.map((className) => {
          const classVariables = groupedVariables[className];
          const isExpanded = expandedClasses.has(className);

          return (
            <div key={className} className="mb-2">
              {/* Class header - collapsible */}
              <div
                className="flex items-center gap-2 px-2 py-1 cursor-pointer rounded hover:bg-gray-100 dark:hover:bg-slate-700"
                onClick={() => toggleClass(className)}
              >
                <span className="text-gray-500 dark:text-gray-400 select-none">
                  {isExpanded ? '▼' : '▶'}
                </span>
                <span className="font-medium text-sm text-gray-700 dark:text-gray-300">
                  {className}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  ({classVariables.length})
                </span>
              </div>

              {/* Variables list - only show when expanded */}
              {isExpanded && (
                <div className="ml-4 mt-1">
                  {classVariables.map((variable, idx) => {
                    const isSelected = selectedVariable?.variableLabel === variable.variableLabel
                      && selectedVariable?.bdchmElement === variable.bdchmElement;

                    return (
                      <div
                        key={`${variable.bdchmElement}-${variable.variableLabel}-${idx}`}
                        id={`variable-${variable.variableLabel}`}
                        data-element-type="variable"
                        data-element-name={variable.variableLabel}
                        data-panel-position={position}
                        className={`px-2 py-1 cursor-pointer rounded hover:bg-gray-100 dark:hover:bg-slate-700 ${
                          isSelected ? 'bg-orange-100 dark:bg-orange-900' : ''
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectVariable(variable);
                        }}
                      >
                        <span className="text-sm truncate block">
                          {variable.variableLabel}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
