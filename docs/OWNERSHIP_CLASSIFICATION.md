# Ownership classification — adjudication list

> **Status: AWAITING ADJUDICATION** (EXPLORE_VIZ.md build step 1).
> Every class-ranged slot in the live schema (142 edges), with the FK-flip
> heuristic's current verdict and a proposed verdict where they differ.
> Once adjudicated, decisions are encoded in `src/models/containmentGraph.ts`
> overrides and seed the future LinkML `containment_direction` annotations.
>
> Verdict vocabulary (matches the viz's edge channels):
> - **own-fwd** — source owns range (drawn source above range)
> - **own-flip** — range owns source (FK back-reference, drawn flipped)
> - **ref** — non-owning reference (gray dashed, FK direction)
> - **excluded** — edge not drawn (abstract target)

## Mechanism gap (implementation note)

The current overrides are three binary sets (`VALUE_OBJECTS`,
`NO_FLIP_SLOTS`, `EXCLUDE_HAS_A_TARGETS`) plus two hard rules (multivalued →
own-fwd; single → own-flip). Several proposals below are inexpressible in
that scheme (e.g. own-fwd for a single-valued entity range; ref or own-flip
for a multivalued slot). Build step 1 replaces the sets with one override
map, slot-name-keyed with optional `Class.slot` keys:

```
OWNERSHIP_OVERRIDES: Map<slotKey, 'own-fwd' | 'own-flip' | 'ref' | 'excluded'>
```

defaulting to the existing heuristic when a slot has no entry.

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
