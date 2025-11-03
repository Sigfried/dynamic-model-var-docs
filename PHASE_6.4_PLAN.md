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

**[sg] yes**

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

**[sg]**
    i think B might be better. name collisions are a bigger issue,
    which i hadn't been thinking about. how about something like this?

    - in ClassElement constructor call SlotElement constructor for attributes
      so class.attributes holds an array of SlotElements
    - in SlotCollection.constructor, instead of returning a flat tree, tree
      can have two levels:
        - roots[0] reusableSlots will hold the array of SlotElements from the slots
          metadata. (this should be the first item and default to expanded)
        - then roots for each class with attributes each holding a reference
          to the matching attribute list. (these roots default to collapsed)

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

**[sg]** I think C seems most straightforward. I'm not totally understanding A
         though. `node.node.treeNode = node` seems like a lot of levels

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
**[sg]** see decisions above

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

**[sg]**

    - class might be better, but need this fleshed out a bit more
    - in my suggestion above, attribute slots get created in classElement
      and SlotCollection holds refs to these. will that be fine?

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

**[sg]** need more elaboration of this recommendation

    - Tree.buildTree is also first step for class trees?
    - what does enrichClassMetadata() need to do?

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

**[sg]** not sure i totally understand. maybe stick with DTOs, just
clearly enforce that only dataLoader can use them. mappings from DTO
to <type>Metadata (which we were going to rename to something like
<type>Properties) can be specified wherever the DTOs are named. and
probably just need to include mapping of fields that don't have the
same names.

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
**[sg]** yes, except when we are treating an element name like an id, we
should use id fields (getId() i think)

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
    // [sg] how does this work?
    // we aren't currently generating 'enumReferences'.
    // maybe we have to pass more info to findInboundRefs so it would
    // know to look for this.name in classElement.properties?
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
            See enumReferences comments above

---

## ✅ Decisions & Clarifications

This section summarizes all decisions made and clarifications provided during planning discussions.

### Decision 1: TreeNode Generics ✅ DECIDED

**Decision**: Remove generics (Option A)

**Rationale**: VariableCollection needs to mix ClassElement and VariableElement in same tree, so generics don't help.

---

### Decision 2: When to Convert Attributes → SlotElements ✅ DECIDED

**Decision**: Modified Option B - Create in ClassElement constructor

**Implementation**:
1. ClassElement constructor calls SlotElement constructor for each attribute
2. ClassElement.attributes becomes SlotElement[]
3. SlotCollection.constructor creates a **2-level tree** (not flat):
   - `roots[0]`: "reusableSlots" - SlotElements from slots metadata (expanded by default)
   - `roots[1+]`: One root per class with attributes (named after class, collapsed by default)

**Q&A**:
- **Q1**: "So SlotCollection would have a tree structure instead of flat list?"
  - **A**: Yes - SlotCollection is too long for ElementsPanel display without collapsibility

- **Q2**: "The class attribute roots would be named after the class?"
  - **A**: Yes - most sensible way to group them

- **Q3**: "This means SlotCollection is organized for browsing rather than lookup?"
  - **A**: This is how ClassCollection (hierarchy) and VariableCollection already work - they use `Tree.toRenderableItems()` for UI display. All collections follow this pattern. However, user asks: **should we reconsider how to group lists for readability across all collections?**

**Open question**: User suggested Tree should have `traverse()` method (depth-first) to flatten. Would slots be different? Or should we reconsider grouping strategy?

---

### Decision 3: Element ↔ TreeNode Circular Reference ✅ DECIDED

**Decision**: Option C - Lazy resolution via getter

**Implementation**:
```typescript
class ClassElement {
  private collection: ClassCollection;

  constructor(data: ClassMetadata, collection: ClassCollection) {
    this.collection = collection;
    // ...
  }

  get treeNode(): TreeNode {
    // Lazy lookup - can be cached on first access
    return this.collection.findTreeNode(this.getId());
  }
}
```

**Clarification on Option A**: User found `node.node.treeNode = node` confusing. Breakdown:
- First `node`: The TreeNode instance
- `.node`: TreeNode's property holding the Element
- `.treeNode = node`: Setting Element's treeNode property back to the TreeNode
- Could be clearer as: `treeNode.element.treeNode = treeNode`

Option C avoids this confusion with a clean getter approach.

