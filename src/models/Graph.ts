/**
 * Graph.ts - Graphology-based graph structure for Slots-as-Edges architecture
 *
 * This file defines the graph structure using graphology library.
 * The graph represents the schema as a directed graph with typed nodes and edges.
 *
 * ARCHITECTURAL NOTES:
 * - Graphology stores primitive attributes on nodes/edges (strings, numbers, booleans)
 * - OOP instances (Element classes) stored separately in collections
 * - Graph used for queries and relationship traversal
 * - Element classes provide methods and behavior
 *
 * DECISION (from REFACTOR_PLAN Question 1):
 * Using Option A (Graph stores IDs only) for now:
 * - Graphology nodes/edges contain only IDs and minimal metadata
 * - OOP instances stored in collections (ClassElement, EnumElement, etc.)
 * - Query flow: graphology query → get IDs → lookup instances → generate UI data
 * - Can evolve to Option B or C if we need property-based filtering
 */

import Graph from 'graphology';
import {
  EDGE_TYPES,
  type SchemaGraph,
  type NodeAttributes,
  type EdgeAttributes,
  type SlotEdgeAttributes,
} from "./SchemaTypes.ts";

/**
 * Create a new schema graph instance
 */
export function createSchemaGraph(): SchemaGraph {
  return new Graph<NodeAttributes, EdgeAttributes>({ multi: true });
}

// ============================================================================
// Graph Helper Functions
// ============================================================================

/**
 * Add a class node to the graph
 */
export function addClassNode(
  graph: SchemaGraph,
  id: string,
  name: string
): void {
  graph.addNode(id, {
    type: 'class',
    name,
  });
}

/**
 * Add an enum node to the graph
 */
export function addEnumNode(
  graph: SchemaGraph,
  id: string,
  name: string
): void {
  graph.addNode(id, {
    type: 'enum',
    name,
  });
}

/**
 * Add a slot definition node to the graph
 */
export function addSlotNode(
  graph: SchemaGraph,
  id: string,
  name: string
): void {
  graph.addNode(id, {
    type: 'slot',
    name,
  });
}

/**
 * Add a type node to the graph
 */
export function addTypeNode(
  graph: SchemaGraph,
  id: string,
  name: string
): void {
  graph.addNode(id, {
    type: 'type',
    name,
  });
}

/**
 * Add a variable node to the graph
 */
export function addVariableNode(
  graph: SchemaGraph,
  id: string,
  name: string
): void {
  graph.addNode(id, {
    type: 'variable',
    name,
  });
}

/**
 * Add an inheritance edge to the graph
 */
export function addInheritanceEdge(
  graph: SchemaGraph,
  sourceId: string,
  targetId: string
): void {
  graph.addEdgeWithKey(`${sourceId}->${targetId}`, sourceId, targetId, {
    type: 'inheritance',
  });
}

/**
 * Add slot edges to the graph
 * Creates THREE edges to support both 2-panel and 3-panel modes:
 * - CLASS_RANGE: class→range (2-panel mode, direct)
 * - CLASS_SLOT: class→slot (3-panel mode, first hop)
 * - SLOT_RANGE: slot→range (3-panel mode, second hop)
 */
export function addSlotEdges(
  graph: SchemaGraph,
  classId: string,
  rangeId: string,
  slotName: string,
  slotDefId: string,
  required: boolean,
  multivalued: boolean,
  inheritedFrom?: string
): void {
  // CLASS_RANGE: direct class→range (2-panel mode)
  const classRangeKey = `${classId}-[${slotName}]->${rangeId}`;
  graph.addEdgeWithKey(classRangeKey, classId, rangeId, {
    type: 'class_to_range',
    slotName,
    slotDefId,
    required,
    multivalued,
    inheritedFrom,
  });

  // CLASS_SLOT: class→slot (3-panel mode, first hop)
  const classSlotKey = `${classId}->${slotDefId}`;
  // Only add if edge doesn't exist (multiple classes may share same slot)
  if (!graph.hasEdge(classSlotKey)) {
    graph.addEdgeWithKey(classSlotKey, classId, slotDefId, {
      type: 'class_to_slot',
      slotName,
      required,
      multivalued,
      inheritedFrom,
    });
  }

  // SLOT_RANGE: slot→range (3-panel mode, second hop)
  const slotRangeKey = `${slotDefId}->${rangeId}`;
  // Only add if edge doesn't exist (slot may point to same range from multiple classes)
  if (!graph.hasEdge(slotRangeKey)) {
    graph.addEdgeWithKey(slotRangeKey, slotDefId, rangeId, {
      type: 'slot_to_range',
    });
  }
}

