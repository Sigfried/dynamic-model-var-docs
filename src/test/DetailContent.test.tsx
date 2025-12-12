import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import DetailContent from '../components/DetailContent';
import { ClassElement, EnumElement, SlotElement, VariableElement, SlotCollection, Element } from '../models/Element';
import type { ClassData, EnumData, SlotData, VariableSpec } from '../models/SchemaTypes';
import type { ModelData } from '../models/ModelData';
import { createSchemaGraph } from '../models/Graph';
import { DataService } from '../services/DataService';

/**
 * DetailContent Tests (renamed from DetailPanel)
 *
 * Verifies that DetailContent correctly renders detail data from Element.getDetailData()
 * Tests are organized by element type: Class, Enum, Slot, Variable
 */

// Helper to create minimal ModelData for testing with element registered
const createMockModelDataWithElement = (element: Element): ModelData => {
  const modelData: ModelData = {
    collections: new Map(),
    elementLookup: new Map(),
    graph: createSchemaGraph(),
  };
  modelData.elementLookup.set(element.getId(), element);
  return modelData;
};

// Helper to create DataService with a single element registered
const createMockDataService = (element: Element): DataService => {
  const modelData = createMockModelDataWithElement(element);
  return new DataService(modelData);
};

// Helper to create bare ModelData (for ClassElement construction)
const createMockModelData = (): ModelData => ({
  collections: new Map(),
  elementLookup: new Map(),
  graph: createSchemaGraph(),
});

describe('DetailContent - ClassElement', () => {
  // Create mock slot collection with slots that will be referenced
  const createTestSlotCollection = (): SlotCollection => {
    const slotData = new Map<string, SlotData>();
    slotData.set('testProperty', {
      id: 'testProperty',
      name: 'testProperty',
      description: 'Test property',
      range: 'string',
      required: true,
      multivalued: false
    });
    slotData.set('testSlot', {
      id: 'testSlot',
      name: 'testSlot',
      description: 'A test slot',
      range: 'string'
    });
    slotData.set('usedSlot', {
      id: 'usedSlot',
      name: 'usedSlot',
      description: 'A used slot',
      range: 'TestEnum',
      required: true
    });
    return SlotCollection.fromData(slotData);
  };

  const mockClassData: ClassData = {
    id: 'TestClass',
    name: 'TestClass',
    description: 'A test class',
    parent: 'ParentClass',
    abstract: false,
    slots: [
      { id: 'testProperty' },
      { id: 'testSlot' },
      { id: 'usedSlot' }
    ]
  };

  const slotCollection = createTestSlotCollection();
  const classElement = new ClassElement(mockClassData, slotCollection);
  // Manually add variables for testing
  classElement.variables = [
    new VariableElement({
      maps_to: 'TestClass',
      variableLabel: 'test_var',
      dataType: 'string',
      ucumUnit: 'kg',
      curie: 'TEST:001',
      variableDescription: 'Test variable'
    }),
    new VariableElement({
      maps_to: 'TestClass',
      variableLabel: 'test_var2',
      dataType: 'integer',
      ucumUnit: '',
      curie: 'TEST:002',
      variableDescription: 'Second test variable'
    })
  ];

  // Create DataService for rendering
  const dataService = createMockDataService(classElement);

  test('should render class titlebar with name', () => {
    render(<DetailContent itemId="TestClass" dataService={dataService} />);

    expect(screen.getByText('TestClass')).toBeInTheDocument();
    expect(screen.getByText('extends ParentClass')).toBeInTheDocument();
  });

  test('should render description', () => {
    render(<DetailContent itemId="TestClass" dataService={dataService} />);

    expect(screen.getByText('A test class')).toBeInTheDocument();
  });

  test('should render inheritance section', () => {
    render(<DetailContent itemId="TestClass" dataService={dataService} />);

    expect(screen.getByText('Inheritance')).toBeInTheDocument();
    expect(screen.getByText(/Inherits from: ParentClass/)).toBeInTheDocument();
  });

  test('should render slots section with all slots', () => {
    render(<DetailContent itemId="TestClass" dataService={dataService} />);

    // Slots section
    expect(screen.getByText('Slots')).toBeInTheDocument();

    // Verify all slots are present
    expect(screen.getByText('testProperty')).toBeInTheDocument();
    expect(screen.getByText('usedSlot')).toBeInTheDocument();
    expect(screen.getByText('testSlot')).toBeInTheDocument();

    // Verify slot details
    expect(screen.getAllByText('string').length).toBeGreaterThan(0);
    expect(screen.getByText('Test property')).toBeInTheDocument();
    expect(screen.getByText('TestEnum')).toBeInTheDocument();
    expect(screen.getByText('A used slot')).toBeInTheDocument();
  });

  test('should render variables section with count', () => {
    render(<DetailContent itemId="TestClass" dataService={dataService} />);

    expect(screen.getByText('Variables (2)')).toBeInTheDocument();
    expect(screen.getByText('test_var')).toBeInTheDocument();
    expect(screen.getByText('test_var2')).toBeInTheDocument();
    expect(screen.getByText('kg')).toBeInTheDocument();
    expect(screen.getByText('TEST:001')).toBeInTheDocument();
  });

  test('should handle class without parent', () => {
    const rootClassData: ClassData = {
      ...mockClassData,
      id: 'RootClass',
      name: 'RootClass',
      parent: undefined
    };
    const rootClass = new ClassElement(rootClassData, slotCollection);
    const rootDataService = createMockDataService(rootClass);

    render(<DetailContent itemId="RootClass" dataService={rootDataService} />);

    // Inheritance section should not appear
    expect(screen.queryByText('Inheritance')).not.toBeInTheDocument();
  });
});

