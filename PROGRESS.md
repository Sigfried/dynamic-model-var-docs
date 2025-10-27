# BDCHM Interactive Documentation - Progress Report

> **Purpose**: Document completed work for reporting to managers, funders, and stakeholders

---

## Project Overview

Interactive visualization and documentation system for the BDCHM (BioData Catalyst Harmonized Model) schema, enabling exploration of 47 classes, 40 enums, 7 slots, and 151 variables through an intuitive dual-panel interface with visual relationship links.

**Live Demo**: https://rtiinternational.github.io/NHLBI-BDC-DMC-HM/

---

## Phase 1: Foundation (Basic Layout & Navigation)

**Completed**: January 2025

### Key Features
- Class hierarchy display with `is_a` inheritance tree visualization
- Basic element selection and navigation
- Variable mapping display showing which variables map to which classes
- Fixed type field bug: now correctly uses `range` field from LinkML metadata

### Technical Details
- React + TypeScript + Vite stack
- LinkML schema parsing with proper type extraction
- Basic state management and component structure

---

## Phase 2: Rich Details & Interactive Navigation

**Completed**: January 2025

### Key Features
- **Comprehensive Class Details**: Full attribute tables with type information and constraints
- **Color-Coded Type System**:
  - Green: Primitive types (string, integer, float)
  - Purple: Enum types (constrained value sets)
  - Blue: Class references (associations)
- **Visual Indicators**:
  - `*` for required attributes
  - `[]` for multivalued attributes
  - Hover legend explaining type categories
- **Clickable Navigation**: Click any enum or class type to view its definition
- **Reverse Indices**: Built enum→classes and slot→classes mappings for "used by" lists
- **All Element Types**: Detail views for classes, enums, slots, and variables

### Technical Details
- Reverse index computation during data loading
- Click-through navigation system
- Rich metadata display with proper LinkML attribute handling

---

## Phase 3a: Flexible Dual-Panel System

**Completed**: January 2025

### Key Features
- **Reusable Panel Component**: ElementsPanel with section toggles (C/E/S/V icons)
- **Independent Panels**: Left and right panels each support all 4 section types
- **State Persistence**:
  - URL query parameters for shareable links
  - localStorage for user preferences
- **Preset Configurations**: Quick-access presets via header links
  - Classes Only
  - Classes + Enums
  - All Sections
  - Variable Explorer
- **Multi-Column Layouts**: Automatic grid layout when multiple sections active
- **Section Components**: Dedicated ClassSection, EnumSection, SlotSection, VariablesSection

### Technical Details
- Query string format: `?l=c,e&r=s,v` (compact codes)
- Bidirectional state sync between URL and localStorage
- CSS Grid for responsive multi-section layouts

---

## Phase 3b: Multiple Detail Dialogs

**Completed**: January 2025

### Key Features
- **Non-Modal Draggable Dialogs**: Replaced fixed center panel with floating dialogs
- **Multiple Simultaneous Dialogs**: Open unlimited detail dialogs at once
- **Cascading Positioning**: New dialogs offset 40px from previous for easy access
- **8-Way Resizable**: Resize from any edge or corner (N, S, E, W, NE, NW, SE, SW)
- **Responsive Tables**:
  - Variables table: Splits to two columns at 1700px width
  - Enums table: Splits to two columns at 1000px width
