# Tasks

> **Active planning document** - Completed work archived to [docs/archive/tasks.md](docs/archive/tasks.md)
>
> **Development principles** - See [CLAUDE.md](CLAUDE.md) for architectural rules and workflow

---

## 📋 Upcoming Work (Ordered by Priority)

### Incorporate Unused Schema Fields into UI
- Enum inheritance and other fields
    - LinkML enums use `inherits` field (not `is_a` like classes)
    - Currently dataLoader/Element ignores enum `inherits` and other fields
    - Need to audit EnumInput for all fields and surface in UI
- Check console for "Unexpected fields" warnings. Currently seeing:
  ```
    dataLoader.ts:97 Unexpected fields in processed JSON (not yet used in UI):
        dataLoader.ts:100   SlotInput: alias, comments, designates_type, domain_of, examples, from_schema, global, inlined, inlined_as_list, overrides, owner, unit, values_from
        dataLoader.ts:100   EnumInput: comments, include, inherits, parent, reachable_from, see_also
        dataLoader.ts:100   TypeInput: exact_mappings_urls
        dataLoader.ts:100   ClassInput: class_url
  ```
- Add to UI or document why ignored
- For each field:
  - Show me some examples and give me stats (e.g., x of y SlotInputs have alias. example1, example 2...)
  - I decide if we add / ignore / deal with later
  - For add and ignore, add to expected fields; make clear which are ignored
  - For add, document plans for incorporating 
#### Unused Schema Fields Workspace

check claude's work:

      SlotInput fields:
      - ✅ comments - shown under description as "Comments:"
      - ✅ examples - shown under description as "Examples: value1, value2..."
      - ✅ inlined / inlinedAsList - shown as properties when true
      - ✅ domain_of / owner - investigated and marked as IGNORE (domain_of misses inherited slots)

      EnumInput fields:
      - ✅ comments - shown under description
      - ✅ inherits - new section "Inherits Values From" with clickable enum links
      - ✅ reachable_from - new section "Reachable From (Dynamic Values)" with source ontology, nodes, etc.

      Still TODO (marked as LATER):
      - unit - ask team
      - include, parent, see_also for enums

      Files changed:
      - src/models/SchemaTypes.ts - added new field types
      - src/input_types.ts - added input field definitions
      - src/utils/dataLoader.ts - transform functions
      - src/models/Element.ts - SlotElement and EnumElement classes
      - docs/TASKS.md - updated workspace with completion status
##### SlotInput (180 total slots)

 | Field              | Count          | Decision                                                                     | Notes                                                                                                           |
 |--------------------|----------------|------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------|
 | `alias`            | 181/181 (100%) | **IGNORE** - all same as name (verified)                                      | Same as name (ex: `id`→`id`, `species`→`species`)                                                               |
 | `comments`         | 25/180 (14%)   | ✅ **DONE** - shown under description                                         | Array of strings. ex: `days_supply`="The field should be left empty if..."                                      |
 | `designates_type`  | 1/180 (0.6%)   | **IGNORE** - note to revisit if generalizing app                             | Only `type` slot has this (=true)                                                                               |
 | `domain_of`        | 180/180 (100%) | **IGNORE** - incomplete (misses inherited slots), keep computed "Used By"    | Array of class names that use this slot. ex: `id`→`['Entity', 'Person', ...]`                                   |
 | `examples`         | 16/180 (9%)    | ✅ **DONE** - shown under description                                         | Array of {value} objects. ex: `specimen_type`=[{value:'Fresh Specimen'},...]                                    |
 | `from_schema`      | 180/180 (100%) | **IGNORE** - always same value                                               | Always `https://w3id.org/bdchm` - schema URL                                                                    |
 | `global`           | 7/181 (4%)     | **ALREADY USED** - just missing from EXPECTED_SLOT_FIELDS                     | Boolean. Slots: id, identity, associated_participant, entries, derived_product, value, member_of_research_study |
 | `inlined`          | 1/180 (0.6%)   | ✅ **DONE** - shown as property when true                                     | Only `entries` slot (=true)                                                                                     |
 | `inlined_as_list`  | 4/180 (2%)     | ✅ **DONE** - shown as property when true                                     | parent_specimen, derived_product, duration, +1                                                                  |
 | `overrides`        | 10/181 (6%)    | **ALREADY USED** - just missing from EXPECTED_SLOT_FIELDS                     | String (slot name being overridden). ex: `value`→`value` (10 different `value` slots)                           |
 | `owner`            | 180/180 (100%) | **IGNORE** - arbitrary (first domain_of class), not useful                   | Class that defines this slot. ex: `id`→`Entity`, `species`→`Person`                                             |
 | `unit`             | 12/180 (7%)    | **LATER** - need to ask team about it                                        | Object with ucum_code. ex: `age_at_death`={ucum_code:'d'}                                                       |
 | `values_from`      | 0/181 (0%)     | **GONE** in new data - removed from schema                                    | Was: Array of enum references                                                                                   |

