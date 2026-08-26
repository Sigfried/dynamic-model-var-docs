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

> **DECIDED — `own-bkwd` and `association` stay SEPARATE (Siggie, 2026-08-26).**
> The 2026-08-24 note below was open; it is now settled. **No merge.**
>
> The question had been whether to display `own-bkwd` *as* `association` — if
> the "belongs to" claim on a bare foreign key cannot be defended, the two are
> arguably one category. Siggie's call is to keep the distinction. The affected
> group is **64 edges** (`fk-inversion` 63 + `backward-multivalued` 1,
> re-measured 2026-08-26); earlier notes said 57 and then 70, both stale.
>
> Do not reopen this without Siggie saying so.

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

**31 edges.** Examples: `ObservationSet.observations`, `Questionnaire.items`,
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

**57 edges** — the largest category. `associated_participant`, `associated_visit`
and `performed_by` account for most of them, so any change to this rule reshapes
most of the diagram. (This is the group the open question above would move.)

### Exception 2a — targets with no independent existence ⇒ `own-fwd` (41 edges)

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

## `association` — 8 edges

> ⚠️ **CHALLENGED 2026-08-25 (Siggie), not yet resolved — settle before
> implementing.** Two objections, both about this set specifically:
>
> 1. **The six single-valued ones may not need to be here at all.** Rule 2
>    already gives them `own-bkwd`, and `association` layers identically — so
>    the override changes only their *rendering*, not their position or
>    ordering. Verified 2026-08-25: none of the six ranges on a
>    `VALUE_OBJECT`, so Exception 2a does not intercept them; deleting them
>    from the set sends all six to Rule 2 with no other effect.
> 2. **The two multivalued ones are the real associations** and should be
>    marked as such explicitly, on their own grounds — they exist to defeat
>    Rule 1, which would otherwise claim ownership.
>
> The table below already shows this asymmetry in its own justifications: the
> two multivalued rows argue "Rule 1 would claim X, but it doesn't" — a genuine
> correction — while the six single-valued rows argue "it's a role, not
> membership", which is what `own-bkwd` ("belongs to") already says.
>
> This bears on the open "merge `own-bkwd` and `association`?" question below:
> if the six collapse into Rule 2, the association set is 2 edges, and merging
> becomes a much smaller question than the 57-edge one described there.

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
| Participant | `originating_site` | Organization | The org that enrolled the participant should get credit, but the participant is not *part of* it. |
| SpecimenTransportActivity | `transport_origin` | Organization | A role in the activity, not membership. |
| SpecimenTransportActivity | `transport_destination` | Organization | Same — and the *same* Organization can fill both roles, ordered before the transport twice for opposite reasons. |
| MeasurementObservation | `associated_assay` | Assay | The assay is the method used; the measurement is not part of it. |
| QuestionnaireResponseItem | `has_questionnaire_item` | QuestionnaireItem | An answer points at its question. Its actual owner is the QuestionnaireResponse, via `items`. |
| SdohObservation | `related_questionnaire_item` | QuestionnaireItem | Cross-reference to the question, not membership. |
| Specimen | `related_document` | Document[] | Multivalued, so Rule 1 would claim the Specimen *owns* the document — but a document a specimen references is not part of it, and other classes may reference the same one. |
| SpecimenStorageActivity | `container` | SpecimenContainer[] | Multivalued, so Rule 1 would claim the activity owns the containers. It doesn't: a container outlives the activity and holds specimens independently of it. Ownership here also creates the graph's only non-self cycle — `Specimen → SpecimenStorageActivity → SpecimenContainer → Specimen` — which association breaks. |

**The set is enumerated by slot name, not by (class, slot) pair.**
`OWNERSHIP_OVERRIDES` is keyed on the name alone, so listing `container` catches
every site of `container`. All 8 happen to occur at exactly one class each, so 8
names = 8 edges — **that is luck, not design.** It is exactly how `performed_by`
(11 sites) did damage when it landed in the same list. If keyed by name, a sync
check should assert each of the 8 still has one site.

---

## `Entity`-ranged slots ⇒ `own-fwd` (12 edges)

