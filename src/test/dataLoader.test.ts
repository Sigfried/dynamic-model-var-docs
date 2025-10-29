import { describe, test, expect } from 'vitest';
import { loadModelData } from '../utils/dataLoader';
import { ClassCollection, EnumCollection, SlotCollection, VariableCollection } from '../models/Element';

describe('dataLoader', () => {
  describe('loadModelData', () => {
    test('should load model data successfully', async () => {
      const data = await loadModelData();

      expect(data).toBeDefined();
      expect(data.collections).toBeDefined();

      const classCollection = data.collections.get('class');
      const enumCollection = data.collections.get('enum');
      const slotCollection = data.collections.get('slot');
      const variableCollection = data.collections.get('variable');

      expect(classCollection).toBeDefined();
      expect(enumCollection).toBeDefined();
      expect(slotCollection).toBeDefined();
      expect(variableCollection).toBeDefined();
    });

    test('should create hierarchical class tree', async () => {
      const data = await loadModelData();

      const classCollection = data.collections.get('class') as ClassCollection;
      const rootElements = classCollection.getRootElements();

      // getRootElements() returns ClassElement[], test that it's hierarchical by using getAllElements
      const allClasses = classCollection.getAllElements();

      // Find a class with known parent (e.g., Participant is_a Entity)
      const participant = allClasses.find(c => c.name === 'Participant');
      expect(participant).toBeDefined();
      expect(participant?.parent).toBe('Entity');

      // Check that root classes have no parent
      const rootClasses = rootElements.filter(c => c.parent === null || c.parent === undefined);
      expect(rootClasses.length).toBeGreaterThan(0);
    });

    test('should load variables with correct class mapping', async () => {
      const data = await loadModelData();

      const variableCollection = data.collections.get('variable') as VariableCollection;
      const variables = variableCollection.getAllElements();

      expect(variables.length).toBeGreaterThan(0);

      // Each variable should have required fields from VariableElement
      const sampleVar = variables[0];
      expect(sampleVar).toHaveProperty('bdchmElement');
      expect(sampleVar).toHaveProperty('name');  // maps from variableLabel
      expect(sampleVar).toHaveProperty('dataType');

      // Most variables should map to existing classes
      // (some might not due to data evolution)
      const classCollection = data.collections.get('class') as ClassCollection;
      const allClasses = classCollection.getAllElements();
      const classNames = new Set(allClasses.map(c => c.name));

      const unmappedVariables = variables.filter(
        v => !classNames.has(v.bdchmElement)
      );
      // Allow some unmapped variables (data evolution), but most should map
      expect(unmappedVariables.length).toBeLessThan(variables.length * 0.1); // Less than 10%
    });

    test('should parse slot definitions', async () => {
      const data = await loadModelData();

      const slotCollection = data.collections.get('slot') as SlotCollection;
      const slots = slotCollection.getSlots();

      // slots is a Map, not an object
      expect(slots.size).toBeGreaterThan(0);

      // Slots should have descriptions and ranges
      const firstSlot = Array.from(slots.values())[0];
      expect(firstSlot).toBeDefined();
      // Note: description and range are optional in LinkML
      if (firstSlot.description) {
        expect(typeof firstSlot.description).toBe('string');
      }
    });

    test('should parse enum definitions with values', async () => {
      const data = await loadModelData();

      const enumCollection = data.collections.get('enum') as EnumCollection;
      const enums = enumCollection.getAllElements();

      // enums should have values
      expect(enums.length).toBeGreaterThan(0);

      // Find an enum with values
      const sampleEnum = enums[0];

      expect(sampleEnum).toBeDefined();
      if (sampleEnum.values && sampleEnum.values.length > 0) {
        const firstValue = sampleEnum.values[0];
        expect(firstValue).toHaveProperty('value');
      }
    });

    test('should mark abstract classes correctly', async () => {
      const data = await loadModelData();

      const classCollection = data.collections.get('class') as ClassCollection;
      const allClasses = classCollection.getAllElements();

      // Entity is known to be abstract
      const entity = allClasses.find(c => c.name === 'Entity');
      expect(entity?.abstract).toBe(true);

      // Participant is known to be concrete
      const participant = allClasses.find(c => c.name === 'Participant');
      expect(participant?.abstract).toBe(false);
    });
  });

  describe('data consistency', () => {
    test('should have consistent property counts', async () => {
      const data = await loadModelData();

      const classCollection = data.collections.get('class') as ClassCollection;
      const allClasses = classCollection.getAllElements();

      // Total properties across all classes should be greater than 0
      let totalProperties = 0;
      for (const cls of allClasses) {
        // ClassElement uses `properties` field
        if (cls.properties) {
          totalProperties += Object.keys(cls.properties).length;
        }
      }

      expect(totalProperties).toBeGreaterThan(0);
    });

    test('should have no duplicate class names', async () => {
      const data = await loadModelData();

      const classCollection = data.collections.get('class') as ClassCollection;
      const allClasses = classCollection.getAllElements();

      const classNames = new Set<string>();
      const duplicates: string[] = [];
      for (const cls of allClasses) {
        if (classNames.has(cls.name)) {
          duplicates.push(cls.name);
        }
        classNames.add(cls.name);
      }

      expect(duplicates).toEqual([]);
    });
  });
});
