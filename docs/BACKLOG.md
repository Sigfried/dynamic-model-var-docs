# Backlog

> **Deferred and parked work, with its full write-up.** Nothing here is
> scheduled; nothing here is finished. What is actually next is in
> [TASKS.md](TASKS.md), which links into this file.
>
> Several of these are **investigations, not fixes** — where a cause is marked
> unmeasured, it is unmeasured, and the standing rule is to measure before
> proposing one.

---

## Investigations

### Schema-defined ownership
#### Use a `has_part` / `part_of` slot hierarchy to define ownership direction

> Status: **proposal, 2026-09-17, nothing implemented.** TASKS
> [`ownership-slot-hierarchy`](TASKS.md). The findings below were checked
> against linkml 1.11.1 on a patched copy of `bdchm.yaml`; the scratch
> schema was not kept.

Siggie's question: *is there a way in LinkML to indicate ownership direction
between classes, so we would not need the classifier at all?*

**Short answer: LinkML has no metaslot that means "this slot owns its
target".** The schema can *carry* the assertions the classifier makes today,
but nothing in it can *derive* them — someone still decides, per slot, which
way ownership runs. What changes is where the decision lives and who can review
it. The classifier does not disappear; it shrinks to a lookup plus the induced
pass, which stays because it is derived from class `is_a` already.

#### What LinkML offers, closest first

Every metaslot in the 1.11.1 metamodel that comes near the idea, and why each
one falls short for BDCHM:

| metaslot | what it means in LinkML | why it does not settle ownership here |
|---|---|---|
| `inlined` / `inlined_as_list` | The target is serialized **by value** inside the holder rather than **by identifier**. The nearest native notion of containment. | It is a statement about data shape, so asking upstream to set it on ~90 slots is a change to the JSON contract, not to documentation. It cannot say *belongs to*: a back-pointer and a plain reference are both simply not inlined. And BDCHM already uses it inconsistently — 9 of 149 edges, two of them against our reading (`Specimen.parent_specimen`, `SpecimenStorageActivity.container`, see the since-removed value-object exception). |
| **slot `is_a` / `mixins`** (a slot hierarchy) | A slot can inherit from another slot the way a class inherits from a class — LinkML's `rdfs:subPropertyOf`. The child keeps its own name, range and cardinality and becomes "a kind of" the parent. | **Nothing.** Pure semantics, no effect on serialization, expresses both directions and "neither", and every LinkML tool can read it back. This is the proposal. |
| `subproperty_of` | Names an ontology property the slot specializes, as a CURIE. | The same idea without a local parent slot to hang a description on. Usable instead of, or in addition to, the hierarchy. |
| `inverse` | Declares that `A.s = B` implies `B.s' = A`. | Pairs two slots; says nothing about which side owns. BDCHM declares none. |
| `key` vs `identifier` | `key` is unique only **within a container** — LinkML's actual notion of a dependent object. | Every BDCHM class inherits a global `identifier` from `Entity`, so it discriminates nothing, and changing that is a modeling decision upstream will not make for a diagram. |
| `annotations` | Free-form key/value. | No semantics; nothing but our own code would know what it meant. The earlier idea of `annotations: is_value_object` (the since-removed value-object exception) is this option. |
| `relational_role` | Which role (subject, object, predicate) a slot plays on a **reified relationship class**. | Wrong shape: it describes slots of an edge-class, not the direction of an edge. |

#### The proposal

Two abstract slots, and every class-ranged slot declared `is_a` one of them:

```yaml
prefixes:
  BFO: http://purl.obolibrary.org/obo/BFO_

slots:
  has_part:
    abstract: true
    slot_uri: BFO:0000051            # "has part"
    description: The target is a part of the subject — the subject owns it.
  part_of:
    abstract: true
    slot_uri: BFO:0000050            # "part of"
    inverse: has_part
    description: The subject is a part of the target — the target owns the subject.

classes:
  Specimen:
    attributes:
      processing_activity:
        is_a: has_part               # own-fwd
        range: SpecimenProcessingActivity
        multivalued: true
  Participant:
    attributes:
      member_of_research_study:
        is_a: part_of                # own-bkwd
        range: ResearchStudy
```

`has_part` maps onto `own-fwd` and `part_of` onto `own-bkwd` exactly. An
`association` edge, should one return, is a class-ranged slot under neither.

