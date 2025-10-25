import type { SlotDefinition } from '../types';
import { getElementHoverHandlers } from '../hooks/useElementHover';

interface SlotSectionProps {
  slots: Map<string, SlotDefinition>;
  onSelectSlot: (slotDef: SlotDefinition) => void;
  selectedSlot?: SlotDefinition;
  position?: 'left' | 'right';
  onElementHover?: (element: { type: 'class' | 'enum' | 'slot' | 'variable'; name: string }) => void;
  onElementLeave?: () => void;
}

export default function SlotSection({ slots, onSelectSlot, selectedSlot, position, onElementHover, onElementLeave }: SlotSectionProps) {
  // Convert to array and sort by name
  const slotList = Array.from(slots.values()).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="bg-white dark:bg-slate-800 text-left">
      <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-4 py-3 z-10">
        <h2 className="text-lg font-semibold text-left">Slots ({slots.size})</h2>
      </div>
      <div className="p-2">
        {slotList.map((slotDef) => {
          const isSelected = selectedSlot?.name === slotDef.name;
          const hoverHandlers = getElementHoverHandlers({ type: 'slot', name: slotDef.name, onElementHover, onElementLeave });

          return (
            <div
              key={slotDef.name}
              id={`slot-${slotDef.name}`}
              data-element-type="slot"
              data-element-name={slotDef.name}
              data-panel-position={position}
              className={`flex items-center gap-2 px-2 py-1 cursor-pointer rounded hover:bg-gray-100 dark:hover:bg-slate-700 ${
                isSelected ? 'bg-green-100 dark:bg-green-900' : ''
              }`}
              onClick={() => onSelectSlot(slotDef)}
              {...hoverHandlers}
            >
              <span className="flex-1 text-sm font-medium">{slotDef.name}</span>
              {slotDef.usedByClasses.length > 0 && (
                <span className="text-xs px-2 py-0.5 rounded bg-green-200 dark:bg-green-800 text-green-700 dark:text-green-300">
                  {slotDef.usedByClasses.length}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
