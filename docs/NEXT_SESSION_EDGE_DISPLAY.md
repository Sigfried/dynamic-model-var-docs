# Next session — edge classification & display: docs/help consolidation

**Scope of the next session: DOC AND HELP CHANGES.** Consolidate, update, and
improve the help and documentation about edge classification and edge
styling/labeling. Implementation of UI beyond that comes later.

This file is a briefing, not the plan. It records what Siggie asked for, what is
already true in the code, and the questions that still need answers.
**Delete it once the work has folded its content into the real docs.**

**Where content lands.** When Siggie's original prompt said "here" / "this doc",
it meant **`OWNERSHIP_CLASSIFICATION.md`**, not this briefing.

| content | destination |
|---|---|
| technical detail, counts, rule order, gotchas | `OWNERSHIP_CLASSIFICATION.md` |
| user-facing explanation | help / tour / legend |
| reasoning, abandoned approaches, corrections | `WORKLOG.md` |
| items needing Siggie | `TASKS.md` or chat |

> **`§`-numbers in this file are local to this file.** They are not anchors in
> the app or in any other doc and will not survive its deletion. Rewrite every
> such reference to the destination doc's own headings when content moves.

---

## 0. Terminology — fix this before writing user-facing text

**"Merged" is overloaded and has already caused a real misreading** (Siggie,
2026-08-31: *"this has been continually confusing to me"*). It currently means
two unrelated things:

| current usage | means | suggested |
|---|---|---|
| `mergeSiblings`, `merged::…`, "merged box" | a class **and its descendants** drawn as one box | **merged-inheritance box**, or `class+descendants` |
| convergence merging, `mergeTargets`, "merged edges" | several edges **sharing one arrowhead** | leave as edge convergence |

No single word covers the first. `class+descendants` is accurate;
`merged-inheritance` is shorter. **Siggie has not picked one.** Whatever is
chosen should be applied to identifiers (`mergeSiblings`, `isMergedId`,
`merged::`) as well as prose, so the docs and the code agree.

---

## 1. What Siggie asked for

### 1.1 `OWNERSHIP_CLASSIFICATION.md` — restructure

