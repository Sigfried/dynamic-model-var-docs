# Next session — edge classification & display: docs/help consolidation

**Scope of the next session: PLANNING AND DOC CHANGES ONLY.** Consolidate,
update, and improve the help and documentation about edge classification and
edge styling/labeling. **A session after that implements.** Do not start
implementing UI in the planning session.

This file is a briefing, not the plan. It records what Siggie asked for, what is
already true in the code, and the questions that need answers. Delete it once the
planning session has folded its content into the real docs.

---

## 1. What Siggie asked for

### 1.1 `OWNERSHIP_CLASSIFICATION.md` — restructure

- **Strip the historical material.** Keep only what is current or planned. The
  doc has accumulated decision archaeology ("DECIDED 2026-08-26…", "an earlier
  draft said…", superseded counts). History belongs in `WORKLOG.md`; this doc
  should read as a statement of what is, not a record of how it got there.
- **"The three edge categories" is wrong — or at least incomplete.** See §2.1
  below; there are 3 verdicts but **5 relation positions**, and the 5 are what a
  user actually sees. Decide which taxonomy this doc leads with.
- **Minimize redundancy with help/tour/other docs.** Prefer a link plus a
  one-line summary over repeating the text. *But note Siggie's caveat:* it may
  make sense to **author the text here first**, then deploy it into help/tour.
  So this doc can be the drafting surface, with the finished prose moving out.
- **This doc is where non-user-facing technical material lives** — implementation
  detail, measured counts, rule-firing order, gotchas. User-facing explanation
  goes to help/tour.
- **Park the "Edge display: what exists" survey here temporarily** while the
  decisions get worked out. It is reproduced in §3 below; move it into the doc.

### 1.2 Fix "example cases" → a cascading top-level **Help** menu

Today `ExampleCasesPane.tsx` is a floating pane with **two tabs**, `cases` and
`legend` (`ExampleCasesPane.tsx:48`). Siggie wants a cascading top menu named
**Help** containing:

- **Ownership legend** — needs work; depends on decisions and text authored as
  part of this effort. (Long-standing: the legend is meant to be **permanent**;
  example cases are temporary. They should not be tabs of one pane. See
  `docs/TASKS.md` and the memory `project_ownership_legend`.)
- **Example cases** — also needs work; **could be significantly shorter**. Could
  absorb **"Biggest fans"**, which does not belong in the ownership legend — *if*
  we decide that section is still useful at all.
- **Help-mode sections**, if any are worth showing now. **Do not reinstate help
  mode** at this point; this is only about surfacing sections that already earn
  their place.

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

Siggie's note: this **may need to be a popover rather than title text** — and
that raises a broader question, *"other title-text items might be better as
popovers too."* Worth deciding once, generally, rather than per-item.

**Bundle with it, since it is quick:** handle the other fields in
`induced_schema.py: _ATTR_FIELDS` — **at least the ones with obvious
explanations**. Current list:

```
range, description, required, multivalued, identifier, inlined,
inlined_as_list, comments, examples, unit, slot_uri, alias, pattern,
minimum_value, maximum_value, any_of, exactly_one_of, none_of, all_of,
structured_pattern
```

Several are already surfaced somewhere; several are not surfaced at all. The
task is to work out which have an explanation worth showing a user, and where it
goes. Low priority, but cheap while the labeling machinery is open.

---

## 2. Findings the planning session should not have to rediscover

### 2.1 There are 3 verdicts but 5 relation positions — the doc documents only 3

This is the substance behind Siggie's "it's five now, right?"

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

So "three edge categories" is not false — it is the classifier's output — but it
is **not what a user encounters**, and the doc never mentions the 5. The user-
facing vocabulary is already settled and shipped
(`RELATION_POSITION_LABEL`, wording chosen by Siggie 2026-08-27):

| position | label |
|---|---|
| `owns-mine` | belong to me by my attribute |
| `owns-theirs` | belong to me by their attribute |
| `owned-mine` | I belong to, by my attribute |
| `owned-theirs` | I belong to, by their attribute |
| `association` | associated with |

**Decision needed:** does `OWNERSHIP_CLASSIFICATION.md` lead with the 3 (it is a
classification doc) and treat the 5 as a presentation concern, or does it present
both as one table? The 5 are the ones help/tour must teach.

### 2.2 Edge labels have never been rendered

There is **no `<text>` on the edge layer at all** — verified by grep. The spec
(`EXPLORE_VIZ.md` item 5) calls for a **re-verbed label** on flipped edges
("has members — via `member_of_research_study`") rather than a bare slot name
pointing the wrong way. `TASKS.md` flags item 5 as a doc bug precisely because it
asserts this as shipped.

**This matters for §1.4:** the `any_of` label request is not a tweak to existing
label rendering — *there is no edge label rendering to tweak.* Whatever gets
built for `any_of` is the first edge-label mechanism, so it should be designed
with the re-verbed-label requirement in mind rather than as a one-off. The
vocabulary above already exists; only rendering is missing.

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

### 2.4 The open endpoint question — Siggie has not chosen

For edges into a **merged sibling box**: should the entity end land on the
**child header** matching its range, instead of the box header?

**Not a tweak.** The entity end has never carried row meaning; that assumption is
load-bearing for port fan-out (`freeEndTotal`/`freeEndSlot`), convergence
merging, and the single shared arrowhead — all three would need to handle both.

**The question to settle first (from `TASKS.md`):** does *every* edge into a
merged box target the child header matching its range, or only a
`slot_usage`-narrowed one? First is one rule; second means the entity end means
different things on different edges.

Machinery already in place: rows carry `declaringClass`, header rows are real
rows with a y-position, and `rowY(node, slot, declaringClass)` resolves an
anchor. Missing: a port on the entity side that targets a header row.

### 2.5 `any_of` background

One slot uses it: `MeasurementObservation.associated_artifact`
(`range: Entity`, `any_of: [Assay, File, QuestionnaireResponse]`), from the
`28007df` sync. The app ignores `any_of` entirely.

The verdict is still **correct** (declared range is `Entity`, so `entity-ranged`
fires and draws forward). But there is a real, visible cost that arrived with
that sync: `associated_assay` was the **only** slot ranging on `Assay`, so
**`Assay` now has zero inbound edges and renders as a false root** — it keeps 3
outbound edges so it is not pruned, but you cannot navigate *to* it.

That is the concrete thing an interim label does **not** fix. Worth being
explicit about in the plan: §1.4's label improves *explanation*; it does not
restore *reachability*. If the false root is what actually bothers anyone, the
cheap fix is fanning out `any_of` **for reachability only** while still drawing
the single `Entity` edge.

Full write-up: `OWNERSHIP_CLASSIFICATION.md` §`any_of`.

---

## 3. "Edge display: what exists" — park this in OWNERSHIP_CLASSIFICATION.md

Four things are on the books, in descending order of how settled they are.

1. **Labels — specified, never built.** `EXPLORE_VIZ.md` item 5 specifies a
   re-verbed label on flipped edges. No edge-layer `<text>` exists; the intent
   survives only as a comment in `ownershipSubgraph.ts`. The *wording* is solved
   (`RELATION_POSITION_LABEL`); only rendering is missing.
2. **Endpoints — one genuinely open design question** (§2.4), Siggie's to call.
3. **Colors — partly settled, partly owed.** Palette shipped (§2.3). Owed from
   Siggie's own upcoming-thoughts #1: the legend "should also explain all toolbar
   buttons, colors, dashed edges" — the *explanation*, not the palette.
4. **Adjacent, mostly resolved.** Curved edges removed; one-arrowhead-per-
   convergence and thinner strokes shipped; bare-diagonal root cause found
   (`bend` mode degenerates on corner-less routes). Dragging still lacks
   obstacle-aware routing and URL persistence.

---

## 4. Open questions to put to Siggie

1. **Which taxonomy leads** in `OWNERSHIP_CLASSIFICATION.md` — 3 verdicts, 5
   positions, or both (§2.1)?
2. **Popovers vs. title text, generally.** Siggie raised this for `any_of` and
   immediately generalized it. Decide once, for all title-text items, rather
   than per-item (§1.4).
3. **Is "Biggest fans" still useful?** It moves to example cases if kept, is
   dropped if not (§1.2).
4. **Merged-box endpoint rule** — every edge, or only `slot_usage`-narrowed
   (§2.4)?
5. **⚠️ Standing unanswered question:** `TASKS.md` records that Siggie asked to
   **"fix the ownership legend"** (2026-08-25) *without saying what is wrong*,
   with an explicit note to **ask first**. That is squarely inside this session's
   scope. **Ask before guessing.**
6. Which `_ATTR_FIELDS` have explanations worth surfacing, and where (§1.4)?

---

## 5. Pointers

- `docs/OWNERSHIP_CLASSIFICATION.md` — rules, measured counts (149 edges as of
  `28007df`), the `any_of` section. Counts were measured 2026-08-31, not asserted.
- `docs/EXPLORE_VIZ.md` — visual-design conclusions. **~20–25% stale**, audited
  2026-08-24; `TASKS.md` lists exactly which items are wrong. Item 1 is current;
  items 2, 3, 5, 6 are not — do not cite it without checking that audit.
- `docs/TASKS.md` — the edge-display cluster, the merged-box endpoint question,
  the legend/cases items.
- `src/models/containmentGraph.ts` — `classifySlotEdgeExplained`, the rule sets,
  `OWNERSHIP_RULE_TEXT`.
- `src/models/ownershipSubgraph.ts` — `RelationPosition`,
  `RELATION_POSITION_LABEL`.
- `src/explore/OwnershipLegend.tsx`, `ExampleCasesPane.tsx`, `RelationMenu.tsx`,
  `help-content.md`, `tourStateStack.ts`.

**Verification in this repo:** `npm run build` (~2s; `npx tsc --noEmit` is too
weak and has let breakage through) and `npx vitest run`. Never run `npm run dev`
— Siggie keeps one running.
