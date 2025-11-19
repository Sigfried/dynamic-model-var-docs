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

### Overview

**Completed Stages:**
- ✅ Prerequisites: UI/model separation
- ✅ Stage 1: Infrastructure Setup & Interface Definition
- ✅ Stage 2: Import Types and Schema Validation
- ✅ Stage 3: Graph Model with SlotEdges
- ✅ Stage 3a: Panel Specialization (three-panel layout)
- ✅ Stage 4: LayoutManager Refactor

**Current Stage:**
- **Stage 4.5: Slot Panel Fixes & Terminology** (Parts 1, 2a, 2b, 2c complete; Part 3 next)

**Upcoming Stages:**
- Stage 5: Fix Model/View Separation (contracts + middle panel improvements)
- Stage 6: Detail Box Updates (render slot edges)
- Stage 7: Documentation Updates

---

<details>
<summary><b>Prerequisites</b> (✅ COMPLETE - click to expand)</summary>

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

</details>

<details>
<summary><b>Stage 1: Infrastructure Setup & Interface Definition</b> (✅ COMPLETE - click to expand)</summary>

**Goal**: Set up infrastructure to replace model layer and define new edge-based interfaces without touching UI

**Steps**:
1. ✅ Create Element.ts infrastructure (rename to ElementPreRefactor.ts)
2. ✅ Define new edge-based interfaces (ItemInfo, EdgeInfo, LinkPair, RelationshipData)
3. ✅ Add stub DataService methods (getAllPairs, getRelationshipsNew)
4. ✅ Variable field rename (bdchmElement → maps_to)

**Results**: TypeScript typecheck passes, all tests pass, backward compatible

**Detailed documentation**: See PROGRESS.md Phase 16

</details>

<details>
<summary><b>Stage 2: Import Types and Range Abstraction</b> (✅ COMPLETE - click to expand)</summary>

**Goal**: Add TypeElement and Range abstraction

**Steps**:
1. ✅ Define DataService and model interfaces (Option A: Graph stores IDs only)
2. ✅ Download linkml:types during data fetch
3. ✅ Parse types in dataLoader.ts
4. ✅ Create TypeElement class extending Range base class
5. ✅ Create Range abstract base class/interface
6. ✅ Make ClassElement, EnumElement extend Range
7. ✅ Add TypeCollection

**Key decisions**:
- categorizeRange() treats types as 'primitive' (leaf nodes)
- Types don't create relationship links
- Deferred: Do we need collections at all with graph model?

</details>

<details>
<summary><b>Stage 3: Graph Model with SlotEdges</b> (✅ COMPLETE - click to expand)</summary>

**Goal**: Replace current Element-based model with graph-based model using graphology

**Key insight**: Graph queries can replace most Element.ts logic

**Steps**:
1. ✅ Install and configure graphology
2. ✅ Define graph structure (nodes: Class/Enum/Slot/Type/Variable, edges: SlotEdge/InheritanceEdge/MapsToEdge)
3. ✅ Create SlotEdge class/interface
4. ✅ Implement graph-based relationship querying (getRelationshipsFromGraph)
5. ✅ Update DataService with adapter for backward compatibility
6. ⏭️ DEFERRED: Migrate UI components to new RelationshipData format (Stage 6)
7. ⏭️ DEFERRED: Remove/refactor ClassSlot class (Stage 6+)
8. ⏭️ DEFERRED: Simplify collections (Stage 6+)

**Key file**: `src/models/Graph.ts` - Complete graph infrastructure

</details>

<details>
<summary><b>Stage 3a: Panel Specialization (Three-Panel Layout)</b> (✅ MOSTLY COMPLETE - click to expand)</summary>

**Goal**: Implement basic three-panel layout with specialized panel roles

**Completed:**
- ✅ Three-panel layout (Classes, Slots, Ranges)
- ✅ URL state persistence with middle panel support
- ✅ Panel-specific toggle buttons (only C/E/T for right panel)
- ✅ Smart LinkOverlay rendering (1 or 2 overlays based on middle panel visibility)
- ✅ Type system updated for 'middle' position

