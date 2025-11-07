// Element-based architecture for generic rendering and relationship tracking
// See CLAUDE.md and ARCHITECTURE.md for architecture details

import type {
  ClassDTO,
  ClassData,
  EnumDTO,
  EnumData,
  ModelData,
  SlotDTO,
  SlotData,
  VariableSpec,
  EnumValue,
  SchemaData
} from '../types';
import type { ElementTypeId, RelationshipTypeId } from './ElementRegistry';
import { ELEMENT_TYPES } from './ElementRegistry';
import type { RenderableItem } from './RenderableItem';

// Union type for all element data types
export type ElementData = ClassDTO | EnumDTO | SlotDTO | VariableSpec;

// Property definition from class attributes
interface PropertyDefinition {
  range: string;
  description?: string;
  required?: boolean;
  multivalued?: boolean;
}

// Relationship types for SVG link visualization
// [sg] this is weird
export interface Relationship {
  type: RelationshipTypeId;
  label?: string;           // Property name (for property relationships)
  target: string;           // Target element name
  targetType: ElementTypeId;
  isSelfRef?: boolean;      // True if target === this.name
}

// Detail panel data structures (for getDetailData())
export interface DetailSection {
  name: string;
  text?: string;
  tableHeadings?: string[];
  tableContent?: unknown[][];
  tableHeadingColor?: string; // Tailwind classes for heading background
}

export interface DetailData {
  titlebarTitle: string;    // "Class: Specimen"
  title: string;            // "Specimen"
  subtitle?: string;        // "extends Entity"
  titleColor: string;       // From ELEMENT_TYPES[type].color
  description?: string;
  sections: DetailSection[];
}

// Inline type for relationship data to avoid circular dependency
// Component RelationshipSidebar defines the external interface
type IncomingRelationships = {
  subclasses: string[];
  usedByAttributes: Array<{
    className: string;
    attributeName: string;
    sourceType: ElementTypeId;
  }>;
  variables: Array<{
    name: string;
  }>;
};

type SlotInfo = {
  attributeName: string;
  target: string;
  targetType: ElementTypeId;
  isSelfRef: boolean;
};

type OutgoingRelationships = {
  inheritance?: {
    target: string;
    targetType: ElementTypeId;
  };
  slots: SlotInfo[];
  inheritedSlots: Array<{
    ancestorName: string;
    slots: SlotInfo[];
  }>;
};

/**
 * Compute incoming relationships for an element (generic helper)
 * Scans globalClassCollection to find reverse relationships.
 */
function computeIncomingRelationships(thisElement: Element): IncomingRelationships {
  const incoming: IncomingRelationships = {
    subclasses: [],
    usedByAttributes: [],
    variables: []
  };

  if (!globalClassCollection) {
    return incoming;
  }

  const allClasses = globalClassCollection.getAllElements() as ClassElement[];

  for (const otherClass of allClasses) {
    // Find subclasses (classes that inherit from this element)
    if (thisElement.type === 'class' && otherClass.parentId === thisElement.getId()) {
      incoming.subclasses.push(otherClass.getId());
    }

    // Find class slots that reference this element (for enums and slots)
    // Uses classSlots which includes attributes, slot_usage, and slot_reference
    if (thisElement.type === 'enum' || thisElement.type === 'slot') {
      for (const classSlot of otherClass.classSlots) {
        if (classSlot.range === thisElement.getId()) {
          incoming.usedByAttributes.push({
            className: otherClass.getId(),
            attributeName: classSlot.name,
            sourceType: 'class'
          });
        }
      }
    }
  }

  // Sort results
  incoming.subclasses.sort();
  incoming.usedByAttributes.sort((a, b) => {
    if (a.className !== b.className) {
      return a.className.localeCompare(b.className);
    }
    return a.attributeName.localeCompare(b.attributeName);
  });

  return incoming;
}

// Base abstract class for all element types
export abstract class Element {
  protected abstract readonly type: ElementTypeId;
  abstract readonly name: string;
  abstract readonly description: string | undefined;

  // Detail data extraction (data-focused approach for DetailPanel)
  abstract getDetailData(): DetailData;

  // Relationship extraction for SVG links
  abstract getRelationships(): Relationship[];

