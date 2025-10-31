// Element-based architecture for generic rendering and relationship tracking
// See CLAUDE.md and ARCHITECTURE.md for architecture details

import * as React from 'react';
import type { ClassNode, EnumDefinition, SlotDefinition, VariableSpec } from '../types';
import { getElementHoverHandlers } from '../hooks/useElementHover';
import type { ElementTypeId, RelationshipTypeId } from './ElementRegistry';
import { ELEMENT_TYPES } from './ElementRegistry';
import type { RenderableItem } from './RenderableItem';
import { Tree, type TreeNode } from './Tree';

// Union type for all element data types
export type ElementData = ClassNode | EnumDefinition | SlotDefinition | VariableSpec;

// Property definition from class attributes
interface PropertyDefinition {
  range: string;
  description?: string;
  required?: boolean;
  multivalued?: boolean;
  [key: string]: unknown;
}

// Relationship types for SVG link visualization
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

// Base abstract class for all element types
export abstract class Element {
  abstract readonly type: ElementTypeId;
  abstract readonly name: string;
  abstract readonly description: string | undefined;

  // Panel rendering (with depth for tree structures)
  abstract renderPanelSection(
    depth: number,
    onSelect: (element: ElementData, elementType: string) => void
  ): React.ReactElement;

  // Detail view rendering
  abstract renderDetails(
    onNavigate: (target: string, targetType: string) => void
  ): React.ReactElement;

  // Detail data extraction (data-focused approach for DetailPanel)
  abstract getDetailData(): DetailData;

  // Relationship extraction for SVG links
  abstract getRelationships(): Relationship[];

  // DOM helpers for SVG positioning
  // Looks for elements with id={type}-{name} (e.g., "class-Specimen")
  getBoundingBox(): DOMRect | null {
    const el = document.getElementById(`${this.type}-${this.name}`);
    return el ? el.getBoundingClientRect() : null;
  }

