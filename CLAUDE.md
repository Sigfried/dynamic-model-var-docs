# CLAUDE.md - Development Context & Architecture

> **📝 Purpose**: This file provides architecture philosophy, design patterns, and context to help AI assistants understand the codebase and make informed decisions.
>
> **See also**:
> - **PROGRESS.md** - Completed work (for reporting)
> - **temp.md** - Immediate next steps
> - **TESTING.md** - Testing philosophy and practices
> - **README.md** - User-facing documentation

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

## Architecture Philosophy: Shneiderman's Mantra

**"Overview First, Zoom and Filter, Details on Demand"** - describes desired UX flow, not implementation order

### 1. Overview First
Show the model topology with all relationship types visible:
- Class inheritance tree ✓
- Class→Enum usage patterns ✓
- Class→Class associations ✓
- Slot definitions shared across classes ✓
- Visual density indicators (which classes have most variables/connections) - future

### 2. Zoom and Filter
- **Search**: Full-text across classes, variables, enums, slots - future
- **Filter**: Faceted filtering (class type, variable count, relationship type) - future
- **Zoom**: Show k-hop neighborhood around focal element - future
- **View toggles**: Classes only, classes+enums, etc. ✓

### 3. Details on Demand
- Show class definitions and descriptions ✓
- List variables mapped to each class ✓
- Display variable specs (data type, units, CURIE) ✓
- Show class attributes with their ranges ✓
- Sortable/filterable variable tables - future
- Display slot definitions ✓
- Bidirectional navigation between related elements ✓
- Show inheritance chain with attribute overrides ✓
- Display all incoming references to a class/enum ✓

---

## Current Architecture

**Panel System**:
- Dual independent panels (left/right)
- Each panel can show any combination of: Classes, Enums, Slots, Variables
- SVG link overlay visualizes relationships with gradients
- State persists to URL + localStorage

**Detail Display**:
- Wide screens: Stacked panels on right side
- Narrow screens: Draggable/resizable dialogs
- Multiple simultaneous detail views
- Duplicate prevention

**Data Flow**:
```
bdchm.yaml (LinkML schema)
    ↓ Python script
bdchm.metadata.json
    ↓ dataLoader.ts
ClassTree + Reverse Indices + Slot Usage
    ↓
Element classes (ClassElement, EnumElement, etc.)
    ↓
UI Components + SVG Links
```

---

## Understanding LinkML: Slots, Attributes, and Slot Usage

**Critical Context**: BDCHM is modeled using LinkML, which has specific terminology and patterns.

### Core Concepts

#### 1. Slots (Top-Level Reusable Definitions)
Slots are reusable property definitions that can be referenced by multiple classes.
- **Location in schema**: Top-level `slots:` section
- **Example**: The schema defines 7 top-level slots like `id`, `identifier`, `description`
- **Usage**: Classes reference these slots by name in their `slots:` list

#### 2. Attributes (Inline Slot Declarations)
Attributes are class-specific slot definitions written inline within a class.
- **Location in schema**: Within a class definition under `attributes:`
- **Semantic equivalence**: Attributes are syntactic sugar for inline slot definitions
- **Why use attributes**: Convenience when a slot only applies to one class

**Key Insight**: From LinkML docs: "Attributes are really just a convenient shorthand for being able to declare slots 'inline'."

#### 3. Slot Usage (Class-Specific Refinements)
Slot usage allows a class to customize/refine a slot it inherits or references.
- **Location in schema**: Within a class definition under `slot_usage:`
- **Purpose**: Add constraints, change range, make required, etc.
- **Example**: Abstract class `QuestionnaireResponseValue` has generic `value` slot, concrete subclasses use `slot_usage` to constrain it to specific types

### UI Display Implications

Since attributes are just inline slots, the UI should:
1. **Display them together** in a unified table (not separate "Attributes" and "Slots" tables)
2. **Indicate source** via a column:
   - "Inline" for attributes
   - "Slot: {slotName}" for top-level slots (with clickable link)
   - "Inherited from {ParentClass}" for inherited slots
3. **Show customizations**: Indicate when a slot has `slot_usage` refinements

**References**:
- LinkML Slots Documentation: https://linkml.io/linkml/schemas/slots.html
- LinkML FAQ: https://linkml.io/linkml/faq/modeling.html#when-should-i-use-attributes-vs-slots

---

## Data Model Statistics

- **47 classes** with inheritance hierarchy
- **40 enums** (constrained value sets)
- **7 slots** (reusable attribute definitions)
- **151 variables** (68% map to MeasurementObservation class)
- Multiple root classes (no single "Entity" superclass)

### Relationship Type Examples

**Inheritance** (`is_a`):
- `MeasurementObservation is_a Observation`
- `Participant is_a Person`

**Class→Enum**:
- `Condition.condition_concept → ConditionConceptEnum`
- `MeasurementObservation.observation_type → MeasurementObservationTypeEnum`

**Class→Class (associations)**:
- `Participant.member_of_research_study → ResearchStudy`
- `Condition.associated_participant → Participant`
- `File.derived_from → File` (recursive)

