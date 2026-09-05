# Tours, the Help menu, and category content views

**Replaces `TOUR_SOURCE_MATERIAL.md`** (deleted; its drafted prose is inlined
below, at the steps that use it) and `NEXT_SESSION_EDGE_DISPLAY.md` §2.3 (that
file is archived). **Delete this one once the tours ship.**

Decisions here are Siggie's, 2026-09-04, in an interactive session. Where a
decision reversed something already written down, the reversal is noted so the
old text is not restored by someone reading the older doc.

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

## 1. Category content views (the ⊞ button) — ✅ SHIPPED

Each category header in the left panel carries a `⊞` control that draws that
category's content view — its **members plus its pins** — replacing the canvas,
with the browser back button returning to the previous one.

**All of this shipped 2026-09-04.** It is described here only because §3 builds
on it: the category steps of the "What BDCHM covers" tour load these views, and
the Inheritance tour uses the Observations one.

**Where the live detail is now:**

| what | where |
|---|---|
| Which classes each category holds, which it pins, and **why** | [`src/config/entityCategories.ts`](../src/config/entityCategories.ts) — the judgement is recorded beside the data it judges |
| The pin criterion, and the value-type rule it rests on | same file, the `pins` field doc comment; asserted by four guards in [`entityCategories.test.ts`](../src/test/entityCategories.test.ts) |
| Composition (members-then-pins, deduped) | [`src/config/categoryView.ts`](../src/config/categoryView.ts) |
| The `⊞` glyph, and why not `▶` | [`src/explore/SelectionTable.tsx`](../src/explore/SelectionTable.tsx) |
| Replace-not-add, and the back button | [`ExploreApp.tsx`](../src/explore/ExploreApp.tsx) (`showCategoryView`, `pushNextWrite`); mechanics in `WORKLOG.md` |

⚠️ **The pin sets are hand-curated and rot invisibly on an upstream schema
sync** — a wrong pin just draws an extra box, and no test can catch a pin that
is merely unhelpful. Re-read [`entityCategories.ts`](../src/config/entityCategories.ts) after a sync rather than
re-running a query; the criterion is editorial ("does this category make sense
without it"), not mechanical. See
[BACKLOG § hand-curated config rot](BACKLOG.md#hand-curated-config-rot).

⚠️ **The control is on `SelectionTable` only.** The left panel has two modes;
the list is the default and the DAG tree sits behind a switch. The tree has no
category headers at all, so there is nowhere to hang this. If the tree ever
becomes the default, the content views need a different home.

## 2. The Help menu

**Decision:** make Help prominent (roughly as the "take the tour" pill is now)
and **delete the pill**. Two entry points to the same thing drift apart.

```
Help ▾
  Tours →
    What BDCHM covers          (needs a better title)
    Getting oriented
    Reading the diagram
    Ownership
    Inheritance
  Legend
  Example cases
```

- **The other menu items are dropped.** The tours cover them now.
  ⚠️ Before deleting: `node-dismiss`, `toolbar-siblings`, `relation-bar` and
  `graph-canvas-reading` are help-only entries surfaced contextually (ⓘ /
  hover). Confirm they stay reachable in context, or dropping them from the
  menu makes them unreachable rather than merely unlisted.
- **Legend and Example cases are mutually exclusive.** Best framed as *one panel
  slot with two possible contents* rather than "opening one closes the other" —
  no half-open state, no z-order question.
  ⚠️ The shipped `help-menu` help text promises the opposite ("The two open as
  separate panels, so you can keep the legend up while you flip through
  cases"). Rewrite it.
- **Entry point:** with the pill gone, decide whether Help → Tours opens a
  chooser or the first tour. A returning reader who wants "Inheritance" should
  not have to walk "What BDCHM covers".

---

## 3. The five tours

Order is fixed: **complexity rising, each tour using what the last established.**

### 3.1 What BDCHM covers — ⚠️ needs a better title

*Content only. No app mechanics. The tour that does not exist today and matters
most to the target reader.*

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

Category steps: one per category, each loading its ⊞ view, with beats revealing
the story rather than the whole canvas at once. Survey's step gets to say the
thing the numbers show — it is a self-contained subtree that barely touches the
rest of the model.

### 3.2 Getting oriented

*The app, minimally.* Tree → checkbox → canvas → relation bar → copy link.

This is where today's tour steps 2, 3 and 5 collapse into two or three, and
where the duplicate "Entities" title dies (`selection-tree` and `entities` share
it). **The relation bar belongs here**, not in "Reading the diagram": it is how
you *navigate*, not how you *read*.

### 3.3 Reading the diagram

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
ownership content and have moved to §3.4. If two steps is not a tour, merge
these into "Getting oriented" and drop this entry.

### 3.4 Ownership

*Siggie's case for why this tour exists, and it is the strongest in the set:*

> Ownership is what the whole diagram is about. It's not available in the
> generated docs. It can't even be discovered from the schema — we had to come
> up with a bunch of rules to make it clear.

It is also load-bearing: the layered left-to-right layout, the arrowheads and
the relation bar's two sides do not parse without it. Hence **before**
Inheritance, whose merged boxes anchor edges on child rows and child headers —
unreadable until you know what an edge anchor means.

Two drafted steps, moved here from §3.3:

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
> only in ink.

⚠️ Two corrections already applied above, both verified 2026-09-04 — do not
reintroduce them from an older draft:

1. **`contained_in` is declared on `Specimen`, not `SpecimenContainer`.**
   Verified against [`bdchm.yaml`](../public/source_data/HM/bdchm.yaml) and the live classifier. The verdict and the
   point of the case are unaffected; the earlier sentence named the wrong
   declaring class.
2. **Association is slate**, not a faint blue — P2 is three hues, not a Blues
   ramp. Say the **dash and the two arrowheads** carry the distinction, not
   faintness.

The three slots are not all declared on the same class, which is worth saying
out loud rather than glossing — it is exactly the distinction the relation
bar's row glyphs encode.

Remaining material: the "One rule at a time" case group, reframed for a reader
rather than a debugger — why `Quantity` draws forward despite being
single-valued (no independent existence), what an association is and why the
schema has exactly two.

### 3.5 Inheritance

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

## 4. Not in scope, deliberately

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
