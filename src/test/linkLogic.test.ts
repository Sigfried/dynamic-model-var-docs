import { describe, test, expect } from 'vitest';
import { ClassElement, EnumElement, SlotElement, VariableElement, type Relationship } from '../models/Element';
import type { ClassMetadata, EnumMetadata, SlotMetadata, VariableSpec, ModelData } from '../types';

/**
 * Link Logic Tests
 *
 * Tests the pure logic for determining which elements should be linked
 * and how those links should be filtered/displayed.
 */

// Helper to create minimal ModelData for testing
const createMockModelData = (): ModelData => ({
  collections: new Map(),
  elementLookup: new Map(),
});

describe('Element Relationship Detection', () => {
  describe('ClassElement relationships', () => {
    test('should detect inheritance relationship', () => {
      const childClass: ClassMetadata = {
        name: 'Participant',
        parent: 'Entity',
        description: 'A participant in a study',
        abstract: false,
        attributes: {},
      };

      const element = new ClassElement(childClass, createMockModelData());
      const rels = element.getRelationships();

      const inheritRel = rels.find(r => r.type === 'inherits');
      expect(inheritRel).toBeDefined();
      expect(inheritRel?.target).toBe('Entity');
      expect(inheritRel?.targetType).toBe('class');
      expect(inheritRel?.isSelfRef).toBe(false);
    });

    test('should not have inheritance relationship for root classes', () => {
      const rootClass: ClassMetadata = {
        name: 'Entity',
        parent: undefined,
        description: 'Root entity',
        abstract: true,
        attributes: {},
      };

      const element = new ClassElement(rootClass, createMockModelData());
      const rels = element.getRelationships();

      const inheritRel = rels.find(r => r.type === 'inherits');
      expect(inheritRel).toBeUndefined();
    });

    test('should detect enum property relationships', () => {
      const classWithEnum: ClassMetadata = {
        name: 'Specimen',
        parent: 'Entity',
        description: 'A specimen',
        abstract: false,
        attributes: {
          specimen_type: {
            range: 'SpecimenTypeEnum',
            description: 'The type of specimen',
          },
        },
      };

      const element = new ClassElement(classWithEnum, createMockModelData());
      const rels = element.getRelationships();

      const enumRel = rels.find(r => r.target === 'SpecimenTypeEnum');
      expect(enumRel).toBeDefined();
      expect(enumRel?.type).toBe('property');
      expect(enumRel?.label).toBe('specimen_type');
      expect(enumRel?.targetType).toBe('enum');
      expect(enumRel?.isSelfRef).toBe(false);
    });

    test('should detect class property relationships', () => {
      const classWithClassRef: ClassMetadata = {
        name: 'Condition',
        parent: 'Entity',
        description: 'A condition',
        abstract: false,
        attributes: {
          associated_participant: {
            range: 'Participant',
            description: 'Associated participant',
          },
        },
      };

      const element = new ClassElement(classWithClassRef, createMockModelData());
      const rels = element.getRelationships();

      const classRel = rels.find(r => r.target === 'Participant');
      expect(classRel).toBeDefined();
      expect(classRel?.type).toBe('property');
      expect(classRel?.label).toBe('associated_participant');
      expect(classRel?.targetType).toBe('class');
    });

    test('should ignore primitive property types', () => {
      const classWithPrimitives: ClassMetadata = {
        name: 'Person',
        parent: 'Entity',
        description: 'A person',
        abstract: false,
        attributes: {
          name: { range: 'string', description: 'Name' },
          age: { range: 'integer', description: 'Age' },
          active: { range: 'boolean', description: 'Active status' },
        },
      };

      const element = new ClassElement(classWithPrimitives, createMockModelData());
      const rels = element.getRelationships();

      // Should only have inheritance, no property relationships
      expect(rels.filter(r => r.type === 'property').length).toBe(0);
    });

    test('should detect self-referential relationships', () => {
      const selfRefClass: ClassMetadata = {
        name: 'Specimen',
        parent: 'Entity',
        description: 'A specimen',
        abstract: false,
        attributes: {
          parent_specimen: {
            range: 'Specimen',
            description: 'Parent specimen',
          },
        },
      };

      const element = new ClassElement(selfRefClass, createMockModelData());
      const rels = element.getRelationships();

      const selfRel = rels.find(r => r.target === 'Specimen');
      expect(selfRel).toBeDefined();
      expect(selfRel?.isSelfRef).toBe(true);
    });

    test('should handle multiple relationships', () => {
      const complexClass: ClassMetadata = {
        name: 'MeasurementObservation',
        parent: 'Observation',
        description: 'A measurement observation',
        abstract: false,
        attributes: {
          observation_type: { range: 'MeasurementObservationTypeEnum' },
          value_quantity: { range: 'Quantity' },
          focus_of: { range: 'Participant' },
        },
      };

      const element = new ClassElement(complexClass, createMockModelData());
      const rels = element.getRelationships();

      // Should have 1 inheritance + 3 property relationships
      expect(rels.length).toBe(4);
      expect(rels.filter(r => r.type === 'inherits').length).toBe(1);
      expect(rels.filter(r => r.type === 'property').length).toBe(3);
    });
  });

  describe('SlotElement relationships', () => {
    test('should detect slot range relationships for enum', () => {
      const slotWithEnum: SlotMetadata = {
        description: 'Species',
        range: 'CellularOrganismSpeciesEnum',
      };

      const element = new SlotElement('species', slotWithEnum);
      const rels = element.getRelationships();

      expect(rels.length).toBe(1);
      expect(rels[0].target).toBe('CellularOrganismSpeciesEnum');
      expect(rels[0].targetType).toBe('enum');
    });

    test('should detect slot range relationships for class', () => {
      const slotWithClass: SlotMetadata = {
        description: 'Associated participant',
        range: 'Participant',
      };

      const element = new SlotElement('associated_participant', slotWithClass);
      const rels = element.getRelationships();

      expect(rels.length).toBe(1);
      expect(rels[0].target).toBe('Participant');
      expect(rels[0].targetType).toBe('class');
    });

    test('should not create relationships for primitive ranges', () => {
      const slotWithPrimitive: SlotMetadata = {
        description: 'Identifier',
        range: 'string',
      };

      const element = new SlotElement('id', slotWithPrimitive);
      const rels = element.getRelationships();

      expect(rels.length).toBe(0);
    });

    test('should handle slots without range', () => {
      const slotNoRange: SlotMetadata = {
        description: 'Description field',
      };

      const element = new SlotElement('description', slotNoRange);
      const rels = element.getRelationships();

      expect(rels.length).toBe(0);
    });
  });

  describe('VariableElement relationships', () => {
    test('should link to mapped class', () => {
      const variable: VariableSpec = {
        bdchmElement: 'MeasurementObservation',
        variableLabel: 'height',
        dataType: 'float',
        ucumUnit: 'cm',
        curie: 'LOINC:8302-2',
        variableDescription: 'Body height',
      };

      const element = new VariableElement(variable);
      const rels = element.getRelationships();

      expect(rels.length).toBe(1);
      expect(rels[0].type).toBe('property');
      expect(rels[0].target).toBe('MeasurementObservation');
      expect(rels[0].targetType).toBe('class');
      expect(rels[0].isSelfRef).toBe(false);
    });
  });

  describe('EnumElement relationships', () => {
    test('should have no outgoing relationships', () => {
      const enumDef: EnumMetadata = {
        description: 'Sex values',
        permissible_values: {
          male: { description: 'Male' },
          female: { description: 'Female' },
        },
      };

      const element = new EnumElement('SexEnum', enumDef);
      const rels = element.getRelationships();

      expect(rels.length).toBe(0);
    });
  });
});

