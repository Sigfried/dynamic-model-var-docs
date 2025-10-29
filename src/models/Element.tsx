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
  readonly children: ClassElement[];
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
    this.children = data.children.map(child => new ClassElement(child, slotElements));
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

  renderPanelSection(
    depth: number,
    onSelect: (element: ElementData, elementType: string) => void
  ) {
    const indent = depth * 16;

    return (
      <div key={this.name}>
        <div
          id={`class-${this.name}`}
          data-element-type="class"
          data-element-name={this.name}
          style={{ paddingLeft: `${indent}px` }}
          className="cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 px-2 py-1"
          onClick={() => onSelect(this as unknown as ElementData, 'class')}
        >
          <span>{this.name}</span>
          {this.variableCount > 0 && (
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
              ({this.variableCount})
            </span>
          )}
          {this.abstract && (
            <span className="text-xs text-purple-600 dark:text-purple-400 ml-2 italic">
              abstract
            </span>
          )}
        </div>

        {/* Recursively render children */}
        {this.children.map(child =>
          child.renderPanelSection(depth + 1, onSelect)
        )}
      </div>
    );
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

  /** Render items for the panel section */
  abstract renderItems(
    callbacks: ElementCollectionCallbacks,
    position: 'left' | 'right',
    expandedItems?: Set<string>,
    toggleExpansion?: (item: string) => void
  ): React.ReactElement[];
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

  renderItems(
    callbacks: ElementCollectionCallbacks,
    position: 'left' | 'right',
    _expandedItems?: Set<string>,
    _toggleExpansion?: (item: string) => void
  ): React.ReactElement[] {
    // Get enums from tree (already sorted in fromData)
    const enumList = this.tree.flatten();

    const { color } = ELEMENT_TYPES[this.type];

    return enumList.map((enumElement) => {
      const hoverHandlers = getElementHoverHandlers({
        type: 'enum',
        name: enumElement.name,
        onElementHover: callbacks.onElementHover,
        onElementLeave: callbacks.onElementLeave
      });

      return (
        <div
          key={enumElement.name}
          id={`enum-${enumElement.name}`}
          data-element-type="enum"
          data-element-name={enumElement.name}
          data-panel-position={position}
          className="flex items-center gap-2 px-2 py-1 cursor-pointer rounded hover:bg-gray-100 dark:hover:bg-slate-700"
          onClick={() => callbacks.onSelect(enumElement)}
          {...hoverHandlers}
        >
          <span className="flex-1 text-sm font-medium">{enumElement.name}</span>
          <span className={`text-xs px-2 py-0.5 rounded ${color.badgeBg} ${color.badgeText}`}>
            {(enumElement as EnumElement).permissibleValues.length}
          </span>
        </div>
      );
    });
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

  renderItems(
    callbacks: ElementCollectionCallbacks,
    position: 'left' | 'right',
    _expandedItems?: Set<string>,
    _toggleExpansion?: (item: string) => void
  ): React.ReactElement[] {
    // Get slots from tree (already sorted in fromData)
    const slotList = this.tree.flatten();

    const { color } = ELEMENT_TYPES[this.type];

    return slotList.map((slotElement) => {
      const hoverHandlers = getElementHoverHandlers({
        type: 'slot',
        name: slotElement.name,
        onElementHover: callbacks.onElementHover,
        onElementLeave: callbacks.onElementLeave
      });

      return (
        <div
          key={slotElement.name}
          id={`slot-${slotElement.name}`}
          data-element-type="slot"
          data-element-name={slotElement.name}
          data-panel-position={position}
          className="flex items-center gap-2 px-2 py-1 cursor-pointer rounded hover:bg-gray-100 dark:hover:bg-slate-700"
          onClick={() => callbacks.onSelect(slotElement)}
          {...hoverHandlers}
        >
          <span className="flex-1 text-sm font-medium">{slotElement.name}</span>
          {slotElement.usedByClasses.length > 0 && (
            <span className={`text-xs px-2 py-0.5 rounded ${color.badgeBg} ${color.badgeText}`}>
              {slotElement.usedByClasses.length}
            </span>
          )}
        </div>
      );
    });
  }
}

// ClassCollection - hierarchical tree of classes
export class ClassCollection extends ElementCollection {
  readonly type = 'class' as const;
  private rootElements: ClassElement[];

  constructor(rootElements: ClassElement[]) {
    super();
    this.rootElements = rootElements;
  }

  /** Factory: Create from raw data (called by dataLoader) */
  static fromData(rootNodes: ClassNode[], slotElements: Map<string, SlotElement>): ClassCollection {
    // Convert ClassNode tree to ClassElement tree
    const elements = rootNodes.map(node => new ClassElement(node, slotElements));
    return new ClassCollection(elements);
  }

  getLabel(): string {
    const metadata = ELEMENT_TYPES[this.type];
    return `${metadata.pluralLabel} (${this.countTotalNodes()})`;
  }

  getSectionIcon(): string {
    return ELEMENT_TYPES[this.type].icon;
  }

  getDefaultExpansion(): Set<string> {
    // Auto-expand first 2 levels (but only classes that have children)
    const expanded = new Set<string>();
    const collectUpToLevel = (elements: ClassElement[], level: number) => {
      if (level >= 2) return;
      elements.forEach(element => {
        // Only track expansion state for classes that have children
        if (element.children.length > 0) {
          expanded.add(element.name);
        }
        collectUpToLevel(element.children, level + 1);
      });
    };
    collectUpToLevel(this.rootElements, 0);
    return expanded;
  }

  getExpansionKey(position: 'left' | 'right'): string | null {
    return position === 'left' ? 'lce' : 'rce'; // left/right class expansion
  }

  getElement(name: string): Element | null {
    // Recursively search tree for class by name
    const searchRecursive = (elements: ClassElement[]): ClassElement | null => {
      for (const element of elements) {
        if (element.name === name) return element;
        const found = searchRecursive(element.children);
        if (found) return found;
      }
      return null;
    };
    return searchRecursive(this.rootElements);
  }

  getAllElements(): Element[] {
    // Flatten tree to array
    const flattenRecursive = (elements: ClassElement[]): ClassElement[] => {
      return elements.flatMap(element => [element, ...flattenRecursive(element.children)]);
    };
    return flattenRecursive(this.rootElements);
  }

  /** Get root nodes of class hierarchy (needed for tests and tree rendering) */
  getRootElements(): ClassElement[] {
    return this.rootElements;
  }

  private countTotalNodes(): number {
    const countRecursive = (elements: ClassElement[]): number => {
      return elements.reduce((sum, element) => sum + 1 + countRecursive(element.children), 0);
    };
    return countRecursive(this.rootElements);
  }

  renderItems(
    callbacks: ElementCollectionCallbacks,
    position: 'left' | 'right',
    expandedItems?: Set<string>,
    toggleExpansion?: (item: string) => void
  ): React.ReactElement[] {
    return this.rootElements.map(element =>
      this.renderClassTreeNode(element, 0, callbacks, position, expandedItems, toggleExpansion)
    );
  }

  private renderClassTreeNode(
    element: ClassElement,
    level: number,
    callbacks: ElementCollectionCallbacks,
    position: 'left' | 'right',
    expandedItems?: Set<string>,
    toggleExpansion?: (item: string) => void
  ): React.ReactElement {
    const hasChildren = element.children.length > 0;
    const isExpanded = expandedItems?.has(element.name) ?? false;
    const hoverHandlers = getElementHoverHandlers({
      type: 'class',
      name: element.name,
      onElementHover: callbacks.onElementHover,
      onElementLeave: callbacks.onElementLeave
    });

    const { color } = ELEMENT_TYPES[this.type];

    return (
      <div key={element.name} className="select-none">
        <div
          id={`class-${element.name}`}
          data-element-type="class"
          data-element-name={element.name}
          data-panel-position={position}
          className="flex items-center gap-2 px-2 py-1 cursor-pointer rounded hover:bg-gray-100 dark:hover:bg-slate-700"
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => callbacks.onSelect(element)}
          {...hoverHandlers}
        >
          {hasChildren && (
            <button
              className="w-4 h-4 flex items-center justify-center text-gray-500 hover:text-gray-700"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpansion?.(element.name);
              }}
            >
              {isExpanded ? '▼' : '▶'}
            </button>
          )}
          {!hasChildren && <span className="w-4" />}
          <span className="flex-1 text-sm font-medium">{element.name}</span>
          {element.abstract && (
            <span className="text-xs text-purple-600 dark:text-purple-400 italic mr-2">
              abstract
            </span>
          )}
          {element.variableCount > 0 && (
            <span className={`text-xs px-2 py-0.5 rounded ${color.badgeBg} ${color.badgeText}`}>
              {element.variableCount}
            </span>
          )}
        </div>
        {hasChildren && isExpanded && (
          <div>
            {element.children.map(child =>
              this.renderClassTreeNode(child, level + 1, callbacks, position, expandedItems, toggleExpansion)
            )}
          </div>
        )}
      </div>
    );
  }
}

