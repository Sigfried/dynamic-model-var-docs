/**
 * Helper function for creating item hover event handlers
 *
 * Returns standardized onMouseEnter/onMouseLeave handlers that
 * call the provided callbacks with the item ID, section, and hover zone.
 *
 * Note: This is a regular function, not a React hook, so it can
 * be called inside loops and callbacks without violating Rules of Hooks.
 * Helper for creating item hover event handlers in UI layer.
 */

import type { ItemHoverData, HoverZone } from '../contracts/ComponentData';

interface ItemHoverHandlersProps {
  id: string;  // DOM node ID for positioning
  type: string;  // Item section ID
  name: string;
  hoverZone: HoverZone;  // Which zone triggers this handler
  onItemHover?: (item: ItemHoverData) => void;
  onItemLeave?: () => void;
}

export function getItemHoverHandlers({
  id,
  type,
  name,
  hoverZone,
  onItemHover,
  onItemLeave
}: ItemHoverHandlersProps) {
  return {
    onMouseEnter: () => onItemHover?.({ id, type, name, hoverZone }),
    onMouseLeave: () => onItemLeave?.()
  };
}
