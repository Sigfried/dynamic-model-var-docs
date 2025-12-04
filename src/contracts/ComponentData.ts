/**
 * Component Data Contracts
 *
 * Centralized type definitions for data interfaces used across UI components.
 * These contracts define the shape of data that components expect to receive,
 * maintaining clear separation between UI layer and model/service layers.
 *
 * Architecture:
 * - Components define what data they need (these interfaces)
 * - DataService provides data matching these contracts
 * - Enables independent evolution of UI and model layers
 *
 * See CLAUDE.md for separation of concerns principles.
 */

import type {Element} from '../models/Element';

// ============================================================================
// Element Selection (DEPRECATED)
// ============================================================================

/**
 * @deprecated Use Element directly from models/Element via DataService
 * This alias exists for backward compatibility only.
 */
export type SelectedElement = Element;

// ============================================================================
// Section Component Contracts
// ============================================================================

/**
 * ItemHoverData - Hover event data for item interactions
 * Used by Section component to emit hover events with necessary context.
 */
export interface ItemHoverData {
  id: string;       // DOM node ID for positioning (e.g., "lp::Specimen")
  type: string;     // Item type: "class", "enum", "slot", "variable"
  name: string;     // Item name: "Specimen", "SpecimenTypeEnum", etc.
}

/**
 * SectionItemData - Data for rendering a single item in a section
 * Component-defined interface; DataService provides this data.
 */
export interface SectionItemData {
  // [sg] get this to work with ItemInfo interface; they are partly redundant now

  // Identity (raw name from model layer, contextualized by UI layer)
  id: string;                     // "Specimen" (raw name, UI adds context prefix)

  // Display
  displayName: string;            // "Specimen"
  level: number;                  // Indentation depth

  // Visual styling
  badgeColor?: string;            // Tailwind: "bg-blue-100 text-blue-800"
  badgeText?: string;             // "103"
  indicators?: Array<{            // Visual indicators (e.g., "abstract")
    text: string;                 // "abstract"
    color: string;                // Tailwind: "text-purple-600"
  }>;

  // Interaction
  hasChildren?: boolean;
  isExpanded?: boolean;
  isClickable: boolean;

  // Event data (opaque to component, passed through to callbacks)
  hoverData: ItemHoverData;
}

/**
 * SectionData - Data for rendering an entire section (Classes, Enums, etc.)
 * Component-defined contract; DataService provides section data.
 */
export interface SectionData {
  id: string;                     // "class"
  label: string;                  // "Classes (42)"
  getItems: (expandedItems?: Set<string>, position?: 'left' | 'middle' | 'right') => SectionItemData[];
  expansionKey?: string;          // For state persistence ("lp::class")
  defaultExpansion?: Set<string>; // Default expanded items
}

// ============================================================================
// ItemsPanel Component Contracts
// ============================================================================

/**
 * ToggleButtonData - Metadata for section toggle buttons
 * Provided by App.tsx from DataService/registry; component defines what it needs.
 */
export interface ToggleButtonData {
  id: string;                     // "class", "enum", "slot", "variable"
  icon: string;                   // "C"
  label: string;                  // "Classes"
  activeColor: string;            // Tailwind: "bg-blue-500"
  inactiveColor: string;          // Tailwind: "bg-gray-300 dark:bg-gray-600"
}

// ============================================================================
// FloatingBoxManager Component Contracts
// ============================================================================

/**
 * FloatingBoxMetadata - Display metadata for floating boxes
 * Maintains view/model separation - uses display strings, not model instances.
 */
export interface FloatingBoxMetadata {
  title: string;        // e.g., "Class: Specimen"
  subtitle?: string;    // e.g., "Relationships  0 ↘  •  ↗ 3" (optional second line)
  color: string;        // Tailwind classes for header (e.g., "bg-blue-700 border-blue-800")
}

/**
 * FloatingBoxData - Complete data structure for a floating box
 * Supports both transitory (auto-dismiss) and persistent (draggable) modes.
 */
export interface FloatingBoxData {
  id: string;
  mode: 'transitory' | 'persistent';
  metadata: FloatingBoxMetadata;
  content: React.ReactNode;
  itemId: string;  // Item identifier for callbacks and state management
  position?: { x: number; y: number };
  size?: { width: number; height: number };
  isUserPositioned?: boolean;  // True if user has moved/resized this box
}

// ============================================================================
// DetailPanel Component Contracts
// ============================================================================

/**
 * DetailSection - Section data for detail panel display
 * Used by DetailContent component to render information sections.
 */
export interface DetailSection {
  name: string;
  text?: string;
  tableHeadings?: string[];
  tableContent?: unknown[][];
  tableHeadingColor?: string; // Tailwind classes for heading background
}

/**
 * DetailData - Complete data for detail panel rendering
 * Provided by DataService; component defines what it needs for display.
 */
export interface DetailData {
  titlebarTitle: string;    // "Class: Specimen"
  title: string;            // "Specimen"
  subtitle?: string;        // "extends Entity"
  titleColor: string;       // From ELEMENT_TYPES[type].color
  description?: string;
  sections: DetailSection[];
}

// ============================================================================
// Graph/Relationship Component Contracts
// ============================================================================
// [sg] these are used by model as well as components; should probably be moved to SchemaTypes.ts

