# Phase 6.4: Detailed Planning Document

**Date**: 2025-10-31
**Last Updated**: 2025-11-04
**Status**: ✅ COMPLETE - All steps finished (Steps 1-6 done)

---

## Executive Summary

**Goal**: Eliminate unnecessary DTO layer and transformation complexity. DataLoader should only load and type-check; Collections should handle transformations.

**Key Problems Being Solved**:
1. ✅ DTOs (ClassDTO, EnumDTO, SlotDTO) add ceremony without clear benefit - RENAMED for clarity
2. ✅ dataLoader builds trees → Element.fromData converts back to flat → wasteful double tree-building - FIXED
3. ✅ Pre-computed fields (variableCount) when Element could compute on-demand - NOW COMPUTED
4. ✅ buildReverseIndices exists but never called → usedByClasses always empty - REMOVED
5. ✅ `[key: string]: unknown` in Metadata interfaces never used - REMOVED
6. ✅ SlotCollection incomplete - ClassSlot system now models attributes as slots
7. ✅ Slot inheritance/override system not properly modeled - ClassSlot + collectAllSlots() implemented
8. ✅ Property naming carries over awkward DTO names - FIXED (bdchmElement→classId, slot_usage→slotUsage, etc.)

**Implemented Architecture**:
```
Raw JSON (snake_case) → DTOs (*DTO interfaces)
  → [dataLoader: transforms] → Data (*Data interfaces, camelCase)
  → [initializeModelData: orchestrates] → Collections (Element instances)
```

---

## 📊 Status Summary

### ✅ Completed

**Step 1: Foundation**
- ✅ 1.1: Removed `[key: string]: unknown` from PropertyDefinition
- ✅ 1.2: Renamed DTOs for clarity (ClassNode→ClassDTO, EnumDefinition→EnumDTO, SlotDefinition→SlotDTO)
- ✅ 1.3: ESLint rule restricting DTOs to dataLoader (already existed)

**Step 2: Tree Capabilities**
- ✅ 2.1: Element base class has tree capabilities (parent, children, ancestorList, traverse)

**Step 4: DataLoader Simplification (Complete - 2025-11-04)**
- ✅ 4.1: Removed buildClassHierarchy() - replaced with loadClasses()
- ✅ 4.1: Removed buildReverseIndices() (never called)
- ✅ 4.1: Removed variable counting (now computed property)
- ✅ 4.2: Created initializeModelData() orchestration function in Element.tsx (2025-11-04)
- ✅ 4.2: Renamed *Metadata → *Data for constructor inputs (2025-11-04)
- ✅ 4.2: Created DTO → Data transformation functions (2025-11-04)
- ✅ 4.2: Fixed field naming: bdchmElement→classId, slot_usage→slotUsage, slot_uri→slotUri, permissible_values→permissibleValues (2025-11-04)
- ✅ 4.3: ClassCollection.fromData() with inline parent-child wiring
- ✅ 4.4: Wire variables array in VariableCollection.fromData() (2025-11-03)
- ✅ EnumCollection/SlotCollection updated to accept Data instead of DTOs
- ✅ variableCount is now computed property on ClassElement

**Step 5: On-Demand Computation (Complete)**
- ✅ 5.1: Implemented EnumElement.getUsedByClasses() (2025-11-03)
- ✅ 5.2: Implemented SlotElement.getUsedByClasses() (2025-11-03)
- ✅ 5.3: Added initializeClassCollection() for global reference (2025-11-03)
- ✅ SlotElement.getBadge() now returns getUsedByClasses() count

**Step 6: Cleanup (Complete)**
- ✅ 6.1: Added toRenderableItems() to Element base class (2025-11-03)
- ✅ 6.2: Updated EnumCollection/SlotCollection to use Element.children (2025-11-03)
- ✅ 6.3: Updated ClassCollection to use Element.children (2025-11-03)
- ✅ 6.4: Updated VariableCollection to use Element.children (2025-11-03)
- ✅ 6.5: Deleted Tree.ts and removed TreeNode wrappers (2025-11-03)
- ✅ All 160 tests passing, type checking passes

