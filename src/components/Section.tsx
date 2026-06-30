/**
 * Section Component
 *
 * Displays a single collection of items in a tree/list view.
 * Shows items with badges, indicators (e.g., "abstract"), expansion controls,
 * and hover interactions. Used by ItemsPanel to render Classes, Enums, Slots, or Variables.
 *
 * Architecture: Receives pre-computed SectionData from ItemsPanel (which gets it from App.tsx).
 * App.tsx uses DataService to generate this data - maintains view/model separation.
 * UI layer uses "item" terminology.
 *
 * Hover Zones:
 * - Item name: hover shows detail preview box
 * - Relationship badge: hover shows relationship info box
 * - Click on either: persists the current transitory box
 *
 * See CLAUDE.md for separation of concerns principles.
 */
import { useExpansionState } from '../hooks/useExpansionState';
import { getItemHoverHandlers } from '../hooks/useItemHover';
import { contextualizeId } from '../utils/idContextualization';
import { WithTooltip } from './Tooltip';
import type { ItemHoverData, SectionItemData, SectionData, HoverZone } from '../contracts/ComponentData';

// Re-export for backward compatibility with existing imports
export type { ItemHoverData, SectionItemData, SectionData, HoverZone };

interface SectionProps {
  sectionData: SectionData;
  onClickItem: (hoverData: ItemHoverData) => void;
  onItemHover?: (hoverData: ItemHoverData) => void;
  onItemLeave?: () => void;
  position: 'left' | 'middle' | 'right';
  pinnedDetailItemIds?: Set<string>;
  pinnedRelationshipItemIds?: Set<string>;
  selectedIds?: Set<string>;
  onToggleSelect?: (name: string) => void;
}

interface ItemRendererProps {
  item: SectionItemData;
  onClickItem: (hoverData: ItemHoverData) => void;
  onItemHover?: (hoverData: ItemHoverData) => void;
  onItemLeave?: () => void;
  position: 'left' | 'middle' | 'right';
  toggleExpansion?: (itemName: string) => void;
  pinnedDetailItemIds?: Set<string>;
  pinnedRelationshipItemIds?: Set<string>;
  selectedIds?: Set<string>;
  onToggleSelect?: (name: string) => void;
}

function ItemRenderer({ item, onClickItem, onItemHover, onItemLeave, position, toggleExpansion, pinnedDetailItemIds, pinnedRelationshipItemIds, selectedIds, onToggleSelect }: ItemRendererProps) {
  const { id, displayName, level, hasChildren, isExpanded, isClickable, badgeColor, badgeText, badgeTooltip, relationshipBadge, indicators, hoverData } = item;

  // Multi-select checkbox is shown for clickable rows when a selection handler is
  // supplied (Focus selector). Selection is keyed by item name, not contextualized id.
  const showSelect = onToggleSelect !== undefined && isClickable;
  const isSelected = selectedIds?.has(hoverData.name) ?? false;

  // Create hover handlers for the name zone
  const nameHoverHandlers = getItemHoverHandlers({
    id: id,
    type: hoverData.type,
    name: hoverData.name,
    hoverZone: 'name',
    onItemHover,
    onItemLeave
  });

  // Create hover handlers for the badge zone
  const badgeHoverHandlers = getItemHoverHandlers({
    id: id,
    type: hoverData.type,
    name: hoverData.name,
    hoverZone: 'badge',
    onItemHover,
    onItemLeave
  });

  // For non-clickable items with children (e.g., variable group headers), the whole row should toggle expansion
  const handleClick = (hoverZone: HoverZone) => {
    if (isClickable) {
      onClickItem({ ...hoverData, hoverZone });
    } else if (hasChildren && toggleExpansion) {
      toggleExpansion(hoverData.name);
    }
  };

  const showToggleButton = hasChildren && toggleExpansion;
  const isCursorPointer = isClickable || (hasChildren && toggleExpansion);

  // Show relationship badge if there are any relationships
  const hasRelationships = relationshipBadge && (relationshipBadge.incoming > 0 || relationshipBadge.outgoing > 0);

  return (
    <div key={id} className="select-none">
      <div
        id={id}
        data-panel-position={position}
        className={`item flex items-center gap-2 px-2 py-1 rounded ${isSelected ? 'bg-blue-50 dark:bg-blue-900/30' : ''}`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        {/* Multi-select checkbox (Focus selector) */}
        {showSelect && (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              onToggleSelect!(hoverData.name);
            }}
            onClick={(e) => e.stopPropagation()}
            className="w-3.5 h-3.5 cursor-pointer accent-blue-600 flex-shrink-0"
            title={isSelected ? 'Remove from selection' : 'Add to selection'}
          />
        )}

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

        {/* Item name - hover zone for detail preview */}
        <WithTooltip
          tooltip={isClickable && !pinnedDetailItemIds?.has(hoverData.name) ? `Click to pin ${hoverData.type} details` : undefined}
          className={`flex-1 text-sm font-medium ${isCursorPointer ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 rounded px-1 -mx-1' : ''}`}
          onClick={() => handleClick('name')}
          {...nameHoverHandlers}
        >
          {displayName}
        </WithTooltip>

        {/* Indicators (e.g., "abstract" for classes) */}
        {indicators && indicators.length > 0 && indicators.map((indicator, idx) => (
          <span key={idx} className={`text-xs italic mr-2 ${indicator.color}`}>
            {indicator.text}
          </span>
        ))}

        {/* Type-specific badge (count display) */}
        {badgeText && badgeColor && (
          <WithTooltip
            tooltip={badgeTooltip}
            className={`text-xs px-2 py-0.5 rounded ${badgeColor}`}
          >
            {badgeText}
          </WithTooltip>
        )}

        {/* Relationship badge - hover zone for relationship info */}
        {hasRelationships && (
          <WithTooltip
            tooltip={pinnedRelationshipItemIds?.has(hoverData.name) ? undefined : "Click to pin relationships"}
            className="text-xs px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300 cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-500"
            onClick={() => handleClick('badge')}
            {...badgeHoverHandlers}
          >
            ↘{relationshipBadge.incoming} ↗{relationshipBadge.outgoing}
          </WithTooltip>
        )}
      </div>
    </div>
  );
}

export default function Section({ sectionData, onClickItem, onItemHover, onItemLeave, position, pinnedDetailItemIds, pinnedRelationshipItemIds, selectedIds, onToggleSelect }: SectionProps) {
  const { label, getItems, expansionKey, defaultExpansion } = sectionData;

  // Use expansion state hook only if needed
  const [expandedItems, toggleExpansion] = expansionKey
    ? useExpansionState(expansionKey, defaultExpansion || new Set())
    : [undefined, undefined];

  // Get items based on current expansion state
  const rawItems = getItems(expandedItems, position);

  // Contextualize IDs for DOM uniqueness (model layer returns raw names, UI layer adds context)
  const contextSuffix = position === 'left' ? 'left-panel' : position === 'middle' ? 'middle-panel' : position === 'right' ? 'right-panel' : undefined;
  const items = rawItems.map(item => ({
    ...item,
    id: contextualizeId({ id: item.id, context: contextSuffix })
  }));

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
            onClickItem={onClickItem}
            onItemHover={onItemHover}
            onItemLeave={onItemLeave}
            position={position}
            toggleExpansion={toggleExpansion}
            pinnedDetailItemIds={pinnedDetailItemIds}
            pinnedRelationshipItemIds={pinnedRelationshipItemIds}
            selectedIds={selectedIds}
            onToggleSelect={onToggleSelect}
          />
        ))}
      </div>
    </div>
  );
}
