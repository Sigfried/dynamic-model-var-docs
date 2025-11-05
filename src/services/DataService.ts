/**
 * DataService - Abstraction layer between UI and model
 *
 * Maintains view/model separation by:
 * - UI components call DataService methods with item IDs (strings)
 * - DataService internally looks up Element instances and calls their methods
 * - UI never sees Element instances or element types
 *
 * Terminology:
 * - "item" in UI layer = "element" in model layer
 * - itemId = element name (unique identifier)
 */

import type { ModelData } from '../types';
import type { DetailData } from '../models/Element';

export interface FloatingBoxMetadata {
  title: string;
  color: string;
}

// Relationship data structures (matches Element.getRelationshipData() output)
export interface SlotInfo {
  attributeName: string;
  target: string;
  targetType: string;
  isSelfRef: boolean;
}

export interface RelationshipData {
  elementName: string;
  elementType: string;
  outgoing: {
    inheritance?: {
      target: string;
      targetType: string;
    };
    slots: SlotInfo[];
    inheritedSlots: Array<{
      ancestorName: string;
      slots: SlotInfo[];
    }>;
  };
  incoming: {
    subclasses: string[];
    usedByAttributes: Array<{
      className: string;
      attributeName: string;
      sourceType: string;
    }>;
    variables: Array<{
      name: string;
    }>;
  };
}

export class DataService {
  constructor(private modelData: ModelData) {}

  /**
   * Get detail content for an item
   * Returns null if item not found
   */
  getDetailContent(itemId: string): DetailData | null {
    const element = this.modelData.elementLookup.get(itemId);
    return element?.getDetailData() ?? null;
  }

  /**
   * Get floating box metadata (title and color) for an item
   * Returns null if item not found
   */
  getFloatingBoxMetadata(itemId: string): FloatingBoxMetadata | null {
    const element = this.modelData.elementLookup.get(itemId);
    return element?.getFloatingBoxMetadata() ?? null;
  }

  /**
   * Get relationship data for an item
   * Returns null if item not found
   */
  getRelationships(itemId: string): RelationshipData | null {
    const element = this.modelData.elementLookup.get(itemId);
    if (!element) return null;

    return element.getRelationshipData();
  }

  /**
   * Check if an item exists
   */
  itemExists(itemId: string): boolean {
    return this.modelData.elementLookup.has(itemId);
  }

  /**
   * Get item type for internal use (e.g., for URL state persistence)
   * Returns the collection type ID that this item belongs to
   */
  getItemType(itemId: string): string | null {
    const element = this.modelData.elementLookup.get(itemId);
    return element?.type ?? null;
  }
}
