# Phase 6.4: Detailed Planning Document

**Date**: 2025-10-31
**Last Updated**: 2025-11-03
**Status**: 🚧 IN PROGRESS - Phase 4 partially complete

---

## Executive Summary

**Goal**: Eliminate unnecessary DTO layer and transformation complexity. DataLoader should only load and type-check; Collections should handle transformations.

**Key Problems Being Solved**:
1. ✅ DTOs (ClassDTO, EnumDTO, SlotDTO) add ceremony without clear benefit - RENAMED for clarity
2. ✅ dataLoader builds trees → Element.fromData converts back to flat → wasteful double tree-building - FIXED
3. ✅ Pre-computed fields (variableCount) when Element could compute on-demand - NOW COMPUTED
4. ✅ buildReverseIndices exists but never called → usedByClasses always empty - REMOVED
5. ✅ `[key: string]: unknown` in Metadata interfaces never used - REMOVED
6. **SlotCollection incomplete** - missing attributes (attributes ARE slots, defined inline)
7. **Slot inheritance/override system not properly modeled**
8. Property naming carries over awkward DTO names (bdchmElement, slot_usage)

**Proposed Architecture**:
```
Raw JSON → [dataLoader: load & type-check] → Metadata interfaces
  → [Collection.fromData: enrich & transform] → Domain models (Elements)
```

---

## 📊 Status Summary

### ✅ Completed

**Phase 1: Foundation**
- ✅ 1.1: Removed `[key: string]: unknown` from PropertyDefinition
- ✅ 1.2: Renamed DTOs for clarity (ClassNode→ClassDTO, EnumDefinition→EnumDTO, SlotDefinition→SlotDTO)
- ✅ 1.3: ESLint rule restricting DTOs to dataLoader (already existed)

**Phase 2: Tree Capabilities**
- ✅ 2.1: Element base class has tree capabilities (parent, children, ancestorList, traverse)

**Phase 4: DataLoader Simplification (Partial)**
- ✅ 4.1: Removed buildClassHierarchy() - replaced with loadClasses()
- ✅ 4.1: Removed buildReverseIndices() (never called)
- ✅ 4.1: Removed variable counting (now computed property)
- ✅ 4.3: ClassCollection.fromData() with inline parent-child wiring
- ✅ EnumCollection/SlotCollection updated to accept Metadata instead of DTOs
- ✅ variableCount is now computed property on ClassElement

**Key Decisions Made**:
- ✅ Decision 1: Remove TreeNode generics
- ✅ Decision 2: Convert attributes → SlotElements in ClassElement constructor (not yet implemented)
- ✅ Decision 3: Element has tree capabilities built-in (parent/children properties)
- ✅ Insight 2 dependency: ClassElements can be created before SlotCollection

### 🚧 In Progress / Partially Done

- ⚠️ Collections still use Tree class internally (transition state - Phase 6 will remove)
- ⚠️ Component errors exist (pre-existing architectural issues, planned for Phase 6.5)
- ⚠️ Test failures from Phase 4 constructor changes (tests use old DTO-based constructors, need update to Metadata-based constructors)

### ❌ Not Started / Blocked

**Phase 1: Foundation**
- ❌ 1.4: Define ClassSlot class - **BLOCKED** on design

**Phase 3: Slot System Expansion**
- ❌ 3.1: Create SlotElements in ClassElement constructor - **BLOCKED** on ClassSlot design
- ❌ 3.2: Convert SlotCollection to 2-level tree - **BLOCKED** on 3.1
- ❌ 3.3: Implement collectAllSlots() - **BLOCKED** on ClassSlot design

**Phase 4: DataLoader Simplification**
- ❌ 4.2: Collection orchestration function (partially exists in dataLoader)
- ❌ 4.4: Update VariableCollection to wire variables array

**Phase 5: On-Demand Computation**
- ❌ Implement getUsedByClasses() methods (currently placeholders)

**Phase 6: Cleanup**
- ❌ Delete Tree.ts and update all references to use Element.children directly
- ❌ Move toRenderableItems() from Tree to Collections
- ❌ Remove TreeNode wrappers

---

## 🎯 Key Decisions

### Decision 1: TreeNode Generics - ✅ IMPLEMENTED
**Decision**: Remove generics - TreeNode/Tree always holds Element
**Status**: Tree still generic but Element tree capabilities implemented

### Decision 2: Attributes → SlotElements - ✅ DECIDED, ❌ NOT IMPLEMENTED
**Decision**: ClassElement constructor creates SlotElements for attributes
**Implementation**:
1. ClassElement.attributes becomes SlotElement[]
2. SlotCollection creates 2-level tree:
   - Root 0: "Reusable Slots" (from schema slots section, expanded by default)
   - Root 1+: Per-class roots (with attribute SlotElements, collapsed by default)

**Status**: Decided but not implemented - blocked on ClassSlot design

