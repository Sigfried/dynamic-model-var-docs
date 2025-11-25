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

import type { NodeEntry, EdgeEntry} from "graphology-types";
import type { ModelData } from '../models/ModelData';
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
import type { ElementTypeId } from '../config/appConfig';
import { ELEMENT_TYPES, getAllElementTypeIds } from '../config/appConfig';
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

  // [sg] deleted getRelationships and adaptRelationshipDataToOldFormat; weren't being used

  // ============================================================================
  // NEW: Edge-based methods for Slots-as-Edges refactor (Stage 1 Step 3)
  // ============================================================================

  getItemInfo(nodeId: string): ItemInfo | null {
    const node: NodeEntry = this.modelData.graph.node(nodeId);
    // ...
  }
  getEdgeInfo(graphEdge: EdgeEntry): EdgeInfo | null {
    const sourceItem: ItemInfo = this.getItemInfo(this.modelData.graph.source(graphEdge));
    const targetItem: ItemInfo = this.getItemInfo(this.modelData.graph.target(graphEdge));
    // ...
  }
  getEdgesForItem(itemId: string): EdgeInfo[] | null {
    const graphEdges = this.modelData.graph.edges(itemId);
    return graphEdges.map(e => this.getEdgeInfo(e)).filter(e => e);
  }

  /**
   * Get all property edges for LinkOverlay rendering.
   * Returns only property edges (class→enum/class relationships via attributes/slots).
   * Does NOT include inheritance or variable_mapping edges (those appear in detail views).
   *
   * Queries the graph for all 'slot' type edges and converts them to EdgeInfo format.
   * panelId is set to 'left' initially - LayoutManager should update based on actual panel positions.
   */
  getAllPropertyEdges(): EdgeInfo[] {
    const edges: EdgeInfo[] = [];

    // Query graph for all edges
    this.modelData.graph.forEachEdge((edgeKey, attrs, sourceId, targetId) => {
      // Only include slot edges (property relationships)
      if (attrs.type !== 'slot') return;

      // Get source and target elements
      const sourceElement = this.modelData.elementLookup.get(sourceId);
      const targetElement = this.modelData.elementLookup.get(targetId);

      if (!sourceElement || !targetElement) {
        console.warn(`getAllPropertyEdges: Missing element for edge ${edgeKey}`, {
          sourceId,
          targetId,
          foundSource: !!sourceElement,
          foundTarget: !!targetElement
        });
        return;
      }

      // Get element types from graph nodes (type property is protected on Element)
      const sourceNode = this.modelData.graph.getNodeAttributes(sourceId);
      const targetNode = this.modelData.graph.getNodeAttributes(targetId);

      // Get element type metadata for colors and display names
      const sourceTypeMetadata = ELEMENT_TYPES[sourceNode.type as ElementTypeId];
      const targetTypeMetadata = ELEMENT_TYPES[targetNode.type as ElementTypeId];

      if (!sourceTypeMetadata || !targetTypeMetadata) {
        console.warn(`getAllPropertyEdges: Missing type metadata for edge ${edgeKey}`, {
          sourceType: sourceNode.type,
          targetType: targetNode.type
        });
        return;
      }

      // Cast attrs to SlotEdgeAttributes to access slot-specific properties
      const slotAttrs = attrs as import('../models/Graph').SlotEdgeAttributes;

      // Build EdgeInfo
      edges.push({
        edgeType: 'property',
        sourceItem: {
          id: sourceId,
          displayName: sourceElement.name,
          type: sourceNode.type,
          typeDisplayName: sourceTypeMetadata.label,
          color: sourceTypeMetadata.color.name,
          panelPosition: 'left',  // Source is logically on left of edge
          panelId: 'left'  // TODO: Placeholder - LayoutManager should fill this based on actual panel
        },
        targetItem: {
          id: targetId,
          displayName: targetElement.name,
          type: targetNode.type,
          typeDisplayName: targetTypeMetadata.label,
          color: targetTypeMetadata.color.name,
          panelPosition: 'right',  // Target is logically on right of edge
          panelId: 'left'  // TODO: Placeholder - LayoutManager should fill this based on actual panel
        },
        label: slotAttrs.slotName,
        inheritedFrom: slotAttrs.inheritedFrom
      });
    });

    return edges;
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
