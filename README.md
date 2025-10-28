TODO:
- remove redundancy below
- mark stuff that should be included in the app
    - on About screen, or
    - contextual help

# BDCHM Interactive Documentation App

Interactive documentation browser for the [BioData Catalyst Harmonized Model (BDCHM)](https://github.com/RTIInternational/NHLBI-BDC-DMC-HM) - a LinkML data model connecting clinical/observational classes to variable specifications.

## Features

### Browse the Model
- **Dual panel layout** - Show different sections (Classes, Enums, Slots, Variables) side-by-side
- **Class hierarchy tree** - Explore 47 classes organized by inheritance relationships
- **Multiple detail dialogs** - Open, drag, and resize multiple entity details simultaneously
- **Variable mapping** - See which of the 151 variables map to each class
- **Clickable navigation** - Navigate between related entities (classes, enums, slots)
- **State persistence** - Shareable URLs preserve panel layout and open dialogs
- **Responsive tables** - Large tables split into columns for easier viewing

Current features:
- ✅ **Dual panel layout** with section toggles (Classes, Enums, Slots, Variables)
- ✅ **Multiple draggable/resizable dialogs** with full state persistence
- ✅ **Clickable navigation** between classes, enums, and slots
- ✅ **Shareable URLs** that preserve layout and dialog positions
- ✅ **Abstract class indicators** in class hierarchy tree
- ✅ **Element-based architecture** - refactored for maintainability and SVG link preparation
- ✅ **SVG link visualization**: Draw connections between related elements across panels

Current Architecture

**Panel System**:
- Dual independent panels (left/right)
- Each panel can show any combination of: Classes, Enums, Slots, Variables
- SVG link overlay visualizes relationships with gradients
- State persists to URL + localStorage

**Detail Display**:
- Wide screens: Stacked panels on right side
- Narrow screens: Draggable/resizable dialogs
- Multiple simultaneous detail views
- 
### What You Can Explore
- Inheritance chains (e.g., `MeasurementObservation is_a Observation`)
- Which variables map to which classes
- Class attributes and their value ranges (enums, other classes, primitives)
- Specimen lineage, activity workflows, observation structures

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


## Developer Notes

### Data Sources
The application uses two primary data sources:
- **Model Schema**: [bdchm.yaml](https://github.com/RTIInternational/NHLBI-BDC-DMC-HM/blob/main/src/bdchm/schema/bdchm.yaml) → processed into `bdchm.metadata.json`
- **Variable Specs**: [Table S1 (Google Sheet)](https://docs.google.com/spreadsheets/d/1PDaX266_H0haa0aabMYQ6UNtEKT5-ClMarP0FvNntN8/edit?gid=0#gid=0) → `variable-specs-S1.tsv`

**To update data**: Run `npm run download-data`

## Getting Started

### Prerequisites
- Node.js (recent version with ES modules support)
- npm or pnpm
- Python 3.9+ and poetry (for data download script)

### Installation & Development
```bash
# Install dependencies
npm install

# Download/update source data
npm run download-data

# Run development server
npm run dev

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

### Tech Stack
- **React + TypeScript**: Type safety, component reuse
- **Vite**: Fast dev server, HMR
- **Tailwind CSS**: Rapid styling
- **D3.js (minimal)**: Only for specific graph algorithms or layouts that React can't handle
  **[Not using D3 so far. SVG link path generated directly, but consider using it]**


### Testing
The project has comprehensive test coverage (134 tests) for core logic and utilities.

```bash
# Run tests in watch mode
npm test

# Run all tests once
npm test -- --run
```

See [TESTING.md](TESTING.md) for complete testing documentation, including:
- Testing philosophy and strategy
- Detailed test file documentation
- How to write new tests
- Examples and troubleshooting

## Contributing

When adding new features:
- Extract testable logic into utility functions
- Write tests for data transformations and calculations
- Run the full test suite before committing: `npm test -- --run`

**Documentation:**
- [CLAUDE.md](CLAUDE.md) - Development context, architecture decisions, implementation notes
- [TESTING.md](TESTING.md) - Testing strategy, test file documentation, how to write tests
