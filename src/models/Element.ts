// Element-based architecture for generic rendering and relationship tracking
// See CLAUDE.md and ARCHITECTURE.md for architecture details

// Transformed types from SchemaTypes
import type {
  ClassData,
  EnumData,
  SlotData,
  TypeData,
  VariableSpec,
  EnumValue,
  SchemaData,
  SlotReference,
} from './SchemaTypes';

// Core application data structure
import type { ModelData } from './ModelData';
import type { ElementTypeId } from '../config/appConfig';
import type { RenderableItem } from './RenderableItem';
import { buildGraphFromSchemaData, getClassesUsingRange, getClassesUsingSlot } from './Graph';
import { type SchemaGraph } from './SchemaTypes';
import type {
  DetailSection,
  DetailData
} from '../contracts/ComponentData';
import { APP_CONFIG } from '../config/appConfig';
const {elementTypes, } = APP_CONFIG;

// Helper function to map panel position to context string
function positionToContext(position: 'left' | 'middle' | 'right'): 'leftPanel' | 'middlePanel' | 'rightPanel' {
  if (position === 'left') return 'leftPanel';
  if (position === 'middle') return 'middlePanel';
  return 'rightPanel';
}

// ============================================================================
// Global references for graph-based queries
// ============================================================================

let globalGraph: SchemaGraph | null = null;

/**
 * Initialize global graph reference.
 * Called during model initialization to enable graph-based queries.
 */
export function initializeGraphReferences(
  graph: SchemaGraph,
  _elementLookup: Map<string, Element>  // Kept for API compatibility
): void {
  globalGraph = graph;
}

// Base abstract class for all element types
export abstract class Element {
  protected abstract readonly type: ElementTypeId;
  abstract readonly name: string;
  abstract readonly description: string | undefined;

  // Detail data extraction (data-focused approach for DetailPanel)
  abstract getDetailData(): DetailData;

  /**
   * Get metadata for FloatingBox display (maintains view/model separation)
   * Returns plain data for title and color styling - no element type exposed to UI
   */
  getFloatingBoxMetadata(): { title: string; color: string } {
    const metadata = elementTypes[this.type];
    const detailData = this.getDetailData();

    return {
      title: detailData.titlebarTitle, // e.g., "Class: Specimen" or "Specimen"
      color: `${metadata.color.headerBg} ${metadata.color.headerBorder}` // Tailwind classes
    };
  }

  /**
   * Badge value to display in panel sections (e.g., count).
   * Return undefined for no badge.
   *
   * NOTE: This is a temporary simple implementation. Badges will be overhauled
   * in future to show multiple counts and clarify what they mean.
   */
  getBadge(): number | undefined {
    return undefined; // Default: no badge
  }

  /**
   * Get the unique identifier for this element.
   * Returns the element name, which serves as its identity.
   *
   * Architecture principle: getId() always returns just the element name.
   * UI layer handles contextualization via contextualizeId() utility.
   *
   * @returns The element name (e.g., 'Specimen')
   */
  getId(): string {
    return this.name;
  }

  /**
   * Expose id as getter that calls getId().
   * Provides convenient property access for element ID.
   */
  get id(): string {
    return this.getId();
  }

  /**
   * Get indicator badges for this element (e.g., "abstract" for classes).
   * Default implementation returns empty array; subclasses override as needed.
   *
   * @returns Array of indicator objects with text and color (Tailwind classes)
   */
  getIndicators(): Array<{ text: string; color: string }> {
    return [];
  }

  /**
   * Get section item data for display in Section component.
   * Adapts Element data to SectionItemData format that components expect.
   *
   * @param _context Panel context for ID generation ('leftPanel' or 'rightPanel')
   * @param level Nesting level in tree (0 for root items)
   * @param isExpanded Whether this item is currently expanded
   * @param isClickable Whether this item can be clicked to open details
   * @param hasChildren Optional override for hasChildren (used by VariableCollection)
   * @returns SectionItemData object for component rendering
   */
  getSectionItemData(
    _context: 'leftPanel' | 'middlePanel' | 'rightPanel',
    level: number = 0,
    isExpanded: boolean = false,
    isClickable: boolean = true,
    hasChildren?: boolean
  ): import('../components/Section').SectionItemData {
    const typeInfo = elementTypes[this.type];
    const badge = this.getBadge();

    return {
      id: this.getId(),
      displayName: this.name,
      level,
      badgeColor: badge !== undefined ? `${typeInfo.color.badgeBg} ${typeInfo.color.badgeText}` : undefined,
      badgeText: badge !== undefined ? badge.toString() : undefined,
      indicators: this.getIndicators(),
      hasChildren: hasChildren !== undefined ? hasChildren : this.children.length > 0,
      isExpanded,
      isClickable,
      hoverData: {
        id: this.getId(),
        type: this.type,
        name: this.name
      }
    };
  }

