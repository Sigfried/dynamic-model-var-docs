// Core application data structure
// This is the main data container for the entire application

import type { ElementTypeId } from '../config/appConfig';
import type { Element, ElementCollection } from './Element';
import type { SchemaGraph } from './Graph';

/**
 * Model data structure - all element data is accessed via collections
 *
 * This is the primary data structure that holds all schema information:
 * - collections: Element collections organized by type (class, enum, slot, etc.)
 * - elementLookup: Fast lookup of any element by name
 * - graph: Graph structure for relationships and edges
 */
export interface ModelData {
  // Generic collections - keyed by ElementTypeId
  // Use collection.getElement(name) and collection.getAllElements() for lookups
  collections: Map<ElementTypeId, ElementCollection>;
  elementLookup: Map<string, Element>;
  // Graph structure for Slots-as-Edges architecture (Stage 3)
  graph: SchemaGraph;
}
