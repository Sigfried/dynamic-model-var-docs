# Ownership classification

How every class-ranged slot in the schema becomes an edge in the ownership
diagram, and what "ownership" means here.

> **Status: proposed target, not yet implemented.** The rules in Part 1 are a
> proposal for where we are going. Part 4 records where we actually are — the
> rules the code runs today, their exceptions, and where they live. The two do
> not agree; the gap is the work.
>
> Ownership classification is Siggie's call. Part 2 lists what the simple rule
> gets wrong and Part 3 argues the exceptions; both are input to that call, not
> a settled answer.

---

## Part 0 — What ownership means

The diagram is a **layered DAG**: if `A` is drawn above `B` with an ownership
edge between them, a reader should conclude **`B` is reached through `A`.** `A`
is where you start if you want to find `B`; `B` is a part of `A`'s record
rather than a thing you look up independently.

Two consequences follow, and they are what make the classification non-obvious:

- **Ownership is not slot direction.** A slot is a pointer, and pointers in
  this schema mostly run *from* the dependent thing *to* the thing it depends
  on. `Condition.associated_participant` is declared on `Condition`, but a
  reader navigates Participant → Condition, not the reverse. Drawing edges as
  declared would put every observation, exposure and procedure *above* the
  Participant they describe. So ownership edges are often **flipped** relative
  to the schema declaration.
- **Ownership must stay acyclic** (self-loops aside), or there are no layers to
  draw. This is not an aesthetic preference — it is the constraint that decides
  several otherwise-arguable calls, and it is the strongest available argument
  for the one exception in Part 3.

Three verdicts, plus one non-verdict:

| verdict | meaning | drawn |
|---|---|---|
| `own-fwd` | source owns range | source above range, edge as declared |
| `own-flip` | range owns source | range above source, edge reversed |
| `ref` | real relationship, not ownership | gray dashed, declared direction, no layering effect |
| `excluded` | edge not drawn at all | — |

`ref` and `excluded` are escape hatches. Every one of them is a place the model
is telling us something the layered DAG cannot show, and each should have to
justify itself.

---

## Part 1 — The rules

**Rule 1 — Multivalued slot ⇒ `own-fwd`.**
`A.things: B[]` means A holds a collection of Bs. The collection is part of A's
record. Draw A above B.

**Rule 2 — Single-valued slot ⇒ `own-flip`.**
`A.thing: B` reads as a foreign key: A carries a pointer to one B that exists
independently. The B is the anchor and the A hangs off it. Draw B above A.

That is the whole rule. It is a one-line function of `multivalued`, reads
nothing but the schema, and cannot go stale on a sync:

```
verdict = multivalued ? 'own-fwd' : 'own-flip'
```

It classifies **150 of 150** class-ranged slot edges with no lookup tables, no
name matching, and no hand-curated sets.

**Why this shape.** Cardinality is the only ownership signal the schema
actually carries. Checked on 2026-08-21 against `public/source_data/HM/bdchm.yaml`:

- `identifier` — useless. Every one of the 54 classes inherits `id` from
  `Entity`, so every class has an identifier. It discriminates nothing.
- `inlined` / `inlined_as_list` — set on only 10 of 150 edges, and not
  consistently with ownership: `Specimen.parent_specimen` is
  `inlined_as_list` but points *up* the derivation tree, and
  `SpecimenStorageActivity.container` is inlined but is a use, not an
  ownership.
- `required`, `abstract`, `is_a` depth — carry no ownership signal.
- Derived "value object" predicates were tested and fail. "Class with no
  class-ranged slots of its own" catches 9 of the 14 classes currently listed
  by hand but misses `TimePoint`, `TimePeriod`, `Substance`, `Activity`,
  `QuestionnaireResponseValueTimePoint`. Closing that recursively (a class all
  of whose class-ranged slots target value objects) over-collects wildly — it
  pulls in `Participant`, `Visit`, `Organization`, `ResearchStudy` and 22
  others, i.e. most of the schema.

So there is no schema-derived way to distinguish "value object" from "entity."
If that distinction is needed, it has to be asserted — which is what Part 3 is
about.

**Rule 0 (mechanical, not a judgement).** A slot whose range is `Entity` has no
specific target. `Entity` is the universal root; an edge to it points at
everything and constrains nothing. These are handled as a rendering question,
not a classification one — see Part 2, misfit group C.

---

## Part 2 — What doesn't fit

Applying Rules 1–2 with **zero exceptions** changes **63 of 150 edges**
relative to what the code produces today. Grouped by what is actually at stake.