**Containment/Part-of**:
- `Specimen.parent_specimen → Specimen` (specimen lineage)
- `SpecimenContainer.parent_container → SpecimenContainer` (nesting)

---

## Key Use Cases (Sorted by Implementation Priority)

### Easy (✓ implemented)
1. ✓ "Which variables map to Condition class?"
2. ✓ "What are the units/data types for these measurements?"
3. ✓ "What's the inheritance chain for Specimen?"
4. ✓ "What classes use ConditionConceptEnum?"
5. ✓ "Show me all attributes for MeasurementObservation"

### Medium (requires search - Phase 4)
6. "Find all references to Participant"

### Hard (requires graph exploration - future)
7. "Show me everything related to observations" - k-hop neighborhood
8. "What's the full specimen workflow?" - follow activity relationships
9. "Compare two classes" - side-by-side detail views

---

## Future Features

### Architecture: Generalize Hierarchical Structure

**Current limitation**: `ClassNode` has `children: ClassNode[]` - hierarchy is type-specific.

**Problem**:
- Only classes can be hierarchical
- Can't reorganize views (e.g., show enums with classes nested under them)
- Variables are grouped by class but not using a general hierarchy abstraction
- Difficult to support alternate view modes

**Proposed solution**: Generic tree/hierarchy types
```typescript
// Generic tree node
interface TreeNode<T> {
  data: T;
  children: TreeNode<T>[];
  parent?: TreeNode<T>;
}

// Heterogeneous trees (ClassElement with EnumElement children)
interface HierarchyNode {
  element: Element;
  children: HierarchyNode[];
}

// Tree utilities
class Hierarchy<T> {
  roots: TreeNode<T>[];
  flatten(): T[]
  findByName(name: string): TreeNode<T> | null
}
```

**Benefits**:
- Any element type can be hierarchical
- Flexible view reorganization (classes under enums, enums under classes, etc.)
- Reusable tree operations (flatten, search, traverse)
- Could support DAGs later if needed (e.g., multiple inheritance)

**Implications**:
- Would replace `ClassNode.children` with more general structure
- Collections could support multiple hierarchy views
- Panel sections could render any hierarchy type
- Tests would need updating (currently assume ClassNode hierarchy)

### Phase 4: Search and Filter
- Search bar with full-text search across all elements
- Filter controls (checkboxes for class families, variable count slider)
- Highlight search results in tree/sections
- Quick navigation: search results open in new dialogs

### Phase 5: Neighborhood Zoom
- "Focus mode" showing only k-hop neighborhood around selected element
- Relationship type filters ("show only `is_a` relationships" vs "show associations")
- Breadcrumb trail showing navigation path
- "Reset to full view" button

### Enhanced Element Metadata Display
Show additional relationship counts for classes in tree view:
- **Current**: Only variable count shown (e.g., "Condition (20)")
- **Desired**: Show counts for associated enums, slots, and classes
- **Example**: "Condition (20 vars, 5 enums, 2 classes, 1 slot)"

### Custom Preset Management
User-managed presets replacing hard-coded ones:
- Save Preset button
- Prompts user for preset name
- Saves current panel configuration (sections + dialogs) to localStorage
- Display saved presets in header
- Remove icon for each preset

### Advanced Overview
Multiple view modes and analytics:
- Tree view (current), Network view, Matrix view (class-enum usage)
- Mini-map showing current focus area in context of full model
- Statistics dashboard (relationship counts, distribution charts)

---

## Technical Notes

### Data Loading
- Schema source: `bdchm.yaml` → `bdchm.metadata.json` (generated by Python/LinkML tools)
- Variables: `variable-specs-S1.tsv` (downloaded from Google Sheets)
- Update command: `npm run download-data`

### MeasurementObservation Challenge
103 variables map to a single class (68% of all variables). Requires:
- Pagination or virtualization (future)
- Grouping/filtering within class (✓ implemented - collapsible by class)
- Consider sub-categorization by measurement type

### Why Not Force-Directed Graphs?
- **Class inheritance** is a tree → use tree layout ✓
- **Variables→Classes** is bipartite → use bipartite layout or tables ✓
- **Full relationship graph** would be chaotic → filter by relationship type first

Force-directed layouts are useful for:
- Exploring k-hop neighborhoods (after filtering)
- Visualizing class associations (not inheritance)
- Showing clusters of related enums/classes

But default view should be structured (tree/table), not force-directed chaos.

### Performance Optimizations (Future)
When working with larger models or slower devices:
- **Virtualize long lists**: MeasurementObservation has 103 variables; consider react-window or react-virtual
- **Viewport culling for links**: Only render SVG links for visible elements
- **Animation library**: Consider react-spring for smoother transitions (current CSS transitions work fine)

---

## Development Priorities

1. **Working > Perfect** - time-constrained project
2. **Usability > "Cool"** - practical exploration tools, not flashy viz
3. **Incremental complexity** - start with easy features, add advanced later
4. **User testing** - validate navigation patterns with domain experts

