# Next session — edge display: color system, then docs/help

Two bodies of work, in order. **The color system is a design spec ready to
implement.** The docs/help consolidation follows it, because what the legend and
help text describe depends on the colors being settled.

Delete this file once both are done and their content lives in
`OWNERSHIP_CLASSIFICATION.md`, help, and the tour.

---

## 1. The color system

### 1.1 Three palettes

| | palette | entries | what carries it |
|---|---|---|---|
| **P1 — range** | ColorBrewer **Set1**, entity = blue | 4–5 | row dot, row range label, detail-panel badges |
| **P2 — direction** | ColorBrewer **Blues** | 3 | edge stroke, relation menu chip |
| **P3 — siblings** | ColorBrewer **Pastel1** | 5–6 | slot name, merged-box header |

**P1** is the range palette: entity, enum, data type, variable, and possibly a
fifth for "any range". Qualitative and unordered — Set1 gives maximum mutual
separation. It replaces both the Kitchen Sink element-type colors and the
Explorer detail-panel badge colors; **these are the same set of things and get
the same colors.** (`slot` was an element type in Kitchen Sink only; that idea
is abandoned; no other view needs a color for it.)

**P2** is not independent — it is a sequential ramp *of P1's entity hue*, so
every edge still reads as "entity relationship". Outgoing and incoming are the
same relation seen from two ends, so they sit **close on the ramp** (about
Blues 7 / 6): distinguishable, not dramatically different. **Edge strokes get a
little thicker** so a one-step gap stays legible. Association is **inside the
ramp** at a value that stays clearly visible — the dash pattern carries the
distinction, not faintness. The relation menu chip takes the main entity color.

**P3** distinguishes siblings from each other and supports eye-tracking between
a slot row and its target box. It does **not** need separation from P1, because
the two never share a position (P3 on slot names and headers, P1 on dots and
range labels). Pastel1's low saturation is what keeps it quiet. Five to six
entries covers today's largest group (`Observation`, 5 children); the palette
wraps if a group ever exceeds it.

**Index 0 of P3 is the default**, used for parent-declared slots and for every
box that is not an inheritance-merged box. It is **a significantly darkened form
of P1's entity color**, not a neutral gray: a box header is an entity, so its
header and its own slot names carry the entity identity, and sibling colors
read as departures from it. Header fill and slot-name text likely need two
different steps of that dark end — a fill dark enough for white text is too dark
for small text on a light background.

No other neutral is needed.

### 1.2 What each channel encodes

Per row in a box:

| channel | encodes | palette |
|---|---|---|
| row dot | the slot's range kind | P1 |
| row range label | the slot's range kind | P1 |
| slot name | which class declares it | P3 |
| box header | the class | P3 (default = the box's own) |
| edge stroke | direction | P2, overridden by P3 where colored |

Only **entity** ranges draw edges, so range kind contributes no variation to the
stroke — direction is the stroke's default encoding. The few edges whose
endpoint is a merged-box member override that with the P3 color; there are not
many, and the override is fine.

### 1.3 Sibling color assignment

Replaces the current scheme, which indexes by position among **selected**
siblings, so unselecting one shifts every later sibling's color
(`OwnershipGraphView.tsx:461-467`, inside `mergeSiblings`).

Three steps:

1. **color every class stably.** For each parent with subclasses, index its
   children by position among **all** schema siblings sorted by id — not just
   the ones on canvas. The parent takes the default (P3 index 0). Build this
   once in `DataService`, which already does a whole-schema constructor pass
   (`ExploreApp.tsx:53-55`).
2. **color slot names by target:** `colorIndex[slot.range]`.
3. **If a slot name got a non-default color and its owner is a subclass, give
   the owner the same color.** The container borrows its contents' color.

`mergeSiblings` then reads `siblingColor(colorIndex[mid])` instead of the loop
index. `dataService` is already in that `useMemo`'s dep list
(`OwnershipGraphView.tsx:1100`).

Step 3 is what keeps a container matched to what it contains. Verified against
the schema: the three `*ObservationSet.observations` rows match their targets,
`ObservationSet.observations → Observation` is default/default, and Specimen's
three measure slots take their targets' colors (Specimen is in no merged box,
so its own slot names would otherwise have none).

