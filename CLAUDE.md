# CLAUDE.md - Development Context & Architecture

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

### Completed: Phases 1-3a

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
- DetailPanel hidden when nothing selected (animated transitions)
- 3-column layout: [Left Elements | Details | Right Elements]
- Draggable panel dividers for width customization (default 30%|40%|30%)
- State persistence via query string + localStorage
- Preset configurations accessible via header links
- Section components: ClassSection, EnumSection, SlotSection, VariablesSection
- Multi-column grid within panels when multiple sections active

### Current Architecture
```
src/
├── components/
│   ├── PanelLayout.tsx       # 3-column layout manager with draggable dividers
│   ├── ElementsPanel.tsx     # Reusable panel with section icon toggles
│   ├── DetailPanel.tsx       # Shows entity details (hidden when nothing selected)
│   ├── ClassSection.tsx      # Class hierarchy tree display
│   ├── EnumSection.tsx       # Enumeration list display
│   ├── SlotSection.tsx       # Slot definitions list display
│   └── VariablesSection.tsx  # Variables list display (all 151 variables)
├── utils/
│   ├── dataLoader.ts         # Schema/TSV parsing, builds class tree + reverse indices
│   └── statePersistence.ts   # URL/localStorage state management + presets
├── types.ts                  # TypeScript definitions
└── App.tsx                   # Main app with state management
```

**Key Features**:
- **Flexible Layout**: Toggle any combination of sections in left/right panels
- **State Persistence**: URL params (shareable links) + localStorage (user preference)
- **Presets**: Classes Only, Classes+Enums, All Sections, Variable Explorer
- **Animated Transitions**: Smooth panel show/hide (300ms duration)
- **Draggable Dividers**: User-customizable panel widths (15% minimum per panel)
- **Query String Format**: `?l=c,e&r=s,v&w=25,50,25` (compact codes: c=classes, e=enums, s=slots, v=variables)

### Next: Phase 3b - SVG Link Visualization (Future)

**Not yet implemented**: Visual links between panels
- Add SVG overlay for drawing relationship lines between elements
- Implement bounding box tracking for link positioning
- Add hover/click interactions for links
- Filter links by relationship type (inheritance, enum usage, associations)

### Upcoming: Phase 3b - Search and Filter
1. Search bar with full-text search across all entities
2. Filter controls (checkboxes for class families, variable count slider)
3. Highlight search results in tree/sections
4. Section toggles (show/hide Classes, Enums, Slots, Variables)

### Future: Phase 4 - Neighborhood Zoom
1. "Focus mode" that shows only k-hop neighborhood around selected element
2. Relationship type filters ("show only `is_a` relationships" vs "show associations")
3. Breadcrumb trail showing navigation path
4. "Reset to full view" button

### Future: Phase 5 - Advanced Overview (if time allows)
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