### Decision 3: Element Has Tree Capabilities - ✅ IMPLEMENTED
**Decision**: Element base class has parent/children properties
**Implementation**: Element has parent?, children[], ancestorList(), traverse()
**Status**: Implemented - Collections still use Tree internally (Phase 6 will remove)

### Insight 2: ClassSlot Class Design - ⏸️ NEEDS DESIGN
**Decision**: Use class (not interface) - allows methods like getEffectiveRange()
**Status**: Needs fleshing out before Phase 3 can proceed
**Dependency order**: ClassElements created before SlotCollection ✅ (answered yes)

---

## 📋 What's Next

### High Priority - Blocking Other Work

1. **Design ClassSlot class** (blocks Phase 3)
   - Properties: slot, source, rangeOverride, requiredOverride, multivaluedOverride, descriptionOverride
   - Methods: getEffectiveRange(), isOverridden(), ???
   - Consider: Extending SlotElement vs composition
   - Needed for: collectAllSlots() implementation

2. **Fix test failures from Phase 4**
   - Tests use old DTO-based constructors: `new EnumElement(dto)`
   - Constructors now expect Metadata: `new EnumElement(name, metadata)`
   - Affected: linkLogic.test.ts (9 failures), dataLoader.test.ts (2 failures), DetailPanel.test.tsx, duplicateDetection.test.ts, panelHelpers.test.tsx
   - Options: (a) Update test mock objects to use Metadata types, or (b) Use Collection.fromData() factories in tests

### Can Proceed Without Blockers

3. **Complete Phase 4**
   - 4.4: Wire variables array in VariableCollection

4. **Phase 5: Implement getUsedByClasses() methods**
   - EnumElement: Scan class properties for range === this.name
   - SlotElement: Scan class slots arrays
   - VariableElement: Return [this.bdchmElement]

5. **Phase 6: Delete Tree.ts and use Element tree directly**
   - Move toRenderableItems() from Tree to Collections
   - Remove TreeNode wrappers
   - Update all Collection classes to use Element.children directly
   - Delete src/models/Tree.ts
   - **After removing renderPanelSection()/renderDetails()**: Rename Element.tsx → Element.ts (no JSX remaining)
   - Remove DTO references from Element.ts (ClassDTO, EnumDTO, SlotDTO imports)

### Completed

6. ✅ **Rename DTOs** (ClassNode → ClassDTO, EnumDefinition → EnumDTO, SlotDefinition → SlotDTO)

---

## 🔶 Open Questions (Need Decisions)

### High Priority

**Q1: ClassSlot class design - full specification**
- Confirmed: Class (not interface)
- Needs: Complete property list and method signatures
- Properties so far: slot, source, rangeOverride, requiredOverride, multivaluedOverride, descriptionOverride
- Methods: getEffectiveRange(), isOverridden(), ???
- **Blocking**: Phase 3 implementation

[sg] do we need rangeOverride, etc.? why not just range, etc.?
     the original values are still there in the slot, right?

**Q2: How to group lists for readability?**
- Current: Tree.toRenderableItems() creates collapsible trees
- Question: Should we reconsider grouping strategy across all collections?

[sg] let's evaluate ... altnernatives? pros/cons?

- Related: Should Tree have traverse() method for depth-first flattening?

[sg] Tree is being deleted, but it could go in Element

**Q3: findInboundRefs - generic vs custom logic?**
- For enums: Need to search through class properties (no enumReferences field exists)
- Options:
  - Generic helper with path expressions: `findInboundRefs(collection, 'properties.*.range')`
  - Custom logic for each case
- Recommendation: Custom logic for now (avoid premature abstraction)

[sg] ok. add this to implementation and it can be deleted here

### Medium Priority

[None currently]

### Resolved / Answered

- ✅ TreeNode generics: Remove generics (OBSOLETE - TreeNode eliminated)
- ✅ Element ↔ TreeNode reference: OBSOLETE - TreeNode eliminated
- ✅ TreeNode.ancestorList() return type: Now Element.ancestorList() returns Element[]
- ✅ collectAllSlots() return type: Record<string, ClassSlot>
- ✅ variableCount computation: Computed property (getter)
- ✅ ClassSlot: Class preferred over interface
- ✅ Tree structure approach: Element has parent/children built-in
- ✅ Attribute name collisions: 2-level tree design naturally separates by class
- ✅ Q4 DTO renaming: COMPLETED - Use *DTO suffix (ClassDTO, EnumDTO, SlotDTO)
- ✅ Q5 Element.tsx → Element.ts: Will be done in Phase 6 after removing JSX methods

---

## 📁 Files to Modify

