# UI_REFACTOR.md - Component Refactoring Plan

> **Purpose:** Define how UI components will be simplified after the Slots-as-Edges refactor.
> This document maps current component data shapes to their post-refactor equivalents.

---

## Overview

The Slots-as-Edges refactor enables major UI simplifications:

1. **Unified edge representation** - All relationships (inheritance, slots, variables) become edges
2. **Type-agnostic components** - Less conditional logic based on element type
3. **Simpler data shapes** - Flatter structures, fewer special cases
4. **Better LinkOverlay** - `getAllPairs()` becomes trivial when all associations are edges

---

## Component Refactoring Priority

### High Priority (Core Data Flow)
1. **DataService** - Define new interfaces and method signatures
2. **LinkOverlay** - Implement `getAllPairs()` using edges
3. **RelationshipInfoBox** - Simplify to use edge-based data

### Medium Priority (Data Display)
4. **DetailContent** - Update to show edges instead of slots
5. **Section** - Potentially simplify element rendering

### Low Priority (Container/State)
6. **ItemsPanel** - Minimal changes (just type ID updates)
7. **App.tsx** - Update state management if needed

---

## 1. LinkOverlay Refactor

### Current State (Complex)

**Data Sources:**
- `DataService.getRelationshipsForLinking(itemId)` → returns `Relationship[]`
- Each element type has custom `getRelationships()` logic
- Manual filtering by element type to build links

**Link Building Logic:**
```typescript
// Current: Conditional logic per element type
if (element.type === 'class') {
  // Check parent relationship
  // Check attribute ranges
}
if (element.type === 'slot') {
  // Check slot range
}
// etc...
```

**Problems:**
- Type-specific relationship extraction
- No unified way to get all links
- Hard to implement features like "show all links" or filtering

### Post-Refactor State (Simple)

**New Data Structure:**
```typescript
interface LinkPair {
  sourceId: string;
  targetId: string;
  edgeType: 'inheritance' | 'property' | 'variable_mapping';
  label?: string;  // e.g., attribute name for property edges
}
```

**New DataService Method:**
```typescript
class DataService {
  /**
   * Get all linkable pairs in the model.
   * Returns flat array of source→target relationships.
   *
   * This becomes trivial once all associations are edges:
   * - Class inheritance → inheritance edges
   * - Class attributes → property edges
   * - Slot ranges → property edges
   * - Variables → variable_mapping edges
   */
  getAllPairs(): LinkPair[] {
    // Implementation: iterate all elements, map their edges to LinkPairs
    const pairs: LinkPair[] = [];
    this.modelData.elementLookup.forEach(element => {
      element.getEdges().forEach(edge => {
        pairs.push({
          sourceId: element.id,
          targetId: edge.targetId,
          edgeType: edge.type,
          label: edge.label
        });
      });
    });
    return pairs;
  }

  /**
   * Get pairs filtered by element types
   * Useful for "show only class-to-class" links
   */
  getPairsForTypes(sourceTypes: string[], targetTypes: string[]): LinkPair[] {
    return this.getAllPairs().filter(pair => {
      const sourceType = this.getItemType(pair.sourceId);
      const targetType = this.getItemType(pair.targetId);
      return sourceTypes.includes(sourceType) && targetTypes.includes(targetType);
    });
  }
}
```

**LinkOverlay Component:**
```typescript
// Post-refactor: Simple, declarative
function LinkOverlay() {
  const allPairs = dataService.getAllPairs();
  const visiblePairs = allPairs.filter(pair =>
    visibleTypes.has(sourceTypeOf(pair.sourceId)) &&
    visibleTypes.has(targetTypeOf(pair.targetId))
  );

  return visiblePairs.map(pair =>
    <LinkLine from={pair.sourceId} to={pair.targetId} />
  );
}
```

**Benefits:**
- No type-specific logic
- Easy to implement filters (by type, by edge type)
- Easy to add features (show label on hover, highlight path)
- Performance: can cache `getAllPairs()` result

---

## 2. RelationshipInfoBox Refactor

### Current State (Type-Dependent)

**Current Data Shape:**
```typescript
interface RelationshipData {
  itemName: string;
  itemSection: string;  // element type
  color: string;
  outgoing: {
    inheritance?: { target: string; targetSection: string };
    slots: SlotInfo[];  // ← Slots-specific!
    inheritedSlots: Array<{
      ancestorName: string;
      slots: SlotInfo[];
    }>;
  };
  incoming: {
    subclasses: string[];
    usedByAttributes: Array<{
      className: string;
      attributeName: string;
      sourceSection: string;
    }>;
    variables: Array<{ name: string }>;
  };
}

interface SlotInfo {
  attributeName: string;
  target: string;
  targetSection: string;  // type ID
  isSelfRef: boolean;
}
```

**Problems:**
- `slots` and `inheritedSlots` are class-specific concepts
- `incoming.usedByAttributes` mixes attribute names with type info
- Complex nested structure
- Hard to extend with new relationship types

### Post-Refactor State (Unified Edges)

