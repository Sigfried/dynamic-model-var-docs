// Utilities for loading and parsing schema and variable specs

import type { VariableSpec, ClassNode } from '../types';

interface ClassMetadata {
  name: string;
  description: string;
  parent?: string;
  abstract: boolean;
  attributes: Record<string, any>;
  slots: string[];
}

interface SchemaMetadata {
  classes: Record<string, ClassMetadata>;
  slots: Record<string, any>;
  enums: Record<string, any>;
}

export async function loadSchema(): Promise<Map<string, ClassMetadata>> {
  const response = await fetch(`${import.meta.env.BASE_URL}source_data/HM/bdchm.metadata.json`);
  if (!response.ok) {
    throw new Error(`Failed to load schema metadata: ${response.statusText}`);
  }
  const metadata: SchemaMetadata = await response.json();

  const classes = new Map<string, ClassMetadata>();
  Object.entries(metadata.classes).forEach(([name, classDef]) => {
    classes.set(name, classDef);
  });

  return classes;
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
      requiredProperties: undefined
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
