# temp.md - Immediate Next Steps

> **Quick reference for current session work**
> - **PROGRESS.md** - Completed work for reporting
> - **CLAUDE.md** - Architecture, philosophy, future work

---

## COMPLETED: Element Collection Refactor (2025-01-27)

**All Done:**
- ✅ Created EnumCollection and SlotCollection classes in Element.tsx
- ✅ Created ClassCollection with state persistence (lce/rce keys)
- ✅ Created VariableCollection with state persistence (lve/rve keys)
- ✅ Generic Section component replaces all type-specific sections
- ✅ dataLoader.ts creates all four collections
- ✅ Removed old section components (ClassSection, EnumSection, SlotSection, VariablesSection)
- ✅ Fixed variable expansion bug (left/right panels now use separate lve/rve keys)
- ✅ Hover highlighting implemented with helper function

**Git Tag**: `pre-element-collection-refactor` (safe rollback point before refactor)

---

## COMPLETED: slot_usage Bug Fix (2025-01-27)

**Fixed class slot display to properly handle LinkML inheritance:**
- ✅ Shows inherited slots from parent classes
- ✅ Shows referenced top-level slots
- ✅ Applies slot_usage refinements (e.g., narrowing range, making required)
- ✅ Added Source column showing: Inline / Slot: {name} / ← {ParentClass}
- ✅ Added ⚡ indicator for refined slots
- ✅ Links now point to refined types (e.g., MeasurementObservation not Observation)

**Example**: MeasurementObservationSet now correctly shows:
- `observations` slot with range `MeasurementObservation` (not `Observation`)
- Source: `← ObservationSet`
- ⚡ indicating slot_usage refinement applied

---

## COMPLETED: Terminology Cleanup (2025-01-27)

**Done:**
- ✅ Renamed `entity` → `element` throughout codebase (avoiding confusion with Entity model class)
  - Updated all components, utilities, and tests
  - Kept 'Entity' (capitalized) references to BDCHM model class intact
  - Removed obsolete ClassSection.test.tsx
  - All 130 tests passing, type checking passes

---

## COMPLETED: Element Type Registry Centralization (2025-10-27)

**Task 1 & 2 Done:**
- ✅ Created `src/models/ElementRegistry.ts` with centralized metadata for all element types
- ✅ Defined `ElementTypeId` and `RelationshipTypeId` types for type safety
- ✅ Moved all hardcoded colors, labels, icons into registry
- ✅ Updated Element.tsx to use `ElementTypeId` instead of string unions
- ✅ Updated all 4 ElementCollection classes (Enum, Slot, Class, Variable) to use registry
- ✅ Updated panelHelpers.tsx to use registry for header colors
- ✅ Preserved exact original colors (bg-blue-700, etc.) with dark mode variants
- ✅ All 135 tests passing, TypeScript compiles cleanly

**Files Created:**
- `src/models/ElementRegistry.ts` - Central registry with ELEMENT_TYPES and RELATIONSHIP_TYPES

**Files Modified:**
- `src/models/Element.tsx` - All element/collection classes now use ElementTypeId
- `src/utils/panelHelpers.tsx` - Uses registry for getHeaderColor()
- `src/test/panelHelpers.test.tsx` - Updated tests

**Benefits Achieved:**
- Single source of truth for element type metadata
- Type-safe element type IDs throughout codebase
- Easy to modify styling globally
- Foundation for reusable architecture

**Next:**
- Continue with remaining refactoring tasks below

---

## CRITICAL: Further Background Refactoring Needed

### Problem: Element-Type-Specific Code Scattered Everywhere

**Remaining issues:**
- ~~References to `class|enum|slot|variable` string unions~~ ✅ **FIXED** (now use ElementTypeId)
- ~~Hardcoded colors, labels, icons~~ ✅ **FIXED** (now in ElementRegistry)
- Element.tsx is large (919 lines) with 4 subclasses + 4 collections
- App.tsx has gotten way too long (600+ lines)
- Expansion state managed separately from other state (useExpansionState hook vs statePersistence.ts)
- Dead code in statePersistence.ts (evc/ecn params no longer used)
- Collections still referenced by specific type instead of generic interface

### Goal: DRY Everything Into the Model Layer

**Why**:
- When LinkML schema changes (e.g., combining attributes and slots display), we only update in one place
- When persistence logic changes (e.g., consolidating expansion state), we don't have scattered updates across components
- When adding features (search, filtering, k-hop neighborhoods), we have clean interfaces to work with
- Easier to understand, debug, and test when logic is centralized in model classes

**Strategy**:
1. ~~Centralize element type metadata~~ ✅ **DONE**
2. ~~Make collection interface generic (task 3)~~ ✅ **DONE** (partial)
3. **Next**: Remove remaining hard-coded element type dependencies (task 3.5)
4. **Then**: Split Element.tsx into separate files (task 4)
5. **Finally**: Refactor App.tsx (task 5) to use cleaner model and consolidate state management

### Specific Refactoring Tasks (Do in Order)

#### 3. Make Collection Interface More Generic ✅ **DONE** (2025-10-27)
**Goal**: App should work with **any** set of ElementCollections, not just the 4 we have now.

