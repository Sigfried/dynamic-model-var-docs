# Backlog

> **Deferred and parked work, with its full write-up.** Nothing here is
> scheduled; nothing here is finished. What is actually next is in
> [TASKS.md](TASKS.md), which links into this file.
>
> Several of these are **investigations, not fixes** — where a cause is marked
> unmeasured, it is unmeasured, and the standing rule is to measure before
> proposing one.

---

## Investigations

### Re-render regression — STILL UNINVESTIGATED

> *"Most clicks (chip, selection, +N attributes, etc.) cause at least the main
> panel to refresh. Didn't used to do that I don't think."*

A **regression report that has never been investigated**, and the most serious
open item: it affects every interaction, where everything else is a visual
defect in one feature. It was deferred by a planning session, not dropped.

Likely suspects, in order — but **measure before believing any of them**:

1. `ExploreApp` now owns the four toolbar settings (`82039a6`). Each is a
   `useState` in the top-level component, so any change re-renders the whole
   tree including `OwnershipGraphView`.
2. The `writeExploreState` effect depends on nine values instead of four.
3. `HelpProvider` wraps the app and its `api` useMemo depends on ~13 values, so
   it may invalidate on every render.
4. `SelectionTree` recomputes `counts` over all 54 classes via `useMemo` keyed
   on `[nodes, dataService]` — should be stable, but verify.

**Do not fix by guessing.** Add a render counter or use the React DevTools
profiler and find out which component re-renders and why.

### Edge crossings

> *"There are a lot of unnecessary edge crossings. I don't know how much we can
> do to fix them, but we should try."*

Layout is `useGraphLayout`. Cause not investigated. Do not speculate without
measuring.

### The bare diagonal

One approach in a convergence arrives as a **straight diagonal with no steps**
while its neighbours step once or twice, cutting across other boxes. Reproduce:

```
?sel=BodySite~Condition~Consent~Demography~Exposure~Observation~Procedure
&exp=ImagingFile~ImagingStudy~MeasurementObservation~SpecimenCreationActivity
```

