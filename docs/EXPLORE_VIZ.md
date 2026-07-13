# EXPLORE_VIZ.md — Subgraph-viz SPA (design spec)

> **Status**: Design approved in conversation 2026-07-13; implementation not
> started. Supersedes parts of [FOCUS_VIEW.md](FOCUS_VIEW.md) (the three-panel
> Focus layout and its LinkOverlay work continue to exist but are no longer
> the primary direction). Target: demoable before the 2026-07-30 release.
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
2. **Direction is encoded by vertical position** (owners above members), not
   by arrowheads alone. Layered DAG: poly-parent nodes get multiple in-edges;
   no node duplication — this eliminates the "★ also under" problem, which
   is intrinsic to nesting/outline techniques, not a widget bug.
3. **is-a never shares the ownership plane.** Subclasses render as an
   expandable stack attached to the parent node ("▸ 3 subclasses"), not as
   another arrow among the amber ones. (Other treatments — hulls, badges —
   are future modes.)
4. **Relation channels**: ownership = amber solid, drawn normalized;
   references = gray dashed, drawn in FK direction; is-a = the side-stack.
5. **Label convention**: an ownership edge drawn *flipped* from its storage
   direction gets a re-verbed label ("has members — via
   `member_of_research_study`"), never the bare slot name pointing the wrong
   way. Unflipped edges and references keep plain slot-name labels.
6. **Content policy**: the diagram shows the selected entities, edges among
   them, and each selected entity's ownership path(s) to root (dimmed).
   Everything else arrives by **expand-on-demand**: nodes/rows carry ↘/↗-style
   counts per relation kind (the app's existing badge language); clicking
   pulls those neighbors in, dimmed and dismissible.
7. Self-loops (ResearchStudy `part_of` ResearchStudy) draw as a loop badge on
   the node, not a layer violation.

## Architecture

- **New Vite entry point in this repo** (`explore.html`, shell under
  `src/explore/`). The existing app is untouched except a header link each
  way. All existing architectural rules apply (components ↔ DataService only;
  fail loudly; vocab via `VOCAB` config — no hardcoded terms).
- Old views stay in place for stakeholder comparison; deletion is a separate
  later decision.

### Layout

Three regions:
- **Selection table** (left, collapsible): lean Explorer-style
  category-grouped entity table — checkboxes + count-badge columns. Built
  fresh against existing DataService accessors; does NOT import Explorer's
  pin/drilldown machinery.
- **Viz canvas** (main): the layered ownership DAG described above.
- **Detail drawer** (right, opens on node click): reuses the Explorer
  nested-table card, with two known fixes rolled in — "Referenced by" items
  become links; Description column must be fully readable (wrap or expand,
  not truncated-inaccessible).

Selection ids encode in the URL from day one.

## Data layer

New DataService method:

```
getOwnershipSubgraph(selectedIds, expansions) -> {
  nodes: [{ id, role: 'selected' | 'context', ... }],
  edges: [{ source, target, type: 'ownership' | 'reference' | 'isa',
            slotName, storageDirection, cardinality }],
}
```

Built on the existing containment graph + graphology edges. Unit-tested in
the style of the containment property tests.

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

1. `getOwnershipSubgraph` + **ownership classification review** (gate:
   Siggie adjudicates the slot list) + unit tests.
2. Shell entry + selection table (basic), selection in URL.
3. Renderer port: `graph-core/` extraction from NodeLinkView, then bindings —
   layered ownership DAG with row-anchored edges, expand-on-demand, is-a
   stacks, re-verbed labels.
4. Detail drawer (Explorer card reuse + the two fixes).
5. Polish: animation on selection change (surviving nodes keep layers),
   self-loop badges, dim/dismiss for context nodes.

## Verification

- vitest for extraction + classification (property tests like containment's).
- Drive the real page with the playwright probe rig (scratchpad pattern from
  the 2026-07-10 LinkOverlay debugging): assert node/edge presence, layer
  ordering (owner above member), expand behavior; screenshot review.

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