describe('DetailContent -EnumElement', () => {
  const mockEnumData: EnumData = {
    description: 'A test enumeration',
    permissibleValues: {
      VALUE1: { description: 'First value' },
      VALUE2: { description: 'Second value' },
      VALUE3: { description: undefined }
    }
  };

  const enumElement = new EnumElement('TestEnum', mockEnumData);
  const enumDataService = createMockDataService(enumElement);

  test('should render enum titlebar with name', () => {
    render(<DetailContent itemId="TestEnum" dataService={enumDataService} />);

    expect(screen.getByText('TestEnum')).toBeInTheDocument();
  });

  test('should render description', () => {
    render(<DetailContent itemId="TestEnum" dataService={enumDataService} />);

    expect(screen.getByText('A test enumeration')).toBeInTheDocument();
  });

  test('should render permissible values section', () => {
    render(<DetailContent itemId="TestEnum" dataService={enumDataService} />);

    expect(screen.getByText('Permissible Values')).toBeInTheDocument();
    expect(screen.getByText('VALUE1')).toBeInTheDocument();
    expect(screen.getByText('VALUE2')).toBeInTheDocument();
    expect(screen.getByText('VALUE3')).toBeInTheDocument();
    expect(screen.getByText('First value')).toBeInTheDocument();
    expect(screen.getByText('Second value')).toBeInTheDocument();
  });

  test.skip('should render used by classes section', () => {
    // TODO: Re-enable after implementing getUsedByClasses() in Phase 5
    render(<DetailContent itemId="TestEnum" dataService={enumDataService} />);

    expect(screen.getByText(/Used By Classes \(2\)/)).toBeInTheDocument();
    expect(screen.getByText('TestClass')).toBeInTheDocument();
    expect(screen.getByText('AnotherClass')).toBeInTheDocument();
  });

  test('should handle enum without description', () => {
    const noDescEnum: EnumData = {
      ...mockEnumData,
      description: undefined
    };
    const noDescElement = new EnumElement('NoDescEnum', noDescEnum);
    const noDescDataService = createMockDataService(noDescElement);

    render(<DetailContent itemId="NoDescEnum" dataService={noDescDataService} />);

    expect(screen.getByText('NoDescEnum')).toBeInTheDocument();
    expect(screen.queryByText('A test enumeration')).not.toBeInTheDocument();
  });
});

describe('DetailContent -SlotElement', () => {
  const mockSlotData: SlotData = {
    id: 'testSlot',
    name: 'testSlot',
    description: 'A test slot',
    range: 'string',
    slotUri: 'https://example.com/slot/test',
    identifier: true,
    required: true,
    multivalued: false
  };

  const slotElement = new SlotElement('testSlot', mockSlotData);
  const slotDataService = createMockDataService(slotElement);

  test('should render slot titlebar with name', () => {
    render(<DetailContent itemId="testSlot" dataService={slotDataService} />);

    expect(screen.getByText('testSlot')).toBeInTheDocument();
  });

  test('should render description', () => {
    render(<DetailContent itemId="testSlot" dataService={slotDataService} />);

    expect(screen.getByText('A test slot')).toBeInTheDocument();
  });

  test('should render properties section', () => {
    render(<DetailContent itemId="testSlot" dataService={slotDataService} />);

    expect(screen.getByText('Properties')).toBeInTheDocument();
    expect(screen.getByText('Range')).toBeInTheDocument();
    expect(screen.getByText('string')).toBeInTheDocument();
    expect(screen.getByText('Required')).toBeInTheDocument();
    expect(screen.getByText('Multivalued')).toBeInTheDocument();
    expect(screen.getByText('Identifier')).toBeInTheDocument();
    expect(screen.getByText('Slot URI')).toBeInTheDocument();
    expect(screen.getByText('https://example.com/slot/test')).toBeInTheDocument();
  });

  test.skip('should render used by classes section', () => {
    // TODO: Re-enable after implementing getUsedByClasses() in Phase 5
    render(<DetailContent itemId="testSlot" dataService={slotDataService} />);

    expect(screen.getByText(/Used By Classes \(3\)/)).toBeInTheDocument();
    expect(screen.getByText('ClassA')).toBeInTheDocument();
    expect(screen.getByText('ClassB')).toBeInTheDocument();
    expect(screen.getByText('ClassC')).toBeInTheDocument();
  });

  test('should handle minimal slot definition', () => {
    const minimalSlotData: SlotData = {
      id: 'minimalSlot',
      name: 'minimalSlot',
      description: undefined,
      range: undefined,
      slotUri: undefined,
      identifier: undefined,
      required: undefined,
      multivalued: undefined
    };
    const minimalSlot = new SlotElement('minimalSlot', minimalSlotData);
    const minimalSlotDataService = createMockDataService(minimalSlot);

    render(<DetailContent itemId="minimalSlot" dataService={minimalSlotDataService} />);

    expect(screen.getByText('minimalSlot')).toBeInTheDocument();
    // Should not crash with missing properties
  });
});

