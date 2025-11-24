# Tasks

> **Active planning document** - For completed work, see [archive/progress.md](archive/progress.md)
>
> **Development principles** - See [CLAUDE.md](CLAUDE.md) for architectural rules and workflow

---

## 🐛 Current Bugs

### Link Rendering Issues
1. **Class→slot links pointing wrong direction** (3-panel mode)
2. **No link highlight on item hover**
3. **Specimen→analyte_type link missing** (see screenshot in old TASKS.md:107)
4. **SVG path NaN errors** - Console shows `<path> attribute d: Expected number, "M NaN NaN C NaN Na..."`
   - **Location**: LinkOverlay.tsx:448 (path element at line 450: `d={pathData}`)
   - something is wrong with the self-ref code on lines 403-412

### Hover/Detail Box Issues
5. **Slot hover shows "No relationships found"** - RelationshipInfoBox broken for slots

### Positioning Issues
6. **Detail box positioning bugs** - Multiple issues from Unified Detail Box work:
   - Remove unnecessary isStacked logic (#3)
   - Make stacked width responsive (#4)
   - Fix transitory/persistent box upgrade (#6)
   - Fix hover/upgrade behavior (#7)
   - See [archived details](archive/tasks.md#unified-detail-box-system) for full list

---

## 📋 Upcoming Work (Ordered by Priority)

### High Priority

**Complete Graph Refactor (Steps 6-7)**
- **Step 1**: Merge Element.ts and ElementPreRefactor.ts into single file
  - Currently split with prototype augmentation workaround
  - Should be unified after graph refactor complete
- **Step 2**: Migrate LinkOverlay to use graph-based relationships
  - Update to use `getRelationshipsNew()` instead of old `getRelationships()`
  - Uses graph edges instead of subclass-specific `this.attributes`
- **Step 3**: Remove old subclass-specific `getRelationships()` methods
  - Delete from ClassElement, EnumElement, SlotElement, VariableElement
  - Only keep graph-based `getRelationshipsFromGraph()`
  - Remove ClassSlot class (replaced by graph slot edges)
- See Element.ts:1-68 for full migration plan
- Eliminates subclass-specific code, completes Slots-as-Edges refactor

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

## 📝 Pending Decisions

**Two-Graph Analysis**
- Use "upcoming work details file" pattern
- Not sure yet where in refactoring order

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
