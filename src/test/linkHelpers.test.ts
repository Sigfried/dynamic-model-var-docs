import { describe, test, expect } from 'vitest';
import {
  filterRelationships,
  buildLinks,
  getRectCenter,
  calculateAnchorPoints,
  generateBezierPath,
  generateSelfRefPath,
  getLinkColor,
  getLinkStrokeWidth,
  type Link,
} from '../utils/linkHelpers';
import type { Relationship } from '../models/Element';

describe('linkHelpers', () => {
  describe('filterRelationships', () => {
    const mockRelationships: Relationship[] = [
      { type: 'inherits', target: 'Entity', targetSection: 'class', isSelfRef: false },
      { type: 'property', label: 'species', target: 'SpeciesEnum', targetSection: 'enum', isSelfRef: false },
      { type: 'property', label: 'participant', target: 'Participant', targetSection: 'class', isSelfRef: false },
      { type: 'property', label: 'parent', target: 'Specimen', targetSection: 'class', isSelfRef: true },
    ];

    test('should return all relationships by default (excluding self-refs)', () => {
      const filtered = filterRelationships(mockRelationships);
      expect(filtered.length).toBe(3); // 4 total - 1 self-ref = 3
    });

    test('should filter out inheritance when showInheritance=false', () => {
      const filtered = filterRelationships(mockRelationships, { showInheritance: false });
      expect(filtered.length).toBe(2); // 3 properties - 1 self-ref = 2
      expect(filtered.every(r => r.type !== 'inherits')).toBe(true);
    });

    test('should filter out properties when showProperties=false', () => {
      const filtered = filterRelationships(mockRelationships, { showProperties: false });
      expect(filtered.length).toBe(1);
      expect(filtered[0].type).toBe('inherits');
    });

    test('should show only enums when onlyEnums=true', () => {
      const filtered = filterRelationships(mockRelationships, { onlyEnums: true });
      expect(filtered.length).toBe(1);
      expect(filtered[0].target).toBe('SpeciesEnum');
    });

    test('should show only classes when onlyClasses=true', () => {
      const filtered = filterRelationships(mockRelationships, { onlyClasses: true });
      expect(filtered.length).toBe(2); // 3 class relationships - 1 self-ref = 2
      expect(filtered.every(r => r.targetSection === 'class')).toBe(true);
    });

    test('should exclude self-refs by default', () => {
      const filtered = filterRelationships(mockRelationships);
      expect(filtered.some(r => r.isSelfRef)).toBe(false);
    });

    test('should include self-refs when includeSelfRefs=true', () => {
      const filtered = filterRelationships(mockRelationships, { includeSelfRefs: true });
      expect(filtered.length).toBe(4);
      expect(filtered.some(r => r.isSelfRef)).toBe(true);
    });

    test('should filter by visible elements', () => {
      const visibleElements = new Set(['Entity', 'SpeciesEnum']);
      const filtered = filterRelationships(mockRelationships, { visibleElements });
      expect(filtered.length).toBe(2);
      expect(filtered.map(r => r.target).sort()).toEqual(['Entity', 'SpeciesEnum']);
    });

    test('should combine multiple filters', () => {
      const visibleElements = new Set(['Entity', 'Participant', 'Specimen']);
      const filtered = filterRelationships(mockRelationships, {
        onlyClasses: true,
        includeSelfRefs: true,
        visibleElements,
      });
      expect(filtered.length).toBe(3);
      expect(filtered.every(r => r.targetSection === 'class')).toBe(true);
    });
  });

  describe('buildLinks', () => {
    const mockRelationships: Relationship[] = [
      { type: 'inherits', target: 'Entity', targetSection: 'class', isSelfRef: false },
      { type: 'property', label: 'species', target: 'SpeciesEnum', targetSection: 'enum', isSelfRef: false },
    ];

    test('should create link objects from relationships', () => {
      const links = buildLinks('class', 'Specimen', mockRelationships);

      expect(links.length).toBe(2);
      expect(links[0].source).toEqual({ type: 'class', name: 'Specimen' });
      expect(links[0].target).toEqual({ type: 'class', name: 'Entity' });
      expect(links[1].target).toEqual({ type: 'enum', name: 'SpeciesEnum' });
    });

    test('should apply filter options', () => {
      const links = buildLinks('class', 'Specimen', mockRelationships, {
        onlyEnums: true,
      });

      expect(links.length).toBe(1);
      expect(links[0].target.name).toBe('SpeciesEnum');
    });

    test('should handle empty relationships', () => {
      const links = buildLinks('enum', 'SexEnum', []);
      expect(links.length).toBe(0);
    });
  });

  describe('getRectCenter', () => {
    test('should calculate center of rectangle', () => {
      const rect = new DOMRect(100, 200, 50, 30);
      const center = getRectCenter(rect);

      expect(center.x).toBe(125); // 100 + 50/2
      expect(center.y).toBe(215); // 200 + 30/2
    });

    test('should handle zero-sized rectangles', () => {
      const rect = new DOMRect(10, 20, 0, 0);
      const center = getRectCenter(rect);

      expect(center.x).toBe(10);
      expect(center.y).toBe(20);
    });
  });

  describe('calculateAnchorPoints', () => {
    test('should connect right edge to left edge for horizontal layout', () => {
      const sourceRect = new DOMRect(0, 0, 100, 50);
      const targetRect = new DOMRect(200, 0, 100, 50);

      const anchors = calculateAnchorPoints(sourceRect, targetRect);

      // Source should use right edge (x=50+50=100)
      // Target should use left edge (x=200-50=150)
      expect(anchors.source.x).toBeGreaterThan(sourceRect.left + sourceRect.width / 2);
      expect(anchors.target.x).toBeLessThan(targetRect.left + targetRect.width / 2);
    });

    test('should connect bottom edge to top edge for vertical layout', () => {
      const sourceRect = new DOMRect(0, 0, 100, 50);
      const targetRect = new DOMRect(0, 200, 100, 50);

      const anchors = calculateAnchorPoints(sourceRect, targetRect);

      // Source should use bottom edge
      // Target should use top edge
      expect(anchors.source.y).toBeGreaterThan(sourceRect.top + sourceRect.height / 2);
      expect(anchors.target.y).toBeLessThan(targetRect.top + targetRect.height / 2);
    });

    test('should handle overlapping rectangles', () => {
      const sourceRect = new DOMRect(0, 0, 100, 50);
      const targetRect = new DOMRect(25, 10, 100, 50);

      const anchors = calculateAnchorPoints(sourceRect, targetRect);

      // Should still produce valid anchor points
      expect(anchors.source).toBeDefined();
      expect(anchors.target).toBeDefined();
      expect(typeof anchors.source.x).toBe('number');
      expect(typeof anchors.source.y).toBe('number');
    });
  });

  describe('generateBezierPath', () => {
    test('should generate valid SVG path string', () => {
      const source = { x: 0, y: 0 };
      const target = { x: 100, y: 50 };

      const path = generateBezierPath(source, target);

      expect(path).toMatch(/^M \d+ \d+ C .+$/); // Matches "M x y C ..."
      expect(path).toContain('M 0 0'); // Starts at source
      expect(path).toContain('100 50'); // Ends at target
    });

    test('should create straight line with zero curvature', () => {
      const source = { x: 0, y: 0 };
      const target = { x: 100, y: 0 };

      const path = generateBezierPath(source, target, 0);

      // With 0 curvature, control points should be at source/target x positions
      expect(path).toContain('M 0 0');
      expect(path).toContain('100 0');
    });

    test('should handle negative coordinates', () => {
      const source = { x: -50, y: -25 };
      const target = { x: 50, y: 25 };

      const path = generateBezierPath(source, target);

      expect(path).toContain('M -50 -25');
      expect(path).toContain('50 25');
    });
  });

  describe('generateSelfRefPath', () => {
    test('should generate valid looping path', () => {
      const rect = new DOMRect(100, 200, 80, 40);

      const path = generateSelfRefPath(rect);

      expect(path).toMatch(/^M \d+ \d+ C .+$/);
      // Path should start and end at approximately the same point (right edge)
      // Extract all numbers from the path
      const numbers = path.match(/([-\d.]+)/g);
      expect(numbers).toBeTruthy();
      if (numbers && numbers.length >= 8) {
        // M x y C cp1x cp1y, cp2x cp2y, endX endY
        const startX = parseFloat(numbers[0]);
        const startY = parseFloat(numbers[1]);
        const endX = parseFloat(numbers[6]);
        const endY = parseFloat(numbers[7]);

        expect(startX).toBe(endX); // Should loop back to same x
        expect(startY).toBe(endY); // Should loop back to same y
      }
    });

    test('should position loop outside element bounds', () => {
      const rect = new DOMRect(100, 200, 80, 40);
      const center = getRectCenter(rect);

      const path = generateSelfRefPath(rect);

      // Loop should extend beyond the right edge
      const startX = center.x + rect.width / 2;
      expect(path).toContain(`M ${startX}`);
    });
  });

  describe('getLinkColor', () => {
    test('should return blue for inheritance', () => {
      const rel: Relationship = {
        type: 'inherits',
        target: 'Entity',
        targetSection: 'class',
        isSelfRef: false,
      };

      expect(getLinkColor(rel)).toBe('#3b82f6');
    });

    test('should return purple for enum properties', () => {
      const rel: Relationship = {
        type: 'property',
        label: 'species',
        target: 'SpeciesEnum',
        targetSection: 'enum',
        isSelfRef: false,
      };

      expect(getLinkColor(rel)).toBe('#a855f7');
    });

    test('should return green for class properties', () => {
      const rel: Relationship = {
        type: 'property',
        label: 'participant',
        target: 'Participant',
        targetSection: 'class',
        isSelfRef: false,
      };

      expect(getLinkColor(rel)).toBe('#10b981');
    });
  });

  describe('getLinkStrokeWidth', () => {
    test('should return thicker stroke for inheritance', () => {
      const rel: Relationship = {
        type: 'inherits',
        target: 'Entity',
        targetType: 'class',
        isSelfRef: false,
      };

      expect(getLinkStrokeWidth(rel)).toBe(2);
    });

    test('should return medium stroke for properties', () => {
      const rel: Relationship = {
        type: 'property',
        target: 'Participant',
        targetType: 'class',
        isSelfRef: false,
      };

      expect(getLinkStrokeWidth(rel)).toBe(1.5);
    });
  });
});
