/**
 * Tests for duplicate entity detection logic
 */

import { describe, it, expect } from 'vitest';
import {
  getEntityName,
  getEntityType,
  findDuplicateIndex,
  isDuplicate,
  type EntityDescriptor
} from '../utils/duplicateDetection';
import type { ClassNode, EnumDefinition, SlotDefinition, VariableSpec } from '../types';

// Mock entities for testing
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

describe('getEntityName', () => {
  it('returns name for class entity', () => {
    const name = getEntityName(mockClass, 'class');
    expect(name).toBe('Specimen');
  });

  it('returns name for enum entity', () => {
    const name = getEntityName(mockEnum, 'enum');
    expect(name).toBe('SpecimenTypeEnum');
  });

  it('returns name for slot entity', () => {
    const name = getEntityName(mockSlot, 'slot');
    expect(name).toBe('identifier');
  });

  it('returns variableLabel for variable entity', () => {
    const name = getEntityName(mockVariable, 'variable');
    expect(name).toBe('specimen_type');
  });
});

describe('getEntityType', () => {
  it('detects class by presence of children property', () => {
    const type = getEntityType(mockClass);
    expect(type).toBe('class');
  });

  it('detects enum by presence of permissible_values property', () => {
    const type = getEntityType(mockEnum);
    expect(type).toBe('enum');
  });

  it('detects slot by presence of slot_uri property', () => {
    const type = getEntityType(mockSlot);
    expect(type).toBe('slot');
  });

  it('detects variable as fallback', () => {
    const type = getEntityType(mockVariable);
    expect(type).toBe('variable');
  });
});

describe('findDuplicateIndex', () => {
  const entities: EntityDescriptor[] = [
    { entity: mockClass, entityType: 'class' },
    { entity: mockEnum, entityType: 'enum' },
    { entity: mockSlot, entityType: 'slot' },
    { entity: mockVariable, entityType: 'variable' }
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

  it('distinguishes same name across different entity types', () => {
    // Create a class and enum with the same name
    const sameNameClass: ClassNode = { ...mockClass, name: 'SameName' };
    const sameNameEnum: EnumDefinition = { ...mockEnum, name: 'SameName' };

    const entitiesWithSameName: EntityDescriptor[] = [
      { entity: sameNameClass, entityType: 'class' },
      { entity: sameNameEnum, entityType: 'enum' }
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
    const entitiesWithDuplicates: EntityDescriptor[] = [
      { entity: mockClass, entityType: 'class' },
      { entity: mockClass, entityType: 'class' }, // Duplicate at index 1
      { entity: mockClass, entityType: 'class' }  // Duplicate at index 2
    ];

    const index = findDuplicateIndex(entitiesWithDuplicates, mockClass, 'class');
    expect(index).toBe(0); // Should find the first one
  });
});

describe('isDuplicate', () => {
  const entities: EntityDescriptor[] = [
    { entity: mockClass, entityType: 'class' },
    { entity: mockEnum, entityType: 'enum' },
    { entity: mockSlot, entityType: 'slot' },
    { entity: mockVariable, entityType: 'variable' }
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
