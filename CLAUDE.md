# CLAUDE.md - Development Context & Architecture

> **📝 DOCUMENTATION MAINTENANCE**
> This file contains the complete implementation context and architecture decisions.
> **temp.md** contains only the immediate next steps.
> As each step completes, move important details from temp.md to CLAUDE.md, then update temp.md with the next step.
> Modifications happen in temp.md during implementation, then get consolidated here.

---

## Core Insight: This is a Typed Graph, Not a Hierarchy

The BDCHM model has multiple relationship types forming a rich graph structure:
1. **Inheritance** (`is_a`) - class hierarchy tree
2. **Class→Enum** - which classes use which constrained value sets
3. **Class→Class associations** - domain relationships (participant, research study, specimen lineage)
4. **Containment** (`part_of`, `contained_in`, `parent_specimen`)
5. **Activities/Processes** - temporal relationships (creation, processing, storage)
6. **Measurements** - observation and quantity relationships

**Architecture implication**: We need UI patterns for exploring a typed graph, not just a tree.

---

## Architecture Philosophy: Shneiderman's Mantra (But Not in Implementation Order!)

### 1. Overview First (HARDEST - implement LAST)
Show the model topology with all relationship types visible:
- Class inheritance tree (✓ currently implemented)
- Class→Enum usage patterns (TODO - complex)
- Class→Class associations (TODO - requires graph visualization)
- Slot definitions shared across classes (TODO)
- Visual density indicators (which classes have most variables/connections)

**Why this is hard**:
- Multiple overlapping graph structures
- Need to support different "views" of the same data
- Risk of visual clutter without careful design

### 2. Zoom and Filter (EASIER - implement EARLY)
- **Search**: Full-text across classes, variables, enums, slots
- **Filter**: Faceted filtering (class type, variable count, relationship type)
- **Zoom**: Show k-hop neighborhood around focal element
  - "Show all classes within 2 hops of Specimen"
  - "Show enum→class relationships for MeasurementObservationTypeEnum"
- **View toggles**: Classes only, classes+enums, classes+variables, specific relationship types

**Why this is easier**:
- Standard UI patterns (search bars, checkboxes, sliders)
- Data structures already support filtering
- No complex layout algorithms needed

### 3. Details on Demand (MIXED complexity)
**Easy details** (implement early):
- Show class definition and description
- List variables mapped to class
- Display variable specs (data type, units, CURIE)

**Medium details**:
- Show class attributes with their ranges
- Sortable/filterable variable tables
- Display slot definitions

**Hard details**:
- Bidirectional navigation between related elements
- Show inheritance chain with attribute overrides
- Display all incoming references to a class/enum

---

## Flexible Overview Design

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
- [x] **Slots** - Show inherited slot usage
- [ ] **Variables** - Show mapped variables inline (might be overwhelming for MeasurementObservation)

#### Nested Display Options (Under Enums)
When Enums section is visible:
- [ ] **Used by classes** - Show which classes reference this enum
- [ ] **Used by slots** - Show which slots use this enum

#### Nested Display Options (Under Slots)
When Slots section is visible:
- [ ] **Used by classes** - Show which classes use this slot
- [ ] **Type/Range** - Show the slot's range type

#### Link Visualization Between Panels
When multiple panels are shown side-by-side, visualize relationships with SVG connecting lines:
- [ ] **Associated classes** - Draw lines for class→class references
- [ ] **Enums** - Draw lines from classes to enum sections
- [ ] **Slots** - Draw lines showing slot usage
- [ ] **Variables** - Draw lines from classes to variable sections

**Interaction model**:
- Links render with low opacity (0.2-0.3) by default
- On hover over a link: increase opacity to 1.0
- On hover over a linked element (class/enum/etc): highlight all connected links
- On click: navigate/focus on the linked element

#### Why This Design Works

1. **Structural, not semantic** - Toggles based on entity types (class/enum/slot) are structural
2. **Progressive disclosure** - Start with minimal view, expand as needed
3. **Avoids hard-coded categories** - Users filter by range type, not semantic groupings
4. **Scalable** - Handles large models by letting users hide irrelevant sections
5. **Supports exploration** - Visual links help discover relationships

### Implementation Considerations

**Data structures needed**:
- Reverse indices: enum→classes, slot→classes, class→classes (associations)
- Bounding boxes for each rendered element (for link positioning when using multiple panels)
- Hover state tracking

