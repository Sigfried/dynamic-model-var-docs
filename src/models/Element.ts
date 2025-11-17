/**
 * Element.ts - Model layer abstraction for UI components
 *
 * REFACTOR STATUS (Stage 1: Infrastructure Setup + Interface Definition)
 * This file currently re-exports from ElementPreRefactor.ts.
 * Each export below represents a class/type that needs to be refactored for Slots-as-Edges.
 *
 * REFACTOR CHECKLIST:
 * Stage 1: Infrastructure and Interface Definition
 * [x] Define new interfaces based on UI_REFACTOR.md (ItemInfo, EdgeInfo, LinkPair, RelationshipData)
 * [ ] Update existing interfaces for edge-based model (deferred to later stages)
 *
 * Stage 2: Migrate Element Classes
 * [ ] Types and Interfaces (ElementData, Relationship, DetailSection, DetailData)
 * [ ] Element base class (add getEdges() method)
 * [ ] ClassSlot helper class (may be removed/transformed)
 * [ ] ClassElement (main refactor - slots become edges)
 * [ ] EnumElement
 * [ ] SlotElement (becomes EdgeElement)
 * [ ] VariableElement
 *
 * Stage 3: Migrate Collections
 * [ ] ElementCollection base class
 * [ ] EnumCollection
 * [ ] SlotCollection (becomes EdgeCollection)
 * [ ] ClassCollection
 * [ ] VariableCollection
 *
 * Stage 4: Helper Functions
 * [ ] Helper functions (initializeElementNameMap, initializeClassCollection, initializeModelData)
 *
 * ARCHITECTURAL RULE:
 * - UI components (in src/components/) must ONLY import from DataService.ts
 * - DataService imports from this file (Element.ts)
 * - Never import Element classes directly in components
 * - Use polymorphic methods on Element base class instead of type checks
 */

// ============================================================================
// Types and Interfaces (TODO: Refactor for Slots-as-Edges)
// ============================================================================

// ============================================================================
// NEW: Edge-based interfaces for Slots-as-Edges refactor
// ============================================================================

/**
 * ItemInfo - Minimal item metadata for relationship display
 * Used in EdgeInfo to represent connected items
 */
export interface ItemInfo {
  id: string;
  displayName: string;
  typeDisplayName: string;  // "Class", "Enum", "Slot", "Variable"
  color: string;  // Tailwind color classes for styling
}

/**
 * EdgeInfo - Unified edge representation for all relationship types
 * Used in RelationshipData for both outgoing and incoming edges
 */
export interface EdgeInfo {
  edgeType: 'inheritance' | 'property' | 'variable_mapping';
  otherItem: ItemInfo;  // The connected item (target for outgoing, source for incoming)
  label?: string;       // For property: slot/attribute name; for variable_mapping: "mapped_to"
  inheritedFrom?: string; // For property edges only: ancestor name that defined this slot
}

/**
 * LinkPair - Minimal edge data for LinkOverlay rendering
 * Only includes property edges (inheritance/variable_mapping shown in detail views)
 */
export interface LinkPair {
  sourceId: string;
  targetId: string;
  sourceColor: string;  // For line gradient/styling
  targetColor: string;
  label?: string;  // slot/attribute name for property edges
}

/**
 * RelationshipData - Unified relationship structure using edges
 * Replaces old type-dependent relationship structure with generic edge-based model
 */
export interface RelationshipData {
  thisItem: ItemInfo;
  outgoing: EdgeInfo[];
  incoming: EdgeInfo[];
}

// ============================================================================
// EXISTING: Pre-refactor interfaces (will be updated/removed in later stages)
// ============================================================================
export type {
  ElementData,
  Relationship,
  DetailSection,
  DetailData
} from './ElementPreRefactor';

// ============================================================================
// Element Base Class (TODO: Refactor relationship methods)
// ============================================================================
export {
  Element
} from './ElementPreRefactor';

// ============================================================================
// Helper Classes (TODO: ClassSlot will be removed/transformed)
// ============================================================================
export {
  ClassSlot
} from './ElementPreRefactor';

// ============================================================================
// Element Subclasses (TODO: Major refactor for slots-as-edges)
// ============================================================================
export {
  ClassElement,    // TODO: Remove classSlots, use edges instead
  EnumElement,     // TODO: Minimal changes
  SlotElement,     // TODO: Becomes EdgeElement
  VariableElement  // TODO: Minimal changes
} from './ElementPreRefactor';

// ============================================================================
// Collection Classes (TODO: SlotCollection → EdgeCollection)
// ============================================================================
export {
  ElementCollection
} from './ElementPreRefactor';

export type {
  ElementCollectionCallbacks
} from './ElementPreRefactor';

export {
  EnumCollection,      // TODO: Minimal changes
  SlotCollection,      // TODO: Becomes EdgeCollection
  ClassCollection,     // TODO: Update to use edges
  VariableCollection   // TODO: Minimal changes
} from './ElementPreRefactor';

// ============================================================================
// Initialization Functions (TODO: Update for new model structure)
// ============================================================================
export {
  initializeElementNameMap,
  initializeClassCollection,
  initializeModelData
} from './ElementPreRefactor';
