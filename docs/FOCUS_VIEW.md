# Focus View — Design & Working Spec

> The durable spec for the **Focus** view (the "compact Kitchen Sink" / subset
> visualization). Read this to resume Focus work. Ordered remaining steps live in
> [TASKS.md](TASKS.md); architecture context in [ARCHITECTURE.md](ARCHITECTURE.md).
>
> This consolidates the former `HANDOFF-kitchen-sink.md` and
> `HANDOFF-kitchen-sink-widget-heads-up.md` scratch notes (now deleted).

## Why Focus exists (strategy)

The team gave **tentative** approval to proceed. Full buy-in will come from a
**working demo that's visibly easier to understand than the current views or the
LinkML-generated docs.** The **subset visualization** is expected to be the most
persuasive artifact. So priority is a demonstrable Focus view over perfecting the
containment heuristic. A correct-enough containment graph is good enough to demo.

### Two audiences (shape the design)
1. **Researchers *using* harmonized studies** — "what's in here / what does this
   mean?" Would value **actual dataset containment** (instance-level) — a SEPARATE
   future feature (needs real data), probably out of scope for now.
2. **Researchers *pre-harmonizing* new studies** — "where would my variable fit?"
   Want **(a) allowed/schema-permitted containment** and **(b) comparison to how
   established studies modeled it.** Focus serves this audience.

## What Focus is

**Decision (STAKEHOLDER_QUESTIONS Q1, option c): keep all views, evolve
separately.** Explorer and Kitchen Sink both stay; Focus is *additive*, not a
replacement for either.

A third view (header toggle: Explorer / Kitchen Sink / **Focus**;
`?view=focus`). It is **the Kitchen Sink with minimal differences** — NOT a
reimplementation. It reuses `LayoutManager`'s primitives (`ItemsPanel`,
`Section`, `LinkOverlay`, floating boxes). The ONLY intended differences:

1. **Left panel (top): category-grouped class list + multi-select.** Categories
   (from `entityCategories.ts` via `DataService.getCategoryGroups()`) as an extra
   tree layer above classes. Multi-select checkboxes. Starts all-collapsed.
2. **Left panel (bottom): containment digraph widget** (`dag-browser-widget`),
   scoped to the selected subset. Shares selection with the top selector.
3. **Middle panel: the Kitchen Sink `slot` section, scoped to the subset.** One
   flat Attributes section listing the slots the selected entities declare —
   *not* a section per entity (that was the earlier plan; it was the bespoke
   reimplementation we backed out of). Rendered through the elements' own
   `getSectionItemData` so rows match the Kitchen Sink.
4. **Right panel: the Kitchen Sink `class`/`enum`/`type` sections (Ent/PVS/DT),
   scoped to the subset.** Three flat sections holding the range targets the
   selected entities point to. **Per-entity nesting is deferred** — range rows
   from different selected entities intermix within a section for now (revisit
   once the flat version is demoed). See TASKS.md remaining item 1.
5. Everything else — gutters, link overlays, detail/relationship floating boxes —
   comes for free from reusing the shared machinery.

> **Design note (why flat, not section-per-entity):** the scaffold commit
> (`d9f4cc8`) built middle/right bespoke — hand-assembling items from
> `getClassSummary` (which re-scrapes `getDetailData` table rows), a parallel
> rendering path that would drift from the Kitchen Sink. That contradicted the
> "minimal differences / reuse the primitives" mandate. It was replaced with
> `getFocusSubsetSections`, which filters the real collections
> (`getAllElements()` → subset → `getSectionItemData`) so Focus rows *are*
> Kitchen Sink rows. Nesting was dropped to keep that reuse clean; it can be
> layered back on top later.

### Layout
```
┌──────────────┬──gutter──┬──────────┬──gutter──┬──────────┐
│ Left TOP:    │          │ Middle:  │          │ Right:   │
│ categories + │          │ 1 section│          │ per-entity│
│ multi-select │          │ per      │          │ × Ent/PVS │
│ (ItemsPanel) │          │ selected │          │ /DT       │
├──────────────┤          │ entity   │          │ (2-level) │
│ Left BOTTOM: │          │ (slots)  │          │           │
│ containment  │          │          │          │           │
│ widget       │          │          │          │           │
└──────────────┴──────────┴──────────┴──────────┴──────────┘
   gutters give LinkOverlay room for connector curves
   + floating detail/relationship boxes (existing system)
   + floating node-link Cytoscape diagram (summonable)
```