  // ============================================================================
  // Tree capabilities - Element can participate in hierarchical structures
  // ============================================================================

  /**
   * Parent element in tree structure (undefined for root elements)
   */
  parent?: Element;

  /**
   * Child elements in tree structure
   */
  children: Element[] = [];

  /**
   * Full path from root to this node as an array (e.g., ["Entity", "Specimen", "Material"])
   * Set during tree construction in collection fromData() methods
   * Available for all tree-structured elements (classes, enums, variables, slots)
   */
  pathFromRoot: string[] = [];

  /**
   * Get list of all ancestors (parent, grandparent, etc.) walking up the tree.
   * Returns empty array if this is a root element.
   * Non-recursive implementation for better performance.
   */
  ancestorList(): Element[] {
    const ancestors: Element[] = [];
    let current = this.parent;
    while (current) {
      ancestors.push(current);
      current = current.parent;
    }
    return ancestors;
  }

  /**
   * Depth-first traversal of tree starting from this element.
   * Calls fn on this element, then recursively on all children.
   */
  traverse(fn: (element: Element) => void): void {
    fn(this);
    this.children.forEach(child => child.traverse(fn));
  }

  /**
   * Convert tree to flat list of RenderableItems for display.
   * Respects expansion state to hide/show children.
   *
   * @param expandedItems Set of item names that are expanded
   * @param getIsClickable Optional callback to determine if item is clickable (default: all true)
   * @param level Current nesting level (used internally for recursion, defaults to 0)
   * @returns Flat list of RenderableItems with level and expansion info
   */
  toRenderableItems(
    expandedItems: Set<string>,
    getIsClickable?: (element: Element, level: number) => boolean,
    level: number = 0
  ): RenderableItem[] {
    const items: RenderableItem[] = [];

    const hasChildren = this.children.length > 0;
    const isExpanded = expandedItems.has(this.name);
    const isClickable = getIsClickable ? getIsClickable(this, level) : true;

    items.push({
      id: `${this.type}-${this.name}`,
      element: this,
      level,
      hasChildren,
      isExpanded,
      isClickable,
      badge: this.getBadge()
    });

    // Only traverse children if expanded
    if (isExpanded) {
      this.children.forEach(child => {
        items.push(...child.toRenderableItems(expandedItems, getIsClickable, level + 1));
      });
    }

    return items;
  }

  /**
   * Convert tree to flat list of SectionItemData for display.
   * Respects expansion state to hide/show children.
   *
   * @param context Panel context for ID generation ('leftPanel' or 'rightPanel')
   * @param expandedItems Set of item names that are expanded
   * @param getIsClickable Optional callback to determine if item is clickable (default: all true)
   * @param level Current nesting level (used internally for recursion, defaults to 0)
   * @returns Flat list of SectionItemData with level and expansion info
   */
  toSectionItems(
    context: 'leftPanel' | 'middlePanel' | 'rightPanel',
    expandedItems: Set<string>,
    getIsClickable?: (element: Element, level: number) => boolean,
    level: number = 0
  ): import('../components/Section').SectionItemData[] {
    const items: import('../components/Section').SectionItemData[] = [];

    const isExpanded = expandedItems.has(this.name);
    const isClickable = getIsClickable ? getIsClickable(this, level) : true;

    items.push(this.getSectionItemData(context, level, isExpanded, isClickable));

    // Only traverse children if expanded
    if (isExpanded) {
      this.children.forEach(child => {
        items.push(...child.toSectionItems(context, expandedItems, getIsClickable, level + 1));
      });
    }

    return items;
  }

  /**
   * Check if this element is abstract (only applicable to ClassElement).
   * Default implementation returns false; ClassElement overrides.
   */
  isAbstract(): boolean {
    return false;
  }

}

/**
 * Range - Abstract base class for elements that can serve as slot ranges
 *
 * Range extends Element to represent types that can be used as the range of a slot.
 * In LinkML schemas, slots can have ranges that are:
 * - Classes (e.g., Specimen, Entity)
 * - Enums (e.g., SpecimenTypeEnum, AnalyteTypeEnum)
 * - Types (e.g., string, integer, datetime)
 *
 * This abstraction allows uniform handling of slot range targets throughout the codebase.
 *
 * Inheritance hierarchy:
 * - Element (base for all model elements)
 *   - Range (base for slot range targets)
 *     - ClassElement (classes as ranges)
 *     - EnumElement (enums as ranges)
 *     - TypeElement (LinkML types as ranges)
 *   - SlotElement (slot definitions, not ranges themselves)
 *   - VariableElement (variables, not ranges)
 *
 * Stage 2 Step 4: Create Range abstract base class/interface
 */
