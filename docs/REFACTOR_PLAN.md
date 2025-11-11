# Architecture Refactor Planning - Session Notes

**Date**: 2025-01-11
**Status**: Planning phase - consolidating ideas before implementation

---

## Current Situation

We have multiple planning documents with evolving ideas:
1. **TASKS.md**: Architecture & Refactoring Decisions section
2. **TASKS.md**: Architecture Refactoring Implementation Plan (Steps 1-7)
3. **DATA_FLOW.md**: [sg] New proposal section (lines 1050-1098)
4. **DATA_FLOW.md**: Relationship Type Analysis (lines 1112-1217)

**Problem**: Ideas evolving rapidly, some sections may be obsolete or superseded by later thinking

---

## Key Insights from Recent Discussion

### 1. Slots as Complex Edges (Not Nodes)

**Realization**: Slots represent relationships between classes and ranges, not entities themselves
- Current: Slots are Elements (same as classes, enums, variables)
- Proposed: Slots should be complex edges/relationships with metadata
- Impact: Major simplification of slot system (collectAllSlots, inheritance, etc.)

**From DATA_FLOW.md:1207-1215**:
> "actually slots always represent relationships. they have a lot of complexity
> (inheritance, global, inline, usage overrides). so we should discuss whether
> they should exist as relationships with their own metadata/attributes/properties
> or as nodes with two edges: class --> slot --> range"

### 2. Need for RangeElement Abstraction

Ranges can be:
- Classes (Entity, Specimen, etc.)
- Enums (SpecimenTypeEnum, etc.)
- Types (primitives: string, integer; or custom refined types)

**Issue**: Types (linkml:types) not currently imported or treated as elements
**Proposed**: Abstract RangeElement parent class for classes, enums, and types

### 3. Typed Directed Graph (Without Graphology for Now)

**Goal**: Eliminate element-type-specific code by representing all relationships as typed edges
- Edge types: `inherits`, `has_attribute`, `constrained_by`, `uses_slot`, `instantiates`, etc.
- Store edges in one direction, compute reverse on demand
- Current `'property'` type is overloaded (attributes, slots, variables) - needs decomposition

### 4. Path Computation Simplification

**Current**: Paths (nodePath/pathFromRoot) computed during tree construction
**Proposed**:
- Only set parentIds during fromData
- Compute paths later with shared code
- Benefits: Separation of concerns, code reuse across collections

---

## Next Steps (This Session)

1. ✅ Make notes (this file)
2. **Consolidate planning docs** - merge Architecture & Refactoring Decisions, Implementation Plan, New Proposal, Relationship Analysis into single coherent plan
3. **Review & commit** - checkpoint before learning phase
4. **Learn from LinkML** - understand how LinkML represents and documents schemas
   - Review BDCHM generated docs for key examples
   - Study LinkML internal representation
   - Extract lessons for our architecture
5. **Resume planning** - incorporate learnings into consolidated plan

---

## Open Questions to Address

1. **Compound relationships**: Simple/Explicit/Hybrid approach? (DATA_FLOW.md:1186-1188)
2. **Variable→Class relationship**: `instantiates`, `maps_to`, or tree parent/child? (DATA_FLOW.md:1210-1213)
3. **ClassSlot representation**: Keep as OOP class but treat as edges? (DATA_FLOW.md:1223-1224)
4. **Collection nodes**: Are they graph nodes or just query wrappers? (DATA_FLOW.md:1215-1216)
5. **Types import**: How to integrate linkml:types as elements/range options?

---

## Related Documents

- [TASKS.md](TASKS.md) - Current task list with Architecture Refactoring sections
- [DATA_FLOW.md](DATA_FLOW.md) - Data flow analysis with graph proposals
- [CLAUDE.md](../CLAUDE.md) - Architectural principles (view/model separation)
- [COMPONENT_FLOW.md](COMPONENT_FLOW.md) - UI component interactions

---

## Session Goals

**Before we start implementing**:
- Single consolidated architecture plan
- Understanding of LinkML's approach
- Clear decisions on graph representation
- Prioritized implementation steps

**After consolidation**:
- Archive/remove superseded sections from TASKS.md and DATA_FLOW.md
- Clear "this is the plan" document
- Ready to implement with confidence

---

