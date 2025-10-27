// Core type definitions for the LinkML model and variable specs

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
  slots?: string[]; // Top-level slots referenced by this class
  slot_usage?: Record<string, any>; // Refinements/constraints on inherited or referenced slots
  abstract?: boolean; // Whether this class is abstract
}

export interface EnumValue {
  key: string;
  description?: string;
}

export interface EnumDefinition {
  name: string;
  description?: string;
  permissible_values: EnumValue[];
  usedByClasses: string[]; // Classes that reference this enum
}

export interface SlotDefinition {
  name: string;
  description?: string;
  range?: string;
  slot_uri?: string;
  identifier?: boolean;
  required?: boolean;
  multivalued?: boolean;
  usedByClasses: string[]; // Classes that use this slot
}

/**
 * Union type representing any selectable element in the UI
 * Used for element selection, navigation, and detail display
 */
export type SelectedElement = ClassNode | EnumDefinition | SlotDefinition | VariableSpec;

export interface ReverseIndices {
  enumToClasses: Map<string, Set<string>>; // enum name -> class names
  slotToClasses: Map<string, Set<string>>; // slot name -> class names
  classToClasses: Map<string, Set<string>>; // class name -> classes that reference it
}

export interface ModelData {
  classHierarchy: ClassNode[];
  enums: Map<string, EnumDefinition>;
  slots: Map<string, SlotDefinition>;
  variables: VariableSpec[];
  reverseIndices: ReverseIndices;
  // Generic collections - keyed by ElementTypeId for iteration
  collections: Map<import('./models/ElementRegistry').ElementTypeId, import('./models/Element').ElementCollection>;
}