- **inlined/inlined_as_list**: [LinkML docs](https://linkml.io/linkml/schemas/inlining.html) - info for devs writing ingestion code
- **domain_of**: Investigated - misses inherited slots (e.g., CauseOfDeath←Entity.id) and overrides. Computed "Used By Classes" is more complete.
- **owner**: Just first domain_of class - not meaningful. Already ignored in EXPECTED_SLOT_FIELDS.
  

##### EnumInput (41 total enums)

 | Field            | Count      | Decision                                                                                                                              | Notes                                                                                                          |
 |------------------|------------|---------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------|
 | `comments`       | 3/41 (7%)  | ✅ **DONE** - shown under description                                                                                                  | Array. ex: DrugExposureProvenanceEnum="Taken from OMOP Drug Type values..."                                    |
 | `include`        | 1/41 (2%)  | **LATER** - complex structure for including other enum values                                                                         | Complex structure for including other enum values                                                              |
 | `inherits`       | 3/41 (7%)  | ✅ **DONE** - shown as "Inherits Values From" section with clickable links                                                             | Array of parent enum names. ex: ConditionConceptEnum→['MondoHumanDiseaseEnum', 'HpoPhenotypicAbnormalityEnum'] |
 | `parent`         | 1/41 (2%)  | **LATER** - single parent (different from inherits)                                                                                   | Single parent string. ex: HistoricalStatusEnum→StatusEnum                                                      |
 | `reachable_from` | 9/41 (22%) | ✅ **DONE** - shown as "Reachable From (Dynamic Values)" section                                                                       | Complex: {source_ontology, include_self, source_nodes, ...}. Defines dynamic enum values from ontology         |
 | `see_also`       | 2/41 (5%)  | **LATER** - array of reference URLs                                                                                                   | Array of URLs. ex: DrugExposureConceptEnum→['https://bioregistry.io/registry/rxnorm', ...]                     |

##### TypeInput (7 total types)

 | Field                 | Count     | Decision                        | Notes                                                  |
 |-----------------------|-----------|---------------------------------|--------------------------------------------------------|
 | `exact_mappings_urls` | 5/7 (71%) | **ALREADY USED** - expanded from `exact_mappings` CURIEs, just missing from expected | Array of URLs. ex: `string`→['http://schema.org/Text'] |

##### ClassInput (51 total classes)

 | Field       | Count     | Decision                                                                                     | Notes                                             |
 |-------------|-----------|----------------------------------------------------------------------------------------------|---------------------------------------------------|
 | `class_url` | 1/51 (2%) | **Found**: comes from `class_uri: schema:Thing` in YAML, expanded by transform_schema | URL string. Only Entity→'http://schema.org/Thing' |

---
### render markdown in schema fields
- e.g., UnitOfMeasurementEnum.description contains markdown but is rendered in plain text in details
---
### slot names in class detail Slots table should be linked for hover and click like other element refs

---
### LinkOverlay fixes
- Edge labels: show on hover; tooltip display needs improvement

---

## 📚 Larger Refactoring Tasks

### Abstract Tree Rendering System
- Extract tree rendering and expansion logic from Element
- Enables consistent tree UX across Elements panel and info boxes
- See [detailed plan](#abstract-tree) below

### Reduce Element subclass code
- Most behavior should move to graph queries
- Element classes become thinner wrappers around graph data
- **Blocked by**: Abstract Tree system
- See [detailed plan](#reduce-element-subclass-code-details) below

### Grouped Slots Panel
- Display slots grouped by Global + per-class sections
- Show inheritance (inherited vs defined here vs overridden)
- Visual indicators for slot origin
- **Uses**: Abstract Tree system for rendering

---

## 🔧 Medium Priority

### Overhaul Badge Display System
- Show multiple counts per element (e.g., "103 vars, 5 enums, 2 slots")
- Add labels or tooltips to clarify what counts mean

### Detail Panel Enhancements
- Show reachable_from info for enums
- Show inheritance
- Slot order: Inherited slots at top

### Change "attribute" to "slot" terminology
- Throughout codebase

### Condition/DrugExposure Variable Display
- Show message that these are handled as records, not specific variables

---

## 🔮 Low Priority / Future Ideas

### Search and Filter
- Search: Important for exploring large schemas
- Filtering: Grouping provides a lot already

### LayoutManager rename
- No longer about "whitespace monitoring" - it's now MainLayout/AppLayout
- Consider renaming to better reflect current purpose

### Animation library
- Smooth animations for various interactions

### Initial render performance
- Chrome warning: `requestAnimationFrame handler took 75ms`
- Likely from element tree or link overlay calculations on page load

### Viewport culling for links
- Don't show links when both endpoints off screen

### Responsive panel widths
- Currently fixed: MAX_PANEL_WIDTH=450px, EMPTY_PANEL_WIDTH=180px

### Relationship Info Box - Keyboard navigation

### Neighborhood Zoom + Feature Parity with Official Docs
- See archived REFACTOR_PLAN for full details

---

## 📝 Detailed Plans

<a id="abstract-tree"></a>
### Abstract Tree Rendering System - Details

**Goal**: Extract tree rendering and expansion logic from Element into reusable abstractions.

**Current state**:
- Element class has tree capabilities (parent, children, traverse, ancestorList)
- Expansion state managed by useExpansionState hook
- Tree rendering handled in each component

**Proposed abstraction**:
- Create parent class or mixin with tree capabilities
- Element becomes a child of this abstraction
- Info box data structures as tree nodes
- Shared rendering components/hooks

[sg] i'm not sure when this was written, but it's not how i was thinking about
     it. the abstract tree is for rendering -- it's in the UI so it probably
     shouldn't be (closely) tied to Element. need to discuss before implementing

**Key insight**: All presentation data should be tree-shaped.

**Methods to extract from Element:**
- `toRenderableItems()` - tree → flat list with expansion
- `toSectionItems()` - tree → SectionItemData list
- `getSectionItemData()` - single element → SectionItemData
- `ancestorList()` - walk up parent chain
- `traverse()` - depth-first traversal

<a id="reduce-element-subclass-code-details"></a>
### Reduce Element Subclass Code - Details

**Implementation Plan:**
1. Simplify `getDetailData()` via tree abstraction (BLOCKED: needs Abstract Tree)
2. Move tree methods to Abstract Tree system
3. Consolidate flat collections (Enum, Type, Slot)
4. Simplify Element subclass constructors
5. Graph as primary for relationship queries (partially done)
6. Fix remaining "DTO" terminology in codebase

**Target state:**
- Element subclasses: ~30-50 lines each
- Presentation logic: components layer
- Tree logic: Abstract Tree system
- Relationship queries: Graph module

---

## 🧹 Documentation & Technical Debt

### Implement devError() utility
- Throws in development, logs quietly in production
- Replace silent `return null` patterns

