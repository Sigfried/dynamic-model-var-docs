# The five tours

The plan for the five tours. Drafted prose is inlined at the steps that use it.
Decisions here are Siggie's, 2026-09-04. The content they get written into is
[`src/explore/help-content.md`](../src/explore/help-content.md); the authoring
format is [`src/help/FORMAT.md`](../src/help/FORMAT.md).

**Delete this file once the tours ship.**

---

## The problem this fixes

Every tour step and every example case in the app today is about **app
features** — what a checkbox does, where an edge anchors, how a merged box is
built. Most visitors do need that. But the target users are **researchers**, and
what they want first is *what the model contains*, not how the diagram is
constructed.

The evidence is in the example-cases pane itself: four of its six groups are
named after rendering behaviour ("The bare diagonal", "Pathological
convergences", "Flipped divergences", "Normal cases (a fix must not break
these)"). Those are debugging cases. Nothing in the app answers "where do
specimens live in this model, and what hangs off them."

The six entity categories already group the schema into content areas. They are
the skeleton for the fix.

---

## The five tours

Order is fixed: **complexity rising, each tour using what the last established.**

Today's content defines **three**: `The BioData Catalyst Harmonized Model`
(4 steps), `Getting oriented` (1 step) and `Walkthrough` (5 steps), whose own
description says *"The original tour. Parts will be used for specific tours
now."* So the middle tours come largely out of **splitting `Walkthrough`**,
not writing from nothing.

The category ⊞ views the steps below load shipped 2026-09-04. ⚠️ Their pin sets
are hand-curated and rot invisibly on an upstream schema sync — re-read
[`entityCategories.ts`](../src/config/entityCategories.ts) after a sync rather
than re-running a query; the criterion is editorial, not mechanical. See
[BACKLOG § hand-curated config rot](BACKLOG.md#hand-curated-config-rot).

### 1. The BioData Catalyst Harmonized Model

Prose lives in the content file now, not here. What remains is the SHAPE:

| # | entry | state |
|---|---|---|
| 1 | `bdchm` | done — context, sources, contents |
| 2 | `app-model-mods` | done — promises a walk through each category |
| 3 | `admin-study` | done 2026-09-08, 10 beats |
| 4 | `clinical-records` | done 2026-09-08, 8 beats |
| 5 | `observation-measurement` | done 2026-09-08, 6 beats |
| 6 | `lab-biospecimen` | done 2026-09-08, 8 beats |
| 7 | `survey-questionnaire` | done 2026-09-08, 7 beats |
| 8 | `other-files` | done 2026-09-08, 6 beats |
| 9 | `why` | written, but its placement is unsettled ([TASKS 3b](TASKS.md)) |

**The recipe the six category steps are built on**, should a seventh category
ever want one: `Only: cat=<id>` and an `Action:` saying it drew the category;
then a beat per class, a `#####` subtitle with the class name and
`{{model-description:X}}` beneath it, anchored `node-box:<Class>`. Frame with a
sentence of your own where the schema's description does not stand alone, and
close with a beat saying what the category is FOR rather than what is in it.

⚠️ **Order the beats by the DRAWN layout, left to right, not by `classIds`.**
The canvas is layered by ownership, so config order jumps around the screen.
Get the order by probing the containment graph — **not by reading the YAML**,
which misses the top-level `slots` (`associated_participant`,
`associated_visit`, `associated_person`) that carry most of the structure.

⚠️ **A class whose description is identical to its parent's cannot get a beat
of its own.** Five of the observation classes and three of the observation-set
classes share their parent's text verbatim, so `{{model-description:X}}` per
subclass would print the same paragraph repeatedly. Those steps name the
subclasses in one framing beat instead. Merged sibling boxes push the same way:
`node-box:<Subclass>` resolves to the box its rows were merged INTO, so a beat
per merged sibling rings the same box each time.

⚠️ **Do not copy a count out of
[`entityCategories.ts`](../src/config/entityCategories.ts)'s comments** — its
Quantity and Survey figures are both stale, in opposite directions. Probe, or
say it without a number.

Category members and pins are in
[`entityCategories.ts`](../src/config/entityCategories.ts). `cat=<id>` draws
members **plus pins**, so a pinned outside class is on the canvas and can be
anchored — `clinical`, `observation`, `lab` and `other` all pin `Participant`.

Both silent-degradation traps a category step can fall into are now caught by
`helpContent.test.ts`: a typo'd anchor argument, and a real class anchored on a
canvas its own `cat=` does not draw.


### 2. Getting oriented

*The app, minimally.* 
- Entity select panel
- Entity selection with checkbox
- Canvas
- Add entities from attribute rows
- Click entity for detail panel [weirdly you can click
  anywhere except an entity attribute row for this. need
  to make this make more sense]
- Related bar
  - Brief explanation and reference to Ownership tour
  - Add entities from bar
- Can drag boxes around but edges get messed up (for now)
- Zoom and pan

This is where today's tour steps 2, 3 and 5 collapse into two or three, and
where the duplicate "Entities" title dies (`selection-tree` and `entities` share
it). **The relation bar belongs here**, not in "Reading the diagram": it is how
you *navigate*, not how you *read*.

[sg] not sure about all that. you wrote it; i'm not sure what's in steps 2,3,5.
     you also had the spine stuff as part of tour 1, but i think it belongs
     here.

Two halves. **The spine first**, grown one hop at a time — never more than five
boxes on screen — then **a step per category**, using the ⊞ views, with beats
for progressive reveal.

Siggie named the spine: `Person → Participant → Visit → Observation →
Quantity`. It is the path from "a person in a study" to "a number you would
analyse", and four of six categories hang off it.

The class descriptions in the schema are good enough to build on with light
editing — checked, not assumed (`Person`, `Participant`, `Visit`,
`Observation`, `Quantity`, `Specimen`, `Organization` all have real ones). In
particular Person vs. Participant is self-explaining:

> **Person** — "Administrative information about an individual or animal
> receiving care or other health-related services."
> **Participant** — "A Participant is the entity of interest in a research
> study… Human research subjects are usually not traceable to a particular
> person to protect the subject's privacy."

That distinction — one human being, potentially several study participants — is
the first genuinely modelling-flavoured idea a researcher meets, and it is worth
a step of its own.

Spine steps: `Person, Participant` → `+ Visit` → `+ Observation` (the merged box
appears; note there are five kinds) → `+ Quantity` (a value and a unit; sixteen
classes point at it).

### 3. Reading the diagram

*Rows, dots, and row anchoring.* Two steps, both drafted:

**Rows and the dot convention.** Selection: `Organization`.

> A single class. Rows are its attributes: name, then range and cardinality on
> the right. The dot and the range label share a color that says what KIND of
> thing the attribute points at — blue for an entity, purple for a permissible
> value set, green for a data type. A filled dot draws an edge; a hollow one
> does not, because nothing it could point at is on the canvas.

Covers P1 (the range palette) and filled-vs-hollow, which is the one a reader
cannot guess. (Organization is an Admin class now, which makes it a better
example, not a worse one.)

**One edge, row-anchored.** Selection: `Visit`, `TimePeriod`.

> Visit owns TimePeriod. The edge leaves the `year_range` ROW, not the box, and
> the arrowhead lands on the owned class. This anchoring is the whole idea: an
> edge tells you WHICH attribute made it.

Row anchoring is the most load-bearing idea in the diagram and the cheapest to
show — one edge, two boxes, nothing else on canvas.

⚠️ **This tour may be too thin to stand alone.** Its other two drafted steps are
ownership content and have moved to §4. If two steps is not a tour, merge
these into "Getting oriented" and drop this entry.

### 4. Ownership

*Siggie's case for why this tour exists, and it is the strongest in the set:*

> Ownership is what the whole diagram is about. It's not available in the
> generated docs. It can't even be discovered from the schema — we had to come
> up with a bunch of rules to make it clear.

It is also load-bearing: the layered left-to-right layout, the arrowheads and
the relation bar's two sides do not parse without it. Hence **before**
Inheritance, whose merged boxes anchor edges on child rows and child headers —
unreadable until you know what an edge anchor means.

Two drafted steps, moved here from §3:

**Owns vs. belongs-to.** Selection: `Specimen`, `Participant`,
`SpecimenCreationActivity`.

> Opposite directions. Specimen OWNS its creation activity (forward). Specimen
> BELONGS TO a Participant — declared as `source_participant` on Specimen, but
> drawn Participant → Specimen, because a single-valued pointer at an entity is
> a foreign key. `parent_specimen` is also here as a self-loop.

Covers own-fwd / own-bkwd *and* storage-direction normalization — the thing most
likely to look like a bug to someone who has read the schema. Throws in a
self-loop for free.

**All three edge types at once.** Selection: `SpecimenContainer`, `Specimen`,
`Substance`, `SpecimenStorageActivity`.

> THE DECISION CASE. `SpecimenContainer.additive` → Substance is own-fwd;
> `Specimen.contained_in` → SpecimenContainer is own-bkwd; `container` →
> SpecimenStorageActivity is an association (dashed, arrowed BOTH ends).
> Compare own-bkwd against association here — they layer identically and differ
> only in ink: association is **slate, dashed, and arrowed at both ends**.

Two things to get right when writing this step, both verified against
[`bdchm.yaml`](../public/source_data/HM/bdchm.yaml) and the live classifier:

- **`contained_in` is declared on `Specimen`**, not on `SpecimenContainer`.
- **The three slots are not all declared on the same class**, which is worth
  saying out loud rather than glossing — it is exactly the distinction the
  relation bar's row glyphs encode.

Remaining material: the "One rule at a time" case group, reframed for a reader
rather than a debugger — why `Quantity` draws forward despite being
single-valued (no independent existence), what an association is and why the
schema has exactly two.

### 5. Inheritance

*Last, because it is the most complicated part of the diagram (Siggie) and
because it depends on ownership's edge-anchor vocabulary.*

Material, largely unharvested and good as written, from the "Inheritance (the ⑃
siblings toggle)" case group:

- **One child, merged with its parent** (`MeasurementObservation` alone) — it
  still merges; merging does not wait for a second sibling, because a class must
  not change shape because of what else you happen to select.
- **Children that add nothing** (`SpecimenQuality-` / `SpecimenQuantity-
  Observation`) — "this subclass adds nothing" is the answer to what they are.
- **`slot_usage` — same name, different type** (the five
  `QuestionnaireResponseValue` children) — the narrowing is the entire reason
  the classes exist.
- **The full Observation family** — one box where there would be six.
- **A narrowed edge pointing at a child header** —
  `MeasurementObservationSet.observations` → the `MeasurementObservation`
  header. Shipped 2026-09-02.

**Load the Observations ⊞ view for this tour.** It is the best
merged-inheritance picture in the app and it shows the narrowed child-header
edge for free, so both of the ideas above are on screen without building a
selection by hand.

---

## Not in scope, deliberately

**Enums and entity details.** There is material in previous views (enum
contents, per-entity detail) that researchers would want and that the Explorer
does not yet carry. Siggie: get a good, working tour first. Design so an
"entity details" step drops in later without restructuring — do not claim
completeness in the diagram tours.

**Per-user attribute display preference.** `ROW_BUDGET` is `Infinity` as of
2026-09-04, so every box shows every attribute and the `+ N more` / `− fewer`
footer never renders. The budget machinery is intact for the intended end state:
a preference like "Default to show top [6] attributes" that puts the footer
back. See [`OwnershipGraphView.tsx`](../src/explore/OwnershipGraphView.tsx) and [`rowBudget.test.ts`](../src/test/rowBudget.test.ts).
