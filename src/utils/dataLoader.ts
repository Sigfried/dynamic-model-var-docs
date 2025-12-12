// Utilities for loading and parsing schema and variable specs

// Input types from input_types (processed JSON shapes)
import type {
  VariableSpecInput,
  ProcessedSchemaInput,
  ClassInput,
  SlotInput,
  EnumInput,
  TypeInput,
} from '../input_types';
import { FIELD_MAPPINGS } from '../input_types';

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
 * - Slots consolidated: global, inline, and override slots all in slots section
 * - Class.slots contains references only (data lives in slots section)
 * - Computed inherited_from in slot references
 *
 * To regenerate: python3 scripts/download_source_data.py --metadata-only
 */
async function loadProcessedSchema(): Promise<ProcessedSchemaInput> {
  const response = await fetch(`${import.meta.env.BASE_URL}source_data/HM/bdchm.processed.json`);
  if (!response.ok) {
    throw new Error(`Failed to load processed schema: ${response.statusText}`);
  }
  const parsed = await response.json() as ProcessedSchemaInput;
  return parsed;
}

async function loadVariableSpecs(): Promise<VariableSpecInput[]> {
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
      maps_to: values[0] || '',
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
 * Collects unexpected fields to report once at end of loading.
 */
function validateDTO(
  dto: object,
  expectedKeys: string[],
  typeName: string
): void {
  const actualKeys = Object.keys(dto);
  const expectedSet = new Set(expectedKeys);
  const unexpected = actualKeys.filter(k => !expectedSet.has(k));

  // Collect unexpected fields (will be reported once at end)
  const collector = unexpectedFieldsCollector[typeName];
  if (collector) {
    unexpected.forEach(field => collector.add(field));
  }
}

/**
 * Report all collected unexpected fields (call once after loading)
 */
function reportUnexpectedFields(): void {
  let hasWarnings = false;
  for (const [typeName, fields] of Object.entries(unexpectedFieldsCollector)) {
    if (fields.size > 0) {
      if (!hasWarnings) {
        console.warn('Unexpected fields in processed JSON (not yet used in UI):');
        hasWarnings = true;
      }
      console.warn(`  ${typeName}: ${Array.from(fields).sort().join(', ')}`);
    }
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

// Expected fields for each type - fields we handle OR intentionally ignore
// Unexpected fields trigger warnings until we incorporate or explicitly ignore them
const EXPECTED_SLOT_FIELDS = [
  // Used in UI
  'id', 'name', 'range', 'description', 'slot_uri', 'slot_url', 'identifier', 'required', 'multivalued',
  // Used internally
  'global', 'overrides',
  // Ignored: alias=name, from_schema=constant, designates_type=rare, domain_of=redundant, owner=arbitrary
  'alias', 'from_schema', 'designates_type', 'domain_of', 'owner',
  // TODO: implement display for these
  'comments', 'examples', 'inlined', 'inlined_as_list', 'unit',
];
const EXPECTED_ENUM_FIELDS = [
  'id', 'name', 'description', 'permissible_values',
  // TODO: implement display for these
  'comments', 'inherits', 'include', 'parent', 'reachable_from', 'see_also',
];
const EXPECTED_TYPE_FIELDS = [
  'id', 'name', 'uri', 'uri_url', 'base', 'description', 'exact_mappings', 'close_mappings', 'broad_mappings',
  'exact_mappings_urls',  // transformed from exact_mappings CURIEs
];
const EXPECTED_CLASS_FIELDS = [
  'id', 'name', 'description', 'parent', 'abstract', 'slots',
  'class_url',  // transformed from class_uri
];
const EXPECTED_VARIABLE_FIELDS = ['maps_to', 'variableLabel', 'dataType', 'ucumUnit', 'curie', 'variableDescription'];

// Collect unexpected fields during loading, report once at end
const unexpectedFieldsCollector: Record<string, Set<string>> = {
  SlotInput: new Set(),
  EnumInput: new Set(),
  TypeInput: new Set(),
  ClassInput: new Set(),
  VariableSpecInput: new Set(),
};

/**
 * Transform SlotInput to SlotData
 * All slots (global, inline, override) consolidated in slots section
 */
function transformSlot(input: SlotInput): SlotData {
  validateDTO(input, EXPECTED_SLOT_FIELDS, 'SlotInput');

  return {
    id: input.id,
    name: input.name,
    range: input.range,
    description: input.description,
    slotUri: input.slot_uri,
    slotUrl: input.slot_url,
    identifier: input.identifier,
    required: input.required,
    multivalued: input.multivalued,
    global: input.global,
    overrides: input.overrides,
    comments: input.comments,
    examples: input.examples,
    inlined: input.inlined,
    inlinedAsList: input.inlined_as_list,
  };
}

/**
 * Transform EnumInput to EnumData
 */
function transformEnum(input: EnumInput): EnumData {
  validateDTO(input, EXPECTED_ENUM_FIELDS, 'EnumInput');
  const base = transformWithMapping<EnumData>(input, FIELD_MAPPINGS.enum);

  // Transform nested reachable_from object
  if (input.reachable_from) {
    base.reachableFrom = {
      sourceOntology: input.reachable_from.source_ontology,
      sourceNodes: input.reachable_from.source_nodes,
      sourceNodesUrls: input.reachable_from.source_nodes_urls,
      includeSelf: input.reachable_from.include_self,
      relationshipTypes: input.reachable_from.relationship_types,
      isDirectOnly: input.reachable_from.is_direct,
    };
  }

  return base;
}

/**
 * Transform TypeInput to TypeData
 * Normalizes notes field (array → string) and applies field mappings
 */
function transformType(input: TypeInput): TypeData {
  validateDTO(input, EXPECTED_TYPE_FIELDS, 'TypeInput');
  const transformed = transformWithMapping<TypeData>(input, FIELD_MAPPINGS.type);

  // Normalize notes: if array, join with newlines; if string, keep as-is
  if (transformed.notes && Array.isArray(transformed.notes)) {
    transformed.notes = (transformed.notes as string[]).join('\n');
  }

  return transformed;
}

/**
 * Transform ClassInput to ClassData
 * Classes have slots array (references only, data in slots section)
 */
function transformClass(input: ClassInput): ClassData {
  validateDTO(input, EXPECTED_CLASS_FIELDS, 'ClassInput');

  return {
    id: input.id,
    name: input.name,
    description: input.description,
    parent: input.parent,
    abstract: input.abstract ?? false,
    slots: input.slots.map(slotRef => ({
      id: slotRef.id,
      inheritedFrom: slotRef.inherited_from
    }))
  };
}

/**
 * Transform VariableSpecInput to VariableSpec
 */
function transformVariable(input: VariableSpecInput): VariableSpec {
  validateDTO(input, EXPECTED_VARIABLE_FIELDS, 'VariableSpecInput');
  return transformWithMapping<VariableSpec>(input, FIELD_MAPPINGS.variable);
}

/**
 * Load and transform raw data from files
 * Returns Input types transformed to Data types
 */
export async function loadRawData(): Promise<SchemaData> {
  const processedSchema = await loadProcessedSchema();
  const variableInputs = await loadVariableSpecs();

  const classes: ClassData[] = Object.values(processedSchema.classes).map(transformClass);

  const enums = new Map<string, EnumData>();
  Object.entries(processedSchema.enums || {}).forEach(([name, input]) => {
    enums.set(name, transformEnum(input));
  });

  const slots = new Map<string, SlotData>();
  Object.entries(processedSchema.slots || {}).forEach(([name, input]) => {
    slots.set(name, transformSlot(input));
  });

  const types = new Map<string, TypeData>();
  Object.entries(processedSchema.types || {}).forEach(([name, input]) => {
    types.set(name, transformType(input));
  });

  const variables: VariableSpec[] = variableInputs.map(transformVariable);

  reportUnexpectedFields();

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
