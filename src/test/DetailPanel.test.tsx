import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import DetailPanel from '../components/DetailPanel';
import { ClassElement, EnumElement, SlotElement, VariableElement } from '../models/Element';
import type { ClassNode, EnumDefinition, SlotDefinition, VariableSpec } from '../types';

/**
 * DetailPanel Tests
 *
 * Verifies that DetailPanel correctly renders detail data from Element.getDetailData()
 * Tests are organized by element type: Class, Enum, Slot, Variable
 */

describe('DetailPanel - ClassElement', () => {
  const mockClassData: ClassNode = {
    name: 'TestClass',
    description: 'A test class',
    parent: 'ParentClass',
    children: [],
    variableCount: 2,
    variables: [
      {
        bdchmElement: 'TestClass',
        variableLabel: 'test_var',
        dataType: 'string',
        ucumUnit: 'kg',
        curie: 'TEST:001',
        variableDescription: 'Test variable'
      },
      {
        bdchmElement: 'TestClass',
        variableLabel: 'test_var2',
        dataType: 'integer',
        ucumUnit: '',
        curie: 'TEST:002',
        variableDescription: 'Second test variable'
      }
    ],
    properties: {
      testProperty: {
        range: 'string',
        description: 'Test property',
        required: true,
        multivalued: false
      }
    },
    isEnum: false,
    slots: ['testSlot'],
    slot_usage: {
      usedSlot: {
        range: 'TestEnum',
        required: true,
        description: 'A used slot'
      }
    },
    abstract: false
  };

  const classElement = new ClassElement(mockClassData, new Map());

  test('should render class titlebar with name', () => {
    render(<DetailPanel element={classElement} />);

    expect(screen.getByText('Class: TestClass')).toBeInTheDocument();
  });

  test('should render description', () => {
    render(<DetailPanel element={classElement} />);

    expect(screen.getByText('A test class')).toBeInTheDocument();
  });

  test('should render inheritance section', () => {
    render(<DetailPanel element={classElement} />);

    expect(screen.getByText('Inheritance')).toBeInTheDocument();
    expect(screen.getByText(/Inherits from: ParentClass/)).toBeInTheDocument();
  });

  test('should render attributes section', () => {
    render(<DetailPanel element={classElement} />);

    expect(screen.getByText('Attributes')).toBeInTheDocument();
    expect(screen.getByText('testProperty')).toBeInTheDocument();
    expect(screen.getAllByText('string').length).toBeGreaterThan(0);
    expect(screen.getByText('Test property')).toBeInTheDocument();
  });

  test('should render slot usage section', () => {
    render(<DetailPanel element={classElement} />);

    expect(screen.getByText('Slot Usage')).toBeInTheDocument();
    expect(screen.getByText('usedSlot')).toBeInTheDocument();
    expect(screen.getByText('TestEnum')).toBeInTheDocument();
    expect(screen.getByText('A used slot')).toBeInTheDocument();
  });

  test('should render referenced slots section', () => {
    render(<DetailPanel element={classElement} />);

    expect(screen.getByText('Referenced Slots')).toBeInTheDocument();
    expect(screen.getByText('testSlot')).toBeInTheDocument();
  });

  test('should render variables section with count', () => {
    render(<DetailPanel element={classElement} />);

    expect(screen.getByText('Variables (2)')).toBeInTheDocument();
    expect(screen.getByText('test_var')).toBeInTheDocument();
    expect(screen.getByText('test_var2')).toBeInTheDocument();
    expect(screen.getByText('kg')).toBeInTheDocument();
    expect(screen.getByText('TEST:001')).toBeInTheDocument();
  });

  test('should handle class without parent', () => {
    const rootClassData: ClassNode = {
      ...mockClassData,
      parent: undefined
    };
    const rootClass = new ClassElement(rootClassData, new Map());

    render(<DetailPanel element={rootClass} />);

    // Inheritance section should not appear
    expect(screen.queryByText('Inheritance')).not.toBeInTheDocument();
  });
});

describe('DetailPanel - EnumElement', () => {
  const mockEnumData: EnumDefinition = {
    name: 'TestEnum',
    description: 'A test enumeration',
    permissible_values: [
      { key: 'VALUE1', description: 'First value' },
      { key: 'VALUE2', description: 'Second value' },
      { key: 'VALUE3', description: undefined }
    ],
    usedByClasses: ['TestClass', 'AnotherClass']
  };

  const enumElement = new EnumElement(mockEnumData);

  test('should render enum titlebar with name', () => {
    render(<DetailPanel element={enumElement} />);

    expect(screen.getByText('Enumeration: TestEnum')).toBeInTheDocument();
  });

  test('should render description', () => {
    render(<DetailPanel element={enumElement} />);

    expect(screen.getByText('A test enumeration')).toBeInTheDocument();
  });

  test('should render permissible values section', () => {
    render(<DetailPanel element={enumElement} />);

    expect(screen.getByText('Permissible Values')).toBeInTheDocument();
    expect(screen.getByText('VALUE1')).toBeInTheDocument();
    expect(screen.getByText('VALUE2')).toBeInTheDocument();
    expect(screen.getByText('VALUE3')).toBeInTheDocument();
    expect(screen.getByText('First value')).toBeInTheDocument();
    expect(screen.getByText('Second value')).toBeInTheDocument();
  });

  test('should render used by classes section', () => {
    render(<DetailPanel element={enumElement} />);

    expect(screen.getByText(/Used By Classes \(2\)/)).toBeInTheDocument();
    expect(screen.getByText('TestClass')).toBeInTheDocument();
    expect(screen.getByText('AnotherClass')).toBeInTheDocument();
  });

  test('should handle enum without description', () => {
    const noDescEnum: EnumDefinition = {
      ...mockEnumData,
      description: undefined
    };
    const noDescElement = new EnumElement(noDescEnum);

    render(<DetailPanel element={noDescElement} />);

    expect(screen.getByText('Enumeration: TestEnum')).toBeInTheDocument();
    expect(screen.queryByText('A test enumeration')).not.toBeInTheDocument();
  });
});

