# Two-Graph Architecture - Reconsidered

## Your Key Points (Game Changers):

### 1. Overridden slots need specialized IDs
> "overridden slots need ids that might not need to be in the model graph. not even sure model graph needs the three kinds of slot edges"

**Example**:
```
Model: range_high slot (shared definition)
UI: range_high-MeasurementObservation, range_high-SdohObservation (per-class instances)
```

**Implication**:
- Model graph: One `range_high` node
- UI graph: Multiple `range_high-ClassName` nodes (one per class that uses it)
- **Can't represent this in model graph without polluting it with UI concerns**

### 2. Same element, multiple panels = multiple DOM IDs
> "when the same node appears multiple places (when there are classes in the right panel, not sure if others), they each need unique dom ids and i think maybe we could get rid of the contextualized id stuff"

**Current problem**:
```typescript
// Specimen appears in left panel and right panel
// Current approach: contextualizeId()
'lp-Specimen' vs 'rp-Specimen'  // Hacky prefix system
```

**With UI graph**:
```typescript
// UI graph nodes:
{ id: 'lp-Specimen', modelId: 'Specimen', panelId: 'left' }
{ id: 'rp-Specimen', modelId: 'Specimen', panelId: 'right' }

// DOM id = UI graph node id (no contextualization needed!)
```

### 3. Drop model graph after initialization
> "maybe we don't need to keep it sync, maybe we can just drop it after creating the ui graph"

**Lifecycle**:
1. Load schema JSON → build model graph
2. Create Element instances from model graph
3. Build UI graph from Elements (with specialized slots, panel instances)
4. **Drop model graph** - no longer needed
5. All queries go to UI graph

**Benefits**:
- No sync problem (model graph is gone)
- Simpler runtime (one graph to query)
- No "which graph?" confusion

### 4. Model elements vs UI items
> "the model graph has elements, the ui graph would have items"

**Terminology clarity**:
```typescript
// Model Graph
nodes: Element (from schema)
edges: inheritance, slot, maps_to (from schema)

// UI Graph
nodes: Item (displayable instances, may be specialized/duplicated)
edges: visual connections (for LinkOverlay)
```

**Example**:
```
Model Graph:
  MeasurementObservation --[slotName: range_high]--> Quantity

UI Graph (3-panel mode):
  lp-MeasurementObservation --> mp-range_high-MeasurementObservation --> rp-Quantity
  lp-SdohObservation --> mp-range_high-SdohObservation --> rp-Quantity
```

---

## Revised Two-Graph Architecture

### Model Graph (Temporary, Initialization Only)

**Purpose**: Parse schema into queryable structure

**Nodes**:
- Element definitions from schema (Class, Enum, Slot, Type, Variable)
- IDs: Simple names (`Specimen`, `range_high`)

**Edges**:
- Inheritance (Class → parent Class)
- Slot usage (Class → Range) - maybe just one edge type, not three?
- Variable mappings (Variable → Class)

**Lifecycle**:
1. Built during `initializeModelData()`
2. Used to create Element instances
3. **Discarded after initialization** ✅

**Kept?**: NO - drop after Elements created

---

### UI Graph (Runtime, Display State)

**Purpose**: Represent currently displayed items and their connections

**Nodes**: Items (displayable instances)
```typescript
interface ItemNode {
  id: string;              // 'lp-Specimen', 'mp-range_high-MeasurementObservation'
  modelId: string;         // 'Specimen', 'range_high' (link back to Element)
  panelId: 'left' | 'middle' | 'right';
  type: 'class' | 'enum' | 'slot' | 'variable';

  // Display info (cached from Element)
  displayName: string;
  color: string;

  // UI state
  isExpanded?: boolean;
  isVisible: boolean;      // Based on parent expansion
}
```

**Edges**: Visual connections
```typescript
interface ItemEdge {
  type: 'inheritance' | 'property' | 'variable_mapping';
  source: string;          // 'lp-MeasurementObservation'
  target: string;          // 'mp-range_high-MeasurementObservation'
  label?: string;          // 'range_high'
  inheritedFrom?: string;  // 'Entity'
}
```

**Built**:
- When panels change (items added/removed)
- When items expand/collapse (children shown/hidden)
- Specialized slot nodes created per-class

**Queried**:
- LinkOverlay: "give me edges between left and middle panels"
- Section: "give me items in this panel"
- DataService: "find item by modelId + panelId"

**Lifecycle**: Persistent, updated on UI changes

---

## Implementation Strategy

### Phase 1: Keep Model Graph, Build UI Graph

**Don't drop model graph yet** - we need it for Element methods like `getRelationships()`:

```typescript
class ModelData {
  // Elements (built from schema)
  elementLookup: Map<string, Element>;
  classCollection: ClassCollection;
  enumCollection: EnumCollection;
  // ... other collections

  // Model graph (for Element methods to query)
  modelGraph: SchemaGraph;

  // NEW: UI graph (for display)
  uiGraph: UIGraph;
}
```

**Why keep model graph for now?**
- Element.getRelationships() queries it
- Element.getDetailData() may query it
- Safe migration path (can compare outputs)

### Phase 2: Migrate Element Methods to Query UI Graph

Once UI graph is stable:
1. Update Element methods to query UI graph instead
2. Drop model graph
3. Cleaner architecture

---

## UI Graph Operations

### Building UI Graph

```typescript
function buildUIGraph(
  elements: Map<string, Element>,
  leftSections: string[],      // ['class', 'enum']
  middleSections: string[],    // ['slot']
  rightSections: string[],     // ['class', 'enum']
  expandedItems: Set<string>   // Which items are expanded
): UIGraph {
  const graph = new UIGraph();

  // Add nodes for each displayed item
  for (const [panelId, sections] of [
    ['left', leftSections],
    ['middle', middleSections],
    ['right', rightSections]
  ]) {
    for (const sectionType of sections) {
      // Get elements of this type
      const sectionElements = getSectionElements(elements, sectionType);

      for (const element of sectionElements) {
        // Check if visible (parent expanded or is root)
        if (!isVisible(element, expandedItems)) continue;

        // Create UI item node
        const itemId = `${panelId[0]}p-${element.name}`;  // 'lp-Specimen'
        graph.addNode(itemId, {
          modelId: element.name,
          panelId,
          type: element.type,
          displayName: element.name,
          color: getColor(element.type),
          isExpanded: expandedItems.has(element.name),
          isVisible: true
        });
      }
    }
  }

  // Add edges based on Element relationships
  graph.forEachNode((itemId, attrs) => {
    const element = elements.get(attrs.modelId);
    const relationships = element.getRelationships();  // Query model graph

    // Convert model relationships to UI edges
    for (const rel of relationships.outgoing) {
      const targetItemId = findUIItem(graph, rel.target, attrs.panelId);
      if (targetItemId) {
        graph.addEdge(itemId, targetItemId, {
          type: rel.type,
          label: rel.label
        });
      }
    }
  });

  return graph;
}
```

### Specialized Slot Nodes (Grouped Slots)

```typescript
// When building UI graph, create per-class slot instances
function addSlotNodes(graph: UIGraph, middlePanel: boolean) {
  if (!middlePanel) return;

  // Find all class→slot relationships
  graph.forEachEdge((edgeId, attrs, source, target) => {
    if (attrs.type !== 'property') return;

    const sourceItem = graph.getNodeAttributes(source);
    const targetItem = graph.getNodeAttributes(target);

    if (sourceItem.type === 'class' && targetItem.type === 'class') {
      // This is a class→range edge, but middle panel shows slots
      // Split into: class→slot, slot→range

      const slotName = attrs.label;  // e.g., 'range_high'
      const className = sourceItem.displayName;

      // Create specialized slot node
      const specializedSlotId = `mp-${slotName}-${className}`;
      if (!graph.hasNode(specializedSlotId)) {
        graph.addNode(specializedSlotId, {
          modelId: slotName,
          panelId: 'middle',
          type: 'slot',
          displayName: `${slotName} (${className})`,  // Or just slotName?
          color: getColor('slot'),
          specialized: true,
          owningClass: className
        });
      }

      // Replace class→range edge with class→slot, slot→range
      graph.dropEdge(edgeId);
      graph.addEdge(source, specializedSlotId, { type: 'property', label: slotName });
      graph.addEdge(specializedSlotId, target, { type: 'property', label: slotName });
    }
  });
}
```

### Querying for LinkOverlay

```typescript
class UIGraph {
  getEdgesBetweenPanels(
    leftPanelId: 'left' | 'middle' | 'right',
    rightPanelId: 'left' | 'middle' | 'right'
  ): EdgeInfo[] {
    const edges: EdgeInfo[] = [];

    this.forEachEdge((edgeId, attrs, sourceId, targetId) => {
      const sourceNode = this.getNodeAttributes(sourceId);
      const targetNode = this.getNodeAttributes(targetId);

      // Check if edge connects these two panels
      if (sourceNode.panelId === leftPanelId && targetNode.panelId === rightPanelId) {
        edges.push({
          edgeType: attrs.type,
          sourceItem: {
            id: sourceId,
            displayName: sourceNode.displayName,
            typeDisplayName: sourceNode.type,
            color: sourceNode.color,
            panelPosition: 'left',
            panelId: leftPanelId
          },
          targetItem: {
            id: targetId,
            displayName: targetNode.displayName,
            typeDisplayName: targetNode.type,
            color: targetNode.color,
            panelPosition: 'right',
            panelId: rightPanelId
          },
          label: attrs.label,
          inheritedFrom: attrs.inheritedFrom
        });
      }
    });

    return edges;
  }
}
```

