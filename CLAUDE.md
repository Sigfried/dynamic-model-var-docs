# CLAUDE.md - Development Context & Architecture

> **📝 DOCUMENTATION MAINTENANCE**
> This file contains the complete implementation context and architecture decisions.
> **temp.md** contains only the immediate next steps.
> As each step completes, move important details from temp.md to CLAUDE.md, then update temp.md with the next step.
> Modifications happen in temp.md during implementation, then get consolidated here.

> **📖 READING THIS FILE**
> Sections are collapsible for easier navigation. Click headers to expand/collapse.

---

<h2>Core Insight: This is a Typed Graph, Not a Hierarchy</h2>
<details>
<summary>The BDCHM model has multiple relationship types forming a rich graph structure:</summary>

1. **Inheritance** (`is_a`) - class hierarchy tree
2. **Class→Enum** - which classes use which constrained value sets
3. **Class→Class associations** - domain relationships (participant, research study, specimen lineage)
4. **Containment** (`part_of`, `contained_in`, `parent_specimen`)
5. **Activities/Processes** - temporal relationships (creation, processing, storage)
6. **Measurements** - observation and quantity relationships

**Architecture implication**: We need UI patterns for exploring a typed graph, not just a tree.

</details>

---

## Architecture Philosophy: Shneiderman's Mantra

<details>
<summary>Overview First, Zoom and Filter, Details on Demand - describes desired UX flow, not implementation order</summary>

> **Note**: This describes the desired user experience flow, not implementation order.

### 1. Overview First
Show the model topology with all relationship types visible:
- Class inheritance tree (✓ implemented)
- Class→Enum usage patterns
- Class→Class associations
- Slot definitions shared across classes
- Visual density indicators (which classes have most variables/connections)

### 2. Zoom and Filter
- **Search**: Full-text across classes, variables, enums, slots
- **Filter**: Faceted filtering (class type, variable count, relationship type)
- **Zoom**: Show k-hop neighborhood around focal element
- **View toggles**: Classes only, classes+enums, classes+variables, specific relationship types

### 3. Details on Demand
- Show class definitions and descriptions
- List variables mapped to each class
- Display variable specs (data type, units, CURIE)
- Show class attributes with their ranges
- Sortable/filterable variable tables
- Display slot definitions
- Bidirectional navigation between related elements
- Show inheritance chain with attribute overrides
- Display all incoming references to a class/enum

</details>

---

## Flexible Overview Design

<details>
<summary>Panel system architecture with section toggles and link visualization</summary>

### Panel System Architecture

**Terminology clarification**: A **panel** is a vertical container that can display multiple **sections** (Class Hierarchy, Enumerations, Slots, Variables). The UI can support multiple panels side-by-side with SVG links connecting related elements between panels.

The overview should support multiple view configurations through checkboxes/toggles, allowing users to see different aspects of the model simultaneously.

#### Section Toggles (within a panel)
Control which entity types are shown as separate collapsible sections:
- [x] **Classes** - Show class hierarchy tree (✓ implemented)
- [x] **Enums** - Show enumeration value sets (✓ implemented)
- [x] **Slots** - Show shared attribute definitions (✓ implemented)
- [x] **Variables** - Show variable specifications (✓ implemented)

Each checked section appears as a collapsible section within the panel.

**Implementation**: Icon-based toggles (C/E/S/V) at top of each ElementsPanel, arranged horizontally to save vertical space.

#### Nested Display Options (Under Classes)
When Classes section is visible, control what's nested/shown within each class node:
- [ ] **All properties** - Show all attributes inline
- [ ] **Associated class properties** - Show only attributes with class ranges
- [x] **Enum properties** - Show only attributes with enum ranges (✓ implemented)
- [x] **Slots** - Show inherited slot usage (✓ implemented)
- [ ] **Variables** - Show mapped variables inline

> **Note**: Only classes support nesting currently. Enums, slots, and variables display as flat lists.

#### Future: Nested Display Options (Under Enums)
Potential nesting if we add associations beyond subclass relationships:
- [ ] **Used by classes** - Show which classes reference this enum
- [ ] **Used by slots** - Show which slots use this enum

