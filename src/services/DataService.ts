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

/** Enum detail for inline cards (no Element exposure) */
export interface EnumDetailInfo {
  name: string;
  description: string;
  permissibleValues: Array<{ key: string; description?: string }>;
  totalValues: number;
  usedBy: Array<{ classId: string; slotName: string }>;
  inherits?: string[];
}

/** Class summary for inline cards (no Element exposure) */
export interface ClassSummaryInfo {
  name: string;
  description: string;
  isAbstract: boolean;
  parentId?: string;
  slots: Array<{ name: string; range: string; description: string }>;
  referencedBy: Array<{ classId: string; slotName: string }>;
}

export class DataService {
  private modelData: ModelData;

  constructor(modelData: ModelData) {
    this.modelData = modelData;
  }

  /**
   * Get detail content for an item
   * @throws Error if item not found
   */
  getDetailContent(itemId: string): DetailData {
    const element = this.modelData.elementLookup.get(itemId);
    if (!element) {
      throw new Error(`Element not found: ${itemId}`);
    }
    return element.getDetailData();
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
   * Get relationship counts for an item (for badge display)
   * Returns incoming/outgoing edge counts
   */
  getRelationshipCounts(itemId: string): { incoming: number; outgoing: number } | null {
    const itemInfo = this.getItemInfo(itemId);
    if (!itemInfo) return null;

    const isSlot = itemInfo.type === 'slot';

    // For slots: SLOT_RANGE (outgoing to range), CLASS_SLOT (incoming from classes)
    // For classes/enums: CLASS_RANGE (slot relationships)
    const edgeTypes = isSlot
      ? [EDGE_TYPES.SLOT_RANGE, EDGE_TYPES.CLASS_SLOT]
      : [EDGE_TYPES.CLASS_RANGE];
    const edges = this.getEdgesForItem(itemId, edgeTypes);
    const outgoing = edges.filter(e => e.sourceItem.id === itemId).length;
    const incoming = edges.filter(e => e.targetItem.id === itemId).length;

    return { incoming, outgoing };
  }

  /**
   * Get metadata for relationship info boxes (with counts subtitle)
   */
  getRelationshipBoxMetadata(itemId: string): FloatingBoxMetadata | null {
    const baseMetadata = this.getFloatingBoxMetadata(itemId);
    if (!baseMetadata) return null;

    const counts = this.getRelationshipCounts(itemId);
    if (!counts) return baseMetadata;

    return {
      ...baseMetadata,
      subtitle: `Relationships  ${counts.incoming} ↘  •  ↗ ${counts.outgoing}`
    };
  }

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

  // ====================================================================
  // Entity Explorer queries
  // ====================================================================

  /**
   * Get class description
   */
  getClassDescription(classId: string): string {
    const element = this.modelData.elementLookup.get(classId);
    if (!element) return '';
    const detail = element.getDetailData();
    return detail.description ?? '';
  }

  /**
   * Get slot count for a class (own + inherited)
   */
  getSlotCount(classId: string): number {
    return this.modelData.graph.filterEdges(
      classId,
      (_edge: string, attrs: EdgeAttributes) => attrs.type === EDGE_TYPES.CLASS_SLOT
    ).length;
  }

  /**
   * Get range counts by type for a class.
   * Classifies each CLASS_RANGE target as 'class', 'enum', or 'type'.
   */
  getRangeCountsByType(classId: string): { cls: number; enm: number; typ: number } {
    const edgeKeys = this.modelData.graph.filterEdges(
      classId,
      (_edge: string, attrs: EdgeAttributes) => attrs.type === EDGE_TYPES.CLASS_RANGE
    );
    let cls = 0, enm = 0, typ = 0;
    for (const edgeKey of edgeKeys) {
      const targetId = this.modelData.graph.target(edgeKey);
      const targetAttrs = this.modelData.graph.getNodeAttributes(targetId);
      switch (targetAttrs.type) {
        case 'class': cls++; break;
        case 'enum': enm++; break;
        default: typ++; break;
      }
    }
    return { cls, enm, typ };
  }

  /**
   * Get variable count for a class
   */
  getVariableCount(classId: string): number {
    return this.modelData.graph.filterEdges(
      classId,
      (_edge: string, attrs: EdgeAttributes) => attrs.type === EDGE_TYPES.MAPS_TO
    ).length;
  }

  /**
   * Get enum detail for inline card display
   */
  getEnumDetail(enumId: string): EnumDetailInfo | null {
    const element = this.modelData.elementLookup.get(enumId);
    if (!element) return null;

    const detail = element.getDetailData();
    // Get permissible values from the enum's detail sections
    const pvSection = detail.sections.find(s => s.name === 'Permissible Values');
    const pvRows = (pvSection?.tableContent ?? []) as string[][];

    // Build permissible values from the element directly via graph lookup
    // The enum element stores permissibleValues but we access via detail data
    // to maintain separation. The PV section has columns: [Key, Description]
    const permissibleValues = pvRows.map(row => ({
      key: String(row[0] ?? ''),
      description: row[1] ? String(row[1]) : undefined,
    }));

    // Find all slots that use this enum as a range
    const usedBy: Array<{ classId: string; slotName: string }> = [];
    const edgeKeys = this.modelData.graph.filterEdges(
      enumId,
      (_edge: string, attrs: EdgeAttributes) =>
        attrs.type === EDGE_TYPES.CLASS_RANGE || attrs.type === EDGE_TYPES.SLOT_RANGE
    );
    for (const edgeKey of edgeKeys) {
      const sourceId = this.modelData.graph.source(edgeKey);
      const sourceAttrs = this.modelData.graph.getNodeAttributes(sourceId);
      if (sourceAttrs.type === 'class') {
        const edgeAttrs = this.modelData.graph.getEdgeAttributes(edgeKey) as SlotEdgeAttributes;
        usedBy.push({ classId: sourceId, slotName: edgeAttrs.slotName ?? '' });
      }
    }

    // Check for inherits
    const inheritsSection = detail.sections.find(s => s.name === 'Inherits Values From');
    const inherits = inheritsSection?.tableContent
      ? (inheritsSection.tableContent as Array<Array<{name: string}>>).map(row => row[0]?.name).filter(Boolean)
      : undefined;

    return {
      name: detail.title ?? enumId,
      description: detail.description ?? '',
      permissibleValues,
      totalValues: permissibleValues.length,
      usedBy,
      inherits: inherits && inherits.length > 0 ? inherits : undefined,
    };
  }

  /**
   * Get "referenced by" list for a class — which other classes point to it
   * via CLASS_RANGE edges (incoming edges where this class is the target).
   */
  getReferencedBy(classId: string): Array<{ classId: string; slotName: string }> {
    const result: Array<{ classId: string; slotName: string }> = [];
    const edgeKeys = this.modelData.graph.filterEdges(
      classId,
      (_edge: string, attrs: EdgeAttributes) => attrs.type === EDGE_TYPES.CLASS_RANGE
    );
    for (const edgeKey of edgeKeys) {
      const sourceId = this.modelData.graph.source(edgeKey);
      if (sourceId !== classId) {
        const edgeAttrs = this.modelData.graph.getEdgeAttributes(edgeKey) as SlotEdgeAttributes;
        result.push({ classId: sourceId, slotName: edgeAttrs.slotName ?? '' });
      }
    }
    return result;
  }

  /**
   * Get class summary for inline card display
   */
  getClassSummary(classId: string): ClassSummaryInfo | null {
    const element = this.modelData.elementLookup.get(classId);
    if (!element) return null;

    const detail = element.getDetailData();
    const slotsSection = detail.sections.find(s => s.name === 'Slots');
    const slotRows = (slotsSection?.tableContent ?? []) as string[][];

    // Slots: [Name, Source, Range, Required, Multivalued, Description]
    const slots = slotRows.map(row => ({
      name: String(row[0] ?? ''),
      range: String(row[2] ?? ''),
      description: String(row[5] ?? ''),
    }));

    // Find all classes that reference this class via CLASS_RANGE edges
    const referencedBy: Array<{ classId: string; slotName: string }> = [];
    const edgeKeys = this.modelData.graph.filterEdges(
      classId,
      (_edge: string, attrs: EdgeAttributes) => attrs.type === EDGE_TYPES.CLASS_RANGE
    );
    for (const edgeKey of edgeKeys) {
      const sourceId = this.modelData.graph.source(edgeKey);
      if (sourceId !== classId) {
        // This is an incoming edge (some class references this class)
        const edgeAttrs = this.modelData.graph.getEdgeAttributes(edgeKey) as SlotEdgeAttributes;
        referencedBy.push({ classId: sourceId, slotName: edgeAttrs.slotName ?? '' });
      }
    }

    return {
      name: detail.title ?? classId,
      description: detail.description ?? '',
      isAbstract: detail.subtitle?.includes('abstract') ?? false,
      parentId: detail.subtitle?.replace('extends ', '') ?? undefined,
      slots,
      referencedBy,
    };
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
   * Augments items with relationship badge data
   */
  getAllSectionsData(position: 'left' | 'middle' | 'right'): Map<string, SectionData> {
    const map = new Map<string, SectionData>();
    this.modelData.collections.forEach((collection, typeId) => {
      const baseSectionData = collection.getSectionData(position);

      // Wrap getItems to add relationship badge data to each item
      const augmentedSectionData: SectionData = {
        ...baseSectionData,
        getItems: (expandedItems, pos) => {
          const items = baseSectionData.getItems(expandedItems, pos);
          return items.map(item => {
            const counts = this.getRelationshipCounts(item.hoverData.name);
            return {
              ...item,
              relationshipBadge: counts ?? undefined
            };
          });
        }
      };

      map.set(typeId, augmentedSectionData);
    });
    return map;
  }
}
