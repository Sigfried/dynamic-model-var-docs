# Tasks

## 🚨 URGENT - Demo Fixes (4 hours)

### ✅ Completed Quick Fixes (Round 1)

1. **✅ FIXED: Right panel cut off in 3-panel mode**
   - **Issue**: Stacked mode threshold didn't account for middle panel width + 2 gutters
   - **Fix**: Updated `calculateRemainingSpace()` to include `middlePanelVisible` parameter
   - **Files**: `utils/layoutHelpers.ts`, `components/LayoutManager.tsx`

2. **✅ FIXED: Hover boxes spilling over right edge of viewport**
   - **Issue**: X position calculated but not clamped to viewport width
   - **Fix**: Added `Math.min(idealX, maxX)` to prevent overflow
   - **Files**: `components/RelationshipInfoBox.tsx:88-93`

3. **✅ FIXED: No links to types (Round 2 - proper fix)**
   - **Issue 1**: Types weren't included in `computeIncomingRelationships()` check ✅
   - **Issue 2**: `categorizeRange()` was treating types as primitives, preventing link creation
   - **Fix**: Changed return type to include `'type'` and removed special case treating types as primitives
   - **Files**: `models/ElementPreRefactor.ts:621,132`

4. **✅ FIXED: Hover box z-index lower than detail boxes**
    - **Issue**: RelationshipInfoBox had `z-50`, FloatingBoxManager had `z-40`
    - **Fix**: Increased hover box to `z-[60]` so it appears above detail boxes
    - **Files**: `components/RelationshipInfoBox.tsx:283,307`

5. **Class→class links going left→left instead of left→right in 2-panel mode**
6. **class-->slot links pointing wrong direction**
7. **no slot-->class (right panel) links**
8. **no link highlight on item hover**
9. **⏭️ Slot hover "No relationships found"**

### After Demo: Documentation & Structure Cleanup

#### Relevant Documentation Files (prioritized)
1. **TASKS.md** (this file) - Keep, update with post-demo work
2. **UI_REFACTOR.md** - Keep, primary UI work tracking
3. **REFACTOR_PLAN.md** - Keep, completed architecture documentation
4. **PROGRESS.md** - Keep, historical record
5. **CLAUDE.md** - Keep, development principles
6. **TWO_GRAPH_ANALYSIS.md** - Review after demo, may inform future work
7. **LINKOVERLAY_REFACTOR_PLAN_v2.md** - Keep for LinkOverlay work

#### Obsolete Files to Delete
- [ ] ELEMENT_MERGE_ANALYSIS.md (obsoleted by two-graph decision)
- [ ] ELEMENTPREREFACTOR_RETIREMENT_PLAN.md (obsoleted by two-graph decision)
- [ ] COMPONENT_FLOW.md (if exists, check first)
- [ ] DATA_FLOW.md (check if obsolete)
- [ ] Item.ts (check if exists)
- [ ] Any other pre-refactor analysis files

---

## Table of Contents

