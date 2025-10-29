# Architecture Reference

> **Purpose**: Quick reference for key files, data structures, and architectural patterns to prevent duplication and confusion

---

## Key Files & What They Contain

### Data Structures

**`src/models/Tree.ts`** - Generic tree structures
- `TreeNode<T>` interface - Node with data, children, parent
- `Tree<T>` class - Tree with utility methods (flatten, find, getLevel, map)
- `buildTree<T>()` - Helper to build tree from flat data with parent references

**`src/types.ts`** - DTOs and interfaces (NO model logic)
- **DTOs** (raw data from files/APIs):
  - `SchemaMetadata`, `ClassMetadata`, `SlotMetadata`, `EnumMetadata`
  - `AttributeDefinition`, `VariableSpec`, `EnumValue`
- **Deprecated** (being replaced): `ClassNode`, `EnumDefinition`, `SlotDefinition`
- `ModelData` - Top-level data structure

### Domain Model

**`src/models/Element.tsx`** - Domain model classes (920 lines)
- `Element` - Abstract base class
- `ClassElement`, `EnumElement`, `SlotElement`, `VariableElement` - Concrete types
- `ElementCollection` - Abstract collection base
- `ClassCollection`, `EnumCollection`, `SlotCollection`, `VariableCollection` - Concrete collections
- ⚠️ **TODO**: Element classes currently wrap deprecated interfaces, need to own fields directly

**`src/models/ElementRegistry.ts`** - Element type metadata
- `ELEMENT_TYPES` - Colors, icons, labels per element type
- `RELATIONSHIP_TYPES` - Relationship metadata
- Helper functions: `getAllElementTypeIds()`, `isValidElementType()`

### Data Loading

**`src/utils/dataLoader.ts`** - Loads and parses schema/variables
- `loadModelData()` - Main entry point, returns `ModelData`
- `loadSchemaMetadata()` - Loads from bdchm.metadata.json
- `loadVariableSpecs()` - Loads from TSV file
- `buildClassHierarchy()` - Builds tree from flat class data
- `loadEnums()`, `loadSlots()` - Parse enum/slot definitions
- `buildReverseIndices()` - Create "used by" relationships

### View Components

**`src/components/DetailPanel.tsx`** - Element detail display
- ⚠️ Currently imports `ClassNode`, `EnumDefinition`, `SlotDefinition` (violates separation)
- TODO: Refactor to use abstract `Element` only

**`src/components/Section.tsx`** - Panel section renderer
- Renders one section (classes, enums, slots, or variables)
- Currently calls `collection.renderItems()` (returns JSX)
- TODO: Use `collection.getRenderableItems()` (returns data) for better separation

### State Management

**`src/utils/statePersistence.ts`** - URL/localStorage state
- Panel configuration (which sections visible)
- Open dialogs with positions/sizes
- Expansion state for tree nodes

---

## Architectural Patterns

### Separation of Model and View (**CRITICAL**)

Components MUST use abstract `Element` and `ElementCollection` classes only. Do NOT import model-specific types.

❌ **WRONG**:
```typescript
import { ClassNode, EnumDefinition } from '../types';
```

✅ **CORRECT**:
```typescript
import { Element } from '../models/Element';
```

See CLAUDE.md "🚨 CRITICAL ARCHITECTURAL PRINCIPLE" for full explanation.

### DTOs vs Domain Models

- **DTOs** (in `types.ts`): Raw data shapes from external sources
- **Domain Models** (in `models/`): Classes with behavior and encapsulation
- **Pattern**: `ClassMetadata` (DTO) → `ClassElement` (domain model)

### Tree Structures

Always use `Tree.ts` for hierarchical data:
```typescript
import { Tree, TreeNode, buildTree } from '../models/Tree';

const tree = buildTree(items, getId, getParentId);
```

Don't create custom tree structures - reuse the existing one.

---

## [PLAN] Future Documentation

Areas that need fuller documentation:

### Data Flow
- How data moves from files → DTOs → domain models → collections → components
- Transformation points and responsibilities

### Collection Architecture
- How collections manage elements (flat vs tree)
- Rendering patterns (renderItems vs getRenderableItems)
- Expansion state handling

### Relationship System
- How relationships are computed and stored
- SVG link rendering from relationship data
- Reverse indices ("used by" lists)

### State Persistence
- URL parameter encoding/decoding
- localStorage serialization
- State restoration on load

### Testing Strategy
- What to test at each layer (DTO parsing, model logic, component rendering)
- Mock strategies for data loading
- Integration test patterns
