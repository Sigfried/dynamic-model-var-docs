# UI_REFACTOR.md - Component Refactoring Plan

> **Purpose:** Active UI component work following the completed Slots-as-Edges model/architecture refactor.
> This document tracks current UI issues and defines refactoring priorities.

---

## 📋 Current Status

**Model/Architecture**: ✅ **COMPLETE** (See [REFACTOR_PLAN.md](REFACTOR_PLAN.md) for details)
- ✅ Graph-based model with graphology
- ✅ SlotEdges connecting Class → Range
- ✅ Three-panel layout (Classes | Slots | Ranges)
- ✅ DataService adapter layer (graph data → old UI format)
- ✅ Component contracts centralized
- ✅ Middle panel toggle and spacing

**UI Components**: ⚠️ **NEEDS WORK**
- Many components still using old patterns
- LinkOverlay not working correctly for 3-panel display
- Hover boxes broken for slots and possibly types
- Detail boxes not rendering slot edges properly
- Floating box manager has positioning bugs
- Slot grouping not implemented

---

## Active Issues

**High Priority** (blocking demo):
1. **LinkOverlay 3-panel display** - Links not rendering correctly when middle panel visible
2. **Hover box fixes** - RelationshipInfoBox broken for slots, possibly types
3. **Transform schema optimization** - Exclude unused types to reduce bundle size

**Medium Priority**:
4. **Detail box slot edges** - Not rendering clickable slot edges
5. **Floating box manager** - Cascade positioning bugs
6. **Grouped slots panel** - Design complete, needs implementation

**Lower Priority**:
7. **LayoutManager enhancements** - Misc improvements
8. **Type filtering** - Only show types actually used in schema

---

## Overview

The Slots-as-Edges refactor enabled major UI simplifications:

1. **Unified edge representation** - All relationships (inheritance, slots, variables) become edges
2. **Graph queries replace Element logic** - DataService uses graph queries instead of Element methods
3. **Simpler data shapes** - Flatter structures, fewer special cases
4. **Three-panel layout** - Classes | Slots (optional) | Ranges

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

**Data Structure:** Use existing `EdgeInfo` interface (from Element.ts)
```typescript
interface EdgeInfo {
  edgeType: 'inheritance' | 'property' | 'variable_mapping';
  sourceItem: ItemInfo;  // { id, displayName, typeDisplayName, color, panelPosition, panelId }
  targetItem: ItemInfo;
  label?: string;
  inheritedFrom?: string;
}
```

**Design Note:** LinkOverlay only renders **property edges** (class→enum/class attribute relationships). Inheritance and variable_mapping edges are displayed in RelationshipInfoBox and DetailContent, not as visual links between panels.

**New DataService Method:**
```typescript
class DataService {
  /**
   * Get all property edges for LinkOverlay rendering.
   * Returns only property edges (class→enum/class relationships via attributes/slots).
   * Does NOT include inheritance or variable_mapping edges (those appear in detail views).
   */
  getAllPropertyEdges(): EdgeInfo[] {
    const edges: EdgeInfo[] = [];

    // Query graph for all property edges
    this.modelData.graph.forEachEdge((edgeId, attributes, source, target) => {
      if (attributes.type === 'property') {
        edges.push({
          edgeType: 'property',
          sourceItem: this.buildItemInfo(source),
          targetItem: this.buildItemInfo(target),
          label: attributes.label,
          inheritedFrom: attributes.inheritedFrom
        });
      }
    });

    return edges;
  }
}
```