/**
 * Add a maps_to edge to the graph
 * Connects a variable to the class it maps to
 */
export function addMapsToEdge(
  graph: SchemaGraph,
  variableId: string,
  classId: string
): void {
  graph.addEdgeWithKey(`${variableId}->${classId}`, variableId, classId, {
    type: 'maps_to',
  });
}

// ============================================================================
// SlotEdge Class - OOP wrapper for slot edges
// ============================================================================

/**
 * SlotEdge - OOP class representing a slot edge
 *
 * KEY INSIGHT: There are MORE slot edges than slot definitions.
 * - Each class using a slot gets its own SlotEdge instance
 * - Multiple classes can reference the same SlotElement definition
 * - Each edge may have different overrides (via slot_usage)
 *
 * This class wraps the graph edge and provides methods for accessing properties.
 */
export class SlotEdge {
  readonly graph: SchemaGraph;
  readonly edgeId: string;
  readonly sourceId: string;  // Class ID
  readonly targetId: string;  // Range ID (Class | Enum | Type)

  constructor(
    graph: SchemaGraph,
    edgeId: string,
    sourceId: string,
    targetId: string
  ) {
    this.graph = graph;
    this.edgeId = edgeId;
    this.sourceId = sourceId;
    this.targetId = targetId;
  }

  /**
   * Get the edge attributes from the graph
   */
  private get attributes(): SlotEdgeAttributes {
    const attrs = this.graph.getEdgeAttributes(this.edgeId);
    if (attrs.type !== EDGE_TYPES.CLASS_RANGE) {
      throw new Error(`Edge ${this.edgeId} is not a CLASS_RANGE edge`);
    }
    return attrs as SlotEdgeAttributes;
  }

  /**
   * Get the slot name (e.g., "specimen_type")
   */
  get slotName(): string {
    return this.attributes.slotName;
  }

  /**
   * Get the slot definition ID (references a SlotElement node)
   */
  get slotDefId(): string {
    return this.attributes.slotDefId;
  }

  /**
   * Is this slot required?
   */
  get required(): boolean {
    return this.attributes.required;
  }

  /**
   * Is this slot multivalued?
   */
  get multivalued(): boolean {
    return this.attributes.multivalued;
  }

  /**
   * Which ancestor class defined this slot (if inherited)?
   */
  get inheritedFrom(): string | undefined {
    return this.attributes.inheritedFrom;
  }

  /**
   * Get the range (target) ID
   * This is the class, enum, or type that this slot points to
   */
  get range(): string {
    return this.targetId;
  }

  /**
   * Check if this edge has any overrides from the base slot definition
   * (This would be determined by comparing to the SlotElement definition)
   */
  isOverridden(): boolean {
    // For now, we can check if inheritedFrom is set
    // In the future, we might compare attributes to the base slot
    return this.inheritedFrom !== undefined;
  }
}

// ============================================================================
// Query Helper Functions
// ============================================================================

/**
 * Get all slot edges for a class (both direct and inherited)
 * Returns SlotEdge instances
 */
export function getSlotEdgesForClass(
  graph: SchemaGraph,
  classId: string
): SlotEdge[] {
  const edges: SlotEdge[] = [];

  graph.forEachOutboundEdge(classId, (edge, attributes, _source, target) => {
    if (attributes.type === EDGE_TYPES.CLASS_RANGE) {
      edges.push(new SlotEdge(graph, edge, classId, target));
    }
  });

  return edges;
}

/**
 * Get classes that use this node as a slot range
 * Queries incoming SLOT edges to find which classes reference this node.
 * Works for any range type: classes, enums, or types.
 *
 * @param graph - The schema graph
 * @param nodeId - The node ID (class, enum, or type)
 * @returns Array of class names that use this node as a range, sorted
 */
export function getClassesUsingRange(graph: SchemaGraph, nodeId: string): string[] {
  if (!graph.hasNode(nodeId)) {
    console.warn(`getClassesUsingRange: node "${nodeId}" not found in graph`);
    return [];
  }

  const classes = new Set<string>();

  // Get all incoming edges to this node
  graph.forEachInEdge(nodeId, (_edgeKey, attributes, sourceId) => {
    // Only count SLOT edges (not other edge types)
    if (attributes.type === EDGE_TYPES.CLASS_RANGE) {
      classes.add(sourceId);
    }
  });

  return Array.from(classes).sort();
}

/**
 * Get all classes that use a specific slot definition
 * Queries all SLOT edges to find which have this slotDefId
 *
 * @param graph - The schema graph
 * @param slotDefId - The slot definition ID
 * @returns Array of class names that use this slot, sorted
 */