---

### Insight 2 Clarification: ClassSlot Interface

**Decisions**:
- **Class preferred over interface** - allows methods like `getEffectiveRange()`
- **Needs more fleshing out** before implementation
- **Pattern confirmed**: ClassElement creates SlotElements for attributes, SlotCollection holds refs to them

**Open question**: Since ClassElement creates attribute SlotElements and SlotCollection references them, this creates a dependency order: ClassElements must be created before SlotCollection. Is this acceptable?

---

### Insight 3 Clarification: Tree Building & DataLoader Role

**Key realizations**:

1. **variableCount doesn't need computing** - just use `classElement.variables.length`

2. **dataLoader role**: Confined to:
   - Loading raw JSON data
   - Type checking against Metadata interfaces
   - Field name mapping (snake_case → camelCase)
   - Returning typed Metadata objects

3. **Collection creation orchestration**: Can have a function in Element.tsx (or rename to Element.ts?) that manages collection creation in the proper order. This allows circular dependencies to resolve. Example:
   ```typescript
   // After VariableCollection is created, classElement.variables can be filled in
   ```

4. **Tree building**: Yes, `Tree.buildTree()` is the first step for class trees. After dataLoader returns flat arrays of Metadata, ClassCollection.fromData() calls buildTree().

5. **enrichClassMetadata()**: Now much simpler - doesn't need to exist as separate function. dataLoader just does field name mapping inline:
   ```typescript
   // In dataLoader
   const classMetadata: ClassMetadata = {
     ...rawData,
     slotUsage: rawData.slot_usage,  // Rename field
     // No tree building, no variable counting
   };
   ```

**Summary**: dataLoader becomes very simple - just load, type-check, rename fields. All enrichment/transformation happens in Collection creation.

---

### Insight 4 Clarification: DTO Pattern & Property Renaming

**User's preference**: Keep DTOs, but restrict their use

**Proposed approach**:
1. **DTOs stay in types.ts** as "shape from JSON" (ClassNode, EnumDefinition, etc.)
2. **Can we enforce** DTOs only usable by dataLoader? (ESLint rule similar to existing ones)
3. **Metadata interfaces** are NOT enriched - they match JSON structure
4. **Field name mapping** happens in dataLoader (snake_case → camelCase)
5. **Value copying** from Metadata to class members happens in constructors (current approach)

**Questions to clarify**:

**Q1**: "Properties interfaces are enriched/renamed versions - what do you mean by enriched?"
- **My clarification**: I meant renamed fields (slot_usage → slotUsage) and possibly added computed fields. But based on your feedback, we should:
  - Keep Metadata interfaces matching JSON exactly
  - Do field renaming in dataLoader's mapping layer
  - No "Properties" interfaces needed - just use renamed fields in constructors

**Q2**: "Mapping happens in fromData() - is there a reason to move it from constructors?"
- **My clarification**: No strong reason. Current approach (copying in constructors) works fine. I was overthinking it.

**Revised approach**:
```typescript
// types.ts - DTOs (restricted to dataLoader use only)
export interface ClassNodeDTO {
  name: string;
  slot_usage?: Record<string, any>;  // Raw JSON shape
  // ...
}

// dataLoader.ts
function loadClasses(): ClassNodeDTO[] {
  const raw = JSON.parse(jsonData);
  return raw.classes;  // Just parse and type-check
}

// Element.tsx - Constructor does field mapping
class ClassElement {
  readonly slotUsage: Record<string, any>;

  constructor(data: ClassNodeDTO, collection: ClassCollection) {
    this.slotUsage = data.slot_usage;  // Map field name
    // ...
  }
}
```

**Open question**: Should we rename DTOs to make restriction clearer? (ClassNodeDTO instead of ClassNode)

---

### Insight 5 Clarification: findInboundRefs Pattern

**Confirmed decisions**:
- Use `getId()` instead of `.name` when treating element name as identifier ✅

**Challenge for enums**: User correctly identified that `enumReferences` property doesn't exist. For enums, we need to search class properties for `range === this.getId()`.

**Revised approach**:
```typescript
class EnumElement {
  getUsedByClasses(): string[] {
    // Need to search through all class properties
    const classCollection = this.collection.modelData.collections.get('class');

    return classCollection
      .getAllElements()
      .filter(cls => {
        // Check if any property/attribute has range === this enum's ID
        return Object.values(cls.properties).some(prop =>
          prop.range === this.getId()
        );
      })
      .map(cls => cls.getId());
  }
}
```

