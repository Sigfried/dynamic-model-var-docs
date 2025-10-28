import Section from './Section';
import type { ClassNode, EnumDefinition, SlotDefinition, VariableSpec, SelectedElement } from '../types';
import type { ElementCollection } from '../models/Element';
import type { ElementTypeId } from '../models/ElementRegistry';
import { ELEMENT_TYPES, getAllElementTypeIds } from '../models/ElementRegistry';

interface ElementsPanelProps {
  position: 'left' | 'right';
  sections: ElementTypeId[];
  onSectionsChange: (sections: ElementTypeId[]) => void;
  collections: Map<ElementTypeId, ElementCollection>;
  onSelectElement: (element: SelectedElement, elementType: ElementTypeId) => void;
  onElementHover?: (element: { type: ElementTypeId; name: string }) => void;
  onElementLeave?: () => void;
}

interface SectionToggleButtonProps {
  elementTypeId: ElementTypeId;
  active: boolean;
  onClick: () => void;
}

function SectionToggleButton({ elementTypeId, active, onClick }: SectionToggleButtonProps) {
  const metadata = ELEMENT_TYPES[elementTypeId];
  const { icon, pluralLabel, color } = metadata;

  return (
    <button
      onClick={onClick}
      title={pluralLabel}
      className={`w-8 h-8 rounded flex items-center justify-center text-white text-sm font-bold transition-all ${
        active ? `bg-${color.name}-500` : 'bg-gray-300 dark:bg-gray-600'
      } hover:scale-110`}
    >
      {icon}
    </button>
  );
}

export default function ElementsPanel({
  position,
  sections,
  onSectionsChange,
  collections,
  onSelectElement,
  onElementHover,
  onElementLeave
}: ElementsPanelProps) {
  const activeSections = new Set(sections);

  const toggleSection = (elementTypeId: ElementTypeId) => {
    const newSections = [...sections];
    const index = newSections.indexOf(elementTypeId);
    if (index > -1) {
      // Remove section
      newSections.splice(index, 1);
    } else {
      // Add to front (most recent at top)
      newSections.unshift(elementTypeId);
    }
    onSectionsChange(newSections);
  };

  // Get all available element type IDs for toggle buttons
  const allElementTypeIds = getAllElementTypeIds();

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-slate-900">
      {/* Section toggles - always in C E S V order */}
      <div className="flex flex-row gap-2 p-2 border-b border-gray-200 dark:border-slate-700">
        {allElementTypeIds.map(typeId => (
          <SectionToggleButton
            key={typeId}
            elementTypeId={typeId}
            active={activeSections.has(typeId)}
            onClick={() => toggleSection(typeId)}
          />
        ))}
      </div>

      {/* Sections container - render in order of most recently selected */}
      {sections.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-gray-400 text-sm p-4 text-center">
          Click a section icon above to get started
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto min-h-0">
          {sections.map(typeId => {
            const collection = collections.get(typeId);
            if (!collection) return null;

            return (
              <Section
                key={typeId}
                collection={collection}
                callbacks={{
                  onSelect: (element) => {
                    // Adapter: Convert Element back to raw data for legacy code
                    // TODO: Eventually update App.tsx to accept Element directly
                    const rawData = (element as any).rawData || element;
                    onSelectElement(rawData, element.type);
                  },
                  onElementHover,
                  onElementLeave
                }}
                position={position}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
