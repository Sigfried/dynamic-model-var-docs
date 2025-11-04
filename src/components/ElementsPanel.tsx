/**
 * ElementsPanel Component
 *
 * Manages multiple Section components (Classes, Enums, Slots, Variables) with toggle buttons.
 * Displays sections in most-recently-selected order. Used for both left and right panels.
 *
 * Architectural note: Must only import Element from models/, never concrete subclasses or DTOs.
 * Component is now fully type-agnostic - receives all metadata from App.tsx.
 * See CLAUDE.md for separation of concerns principles.
 */
import Section from './Section';
import type { SectionData } from './Section';

/**
 * Toggle button metadata (provided by App.tsx from ELEMENT_TYPES registry).
 * Component defines what it needs; App provides this data.
 */
export interface ToggleButtonData {
  id: string;                     // "class" (not ElementTypeId!)
  icon: string;                   // "C"
  label: string;                  // "Classes"
  activeColor: string;            // Tailwind: "bg-blue-500"
  inactiveColor: string;          // Tailwind: "bg-gray-300 dark:bg-gray-600"
}

interface ElementsPanelProps {
  position: 'left' | 'right';
  sections: string[];                                       // IDs of visible sections (order matters)
  onSectionsChange: (sections: string[]) => void;
  sectionData: Map<string, SectionData>;                   // Section data by ID
  toggleButtons: ToggleButtonData[];                        // Toggle button metadata
  onSelectElement: (hoverData: { type: string; name: string }) => void;
  onElementHover?: (hoverData: { type: string; name: string }) => void;
  onElementLeave?: () => void;
}

interface SectionToggleButtonProps {
  button: ToggleButtonData;
  active: boolean;
  onClick: () => void;
}

function SectionToggleButton({ button, active, onClick }: SectionToggleButtonProps) {
  const { icon, label, activeColor, inactiveColor } = button;

  return (
    <button
      onClick={onClick}
      title={label}
      className={`w-8 h-8 rounded flex items-center justify-center text-white text-sm font-bold transition-all ${
        active ? activeColor : inactiveColor
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
  sectionData,
  toggleButtons,
  onSelectElement,
  onElementHover,
  onElementLeave
}: ElementsPanelProps) {
  const activeSections = new Set(sections);

  const toggleSection = (sectionId: string) => {
    const newSections = [...sections];
    const index = newSections.indexOf(sectionId);
    if (index > -1) {
      // Remove section
      newSections.splice(index, 1);
    } else {
      // Add to front (most recent at top)
      newSections.unshift(sectionId);
    }
    onSectionsChange(newSections);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-slate-900">
      {/* Section toggles - always in C E S V order */}
      <div className="flex flex-row gap-2 p-2 border-b border-gray-200 dark:border-slate-700">
        {toggleButtons.map(button => (
          <SectionToggleButton
            key={button.id}
            button={button}
            active={activeSections.has(button.id)}
            onClick={() => toggleSection(button.id)}
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
          {sections.map(sectionId => {
            const section = sectionData.get(sectionId);
            if (!section) return null;

            return (
              <Section
                key={sectionId}
                sectionData={section}
                onSelectElement={onSelectElement}
                onElementHover={onElementHover}
                onElementLeave={onElementLeave}
                position={position}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
