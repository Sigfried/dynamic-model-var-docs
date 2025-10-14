# BDCHM Interactive Documentation

Interactive documentation browser for the BioData Catalyst Harmonized Model (BDCHM) that bidirectionally connects LinkML model elements to variable specifications.

## Current Features (Phase 1)

### Two-Panel Layout
- **Left Panel**: Collapsible tree view of class hierarchy
  - Shows all 49 BDCHM classes organized by inheritance
  - Displays variable counts for each class
  - Click to select and explore classes

- **Right Panel**: Detailed view of selected class
  - Class definition and metadata
  - List of variables mapped to the class
  - Variable specifications (data type, units, CURIE, description)

### Data Sources
- **Model Schema**: [bdchm.schema.json](https://github.com/RTIInternational/NHLBI-BDC-DMC-HM/blob/main/generated/bdchm.schema.json) (saved locally in `public/source_data/HM/`)
- **Variable Specifications**: [Variable specs Table S1](https://docs.google.com/spreadsheets/d/1PDaX266_H0haa0aabMYQ6UNtEKT5-ClMarP0FvNntN8/edit?gid=0#gid=0) (saved locally as `public/source_data/HV/variable-specs-S1.tsv`)

### Model Overview
- **47 classes** in the BDCHM schema
- **7 slots** (shared attributes across classes)
- **40 enums** (constrained value sets)
- **151 variables** mapped to model classes
  - Distribution is heavily skewed: 103 variables (68%) map to `MeasurementObservation`
  - Other concentrations: 20 → Condition, 17 → DrugExposure, 3 → Demography, 3 → Procedure

## Development

### Prerequisites
- Node.js (recent version with ES modules support)
- npm or pnpm

### Getting Started
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### Tech Stack
- React + TypeScript
- Vite (for fast development and HMR)
- Tailwind CSS (for styling)
- D3.js (minimal usage, only for specific visualizations)

## Planned Features

### Phase 2: Search and Filter
- Full-text search across all classes and variables
- Faceted filters (e.g., "show only classes with >5 variables")
- View toggles between different aspects (classes only, classes+enums, classes+variables)
- Highlight search results in tree view

### Phase 3: Enhanced Details
- Show class attributes, slots used, and enums referenced
- Sortable/filterable variable tables
- Bidirectional navigation (from variable back to class)
- Show inheritance chains and class relationships

### Phase 4: Advanced Views
- Bipartite graph visualization for filtered subsets of classes/variables
- Matrix/adjacency view showing which classes use which enums
- Export and permalink functionality for sharing specific views

## Project Structure
```
src/
├── components/
│   ├── ClassTree.tsx      # Left panel: collapsible class hierarchy
│   └── DetailView.tsx     # Right panel: class/variable details
├── utils/
│   └── dataLoader.ts      # Schema and variable spec loading/parsing
├── types.ts               # TypeScript type definitions
└── App.tsx                # Main application component
```

## Key Use Cases
- "What classes use this enum?"
- "What's the inheritance chain for Specimen?"
- "Show me everything related to observations"
- "Which variables map to Condition class?"
- "What are the units/data types for these measurements?"
