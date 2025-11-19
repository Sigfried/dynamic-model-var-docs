# Slots-as-Edges Architecture Refactor Plan

**Status**: ✅ **Model/Architecture Refactor Complete** - See [UI_REFACTOR.md](UI_REFACTOR.md) for remaining UI work
**Date**: January 2025
**Decision**: Slots-as-Edges architecture (after evaluating hypergraph and hybrid alternatives)

---

## 📋 Quick Status Summary

**Completed** (✅ Archived to PROGRESS.md Phase 17):
- ✅ Stage 1: Infrastructure Setup & Interface Definition
- ✅ Stage 2: Import Types and Range Abstraction
- ✅ Stage 3: Graph Model with SlotEdges
- ✅ Stage 3a: Panel Specialization (Three-Panel Layout)
- ✅ Stage 4: LayoutManager Refactor
- ✅ Stage 4.5: Slot Panel Fixes & Terminology
- ✅ Stage 5 Phase A: Centralize Contracts + Middle Panel Controls

**Deferred**:
- ⏭️ Stage 5 Phase B: Cleanup (positionToContext, getExpansionKey) - see [Deferred Cleanup](#stage-5-phase-b-deferred-cleanup) below
- ⏭️ Grouped slots panel - moved to UI_REFACTOR.md

**Next Steps**:
- See **[UI_REFACTOR.md](UI_REFACTOR.md)** for active UI component work
- See **[TASKS.md](TASKS.md)** for documentation cleanup (old "Stage 7")

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

## Detailed Implementation

All detailed implementation steps (Stages 1-5) have been archived to **[PROGRESS.md Phase 17](PROGRESS.md#phase-17-slots-as-edges-refactor---stages-2-5-graph-model--three-panel-layout)**.

For quick reference of what was completed:
- ✅ Stage 1: Infrastructure Setup & Interface Definition
- ✅ Stage 2: Import Types and Range Abstraction
- ✅ Stage 3: Graph Model with SlotEdges
- ✅ Stage 3a: Panel Specialization (Three-Panel Layout)
- ✅ Stage 4: LayoutManager Refactor
- ✅ Stage 4.5: Slot Panel Fixes & Terminology
- ✅ Stage 5 Phase A: Centralize Contracts + Middle Panel Controls
- ⏭️ Stage 5 Phase B: Deferred Cleanup (positionToContext, getExpansionKey)

---

## Next Steps

**Model/Architecture Refactor**: ✅ **COMPLETE**

**Remaining Work**:
- **UI Component Refactoring**: See [UI_REFACTOR.md](UI_REFACTOR.md) for active work
  - LinkOverlay 3-panel display fixes
  - RelationshipInfoBox fixes (hover box for slots/types)
  - DetailContent updates (render slot edges)
  - Grouped slots panel implementation
  - FloatingBoxManager improvements
  - LayoutManager enhancements

- **Documentation Cleanup**: See [TASKS.md](TASKS.md)
  - Update CLAUDE.md with graph model patterns
  - Update DATA_FLOW.md for Slots-as-Edges
  - Clean up obsolete task references

---
