// Must only import Element from models/, never concrete subclasses or DTOs
import type { ElementCollection, ElementCollectionCallbacks } from '../models/Element';
import type { RenderableItem } from '../models/RenderableItem';
import { useExpansionState } from '../hooks/useExpansionState';
import { ELEMENT_TYPES } from '../models/ElementRegistry';
import { getElementHoverHandlers } from '../hooks/useElementHover';

interface SectionProps {
  collection: ElementCollection;
  callbacks: ElementCollectionCallbacks;
  position: 'left' | 'right';
}

interface ItemRendererProps {
  item: RenderableItem;
  callbacks: ElementCollectionCallbacks;
  position: 'left' | 'right';
  toggleExpansion?: (itemId: string) => void;
}

function ItemRenderer({ item, callbacks, position, toggleExpansion }: ItemRendererProps) {
  const { element, level, hasChildren, isExpanded, isClickable, badge } = item;
  const { color } = ELEMENT_TYPES[element.getType()];

  const hoverHandlers = getElementHoverHandlers({
    type: element.getType(),
    name: element.name,
    onElementHover: callbacks.onElementHover,
    onElementLeave: callbacks.onElementLeave
  });

  // For non-clickable items with children (e.g., variable group headers), the whole row should toggle expansion
  const handleClick = () => {
    if (isClickable) {
      callbacks.onSelect(element);
    } else if (hasChildren && toggleExpansion) {
      toggleExpansion(element.name);
    }
  };

  const showToggleButton = hasChildren && toggleExpansion;
  const isCursorPointer = isClickable || (hasChildren && toggleExpansion);

  return (
    <div key={element.name} className="select-none">
      <div
        id={`${element.getType()}-${element.name}`}
        data-element-type={element.getType()}
        data-element-name={element.name}
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
              toggleExpansion(element.name);
            }}
          >
            {isExpanded ? '▼' : '▶'}
          </button>
        ) : (
          <span className="w-4" />
        )}

        {/* Element name */}
        <span className="flex-1 text-sm font-medium">{element.name}</span>

        {/* Type-specific badges and indicators */}
        {element.isAbstractClass() && (
          <span className="text-xs text-purple-600 dark:text-purple-400 italic mr-2">
            abstract
          </span>
        )}

        {/* Badge (count display) */}
        {badge !== undefined && badge !== null && (
          <span className={`text-xs px-2 py-0.5 rounded ${color.badgeBg} ${color.badgeText}`}>
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}

export default function Section({ collection, callbacks, position }: SectionProps) {
  // Check if this collection needs expansion state
  const expansionKey = collection.getExpansionKey(position);
  const defaultExpansion = collection.getDefaultExpansion();

  // Use expansion state hook only if needed
  const [expandedItems, toggleExpansion] = expansionKey
    ? useExpansionState(expansionKey, defaultExpansion)
    : [undefined, undefined];

  // Get renderable items from collection
  const items = collection.getRenderableItems(expandedItems);

  return (
    <div className="bg-white dark:bg-slate-800 text-left">
      <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-4 py-3 z-10">
        <h2 className="text-lg font-semibold text-left">{collection.getLabel()}</h2>
      </div>
      <div className="p-2">
        {items.map(item => (
          <ItemRenderer
            key={item.id}
            item={item}
            callbacks={callbacks}
            position={position}
            toggleExpansion={toggleExpansion}
          />
        ))}
      </div>
    </div>
  );
}
