/**
 * Section Component
 *
 * Displays a single collection of elements in a tree/list view.
 * Shows elements with badges, indicators (e.g., "abstract"), expansion controls,
 * and hover interactions. Used by ElementsPanel to render Classes, Enums, Slots, or Variables.
 *
 * Architectural note: Must only import Element from models/, never concrete subclasses or DTOs.
 * See CLAUDE.md for separation of concerns principles.
 */
import { useExpansionState } from '../hooks/useExpansionState';
import { getElementHoverHandlers } from '../hooks/useElementHover';

/**
 * Data interface for a single item in the section.
 * Component defines what it needs; Element provides this data via getSectionItemData().
 */
export interface SectionItemData {
  // Identity (used for both DOM id and React key)
  id: string;                     // "lp-Specimen" (from element.getId(context))

  // Display
  displayName: string;            // "Specimen"
  level: number;                  // Indentation depth

  // Visual styling
  badgeColor?: string;            // Tailwind: "bg-blue-100 text-blue-800"
  badgeText?: string;             // "103"
  indicators?: Array<{            // Replaces isAbstract() check
    text: string;                 // "abstract"
    color: string;                // Tailwind: "text-purple-600"
  }>;

  // Interaction
  hasChildren?: boolean;
  isExpanded?: boolean;
  isClickable: boolean;

  // Event data (opaque to component, passed through to callbacks)
  hoverData: {
    type: string;                 // "class" (component treats as opaque)
    name: string;                 // "Specimen"
  };
}

/**
 * Data interface for the entire section.
 * Component defines what it needs for the whole section.
 */
export interface SectionData {
  id: string;                     // "class"
  label: string;                  // "Classes (42)"
  getItems: (expandedItems?: Set<string>, position?: 'left' | 'right') => SectionItemData[]; // Function to get items based on expansion
  expansionKey?: string;          // For state persistence ("lp-class")
  defaultExpansion?: Set<string>; // Default expanded items
}

interface SectionProps {
  sectionData: SectionData;
  onSelectElement: (hoverData: { type: string; name: string }) => void;
  onElementHover?: (hoverData: { type: string; name: string }) => void;
  onElementLeave?: () => void;
  position: 'left' | 'right';
}

interface ItemRendererProps {
  item: SectionItemData;
  onSelectElement: (hoverData: { type: string; name: string }) => void;
  onElementHover?: (hoverData: { type: string; name: string }) => void;
  onElementLeave?: () => void;
  position: 'left' | 'right';
  toggleExpansion?: (itemName: string) => void;
}

function ItemRenderer({ item, onSelectElement, onElementHover, onElementLeave, position, toggleExpansion }: ItemRendererProps) {
  const { id, displayName, level, hasChildren, isExpanded, isClickable, badgeColor, badgeText, indicators, hoverData } = item;

  const hoverHandlers = getElementHoverHandlers({
    type: hoverData.type,
    name: hoverData.name,
    onElementHover,
    onElementLeave
  });

  // For non-clickable items with children (e.g., variable group headers), the whole row should toggle expansion
  const handleClick = () => {
    if (isClickable) {
      onSelectElement(hoverData);
    } else if (hasChildren && toggleExpansion) {
      toggleExpansion(hoverData.name);
    }
  };

  const showToggleButton = hasChildren && toggleExpansion;
  const isCursorPointer = isClickable || (hasChildren && toggleExpansion);

  return (
    <div key={id} className="select-none">
      <div
        id={id}
        data-element-type={hoverData.type}
        data-element-name={hoverData.name}
        data-panel-position={position}
        className={`flex items-center gap-2 px-2 py-1 rounded ${
          isCursorPointer ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700' : ''
        }`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={handleClick}
        {...hoverHandlers}
      >
        {/* Expansion toggle for items with children */}
        {showToggleButton ? (
          <button
            className="w-4 h-4 flex items-center justify-center text-gray-500 hover:text-gray-700"
            onClick={(e) => {
              e.stopPropagation();
              toggleExpansion(hoverData.name);
            }}
          >
            {isExpanded ? '▼' : '▶'}
          </button>
        ) : (
          <span className="w-4" />
        )}

        {/* Element name */}
        <span className="flex-1 text-sm font-medium">{displayName}</span>

        {/* Indicators (e.g., "abstract" for classes) */}
        {indicators && indicators.length > 0 && indicators.map((indicator, idx) => (
          <span key={idx} className={`text-xs italic mr-2 ${indicator.color}`}>
            {indicator.text}
          </span>
        ))}

        {/* Badge (count display) */}
        {badgeText && badgeColor && (
          <span className={`text-xs px-2 py-0.5 rounded ${badgeColor}`}>
            {badgeText}
          </span>
        )}
      </div>
    </div>
  );
}

export default function Section({ sectionData, onSelectElement, onElementHover, onElementLeave, position }: SectionProps) {
  const { label, getItems, expansionKey, defaultExpansion } = sectionData;

  // Use expansion state hook only if needed
  const [expandedItems, toggleExpansion] = expansionKey
    ? useExpansionState(expansionKey, defaultExpansion || new Set())
    : [undefined, undefined];

  // Get items based on current expansion state
  const items = getItems(expandedItems, position);

  return (
    <div className="bg-white dark:bg-slate-800 text-left">
      <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-4 py-3 z-10">
        <h2 className="text-lg font-semibold text-left">{label}</h2>
      </div>
      <div className="p-2">
        {items.map(item => (
          <ItemRenderer
            key={item.id}
            item={item}
            onSelectElement={onSelectElement}
            onElementHover={onElementHover}
            onElementLeave={onElementLeave}
            position={position}
            toggleExpansion={toggleExpansion}
          />
        ))}
      </div>
    </div>
  );
}
