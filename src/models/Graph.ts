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

// ============================================================================
// Node Types
// ============================================================================

/**
 * Node types in the schema graph
 */
type NodeType = 'class' | 'enum' | 'slot' | 'type' | 'variable';

/**
 * Base attributes stored on all nodes
 * These are stored directly in graphology for efficient queries
 */
interface BaseNodeAttributes {
  type: NodeType;
  name: string;  // Display name (same as node ID for most nodes)
}

/**
 * Class node attributes
 * Minimal data - ClassElement instance has full details
 */
export interface ClassNodeAttributes extends BaseNodeAttributes {
  type: 'class';
  // Future: Add queryable properties if needed (e.g., isAbstract: boolean)
}

/**
 * Enum node attributes
 */
export interface EnumNodeAttributes extends BaseNodeAttributes {
  type: 'enum';
}

/**
 * Slot node attributes
 * Slots exist as definitions that can be referenced by multiple SlotEdges
 */
export interface SlotNodeAttributes extends BaseNodeAttributes {
  type: 'slot';
}

/**
 * Type node attributes
 */
export interface TypeNodeAttributes extends BaseNodeAttributes {
  type: 'type';
}

/**
 * Variable node attributes
 */
export interface VariableNodeAttributes extends BaseNodeAttributes {
  type: 'variable';
}

/**
 * Union of all node attributes
 */
type NodeAttributes =
  | ClassNodeAttributes
  | EnumNodeAttributes
  | SlotNodeAttributes
  | TypeNodeAttributes
  | VariableNodeAttributes;

// ============================================================================
// Edge Types
// ============================================================================

/**
 * Edge types in the schema graph
 */
type EdgeType = 'inheritance' | 'slot' | 'maps_to';

/**
 * Base attributes stored on all edges
 */
interface BaseEdgeAttributes {
  type: EdgeType;
}

/**
 * Inheritance edge: Class → Parent Class
 * Represents is_a/inherits_from relationships
 */
export interface InheritanceEdgeAttributes extends BaseEdgeAttributes {
  type: 'inheritance';
}

/**
 * Slot edge: Class → Range (Class | Enum | Type)
 * Represents class attributes/slots with their ranges
 *
 * KEY INSIGHT: There are MORE slot edges than slot definitions.
 * - Same slot definition can be used by multiple classes
 * - Each class-range pair gets its own edge
 * - Edge references the slot definition and may have overrides
 */
export interface SlotEdgeAttributes extends BaseEdgeAttributes {
  type: 'slot';
  slotName: string;           // Name of the slot (e.g., "specimen_type")
  slotDefId: string;          // ID of the SlotElement definition node
  required: boolean;          // Is this slot required?
  multivalued: boolean;       // Is this slot multivalued?
  inheritedFrom?: string;     // If inherited, which ancestor defined it?
  // Future: Add more slot_usage override properties as needed
}

/**
 * MapsTo edge: Variable → Class
 * Represents variable mappings to schema classes
 */
export interface MapsToEdgeAttributes extends BaseEdgeAttributes {
  type: 'maps_to';
}

/**
 * Union of all edge attributes
 */
export type EdgeAttributes =
  | InheritanceEdgeAttributes
  | SlotEdgeAttributes
  | MapsToEdgeAttributes;

// ============================================================================
// Graph Type
// ============================================================================

/**
 * Typed graphology graph for the schema
 * This provides type safety for node/edge attributes
 */
export type SchemaGraph = Graph<NodeAttributes, EdgeAttributes>;

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
 * Add a slot edge to the graph
 * Connects a class to a range (Class | Enum | Type) through a slot
 */
export function addSlotEdge(
  graph: SchemaGraph,
  classId: string,
  rangeId: string,
  slotName: string,
  slotDefId: string,
  required: boolean,
  multivalued: boolean,
  inheritedFrom?: string
): void {
  // Edge key must be unique: include slot name since same class can have multiple slots with same range
  const edgeKey = `${classId}-[${slotName}]->${rangeId}`;

  // Let it fail if edge already exists - indicates data problem
  graph.addEdgeWithKey(edgeKey, classId, rangeId, {
    type: 'slot',
    slotName,
    slotDefId,
    required,
    multivalued,
    inheritedFrom,
  });
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
    if (attrs.type !== 'slot') {
      throw new Error(`Edge ${this.edgeId} is not a slot edge`);
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
    if (attributes.type === 'slot') {
      edges.push(new SlotEdge(graph, edge, classId, target));
    }
  });

  return edges;
}

/**
 * Get all classes that use a specific slot definition
 */
export function getClassesUsingSlot(
  graph: SchemaGraph,
  slotDefId: string
): string[] {
  const classes: Set<string> = new Set();

  // Find all slot edges that reference this slot definition
  graph.forEachEdge((edge, attributes, _source) => {
    if (attributes.type === 'slot') {
      const slotAttrs = attributes as SlotEdgeAttributes;
      if (slotAttrs.slotDefId === slotDefId) {
        const source = graph.source(edge);
        classes.add(source);
      }
    }
  });

  return Array.from(classes);
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
    if (attributes.type === 'slot') {
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
  schemaData: import('../import_types').SchemaData
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

  // 3. Slots
  schemaData.slots.forEach((_slotData, slotName) => {
    addSlotNode(graph, slotName, slotName);
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

  // 2. Slot edges (class → range)
  // The processed JSON has all attributes pre-computed with slotId and inherited_from
  schemaData.classes.forEach((classData) => {
    if (classData.attributes) {
      Object.entries(classData.attributes).forEach(([attrName, attrDef]) => {
        const range = attrDef.range || 'string';
        addSlotEdge(
          graph,
          classData.name,
          range,
          attrName,
          attrDef.slotId,  // Use pre-computed slotId from transform_schema.py
          attrDef.required ?? false,
          attrDef.multivalued ?? false,
          attrDef.inherited_from  // Pass inherited_from from processed JSON
        );
      });
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