#### Future: Nested Display Options (Under Slots)
Potential nesting if we add associations beyond subclass relationships:
- [ ] **Used by classes** - Show which classes use this slot
- [ ] **Type/Range** - Show the slot's range type inline

> **Future consideration**: These nested displays would show associations beyond the current tree hierarchy.

#### Link Visualization Between Panels
When multiple panels are shown side-by-side, visualize relationships with SVG connecting lines:
- [x] **Class → Class** - Draw lines for class→class references (✓ green links implemented)
- [x] **Class → Enum** - Draw lines from classes to enum properties (✓ purple links implemented)
- [x] **Slot → Class/Enum** - Draw lines showing slot range types (✓ implemented)
- [x] **Variable → Class** - Draw lines from variables to mapped classes (✓ implemented)

**Interaction model**:
- Links render with low opacity (0.2-0.3) by default
- On hover over a link: increase opacity to 1.0
- On hover over a linked element (class/enum/etc): highlight all connected links
- On click: navigate/focus on the linked element

### Future Performance Optimizations

When working with larger models or slower devices:
- **Virtualize long lists**: MeasurementObservation has 103 variables; consider react-window or react-virtual
- **Viewport culling for links**: Only render SVG links for visible elements
- **Animation library**: Consider react-spring for smoother transitions (current CSS transitions work fine)

</details>

---

## Implementation Status & Roadmap

<details>
<summary>Complete history of Phases 1-3e: from basic layout to adaptive detail panels with SVG links</summary>

### Completed: Phases 1-3b

✓ **Phase 1**: Basic two-panel layout with class tree and detail view
- Class hierarchy display (`is_a` inheritance tree)
- Basic selection/navigation
- Variable mapping display
- Type bug fixed: now uses `range` field correctly

✓ **Phase 2**: Easy Details + Basic Navigation
- Class attributes table with ranges displayed in detail view
- Color coding: green (primitive), purple (enum), blue (class)
- Icons: `*` (required), `[]` (multivalued)
- Hover legend for type categories
- Clickable navigation from property ranges to class/enum definitions
- Reverse indices built: enum→classes, slot→classes mappings
- Enum detail view (shows enum values and "used by" lists)
- Slot detail view (shows slot definitions and usage)
- Variable detail view (shows variable specs)

✓ **Phase 3a**: Dual Panel System with State Persistence
- Reusable ElementsPanel component with section toggles (C/E/S/V icons)
- Independent left and right panels, each supporting all 4 section types
- State persistence via query string + localStorage
- Preset configurations accessible via header links
- Section components: ClassSection, EnumSection, SlotSection, VariablesSection
- Multi-column grid within panels when multiple sections active

✓ **Phase 3b**: Multiple Detail Dialogs with Full State Persistence
- Non-modal draggable dialogs for entity details (replaces center detail panel)
- Multiple dialogs open simultaneously with cascading positions (40px offset)
- 8-way resizable (N, S, E, W, NE, NW, SE, SW handles)
- Responsive table layouts: variables split at 1700px, enums at 1000px
- Full state persistence: all dialog positions and sizes saved to URL
- URL format: `?dialogs=type:name:x,y,w,h;type:name:x,y,w,h`
- Escape key closes oldest/bottommost dialog only
- Clicking entity in dialog opens new dialog (not replace existing)

✓ **Phase 3c**: Element Architecture Refactoring (Preparation for SVG Links)
- Created Element base class with ClassElement, EnumElement, SlotElement, VariableElement subclasses
- Unified DetailTable component for responsive table rendering
- Added data-element-type and data-element-name attributes to all panel sections
- Standardized terminology: "entity" → "element" throughout codebase
- Fixed all no-explicit-any lint errors
- Abstract classes now display "abstract" label in class tree
- Data pipeline updated to extract slot_usage from LinkML schema
- TypeScript types updated with slots, slot_usage, and abstract fields
- All elements ready for getBoundingBox() positioning via unique IDs

