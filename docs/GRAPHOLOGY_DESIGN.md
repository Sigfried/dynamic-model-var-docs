# Graphology + OOP Architecture Design

**Date**: January 2025
**Status**: Decision document for Stage 2 Step 1
**Related**: REFACTOR_PLAN.md Stage 2, Step 1

---

## Problem Statement

We need to decide how to combine graphology (graph library) with our existing OOP Element classes. Three main options:

- **Option A**: Graph stores IDs only
- **Option B**: Graph stores all properties
- **Option C**: Hybrid approach

This decision affects:
- How we query relationships
- Whether we keep OOP classes
- Data duplication vs query flexibility

---

## Current Query Patterns

Analysis of existing code shows these query patterns:

### 1. **Lookup by ID** (most common)
```typescript
// DataService.ts - used everywhere
const element = this.modelData.elementLookup.get(itemId);
```

### 2. **Get all items of a type**
```typescript
// DataService.ts:170
const collection = this.modelData.collections.get(typeId);
return collection.getAllElements().map(e => e.name);
```

### 3. **Compute relationships** (currently in Element classes)
```typescript
// ElementPreRefactor.ts - ClassElement.computeIncomingRelationships()
// Scans all classes to find:
// - Subclasses (where parentName === this.name)
// - Classes using this as a range (where slot.range === this.name)
```

### 4. **Filter/search queries** (potential future use)
```typescript
// Not currently used, but graphology enables:
graph.filterNodes((node, attrs) => attrs.type === 'class' && attrs.required);
```

---

## Analysis of Options

### Option A: Graph Stores IDs Only

**Structure**:
```typescript
// Graphology graph
graph.addNode('Specimen', { id: 'Specimen' });
graph.addEdge('Specimen', 'Entity', { type: 'inheritance' });

// OOP instances stored separately
elementLookup.set('Specimen', new ClassElement(...));
```

**Query Flow**: graph query → get IDs → lookup instances → generate UI data

**Pros**:
- No data duplication
- Single source of truth (Element instances)
- Easier to keep graph and objects in sync
- Element methods continue to work

**Cons**:
- Can't filter by properties in graph queries (must filter after lookup)
- Two-step process for property-based queries
- Less leverage of graphology's filtering capabilities

**Best for**: Current codebase with minimal filtering needs

### Option B: Graph Stores All Properties

**Structure**:
```typescript
// Graphology graph with all properties
graph.addNode('Specimen', {
  id: 'Specimen',
  type: 'class',
  displayName: 'Specimen',
  description: '...',
  required: true,
  // ... all other properties
});

// Optional: Keep OOP instances for methods only
// Or eliminate OOP entirely and use graph + helper functions
```

**Query Flow**: graph query with property filters → get node data → generate UI data

**Pros**:
- Can filter by properties in graph queries
- Full leverage of graphology capabilities
- Natural graph-centric design
- Could eliminate OOP classes entirely

**Cons**:
- Data duplication if we keep OOP instances
- Need to sync graph properties with object state
- Larger memory footprint
- More complex initialization

**Best for**: Heavy filtering/querying needs, graph-first architecture

### Option C: Hybrid Approach

**Structure**:
```typescript
// Graph stores query-critical properties only
graph.addNode('Specimen', {
  id: 'Specimen',
  type: 'class',
  required: true  // Only properties used in filters
});

// OOP instances store everything else
elementLookup.set('Specimen', new ClassElement(...));
```

**Pros**:
- Query optimization where needed
- Keep OOP benefits where useful
- Flexible tradeoff

**Cons**:
- Most complex approach
- Unclear which properties go where
- Duplicates critical properties
- Hardest to maintain

**Best for**: When you need both performance and OOP (rare)

---

## Recommendation: Option A (Graph Stores IDs Only)

### Rationale

1. **Current codebase already works this way**
   - We have `elementLookup` Map (ID → Element instance)
   - Graph would just formalize relationships
   - Minimal migration risk

