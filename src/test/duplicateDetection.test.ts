/**
 * Tests for duplicate element detection logic
 */

import { describe, it, expect } from 'vitest';
import {
  getElementName,
  findDuplicateIndex,
  isDuplicate,
  type ElementDescriptor
} from '../utils/duplicateDetection';
import type { ClassNode, EnumDefinition, SlotDefinition, VariableSpec } from '../types';

// Mock elements for testing
const mockClass: ClassNode = {
  name: 'Specimen',
  description: 'A sample class',
  attributes: {},
  children: [],
  slots: [],
  slot_usage: {},
  abstract: false
};

const mockEnum: EnumDefinition = {
  name: 'SpecimenTypeEnum',
  description: 'Specimen types',
  permissible_values: {}
};

const mockSlot: SlotDefinition = {
  name: 'identifier',
  description: 'A unique identifier',
  range: 'string',
  slot_uri: 'http://example.org/identifier'
};

const mockVariable: VariableSpec = {
  variableLabel: 'specimen_type',
  variableDescription: 'The type of specimen',
  columnDataType: 'string',
  columnUnits: null,
  columnCURIE: null,
  classMappedTo: 'Specimen'
};

describe('getElementName', () => {
  it('returns name for class element', () => {
    const name = getElementName(mockClass, 'class');
    expect(name).toBe('Specimen');
  });

  it('returns name for enum element', () => {
    const name = getElementName(mockEnum, 'enum');
    expect(name).toBe('SpecimenTypeEnum');
  });

  it('returns name for slot element', () => {
    const name = getElementName(mockSlot, 'slot');
    expect(name).toBe('identifier');
  });

  it('returns variableLabel for variable element', () => {
    const name = getElementName(mockVariable, 'variable');
    expect(name).toBe('specimen_type');
  });
});

describe('findDuplicateIndex', () => {
  const entities: ElementDescriptor[] = [
    { element: mockClass, elementType: 'class' },
    { element: mockEnum, elementType: 'enum' },
    { element: mockSlot, elementType: 'slot' },
    { element: mockVariable, elementType: 'variable' }
  ];

  it('finds duplicate class by name', () => {
    const duplicateClass: ClassNode = { ...mockClass, description: 'Different description' };
    const index = findDuplicateIndex(entities, duplicateClass, 'class');
    expect(index).toBe(0);
  });

  it('finds duplicate enum by name', () => {
    const duplicateEnum: EnumDefinition = { ...mockEnum, description: 'Different description' };
    const index = findDuplicateIndex(entities, duplicateEnum, 'enum');
    expect(index).toBe(1);
  });

  it('finds duplicate slot by name', () => {
    const duplicateSlot: SlotDefinition = { ...mockSlot, description: 'Different description' };
    const index = findDuplicateIndex(entities, duplicateSlot, 'slot');
    expect(index).toBe(2);
  });

  it('finds duplicate variable by variableLabel', () => {
    const duplicateVariable: VariableSpec = { ...mockVariable, variableDescription: 'Different description' };
    const index = findDuplicateIndex(entities, duplicateVariable, 'variable');
    expect(index).toBe(3);
  });

  it('returns -1 for non-duplicate class', () => {
    const newClass: ClassNode = { ...mockClass, name: 'Condition' };
    const index = findDuplicateIndex(entities, newClass, 'class');
    expect(index).toBe(-1);
  });

  it('returns -1 for non-duplicate enum', () => {
    const newEnum: EnumDefinition = { ...mockEnum, name: 'ConditionTypeEnum' };
    const index = findDuplicateIndex(entities, newEnum, 'enum');
    expect(index).toBe(-1);
  });

  it('returns -1 for non-duplicate slot', () => {
    const newSlot: SlotDefinition = { ...mockSlot, name: 'description' };
    const index = findDuplicateIndex(entities, newSlot, 'slot');
    expect(index).toBe(-1);
  });

  it('returns -1 for non-duplicate variable', () => {
    const newVariable: VariableSpec = { ...mockVariable, variableLabel: 'condition_type' };
    const index = findDuplicateIndex(entities, newVariable, 'variable');
    expect(index).toBe(-1);
  });

  it('distinguishes same name across different element types', () => {
    // Create a class and enum with the same name
    const sameNameClass: ClassNode = { ...mockClass, name: 'SameName' };
    const sameNameEnum: EnumDefinition = { ...mockEnum, name: 'SameName' };

    const entitiesWithSameName: ElementDescriptor[] = [
      { element: sameNameClass, elementType: 'class' },
      { element: sameNameEnum, elementType: 'enum' }
    ];

    // Should find class duplicate at index 0
    const classIndex = findDuplicateIndex(entitiesWithSameName, sameNameClass, 'class');
    expect(classIndex).toBe(0);

    // Should find enum duplicate at index 1 (not confused with class)
    const enumIndex = findDuplicateIndex(entitiesWithSameName, sameNameEnum, 'enum');
    expect(enumIndex).toBe(1);
  });

  it('handles empty array', () => {
    const index = findDuplicateIndex([], mockClass, 'class');
    expect(index).toBe(-1);
  });

  it('finds first occurrence when multiple duplicates exist', () => {
    const entitiesWithDuplicates: ElementDescriptor[] = [
      { element: mockClass, elementType: 'class' },
      { element: mockClass, elementType: 'class' }, // Duplicate at index 1
      { element: mockClass, elementType: 'class' }  // Duplicate at index 2
    ];

    const index = findDuplicateIndex(entitiesWithDuplicates, mockClass, 'class');
    expect(index).toBe(0); // Should find the first one
  });
});

describe('isDuplicate', () => {
  const entities: ElementDescriptor[] = [
    { element: mockClass, elementType: 'class' },
    { element: mockEnum, elementType: 'enum' },
    { element: mockSlot, elementType: 'slot' },
    { element: mockVariable, elementType: 'variable' }
  ];

  it('returns true for duplicate class', () => {
    expect(isDuplicate(entities, mockClass, 'class')).toBe(true);
  });

  it('returns true for duplicate enum', () => {
    expect(isDuplicate(entities, mockEnum, 'enum')).toBe(true);
  });

  it('returns true for duplicate slot', () => {
    expect(isDuplicate(entities, mockSlot, 'slot')).toBe(true);
  });

  it('returns true for duplicate variable', () => {
    expect(isDuplicate(entities, mockVariable, 'variable')).toBe(true);
  });

  it('returns false for non-duplicate class', () => {
    const newClass: ClassNode = { ...mockClass, name: 'Condition' };
    expect(isDuplicate(entities, newClass, 'class')).toBe(false);
  });

  it('returns false for non-duplicate enum', () => {
    const newEnum: EnumDefinition = { ...mockEnum, name: 'ConditionTypeEnum' };
    expect(isDuplicate(entities, newEnum, 'enum')).toBe(false);
  });

  it('returns false for non-duplicate slot', () => {
    const newSlot: SlotDefinition = { ...mockSlot, name: 'description' };
    expect(isDuplicate(entities, newSlot, 'slot')).toBe(false);
  });

  it('returns false for non-duplicate variable', () => {
    const newVariable: VariableSpec = { ...mockVariable, variableLabel: 'condition_type' };
    expect(isDuplicate(entities, newVariable, 'variable')).toBe(false);
  });

  it('returns false for empty array', () => {
    expect(isDuplicate([], mockClass, 'class')).toBe(false);
  });
});
