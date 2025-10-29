# CLAUDE.md - Development Tasks & Context

> **Purpose**: Document upcoming tasks and discussions needed to specify them
>
> **IMPORTANT**: Before starting work, review:
> - [README.md](README.md) - Architecture philosophy, design patterns, technical context
> - [ARCHITECTURE.md](ARCHITECTURE.md) - Key files reference to prevent duplication
> - [DOC_CONVENTIONS.md](DOC_CONVENTIONS.md) - Documentation organization conventions

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

## Tasks from Conversation

- 📖 Move documentation files to docs/ directory → Add to Quick Items
- 📖 Update DOC_CONVENTIONS.md to reference all documentation files → Add to Quick Items

---

## Quick Items

- 🪲 Clicking class brings up detail box with gray title bar saying "Variable:" and missing the slots section
  - **Root cause**: DetailPanel uses duck typing on raw model types (`'children' in element`) instead of polymorphic Element methods
  - **Proper fix**: Complete "Collections Store Elements" refactor first, then DetailPanel works with abstract Element interface
  - **Why not quick fix**: Passing `ClassNode`, `EnumDefinition`, `SlotDefinition` Maps to DetailPanel violates separation of concerns (see architectural principle above)
  - **Status**: Blocked until "Collections Store Elements" refactor complete

---

## Questions & Decisions Needed

### Boss Question: Variable Treatment for Condition Class

**Context**: My boss said that "variables" for Condition should be treated differently.

**Her explanation**:
> I think I made a mistake by calling "asthma" and "angina" variables. BMI is a variable that is a Measurement observation. We can think of BMI as a column in a spreadsheet. We wouldn't have a column for "asthma" - we would have a column for conditions with a list of mondo codes for the conditions present. This becomes more important when we are talking about the "heart failure" and "heart disease" columns. Where does one draw lines? The division of conditions into variables/columns might be ok if all we're looking at is asthma and angina, but quickly gets too hard to draw lines.

**My question**: I still don't understand. Do you? Can you try to explain?

---

## Current Phase: 🔄 Refactor Types to Separate DTOs from Domain Models

**Goal**: Fix confusion between interfaces (data shape) and classes (domain models with behavior)

**Why this is current phase**:
- Current code mixes DTO shapes with model logic (e.g., `ClassNode` has tree structure)
- Element classes just wrap interfaces instead of being the model
- Components import raw types instead of using abstract Element
- Must fix this before unifying tree structures

**Current problems**:
1. **types.ts** has both DTOs AND model logic (ClassNode has children[], variables[])
2. **Element classes** just wrap interfaces (`private data: ClassNode`) without adding value
3. **Collections** store raw interface types, not Element instances
4. **Components** import ClassNode, EnumDefinition directly from types.ts

**Target architecture**:

```typescript
// types.ts - ONLY DTOs (raw data from files/APIs)
interface ClassMetadata {  // From bdchm.metadata.json
  name: string;
  description?: string;
  is_a?: string;  // parent class name
  attributes?: Record<string, any>;
  slots?: string[];
}

interface VariableSpecRow {  // From TSV file
  bdchmElement: string;
  variableLabel: string;
  // ... other columns
}

interface ModelData {
  collections: Map<ElementTypeId, ElementCollection>;
  elementLookup: Map<string, Element>;
}

// Note: TreeNode<T> and Tree<T> already exist in models/Tree.ts with utility methods
```

```typescript
// models/Element.tsx - Classes ARE the domain model
class ClassElement extends Element {
  readonly type = 'class' as const;
  readonly name: string;
  readonly description?: string;
  readonly parent?: string;
  private properties: Map<string, Property>;
  // ... all fields that were in ClassNode, now owned by class

  constructor(metadata: ClassMetadata, variables: VariableSpecRow[]) {
    super();
    this.name = metadata.name;
    // ... initialize from DTO
  }

  // Domain methods
  getInheritanceChain(): ClassElement[] { /* ... */ }
  getRelationships(): Relationship[] { /* ... */ }
}

// Collections use Tree<Element> from models/Tree.ts
class ClassCollection {
  private tree: Tree<ClassElement>;  // Tree class from Tree.ts

  constructor(elements: ClassElement[]) {
    this.tree = buildTree(elements, e => e.name, e => e.parent);
  }
}
```

**Implementation steps**:
1. ✅ Add DTO interfaces to types.ts (SchemaMetadata, ClassMetadata, etc.) - keep existing temporarily
2. ✅ ~~Add TreeNode<T> generic interface to types.ts~~ - Already exists in models/Tree.ts
3. ⏳ Update Element classes to contain fields directly (not wrap interfaces) - **IN PROGRESS**
4. Update dataLoader to construct Element instances from DTOs
5. Update collections to store TreeNode<Element>
6. Remove old interfaces (ClassNode, EnumDefinition, etc.) from types.ts
7. Update components to never import model-specific types

