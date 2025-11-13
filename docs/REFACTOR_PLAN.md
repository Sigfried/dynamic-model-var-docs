# Architecture Refactor Planning - Session Notes

**Date**: 2025-01-11
**Status**: Planning phase - consolidating ideas before implementation

## Table of Contents

### Session Context
- [Current Situation](#current-situation)
- [Key Insights from Recent Discussion](#key-insights-from-recent-discussion)
- [Next Steps (This Session)](#next-steps-this-session)
- [Open Questions to Address](#open-questions-to-address)
- [Related Documents](#related-documents)
- [Session Goals](#session-goals)

### Consolidated Architecture Plan
1. [Graph-Based Model Architecture](#1-graph-based-model-architecture)
   - [Core Concept: Typed Directed Graph](#core-concept-typed-directed-graph)
   - [Node Types (Elements)](#node-types-elements)
   - [Edge Types (Relationships)](#edge-types-relationships)
   - [Compound Relationships](#compound-relationships-class-attributes)
2. [Slots as Complex Edges](#2-slots-as-complex-edges-critical-insight)
   - [Problem with Current Architecture](#problem-with-current-architecture)
   - [Proposed: Slots as Complex Edges](#proposed-slots-as-complex-edges)
3. [Data Flow Simplification](#3-data-flow-simplification)
   - [Current Approach](#current-approach-complex)
   - [Proposed Approach](#proposed-approach-phased)
4. [Implementation Strategy](#4-implementation-strategy)
   - [Option A: Incremental](#option-a-incremental-recommended)
   - [Option B: Big Refactor](#option-b-big-refactor-deferred)
   - [Testing Checklist](#testing-after-each-step)
5. [LinkML Study Plan](#5-linkml-study-plan-next-phase)
   - [Goals](#goals)
   - [Study Targets](#study-targets)
6. [Open Questions Summary](#6-open-questions-summary)
7. [Files Likely to Change](#7-files-likely-to-change)

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

**C. Learnings from BDCHM Documentation** ✅ COMPLETED

Reviewed: Observation, Specimen, Condition, Person/Participant classes

**1. Terminology & Concepts**:
- **"Direct slots"** vs **"Induced slots"**
  - Direct = slots defined directly on a class
  - Induced = complete flattened attribute list including all inherited slots
  - UI shows both views in LinkML source tabs
- Classes can be **concrete parents** (Observation has its own implementation + specialized children)
- Both "slots" and "attributes" terms used interchangeably in UI

**2. Inheritance Patterns**:
- Linear inheritance chains visualized with Mermaid class diagrams
- Entity → Observation → [6 specialized observation types]
- Documentation clearly separates inherited vs direct attributes
- Clickable navigation between related classes

**3. Relationship Modeling Patterns**:
- **Self-referential**: Specimen → parent_specimen (0..*, allows pooling/derivation)
- **Cross-class**: Typed slots with range constraints (Specimen → source_participant: Participant)
- **Bidirectional hints**: Comments note when fields "useful when object should stand alone"
- **Activity relationships**: Multiple typed edges (creation_activity, processing_activity, storage_activity, transport_activity)
- **Mutual exclusivity**: Documented in comments (one of: value_string, value_boolean, value_quantity, value_enum)

**4. Slot Constraints & Cardinality**:
- **Cardinality notation**: "0..1" (optional), "1" (required), "*" or "0..*" (multivalued)
- **Required/multivalued flags**: Explicit in YAML schema
- **Range constraints**: Slots typed to enums, primitives, or other classes

**5. Enumeration Strategy**:
- **Pre-mapped controlled vocabularies** (not direct ontology URIs)
- Examples: SpecimenTypeEnum, ConditionConceptEnum, ProvenanceEnum, AnalyteTypeEnum
- Assumes upstream mapping from source systems (EHR codes → enum values)
- Enum values have descriptions and sometimes meaning (ontology mapping)

**6. Identifier Patterns**:
- **Two-tier system**:
  - `identity` = external business identifiers (globally unique, created outside system)
  - `id` = internal logical identifiers (system-specific, marked `identifier: true`)

**7. Temporal Representation**:
- Ages recorded in **days** (UCUM: `d`) for precision
- Examples: age_at_observation, age_at_condition_start, age_at_condition_end
- Participant-centric (relative ages) vs absolute dates

**8. Provenance Tracking**:
- Enumerated provenance fields (single slot approach)
- Activity chains capture modification history
- Parent-child relationships establish lineage

**D. LinkML Developer Guidance** ✅

Discussion with Chris Mungall (LinkML core developer) about LPG representation

**Round 1: Initial guidance on LPG projections**

> The app looks great!
>
> The graph question is a very interesting one. There are already many projections of a linkml schema to different kinds of graphs.
>
> 1. rdfgen and jsonldgen creates a simple RDF graph
> 2.  owlgen creates OWL which can be rendered as a different RDF graph
> 3. The OWL from 2 can also be projected onto a different kind of graph using alternative projections (see https://incatools.github.io/ontology-access-kit/guide/relationships-and-graphs.html)
> 4. there is a standard mapping from LinkML to UML, using serializations like mermaid. And UML is clearly a graphical conceptually with intuitive mappings to a LPG. But surprisingly there seems to be no standard ways to represent UML as a LPG.
> 5. There is also a LinkML to ER mapping, and ER diagrams are also graphs
>
> I think 4 is closest to what you want. What you describe is essentially UML (implicitly I am understanding your requirements to also be an LPG formalism). 1-3 will give you something that is mis-aligned, either introducing blank nodes or other "structural" nodes, or otherwise misaligned.
>
> actually it strikes me the simpler answer to your question is to point you at https://schemalink.anacleto.di.unimi.it/test. https://anacletolab.github.io/schemalink-docs/
> https://drive.google.com/drive/folders/1UZvmcDNeZHGSojfhZDyq7__geo7Al3-6

**Round 2: SchemaLink evaluation and slots as edges question**

[sg] asked about SchemaLink's JSON export and whether slots should be edges:
> The json export appears to represent only inheritance as relationships. Slots are represented as node properties, which is what I was trying to get away from. I'm sure I'm missing a lot here.
>
> Do you have an opinion as to whether it makes sense to store slots as edges rather than as nodes?
>
> My current data representations are a sloppy-ish combination of OOP classes: Element (abstract base class) → ClassElement, EnumElement, SlotElement (with ClassSlot for handling slot usage overrides), VariableElement
>
> I've been struggling mightily trying to get claude code to respect model/view separation and not produce spaghetti code, which is my impetus to be spending a ton of time refactoring and considering a simplified graph (LPG) representation

**Chris Mungall's key insight:**
> Yes, I was thinking of more aligning on formalisms and patterns
>
> **On slots as edges vs nodes:**
> Many! But succinctly, **assuming an LPG IMO the most natural and useful representation is to have the slot definitions as nodes, but the slot usages as edges between a class and class/type, decorated with cardinality etc.** Visually a dotted line between the usage edge and the slot node, some people like to call this a **hypergraph**, some LPGs formalisms like the implicit one in Neo4J don't do a great job of representing this as first class...

**Round 3: Visualization vs formalism question**

[sg]'s concern:
> The goal of my app is to show as much of a schema as possible in a comprehensible way with limited screen space so users can get a quickish sense of what's there and explore and navigate the model's topography and details without getting lost.
>
> I don't know how important it will actually be to user comprehension or insight, but my app lets you see an overview of class-class and class-enum associations without having to drill down to specific classes or enums. Those relationships, of course, are formed through class-->slot-->range connections. **It's a little confusing maybe to have class-slot links be the same sort of thing as class-range links.**
>
> The app doesn't present a conventional graph visualization (because node-link diagrams and adjacency matrices get hard to read at even very modest sizes) and the graph formalism doesn't need to match the UI. But for this issue, the idea was to present slots as links rather than as nodes so as to avoid confusion about how class-slot links are different from class-range links.
>
> **I haven't thought this through yet, but do you think i should avoid that kind of confusion by getting rid of direct class-range links in the app in favor of class-slot, slot-range links? That would probably get unwieldy.**
>
> Anyway -- now that I'm describing this as a visualization issue rather than as a graph formalism issue, what do you think?

**Key Takeaways:**

1. **Hypergraph representation** (Chris's recommendation):
   - **Slot definitions** = nodes
   - **Slot usages** = edges (Class → Class/Type)
   - **Decorated edges** = cardinality, required, multivalued, etc.
   - **Dotted line** = visual connection between usage edge and slot definition node
   - **Challenge**: Neo4J and similar LPGs don't represent this well as first-class

2. **Our current approach** (slots as edges, not nodes):
   - Simplifies visualization: avoids having both class→slot and slot→range edges
   - Shows class→range relationships directly
   - May diverge from LinkML community patterns
   - **Question remains**: Is visualization simplicity worth diverging from standard formalism?

3. **Alternatives to consider**:
   - **Option A**: Follow Chris's hypergraph pattern (slots as nodes, usages as edges)
   - **Option B**: Keep current approach (slots as edges) for UI, but acknowledge divergence from LinkML norms
   - **Option C**: Hybrid - internal graph uses hypergraph, but UI presents simplified class→range view

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