- **Strip the historical material.** Keep only what is current or planned. The
  doc has accumulated decision archaeology ("DECIDED 2026-08-26…", "an earlier
  draft said…", superseded counts). History belongs in `WORKLOG.md`.
- **Lead with one concise explanation of both taxonomies**, not two parallel
  tables — see §2.1. There are 3 verdicts and 5 relation positions; explain both
  **in the same place**.
- **Minimize redundancy with help/tour/other docs.** Prefer a link plus a
  one-line summary over repeating text. Caveat: it may make sense to **author
  the prose in `OWNERSHIP_CLASSIFICATION.md` first**, then deploy it into
  help/tour — so that doc can be the drafting surface.
- **This doc is where non-user-facing technical material lives.**
- **Park the "Edge display: what exists" survey there** (§3 below).

### 1.2 Fix "example cases" → a cascading top-level **Help** menu

Today `ExampleCasesPane.tsx` is a floating pane with **two tabs**, `cases` and
`legend` (`ExampleCasesPane.tsx:48`). Siggie wants a cascading top menu named
**Help** containing:

- **Ownership legend** — permanent. Needs work; see §4.3 for what "fix the
  legend" means. The legend and example cases differ in kind and **should not be
  tabs of one pane** (`docs/TASKS.md`, memory `project_ownership_legend`).
- **Example cases** — **keep, but cull hard.** Some are genuinely useful to end
  users; the ones to delete are those that only served Siggie's own debugging and
  exploration. The real problem is **volume** — with ~34 cases in
  `exampleCases.ts` Siggie seldom checks any of them.
  - **"Biggest fans" → keep, in example cases.** It does not belong in the
    ownership legend, but it is worth retaining.
- **Help-mode sections**, if any are worth showing now. **Do not reinstate help
  mode**; this is only about surfacing sections that already earn their place.

### 1.3 Tour items stepping through edge features

Add tour steps walking through the edge features specifically. Format and traps:
the `project_tour_format` memory and `src/explore/help-content.md` (`Tour:`
blocks, `tourStateStack.ts`, `helpResolvers.ts`).

### 1.4 Interim `any_of` solution — label, not a new edge type

Instead of the polymorphic edge type (option 3 in the doc's `any_of` section):

> The edge still points at `Entity`, but its **label explains what `any_of`
> means** — i.e. that this slot may point at an `Assay`, a `File`, or a
> `QuestionnaireResponse`.

**Popover vs. title text — leaning popover**, still open. Decide **once, for all
title-text items**, not per-item. Take an inventory of current `title=` usages
before committing.

*Concrete instance of the problem:* the relation-menu trigger's `title` tooltip
covers the menu's own options when the menu is open (Siggie, 2026-08-31). Worth
citing as the motivating case — but it belongs to the popover task, **not** to
the edge work.

**Other `_ATTR_FIELDS` — timeboxed to a minute.** Most of the fields in
`induced_schema.py: _ATTR_FIELDS` **never appear in `bdchm.yaml`**, so they are
meaningless to current users and matter only if the app is ported to another
schema. Leave a code note for far-future reference; build no UI for them.

---

## 2. Findings the next session should not have to rediscover

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

User-facing vocabulary, settled and shipped (`RELATION_POSITION_LABEL`, wording
chosen by Siggie 2026-08-27):

| position | label |
|---|---|
| `owns-mine` | belong to me by my attribute |
| `owns-theirs` | belong to me by their attribute |
| `owned-mine` | I belong to, by my attribute |
| `owned-theirs` | I belong to, by their attribute |
| `association` | associated with |

**Documentation decision (settled):** explain both **in one place, concisely**.

**Design question (open — the session's main unresolved item):** *should
`OwnershipVerdict` survive at all?*

The case for dropping it: an edge might always be better described **from the
point of view of a specific entity**, regardless of which class declares the
slot — extending `RelationPosition` past labels into edge **formatting**.

What blocks it: **with nothing hovered there is no point of view.** Neither
endpoint is the obvious owner, so formatting falls back on `OwnershipVerdict` —
and the same gap defeats PoV-dependent label *text*, which would have no correct
value in the neutral state.

Shape worth exploring: **three labels per edge** — left-PoV, right-PoV, neutral —
chosen by whether the pointer is near one endpoint, the other, or neither.
Untested.

**This blocks §2.2 and §4.3.** It decides whether an edge carries one label or
three, which changes the label renderer's data model, and it decides what the
legend is describing.

### 2.2 Edge labels have never been rendered

There is **no `<text>` on the edge layer at all**. `EXPLORE_VIZ.md` item 5
specifies a **re-verbed label** on flipped edges ("has members — via
`member_of_research_study`") rather than a bare slot name pointing the wrong way;
`TASKS.md` flags item 5 as a doc bug because it asserts this as shipped.

So the `any_of` label in §1.4 is **not a tweak to existing label rendering —
there is none.** Whatever gets built for `any_of` is the first edge-label
mechanism and should be designed with the re-verbed requirement in mind.

**More is unresolved than "only rendering is missing."** The vocabulary exists,
but §2.1 may make label text point-of-view dependent, and the shipped
`RELATION_POSITION_LABEL` strings assume a fixed PoV. **Settle §2.1 first.**

Today a flipped edge is marked by a back-pointing arrowhead (`arrow-own-back`),
not a label.

### 2.3 Current styling, as shipped

| what | value |
|---|---|
| ownership (`own-fwd`, `own-bkwd`) | amber solid `#d97706`, one arrowhead at target |
| association | slate dashed `#64748b`, dash `5 4`, **both ends** arrowed |
| flipped marker | `arrow-own-back` (back-pointing arrowhead) |
| self-loops | `⟲` marker on the slot's own row, not a routed edge |
| child rows in a merged-inheritance box | edges drawn in that child's colour |

Slate replaced `#9ca3af`, too faint against either background. Curved edges
removed 2026-08-19. One-arrowhead-per-convergence and thinner strokes shipped.
Markers use `markerUnits="userSpaceOnUse"` so they do not scale with
`strokeWidth`; one marker serves both ends via `orient="auto-start-reverse"`.

### 2.4 Edge SOURCE rows — bug, FIXED 2026-08-31 (`4bd5755`)

**Symptom.** Every `observations` edge left a single row of the merged
`ObservationSet` box instead of its own. Which row won depended only on
enumeration order — the parent's `observations` row when `Observation` was
selected, `DimensionalObservationSet`'s when it was not — which made one bug look
like two unrelated ones.

**Cause.** A merged-inheritance box can hold several rows sharing one slot name:
the parent's, plus each child's `slot_usage` override. `rowY` resolves them by
`(declaringClass, slot)` and returned the correct distinct y for each. But
`buildSpec` built the row port id from the slot **name alone**
(`${host.id}::row:${slot}`), and `addPort` keeps the first registration per id —
so all those edges shared one port and every later edge silently inherited the
first one's y. The correct positions were computed and discarded. This is exactly
the failure `rowY`'s own doc comment warns about, missed one line later.

**Fix.** Key the port id on the same `(anchorClass, slot)` pair `rowY` resolves
by. One line.

**Why the suite did not catch it.** An existing test asserted distinct
`anchorClass` values per edge and passed throughout — the view model was always
right; the break was downstream in `buildSpec`. The new test asserts on the
**ports and their y values**, verified to fail without the fix (`expected 1 to
be 4`). Lesson for similar work: assert at the layer that actually renders.

**This satisfies the rule `TASKS.md` already specified** under "Edge rendering —
the fan from `ObservationSet.observations`": *one edge per DECLARING class,
coloured by that class*, black for the parent's own slot. **That `TASKS.md`
section needs updating to record the rule as delivered** — with one caveat: the
parent's edge currently renders in the shared channel colour, not black. Confirm
whether black is still wanted.

### 2.5 Edge TARGET rows — open, and cheaper than previously documented

Wanted: a `slot_usage`-narrowed edge should point at the **child header** matching
its range, not the box header. Today all three `…ObservationSet.observations`
edges land on the merged `Observation` box header, hiding the point of the
narrowing — each set holds its **own** kind of observation.

**Siggie's position (2026-08-31):** worth doing, but **later** — not part of the
current doc work. Crossings will increase, but *"the colors would make them
legible."*

**The old "every edge, or only `slot_usage`-narrowed?" question is DEAD — it was
a false choice.** Without `slot_usage`, a child's slot is identical to the
inherited one, so it merges onto the **parent's** row and there is no
child-specific row to anchor on. **Only narrowed slots can pose the question at
all.** Delete this question wherever it appears — it is currently open in
`TASKS.md` under "▶️ OPEN — a narrowed edge should point at the CHILD's header",
and that section also repeats the stale "not a tweak" framing below.

**It is cheap under the current schema.** Measured 2026-08-31: no member or
parent of any multi-child family has more than **one** inbound edge. Under the
change the `ObservationSet` case spreads over **four** arrival rows — the three
children plus `Observation` itself, which carries `ObservationSet.observations`
on the parent row — with exactly one edge each. So **convergence merging is a
no-op for these rows**: a row-targeted edge can simply opt out of `mergeTargets`
and draw its own arrowhead at its own port. `mergeTargets` does **not** need to
become row-aware, and its `HEADER_H / 2` geometry stays as-is for box-header
arrivals.

This is why the earlier "not a tweak — the fan, convergence merging and the
shared arrowhead all need to handle both" framing **overstated the cost**. It is
still true that the fan passes must skip row-targeted edges (or the fan reserves
lanes for edges no longer using it and mis-centres the rest), but the arrowhead
layer is untouched *as long as the one-edge-per-row property holds*.

**Full implementation sketch and the guard test it needs** are recorded in the
`mergeTargets` doc comment in `OwnershipGraphView.tsx` (commit `8f367da`) —
next to the code that depends on the property, so it cannot be missed. **If that
guard ever fails it does not mean the code broke**: it means the schema grew a
second slot narrowing to the same child, the no-merge shortcut is void, and
`mergeTargets` must become row-aware after all. Do not delete the assertion.

### 2.6 `any_of` background

One slot uses it: `MeasurementObservation.associated_artifact` (`range: Entity`,
`any_of: [Assay, File, QuestionnaireResponse]`), from the `28007df` sync. The app
ignores `any_of` entirely.

The verdict is still **correct** (declared range is `Entity`, so `entity-ranged`
fires and draws forward). But `associated_assay` was the **only** slot ranging on
`Assay`, so `Assay` now has zero inbound edges. It keeps 3 outbound edges, so it
is not pruned.

**"False root" overstated it.** `Assay` still appears under Lab/Biospecimen in
the selection panel and can be selected and displayed. What is missing is
reachability *by following an edge*.

- **Preferred fix (Siggie):** a note on `Assay` explaining what attaches to it
  and why that edge is not drawn. An explanation problem, not a graph-
  completeness problem.
- **Roots are user-facing**, so this was worth checking: `roots` is the **"⇱
  roots" toolbar toggle** (`OwnershipGraphView.tsx:1577`), URL-persisted and
  settable from tours and example cases; it toggles `pathToRoot`, which pulls in
  every owner up to the root (defaults off). `buildOwnershipDag` /
  `computeSunkLayers` also use DAG roots for layering. Nothing surfaces
  *root-ness* as a visible property of a class. **Siggie, 2026-08-31: this is
  fine as is — no action.**

An `any_of` label improves *explanation*; it does not restore edge-reachability.
If that turns out to matter, the cheap fix is fanning out `any_of` **for
reachability only** while still drawing the single `Entity` edge.

Full write-up: `OWNERSHIP_CLASSIFICATION.md` §`any_of`.

### 2.7 "N related" counts distinct OUTSIDE classes

Siggie, 2026-08-31: *"weird — I get '5 related' with Observation checked and '6
related' with it unchecked."* Not a bug, but it reads backwards and help should
say so.

`countsOf` counts **distinct related class names**, and a merged-inheritance box
excludes anything folded **into itself** — `notSelfOrMember`
(`OwnershipGraphView.tsx:573`): those are *inside* the box, not related to it.

With `Observation` unchecked, the three children merge into a box labelled
`Observation`, but the parent class `Observation` is **not a member** of it —
nothing absorbed it, since it was not selected. So `ObservationSet`'s relation to
`Observation` still counts as a relation to an outside class: **6**. Check
`Observation` and it is absorbed into that box, `notSelfOrMember` drops it, and
the count falls to **5**.

**Selecting more therefore makes the number go down**, which is correct but
counter-intuitive — worth an explicit line in the legend/help: *"N related"
counts distinct classes **outside** this box, and merging changes what counts as
outside.*

---

## 3. "Edge display: what exists" — park this in OWNERSHIP_CLASSIFICATION.md

1. **Labels — specified, never built.** `EXPLORE_VIZ.md` item 5 specifies a
   re-verbed label on flipped edges; no edge-layer `<text>` exists. Blocked on
   the point-of-view question (§2.1), which decides whether an edge carries one
   label or three.
2. **Endpoints.** Source rows: **fixed** (§2.4). Target rows: **open, deferred by
   Siggie, cheap under the current schema** (§2.5).
3. **Colors — partly settled, partly owed.** Palette shipped (§2.3). Owed: the
   legend "should also explain all toolbar buttons, colors, dashed edges" — the
   *explanation*, not the palette.
4. **Adjacent, mostly resolved.** Curved edges removed; one-arrowhead-per-
   convergence and thinner strokes shipped; bare-diagonal root cause found
   (`bend` mode degenerates on corner-less routes). Dragging still lacks
   obstacle-aware routing and URL persistence.

---

## 4. Remaining open questions

### 4.1 Should `OwnershipVerdict` survive? (§2.1)

The documentation question is settled; the **design** question is not. Can
`RelationPosition` take over edge formatting, or does the no-hover neutral state
force `OwnershipVerdict` to stay? Three labels per edge is the shape to think
through. **Blocks §2.2 and §4.3.**

### 4.2 Popovers vs. title text (§1.4)

Leaning **popover**. Still to decide: does it apply to *all* current title-text
items, and what is the inventory? Decide once, globally. Motivating case: the
relation-menu tooltip covering its own options.

### 4.3 What is wrong with the ownership legend? (partly answered)

`TASKS.md` recorded this ask from 2026-08-25 with no detail and a note to **ask
first**. Siggie's answer:

- **Likely direction: single-entity point of view**, consistent with §2.1. But
  **do not settle it until the classification/formatting/label questions land**,
  since they determine what the legend describes.
- **The by-reason breakdowns matter and must exist somewhere**, but are **too
  much for the legend**. Plausible homes: `OWNERSHIP_CLASSIFICATION.md`
  (technical) or a culled example case.

**Depends on §4.1.**

### 4.4 Terminology for "merged" (§0)

`merged-inheritance box` vs `class+descendants` vs something else. Siggie has not
picked. Applies to identifiers as well as prose.

### 4.5 Should the parent's own edge be black? (§2.4)

`TASKS.md` specifies black for the parent's slot; it currently renders in the
shared channel colour. Confirm.

---

## 5. Pointers

- `docs/OWNERSHIP_CLASSIFICATION.md` — rules, measured counts (149 edges as of
  `28007df`), the `any_of` section. Counts measured 2026-08-31.
- `docs/EXPLORE_VIZ.md` — visual-design conclusions. **~20–25% stale**, audited
  2026-08-24; `TASKS.md` lists which items are wrong. Item 1 is current; items 2,
  3, 5, 6 are not — do not cite without checking that audit.
- `docs/TASKS.md` — the edge-display cluster. **Two sections need updating from
  this work:** "Edge rendering — the fan from `ObservationSet.observations`"
  (rule now delivered, §2.4) and "▶️ OPEN — a narrowed edge should point at the
  CHILD's header" (its design question is void, and its cost framing is stale —
  §2.5).
- `src/models/containmentGraph.ts` — `classifySlotEdgeExplained`, rule sets,
  `OWNERSHIP_RULE_TEXT`.
- `src/models/ownershipSubgraph.ts` — `RelationPosition`,
  `RELATION_POSITION_LABEL`, `buildOwnershipDag`, `computeSunkLayers`.
- `src/explore/OwnershipGraphView.tsx` — `mergeSiblings`, `countsOf` and
  `notSelfOrMember` (§2.7), the free-end fan, `rowY`, and the `mergeTargets`
  doc comment carrying the §2.5 implementation sketch.
- `src/test/mergedEdges.test.ts` — the merge/edge harness, including the port
  regression test from §2.4.
- `src/explore/OwnershipLegend.tsx`, `ExampleCasesPane.tsx`, `exampleCases.ts`,
  `RelationMenu.tsx`, `help-content.md`, `tourStateStack.ts`.

**Verification in this repo:** `npm run build` (~2s; `npx tsc --noEmit` is too
weak and has let breakage through) and `npx vitest run`. Never run `npm run dev`
— Siggie keeps one running.