**Rendering approach**:
- **Content**: Regular HTML/React components using CSS Grid or Flexbox
- **Links**: SVG overlay positioned absolutely over the panels
- **Bounding boxes**: Track DOM element positions for SVG link endpoints
- React state for section toggles
- Consider using `react-spring` or similar for smooth opacity transitions

**Performance**:
- Virtualize long lists (especially for MeasurementObservation's 103 variables)
- Debounce hover events
- Render links only for visible elements (viewport culling)

---

## Implementation Status & Roadmap

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

### Testing Strategy & Test Suite Documentation

**Current test coverage** (67 tests, all passing ✅):

#### **Test Files:**
1. **`data-integrity.test.ts`** (1 test) - Data completeness reporting
   - Tracks data pipeline: YAML → Metadata → ModelData
   - Reports missing fields (prefixes, imports) without failing
   - Verifies all classes, enums, slots loaded correctly

2. **`dataLoader.test.ts`** (9 tests) - Core data loading logic
   - Model data loading and structure validation
   - Hierarchical class tree construction
   - Reverse index building (enum→classes, slot→classes)
   - Variable mapping validation
   - Slot and enum definition parsing
   - Abstract class detection
   - Data consistency checks (no duplicates, valid properties)

3. **`ClassSection.test.tsx`** (4 tests) - Component rendering
   - Class hierarchy rendering with nested structure
   - Selected class highlighting
   - Data attributes for element identification (for SVG links)
   - Empty state handling

4. **`linkLogic.test.ts`** (26 tests) - Element relationship detection
   - **ClassElement relationships**: inheritance, enum properties, class references, self-refs
   - **SlotElement relationships**: range detection for enums and classes
   - **VariableElement relationships**: class mapping
   - **EnumElement relationships**: no outgoing relationships
   - **Link filtering**: by type, target type, visibility, self-refs
   - **Combined filtering**: multiple criteria simultaneously

5. **`linkHelpers.test.ts`** (27 tests) - SVG link utilities
   - **Relationship filtering**: showInheritance, showProperties, onlyEnums, onlyClasses, visibility
   - **Link building**: converting relationships to renderable objects
   - **Geometric calculations**: center points, anchor point selection, edge detection
   - **SVG path generation**: bezier curves, self-referential loops
   - **Visual styling**: color mapping, stroke width by relationship type

#### **Test Philosophy**

**IMPORTANT: Expand test suite as features are developed**
- ✅ Test data/logic layers separately from visual/rendering layers
- ✅ Use TDD for non-visual features (data transformations, filtering, state management)
- ✅ Use hybrid approach for visual features (test logic first, verify rendering manually)
- ✅ Aim for tests that prevent regressions, not just achieve coverage

**What we test vs. what we verify visually:**
- ✅ **Test**: Pure functions, data transformations, filtering logic, geometric calculations
- 👁️ **Visual verification**: SVG rendering, colors, animations, layout aesthetics, user interactions

#### **Running Tests**

```bash
# Watch mode during development
npm test

# Single run for CI/verification
npm test -- --run

# Run specific test file
npm test -- linkHelpers --run

# Coverage report
npm test:coverage
```

#### **Test Expansion Priorities**

**Completed:**
- ✅ Phase 3d logic tests (relationship detection, link filtering, SVG path generation)

**Next:**
1. **Soon**: DetailDialog interaction tests (drag, resize, escape key)
2. **Future**: State persistence round-trip tests, search/filter tests
3. **Future**: Integration tests for full navigation flows

**Future testing enhancements** (when needed):
1. **Integration tests**: Full navigation flows (click class → dialog opens, links connect properly)
2. **E2E tests**: Using Playwright or Cypress for full user workflows
3. **Visual regression**: Screenshot comparisons to catch unintended UI changes
4. **Performance tests**: Large model handling, rendering speed with many links/dialogs

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

### Next: Phase 3e - Adaptive Detail Panel Display

**Responsive detail display**: Adapt between stacked panels and floating dialogs based on available space

**Problem**: With narrow panels (max-width 450px), there's potentially significant empty space on the right side of the screen that could be better utilized for displaying element details.

**Solution**: Adaptive layout based on available horizontal space
- **When space available (≥600px empty)**: Display detail panels stacked vertically in the right space
  - New panels added at the top, pushing older ones down
  - Fixed position in the layout (not draggable)
  - Scrollable if total height exceeds viewport
- **When space limited (<600px)**: Use current DetailDialog system
  - Draggable, resizable floating dialogs
  - User has full control over positioning

**Duplicate Prevention**:
Current behavior allows opening the same element multiple times, creating duplicate dialogs. Fix with one of two approaches:
1. **Bring to top**: If element already shown, bring that panel/dialog to the top instead of creating duplicate
2. **Replace old**: Create new panel/dialog as normal, but close the older duplicate

**Implementation Considerations**:
- Measure available space on mount and window resize
- Maintain single source of truth for open details (reuse existing dialog state)
- Transition smoothly between modes when window resizes across threshold
- Consider state persistence: should stacked panels save position like dialogs?

### Future: Enhanced Element Metadata Display

**Feature Request**: Show additional relationship counts for classes in tree view
- **Current**: Only variable count shown (e.g., "Condition (20)")
- **Desired**: Show counts for associated enums, slots, and classes
- **Example**: "Condition (20 vars, 5 enums, 2 classes, 1 slot)"

**Design Considerations**:
- **Number placement**: Currently there's too much space between element name and count (panels stretch to fill width)
  - **Solution implemented**: Panels now have max-width: 450px, creating more readable layout
  - Numbers appear closer to element names
  - Links can go from right edge of left panel to left edge of right panel
- **Multiple counts display options**:
  - Inline: `Condition (20v, 5e, 2c, 1s)` - compact but cryptic
  - Badges: Colored badges for each count type
  - Tooltip: Show detailed counts on hover
  - Separate line: Show counts below element name (might be too tall)

**Implementation Notes**:
- Need to compute relationship counts in dataLoader.ts
- Store in ClassNode type: `enumCount`, `slotCount`, `classRefCount`
- Update ClassSection component to display multiple counts
- Consider progressive disclosure: show variable count by default, others on hover/expand

### Future: Custom Preset Management

**User-managed presets**: Replace hard-coded presets with user-customizable ones
- **Save Preset** button (replaces current "Save Layout"/"Reset Layout"):
  - Prompts user for preset name
  - Saves current panel configuration (sections + dialogs) to localStorage
  - Format similar to shareable URL but with user-friendly names
- **Preset Management**:
  - Display saved presets in header with user-assigned names
  - Add small X or remove icon to each preset button (including defaults)
  - When localStorage is empty, seed with default presets (Classes Only, Classes + Enums, All, Variables)
  - User can delete default presets if desired
- **Benefits**:
  - Users can save their frequently-used configurations
  - Presets become personalized to user's workflow
  - No need for separate "Save Layout" vs "Reset Layout" buttons

### Future: Phase 4 - Search and Filter
1. Search bar with full-text search across all entities
2. Filter controls (checkboxes for class families, variable count slider)
3. Highlight search results in tree/sections
4. Quick navigation: search results open in new dialogs

### Future: Phase 5 - Neighborhood Zoom
1. "Focus mode" that shows only k-hop neighborhood around selected element
2. Relationship type filters ("show only `is_a` relationships" vs "show associations")
3. Breadcrumb trail showing navigation path
4. "Reset to full view" button

### Future: Phase 6 - Advanced Overview (if time allows)
1. Multiple view modes:
   - Tree view (current)
   - Network view (classes + associations, filterable by relationship type)
   - Matrix view (class-enum usage)
2. Mini-map showing current focus area in context of full model
3. Statistics dashboard (relationship counts, distribution charts)

---

## Data Model Statistics

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

---

## Understanding LinkML: Slots, Attributes, and Slot Usage

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

---

## Key Use Cases (Sorted by Implementation Priority)

### Easy (✓ implemented)
1. ✓ "Which variables map to Condition class?" - works via class detail view
2. ✓ "What are the units/data types for these measurements?" - shown in detail view
3. ✓ "What's the inheritance chain for Specimen?" - visible in class tree structure

### Medium (✓ implemented)
4. ✓ "What classes use ConditionConceptEnum?" - reverse index built, shown in enum detail view
5. ✓ "Show me all attributes for MeasurementObservation" - all slots+attributes displayed in property table
6. "Find all references to Participant" - requires search (Phase 3b)

### Hard (requires graph exploration - future)
7. "Show me everything related to observations" - k-hop neighborhood (Phase 4)
8. "What's the full specimen workflow?" - follow activity relationships (requires relationship visualization)
9. "Compare two classes" - side-by-side detail views (requires multi-panel support)

---

## Technical Notes

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

---

## Development Priorities

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

---

## Implementation Notes & Lessons Learned

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