  // Shared utility: render element name
  protected renderName() {
    return <span className="font-semibold">{this.name}</span>;
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

// ClassElement - represents a class in the schema
export class ClassElement extends Element {
  readonly type = 'class' as const;
  readonly name: string;
  readonly description: string | undefined;
  readonly parent: string | undefined;
  readonly variableCount: number;
  readonly variables: VariableSpec[];
  readonly properties: Record<string, PropertyDefinition> | undefined;
  readonly isEnum: boolean;
  readonly enumReferences: string[] | undefined;
  readonly requiredProperties: string[] | undefined;
  readonly slots: string[] | undefined;
  readonly slot_usage: Record<string, PropertyDefinition> | undefined;
  readonly abstract: boolean | undefined;
  private slotElements: Map<string, SlotElement>;

  constructor(data: ClassNode, slotElements: Map<string, SlotElement>) {
    super();
    this.name = data.name;
    this.description = data.description;
    this.parent = data.parent;
    this.variableCount = data.variableCount;
    this.variables = data.variables;
    this.properties = data.properties as Record<string, PropertyDefinition> | undefined;
    this.isEnum = data.isEnum;
    this.enumReferences = data.enumReferences;
    this.requiredProperties = data.requiredProperties;
    this.slots = data.slots;
    this.slot_usage = data.slot_usage as Record<string, PropertyDefinition> | undefined;
    this.abstract = data.abstract;
    this.slotElements = slotElements;
  }

  renderDetails(_onNavigate: (target: string, targetType: string) => void) {
    // This will be implemented once DetailTable is created
    // For now, return a placeholder
    return (
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{this.name}</h1>
            {this.abstract && (
              <span className="px-2 py-1 text-xs bg-gray-200 dark:bg-slate-700 rounded">
                Abstract
              </span>
            )}
          </div>
          {this.description && (
            <p className="text-gray-600 dark:text-gray-300 mt-2">{this.description}</p>
          )}
        </div>

        {/* TODO: Implement slots table, variables table */}
        <p className="text-gray-500">Detail rendering to be implemented with DetailTable component</p>
      </div>
    );
  }

  getDetailData(): DetailData {
    const metadata = ELEMENT_TYPES[this.type];
    const sections: DetailSection[] = [];

    // Inheritance section
    if (this.parent) {
      sections.push({
        name: 'Inheritance',
        text: `Inherits from: ${this.parent}`
      });
    }

    // Attributes section (from properties)
    if (this.properties && Object.keys(this.properties).length > 0) {
      const attributes = Object.entries(this.properties).map(([name, def]) => [
        name,
        def.range || '',
        def.required ? 'Yes' : 'No',
        def.multivalued ? 'Yes' : 'No',
        def.description || ''
      ]);

      sections.push({
        name: 'Attributes',
        tableHeadings: ['Name', 'Range', 'Required', 'Multivalued', 'Description'],
        tableContent: attributes,
        tableHeadingColor: ELEMENT_TYPES['slot'].color.headerBg
      });
    }

    // Slots section (from slot_usage)
    if (this.slot_usage && Object.keys(this.slot_usage).length > 0) {
      const slotUsages = Object.entries(this.slot_usage).map(([name, def]) => [
        name,
        def.range || '',
        def.required ? 'Yes' : 'No',
        def.multivalued ? 'Yes' : 'No',
        def.description || ''
      ]);

      sections.push({
        name: 'Slot Usage',
        tableHeadings: ['Name', 'Range', 'Required', 'Multivalued', 'Description'],
        tableContent: slotUsages,
        tableHeadingColor: ELEMENT_TYPES['slot'].color.headerBg
      });
    }

    // Referenced slots section
    if (this.slots && this.slots.length > 0) {
      const slotList = this.slots.map(slotName => [slotName]);
      sections.push({
        name: 'Referenced Slots',
        tableHeadings: ['Slot Name'],
        tableContent: slotList,
        tableHeadingColor: ELEMENT_TYPES['slot'].color.headerBg
      });
    }

    // Variables section
    if (this.variables && this.variables.length > 0) {
      const variableList = this.variables.map(v => [
        v.variableLabel,
        v.dataType,
        v.ucumUnit,
        v.curie,
        v.variableDescription
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
      subtitle: this.parent ? `extends ${this.parent}` : undefined,
      titleColor: metadata.color.headerBg,
      description: this.description,
      sections
    };
  }

  getRelationships(): Relationship[] {
    const rels: Relationship[] = [];

    // Inheritance relationship
    if (this.parent) {
      rels.push({
        type: 'inherits',
        target: this.parent,
        targetType: 'class',
        isSelfRef: false
      });
    }

    // Properties with non-primitive ranges
    if (this.properties) {
      Object.entries(this.properties).forEach(([propName, propDef]) => {
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
}

// EnumElement - represents an enumeration
export class EnumElement extends Element {
  readonly type = 'enum' as const;
  readonly name: string;
  readonly description: string | undefined;
  readonly permissibleValues: EnumValue[];
  readonly usedByClasses: string[];

  constructor(data: EnumDefinition) {
    super();
    this.name = data.name;
    this.description = data.description;
    this.permissibleValues = data.permissible_values;
    this.usedByClasses = data.usedByClasses;
  }

  renderPanelSection(
    _depth: number,
    onSelect: (element: ElementData, elementType: string) => void
  ) {
    return (
      <div
        key={this.name}
        id={`enum-${this.name}`}
        data-element-type="enum"
        data-element-name={this.name}
        className="cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 px-2 py-1"
        onClick={() => onSelect(this as unknown as ElementData, 'enum')}
      >
        {this.name}
        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
          ({this.permissibleValues.length})
        </span>
      </div>
    );
  }

  renderDetails(_onNavigate: (target: string, targetType: string) => void) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{this.name}</h1>
          {this.description && (
            <p className="text-gray-600 dark:text-gray-300 mt-2">{this.description}</p>
          )}
        </div>

        {/* TODO: Implement with DetailTable */}
        <p className="text-gray-500">Detail rendering to be implemented with DetailTable component</p>
      </div>
    );
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
    if (this.usedByClasses.length > 0) {
      const classList = this.usedByClasses.map(className => [className]);
      sections.push({
        name: `Used By Classes (${this.usedByClasses.length})`,
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
  readonly usedByClasses: string[];

  constructor(data: SlotDefinition) {
    super();
    this.name = data.name;
    this.description = data.description;
    this.range = data.range;
    this.slot_uri = data.slot_uri;
    this.identifier = data.identifier;
    this.required = data.required;
    this.multivalued = data.multivalued;
    this.usedByClasses = data.usedByClasses;
  }

  renderPanelSection(
    _depth: number,
    onSelect: (element: ElementData, elementType: string) => void
  ) {
    return (
      <div
        key={this.name}
        id={`slot-${this.name}`}
        data-element-type="slot"
        data-element-name={this.name}
        className="cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 px-2 py-1"
        onClick={() => onSelect(this as unknown as ElementData, 'slot')}
      >
        {this.name}
        {this.range && (
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
            : {this.range}
          </span>
        )}
      </div>
    );
  }

  renderDetails(onNavigate: (target: string, targetType: string) => void) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{this.name}</h1>
          {this.description && (
            <p className="text-gray-600 dark:text-gray-300 mt-2">{this.description}</p>
          )}
        </div>

        {/* Slot metadata */}
        <div className="space-y-2">
          {this.range && (
            <div>
              <span className="font-semibold">Range: </span>
              <span>{this.range}</span>
            </div>
          )}
          {this.required !== undefined && (
            <div>
              <span className="font-semibold">Required: </span>
              <span>{this.required ? 'Yes' : 'No'}</span>
            </div>
          )}
          {this.multivalued !== undefined && (
            <div>
              <span className="font-semibold">Multivalued: </span>
              <span>{this.multivalued ? 'Yes' : 'No'}</span>
            </div>
          )}
        </div>

        {/* Used by classes */}
        {this.usedByClasses && this.usedByClasses.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-2">
              Used By Classes ({this.usedByClasses.length})
            </h2>
            <ul className="list-disc list-inside space-y-1">
              {this.usedByClasses.map(className => (
                <li key={className}>
                  <button
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                    onClick={() => onNavigate(className, 'class')}
                  >
                    {className}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
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
    if (this.usedByClasses.length > 0) {
      const classList = this.usedByClasses.map(className => [className]);
      sections.push({
        name: `Used By Classes (${this.usedByClasses.length})`,
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
    return this.usedByClasses.length > 0 ? this.usedByClasses.length : undefined;
  }
}

// VariableElement - represents a variable specification
export class VariableElement extends Element {
  readonly type = 'variable' as const;
  readonly bdchmElement: string;
  readonly name: string;  // variableLabel
  readonly description: string;  // variableDescription
  readonly dataType: string;
  readonly ucumUnit: string;
  readonly curie: string;

  constructor(data: VariableSpec) {
    super();
    this.bdchmElement = data.bdchmElement;
    this.name = data.variableLabel;
    this.description = data.variableDescription;
    this.dataType = data.dataType;
    this.ucumUnit = data.ucumUnit;
    this.curie = data.curie;
  }

  renderPanelSection(
    _depth: number,
    onSelect: (element: ElementData, elementType: string) => void
  ) {
    return (
      <div
        key={this.name}
        id={`variable-${this.name}`}
        data-element-type="variable"
        data-element-name={this.name}
        className="cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 px-2 py-1 text-sm"
        onClick={() => onSelect(this as unknown as ElementData, 'variable')}
      >
        <span>{this.name}</span>
        {this.dataType && (
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
            ({this.dataType})
          </span>
        )}
      </div>
    );
  }

  renderDetails(onNavigate: (target: string, targetType: string) => void) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{this.name}</h1>
          {this.description && (
            <p className="text-gray-600 dark:text-gray-300 mt-2">{this.description}</p>
          )}
        </div>

        {/* Variable metadata */}
        <div className="space-y-2">
          <div>
            <span className="font-semibold">Mapped to: </span>
            <button
              className="text-blue-600 dark:text-blue-400 hover:underline"
              onClick={() => onNavigate(this.bdchmElement, 'class')}
            >
              {this.bdchmElement}
            </button>
          </div>
          {this.dataType && (
            <div>
              <span className="font-semibold">Data Type: </span>
              <span>{this.dataType}</span>
            </div>
          )}
          {this.ucumUnit && (
            <div>
              <span className="font-semibold">Unit: </span>
              <span>{this.ucumUnit}</span>
            </div>
          )}
          {this.curie && (
            <div>
              <span className="font-semibold">CURIE: </span>
              <span className="font-mono text-sm">{this.curie}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  getDetailData(): DetailData {
    const metadata = ELEMENT_TYPES[this.type];
    const sections: DetailSection[] = [];

    // Variable Properties section
    const properties: [string, string][] = [];
    properties.push(['Mapped to', this.bdchmElement]);
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
      target: this.bdchmElement,
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
}

// EnumCollection - flat list of enumerations
export class EnumCollection extends ElementCollection {
  readonly type = 'enum' as const;
  private tree: Tree<EnumElement>;

  constructor(tree: Tree<EnumElement>) {
    super();
    this.tree = tree;
  }

  /** Factory: Create from raw data (called by dataLoader) */
  static fromData(enumData: Map<string, EnumDefinition>): EnumCollection {
    // Convert EnumDefinitions to flat tree (all roots, no children)
    const roots: TreeNode<EnumElement>[] = Array.from(enumData.values())
      .map(def => ({
        data: new EnumElement(def),
        children: [],
        parent: undefined
      }))
      .sort((a, b) => a.data.name.localeCompare(b.data.name));

    return new EnumCollection(new Tree(roots));
  }

  getLabel(): string {
    const metadata = ELEMENT_TYPES[this.type];
    return `${metadata.pluralLabel} (${this.tree.roots.length})`;
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
    const node = this.tree.find(element => element.name === name);
    return node ? node.data : null;
  }

  getAllElements(): Element[] {
    return this.tree.flatten();
  }

  getRenderableItems(expandedItems?: Set<string>): RenderableItem[] {
    return this.tree.toRenderableItems(expandedItems || new Set());
  }
}

// SlotCollection - flat list of slot definitions
export class SlotCollection extends ElementCollection {
  readonly type = 'slot' as const;
  private tree: Tree<SlotElement>;

  constructor(tree: Tree<SlotElement>) {
    super();
    this.tree = tree;
  }

  /** Factory: Create from raw data (called by dataLoader) */
  static fromData(slotData: Map<string, SlotDefinition>): SlotCollection {
    // Convert SlotDefinitions to flat tree (all roots, no children)
    const roots: TreeNode<SlotElement>[] = Array.from(slotData.values())
      .map(def => ({
        data: new SlotElement(def),
        children: [],
        parent: undefined
      }))
      .sort((a, b) => a.data.name.localeCompare(b.data.name));

    return new SlotCollection(new Tree(roots));
  }

  getLabel(): string {
    const metadata = ELEMENT_TYPES[this.type];
    return `${metadata.pluralLabel} (${this.tree.roots.length})`;
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
    const node = this.tree.find(element => element.name === name);
    return node ? node.data : null;
  }

  getAllElements(): Element[] {
    return this.tree.flatten();
  }

  getRenderableItems(expandedItems?: Set<string>): RenderableItem[] {
    return this.tree.toRenderableItems(expandedItems || new Set());
  }

  /** Get underlying slots Map (needed for ClassElement constructor) */
  getSlots(): Map<string, SlotElement> {
    // Convert tree to Map for ClassElement constructor
    const map = new Map<string, SlotElement>();
    this.tree.flatten().forEach(slot => {
      map.set(slot.name, slot);
    });
    return map;
  }
}

// ClassCollection - hierarchical tree of classes
export class ClassCollection extends ElementCollection {
  readonly type = 'class' as const;
  private tree: Tree<ClassElement>;

  constructor(tree: Tree<ClassElement>) {
    super();
    this.tree = tree;
  }

  /** Factory: Create from raw data (called by dataLoader) */
  static fromData(rootNodes: ClassNode[], slotElements: Map<string, SlotElement>): ClassCollection {
    // Convert ClassNode tree (with children[]) to TreeNode<ClassElement>
    const convertToTreeNode = (classNode: ClassNode): TreeNode<ClassElement> => {
      const element = new ClassElement(classNode, slotElements);
      const treeNode: TreeNode<ClassElement> = {
        data: element,
        children: classNode.children.map(convertToTreeNode),
        parent: undefined
      };
      // Link parent references
      treeNode.children.forEach(child => child.parent = treeNode);
      return treeNode;
    };

    const roots = rootNodes.map(convertToTreeNode);
    return new ClassCollection(new Tree(roots));
  }

  getLabel(): string {
    const metadata = ELEMENT_TYPES[this.type];
    return `${metadata.pluralLabel} (${this.tree.flatten().length})`;
  }

  getSectionIcon(): string {
    return ELEMENT_TYPES[this.type].icon;
  }

  getDefaultExpansion(): Set<string> {
    // Auto-expand first 2 levels (but only nodes that have children)
    const expanded = new Set<string>();
    const collectUpToLevel = (node: TreeNode<ClassElement>, level: number) => {
      if (level >= 2) return;
      // Only track expansion state for nodes that have children
      if (node.children.length > 0) {
        expanded.add(node.data.name);
      }
      node.children.forEach(child => collectUpToLevel(child, level + 1));
    };
    this.tree.roots.forEach(root => collectUpToLevel(root, 0));
    return expanded;
  }

  getExpansionKey(position: 'left' | 'right'): string | null {
    return position === 'left' ? 'lce' : 'rce'; // left/right class expansion
  }

  getElement(name: string): Element | null {
    const node = this.tree.find(element => element.name === name);
    return node ? node.data : null;
  }

  getAllElements(): Element[] {
    return this.tree.flatten();
  }

  /** Get root nodes of class hierarchy (needed for tests and tree rendering) */
  getRootElements(): ClassElement[] {
    return this.tree.roots.map(node => node.data);
  }

  getRenderableItems(expandedItems?: Set<string>): RenderableItem[] {
    return this.tree.toRenderableItems(expandedItems || new Set());
  }
}

// VariableCollection - tree with ClassElement headers and VariableElement children
export class VariableCollection extends ElementCollection {
  readonly type = 'variable' as const;
  private tree: Tree<Element>;
  private variables: VariableElement[];

  constructor(tree: Tree<Element>, variables: VariableElement[]) {
    super();
    this.tree = tree;
    this.variables = variables;
  }

  /** Factory: Create from raw data (called by dataLoader) */
  static fromData(variableData: VariableSpec[], classCollection: ClassCollection): VariableCollection {
    // Convert VariableSpec DTOs to VariableElement instances
    const variableElements = variableData.map(spec => new VariableElement(spec));

    // Group variables by class name
    const groupedByClass = new Map<string, VariableElement[]>();
    variableElements.forEach(variable => {
      const className = variable.bdchmElement;
      if (!groupedByClass.has(className)) {
        groupedByClass.set(className, []);
      }
      groupedByClass.get(className)!.push(variable);
    });

    // Sort variables within each group
    groupedByClass.forEach(vars => {
      vars.sort((a, b) => a.name.localeCompare(b.name));
    });

    // Build tree with ClassElement headers (level 0) and VariableElement children (level 1)
    const roots: TreeNode<Element>[] = [];
    const sortedClassNames = Array.from(groupedByClass.keys()).sort((a, b) => a.localeCompare(b));

    for (const className of sortedClassNames) {
      const classElement = classCollection.getElement(className);
      if (!classElement) {
        console.warn(`VariableCollection: Class "${className}" not found in classCollection`);
        continue;
      }

      const variables = groupedByClass.get(className)!;
      const children: TreeNode<Element>[] = variables.map(variable => ({
        data: variable,
        children: [],
        parent: undefined // will be set below
      }));

      const rootNode: TreeNode<Element> = {
        data: classElement,
        children,
        parent: undefined
      };

      // Link parent references
      children.forEach(child => child.parent = rootNode);
      roots.push(rootNode);
    }

    return new VariableCollection(new Tree(roots), variableElements);
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
    // Use toRenderableItems with callback to mark level 0 (ClassElement headers) as non-clickable
    return this.tree.toRenderableItems(
      expandedItems || new Set(),
      (element, level) => level > 0 // Only variables (level 1) are clickable
    );
  }
}

// Factory function to create Element instances
export function createElement(
  data: ElementData,
  source: ElementTypeId,
  context?: { slotDefinitions?: Map<string, SlotDefinition> }
): Element {
  switch (source) {
    case 'class':
      return new ClassElement(data as ClassNode, context?.slotDefinitions || new Map());
    case 'enum':
      return new EnumElement(data as EnumDefinition);
    case 'slot':
      return new SlotElement(data as SlotDefinition);
    case 'variable':
      return new VariableElement(data as VariableSpec);
  }
}