**Completed changes:**
- Changed `ModelData.collections` from object to `Map<ElementTypeId, ElementCollection>`
- Updated `dataLoader.ts` to return collections as a Map
- Refactored `ElementsPanel` to iterate over collections generically
- Removed `SectionType` union type, replaced with `ElementTypeId` throughout
- Updated `statePersistence.ts` to use `ElementTypeId`
- Updated `App.tsx` to pass collections Map to ElementsPanel
- All 135 tests passing, TypeScript compiles cleanly

**Partial benefits achieved:**
- ✅ ElementsPanel is generic and doesn't hard-code section rendering
- ✅ Collections stored in Map for iteration
- ⚠️ **Still hard-coded in many places** - see task 3.5 below for cleanup needed

#### 3.5. Remove Remaining Hard-Coded Element Type Dependencies ✅ **DONE** (2025-01-27)
**Goal**: Actually make it easy to add/remove element types.

**Completed:**
1. ✅ **duplicateDetection.ts**: Removed `getElementType()` duck typing function
   - Updated `handleOpenDialog` in App.tsx to accept `elementType` parameter
   - Updated `ElementsPanel.onSelectElement` callback signature
   - Updated `panelHelpers` functions to accept `elementType` parameter
   - Removed tests for deleted function

2. ✅ **LinkOverlay.tsx**: Use `getAllElementTypeIds()` from ElementRegistry
   - Replaced hard-coded arrays with `getAllElementTypeIds()`
   - Updated type signatures to use `ElementTypeId`

3. ✅ **statePersistence.ts**: Added `isValidElementType()` validation helper
   - Created helper in ElementRegistry
   - Used in statePersistence for URL parameter validation

4. ✅ **App.tsx**: Removed duplicate type-to-code mapping
   - Exported `elementTypeToCode` from statePersistence.ts
   - Imported and used in App.tsx instead of inline literals

5. ✅ **SelectedElement type centralized**: Export from types.ts
   - Added to types.ts with documentation
   - Updated all 8 files to import from types.ts
   - Maintained backward compatibility via re-exports in panelHelpers and duplicateDetection

**Critical bug fixed during this task:**
- App.tsx `leftPanelData`/`rightPanelData` were checking for plural names ('classes', 'enums', 'slots', 'variables')
- But `leftSections`/`rightSections` now contain singular ElementTypeId ('class', 'enum', 'slot', 'variable')
- This caused LinkOverlay to receive empty arrays → no SVG links rendered
- Fixed by updating all `.includes()` checks to use singular names

**After these fixes, adding a new element type requires:**
1. Add to ElementTypeId union in ElementRegistry
2. Add metadata to ELEMENT_TYPES in ElementRegistry
3. Create new element/collection classes
4. Add to dataLoader
5. Update SelectedElement union (unavoidable for TypeScript)
6. Add to `elementTypeToCode` mapping in statePersistence.ts

**No longer need to update:**
- ✅ Duck typing logic in duplicateDetection (removed)
- ✅ Hard-coded lists in LinkOverlay (now uses getAllElementTypeIds)
- ✅ Validation in statePersistence (now uses isValidElementType)
- ✅ Duplicate mappings in App.tsx (now imports from statePersistence)

#### 4. Split Element.tsx into Separate Files
**Current state**: Element.tsx is 919 lines with 4 element classes + 4 collection classes

**File structure** (keep element class with its collection class in same file):
  - `models/Element.ts` (base Element and ElementCollection classes)
  - `models/ClassElement.ts` (ClassElement + ClassCollection)
  - `models/EnumElement.ts` (EnumElement + EnumCollection)
  - `models/SlotElement.ts` (SlotElement + SlotCollection)
  - `models/VariableElement.ts` (VariableElement + VariableCollection)
  - `models/index.ts` (barrel export)

**Benefits:**
  - Each element/collection pair stays together (easier to maintain)
  - Smaller, more focused files
  - Easier to understand each element type in isolation

#### 5. Refactor App.tsx (DO THIS LAST - AFTER TASKS 3-4)
- Too long (600+ lines)
- Extract logic into:
  - `hooks/useModelData.ts` - data loading
  - `hooks/useDialogState.ts` - dialog management
  - `hooks/useLayoutState.ts` - panel layout + expansion state (consolidate useExpansionState)
  - Keep App.tsx focused on composition
- **Consolidate expansion state**: Move expansion state from useExpansionState hook into statePersistence.ts
- **Remove dead code**: Delete evc/ecn params from statePersistence.ts (replaced by lve/rve/lce/rce)

---


## Additional Issues to Address (Lower Priority)

### Keep terminology accurate and consistent
  - We are still using "Property" to denote attributes and slots. We may
    still have work to do on how to present those, but we should stop
    using the term property
  - For attribute/slot vs property as well as entity vs element, we need
    clear instructions somewhere (CLAUDE.md?) so the old terms don't keep
    sneaking back in
### External Link Integration
- Link prefixed IDs to external sites (OMOP, DUO, etc.)
- Use prefix data from bdchm.yaml

### Feature Parity with Official Docs
Reference: https://rtiinternational.github.io/NHLBI-BDC-DMC-HM/

1. **Types** - Import and display linkml:types
2. **Dynamic enums** - Show which enums are dynamic
3. **LinkML Source** - Collapsible raw LinkML view
4. **Direct and Induced** - Show direct vs inherited slots
5. **Partial ERDs** - Visual relationship diagrams

### GitHub Issue Management
Issue: https://github.com/RTIInternational/NHLBI-BDC-DMC-HM/issues/126
- Make issue more concise
- Add subissues for specific features (ASK FIRST)
