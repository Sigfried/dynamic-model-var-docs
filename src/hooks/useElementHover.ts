/**
 * Helper function for creating element hover event handlers
 *
 * Returns standardized onMouseEnter/onMouseLeave handlers that
 * call the provided callbacks with the element type and name.
 *
 * Note: This is a regular function, not a React hook, so it can
 * be called inside loops and callbacks without violating Rules of Hooks.
 */

type ElementType = 'class' | 'enum' | 'slot' | 'variable';

interface ElementHoverHandlersProps {
  type: ElementType;
  name: string;
  onElementHover?: (element: { type: ElementType; name: string; cursorX: number; cursorY: number }) => void;
  onElementLeave?: () => void;
}

export function getElementHoverHandlers({
  type,
  name,
  onElementHover,
  onElementLeave
}: ElementHoverHandlersProps) {
  return {
    onMouseEnter: (e: React.MouseEvent) => onElementHover?.({ type, name, cursorX: e.clientX, cursorY: e.clientY }),
    onMouseLeave: () => onElementLeave?.()
  };
}
