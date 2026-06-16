# BDCHM Interactive Documentation: Plans for Further Development

**Target release: 2026-07-30**

---

> Team-facing plan from the **2026-06-11 feedback meeting**. The four decisions we
> need are in **[Decisions needed](#decisions-needed-q1q4)** below — **please reply
> in the [tracking issue](https://github.com/Sigfried/dynamic-model-var-docs/issues/1)**,
> quoting the question number. Implementation detail lives in
> [TASKS.md](../docs/TASKS.md); the containment-graph work earlier rounds led with is
> now **parked** (see below).

---

## The reframing: who is this for?

The biggest shift from the latest feedback is about **audience**. The current app
is good for ontologists, data modelers, and people already fluent in LinkML. But
much of the target audience is **researchers**, and they come in two flavors:

- **Data users** — people working with *already-harmonized* data who, for whatever
  reason, need to understand something about the model. Their question is usually
  *"what's in here?"* or *"what does this field/value mean?"*
- **Study designers / pre-harmonizers** — people designing their own study who need
  to **pre-harmonize it with BDCHM**. Their question is *"where would my variable
  or concept fit in this model?"*

Neither group thinks in terms of slots, enums, or induced slots. The plan below
bends the product toward them without abandoning the modeler audience (who still
want the exact spec).

> **DECISION — defaults target the general user.** We optimize the default
> experience (vocabulary, what's shown vs. hidden on first load) for the
> **general-user researcher**. Modelers are served separately — by the
> [LinkML-generated docs](https://rtiinternational.github.io/NHLBI-BDC-DMC-HM/) and
> the Kitchen Sink view — rather than an in-app vocabulary mode (see Q2). This is
> settled; what remains open is the *specific language* — see Q2.

---

## Decisions needed (Q1–Q4)

The four proposed work items are folded into the questions below. **Please reply in
the [tracking issue](https://github.com/Sigfried/dynamic-model-var-docs/issues/1),
quoting the question number.**

### Responses so far

| Q  | Anne (initial, 2026-06-15) |
|----|----------------------------|
| Q1 | **(c)** keep both — *"for the moment; might change once we get external feedback."* |
| Q2 | **Drop the toggle.** Data modelers are fine with / prefer the LinkML-generated docs, so the dynamic app should serve only the jargon-free user with **one** term set. Picks: **entity · attribute · permissible values · data type** — but thinks some are still too jargony; **more guidance coming.** |
| Q3 | *Pending* — asked for a reminder of the link; it's the [Kitchen Sink cross-panel links](https://sigfried.github.io/dynamic-model-var-docs/?sections=lc%7Cms%7Cre%7Crc%7Crt&view=kitchen-sink). |
| Q4 | **Order confirmed.** |

*Working direction so far: Q4 settled; Q2 leaning single-vocabulary (toggle demoted
to a maybe-later); Q1 and Q3 still open / provisional. Awaiting more reviewers and
Anne's Q2 follow-up.*

### Q1. One interface or two? — and how to compact the Kitchen Sink

The Entity Explorer (progressive disclosure) and Kitchen Sink (everything-at-once,
with connecting links) currently coexist as a header toggle. Nobody in the
2026-06-11 meeting except the author endorsed **merging** them into a single
interface — but that may still be right. **Pick a direction:**

- **(a) Evolve one, retire the other** — one view becomes the single interface and
  folds in the few things the other does well (cross-entity links, multi-class
  compare). The retired one stays only as a legacy/demo toggle.
- **(b) Design an explicit merged view** — a first-class combined interface to
  design and pitch. Higher risk/reward; needs design buy-in not yet given.
- **(c) Keep both, evolve separately** — two views in parallel. Lowest
  re-architecture risk, more maintenance.

**Proposed work either way — compact the Kitchen Sink** (the item this decision most
affects): open it mostly empty and fill in on selection. Left panel **reuses the
Explorer's category grouping** (already in `src/config/entityCategories.ts` —
reuse, not new taxonomy); the other two panels **start empty**; **allow selecting
multiple classes**. The terminology toggle, subset viz, and help mode (below) apply
regardless of how Q1 resolves.

### Q2. What language / terminology should we use?

Defaults target the general-user researcher (settled — see
[The reframing](#the-reframing-who-is-this-for)), so the question is **which words**.

**Working direction (per Anne's initial response):** ship a **single jargon-free
vocabulary** in the dynamic app — **no in-app toggle**. Data modelers who want exact
LinkML terms use the [LinkML-generated docs](https://rtiinternational.github.io/NHLBI-BDC-DMC-HM/)
instead, so we don't maintain multiple term sets. *(The configurable
multi-vocabulary toggle is kept as a [low-priority maybe-later](#parked-revisit-later--not-this-round)
in case external feedback wants it.)*

So the remaining question is **just the one term set.** Candidate (Anne's leading
picks in **bold**, alternatives noted):

| Concept (LinkML) | Leading candidate          | Alternatives considered          |
|------------------|----------------------------|----------------------------------|
| `class`          | **entity**                 | table                            |
| `slot`           | **attribute**              | property · field · column        |
| `enum`           | **permissible values**     | value set · controlled vocabulary |
| `range`          | **data type**              | property type                    |

⚠️ Anne flagged some of these as **still too jargony** and will **send more
guidance** — treat the bold picks as provisional pending that. Add rows for any
concept we've missed.

### Q3. Are the connecting links worth their screen real estate?

Links look sophisticated and convey structure at a glance, but in the
progressive-disclosure design, inline entity-summary cards and "Referenced by"
lists already cover much of the relationship-viewing need more compactly. Should
links become an **optional overlay / separate "Relationships" tab** rather than
always-on? (Slot reuse/override and enum hierarchy are the cases links still
arguably earn their keep — mainly for modelers.)

### Q4. Confirm (or reorder) the four priorities

Confirm this order, or propose a different one:

1. **Plain-language terminology** — a single jargon-free term set (Q2; the
   configurable toggle is demoted to maybe-later). *Serves data users + study
   designers; modelers use the LinkML docs.*
2. **Compact Kitchen Sink** — progressive disclosure + multi-class select (Q1).
   *Serves all audiences; the modeler-favored view, made less overwhelming.*
3. **Subset visualization** — a node-link diagram (or tree) for a **user-picked
   subset** of entities, not the whole model. *Reality check:* there is **no
   node-link diagram in the app today** — only the SVG panel-connector overlay
   (`LinkOverlay.tsx`); real diagrams exist only as standalone mockups
   (`public/has-a-mockup.html` Cytoscape+dagre, `public/containment-tree-mockup.html`).
   So this is "promote a mockup into the app, scoped to a subset." Converges with the
   "pin entities → focused diagram" idea; could match the LinkML per-class Mermaid
   conventions (is-a vs has-a). *Serves study designers most.*
4. **Help mode** — port the DOM-driven contextual help from `../icd11-playground/web`
   (`data-help-id` + markdown content + "?"-toggled popover; self-contained:
   `useHelpMode.ts`, `HelpPopover.tsx`, `parseHelpContent.ts`, `help-content.md`).
   *Serves all audiences; valuable while terminology is in flux.*

### Parked open question: is-a vs has-a inversion

*(Not numbered — parked with the containment work, flagged for whenever it's
revived.)* For any "what contains what" view we have to invert the model's
foreign-key references (child→parent becomes parent contains children). The
heuristic (flip single-valued entity-ranged slots; leave multivalued / value-object
targets; small override list) needs a model designer's eye.

---

## Parked (revisit later — not this round)

- **Containment graph / has-a hierarchy.** The Cytoscape whole-model graph
  (`has-a-mockup.html`) and indented containment tree (`containment-tree-mockup.html`)
  and their extract scripts. We are **not** pursuing this in the current round. The
  subset-visualization item (priority #3) borrows the "pick entities → focused
  diagram" *idea* from this work but does not commit to the full containment
  treatment or the FK-inversion heuristic (see the parked is-a/has-a question above).
  Revisit after the subset viz and audience questions settle.
- **Configurable multi-vocabulary toggle (maybe-later).** Q2's working direction is a
  single jargon-free term set, *not* a toggle (per Anne: modelers can use the
  LinkML-generated docs). The earlier idea of a user-switchable toggle
  (general / data-modeler / LinkML modes, with LinkML terms in tooltips) is kept here
  in case external feedback wants in-app term-switching. Was TASKS subtask 8.

---

## Carried-over context (still true, still relevant)

- **Variable Library is coming.** Deep variable drilldowns inside the Explorer will
  be largely obsoleted by it — don't over-invest there.
- **Enum detail cards** should show CURIE *labels and definitions*, not just
  identifiers.
- **`ResearchStudyCollection` is the real top-level container** of the model, which
  the inheritance view doesn't make visible — relevant whenever containment is
  revived.
- **Known data bug:** `ObservationSet.observations` should point to `Observation`
  but doesn't; from `Observation` there's no way to see its connection to
  `ObservationSet`. This bug helped motivate the redesign.

---

## Features still worth borrowing from the ICD-11 Foundation Explorer

Beyond help mode (Q4, item 4): resizable panel layout, cross-panel interactions
(highlighting), light/dark mode.