---

## Benefits of Two-Graph Architecture

### 1. Clean Separation
- **Model graph**: Schema structure (initialization only)
- **UI graph**: Display state (runtime queries)
- No mixing of concerns

### 2. Specialized Slots Without Pollution
- Model graph: One `range_high` node
- UI graph: Many `range_high-ClassName` nodes
- Model stays clean

### 3. No Contextualization Hacks
```typescript
// OLD (with single graph)
contextualizeId('Specimen', 'leftPanel') → 'lp-Specimen'

// NEW (with UI graph)
uiGraph.getNode('lp-Specimen').id → 'lp-Specimen'  // Direct lookup
```

### 4. Panel-Aware Queries
```typescript
// OLD
"Find all edges, then filter by panel"

// NEW
uiGraph.getEdgesBetweenPanels('left', 'middle')  // Built-in filtering
```

### 5. No Sync Problems (If We Drop Model Graph)
- Model graph built once, used to initialize Elements
- UI graph built from Elements
- Model graph discarded
- No ongoing sync needed

---

## Downsides

### 1. Two Graph Implementations
- Model graph: `graphology` (current Graph.ts)
- UI graph: New `UIGraph` class (also using graphology, but different schema)

**Mitigation**: Both use graphology, just different node/edge schemas

### 2. Memory Overhead (If Keeping Both)
- Model graph: ~1000 nodes, ~5000 edges (est)
- UI graph: ~100 nodes (displayed items), ~200 edges (visible connections)

**Mitigation**: Drop model graph after initialization (your suggestion)

### 3. Rebuild UI Graph on Panel Changes
- Every time sections change, rebuild UI graph
- Performance concern?

**Mitigation**:
- Incremental updates (add/remove nodes without full rebuild)
- UI graph is small (~100 nodes), rebuild is fast

---

## Revised Recommendation

**YES - Build two graphs, but drop model graph after initialization:**

### Architecture:

```typescript
// Initialization
const schemaData = loadSchemaData();
const modelGraph = buildModelGraph(schemaData);  // Temporary
const elements = createElements(modelGraph);     // Element instances
modelGraph = null;  // ✅ Drop it

// Runtime
const uiGraph = buildUIGraph(elements, layout);  // Rebuilt on layout changes
linkOverlay.render(uiGraph.getEdgesBetweenPanels('left', 'middle'));
```

### Migration Path:

1. **Phase 1**: Build UI graph alongside model graph (both exist)
2. **Phase 2**: Migrate Element methods to not need model graph
3. **Phase 3**: Drop model graph after initialization
4. **Phase 4**: All queries go to UI graph

### What This Unblocks:

1. ✅ Slot grouping (specialized slot nodes)
2. ✅ No contextualized IDs (UI graph nodes have panel-aware IDs)
3. ✅ Clean model/UI separation
4. ✅ Simpler LinkOverlay queries
5. ✅ Multiple instances of same element in different panels

---

## Questions for You

1. **Drop model graph immediately or migrate gradually?**
   - Immediate: Simpler, but need to rewrite Element.getRelationships() first
   - Gradual: Safer, but two graphs coexist during migration

2. **Specialized slot node IDs - what format?**
   - `mp-range_high-MeasurementObservation`
   - `mp-slot-range_high-MeasurementObservation`
   - Something else?

3. **When to rebuild UI graph?**
   - On every panel section change (expensive?)
   - Incremental updates (add/remove nodes)
   - Cached with invalidation

4. **Element.getRelationships() after dropping model graph?**
   - Query UI graph (but element might have multiple UI item instances)
   - Cache relationships in Element instances during initialization
   - Pass graph to Element constructor

---

## Next Steps

If we're doing two graphs:

1. **Design UIGraph schema** (node/edge attributes)
2. **Implement UIGraph class** (wraps graphology, panel-aware queries)
3. **Build UI graph in dataLoader** (after Elements created)
4. **Update LinkOverlay to query UI graph**
5. **Add specialized slot node creation**
6. **Evaluate dropping model graph**

**Want me to start with UIGraph class design?**
