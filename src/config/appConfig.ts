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
// User-facing vocabulary
// ============================================================================
//
// SINGLE SOURCE OF TRUTH for every concept word shown in the UI. VOCAB is keyed
// by audience; `defaultVocab` selects the active one. Element type labels and all
// display strings draw from VOCAB[defaultVocab], so a term change is one edit.
// (Q2 of the stakeholder plan: ship the `researcher` vocab; `linkml`/`modeler`
// exist so an in-app toggle is cheap to add later — change/derive `defaultVocab`.)
//
// Code must NEVER branch on these display strings. For section identity use the
// greppable `SectionId` constants below and DetailSection.sectionId, not `name`.

/**
 * Stable, greppable identifiers for detail-panel sections. Used as
 * DetailSection.sectionId and in all section lookups. Searching e.g.
 * `SectionId.PermissibleValues` finds the emit site and every consumer.
 * The string values are internal keys — never shown to users.
 */
export const SectionId = {
  Inheritance: 'inheritance',
  Attributes: 'attributes',           // was "Slots"
  Variables: 'variables',
  InheritsValues: 'inheritsValues',
  ReachableFrom: 'reachableFrom',
  PermissibleValues: 'permissibleValues',
  UsedByEntities: 'usedByEntities',   // was "Used By Classes"
  Properties: 'properties',
  Mappings: 'mappings',
  Notes: 'notes',
} as const;
export type SectionId = (typeof SectionId)[keyof typeof SectionId];

export type VocabAudience = 'researcher' | 'modeler' | 'linkml';

/** The active vocabulary. Change this (or derive it at runtime) to re-term the
 *  whole app — that's the Q2 "toggle" hook. */
export const defaultVocab: VocabAudience = 'researcher';

/**
 * Per-audience display vocabulary. Each audience supplies the same shape:
 * - `concept`: every model concept as {singular, plural}. Element type labels,
 *   section titles, and summary columns all derive from these — single source.
 * - `section`: detail-panel section titles, keyed by SectionId.
 * - `entityCol`: Entity Explorer summary column {header, tip}.
 */
