import type { EnumDefinition } from '../types';
import { getElementHoverHandlers } from '../hooks/useElementHover';

interface EnumSectionProps {
  enums: Map<string, EnumDefinition>;
  onSelectEnum: (enumDef: EnumDefinition) => void;
  selectedEnum?: EnumDefinition;
  position?: 'left' | 'right';
  onElementHover?: (element: { type: 'class' | 'enum' | 'slot' | 'variable'; name: string }) => void;
  onElementLeave?: () => void;
}

export default function EnumSection({ enums, onSelectEnum, selectedEnum, position, onElementHover, onElementLeave }: EnumSectionProps) {
  // Convert to array and sort by name
  const enumList = Array.from(enums.values()).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="bg-white dark:bg-slate-800 text-left">
      <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-4 py-3 z-10">
        <h2 className="text-lg font-semibold text-left">Enumerations ({enums.size})</h2>
      </div>
      <div className="p-2">
        {enumList.map((enumDef) => {
          const isSelected = selectedEnum?.name === enumDef.name;
          const hoverHandlers = getElementHoverHandlers({ type: 'enum', name: enumDef.name, onElementHover, onElementLeave });

          return (
            <div
              key={enumDef.name}
              id={`enum-${enumDef.name}`}
              data-element-type="enum"
              data-element-name={enumDef.name}
              data-panel-position={position}
              className={`flex items-center gap-2 px-2 py-1 cursor-pointer rounded hover:bg-gray-100 dark:hover:bg-slate-700 ${
                isSelected ? 'bg-purple-100 dark:bg-purple-900' : ''
              }`}
              onClick={() => onSelectEnum(enumDef)}
              {...hoverHandlers}
            >
              <span className="flex-1 text-sm font-medium">{enumDef.name}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-purple-200 dark:bg-purple-800 text-purple-700 dark:text-purple-300">
                {enumDef.permissible_values.length}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
