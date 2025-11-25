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
import type { Relationship } from '../models/Element';
import type {
  DetailData,
  FloatingBoxMetadata,
  RelationshipData as RelationshipDataNew,
  EdgeInfo,
  ItemInfo,
  EdgeInfoDeprecated,
  ItemInfoDeprecated,
  RelationshipDataDeprecated
} from '../contracts/ComponentData';
import type { ElementTypeId } from '../models/ElementRegistry';
import { ELEMENT_TYPES, getAllElementTypeIds } from '../models/ElementRegistry';
import type { ToggleButtonData } from '../components/ItemsPanel';
import type { SectionData } from '../components/Section';

// Re-export UI types for UI components
export type { EdgeInfo, ItemInfo, RelationshipDataNew };
// Re-export deprecated types (to be removed after component migration)
export type { EdgeInfoDeprecated, ItemInfoDeprecated, RelationshipDataDeprecated };

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
export interface RelationshipDataOld {
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
   *
   * Stage 3 Step 6: Now uses graph-based data with adapter to old format
   */
  getRelationships(itemId: string): RelationshipDataOld | null {
    const element = this.modelData.elementLookup.get(itemId);
    if (!element) return null;

    // Try new graph-based method first, fall back to old method
    const newData = element.getRelationshipsFromGraph();
    if (newData) {
      const elementType = this.getItemType(itemId);
      if (!elementType) return null;
      return this.adaptRelationshipDataToOldFormat(newData, elementType);
    }

    // Fallback for elements without graph data
    return element.getRelationshipData();
  }

  /**
   * Adapter: Converts deprecated RelationshipData format to old format
   * Used during migration to keep existing UI components working
   */
  private adaptRelationshipDataToOldFormat(
    newData: RelationshipDataDeprecated,
    elementType: string
  ): RelationshipDataOld {
    const metadata = ELEMENT_TYPES[elementType as ElementTypeId];
    const color = metadata?.color.headerBg ?? 'bg-gray-600';

    // Split outgoing edges by type
    const inheritance = newData.outgoing.find(e => e.edgeType === 'inheritance');
    const slots = newData.outgoing.filter(e => e.edgeType === 'property' && !e.inheritedFrom);
    const inheritedSlotsMap = new Map<string, SlotInfo[]>();

    // Group inherited property edges by ancestor
    newData.outgoing
      .filter(e => e.edgeType === 'property' && e.inheritedFrom)
      .forEach(edge => {
        const ancestorName = edge.inheritedFrom!;
        if (!inheritedSlotsMap.has(ancestorName)) {
          inheritedSlotsMap.set(ancestorName, []);
        }
        inheritedSlotsMap.get(ancestorName)!.push({
          attributeName: edge.label || 'unknown',
          target: edge.otherItem.id,
          targetSection: this.getItemType(edge.otherItem.id) || 'unknown',
          isSelfRef: edge.otherItem.id === newData.thisItem.id
        });
      });

    // Split incoming edges by type
    const subclasses: string[] = [];
    const usedByAttributes: Array<{ className: string; attributeName: string; sourceSection: string }> = [];
    const variables: Array<{ name: string }> = [];

    newData.incoming.forEach(edge => {
      if (edge.edgeType === 'inheritance') {
        subclasses.push(edge.otherItem.id);
      } else if (edge.edgeType === 'property') {
        usedByAttributes.push({
          className: edge.otherItem.id,
          attributeName: edge.label || 'unknown',
          sourceSection: this.getItemType(edge.otherItem.id) || 'unknown'
        });
      } else if (edge.edgeType === 'variable_mapping') {
        variables.push({
          name: edge.otherItem.id
        });
      }
    });

    return {
      itemName: newData.thisItem.displayName,
      itemSection: this.getItemType(newData.thisItem.id) || 'unknown',
      color,
      outgoing: {
        inheritance: inheritance ? {
          target: inheritance.otherItem.id,
          targetSection: this.getItemType(inheritance.otherItem.id) || 'unknown'
        } : undefined,
        slots: slots.map(edge => ({
          attributeName: edge.label || 'unknown',
          target: edge.otherItem.id,
          targetSection: this.getItemType(edge.otherItem.id) || 'unknown',
          isSelfRef: edge.otherItem.id === newData.thisItem.id
        })),
        inheritedSlots: Array.from(inheritedSlotsMap.entries()).map(([ancestorName, slotsList]) => ({
          ancestorName,
          slots: slotsList
        }))
      },
      incoming: {
        subclasses,
        usedByAttributes,
        variables
      }
    };
  }

  // ============================================================================
  // NEW: Edge-based methods for Slots-as-Edges refactor (Stage 1 Step 3)
  // ============================================================================

  /**
   * Get all property edges for LinkOverlay rendering.
   * Returns only property edges (class→enum/class relationships via attributes/slots).
   * Does NOT include inheritance or variable_mapping edges (those appear in detail views).
   *
   * STUB: Returns empty array - will be implemented in Stage 4 (LinkOverlay refactor)
   * Current LinkOverlay uses getRelationshipsForLinking() instead
   * When implemented, will return EdgeInfo[] filtered to property edges only
   */
  getAllPropertyEdges(): EdgeInfo[] {
    // TODO Stage 4: Implement using graph queries when refactoring LinkOverlay
    // Query graph for all property edges, return as EdgeInfo[]
    return [];
  }

  /**
   * Get relationship data for an item (new edge-based structure).
   * Returns unified edge-based relationships instead of type-dependent structure.
   *
   * Stage 3 Step 5: Implemented using getRelationshipsFromGraph()
   * Uses graph-based approach for querying relationships
   *
   * @deprecated Returns deprecated format. Will be updated after component migration.
   */
  getRelationshipsNew(itemId: string): RelationshipDataDeprecated | null {
    const element = this.modelData.elementLookup.get(itemId);
    if (!element) return null;

    return element.getRelationshipsFromGraph();
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
   * @param position - 'left', 'middle', or 'right' panel position
   * Returns Map where key is section ID (type ID) and value is SectionData
   */
  getAllSectionsData(position: 'left' | 'middle' | 'right'): Map<string, SectionData> {
    const map = new Map<string, SectionData>();
    this.modelData.collections.forEach((collection, typeId) => {
      map.set(typeId, collection.getSectionData(position));
    });
    return map;
  }
}
