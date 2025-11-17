// Utilities for loading and parsing schema and variable specs

import type {
  VariableSpec,
  VariableSpecDTO,
  ModelData,
  SchemaDTO,
  SchemaData,
  ClassDTO,
  ClassData,
  SlotDTO,
  SlotData,
  EnumDTO,
  EnumData,
  TypeDTO,
  TypeData,
  TypesSchemaDTO,
  FieldMapping
} from '../types';
import { FIELD_MAPPINGS } from '../types';
import { initializeModelData } from '../models/Element';

// Load yaml parse library
import yaml from 'js-yaml';

/**
 * Load bdchm.expanded.yaml which includes:
 * - All classes, enums, slots from bdchm.yaml
 * - All types from linkml:types (resolved via gen-linkml --expand-imports)
 * - Inherited slots filled in
 *
 * To regenerate: cd public/source_data/HM && gen-linkml --output bdchm.expanded.yaml --format yaml --expand-imports bdchm.yaml
 */
async function loadExpandedSchemaDTO(): Promise<SchemaDTO & TypesSchemaDTO> {
  const response = await fetch(`${import.meta.env.BASE_URL}source_data/HM/bdchm.expanded.yaml`);
  if (!response.ok) {
    throw new Error(`Failed to load expanded schema: ${response.statusText}`);
  }
  const text = await response.text();
  const parsed = yaml.load(text) as SchemaDTO & TypesSchemaDTO;
  return parsed;
}

async function loadVariableSpecDTOs(): Promise<VariableSpecDTO[]> {
  const response = await fetch(`${import.meta.env.BASE_URL}source_data/HV/variable-specs-S1.tsv`);
  if (!response.ok) {
    throw new Error(`Failed to load variable specs: ${response.statusText}`);
  }

  const text = await response.text();
  const lines = text.trim().split('\n');
  // Skip header row
  return lines.slice(1).map(line => {
    const values = line.split('\t');
    return {
      maps_to: values[0] || '',  // Renamed from bdchmElement for clarity
      variableLabel: values[1] || '',
      dataType: values[2] || '',
      ucumUnit: values[3] || '',
      curie: values[4] || '',
      variableDescription: values[5] || ''
    };
  });
}

/**
 * Validates that a DTO only contains expected fields.
 * Logs warnings for any unexpected fields that might indicate schema changes.
 */
function validateDTO(
  dto: object,
  expectedKeys: string[],
  typeName: string
): void {
  const actualKeys = Object.keys(dto);
  const expectedSet = new Set(expectedKeys);
  const unexpected = actualKeys.filter(k => !expectedSet.has(k));

  if (unexpected.length > 0) {
    console.warn(
      `Unexpected fields in ${typeName}: ${unexpected.join(', ')}`,
      '\nThis may indicate schema changes or data issues.',
      '\nDTO:', dto
    );
  }
}

/**
 * Generic transformation function that applies field mappings.
 * Maps DTO fields to Data fields using the provided mapping spec.
 * Fields not in mapping are copied as-is.
 */
function transformWithMapping<T>(
  dto: object,
  mapping: FieldMapping
): T {
  const result: Record<string, unknown> = {};

  // Process all DTO fields
  for (const [dtoField, value] of Object.entries(dto)) {
    const dataField = mapping[dtoField] ?? dtoField;  // Use mapped name or original
    result[dataField] = value;
  }

  return result as T;
}

// Expected fields for each DTO type (for validation)
const EXPECTED_SLOT_FIELDS = ['range', 'description', 'slot_uri', 'identifier', 'required', 'multivalued'];
const EXPECTED_ENUM_FIELDS = ['description', 'permissible_values'];
const EXPECTED_TYPE_FIELDS = ['uri', 'base', 'repr', 'description', 'notes', 'exact_mappings', 'close_mappings', 'broad_mappings', 'conforms_to', 'comments'];
const EXPECTED_CLASS_FIELDS = ['name', 'description', 'parent', 'abstract', 'attributes', 'slots', 'slot_usage'];
const EXPECTED_VARIABLE_FIELDS = ['maps_to', 'variableLabel', 'dataType', 'ucumUnit', 'curie', 'variableDescription'];

