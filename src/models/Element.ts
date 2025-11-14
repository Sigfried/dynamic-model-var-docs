/**
 * Element.ts - Model layer abstraction for UI components
 *
 * REFACTOR STATUS (Stage 1: Infrastructure Setup)
 * This file currently re-exports from ElementPreRefactor.ts.
 * Each export below represents a class/type that needs to be refactored for Slots-as-Edges.
 *
 * REFACTOR CHECKLIST:
 * As you refactor each item, move it from ElementPreRefactor to this file:
 * [ ] Types and Interfaces (ElementData, Relationship, DetailSection, DetailData)
 * [ ] Element base class
 * [ ] ClassSlot helper class
 * [ ] ClassElement (main refactor - slots become edges)
 * [ ] EnumElement
 * [ ] SlotElement (becomes EdgeElement)
 * [ ] VariableElement
 * [ ] ElementCollection base class
 * [ ] EnumCollection
 * [ ] SlotCollection (becomes EdgeCollection)
 * [ ] ClassCollection
 * [ ] VariableCollection
 * [ ] Helper functions (initializeElementNameMap, initializeClassCollection, initializeModelData)
 *
 * ARCHITECTURAL RULE:
 * - UI components (in src/components/) must ONLY import from this file
 * - Never import concrete subclasses (ClassElement, EnumElement, etc.) in components
             [sg] that's wrong. UI components must ONLY import from DataService.ts,
                  DataService imports from here
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
