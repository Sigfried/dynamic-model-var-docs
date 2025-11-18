/**
 * Element.ts - Model layer abstraction for UI components
 *
 * REFACTOR STATUS: Stage 3 Steps 1-3 Complete (Graph Infrastructure Built)
 * This file currently re-exports from ElementPreRefactor.ts.
 * Each export below represents a class/type that needs to be refactored for Slots-as-Edges.
 *
 * ============================================================================
 * STAGE 3 STEPS 4-7: IMPLEMENTATION APPROACH REVIEW
 * ============================================================================
 *
 * WHAT WE'VE BUILT (Steps 1-3):
 * - Graph infrastructure in src/models/Graph.ts
 * - SchemaGraph built during initializeModelData() and stored in ModelData
 * - Can query: getSlotEdgesForClass(), getParentClass(), getSubclasses(), etc.
 * - SlotEdge class wraps graph edges with OOP interface
 *
 * THE CHALLENGE:
 * We need to keep ElementPreRefactor.ts unchanged (it's the working implementation).
 * The UI currently depends on ClassElement.classSlots (ClassSlot[]) and getRelationships().
 *
 * PROPOSED APPROACH FOR REMAINING STEPS:
 *
 * Option A: "Incremental Adapter Pattern" (RECOMMENDED)
 * --------------------------------------------------------
 * Keep ElementPreRefactor working, add graph queries alongside existing code:
 *
 * 1. Step 4: Add graph-based methods to ClassElement WITHOUT removing classSlots
 *    - Add getSlotEdges(): SlotEdge[] that queries the graph
 *    - Keep classSlots array for backward compatibility
 *    - Both exist side-by-side (redundant but safe)
 *
 * 2. Step 5: Add getRelationshipsFromGraph() method
 *    - Returns RelationshipData using graph queries
 *    - Keep existing getRelationships() unchanged
 *    - DataService can call either method
 *
 * 3. Step 6: Update DataService to use new methods
 *    - Switch DataService to call getSlotEdges() and getRelationshipsFromGraph()
 *    - UI continues working (same interfaces)
 *    - Test thoroughly
 *
 * 4. Step 7: Clean up after migration
 *    - Remove classSlots array from ClassElement
 *    - Remove old getRelationships() method
 *    - Remove ClassSlot class
 *    - Simplify collections using graph queries
 *
 * Benefits:
 * - Can test graph queries without breaking existing UI
 * - Incremental migration with rollback capability
 * - Clear separation between old and new implementations
 *
 * Option B: "Big Bang Refactor"
 * ------------------------------
 * Create entirely new Element classes in separate files:
 * - Create src/models/ElementGraphBased.ts with new implementations
 * - Update Element.ts to export from ElementGraphBased instead of ElementPreRefactor
 * - All changes at once, high risk of breaking things
 *
 * Drawbacks:
 * - High risk of breaking UI
 * - Harder to debug if something goes wrong
 * - No incremental testing
 *
 * DECISION NEEDED:
 * Which approach should we take? Option A is safer and more incremental.
 *
 * ============================================================================
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
// Range Base Class (NEW: Stage 2 Step 4)
// ============================================================================
export {
  Range
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
  TypeElement,     // NEW: Stage 2 Step 4 - LinkML types from linkml:types
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
  TypeCollection,      // NEW: Stage 2 Step 7 - LinkML types collection
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