export const VOCAB = {
  // ── Researcher: jargon-free terms (Anne's provisional 2026-06-15 picks). ──
  // SG leans "Property" over "Attribute" — change concept.attribute to swap it.
  researcher: {
    concept: {
      entity:        { singular: 'Entity',               plural: 'Entities' },
      attribute:     { singular: 'Attribute',            plural: 'Attributes' },
      valueSet:      { singular: 'Permissible Value Set', plural: 'Permissible Value Sets' },
      attributeType: { singular: 'Attribute Type',       plural: 'Attribute Types' },
      dataType:      { singular: 'Data Type',            plural: 'Data Types' },
      variable:      { singular: 'Variable',             plural: 'Variables' },
    },
    section: {
      [SectionId.Inheritance]: 'Inheritance',
      [SectionId.Attributes]: 'Attributes',
      [SectionId.Variables]: 'Variables',
      [SectionId.InheritsValues]: 'Inherits Values From',
      [SectionId.ReachableFrom]: 'Reachable From (Dynamic Values)',
      [SectionId.PermissibleValues]: 'Permissible Values', // an enum's actual members
      [SectionId.UsedByEntities]: 'Used By Entities',
      [SectionId.Properties]: 'Properties',
      [SectionId.Mappings]: 'Mappings',
      [SectionId.Notes]: 'Notes',
    } as Record<SectionId, string>,
    // Entity Explorer summary columns, un-abbreviated per feedback
    // (no more Props/Cls/Enm/Typ/Vars).
    entityCol: {
      props: { header: 'Attributes',           tip: 'Total attributes (own + inherited)' },
      cls:   { header: 'Entities',             tip: 'Entity-typed ranges' },
      enm:   { header: 'Permissible Value Sets', tip: 'Permissible-value-set ranges' },
      typ:   { header: 'Data Types',           tip: 'Primitive-typed ranges' },
      vars:  { header: 'Variables',            tip: 'Mapped study variables' },
    },
  },

  // ── Modeler: relational/database vocabulary. STUB — fill in later (Q2). ──
  // Intended direction (per SG): enum -> "Value Set", class -> "Table",
  // slot -> "Field"/"Column". Currently mirrors researcher so it type-checks.
  modeler: {
    concept: {
      entity:        { singular: 'Entity',               plural: 'Entities' },        // TODO: "Table"?
      attribute:     { singular: 'Attribute',            plural: 'Attributes' },      // TODO: "Field"/"Column"?
      valueSet:      { singular: 'Value Set',            plural: 'Value Sets' },
      attributeType: { singular: 'Attribute Type',       plural: 'Attribute Types' }, // TODO: "Data Type"?
      dataType:      { singular: 'Data Type',            plural: 'Data Types' },
      variable:      { singular: 'Variable',             plural: 'Variables' },
    },
    section: {
      [SectionId.Inheritance]: 'Inheritance',
      [SectionId.Attributes]: 'Attributes',
      [SectionId.Variables]: 'Variables',
      [SectionId.InheritsValues]: 'Inherits Values From',
      [SectionId.ReachableFrom]: 'Reachable From (Dynamic Values)',
      [SectionId.PermissibleValues]: 'Permissible Values',
      [SectionId.UsedByEntities]: 'Used By Entities',
      [SectionId.Properties]: 'Properties',
      [SectionId.Mappings]: 'Mappings',
      [SectionId.Notes]: 'Notes',
    } as Record<SectionId, string>,
    entityCol: {
      props: { header: 'Attributes',  tip: 'Total attributes (own + inherited)' },
      cls:   { header: 'Entities',    tip: 'Entity-typed ranges' },
      enm:   { header: 'Value Sets',  tip: 'Value-set ranges' },
      typ:   { header: 'Data Types',  tip: 'Primitive-typed ranges' },
      vars:  { header: 'Variables',   tip: 'Mapped study variables' },
    },
  },

  // ── LinkML: the original/native vocabulary used before Anne's changes. ──
  // Where the old code was inconsistent, one term is chosen and the alternates
  // that appeared elsewhere are noted in comments.
  linkml: {
    concept: {
      entity:        { singular: 'Class',       plural: 'Classes' },
      attribute:     { singular: 'Slot',        plural: 'Slots' },        // also called "attribute" in places
      valueSet:      { singular: 'Enumeration', plural: 'Enumerations' }, // also "Enum" / "value set" / "Permissible Values"
      attributeType: { singular: 'Range',       plural: 'Ranges' },
      dataType:      { singular: 'Type',         plural: 'Types' },
      variable:      { singular: 'Variable',     plural: 'Variables' },
    },
    section: {
      [SectionId.Inheritance]: 'Inheritance',
      [SectionId.Attributes]: 'Slots',
      [SectionId.Variables]: 'Variables',
      [SectionId.InheritsValues]: 'Inherits Values From',
      [SectionId.ReachableFrom]: 'Reachable From (Dynamic Values)',
      [SectionId.PermissibleValues]: 'Permissible Values',
      [SectionId.UsedByEntities]: 'Used By Classes',
      [SectionId.Properties]: 'Properties',
      [SectionId.Mappings]: 'Mappings',
      [SectionId.Notes]: 'Notes',
    } as Record<SectionId, string>,
    entityCol: {
      props: { header: 'Slots', tip: 'Total slots (own + inherited)' },
      cls:   { header: 'Cls',   tip: 'Class-typed ranges' },
      enm:   { header: 'Enm',   tip: 'Enum-typed ranges' },
      typ:   { header: 'Typ',   tip: 'Primitive-typed ranges' },
      vars:  { header: 'Vars',  tip: 'Mapped study variables' },
    },
  },
} as const satisfies Record<VocabAudience, unknown>;

/** The active vocabulary's words — the handle consumers should use for display
 *  terms (e.g. ACTIVE_VOCAB.section[id], ACTIVE_VOCAB.concept.entity.singular).
 *  Resolves the audience indirection in one place. */
export const ACTIVE_VOCAB = VOCAB[defaultVocab];
const V = ACTIVE_VOCAB;

