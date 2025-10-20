# BDCHM Interactive Documentation

Interactive documentation browser for the [BioData Catalyst Harmonized Model (BDCHM)](https://github.com/RTIInternational/NHLBI-BDC-DMC-HM) - a LinkML data model connecting clinical/observational classes to variable specifications.

## Features

### Browse the Model
- **Class hierarchy tree** - Explore 47 classes organized by inheritance relationships
- **Variable mapping** - See which of the 151 variables map to each class
- **Class details** - View definitions, attributes, and relationships
- **Variable specifications** - Data types, units, CURIEs, descriptions

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

## Roadmap

Future features planned:
- **Search & filter**: Full-text search, faceted filters, view toggles
- **Enhanced navigation**: Bidirectional links, clickable enums, inheritance chains
- **Neighborhood exploration**: Show k-hop neighbors, relationship type filters
- **Advanced views**: Network graphs, enum-class matrix, comparison views

## Contributing

See [CLAUDE.md](CLAUDE.md) for development context, architecture decisions, and implementation notes.