### Tech Stack
- **React + TypeScript**: Type safety, component reuse
- **Vite**: Fast dev server, HMR
- **Tailwind CSS**: Rapid styling
- **D3.js (minimal)**: Only for specific graph algorithms or layouts that React can't handle

---

## Architectural Decision Points

### OPEN QUESTION: What Is "selectedElement" Really Doing?

**Status**: Architecture unclear, needs discussion before proceeding with refactor

**The confusion:**

1. **Type mismatch**: `SelectedElement` defined as union of raw data types (ClassNode | EnumDefinition | SlotDefinition | VariableSpec), but should probably be just `Element`

2. **Inconsistent representations**:
   - Sometimes `Element` instance
   - Sometimes `{type: string, name: string}` object
   - Sometimes `Element + type string`
   - Sometimes just a name string

3. **Unclear purpose**:
   - NOT used for hover (separate `hoveredElement` exists)
   - Passed to dialogs but unclear if necessary
   - No visual indication of "selected" state beyond dialog opening
   - App.tsx:467 passes `selectedElement={openDialogs[0].element}` to panels, but only used for renderItems isSelected logic

4. **View code in model classes**:
   - Each ElementCollection has renderItems() with isSelected logic
   - Lots of redundant code between the 4 implementations
   - Should this be in Section.tsx instead?
   - Violates separation of concerns (view logic in model)

**Questions to answer:**
1. What is the actual purpose of tracking "selected" state?
2. How does dialog restoration from URL work? (User couldn't find handleOpenDialog call during restoration)
3. Can we eliminate selectedElement entirely and just use click handlers?
4. Should renderItems be in model classes at all?

**Proposed simplification:**
- `selectedElement: Element | undefined` (not union of raw types)
- Or just store name string and use `modelData.elementLookup.get(name)`
- Move isSelected display logic from ElementCollection.renderItems to Section.tsx
- Keep model classes focused on data, not view rendering

**Impact on current refactor:**
- Currently converting collections to store Element instances (not raw data)
- Added temporary adapter in ElementsPanel using `(element as any).rawData` - code smell
- Need to decide on selectedElement architecture before continuing
- This affects how Elements flow through callback chain: Collection → Section → ElementsPanel → App

**Recommendation**: Pause collection refactor, clarify selectedElement design, then proceed cleanly without temporary fixes.

### OPEN QUESTION: Where Should Element Type Metadata Live?

**Status**: Architecture decision needed

**Current approach:**
- Separate `ElementRegistry.ts` file with:
  - `ELEMENT_TYPES` map: colors, labels, icons, pluralLabel per type
  - `RELATIONSHIP_TYPES` map: relationship metadata
  - Helper functions: `getAllElementTypeIds()`, `isValidElementType()`
- Element classes import from registry: `ELEMENT_TYPES[this.type]`

**Alternative approach:**
Put metadata directly in element classes as static properties:
```typescript
class ClassElement extends Element {
  static readonly typeId = 'class' as const;
  static readonly metadata = {
    icon: 'C',
    label: 'Class',
    pluralLabel: 'Classes',
    color: { name: 'blue', selectionBg: '...', ... }
  };

  readonly type = ClassElement.typeId;
  // ...
}
```

**Tradeoffs:**

**Option A: Keep separate registry (current)**
- ✅ All metadata in one place, easy to see full type system
  - sg note: there are also types and interfaces in types.tx; should they move?
- ✅ Can add new element types without touching existing files
- ✅ Registry can have utility functions operating on all types
- ✅ Clear separation: models focus on data, registry on metadata
- ❌ Extra indirection: `ELEMENT_TYPES[this.type]` instead of `this.metadata`
- ❌ Two places to update when adding element types

**Option B: Metadata in element classes**
- ✅ Metadata lives with the class it describes (better cohesion)
- ✅ Less indirection: `ClassElement.metadata` is direct
- ✅ TypeScript can enforce metadata completeness per class
- ❌ Metadata scattered across multiple files
- ❌ Harder to see full type system at a glance
- ❌ Registry functions would need to iterate all classes

**Hybrid option C: Classes define metadata, registry aggregates**
```typescript
// ClassElement.ts
class ClassElement extends Element {
  static readonly metadata = { ... };
}

// ElementRegistry.ts (generated/aggregated)
export const ELEMENT_TYPES = {
  class: ClassElement.metadata,
  enum: EnumElement.metadata,
  slot: SlotElement.metadata,
  variable: VariableElement.metadata
} as const;
```
- ✅ Metadata defined with classes (cohesion)
- ✅ Registry provides convenient lookup
- ❌ More complex, potential for sync issues

**User's question:** "Is there any reason not to combine stuff from ElementRegistry into model classes? I'm not sure where to put it"

**Considerations:**
- If we move renderItems out of model classes (see selectedElement question), models become more data-focused → suggests keeping metadata separate
- If element classes handle their own rendering, having metadata there makes sense
- Current registry is only ~200 lines and provides nice overview of type system
- Would split registry into 4+ files (one per element type) if moved into classes

**Recommendation TBD** - Depends on outcome of renderItems/selectedElement discussion. If models stay focused on data (no view code), keep registry separate. If models handle their own display, move metadata into classes.

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
