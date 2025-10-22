import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ClassSection from '../components/ClassSection';
import type { ClassNode } from '../types';

describe('ClassSection', () => {
  const mockClasses: ClassNode[] = [
    {
      name: 'Entity',
      parent: null,
      abstract: true,
      description: 'Any resource that has its own identifier',
      attributes: {},
      slots: [],
      slot_usage: {},
      children: [
        {
          name: 'Person',
          parent: 'Entity',
          abstract: false,
          description: 'Administrative information about an individual',
          attributes: {
            species: {
              range: 'CellularOrganismSpeciesEnum',
              description: 'The species',
            },
          },
          slots: ['identity'],
          slot_usage: {},
          children: [],
        },
      ],
    },
  ];

  const mockPerson: ClassNode = mockClasses[0].children[0];
  const mockOnSelect = () => {};

  test('should render class hierarchy', () => {
    render(
      <ClassSection
        nodes={mockClasses}
        onSelectClass={mockOnSelect}
      />
    );

    // Should show the root class
    expect(screen.getByText('Entity')).toBeDefined();

    // Should show abstract label
    expect(screen.getByText('abstract')).toBeDefined();

    // Should show child class
    expect(screen.getByText('Person')).toBeDefined();
  });

  test('should highlight selected class', () => {
    const { container } = render(
      <ClassSection
        nodes={mockClasses}
        onSelectClass={mockOnSelect}
        selectedClass={mockPerson}
      />
    );

    // Find the Person element - it should have a highlight class
    const personButton = container.querySelector('[data-element-name="Person"]');
    expect(personButton).toBeDefined();
    expect(personButton?.className).toContain('bg-blue-100');
  });

  test('should add data attributes for element identification', () => {
    const { container } = render(
      <ClassSection
        nodes={mockClasses}
        onSelectClass={mockOnSelect}
      />
    );

    // Check for data attributes
    const entityElement = container.querySelector('[data-element-type="class"][data-element-name="Entity"]');
    expect(entityElement).toBeDefined();

    const personElement = container.querySelector('[data-element-type="class"][data-element-name="Person"]');
    expect(personElement).toBeDefined();
  });

  test('should render with empty class list', () => {
    render(
      <ClassSection
        nodes={[]}
        onSelectClass={mockOnSelect}
      />
    );

    // Should not crash, but won't have any class names to check
    expect(screen.queryByText('Entity')).toBeNull();
  });
});
