// Utilities for loading and parsing schema and variable specs

// DTOs from import_types
import type {
  VariableSpecDTO,
  SchemaDTO,
  ClassDTO,
  SlotDTO,
  EnumDTO,
  TypeDTO,
  TypesSchemaDTO,
} from '../import_types';
import { FIELD_MAPPINGS } from '../import_types';

// Transformed types from SchemaTypes
import type {
  VariableSpec,
  SchemaData,
  ClassData,
  SlotData,
  EnumData,
  TypeData,
  FieldMapping,
} from '../models/SchemaTypes';

// Core application data structure
import type { ModelData } from '../models/ModelData';
import { initializeModelData } from '../models/Element';

/**
 * Load bdchm.processed.json which includes:
 * - All classes, enums, slots, types from bdchm.yaml (via gen-linkml + transform_schema.py)
 * - Computed inherited_from fields for all inherited attributes
 * - Slot instances for slot_usage overrides (e.g., "category-SdohObservation")
 * - Streamlined structure optimized for our app
 *
 * To regenerate: python3 scripts/download_source_data.py --metadata-only
 */
async function loadProcessedSchemaDTO(): Promise<SchemaDTO & TypesSchemaDTO> {
  const response = await fetch(`${import.meta.env.BASE_URL}source_data/HM/bdchm.processed.json`);
  if (!response.ok) {
    throw new Error(`Failed to load processed schema: ${response.statusText}`);
  }
  const parsed = await response.json() as SchemaDTO & TypesSchemaDTO;
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
const EXPECTED_SLOT_FIELDS = ['range', 'description', 'slot_uri', 'identifier', 'required', 'multivalued', 'from_schema'];
const EXPECTED_ENUM_FIELDS = ['description', 'permissible_values', 'from_schema'];
const EXPECTED_TYPE_FIELDS = ['uri', 'base', 'repr', 'description', 'notes', 'exact_mappings', 'close_mappings', 'broad_mappings', 'conforms_to', 'comments', 'name', 'from_schema'];
const EXPECTED_CLASS_FIELDS = ['name', 'description', 'is_a', 'abstract', 'attributes', 'slots', 'slot_usage', 'from_schema'];
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
 * Normalizes is_a (LinkML native field name) to parent
 */
function transformClassDTO(dto: ClassDTO): ClassData {
  validateDTO(dto, EXPECTED_CLASS_FIELDS, 'ClassDTO');
  const transformed = transformWithMapping<ClassData>(dto, FIELD_MAPPINGS.class);

  // Normalize is_a → parent
  if (dto.is_a) {
    transformed.parent = dto.is_a;
  }

  // Set defaults for optional fields
  transformed.abstract = transformed.abstract ?? false;
  transformed.attributes = transformed.attributes ?? {};

  return transformed;
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
 * NOTE: We load bdchm.processed.json which includes:
 * - All classes, enums, slots, types (from gen-linkml + transform_schema.py)
 * - Computed inherited_from fields for inherited attributes
 * - Slot instances for slot_usage overrides
 * - Streamlined structure optimized for our app
 * This eliminates the need to compute inheritance or handle slot_usage at runtime.
 */
export async function loadRawData(): Promise<SchemaData> {
  // Load processed schema (includes computed metadata)
  const processedSchemaDTO = await loadProcessedSchemaDTO();
  const variableSpecDTOs = await loadVariableSpecDTOs();

  // Transform DTOs to Data types (snake_case → camelCase, field renames)
  const classes: ClassData[] = Object.values(processedSchemaDTO.classes).map(transformClassDTO);

  const enums = new Map<string, EnumData>();
  Object.entries(processedSchemaDTO.enums || {}).forEach(([name, dto]) => {
    enums.set(name, transformEnumDTO(dto));
  });

  // Collect all slot definitions
  // Part 1: Global slots from top-level slots section
  const slots = new Map<string, SlotData>();
  Object.entries(processedSchemaDTO.slots || {}).forEach(([name, dto]) => {
      slots.set(name, transformSlotDTO(dto));
  });

  // Part 2: Inline slot definitions from class attributes
  // Collect unique inline slots defined across all classes
  // (Override slots like "category-SdohObservation" are already in Part 1)
  Object.values(processedSchemaDTO.classes).forEach((classDTO) => {
    Object.entries(classDTO.attributes || {}).forEach(([_attrName, attrDef]) => {
      const slotId = attrDef.slotId;
      // Skip if already collected (including override slots from Part 1)
      if (!slots.has(slotId) && attrDef.inline) {
        // Transform attribute to SlotData
        const slotData: SlotData = {
          range: attrDef.range,
          description: attrDef.description,
          required: attrDef.required,
          multivalued: attrDef.multivalued
        };
        slots.set(slotId, slotData);
      }
    });
  });

  // Types from linkml:types (included via gen-linkml + transform_schema.py pipeline)
  const types = new Map<string, TypeData>();
  Object.entries(processedSchemaDTO.types || {}).forEach(([name, dto]) => {
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