export function getClassesUsingSlot(
  graph: SchemaGraph,
  slotDefId: string
): string[] {
  const classes: Set<string> = new Set();

  // Find all slot edges that reference this slot definition
  graph.forEachEdge((edge, attributes, _source) => {
    if (attributes.type === EDGE_TYPES.CLASS_RANGE) {
      const slotAttrs = attributes as SlotEdgeAttributes;
      if (slotAttrs.slotDefId === slotDefId) {
        const source = graph.source(edge);
        classes.add(source);
      }
    }
  });

  return Array.from(classes).sort();
}

/**
 * Get all incoming edges to a node (useful for finding "used by" relationships)
 */
export function getIncomingSlotEdges(
  graph: SchemaGraph,
  nodeId: string
): Array<{
  edge: string;
  source: string;
  attributes: SlotEdgeAttributes;
}> {
  const edges: Array<{
    edge: string;
    source: string;
    attributes: SlotEdgeAttributes;
  }> = [];

  graph.forEachInboundEdge(nodeId, (edge, attributes, source, _target) => {
    if (attributes.type === EDGE_TYPES.CLASS_RANGE) {
      edges.push({
        edge,
        source,
        attributes: attributes as SlotEdgeAttributes,
      });
    }
  });

  return edges;
}

/**
 * Get parent class (via inheritance edge)
 */
export function getParentClass(
  graph: SchemaGraph,
  classId: string
): string | null {
  let parent: string | null = null;

  graph.forEachOutboundEdge(classId, (_edge, attributes, _source, target) => {
    if (attributes.type === 'inheritance') {
      parent = target;
    }
  });

  return parent;
}

/**
 * Get all subclasses (via inheritance edges)
 */
export function getSubclasses(
  graph: SchemaGraph,
  classId: string
): string[] {
  const subclasses: string[] = [];

  graph.forEachInboundEdge(classId, (_edge, attributes, source, _target) => {
    if (attributes.type === 'inheritance') {
      subclasses.push(source);
    }
  });

  return subclasses;
}

/**
 * Get all variables that map to a class
 */
export function getVariablesMappingToClass(
  graph: SchemaGraph,
  classId: string
): string[] {
  const variables: string[] = [];

  graph.forEachInboundEdge(classId, (_edge, attributes, source, _target) => {
    if (attributes.type === 'maps_to') {
      variables.push(source);
    }
  });

  return variables;
}

// ============================================================================
// Graph Construction from SchemaData
// ============================================================================

/**
 * Build graph structure from SchemaData
 * Constructs graphology graph with all nodes and edges
 *
 * This is called during model initialization to build the graph from DTOs.
 */
export function buildGraphFromSchemaData(
  schemaData: import('./SchemaTypes').SchemaData
): SchemaGraph {
  const graph = createSchemaGraph();

  // Add all nodes first
  // 1. Classes
  schemaData.classes.forEach((classData) => {
    addClassNode(graph, classData.name, classData.name);
  });

  // 2. Enums
  schemaData.enums.forEach((_enumData, enumName) => {
    addEnumNode(graph, enumName, enumName);
  });

  // 3. Slots (all slots including global, inline, and override)
  schemaData.slots.forEach((slotData, slotId) => {
    addSlotNode(graph, slotId, slotData.name);
  });

  // 4. Types
  schemaData.types.forEach((_typeData, typeName) => {
    addTypeNode(graph, typeName, typeName);
  });

  // 5. Variables
  schemaData.variables.forEach((variable) => {
    addVariableNode(graph, variable.variableLabel, variable.variableLabel);
  });

  // Add all edges
  // 1. Inheritance edges (class → parent class)
  schemaData.classes.forEach((classData) => {
    if (classData.parent) {
      addInheritanceEdge(graph, classData.name, classData.parent);
    }
  });

  // 2. Slot edges (class→range, class→slot, slot→range)
  // Each class has slots array with references; slot data is in schemaData.slots
  schemaData.classes.forEach((classData) => {
    for (const slotRef of classData.slots) {
      const slotData = schemaData.slots.get(slotRef.id);
      if (!slotData) {
        console.warn(`Graph: Slot ${slotRef.id} not found for class ${classData.name}`);
        continue;
      }
      const range = slotData.range || 'string';
      addSlotEdges(
        graph,
        classData.name,
        range,
        slotData.name,
        slotRef.id,
        slotData.required ?? false,
        slotData.multivalued ?? false,
        slotRef.inheritedFrom
      );
    }
  });

  // 3. Variable mappings (variable → class)
  schemaData.variables.forEach((variable) => {
    if (variable.maps_to) {
      addMapsToEdge(graph, variable.variableLabel, variable.maps_to);
    }
  });

  return graph;
}
