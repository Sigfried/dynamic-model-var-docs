# Tasks

> **Active planning document** - Completed work archived to [archive/tasks.md](archive/tasks.md)
> (Historical progress through Nov 2025 in [archive/progress.md](archive/progress.md))
>
> **Development principles** - See [CLAUDE.md](CLAUDE.md) for architectural rules and workflow

---

## 🐛 Current Bugs

### Link Rendering Issues
1. **Class→slot links pointing wrong direction** (3-panel mode)
2. **Specimen→analyte_type link missing** (see screenshot in old TASKS.md:107)
3.  ✅ Complete
    - **SVG path NaN errors** - Console shows `<path> attribute d: Expected number, "M NaN NaN C NaN Na..."`
      - **Location**: LinkOverlay.tsx:448 (path element at line 450: `d={pathData}`)
      - something is wrong with the self-ref code on lines 403-412
4. when showing/hiding middle panel, links don't update until some kind of interaction

### Hover/Detail Box Issues
4. ✅ **Slot hover shows "No relationships found"** - Fixed by adding CLASS_SLOT/SLOT_RANGE edge support

### Positioning Issues
5. **Detail box positioning bugs** - Multiple issues from Unified Detail Box work:
   - Remove unnecessary isStacked logic (#3)
   - Make stacked width responsive (#4)
   - Fix transitory/persistent box upgrade (#6); currently deletes rel info box and creates new detail box - should simply make rel info box persistent (draggable, etc.)
   - Fix hover/upgrade behavior (#7); RelationshipInfoBox may use fixed positioning conflicting with FloatingBox wrapper
   - See [archived details](archive/tasks_pre_reorg.md#unified-detail-box-system) for full list

---

## 📋 Upcoming Work (Ordered by Priority)

[sg] new items -- trying to fix weird stuff
- slot problems in bdchm.processed.json:
  ```json
    "classes": {
      "DimensionalObservationSet": {
        "attributes": {
          "observations": {
            "slotId": "observations-DimensionalObservationSet",
            "range": "DimensionalObservation",
            "inline": false,
            "required": true,
            "multivalued": true,
            "inherited_from": "ObservationSet"
          },
          ...
        }
      },
    },
    "slots": {
      "observations-DimensionalObservationSet": {
        "id": "observations-DimensionalObservationSet",
        "name": "observations",
        "range": "DimensionalObservation",
        "overrides": "observations",
        "description": "A set of one or more observations.",
        "required": true,
        "multivalued": true
      },
    }
  ```
- consolidate slots:
    - move/merge all class attributes to the slots section
    - under each class, replace "attributes" with "slots"
    - only retain a list of slot ids
- except for prefixes (which we might not even need since we're already
  generating URLs in the processed output), add a nodeType
  ('class'|'slot'|'enum'|'type') to everything and put it all into a big
  array
- turn all the sections into arrays instead of maps, 
  - so, DimensionalObservationSet's definition and observations slot will be:
    ```json
        [
            {
                "nodeType": "class",
                "id": "DimensionalObservationSet",
                "name": "DimensionalObservationSet",
                "parent": "ObservationSet",
                "abstract": false,
                "slots": [
                    "observations-DimensionalObservationSet",
                    "associated_visit",
                    "associated_participant",
                    "category",
                    "focus",
                    "method_type",
                    "performed_by",
                    "id"
                ],
                "description": "A set of one or more discrete observations about the physical dimensions of an object (e.g. length, width, area)."
            },
            {
                "nodeType": "slot",
                "id": "observations-DimensionalObservationSet",
                "name": "observations",
                "range": "DimensionalObservation",
                "inline": false,
                "inherited_from": "ObservationSet"
                "overrides": "observations",
                "description": "A set of one or more observations.",
                "required": true,
                "multivalued": true
            },
        ]
    ```
    
### ✅ Phase 1 & 1.5: Completed

**Phase 1: UI Layer Cleanup** and **Phase 1.5: Complete Type Organization** are both complete.

**Key accomplishments:**
- Separated UI types from model types (ComponentData.ts)
- Renamed types.ts → import_types.ts (DTOs only)
- Extracted ModelData and SchemaTypes from import_types.ts
- Created single source of truth for config (appConfig.ts)
- Eliminated all hard-coded values in components
- Added consistent element type IDs (no more parsing display names)

**See [archive/tasks.md](archive/tasks.md) for detailed implementation notes.**

### ✅ Type System Cleanup - COMPLETE

Simplified edge types and retired deprecated interfaces. See [archive/tasks.md#type-system-cleanup](archive/tasks.md#type-system-cleanup) for details.

### ✅ Phase 3: Data Flow Refactor - Steps 5-6 COMPLETE

Graph-first initialization, O(1) graph queries for getUsedByClasses(). See [archive/tasks.md#phase-3-data-flow](archive/tasks.md#phase-3-data-flow) for details.

### ✅ Phase 2: LinkOverlay Migration - Steps 3 & 3b COMPLETE

LinkOverlay and RelationshipInfoBox now use graph-based queries directly. See [archive/tasks.md#phase-2-linkoverlay-migration](archive/tasks.md#phase-2-linkoverlay-migration) for details.

**Step 4: Remove old getRelationships() methods** 🔲
- Delete from ClassElement, EnumElement, SlotElement, VariableElement
- Remove ClassSlot class (replaced by graph slot edges)
- Remove `getRelationshipsForLinking()` from DataService (no longer used by LinkOverlay)
- **Dependencies**: LinkOverlay migration complete (Step 3) ✅

**Step 7: Reduce Element subclass code** 🔲
- Most behavior should move to graph queries or other layers
- Element classes become thinner wrappers around graph data
- Many methods can be replaced with graph queries
- **Why last**: Final cleanup after everything else works
- **Dependencies**: Graph as primary data source, Steps 3-4 complete

### More Upcoming

- ✅ **Merge Element.ts and ElementPreRefactor.ts**
  - Merged via git mv to preserve history
  - Renamed ItemInfoProposal → ItemInfo, EdgeInfoProposal → EdgeInfo
  - Old types renamed to *Deprecated for backward compatibility

**LinkOverlay fixes** ✅ **MOSTLY COMPLETE**
- Migrated to graph-based edge queries (see Phase 2 Step 3 above)
- Remaining bugs: see Current Bugs #1, #2, #4 above
- Edge labels: show on hover; tooltip display needs improvement

**URLs as clickable links**
- Display URIs as clickable links in detail panels
- Already set up infrastructure for this
- See: External Link Integration in Future Ideas

[sg] **item names as hover/links**
- in detail and hover boxes, make all item references
  act like they do in panels: hover box on hover, detail box
  on click. this is already working for most items in hover
  boxes but not slot names.

**selfRefs (loop links)**   [sg] complete
- Display self-referential links as loops instead of crossing panels
- Implementation: `generateSelfRefPath()` in [src/utils/linkHelpers.ts:235](../src/utils/linkHelpers.ts#L235)
- May have done some of this on branch (check)

### Medium Priority

<a id="abstract-tree"></a>
### Abstract Tree Rendering System

**IMPORTANT**: Before starting, give tour of current tree rendering, fully specify interface, write production code inline first before extracting.

**Goal**: Extract tree rendering and expansion logic from Element into reusable abstractions

**Benefits**:
- Consistent tree UX across Elements panel and info boxes
- Easier to add new tree-based displays
- Centralizes expansion logic
- Could support multiple tree layouts (simple indented, tabular with sections)

full task description (recovered from [old TASKS.md](https://github.com/Sigfried/dynamic-model-var-docs/blob/df062529ab5268030d10f90a84080d6c1109bbec/docs/TASKS.md#abstract-tree-rendering-system)):

**IMPORTANT**: Before starting this refactor:
1. Give a tour of how tree rendering currently works (Element tree structure, expansion state, rendering in components)
2. Fully specify the interface (how it's used in practice, not just TypeScript definitions)
3. Write actual production code directly in component files to verify the design
4. Wrap this code in closures or make it inactive until ready to replace existing code
5. Once abstraction is complete, remove old code and activate new code

**Goal**: Extract tree rendering and expansion logic from Element into reusable abstractions that can be shared between Elements panel and info boxes (and future tree-like displays).

**Why this matters**: Converting DetailContent and other components to use this system should result in significant simplification.

**Current state**:
- Element class has tree capabilities (parent, children, traverse, ancestorList)
- Expansion state managed by useExpansionState hook
- Tree rendering handled in each component (Section.tsx, DetailPanel, etc.)
- Info box data could be hierarchical but isn't structured that way yet

**Proposed abstraction**:
- Create parent class or mixin with tree capabilities
  - Node relationships (parent, children, siblings)
  - Tree traversal (depth-first, breadth-first)
  - Expansion state management
  - **Layout logic** (not just expansion - how trees are rendered)
- Element becomes a child of this abstraction
- Info box data structures as tree nodes
- Shared rendering components/hooks

**Benefits**:
- Consistent tree UX across Elements panel and info boxes
- Could switch between tree layouts (simple indented tree, tabular tree with sections)
- Easier to add new tree-based displays
- Centralizes expansion logic

**Tree layout options** (switch in code, not necessarily in UI):
- **Simple tree**: Current indented style with expand/collapse arrows
- **Tabular tree**: Hierarchical table with columns (see Slots Table Optimization example)
  - Indented rows show hierarchy
  - Expandable sections
  - Can show properties in columns
- **Sectioned tree**: Groups with headers, nested content

**Related**: Slots Table Optimization task (Detail Panel Enhancements) shows hierarchical table example from another app - tree structure with indented rows, expandable sections, multiple columns. Info box inherited slots could use this pattern.

**Note**: If helpful during implementation, the hierarchical table screenshot can be copied to `docs/images/` for reference.

**Implementation approach**:
1. Give tour of current tree rendering system
2. Design tree abstraction (class? mixin? hooks?)
3. Extract expansion state management
4. Extract layout logic
5. Refactor Element to use abstraction
6. Apply to info box data structures
7. Consider tabular tree layout for slots tables

**Files likely affected**:
- `src/models/Element.ts` - Extract tree logic
- `src/models/TreeNode.ts` or `TreeBase.ts` (new) - Tree abstraction
- `src/hooks/useExpansionState.ts` - Possibly generalize
- `src/components/Section.tsx` - Use abstraction
- `src/components/RelationshipInfoBox.tsx` - Structure data as tree
- `src/components/DetailPanel.tsx` - Use abstraction for slots table

---

**Grouped Slots Panel - Show slots organized by source**
- Display slots grouped by Global + per-class sections
- Show inheritance (inherited vs defined here vs overridden)
- Visual indicators for slot origin
- From [linkoverlay_refactor_plan.md](archive/linkoverlay_refactor_plan.md):
 
  **Structure**:
    ```
    Global Slots (7)
      - id
      - associated_participant
      - observations
      - ...

    Entity (1 slot)
      - id (global reference)

    Observation (12 slots)
      - id (inherited from Entity)
      - category (defined here)
      - associated_visit (global reference)
      - value_string (defined here)
      - ...

    SdohObservation (13 slots)
      - id (inherited from Entity)
      - category (inherited from Observation) ⚠️ overridden
      - value_string (inherited from Observation)
      - related_questionnaire_item (defined here)
      - ...
    ```

    **Behavior**:
    - Inherited slots appear under each class that uses them (repetition across classes is OK)
    - Always show base slot name (never "category-SdohObservation")
    - Click/hover navigates to that class's version (with overrides if any)
    - Visual indicators for
        - defined here vs gobal ref vs inherited vs inherited overridden

    **Implementation**:
    - DataService: Provide grouped slot data
    - Section.tsx: Support nested grouping (class headers with slot items)
    - Already done: Filter out slot_usage instances (Stage 4.5 Part 3)

    **For rendering use [abstract tree](#abstract-tree)**

**Overhaul Badge Display System**
- Show multiple counts per element (e.g., "103 vars, 5 enums, 2 slots")
- Add labels or tooltips to clarify what counts mean
- Make badges configurable
- Same as "Enhanced Element Metadata Display"

**Search and Filter**
- Search: Medium priority (important for exploring large schemas)
- Filtering: Medium-low priority (grouping provides a lot already)
- Filter toggles: Needs discussion, combine with other filtering tasks

**Detail Panel Enhancements**
- Show reachable_from info for enums (still not showing)
- Show inheritance (still not showing)
- Slot order: Inherited slots at top (use grouping)
- [Refactoring plans](archive/tasks_pre_reorg.md)


**Change "attribute" to "slot" terminology**
- In most/all places in the codebase
- Goes with Terminology Configuration (see App Configuration File)

**Animation library**
- Fix funkiness in interactions including link movement with scrolling
- If it helps: medium priority

**Viewport culling for links**
- Don't show links when both endpoints off screen
- When one endpoint visible, show beginning of link with interaction to bring other end into focus
- Very nice but not high priority

### Low Priority

**LayoutManager Enhancements**
- Responsive panel widths (currently fixed: MAX_PANEL_WIDTH=450px, EMPTY_PANEL_WIDTH=180px)
- Panel collapse/expand animations (middle panel toggle could be smoother)
- Better gutter visualization (hints about what they're for, visual cues when links would appear)

**Relationship Info Box - Keyboard navigation**

**Custom Preset Management**

**Neighborhood Zoom + Feature Parity with Official Docs**

Features from LinkML-generated documentation to consider (see archived REFACTOR_PLAN for full details):
- **Terminology**: "Direct slots" vs "Induced slots" (direct = defined on class, induced = flattened including inherited)
- **Inheritance visualization**: Local neighborhood Mermaid diagrams showing class relationships
- **Attribute grouping**: Separate display of inherited vs direct attributes
- **Cardinality notation**: "0..1" (optional), "1" (required), "*" or "0..*" (multivalued)
- **Slot constraints**: Range constraints, required/multivalued flags (partially implemented)
- **Relationship patterns**: Self-referential, cross-class, activity relationships, mutual exclusivity
- **Raw YAML display**: Optional toggle to show raw schema definitions
- **Clickable navigation**: Between related classes, enums, slots (implemented)

Example: https://vladistan.github.io/linkml-qudt/datadict/#angleunit

**Relationship Labels**

This table can be put as a typescript object in appConfig.ts to provide labels
for the different relationships. It's not well-thought-out at this point. Need
to review actual LinkML terminology.

| **From** | **To**                         | **LinkML Label**                      | **Regular User Label**                    | **Notes**                        |
|----------|--------------------------------|---------------------------------------|-------------------------------------------|----------------------------------|
| Class    | Parent Class                   | "is_a"                                | "inherited from"                          | Tree structure (parent/child)    |
| Class    | Subclass                       | "has subclass"                        | "inherited by"                            | Reverse of inherits              |
| Class    | Enum (via slot)                | "has slot {name} with enum {enum}" .  | "has property {name} with {enum} values"  | Compound: Class→Slot→Enum        |
| Class    | Class (via slot)               | "has slot {name} referencing {class}" | "has property {name} referencing {class}" | Compound: Class→Slot→Class       |
| Class    | Slot (via slot reference)      | "uses slot"                           | "has property"                            | Class references global slot     |
| Class    | Slot (via slot_usage override) | "overrides slot"                      | "overrides property"                      | Class overrides global slot      |
| Slot     | Class/Enum (via range)         | "constrained by"                      | "constrained by"                          | Slot's range restriction         |
| Enum     | Class (via usage)              | "constrains slot {name} in {class}"   | "constrains slot {name} in {class}"       | Reverse: Enum→Class that uses it |
| Variable | Class                          | "instantiates"                        | "maps to"                                 | Variable is instance of Class    |
| Class    | Variables                      | "has instances"                       | "mapped from"                             | Reverse: Class→Variables         |
---

## 🔮 Future Ideas (Not Prioritized)

See separate document for these (TBD - for now, see old TASKS.md lines 449-815):
- Advanced Overview (cool future ideas)
- Performance - Virtualization (for bigger schemas when we get funding)
- Semantic Relationship Features (add LLM support, maybe MCP)

---

### Medium Priority (continued)

**Condition/DrugExposure Variable Display**
- Show message that these are handled as records, not specific variables
- Background: [See conversation with Anne](archive/tasks_pre_reorg.md#different-variable-treatment-for-condition-and-drug-exposure-classes)
- Message to display: "These [Condition|DrugExposure|etc.] variables were used in the pilot. There are potentially thousands of such items that can appear in actual data. They won't be handled as specific variables but as records in the harmonized data."

---

## 🧹 Documentation Cleanup Tasks

**✅ Completed:**
- Deleted obsolete files (COMPONENT_FLOW.md, GRAPHOLOGY_DESIGN.md, scripts/README.md)
- Archived completed docs (PROGRESS.md, REFACTOR_PLAN.md, DATA_FLOW.md)
- TASKS.md: Restructured and streamlined (this file!)
- CLAUDE.md: Consolidated and simplified (297 → 169 lines, 43% reduction)
- DATA_FLOW.md: Extracted relationship table, archived (1264 lines of pre-refactor content)
- UI_REFACTOR.md: Merged remaining items into TASKS.md, deleted

**Medium Priority:**
- Add graph model patterns, SlotEdge architecture docs (from completed REFACTOR_PLAN)

**Low Priority:**
- Merge TESTING.md with TESTING.root-snapshot file (if super easy)
- Review DOC_CONVENTIONS.md at end of refactor

---

## 🔧 Low-Level Technical Tasks

**Incorporate Unused Schema Fields into UI**
- dataLoader validates expected fields and warns about unexpected ones
- Goal: incorporate all processed JSON fields into UI (or explicitly decide not to)
- Run the app and check console for "Unexpected fields" warnings
- For each field: add to UI, add to expected fields list, or document why we're ignoring it
- Should do soon - new fields may influence architecture decisions

**Fix DetailContent.test.tsx** (19 failing tests)
- Pre-existing since mid-November 2025
- Root cause: DataService refactor was reverted, breaking test setup
- [See archived details](archive/tasks.md#detailcontent-tests)
- Low priority - doesn't block current work
