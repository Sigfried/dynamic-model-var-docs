# BDCHM Interactive Documentation: Plans for Further Development

**Target release: 2026-07-30**

---

## ⏱️ What we need from you (please respond in the tracking issue)

Four decisions. **Reply in the GitHub issue** — quote the question number (Q1…Q4)
so answers stay sortable. You don't need to read the whole plan to answer; the
context for each is linked. The rest of this doc is reference.

- **Q1 — One interface or two?** Today the **Entity Explorer** (progressive
  disclosure) and the **Kitchen Sink** (everything-at-once + connecting links)
  coexist as a toggle. Pick a direction: **(a)** evolve one, retire the other;
  **(b)** design an explicit *merged* view; **(c)** keep both, evolve separately.
  *(See Q1 below.)*
- **Q2 — Which audience do we optimize the defaults for?** Data users
  ("what's in here / what does this mean?"), study designers pre-harmonizing
  ("where would my variable fit?"), modelers — or "plan for both, defer." This
  sets the default vocabulary mode and what's shown vs. hidden on first load.
  *(See Q2 + the term-set table in priority #1 below.)*
- **Q3 — Are the connecting links worth their screen space?** Keep them
  always-on, make them an **optional overlay / "Relationships" tab**, or drop
  them in favor of the inline "Referenced by" lists? *(See Q3 below.)*
- **Q4 — Confirm the priority order** of the four proposed work items
  (1 terminology toggle · 2 compact Kitchen Sink · 3 subset visualization ·
  4 help mode), or reorder them. *(See Q4 below.)*

> We're **assuming a vocabulary toggle** (2–3 modes), so the terminology question
> is *which terms*, not *how far to push*. The candidate term sets are in
> **priority #1** below — react to / edit that table.

*(One lower-stakes item if you have an opinion: whether help mode should become a
shared cross-project package.)*

---

> This is the team-facing planning doc. It captures the direction coming out of
> the **2026-06-11 feedback meeting**, the open questions we want the
> design/management team and stakeholders to weigh in on, and how the existing
> backlog re-sorts against the new priorities. Implementation-level detail lives
> in [TASKS.md](../docs/TASKS.md).
>
> *(Previous rounds of this doc are in git history. The containment-graph work
> that earlier rounds led with is now **parked** — see "Parked" below.)*

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

> **OPEN QUESTION — primary audience.** Which of these audiences do we optimize
> *defaults* for? This affects terminology defaults, what's shown vs. hidden on
> first load, and how much we invest in the study-designer "where does my thing
> fit?" flow vs. the data-user "what does this mean?" flow. **This is a question
> for stakeholders — we are not deciding it here.** Personas above are offered as
> a vocabulary for that discussion.

---

## What we're proposing to build (this round)

Ordered roughly by how directly each item serves the reframed audience.

### 1. Simplify the jargon — configurable terminology

**We are assuming a vocabulary toggle** (2 or 3 modes the user can switch between).
So the question is *not* "how far do we push plain language" — it's **what should
the term sets actually be?** We want the team to react to and fill in the table
below. (This is the long-standing TASKS subtask 8.)

Proposed modes (final count TBD — 2 or 3):

- **General user** — everyday words for researchers.
- *(optional)* **Data modeler** — relational/database vocabulary (table/field/column).
- **LinkML / spec** — the exact LinkML terms; the escape hatch for modelers.

Candidate term mappings — **please confirm, edit, or add a column:**

| Concept (LinkML)      | General-user candidate              | Data-modeler candidate | Notes / alternatives |
|-----------------------|-------------------------------------|------------------------|----------------------|
| `class`               | **entity**                          | **table**              | which leads?          |
| `slot`                | **property**                        | **field** / **column** | "attribute"?          |
| `enum`                | **value set** / **permissible values** | (same as general)   | "controlled vocabulary"? |
| `range`               | **property type**                   | **data type**          |                       |
| *(add rows as needed)*|                                     |                        |                       |

> **PROMPTS for the team:**
> - Do we want **2 modes** (general / LinkML) or **3** (add data-modeler)?
> - For each row, which candidate do you prefer — or propose a better term?
> - Is the **data-modeler / relational** vocabulary (table/field/column) worth a
>   distinct mode, or does it just confuse things?

LinkML equivalents would also be surfaced via tooltips + links to LinkML docs for
the curious, regardless of mode.

*Serves:* data users and study designers primarily; modelers via the toggle.

### 2. Update the Kitchen Sink view — compact + progressive disclosure

Rather than showing everything at once, make Kitchen Sink open mostly empty and
fill in as the user selects.

- **Left panel: reuse the Explorer's category grouping** of entities. (This already
  exists in `src/config/entityCategories.ts` — Admin/Study, Clinical, Observations/
  Measurements, Lab/Biospecimen, Survey, Files/Other — so this is reuse, not new
  taxonomy work.)
