# Ownership / containment / has-a relationships

How every class-ranged slot in the schema becomes an edge in the diagram, what
each kind of edge means, and how the diagram colors what it draws.

**This is the technical reference.** User-facing wording lives in
`src/explore/help-content.md` (help entries and the guided tour) and in the
Ownership legend, which derives itself from the live classifier. Where the same
thing has to be said in both places, this file states the rule and help states
it in the second person; neither restates the other at length.

Decision history — what was tried, rejected, and why — is in `WORKLOG.md`. This
file states what is true now.

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

---

## The relation vocabulary

Three relation **kinds**, two of which can be seen from three **perspectives**:

```
2 (own-fwd, own-bkwd) × 3 (perspectives) + 1 (association) = 7
```

The kind is a property of the edge. The perspective is a property of the
*reader* — which end they are looking from — and exists only once they have
picked an entity out. With nothing hovered or selected there is no point of
view, so **the three kinds are all the canvas encodes**; perspective belongs to
hover behaviour and to the words in the relation menu.

### The three kinds

| kind | relationship | drawn |
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
appears in the legend or an edge label. **[sg] this is wrong** -- observation
definitely doesn't own a participant, etc. probably need to completely
rewrite this whole section from scratch. the five positions use "belong"
language for both directions.

`association` makes **no ownership claim in either direction**.

**`own-bkwd` and `association` are separate categories and stay that way**
(settled by Siggie 2026-08-26; closed, do not reopen). `own-bkwd` asserts
"belongs to"; `association` asserts nothing. They happen to *layer* identically —
both order the target first — but that is geometry, not meaning, and the two
claims are not interchangeable.

### The five positions, and the two axes they decompose onto

`RelationPosition` (`src/models/ownershipSubgraph.ts`) is the three kinds
crossed with **who declares the slot**. `association` does not split, because
neither end declares ownership:

| position | label (`RELATION_POSITION_LABEL`) |
|---|---|
| `owns-mine` | belong to me by my attribute |
| `owns-theirs` | belong to me by their attribute |
| `owned-mine` | I belong to, by my attribute |
| `owned-theirs` | I belong to, by their attribute |
| `association` | associated with |

**Two independent facts are folded into those five names**, and the UI reads
them separately. Keeping them apart is the thing to get right here — they were
conflated repeatedly while the relation bar was designed (2026-09-04), in both
directions:

- **SIDE** — where the class sits on the canvas. Layout is owner-first, so
  everything that **owns me** is drawn to my **left** and everything **I own**
  to my **right**.
- **KIND** — the edge's verdict: which end carries the arrowhead, and therefore
  which class declares the slot.

| position | side | kind | glyph |
|---|---|---|---|
| `owned-mine` | left | `own-bkwd` | `--<` |
| `owned-theirs` | left | `own-fwd` | `-->` |
| `owns-mine` | right | `own-fwd` | `-->` |
| `owns-theirs` | right | `own-bkwd` | `--<` |
| `association` | left | `association` | `<-->` |

**Both kinds appear on both sides**, which is why they are independent rather
than two names for one thing. Of the four classes that own `Observation`, three
do so because Observation points at them (`own-bkwd`) and one because
`ObservationSet` collects it (`own-fwd`). A reader cannot infer the kind from
the side, nor the side from the kind. `src/test/relationBar.test.ts` asserts
exactly this, against the real schema.

`association` sits on the left because the layout orders its target first,
exactly as `own-bkwd` does — geometry, not an ownership claim.

The same relationship described from its two ends is one relationship, not two
alternatives. A hovered edge shows **one** label, at the end the pointer is
nearer; the neutral phrasing ("contains", "contained by", "associated with") is
for prose, where no reader has a position.

Full close/middle/far phrasings, and the reasoning that ruled out persistent
on-edge labels, are in `WORKLOG.md` (2026-09-02).

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

**30 edges** (measured 2026-08-31). Examples: `ObservationSet.observations`,
`Questionnaire.items`, `Participant.consents`, `Specimen.processing_activity`.

Two multivalued slots are **not** `own-fwd` — `Specimen.related_document` and
`SpecimenStorageActivity.container` are association; see that table.

