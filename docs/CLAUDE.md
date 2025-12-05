# CLAUDE.md - Development Principles

> **⚠️ READ THIS FILE BEFORE STARTING ANY WORK ⚠️**
>
> This file contains critical architectural principles that must be followed.
> For tasks and implementation details, see [TASKS.md](TASKS.md)

---

## 🚨 CRITICAL: NEVER DESTROY UNCOMMITTED WORK 🚨

**NEVER run commands that could lose uncommitted changes:**
- ❌ `git restore <file>`, `git checkout <file>`, `git reset --hard`, `git clean -fd`

**Instead:**
1. Run `git status` and `git diff` to see what would be lost
2. Tell the user what you found
3. Suggest commands for them to run
4. Let the user decide and run the commands themselves

---

## 🚨 CRITICAL ARCHITECTURAL PRINCIPLE 🚨

**SEPARATION OF MODEL AND VIEW CONCERNS**

Components must ONLY use abstract `Element` and `ElementCollection` classes. Extract UI-focused attributes through polymorphic methods whenever conditional logic is needed. **The view layer MUST NOT know about model-specific types** like `ClassNode`, `EnumDefinition`, `SlotDefinition`, or `VariableSpec`.

**❌ WRONG** - Component knows about model types:
```typescript
// DetailPanel.tsx
function DetailPanel({ element }: { element: ClassNode | EnumDefinition | SlotDefinition }) {
  if ('children' in element) { /* handle ClassNode */ }
  if ('permissible_values' in element) { /* handle EnumDefinition */ }
}
```

**✅ CORRECT** - Component uses abstract Element:
```typescript
// DetailPanel.tsx
function DetailPanel({ element }: { element: Element }) {
  const displayInfo = element.getDisplayInfo(); // Polymorphic method
  return <div>{displayInfo.title}</div>;
}
```

**Why this matters**: We spent days refactoring because view/model concerns were mixed. Components were doing type checks on raw model data instead of using polymorphism. This violates separation of concerns and makes code brittle.

**Before making ANY changes to components**: Ask "Does this component need to know about specific model types?" If yes, the architecture is wrong - put the logic in the Element classes instead.

---

## 🔒 ARCHITECTURAL ENFORCEMENT

**ESLint Rules Enforcing Separation of Concerns**

The project includes ESLint rules that prevent architectural violations in components:

**Rule 1: Ban DTO imports in components/**
- **Banned imports**: `ClassNode`, `EnumDefinition`, `SlotDefinition`, `SelectedElement` from `types.ts`
- **Scope**: `src/components/**/*.{ts,tsx}` only
- **Why**: Components must use Element classes, not raw DTOs
- **Error message**: "Components must not import DTOs. Use Element classes from models/Element instead."

**Rule 2: Ban concrete Element subclass imports in components/**
- **Banned imports**: `ClassElement`, `EnumElement`, `SlotElement`, `VariableElement` from `models/Element`
- **Scope**: `src/components/**/*.{ts,tsx}` only
- **Why**: Components must only use abstract `Element` class with polymorphic methods
- **Error message**: "Components must only import abstract Element class, not concrete subclasses."

**Pre-Change Checklist for Component Modifications**

Before modifying any component file:

1. ✅ Read the file header comment: "Must only import Element from models/, never concrete subclasses or DTOs"
2. ✅ Check imports: `grep -n "from.*types" src/components/YourComponent.tsx`
3. ✅ Check for banned imports: `grep -n "ClassElement\|EnumElement\|SlotElement\|VariableElement" src/components/YourComponent.tsx`
4. ✅ If you need type-specific behavior, add a polymorphic method to Element base class instead
5. ✅ Run ESLint after changes: `npm run lint`

**How to Add New Element Behavior**

❌ **WRONG** - Adding type check in component:
```typescript
// Component file
if (element.type === 'class') {
  // class-specific rendering
}
```

✅ **CORRECT** - Adding polymorphic method:
```typescript
// models/Element.tsx - Add to Element base class
abstract getDisplayInfo(): { title: string; color: string };

// Implement in each subclass
class ClassElement extends Element {
  getDisplayInfo() {
    return { title: this.name, color: 'blue' };
  }
}

