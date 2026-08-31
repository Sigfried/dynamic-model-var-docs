# Ownership / containment / has-a relationships

How every class-ranged slot in the schema becomes an edge in the diagram, and
what each kind of edge means.

Classes are arranged so that if `A` is drawn **before** `B`, a reader should
conclude **`B` is reached through `A`** — `A` is where you start if you want to
find `B`. (The layout runs left-to-right by default, so "before" usually means
to the left.)

The schema states these relationships **both ways round**. `ObservationSet`
stores its `observations` **owner-side** — the owner holds a collection.
`Observation.associated_participant` stores the same kind of relationship
**member-side** — the member holds a pointer to what it belongs to. Both say
"X belongs to Y"; they differ only in which end the schema put the slot on.
**Storage direction is normalized before drawing**, or every observation,
exposure and procedure lands before the Participant it describes.

## The three edge categories

| category | relationship | drawn |
|---|---|---|
| `own-fwd` | source **owns** range | forward: source before range |
| `own-bkwd` | source **belongs to** range | back: range before source, edge reversed |
| `association` | neither owns the other | back: range before source, both ends arrowed |

**"Owns" and "belongs to" are different claims, not synonyms.** A class *owns*
what it holds — the schema puts the collection on the owner, or the target is a
value with no independent existence (a `Quantity` of `5 mg` is not something you
look up). A class *belongs to* something that exists independently of it: an
`Organization`, a `Participant`, a `Visit` carry on existing whether or not any
particular observation points at them, so saying the observation *owns* them
overclaims. **"Belongs to" is the correct verb for `own-bkwd`** wherever it
appears in the legend or an edge label.

`association` makes **no ownership claim in either direction**.

**`own-bkwd` and `association` are separate categories and stay that way**
(settled by Siggie 2026-08-26; closed, do not reopen). `own-bkwd` asserts
"belongs to"; `association` asserts nothing. They happen to *layer* identically —
both order the target first — but that is geometry, not meaning, and the two
claims are not interchangeable.

### How they are drawn

| category | stroke | arrowheads |
|---|---|---|
| `own-fwd`, `own-bkwd` | amber solid `#d97706` | one, at the target end |
| `association` | **slate dashed `#64748b`**, dash `5 4` | **both ends** |

Association was gray dashed `#9ca3af`, which is too faint to see against either
background. Slate keeps the dash — dashed correctly reads as the weaker claim —
while being legible.

---

## Rule 1 — Multivalued slot ⇒ `own-fwd`

`A.things: B[]` — A holds a collection of Bs, stored owner-side. The schema put
the collection on A, which is the schema saying A is where the Bs are found.
Draw A before B.

Most of these targets *do* exist independently — `Observation`, `Specimen`,
`ResearchStudy`, `Consent` are all real entities. Rule 1 does not claim
otherwise; it reads the storage direction the schema chose. (Exception 2a below
reaches the same verdict by a different route: targets that exist only as part
of their holder.)

**30 edges** (measured 2026-08-31). Examples: `ObservationSet.observations`, `Questionnaire.items`,
`Participant.consents`, `Specimen.processing_activity`.

Two multivalued slots are **not** `own-fwd` — `Specimen.related_document` and
`SpecimenStorageActivity.container` are association; see that table.

`Specimen.parent_specimen` is multivalued, so Rule 1 makes Specimen own its
parents, pointing up the derivation tree. It is a **self-loop, rendered as a `⟲`
marker on the slot's own row rather than a routed edge**, so nothing about
layering or direction is visible. Ignore it.

---

## Rule 2 — Single-valued slot ⇒ `own-bkwd`

`A.thing: B` — A carries a pointer to one B that exists independently, stored
member-side. **A belongs to B.** Draw B before A.

**62 edges** (measured 2026-08-31) — the largest category. `associated_participant`,
`associated_visit` and `performed_by` account for most of them, so any change to
this rule reshapes most of the diagram.

### Exception 2a — targets with no independent existence ⇒ `own-fwd` (39 edges)

Rule 2's premise fails when the target is not something you can navigate to. The
pointer is containment expressed as a pointer, and the value belongs to whoever
holds it — so these draw **forward**, source before range.

