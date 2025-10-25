// Element-based architecture for generic rendering and relationship tracking
// See CLAUDE.md and temp.md for architecture details

import * as React from 'react';
import type { ClassNode, EnumDefinition, SlotDefinition, VariableSpec } from '../types';
import { getElementHoverHandlers } from '../hooks/useElementHover';

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
  type: 'inherits' | 'property' | 'uses_enum' | 'references_class';
  label?: string;           // Property name (for property relationships)
  target: string;           // Target element name
  targetType: 'class' | 'enum' | 'slot' | 'variable';
  isSelfRef?: boolean;      // True if target === this.name
}

// Base abstract class for all entity types
export abstract class Element {
  abstract readonly type: 'class' | 'enum' | 'slot' | 'variable';
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

// Helper to categorize range types
function categorizeRange(range: string): 'class' | 'enum' | 'primitive' {
  const primitives = ['string', 'integer', 'float', 'double', 'decimal', 'boolean', 'date', 'datetime', 'time', 'uri', 'uriorcurie'];

  if (primitives.includes(range.toLowerCase())) {
    return 'primitive';
  }
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
  onSelect: (data: ElementData, type: 'class' | 'enum' | 'slot' | 'variable') => void;
  onElementHover?: (element: { type: 'class' | 'enum' | 'slot' | 'variable'; name: string }) => void;
  onElementLeave?: () => void;
}

export abstract class ElementCollection {
  abstract readonly type: 'class' | 'enum' | 'slot' | 'variable';

  /** Get human-readable label with count (e.g., "Enumerations (40)") */
  abstract getLabel(): string;

  /** Get section icon for toggle (C, E, S, or V) */
  abstract getSectionIcon(): string;

  /** Get default expansion state (set of expanded item names) */
  abstract getDefaultExpansion(): Set<string>;

  /** Get expansion state key for URL persistence (null if no expansion needed) */
  abstract getExpansionKey(position: 'left' | 'right'): string | null;

  /** Render items for the panel section */
  abstract renderItems(
    callbacks: ElementCollectionCallbacks,
    position: 'left' | 'right',
    selectedElement?: { type: string; name: string }
  ): React.ReactElement[];
}

// EnumCollection - flat list of enumerations
export class EnumCollection extends ElementCollection {
  readonly type = 'enum' as const;
  private enums: Map<string, EnumDefinition>;

  constructor(enums: Map<string, EnumDefinition>) {
    super();
    this.enums = enums;
  }

  /** Factory: Create from raw data (called by dataLoader) */
  static fromData(enums: Map<string, EnumDefinition>): EnumCollection {
    return new EnumCollection(enums);
  }

  getLabel(): string {
    return `Enumerations (${this.enums.size})`;
  }

  getSectionIcon(): string {
    return 'E';
  }

  getDefaultExpansion(): Set<string> {
    return new Set(); // No expansion for flat list
  }

  getExpansionKey(_position: 'left' | 'right'): string | null {
    return null; // No expansion state needed
  }

  renderItems(
    callbacks: ElementCollectionCallbacks,
    position: 'left' | 'right',
    selectedElement?: { type: string; name: string }
  ): React.ReactElement[] {
    // Sort enums by name
    const enumList = Array.from(this.enums.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    return enumList.map((enumDef) => {
      const isSelected = selectedElement?.type === 'enum' && selectedElement?.name === enumDef.name;
      const hoverHandlers = getElementHoverHandlers({
        type: 'enum',
        name: enumDef.name,
        onElementHover: callbacks.onElementHover,
        onElementLeave: callbacks.onElementLeave
      });

      return (
        <div
          key={enumDef.name}
          id={`enum-${enumDef.name}`}
          data-element-type="enum"
          data-element-name={enumDef.name}
          data-panel-position={position}
          className={`flex items-center gap-2 px-2 py-1 cursor-pointer rounded hover:bg-gray-100 dark:hover:bg-slate-700 ${
            isSelected ? 'bg-purple-100 dark:bg-purple-900' : ''
          }`}
          onClick={() => callbacks.onSelect(enumDef, 'enum')}
          {...hoverHandlers}
        >
          <span className="flex-1 text-sm font-medium">{enumDef.name}</span>
          <span className="text-xs px-2 py-0.5 rounded bg-purple-200 dark:bg-purple-800 text-purple-700 dark:text-purple-300">
            {enumDef.permissible_values.length}
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
    return `Slots (${this.slots.size})`;
  }

  getSectionIcon(): string {
    return 'S';
  }

  getDefaultExpansion(): Set<string> {
    return new Set(); // No expansion for flat list
  }

  getExpansionKey(_position: 'left' | 'right'): string | null {
    return null; // No expansion state needed
  }

  renderItems(
    callbacks: ElementCollectionCallbacks,
    position: 'left' | 'right',
    selectedElement?: { type: string; name: string }
  ): React.ReactElement[] {
    // Sort slots by name
    const slotList = Array.from(this.slots.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );

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
            isSelected ? 'bg-green-100 dark:bg-green-900' : ''
          }`}
          onClick={() => callbacks.onSelect(slotDef, 'slot')}
          {...hoverHandlers}
        >
          <span className="flex-1 text-sm font-medium">{slotDef.name}</span>
          {slotDef.usedByClasses.length > 0 && (
            <span className="text-xs px-2 py-0.5 rounded bg-green-200 dark:bg-green-800 text-green-700 dark:text-green-300">
              {slotDef.usedByClasses.length}
            </span>
          )}
        </div>
      );
    });
  }
}

// Factory function to create Element instances
export function createElement(
  data: ElementData,
  source: 'class' | 'enum' | 'slot' | 'variable',
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
