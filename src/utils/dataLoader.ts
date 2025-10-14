// Utilities for loading and parsing schema and variable specs

import type { LinkMLSchema, VariableSpec, ClassNode } from '../types';

export async function loadSchema(): Promise<LinkMLSchema> {
  const response = await fetch('/source_data/HM/bdchm.schema.json');
  if (!response.ok) {
    throw new Error(`Failed to load schema: ${response.statusText}`);
  }
  return response.json();
}

export async function loadVariableSpecs(): Promise<VariableSpec[]> {
  const response = await fetch('/source_data/HV/variable-specs-S1.tsv');
  if (!response.ok) {
    throw new Error(`Failed to load variable specs: ${response.statusText}`);
  }

  const text = await response.text();
  const lines = text.trim().split('\n');
  const headers = lines[0].split('\t');

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

function isClass(def: any): boolean {
  return def.type === 'object' && def.properties !== undefined;
}

function isEnum(def: any): boolean {
  return def.enum !== undefined;
}

function findParent(className: string, schema: LinkMLSchema): string | undefined {
  // Look through all class definitions to find if this class extends another
  // In LinkML/JSON Schema, inheritance is typically indicated by allOf or specific patterns
  // For now, we'll use a simple heuristic based on common patterns

  const def = schema.$defs[className];
  if (!def || !isClass(def)) return undefined;

  // Common parent classes in the model (from documentation)
  const knownParents = [
    'Entity', 'Person', 'Participant', 'Specimen', 'Observation',
    'MeasurementObservation', 'SdohObservation', 'Exposure',
    'DrugExposure', 'DeviceExposure', 'Condition', 'Procedure',
    'Visit', 'ResearchStudy', 'Organization', 'Consent'
  ];

  // Check if class name suggests inheritance (e.g., MeasurementObservation contains Observation)
  for (const parent of knownParents) {
    if (className !== parent && className.includes(parent)) {
      return parent;
    }
  }

  return undefined;
}

export function buildClassHierarchy(
  schema: LinkMLSchema,
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

  Object.entries(schema.$defs).forEach(([name, def]) => {
    if (isClass(def)) {
      const vars = variablesByClass.get(name) || [];
      classMap.set(name, {
        name,
        description: def.description,
        parent: findParent(name, schema),
        children: [],
        variableCount: vars.length,
        variables: vars,
        properties: def.properties,
        isEnum: false
      });
    }
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
