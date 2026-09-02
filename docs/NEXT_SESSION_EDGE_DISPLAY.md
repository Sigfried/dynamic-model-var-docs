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
- **Example cases** — keep, but **cull**. ~34 cases in `exampleCases.ts` is enough
  volume that there is no obvious place to start debugging from. Keep a case if it
  either **(a)** shows off a feature, or sets up a state that is interesting for a
  user to play with, or **(b)** covers a distinct semantic area of the model, so the
  set as a whole gives a feel for what the model spans. Debugging cases are not
  disqualified — many will pass (a). What goes is the first group of simple,
  user-directed cases: those predate the tour, which now does that job better.
  **"Biggest fans" stays here**, not in the legend.
- **Help-mode sections** worth surfacing. Do **not** reinstate help mode.

### 2.3 Tour steps for edge features

Add tour steps walking through the edge features. Format and traps: the
`project_tour_format` memory and `src/explore/help-content.md` (`Tour:` blocks,
`tourStateStack.ts`, `helpResolvers.ts`).

Which edge features the tour should cover is not yet decided — candidates are
the P1/P2/P3 color encodings, arrowhead direction, dashed association edges,
and a narrowed edge pointing at a child header. Settle the step list first.
**This is the highest-priority remaining item.**

### 2.4 `any_of` — a label, not a new edge type

One slot uses `any_of`: `MeasurementObservation.associated_artifact`
(`range: Entity`, `any_of: [Assay, File, QuestionnaireResponse]`). The verdict is
correct and the edge still points at `Entity`; the **label will explain what `any_of`
means** — that this slot may point at an `Assay`, a `File`, or a
`QuestionnaireResponse`.

`Assay` has zero inbound edges as a result, so it is unreachable by following an
edge (it is still selectable and displayable). **Preferred temporary fix: a note on `Assay`
explaining what attaches to it.**

Background: `OWNERSHIP_CLASSIFICATION.md` §`any_of`.

---

## 3. Open questions

### 3.1 The relation vocabulary — reframe (settled in shape, needs writing)

Not "3 verdicts vs 5 positions" but **three relation kinds, two of which can be
seen from three perspectives**:

```
2 (fwd, bkwd) × 3 (perspectives) + 1 (association) = 7
```
In the code today: `OwnershipVerdict` (3: `own-fwd`, `own-bkwd`, `association`,
in `containmentGraph.ts`) drives layering, stroke and arrowheads;
`RelationPosition` (5, `ownershipSubgraph.ts:66`) drives what the reader sees in
the RelationMenu, and is the 3 crossed with who declares the slot
(`ownershipSubgraph.ts:162,167`). Shipped user-facing labels
(`RELATION_POSITION_LABEL`):

 | position     | label                           |
 |--------------|---------------------------------|
 | `owns-mine`    | belong to me by my attribute    |
 | `owns-theirs`  | belong to me by their attribute |
 | `owned-mine`   | I belong to, by my attribute    |
 | `owned-theirs` | I belong to, by their attribute |
 | `association`  | associated with                 |

**color does not encode the perspective split** — with nothing hovered there is
no point of view, so P2 carries only the three kinds. The split belongs to
hover behaviour and label text.

### 3.2 Edge labels — settled: one label, on hover

There is **no `<text>` on the edge layer at all**, and after this decision there
still won't be. `TASKS.md` flags item 5 as a doc bug for asserting labels as
shipped. Today a flipped edge is marked only by a back-pointing arrowhead
(`arrow-own-back`).

**Decision (2026-09-02): no persistent edge labels. One label, shown on edge
hover, in a chip near the cursor, with its point of view chosen by which
endpoint the pointer is closer to.**