**New Data Shape:**
```typescript
interface RelationshipData {
  itemId: string;
  itemType: string;  // renamed from itemSection for clarity

  outgoing: EdgeInfo[];
  incoming: EdgeInfo[];
}

interface EdgeInfo {
  edgeType: 'inheritance' | 'property' | 'variable_mapping';
  targetId: string;
  targetType: string;
  label?: string;        // e.g., attribute name
  inherited?: {          // Only for inherited edges
    fromAncestor: string;
  };
}
```

**Component Rendering:**
```typescript
// Post-refactor: Generic rendering by edge type
function RelationshipInfoBox({ itemId }: { itemId: string }) {
  const data = dataService.getRelationships(itemId);

  // Group by edge type
  const outgoingByType = groupBy(data.outgoing, edge => edge.edgeType);
  const incomingByType = groupBy(data.incoming, edge => edge.edgeType);

  return (
    <>
      <Section title="Outgoing">
        {outgoingByType.inheritance?.map(edge =>
          <EdgeRow edge={edge} label="inherits from" />
        )}
        {outgoingByType.property?.map(edge =>
          <EdgeRow edge={edge} label={edge.label} />
        )}
      </Section>

      <Section title="Incoming">
        {incomingByType.inheritance?.map(edge =>
          <EdgeRow edge={edge} label="subclass" />
        )}
        {incomingByType.property?.map(edge =>
          <EdgeRow edge={edge} label={`used by ${edge.label}`} />
        )}
      </Section>
    </>
  );
}
```

**Benefits:**
- Unified EdgeInfo type for all relationship types
- No type-specific rendering logic
- Easy to add new edge types
- Inherited edges clearly marked with ancestor info

---

## 3. DetailContent Refactor

### Current State

**What it displays:**
- Class: Inheritance, Slots (attributes/slot_usage/slots), Variables
- Enum: Permissible values, Used by classes
- Slot: Properties (range, required, etc.), Used by classes
- Variable: Properties (mapped to, data type, unit, etc.)

**Data Source:**
```typescript
interface DetailData {
  titlebarTitle: string;
  title: string;
  subtitle?: string;
  titleColor: string;
  description?: string;
  sections: DetailSection[];
}

interface DetailSection {
  name: string;
  text?: string;
  tableHeadings?: string[];
  tableContent?: unknown[][];
  tableHeadingColor?: string;
}
```

**Problems:**
- Generic `unknown[][]` for table content (no type safety)
- Class "Slots" section mixes attributes, slot_usage, and slot references
- "Used by" sections computed on-demand (can be slow)

### Post-Refactor State

**New Data Shape:**
```typescript
interface DetailData {
  itemId: string;
  itemType: string;
  title: string;
  subtitle?: string;
  description?: string;
  sections: DetailSection[];
}

// More specific section types
interface DetailSection {
  sectionType: 'properties' | 'edges' | 'values' | 'text';
  title: string;
  data: PropertiesData | EdgesData | ValuesData | TextData;
}

interface EdgesData {
  direction: 'outgoing' | 'incoming';
  edges: EdgeInfo[];
}

interface PropertiesData {
  properties: Array<{ key: string; value: string }>;
}

interface ValuesData {
  values: Array<{ key: string; description?: string }>;
}

interface TextData {
  text: string;
}
```

**Benefits:**
- Type-safe section data (no `unknown[][]`)
- Edges section works same for all element types
- Clear section types for rendering
- Can optimize edge computations in model layer

---

## 4. Section Component Refactor

### Current State

**What it renders:**
- Tree structure of elements (classes, enums, slots, variables)
- Expand/collapse for hierarchical types (classes, variables)
- Badges showing counts

**Data Flow:**
```typescript
// Collection provides SectionData
interface SectionData {
  id: string;
  label: string;
  getItems: (expandedItems?: Set<string>) => SectionItemData[];
  expansionKey?: string;
  defaultExpansion: Set<string>;
}

interface SectionItemData {
  id: string;
  displayName: string;
  level: number;
  badgeColor?: string;
  badgeText?: string;
  indicators?: Array<{ text: string; color: string }>;
  hasChildren: boolean;
  isExpanded: boolean;
  isClickable: boolean;
  hoverData: { id: string; type: string; name: string };
}
```

**Current Issues:**
- None major! This is already pretty clean
- `type` in hoverData exposes element type to UI

### Post-Refactor State

**Minor Changes:**
```typescript
interface SectionItemData {
  id: string;
  displayName: string;
  level: number;
  badgeColor?: string;
  badgeText?: string;
  indicators?: Array<{ text: string; color: string }>;
  hasChildren: boolean;
  isExpanded: boolean;
  isClickable: boolean;
  // Simplified hover data - no type exposure
  hoverData: { id: string; name: string };
}
```

**Benefits:**
- Removes element type from hover data (better separation)
- Otherwise minimal changes needed

---

## 5. ItemsPanel Refactor

### Current State

**What it does:**
- Displays toggle buttons for element types (C/E/S/V)
- Shows/hides sections based on toggles
- Manages visible types state