Without this exception `Quantity` would acquire 13 owned classes and `TimePoint`
8, and a reader would conclude that to find a `ResearchStudy` you start from a
`TimePoint`.

| range | slots |
|---|---|
| TimePoint | `date_started`/`date_ended`, `valid_from`, `valid_to`, `period_start`, `period_end`, `index_time_point` |
| Quantity | `value_quantity`, `range_low`, `range_high`, `duration`, `quantity_collected`, `substance_quantity`, `lower/upper_limit_of_detection` |
| BodySite | `affected_body_site`, `body_site`, `anatomical_site`, `body_part_examined`, `collection_site` |
| TimePeriod | `Visit.year_range` |
| Activity | `Context.activity` |
| QuestionnaireResponseValue | `QuestionnaireResponseItem.response_value` |

Membership is the **`single_value_owner_slots`** list — 14 classes: `Quantity`,
`TimePoint`, `TimePeriod`, `BodySite`, `CauseOfDeath`, `Substance`,
`BiologicProduct`, `Activity`, `QuestionnaireResponseValue` + its 5 typed
subclasses.

**This list cannot be derived from the schema.** Verified 2026-08-21:

- `identifier` — all classes inherit `id` from `Entity`. Discriminates nothing.
- `inlined` / `inlined_as_list` — set on 10 of ~150 edges and inconsistent with
  ownership (`Specimen.parent_specimen` is `inlined_as_list` but points *up* the
  derivation tree; `SpecimenStorageActivity.container` is inlined but is a use).
- `required`, `abstract`, `is_a` depth — no signal.
- "Class with no class-ranged slots of its own" catches 9 of the 14 but misses
  `TimePoint`, `TimePeriod`, `Substance`, `Activity`,
  `QuestionnaireResponseValueTimePoint`. Closing it recursively over-collects to
  40 classes including `Participant`, `Visit`, `Organization`.

So it must be asserted. Best home, worst to best: a hand-typed TypeScript set
(silent staleness) → a LinkML overlay (`annotations: is_value_object` —
reviewable as a diff, schema-shaped) → upstream in the schema. **Add a sync
check** either way: flag any unlisted class that is a pure leaf, or any listed
class that stops being one, so rot becomes a visible question.

### Exception 2b — cardinality splits a family ⇒ `own-fwd` (2 edges)

Two single-valued slots whose multivalued siblings are `own-fwd` under Rule 1.
Rules 1–2 would split a family by cardinality alone, and the schema's `0..1` vs
`0..*` choice here looks incidental.

| slot | why forward |
|---|---|
| `Specimen.creation_activity` | Its siblings `processing_activity`, `storage_activity`, `transport_activity` are all `own-fwd` by Rule 1. A specimen's activities are one family; cardinality is the wrong axis to split them on. |
| `Specimen.dimensional_measures` | Its siblings `quality_measure`, `quantity_measure` are `own-fwd`. **And** its range is `DimensionalObservationSet` — a `0..1` pointer at something that is itself a collection, so the singular cardinality is only apparent. |

**Asserted, not derived.** A structural test was tried and rejected: "class whose
only class-ranged slot is one multivalued collection" also catches `Person`,
`Questionnaire` and `ResearchStudyCollection`. The only clean discriminator for
the four `*Set` classes is the name suffix, and exactly one slot in the schema
ranges single-valued on one — so a "collection-ranged" rule would have a single
member resting on a naming convention. Two asserted entries with stated reasons
is more honest than a rule that looks derived and is not.

---

## `association` — 2 edges

> **RESOLVED 2026-08-25, shipped.** The challenge recorded here was upheld: the
> six single-valued members were dropped from the set. Rule 2 already sends them
> to `own-bkwd`, which layers identically, so their membership changed only
> rendering — and none ranges on a value object, so Exception 2a did not
> intercept them. `ASSOCIATION_SLOTS` is now the two genuinely-multivalued
> associations, which is what the category is for: defeating Rule 1.
>
> The six dropped: `originating_site`, `associated_assay` (now
> `associated_artifact`, see below), `transport_origin`, `transport_destination`,
> `related_questionnaire_item`, `has_questionnaire_item`.

Neither class owns the other. Drawn slate dashed with **arrowheads at both
ends**, target ordered first (same layering as `own-bkwd`, no ownership claim).