describe('DetailContent -VariableElement', () => {
  const mockVariableData: VariableSpec = {
    maps_to: 'MeasurementObservation',
    variableLabel: 'body_mass_index',
    dataType: 'decimal',
    ucumUnit: 'kg/m2',
    curie: 'MONDO:0001234',
    variableDescription: 'Body Mass Index measurement'
  };

  const variableElement = new VariableElement(mockVariableData);
  const variableDataService = createMockDataService(variableElement);

  test('should render variable titlebar with name', () => {
    render(<DetailContent itemId="body_mass_index" dataService={variableDataService} />);

    expect(screen.getByText('body_mass_index')).toBeInTheDocument();
  });

  test('should render description', () => {
    render(<DetailContent itemId="body_mass_index" dataService={variableDataService} />);

    expect(screen.getByText('Body Mass Index measurement')).toBeInTheDocument();
  });

  test('should render properties section', () => {
    render(<DetailContent itemId="body_mass_index" dataService={variableDataService} />);

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
      maps_to: 'TestClass',
      variableLabel: 'test_var',
      dataType: '',
      ucumUnit: '',
      curie: '',
      variableDescription: ''
    };
    const minimalVar = new VariableElement(minimalVarData);
    const minimalVarDataService = createMockDataService(minimalVar);

    render(<DetailContent itemId="test_var" dataService={minimalVarDataService} />);

    expect(screen.getByText('test_var')).toBeInTheDocument();
    expect(screen.getByText('Mapped to')).toBeInTheDocument();
    expect(screen.getByText('TestClass')).toBeInTheDocument();
  });
});

describe('DetailContent -Header visibility', () => {
  const mockEnumData: EnumData = {
    description: 'Test',
    permissibleValues: {}
  };
  const enumElement = new EnumElement('HeaderTestEnum', mockEnumData);
  const headerEnumDataService = createMockDataService(enumElement);

  test('should show header by default', () => {
    render(<DetailContent itemId="HeaderTestEnum" dataService={headerEnumDataService} />);

    // Header contains title
    expect(screen.getByText('HeaderTestEnum')).toBeInTheDocument();
  });

  test('should hide header when hideHeader is true', () => {
    render(<DetailContent itemId="HeaderTestEnum" dataService={headerEnumDataService} hideHeader={true} />);

    // When header is hidden, title should NOT appear anywhere (it's in the outer header)
    expect(screen.queryByText('HeaderTestEnum')).not.toBeInTheDocument();
    // But description should still render
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});

describe('DetailContent - URI linkification', () => {
  test('should render CURIE with URL as clickable link', () => {
    const slotData: SlotData = {
      id: 'urlSlot',
      name: 'urlSlot',
      description: 'Test slot with URL',
      slotUri: 'schema:identifier',
      slotUrl: 'http://schema.org/identifier',
      range: 'string'
    };
    const slotElement = new SlotElement('urlSlot', slotData);
    const slotDataService = createMockDataService(slotElement);

    render(<DetailContent itemId="urlSlot" dataService={slotDataService} />);

    // CURIE is the link text, URL is the href
    const link = screen.getByRole('link', { name: 'schema:identifier' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'http://schema.org/identifier');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('should render CURIE without URL as plain text', () => {
    const slotData: SlotData = {
      id: 'noUrlSlot',
      name: 'noUrlSlot',
      description: 'Plain text description',
      slotUri: 'schema:identifier',  // CURIE without slotUrl
      range: 'string'
    };
    const slotElement = new SlotElement('noUrlSlot', slotData);
    const slotDataService = createMockDataService(slotElement);

    render(<DetailContent itemId="noUrlSlot" dataService={slotDataService} />);

    // CURIE should be rendered as text, not a link (no slotUrl provided)
    expect(screen.getByText('schema:identifier')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'schema:identifier' })).not.toBeInTheDocument();
  });
});