  /**
   * Get relationship data for info box display
   * Uses existing getRelationships() for outgoing + computeIncomingRelationships() helper
   * Returns data matching RelationshipData interface from RelationshipInfoBox component
   */
  getRelationshipData() {
    const relationships = this.getRelationships();

    // Build outgoing relationships from existing getRelationships()
    const outgoing: OutgoingRelationships = {
      slots: [],
      inheritedSlots: []
    };

    for (const rel of relationships) {
      if (rel.type === 'inherits') {
        outgoing.inheritance = {
          target: rel.target,
          targetType: rel.targetType
        };
      } else if (rel.type === 'property') {
        outgoing.slots.push({
          attributeName: rel.label || 'range', // 'range' for slots without label
          target: rel.target,
          targetType: rel.targetType,
          isSelfRef: rel.isSelfRef || false
        });
      }
    }

    // Compute inherited slots for classes
    if (this.type === 'class') {
      const classElement = this as ClassElement;
      const ancestors = classElement.ancestorList().reverse(); // Most general first

      for (const ancestor of ancestors) {
        if (ancestor.type === 'class') {
          const ancestorClass = ancestor as ClassElement;
          const ancestorSlots: SlotInfo[] = [];

          // Get slots defined in this ancestor (not inherited from its parent)
          for (const classSlot of ancestorClass.classSlots) {
            const rel = ancestorClass.getRelationships().find(
              r => r.type === 'property' && r.label === classSlot.name
            );
            if (rel) {
              ancestorSlots.push({
                attributeName: classSlot.name,
                target: rel.target,
                targetType: rel.targetType,
                isSelfRef: rel.isSelfRef || false
              });
            }
          }

          if (ancestorSlots.length > 0) {
            outgoing.inheritedSlots.push({
              ancestorName: ancestorClass.name,
              slots: ancestorSlots
            });
          }
        }
      }
    }

    // Compute incoming relationships using generic helper
    const incoming = computeIncomingRelationships(this);

    // Add variable list for classes
    if (this.type === 'class') {
      incoming.variables = (this as ClassElement).variables.map(v => ({ name: v.name }));
    }

    // Get header background color for this item type
    const metadata = ELEMENT_TYPES[this.type];
    const color = metadata?.color.headerBg || 'bg-gray-500';

    return {
      itemName: this.name,
      itemType: this.type,
      color,
      outgoing,
      incoming
    };
  }

  /**
   * Get metadata for FloatingBox display (maintains view/model separation)
   * Returns plain data for title and color styling - no element type exposed to UI
   */
  getFloatingBoxMetadata(): { title: string; color: string } {
    const metadata = ELEMENT_TYPES[this.type];
    const detailData = this.getDetailData();

    return {
      title: detailData.titlebarTitle, // e.g., "Class: Specimen" or "Specimen"
      color: `${metadata.color.headerBg} ${metadata.color.headerBorder}` // Tailwind classes
    };
  }

