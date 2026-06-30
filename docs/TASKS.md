# Tasks

> **Active planning document** - Completed work archived to [docs/archive/tasks.md](docs/archive/tasks.md)
>
> **Development principles** - See [CLAUDE.md](CLAUDE.md) for architectural rules and workflow

---

## 🎯 Target release: 2026-07-30

Need to work backwards from this date to set intermediate deadlines for requesting,
receiving, and implementing stakeholder feedback.

---

## 🧭 Current round (post-2026-06-11 feedback) — TOP PRIORITY

Team-facing plan: [STAKEHOLDER_QUESTIONS.md](../temp-but-share-for-now/STAKEHOLDER_QUESTIONS.md).
Read that first — it holds the audience reframing and the **open questions for the
team** (view architecture, audience, links, terminology). This section is the
implementation backlog for the four new priorities. Items lower in this file are
re-tagged **[FEEDS]** (supports this round), **[LATER]**, or **[PARKED]/[OBSOLETE]**.

> **Audience reframing:** much of the real audience is **researchers** — data users
> ("what's in here / what does this mean?") and study designers pre-harmonizing their
> own study with BDCHM ("where would my variable fit?") — not only modelers/LinkML
> people. The four priorities below bend toward them.

**Dependency note:** once the Variable Library is live, the variable-drilldown portion
of the Explorer can be simplified — no deep variable views needed inside it.

### Priority 1 — Configurable terminology (was subtask 8)

Default to general-audience terms; LinkML term on demand.
- *property* (slot), *value set* / *permissible values* (enum), *property type*
  (range), *entity* (class).
- A vocabulary **config toggle**: general user vs. LinkML/modeler (possibly a
  data-modeler middle setting). LinkML equivalents in tooltips + links to LinkML docs.
- Status: **partially built.** The vocabulary is centralized as code config in
  `src/config/appConfig.ts` (`VOCAB` per audience, `ACTIVE_VOCAB`, `defaultVocab`);
  components read it via `DataService.getConceptLabel()` / `getTypeLabel()` /
  `getSectionLabel()`, and badge abbreviations are vocab-driven. The `researcher`
  vocab is active; a `modeler` vocab is filled in but INACTIVE (`defaultVocab =
  'researcher'`), with unresolved-term notes in appConfig.ts. **Remaining:** the
  in-app UI **toggle** to switch vocab at runtime (lowest priority — the machinery
  is the hook, no UI yet), and LinkML tooltips/links.

### Priority 2 + 3 — Focus view (compact selector + subset visualization)

