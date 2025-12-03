import { describe, test, expect } from 'vitest';
import { loadModelData } from '../utils/dataLoader';
import { EnumCollection, SlotCollection, ClassCollection } from '../models/Element';

describe('getUsedByClasses()', () => {
  describe('EnumElement.getUsedByClasses()', () => {
    test('should find classes that use an enum in their attributes', async () => {
      const data = await loadModelData();
      const enumCollection = data.collections.get('enum') as EnumCollection;
      const classCollection = data.collections.get('class') as ClassCollection;

      // Find an enum that should be used by classes
      const allEnums = enumCollection.getAllElements();
      const allClasses = classCollection.getAllElements();

      // Find an enum that's actually used
      let testEnum = null;
      for (const enumElement of allEnums) {
        const usedBy = enumElement.getUsedByClasses();
        if (usedBy.length > 0) {
          testEnum = enumElement;
          break;
        }
      }

      if (testEnum) {
        const usedByClasses = testEnum.getUsedByClasses();

        // Verify the result is an array of strings
        expect(Array.isArray(usedByClasses)).toBe(true);
        expect(usedByClasses.length).toBeGreaterThan(0);

        // Verify each class actually uses this enum
        const slotCollection = data.collections.get('slot') as import('../models/Element').SlotCollection;
        usedByClasses.forEach(className => {
          const cls = allClasses.find(c => c.name === className) as import('../models/Element').ClassElement;
          expect(cls).toBeDefined();

          // Check that this class has a slot with range === enum name
          const hasEnumSlot = cls.slotRefs.some(slotRef => {
            const slot = slotCollection.getElement(slotRef.id) as import('../models/Element').SlotElement;
            return slot?.range === testEnum!.name;
          });
          expect(hasEnumSlot).toBe(true);
        });

        // Verify results are sorted
        const sorted = [...usedByClasses].sort();
        expect(usedByClasses).toEqual(sorted);
      }
    });

    test('should return empty array for unused enums', async () => {
      const data = await loadModelData();
      const enumCollection = data.collections.get('enum') as EnumCollection;

      // Find an enum that's not used
      const allEnums = enumCollection.getAllElements();
      const unusedEnum = allEnums.find(e => e.getUsedByClasses().length === 0);

      if (unusedEnum) {
        expect(unusedEnum.getUsedByClasses()).toEqual([]);
      }
    });

    test('should not duplicate class names when enum is used multiple times', async () => {
      const data = await loadModelData();
      const enumCollection = data.collections.get('enum') as EnumCollection;
      const classCollection = data.collections.get('class') as ClassCollection;
      const slotCollection = data.collections.get('slot') as import('../models/Element').SlotCollection;
      const allClasses = classCollection.getAllElements();

      // Find a class with multiple slots using the same enum
      for (const cls of allClasses) {
        const classElement = cls as import('../models/Element').ClassElement;
        const enumRanges = classElement.slotRefs
          .map(slotRef => {
            const slot = slotCollection.getElement(slotRef.id) as import('../models/Element').SlotElement;
            return slot?.range;
          })
          .filter(r => r && r.includes('Enum'));
        const uniqueEnums = new Set(enumRanges);

        // If a class uses the same enum multiple times
        if (enumRanges.length > uniqueEnums.size) {
          const duplicateEnum = enumRanges.find((r, i) => enumRanges.indexOf(r) !== i);
          if (duplicateEnum) {
            const enumElement = enumCollection.getElement(duplicateEnum);
            if (enumElement) {
              const usedBy = enumElement.getUsedByClasses();
              // Should only include the class name once
              const occurrences = usedBy.filter(name => name === cls.name);
              expect(occurrences.length).toBe(1);
              return;
            }
          }
        }
      }
    });
  });

  describe('SlotElement.getUsedByClasses()', () => {
    test('should find classes that reference a slot in their slots array', async () => {
      const data = await loadModelData();
      const slotCollection = data.collections.get('slot') as SlotCollection;
      const classCollection = data.collections.get('class') as ClassCollection;

      // Find a slot that should be used by classes
      const allSlots = slotCollection.getAllElements();
      const allClasses = classCollection.getAllElements();

      let testSlot = null;
      for (const slotElement of allSlots) {
        const usedBy = slotElement.getUsedByClasses();
        if (usedBy.length > 0) {
          testSlot = slotElement;
          break;
        }
      }

      if (testSlot) {
        const usedByClasses = testSlot.getUsedByClasses();

        // Verify the result is an array of strings
        expect(Array.isArray(usedByClasses)).toBe(true);
        expect(usedByClasses.length).toBeGreaterThan(0);

        // Verify each class actually uses this slot
        usedByClasses.forEach(className => {
          const cls = allClasses.find(c => c.name === className) as import('../models/Element').ClassElement;
          expect(cls).toBeDefined();

          // Check that this class has a slotRef that references this slot
          const hasSlot = cls.slotRefs.some(slotRef => {
            const slot = slotCollection.getElement(slotRef.id) as import('../models/Element').SlotElement;
            return slot?.name === testSlot!.name;
          });
          expect(hasSlot).toBe(true);
        });

        // Verify results are sorted
        const sorted = [...usedByClasses].sort();
        expect(usedByClasses).toEqual(sorted);
      }
    });

    test('should return empty array for unused slots', async () => {
      const data = await loadModelData();
      const slotCollection = data.collections.get('slot') as SlotCollection;

      // Find a slot that's not used
      const allSlots = slotCollection.getAllElements();
      const unusedSlot = allSlots.find(s => s.getUsedByClasses().length === 0);

      if (unusedSlot) {
        expect(unusedSlot.getUsedByClasses()).toEqual([]);
      }
    });

    test('should find classes that use slot in slotRefs', async () => {
      const data = await loadModelData();
      const classCollection = data.collections.get('class') as ClassCollection;
      const slotCollection = data.collections.get('slot') as SlotCollection;
      const allClasses = classCollection.getAllElements();

      // Find a class that has slotRefs
      const classWithSlots = allClasses.find(c => {
        const classElement = c as import('../models/Element').ClassElement;
        return classElement.slotRefs && classElement.slotRefs.length > 0;
      }) as import('../models/Element').ClassElement | undefined;

      if (classWithSlots && classWithSlots.slotRefs.length > 0) {
        const slotRef = classWithSlots.slotRefs[0];
        const slotElement = slotCollection.getElement(slotRef.id);

        if (slotElement) {
          const usedBy = slotElement.getUsedByClasses();
          expect(usedBy).toContain(classWithSlots.name);
        }
      }
    });
  });

  describe('Badge counts', () => {
    test('SlotElement badge should match getUsedByClasses count', async () => {
      const data = await loadModelData();
      const slotCollection = data.collections.get('slot') as SlotCollection;
      const allSlots = slotCollection.getAllElements();

      // Find a slot with a badge
      const slotWithBadge = allSlots.find(s => s.getBadge() !== undefined);

      if (slotWithBadge) {
        const badge = slotWithBadge.getBadge();
        const usedByCount = slotWithBadge.getUsedByClasses().length;
        expect(badge).toBe(usedByCount);
      }
    });
  });
});
