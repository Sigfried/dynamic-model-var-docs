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
  [key: string]: unknown; // Allow other LinkML fields
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
  [key: string]: unknown; // Allow other LinkML fields
}

/**
 * Raw enum definition from metadata JSON (LinkML schema)
 */
export interface EnumMetadata {
  description?: string;
  permissible_values?: Record<string, {
    description?: string;
    meaning?: string;
    [key: string]: unknown;
  }>;
  [key: string]: unknown; // Allow other LinkML fields
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
// DEPRECATED - Old interfaces (will be removed after refactor)
// These mix DTO shape with model logic - being replaced by Element classes
// ============================================================================
//
// NOTE: Generic tree structure (TreeNode<T>, Tree<T>) is in models/Tree.ts

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
 * @deprecated Use Element classes instead
 */
export interface EnumDefinition {
  name: string;
  description?: string;
  permissible_values: EnumValue[];
  usedByClasses: string[]; // Classes that reference this enum
}

/**
 * @deprecated Use Element classes instead
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
 * Union type representing any selectable element in the UI
 * Used for element selection, navigation, and detail display
 */
export type SelectedElement = ClassNode | EnumDefinition | SlotDefinition | VariableSpec;

/**
 * Model data structure - all element data is accessed via collections
 */
export interface ModelData {
  // Generic collections - keyed by ElementTypeId
  // Use collection.getElement(name) and collection.getAllElements() for lookups
  collections: Map<import('./models/ElementRegistry').ElementTypeId, import('./models/Element').ElementCollection>;
  elementLookup: Map<string, Element>
}