**Key Decisions Made**:
- ✅ Decision 1: Remove TreeNode generics
- ✅ Decision 2: Convert attributes → SlotElements in ClassElement constructor (not yet implemented)
- ✅ Decision 3: Element has tree capabilities built-in (parent/children properties)
- ✅ Insight 2 dependency: ClassElements can be created before SlotCollection

### ✅ All Steps Complete - Minor Cleanup Deferred

Phase 6.4 is complete. The following items have been properly deferred to Phase 6.5 (see TASKS.md):
- Remove deprecated DTO imports from Element.tsx (ClassDTO, EnumDTO, SlotDTO used in ElementData type)
- Fix references to `*Metadata` types in docs and code (should be `*Data`)
- Remove obsolete JSX methods (renderPanelSection, renderDetails)
- Rename Element.tsx → Element.ts
- **Step 3.2**: Convert SlotCollection to 2-level tree (deferred to future phase)

### ✅ Step 3: Slot System Expansion (Complete - 2025-11-04)

**Step 3.1: Create ClassSlots in ClassElement constructor** ✅
- ClassSlot class implemented with source tracking ('attribute' | 'slot_usage' | 'slot_reference')
- Constructor creates ClassSlots for attributes, slot_usage, and slots array
- Override properties and getEffective*() methods working correctly

**Step 3.3: Implement collectAllSlots()** ✅
- Recursive slot collection with inheritance
- Child slots override parent slots with same name (correct precedence)
- getInheritedFrom() tracks original defining class

**UI Enhancements** ✅
- Unified "Slots (includes inherited)" section in detail panels
- Source column shows slot type and inheritance: "Slot Reference (from Entity)"
- All tests passing (158 passing)

### ❌ Not Started (Deferred)

**Step 3.2: Convert SlotCollection to 2-level tree**
- Deferred - current flat SlotCollection sufficient for now
- Would show global slots + inline attributes from all classes

---

## 📋 What's Next

### High Priority - Blocking Other Work

None currently - all blockers resolved!

### Completed

1. ✅ **Step 4.2: Collection orchestration and DTO→Data transformation** (2025-11-04)
   - Created `initializeModelData()` standalone function in Element.tsx
   - Renamed all `*Metadata` types to `*Data` (ClassData, EnumData, SlotData)
   - Created transformation functions: transformSlotDTO(), transformEnumDTO(), transformClassDTO(), transformVariableSpecDTO()
   - Fixed field naming: `bdchmElement` → `classId`, `slot_usage` → `slotUsage`, `slot_uri` → `slotUri`, `permissible_values` → `permissibleValues`
   - Updated all Element constructors to accept `*Data` types
   - Updated all Collection.fromData() methods
   - Updated all test files to use new types and field names
   - Result: 158 tests passing, type checking passes
   - Architecture now: Raw JSON (snake_case) → DTOs → [transform] → Data (camelCase) → Elements

2. ✅ **Step 6: Delete Tree.ts and use Element tree directly** (2025-11-03)
   - Added toRenderableItems() to Element base class
   - Removed TreeNode wrappers from all Collections
   - Updated all Collection classes to use Element.children directly
   - Deleted src/models/Tree.ts
   - Result: 160 tests passing, ~250 lines of code removed
   - **Deferred**: Rename Element.tsx → Element.ts (after removing renderPanelSection()/renderDetails())
   - **Deferred**: Remove DTO references from Element.ts (ClassDTO, EnumDTO, SlotDTO imports)