**Known issues** (deferred to Stage 5):
- ⚠️ ElementPreRefactor.ts has middle panel knowledge (violates separation)
- ⚠️ Need middle panel show/hide toggle button

</details>

<details>
<summary><b>Stage 4: LayoutManager Refactor</b> (✅ COMPLETE - click to expand)</summary>

**Goal**: Consolidate layout logic into LayoutManager component, simplify App.tsx

**Accomplished:**
- ✅ Created LayoutManager component (350 lines)
- ✅ Simplified App.tsx from ~550 to ~230 lines
- ✅ Clean separation: App owns persistence, LayoutManager owns layout
- ✅ Controlled component pattern with ref-based callbacks
- ✅ All tests pass

**Pattern**: LayoutManager handles all UI layout logic (panels, floating boxes, link overlays); App handles data loading and state persistence

</details>

### Stage 4.5: Slot Panel Fixes & Terminology

**Status**: Parts 1, 2a, 2b, 2c, 3 ✅ **COMPLETE**

**Goal**: Fix slot panel data collection, implement data transformation pipeline, unify terminology

<details>
<summary><b>Background & Completed Parts</b> (1, 2a, 2b, 2c - click to expand)</summary>

**Background**: With gen-linkml JSON output, inherited slots are pre-merged into `classDTO.attributes`, but missing `inherited_from` field and has redundancy (548KB).

**Part 1: Collect all slots** ✅
- Added `transformAttributeToSlotData()` function
- Updated `loadRawData()` to collect from global slots + class attributes
- Added test verifying 170 slots collected
- Commit: 1a9637d

**Part 2a: Switch to JSON** ✅
- Updated `download_source_data.py` for gen-linkml JSON output
- Updated `dataLoader.ts` to load JSON, removed js-yaml
- Deleted legacy bdchm.metadata.json
- Commit: c54d822

**Part 2b: Data transformation pipeline** ✅
Created `scripts/transform_schema.py` to transform `bdchm.expanded.json` → `bdchm.processed.json`
- Computes `inherited_from` for all attributes
- Creates slot instances for slot_usage overrides (ID: `{slotName}-{ClassName}`)
- Expands URIs to URLs using prefixes
- Reduces file size 54.6% (548KB → 249KB)

**Part 2c: Update graph building** ✅
Updated Graph.ts and dataLoader to use processed JSON
- Uses `slotId` and `inherited_from` from attributes
- Removed duplicate-check workaround
- Updated ClassElement constructor
- 11/12 test files pass (165 tests), DetailContent.test.tsx needs updates (not blocking)

</details>

---

### Part 3: Terminology & Architecture Decisions ⏭️ NEXT
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
1. ✅ Add `inline: boolean` field to slot DTOs in types.ts
2. Update transform_schema.py to set inline flag:
   - `inline: true` for attributes defined directly on class
   - `inline: false` for attributes referencing global slots
3. ✅ Rename interfaces:
   - `PropertyDefinition` → marked for deletion (TODO added)
   - `AttributeDefinition` → renamed to `SlotDefinition`
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
- ✅ `src/types.ts` - Add `inline` field, rename AttributeDefinition → SlotDefinition
- `scripts/transform_schema.py` - Set inline flag based on slot source
- ✅ `src/models/ElementPreRefactor.ts` - Update comment, mark PropertyDefinition for deletion
- All files using "attribute" or "property" terminology - switch to "slot"

**Success Criteria for Part 3**:
- ✅ Terminology unification: Add `inline` flag, rename AttributeDefinition → SlotDefinition
- ✅ Fix Part 1 data collection: Collect ~170 base slots (8 global + 163 inline)
  - Filter out slot_usage instances (hyphened IDs)
  - Build unique set by `slotId` from class attributes
