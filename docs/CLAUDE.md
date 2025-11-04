# CLAUDE.md - Development Principles

> **⚠️ READ THIS FILE BEFORE STARTING ANY WORK ⚠️**
>
> This file contains critical architectural principles that must be followed.
> For tasks and implementation details, see [TASKS.md](TASKS.md)

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

### DTOs vs Domain Models

- **DTOs** (in `types.ts`): Raw data shapes from external sources (JSON files, APIs)
- **Domain Models** (in `models/`): Classes with behavior and encapsulation
- **Pattern**: `ClassMetadata` (DTO) → `ClassElement` (domain model)
- **Rule**: DTOs flow through dataLoader → collections construct domain models → components use domain models

### Hierarchical Data

Element classes have built-in tree support via `parent` and `children` properties. Use these directly:

```typescript
// Element base class provides tree operations
element.parent         // Parent element (or null for roots)
element.children       // Child elements array
element.ancestorList   // Array of ancestors from root to this element
element.traverse()     // Depth-first traversal with callback
```

### Structural Not Semantic Categorization

- **✅ Safe approach**: Categorize by structural properties (range value: primitive/enum/class)
- **❌ Brittle approach**: Hard-code semantic categories like "containment" vs "association" vs "activity"
- **Why**: Schema changes would break semantic categorizations
- **Safe filtering**: By element type (class, enum, slot, variable)

### Config-Based Abstraction Pattern

When you have similar code repeated across multiple types, consider using **config objects** instead of imperative code.

**Example: Relationship computation (decided NOT to implement, but kept as pattern example)**

Instead of:
```typescript
// Imperative approach - lots of similar code
if (element.type === 'class' && cls.parentName === element.name) {
  incoming.subclasses.push(cls.name);
}
if (element.type === 'enum' || element.type === 'slot') {
  if (cls.attributes) {
    for (const [attrName, attrDef] of Object.entries(cls.attributes)) {
      if (attrDef.range === element.name) {
        incoming.usedByAttributes.push({ ... });
      }
    }
  }
}
```

Could use config:
```typescript
// Declarative approach - config object
const RELATIONSHIP_CONFIG = [
  {
    thisType: 'Class',
    thisProp: 'id',
    direction: 'incoming',
    otherType: 'Class',
    otherProp: 'parentId',
    label: 'has subclass',
    cardinality: 'many-1'
  },
  {
    thisType: 'Enum',
    thisProp: 'id',
    direction: 'incoming',
    otherType: 'Class',
    otherProp: (cls) => cls.classSlots.map(slot => slot.range),
    label: 'usedBy',
    cardinality: 'many-many'
  }
];

// Generic processor uses config
function computeRelationships(element, config) { ... }
```

**When to use config:**
- Many similar cases (10+) with slight variations
- Pattern is truly declarative (not hiding complex logic)
- Config would be significantly shorter than imperative code
- Need to generate documentation from relationships

**When NOT to use:**
- Only 4-5 types (current code is fine)
- Logic has complex conditionals (config becomes unreadable)
- Type safety would be lost

### Element Identity: .name vs getId()

**TL;DR:** `getId()` without context returns the same value as `.name`. Use `.name` for display, `getId()` for identity/comparisons.

**getId() signature:**
```typescript
getId(context?: 'leftPanel' | 'rightPanel' | 'detailBox'): string
```

**Behavior:**
- With context: Returns prefixed ID (e.g., `'lp-Specimen'`, `'rp-Specimen'`, `'db-Specimen'`)
- Without context: Returns `this.name` (e.g., `'Specimen'`)

**When to use .name:**
- ✅ Display purposes (titles, labels)
  ```typescript
  title: this.name
  displayName: this.name
  ```
- ✅ Sorting by display name
  ```typescript
  elements.sort((a, b) => a.name.localeCompare(b.name))
  ```

**When to use getId():**
- ✅ Identity comparisons and relationships
  ```typescript
  if (classSlot.range === thisElement.getId()) { ... }
  if (otherClass.parentName === thisElement.getId()) { ... }
  ```
- ✅ Building data structures for relationships
  ```typescript
  incoming.subclasses.push(otherClass.getId());
  className: otherClass.getId()
  ```

**When to use getId(context):**
- ✅ DOM IDs that need panel-specific uniqueness
  ```typescript
  // Currently not used - DOM IDs use ${type}-${name} pattern instead
  // Could use getId(context) if we need to distinguish same element across panels
  ```

**Special cases:**
- **parentName field**: Currently named `parentName` but stores an identifier. Could be renamed to `parentId` for clarity, but functionally equivalent since it's compared to `getId()` which returns `name`.
- **UI state keys** (expanded items, selections): Use `.name` since they're keying off display identity
  ```typescript
  expandedItems.has(this.name)
  expanded.add(element.name)
  ```

**Current pattern (post-refactoring):**
- computeIncomingRelationships: Uses `getId()` for all identity comparisons ✅
- ClassSlot.range: Now a getter that returns effective range, compared using `getId()` ✅
- RelationshipData: All type fields use `string` instead of `ElementTypeId` ✅

---

## 📋 Current Task

See **[TASKS.md](TASKS.md)** for:
- Questions & Decisions Needed
- Current Task (what to work on now)
- Upcoming Work (ordered list)
- Future Ideas (unprioritized)