  // DOM helpers for SVG positioning
  // Looks for elements with id={type}-{name} (e.g., "class-Specimen")
  getBoundingBox(): DOMRect | null {
    const el = document.getElementById(`${this.type}-${this.name}`);
    return el ? el.getBoundingClientRect() : null;
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
   * @param context Panel context for ID generation ('leftPanel' or 'rightPanel')
   * @param level Nesting level in tree (0 for root items)
   * @param isExpanded Whether this item is currently expanded
   * @param isClickable Whether this item can be clicked to open details
   * @param hasChildren Optional override for hasChildren (used by VariableCollection)
   * @returns SectionItemData object for component rendering
   */
  getSectionItemData(
    context: 'leftPanel' | 'rightPanel',
    level: number = 0,
    isExpanded: boolean = false,
    isClickable: boolean = true,
    hasChildren?: boolean
  ): import('../components/Section').SectionItemData {
    const typeInfo = ELEMENT_TYPES[this.type];
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
   * Full path from root to this node (e.g., "Entity.Specimen.Material")
   * Set during tree construction in collection fromData() methods
   * Available for all tree-structured elements (classes, enums, variables, slots)
   */
  nodePath: string = '';

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
    context: 'leftPanel' | 'rightPanel',
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

// Name → Type lookup for accurate categorization (avoids duck typing)
let nameToTypeMap: Map<string, 'class' | 'enum' | 'slot'> | null = null;

/**
 * Initialize element name lookup map. Call this once after loading ModelData.
 * Prevents duck typing (e.g., checking if name ends with "Enum")
 */
export function initializeElementNameMap(
  classNames: string[],
  enumNames: string[],
  slotNames: string[]
): void {
  nameToTypeMap = new Map();
  classNames.forEach(name => nameToTypeMap!.set(name, 'class'));
  enumNames.forEach(name => nameToTypeMap!.set(name, 'enum'));
  slotNames.forEach(name => nameToTypeMap!.set(name, 'slot'));
}

// ClassCollection reference for on-demand getUsedByClasses() computation
let globalClassCollection: ClassCollection | null = null;

/**
 * Initialize global ClassCollection reference. Call this once after creating ClassCollection.
 * Used by EnumElement and SlotElement to compute getUsedByClasses() on-demand.
 */
export function initializeClassCollection(collection: ClassCollection): void {
  globalClassCollection = collection;
}

/**
 * Initialize ModelData from transformed SchemaData.
 * Creates all collections in proper dependency order and initializes global references.
 *
 * Collection creation order (dependencies):
 * 1. EnumCollection (no dependencies)
 * 2. SlotCollection (no dependencies)
 * 3. ClassCollection (needs slotCollection for validation)
 * 4. VariableCollection (needs classCollection)
 */
export function initializeModelData(schemaData: SchemaData): ModelData {
  // Create collections in proper order
  const enumCollection = EnumCollection.fromData(schemaData.enums);
  const slotCollection = SlotCollection.fromData(schemaData.slots);
  const classCollection = ClassCollection.fromData(schemaData.classes, slotCollection);
  const variableCollection = VariableCollection.fromData(schemaData.variables, classCollection);

  // Initialize global references for on-demand computation
  initializeClassCollection(classCollection);

  const collections = new Map();
  collections.set('class', classCollection);
  collections.set('enum', enumCollection);
  collections.set('slot', slotCollection);
  collections.set('variable', variableCollection);

  // Flatten all elements into name→element lookup map
  const elementLookup = new Map<string, Element>();
  collections.forEach(collection => {
    collection.getAllElements().forEach(element => {
      elementLookup.set(element.name, element);
    });
  });

  // Initialize element name lookup map for accurate type categorization
  const classNames = classCollection.getAllElements().map(c => c.name);
  const enumNames = Array.from(schemaData.enums.keys());
  const slotNames = Array.from(schemaData.slots.keys());
  initializeElementNameMap(classNames, enumNames, slotNames);

  return {
    collections,
    elementLookup
  };
}

// Helper to categorize range types
function categorizeRange(range: string): 'class' | 'enum' | 'primitive' {
  const primitives = ['string', 'integer', 'float', 'double', 'decimal', 'boolean', 'date', 'datetime', 'time', 'uri', 'uriorcurie'];

  if (primitives.includes(range.toLowerCase())) {
    return 'primitive';
  }

  // Use lookup map if available (avoids duck typing)
  if (nameToTypeMap?.has(range)) {
    const type = nameToTypeMap.get(range)!;
    return type === 'slot' ? 'class' : type; // Treat slot refs as class relationships
  }

  // Fallback to duck typing if map not initialized (shouldn't happen in normal use)
  console.warn(`categorizeRange: nameToTypeMap not initialized, falling back to duck typing for "${range}"`);
  if (range.endsWith('Enum')) {
    return 'enum';
  }
  return 'class';
}

/**
 * ClassSlot - represents a slot as used within a specific class.
 * Wraps a SlotElement with class-specific overrides from slot_usage or inline attribute definitions.
 *
 * Design principle: Use direct properties (e.g., `range`, `required`) not `*Override` suffix.
 * Original values remain accessible via `baseSlot` reference.
 */
export class ClassSlot {
  readonly name: string;
  readonly baseSlot: SlotElement;  // Reference to the slot (or synthetic SlotElement for attributes)
  readonly source: 'attribute' | 'slot_usage' | 'slot_reference';
  slotPath: string = '';  // Full ancestry path where slot was defined (e.g., "Entity.Specimen.Material")

  // Internal override values (undefined means "use base slot value")
  private readonly _range?: string;
  private readonly _required?: boolean;
  private readonly _multivalued?: boolean;
  private readonly _description?: string;

  constructor(
    name: string,
    baseSlot: SlotElement,
    source: 'attribute' | 'slot_usage' | 'slot_reference',
    overrides?: {
      range?: string;
      required?: boolean;
      multivalued?: boolean;
      description?: string;
    }
  ) {
    this.name = name;
    this.baseSlot = baseSlot;
    this.source = source;
    this._range = overrides?.range;
    this._required = overrides?.required;
    this._multivalued = overrides?.multivalued;
    this._description = overrides?.description;
  }

  // Property getters - work like SlotElement properties
  get range(): string {
    return this.getEffectiveRange();
  }

  get required(): boolean {
    return this.getEffectiveRequired();
  }

  get multivalued(): boolean {
    return this.getEffectiveMultivalued();
  }

  get description(): string | undefined {
    return this.getEffectiveDescription();
  }

  /**
   * Get effective range with fallback to base slot.
   * Returns 'string' as final fallback if neither override nor base has a value.
   */
  getEffectiveRange(): string {
    return this._range ?? this.baseSlot.range ?? 'string';
  }

  /**
   * Get effective required flag with fallback to base slot.
   * Returns false as final fallback if neither override nor base has a value.
   */
  getEffectiveRequired(): boolean {
    return this._required ?? this.baseSlot.required ?? false;
  }

  /**
   * Get effective multivalued flag with fallback to base slot.
   * Returns false as final fallback if neither override nor base has a value.
   */
  getEffectiveMultivalued(): boolean {
    return this._multivalued ?? this.baseSlot.multivalued ?? false;
  }

  /**
   * Get effective description with fallback to base slot.
   * Returns undefined if neither override nor base has a description.
   */
  getEffectiveDescription(): string | undefined {
    return this._description ?? this.baseSlot.description;
  }

  /**
   * Check if any properties are overridden in this class.
   * Returns true if at least one override is set.
   */
  isOverridden(): boolean {
    return this.range !== undefined ||
           this.required !== undefined ||
           this.multivalued !== undefined ||
           this.description !== undefined;
  }
}

// ClassElement - represents a class in the schema
export class ClassElement extends Element {
  readonly type = 'class' as const;
  protected readonly dataModel: ModelData
  readonly name: string;
  readonly description: string | undefined;
  readonly parentId: string | undefined;  // Store parent ID, not Element reference (set in Element.parent)

  // Tree structure notes:
  // - parent/children (from Element base): Class hierarchy (subclasses)
  // - variables: VariableElements for this class (separate array, wired in orchestration)
  variables: VariableElement[] = [];  // Wired later in orchestration

  // Properties from metadata
  readonly attributes: Record<string, PropertyDefinition>;  // Kept for backward compatibility
  readonly slots: string[];  // Kept for backward compatibility
  readonly slot_usage: Record<string, PropertyDefinition> | undefined;  // Kept for backward compatibility
  readonly abstract: boolean;

  // ClassSlot instances (Phase 6.4 Step 3) - represents all slots used by this class
  readonly classSlots: ClassSlot[];

  /** Computed property - returns variable count on-demand */
  get variableCount(): number {
    return this.variables.length;
  }

  /**
   * Get the name of the class from which a slot was inherited.
   * Returns empty string if slot is not inherited (defined in this class).
   *
   * Uses slotPath (set during collectAllSlots()) to determine inheritance.
   * No recursion needed - slotPath contains the full ancestry information.
   *
   * @param slotName Name of the slot to check
   * @returns Class name where slot was defined, or empty string if defined in this class
   **/
  getInheritedFrom(slotName: string): string {
    // Find the slot in this class's collected slots
    const allSlots = this.collectAllSlots();
    const slot = allSlots[slotName];

    if (!slot || !slot.slotPath) {
      return '';
    }

    // Extract class name from slotPath (last component)
    // e.g., "Entity.Specimen" → "Specimen"
    const pathComponents = slot.slotPath.split('.');
    const definingClass = pathComponents[pathComponents.length - 1];

    // If defining class is this class, not inherited
    if (definingClass === this.name) {
      return '';
    }

    return definingClass;
  }

  /**
   * Collect all slots for this class, including inherited slots.
   * Child class slots override parent class slots with the same name.
   * Sets slotPath on each slot to indicate where it was defined.
   *
   * @returns Record mapping slot name to ClassSlot instance
   */
  collectAllSlots(): Record<string, ClassSlot> {
    const slots = new Map<string, ClassSlot>();

    // Add slots from this class and set slotPath
    this.classSlots.forEach(slot => {
      slot.slotPath = this.nodePath;  // Set path to where this slot is defined
      slots.set(slot.name, slot);
    });

    // Inherit from parent (parent slots are added only if not already present)
    // Parent slots already have their slotPath set
    if (this.parent) {
      const parentSlots = (this.parent as ClassElement).collectAllSlots();
      Object.entries(parentSlots).forEach(([name, parentSlot]) => {
        if (!slots.has(name)) {
          slots.set(name, parentSlot);
        }
      });
    }

    return Object.fromEntries(slots);
  }

  constructor(data: ClassData, dataModel: ModelData, slotCollection: SlotCollection) {
    super();
    this.dataModel = dataModel;
    this.name = data.name;
    this.description = data.description;
    this.parentId = data.parent;  // Store parent name (Element.parent set later in fromData())
    // [sg] parentId should probably be parentId

    // Keep existing properties for backward compatibility during transition
    this.attributes = data.attributes || {};

    // Normalize slots to array
    if (data.slots) {
      this.slots = Array.isArray(data.slots) ? data.slots : [data.slots];
    } else {
      this.slots = [];
    }

    this.slot_usage = data.slotUsage;
    this.abstract = data.abstract;

    // Create ClassSlot instances (Phase 6.4 Step 3)
    const classSlots: ClassSlot[] = [];

    // 1. Create ClassSlots for attributes (inline slots)
    Object.entries(this.attributes).forEach(([attrName, attrDef]) => {
      // Create synthetic SlotElement for this attribute
      const syntheticSlot = new SlotElement(attrName, {
        range: attrDef.range,
        description: attrDef.description,
        required: attrDef.required,
        multivalued: attrDef.multivalued
      });

      // Create ClassSlot wrapping the synthetic slot
      classSlots.push(new ClassSlot(
        attrName,
        syntheticSlot,
        'attribute'
      ));
    });

    // 2. Create ClassSlots for slot_usage (overridden slots)
    if (this.slot_usage) {
      Object.entries(this.slot_usage).forEach(([slotName, overrides]) => {
        // Look up global SlotElement
        const baseSlot = slotCollection.getElement(slotName) as SlotElement | null;
        if (baseSlot) {
          classSlots.push(new ClassSlot(
            slotName,
            baseSlot,
            'slot_usage',
            overrides
          ));
        } else {
          console.warn(`ClassElement "${this.name}": slot_usage references unknown slot "${slotName}"`);
        }
      });
    }

    // 3. Create ClassSlots for referenced slots (no overrides)
    this.slots.forEach(slotName => {
      // Skip if already in slot_usage (slot_usage takes precedence)
      if (this.slot_usage && slotName in this.slot_usage) {
        return;
      }

      // Look up global SlotElement
      const baseSlot = slotCollection.getElement(slotName) as SlotElement | null;
      if (baseSlot) {
        classSlots.push(new ClassSlot(
          slotName,
          baseSlot,
          'slot_reference'
        ));
      } else {
        console.warn(`ClassElement "${this.name}": slots array references unknown slot "${slotName}"`);
      }
    });

    this.classSlots = classSlots;
  }

  getDetailData(): DetailData {
    const metadata = ELEMENT_TYPES[this.type];
    const sections: DetailSection[] = [];

    // Inheritance section
    if (this.parentId) {
      sections.push({
        name: 'Inheritance',
        text: `Inherits from: ${this.parentId}`
      });
    }

    // Slots section (includes inherited slots via collectAllSlots())
    const allSlots = this.collectAllSlots();
    if (Object.keys(allSlots).length > 0) {
      // Track which slots are direct vs inherited
      const directSlotNames = new Set(this.classSlots.map(s => s.name));

      const slotsList = Object.entries(allSlots).map(([name, classSlot]) => {
        const isInherited = !directSlotNames.has(name);
        const inheritedFrom = isInherited ? this.getInheritedFrom(name) : '';

        // Map source to readable labels
        const sourceLabels = {
          'attribute': 'Attribute',
          'slot_usage': 'Slot Override',
          'slot_reference': 'Slot Reference'
        };
        let source = sourceLabels[classSlot.source];

        // Add inheritance info to source column
        if (inheritedFrom) {
          source += ` (from ${inheritedFrom})`;
        }

        return [
          name,
          source,
          classSlot.getEffectiveRange(),
          classSlot.getEffectiveRequired() ? 'Yes' : 'No',
          classSlot.getEffectiveMultivalued() ? 'Yes' : 'No',
          classSlot.getEffectiveDescription() || ''
        ];
      });

      sections.push({
        name: 'Slots (includes inherited)',
        tableHeadings: ['Name', 'Source', 'Range', 'Required', 'Multivalued', 'Description'],
        tableContent: slotsList,
        tableHeadingColor: ELEMENT_TYPES['slot'].color.headerBg
      });
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
        tableHeadingColor: ELEMENT_TYPES['variable'].color.headerBg
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

  getRelationships(): Relationship[] {
    const rels: Relationship[] = [];

    // Inheritance relationship
    if (this.parentId) {
      rels.push({
        type: 'inherits',
        target: this.parentId,
        targetType: 'class',
        isSelfRef: false
      });
    }

    // Attributes with non-primitive ranges
    if (this.attributes) {
      Object.entries(this.attributes).forEach(([propName, propDef]) => {
        const typedPropDef = propDef as PropertyDefinition;
        const range = typedPropDef.range;
        if (!range) return;

        const rangeCategory = categorizeRange(range);
        if (rangeCategory !== 'primitive') {
          rels.push({
            type: 'property',
            label: propName,
            target: range,
            targetType: rangeCategory,
            isSelfRef: range === this.name
          });
        }
      });
    }

    return rels;
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
export class EnumElement extends Element {
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
    const metadata = ELEMENT_TYPES[this.type];
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

  getRelationships(): Relationship[] {
    // Enums don't have outgoing relationships in current model
    // Could add reverse relationships: enum → classes that use it
    return [];
  }

  getBadge(): number | undefined {
    return this.permissibleValues.length;
  }

  /**
   * Get classes that use this enum (computed on-demand).
   * Scans all class attributes for range === this.name
   */
  getUsedByClasses(): string[] {
    if (!globalClassCollection) {
      console.warn('EnumElement.getUsedByClasses(): globalClassCollection not initialized');
      return [];
    }

    const usedBy: string[] = [];
    const allClasses = globalClassCollection.getAllElements() as ClassElement[];

    for (const cls of allClasses) {
      // Check if any attribute has range === this enum name
      if (cls.attributes) {
        for (const [_attrName, attrDef] of Object.entries(cls.attributes)) {
          if (attrDef.range === this.name) {
            usedBy.push(cls.name);
            break; // Found one match, no need to check other attributes
          }
        }
      }
    }

    return usedBy.sort();
  }
}

// SlotElement - represents a top-level slot definition
export class SlotElement extends Element {
  readonly type = 'slot' as const;
  readonly name: string;
  readonly description: string | undefined;
  readonly range: string | undefined;
  readonly slot_uri: string | undefined;
  readonly identifier: boolean | undefined;
  readonly required: boolean | undefined;
  readonly multivalued: boolean | undefined;

  constructor(name: string, data: SlotData) {
    super();
    this.name = name;
    this.description = data.description;
    this.range = data.range;
    this.slot_uri = data.slotUri;
    this.identifier = data.identifier;
    this.required = data.required;
    this.multivalued = data.multivalued;
  }

  getDetailData(): DetailData {
    const metadata = ELEMENT_TYPES[this.type];
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

  getRelationships(): Relationship[] {
    const rels: Relationship[] = [];

    // Slot range relationships
    // Note: slot→enum is valid in LinkML but doesn't occur in BDCHM data
    // (all 7 BDCHM slots have primitive or class ranges)
    if (this.range) {
      const rangeCategory = categorizeRange(this.range);
      if (rangeCategory !== 'primitive') {
        rels.push({
          type: 'property',
          target: this.range,
          targetType: rangeCategory,
          isSelfRef: false
        });
      }
    }

    return rels;
  }

  getBadge(): number | undefined {
    const usedByClasses = this.getUsedByClasses();
    return usedByClasses.length > 0 ? usedByClasses.length : undefined;
  }

  /**
   * Get classes that use this slot (computed on-demand).
   * Scans all classes for this slot in their slots array or slot_usage
   */
  getUsedByClasses(): string[] {
    if (!globalClassCollection) {
      console.warn('SlotElement.getUsedByClasses(): globalClassCollection not initialized');
      return [];
    }

    const usedBy: string[] = [];
    const allClasses = globalClassCollection.getAllElements() as ClassElement[];

    for (const cls of allClasses) {
      // Check if this slot is in the class's slots array
      if (cls.slots && cls.slots.includes(this.name)) {
        usedBy.push(cls.name);
        continue;
      }

      // Check if this slot is in slot_usage (refined/overridden slots)
      if (cls.slot_usage && this.name in cls.slot_usage) {
        usedBy.push(cls.name);
      }
    }

    return usedBy.sort();
  }
}

// VariableElement - represents a variable specification
export class VariableElement extends Element {
  readonly type = 'variable' as const;
  readonly classId: string;  // Mapped class (formerly bdchmElement)
  readonly name: string;  // variableLabel
  readonly description: string;  // variableDescription
  readonly dataType: string;
  readonly ucumUnit: string;
  readonly curie: string;

  constructor(data: VariableSpec) {
    super();
    this.classId = data.classId;
    this.name = data.variableLabel;
    this.description = data.variableDescription;
    this.dataType = data.dataType;
    this.ucumUnit = data.ucumUnit;
    this.curie = data.curie;
  }

  getDetailData(): DetailData {
    const metadata = ELEMENT_TYPES[this.type];
    const sections: DetailSection[] = [];

    // Variable Properties section
    const properties: [string, string][] = [];
    properties.push(['Mapped to', this.classId]);
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

  getRelationships(): Relationship[] {
    // Variable → Class relationship
    return [{
      type: 'property',
      label: 'mapped_to', // Add label so getRelationshipData() can use it
      target: this.classId,
      targetType: 'class',
      isSelfRef: false
    }];
  }
}

// ============================================================================
// ElementCollection - Manages groups of elements for panel rendering
// ============================================================================

export interface ElementCollectionCallbacks {
  onSelect: (element: Element) => void;
  onElementHover?: (element: { type: ElementTypeId; name: string }) => void;
  onElementLeave?: () => void;
}

export abstract class ElementCollection {
  abstract readonly type: ElementTypeId;
  abstract readonly id: string;  // Collection identifier (matches type string value, no type coupling)

  /** Get human-readable label with count (e.g., "Enumerations (40)") */
  abstract getLabel(): string;

  /** Get section icon for toggle (C, E, S, or V) */
  abstract getSectionIcon(): string;

  /** Get default expansion state (set of expanded item names) */
  abstract getDefaultExpansion(): Set<string>;

  /** Get expansion state key for URL persistence (null if no expansion needed) */
  abstract getExpansionKey(position: 'left' | 'right'): string | null;

  /** Get a single element by name/identifier */
  abstract getElement(name: string): Element | null;

  /** Get all elements in this collection as a flat array */
  abstract getAllElements(): Element[];

  /**
   * Get renderable items for display in Section
   * Returns items with structure/nesting info, ready for generic rendering
   */
  abstract getRenderableItems(expandedItems?: Set<string>): RenderableItem[];

  /**
   * Get section data for display in Section component.
   * Returns SectionData with getItems function that generates items based on expansion state.
   */
  abstract getSectionData(position: 'left' | 'right'): import('../components/Section').SectionData;
}

// EnumCollection - flat list of enumerations
export class EnumCollection extends ElementCollection {
  readonly type = 'enum' as const;
  readonly id = 'enum';
  private roots: EnumElement[];

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
        element.nodePath = element.name;  // Flat list: nodePath = name
        return element;
      })
      .sort((a, b) => a.name.localeCompare(b.name));

    return new EnumCollection(roots);
  }

  getLabel(): string {
    const metadata = ELEMENT_TYPES[this.type];
    return `${metadata.pluralLabel} (${this.roots.length})`;
  }

  getSectionIcon(): string {
    return ELEMENT_TYPES[this.type].icon;
  }

  getDefaultExpansion(): Set<string> {
    return new Set(); // No expansion for flat list
  }

  getExpansionKey(_position: 'left' | 'right'): string | null {
    return null; // No expansion state needed
  }

  getElement(name: string): Element | null {
    return this.roots.find(element => element.name === name) || null;
  }

  getAllElements(): Element[] {
    return this.roots;
  }

  getRenderableItems(expandedItems?: Set<string>): RenderableItem[] {
    const items: RenderableItem[] = [];
    this.roots.forEach(root => {
      items.push(...root.toRenderableItems(expandedItems || new Set()));
    });
    return items;
  }

  getSectionData(position: 'left' | 'right'): import('../components/Section').SectionData {
    return {
      id: this.id,
      label: this.getLabel(),
      getItems: (expandedItems?: Set<string>) => {
        const items: import('../components/Section').SectionItemData[] = [];
        this.roots.forEach(root => {
          items.push(...root.toSectionItems(position === 'left' ? 'leftPanel' : 'rightPanel', expandedItems || new Set()));
        });
        return items;
      },
      expansionKey: this.getExpansionKey(position) || undefined,
      defaultExpansion: this.getDefaultExpansion()
    };
  }
}

// SlotCollection - flat list of slot definitions
export class SlotCollection extends ElementCollection {
  readonly type = 'slot' as const;
  readonly id = 'slot';
  private roots: SlotElement[];

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
        element.nodePath = element.name;  // Flat list: nodePath = name
        return element;
      })
      .sort((a, b) => a.name.localeCompare(b.name));

    return new SlotCollection(roots);
  }

  getLabel(): string {
    const metadata = ELEMENT_TYPES[this.type];
    return `${metadata.pluralLabel} (${this.roots.length})`;
  }

  getSectionIcon(): string {
    return ELEMENT_TYPES[this.type].icon;
  }

  getDefaultExpansion(): Set<string> {
    return new Set(); // No expansion for flat list
  }

  getExpansionKey(_position: 'left' | 'right'): string | null {
    return null; // No expansion state needed
  }

  getElement(name: string): Element | null {
    return this.roots.find(element => element.name === name) || null;
  }

  getAllElements(): Element[] {
    return this.roots;
  }

  getRenderableItems(expandedItems?: Set<string>): RenderableItem[] {
    const items: RenderableItem[] = [];
    this.roots.forEach(root => {
      items.push(...root.toRenderableItems(expandedItems || new Set()));
    });
    return items;
  }

  getSectionData(position: 'left' | 'right'): import('../components/Section').SectionData {
    return {
      id: this.id,
      label: this.getLabel(),
      getItems: (expandedItems?: Set<string>) => {
        const items: import('../components/Section').SectionItemData[] = [];
        this.roots.forEach(root => {
          items.push(...root.toSectionItems(position === 'left' ? 'leftPanel' : 'rightPanel', expandedItems || new Set()));
        });
        return items;
      },
      expansionKey: this.getExpansionKey(position) || undefined,
      defaultExpansion: this.getDefaultExpansion()
    };
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
  private roots: ClassElement[];

  constructor(roots: ClassElement[]) {
    super();
    this.roots = roots;
  }

  /** Factory: Create from raw data (called by dataLoader) */
  static fromData(classData: ClassData[], slotCollection: SlotCollection): ClassCollection {
    // Create a temporary ModelData stub for ClassElement constructors
    // (Full ModelData will be set later via setModelData())
    const tempModelData = {
      collections: new Map(),
      elementLookup: new Map()
    } as ModelData;

    // 1. Create all ClassElements
    const elementMap = new Map<string, ClassElement>();
    classData.forEach(metadata => {
      const element = new ClassElement(metadata, tempModelData, slotCollection);
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

    // Sort children by name at each level and compute nodePath
    const sortAndComputePath = (element: Element, parentPath: string = '') => {
      // Compute nodePath: parentPath + this element's name
      element.nodePath = parentPath ? `${parentPath}.${element.name}` : element.name;

      // Sort children and recurse
      element.children.sort((a, b) => a.name.localeCompare(b.name));
      element.children.forEach(child => sortAndComputePath(child, element.nodePath));
    };
    roots.forEach(root => sortAndComputePath(root));

    return new ClassCollection(roots);
  }

  getLabel(): string {
    const metadata = ELEMENT_TYPES[this.type];
    return `${metadata.pluralLabel} (${this.getAllElements().length})`;
  }

  getSectionIcon(): string {
    return ELEMENT_TYPES[this.type].icon;
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

  getExpansionKey(position: 'left' | 'right'): string | null {
    return position === 'left' ? 'lce' : 'rce'; // left/right class expansion
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

  getRenderableItems(expandedItems?: Set<string>): RenderableItem[] {
    const items: RenderableItem[] = [];
    this.roots.forEach(root => {
      items.push(...root.toRenderableItems(expandedItems || new Set()));
    });
    return items;
  }

  getSectionData(position: 'left' | 'right'): import('../components/Section').SectionData {
    return {
      id: this.id,
      label: this.getLabel(),
      getItems: (expandedItems?: Set<string>) => {
        const items: import('../components/Section').SectionItemData[] = [];
        this.roots.forEach(root => {
          items.push(...root.toSectionItems(position === 'left' ? 'leftPanel' : 'rightPanel', expandedItems || new Set()));
        });
        return items;
      },
      expansionKey: this.getExpansionKey(position) || undefined,
      defaultExpansion: this.getDefaultExpansion()
    };
  }
}

// VariableCollection - tree with ClassElement headers and VariableElement children
export class VariableCollection extends ElementCollection {
  readonly type = 'variable' as const;
  readonly id = 'variable';
  private roots: ClassElement[];
  private groupedByClass: Map<string, VariableElement[]>;
  private variables: VariableElement[];

  constructor(roots: ClassElement[], groupedByClass: Map<string, VariableElement[]>, variables: VariableElement[]) {
    super();
    this.roots = roots;
    this.groupedByClass = groupedByClass;
    this.variables = variables;
  }

  /** Factory: Create from raw data (called by dataLoader) */
  static fromData(variableData: VariableSpec[], classCollection: ClassCollection): VariableCollection {
    // Convert VariableSpec DTOs to VariableElement instances
    const variableElements = variableData.map(spec => new VariableElement(spec));

    // Group variables by class name
    const groupedByClass = new Map<string, VariableElement[]>();
    variableElements.forEach(variable => {
      const className = variable.classId;
      if (!groupedByClass.has(className)) {
        groupedByClass.set(className, []);
      }
      groupedByClass.get(className)!.push(variable);
    });

    // Sort variables within each group
    groupedByClass.forEach(vars => {
      vars.sort((a, b) => a.name.localeCompare(b.name));
    });

    // Wire variables array into ClassElement instances and compute nodePath
    groupedByClass.forEach((variables, className) => {
      const classElement = classCollection.getElement(className) as ClassElement | null;
      if (classElement) {
        classElement.variables = variables;
        // Set nodePath for each variable: className.variableName
        variables.forEach(variable => {
          variable.nodePath = `${classElement.nodePath}.${variable.name}`;
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

    return new VariableCollection(roots, groupedByClass, variableElements);
  }

  getLabel(): string {
    const metadata = ELEMENT_TYPES[this.type];
    return `${metadata.pluralLabel} (${this.variables.length})`;
  }

  getSectionIcon(): string {
    return ELEMENT_TYPES[this.type].icon;
  }

  getDefaultExpansion(): Set<string> {
    return new Set(); // Start with all groups collapsed
  }

  getExpansionKey(position: 'left' | 'right'): string | null {
    return position === 'left' ? 'lve' : 'rve'; // left/right variable expansion
  }

  getElement(name: string): Element | null {
    // Variables use name (which is variableLabel) as identifier
    return this.variables.find(v => v.name === name) || null;
  }

  getAllElements(): Element[] {
    return this.variables;
  }

  getRenderableItems(expandedItems?: Set<string>): RenderableItem[] {
    // Build 2-level tree: ClassElement headers (level 0) with VariableElement children (level 1)
    const items: RenderableItem[] = [];

    this.roots.forEach(classElement => {
      const variables = this.groupedByClass.get(classElement.name) || [];
      const hasChildren = variables.length > 0;
      const isExpanded = expandedItems.has(classElement.name);

      // Add ClassElement header (level 0, non-clickable)
      items.push({
        id: `${classElement.type}-${classElement.name}`,
        element: classElement,
        level: 0,
        hasChildren,
        isExpanded,
        isClickable: false, // Headers are not clickable
        badge: classElement.getBadge()
      });

      // Add VariableElements if expanded (level 1, clickable)
      if (isExpanded) {
        variables.forEach(variable => {
          items.push({
            id: `${variable.type}-${variable.name}`,
            element: variable,
            level: 1,
            hasChildren: false,
            isExpanded: false,
            isClickable: true,
            badge: variable.getBadge()
          });
        });
      }
    });

    return items;
  }

  getSectionData(position: 'left' | 'right'): import('../components/Section').SectionData {
    return {
      id: this.id,
      label: this.getLabel(),
      getItems: (expandedItems?: Set<string>) => {
        // Build 2-level tree: ClassElement headers (level 0) with VariableElement children (level 1)
        const items: import('../components/Section').SectionItemData[] = [];
        const expanded = expandedItems || new Set();
        const context = position === 'left' ? 'leftPanel' : 'rightPanel';

        this.roots.forEach(classElement => {
          const variables = this.groupedByClass.get(classElement.name) || [];
          const hasChildren = variables.length > 0;
          const isExpanded = expanded.has(classElement.name);

          // Add ClassElement header (level 0, non-clickable)
          // Pass hasChildren explicitly since VariableCollection doesn't use Element tree structure
          items.push(classElement.getSectionItemData(context, 0, isExpanded, false, hasChildren));

          // Add VariableElements if expanded (level 1, clickable)
          if (isExpanded) {
            variables.forEach(variable => {
              items.push(variable.getSectionItemData(context, 1, false, true, false));
            });
          }
        });

        return items;
      },
      expansionKey: this.getExpansionKey(position) || undefined,
      defaultExpansion: this.getDefaultExpansion()
    };
  }
}