### Group A — Value objects become owners (40 edges)

Single-valued slots pointing at `Quantity`, `TimePoint`, `BodySite`,
`TimePeriod`, `Substance`, `Activity`, `CauseOfDeath`, `BiologicProduct`,
`QuestionnaireResponseValue*`. Rule 2 flips these, making the value the owner.

Consequence, measured: **`Quantity` acquires 13 owned classes and `TimePoint`
8** — Quantity ends up above `MeasurementObservation`, `Procedure`,
`SpecimenCreationActivity`, `Assay`, `Substance` and others; TimePoint above
`ResearchStudy`, `Consent`, and every Specimen activity. A reader would
conclude that to find a ResearchStudy you start from a TimePoint.

It also breaks the DAG. Three cycles appear, all routed through a value object:

```
ResearchStudy → TimePoint → ResearchStudy
SpecimenCreationActivity → Specimen → SpecimenProcessingActivity → Quantity → SpecimenCreationActivity
Specimen → SpecimenProcessingActivity → Quantity → SpecimenStorageActivity → SpecimenContainer → Specimen
```

The 40 affected edges:

| range | edges | sample slots |
|---|---|---|
| Quantity | 16 | `value_quantity` (×6), `range_low`, `range_high`, `duration`, `quantity_collected`, `substance_quantity`, `lower/upper_limit_of_detection` |
| TimePoint | 17 | `date_started`/`date_ended` (×5 each), `valid_from`, `valid_to`, `period_start`, `period_end`, `index_time_point` |
| BodySite | 6 | `affected_body_site` (×2), `body_site`, `anatomical_site`, `body_part_examined`, `collection_site` |
| TimePeriod | 1 | `Visit.year_range` |
| Activity | 1 | `Context.activity` |
| QuestionnaireResponseValue | 1 | `QuestionnaireResponseItem.response_value` |

### Group B — Association slots become ownership (8 edges)

Currently `ref`; Rule 1 or 2 makes them ownership.

| slot | becomes | reading it forces |
|---|---|---|
| `Participant.originating_site → Organization` | own-flip | Organization owns Participant |
| `SpecimenTransportActivity.transport_origin → Organization` | own-flip | Organization owns the transport |
| `SpecimenTransportActivity.transport_destination → Organization` | own-flip | ditto — and both at once |
| `MeasurementObservation.associated_assay → Assay` | own-flip | Assay owns the measurement |
| `QuestionnaireResponseItem.has_questionnaire_item → QuestionnaireItem` | own-flip | question owns the answer |
| `SdohObservation.related_questionnaire_item → QuestionnaireItem` | own-flip | question owns the observation |
| `Specimen.related_document → Document[]` | own-fwd | Specimen owns the Document |
| `SpecimenStorageActivity.container → SpecimenContainer[]` | own-fwd | the activity owns the container |

Note `transport_origin` and `transport_destination` both land on `Organization`
from the same class — under Rule 2 the same Organization node is drawn as owner
twice over for opposite roles. That is a real signal that the slot is a role,
not a containment.

`SpecimenStorageActivity.container` is the edge that produces the one cycle
that survives even *with* the Part 3 exception:
`Specimen → SpecimenStorageActivity → SpecimenContainer → Specimen`.

### Group C — `Entity`-ranged slots (12 edges)

7 single-valued `focus` slots and 5 multivalued (`focus` ×4 plus
`Condition.associated_evidence`). Today they are dropped. Under Rules 1–2 the
single-valued ones make `Entity` the owner of 5 observation classes, and the
multivalued ones make 5 classes own `Entity` — i.e. own everything, since every
class `is_a Entity`.

Both readings are wrong, but **dropping them is also wrong** — `focus` carries
real meaning ("this observation is about *something*") and deleting it silently
removes information. This is a rendering problem (a wildcard port, or an
`Entity` node that is drawn but not layered), not a classification problem. It
should not be solved with a classification exception.

### Group D — Specimen-family inconsistencies (3 edges)

| slot | today | Rules 1–2 |
|---|---|---|
| `Specimen.creation_activity → SpecimenCreationActivity` | own-fwd (override) | own-flip |
| `Specimen.dimensional_measures → DimensionalObservationSet` | own-fwd (override) | own-flip |
| `Specimen.parent_specimen → Specimen[]` | own-flip (override) | own-fwd |

