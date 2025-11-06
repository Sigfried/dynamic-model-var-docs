/**
 * Helper function for creating item hover event handlers
 *
 * Returns standardized onMouseEnter/onMouseLeave handlers that
 * call the provided callbacks with the item ID and type.
 *
 * Note: This is a regular function, not a React hook, so it can
 * be called inside loops and callbacks without violating Rules of Hooks.
 * Helper for creating item hover event handlers in UI layer.
 */

type ItemType = 'class' | 'enum' | 'slot' | 'variable';

interface ItemHoverHandlersProps {
  id: string;  // DOM node ID for positioning
  type: ItemType;  // Item collection type
  name: string;
  onItemHover?: (item: { id: string; type: ItemType; name: string }) => void;
  onItemLeave?: () => void;
}

export function getItemHoverHandlers({
  id,
  type,
  name,
  onItemHover,
  onItemLeave
}: ItemHoverHandlersProps) {
  return {
    onMouseEnter: () => onItemHover?.({ id, type, name }),
    onMouseLeave: () => onItemLeave?.()
  };
}
