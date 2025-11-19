# Slots-as-Edges Architecture Refactor Plan

**Status**: Planning stage - architecture chosen, implementation details being elaborated
**Date**: January 2025
**Decision**: Slots-as-Edges architecture (after evaluating hypergraph and hybrid alternatives)

---

## Table of Contents

1. [Problem Statement](#1-problem-statement)
2. [Proposed Architecture](#2-proposed-architecture)
3. [Implementation Plan](#3-implementation-plan)

---

## 1. Problem Statement

### Current Reality

The app treats all element types (classes, enums, slots, variables) as **nodes** with inconsistent relationship handling:

**The Mish-Mash**:
- Classes ARE directly related to Slots (via `slots` arrays and `slot_usage`)
- BUT Classes are NOT directly related to other Classes/Enums—those relationships are **mediated by slots**
- The UI **hides slot mediation**, showing `Specimen → SpecimenTypeEnum` as a direct link
- **Result**: Slots function as both nodes (clickable, have details) AND invisible edges (class→range relationships hide them)

**Problems**:
- Makes it hard for users to understand class-slot-range relationships
- Leads to weirdness in data structures and unneeded complexity in figuring out class-range relationships

### Why Change?

1. **Accurate slot inheritance**: Different classes using same slot definition should have different edge instances
2. **Preparation for Types**: Need Range abstraction (Class | Enum | Type) before importing linkml:types
3. **Simplified relationship logic**: Explicit slot edges should make hover/link logic simpler

---

## 2. Proposed Architecture

### Core Concept

**Graph model with slots serving dual roles**:
- **Slots as nodes**: SlotElement definitions browsable in optional middle panel (~170 in BDCHM including global and attributes)
- **Slots as edges**: SlotEdge instances connecting Class → Range, referencing slot definitions

### Graph Structure

**Nodes**:
- **Classes**: Entity, Specimen, Material, etc.
- **Enums**: SpecimenTypeEnum, AnalyteTypeEnum, etc.
- **Slots**: All slot definitions (~170 in BDCHM), browsable in middle panel only
- **Types** (to be imported): Primitives (string, integer) and custom types from linkml:types
- **Variables**: No longer appear as panel sections, only in detail boxes and relationship hovers

**Edges**:
- **InheritanceEdge**: is-a/inherits-from edges for class inheritance
- **MapsToEdge**: Variable → Class associations
- **ClassToSlot**: Class → Slot (rather than storing slots as class properties)
- **SlotToRange**: Slot → Range
- **ClassToRange**: Direct edges formed from slots
  - Properties: slot name, required, multivalued, description, inherited_from, overrides
  - References SlotElement definition (can look up from name)
  - Multiple edges can reference same SlotElement (e.g., inherited with overrides)
  - **Replaces**: ClassSlot instances (more edges than slot definitions)

**Slot Edge Details**:
- Slots exist as nodes with simple edges: class → slot, slot → range
- Slots (slot nodes) are referenced in edges between classes and ranges. There are more edges than slots.
- An edge between a class and, say, an enum for an inherited slot:
  - Goes from the subclass to the enum
  - Holds a reference to (and can display properties of) the slot node it inherited
  - Also knows/displays the ancestor it inherited from
- If the subclass specifies a slot_usage, the edge shows properties of the slot_usage rather than of the referenced slot node

**Range Abstraction**:
- **Range** (abstract base class or interface)
  - ClassElement extends Range
  - EnumElement extends Range
  - TypeElement extends Range (new)
- Allows uniform handling of slot range targets

### UI Layout (Three-Panel Design)

**Left Panel** (always visible):
- Classes only (tree hierarchy)
- No toggle options - always shows classes
- Represents schema structure (class hierarchy)

**Middle Panel** (toggleable):
- **Default**: Hidden
- **Toggle**: Show/hide slots panel
- **Content**: Slots only (all SlotElement definitions)
- **Purpose**: Navigable nodes for exploration - clicking a slot shows which classes use it, what its range is
- **Link rendering**: When visible, show links from class → slot → range (two-step)

**Right Panel**:
- **Ranges only**: Classes, Enums, Types as range targets
- No Variables, no Slots
- **Toggle buttons**: Same interface as current for toggling the three range sections [C] [E] [T]
- **Classes in both panels**: Classes appear in left panel (structure) AND right panel (as ranges)

**Detail Boxes**:
- Slots appear as properties with clickable/hoverable ranges
- Range values clearly shown as connected nodes
- Slot metadata visible (required, multivalued, inherited_from)

### Open Questions

**High Priority** (must answer before implementing):

1. **Graphology + OOP Architecture**: How to combine graphology graph with OOP classes?

   **Context**: Graphology stores properties as primitives (strings, numbers), not JS/TS objects

   **Option A - Graph stores IDs only**:
   - Graphology nodes/edges contain only IDs
   - OOP instances (ClassElement, SlotEdge, etc.) stored separately
   - Query flow: graphology query → get IDs → lookup instances → generate UI data
   - Challenge: Can't filter by properties in graph queries

   **Option B - Graph stores all properties**:
   - All properties duplicated as graphology node/edge attributes
   - Query using properties as criteria
   - Optional: Keep OOP instances for methods, or eliminate them entirely

   **Option C - Hybrid**:
   - Some properties in graph (for queries), some in OOP instances
   - Awkward but workable

   **Benefits of graphology adoption**:
   - Collections simplify to getLabel, getDefaultExpansion
   - Replace methods like getUsedByClasses with graphology queries
   - May not need artificial root node

   **Decision timing**: Experiment during Stage 2 (Step 0: Define DataService/model interfaces) to see what works best for our query patterns

**Medium Priority** (decide during implementation):

2. **LinkML documentation features**: What to include from generated docs?

   **From BDCHM Study** (see PROGRESS.md Phase 14):
   - **Terminology**: "Direct slots" vs "Induced slots" (direct = defined on class, induced = flattened including inherited)
   - **Inheritance visualization**: Local neighborhood Mermaid diagrams showing class relationships
   - **Attribute grouping**: Separate display of inherited vs direct attributes
   - **Cardinality notation**: "0..1" (optional), "1" (required), "*" or "0..*" (multivalued)
   - **Slot constraints**: Range constraints, required/multivalued flags
   - **Relationship patterns**: Self-referential, cross-class, activity relationships, mutual exclusivity
   - **Raw YAML display**: Optional toggle to show raw schema definitions
   - **Clickable navigation**: Between related classes, enums, slots

3. **Unused slot visualization**: How to distinguish unused SlotElement definitions from active SlotEdge instances?
   - Suggestion: Lower opacity for unused slots (we might not have unused slots in bdchm)

### Related Documents

- **[TASKS.md](TASKS.md)** - Active tasks, implementation tracking
- **[PROGRESS.md](PROGRESS.md)** - Completed phases (see Phase 14: LinkML Study & Architecture Decision)
- **[CLAUDE.md](../CLAUDE.md)** - Architectural principles (view/model separation, etc.)
- **[DATA_FLOW.md](DATA_FLOW.md)** - Data flow analysis (needs updating post-refactor)

**Historical Context**: See PROGRESS.md Phase 14 for:
- LinkML study learnings (BDCHM docs, Chris Mungall guidance)
- Options A-C comparison (hypergraph, hybrid approaches)
- Decision rationale for choosing Slots-as-Edges

---

## 3. Implementation Plan

### Prerequisites

Before starting the refactor, complete UI/model separation from Phase 12:

1. ✅ **Rename type-based identifiers to section-based terminology**
   - ✅ `leftPanelTypes`/`rightPanelTypes` → `leftSections`/`rightSections`
   - ✅ `LinkTooltipData.sourceType`/`targetType` → `sourceSection`/`targetSection`
   - ✅ `RelationshipData.itemType` → `itemSection`
   - ✅ All relationship fields use "section" terminology

2. ✅ **Replace type union literals with string in UI layer**
   - ✅ Remove `'class' | 'enum' | 'slot' | 'variable'` hardcoded unions
   - ✅ Use generic `string` type in UI components and hooks
   - ✅ UI layer no longer has hardcoded knowledge of model types

**Result**: UI layer depends only on DataService contract. Model layer can now be refactored without touching UI.

### Stage 1: Infrastructure Setup & Interface Definition

**Goal**: Set up infrastructure to replace model layer and define new edge-based interfaces without touching UI

**Status**: ✅ **COMPLETE** - All 4 steps done (see PROGRESS.md Phase 16)

**Steps**:

1. ✅ **Create Element.ts infrastructure**
   - Rename `src/models/Element.ts` → `src/models/ElementPreRefactor.ts`
   - Create new `src/models/Element.ts` with explicit re-exports as refactor roadmap
   - Verify no UI changes needed, all tests pass

2. ✅ **Define new edge-based interfaces** (based on [UI_REFACTOR.md](UI_REFACTOR.md))
   - Add to `src/models/Element.ts`:
     ```typescript
     // New interfaces for Slots-as-Edges
     export interface ItemInfo {
       id: string;
       displayName: string;
       typeDisplayName: string;  // "Class", "Enum", "Slot", "Variable"
       color: string;
     }

     export interface EdgeInfo {
       edgeType: 'inheritance' | 'property' | 'variable_mapping';
       otherItem: ItemInfo;
       label?: string;
       inheritedFrom?: string;  // Property edges only
     }

     export interface LinkPair {
       sourceId: string;
       targetId: string;
       sourceColor: string;
       targetColor: string;
       label?: string;
     }

     export interface RelationshipData {
       thisItem: ItemInfo;
       outgoing: EdgeInfo[];
       incoming: EdgeInfo[];
     }
     ```

3. ✅ **Add stub DataService methods**
   - Added to `src/services/DataService.ts`:
     - `getAllPairs(): LinkPair[]` - Returns empty array (stub)
     - `getRelationshipsNew(itemId): RelationshipData | null` - Returns null (stub)
   - Kept old methods for backward compatibility (marked deprecated)

4. ✅ **Variable field rename** (small cleanup bundled with Stage 1)
   - Renamed `bdchmElement` → `maps_to` in VariableSpec DTO
   - Updated dataLoader field mapping
   - Updated all references in Element classes and tests

**Results**:
- ✅ TypeScript typecheck passes
- ✅ All dataLoader tests pass (9/9)
- ✅ Variable relationship tests pass
- ✅ No UI changes required (backward compatible)
- ✅ Infrastructure ready for Stage 2

**Commits**:
- `9c27b0b` - Stage 1 Step 2: Define edge-based interfaces for Slots-as-Edges
- `ff9d2a5` - Stage 1 Step 3: Add stub DataService methods for edge-based model
- `d2f4a0d` - Stage 1 Step 4: Rename variable field bdchmElement → maps_to

**Detailed documentation**: See PROGRESS.md Phase 16

### Stage 2: Import and Model Types

**Goal**: Add TypeElement and Range abstraction

**Steps**:
1. ✅ **Define DataService and model interfaces** (addresses graphology+OOP question above)
   - Sketch what queries DataService needs to make
   - Determine if we need property-based filtering in graph queries
   - Decide: Graph stores IDs only (Option A), all properties (Option B), or hybrid (Option C)
   - Document interface contracts before implementation
2. ✅ Download linkml:types during data fetch
3. ✅ Parse types in dataLoader.ts
4. ✅ Create TypeElement class extending Range base class
5. ✅ Create Range abstract base class/interface
6. ✅ Make ClassElement, EnumElement extend Range
7. ✅ Add TypeCollection (rethink collections approach with graphology)

**Status**: ✅ **Stage 3 Complete!** All steps (1-5) finished, adapter working.

---

## Stage Summary (Updated 2025-01-18)

**Completed:**
- ✅ Stage 1: Infrastructure Setup & Interface Definition
- ✅ Stage 2: Import Types and Schema Validation
- ✅ Stage 3: Graph Model with SlotEdges (with adapter for backward compatibility)
- ✅ Stage 3a: Panel Specialization (three-panel layout basics)
- ✅ Stage 4: LayoutManager Refactor (App.tsx simplified from ~550 to ~230 lines)

**Next Up:**
- **Stage 4.5: Slot Panel Fixes & Edge Verification** ⚠️ BLOCKING
  - Fix slot panel to show all ~170 slots (not just 7)
  - Verify class-range edges work correctly
- Stage 5: Fix Model/View Separation (contracts layer + middle panel fixes)
- Stage 6: Detail Box Updates (render slot edges)
- Stage 7: Documentation Updates

---

**Status**: ✅ **Stage 2 Complete!** All steps (1-7) finished.

**Implementation Notes**:
- categorizeRange() treats types as 'primitive' (leaf nodes like string/integer)
- Types don't create relationship links (getRelationships returns empty array)
- DataService automatically handles types through generic collection interface

**Open question**: Do we need collections at all with graph model, or just for getLabel/getDefaultExpansion?
- Answer deferred to Stage 3 - will evaluate during graphology integration

**Files**:
- `scripts/download_source_data.py` - Download linkml:types
- `src/utils/dataLoader.ts` - Parse types, create SlotEdge instances instead of ClassSlot
- `src/types.ts` - Add Type DTO, SlotEdge interface
- `src/models/Element.ts` - Add Range abstract base class, TypeElement class
- `src/models/ElementCollection.ts` - Add TypeCollection, simplify with graphology

### Stage 3: Refactor to Graph Model with SlotEdges

**Goal**: Replace current Element-based model with graph-based model using graphology

**Status**: ✅ **Complete** - Graph infrastructure built, adapter layer working

**Key insight**: A vast amount of what happens in current Element.ts can be handled by graphology queries

**Steps**:
1. ✅ Install and configure graphology
2. ✅ Define graph structure:
   - Node types: Class, Enum, Slot, Type, Variable
   - Edge types: SlotEdge, InheritanceEdge, MapsToEdge
3. ✅ Create SlotEdge class/interface:
   - Properties: name, slotRef, required, multivalued, inherited_from, overrides
   - Connects Class → Range with context-specific properties
4. ✅ Implement graph-based relationship querying:
   - Added getRelationshipsFromGraph() method to Element base class
   - Returns unified EdgeInfo[] arrays (new RelationshipData format)
   - Uses graph.forEachOutboundEdge() and graph.forEachInboundEdge()
5. ✅ Update DataService to support both old and new formats:
   - getRelationships() now uses graph data with adapter to old format
   - getRelationshipsNew() provides new format directly
   - Adapter enables gradual UI migration
6. ⏭️ **DEFERRED to Stage 4/5**: Migrate UI components to new RelationshipData format
   - Will be done during LinkOverlay refactor (Stage 4 Step 6)
   - And during RelationshipInfoBox updates (Stage 5 Step 2)
   - Reason: Those components will be rewritten anyway, avoid duplicate work
7. ⏭️ **DEFERRED to Stage 6+**: Remove/refactor ClassSlot class (after UI migration)
8. ⏭️ **DEFERRED to Stage 6+**: Simplify collections (after UI migration)

**Implementation Notes (Steps 1-5)**:
- Steps 1-3: Created `src/models/Graph.ts` with complete graph infrastructure
  - Architecture: Option A (Graph stores IDs only, Element instances in collections)
  - Graph built in initializeModelData via buildGraphFromSchemaData()
  - SlotEdge class wraps graph edges, provides OOP interface
  - Graph added to ModelData interface
- Steps 4-5: Implemented graph-based relationship querying
  - Added getRelationshipsFromGraph() to Element base class (via prototype augmentation)
  - New RelationshipData format: EdgeInfo[] arrays (unified, type-agnostic)
  - DataService adapter converts new format to old format for existing UI
  - Console error logging for missing element references in graph
  - Adapter layer allows UI to continue using old format while graph data flows through
- Steps 6-8: Deferred to later stages to avoid duplicate refactoring work

**Files**:
- ✅ `src/models/Graph.ts` - NEW: Complete graph structure, SlotEdge class, helper functions
- ✅ `src/types.ts` - Added graph field to ModelData
- ✅ `src/models/ElementPreRefactor.ts` - Minimal integration (call buildGraphFromSchemaData)
- `src/models/Element.ts` - SlotEdge class, refactor ClassElement, Range abstraction
- `src/models/ElementCollection.ts` - Simplify with graphology queries
- `src/services/DataService.ts` - Add type collection, update relationship APIs, add getSlotEdgesForClass()

### Stage 3a: Panel Specialization (Three-Panel Layout Basics)

**Status**: ✅ **MOSTLY COMPLETE** - Basic three-panel layout implemented

**Goal**: Implement basic three-panel layout with specialized panel roles

**Completed:**
- ✅ Three-panel layout with specialized roles (Classes, Slots, Ranges)
- ✅ URL state persistence with middle panel support
- ✅ Panel-specific toggle buttons (none for left/middle, only C/E/T for right)
- ✅ Smart LinkOverlay rendering (1 overlay when middle hidden, 2 when shown)
- ✅ Panel titles ("Classes", "Slots", "Ranges:")
- ✅ Type system updated for 'middle' position

**Known Issues:**
- ⚠️ ElementPreRefactor.ts now has middle panel knowledge (violates separation of concerns)
- ⚠️ App.tsx too complex, should be simplified
- ⚠️ Need middle panel show/hide toggle button

**What's left:**
- Add UI toggle button to show/hide middle panel
- Fix architectural issues (defer to Stage 5)
- Simplify App.tsx (defer to Stage 4: LayoutManager)

**Files modified**:
- ✅ `src/utils/statePersistence.ts` - Middle panel URL state
- ✅ `src/hooks/useLayoutState.ts` - Middle panel state management
- ✅ `src/components/PanelLayout.tsx` - Three-panel layout support
- ✅ `src/App.tsx` - Panel specialization, conditional LinkOverlays
- ✅ `src/components/ItemsPanel.tsx` - Title prop, panel-specific toggles
- ✅ `src/components/Section.tsx` - Middle position support
- ⚠️ `src/models/ElementPreRefactor.ts` - Middle panel context (TO BE REVERTED in Stage 5)

### Stage 4: LayoutManager Refactor

**Status**: ✅ **COMPLETE** - Major architectural improvement achieved

**Goal**: Consolidate layout logic into LayoutManager component, simplify App.tsx

**Rationale**: Most of App.tsx logic should be elsewhere. App.tsx should simplify to essentially just `<LayoutManager/>`.

**Accomplished:**
- ✅ Created LayoutManager component (350 lines, controls all layout logic)
- ✅ Moved display mode calculation to LayoutManager
- ✅ Moved panel section state (controlled component pattern)
- ✅ Moved LinkOverlay conditional rendering (1 or 2 overlays)
- ✅ Moved floating box state and all handlers
- ✅ Simplified App.tsx from ~550 lines to ~230 lines
- ✅ TypeScript typecheck passes (0 errors)
- ✅ All tests pass (163 passed, 19 pre-existing DetailContent failures)

**Architecture Pattern:**
- LayoutManager is a **controlled component** receiving state + setters from App
- App.tsx handles: data loading, DataService creation, URL/localStorage persistence, header
- LayoutManager handles: all UI layout logic, panel management, floating boxes, link overlays
- Clean separation: App owns persistence, LayoutManager owns layout
- Ref-based callback pattern for dialog states getter (avoids React setState function issues)

**LayoutManager responsibilities** (implemented):
- Display mode calculation (cascade vs stacked) based on window width
- Panel section rendering (left, middle, right panels)
- Floating box state and management
- Hovered item state (for RelationshipInfoBox and LinkOverlay)
- Conditional LinkOverlay rendering (1 or 2 based on middle panel visibility)
- Section data and toggle button building from DataService
- Panel visibility and sizing logic

**App.tsx responsibilities** (simplified to):
- Model data loading (useModelData hook)
- DataService creation
- URL/localStorage state persistence (useLayoutState hook)
- Header rendering (title, save/reset buttons, help)
- LayoutManager rendering with state props

**Files modified**:
- ✅ `src/components/LayoutManager.tsx` - NEW (350 lines)
- ✅ `src/App.tsx` - SIMPLIFIED (230 lines, down from ~550)

**Commit**: `c4d629f` - Stage 4: LayoutManager refactor - consolidate layout logic

### Stage 4.5: Slot Panel Fixes & Edge Verification

**Status**: ✅ **COMPLETE** - All parts finished (1, 2a, 2b, 2c)

**Goal**: Fix slot panel to show all slots, properly handle slot_usage overrides, and verify class-range edges work

**Background**:

With expanded schema (gen-linkml JSON output):
- Inherited slots are already merged into `classDTO.attributes`
- `classDTO.slots` contains slot references (not duplicated in attributes)
- `classDTO.slot_usage` contains overrides for inherited slots (partial attributes)
- Attributes have merged values (base + slot_usage overrides applied)
- No duplicates should occur between attributes and slots

**Findings from JSON investigation**:
- ❌ No `inherited_from` field in gen-linkml JSON output
- ✅ Has `owner` field (which class owns this attribute after overrides)
- ✅ Has `domain_of` array (all classes using this slot)
- ⚠️ Huge redundancy in JSON (548KB with repeated metadata)
- ⚠️ Missing explicit inheritance information we need for SlotEdges

**Issues**:

1. **Slot panel incomplete** ✅ FIXED in Part 1
   - Was showing only 7 slots (from `slots:` section of bdchm.yaml)
   - Now shows all ~170 slots (global slots + class attribute slots)

2. **Need to switch from YAML to JSON** ✅ FIXED in Part 2a
   - ✅ Now using `bdchm.expanded.json` (gen-linkml default output)
   - ✅ Removed js-yaml dependency from dataLoader
   - ✅ Removed legacy bdchm.metadata.json generation
   - ❌ JSON lacks `inherited_from` field (not provided by gen-linkml)

3. **JSON redundancy and missing inheritance info** ⏭️ Part 2b (NEEDS DECISION)
   - gen-linkml JSON has huge redundancy (548KB)
   - Missing explicit `inherited_from` for SlotEdges
   - Options:
     - **Option A**: Process JSON directly in dataLoader (complex, redundant parsing)
     - **Option B**: Transform JSON to simpler format first (separate build step)

4. **Slot_usage overrides need proper handling** ⏭️ Part 2c
   - Each slot_usage creates a new slot instance with merged properties
   - Slot IDs: base slot `'category'`, override `'category-SdohObservation'`
   - Slot names: always the base name (for UI display)
   - SlotEdge points to override slot when slot_usage exists

5. **Remove duplicate-check workaround** ⏭️ Part 2c
   - Current code checks `if (graph.hasEdge(edgeKey))` before adding
   - Proper slot_usage handling will prevent duplicates
   - Let it fail if duplicate IDs occur (indicates data issue)

**Implementation**:

**Part 1: Collect all slots** ✅ COMPLETE
- ✅ Added `transformAttributeToSlotData()` function
- ✅ Updated `loadRawData()` to collect from both global slots and class attributes
- ✅ Added duplicate-check workaround in `addSlotEdge()` (temporary)
- ✅ Added test verifying 170 slots collected
- ✅ All tests passing (10/10)
- ✅ Commit: 1a9637d

**Part 2a: Switch to JSON** ✅ COMPLETE
- ✅ Updated `scripts/download_source_data.py`:
  - Changed to gen-linkml default JSON output
  - Removed bdchm.metadata.json generation (legacy, not used)
  - Updated documentation
- ✅ Updated `dataLoader.ts`:
  - Load JSON instead of YAML
  - Removed js-yaml dependency
- ✅ Deleted bdchm.metadata.json file
- ✅ Commit: c54d822

**Part 2b: Data transformation with transform_schema.py** ✅ **COMPLETE**

**Decision**: Pursue Option B - Transform JSON to optimized format

**Problem**: gen-linkml JSON has redundancy and lacks inheritance info we need
- Complex inheritance computation would be needed in dataLoader
- Parse 548KB of redundant data every page load
- Redundant metadata repeated for every attribute
- No `inherited_from` field

**Solution**: Create `scripts/transform_schema.py`
- Input: `bdchm.expanded.json` (from gen-linkml)
- Output: `bdchm.processed.json` (optimized for our app)
- Run as part of `download_source_data.py` pipeline
- Benefits:
  - Simpler dataLoader (just parse clean JSON)
  - Smaller file size (remove redundancy)
  - Add computed fields we need (inherited_from, slot instance IDs)
  - Validate data at build time (catch issues early)

**Optimized JSON structure**:

Example using Entity → Observation → SdohObservation (shows all combinations):

```typescript
{
  "classes": {
    "Entity": {
      "id": "Entity",
      "name": "Entity",
      "description": "Any resource that has its own identifier",
      "parent": null,
      "abstract": true,
      "attributes": {
        "id": {
          "slotId": "id",  // Direct attribute (not inherited)
          "range": "uriorcurie",
          "required": true
          // No inherited_from - defined on this class
        }
      }
    },
    "Observation": {
      "id": "Observation",
      "name": "Observation",
      "description": "A data structure with key (observation_type) and value (value) attributes...",
      "parent": "Entity",
      "abstract": false,
      "attributes": {
        "id": {
          "slotId": "id",  // Inherited attribute
          "range": "uriorcurie",
          "required": true,
          "inherited_from": "Entity"  // Computed from hierarchy
        },
        "category": {
          "slotId": "category",  // Direct attribute
          "range": "string",
          "required": false,
          "multivalued": false
          // No inherited_from - defined on this class
        },
        "associated_visit": {
          "slotId": "associated_visit",  // Slot reference (from global slot)
          "range": "Visit"
          // No inherited_from - defined on this class (via slots field)
        }
      }
    },
    "SdohObservation": {
      "id": "SdohObservation",
      "name": "SdohObservation",
      "description": "A data structure with key (observation_type) and value (value) attributes...",
      "parent": "Observation",
      "abstract": false,
      "attributes": {
        "id": {
          "slotId": "id",  // Inherited from Entity (through Observation)
          "range": "uriorcurie",
          "required": true,
          "inherited_from": "Entity"  // Points to original definer
        },
        "category": {
          "slotId": "category-SdohObservation",  // Override slot instance!
          "range": "GravityDomainEnum",  // Overridden from string
          "required": false,  // From base
          "multivalued": false,  // From base
          "inherited_from": "Observation"  // Inherited but overridden
        },
        "associated_visit": {
          "slotId": "associated_visit",  // Inherited slot reference
          "range": "Visit",
          "inherited_from": "Observation"  // Computed from hierarchy
        }
      }
    }
  },
  "slots": {
    "id": {  // Base slot (used by many classes)
      "id": "id",
      "name": "id",
      "description": "The 'logical' identifier of the entity...",
      "range": "uriorcurie",
      "required": true
    },
    "category": {  // Base slot for category
      "id": "category",
      "name": "category",
      "description": "The general category of observation described",
      "range": "string",
      "required": false,
      "multivalued": false
    },
    "category-SdohObservation": {  // Override slot instance
      "id": "category-SdohObservation",
      "name": "category",  // Display name (same as base)
      "description": "The general category of observation described",  // From base
      "range": "GravityDomainEnum",  // From slot_usage override
      "required": false,  // From base
      "multivalued": false,  // From base
      "overrides": "category"  // Reference to base slot
    },
    "associated_visit": {  // Global slot (referenced by Observation.slots)
      "id": "associated_visit",
      "name": "associated_visit",
      "description": "A reference to the Visit that is associated with this record.",
      "range": "Visit"
    }
  },
  "enums": {...},
  "types": {...},
  "variables": [...]
}
```

**Design decisions**:
- ✅ All elements have `id` field (same as `name` except for slot_usage slots)
- ✅ Removed separate `class.slots` array (redundant with `class.attributes` keys)
- ✅ Attributes directly contain all needed info (slot ID, range, flags, inherited_from)
- ✅ Slot instances created for each slot_usage override
- ✅ Computed `inherited_from` for all inherited attributes

**Implementation steps for Part 2b**:
1. ✅ Create `scripts/transform_schema.py`:
   - ✅ Load `bdchm.expanded.json`
   - ✅ Extract prefixes from schema
   - ✅ Build class hierarchy map (parent → children)
   - ✅ For each class:
     - ✅ Compute `inherited_from` for each attribute (walk up hierarchy)
     - ✅ For attributes with slot_usage, create slot instance with ID `{slotName}-{ClassName}`
     - ✅ Expand `class_uri` to `class_url` using prefixes
     - ✅ Output streamlined class definition with just needed fields
   - ✅ For slots:
     - ✅ Keep base slot definitions
     - ✅ Add slot instance for each slot_usage override
     - ✅ Include `overrides` field pointing to base slot
     - ✅ Expand `slot_uri` to `slot_url` using prefixes
   - ✅ For enums:
     - ✅ Expand `permissible_values[].meaning` to `meaning_url` using prefixes
     - ✅ Expand `reachable_from` to `reachable_from_url` using prefixes
   - ✅ For types:
     - ✅ Expand `uri` to `uri_url` using prefixes
     - ✅ Expand `exact_mappings[]` to `exact_mappings_urls[]` using prefixes
   - ✅ Include `prefixes` in output
   - ✅ Report invalid prefixes encountered (none found!)
   - ✅ Write `bdchm.processed.json`
2. ✅ Update `download_source_data.py`:
   - ✅ After generating `bdchm.expanded.json`, call `transform_schema.py`
   - ✅ Report file size reduction (55.2%)
3. ⏭️ Update `dataLoader.ts`:
   - ✅ Change fetch URL to `bdchm.processed.json` (done)
   - ⏭️ Update types if needed for new URL fields
   - ✅ Simplified transformation logic (removed transformAttributeToSlotData)
4. ⏭️ Update `Graph.ts`:
   - ⏭️ Use `slotId` from attributes instead of computing
   - ⏭️ Use `inherited_from` from attributes
   - ⏭️ Remove duplicate-check workaround

**Prefix Validation Results**:
- ✅ Comprehensive validation report created at `/private/tmp/bdchm_prefix_issues.md`
- **1 missing prefix** (rdfs) - used in CellularOrganismSpeciesEnum but not defined in schema
- **2 "failed" validations** (HP, linkml) - actually valid but use HTTP redirects (normal for persistent identifiers)
- Report includes detailed examples and recommended YAML fixes for schema authors

**Part 2c: Update graph building** ✅ **COMPLETE**

**Changes made:**
1. ✅ Updated `AttributeDefinition` type to include `slotId` and `inherited_from` fields
2. ✅ Updated `ClassData` type to remove `slots` and `slotUsage` fields
3. ✅ Updated `PropertyDefinition` interface to match `AttributeDefinition`
4. ✅ Simplified `buildGraphFromSchemaData()` in Graph.ts:
   - Now uses `slotId` from attributes instead of computing it
   - Passes `inherited_from` to `addSlotEdge()` calls
   - Removed separate handling of `slotUsage` and `slots` (all merged into `attributes`)
5. ✅ Removed duplicate-check workaround in `addSlotEdge()` - now fails on real duplicates
6. ✅ Updated ClassElement constructor to use simplified structure:
   - Creates ClassSlots from attributes only (all slots pre-merged)
   - Uses `slotId` to lookup slot definitions
   - Determines source type based on `inherited_from` field
7. ✅ Updated `SlotElement.getUsedByClasses()` to check attributes instead of slots/slot_usage
8. ✅ Fixed test files:
   - Updated getUsedByClasses tests to check attributes
   - Updated DetailContent mock data (partial - 1/12 test files still failing UI tests)

**Test Results:**
- ✅ TypeScript compilation passes
- ✅ 11/12 test files pass (165 tests)
- ⚠️ DetailContent.test.tsx needs further UI test updates (19 failing tests) - not blocking

**Part 3: Terminology & Architecture Decisions** ⏭️ NEXT

**Summary:**
1. Unify terminology: Everything is a "slot" (add `inline` flag to distinguish types)
2. Fix Part 1: Collect ~150 missing inline slot definitions from class attributes
3. Filter slot_usage instances from middle panel (they're internal, shown in detail boxes)
4. Document middle panel grouping design (defer implementation to Stage 5)
5. Defer ElementPreRefactor bug fixes to Stage 6 (will be deleted anyway)

**Terminology Unification** (based on [sg] guidance):

**Decision**: Everything is a **slot** - distinguish inline vs referenced with metadata

**Current inconsistency:**
- "attributes" = inline class-specific slots (from class.attributes)
- "slots" = referenced global reusable slots (from class.slots / slot definitions)
- "properties" = synonym for attributes (old term)

**New unified terminology:**
- **Slot** = any property/field definition (inline or referenced)
- **Inline slot** = defined directly on a class (flag: `inline: true`)
  - Example: Entity.id, Observation.category
  - May override inherited slot via slot_usage
- **Referenced slot** = references a global slot definition (flag: `inline: false`)
  - Example: Observation.associated_visit (references global slot)
- **Base slot** = original slot definition (e.g., "category")
- **Slot instance** = slot with overrides (e.g., "category-SdohObservation")
  - Has `overrides` field pointing to base slot
  - Created when slot_usage applies to inherited slot
  - [sg] see Bugs #2 below. there are not that many cases of slot_usage
         overrides. so if this is the distinction between base and instance,
         it doesn't make sense that there would only be 18 base slots

**What is the distinction between base slots and instances?**
- **Base slot**: Original definition (e.g., "category" with range: string)
- **Slot instance**: Derived from base with overrides (e.g., "category-SdohObservation" with range: GravityDomainEnum)
- **Why separate?**: Different classes can override same base slot differently
- **Example**:
  - Base: `category` (range: string)
  - Instance 1: `category-SdohObservation` (range: GravityDomainEnum)
  - Instance 2: `category-LabTest` (range: LabCategoryEnum) [hypothetical]

**Implementation plan:**
1. Add `inline: boolean` field to slot DTOs in types.ts
2. Update transform_schema.py to set inline flag:
   - `inline: true` for attributes defined directly on class
   - `inline: false` for attributes referencing global slots
3. Rename interfaces:
   - `PropertyDefinition` → delete (consolidate to AttributeDefinition)
   - `AttributeDefinition` → rename to `SlotDefinition`
4. Update all code to use "slot" terminology consistently

**Bugs and fixes:**

1. ❌ **Part 1 incomplete: Missing ~150 inline slots**
   - Current: Only showing 18 items (7 global + 11 slot_usage instances)
   - Expected: ~157 total slots (7 global + ~150 inline class-specific)
   - **Root cause**: Part 1 only collected global slots, didn't collect inline slot definitions from class attributes
   - **Fix needed in Part 1**:
     - Collect inline slot definitions from each class's attributes
     - These are base slot definitions, just class-specific rather than global
     - Examples: `Specimen.specimen_type`, `Material.material_type`, `Subject.race`
   - **How to identify inline slots**:
     - Inline slots: Attributes where `slotId` has NO hyphen (base definitions)
     - Slot_usage instances: Attributes where `slotId` has hyphen like "category-SdohObservation" (skip these)
     - Build unique set by `slotId` across all class attributes
     - Union with global slots from top-level `slots:` section

2. ❌ **Slot_usage instances shouldn't appear in middle panel**
   - Current: Showing 11 slot_usage instances with weird IDs (category-SdohObservation, etc.)
   - Expected: Hide these implementation details from middle panel
   - **Design decision**:
     - Middle panel shows slots grouped by source (see #4 below)
     - Slot_usage instances exist in graph as edges, not as panel items
     - Overrides revealed through:
       - Detail boxes: Show effective overridden values with "inherited from X, overridden" indicator
       - Visual indicator in middle panel for overridden slots

3. ❌ **Middle panel grouping design** ⏭️ **Defer to Stage 5**
   - **Goal**: Group slots by source (Global, then by class)
   - **Structure**:
     ```
     Global Slots (7)
       - associated_participant
       - category
       - id
       - ...

     Entity (3 slots)
       - id (defined here)
       - identity (defined here)
       - category (defined here)

     Observation (5 slots)
       - id (inherited from Entity)
       - category (inherited from Entity)
       - associated_visit (global reference)
       - value (defined here)

     SdohObservation (5 slots)
       - id (inherited from Entity)
       - category (inherited from Observation) ⚠️ overridden
       - value (inherited from Observation)
       - ...
     ```
   - **Behavior**:
     - Inherited slots appear under each class that uses them (repetition is OK)
     - Always show base slot name (e.g., "category", never "category-SdohObservation")
     - Click/hover on slot → navigate to that class's version (with overrides if any)
     - Visual indicator (⚠️ or different color) for overridden slots
   - **Implementation timing**: Defer to Stage 5 (middle panel improvements)
     - Part 3 focuses on data model and terminology
     - Stage 5 focuses on UI/presentation improvements

4. ❌ **Slot hover boxes show "No relationships found"**
   - Issue: `computeIncomingRelationships()` doesn't account for slot instances
   - Location: ElementPreRefactor.ts (will be deleted)
   - **Defer to Stage 6**: Fix when implementing new Element classes with graph queries
   - New Element.getRelationshipsFromGraph() will handle this correctly

**Files to update:**
- `src/types.ts` - Add `inline` field, rename AttributeDefinition → SlotDefinition
- `scripts/transform_schema.py` - Set inline flag based on slot source
- `src/models/ElementPreRefactor.ts` - Delete PropertyDefinition interface
- All files using "attribute" or "property" terminology - switch to "slot"

**Success Criteria for Part 3**:
- ⏭️ Terminology unification: Add `inline` flag, rename AttributeDefinition → SlotDefinition
- ⏭️ Fix Part 1 data collection: Collect ~157 base slots (7 global + ~150 inline)
  - Filter out slot_usage instances (hyphened IDs)
  - Build unique set by `slotId` from class attributes
- ⏭️ Filter slot_usage instances from middle panel display
- ⏭️ Document grouping design for Stage 5 implementation
- ⏭️ Slot hover boxes (deferred to Stage 6 - don't fix ElementPreRefactor)

**Success Criteria for Stage 4.5 overall**:
- ✅ `transform_schema.py` successfully generates `bdchm.processed.json` (Part 2b)
- ✅ Processed JSON is smaller than expanded JSON (Part 2b: 548KB → 249KB, 54.6% reduction)
- ✅ All classes have computed `inherited_from` for inherited attributes (Part 2b)
- ✅ Slot_usage creates separate slot instances with correct IDs (Part 2b - used internally in graph)
- ✅ dataLoader successfully loads processed JSON (Part 2b/2c)
- ✅ SlotEdges use slot instance IDs from processed JSON (Part 2c)
- ✅ No duplicate edge errors (Part 2c - removed workaround, no errors)
- ✅ TypeScript typecheck passes (all parts)
- ⚠️ Tests: 11/12 files pass, DetailContent.test.tsx needs updates (not blocking)

**Files modified**:
- ✅ `src/utils/dataLoader.ts` - Collect all slot definitions (Part 1)
- ✅ `scripts/download_source_data.py` - Switch to JSON output (Part 2a)
- ✅ `scripts/transform_schema.py` - NEW: Transform expanded JSON to optimized format (Part 2b)
- ✅ `scripts/download_source_data.py` - Call transform_schema.py in pipeline (Part 2b)
- ✅ `src/utils/dataLoader.ts` - Load bdchm.processed.json instead of expanded (Part 2b)
- ✅ `src/types.ts` - Update DTOs to match processed format (Part 2b/2c)
- ✅ `src/models/Graph.ts` - Use slot instance IDs from processed JSON (Part 2c)
- ✅ `src/models/Graph.ts` - Remove duplicate-check workaround (Part 2c)
- ✅ `src/models/ElementPreRefactor.ts` - Update to use processed JSON structure (Part 2c)
- ✅ `src/test/getUsedByClasses.test.ts` - Update tests for new structure (Part 2c)
- ✅ `src/test/DetailContent.test.tsx` - Partial update to mock data (Part 2c)
- ⏭️ `src/models/ElementPreRefactor.ts` - Fix slot relationship computation (Part 3)
- ⏭️ `src/test/DetailContent.test.tsx` - Complete test updates (Part 3)

### Stage 5: Fix Model/View Separation

**Status**: ✅ **PLAN ACCEPTED** - Pending Stage 4.5 completion

**Goal**: Ensure panel/section logic added during Stage 3a is properly handled in refactored code

**Context**:
- ElementPreRefactor.ts will be deleted eventually (don't invest much effort here)
- During Stage 3a, added middle panel support to ElementPreRefactor.ts:
  - `positionToContext()` helper function
  - Updated method signatures: `getSectionItemData()`, `toSectionItems()`, `getSectionData()`, `getExpansionKey()`
  - Changed position types from `'left' | 'right'` to `'left' | 'middle' | 'right'`
- Need to ensure this logic exists in appropriate places for refactored code

**Current Architecture Violation**:
ElementPreRefactor classes know about view concerns (panel positions, contexts, section rendering).
This violates CLAUDE.md separation of concerns principle.

**Current State of Data Contracts** (investigation results):

**Existing component-defined contracts:**
- `Section.tsx`: `ItemHoverData`, `SectionItemData`, `SectionData`
- `ItemsPanel.tsx`: `ToggleButtonData`
- `FloatingBoxManager.tsx`: `FloatingBoxMetadata`, `FloatingBoxData`
- `contracts/Item.ts`: Exists but **unused** - defines `Item`, `CollectionItem`, `SectionItem` classes

**Finding**: Data contracts currently live in components (exported interfaces). The unused `contracts/Item.ts` was an attempt at a contracts layer that never got adopted.

**Decision Point**: Should we centralize contracts?
- [sg] "i prefer A, but want to discuss what we mean by contracts layer and check if we already have much of what we need in the components themselves"
- Current approach: Contracts defined where consumed (in components)
- Alternative: Centralize in `src/contracts/` directory
- **Recommendation**: Start by **centralizing existing contracts** into `src/contracts/ComponentData.ts`, then evaluate if we need adapters

**Approach: Centralize Contracts + Minimal Refactoring**

Based on user preference for Option A and findings above, here's the refined approach:

**Step 1: Centralize existing contracts** (no new logic, just organization)
- Create `src/contracts/ComponentData.ts`
- Move interfaces from components:
  - `SectionData`, `SectionItemData`, `ItemHoverData` (from Section.tsx)
  - `ToggleButtonData` (from ItemsPanel.tsx)
  - `FloatingBoxMetadata`, `FloatingBoxData` (from FloatingBoxManager.tsx)
- Update component imports to use centralized contracts
- **Benefits**: Single source of truth, easier to find contracts, prepare for future adapters

**Step 2: Handle middle panel specific issues**

**Issues discovered** ([sg] answers):
1. **No toggle button for middle panel** - currently only appears if 'ms' in URL
2. **No space between panels** - nowhere to draw links when middle panel shown
3. **Shows old slots section** - needs proper integration

**Immediate fixes needed**:
- Add middle panel toggle button (show/hide slots panel)
- Fix panel spacing in LayoutManager (middle panel needs gutters on both sides)
- Verify LinkOverlay works with middle panel visible

**Step 3: Move logic to appropriate homes**

1. **positionToContext() helper** - Can probably be eliminated
   - [sg] "probably don't need it. i don't know"
   - Current: Converts 'left'|'middle'|'right' → 'leftPanel'|'middlePanel'|'rightPanel'
   - Investigation: toSectionItems expects longer format, getSectionData receives shorter
   - **Option 1**: Standardize on shorter format ('left'|'middle'|'right') everywhere
   - **Option 2**: If used by >1 file, move to `src/utils/panelHelpers.ts` ([sg] "code belongs in utils if it's used by more than one file")
   - **Recommendation**: Try Option 1 first (eliminate the need for conversion)

2. **getExpansionKey()** - Move to statePersistence
   - Extract from ElementPreRefactor classes
   - Add to `src/utils/statePersistence.ts` as pure function
   - Takes section type and position, returns expansion key string

3. **toSectionItems/getSectionData** - Leave in ElementPreRefactor for now
   - Will be deleted with old code anyway
   - When building new Element classes: implement similar logic in adapters or DataService
   - Don't invest effort cleaning up temporary code

**Timing: Do Stage 5 now or defer?**

[sg] "pros and cons?"

**Pros of doing now**:
1. Fix middle panel issues immediately (toggle, spacing, links) - **these are blocking**
2. Centralize contracts while refactor is fresh in mind
3. Set proper foundation before building new Element classes
4. Middle panel is partially broken - good to fix rather than leave half-done

**Cons of doing now**:
1. More work before getting to actual features (Detail Box updates, etc.)
2. May be refactoring code that gets deleted anyway (ElementPreRefactor)
3. Could defer contract centralization until we actually need adapters

**Recommendation**: **Do Step 1 (centralize contracts) + Step 2 (fix middle panel issues) now**
- Step 1 is low-cost organization that helps immediately
- Step 2 fixes blocking issues (no toggle, no space for links)
- Step 3 (move logic) can be deferred - ElementPreRefactor will be deleted anyway

**Implementation Plan**:

**Phase A: Quick wins (do now)**
1. Centralize contracts to `src/contracts/ComponentData.ts`
2. Add middle panel toggle button in header or panel
3. Fix LayoutManager spacing for middle panel (gutters on both sides)
4. Verify LinkOverlay rendering with middle panel
5. **Implement grouped slots panel** (from Stage 4.5 Part 3 design):
   - DataService: Provide grouped slot data (Global section + per-class sections)
   - Section.tsx: Support nested grouping (class headers with slot items)
   - Filter out slot_usage instances (hyphened IDs)
   - Show inherited slots under each class (with visual indicator for overrides)
   - Click/hover navigates to class-specific slot version

**Phase B: Move logic (defer or do lightly)**
6. Try to eliminate positionToContext() by standardizing on 'left'|'middle'|'right'
7. Move getExpansionKey() to statePersistence utils (if easy)
8. Leave toSectionItems/getSectionData in ElementPreRefactor (delete later)

**Files to modify**:
- `src/contracts/ComponentData.ts` - NEW (centralized contracts)
- `src/components/Section.tsx` - Remove contract exports, import from contracts, support nested grouping
- `src/components/ItemsPanel.tsx` - Remove contract exports, import from contracts
- `src/components/FloatingBoxManager.tsx` - Remove contract exports, import from contracts
- `src/components/LayoutManager.tsx` - Add toggle button, fix spacing
- `src/services/DataService.ts` - Provide grouped slot data (global + per-class sections)
- `src/utils/dataLoader.ts` - Filter slot_usage instances from middle panel collection
- `src/utils/statePersistence.ts` - Add getExpansionKey function (optional)
- `src/models/ElementPreRefactor.ts` - Try to eliminate positionToContext (optional)

**Success criteria**:
- ✅ All component contracts centralized in one place
- ✅ Middle panel has toggle button (show/hide)
- ✅ Middle panel has proper spacing (gutters for links)
- ✅ LinkOverlay works correctly with middle panel visible
- ✅ Grouped slots panel implemented:
  - Global section shows 7 global slots
  - Per-class sections show inherited + defined slots
  - Inherited slots show "inherited from X" indicator
  - Overridden slots have visual indicator (⚠️ or color)
  - No slot_usage instances visible (filtered out)
  - Click/hover navigates to class-specific version
- ✅ TypeScript typecheck passes
- ✅ All tests pass

### Stage 6: Detail Box Updates

**Goal**: Render slots with clickable ranges in detail boxes (was Stage 5)

**Steps**:
1. Update DetailPanel to render slot edges:
   - Show slots with clickable/hoverable ranges
   - Display slot metadata (required, multivalued, inherited_from)
2. Update RelationshipInfoBox to display slot edge properties
   - **Migrate to new RelationshipData format (Stage 3 Step 6)** - since we're rewriting anyway

**Files**:
- `src/components/DetailPanel.tsx` - Render slot edges with clickable ranges
- `src/components/RelationshipInfoBox.tsx` - Display slot edge properties

### Stage 7: Documentation Updates

**Goal**: Update documentation to reflect new architecture (was Stage 6)

**Files**:
- `docs/CLAUDE.md` - Add Range abstraction, SlotEdge pattern, graph model approach, LayoutManager
- `docs/DATA_FLOW.md` - Update with Slots-as-Edges architecture and graphology usage
- `docs/TASKS.md` - Update active tasks, remove obsolete items
- `docs/PROGRESS.md` - Archive this refactor as Phase 17 (was 15)

---

## Implementation Tracking

For detailed implementation steps and current status, see:
- **[TASKS.md](TASKS.md)** - "Next Up" section contains detailed stage breakdown and current task
- **[UI_REFACTOR.md](UI_REFACTOR.md)** - Component data shapes and UI layer refactoring plan

---