- **Full State Persistence**: All dialog positions and sizes saved to URL
- **Smart Keyboard Control**: Escape key closes oldest/bottommost dialog
- **Intelligent Navigation**: Clicking element in dialog opens new dialog (doesn't replace)

### Technical Details
- URL format: `?dialogs=type:name:x,y,w,h;type:name:x,y,w,h`
- React Hooks for drag/resize state management
- Complex state serialization/deserialization

---

## Phase 3c: Element Architecture Refactoring

**Completed**: January 2025

### Key Features
- **Type-Safe Element Classes**: Base Element class with ClassElement, EnumElement, SlotElement, VariableElement subclasses
- **Unified Table Component**: DetailTable for responsive table rendering across all element types
- **DOM Data Attributes**: Added data-element-type and data-element-name for positioning
- **Consistent Terminology**: Standardized "element" terminology throughout (was mixed entity/element)
- **Abstract Class Support**: LinkML abstract classes properly labeled in UI
- **LinkML slot_usage**: Extract and display slot refinements from schema
- **Type Safety**: Fixed all @typescript-eslint/no-explicit-any errors

### Technical Details
- Updated data pipeline to extract slot_usage from LinkML schema
- TypeScript types updated with slots, slot_usage, and abstract fields
- All elements ready for getBoundingBox() positioning via unique IDs
- 164 occurrences renamed across 9 files

---

## Phase 3d: SVG Link Visualization

**Completed**: January 2025

### Key Features
- **Visual Relationship Links**: SVG curves connecting related elements across panels
- **Smart Filtering**: Only shows cross-panel links (tree already shows inheritance)
- **Bidirectional Prevention**: Class→class links only drawn left→right (not both directions)
- **Directional Arrowheads**: Subtle arrows (0.3 opacity) point to target elements
- **Interactive Hover**: Links change from 20% to 100% opacity on hover, stroke width increases
- **Automatic Updates**: Links redraw on scroll, section expand/collapse, and element visibility changes
- **Gradient Colors**: Links transition from source element color to target element color
  - Blue class → Purple enum shows blue-to-purple gradient
  - Orange variable → Blue class shows orange-to-blue gradient
  - Gradients adapt to link direction (left→right or right→left)

### Technical Details
- Created `src/test/linkLogic.test.ts` (26 tests) and `src/test/linkHelpers.test.ts` (27 tests)
- TDD approach: tested link filtering logic before implementing UI
- LinkOverlay component with absolute-positioned SVG
- Comprehensive filtering: by type, visibility, self-refs, cross-panel
- Element classes all have `getRelationships()` method
- Debounced hover logging (300ms) to prevent console spam
- 32 gradient definitions (16 source→target combinations × 2 directions)
- Arrowheads positioned at path endpoints (refX=0, refY=5)

---

## Phase 3e: Adaptive Detail Display

**Completed**: January 2025

### Key Features
- **Responsive Modes**: Automatic switching between stacked panels and floating dialogs
  - Wide screens (≥1660px): Stacked detail panels on right side
  - Narrow screens (<1660px): Draggable/resizable dialogs
  - Smooth automatic transition on window resize
- **Duplicate Prevention**: Clicking already-open element brings it to top (no duplicates)
- **Type-Based Colored Headers**: Blue (classes), Purple (enums), Green (slots), Orange (variables)
- **Descriptive Titles**: "Class: Condition extends Entity", "Enum: ConditionConceptEnum"
- **Compact Spacing**: Reduced padding throughout for better information density
- **Empty State Handling**: Hide empty sections (e.g., enums with no values)
- **Clickable App Title**: Click logo to reset to saved or default layout

### Technical Details
- Space measurement with `useEffect` calculating available horizontal space
- Display mode threshold: 600px remaining space
- DetailPanelStack component for vertical stacking
- DetailPanel props: hideHeader and hideCloseButton for stacked mode
- Extracted logic into testable utilities:
  - `src/utils/layoutHelpers.ts` - Space calculation and mode determination (23 tests)
  - `src/utils/duplicateDetection.ts` - Duplicate entity detection (28 tests)
  - `src/utils/panelHelpers.tsx` - Panel titles and header colors (16 tests)
- Test suite expanded from 67 to 134 tests

---

## Phase 3f: Element Collection Architecture & LinkML Slot Inheritance

**Completed**: January 2025

### Key Features
- **ElementCollection Classes**: Generic architecture with ClassCollection, EnumCollection, SlotCollection, VariableCollection
- **Unified Section Component**: Single Section component replaces all type-specific section components
- **Per-Panel State Persistence**:
  - Classes: `lce`/`rce` (left/right class expansion)
  - Variables: `lve`/`rve` (left/right variable expansion)
  - Fixed bug where left and right panels shared variable expansion state
- **LinkML Slot Inheritance**: Proper handling of slot inheritance and refinements
  - Shows inherited slots from parent classes
  - Shows referenced top-level slots
  - Applies `slot_usage` refinements (range narrowing, required changes)
  - Source column indicates: "Inline" / "Slot: {name}" / "← {ParentClass}"
  - ⚡ indicator for refined slots
- **Correct Type Links**: Links now point to refined types (e.g., MeasurementObservation not Observation)

### Technical Details
- Removed 4 type-specific section components (ClassSection, EnumSection, SlotSection, VariablesSection)
- Created `collectAllSlots()` function to walk inheritance chain and apply refinements
- ElementCollection interface with `getExpansionKey()`, `renderItems()`, factory methods
- State persistence fully isolated per panel and per element type
- Example: MeasurementObservationSet now correctly shows `observations: array<MeasurementObservation>` (not `Observation`)

---

## Recent Enhancements (January 2025)

### Variable Section Improvements
- **Grouped Variables by Class**: Collapsible sections "MeasurementObservation (103)", etc.
- **Reduced Visual Clutter**: Removed redundant class names, reduced spacing
- **Default Collapsed**: All classes start collapsed to reduce scrolling
- **URL Persistence**: Expansion state saved with `?evc=Class1,Class2` parameter
- **Shared Expansion Hook**: Created reusable `useExpansionState` for all sections

### Link Directionality Fixes
- **One-Way Class Links**: Fixed bidirectional duplicates (only draw left→right for class→class)
- **Directional Arrowheads**: Color-matched to target element type
- **Immediate Rendering**: Links appear when sections expand (no scroll needed)
- **Arrowhead Positioning**: Fixed to stop precisely at element boundaries

### Code Quality Improvements
- **Entity→Element Refactor**: Systematic terminology consistency (164 occurrences, 9 files)
- **DRY Refactoring**: Reduced gradient/marker definitions from ~190 lines to ~52 lines (73% reduction)
- **TypeScript Lint**: Fixed @typescript-eslint/no-explicit-any errors with proper type inference

---

## Testing

**Current Coverage**: 134 tests across 8 test files (100% passing ✅)

### Test Suite Organization
- Data loading & processing (10 tests)
- Element relationships & SVG links (53 tests)
- Adaptive layout logic (23 tests)
- Duplicate detection (28 tests)
- Panel helpers & styling (16 tests)
- Component rendering (4 tests)

### Testing Philosophy
- **Extract & Test**: Pure functions, data transformations, calculations
- **Verify Visually**: React components, SVG rendering, animations, interactions
- **TDD Approach**: Write tests first for non-visual features

See [TESTING.md](TESTING.md) for complete testing documentation.

---

## Current Architecture

```
src/
├── components/
│   ├── PanelLayout.tsx        # 2-panel layout (left/right)
│   ├── ElementsPanel.tsx      # Reusable panel with section toggles
│   ├── DetailDialog.tsx       # Draggable/resizable dialog
│   ├── DetailPanel.tsx        # Content renderer for element details
│   ├── DetailPanelStack.tsx   # Stacked panel layout
│   ├── DetailTable.tsx        # Responsive table component
│   ├── LinkOverlay.tsx        # SVG relationship visualization
│   ├── ClassSection.tsx       # Class hierarchy tree
│   ├── EnumSection.tsx        # Enumeration lists
│   ├── SlotSection.tsx        # Slot definitions
│   └── VariablesSection.tsx   # Variable specifications
├── models/
│   └── Element.tsx            # Element base class + subclasses
├── utils/
│   ├── dataLoader.ts          # Schema/TSV parsing
│   ├── statePersistence.ts   # URL/localStorage management
│   ├── linkHelpers.ts         # SVG link utilities
│   ├── layoutHelpers.ts       # Adaptive layout logic
│   ├── duplicateDetection.ts # Duplicate prevention
│   └── panelHelpers.tsx       # Panel UI utilities
├── hooks/
│   └── useExpansionState.ts   # Shared expansion state
└── test/                      # Comprehensive test suite
```

---

## Data Model Statistics

- **47 classes** with inheritance hierarchy
- **40 enums** (constrained value sets)
- **7 slots** (reusable attribute definitions)
- **151 variables** (68% map to MeasurementObservation class)
- Multiple root classes (no single "Entity" superclass)

---

## Key Technical Achievements

1. **Flexible Visualization**: Dual-panel system supporting any combination of classes, enums, slots, variables
2. **Visual Relationships**: SVG gradient links with automatic directionality and intelligent filtering
3. **State Persistence**: Full application state serializable to URL for sharing
4. **Responsive Design**: Adapts between stacked panels and floating dialogs based on screen size
5. **Type Safety**: Comprehensive TypeScript types with zero `any` casts
6. **Test Coverage**: 134 tests ensuring reliability and enabling confident refactoring
7. **Clean Code**: DRY principles applied throughout, extracting testable utilities

---

## Technologies Used

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Testing**: Vitest + React Testing Library
- **Data**: LinkML schema (YAML) + TSV variable specifications
- **Visualization**: Native SVG with gradient definitions
- **State Management**: React Hooks + URL parameters + localStorage

---

## Credits

Developed by Scott Gold with AI assistance from Claude (Anthropic).