1. ✅ **Step 5: Implement getUsedByClasses() methods** (2025-11-03)
   - Added module-level `globalClassCollection` variable and `initializeClassCollection()` function
   - Implemented EnumElement.getUsedByClasses(): Scans all class attributes for range === this.name
   - Implemented SlotElement.getUsedByClasses(): Scans class.slots arrays and slot_usage for this.name
   - SlotElement.getBadge() now returns getUsedByClasses().length
   - Added 7 comprehensive tests in getUsedByClasses.test.ts
   - Result: 160 tests passing (was 153)
   - Both methods return sorted arrays for consistent display

2. ✅ **Step 4.4: Wire variables array in VariableCollection** (2025-11-03)
   - Added wiring logic in VariableCollection.fromData() to populate ClassElement.variables arrays
   - Each ClassElement now has its variables array properly populated
   - variableCount computed property now works correctly
   - Added test to verify wiring: 153 tests passing (was 152)
   - Test verifies: variables array populated, variableCount accurate, variables reference correct class

2. ✅ **Fix test failures from Step 4** (2025-11-03)
   - Updated all test files to use new Metadata-based constructors
   - Fixed property access patterns (parent→parentName, properties→attributes)
   - Fixed panelHelpers.tsx to use parentName instead of parent
   - Skipped 2 tests awaiting Phase 5 getUsedByClasses() implementation
   - Result: 152 tests passing, 0 failing (was 11 failing)
   - Details logged in PROGRESS.md

3. ✅ **Rename DTOs** (ClassNode → ClassDTO, EnumDefinition → EnumDTO, SlotDefinition → SlotDTO)

---

## 🔶 Open Questions (Need Decisions)

### High Priority

[None currently - Q1 moved to implementation section below]

**Q2: How to group lists for readability?**
- **Decision deferred**: Not deciding on full grouping strategy right now
- **Immediate fix**: Move toRenderableItems() from Tree to Element base class (see TASKS.md)
- Task added to TASKS.md after "Enhanced Link Hover Information"
- Full grouping strategy redesign can wait until after Step 6 cleanup

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
- ✅ Q1 ClassSlot design: FINALIZED - Use direct properties not *Override suffix (see implementation section)
- ✅ Q3 findInboundRefs: Use custom logic for each case (avoid premature abstraction)
- ✅ Q4 DTO renaming: COMPLETED - Use *DTO suffix (ClassDTO, EnumDTO, SlotDTO)
- ✅ Q5 Element.tsx → Element.ts: Will be done in Step 6 after removing JSX methods

---

## 📁 Files to Modify

### Core Architecture
- ~~`src/types.ts`~~ - ✅ DTOs renamed to *DTO suffix
- ~~`.eslintrc.js`~~ - ✅ ESLint rules updated with new DTO names
- **`src/models/Tree.ts`** - DELETE entire file (Step 6)
- `src/models/Element.tsx` - Ongoing changes:
  - ✅ Tree properties (parent, children, ancestorList, traverse)
  - ❌ Define ClassSlot class
  - ❌ Implement collectAllSlots()
  - ❌ Convert ClassElement.attributes to SlotElement[]
  - ❌ Restructure SlotCollection as 2-level tree
  - ❌ Implement getUsedByClasses() methods
- ~~`src/utils/dataLoader.ts`~~ - ✅ Simplified (Step 4.1 complete)

### Components (Step 6)
- Replace `tree.roots` → `collection.roots`
- Replace `treeNode.node` → `element`
- Update traversal to use `element.children` or `element.traverse()`

### Tests
- Remove tests for TreeNode/Tree classes (Step 6)
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
**Impact**: Blocks Step 3 implementation
**Mitigation**: Prioritize design discussion with user before proceeding ✅ RESOLVED

### Risk 2: Attribute name collisions in SlotCollection
**Impact**: Multiple classes have "id" attribute → namespace collision
**Mitigation**: 2-level tree design naturally separates (each class has own root) ✅ RESOLVED

### Risk 3: Collection creation order dependencies
**Impact**: ClassElements before SlotCollection, VariableCollection needs ClassCollection
**Mitigation**: Orchestration function manages order (Step 4.2)

