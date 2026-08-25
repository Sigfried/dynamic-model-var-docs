# Tasks

> **Active planning document** - Completed work archived to [docs/archive/tasks.md](docs/archive/tasks.md)
>
> **Development principles** - See [CLAUDE.md](CLAUDE.md) for architectural rules and workflow

---

## 🎯 Dates

- **Explorer demo: 2026-08-25**, a couple of hours after the session that
  shipped the induced-slot migration and the ownership rules. Work was
  prioritised around it; see the handoff for what was and wasn't done for it.
- **Target release 2026-07-30 passed and was never renegotiated.** Treat
  "before the release" language elsewhere in the docs as stale.
  **Needs Siggie: set a new target or drop it.**

---

## 🔁 HANDOFF — start here next session (updated 2026-08-25)

> **Everything below is on branch `induced-slots-and-ownership`, 5 commits,
> NOT pushed and NOT merged.** `main` is at `ef80fea`.

> **THE REAL GOAL NEXT SESSION: inheritance relationships.** Siggie,
> 2026-08-25: "what I really want, unrealistic as it may be, is to figure out
> and maybe get a POC for including inheritance relationships." Everything in
> NEXT UP below is tweaking what already exists; this is the one item that is a
> genuine design question, and it is what he actually wants worked on. Start by
> brainstorming the modeling question, not the code — the same instruction that
> governed the ownership rethink.
>
> **What already exists, verified 2026-08-25 — the data is present, and it is
> not unused, it is DELIBERATELY NOT DRAWN:**
> - 53 of 54 classes carry `parent` in the processed JSON; 37 of them are
>   direct children of `Entity`.
> - `containmentGraph` emits real `kind: 'subclass'` edges, with a
>   `SKIP_SUBCLASS_EXPANSION` set controlling which roots are excluded.
> - Those survive `ownershipSubgraph`'s filter (either endpoint in `core`) and
>   arrive as `type: 'isa'`.
> - **`OwnershipGraphView.tsx:131` then converts them into node metadata**
>   (`isaParents`) instead of routing them. That is the "is a Entity" line in
>   the detail drawer. So an is-a edge is currently a LABEL, not a line.
>
> The design question is therefore not "how do we get the data" but "what
> should an is-a relationship look like when 37 classes share one parent" —
> drawing that naively is a 37-way fan into `Entity`, which is worse than the
> convergence problems already open. Consider whether is-a belongs in this
> diagram at all, in a separate view, or as the layering it already implicitly
> is.

**[sg] NO -- we will not be showing inheritance from Entity because it's**
so crowded and not particularly meaningful. And don't assume that we will be
representing inheritance with edges; that will probably crowd too much and
make the graph unreadable. so we will brainstorm designs. Off the cuff:
- group displayed siblings together 
  - cascaded like img-1 in current session
  - or merged (probably want both options)
- if parent is displayed it should be first in cascade and set off a bit
- or for merged siblings, it could be merged with them
- maybe parent gets solid black type and each sibling's own slots
  get their own color
  - probably easier to handle than cascading
  - will need a way to indicate what all the displayed siblings are
    and which slot goes with which
  - maybe parent must always be displayed
- merged is definitely better. other ideas?

### ✅ SHIPPED — inheritance as adjacency (merged sibling boxes), 2026-08-25

Built to Siggie's "merged is definitely better" option, in 90 minutes before a
stakeholder demo. Branch `inheritance-merged-siblings`, off
`induced-slots-and-ownership`.

**The design.** Classes on canvas that share a parent collapse into ONE box
titled by the parent. Inside it:
- rows the PARENT declares carry no swatch and are set in bolder, darker type
  — absence of a swatch is the "shared by every sibling" signal;
- rows a SIBLING declares itself carry that sibling's colour swatch;
- a legend strip under the header lists the merged siblings in their colours
  (clickable → detail drawer), answering "which siblings, and which slot is
  whose" in place rather than with a line leaving the box.

`Entity` is excluded via `SKIP_SUBCLASS_EXPANSION` — the same reason it carries
no is-a edges. A box holding 37 classes is the crowding, relocated.

Toolbar toggle `⑃ siblings` (persisted, default ON). Off = today's behaviour.

**What actually merges** (measured against the live schema):

| parent | members | own-slot rows |
|---|---|---|
| Observation | 5 | MeasurementObservation 8, SdohObservation 1, three add none |
| QuestionnaireResponseValue | 5 | none — five boxes become one |
| ObservationSet | 3 | none |
| Exposure | 2 | Device/Drug; both declare `exposure_provenance` + `quantity`, so those rows carry TWO swatches |

**Where it lives.** `mergeSiblings()` is a pass over the ViewModel in
`OwnershipGraphView.tsx`, not a change to the subgraph. Nodes are addressed by
id and rows by slot name everywhere downstream (buildSpec ports, rowY, the
renderer), so a merged box is just another node and merged edges are edges with
rewritten endpoints. Layout and routing never learn this happened. Grouping
policy is in `src/explore/siblingMerge.ts`; tests in
`src/test/siblingMerge.test.ts` (6, against the live schema).

**Decisions taken as defaults, open to reversal:**
- A merged box's click opens the PARENT's detail; the legend chips open members.
- Rows are deduped by slot name (one anchor per name), so a slot two siblings
  declare independently is one row with two swatches, not two rows.
- The dismiss ✕ is suppressed on merged boxes — dismissing one means dismissing
  several classes, which is a different feature.
- Cascaded mode was NOT built. Siggie said merged is better; the toggle is
  merged/off, not merged/cascaded.

**Two pre-existing bugs fixed in passing**, both found only by `tsc -b`:
- `DataService.ts:924` tested `e.kind === 'ref'`, which is not a
  `ContainmentEdgeKind` — the guard never fired, so association edges WERE
  creating parent links in `getContainmentNodes`. Now `'association'`.
- `DataService.ts:795` had a dead `|| verdict === 'association'` arm.

**⚠️ Use `npm run typecheck` (= `tsc -b --noEmit`), never bare `npx tsc
--noEmit`.** docs/CLAUDE.md says so and this session proved it again: bare
`--noEmit` was green while `tsc -b` had four real errors. Same never-narrowing
trap the induced-slots handoff warned about.

### 📍 State: the pipeline migration and the ownership rules both SHIPPED

Four commits, in order:

| commit | what |
|---|---|
| `e8b8bd0` | Slot definitions moved onto classes via `SchemaView.induced_class`. gen-linkml and `bdchm.expanded.json` are **gone**; `transform_schema.py` reads `bdchm.yaml` directly through new `scripts/induced_schema.py`. |
| `721f98e` | Ownership classification rules implemented. `own-flip`→`own-bkwd`, `association` added, `OWNERSHIP_OVERRIDES` deleted. |
| `c0e265b` | Entity-ranged edges always `own-fwd` (they were half-reversing). |
| `a18d78b` | Example cases reordered simple→complex, edge-type cases added. |
| `3ee8965` | Association arrowheads fixed at both ends; example case 5 added. |

Verification at each step: 235 tests / 21 files green, `npx tsc --noEmit`
clean. **Counts measured against the live graph after the work:**

- 148 has-a + 2 association = **150 slot edges** (the predicted target)
- **12 Entity edges** (the predicted convergence)
- Groups: `own-bkwd/fk-inversion` 70, `own-fwd/value-object` 40,
  `own-fwd/multivalued` 35, `own-fwd/cardinality-split` 2, `association` 2,
  `own-bkwd/backward-multivalued` 1

### ⚖️ THE ONE DECISION WAITING ON SIGGIE

**Merge `own-bkwd` into `association`?** It moves **70 edges** — the largest
group — out of "ownership". They already layer identically, so this is
rendering and vocabulary only, not structure.

**Look at example cases 4 and 5 to decide.** Case 4 —
`SpecimenContainer` carries exactly one edge of each verdict — `additive`
(own-fwd), `contained_in` (own-bkwd), `container` (association) — so all three
are comparable on one small box. Case 5 adds the crowded version: **the schema
contains exactly TWO association edges** (`Specimen.related_document` and
`SpecimenStorageActivity.container`, verified 2026-08-25) and case 5 holds
both, so it is the only selection that can show associations competing for a
border at all.