export abstract class Range extends Element {
  // Range inherits all Element methods and properties
  // No additional methods needed for now - this is primarily a marker class
  // for type safety and semantic clarity
}

/**
 * Initialize ModelData from transformed SchemaData.
 * Creates all collections in proper dependency order and initializes global references.
 *
 * Collection creation order (dependencies):
 * 1. EnumCollection (no dependencies)
 * 2. TypeCollection (no dependencies) - NEW: Stage 2 Step 7
 * 3. SlotCollection (no dependencies)
 * 4. ClassCollection (needs slotCollection for validation)
 * 5. VariableCollection (needs classCollection)
 */
export function initializeModelData(schemaData: SchemaData): ModelData {
  // Build graph structure FIRST (Phase 3 Step 5: graph becomes primary data structure)
  const graph = buildGraphFromSchemaData(schemaData);

  // Create collections in proper order
  // TODO (Phase 3 Step 7): Consider removing Element classes entirely and using graph queries directly
  const enumCollection = EnumCollection.fromData(schemaData.enums);
  const typeCollection = TypeCollection.fromData(schemaData.types);
  const slotCollection = SlotCollection.fromData(schemaData.slots);
  const classCollection = ClassCollection.fromData(schemaData.classes, slotCollection);
  const variableCollection = VariableCollection.fromData(schemaData.variables, classCollection);

  const collections = new Map();
  collections.set('class', classCollection);
  collections.set('enum', enumCollection);
  collections.set('type', typeCollection);
  collections.set('slot', slotCollection);
  collections.set('variable', variableCollection);

  // Flatten all elements into name→element lookup map
  const elementLookup = new Map<string, Element>();
  collections.forEach(collection => {
    collection.getAllElements().forEach((element: Element) => {
      elementLookup.set(element.name, element);
    });
  });

  // Initialize graph references
  initializeGraphReferences(graph, elementLookup);

  return {
    collections,
    elementLookup,
    graph
  };
}

// ClassSlot removed - slot data now consolidated in SlotElement
// Use ClassElement.slotRefs + slotCollection.getElement() to access slot data

// ClassElement - represents a class in the schema
export class ClassElement extends Range {
  readonly type = 'class' as const;
  readonly name: string;
  readonly description: string | undefined;
  readonly parentId: string | undefined;  // Store parent ID, not Element reference (set in Element.parent)

  // Tree structure notes:
  // - parent/children (from Element base): Class hierarchy (subclasses)
  // - variables: VariableElements for this class (separate array, wired in orchestration)
  variables: VariableElement[] = [];  // Wired later in orchestration

  readonly abstract: boolean;

  // Slot references - look up SlotElement from slotCollection when needed
  readonly slotRefs: SlotReference[];
  private readonly slotCollection: SlotCollection;

  /** Computed property - returns variable count on-demand */
  get variableCount(): number {
    return this.variables.length;
  }

  /**
   * Get SlotElement for a slot reference ID
   */
  getSlotElement(slotId: string): SlotElement | null {
    return (this.slotCollection.getElement(slotId) as SlotElement | null) ?? null;
  }

  constructor(data: ClassData, slotCollection: SlotCollection) {
    super();
    this.slotCollection = slotCollection;
    this.name = data.name;
    this.description = data.description;
    this.parentId = data.parent;
    this.abstract = data.abstract;
    this.slotRefs = data.slots;
  }

  getDetailData(): DetailData {
    const metadata = elementTypes[this.type];
    const sections: DetailSection[] = [];

    // Inheritance section
    if (this.parentId) {
      sections.push({
        name: 'Inheritance',
        text: `Inherits from: ${this.parentId}`
      });
    }

    // Slots section
    if (this.slotRefs.length > 0) {
      const { slotSources } = APP_CONFIG;

      const slotsList = this.slotRefs
        .map(slotRef => {
          const slot = this.getSlotElement(slotRef.id);
          if (!slot) return null;

          // Determine source label
          let source: string;
          if (slot.overrides) {
            source = slotSources.override;
          } else if (slot.global) {
            source = slotSources.global;
          } else {
            source = slotSources.defined;
          }

          // Add inheritance info if inherited
          if (slotRef.inheritedFrom) {
            source += ` (${slotSources.inheritedSuffix} ${slotRef.inheritedFrom})`;
          }

          return [
            slot.name,
            source,
            slot.range || '',
            slot.required ? 'Yes' : 'No',
            slot.multivalued ? 'Yes' : 'No',
            slot.description || ''
          ];
        })
        .filter((row): row is string[] => row !== null)
        .sort((a, b) => a[0].localeCompare(b[0]));

      if (slotsList.length > 0) {
        sections.push({
          name: 'Slots',
          tableHeadings: ['Name', 'Source', 'Range', 'Required', 'Multivalued', 'Description'],
          tableContent: slotsList,
          tableHeadingColor: elementTypes['slot'].color.headerBg
        });
      }
    }

    // Variables section
    if (this.variables && this.variables.length > 0) {
      const variableList = this.variables.map(v => [
        v.name,
        v.dataType,
        v.ucumUnit,
        v.curie,
        v.description
      ]);

      sections.push({
        name: `Variables (${this.variableCount})`,
        tableHeadings: ['Label', 'Data Type', 'Unit', 'CURIE', 'Description'],
        tableContent: variableList,
        tableHeadingColor: elementTypes['variable'].color.headerBg
      });
    }

    return {
      titlebarTitle: `${metadata.label}: ${this.name}`,
      title: this.name,
      subtitle: this.parentId ? `extends ${this.parentId}` : undefined,
      titleColor: metadata.color.headerBg,
      description: this.description,
      sections
    };
  }