**Data Flow:**
```typescript
interface ToggleButtonData {
  id: string;          // type ID
  icon: string;
  label: string;
  activeColor: string;
  inactiveColor: string;
}

// DataService provides toggle data
getToggleButtonsData(): ToggleButtonData[]
```

**Current Issues:**
- Slot becomes Edge (S → E, "Slots" → "Edges")

### Post-Refactor State

**Changes Needed:**
- Update `ELEMENT_TYPES` registry: `slot` → `edge`
- Update toggle button labels: "Slots" → "Edges"
- Update icons if needed: `S` → `E`

**No structural changes to component!**

---

## 6. DataService Interface Summary

### New/Updated Methods

```typescript
class DataService {
  // ============================================================================
  // Link/Relationship Methods (NEW/UPDATED)
  // ============================================================================

  /**
   * Get all linkable pairs (replaces complex type-specific logic)
   */
  getAllPairs(): LinkPair[];

  /**
   * Get pairs filtered by source/target types
   */
  getPairsForTypes(sourceTypes: string[], targetTypes: string[]): LinkPair[];

  /**
   * Get relationship data for an item (UPDATED: uses EdgeInfo)
   */
  getRelationships(itemId: string): RelationshipData | null;

  // ============================================================================
  // Detail Content (UPDATED)
  // ============================================================================

  /**
   * Get detail content (UPDATED: better typed sections)
   */
  getDetailContent(itemId: string): DetailData | null;

  // ============================================================================
  // Metadata (MOSTLY UNCHANGED)
  // ============================================================================

  getFloatingBoxMetadata(itemId: string): FloatingBoxMetadata | null;
  itemExists(itemId: string): boolean;
  getItemType(itemId: string): string | null;
  getItemNamesForType(typeId: string): string[];
  getAvailableItemTypes(): string[];
  getColorForItemType(typeId: string): string;
  getToggleButtonsData(): ToggleButtonData[];
  getAllSectionsData(position: 'left' | 'right'): Map<string, SectionData>;
}
```

---

## Implementation Order

### Phase 1: Define Interfaces (Stage 2)
1. Create new interface definitions in DataService.ts
2. Keep old interfaces for backward compatibility (deprecated)
3. Document what each interface represents

### Phase 2: Add Stub Methods (Stage 3)
1. Add new DataService methods with stub implementations
2. Stubs can return empty data or call old methods temporarily
3. Components can start using new interfaces (with stubs)

### Phase 3: Refactor Element Classes (Stages 4-6)
1. Implement edge-based model
2. Update Element.getEdges() methods
3. Implement real DataService methods using new model

### Phase 4: Update Components (Stage 7+)
1. Update LinkOverlay to use `getAllPairs()`
2. Update RelationshipInfoBox to use `EdgeInfo`
3. Update DetailContent to use typed sections
4. Update ItemsPanel labels (Slots → Edges)

---

## Key Design Decisions

### 1. Edge Type Taxonomy
```typescript
type EdgeType =
  | 'inheritance'        // Class → parent class
  | 'property'          // Class → enum/class via attribute/slot
  | 'variable_mapping'; // Variable → class
```

**Rationale:** Keep it simple. Three types cover all current relationships.

### 2. Inherited Edge Representation
```typescript
interface EdgeInfo {
  edgeType: EdgeType;
  targetId: string;
  targetType: string;
  label?: string;
  inherited?: {
    fromAncestor: string;  // Which ancestor defined this edge
  };
}
```

**Rationale:**
- Inherited edges are just regular edges with metadata
- No need for separate `inheritedSlots` array
- Easier to filter/group in UI

### 3. Relationship Direction
- Elements expose `getEdges()` for outgoing edges
- Incoming edges computed on-demand via global scan
- DataService provides both in `RelationshipData`

**Rationale:**
- Outgoing edges are intrinsic to element definition
- Incoming edges are expensive to maintain (would require reverse index)
- Current on-demand computation is fine for UI responsiveness

### 4. LinkPair Structure
```typescript
interface LinkPair {
  sourceId: string;
  targetId: string;
  edgeType: EdgeType;
  label?: string;
}
```

**Rationale:**
- Minimal structure for rendering links
- No color/style info (computed from types)
- Label optional (only for property edges)

---

## Open Questions

1. **Badge behavior:** Should edge badges show outgoing count, incoming count, or total?
2. **Edge filtering:** Should LinkOverlay allow filtering by edge type (show only inheritance)?
3. **Self-referential edges:** How to visualize class with self-reference (e.g., `parent: Specimen`)?
4. **Edge labels:** Show on hover? Always visible? Configurable?

---

## Success Metrics

Post-refactor, we should see:
- ✅ Fewer lines of component code (less conditional logic)
- ✅ No element type checks in LinkOverlay or RelationshipInfoBox
- ✅ Type-safe section data (no `unknown[][]`)
- ✅ `getAllPairs()` works in ~10 lines of code
- ✅ Easy to add new relationship features (filtering, highlighting, etc.)