// VariableCollection - variables grouped by class
export class VariableCollection extends ElementCollection {
  readonly type = 'variable' as const;
  private variables: VariableElement[];
  private groupedVariables: Map<string, VariableElement[]>;

  constructor(variables: VariableElement[]) {
    super();
    this.variables = variables;

    // Group variables by class
    this.groupedVariables = new Map();
    variables.forEach(variable => {
      const className = variable.bdchmElement;
      if (!this.groupedVariables.has(className)) {
        this.groupedVariables.set(className, []);
      }
      this.groupedVariables.get(className)!.push(variable);
    });

    // Sort variables within each group
    this.groupedVariables.forEach(vars => {
      vars.sort((a, b) => a.name.localeCompare(b.name));
    });
  }

  /** Factory: Create from raw data (called by dataLoader) */
  static fromData(variableData: VariableSpec[]): VariableCollection {
    // Convert VariableSpec DTOs to VariableElement instances
    const elements = variableData.map(spec => new VariableElement(spec));
    return new VariableCollection(elements);
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

  renderItems(
    callbacks: ElementCollectionCallbacks,
    position: 'left' | 'right',
    expandedItems?: Set<string>,
    toggleExpansion?: (item: string) => void
  ): React.ReactElement[] {
    // Sort class names
    const sortedClasses = Array.from(this.groupedVariables.keys()).sort((a, b) => a.localeCompare(b));
    const { color } = ELEMENT_TYPES[this.type];

    return sortedClasses.map(className => {
      const classVariables = this.groupedVariables.get(className)!;
      const isExpanded = expandedItems?.has(className) ?? false;

      return (
        <div key={className} className="mb-2">
          {/* Class header - collapsible */}
          <div
            className="flex items-center gap-2 px-2 py-1 cursor-pointer rounded hover:bg-gray-100 dark:hover:bg-slate-700"
            onClick={() => toggleExpansion?.(className)}
          >
            <span className="text-gray-500 dark:text-gray-400 select-none">
              {isExpanded ? '▼' : '▶'}
            </span>
            <span className="font-medium text-sm text-gray-700 dark:text-gray-300">
              {className}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ({classVariables.length})
            </span>
          </div>

          {/* Variables list - only show when expanded */}
          {isExpanded && (
            <div className="ml-4 mt-1">
              {classVariables.map((variable, idx) => {
                const hoverHandlers = getElementHoverHandlers({
                  type: 'variable',
                  name: variable.name,
                  onElementHover: callbacks.onElementHover,
                  onElementLeave: callbacks.onElementLeave
                });

                return (
                  <div
                    key={`${variable.bdchmElement}-${variable.name}-${idx}`}
                    id={`variable-${variable.name}`}
                    data-element-type="variable"
                    data-element-name={variable.name}
                    data-panel-position={position}
                    className="px-2 py-1 cursor-pointer rounded hover:bg-gray-100 dark:hover:bg-slate-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      callbacks.onSelect(variable);
                    }}
                    {...hoverHandlers}
                  >
                    <span className="text-sm truncate block">
                      {variable.name}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    });
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
