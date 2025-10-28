// Element-based architecture for generic rendering and relationship tracking
// See CLAUDE.md and temp.md for architecture details

import * as React from 'react';
import type { ClassNode, EnumDefinition, SlotDefinition, VariableSpec } from '../types';
import { getElementHoverHandlers } from '../hooks/useElementHover';
import type { ElementTypeId, RelationshipTypeId } from './ElementRegistry';
import { ELEMENT_TYPES } from './ElementRegistry';

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
  private data: ClassNode;
  private slotDefinitions: Map<string, SlotDefinition>;

  constructor(data: ClassNode, slotDefinitions: Map<string, SlotDefinition>) {
    super();
    this.data = data;
    this.slotDefinitions = slotDefinitions;
  }

  get name() { return this.data.name; }
  get description() { return this.data.description; }

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
          onClick={() => onSelect(this.data, 'class')}
        >
          <span>{this.name}</span>
          {this.data.variableCount > 0 && (
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
              ({this.data.variableCount})
            </span>
          )}
          {this.data.abstract && (
            <span className="text-xs text-purple-600 dark:text-purple-400 ml-2 italic">
              abstract
            </span>
          )}
        </div>

        {/* Recursively render children */}
        {this.data.children.map(childData =>
          new ClassElement(childData, this.slotDefinitions).renderPanelSection(depth + 1, onSelect)
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
            {this.data.abstract && (
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
    if (this.data.parent) {
      rels.push({
        type: 'inherits',
        target: this.data.parent,
        targetType: 'class',
        isSelfRef: false
      });
    }

    // Properties with non-primitive ranges
    if (this.data.properties) {
      Object.entries(this.data.properties).forEach(([propName, propDef]) => {
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
}

// EnumElement - represents an enumeration
export class EnumElement extends Element {
  readonly type = 'enum' as const;
  private data: EnumDefinition;

  constructor(data: EnumDefinition) {
    super();
    this.data = data;
  }

  get name() { return this.data.name; }
  get description() { return this.data.description; }
  get permissibleValues() { return this.data.permissible_values; }
  /** @deprecated Temporary accessor for legacy code - use element properties directly */
  get rawData() { return this.data; }

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
        onClick={() => onSelect(this.data, 'enum')}
      >
        {this.name}
        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
          ({this.data.permissible_values.length})
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
}

// SlotElement - represents a top-level slot definition
export class SlotElement extends Element {
  readonly type = 'slot' as const;
  private data: SlotDefinition;

  constructor(data: SlotDefinition) {
    super();
    this.data = data;
  }

  get name() { return this.data.name; }
  get description() { return this.data.description; }

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
        onClick={() => onSelect(this.data, 'slot')}
      >
        {this.name}
        {this.data.range && (
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
            : {this.data.range}
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
          {this.data.range && (
            <div>
              <span className="font-semibold">Range: </span>
              <span>{this.data.range}</span>
            </div>
          )}
          {this.data.required !== undefined && (
            <div>
              <span className="font-semibold">Required: </span>
              <span>{this.data.required ? 'Yes' : 'No'}</span>
            </div>
          )}
          {this.data.multivalued !== undefined && (
            <div>
              <span className="font-semibold">Multivalued: </span>
              <span>{this.data.multivalued ? 'Yes' : 'No'}</span>
            </div>
          )}
        </div>

        {/* Used by classes */}
        {this.data.usedByClasses && this.data.usedByClasses.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-2">
              Used By Classes ({this.data.usedByClasses.length})
            </h2>
            <ul className="list-disc list-inside space-y-1">
              {this.data.usedByClasses.map(className => (
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
    if (this.data.range) {
      const rangeCategory = categorizeRange(this.data.range);
      if (rangeCategory !== 'primitive') {
        rels.push({
          type: 'property',
          target: this.data.range,
          targetType: rangeCategory,
          isSelfRef: false
        });
      }
    }

    return rels;
  }
}

// VariableElement - represents a variable specification
export class VariableElement extends Element {
  readonly type = 'variable' as const;
  private data: VariableSpec;

  constructor(data: VariableSpec) {
    super();
    this.data = data;
  }

  get name() { return this.data.variableLabel; }
  get description() { return this.data.variableDescription; }

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
        onClick={() => onSelect(this.data, 'variable')}
      >
        <span>{this.name}</span>
        {this.data.dataType && (
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
            ({this.data.dataType})
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
              onClick={() => onNavigate(this.data.bdchmElement, 'class')}
            >
              {this.data.bdchmElement}
            </button>
          </div>
          {this.data.dataType && (
            <div>
              <span className="font-semibold">Data Type: </span>
              <span>{this.data.dataType}</span>
            </div>
          )}
          {this.data.ucumUnit && (
            <div>
              <span className="font-semibold">Unit: </span>
              <span>{this.data.ucumUnit}</span>
            </div>
          )}
          {this.data.curie && (
            <div>
              <span className="font-semibold">CURIE: </span>
              <span className="font-mono text-sm">{this.data.curie}</span>
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
      target: this.data.bdchmElement,
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

  /** Render items for the panel section */
  abstract renderItems(
    callbacks: ElementCollectionCallbacks,
    position: 'left' | 'right',
    selectedElement?: { type: string; name: string },
    expandedItems?: Set<string>,
    toggleExpansion?: (item: string) => void
  ): React.ReactElement[];
}

// EnumCollection - flat list of enumerations
export class EnumCollection extends ElementCollection {
  readonly type = 'enum' as const;
  private enums: Map<string, EnumElement>;

  constructor(enums: Map<string, EnumElement>) {
    super();
    this.enums = enums;
  }

  /** Factory: Create from raw data (called by dataLoader) */
  static fromData(enumData: Map<string, EnumDefinition>): EnumCollection {
    // Wrap raw EnumDefinitions into EnumElements
    const elements = new Map<string, EnumElement>();
    enumData.forEach((def, name) => {
      elements.set(name, new EnumElement(def));
    });
    return new EnumCollection(elements);
  }

  getLabel(): string {
    const metadata = ELEMENT_TYPES[this.type];
    return `${metadata.pluralLabel} (${this.enums.size})`;
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
    return this.enums.get(name) || null;
  }

  getAllElements(): Element[] {
    return Array.from(this.enums.values());
  }

  renderItems(
    callbacks: ElementCollectionCallbacks,
    position: 'left' | 'right',
    selectedElement?: { type: string; name: string },
    _expandedItems?: Set<string>,
    _toggleExpansion?: (item: string) => void
  ): React.ReactElement[] {
    // Sort enums by name
    const enumList = Array.from(this.enums.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    const { color } = ELEMENT_TYPES[this.type];

    return enumList.map((enumElement) => {
      const isSelected = selectedElement?.type === 'enum' && selectedElement?.name === enumElement.name;
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
          className={`flex items-center gap-2 px-2 py-1 cursor-pointer rounded hover:bg-gray-100 dark:hover:bg-slate-700 ${
            isSelected ? color.selectionBg : ''
          }`}
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
  private slots: Map<string, SlotDefinition>;

  constructor(slots: Map<string, SlotDefinition>) {
    super();
    this.slots = slots;
  }

  /** Factory: Create from raw data (called by dataLoader) */
  static fromData(slots: Map<string, SlotDefinition>): SlotCollection {
    return new SlotCollection(slots);
  }

  getLabel(): string {
    const metadata = ELEMENT_TYPES[this.type];
    return `${metadata.pluralLabel} (${this.slots.size})`;
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

  getElement(name: string): ElementData | null {
    return this.slots.get(name) || null;
  }

  getAllElements(): ElementData[] {
    return Array.from(this.slots.values());
  }

  /** Get underlying slots Map (needed for ClassElement constructor) */
  getSlots(): Map<string, SlotDefinition> {
    return this.slots;
  }

  renderItems(
    callbacks: ElementCollectionCallbacks,
    position: 'left' | 'right',
    selectedElement?: { type: string; name: string },
    _expandedItems?: Set<string>,
    _toggleExpansion?: (item: string) => void
  ): React.ReactElement[] {
    // Sort slots by name
    const slotList = Array.from(this.slots.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    const { color } = ELEMENT_TYPES[this.type];

    return slotList.map((slotDef) => {
      const isSelected = selectedElement?.type === 'slot' && selectedElement?.name === slotDef.name;
      const hoverHandlers = getElementHoverHandlers({
        type: 'slot',
        name: slotDef.name,
        onElementHover: callbacks.onElementHover,
        onElementLeave: callbacks.onElementLeave
      });

      return (
        <div
          key={slotDef.name}
          id={`slot-${slotDef.name}`}
          data-element-type="slot"
          data-element-name={slotDef.name}
          data-panel-position={position}
          className={`flex items-center gap-2 px-2 py-1 cursor-pointer rounded hover:bg-gray-100 dark:hover:bg-slate-700 ${
            isSelected ? color.selectionBg : ''
          }`}
          onClick={() => callbacks.onSelect(slotDef, 'slot')}
          {...hoverHandlers}
        >
          <span className="flex-1 text-sm font-medium">{slotDef.name}</span>
          {slotDef.usedByClasses.length > 0 && (
            <span className={`text-xs px-2 py-0.5 rounded ${color.badgeBg} ${color.badgeText}`}>
              {slotDef.usedByClasses.length}
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
  private rootNodes: ClassNode[];

  constructor(rootNodes: ClassNode[]) {
    super();
    this.rootNodes = rootNodes;
  }

  /** Factory: Create from raw data (called by dataLoader) */
  static fromData(rootNodes: ClassNode[], _slotDefinitions: Map<string, SlotDefinition>): ClassCollection {
    return new ClassCollection(rootNodes);
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
    const collectUpToLevel = (nodes: ClassNode[], level: number) => {
      if (level >= 2) return;
      nodes.forEach(node => {
        // Only track expansion state for classes that have children
        if (node.children.length > 0) {
          expanded.add(node.name);
        }
        collectUpToLevel(node.children, level + 1);
      });
    };
    collectUpToLevel(this.rootNodes, 0);
    return expanded;
  }

  getExpansionKey(position: 'left' | 'right'): string | null {
    return position === 'left' ? 'lce' : 'rce'; // left/right class expansion
  }

  getElement(name: string): ElementData | null {
    // Recursively search tree for class by name
    const searchRecursive = (nodes: ClassNode[]): ClassNode | null => {
      for (const node of nodes) {
        if (node.name === name) return node;
        const found = searchRecursive(node.children);
        if (found) return found;
      }
      return null;
    };
    return searchRecursive(this.rootNodes);
  }

  getAllElements(): ElementData[] {
    // Flatten tree to array
    const flattenRecursive = (nodes: ClassNode[]): ClassNode[] => {
      return nodes.flatMap(node => [node, ...flattenRecursive(node.children)]);
    };
    return flattenRecursive(this.rootNodes);
  }

  /** Get root nodes of class hierarchy (needed for tests and tree rendering) */
  getRootNodes(): ClassNode[] {
    return this.rootNodes;
  }

  private countTotalNodes(): number {
    const countRecursive = (nodes: ClassNode[]): number => {
      return nodes.reduce((sum, node) => sum + 1 + countRecursive(node.children), 0);
    };
    return countRecursive(this.rootNodes);
  }

  renderItems(
    callbacks: ElementCollectionCallbacks,
    position: 'left' | 'right',
    selectedElement?: { type: string; name: string },
    expandedItems?: Set<string>,
    toggleExpansion?: (item: string) => void
  ): React.ReactElement[] {
    return this.rootNodes.map(node =>
      this.renderClassTreeNode(node, 0, callbacks, position, selectedElement, expandedItems, toggleExpansion)
    );
  }

  private renderClassTreeNode(
    node: ClassNode,
    level: number,
    callbacks: ElementCollectionCallbacks,
    position: 'left' | 'right',
    selectedElement?: { type: string; name: string },
    expandedItems?: Set<string>,
    toggleExpansion?: (item: string) => void
  ): React.ReactElement {
    const hasChildren = node.children.length > 0;
    const isExpanded = expandedItems?.has(node.name) ?? false;
    const isSelected = selectedElement?.type === 'class' && selectedElement?.name === node.name;
    const hoverHandlers = getElementHoverHandlers({
      type: 'class',
      name: node.name,
      onElementHover: callbacks.onElementHover,
      onElementLeave: callbacks.onElementLeave
    });

    const { color } = ELEMENT_TYPES[this.type];

    return (
      <div key={node.name} className="select-none">
        <div
          id={`class-${node.name}`}
          data-element-type="class"
          data-element-name={node.name}
          data-panel-position={position}
          className={`flex items-center gap-2 px-2 py-1 cursor-pointer rounded hover:bg-gray-100 dark:hover:bg-slate-700 ${
            isSelected ? color.selectionBg : ''
          }`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => callbacks.onSelect(node, 'class')}
          {...hoverHandlers}
        >
          {hasChildren && (
            <button
              className="w-4 h-4 flex items-center justify-center text-gray-500 hover:text-gray-700"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpansion?.(node.name);
              }}
            >
              {isExpanded ? '▼' : '▶'}
            </button>
          )}
          {!hasChildren && <span className="w-4" />}
          <span className="flex-1 text-sm font-medium">{node.name}</span>
          {node.abstract && (
            <span className="text-xs text-purple-600 dark:text-purple-400 italic mr-2">
              abstract
            </span>
          )}
          {node.variableCount > 0 && (
            <span className={`text-xs px-2 py-0.5 rounded ${color.badgeBg} ${color.badgeText}`}>
              {node.variableCount}
            </span>
          )}
        </div>
        {hasChildren && isExpanded && (
          <div>
            {node.children.map(child =>
              this.renderClassTreeNode(child, level + 1, callbacks, position, selectedElement, expandedItems, toggleExpansion)
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
  private variables: VariableSpec[];
  private groupedVariables: Map<string, VariableSpec[]>;

  constructor(variables: VariableSpec[]) {
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
      vars.sort((a, b) => a.variableLabel.localeCompare(b.variableLabel));
    });
  }

  /** Factory: Create from raw data (called by dataLoader) */
  static fromData(variables: VariableSpec[]): VariableCollection {
    return new VariableCollection(variables);
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

  getElement(name: string): ElementData | null {
    // Variables use variableLabel as identifier
    return this.variables.find(v => v.variableLabel === name) || null;
  }

  getAllElements(): ElementData[] {
    return this.variables;
  }

  renderItems(
    callbacks: ElementCollectionCallbacks,
    position: 'left' | 'right',
    selectedElement?: { type: string; name: string },
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
                const isSelected = selectedElement?.type === 'variable'
                  && selectedElement?.name === variable.variableLabel;
                const hoverHandlers = getElementHoverHandlers({
                  type: 'variable',
                  name: variable.variableLabel,
                  onElementHover: callbacks.onElementHover,
                  onElementLeave: callbacks.onElementLeave
                });

                return (
                  <div
                    key={`${variable.bdchmElement}-${variable.variableLabel}-${idx}`}
                    id={`variable-${variable.variableLabel}`}
                    data-element-type="variable"
                    data-element-name={variable.variableLabel}
                    data-panel-position={position}
                    className={`px-2 py-1 cursor-pointer rounded hover:bg-gray-100 dark:hover:bg-slate-700 ${
                      isSelected ? color.selectionBg : ''
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      callbacks.onSelect(variable, 'variable');
                    }}
                    {...hoverHandlers}
                  >
                    <span className="text-sm truncate block">
                      {variable.variableLabel}
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
