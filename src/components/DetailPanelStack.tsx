import DetailPanel from './DetailPanel';
import { getHeaderColor, getPanelTitle } from '../utils/panelHelpers';
import type { Element } from '../models/Element';
import type { ElementTypeId } from '../models/ElementRegistry';

interface StackedPanel {
  id: string;
  element: Element;
  elementType: ElementTypeId;
}

interface DetailPanelStackProps {
  panels: StackedPanel[];
  onNavigate?: (elementName: string, elementType: ElementTypeId) => void;
  onClose: (id: string) => void;
}

// Note: getHeaderColor and getPanelTitle are now imported from utils/panelHelpers.tsx

export default function DetailPanelStack({
  panels,
  onNavigate,
  onClose
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
              element={panel.element}
              onNavigate={onNavigate}
              onClose={() => onClose(panel.id)}
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