**Generalization**: Maybe `findInboundRefs` should support path expressions?
```typescript
// Simple property
element.findInboundRefs(collection, 'slots')  // checks: element.slots.includes(this.getId())

// Nested property with wildcard
element.findInboundRefs(collection, 'properties.*.range')  // checks: any prop.range === this.getId()
```

**Open question**: Is path expression support worth the complexity, or should complex cases just implement custom logic?

---

## Implementation Plan (REVISED)

**Status**: Reflects decisions from Decisions & Clarifications section above

**Key principles**:
- Keep DTOs (restrict usage via ESLint)
- dataLoader only loads, type-checks, and maps field names
- Collection orchestration function manages creation order
- All enrichment/transformation in Collection.fromData()

---

### Phase 1: Foundation & Type System

**1.1 Remove [key: string]: unknown from interfaces**
- Remove from ClassMetadata, EnumMetadata, SlotMetadata, AttributeDefinition
- Benefit: Fail fast on unexpected JSON fields
- Files: `src/types.ts`
- **Status**: Ready to implement

**1.2 Rename DTOs for clarity (optional but recommended)**
- ClassNode → ClassNodeDTO (or keep as ClassNode)
- EnumDefinition → EnumDefinitionDTO
- SlotDefinition → SlotDefinitionDTO
- Makes restriction intent clearer in code
- Files: `src/types.ts`, `src/utils/dataLoader.ts`
- **Status**: Decide if renaming needed

**1.3 Add ESLint rule to restrict DTO usage**
- Ban imports of DTOs (ClassNode, EnumDefinition, SlotDefinition) outside dataLoader
- Similar to existing rules that ban imports in components/
- Error message: "DTOs can only be used in dataLoader. Use Element classes instead."
- Files: `.eslintrc.js`
- **Status**: Ready to implement

**1.4 Define ClassSlot class**
- Create as class (not interface) for methods like `getEffectiveRange()`
- Properties: slot, source, rangeOverride, requiredOverride, etc.
- Methods: TBD (needs more design)
- Files: `src/models/Element.tsx` or new file `src/models/ClassSlot.ts`
- **Status**: Needs more design (see Open Questions)

---

### Phase 2: Tree System Refactor

**2.1 Convert TreeNode to non-generic class**
- Remove generic type parameter: `TreeNode<T>` → `TreeNode`
- Change `node: T` → `node: Element`
- Update all usages: `Tree<ClassElement>` → `Tree`, `TreeNode<Element>` → `TreeNode`
- Files: `src/models/Tree.ts`, all files using Tree/TreeNode
- **Status**: Ready to implement

**2.2 Add TreeNode.ancestorList() method**
- Returns TreeNode[] (user can map to Elements if needed)
- Walks up parent chain recursively
- Files: `src/models/Tree.ts`
- **Status**: Ready to implement (already sketched in WIP code)

**2.3 Add TreeNode.traverse() method (suggested)**
- Depth-first traversal for flattening tree
- Consider: Should this replace/supplement toRenderableItems()?
- Files: `src/models/Tree.ts`
- **Status**: Design decision needed (see Open Questions)

**2.4 Implement Element.treeNode getter (lazy resolution)**
- Add private `collection` property to Element base class
- Add getter that calls `this.collection.findTreeNode(this.getId())`
- Consider caching result on first access
- Files: `src/models/Element.tsx`
- **Status**: Ready to implement after 2.1 complete

**2.5 Add Collection.findTreeNode() method**
- Takes elementId, returns TreeNode
- Traverses tree to find node with matching element.getId()
- Files: `src/models/Element.tsx` (ElementCollection base class)
- **Status**: Ready to implement

---

### Phase 3: Slot System Expansion

**3.1 Create SlotElements in ClassElement constructor**
- Constructor receives ClassMetadata with attributes: Record<string, AttributeDefinition>
- For each attribute, create SlotElement: `new SlotElement({ name: attrName, ...attrDef })`
- Store in ClassElement.attributes: SlotElement[]
- Files: `src/models/Element.tsx` (ClassElement)
- **Status**: Ready to implement