### Current Architecture
```
src/
├── components/
│   ├── PanelLayout.tsx       # Simple 2-panel layout (left/right) with justify-between
│   ├── ElementsPanel.tsx     # Reusable panel with section icon toggles
│   ├── DetailDialog.tsx      # Draggable/resizable dialog for element details
│   ├── DetailPanel.tsx       # Content renderer for element details (used in DetailDialog)
│   ├── DetailTable.tsx       # Generic responsive table component (NEW)
│   ├── ClassSection.tsx      # Class hierarchy tree display (with data attributes)
│   ├── EnumSection.tsx       # Enumeration list display (with data attributes)
│   ├── SlotSection.tsx       # Slot definitions list display (with data attributes)
│   └── VariablesSection.tsx  # Variables list display (with data attributes)
├── models/
│   └── Element.tsx           # Element base class + ClassElement, EnumElement, SlotElement, VariableElement (NEW)
├── utils/
│   ├── dataLoader.ts         # Schema/TSV parsing, builds class tree + reverse indices + slot_usage
│   └── statePersistence.ts   # URL/localStorage state management + presets + dialog states
├── types.ts                  # TypeScript definitions (updated with slots, slot_usage, abstract)
└── App.tsx                   # Main app with state management
```

**Key Features**:
- **Flexible Layout**: Toggle any combination of sections in left/right panels
- **Multiple Dialogs**: Open unlimited detail dialogs, each draggable and resizable
- **State Persistence**: URL params (shareable links) + localStorage (user preference)
- **Presets**: Classes Only, Classes+Enums, All Sections, Variable Explorer
- **Query String Format**:
  - Panels: `?l=c,e&r=s,v` (compact codes: c=classes, e=enums, s=slots, v=variables)
  - Dialogs: `?dialogs=type:name:x,y,w,h;type:name:x,y,w,h`

### Testing

**Current test coverage:** 134 tests across 8 test files (all passing ✅)

The project uses a comprehensive testing strategy that separates testable logic into utility functions:
- **Extract & test**: Pure functions, data transformations, calculations
- **Verify visually**: React components, SVG rendering, animations, interactions
- **TDD approach**: Write tests first for non-visual features

**Quick start:**
```bash
npm test                    # Watch mode during development
npm test -- --run          # Single run for CI/verification
npm test -- filename       # Run specific test file
```

**Test coverage by area:**
- Data loading & processing (10 tests)
- Element relationships & SVG links (53 tests)
- Adaptive layout logic (23 tests)
- Duplicate detection (28 tests)
- Panel helpers & styling (16 tests)
- Component rendering (4 tests)

**See [TESTING.md](TESTING.md) for complete documentation:**
- Detailed test file descriptions with examples
- Testing philosophy and best practices
- How to write new tests
- Troubleshooting guide
- Future testing priorities

---

### ✅ Completed: Phase 3d - SVG Link Visualization

**Visual links between panels** - Show relationships with SVG connecting lines

**Status**: Fully implemented and tested ✅

#### **Implementation Summary**:
✅ **Step 1-3: Logic Tests & Implementation** (TDD approach)
- Created `src/test/linkLogic.test.ts` (26 tests)
- Created `src/test/linkHelpers.test.ts` (27 tests)
- Implemented `src/utils/linkHelpers.ts` with all tested utilities
- All Element classes have `getRelationships()` method
- Comprehensive filtering logic (by type, visibility, self-refs, cross-panel)

✅ **Step 4: LinkOverlay Component**
- Created `src/components/LinkOverlay.tsx`
- SVG layer positioned absolutely over PanelLayout
- Queries DOM for element positions via data attributes
- Renders cross-panel links only (inheritance hidden - tree shows this)
- Fixed infinite render loop (memoized panel data in App.tsx)

✅ **Step 5: Visual Polish & Bug Fixes**
- **Hover interaction**: Links change from 20% to 100% opacity + stroke width increases
- **Cross-panel filtering**: Only shows links between left and right panels
- **Inheritance disabled**: Tree structure already shows parent-child relationships
- **Improved highlighting**: Lower default opacity (0.2), thicker hover stroke (3px)
- **Compact panels**: Max-width 450px (instead of filling all space)
- **Debounced hover logging**: 300ms delay to prevent console spam