// Component uses polymorphism
const info = element.getDisplayInfo();
```

---

## ⚠️ Additional Principles

### DTOs vs Domain Models vs DataService

**Current Architecture** (being refactored):
- **DTOs** (in `types.ts`): Raw data shapes from external sources (JSON files, APIs)
- **Domain Models** (in `models/`): Classes with behavior and encapsulation
- **DataService** (in `services/`): Abstraction layer between UI and models
- **Pattern**: DTOs → Domain Models → DataService → UI Components
- **Flow**: DTOs flow through dataLoader → collections construct domain models → DataService provides API → UI components consume

**Planned Architecture Improvements** (see TASKS.md and [archive/ELEMENT_MERGE_ANALYSIS.md](docs/archive/ELEMENT_MERGE_ANALYSIS.md)):

1. **types.ts → import_types.ts** ✅ COMPLETED (Phase 1, Step 2)
   - Renamed to clarify these are DTOs for raw data transformation
   - **CRITICAL**: Should be imported ONLY by dataLoader
   - **Phase 1.5** ✅ COMPLETED: ModelData → models/ModelData.ts, transformed types → models/SchemaTypes.ts
   - import_types.ts now contains ONLY DTOs and is imported only by dataLoader, Element (for DTOs), SchemaTypes (re-export), and tests

2. **Improved Data Flow**:
   ```
   JSON/YAML files
     → dataLoader transforms raw DTOs → app-friendly data structures
     → dataLoader builds graph from transformed data
     → Element instances created from graph (reduced role)
   ```

3. **Element Architecture Changes**:
   - Reduce Element subclass code (most should retire)
   - Element constructors should NOT take raw DTOs
   - Move behavior to graph queries and other layers
   - Element classes become thinner wrappers around graph data

4. **UI Type Separation**: ✅ COMPLETED (Phase 1, Step 1)
   - `ItemInfo`, `EdgeInfo` are UI types → moved to ComponentData.ts
   - Element.ts contains only model-layer types
   - DetailSection, DetailData also moved (eliminated duplicates)

**Critical Rule**: UI components (in `src/components/` and `src/hooks/`) must:
- ✅ Import from `services/DataService` (functions, types, interfaces)
- ✅ Import from other UI components (e.g., `Section.tsx`)
- ✅ Import from `utils/` (helper functions)
- ❌ **NEVER** import from `models/` (not even types - DataService re-exports needed types)
- ❌ **NEVER** import DTOs from `types.ts`

**Why this matters**:
- Complete separation of UI and model layers
- UI depends only on DataService contract
- Model layer can be refactored without touching UI
- Easy to mock DataService for testing

### Error Handling: Fail Loudly in Development

**Do NOT silently skip unexpected situations.** During development, errors should be noisy so they get fixed.

**❌ WRONG** - Silent failure:
```typescript
const element = lookup.get(id);
if (!element) return null;  // Silently swallows the problem
```

**✅ CORRECT** - Throw or use error handler:
```typescript
const element = lookup.get(id);
if (!element) {
  throw new Error(`Element not found: ${id}`);  // Or use devError() once implemented
}
```

**Why this matters**: Silent failures hide bugs. An ID lookup that fails means something is wrong upstream - we need to know about it immediately, not discover it later through mysterious UI behavior.

**Future**: Implement `devError()` utility that throws in development but logs quietly in production.

---

### Element Identity: .name vs getId()

**TL;DR:** Use `.name` for display, `getId()` for identity/comparisons.

**When to use .name:**
- ✅ Display purposes (titles, labels, sorting)

**When to use getId():**
- ✅ Identity comparisons and relationships
- ✅ Building data structures for relationships

**When to use getId(context):**
- ✅ DOM IDs that need panel-specific uniqueness

---

## 🔧 WORKFLOW

### Dev Server

**The dev server is always running at http://localhost:5173/** - never start it yourself.

### TypeScript Build Configuration

**CRITICAL**: Always use `npm run typecheck` before committing!

- `npm run typecheck` now uses `tsc -b --noEmit` (same as build)
- This catches **all** errors that would break deployment
- **Do NOT** rely on `tsc --noEmit` alone - it's less strict
- The project uses TypeScript 5.9.3 (local) with strict mode enabled

**Why this matters**: We had 46 hidden errors that only showed in `tsc -b` (build) but not in `tsc --noEmit` (old typecheck). This caused build failures in deployment that passed local typechecking.

---

## 📋 CURRENT TASK

See **[TASKS.md](TASKS.md)** for:
- Current Bugs
- Upcoming Work (ordered list)
- Future Ideas (unprioritized)
- Pending Decisions