**Status (commit 5e35d3e)**:
- DTOs added to types.ts with clear sections
- TreeNode<T> interface added
- Old interfaces marked @deprecated
- dataLoader updated to import DTOs from types.ts

**Next action**: Step 3 is a large refactor touching Element classes, their usage in collections, and dataLoader construction logic. Need focused approach to avoid breaking everything.

**Files to modify**:
- `src/types.ts` - Add DTOs, add TreeNode<T>, eventually remove old interfaces
- `src/models/Element.tsx` - Element classes own their fields, take DTOs in constructor
- `src/utils/dataLoader.ts` - Construct Element instances from DTOs, build TreeNode structures
- `src/components/*.tsx` - Remove imports of ClassNode, EnumDefinition, etc.

**After this completes**:
- Element classes ARE the model (not wrappers)
- Collections use TreeNode<Element> structure consistently
- Components only know about abstract Element
- Can proceed with view/model separation completion

---

## Upcoming Work

Listed in intended implementation order (top = next):

### 🔄 Collections Store Elements (Not Raw Data)

**Goal**: Complete model/view separation by making collections store Element instances instead of raw data types

**Why this matters**:
- Blocks DetailPanel bug fix (components need to use abstract Element, not raw model types)
- Critical architectural foundation - enables proper polymorphism throughout codebase

**Remaining conversions**:
1. **SlotCollection** - Convert to store SlotElement instances
2. **VariableCollection** - Convert to store VariableElement instances
3. **ClassCollection** - Convert to store ClassElement instances (tricky: currently stores ClassNode[] tree)

**Then cleanup**:
4. Pre-compute relationships - Move getRelationships() into Element constructors, store as readonly property
5. Remove createElement() factory - No longer needed once collections store Elements
6. Remove getElementName() helper - Use element.name directly (already works via polymorphism)
7. Replace categorizeRange() duck typing - Use elementLookup map instead of checking if name ends with "Enum"
8. Remove ElementData type - Once collections store Elements, this union type becomes obsolete

**After this phase completes**:
- DetailPanel can be refactored to use abstract Element interface
- Components will never need to import model-specific types
- New element types can be added without touching view layer

**Files to modify**:
- `src/models/Element.tsx`
- `src/utils/dataLoader.ts`
- `src/types.ts` (remove ElementData)

---

### 🔄 Move renderItems to Section.tsx

#### a. Complete getRenderableItems() Implementation

**Goal**: Finish converting collections from renderItems() to getRenderableItems() pattern

**Status**:
- ✅ EnumCollection done
- ✅ SlotCollection done
- ⏳ ClassCollection pending
- ⏳ VariableCollection pending

**ClassCollection challenges**:
- Currently stores ClassNode[] tree structure
- Need to flatten tree with level tracking
- Maintain expansion state handling
- Return RenderableItem[] with proper isClickable flags

**VariableCollection challenges**:
- Currently groups variables by class in renderItems()
- Need to pre-group during data load (move logic to dataLoader.ts)
- Variable group headers use actual ClassElement instances (decision made)
- Group headers: isClickable=false (expand/collapse only)
- Variables: isClickable=true (open dialog)

**Files to modify**:
- `src/models/Element.tsx` - ClassCollection and VariableCollection implementations
- `src/utils/dataLoader.ts` - Move variable grouping logic here

#### b. Update Section.tsx to Render RenderableItems

**Goal**: Remove type-specific rendering logic from Section.tsx, use generic RenderableItem rendering

**Current state**: Section.tsx calls `collection.renderItems()` which returns JSX
**Target state**: Section.tsx calls `collection.getRenderableItems()` which returns data, Section renders it

**Implementation**:
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

**Benefits**:
- Section doesn't need type-specific conditionals
- Collections define structure as data, not React rendering
- Easy to add new element types

**Files to modify**:
- `src/components/Section.tsx`
- Create new component: `src/components/ItemDisplay.tsx` (or inline in Section)

#### c. Remove renderItems() Method

**Goal**: Delete obsolete renderItems() after Section uses getRenderableItems()

**Files to modify**:
- `src/models/Element.tsx` - Remove renderItems() from all 4 collection classes

---

### ✅ 🪲 Fix DetailPanel Tests & Bug

**Status**: Blocked until "Collections Store Elements" refactor completes (currently in progress)

**What's failing**: 10/26 tests in DetailPanel.test.tsx
- Test expectations don't match actual rendered text
- Example: Expected "Class" label, actual shows "extends ParentClass"
- Example: Expected "Inherits from:", actual shows "extends"

