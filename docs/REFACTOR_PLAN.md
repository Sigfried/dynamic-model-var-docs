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
- Stage 5: Fix Model/View Separation (remove panel knowledge from Elements)
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

### Stage 5: Fix Model/View Separation

**Status**: ⏸️ **READY FOR REVIEW** - Plan updated based on [sg] notes

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

**Solution Strategy**:

**Phase 1: Build Component Data Contracts Layer** (use existing `contracts/Item.ts` pattern)
- Current state: `contracts/Item.ts` exists but is unused
- [sg] "this adapter logic belongs with the component data contracts"
- Contracts layer should provide the adapter logic between model and view
- This is where panel-specific transformations should live
- Components consume contract types, not model types directly

**Phase 2: Move Logic to Appropriate Homes**

1. **Panel position/context mapping** → Component contracts or LayoutManager
   - `positionToContext()` helper should live with UI layout code
   - [sg] "may belong in Element or LayoutManager..."
   - Not in model layer

2. **Section data generation** → Component contracts
   - `toSectionItems()` logic → contracts layer adapter
   - `getSectionData()` logic → contracts layer adapter
   - These transform model data into component-ready SectionItemData

3. **URL expansion state** → State persistence utilities
   - `getExpansionKey()` → move to `src/utils/statePersistence.ts`
   - Model shouldn't know about URL concerns

4. **DataService updates**
   - DataService can call contracts layer to get transformed data
   - OR LayoutManager can do the transformation
   - DataService stays focused on accessing model data

**Implementation Approaches**:

**Option A: Revive contracts/Item.ts pattern** (more proper architecture)
- Build out contracts layer with adapter functions
- Create `contracts/SectionData.ts` with transformation logic
- Components import from contracts, not models
- Clean separation: DTOs → Models → Contracts → Components

**Option B: Keep logic in LayoutManager/DataService** (simpler, faster)
- LayoutManager owns section data building
- DataService provides raw model data
- No separate contracts layer needed yet
- Defer contracts layer until we need it

**Recommendation**: **Need user input** - Which approach?

**Steps** (assuming Option B for now):

1. **Audit what was added to ElementPreRefactor**:
   - Document all middle panel changes from Stage 3a commit (7634988)
   - List what needs new homes

2. **Move positionToContext() helper**:
   - Could go in LayoutManager (only place that needs it)
   - OR in a new `src/utils/panelHelpers.ts` utility
   - [sg] "may belong in Element or LayoutManager..."

3. **Move getExpansionKey() to statePersistence**:
   - Add `getExpansionKeyForSection(sectionType: string, position: string): string | null`
   - Remove from Element classes

4. **Handle toSectionItems/getSectionData**:
   - For now: **Leave in ElementPreRefactor** (will be deleted with old code)
   - [sg] "I don't care that much what's in ElementPreRefactor.ts. I hope the whole thing will be gone fairly soon."
   - When building new Element classes: Put similar logic in contracts layer or DataService
   - Future refactor: Move to contracts layer

5. **Verify middle panel still works**:
   - All middle panel functionality should work through LayoutManager + DataService
   - [sg] "we have to make sure the stuff you put in it is handled in the appropriate places in the refactored code"

**What NOT to do**:
- ❌ Don't try to "revert" Stage 3a changes (dangerous, might lose things)
  - [sg] "reverting is dangerous. if you think it's the best way to go, just make sure nothing else gets reverted or lost"
- ❌ Don't worry too much about ElementPreRefactor.ts (it's going away)
- ❌ Don't create big new abstraction layers unless needed

**What TO do**:
- ✅ Ensure middle panel logic has proper home in refactored architecture
- ✅ Document where panel/section logic should live going forward
- ✅ Set up contracts layer OR keep logic in LayoutManager/DataService (choose one)
- ✅ Plan for future: new Element classes never know about panels

**Files** (tentative, pending approach decision):
- `src/utils/statePersistence.ts` - Add expansion key logic
- `src/utils/panelHelpers.ts` - NEW (maybe) - Panel position helpers
- `src/contracts/SectionData.ts` - NEW (if going with contracts approach)
- `src/components/LayoutManager.tsx` - May gain section data building logic
- `src/models/ElementPreRefactor.ts` - **Leave as-is** (temporary, will be deleted)

**Questions for review**:
1. **Option A (contracts layer) or Option B (LayoutManager/DataService)?**
2. Is positionToContext() needed at all, or can we avoid the helper entirely?
3. Should we do this stage now, or defer until we're building new Element classes?
4. Is the middle panel actually working currently, or does something need immediate attention?

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
