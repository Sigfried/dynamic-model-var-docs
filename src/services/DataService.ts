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
import type { AttributeSummary } from '../models/Element';
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
import type { SectionData, SectionItemData } from '../components/Section';
import { APP_CONFIG, getAllElementTypeIds, SectionId, ACTIVE_VOCAB } from '../config/appConfig';
import { ENTITY_CATEGORIES, findUncategorizedClasses } from '../config/entityCategories';
import {
  buildContainmentGraph, classifySlotEdgeExplained, OWNERSHIP_RULE_TEXT,
} from '../models/containmentGraph';
import type {
  ContainmentGraph, OwnershipVerdict, OwnershipRule,
} from '../models/containmentGraph';
import { getSlotEdgesForClass } from '../models/Graph';
import { buildOwnershipDag, buildOwnershipSubgraph } from '../models/ownershipSubgraph';
import type {
  OwnershipDag, OwnershipSubgraph, OwnershipSubgraphOptions,
} from '../models/ownershipSubgraph';
// Re-export so UI components (which must not import from config/ or models/) can
// reference section identities without depending on display strings.
export { SectionId } from '../config/appConfig';
const {elementTypes, } = APP_CONFIG;

// Re-export UI types for UI components
export type { EdgeInfo, ItemInfo };
// Re-exported so UI components get it from DataService, never from models/.
export type { AttributeSummary } from '../models/Element';
export type { ContainmentGraph, ContainmentNode, ContainmentEdge } from '../models/containmentGraph';
export { cardinalityLabel } from '../models/containmentGraph';
export type {
  OwnershipSubgraph, OwnershipSubgraphNode, OwnershipSubgraphEdge,
  OwnershipSubgraphOptions,
  OwnershipNodeRole, OwnershipEdgeType, OwnershipNodeSlot,
} from '../models/ownershipSubgraph';

/** A category of classes for the Focus selector (e.g. "Clinical"). */
export interface CategoryGroup {
  id: string;
  label: string;
  classIds: string[];
}

/** Node shape for the containment tree/DAG widget (structurally matches
 *  dag-browser-widget's Node; defined here to keep DataService UI-lib agnostic). */
export interface ContainmentWidgetNode {
  id: string;
  name: string;
  parentIds: string[];
}

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
  slots: AttributeSummary[];
  referencedBy: Array<{ classId: string; slotName: string }>;
}

/** One class-ranged slot, with ownership resolved to owner/owned as drawn. */
export interface OwnershipPair {
  /** The class that DECLARES the slot (inherited slots count for each subclass). */
  declaredOn: string;
  slotName: string;
  /** The slot's declared range class. */
  range: string;
  multivalued: boolean;
  /** Ownership direction as drawn — swapped from declaredOn/range when flipped. */
  owner: string;
  owned: string;
  isLoop: boolean;
}

/** All pairs sharing one verdict + the rule that produced it. */
export interface OwnershipPairGroup {
  verdict: OwnershipVerdict;
  rule: OwnershipRule;
  /** Plain-language statement of the rule. */
  ruleText: string;
  pairs: OwnershipPair[];
}

/** How many ownership edges LEAVE one entity, and to whom. */
export interface DivergenceInfo {
  entity: string;
  edgeCount: number;
  /** How many of those are flipped — flipped edges do not merge. */
  flippedCount: number;
  owned: string[];
}

/** How many ownership edges arrive at one entity, and from whom. */
export interface ConvergenceInfo {
  entity: string;
  /** Slot-edges, not distinct owners — this is what crowds a corridor. */
  edgeCount: number;
  owners: string[];
}

export class DataService {
  private modelData: ModelData;

  constructor(modelData: ModelData) {
    this.modelData = modelData;
    this.warnOnUncategorizedClasses();
  }

