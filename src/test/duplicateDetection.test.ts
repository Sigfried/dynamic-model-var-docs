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
import { ClassElement, EnumElement, SlotElement, VariableElement } from '../models/Element';
import type { ModelData } from '../types';

// Helper to create minimal ModelData for testing
const createMockModelData = (): ModelData => ({
  collections: new Map(),
  elementLookup: new Map(),
});

// Mock elements for testing
const mockClass = new ClassElement({
  name: 'Specimen',
  description: 'A sample class',
  parent: undefined,
  abstract: false,
  attributes: {}
}, createMockModelData());

const mockEnum = new EnumElement('SpecimenTypeEnum', {
  description: 'Specimen types',
  permissible_values: {}
});

const mockSlot = new SlotElement('identifier', {
  description: 'A unique identifier',
  range: 'string',
  slot_uri: 'http://example.org/identifier'
});

const mockVariable = new VariableElement({
  bdchmElement: 'Specimen',
  variableLabel: 'specimen_type',
  dataType: 'string',
  ucumUnit: '',
  curie: '',
  variableDescription: 'The type of specimen'
});

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
    const duplicateClass = new ClassElement({
      name: 'Specimen',
      description: 'Different description',
      parent: undefined,
      abstract: false,
      attributes: {}
    }, createMockModelData());
    const index = findDuplicateIndex(entities, duplicateClass, 'class');
    expect(index).toBe(0);
  });

  it('finds duplicate enum by name', () => {
    const duplicateEnum = new EnumElement('SpecimenTypeEnum', {
      description: 'Different description',
      permissible_values: {}
    });
    const index = findDuplicateIndex(entities, duplicateEnum, 'enum');
    expect(index).toBe(1);
  });

  it('finds duplicate slot by name', () => {
    const duplicateSlot = new SlotElement('identifier', {
      description: 'Different description',
      range: 'string',
      slot_uri: 'http://example.org/identifier'
    });
    const index = findDuplicateIndex(entities, duplicateSlot, 'slot');
    expect(index).toBe(2);
  });

  it('finds duplicate variable by variableLabel', () => {
    const duplicateVariable = new VariableElement({
      bdchmElement: 'Specimen',
      variableLabel: 'specimen_type',
      dataType: 'string',
      ucumUnit: '',
      curie: '',
      variableDescription: 'Different description'
    });
    const index = findDuplicateIndex(entities, duplicateVariable, 'variable');
    expect(index).toBe(3);
  });

  it('returns -1 for non-duplicate class', () => {
    const newClass = new ClassElement({
      name: 'Condition',
      description: 'A sample class',
      parent: undefined,
      abstract: false,
      attributes: {}
    }, createMockModelData());
    const index = findDuplicateIndex(entities, newClass, 'class');
    expect(index).toBe(-1);
  });

  it('returns -1 for non-duplicate enum', () => {
    const newEnum = new EnumElement('ConditionTypeEnum', {
      description: 'Condition types',
      permissible_values: {}
    });
    const index = findDuplicateIndex(entities, newEnum, 'enum');
    expect(index).toBe(-1);
  });

  it('returns -1 for non-duplicate slot', () => {
    const newSlot = new SlotElement('description', {
      description: 'A description',
      range: 'string',
      slot_uri: 'http://example.org/description'
    });
    const index = findDuplicateIndex(entities, newSlot, 'slot');
    expect(index).toBe(-1);
  });

  it('returns -1 for non-duplicate variable', () => {
    const newVariable = new VariableElement({
      bdchmElement: 'Condition',
      variableLabel: 'condition_type',
      dataType: 'string',
      ucumUnit: '',
      curie: '',
      variableDescription: 'The type of condition'
    });
    const index = findDuplicateIndex(entities, newVariable, 'variable');
    expect(index).toBe(-1);
  });

  it('distinguishes same name across different element types', () => {
    // Create a class and enum with the same name
    const sameNameClass = new ClassElement({
      name: 'SameName',
      description: 'A sample class',
      parent: undefined,
      abstract: false,
      attributes: {}
    }, createMockModelData());
    const sameNameEnum = new EnumElement('SameName', {
      description: 'An enum',
      permissible_values: {}
    });

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
    const newClass = new ClassElement({
      name: 'Condition',
      description: 'A sample class',
      parent: undefined,
      abstract: false,
      attributes: {}
    }, createMockModelData());
    expect(isDuplicate(entities, newClass, 'class')).toBe(false);
  });

  it('returns false for non-duplicate enum', () => {
    const newEnum = new EnumElement('ConditionTypeEnum', {
      description: 'Condition types',
      permissible_values: {}
    });
    expect(isDuplicate(entities, newEnum, 'enum')).toBe(false);
  });

  it('returns false for non-duplicate slot', () => {
    const newSlot = new SlotElement('description', {
      description: 'A description',
      range: 'string',
      slot_uri: 'http://example.org/description'
    });
    expect(isDuplicate(entities, newSlot, 'slot')).toBe(false);
  });

  it('returns false for non-duplicate variable', () => {
    const newVariable = new VariableElement({
      bdchmElement: 'Condition',
      variableLabel: 'condition_type',
      dataType: 'string',
      ucumUnit: '',
      curie: '',
      variableDescription: 'The type of condition'
    });
    expect(isDuplicate(entities, newVariable, 'variable')).toBe(false);
  });

  it('returns false for empty array', () => {
    expect(isDuplicate([], mockClass, 'class')).toBe(false);
  });
});