**Merging the verdicts also dissolves 0b above**, since one merge point per
header side then needs only one head. Keeping them distinct means inventing a
second visual channel at that header to preserve a distinction nothing else in
the layout preserves — they share `flipped`, share the routing, and layer
identically.

### ▶️ NEXT UP (in Siggie's priority order)

0. ✅ **DONE — association arrowheads** (`3ee8965`). Two stacked bugs. The
   start head was reversed TWICE — by `orient="auto-start-reverse"` and again
   by a glyph drawn tip-at-x=0 — so they cancelled; `arrow-assoc-start` is
   deleted and one marker serves both ends. And even once correct it was
   invisible: node boxes are opaque divs stacked OVER the SVG layer, and
   `refX=0` puts the tip `ARROW_LEN` past the vertex, under the box.
   `trimSectionsEnd` only ever trimmed the END. Added `trimSectionsStart`,
   association edges only. **Watch for this class of bug again** — anything the
   SVG draws inside a box's rectangle is painted over, and it shows up only on
   hover over a dimmed (translucent) box.

0b. **OPEN — header-side merging has no machinery at all.** Flipped edges are
   excluded from merging at BOTH ends (`OwnershipGraphView.tsx:803`, and
   `target = flipped ? undefined`), and **associations are always
   `flipped: true`** (`containmentGraph.ts:267`) — same flag as `own-bkwd`. So
   `willMerge` is permanently false for associations and the `!willMerge` guard
   on `markerStart` is dead code. This never showed because own-bkwd drew no
   head at that end; associations now do, on every strand of a fan.
   **Siggie's own framing, which is the crux:** if RL edges merge into the
   header's vertical centre they become indistinguishable from associations
   merging into that same point — moot if all own-bkwd become associations.
   **So this is gated on the verdict decision below; do not build it first.**
   Currently mild: only 2 association edges exist in the entire schema.

1. **Too many entities displayed.** Siggie's direction: from a selected entity,
   default to **one hop in either direction**, with the ability to expand each
   way and to close boxes. Open question he raised: what to do with a closed
   box BETWEEN two displayed boxes — *for now, probably disallow it*.
   Worth knowing: the `owned by` chip row already lists owners without drawing
   them, which is arguably the right primitive — chips for the un-expanded hop,
   boxes for the expanded one.
   **The other half, observed 2026-08-25: there is no way to EXPAND.** With one
   class selected, the only route to a neighbour is reading the detail drawer's
   REFERENCED BY list and adding each class by hand. Organization shows 14
   entries there — all reachable, none reachable *from the diagram*. Expansion
   and pruning are the same feature and should be designed together.
2. **Fix the ownership legend.** Siggie asked for this but has not yet said
   what is wrong with it. **Ask before changing anything.** The older
   restructuring notes further down (un-nest from example cases, move BIGGEST
   FANS, shorten the fk-inversion text) may or may not be what he means.
3. **Everything displays and points where it should.** img-1 (Entity arrowheads)
   and the association arrowheads are both fixed; no reported breakage
   outstanding.
4. **Deferred, deliberately: why does Explore need a slot index at all?**
   Siggie raised it 2026-08-25 and chose not to chase it. Context is in the
   induced-slots DONE section below — the top-level `slots:` block is a derived
   index, and `Graph.ts:502` plus Kitchen Sink are what still key on it. Not a
   bug, just unexamined.

### 🚧 Gotchas that cost time this session — read before running anything

- **`npx vitest` needs node 22+.** The default `node` is v16 and fails with a
  `node:fs/promises` export error that looks like a broken test setup but is
  not. Use
  `export PATH="$HOME/.nvm/versions/node/v22.20.0/bin:$PATH"`.
- **Never run `npm run dev`.** Siggie keeps the app running himself.
- **`tsc` will NOT catch a stale union comparison.** When `'own-flip'` left the
  `OwnershipVerdict` union, every surviving `x === 'own-flip'` narrowed to
  `never` instead of erroring — so the typecheck stayed green while two live
  sites silently stopped matching (edge emission, and the legend's
  `flippedCount`). **Grep for the old literal; do not trust tsc for this.**
- **`console.log` is swallowed in vitest here.** To surface a value, assert it
  against a sentinel string and read the diff.

---

### ✅ DONE — slot storage moved onto class definitions (`e8b8bd0`, 2026-08-25)

`transform_schema.py` reads `bdchm.yaml` through `SchemaView`; gen-linkml and
`bdchm.expanded.json` are gone. Deleted `build_class_hierarchy`,
`get_defining_class`, and the three-pass `transform_slots`. `resolve_slot_ids`
survives but only decides what to CALL a slot in the derived flat index, not
what it means.

**Still true, and load-bearing:**

- The top-level `slots:` section is a **derived index**, not the source of
  truth, and carries a `_comment` field saying so. Dropping it entirely would
  break `Graph.ts:502` for all 432 refs → zero slot edges → the ownership
  diagram collapses. Kitchen Sink, `SlotCollection`, `getClassesUsingSlot` and
  `elementLookup` are all still keyed on slot ids; the index goes away only
  when those are refactored.
- `inherited_from` is computed in `induced_schema.defining_class`: walk
  `class_ancestors` and keep the **topmost** class that declares the attribute
  — inline in `attributes:` **or** by name in its `slots:` list. Missing the
  second half silently breaks every global slot. Matches the old output on
  432/432 refs.
- **`domain_of` is NOT the defining ancestor.** It lists every declaring class.
  Do not reach for it again.

**Three data changes shipped with it, all pre-existing bugs:**

- 28 slots gained `global` (a pass-ordering bug hid it from override-only
  slots), and a bogus "global slot not used by any class" warning is gone.
- `id-Person` / `id-Entity` had `required` **inverted**. LinkML derives
  `required` from `identifier: true`, so the inherited site is required and the
  raw declaration on Entity is not.
- `associated_person` dropped (337→336). Referenced by no class, so it rendered
  as a dead Kitchen Sink row with a used-by count of 0. **Flagged, not
  decided** — restore by unioning with `all_slots(attributes=False)` if the
  intent is that Kitchen Sink lists every declared slot.

### 🔗 OPEN — CURIE → external definition links (deferred, Siggie 2026-08-25)

**The goal:** every CURIE in the schema should link to its external source
definition. Raised because `transform_schema.py` looked like it expanded only
`id`/`identity`. **It doesn't** — that impression was wrong, and the real gap is
elsewhere. Measured against `bdchm.yaml`, 2026-08-25.

`expand_uri()` already has 8 call sites: `class_uri` (`:335`), `slot_uri`
(`:406`), enum `permissible_values.meaning` (`:492`), `reachable_from` nodes
(`:516`) and relationships (`:527`), type `uri` (`:589`), type `mappings`
(`:598`).

It only *looks* id-only because of what the source schema contains:

| location | CURIEs present |
|---|---|
| enum `permissible_values.meaning` | **611** |
| attribute `slot_uri` | 71 — every one is `schema:identifier` |
| class `class_uri` | 1 — `Entity` → `schema:Thing` |
| `exact_/close_/related_/narrow_/broad_mappings`, `see_also` | **0** |

16 prefixes declared: BAO, DUO, HP, ICD10CM, MMO, MONDO, OBA, OMOP, UBERON,
UOM, VBO, bdchm, linkml, ncbitaxon, rxnorm, schema.

**So the real questions are not "which fields get expanded":**

1. The 611 expanded enum-value URLs are the bulk of the external references.
   Are they reaching the UI as clickable links, or only stored? That is where
   the user-facing win is.
2. Slots carry no external mappings at all — only `schema:identifier`. If slots
   should link out to ontology terms, the `*_mappings` fields have to be
   populated **upstream** in bdchm.yaml; no transform change can invent them.
3. `expand_uri` does a live HTTP `HEAD` per prefix (`validate=True`). Under the
   schema-sync Action that is network I/O in CI on every run. `sv.expand_curie`
   would drop the hand-rolled prefix walk; decide separately whether to keep
   validation, and if so cache it rather than re-probing.

**Do not fold this into the induced-slots migration** — it is orthogonal to
where slot definitions are stored.