Each of these could have been `own-bkwd` — the target does exist independently,
so "belongs to" would be defensible — but the relationship is a role, a
reference, or a use rather than membership.

This is **one set of 8 slots**, six single-valued and two multivalued. (An
earlier draft split it across two headings — one under each rule — so that each
rule's exception list looked complete. That made one concept read as two and is
gone. Note "Exception 2b" now means something different: the cardinality-split
pair above.)

| source | slot | target | why not ownership |
|---|---|---|---|
| Specimen | `related_document` | Document[] | Multivalued, so Rule 1 would claim the Specimen *owns* the document — but a document a specimen references is not part of it, and other classes may reference the same one. |
| SpecimenStorageActivity | `container` | SpecimenContainer[] | Multivalued, so Rule 1 would claim the activity owns the containers. It doesn't: a container outlives the activity and holds specimens independently of it. Ownership here also creates the graph's only non-self cycle — `Specimen → SpecimenStorageActivity → SpecimenContainer → Specimen` — which association breaks. |

Both arguments have the same shape, and it is the shape that justifies the
category: *Rule 1 would claim ownership here, and it is wrong.* The six
single-valued slots that used to sit in this table argued something different —
"it's a role, not membership" — which is what `own-bkwd` ("belongs to") already
says. That asymmetry is why they were dropped.

**The set is enumerated by slot name, not by (class, slot) pair** —
`ASSOCIATION_SLOTS.has(slotName)`, so listing `container` catches every site of
`container`. Both members happen to occur at exactly one class each. See the
appendix for why that is luck rather than design, and what a sync check should
assert.

---

## `Entity`-ranged slots ⇒ `own-fwd` (13 edges)

**Decided 2026-08-24: these point forward**, like any other ownership edge —
source before range, single arrowhead. They are not association.

As of the `28007df` sync the slots ranging on `Entity` are `focus` (11 sites),
`Condition.associated_evidence` (1), and
`MeasurementObservation.associated_artifact` (1) — **13 sites**. The last is new;
upstream widened it from `Assay`. Nothing else targets `Entity` today, but this
list grows whenever upstream generalizes a range, so treat it as measured rather
than fixed.

They must not be dropped. `focus` carries real meaning — "this observation is
about *something*" — and deleting it silently removes information.

### `Entity` is a range node but not an inheritance parent

This is the distinction the whole `Entity` problem turns on. **Shipped
2026-08-25** — recorded here because the distinction keeps getting re-conflated,
not because anything is outstanding. The three places it used to be confused:

- **As an inheritance parent** — every class `is_a Entity`, so drawing those
  edges adds a fan of pure noise. **Correctly suppressed** by
  `SKIP_SUBCLASS_EXPANSION`, but **in the wrong place** — see below. This holds
  for the inheritance view the Explorer will eventually grow, too.
- **As a slot range** — a deliberate polymorphic pointer that means something.
  Was wrongly suppressed by `EXCLUDE_HAS_A_TARGETS`; **that set is now deleted**,
  and Entity-ranged edges classify normally (rule `entity-ranged`, always
  forward).