**Action after refactor completes**:
1. Refactor DetailPanel to use abstract Element interface
2. Update test expectations to match new implementation
3. Tests will catch future regressions (like slots disappearing bug)

**Note**: Other tests are also failing - see image at docs/images/temp/dark-mode-issue.png

---

### ✨ Give Right-Side Stacked Detail Panels Same Features as Floating Dialogs

**Goal**: Feature parity between stacked panels (wide screens) and floating dialogs (narrow screens)
**Importance**: Low - minor UX polish, not a major feature

**Missing features in stacked panels**:
- TBD: Need to compare and document differences

---

### 🔄 Split Element.tsx into Separate Files

**Current state**: Element.tsx is 919 lines with 4 element classes + 4 collection classes

**Target structure** (keep element class with its collection class in same file):
- `models/Element.ts` (base Element and ElementCollection classes)
- `models/ClassElement.ts` (ClassElement + ClassCollection)
- `models/EnumElement.ts` (EnumElement + EnumCollection)
- `models/SlotElement.ts` (SlotElement + SlotCollection)
- `models/VariableElement.ts` (VariableElement + VariableCollection)
- `models/index.ts` (barrel export)

**Benefits**:
- Each element/collection pair stays together (easier to maintain)
- Smaller, more focused files
- Easier to understand each element type in isolation

---

### 🔄 Refactor App.tsx

**Current state**: App.tsx is 600+ lines, too long

**Extract logic into hooks**:
- `hooks/useModelData.ts` - Data loading
- `hooks/useDialogState.ts` - Dialog management
- `hooks/useLayoutState.ts` - Panel layout + expansion state (consolidate useExpansionState)
- Keep App.tsx focused on composition

**Additional cleanup**:
- Consolidate expansion state: Move from useExpansionState hook into statePersistence.ts
- Remove dead code: Delete evc/ecn params from statePersistence.ts (replaced by lve/rve/lce/rce)

**Files to create**:
- `src/hooks/useModelData.ts`
- `src/hooks/useDialogState.ts`
- `src/hooks/useLayoutState.ts`

**Files to modify**:
- `src/App.tsx`
- `src/utils/statePersistence.ts`

---

## Future Ideas (Unprioritized)

### 🔴 ✨ Search and Filter

**Potential importance**: High - major usability feature for exploring large schemas

**Search functionality**:
- Search bar with full-text search across all elements
- Highlight search results in tree/sections
- Quick navigation: search results open in new dialogs

**Filter controls**:
- Checkboxes for class families
- Variable count slider
- Relationship type toggles

---

### 🟡 ✨ Neighborhood Zoom

**Potential importance**: Medium - useful for focused exploration

**Focus mode**:
- Show only k-hop neighborhood around selected element
- Relationship type filters ("show only `is_a` relationships" vs "show associations")
- Breadcrumb trail showing navigation path
- "Reset to full view" button

---

### ✨ Enhanced Element Metadata Display

Show additional relationship counts in tree view:
- **Current**: Only variable count (e.g., "Condition (20)")
- **Desired**: "Condition (20 vars, 5 enums, 2 classes, 1 slot)"

---

### ✨ Custom Preset Management

User-managed presets replacing hard-coded ones:
- Save Preset button → prompts for name
- Saves current panel configuration (sections + dialogs) to localStorage
- Display saved presets in header with remove icons

---

### ✨ Advanced Overview

Multiple view modes and analytics:
- Tree view (current)
- Network view (force-directed graph for associations)
- Matrix view (class-enum usage heatmap)
- Mini-map showing current focus area
- Statistics dashboard

---

### 🔴 🪲 Fix Dark Mode Display Issues

**Goal**: Fix readability issues in dark mode
**Importance**: High - app currently unusable in dark mode
**Timeline**: Complete by end of week

**Issues from screenshot**:
- Poor contrast/readability throughout
- Need to audit all color combinations

**Files likely affected**:
- `src/index.css` - Tailwind dark mode classes
- All component files using colors

---

### 📖 Terminology Consistency

**Goal**: Use consistent terminology throughout app
**Importance**: Low - internal consistency improvement

**Problem**: Still using "Property" to denote attributes and slots

**Action needed**:
- Use "Attribute" and "Slot" consistently
- Document terminology guidelines below to prevent regression

**Terminology guidelines**:
- ✅ **Attribute** or **Slot** - NOT "Property"
- ✅ **Element** - NOT "Entity" (entity was old term)
- ✅ **Class**, **Enum**, **Slot**, **Variable** - Capitalize when referring to element types