  getBadge(): number | undefined {
    return this.variableCount > 0 ? this.variableCount : undefined;
  }

  getIndicators(): Array<{ text: string; color: string }> {
    if (this.isAbstract()) {
      return [{ text: 'abstract', color: 'text-purple-600 dark:text-purple-400' }];
    }
    return [];
  }

  isAbstract(): boolean {
    return this.abstract;
  }
}

// EnumElement - represents an enumeration
// Stage 2 Step 4: Now extends Range instead of Element
export class EnumElement extends Range {
  readonly type = 'enum' as const;
  readonly name: string;
  readonly description: string | undefined;
  readonly permissibleValues: EnumValue[];

  constructor(name: string, data: EnumData) {
    super();
    this.name = name;
    this.description = data.description;

    // Transform permissibleValues from Record to EnumValue[]
    this.permissibleValues = [];
    if (data.permissibleValues) {
      Object.entries(data.permissibleValues).forEach(([key, valueDef]) => {
        this.permissibleValues.push({
          key,
          description: valueDef?.description
        });
      });
    }
  }

  getDetailData(): DetailData {
    const metadata = elementTypes[this.type];
    const sections: DetailSection[] = [];

    // Permissible Values section
    if (this.permissibleValues.length > 0) {
      const values = this.permissibleValues.map(v => [
        v.key,
        v.description || ''
      ]);

      sections.push({
        name: 'Permissible Values',
        tableHeadings: ['Value', 'Description'],
        tableContent: values
      });
    }

    // Used By Classes section
    const usedByClasses = this.getUsedByClasses();
    if (usedByClasses.length > 0) {
      const classList = usedByClasses.map(className => [className]);
      sections.push({
        name: `Used By Classes (${usedByClasses.length})`,
        tableHeadings: ['Class Name'],
        tableContent: classList
      });
    }

    return {
      titlebarTitle: `${metadata.label}: ${this.name}`,
      title: this.name,
      subtitle: undefined,
      titleColor: metadata.color.headerBg,
      description: this.description,
      sections
    };
  }

  getBadge(): number | undefined {
    return this.permissibleValues.length;
  }

  /**
   * Get classes that use this enum as a slot range (computed on-demand).
   * Queries graph for incoming SLOT edges.
   *
   * Performance: O(1) graph query vs O(n) class scan
   */
  getUsedByClasses(): string[] {
    if (!globalGraph) {
      console.warn('EnumElement.getUsedByClasses(): globalGraph not initialized');
      return [];
    }

    return getClassesUsingRange(globalGraph, this.name);
  }
}

// TypeElement - represents a LinkML type (from linkml:types)
// Stage 2 Step 4: Create TypeElement class extending Range
export class TypeElement extends Range {
  readonly type = 'type' as const;
  readonly name: string;
  readonly description: string | undefined;
  readonly uri: string;
  readonly base: string;
  readonly repr: string | undefined;
  readonly notes: string | undefined;
  readonly exactMappings: string[] | undefined;
  readonly closeMappings: string[] | undefined;
  readonly broadMappings: string[] | undefined;
  readonly conformsTo: string | undefined;

  constructor(name: string, data: TypeData) {
    super();
    this.name = name;
    this.description = data.description;
    this.uri = data.uri;
    this.base = data.base;
    this.repr = data.repr;
    this.notes = data.notes;
    this.exactMappings = data.exactMappings;
    this.closeMappings = data.closeMappings;
    this.broadMappings = data.broadMappings;
    this.conformsTo = data.conformsTo;
  }

