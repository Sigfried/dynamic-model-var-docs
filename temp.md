# temp.md - Immediate Next Steps

> **Quick reference for current session work**
> - **PROGRESS.md** - Completed work for reporting (see Phase 3g for recent work)
> - **CLAUDE.md** - Architecture, philosophy, future work (see "Architectural Decision Points" section)

---

## 🚨 PAUSE: Architecture Discussion Needed (2025-01-27 Evening)

**Current situation:**
- In the middle of refactoring collections to store Element instances instead of raw data
- EnumCollection converted ✅, but added temporary adapter with `(element as any).rawData` ⚠️
- User noticed the adapter is a code smell and questioned the approach

**Critical questions raised about selectedElement:**
- See detailed analysis in **temp.md section below** and **CLAUDE.md "Architectural Decision Points"**
- Need to understand what selectedElement is really doing before continuing refactor
- May need to simplify/eliminate selectedElement concept
- May need to move renderItems view code out of model classes into Section.tsx

**Next steps:**
1. Review the questions in the "CRITICAL DECISION NEEDED" section below
2. Discuss and decide on selectedElement architecture
3. Decide whether to:
   - Continue collection refactor with temporary adapter, clean up later (Option B from discussion)
   - Fix adapter first by updating App.tsx (Option A)
   - Simplify selectedElement first, then continue (Option C)

**Updated files ready for review:**
- ✅ temp.md - This file (questions and analysis documented)
- ✅ PROGRESS.md - Phase 3g added (completed work moved out of temp.md)
- ✅ CLAUDE.md - "Architectural Decision Points" section added

---

## ✅ COMPLETED SESSIONS (moved to PROGRESS.md)

All completed work from these sessions has been documented in **PROGRESS.md Phase 3g**:
- 🌙 Autonomous Work Session (2025-01-27 Night) - Generic Collections completed
- Element Collection Refactor (2025-01-27)
- slot_usage Bug Fix (2025-01-27)
- Terminology Cleanup (entity→element) (2025-01-27)
- Element Type Registry Centralization (2025-10-27)

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

#### 3.6. Collections Store Elements, Not Raw Data 🔄 **IN PROGRESS** (2025-01-27)
**Goal**: Eliminate redundant data wrapping - collections should store Element instances, not raw data.

**Original Task 3.6 status**: ✅ **COMPLETE** (moved to PROGRESS.md)
- Simplified ModelData to only contain collections Map + elementLookup
- Updated App.tsx/LinkOverlay to use generic collections
- Tests updated

**NEW PHASE: Element Storage Refactor**

**Current problem**: Collections store raw data (EnumDefinition, ClassNode, etc.) and wrap them on-demand via createElement() factory. This is redundant - the Element instances already contain all the data.

**Progress so far (2025-01-27 evening session):**
1. ✅ Updated ElementCollection base class:
   - Changed `getElement()` return: `ElementData | null` → `Element | null`
   - Changed `getAllElements()` return: `ElementData[]` → `Element[]`
   - Changed `onSelect` callback: `(data: ElementData, type: ElementTypeId)` → `(element: Element)`

2. ✅ **EnumCollection fully converted**:
   - Changed `private enums: Map<string, EnumDefinition>` → `Map<string, EnumElement>`
   - Updated `fromData()` to wrap raw data into EnumElements immediately
   - Updated renderItems to use EnumElement and new callback signature
   - Added `get permissibleValues()` and `get rawData()` accessors to EnumElement

3. ⚠️ **Temporary fix applied** (needs cleanup):
   - Added adapter in ElementsPanel.tsx to convert Element back to raw data
   - Uses `(element as any).rawData` - bypasses type safety
   - Added `rawData` getter to EnumElement
   - **This is a code smell** - should update App.tsx to accept Elements instead

**What remains:**
1. **SlotCollection** - Convert to store SlotElement instances
2. **VariableCollection** - Convert to store VariableElement instances
3. **ClassCollection** - Convert to store ClassElement instances (tricky: currently stores ClassNode[] tree)
4. **Pre-compute relationships** - Move getRelationships() into Element constructors, store as readonly property
5. **Remove adapter** - Update App.tsx handleOpenDialog to accept Element directly
6. **Remove createElement() factory** - No longer needed once collections store Elements
7. **Remove getElementName() helper** - Use element.name directly (already works via polymorphism)
8. **Replace categorizeRange() duck typing** - Use elementLookup map instead of checking if name ends with "Enum"
9. **Remove ElementData type** - Once collections store Elements, this union type becomes obsolete

**Testing strategy:**
- Run existing unit tests after each collection conversion
- Update broken tests
- Manual browser check
- Run typecheck

---

### ✅ RESOLVED: selectedElement Questions

**Decision made (2025-01-27):**
1. ✅ Removed selectedElement highlighting from panels (was highlighting first dialog, should be last/topmost, not worth complexity)
2. ✅ Renamed selectedElement → element in dialog components (more accurate - they display an element, not track selection)
3. ✅ DetailPanel refactoring needed - added to plan below

---

### 🚨 NEXT: Move renderItems to Section.tsx with Generic Hierarchy

**Decision made (2025-01-27):**
- Move rendering from ElementCollection to Section.tsx
- Create generic Hierarchy/TreeNode types first
- Use RenderableItem interface to handle flat vs hierarchical rendering
- Variable grouping becomes part of data structure (in dataLoader)

**Implementation Plan:**

**Step 1: Create Generic Hierarchy Types**
```typescript
// models/Hierarchy.ts
interface TreeNode<T> {
  data: T;
  children: TreeNode<T>[];
  parent?: TreeNode<T>;
}

class Hierarchy<T> {
  roots: TreeNode<T>[];
  flatten(): T[];
  findByName(name: string): TreeNode<T> | null;
}
```

