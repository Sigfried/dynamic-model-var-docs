# Ownership classification

How every class-ranged slot in the schema becomes an edge in the ownership
diagram, and what the relationship it draws means.

> **Status: proposed target, not yet implemented.** Parts 0–3 are the proposal.
> Part 4 records what the code does today. Ownership classification is
> Siggie's call; the open questions are marked as such rather than settled here.

---

## Part 0 — What the diagram says

The diagram arranges classes in **layers**, laid out left-to-right by default.
If `A` is drawn before `B`, a reader should conclude **`B` is reached through
`A`** — `A` is where you start if you want to find `B`. ("Before" is layer
order, not screen position: it means earlier in the flow, whichever direction
the layout runs.)

The schema states these relationships **both ways round**. `ObservationSet`
stores its `observations` **owner-side** — the owner holds a collection.
`Observation.associated_participant` stores the same kind of relationship
**member-side** — the member holds a pointer up to what it belongs to. Both say
"X belongs to Y"; they differ only in which end the schema chose to put the
slot on. **Storage direction must be normalized before drawing**, or every
observation, exposure and procedure lands *before* the Participant it describes.

### Verdicts

| verdict | relationship | drawn |
|---|---|---|
| `own-fwd` | source **owns** range | forward: source before range, edge as declared |
| `own-flip` | source **belongs to** range | back: range before source, edge reversed |
| `association` | neither owns the other | ordering either way is wrong — see below |

The distinction between the first two and the third is **not** direction — it
is whether an ownership claim is being made at all.

**"Owns" vs "belongs to" is a real distinction, not a synonym pair.** `own-fwd`
targets have no independent existence: a `Quantity` of `5 mg` is not a thing
you look up, and calling it *owned* is accurate. `own-flip` targets do exist
independently — an `Organization`, a `Participant`, a `Visit` — and saying a
class *owns* them overclaims. **"Belongs to" is the correct verb for `own-flip`
throughout**, and should be the wording in the legend and any edge label.

### On cycles

The layered arrangement needs the layering edges to be acyclic. **The full
relationship graph is not and cannot be a DAG** — every class `is_a Entity`,
and slots that range on `Entity` therefore point at everything, including
themselves. Cycles are intrinsic.

The resolution is not to force acyclicity but to **keep un-layerable
relationships out of the layering channel**. That is what `association` is for.
Measured (2026-08-21): with Rules 1–3 applied, `Entity`-ranged slots in the
association channel, and `container` not layering, the layering channel is
acyclic apart from 5 self-loops.

---

## Part 1 — The rules

**Rule 1 — Multivalued slot ⇒ `own-fwd`.**
`A.things: B[]` — A holds a collection of Bs, stored owner-side. Draw A before B.

**Rule 2 — Single-valued slot ⇒ `own-flip`.**
`A.thing: B` — A carries a pointer to one B that exists independently, stored
member-side. **A belongs to B.** Draw B before A.

**Rule 3 — Single-valued slot whose range has no independent existence ⇒
`own-fwd`.**
Rule 2's premise fails when the target is not a thing you can navigate to. The
pointer is containment expressed as a pointer; the value belongs to whoever
holds it. Draw A before B. Membership is the `single_value_owner_slots` list —
see Part 2 Group A.

```
verdict = multivalued              ? 'own-fwd'
        : range ∈ single_value_owner_slots ? 'own-fwd'
        :                            'own-flip'
```

Rules 1–2 alone classify all 150 class-ranged slot edges from the schema with
no lookup tables. Rule 3 adds the one list that cannot be derived.

---

## Part 2 — What doesn't fit

Rules 1–2 with **zero exceptions** differ from today's output on 63 of 150
edges. Grouped by what is at stake.

### Group A — targets with no independent existence (40 edges)

Rule 2 flips these, making the value the owner: `Quantity` acquires 13 owned
classes and `TimePoint` 8. A reader would conclude that to find a
`ResearchStudy` you start from a `TimePoint`.

| range | edges | sample slots |
|---|---|---|
| Quantity | 16 | `value_quantity` (×6), `range_low`, `range_high`, `duration`, `quantity_collected`, `substance_quantity`, `lower/upper_limit_of_detection` |
| TimePoint | 17 | `date_started`/`date_ended` (×5 each), `valid_from`, `valid_to`, `period_start`, `period_end`, `index_time_point` |
| BodySite | 6 | `affected_body_site` (×2), `body_site`, `anatomical_site`, `body_part_examined`, `collection_site` |
| TimePeriod | 1 | `Visit.year_range` |
| Activity | 1 | `Context.activity` |
| QuestionnaireResponseValue | 1 | `QuestionnaireResponseItem.response_value` |

