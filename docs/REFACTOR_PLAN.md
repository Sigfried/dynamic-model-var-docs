# Slots-as-Edges Architecture Refactor Plan

**Status**: Planning phase - architecture chosen, implementation details being elaborated
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
- **SlotEdge**: Complex edge connecting Class → Range
  - Properties: slot name, required, multivalued, description, inherited_from, overrides
  - References SlotElement definition (can look up from name)
  - Multiple edges can reference same SlotElement (e.g., inherited with overrides)
  - **Replaces**: ClassSlot instances (more edges than slot definitions)
- **InheritanceEdge**: Simple is-a edges for class inheritance
- **MapsToEdge**: Variable → Class associations

**Slot Edge Details**:

Slots (slot nodes) are referenced in edges between classes and ranges. There are more edges than slots:
- An edge between a class and, say, an enum for an inherited slot:
  - Goes from the subclass to the enum
  - Holds a reference to (and can display properties of) the slot node it inherited
  - Also knows/displays the ancestor it inherited from
- If the subclass specifies a slot_usage, the edge shows properties of the slot_usage rather than of the referenced slot node

This approach accurately conveys usage relationships without needing hypergraph (multi-step) links.

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

1. **Compound relationships**: Simple/Explicit/Hybrid approach?
   - Simple: Single edge with metadata (slotName, required, multivalued, etc.)
   - Explicit: Slot properties as first-class nodes (hypergraph-like)
   - Hybrid: Edge with nested structure
   - **Current thinking**: Simple based on slot edge description above

2. **Graphology adoption**: Since we're moving to true graph model, bring in graphology library right away?
   - Collections could simplify to just getLabel, getDefaultExpansion
   - Methods like getUsedByClasses replaced by graphology queries
   - May not need artificial root node

**Medium Priority** (decide during implementation):

3. **LinkML documentation features**: What to include from generated docs?
   - **Terminology**: "Direct slots" vs "Induced slots"
   - **Inheritance**: Linear chains, inherited vs direct attributes
   - **Cardinality**: "0..1", "1", "*" notation
   - **Raw YAML**: Optional display of raw definitions

4. **Unused slot visualization**: How to distinguish unused SlotElement definitions from active SlotEdge instances?
   - Suggestion: Lower opacity for unused slots

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

Before starting the refactor, complete these preparatory tasks to ensure clean separation of model/view layers:

1. **Fix remaining model/view violations** (from TASKS.md)
   - Handle Unexpected Enum Fields Found by Validation 🔧
   - Ensures UI layer doesn't need changes during model refactor

### Phase 1: Prepare for Model Replacement

**Goal**: Set up infrastructure to replace model layer without touching UI

**Steps**:
1. Rename `src/models/Element.ts` → `src/models/ElementPreRefactor.ts`
2. Create new `src/models/Element.ts` that imports and re-exports from ElementPreRefactor
3. Verify no UI changes needed, all tests pass

**Why**: Allows incremental migration while keeping old model working

**Files**:
- `src/models/Element.ts` (new wrapper file)
- `src/models/ElementPreRefactor.ts` (renamed)

### Phase 2: Import and Model Types

**Goal**: Add TypeElement and Range abstraction

**Steps**:
1. Download linkml:types during data fetch
2. Parse types in dataLoader.ts
3. Create TypeElement class extending Range base class
4. Create Range abstract base class/interface
5. Make ClassElement, EnumElement extend Range
6. Add TypeCollection (rethink collections approach with graphology)

**Open question**: Do we need collections at all with graph model, or just for getLabel/getDefaultExpansion?

**Files**:
- `scripts/download_source_data.py` - Download linkml:types
- `src/utils/dataLoader.ts` - Parse types, create SlotEdge instances instead of ClassSlot
- `src/types.ts` - Add Type DTO, SlotEdge interface
- `src/models/Element.ts` - Add Range abstract base class, TypeElement class
- `src/models/ElementCollection.ts` - Add TypeCollection, simplify with graphology

### Phase 3: Refactor to Graph Model with SlotEdges

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

### Phase 4: UI Layout Changes

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

### Phase 5: Detail Box Updates

**Goal**: Render slots with clickable ranges in detail boxes

**Steps**:
1. Update DetailPanel to render slot edges:
   - Show slots with clickable/hoverable ranges
   - Display slot metadata (required, multivalued, inherited_from)
2. Update RelationshipInfoBox to display slot edge properties

**Files**:
- `src/components/DetailPanel.tsx` - Render slot edges with clickable ranges
- `src/components/RelationshipInfoBox.tsx` - Display slot edge properties

### Phase 6: Variable Field Rename

**Goal**: Rename bdchmElement → maps_to

**Context**: Variables no longer in panel sections, just edges to classes. Field name should reflect semantic relationship type.

**Files**:
- `src/types.ts` - VariableDTO interface
- `src/utils/dataLoader.ts` - Field transformation
- Anywhere else bdchmElement is referenced

### Phase 7: Documentation Updates

**Goal**: Update documentation to reflect new architecture

**Files**:
- `docs/CLAUDE.md` - Add Range abstraction, SlotEdge pattern, graph model approach
- `docs/DATA_FLOW.md` - Update with Slots-as-Edges architecture and graphology usage
- `docs/TASKS.md` - Update active tasks, remove obsolete items
- `docs/PROGRESS.md` - Archive this refactor as Phase 15

### Future: Define DataService & Model Interfaces

Not now, but soon we'll want to start defining what the interfaces for DataService and model will look like. When we get there, it might be interleaved in architecture or be a new section before implementation.

---