**Step 2: RenderableItem Interface**
```typescript
interface RenderableItem {
  id: string;
  element: Element;        // Use actual ClassElement for variable group headers
  level: number;           // 0 for root, 1+ for nested
  hasChildren?: boolean;
  isExpanded?: boolean;
  isClickable: boolean;    // false = expand/collapse only, true = open dialog
  badge?: string | number; // "(103)" for counts
}
```

**Step 3: Variable Grouping in dataLoader**
- Move grouping logic from VariableCollection.renderItems to dataLoader
- Create grouped structure during data load
- Variable group headers use the actual ClassElement (Option 2 - decided)

**Step 4: Collections Implement getRenderableItems()**
```typescript
abstract class ElementCollection {
  abstract getRenderableItems(
    expandedItems?: Set<string>
  ): RenderableItem[];
}

// EnumCollection, SlotCollection: flat lists
// ClassCollection: tree structure with level
// VariableCollection: ClassElement headers + nested VariableElements
```

**Step 5: Section.tsx Renders Generically**
```typescript
function Section() {
  const items = collection.getRenderableItems(expandedItems);

  return items.map(item => (
    <ItemDisplay
      item={item}
      onClick={item.isClickable ? () => onSelect(item.element) :
               item.hasChildren ? () => toggleExpansion(item.id) :
               undefined}
    />
  ));
}
```

**Benefits:**
- Section doesn't need type-specific logic
- Collections define structure as data, not React rendering
- Generic hierarchy types work for classes AND variable groups
- Easy to add new element types

---

### 🚨 CRITICAL DECISION NEEDED: selectedElement Confusion (ARCHIVED)

1. **Type definition mismatch:**
   ```typescript
   // types.ts - says it's a union of raw data types
   export type SelectedElement = ClassNode | EnumDefinition | SlotDefinition | VariableSpec;
   // Should just be Element instead? Or is this type even needed?
   ```

2. **Inconsistent usage - what does "selectedElement" actually mean?**
   - Sometimes it's an `Element` instance
   - Sometimes it's `{type: string, name: string}` object
   - Sometimes it's `Element + type string`
   - Sometimes it's just a name string

3. **What is it used for?**
   - NOT for hover state (there's separate `hoveredElement`)
   - Passed to DetailDialog/DetailPanel - but is that necessary?
   - When you click an element, dialog opens, but no other visual indication of "selected"
   - `handleOpenDialog` expects `element: SelectedElement` param, but could just be `Element` (or name)

4. **How does dialog state restoration work?**
   - User couldn't find code that calls handleOpenDialog when restoring from URL
   - Need to understand this better

5. **Is this necessary? (App.tsx:467)**
   ```typescript
   selectedElement={openDialogs.length > 0 ? openDialogs[0].element : undefined}
   ```
   - Seems to only pass selectedElement to ElementCollection.renderItems
   - But renderItems implementations have lots of redundant code
   - Could/should be moved to Section.tsx instead of in model classes
   - Other than tree vs list rendering (which will be abstracted), what differs between the 4 renderItems implementations?

6. **Could isSelected logic move to Section.tsx?**
   - Section would need its own logic for individual element display
   - Would eliminate view code from model classes

**Proposed simplification:**
- `selectedElement` should just contain the Element instance (or just the name, since we can do `modelData.elementLookup.get(name)`)
- Type should be `Element | undefined` instead of union of raw data types
- Move renderItems view logic out of model classes into Section.tsx

**Questions to answer before proceeding:**
1. What is the actual purpose of tracking "selected" state?
2. How does dialog restoration from URL work?
3. Can we eliminate selectedElement entirely and just use click handlers?
4. Should renderItems be in model classes at all, or should Section.tsx handle display?
5. **Should ElementRegistry metadata be combined into model classes instead of separate file?**
   - Current: Separate ElementRegistry.ts with ELEMENT_TYPES map containing colors, labels, icons
   - Alternative: Each element class (ClassElement, EnumElement, etc.) has static metadata properties
   - Where should this metadata live?

**Recommendation:** Stop current refactor, discuss and decide on selectedElement architecture first, since it affects how collections and Elements interact with the UI.

**Sub-tasks (original plan):**
1. Add lookup methods to ElementCollection:
   - `getElement(name: string): ElementData | null`
   - `getAllElements(): ElementData[]`

2. Simplify ModelData to only:
   - `collections: Map<ElementTypeId, ElementCollection>`
   - Consider integrating reverse indices into registry or making them generic

3. Enhance RELATIONSHIP_TYPES with source/target constraints:
   ```typescript
   property: {
     id: 'property',
     label: 'Property',
     color: '#8b5cf6',
     validPairs: [
       { source: 'class', target: 'class' },
       { source: 'class', target: 'enum' }
     ]
   }
   ```

4. Update App.tsx to use generic collection lookups instead of type-specific if/else

5. Update LinkOverlay to accept generic panel structure:
   ```typescript
   leftPanel: Map<ElementTypeId, ElementCollection>
   rightPanel: Map<ElementTypeId, ElementCollection>
   ```

6. Update all other components to eliminate type-specific conditionals

**After these fixes, adding a new element type should require ONLY:**
1. Add to ElementTypeId union in ElementRegistry
2. Add metadata to ELEMENT_TYPES in ElementRegistry
3. Add relationship metadata to RELATIONSHIP_TYPES (if new relationship types)
4. Create new element/collection classes
5. Add to dataLoader
6. Update SelectedElement union (unavoidable for TypeScript)

**No longer need to update:**
- ❌ ModelData structure (just add to collections Map)
- ❌ App.tsx element lookup logic (uses generic collection.getElement())
- ❌ LinkOverlay panel structure (uses generic Map)
- ❌ Type-specific if/else scattered throughout components

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
