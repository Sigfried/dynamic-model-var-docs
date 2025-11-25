import { describe, test, expect, beforeAll } from 'vitest';
import { loadModelData } from '../utils/dataLoader';
import { ClassCollection, ClassElement } from '../models/Element';
import type { ModelData } from '../models/ModelData';

/**
 * Test for incoming relationships bug
 *
 * Bug report: DimensionalObservationSet shows "0 incoming" in hover box
 * but has visible incoming link from Specimen.dimensional_measures
 *
 * This test verifies that computeIncomingRelationships() correctly identifies
 * incoming relationships from class attributes.
 */

describe('Incoming Relationships', () => {
  let modelData: ModelData;
  let classCollection: ClassCollection;

  beforeAll(async () => {
    modelData = await loadModelData();
    classCollection = modelData.collections.get('class') as ClassCollection;
  });

  test('DimensionalObservationSet should show incoming relationship from Specimen.dimensional_measures', () => {
    // Get the elements
    const specimen = classCollection.getElement('Specimen') as ClassElement;
    const dimObsSet = classCollection.getElement('DimensionalObservationSet') as ClassElement;

    // Verify elements exist
    expect(specimen).toBeDefined();
    expect(dimObsSet).toBeDefined();

    // Check that Specimen has dimensional_measures attribute
    const dimMeasuresSlot = specimen.classSlots.find(
      slot => slot.name === 'dimensional_measures'
    );
    expect(dimMeasuresSlot).toBeDefined();
    expect(dimMeasuresSlot?.range).toBe('DimensionalObservationSet');

    // Get relationship data for DimensionalObservationSet
    const relationshipData = dimObsSet.getRelationshipData();

    // Verify incoming relationships
    expect(relationshipData.incoming).toBeDefined();
    expect(relationshipData.incoming.usedByAttributes).toBeDefined();

    // Should have at least one incoming relationship from Specimen
    const fromSpecimen = relationshipData.incoming.usedByAttributes.find(
      attr => attr.className === 'Specimen' && attr.attributeName === 'dimensional_measures'
    );

    expect(fromSpecimen).toBeDefined();
    expect(fromSpecimen?.className).toBe('Specimen');
    expect(fromSpecimen?.attributeName).toBe('dimensional_measures');
    expect(fromSpecimen?.sourceSection).toBe('class');
  });

  test('computeIncomingRelationships should find all incoming class attribute references', () => {
    // Test a few other known relationships
    const specimen = classCollection.getElement('Specimen') as ClassElement;
    const relationshipData = specimen.getRelationshipData();

    // Specimen should have incoming relationships (it's referenced by many classes)
    expect(relationshipData.incoming.usedByAttributes.length).toBeGreaterThan(0);
  });

  test('incoming relationships count should match visible links', () => {
    const dimObsSet = classCollection.getElement('DimensionalObservationSet') as ClassElement;
    const relationshipData = dimObsSet.getRelationshipData();

    // Count total incoming relationships
    const totalIncoming =
      relationshipData.incoming.subclasses.length +
      relationshipData.incoming.usedByAttributes.length +
      relationshipData.incoming.variables.length;

    // Should have at least 1 incoming relationship
    expect(totalIncoming).toBeGreaterThan(0);

    console.log(`DimensionalObservationSet incoming relationships:`);
    console.log(`  Subclasses: ${relationshipData.incoming.subclasses.length}`);
    console.log(`  Used by attributes: ${relationshipData.incoming.usedByAttributes.length}`);
    console.log(`  Variables: ${relationshipData.incoming.variables.length}`);
    console.log(`  Total: ${totalIncoming}`);
  });

  test('DimensionalObservationSet should show all inherited slots from ancestors', () => {
    const dimObsSet = classCollection.getElement('DimensionalObservationSet') as ClassElement;
    const relationshipData = dimObsSet.getRelationshipData();

    // Should have inherited slots
    expect(relationshipData.outgoing.inheritedSlots).toBeDefined();
    expect(relationshipData.outgoing.inheritedSlots.length).toBeGreaterThan(0);

    console.log(`DimensionalObservationSet ancestors with inherited slots:`);
    for (const group of relationshipData.outgoing.inheritedSlots) {
      console.log(`  ${group.ancestorName}: ${group.slots.length} slots`);
      console.log(`    Slots: ${group.slots.map(s => s.attributeName).join(', ')}`);
    }

    // Find ObservationSet in inherited slots
    const obsSetInherited = relationshipData.outgoing.inheritedSlots.find(
      group => group.ancestorName === 'ObservationSet'
    );
    expect(obsSetInherited).toBeDefined();
    expect(obsSetInherited!.slots.length).toBeGreaterThanOrEqual(7);

    // Verify that ObservationSet slots are included
    const obsSetSlotNames = obsSetInherited!.slots.map(s => s.attributeName);
    expect(obsSetSlotNames).toContain('category'); // primitive: string
    expect(obsSetSlotNames).toContain('focus'); // non-primitive: Entity

    // Find Entity in inherited slots (id comes from Entity)
    const entityInherited = relationshipData.outgoing.inheritedSlots.find(
      group => group.ancestorName === 'Entity'
    );

    if (entityInherited) {
      const entitySlotNames = entityInherited.slots.map(s => s.attributeName);
      console.log(`  Entity slots include 'id': ${entitySlotNames.includes('id')}`);
      expect(entitySlotNames).toContain('id'); // primitive: uriorcurie
    } else {
      console.log(`  WARNING: Entity not in inherited slots list`);
    }
  });
});
