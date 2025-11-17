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
import type { DetailData, Relationship } from '../models/Element';
import type { ElementTypeId } from '../models/ElementRegistry';
import { ELEMENT_TYPES, getAllElementTypeIds } from '../models/ElementRegistry';
import type { ToggleButtonData } from '../components/ItemsPanel';
import type { SectionData } from '../components/Section';

// NEW: Import edge-based interfaces for Slots-as-Edges refactor
import type {
  LinkPair,
  RelationshipData as RelationshipDataNew
} from '../models/Element';

export interface FloatingBoxMetadata {
  title: string;
  color: string;
}

// ============================================================================
// DEPRECATED: Old relationship data structures (will be removed in Stage 3+)
// ============================================================================
// These interfaces match Element.getRelationshipData() output from pre-refactor model
// Use RelationshipDataNew (from Element.ts) for new code

export interface SlotInfo {
  attributeName: string;
  target: string;
  targetSection: string;
  isSelfRef: boolean;
}

/**
 * @deprecated Use RelationshipDataNew from models/Element instead
 * This will be removed after Slots-as-Edges refactor is complete
 */
export interface RelationshipData {
  itemName: string;
  itemSection: string;
  color: string;  // Header color for this item section
  outgoing: {
    inheritance?: {
      target: string;
      targetSection: string;
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
      sourceSection: string;
    }>;
    variables: Array<{
      name: string;
    }>;
  };
}

export class DataService {
  private modelData: ModelData;

  constructor(modelData: ModelData) {
    this.modelData = modelData;
  }

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
   * Get relationship data for an item (old type-dependent structure)
   * @deprecated Use getRelationshipsNew() instead
   * Returns null if item not found
   */
  getRelationships(itemId: string): RelationshipData | null {
    const element = this.modelData.elementLookup.get(itemId);
    if (!element) return null;

    return element.getRelationshipData();
  }

  // ============================================================================
  // NEW: Edge-based methods for Slots-as-Edges refactor (Stage 1 Step 3)
  // ============================================================================

  /**
   * Get all linkable pairs for property edges (used by LinkOverlay).
   * Returns only property edges (class→enum/class relationships via attributes/slots).
   * Does NOT include inheritance or variable_mapping edges (those appear in detail views).
   *
   * STUB: Returns empty array until Stage 3 implementation
   * Real implementation will query all elements for property edges
   */
  getAllPairs(): LinkPair[] {
    // TODO Stage 3: Implement using element.getEdges() filtered to property edges
    return [];
  }

  /**
   * Get relationship data for an item (new edge-based structure).
   * Returns unified edge-based relationships instead of type-dependent structure.
   *
   * STUB: Returns null until Stage 3 implementation
   * Real implementation will use element.getEdges() for outgoing,
   * and scan all elements for incoming edges
   */
  getRelationshipsNew(_itemId: string): RelationshipDataNew | null {
    // TODO Stage 3: Implement using new edge-based model
    // const element = this.modelData.elementLookup.get(_itemId);
    // if (!element) return null;
    // return element.getRelationshipDataNew();
    return null;
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
   * @ts-expect-error TEMPORARY: Accessing protected 'type' property - will be removed in Step 7 (Link Overlay Refactor)
   * TODO: Refactor to avoid type exposure to DataService - see TASKS.md Step 7 architectural guidance
   */
  getItemType(itemId: string): string | null {
    const element = this.modelData.elementLookup.get(itemId);
    // @ts-expect-error TEMPORARY: See method comment above
    return element?.type ?? null;
  }

  /**
   * Get all item names for a specific type (used by LinkOverlay)
   * Returns empty array if type not found
   */
  getItemNamesForType(typeId: ElementTypeId): string[] {
    const collection = this.modelData.collections.get(typeId);
    return collection ? collection.getAllElements().map(e => e.name) : [];
  }

  /**
   * Get relationships for linking visualization (used by LinkOverlay)
   * Returns null if item not found
   */
  getRelationshipsForLinking(itemId: string): Relationship[] | null {
    const element = this.modelData.elementLookup.get(itemId);
    return element?.getRelationships() ?? null;
  }

  /**
   * Get all available item type IDs
   * Returns array of type IDs that can be used for sections/filtering
   */
  getAvailableItemTypes(): string[] {
    return Array.from(this.modelData.collections.keys());
  }

  /**
   * Get hex color for an item type (for SVG rendering)
   * Returns hex color string like '#3b82f6'
   * Returns gray color if type not found
   */
  getColorForItemType(typeId: string): string {
    const metadata = ELEMENT_TYPES[typeId as ElementTypeId];
    return metadata?.color.hex ?? '#6b7280'; // gray-500 fallback
  }

  /**
   * Get toggle button data for all item types
   * Returns array of toggle button metadata
   */
  getToggleButtonsData(): ToggleButtonData[] {
    return getAllElementTypeIds().map(typeId => {
      const metadata = ELEMENT_TYPES[typeId];
      return {
        id: typeId,
        icon: metadata.icon,
        label: metadata.pluralLabel,
        activeColor: metadata.color.toggleActive,
        inactiveColor: metadata.color.toggleInactive
      };
    });
  }

  /**
   * Get section data for all collections
   * @param position - 'left' or 'right' panel position
   * Returns Map where key is section ID (type ID) and value is SectionData
   */
  getAllSectionsData(position: 'left' | 'right'): Map<string, SectionData> {
    const map = new Map<string, SectionData>();
    this.modelData.collections.forEach((collection, typeId) => {
      map.set(typeId, collection.getSectionData(position));
    });
    return map;
  }
}