**Terminology configuration**:
- It might be better for some people to see "<current class> is_a <base class>" and other people to see "<current class> inherits from <base class>". Allow that to be a (probably) user-configurable option.
- I don't know how software with internationalization capabilities handle this, or with configurable display themes, but we could try similar approaches.

---

### ✨ External Link Integration

**Goal**: Link prefixed IDs to external sites (OMOP, DUO, etc.)

**Implementation**:
- Use prefix data from bdchm.yaml
- Make CURIEs clickable in variable details
- Add tooltip showing full URL before clicking

---

### ✨ Feature Parity with Official Docs

Reference: https://rtiinternational.github.io/NHLBI-BDC-DMC-HM/

Missing features:
1. **Types** - Import and display linkml:types
2. **Dynamic enums** - Show which enums are dynamic
3. **LinkML Source** - Collapsible raw LinkML view
4. **Direct and Induced** - Show direct vs inherited slots
5. **Partial ERDs** - Visual relationship diagrams

---

### 📖 GitHub Issue Management

Issue: https://github.com/RTIInternational/NHLBI-BDC-DMC-HM/issues/126
- Make issue more concise
- Add subissues for specific features (ASK FIRST)

---

### ⚡ Performance Optimizations

When working with larger models or slower devices:
- **Virtualize long lists**: MeasurementObservation has 103 variables; consider react-window or react-virtual
- **Viewport culling for links**: Only render SVG links for visible elements
- **Animation library**: Consider react-spring for smoother transitions (current CSS transitions work fine)

---

## Open Architectural Questions

### Where Should Element Type Metadata Live?

**Status**: Deferred - keeping ElementRegistry.ts for now (working well)

**Current approach**:
- Separate `ElementRegistry.ts` file with:
  - `ELEMENT_TYPES` map: colors, labels, icons, pluralLabel per type
  - `RELATIONSHIP_TYPES` map: relationship metadata
  - Helper functions: `getAllElementTypeIds()`, `isValidElementType()`
- Element classes import from registry: `ELEMENT_TYPES[this.type]`

**Alternative approach**: Put metadata directly in element classes as static properties

**Tradeoffs**:
- **Current (separate registry)**: All metadata in one place, easy overview, clear separation
- **Alternative (in classes)**: Better cohesion, less indirection, but scattered across files

**Decision**: Keep current approach until there's a compelling reason to change

---

## Implementation Notes & Lessons Learned

### LinkML Metadata Structure

**Bug fix reference**: DetailView.tsx originally looked for `propDef.type` (JSON Schema convention) but LinkML metadata uses `propDef.range` for type information.

**Attribute structure in `bdchm.metadata.json`**:
```json
{
  "classes": {
    "Specimen": {
      "attributes": {
        "specimen_type": {
          "range": "SpecimenTypeEnum",
          "description": "...",
          "multivalued": false,
          "required": false
        }
      }
    }
  }
}
```

Key fields:
- `range`: The type (primitive, enum name, or class name)
- `multivalued`: Boolean indicating array vs single value
- `required`: Boolean for required attributes
- `description`: Free text

---

### Structural vs Semantic Categorization

**Current approach** (structural - safe from schema changes):
- Categorize by `range` value:
  - **Primitive**: Known set (`string`, `integer`, `float`, etc.)
  - **Enum**: Range ends with `Enum`
  - **Class**: Everything else
- Filter/toggle by entity type: class, enum, slot, variable

**DO NOT hard-code semantic categories** like "containment" vs "association" vs "activity" - these could break with schema updates.

---

### REMINDER: Semantic Insights for Future Use

The following **semantic relationship patterns** were identified during analysis and could be valuable for:
- User-facing documentation/tooltips
- Search result grouping
- Suggested exploration paths
- AI-assisted query answering

**Semantic patterns identified**:

1. **Containment/Part-of**: `parent_specimen`, `parent_container`, `part_of`
2. **Association**: `associated_participant`, `source_participant`, `performed_by`
3. **Activity/Process**: `creation_activity`, `processing_activity`, `storage_activity`
4. **Measurement**: `value_quantity`, `range_low`, `range_high`, `quantity_measure`
5. **Provenance**: `*_provenance`, `derived_from`
6. **Organization/Study**: `member_of_research_study`, `originating_site`

**Potential future features using semantic patterns**:
- "Show specimen workflow" - follow activity relationships
- "Show participant data" - trace associated_participant links
- "Explain this class" - generate natural language description using relationship semantics
- Smart search: "find containment relationships" could match `parent_*` and `part_of` patterns

**Implementation approach when ready**:
- Extract patterns from attribute names (regex/keyword matching)
- Make patterns configurable (JSON/YAML file of patterns)
- Use for suggestions/enhancements, not core functionality
- Keep structural navigation as primary interface