Why *always-on* is off the table — read off the rendered graph: edges are long
orthogonal runs with multiple bends, routed through the gaps between columns,
and they bundle where they arrive (the group entering `Entity`, the four
converging on `Observation`'s child headers). There is no dependable midpoint —
`Document.focus → Entity` has its midpoint in open space far from either end,
while `Condition.affected_body_site → BodySite` is a short hop with no room at
all. A label on the line collides with its neighbours in exactly the dense
regions where it would be most wanted.

Once always-on is gone, the close/middle/far geometry collapses. Hovering an
edge **is** a point of view — supplied by pointer proximity — so the neutral
middle label has no occasion to render, and one chip replaces three. The
existing 11px transparent hit path already provides the trigger.

Also settled: **entity hover does not label all of that entity's edges.**
`Observation` would sprout a dozen chips. Entity hover keeps its highlight;
the words stay in the RelationMenu, which already spells out the five positions.

Consequences for neighbouring items:

- **`any_of` (§2.4) does not need this mechanism.** One slot pointing at
  `Entity` and needing to say "may be an `Assay`, a `File`, or a
  `QuestionnaireResponse`" is a footnote on the **row**, not a label on the
  edge — a marker on `associated_artifact`, explained in the detail panel, plus
  the note on `Assay`. It is no longer the "first edge-label mechanism."
- **Rows are the other half of this.** A row already carries slot name, target
  and cardinality; the edge only has to say *where it goes*. Hovering the row
  and hovering the line leaving it are the same question asked from the same
  end, so they should share one component and one vocabulary — with the row
  version always taking the near/"mine" point of view. Deferred with §3.4.

Both tables below stay: they are the clearest statement of the relation
vocabulary anywhere in the repo, and they remain the source for cascading-menu
items, help text and the legend, whether or not a label ever renders. The
`close`/`far` columns are now reference material rather than a render spec.

To be precise about what proximity does: it selects the **row** — that is, the
point of view — and the `close` label is then what renders, at the near end.
It does not choose between the `close` and `far` columns; those are the same
relationship described from its two ends, not alternatives. Showing the `far`
label simultaneously at the other end, so the user reads the relationship from
both points of view at once, is possible but judged **excessive**: it doubles
the ink for something the reader gets by hovering the other end. The `middle`
column records the neutral phrasing for prose where no point of view exists.


  | from PoV | position | edge type   | position type | other box pos | close label                      | middle label    | far label                        |
  |----------|----------|-------------|---------------|---------------|----------------------------------|-----------------|----------------------------------|
  | yes      | mine     | own-fwd     | owns-mine     | right         | belongs to me by my attribute    | contains        | I belong to by their attribute   |
  | yes      | mine     | own-bkwd    | owned-mine    | left          | I belong to by my attribute      | contained by    | belongs to me by their attribute |
  | yes      | theirs   | own-fwd     | owns-theirs   | left          | I belong to by their attribute   | contains        | belongs to me by my attribute    |
  | yes      | theirs   | own-bkwd    | owned-theirs  | right         | belongs to me by their attribute | contained by    | I belong to by my attribute      |
  | no       | neutral  | own-fwd     | owns          | right         |                                  | contains        |                                  |
  | no       | neutral  | own-bkwd    | owned         | left          |                                  | contained by    |                                  |
  | any      | any      | association | association   | left          |                                  | associated with |                                  |


other label possibilities

 | personal language label (current) | shorter personal label | objective language label |
 |-----------------------------------|------------------------|--------------------------|
 | belongs to me by my attribute     | I contain it           | self contains            |
 | I belong to by my attribute       | I belong to it         | self contained by        |
 | I belong to by their attribute    | It contains me         | contained by other       |
 | belongs to me by their attribute  | It belongs to me       | other contained by       |

### 3.3 What the ownership legend should be

An entity can be related to others in the following ways:

- Through inheritance, that is, IS-A relationships:
  - ObservationSet has subclasses: DimensionalObservationSet, MeasurementObservationSet, SdohObservationSet.
    These are set in the schema like, `MeasurementObservationSet.is_a = ObservationSet`.
  - Attributes on a subclass sometimes override attributes on the parent. So
    `ObservationSet.observations.range = Observation` but 
    `MeasurementObservationSet.observations.range = MeasurementObservation`.
- Through attributes with a class/entity range, i.e., HAS-A relationships:
  - Through attributes on the entity itself, in one of two ways:
    - "Containing" the other:
      - `MeasurementObservation.body_site` can optionally (0..1) connect
        to a BodySite -- the BodySite "belongs to" the MeasurementObservation
      - `ObservationSet.observations` contains one or more Observations
    - Being "contained by" the other:
      - ...
  - Through attributes on another entity:
    - ...

I was imagining this being easier to comprehend with pictures (NOT ascii,
looking like the app)

```
                                                                                                                  
                                             __________________________________________ 
                                            | Condition                                |
                                            |------------------------------------------|
                                            | ...                                      |
  _______ It belongs to me   I belong to it | affected_visit              Visit (0..1) |
 | Visit | -------------------------------< | ...                                      | I contain it     It contains me __________ 
 |-------|                                  | body_site                BodySite (0..1) |  ----------------------------> | BodySite |
 | ...   |                                  | ...                                      |                                |----------|
 |_______|                                  |__________________________________________|                                | ...      |
                                                                                                                        |__________|
```
The legend should also explain the toolbar buttons, the colors, and dashed edges.

The by-reason breakdowns matter and must exist somewhere, but are too much for
the legend — put them in `OWNERSHIP_CLASSIFICATION.md` or a culled example case.

### 3.4 Popovers vs. title text

The relation-menu trigger's `title` tooltip covers the menu's own options when
the menu is open. Fix that one on its own — likely by moving the text into the
menu as a header line rather than adding another floating layer.

**No new popovers for now** (settled 2026-09-02). Entity-title and row popovers
were considered and deferred: what they would carry is part of a larger pass on
getting all the detail into one place — several things still require going back
to an earlier view — and that pass comes *after* the tour is authored. The
detail panel stays as-is until then; whether a row popover would duplicate or
replace its slot content is deferred with it.

Whenever popovers do land, they want to be **one primitive** (positioning,
delay, dismissal, z-order above both the SVG and the node divs) with different
content per trigger, or the entity-title and row versions will drift apart.

### 3.5 Terminology: "merged"

**Settled: "merged-inheritance".** A class and its descendants drawn as one box
is a **merged-inheritance box**. Edge convergence (several edges sharing one
arrowhead) keeps the word "merge" in `mergeTargets` and is a different thing.
Apply to identifiers (`mergeSiblings`, `isMergedId`, `merged::`) as well as prose.

### 3.6 "N related" counts distinct OUTSIDE classes

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
3. **Target rows** — **DONE 2026-09-02.** A `slot_usage`-narrowed edge points at
   the child header matching its range, not the box header. Row-targeted edges
   opt out of `mergeTargets` and draw their own arrowhead; both fan passes skip
   them. The no-merge shortcut rests on a schema property (no family member has
   more than one inbound edge) that `mergedEdges.test.ts` now guards — a
   failure there means the schema changed, not the code. Full record in
   `TASKS.md`, "✅ DONE — a narrowed edge points at the CHILD's header".
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
