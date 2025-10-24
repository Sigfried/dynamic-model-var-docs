import ClassSection from './ClassSection';
import EnumSection from './EnumSection';
import SlotSection from './SlotSection';
import VariablesSection from './VariablesSection';
import type { ClassNode, EnumDefinition, SlotDefinition, VariableSpec } from '../types';

type SectionType = 'classes' | 'enums' | 'slots' | 'variables';
type SelectedElement = ClassNode | EnumDefinition | SlotDefinition | VariableSpec;

interface ElementsPanelProps {
  position: 'left' | 'right';
  sections: SectionType[];
  onSectionsChange: (sections: SectionType[]) => void;
  classHierarchy: ClassNode[];
  enums: Map<string, EnumDefinition>;
  slots: Map<string, SlotDefinition>;
  variables: VariableSpec[];
  selectedElement?: SelectedElement;
  onSelectEntity: (entity: SelectedElement) => void;
}

interface SectionToggleButtonProps {
  sectionType: SectionType;
  active: boolean;
  onClick: () => void;
}

function SectionToggleButton({ sectionType, active, onClick }: SectionToggleButtonProps) {
  const config = {
    classes: { label: 'C', title: 'Classes', color: 'bg-blue-500' },
    enums: { label: 'E', title: 'Enums', color: 'bg-purple-500' },
    slots: { label: 'S', title: 'Slots', color: 'bg-green-500' },
    variables: { label: 'V', title: 'Variables', color: 'bg-orange-500' }
  };

  const { label, title, color } = config[sectionType];

  return (
    <button
      onClick={onClick}
      title={title}
      className={`w-8 h-8 rounded flex items-center justify-center text-white text-sm font-bold transition-all ${
        active ? color : 'bg-gray-300 dark:bg-gray-600'
      } hover:scale-110`}
    >
      {label}
    </button>
  );
}

export default function ElementsPanel({
  position,
  sections,
  onSectionsChange,
  classHierarchy,
  enums,
  slots,
  variables,
  selectedElement,
  onSelectEntity
}: ElementsPanelProps) {
  const activeSections = new Set(sections);

  const toggleSection = (section: SectionType) => {
    const newSections = [...sections];
    const index = newSections.indexOf(section);
    if (index > -1) {
      // Remove section
      newSections.splice(index, 1);
    } else {
      // Add to front (most recent at top)
      newSections.unshift(section);
    }
    onSectionsChange(newSections);
  };

  // Helper to check if entity is of certain type
  const isClassNode = (entity: SelectedElement): entity is ClassNode => 'children' in entity;
  const isEnumDefinition = (entity: SelectedElement): entity is EnumDefinition => 'permissible_values' in entity;
  const isSlotDefinition = (entity: SelectedElement): entity is SlotDefinition => 'slot_uri' in entity;
  const isVariableSpec = (entity: SelectedElement): entity is VariableSpec => 'variableLabel' in entity;

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-slate-900">
      {/* Section toggles - always in C E S V order */}
      <div className="flex flex-row gap-2 p-2 border-b border-gray-200 dark:border-slate-700">
        <SectionToggleButton
          sectionType="classes"
          active={activeSections.has('classes')}
          onClick={() => toggleSection('classes')}
        />
        <SectionToggleButton
          sectionType="enums"
          active={activeSections.has('enums')}
          onClick={() => toggleSection('enums')}
        />
        <SectionToggleButton
          sectionType="slots"
          active={activeSections.has('slots')}
          onClick={() => toggleSection('slots')}
        />
        <SectionToggleButton
          sectionType="variables"
          active={activeSections.has('variables')}
          onClick={() => toggleSection('variables')}
        />
      </div>

      {/* Sections container - render in order of most recently selected */}
      {sections.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-gray-400 text-sm p-4 text-center">
          Click a section icon above to get started
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto min-h-0">
          {sections.map(section => {
            switch (section) {
              case 'classes':
                return (
                  <ClassSection
                    key="classes"
                    nodes={classHierarchy}
                    onSelectClass={onSelectEntity}
                    selectedClass={selectedElement && isClassNode(selectedElement) ? selectedElement : undefined}
                    position={position}
                  />
                );
              case 'enums':
                return (
                  <EnumSection
                    key="enums"
                    enums={enums}
                    onSelectEnum={onSelectEntity}
                    selectedEnum={selectedElement && isEnumDefinition(selectedElement) ? selectedElement : undefined}
                    position={position}
                  />
                );
              case 'slots':
                return (
                  <SlotSection
                    key="slots"
                    slots={slots}
                    onSelectSlot={onSelectEntity}
                    selectedSlot={selectedElement && isSlotDefinition(selectedElement) ? selectedElement : undefined}
                    position={position}
                  />
                );
              case 'variables':
                return (
                  <VariablesSection
                    key="variables"
                    variables={variables}
                    onSelectVariable={onSelectEntity}
                    selectedVariable={selectedElement && isVariableSpec(selectedElement) ? selectedElement : undefined}
                    position={position}
                  />
                );
              default:
                return null;
            }
          })}
        </div>
      )}
    </div>
  );
}