  getDetailData(): DetailData {
    const metadata = elementTypes[this.type];
    const sections: DetailSection[] = [];

    // Type Properties section
    const typeProps: unknown[][] = [];
    typeProps.push(['URI', this.uri]);
    typeProps.push(['Base', this.base]);
    if (this.repr) {
      typeProps.push(['Representation', this.repr]);
    }
    if (this.conformsTo) {
      typeProps.push(['Conforms To', this.conformsTo]);
    }

    sections.push({
      name: 'Properties',
      tableHeadings: ['Property', 'Value'],
      tableContent: typeProps,
      tableHeadingColor: metadata.color.headerBg
    });

    // Mappings section (if any exist)
    if (this.exactMappings || this.closeMappings || this.broadMappings) {
      const mappings: unknown[][] = [];
      if (this.exactMappings && this.exactMappings.length > 0) {
        mappings.push(['Exact', this.exactMappings.join(', ')]);
      }
      if (this.closeMappings && this.closeMappings.length > 0) {
        mappings.push(['Close', this.closeMappings.join(', ')]);
      }
      if (this.broadMappings && this.broadMappings.length > 0) {
        mappings.push(['Broad', this.broadMappings.join(', ')]);
      }

      if (mappings.length > 0) {
        sections.push({
          name: 'Mappings',
          tableHeadings: ['Type', 'Values'],
          tableContent: mappings,
          tableHeadingColor: metadata.color.headerBg
        });
      }
    }

    // Notes section (if exists)
    if (this.notes) {
      sections.push({
        name: 'Notes',
        text: this.notes
      });
    }

    return {
      titlebarTitle: `Type: ${this.name}`,
      title: this.name,
      titleColor: metadata.color.headerBg,
      description: this.description,
      sections
    };
  }

  /**
   * Get classes that use this type as a slot range (computed on-demand).
   * Queries graph for incoming SLOT edges.
   *
   * Performance: O(1) graph query
   */
  getUsedByClasses(): string[] {
    if (!globalGraph) {
      console.warn('TypeElement.getUsedByClasses(): globalGraph not initialized');
      return [];
    }

    return getClassesUsingRange(globalGraph, this.name);
  }

  getBadge(): number | undefined {
    const usedByClasses = this.getUsedByClasses();
    return usedByClasses.length > 0 ? usedByClasses.length : undefined;
  }
}

// SlotElement - represents a slot definition (global, inline, or override)
export class SlotElement extends Element {
  readonly type = 'slot' as const;
  readonly name: string;
  readonly description: string | undefined;
  readonly range: string | undefined;
  readonly slot_uri: string | undefined;
  readonly identifier: boolean | undefined;
  readonly required: boolean | undefined;
  readonly multivalued: boolean | undefined;
  readonly global: boolean | undefined;     // true = defined in schema's global slots section
  readonly overrides: string | undefined;   // For override slots: ID of base slot being overridden

  constructor(name: string, data: SlotData) {
    super();
    this.name = name;
    this.description = data.description;
    this.range = data.range;
    this.slot_uri = data.slotUri;
    this.identifier = data.identifier;
    this.required = data.required;
    this.multivalued = data.multivalued;
    this.global = data.global;
    this.overrides = data.overrides;
  }

  getDetailData(): DetailData {
    const metadata = elementTypes[this.type];
    const sections: DetailSection[] = [];

    // Slot Properties section
    const properties: [string, string][] = [];
    if (this.range) {
      properties.push(['Range', this.range]);
    }
    if (this.required !== undefined) {
      properties.push(['Required', this.required ? 'Yes' : 'No']);
    }
    if (this.multivalued !== undefined) {
      properties.push(['Multivalued', this.multivalued ? 'Yes' : 'No']);
    }
    if (this.identifier !== undefined) {
      properties.push(['Identifier', this.identifier ? 'Yes' : 'No']);
    }
    if (this.slot_uri) {
      properties.push(['Slot URI', this.slot_uri]);
    }

    if (properties.length > 0) {
      sections.push({
        name: 'Properties',
        tableHeadings: ['Property', 'Value'],
        tableContent: properties
      });
    }

    // Used By Classes section
    const usedByClasses = this.getUsedByClasses();
    if (usedByClasses.length > 0) {
      const classList = usedByClasses.map(className => [className]);
      sections.push({
        name: `Used By Classes (${usedByClasses.length})`,
        tableHeadings: ['Class Name'],
        tableContent: classList
      });
    }

    return {
      titlebarTitle: `${metadata.label}: ${this.name}`,
      title: this.name,
      subtitle: undefined,
      titleColor: metadata.color.headerBg,
      description: this.description,
      sections
    };
  }

  getBadge(): number | undefined {
    const usedByClasses = this.getUsedByClasses();
    return usedByClasses.length > 0 ? usedByClasses.length : undefined;
  }

