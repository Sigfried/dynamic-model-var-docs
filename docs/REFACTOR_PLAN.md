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
- NOT shown as ranges—represents schema structure

**Middle Panel** (toggleable by clicking heading):
- **Default**: Hidden
- **Toggle**: Panel title "Show Slots" / "Hide Slots"
- **Content**: Slot browser showing all SlotElement definitions
- **Purpose**: Navigable nodes for exploration - clicking a slot shows which classes use it, what its range is
- **Link rendering**: When visible, show links from class → slot → range (two-step)

**Right Panel**:
- **Ranges** section: Classes, Enums, Types as range targets
- **Panel title**: "Ranges: [C] [E] [T]" (separate sections for each type)
- **Classes in both panels**: Classes appear in left panel (structure) and right panel (as ranges)

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

### Stage 1: Prepare for Model Replacement

**Goal**: Set up infrastructure to replace model layer without touching UI

**Steps**:
1. Rename `src/models/Element.ts` → `src/models/ElementPreRefactor.ts`
2. Create new `src/models/Element.ts` that imports and re-exports from ElementPreRefactor
3. Verify no UI changes needed, all tests pass

**Why**: Allows incremental migration while keeping old model working

**Files**:
- `src/models/Element.ts` (new wrapper file)
- `src/models/ElementPreRefactor.ts` (renamed)

### Stage 2: Import and Model Types

**Goal**: Add TypeElement and Range abstraction

**Steps**:
1. **Define DataService and model interfaces** (addresses graphology+OOP question above)
   - Sketch what queries DataService needs to make
   - Determine if we need property-based filtering in graph queries
   - Decide: Graph stores IDs only (Option A), all properties (Option B), or hybrid (Option C)
   - Document interface contracts before implementation
2. Download linkml:types during data fetch
3. Parse types in dataLoader.ts
4. Create TypeElement class extending Range base class
5. Create Range abstract base class/interface
6. Make ClassElement, EnumElement extend Range
7. Add TypeCollection (rethink collections approach with graphology)

**Open question**: Do we need collections at all with graph model, or just for getLabel/getDefaultExpansion?

**Files**:
- `scripts/download_source_data.py` - Download linkml:types
- `src/utils/dataLoader.ts` - Parse types, create SlotEdge instances instead of ClassSlot
- `src/types.ts` - Add Type DTO, SlotEdge interface
- `src/models/Element.ts` - Add Range abstract base class, TypeElement class
- `src/models/ElementCollection.ts` - Add TypeCollection, simplify with graphology

### Stage 3: Refactor to Graph Model with SlotEdges

**Goal**: Replace current Element-based model with graph-based model using graphology

**Key insight**: A vast amount of what happens in current Element.ts can be handled by graphology queries

**Steps**:
1. Install and configure graphology
2. Define graph structure:
   - Node types: Class, Enum, Slot, Type, Variable
   - Edge types: SlotEdge, InheritanceEdge, MapsToEdge
3. Create SlotEdge class/interface:
   - Properties: name, slotRef, required, multivalued, inherited_from, overrides
   - Connects Class → Range with context-specific properties
4. Refactor ClassElement to use SlotEdges instead of ClassSlots
5. Update getRelationships() implementations:
   - Current: Returns direct property links (hiding slots), includes inheritance as 'inherits' type
   - New: Returns slot edges
   - Should make hover/link logic simpler
6. Remove/refactor ClassSlot class
7. Simplify collections:
   - Keep for getLabel, getDefaultExpansion
   - Replace methods like getUsedByClasses with graphology queries

**Files**:
- `src/models/Element.ts` - SlotEdge class, refactor ClassElement, Range abstraction
- `src/models/ElementCollection.ts` - Simplify with graphology queries
- `src/services/DataService.ts` - Add type collection, update relationship APIs, add getSlotEdgesForClass()

### Stage 4: UI Layout Changes

**Goal**: Implement three-panel layout with middle slot panel

**Strategy**: Refactor LinkOverlay while keeping middle panel closed. Once in good shape, enable middle panel. May become two link overlays: left-middle, middle-right.

**Steps**:
1. Add middle panel to App.tsx:
   - Panel state management (visible/hidden)
   - URL state format (add middle panel to sections)
2. Update Panel.tsx for middle panel toggle support
3. Update statePersistence.ts for middle panel URL state
4. Refactor Section.tsx:
   - Ranges section rendering (Classes/Enums/Types)
   - Separate sections with "Ranges: [C] [E] [T]" heading
5. Update SectionItem.tsx if needed for range items
6. Refactor LinkOverlay.tsx:
   - Traverse Class → SlotEdge → Range
   - See TASKS.md "LinkOverlay Refactor" task
   - When middle panel visible: render two-step links (class→slot, slot→range)

**Files**:
- `src/App.tsx` - 3-panel layout, middle panel state management
- `src/components/Panel.tsx` - Middle panel toggle support
- `src/components/Section.tsx` - Ranges section rendering
- `src/components/SectionItem.tsx` - Range item updates if needed
- `src/utils/statePersistence.ts` - URL state for middle panel
- `src/components/LinkOverlay.tsx` - Slot edge traversal

### Stage 5: Detail Box Updates

**Goal**: Render slots with clickable ranges in detail boxes

**Steps**:
1. Update DetailPanel to render slot edges:
   - Show slots with clickable/hoverable ranges
   - Display slot metadata (required, multivalued, inherited_from)
2. Update RelationshipInfoBox to display slot edge properties

**Files**:
- `src/components/DetailPanel.tsx` - Render slot edges with clickable ranges
- `src/components/RelationshipInfoBox.tsx` - Display slot edge properties

### Stage 6: Variable Field Rename

**Goal**: Rename bdchmElement → maps_to

**Context**: Variables no longer in panel sections, just edges to classes. Field name should reflect semantic relationship type.

**Files**:
- `src/types.ts` - VariableDTO interface
- `src/utils/dataLoader.ts` - Field transformation
- Anywhere else bdchmElement is referenced

### Stage 7: Documentation Updates

**Goal**: Update documentation to reflect new architecture

**Files**:
- `docs/CLAUDE.md` - Add Range abstraction, SlotEdge pattern, graph model approach
- `docs/DATA_FLOW.md` - Update with Slots-as-Edges architecture and graphology usage
- `docs/TASKS.md` - Update active tasks, remove obsolete items
- `docs/PROGRESS.md` - Archive this refactor as Phase 15

### Future: Define DataService & Model Interfaces

Not now, but soon we'll want to start defining what the interfaces for DataService and model will look like. When we get there, it might be interleaved in architecture or be a new section before implementation.

---
