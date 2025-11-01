# Phase 6.4: Detailed Planning Document

**Date**: 2025-10-31
**Status**: 🎯 PLANNING - Gathering requirements and design decisions

This document captures insights, decisions, and implementation plans for Phase 6.4.

---

## Executive Summary

**Goal**: Eliminate unnecessary DTO layer and transformation complexity. DataLoader should only load and type-check; Collections should handle transformations.

**Key Problems Being Solved**:
1. DTOs (ClassNode, EnumDefinition, SlotDefinition) add ceremony without clear benefit
2. dataLoader builds trees → Element.fromData converts back to flat → wasteful double tree-building
3. Pre-computed fields (variableCount) when Element could compute on-demand
4. buildReverseIndices exists but never called → usedByClasses always empty
5. `[key: string]: unknown` in Metadata interfaces never used
6. **SlotCollection incomplete** - missing attributes (attributes ARE slots, defined inline)
7. **Slot inheritance/override system not properly modeled**
8. Property naming carries over awkward DTO names (bdchmElement, slot_usage)

**Proposed Architecture**:
```
Raw JSON → [dataLoader: load & type-check] → Metadata interfaces
  → [Collection.fromData: enrich & transform] → Domain models (Elements)
```

---

## Design Decisions Needed

### Decision 1: TreeNode Generics

**Current state**: TreeNode is generic (`TreeNode<T>`) but being converted to non-generic class in exploratory code

**Context**: VariableCollection needs to mix ClassElement (headers) with VariableElement (children) in same tree

**Options**:
- **A) Remove generics** (RECOMMENDED)
  - TreeNode always holds Element
  - Pros: Simpler, matches reality (VariableCollection mixes types)
  - Cons: Less type-safe (can't enforce "this tree only has ClassElements")

- **B) Keep generics**
  - Tree<ClassElement> vs Tree<Element>
  - Pros: More type-safe for single-type trees
  - Cons: Messy when mixing types, complex type constraints

**Recommendation**: Option A (remove generics)

**Rationale**: VariableCollection already needs mixed types. Type safety can be enforced at Collection level.

**Status**: ⏸️ Awaiting decision

---

### Decision 2: When to Convert Attributes → SlotElements

**Context**: Attributes in ClassMetadata are inline slot definitions. They conform to SlotMetadata structure and should become SlotElements.

**Key Insight**: SlotCollection should be the **union** of:
- Explicit slots from schema's `slots` section
- All attributes from all classes (converted to SlotElements)

**Rationale**: An attribute IS a slot, just defined inline on a class rather than separately.

**Options**:
- **A) In dataLoader**: Convert attributes to SlotMetadata before Element construction
  - Pros: Uniform data coming into Elements
  - Cons: dataLoader knows about domain concepts (slots)

- **B) In ClassElement constructor**: Convert on-the-fly during construction
  - Pros: Keeps dataLoader dumb, conversion happens where it's used
  - Cons: Each ClassElement converts independently, duplication

- **C) In SlotCollection.fromData()**: Extract all attributes from all classes, add to SlotCollection (RECOMMENDED)
  - Pros: SlotCollection becomes complete (all slots in one place), single conversion point
  - Cons: SlotCollection needs to know about ClassMetadata structure

**Recommendation**: Option C - SlotCollection.fromData() extracts attributes from all classes

**Implementation**:
```typescript
SlotCollection.fromData(
  slotData: Map<string, SlotMetadata>,
  classData: Map<string, ClassMetadata>  // Need class data to extract attributes
): SlotCollection {
  // 1. Convert explicit slots
  const slots = Array.from(slotData.values()).map(s => new SlotElement(s));

  // 2. Extract all attributes from all classes
  classData.forEach(classMetadata => {
    Object.entries(classMetadata.attributes || {}).forEach(([name, attrDef]) => {
      // Convert AttributeDefinition → SlotElement
      // Handle name collisions (same attribute in different classes)
    });
  });

  // 3. Build flat tree and return collection
}
```

**Open question**: How to handle attribute name collisions? (e.g., "id" attribute in multiple classes)
- Create separate SlotElements with qualified names?
- Assume same-named attributes are the same slot?
- Needs decision.

**Status**: ⏸️ Awaiting decision

---