## Selection model
- `selectedClassIds: Set<string>` owned by `FocusView`, persisted to URL
  (`?focus=...`, TODO). Shared by: the top selector, the containment widget
  (bidirectional select/unselect), and the middle/right scoping.
- This is a NEW app-level concept. `usePinState` is Explorer-only; the Kitchen
  Sink uses floating-box `groups` (a different concept — inspection, not selection).
- Selection affordance belongs ONLY on the left selector and the widget — NOT in
  the middle/right panels.

## Containment digraph semantics (settled enough to demo)
- Shows **schema-PERMITTED** containment — a **directed graph (possibly cyclic;
  NOT a DAG** — `ResearchStudy part_of ResearchStudy` is a real loop). Most edges
  are optional (all flipped slots in the model are `0..1`, none required), so
  contained entities are ALSO roots. Render via the widget's poly-parent /
  "★ also under" handling; do NOT imply mandatory containment.
- Derived live from `DataService.getContainmentGraph()` → the FK-inversion
  heuristic in `src/models/containmentGraph.ts` (ported from
  `scripts/extract_containment_tree.py`). Edge `source→target` = "source contains
  target", so `target.parentIds` includes `source` for the widget.
- The override sets (`VALUE_OBJECTS`, `NO_FLIP_SLOTS`, …) are hand-curated and
  fragile. A de-fragility refactor (LinkML `annotations: { containment_direction:
  contains | contained_by | ? }` per slot, auto-generated then human-reviewed) is
  PARKED until the demo proves value. `owns`/`owned_by` was floated as broader
  vocabulary for the `performed_by` family.

## Architecture decisions (locked)
- **FocusView is a separate component**, NOT a `mode` of LayoutManager.
  LayoutManager's layout is hardcoded to the Kitchen Sink 3-panel shape; Focus
  needs a 2-row left column. Reuse the *primitives*, not the layout.
- **Floating boxes: extract a shared `useFloatingBoxes` hook** from LayoutManager
  (~550 lines of box state/effects/handlers currently inline) and consume it from
  both LayoutManager and FocusView. The alternative (duplicating into FocusView)
  violates DRY. `LinkOverlay` and `FloatingBoxManager` are already standalone
  components; only the orchestration is trapped in LayoutManager.
- **LinkOverlay** keys off DOM `data-panel-position` + item rects, not props — it
  works in Focus as long as panels have `position` left/middle/right and
  horizontal gaps (gutters) between them.
- `ItemsPanel`/`Section` gained optional `selectedIds`/`onToggleSelect` props
  (approach A) for the multi-select checkbox — used ONLY by the left selector.

## What shipped vs. what remains
**Shipped:**
- Foundation (`c76fdcf`): `containmentGraph.ts`, `getContainmentGraph()`,
  `getCategoryGroups()`, 10 property tests.
- Schema-sync GitHub Action (`8adb971`).
- Focus scaffold + category selector + containment widget + scroll fix (`d9f4cc8`).

- Middle/right restructured to **reuse the Kitchen Sink rendering path scoped to
  the subset** (`getFocusSubsetSections`); bespoke `getFocusPanelSections` deleted.
  Select/unselect removed from middle/right. Per-entity nesting deferred.

**Remaining (see TASKS.md for ordered steps):**
- **Per-entity nesting** in the right panel (deferred above).
- **Restore gutters + add `<LinkOverlay>`** to FocusView.
- **Extract `useFloatingBoxes`**, wire detail/relationship boxes into Focus.
- **Widget select/unselect** shared with the selector (bidirectional).
- **Widget "show all entities"** option (full graph, not just subset).
- **Resizable panels** (draggable edges) — Kitchen Sink uses flex gutters, not
  splitters; consider `react-resizable-panels`.
- **Floating Cytoscape diagram** (summonable node-link view of the subset).
- URL persistence of `selectedClassIds`.
