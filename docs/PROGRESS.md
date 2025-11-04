# BDCHM Interactive Documentation - Progress Report

> **Purpose**: Document completed work for reporting to managers, funders, and stakeholders

---

## Project Overview

Interactive visualization and documentation system for the BDCHM (BioData Catalyst Harmonized Model) schema, enabling exploration of 47 classes, 40 enums, 7 slots, and 151 variables through an intuitive dual-panel interface with visual relationship links.

**Live Demo**: https://sigfried.github.io/dynamic-model-var-docs

---

## Table of Contents

- [Phase 1: Foundation (Basic Layout & Navigation)](#phase-1-foundation)
- [Phase 2: Rich Details & Interactive Navigation](#phase-2-rich-details)
- [Phase 3a: Flexible Dual-Panel System](#phase-3a-dual-panel)
- [Phase 3b: 🔴 Multiple Detail Dialogs](#phase-3b-dialogs)
- [Phase 3c: Element Architecture Refactoring](#phase-3c-element-arch)
- [Phase 3d: 🔴 SVG Link Visualization](#phase-3d-svg-links)
- [Phase 3e: 🔴 Adaptive Detail Display](#phase-3e-adaptive)
- [Phase 3f: 🟡 Element Collection Architecture & LinkML Slot Inheritance](#phase-3f-collections)
- [Phase 3g: Element Type Centralization & Generic Collections](#phase-3g-registry)
- [Phase 3h: selectedElement Simplification & Generic Tree Types](#phase-3h-tree)
- [Phase 3i: Recent Enhancements](#phase-3i)
- [Phase 4: Documentation Structure](#phase-4-docs)
- [Phase 5: Collections Store Elements & Data-Driven Rendering](#phase-5-elements)
- [Phase 6: 🔒 Architectural Enforcement](#phase-6-enforcement)
- [Phase 6.4: DTO/Data Architecture Cleanup](#phase-64-dto-cleanup)
- [Phase 6.5: Complete View/Model Separation](#phase-65-view-model-separation)
- [Phase 7: Element.getDetailData() Implementation](#phase-7-getdetaildata)
- [Phase 8: DetailPanel Refactoring](#phase-8-detailpanel)

---

## Phase 1: Foundation (Basic Layout & Navigation)

**Completed**: October 2025

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

<a id="phase-2-rich-details"></a>
## Phase 2: Rich Details & Interactive Navigation

**Completed**: October 2025

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

<a id="phase-3a-dual-panel"></a>
## Phase 3a: Flexible Dual-Panel System

**Completed**: October 2025

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

<a id="phase-3b-dialogs"></a>
## Phase 3b: 🔴 Multiple Detail Dialogs

**Completed**: October 2025
**Importance**: High - enables simultaneous element comparison, key UX innovation

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

<a id="phase-3c-element-arch"></a>
## Phase 3c: Element Architecture Refactoring

**Completed**: October 2025

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

<a id="phase-3d-svg-links"></a>
## Phase 3d: 🔴 SVG Link Visualization

**Completed**: October 2025
**Importance**: High - visual relationship display is core value proposition

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

<a id="phase-3e-adaptive"></a>
## Phase 3e: 🔴 Adaptive Detail Display

**Completed**: October 2025
**Importance**: High - major UX improvement enabling responsive layouts

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

<a id="phase-3f-collections"></a>
## Phase 3f: 🟡 Element Collection Architecture & LinkML Slot Inheritance

**Completed**: October 2025
**Importance**: Medium - improved architecture and correctly displays LinkML inheritance

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

<a id="phase-3g-registry"></a>
## Phase 3g: Element Type Centralization & Generic Collections

**Completed**: October 2025
**Importance**: Low - internal architecture improvement

### Key Features
- **ElementRegistry**: Centralized metadata for all element types (classes, enums, slots, variables)
  - Single source of truth for colors, labels, icons, relationship types
  - Type-safe `ElementTypeId` and `RelationshipTypeId` unions
  - Eliminates hard-coded type checks scattered throughout codebase
- **Generic Collections Architecture**: Collections stored in `Map<ElementTypeId, ElementCollection>`
  - App.tsx uses generic collection lookups instead of type-specific if/else
  - LinkOverlay accepts generic panel structure (Map-based)
  - ElementsPanel iterates over collections generically
- **Element Lookup Map**: `modelData.elementLookup` for name→Element mapping
  - Eliminates duck typing (checking if name ends with "Enum")
  - Fast lookups across all element types
- **Relationship Constraints**: `validPairs` in RELATIONSHIP_TYPES defines source/target rules
  - Example: `property` relationship valid for class→class and class→enum
  - Enables type-safe relationship rendering

### Technical Details
- Created `src/models/ElementRegistry.ts` with ELEMENT_TYPES and RELATIONSHIP_TYPES
- Simplified ModelData to only contain:
  - `collections: Map<ElementTypeId, ElementCollection>`
  - `elementLookup: Map<string, Element>`
- Removed redundant fields: classHierarchy, enums, slots, variables (now accessed via collections)
- Removed ReverseIndices interface (was never used in app)
- All ElementCollection classes implement: `getElement(name)`, `getAllElements()`, `renderItems()`
- Updated 13+ files to eliminate type-specific conditionals

### Adding New Element Types
After these changes, adding a new element type requires:
1. Add to ElementTypeId union in ElementRegistry
2. Add metadata to ELEMENT_TYPES
3. Add relationship rules to RELATIONSHIP_TYPES (if needed)
4. Create new element/collection classes
5. Add to dataLoader
6. Update SelectedElement union (TypeScript requirement)

No longer need to update:
- ✅ Hard-coded type checks in utilities
- ✅ Element lookup logic in components
- ✅ Panel structure in LinkOverlay
- ✅ Section rendering in ElementsPanel

---

<a id="phase-3h-tree"></a>
## Phase 3h: selectedElement Simplification & Generic Tree Types

**Completed**: October 2025

### Key Features
- **selectedElement Removal**: Eliminated confusing selectedElement prop from panel highlighting
  - Was highlighting first open dialog with blue background
  - Decided not worth complexity (should highlight last/topmost if anything)
  - Removed from App, ElementsPanel, Section, all renderItems methods
  - Simplified codebase by ~15 lines, removed 8 duck-typing helper functions
- **Element Prop Renaming**: Renamed selectedElement → element in dialog components
  - DetailDialog, DetailPanel, DetailPanelStack now use `element` prop
  - More accurate - they display an element, not track selection state
- **Generic Tree Types**: Created reusable tree structures
  - `Tree.ts` with TreeNode<T> interface and Tree<T> class
  - Generic operations: flatten(), find(), getLevel(), map()
  - buildTree() utility for constructing trees from flat data
- **RenderableItem Interface**: Separation of structure from presentation
  - level, hasChildren, isExpanded for structure
  - isClickable flag (true = open dialog, false = expand/collapse only)
  - badge for counts (e.g., "(103)" for variables)
- **getRenderableItems() Pattern**: Collections provide structure as data
  - EnumCollection and SlotCollection implementations complete
  - ClassCollection and VariableCollection pending
  - Enables Section.tsx to render generically without type-specific conditionals
- **DetailPanel Tests**: Comprehensive test coverage to catch regressions
  - 26 tests covering all element types (classes, enums, slots, variables)
  - Tests verify all expected sections render (attributes, slots, permissible values, etc.)
  - Catches bugs like slots disappearing from ClassElement details

### Technical Details
- Created `src/models/Tree.ts` (142 lines)
- Created `src/models/RenderableItem.ts` (36 lines)
- Created `src/test/DetailPanel.test.tsx` (304 lines, 26 tests)
- Updated ElementCollection base class with getRenderableItems() abstract method
- Removed selectedElement from: App.tsx, ElementsPanel.tsx, Section.tsx, Element.tsx
- Renamed element prop in: DetailDialog.tsx, DetailPanel.tsx, DetailPanelStack.tsx
- Fixed bug in ClassCollection recursive call (was passing removed parameter)
- Test count increased from 134 to 160 tests (26 new DetailPanel tests)

### Design Decisions
- Variable group headers will use actual ClassElement instances (not null or special type)
- Tree<T> naming chosen over Hierarchy<T> for consistency
- Collections define structure as data, not React rendering
- Section.tsx will render RenderableItems generically (in progress)

---

<a id="phase-3i"></a>
## Phase 3i: Recent Enhancements

**Completed**: October 2025

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

<a id="phase-4-docs"></a>
## Phase 4: Documentation Structure

**Completed**: October 29, 2025

### What was accomplished
- Established new documentation conventions for CLAUDE.md and PROGRESS.md
- Created DOC_CONVENTIONS.md to document structure and compliance checking
- Defined clear separation: CLAUDE.md (forward-looking), PROGRESS.md (historical)
- Established phase numbering conventions and importance markers

---

<a id="phase-5-elements"></a>
## Phase 5: Collections Store Elements & Data-Driven Rendering

**Completed**: October 30, 2025
**Importance**: Low - internal architecture improvements

### What was accomplished

**Collections Store Element Instances** (not raw data):
- All 4 collections (Class, Enum, Slot, Variable) now store Element instances in Tree<Element> structure
- Element classes own their fields directly (no wrapping of DTOs)
- ClassCollection: Tree<ClassElement> preserving parent-child hierarchy
- VariableCollection: Tree<Element> with ClassElement headers (level 0) and VariableElement children (level 1)
- EnumCollection/SlotCollection: Flat trees (all roots, alphabetically sorted)

**Data-Driven Rendering Architecture**:
- Eliminated renderItems() methods from all collections (~225 lines of duplicate JSX removed)
- Implemented getRenderableItems() in all collections - returns data, not JSX
- Created Tree.toRenderableItems() utility for converting tree to flat RenderableItem[] list
- Section.tsx uses generic ItemRenderer component for all element types
- Complete separation: Collections provide data only, view layer does all rendering

**Element Badge System**:
- Added getBadge() polymorphic method to Element base class
- ClassElement: returns variableCount (if > 0)
- EnumElement: returns permissibleValues.length
- SlotElement: returns usedByClasses.length (if > 0)
- VariableElement: no badge (returns undefined)

**Architectural Discussion: Enforcement Mechanisms Resolved**

**Question**: Why does Claude Code keep violating architectural principles despite clear documentation?

**Root cause identified** (from conversation with Claude Web):
> "The old deprecated types are still sitting there in types.ts, making it trivially easy for Claude Code to import them. As long as those concrete types exist and are importable, they'll keep getting used. It's like putting a bowl of candy on your desk and asking yourself not to eat it. **Delete the escape hatches.**"

**Key insight**: The path of least resistance was wrong - TypeScript autocomplete suggests deprecated types, making violations easier than compliance.

**Decisions made**:
1. ✅ Keep DTOs in types.ts but add ESLint ban (not move to dataLoader.ts)
2. ✅ Add ESLint rules banning DTO imports in components/**
3. ✅ Add ESLint rules banning concrete Element subclass imports in components/**
4. ✅ Add file header comments to all components
5. ✅ Use getDetailData() approach (data-focused, not renderDetails() JSX)
6. ⏳ Make element.type private (deferred - needs more research)
7. ⏳ ESLint pattern detection for element.type checks (deferred)
8. ⏳ Branded types for element.type (deferred - needs explanation)

**Implementation plan**: Phase 6 enforcement (ESLint rules) must come before DetailPanel refactor to prevent violations during implementation.

### Technical details

**Key architectural decisions**:
- Tree construction logic in Collection.fromData() - dataLoader calls fromData() with DTOs, collections build trees
- Tree.toRenderableItems() handles expansion state and level tracking
- Section.tsx renders RenderableItem[] generically with no type-specific conditionals
- ClassElement instances reused in Variable groups (same instance, just mark isClickable=false)

**Implementation steps completed**:
1. ✅ Add Tree.toRenderableItems() method (models/Tree.ts)
2. ✅ Add getBadge() method to Element base class
3. ✅ Update Collection.fromData() to build trees (all 4 collections)
4. ✅ Update dataLoader to pass classCollection to VariableCollection
5. ✅ Remove children from ClassElement (now in TreeNode<ClassElement>)
6. ✅ Implement getRenderableItems() in all collections
7. ✅ Update Section.tsx to render RenderableItems
8. ✅ Remove renderItems() methods from all collections

**Files modified**:
- src/models/Element.tsx - Element classes, Collection classes, getRenderableItems()
- src/models/Tree.ts - toRenderableItems() method
- src/components/Section.tsx - Generic ItemRenderer component
- src/utils/dataLoader.ts - Pass classCollection to VariableCollection

**Test results**:
- All 156 regression tests passing
- TypeScript typecheck passes with no errors

### Benefits achieved

- Collections don't know about React/JSX - provide data only
- Components never need to import model-specific types
- Consistent rendering across all element types
- Easy to add new element types without touching view layer
- ~225 lines of duplicate JSX rendering code eliminated

### Known issues (deferred)

- DetailPanel broken for all element types - uses duck typing on old property names
- Element classes use camelCase (permissibleValues) vs raw types use snake_case (permissible_values)
- Will be fixed when DetailPanel is refactored to use Element.getDetailData() method
- NOT blocking - DetailPanel fix is separate upcoming task (Phase 7+)

---

<a id="phase-6-enforcement"></a>
## Phase 6: 🔒 Architectural Enforcement

**Completed**: October 30, 2025
**Importance**: Medium - prevents future violations, enforces separation of concerns

### What was accomplished

**ESLint Enforcement Rules**: Build-time prevention of architectural violations in components

**Rule 1: Ban DTO imports in components/**
- Banned imports: `ClassNode`, `EnumDefinition`, `SlotDefinition`, `SelectedElement` from types.ts
- Scope: `src/components/**/*.{ts,tsx}` only (models/ and tests/ can still use)
- Error message directs developers to use Element classes and read architectural docs
- Caught existing violations: DetailPanel.tsx (3 errors), LinkOverlay.tsx (3 errors)

**Rule 2: Ban concrete Element subclass imports in components/**
- Banned imports: `ClassElement`, `EnumElement`, `SlotElement`, `VariableElement` from models/Element
- Scope: `src/components/**/*.{ts,tsx}` only
- Forces use of abstract Element class with polymorphic methods
- Caught existing violations: LinkOverlay.tsx (4 errors)

**File Header Comments**: Added to all 8 component files
- Header: "Must only import Element from models/, never concrete subclasses or DTOs"
- Serves as constant reminder and quick reference for developers

**Documentation**: Created ENFORCEMENT section in CLAUDE.md
- Documented both ESLint rules with examples
- Pre-change checklist for component modifications
- Wrong vs correct patterns with code examples
- Guidance on adding new element behavior via polymorphism

### Why this matters

**Problem**: Even with clear architectural documentation, violations kept occurring because:
- TypeScript autocomplete suggests deprecated types
- Path of least resistance was architecturally wrong
- No build-time enforcement mechanism

**Solution**: "Delete the escape hatches" - make violations structurally impossible
- ESLint rules make violations fail CI/CD
- Clear error messages guide developers to correct approach
- File headers provide immediate context

**Impact**:
- Future component changes must follow architecture (enforced by tooling)
- Developers get immediate feedback before committing code
- Reduces code review burden (automated enforcement)
- Makes correct approach easier than wrong approach

### Technical details

**ESLint configuration** (eslint.config.js):
```javascript
{
  files: ['src/components/**/*.{ts,tsx}'],
  rules: {
    'no-restricted-imports': ['error', {
      patterns: [
        {
          group: ['**/types', '../types', '../../types'],
          importNames: ['ClassNode', 'EnumDefinition', 'SlotDefinition', 'SelectedElement'],
          message: 'Components must not import DTOs. Use Element classes from models/Element instead.',
        },
        {
          group: ['**/models/Element', '../models/Element', '../../models/Element'],
          importNames: ['ClassElement', 'EnumElement', 'SlotElement', 'VariableElement'],
          message: 'Components must only import abstract Element class, not concrete subclasses.',
        },
      ],
    }],
  },
}
```

**Files modified**:
- `eslint.config.js` - Added no-restricted-imports rules
- All 8 files in `src/components/` - Added header comments
- `docs/CLAUDE.md` - Added ENFORCEMENT section with checklist

**Test results**:
- ESLint correctly catches 10 violations in DetailPanel.tsx and LinkOverlay.tsx
- TypeScript typecheck passes with no errors
- Existing violations are expected (will be fixed in future refactoring)

**Follow-up (October 30, 2025)**: Fixed LinkOverlay violations
- Removed broken `createElement()` function that was creating duplicate Element instances
- Removed all DTO imports (ClassNode, EnumDefinition, SlotDefinition, VariableSpec)
- Removed all concrete Element class imports (ClassElement, EnumElement, etc.)
- LinkOverlay now uses abstract Element interface directly from collections
- ESLint violations reduced from 10 to 3 (only DetailPanel.tsx remains)

### Phase completion

Phase 6 is **complete**. ESLint enforcement is in place and most violations are fixed.

**Remaining work** (to be done after DetailPanel refactor):
- DetailPanel.tsx still has 3 ESLint violations (expected - will be fixed during refactor)
- Consider making `element.type` private with public `getType()` method
- Skip @deprecated marks and branded types (decided against)

---


<a id="phase-64-dto-cleanup"></a>
## Phase 6.4: DTO/Data Architecture Cleanup

**Completed**: November 4, 2025

**Goal**: Eliminate unnecessary DTO layer complexity and establish clean data transformation pipeline.

**All Steps Completed**:
1. ✅ **Step 1: Foundation** - Removed `[key: string]: unknown`, renamed DTOs for clarity
2. ✅ **Step 2: Tree Capabilities** - Element base class has built-in tree support (parent, children, ancestorList, traverse)
3. ✅ **Step 3: Slot System Expansion** - ClassSlot class with inheritance (collectAllSlots, getInheritedFrom)
4. ✅ **Step 4: DataLoader Simplification** - DTO→Data transformation pipeline, initializeModelData() orchestration
5. ✅ **Step 5: On-Demand Computation** - getUsedByClasses() for EnumElement and SlotElement
6. ✅ **Step 6: Cleanup** - Deleted Tree.ts, use Element tree directly

**Final Architecture**:
```
Raw JSON (snake_case) → DTOs (*DTO interfaces)
  → [dataLoader: transforms] → Data (*Data interfaces, camelCase)
  → [initializeModelData: orchestrates] → Collections (Element instances)
```

**Key Transformations**:
- `bdchmElement` → `classId`
- `slot_usage` → `slotUsage`
- `slot_uri` → `slotUri`
- `permissible_values` → `permissibleValues`
- `*Metadata` types → `*Data` types

**Results**:
- ✅ **158 tests passing** (2 skipped)
- ✅ **Type checking passes**
- ✅ ~250 lines removed (Tree.ts deleted)
- ✅ Clear data flow: Raw JSON → DTO → Data → Elements
- ✅ On-demand computation eliminates pre-computed fields
- ✅ Slot inheritance fully modeled with ClassSlot system

**Deferred to Phase 6.5** (tracked in TASKS.md):
- Remove deprecated DTO imports from Element.tsx
- Fix `*Metadata` references in docs
- Remove JSX methods (renderPanelSection, renderDetails)
- Rename Element.tsx → Element.ts
- Step 3.2: Convert SlotCollection to 2-level tree

**Archived**: PHASE_6.4_PLAN.md → archive/PHASE_6.4_PLAN.md

---

## 2025-11-04: Phase 6.4 Step 3 - ClassSlot Implementation and Slot Inheritance

**Task**: Implement ClassSlot wrapper class and show inherited slots in UI

**Problem**:
1. Need to model slot overrides from slot_usage and inline attributes as unified ClassSlot system
2. Class detail panels didn't show inherited slots from parent classes
3. No visual distinction between attributes, slot_usage, and slot references

**Solution**:
1. Created ClassSlot class wrapping SlotElement with class-specific overrides
2. Implemented collectAllSlots() for recursive slot inheritance
3. Added getInheritedFrom() to track original defining class
4. Updated UI to show all slots with source type and inheritance info

**Changes Made**:

### 1. ClassSlot Class (Element.tsx:253-333)

New class with:
- `baseSlot: SlotElement` - Reference to global slot or synthetic slot for attributes
- `source: 'attribute' | 'slot_usage' | 'slot_reference'` - Where slot came from
- Override properties: `range?`, `required?`, `multivalued?`, `description?`
- `getEffective*()` methods with fallback chain: override → baseSlot → default
- `isOverridden()` checks if any overrides are set

### 2. ClassElement Updates

**Constructor changes (Element.tsx:389-471)**:
- Now accepts `slotCollection` parameter
- Creates ClassSlots for three sources:
  1. Attributes: Creates synthetic SlotElement, source='attribute'
  2. slot_usage: References global SlotElement with overrides, source='slot_usage'
  3. slots array: References global SlotElement, source='slot_reference'
- Stores all in `classSlots: ClassSlot[]` property

**collectAllSlots() method (Element.tsx:393-412)**:
- Recursively merges slots from this class and all parent classes
- Child slots override parent slots with same name (correct precedence)
- Returns `Record<string, ClassSlot>` with all effective slots

**getInheritedFrom() method (Element.tsx:369-385)**:
- Recursively finds the original class that defined a slot
- Returns empty string if slot is direct (not inherited)
- Used for UI display of inheritance chain

### 3. UI Changes (Element.tsx:553-592)

**Unified slot display in getDetailData()**:
- Replaced 3 separate sections (Attributes, Slot Usage, Referenced Slots)
- Single "Slots (includes inherited)" section showing all slots
- Table columns: Name | Source | Range | Required | Multivalued | Description

**Source column shows**:
- "Attribute" - inline attribute definition
- "Slot Override" - from slot_usage
- "Slot Reference" - from slots array
- Inheritance suffix: "(from Entity)" for inherited slots

Example: Participant class shows `id` slot as "Slot Reference (from Entity)"

### 4. Test Updates

**DetailPanel test (src/test/DetailPanel.test.tsx)**:
- Updated createMockSlotCollection() to provide testSlot and usedSlot
- Consolidated 3 separate slot section tests into single unified test
- Verifies all slot types appear in unified table

**Other test files**:
- Updated 4 test files to pass SlotCollection to ClassElement constructor
- All tests pass with new constructor signature

**Results**:
- ✅ **158 tests passing** (2 skipped)
- ✅ **Type checking passes**
- ✅ Inherited slots visible in UI with clear source indication
- ✅ Slot override system properly modeled

**Design Decisions**:

1. **ClassSlot uses direct properties**: `range`, `required` not `rangeOverride`, `requiredOverride`
   - Cleaner API: `slot.getEffectiveRange()` vs `slot.rangeOverride ?? slot.baseSlot.range`
   - Original values accessible via `baseSlot` reference

2. **Source tracking**: Three distinct sources clearly labeled in UI
   - Users can distinguish inline attributes from global slot references
   - Overrides clearly marked as "Slot Override"

3. **Inheritance display**: Combined into Source column for compact layout
   - Before: separate "Inherited From" column
   - After: "Slot Reference (from Entity)" in Source column

4. **No synthetic slots for production**: Tests provide proper SlotCollection
   - Inheritance works through parent's ClassSlots, not synthetic creation
   - collectAllSlots() recursively pulls from parent classes

**Impact**: Completes Phase 6.4 Step 3.1 and 3.3. Step 3.2 (2-level SlotCollection) deferred.

**Next Steps**:
- Phase 6.4 Step 4.2: Collection orchestration function (minor cleanup)
- Phase 6.5: Complete View/Model Separation
- Or further slot system work if needed

---

## 2025-11-03: Phase 6.4 Step 6 - Delete Tree.ts and Use Element Tree Directly

**Task**: Eliminate Tree/TreeNode wrapper classes and use Element.children directly

**Problem**: Collections were building TreeNode wrappers around Elements, then passing them to Tree class, which duplicated the tree structure already present in Element.parent/Element.children. This added complexity and memory overhead for no benefit.

**Solution**:
1. Added `toRenderableItems()` method to Element base class (moved from Tree class)
2. Updated all Collection classes to store Element[] roots instead of Tree instances
3. Collections now call element.toRenderableItems() directly
4. Deleted src/models/Tree.ts entirely

**Changes Made**:

### 1. Element.toRenderableItems() Method

**File**: `src/models/Element.tsx:154-192`

Added method to Element base class:
```typescript
toRenderableItems(
  expandedItems: Set<string>,
  getIsClickable?: (element: Element, level: number) => boolean,
  level: number = 0
): RenderableItem[] {
  const items: RenderableItem[] = [];
  const hasChildren = this.children.length > 0;
  const isExpanded = expandedItems.has(this.name);
  const isClickable = getIsClickable ? getIsClickable(this, level) : true;

  items.push({
    id: `${this.type}-${this.name}`,
    element: this,
    level,
    hasChildren,
    isExpanded,
    isClickable,
    badge: this.getBadge()
  });

  // Only traverse children if expanded
  if (isExpanded) {
    this.children.forEach(child => {
      items.push(...child.toRenderableItems(expandedItems, getIsClickable, level + 1));
    });
  }

  return items;
}
```

**Logic**:
- Recursively builds flat RenderableItem[] from tree structure
- Respects expansion state (collapsed nodes don't show children)
- Supports optional getIsClickable callback for custom clickability logic
- Uses Element.children for traversal

### 2. EnumCollection & SlotCollection Updates

**Files**:
- `src/models/Element.tsx:999-1052` (EnumCollection)
- `src/models/Element.tsx:1054-1117` (SlotCollection)

**Changes**:
- `private tree: Tree<EnumElement>` → `private roots: EnumElement[]`
- `constructor(tree: Tree<EnumElement>)` → `constructor(roots: EnumElement[])`
- `fromData()`: Removed TreeNode wrapper creation, directly created Element array
- `getElement()`: Changed from `tree.find()` to `roots.find()`
- `getAllElements()`: Changed from `tree.flatten()` to `return this.roots`
- `getRenderableItems()`: Loop over roots calling `root.toRenderableItems()`
- `getLabel()`: Changed from `tree.roots.length` to `this.roots.length`

### 3. ClassCollection Updates

**File**: `src/models/Element.tsx:1119-1236`

**Changes**:
- `private tree: Tree` → `private roots: ClassElement[]`
- `constructor(tree: Tree)` → `constructor(roots: ClassElement[])`
- Removed newConstructor() stub (obsolete)
- `fromData()`: Deleted TreeNode wrapper creation (lines 1177-1198 removed)
- `getElement()`: Implemented tree search using Element.children recursion
- `getAllElements()`: Uses `root.traverse()` to flatten tree
- `getRootElements()`: Simply returns `this.roots`
- `getDefaultExpansion()`: Works with Element instead of TreeNode
- `getRenderableItems()`: Loop over roots calling `root.toRenderableItems()`

**fromData() simplification**: After wiring Element.parent/Element.children and sorting (lines 1146-1168), directly returns `new ClassCollection(roots)` - no more TreeNode wrapper creation.

### 4. VariableCollection Updates

**File**: `src/models/Element.tsx:1238-1361`

**Changes**:
- `private tree: Tree<Element>` → `private roots: ClassElement[]` + `private groupedByClass: Map<string, VariableElement[]>`
- Constructor signature changed to accept roots, groupedByClass, and variables arrays
- `fromData()`: Removed TreeNode wrapper creation (lines 1280-1306 removed)
- `getRenderableItems()`: Manually builds 2-level items array
  - ClassElement headers at level 0 (non-clickable)
  - VariableElements at level 1 (clickable, shown if parent expanded)

**Design decision**: VariableCollection doesn't modify ClassElement.children (which contain class hierarchy). Instead, it stores groupedByClass Map and builds RenderableItems on-demand in getRenderableItems().

### 5. Deleted Tree.ts

**File**: `src/models/Tree.ts` (deleted)

Removed entire file:
- TreeNode class
- Tree class (with find, flatten, toRenderableItems, map, getLevel methods)
- buildTree() function

**File**: `src/models/Element.tsx:19`
- Removed import: `import { Tree, TreeNode, buildTree } from './Tree';`

**Results**:
- ✅ **160 tests passing** (same as before)
- ✅ **Type checking passes**
- ✅ Tree.ts completely eliminated
- ✅ All Collections use Element.children directly

**Code Reduction**:
- Deleted ~225 lines (Tree.ts)
- Simplified Collection classes (removed TreeNode wrapper creation)
- Net reduction: ~250 lines of code

**Benefits**:
- Single tree representation (Element.parent/children) instead of two (Element tree + TreeNode tree)
- Reduced memory overhead (no TreeNode wrapper objects)
- Simpler mental model for developers
- Cleaner API: `root.toRenderableItems()` vs `tree.toRenderableItems()`
- Element tree capabilities available everywhere, not just in Collections

**Impact**: Completes Step 6 of Phase 6.4. Tree.ts elimination is complete.

**Next Steps**: Step 3 (Slot System Expansion) or Phase 6.5 (Complete View/Model Separation)

---

## 2025-11-03: Phase 6.4 Step 5 - Implement getUsedByClasses()

**Task**: Implement on-demand computation of "used by classes" for EnumElement and SlotElement

**Problem**: EnumElement and SlotElement detail panels should show which classes use them, but this was returning empty arrays (placeholder implementation). Phase 4 removed pre-computed reverse indices (buildReverseIndices() was never called), so this needed proper on-demand computation.

**Solution**: Implemented custom scanning logic for each element type following the plan's guidance to "avoid generic path expression abstraction".

**Changes Made**:

### 1. Global ClassCollection Reference

**File**: `src/models/Element.tsx:181-190`

Added module-level pattern (similar to existing `nameToTypeMap`):
```typescript
let globalClassCollection: ClassCollection | null = null;

export function initializeClassCollection(collection: ClassCollection): void {
  globalClassCollection = collection;
}
```

**File**: `src/utils/dataLoader.ts:11,97`
- Import `initializeClassCollection`
- Call it after creating `classCollection` to initialize global reference

### 2. EnumElement.getUsedByClasses()

**File**: `src/models/Element.tsx:549-575`

**Algorithm**:
1. Guard against uninitialized globalClassCollection
2. Iterate through all classes
3. For each class, check all attributes for `range === this.name`
4. Add class name to results (only once per class, using break)
5. Return sorted array

**Example**: EnumElement "SpecimenTypeEnum" scans all classes, finds Specimen class has attribute `specimen_type: { range: "SpecimenTypeEnum" }`, returns `["Specimen"]`

### 3. SlotElement.getUsedByClasses()

**File**: `src/models/Element.tsx:759-786`

**Algorithm**:
1. Guard against uninitialized globalClassCollection
2. Iterate through all classes
3. Check two locations:
   - `cls.slots` array: Does it include this slot name?
   - `cls.slot_usage` object: Is this slot name a key?
4. Add class name if found in either location
5. Return sorted array

**Example**: SlotElement "id" scans all classes, finds Entity has `slots: ["id", ...]`, returns `["Entity"]`

### 4. SlotElement.getBadge()

**File**: `src/models/Element.tsx:754-757`

Changed from returning undefined to returning getUsedByClasses().length:
```typescript
getBadge(): number | undefined {
  const usedByClasses = this.getUsedByClasses();
  return usedByClasses.length > 0 ? usedByClasses.length : undefined;
}
```

Now slot items in left panel show badge with count of classes using that slot.

### 5. Comprehensive Test Coverage

**File**: `src/test/getUsedByClasses.test.ts` (new file, 7 tests)

Tests cover:
- **EnumElement tests** (4 tests):
  - Finding classes that use enums in attributes
  - Returning empty array for unused enums
  - No duplicate class names when enum used multiple times

- **SlotElement tests** (3 tests):
  - Finding classes that reference slots in slots array
  - Returning empty array for unused slots
  - Finding classes that use slots in slot_usage

- **Integration test**:
  - SlotElement.getBadge() matches getUsedByClasses().length

**Test approach**: Uses real data from loadModelData() to verify actual usage relationships

**Results**:
- ✅ **160 tests passing** (was 153, +7 new tests)
- ✅ **Type checking passes**
- ✅ getUsedByClasses() sections now display in detail panels
- ✅ Slot badges show accurate counts

**Design Decisions**:

1. **Global reference pattern**: Follows existing `nameToTypeMap` pattern rather than passing ModelData through constructors
2. **Custom scanning logic**: Each element type has tailored implementation instead of generic abstraction
3. **Sorted results**: Both methods return sorted arrays for consistent display
4. **Break optimization**: EnumElement breaks after first match since we only need class name once
5. **Fallback behavior**: Returns empty array with warning if globalClassCollection not initialized (happens in unit tests)

**Impact**:
- Detail panels for enums and slots now show "Used By Classes" section with actual data
- Slot items in left panel now show badges indicating usage count
- Completes on-demand computation pattern (no pre-computed reverse indices needed)
- Completes Step 5 of Phase 6.4

**Next Steps**: Step 6 - Delete Tree.ts and use Element tree directly

---

## 2025-11-03: Phase 6.4 Step 4.4 - Wire Variables Array

**Task**: Wire VariableElement arrays into ClassElement.variables property

**Problem**: ClassElement has a `variables` property initialized to empty array with comment "// Wired later in orchestration", but the wiring was never implemented. This meant:
- `ClassElement.variables` always empty
- `variableCount` computed property always returned 0
- No way to access variables for a given class from the ClassElement instance

**Solution**: Added wiring logic in `VariableCollection.fromData()` to populate ClassElement.variables arrays after grouping variables by class.

**Changes Made**:

### 1. VariableCollection.fromData() Enhancement

**File**: `src/models/Element.tsx:1193-1199`

Added wiring block after sorting variables:
```typescript
// Wire variables array into ClassElement instances
groupedByClass.forEach((variables, className) => {
  const classElement = classCollection.getElement(className) as ClassElement | null;
  if (classElement) {
    classElement.variables = variables;
  }
});
```

**Logic**:
1. After grouping and sorting variables by class name
2. Iterate through grouped variables Map
3. Look up corresponding ClassElement in classCollection
4. Assign variables array to classElement.variables

### 2. Test Coverage

**File**: `src/test/dataLoader.test.ts:70-93`

Added comprehensive test "should wire variables array into ClassElement instances":
- Verifies variables array is defined on ClassElement
- Verifies variables array length > 0 for classes with variables
- Verifies variableCount matches variables.length
- Verifies each variable references the correct class

**Results**:
- ✅ **153 tests passing** (was 152 passing)
- ✅ **Type checking passes**
- ✅ New test validates wiring behavior
- ✅ variableCount computed property now returns correct values

**Impact**:
- ClassElement.variables properly populated during data loading
- Can now access all variables for a class: `classElement.variables`
- variableCount badge on class items now accurate
- Completes Step 4 of Phase 6.4

**Next Steps**: Step 5 - Implement getUsedByClasses() methods

---


<a id="phase-65-view-model-separation"></a>
## Phase 6.5: Complete View/Model Separation

**Completed**: November 4, 2025

**Goal**: Truly separate view from model. Components define their own data contracts, Element adapts to provide that data. Components never know about element types, ElementRegistry, or model structure.

**Core Principle**: Each component defines what data it needs with property names that make sense for that component. Element implements methods to provide that data. Components are completely ignorant of the model structure.

**All Steps Completed**:

1. ✅ **Step 1: Revert Phase 9 & Add ID System**
   - Removed failed `getType()`, `getParentName()`, `isAbstractClass()` methods
   - Made `type` protected (temporarily public during refactor)
   - Added `getId(context?: IdContext)` to Element base class
   - Added `id: string` property to all ElementCollection classes

2. ✅ **Step 2: Move field name changes to declarative mapping spec**
   - Created FIELD_MAPPINGS in types.ts with FieldMapping interface
   - Created generic transformWithMapping() function in dataLoader.ts
   - Updated all transform functions to use mapping specs
   - Result: Transformations now declarative and maintainable

3. ⏭️ **Step 3: Rename components** (SKIPPED)
   - Kept current names: Section.tsx, ElementsPanel.tsx
   - Added clear documentation at top of each file

4. ✅ **Step 4: Define component data interfaces and refactor component data access**
   - Removed dead JSX methods: `renderPanelSection()`, `renderDetails()` (not called anywhere)
   - Kept `getDetailData()` - already correct pattern in DetailPanel.tsx
   - Component model access audit confirmed Section.tsx and ElementsPanel.tsx need refactoring

5. ✅ **Step 5: Update Element methods**
   - Added: `getSectionItemData(context, level, isExpanded, isClickable, hasChildren?)`
   - Added: `toSectionItems()` for tree traversal with expansion state
   - Added: `get id()` getter for convenient ID access
   - Added: `getIndicators()` method returning badges array (implemented in ClassElement for "abstract")
   - Removed: `renderPanelSection()`, `renderDetails()`, `renderName()` (obsolete JSX)

6. ✅ **Step 6: Update Collections**
   - Added: `getSectionData(position)` returns SectionData with getItems() function
   - Kept: `getRenderableItems()` (still used internally, marked in RenderableItem.ts as internal)
   - Kept: `id` property on each collection class (added in Step 1)

7. ✅ **Step 7: Remove type coupling from components**
   - ElementsPanel: Changed `sections: ElementTypeId[]` → `sections: string[]`
   - App.tsx: Changed `leftSections/rightSections: ElementTypeId[]` → `string[]`
   - Removed all `ElementTypeId` imports from Section.tsx and ElementsPanel.tsx
   - Removed all `ELEMENT_TYPES` imports from Section.tsx and ElementsPanel.tsx
   - App.tsx builds ToggleButtonData and SectionData from ELEMENT_TYPES (one-time coupling)

8. ✅ **Step 8: Cleanup**
   - Removed obsolete JSX methods from all Element subclasses
   - Renamed Element.tsx → Element.ts (no more JSX in model layer)
   - Removed React import from Element.ts
   - Marked RenderableItem.ts as deprecated/internal
   - Fixed JSDoc comment reference (Element.tsx → Element.ts)
   - Added toggleActive/toggleInactive to ElementRegistry for Tailwind JIT compiler

9. ✅ **Step 9: Verify architectural compliance**
   - No component imports ElementTypeId (verified)
   - No component imports ELEMENT_TYPES from components (App.tsx uses it to build data)
   - No component imports ElementRegistry from components
   - All 158 tests passing
   - Type checking passes
   - Components use SectionItemData/SectionData/ToggleButtonData interfaces

10. ✅ **Step 10: Make element.type protected**
    - Changed `type` from public to `protected` in Element.ts
    - Removed TODO comment about making type protected
    - Verified no components access `element.type` directly
    - Type checking passes (no errors)
    - All 158 tests passing
    - **Result**: Complete architectural separation - view layer cannot access model type information

11. ✅ **Step 11: Optimize DetailDialog getDetailData() calls**
    - Fixed DetailDialog to call `element.getDetailData()` once instead of 3 times
    - Cached result in `detailData` variable at component top
    - Type checking passes
    - **Result**: More efficient rendering, reduced method calls

**Final Architecture**:
```typescript
// Component defines its contract
interface SectionItemData {
  id: string;                // from element.getId(context)
  displayName: string;
  badgeColor?: string;
  indicators?: Array<{ text: string; color: string }>;
  // ... all UI-focused properties
}

// Element adapts to component's needs
import type { SectionItemData } from '../components/Section';
getSectionItemData(context: 'leftPanel' | 'rightPanel'): SectionItemData { ... }
```

**Results**:
- ✅ **158 tests passing** (2 skipped)
- ✅ **Type checking passes**
- ✅ **True view/model separation achieved** - components cannot access `element.type`
- ✅ **Components only use data interfaces** - no Element method calls during render
- ✅ **Polymorphic adaptation** - Element provides data in component-specific formats

**Files Modified**:
- `src/models/Element.tsx` → `Element.ts` (no JSX, added data adapters)
- `src/components/Section.tsx` (uses SectionItemData)
- `src/components/ElementsPanel.tsx` (uses ToggleButtonData, SectionData)
- `src/components/DetailDialog.tsx` (optimized getDetailData calls)
- `src/App.tsx` (builds toggle button data, converts collections)
- `src/utils/dataLoader.ts` (declarative field mappings)
- `src/types.ts` (added FIELD_MAPPINGS)

**Deferred Work**:
- LinkOverlay refactoring to use new patterns
- Component files define their own hover handler contracts
- Step 3.2 from Phase 6.4: Convert SlotCollection to 2-level tree
- DetailBox Slots table optimization

**Impact**: This phase completes the architectural vision from CLAUDE.md. The view layer is now truly separated from the model layer, with TypeScript enforcing that components cannot know about model-specific types.

---

## Phase 7: Element.getDetailData() Implementation

**Completed**: October 31, 2025
**Importance**: High - enables data-driven detail panel rendering

### What was accomplished

**DetailData Interface**: Structured data format for element details
- `DetailData`: Contains titlebarTitle, title, subtitle, titleColor, description, sections
- `DetailSection`: Contains name, text, tableHeadings, tableContent, tableHeadingColor
- Defined in src/models/Element.tsx alongside Element classes

**Element.getDetailData() Method**: Added abstract method to Element base class
- All 4 element types implement getDetailData()
- Returns structured data, not JSX
- Uses ELEMENT_TYPES registry for colors (single source of truth)

**ClassElement.getDetailData()**: Returns comprehensive class information
- Inheritance section (if parent exists)
- Attributes section (from properties) - green table headings
- Slot Usage section (from slot_usage) - green table headings
- Referenced Slots section (from slots) - green table headings
- Variables section (from variables) - orange table headings

**EnumElement.getDetailData()**: Returns enum information
- Permissible Values section (value/description pairs)
- Used By Classes section (reverse index)

**SlotElement.getDetailData()**: Returns slot information
- Properties section (range, required, multivalued, identifier, slot_uri)
- Used By Classes section (reverse index)

**VariableElement.getDetailData()**: Returns variable information
- Properties section (mapped to, data type, unit, CURIE)

**Colored Table Headings**: Type-based visual distinction
- Green headings for attributes/slots (matching slot element type)
- Orange headings for variables (matching variable element type)
- Colors sourced from ELEMENT_TYPES registry (not hardcoded)
- White text on colored backgrounds for readability

### Technical details

**Files modified**:
- src/models/Element.tsx - Added interfaces and getDetailData() to all classes
- DetailData and DetailSection interfaces (39 lines)
- ClassElement.getDetailData() (87 lines)
- EnumElement.getDetailData() (38 lines)
- SlotElement.getDetailData() (50 lines)
- VariableElement.getDetailData() (33 lines)

**Design decisions**:
- Data-focused approach (not renderDetails() JSX method)
- Element classes own their data structure
- DetailPanel doesn't know about element types
- Easy to add new element types without touching DetailPanel
- Clear separation: Model provides data, View renders it

**Test results**:
- TypeScript typecheck passes
- All existing tests continue to pass
- Ready for DetailPanel refactor (Phase 8)

### Benefits achieved

- Element classes provide structured detail data
- Components can render details generically
- Single source of truth for all element type colors
- Table headings visually distinguish content types
- Maintainable and extensible architecture

---

<a id="phase-8-detailpanel"></a>
## Phase 8: DetailPanel Refactoring

**Completed**: October 31, 2025
**Importance**: High - fixes broken DetailPanel, completes architectural separation

### What was accomplished

**Complete DetailPanel Rewrite**: From 820 lines to 130 lines (84% reduction!)
- Removed all type-specific logic and duck typing
- Removed props: enums, slots, classes (no longer needed)
- Now renders DetailData structure generically
- No knowledge of ClassElement, EnumElement, SlotElement, or VariableElement

**Simplified Component Structure**:
```typescript
function DetailPanel({ element }: { element: Element }) {
  const data = element.getDetailData();
  // Render title, subtitle, description, sections generically
}
```

**Header Consolidation**: Eliminated duplicate headers
- Removed inner colored header from DetailPanel
- DetailDialog: Colored draggable header with title/subtitle
- DetailPanelStack: Colored outer header with title/subtitle
- Content starts directly with description (no title duplication)

**Colored Headers**: Type-based colors in outer headers
- Blue for classes, purple for enums, green for slots, orange for variables
- White text on colored backgrounds for readability
- Draggable header is now colored instead of gray
- Stacked panel headers use same colored approach

**Component Updates**:
- DetailDialog: Uses element.getDetailData() for colored draggable header
- DetailPanelStack: Already passing hideHeader={true}
- Both components show title/subtitle in outer header only

**Test Suite Rewrite**: 24 tests, all passing
- Test all 4 element types (Class, Enum, Slot, Variable)
- Verify title, subtitle, description rendering
- Verify section content (inheritance, attributes, slots, variables, etc.)
- Verify colored table headings appear correctly
- Tests use Element classes (not DTOs)

**ESLint Compliance**: All architectural violations fixed
- DetailPanel now imports only abstract Element class
- No DTO imports (ClassNode, EnumDefinition, etc.)
- No concrete Element class imports
- All component architectural rules satisfied

### Technical details

**Files modified**:
- src/components/DetailPanel.tsx - Complete rewrite (820→130 lines, 84% reduction)
- src/components/DetailDialog.tsx - Updated draggable header
- src/components/DetailPanelStack.tsx - Removed dialogWidth prop
- src/test/DetailPanel.test.tsx - Complete rewrite (24 tests)

**Code removed**:
- Duck typing functions (isEnumDefinition, isSlotDefinition, isVariableSpec)
- Type-specific rendering logic
- collectAllSlots() complexity
- PRIMITIVE_TYPES categorization
- RangeCategory type checks
- 690+ lines of type-specific code

**Design decisions**:
- Generic table rendering with optional colored headings
- renderCell() helper for future navigation link support
- Single rendering path for all element types
- hideHeader prop controls inner header visibility
- Outer headers (dialog/panel) always shown

**Test results**:
- All 24 DetailPanel tests passing
- TypeScript typecheck passes
- ESLint violations: 0 (was 3)
- Total test suite: 184 tests passing

### Benefits achieved

- DetailPanel is simple, maintainable (84% smaller)
- No component knowledge of element types
- Easy to add new element types (just implement getDetailData())
- Proper separation: models provide data, views render it
- Consistent rendering across all element types
- No visual redundancy (single colored header)
- Much cleaner, more intuitive UI

---

## Testing

**Current Coverage**: 160 tests across 9 test files (150 passing, 10 failing ⚠️)

### Test Suite Organization
- Data loading & processing (10 tests)
- Element relationships & SVG links (53 tests)
- Adaptive layout logic (23 tests)
- Duplicate detection (28 tests)
- Panel helpers & styling (16 tests)
- Component rendering (4 tests)
- DetailPanel rendering (26 tests - 10 failures to fix)

**Note**: DetailPanel tests intentionally failing - test expectations need updating to match actual rendering. This is good - failures reveal what DetailPanel actually renders and will catch future regressions.

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
