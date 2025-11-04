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
  FieldMapping
} from '../types';
import { FIELD_MAPPINGS } from '../types';
import { initializeModelData } from '../models/Element';

async function loadSchemaDTO(): Promise<SchemaDTO> {
  const response = await fetch(`${import.meta.env.BASE_URL}source_data/HM/bdchm.metadata.json`);
  if (!response.ok) {
    throw new Error(`Failed to load schema metadata: ${response.statusText}`);
  }
  return await response.json();
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
      bdchmElement: values[0] || '',
      variableLabel: values[1] || '',
      dataType: values[2] || '',
      ucumUnit: values[3] || '',
      curie: values[4] || '',
      variableDescription: values[5] || ''
    };
  });
}

/**
 * Generic transformation function that applies field mappings.
 * Maps DTO fields to Data fields using the provided mapping spec.
 * Fields not in mapping are copied as-is.
 */
function transformWithMapping<T extends Record<string, unknown>>(
  dto: Record<string, unknown>,
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

/**
 * Transform SlotDTO (snake_case from JSON) to SlotData (camelCase for constructors)
 */
function transformSlotDTO(dto: SlotDTO): SlotData {
  return transformWithMapping<SlotData>(dto, FIELD_MAPPINGS.slot);
}

/**
 * Transform EnumDTO to EnumData
 */
function transformEnumDTO(dto: EnumDTO): EnumData {
  return transformWithMapping<EnumData>(dto, FIELD_MAPPINGS.enum);
}

/**
 * Transform ClassDTO to ClassData
 */
function transformClassDTO(dto: ClassDTO): ClassData {
  return transformWithMapping<ClassData>(dto, FIELD_MAPPINGS.class);
}

/**
 * Transform VariableSpecDTO to VariableSpec
 */
function transformVariableSpecDTO(dto: VariableSpecDTO): VariableSpec {
  return transformWithMapping<VariableSpec>(dto, FIELD_MAPPINGS.variable);
}

/**
 * Load and transform raw data from files
 * Returns DTOs transformed to Data types with proper field naming
 */
export async function loadRawData(): Promise<SchemaData> {
  const schemaDTO = await loadSchemaDTO();
  const variableSpecDTOs = await loadVariableSpecDTOs();

  // Transform DTOs to Data types (snake_case → camelCase, field renames)
  const classes: ClassData[] = Object.values(schemaDTO.classes).map(transformClassDTO);

  const enums = new Map<string, EnumData>();
  Object.entries(schemaDTO.enums || {}).forEach(([name, dto]) => {
    enums.set(name, transformEnumDTO(dto));
  });

  const slots = new Map<string, SlotData>();
  Object.entries(schemaDTO.slots || {}).forEach(([name, dto]) => {
    slots.set(name, transformSlotDTO(dto));
  });

  const variables: VariableSpec[] = variableSpecDTOs.map(transformVariableSpecDTO);

  return { classes, enums, slots, variables };
}

/**
 * Load and initialize complete ModelData.
 * Orchestrates loading raw data, transforming it, and creating Element collections.
 */
export async function loadModelData(): Promise<ModelData> {
  const schemaData = await loadRawData();
  return initializeModelData(schemaData);
}
