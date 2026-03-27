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

### Developer Documentation

- **[CLAUDE.md](CLAUDE.md)** — Development principles and architectural rules
- **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** — Technical architecture, data flow, design patterns
- **[TASKS.md](TASKS.md)** — Current work, upcoming tasks, and roadmap
- **[docs/TESTING.md](docs/TESTING.md)** — Testing strategy and documentation

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

See [Developer Documentation](#developer-documentation) above for links to all docs.

---

## Credits

Developed by Sigfried Gold with AI assistance from Claude (Anthropic).