**LinkOverlay Component:**
```typescript
// Post-refactor: DataService provides EdgeInfo[], LinkOverlay filters by visibility
function LinkOverlay({ leftSections, rightSections }: Props) {
  const allEdges = dataService.getAllPropertyEdges();

  // Filter to only visible cross-panel links
  const visibleEdges = allEdges.filter(edge => {
    const sourceInLeft = leftSections.has(edge.sourceItem.id);
    const sourceInRight = rightSections.has(edge.sourceItem.id);
    const targetInLeft = leftSections.has(edge.targetItem.id);
    const targetInRight = rightSections.has(edge.targetItem.id);

    const sourceVisible = sourceInLeft || sourceInRight;
    const targetVisible = targetInLeft || targetInRight;
    const crossPanel = (sourceInLeft && targetInRight) || (sourceInRight && targetInLeft);

    return sourceVisible && targetVisible && crossPanel;
  });

  return visibleEdges.map(edge =>
    <LinkLine
      sourceId={edge.sourceItem.id}
      targetId={edge.targetItem.id}
      sourceColor={edge.sourceItem.color}
      targetColor={edge.targetItem.color}
      label={edge.label}
    />
  );
}

// Helper: determine which panel an item is in
function findPanel(
  itemId: string,
  leftSections: Set<string>,
  rightSections: Set<string>
): 'left' | 'right' | null {
  const itemType = dataService.getItemType(itemId);
  if (!itemType) return null;
  if (leftSections.has(itemType)) return 'left';
  if (rightSections.has(itemType)) return 'right';
  return null;
}
```

**Separation of Concerns:**
- **DataService:** Provides edge data (model concern) - doesn't know about panels
- **LinkOverlay:** Handles panel layout and orientation (UI concern)
- **Future-proof:** Works with three-panel layout (each LinkOverlay connects two panels)

**Benefits:**
- No type-specific edge logic in LinkOverlay
- Easy to implement filters (by type, by panel visibility)
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
  thisItem: ItemInfo;
  outgoing: EdgeInfo[];
  incoming: EdgeInfo[];
}

interface ItemInfo {
  id: string;
  displayName: string;
  typeDisplayName: string;  // "Class", "Enum", "Slot", "Variable"
  color: string;  // Tailwind color classes for styling
}

interface EdgeInfo {
  edgeType: 'inheritance' | 'property' | 'variable_mapping';
  otherItem: ItemInfo;  // The connected item (target for outgoing, source for incoming)
  label?: string;       // For property: slot/attribute name; for variable_mapping: "mapped_to"
  inheritedFrom?: string; // For property edges only: ancestor name that defined this slot
}
```

**Key Design Decisions:**

1. **`otherItem` naming:** Works for both directions (target for outgoing, source for incoming)
2. **`inheritedFrom` only for properties:** Only property edges can be inherited (not inheritance or variable_mapping)
3. **No ternary PropertyEdgeInfo:** While property edges are conceptually ternary (class→slot→range), treating the slot as a label keeps the interface simple. The slot IS the label.

**Component Rendering:**
```typescript
// Post-refactor: Generic rendering by edge type
function RelationshipInfoBox({ itemId }: { itemId: string }) {
  const data = dataService.getRelationships(itemId);

  // Group outgoing by edge type
  const outgoingByType = groupBy(data.outgoing, edge => edge.edgeType);

  // For property edges, separate direct vs inherited
  const directProps = outgoingByType.property?.filter(e => !e.inheritedFrom) || [];
  const inheritedProps = outgoingByType.property?.filter(e => e.inheritedFrom) || [];
  const inheritedByAncestor = groupBy(inheritedProps, e => e.inheritedFrom!);

  return (
    <>
      <Section title="Outgoing">
        {/* Inheritance edge (max 1) */}
        {outgoingByType.inheritance?.map(edge =>
          <EdgeRow edge={edge} label="inherits from" />
        )}

        {/* Direct property edges */}
        {directProps.map(edge =>
          <EdgeRow edge={edge} label={edge.label} />
        )}

        {/* Inherited property edges grouped by ancestor */}
        {Object.entries(inheritedByAncestor).map(([ancestor, edges]) => (
          <InheritedGroup ancestor={ancestor}>
            {edges.map(edge =>
              <EdgeRow edge={edge} label={edge.label} />
            )}
          </InheritedGroup>
        ))}
      </Section>

      <Section title="Incoming">
        {/* Subclasses (inheritance edges) */}
        {incomingByType.inheritance?.map(edge =>
          <EdgeRow edge={edge} label="subclass" />
        )}

        {/* Classes using this via property edges */}
        {incomingByType.property?.map(edge =>
          <EdgeRow edge={edge} label={`used by ${edge.label}`} />
        )}

        {/* Variables mapping to this class */}
        {incomingByType.variable_mapping?.map(edge =>
          <EdgeRow edge={edge} label="variable" />
        )}
      </Section>
    </>
  );
}
```

**Benefits:**
- Unified EdgeInfo type for all relationship types
- No element-type-specific rendering logic (no checks for "is this a class?")
- Inherited properties clearly separated and grouped by ancestor
- Easy to add new edge types (just add to the switch/grouping)

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

### Detail Box Requirements (from REFACTOR_PLAN)

**Slot Display:**
- Slots appear as properties with clickable/hoverable ranges
- Range values clearly shown as connected nodes
- Slot metadata visible: required, multivalued, inherited_from

**Current Issues:**
- Some detail boxes not rendering slot edges properly (see TASKS.md bug #4)
- Slot metadata may not be fully displayed

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
   * Get all property edges for LinkOverlay (replaces complex type-specific logic)
   */
  getAllPropertyEdges(): EdgeInfo[];

  /**
   * Get property edges filtered by source/target types (optional future enhancement)
   */
  getPropertyEdgesForTypes(sourceTypes: string[], targetTypes: string[]): EdgeInfo[];

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
  otherItem: ItemInfo;
  label?: string;
  inheritedFrom?: string;  // For property edges only: ancestor name
}
```

