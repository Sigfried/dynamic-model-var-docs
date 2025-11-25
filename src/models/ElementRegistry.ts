/**
 * ElementRegistry - Central registry for element type metadata
 *
 * This file centralizes all element-type-specific metadata to make the app
 * more maintainable and potentially reusable for other model navigation apps.
 */

// Element type IDs (lowercase for technical use)
// Stage 2 Step 4: Added 'type' for TypeElement (LinkML types)
export type ElementTypeId = 'class' | 'enum' | 'slot' | 'type' | 'variable';

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
    hex: string;                // Hex color for SVG (e.g., '#3b82f6')
    // Toggle button colors
    toggleActive: string;      // e.g., 'bg-blue-500' (full class name for Tailwind JIT)
    toggleInactive: string;    // e.g., 'bg-gray-300 dark:bg-gray-600'
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
      hex: '#3b82f6',  // blue-500
      toggleActive: 'bg-blue-500',
      toggleInactive: 'bg-gray-300 dark:bg-gray-600',
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
      hex: '#a855f7',  // purple-500
      toggleActive: 'bg-purple-500',
      toggleInactive: 'bg-gray-300 dark:bg-gray-600',
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
      hex: '#10b981',  // green-500
      toggleActive: 'bg-green-500',
      toggleInactive: 'bg-gray-300 dark:bg-gray-600',
      headerBg: 'bg-green-700 dark:bg-green-700',
      headerText: 'text-white',
      headerBorder: 'border-green-800 dark:border-green-600',
      selectionBg: 'bg-green-100 dark:bg-green-900',
      badgeBg: 'bg-green-200 dark:bg-green-800',
      badgeText: 'text-green-700 dark:text-green-300'
    }
  },
  type: {
    id: 'type',
    label: 'Type',
    pluralLabel: 'Types',
    icon: 'T',
    color: {
      name: 'cyan',
      hex: '#06b6d4',  // cyan-500
      toggleActive: 'bg-cyan-500',
      toggleInactive: 'bg-gray-300 dark:bg-gray-600',
      headerBg: 'bg-cyan-700 dark:bg-cyan-700',
      headerText: 'text-white',
      headerBorder: 'border-cyan-800 dark:border-cyan-600',
      selectionBg: 'bg-cyan-100 dark:bg-cyan-900',
      badgeBg: 'bg-cyan-200 dark:bg-cyan-800',
      badgeText: 'text-cyan-700 dark:text-cyan-300'
    }
  },
  variable: {
    id: 'variable',
    label: 'Variable',
    pluralLabel: 'Variables',
    icon: 'V',
    color: {
      name: 'orange',
      hex: '#f97316',  // orange-500
      toggleActive: 'bg-orange-500',
      toggleInactive: 'bg-gray-300 dark:bg-gray-600',
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
 * Helper: Get all element type IDs
 */
export function getAllElementTypeIds(): ElementTypeId[] {
  return Object.keys(ELEMENT_TYPES) as ElementTypeId[];
}
