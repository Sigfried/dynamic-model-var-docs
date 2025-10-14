# CLAUDE.md - LinkML Interactive Documentation Project

## Project Overview
Building interactive documentation for a LinkML data model (BioData Catalyst Harmonized Model - BDCHM) that bidirectionally connects model elements to variable specifications.

**Tech Stack**: React + Vite + D3.js (minimal, for specific visualizations only)

## Data Model Stats
- **49 classes** (organized in inheritance hierarchy from root Entity class)
- **7 slots** (shared attributes across classes)
- **40 enums** (constrained value sets)
- **152 variables** mapping to model classes (heavily skewed: 114 → MeasurementObservation)

## Core Files
- `bdchm.yaml` - LinkML schema definition, source of model truth. But actually use
                 the generated json file for the application:
  - `generated/bdchm.schema.json`
- `variable-specs-S1.tsv` - Variable specifications with mappings to BDCHM classes

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
- Root: `Entity` (abstract)
- Major branches:
  - Person → Participant pathway
  - Specimen (with related activity classes)
  - Observation → MeasurementObservation, SdohObservation, etc.
  - Exposure → DrugExposure, DeviceExposure
  - Clinical: Condition, Procedure, Visit
  - Administrative: ResearchStudy, Organization, Consent

### Variable Distribution
The mapping is heavily concentrated:
- 114 variables → MeasurementObservation (75% of all variables!)
- 12 → Condition
- 11 → Drug Exposure
- 5 → Demography
- Rest distributed across other classes

This concentration needs special handling in the UI to avoid overwhelming users.

## Implementation Plan

### Phase 1: Core Two-Panel Layout
1. Load model schema
2. Parse TSV variable specs
3. Build class hierarchy tree (left panel)
4. Build detail view (right panel)
5. Wire up selection/navigation

### Phase 2: Search and Filter
1. Full-text search across classes and variables
2. Filter by class type, variable count, etc.
3. Highlight search results in tree

### Phase 3: Enhanced Details
1. Show class attributes, slots used, enums referenced
2. Show variable specs with sortable table
3. Add bidirectional links (from variable back to class)

### Phase 4: Optional Advanced Views
1. Bipartite graph for filtered subsets
2. Enum usage matrix
3. Export/permalink functionality

## Development Guidelines
- **Time-constrained**: Prioritize working over perfect
- **Component reusability**: Break down complex views into simple React components
- **Minimal D3**: Only use D3 where React alone is insufficient (e.g., specific layouts)
- **Tailwind CSS**: For rapid styling without CSS wrestling

## Key User Questions to Answer
- "What classes use this enum?"
- "What's the inheritance chain for Specimen?"
- "Show me everything related to observations"
- "Which variables map to Condition class?"
- "What are the units/data types for these measurements?"

## Constraints and Assumptions
- No cycles expected in the data model
- Single inheritance only (class hierarchy is a tree)
- Variable-to-class mapping is many-to-one (multiple variables can map to same class)
- Users are domain experts who understand LinkML concepts

## Notes
- Vite for fast iteration and HMR
- Focus on usability over "cool" visualizations
- Build for exploration since specific use cases are vague
- MeasurementObservation might need special UI treatment due to variable concentration