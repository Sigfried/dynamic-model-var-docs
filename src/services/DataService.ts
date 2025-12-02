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

import type { ModelData } from '../models/ModelData';
import type { Relationship } from '../models/Element';
import type {
  DetailData,
  FloatingBoxMetadata
} from '../contracts/ComponentData';
import type { ElementTypeId } from '../config/appConfig';
import type {
  EdgeAttributes,
  EdgeInfo,
  EdgeType,
  ItemInfo,
  SlotEdgeAttributes
} from "../models/SchemaTypes";
import { EDGE_TYPES } from "../models/SchemaTypes";
import type { ToggleButtonData } from '../components/ItemsPanel';
import type { SectionData } from '../components/Section';
import { APP_CONFIG, getAllElementTypeIds, } from '../config/appConfig';
const {elementTypes, } = APP_CONFIG;

// Re-export UI types for UI components
export type { EdgeInfo, ItemInfo };

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

  // [sg] deleted getRelationships and adaptRelationshipDataToOldFormat; weren't being used

  // ============================================================================
  // NEW: Edge-based methods for Slots-as-Edges refactor (Stage 1 Step 3)
  // ============================================================================

  /**
   * Get ItemInfo for a single node from the graph
   */
  getItemInfo(nodeId: string): ItemInfo | null {
    // Get node attributes from graph
    const nodeAttrs = this.modelData.graph.getNodeAttributes(nodeId);

    // Get type metadata for colors and labels
    const typeMetadata = elementTypes[nodeAttrs.type as ElementTypeId];
    if (!typeMetadata) {
      console.warn(`getItemInfo: Type metadata not found for ${nodeAttrs.type}`);
      return null;
    }

    return {
      id: nodeId,
      displayName: nodeAttrs.name,
      type: nodeAttrs.type,
      typeDisplayName: typeMetadata.label,
      color: typeMetadata.color.headerBg
    };
  }

  /**
   * Get EdgeInfo for a single edge from the graph
   */
  getEdgeInfo(edgeKey: string): EdgeInfo | null {
    const sourceNodeId = this.modelData.graph.source(edgeKey);
    const targetNodeId = this.modelData.graph.target(edgeKey);

    const sourceItem = this.getItemInfo(sourceNodeId);
    const targetItem = this.getItemInfo(targetNodeId);

    if (!sourceItem || !targetItem) {
      console.error(`getEdgeInfo: Missing source or target item`, {
        edgeKey,
        sourceNodeId,
        targetNodeId
      });
      return null;
    }

    // Get edge attributes
    const edgeAttrs = this.modelData.graph.getEdgeAttributes(edgeKey);

    // Use graph edge type directly (no UI translation)
    const edgeType = edgeAttrs.type;

    // Get label and inheritedFrom for slot-related edges (CLASS_RANGE and CLASS_SLOT have these)
    const hasSlotAttrs = edgeType === EDGE_TYPES.CLASS_RANGE || edgeType === EDGE_TYPES.CLASS_SLOT;
    const slotAttrs = hasSlotAttrs ? edgeAttrs as SlotEdgeAttributes : null;

    return {
      edgeType,
      sourceItem,
      targetItem,
      label: slotAttrs?.slotName,
      inheritedFrom: slotAttrs?.inheritedFrom
    };
  }

  /**
   * Get all edges for a specific item from the graph
   * Used by LinkOverlay for DOM-based link rendering
   */
  getEdgesForItem(itemId: string, types: EdgeType[]): EdgeInfo[] {
    let edgeKeys = this.modelData.graph.filterEdges(itemId, (_edge: string, attributes: EdgeAttributes, _source: string, _target: string) => {
      return types.includes(attributes.type)
    });
    edgeKeys = Array.from(new Set(edgeKeys))
    const edges = edgeKeys.map((edgeKey: string) => this.getEdgeInfo(edgeKey)).filter((e): e is EdgeInfo => e !== null);
    return edges;
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
   *
   * @deprecated Use getEdgesForItem() instead (returns EdgeInfo[] with explicit source/target).
   * Will be removed after LinkOverlay migration (Phase 2 Step 3).
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
    const metadata = elementTypes[typeId as ElementTypeId];
    return metadata?.color.hex ?? '#6b7280'; // gray-500 fallback
  }

  /**
   * Get toggle button data for all item types
   * Returns array of toggle button metadata
   */
  getToggleButtonsData(): ToggleButtonData[] {
    return getAllElementTypeIds().map(typeId => {
      const metadata = elementTypes[typeId];
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
