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

The active work. The plan is [TOURS_AND_CONTENT.md](TOURS_AND_CONTENT.md).

| # | Task | Where |
|---|---|---|
| 1 | ~~Finish tour 1 — the five remaining category steps.~~ **Done 2026-09-08.** `clinical-records` (8), `observation-measurement` (6), `lab-biospecimen` (8), `survey-questionnaire` (7) and `other-files` (6) are written, so `app-model-mods`'s promise of a walk through each category is kept. ⚠️ `why`'s placement is still item 3b and still Siggie's call. | [TOURS_AND_CONTENT](TOURS_AND_CONTENT.md#1-the-biodata-catalyst-harmonized-model) |
| 1b | **Then the other four tours.** Order fixed, complexity rising: *Getting oriented* → *Reading the diagram* → *Ownership* → *Inheritance*. `Getting oriented` exists with ONE step (`bdchm-entities`); `Walkthrough` still holds 5 steps whose own description says *"Parts will be used for specific tours now"* — so the middle tours come mostly out of **splitting `Walkthrough`**, not writing from nothing. Carry in: `help-content.md` holds unanswered `TODO(siggie):` notes on specific steps, and beats are written label-then-`Description:` (see [FORMAT](../src/help/FORMAT.md#a-beats-numbered-line-is-a-label-not-its-text)). | [TOURS_AND_CONTENT](TOURS_AND_CONTENT.md#the-five-tours) |
| 2 | **Delete the tour-address readout** once the five tours are written. A dev-only `Show content ids` item at the foot of the Help menu, gated on `import.meta.env.DEV`; it exists to make a popover on screen findable in the content file. | [FORMAT.md](../src/help/FORMAT.md#finding-a-step-you-can-see-on-screen) |
| 3 | **Show the change instead of narrating it.** `Action:` is a past-tense receipt, which reads well when the VIEWER clicked and badly when the tour did it off-screen. Siggie's sequence: anchor the unchecked row → check it → anchor the entity that appeared. Hand-authored as a trial in tour 1 (2026-09-08) at the cost of three beats where there was one; **reverse it if it reads worse**. The feature is deriving that from one beat. Needs design: the popover must reposition BETWEEN phases, which the position model has no notion of, and a half-applied step is a state `back` cannot name. [sg] what i wanted was for one change step to be animated so it's clear to user what's going on. maybe the popover doesn't need to move? stow it on the right somewhere and go to its anchor only when the change is complete. but what the user would probably need to see is the cursor moving to the checkbox (or relation menu or attribute row). | [BACKLOG §Show the change](BACKLOG.md#show-the-change-instead-of-narrating-it) |
| 3b | **The `why` argument — parked, needs Siggie.** Two audiences need two arguments and one step cannot carry both: a researcher wants *what is in this model*, a LinkML-aware reader wants *why prefer this to the generated docs*. The second is absent from the app and is the one with money attached. Its provenance chain (BDCHM → pipeline → LinkML → the Explorer) is a **picture**, not prose — same request as item 4. Probably belongs on the Overview panel rather than in tour 1. | [BACKLOG §why](BACKLOG.md#the-why-argument--two-audiences-one-step) |
| 4 | **Pictures for the legend and the Ownership/Inheritance tours.** The edge kinds need a diagram, not prose — "NOT ascii, looking like the app". The vocabulary is settled ([the five positions](OWNERSHIP_CLASSIFICATION.md#the-five-positions-and-the-two-axes-they-decompose-onto), [the phrasing table](OWNERSHIP_CLASSIFICATION.md#the-phrasing-table)); what is missing is the picture. A sketch of one is in [archive/NEXT_SESSION_EDGE_DISPLAY.md](archive/NEXT_SESSION_EDGE_DISPLAY.md) §3.3. | — |

⚠️ **The menu is the ONLY way into a help-only entry.** The other route was help
mode's `?` hints, and `HELP_MODE_ENABLED` is false — `HelpLayer` renders them
only `if (helpMode && !inTour)`, so a `data-help-id` tag anchors and rings but
opens nothing when clicked. Checked 2026-09-05: `toolbar-siblings`,
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

⚠️ **Resolver anchors are half-covered.** `entity-row`, `slot-row`,
`entity-checkbox` and `node-box` are checked for *known kind*, and since
2026-09-08 their ARGUMENT is checked too — against the live schema and the
category config — so `entity-row:Participnt` and a `node-box:` naming a class
its own `cat=` step does not draw both fail the build instead of degrading to
an unringed popover. What still needs the browser is whether the element is
actually IN THE DOM at that moment: a collapsed tree row or a virtualised list
resolves to nothing for reasons no test can distinguish from a real bug.

---

## Next — correctness, in priority order

| # | Task | Est. | Where |
|---|---|---|---|
| 5 | **Re-render regression** — *"most clicks cause at least the main panel to refresh; didn't used to."* The most serious open item: it affects every interaction, where everything else is one feature's visual defect. **Still uninvestigated.** | ? | [BACKLOG §Re-render](BACKLOG.md#re-render-regression--still-uninvestigated) |
| 6 | **Rewrite the "owns vs belongs to" passage.** Siggie's note in the doc: *"this is wrong — observation definitely doesn't own a participant. Probably need to completely rewrite this whole section from scratch. The five positions use 'belong' language for both directions."* | small | [OWNERSHIP_CLASSIFICATION §The three kinds](OWNERSHIP_CLASSIFICATION.md#the-three-kinds) |
| 7 | **The tour's navigation guards fail silently.** `goTo`, `goToStep` and `startTour` each bail with a bare `return`. ⚠️ **No longer hypothetical** — this swallowed BOTH tour-map dead-click bugs on 2026-09-08 (`d0519dc`); each took far longer to find than it should have, and a dead UI is what Siggie reported as *"weird state"*. Both root causes are fixed; the silence is not. **Loud is the right call** — a `console.warn` per bail naming the guard and what it was asked for, not the reverted deferral machinery. | 15 min | [BACKLOG §goTo](BACKLOG.md#gotos-silent-no-op) |
| 8b | **Overlays: one model, draggable and resizable.** The detail drawer is an in-flow flex column while the legend and cases float, so the legend covers the drawer by construction. Make the drawer an overlay and make overlays draggable/resizable. **The popover half is now unblocked**: task 8 shipped, so nothing recomputes the popover's position and a dragged `left`/`top` has nothing to stomp it. The ring tracks its anchor in CSS, so it follows a dragged box on its own. | ? | [BACKLOG §Overlays](BACKLOG.md#overlays-one-model-draggable-and-resizable) |
| 8c | **Anchor kinds: three that name real things, and drop `sibs=0`.** `node-box:<MergedChild>` resolves through a row-fallback that is unsound — a subclass narrowing nothing (`SpecimenQualityObservation`) has no row to find, so the anchor means different things for different subclasses and fails silently either way. Proposal: `node-box:` (a box), `child-header:` (a merged child, which IS drawn, as a header) and `slot-row:` unchanged. Siggie, 2026-09-08: **drop `sibs=0`** — *"i never use it anyway and it really crowds the canvas"* — which is what makes the vocabulary unambiguous, since a merged child is a box in one mode and a header in the other. | [BACKLOG §Anchor kinds](BACKLOG.md#anchor-kinds-three-that-name-real-things-and-drop-sibs0) |
| 9 | **Edge crossings.** *"A lot of unnecessary edge crossings."* Cause **unmeasured** — do not speculate. Layout is `useGraphLayout`. | ? | — |
| 10 | **Dead code: `buildRelationGroups`.** It feeds `countsOf` for `NodeVM`'s `relatedCount`/`shownCount`, and **nothing renders those any more** — the relation bar counts its own rows. A second layer of dead code inside a live file. | small | [BACKLOG §Dead code](BACKLOG.md#dead-code-left-by-the-relation-bar) |

⚠️ **Items 5 and 11 are investigations wearing a quick win's clothes.** Both have
unmeasured causes. The standing rule is measure before proposing one.

---

## Then — cleanups with a known shape

  | #  | Task                                                                                                                                                                                                                                                            | Where                                                                                                                        |
  |----|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------|
  | 11 | **Palettes that only half-exist.** Every element-type color is defined **twice** — a palette `hex` and eleven hand-picked Tailwind literals — in two forms that cannot be derived from one another. Changing `RANGE_COLORS` moves the SVG hex and nothing else. | [BACKLOG §Palettes](BACKLOG.md#palettes-that-only-half-exist)                                                                |
  | 12 | **One inheritance accessor, with a required argument.** Inheritance is derived two independent ways today and neither calls the other. Decided 2026-08-24.                                                                                                      | [OWNERSHIP_CLASSIFICATION §PLANNED](OWNERSHIP_CLASSIFICATION.md#planned--one-inheritance-accessor-with-a-required-argument) |
  | 13 | **A sync check that each `containmentGraph` override slot name still has exactly one site.** The sets are keyed by SLOT NAME, not `(class, slot)`, and every member happening to occur at one class is **luck, not design**.                                    | [BACKLOG §Config rot](BACKLOG.md#hand-curated-config-rot)                                                                    |
  | 14 | **Improve the intros to README and the first tour** — they might share text. README's *Model shape* does not actually describe the model's shape; it describes how the app adjusts it for comprehension. [sg]                                                | [README](../README.md) · [§1](TOURS_AND_CONTENT.md#1-the-biodata-catalyst-harmonized-model) |
  | 15 | Consider using https://github.com/cmacmackin/markdown-include or https://github.com/zimbatm/mdsh to allow shared includes                                                                                                                                       |                                                                                                                             |

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
