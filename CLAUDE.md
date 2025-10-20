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

## Better Implementation Plan

### Current Status
✓ **Phase 1 DONE**: Basic two-panel layout with class tree and detail view
- Only shows `is_a` hierarchy
- Shows variables mapped to classes
- Basic selection/navigation

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