// ============================================================================
// Configuration
// ============================================================================

export const APP_CONFIG = {
  // Element type metadata
  elementTypes: {
    class: {
      id: 'class' as const,
      label: V.concept.entity.singular,
      pluralLabel: V.concept.entity.plural,
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
      label: V.concept.valueSet.singular,   // its contents shown as "Permissible Values"
      pluralLabel: V.concept.valueSet.plural,
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
      label: V.concept.attribute.singular,
      pluralLabel: V.concept.attribute.plural,
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
      label: V.concept.dataType.singular,
      pluralLabel: V.concept.dataType.plural,
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
      label: V.concept.variable.singular,
      pluralLabel: V.concept.variable.plural,
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
    collapsibleListSize: 20,   // Show "...N more" threshold
    collapsedPreviewCount: 10, // Items to show when collapsed
  },

  floats: {
    // Shared defaults (can be overridden per-group)
    defaultWidthPercent: 0.50,   // 50% of viewport width
    defaultHeightPercent: 0.35,  // 35% of viewport height
    minWidthPercent: 0.20,       // 20% of viewport width
    minHeightPercent: 0.15,      // 15% of viewport height
    fitContentMaxHeightPercent: 0.80,  // 80% of viewport height for fitContent
    rightMarginPercent: 0.01,    // 1% from right edge
    bottomMarginPercent: 0.02,   // 2% from bottom edge
    stackGapPercent: 0.01,       // 1% gap between groups
    resizeHandleSize: 8,         // Resize handle size in pixels
    restoreExpansionMode: 'all-expanded' as ExpansionRestoreMode,
    hoverHighlightDelay: 200,    // Delay before highlighting hovered item's box (ms)
    fitContent: false,           // Default: use fixed dimensions
    width: undefined as 'auto' | undefined,  // Default: use defaultWidthPercent
    // Per-group settings (override shared defaults)
    details: {
      title: 'Details',
      stackPosition: 0,          // Bottom of stack (0 = first from bottom)
      defaultWidthPercent: 0.50,
      defaultHeightPercent: 0.35,
    },
    relationships: {
      title: 'Relationships',
      stackPosition: 1,          // Second from bottom (stacked above details)
      fitContent: true,          // Size to fit content
      fitContentMaxHeightPercent: 0.40,
      width: 'auto' as 'auto' | undefined,
    },
  },


  // Popout window configuration
  popout: {
    // Default size uses floatingGroups percentages if group has no size
    baseFontSize: '20px',      // Base font size for popout content
  },

  // Feature flags (for development/testing)
  features: {
    // Element references (Range, class names, etc.) in detail panels
    elementRefClick: true,   // Click to open persistent detail box
    elementRefHover: true,   // Hover to show transitory detail box
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

/** Float group IDs */
export type FloatGroupId = 'details' | 'relationships';

/** Resolved float settings (shared defaults merged with per-group overrides) */
export interface FloatSettings {
  title: string;
  stackPosition: number;
  defaultWidthPercent: number;
  defaultHeightPercent: number;
  minWidthPercent: number;
  minHeightPercent: number;
  fitContentMaxHeightPercent: number;
  rightMarginPercent: number;
  bottomMarginPercent: number;
  stackGapPercent: number;
  resizeHandleSize: number;
  restoreExpansionMode: ExpansionRestoreMode;
  hoverHighlightDelay: number;
  fitContent: boolean;
  width: 'auto' | undefined;
}

/**
 * Get merged float settings for a group (shared defaults + per-group overrides)
 */
export function getFloatSettings(groupId: FloatGroupId): FloatSettings {
  const { details, relationships, ...defaults } = APP_CONFIG.floats;
  const groupOverrides = groupId === 'details' ? details : relationships;
  return {
    ...defaults,
    ...groupOverrides,
  } as FloatSettings;
}

// ============================================================================
// Legacy Exports (for backward compatibility during migration)
// ============================================================================

/** @deprecated Use APP_CONFIG.elementTypes instead */
export const ELEMENT_TYPES = APP_CONFIG.elementTypes;