### Decision 3: Element ↔ TreeNode Circular Reference

**Problem**:
- Element needs TreeNode reference (for ancestorList() to walk up inheritance chain)
- TreeNode needs Element reference (holds the element data)
- Circular dependency

**Options**:
- **A) Two-phase construction**: Create Elements first, then TreeNodes, then inject references
  ```typescript
  // Phase 1: Create elements
  const elements = data.map(d => new ClassElement(d, modelData));

  // Phase 2: Build tree
  const tree = buildTree(
    elements,
    (e) => e.name,           // getId
    (e) => e.parent          // getParentId
  );

  // Phase 3: Inject TreeNode refs
  tree.traverse((node) => {
    node.node.treeNode = node;  // Inject reference
  });
  ```
  - Pros: Clean separation, uses generic buildTree()
  - Cons: Three-phase construction, mutation after creation

- **B) TreeNode-first construction**: Create TreeNodes with Elements inside
  - Problem: How to pass currentTreeNode to Element constructor?
  - Seems difficult to implement

- **C) Lazy resolution**: Element has getter that finds its TreeNode in collection
  ```typescript
  class ClassElement {
    private collection: ClassCollection;  // Reference to parent collection

    get treeNode(): TreeNode {
      return this.collection.findTreeNode(this.name);
    }
  }
  ```
  - Pros: No circular reference at construction time
  - Cons: Requires collection reference, lookup overhead (can be cached)

**Status**: ⏸️ Awaiting decision

---

## Key Architectural Insights

### Insight 1: SlotCollection Should Include Attributes

**Discovery**: Current SlotCollection only contains explicit slots from schema's `slots` section

**Correct Architecture**: SlotCollection should be the union of:
- Explicit slots from schema's `slots` section
- All attributes from all classes (converted to SlotElements)