`Specimen.parent_specimen` is multivalued, so Rule 1 would make Specimen own its
parents, pointing up the derivation tree. It is a **self-loop, rendered as a `⟲`
marker on the slot's own row rather than a routed edge**, so nothing about
layering or direction is visible.

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

Membership is `SINGLE_VALUE_OWNER_TARGETS` — 14 classes: `Quantity`,
`TimePoint`, `TimePeriod`, `BodySite`, `CauseOfDeath`, `Substance`,
`BiologicProduct`, `Activity`, `QuestionnaireResponseValue` + its 5 typed
subclasses.

**This list cannot be derived from the schema.** Verified 2026-08-21 — every
candidate discriminator fails:

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

**Asserted, not derived**, and deliberately so: the only clean discriminator for
the four `*Set` classes is the name suffix, and exactly one slot in the schema
ranges single-valued on one — a "collection-ranged" rule would have a single
member resting on a naming convention. Two asserted entries with stated reasons
is more honest than a rule that looks derived and is not.

---

## `association` — 2 edges

Neither class owns the other. Drawn dashed with **arrowheads at both ends**,
target ordered first (same layering as `own-bkwd`, no ownership claim).

| source | slot | target | why not ownership |
|---|---|---|---|
| Specimen | `related_document` | Document[] | Multivalued, so Rule 1 would claim the Specimen *owns* the document — but a document a specimen references is not part of it, and other classes may reference the same one. |
| SpecimenStorageActivity | `container` | SpecimenContainer[] | Multivalued, so Rule 1 would claim the activity owns the containers. It doesn't: a container outlives the activity and holds specimens independently of it. Ownership here also creates the graph's only non-self cycle — `Specimen → SpecimenStorageActivity → SpecimenContainer → Specimen` — which association breaks. |

Both arguments have the same shape, and it is the shape that justifies the
category: **Rule 1 would claim ownership here, and it is wrong.** A slot whose
argument is instead "it's a role, not membership" belongs in `own-bkwd`, which
is what "belongs to" already says — six single-valued slots were dropped from
this set on exactly that reasoning (`WORKLOG.md`, 2026-08-25).

**The set is enumerated by slot name, not by (class, slot) pair** —
`ASSOCIATION_SLOTS.has(slotName)`, so listing `container` catches every site of
`container`. Both members happen to occur at exactly one class each; see the
appendix for why that is luck rather than design.

---

## `Entity`-ranged slots ⇒ `own-fwd` (13 edges)

These point forward, like any other ownership edge — source before range, single
arrowhead. They are not association.

As of the `28007df` sync the slots ranging on `Entity` are `focus` (11 sites),
`Condition.associated_evidence` (1), and
`MeasurementObservation.associated_artifact` (1) — **13 sites**. This list grows
whenever upstream generalizes a range, so treat it as measured rather than
fixed. A convergence that keeps growing is worth watching: it is the kind of
thing that turns a readable diagram into a hairball.

They must not be dropped. `focus` carries real meaning — "this observation is
about *something*" — and deleting it silently removes information.

### `Entity` is a range node but not an inheritance parent

**This is the distinction the whole `Entity` problem turns on**, and it keeps
getting re-conflated:

- **As an inheritance parent** — every class `is_a Entity`, so drawing those
  edges adds a fan of pure noise. Suppressed by `SKIP_SUBCLASS_EXPANSION`. This
  holds for any future inheritance view too.
- **As a slot range** — a deliberate polymorphic pointer that means something.
  Entity-ranged edges classify normally (rule `entity-ranged`, always forward).
- **As a node** — `Entity` is in `classIds` and, now that its inbound range
  edges are drawn, it touches edges and survives `pruneIsolated`.

**The problem is never the fact, it is the fan.** `RelationshipInfoBox` saying
"Parent class: Entity" is true and useful; `LinkOverlay` rendering every
`is_a Entity` link, and the containment graph fanning 53 of them, is the noise.

### ▶️ PLANNED — one inheritance accessor, with a required argument

Inheritance is derived two independent ways today, and neither calls the other:

| path | used by |
|---|---|
| `getParentClass` / `getSubclasses` (`Graph.ts`) | only `buildContainmentGraph`. `getSubclasses` has **no callers at all**. |
| `DataService.getEdgesForItem(...)` filtered on `EDGE_TYPES.INHERITANCE` | `RelationshipInfoBox.tsx`, `LinkOverlay.tsx` |

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

### `focus` carries per-class cardinality

The source YAML declares `focus` on many classes with differing cardinality.
`bdchm.processed.json` used to collapse all of them into one slot keyed `focus`,
with `multivalued: false` and an owner that was none of the declaring classes.
**The induced-slots migration fixed this**: there is no bare `focus` key any
more, only 11 per-class entries (`focus-Document`, `focus-ObservationSet`,
`focus-Observation`, …), each carrying the cardinality its own class declares —
so `focus-ObservationSet` is multivalued and `focus-Document` is not.

The verdicts never depended on it: `entity-ranged` fires before the multivalued
test, so all `focus` sites drew forward either way. That immunity is a point in
the rule's favour, but the underlying data is correct now regardless.

---

## `any_of` ranges — not handled (low priority)

**The app ignores `any_of` entirely.** Exactly **one** slot in the schema uses it:

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
correctness.** What is lost is real, though:

- The diagram says "points at some Entity" where the schema says "points at an
  `Assay`, a `File`, or a `QuestionnaireResponse`".
- It adds a 13th edge to the `Entity` convergence instead of three informative
  edges to named classes.
- **`Assay` became unreachable.** `associated_assay` was the only slot ranging on
  `Assay`; after the `28007df` rename nothing ranges on it. It keeps 3 outbound
  edges so `pruneIsolated` does not drop it — but it sits at layer 0 as a **false
  root**, a class you cannot navigate *to*.

### The decision (option 1, taken)

**Leave it; assert it stays small.** A test fails when a *second* slot grows an
`any_of`, so the decision gets revisited on evidence rather than rotting
silently. Two things follow, both cheap and neither yet done:

- **The label explains it.** `associated_artifact` gets a marker on the **row**
  saying it may point at an `Assay`, a `File`, or a `QuestionnaireResponse` —
  explained in the detail panel. This is a footnote on the row, not an edge
  label; the edge still points at `Entity`.
- **A note on `Assay`** explaining what attaches to it, so the false root is
  legible rather than mysterious.

The two alternatives, for when the trigger fires:

2. **Fan out at graph-build time** — one `CLASS_RANGE` edge per `any_of` member,
   tagged so they can be styled as one polymorphic slot. Classification then
   works unchanged, per branch. Changes edge counts, layering, and every count
   in this doc. It also raises a question the diagram cannot currently express:
   **are three alternatives three edges, or one edge with three heads?** Drawing
   three implies the slot points at all of them simultaneously, which is false.
3. **A first-class polymorphic edge type.** Most faithful, most work. Only worth
   it if `any_of` becomes common upstream.

A cheap middle option, if the false root is the only thing that actually
bothers anyone: fan out `any_of` **for reachability only** — enough to keep
classes like `Assay` connected — while continuing to draw the single `Entity`
edge. That splits layout correctness from edge semantics and defers the harder
rendering question.

**If this is picked up:** check whether `range` on an `any_of` slot is reliably
the common ancestor. If it can be absent, the `entity-ranged` safety net
disappears and the slot falls through to `fk-inversion`, which would draw it
backward — wrong. A test for "every `any_of` slot has a class-valued `range`"
would catch it cheaply.

---

## The color system

Three palettes, deliberately of three different **kinds**, so the three
questions they answer cannot be confused for one another. Values live in
`src/config/appConfig.ts`; this section is why they are what they are.

| | palette | entries | what carries it |
|---|---|---|---|
| **P1 — range** | ColorBrewer **Set1**, entity = blue | 4–5 | row dot, row range label, detail-panel badges |
| **P2 — kind** | three **hues** (blue / teal / slate) | 3 | edge stroke, relation popover samples |
| **P3 — siblings** | ColorBrewer **Pastel1** | 6 | slot name, merged-box header |

