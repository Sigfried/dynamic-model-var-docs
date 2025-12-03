import { describe, test, expect } from 'vitest';
import {
  contextualizeId,
  decontextualizeId,
} from '../utils/idContextualization';

describe('idContextualization', () => {
  describe('contextualizeId', () => {
    test('should return raw ID when no context provided', () => {
      const result = contextualizeId({ id: 'Specimen' });
      expect(result).toBe('Specimen');
    });

    test('should add left-panel prefix', () => {
      const result = contextualizeId({ id: 'Specimen', context: 'left-panel' });
      expect(result).toBe('lp::Specimen');
    });

    test('should add right-panel prefix', () => {
      const result = contextualizeId({ id: 'Condition', context: 'right-panel' });
      expect(result).toBe('rp::Condition');
    });

    test('should add detail-box prefix', () => {
      const result = contextualizeId({ id: 'Container', context: 'detail-box' });
      expect(result).toBe('db::Container');
    });

    test('should use custom context as-is if not in prefix map', () => {
      const result = contextualizeId({ id: 'Specimen', context: 'custom' });
      expect(result).toBe('custom::Specimen');
    });

    test('should handle IDs with hyphens', () => {
      const result = contextualizeId({ id: 'category-SdohObservation', context: 'middle-panel' });
      expect(result).toBe('mp::category-SdohObservation');
    });
  });

  describe('decontextualizeId', () => {
    test('should extract ID from left-panel context', () => {
      const result = decontextualizeId('lp::Specimen');
      expect(result).toBe('Specimen');
    });

    test('should extract ID from right-panel context', () => {
      const result = decontextualizeId('rp::Condition');
      expect(result).toBe('Condition');
    });

    test('should extract ID from detail-box context', () => {
      const result = decontextualizeId('db::Container');
      expect(result).toBe('Container');
    });

    test('should return ID unchanged if no prefix', () => {
      const result = decontextualizeId('Specimen');
      expect(result).toBe('Specimen');
    });

    test('should handle IDs with hyphens (override slots)', () => {
      const result = decontextualizeId('mp::category-SdohObservation');
      expect(result).toBe('category-SdohObservation');
    });

    test('should handle custom context prefixes', () => {
      const result = decontextualizeId('custom::Specimen');
      expect(result).toBe('Specimen');
    });

    test('should be inverse of contextualizeId', () => {
      const original = 'Specimen';
      const contextualized = contextualizeId({ id: original, context: 'left-panel' });
      const decontextualized = decontextualizeId(contextualized);
      expect(decontextualized).toBe(original);
    });

    test('should be inverse of contextualizeId for hyphenated IDs', () => {
      const original = 'category-SdohObservation';
      const contextualized = contextualizeId({ id: original, context: 'middle-panel' });
      const decontextualized = decontextualizeId(contextualized);
      expect(decontextualized).toBe(original);
    });
  });

  describe('round-trip operations', () => {
    test('contextualizeId -> decontextualizeId should preserve ID', () => {
      const testIds = ['Specimen', 'category-SdohObservation', 'Container', 'Entity'];
      const contexts = ['left-panel', 'right-panel', 'detail-box', 'middle-panel'];

      for (const id of testIds) {
        for (const context of contexts) {
          const contextualized = contextualizeId({ id, context });
          const decontextualized = decontextualizeId(contextualized);
          expect(decontextualized).toBe(id);
        }
      }
    });

    test('decontextualizeId -> contextualizeId should preserve format', () => {
      const testCases = [
        { contextualized: 'lp::Specimen', context: 'left-panel' },
        { contextualized: 'rp::Condition', context: 'right-panel' },
        { contextualized: 'db::Container', context: 'detail-box' },
        { contextualized: 'mp::category-SdohObservation', context: 'middle-panel' },
      ];

      for (const { contextualized, context } of testCases) {
        const decontextualized = decontextualizeId(contextualized);
        const recontextualized = contextualizeId({ id: decontextualized, context });
        expect(recontextualized).toBe(contextualized);
      }
    });
  });
});
