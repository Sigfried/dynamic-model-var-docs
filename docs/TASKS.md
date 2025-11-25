# Tasks

> **Active planning document** - For completed work, see [archive/progress.md](archive/progress.md)
>
> **Development principles** - See [CLAUDE.md](CLAUDE.md) for architectural rules and workflow

---

## 🐛 Current Bugs

### Link Rendering Issues
1. **Class→slot links pointing wrong direction** (3-panel mode)
2. **Specimen→analyte_type link missing** (see screenshot in old TASKS.md:107)
3. **SVG path NaN errors** - Console shows `<path> attribute d: Expected number, "M NaN NaN C NaN Na..."`
   - **Location**: LinkOverlay.tsx:448 (path element at line 450: `d={pathData}`)
   - something is wrong with the self-ref code on lines 403-412

### Hover/Detail Box Issues
4. **Slot hover shows "No relationships found"** - RelationshipInfoBox broken for slots

### Positioning Issues
5. **Detail box positioning bugs** - Multiple issues from Unified Detail Box work:
   - Remove unnecessary isStacked logic (#3)
   - Make stacked width responsive (#4)
   - Fix transitory/persistent box upgrade (#6)
   - Fix hover/upgrade behavior (#7)
   - See [archived details](archive/tasks.md#unified-detail-box-system) for full list

---

## 📋 Upcoming Work (Ordered by Priority)

### High Priority

**Complete Graph Refactor and Element Architecture Refactor**

Ordered by implementation dependencies. See [archive/ELEMENT_MERGE_ANALYSIS.md](docs/archive/ELEMENT_MERGE_ANALYSIS.md) for merge history.

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

### Phase 3: Data Flow Refactor (High Risk) - DO THIS FIRST

**Step 5: Refactor data flow** 🔲 **← NEXT PRIORITY**
```
Current: DTOs → Element constructors → Domain Models
Planned: DTOs → dataLoader transform → graph build → Element instances (reduced role)
```
- **Why first**: Graph structure changes will affect LinkOverlay, so stabilize this before migrating LinkOverlay
- **Dependencies**: Phase 3 Step 6 (complete)

**Step 6: Remove DTO imports from Element.ts** ✅ **COMPLETE**
- Element.ts has no DTO imports
- Only dataLoader uses DTOs (correct!)
- SchemaTypes just re-exports SlotDefinition

**Step 7: Reduce Element subclass code** 🔲
- Most behavior should move to graph queries or other layers
- Element classes become thinner wrappers around graph data
- Many methods can be replaced with graph queries
- **Why last**: Final cleanup after everything else works
- **Dependencies**: Graph as primary data source

### Phase 2: LinkOverlay Migration (Medium Risk) - AFTER PHASE 3 STEP 5

**Planning Task: Review LINKOVERLAY_REFACTOR_PLAN.md and Phase 2 tasks** 🔲
- Align plan with current architecture decisions
- Finalize approach after Phase 3 Step 5 complete
- See [LINKOVERLAY_REFACTOR_PLAN.md](../LINKOVERLAY_REFACTOR_PLAN.md)

**Step 3: Migrate LinkOverlay to graph-based relationships** 🔲
- Update to use `getAllPropertyEdges()` instead of old `getRelationships()`
- Uses graph edges instead of subclass-specific `this.attributes`
- Fix 3-panel display bugs while migrating
- **Partial progress**: `getAllPropertyEdges()` implemented in DataService
- **Dependencies**: Phase 3 Step 5 (stable graph structure), planning review

**Step 4: Remove old getRelationships() methods** 🔲
- Delete from ClassElement, EnumElement, SlotElement, VariableElement
- Only keep graph-based `getRelationshipsFromGraph()`
- Remove ClassSlot class (replaced by graph slot edges)
- **Dependencies**: LinkOverlay migration complete (Step 3)

**Step 7: Reduce Element subclass code** 🔲
- Most behavior should move to graph queries or other layers
- Element classes become thinner wrappers around graph data
- Many methods can be replaced with graph queries
- **Why last**: Final cleanup after everything else works
- **Dependencies**: Graph as primary data source

**Step 8: Retire *Deprecated types** 🔲
- Migrate RelationshipInfoBox to use EdgeInfo/ItemInfo instead of *Deprecated types
- Remove EdgeInfoDeprecated, ItemInfoDeprecated, RelationshipDataDeprecated
- Remove getRelationshipsNew() method
- **Dependencies**: Phase 2 Steps 3-4 complete

### More Upcoming

- ✅ **Merge Element.ts and ElementPreRefactor.ts**
  - Merged via git mv to preserve history
  - Renamed ItemInfoProposal → ItemInfo, EdgeInfoProposal → EdgeInfo
  - Old types renamed to *Deprecated for backward compatibility

**LinkOverlay fixes**
- Currently active work fixing 3-panel display issues
- See current bugs above
- Refactoring plans:
    - [UI_REFACTOR.md § LinkOverlay](UI_REFACTOR.md#1-linkoverlay-refactor)
    - [LINKOVERLAY_REFACTOR_PLAN.md](../LINKOVERLAY_REFACTOR_PLAN.md) (some content may still be relevant)

**URLs as clickable links**
- Display URIs as clickable links in detail panels
- Already set up infrastructure for this
- See: External Link Integration in Future Ideas

**selfRefs (loop links)**
- Display self-referential links as loops instead of crossing panels
- Implementation: `generateSelfRefPath()` in [src/utils/linkHelpers.ts:235](../src/utils/linkHelpers.ts#L235)
- May have done some of this on branch (check)

### Medium Priority

**Grouped Slots Panel - Show slots organized by source**
- Display slots grouped by Global + per-class sections
- Show inheritance (inherited vs defined here vs overridden)
- Visual indicators for slot origin
- See [LINKOVERLAY_REFACTOR_PLAN.md](../LINKOVERLAY_REFACTOR_PLAN.md) lines 10-53 for detailed design
- **Dependencies**: Graph-based queries working (Phase 3 Step 5)

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
- Refactoring plans: [UI_REFACTOR.md § DetailContent](UI_REFACTOR.md#3-detailcontent-refactor)

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
- DATA_FLOW.md: Extracted relationship table to UI_REFACTOR.md, archived (1264 lines of pre-refactor content)

**Medium Priority:**
- Add graph model patterns, SlotEdge architecture docs (from completed REFACTOR_PLAN)

**Low Priority:**
- Merge TESTING.md with TESTING.root-snapshot file (if super easy)
- Review DOC_CONVENTIONS.md at end of refactor

---

## 🔧 Low-Level Technical Tasks

**Fix DetailContent.test.tsx** (19 failing tests)
- Pre-existing since mid-November 2025
- Root cause: DataService refactor was reverted, breaking test setup
- [See archived details](archive/tasks.md#detailcontent-tests)
- Low priority - doesn't block current work