**P1 answers "what kind of thing is this?"** — entity, enum, data type,
variable. Qualitative and unordered, so Set1, which gives maximum mutual
separation. It is one set of colors for one set of things: the Kitchen Sink
element types and the Explorer's detail-panel badges are the same distinctions
and take the same colors.

**P2 answers "what kind of relation is this?"** — three distinct hues:
`own-fwd` blue `#1d4ed8`, `own-bkwd` teal `#0e7490`, `association` slate
`#64748b`. Association is also **dashed** and **arrowed at both ends**, so it
has two channels beyond color; the dash carries the distinction, not faintness.

**P2 was a Blues ramp and is not any more (2026-09-04).** The original premise
was that `own-fwd` and `own-bkwd` are the same relation seen from two ends, so
they should sit one step apart and read as "different in direction, not in
kind". Measured, that step is **1.50:1**, and on a 1.4px stroke it is not a
difference at all — Siggie could not tell the two apart on the canvas. Widening
the ramp does not rescue it: separating the pair pushes `association` toward
white, and a pale dashed hairline is the least visible thing the diagram can
draw.

The mistake was using a **sequential** palette for a **nominal** variable.
Adjacent steps on a sequential ramp are built to read as *ordered*, which is
the wrong property — these three are categories, not magnitudes. Hue carries
three categories at equal, readable lightness; lightness alone cannot. The
"every edge is an entity relationship" idea that motivated the ramp is real but
was never worth an unreadable distinction, and the arrowhead already says
direction unambiguously.

Strokes are still thicker than the 0.8/0.54 they replaced: a hairline cannot
carry *any* color, whatever the palette.

**P3 answers "which class does this belong to?"** — it separates siblings from
each other and lets the eye track between a slot row and its target box. It does
**not** need separation from P1, because the two never share a position: P3 lands
on slot names and box headers, P1 on row dots and range labels. Pastel1's low
saturation is what keeps it quiet.

**Index 0 of P3 is the default** — parent-declared slots, and every box that is
not an inheritance-merged box. It is a tint of P1's entity color, **not a
neutral gray**: a box header *is* an entity, so its header and its own slot
names carry the entity identity, and sibling colors read as departures from it.
No other neutral is needed anywhere in the system.

Each P3 entry needs **two steps**, because a header band is a filled swatch (its
color must work as a background, with dark text on it) while a slot name is
small text on the box's light background (its color must work as ink). Pastel1
is a background palette; pale ink on white is unreadable, so one value cannot do
both jobs.

### What each channel encodes

Per row in a box:

| channel | encodes | palette |
|---|---|---|
| row dot | the slot's range kind | P1 |
| row range label | the slot's range kind | P1 |
| slot name | which class declares it | P3 |
| box header | the class | P3 (default = the box's own) |
| edge stroke | relation kind | P2, overridden by P3 where colored |

Only **entity** ranges draw edges, so range kind contributes no variation to the
stroke — relation kind is what the stroke has left to say. The few edges whose
endpoint is a merged-box member override that with the P3 color.

### Sibling color assignment — the three-step algorithm

Colors must be stable: unselecting one sibling must not shift every later
sibling's color. So classes are colored from the **whole schema**, not from
what is on canvas.

1. **Color every class stably.** For each parent with subclasses, index its
   children by position among **all** schema siblings sorted by id — not just
   the ones on canvas. The parent takes the default (P3 index 0).
   `buildSiblingColorIndex` → `siblingColor`, built once in `DataService`.
2. **Color slot names by target:** a row wears the color of the class its range
   names (`DataService.getTargetColor`).
3. **A re-colored slot row re-colors the child header it belongs to** — the
   container borrows its contents' color (the `borrowed` map in `mergeSiblings`,
   `OwnershipGraphView.tsx`).

**Step 3 is the load-bearing one**: it is what pairs a container with its
contents, so `MeasurementObservationSet` and the `MeasurementObservation` it
holds wear the same color. It applies only from a child's **own** rows — an
inherited row is shared by every sibling, so letting it re-color one would hand
that sibling a color on the strength of something it does not uniquely have.

