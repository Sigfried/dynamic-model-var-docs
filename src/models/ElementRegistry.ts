/**
 * ElementRegistry - Central registry for element type metadata
 *
 * This file centralizes all element-type-specific metadata to make the app
 * more maintainable and potentially reusable for other model navigation apps.
 */

// Element type IDs (lowercase for technical use)
export type ElementTypeId = 'class' | 'enum' | 'slot' | 'variable';

// Relationship type IDs
export type RelationshipTypeId = 'inherits' | 'property' | 'uses_enum' | 'references_class';

/**
 * Element type metadata
 */
export interface ElementTypeMetadata {
  readonly id: ElementTypeId;
  readonly label: string;         // Human-readable label (e.g., "Class", "Enumeration")
  readonly pluralLabel: string;   // Plural form (e.g., "Classes", "Enumerations")
  readonly icon: string;          // Single-character icon for toggle buttons (C, E, S, V)
  readonly color: {
    // Tailwind color names (for bg, text, border classes)
    name: string;               // e.g., 'blue', 'purple', 'green', 'orange'
    // Header colors for detail panels
    headerBg: string;          // e.g., 'bg-blue-700 dark:bg-blue-700'
    headerText: string;        // e.g., 'text-white'
    headerBorder: string;      // e.g., 'border-blue-800 dark:border-blue-600'
    // Selection/highlight colors
    selectionBg: string;       // e.g., 'bg-blue-100 dark:bg-blue-900'
    // Badge colors (for counts)
    badgeBg: string;           // e.g., 'bg-blue-200 dark:bg-blue-800'
    badgeText: string;         // e.g., 'text-blue-700 dark:text-blue-300'
  };
}

/**
 * Relationship type metadata
 */
export interface RelationshipTypeMetadata {
  readonly id: RelationshipTypeId;
  readonly label: string;
  readonly color: string;  // Gradient color for SVG links
}

/**
 * Central registry of element types
 */
export const ELEMENT_TYPES: Record<ElementTypeId, ElementTypeMetadata> = {
  class: {
    id: 'class',
    label: 'Class',
    pluralLabel: 'Classes',
    icon: 'C',
    color: {
      name: 'blue',
      // Header colors (for detail panels)
      headerBg: 'bg-blue-700 dark:bg-blue-700',
      headerText: 'text-white',
      headerBorder: 'border-blue-800 dark:border-blue-600',
      // Selection/highlight colors
      selectionBg: 'bg-blue-100 dark:bg-blue-900',
      // Badge colors (for counts)
      badgeBg: 'bg-gray-200 dark:bg-slate-600',
      badgeText: 'text-gray-700 dark:text-gray-300'
    }
  },
  enum: {
    id: 'enum',
    label: 'Enumeration',
    pluralLabel: 'Enumerations',
    icon: 'E',
    color: {
      name: 'purple',
      headerBg: 'bg-purple-700 dark:bg-purple-700',
      headerText: 'text-white',
      headerBorder: 'border-purple-800 dark:border-purple-600',
      selectionBg: 'bg-purple-100 dark:bg-purple-900',
      badgeBg: 'bg-purple-200 dark:bg-purple-800',
      badgeText: 'text-purple-700 dark:text-purple-300'
    }
  },
  slot: {
    id: 'slot',
    label: 'Slot',
    pluralLabel: 'Slots',
    icon: 'S',
    color: {
      name: 'green',
      headerBg: 'bg-green-700 dark:bg-green-700',
      headerText: 'text-white',
      headerBorder: 'border-green-800 dark:border-green-600',
      selectionBg: 'bg-green-100 dark:bg-green-900',
      badgeBg: 'bg-green-200 dark:bg-green-800',
      badgeText: 'text-green-700 dark:text-green-300'
    }
  },
  variable: {
    id: 'variable',
    label: 'Variable',
    pluralLabel: 'Variables',
    icon: 'V',
    color: {
      name: 'orange',
      headerBg: 'bg-orange-600 dark:bg-orange-600',
      headerText: 'text-white',
      headerBorder: 'border-orange-700 dark:border-orange-500',
      selectionBg: 'bg-orange-100 dark:bg-orange-900',
      badgeBg: 'bg-orange-200 dark:bg-orange-800',
      badgeText: 'text-orange-700 dark:text-orange-300'
    }
  }
} as const;

/**
 * Central registry of relationship types
 */
export const RELATIONSHIP_TYPES: Record<RelationshipTypeId, RelationshipTypeMetadata> = {
  inherits: {
    id: 'inherits',
    label: 'Inherits from',
    color: '#3b82f6' // blue-500
  },
  property: {
    id: 'property',
    label: 'Property',
    color: '#8b5cf6' // purple-500
  },
  uses_enum: {
    id: 'uses_enum',
    label: 'Uses enum',
    color: '#06b6d4' // cyan-500
  },
  references_class: {
    id: 'references_class',
    label: 'References class',
    color: '#10b981' // green-500
  }
} as const;

/**
 * Helper: Get element type metadata
 */
export function getElementType(id: ElementTypeId): ElementTypeMetadata {
  return ELEMENT_TYPES[id];
}

/**
 * Helper: Get relationship type metadata
 */
export function getRelationshipType(id: RelationshipTypeId): RelationshipTypeMetadata {
  return RELATIONSHIP_TYPES[id];
}

/**
 * Helper: Check if a string is a valid ElementTypeId
 */
export function isValidElementType(value: string): value is ElementTypeId {
  return value in ELEMENT_TYPES;
}

/**
 * Helper: Get all element type IDs
 */
export function getAllElementTypeIds(): ElementTypeId[] {
  return Object.keys(ELEMENT_TYPES) as ElementTypeId[];
}
