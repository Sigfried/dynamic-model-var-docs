// Core type definitions for the LinkML model and variable specs

export interface LinkMLClass {
  title: string;
  description?: string;
  type: string;
  properties?: Record<string, any>;
  required?: string[];
  additionalProperties?: boolean;
}

export interface LinkMLEnum {
  title: string;
  description?: string;
  type: string;
  enum: string[];
}

export interface LinkMLSchema {
  $defs: Record<string, LinkMLClass | LinkMLEnum>;
}

export interface VariableSpec {
  bdchmElement: string;
  variableLabel: string;
  dataType: string;
  ucumUnit: string;
  curie: string;
  variableDescription: string;
}

export interface ClassNode {
  name: string;
  description?: string;
  parent?: string;
  children: ClassNode[];
  variableCount: number;
  variables: VariableSpec[];
  properties?: Record<string, any>;
  isEnum: boolean;
  enumReferences?: string[]; // List of enum names this class references
  requiredProperties?: string[]; // List of required property names
}