✅ **Step 6: Final Polish & UX Improvements**
- **Scrolling fixed**: Added `h-full` to panel containers and `flex` to main content panel (App.tsx:426)
- **Icon order consistency**: Both panels now show C E S V order (removed `flex-row-reverse`)
- **Link positioning corrected**: SVG coordinates adjusted relative to SVG origin (fixed 3-5 line offset)
- **Dynamic section ordering**: Most recently toggled section appears at top of panel
- **Link redrawing**: Added `useEffect` with `requestAnimationFrame` to redraw links on section changes

**Link Styling**:
- **Purple** (medium): Class → Enum property links
- **Green** (medium): Class → Class reference links
- **Blue** (thick): Inheritance (disabled by default)
- **Self-referential**: Loop style for same-class references

**Known Limitations** (for future work):
- No click-to-navigate on links yet
- No link tooltips showing relationship details
- No viewport culling (all links render, could impact performance with large models)
- No filter controls UI (inheritance/properties toggles)

---

### ✅ Completed: Phase 3e - Adaptive Detail Panel Display

**Responsive detail display**: Adapt between stacked panels and floating dialogs based on available space

**Status**: Fully implemented ✅

#### **Core Features**

**Adaptive Behavior**:
- Wide screens (≥1660px with both panels): Stacked detail panels on right
- Narrow screens (<1660px): Draggable/resizable dialogs
- Automatic smooth transition when resizing window

**Duplicate Prevention**:
- Clicking already-open element brings it to top (instead of creating duplicate)
- Works across both stacked and dialog modes

#### **Implementation Details**

**1. Space Measurement & Display Mode** (App.tsx:143-169)
- `useEffect` calculates available horizontal space based on panel widths
- Automatically switches between `'stacked'` and `'dialog'` modes at 600px threshold
- Recalculates on window resize for smooth transitions

**2. DetailPanelStack Component** (new file)
- Reusable component for displaying detail panels stacked vertically
- Fixed positioning (not draggable/resizable) with scrollable container
- Same content as dialogs but optimized for side panel layout
- Panels have min/max height (300px-500px) for better readability

**3. DetailPanel Enhancements**
- Added `hideHeader` prop to remove large entity name header
- Added `hideCloseButton` prop to hide internal close button
- Conditionally render header/button based on props
- All entity types (class/enum/slot/variable) support hiding

**4. Conditional Rendering** (App.tsx:513-557)
- PanelLayout accepts `showSpacer` prop to hide flex-1 spacer in stacked mode
- Stacked panels render in flex-1 space when mode = 'stacked'
- Dialogs only render when mode = 'dialog'
- Smooth automatic transition when resizing window

#### **UX Polish**

**Panel Headers**:
- Newest panels appear at top (reversed array in DetailPanelStack)
- Descriptive titles: "Class: Condition extends Entity", "Enum: ConditionConceptEnum", "Slot: id"
- Entity type not shown for enums (name already ends with "Enum")
- Type-based colored headers with white text:
  - Blue-700: Classes
  - Purple-700: Enums
  - Green-700: Slots
  - Orange-600: Variables
- Bold text with `text-base` size, inheritance shown in smaller `text-sm`
- Single close button in panel header (no duplicate inside)

**Compact Spacing**:
- Reduced padding from `p-6` to `p-4`
- Reduced vertical spacing from `space-y-6` to `space-y-3`
- Reduced heading margins from `mb-2` to `mb-1`
- More compact display especially helpful in stacked panel mode

**Empty State Handling**:
- Permissible values section hidden if enum has no values
- Reduces clutter for incomplete data

**Clickable App Title**:
- Click "BDCHM Interactive Documentation" to reset application
- If saved layout exists: Resets to that saved layout (including dialogs)
- If no saved layout: Resets to default (Classes Only preset)
- Always accessible way to restore known-good state

#### **Files Changed**

1. **DetailPanel.tsx**
   - Added `hideHeader` and `hideCloseButton` props
   - Conditionally render entity name header and close button
   - All entity types support hiding
   - Reduced line spacing throughout (p-4, space-y-3, mb-1)
   - Hide permissible values if empty

