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

The overview should support multiple view configurations through checkboxes/toggles, allowing users to see different aspects of the model simultaneously.

#### Panel Section Toggles
Control which entity types are shown as separate collapsible sections:
- [ ] **Classes** - Show class hierarchy tree
- [ ] **Enums** - Show enumeration value sets
- [ ] **Slots** - Show shared attribute definitions
- [ ] **Variables** - Show variable specifications

Each checked section gets its own collapsible panel in the left sidebar.

#### Nested Display Options (Under Classes)
When Classes panel is visible, control what's nested/shown within each class node:
- [ ] **All properties** - Show all attributes inline
- [ ] **Associated class properties** - Show only attributes with class ranges
- [x] **Enum properties** - Show only attributes with enum ranges (useful!)
- [x] **Slots** - Show inherited slot usage
- [ ] **Variables** - Show mapped variables inline (might be overwhelming for MeasurementObservation)

#### Nested Display Options (Under Enums)
When Enums panel is visible:
- [ ] **Used by classes** - Show which classes reference this enum
- [ ] **Used by slots** - Show which slots use this enum

#### Nested Display Options (Under Slots)
When Slots panel is visible:
- [ ] **Used by classes** - Show which classes use this slot
- [ ] **Type/Range** - Show the slot's range type

#### Link Visualization Between Panels
When multiple panels are shown, visualize relationships with SVG connecting lines:
- [ ] **Associated classes** - Draw lines for class→class references
- [ ] **Enums** - Draw lines from classes to enum panels
- [ ] **Slots** - Draw lines showing slot usage
- [ ] **Variables** - Draw lines from classes to variable panels

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
- Bounding boxes for each rendered element (for link positioning)
- Hover state tracking

**Rendering approach**:
- CSS Grid or Flexbox for panel layout
- SVG overlay for inter-panel links
- React state for toggle checkboxes
- Consider using `react-spring` or similar for smooth opacity transitions

**Performance**:
- Virtualize long lists (especially for MeasurementObservation's 103 variables)
- Debounce hover events
- Render links only for visible elements (viewport culling)

---

## Better Implementation Plan

### Current Status
✓ **Phase 1 DONE**: Basic two-panel layout with class tree and detail view
- Only shows `is_a` hierarchy
- Shows variables mapped to classes
- Basic selection/navigation
- ✓ Type bug fixed: now uses `range` field
- ✓ Icons for multivalued ([]) and required (*)
- ✓ Color coding for primitive/enum/class with hover legend

### Recommended Next Steps

**Phase 2: Easy Details + Basic Navigation**
1. Show class attributes with ranges in detail view
2. Make ranges clickable (click enum name → navigate to enum definition)
3. Show "used by" lists for enums (which classes reference this enum)
4. Display slot definitions
5. Add variable detail view (click variable → show full specs)

**Phase 3: Search and Filter**
1. Search bar with full-text search across all entities
2. Filter controls (checkboxes for class families, variable count slider)
3. Highlight search results in tree
4. View toggles (show/hide enums, variables, certain class families)

**Phase 4: Neighborhood Zoom**
1. "Focus mode" that shows only k-hop neighborhood around selected element
2. Relationship type filters ("show only `is_a` relationships" vs "show associations")
3. Breadcrumb trail showing navigation path
4. "Reset to full view" button

**Phase 5: Advanced Overview (if time allows)**
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

### Easy (implement first)
1. "Which variables map to Condition class?" - already works
2. "What are the units/data types for these measurements?" - show in detail view
3. "What's the inheritance chain for Specimen?" - trace `is_a` upward

### Medium
4. "What classes use ConditionConceptEnum?" - build reverse index enum→classes
5. "Show me all attributes for MeasurementObservation" - display all slots+attributes
6. "Find all references to Participant" - search + show usages

### Hard (requires graph exploration)
7. "Show me everything related to observations" - k-hop neighborhood
8. "What's the full specimen workflow?" - follow activity relationships
9. "Compare two classes" - side-by-side detail views

---

## Technical Notes

### Data Loading
- Schema source: `bdchm.yaml` → `bdchm.metadata.json` (generated by Python/LinkML tools)
- Variables: `variable-specs-S1.tsv` (downloaded from Google Sheets)
- Update command: `npm run download-data`

### Current Architecture
```
src/
├── components/
│   ├── ClassTree.tsx      # Left panel: collapsible class tree (is_a only)
│   └── DetailView.tsx     # Right panel: class details + variables
├── utils/
│   └── dataLoader.ts      # Schema/TSV parsing, builds class tree
├── types.ts               # TypeScript definitions
└── App.tsx                # Main layout
```

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

---

## Current Implementation Status (Updated 2025-10-20)

### What's Working
- ✓ Two-panel layout (class tree + detail view)
- ✓ Class hierarchy display (`is_a` inheritance)
- ✓ Variable mapping display
- ✓ Property table with correct `range` types
- ✓ Color coding: green (primitive), purple (enum), blue (class)
- ✓ Icons: `*` (required), `[]` (multivalued)
- ✓ Hover legend for type categories

### What's NOT Working Yet
- No enum panel/display (only shown as references in class properties)
- No slot panel/display
- No clickable navigation between related elements
- No reverse indices (enum→classes, slot→classes)
- No inter-panel link visualization
- No search/filter
- No view toggles/checkboxes

### Next Immediate Steps (in priority order)

1. **Build reverse indices** - Create data structures mapping:
   - Enum → which classes use it
   - Slot → which classes use it
   - Class → which classes reference it (for associations)

2. **Make ranges clickable** - Click on enum/class name in property table → navigate to that entity

3. **Add enum panel** - Show enums in left sidebar with:
   - Enum name + description
   - List of valid values
   - "Used by" list (via reverse index)

4. **Add slot panel** - Show shared slots with:
   - Slot name + description
   - Range type
   - "Used by" list

5. **Then**: Implement flexible panel toggles as documented above
