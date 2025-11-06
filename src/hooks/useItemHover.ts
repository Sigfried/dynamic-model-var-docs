/**
 * Helper function for creating item hover event handlers
 *
 * Returns standardized onMouseEnter/onMouseLeave handlers that
 * call the provided callbacks with the item type and name.
 *
 * Note: This is a regular function, not a React hook, so it can
 * be called inside loops and callbacks without violating Rules of Hooks.
 * Helper for creating item hover event handlers in UI layer.
 */

type ItemType = 'class' | 'enum' | 'slot' | 'variable';

interface ItemHoverHandlersProps {
  type: ItemType;
  name: string;
  onItemHover?: (item: { type: ItemType; name: string; cursorX: number; cursorY: number }) => void;
  onItemLeave?: () => void;
}

export function getItemHoverHandlers({
  type,
  name,
  onItemHover,
  onItemLeave
}: ItemHoverHandlersProps) {
  return {
    onMouseEnter: (e: React.MouseEvent) => onItemHover?.({ type, name, cursorX: e.clientX, cursorY: e.clientY }),
    onMouseLeave: () => onItemLeave?.()
  };
}