Slots inherited without a `slot_usage` override merge onto the parent's row and
have no child-specific row to color — `ImagingFile.derived_from` is the case to
check a rule against.

Classes whose parent is `Entity` are top-level and form no merged box.

**Where colors live:** `GRAPH_COLORS` in `appConfig.ts:470-500` (currently
`ownership` amber, `reference` slate, and a 12-entry `siblings` list) and
`APP_CONFIG.elementTypes` (`appConfig.ts:221-321`). All three palettes replace
these. The amber that currently codes "relationship" across edges, dots and the
menu chip is retired — that role moves to P2.

**Tests:** `src/test/siblingMerge.test.ts:53-74` checks stability for a *fixed*
member set, which is why the current bug shipped. Add a case that unselects a
middle sibling and asserts the rest keep their colors. Note that colors are
per-group, so two classes at index 0 in different groups share a color by
design — that is the container/contents pairing, not a collision.

Also test adding a subclass that sorts in between paired container/contained
subclass names (like 'Foo': `DimensionalObs < Foo < MeasurementObs`). Add it
to one (e.g., ObservationSet) and not the other (Observation), and then vice 
versa, to assure that pairs still have matched colors (e.g.,
SdohObservationSet.color == SdohObservation.color).

---

## 2. Docs and help consolidation

### 2.1 `OWNERSHIP_CLASSIFICATION.md` — restructure

- **Strip historical material.** Keep what is current or planned; decision
  archaeology moves to `WORKLOG.md`.
- **Explain the relation vocabulary once, concisely** (see §3.1) — not as two
  parallel tables.
- **Minimize redundancy with help/tour.** Prefer a link plus a one-line summary.
  It is fine to draft prose here first and deploy it into help/tour after.
- **This is where non-user-facing technical material lives**, including the
  color system above once implemented and the edge-display survey (§4).

### 2.2 "Example cases" → a cascading **Help** menu

`ExampleCasesPane.tsx` is today a floating pane with two tabs, `cases` and
`legend` (`:48`). These differ in kind and should not be tabs of one pane.
Replace with a top-level **Help** menu containing:

- **Ownership legend** — permanent. See §3.3.
- **Example cases** — keep, but **cull hard**. ~34 cases in `exampleCases.ts` is
  enough volume that Siggie checks none of them. Delete the ones that only served
  debugging; keep the ones useful to end users. **"Biggest fans" stays here**, not
  in the legend.
- **Help-mode sections** worth surfacing. Do **not** reinstate help mode.

### 2.3 Tour steps for edge features

Add tour steps walking through the edge features. Format and traps: the
`project_tour_format` memory and `src/explore/help-content.md` (`Tour:` blocks,
`tourStateStack.ts`, `helpResolvers.ts`).

[sg] I don't understand what the previous session meant by this at all

### 2.4 `any_of` — a label, not a new edge type

One slot uses `any_of`: `MeasurementObservation.associated_artifact`
(`range: Entity`, `any_of: [Assay, File, QuestionnaireResponse]`). The verdict is
correct and the edge still points at `Entity`; the **label explains what `any_of`
means** — that this slot may point at an `Assay`, a `File`, or a
`QuestionnaireResponse`.

`Assay` has zero inbound edges as a result, so it is unreachable by following an
edge (it is still selectable and displayable). **Preferred fix: a note on `Assay`
explaining what attaches to it.** An explanation problem, not a graph-
completeness problem. If reachability turns out to matter, fan out `any_of` for
reachability only while still drawing the single `Entity` edge.

