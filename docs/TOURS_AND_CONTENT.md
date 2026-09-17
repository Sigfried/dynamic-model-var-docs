# Tour content: what is left to decide

All five tours are written into
[`src/explore/help-content.md`](../src/explore/help-content.md) and pass the
content tests. This file is what did NOT get settled by writing them, plus the
recipe for building a category step.

**Delete it when `help-finish-authoring/oriented` lands** — at that point
everything here is either decided or in the content file.

The authoring format is [`src/help/FORMAT.md`](../src/help/FORMAT.md); the
order of work is [TASKS.md §Now](TASKS.md).

---

## Getting oriented — the one tour still unsettled

12 steps where the plan wanted 8, four entries at the front introducing the
same thing, and four un-integrated `> Salvaged…` notes. The proposal to prune
it is [GETTING_ORIENTED_PROPOSAL.md](GETTING_ORIENTED_PROPOSAL.md) and its three
`[DECIDE]` questions are Siggie's to answer. What follows is the material that
proposal is pruning TOWARD, kept because it is not in the content file.

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

**The relation bar belongs here**, not in "Reading the diagram": it is how you
*navigate*, not how you *read*.

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
appears; note there are five kinds) → `+ Quantity` (a value and a unit, held
right across the model).

---

## The recipe for a category step

Should a seventh category ever want one. The six that exist were built this
way.

`Only: cat=<id>` and an `Action:` saying it drew the category; then a beat per
class, a `#####` subtitle with the class name and `{{model-description:X}}`
beneath it, anchored `node-box:<Class>`. Frame with a sentence of your own
where the schema's description does not stand alone, and close with a beat
saying what the category is FOR rather than what is in it.

`cat=<id>` draws members **plus pins**, so a pinned outside class is on the
canvas and can be anchored — `clinical`, `observation`, `lab` and `other` all
pin `Participant`. Members and pins are in
[`entityCategories.ts`](../src/config/entityCategories.ts).

⚠️ **`Only:` already clears the canvas.** It REPLACES the selection, so
`Only: cat=survey` is a clean category view with nothing carried over. Adding
`panels=0` closes the legend, cases and detail drawer as well; the two compose
(`Only: cat=survey&panels=0`). A step whose `Only:` names no selection at all
inherits the previous step's canvas, which is a silent way to anchor at
nothing — 2026-09-16, `survey-questionnaire`.

⚠️ **A beat's `Change:`/`Only:` moves the canvas too.** Anchors are checked
per position, so a beat that adds a class can anchor at it, and a beat that
does not inherits what the beat before it left.

⚠️ **Order the beats by the DRAWN layout, left to right, not by `classIds`.**
The canvas is layered by ownership, so config order jumps around the screen.
Get the order by probing the containment graph — **not by reading the YAML**,
which misses the top-level `slots` (`associated_participant`,
`associated_visit`, `associated_person`) that carry most of the structure.

⚠️ **A class whose description is identical to its parent's cannot get a beat
of its own.** Five of the observation classes and three of the observation-set
classes share their parent's text verbatim, so `{{model-description:X}}` per
subclass would print the same paragraph repeatedly. Those steps name the
subclasses in one framing beat instead.

⚠️ **A merged subclass has no `node-box`.** `node-box:<Subclass>` resolves to
the box its rows were merged INTO, so anchor `child-header:<Subclass>` to ring
the subclass itself. `node-box:SdohObservation` was drawing no ring at all
until 2026-09-16.

⚠️ **Do not copy a count out of a source comment or an older doc.** Several
were stale in both directions. Probe, or say it without a number.

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
