# Tasks

> **What is actually next.** Everything here is open. Deferred and parked work
> is in [BACKLOG.md](BACKLOG.md); reasoning and dead ends are in
> [WORKLOG.md](../WORKLOG.md) (written for the next session, not for Siggie);
> completed rounds are in [archive/](archive/).
>
> Architectural rules and the gotchas to read before running anything are in
> [CLAUDE.md](CLAUDE.md).

---

## Now — finish the tours

The active work. The plan is [TOURS_AND_CONTENT.md](TOURS_AND_CONTENT.md); §1
(category ⊞ views) has shipped, §2 and §3 have not.

| # | Task | Where |
|---|---|---|
| 1 | **Author the five tours.** Order is fixed, complexity rising: *What BDCHM covers* → *Getting oriented* → *Reading the diagram* → *Ownership* → *Inheritance*. Steps are drafted in prose; they need writing as content. | [§3](TOURS_AND_CONTENT.md#3-the-five-tours) |
| 2 | **Restructure the Help menu** and delete the `take the tour` pill — two entry points to one thing drift apart. Decide whether Help → Tours opens a chooser or the first tour. | [§2](TOURS_AND_CONTENT.md#2-the-help-menu) |
| 3 | **`Change:` needs a remove/clear verb.** The authoring format is additive-only, so tour step 4 ADDS to step 3's canvas where the copy reads as a clean two-box example. | `help-content.md` TODO |
| 4 | **Pictures for the legend and the Ownership/Inheritance tours.** The edge kinds need a diagram, not prose — "NOT ascii, looking like the app". The vocabulary is settled ([the five positions](OWNERSHIP_CLASSIFICATION.md#the-five-positions-and-the-two-axes-they-decompose-onto), [the phrasing table](OWNERSHIP_CLASSIFICATION.md#the-phrasing-table)); what is missing is the picture. A sketch of one is in [archive/NEXT_SESSION_EDGE_DISPLAY.md](archive/NEXT_SESSION_EDGE_DISPLAY.md) §3.3. | — |

**Before deleting menu items in #2:** `node-dismiss`, `toolbar-siblings`,
`relation-bar` and `graph-canvas-reading` are help-only entries surfaced
contextually. Confirm they stay reachable, or dropping them from the menu makes
them *unreachable* rather than merely unlisted.

**Editing tour content is safe** — `npx vitest run src/test/helpContent.test.ts`
(~700ms) catches typo'd anchor kinds, un-`Action:`ed state changes, untagged
`help-id` anchors, leftover numeric `Tour:` values and unparseable `State:`
params. Each failure was verified by deliberately breaking the content. A green
run means the content is structurally sound and says nothing about whether the
copy reads well.

⚠️ **Resolver anchors are the exception.** `entity-row`, `slot-row`,
`entity-checkbox` and `node-box` are checked for *known kind* but cannot be
checked for *actually resolving* — a typo in the ARGUMENT
(`entity-row:Participnt`) passes every test and degrades silently to an
unringed popover. Those need the browser.

---

## Next — correctness, in priority order

| # | Task | Est. | Where |
|---|---|---|---|
| 5 | **Re-render regression** — *"most clicks cause at least the main panel to refresh; didn't used to."* The most serious open item: it affects every interaction, where everything else is one feature's visual defect. **Still uninvestigated.** | ? | [BACKLOG §Re-render](BACKLOG.md#re-render-regression--still-uninvestigated) |
| 6 | **Rewrite the "owns vs belongs to" passage.** Siggie's note in the doc: *"this is wrong — observation definitely doesn't own a participant. Probably need to completely rewrite this whole section from scratch. The five positions use 'belong' language for both directions."* | small | [OWNERSHIP_CLASSIFICATION §The three kinds](OWNERSHIP_CLASSIFICATION.md#the-three-kinds) |
| 7 | **`goTo` fails silently when the tour has no positions.** `startTour()` before content is ready does nothing and says nothing. Not reachable today; a landmine sized exactly for the next programmatic caller. **Loud is probably the right call** — a `console.warn` on the empty case, not the reverted deferral machinery. | 15 min | [BACKLOG §goTo](BACKLOG.md#gotos-silent-no-op) |
| 8 | **Migrate positioning to CSS anchor positioning.** Deletes the 250ms poll, the flip/clamp, the `EST_H` guess and the stale-hint bug. **Unblocked** — S3b's resolvers landed. | ~0.5 day | [HELP_PACKAGE_PLAN §1](HELP_PACKAGE_PLAN.md#1-migrate-positioning-to-css-anchor-positioning) |
| 9 | **Edge crossings.** *"A lot of unnecessary edge crossings."* Cause **unmeasured** — do not speculate. Layout is `useGraphLayout`. | ? | — |
| 10 | **Dead code: `buildRelationGroups`.** It feeds `countsOf` for `NodeVM`'s `relatedCount`/`shownCount`, and **nothing renders those any more** — the relation bar counts its own rows. A second layer of dead code inside a live file. | small | [BACKLOG §Dead code](BACKLOG.md#dead-code-left-by-the-relation-bar) |

⚠️ **Items 5 and 9 are investigations wearing a quick win's clothes.** Both have
unmeasured causes. The standing rule is measure before proposing one.

---

## Then — cleanups with a known shape

  | #  | Task                                                                                                                                                                                                                                                            | Where                                                                                                                        |
  |----|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------|
  | 11 | **Palettes that only half-exist.** Every element-type color is defined **twice** — a palette `hex` and eleven hand-picked Tailwind literals — in two forms that cannot be derived from one another. Changing `RANGE_COLORS` moves the SVG hex and nothing else. | [BACKLOG §Palettes](BACKLOG.md#palettes-that-only-half-exist)                                                                |
  | 12 | **One inheritance accessor, with a required argument.** Inheritance is derived two independent ways today and neither calls the other. Decided 2026-08-24.                                                                                                      | [OWNERSHIP_CLASSIFICATION §PLANNED](OWNERSHIP_CLASSIFICATION.md#️-planned--one-inheritance-accessor-with-a-required-argument) |
  | 13 | **Fix `EXPLORE_VIZ.md`** — audited ~20–25% stale, and the staleness is *concentrated*: the "Core visual-design conclusions" list is the worst section and reads as settled design law. **Fix the numbered list and the two `ownerCap` mentions first.**         | [BACKLOG §EXPLORE_VIZ](BACKLOG.md#explore_vizmd-is-2025-stale-1)                                                             |
  | 14 | **A sync check that each `containmentGraph` override slot name still has exactly one site.** The sets are keyed by SLOT NAME, not `(class, slot)`, and every member happening to occur at one class is **luck, not design**.                                    | [BACKLOG §Config rot](BACKLOG.md#hand-curated-config-rot)                                                                    |

---

## Waiting on Siggie

- **Legend from a single entity's perspective** — wanted **described first**,
  before deciding. The four-position table is in
  [OWNERSHIP_CLASSIFICATION](OWNERSHIP_CLASSIFICATION.md#the-five-positions-and-the-two-axes-they-decompose-onto).
- **Should the parent's own edge in a fan render black?** Specified black; ships
  in the shared channel colour. [BACKLOG §Edge fan](BACKLOG.md#the-fan-from-observationsetobservations)
- **Obstacle-aware routing for dragged nodes** — not scoped, needs a go-ahead.
  [BACKLOG §Dragging](BACKLOG.md#dragging-is-unfinished)
- **Categories in the selection tree** — a design question, not a bug.
  [BACKLOG §dag-browser](BACKLOG.md#dag-browser)

---

## Explicitly not now

Chip-strip redesign · panel resizing/detaching · the ownership legend rebuild ·
CURIE links · the bare diagonal · dragging polish · example-cases restructuring
· extracting `packages/tour-help/` · bringing help mode back.

All keep their full write-ups in [BACKLOG.md](BACKLOG.md) — nothing is lost.
