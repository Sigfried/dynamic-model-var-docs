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
| 1 | **Author the five tours.** Order is fixed, complexity rising: *What BDCHM covers* → *Getting oriented* → *Reading the diagram* → *Ownership* → *Inheritance*. Steps are drafted in prose; they need writing as content. **Both blockers are gone** (2026-09-05): a named tour can now be started, so all five are reachable rather than only the file's first, and `Only:` gives a step a clean canvas — which the category steps and the two/three-box examples both need. | [§3](TOURS_AND_CONTENT.md#3-the-five-tours) |
| ~~2~~ | ~~**Restructure the Help menu** and delete the `take the tour` pill.~~ **DONE 2026-09-05.** Tours live on a `Guided tours` header button opening a chooser that lists every tour with its `TourMetadata:` description; the pill and the Help menu's tour item are both gone. (A `Tours ▸` submenu inside Help shipped first and was replaced same-day — *"It's too hard to get to tours now"*.) This also fixed the half nobody had noticed: `startTour` took no argument and the provider navigated `tourPositions(content)` with no name, so **only the first tour in the file could ever run**. `node-dismiss` was genuinely unreachable (help mode is off, so its `data-help-id` opened nothing) and is now listed in the menu. | [§2](TOURS_AND_CONTENT.md#2-the-help-menu) |
| ~~3~~ | ~~**`Change:` needs a remove/clear verb.**~~ **DONE 2026-09-05.** The verb is `Only:`, which replaces the selection where `Change:` adds. Scoped to `sel` — scalars still merge, so it is not the old absolute `State:` returning — and it records what it displaced so `back` stays exact. [Spec](../src/help/FORMAT.md#only--a-step-that-names-the-whole-canvas). **Existing steps are not rewritten to use it**; `graph-canvas` still adds to `relationship-kinds`' canvas. | `help-content.md` TODO |
| ~~3b~~ | ~~**Rewrite the tour state stack on the `held`/`temp_held` model.**~~ **DONE 2026-09-07.** `counts`, `displaced`, `horizon`, `visibleFrames`, `pendingRestore` and `reconcile`'s whole-stack surgery are all gone; the module stores `held`, `tempHeld`, `tour` and a `region`, and composes them. The provider lost its `depth` ref to a new `onTourStart`/`onTourEnd` pair. The authoring format, the chooser and the content are untouched, and the integration suite passed unchanged — the mechanism changed, not what a viewer walking forward sees. **The design note's stated untick rule shipped unchanged**; what needed care was its if/else SHORTHAND (`tour`, else `tempHeld`, else `held`), which stops at the first match and so is only equivalent when one set is displaying — true of every row of the worked example. At region 0 a class can be in `tour` AND a non-suppressed `held`, and stopping early lets the next compose put it back. Step 7's `−C` is NOT this case: `held` is suppressed at region 1, so it correctly keeps its copy for the crossing. | [WORKLOG](../WORKLOG.md) |
| ~~3c~~ | ~~**Tour step numbering.**~~ **DONE 2026-09-07.** No fourth numbering scheme: the answer is that a stable identifier already existed — the `### ` slug — and was simply never shown. Each popover can now display its address (`relationship-kinds ▸2`: entry id, plus the 1-based beat ordinal), click-to-copy — and what it copies is the markdown header `### relationship-kinds`, not the address as shown, because that is the string that matches exactly one line in a file search. **Deliberately NOT a number**, because explicit `Tour: 3` numbers were deleted on 2026-08-28 for making an insertion renumber every later step; an address that reintroduced that would be a regression. The counter and beat dots are untouched — they are viewer progress, and settled with Siggie on 2026-08-28. **Temporary and dev-only**: a `Show content ids` item at the foot of the Help menu, gated on `import.meta.env.DEV` so the deployed build cannot show it, seeded from `localStorage` (help-content.md hot-reloads the provider, and a flag that reset on every save would be off for most of an authoring session) and from `?ids=1`. Beats get an ordinal and nothing more — a beat is a markdown list item with no anchor of its own, and a copyable beat-text payload was rejected: *"just give me the beat number. it's easy enough to count the beat bullets by eye."* Delete the whole thing once the five tours are written. | [FORMAT.md](../src/help/FORMAT.md#finding-a-step-you-can-see-on-screen) |
| 4 | **Pictures for the legend and the Ownership/Inheritance tours.** The edge kinds need a diagram, not prose — "NOT ascii, looking like the app". The vocabulary is settled ([the five positions](OWNERSHIP_CLASSIFICATION.md#the-five-positions-and-the-two-axes-they-decompose-onto), [the phrasing table](OWNERSHIP_CLASSIFICATION.md#the-phrasing-table)); what is missing is the picture. A sketch of one is in [archive/NEXT_SESSION_EDGE_DISPLAY.md](archive/NEXT_SESSION_EDGE_DISPLAY.md) §3.3. | — |

⚠️ **The menu is the ONLY way into a help-only entry.** The other route was help
mode's `?` hints, and `HELP_MODE_ENABLED` is false — `HelpLayer` renders them
only `if (helpMode && !inTour)`, so a `data-help-id` tag anchors and rings but
opens nothing when clicked. Checked while doing #2: `toolbar-siblings`,
`relation-bar` and `graph-canvas-reading` were listed and fine; `node-dismiss`
was tagged in `OwnershipGraphView` and reachable from nowhere, and is listed
now. Anything dropped from `HELP_ENTRIES` in `HelpMenu.tsx` is unreachable, not
merely unlisted.

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
| 8 | **Migrate positioning to CSS anchor positioning.** Deletes the 250ms poll, the flip/clamp, the `EST_H` guess and the stale-hint bug. **Unblocked** — S3b's resolvers landed. ⚠️ **`EST_H` has a live symptom**, seen 2026-09-07: a tall popover over a populated canvas renders with its bottom cut off. `EST_H = 260` (`HelpLayer.tsx`) is a hardcoded GUESS at popover height used for clamping, so anything taller is positioned as if it were 260px and runs off the bottom. The `maxHeight`/scroll path already handles real height; the clamp arithmetic does not. Fixable on its own if this migration stays parked. | ~0.5 day | [HELP_PACKAGE_PLAN §1](HELP_PACKAGE_PLAN.md#1-migrate-positioning-to-css-anchor-positioning) |
| 9 | **Edge crossings.** *"A lot of unnecessary edge crossings."* Cause **unmeasured** — do not speculate. Layout is `useGraphLayout`. | ? | — |
| 10 | **Dead code: `buildRelationGroups`.** It feeds `countsOf` for `NodeVM`'s `relatedCount`/`shownCount`, and **nothing renders those any more** — the relation bar counts its own rows. A second layer of dead code inside a live file. | small | [BACKLOG §Dead code](BACKLOG.md#dead-code-left-by-the-relation-bar) |

⚠️ **Items 5 and 9 are investigations wearing a quick win's clothes.** Both have
unmeasured causes. The standing rule is measure before proposing one.

---

## Then — cleanups with a known shape

  | #  | Task                                                                                                                                                                                                                                                            | Where                                                                                                                        |
  |----|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------|
  | 11 | **Palettes that only half-exist.** Every element-type color is defined **twice** — a palette `hex` and eleven hand-picked Tailwind literals — in two forms that cannot be derived from one another. Changing `RANGE_COLORS` moves the SVG hex and nothing else. | [BACKLOG §Palettes](BACKLOG.md#palettes-that-only-half-exist)                                                                |
  | 12 | **One inheritance accessor, with a required argument.** Inheritance is derived two independent ways today and neither calls the other. Decided 2026-08-24.                                                                                                      | [OWNERSHIP_CLASSIFICATION §PLANNED](OWNERSHIP_CLASSIFICATION.md#planned--one-inheritance-accessor-with-a-required-argument) |
  | 13 | **A sync check that each `containmentGraph` override slot name still has exactly one site.** The sets are keyed by SLOT NAME, not `(class, slot)`, and every member happening to occur at one class is **luck, not design**.                                    | [BACKLOG §Config rot](BACKLOG.md#hand-curated-config-rot)                                                                    |
  | 14 | **Improve the intros to README and the first tour** — they might share text. README's *Model shape* does not actually describe the model's shape; it describes how the app adjusts it for comprehension. [sg]                                                | [README](../README.md) · [§3.1](TOURS_AND_CONTENT.md#31-the-biodata-catalyst-harmonized-model) |

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
