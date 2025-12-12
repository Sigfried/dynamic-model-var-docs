// Input type definitions - Data shapes from processed JSON (transform_schema.py output)
// CRITICAL: This file should ONLY be imported by dataLoader.ts
// All other files should import from models/SchemaTypes.ts or models/ModelData.ts

// ============================================================================
// Input Types - Shapes from bdchm.processed.json (snake_case from JSON)
// ============================================================================

/**
 * Slot reference in ClassInput.slots array
 * Minimal reference to a slot definition (data lives in slots section)
 */
export interface SlotReferenceInput {
  id: string;              // ID of the slot definition (e.g., "id" or "category-SdohObservation")
  inherited_from?: string; // Which ancestor class originally defined this slot
}

/**
 * Slot definition from processed JSON
 * All slot data consolidated in one place
 *
 * Types:
 * - Global slot: has global: true (defined in schema's slots section)
 * - Inline slot: neither global nor overrides (defined on class attributes)
 * - Override slot: has overrides field (class-specific override via slot_usage)
 */
export interface SlotInput {
  id: string;
  name: string;              // Display name (same as id for base slots, base name for overrides)
  range?: string;
  description?: string;
  slot_uri?: string;         // CURIE (e.g., "schema:identifier")
  slot_url?: string;         // Full URL (e.g., "http://schema.org/identifier")
  identifier?: boolean;
  required?: boolean;
  multivalued?: boolean;
  global?: boolean;          // true = defined in schema's global slots section
  overrides?: string;        // For override slots: ID of base slot being overridden
}

/**
 * Enum definition from processed JSON
 */
export interface EnumInput {
  id?: string;
  name?: string;
  description?: string;
  permissible_values?: Record<string, {
    description?: string;
    meaning?: string;
  }>;
}

/**
 * Type definition from processed JSON (LinkML types)
 */
export interface TypeInput {
  id?: string;
  name?: string;
  uri: string;      // CURIE (e.g., "xsd:string")
  uri_url?: string; // Full URL (e.g., "http://www.w3.org/2001/XMLSchema#string")
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
 * Class definition from processed JSON (transform_schema.py output)
 */
export interface ClassInput {
  id: string;
  name: string;
  description?: string;
  parent?: string;        // Parent class name
  abstract?: boolean;
  slots: SlotReferenceInput[];  // Array of slot references (data lives in slots section)
}

/**
 * Variable specification row from TSV file
 */
export interface VariableSpecInput {
  maps_to: string;  // Class ID that this variable maps to
  variableLabel: string;
  dataType: string;
  ucumUnit: string;
  curie: string;
  variableDescription: string;
}

/**
 * Complete schema from bdchm.processed.json
 */
export interface ProcessedSchemaInput {
  classes: Record<string, ClassInput>;
  slots: Record<string, SlotInput>;
  enums: Record<string, EnumInput>;
  types: Record<string, TypeInput>;
}

// ============================================================================
// Field Mapping Specifications - Input → Data transformations
// ============================================================================

// Import FieldMapping type from SchemaTypes
import type { FieldMapping } from './models/SchemaTypes';

/**
 * Field mappings for each type transformation.
 * Used by dataLoader to transform Input types to Data types.
 */
export const FIELD_MAPPINGS = {
  slot: {
    slot_uri: 'slotUri',
    slot_url: 'slotUrl',
    // id, name, range, description, identifier, required, multivalued, global, overrides copy as-is
  } as FieldMapping,

  enum: {
    permissible_values: 'permissibleValues',
    // description copies as-is
  } as FieldMapping,

  type: {
    uri_url: 'uriUrl',
    exact_mappings: 'exactMappings',
    close_mappings: 'closeMappings',
    broad_mappings: 'broadMappings',
    conforms_to: 'conformsTo',
    // uri, base, repr, description, notes copy as-is
  } as FieldMapping,

  class: {
    // id, name, description, parent, abstract, slots all copy as-is
  } as FieldMapping,

  variable: {
    // All fields copy as-is (maps_to, variableLabel, dataType, ucumUnit, curie, variableDescription)
  } as FieldMapping,
} as const;

// ============================================================================
// NOTE: Transformed types have been moved to models/SchemaTypes.ts
// NOTE: ModelData has been moved to models/ModelData.ts
// This file should ONLY contain input types and be imported ONLY by dataLoader.ts
// ============================================================================
