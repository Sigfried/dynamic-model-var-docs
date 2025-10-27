/**
 * Tests for panel title generation and header color selection
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { getHeaderColor, getPanelTitle } from '../utils/panelHelpers';
import type { ClassNode, EnumDefinition, SlotDefinition, VariableSpec } from '../types';

// Mock entities
const mockClassWithParent: ClassNode = {
  name: 'Specimen',
  description: 'A sample class',
  attributes: {},
  children: [],
  slots: [],
  slot_usage: {},
  abstract: false,
  parent: 'Entity'
};

const mockClassWithoutParent: ClassNode = {
  name: 'Entity',
  description: 'Base class',
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

describe('getHeaderColor', () => {
  it('returns blue color for ClassNode', () => {
    const color = getHeaderColor(mockClassWithParent);
    expect(color).toContain('bg-blue-700');
    expect(color).toContain('border-blue-800');
    expect(color).toContain('dark:bg-blue-700');
    expect(color).toContain('dark:border-blue-600');
  });

  it('returns purple color for EnumDefinition', () => {
    const color = getHeaderColor(mockEnum);
    expect(color).toContain('bg-purple-700');
    expect(color).toContain('border-purple-800');
    expect(color).toContain('dark:bg-purple-700');
    expect(color).toContain('dark:border-purple-600');
  });

  it('returns green color for SlotDefinition', () => {
    const color = getHeaderColor(mockSlot);
    expect(color).toContain('bg-green-700');
    expect(color).toContain('border-green-800');
    expect(color).toContain('dark:bg-green-700');
    expect(color).toContain('dark:border-green-600');
  });

  it('returns orange color for VariableSpec', () => {
    const color = getHeaderColor(mockVariable);
    expect(color).toContain('bg-orange-600');
    expect(color).toContain('border-orange-700');
    expect(color).toContain('dark:bg-orange-600');
    expect(color).toContain('dark:border-orange-500');
  });

  it('returns string with both light and dark mode variants', () => {
    const color = getHeaderColor(mockClassWithParent);
    expect(color).toMatch(/dark:/);
  });
});

describe('getPanelTitle', () => {
  describe('ClassNode', () => {
    it('renders class title with parent', () => {
      const title = getPanelTitle(mockClassWithParent);
      const { container } = render(title);

      expect(container.textContent).toContain('Class:');
      expect(container.textContent).toContain('Specimen');
      expect(container.textContent).toContain('extends Entity');
    });

    it('renders class title without parent', () => {
      const title = getPanelTitle(mockClassWithoutParent);
      const { container } = render(title);

      expect(container.textContent).toContain('Class:');
      expect(container.textContent).toContain('Entity');
      expect(container.textContent).not.toContain('extends');
    });

    it('applies correct styling classes', () => {
      const title = getPanelTitle(mockClassWithParent);
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
      const title = getPanelTitle(mockEnum);
      const { container } = render(title);

      expect(container.textContent).toBe('SpecimenTypeEnum');
      expect(container.textContent).not.toContain('Enum:');
    });

    it('applies bold and text-base classes', () => {
      const title = getPanelTitle(mockEnum);
      const { container } = render(title);

      const span = container.querySelector('span');
      expect(span?.className).toContain('text-base');
      expect(span?.className).toContain('font-bold');
    });
  });

  describe('SlotDefinition', () => {
    it('renders slot title with "Slot:" prefix', () => {
      const title = getPanelTitle(mockSlot);
      const { container } = render(title);

      expect(container.textContent).toContain('Slot:');
      expect(container.textContent).toContain('identifier');
    });

    it('applies correct styling', () => {
      const title = getPanelTitle(mockSlot);
      const { container } = render(title);

      const span = container.querySelector('span');
      expect(span?.className).toContain('text-base');

      const boldElements = container.querySelectorAll('.font-bold');
      expect(boldElements.length).toBe(2); // "Slot:" and slot name
    });
  });

  describe('VariableSpec', () => {
    it('renders variable title with "Variable:" prefix', () => {
      const title = getPanelTitle(mockVariable);
      const { container } = render(title);

      expect(container.textContent).toContain('Variable:');
      expect(container.textContent).toContain('specimen_type');
    });

    it('applies correct styling', () => {
      const title = getPanelTitle(mockVariable);
      const { container } = render(title);

      const span = container.querySelector('span');
      expect(span?.className).toContain('text-base');

      const boldElements = container.querySelectorAll('.font-bold');
      expect(boldElements.length).toBe(2); // "Variable:" and variable label
    });
  });

  describe('JSX Structure', () => {
    it('returns ReactElement for all element types', () => {
      expect(getPanelTitle(mockClassWithParent)).toBeDefined();
      expect(getPanelTitle(mockEnum)).toBeDefined();
      expect(getPanelTitle(mockSlot)).toBeDefined();
      expect(getPanelTitle(mockVariable)).toBeDefined();
    });

    it('renders valid JSX that can be rendered by React', () => {
      const elements = [mockClassWithParent, mockEnum, mockSlot, mockVariable];

      elements.forEach(element => {
        const title = getPanelTitle(element);
        expect(() => render(title)).not.toThrow();
      });
    });
  });
});