**This list cannot be derived from the schema.** Verified 2026-08-21:

- `identifier` — all 54 classes inherit `id` from `Entity`. Discriminates nothing.
- `inlined` / `inlined_as_list` — set on 10 of 150 edges and inconsistent with
  ownership (`Specimen.parent_specimen` is `inlined_as_list` but points *up*
  the derivation tree; `SpecimenStorageActivity.container` is inlined but is a
  use, not an ownership).
- `required`, `abstract`, `is_a` depth — no signal.
- "Class with no class-ranged slots of its own" catches 9 of the 14 but misses
  `TimePoint`, `TimePeriod`, `Substance`, `Activity`,
  `QuestionnaireResponseValueTimePoint`. Closing it recursively over-collects
  to 40 classes including `Participant`, `Visit`, `Organization`.

So it must be asserted. Call it **`single_value_owner_slots`** — 14 classes:
`Quantity`, `TimePoint`, `TimePeriod`, `BodySite`, `CauseOfDeath`, `Substance`,
`BiologicProduct`, `Activity`, `QuestionnaireResponseValue` + its 5 typed
subclasses.

Where to keep it, worst to best: a hand-typed TypeScript set (status quo,
silent staleness) → a LinkML overlay (`annotations: is_value_object`, reviewable
as a diff, schema-shaped, matches the preference for linkml-conventional
formats) → upstream in the schema itself. **Add a sync check** either way: any
unlisted class that is a pure leaf, or any listed class that stops being one,
gets flagged. That converts silent rot into a visible question.

### Group B — single-valued slots to independently-existing targets (6 edges)

Currently `ref`; Rule 2 makes them `own-flip`. **All six are correct as
belongs-to** — they were only uncomfortable under the word "owns."

| slot | reading under Rule 2 |
|---|---|
| `Participant.originating_site → Organization` | Participant belongs to Organization |
| `SpecimenTransportActivity.transport_origin → Organization` | transport belongs to Organization |
| `SpecimenTransportActivity.transport_destination → Organization` | transport belongs to Organization |
| `MeasurementObservation.associated_assay → Assay` | measurement belongs to Assay |
| `QuestionnaireResponseItem.has_questionnaire_item → QuestionnaireItem` | answer belongs to question |
| `SdohObservation.related_questionnaire_item → QuestionnaireItem` | observation belongs to question |

`originating_site` is the clearest case: when an Organization enrolls a
Participant, **the org should get credit** — that is exactly a belongs-to, and
the current `ref` override is wrong. The same logic covers the two transport
slots, and is consistent with `performed_by` already being own-flip.

Note `transport_origin` and `transport_destination` both land on `Organization`
from the same class, so the same node is drawn before the transport twice for
opposite roles. Not wrong under belongs-to, but it is the clue worth pulling on
if a role-vs-membership distinction is ever wanted.

**Open — Siggie's call:** these six could instead be `association`, with the
target still placed in a prior layer. That keeps the layout and drops the
ownership claim entirely. The trade-off is one more verdict against wording
nobody has to defend.

### Group C — multivalued slots that assert ownership (2 edges)

Split out from Group B because these are **not** belongs-to. Rule 1 makes them
`own-fwd`, an actual ownership claim.

| slot | reading under Rule 1 |
|---|---|
| `Specimen.related_document → Document[]` | Specimen owns the Documents |
| `SpecimenStorageActivity.container → SpecimenContainer[]` | the activity owns the containers |

`container` is the harder one: it is also the sole cause of the one cycle that
survives Rules 1–3 —
`Specimen → SpecimenStorageActivity → SpecimenContainer → Specimen`. Treating it
as `association` (non-layering) makes the layering channel fully acyclic.

**Open — not yet considered.** Both are candidates for `association`.

### Group D — `Entity`-ranged slots (12 edges)

The only slots ranging on `Entity` are `focus` (11 sites) and
`Condition.associated_evidence` (1). Nothing else in the schema targets
`Entity`.

`focus` has no top-level definition — it is declared on three classes and
inherited by the rest:

| declared on | multivalued | inherited by |
|---|---|---|
| `Document.focus` | No | — |
| `Observation.focus` | No | DimensionalObservation, MeasurementObservation, SdohObservation, SpecimenQualityObservation, SpecimenQuantityObservation |
| `ObservationSet.focus` | **Yes** | DimensionalObservationSet, MeasurementObservationSet, SdohObservationSet |