### ▶️ OPEN — the bare diagonal

One approach in a convergence arrives as a **straight diagonal with no steps**
while its neighbours step once or twice, cutting across other boxes. Reproduce:

```
?sel=BodySite~Condition~Consent~Demography~Exposure~Observation~Procedure
&exp=ImagingFile~ImagingStudy~MeasurementObservation~SpecimenCreationActivity
```

Siggie's reframing, which is the better question: *why does the second edge step
up twice then dive, when the others step once?* Adding `TimePoint → add all`
makes the diagonal disappear but introduces many crossings — so ELK appears to
trade one against the other by corridor crowding.

**Three guesses were made and all three were wrong.** Do not theorise from the
code. `?dbg=1` logs each convergence's routed approaches (point count, bend
count, diagonal flag, endpoints); start there.

#### ✅ Root cause found (2026-08-21) — Siggie's diagnosis, confirmed

**`bend` mode degenerates when there is no corner to bend from.**
`mergeDistFor(mode, pts)` returns, for `bend`, the length of the LAST ROUTED
SEGMENT. When ELK routes an approach as a single straight run — which happens
whenever the outermost fan lane lines up with the source row, i.e. to the
TOP approach of a large convergence — that "last segment" is the whole edge.
`mergeCut` then walks back past the source, `cut` lands at index 0, and the
entire path is replaced by one straight line from the source anchor to the
shared arrowhead base. That is the bare diagonal.

Verified numerically: a 2-point route 1020px long yields `mergeDist = 1020`,
`cut = 0`. `near`/`far` are immune because their distance is a fixed 40/120px,
so the cut always lands on the horizontal run near the node.

So `merge-near` is not "better here" in general — `bend` is simply undefined on
a corner-less route. The fix Siggie half-remembered (combine near with
from-last-corner) is well-founded, but as a **guard**, not a compromise: clamp
`bend` to `Math.min(lastSegment, nearDistance)`, or fall back to `near` when the
route has fewer than 3 points. **Not yet implemented** — Siggie chose to build
the comparison harness first.

### ✅ DONE — the comparison harness (2026-08-21)

"example cases" in the header opens a two-tab pane.

**Cases tab** — named selections grouped in `src/explore/exampleCases.ts`,
ordered simple→complex as of `a18d78b`, each with a note saying what to look at. Clicking one applies it to app state
IN PLACE, deliberately not as a navigation: a reload would drop the merge mode
(localStorage, read once at mount), which is the thing being compared.

**Ownership legend tab** — every class-ranged slot in the schema grouped by the
rule that classified it, plus the convergence/divergence rankings. Derived live
from `classifySlotEdgeExplained` (new; `classifySlotEdge` now delegates to it),
so it cannot drift from what is drawn — which matters because
`ASSOCIATION_SLOTS`/`SINGLE_VALUE_OWNER_TARGETS` are hand-curated and rot on
every schema sync. A test asserts the legend's pairs equal the graph's actual edges.

**The legend immediately earned its keep.** The case set had been built off the
convergence ranking, which hides FK hubs because flipped edges reverse
direction. The listing showed 43 pairs in one `own-flip / fk-inversion` group,
which is how these turned up (that group is now `own-bkwd / fk-inversion`, and
is 70 pairs after the 2026-08-25 rules):

- **Participant fans OUT to 22 targets (21 flipped)** — larger than any inbound
  convergence, including Quantity's 19.
- **Visit fans out to 19**, Organization to 11, both almost entirely flipped.
- Backward (`own-bkwd`) edges keep their attribute-row anchor and **must not
  merge**, so
  these are precisely the fans the merge code never touches, and therefore the
  ones nothing has ever been tuned against.

Real numbers now on record (slot-edges / distinct classes): converging —
Quantity 19/16, TimePoint 16/8, BodySite 6/6, Context 6/6. Diverging —
Participant 22, Visit 19, Organization 11, Specimen 8.

### 📄 OPEN — EXPLORE_VIZ.md is ~20–25% stale (audited 2026-08-24)

The doc's own rule is "where this document and the code disagree, the code wins
and the doc is the bug." Audited claim-by-claim against the code. Staleness is
**concentrated, not spread** — Architecture, Data layer, Renderer and Build
order are in good shape.

**Cluster 1 — the "Core visual-design conclusions" list (lines 31–76) is the
worst section**, and the most damaging, because it reads as settled design law
and is written in the present indicative. 3 of 7 items are wrong:

- **Item 2** — "direction is encoded by vertical position (owners above
  members)". The default is LR: `OwnershipGraphView.tsx:444-445` reads
  `'explore-nl-dir'` defaulting to `'RIGHT'`. Owners are to the *left*. (TB is
  a toggle, `:956-958`.)
- **Item 3** — is-a as an "expandable stack (▸ 3 subclasses)". Ships as header
  chips `⊳ {parent}` / `▷ {n.subclassCount}` (`:1171-1180`).
- **Item 5** — flipped edges get a "re-verbed label". **Never built.** No SVG
  text exists on the edge layer at all; the intent survives only as a comment
  at `ownershipSubgraph.ts:80-81`. What actually marks a flipped edge is the
  back-pointing arrowhead (`:1091` `arrow-own-back`).
- **Item 1** (owner-side/member-side normalization) is CURRENT — it is the one
  `OWNERSHIP_CLASSIFICATION.md` builds Rule 2 on.

**The doc contradicts itself twice**: items 3 and 5 assert as fact what lines
230 and 232 correctly list as still-wanted. A reader who stops after the
numbered list comes away materially wrong.

**Cluster 2 — the owner cap 8→5 change (2026-08-19) was never propagated.**
Wrong at line 55 and again at line 118. `DEFAULT_OWNER_CAP = 5`
(`ownershipSubgraph.ts:103`), locked by `ownershipSubgraph.test.ts:84`.
Knock-on: the doc's flagship BodySite example (lines 69–74, "six owners are the
content of the diagram; drawing them is the right default") now demonstrates
the **opposite** of what ships — 6 > 5, so BodySite falls back to chips, as the
test says outright.

**Cluster 3 — vertical language survived a horizontal default.** Lines 37–38
and 131–133 ("owners sink to one above their topmost owning child; leaf classes
dangle below"). The *algorithm* is current (`computeSunkLayers`,
`ownershipSubgraph.ts:176-195`); only the orientation words are wrong. **Note
this is not doc-only rot** — the same idiom is in the code's own comment
(`ownershipSubgraph.ts:168-175`), so a rename should probably cover both.
Interestingly line 205 says owners sit *beside* their topmost member, which
survives LR and is the better wording.

**Largest gap is omission, not contradiction.** Shipped 2026-08-19→21 and
absent from the doc entirely: node dragging + edge re-routing, merge-mode
routing probes, the example-cases pane, the ownership legend,
one-arrowhead-per-convergence, thinner strokes.

Also: `exploreReset.test.ts` is actually `.tsx`, and five Explore-relevant tests
are unlisted (`ownershipExpansion`, `ownershipLegend`, `paths`, `DetailDrawer`,
`SelectionTable`).

**Fix the numbered list and the two `ownerCap` mentions first** — by the doc's
own rule those are the bugs.

### ▶️ OPEN — connections are invisible until attributes are expanded

Siggie, 2026-08-21, with screenshots:

- Selecting **Participant** alone shows a box with no indication that 22 classes
  connect to it (21 flipped). The connections exist; nothing on the node hints
  at them.
- **Specimen** likewise gives no indication of its connections without expanding
  attributes.

There is an existing owners strip (`ownersStripHFor`, shown for classes with >5
hidden owners — Quantity, TimePoint, BodySite, Context) which is the obvious
mechanism to extend, but it currently covers only inbound owners and only above
a threshold. **Options were drafted and NOT chosen — Siggie dismissed the
question; do not pick one unilaterally.**

Note this interacts with the rethink above: what counts as a connection worth
advertising depends on what ownership means.

### ▶️ OPEN — example-cases pane needs restructuring

Siggie, 2026-08-21. **Items 3 and 4 are done as of `a18d78b`** — the cases were
reordered simple→complex, edge-type cases were added, and the rule text was
rewritten (`OWNERSHIP_RULE_TEXT` in `containmentGraph.ts`). What remains:

1. **Reuse the DetailDrawer panel** rather than the floating box, for
   consistency. (First thought was draggable/resizable; Siggie revised to
   "just use the same panel as the details drawer".)
2. **Un-nest the legend from cases.** The **Ownership legend is meant to be
   permanent**; example cases serve a different purpose and may not be. Using
   the legend to find routing cases was a *temporary* use, not its reason to
   exist. They should not be tabs of one pane.
3. **BIGGEST FANS belongs with example cases**, not the legend — it serves the
   case-finding purpose.

Still owed from upcoming-thoughts #1: toolbar buttons, colours, dashed edges.

> ⚠️ Siggie has asked for **"fix the ownership legend"** (2026-08-25) without
> saying what is wrong. It may or may not mean the items above. **Ask first.**

### [sg] upcoming thoughts
1. i need this for current experimentation but should probably be permanent
   feature: a help or legend listing every type of ownership pair, the rules
   and overrides for assigning them and the entity.slot-->entity pairs for
   each
   - should also explain all toolbar buttons, colors, dashed edges, etc.
2. i don't know why OwnershipGraphView.tsx ended up with everything that
   should be a constant hardcoded instead of living somewhere like appConfig.ts.
   - i want to be able to change the dim-other-while-something-is-hightlighted
     opacity but don't know where to find it
3. bring dag-browser-widget into Explorer 
   - change inheritance rail color to entity/inheritance/blue and ownnership
     color to amber
   - try populating it with the whole graph, all collapsed to start
   - try including categories as top layer (expanded) -- hmm...inheritance
     pairs should all fit within categories i think, but not ownership; so,
     with whole graph populated, a lot more duplicates will appear, across 
     categories
   - the idea is that, unlike in Focus (which needed changing anyway), there
     wouldn't be one pane for selection and another for dag-browser. everything
     becomes accessible through dag-browser including some kind of selection
     affordance

-

### ▶️ OPEN — dragging is unfinished

Works: drag, drop-in-place, edges re-routed, amber border, double-click to
release, drawer no longer pops open mid-drag.

Missing:
1. **No obstacle awareness.** `smoothStepPath` routes between two anchors and
   knows nothing about other nodes, so a moved node's edges cross boxes ELK
   would have routed around. **ELK cannot fix this** — see WORKLOG for why
   `noLayout`, `Fixed Layout`, INTERACTIVE, and libavoid are all dead ends.
   The real fix is an orthogonal obstacle router (A*/visibility graph), pure
   geometry, testable in `paths.ts`. **Not scoped — needs Siggie's go-ahead.**
2. **No URL persistence.** Moves live in `OwnershipGraphView` and vanish on
   reload. Siggie wants dragging permanent, so they should lift to
   `ExploreApp` and encode alongside `?sel=`/`?exp=`. Note coordinates are
   layout-dependent — a move saved against one selection may land oddly in
   another.

### ⚠️ Un-settled: the fan is visible

`ENTITY_FAN_GAP = 4` (`OwnershipGraphView.tsx:222`) was documented as "a routing
device, not meant to be seen" and marked settled. **Siggie pointed out that 4px
is plainly visible** — it renders as the staircase of nested arcs sweeping into
the arrowhead. The settled status rested on a false premise.

Two knobs, pulling opposite ways: a smaller gap (1–2px) nests less but risks
ELK collapsing the lanes back into overlapping runs (the bug the fan fixed);
a longer merge distance cuts before the arcs splay. Siggie has the code map
and may experiment. `ARROW_GAP` is currently **0** in the working tree —
Siggie's experiment, deliberately uncommitted.

### 🧹 Temporary scaffolding still in place

- **Four merge-mode buttons** (`⋙ ⋙⋙ ⌙ ≡`). Siggie picked **`bend`** (the ⌙,
  "merge at last corner") after seeing all four. Not yet hardcoded — the
  diagonal work may still want the comparison.
- **"example cases" pane.** The Cases tab is scaffolding for the routing work.
  The Ownership legend tab is NOT — it is upcoming-thoughts #1 delivered, and
  should stay. It still needs the rest of #1: toolbar buttons, colours, dashed
  edges.
- **`?dbg=1` routing log** — keep until the diagonal is understood.

### ✅ Answered this session

- **Which classes show owner chips** (>5 direct owners, per `classifySlotEdge`,
  which is what an earlier raw-slot count got wrong): **Quantity 16, TimePoint
  9, BodySite 6, Context 6.** Below the cap: 4 owners — the observation family
  and Substance; 3 — File, Specimen, QuestionnaireItem, the three
  `*ObservationSet`s; 2 — twelve classes, mostly Participant+Visit pairs; 1 —
  eleven, including TimePeriod (owner: Visit); 0 — thirteen, including
  Organization, Person, Assay, Document. `Participant`/`Visit`/`Organization`
  own heavily and are owned by almost nothing.
- **Curved edges: removed.** `smoothPath` survives in graph-core unused.
- **Stroke widths**: ownership 0.8 / 1.6 hover, references 0.67× those.

### ✅ Settled this session — don't redo

- **Terminology.** An edge joins **an attribute on one class** to **another
  class as a whole**. Call these the **attribute end** and the **entity end**.
  The old code words *host* / *storage side* (= attribute end) and *free* /
  *peer* (= entity end) confused Siggie and are being retired. In LR the
  attribute end is on the **right** border at its slot's row, the entity end on
  the **left** border of the target — swapped when ownership is flipped.
- **Only the attribute end names a slot.** The entity end never did; the peer
  class has no corresponding row. An earlier fan spilled below the header so
  arrows landed beside unrelated attribute rows and implied otherwise. The three
  stale "the row an edge lands on names the slot" claims were **deleted
  2026-08-19** and rewritten in attribute-end / entity-end terms.
- **The fan stays, but is NO LONGER "settled".** 4px, centred on the header, so
  ELK gives each approach its own lane. It was justified as invisible; Siggie
  observed on 2026-08-21 that it plainly is not (see the handoff). Reverting
  to a single shared port still brings back the bug where six owners of `BodySite`
  rendered as one edge between two unrelated owners.

### 🔁 Loops: answered with data (2026-08-19)

Probed the live schema (throwaway test, not kept). Ownership alone (`has-a`;
133 edges then, 148 after the 2026-08-25 rules) is **acyclic apart from 5
self-loops** — `TimePoint.index_time_point`,
`File.derived_from`, `Specimen.parent_specimen`, `ResearchStudy.part_of`,
`SpecimenContainer.parent_container`. The layered DAG's assumption holds.

**One genuine multi-node cycle exists**, but only once reference edges join in:
`Specimen --storage_activity--> SpecimenStorageActivity --container-->
SpecimenContainer --contained_in (has-a)--> Specimen`. As of the 2026-08-25
rules that is one association (`container`) plus two ownership edges. Siggie's call: **self-loop markers only; document this cycle as
known and deliberately unhandled** — a self-loop badge won't cover it, and a
3-node cycle drawn across layers is what a user would actually notice as odd.

(A third apparent cycle, `File → ImagingFile --derived_from--> File`, is an
artifact of mixing is-a into the traversal — `ImagingFile` inherits
`derived_from`. Not real; noted so nobody "fixes" it.)

> ⚠️ **Re-verify the cycle check.** This result predates the Entity-forward
> decision, and Entity now has 12 live inbound edges — exactly the shape that
> could introduce a new cycle. Not yet re-run.

### ⚠️ Tooling gotcha that cost this session real time

`grep` in the non-interactive shell is shadowed by a **shell function** (from
Claude Code's own setup, not Siggie's dotfiles — it is invisible in an
interactive shell, where `which grep` shows only a normal `--color=auto` alias).
It execs the `claude` binary as `ugrep` with `-I --ignore-files`; **this ugrep
build rejects both flags and exits non-zero printing nothing**, which is
indistinguishable from "no matches found".

**Use `command grep`.** Several searches this session returned false negatives,
including one that led to a wrong claim to Siggie about colours not being
config-driven. Also note zsh eats unquoted `--include=*.ts` — quote the globs.

### 🎨 Amber collision — decided, not yet built