  /**
   * Get classes that use this slot (computed on-demand).
   * Queries graph for SLOT edges with matching slotDefId.
   *
   * Performance: O(edges) graph iteration vs O(classes × attributes) nested loop
   */
  getUsedByClasses(): string[] {
    if (!globalGraph) {
      console.warn('SlotElement.getUsedByClasses(): globalGraph not initialized');
      return [];
    }

    return getClassesUsingSlot(globalGraph, this.name);
  }
}

// VariableElement - represents a variable specification
export class VariableElement extends Element {
  readonly type = 'variable' as const;
  readonly maps_to: string;  // Class ID that this variable maps to (renamed from classId)
  readonly name: string;  // variableLabel
  readonly description: string;  // variableDescription
  readonly dataType: string;
  readonly ucumUnit: string;
  readonly curie: string;

  constructor(data: VariableSpec) {
    super();
    this.maps_to = data.maps_to;
    this.name = data.variableLabel;
    this.description = data.variableDescription;
    this.dataType = data.dataType;
    this.ucumUnit = data.ucumUnit;
    this.curie = data.curie;
  }

  getDetailData(): DetailData {
    const metadata = elementTypes[this.type];
    const sections: DetailSection[] = [];

    // Variable Properties section
    const properties: [string, string][] = [];
    properties.push(['Mapped to', this.maps_to]);
    if (this.dataType) {
      properties.push(['Data Type', this.dataType]);
    }
    if (this.ucumUnit) {
      properties.push(['Unit', this.ucumUnit]);
    }
    if (this.curie) {
      properties.push(['CURIE', this.curie]);
    }

    sections.push({
      name: 'Properties',
      tableHeadings: ['Property', 'Value'],
      tableContent: properties
    });

    return {
      titlebarTitle: `${metadata.label}: ${this.name}`,
      title: this.name,
      subtitle: undefined,
      titleColor: metadata.color.headerBg,
      description: this.description,
      sections
    };
  }

}

// ============================================================================
// ElementCollection - Manages groups of elements for panel rendering
// ============================================================================

export abstract class ElementCollection {
  abstract readonly type: ElementTypeId;
  abstract readonly id: string;  // Collection identifier (matches type string value, no type coupling)

  /** Get human-readable label with count (e.g., "Enumerations (40)") */
  abstract getLabel(): string;

  /** Get default expansion state (set of expanded item names) */
  abstract getDefaultExpansion(): Set<string>;

  /** Get expansion state key for URL persistence (null if no expansion needed) */
  abstract getExpansionKey(position: 'left' | 'middle' | 'right'): string | null;

  /** Get a single element by name/identifier */
  abstract getElement(name: string): Element | null;

  /** Get all elements in this collection as a flat array */
  abstract getAllElements(): Element[];

  abstract roots: Element[]
  /**
   * Get section data for display in Section component.
   * Returns SectionData with getItems function that generates items based on expansion state.
   */
  getSectionData(position: 'left' | 'middle' | 'right'): import('../components/Section').SectionData {
    return {
      id: this.id,
      label: this.getLabel(),
      getItems: (expandedItems?: Set<string>) => {
        const items: import('../components/Section').SectionItemData[] = [];
        this.roots.forEach(root => {
          items.push(...root.toSectionItems(positionToContext(position), expandedItems || new Set()));
        });
        return items;
      },
      expansionKey: this.getExpansionKey(position) || undefined,
      defaultExpansion: this.getDefaultExpansion()
    };
  }

}

// EnumCollection - flat list of enumerations
export class EnumCollection extends ElementCollection {
  readonly type = 'enum' as const;
  readonly id = 'enum';
  readonly roots: EnumElement[];

  constructor(roots: EnumElement[]) {
    super();
    this.roots = roots;
  }

  /** Factory: Create from raw data (called by dataLoader) */
  static fromData(enumData: Map<string, EnumData>): EnumCollection {
    // Convert EnumData to flat list of EnumElements (no hierarchy)
    const roots = Array.from(enumData.entries())
      .map(([name, data]) => {
        const element = new EnumElement(name, data);
        element.pathFromRoot = [element.name];  // Flat list: pathFromRoot = [name]
        return element;
      })
      .sort((a, b) => a.name.localeCompare(b.name));

    return new EnumCollection(roots);
  }

  getLabel(): string {
    const metadata = elementTypes[this.type];
    return `${metadata.pluralLabel} (${this.roots.length})`;
  }

  getDefaultExpansion(): Set<string> {
    return new Set(); // No expansion for flat list
  }

  getExpansionKey(_position: 'left' | 'middle' | 'right'): string | null {
    return null; // No expansion state needed
  }

