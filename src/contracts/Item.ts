/**
 * Item - Base class for component data contracts
 *
 * Provides:
 * - ID contextualization
 * - Nesting/containment
 * - Common display properties
 * - Tree rendering capabilities (future)
 *
 * Architecture principle: UI components work with Item instances, not Element instances.
 * This maintains separation between model layer (Element) and view layer (Item).
 */

import { contextualizeId } from '../utils/idContextualization';

/**
 * Abstract base class for all component data
 */
export abstract class Item {
  abstract itemId: string;
  abstract displayName: string;

  // Display properties from DataService
  headerColor?: string;
  sourceColor?: string;
  badge?: number;

  // Nesting support
  children?: Item[];
  parent?: Item;

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
 * Item representing a single element (class, enum, slot, variable)
 */
export class ElementItem extends Item {
  itemId: string;
  displayName: string;
  description?: string;

  constructor(
    itemId: string,
    displayName: string,
    description?: string
  ) {
    super();
    this.itemId = itemId;
    this.displayName = displayName;
    this.description = description;
  }
}

/**
 * Item representing a collection of elements
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
