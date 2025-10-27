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
2. **Next**: Make collection interface generic (task 3)
3. **Then**: Split Element.tsx into separate files (task 4)
4. **Finally**: Refactor App.tsx (task 5) to use cleaner model and consolidate state management

### Specific Refactoring Tasks (Do in Order)

#### 3. Make Collection Interface More Generic
**Goal**: App should work with **any** set of ElementCollections, not just the 4 we have now.

**Current problem:**
```typescript
// App.tsx and components know specific collection types
collections: {
  enums: EnumCollection;
  slots: SlotCollection;
  classes: ClassCollection;
  variables: VariableCollection;
}
```

**Desired:**
```typescript
// Generic - components iterate without knowing types
collections: ElementCollection[]
// Or:
collections: Map<ElementTypeId, ElementCollection>
```

**Benefits:**
- Components don't need to know specific element types
- Easy to add/remove element types
- Foundation for reusable architecture

#### 4. Consider Splitting Element.tsx (DO AFTER TASK 3)
**Current state**: Element.tsx is 919 lines with 4 element classes + 4 collection classes

**Options:**
  - `models/elements/Element.ts` (base)
  - `models/elements/ClassElement.ts`
  - `models/elements/EnumElement.ts`
  - `models/elements/SlotElement.ts`
  - `models/elements/VariableElement.ts`
  - `models/collections/ElementCollection.ts` (base)
  - `models/collections/ClassCollection.ts`
  - `models/collections/EnumCollection.ts`
  - `models/collections/SlotCollection.ts`
  - `models/collections/VariableCollection.ts`
  - `models/elements/index.ts` (barrel export)
  - `models/collections/index.ts` (barrel export)

**Note**: Do this AFTER task 3 so we only touch imports once.

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
