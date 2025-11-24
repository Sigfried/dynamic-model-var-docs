# Element.ts + ElementPreRefactor.ts Merge Analysis

## Interface Organization Across Codebase

### Current State (8 files with interfaces/types):

#### 1. **types.ts** - Source data DTOs and ModelData
```typescript
// DTOs from JSON files (raw data shapes)
SlotDefinition, SlotDTO, EnumDTO, TypeDTO, ClassDTO, SchemaDTO, TypesSchemaDTO

// Processed data structures
SlotData, EnumData, TypeData, ClassData, VariableSpec, SchemaData

// Field mappings
FieldMapping

// Enums
EnumValue

// Model container
ModelData

// VIOLATION: SelectedElement = Element (should be in ComponentData.ts)
```

#### 2. **ComponentData.ts** - UI component contracts
```typescript
// Hover and interaction
ItemHoverData

// Section component
SectionItemData, SectionData

// ItemsPanel component
ToggleButtonData

// FloatingBoxManager component
FloatingBoxMetadata, FloatingBoxData
```

#### 3. **DataService.ts** - Service layer contracts (DUPLICATES!)
```typescript
FloatingBoxMetadata  // DUPLICATE of ComponentData.ts!

// DEPRECATED - old relationship format
SlotInfo, RelationshipData  // Should be removed after refactor
```

#### 4. **Element.ts** - New edge-based interfaces (NOT MOVED YET)
```typescript
// Edge-based refactor interfaces
ItemInfo, EdgeInfo, RelationshipData  // NEW format, conflicts with old!

// LinkOverlay proposal
EdgeInfoProposal, ItemInfoProposal, LinkPair
```

#### 5. **ElementPreRefactor.ts** - Model layer + UI VIOLATIONS
```typescript
ElementData  // Union type

// UI VIOLATIONS (detail panel data - should be in ComponentData.ts?)
DetailSection, DetailData

// Internal relationship computation (not exported, OK)
IncomingRelationships, OutgoingRelationships, SlotInfo

// Old link format (should be removed)
Relationship

// Collections
ElementCollectionCallbacks
```

#### 6. **Graph.ts** - Graph data structures (CLEAN, model-only)
```typescript
NodeType
BaseNodeAttributes, ClassNodeAttributes, EnumNodeAttributes, SlotNodeAttributes, TypeNodeAttributes, VariableNodeAttributes
NodeAttributes (union)

EdgeType
BaseEdgeAttributes, InheritanceEdgeAttributes, SlotEdgeAttributes, MapsToEdgeAttributes
EdgeAttributes (union)

SchemaGraph (type alias)
```

#### 7. **ElementRegistry.ts** - Type metadata (CLEAN)
```typescript
// Not analyzed yet, but presumably clean type metadata
```

#### 8. **Other component/util files** - Local types only
```typescript
// DetailTable.tsx, FloatingBoxManager.tsx, LinkOverlay.tsx, Section.tsx, etc.
// Each has local interfaces, analyzed separately
```

---

## Interface Cleanup Proposal

### types.ts (Source Data Layer)
- rename to import_types.ts
- **Keep**: All DTOs and SchemaData - these are the data shapes from JSON
- **Move out**: `SelectedElement` → ComponentData.ts (UI concern)

### ComponentData.ts (UI Contracts)
- **Keep**: All current interfaces - these are component contracts
- **Add**: `SelectedElement` from types.ts
- **Add**: `DetailSection`, `DetailData` from ElementPreRefactor (detail panel is UI)
- **Remove**: Nothing (all good)

### DataService.ts (Service Layer)
- **Remove**: `FloatingBoxMetadata` (duplicate of ComponentData.ts)
- **Remove**: Old `SlotInfo`, `RelationshipData` (deprecated, will be deleted with refactor)
- **Keep**: Service should import from ComponentData.ts and Element.ts, not define its own

### Element.ts (Model Layer - Edge-based)
**Add from ElementPreRefactor**:
- `ElementData` union type
- `Relationship` (will be removed later, but keep during migration)
- `DetailSection`, `DetailData` → **NO, move to ComponentData.ts!**
- `ElementCollectionCallbacks`

**Keep from current Element.ts**:
- `ItemInfo`, `EdgeInfo`, `RelationshipData` (NEW format)
- `EdgeInfoProposal`, `ItemInfoProposal`, `LinkPair`

**Rename conflicts**:
- OLD `RelationshipData` in DataService → `RelationshipDataOld` (deprecated)
- NEW `RelationshipData` in Element.ts → keep name