**3.2 Convert SlotCollection to 2-level tree structure**
- Root node 0: "Reusable Slots" (expanded by default)
  - Children: SlotElements from schema's slots section
- Root nodes 1+: Class name (collapsed by default)
  - Children: SlotElements from that class's attributes (created in 3.1)
- SlotCollection constructor needs:
  - slotData: Map<string, SlotMetadata> (for reusable slots)
  - classElements: ClassElement[] (to extract attribute SlotElements)
- **Dependency**: Requires ClassElements created first
- Files: `src/models/Element.tsx` (SlotCollection)
- **Status**: Ready to implement after 3.1

**3.3 Implement ClassElement.collectAllSlots()**
- Use `this.treeNode.ancestorList()` to walk inheritance chain
- Collect inherited slots from ancestors' properties
- Apply slot_usage overrides to create ClassSlot instances
- Add direct attributes as ClassSlots (source: 'attribute')
- Add direct slots as ClassSlots (source: 'slot')
- Return type: Record<string, ClassSlot> (decided above)
- Files: `src/models/Element.tsx` (ClassElement)
- **Status**: Blocked on ClassSlot class design (1.4)

---

### Phase 4: DataLoader Simplification

**4.1 Simplify dataLoader - remove tree building**
- Remove `buildClassHierarchy()` - replace with simple mapping
- Just load JSON, type-check, return flat arrays
- Field name mapping only: `slot_usage` → keep as `slot_usage` in DTO, map in constructor
- Remove `buildReverseIndices()` (never called)
- Remove variable counting logic (computed as `classElement.variables.length`)
- Files: `src/utils/dataLoader.ts`
- **Status**: Ready to implement

Example:
```typescript
// Before: buildClassHierarchy returns tree
const classTree = buildClassHierarchy(rawClasses, variables);

// After: Simple flat array with type checking
function loadClasses(rawData: any): ClassNodeDTO[] {
  // Just parse and validate
  return rawData.classes.map((cls: any) => ({
    name: cls.name,
    description: cls.description,
    parent: cls.parent,
    attributes: cls.attributes || {},
    slots: cls.slots || [],
    slot_usage: cls.slot_usage || {},
    abstract: cls.abstract || false,
  }));
}
```

**4.2 Create Collection orchestration function**
- Add to Element.tsx: `createCollections(data: ModelData): void`
- Manages collection creation in proper order
- Handles circular dependencies (e.g., variables array filled after VariableCollection created)
- Order:
  1. EnumCollection (no dependencies)
  2. ClassCollection (needs enums for validation, but not critical)
  3. VariableCollection (needs classes)
  4. SlotCollection (needs class elements for attributes)
  5. Wire up circular refs (classElement.variables, etc.)
- Files: `src/models/Element.tsx`
- **Status**: Design needed - see exact orchestration order below

**Collection Creation Order Detail**:
```typescript
export function createCollections(
  classData: ClassNodeDTO[],
  enumData: EnumDefinitionDTO[],
  slotData: SlotDefinitionDTO[],
  variableData: VariableSpec[]
): ModelData {
  // 1. Create collections (except SlotCollection)
  const enumCollection = EnumCollection.fromData(enumData);
  const classCollection = ClassCollection.fromData(classData);  // Uses Tree.buildTree()
  const variableCollection = VariableCollection.fromData(variableData, classCollection);

  // 2. Build SlotCollection (needs classElements for attributes)
  const slotCollection = SlotCollection.fromData(slotData, classCollection.getAllElements());

  // 3. Wire up circular references
  // E.g., classElement.variables = variableCollection.getVariablesForClass(className)

  // 4. Return ModelData
  return {
    collections: new Map([
      ['class', classCollection],
      ['enum', enumCollection],
      ['slot', slotCollection],
      ['variable', variableCollection],
    ]),
    elementLookup: buildElementLookup([...])
  };
}
```

**4.3 Update ClassCollection.fromData() to use Tree.buildTree()**
- Remove recursive tree conversion from ClassNode tree
- Receive flat ClassNodeDTO[]
- Call `Tree.buildTree(elements, getId, getParentId)`
- Files: `src/models/Element.tsx` (ClassCollection)
- **Status**: Ready to implement after 4.1