  getElement(name: string): Element | null {
    return this.roots.find(element => element.name === name) || null;
  }

  getAllElements(): Element[] {
    return this.roots;
  }
}

// TypeCollection - flat list of LinkML types
// Stage 2 Step 7: Add TypeCollection for types from linkml:types
export class TypeCollection extends ElementCollection {
  readonly type = 'type' as const;
  readonly id = 'type';
  readonly roots: TypeElement[];

  constructor(roots: TypeElement[]) {
    super();
    this.roots = roots;
  }

  /** Factory: Create from raw data (called by dataLoader) */
  static fromData(typeData: Map<string, import('./SchemaTypes').TypeData>): TypeCollection {
    // Convert TypeData to flat list of TypeElements (no hierarchy)
    const roots = Array.from(typeData.entries())
      .map(([name, data]) => {
        const element = new TypeElement(name, data);
        element.pathFromRoot = [element.name];  // Flat list: pathFromRoot = [name]
        return element;
      })
      .sort((a, b) => a.name.localeCompare(b.name));

    return new TypeCollection(roots);
  }

  getLabel(): string {
    const metadata = elementTypes[this.type];
    return `${metadata.pluralLabel} (${this.roots.length})`;
  }

  getDefaultExpansion(): Set<string> {
    return new Set(); // No expansion for flat list
  }

  getExpansionKey(_position: 'left' | 'middle' | 'right'): string | null {
    return null; // No expansion state needed
  }

  getElement(name: string): Element | null {
    return this.roots.find(element => element.name === name) || null;
  }

  getAllElements(): Element[] {
    return this.roots;
  }
}

// SlotCollection - flat list of slot definitions
export class SlotCollection extends ElementCollection {
  readonly type = 'slot' as const;
  readonly id = 'slot';
  readonly roots: SlotElement[];

  constructor(roots: SlotElement[]) {
    super();
    this.roots = roots;
  }

  /** Factory: Create from raw data (called by dataLoader) */
  static fromData(slotData: Map<string, SlotData>): SlotCollection {
    // Convert SlotData to flat list of SlotElements (no hierarchy)
    const roots = Array.from(slotData.entries())
      .map(([name, data]) => {
        const element = new SlotElement(name, data);
        element.pathFromRoot = [element.name];  // Flat list: pathFromRoot = [name]
        return element;
      })
      .sort((a, b) => a.name.localeCompare(b.name));

    return new SlotCollection(roots);
  }

  getLabel(): string {
    const metadata = elementTypes[this.type];
    return `${metadata.pluralLabel} (${this.roots.length})`;
  }

  getDefaultExpansion(): Set<string> {
    return new Set(); // No expansion for flat list
  }

  getExpansionKey(_position: 'left' | 'middle' | 'right'): string | null {
    return null; // No expansion state needed
  }

  getElement(name: string): Element | null {
    return this.roots.find(element => element.name === name) || null;
  }

  getAllElements(): Element[] {
    return this.roots;
  }

  /** Get underlying slots Map (needed for ClassElement constructor) */
  getSlots(): Map<string, SlotElement> {
    // Convert roots array to Map for ClassElement constructor
    const map = new Map<string, SlotElement>();
    this.roots.forEach(slot => {
      map.set(slot.name, slot);
    });
    return map;
  }
}

// ClassCollection - hierarchical tree of classes
export class ClassCollection extends ElementCollection {
  readonly type = 'class' as const;
  readonly id = 'class';
  readonly roots: ClassElement[];

  constructor(roots: ClassElement[]) {
    super();
    this.roots = roots;
  }

  /** Factory: Create from raw data (called by dataLoader) */
  static fromData(classData: ClassData[], slotCollection: SlotCollection): ClassCollection {
    // 1. Create all ClassElements
    const elementMap = new Map<string, ClassElement>();
    classData.forEach(metadata => {
      const element = new ClassElement(metadata, slotCollection);
      elementMap.set(element.name, element);
    });

    // 2. Wire up parent-child relationships using Element.parent and Element.children
    const roots: ClassElement[] = [];
    elementMap.forEach(element => {
      if (element.parentId) {
        const parentElement = elementMap.get(element.parentId);
        if (parentElement) {
          element.parent = parentElement;  // Set Element.parent reference
          parentElement.children.push(element);  // Add to parent's children array
        } else {
          console.warn(`ClassElement "${element.name}" has parent "${element.parentId}" that doesn't exist`);
          roots.push(element);  // Treat as root if parent not found
        }
      } else {
        roots.push(element);  // No parent = root element
      }
    });

    // Sort children by name at each level and compute pathFromRoot
    const sortAndComputePath = (element: Element, parentPath: string[] = []) => {
      // Compute pathFromRoot: parentPath + this element's name
      element.pathFromRoot = [...parentPath, element.name];

      // Sort children and recurse
      element.children.sort((a, b) => a.name.localeCompare(b.name));
      element.children.forEach(child => sortAndComputePath(child, element.pathFromRoot));
    };
    roots.forEach(root => sortAndComputePath(root));

    return new ClassCollection(roots);
  }