Priorities 2 ("compact Kitchen Sink + multi-select") and 3 ("subset
visualization") turned out to be **one feature** and are now built as a third
view, **Focus**. Full design/semantics: **[FOCUS_VIEW.md](FOCUS_VIEW.md)**.

Focus = the Kitchen Sink with minimal differences: category-grouped multi-select
left panel, a containment digraph widget (`dag-browser-widget`) below it, and
middle/right panels scoped to the selected entities. Selection drives everything.

**Shipped:**
- ✅ Containment foundation (`c76fdcf`): `src/models/containmentGraph.ts`
  (FK-inversion heuristic, ported from `scripts/extract_containment_tree.py`),
  `DataService.getContainmentGraph()` (live-derived `{nodes,edges}`),
  `getCategoryGroups()`, 10 property-based tests.
- ✅ Focus scaffold + category multi-select selector + containment widget +
  panel-scroll regression fix (`d9f4cc8`).

**Remaining (ordered):**
1. **Restructure middle/right to reuse Kitchen Sink panels.** Rework
   `getFocusPanelSections`: middle = one **section per selected entity** (slots);
   right = **two-level** — entity (outer) × Ent/PVS/DT (inner). Remove the
   select/unselect affordance that leaked into middle/right (selection belongs
   only on the left selector + the widget). Restore inter-panel gutters.
2. **Add `<LinkOverlay>`** to FocusView (needs `relative` root + the gutters).
3. **Extract `useFloatingBoxes` hook** from LayoutManager; consume in both
   LayoutManager (no behavior change) and FocusView → working detail/relationship
   boxes in Focus.
4. **Widget select/unselect** shared bidirectionally with the left selector.
5. **Widget "show all entities"** option (full graph, not just the subset).
6. **Resizable panels** (draggable edges; Kitchen Sink uses flex gutters — likely
   `react-resizable-panels`).
7. **Floating Cytoscape diagram** (summonable node-link view of the subset;
   promote `public/has-a-mockup.html`).
8. **URL persistence** of `selectedClassIds` (`?focus=...`).

Then: retire stale mockups (`has-a-mockup.html`, `containment-graph.json`,
`has-a-graph.json`, `extract_has_a_graph.py`) once the in-app diagram replaces
them — see [PARKED] below.

### Priority 4 — Help mode (port from icd11-playground)

DOM-driven contextual help: `data-help-id` attributes + markdown content file +
`?`-toggled mode. Source in `../icd11-playground/web/src`: `hooks/useHelpMode.ts`,
`components/HelpPopover.tsx`, `utils/parseHelpContent.ts`, `assets/help-content.md`.
- Status: **not started.** Low-pri open question: extract as a shared package?
  Default: copy in now, extract later.

### Supporting / housekeeping for the release

- **URL state encoding** — deep-linking + working browser back button. Current app
  encodes some state but the back button is reportedly buggy; investigate root cause.
  States to encode: expanded entity, drilldown tab (slots / vars), open inline card.
- **Release checklist** for 2026-07-30 (QA, deploy path, feedback loop).

### Done (shipped — kept for reference)

- ✅ Entity Explorer as default view (progressive disclosure).
- ✅ Categorized entity list (`entityCategories.ts`) + subclass indentation.
- ✅ Default pinning (Demography, Condition, MeasurementObservation) + localStorage.
- ✅ Inline slot drilldown (Slots/Variables tabs, inherited/overridden tags, range
  badges, recursive nested drilldown).
- ✅ Inline enum detail card (permissible values, "used by"). **[FEEDS]** still TODO:
  CURIE *labels + definitions*, not just identifiers.
- ✅ Inline class detail card (merged into SlotDrilldown).

---

## 🅿️ PARKED — Containment heuristic de-fragility (revisit after demo)

**No longer parked: the containment graph itself.** The FK-inversion heuristic is
ported to TypeScript and live (`src/models/containmentGraph.ts`,
`DataService.getContainmentGraph()`), driving the Focus containment widget. The
Python mockups/scripts are now the *legacy* version; the in-app graph derives live
from the loaded model so it can't drift.

**Still parked — making the heuristic less fragile.** The override sets
(`VALUE_OBJECTS`, `NO_FLIP_SLOTS`, `EXCLUDE_HAS_A_TARGETS`, `SKIP_SUBCLASS_EXPANSION`)
are hand-curated and rot silently when the schema changes. Planned (after the demo
proves value): per-slot LinkML `annotations: { containment_direction: contains |
contained_by | ? }`, auto-generated from the current heuristic then human-reviewed
(Brian only touches new/ambiguous), plus a CI check that fails on un-annotated new
single-valued entity slots. `owns`/`owned_by` floated as broader vocab for the
`performed_by` family. See [FOCUS_VIEW.md](FOCUS_VIEW.md#containment-digraph-semantics-settled-enough-to-demo).

**Retire once the in-app Cytoscape diagram lands:** `public/has-a-mockup.html`,
`public/containment-graph.json`, `public/has-a-graph.json`, and the now-redundant
`scripts/extract_has_a_graph.py`. (`containment-tree-mockup.html` was superseded by
the `dag-browser-widget`.)

---

## 📋 Secondary backlog (supports the current round; not itself a priority)

> The ordered priorities for this round are in "Current round" up top. The items
> here are smaller polish/enablement tasks — tagged **[FEEDS]** where they directly
> support a current-round priority.

### Render markdown in schema fields  **[FEEDS]**
- e.g., `UnitOfMeasurementEnum.description` contains markdown but is rendered as plain
  text in detail views.
- Feeds the inline **enum detail card** (which still needs CURIE labels/definitions —
  see Done list up top).

### Slot names in class detail Slots table should be linked  **[FEEDS]**
- Should behave like other element refs (hover + click navigation).
- Feeds the inline **class detail card**.

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
### ⚠️ WIP: Class-specific slot definitions (Dec 15, 2025) - INCOMPLETE

**Problem reported**: DrugExposure's `quantity` slot showed Procedure's description ("The quantity of procedures ordered or administered.") instead of the drug-specific description.

**Root cause**: When multiple classes define the same slot name with different descriptions (e.g., Procedure, DrugExposure, DeviceExposure all define `quantity`), transform_schema.py was using the first definition and ignoring the rest.

**Instructions given**:
1. User showed screenshot of wrong description
2. Asked to fix so DrugExposure shows its own quantity description
3. Suggested adding `name` field to slot references in bdchm.processed.json to simplify UI code

**Changes attempted** (NOT WORKING - still shows wrong names in UI):
1. `scripts/transform_schema.py`:
   - Added `find_conflicting_slot_definitions()` to detect slots with different definitions across classes
   - Modified `transform_classes()` to create class-specific slot IDs (e.g., `quantity-DrugExposure`)
   - Modified `transform_slots()` to create class-specific slot instances
   - Added `name` field to slot references when ID differs from display name

2. `src/models/SchemaTypes.ts`:
   - Added `name?: string` to SlotReference interface

3. `src/models/Element.ts`:
   - Updated ClassElement.getDetailData() to use `slotRef.name || slot.name` for display

4. `src/components/DetailContent.tsx`:
   - Added `renderMarkdown()` function for table cell content
   - Updated `renderCell()` to render markdown in all string cells

5. `public/source_data/HM/bdchm.processed.json`:
   - Regenerated with class-specific slots

**Status**: UI still shows `quantity-DrugExposure` instead of `quantity`. The `slotRef.name` change is not being picked up. Needs debugging - possibly the dataLoader transform is not reading the `name` field from slot references.

---
### LinkOverlay fixes  **[LATER — gated on an open question]**
- Edge labels: show on hover; tooltip display needs improvement.
- **Gated on open question B** in [STAKEHOLDER_QUESTIONS.md](../temp-but-share-for-now/STAKEHOLDER_QUESTIONS.md)
  ("are the connecting links worth their screen real estate?"). Inline entity-summary
  cards + "Referenced by" lists may replace most of what links communicate; links may
  become an optional overlay / "Relationships" tab. Don't invest in link polish until
  this resolves.

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

### Grouped Slots Panel  **[OBSOLETE]**
- Was: display slots grouped by Global + per-class sections, with inheritance origin.
- **Superseded** — the Explorer shipped; slot grouping now lives in the inline
  per-entity drilldown (inherited / defined-here / overridden tags). Remove unless a
  Kitchen-Sink-specific need resurfaces.

---

## 🔧 Medium Priority

### Overhaul Badge Display System  **[MOSTLY OBSOLETE]**
- Was: show multiple counts per element with clarifying labels/tooltips.
- The Explorer entity table shipped with separate Props / Cls / Enm / Typ / Vars
  columns, which serves most of this. Any remaining gap is just badge tooltips.

### Detail Panel Enhancements
- Show reachable_from info for enums  *(note: reachable_from already shown in enum
  detail card per the unused-fields workspace — confirm and close if done)*
- Show inheritance
- Slot order: Inherited slots at top

### ~~Change "attribute" to "slot" terminology~~  **[OBSOLETE — REVERSED]**
- ⚠️ This is now **backwards** relative to Priority 1 (configurable terminology),
  which moves *away* from "slot" toward general-audience "property." Do not act on
  this. The codebase-internal naming cleanup ("attribute" vs "slot") is a separate,
  low-value concern from the user-facing vocabulary.

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

