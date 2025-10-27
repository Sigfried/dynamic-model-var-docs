import DetailPanel from './DetailPanel';
import { getHeaderColor, getPanelTitle, type SelectedElement } from '../utils/panelHelpers';
import type { ClassNode, EnumDefinition, SlotDefinition } from '../types';

interface StackedPanel {
  id: string;
  element: SelectedElement;
  elementType: 'class' | 'enum' | 'slot' | 'variable';
}

interface DetailPanelStackProps {
  panels: StackedPanel[];
  onNavigate?: (elementName: string, elementType: 'class' | 'enum' | 'slot') => void;
  onClose: (id: string) => void;
  enums?: Map<string, EnumDefinition>;
  slots?: Map<string, SlotDefinition>;
  classes?: Map<string, ClassNode>;
}

// Note: getHeaderColor and getPanelTitle are now imported from utils/panelHelpers.tsx

export default function DetailPanelStack({
  panels,
  onNavigate,
  onClose,
  enums,
  slots,
  classes
}: DetailPanelStackProps) {
  if (panels.length === 0) {
    return null;
  }

  // Reverse array so newest appears at top
  const reversedPanels = [...panels].reverse();

  return (
    <div className="h-full overflow-y-auto flex flex-col gap-4 p-4 bg-gray-50 dark:bg-slate-900">
      {reversedPanels.map((panel) => (
        <div
          key={panel.id}
          className="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-300 dark:border-slate-600 flex flex-col"
          style={{ minHeight: '300px', maxHeight: '500px' }}
        >
          {/* Header with descriptive title and type-based color */}
          <div className={`flex items-center justify-between px-4 py-2 ${getHeaderColor(panel.elementType)} border-b rounded-t-lg`}>
            <div className="text-white">
              {getPanelTitle(panel.element, panel.elementType)}
            </div>
            <button
              onClick={() => onClose(panel.id)}
              className="text-white hover:text-gray-200 text-xl font-bold w-8 h-8 flex items-center justify-center rounded hover:bg-black hover:bg-opacity-20"
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            <DetailPanel
              selectedElement={panel.element}
              onNavigate={onNavigate}
              onClose={() => onClose(panel.id)}
              enums={enums}
              slots={slots}
              classes={classes}
              dialogWidth={600}
              hideHeader={true}
              hideCloseButton={true}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
