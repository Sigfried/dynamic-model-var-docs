// Element-based architecture for generic rendering and relationship tracking
// See CLAUDE.md and temp.md for architecture details

import * as React from 'react';
import type { ClassNode, EnumDefinition, SlotDefinition, VariableSpec } from '../types';

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
