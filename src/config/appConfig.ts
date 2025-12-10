/**
 * appConfig - Single source of truth for application configuration
 *
 * This file consolidates all configuration data including:
 * - Element type metadata (colors, labels, icons)
 * - Timing constants (hover delays, linger durations)
 * - Layout constants (box heights, list thresholds)
 *
 * ARCHITECTURAL PRINCIPLE:
 * - Link colors are derived from element type colors, not configured separately
 * - Use helper functions like getElementLinkColor() to compute derived values
 */

// ============================================================================
// Types
// ============================================================================

/** Element type IDs (lowercase for technical use) */
export type ElementTypeId = 'class' | 'enum' | 'slot' | 'type' | 'variable';

/** Expansion restore modes for floating box groups */
export type ExpansionRestoreMode = 'all-collapsed' | 'all-expanded' | 'heuristic';

/** Element type metadata */
export interface ElementTypeMetadata {
  readonly id: ElementTypeId;
  readonly label: string;         // Human-readable label (e.g., "Class", "Enumeration")
  readonly pluralLabel: string;   // Plural form (e.g., "Classes", "Enumerations")
  readonly icon: string;          // Single-character icon for toggle buttons (C, E, S, V)
  readonly color: {
    // Tailwind color names (for bg, text, border classes)
    name: string;               // e.g., 'blue', 'purple', 'green', 'orange'
    hex: string;                // Hex color for SVG (e.g., '#3b82f6')
    // Link colors (for clickable links in relationship displays)
    link: string;               // e.g., 'text-blue-600 dark:text-blue-400'
    linkTooltip: string;        // e.g., 'text-blue-300' (for tooltips)
    // Toggle button colors
    toggleActive: string;       // e.g., 'bg-blue-500' (full class name for Tailwind JIT)
    toggleInactive: string;     // e.g., 'bg-gray-300 dark:bg-gray-600'
    // Header colors for detail panels
    headerBg: string;           // e.g., 'bg-blue-700 dark:bg-blue-700'
    headerText: string;         // e.g., 'text-white'
    headerBorder: string;       // e.g., 'border-blue-800 dark:border-blue-600'
    // Selection/highlight colors
    selectionBg: string;        // e.g., 'bg-blue-100 dark:bg-blue-900'
    // Badge colors (for counts)
    badgeBg: string;            // e.g., 'bg-blue-200 dark:bg-blue-800'
    badgeText: string;          // e.g., 'text-blue-700 dark:text-blue-300'
  };
}

// ============================================================================
// Configuration
// ============================================================================