**4.4 Update VariableCollection.fromData() to use Tree.buildTree()**
- Remove manual 2-level tree construction
- Use generic `Tree.buildTree()` with appropriate getId/getParentId functions
- Files: `src/models/Element.tsx` (VariableCollection)
- **Status**: Ready to implement

---

### Phase 5: On-Demand Computation & Lazy Fields

**5.1 Implement getUsedByClasses() methods**
- **VariableElement**: Simple - just return `[this.className]`
- **SlotElement**: Scan classCollection for classes with this slot in their slots array
- **EnumElement**: Scan classCollection properties for range === this enum's ID
- Use custom logic (not generic findInboundRefs) for complex cases
- Files: `src/models/Element.tsx`
- **Status**: Ready to implement

Example:
```typescript
class EnumElement {
  getUsedByClasses(): string[] {
    const classCollection = this.collection.modelData.collections.get('class');
    return classCollection
      .getAllElements()
      .filter(cls => {
        return Object.values(cls.properties).some(prop =>
          prop.range === this.getId()
        );
      })
      .map(cls => cls.getId());
  }
}
```

**5.2 Make variableCount a computed property**
- Change from pre-computed field to getter: `get variableCount() { return this.variables.length; }`
- Remove variableCount from ClassNodeDTO
- Files: `src/models/Element.tsx` (ClassElement)
- **Status**: Ready to implement

**5.3 Consider findInboundRefs helper (optional)**
- Generic helper for simple cases: `element.slots.includes(this.getId())`
- Complex cases (nested properties) use custom logic
- Decision: Implement only if pattern repeats enough to justify
- Files: `src/models/Element.tsx` (Element base class)
- **Status**: Optional - defer until pattern emerges

---

### Phase 6: Cleanup & Verification

**6.1 Remove buildReverseIndices()**
- Function exists but never called
- Replaced by on-demand getUsedByClasses()
- Files: `src/utils/dataLoader.ts`
- **Status**: Ready to implement (part of 4.1)

**6.2 Update Element.tsx → Element.ts (optional)**
- Currently .tsx but doesn't use JSX
- Rename to .ts for clarity
- Update all imports
- Files: Rename `src/models/Element.tsx` → `src/models/Element.ts`
- **Status**: Optional - decide if worth the churn

**6.3 Run full type check**
- `npm run typecheck` or `npx tsc --noEmit`
- Fix any type errors introduced
- **Status**: After each phase

**6.4 Run full test suite**
- `npm test`
- Update tests for new architecture
- **Status**: After each phase

**6.5 Update component imports**
- Verify no components import DTOs (ESLint should catch)
- Update any old DTO references to use Element classes
- Files: All components
- **Status**: After 4.1 complete

**6.6 Update documentation**
- Update CLAUDE.md if architecture principles changed
- Update TASKS.md to mark Phase 6.4 complete
- Add notes about DTO restriction and ESLint rule
- Files: `CLAUDE.md`, `TASKS.md`
- **Status**: At end of Phase 6.4

---

## Open Questions (UPDATED)

### ✅ ANSWERED (from Decisions & Clarifications section above)

1. **TreeNode generics**: Remove generics ✅
2. **Element ↔ TreeNode reference**: Lazy resolution via getter ✅
3. **TreeNode.ancestorList() return type**: TreeNode[] ✅
4. **collectAllSlots() return type**: Record<string, ClassSlot> ✅
5. **variableCount computation**: Computed property (getter returning variables.length) ✅
6. **ClassSlot**: Class preferred over interface ✅

### 🔶 STILL OPEN - Need Decisions

**High Priority:**

1. **ClassSlot class design - needs fleshing out**
   - Confirmed: Class (not interface)
   - Needs: Full property list and method signatures
   - Properties so far: slot, source, rangeOverride, requiredOverride, multivaluedOverride, descriptionOverride
   - Methods: getEffectiveRange(), isOverridden(), ???
   - **Blocking**: Phase 3 implementation (3.3)

2. **Tree.traverse() method design**
   - User suggested adding traverse() method for depth-first flattening
   - Question: Should this replace/supplement toRenderableItems()?
   - Broader question: "should we reconsider how to group lists for readability across all collections?"
   - **Impact**: May affect all Collection classes
   - **Status**: Design discussion needed

