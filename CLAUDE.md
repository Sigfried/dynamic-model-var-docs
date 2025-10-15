# CLAUDE.md - Development Guide

## Project Overview
Interactive documentation for the BioData Catalyst Harmonized Model (BDCHM), a LinkML data model. The application provides bidirectional navigation between model classes and variable specifications.

**Tech Stack**: React + TypeScript + Vite + Tailwind CSS + D3.js (minimal)

## Data Files and Updates

### Primary Data Sources
- **Model Schema**: `bdchm.yaml` (LinkML source) → `bdchm.metadata.json` (runtime data)
  - Source: [BDCHM GitHub - bdchm.yaml](https://github.com/RTIInternational/NHLBI-BDC-DMC-HM/blob/main/src/bdchm/schema/bdchm.yaml)
  - Python script downloads YAML and generates `public/source_data/HM/bdchm.metadata.json`
  - Metadata includes class hierarchy with proper `is_a` inheritance, slots, and enums
  - Update data: `npm run download-data` (sets up Python venv, downloads files, generates metadata)

- **Variable Specifications**: `source_data/variable-specs-S1.tsv`
  - Source: [Variable specs Table S1 (Google Sheet)](https://docs.google.com/spreadsheets/d/1PDaX266_H0haa0aabMYQ6UNtEKT5-ClMarP0FvNntN8/edit?gid=0#gid=0)
  - Auto-downloaded by `npm run download-data` script

### Data Model Statistics
- **47 classes** in the schema
- **7 slots** (shared attributes across classes)
- **40 enums** (constrained value sets)
- **151 variables** mapping to model classes
  - Heavily skewed distribution: 103 variables → MeasurementObservation (68%)
  - Other concentrations: 20 → Condition, 17 → DrugExposure, 3 → Demography, 3 → Procedure
  - Plus: 2 → SDoHObservation, 2 → Person, 1 → Observation

## Architecture Decisions

### UI Approach: Overview First, Zoom and Filter, Details on Demand
Following Shneiderman's information visualization mantra:

1. **Overview**: Two-panel layout
   - Left: Collapsible tree showing class hierarchy with variable counts
   - Right: Details panel for selected class/variable
   
2. **Zoom/Filter**: 
   - Search/filter bar across all classes and variables
   - Faceted filters (e.g., "show only classes with >5 variables")
   - View toggles between different aspects (classes only, classes+enums, classes+variables)

3. **Details on Demand**:
   - Click class → show full LinkML definition, attributes, related enums, mapped variables
   - Click variable → show specs (data type, units, CURIE, description)

### Why Not Force-Directed Graphs
This is a **hierarchical data model**, not an arbitrary network. The class hierarchy is a tree (single inheritance). Variables-to-classes creates a bipartite structure. Force-directed layouts would create visual chaos without adding comprehension.

### Preferred Visualizations
- **Hierarchical tree** for class inheritance (collapsible, like file explorer)
- **Tables with sorting/filtering** for variable lists
- **Bipartite layouts** (optional) for classes-to-variables relationships, but only for subsets
- **Matrix/adjacency views** (future) for which classes use which enums

## Data Processing Notes

### Class Hierarchy
The schema uses a shallow hierarchy with several root-level classes:
- **Observation family**: Observation → MeasurementObservation, SdohObservation, etc.
- **Exposure family**: Exposure → DrugExposure, DeviceExposure
- **Person/Participant**: Person → Participant (demographics)
- **Specimen family**: Specimen + related activity classes (SpecimenCreationActivity, etc.)
- **Clinical**: Condition, Procedure, Visit
- **Administrative**: ResearchStudy, Organization, Consent
- **Data structures**: ObservationSet, MeasurementObservationSet, etc.

**Implementation Notes**:
- Parent-child relationships are extracted from the YAML schema's `is_a` field
- The schema has no single root "Entity" class - multiple top-level classes exist
- Consider whether adding a synthetic root node would improve navigation UX

### Variable Distribution
The mapping is heavily concentrated in MeasurementObservation:
- **103 variables → MeasurementObservation (68% of all variables!)**
- 20 → Condition
- 17 → DrugExposure
- 3 → Demography
- 3 → Procedure
- 2 → SDoHObservation
- 2 → Person
- 1 → Observation

This concentration requires special UI handling to avoid overwhelming users when viewing MeasurementObservation.

## Implementation Status

### Phase 1: Core Two-Panel Layout ✓ COMPLETE
- Schema loading and parsing
- TSV variable spec parsing
- Class hierarchy tree component (left panel)
- Detail view component (right panel)
- Selection/navigation wiring
- Basic styling with Tailwind

**Current structure:**
- `App.tsx`: Main container with two-panel layout
- `ClassTree.tsx`: Collapsible tree view of class hierarchy
- `DetailView.tsx`: Class details and variable list
- `dataLoader.ts`: Schema/TSV loading and hierarchy building
- `types.ts`: TypeScript type definitions

### Phase 2: Search and Filter (TODO)
- Full-text search across classes and variables
- Filter by class type, variable count, etc.
- Highlight search results in tree
- Search/filter UI in header

### Phase 3: Enhanced Details (TODO)
- Show class attributes, slots used, enums referenced
- Sortable/filterable variable tables
- Bidirectional links (from variable back to class)
- Show inheritance chains

### Phase 4: Optional Advanced Views (TODO)
- Bipartite graph for filtered subsets
- Enum usage matrix
- Export/permalink functionality

## Development Guidelines

### Code Style
- Use ES modules (import/export) syntax, not CommonJS
- TypeScript for type safety
- Destructure imports when possible
- Component-based architecture (small, reusable React components)

### Priorities
- **Time-constrained**: Prioritize working over perfect
- **Usability over "cool"**: Focus on practical exploration tools, not flashy visualizations
- **Minimal D3**: Only use D3 where React alone is insufficient (e.g., force layouts, specific graph algorithms)
- **Tailwind CSS**: For rapid styling without CSS wrestling

### Testing and Type Checking
- Run `npm run build` or type checker after significant changes
- Prefer running single tests when available

## Technical Constraints and Assumptions

### Data Model Structure
- **Single inheritance**: Class hierarchy is a tree, not a DAG (no multiple inheritance in practice)
- **No cycles**: Model is acyclic
- **Many-to-one variable mapping**: Multiple variables can map to same class
- **Bipartite structure**: Variables-to-classes creates a bipartite graph when visualized

### User Expectations
- Users are domain experts who understand LinkML concepts
- Need to answer questions like:
  - "What classes use this enum?"
  - "What's the inheritance chain for Specimen?"
  - "Show me everything related to observations"
  - "Which variables map to Condition class?"
  - "What are the units/data types for these measurements?"

## Special Considerations

### MeasurementObservation Concentration
With 103 variables (68% of total) mapped to a single class, special UI treatment is needed:
- Pagination or virtualization for variable lists
- Grouping/filtering within the class (e.g., by measurement type, body system)
- Visual indicators of density in tree view
- Consider sub-categorization by CURIE prefix or variable type

### Future Enhancements to Consider
- Permalink/URL state for sharing specific views
- Export functionality (JSON, CSV, etc.)
- Enum usage matrix showing class-enum relationships
- Bipartite graph for filtered subsets of classes/variables