Siggie: **keep amber = ownership**; move **variable counts** to brown/maroon.
Wants colours driven by config shared between Explore and the previous views
"if true, otherwise make this an upcoming task" — **it's the otherwise branch.**
`appConfig.ts` has an `elementTypes[].color` config, but it is keyed by element
*type* (class=blue, enum=purple…) and has no notion of "amber = ownership". All
amber is hardcoded Tailwind:

- **variable counts** (→ brown/maroon): `SelectionTable.tsx:71,113`,
  `EntityTable.tsx:79,161`, `SlotDrilldown.tsx:111` (Variables tab)
- **ownership** (stays amber): `OwnershipGraphView.tsx`
- **pin star** — a *third* amber meaning, `EntityTable.tsx:138,140`. Surfaced
  after Siggie's decision, so it is undecided; fold it into the semantic layer
  but **don't recolour it without asking.**

Plan: add a semantic colour layer to `appConfig.ts` (`ownership` / `variables` /
`pinned`) and point both apps at it, rather than sprinkling maroon in 5 places.

### 📋 Rest of the round Siggie listed (not started)

Ordered as given: edge improvements (**cardinality markers at endpoints** +
**label/title text on links**, re-verbed for flipped — *not* curved retuning),
self-loop markers, **drawer section headers** (10px gray uppercase, too
recessive), **cross-view state preservation** (Explore already URL-encodes
state; mostly a matter of nav links carrying the query string), amber, and then
a **real docs cleanup** — leave only current state / actual plans, moving
previous-view plans to `docs/old` or `docs/previous_views` linked from the
appropriate places. Siggie also wants to **discuss the remaining Known-imperfect
items** (curved edges, chip-strip height estimate, expand-on-demand
discoverability, no-expand-downward) *after* the buildable work.

### 📌 Older context (pre-edge session)

**is-a side-stacks** (EXPLORE_VIZ.md step 3 remainder) were the previously
agreed next piece, deferred behind the edge work. Inheritance renders as header
chips ⊳/▷ and little else; the spec wants an expandable subclass stack on the
parent node. **Note every class is `is_a: Entity`**, so naive rendering adds
noise.

- **Step 5 polish** — selection-change animation, self-loop badges.

### 🐛 Fixed this session (2026-08-19)

- **Crash on uncheck.** Select Person + Participant, uncheck Participant →
  `Routed edge edge-80 missing from view model`. ELK layout is async while the
  view model is a sync `useMemo`, so React rendered fresh nodes against the
  previous spec's routed edges. `useGraphLayout` now stores each result with
  the spec it came from and returns null unless they match. The throw was kept
  (it is a real invariant) and made unreachable instead of softened.
- **Pan did not work at all.** `useZoomPan` relied entirely on native
  scrollbars, but fit-to-view clamps content to fit, leaving nothing to
  scroll. Added drag-to-pan; nodes/toolbar carry `data-pan-ignore`.
- **Fit-to-view is now the default** until the user takes manual zoom control.
- **Title-click reset** — parity with the previous app; clears selection,
  expansions, drawer, and re-opens the table.
- **Path-to-root blowup.** Selecting one class could draw most of the schema
  (`Quantity`: 29 of 53 classes, 87 edges). Now one-hop direct owners, capped
  at 8; transitive is opt-in via `⇱ roots` / `?roots=1`. Full reasoning in
  EXPLORE_VIZ.md §6 — including the intermediate chips-only design that was
  also wrong.
- **Phantom edge** between Condition and MeasurementObservation: a routing
  artifact, not missing data. All incoming edges shared one `::hdr:in` port;
  each edge now gets its own fanned port.
- **Empty node box.** `BodySite` (all-scalar attributes) rendered as an empty
  box whose only content was a "+3 more attributes" collapser. Auto-expands now.
- **`Activity` misclassification** — adjudicated and merged; see
  OWNERSHIP_CLASSIFICATION.md.

### ⚠️ Known-imperfect, not yet addressed

- **Chip-strip height is estimated** from label lengths (ELK needs a height
  before the browser wraps). Rounded up, so a wide set leaves blank px rather
  than clipping — but the estimate could be wrong for unusual names.
- **Amber collision**: variable counts, ownership dots, AND owner chips are all
  amber. Flagged by Siggie; unresolved. Owner chips arguably *should* be amber
  (they are ownership), which makes the count badges the thing to move.
- **Drawer section headers** ("Referenced by", "Attributes") are 10px gray
  uppercase — too recessive to show panel structure.
- **Cross-view state preservation** — navigating to the previous app and back
  loses context. Explore already URL-encodes its state, so this is mostly a
  matter of nav links carrying the query string.
- **Expand-on-demand discoverability** — a dimmed row gives no signal that it
  is clickable, and expandable rows often hide inside "+N more attributes".
- **No expand downward** — chips and rows only reach owners/ranges, never
  "what does this class own".

### ⚖️ Needs Siggie's decision

- **Owner cap is 5** (`DEFAULT_OWNER_CAP`, lowered from 8 on 2026-08-19). Four
  classes exceed it and show chips: Quantity 16, TimePoint 9, BodySite 6,
  Context 6. Still never explicitly ratified.