describe('Link Filtering Logic', () => {
  // Helper function to create mock relationships
  const createMockRelationships = (): Relationship[] => [
    { type: 'inherits', target: 'Entity', targetType: 'class', isSelfRef: false },
    { type: 'property', label: 'species', target: 'SpeciesEnum', targetType: 'enum', isSelfRef: false },
    { type: 'property', label: 'participant', target: 'Participant', targetType: 'class', isSelfRef: false },
    { type: 'property', label: 'parent', target: 'Specimen', targetType: 'class', isSelfRef: true },
  ];

  describe('filterRelationshipsByType', () => {
    test('should filter to only inheritance relationships', () => {
      const rels = createMockRelationships();
      const filtered = rels.filter(r => r.type === 'inherits');

      expect(filtered.length).toBe(1);
      expect(filtered[0].target).toBe('Entity');
    });

    test('should filter to only property relationships', () => {
      const rels = createMockRelationships();
      const filtered = rels.filter(r => r.type === 'property');

      expect(filtered.length).toBe(3);
    });

    test('should filter to only enum relationships', () => {
      const rels = createMockRelationships();
      const filtered = rels.filter(r => r.targetType === 'enum');

      expect(filtered.length).toBe(1);
      expect(filtered[0].target).toBe('SpeciesEnum');
    });

    test('should filter to only class relationships', () => {
      const rels = createMockRelationships();
      const filtered = rels.filter(r => r.targetType === 'class');

      expect(filtered.length).toBe(3);
    });
  });

  describe('filterSelfReferential', () => {
    test('should exclude self-referential links', () => {
      const rels = createMockRelationships();
      const filtered = rels.filter(r => !r.isSelfRef);

      expect(filtered.length).toBe(3);
      expect(filtered.every(r => !r.isSelfRef)).toBe(true);
    });

    test('should include only self-referential links', () => {
      const rels = createMockRelationships();
      const filtered = rels.filter(r => r.isSelfRef);

      expect(filtered.length).toBe(1);
      expect(filtered[0].target).toBe('Specimen');
    });
  });

  describe('filterByVisibleElements', () => {
    test('should only include links where target is visible', () => {
      const rels = createMockRelationships();
      const visibleElements = new Set(['Entity', 'SpeciesEnum']); // Only these are visible

      const filtered = rels.filter(r => visibleElements.has(r.target));

      expect(filtered.length).toBe(2);
      expect(filtered.map(r => r.target).sort()).toEqual(['Entity', 'SpeciesEnum']);
    });

    test('should return empty array when no targets are visible', () => {
      const rels = createMockRelationships();
      const visibleElements = new Set<string>(); // Nothing visible

      const filtered = rels.filter(r => visibleElements.has(r.target));

      expect(filtered.length).toBe(0);
    });

    test('should include all links when all targets are visible', () => {
      const rels = createMockRelationships();
      const visibleElements = new Set(['Entity', 'SpeciesEnum', 'Participant', 'Specimen']);

      const filtered = rels.filter(r => visibleElements.has(r.target));

      expect(filtered.length).toBe(4);
    });
  });

  describe('combined filtering', () => {
    test('should filter by type AND visibility', () => {
      const rels = createMockRelationships();
      const visibleElements = new Set(['Entity', 'Participant']);

      const filtered = rels
        .filter(r => r.targetType === 'class') // Only class relationships
        .filter(r => visibleElements.has(r.target)); // Only visible

      expect(filtered.length).toBe(2);
      expect(filtered.map(r => r.target).sort()).toEqual(['Entity', 'Participant']);
    });

    test('should filter excluding self-refs AND by visibility', () => {
      const rels = createMockRelationships();
      const visibleElements = new Set(['Entity', 'Participant', 'Specimen']);

      const filtered = rels
        .filter(r => !r.isSelfRef) // No self-refs
        .filter(r => visibleElements.has(r.target)); // Only visible

      expect(filtered.length).toBe(2);
      expect(filtered.map(r => r.target).sort()).toEqual(['Entity', 'Participant']);
    });
  });
});