2. **DetailPanelStack.tsx** (new)
   - Reverse panels array so newest appears first
   - `getPanelTitle()` helper generates descriptive JSX titles
   - `getHeaderColor()` helper returns type-based colors
   - Pass `hideHeader={true}` and `hideCloseButton={true}` to DetailPanel

3. **App.tsx**
   - Space measurement logic with 600px threshold
   - Duplicate detection in `handleOpenDialog()`
   - Conditional rendering: stacked vs dialog mode
   - `handleResetApp()` restores saved layout including dialogs

4. **PanelLayout.tsx**
   - Added `showSpacer` prop to hide flex-1 spacer in stacked mode

#### **Test Expansion (2025-01-22)**

**Summary**: Extracted Phase 3e logic into testable utility functions and added comprehensive test coverage (67 new tests).

**Utility Files Created**:
1. `src/utils/layoutHelpers.ts` - Space calculation and display mode determination
   - `calculateRemainingSpace()` - Calculate horizontal space after accounting for panels
   - `determineDisplayMode()` - Determine 'stacked' vs 'dialog' mode based on space
   - `calculateDisplayMode()` - Combined calculation from window width and panel counts

2. `src/utils/duplicateDetection.ts` - Entity duplicate detection logic
   - `getEntityName()` - Extract unique identifier (name or variableLabel)
   - `getEntityType()` - Detect entity type from object structure
   - `findDuplicateIndex()` - Find duplicate in array of entities
   - `isDuplicate()` - Boolean check for duplicate existence

3. `src/utils/panelHelpers.tsx` - Panel title and header color utilities
   - `getHeaderColor()` - Type-based color selection (blue/purple/green/orange)
   - `getPanelTitle()` - Generate descriptive JSX titles with styling

**Test Files Created** (67 new tests):
- `src/test/adaptiveLayout.test.ts` (23 tests)
- `src/test/duplicateDetection.test.ts` (28 tests)
- `src/test/panelHelpers.test.tsx` (16 tests)

**Components Refactored**:
- `App.tsx` - Uses layoutHelpers and duplicateDetection utilities
- `DetailPanelStack.tsx` - Uses panelHelpers utilities

**Test Results**: All 134 tests passing (up from 67 baseline) ✅

</details>

---

## Future Features

<details>
<summary>Planned enhancements: search/filter, neighborhood zoom, metadata display, custom presets, advanced views</summary>

### Phase 4: Search and Filter
Full-text search and filtering capabilities:
- Search bar with full-text search across all entities
- Filter controls (checkboxes for class families, variable count slider)
- Highlight search results in tree/sections
- Quick navigation: search results open in new dialogs

### Phase 5: Neighborhood Zoom
Focused exploration of related elements:
- "Focus mode" that shows only k-hop neighborhood around selected element
- Relationship type filters ("show only `is_a` relationships" vs "show associations")
- Breadcrumb trail showing navigation path
- "Reset to full view" button

### Enhanced Element Metadata Display
Show additional relationship counts for classes in tree view:
- **Current**: Only variable count shown (e.g., "Condition (20)")
- **Desired**: Show counts for associated enums, slots, and classes
- **Example**: "Condition (20 vars, 5 enums, 2 classes, 1 slot)"
- **Display options**: Inline codes, colored badges, tooltips, or separate lines
- **Implementation**: Compute counts in dataLoader.ts, store in ClassNode type

### Custom Preset Management
User-managed presets replacing hard-coded ones:
- Save Preset button (replaces current "Save Layout"/"Reset Layout")
- Prompts user for preset name
- Saves current panel configuration (sections + dialogs) to localStorage
- Display saved presets in header with user-assigned names
- Add remove icon to each preset button (including defaults)
- When localStorage is empty, seed with default presets

### Advanced Overview
Multiple view modes and analytics:
- Tree view (current), Network view, Matrix view (class-enum usage)
- Mini-map showing current focus area in context of full model
- Statistics dashboard (relationship counts, distribution charts)

