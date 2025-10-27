import Section from './Section';
import type { ClassNode, EnumDefinition, SlotDefinition, VariableSpec } from '../types';
import { ClassCollection, EnumCollection, SlotCollection, VariableCollection } from '../models/Element';

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
  onElementHover?: (element: { type: 'class' | 'enum' | 'slot' | 'variable'; name: string }) => void;
  onElementLeave?: () => void;
  // New: collections (will replace raw data maps above)
  classCollection?: ClassCollection;
  enumCollection?: EnumCollection;
  slotCollection?: SlotCollection;
  variableCollection?: VariableCollection;
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
  onSelectEntity,
  onElementHover,
  onElementLeave,
  classCollection: classCollectionProp,
  enumCollection: enumCollectionProp,
  slotCollection: slotCollectionProp,
  variableCollection: variableCollectionProp
}: ElementsPanelProps) {
  const activeSections = new Set(sections);

  // Use provided collections, or create from raw data (backward compatibility)
  const classCollection = classCollectionProp || ClassCollection.fromData(classHierarchy, slots);
  const enumCollection = enumCollectionProp || EnumCollection.fromData(enums);
  const slotCollection = slotCollectionProp || SlotCollection.fromData(slots);
  const variableCollection = variableCollectionProp || VariableCollection.fromData(variables);

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

  // Helper to convert selectedElement to format expected by Section component
  const getSelectedElementInfo = (): { type: string; name: string } | undefined => {
    if (!selectedElement) return undefined;
    if (isClassNode(selectedElement)) return { type: 'class', name: selectedElement.name };
    if (isEnumDefinition(selectedElement)) return { type: 'enum', name: selectedElement.name };
    if (isSlotDefinition(selectedElement)) return { type: 'slot', name: selectedElement.name };
    if (isVariableSpec(selectedElement)) return { type: 'variable', name: selectedElement.variableLabel };
    return undefined;
  };

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
                  <Section
                    key="classes"
                    collection={classCollection}
                    callbacks={{
                      onSelect: onSelectEntity,
                      onElementHover,
                      onElementLeave
                    }}
                    position={position}
                    selectedElement={getSelectedElementInfo()}
                  />
                );
              case 'enums':
                return (
                  <Section
                    key="enums"
                    collection={enumCollection}
                    callbacks={{
                      onSelect: onSelectEntity,
                      onElementHover,
                      onElementLeave
                    }}
                    position={position}
                    selectedElement={getSelectedElementInfo()}
                  />
                );
              case 'slots':
                return (
                  <Section
                    key="slots"
                    collection={slotCollection}
                    callbacks={{
                      onSelect: onSelectEntity,
                      onElementHover,
                      onElementLeave
                    }}
                    position={position}
                    selectedElement={getSelectedElementInfo()}
                  />
                );
              case 'variables':
                return (
                  <Section
                    key="variables"
                    collection={variableCollection}
                    callbacks={{
                      onSelect: onSelectEntity,
                      onElementHover,
                      onElementLeave
                    }}
                    position={position}
                    selectedElement={getSelectedElementInfo()}
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