- ✅ Filter slot_usage instances from middle panel display
- ✅ Document grouping design for Stage 5 implementation (already documented in Part 3 section)
- ✅ Slot hover boxes (deferred to Stage 6 - don't fix ElementPreRefactor)

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
- ✅ `src/utils/dataLoader.ts` - Collect all slot definitions (Part 1), collect inline slots from class attributes (Part 3)
- ✅ `scripts/download_source_data.py` - Switch to JSON output (Part 2a)
- ✅ `scripts/transform_schema.py` - NEW: Transform expanded JSON to optimized format (Part 2b), add inline flag (Part 3)
- ✅ `scripts/download_source_data.py` - Call transform_schema.py in pipeline (Part 2b)
- ✅ `src/utils/dataLoader.ts` - Load bdchm.processed.json instead of expanded (Part 2b)
- ✅ `src/types.ts` - Update DTOs to match processed format (Part 2b/2c), rename AttributeDefinition → SlotDefinition and add inline flag (Part 3)
- ✅ `src/models/Graph.ts` - Use slot instance IDs from processed JSON (Part 2c)
- ✅ `src/models/Graph.ts` - Remove duplicate-check workaround (Part 2c)
- ✅ `src/models/ElementPreRefactor.ts` - Update to use processed JSON structure (Part 2c), update comment to reference SlotDefinition (Part 3)
- ✅ `src/test/getUsedByClasses.test.ts` - Update tests for new structure (Part 2c)
- ✅ `src/test/DetailContent.test.tsx` - Partial update to mock data (Part 2c)
- ✅ `docs/REFACTOR_PLAN.md` - Document Part 3 completion (Part 3)
- ⏭️ `src/test/DetailContent.test.tsx` - Complete test updates (deferred - not blocking)

### Stage 5: Fix Model/View Separation

**Status**: 🚧 **IN PROGRESS** - Phase A Step 1 complete (contract centralization)

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
1. ✅ Centralize contracts to `src/contracts/ComponentData.ts`
2. ⏭️ Add middle panel toggle button in header or panel
3. ⏭️ Fix LayoutManager spacing for middle panel (gutters on both sides)
4. ⏭️ Verify LinkOverlay rendering with middle panel
5. ⏭️ **Implement grouped slots panel** (from Stage 4.5 Part 3 design):
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
- ✅ `src/contracts/ComponentData.ts` - NEW (centralized contracts) - Step 1 complete
- ✅ `src/components/Section.tsx` - Import from contracts with backward-compatible re-exports - Step 1 complete
- ✅ `src/components/ItemsPanel.tsx` - Import from contracts with backward-compatible re-exports - Step 1 complete
- ✅ `src/components/FloatingBoxManager.tsx` - Import from contracts with backward-compatible re-exports - Step 1 complete
- ⏭️ `src/components/Section.tsx` - Support nested grouping (Step 5)
- ⏭️ `src/components/LayoutManager.tsx` - Add toggle button, fix spacing (Steps 2-3)
- ⏭️ `src/services/DataService.ts` - Provide grouped slot data (Step 5)
- ⏭️ `src/utils/dataLoader.ts` - Already filters slot_usage instances (done in Stage 4.5 Part 3)
- ⏭️ `src/utils/statePersistence.ts` - Add getExpansionKey function (Phase B, optional)
- ⏭️ `src/models/ElementPreRefactor.ts` - Try to eliminate positionToContext (Phase B, optional)

**Success criteria**:
- ✅ All component contracts centralized in one place (Step 1 - commit 4b502e7)
- ⏭️ Middle panel has toggle button (show/hide)
- ⏭️ Middle panel has proper spacing (gutters for links)
- ⏭️ LinkOverlay works correctly with middle panel visible
- ⏭️ Grouped slots panel implemented:
  - Global section shows 8 global slots
  - Per-class sections show inherited + defined slots
  - Inherited slots show "inherited from X" indicator
  - Overridden slots have visual indicator (⚠️ or color)
  - ✅ No slot_usage instances visible (filtered in Stage 4.5 Part 3)
  - Click/hover navigates to class-specific version
- ✅ TypeScript typecheck passes
- ⏭️ All tests pass (pending remaining steps)

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