2. **Query patterns don't require property filtering**
   - Most queries are lookups by ID
   - Relationship queries traverse edges (graph excels at this)
   - Type-based queries use collections (already efficient)

3. **Keep separation of concerns**
   - Graph handles structure (nodes, edges, traversal)
   - Element classes handle behavior (polymorphic methods, UI data generation)
   - Clean abstraction boundary

4. **Incremental adoption**
   - Can introduce graph gradually
   - Element classes continue to work
   - Migrate queries one at a time

5. **Memory efficiency**
   - No property duplication
   - Graph only stores structure
   - Element instances are single source of truth

### When to Reconsider

Switch to Option B if we later need:
- Complex property-based filtering ("find all required slots with enum ranges")
- Graph algorithms that need property weights
- Heavy graph visualization features
- Performance optimization for large schemas (1000+ elements)

---

## Implementation Plan

### Data Structure

```typescript
// ModelData (updated)
export interface ModelData {
  graph: Graph;  // Graphology graph (structure only)
  elementLookup: Map<string, Element>;  // ID → Element instance
  collections: Map<ElementTypeId, ElementCollection>;  // Unchanged
}
```

### Graph Structure

```typescript
// Node attributes (minimal)
graph.addNode(nodeId, {
  id: nodeId,  // Redundant but useful for graph export/debug
  type: 'class' | 'enum' | 'slot' | 'type' | 'variable'
});

// Edge attributes
graph.addEdge(sourceId, targetId, {
  type: 'inheritance' | 'property' | 'maps_to',
  label?: string,  // Slot name for property edges
  inheritedFrom?: string  // Ancestor for inherited slots
});
```

### DataService Methods

```typescript
class DataService {
  // ID-based lookup (unchanged)
  getDetailContent(itemId: string): DetailData | null {
    const element = this.modelData.elementLookup.get(itemId);
    return element?.getDetailData() ?? null;
  }

  // NEW: Graph-based relationship queries
  getAllPairs(): LinkPair[] {
    const pairs: LinkPair[] = [];
    this.modelData.graph.forEachEdge((edge, attrs, source, target) => {
      if (attrs.type === 'property') {  // Only property edges for LinkOverlay
        const sourceEl = this.modelData.elementLookup.get(source);
        const targetEl = this.modelData.elementLookup.get(target);
        if (sourceEl && targetEl) {
          pairs.push({
            sourceId: source,
            targetId: target,
            sourceColor: sourceEl.getColor(),
            targetColor: targetEl.getColor(),
            label: attrs.label
          });
        } else {
            console.error(`edge with missing endpoint(s): ${sourceEl || source} ${targetEl || target}`)
        }
      }
    });
    return pairs;
  }

  getRelationshipsNew(itemId: string): RelationshipData | null {
    const element = this.modelData.elementLookup.get(itemId);
    if (!element) return null;

    const outgoing: EdgeInfo[] = [];
    const incoming: EdgeInfo[] = [];

    // Outgoing edges
    this.modelData.graph.forEachOutEdge(itemId, (edge, attrs, source, target) => {
      const targetEl = this.modelData.elementLookup.get(target);
      if (targetEl) {
        outgoing.push({
          edgeType: attrs.type,
          otherItem: targetEl.getItemInfo(),
          label: attrs.label,
          inheritedFrom: attrs.inheritedFrom
        });
      }
    });

    // Incoming edges
    this.modelData.graph.forEachInEdge(itemId, (edge, attrs, source, target) => {
      const sourceEl = this.modelData.elementLookup.get(source);
      if (sourceEl) {
        incoming.push({
          edgeType: attrs.type,
          otherItem: sourceEl.getItemInfo(),
          label: attrs.label,
          inheritedFrom: attrs.inheritedFrom
        });
      }
    });

    return {
      thisItem: element.getItemInfo(),
      outgoing,
      incoming
    };
  }
}
```

### Element Classes