3. **Attribute name collisions in SlotCollection**
   - If two classes have attribute "id", what happens?
   - Options:
     - Create separate SlotElements with qualified names (ClassName.id)
     - Assume same-named attributes are the same slot (merge if identical, error if different)
     - Let SlotCollection handle deduplication
   - **Decision**: Based on our new 2-level tree structure (Decision 2), attributes are grouped by class, so collisions are naturally separated. Each class has its own tree root with its attributes.
   - **Status**: ✅ RESOLVED by 2-level tree design

4. **DTO renaming (ClassNode → ClassNodeDTO)**
   - Optional but makes restriction clearer
   - Adds churn but improves clarity
   - **Recommendation**: Do it for consistency with new architecture
   - **Status**: User decision needed

5. **Element.tsx → Element.ts renaming**
   - File doesn't use JSX
   - Cleaner naming but causes import churn
   - **Status**: User decision - is it worth it?

**Medium Priority:**

6. **fromData() DRYing**
   - Each fromData() has unique logic (flat vs tree vs grouped)
   - Attempting to DRY might create more complexity than it saves
   - **Recommendation**: Leave as-is unless clear pattern emerges
   - **Status**: Deferred

7. **findInboundRefs path expression support**
   - Generic helper vs custom logic for each case
   - Path expressions like 'properties.*.range' add complexity
   - **Recommendation**: Custom logic for now, extract if pattern repeats
   - **Status**: Deferred
   - **Recommendation**: Keep separate (avoid premature abstraction)

---

## Files to Modify (UPDATED)

### Core Architecture
- `src/types.ts` - Remove index signatures from Metadata interfaces, optionally rename DTOs (→DTO suffix)
- `.eslintrc.js` - Add rule to restrict DTO usage to dataLoader only
- `src/models/Tree.ts` - Remove generics, add ancestorList(), potentially add traverse()
- `src/models/Element.tsx` - Major changes:
  - Add treeNode getter to Element base class
  - Add collection property for lazy TreeNode lookup
  - Add findTreeNode() to ElementCollection
  - Define ClassSlot class
  - Implement collectAllSlots() in ClassElement
  - Convert ClassElement constructor to create attribute SlotElements
  - Restructure SlotCollection as 2-level tree
  - Add getUsedByClasses() methods to various Elements
  - Use Tree.buildTree() in Collection.fromData() methods
- `src/utils/dataLoader.ts` - Drastically simplify:
  - Remove buildClassHierarchy() (just simple mapping)
  - Remove buildReverseIndices() (never called)
  - Just load, type-check, return flat arrays
- Add orchestration function (in Element.tsx or separate file)

### Components
- **No changes expected** - components already use Element classes
- **Verification**: ESLint will enforce no DTO imports

### Tests
- All test files using old types (minimal changes expected)
- Add tests for new functionality:
  - TreeNode.ancestorList()
  - Element.treeNode getter
  - ClassElement.collectAllSlots()
  - SlotCollection 2-level tree structure
  - getUsedByClasses() methods

---

## Benefits (UPDATED)

- **Simpler dataLoader**: Just load & type-check, no complex tree building or index computation
- **Faster**: No redundant tree building (use Tree.buildTree() once per collection)
- **Clearer separation**: DTOs restricted to dataLoader, Elements in domain/view layers
- **Type-safe**: Fail fast on schema changes (remove [key: string]: unknown)
- **Complete SlotCollection**: Includes all slots (explicit + attributes) with proper grouping
- **Proper modeling**: Slot inheritance/override system (ClassSlot) models domain accurately
- **On-demand computation**: usedByClasses computed when needed, not pre-built
- **Better orchestration**: Collection creation order managed explicitly, handles circular deps
- **Lazy tree access**: Element.treeNode getter avoids circular reference issues
- **Enforced architecture**: ESLint prevents DTO leakage into components

---

## Risks and Mitigation (UPDATED)

### Risk 1: Element ↔ TreeNode circular reference complexity
- **Status**: ✅ MITIGATED - Using lazy getter (Decision 3)
- **Implementation**: Element.treeNode getter calls collection.findTreeNode()
- **Trade-off**: Slight performance cost for simplicity (can cache if needed)

### Risk 2: Attribute name collisions in SlotCollection
- **Status**: ✅ RESOLVED - 2-level tree design naturally separates by class
- **Implementation**: Each class gets own tree root, attributes grouped within

