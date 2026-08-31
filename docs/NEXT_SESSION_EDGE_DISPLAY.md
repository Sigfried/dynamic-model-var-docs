# Next session — edge classification & display: docs/help consolidation

**Scope of the next session: PLANNING AND DOC CHANGES ONLY.** Consolidate,
update, and improve the help and documentation about edge classification and
edge styling/labeling. **A session after that implements.** Do not start
implementing UI in the planning session.

This file is a briefing, not the plan. It records what Siggie asked for, what is
already true in the code, and the questions that still need answers. **Delete it
once the planning session has folded its content into the real docs.**

**Where content lands.** When Siggie's original prompt said "here" / "this doc"
(e.g. "author the text here first"), it meant **`OWNERSHIP_CLASSIFICATION.md`**,
not this briefing. Either reading works in practice as long as this file
disappears when the work is done and each piece ends up where it belongs:

| content | destination |
|---|---|
| technical detail, counts, rule order, gotchas | `OWNERSHIP_CLASSIFICATION.md` |
| user-facing explanation | help / tour / legend |
| reasoning, abandoned approaches, corrections | `WORKLOG.md` |
| items needing Siggie | `TASKS.md` or chat |

Siggie's annotations from 2026-08-31 are folded into the sections below. The raw
unincorporated version is commit `74cea32` if the original wording is ever needed.

---

## 1. What Siggie asked for

### 1.1 `OWNERSHIP_CLASSIFICATION.md` — restructure

