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
- **TODO**: Rename to `import_types.ts` or `raw_to_cooked_data_types.ts`
- **Purpose**: DTOs for raw data transformation (used ONLY by dataLoader)
- **Keep**: All DTOs and SchemaData - these are the data shapes from JSON
- **Move out**: `SelectedElement` → ComponentData.ts (UI concern) ✅ COMPLETED

### ComponentData.ts (UI Contracts)
- **Keep**: All current interfaces - these are component contracts
- **Add**: `SelectedElement` from types.ts ✅ COMPLETED
- **Add**: `DetailSection`, `DetailData` from ElementPreRefactor (detail panel is UI) ✅ COMPLETED
- **TODO**: `ItemInfo`, `EdgeInfo` should move here from Element.ts (they're UI types)

### DataService.ts (Service Layer)
- **Remove**: `FloatingBoxMetadata` (duplicate of ComponentData.ts) ✅ COMPLETED
- **Rename**: Old `RelationshipData` → `RelationshipDataOld` (deprecated) ✅ COMPLETED
- **TODO**: Remove old `SlotInfo`, `RelationshipDataOld` after refactor complete
- **Keep**: Service should import from ComponentData.ts, not define its own

### Element.ts (Model Layer - Edge-based) ✅ MERGE COMPLETED

**Added from old Element.ts**:
- `ElementData` union type
- `Relationship` (will be removed later, but kept during migration)
- `ElementCollectionCallbacks`
- Graph-based relationship methods

**Current state**:
- `ItemInfo`, `EdgeInfo`, `RelationshipDataNew` (edge-based format)
- `ItemInfoDeprecated`, `EdgeInfoDeprecated`, `RelationshipDataDeprecated` (old format)

**TODO - Remove DTO imports**:
- Element.ts currently imports DTOs (ClassDTO, EnumDTO, etc.) from types.ts
- Only dataLoader should use DTOs
- Element constructors should take transformed data, not raw DTOs

**TODO - Move UI types out**:
- `ItemInfo`, `EdgeInfo` are UI types → should move to ComponentData.ts or UI layer

### Graph.ts (Model Layer - Graph structures)
**Keep**: Everything - this is clean, no UI concerns

**Note**: Some type definitions have had `export` removed to prevent confusion (types that don't need to be exported outside Graph.ts)

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

## Graph Architecture Proposal

### Alternative: Augment Model Graph

Instead of creating a second UI graph, enhance the single model graph with a query layer:

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
3. **Track displayed items**:
   ```typescript
   // In DataService or UI state
   currentlyDisplayedItems = new Map<string, ItemInfo>();
   ```

**Benefits**:
- Single source of truth in model graph
- No sync complexity
- Query on demand instead of maintaining duplicate structure
- Can cache edge query results if needed for performance

---

## Merge Plan (Revised)

### Step 1: Clean up interfaces FIRST ✅ COMPLETED

1. ✅ **Move `DetailSection`, `DetailData`** from ElementPreRefactor → ComponentData.ts
2. ✅ **Remove `FloatingBoxMetadata` duplicate** from DataService.ts
3. ✅ **Rename old `RelationshipData`** in DataService → `RelationshipDataOld` (mark deprecated)
4. ✅ **Move `SelectedElement`** from types.ts → ComponentData.ts
5. ❌ **Delete unused `positionToContext()`** helper - Analysis was wrong, this IS used

### Step 2: Merge Element files ✅ COMPLETED

1. ✅ **Merged interfaces** from old Element.ts into ElementPreRefactor.ts
2. ✅ **Merged graph-based methods** (getRelationshipsFromGraph, etc.)
3. ✅ **Renamed types**: ItemInfoProposal → ItemInfo, EdgeInfoProposal → EdgeInfo
4. ✅ **Old types renamed** to *Deprecated for backward compatibility
5. ✅ **Deleted old Element.ts** wrapper
6. ✅ **Renamed** ElementPreRefactor.ts → Element.ts (via git mv)

### Step 3: Fix UI violations (TODO - part of upcoming refactor)

1. **Move `getBoundingBox()`** to LinkOverlay or delete during LinkOverlay refactor
2. **Review `getSectionItemData()`** - maybe move to DataService adapter
3. **Review `toRenderableItems()`** - consider making it return pure model data
4. **Reduce Element subclass code** - Most behavior should move to graph queries or other layers

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

### Completed Work ✅

1. **Interface cleanup**:
   - ✅ Moved DetailSection, DetailData to ComponentData.ts
   - ✅ Removed FloatingBoxMetadata duplicate from DataService
   - ✅ Renamed old RelationshipData → RelationshipDataOld
   - ✅ Moved SelectedElement to ComponentData.ts

2. **Element file merge**:
   - ✅ Merged Element.ts and ElementPreRefactor.ts via git mv
   - ✅ Renamed ItemInfoProposal → ItemInfo, EdgeInfoProposal → EdgeInfo
   - ✅ Old types renamed to *Deprecated for backward compatibility
   - ✅ Single Element.ts file with graph-based methods

3. **Graph architecture**:
   - ✅ Decided on single model graph (not two graphs)
   - ✅ Plan to use display query layer pattern

### Next Steps

The Element file merge is complete. For ongoing refactor work, see:
- **TASKS.md** - "Element Architecture Refactor" and "Complete Graph Refactor (Steps 6-7)"
- **CLAUDE.md** - "Planned Architecture Improvements" section

This document served its purpose as a merge analysis and execution guide.