# Consolidated Architecture Refactor Plan

## 1. Graph-Based Model Architecture

### Core Concept: Typed Directed Graph

**Goal**: Eliminate element-type-specific code by representing all relationships as typed edges in a directed graph.

**Key Properties**:
- Typed digraph: Nodes (elements) and edges (relationships) both have specific types
- Edge directionality: Store edges in one direction, compute reverse relationships on demand
- No graphology (for now): Use graph concepts without adding graphology library dependency

**Benefits**:
- Unified relationship model across all element types
- Eliminates nested loops and type-specific relationship code
- Easier to query ("give me all edges of type X")
- Foundation for future visualization features

### Node Types (Elements)

All elements in the model become graph nodes:
- **Classes**: Entity, Specimen, Material, etc.
- **Enums**: SpecimenTypeEnum, AnalyteTypeEnum, etc.
- **Slots**: Global slot definitions (specimen_id, focus, etc.)
- **Variables**: angina_prior_1, asthma_ever_1, etc.
- **Types** (NEW): Primitives (string, integer) and custom types from linkml:types
  - Currently not imported - needs to be added
  - Should be treated as range options alongside classes and enums

**RangeElement Abstraction** (NEW):
- Need abstract parent class for all types that can be slot ranges
- Children: ClassElement, EnumElement, TypeElement
- Provides common interface for range handling

### Edge Types (Relationships)

**Current implementation** (from Element.ts):
- `'inherits'` - Class → Parent Class
- `'property'` - Overloaded for multiple semantic relationships:
  - Class attribute → range (Class/Enum/Slot)
  - Slot → range (Class/Enum)
  - Variable → Class (with label='mapped_to')

**Current code structure**:
- Each Element subclass implements `getRelationships()` returning `Relationship[]`
- `Relationship` interface: `{ type, label?, target, targetType, isSelfRef? }`
- `computeIncomingRelationships()` scans all classes to find reverse relationships

**Proposed: Replace overloaded `'property'` with specific semantic types:**

| **From** | **To** | **Current Type** | **Proposed Edge Type** | **Edge Label (UI)** | **Notes** |
|----------|--------|------------------|------------------------|---------------------|-----------|
| Class | Parent Class | `inherits` | `inherits` | "inherits from" / "is_a" | Tree structure (parent/child) |
| Class | Subclass | *(computed incoming)* | `has_subclass` | "has subclass" | Reverse of inherits |
| Class | Enum (via attribute) | `property` | `has_attribute` + `constrained_by` | "has attribute {name} constrained by {enum}" | Compound: Class→Attribute→Enum |
| Class | Class (via attribute) | `property` | `has_attribute` + `references` | "has attribute {name} referencing {class}" | Compound: Class→Attribute→Class |
| Class | Slot (via slot reference) | *(implicit in slots[])* | `uses_slot` | "uses slot" | Class references global slot |
| Class | Slot (via slot_usage override) | *(implicit in slot_usage{})* | `overrides_slot` | "overrides slot" | Class overrides global slot |
| Slot | Class/Enum (via range) | `property` | `constrained_by` | "constrained by" | Slot's range restriction |
| Enum | Class (via usage) | *(computed incoming)* | `constrains_attribute` | "constrains attribute {name} in {class}" | Reverse: Enum→Class that uses it |
| Variable | Class | `property` (label='mapped_to') | `instantiates` / `maps_to` | "instantiates" / "maps to" | Variable is instance of Class |
| Class | Variables | *(via VariableCollection grouping)* | `has_instances` | "has instances" | Reverse: Class→Variables |

**Tree relationships** (parent/child in graph):
- Class inheritance: `Entity ← Specimen ← Material`
- Variable grouping: `Condition ← angina_prior_1, asthma_ever_1, ...`
- Collection hierarchy (if using artificial root): `root ← classes, enums, slots, variables`

**Cross-reference relationships** (edges, not parent/child):
- Attribute self-reference: `Specimen.parent_specimen → Specimen`
- Attribute cross-class: `Specimen.source_participant → Participant`
- Attribute enum constraint: `Specimen.specimen_type → SpecimenTypeEnum`
- Slot range constraint: `SlotElement.range → Entity` (e.g., global slots referencing classes)