describe('Link Data Structures', () => {
  describe('Link interface', () => {
    test('should represent a link between two elements', () => {
      interface Link {
        source: { type: string; name: string };
        target: { type: string; name: string };
        relationship: Relationship;
      }

      const link: Link = {
        source: { type: 'class', name: 'Participant' },
        target: { type: 'class', name: 'Entity' },
        relationship: {
          type: 'inherits',
          target: 'Entity',
          targetType: 'class',
          isSelfRef: false,
        },
      };

      expect(link.source.name).toBe('Participant');
      expect(link.target.name).toBe('Entity');
      expect(link.relationship.type).toBe('inherits');
    });
  });

  describe('buildLinks helper', () => {
    test('should convert element relationships to link objects', () => {
      // Mock element with relationships
      const sourceElement = {
        type: 'class' as const,
        name: 'Specimen',
      };

      const relationships: Relationship[] = [
        { type: 'inherits', target: 'Entity', targetType: 'class', isSelfRef: false },
        { type: 'property', label: 'species', target: 'SpeciesEnum', targetType: 'enum', isSelfRef: false },
      ];

      // Build links
      const links = relationships.map(rel => ({
        source: { type: sourceElement.type, name: sourceElement.name },
        target: { type: rel.targetType, name: rel.target },
        relationship: rel,
      }));

      expect(links.length).toBe(2);
      expect(links[0].source.name).toBe('Specimen');
      expect(links[0].target.name).toBe('Entity');
      expect(links[1].target.name).toBe('SpeciesEnum');
    });
  });
});