### Active Work
- [Questions & Decisions Needed](#questions--decisions-needed)
  - [Architecture & Refactoring Decisions](#architecture--refactoring-decisions)
  - [Different Variable Treatment](#different-variable-treatment-for-condition-and-drug-exposure-classes)
- [Next Up (Ordered)](#next-up-ordered)
  - [Stage 1: Infrastructure Setup & Interface Definition](#stage-1-infrastructure-setup--interface-definition--in-progress)
  - [Stage 2: Import Types and Schema Validation](#stage-2-import-types-and-schema-validation--architectural)
  - [Stage 3: Refactor to Graph Model with SlotEdges](#stage-3-refactor-to-graph-model-with-slotedges--major)
  - [Stage 4: UI Layout Changes (Three-Panel)](#stage-4-ui-layout-changes-three-panel)
  - [Stage 5: Detail Box Updates](#stage-5-detail-box-updates)
  - [Stage 6: Documentation Updates](#stage-6-documentation-updates)
  - [Unified Detail Box System - Remaining Work](#unified-detail-box-system---remaining-work)

### Upcoming Features
- [App Configuration File](#app-configuration-file)
- [Fix Dark Mode Display Issues](#fix-dark-mode-display-issues-high-priority)
- [User Help Documentation](#user-help-documentation)

### Future Work
- [Future UI Improvements](#future-ui-improvements) - LinkOverlay refactor, Abstract Tree Rendering, Detail Panel enhancements
- [Future Work Section](#future-work) - Deferred features and major refactors
- [UI Test Checklist Template](#ui-test-checklist-template)

---

## Questions & Decisions Needed

### DetailContent.test.tsx Failures (19 tests)

**Status**: Pre-existing issue (broken since mid-November 2025)

**Investigation results** (2025-01-18):
- Last passing: Commit `4d32ec5` (Phase 11: Create FloatingBoxManager and rename DetailPanel)
- First failing: Commit `3021513` (Revert "refactor: Set up DataService infrastructure for Slots-as-Edges (Stage 2)")
- Root cause: DataService refactor was reverted, breaking test setup
- **Not related to Stage 3 (Slots-as-Edges) work**

**Current test status**:
- ✅ 163 tests passing (up from 143 before fixes)
- ❌ 19 tests failing in DetailContent.test.tsx only
- All other test failures fixed (targetType→targetSection terminology changes)

**Action needed**: Fix DetailContent test setup to work with current DataService structure. Low priority - doesn't block current refactor work.

---

## Architecture & Refactoring Decisions

**📌 [ARCHIVED TO PROGRESS.md]**
- All quick wins completed and archived in Phase 13
- Core architecture now documented in REFACTOR_PLAN.md (Slots-as-Edges with graph model)
- Implementation plan integrated with prerequisite: "Improve Schema Data Loading and Validation" below

---

### Different Variable Treatment for Condition and Drug Exposure Classes 

<details>
<summary><b>conversation about this</b></summary>

> **Anne**: I think I made a mistake by calling "asthma" and "angina" variables. BMI is a variable that is a Measurement observation. We can think of BMI as a column in a spreadsheet. We wouldn't have a column for "asthma" - we would have a column for conditions with a list of mondo codes for the conditions present. This becomes more important when we are talking about the "heart failure" and "heart disease" columns. Where does one draw lines? The division of conditions into variables/columns might be ok if all we're looking at is asthma and angina, but quickly gets too hard to draw lines.

> **Siggie**: So, should those variables appear in the variable specs at all? If so, how should we represent them? And are there other variables in the specs that need special treatment or don't belong?

> **Anne**: I think they should appear, just differently. Perhaps as a list? maybe a layered donut? I think DrugExposures will need to be depicted in the same way

> **Siggie**:
    what should i call these things if not variables?
    layered donut? sounds tasty, but i'm not sure how it would work.
    do we have additional documentation for any of these that we would want to include? like we could set up Angina to link to angina_prior_1 if that would be appropriate

> **Anne**:
    You can call them Conditions and Drug Exposures for now
    I think for angina, we would want a link to the URI

> **Siggie**:
    where would i get the URI?

> **Anne**:
  I would recommend harvesting all the mondo and hpo curies out of the transform files

> **Siggie**:
> you're talking about [these yaml files](https://github.com/RTIInternational/NHLBI-BDC-DMC-HV/tree/main/priority_variables_transform)?
> 
> so for Atrial fibrillation:
>   - manually map it to what it's called in the yaml file names, afib
>   - find all the mondo URIs in those files, maybe just one unique one: MONDO:0004981
>   - there don't seem to be any hpo URIs
>   - generate a link to it (which I thought I knew how to do using the prefix from bdchm.yaml:
>     MONDO: http://purl.obolibrary.org/obo/MONDO_, but I don't, though I'm sure it's not hard)
>
>  did i get that right?
</details>

Also see [Slack DMs with Corey](https://dmc-cmm6947.slack.com/archives/C0917F5RFL1/p1763071597354059)

#### [sg] resolution:
when displaying these or maybe other groups of variables (e.g., Procedure), show
a message like:

> These <Condition|DrugExposure|etc.> variables were used in the pilot. There are potentially thousands of <
> Condition|etc.>s that can appear in actual data. They won't be handled as specific variables but as <...> records in the
> harmonized data

---

## Next Up (Ordered)

### UI Component Refactoring 🎨 ACTIVE

**Status**: ⚠️ **IN PROGRESS** - Model/architecture refactor complete, UI needs updates

**Goal**: Update UI components to work correctly with graph-based model and three-panel layout

**See [UI_REFACTOR.md](UI_REFACTOR.md) for detailed component-by-component breakdown.**

**High Priority** (blocking demo):
1. **LinkOverlay 3-panel display** - Links not rendering correctly when middle panel visible
2. **Hover box fixes** - RelationshipInfoBox broken for slots, possibly types
3. **Transform schema optimization** - Exclude unused types to reduce bundle size

**Medium Priority**:
4. **Detail box slot edges** - Not rendering clickable slot edges
5. **Floating box manager** - Cascade positioning bugs
6. **Grouped slots panel** - Design complete, needs implementation

**Lower Priority**:
7. **LayoutManager enhancements** - Misc improvements
8. **Type filtering** - Only show types actually used in schema

---

### Documentation Cleanup 📚 TODO

**Status**: TODO - Archive refactor work and update docs

**Goal**: Update documentation to reflect completed Slots-as-Edges architecture.

**Updates needed**:
- ✅ REFACTOR_PLAN.md - Marked complete, points to UI_REFACTOR (done)
- ✅ PROGRESS.md - Archived Stages 1-5 as Phase 17 (done)
- ⏭️ CLAUDE.md - Add graph model patterns, SlotEdge architecture
- ⏭️ DATA_FLOW.md - Update for Slots-as-Edges and graphology
- ⏭️ TASKS.md - Remove obsolete items (this file)

---


### Unified Detail Box System - Remaining Work

**Context**: Steps 0-3 completed, Step 4 partially complete. Core functionality working but some bugs and enhancements remain.

**Completed**: FloatingBoxManager component, DataService abstraction, hover positioning, cascade algorithm, architecture violations fixed

**Remaining issues** (from Step 4):

1. **Hover positioning** (⚠️ minor)
   - Working but not centered on item (appears near top)
   - Expected: Box should center vertically on hovered item
   - Check RelationshipInfoBox.tsx positioning logic

2. **Refactor UI to use itemId instead of type** (⭐ priority)
   - Problem: UI layer using `type` field violates view/model separation
   - ItemHoverData has `type` field (Section.tsx:22)
   - LinkOverlay compares `link.source.type === hoveredItem.type`
   - Solution: Change to use `itemId` for identity throughout UI layer

3. **Remove unnecessary isStacked logic** (enhancement)
   - All boxes should be draggable regardless of display mode
   - displayMode only affects initial positioning, not capabilities

4. **Make stacked width responsive** (enhancement)
   - Currently fixed at 600px
   - Should calculate based on available space after panels

5. **Move box management logic to FloatingBoxManager** (refactor)
   - App.tsx currently handles array management, duplicate detection, bring-to-front
   - Should move to FloatingBoxManager for better encapsulation

6. **Fix transitory/persistent box upgrade architecture** (enhancement)
   - Current: Creates new box on upgrade, causing position jump
   - Should: Modify existing RelationshipInfoBox mode from transitory → persistent

7. **Hover/upgrade behavior broken** (❌ critical)
   - App.tsx:155 creates DetailContent instead of RelationshipInfoBox on upgrade
   - RelationshipInfoBox uses fixed positioning which conflicts with FloatingBox wrapper
   - Fix: Refactor RelationshipInfoBox to support both transitory and persistent modes

8. **Cascade positioning - boxes stacking incorrectly** (❌ bug)
   - Non-user-positioned boxes appear on top of each other in wrong place
   - Note: URL restoration positioning IS working correctly
   - Code location: FloatingBoxManager.tsx:148-194

9. **Delete old components** (cleanup)
   - Delete DetailDialog.tsx
   - Delete DetailPanelStack.tsx

10. **Update tests** (testing)
    - Test relationship box upgrade flow
    - Test multiple relationship boxes
    - Test mixed content types (relationship + detail boxes)

**For detailed implementation history**, see full "Unified Detail Box System" section in git history (search for "Unified Detail Box System Quick Navigation" comment).

---

## Future UI Improvements

Tasks moved here during Slots-as-Edges refactor documentation consolidation. These will be revisited after Stage 6 completes.

### LinkOverlay Refactor ⚠️ NEEDS REVISION FOR SLOTS-AS-EDGES

**Status**: Implementation plan needs updating for Slots-as-Edges architecture

**Original goal**: Eliminate nested loops and type awareness from LinkOverlay. Will need revision once slots become edges.

See REFACTOR_PLAN.md Stage 4 for how this fits into three-panel layout with slot edge traversal.

---

### Abstract Tree Rendering System

**IMPORTANT**: Before starting, give tour of current tree rendering, fully specify interface, write production code inline first before extracting.

**Goal**: Extract tree rendering and expansion logic from Element into reusable abstractions

**Benefits**:
- Consistent tree UX across Elements panel and info boxes
- Easier to add new tree-based displays
- Centralizes expansion logic
- Could support multiple tree layouts (simple indented, tabular with sections)

See full task description in Future Work section for implementation approach.

---

### Detail Panel Enhancements

**Enum Detail Improvements**:
- Enums have either permissible values OR instructions for getting values from elsewhere (`reachable_from` field)
- Will need to load prefixes to link to external ontologies

**Slots Table Optimization**:
- Slot order not currently correct - inherited slots should be at top
- Use Abstract Tree Rendering System (once implemented) to group slots by ancestor
- Each group becomes a collapsible tree node

See full task description in Future Work section for details.

---

## Upcoming Features

### App Configuration File

**Goal**: Centralize hard-coded constants into a single configuration file for easier maintenance and tuning

**Current state**: Constants scattered throughout components
- RelationshipInfoBox.tsx: hover debounce (300ms), linger duration (1.5s), upgrade time (1.5s)
- Various components: type-related colors (blue/purple/green/orange)
- Other hard-coded values: spacing, sizes, thresholds

**Design consideration**: Allow values to be expressed as functions or constants
- Simple constants for fixed values (e.g., `hoverDebounce: 300`)
- Functions for calculated values (e.g., `getMaxHeight: () => window.innerHeight * 0.8`)
- Helps developers find both constant and calculated values in one place

**Create**: `src/config/appConfig.ts`

**Constants to centralize**:
```typescript
export const APP_CONFIG = {
  // Timing constants (milliseconds)
  timing: {
    hoverDebounce: 300,      // Delay before showing preview on hover
    lingerDuration: 1500,    // How long preview stays after unhover
    upgradeHoverTime: 1500,  // Hover duration to upgrade preview to persistent box
  },

  // Element type colors
  colors: {
    class: 'blue',
    enum: 'purple',
    slot: 'green',
    variable: 'orange',
  },

  // UI thresholds
  thresholds: {
    collapsibleListSize: 20,  // Show "...N more" for lists over this size
    collapsedPreviewCount: 10, // How many items to show when collapsed
  },

  // Add other constants as discovered
};
```

**Files to update**:
- `src/components/RelationshipInfoBox.tsx` - Import timing constants
- `src/components/DetailContent.tsx` - Import color constants
- `src/components/Section.tsx` - Import color constants
- Other component files using hard-coded colors/values

**Benefits**:
- Single source of truth for tuning behavior
- Easier to experiment with different timing values
- Prepares for future user preferences/settings
- Documents significant constants in one place

---

### Fix Dark Mode Display Issues (HIGH PRIORITY)

**Goal**: Fix readability issues in dark mode
**Importance**: High - app currently unusable in dark mode

**Issues from screenshot**:
- Poor contrast/readability throughout
- Need to audit all color combinations

**Files likely affected**:
- `src/index.css` - Tailwind dark mode classes
- All component files using colors
---

### User Help Documentation

**Goal**: Create comprehensive user help system

**Approach**:
1. Start composing help content in a markdown file (before adding to app UI)
2. Begin with content from README.md "For Users" section (after TOC)
3. Focus on features that might not be obvious or could be confusing
4. Review PROGRESS.md for additional material to include

**UI Integration** (after content is ready):
- Opens in FloatingBox
- Full help: Large box with table of contents
- Contextual help: Opens to relevant section (scrolled into view)
- Can open entire help with section highlighted
---

## Future Work

### Relationship Info Box Enhancements (deferred from Phase 10)

- **Bi-directional preview**: Hovering over element names in info box highlights them in tree panels
- **"Explore relationship" action**: Open both elements side-by-side for comparison
- **Keyboard navigation**: Arrow keys, Enter, Tab for navigating within info box
- **Quick filter toggles**: Filter relationships by type (show/hide inheritance, slots, variables, etc.)

---
### selfRefs
links from an item to itself were supposed to be little loops instead of crossing panels

### Merge TESTING.md Files

**Background**: TESTING.md was copied to root and diverged from docs/TESTING.md

**Files**:
- `TESTING.root-snapshot-2025-11-03.md` (4.6k) - Newer, condensed, Phase 6.4+ testing patterns
- `docs/TESTING.md` (17k) - Older, comprehensive testing documentation

**Task**: Merge the newer Phase 6.4+ content into the comprehensive docs/TESTING.md, then delete snapshot

---

### Split Element.ts into Separate Files

**Current state**: Element.ts is 919 lines with 4 element classes + 4 collection classes

**Target structure** (keep element class with its collection class in same file):
- `models/Element.ts` (base Element and ElementCollection classes)
- `models/ClassElement.ts` (ClassElement + ClassCollection)
- `models/EnumElement.ts` (EnumElement + EnumCollection)
- `models/SlotElement.ts` (SlotElement + SlotCollection)
- `models/VariableElement.ts` (VariableElement + VariableCollection)
- `models/index.ts` (barrel export)

**Benefits**:
- Each element/collection pair stays together (easier to maintain)
- Smaller, more focused files
- Easier to understand each element type in isolation

---

### Overhaul Badge Display System

**Goal**: Make badges more informative and clear about what counts they represent

**Current problems**:
- Badges show single counts (enum values, slot usage, variable count) but it's unclear what they mean
- Users might want to see multiple counts per element (e.g., class shows variable count but not enum/slot counts)
- No labels on badges - just numbers in colored pills

**Potential improvements**:
- Multi-badge display: Show multiple counts per element (e.g., "103 vars, 5 enums, 2 slots")
- Badge labels or tooltips: Make it clear what each number represents
- Configurable: Let users choose which counts to display
- Contextual: Different badge types for different views

**Implementation approach TBD** - Need to design before implementing

**Files likely affected**:
- `src/models/Element.ts` - Replace simple `getBadge(): number` with richer badge info
- `src/components/Section.tsx` - Render multiple badges or labeled badges
- `src/models/RenderableItem.ts` - Update badge field to support richer info

---

### Search and Filter

**Potential importance**: High - major usability feature for exploring large schemas

**Search functionality**:
- Search bar with full-text search across all elements
- Highlight search results in tree/sections
- Quick navigation: search results open in new dialogs

**Filter controls**:
- Checkboxes for class families
- Variable count slider
- Relationship type toggles

---

### Neighborhood Zoom

**Potential importance**: Medium - useful for focused exploration

**Focus mode**:
- Show only k-hop neighborhood around selected element
- Relationship type filters ("show only `is_a` relationships" vs "show associations")
- Breadcrumb trail showing navigation path
- "Reset to full view" button

---

### Enhanced Element Metadata Display

Show additional relationship counts in tree view:
- **Current**: Only variable count (e.g., "Condition (20)")
- **Desired**: "Condition (20 vars, 5 enums, 2 classes, 1 slot)"

---

### Custom Preset Management

User-managed presets replacing hard-coded ones:
- Save Preset button → prompts for name
- Saves current panel configuration (sections + dialogs) to localStorage
- Display saved presets in header with remove icons

---

### Advanced Overview

Multiple view modes and analytics:
- Tree view (current)
- Network view (force-directed graph for associations)
- Matrix view (class-enum usage heatmap)
- Mini-map showing current focus area
- Statistics dashboard

---

### Terminology Consistency

**Goal**: Use consistent terminology throughout app
**Importance**: Low - internal consistency improvement

**Problem**: Still using "Property" to denote attributes and slots

**Action needed**:
- Use "Attribute" and "Slot" consistently
- Document terminology guidelines to prevent regression

**Terminology guidelines**:
- ✅ **Attribute** or **Slot** - NOT "Property"
- ✅ **Element** - NOT "Entity" (entity was old term)
- ✅ **Class**, **Enum**, **Slot**, **Variable** - Capitalize when referring to element types

**Terminology configuration**:
- It might be better for some people to see "<current class> is_a <base class>" and other people to see "<current class> inherits from <base class>". Allow that to be a (probably) user-configurable option.
- I don't know how software with internationalization capabilities handle this, or with configurable display themes, but we could try similar approaches.

---

### External Link Integration

**Goal**: Link prefixed IDs to external sites (OMOP, DUO, etc.)

**Implementation**:
- Use prefix data from bdchm.yaml
- Make CURIEs clickable in variable details
- Add tooltip showing full URL before clicking

---

### Feature Parity with Official Docs

Reference: https://rtiinternational.github.io/NHLBI-BDC-DMC-HM/

Missing features:
1. **Types** - Import and display linkml:types
2. **Dynamic enums** - Show which enums are dynamic
3. **LinkML Source** - Collapsible raw LinkML view
4. **Direct and Induced** - Show direct vs inherited slots
5. **Partial ERDs** - Visual relationship diagrams

---

### GitHub Issue Management

Issue: https://github.com/RTIInternational/NHLBI-BDC-DMC-HM/issues/126
- Make issue more concise
- Add subissues for specific features (ASK FIRST)

---

#### Future: Graph-based Model Architecture (Major Refactor)

**Status**: Design idea only - not implementing yet

**Proposal** (from [DATA_FLOW.md discussion](../docs/DATA_FLOW.md#L1017-L1065)):

Use graphology library to represent model as directed acyclic graph (DAG):
- Store model as graph with artificial root node
- Parent relationships = edges in graph
- Child relationships = transpose of graph
- Paths computed on-demand via graph traversal (not stored)
  [sg] not a goal in itself, but graphology makes it easy
- Collections simplified to graph queries
- Relationships = edge lists
- [sg] not sure if this approach makes it easy to keep the graph
  features as part of Element or if it would exist beside
  the Element/ElementCollection classes
    - the collection classes could probably be hugely simplified
- [sg] Abstract Tree Rendering System
    - this will serve UI components, but they could also make
      use of graphology

**Benefits**:
- Eliminates manual tree construction code
- Powerful graph algorithms available
- Unified relationship model
- Easier to query and visualize

**Concerns**:
- Huge refactor touching most files
- New dependency and learning curve
- Unknown performance implications
- Possibly over-engineering

**Decision**: Implement incremental improvements first (pathFromRoot array, eliminate slotPath, centralize tree construction). Re-evaluate graph approach only if complexity remains high after these improvements.

---
### Performance Optimizations

When working with larger models or slower devices:
- **Virtualize long lists**: MeasurementObservation has 103 variables; consider react-window or react-virtual
- **Viewport culling for links**: Only render SVG links for visible elements
- **Animation library**: Consider react-spring for smoother transitions (current CSS transitions work fine)

---

### Review DOC_CONVENTIONS.md

**Goal**: Review DOC_CONVENTIONS.md and decide if there are parts worth keeping or integrating elsewhere
**Importance**: Low - documentation maintenance

---

### Semantic Relationship Features

**Context**: Semantic relationship patterns identified during analysis could be valuable for user-facing features

**Semantic patterns identified**:
1. **Containment/Part-of**: `parent_specimen`, `parent_container`, `part_of`
2. **Association**: `associated_participant`, `source_participant`, `performed_by`
3. **Activity/Process**: `creation_activity`, `processing_activity`, `storage_activity`
4. **Measurement**: `value_quantity`, `range_low`, `range_high`, `quantity_measure`
5. **Provenance**: `*_provenance`, `derived_from`
6. **Organization/Study**: `member_of_research_study`, `originating_site`

**Potential features**:
- User-facing documentation/tooltips
- Search result grouping by semantic category
- Suggested exploration paths ("Show specimen workflow", "Show participant data")
- AI-assisted query answering
- Smart search: "find containment relationships" could match `parent_*` and `part_of` patterns

**Implementation approach when ready**:
- Extract patterns from attribute names (regex/keyword matching)
- Make patterns configurable (JSON/YAML file of patterns)
- Use for suggestions/enhancements, not core functionality
- Keep structural navigation as primary interface

**Note**: This is a future enhancement - current structural approach (categorize by range: primitive/enum/class) is stable and schema-change-safe.

---

## UI Test Checklist Template

Use this template after significant work. Copy, fill out, and add to a `<details>` section in the relevant task.

### Standard Smoke Tests

**Commit**: `[commit-hash]`
**Test Date**: `[YYYY-MM-DD]`
**Tester**: `[initials]`

#### Architecture & Build
- [ ] `./scripts/check-architecture.sh` - All checks passing
- [ ] `npm run typecheck` - No TypeScript errors
- [ ] `npm run build` - Build succeeds
- [ ] Console errors - None in normal operation

#### Basic Functionality (Cascade Mode)
- [ ] Click item name → Opens detail box
- [ ] Click same item again → Brings existing box to front (no duplicate)
- [ ] Open multiple boxes → Cascade positioning works correctly
- [ ] Drag box → Smooth dragging, stays where placed
- [ ] Resize box → Smooth resizing, respects min size
- [ ] Click box → Brings to front (z-index updates)
- [ ] Close button → Closes box
- [ ] ESC key → Closes boxes in order (oldest first)

#### Hover Functionality (Cascade Mode)
- [ ] Hover item → RelationshipInfoBox appears after delay
- [ ] Box positioning → Positioned relative to item (check alignment)
- [ ] Mouse leave item → Box lingers briefly then disappears
- [ ] Hover over box → Cancels linger timer
- [ ] Hover box 1.5s → Upgrades to persistent (if applicable)
- [ ] Click box → Upgrades to persistent immediately (if applicable)

#### Stacked Mode
- [ ] Switch to stacked mode → Boxes appear in right panel
- [ ] Boxes in vertical stack → Newest at top
- [ ] Close button → Works in stacked mode
- [ ] ESC key → Works in stacked mode
- [ ] Drag boxes → Should work (per architecture) or note if not implemented
- [ ] Hover functionality → Should NOT show RelationshipInfoBox in stacked mode

#### Link Visualization
- [ ] Hover item → Links highlight
- [ ] Links render correctly → No visual glitches
- [ ] Self-references → Curved arrows appear correctly

#### URL State Persistence
- [ ] Open boxes → URL updates with state
- [ ] Copy URL, open in new tab → State restores correctly
- [ ] Preset links → Work as expected

### Focused Test Checklist (For Specific Features)

Use this when testing a specific feature fix. List only the tests relevant to the feature.

**Feature**: `[Brief description]`
**Commit**: `[commit-hash]`
**Related Issue**: `[If applicable]`

- [ ] **Test 1**: [Description]
  - Expected: [What should happen]
  - Result: [What actually happened]
  - Screenshot: [If applicable]

- [ ] **Test 2**: [Description]
  - Expected: [What should happen]
  - Result: [What actually happened]

[Add more as needed]

**Overall Status**: ✅ All passing | ⚠️ Issues found | ❌ Blocking issues

**Notes**: [Any observations, edge cases, or follow-up items]