> **Sort order decides only WHICH color a class wears, never WHETHER a pair
> matches.** The two families happening to sort alike is a correspondence that
> exists today and is not used by anything. Verified by hand (SG, 2026-09-04) by
> renaming `MeasurementObservationSet` and `SpecimenQualityObservation` so the
> families sort differently: colors moved, pairs held.
>
> The test that proves the pairing is therefore **"a row's color equals its
> target's color"**, swept over the real schema — not anything phrased in terms
> of sort positions. See `src/test/siblingMerge.test.ts`, and `WORKLOG.md`
> (2026-09-04) for the sort-position test that was tried and is wrong twice
> over.

Colors are **per group**, so two classes at index 0 in different groups share a
color by design. That is palette reuse, not a collision, and not the pairing
mechanism.

Slots inherited without a `slot_usage` override merge onto the parent's row and
have no child-specific row to color (`ImagingFile.derived_from` is the case to
check a rule against). Classes whose parent is `Entity` are top-level and form
no merged box.

---

## How edges are drawn

### Terminology

A class and its descendants drawn as one box is a **merged-inheritance box**.
Edge convergence — several edges sharing one arrowhead — also uses the word
"merge" (`mergeTargets`) and is a **different thing**. The distinction holds in
identifiers as well as prose.

### Current state

| | |
|---|---|
| **Labels** | None on the edge layer. A flipped edge is marked by a back-pointing arrowhead (`arrow-own-back`). **Settled 2026-09-02: no persistent edge labels** — one label, on edge hover, in a chip near the cursor, with its point of view chosen by which endpoint the pointer is nearer. Not yet built. Entity hover deliberately does *not* label all of that entity's edges (`Observation` would sprout a dozen chips); it keeps its highlight, and the words stay in the relation bar's popovers. |
| **Source rows** | One edge per declaring class, leaving that class's own row. The port id is keyed on `(anchorClass, slot)` — the same pair `rowY` resolves by. Keyed on slot name alone, every edge in a merged-inheritance box shared one port. |
| **Target rows** | A `slot_usage`-narrowed edge points at the **child header** matching its range, not the box header. Row-targeted edges opt out of `mergeTargets` and draw their own arrowhead; both fan passes skip them. The no-merge shortcut rests on a schema property — no family member has more than one inbound edge — which `src/test/mergedEdges.test.ts` guards, so a failure there means the schema changed, not the code. |
| **Colors** | See the color system above. |
| **Adjacency** | Curved edges are gone; one arrowhead per convergence, thinner strokes. Markers use `markerUnits="userSpaceOnUse"` so they do not scale with `strokeWidth`; one marker serves both ends via `orient="auto-start-reverse"`. |

Still missing on dragging: obstacle-aware routing, and URL persistence. See
`docs/TASKS.md`.

### Cardinality notation

`0..1`, `1..1`, `0..*`, `1..*` — one notation, bounds written out
(`cardinalityLabel`, `containmentGraph.ts`).

These were `0..1` / `1` / `*` / `+` until 2026-09-04: a UML-style range for the
optional-single case and regex-style quantifiers for the rest. Each pair was
self-consistent and the four together were not, which raised the fair question
of why a required single-valued slot showed `1` while a required multivalued
one showed `+` when both are simply required. Writing the bounds out makes
required-ness the left digit in every case and multivalued-ness the right, so
the four labels differ only where the facts do.

### The relation bar

Each box carries a `← N   M →` bar (`RelationBar.tsx`): **N** classes it
belongs to, drawn to its left; **M** it owns, drawn to its right. Hovering
either count opens a list of the relationships on that side. Clicking a row
adds or removes that class.

**A row is written in diagram order** — owner on the left, owned on the right,
the same order the canvas lays boxes out, so a row and the line it describes
read the same way round:

```
Organization                      0..1  ──<  Observation.performed_by
Visit                             0..1  ──<  Observation.associated_visit
Participant                       1..1  ──<  Observation.associated_participant
ObservationSet.observations       1..*  ──>  Observation
```

