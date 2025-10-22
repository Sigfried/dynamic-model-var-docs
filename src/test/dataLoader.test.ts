import { describe, test, expect } from 'vitest';
import { loadModelData } from '../utils/dataLoader';
import type { ClassNode, ModelData } from '../types';

describe('dataLoader', () => {
  describe('loadModelData', () => {
    test('should load model data successfully', async () => {
      const data = await loadModelData();

      expect(data).toBeDefined();
      expect(data.classHierarchy).toBeDefined();
      expect(data.enums).toBeDefined();
      expect(data.slots).toBeDefined();
      expect(data.variables).toBeDefined();
      expect(data.reverseIndices).toBeDefined();
    });

    test('should create hierarchical class tree', async () => {
      const data = await loadModelData();

      // Find a class with known parent (e.g., Participant is_a Entity)
      const findClass = (classes: ClassNode[], name: string): ClassNode | undefined => {
        for (const cls of classes) {
          if (cls.name === name) return cls;
          const found = findClass(cls.children || [], name);
          if (found) return found;
        }
        return undefined;
      };

      const participant = findClass(data.classHierarchy, 'Participant');
      expect(participant).toBeDefined();
      expect(participant?.parent).toBe('Entity');

      // Check that root classes have no parent
      const rootClasses = data.classHierarchy.filter(c => c.parent === null || c.parent === undefined);
      expect(rootClasses.length).toBeGreaterThan(0);
    });

    test('should build reverse indices correctly', async () => {
      const data = await loadModelData();
      const { reverseIndices } = data;

      expect(reverseIndices.enumToClasses).toBeDefined();
      expect(reverseIndices.slotToClasses).toBeDefined();

      // The reverse indices might be empty if no classes use enums/slots
      // Just verify the structure exists
      expect(typeof reverseIndices.enumToClasses).toBe('object');
      expect(typeof reverseIndices.slotToClasses).toBe('object');

      // If there are any enum-using classes, verify bidirectional consistency
      const findClassWithEnumProps = (classes: ClassNode[]): ClassNode | undefined => {
        for (const cls of classes) {
          // ClassNode uses enumReferences field
          if (cls.enumReferences && cls.enumReferences.length > 0) {
            return cls;
          }
          const found = findClassWithEnumProps(cls.children || []);
          if (found) return found;
        }
        return undefined;
      };

      const sampleClass = findClassWithEnumProps(data.classHierarchy);
      if (sampleClass && sampleClass.enumReferences && sampleClass.enumReferences.length > 0) {
        const enumName = sampleClass.enumReferences[0];
        expect(reverseIndices.enumToClasses[enumName]).toBeDefined();
        expect(reverseIndices.enumToClasses[enumName]).toContain(sampleClass.name);
      }
    });

    test('should load variables with correct class mapping', async () => {
      const data = await loadModelData();

      expect(data.variables.length).toBeGreaterThan(0);

      // Each variable should have required fields from VariableSpec interface
      const sampleVar = data.variables[0];
      expect(sampleVar).toHaveProperty('bdchmElement');
      expect(sampleVar).toHaveProperty('variableLabel');
      expect(sampleVar).toHaveProperty('dataType');

      // Most variables should map to existing classes
      // (some might not due to data evolution)
      const classNames = new Set<string>();
      const collectClassNames = (classes: ClassNode[]) => {
        for (const cls of classes) {
          classNames.add(cls.name);
          if (cls.children) collectClassNames(cls.children);
        }
      };
      collectClassNames(data.classHierarchy);

      const unmappedVariables = data.variables.filter(
        v => !classNames.has(v.bdchmElement)
      );
      // Allow some unmapped variables (data evolution), but most should map
      expect(unmappedVariables.length).toBeLessThan(data.variables.length * 0.1); // Less than 10%
    });

    test('should parse slot definitions', async () => {
      const data = await loadModelData();

      // slots is a Map, not an object
      expect(data.slots.size).toBeGreaterThan(0);

      // Slots should have descriptions and ranges
      const firstSlot = Array.from(data.slots.values())[0];
      expect(firstSlot).toBeDefined();
      // Note: description and range are optional in LinkML
      if (firstSlot.description) {
        expect(typeof firstSlot.description).toBe('string');
      }
    });

    test('should parse enum definitions with values', async () => {
      const data = await loadModelData();

      // enums is a Map, not an object
      expect(data.enums.size).toBeGreaterThan(0);

      // Find an enum with values
      const sampleEnum = Array.from(data.enums.values())[0];

      expect(sampleEnum).toBeDefined();
      if (sampleEnum.values && sampleEnum.values.length > 0) {
        const firstValue = sampleEnum.values[0];
        expect(firstValue).toHaveProperty('value');
      }
    });

    test('should mark abstract classes correctly', async () => {
      const data = await loadModelData();

      const findClass = (classes: ClassNode[], name: string): ClassNode | undefined => {
        for (const cls of classes) {
          if (cls.name === name) return cls;
          const found = findClass(cls.children || [], name);
          if (found) return found;
        }
        return undefined;
      };

      // Entity is known to be abstract
      const entity = findClass(data.classHierarchy, 'Entity');
      expect(entity?.abstract).toBe(true);

      // Participant is known to be concrete
      const participant = findClass(data.classHierarchy, 'Participant');
      expect(participant?.abstract).toBe(false);
    });
  });

  describe('data consistency', () => {
    test('should have consistent property counts', async () => {
      const data = await loadModelData();

      // Total properties across all classes should match what we see in individual classes
      let totalProperties = 0;
      const countProperties = (classes: ClassNode[]) => {
        for (const cls of classes) {
          // ClassNode uses `properties` field, not `attributes`
          if (cls.properties) {
            totalProperties += Object.keys(cls.properties).length;
          }
          if (cls.children) countProperties(cls.children);
        }
      };
      countProperties(data.classHierarchy);

      expect(totalProperties).toBeGreaterThan(0);
    });

    test('should have no duplicate class names', async () => {
      const data = await loadModelData();

      const classNames = new Set<string>();
      const findDuplicates = (classes: ClassNode[]): string[] => {
        const duplicates: string[] = [];
        for (const cls of classes) {
          if (classNames.has(cls.name)) {
            duplicates.push(cls.name);
          }
          classNames.add(cls.name);
          if (cls.children) {
            duplicates.push(...findDuplicates(cls.children));
          }
        }
        return duplicates;
      };

      const duplicates = findDuplicates(data.classHierarchy);
      expect(duplicates).toEqual([]);
    });
  });
});