  /**
   * ENTITY_CATEGORIES is a hand-curated allowlist, so a class added by an
   * upstream schema sync renders nowhere until someone lists it — silently.
   * That is how Context and Activity went missing after the 2026-08-12 sync.
   * entityCategories.test.ts fails on this in CI; this warns in the dev
   * console for anyone running against freshly synced data.
   */
  private warnOnUncategorizedClasses(): void {
    if (!import.meta.env?.DEV) return;
    const classes = this.modelData.collections.get('class');
    if (!classes) return;
    const missing = findUncategorizedClasses(classes.getAllElements().map(el => el.name));
    if (missing.length) {
      console.warn(
        `[entityCategories] ${missing.length} schema class(es) are in no category and ` +
        `will not appear in the entity list: ${missing.join(', ')}. ` +
        'Add them in src/config/entityCategories.ts, or record them in ' +
        'UNCATEGORIZED_BY_DESIGN if they should stay hidden.',
      );
    }
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
   * Used by LinkOverlay for DOM-based link rendering. LinkOverlay iterates raw
   * DOM `.item` rows, which can include non-graph items (e.g. Focus's category
   * headers) — those simply have no edges, so return [] rather than letting
   * graphology throw NotFoundGraphError.
   */
  getEdgesForItem(itemId: string, types: EdgeType[]): EdgeInfo[] {
    if (!this.modelData.graph.hasNode(itemId)) return [];
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

  /** Display config for the Entity Explorer summary columns (header + tooltip). */
  getEntityColumns() {
    return ACTIVE_VOCAB.entityCol;
  }

  /** Display title for a section, by stable SectionId. For components that render
   *  section labels directly (not via getDetailData). */
  getSectionLabel(sectionId: SectionId): string {
    return ACTIVE_VOCAB.section[sectionId];
  }

  /** Jargon-free display word for an element type, e.g. getTypeLabel('slot') ->
   *  "Attribute". Pass plural=true for "Attributes". Pulls from the central config
   *  so components never hardcode type vocabulary. */
  getTypeLabel(typeId: ElementTypeId, plural = false): string {
    const m = APP_CONFIG.elementTypes[typeId];
    return plural ? m.pluralLabel : m.label;
  }

  /** Jargon-free word for a model concept, e.g. getConceptLabel('attributeType')
   *  -> "Attribute Type". Pass plural=true for the plural form. For components
   *  rendering concept words directly. */
  getConceptLabel(concept: keyof typeof ACTIVE_VOCAB.concept, plural = false): string {
    const c = ACTIVE_VOCAB.concept[concept];
    return plural ? c.plural : c.singular;
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
    const pvSection = detail.sections.find(s => s.sectionId === SectionId.PermissibleValues);
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
    const inheritsSection = detail.sections.find(s => s.sectionId === SectionId.InheritsValues);
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

    // From the model rather than by re-parsing the rendered table: the table
    // renders required/multivalued as 'Yes'/'No', and callers need the booleans
    // to label cardinality. Same slots, same declared order.
    const slots = element.getAttributeSummaries();

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

  // ====================================================================
  // Focus view queries
  // ====================================================================

  /**
   * Class categories for the Focus selector, drawn from ENTITY_CATEGORIES and
   * filtered to classes that actually exist in the model (mirrors the Entity
   * Explorer's validCategories filtering). Lets components group classes
   * without importing config/ directly.
   */
  getCategoryGroups(): CategoryGroup[] {
    return ENTITY_CATEGORIES
      .map(cat => ({
        id: cat.id,
        label: cat.label,
        classIds: cat.classIds.filter(id => this.itemExists(id)),
      }))
      .filter(cat => cat.classIds.length > 0);
  }

  /**
   * Section data for the Focus selector: a two-level tree where category headers
   * (level 0) expand to their member classes (level 1). Reuses getCategoryGroups()
   * for grouping and getRelationshipCounts() for the class badges, so it renders
   * through the existing ItemsPanel/Section unchanged. Categories are expanded by
   * key (one expansion entry per category id).
   */
  getCategorySelectorSection(): SectionData {
    const groups = this.getCategoryGroups();
    const totalClasses = groups.reduce((n, g) => n + g.classIds.length, 0);

    return {
      id: 'focus-categories',
      label: `${this.getConceptLabel('entity', true)} (${totalClasses})`,
      expansionKey: 'focus::categories',
      defaultExpansion: new Set(),  // start all categories collapsed
      getItems: (expandedItems) => {
        const items: SectionItemData[] = [];
        for (const group of groups) {
          const isExpanded = expandedItems?.has(group.id) ?? false;
          items.push({
            id: group.id,
            displayName: `${group.label} (${group.classIds.length})`,
            level: 0,
            hasChildren: true,
            isExpanded,
            isClickable: false,
            hoverData: { id: group.id, type: 'category', name: group.id },
          });
          if (isExpanded) {
            for (const classId of group.classIds) {
              const counts = this.getRelationshipCounts(classId);
              items.push({
                id: classId,
                displayName: classId,
                level: 1,
                isClickable: true,
                relationshipBadge: counts ?? undefined,
                hoverData: { id: classId, type: 'class', name: classId },
              });
            }
          }
        }
        return items;
      },
    };
  }

  /**
   * Build the containment ({nodes, edges}) graph for the diagram, derived live
   * from the schema graph with FK inversion applied (see models/containmentGraph).
   *
   * @param classIds  the subset of classes to include. Omit for the full graph
   *                  (all classes, isolated nodes pruned).
   */
  getContainmentGraph(classIds?: string[]): ContainmentGraph {
    const full = classIds === undefined;
    const collection = this.modelData.collections.get('class' as ElementTypeId);
    const allClassIds = collection ? collection.getAllElements().map(e => e.name) : [];
    const ids = full ? allClassIds : classIds.filter(id => this.itemExists(id));

    return buildContainmentGraph(
      this.modelData.graph,
      ids,
      (classId) => {
        const el = this.modelData.elementLookup.get(classId);
        return {
          abstract: el?.isAbstract() ?? false,
          description: el?.description ?? '',
        };
      },
      { pruneIsolated: full },
    );
  }

  /**
   * Every class-ranged slot in the schema, grouped by how it was classified.
   *
   * Backs the ownership legend. Derived from `classifySlotEdgeExplained` — the
   * same call the graph builder makes — so the legend cannot drift from what is
   * actually drawn. That matters more than usual here: ASSOCIATION_SLOTS and
   * SINGLE_VALUE_OWNER_TARGETS are hand-curated and go stale silently on every sync,
   * and a legend built from a second copy of the rules would hide exactly the
   * rot it is supposed to expose.
   *
   * Groups are keyed `verdict/rule` because the two are not one-to-one: an
   * override can produce any verdict, and 'own-fwd' arrives by three different
   * routes. `pairs` is sorted, and `owner`/`owned` are the ownership direction
   * as DRAWN (reversed for own-bkwd and association), not the slot's
   * declaration direction.
   */
  getOwnershipPairGroups(): OwnershipPairGroup[] {
    const collection = this.modelData.collections.get('class' as ElementTypeId);
    const allClassIds = collection ? collection.getAllElements().map(e => e.name) : [];
    const known = new Set(allClassIds);
    const groups = new Map<string, OwnershipPairGroup>();

    for (const cname of allClassIds) {
      for (const slot of getSlotEdgesForClass(this.modelData.graph, cname)) {
        const rng = slot.range;
        if (!known.has(rng)) continue;          // enum/type range: not a class pair
        const { verdict, rule } = classifySlotEdgeExplained(
          slot.slotName, rng, slot.multivalued,
        );
        const key = `${verdict}/${rule}`;
        let g = groups.get(key);
        if (!g) {
          g = { verdict, rule, ruleText: OWNERSHIP_RULE_TEXT[rule], pairs: [] };
          groups.set(key, g);
        }
        const flipped = verdict === 'own-bkwd' || verdict === 'association';
        g.pairs.push({
          declaredOn: cname,
          slotName: slot.slotName,
          range: rng,
          multivalued: slot.multivalued,
          owner: flipped ? rng : cname,
          owned: flipped ? cname : rng,
          isLoop: cname === rng,
        });
      }
    }

    for (const g of groups.values()) {
      g.pairs.sort((a, b) =>
        a.declaredOn.localeCompare(b.declaredOn) || a.slotName.localeCompare(b.slotName));
    }
    // Biggest groups first: the legend is read to find cases, and the crowded
    // classifications are where the interesting ones are.
    return [...groups.values()].sort((a, b) => b.pairs.length - a.pairs.length);
  }

  /**
   * Classes ranked by how many ownership edges CONVERGE on them.
   *
   * This is the number that drives the routing work: a convergence is N edges
   * arriving at one node, and N counts slot-edges, not owning classes (one
   * class owning a target through two slots crowds the corridor twice — which
   * is exactly why TimePoint is denser than its owner count suggests).
   */
  getConvergenceRanking(): ConvergenceInfo[] {
    const byTarget = new Map<string, ConvergenceInfo>();
    for (const g of this.getOwnershipPairGroups()) {
      if (g.verdict !== 'own-fwd' && g.verdict !== 'own-bkwd') continue;
      for (const p of g.pairs) {
        if (p.isLoop) continue;
        let info = byTarget.get(p.owned);
        if (!info) {
          info = { entity: p.owned, edgeCount: 0, owners: [] };
          byTarget.set(p.owned, info);
        }
        info.edgeCount++;
        if (!info.owners.includes(p.owner)) info.owners.push(p.owner);
      }
    }
    for (const i of byTarget.values()) i.owners.sort();
    return [...byTarget.values()].sort(
      (a, b) => b.edgeCount - a.edgeCount || a.entity.localeCompare(b.entity));
  }

  /**
   * Classes ranked by how many ownership edges LEAVE them — the divergences.
   *
   * The mirror of getConvergenceRanking, and not redundant with it: because
   * flipped edges reverse direction, an FK hub shows up here rather than there.
   * That is not a detail — Participant fans out to 22 targets and Visit to 19,
   * both bigger than the largest inbound convergence (Quantity, 19 edges), and
   * they are almost entirely FLIPPED edges, which keep their attribute-row
   * anchor and must not merge. The routing work was scoped off the convergence
   * ranking alone and so had not looked at them.
   */
  getDivergenceRanking(): DivergenceInfo[] {
    const bySource = new Map<string, DivergenceInfo>();
    for (const g of this.getOwnershipPairGroups()) {
      if (g.verdict !== 'own-fwd' && g.verdict !== 'own-bkwd') continue;
      for (const p of g.pairs) {
        if (p.isLoop) continue;
        let info = bySource.get(p.owner);
        if (!info) {
          info = { entity: p.owner, edgeCount: 0, flippedCount: 0, owned: [] };
          bySource.set(p.owner, info);
        }
        info.edgeCount++;
        if (g.verdict === 'own-bkwd' || g.verdict === 'association') info.flippedCount++;
        if (!info.owned.includes(p.owned)) info.owned.push(p.owned);
      }
    }
    for (const i of bySource.values()) i.owned.sort();
    return [...bySource.values()].sort(
      (a, b) => b.edgeCount - a.edgeCount || a.entity.localeCompare(b.entity));
  }

  /** Memoized full (unpruned) graph + supergroup DAG for getOwnershipSubgraph.
   *  Unpruned so a deliberately-selected isolated class still resolves. */
  private ownershipDagCache?: { full: ContainmentGraph; dag: OwnershipDag };

  private getOwnershipDag(): { full: ContainmentGraph; dag: OwnershipDag } {
    if (!this.ownershipDagCache) {
      const collection = this.modelData.collections.get('class' as ElementTypeId);
      const allClassIds = collection ? collection.getAllElements().map(e => e.name) : [];
      const full = this.getContainmentGraph(allClassIds);
      this.ownershipDagCache = { full, dag: buildOwnershipDag(full) };
    }
    return this.ownershipDagCache;
  }

  /**
   * Drawable ownership subgraph for the Explore viz (docs/EXPLORE_VIZ.md):
   * selected nodes, edges among them, ownership paths-to-root as dimmed
   * 'context' nodes, plus expand-on-demand additions. Node.layer (maxDepth in
   * the full ownership DAG) is stable across selection changes.
   */
  getOwnershipSubgraph(
    selectedIds: string[],
    expansions: string[] = [],
    options: OwnershipSubgraphOptions = {},
  ): OwnershipSubgraph {
    const { full, dag } = this.getOwnershipDag();
    return buildOwnershipSubgraph(full, dag, selectedIds, expansions, options);
  }

  /**
   * Names reachable from a set of classes by one edge type (e.g. the slots a
   * class declares via CLASS_SLOT, or the range targets it points to via
   * CLASS_RANGE). Returns the union across all given classes.
   */
  private subsetTargets(classIds: Iterable<string>, edgeType: EdgeType): Set<string> {
    const names = new Set<string>();
    for (const classId of classIds) {
      const edgeKeys = this.modelData.graph.filterEdges(
        classId,
        (_edge: string, attrs: EdgeAttributes, source: string) =>
          attrs.type === edgeType && source === classId,
      );
      for (const edgeKey of edgeKeys) names.add(this.modelData.graph.target(edgeKey));
    }
    return names;
  }

  /**
   * A flat section listing exactly the named subset of one collection, rendered
   * through the elements' own getSectionItemData (so rows match the Kitchen Sink)
   * but flattened to level 0 — no hierarchy. Flattening via getAllElements()
   * means deep subclasses are included regardless of tree depth, and the label
   * count reflects the subset, not the whole collection.
   */
  private subsetSection(
    typeId: ElementTypeId,
    names: Set<string>,
    context: 'middlePanel' | 'rightPanel',
  ): SectionData {
    const collection = this.modelData.collections.get(typeId);
    if (!collection) throw new Error(`No collection for type: ${typeId}`);
    const elements = collection
      .getAllElements()
      // Filter on `name`: `names` holds graph node ids, which for slots are the
      // qualified ids. Sort on `displayName`, which is what the rows show.
      .filter(el => names.has(el.name))
      .sort((a, b) => a.displayName.localeCompare(b.displayName)
        || a.name.localeCompare(b.name));

    return {
      id: typeId,
      label: `${this.getTypeLabel(typeId, true)} (${elements.length})`,
      getItems: () =>
        elements.map(el => ({
          ...el.getSectionItemData(context, 0, false, this.itemExists(el.name)),
          relationshipBadge: this.getRelationshipCounts(el.name) ?? undefined,
        })),
    };
  }

  /**
   * Section data for the Focus middle/right panels, scoped to a selected subset
   * of classes. Rows are rendered by the model's own getSectionItemData (same as
   * the Kitchen Sink) but flat — no tree:
   *  - 'middle' → one 'slot' section: the slots the selected classes declare.
   *  - 'right'  → 'class' / 'enum' / 'type' sections (the Ent/PVS/DT split), each
   *    holding the range targets the selected classes point to. Range rows from
   *    different selected classes intermix within a section for now; per-entity
   *    nesting is deferred (see FOCUS_VIEW.md / TASKS.md item 1).
   */
  getFocusSubsetSections(
    classIds: string[],
    position: 'middle' | 'right',
  ): Map<string, SectionData> {
    if (position === 'middle') {
      const slots = this.subsetTargets(classIds, EDGE_TYPES.CLASS_SLOT);
      return new Map([['slot', this.subsetSection('slot', slots, 'middlePanel')]]);
    }
    const ranges = this.subsetTargets(classIds, EDGE_TYPES.CLASS_RANGE);
    return new Map(
      (['class', 'enum', 'type'] as const).map(typeId => [
        typeId,
        this.subsetSection(typeId, ranges, 'rightPanel'),
      ]),
    );
  }

  /**
   * Containment graph as dag-browser-widget Node[] ({id, name, parentIds}).
   * A containment edge source→target means "source contains target", so target
   * lists source among its parentIds. Polyhierarchy (multiple parents) and
   * cycles fall out naturally; the widget handles them. Same scoping rules as
   * getContainmentGraph (omit classIds for the full graph).
   */
  getContainmentNodes(classIds?: string[]): ContainmentWidgetNode[] {
    const { nodes, edges } = this.getContainmentGraph(classIds);
    const parentIds = new Map<string, string[]>(nodes.map(n => [n.id, []]));
    for (const e of edges) {
      // Only ownership + subclass edges nest; 'ref' edges are non-owning
      // associations and must not create parent links.
      if (e.kind === 'ref') continue;
      // skip self-loops as parent links (a node isn't its own parent); the
      // widget renders them as backedges from the edge set if needed.
      if (e.source === e.target) continue;
      parentIds.get(e.target)?.push(e.source);
    }
    return nodes.map(n => ({
      id: n.id,
      name: n.label,
      parentIds: parentIds.get(n.id) ?? [],
    }));
  }
}