  getLabel(): string {
    const metadata = elementTypes[this.type];
    return `${metadata.pluralLabel} (${this.getAllElements().length})`;
  }

  getDefaultExpansion(): Set<string> {
    // Auto-expand first 2 levels (but only nodes that have children)
    const expanded = new Set<string>();
    const collectUpToLevel = (element: Element, level: number) => {
      if (level >= 2) return;
      // Only track expansion state for nodes that have children
      if (element.children.length > 0) {
        expanded.add(element.name);
      }
      element.children.forEach(child => collectUpToLevel(child, level + 1));
    };
    this.roots.forEach(root => collectUpToLevel(root, 0));
    return expanded;
  }

  getExpansionKey(position: 'left' | 'middle' | 'right'): string | null {
    if (position === 'left') return 'lce';
    if (position === 'middle') return 'mce';
    return 'rce'; // left/middle/right class expansion
  }

  getElement(name: string): Element | null {
    // Search through the tree for element with matching name
    let found: Element | null = null;
    const search = (element: Element) => {
      if (element.name === name) {
        found = element;
        return;
      }
      element.children.forEach(search);
    };
    this.roots.forEach(search);
    return found;
  }

  getAllElements(): Element[] {
    // Flatten the tree into an array
    const elements: Element[] = [];
    this.roots.forEach(root => {
      root.traverse(element => elements.push(element));
    });
    return elements;
  }

  /** Get root nodes of class hierarchy (needed for tests and tree rendering) */
  getRootElements(): ClassElement[] {
    return this.roots;
  }
}

// VariableCollection - tree with ClassElement headers and VariableElement children
export class VariableCollection extends ElementCollection {
  readonly type = 'variable' as const;
  readonly id = 'variable';
  readonly roots: ClassElement[];
  private variables: VariableElement[];

  constructor(roots: ClassElement[], variables: VariableElement[]) {
    super();
    this.roots = roots;
    this.variables = variables;
  }

  /** Factory: Create from raw data (called by dataLoader) */
  static fromData(variableData: VariableSpec[], classCollection: ClassCollection): VariableCollection {
    // Convert transformed VariableSpec data to VariableElement instances
    const variableElements = variableData.map(spec => new VariableElement(spec));

    // Group variables by class name
    const groupedByClass = new Map<string, VariableElement[]>();
    variableElements.forEach(variable => {
      const className = variable.maps_to;
      if (!groupedByClass.has(className)) {
        groupedByClass.set(className, []);
      }
      groupedByClass.get(className)!.push(variable);
    });

    // Sort variables within each group
    groupedByClass.forEach(vars => {
      vars.sort((a, b) => a.name.localeCompare(b.name));
    });

    // Wire variables array into ClassElement instances and compute pathFromRoot
    groupedByClass.forEach((variables, className) => {
      const classElement = classCollection.getElement(className) as ClassElement | null;
      if (classElement) {
        classElement.variables = variables;
        // Set pathFromRoot for each variable: [...classPath, variableName]
        variables.forEach(variable => {
          variable.pathFromRoot = [...classElement.pathFromRoot, variable.name];
        });
      }
    });

    // Build roots array (ClassElement headers sorted by name)
    const roots: ClassElement[] = [];
    const sortedClassNames = Array.from(groupedByClass.keys()).sort((a, b) => a.localeCompare(b));

    for (const className of sortedClassNames) {
      const classElement = classCollection.getElement(className) as ClassElement;
      if (!classElement) {
        console.warn(`VariableCollection: Class "${className}" not found in classCollection`);
        continue;
      }
      roots.push(classElement);
    }

    return new VariableCollection(roots, variableElements);
  }

  getLabel(): string {
    const metadata = elementTypes[this.type];
    return `${metadata.pluralLabel} (${this.variables.length})`;
  }

  getDefaultExpansion(): Set<string> {
    return new Set(); // Start with all groups collapsed
  }

  getExpansionKey(position: 'left' | 'middle' | 'right'): string | null {
    return position === 'left' ? 'lve' : 'rve'; // left/right variable expansion
  }

  getElement(name: string): Element | null {
    // Variables use name (which is variableLabel) as identifier
    return this.variables.find(v => v.name === name) || null;
  }

  getAllElements(): Element[] {
    return this.variables;
  }
}
