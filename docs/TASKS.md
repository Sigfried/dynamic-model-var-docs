# Tasks

> **Active planning document** - Completed work archived to [archive/tasks.md](archive/tasks.md)
> (Historical progress through Nov 2025 in [archive/progress.md](archive/progress.md))
>
> **Development principles** - See [CLAUDE.md](CLAUDE.md) for architectural rules and workflow

---

## 🐛 Current Bugs

- when showing/hiding middle panel, links don't update until some kind of interaction

## 📋 Upcoming Work (Ordered by Priority)

### Badge-Based Hover/Click Interaction (Next Up)
**Goal**: Replace complex timing-based hover with explicit badge/name hover areas

**Current issues with timing approach**:
- Flaky clicking (hover effect interferes)
- User can't predict what they'll get
- Complex debounce/linger timers

**Badge meaning confusion** (expected behavior, not a bug):
- Current badges show different things per type: enums show permissible values count, slots show used-by-classes count, etc.
- Relationship info box shows edge counts (incoming/outgoing relationships)
- These are fundamentally different concepts - badge shows "what this contains" while relationships show "what connects to this"
- New badge design should clarify this: relationship badge (new) vs existing count badge (different meanings per type)

**Proposed design**:
1. Add relationship badge to each item showing incoming/outgoing counts
   - Icon making clear it's relationship count (maybe `↘•↗` or similar)
   - Tooltip explaining the badge
   - Keep existing badges that show type-specific info (permissible values, etc.)
2. Hover badge → shows relationship info box (no timing - show while hovering)
3. Hover item name → shows detail box (no timing - show while hovering)
4. Click while hovering → upgrades that box to persistent

**Benefits**:
- Explicit intent (badge vs name)
- No timers - just CSS :hover essentially
- Predictable clicks
- Badge provides info at a glance

**Implementation notes**:
- Modify Section.tsx item rendering to add badge
- Remove debounce/linger timing from LayoutManager
- Slots might need two badges (class relationships, range)

### Floating Box Issues (Mostly Done ✅)
**Completed Dec 2024:**
- ✅ Responsive stacked width (calculates from remaining space)
- ✅ Transitory→persistent upgrade (changes mode, preserves position)
- ✅ RelationshipInfoContent extracted for FloatingBox use
- ✅ Transitory boxes managed by FloatingBoxManager
- ✅ Title/subtitle support with relationship counts
- ✅ Fit-content width for transitory boxes
- ✅ Fixed ID collision (rel- vs box- prefixes can coexist)
- ✅ Relationship metadata moved to DataService
- ✅ Transitory box height: fit-content up to 2/3 viewport (scrollable)
- ✅ Fixed slots not showing in class details (ClassElement slotCollection lookup bug)

**Remaining**:
- Hover positioning could be improved (currently appears near item, not always ideally placed)
- isStacked logic still affects draggability (enhancement: all boxes draggable)

### LinkOverlay fixes
- Edge labels: show on hover; tooltip display needs improvement

**URLs as clickable links**
- Display URIs as clickable links in detail panels
- Already set up infrastructure for this
- See: External Link Integration in Future Ideas

**item names as hover/links**
- in detail and hover boxes, make all item references
  act like they do in panels: hover box on hover, detail box
  on click. this is already working for most items in hover
  boxes but not slot names.

### Reduce Element subclass code 🔲
- Most behavior should move to graph queries or other layers
- Element classes become thinner wrappers around graph data
- Many methods can be replaced with graph queries
- **Why last**: Final cleanup after everything else works
- **Dependencies**: Graph as primary data source, Steps 3-4 complete

**Implementation Plan:**