Background: `OWNERSHIP_CLASSIFICATION.md` §`any_of`.

---

## 3. Open questions

### 3.1 The relation vocabulary — reframe (settled in shape, needs writing)

Not "3 verdicts vs 5 positions" but **three relation kinds, two of which can be
seen from three perspectives**:

```
2 (fwd, bkwd) × 3 (perspectives) + 1 (association) = 7
```

**Open: are the three perspectives `mine`/`theirs`/neutral, or left-PoV/
right-PoV/neutral?** Decide which reads better in help text, and whether it
should drive variable names.

In the code today: `OwnershipVerdict` (3: `own-fwd`, `own-bkwd`, `association`,
in `containmentGraph.ts`) drives layering, stroke and arrowheads;
`RelationPosition` (5, `ownershipSubgraph.ts:66`) drives what the reader sees in
the RelationMenu, and is the 3 crossed with who declares the slot
(`ownershipSubgraph.ts:162,167`). Shipped user-facing labels
(`RELATION_POSITION_LABEL`):

| position | label |
|---|---|
| `owns-mine` | belong to me by my attribute |
| `owns-theirs` | belong to me by their attribute |
| `owned-mine` | I belong to, by my attribute |
| `owned-theirs` | I belong to, by their attribute |
| `association` | associated with |

**color does not encode the perspective split** — with nothing hovered there is
no point of view, so P2 carries only the three kinds. The split belongs to
hover behaviour and label text.

### 3.2 Edge labels — specified, never built