**Decided 2026-08-24: these point forward**, like any other ownership edge —
source before range, single arrowhead. They are not association.

The only slots ranging on `Entity` are `focus` (11 sites) and
`Condition.associated_evidence` (1). Nothing else in the schema targets `Entity`.

They must not be dropped. `focus` carries real meaning — "this observation is
about *something*" — and deleting it silently removes information.

### `Entity` is a range node but not an inheritance parent

This is the distinction the whole `Entity` problem turns on, and the code
currently conflates it in **three** places:

- **As an inheritance parent** — every class `is_a Entity`, so drawing those
  edges adds a fan of pure noise. **Correctly suppressed** by
  `SKIP_SUBCLASS_EXPANSION`, but **in the wrong place** — see below. This holds
  for the inheritance view the Explorer will eventually grow, too.
- **As a slot range** — a deliberate polymorphic pointer that means something.
  **Wrongly suppressed** by `EXCLUDE_HAS_A_TARGETS`. Remove it.
- **As a node** — `Entity` *is* in `classIds`, but with its is-a edges skipped
  and its 12 inbound edges excluded it touches no edge, so `pruneIsolated` drops
  it. The comment at `containmentGraph.ts:193` says so outright ("the universal
  root").

**Removing `EXCLUDE_HAS_A_TARGETS` is sufficient.** Once the 12 edges are
classified, `Entity` touches edges, `pruneIsolated` keeps it, and it appears as a
node — present as a range target, absent from inheritance, with no node-set
change required.

Expect a **12-edge convergence on `Entity`**. That is a real consequence of the
decision and worth looking at once it renders.

### Where the inheritance exclusion belongs (decided 2026-08-24)

**Move it into the inheritance-tree accessors** — `getParentClass` and
`getSubclasses` (`src/models/Graph.ts:398,416`) — rather than leaving it as a set
the containment builder consults at `containmentGraph.ts:240`.

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
| `getParentClass` / `getSubclasses` (`Graph.ts:398,416`) | only `buildContainmentGraph` (`containmentGraph.ts:239`). `getSubclasses` has **no callers at all**. |
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

### The `focus` cardinality bug is in the data, not just the panel

The source YAML declares `focus` three times, and they disagree:

| declared on | multivalued | `bdchm.yaml` |
|---|---|---|
| `Document.focus` | No | line 862 |
| `ObservationSet.focus` | **Yes** | line 1468 |
| `Observation.focus` | No | line 1529 |

`bdchm.processed.json` **collapses all three into one slot** keyed `focus`, with
`multivalued: false` and `owner: DimensionalObservation` (which is neither of the
three declaring classes). So every one of the 12 sites currently reads as
single-valued to the classifier, not just to the Kitchen Sink panel — the doc
previously described this as a display bug only.

Under the forward decision **this no longer changes any verdict**, since all 12
go forward regardless of cardinality. That is a point in the decision's favour:
it makes the classifier immune to a known data defect. Still worth fixing
upstream; see `docs/TASKS.md`, "Class-specific slot definitions."

---

## Summary

Counts verified 2026-08-24 against the live code path (`getSlotEdgesForClass`
over the in-scope class set), not by hand.

| category | edges | drawn |
|---|---|---|
| `own-fwd` — Rule 1 (multivalued) | 31 | forward, amber |
| `own-fwd` — Exception 2a (no independent existence) | 41 | forward, amber |
| `own-fwd` — Exception 2b (cardinality splits a family) | 2 | forward, amber |
| `own-fwd` — `Entity`-ranged | 12 | forward, amber |
| `own-bkwd` — Rule 2 (single-valued) | 57 | back, amber |
| `association` | 8 | back, slate dashed, both ends arrowed |
| **total** | **151** | |

Two rules, one asserted list of 14 class names, one enumerated set of 8
association slots, and two named cardinality exceptions. Everything else reads
directly from the schema's `multivalued` flag.

> **Earlier drafts of this doc said 150 and cannot be reproduced.** Three
> different denominators were in play: **153** = every class-ranged slot in the
> processed JSON; **141** = what the builder emits *today* (the 12 `Entity`
> edges excluded before classification); **151** = the target above. Any future
> count should say which one it means.

---

## Appendix — implementation notes

Developer reference; delete once the rules above ship.

### Layering and cycles

Class order comes from a layered DAG, so the layering edges must be acyclic.
**The full relationship graph is not and cannot be a DAG** — every class
`is_a Entity`, so slots ranging on `Entity` point at everything, including
themselves.

`association` edges order their target first, exactly as `own-bkwd` does, and so
participate in layering normally. Only the ownership *claim* differs, not the
geometry. **This is why merging `own-bkwd` into `association` would not change
the layout** — see the open question at the top.

Verified 2026-08-24: **5 self-loops**, unchanged under these rules —
`File.derived_from`, `ResearchStudy.part_of`, `Specimen.parent_specimen`,
`SpecimenContainer.parent_container`, `TimePoint.index_time_point`. Zero non-self
cycles.

Two properties worth preserving as tests: the self-loop count, and that
`SpecimenStorageActivity.container` as `own-fwd` reintroduces the one non-self
cycle (`Specimen → SpecimenStorageActivity → SpecimenContainer → Specimen`).

**Not yet re-verified:** the cycle check above predates the decision to draw the
12 `Entity` edges forward. `Entity` as a live range target with 12 inbound edges
is exactly the shape that could introduce cycles. **Re-run the check as part of
implementation.**

### What the code does today

`classifySlotEdge` in `src/models/containmentGraph.ts`:

```
1. range ∈ EXCLUDE_HAS_A_TARGETS  → excluded     (1 entry)
2. slotName ∈ OWNERSHIP_OVERRIDES → that verdict  (15 entries)
3. multivalued                    → own-fwd
4. range ∈ VALUE_OBJECTS          → own-fwd       (14 entries)
5. otherwise                      → own-flip
```

Steps 3–5 are Rule 1, Exception 2a and Rule 2 (`own-flip` is today's name for
`own-bkwd`). Steps 1–2 are accumulated exceptions, and **both are already known
to be wrong** — work not yet done, not positions to argue with.

**`VALUE_OBJECTS`** (14) — same membership as `single_value_owner_slots`.

**`OWNERSHIP_OVERRIDES`** (15) — keyed by slot name:

| verdict | slots |
|---|---|
| `ref` (8) | `originating_site`, `associated_assay`, `transport_origin`, `transport_destination`, `related_questionnaire_item`, `has_questionnaire_item`, `container`, `related_document` |
| `own-fwd` (2) | `creation_activity`, `dimensional_measures` |
| `own-flip` (5) | `parent_specimen`, `performed_by`, `associated_person`, `contained_in`, `related_imaging_study` |

Not a semantic category — an edit log. Membership records that the heuristic was
wrong *or* that an earlier override had to be undone, which is why `performed_by`
is here and `associated_participant` is not despite being the same kind of
relationship.

Under the rules above: the 8 `ref` entries become the `association` set, the 2
`own-fwd` entries become Exception 2b (**kept, with reasons** — an earlier draft
dropped them), and the 5 `own-flip` entries become what Rule 2 already produces,
so no entry is needed.

The `ref` verdict and the `reference` channel go away entirely.
`OwnershipGraphView.tsx:1095-1102` currently switches on `isOwn` to pick amber
solid vs gray dashed; that becomes a three-way switch on the verdict.

**`EXCLUDE_HAS_A_TARGETS`** (1) — `Entity`. See the `Entity` section above for
why it goes, why the inheritance exclusion stays, and where that exclusion should
live instead. `src/test/containmentGraph.test.ts:102` asserts the rejected
behavior and will need updating.

`src/config/entityCategories.ts:56` carries a comment referencing both sets by
name; update it when they move.

### Where it lives

- `src/models/containmentGraph.ts` — `classifySlotEdge`,
  `classifySlotEdgeExplained`, `OWNERSHIP_RULE_TEXT`, the three sets.
- `src/services/DataService.ts` — `getOwnershipPairGroups()`,
  `getConvergenceRanking()`, `getDivergenceRanking()`, `getContainmentGraph()`.
- `src/explore/OwnershipGraphView.tsx` — edge stroke/marker selection
  (`:1091`, `:1095-1102`); the module header comment documents the channels.
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
