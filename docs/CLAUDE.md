# CLAUDE.md - Development Principles

> **⚠️ READ THIS FILE BEFORE STARTING ANY WORK ⚠️**
>
> This file contains critical development rules that must be followed.
> For architecture and data flow, see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).
> For tasks and implementation details, see [TASKS.md](TASKS.md).

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

Components must ONLY use abstract `Element` and `ElementCollection` classes. The view layer MUST NOT know about model-specific types. If a component needs type-specific behavior, add a polymorphic method to the Element base class instead.

**Before making ANY changes to components**: Ask "Does this component need to know about specific model types?" If yes, the architecture is wrong — put the logic in the Element classes instead.

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

### UI Import Rules

For architecture details, see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

UI components (in `src/components/` and `src/hooks/`) must:
- ✅ Import from `services/DataService` (functions, types, interfaces)
- ✅ Import from other UI components (e.g., `Section.tsx`)
- ✅ Import from `utils/` (helper functions)
- ❌ **NEVER** import from `models/` (not even types — DataService re-exports needed types)
- ❌ **NEVER** import DTOs from `input_types.ts`

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

## 🔧 WORKFLOW

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
