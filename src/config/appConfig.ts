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
  readonly icon: string;          // Short badge abbreviation for toggle buttons, vocab-driven (e.g. "Ent", "Attr", "PVS")
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
      entity:        { singular: 'Entity',               plural: 'Entities',              abbr: 'Ent' },
      attribute:     { singular: 'Attribute',            plural: 'Attributes',            abbr: 'Attr' },
      valueSet:      { singular: 'Permissible Value Set', plural: 'Permissible Value Sets', abbr: 'PVS' },
      attributeType: { singular: 'Attribute Type',       plural: 'Attribute Types' }, // no badge -> no abbr
      dataType:      { singular: 'Data Type',            plural: 'Data Types',            abbr: 'DT' },
      variable:      { singular: 'Variable',             plural: 'Variables',             abbr: 'Var' },
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
      cls:   { header: 'Entities',             tip: 'Attributes whose value is an entity' },
      enm:   { header: 'Permissible Value Sets', tip: 'Attributes whose value comes from a permissible value set' },
      typ:   { header: 'Data Types',           tip: 'Attributes whose value is a data type' },
      vars:  { header: 'Variables',            tip: 'Mapped study variables' },
    },
  },

  // ── Modeler: relational/database vocabulary (per SG 2026-06-16). ──
  // class -> "Table", slot -> "Column", enum -> "Value Set", type -> "Type".
  // attributeType (the kind a column points at: Table/Value Set/Type) -> "Column Type".
  //
  // UNRESOLVED (SG to revisit — provisional choices made to fill the stub):
  //   - dataType: used "Type"; SG floated "Data Type" / "Column Type" too. If
  //     "Data Type" is preferred, change concept.dataType + entityCol.typ.
  //   - attributeType: used "Column Type" (also the right-panel title). Distinct
  //     from dataType on purpose; revisit if these should merge.
  //   - section.UsedByEntities: used "Used By Tables"; SG wondered about
  //     "Used By Variable" / something else (no such SectionId exists today).
  // Inactive unless defaultVocab flips to 'modeler'.
  modeler: {
    concept: {
      entity:        { singular: 'Table',       plural: 'Tables',       abbr: 'Tbl' },
      attribute:     { singular: 'Column',      plural: 'Columns',      abbr: 'Col' },
      valueSet:      { singular: 'Value Set',   plural: 'Value Sets',   abbr: 'VS' },
      attributeType: { singular: 'Column Type', plural: 'Column Types' }, // no badge -> no abbr
      dataType:      { singular: 'Type',        plural: 'Types',        abbr: 'Type' },
      variable:      { singular: 'Variable',    plural: 'Variables',    abbr: 'Var' },
    },
    section: {
      [SectionId.Inheritance]: 'Inheritance',
      [SectionId.Attributes]: 'Columns',
      [SectionId.Variables]: 'Variables',
      [SectionId.InheritsValues]: 'Inherits Values From',
      [SectionId.ReachableFrom]: 'Reachable From (Dynamic Values)',
      [SectionId.PermissibleValues]: 'Permissible Values',
      [SectionId.UsedByEntities]: 'Used By Tables',
      [SectionId.Properties]: 'Properties',
      [SectionId.Mappings]: 'Mappings',
      [SectionId.Notes]: 'Notes',
    } as Record<SectionId, string>,
    entityCol: {
      props: { header: 'Columns',     tip: 'Total columns (own + inherited)' },
      cls:   { header: 'Tables',      tip: 'Table-typed columns' },
      enm:   { header: 'Value Sets',  tip: 'Value-set columns' },
      typ:   { header: 'Types',       tip: 'Primitive-typed columns' },
      vars:  { header: 'Variables',   tip: 'Mapped study variables' },
    },
  },

  // ── LinkML: the original/native vocabulary used before Anne's changes. ──
  // Where the old code was inconsistent, one term is chosen and the alternates
  // that appeared elsewhere are noted in comments.
  linkml: {
    concept: {
      entity:        { singular: 'Class',       plural: 'Classes',      abbr: 'Class' },
      attribute:     { singular: 'Slot',        plural: 'Slots',        abbr: 'Slot' }, // also called "attribute" in places
      valueSet:      { singular: 'Enumeration', plural: 'Enumerations', abbr: 'Enum' }, // also "Enum" / "value set" / "Permissible Values"
      attributeType: { singular: 'Range',       plural: 'Ranges' },     // no badge -> no abbr
      dataType:      { singular: 'Type',         plural: 'Types',        abbr: 'Type' },
      variable:      { singular: 'Variable',     plural: 'Variables',    abbr: 'Var' },
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

// ---------------------------------------------------------------------------
// P1 — range kind. ColorBrewer Set1, entity = blue.
// ---------------------------------------------------------------------------

/**
 * What kind of thing a slot's range is. Qualitative and unordered: Set1 is
 * chosen for maximum mutual separation, because these categories have no
 * order and no one of them is "more" than another.
 *
 * This is the SAME set of things the Kitchen Sink calls element types and the
 * Explorer detail panel puts in badges, so it is one palette serving both —
 * see APP_CONFIG.elementTypes, whose `hex` values are these.
 *
 * `slot` is not a range kind. It is here because the Kitchen Sink still needs
 * a colour for slots as ELEMENTS; nothing in the graph uses it.
 */
export const RANGE_COLORS = {
  entity: '#377eb8',    // Set1 blue   — a class
  enum: '#984ea3',      // Set1 purple — a value set
  dataType: '#4daf4a',  // Set1 green  — a primitive
  variable: '#ff7f00',  // Set1 orange — a mapped study variable
  slot: '#a65628',      // Set1 brown  — Kitchen Sink only (not a range kind)
} as const;

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
      icon: V.concept.entity.abbr,
      color: {
        name: 'blue',
        hex: RANGE_COLORS.entity,  // P1 Set1 blue
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
      icon: V.concept.valueSet.abbr,
      color: {
        name: 'purple',
        hex: RANGE_COLORS.enum,  // P1 Set1 purple
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
      icon: V.concept.attribute.abbr,
      // Amber approximates P1's Set1 brown, which Tailwind has no scale for.
      // `slot` is NOT a range kind — it is here because the Kitchen Sink still
      // shows slots as elements and needs a colour for them.
      color: {
        name: 'amber',
        hex: RANGE_COLORS.slot,  // P1 Set1 brown
        link: 'text-amber-700 dark:text-amber-400',
        linkTooltip: 'text-amber-300',
        toggleActive: 'bg-amber-600',
        toggleInactive: 'bg-gray-300 dark:bg-gray-600',
        headerBg: 'bg-amber-800 dark:bg-amber-800',
        headerText: 'text-white',
        headerBorder: 'border-amber-900 dark:border-amber-700',
        selectionBg: 'bg-amber-100 dark:bg-amber-900',
        badgeBg: 'bg-amber-200 dark:bg-amber-800',
        badgeText: 'text-amber-800 dark:text-amber-300'
      }
    },
    type: {
      id: 'type' as const,
      label: V.concept.dataType.singular,
      pluralLabel: V.concept.dataType.plural,
      icon: V.concept.dataType.abbr,
      color: {
        name: 'green',
        hex: RANGE_COLORS.dataType,  // P1 Set1 green
        link: 'text-green-700 dark:text-green-400',
        linkTooltip: 'text-green-300',
        toggleActive: 'bg-green-600',
        toggleInactive: 'bg-gray-300 dark:bg-gray-600',
        headerBg: 'bg-green-700 dark:bg-green-700',
        headerText: 'text-white',
        headerBorder: 'border-green-800 dark:border-green-600',
        selectionBg: 'bg-green-100 dark:bg-green-900',
        badgeBg: 'bg-green-200 dark:bg-green-800',
        badgeText: 'text-green-700 dark:text-green-300'
      }
    },
    variable: {
      id: 'variable' as const,
      label: V.concept.variable.singular,
      pluralLabel: V.concept.variable.plural,
      icon: V.concept.variable.abbr,
      color: {
        name: 'orange',
        hex: RANGE_COLORS.variable,  // P1 Set1 orange
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
// Graph colours
// ============================================================================

/**
 * The three palettes.
 *
 * Every colour the app draws comes from here. A literal buried in a `stroke=`
 * is the thing that makes a palette impossible to change, so there are none.
 *
 * The system answers three different questions, and deliberately uses three
 * different KINDS of palette so the answers cannot be confused for one another:
 *
 *   P1 RANGE      what kind of thing is this?      ColorBrewer Set1 (qualitative)
 *   P2 EDGE KIND  what kind of relation is this?   ColorBrewer Blues (sequential)
 *   P3 SIBLINGS   which class does this belong to? ColorBrewer Pastel1 (pastel)
 *
 * P2 is not independent: it is a sequential ramp of P1's ENTITY hue, so every
 * edge still reads as "entity relationship" before it reads as any particular
 * kind of one. P3 does not need separation from P1 because the two never share
 * a position — P3 lands on slot names and box headers, P1 on row dots and range
 * labels.
 */

// ---------------------------------------------------------------------------
// P2 — edge kind. ColorBrewer Blues, a ramp of P1's entity hue.
// ---------------------------------------------------------------------------

/**
 * The three relation kinds as the GRAPH draws them, with nothing hovered.
 *
 * Named for the classifier's verdicts (`OwnershipVerdict` in containmentGraph)
 * rather than for a direction. "Outgoing"/"incoming" would be wrong here:
 * they imply a point of view, and with nothing hovered the canvas has none —
 * an edge is only outgoing RELATIVE to an entity the reader has picked out.
 * Perspective, if it ever gets a colour, is a hover-time concern and a
 * different palette.
 *
 * `ownFwd` and `ownBkwd` are the same relation seen from two ends, so they sit
 * CLOSE on the ramp (Blues 7 / Blues 6) — distinguishable, not dramatically
 * different. That one-step gap is why strokes got thicker (see STROKE_OWN):
 * a hairline cannot carry it.
 *
 * `association` is INSIDE the ramp at a value that stays clearly visible. The
 * dash pattern carries the distinction, not faintness — the old slate-500 said
 * "association" by being hard to see, which is not a thing a reader can learn.
 */
export const EDGE_COLORS = {
  ownFwd: '#2171b5',       // Blues 7 — owner declares the slot
  ownBkwd: '#4292c6',      // Blues 6 — the owned thing stores the FK
  association: '#6baed6',  // Blues 5 — no ownership claim; drawn dashed
} as const;

/** The relation menu's chip takes the main entity colour: the menu is about
 *  entity relationships in general, not about any one of the three kinds. */
export const RELATION_CHIP_COLOR = RANGE_COLORS.entity;

// ---------------------------------------------------------------------------
// P3 — siblings. ColorBrewer Pastel1, plus a dark entity-blue default.
// ---------------------------------------------------------------------------

/**
 * A P3 entry needs TWO steps, not one.
 *
 * A box header is a filled band with white text on it, so it needs a colour
 * dark enough to carry white. A slot name is small text on a light background,
 * so it needs a colour dark enough to READ — but not so dark that every entry
 * converges on near-black and the whole point of colouring siblings is lost.
 * One value cannot do both jobs.
 */
export interface SiblingColor {
  /** Header band fill. White text sits on this. */
  fill: string;
  /** Slot-name text on the box's light background. */
  text: string;
}

/**
 * Index 0 is the DEFAULT: parent-declared slots, and every box that is not an
 * inheritance-merged box.
 *
 * It is a significantly darkened form of P1's entity colour, NOT a neutral
 * gray — a box header is an entity, so its header and its own slot names carry
 * the entity identity, and sibling colours read as departures from it. No
 * other neutral is needed anywhere in the system.
 *
 * Entries 1+ are Pastel1, darkened per channel. Pastel1's low saturation is
 * what keeps sibling colouring quiet enough to sit under P1 without competing
 * with it; the raw pastels are far too pale for either job here, so each is
 * darkened — enough for white text (fill) or for legibility on white (text) —
 * while keeping the hue that makes them mutually distinct.
 *
 * Five real siblings covers the schema's largest group today (Observation, 5
 * children); six are listed so a sixth child does not immediately wrap onto
 * the default and read as a parent row.
 */
export const SIBLING_COLORS: readonly SiblingColor[] = [
  // 0 — default: dark entity blue.
  { fill: '#0b3a5d', text: '#1a5a8a' },
  // 1+ — Pastel1 hues, darkened for each channel.
  { fill: '#8c2f22', text: '#b3452f' },  // Pastel1 red
  { fill: '#1f4f7a', text: '#2f74ad' },  // Pastel1 blue
  { fill: '#2f6b30', text: '#458f42' },  // Pastel1 green
  { fill: '#5c3b73', text: '#7d5199' },  // Pastel1 purple
  { fill: '#8a5a12', text: '#b3781c' },  // Pastel1 orange
] as const;

// `GRAPH_COLORS` is gone. It held an amber `ownership` and a slate
// `reference`, and that pair was the whole old system: one colour meaning
// "relationship" and one meaning "not quite a relationship". P2 replaces it
// with three named kinds, and P1 took over the row dots the amber also
// coloured. Nothing should reintroduce a single "the graph colour".

// ============================================================================
// Legacy Exports (for backward compatibility during migration)
// ============================================================================

/** @deprecated Use APP_CONFIG.elementTypes instead */
export const ELEMENT_TYPES = APP_CONFIG.elementTypes;
