# Ownership classification — adjudication list

> # ⚠️ SUPERSEDED AS A RATIONALE DOCUMENT (2026-08-21)
>
> **Do not start here.** Siggie's assessment: this *"totally fails as an
> explanatory document and seems to have just captured history of decisions
> without a rationale even for why the decisions needed to be made in the first
> place."*
>
> The classification rules themselves are now in question — see
> **[OWNERSHIP_RETHINK.md](OWNERSHIP_RETHINK.md)**, which is the live document.
> Four concrete problems were confirmed against the code on 2026-08-21,
> including that `OWNERSHIP_OVERRIDES` is an edit log rather than a semantic
> category, and that `VALUE_OBJECTS` is a hand-typed list implementing no
> stated rule.
>
> **This file is kept as history only** — it still accurately records *what*
> was decided on 2026-07-13 and 2026-08-19, and the per-slot tables below are
> the only record of several individual calls. It does not record *why* the
> framework was chosen, which is the gap being addressed.

> **Status: ADJUDICATED 2026-07-13**, encoded in `OWNERSHIP_OVERRIDES` /
> `VALUE_OBJECTS` in `src/models/containmentGraph.ts`. This file is now the
> *rationale record*, not a pending worklist — the code is authoritative.
> Still seeds the future LinkML `containment_direction` annotations.
>
> **Re-check this after every upstream schema sync.** The overrides are
> hand-curated and go stale silently: new classes fall through to the default
> heuristic, which guesses. `Activity` (added by the 2026-08-12 sync) was
> misclassified as owning `Context` and needed a follow-up adjudication on
> 2026-08-19 — see "Later adjudications" below.
>
> Verdict vocabulary (matches the viz's edge channels):
> - **own-fwd** — source owns range (drawn source above range)
> - **own-flip** — range owns source (FK back-reference, drawn flipped)
> - **ref** — non-owning reference (gray dashed, FK direction)
> - **excluded** — edge not drawn (abstract target)

## Mechanism (implemented)

The override map described here as a plan **now exists**:

```
OWNERSHIP_OVERRIDES: Map<slotName, 'own-fwd' | 'own-flip' | 'ref' | 'excluded'>
```

in `src/models/containmentGraph.ts`, consulted by `classifySlotEdge()` before
the default heuristic. `VALUE_OBJECTS` and `EXCLUDE_HAS_A_TARGETS` remain as
range-keyed sets. The old `NO_FLIP_SLOTS` set is gone, folded into the map.

Resolution order: `EXCLUDE_HAS_A_TARGETS` → `OWNERSHIP_OVERRIDES` →
multivalued ⇒ own-fwd → range in `VALUE_OBJECTS` ⇒ own-fwd → own-flip.

That last fallthrough is the one that misfires: it assumes a single-valued
entity range is a foreign key, so any identity-less value object not listed in
`VALUE_OBJECTS` is read as *owning* the class that stores it.

## Later adjudications

### `Context.activity` → Activity (2026-08-19)

The 2026-08-12 upstream sync added `Context` and `Activity`. `Context.activity`
is single-valued with an entity range and `Activity` was not in
`VALUE_OBJECTS`, so it fell through to `own-flip`: **"Activity owns Context"**,
backwards against the schema's own descriptions (Context = "the context within
which an observation was made", holding `activity`; Activity = "an activity
that provides context to an observation").

The consequence was structural, not cosmetic. Owners sink to one layer above
their topmost owning child, so treating Activity as Context's owner stranded it
at **layer 0 — a false root** — while Context sank to layer 6.

| | Activity | Context | edge |
|---|---|---|---|
| before | layer 0 | layer 6 | `Activity → Context` (flipped) |
| after | layer 7 | layer 6 | `Context → Activity` (forward) |

**Decided: Activity is a value object.** It is `is_a: Entity` but has no
identity of its own (`activity_type` + `time_duration` only) and nothing in the
schema references it except `Context.activity`. Added to `VALUE_OBJECTS`.

Noted but not acted on: `Context.activity` is `0..1`, so a `Context` can exist
with no `Activity`, leaving only `relative_timing`. Possible upstream modeling
smell — worth raising with the schema authors; does not affect classification.

Other slots from the same sync classify correctly and need no review:
`Visit.year_range`→TimePeriod, `Condition/Procedure.affected_body_site`→
BodySite, `Activity.time_duration`→Quantity, `Observation.context`→Context
(own-fwd via multivalued).

## A. Decided (Siggie, 2026-07-13)

| slot (sites) | current | decided |
|---|---|---|
| `associated_person` (Participant → Person) | ref | **own-flip: Person owns Participant** |
| `performed_by` (ObservationSet → Organization) | ref | **own-flip: Organization owns ObservationSet** — see contested #1 for the other 7 sites |

## B. Contested — needs a call (proposals marked ✱ change current behavior)

| # | slot — sites | current | proposed | reasoning |
|---|---|---|---|---|
| 1 | `performed_by` — Observation, DimensionalObservation, MeasurementObservation, SdohObservation, SpecimenQualityObservation, SpecimenQuantityObservation, DimensionalObservationSet, MeasurementObservationSet, SdohObservationSet, SpecimenCreationActivity (→ Organization) | ref | ✱ own-flip (all sites) | Consistency with the ObservationSet decision: "Organization owns performed work." Caveat: Organization becomes a very high-degree owner; if that reads badly in the layered DAG, the fallback is own-flip for Sets/Activities only, ref for individual observations. |
| 2 | `originating_site` — Participant → Organization | ref | ref (keep) | Site of origin is provenance, not ownership. |
| 3 | `associated_assay` — MeasurementObservation → Assay | ref | ref (keep) | Assay is method metadata for the measurement. |
| 4 | `contained_in` — Specimen → SpecimenContainer | ref | ✱ own-flip: Container owns Specimen | Mirrors `parent_container` (already own-flip: container nesting is ownership). |
| 5 | `creation_activity` — Specimen → SpecimenCreationActivity | ref | ✱ own-fwd: Specimen owns it | The multivalued siblings (`processing_activity`, `storage_activity`, `transport_activity`) are already own-fwd; creation being a ref is inconsistent. Needs the new own-fwd override. |
| 6 | `dimensional_measures` — Specimen → DimensionalObservationSet | ref | ✱ own-fwd: Specimen owns it | Same family as `quality_measure`/`quantity_measure` (own-fwd). |
| 7 | `related_imaging_study` — ImagingFile → ImagingStudy | ref | ✱ own-flip: ImagingStudy owns ImagingFile | A study produces its files. Weak preference; "related_" naming argues ref. |
| 8 | `related_questionnaire_item` — SdohObservation → QuestionnaireItem | ref | ref (keep) | Cross-reference, not ownership. |
| 9 | `has_questionnaire_item` — QuestionnaireResponseItem → QuestionnaireItem | own-flip (QuestionnaireItem owns QuestionnaireResponseItem) | ✱ ref | A response item *points at* its question; the response item's owner is QuestionnaireResponse (via `items`). Question-owns-answer double-parents every response item oddly. |
| 10 | `derived_from` — File → File, ImagingFile → File | own-flip (parent File owns derived) | own-flip (keep) | Derivation lineage reads well as a vertical tree. Flag: arguably provenance-ref. |
| 11 | `parent_specimen` — Specimen → Specimen (0..*) | own-fwd (child owns its parents!) | ✱ own-flip: parent owns child | The multivalued rule misfires here: `parent_specimen` points UP the derivation tree. Needs a multivalued own-flip override. |
| 12 | `container` — SpecimenStorageActivity → SpecimenContainer (0..*) | own-fwd | ✱ ref | The activity *uses* containers; it doesn't own them. Needs a multivalued ref override. |
| 13 | `related_document` — Specimen → Document (0..*) | own-fwd | ✱ ref | "related_" = association. Weak preference. |
| 14 | `items` — QuestionnaireResponse → QuestionnaireItem (1..*) | own-fwd | own-fwd (keep) | Questionnaire.items AND QuestionnaireResponse.items both own QuestionnaireItem → double-parent. Looks like a schema quirk (response items vs questionnaire items); render honestly, maybe raise upstream. |

Stale override note: `document` sits in `NO_FLIP_SLOTS` but no class-ranged
slot named `document` exists in the current schema — drop it during the
override-map rewrite.

## C. Uncontested (heuristic verdict stands)

**own-flip — `associated_participant` (Participant owns):** Condition,
Demography, DeviceExposure, DimensionalObservation, DimensionalObservationSet,
DrugExposure, Exposure, File, ImagingFile, ImagingStudy,
MeasurementObservation, MeasurementObservationSet, Observation,
ObservationSet, Procedure, SdohObservation, SdohObservationSet,
SpecimenQualityObservation, SpecimenQuantityObservation, Visit; plus
Specimen via `source_participant`.

**own-flip — `associated_visit` (Visit owns):** the same observation/
exposure/procedure/imaging/questionnaire-response families (14 sites).

**own-flip — structural:** `member_of_research_study` (ResearchStudy owns
Participant), `part_of` (ResearchStudy owns ResearchStudy — self-loop;
ResearchStudy owns QuestionnaireItem), `parent_container` (SpecimenContainer
owns SpecimenContainer).

**own-fwd — multivalued collections:** `observations` (each ObservationSet
variant owns its Observations), `consents` (Participant AND ResearchStudy own
Consent — intended poly-parent), `entries` (ResearchStudyCollection owns
ResearchStudy), `items` (Questionnaire owns QuestionnaireItem),
`processing_activity`/`storage_activity`/`transport_activity` (Specimen owns
its activity records), `derived_product`, `quality_measure`,
`quantity_measure`, `reagent`, `additive`.

**own-fwd — value objects (drawn as owned leaves or node detail, TBD in
viz):** Quantity, TimePoint, TimePeriod, BodySite, CauseOfDeath, Substance,
BiologicProduct, QuestionnaireResponseValue* (~30 edges).

**excluded — abstract target:** `focus` and `associated_evidence` → Entity
(11 edges). Revisit later: could render as a wildcard port instead of
disappearing.
