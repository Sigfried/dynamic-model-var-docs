import type { VariableSpec } from '../types';

interface VariablesSectionProps {
  variables: VariableSpec[];
  onSelectVariable: (variable: VariableSpec) => void;
  selectedVariable?: VariableSpec;
}

export default function VariablesSection({ variables, onSelectVariable, selectedVariable }: VariablesSectionProps) {
  // Sort by label
  const sortedVariables = [...variables].sort((a, b) =>
    a.variableLabel.localeCompare(b.variableLabel)
  );

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-800 text-left">
      <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-4 py-3 z-10">
        <h2 className="text-lg font-semibold text-left">Variables ({variables.length})</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {sortedVariables.map((variable, idx) => {
          const isSelected = selectedVariable?.variableLabel === variable.variableLabel
            && selectedVariable?.bdchmElement === variable.bdchmElement;

          return (
            <div
              key={`${variable.bdchmElement}-${variable.variableLabel}-${idx}`}
              id={`variable-${variable.variableLabel}`}
              data-element-type="variable"
              data-element-name={variable.variableLabel}
              className={`flex flex-col gap-1 px-2 py-2 cursor-pointer rounded hover:bg-gray-100 dark:hover:bg-slate-700 ${
                isSelected ? 'bg-orange-100 dark:bg-orange-900' : ''
              }`}
              onClick={() => onSelectVariable(variable)}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="flex-1 text-sm font-medium truncate">
                  {variable.variableLabel}
                </span>
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400 font-mono">
                {variable.bdchmElement}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
