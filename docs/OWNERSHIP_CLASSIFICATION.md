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

### Exception 1a — association slots (2 edges)

Multivalued, but no ownership is claimed: `Specimen.related_document` and
`SpecimenStorageActivity.container`. See the association table below.

### Known wart — `Specimen.parent_specimen` (1 edge)

Multivalued, so Rule 1 makes Specimen own its parents — pointing up the
derivation tree. It is a self-loop, so layering is unaffected, but the arrow
reads backwards. **Drawn honestly rather than patched**; the inconsistency is
upstream and worth raising with the schema authors.

---

## Rule 2 — Single-valued slot ⇒ `own-bkwd`

`A.thing: B` — A carries a pointer to one B that exists independently, stored
member-side. **A belongs to B.** Draw B before A.

**59 edges** — the largest category. `associated_participant` (20 sites),
`associated_visit` (18) and `performed_by` (11) alone account for 49 of them, so
any change to this rule reshapes most of the diagram.

### Exception 2a — targets with no independent existence ⇒ `own-fwd` (40 edges)

Rule 2's premise fails when the target is not something you can navigate to. The
pointer is containment expressed as a pointer, and the value belongs to whoever
holds it — so these draw **forward**, source before range.

Without this exception `Quantity` would acquire 13 owned classes and `TimePoint`
8, and a reader would conclude that to find a `ResearchStudy` you start from a
`TimePoint`.

| range | edges | slots |
|---|---|---|
| TimePoint | 17 | `date_started`/`date_ended` (×5 each), `valid_from`, `valid_to`, `period_start`, `period_end`, `index_time_point` |
| Quantity | 16 | `value_quantity` (×6), `range_low`, `range_high`, `duration`, `quantity_collected`, `substance_quantity`, `lower/upper_limit_of_detection` |
| BodySite | 6 | `affected_body_site` (×2), `body_site`, `anatomical_site`, `body_part_examined`, `collection_site` |
| TimePeriod | 1 | `Visit.year_range` |
| Activity | 1 | `Context.activity` |
| QuestionnaireResponseValue | 1 | `QuestionnaireResponseItem.response_value` |

Membership is the **`single_value_owner_slots`** list — 14 classes: `Quantity`,
`TimePoint`, `TimePeriod`, `BodySite`, `CauseOfDeath`, `Substance`,
`BiologicProduct`, `Activity`, `QuestionnaireResponseValue` + its 5 typed
subclasses.

**This list cannot be derived from the schema.** Verified 2026-08-21:

- `identifier` — all 54 classes inherit `id` from `Entity`. Discriminates nothing.
- `inlined` / `inlined_as_list` — set on 10 of 150 edges and inconsistent with
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

### Exception 2b — association slots (6 edges)

Single-valued, but no ownership is claimed. See below.

### Known wart — `creation_activity`, `dimensional_measures` (2 edges)

Single-valued, so Rule 2 makes them `own-bkwd`, while their multivalued siblings
(`processing_activity`, `storage_activity`, `transport_activity`;
`quality_measure`, `quantity_measure`) are `own-fwd` under Rule 1. Rules 1–2
split a family of five by cardinality alone, and the schema's `0..1` vs `0..*`
choice here looks incidental. **Drawn honestly; raise upstream.**

---

## `association` — 20 edges

Neither class owns the other. Drawn with **arrowheads at both ends**, target
ordered first (same layering as `own-bkwd`, no ownership claim).

Each of these could have been `own-bkwd` — the target does exist independently,
so "belongs to" would be defensible — but the relationship is a role, a
reference, or a use rather than membership.

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

### `Entity`-ranged slots (12 edges)

The only slots ranging on `Entity` are `focus` (11 sites) and
`Condition.associated_evidence` (1). Nothing else in the schema targets `Entity`.

`focus` has no top-level definition — it is declared on three classes and
inherited by the rest:

| declared on | multivalued | inherited by |
|---|---|---|
| `Document.focus` | No | — |
| `Observation.focus` | No | DimensionalObservation, MeasurementObservation, SdohObservation, SpecimenQualityObservation, SpecimenQuantityObservation |
| `ObservationSet.focus` | **Yes** | DimensionalObservationSet, MeasurementObservationSet, SdohObservationSet |

So **7 single-valued + 4 multivalued `focus`, + 1 multivalued
`associated_evidence` = 12.**

Neither rule can classify these: the single-valued ones would make `Entity` the
owner of 7 classes, and the multivalued ones would make 5 classes own `Entity` —
i.e. own everything. **`associated_evidence` admits no sensible ownership
assignment in either direction**, which is the case that requires the
association category to exist.

They must not be dropped. `focus` carries real meaning — "this observation is
about *something*" — and deleting it silently removes information.

> **Note:** the Kitchen Sink detail panel currently misreports `focus` as
> single-valued at all 11 sites, because attribute elements are keyed by slot
> name and the three declarations collapse into one. Known bug — see
> `docs/TASKS.md`, "Class-specific slot definitions."

---

## Summary

| category | edges | drawn |
|---|---|---|
| `own-fwd` — Rule 1 (multivalued) | 31 | forward |
| `own-fwd` — Exception 2a (no independent existence) | 40 | forward |
| `own-bkwd` — Rule 2 (single-valued) | 59 | back |
| `association` — slot-level | 8 | back, both ends arrowed |
| `association` — `Entity`-ranged | 12 | back, both ends arrowed |
| **total** | **150** | |

Two rules, one asserted list of 14 class names, and one enumerated set of 8
association slots. Everything else reads directly from the schema's
`multivalued` flag.

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
geometry.

Verified 2026-08-24: under the rules above, the layering channel has **zero
cycles** apart from 5 self-loops (`TimePoint.index_time_point`,
`File.derived_from`, `Specimen.parent_specimen`, `ResearchStudy.part_of`,
`SpecimenContainer.parent_container`). This holds whether or not the
`Entity`-ranged edges participate in layering, so either choice is safe.

Two properties worth preserving as tests: the self-loop count, and that
`SpecimenStorageActivity.container` as `own-fwd` reintroduces the one non-self
cycle (`Specimen → SpecimenStorageActivity → SpecimenContainer → Specimen`).

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

Under the rules above: the 8 `ref` entries become the `association` set, the 5
`own-flip` entries become what Rule 2 already produces (no entry needed), and the
2 `own-fwd` entries are dropped as warts drawn honestly.

**`EXCLUDE_HAS_A_TARGETS`** (1) — `Entity`. Drops the 12 `Entity`-ranged edges.
**Already decided to be wrong, not yet removed** (WORKLOG.md, 2026-08-21):

- `SKIP_SUBCLASS_EXPANSION` (also `Entity`) suppresses **is-a** edges to the
  universal root. Every class `is_a Entity`, so those are pure noise. **Sound;
  keep.**
- `EXCLUDE_HAS_A_TARGETS` suppresses slots that **range on** `Entity` — a
  different situation, since those are deliberate polymorphic pointers.

Only the first was ever intended. The second survives because
`classifySlotEdgeExplained` tests it first (`containmentGraph.ts:127`).
`src/test/containmentGraph.test.ts:102` currently asserts the rejected behavior
and will need updating.

### Where it lives

- `src/models/containmentGraph.ts` — `classifySlotEdge`,
  `classifySlotEdgeExplained`, `OWNERSHIP_RULE_TEXT`, the three sets.
- `src/services/DataService.ts` — `getOwnershipPairGroups()`,
  `getConvergenceRanking()`, `getDivergenceRanking()`.
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
