/**
 * RenderableItem - Internal data structure for element collection items
 *
 * **DEPRECATED**: This is an internal structure used by the old getRenderableItems() method.
 * Components should use SectionItemData (from components/Section.tsx) instead.
 *
 * This interface is kept for backward compatibility with getRenderableItems().
 * New code should use getSectionData() which returns SectionData with SectionItemData items.
 *
 * @see components/Section.tsx SectionItemData for the component-facing interface
 * @see Element.getSectionData() for the new approach
 */

import type { Element } from './Element';

export interface RenderableItem {
  /** Unique identifier for this item (used as React key) */
  id: string;

  /** The element this item represents */
  element: Element;

  /** Nesting level (0 = root, 1+ = nested) */
  level: number;

  /** Whether this item has children that can be expanded */
  hasChildren?: boolean;

  /** Whether this item's children are currently expanded */
  isExpanded?: boolean;

  /**
   * Whether clicking this item should open a detail dialog
   * - true: opens detail dialog (normal elements)
   * - false: only expands/collapses (e.g., variable group headers)
   */
  isClickable: boolean;

  /** Optional badge text (e.g., "(103)" for count) */
  badge?: string | number;
}
