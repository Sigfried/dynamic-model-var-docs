// Core type definitions for the LinkML model and variable specs

import type { Element } from './models/Element';

// ============================================================================
// DTOs - Raw data shapes from external sources (snake_case from JSON/files)
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
 * snake_case fields from JSON
 */
export interface SlotDTO {
  range?: string;
  description?: string;
  slot_uri?: string;
  identifier?: boolean;
  required?: boolean;
  multivalued?: boolean;
}

/**
 * Raw enum definition from metadata JSON (LinkML schema)
 * snake_case fields from JSON
 */
export interface EnumDTO {
  description?: string;
  permissible_values?: Record<string, {
    description?: string;
    meaning?: string;
  }>;
}

/**
 * Raw class definition from metadata JSON (LinkML schema)
 * snake_case fields from JSON
 */
export interface ClassDTO {
  name: string;
  description: string;
  parent?: string;
  abstract: boolean;
  attributes: Record<string, AttributeDefinition>;
  slots?: string | string[]; // Can be string or array in raw metadata
  slot_usage?: Record<string, AttributeDefinition>; // Refinements/constraints on slots
}

/**
 * Complete schema from bdchm.metadata.json
 */
export interface SchemaDTO {
  classes: Record<string, ClassDTO>;
  slots: Record<string, SlotDTO>;
  enums: Record<string, EnumDTO>;
}

// ============================================================================
// Data - Parsed/validated data for Element constructors (camelCase, transformed)
// ============================================================================

/**
 * Slot data for SlotElement constructor
 * Transformed from SlotDTO with camelCase
 */
export interface SlotData {
  range?: string;
  description?: string;
  slotUri?: string;  // transformed from slot_uri
  identifier?: boolean;
  required?: boolean;
  multivalued?: boolean;
}

/**
 * Enum data for EnumElement constructor
 * Transformed from EnumDTO
 */
export interface EnumData {
  description?: string;
  permissibleValues?: Record<string, {  // transformed from permissible_values
    description?: string;
    meaning?: string;
  }>;
}

/**
 * Class data for ClassElement constructor
 * Transformed from ClassDTO with camelCase
 */
export interface ClassData {
  name: string;
  description: string;
  parent?: string;
  abstract: boolean;
  attributes: Record<string, AttributeDefinition>;
  slots?: string | string[];
  slotUsage?: Record<string, AttributeDefinition>;  // transformed from slot_usage
}

/**
 * Variable specification row from TSV file (raw DTO)
 */
export interface VariableSpecDTO {
  bdchmElement: string;  // snake_case from TSV
  variableLabel: string;
  dataType: string;
  ucumUnit: string;
  curie: string;
  variableDescription: string;
}

/**
 * Variable specification data for VariableElement constructor (transformed)
 */
export interface VariableSpec {
  classId: string;  // transformed from bdchmElement
  variableLabel: string;
  dataType: string;
  ucumUnit: string;
  curie: string;
  variableDescription: string;
}

/**
 * Complete transformed schema data ready for Element constructors
 */
export interface SchemaData {
  classes: ClassData[];
  enums: Map<string, EnumData>;
  slots: Map<string, SlotData>;
  variables: VariableSpec[];
}

// ============================================================================
// Field Mapping Specifications - DTO → Data transformations
// ============================================================================

/**
 * Field mapping specification for transforming DTOs to Data types.
 * Maps DTO field names (keys) to Data field names (values).
 * If value is undefined, the field is copied as-is.
 */
export interface FieldMapping {
  [dtoField: string]: string | undefined;
}

/**
 * Field mappings for each type transformation.
 * Used by dataLoader to transform DTOs to Data types.
 */
export const FIELD_MAPPINGS = {
  slot: {
    slot_uri: 'slotUri',
    // All other fields (range, description, identifier, required, multivalued) copy as-is
  } as FieldMapping,

  enum: {
    permissible_values: 'permissibleValues',
    // description copies as-is
  } as FieldMapping,

  class: {
    slot_usage: 'slotUsage',
    // name, description, parent, abstract, attributes, slots copy as-is
  } as FieldMapping,

  variable: {
    bdchmElement: 'classId',
    // variableLabel, dataType, ucumUnit, curie, variableDescription copy as-is
  } as FieldMapping,
} as const;

/**
 * Enum value (used in processing enum metadata)
 */
export interface EnumValue {
  key: string;
  description?: string;
}

// ============================================================================
// DEPRECATED - Old DTOs (only used internally in dataLoader and legacy components)
// ============================================================================
//
// ClassDTO, EnumDTO, SlotDTO: Still used internally in dataLoader.ts
// as intermediate structures when loading from JSON/TSV files. These are immediately
// converted to Element instances via Collection.fromData().
//
// NOTE: These DTOs are restricted to dataLoader.ts by ESLint rule.
// Legacy usage in components should be migrated to use Element classes.
//
// DO NOT use these types in new code. Use Element and its subclasses instead.
//
// NOTE: Generic tree structure (TreeNode<T>, Tree<T>) is in models/Tree.ts

/**
 * @deprecated Internal use only in dataLoader.ts
 */
export interface ClassDTO {
  name: string;
  description?: string;
  parent?: string;
  children: ClassDTO[];
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
export interface EnumDTO {
  name: string;
  description?: string;
  permissible_values: EnumValue[];
  usedByClasses: string[]; // Classes that reference this enum
}

/**
 * @deprecated Internal use only in dataLoader.ts
 */
export interface SlotDTO {
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
