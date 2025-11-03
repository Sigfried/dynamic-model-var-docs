// Utilities for loading and parsing schema and variable specs

import type {
  VariableSpec,
  ModelData,
  SchemaMetadata,
  ClassMetadata,
  SlotMetadata,
  EnumMetadata
} from '../types';
import { EnumCollection, SlotCollection, ClassCollection, VariableCollection, initializeElementNameMap } from '../models/Element';

async function loadSchemaMetadata(): Promise<SchemaMetadata> {
  const response = await fetch(`${import.meta.env.BASE_URL}source_data/HM/bdchm.metadata.json`);
  if (!response.ok) {
    throw new Error(`Failed to load schema metadata: ${response.statusText}`);
  }
  return await response.json();
}

export async function loadVariableSpecs(): Promise<VariableSpec[]> {
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
 * Load and normalize class metadata from schema.
 * Returns flat array - tree building happens in ClassCollection.fromData()
 */
function loadClasses(metadata: SchemaMetadata): ClassMetadata[] {
  return Object.values(metadata.classes);
}

/**
 * Load enum metadata from schema.
 * Returns Map for easy lookup - EnumCollection handles transformation.
 */
function loadEnums(metadata: SchemaMetadata): Map<string, EnumMetadata> {
  const enums = new Map<string, EnumMetadata>();
  Object.entries(metadata.enums || {}).forEach(([name, enumDef]) => {
    enums.set(name, enumDef);
  });
  return enums;
}

/**
 * Load slot metadata from schema.
 * Returns Map for easy lookup - SlotCollection handles transformation.
 */
function loadSlots(metadata: SchemaMetadata): Map<string, SlotMetadata> {
  const slots = new Map<string, SlotMetadata>();
  Object.entries(metadata.slots || {}).forEach(([name, slotDef]) => {
    slots.set(name, slotDef);
  });
  return slots;
}

export async function loadModelData(): Promise<ModelData> {
  const metadata = await loadSchemaMetadata();
  const variables = await loadVariableSpecs();

  // Load metadata (no tree building - just type-checking and simple transformations)
  const classMetadata = loadClasses(metadata);
  const enumMetadata = loadEnums(metadata);
  const slotMetadata = loadSlots(metadata);

  // Create collections in proper order (see Phase 4.2 - orchestration)
  // Order matters due to dependencies:
  // 1. EnumCollection (no dependencies)
  // 2. SlotCollection (no dependencies)
  // 3. ClassCollection (needs slot names for validation)
  // 4. VariableCollection (needs classCollection)

  const enumCollection = EnumCollection.fromData(enumMetadata);
  const slotCollection = SlotCollection.fromData(slotMetadata);
  const classCollection = ClassCollection.fromData(classMetadata, slotCollection);
  const variableCollection = VariableCollection.fromData(variables, classCollection);

  const collections = new Map();
  collections.set('class', classCollection);
  collections.set('enum', enumCollection);
  collections.set('slot', slotCollection);
  collections.set('variable', variableCollection);

  // Flatten all elements into name→element lookup map
  const elementLookup = new Map<string, Element>();
  collections.forEach(collection => {
    collection.getAllElements().forEach(element => {
      elementLookup.set(element.name, element);
    });
  });

  // Initialize element name lookup map for accurate type categorization
  const classNames = classCollection.getAllElements().map(c => c.name);
  const enumNames = Array.from(enumMetadata.keys());
  const slotNames = Array.from(slotMetadata.keys());
  initializeElementNameMap(classNames, enumNames, slotNames);

  return {
    collections,
    elementLookup
  };
}
