# EXPLORE_VIZ.md — Subgraph-viz SPA (design spec)

[sg] this is stale and overly verbose

> **Status**: Design approved 2026-07-13; **built and running** — this is the
> default app (`index.html`). Build steps 1, 2, 4 done; step 5 outstanding.
> Step 3's is-a treatment shipped 2026-08-25 as **merged sibling boxes**, NOT
> the side-stack this document originally specified — see §3 below. Where this
> document and the code disagree, the code wins and the doc is the bug — the
> content policy below (§6) has already been rewritten once for that reason.
>
> Supersedes parts of [FOCUS_VIEW.md](FOCUS_VIEW.md) (the three-panel Focus
> layout and its LinkOverlay work continue to exist but are no longer the
> primary direction).
>
> Companion artifact: visual survey of has-a/is-a techniques rendered on a
> BDCHM subset — https://claude.ai/code/artifact/ab245ee1-eca7-4efe-9c46-65b5d2f6ee6a

---

## Motivation

The three existing views (Explorer, Kitchen Sink, Focus) show entity/
attribute/range relationships several ways, none clear alone and confusing in
combination. The LinkML-generated docs are easier to understand because each
page is one focal class with a small UML-ish diagram — but they can't show
many classes at once. This experiment tests whether a **selection-driven
subgraph visualization** can be as easy to read as the LinkML docs while
showing N selected entities, and whether it obviates the Kitchen Sink's
columns-and-links model entirely.

Terminology: we say **ownership** (has-a), not "containment," from here on.

## Core visual-design conclusions (from the technique survey)

1. **Ownership storage direction must be normalized before drawing.** The
   schema states "X belongs to Y" both ways (`ObservationSet.observations`
   is stored owner-side; `Observation.associated_participant` member-side).
   The FK-flip heuristic already normalizes; the viz renders its verdict.
2. **Direction is encoded by vertical position (in TB, horizontal in LR)** (owners above members), not
   by arrowheads alone. Layered DAG: poly-parent nodes get multiple in-edges;
   no node duplication — this eliminates the "★ also under" problem, which
   is intrinsic to nesting/outline techniques, not a widget bug.
3. **is-a never shares the ownership plane — it is ADJACENCY, not a line.**
   *(Revised 2026-08-25. The original spec here was an expandable side-stack
   attached to the parent node, "▸ 3 subclasses". That was never built; the
   shipped answer is different and better-motivated, so the spec is updated
   rather than left aspirational.)*

   Classes on canvas that share a parent collapse into **one box titled by
   that parent**. Inside it: the parent's rows first, in bold dark type and
   unmarked, because they are shared by every child and absence-of-marking is
   the quiet signal for the common case; then one **coloured header per child**
   followed by the rows that child declares, in the child's colour. Edges
   leaving a child's rows are drawn in that child's colour.

   Why not edges: 37 classes are direct children of `Entity` alone, so drawing
   is-a naively is a 37-way fan — worse than the convergence problems already
   open. `Entity` is excluded as a merge parent via `SKIP_SUBCLASS_EXPANSION`
   for exactly that reason; a box holding 37 classes is the same crowding,
   relocated.

   Merging is **unconditional**: a class with a mergeable parent merges even
   when it is the only child on canvas. Otherwise a box's anatomy would depend
   on what else happened to be selected.

   An inherited slot belongs to the parent and carries ONE edge for the box. A
   child that **redefines** it (`slot_usage` narrowing a range) keeps its own
   row and its own edge — QuestionnaireResponseValue's five children each
   narrow `value` to a different type, which is the entire reason those classes
   exist. Rows are therefore keyed by (declaring class, slot), not by name.

   Merged boxes show every row; the "+N more" collapse applies only to ordinary
   boxes. Toggleable in the toolbar (`⑃ siblings`); off restores the is-a chips.

4. [superseded] **Relation channels**: ownership = amber solid, drawn normalized;
   references = gray dashed, drawn in FK direction; is-a = the merged box.
