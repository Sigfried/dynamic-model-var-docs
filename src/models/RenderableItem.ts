/**
 * RenderableItem - Common interface for all items displayed in Section panels
 *
 * This interface separates data structure (tree/flat/grouped) from presentation.
 * Collections provide RenderableItems, Section.tsx renders them generically.
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