</details>

---

## Data Model Statistics

<details>
<summary>47 classes, 7 slots, 40 enums, 151 variables - relationship type examples</summary>

- **47 classes**, **7 slots**, **40 enums**
- **151 variables** (heavily skewed: 103 → MeasurementObservation = 68%)
- **Multiple root classes** - no single "Entity" superclass

### Relationship Type Examples

**Inheritance** (`is_a`):
- `MeasurementObservation is_a Observation`
- `Participant is_a Person`

**Class→Enum**:
- `Condition.condition_concept → ConditionConceptEnum`
- `MeasurementObservation.observation_type → MeasurementObservationTypeEnum`
- `Quantity.unit → UnitOfMeasurementEnum`

**Class→Class (associations)**:
- `Participant.member_of_research_study → ResearchStudy`
- `Condition.associated_participant → Participant`
- `File.derived_from → File` (recursive)

**Containment/Part-of**:
- `Specimen.parent_specimen → Specimen` (specimen lineage)
- `SpecimenContainer.parent_container → SpecimenContainer` (nesting)
- `QuestionnaireItem.part_of → QuestionnaireItem` (recursive structure)

**Activity/Process**:
- `Specimen.creation_activity → SpecimenCreationActivity`
- `Specimen.processing_activity → SpecimenProcessingActivity`
- `SpecimenCreationActivity.performed_by → Organization`

**Measurements**:
- `Observation.value_quantity → Quantity`
- `MeasurementObservation.range_low → Quantity`
- `Specimen.quantity_measure → SpecimenQuantityObservation`

</details>

---

## Understanding LinkML: Slots, Attributes, and Slot Usage

<details>
<summary>Critical terminology and patterns for BDCHM schema interpretation</summary>

**Critical Context**: BDCHM is modeled using LinkML, which has specific terminology and patterns. Understanding these concepts is essential for correctly interpreting and displaying the schema.

### Core Concepts

#### 1. **Slots** (Top-Level Reusable Definitions)
Slots are reusable property definitions that can be referenced by multiple classes. Think of them as "shared field templates."

- **Location in schema**: Top-level `slots:` section
- **Example in BDCHM**: The schema defines 7 top-level slots like `id`, `identifier`, `description`, etc.
- **Usage**: Classes reference these slots by name in their `slots:` list
- **Benefits**: Define once, reuse across classes; promotes consistency

```yaml
# In bdchm.yaml
slots:
  identifier:
    range: string
    description: A unique identifier for the thing
```

#### 2. **Attributes** (Inline Slot Declarations)
Attributes are class-specific slot definitions written inline within a class. They are **syntactic sugar** for defining slots that only apply to one class.

- **Location in schema**: Within a class definition under `attributes:`
- **Example in BDCHM**: `Specimen.specimen_type`, `Condition.condition_concept` (hundreds of these)
- **Semantic equivalence**: Attributes are really just inline slot definitions
- **Why use attributes**: Convenience when a slot only applies to one class

```yaml
# In bdchm.yaml
classes:
  Specimen:
    attributes:
      specimen_type:
        range: SpecimenTypeEnum
        description: The type of specimen
```

**Key Insight**: From LinkML docs: "Attributes are really just a convenient shorthand for being able to declare slots 'inline'."

#### 3. **Slot Usage** (Class-Specific Refinements)
Slot usage allows a class to customize/refine a slot it inherits or references. This is how inheritance hierarchies progressively specialize behavior.

- **Location in schema**: Within a class definition under `slot_usage:`
- **Purpose**: Add constraints, change range, make required, etc.
- **Example in BDCHM**:
  - Abstract class `QuestionnaireResponseValue` has a generic `value` slot
  - Concrete subclasses use `slot_usage` to constrain `value` to specific types:
    - `QuestionnaireResponseValueString` → `value: range: string`
    - `QuestionnaireResponseValueInteger` → `value: range: integer`
    - `QuestionnaireResponseValueBoolean` → `value: range: boolean`