The first two are single-valued slots whose multivalued siblings
(`processing_activity`, `storage_activity`, `transport_activity`;
`quality_measure`, `quantity_measure`) are own-fwd under Rule 1. So Rules 1–2
split a family of five slots by cardinality alone, and the schema's choice of
`0..1` vs `0..*` here looks incidental rather than meaningful.

`parent_specimen` is the mirror case: multivalued, so Rule 1 says Specimen owns
its parents — pointing up the derivation tree. It is a self-loop, so it does
not affect layering, but the arrow reads backwards.

**These three are the strongest evidence that cardinality is not a perfect
proxy for ownership.** They are also only three edges, and two of them are
arguably an upstream modeling inconsistency worth raising rather than
patching locally.

---

## Part 3 — Arguments for exceptions

Only one exception is worth making. The rest are listed with the argument
against.

### Recommended: value objects are never owners (1 exception, covers 40 edges)

**Rule 3 — a single-valued slot whose range is a *value object* is `own-fwd`.**

The argument is not aesthetic. It is that Rule 2's premise fails for these
classes. Rule 2 says "a single-valued pointer means the target exists
independently and the source hangs off it." For `Quantity`, `TimePoint`,
`BodySite` that is false: a Quantity of `5 mg` is not a thing you navigate to
and find its observations hanging beneath it. It has no independent existence
and no identity worth anchoring on. The pointer is *containment expressed as a
pointer* — the value belongs to whoever holds it.

Three independent facts support treating this as a real category, not a
preference:

1. **It is the only thing that makes the graph a DAG.** All three cycles under
   Rules 1–2 route through `Quantity` or `TimePoint`. Adding this exception
   removes all three, leaving only the one genuine cycle in group B.
2. **The degree numbers are absurd without it.** Quantity as owner of 13
   classes and TimePoint of 8 is a larger structure than anything real in the
   schema.
3. **These classes are structurally distinct.** 9 of the 14 have *no
   class-ranged slots at all* — they are pure leaves. The other 5 point only at
   other value objects. No non-value-object class has that shape except
   `Organization` (which is a genuine entity, and a known false positive for
   this test).

**The cost, stated plainly: this is an assertion, not a derivation.** As
established in Part 1, nothing in the schema marks these classes. Membership
has to be written down somewhere and will go stale on every upstream sync — the
exact hazard tracked in `docs/TASKS.md` as hand-curated config rot.

Three ways to pay that cost, worst to best:

- **Keep a hand-typed list in TypeScript** (status quo). Silent staleness, no
  review point.
- **Assert it in a LinkML overlay.** A side schema, or `annotations:` on the
  classes, saying `is_value_object: true`. Still hand-maintained, but it lives
  in schema-shaped data, is reviewable as a diff, and is the format that could
  eventually go upstream. Matches the stated preference for
  linkml-conventional formats and Python linkml tooling.
- **Get it upstream.** The right long-run answer: these classes genuinely are
  value objects and the schema should say so. Requires the schema authors.

Either way, **add a sync check**: any class not in the list that is a pure leaf,
or any listed class that stops being one, is flagged for review. That converts
silent rot into a visible question. It also gives the 14-name list an
independent test rather than leaving it as bare enumeration.

### Not recommended, with reasons

**Exception for group B associations.** Tempting — `Organization` owning every
Participant it originated is clearly wrong. But there is no test that separates
these 8 from the ~40 single-valued entity slots that stay own-flip. The current
code's reasons ("provenance, not ownership"; "the activity *uses* containers")
restate the conclusion. Three of the eight rest on the slot being *named*
`related_*`, which is a naming convention doing semantic work. **Take the
mis-reading instead, and note it.** If a distinction later emerges that
separates role-pointers from FK-pointers, revisit — the `transport_origin` /
`transport_destination` pair landing on one target is the clue worth pulling on.

**Exception for group D.** Three edges, and the inconsistency is upstream
(`creation_activity` being `0..1` while its four siblings are `0..*`). Patching
it here hides a schema question that should be raised. Draw honestly, flag
upstream.

**Exception for group C (`Entity`).** Not a classification problem. See group C.

### Where that leaves us

| | rules | hand-maintained entries | edges classified by schema alone |
|---|---|---|---|
| today | 5 | 30 (15 override + 14 value-object + 1 exclude) | 32 / 150 |
| Rules 1–2 | 2 | 0 | 150 / 150 |
| Rules 1–3 | 3 | 14 (value objects, ideally upstream) | 110 / 150 |

Rules 1–3 leave **one** hand-maintained set, with a stated principle, an
independent structural test, and a path to being asserted in the schema itself.

