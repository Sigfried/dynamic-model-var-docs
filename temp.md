# temp.md - Immediate Next Steps

> **Quick reference for current session work**
> - **PROGRESS.md** - Completed work for reporting
> - **CLAUDE.md** - Architecture, philosophy, future work

---

## NEXT SESSION: Complete Element Collection Refactor

### Current State (2025-01-24)

**What's Done:**
- ✅ Created EnumCollection and SlotCollection classes in Element.tsx
- ✅ Generic Section component replaces EnumSection and SlotSection
- ✅ dataLoader.ts creates collections (no longer in components)
- ✅ App.tsx passes collections to ElementsPanel
- ✅ Hover highlighting implemented with helper function

**Git Tag**: `pre-element-collection-refactor` (safe rollback point)

**What's Left:**
1. Implement ClassCollection with state persistence (lce/rce keys)
2. Implement VariableCollection with state persistence (lve/rve keys)
3. Remove old section components (ClassSection, EnumSection, SlotSection, VariablesSection)

---

## CRITICAL: Further Background Refactoring Needed

### Problem: Element-Type-Specific Code Scattered Everywhere

**Current issues:**
- References to `class|enum|slot|variable` all over the codebase
- References to `enumCollection|slotCollection` and other type-specific things
- App.tsx has gotten way too long
- types.ts has definitions that should be in model classes
- PropertyDefinition should be in Slot class (or Class for now)
- Relationship type and targetType values need centralization
- Making MORE type-specific code even while refactoring

### Goal: DRY Everything Into the Model Layer

**Why**: This app is getting pretty good. Element types may change, but might also want to use it for **completely different model navigation apps**. Need to make it reusable.

**Strategy**: Sequester as much element-type-specific logic as possible to Element.tsx and subclasses

### Specific Refactoring Tasks

#### 1. Move Types from types.ts to Model Classes
- `PropertyDefinition` → belongs in Slot class (conceptually) or Class (for now)
- `Relationship` → belongs in Element base class
- `Relationship.type` and `Relationship.targetType` → should get values from central registry
- Review what's still useful in types.ts, move to appropriate model classes

#### 2. Consider Splitting Element.tsx
- File is getting large with 4 subclasses + collections
- Options:
  - `models/elements/Element.ts` (base)
  - `models/elements/ClassElement.ts`
  - `models/elements/EnumElement.ts`
  - `models/elements/SlotElement.ts`
  - `models/elements/VariableElement.ts`
  - `models/collections/ElementCollection.ts` (base)
  - `models/collections/ClassCollection.ts`
  - etc.

#### 3. Centralize Element Type Registry
Create a central place for element type metadata instead of hardcoding strings everywhere:

```typescript
// models/ElementRegistry.ts
export const ELEMENT_TYPES = {
  CLASS: { id: 'class', label: 'C', color: 'blue', ... },
  ENUM: { id: 'enum', label: 'E', color: 'purple', ... },
  SLOT: { id: 'slot', label: 'S', color: 'green', ... },
  VARIABLE: { id: 'variable', label: 'V', color: 'orange', ... }
} as const;
```

Then reference it everywhere instead of hardcoding.

#### 4. Refactor App.tsx
- Too long (600+ lines)
- Extract logic into:
  - `hooks/useModelData.ts` - data loading
  - `hooks/useDialogState.ts` - dialog management
  - `hooks/useLayoutState.ts` - panel layout persistence
  - Keep App.tsx focused on composition

#### 5. Make Collection Interface More Generic
The app should work with **any** set of ElementCollections, not just the 4 we have now:

```typescript
// Instead of:
collections: { enums: EnumCollection; slots: SlotCollection; }

// More generic:
collections: ElementCollection[]

// Or:
collections: Map<string, ElementCollection>
```

Then components iterate over collections without knowing types.

---

## After Background Refactoring: Resume Feature Work

### 1. Hover Highlighting for Links
**Status**: ✅ COMPLETED (2025-01-24)
- Hover over element → highlights all its links
- Links change from 20% → 100% opacity + stroke width
- Helper function (not hook) for DRY event handlers

### 2. Slots vs Attributes Terminology
**Problem**: Confusing terminology, slots not visible in class detail

**Solutions**:
- Change "Properties" → "Slots" everywhere
- Show both reusable slots AND attributes in class detail dialog
- Indicate source: "Inline" vs "Slot: id" (with link to slot definition)

### 3. Variable State Bug Fix
**Current bug**: Both left and right panels share 'evc' key for variable expansion
**Fix**: Use lve/rve (left/right variable expansion) keys based on panel position
**Implementation**: ClassCollection and VariableCollection will handle this

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
