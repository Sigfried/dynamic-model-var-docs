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