- **As a node** — `Entity` *is* in `classIds`, but with its is-a edges skipped
  and its 12 inbound edges excluded it touches no edge, so `pruneIsolated` drops
  it. The comment at `containmentGraph.ts` says so outright ("the universal
  root").

**Removing `EXCLUDE_HAS_A_TARGETS` was sufficient**, as predicted: the edges
classify, `Entity` touches them, `pruneIsolated` keeps it, and it appears as a
node — present as a range target, absent from inheritance, with no node-set
change needed.

The convergence on `Entity` is now **13 edges**, not the 12 predicted: the
`28007df` sync repointed `MeasurementObservation.associated_artifact` at `Entity`.
Expect this number to grow whenever upstream widens a range to `Entity`, which is
worth watching — a convergence that keeps growing is the kind of thing that turns
a readable diagram into a hairball.

### Where the inheritance exclusion belongs (decided 2026-08-24)

**Move it into the inheritance-tree accessors** — `getParentClass` and
`getSubclasses` (`src/models/Graph.ts`) — rather than leaving it as a set
the containment builder consults at `containmentGraph.ts`.

The reason the two `Entity` exclusions got conflated is that they lived side by
side in the same module, as two similar-looking `Set<string>`s. Excluding the
universal root from *inheritance* is a property of what an inheritance tree
means, not a property of the ownership diagram — so it belongs where inheritance
is read.

Worth knowing before the move: `getSubclasses` currently has **no callers**, and
`getParentClass` has exactly one (the containment builder). So today the
behaviour is identical either way and this is purely about placement. It pays off
when the Explorer grows an inheritance view — that view gets the exclusion for
free instead of rediscovering the problem.

Whether the accessors hard-code `Entity` or take an opt-out parameter is an
implementation call; a caller that genuinely wants the raw tree (a schema
validator, say) should still be able to ask for it.

#### But there is no single choke point yet (checked 2026-08-24)

**The older views do not use those accessors.** Inheritance is derived in two
independent ways:

| path | used by |
|---|---|
| `getParentClass` / `getSubclasses` (`Graph.ts`) | only `buildContainmentGraph` (`containmentGraph.ts`). `getSubclasses` has **no callers at all**. |
| `DataService.getEdgesForItem(...)` filtered on `EDGE_TYPES.INHERITANCE` | `RelationshipInfoBox.tsx:68,85`; `LinkOverlay.tsx:48,365,375` |

Both read the same `type: 'inheritance'` edges built at `Graph.ts:120`, but
neither calls the other. So excluding `Entity` inside the accessors would **not**
affect the detail panel or the kitchen-sink link overlay.

That is probably fine, because the two sites want different things:

- **Reporting the fact** — `RelationshipInfoBox` saying "Parent class: Entity" is
  true and useful. It is one line about one class, not a fan.
- **Drawing the edges** — `LinkOverlay` rendering every `is_a Entity` link, and
  the containment graph fanning 53 of them, is the noise.

**The problem is never the fact, it is the fan** — the same distinction as
range-vs-inheritance.

#### Decided 2026-08-24: build the single route, with a required argument

**All inheritance derivation goes through one accessor**, and that accessor takes
a **required** parameter saying whether `Entity` inheritance is included. Not
optional, not defaulted.

```ts
// shape, not final naming
getInheritance(graph, classId, { includeEntity: boolean })
```

Required is the whole point. A default is what let this rot in the first place:
`EXCLUDE_HAS_A_TARGETS` and `SKIP_SUBCLASS_EXPANSION` sat side by side as two
silent `Set<string>`s, and no call site ever had to say which behaviour it
wanted — so the ranges case inherited the inheritance case's answer by accident.
A required argument makes every caller state its intent at the call, and makes a
new caller *fail to compile* rather than quietly pick up the wrong one.

Expected call sites once routed:

| caller | `includeEntity` | why |
|---|---|---|
| `buildContainmentGraph` (`containmentGraph.ts:239`) | `false` | drawing; the 53-edge fan is pure noise |
| `LinkOverlay` (`:48,365,375`) | `false` | drawing |
| `RelationshipInfoBox` (`:68,85`) | `true` | reporting a fact about one class — "Parent class: Entity" is true and useful |
| future Explorer inheritance view | `false` | drawing |

This replaces `SKIP_SUBCLASS_EXPANSION` entirely. The components must stop
filtering `getEdgesForItem` on `EDGE_TYPES.INHERITANCE` directly and call the
accessor instead — that filtering *is* the second derivation path, and leaving it
in place means there is still no single route.

### The `focus` cardinality bug — FIXED

**Resolved by the induced-slots migration (`e8b8bd0`); verified 2026-08-31.**

The source YAML declares `focus` on many classes with differing cardinality
(`Document.focus` single, `ObservationSet.focus` multivalued, `Observation.focus`
single). `bdchm.processed.json` used to **collapse all of them into one slot**
keyed `focus`, with `multivalued: false` and an owner that was none of the
declaring classes — so every site read as single-valued to the classifier, not
just to the Kitchen Sink panel.

There is now no bare `focus` key at all. The transform emits **11 per-class
entries** (`focus-Document`, `focus-ObservationSet`, `focus-Observation`, …),
each carrying the cardinality its own class declares. Spot-checked:

| slot | range | multivalued |
|---|---|---|
| `focus-Document` | Entity | false |
| `focus-ObservationSet` | Entity | **true** |
| `focus-Observation` | Entity | false |

The verdicts never depended on this — `entity-ranged` fires before the
multivalued test, so all `focus` sites drew forward either way. That immunity is
a point in the rule's favour, but the underlying data is correct now regardless.

## `any_of` ranges — not handled (low priority)

**Status 2026-08-31: the app ignores `any_of` entirely.** No occurrence of
`any_of` anywhere in `src/` or `scripts/`. Exactly **one** slot in the schema
uses it today:

```
MeasurementObservation.associated_artifact
  range:  Entity
  any_of: [Assay, File, QuestionnaireResponse]
```

### Why ignoring it is currently harmless

The slot also declares `range: Entity`, so the `entity-ranged` rule catches it
and draws it forward — the correct verdict. LinkML convention is for an `any_of`
slot to carry a `range` that is the common ancestor of the alternatives, so the
declared range stays a truthful (if vague) statement. **We lose precision, not
correctness.** What is lost is real, though, and the `28007df` sync made it
concrete:

- The diagram says "points at some Entity" where the schema says "points at an
  Assay, a File, or a QuestionnaireResponse".
- It adds a 13th edge to the `Entity` convergence instead of three informative
  edges to named classes.
- **`Assay` became unreachable.** `MeasurementObservation.associated_assay` was
  the *only* slot in the schema ranging on `Assay`; after the rename nothing
  ranges on it at all. Verified 2026-08-31: `Assay` is not `is_a` anything, has
  no subclasses, and has zero inbound range edges. It keeps 3 outbound edges
  (`reagent → Substance`, `lower/upper_limit_of_detection → Quantity`) so
  `pruneIsolated` does **not** drop it — but it now sits at layer 0 as a **false
  root**, a class you cannot navigate *to*. That is the same failure mode
  recorded for `Activity` in `SINGLE_VALUE_OWNER_TARGETS` above.

So the cost of ignoring `any_of` is no longer purely theoretical: one real class
lost its only inbound relationship and moved to the top of the diagram.

### What support would cost

The obstacle is structural, not a matter of reading one more field. The graph is
built from `EDGE_TYPES.CLASS_RANGE` edges, **one per (class, slot), keyed on a
single `range` string** (`getSlotEdgesForClass`). `any_of` is inherently
one-slot-to-many-targets, so it does not fit that edge shape. Three approaches,
cheapest first:

1. **Leave it; assert it stays small.** Add a test that fails when a *second*
   slot grows an `any_of`, so the decision gets revisited on evidence rather than
   rotting silently. Cost: near zero. This is the honest default while N=1.
2. **Fan out at graph-build time** — emit one `CLASS_RANGE` edge per `any_of`
   member, tagged so they can be styled as one polymorphic slot. Classification
   then works unchanged, per branch. Cost: moderate, and it changes edge counts,
   layering, and every count in this doc. It also raises a real question the
   diagram cannot currently express: **are three alternatives three edges, or one
   edge with three heads?** Drawing them as three implies the slot points at all
   of them simultaneously, which is false — it points at exactly one.
3. **A first-class polymorphic edge type.** Most faithful, most work: a new edge
   kind, its own rendering, and layering that treats N alternatives as one
   relationship. Only worth it if `any_of` becomes common upstream.

**Recommendation: (1) now, with (2) worth reconsidering sooner than "if it
spreads."** The precision lost on one slot does not by itself justify reshaping
the edge model, and option 2's "three edges or one?" question deserves a real
answer rather than one arrived at by accident. But the `Assay` false-root above
is a visible diagram regression *today*, from a single `any_of` — so the trigger
for revisiting is not only "a second `any_of` appears" but also "someone notices
`Assay` floating at layer 0 and wonders why."

A cheap middle option, if the false root is the only thing that actually bothers
anyone: special-case nothing, and instead fan out `any_of` **for reachability
only** — enough to keep classes like `Assay` connected — while continuing to draw
the single `Entity` edge. That splits the two concerns (layout correctness vs.
edge semantics) and defers the harder rendering question.

**If this is picked up:** check whether `range` on an `any_of` slot is reliably
the common ancestor across all such slots, or whether upstream sometimes omits it.
If it can be absent, the `entity-ranged` safety net disappears and the slot falls
through to `fk-inversion`, which would draw it backward — wrong. That is the
failure mode to guard against, and a test for "every `any_of` slot has a
class-valued `range`" would catch it cheaply.

---

## Summary

Counts measured 2026-08-31 by running the live `classifySlotEdgeExplained` rules
over `bdchm.processed.json`, after the upstream sync to `28007df`.

| category | rule | edges | drawn |
|---|---|---|---|
| `own-fwd` | Rule 1 (multivalued) | 30 | forward, amber |
| `own-fwd` | Exception 2a (value object) | 39 | forward, amber |
| `own-fwd` | Exception 2b (cardinality split) | 2 | forward, amber |
| `own-fwd` | `Entity`-ranged | 13 | forward, amber |
| `own-bkwd` | Rule 2 (fk-inversion) | 62 | back, amber |
| `own-bkwd` | `backward-multivalued` (`parent_specimen`) | 1 | back, amber |
| `association` | enumerated | 2 | back, slate dashed, both ends arrowed |
| **total** | | **149** | |

Two rules, one asserted list of 14 class names, and three small enumerated slot
sets (2 association, 2 cardinality-split, 1 backward-multivalued). Everything
else reads directly from the schema's `multivalued` flag and `range`.

### What the `28007df` sync changed (2026-08-31)

The first sync to run through the corrected pipeline. Structurally near-inert —
54 classes, 52 enums, 337 slots, none added or removed — but three edges moved:

| change | effect |
|---|---|
| `MeasurementObservation.associated_assay` → `associated_artifact`, range `Assay` → `Entity` | `fk-inversion` → `entity-ranged`, so it now draws **forward**. Verdict is correct. |
| `ResearchStudy.date_started` + `date_ended` (TimePoint) → `year_range` (TimePeriod) | 2 `value-object` edges become 1. Still `value-object`. |

Net: 150 → 149 edges; `fk-inversion` 63 → 62, `value-object` 40 → 39,
`entity-ranged` 12 → 13. **No hand-curated set went stale** — `associated_assay`
survived only in prose (this doc and a comment), not in any live `Set`.

**One side effect worth knowing about:** `associated_assay` was the only slot
ranging on `Assay`, so `Assay` now has no inbound edges and renders as a false
root. See the `any_of` section above — that is the visible cost of not reading
`any_of`, and it arrived with this sync.

> **Historical counts in earlier drafts do not reconcile, by design.** Three
> denominators were in play: **153** = every class-ranged slot in the processed
> JSON; **141** = what the builder emitted when `EXCLUDE_HAS_A_TARGETS` still
> dropped the Entity edges; **151** = the target once they were drawn. The
> measured **149/150** above supersedes all three. Any future count should say
> which denominator it means and how it was obtained.

## Appendix — implementation notes

Developer reference. The rules above **have** shipped; this appendix is now a
map of the implementation, not a plan for it.

### Layering and cycles

Class order comes from a layered DAG, so the layering edges must be acyclic.
**The full relationship graph is not and cannot be a DAG** — every class
`is_a Entity`, so slots ranging on `Entity` point at everything, including
themselves.

`association` edges order their target first, exactly as `own-bkwd` does, and so
participate in layering normally. **Only the ownership claim differs, not the
geometry** — so changing an edge between these two categories moves nothing on
screen except its stroke and arrowheads. Worth knowing when a verdict looks
wrong: if the layout is the complaint, this is not the knob.

Re-measured 2026-08-31 against `bdchm.processed.json` at `28007df`, running the
live rules and walking the layering order:

- **6 self-loops** — `File.derived_from`, `ResearchStudy.part_of`,
  `Specimen.parent_specimen`, `SpecimenContainer.parent_container`,
  `TimePoint.index_time_point`, **`QuestionnaireItem.part_of`**.
  The earlier count of 5 omitted the last one; it is not new.
- **Zero non-self cycles.** This was the open risk — `Entity` became a live range
  target with 13 inbound edges, which is exactly the shape that could introduce
  one. It did not.

Two properties worth preserving as tests: the self-loop count, and that
`SpecimenStorageActivity.container` as `own-fwd` reintroduces the one non-self
cycle (`Specimen → SpecimenStorageActivity → SpecimenContainer → Specimen`).
Neither is asserted in `src/test/containmentGraph.test.ts` today, so both numbers
are re-derived by hand every time someone wonders — which is how the self-loop
count drifted in the first place.

### What the code does today

Re-verified 2026-08-31. **The rules above have shipped** — this section used to
describe a pre-rewrite classifier (`OWNERSHIP_OVERRIDES`, `EXCLUDE_HAS_A_TARGETS`,
`VALUE_OBJECTS`, an `own-flip` verdict, a `ref` channel). **None of those symbols
exist any more.** If you are reading a note that mentions them, it predates the
rewrite.

`classifySlotEdgeExplained` in `src/models/containmentGraph.ts`, in order:

```
1. slot ∈ ASSOCIATION_SLOTS            → association          (2 entries)
2. slot ∈ BACKWARD_DESPITE_MULTIVALUED → own-bkwd             (1 entry)
3. slot ∈ CARDINALITY_SPLIT_OWN_FWD    → own-fwd, Exc. 2b     (2 entries)
4. range === ENTITY_ROOT               → own-fwd
5. multivalued                         → own-fwd, Rule 1
6. range ∈ SINGLE_VALUE_OWNER_TARGETS  → own-fwd, Exc. 2a    (14 entries)
7. otherwise                           → own-bkwd, Rule 2
```

Every branch returns the rule that fired alongside the verdict, so the legend and
the graph cannot disagree about *why* an edge was drawn. `classifySlotEdge`
delegates here and discards the rule.

The current sets, all in `containmentGraph.ts`:

| set | members |
|---|---|
| `ASSOCIATION_SLOTS` (2) | `related_document`, `container` |
| `BACKWARD_DESPITE_MULTIVALUED` (1) | `parent_specimen` |
| `CARDINALITY_SPLIT_OWN_FWD` (2) | `creation_activity`, `dimensional_measures` |
| `SINGLE_VALUE_OWNER_TARGETS` (14) | `Quantity`, `TimePoint`, `TimePeriod`, `BodySite`, `CauseOfDeath`, `Substance`, `BiologicProduct`, `Activity`, `QuestionnaireResponseValue` + its 5 typed subclasses |
| `SKIP_SUBCLASS_EXPANSION` (1) | `Entity` — inheritance only, **not** ranges |

These are no longer an edit log. Each set now has one stated reason and members
that share it, which is the difference between a rule and an accumulated patch.

**Still keyed by slot name, not `(class, slot)` pair.** All five members of the
two override sets happen to occur at exactly one class each — **luck, not
design.** It is exactly how `performed_by` (11 sites) did damage when it sat in
the old override list. A sync check should assert each still has one site.

### Where it lives

- `src/models/containmentGraph.ts` — `classifySlotEdge`,
  `classifySlotEdgeExplained`, `OWNERSHIP_RULE_TEXT`, the three sets.
- `src/services/DataService.ts` — `getOwnershipPairGroups()`,
  `getConvergenceRanking()`, `getDivergenceRanking()`, `getContainmentGraph()`.
- `src/explore/OwnershipGraphView.tsx` — edge stroke/marker selection
  (edge stroke/marker selection); the module header comment documents the channels.
- `src/explore/OwnershipLegend.tsx` — renders every slot grouped by rule.
- `src/test/ownershipLegend.test.ts` — asserts the legend cannot drift from the
  graph's actual edges.

**Do not start implementation from this appendix or from the code.** Both are the
accumulated result of decisions whose reasoning is lost. Start from the rules
above.

**Keep `classifySlotEdgeExplained`.** Having the classifier report *which* rule
fired — and the legend render pairs grouped by rule — is what made the
incoherence visible. Whatever the rules become, the classifier must explain
itself.

---

## See also

- `WORKLOG.md` (2026-08-21) — the four problems that prompted the rewrite.
- [EXPLORE_VIZ.md](EXPLORE_VIZ.md) §"Core visual-design conclusions" **item 1** —
  the owner-side/member-side normalization. Cite that item only: audited
  2026-08-24, items 2, 3, 5 and 6 are stale. See `docs/TASKS.md`.
- `docs/TASKS.md` — hand-curated config rot; the `focus` cardinality bug.
