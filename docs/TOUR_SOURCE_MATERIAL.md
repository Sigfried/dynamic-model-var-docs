# Tour source material

Prose written for the example-cases pane that is **better used as tour steps**.
Kept verbatim, with the selection each note describes, so authoring a step is a
matter of editing wording rather than rediscovering what to say.

This is a holding file for `NEXT_SESSION_EDGE_DISPLAY.md` §2.3 ("Tour steps for
edge features"), whose blocker is deciding a step list. **These four are a step
list in draft**, in order, simple to complex.

Delete this file once the material is in `src/explore/help-content.md`.

> Siggie, 2026-09-04, on being asked how hard to cull the example cases:
> *"actually, group 1 items 1-4 are good material for the tour."*
> The cases came out of the pane; the writing did not get thrown away with them.

Format for the destination file: `Tour:` names a tour and file order orders it,
`Description:` is a markdown block, beats accumulate with `Keep:`, alerts are
`>` blockquotes with `Once:`. See `src/help/FORMAT.md`.

---

## 1. One box

**Selection:** `Organization`

> A single class. Rows are its attributes: name, then range and cardinality on
> the right. The dot and the range label share a color that says what KIND of
> thing the attribute points at — blue for an entity, purple for a permissible
> value set, green for a data type. A filled dot draws an edge; a hollow one
> does not, because nothing it could point at is on the canvas.

Covers P1 (the range palette) and the filled/hollow dot convention. The
filled-vs-hollow point is the one a reader cannot guess.

---

## 2. One edge — A owns B

**Selection:** `Visit`, `TimePeriod`

> Visit owns TimePeriod. The edge leaves the `year_range` ROW, not the box, and
> the arrowhead lands on the owned class. This anchoring is the whole idea: an
> edge tells you WHICH attribute made it.

Row anchoring is the single most load-bearing idea in the diagram and the
cheapest to show — one edge, two boxes, nothing else on canvas.

---

## 3. Owns vs. belongs-to

**Selection:** `Specimen`, `Participant`, `SpecimenCreationActivity`

> Opposite directions. Specimen OWNS its creation activity (forward). Specimen
> BELONGS TO a Participant — declared as `source_participant` on Specimen, but
> drawn Participant → Specimen, because a single-valued pointer at an entity is
> a foreign key. `parent_specimen` is also here as a self-loop.

Covers the own-fwd / own-bkwd distinction *and* storage-direction
normalization — the thing most likely to look like a bug to someone who has
read the schema. Throws in a self-loop for free.

---

## 4. All three edge types at once

**Selection:** `SpecimenContainer`, `Specimen`, `Substance`,
`SpecimenStorageActivity`

> THE DECISION CASE. SpecimenContainer has exactly one of each: `additive` →
> Substance is own-fwd; `contained_in` → Specimen is own-bkwd; `container` →
> SpecimenStorageActivity is an association (dashed, arrowed BOTH ends).
> Compare own-bkwd against association here — they layer identically and differ
> only in ink.

`SpecimenContainer` really does carry exactly one of each of the three verdicts,
which is why this case exists at all. Note the original text said association is
"slate" — it is now inside the P2 Blues ramp; the dash carries the distinction,
not faintness. **Fix that word when the step is written.**

---

## Also worth a step, from the same group

Not part of Siggie's "items 1-4", but the same kind of writing:

### Both associations, under crowding

**Selection:** `Document`, `Organization`, `Participant`, `Specimen`,
`SpecimenContainer`, `SpecimenStorageActivity`

> The schema has exactly TWO association edges and both are here:
> `Specimen.related_document` → Document and `SpecimenStorageActivity.container`
> → SpecimenContainer. Case 4 shows the three verdicts isolated; this shows them
> competing for the same borders. Watch SpecimenContainer's right side, where an
> association and an own-bkwd edge arrive together — both leave a slot row on the
> right and point back left, so they are the pair that header-side merging has to
> keep distinguishable. `Participant.originating_site` → Organization is the
> other thing to look at: own-bkwd today, arguably an association.

The last sentence is a note to ourselves, not tour copy.

### A small real neighbourhood

**Selection:** `BodySite`, `Condition`, `ImagingFile`, `ImagingStudy`,
`MeasurementObservation`, `Procedure`, `SpecimenCreationActivity`

> BodySite and its six owners — the smallest convergence that still looks like a
> real diagram. Six edges arriving on one box, each from a different attribute
> row.

A good closing step for the edge sequence: it is the first view that looks like
what someone will actually build, and it re-states row anchoring at scale.

---

## Edge features still wanting a step

§2.3's candidate list, for whoever settles it. The four above cover P1, row
anchoring, direction, and the three kinds. Not yet covered anywhere:

- **P3 sibling colors** and what a merged-inheritance box is. The existing
  "The full Observation family" case (still in the pane) is the material.
- **A narrowed edge pointing at a child header** — `slot_usage` narrowing, shipped
  2026-09-02. `MeasurementObservationSet.observations` → the
  `MeasurementObservation` header inside the Observation box.
- **The relation menu** as the way to grow the canvas.