Open, deliberately not decided here: whether `ref` should survive at all as a
verdict. Under Rules 1–3 nothing produces it. Keeping it means keeping a
category with no rule that assigns it; dropping it means group B renders as
wrong-direction ownership. That is a call about what the diagram is for.

---

## Part 4 — Where we are now

What the code does today. Recorded so the gap is visible; **not a description
of what it should do.**

### Resolution order

`classifySlotEdge` in `src/models/containmentGraph.ts`:

```
1. range ∈ EXCLUDE_HAS_A_TARGETS  → excluded     (1 entry)
2. slotName ∈ OWNERSHIP_OVERRIDES → that verdict  (15 entries)
3. multivalued                    → own-fwd
4. range ∈ VALUE_OBJECTS          → own-fwd       (14 entries)
5. otherwise                      → own-flip
```

Steps 3–5 are Rules 1–3 above. Steps 1–2 are the accumulated exceptions.

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

**`VALUE_OBJECTS`** (14) — `Quantity`, `TimePoint`, `TimePeriod`, `BodySite`,
`CauseOfDeath`, `Substance`, `BiologicProduct`, `Activity`,
`QuestionnaireResponseValue` + its 5 typed subclasses.
Intended principle: "a class with no identity of its own." Nothing computes it;
membership is by typing a name into the list.

**`OWNERSHIP_OVERRIDES`** (15) — keyed by slot name, pre-empts everything but
`excluded`:

| verdict | slots |
|---|---|
| `ref` (8) | `originating_site`, `associated_assay`, `transport_origin`, `transport_destination`, `related_questionnaire_item`, `has_questionnaire_item`, `container`, `related_document` |
| `own-fwd` (2) | `creation_activity`, `dimensional_measures` |
| `own-flip` (5) | `parent_specimen`, `performed_by`, `associated_person`, `contained_in`, `related_imaging_study` |

**This set is not a semantic category.** It is an edit log: membership records
that the heuristic was wrong *or* that an earlier override had to be undone.
`performed_by` is in it and `associated_participant` is not, despite being the
same kind of relationship — the difference is that `performed_by` was
previously pinned to `ref` by the retired `NO_FLIP_SLOTS` set, so changing it
needed an entry. Nothing distinguishes the two semantically.

**`EXCLUDE_HAS_A_TARGETS`** (1) — `Entity`. Drops the 12 `focus` /
`associated_evidence` edges. Distinct from `SKIP_SUBCLASS_EXPANSION` (also
`Entity`), which suppresses is-a edges to the universal root and is sound.

### Where it lives

- `src/models/containmentGraph.ts` — `classifySlotEdge`,
  `classifySlotEdgeExplained` (returns verdict + which rule fired),
  `OWNERSHIP_RULE_TEXT`, and the three sets above.
- `src/services/DataService.ts` — `getOwnershipPairGroups()`,
  `getConvergenceRanking()`, `getDivergenceRanking()`.
- `src/explore/OwnershipLegend.tsx` — renders every slot grouped by the rule
  that classified it.
- `src/test/ownershipLegend.test.ts` — asserts the legend cannot drift from the
  graph's actual edges.

`classifySlotEdgeExplained` should survive any rewrite. Having the classifier
report *which* rule fired is what made these problems visible.

### Measured structure, for comparing any change against

Diverging (ownership edges out): Participant 22 (21 flipped), Visit 19 (18
flipped), Organization 11 (11 flipped), Specimen 8 (0 flipped).
Converging (in): Quantity 19 (16 classes), TimePoint 16 (8), BodySite 6,
Context 6.

Participant's outbound fan is the largest structure in the diagram and is
almost entirely `associated_participant` (20 sites) — produced by Rule 2. Rule
2 also produces `associated_visit` (18 sites) and `performed_by` (11 sites).
**These three slot names alone account for 49 of the 112 single-valued edges.**
Any change to Rule 2 reshapes most of the diagram.

Ownership today is acyclic apart from 5 self-loops
(`TimePoint.index_time_point`, `File.derived_from`, `Specimen.parent_specimen`,
`ResearchStudy.part_of`, `SpecimenContainer.parent_container`) and one real
3-node cycle once refs join:
`Specimen → SpecimenStorageActivity → SpecimenContainer → Specimen`.

---

## See also

- [OWNERSHIP_RETHINK.md](OWNERSHIP_RETHINK.md) — why the previous version of
  this document was discarded, and the four problems that prompted it.
- `docs/TASKS.md` — hand-curated config rot, the recurring staleness hazard.