```yaml
# In bdchm.yaml
classes:
  QuestionnaireResponseValue:  # Abstract
    abstract: true
    slots:
      - value

  QuestionnaireResponseValueString:  # Concrete subclass
    is_a: QuestionnaireResponseValue
    slot_usage:
      value:
        range: string  # Refine the inherited slot
```

**Key Insight**: Slot usage is essential for understanding how abstract classes become concrete.

### UI Display Implications

#### Merging Slots and Attributes
Since attributes are just inline slots, the UI should:
1. **Display them together** in a unified "Slots" table (not separate "Attributes" and "Slots" tables)
2. **Indicate source** via a column:
   - "Inline" for attributes
   - "Slot: {slotName}" for top-level slots (with clickable link)
   - "Inherited from {ParentClass}" for inherited slots
3. **Show customizations**: Indicate when a slot has `slot_usage` refinements

#### Inherited Slots
Classes inherit all slots/attributes from their parents. The UI should:
1. Show inherited slots in a **collapsible section** (to reduce clutter)
2. **Link to parent class** for each inherited slot
3. **Highlight overrides** if a child class uses `slot_usage` to refine an inherited slot

#### Example UI for `MeasurementObservation` (inherits from `Observation`)

```
Class: MeasurementObservation (inherits from Observation)
Abstract: false

[Collapsed by default]
▶ Inherited Slots (5 from Observation)
  - focus_of (range: Participant | Specimen) [Inherited from Observation]
  - method_type (range: string) [Inherited from Observation]
  ...

[Always visible]
Slots (20)
┌─────────────────────┬──────────────────┬───────────────────┬─────────────────┐
│ Slot                │ Type             │ Source            │ Description     │
├─────────────────────┼──────────────────┼───────────────────┼─────────────────┤
│ observation_type    │ MeasurementOb... │ Inline            │ The type of ... │
│ value_quantity      │ Quantity         │ Inline            │ The quantity... │
│ id                  │ string           │ Slot: id          │ A unique id ... │
└─────────────────────┴──────────────────┴───────────────────┴─────────────────┘
```

### Data Extraction (Completed)

**Current state** (as of 2025-01-22): `bdchm.metadata.json` includes complete LinkML schema data:
- ✅ `slot_usage` extracted from all classes (9 classes use slot_usage)
- ✅ `slots` array for classes that reference top-level slots
- ✅ `abstract` flag for abstract classes
- ✅ `attributes` (inline slot definitions)

**Implementation**: Modified `scripts/download_source_data.py` to extract all LinkML fields in `generate_metadata()`.

**Command to regenerate**: `python3 scripts/download_source_data.py --metadata-only`

### References

- LinkML Slots Documentation: https://linkml.io/linkml/schemas/slots.html
- LinkML FAQ: When to use attributes vs slots: https://linkml.io/linkml/faq/modeling.html#when-should-i-use-attributes-vs-slots

</details>

---

## Key Use Cases (Sorted by Implementation Priority)

<details>
<summary>Common user questions and which features support them</summary>

### Easy (✓ implemented)
1. ✓ "Which variables map to Condition class?" - works via class detail view
2. ✓ "What are the units/data types for these measurements?" - shown in detail view
3. ✓ "What's the inheritance chain for Specimen?" - visible in class tree structure

### Medium (✓ implemented)
4. ✓ "What classes use ConditionConceptEnum?" - reverse index built, shown in enum detail view
5. ✓ "Show me all attributes for MeasurementObservation" - all slots+attributes displayed in property table
6. "Find all references to Participant" - requires search (Phase 4)

### Hard (requires graph exploration - future)
7. "Show me everything related to observations" - k-hop neighborhood (Phase 4)
8. "What's the full specimen workflow?" - follow activity relationships (requires relationship visualization)
9. "Compare two classes" - side-by-side detail views (requires multi-panel support)

</details>

---

## Technical Notes

<details>
<summary>Data loading, architecture, graph visualization considerations</summary>

### Data Loading
- Schema source: `bdchm.yaml` → `bdchm.metadata.json` (generated by Python/LinkML tools)
- Variables: `variable-specs-S1.tsv` (downloaded from Google Sheets)
- Update command: `npm run download-data`