**Two homes, in order.** First an **overlay in this repo**: a sidecar YAML
keyed `Class.slot → has_part | part_of`, applied by `transform_schema.py` at
sync time (it already reads the schema through SchemaView, and
`induced_class(c).attributes[a].is_a` is right there once the overlay is
merged), so `processed.json` carries an ownership field per attribute and the
app reads it. The two exception sets in `ownershipRules.ts` become the seed of
that file. Then an **upstream PR** to
[NHLBI-BDC-DMC-HM](https://github.com/RTIInternational/NHLBI-BDC-DMC-HM), the
same route `in-subset-categories` is waiting on — once merged, the overlay
no-ops and the assertions arrive with the sync instead of rotting here.

**What it changes in this codebase.** `OWNERSHIP_RULES` collapses to: read the
slot's ancestry; `has_part` → forward, `part_of` → backward. The
`REFERRED_TO_ENTITIES` and `NAMED_BACK_POINTERS` sets go — their content
becomes schema content. `child-following-parent` is untouched. The audit
script's job gets *easier* and *more important*: a class-ranged slot under
neither parent is exactly the row it should flag after every sync.

#### Verified 2026-09-17 (linkml 1.11.1, patched copy of `bdchm.yaml`)

- **SchemaView resolves it on BDCHM's inline `attributes:`**, not only on
  top-level slots — this mattered, since BDCHM declares nearly everything as
  attributes. `induced_slot('processing_activity', 'Specimen')` reports
  `is_a: has_part` with its own range and `multivalued` intact; walking `is_a`
  upward gives the verdict. An untouched attribute reads as unmarked.
- **`linkml-lint` raises no error** for abstract, range-less parent slots. (The
  only lint errors are two pre-existing ones — `year_range.comments` is a
  string where the metamodel wants a list — and are unrelated.)
- **`gen-doc` shows it on the slot page only.** `processing_activity.md` gets
  an *Inheritance* tree with `has_part` above it, and `has_part.md` lists every
  slot beneath it — a free index of all owning attributes. The **class page is
  unchanged**: the mermaid diagram still draws every class-ranged slot as the
  same `-->`, and the slot table has no new column; `is_a` appears only in the
  YAML dump at the foot. `inlined` is not rendered anywhere by `gen-doc`; the
  one LinkML generator that draws containment at all is PlantUML (`*--` for
  inlined slots). So conveying direction in **upstream's generated docs** would
  take a custom `gen-doc` template (`--template-directory`) that reads the
  hierarchy and draws composition arrows. Until then this app is the only
  renderer of BDCHM that shows ownership direction.

#### Decision needed before writing the overlay

**What does an unmarked slot mean?** Two readings, and they decide how much
upstream has to mark:

1. *Unmarked = forward.* Matches today's default rule; upstream needs `part_of`
   on the 59 backward slots and nothing else. But then "nobody looked at this"
   and "forward" are indistinguishable, which is the silent-staleness failure
   this whole file complains about.
2. *Unmarked = unclassified.* All 149 class-ranged slots carry a parent; the
   audit flags any that does not. More to write once; rot becomes visible.

Recommendation: **(2) for the overlay and the upstream PR, with the app still
falling back to forward** for an unmarked slot so a sync never blanks the
diagram — the audit, not the renderer, is where "unmarked" should hurt.

---

### Animating edge geometry

Deferred by Siggie 2026-09-09, after the boxes moved to `motion/react`. Edges
are SVG `d` attributes recomputed per layout, so they snap; today they fade
out on the click and back in `EDGE_ARRIVE_MS` after the new layout lands
(immediately on a fresh draw). Everything below is design, none of it built.

**Approach:** ELK gives the endpoints and corner points of both the old and the
new route, so animate by interpolating each point from its old position to its
new one — no path guessing, no library. With `motion.path`, that is
`animate={{ d }}`: motion interpolates a `d` string by pairing up its numbers.

**The hard case:** a route whose corner count changes between layouts. Motion
snaps when the number counts differ, so every route must be handed over with
the same point count N. **Chosen:** keep ELK's original vertices and **pad
extra points along the existing segments** up to N. The at-rest path is then
exact (even resampling would lose the corners), and the structure is always N
points. Fallbacks if that looks bad mid-flight: resample both routes evenly
(loses orthogonality in flight); or Siggie's **bezier idea** — draw a curve
between the moving endpoints *during* the transition, which needs no corner
pairing at all, and hand back to the orthogonal route when the move lands.
Siggie has ideas beyond these; do not invent a scheme without asking.

**Do first: stable edge keys.** Edge ids are `edge-${idx}`, assigned by
iteration order in [`containmentGraph.ts`](../src/models/containmentGraph.ts),
so the same relationship gets a different id after a selection change and
`edge-3` can name two different edges across layouts. `<AnimatePresence>`
keyed on those would morph one relationship into another. Key on
`(source, slot, target)`.

Also in play: the `opacity={dimmed ? 0.4 : 1}` attribute on context edges
would be overridden by motion's inline opacity — move it to `filter`, as the
hover dimming already was. `pathLength` on `motion.path` gives draw-in edges on
enter for one extra prop, if wanted.

### Edge crossings

> *"There are a lot of unnecessary edge crossings. I don't know how much we can
> do to fix them, but we should try."*

Layout is `useGraphLayout`. Cause not investigated. Do not speculate without
measuring.

### The bare diagonal

One approach in a convergence arrives as a **straight diagonal with no steps**
while its neighbours step once or twice, cutting across other boxes. Reproduce:

```
?sel=BodySite~Condition~Consent~Demography~Exposure~Observation~Procedure
&exp=ImagingFile~ImagingStudy~MeasurementObservation~SpecimenCreationActivity
```

**Root cause found 2026-08-21 (Siggie's diagnosis, confirmed): `bend` mode
degenerates when there is no corner to bend from.** `mergeDistFor(mode, pts)`
returns, for `bend`, the length of the LAST ROUTED SEGMENT. When ELK routes an
approach as a single straight run — which happens whenever the outermost fan
lane lines up with the source row, i.e. the TOP approach of a large convergence
— that "last segment" is the whole edge. `mergeCut` then walks back past the
source, `cut` lands at index 0, and the entire path becomes one straight line
from source anchor to shared arrowhead base.

Verified numerically: a 2-point route 1020px long yields `mergeDist = 1020`,
`cut = 0`. `near`/`far` are immune because their distance is a fixed 40/120px,
so the cut always lands on the horizontal run near the node.

So `merge-near` is not "better here" in general — **`bend` is simply undefined
on a corner-less route.** The fix is a **guard**, not a compromise: clamp `bend`
to `Math.min(lastSegment, nearDistance)`, or fall back to `near` when the route
has fewer than 3 points. Not implemented — Siggie chose to build the comparison
harness first.

⚠️ Three guesses were made before this and **all three were wrong**. Do not
theorise from the code; `?dbg=1` logs each convergence's routed approaches.

---

### One inheritance accessor, with a required argument

Inheritance is derived two independent ways today, and neither calls the other:

| path | used by |
|---|---|
| `getParentClass` / `getSubclasses` ([`Graph.ts`](../src/models/Graph.ts)) | only `buildContainmentGraph`. `getSubclasses` has **no callers at all**. |
| `DataService.getEdgesForItem(...)` filtered on `EDGE_TYPES.INHERITANCE` | [`RelationshipInfoBox.tsx`](../src/components/RelationshipInfoBox.tsx), [`LinkOverlay.tsx`](../src/components/LinkOverlay.tsx) |

**Decided 2026-08-24: route all inheritance derivation through one accessor
that takes a required parameter saying whether `Entity` inheritance is
included.** Not optional, not defaulted.

```ts
// shape, not final naming
getInheritance(graph, classId, { includeEntity: boolean })
```

Required is the whole point. A default is what let this rot in the first place:
`EXCLUDE_HAS_A_TARGETS` and `SKIP_SUBCLASS_EXPANSION` sat side by side as two
silent `Set<string>`s, and no call site ever had to say which behaviour it
wanted — so the ranges case inherited the inheritance case's answer by accident.
A required argument makes every caller state its intent, and makes a new caller
*fail to compile* rather than quietly pick up the wrong one.

| caller | `includeEntity` | why |
|---|---|---|
| `buildContainmentGraph` | `false` | drawing; the 53-edge fan is pure noise |
| `LinkOverlay` | `false` | drawing |
| `RelationshipInfoBox` | `true` | reporting a fact about one class |
| future Explorer inheritance view | `false` | drawing |

This replaces `SKIP_SUBCLASS_EXPANSION` entirely. The components must stop
filtering `getEdgesForItem` on `EDGE_TYPES.INHERITANCE` directly — that
filtering *is* the second derivation path.

### `any_of` ranges — the alternatives

Option 1 (leave it; assert it stays small) was taken — see
[OWNERSHIP_CLASSIFICATION §`any_of`](OWNERSHIP_CLASSIFICATION.md#any_of-ranges--not-handled-low-priority)
for the current state and the trigger that would reopen this. The alternatives,
for when a second slot grows an `any_of`:

2. **Fan out at graph-build time** — one `CLASS_RANGE` edge per `any_of` member,
   tagged so they can be styled as one polymorphic slot. Classification then
   works unchanged, per branch. Changes edge counts, layering, and every count
   in the docs. It also raises a question the diagram cannot currently express:
   **are three alternatives three edges, or one edge with three heads?** Drawing
   three implies the slot points at all of them simultaneously, which is false.
3. **A first-class polymorphic edge type.** Most faithful, most work. Only worth
   it if `any_of` becomes common upstream.

A cheap middle option, if the false root is the only thing that actually
bothers anyone: fan out `any_of` **for reachability only** — enough to keep
classes like `Assay` connected — while continuing to draw the single `Entity`
edge. That splits layout correctness from edge semantics and defers the harder
rendering question.

Two cheap things neither yet done, which would make the current state legible:

- **The label explains it.** `associated_artifact` gets a marker on the **row**
  saying it may point at an `Assay`, a `File`, or a `QuestionnaireResponse` —
  explained in the detail panel. A footnote on the row, not an edge label; the
  edge still points at `Entity`.
- **A note on `Assay`** explaining what attaches to it, so the false root is
  legible rather than mysterious.

## Diagram and layout

### The fan from `ObservationSet.observations`

**The source-row half shipped 2026-08-31 (`4bd5755`).** Each
`…ObservationSet.observations` edge now leaves its OWN row.

The cause was not the merge logic. The view model was always right; the row port
id in `buildSpec` was keyed on the slot NAME alone, so the parent row and every
child override claimed one port and `addPort` kept only the first — every later
edge silently inherited the first one's y. Which row won depended on enumeration
order, so it looked like two different bugs. [`src/test/mergedEdges.test.ts`](../src/test/mergedEdges.test.ts)
asserts on the PORTS, since the pre-existing anchor assertion passed throughout
the bug's life.

**The rule, and it stands unqualified: one edge per DECLARING class, coloured by
that class**, black for the parent's own slot.

> *"ObservationSet.observations should be one black edge;
> DimensionalObservationSet.observations should be one blue edge (ideally to
> DimensionalObservation but could be Observation because of edge crossings)."*

Rejected: **keep-and-explain** — it needs explaining *because* it is not
working, and documentation is not a fix for an unreadable diagram. Rejected as a
blanket rule: **one black edge for everything** — `observations` is narrowed per
subclass, so one black edge drops the fact that each set holds its own kind.
That is real information loss.

⚠️ **`ObservationSet.observations` is drawn, not suppressed** (Siggie,
2026-08-27). `ObservationSet` is a concrete class — no `abstract: true` — that
declares `observations` and has subclasses narrowing it, so its edge represents
a real slot on an instantiable class.

**⬜ Still open:** the parent's own edge renders in the shared channel colour,
not black as specified. **Confirm whether black is still wanted.**

Also in scope: the missing `Specimen.quality_measure` edge — same subsystem,
same merge-suppression cause.

### Chip strips → relation counts + menu

> *"I think we need something other than chip strips. They're ugly and also tend
> to have text overlap."*

Confirmed: Observation carries 13 `owned by` chips over three wrapped lines plus
an `owns` strip plus `add all` — the box is mostly chips before it is mostly
content.

**Keep the underlying model.** "Relations that exist but are not drawn" is sound
and is what stops Organization being a dead end. It is the *presentation* as
inline wrapped chip strips that fails, and it fails structurally: a wrapped strip
makes box height unpredictable, which changes edge anchoring.

**Four ownership positions plus association**, from a single entity's
perspective — the distinction Siggie insisted on, correctly:

> *"I'm not sure I'm happy with the new `hiddenOwned` getting merged with owns.
> The distinction is sort of like 'mine because I say so' and 'mine because it
> says so'."*

|  | declared on me | declared on them |
|---|---|---|
| **I own it** | own-fwd (my attribute) | own-bkwd flipped (their FK) |
| **it owns me** | own-bkwd (my FK) | own-fwd (their attribute) |

⚠️ **Implementation consequence:** the DAG **flips `own-bkwd` at graph-build
time** ([`containmentGraph.ts`](../src/models/containmentGraph.ts)), so by the time you hold `parents`/`children` the
declaring side has been erased. Recovering it means **carrying the verdict
through the DAG**, not just the direction.

**Associations must be surfaced** — they appear in neither strip today.
`ASSOCIATION_SLOTS` = `related_document`, `container`.

**Shape:** replace N inline chips with a **count per relation type**, expanding
to a menu. Rows and a cascade are compatible — the rows **are** the top level of
the cascade, and a fixed-height row per category is what makes box height
predictable. **Re-hiding: include it** — clicking a shown entity re-hides it,
which preserves the drawn/undrawn state chips would otherwise lose.

*(Partly overtaken by the relation bar, which shipped 2026-09-04 and replaced
the cascading menu. Kept because the four-position model and the fan-out problem
below are unaddressed by it.)*

#### Fan-out — why `add all` is dangerous

MEASURED. `expand` adds exactly one id, so the extra boxes are not the click —
they come from [`ownershipSubgraph.ts`](../src/models/ownershipSubgraph.ts), where **one-hop-up is applied to every
core node including newly expanded ones**, capped at 5.

Probe: Participant alone → 4 boxes. Expanding DimensionalObservation → **7
boxes**, because its parents are `Organization, DimensionalObservationSet,
Participant, Visit`; two are already drawn, so the other two arrive uninvited.
**One chip clicked, three boxes appeared.** `add all` multiplies it: ~4 ids each
pulling up to 5 owners — roughly 4 requested, up to ~20 drawn.

Siggie is **inclined to distinguish selection from expansion** (expanded nodes
arrive bare; their owners appear as counts to expand from) — *"but let's see
where we end up with chip strip replacement before implementing."* **Deferred
deliberately: the redesign may dissolve the question.**

### "Hide all" leaves boxes behind with nothing shown

> *"I guess this is correct but a little surprising. Maybe consider dealing with
> eventually."* **Filed, not scheduled.**

Repro: select MeasurementObservation → `add all` *belong to me by my attribute*
→ on BodySite, `add all` *I belong to, by their attribute* → on
Observation/MeasurementObservation, `hide all` *belong to me by my attribute*.
Several classes stay drawn reading **`N related · 0 shown`**, some with no edges.

**It is correct, and that is the point.** Those classes were added a second time
by BodySite's `add all`, so they are selected in their own right. Nothing tracks
"who asked for this", **by design** — that is exactly the provenance the
selected/expanded merge deleted.

So the surprise is not the removal semantics; it is that **a box can survive
with `0 shown` and no edges**, which reads as breakage. Options, cheapest first:
(1) do nothing; (2) style the `0 shown` / edgeless case so it reads as
deliberate; (3) have `hide all` offer to drop the boxes it just orphaned.

**Do not** solve it by making `hide all` cascade through provenance.

### Dragging is unfinished

Works: drag, drop-in-place, edges re-routed, amber border, drawer no longer
pops open mid-drag. (Double-click-to-release was removed 2026-09-09 as an
undiscoverable affordance; pins drop on the next relayout anyway.)

Missing:

1. **No obstacle awareness.** `smoothStepPath` routes between two anchors and
   knows nothing about other nodes, so a moved node's edges cross boxes ELK
   would have routed around. **ELK cannot fix this** — see WORKLOG for why
   `noLayout`, `Fixed Layout`, INTERACTIVE and libavoid are all dead ends. The
   real fix is an orthogonal obstacle router (A*/visibility graph), pure
   geometry, testable in [`paths.ts`](../src/explore/graph-core/paths.ts). **Not scoped — needs Siggie's go-ahead.**
   - [sg] low priority because it seems hard to accomplish
2. **No URL persistence.** Moves live in `OwnershipGraphView` and vanish on
   reload. Siggie wants dragging permanent, so they should lift to `ExploreApp`
   and encode alongside `?sel=`. Note coordinates are layout-dependent —
   a move saved against one selection may land oddly in another.
   - [sg] wrong, or i changed my mind. do not persist dragged node box positions
          on `sel` changes

### dag-browser

Siggie's list, verbatim: *"writing on top of itself (or the rows are anyway)"* ·
*"needs horizontal scroll"* · *"needs panel resizing"* · *"maybe should allow
panel to be detached and moved"* · *"what happened to categories"*.

**Diagnosis for the first two:** the widget ships `.dbw-row { white-space:
nowrap }` with no overflow handling, so its own cross-reference text runs past
the panel edge and paints over neighbouring rows. `renderRow` truncates the
class NAME, but the xref markup belongs to the widget, so it cannot be fixed
there. `0c6cfdc` attempts a CSS-only fix (horizontal scroll on `.dbw-root`,
`width: max-content` on rows, xref notes clamped to 18ch) — **unverified
visually.** If it does not hold, the honest options are patching the widget
upstream (npm dep at `^0.2.0`; no local copy) or dropping its default row chrome.

**No horizontal scroll in the tree — MEASURED**, and re-verified 2026-08-28:
[`selectionTree.css`](../src/explore/selectionTree.css) puts `overflow-x: auto` on `.dbw-root`, but [`ExploreApp.tsx`](../src/explore/ExploreApp.tsx)
wraps it in `<div className="flex-1 overflow-y-auto min-h-0">` — **that**
ancestor is sized to the fixed `w-96` panel, so it clips first and the inner
scroll container never has anything to scroll. Fix belongs on the ancestor — but
see the chip-strip work first; scroll may not be the answer.

**"What happened to categories" — a design question for Siggie, not a bug.** The
tree is built from `getContainmentNodes()`, i.e. the OWNERSHIP graph, which has 7
roots. It has **nothing to do with `ENTITY_CATEGORIES`**. Categories did not
break; they were never in the tree. Options: categories as an expanded TOP LAYER
above the ownership roots (Siggie's own earlier idea — they predicted *"a lot
more duplicates will appear, across categories"*); two separate trees; or keep
the flat list as the primary selector. The `☰ flat list` / `⑃ tree` toggle
was removed from the panel 2026-09-10 (Siggie: "for now"); the tree is one
constant away in `ExploreApp.tsx` (`selectorMode`), so it is still comparable
side by side when wanted.

**Panel resizing / detaching: NOT attempted.** Resizing is small; detaching is
not, and `dockview-poc` (an old branch, 153 behind) suggests this was explored
before — read it before designing anything.

### One-hop default — largely obsolete

⚠️ Superseded: automatic one-hop-up owners and the cap were removed. The
diagnosis is kept because it is *why* the automatic hop was never enough.

**Organization has no owners** (it is a DAG root) and **no un-flipped ownership
slots** — it owns 14 things, but every edge is stored on the other class
(`Observation.performed_by → Organization`). So one-hop-up finds nothing and
there are no rows to expand downward: a genuine dead end, while the tree shows
"14" beside it.

The warning still applies to any strip work: a second chip strip **changes box
height and therefore edge anchoring.** Check that edges still point at the right
rows on a box that has both strips.

---

### Move the category specs into LinkML `in_subset`

**Blocked on an upstream PR. Write no code until it is approved and merged** —
until then the field does not exist to read.

LinkML has an `in_subset` field, declared against a `subsets:` block, that can
tag classes, slots, enums or types. Our entity categories are exactly that kind
of grouping, so they belong upstream in the model rather than hand-maintained
here. This is the standing fix for category rot: today a sync that adds a
class silently drops it from the UI, and only the `findUncategorizedClasses`
guard catches it. If the schema carries its own grouping, the category list
arrives with the sync.

As of `d3c7c58` upstream has **no** `in_subset` and no `subsets:` block —
`grep -c in_subset bdchm.yaml` is 0. (The string does occur in
`bdchm.processed.json`, as an empty list in a LinkML default-filled `any_of`
block. It is not data.)

**What migrates cleanly:** `classIds` — which classes are in a category — is
exactly a subset membership, and LinkML allows a class in several subsets,
which is what `DUAL_LISTED` already does by hand.

**What does not, and has to stay here or find another home:**

- `label` and the **order** categories appear in. `subsets:` carries a name and
  description; presentation order is ours.
- `pins` — outside classes drawn alongside a category's members. Explicitly
  **explanatory, not structural** (Siggie, 2026-09-04): a mechanically derived
  version was tried and rejected. The schema has no place for that judgment.
- `SUBCLASS_OF`, `NESTED_TABULAR_DEFAULT_PINS`, `UNCATEGORIZED_BY_DESIGN`. The last one is the
  guard's recording mechanism and only gets more important — if the categories
  come from upstream, a class in no subset is the same silent-disappearance
  bug wearing a different hat.

So the end state is a split, not a deletion: membership upstream, presentation
and explanation in [entityCategories.ts](../src/config/entityCategories.ts).
Worth deciding before the PR is written, because it determines how many subsets
to propose and whether `other` is a real subset or the absence of one.

**Sequence:** propose `subsets:` + `in_subset` upstream → PR approved and
merged → sync → then teach [transform_schema.py](../scripts/transform_schema.py)
to carry the field through (it is dropped today) and read it here.

---

### Enum detail in the Explore drawer

Clicking a purple enum badge in the Explore drawer does nothing. This is by
construction, not a bug in the handler: [DetailDrawer.tsx](../src/explore/DetailDrawer.tsx)
`RangeBadge` renders a `<button>` only when `isEntity`, so class ranges
(`Quantity`, `BodySite`, `Visit`) navigate and every enum falls to the inert
`<span>` branch. Its doc comment states the rule outright — *"primitives and
enums are plain badges."*

**Nested Tabular already has the feature**, in components the Explore view does
not import. `EntityTable` → [SlotDrilldown](../src/components/SlotDrilldown.tsx)
→ [EnumDetailCard](../src/components/EnumDetailCard.tsx) opens an inline card on
an enum badge, showing: description, `inherits`, `usedBy` (clickable
`Class.slot` back-references), and a values table of key + description capped at
`MAX_SHOWN = 15` with a "… N more values" row. Those components reach the app
through `EntityExplorer` → [src/main.tsx](../src/main.tsx) → **previous.html**;
`src/explore/` references none of them. ⚠️ Do not read a grep hit on
`EnumDetailCard` as "the Explore view has this" — that mistake was made
2026-09-16.

**Two options, and they are genuinely different work:**

**(a) Make the badge live.** Reuse the Nested Tabular card, or an equivalent, so
an enum badge opens its values in place. Small, and it is the part Siggie
noticed. `getRangeKind` already distinguishes enums reliably (do not suffix-test
the name — `SpecimenCollectionMethodType` is an enum that does not end in
`Enum`, the only one of 52).

**(b) Decide what an enum's detail *is* in this view.** Does an enum become a
navigable drawer target like a class — with its own back-navigation and
`REFERENCED BY` — or an expansion in place? That is a design question about the
drawer, not a wiring fix, and it is the one that has to be answered before (a)
is more than a patch.

**Scope, per Siggie 2026-09-16: everything Nested Tabular exposes**, not enums
alone. Nested Tabular is believed to be a superset of Kitchen Sink — worth
checking when this is picked up, not assumed. Enums are the visible instance
because the badges are right there and dead.

**The values got richer on 2026-09-16.** The `d3c7c58` sync added a large batch
of `meaning:` CURIEs (OMOP, OBA) to these enums. `EnumDetailCard` does not show
`meaning:` at all — its table is key + description — so even reusing it as-is
leaves the newest data invisible. Whatever ends up in the Explore view should
decide about `meaning:` deliberately.

Not the same as [`schema-comments`](TASKS.md), which stays its own task: that is
LinkML's `comments` field on slots and classes, which are silently discarded.
Enums already surface `comments` through `getExtendedDescription`.

### `multi-hole-scrim` — one dimming layer with several holes

**Low priority; there is a working answer today.** A `Spotlight:` naming
several elements draws one `.help-spotlight` per target, and each carries its
own `0 0 0 9999px` page-dimming shadow — so N rings give N layers of dimming,
and each ring's hole is darkened by the others' shadows.

`Highlight: ring` avoids it by dropping the scrim entirely, and **the stacked
look is not a bug**: Siggie, 2026-09-17, on the `rows-and-dots` "an entity"
beat — *"the dimming with two spotlights is a little weird, but i actually like
it better than the legal behavior"*. The content test warns rather than fails.

So this task is not a fix, it is a THIRD rendering: one overlay element with a
`clip-path` punched once per spotlight, giving even dimming with several clean
holes. Roughly: render a single `<div class="help-scrim">` when there is more
than one spotlight, build `clip-path: polygon(...)` or a `path()` from the
spotlight rects, and drop the per-ring `9999px` shadow in that case.

⚠️ **Do not treat it as a correctness fix and quietly delete the stacked
look.** It is the authored default and Siggie prefers it on at least one step;
if this lands, `Highlight:` gains a third value rather than losing one.

### `variable-box-width` — let a box be as wide as its longest row

**Low priority, and an exploration before an implementation.** `NODE_W` is a
fixed 240px ([OwnershipGraphView.tsx](../src/explore/OwnershipGraphView.tsx)),
so a long range name has to truncate: 35 of the schema's 87 distinct range
names are over 18 characters, up to `SpecimenProcessingActivityTypeEnum` at 34,
and at 9px that is ~160px competing with the attribute name for a ~206px row.

Siggie, 2026-09-17, on being told widening was not an option: *"it could be,
but that's probably a pretty significant fix since the calculated width would
need to be fed back to ELK. I don't have a sense of how much width variation
there would be… don't explore it now."*

**So the first deliverable is a measurement, not a patch:** per-class, the width
the widest row would need, and therefore how much variation a variable-width
canvas would actually show. If the spread is small the whole idea is moot; if
it is large, the question is whether a few wide boxes are better or worse than
uniform ones. `NODE_W` is read in ~10 places including every edge-port
calculation, and the measured width would have to reach ELK before layout —
which is the "significant fix" part.

⚠️ **Do not confuse this with the truncation bug already fixed** (2026-09-17):
range and cardinality shared one `max-w-[90px] truncate` span, so on those 35
long-named rows the cardinality was clipped or pushed out entirely. They are
separate flex children now — only the range name truncates, the cardinality
always renders, and the row's `title` carries both in full. That fix does not
need this task, and this task would not have fixed that.

---

## Code health

### Palettes that only half-exist

> *"What's the point of even using palettes if the color is hard-coded all
> around it anyway."*

`APP_CONFIG.elementTypes.type` reads `hex: RANGE_COLORS.dataType` — the palette
— and then eleven hand-picked Tailwind literals beside it (`bg-green-700`,
`text-green-700 dark:text-green-400`, …). Each element type's color exists
**twice**, in two forms that cannot be derived from one another, and only one is
the palette. Changing `RANGE_COLORS` moves the SVG hex and nothing else. That is
why the P1 swap needed a by-hand rewrite of two whole color blocks instead of an
edit to one array.

**The trap:** `ElementTypeMetadata.color` is shaped for Tailwind class strings,
and Tailwind v4 only emits classes it finds **literally** in the source, so the
strings cannot be built at runtime from a hex. Any fix must pick a lane:

- **Generate the CSS from the palette** — emit custom properties from
  `RANGE_COLORS`, have components read `var(--…)`. Kills the duplication
  outright; costs a pass over every consumer of `color.link` / `.headerBg` /
  `.badgeBg`.
- **Keep Tailwind, derive the hex from it** — cheaper, but leaves the palette
  named after ColorBrewer while actually being Tailwind's approximation of it.
- **Narrow what the config carries** — most of the eleven roles may not be
  needed. Count real usages before designing anything.

The duplication is now **load-bearing** in a way it was not before, since the
palettes document an intent the Tailwind half quietly does not honor.

### Dead code left by the relation bar

`buildRelationGroups` survives, feeding `countsOf` for `NodeVM`'s
`relatedCount`/`shownCount`. **Nothing renders those two fields any more** — the
bar computes its own counts — so this is a second layer of dead code inside a
live file. Removing it means touching `NodeVM`, both node-VM construction sites,
and `RelationGroupVM`/`RelationItemVM`. Deliberately not done in the same pass as
the UI change.

### Overlays: one model, draggable and resizable

**The symptom** (Siggie, 2026-09-08): *"open legend, open detail panel, detail
appears underneath legend."*

Not a z-index fix. `DetailDrawer` is an **in-flow flex column** (`w-96
shrink-0`) in the main row, while the legend and example-cases panes float over
it — two different layout models, so the legend covers the drawer by
construction rather than by ordering.

**Decision (Siggie):** the drawer becomes an overlay, and the overlays become
**draggable and resizable**. Checked: `DetailDrawer` is the only drawer in the
app, rendered at exactly one call site (`ExploreApp.tsx`), so there is no second
one to keep consistent with.

⚠️ **Scoped down 2026-09-08**, and the cheap half **shipped the same day** as
HELP_PACKAGE_PLAN §1b — Siggie: *"don't do any heavy lifting for the overlays."*

| surface | draggable now? | why |
|---|---|---|
| legend, example cases | **yes**, together | both render into ONE frame, [`HelpPanel.tsx`](../src/explore/HelpPanel.tsx). The handle is its header, and CSS `resize: both` is a free native resizer. |
| step popover | **yes** | handle is its title. §1 removed everything that recomputed its position, so a dragged `left`/`top` survives; it resets on each step change. |
| `TourMap` | no, and should not | a centred modal over a dimmed backdrop that closes as soon as you pick a step. Its own CSS calls it *"a chooser, not an inspector you keep open beside your work"*. |
| detail drawer | **no** — this is what remains of this item | in-flow `w-96 shrink-0` flex column. Dragging it requires making it an overlay first, which IS the layout change this item is about. |

So the **symptom above is still not fixed**: the legend still covers the drawer,
because the drawer is still in flow. What shipped buys is that you can now drag
the legend off it.

✅ **Dragging is unblocked** — the positioning migration (HELP_PACKAGE_PLAN §1)
shipped 2026-09-08, and it was the right way round. `popoverPosition` no longer
returns a computed `left`/`top` at all, so there is nothing to stomp a dragged
one: a popover the browser is not repositioning simply stays where it was put.
The RING, which is the consumer that genuinely needs continuous tracking (a
dragged box must not slide out from under its own highlight), gets it from
`anchor()`/`anchor-size()` for free.

The alternative considered and not taken was to split the two consumers — poll
for the popover only until its anchor first resolved, and give the ring a
`ResizeObserver`. Siggie, 2026-09-08: *"i generally think that finding the screen
position of one thing and then using that to set the position of another thing
is kludgy and css should make it so we don't have to do that."* That made the
split the worse deal: it would have kept the measure-then-position machinery
alive and paid for the drag by adding one more piece of state to it.

What remains of this item is the DRAWER: making it an overlay like the others,
and giving the three of them one drag/resize model. The drag mechanism itself is
built and shared — [`useDragged.ts`](../src/help/useDragged.ts) — so the work left
is the layout change, not the interaction.

⚠️ **"Apply the change before anchoring" does not work as a fix**, considered
and rejected 2026-09-08. There is no synchronous moment when a step's `Change:`
is "done": the chain is push change → React re-render → new graph spec → **ELK
lays out in a worker** → async result → boxes render. The layout is genuinely
off-thread, so nothing can order itself behind it. The existing 600ms
`WAIT_MS` cap — hold the popover hidden until the anchor resolves, then give up
and centre — is the right shape for that problem, and it survived the
positioning migration for exactly that reason: "has the element appeared yet" is
a different question from "where is it", and only the second one went away.

---

### Show the change instead of narrating it

**The complaint** (Siggie, 2026-09-08): *"When, e.g., relationship-kinds pops
up the action has already occurred and the `Action:` text does not make the
step more legible."*

`Action:` renders as a past-tense receipt (`✓ ticked Participant`). That reads
well when the VIEWER did the thing — it confirms their click — and badly when
the tour did it off-screen, because it narrates a transition nobody watched.

**The sequence Siggie wants**, per step that adds an entity:

1. anchor on the unchecked selection row
2. check the box
3. anchor on the entity that just appeared

Authored by hand today: three beats where there was one, which is the cost
Siggie named — *"that makes a lot more steps"*. The first tour's opening step
is written this way as a trial (2026-09-08); reverse it if it reads worse.

**The feature** is deriving that from one authored beat: a `Change:` naming
entities not yet drawn expands into the two-phase move automatically, with the
anchor following. `Action:` then becomes derivable rather than hand-written,
which is what makes the receipt honest.

**Why it needs design, not just code.** The change is applied in one shot
today; splitting it means the popover repositions BETWEEN phases, so the step
needs a notion of "before" and "after" that the position model does not have.
It also collides with `back`: a half-applied step is a state the stack cannot
currently name. Animation was floated and explicitly deprioritised — *"i don't
want to get bogged down in that if it isn't easy to implement"*.

⚠️ **The `Action:` requirement is a WARNING now, not an error** (2026-09-08),
in both the content test and the app (dev-only, on the `showAddresses` switch).
That was a precondition for trying the hand-authored version, since the honest
remedy is sometimes to show the change rather than describe it. If this feature
lands, revisit whether the rule should bite again.

---

### Tour authoring notes + draft preview

Four distinct needs, all currently served by HTML comments:

| Want | Sketched as | Renders? |
|---|---|---|
| Notes to self | `- **Note:** …` | never |
| Half-written copy | `- **Draft:** …` | yes, marked loudly as unfinished |
| Instructions to Claude | `- **ForClaude:** …` | never |
| A step written but not ready | `- **_Tour:** 4` | **shipped** |

**The parking half is already done** — prefixing any field with `_` drops an
entry out of the tour while keeping it as help.

**The interesting part is the draft preview**, and it is why this is a task
rather than three fields: viewing a tour *including* its parked steps and
unfinished `Draft:` text means a **second rendering mode**, not just a parser
change. Worth designing rather than bolting on.

Also parked: **multi-line for `Context:` / `Action:` / beat text** — deliberately
not done, *"1 for now; may need 2 soon"*. `extractBlockField` is generic, so each
is a one-line change.

Until then: HTML comments work, never render, and are what the S3a translation
already uses.

---

### Drop `sibs=0`

Siggie, 2026-09-08: *"let's just get rid of sibs=0. i never use it anyway and it
really crowds the canvas."*

The anchor-kind half of this item **shipped separately** as
[HELP_PACKAGE_PLAN §1a](HELP_PACKAGE_PLAN.md#1a-flat-anchor-tags--shipped-2026-09-08):
flat `data-help-id` tags, `child-header:` for a merged child, and `node-box:` on a
merged child simply not resolving. That did not need `sibs=0` removed —
`child-header:` and `node-box:` name different things in either mode, so the
vocabulary is unambiguous with the toggle still there.

**Half done 2026-09-10.** The `⑃ siblings` button and the `if (!mergeSibs)
return baseVm` branch are gone, so siblings always merge; the help entry that
anchored on the button is now `merged-boxes` with no anchor. Removing the button
was folded into the induced-ownership work (`child-following-parent`) because always-merged is
what makes induced edges collapse onto one line. The rest is still plumbing.

**Why this is its own piece of work.** It touches more than the anchors: a URL param and its `DEFAULTS`/`toQuery` handling
(`exploreState.ts`), a localStorage key (`LS_KEYS.sibs`), the tour state stack
(`tourStateStack.ts`), the toolbar toggle and `rememberPreference`
(`OwnershipGraphView.tsx`), `ExploreApp`'s `mergeSibs` state, and the unmerged
render path itself. `FORMAT.md`'s param table lists it too.


---

### `goTo`'s silent no-op

[`HelpProvider.tsx`](../src/help/HelpProvider.tsx): `goTo`, `goToStep` and
`startTour` each bail on a bad index or an empty tour with a bare `return` —
no error, no warning, no retry.

⚠️ **This stopped being hypothetical on 2026-09-08.** The write-up below was
about a race that cannot happen; the silence is what actually cost time, twice
in one session, and both times the code was *reached* with state that made it
return:

- `goToStep` returns on `tourIndex === null`. The tour map called it after
  `endTour` had left `tourName` set, so every click did nothing.
- The same guard swallowed the deep-link jump deferred into a
  `requestAnimationFrame` whose closure predated `startTour`.

Both are fixed at their own root, but neither would have taken more than a
minute to find if the guard had said anything. **A guard that returns silently
turns a wrong caller into a dead UI, and a dead UI reads as "weird state"** —
which is exactly how Siggie reported them.

**Not a race, though.** `positions` comes from a STATIC markdown import, so it
is populated on the first render and no caller can lose that race.

**Why it is still worth fixing.** It is a trap sized for the next person who
calls `startTour()` from somewhere new. It cost real time on 2026-08-28: `?tour=1`
was not working, this looked like a satisfying explanation, and a deferral was
built for it before instrumentation showed the actual cause was URL timing. **A
silent failure that *looks* like the answer is worse than one that does not.**

**Loud is the right call** — a `console.warn` on each bail, naming which guard
and what it was asked for. The deferral version adds real state for a case that
cannot currently happen, and the complaint is the silence, not the behaviour.
(It was written and reverted the same day; never committed, so it would have to
be written again.)

---

## Tours and content

### The `why` argument — two audiences, one step

**Resolved, in two rounds — the second reverses part of the first.**

**2026-09-11: one audience, researchers.** The detail stays, because a
researcher (or anyone) who needs to get into the weeds, author their own schema
or harmonize to this one needs the full explanations.

**2026-09-17: the LinkML argument gets its own tour after all.** Siggie, on
being asked where the orphaned LinkML paragraph should go: *"add a new tour for
LinkML context, why to use the Explorer oriented to LinkML people / modelers"*
— and, on where it sits, *"put the linkml tour before ownership. researchers
can read if interested but it will attract the eye of linkml people."* So the
two audiences are served by two tours rather than by one step trying to carry
both, which is what made this unresolvable. That tour is **What BDCHM is built
with**; the researcher-facing whys open **Using the Explorer**, because *"no
one's going to go to the end of tour 1 to see the why."* The chooser
deliberately does NOT say which tour is for whom.

The discussion below is kept as it was, because the two-readers diagnosis is
what the two-tour split is an answer to.

Parked 2026-09-08, mid-discussion. The `why` entry closes tour 1 and is meant
to answer *why use the Explorer*. It does not currently work, and the reason is
that **two different readers need two different arguments**, which one step
cannot carry.

**The researcher** needs *what is in this model and how do I find my way
around it*. For them the provenance chain below is background they will never
need. Note their entry point: the `You may want to use BDCHM:` list (analyze
harmonized data / harmonize your own / design pre-harmonized studies / take
ideas for your own model) reads as unconvincing BEFORE you know what the model
is — Siggie's own objection. It probably belongs after the category walk, not
before it.

⚠️ **That list is the most important thing for the stakeholders** — their
priority is getting this to researchers — even though it is not what a
first-time researcher needs first. Worth a session of its own: three of the
four uses (analyze, harmonize, design) suggest genuinely different ENTRY
POINTS into the same data, which is a larger idea than a tour step.

**The LinkML-aware reader** needs *why prefer this to the generated docs or to
reading the YAML*. This argument is **absent from the app entirely** and is the
one with money attached: Siggie has had significant interest from the LinkML
community on earlier versions that never got off the ground, and the outcome
worth optimising for is someone finding it compelling enough to fund
generalizing it beyond BDCHM. For this reader the provenance chain is not
background, it is the CREDENTIAL — dm-bip being a LinkML package is what makes
the app generalizable rather than bespoke.

**The provenance chain**, which Siggie listed and was unsure how to structure:

- BDCHM's place in BDC
- its place in the data ingest / harmonization pipeline
- the pipeline's place in LinkML (dm-bip is a LinkML package)
- the Explorer's place in all of that

It is a **nesting, so it is a picture, not prose** — four consecutive "X's
place in Y" sentences read as an org chart. Same request as
[TASKS.md](TASKS.md) `pictures`' diagrams ("NOT ascii, looking like the app"). One
diagram with the Explorer highlighted serves both audiences: the researcher
skims it, the LinkML reader reads it as positioning.

**Where it probably lives.** Not as a tour step. Someone evaluating whether to
fund this will not click through a guided walk to find the pitch. It wants the
surface you land on BEFORE choosing a tour — which is the Overview panel (see
the tour map, below). Whether `why` is then deleted from tour 1 or kept as a
closing step with the panel carrying the longer argument is **undecided and is
Siggie's call.**

Already done: the `Once: intro` key and its alert are gone from the entry — the
alert said *"This tour will introduce you to all of BDCHM Explorer's major
features"*, which was an OPENING line sitting at the end and was inaccurate
besides, since tour 1 is about the model and tours 2-5 are the features.

---

### The Overview panel's content

**The map itself SHIPPED** 2026-09-08 (`ece5e56`, `b0829d6`, `d0519dc`):
`src/help/TourMap.tsx`, one component at two scopes — the running tour's steps
behind the ⊞ on the popover's counter line, and every tour behind the chooser's
**Overview** row. Clicking a step jumps to it, or starts that tour there.

What is left is **content, not structure.** The panel lists tour names, their
`TourMetadata:` blurbs and their step titles. That makes it navigable; it does
not make it the landing surface the argument above calls for. Writing that is
the `why` discussion — the two are the same task and the same surface, which is
why they sit together here.

Still open beside it:

- The map is a third floating overlay beside the legend and the cases, so it
  inherits [Overlays: one model](#overlays-one-model-draggable-and-resizable).
  Not a blocker; one instance more expensive to keep ignoring.
- Step numbering restarts per tour in the Overview, so the same number appears
  under several headings. Fine as it stands — the headings disambiguate — and
  noted only so it is not "fixed" without a reason.

---

### Spacebar to advance a tour

Parked 2026-09-10, low priority. Siggie: *"i thought it would be super simple
but it requires more thought."* `→` / `←` / `Esc` / `?` are handled in
`HelpProvider.tsx`'s keydown listener; space is not. Binding it is three lines,
but the naive binding misfires in two ways, and each needs a guard:

- **Space on a focused control fires the control.** After clicking `next →`
  the button keeps focus, so space would click it AND advance — two steps for
  one press. A focused checkbox in the left panel would toggle and advance.
  `isInputFocused` only covers inputs, textareas and contenteditable; it would
  have to widen to buttons, links, checkboxes and selects, and bail on those.
- **Space is scroll.** The popover body (`.help-popover-body`) scrolls when a
  step's text is taller than the viewport allows, and that is exactly when a
  reader presses space hoping to scroll. Advancing would skip the text. The
  guard: advance only when the body has no hidden overflow or is already at the
  bottom; otherwise let the browser scroll.

Shift+space should go back, matching slide tools; not toggle end. Enter is a
worse fit than space (it also clicks focused buttons, and means "search" in
the filter field), so leave it unbound.

Observed alongside, and **not worth preventing**: with no tour running and no
control focused, space scrolls the canvas into empty space below the boxes,
since the canvas is a scroll container. Slightly odd; harmless.

---

### Jumping to a step from the map does not always clear the canvas

Siggie, 2026-09-10, then withdrawn as intermittent: *"jumping to `bdchm`
using the map doesn't clear the panel again … wait, sometimes it does … i'll
get back to you"*. Unreproduced; nothing was changed for it. The step in
question carried `Only: panels=0` at the time, so the expected result of a
jump was an empty selection. Suspects, in order of cheapness to check: the jump
fold in `tourStateStack.ts` when the viewer's own selection is non-empty (the
`held` half of a replace); the map's `startTour(name, at)` path versus
`goToStep` within a running tour, which are different code paths; and a race
with the ELK layout landing after the state did. Measure before guessing — a
probe that runs the fold with a non-empty viewer selection is the first thing
to write.

---

### `tour-menus` — a tour step that opens a relation menu

Siggie, 2026-09-10: *"i'd like it to convey to the user that Condition has
attributes pointing at entities on the right, then select one of them, then
the same on left."* Then: *"this is sounding like a lot of work. i really need
to get this tour authored"* — so parked, with the design as far as it got.

What exists: the relation bar's open/close are module-level functions in
`RelationBar.tsx` (`setOpen(id)` broadcasts to every bar; `scheduleClose()`
runs the 300ms grace), while the per-instance `show(side, el)` needs the chip
element for coordinates, and the outside-mousedown and Escape closers live in
an effect. Nothing on the bar carries a help id.

The sketch, in two independent pieces:

- **Tag the chips**: a `relation-count:<Class>:left|right` anchor kind on the
  two count buttons. An hour; useful alone (a beat can ring the `22 →` chip).
- **Open from a step**: register each bar under its class id rather than a
  random one, add `openRelationMenu(classId, side, { hold })` and
  `closeRelationMenu()`, where `hold` makes the instance ignore mouse-leave
  and outside clicks until released. Drive it from a tour-only field —
  `Show: relations:Condition:right`, applied on step entry and withdrawn on
  exit — NOT a URL param: a menu is not shareable state. Then a
  `relation-menu:<Class>` anchor lets a beat's popover sit beside the rows.
  The family grouping (2026-09-10) means a beat about "the Observation
  family" wants the menu open on Participant's right side.

---

## Siggie's upcoming thoughts

1. A help or legend listing **every type of ownership pair**, the rules and
   overrides for assigning them, and the `entity.slot → entity` pairs for each.
   *(Partly shipped — the legend now covers toolbar buttons, colors and dashed
   edges. The by-reason breakdown is not built.)*
2. [`OwnershipGraphView.tsx`](../src/explore/OwnershipGraphView.tsx) ended up with everything that should be a constant
   hardcoded, instead of living somewhere like [`appConfig.ts`](../src/config/appConfig.ts) — *"I want to be
   able to change the dim-other-while-something-is-highlighted opacity but don't
   know where to find it."*