1. **Simplify `getDetailData()` via tree abstraction** (BLOCKED: needs [Abstract Tree](#abstract-tree) first)
    - ~~Config-driven approach tried and abandoned~~ - just moves type-specific code around
    - Better approach: Element subclasses return **tree-shaped presentation data**
    - Services layer converts graph queries → uniform tree structure
    - Components render trees without knowing element types
    - **Wait for tree abstraction before tackling this**

2. **Move tree methods to Abstract Tree system** (see [Abstract Tree](#abstract-tree))
    - `toRenderableItems()`, `toSectionItems()`, `getSectionItemData()` → tree rendering layer
    - `ancestorList()`, `traverse()` → tree utilities
    - Element keeps only: `parent`, `children`, `pathFromRoot` (data)

3. **Consolidate flat collections** (Enum, Type, Slot)
    - Extract common `FlatCollection<T extends Element>` base
    - `fromData()` pattern is identical - parameterize by element constructor
    - Reduces ~135 lines of duplicated boilerplate

4. **Simplify Element subclass constructors**
    - Consider factory functions that map transformed data → Element properties
    - Or: Elements hold reference to transformed data + graph, compute on demand

5. **Graph as primary for relationship queries** (already partially done)
    - `getUsedByClasses()` already delegates to graph ✅
    - `ClassElement.getSlotElement()` → graph query
    - Remove `globalGraph` module variable - pass graph explicitly

6. **Fix remaining "DTO" terminology in codebase**
    - Rename references to use `*Input` (raw) or `*Data` (transformed) consistently
    - Update comments and documentation

**Target state:**
- Element subclasses: ~30-50 lines each (identity + type + data reference)
- Presentation logic: components layer or DetailDataBuilder
- Tree logic: Abstract Tree system
- Relationship queries: Graph module

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

**Key insight: All presentation data should be tree-shaped**

The graph provides the model abstraction (nodes with attributes, edges with attributes).
The presentation layer should use a **uniform tree data shape**:
```typescript
{title: 'Condition relationships', counts: {outgoing: 11, incoming: 20}, children: [
  {title: 'Outgoing', children: [
    {title: 'Inheritance', children: [{title: '→ Entity', linkTo: 'Entity', type: 'Class'}]},
    {title: 'Slots', children: [
      {title: 'condition_concept → ConditionConceptEnum', type: 'Enumeration'},
      ...
    ]},
  ]},
  {title: 'Incoming', children: [
    {title: 'Variables (20)', children: [{title: 'Angina'}, ...]},
  ]}
]}
```

**This simplifies the architecture:**
- **Graph** (model): nodes + edges with attributes
- **Services**: query graph → build tree-shaped presentation data
- **Components**: render trees (one abstraction works for DetailPanel, RelationshipInfoBox, Section panels)
- **Element subclasses**: become thin graph node wrappers; `getDetailData()` becomes "query graph, return tree"

**Enables Reduce Element Subclass Code task**: Once tree abstraction exists, Element subclasses can return tree-shaped data instead of complex DetailData objects, dramatically simplifying them.

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

**Methods to extract from Element base class:**
- `toRenderableItems()` (~30 lines) - tree → flat list with expansion
- `toSectionItems()` (~25 lines) - tree → SectionItemData list
- `getSectionItemData()` (~20 lines) - single element → SectionItemData
- `ancestorList()` (~10 lines) - walk up parent chain
- `traverse()` (~5 lines) - depth-first traversal

**Element keeps (data only):**
- `parent?: Element` - parent reference
- `children: Element[]` - child array
- `pathFromRoot: string[]` - precomputed path

**New tree utilities location options:**
- `src/utils/treeHelpers.ts` - standalone functions taking Element/tree node
- `src/models/TreeNode.ts` - interface + utility functions
- `src/hooks/useTreeRendering.ts` - hook wrapping tree → items conversion

---

### **Enum inheritance and other fields being ignored -- fix it**
- LinkML enums use `inherits` field (not `is_a` like classes)
- Semantics: enum includes all permissible values from inherited enums
- Currently: dataLoader/Element ignores enum `inherits` and other fields
- Also need to integrate other enum fields not yet surfaced in UI
- **Plan:**
  1. Audit EnumInput for all fields (check warnings in console)
  2. Add `inherits` and other missing fields to expected EnumInput fields
  3. Add fields to EnumData transformation
  4. In EnumElement: compute full permissible values (own + inherited)
  5. Show inheritance info in enum detail panel (which values came from where)
  6. Surface other enum fields in UI as appropriate
  7. Consider: graph edges for enum inheritance relationships

### **Grouped Slots Panel - Show slots organized by source**
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

**Issues to address before implementing:**
1. **Case inconsistency**: "inherited from" (lowercase) vs typical UI convention "Inherited from"
2. **Tense inconsistency**: "inherited from" (past) vs "maps to" (present) - pick one convention
3. **Missing context variants**: Different contexts need different phrasing (e.g., "extends" for subtitles vs "Inherits from" for section text)
4. **Compound templates not separable**: "has slot {name} with enum {enum}" bundles too much - need atomic parts
5. **Need theme support**: Structure should allow switching between "LinkML" (technical), "user-friendly", etc.
6. **Need template support**: Labels like "has slot {name} referencing {class}" need to accept item names as parameters

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

**Implement devError() utility for noisy development errors**
- Create `src/utils/devError.ts` with error handling utility
- In development: throws error with full context (stack trace, relevant IDs)
- In production: logs quietly but captures info for debugging
- Replace silent `return null` patterns throughout codebase with `devError()` calls
- See CLAUDE.md "Error Handling: Fail Loudly in Development" section
- Examples to fix: DataService lookups, graph queries, element resolution

**Incorporate Unused Schema Fields into UI**
- dataLoader validates expected fields and warns about unexpected ones
- Goal: incorporate all processed JSON fields into UI (or explicitly decide not to)
- Run the app and check console for "Unexpected fields" warnings
- For each field: add to UI, add to expected fields list, or document why we're ignoring it
- Should do soon - new fields may influence architecture decisions

**~~Fix DetailContent.test.tsx~~** ✅ FIXED (Dec 2024)
- Updated tests to use DataService API (itemId + dataService props)
- All 20 tests now passing (2 skipped intentionally)