**Open Question**: Variable→Class relationship semantics
- Is it `instantiates`, `maps_to`, `belongs_to`?
- Is it a tree parent/child relationship or cross-reference?
- Should bdchmElement be renamed to parentId?

### Compound Relationships (Class Attributes)

**Problem**: `Specimen.specimen_type` relationship involves three components:
1. Class (Specimen)
2. Attribute name (specimen_type)
3. Range constraint (SpecimenTypeEnum)

**Three Approaches**:

1. **Simple**: Single edge with metadata
   ```
   Edge: Specimen → SpecimenTypeEnum
   Type: has_constrained_attribute
   Metadata: { attributeName: 'specimen_type', slotSource: 'inline' }
   ```
   ✅ Easier to implement, less graph complexity

2. **Explicit**: Attributes as first-class nodes
   ```
   Specimen → [Attribute: specimen_type] → SpecimenTypeEnum
   Edge1 type: has_attribute
   Edge2 type: constrained_by
   ```
   ✅ Attributes can be queried, have properties

3. **Hybrid**: Edge with structured attributes
   ```
   Edge: Specimen → SpecimenTypeEnum
   Type: has_attribute
   Attributes: { name: 'specimen_type', constraint_type: 'enum' }
   ```
   ✅ Balance between simplicity and expressiveness

**Decision needed**: Which approach? (Simple recommended for first implementation)

---

## 2. Slots as Complex Edges (Critical Insight!)

### Problem with Current Architecture

**Current**: Slots are Elements (same as classes, enums, variables)
- SlotElement is a node type
- SlotCollection manages slot nodes
- Slot inheritance requires complex recursive methods

**Realization**: **Slots represent relationships, not entities**

A slot defines the relationship between a class and a range:
- `Specimen.specimen_type` (inline attribute) is a slot
- `specimen_id` (global slot) is a slot definition that classes reference
- Both describe: Class → Range relationship

### Proposed: Slots as Complex Edges

**Slots should be edges/relationships with rich metadata**, not nodes:

```typescript
interface SlotEdge {
  type: 'slot';
  source: string;      // Class ID
  target: string;      // Range ID (class, enum, or type)

  // Slot metadata (edge attributes)
  name: string;
  required?: boolean;
  multivalued?: boolean;
  description?: string;

  // Inheritance tracking
  definedIn: string;   // Class that defined this slot
  overriddenBy?: string; // Class that overrode properties
  slotPath: string;    // "Entity.Specimen.Material" (inheritance chain)
}
```

**Benefits**:
- Eliminates collectAllSlots() complexity
- Slot inheritance becomes edge traversal
- Consistent with relationship-centric architecture
- SlotCollection becomes simpler (maybe just slot definitions?)

**Open Questions**:
1. Where do global SlotElements fit? Are they edge templates?
2. How to represent slot_usage overrides in graph?
3. ClassSlot instances: Keep as OOP class or fully replace with edges?

**Related**: See LinkML docs screenshot (TASKS.md:752-755) for how LinkML represents slots

---

## 3. Data Flow Simplification

### Current Approach (Complex)

```typescript
// fromData() methods do everything at once:
1. Transform DTO → Element
2. Wire up parent/children references
3. Compute pathFromRoot recursively
4. Build relationships
```

### Proposed Approach (Phased)

**Phase 1: Set parentIds only**
```typescript
// During DTO → Element transformation
ClassElement.constructor(data: ClassDTO) {
  this.name = data.name;
  this.parentId = data.parent;  // Just store parent ID
  this.pathFromRoot = undefined; // Don't compute yet
}

// For variables: Rename bdchmElement → parentId
VariableElement.constructor(data: VariableSpec) {
  this.name = data.variableLabel;
  this.parentId = data.bdchmElement; // Or rename field in DTO transform
}
```

**Phase 2: Build tree structure**
```typescript
// After all elements created, wire up parent/child links
function buildTreeStructure(elements: Element[]) {
  for (const element of elements) {
    if (element.parentId) {
      const parent = findElement(element.parentId);
      element.parent = parent;
      parent.children.push(element);
    }
  }
}
```

**Phase 3: Compute paths (shared code)**
```typescript
// Static method on Element base class
static computePaths(roots: Element[]) {
  for (const root of roots) {
    root.traverse(element => {
      element.pathFromRoot = element.ancestorList.map(a => a.name);
    });
  }
}
```

