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
 * Raw type definition from types.yaml (LinkML types)
 * snake_case fields from YAML
 */
export interface TypeDTO {
  uri: string;  // RDF datatype (e.g., xsd:string)
  base: string;  // Python base type (e.g., str, int)
  repr?: string;  // Representational form if different from base
  description?: string;
  notes?: string | string[];  // Can be string or array
  exact_mappings?: string[];
  close_mappings?: string[];
  broad_mappings?: string[];
  conforms_to?: string;  // URL to specification
}

/**
 * Raw class definition from LinkML expanded schema (gen-linkml output)
 * snake_case fields from YAML
 */
export interface ClassDTO {
  name: string;
  description: string;
  is_a?: string;  // Parent class (LinkML field name)
  abstract?: boolean;
  attributes?: Record<string, AttributeDefinition>;
  slots?: string | string[];
  slot_usage?: Record<string, AttributeDefinition>;
  from_schema?: string;  // Added by gen-linkml
}

/**
 * Complete schema from bdchm.metadata.json
 */
export interface SchemaDTO {
  classes: Record<string, ClassDTO>;
  slots: Record<string, SlotDTO>;
  enums: Record<string, EnumDTO>;
}

/**
 * Types schema from types.yaml (LinkML)
 */
export interface TypesSchemaDTO {
  types: Record<string, TypeDTO>;
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
 * Type data for TypeElement constructor
 * Transformed from TypeDTO with camelCase
 */
export interface TypeData {
  uri: string;
  base: string;
  repr?: string;
  description?: string;
  notes?: string;  // Normalized to string (join array if needed)
  exactMappings?: string[];  // transformed from exact_mappings
  closeMappings?: string[];  // transformed from close_mappings
  broadMappings?: string[];  // transformed from broad_mappings
  conformsTo?: string;  // transformed from conforms_to
}

/**
 * Class data for ClassElement constructor
 * Transformed from ClassDTO with camelCase
 */
export interface ClassData {
  name: string;
  description: string;
  parent?: string;  // Normalized from is_a (expanded YAML) or parent (metadata.json)
  abstract: boolean;
  attributes: Record<string, AttributeDefinition>;
  slots?: string | string[];
  slotUsage?: Record<string, AttributeDefinition>;  // transformed from slot_usage
}

/**
 * Variable specification row from TSV file (raw DTO)
 */
export interface VariableSpecDTO {
  maps_to: string;  // Class ID that this variable maps to (renamed from bdchmElement for clarity)
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
  maps_to: string;  // Class ID that this variable maps to (no transformation needed - same as DTO)
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
  types: Map<string, TypeData>;  // NEW: LinkML types from types.yaml
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

  type: {
    exact_mappings: 'exactMappings',
    close_mappings: 'closeMappings',
    broad_mappings: 'broadMappings',
    conforms_to: 'conformsTo',
    // uri, base, repr, description, notes copy as-is
  } as FieldMapping,

  class: {
    slot_usage: 'slotUsage',
    // name, description, parent, abstract, attributes, slots copy as-is
  } as FieldMapping,

  variable: {
    // All fields copy as-is (maps_to, variableLabel, dataType, ucumUnit, curie, variableDescription)
    // No transformation needed - maps_to is clearer than the old bdchmElement
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
// DEPRECATED - Old DTOs (removed - were duplicate definitions causing type conflicts)
// ============================================================================
//
// The deprecated ClassDTO, EnumDTO, SlotDTO definitions have been removed.
// They were duplicate definitions with incompatible types that caused 10 TypeScript errors.
// dataLoader.ts uses the current DTOs defined at the top of this file (lines 23-56).
//
// NOTE: Generic tree structure (TreeNode<T>, Tree<T>) is in models/Tree.ts

/**
 * Type alias for selected elements in the UI
 * Now just an alias to Element - all element instances are Element subclasses
 *
 * @deprecated Use Element directly from models/Element
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