**Rationale:**
- Only property edges can be inherited (not inheritance or variable_mapping edges)
- `inheritedFrom` is optional - only present for inherited property edges
- No need for separate `inheritedSlots` array structure
- Easier to filter/group in UI (just check presence of `inheritedFrom`)
- Component can group by `inheritedFrom` to show "From Entity", "From Specimen", etc.

### 3. Relationship Direction
- Elements expose `getEdges()` for outgoing edges
- Incoming edges computed on-demand via global scan
- DataService provides both in `RelationshipData`

**Rationale:**
- Outgoing edges are intrinsic to element definition
- Incoming edges are expensive to maintain (would require reverse index)
- Current on-demand computation is fine for UI responsiveness

### 4. EdgeInfo for Link Rendering

**Use existing EdgeInfo structure** (no new interface needed):
```typescript
interface EdgeInfo {
  edgeType: 'inheritance' | 'property' | 'variable_mapping';
  sourceItem: ItemInfo;  // includes id, color, panelPosition
  targetItem: ItemInfo;
  label?: string;
  inheritedFrom?: string;
}
```

**Rationale:**
- Reuses existing graph-based interface (no duplication)
- LinkOverlay filters to `edgeType === 'property'` only
- ItemInfo provides all needed rendering data (id, color, panel position)
- More information than needed, but better than maintaining duplicate interface
- Can extend with additional metadata without breaking LinkOverlay

---

## 7. FloatingBoxManager Issues

### Current Problems

**Cascade positioning bugs**:
- Non-user-positioned boxes appear on top of each other in wrong place
- Note: URL restoration positioning IS working correctly
- Code location: FloatingBoxManager.tsx:148-194

**Hover/upgrade behavior broken**:
- RelationshipInfoBox uses fixed positioning which conflicts with FloatingBox wrapper
- Fix: Refactor RelationshipInfoBox to support both transitory and persistent modes

**Architecture improvements needed**:
- Move box management logic from App.tsx to FloatingBoxManager
- Fix transitory/persistent box upgrade (currently creates new box, should modify existing)