- **Chips are one-way** — a chip adds an owner and vanishes; there is no way to
  remove one from the strip. Siggie raised this and had no preference among the
  options offered (persistent toggling chips / removal via the node's ×). Open.
- **Category placement of `Context` / `Activity`** — parked in `observation`
  beside `Quantity`; trivial to move.
- **EXPLORE_VIZ.md language** — Siggie: "a lot of the language doesn't make
  sense to me." Terms like sunk layers, storage direction, own-flip are doing
  real work but were written for their author. A rewrite pass is wanted, **as a
  conversation, not a solo edit.** (`own-flip` is now `own-bkwd`, but the
  language complaint stands.)

### 📌 Also worth knowing

- **Node version**: the repo needs Node ≥18 (Vite 7). Siggie's interactive
  shell has v24 via nvm, but a non-interactive shell falls back to a system
  v16, where `npx vitest` dies at startup with
  `node:fs/promises does not provide an export named 'constants'`. Export the
  nvm bin path first. No `.nvmrc` yet — worth adding.
- **Use `npm run typecheck`** (`tsc -b --noEmit`), not bare `tsc --noEmit`;
  the latter is less strict and has hidden dozens of build-breaking errors
  before.
- **Playwright is still not installed**; the spec's probe rig was never built.
  Everything above the data layer is jsdom-tested only. Both the pan bug and
  the uncheck crash were invisible to the suite and found by looking at the page.
- The upstream variables sheet gained columns (`var_name`, `status`,
  `Ontology CURIE`, `OMOP Concept ID`, `Deprecated Codes`); loaded but **not
  yet surfaced in the UI**.
- `npm run lint` reports 22 pre-existing problems (test files,
  `popoutWindow.ts`), untouched and unrelated.

---

## 🧭 Current round (post-2026-06-11 feedback) — TOP PRIORITY

Team-facing plan: [STAKEHOLDER_QUESTIONS.md](../temp-but-share-for-now/STAKEHOLDER_QUESTIONS.md).
Read that first — it holds the audience reframing and the **open questions for the
team** (view architecture, audience, links, terminology). This section is the
implementation backlog for the four new priorities. Items lower in this file are
re-tagged **[FEEDS]** (supports this round), **[LATER]**, or **[PARKED]/[OBSOLETE]**.

> **Audience reframing:** much of the real audience is **researchers** — data users
> ("what's in here / what does this mean?") and study designers pre-harmonizing their
> own study with BDCHM ("where would my variable fit?") — not only modelers/LinkML
> people. The four priorities below bend toward them.

**Dependency note:** once the Variable Library is live, the variable-drilldown portion
of the Explorer can be simplified — no deep variable views needed inside it.

### Priority 1 — Configurable terminology (was subtask 8)

Default to general-audience terms; LinkML term on demand.
- *property* (slot), *value set* / *permissible values* (enum), *property type*
  (range), *entity* (class).
- A vocabulary **config toggle**: general user vs. LinkML/modeler (possibly a
  data-modeler middle setting). LinkML equivalents in tooltips + links to LinkML docs.
- Status: **partially built.** The vocabulary is centralized as code config in
  `src/config/appConfig.ts` (`VOCAB` per audience, `ACTIVE_VOCAB`, `defaultVocab`);
  components read it via `DataService.getConceptLabel()` / `getTypeLabel()` /
  `getSectionLabel()`, and badge abbreviations are vocab-driven. The `researcher`
  vocab is active; a `modeler` vocab is filled in but INACTIVE (`defaultVocab =
  'researcher'`), with unresolved-term notes in appConfig.ts. **Remaining:** the
  in-app UI **toggle** to switch vocab at runtime (lowest priority — the machinery
  is the hook, no UI yet), and LinkML tooltips/links.

### Priority 2 + 3 — NOW: subgraph-viz SPA (supersedes the Focus direction)

**Current phase (2026-07-13):** the subset-visualization goal is being rebuilt
as a **new SPA** (same repo, new Vite entry): Explorer-style selection table →
layered ownership DAG with expand-on-demand, renderer adapted from
icd11-playground's NodeLinkView. Full design + build order:
**[EXPLORE_VIZ.md](EXPLORE_VIZ.md)** (step 1 is the ownership-classification
review). Terminology going forward: say **ownership**, not "containment."

The Focus view below stays in place for stakeholder comparison; its remaining
items are re-tagged **[LATER]**.

#### Focus view (compact selector + subset visualization) — [LATER]

Priorities 2 ("compact Kitchen Sink + multi-select") and 3 ("subset
visualization") turned out to be **one feature** and are now built as a third
view, **Focus**. Full design/semantics: **[FOCUS_VIEW.md](FOCUS_VIEW.md)**.

Focus = the Kitchen Sink with minimal differences: category-grouped multi-select
left panel, a containment digraph widget (`dag-browser-widget`) below it, and
middle/right panels scoped to the selected entities. Selection drives everything.

**Shipped:**
- ✅ Containment foundation (`c76fdcf`): `src/models/containmentGraph.ts`
  (FK-inversion heuristic, ported from `scripts/extract_containment_tree.py`),
  `DataService.getContainmentGraph()` (live-derived `{nodes,edges}`),
  `getCategoryGroups()`, 10 property-based tests.
- ✅ Focus scaffold + category multi-select selector + containment widget +
  panel-scroll regression fix (`d9f4cc8`).

**Shipped (this round):**
- ✅ **Middle/right now reuse the Kitchen Sink rendering path, scoped to the
  subset.** Deleted the bespoke `getFocusPanelSections`/`getClassSummary`-based
  item building; middle = the `slot` section, right = the `class`/`enum`/`type`
  (Ent/PVS/DT) sections, each a flat list filtered to the selected classes'
  slots / range targets and rendered via the elements' own `getSectionItemData`.
  Filtering flattens via `getAllElements()` (deep subclasses included) with
  subset-accurate section counts. New DataService helpers `getFocusSubsetSections`
  + `subsetTargets`/`subsetSection` (graph `CLASS_SLOT`/`CLASS_RANGE` edges).
  Select/unselect no longer leaks into middle/right (inert click handlers until
  floating boxes land). **Deferred:** per-entity nesting in the right panel —
  range rows from different selected classes intermix within a section for now.

**Remaining (ordered) — all [LATER], superseded by EXPLORE_VIZ.md:**
1. **Per-entity grouping/nesting in the right panel** (deferred from the reuse
   work above) — group range rows under the selected entity they belong to.
   Revisit how to implement once the flat version has been demoed.
2. ~~**Restore inter-panel gutters** + **add `<LinkOverlay>`** to FocusView~~
   Shipped 2026-07-13 (gutters + working links; the duplicate-id LinkOverlay
   fixes benefit Kitchen Sink too). Known-imperfect: flex/gutter model, link
   anchors under the widget, hover highlighting unwired — left as-is.
3. **Extract `useFloatingBoxes` hook** from LayoutManager; consume in both
   LayoutManager (no behavior change) and FocusView → working detail/relationship
   boxes in Focus. Then wire the now-inert middle/right click handlers to it.
4. **Widget select/unselect** shared bidirectionally with the left selector.
5. **Widget "show all entities"** option (full graph, not just the subset).
6. **Resizable panels** (draggable edges; Kitchen Sink uses flex gutters — likely
   `react-resizable-panels`).
7. **Floating Cytoscape diagram** (summonable node-link view of the subset;
   promote `public/has-a-mockup.html`).
8. **URL persistence** of `selectedClassIds` (`?focus=...`).

Then: retire stale mockups (`has-a-mockup.html`, `containment-graph.json`,
`has-a-graph.json`, `extract_has_a_graph.py`) once the in-app diagram replaces
them — see [PARKED] below.

### Priority 4 — Help mode (port from icd11-playground)

DOM-driven contextual help: `data-help-id` attributes + markdown content file +
`?`-toggled mode. Source in `../icd11-playground/web/src`: `hooks/useHelpMode.ts`,
`components/HelpPopover.tsx`, `utils/parseHelpContent.ts`, `assets/help-content.md`.
- Status: **not started.** Low-pri open question: extract as a shared package?
  Default: copy in now, extract later.

### Supporting / housekeeping for the release

- **URL state encoding** — deep-linking + working browser back button. Current app
  encodes some state but the back button is reportedly buggy; investigate root cause.
  States to encode: expanded entity, drilldown tab (slots / vars), open inline card.
- **Release checklist** for 2026-07-30 (QA, deploy path, feedback loop).

### Done (shipped — kept for reference)

- ✅ Entity Explorer as default view (progressive disclosure).
- ✅ Categorized entity list (`entityCategories.ts`) + subclass indentation.
- ✅ Default pinning (Demography, Condition, MeasurementObservation) + localStorage.
- ✅ Inline slot drilldown (Slots/Variables tabs, inherited/overridden tags, range
  badges, recursive nested drilldown).
- ✅ Inline enum detail card (permissible values, "used by"). **[FEEDS]** still TODO:
  CURIE *labels + definitions*, not just identifiers.
- ✅ Inline class detail card (merged into SlotDrilldown).

---

## 🅿️ PARKED — Containment heuristic de-fragility (revisit after demo)

**No longer parked: the containment graph itself.** The FK-inversion heuristic is
ported to TypeScript and live (`src/models/containmentGraph.ts`,
`DataService.getContainmentGraph()`), driving the Focus containment widget. The
Python mockups/scripts are now the *legacy* version; the in-app graph derives live
from the loaded model so it can't drift.

**Still parked — making the heuristic less fragile.** The hand-curated sets rot
silently when the schema changes. As of 2026-08-25 they are
`SINGLE_VALUE_OWNER_TARGETS`, `ASSOCIATION_SLOTS`, `CARDINALITY_SPLIT_OWN_FWD`,
`BACKWARD_DESPITE_MULTIVALUED` and `SKIP_SUBCLASS_EXPANSION`
(`VALUE_OBJECTS`/`NO_FLIP_SLOTS`/`OWNERSHIP_OVERRIDES` were renamed or deleted;
`EXCLUDE_HAS_A_TARGETS` is gone entirely). Planned (after the demo
proves value): per-slot LinkML `annotations: { containment_direction: contains |
contained_by | ? }`, auto-generated from the current heuristic then human-reviewed
(Brian only touches new/ambiguous), plus a CI check that fails on un-annotated new
single-valued entity slots. `owns`/`owned_by` floated as broader vocab for the
`performed_by` family. See [FOCUS_VIEW.md](FOCUS_VIEW.md#containment-digraph-semantics-settled-enough-to-demo).

**Retire once the in-app Cytoscape diagram lands:** `public/has-a-mockup.html`,
`public/containment-graph.json`, `public/has-a-graph.json`, and the now-redundant
`scripts/extract_has_a_graph.py`. (`containment-tree-mockup.html` was superseded by
the `dag-browser-widget`.)

---

## 📋 Secondary backlog (supports the current round; not itself a priority)

> The ordered priorities for this round are in "Current round" up top. The items
> here are smaller polish/enablement tasks — tagged **[FEEDS]** where they directly
> support a current-round priority.

### Render markdown in schema fields  **[FEEDS]**
- e.g., `UnitOfMeasurementEnum.description` contains markdown but is rendered as plain
  text in detail views.
- Feeds the inline **enum detail card** (which still needs CURIE labels/definitions —
  see Done list up top).

### Slot names in class detail Slots table should be linked  **[FEEDS]**
- Should behave like other element refs (hover + click navigation).
- Feeds the inline **class detail card**.

### Incorporate Unused Schema Fields into UI
- Enum inheritance and other fields
    - LinkML enums use `inherits` field (not `is_a` like classes)
    - Currently dataLoader/Element ignores enum `inherits` and other fields
    - Need to audit EnumInput for all fields and surface in UI
- Check console for "Unexpected fields" warnings. Currently seeing:
  ```
    dataLoader.ts:97 Unexpected fields in processed JSON (not yet used in UI):
        dataLoader.ts:100   SlotInput: alias, comments, designates_type, domain_of, examples, from_schema, global, inlined, inlined_as_list, overrides, owner, unit, values_from
        dataLoader.ts:100   EnumInput: comments, include, inherits, parent, reachable_from, see_also
        dataLoader.ts:100   TypeInput: exact_mappings_urls
        dataLoader.ts:100   ClassInput: class_url
  ```
- Add to UI or document why ignored
- For each field:
  - Show me some examples and give me stats (e.g., x of y SlotInputs have alias. example1, example 2...)
  - I decide if we add / ignore / deal with later
  - For add and ignore, add to expected fields; make clear which are ignored
  - For add, document plans for incorporating 
#### Unused Schema Fields Workspace

check claude's work:

      SlotInput fields:
      - ✅ comments - shown under description as "Comments:"
      - ✅ examples - shown under description as "Examples: value1, value2..."
      - ✅ inlined / inlinedAsList - shown as properties when true
      - ✅ domain_of / owner - investigated and marked as IGNORE (domain_of misses inherited slots)

      EnumInput fields:
      - ✅ comments - shown under description
      - ✅ inherits - new section "Inherits Values From" with clickable enum links
      - ✅ reachable_from - new section "Reachable From (Dynamic Values)" with source ontology, nodes, etc.

      Still TODO (marked as LATER):
      - unit - ask team
      - include, parent, see_also for enums

      Files changed:
      - src/models/SchemaTypes.ts - added new field types
      - src/input_types.ts - added input field definitions
      - src/utils/dataLoader.ts - transform functions
      - src/models/Element.ts - SlotElement and EnumElement classes
      - docs/TASKS.md - updated workspace with completion status
##### SlotInput (180 total slots)

 | Field              | Count          | Decision                                                                     | Notes                                                                                                           |
 |--------------------|----------------|------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------|
 | `alias`            | 181/181 (100%) | **IGNORE** - all same as name (verified)                                      | Same as name (ex: `id`→`id`, `species`→`species`)                                                               |
 | `comments`         | 25/180 (14%)   | ✅ **DONE** - shown under description                                         | Array of strings. ex: `days_supply`="The field should be left empty if..."                                      |
 | `designates_type`  | 1/180 (0.6%)   | **IGNORE** - note to revisit if generalizing app                             | Only `type` slot has this (=true)                                                                               |
 | `domain_of`        | 180/180 (100%) | **IGNORE** - incomplete (misses inherited slots), keep computed "Used By"    | Array of class names that use this slot. ex: `id`→`['Entity', 'Person', ...]`                                   |
 | `examples`         | 16/180 (9%)    | ✅ **DONE** - shown under description                                         | Array of {value} objects. ex: `specimen_type`=[{value:'Fresh Specimen'},...]                                    |
 | `from_schema`      | 180/180 (100%) | **IGNORE** - always same value                                               | Always `https://w3id.org/bdchm` - schema URL                                                                    |
 | `global`           | 7/181 (4%)     | **ALREADY USED** - just missing from EXPECTED_SLOT_FIELDS                     | Boolean. Slots: id, identity, associated_participant, entries, derived_product, value, member_of_research_study |
 | `inlined`          | 1/180 (0.6%)   | ✅ **DONE** - shown as property when true                                     | Only `entries` slot (=true)                                                                                     |
 | `inlined_as_list`  | 4/180 (2%)     | ✅ **DONE** - shown as property when true                                     | parent_specimen, derived_product, duration, +1                                                                  |
 | `overrides`        | 10/181 (6%)    | **ALREADY USED** - just missing from EXPECTED_SLOT_FIELDS                     | String (slot name being overridden). ex: `value`→`value` (10 different `value` slots)                           |
 | `owner`            | 180/180 (100%) | **IGNORE** - arbitrary (first domain_of class), not useful                   | Class that defines this slot. ex: `id`→`Entity`, `species`→`Person`                                             |
 | `unit`             | 12/180 (7%)    | **LATER** - need to ask team about it                                        | Object with ucum_code. ex: `age_at_death`={ucum_code:'d'}                                                       |
 | `values_from`      | 0/181 (0%)     | **GONE** in new data - removed from schema                                    | Was: Array of enum references                                                                                   |

- **inlined/inlined_as_list**: [LinkML docs](https://linkml.io/linkml/schemas/inlining.html) - info for devs writing ingestion code
- **domain_of**: Investigated - misses inherited slots (e.g., CauseOfDeath←Entity.id) and overrides. Computed "Used By Classes" is more complete.
- **owner**: Just first domain_of class - not meaningful. Already ignored in EXPECTED_SLOT_FIELDS.
  

##### EnumInput (41 total enums)

 | Field            | Count      | Decision                                                                                                                              | Notes                                                                                                          |
 |------------------|------------|---------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------|
 | `comments`       | 3/41 (7%)  | ✅ **DONE** - shown under description                                                                                                  | Array. ex: DrugExposureProvenanceEnum="Taken from OMOP Drug Type values..."                                    |
 | `include`        | 1/41 (2%)  | **LATER** - complex structure for including other enum values                                                                         | Complex structure for including other enum values                                                              |
 | `inherits`       | 3/41 (7%)  | ✅ **DONE** - shown as "Inherits Values From" section with clickable links                                                             | Array of parent enum names. ex: ConditionConceptEnum→['MondoHumanDiseaseEnum', 'HpoPhenotypicAbnormalityEnum'] |
 | `parent`         | 1/41 (2%)  | **LATER** - single parent (different from inherits)                                                                                   | Single parent string. ex: HistoricalStatusEnum→StatusEnum                                                      |
 | `reachable_from` | 9/41 (22%) | ✅ **DONE** - shown as "Reachable From (Dynamic Values)" section                                                                       | Complex: {source_ontology, include_self, source_nodes, ...}. Defines dynamic enum values from ontology         |
 | `see_also`       | 2/41 (5%)  | **LATER** - array of reference URLs                                                                                                   | Array of URLs. ex: DrugExposureConceptEnum→['https://bioregistry.io/registry/rxnorm', ...]                     |

##### TypeInput (7 total types)

 | Field                 | Count     | Decision                        | Notes                                                  |
 |-----------------------|-----------|---------------------------------|--------------------------------------------------------|
 | `exact_mappings_urls` | 5/7 (71%) | **ALREADY USED** - expanded from `exact_mappings` CURIEs, just missing from expected | Array of URLs. ex: `string`→['http://schema.org/Text'] |

##### ClassInput (51 total classes)

 | Field       | Count     | Decision                                                                                     | Notes                                             |
 |-------------|-----------|----------------------------------------------------------------------------------------------|---------------------------------------------------|
 | `class_url` | 1/51 (2%) | **Found**: comes from `class_uri: schema:Thing` in YAML, expanded by transform_schema | URL string. Only Entity→'http://schema.org/Thing' |

---
### ⚠️ WIP: Class-specific slot definitions (Dec 15, 2025) - INCOMPLETE

**Problem reported**: DrugExposure's `quantity` slot showed Procedure's description ("The quantity of procedures ordered or administered.") instead of the drug-specific description.

**Root cause**: When multiple classes define the same slot name with different descriptions (e.g., Procedure, DrugExposure, DeviceExposure all define `quantity`), transform_schema.py was using the first definition and ignoring the rest.

**Instructions given**:
1. User showed screenshot of wrong description
2. Asked to fix so DrugExposure shows its own quantity description
3. Suggested adding `name` field to slot references in bdchm.processed.json to simplify UI code

**Changes attempted** (NOT WORKING - still shows wrong names in UI):
1. `scripts/transform_schema.py`:
   - Added `find_conflicting_slot_definitions()` to detect slots with different definitions across classes
   - Modified `transform_classes()` to create class-specific slot IDs (e.g., `quantity-DrugExposure`)
   - Modified `transform_slots()` to create class-specific slot instances
   - Added `name` field to slot references when ID differs from display name

2. `src/models/SchemaTypes.ts`:
   - Added `name?: string` to SlotReference interface

3. `src/models/Element.ts`:
   - Updated ClassElement.getDetailData() to use `slotRef.name || slot.name` for display

4. `src/components/DetailContent.tsx`:
   - Added `renderMarkdown()` function for table cell content
   - Updated `renderCell()` to render markdown in all string cells

5. `public/source_data/HM/bdchm.processed.json`:
   - Regenerated with class-specific slots

**Status**: UI still shows `quantity-DrugExposure` instead of `quantity`. The `slotRef.name` change is not being picked up. Needs debugging - possibly the dataLoader transform is not reading the `name` field from slot references.

**Second instance found 2026-08-21 — `focus` shows the wrong cardinality.** Same
root cause, different symptom: it's not just descriptions that collapse, it's
*properties that change the meaning of the edge.*

`focus` has no top-level slot definition. It is declared as an `attributes`
entry on three classes, and the other 8 sites inherit via `is_a`:

| declared on | multivalued | inherited by |
|---|---|---|
| `Document.focus` | No | — |
| `Observation.focus` | No | DimensionalObservation, MeasurementObservation, SdohObservation, SpecimenQualityObservation, SpecimenQuantityObservation |
| `ObservationSet.focus` | **Yes** (+ `inlined_as_list`) | DimensionalObservationSet, MeasurementObservationSet, SdohObservationSet |

The Kitchen Sink detail panel shows **one** `focus` element with
"Multivalued: No" and all 11 classes pooled under "Used By Entities (11)" — so
the 4 multivalued sites (ObservationSet + its 3 Set subclasses) are silently
misreported as single-valued.

Mechanism: `SlotElement.getUsedByClasses()` (`src/models/Element.ts`) calls
`getClassesUsingSlot(globalGraph, this.name)` — **keyed by slot name only**. The
rendering in `getDetailData()` is fine; it faithfully prints whatever
`this.multivalued` holds, which came from whichever declaration won ingestion.

Why this one matters more than the `quantity` description bug: cardinality is
the input to ownership classification (see
[OWNERSHIP_CLASSIFICATION.md](OWNERSHIP_CLASSIFICATION.md) — multivalued vs
single-valued decides edge direction). A viewer reading this panel would draw
the wrong conclusion about 4 edges.

Not a quick fix — needs attribute elements keyed by `class.slot`, or a
"varies by class" treatment in the Used By table. Both ripple through
everything that resolves attributes by name. **Left as a known bug 2026-08-21**
(Siggie: fix if super-easy, otherwise defer — it isn't).

---
### LinkOverlay fixes  **[LATER — gated on an open question]**
- Edge labels: show on hover; tooltip display needs improvement.
- **Gated on open question B** in [STAKEHOLDER_QUESTIONS.md](../temp-but-share-for-now/STAKEHOLDER_QUESTIONS.md)
  ("are the connecting links worth their screen real estate?"). Inline entity-summary
  cards + "Referenced by" lists may replace most of what links communicate; links may
  become an optional overlay / "Relationships" tab. Don't invest in link polish until
  this resolves.

---

## 📚 Larger Refactoring Tasks

### Abstract Tree Rendering System
- Extract tree rendering and expansion logic from Element
- Enables consistent tree UX across Elements panel and info boxes
- See [detailed plan](#abstract-tree) below

### Reduce Element subclass code
- Most behavior should move to graph queries
- Element classes become thinner wrappers around graph data
- **Blocked by**: Abstract Tree system
- See [detailed plan](#reduce-element-subclass-code-details) below

### Grouped Slots Panel  **[OBSOLETE]**
- Was: display slots grouped by Global + per-class sections, with inheritance origin.
- **Superseded** — the Explorer shipped; slot grouping now lives in the inline
  per-entity drilldown (inherited / defined-here / overridden tags). Remove unless a
  Kitchen-Sink-specific need resurfaces.

---

## 🔧 Medium Priority

### Overhaul Badge Display System  **[MOSTLY OBSOLETE]**
- Was: show multiple counts per element with clarifying labels/tooltips.
- The Explorer entity table shipped with separate Props / Cls / Enm / Typ / Vars
  columns, which serves most of this. Any remaining gap is just badge tooltips.

### Detail Panel Enhancements
- Show reachable_from info for enums  *(note: reachable_from already shown in enum
  detail card per the unused-fields workspace — confirm and close if done)*
- Show inheritance
- Slot order: Inherited slots at top

### ~~Change "attribute" to "slot" terminology~~  **[OBSOLETE — REVERSED]**
- ⚠️ This is now **backwards** relative to Priority 1 (configurable terminology),
  which moves *away* from "slot" toward general-audience "property." Do not act on
  this. The codebase-internal naming cleanup ("attribute" vs "slot") is a separate,
  low-value concern from the user-facing vocabulary.

### Condition/DrugExposure Variable Display
- Show message that these are handled as records, not specific variables

---

## 🔮 Low Priority / Future Ideas

### Search and Filter
- Search: Important for exploring large schemas
- Filtering: Grouping provides a lot already

### LayoutManager rename
- No longer about "whitespace monitoring" - it's now MainLayout/AppLayout
- Consider renaming to better reflect current purpose

### Animation library
- Smooth animations for various interactions

### Initial render performance
- Chrome warning: `requestAnimationFrame handler took 75ms`
- Likely from element tree or link overlay calculations on page load

### Viewport culling for links
- Don't show links when both endpoints off screen

### Responsive panel widths
- Currently fixed: MAX_PANEL_WIDTH=450px, EMPTY_PANEL_WIDTH=180px

### Relationship Info Box - Keyboard navigation

### Neighborhood Zoom + Feature Parity with Official Docs
- See archived REFACTOR_PLAN for full details

---

## 📝 Detailed Plans

<a id="abstract-tree"></a>
### Abstract Tree Rendering System - Details

**Goal**: Extract tree rendering and expansion logic from Element into reusable abstractions.

**Current state**:
- Element class has tree capabilities (parent, children, traverse, ancestorList)
- Expansion state managed by useExpansionState hook
- Tree rendering handled in each component

**Proposed abstraction**:
- Create parent class or mixin with tree capabilities
- Element becomes a child of this abstraction
- Info box data structures as tree nodes
- Shared rendering components/hooks

[sg] i'm not sure when this was written, but it's not how i was thinking about
     it. the abstract tree is for rendering -- it's in the UI so it probably
     shouldn't be (closely) tied to Element. need to discuss before implementing

**Key insight**: All presentation data should be tree-shaped.

**Methods to extract from Element:**
- `toRenderableItems()` - tree → flat list with expansion
- `toSectionItems()` - tree → SectionItemData list
- `getSectionItemData()` - single element → SectionItemData
- `ancestorList()` - walk up parent chain
- `traverse()` - depth-first traversal

<a id="reduce-element-subclass-code-details"></a>
### Reduce Element Subclass Code - Details

**Implementation Plan:**
1. Simplify `getDetailData()` via tree abstraction (BLOCKED: needs Abstract Tree)
2. Move tree methods to Abstract Tree system
3. Consolidate flat collections (Enum, Type, Slot)
4. Simplify Element subclass constructors
5. Graph as primary for relationship queries (partially done)
6. Fix remaining "DTO" terminology in codebase

**Target state:**
- Element subclasses: ~30-50 lines each
- Presentation logic: components layer
- Tree logic: Abstract Tree system
- Relationship queries: Graph module

---

## 🧹 Documentation & Technical Debt

### Implement devError() utility
- Throws in development, logs quietly in production
- Replace silent `return null` patterns