**Rows follow the box's own slot order**, so scanning from an attribute row to
the same relationship in the popover does not mean re-finding it in a different
order. A relationship declared by another class has no row on this box, so it
sorts last — which is why `observations` is at the bottom.

Three things are encoded independently:

- **Which end is qualified** (`Class.slot` rather than a bare name) says which
  class **declares** the attribute. It is not always this box: row 4 is
  `ObservationSet`'s slot, which is why that class owns this one. On a
  merged-inheritance box the declarer is often a **child** rather than the box's
  title — `MeasurementObservation.performed_by` inside a box titled
  `Observation` — so the end is named by the declarer, never by the title.
- **The arrow** is the edge as the canvas draws it, so its direction says which
  end carries the arrowhead. Both kinds occur on both sides.
- **The colour** of each end is that class's own P3 sibling colour — the same
  one its header and rows wear on the canvas. Row 4 is coloured at *both* ends
  because both are children of merged boxes; rows 1–3 name parent-level classes
  on the left, which have no colour of their own.

The order is what carries "drawn to its left", so the popover does not say it.

An earlier version put an icon reading `this` where the box's own name goes, to
save width. It was removed: the box's name is exactly what a reader matches
against the canvas, and an icon cannot carry the class's colour.

It replaced a cascading five-branch menu, which made you traverse the position
vocabulary to find one class. The bar's split is spatial and needs no
vocabulary; the position table above is now read by the code, not the user.

**No `title` tooltips anywhere in it.** A native tooltip renders above the
popover the same hover opened, covering its first rows — the failure §3.4 of
the old handoff doc recorded for the cascading menu's trigger, reproduced in
the new bar within minutes of it shipping. The popover header carries the text
instead; `aria-label` keeps it available to screen readers.

### Why "N related" can go DOWN as you select more

`countsOf` counts **distinct related classes outside the box**, and a
merged-inheritance box excludes anything folded into itself (`notSelfOrMember`,
`OwnershipGraphView.tsx`). So selecting more can make the number fall: with
`Observation` unchecked it is not a member of the box named after it, so
`ObservationSet`'s relation to it counts as outside (6); check `Observation` and
the count drops to 5.

Correct, but counter-intuitive — and more confusing still across combinations of
several checkboxes. **Not being fixed**; recorded here so the next person to
notice it does not treat it as a bug.

---

## Summary

Counts measured 2026-08-31 by running the live `classifySlotEdgeExplained` rules
over `bdchm.processed.json`, after the upstream sync to `28007df`.

| category | rule | edges | drawn |
|---|---|---|---|
| `own-fwd` | Rule 1 (multivalued) | 30 | forward |
| `own-fwd` | Exception 2a (value object) | 39 | forward |
| `own-fwd` | Exception 2b (cardinality split) | 2 | forward |
| `own-fwd` | `Entity`-ranged | 13 | forward |
| `own-bkwd` | Rule 2 (fk-inversion) | 62 | back |
| `own-bkwd` | `backward-multivalued` (`parent_specimen`) | 1 | back |
| `association` | enumerated | 2 | back, dashed, both ends arrowed |
| **total** | | **149** | |

Two rules, one asserted list of 14 class names, and three small enumerated slot
sets (2 association, 2 cardinality-split, 1 backward-multivalued). Everything
else reads directly from the schema's `multivalued` flag and `range`.

**Any future count should say which denominator it means and how it was
obtained** — earlier drafts used three different ones (153 = every class-ranged
slot in the processed JSON; 141 = what the builder emitted while
`EXCLUDE_HAS_A_TARGETS` still dropped the Entity edges; 151 = the target once
they were drawn), which is why they do not reconcile.

---

## Appendix — implementation notes

Developer reference: a map of the implementation, not a plan for it.

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

Measured 2026-08-31 at `28007df`:

- **6 self-loops** — `File.derived_from`, `ResearchStudy.part_of`,
  `Specimen.parent_specimen`, `SpecimenContainer.parent_container`,
  `TimePoint.index_time_point`, `QuestionnaireItem.part_of`.
- **Zero non-self cycles.** This was the open risk — `Entity` became a live range
  target with 13 inbound edges, exactly the shape that could introduce one. It
  did not.

