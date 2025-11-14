# Slots-as-Edges Architecture Refactor Plan

**Status**: Planning phase - architecture chosen, implementation details being elaborated
**Date**: January 2025
**Decision**: Slots-as-Edges architecture (after evaluating hypergraph and hybrid alternatives)

---

## Table of Contents

1. [Problem Statement](#1-problem-statement)
2. [Chosen Architecture: Slots-as-Edges](#2-chosen-architecture-slots-as-edges)
3. [Implementation Prerequisites](#3-implementation-prerequisites)
4. [Open Questions & Decisions Needed](#4-open-questions--decisions-needed)
5. [Files Likely to Change](#5-files-likely-to-change)

---

## 1. Problem Statement

### Current Reality

The app treats all element types (classes, enums, slots, variables) as **nodes** with inconsistent relationship handling:

**The Mish-Mash**:
- Classes ARE directly related to Slots (via `slots` arrays and `slot_usage`)
- BUT Classes are NOT directly related to other Classes/Enums—those relationships are **mediated by slots**
- The UI **hides slot mediation**, showing `Specimen → SpecimenTypeEnum` as a direct link
- **Result**: Slots function as both nodes (clickable, have details) AND invisible edges (class→range relationships hide them)
- ~~**Problem**: Users can't tell which relationships are direct vs mediated~~
- [sg] **Problems**:
  - makes it hard for user to understand class-slot-range relationships
  - leads to weirdness in data structures and unneeded complexity
    in figuring out class-range relationships

**Implementation Issues**: [sg] i don't understand these or maybe don't agree. delete unless they
                                will help you with implementation
- All slot-mediated relationships return overloaded `type: 'property'`
- ClassElement.getRelationships() returns `type: 'property'` for attributes with non-primitive ranges
- Intermediate slot is present in data model but invisible in relationship representation
- Violates separation of concerns (model/view mixing)

### Why Change? [sg] do we need this?

1. **Conceptual clarity**: Slots should be represented consistently—either always as nodes OR as edges, not both
    - [sg] wrong. we are going to do both. see notes below
2. **User comprehension**: Make direct vs mediated relationships visible [sg] not quite
3. **Accurate slot inheritance**: Different classes using same slot definition should have different edge instances
4. **Preparation for Types**: Need Range abstraction (Class | Enum | Type) before importing linkml:types

---

## 2. Chosen Architecture: Slots-as-Edges

### Core Concept

**Slots are complex edges connecting Class → Range**, not nodes (except SlotElement definitions browsable separately)

### Data Model

**Nodes**:
- **Classes**: Entity, Specimen, Material, etc.
- **Enums**: SpecimenTypeEnum, AnalyteTypeEnum, etc.
- ~~**Variables**: angina_prior_1, asthma_ever_1, etc.~~
- [sg] **Variables**: will no longer appear as panel sections, just in detail
        boxes and maybe relationship hovers
- **Types** (to be imported): Primitives (string, integer) and custom types from linkml:types
- [sg] **Slots**: will be nodes but not range nodes; will only appear in middle panel

**Edges** (Slots):
- **SlotEdge**: Complex edge connecting Class → Range
  - Properties: slot name, required, multivalued, description, inherited_from, overrides
  - References SlotElement definition (not just name string) [sg] probably, but we
    can always look up object from name
  - Multiple edges can reference same SlotElement (e.g., inherited with overrides)
  - **Replaces**: ClassSlot instances (more edges than slot definitions)
- [sg] Can also represent inheritance as simple is-a edges
- [sg] class-variable associations can be edges

**SlotElement Definitions**:
- Still exist as browsable entities (includes all slots, even unused)
- Accessible via optional middle panel for exploration
- Serve as templates/definitions that slot edges reference

**Class Hierarchy**:
- **Range** (abstract base class or interface)
  - ClassElement extends Range
  - EnumElement extends Range
  - TypeElement extends Range (new)
- Allows uniform handling of slot range targets

### UI Layout (Three-Panel Design)

**Left Panel** (always visible):
- Classes only (tree hierarchy)
- NOT shown as ranges—represents schema structure

**Right Panel**:
- ~~**Variables** section: Grouped by class~~ [sg] not anymore
- **Ranges** section: Classes, Enums, Types as range targets
  - Open question: Single "Ranges" section or separate Class/Enum/Type sections?
    - [sg] separate sections, but panel title could be Ranges: [C] [E] [T]

**Middle Panel** (optional/toggleable):
- **Slot Browser**: Shows all SlotElement definitions
- Functions as navigable nodes for exploration
- Clicking a slot shows which classes use it, what its range is
- Open question: Collapsible? Toggleable? Default state?
  - [sg] Panel title could toggle: Show Slots/Hide Slots, default to hidden

**Detail Boxes**:
- Slots appear as properties with clickable/hoverable ranges
- Range values clearly shown as connected nodes
- Slot metadata visible (required, multivalued, inherited_from)

### Key Insight

**Slots exist in TWO forms**:
1. **SlotElement definitions** (browsable in optional middle panel, ~ 7 in BDCHM)
    - [sg] ~7: WRONG. there are ~170 slots including both global and attributes
2. **SlotEdge instances** (actual Class → Range connections, many more than definitions)

**Example**:
- SlotElement definition: `specimen_type` (range: SpecimenTypeEnum)
- SlotEdge instances:  [sg] are these real examples? definitely not the first
  - `Entity → specimen_type → SpecimenTypeEnum`
  - `Specimen → specimen_type → SpecimenTypeEnum` (inherited, possibly with overrides)
  - `Material → specimen_type → SpecimenTypeEnum` (inherited from Specimen)

Each edge instance has its own properties based on inheritance chain and slot_usage overrides.

---

## 3. Implementation Prerequisites

### 1. Import and Model Types (HIGH PRIORITY)

**Why first**: Range abstraction depends on TypeElement existing

- Download linkml:types during data fetch (`scripts/download_source_data.py`)
- Parse types in `dataLoader.ts`
- Create `TypeElement` class extending Range base class
- Add `TypeCollection`
  - [sg] we will need to rethink collections

**Files**:
- `scripts/download_source_data.py`
- `src/utils/dataLoader.ts`
- `src/models/Element.ts` (new TypeElement class)
- `src/types.ts` (new Type DTO)

### 2. Create Range Abstraction (HIGH PRIORITY)

**Why needed**: Slot edges connect Class → Range, where Range = Class | Enum | Type

- Create abstract `Range` class (or interface)
- ClassElement, EnumElement, TypeElement all extend/implement Range
- Provides common interface for slot range handling

**Files**:
- `src/models/Element.ts` (abstract Range class)

### 3. Refactor Slot Representation (MAJOR CHANGE)

**Current**:
- SlotElement: Node type, can be selected
- ClassSlot: Combines slot definition + class-specific usage

**New**:
- SlotElement: Keep for definitions (browsable in middle panel)
- SlotEdge: New class/interface for edges
  - References SlotElement definition
  - Connects Class → Range with context-specific properties
  - Properties: name, slotDef (ref), required, multivalued, inherited_from, overrides, etc.
- **Replace**: ClassSlot instances with SlotEdge instances

[sg] somewhat redundant but maybe better description of intention

    - slots are nodes
    - slots (slot nodes) are referenced in edges between classes and ranges with more edges than slots:
      - an edge between a class and, say, an enum for an inherited slot:
        - goes from the subclass to the enum
        - holds a reference to (and can display properties of) the slot node it inherited
        - also knows/displays the ancestor it inherited from
      - if the subclass specifies a slot_usage, the edge shows properties of the slot_usage rather than of the referenced slot node

    This approach should accurately convey the usage relationships without needing hypergraph (multi-step) links?

**Files**:
- `src/models/Element.ts` (SlotEdge class/interface, refactor ClassElement)
- Remove or refactor `ClassSlot` class

### 4. UI Layout Changes (MAJOR CHANGE)

**Current**: Two panels, each can show Classes, Enums, Slots, Variables

**New**: Three-panel design
- Left panel: Classes only
- ~~Right panel: Variables + Ranges (Classes, Enums, Types as range targets)~~
- [sg] Right panel: Ranges (Classes, Enums, Types as range targets)
- ~~Middle panel (optional): Slot browser~~
- [sg] Middle panel (toggleable by clicking its heading):
  - items are slots
  - when visible, show links from class to slot and slot to range

**Impacts**:
- Panel state management (add middle panel state)
- URL state (add middle panel to sections format)
- Section toggling logic
- Panel rendering components
- [sg] possibly big change to link overlay. we should probably refactor
       link overlay while keeping the middle panel closed. once it's
       in good shape, will hopefully be easier. maybe will become two
       link overlays: left-middle, middle-right

**Files**:
- `src/App.tsx` (3-panel layout, state management)
- `src/components/Panel.tsx` (middle panel support)
- `src/components/Section.tsx` (Ranges section rendering)
- `src/utils/statePersistence.ts` (URL state for middle panel)

### 5. Relationship Computation Changes

**Current**: getRelationships() returns direct property links (hiding slots)
[sg] does getRelationships currently include class inheritance?

**New**: getRelationships() returns slot edges

**Impacts**:
- Element.getRelationships() signature/return type
- Hover/link logic traverses Class → SlotEdge → Range
  - [sg] if this doesn't make the hover/link logic simpler, something is wrong.
- Detail boxes show slots with clickable ranges
- LinkOverlay needs updating (see TASKS.md "LinkOverlay Refactor" task)

**Files**:
- `src/models/Element.ts` (getRelationships() implementations)
- `src/components/LinkOverlay.tsx` (traverse slot edges)
- `src/components/DetailPanel.tsx` (render slots with clickable ranges)
- `src/components/RelationshipInfoBox.tsx` (show slot metadata)

---

## 4. Open Questions & Decisions Needed

### High Priority (must answer before implementing)

1. ✅ **Architecture decision**: Slots-as-Edges chosen
2. **Compound relationships**: Simple/Explicit/Hybrid approach?
    - [sg] i have not made a choice. i don't understand what these three alternatives
           actually mean
   - Simple: Single edge with metadata
   - Explicit: Attributes as first-class nodes
   - Hybrid: Edge with structured attributes
   - **Recommendation**: Simple for first implementation
3. **Variable→Class**: What's the semantic relationship type?
   - `instantiates`, `maps_to`, `belongs_to`?
     - [sg] maps_to is good
   - Is it a tree parent/child or cross-reference?
     - [sg] it's an edge with its own edge type. no longer need to group
            these into a tree because not displaying in panel sections
   - Should `bdchmElement` be renamed to `parentId`?
     - [sg] i thought we already did? but now i guess it should be renamed to 'maps_to'?

### Medium Priority (can decide during implementation)

4. **Collection nodes**: Are they graph nodes or just query wrappers?
   - [sg] dealing with this in Model Layer.Collections
5. **fromData elimination**: Can we remove it entirely?
    - [sg] probably
6. **Middle panel UX**:
    - [sg] answered above
   - Collapsible or toggleable?
   - Default state (open/closed)?
   - Keyboard shortcuts? [sg] not for now
7. **Right panel Ranges section**:
    - [sg] answered above
   - Single "Ranges" section showing Classes, Enums, Types together?
   - OR separate sections for each type?
   - How to visualize that Classes appear in BOTH left panel (structure) and right panel (as ranges)?

[sg] Decide what features from LinkML generated documentation to include in this app

    **Terminology & Concepts**:
    - **"Direct slots"** vs **"Induced slots"**: Direct = defined on class, Induced = complete flattened list including inherited
    - Classes can be **concrete parents** with their own implementation + specialized children

    **Inheritance Patterns**:
    - Linear inheritance chains visualized with Mermaid diagrams
    - Documentation separates inherited vs direct attributes
    - Clickable navigation between related classes

    **Relationship Modeling Patterns**:
    - **Self-referential**: Specimen → parent_specimen (0..*, pooling/derivation)
    - **Cross-class**: Typed slots with range constraints (Specimen → source_participant: Participant)
    - **Activity relationships**: Multiple typed edges (creation_activity, processing_activity, storage_activity, transport_activity)
    - **Mutual exclusivity**: Documented in comments (one of: value_string, value_boolean, value_quantity, value_enum)

    **Slot Constraints & Cardinality**:
    - Notation: "0..1" (optional), "1" (required), "*" or "0..*" (multivalued)
    - Required/multivalued flags explicit in YAML schema
    - Range constraints: slots typed to enums, primitives, or other classes

    **Enumeration Strategy**:
    - Pre-mapped controlled vocabularies (not direct ontology URIs)
    - Assumes upstream mapping from source systems (EHR codes → enum values)

    - include optional display of raw yaml definitions

### Low Priority (defer to later)

8. **Graphology adoption**: Worth adding graphology library eventually?
      - [sg] if we decide to move ahead and really use a graph model as we're
             describing, maybe bring in graphology right away
9. **Artificial root node**: Needed without graphology?
    - [sg] probably not even needed with graphology
10. **Unused slot visualization**: How to distinguish unused SlotElement definitions from active SlotEdge instances in UI?
    - [sg] lower opacity?

---

## 5. Files Likely to Change

### Data Layer (Major Changes)

**Scripts**:
- `scripts/download_source_data.py` - Download linkml:types

**Loading & Transformation**:
- `src/utils/dataLoader.ts` - Parse types, create SlotEdge instances instead of ClassSlot
- `src/types.ts` - Add Type DTO, SlotEdge interface

### Model Layer (Major Changes)

**Core Models**:
- [sg] The model is going to change so much, I think we should retire the current
       Elements.ts, keep it around for parts and to check for stuff we might
       forget, but start with a new file. A vast amount of what happens there
       will be able to be handled by graphology queries
  - Actually, rename it to ElementsPreRefactor.tsx and create a new Elements.tsx
    that starts by just importing everything from ElementsPreRefactor and
    re-exporting it. Then we will start implementing the new model step-by-step.
    As we change to the graph model, we will need to make changes to DataService
    but should not have to make any changes to the UI files.
  - But before that, we need to fix the remaining problems with the UI using model
    constructs -- tasks: Handle Unexpected Enum Fields Found by Validation 🔧
- `src/models/Element.ts`:
  - Add `Range` abstract base class
  - Add `TypeElement` class
  - Add `SlotEdge` class/interface
  - Refactor `ClassElement` (use SlotEdges instead of ClassSlots)
  - Update `getRelationships()` implementations to return slot edges
  - Remove/refactor `ClassSlot` class

**Collections**:
- [sg] we need to rethink how collections work
  - once we move to using a graph model, they might not be needed for
    much more than getLabel, getDefaultExpansion
  - methods like getUsedByClasses could be replaced by simple graphology
    queries
- `src/models/ElementCollection.ts`:
  - Add `TypeCollection`
  - Refactor `SlotCollection` (definitions vs edge instances)
    - [sg] should be able to vastly simplify

### Service Layer (Moderate Changes)

- `src/services/DataService.ts`:
  - Add type collection
  - Update relationship APIs (traverse slot edges)
  - Potentially add `getSlotEdgesForClass()` method

### UI Layer (Major Changes)

**Layout & State**:
- `src/App.tsx` - 3-panel layout, middle panel state management
- `src/components/Panel.tsx` - Middle panel toggle/collapse support
- `src/utils/statePersistence.ts` - URL state for middle panel

**Sections & Items**:
- `src/components/Section.tsx` - Ranges section rendering (Classes/Enums/Types)
- `src/components/SectionItem.tsx` - Potential updates for range items

**Details & Relationships**:
- `src/components/DetailPanel.tsx` - Render slots with clickable ranges, show SlotEdge metadata
- `src/components/RelationshipInfoBox.tsx` - Display slot edge properties
- `src/components/LinkOverlay.tsx` - Traverse Class → SlotEdge → Range (see TASKS.md task)

### Documentation

- `docs/CLAUDE.md` - Update with Range abstraction, SlotEdge pattern
- `docs/DATA_FLOW.md` - Update with Slots-as-Edges architecture
- `docs/TASKS.md` - Update active tasks, remove obsolete items
- `docs/PROGRESS.md` - Archive completed phases

---

## Related Documents

- **[TASKS.md](TASKS.md)** - Active tasks, implementation tracking
- **[PROGRESS.md](PROGRESS.md)** - Completed phases (see Phase 14: LinkML Study & Architecture Decision)
- **[CLAUDE.md](../CLAUDE.md)** - Architectural principles (view/model separation, etc.)
- **[DATA_FLOW.md](DATA_FLOW.md)** - Data flow analysis (needs updating post-refactor)

---

**Historical Context**: See PROGRESS.md Phase 14 for:
- LinkML study learnings (BDCHM docs, Chris Mungall guidance)
- Options A-C comparison (hypergraph, hybrid approaches)
- Decision rationale for choosing Slots-as-Edges
