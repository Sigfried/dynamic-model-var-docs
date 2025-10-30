/**
 * Tests for panel title generation and header color selection
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { getHeaderColor, getPanelTitle } from '../utils/panelHelpers';
import { ClassElement, EnumElement, SlotElement, VariableElement } from '../models/Element';

// Mock entities
const mockClassWithParent = new ClassElement({
  name: 'Specimen',
  description: 'A sample class',
  parent: 'Entity',
  abstract: false,
  attributes: {},
  slots: [],
  slot_usage: {}
}, new Map());

const mockClassWithoutParent = new ClassElement({
  name: 'Entity',
  description: 'Base class',
  parent: undefined,
  abstract: false,
  attributes: {},
  slots: [],
  slot_usage: {}
}, new Map());

const mockEnum = new EnumElement({
  name: 'SpecimenTypeEnum',
  description: 'Specimen types',
  permissible_values: []
});

const mockSlot = new SlotElement({
  name: 'identifier',
  description: 'A unique identifier',
  range: 'string',
  slot_uri: 'http://example.org/identifier',
  usedByClasses: []
});

const mockVariable = new VariableElement({
  bdchmElement: 'Specimen',
  variableLabel: 'specimen_type',
  dataType: 'string',
  ucumUnit: '',
  curie: '',
  variableDescription: 'The type of specimen'
});

describe('getHeaderColor', () => {
  it('returns blue color for class type', () => {
    const color = getHeaderColor('class');
    expect(color).toContain('bg-blue-700');
    expect(color).toContain('border-blue-800');
    expect(color).toContain('dark:bg-blue-700');
    expect(color).toContain('dark:border-blue-600');
  });

  it('returns purple color for enum type', () => {
    const color = getHeaderColor('enum');
    expect(color).toContain('bg-purple-700');
    expect(color).toContain('border-purple-800');
    expect(color).toContain('dark:bg-purple-700');
    expect(color).toContain('dark:border-purple-600');
  });

  it('returns green color for slot type', () => {
    const color = getHeaderColor('slot');
    expect(color).toContain('bg-green-700');
    expect(color).toContain('border-green-800');
    expect(color).toContain('dark:bg-green-700');
    expect(color).toContain('dark:border-green-600');
  });

  it('returns orange color for variable type', () => {
    const color = getHeaderColor('variable');
    expect(color).toContain('bg-orange-600');
    expect(color).toContain('border-orange-700');
    expect(color).toContain('dark:bg-orange-600');
    expect(color).toContain('dark:border-orange-500');
  });

  it('returns string with both light and dark mode variants', () => {
    const color = getHeaderColor('class');
    expect(color).toMatch(/dark:/);
  });
});

describe('getPanelTitle', () => {
  describe('ClassNode', () => {
    it('renders class title with parent', () => {
      const title = getPanelTitle(mockClassWithParent, 'class');
      const { container } = render(title);

      expect(container.textContent).toContain('Class:');
      expect(container.textContent).toContain('Specimen');
      expect(container.textContent).toContain('extends Entity');
    });

    it('renders class title without parent', () => {
      const title = getPanelTitle(mockClassWithoutParent, 'class');
      const { container } = render(title);

      expect(container.textContent).toContain('Class:');
      expect(container.textContent).toContain('Entity');
      expect(container.textContent).not.toContain('extends');
    });

    it('applies correct styling classes', () => {
      const title = getPanelTitle(mockClassWithParent, 'class');
      const { container } = render(title);

      const span = container.querySelector('span');
      expect(span?.className).toContain('text-base');

      // Check for bold elements
      const boldElements = container.querySelectorAll('.font-bold');
      expect(boldElements.length).toBeGreaterThan(0);
    });
  });

  describe('EnumDefinition', () => {
    it('renders enum name without "Enum:" prefix', () => {
      const title = getPanelTitle(mockEnum, 'enum');
      const { container } = render(title);

      expect(container.textContent).toBe('SpecimenTypeEnum');
      expect(container.textContent).not.toContain('Enum:');
    });

    it('applies bold and text-base classes', () => {
      const title = getPanelTitle(mockEnum, 'enum');
      const { container } = render(title);

      const span = container.querySelector('span');
      expect(span?.className).toContain('text-base');
      expect(span?.className).toContain('font-bold');
    });
  });

  describe('SlotDefinition', () => {
    it('renders slot title with "Slot:" prefix', () => {
      const title = getPanelTitle(mockSlot, 'slot');
      const { container } = render(title);

      expect(container.textContent).toContain('Slot:');
      expect(container.textContent).toContain('identifier');
    });

    it('applies correct styling', () => {
      const title = getPanelTitle(mockSlot, 'slot');
      const { container } = render(title);

      const span = container.querySelector('span');
      expect(span?.className).toContain('text-base');

      const boldElements = container.querySelectorAll('.font-bold');
      expect(boldElements.length).toBe(2); // "Slot:" and slot name
    });
  });

  describe('VariableSpec', () => {
    it('renders variable title with "Variable:" prefix', () => {
      const title = getPanelTitle(mockVariable, 'variable');
      const { container } = render(title);

      expect(container.textContent).toContain('Variable:');
      expect(container.textContent).toContain('specimen_type');
    });

    it('applies correct styling', () => {
      const title = getPanelTitle(mockVariable, 'variable');
      const { container } = render(title);

      const span = container.querySelector('span');
      expect(span?.className).toContain('text-base');

      const boldElements = container.querySelectorAll('.font-bold');
      expect(boldElements.length).toBe(2); // "Variable:" and variable label
    });
  });

  describe('JSX Structure', () => {
    it('returns ReactElement for all element types', () => {
      expect(getPanelTitle(mockClassWithParent, 'class')).toBeDefined();
      expect(getPanelTitle(mockEnum, 'enum')).toBeDefined();
      expect(getPanelTitle(mockSlot, 'slot')).toBeDefined();
      expect(getPanelTitle(mockVariable, 'variable')).toBeDefined();
    });

    it('renders valid JSX that can be rendered by React', () => {
      const elements: Array<{ element: typeof mockClassWithParent | typeof mockEnum | typeof mockSlot | typeof mockVariable; type: 'class' | 'enum' | 'slot' | 'variable' }> = [
        { element: mockClassWithParent, type: 'class' },
        { element: mockEnum, type: 'enum' },
        { element: mockSlot, type: 'slot' },
        { element: mockVariable, type: 'variable' }
      ];

      elements.forEach(({ element, type }) => {
        const title = getPanelTitle(element, type);
        expect(() => render(title)).not.toThrow();
      });
    });
  });
});