Two properties worth preserving as tests, neither asserted in
`src/test/containmentGraph.test.ts` today: the self-loop count, and that
`SpecimenStorageActivity.container` as `own-fwd` reintroduces the one non-self
cycle. Both numbers are otherwise re-derived by hand every time someone wonders,
which is how the self-loop count drifted once already.

### What the code does today

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

**Keep `classifySlotEdgeExplained`.** Having the classifier report which rule
fired — and the legend render pairs grouped by rule — is what made the original
incoherence visible. Whatever the rules become, the classifier must explain
itself.

The current sets, all in `containmentGraph.ts`:

| set | members |
|---|---|
| `ASSOCIATION_SLOTS` (2) | `related_document`, `container` |
| `BACKWARD_DESPITE_MULTIVALUED` (1) | `parent_specimen` |
| `CARDINALITY_SPLIT_OWN_FWD` (2) | `creation_activity`, `dimensional_measures` |
| `SINGLE_VALUE_OWNER_TARGETS` (14) | `Quantity`, `TimePoint`, `TimePeriod`, `BodySite`, `CauseOfDeath`, `Substance`, `BiologicProduct`, `Activity`, `QuestionnaireResponseValue` + its 5 typed subclasses |
| `SKIP_SUBCLASS_EXPANSION` (1) | `Entity` — inheritance only, **not** ranges |

**Still keyed by slot name, not `(class, slot)` pair.** All five members of the
two override sets happen to occur at exactly one class each — **luck, not
design.** It is exactly how `performed_by` (11 sites) did damage when it sat in
the old override list. A sync check should assert each still has one site.

These sets are hand-curated and **go stale silently on every schema sync**. See
`docs/TASKS.md`, "hand-curated config rot".

### Where it lives

| file | what |
|---|---|
| `src/models/containmentGraph.ts` | `classifySlotEdge`, `classifySlotEdgeExplained`, `OWNERSHIP_RULE_TEXT`, the override sets |
| `src/models/ownershipSubgraph.ts` | `RelationPosition`, `RELATION_POSITION_LABEL`, `buildOwnershipDag`, `computeSunkLayers` |
| `src/services/DataService.ts` | `getOwnershipPairGroups`, `getConvergenceRanking`, `getDivergenceRanking`, `getContainmentGraph`, `getTargetColor` |
| `src/config/appConfig.ts` | the three palettes (P1 `RANGE_COLORS`, P2 `EDGE_COLORS`, P3 `SIBLING_COLORS`) |
| `src/explore/RelationBar.tsx` | the `← N   M →` bar and its popovers; `POSITION_AXIS` is the side/kind table |
| `src/explore/EdgeSample.tsx` | one edge drawn as the canvas draws it; shared by the legend and the popovers |
| `src/test/relationBar.test.ts` | pins the two axes — both kinds on both sides |
| `src/explore/OwnershipGraphView.tsx` | edge stroke/marker selection, `mergeSiblings`, `countsOf`, `rowY`, `mergeTargets` |
| `src/explore/siblingMerge.ts` | `groupSiblings`, `siblingColor`, `buildSiblingColorIndex` |
| `src/explore/OwnershipLegend.tsx` | renders every slot grouped by rule |
| `src/test/ownershipLegend.test.ts` | asserts the legend cannot drift from the graph's actual edges |
| `src/test/siblingMerge.test.ts`, `src/test/mergedEdges.test.ts` | color stability, merged-box edge targeting |

**Do not start implementation from this appendix or from the code.** Both are the
accumulated result of decisions whose reasoning is in `WORKLOG.md`. Start from
the rules above.

---

## See also

- `WORKLOG.md` — decision history: what was tried, rejected, and why.
- `docs/TASKS.md` — open work; hand-curated config rot.
- `src/explore/help-content.md` — the user-facing wording and the guided tour.
- [EXPLORE_VIZ.md](EXPLORE_VIZ.md) §"Core visual-design conclusions" **item 1** —
  the owner-side/member-side normalization. Cite that item only: audited
  2026-08-24, items 2, 3, 5 and 6 are stale.
