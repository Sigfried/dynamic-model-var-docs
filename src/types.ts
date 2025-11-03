// Core type definitions for the LinkML model and variable specs

import type { Element } from './models/Element';

// ============================================================================
// DTOs - Raw data shapes from external sources (files, APIs)
// ============================================================================

/**
 * Raw attribute definition from metadata JSON (LinkML schema)
 */
export interface AttributeDefinition {
  range: string;
  description?: string;
  required?: boolean;
  multivalued?: boolean;
}

/**
 * Raw slot definition from metadata JSON (LinkML schema)
 */
export interface SlotMetadata {
  range?: string;
  description?: string;
  slot_uri?: string;
  identifier?: boolean;
  required?: boolean;
  multivalued?: boolean;
}

/**
 * Raw enum definition from metadata JSON (LinkML schema)
 */
export interface EnumMetadata {
  description?: string;
  permissible_values?: Record<string, {
    description?: string;
    meaning?: string;
  }>;
}

/**
 * Raw class definition from metadata JSON (LinkML schema)
 */
export interface ClassMetadata {
  name: string;
  description: string;
  parent?: string;
  abstract: boolean;
  attributes: Record<string, AttributeDefinition>;
  slots?: string | string[]; // Can be string or array in raw metadata
  slot_usage?: Record<string, AttributeDefinition>; // Refinements/constraints on slots
}

/**
 * Complete schema metadata from bdchm.metadata.json
 */
export interface SchemaMetadata {
  classes: Record<string, ClassMetadata>;
  slots: Record<string, SlotMetadata>;
  enums: Record<string, EnumMetadata>;
}

/**
 * Variable specification row from TSV file
 */
export interface VariableSpec {
  bdchmElement: string;
  variableLabel: string;
  dataType: string;
  ucumUnit: string;
  curie: string;
  variableDescription: string;
}

/**
 * Enum value (used in processing enum metadata)
 */
export interface EnumValue {
  key: string;
  description?: string;
}

// ============================================================================
// DEPRECATED - Old interfaces (only used internally in dataLoader and legacy components)
// ============================================================================
//
// ClassNode, EnumDefinition, SlotDefinition: Still used internally in dataLoader.ts
// as intermediate structures when loading from JSON/TSV files. These are immediately
// converted to Element instances via Collection.fromData().
//
// NOTE: These interfaces are only used in:
// - utils/dataLoader.ts (internal data loading logic)
// - components/DetailPanel.tsx (broken, needs refactor to use Element.renderDetails())
// - components/LinkOverlay.tsx (constructs Element instances from old types)
//
// DO NOT use these types in new code. Use Element and its subclasses instead.
//
// NOTE: Generic tree structure (TreeNode<T>, Tree<T>) is in models/Tree.ts

/**
 * @deprecated Internal use only in dataLoader.ts
 */
export interface ClassNode {
  name: string;
  description?: string;
  parent?: string;
  children: ClassNode[];
  variableCount: number;
  variables: VariableSpec[];
  properties?: Record<string, any>;
  isEnum: boolean;
  enumReferences?: string[]; // List of enum names this class references
  requiredProperties?: string[]; // List of required property names
  slots?: string[]; // Top-level slots referenced by this class
  slot_usage?: Record<string, any>; // Refinements/constraints on inherited or referenced slots
  abstract?: boolean; // Whether this class is abstract
}

/**
 * @deprecated Internal use only in dataLoader.ts
 */
export interface EnumDefinition {
  name: string;
  description?: string;
  permissible_values: EnumValue[];
  usedByClasses: string[]; // Classes that reference this enum
}

/**
 * @deprecated Internal use only in dataLoader.ts
 */
export interface SlotDefinition {
  name: string;
  description?: string;
  range?: string;
  slot_uri?: string;
  identifier?: boolean;
  required?: boolean;
  multivalued?: boolean;
  usedByClasses: string[]; // Classes that use this slot
}

/**
 * Type alias for selected elements in the UI
 * Now just an alias to Element - all element instances are Element subclasses
 *
 * @deprecated Use Element directly from models/Element.tsx
 */
export type SelectedElement = Element;

/**
 * Model data structure - all element data is accessed via collections
 */
export interface ModelData {
  // Generic collections - keyed by ElementTypeId
  // Use collection.getElement(name) and collection.getAllElements() for lookups
  collections: Map<import('./models/ElementRegistry').ElementTypeId, import('./models/Element').ElementCollection>;
  elementLookup: Map<string, Element>
}
