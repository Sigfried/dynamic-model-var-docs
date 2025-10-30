// Utilities for loading and parsing schema and variable specs

import type {
  VariableSpec,
  ClassNode,
  EnumDefinition,
  EnumValue,
  SlotDefinition,
  ModelData,
  // DTOs from external sources
  SchemaMetadata,
  ClassMetadata,
  SlotMetadata,
  EnumMetadata,
  AttributeDefinition
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

export function buildClassHierarchy(
  schema: Map<string, ClassMetadata>,
  variables: VariableSpec[]
): ClassNode[] {
  // Group variables by class
  const variablesByClass = new Map<string, VariableSpec[]>();
  variables.forEach(variable => {
    const className = variable.bdchmElement;
    if (!variablesByClass.has(className)) {
      variablesByClass.set(className, []);
    }
    variablesByClass.get(className)!.push(variable);
  });

  // Build flat list of all classes
  const classMap = new Map<string, ClassNode>();

  schema.forEach((classMetadata) => {
    const vars = variablesByClass.get(classMetadata.name) || [];

    // Normalize slots to array if present
    const normalizedSlots = classMetadata.slots
      ? (Array.isArray(classMetadata.slots) ? classMetadata.slots : [classMetadata.slots])
      : undefined;

    classMap.set(classMetadata.name, {
      name: classMetadata.name,
      description: classMetadata.description,
      parent: classMetadata.parent,
      children: [],
      variableCount: vars.length,
      variables: vars,
      properties: classMetadata.attributes,
      isEnum: false,
      enumReferences: undefined, // Could extract from attributes if needed
      requiredProperties: undefined,
      slots: normalizedSlots,
      slot_usage: classMetadata.slot_usage,
      abstract: classMetadata.abstract
    });
  });

  // Build tree structure by linking parents and children
  const roots: ClassNode[] = [];

  classMap.forEach((node) => {
    if (node.parent && classMap.has(node.parent)) {
      const parent = classMap.get(node.parent)!;
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  });

  // Sort children by name
  const sortChildren = (node: ClassNode) => {
    node.children.sort((a, b) => a.name.localeCompare(b.name));
    node.children.forEach(sortChildren);
  };
  roots.forEach(sortChildren);

  return roots;
}

function loadEnums(metadata: SchemaMetadata): Map<string, EnumDefinition> {
  const enums = new Map<string, EnumDefinition>();

  Object.entries(metadata.enums || {}).forEach(([name, enumDef]) => {
    const permissible_values: EnumValue[] = [];

    if (enumDef.permissible_values) {
      Object.entries(enumDef.permissible_values).forEach(([key, valueDef]) => {
        permissible_values.push({
          key,
          description: valueDef?.description
        });
      });
    }

    enums.set(name, {
      name,
      description: enumDef.description,
      permissible_values,
      usedByClasses: [] // Will be populated by reverse index
    });
  });

  return enums;
}

function loadSlots(metadata: SchemaMetadata): Map<string, SlotDefinition> {
  const slots = new Map<string, SlotDefinition>();

  Object.entries(metadata.slots || {}).forEach(([name, slotDef]) => {
    slots.set(name, {
      name,
      description: slotDef.description,
      range: slotDef.range,
      slot_uri: slotDef.slot_uri,
      identifier: slotDef.identifier,
      required: slotDef.required,
      multivalued: slotDef.multivalued,
      usedByClasses: [] // Will be populated by reverse index
    });
  });

  return slots;
}

// todo: check that nothing in this function is needed and then delete it
function buildReverseIndices(
  schema: Map<string, ClassMetadata>,
  enums: Map<string, EnumDefinition>,
  slots: Map<string, SlotDefinition>
): ReverseIndices {
  const enumToClasses = new Map<string, Set<string>>();
  const slotToClasses = new Map<string, Set<string>>();
  const classToClasses = new Map<string, Set<string>>();

  // Initialize sets for all enums and slots
  enums.forEach((_, enumName) => {
    enumToClasses.set(enumName, new Set());
  });

  slots.forEach((_, slotName) => {
    slotToClasses.set(slotName, new Set());
  });

  // Scan through all class attributes to build indices
  schema.forEach((classDef, className) => {
    // Check attributes for enum and class references
    if (classDef.attributes) {
      Object.entries(classDef.attributes).forEach(([, attrDef]) => {
        const range = attrDef.range;

        if (range) {
          // Check if it's an enum
          if (enums.has(range)) {
            if (!enumToClasses.has(range)) {
              enumToClasses.set(range, new Set());
            }
            enumToClasses.get(range)!.add(className);
          }
          // Check if it's a class (but not a primitive type)
          else if (schema.has(range)) {
            if (!classToClasses.has(range)) {
              classToClasses.set(range, new Set());
            }
            classToClasses.get(range)!.add(className);
          }
        }
      });
    }

    // Check slots usage
    if (classDef.slots && Array.isArray(classDef.slots)) {
      classDef.slots.forEach((slotName: string) => {
        if (!slotToClasses.has(slotName)) {
          slotToClasses.set(slotName, new Set());
        }
        slotToClasses.get(slotName)!.add(className);
      });
    }
  });

  // Update enum and slot definitions with their usage
  enumToClasses.forEach((classes, enumName) => {
    const enumDef = enums.get(enumName);
    if (enumDef) {
      enumDef.usedByClasses = Array.from(classes).sort();
    }
  });

  slotToClasses.forEach((classes, slotName) => {
    const slotDef = slots.get(slotName);
    if (slotDef) {
      slotDef.usedByClasses = Array.from(classes).sort();
    }
  });

  return {
    enumToClasses,
    slotToClasses,
    classToClasses
  };
}

export async function loadModelData(): Promise<ModelData> {
  const metadata = await loadSchemaMetadata();
  const variables = await loadVariableSpecs();

  const schema = new Map<string, ClassMetadata>();
  Object.entries(metadata.classes).forEach(([name, classDef]) => {
    // Normalize slots: convert string to array
    if (classDef.slots && typeof classDef.slots === 'string') {
      classDef.slots = [classDef.slots];
    }
    schema.set(name, classDef);
  });

  const enums = loadEnums(metadata);
  const slots = loadSlots(metadata);
  const classHierarchy = buildClassHierarchy(schema, variables);

  // Create element collections as a Map for generic iteration
  const enumCollection = EnumCollection.fromData(enums);
  const slotCollection = SlotCollection.fromData(slots);
  // ClassCollection needs SlotElement map, not SlotDefinition map
  const slotElements = slotCollection.getSlots();
  const classCollection = ClassCollection.fromData(classHierarchy, slotElements);
  // VariableCollection needs classCollection to build tree with ClassElement headers
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
  const enumNames = Array.from(enums.keys());
  const slotNames = Array.from(slots.keys());
  initializeElementNameMap(classNames, enumNames, slotNames);

  return {
    collections,
    elementLookup,
  };
}