So **7 single-valued + 4 multivalued `focus`, + 1 multivalued
`associated_evidence` = 12.**

Under Rules 1–2 the single-valued ones make `Entity` the owner of 7 classes,
and the multivalued ones make 5 classes own `Entity` — i.e. own everything.
Both are wrong. But dropping them (today's behavior) is also wrong: `focus`
carries real meaning — "this observation is about *something*."

**`associated_evidence` admits no sensible ownership assignment in either
direction.** It is the case that forces the `association` channel to exist:
drawn with **arrows at both ends**, asserting a relationship without a claim
about which side is primary.

> **Note:** the Kitchen Sink detail panel currently misreports `focus` as
> single-valued at all 11 sites, because attribute elements are keyed by slot
> name and the three declarations collapse into one. Known bug, logged in
> `docs/TASKS.md` under "Class-specific slot definitions."

### Group E — Specimen-family inconsistencies (3 edges)

| slot | today | Rules 1–2 |
|---|---|---|
| `Specimen.creation_activity → SpecimenCreationActivity` | own-fwd (override) | own-flip |
| `Specimen.dimensional_measures → DimensionalObservationSet` | own-fwd (override) | own-flip |
| `Specimen.parent_specimen → Specimen[]` | own-flip (override) | own-fwd |

The first two are single-valued slots whose multivalued siblings
(`processing_activity`, `storage_activity`, `transport_activity`;
`quality_measure`, `quantity_measure`) are `own-fwd` under Rule 1. Rules 1–2
split a family of five by cardinality alone, and the schema's `0..1` vs `0..*`
choice here looks incidental.

`parent_specimen` is multivalued, so Rule 1 says Specimen owns its parents —
pointing up the derivation tree. Self-loop, so no layering effect, but the
arrow reads backwards.

**These are the strongest evidence that cardinality is not a perfect proxy.**
They are also 3 edges, and the inconsistency is upstream. Recommend drawing
honestly and raising it with the schema authors rather than patching locally.

---

## Part 3 — Where that leaves us

| | rules | hand-maintained entries | edges classified from schema alone |
|---|---|---|---|
| today | 5 | 30 (15 override + 14 value-object + 1 exclude) | 32 / 150 |
| Rules 1–2 | 2 | 0 | 150 / 150 |
| Rules 1–3 | 3 | 14 (ideally upstream) | 110 / 150 |

Rules 1–3 leave **one** hand-maintained list, with a stated principle, an
independent structural test, and a path into the schema itself.

Verified: Rules 1–3, with all of Group B flipped, `Entity` edges in the
association channel, and `container` non-layering, produce a layering channel
that is **acyclic apart from 5 self-loops** (`TimePoint.index_time_point`,
`File.derived_from`, `Specimen.parent_specimen`, `ResearchStudy.part_of`,
`SpecimenContainer.parent_container`).

**Open questions for Siggie:**

1. Group B (6 edges) — belongs-to, or association-with-layering?
2. Group C (2 edges) — is `Specimen owns Document` / `activity owns container`
   acceptable, or association?
3. Does `association` layer its target, or float free? (Group D's
   `associated_evidence` cannot layer; Group B's could.)

---

## Part 4 — Where we are now

What the code does today. Recorded so the gap is visible.

> **Implementing this: do not start here, and do not start from the code.**
> Steps 1–2 below are the accumulated result of decisions whose reasoning is
> lost; reading them first anchors the answer to the thing being replaced.
> Start from Parts 0–1, decide the open questions in Part 3, then come back
> here to see what changes.
>
> **Keep `classifySlotEdgeExplained`.** Having the classifier report *which*
> rule fired — and rendering the pairs grouped by rule in the legend — is what
> made the incoherence visible in the first place. Neither the graph nor the
> old rationale doc exposed the groupings, so nobody could see they were
> arbitrary. Whatever the rules become, the classifier must still explain
> itself.

### Resolution order

`classifySlotEdge` in `src/models/containmentGraph.ts`:

```
1. range ∈ EXCLUDE_HAS_A_TARGETS  → excluded     (1 entry)
2. slotName ∈ OWNERSHIP_OVERRIDES → that verdict  (15 entries)
3. multivalued                    → own-fwd
4. range ∈ VALUE_OBJECTS          → own-fwd       (14 entries)
5. otherwise                      → own-flip
```

Steps 3–5 are Rules 1–3. Steps 1–2 are the accumulated exceptions, and
**both are already known to be wrong** — step 1 by a decision that was recorded
but never implemented (see `EXCLUDE_HAS_A_TARGETS` below), step 2 because it is
an edit log rather than a category. Neither is a standing position to be argued
with; they are work not yet done.

### Live output (2026-08-21)

| verdict / rule | pairs |
|---|---|
| own-flip / fk-inversion | 43 |
| own-fwd / value-object | 41 |
| own-fwd / multivalued | 32 |
| own-flip / override | 15 |
| excluded / excluded | 12 |
| ref / override | 8 |
| own-fwd / override | 2 |

Seven groups, but they are the cross-product of 4 verdicts × 5 rules filtered
to combinations that occur — not seven designed categories.

### The hand-curated sets

**`VALUE_OBJECTS`** (14) — becomes `single_value_owner_slots` under the
proposal; same membership.

**`OWNERSHIP_OVERRIDES`** (15) — keyed by slot name:

| verdict | slots |
|---|---|
| `ref` (8) | `originating_site`, `associated_assay`, `transport_origin`, `transport_destination`, `related_questionnaire_item`, `has_questionnaire_item`, `container`, `related_document` |
| `own-fwd` (2) | `creation_activity`, `dimensional_measures` |
| `own-flip` (5) | `parent_specimen`, `performed_by`, `associated_person`, `contained_in`, `related_imaging_study` |

**This set is not a semantic category.** It is an edit log: membership records
that the heuristic was wrong *or* that an earlier override had to be undone.
`performed_by` is in it and `associated_participant` is not, despite being the
same kind of relationship — `performed_by` was previously pinned to `ref` by
the retired `NO_FLIP_SLOTS` set, so changing it needed an entry.

Under the proposal, the 5 `own-flip` entries become what Rule 2 already
produces (no entry needed), and the 8 `ref` entries are resolved by Groups B
and C.

**`EXCLUDE_HAS_A_TARGETS`** (1) — `Entity`. Drops the 12 Group D edges.
**Already decided to be wrong, not yet removed** (WORKLOG.md, 2026-08-21): it
conflates two different reasons to skip `Entity`.

- `SKIP_SUBCLASS_EXPANSION` (also `Entity`) suppresses **is-a** edges to the
  universal root. Every class `is_a Entity`, so those edges are pure noise.
  **Sound; keep.**
- `EXCLUDE_HAS_A_TARGETS` suppresses slots that **range on** `Entity`. Different
  situation: `focus` and `associated_evidence` are deliberate polymorphic
  pointers carrying real meaning, and dropping them silently removes
  information.

Only the first was ever intended. The second survives because
`classifySlotEdgeExplained` still tests it first (`containmentGraph.ts:127`),
before any other rule. Group D replaces it with the `association` channel.

### Where it lives

- `src/models/containmentGraph.ts` — `classifySlotEdge`,
  `classifySlotEdgeExplained` (returns verdict + which rule fired),
  `OWNERSHIP_RULE_TEXT`, the three sets.
- `src/services/DataService.ts` — `getOwnershipPairGroups()`,
  `getConvergenceRanking()`, `getDivergenceRanking()`.
- `src/explore/OwnershipLegend.tsx` — renders every slot grouped by rule.
- `src/test/ownershipLegend.test.ts` — asserts the legend cannot drift from the
  graph's actual edges.

### Scale of any Rule-2 change

Diverging (edges out): Participant 22 (21 flipped), Visit 19 (18 flipped),
Organization 11 (11 flipped), Specimen 8 (0 flipped).
Converging (in): Quantity 19 (16 classes), TimePoint 16 (8), BodySite 6,
Context 6.

`associated_participant` (20 sites), `associated_visit` (18) and `performed_by`
(11) account for **49 of the 112 single-valued edges**. Any change to Rule 2
reshapes most of the diagram.

---

## See also

- `WORKLOG.md` (2026-08-21) — why the previous version of this document was
  discarded: the four problems found, and Siggie's call to restart from the
  modeling question rather than the code.
- [EXPLORE_VIZ.md](EXPLORE_VIZ.md) §"Core visual-design conclusions" **item 1**
  — the owner-side/member-side normalization, which Rule 2 above builds on.
  Cite that item only: audited 2026-08-24, and items 2, 3, 5 and 6 of that list
  are stale (vertical-orientation language predating the LR default; is-a
  "stacks" that ship as chips; re-verbed edge labels that were never built; an
  owner cap of 8 that is actually 5). See `docs/TASKS.md`.
- `docs/TASKS.md` — hand-curated config rot; the `focus` cardinality bug.