**Rationale**: An attribute IS a slot, just defined inline on a class rather than separately. They should all live in SlotCollection for:
- Consistency (one place to find all slots)
- Reusability (inherited slots don't need duplication)
- Proper modeling of domain

**Implementation Impact**:
- SlotCollection.fromData() needs access to ClassMetadata to extract attributes
- Need strategy for handling attribute name collisions
- ClassElement.properties references SlotElements from expanded SlotCollection

---

### Insight 2: ClassSlot Interface for Slot Inheritance/Overrides

**Problem**: When MeasurementObservationSet inherits `observations` slot from ObservationSet and overrides its range, we need to track:
- The base SlotElement (from SlotCollection)
- The source (inherited/attribute/direct slot)
- The overrides (range refinement from slot_usage)

**Example**:
```
ObservationSet:
  observations: Observation (multivalued)

MeasurementObservationSet (extends ObservationSet):
  slot_usage:
    observations:
      range: MeasurementObservation  # Overrides parent's range
```

**Solution**: ClassSlot interface
```typescript
interface ClassSlot {
  slot: SlotElement;           // Reference to SlotElement in SlotCollection
  source: 'inherited' | 'attribute' | 'slot';

  // Overrides from slot_usage (optional, only for inherited slots)
  rangeOverride?: string;      // e.g., 'MeasurementObservation' overrides 'Observation'
  requiredOverride?: boolean;
  multivaluedOverride?: boolean;
  descriptionOverride?: string;
  // ... other overridable properties as needed
}
```

**Usage**:
```typescript
class ClassElement {
  readonly properties: Record<string, ClassSlot>;  // or Map<string, ClassSlot>

  collectAllSlots(): Record<string, ClassSlot> {
    // 1. Walk ancestors, collect inherited slots
    const inherited = this.treeNode.ancestorList().flatMap(ancestor =>
      Object.entries(ancestor.node.properties)
    );

    // 2. Apply slot_usage overrides to inherited slots
    Object.entries(this.slot_usage || {}).forEach(([name, overrides]) => {
      if (inherited.has(name)) {
        inherited.get(name).rangeOverride = overrides.range;
        // ... apply other overrides
      }
    });

    // 3. Add attributes as ClassSlots (source: 'attribute')
    // 4. Add direct slots (source: 'slot')

    return result;
  }
}
```

**Note**: Inherited slots are NOT duplicated in SlotCollection - ClassSlot just references the same SlotElement

**Open Question**: Should ClassSlot be interface or class?
- Interface: Simpler, just data
- Class: Could have methods like `getEffectiveRange()` that considers overrides

---

### Insight 3: Tree Building Should Use Generic buildTree()

**Analysis**: Tree building happens in multiple places with similar two-pass algorithms:

**Current locations**:
1. `buildClassHierarchy()` in dataLoader - builds ClassNode tree with children[] property
2. `ClassCollection.fromData()` - converts ClassNode tree to TreeNode tree (wasteful!)
3. `VariableCollection.fromData()` - manually builds 2-level tree
4. `Tree.buildTree()` - generic utility (currently unused!)

**Algorithm comparison**: All use two-pass approach:
- Pass 1: Create all nodes in a Map (for O(1) lookup)
- Pass 2: Link parent-child relationships by looking up parent

**Why current approach is wasteful**:
```
ClassMetadata → [buildClassHierarchy] → ClassNode tree (children[] property)
  → [ClassCollection.fromData] → TreeNode<ClassElement> tree
```
Builds tree structure twice with two different tree representations!

**Recommendation**:
1. **Priority 1**: Use `Tree.buildTree()` for VariableCollection (clear win, eliminates manual tree building)
2. **Priority 2**: Simplify `buildClassHierarchy()`:
   - Rename to `enrichClassMetadata()` to clarify it doesn't build tree
   - Return flat ClassMetadata[] (with enriched data like variableCount)
   - Let ClassCollection.fromData() handle tree building via buildTree()
3. Keep enum/slot as simple flat lists (no tree building needed)

**Result**: Single tree building algorithm (`Tree.buildTree()`), less redundancy, clearer responsibilities

---

### Insight 4: Property Renaming for Domain Models

**Problem**: If we eliminate DTOs, domain models currently use DTO property naming conventions

**Rationale**: Domain models shouldn't carry over awkward DTO naming conventions from JSON schema

**Proposed Renames**:
- `bdchmElement` → `className` (on VariableElement)
  - Example: `variable.className = "MeasurementObservation"`
- `slot_usage` → `slotUsage` (on ClassElement, if it persists)
- Consider other snake_case → camelCase conversions as appropriate

**Trade-off**:
- Pro: Cleaner domain model API
- Con: Adds mapping layer between JSON and domain model
- Decision: Worth it for better code readability

---

### Insight 5: findInboundRefs Pattern for usedByClasses

**Problem**: buildReverseIndices() exists but never called, so usedByClasses always empty

**Solution**: Compute on-demand using generic pattern

**Pattern**:
```typescript
class Element {
  // Generic helper for finding inbound references
  findInboundRefs(
    fromCollection: ElementCollection,
    propPath: string  // Path to property that might reference this element
  ): string[] {
    // Find all elements in collection where element[propPath] references this.name
    return fromCollection
      .filter(e => {
        const value = e[propPath];
        if (Array.isArray(value)) {
          return value.includes(this.name);
        }
        return value === this.name;
      })
      .map(e => e.name);
  }
}
```

**Usage examples**:
```typescript
// VariableElement: Find which class uses this variable
class VariableElement {
  getUsedByClasses(): string[] {
    return [this.className];  // Simple: variable knows its class directly
  }
}

// EnumElement: Find which classes reference this enum
class EnumElement {
  getUsedByClasses(): string[] {
    // Scan class properties for range === this.name
    return this.findInboundRefs(classCollection, 'enumReferences');
  }
}

// SlotElement: Find which classes use this slot
class SlotElement {
  getUsedByClasses(): string[] {
    // Scan class slots arrays
    return this.findInboundRefs(classCollection, 'slots');
  }
}
```

**Note**: "For enums and classes i think it'll be harder" - may need custom logic for complex cases

---

## Implementation Plan (Draft)

**Order of operations** (to be refined after decisions):

### Phase 1: Foundation (independent changes)

1. **Remove [key: string]: unknown from Metadata interfaces**
   - Safe, independent change
   - Fail fast on unexpected JSON fields
   - Files: `src/types.ts`

2. **Rename Metadata → Properties interfaces**
   - ClassMetadata → ClassProperties
   - EnumMetadata → EnumProperties
   - SlotMetadata → SlotProperties
   - Keep VariableSpec (already used directly)
   - Files: `src/types.ts`, update all imports

3. **Define ClassSlot interface**
   - Add to types.ts
   - Document purpose and usage
   - Files: `src/types.ts`

### Phase 2: Tree System Refactor

4. **Resolve TreeNode generics decision** (BLOCKED on Decision 1)
   - Convert TreeNode to non-generic class (if approved)
   - TreeNode.node: Element (not T)
   - Add TreeNode.ancestorList() method
   - Add TreeNode.traverse() helper method
   - Update all Tree references to remove generics
   - Files: `src/models/Tree.ts`, all files using Tree/TreeNode

5. **Implement Element ↔ TreeNode circular reference** (BLOCKED on Decision 3)
   - Choose approach (two-phase construction recommended)
   - Add Element.treeNode property
   - Implement injection mechanism
   - Files: `src/models/Element.tsx`, Collections

### Phase 3: Slot System Expansion

6. **Expand SlotCollection to include attributes** (BLOCKED on Decision 2)
   - SlotCollection.fromData() extracts attributes from all classes
   - Convert AttributeDefinition → SlotElement
   - Handle name collisions strategy
   - Files: `src/models/Element.tsx` (SlotCollection)

7. **Implement ClassElement.collectAllSlots()**
   - Walk ancestors via treeNode.ancestorList()
   - Collect inherited slots (from ancestors' properties)
   - Convert attributes to ClassSlots (source: 'attribute')
   - Apply slot_usage overrides to inherited slots
   - Add direct slots (source: 'slot')
   - Return Record<string, ClassSlot>
   - Files: `src/models/Element.tsx` (ClassElement)

### Phase 4: DataLoader Simplification

8. **Simplify dataLoader.ts**
   - Rename buildClassHierarchy() → enrichClassMetadata()
   - Remove tree building (return flat ClassMetadata[])
   - Remove buildReverseIndices() (unused)
   - Remove DTOs (ClassNode, EnumDefinition, SlotDefinition)
   - Files: `src/utils/dataLoader.ts`, `src/types.ts`

9. **Update Collection.fromData() methods**
   - ClassCollection: Use Tree.buildTree() instead of recursive conversion
   - VariableCollection: Use Tree.buildTree() instead of manual construction
   - EnumCollection: Keep simple flat list (no changes needed)
   - SlotCollection: Include attributes extraction (from step 6)
   - Files: `src/models/Element.tsx` (all Collection classes)

### Phase 5: On-Demand Computation

10. **Implement findInboundRefs pattern**
    - Add Element.findInboundRefs() helper method
    - Add getUsedByClasses() to EnumElement, SlotElement
    - Use for on-demand usedByClasses computation
    - Files: `src/models/Element.tsx`

11. **Property renaming**
    - bdchmElement → className
    - slot_usage → slotUsage
    - Other snake_case → camelCase as needed
    - Add mapping layer in constructors
    - Files: `src/models/Element.tsx`, `src/types.ts`

### Phase 6: Cleanup

12. **Delete obsolete code**
    - Remove DTOs from types.ts (ClassNode, EnumDefinition, SlotDefinition)
    - Remove buildReverseIndices
    - Remove unused Tree methods (if any)
    - Files: `src/types.ts`, `src/utils/dataLoader.ts`

13. **Update all imports and usages**
    - Components importing DTOs
    - Tests using old types
    - Verify architectural compliance (no component imports DTOs)
    - Files: All files importing old types

14. **Documentation**
    - Update CLAUDE.md if architecture principles changed
    - Update any relevant comments
    - Files: `CLAUDE.md`, code comments

---

## Open Questions (Need Decisions)

### High Priority

1. **TreeNode.ancestorList() return type**:
   - Element[]: More convenient for most use cases
   - TreeNode[]: More flexible (can access parent links if needed)
   - **Recommendation**: TreeNode[] (more flexible, can map to Elements if needed)

2. **ClassSlot: interface or class?**:
   - Interface: Simpler, just data
   - Class: Could have methods (getEffectiveRange(), isOverridden(), etc.)
   - **Recommendation**: Start with interface, upgrade to class if methods needed

3. **collectAllSlots() return type**:
   - Record<string, ClassSlot>: Easy property access `class.properties.observations`
   - Map<string, ClassSlot>: Better for dynamic operations, harder for simple access
   - ClassSlot[]: Simpler iteration, but need lookup by name
   - **Recommendation**: Record<string, ClassSlot> (matches current usage patterns)

### Medium Priority

4. **Attribute name collisions**: If two classes have attribute "id", do we:
   - Create two separate SlotElements with qualified names (ClassName.id)?
   - Assume same-named attributes are the same slot (merge)?
   - Let SlotCollection handle deduplication (error if different definitions)?
   - **Needs investigation**: Check actual schema for collision frequency

5. **When to compute variableCount**:
   - In constructor (eager): Simple, but might compute unnecessarily
   - In getter (lazy): More efficient, but computed multiple times if no caching
   - Pre-computed in dataLoader: Couples dataLoader to domain logic
   - **Recommendation**: Getter with caching (lazy + efficient)

6. **fromData() DRYing**: Should we extract common patterns?
   - Each fromData() has unique logic (flat vs tree vs grouped)
   - Attempting to DRY might create more complexity than it saves
   - **Recommendation**: Keep separate (avoid premature abstraction)

---

## Files to Modify (Comprehensive List)

### Core Architecture
- `src/types.ts` - Rename interfaces, remove DTOs, add ClassSlot, remove index signatures
- `src/models/Tree.ts` - Remove generics, add ancestorList(), add traverse()
- `src/models/Element.tsx` - Major changes (treeNode, ClassSlot, collectAllSlots(), findInboundRefs(), all Collections)
- `src/utils/dataLoader.ts` - Drastically simplify, remove tree building and DTOs

### Components (Import Updates)
- All files importing ClassNode/EnumDefinition/SlotDefinition
- Verify no component imports DTOs (architectural compliance)

### Tests
- All test files using old types
- Tests for new functionality (collectAllSlots, ancestorList, etc.)

---

## Benefits

- **Simpler**: One set of interfaces (Properties), not two (Metadata + DTOs)
- **Faster**: No redundant tree building/flattening (single tree build with buildTree())
- **Clearer**: Transformations happen where they're used (Collections), responsibilities well-defined
- **Type-safe**: Fail fast on schema changes (remove index signatures)
- **Complete**: SlotCollection includes all slots (explicit + attributes)
- **Maintainable**: Proper slot inheritance/override modeling (ClassSlot)
- **Better names**: Domain models use appropriate property names (className not bdchmElement)
- **On-demand**: Compute expensive fields only when needed (usedByClasses via findInboundRefs)

---

## Risks and Mitigation

### Risk 1: Circular Element ↔ TreeNode references
**Mitigation**: Use two-phase construction with clear injection point

### Risk 2: Attribute name collisions in SlotCollection
**Mitigation**: Need strategy decision, possibly qualified names or error on collision

### Risk 3: Breaking changes to existing code
**Mitigation**: Comprehensive test coverage, systematic refactoring

### Risk 4: Complexity of ClassSlot system
**Mitigation**: Start simple (interface), add complexity only as needed

---

## Next Steps

1. **Review this document** and make decisions on open questions
2. **Finalize approach** for key decisions (TreeNode generics, Element ↔ TreeNode, SlotCollection expansion)
3. **Prioritize implementation** (can some steps be done in parallel?)
4. **Create detailed tasks** for each step once approach finalized
5. **Begin implementation** starting with Phase 1 (foundation changes)

---

## Discussion Notes

**From planning session 2025-10-31**:

- User made exploratory changes (TreeNode class, collectAllSlots sketch)
- These changes are incomplete and don't compile (WIP commit fe09054)
- Need to resolve design decisions before completing implementation
- Key insight: Attributes should be in SlotCollection (they ARE slots)
- Property renaming important for domain model clarity
- TreeNode generics removal makes sense given VariableCollection needs
- Two-phase construction seems most practical for Element ↔ TreeNode

**User feedback to capture for later**:
- "i don't know if dataloader needs to know this, but the attributes should already conform to SlotMetadata"
- "the SlotCollection should not just consist of the items in the model's slots section. all the attributes should be in there too"
- "i don't see a need for children [in ClassNode]. that will be handled by TreeNode"
- "i don't really understand buildClassHierarchy" (needs clarification/simplification)

---

*This document will be updated as decisions are made and implementation proceeds.*