```typescript
abstract class Element {
  // Existing methods (unchanged)
  abstract getDetailData(): DetailData;
  abstract getFloatingBoxMetadata(): FloatingBoxMetadata;

  // NEW: Helper for relationship data
  getItemInfo(): ItemInfo {
    return {
      id: this.name,
      displayName: this.name,
      typeDisplayName: this.getTypeDisplayName(),
      color: this.getColor()
    };
  }

  protected abstract getTypeDisplayName(): string;
  protected abstract getColor(): string;
}

class ClassElement extends Element {
  protected getTypeDisplayName() { return 'Class'; }
  protected getColor() { return 'blue'; }
}
```

### Collections (Simplified)

Collections can be dramatically simplified since graph handles relationships:

```typescript
class ElementCollection {
  // Keep only:
  // - getLabel() - for section headers
  // - getDefaultExpansion() - for initial UI state
  // - getSectionData() - for rendering tree

  // REMOVE:
  // - getUsedByClasses() - use graph.forEachInEdge instead
  // - complex relationship methods - use graph queries
}
```

---

## Migration Strategy

### Stage 2: Setup (Current)
1. ✅ Document architecture decision (this file)
2. Install graphology (`npm install graphology`)
3. Update ModelData interface to include graph
4. Add graph initialization to dataLoader.ts (empty graph)
5. Keep existing Element/Collection code working

### Stage 3: Graph Population
1. Populate graph with nodes during element creation
2. Add edges for:
   - Inheritance (class → parent)
   - Properties (class → range via slots)
   - Variable mappings (variable → class)
3. Verify graph structure matches existing relationships

### Stage 4: DataService Migration
1. Implement getAllPairs() using graph
2. Implement getRelationshipsNew() using graph
3. Test against old methods (should match)
4. Switch UI to use new methods

### Stage 5: Collection Simplification
1. Remove getUsedByClasses() and similar methods
2. Keep only UI-focused methods
3. Update tests

---

## Testing Strategy

### Graph Structure Tests
```typescript
describe('Graph structure', () => {
  it('should have correct node count', () => {
    expect(graph.order).toBe(expectedNodeCount);
  });

  it('should have correct edge count', () => {
    expect(graph.size).toBe(expectedEdgeCount);
  });

  it('should have correct inheritance edges', () => {
    const parentEdges = graph.filterEdges(
      (edge, attrs) => attrs.type === 'inheritance'
    );
    expect(parentEdges.length).toBe(expectedInheritanceCount);
  });
});
```

### DataService Tests
```typescript
describe('DataService.getAllPairs()', () => {
  it('should return only property edges', () => {
    const pairs = dataService.getAllPairs();
    pairs.forEach(pair => {
      // Verify it's a property relationship
      const edge = graph.edge(pair.sourceId, pair.targetId);
      expect(edge.type).toBe('property');
    });
  });

  it('should match old getAllPairs() output', () => {
    const newPairs = dataService.getAllPairs();
    const oldPairs = dataService.getAllPairsOld();
    expect(sortPairs(newPairs)).toEqual(sortPairs(oldPairs));
  });
});
```

---

## Open Questions

1. **Graph library choice**: Use graphology or consider alternatives?
   - **Decision**: Use graphology (well-maintained, TypeScript support, feature-rich)

2. **Directed vs undirected graph**: Which do we need?
   - **Decision**: Directed graph (relationships have clear source→target directionality)

3. **Multi-graph**: Can we have multiple edges between same nodes?
   - **Decision**: Yes, use multi-graph (class can use same range multiple times via different slots)

4. **Graph persistence**: Store graph in URL state or rebuild on load?
   - **Decision**: Rebuild on load (graph is derived from model data)

---

## Conclusion

**Chosen approach**: Option A (Graph Stores IDs Only)

This balances:
- ✅ Low migration risk (builds on existing patterns)
- ✅ Clean separation of concerns (graph = structure, objects = behavior)
- ✅ Memory efficiency (no duplication)
- ✅ Incremental adoption (can migrate gradually)
- ✅ Future flexibility (can add properties later if needed)

Implementation begins in Stage 2 with graph setup and continues through Stage 3 with graph population and DataService migration.
