# BDCHM Interactive Documentation

Interactive documentation browser for the [BioData Catalyst Harmonized Model (BDCHM)](https://github.com/RTIInternational/NHLBI-BDC-DMC-HM) - a LinkML data model connecting clinical/observational classes to variable specifications.

**Live Demo**: https://rtiinternational.github.io/NHLBI-BDC-DMC-HM/

---

## For Users

### What is BDCHM?

The BioData Catalyst Harmonized Model (BDCHM) is a LinkML schema that defines:
- **47 classes** organized by inheritance (e.g., `MeasurementObservation is_a Observation`)
- **40 enums** (constrained value sets like condition types, specimen types)
- **7 slots** (reusable attribute definitions shared across classes)
- **151 variables** (specific measurements/observations mapped to classes)

**Model Statistics**:
- Multiple root classes (no single "Entity" superclass)
- 68% of variables (103) map to MeasurementObservation class
- Rich graph structure with multiple relationship types

### What You Can Explore

**Browse relationships**:
- Inheritance chains (which classes extend which)
- Class→Enum usage (which classes use which value sets)
- Class→Class associations (participant relationships, specimen lineage, activity workflows)
- Slot definitions shared across multiple classes

**Investigate specific elements**:
- Which variables map to which classes (e.g., 103 variables map to MeasurementObservation)
- Class attributes and their value ranges (primitives, enums, or other classes)
- Full variable specifications (data type, units, CURIE identifiers)
- Inheritance chains with attribute overrides

### Features

**Dual Panel Layout**:
- Show different sections (Classes, Enums, Slots, Variables) side-by-side
- Each panel independently configurable
- SVG links visualize relationships between elements across panels
- Multiple preset layouts for common exploration tasks

**Interactive Navigation**:
- Click any class, enum, or slot to open its detail view
- Multiple detail dialogs can be open simultaneously
- Drag and resize dialogs for custom layouts
- Bidirectional "used by" lists (e.g., which classes use this enum?)

**State Persistence**:
- Shareable URLs preserve panel layout, open dialogs, and expansion state
- Browser localStorage saves your last session
- Copy URL to share exact view with collaborators

**Responsive Design**:
- Wide screens: Stacked detail panels on right side
- Narrow screens: Draggable/resizable dialogs
- Responsive tables split into columns for easier viewing

---

## For Developers

### 🚨 CRITICAL: Separation of Model and View Concerns

**Components MUST use abstract `Element` and `ElementCollection` classes ONLY.**

The view layer must NOT import or reference model-specific types (`ClassNode`, `EnumDefinition`, `SlotDefinition`, `VariableSpec`). Extract UI-focused attributes through polymorphic methods whenever conditional logic is needed.

**❌ WRONG** - Component knows about model types:
```typescript
import type { ClassNode, EnumDefinition } from '../types';

function MyComponent({ element }: { element: ClassNode | EnumDefinition }) {
  if ('children' in element) { /* ClassNode logic */ }
  if ('permissible_values' in element) { /* EnumDefinition logic */ }
}
```

**✅ CORRECT** - Component uses abstract Element:
```typescript
import type { Element } from '../models/Element';

function MyComponent({ element }: { element: Element }) {
  const info = element.getDisplayInfo(); // Polymorphism handles type differences
  return <div>{info.title}</div>;
}
```

**Rationale**: This architecture enables:
- Type-safe polymorphism instead of duck typing
- Model changes don't cascade to view layer
- New element types added without touching components
- Clear separation between data structure and presentation

See `src/models/Element.tsx` for the abstract base classes that all components must use.

---

### Architecture Philosophy: Shneiderman's Mantra

**"Overview First, Zoom and Filter, Details on Demand"**

This principle guides the UX design:

**1. Overview First** - Show the model topology with all relationship types visible:
- Class inheritance tree (hierarchical view)
- Class→Enum usage patterns (which classes use which value sets)
- Class→Class associations (domain relationships)
- Slot definitions shared across classes
- Visual density indicators (future: show which classes have most variables/connections)

**2. Zoom and Filter** (future enhancements):
- Full-text search across classes, variables, enums, slots
- Faceted filtering (class type, variable count, relationship type)
- k-hop neighborhood view (show only elements within N steps of focal element)
- Relationship type filters (show only `is_a` vs show associations)

**3. Details on Demand** - Progressive disclosure of information:
- Click to open detailed views
- Show class definitions, descriptions, attributes, slots
- Display variable specifications with data types and units
- Show inheritance chains with attribute overrides
- Bidirectional navigation between related elements
- Future: Sortable/filterable variable tables

### Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Testing**: Vitest + React Testing Library (160 tests)
- **Data**: LinkML schema (YAML) + TSV variable specifications
- **Visualization**: Native SVG with gradient definitions
- **State Management**: React Hooks + URL parameters + localStorage

### Data Flow

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

### Key Architecture Patterns

**Element-Based Architecture**:
- Base `Element` class with subclasses: `ClassElement`, `EnumElement`, `SlotElement`, `VariableElement`
- Each element knows its name, type, and relationships
- ElementRegistry centralizes type metadata (colors, labels, icons)

**Collection Pattern**:
- Each element type has a corresponding collection class
- Collections stored in `Map<ElementTypeId, ElementCollection>`
- Generic interfaces enable type-safe iteration

**Generic Tree Types**:
- `Tree<T>` and `TreeNode<T>` for hierarchical data
- Reusable for class hierarchies and variable groupings
- Generic operations: flatten(), find(), getLevel(), map()

**RenderableItem Interface**:
- Separates data structure from presentation
- Collections provide `getRenderableItems()` returning structure metadata
- UI components render generically without type-specific logic

### Data Sources

- **Model Schema**: [bdchm.yaml](https://github.com/RTIInternational/NHLBI-BDC-DMC-HM/blob/main/src/bdchm/schema/bdchm.yaml) → processed into `bdchm.metadata.json`
- **Variable Specs**: [Table S1 (Google Sheet)](https://docs.google.com/spreadsheets/d/1PDaX266_H0haa0aabMYQ6UNtEKT5-ClMarP0FvNntN8/edit?gid=0#gid=0) → `variable-specs-S1.tsv`

**To update data**: `npm run download-data`

### Getting Started

```bash
# Install dependencies
npm install

# Download/update source data
npm run download-data

# Run development server
npm run dev

# Run tests
npm test

# Type checking
npm run typecheck

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

### Testing

The project has 160 tests across 9 test files covering:
- Data loading & processing
- Element relationships & SVG links
- Adaptive layout logic
- Duplicate detection
- Panel helpers & styling
- Component rendering

See [TESTING.md](docs/TESTING.md) for complete documentation on testing philosophy, strategies, and how to write tests.

### Contributing

When adding new features:
1. Extract testable logic into utility functions
2. Write tests for data transformations and calculations
3. Run full test suite before committing: `npm test -- --run`
4. Run type checking: `npm run typecheck`

**Documentation**:
- **README.md** (this file) - User guide, developer overview, architecture philosophy
- **CLAUDE.md** - Critical architectural principles and development guidelines
- **TASKS.md** - Current task, upcoming work, and future ideas
- **PROGRESS.md** - Completed work for reporting to managers/stakeholders
- **TESTING.md** - Testing strategy and test documentation

### LinkML-Specific Notes

**Understanding Slots, Attributes, and Slot Usage**:

From LinkML documentation: "Attributes are really just a convenient shorthand for being able to declare slots 'inline'."

- **Slots** (top-level): Reusable property definitions in schema's `slots:` section
- **Attributes** (inline): Class-specific slot definitions in `attributes:` section (syntactic sugar for inline slots)
- **Slot Usage** (refinements): Class-specific customizations in `slot_usage:` section (add constraints, change range, make required)

The UI displays all three together in a unified "Attributes & Slots" table since they're semantically equivalent.

**Metadata Structure**: LinkML uses `range` (not `type`) for type information, `multivalued` for arrays, `required` for mandatory fields.

---

## Credits

Developed by Scott Gold with AI assistance from Claude (Anthropic).