describe('DetailPanel - SlotElement', () => {
  const mockSlotData: SlotDefinition = {
    name: 'testSlot',
    description: 'A test slot',
    range: 'string',
    slot_uri: 'https://example.com/slot/test',
    identifier: true,
    required: true,
    multivalued: false,
    usedByClasses: ['ClassA', 'ClassB', 'ClassC']
  };

  const slotElement = new SlotElement(mockSlotData);

  test('should render slot titlebar with name', () => {
    render(<DetailPanel element={slotElement} />);

    expect(screen.getByText('Slot: testSlot')).toBeInTheDocument();
  });

  test('should render description', () => {
    render(<DetailPanel element={slotElement} />);

    expect(screen.getByText('A test slot')).toBeInTheDocument();
  });

  test('should render properties section', () => {
    render(<DetailPanel element={slotElement} />);

    expect(screen.getByText('Properties')).toBeInTheDocument();
    expect(screen.getByText('Range')).toBeInTheDocument();
    expect(screen.getByText('string')).toBeInTheDocument();
    expect(screen.getByText('Required')).toBeInTheDocument();
    expect(screen.getByText('Multivalued')).toBeInTheDocument();
    expect(screen.getByText('Identifier')).toBeInTheDocument();
    expect(screen.getByText('Slot URI')).toBeInTheDocument();
    expect(screen.getByText('https://example.com/slot/test')).toBeInTheDocument();
  });

  test('should render used by classes section', () => {
    render(<DetailPanel element={slotElement} />);

    expect(screen.getByText(/Used By Classes \(3\)/)).toBeInTheDocument();
    expect(screen.getByText('ClassA')).toBeInTheDocument();
    expect(screen.getByText('ClassB')).toBeInTheDocument();
    expect(screen.getByText('ClassC')).toBeInTheDocument();
  });

  test('should handle minimal slot definition', () => {
    const minimalSlotData: SlotDefinition = {
      name: 'minimalSlot',
      description: undefined,
      range: undefined,
      slot_uri: undefined,
      identifier: undefined,
      required: undefined,
      multivalued: undefined,
      usedByClasses: []
    };
    const minimalSlot = new SlotElement(minimalSlotData);

    render(<DetailPanel element={minimalSlot} />);

    expect(screen.getByText('Slot: minimalSlot')).toBeInTheDocument();
    // Should not crash with missing properties
  });
});

describe('DetailPanel - VariableElement', () => {
  const mockVariableData: VariableSpec = {
    bdchmElement: 'MeasurementObservation',
    variableLabel: 'body_mass_index',
    dataType: 'decimal',
    ucumUnit: 'kg/m2',
    curie: 'MONDO:0001234',
    variableDescription: 'Body Mass Index measurement'
  };

  const variableElement = new VariableElement(mockVariableData);

  test('should render variable titlebar with name', () => {
    render(<DetailPanel element={variableElement} />);

    expect(screen.getByText('Variable: body_mass_index')).toBeInTheDocument();
  });

  test('should render description', () => {
    render(<DetailPanel element={variableElement} />);

    expect(screen.getByText('Body Mass Index measurement')).toBeInTheDocument();
  });

  test('should render properties section', () => {
    render(<DetailPanel element={variableElement} />);

    expect(screen.getByText('Properties')).toBeInTheDocument();
    expect(screen.getByText('Mapped to')).toBeInTheDocument();
    expect(screen.getByText('MeasurementObservation')).toBeInTheDocument();
    expect(screen.getByText('Data Type')).toBeInTheDocument();
    expect(screen.getByText('decimal')).toBeInTheDocument();
    expect(screen.getByText('Unit')).toBeInTheDocument();
    expect(screen.getByText('kg/m2')).toBeInTheDocument();
    expect(screen.getByText('CURIE')).toBeInTheDocument();
    expect(screen.getByText('MONDO:0001234')).toBeInTheDocument();
  });

  test('should handle variable with minimal data', () => {
    const minimalVarData: VariableSpec = {
      bdchmElement: 'TestClass',
      variableLabel: 'test_var',
      dataType: '',
      ucumUnit: '',
      curie: '',
      variableDescription: ''
    };
    const minimalVar = new VariableElement(minimalVarData);

    render(<DetailPanel element={minimalVar} />);

    expect(screen.getByText('Variable: test_var')).toBeInTheDocument();
    expect(screen.getByText('Mapped to')).toBeInTheDocument();
    expect(screen.getByText('TestClass')).toBeInTheDocument();
  });
});

describe('DetailPanel - Header visibility', () => {
  const mockEnumData: EnumDefinition = {
    name: 'TestEnum',
    description: 'Test',
    permissible_values: [],
    usedByClasses: []
  };
  const enumElement = new EnumElement(mockEnumData);

  test('should show header by default', () => {
    render(<DetailPanel element={enumElement} />);

    // Header contains titlebarTitle
    expect(screen.getByText('Enumeration: TestEnum')).toBeInTheDocument();
  });

  test('should hide header when hideHeader is true', () => {
    render(<DetailPanel element={enumElement} hideHeader={true} />);

    // When header is hidden, title appears in content area instead
    expect(screen.getByText('TestEnum')).toBeInTheDocument();
  });
});