There is **no `<text>` on the edge layer at all**. `EXPLORE_VIZ.md` item 5
specifies a **re-verbed** label on flipped edges ("has members — via
`member_of_research_study`") rather than a bare slot name pointing the wrong way;
`TASKS.md` flags item 5 as a doc bug for asserting this as shipped. Today a
flipped edge is marked only by a back-pointing arrowhead (`arrow-own-back`).

Whatever gets built for the `any_of` label is the **first** edge-label mechanism
and should be designed with the re-verbed requirement in mind. §3.1 decides
whether an edge carries one label or three (left-PoV, right-PoV, neutral, chosen
by pointer proximity) — settle it first.

### 3.3 What the ownership legend should be

**Likely direction: single-entity point of view**, consistent with §3.1. Settle
§3.1 first, since it determines what the legend describes. The legend should also
explain the toolbar buttons, the colors, and dashed edges.

The by-reason breakdowns matter and must exist somewhere, but are too much for
the legend — put them in `OWNERSHIP_CLASSIFICATION.md` or a culled example case.

### 3.4 Popovers vs. title text

Leaning **popover**. Decide **once, globally**, for all current `title=` usages —
take an inventory first. Motivating case: the relation-menu trigger's `title`
tooltip covers the menu's own options when the menu is open. **This belongs to a
popover task, not to the edge work.**

### 3.5 Terminology: "merged"

**Settled: "merged-inheritance".** A class and its descendants drawn as one box
is a **merged-inheritance box**. Edge convergence (several edges sharing one
arrowhead) keeps the word "merge" in `mergeTargets` and is a different thing.
Apply to identifiers (`mergeSiblings`, `isMergedId`, `merged::`) as well as prose.

### 3.6 Should the parent's own edge be black?

`TASKS.md` specifies black for the parent's slot in the `ObservationSet.observations`
fan; it currently renders in the shared channel color. Under §1.2 the parent's
row takes the P3 default (dark entity blue), which supersedes "black" — confirm
that reading.

### 3.7 "N related" counts distinct OUTSIDE classes

`countsOf` counts distinct related class names, and a merged-inheritance box
excludes anything folded into itself (`notSelfOrMember`,
`OwnershipGraphView.tsx:573`). So **selecting more can make the number go down**:
with `Observation` unchecked it is not a member of the box named after it, so
`ObservationSet`'s relation to it counts as outside (6); check it and the count
falls to 5.

Correct but counter-intuitive, and **more confusing still across combinations of
several checkboxes.** Not being fixed now. Leave a clear explanation in
`OWNERSHIP_CLASSIFICATION.md`.

---

## 4. Edge display — current state

Park this survey in `OWNERSHIP_CLASSIFICATION.md`.

1. **Labels** — specified, never built (§3.2).
2. **Source rows** — fixed (`4bd5755`). One edge per declaring class, leaving
   that class's own row. The port id is keyed on `(anchorClass, slot)`, the same
   pair `rowY` resolves by; keyed on slot name alone, every edge in a merged box
   shared one port. `TASKS.md`'s "Edge rendering — the fan from
   `ObservationSet.observations`" section **needs updating to record this as
   delivered.**
3. **Target rows** — open, deferred. A `slot_usage`-narrowed edge should point at
   the **child header** matching its range, not the box header. Worth doing,
   later; crossings will increase but the colors keep them legible. Cheap under
   the current schema: no member or parent of any multi-child family has more
   than one inbound edge, so a row-targeted edge can opt out of `mergeTargets`
   and draw its own arrowhead. The fan passes must skip row-targeted edges. Full
   sketch and the guard test it needs are in the `mergeTargets` doc comment in
   `OwnershipGraphView.tsx` (`8f367da`); if that guard fails it means the schema
   grew a second slot narrowing to the same child and `mergeTargets` must become
   row-aware. **`TASKS.md`'s "▶️ OPEN — a narrowed edge should point at the
   CHILD's header" section needs updating**: only narrowed slots have a
   child-specific row at all, so its "every edge, or only narrowed?" question does
   not arise, and its cost framing is stale.
4. **colors** — being replaced wholesale (§1).
5. **Adjacent** — curved edges removed 2026-08-19; one-arrowhead-per-convergence
   and thinner strokes shipped. Markers use `markerUnits="userSpaceOnUse"` so
   they do not scale with `strokeWidth`; one marker serves both ends via
   `orient="auto-start-reverse"`. Dragging still lacks obstacle-aware routing and
   URL persistence.

---

## 5. Pointers

- `docs/OWNERSHIP_CLASSIFICATION.md` — rules, measured counts (149 edges as of
  `28007df`, measured 2026-08-31), the `any_of` section.
- `docs/EXPLORE_VIZ.md` — visual-design conclusions. **~20–25% stale** as audited
  2026-08-24; item 1 is current, items 2, 3, 5, 6 are not. Check `TASKS.md`'s
  audit before citing.
- `docs/TASKS.md` — the edge-display cluster; two sections need updating (§4).
- `src/config/appConfig.ts` — `GRAPH_COLORS`, `APP_CONFIG.elementTypes`.
- `src/models/containmentGraph.ts` — `classifySlotEdgeExplained`, rule sets,
  `OWNERSHIP_RULE_TEXT`.
- `src/models/ownershipSubgraph.ts` — `RelationPosition`,
  `RELATION_POSITION_LABEL`, `buildOwnershipDag`, `computeSunkLayers`.
- `src/explore/OwnershipGraphView.tsx` — `mergeSiblings`, `countsOf`,
  `notSelfOrMember`, the free-end fan, `rowY`, `mergeTargets`.
- `src/explore/siblingMerge.ts` — `groupSiblings`, `siblingColor`,
  `MergedMember`.
- `src/test/siblingMerge.test.ts`, `src/test/mergedEdges.test.ts`.
- `src/explore/OwnershipLegend.tsx`, `ExampleCasesPane.tsx`, `exampleCases.ts`,
  `RelationMenu.tsx`, `help-content.md`, `tourStateStack.ts`.

**Verification:** `npm run build` (~2s; `npx tsc --noEmit` is too weak and has let
breakage through) and `npx vitest run`. Never run `npm run dev` — Siggie keeps one
running.
