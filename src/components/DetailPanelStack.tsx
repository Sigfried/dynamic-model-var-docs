import { type ReactElement } from 'react';
import DetailPanel from './DetailPanel';
import type { ClassNode, EnumDefinition, SlotDefinition, VariableSpec } from '../types';

type SelectedEntity = ClassNode | EnumDefinition | SlotDefinition | VariableSpec;

interface StackedPanel {
  id: string;
  entity: SelectedEntity;
  entityType: 'class' | 'enum' | 'slot' | 'variable';
}

interface DetailPanelStackProps {
  panels: StackedPanel[];
  onNavigate?: (entityName: string, entityType: 'class' | 'enum' | 'slot') => void;
  onClose: (id: string) => void;
  enums?: Map<string, EnumDefinition>;
  slots?: Map<string, SlotDefinition>;
  classes?: Map<string, ClassNode>;
}

// Helper to get header color based on entity type
function getHeaderColor(entity: SelectedEntity): string {
  if ('children' in entity) {
    return 'bg-blue-700 dark:bg-blue-700 border-blue-800 dark:border-blue-600';
  } else if ('permissible_values' in entity) {
    return 'bg-purple-700 dark:bg-purple-700 border-purple-800 dark:border-purple-600';
  } else if ('slot_uri' in entity) {
    return 'bg-green-700 dark:bg-green-700 border-green-800 dark:border-green-600';
  } else {
    return 'bg-orange-600 dark:bg-orange-600 border-orange-700 dark:border-orange-500';
  }
}

// Helper to generate descriptive title for panel header (returns JSX for styled title)
function getPanelTitle(entity: SelectedEntity): ReactElement {
  if ('children' in entity) {
    // ClassNode
    const classNode = entity as ClassNode;
    return (
      <span className="text-base">
        <span className="font-bold">Class:</span> <span className="font-bold">{classNode.name}</span>
        {classNode.parent && <span className="ml-1 text-sm">extends {classNode.parent}</span>}
      </span>
    );
  } else if ('permissible_values' in entity) {
    // EnumDefinition - don't show "Enum:" prefix since name ends with "Enum"
    const enumDef = entity as EnumDefinition;
    return <span className="text-base font-bold">{enumDef.name}</span>;
  } else if ('slot_uri' in entity) {
    // SlotDefinition
    const slotDef = entity as SlotDefinition;
    return <span className="text-base"><span className="font-bold">Slot:</span> <span className="font-bold">{slotDef.name}</span></span>;
  } else {
    // VariableSpec
    const varSpec = entity as VariableSpec;
    return <span className="text-base"><span className="font-bold">Variable:</span> <span className="font-bold">{varSpec.variableLabel}</span></span>;
  }
}

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
          <div className={`flex items-center justify-between px-4 py-2 ${getHeaderColor(panel.entity)} border-b rounded-t-lg`}>
            <div className="text-white">
              {getPanelTitle(panel.entity)}
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
              selectedEntity={panel.entity}
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