5. [superseded] **Label convention**: an ownership edge drawn *flipped* from its storage
   direction gets a re-verbed label ("has members — via
   `member_of_research_study`"), never the bare slot name pointing the wrong
   way. Unflipped edges and references keep plain slot-name labels.
6. **Content policy** — *revised 2026-08-19; the original spec is recorded at
   the end of this list because the revision is the interesting part.*
   The diagram shows the selected entities, edges among them, and each
   selected entity's **direct owners** (one hop, drawn as dimmed context),
   capped at 8 per node. Everything else arrives by **expand-on-demand**:
   clicking a dimmed attribute row, or an owner chip, pulls that class in,
   dismissible via ✕.

   The original policy was *transitive* paths-to-root. It was measured against
   the live schema and abandoned: ancestors fan OUT rather than up a spine,
   because a value object is owned by everything that stores one and each of
   those owners drags in its own path to root. Selecting `BodySite` drew 15
   context nodes / 32 edges; `Quantity` drew 29 of the schema's 53 classes
   with 87 edges — from one checkbox. It also swamped expand-on-demand, which
   assumes a small canvas you grow deliberately. Transitive paths-to-root
   survives as an opt-in toggle (`⇱ roots`, `?roots=1`).

   A first revision summarized owners as clickable chips instead of drawing
   them. That was also wrong, and for an instructive reason: a value object's
   owners *are* the answer to "what is this" — `BodySite`'s six owners are the
   content of the diagram, not a footnote to expand one chip at a time.
   Drawing them is the right default; chips are the fallback above the cap
   (`Quantity`: 16 owners), where every owner is listed and clickable with an
   "add all", never silently truncated.
7. Self-loops (ResearchStudy `part_of` ResearchStudy) draw as a loop badge on
   the node, not a layer violation.

## Architecture

- **Vite entry point in this repo** — now the default (`index.html`, shell
  under `src/explore/`; promoted from `explore.html` 2026-08-12, which is
  kept as a redirect stub in `public/`). The previous app lives at
  `previous.html`, untouched except a header link each way. All existing
  architectural rules apply (components ↔ DataService only; fail loudly;
  vocab via `VOCAB` config — no hardcoded terms).
- Old views stay in place for stakeholder comparison; deletion is a separate
  later decision.

### Layout

Three regions:
- **Selection table** (left, collapsible): lean Explorer-style
  category-grouped entity table — checkboxes, in-category is-a nesting, no
  count columns and no per-category totals; `w-80`, sized to the longest class
  id. Built fresh against existing DataService accessors; does NOT
  import Explorer's pin/drilldown machinery.
  - The count-badge columns this spec originally asked for were **removed**
    2026-08-27. In a panel whose job is finding an entity by name, five
    always-on numeric columns cost ~140px of a 384px panel — enough to
    truncate `ResearchStudyCollection` — while three of the five read mostly
    `·`. The counts remain in the Explorer's entity table and the detail
    panel. If some subset earns its way back, `Attr` + `Ent` + `Var` were the
    populated ones; `PVS` and `DT` were the sparse ones.
  - The per-category class count went the same way for the same reason. The
    header still shows `3 / 10` when a category has selections — that half is
    about the task, and is the only cue to selections inside a collapsed group.
  - Removing the counts is what allowed `w-96` → `w-80`: while the badges were
    there, width was set by badges + name; now it is set by the longest name
    (`QuestionnaireResponseValueTimePoint`, 35 chars, at depth-1 indent).
- **Viz canvas** (main): the layered ownership DAG described above.
- **Detail drawer** (right, opens on node click): reuses the Explorer
  nested-table card, with two known fixes rolled in — "Referenced by" items
  become links; Description column must be fully readable (wrap or expand,
  not truncated-inaccessible).

Selection ids encode in the URL from day one.

## Data layer

New DataService method:

```
getOwnershipSubgraph(selectedIds, expansions, options?) -> {
  nodes: [{ id, role: 'selected' | 'context', layer, slots, ... }],
  edges: [{ source, target, type: 'ownership' | 'reference' | 'isa',
            slotName, storageDirection, cardinality }],
  // NB 'isa' edges are never ROUTED. The view consumes them into node
  // metadata (isaParents/subclassCount) and, when ⑃ siblings is on, into the
  // merged-box grouping — see §3.
  hiddenOwners: Map<classId, ownerId[]>,   // owners NOT drawn → chips
}

options = {
  pathToRoot?: boolean,   // default false — transitive ancestors (⇱ roots)
  ownerCap?: number,      // default 8 — draw direct owners up to this many
}
```

Built on the existing containment graph + graphology edges. Unit-tested in
the style of the containment property tests.

**Backbone: `supergroup/dag` v2** — published as `supergroup@2.0.0` on npm
and installed (2026-07-28); the graphology fallback is dead. Implementation:
`src/models/ownershipSubgraph.ts` builds the full ownership DAG once via
`fromEdges` (self-loops skipped, parallel edges collapsed), uses
`parents` for the one-hop owner walk (`ancestors()` only under
`pathToRoot`) and **sunk layers** over the FULL DAG as the
layer assignment (owners sink to one above their topmost owning child; leaf
classes dangle below their deepest owner — see `computeSunkLayers`), so a
node keeps its layer as the selection changes and roots aren't stranded far
from their members. Edge policy: ownership edges emit whenever both
endpoints are visible; reference/isa edges need both endpoints visible and
at least one explicitly requested (selected or expanded). Source repo: `~/github-repos/personal/supergroup` (README outdated;
trust `dist/*.d.ts` + `src/`).

### Ownership classification review (build step 1)

Whether a member→owner FK is *ownership* (flip) or a *reference* (leave) is a
classification decision, not a drawing decision. First build step: enumerate
every inter-entity slot with the heuristic's current verdict; Siggie
adjudicates the list; decisions are encoded in the override sets
(`src/models/containmentGraph.ts`). The LinkML `containment_direction`
annotation migration stays parked (TASKS.md), but this reviewed list becomes
its seed.

Decisions already recorded:
- **Person owns Participant** (via `associated_person`).
- **Organization owns ObservationSet** (via `performed_by`).

Consequence (desired): Participant has two owners (ResearchStudy, Person) and
renders with two in-edges — the poly-parent case demonstrated at the top of
the diagram.

## Renderer

**One renderer**, adapted from icd11-playground's `NodeLinkView.tsx`
(`../personal/icd11-playground/web/src/components/NodeLinkView.tsx`;
1,625 lines; elkjs layered layout in a web
worker, HTML nodes over SVG edges, RAF-throttled zoom, store-driven
expand-on-demand over a poly-parent DAG). Cytoscape and React Flow are
dropped — NodeLinkView's HTML-nodes-over-SVG-edges architecture is what makes
attribute-rows-in-nodes and row-anchored edges natural.

**Port structure — core vs bindings** (the reuse seam, decided over both
"quick adaptation" and "extract a package now"):
- `src/explore/graph-core/` — layout/zoom/expansion engine: ELK worker
  plumbing + cancellation, pan/zoom, edge-path generation, incremental
  expand. **Zero imports from DataService or app stores.** This is the future
  extraction boundary (dag-browser-widget family), post-demo.
- `src/explore/` bindings — node rendering (attribute rows, per-row expand
  counts, is-a stack), edge styling/labels per the channel rules, and wiring
  to selection state / `getOwnershipSubgraph`.

Building a reusable package *now* was considered and rejected: the expensive
part is API design (consumer-declared edge anchor points/ports, expansion
state inversion) against only ~1.5 real consumers, under the release clock.
The core/bindings split costs ~half a day and keeps extraction mechanical
later.

New dependency: `elkjs` only (skip NodeLinkView's d3-force mode in v1).

## Build order

1. ~~`getOwnershipSubgraph` + **ownership classification review** (gate:
   Siggie adjudicates the slot list) + unit tests.~~ **DONE** — classification
   2026-07-13 (`16da5f1`); `getOwnershipSubgraph` on supergroup/dag
   2026-07-28 (`src/models/ownershipSubgraph.ts` + property tests).
2. ~~Shell entry + selection table (basic), selection in URL.~~ **DONE**
   2026-07-13 (`028e3a0`).
3. Renderer port: **mostly DONE** 2026-07-28. `src/explore/graph-core/`
   (ELK-worker layout + cancellation, partition-constrained layers,
   fixed-position ports, RAF zoom/pan — zero app imports; d3 and force mode
   dropped in the port) + `src/explore/OwnershipGraphView.tsx` bindings:
   HTML attribute-row nodes over an SVG edge layer; edges attach to ELK
   ports at their slot row (the ATTRIBUTE END) and at a header port on the
   target class (the ENTITY END, which names no slot), rendered from ELK's
   routed orthogonal sections (plus LR/TB).
   Flipped storage is marked by a back-pointing arrowhead at the member end. Rows default to edge-connected slots with a "+N more"
   footer expanding to all entity-ranged slots (dimmed = range off-canvas).
   Later same-day iterations: sunk layers (owners sit beside their topmost
   member — `computeSunkLayers`), hover emphasis (entity → neighborhood,
   edge → isolate; RAF direct-DOM), expanded rows include plain scalar/enum
   attributes (hollow dot), SVG self-loop icon, LR/TB toggle.
   **Expand-on-demand DONE** 2026-08-12: clicking a dimmed entity row adds
   its range as a context node (`?exp=`, state in ExploreApp beside
   selection); expanded nodes carry an ✕ to dismiss, path-to-root context
   does not. Rows pointing at on-canvas entities, plain scalar/enum rows,
   and self-loops are not expandable. Owner chips (above the cap) are the
   same affordance reached from the owner side.

   **Edge port fan-out DONE** 2026-08-19. Every incoming edge previously
   shared one `::hdr:in` port, so N edges converging on a node landed on a
   single point and their orthogonal runs overlapped — six owners of
   `BodySite` read as an edge between two unrelated owners. Each edge now
   gets its own port fanned along the border. Orthogonal routing retained.
   **Curved edges were REMOVED 2026-08-19** — never retuned, and once
   convergences merged into a single arrowhead the curved mode was, in
   Siggie's words, "enough of a mess that I'm ready to give up on them."
   `smoothPath` survives in graph-core as an unused geometry utility.

   **Empty-node fix DONE** 2026-08-19: a class whose attributes are all
   scalars (`BodySite`: id/qualifier/site) has nothing edge-connected, so
   collapsed it rendered as an empty box whose only content was a
   "+3 more attributes" collapser. Those nodes now auto-expand.

   Still open from this step: proper **is-a side-stacks** (currently header
   chips ⊳/▷) — **this is the next piece of work.** Cardinality indicators
   at edge endpoints are wanted (Siggie, 2026-08-19), together with some
   form of label/title text on links.

   Note this is about **edge endpoints** and is still open. Cardinality in the
   **attribute rows** is done (2026-08-25): every row shows one, drawn or not.
   It used to come from the edge, so scalar-ranged rows — which are never
   drawn — showed a blank, and `Document.url` read as though it had no
   cardinality when it is `1..*`. Rows now derive it from the model
   (`getAttributeSummaries`) via the same `cardinalityLabel` the edges use.
4. ~~Detail drawer (Explorer card reuse + the two fixes).~~ **DONE**
   2026-08-12. `src/explore/DetailDrawer.tsx` opens on node click, reusing
   `getClassSummary` (the Explorer card's data path) rather than
   `ClassDetailCard` itself — that card is sized to sit inline between table
   rows, hence its 8-slot cap and `max-w-[250px] truncate` descriptions. Both
   spec'd fixes are in: "Referenced by" entries are links, descriptions render
   wrapped and complete. Adds link navigation with a back stack (referenced-by,
   `is_a` parent, entity-valued ranges), Esc to close, and an
   add/remove-from-diagram toggle. Open entity encodes as `?detail=X` beside
   `?sel=`, through a single URL writer. The left selection table is now
   collapsible, completing the three-region layout.
5. Polish: animation on selection change (surviving nodes keep layers),
   self-loop badges, dim/dismiss for context nodes. **Confirmed wanted**
   (2026-08-19), not started.

## Verification

- vitest for extraction + classification (property tests like containment's).
- **Playwright is NOT installed** and the probe rig was never built. Everything
  above the data layer is verified by jsdom tests only; visual review is done
  by Siggie against the dev server. Two bugs that shipped — pan not working at
  all, and a crash on uncheck — were both invisible to the test suite and
  found by looking at the page.
- Regression tests worth knowing about: `useGraphLayout.test.ts` (async
  layout staleness), `exploreReset.test.ts` (title-click reset),
  `ownershipSubgraph.test.ts` (owner-cap and chip/node invariants).

## Explicitly out of v1

- Widget-as-main-navigation (deferred, not dead).
- Ownership/inheritance display-mode checkboxes (the is-a stack is the first
  treatment; modes come after).
- Category hulls, floating boxes, force layout mode.
- Migrating or deleting anything from the old views.
- Reusable-package extraction of `graph-core/` (post-demo).

## Open questions

- Name of the view/entry ("explore" is a placeholder).
- Full ownership classification list (build step 1 produces it; two
  decisions pre-recorded above).
- Whether the demo replaces Focus in the header toggle or lives alongside
  (decide when it's demoable).
