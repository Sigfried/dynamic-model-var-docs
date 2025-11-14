/**
 * DataService - Abstraction layer between UI and model
 *
 * REFACTOR STATUS (Stage 2: Infrastructure Setup)
 * This file currently re-exports from DataServicePreRefactor.ts.
 * Each export below represents an interface/class that needs to be refactored for Slots-as-Edges.
 *
 * REFACTOR CHECKLIST:
 * As you refactor each item, move it from DataServicePreRefactor to this file:
 * [ ] FloatingBoxMetadata interface
 * [ ] SlotInfo interface (may become EdgeInfo)
 * [ ] RelationshipData interface (update for edges)
 * [ ] DataService class (update methods for new model)
 *
 * Key changes needed:
 * - SlotInfo → EdgeInfo (rename to match Slots-as-Edges)
 * - RelationshipData.outgoing.slots → outgoing.edges
 * - Update DataService methods that deal with slots/relationships
 */

// ============================================================================
// Data Transfer Interfaces (TODO: Update for Slots-as-Edges)
// ============================================================================
export type {
  FloatingBoxMetadata,
  SlotInfo,          // TODO: Rename to EdgeInfo
  RelationshipData   // TODO: Update outgoing.slots → outgoing.edges
} from './DataServicePreRefactor';

// ============================================================================
// DataService Class (TODO: Update for new Element structure)
// ============================================================================
export {
  DataService
} from './DataServicePreRefactor';