- **Strip the historical material.** Keep only what is current or planned. The
  doc has accumulated decision archaeology ("DECIDED 2026-08-26…", "an earlier
  draft said…", superseded counts). History belongs in `WORKLOG.md`; this doc
  should read as a statement of what is, not a record of how it got there.
- **"The three edge categories" is wrong — or at least incomplete.** See §2.1;
  there are 3 verdicts but **5 relation positions**. **Decided:** explain both
  in **one place**, concisely — *not* two parallel tables. See §2.1 for the
  shape and for the open design question underneath it.
- **Minimize redundancy with help/tour/other docs.** Prefer a link plus a
  one-line summary over repeating the text. Caveat: it may make sense to
  **author the prose in `OWNERSHIP_CLASSIFICATION.md` first**, then deploy it
  into help/tour — so that doc can be the drafting surface, with finished
  user-facing prose moving out afterward.
- **This doc is where non-user-facing technical material lives** —
  implementation detail, measured counts, rule-firing order, gotchas.
- **Park the "Edge display: what exists" survey there** while decisions get
  worked out. Reproduced in §3 below.

### 1.2 Fix "example cases" → a cascading top-level **Help** menu

Today `ExampleCasesPane.tsx` is a floating pane with **two tabs**, `cases` and
`legend` (`ExampleCasesPane.tsx:48`). Siggie wants a cascading top menu named
**Help** containing:

- **Ownership legend** — permanent. Needs work; depends on the decisions and
  text authored as part of this effort. See §4.4 for what "fix the legend"
  means. The legend and example cases are different in kind and **should not be
  tabs of one pane** (`docs/TASKS.md`, memory `project_ownership_legend`).
- **Example cases** — **keep, but cull hard.** Not all of them are throwaway:
  *some example cases are genuinely useful to end users.* The ones to delete are
  those that only ever served Siggie's own debugging and exploration. The real
  problem is **volume** — there are so many now (~34 in `exampleCases.ts`) that
  Siggie seldom checks any of them. Culling to a small, curated set is the point;
  "significantly shorter" is the goal.
  - **"Biggest fans" → keep, in example cases.** It does not belong in the
    ownership legend, but it is worth retaining. Move it rather than drop it.
- **Help-mode sections**, if any are worth showing now. **Do not reinstate help
  mode**; this is only about surfacing sections that already earn their place.

### 1.3 Tour items stepping through edge features

Add tour steps that walk through the edge features specifically. Format and its
traps: see the `project_tour_format` memory and `src/explore/help-content.md`
(`Tour:` blocks, `tourStateStack.ts`, `helpResolvers.ts`).

### 1.4 Interim `any_of` solution — label, not a new edge type

Instead of implementing the polymorphic edge type (option 3 in the doc's `any_of`
section), do the cheap thing:

> The edge still points at `Entity`, but its **label explains what `any_of`
> means** — i.e. that this slot may point at an `Assay`, a `File`, or a
> `QuestionnaireResponse`.

**Popover vs. title text — leaning popover.** Siggie raised this for `any_of`
and immediately generalized it: *"other title-text items might be better as
popovers too."* Inclination is **toward popovers**, but this is still open for
discussion — and it should be **decided once, for all title-text items**, not
per-item. Worth an explicit pass over what currently lives in `title=` attributes
before committing.

**Other `_ATTR_FIELDS` — timeboxed to a minute.** The remaining fields in
`induced_schema.py: _ATTR_FIELDS`:

```
range, description, required, multivalued, identifier, inlined,
inlined_as_list, comments, examples, unit, slot_uri, alias, pattern,
minimum_value, maximum_value, any_of, exactly_one_of, none_of, all_of,
structured_pattern
```

**Decided:** most of these **do not appear in `bdchm.yaml` at all**, so they are
meaningless to current end users. They would only matter if this app is ever
ported to other schemas. **Do not spend more than a minute on this.** Leave a
note in the code (or somewhere findable) for far-future reference and move on.
Do not build UI for fields the current schema never uses.

---

## 2. Findings the planning session should not have to rediscover

### 2.1 3 verdicts vs. 5 relation positions — and whether both should survive

| taxonomy | values | where | what it drives |
|---|---|---|---|
| `OwnershipVerdict` (**3**) | `own-fwd`, `own-bkwd`, `association` | `containmentGraph.ts` | layering, stroke, arrowheads |
| `RelationPosition` (**5**) | `owns-mine`, `owns-theirs`, `owned-mine`, `owned-theirs`, `association` | `ownershipSubgraph.ts:66` | what the **reader** sees in the RelationMenu |

The 5 are the 3 crossed with **who declares the slot** (`association` does not
split):

```
ownershipSubgraph.ts:162   declaredBy === owner  ? 'owns-mine'  : 'owns-theirs'
ownershipSubgraph.ts:167   declaredBy === member ? 'owned-mine' : 'owned-theirs'
```

User-facing vocabulary, already settled and shipped (`RELATION_POSITION_LABEL`,
wording chosen by Siggie 2026-08-27):

| position | label |
|---|---|
| `owns-mine` | belong to me by my attribute |
| `owns-theirs` | belong to me by their attribute |
| `owned-mine` | I belong to, by my attribute |
| `owned-theirs` | I belong to, by their attribute |
| `association` | associated with |

**Documentation decision (settled):** explain both taxonomies **in the same
place, concisely**. One section, not two competing tables.

**Design question (open, and bigger than the doc):** *should `OwnershipVerdict`
be preserved at all?*

The appeal of dropping it: an edge might always be better described **from the
point of view of a specific entity**, regardless of which class declares the
slot. That would extend `RelationPosition` past labels into **edge formatting
generally**.

The problem that blocks it: **when nothing is hovered, there is no point of
view.** Neither endpoint is the obvious owner, so formatting has to fall back on
`OwnershipVerdict`. And that same gap defeats using `RelationPosition` for label
*text* too — a PoV-dependent label has no correct value in the neutral state.

Possible resolution to explore: **three labels per edge** — left-PoV, right-PoV,
and neutral — selected by whether the pointer sits near one endpoint, the other,
or neither. Untested; it is the shape worth thinking through, not a decision.

*Not worth heavy investment right now,* but it should be resolved before the
label-rendering work in §2.2 hardens a choice by accident.

### 2.2 Edge labels have never been rendered

There is **no `<text>` on the edge layer at all** — verified by grep. The spec
(`EXPLORE_VIZ.md` item 5) calls for a **re-verbed label** on flipped edges
("has members — via `member_of_research_study`") rather than a bare slot name
pointing the wrong way. `TASKS.md` flags item 5 as a doc bug precisely because it
asserts this as shipped.

**This matters for §1.4:** the `any_of` label request is not a tweak to existing
label rendering — *there is no edge label rendering to tweak.* Whatever gets
built for `any_of` is the first edge-label mechanism, so it should be designed
with the re-verbed-label requirement in mind rather than as a one-off.

**And it is more complicated than "the wording is already solved."** The
vocabulary exists, but §2.1 shows the label text may be **point-of-view
dependent**, which the shipped `RELATION_POSITION_LABEL` strings assume a PoV
for. Settle the PoV question in §2.1 *before* building the label renderer — the
renderer's data model differs depending on whether an edge carries one label or
three.

Today a flipped edge is marked by a **back-pointing arrowhead**
(`arrow-own-back`), not a label.

### 2.3 Current styling, as shipped

| what | value |
|---|---|
| ownership (`own-fwd`, `own-bkwd`) | amber solid `#d97706`, one arrowhead at target |
| association | slate dashed `#64748b`, dash `5 4`, **both ends** arrowed |
| flipped marker | `arrow-own-back` (back-pointing arrowhead) |
| self-loops | `⟲` marker on the slot's own row, not a routed edge |
| child rows in merged boxes | edges drawn in that child's colour |

Slate replaced `#9ca3af`, which was too faint against either background. Curved
edges were removed 2026-08-19. One-arrowhead-per-convergence and thinner strokes
shipped. Markers use `markerUnits="userSpaceOnUse"` so they do not scale with
`strokeWidth`; one marker serves both ends via `orient="auto-start-reverse"`.

### 2.4 The merged-box endpoint question — Siggie has not chosen

For edges into a **merged sibling box**: should the entity end land on the
**child header** matching its range, instead of the box header?

#### What "free end" and the fan machinery mean

Every drawn edge has two ends, and they are **not symmetric**:

- **The row end (the "host" end).** Lands on a *specific attribute row* — the
  row for the slot that creates the relation. This end carries **row meaning**:
  it says "this particular attribute".
- **The free end (the "entity" end).** Lands on the *other* class's **header**,
  i.e. on the class as a whole. It deliberately carries **no** row meaning.
  `hostOf(e)` picks the host; the free end is simply whichever endpoint is left
  over (`OwnershipGraphView.tsx:846`).

`freeEndTotal` and `freeEndSlot` are the two halves of one bookkeeping pass over
that free end, both keyed by `"<classId>|in"` or `"<classId>|out"`:

- **`freeEndTotal`** — a **counting pass**: how many edges arrive at this class
  on this side. Counted first because the fan must be centred, which needs the
  total up front.
- **`freeEndSlot`** — an **assigning pass**: hand each edge the next unused lane
  index (0, 1, 2 …) out of that total.

Together they place each edge at `HEADER_H/2 + (idx − (total−1)/2) × spread` —
a fan of distinct approach lanes, centred on the header, spaced
`ENTITY_FAN_GAP = 4px` (`OwnershipGraphView.tsx:732`).

**Why it exists:** six edges converging on `BodySite` through one shared header
port produced overlapping orthogonal runs that read as an edge between two
unrelated owners. One lane per edge keeps ELK's routes distinct.

**Why it is deliberately tight:** an earlier version spread the ports across the
whole header band and spilled below it, so arrows landed beside attribute rows
and **falsely implied "this edge is about that row"** — exactly the meaning the
free end is not supposed to carry. **The lane index carries no ordering meaning**
either; sorting by row y was tried 2026-08-20 and made things worse (it gave the
top row the straight shot and forced every lower one to climb over it).

**So the change is not a tweak.** Targeting a child header means the free end
starts carrying row meaning — the one invariant the fan, convergence merging,
and the single shared arrowhead are all built on. All three would need to handle
both kinds of free end.

#### The examples Siggie asked for

Measured against `public/source_data/HM/bdchm.yaml` on 2026-08-31. Merging is
**selection-dependent** (siblings merge only when on canvas under a mergeable
parent), so these are the schema-level candidates, not guaranteed renderings.

**Multi-child families that can form a merged box:**

| parent | children |
|---|---|
| `Entity` | 37 |
| `QuestionnaireResponseValue` | 5 (`…Decimal`, `…Boolean`, `…Integer`, `…TimePoint`, `…String`) |
| `Observation` | 5 (`Dimensional`, `SpecimenQuality`, `SpecimenQuantity`, `Measurement`, `Sdoh`) |
| `ObservationSet` | 3 (`Dimensional`, `Measurement`, `Sdoh`) |
| `Exposure` | 2 (`DrugExposure`, `DeviceExposure`) |

**Case B — `slot_usage`-narrowed inbound edges. There are exactly four in the
whole schema:**

| edge | narrows to |
|---|---|
| `DimensionalObservationSet.observations` | `DimensionalObservation` |
| `MeasurementObservationSet.observations` | `MeasurementObservation` |
| `SdohObservationSet.observations` | `SdohObservation` |
| `QuestionnaireResponseValueTimePoint.value` | `TimePoint` |

The first three are the clean test: an `ObservationSet` family member pointing
into the `Observation` family, where the narrowed range names one specific
sibling. **Select `DimensionalObservationSet` + `MeasurementObservationSet` +
`SdohObservationSet` alongside their three target observations** and both boxes
merge — this is the case to look at.

Of the schema's 11 `slot_usage` range overrides, the other 7 narrow to
primitives or enums (`decimal`, `boolean`, `integer`, `string`,
`GravityDomainEnum`, `SdohEnum`) and **draw no edge at all**.

**Case A — plain, non-narrowed inbound edges: ~92.** Nearly all point into the
`Entity` family (`Participant`, `Visit`, `TimePoint`, `BodySite`, `Quantity`,
`Organization` …). Three point into the smaller families:

| edge | target | family |
|---|---|---|
| `Specimen.dimensional_measures` | `DimensionalObservationSet` | `ObservationSet` |
| `Specimen.quantity_measure` | `SpecimenQuantityObservation` | `Observation` |
| `Specimen.quality_measure` | `SpecimenQualityObservation` | `Observation` |

Those three are the best **Case A** examples at a viewable scale: `Specimen`
selected with the `Observation` family merged.

**The decision this sets up:** Case A is ~92 edges and Case B is 4. So "every
edge targets the matching child header" is one uniform rule affecting almost
everything; "only `slot_usage`-narrowed ones do" is a rule that fires **four
times in the entire schema** — and makes the entity end mean different things on
different edges. Worth weighing whether 4 cases justify a second meaning for the
free end.

### 2.5 `any_of` background

One slot uses it: `MeasurementObservation.associated_artifact`
(`range: Entity`, `any_of: [Assay, File, QuestionnaireResponse]`), from the
`28007df` sync. The app ignores `any_of` entirely.

The verdict is still **correct** (declared range is `Entity`, so `entity-ranged`
fires and draws forward). But `associated_assay` was the **only** slot ranging on
`Assay`, so **`Assay` now has zero inbound edges**. It keeps 3 outbound edges, so
it is not pruned.

**This is less severe than "false root" suggested.** `Assay` **still appears
under the Lab/Biospecimen category in the selection panel**, so it is fully
reachable for display — a user can select it and see it. What is missing is
reachability *by following an edge*.

Follow-ups Siggie raised:

- **A note on `Assay` explaining what attaches to it and why that edge is not
  currently drawn** would address the real gap better than restoring the edge.
  This is an explanation problem, not a graph-completeness problem.
- **Are roots used for anything user-facing at this point?** Partly answered:
  `roots` is a live user-facing toggle — the **"⇱ roots" toolbar button**
  (`OwnershipGraphView.tsx:1577`), persisted in the URL and settable from tours
  and example cases. It toggles `pathToRoot`, which pulls in every owner up to
  the root ("can pull in most of the schema"; defaults **off**). Separately,
  `buildOwnershipDag`/`computeSunkLayers` use DAG roots internally for layering,
  where "sunk layers" deliberately stop roots from stranding at the top layer.
  **Still open:** whether *root-ness* is ever surfaced as a visible property of a
  class, as opposed to the toggle and the layout math. Worth one grep before
  deciding `Assay`'s changed status matters at all.

An `any_of` label improves *explanation*; it does not restore edge-reachability.
If edge-reachability turns out to matter, the cheap fix is fanning out `any_of`
**for reachability only**, while still drawing the single `Entity` edge.

Full write-up: `OWNERSHIP_CLASSIFICATION.md` §`any_of`.

---

## 3. "Edge display: what exists" — park this in OWNERSHIP_CLASSIFICATION.md

Four things are on the books, in descending order of how settled they are.

1. **Labels — specified, never built.** `EXPLORE_VIZ.md` item 5 specifies a
   re-verbed label on flipped edges. No edge-layer `<text>` exists; the intent
   survives only as a comment in `ownershipSubgraph.ts`. **More complicated than
   "only rendering is missing"** — the label text may be point-of-view dependent
   (§2.1), which decides whether an edge carries one label or three. Settle that
   first.
2. **Endpoints — one genuinely open design question** (§2.4), Siggie's to call.
   Examples of both cases are now measured and listed there.
3. **Colors — partly settled, partly owed.** Palette shipped (§2.3). Owed: the
   legend "should also explain all toolbar buttons, colors, dashed edges" — the
   *explanation*, not the palette.
4. **Adjacent, mostly resolved.** Curved edges removed; one-arrowhead-per-
   convergence and thinner strokes shipped; bare-diagonal root cause found
   (`bend` mode degenerates on corner-less routes). Dragging still lacks
   obstacle-aware routing and URL persistence.

*Note on cross-references:* the `§`-numbers above are sections **of this
briefing file only** — they are not anchors that appear anywhere in the app or
in other docs. They will not survive this file's deletion, so anything moved
into `OWNERSHIP_CLASSIFICATION.md` needs its references rewritten to that doc's
own headings.

---

## 4. Remaining open questions

Resolved items from the earlier list are folded into §1–§2 above. What is still
genuinely open:

### 4.1 Should `OwnershipVerdict` survive? (§2.1)

The documentation question is settled (explain both, one place, concise). The
**design** question is not: can `RelationPosition` take over edge formatting, or
does the no-hover neutral state force `OwnershipVerdict` to stay? Three labels
per edge (left-PoV / right-PoV / neutral) is the shape to think through.
**Blocks §2.2.**

### 4.2 Popovers vs. title text (§1.4)

Leaning **popover**. Still to decide: does this apply to *all* current
title-text items, and what is the inventory of them? Decide once, globally.

### 4.3 Merged-box endpoint rule (§2.4)

Examples now exist for both cases. The weighing: Case A ≈ 92 edges (uniform
rule), Case B = 4 edges (`…ObservationSet.observations` ×3 plus
`QuestionnaireResponseValueTimePoint.value`) but a split meaning for the free
end. Siggie's call after looking at them.

### 4.4 What is wrong with the ownership legend? (partly answered)

`TASKS.md` recorded this ask from 2026-08-25 with no detail and an explicit note
to **ask first**. Siggie's answer:

- **Likely direction: switch the legend to single-entity point of view** —
  consistent with §2.1's PoV thinking. But this **should not be settled until
  the edge classification / formatting / label questions above are resolved**,
  since they determine what the legend is describing.
- **The by-reason breakdowns are important and must exist somewhere**, but they
  are **too much for the legend**. Find them another home — plausibly
  `OWNERSHIP_CLASSIFICATION.md` (technical) or a culled example case.

**Depends on §4.1.** Do not redesign the legend before the PoV question lands.

---

## 5. Pointers

- `docs/OWNERSHIP_CLASSIFICATION.md` — rules, measured counts (149 edges as of
  `28007df`), the `any_of` section. Counts measured 2026-08-31, not asserted.
- `docs/EXPLORE_VIZ.md` — visual-design conclusions. **~20–25% stale**, audited
  2026-08-24; `TASKS.md` lists exactly which items are wrong. Item 1 is current;
  items 2, 3, 5, 6 are not — do not cite it without checking that audit.
- `docs/TASKS.md` — the edge-display cluster, the merged-box endpoint question,
  the legend/cases items.
- `src/models/containmentGraph.ts` — `classifySlotEdgeExplained`, the rule sets,
  `OWNERSHIP_RULE_TEXT`.
- `src/models/ownershipSubgraph.ts` — `RelationPosition`,
  `RELATION_POSITION_LABEL`, `buildOwnershipDag`, `computeSunkLayers`.
- `src/explore/OwnershipGraphView.tsx` — `mergeSiblings` (:429), the free-end fan
  (:845–:890), `ENTITY_FAN_GAP` (:732), the roots toolbar button (:1577).
- `src/explore/OwnershipLegend.tsx`, `ExampleCasesPane.tsx`, `exampleCases.ts`,
  `RelationMenu.tsx`, `help-content.md`, `tourStateStack.ts`.

**Verification in this repo:** `npm run build` (~2s; `npx tsc --noEmit` is too
weak and has let breakage through) and `npx vitest run`. Never run `npm run dev`
— Siggie keeps one running.