See [TASKS.md - Unified Detail Box System](TASKS.md#unified-detail-box-system---remaining-work) for detailed issue list.

---

## 8. LayoutManager Enhancements

### Potential Improvements

**Responsive panel widths**:
- Currently fixed widths (MAX_PANEL_WIDTH = 450px, EMPTY_PANEL_WIDTH = 180px)
- Could be more responsive based on window size and content

**Panel collapse/expand animations**:
- Middle panel toggle could be smoother
- Consider CSS transitions for panel width changes

**Better gutter visualization**:
- Gutters are plain gray - could show hints about what they're for
- Consider adding visual cues when links would appear

**Status**: Low priority - current implementation works well enough for demo

---

## 9. Grouped Slots Panel

[sg] moving this to LINKOVERLAY_REFACTOR_PLAN.md

---

## 10. Quick Wins

### Exclude Unused Types

**Issue**: transform_schema.py includes all linkml:types, but only ~10 are used in BDCHM

**Fix**:
- Track which types are actually referenced in slot ranges
- Only include those types in bdchm.processed.json
- Reduces bundle size and UI clutter

**Implementation**:
- Update `scripts/transform_schema.py`
- Add type usage tracking during slot processing
- Filter types list before writing output

**Priority**: High - easy win, reduces bundle size for demo

---

## Open Questions

1. **Badge behavior:** Should edge badges show outgoing count, incoming count, or total?
2. **Edge filtering:** Should LinkOverlay allow filtering by edge type (show only inheritance)?
3. **Self-referential edges:** How to visualize class with self-reference (e.g., `parent: Specimen`)?
4. **Edge labels:** Show on hover? Always visible? Configurable?

---

## Appendix: Relationship Type Analysis

> **Source:** Extracted from DATA_FLOW.md before archiving (2025-01-24)
> This reference table documents the semantic meaning of relationships in the model.

### Relationship Type Table

This table maps semantic relationships to current and proposed implementations:

| **From** | **To** | **Current Type** | **Proposed Edge Type** | **Edge Label (UI)** | **Notes** |
|----------|--------|------------------|------------------------|---------------------|-----------|
| Class | Parent Class | `inherits` | `inherits` | "inherits from" / "is_a" | Tree structure (parent/child) |
| Class | Subclass | *(computed incoming)* | `has_subclass` | "has subclass" | Reverse of inherits |
| Class | Enum (via attribute) | `property` | `has_attribute` + `constrained_by` | "has attribute {name} constrained by {enum}" | Compound: Class→Attribute→Enum |
| Class | Class (via attribute) | `property` | `has_attribute` + `references` | "has attribute {name} referencing {class}" | Compound: Class→Attribute→Class |
| Class | Slot (via slot reference) | *(implicit in slots[])* | `uses_slot` | "uses slot" | Class references global slot |
| Class | Slot (via slot_usage override) | *(implicit in slot_usage{})* | `overrides_slot` | "overrides slot" | Class overrides global slot |
| Slot | Class/Enum (via range) | `property` | `constrained_by` | "constrained by" | Slot's range restriction |
| Enum | Class (via usage) | *(computed incoming)* | `constrains_attribute` | "constrains attribute {name} in {class}" | Reverse: Enum→Class that uses it |
| Variable | Class | `property` (label='mapped_to') | `instantiates` / `maps_to` | "instantiates" / "maps to" | Variable is instance of Class |
| Class | Variables | *(via VariableCollection grouping)* | `has_instances` | "has instances" | Reverse: Class→Variables |

---

## Success Metrics

Post-refactor, we should see:
- ✅ Fewer lines of component code (less conditional logic)
- ✅ No element type checks in LinkOverlay or RelationshipInfoBox
- ✅ Type-safe section data (no `unknown[][]`)
- ✅ `getAllPairs()` works in ~10 lines of code
- ✅ Easy to add new relationship features (filtering, highlighting, etc.)