### Risk 4: Breaking changes to existing code
**Impact**: Tree.ts deletion affects all collection usage
**Mitigation**: Phased approach - keep Tree.ts until Step 6, test incrementally

### Risk 5: Component architectural issues
**Impact**: Components access element.type (protected), element.abstract (doesn't exist)
**Mitigation**: Planned for Phase 6.5 (proper view/model separation), quick fixes for now

---

## 📝 Next Immediate Actions

1. **Fix component errors** to get build working (see "High Priority" section above)
2. **Design ClassSlot class** with user input (blocking Step 3) ✅ RESOLVED
3. **Complete Step 4** (wire variables array)
4. **Decide**: Continue with Step 5 (on-demand computation) or Step 6 (delete Tree.ts)?

---

## 📚 Detailed Implementation Notes

### DataLoader Role (Implemented in Step 4.1)

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

Future order after Step 3:
1. EnumCollection (no dependencies)
2. ClassCollection (creates attribute SlotElements)
3. SlotCollection (needs ClassElements for 2-level tree)
4. VariableCollection (needs classCollection)

### Tree Mixin Pattern (Implemented in Step 2.1)

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

Collections still use Tree class internally (transition state). Step 6 will eliminate Tree.ts entirely.

### On-Demand Computation Pattern (Step 5)

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

### ClassSlot Design (Step 3)

**Purpose**: Model slot overrides from `slot_usage` and inline attributes within classes.

**Design principle**: Use direct properties (e.g., `range`, `required`) not `*Override` suffix. Original values remain accessible via `baseSlot` reference.

**Class definition**:
```typescript
class ClassSlot {
  readonly baseSlot: SlotElement;  // Reference to the reusable slot
  readonly source: 'attribute' | 'slot_usage';  // Where this slot came from

  // Override values (undefined means "use base slot value")
  readonly range?: string;
  readonly required?: boolean;
  readonly multivalued?: boolean;
  readonly description?: string;

  // Computed methods for effective values with fallback
  getEffectiveRange(): string {
    return this.range ?? this.baseSlot.range ?? 'string';
  }

  getEffectiveRequired(): boolean {
    return this.required ?? this.baseSlot.required ?? false;
  }

  getEffectiveMultivalued(): boolean {
    return this.multivalued ?? this.baseSlot.multivalued ?? false;
  }

  getEffectiveDescription(): string | undefined {
    return this.description ?? this.baseSlot.description;
  }

  isOverridden(): boolean {
    return this.range !== undefined ||
           this.required !== undefined ||
           this.multivalued !== undefined ||
           this.description !== undefined;
  }
}
```

**Usage in ClassElement**:
```typescript
class ClassElement {
  // Replace this:
  readonly attributes: Record<string, AttributeDefinition>;

  // With this:
  readonly slots: ClassSlot[];  // Both attributes and slot_usage become ClassSlots

  // Implementation in collectAllSlots()
  collectAllSlots(): Record<string, ClassSlot> {
    const slots = new Map<string, ClassSlot>();

    // Add slots from this class
    this.slots.forEach(slot => {
      slots.set(slot.baseSlot.name, slot);
    });

    // Inherit from parent, overrides take precedence
    if (this.parent) {
      const parentSlots = this.parent.collectAllSlots();
      Object.entries(parentSlots).forEach(([name, parentSlot]) => {
        if (!slots.has(name)) {
          slots.set(name, parentSlot);
        }
      });
    }

    return Object.fromEntries(slots);
  }
}
```

**Benefits**:
- Clean API: `slot.getEffectiveRange()` instead of `slot.rangeOverride ?? slot.slot.range`
- Type-safe: TypeScript enforces optional override properties
- Flexible: Easy to add more override properties later
- Inheritance-aware: `collectAllSlots()` properly handles slot inheritance and overrides