### Architecture
See "Implementation Status & Roadmap" section above for current architecture details.

### MeasurementObservation Challenge
103 variables map to a single class (68% of all variables). Requires:
- Pagination or virtualization
- Grouping/filtering within class
- Consider sub-categorization by measurement type

### Why Not Force-Directed Graphs
- **Class inheritance** is a tree → use tree layout
- **Variables→Classes** is bipartite → use bipartite layout (or just tables)
- **Full relationship graph** would be chaotic → filter by relationship type first

Force-directed layouts are useful for:
- Exploring k-hop neighborhoods (after filtering)
- Visualizing class associations (not inheritance)
- Showing clusters of related enums/classes

But default view should be structured (tree/table), not force-directed chaos.

</details>

---

## Development Priorities

<details>
<summary>Working > Perfect, Usability > "Cool", Incremental complexity, User testing</summary>

1. **Working > Perfect** - time-constrained project
2. **Usability > "Cool"** - practical exploration tools, not flashy viz
3. **Incremental complexity** - start with easy features, add advanced later
4. **User testing** - validate navigation patterns with domain experts

### Tech Stack Decisions
- **React + TypeScript**: Type safety, component reuse
- **Vite**: Fast dev server, HMR
- **Tailwind CSS**: Rapid styling
- **D3.js (minimal)**: Only for specific graph algorithms or layouts that React can't handle

### Code Style (from global CLAUDE.md)
- ES modules (import/export), not CommonJS
- Destructure imports where possible
- Run type checker after changes: `npm run build`

</details>

---

## Implementation Notes & Lessons Learned

<details>
<summary>LinkML gotchas, categorization approaches, semantic patterns for future use</summary>

### LinkML Metadata Structure Gotchas

**Bug fix reference**: DetailView.tsx originally looked for `propDef.type` (JSON Schema convention) but LinkML metadata uses `propDef.range` for type information.

**Attribute structure in `bdchm.metadata.json`**:
```json
{
  "classes": {
    "Specimen": {
      "attributes": {
        "specimen_type": {
          "range": "SpecimenTypeEnum",
          "description": "...",
          "multivalued": false,
          "required": false
        }
      }
    }
  }
}
```

Key fields:
- `range`: The type (primitive, enum name, or class name)
- `multivalued`: Boolean indicating array vs single value
- `required`: Boolean for required attributes
- `description`: Free text

### Structural vs Semantic Categorization

**Current approach** (structural - safe from schema changes):
- Categorize by `range` value:
  - **Primitive**: Known set (`string`, `integer`, `float`, etc.)
  - **Enum**: Range ends with `Enum`
  - **Class**: Everything else
- Filter/toggle by entity type: class, enum, slot, variable

**DO NOT hard-code semantic categories** like "containment" vs "association" vs "activity" - these could break with schema updates.

### REMINDER: Semantic Insights for Future Use

The following **semantic relationship patterns** were identified during analysis and could be valuable for:
- User-facing documentation/tooltips
- Search result grouping
- Suggested exploration paths
- AI-assisted query answering

**Semantic patterns identified**:

1. **Containment/Part-of**: `parent_specimen`, `parent_container`, `part_of`
2. **Association**: `associated_participant`, `source_participant`, `performed_by`
3. **Activity/Process**: `creation_activity`, `processing_activity`, `storage_activity`
4. **Measurement**: `value_quantity`, `range_low`, `range_high`, `quantity_measure`
5. **Provenance**: `*_provenance`, `derived_from`
6. **Organization/Study**: `member_of_research_study`, `originating_site`

**Potential future features using semantic patterns**:
- "Show specimen workflow" - follow activity relationships
- "Show participant data" - trace associated_participant links
- "Explain this class" - generate natural language description using relationship semantics
- Smart search: "find containment relationships" could match `parent_*` and `part_of` patterns

**Implementation approach when ready**:
- Extract patterns from attribute names (regex/keyword matching)
- Make patterns configurable (JSON/YAML file of patterns)
- Use for suggestions/enhancements, not core functionality
- Keep structural navigation as primary interface

</details>

