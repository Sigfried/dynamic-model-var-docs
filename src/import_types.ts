// DTO type definitions - Raw data shapes from external sources (JSON/YAML files)
// CRITICAL: This file should ONLY be imported by dataLoader.ts
// All other files should import from models/SchemaTypes.ts or models/ModelData.ts

// ============================================================================
// DTOs - Raw data shapes from external sources (snake_case from JSON/files)
// ============================================================================

/**
 * Slot definition from metadata JSON (LinkML schema)
 * Enhanced by transform_schema.py with computed fields
 * Used in ClassDTO.attributes
 *
 * Note: All class properties are slots. The distinction is:
 * - inline slots: defined directly on a class (inline: true)
 * - referenced slots: reference a global slot definition (inline: false)
 */
export interface SlotDefinition {
  slotId: string;           // ID of the slot definition (computed by transform_schema.py)
  range: string;
  description?: string;
  required?: boolean;
  multivalued?: boolean;
  inherited_from?: string;  // Which ancestor class defined this slot (computed by transform_schema.py)
  inline: boolean;          // true = defined inline on class, false = references global slot (computed by transform_schema.py)
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
  attributes?: Record<string, SlotDefinition>;
  slots?: string | string[];
  slot_usage?: Record<string, SlotDefinition>;
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

// ============================================================================
// Field Mapping Specifications - DTO → Data transformations
// ============================================================================

// Import FieldMapping type from SchemaTypes
import type { FieldMapping } from './models/SchemaTypes';

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

// ============================================================================
// NOTE: Transformed types have been moved to models/SchemaTypes.ts
// NOTE: ModelData has been moved to models/ModelData.ts
// This file should ONLY contain DTOs and be imported ONLY by dataLoader.ts
// ============================================================================
