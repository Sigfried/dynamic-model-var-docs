/**
 * Element.ts - Model layer abstraction for UI components
 *
 * REFACTOR STATUS (Stage 1: Infrastructure Setup + Interface Definition)
 * This file currently re-exports from ElementPreRefactor.ts.
 * Each export below represents a class/type that needs to be refactored for Slots-as-Edges.
 *
 * REFACTOR CHECKLIST:
 * Stage 1: Infrastructure and Interface Definition
 * [ ] Define new interfaces based on UI_REFACTOR.md (ItemInfo, EdgeInfo, LinkPair)
 * [ ] Update existing interfaces for edge-based model
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