### Graph.ts (Model Layer - Graph structures)
**Keep**: Everything - this is clean, no UI concerns

---

## UI Violations in ElementPreRefactor.ts

### SEVERE Violations (must fix):

1. **Line 24-28: `positionToContext()` helper**
   ```typescript
   function positionToContext(position: 'left' | 'middle' | 'right'): 'leftPanel' | 'middlePanel' | 'rightPanel'
   ```
   - **Violation**: Knows about panel positions (UI layout concern)
   - **Used by**: Never used! Can be deleted
   - **Fix**: DELETE

2. **Line 293-296: `getBoundingBox()`**
   ```typescript
   getBoundingBox(): DOMRect | null {
     const el = document.getElementById(`${this.type}-${this.name}`);
     return el ? el.getBoundingClientRect() : null;
   }
   ```
   - **Violation**: Accesses DOM directly
   - **Used by**: LinkOverlay (which we're refactoring anyway)
   - **Fix**: Move to LinkOverlay or delete during refactor

3. **Line 351-377: `getSectionItemData()`**
   ```typescript
   getSectionItemData(
     _context: 'leftPanel' | 'middlePanel' | 'rightPanel',
     level: number,
     isExpanded: boolean,
     isClickable: boolean,
     hasChildren?: boolean
   ): SectionItemData
   ```
   - **Violation**: Returns UI-specific `SectionItemData`, knows about panels
   - **Used by**: Section component via DataService
   - **Fix**: Keep for now (adapter pattern), but consider moving to DataService layer

4. **Line 433-462: `toRenderableItems()`**
   ```typescript
   toRenderableItems(
     expandedItems: Set<string>,
     getIsClickable?: (element: Element, level: number) => boolean,
     level: number = 0
   ): RenderableItem[]
   ```
   - **Violation**: Returns UI-specific `RenderableItem[]`, handles expansion state
   - **Used by**: Probably Section component
   - **Fix**: Keep for now (tree traversal is reasonable in model), but should return model data only

5. **Line 465+: `toSectionItemDataList()` (not shown, but probably exists)**
   - **Violation**: Similar to above
   - **Fix**: Consolidate with `toRenderableItems()` or move to DataService

### MODERATE Violations (acceptable for now):

6. **Line 54-68: `DetailSection`, `DetailData`**
   ```typescript
   export interface DetailSection {
     name: string;
     text?: string;
     tableHeadings?: string[];
     tableContent?: unknown[][];
     tableHeadingColor?: string; // Tailwind classes
   }

   export interface DetailData {
     titlebarTitle: string;
     title: string;
     subtitle?: string;
     titleColor: string; // From ELEMENT_TYPES[type].color
     description?: string;
     sections: DetailSection[];
   }
   ```
   - **Violation**: These are UI presentation structures
   - **Used by**: DetailPanel component via DataService
   - **Fix**: Move to ComponentData.ts (detail panel is UI)
   - **Acceptable**: For now, since they're just data structures

7. **Line 178+: `getRelationshipData()`** (returns old format)
   - **Violation**: Returns UI-specific relationship structure
   - **Fix**: Will be replaced by `getRelationshipsFromGraph()` during refactor

8. **Line 264-269: `getFloatingBoxMetadata()`**
   ```typescript
   getFloatingBoxMetadata(): FloatingBoxMetadata {
     const metadata = ELEMENT_TYPES[this.type];
     const color = metadata?.color.headerBg || 'bg-gray-500';
     return {
       itemName: this.name,
       itemSection: this.type,
       color: `${metadata.color.headerBg} ${metadata.color.headerBorder}`
     };
   }
   ```
   - **Violation**: Returns Tailwind class strings
   - **Acceptable**: Model can provide style metadata as data

### MINOR Violations (acceptable):

9. **Tailwind class strings throughout**
   - **Not really a violation**: Model returning color metadata as strings is fine
   - Components apply the classes

10. **`className` field name** (lines 76, 137, 151, 163-164)
    - **Not a violation**: Just means "class element name", not CSS class

---

## Two-Graph Architecture Evaluation

### Your Proposal:
> "have two graphs, one for the model, maybe just used while initializing everything, and one for Items, UI edges, and stuff that gets more complicated than the imported model"

### Analysis:

#### Model Graph (what we have now in Graph.ts):
- **Nodes**: Class, Enum, Slot, Type, Variable definitions from schema
- **Edges**: inheritance, slot (property), maps_to
- **Purpose**: Represents the LinkML schema structure
- **Built**: Once during initialization from SchemaData
- **Queried**: By Element classes and DataService

#### UI Graph (proposed new graph):
- **Nodes**: Displayed items (may be per-panel instances of same model element?)
- **Edges**: Visual connections for LinkOverlay rendering
- **Purpose**: Represents what's currently visible and how it's connected in UI
- **Built**: Dynamically as panels change and items expand/collapse
- **Queried**: By LayoutManager and LinkOverlay

### Problems with Two Graphs:

1. **Duplication**: Model graph already has all the relationship data
2. **Sync complexity**: UI graph would need to stay in sync with model graph
3. **When to build UI graph?**: Every render? On panel changes? Performance concern
4. **What problem does it solve?**:
   - Filtering visible edges? Can filter model graph edges by item presence
   - Per-panel instances? Can add `panelId` metadata without separate graph

### Alternative: Augment Model Graph

Instead of two graphs, enhance the single model graph:

1. **Keep model graph as source of truth**
2. **Add "display graph" query layer**:
   ```typescript
   class DisplayGraphView {
     constructor(private modelGraph: SchemaGraph, private displayedItems: Set<string>) {}

     getVisibleEdges(): EdgeInfo[] {
       return this.modelGraph.edges()
         .filter(edgeId => {
           const {source, target} = this.modelGraph.extremities(edgeId);
           return this.displayedItems.has(source) && this.displayedItems.has(target);
         })
         .map(edgeId => this.buildEdgeInfo(edgeId));
     }
   }
   ```
3. **Track displayed items** (what you already proposed in v2!):
   ```typescript
   // In DataService
   currentlyDisplayedItems = new Map<string, ItemInfo>();
   ```

### Recommendation:

**NO - Don't create second graph.** Instead:

1. **Use your `currentlyDisplayedItems` approach from v2**
2. **Query model graph** for edges between displayed items
3. **Cache edge query results** if performance becomes an issue
4. **Keep single source of truth** in model graph

The model graph already has all relationship data. Adding a second graph creates sync problems without solving a real need.

---

## Merge Plan (Revised)

### Step 1: Clean up interfaces FIRST

1. **Move `DetailSection`, `DetailData`** from ElementPreRefactor → ComponentData.ts
2. **Remove `FloatingBoxMetadata` duplicate** from DataService.ts
3. **Rename old `RelationshipData`** in DataService → `RelationshipDataOld` (mark deprecated)
4. **Move `SelectedElement`** from types.ts → ComponentData.ts
5. **Delete unused `positionToContext()`** helper

### Step 2: Merge Element.ts into ElementPreRefactor.ts

1. **Copy new interfaces** from Element.ts:
   - `ItemInfo`, `EdgeInfo`, `RelationshipData` (NEW format)
   - `EdgeInfoProposal`, `ItemInfoProposal`, `LinkPair`

2. **Copy new functions**:
   - `initializeGraphReferences()`
   - `Element.prototype.getRelationshipsFromGraph`
   - `initializeModelData()` wrapper

3. **Delete Element.ts**

4. **Rename** ElementPreRefactor.ts → Element.ts

### Step 3: Fix UI violations (can defer to later)

1. **Move `getBoundingBox()`** to LinkOverlay or delete during refactor
2. **Review `getSectionItemData()`** - maybe move to DataService adapter
3. **Review `toRenderableItems()`** - consider making it return pure model data

### Step 4: Add slot grouping support

Now you have one file to work with for adding specialized slot nodes!

---

## Files to Update After Merge

```
src/
  contracts/ComponentData.ts  [ADD DetailSection, DetailData, SelectedElement]
  services/DataService.ts     [REMOVE FloatingBoxMetadata, rename RelationshipData]
  types.ts                    [REMOVE SelectedElement export]
  models/Element.ts           [DELETE - merged into ElementPreRefactor]
  models/ElementPreRefactor.ts [ADD Element.ts content, RENAME to Element.ts]
```

**Import changes**: ZERO! (because renamed file keeps same public API)

---

## Summary

1. **Interface mess**: Yes, lots of duplication (FloatingBoxMetadata, RelationshipData conflict)
2. **UI violations**: More than I initially counted (6 severe, 3 moderate)
3. **Two graphs**: NOT recommended - use single model graph with display query layer
4. **Merge strategy**: Clean interfaces FIRST, then merge, then fix violations

**Ready to proceed?** I can execute Step 1 (interface cleanup) first.