- The other two panels **start empty** and populate as classes are selected.
- **Allow selecting multiple classes** (not just one focal element).

*Serves:* all audiences; this is the view modelers tend to like, made less
overwhelming.

### 3. Visualization of a user-selected subset of entities

A node-link diagram (or tree) for a **subset of entities the user picks**, rather
than the whole model at once.

- **Status of what exists today:** there is **no node-link diagram inside the React
  app**. The only graph-style rendering in the app is the SVG connector overlay
  between Kitchen Sink panels (`LinkOverlay.tsx`). A real node-link diagram exists
  **only as a standalone mockup** — `public/has-a-mockup.html` (Cytoscape + dagre,
  49 nodes / 95 edges) — plus an indented-tree mockup at
  `public/containment-tree-mockup.html`. So this item is "promote/rebuild a mockup
  into the app, scoped to a user-selected subset," not "we already have it."
- This converges with the long-discussed **"pin a set of entities → generate a
  focused diagram"** idea. Whole-model diagrams are borderline legible; a
  user-chosen subset is the bet.
- Note the LinkML-generated docs already render per-class Mermaid diagrams
  (is-a vs has-a distinguished); worth considering for reuse / as a visual
  convention to match.

*Serves:* study designers most (seeing where a region of the model sits); data
users secondarily.

### 4. Help mode (contextual help)

Port the **contextual help** system from `../icd11-playground/web`. It's a clean,
DOM-driven design: elements carry a `data-help-id`, a markdown file holds the help
content, and a hook + popover drive a "?"-toggled help mode that intercepts clicks
and shows per-element explanations. It's largely self-contained
(`useHelpMode.ts`, `HelpPopover.tsx`, `parseHelpContent.ts`, `help-content.md`).

> **LOW-PRIORITY OPEN QUESTION — shared package?** Could help mode become a
> standalone module shared across projects (this app + icd11-playground + future
> ones)? The icd11 implementation is portable enough that extraction looks
> feasible, but it's not worth blocking this work on. Default plan: copy it in
> now, consider extracting later.

*Serves:* all audiences; especially valuable while terminology is in flux.

---

## Open design questions for the team

These are genuinely undecided. We want input rather than to pre-commit. **Numbered
to match the issue (Q1–Q4)** — reply there, quoting the number.

### Q1. One interface, or two? (the view-architecture question)

The Entity Explorer (progressive disclosure) and Kitchen Sink (everything-at-once,
with connecting links) currently coexist as a header toggle. Nobody in the
2026-06-11 meeting except the author endorsed **merging** them into a single
interface that combines the best of both — but that may still be the right move.

Three framings on the table, **left open for the team to decide:**

- **(a) Evolve one, retire the other** — make one view the single interface and
  fold in the few things the other does well (cross-entity links, multi-class
  compare). The retired one stays only as a legacy/demo toggle.
- **(b) Design an explicit merged view** — treat the combined interface as a
  first-class deliverable to design and pitch. Higher risk/reward; needs design
  buy-in not yet given.
- **(c) Keep both, evolve separately** — two distinct views maintained in parallel;
  new work lands wherever it fits. Lowest re-architecture risk, more maintenance.

The proposed work above is deliberately written to be **mostly view-agnostic** so
this decision can come slightly later: the terminology toggle, help mode, and
subset visualization all apply regardless of how this resolves. The "update Kitchen
Sink" item (priority #2) is the one most affected by the answer.

### Q2. Which audience do we optimize the defaults for?

See **"The reframing"** above for the personas. The choice — data users, study
designers (pre-harmonizers), modelers, or "plan for both, defer" — sets the
**default vocabulary mode** (see priority #1's term-set table) and what's shown vs.
hidden on first load, and how much we invest in the study-designer "where does my
thing fit?" flow vs. the data-user "what does this mean?" flow. **A question for
stakeholders — we are not deciding it here.**

### Q3. Are the connecting links worth their screen real estate?

Links look sophisticated and convey structure at a glance, but in the
progressive-disclosure design, inline entity-summary cards and "Referenced by"
lists already cover much of the relationship-viewing need more compactly. Should
links become an **optional overlay / separate "Relationships" tab** rather than
always-on? (Slot reuse/override and enum hierarchy are the cases links still
arguably earn their keep — mainly for modelers.)

### Q4. Confirm (or reorder) the four priorities

The four items under "What we're proposing to build" are ordered 1–4 (terminology ·
compact Kitchen Sink · subset visualization · help mode). Confirm that order or
propose a different one.

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

Beyond help mode (#4 above): resizable panel layout, cross-panel interactions
(highlighting), light/dark mode.