**Benefits**:
- Separation of concerns (transform, structure, paths)
- Shared path computation code across all element types
- Easier to understand and maintain
- Could eliminate redundant fromData() methods?

**Open Question**: Would we still need fromData() at all if parentIds are set in constructor?

---

## 4. Implementation Strategy

### Option A: Incremental (Recommended)

Build graph concepts gradually without big-bang rewrite:

1. **✅ DONE**: Rename `parentName` → `parentId` (Step 1b)
2. **✅ DONE**: Change `nodePath: string` → `pathFromRoot: string[]` (Step 5b)
3. **TODO**: Rename `bdchmElement` → `parentId` in Variable DTO transform
4. **TODO**: Refactor relationship types (split `'property'` into semantic types)
5. **TODO**: Implement slot-as-edge representation
6. **TODO**: Add RangeElement abstraction + import Types
7. **TODO**: Centralize path computation (shared Element.computePaths())
8. **TODO**: Simplify fromData() methods (or eliminate?)

### Option B: Big Refactor (Deferred)

Full graph-based rewrite using graphology:
- Store entire model as DAG
- Artificial root node
- Graph algorithms for all queries
- **Decision**: Too big a refactor, do incremental first

### Testing After Each Step

```bash
npm run typecheck  # No TS errors
npm run check-arch # No architecture violations
npm run test       # All tests pass
npm run dev        # Manual smoke test
```

---

## 5. LinkML Study Plan (Next Phase)

### Goals

1. Understand how LinkML represents schemas internally
2. Learn how LinkML-generated docs structure relationships
3. Extract lessons for our architecture

### Study Targets

**A. BDCHM Generated Documentation**

Review these examples (covers most relationship types):
1. **Observations**: Observation, MeasurementObservation, ObservationSet, MeasurementObservationSet
   - Class inheritance hierarchy
   - Abstract classes
   - Slot inheritance and overrides
2. **Specimen**:
   - Self-references (parent_specimen → Specimen)
   - Cross-class references (source_participant → Participant)
   - Enum constraints (specimen_type → SpecimenTypeEnum)
   - Multiple relationship types
3. **Condition**:
   - Variables as instances
   - Dynamic enums (reachable_from)
4. **Person/Participant**:
   - Root class behavior
   - Wide range of slot types

**B. LinkML Source Code**

Find and review:
- Schema representation classes
- Relationship modeling
- Documentation generator logic
- How slots/attributes are distinguished

**C. Extract Lessons**

Document in this file:
- Terminology: What LinkML calls things
- Relationship types: How LinkML categorizes edges
- Slot system: How inheritance/usage/override works
- Types: How LinkML handles type system
- UI patterns: What works well in generated docs

---

## 6. Open Questions Summary

**High Priority** (must answer before implementing):
1. Compound relationships: Simple/Explicit/Hybrid approach?
2. Slots as edges: How to represent global slot definitions?
3. Variable→Class: What's the semantic relationship type?
4. ClassSlot: Keep as OOP class or full edge representation?

**Medium Priority** (can decide during implementation):
5. Collection nodes: Are they graph nodes or just query wrappers?
6. Types import: How to integrate linkml:types as elements?
7. fromData elimination: Can we remove it entirely?

**Low Priority** (defer to later):
8. Graphology adoption: Worth the refactor eventually?
9. Artificial root node: Needed without graphology?

---

## 7. Files Likely to Change

**Model Layer** (major changes):
- `src/models/Element.ts` - Edge types, RangeElement, slot representation
- `src/models/TypeElement.ts` (NEW) - Import and represent linkml:types
- `src/models/ElementCollection.ts` - Simplified with graph queries?

**Service Layer** (moderate changes):
- `src/services/DataService.ts` - Add graph query methods (getAllPairs, getEdges, etc.)
- `src/services/dataLoader.ts` - Import types, refactor DTO transforms

**UI Layer** (minimal changes - maintained abstraction):
- Components should be largely unaffected thanks to DataService abstraction
- May need updates for new relationship display (more specific edge types)

**Documentation**:
- CLAUDE.md - Update with graph architecture principles
- DATA_FLOW.md - Update with final architecture (after consolidation)
- TASKS.md - Archive completed decisions section
