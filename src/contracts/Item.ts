/**
 * Item - Base class for component data contracts
 *
 * Provides:
 * - ID contextualization
 * - Nesting/containment
 * - Common display properties
 * - Tree rendering capabilities (future)
 *
 * Architecture principle: UI components work with Item instances from this contracts layer.
 * This maintains separation between the model layer and view layer.
 */

import { contextualizeId } from '../utils/idContextualization';

/**
 * Base class for all component data
 *
 * Can be used directly for simple items, or extended for specialized items
 * like CollectionItem or SectionItem.
 */
export class Item {
  itemId: string;
  displayName: string;
  description?: string;

  // Display properties from DataService
  headerColor?: string;
  sourceColor?: string;
  badge?: number;

  // Nesting support
  children?: Item[];
  parent?: Item;

  constructor(
    itemId: string,
    displayName: string,
    description?: string
  ) {
    this.itemId = itemId;
    this.displayName = displayName;
    this.description = description;
  }

  /**
   * Get contextualized ID for use in DOM/component
   *
   * @param context - Optional context for ID prefixing (e.g., 'left-panel', 'right-panel')
   * @returns Contextualized ID string
   */
  getContextualizedId(context?: string): string {
    return contextualizeId({ id: this.itemId, context });
  }
}

/**
 * Item representing a collection of items
 */
export class CollectionItem extends Item {
  itemId: string;
  displayName: string;
  items: Item[];

  constructor(
    itemId: string,
    displayName: string,
    items: Item[]
  ) {
    super();
    this.itemId = itemId;
    this.displayName = displayName;
    this.items = items;
  }
}

/**
 * Item representing a panel section (e.g., "Classes", "Enums")
 */
export class SectionItem extends Item {
  itemId: string;
  displayName: string;
  items: Item[];

  constructor(
    itemId: string,
    displayName: string,
    items: Item[]
  ) {
    super();
    this.itemId = itemId;
    this.displayName = displayName;
    this.items = items;
  }
}