export const APP_CONFIG = {
  // Element type metadata
  elementTypes: {
    class: {
      id: 'class' as const,
      label: 'Class',
      pluralLabel: 'Classes',
      icon: 'C',
      color: {
        name: 'blue',
        hex: '#3b82f6',  // blue-500
        link: 'text-blue-600 dark:text-blue-400',
        linkTooltip: 'text-blue-300',
        toggleActive: 'bg-blue-500',
        toggleInactive: 'bg-gray-300 dark:bg-gray-600',
        headerBg: 'bg-blue-700 dark:bg-blue-700',
        headerText: 'text-white',
        headerBorder: 'border-blue-800 dark:border-blue-600',
        selectionBg: 'bg-blue-100 dark:bg-blue-900',
        badgeBg: 'bg-gray-200 dark:bg-slate-600',
        badgeText: 'text-gray-700 dark:text-gray-300'
      }
    },
    enum: {
      id: 'enum' as const,
      label: 'Enumeration',
      pluralLabel: 'Enumerations',
      icon: 'E',
      color: {
        name: 'purple',
        hex: '#a855f7',  // purple-500
        link: 'text-purple-600 dark:text-purple-400',
        linkTooltip: 'text-purple-300',
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
      id: 'slot' as const,
      label: 'Slot',
      pluralLabel: 'Slots',
      icon: 'S',
      color: {
        name: 'green',
        hex: '#10b981',  // green-500
        link: 'text-green-600 dark:text-green-400',
        linkTooltip: 'text-green-300',
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
      id: 'type' as const,
      label: 'Type',
      pluralLabel: 'Types',
      icon: 'T',
      color: {
        name: 'cyan',
        hex: '#06b6d4',  // cyan-500
        link: 'text-cyan-600 dark:text-cyan-400',
        linkTooltip: 'text-cyan-300',
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
      id: 'variable' as const,
      label: 'Variable',
      pluralLabel: 'Variables',
      icon: 'V',
      color: {
        name: 'orange',
        hex: '#f97316',  // orange-500
        link: 'text-orange-600 dark:text-orange-400',
        linkTooltip: 'text-orange-300',
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
  } satisfies Record<ElementTypeId, ElementTypeMetadata>,

  // Slot source labels (for display in detail panels)
  slotSources: {
    override: 'Override',      // Slot with slot_usage override
    global: 'Global',          // Defined in schema's global slots section
    defined: 'Defined here',   // Defined inline on this class
    inheritedSuffix: 'from',   // e.g., "Global (from Entity)"
  },

  // Timing constants
  timing: {
    boxTransition: 300,        // Animation duration for box position/size changes (ms)
    opacityTransition: 200,    // Animation duration for opacity changes (ms)
    tooltipDelay: 200,         // Delay before showing tooltips (ms) - browser default is ~500-1000ms
  },

  // Box appearance
  boxAppearance: {
    dimmedBrightness: 0.7,     // Brightness filter for boxes not in focus (1 = normal, lower = darker)
  },

  // UI layout constants
  layout: {
    estimatedBoxHeight: 400,   // For positioning calculations (RelationshipInfoBox)
    collapsibleListSize: 20,   // Show "...N more" threshold
    collapsedPreviewCount: 10, // Items to show when collapsed
  },

  // Transitory box configuration (hover previews)
  // Floating box group configuration (percentages of viewport)
  floatingGroups: {
    // Shared default dimensions
    defaultWidthPercent: 0.50,   // 50% of viewport width
    defaultHeightPercent: 0.35,  // 35% of viewport height
    // Margin from right edge of viewport (percentage)
    rightMarginPercent: 0.01,    // 1% from right edge
    // Margin from bottom edge of viewport (percentage)
    bottomMarginPercent: 0.02,   // 2% from bottom edge
    // Gap between stacked groups (percentage)
    stackGapPercent: 0.01,       // 1% gap between groups
    // Per-group settings
    details: {
      title: 'Details',
      stackPosition: 0,          // Bottom of stack (0 = first from bottom)
      fitContent: false,         // Use default height
    },
    relationships: {
      title: 'Relationships',
      stackPosition: 1,          // Second from bottom (stacked above details)
      fitContent: true,          // Size to fit content
    },
    // Minimum dimensions as percentage of viewport
    minWidthPercent: 0.20,       // 20% of viewport width
    minHeightPercent: 0.15,      // 15% of viewport height
    // Maximum dimensions for fitContent groups (percentage of viewport)
    fitContentMaxHeightPercent: 0.80,  // 80% of viewport height
    // Resize handle size in pixels (small enough to be unobtrusive)
    resizeHandleSize: 8,
    // Restore expansion state on page load
    // 'all-collapsed' | 'all-expanded' | 'heuristic' (>50% expanded → all expanded)
    restoreExpansionMode: 'heuristic' as ExpansionRestoreMode,
    // Delay before highlighting hovered item's box (ms)
    hoverHighlightDelay: 200,
  },

  // Transitory box configuration (hover previews)
  transitoryBox: {
    minWidthPercent: 0.35,     // 35% of viewport width
    maxWidthPercent: 0.50,     // 50% of viewport width
    maxHeightPercent: 0.67,    // 2/3 of viewport height
  },

  // Popout window configuration
  popout: {
    // Default size uses floatingGroups percentages if group has no size
    baseFontSize: '20px',      // Base font size for popout content
  },
} as const;

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get link color class for a specific element type
 * Used for clickable links in relationship displays
 */
export function getElementLinkColor(type: ElementTypeId): string {
  return APP_CONFIG.elementTypes[type].color.link;
}

/**
 * Get link tooltip color class for a specific element type
 * Used for link hover tooltips
 */
export function getElementLinkTooltipColor(type: ElementTypeId): string {
  return APP_CONFIG.elementTypes[type].color.linkTooltip;
}

/**
 * Get all element type IDs
 */
export function getAllElementTypeIds(): ElementTypeId[] {
  return Object.keys(APP_CONFIG.elementTypes) as ElementTypeId[];
}

// ============================================================================
// Legacy Exports (for backward compatibility during migration)
// ============================================================================

/** @deprecated Use APP_CONFIG.elementTypes instead */
export const ELEMENT_TYPES = APP_CONFIG.elementTypes;