### Risk 3: ClassSlot design incomplete
- **Status**: 🔶 OPEN - Needs more design work
- **Mitigation**: Block on this before implementing collectAllSlots()
- **Approach**: Start with basic properties, add methods incrementally

### Risk 4: Collection creation order dependencies
- **Status**: ✅ MITIGATED - Orchestration function makes order explicit
- **Implementation**: createCollections() function in specific order with wiring step

### Risk 5: Breaking changes to existing code
- **Status**: 🔶 MONITORED
- **Mitigation**:
  - Type checking after each phase
  - Test suite after each phase
  - ESLint enforcement catches architectural violations

### Risk 6: Tree.traverse() design impact
- **Status**: 🔶 OPEN - Design discussion needed
- **Impact**: May affect how all collections flatten/render
- **Mitigation**: Can defer if not blocking main work

---

## Next Steps (UPDATED)

### Immediate (before implementation)
1. ✅ **Create Decisions & Clarifications section** - DONE
2. ✅ **Revise Implementation Plan** - DONE
3. ✅ **Update Open Questions** - DONE
4. 🔶 **User reviews and decides**:
   - ClassSlot class design needs fleshing out (HIGH PRIORITY)
   - Tree.traverse() design discussion
   - Optional: DTO renaming, Element.tsx → .ts

### Ready to implement (no blockers)
- Phase 1: Foundation (1.1, 1.3)
- Phase 2: Tree System (2.1, 2.2, 2.4, 2.5)
- Phase 4: DataLoader Simplification (4.1, 4.2, 4.3, 4.4)
- Phase 5: On-Demand Computation (5.1, 5.2)
- Phase 6: Cleanup (all steps)

### Blocked pending design
- Phase 1: ClassSlot class (1.4) - needs design
- Phase 3: Slot System (3.1, 3.2, 3.3) - blocked on ClassSlot design

### Can proceed in parallel
- Phase 1 & 2 can be done together (independent)
- Phase 4 depends on Phase 2 (needs Tree.buildTree without generics)
- Phase 3 depends on Phases 1, 2, 4 (needs all foundation pieces)
- Phase 5 depends on Phase 4 (needs collections created)

---

## Discussion Notes (Chronological)

### Planning Session 2025-10-31
- User made exploratory changes (TreeNode class, collectAllSlots sketch)
- These changes are incomplete and don't compile (WIP commit fe09054)
- Key insight: Attributes should be in SlotCollection (they ARE slots)
- TreeNode generics removal makes sense given VariableCollection needs
- Initial recommendations documented

### Review Session 2025-11-03
- User reviewed initial plan and provided extensive feedback
- Major architectural decisions finalized (see Decisions & Clarifications section)
- Key decisions:
  - Keep DTOs, restrict usage via ESLint
  - SlotCollection becomes 2-level tree for UI collapsibility
  - Element.treeNode via lazy getter (not two-phase construction)
  - dataLoader simplified to just load/type-check/map field names
  - Collection orchestration function for proper creation order
  - ClassSlot will be a class (not interface)
- Open questions identified:
  - ClassSlot design needs fleshing out (HIGH PRIORITY - blocking)
  - Tree.traverse() design discussion
  - Broader question about collection grouping/readability patterns

### Key User Quotes
- "slots collection is going to be too long for the element panel display without being collapsible"
- "variable count doesn't need computing. it will just be classElement.variables.length"
- "if dataLoader is confined to loading the data and fixing the names, we could have a function in Element.tsx that manages the collection creation in the appropriate order"
- "if DTOs stay in types.ts, can they be restricted to only being usable by dataLoader?"
- "should we be reconsidering how to group lists for readability?" (re: Tree.traverse and collection display patterns)

---

## Status Summary

**Current Phase**: Planning complete, ready for user review and decision on blockers

**Blocking Issues**:
1. ClassSlot class design (HIGH PRIORITY)
2. Tree.traverse() design discussion (can defer if not blocking)

**Ready to Proceed**: Phases 1, 2, 4, 5, 6 (all non-blocked steps)

**Commits**:
- fe09054: WIP exploratory code (TreeNode, ClassSlot sketches)
- 6b2e10f: Initial planning document
- [Current]: Revised plan with decisions and clarifications

---

*This document reflects all decisions as of 2025-11-03. Ready for user review.*
