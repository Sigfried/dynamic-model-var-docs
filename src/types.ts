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
  // New: ElementCollections (will eventually replace raw data above)
  collections: {
    classes: import('./models/Element').ClassCollection;
    enums: import('./models/Element').EnumCollection;
    slots: import('./models/Element').SlotCollection;
    variables: import('./models/Element').VariableCollection;
  };
}
