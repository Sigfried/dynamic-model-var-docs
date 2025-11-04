# Tasks

## Questions & Decisions Needed

### Boss Question: Variable Treatment for Condition Class

**Context**: My boss said that "variables" for Condition should be treated differently.

**Her explanation**:
> I think I made a mistake by calling "asthma" and "angina" variables. BMI is a variable that is a Measurement observation. We can think of BMI as a column in a spreadsheet. We wouldn't have a column for "asthma" - we would have a column for conditions with a list of mondo codes for the conditions present. This becomes more important when we are talking about the "heart failure" and "heart disease" columns. Where does one draw lines? The division of conditions into variables/columns might be ok if all we're looking at is asthma and angina, but quickly gets too hard to draw lines.

**My follow-up**:
> So, should those variables appear in the variable specs at all? If so, how should we represent them? And are there other variables in the specs that need special treatment or don't belong?

Will return to this when i have her next response.

---

## Next Up (Ordered)

### App.tsx Refactoring

**Current state**: App.tsx is 583 lines with complex state management

**Goal**: Extract logic into testable hooks, reduce to ~200 lines of composition

**Extract into hooks**:
- `hooks/useModelData.ts` - Data loading (currently useEffect + loadModelData)
- `hooks/useLayoutState.ts` - Panel layout + expansion state (consolidate useExpansionState)
- `hooks/useDialogState.ts` - Dialog management (100+ lines of restore logic)

**Additional cleanup**:
- Consolidate expansion state: Move from useExpansionState hook into statePersistence.ts
- Remove dead code: Delete evc/ecn params from statePersistence.ts (replaced by lve/rve/lce/rce)

**Why this matters**:
- Makes each concern testable in isolation
- Reduces App.tsx complexity significantly
- Clarifies state management flow
- This is valuable refactoring, not cosmetic

**Files to create**:
- `src/hooks/useModelData.ts`
- `src/hooks/useDialogState.ts`
- `src/hooks/useLayoutState.ts`

**Files to modify**:
- `src/App.tsx`
- `src/utils/statePersistence.ts`

---

### Link System Enhancement

**Goal**: Refactor LinkOverlay to follow view/model separation + add hover tooltips

**Components**:

1. **LinkOverlay Refactoring** (architecture)
   - Define `LinkData` interface in LinkOverlay.tsx (component defines contract)
   - Properties: startId, endId, startColor, endColor, hoverData
   - Element provides data via new method (adapts to component's needs)
   - Remove direct element access from LinkOverlay component

2. **Enhanced Link Hover Information** (feature)
   - Tooltip or overlay showing:
     - Relationship type (is_a, property, etc.)
     - Slot name (for property relationships)
     - Source element (name + type)
     - Target element (name + type)
     - Additional metadata as appropriate
   - Add tooltip component that follows cursor or attaches to link
   - Extract relationship details from Link object
   - Style to be readable but not intrusive

3. **Hover Handler Contracts** (architecture)
   - Components define their own hover data interfaces (like SectionItemData)
   - Example: `interface ElementHoverData { type: string; name: string; }` in component
   - Element provides data that fits component's contract
   - Remove opaque `{ type: string; name: string }` pattern

**Current state**:
- Links show basic info in console.log on hover
- Components pass around hover data as opaque objects
- LinkOverlay still accesses element properties directly

**Files affected**:
- `src/components/LinkOverlay.tsx` - Add tooltip, define LinkData interface
- `src/utils/linkHelpers.ts` - Additional metadata extraction
- `src/models/Element.ts` - Keep getRelationships(), possibly add getLinkData()
- Various components - Define hover data interfaces

---

### Unified Detail Box System

**Goal**: Extract dialog management from App.tsx, merge DetailDialog/DetailPanelStack into unified system

**Current state**:
- DetailPanel: 130-line content renderer using getDetailData() ✅
- DetailDialog: Floating draggable/resizable wrapper
- DetailPanelStack: Stacked non-draggable wrapper
- App.tsx: Manages openDialogs array and mode switching

**New file structure**:
```
src/components/
  DetailPanel.tsx           (keep - content renderer, 130 lines, uses getDetailData())
  DetailBoxManager.tsx      (new - manages array + rendering)
    - DetailBox component   (draggable/resizable wrapper)
    - Array management (FIFO stack)
    - Mode-aware positioning
```

**DetailBox component** (single component, works in both modes):
- All boxes identical: draggable, resizable, colored headers
- Mode only affects initial position (not capabilities)
- Uses element.getDetailData() for header (no ElementTypeId prop needed)
- Click/drag/resize anywhere in box → bring to front (move to end of array)
- ESC closes first/oldest box (index 0)

**Mode behavior** (intelligent repositioning):
- **Floating mode** (narrow screen): New boxes cascade from bottom-left
- **Stacked mode** (wide screen): New boxes open in stack area
  - Consider changing layout to newest on bottom, then new boxes can overlap so only header of previous shows
  - With click-to-front, this should work well
- **Mode switch to stacked**: All boxes move to stack positions
- **Mode switch to floating**:
  - User-repositioned boxes → restore custom position from URL state
  - Default boxes → cascade from bottom-left

**URL state tracking**:
- Track which boxes have custom positions (user dragged/resized)
- On mode switch, respect user customizations
- Default positions don't persist

**Important**:
- Make sure new boxes are always fully visible:
  - In stacked layout by scrolling
  - In floating, by resetting vertical cascade position when necessary

**Implementation steps**:

1. **Create DetailBoxManager.tsx**
   - Extract openDialogs array management from App.tsx
   - Single DetailBox component (merge DetailDialog drag/resize logic)
   - Mode-aware initial positioning
   - Click/drag/resize → bring to front (move to end of array)
   - ESC closes first box (oldest)
   - Z-index based on array position

2. **Update App.tsx**
   - Remove openDialogs management
   - Import and use DetailBoxManager
   - Pass display mode and callbacks

3. **Delete old components**
   - Delete DetailDialog.tsx
   - Delete DetailPanelStack.tsx

4. **Update tests**
   - Test drag/resize
   - Test click-to-front
   - Test ESC behavior
   - Test mode switching with custom positions

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

## Future Work

### Merge TESTING.md Files

**Background**: TESTING.md was copied to root and diverged from docs/TESTING.md

**Files**:
- `TESTING.root-snapshot-2025-11-03.md` (4.6k) - Newer, condensed, Phase 6.4+ testing patterns
- `docs/TESTING.md` (17k) - Older, comprehensive testing documentation

**Task**: Merge the newer Phase 6.4+ content into the comprehensive docs/TESTING.md, then delete snapshot

---

### Detail Panel Enhancements

**Enum Detail Improvements**:
- Enums have either permissible values OR instructions for getting values from elsewhere
- Example:
  ```yaml
  CellularOrganismSpeciesEnum:
    description: >-
      A constrained set of enumerative values containing the NCBITaxon values for cellular organisms.
    reachable_from:
      source_ontology: obo:ncbitaxon
      source_nodes:
        - ncbitaxon:131567 ## Cellular Organisms
      include_self: false
      relationship_types:
        - rdfs:subClassOf
  ```
- Will need to load prefixes in order to link these
- Also look for other data in bdchm.yaml that isn't currently being captured

**Slots Table Optimization**:
- Verify: "DetailBox Slots table should put inherited slots at the top and referenced slots at the bottom"
- Check if this is already the case or needs implementation

**SlotCollection 2-Level Tree** (from Phase 6.4 Step 3.2):
- Deferred - current flat SlotCollection is sufficient
- Would show global slots + inline attributes from all classes
- Each class becomes a root node with its attributes as children

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