/**
 * Transform SlotDTO (snake_case from JSON) to SlotData (camelCase for constructors)
 */
function transformSlotDTO(dto: SlotDTO): SlotData {
  validateDTO(dto, EXPECTED_SLOT_FIELDS, 'SlotDTO');
  return transformWithMapping<SlotData>(dto, FIELD_MAPPINGS.slot);
}

/**
 * Transform EnumDTO to EnumData
 */
function transformEnumDTO(dto: EnumDTO): EnumData {
  validateDTO(dto, EXPECTED_ENUM_FIELDS, 'EnumDTO');
  return transformWithMapping<EnumData>(dto, FIELD_MAPPINGS.enum);
}

/**
 * Transform TypeDTO to TypeData
 * Normalizes notes field (array → string) and applies field mappings
 */
function transformTypeDTO(dto: TypeDTO): TypeData {
  validateDTO(dto, EXPECTED_TYPE_FIELDS, 'TypeDTO');
  const transformed = transformWithMapping<TypeData>(dto, FIELD_MAPPINGS.type);

  // Normalize notes: if array, join with newlines; if string, keep as-is
  if (transformed.notes && Array.isArray(transformed.notes)) {
    transformed.notes = (transformed.notes as string[]).join('\n');
  }

  return transformed;
}

/**
 * Transform ClassDTO to ClassData
 */
function transformClassDTO(dto: ClassDTO): ClassData {
  validateDTO(dto, EXPECTED_CLASS_FIELDS, 'ClassDTO');
  return transformWithMapping<ClassData>(dto, FIELD_MAPPINGS.class);
}

/**
 * Transform VariableSpecDTO to VariableSpec
 */
function transformVariableSpecDTO(dto: VariableSpecDTO): VariableSpec {
  validateDTO(dto, EXPECTED_VARIABLE_FIELDS, 'VariableSpecDTO');
  return transformWithMapping<VariableSpec>(dto, FIELD_MAPPINGS.variable);
}

/**
 * Load and transform raw data from files
 * Returns DTOs transformed to Data types with proper field naming
 *
 * NOTE: We load bdchm.expanded.yaml which includes:
 * - All classes, enums, slots from bdchm.yaml
 * - All types from linkml:types (resolved via gen-linkml import expansion)
 * - Inherited slots filled in (via gen-linkml)
 * This eliminates the need to fetch types.yaml separately or implement inheritance logic.
 */
export async function loadRawData(): Promise<SchemaData> {
  // Load expanded schema (includes types from linkml:types via imports)
  const expandedSchemaDTO = await loadExpandedSchemaDTO();
  const variableSpecDTOs = await loadVariableSpecDTOs();

  // Transform DTOs to Data types (snake_case → camelCase, field renames)
  const classes: ClassData[] = Object.values(expandedSchemaDTO.classes).map(transformClassDTO);

  const enums = new Map<string, EnumData>();
  Object.entries(expandedSchemaDTO.enums || {}).forEach(([name, dto]) => {
    enums.set(name, transformEnumDTO(dto));
  });

  const slots = new Map<string, SlotData>();
  Object.entries(expandedSchemaDTO.slots || {}).forEach(([name, dto]) => {
    slots.set(name, transformSlotDTO(dto));
  });

  // Types from linkml:types (included via import expansion in bdchm.expanded.yaml)
  const types = new Map<string, TypeData>();
  Object.entries(expandedSchemaDTO.types || {}).forEach(([name, dto]) => {
    types.set(name, transformTypeDTO(dto));
  });

  const variables: VariableSpec[] = variableSpecDTOs.map(transformVariableSpecDTO);

  return { classes, enums, slots, types, variables };
}

/**
 * Load and initialize complete ModelData.
 * Orchestrates loading raw data, transforming it, and creating Element collections.
 */
export async function loadModelData(): Promise<ModelData> {
  const schemaData = await loadRawData();
  return initializeModelData(schemaData);
}