**Root cause found 2026-08-21 (Siggie's diagnosis, confirmed): `bend` mode
degenerates when there is no corner to bend from.** `mergeDistFor(mode, pts)`
returns, for `bend`, the length of the LAST ROUTED SEGMENT. When ELK routes an
approach as a single straight run — which happens whenever the outermost fan
lane lines up with the source row, i.e. the TOP approach of a large convergence
— that "last segment" is the whole edge. `mergeCut` then walks back past the
source, `cut` lands at index 0, and the entire path becomes one straight line
from source anchor to shared arrowhead base.

Verified numerically: a 2-point route 1020px long yields `mergeDist = 1020`,
`cut = 0`. `near`/`far` are immune because their distance is a fixed 40/120px,
so the cut always lands on the horizontal run near the node.

So `merge-near` is not "better here" in general — **`bend` is simply undefined
on a corner-less route.** The fix is a **guard**, not a compromise: clamp `bend`
to `Math.min(lastSegment, nearDistance)`, or fall back to `near` when the route
has fewer than 3 points. Not implemented — Siggie chose to build the comparison
harness first.

⚠️ Three guesses were made before this and **all three were wrong**. Do not
theorise from the code; `?dbg=1` logs each convergence's routed approaches.

---

## Diagram and layout

### The fan from `ObservationSet.observations`

**The source-row half shipped 2026-08-31 (`4bd5755`).** Each
`…ObservationSet.observations` edge now leaves its OWN row.

The cause was not the merge logic. The view model was always right; the row port
id in `buildSpec` was keyed on the slot NAME alone, so the parent row and every
child override claimed one port and `addPort` kept only the first — every later
edge silently inherited the first one's y. Which row won depended on enumeration
order, so it looked like two different bugs. `src/test/mergedEdges.test.ts`
asserts on the PORTS, since the pre-existing anchor assertion passed throughout
the bug's life.

**The rule, and it stands unqualified: one edge per DECLARING class, coloured by
that class**, black for the parent's own slot.

> *"ObservationSet.observations should be one black edge;
> DimensionalObservationSet.observations should be one blue edge (ideally to
> DimensionalObservation but could be Observation because of edge crossings)."*

Rejected: **keep-and-explain** — it needs explaining *because* it is not
working, and documentation is not a fix for an unreadable diagram. Rejected as a
blanket rule: **one black edge for everything** — `observations` is narrowed per
subclass, so one black edge drops the fact that each set holds its own kind.
That is real information loss.

⚠️ **A premise that was wrong, corrected — do not restore it.** The idea that
`ObservationSet` could be suppressed rested on it being abstract. **It is not.**
Measured against `bdchm.yaml`: no `abstract: true`; it is `is_a: Entity`, it
declares `observations`, and the subclasses narrow it. Asked again with the
corrected premise, Siggie said **don't suppress**.

**⬜ Still open:** the parent's own edge renders in the shared channel colour,
not black as specified. **Confirm whether black is still wanted.**

Also in scope: the missing `Specimen.quality_measure` edge — same subsystem,
same merge-suppression cause.

### Chip strips → relation counts + menu

> *"I think we need something other than chip strips. They're ugly and also tend
> to have text overlap."*

Confirmed: Observation carries 13 `owned by` chips over three wrapped lines plus
an `owns` strip plus `add all` — the box is mostly chips before it is mostly
content.

**Keep the underlying model.** "Relations that exist but are not drawn" is sound
and is what stops Organization being a dead end. It is the *presentation* as
inline wrapped chip strips that fails, and it fails structurally: a wrapped strip
makes box height unpredictable, which changes edge anchoring.

**Four ownership positions plus association**, from a single entity's
perspective — the distinction Siggie insisted on, correctly:

> *"I'm not sure I'm happy with the new `hiddenOwned` getting merged with owns.
> The distinction is sort of like 'mine because I say so' and 'mine because it
> says so'."*

|  | declared on me | declared on them |
|---|---|---|
| **I own it** | own-fwd (my attribute) | own-bkwd flipped (their FK) |
| **it owns me** | own-bkwd (my FK) | own-fwd (their attribute) |

⚠️ **Implementation consequence:** the DAG **flips `own-bkwd` at graph-build
time** (`containmentGraph.ts`), so by the time you hold `parents`/`children` the
declaring side has been erased. Recovering it means **carrying the verdict
through the DAG**, not just the direction.

**Associations must be surfaced** — they appear in neither strip today.
`ASSOCIATION_SLOTS` = `related_document`, `container`.

**Shape:** replace N inline chips with a **count per relation type**, expanding
to a menu. Rows and a cascade are compatible — the rows **are** the top level of
the cascade, and a fixed-height row per category is what makes box height
predictable. **Re-hiding: include it** — clicking a shown entity re-hides it,
which preserves the drawn/undrawn state chips would otherwise lose.

*(Partly overtaken by the relation bar, which shipped 2026-09-04 and replaced
the cascading menu. Kept because the four-position model and the fan-out problem
below are unaddressed by it.)*

#### Fan-out — why `add all` is dangerous

MEASURED. `expand` adds exactly one id, so the extra boxes are not the click —
they come from `ownershipSubgraph.ts`, where **one-hop-up is applied to every
core node including newly expanded ones**, capped at 5.

Probe: Participant alone → 4 boxes. Expanding DimensionalObservation → **7
boxes**, because its parents are `Organization, DimensionalObservationSet,
Participant, Visit`; two are already drawn, so the other two arrive uninvited.
**One chip clicked, three boxes appeared.** `add all` multiplies it: ~4 ids each
pulling up to 5 owners — roughly 4 requested, up to ~20 drawn.

Siggie is **inclined to distinguish selection from expansion** (expanded nodes
arrive bare; their owners appear as counts to expand from) — *"but let's see
where we end up with chip strip replacement before implementing."* **Deferred
deliberately: the redesign may dissolve the question.**

### "Hide all" leaves boxes behind with nothing shown

> *"I guess this is correct but a little surprising. Maybe consider dealing with
> eventually."* **Filed, not scheduled.**

Repro: select MeasurementObservation → `add all` *belong to me by my attribute*
→ on BodySite, `add all` *I belong to, by their attribute* → on
Observation/MeasurementObservation, `hide all` *belong to me by my attribute*.
Several classes stay drawn reading **`N related · 0 shown`**, some with no edges.

**It is correct, and that is the point.** Those classes were added a second time
by BodySite's `add all`, so they are selected in their own right. Nothing tracks
"who asked for this", **by design** — that is exactly the provenance the
selected/expanded merge deleted.

So the surprise is not the removal semantics; it is that **a box can survive
with `0 shown` and no edges**, which reads as breakage. Options, cheapest first:
(1) do nothing; (2) style the `0 shown` / edgeless case so it reads as
deliberate; (3) have `hide all` offer to drop the boxes it just orphaned.

**Do not** solve it by making `hide all` cascade through provenance.

### Dragging is unfinished

Works: drag, drop-in-place, edges re-routed, amber border, double-click to
release, drawer no longer pops open mid-drag.

Missing:

1. **No obstacle awareness.** `smoothStepPath` routes between two anchors and
   knows nothing about other nodes, so a moved node's edges cross boxes ELK
   would have routed around. **ELK cannot fix this** — see WORKLOG for why
   `noLayout`, `Fixed Layout`, INTERACTIVE and libavoid are all dead ends. The
   real fix is an orthogonal obstacle router (A*/visibility graph), pure
   geometry, testable in `paths.ts`. **Not scoped — needs Siggie's go-ahead.**
2. **No URL persistence.** Moves live in `OwnershipGraphView` and vanish on
   reload. Siggie wants dragging permanent, so they should lift to `ExploreApp`
   and encode alongside `?sel=`/`?exp=`. Note coordinates are layout-dependent —
   a move saved against one selection may land oddly in another.

### dag-browser

Siggie's list, verbatim: *"writing on top of itself (or the rows are anyway)"* ·
*"needs horizontal scroll"* · *"needs panel resizing"* · *"maybe should allow
panel to be detached and moved"* · *"what happened to categories"*.

**Diagnosis for the first two:** the widget ships `.dbw-row { white-space:
nowrap }` with no overflow handling, so its own cross-reference text runs past
the panel edge and paints over neighbouring rows. `renderRow` truncates the
class NAME, but the xref markup belongs to the widget, so it cannot be fixed
there. `0c6cfdc` attempts a CSS-only fix (horizontal scroll on `.dbw-root`,
`width: max-content` on rows, xref notes clamped to 18ch) — **unverified
visually.** If it does not hold, the honest options are patching the widget
upstream (npm dep at `^0.2.0`; no local copy) or dropping its default row chrome.

**No horizontal scroll in the tree — MEASURED**, and re-verified 2026-08-28:
`selectionTree.css` puts `overflow-x: auto` on `.dbw-root`, but `ExploreApp.tsx`
wraps it in `<div className="flex-1 overflow-y-auto min-h-0">` — **that**
ancestor is sized to the fixed `w-96` panel, so it clips first and the inner
scroll container never has anything to scroll. Fix belongs on the ancestor — but
see the chip-strip work first; scroll may not be the answer.

**"What happened to categories" — a design question for Siggie, not a bug.** The
tree is built from `getContainmentNodes()`, i.e. the OWNERSHIP graph, which has 7
roots. It has **nothing to do with `ENTITY_CATEGORIES`**. Categories did not
break; they were never in the tree. Options: categories as an expanded TOP LAYER
above the ownership roots (Siggie's own earlier idea — they predicted *"a lot
more duplicates will appear, across categories"*); two separate trees; or keep
the flat list as the primary selector. The flat list is still behind the
`☰ flat list` / `⑃ tree` toggle, so this is comparable side by side right now.

**Panel resizing / detaching: NOT attempted.** Resizing is small; detaching is
not, and `dockview-poc` (an old branch, 153 behind) suggests this was explored
before — read it before designing anything.

### One-hop default — largely obsolete

⚠️ Superseded: automatic one-hop-up owners and the cap were removed. The
diagnosis is kept because it is *why* the automatic hop was never enough.

**Organization has no owners** (it is a DAG root) and **no un-flipped ownership
slots** — it owns 14 things, but every edge is stored on the other class
(`Observation.performed_by → Organization`). So one-hop-up finds nothing and
there are no rows to expand downward: a genuine dead end, while the tree shows
"14" beside it.

The warning still applies to any strip work: a second chip strip **changes box
height and therefore edge anchoring.** Check that edges still point at the right
rows on a box that has both strips.

---

## Code health

### Palettes that only half-exist

> *"What's the point of even using palettes if the color is hard-coded all
> around it anyway."*

`APP_CONFIG.elementTypes.type` reads `hex: RANGE_COLORS.dataType` — the palette
— and then eleven hand-picked Tailwind literals beside it (`bg-green-700`,
`text-green-700 dark:text-green-400`, …). Each element type's color exists
**twice**, in two forms that cannot be derived from one another, and only one is
the palette. Changing `RANGE_COLORS` moves the SVG hex and nothing else. That is
why the P1 swap needed a by-hand rewrite of two whole color blocks instead of an
edit to one array.

**The trap:** `ElementTypeMetadata.color` is shaped for Tailwind class strings,
and Tailwind v4 only emits classes it finds **literally** in the source, so the
strings cannot be built at runtime from a hex. Any fix must pick a lane:

- **Generate the CSS from the palette** — emit custom properties from
  `RANGE_COLORS`, have components read `var(--…)`. Kills the duplication
  outright; costs a pass over every consumer of `color.link` / `.headerBg` /
  `.badgeBg`.
- **Keep Tailwind, derive the hex from it** — cheaper, but leaves the palette
  named after ColorBrewer while actually being Tailwind's approximation of it.
- **Narrow what the config carries** — most of the eleven roles may not be
  needed. Count real usages before designing anything.

The duplication is now **load-bearing** in a way it was not before, since the
palettes document an intent the Tailwind half quietly does not honor.

### Dead code left by the relation bar

`buildRelationGroups` survives, feeding `countsOf` for `NodeVM`'s
`relatedCount`/`shownCount`. **Nothing renders those two fields any more** — the
bar computes its own counts — so this is a second layer of dead code inside a
live file. Removing it means touching `NodeVM`, both node-VM construction sites,
and `RelationGroupVM`/`RelationItemVM`. Deliberately not done in the same pass as
the UI change.

### `goTo`'s silent no-op

`HelpProvider.tsx`, in `goTo`: `const pos = positions[i]; if (!pos) return;`

`startTour()` calls `goTo(0)`. When `positions` is empty the call **does nothing
and says nothing** — no error, no warning, no retry when positions arrive.

**Not a live bug today.** `positions` comes from a STATIC markdown import, so it
is populated on the first render and no caller can lose the race.

**Why it is still worth fixing.** It is a trap sized for the next person who
calls `startTour()` from somewhere new. It cost real time on 2026-08-28: `?tour=1`
was not working, this looked like a satisfying explanation, and a deferral was
built for it before instrumentation showed the actual cause was URL timing. **A
silent failure that *looks* like the answer is worse than one that does not.**

**Loud is probably the right call** — a `console.warn` on the empty case. The
deferral version adds real state for a case that cannot currently happen, and
the complaint is the silence, not the behaviour. (It was written and reverted
the same day; it was never committed, so it would have to be written again.)

### Hand-curated config rot

Several config sets are curated by hand against the schema, and an upstream sync
can invalidate any of them **silently**. It has happened: the 2026-08-12 sync
added `Context` and `Activity`, which then appeared nowhere in the UI. The sync
is automated now (`.github/workflows/schema-sync.yml`), so this is a live risk on
every run.

| set | file | how a stale entry shows |
|---|---|---|
| `ENTITY_CATEGORIES[].classIds` | `config/entityCategories.ts` | class vanishes from the UI — **tested** |
| `ENTITY_CATEGORIES[].pins` | `config/entityCategories.ts` | an extra box in a content view — **invisible**; partly tested |
| `SUBCLASS_OF` | `config/entityCategories.ts` | wrong indentation — **tested** |
| `DEFAULT_PINS` | `config/entityCategories.ts` | first-visit canvas is wrong — **tested** |
| `SINGLE_VALUE_OWNER_TARGETS` (14), `ASSOCIATION_SLOTS` (2), `CARDINALITY_SPLIT_OWN_FWD` (2), `BACKWARD_DESPITE_MULTIVALUED` (1), `SKIP_SUBCLASS_EXPANSION` (1) | `models/containmentGraph.ts` | an edge points the wrong way — **invisible** |

Those five are complete as of 2026-09-05. The classifier was rewritten once and
the sets renamed with it, so **a set name in an older doc may not exist** — check
the file before hunting for one. The TypeScript is now the only copy; the two
Python prototypes that carried a divergent fork were deleted 2026-09-05.

**The one with teeth.** The `containmentGraph` override sets are keyed by SLOT
NAME, not `(class, slot)`. Every member happens to occur at exactly one class —
**luck, not design**, and exactly how `performed_by` (11 sites) did damage when
it sat in the old override list. **A sync check should assert each still has one
site. Not built.**

**What to do after a sync:** run the suite first (it catches the tested rows),
then re-read [TOURS_AND_CONTENT.md §1.1](TOURS_AND_CONTENT.md) for pins and
[OWNERSHIP_CLASSIFICATION.md](OWNERSHIP_CLASSIFICATION.md) for the override sets.
The untested rows need a **reading**, not a query — the criteria are editorial,
which is why they are hand-curated. **Ownership classification is Siggie's call,
not a mechanical one.**

---

## Docs

### `EXPLORE_VIZ.md` is ~20–25% stale

Audited claim-by-claim 2026-08-24. The doc's own rule is "where this document
and the code disagree, the code wins and the doc is the bug." Staleness is
**concentrated, not spread** — Architecture, Data layer, Renderer and Build order
are in good shape.

**Cluster 1 — the "Core visual-design conclusions" list is the worst section**,
and the most damaging, because it reads as settled design law in the present
indicative. 3 of 7 items are wrong:

- **Item 2** — "direction is encoded by vertical position (owners above
  members)". The default is LR; owners are to the **left**. (TB is a toggle.)
- **Item 3** — is-a as an "expandable stack (▸ 3 subclasses)". Ships as header
  chips `⊳ {parent}` / `▷ {n}`.
- **Item 5** — flipped edges get a "re-verbed label". **Never built.** No SVG
  text exists on the edge layer at all; the intent survives only as a comment in
  `ownershipSubgraph.ts`. What marks a flipped edge is the back-pointing
  arrowhead.
- **Item 1** (owner-side/member-side normalization) is CURRENT — it is the one
  `OWNERSHIP_CLASSIFICATION.md` builds Rule 2 on.

**The doc contradicts itself twice**: items 3 and 5 assert as fact what lines 230
and 232 correctly list as still-wanted. A reader who stops after the numbered
list comes away materially wrong.

**Cluster 2 — the owner cap 8→5 change was never propagated.** Wrong at lines 55
and 118. `DEFAULT_OWNER_CAP = 5`, locked by `ownershipSubgraph.test.ts`. Knock-on:
the doc's flagship BodySite example now demonstrates the **opposite** of what
ships — 6 > 5, so BodySite falls back to chips.

**Cluster 3 — vertical language survived a horizontal default.** The *algorithm*
is current (`computeSunkLayers`); only the orientation words are wrong. **Not
doc-only rot** — the same idiom is in the code's own comment, so a rename should
cover both. Line 205 ("owners sit *beside* their topmost member") survives LR and
is the better wording.

**Largest gap is omission:** node dragging + edge re-routing, merge-mode routing
probes, the example-cases pane, the ownership legend,
one-arrowhead-per-convergence and thinner strokes are absent entirely. Also
`exploreReset.test.ts` is actually `.tsx`, and five Explore-relevant tests are
unlisted.

**Fix the numbered list and the two `ownerCap` mentions first** — by the doc's
own rule those are the bugs.

### Tour authoring notes + draft preview

Four distinct needs, all currently served by HTML comments:

| Want | Sketched as | Renders? |
|---|---|---|
| Notes to self | `- **Note:** …` | never |
| Half-written copy | `- **Draft:** …` | yes, marked loudly as unfinished |
| Instructions to Claude | `- **ForClaude:** …` | never |
| A step written but not ready | `- **_Tour:** 4` | **shipped** |

**The parking half is already done** — prefixing any field with `_` drops an
entry out of the tour while keeping it as help.

**The interesting part is the draft preview**, and it is why this is a task
rather than three fields: viewing a tour *including* its parked steps and
unfinished `Draft:` text means a **second rendering mode**, not just a parser
change. Worth designing rather than bolting on.

Also parked: **multi-line for `Context:` / `Action:` / beat text** — deliberately
not done, *"1 for now; may need 2 soon"*. `extractBlockField` is generic, so each
is a one-line change.

Until then: HTML comments work, never render, and are what the S3a translation
already uses.

### CURIE → external definition links

**The goal:** every CURIE in the schema should link to its external source
definition. Raised because `transform_schema.py` looked like it expanded only
`id`/`identity`. **It doesn't** — that impression was wrong. `expand_uri()` has 8
call sites. It only *looks* id-only because of what the source schema contains:

| location | CURIEs present |
|---|---|
| enum `permissible_values.meaning` | **611** |
| attribute `slot_uri` | 71 — every one `schema:identifier` |
| class `class_uri` | 1 |
| `*_mappings`, `see_also` | **0** |

**So the real questions are not "which fields get expanded":**

1. The 611 expanded enum-value URLs are the bulk of the external references. Are
   they **reaching the UI as clickable links**, or only stored? That is the
   user-facing win.
2. Slots carry no external mappings at all. If slots should link out, the
   `*_mappings` fields must be populated **upstream** in `bdchm.yaml`; no
   transform change can invent them.
3. `expand_uri` does a live HTTP `HEAD` per prefix (`validate=True`) — network
   I/O in CI on every sync run. `sv.expand_curie` would drop the hand-rolled
   prefix walk; decide separately whether to keep validation, and if so cache it.

**Do not fold this into the induced-slots migration** — it is orthogonal.

### Example-cases pane — the last item

Items 3 and 4 landed in `a18d78b`; the legend un-nesting, Biggest fans, toolbar
explanations and the introductory-group cull all shipped 2026-09-04.

**Still open:** **reuse the DetailDrawer panel** rather than a floating box.
(First thought was draggable/resizable; Siggie revised to "just use the same
panel as the details drawer".) Bigger than it looks — the drawer is driven by
`detailId` and shows one class, so this means giving it a second mode.
`HelpPanel` is where that would land.

⚠️ The culled introductory cases' prose lives in
[TOURS_AND_CONTENT.md](TOURS_AND_CONTENT.md). **Do not re-add them to the pane.**

---

## Siggie's upcoming thoughts

1. A help or legend listing **every type of ownership pair**, the rules and
   overrides for assigning them, and the `entity.slot → entity` pairs for each.
   *(Partly shipped — the legend now covers toolbar buttons, colors and dashed
   edges. The by-reason breakdown is not built.)*
2. `OwnershipGraphView.tsx` ended up with everything that should be a constant
   hardcoded, instead of living somewhere like `appConfig.ts` — *"I want to be
   able to change the dim-other-while-something-is-highlighted opacity but don't
   know where to find it."*
