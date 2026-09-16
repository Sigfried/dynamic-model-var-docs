# Getting oriented — proposed step list

Working document, written 2026-09-15. **Delete when the tour is rewritten.**
The decisions it produces go into
[help-content.md](../src/explore/help-content.md); the reasoning goes into
WORKLOG.

> ## ⚠️ Siggie — start here
>
> **2026-09-16.** You began reading this, ran out of time, and went on a
> detour. **Nothing here has been actioned**: the tour still has all 12 steps
> and all four `> Salvaged…` notes.
>
> **What you were going to annotate:** this file — marking each row of the
> verdict table below **keep / cut / disagree**. The three places where the
> verdict is genuinely yours to give, not mine, are marked
> **[DECIDE #1 / #2 / #3]**. #2 is the one with real consequences (a tour
> disappears from the chooser); #1 and #3 are small.
>
> Once those three are answered the rest is mechanical and a session can do it
> without you.
>
> Two details drifted since this was written and are corrected in place:
> `bdchm-entities` is now titled *Using the BDCHM Explorer*, and its
> `[put some intro text here]` placeholder is filled.

---

## What is wrong with it now

Not the writing — the spine is good. The problem is that **four entries at the
front all introduce the same thing**, because three of them were salvaged out
of a stash on 2026-09-09 and never integrated. Each still carries its own
`> Salvaged…` note saying so. A viewer walking the tour is told "the left panel
lists the entities" four times, in four voices, and ticks a checkbox twice.

| # | id | Title | Verdict |
|---|---|---|---|
| 1 | `linkml-context` | BDCHM Explorer | **CUT** — repeats `why` (last step of tour 1) almost verbatim, plus a LinkML paragraph and a `contents` beat that repeats itself. Its own comment says so. |
| 2 | `bdchm-entities` | Using the BDCHM Explorer | **KEEP as opener** — its two beats (panel → tick → box) are the real opening. Retitled, and its placeholder intro filled, 2026-09-16. |
| 3 | `selection-tree` | Entities | **CUT, merge up** — same three moves as #2, on Participant instead of Person. |
| 4 | `selection-tree-mechanics` | Choosing what to look at | **CUT the step, KEEP the entry** — it describes the panel's *tree* mode, where `entity-row:` anchors do not resolve. It is a good help-only entry and a broken tour step. |
| 5 | `entity-box` | What a box shows | KEEP — rows, a blue row, the relation bar. |
| 6 | `grow-participant` | Adding a related entity | KEEP |
| 7 | `grow-visit` | A visit | KEEP |
| 8 | `grow-observation` | An observation | KEEP |
| 9 | `grow-quantity` | From a person to a number | KEEP |
| 10 | `detail-panel` | Details | KEEP |
| 11 | `moving-around` | Moving around | KEEP |
| 12 | `where-next` | Where to go from here | KEEP |

**12 steps → 8.** Nothing in 1, 3 or 4 is lost: #1's argument already exists as
`why`, #3's content is #2's, and #4 becomes a help-only entry (reachable from
the Help menu, which is the only route into one).

### Two smaller things — **[DECIDE #1]**

- **#2 opens on Person, #3 opens on Participant.** Pick one. Person is right:
  the whole tour is the Person → Participant → Visit → Observation → Quantity
  spine, so starting anywhere else means a restart at #6.
- **`why-overlap` (TASKS) is the same question as #1.** Cutting
  `linkml-context` settles it: `why` keeps the "you may want to use BDCHM to…"
  argument at the end of tour 1, and Getting oriented opens on mechanics. The
  LinkML/pipeline paragraph is the only orphan — see "Open question" below.

---

## Proposed spine

Eight steps, one idea each, each one a visible change to the canvas.

| # | Step | Canvas | The one idea |
|---|---|---|---|
| 1 | **The panel** | empty | Every entity is listed here, in six categories. Tick one to draw it. *(ticks Person)* |
| 2 | **What a box shows** | Person | A row per attribute; name, type, how many. |
| 3 | **Rows that name entities** | Person | Blue rows hold another entity. Hollow dot = not drawn yet. Click to draw. |
| 4 | **The relation bar** | Person | `← N` / `M →`: what owns this, what it owns. The way to reach an entity that has no row here. |
| 5 | **Growing the diagram** | + Participant | A line leaves the ROW that made it. Owners left, owned right. |
| 6 | **Three more hops** | + Visit, Observation, Quantity | Person → … → Quantity is the path from a human being to a number. *(one step, three beats)* |
| 7 | **Details, and moving around** | detail panel, then pan/zoom | Click a box for everything about it; drag, zoom, fit. |
| 8 | **Where to go from here** | — | Category ⊞, copy link, the other three tours. |

Changes from the current spine, beyond the cuts:

- **3 and 4 are promoted out of `entity-box`'s beats into their own steps.**
  They are the two things a viewer must have to use the app at all, and they
  are currently beats 2 and 3 of a step whose headline is "a box has rows".
- **6 collapses `grow-visit` + `grow-observation` + `grow-quantity` into one
  step with three beats.** Each is a single hop with a sentence of model
  content; three popovers that each say "and now the next one" is the tour's
  slowest stretch. As beats the canvas still grows a box at a time.
- **7 merges `detail-panel` and `moving-around`.** Both are "other things the
  mouse does", neither needs a step to itself.

That is 8 steps where the reader currently walks 12, with no content dropped
except the duplication.

---

## Should *Reading the diagram* be folded in? — **[DECIDE #2]**

**Partly — and it is already happening by accident.** Of its four steps, the
first two are things Getting oriented already teaches:

| Reading the diagram | Already in Getting oriented? |
|---|---|
| `rows-and-dots` — green/purple/blue, hollow dot, cardinality | **Mostly yes.** `entity-box` beat 1 teaches the row and the cardinality; beat 2 teaches the blue row and the hollow dot. What is NOT there is the three-colour system stated as a system, and the worked green/purple examples. |
| `one-edge` — a line leaves the row that made it | **Yes, twice.** `grow-participant` beat 1 says it in the same words ("every line on the canvas leaves an attribute row"). |
| `which-way` — which side the target lands on, and why | **No** — and this is the step that matters. It is the hand-off to *Ownership*. |
| `loops` — `part_of` and the loop mark | **No.** Small, self-contained. |

**Recommendation: fold `rows-and-dots` and `one-edge` into Getting oriented,
and keep `which-way` + `loops` as the opening of Ownership** — where
`which-way` already points ("How the Explorer decides which is which is the
*Ownership* tour"). That removes a whole tour from the chooser without losing a
sentence, and it removes the current awkwardness where tour 2 ends by promising
tour 3 will explain the dots, and tour 3 opens by re-teaching the box.

Concretely: proposed step 3 above ("Rows that name entities") absorbs
`rows-and-dots` — one step, four beats, one per colour plus cardinality — and
proposed step 5 absorbs `one-edge`.

**The cost, and why I think it is worth paying:** Getting oriented goes from 8
steps to ~9 and becomes the one tour a new viewer must take, while "Reading the
diagram" stops existing as a name in the chooser. If you would rather keep four
tour names for the demo, the alternative is to leave the two tours as they are
and just **cut the duplicated sentences from Getting oriented**, pointing
forward instead. That is a much smaller edit and I can do it either way — it is
a question about the chooser, not about the content.

---

## Ownership — is it out of sync? · **ANSWERED: no**

**No. Checked against the live classifier, the legend and
`OWNERSHIP_RULES` today.** The tour was rewritten for the one-rule-two-exception
scheme on 2026-09-13 and it matches:

- one default (`owns-target-forward-by-default`), two exceptions
  (`…by-entity`, `…by-attribute`), induced deliberately absent — matches
  `ownershipRules.ts` exactly, including the rule labels, which the tour quotes
  from `OWNERSHIP_RULES[].label`.
- `the-legend` step opens the legend and describes the new pivot behaviour
  ("Each entry shows how many attributes it decided, and opening one lists
  them").

Two things WERE stale and **shipped 2026-09-15** (commit `fb9811e`):

1. **The counts were hand-copied** (89 / 55 / 5, plus "Five entities", "21
   attributes", and two bare "five"s in the recap). All now resolve live
   through `{{ownership-count:…}}`, except "21 attributes pointing at
   Participant", which has no resolver key and is now simply not a number.
   The maintainer comment warning that they go stale went with them.
2. **The *referred to* wording.** [LEGEND_ORIENTATION
   §Consequences](LEGEND_ORIENTATION.md) settled that it names an ARRIVAL, not
   a kind of entity. The step was titled "Exception: entities that are referred
   to" and `OWNERSHIP_RULES[].text` opened "Referred-to entities are…". Both
   now say **only ever referred to**, and the by-attribute step's beat states
   the QuestionnaireItem case explicitly (one attribute owns it, three refer to
   it) instead of gesturing at it.

What is left in the Ownership tour is the part TASKS calls
`help-finish-authoring/ownership`: whether `why-ownership` and `edge-types`
read well, which is for the browser.

---

## Inheritance — the first step · **SHIPPED**

Commit `fb9811e`, 2026-09-15. Nothing to decide; recorded because the reason is
worth keeping.

`one-child` used to open with the canvas already drawn and the popover
explaining a surprise that had already happened — *"You asked for
MeasurementObservation and the box is titled Observation"* — when the viewer
had asked for nothing and pressed Next. It read as the tour correcting a
mistake the viewer did not make.

It now opens on the panel (`Only: panels=0`, anchored
`entity-row:MeasurementObservation`, *"watch what the box it draws is called"*)
and a first beat carries `Change: sel=MeasurementObservation` and anchors
`node-box:Observation`. That is TASKS `show-the-change`'s sequence — anchor the
unticked row, tick it, anchor what appeared — and the shape `bdchm-entities`
already uses. Added as a step-plus-beat rather than three beats so the three
existing beats stayed intact; they renumbered 2–4.

⚠️ `entity-row:` and `entity-checkbox:` **resolve in the panel's list mode
only** (FORMAT.md §Anchors). List is the default, so this works — but driven
from tree mode the opening beat shows an unringed popover.

---

## Open question for you — **[DECIDE #3]**

**The LinkML / ingestion-pipeline paragraph** (currently buried in
`linkml-context`, the step I want to cut) is the only orphan. It is the
sentence that says BDCHM is a LinkML schema, that the raw YAML is 4,000 lines,
and that studies are harmonized into it by `dm-bip`. Three options:

1. **Into tour 1's `why`** — the argument step already there. Keeps it in the
   model tour, where context belongs, at the cost of making a short step long.
2. **Its own help-only entry** ("What BDCHM is built with"), reachable from the
   Help menu, linked from `why`. Keeps both tours moving.
3. **Cut it.** The audience decision (researchers, 2026-09-11) says they need
   the detail *available*, not necessarily in the tour path.

I lean (2). It is the only one that keeps the text without slowing either tour,
and the Help menu is where a researcher who wants the weeds will look.