### Core Architecture
- ~~`src/types.ts`~~ - ✅ DTOs renamed to *DTO suffix
- ~~`.eslintrc.js`~~ - ✅ ESLint rules updated with new DTO names
- **`src/models/Tree.ts`** - DELETE entire file (Phase 6)
- `src/models/Element.tsx` - Ongoing changes:
  - ✅ Tree properties (parent, children, ancestorList, traverse)
  - ❌ Define ClassSlot class
  - ❌ Implement collectAllSlots()
  - ❌ Convert ClassElement.attributes to SlotElement[]
  - ❌ Restructure SlotCollection as 2-level tree
  - ❌ Implement getUsedByClasses() methods
- ~~`src/utils/dataLoader.ts`~~ - ✅ Simplified (Phase 4.1 complete)

### Components (Phase 6)
- Replace `tree.roots` → `collection.roots`
- Replace `treeNode.node` → `element`
- Update traversal to use `element.children` or `element.traverse()`

### Tests
- Remove tests for TreeNode/Tree classes (Phase 6)
- Add tests for Element.ancestorList(), Element.traverse()
- Add tests for new getUsedByClasses() implementations

---

## 💡 Benefits

1. **Simpler mental model**: One tree representation (not Tree + Element trees)
2. **Cleaner API**: `element.parent.name` vs `element.treeNode.parent.node.name`
3. **Fail fast**: Remove `[key: string]: unknown` → catch unexpected JSON fields
4. **Less transformation overhead**: Collections do enrichment in one pass
5. **On-demand computation**: variableCount, usedByClasses computed when needed
6. **Correct domain modeling**: SlotCollection includes attributes (attributes ARE slots)
7. **Slot inheritance modeled**: ClassSlot tracks overrides from slot_usage

---

## ⚠️ Risks and Mitigation

### Risk 1: ClassSlot design incomplete
**Impact**: Blocks Phase 3 implementation
**Mitigation**: Prioritize design discussion with user before proceeding

### Risk 2: Attribute name collisions in SlotCollection
**Impact**: Multiple classes have "id" attribute → namespace collision
**Mitigation**: 2-level tree design naturally separates (each class has own root) ✅ RESOLVED

### Risk 3: Collection creation order dependencies
**Impact**: ClassElements before SlotCollection, VariableCollection needs ClassCollection
**Mitigation**: Orchestration function manages order (Phase 4.2)

### Risk 4: Breaking changes to existing code
**Impact**: Tree.ts deletion affects all collection usage
**Mitigation**: Phased approach - keep Tree.ts until Phase 6, test incrementally

### Risk 5: Component architectural issues
**Impact**: Components access element.type (protected), element.abstract (doesn't exist)
**Mitigation**: Planned for Phase 6.5 (proper view/model separation), quick fixes for now

---

## 📝 Next Immediate Actions

1. **Fix component errors** to get build working (see "High Priority" section above)
2. **Design ClassSlot class** with user input (blocking Phase 3)
3. **Complete Phase 4** (wire variables array)
4. **Decide**: Continue with Phase 5 (on-demand computation) or Phase 6 (delete Tree.ts)?

---

## 📚 Detailed Implementation Notes

### DataLoader Role (Implemented in Phase 4.1)

DataLoader is now confined to:
- Loading raw JSON data
- Type checking against Metadata interfaces
- Minimal field name mapping (if any)
- Returning typed Metadata objects

All enrichment happens in Collection.fromData() methods.

### Collection Creation Order

Current order in dataLoader.ts:
1. EnumCollection (no dependencies)
2. SlotCollection (no dependencies currently)
3. ClassCollection (needs slot names for validation)
4. VariableCollection (needs classCollection)

Future order after Phase 3:
1. EnumCollection (no dependencies)
2. ClassCollection (creates attribute SlotElements)
3. SlotCollection (needs ClassElements for 2-level tree)
4. VariableCollection (needs classCollection)

### Tree Mixin Pattern (Implemented in Phase 2.1)

Element base class has tree capabilities built-in:
```typescript
abstract class Element {
  parent?: Element;
  children: Element[] = [];

  ancestorList(): Element[] {
    if (!this.parent) return [];
    return [this.parent, ...this.parent.ancestorList()];
  }

  traverse(fn: (el: Element) => void): void {
    fn(this);
    this.children.forEach(child => child.traverse(fn));
  }
}
```

Collections still use Tree class internally (transition state). Phase 6 will eliminate Tree.ts entirely.

### On-Demand Computation Pattern (Phase 5)

Instead of pre-computing and storing:
```typescript
// ❌ Old way
interface EnumDefinition {
  usedByClasses: string[];  // Pre-computed in buildReverseIndices()
}

// ✅ New way
class EnumElement {
  getUsedByClasses(): string[] {
    // Compute on-demand by scanning classCollection
    return this.dataModel.collections.get('class')
      .getAllElements()
      .filter(cls => Object.values(cls.attributes).some(attr => attr.range === this.name))
      .map(cls => cls.name);
  }
}
```

Benefits: No need to maintain reverse indices, always accurate, computed when needed.
