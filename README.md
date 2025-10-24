# BDCHM Interactive Documentation

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

### What You Can Explore
- Inheritance chains (e.g., `MeasurementObservation is_a Observation`)
- Which variables map to which classes
- Class attributes and their value ranges (enums, other classes, primitives)
- Specimen lineage, activity workflows, observation structures

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
- React + TypeScript + Vite
- Tailwind CSS for styling
- D3.js (minimal - only for specific visualizations)

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

## Roadmap

Current features:
- ✅ **Dual panel layout** with section toggles (Classes, Enums, Slots, Variables)
- ✅ **Multiple draggable/resizable dialogs** with full state persistence
- ✅ **Clickable navigation** between classes, enums, and slots
- ✅ **Shareable URLs** that preserve layout and dialog positions
- ✅ **Abstract class indicators** in class hierarchy tree
- ✅ **Element-based architecture** - refactored for maintainability and SVG link preparation

Upcoming features:
- **SVG link visualization**: Draw connections between related elements across panels
- **Search & filter**: Full-text search, faceted filters, quick navigation
- **Custom presets**: Save frequently-used panel configurations
- **Neighborhood exploration**: Show k-hop neighbors, relationship type filters
- **Advanced views**: Network graphs, enum-class matrix, comparison views

## Contributing

When adding new features:
- Extract testable logic into utility functions
- Write tests for data transformations and calculations
- Run the full test suite before committing: `npm test -- --run`

**Documentation:**
- [CLAUDE.md](CLAUDE.md) - Development context, architecture decisions, implementation notes
- [TESTING.md](TESTING.md) - Testing strategy, test file documentation, how to write tests
