# Tasks

> **What is actually next.** Everything here is open. Deferred and parked work
> is in [BACKLOG.md](BACKLOG.md); reasoning and dead ends are in
> [WORKLOG.md](../WORKLOG.md) (written for the next session, not for Siggie);
> completed rounds are in [archive/](archive/).
>
> Architectural rules and the gotchas to read before running anything are in
> [CLAUDE.md](CLAUDE.md).
>
> **Refer to a task by its tag, never by its row.** Row order is priority and
> changes; the tag is permanent and follows the task into [archive/](archive/)
> when it closes, so `TASKS drop-sibs` in a code comment still resolves after
> the table has been reordered three times. References to "item 2" in older
> comments name the table of their date — resolve them through the archive.
>
> **A subtask is `parent/child`** — `help-finish-authoring/ownership` — written
> as its own row directly under the parent. The slash keeps the parent's tag
> greppable from the child's, which is what the old `1a`/`1b` numbering was
> for, without a number that moves.

---

## Now — finish the tours

The active work. The plan is [TOURS_AND_CONTENT.md](TOURS_AND_CONTENT.md).

 | Tag               | Task                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Where                                                                          |
 |-------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------|
 | `help-finish-authoring` | **Finish the tour content: review, clean up and improve all five tours, in back-and-forth sessions.** Siggie reads the tours ([`read-tours`](#now--finish-the-tours)); the joint work is the writing. **Audience, decided 2026-09-11: researchers, one audience** — with the detail kept, because a researcher (or anyone) who needs to get into the weeds, author their own schema or harmonize to this one needs the full explanations. No separate LinkML-community argument for now. Subtasks below. | [help-content.md](../src/explore/help-content.md) |
 | `help-finish-authoring/ownership` | **The Ownership tour.** Siggie has started rewriting it in `help-content.md` into a version that makes more sense to them (the `why-ownership` entry and its beats, 2026-09-11); the most to do is here. Consider [`ownership-rules`](#now--finish-the-tours) first — it changes what the tour has to explain, and the rule NAMES in the tour come from it (Siggie's `why-ownership` comment is where they were chosen). | [help-content.md](../src/explore/help-content.md) |
 | `help-finish-authoring/why-overlap` | **Overlapping or similar text in the `why` and `linkml-context` entries.** Decide what each says and cut the duplication. This is what is left of the old `why-argument` task now that the audience question is settled (above); the parked discussion is in [BACKLOG §why](BACKLOG.md#the-why-argument--two-audiences-one-step). | [help-content.md](../src/explore/help-content.md) |
 | `read-tours` | **Read the tours in the browser (Siggie).** What the tests cannot see: whether the ringed element is actually on screen at that step (a collapsed panel row, a popover sitting over the thing it describes) and whether the copy reads well. Findings feed `help-finish-authoring`. `bdchm-entities` still holds `[put some intro text here]`. Delete [TOURS_AND_CONTENT.md](TOURS_AND_CONTENT.md) when the authoring is done. | [help-content.md](../src/explore/help-content.md) |
 | `ownership-rules` | **Simplify the ownership rules, then rewrite the doc to match.** The plan is [OWNERSHIP_RULES_PLAN.md](OWNERSHIP_RULES_PLAN.md); read it first. Merges what were `drop-association`, `ownership-rules-declarative` and `ownership-doc-cleanup` — they turned out to be one task, because the doc documents the rules and rewriting it before they settle means rewriting it twice. Two commits already landed and are reviewed (`6531af5` association classification dropped, `16234a0` the rule/edge-kind declaration). **What is left:** seven classifier rules collapse to three (`multivalue-owns-fwd`, `single-value-belongs-to-bkwd` + its exception `single-value-owns-fwd`, `child-following-parent`); `entity-ranged`, `cardinality-split` and `backward-multivalued` are deleted outright, their members becoming range-keyed entries in `SINGLE_VALUE_OWNER_TARGETS`, which is then the ONLY set with members; the legend renders the exception nested under Rule 2 in teaching order; `required` joins `SlotFacts` unused; and OWNERSHIP_CLASSIFICATION.md is rewritten alongside. Closes [`override-site-check`](#then--cleanups-with-a-known-shape) too — no slot-name overrides survive for it to check. | [ownershipRules.ts](../src/models/ownershipRules.ts) |
 | `tour-links`      | **Link from tour text to another tour position.** [sg] would be nice to have a way to link from tour text to other tour positions. Syntax undecided: an ordinary markdown link whose target is a location, or `{{link:link text:location}}`, or something else, where location is something like `[tour name or abbr\|step id\|optional beat title]`. Jumping itself exists (`startTour(name, at)`, `goToStep`); what is missing is the authoring syntax, resolving it at parse time so a bad target fails the content test, and rendering it in the popover. Shares the location grammar with `beats-in-map`.                                                                                                                                                                                                                                                                                                                                                | [FORMAT.md](../src/help/FORMAT.md)                                             |
 | `schema-comments` | **Surface the schema's `comments` field.** LinkML `comments` is a structured field, not loose yaml — 1054 of them in `bdchm.processed.json`, already parsed by [dataLoader](../src/utils/dataLoader.ts) and already carried on `SlotDefinition`/`EnumDefinition` in [SchemaTypes.ts](../src/models/SchemaTypes.ts). **Enums already use it** ([Element.ts](../src/models/Element.ts), `getExtendedDescription`); slots and classes silently discard it. It holds real content — e.g. `days_supply`: "should be left empty if the source data does not contain a verbatim days_supply, and should not be calculated from other fields" — which is guidance a reader wants and the description does not carry. Render it distinctly from the description, the way [`schema-includes`](#now--finish-the-tours) wants schema prose set off from ours. [sg] | [DetailDrawer.tsx](../src/explore/DetailDrawer.tsx) |
 | `schema-includes` | **Set off `{{model-description:X}}` includes.** [sg] could we have text from `{{model-description:ResearchStudyCollection}}`-type includes set off in some way with title text on the block saying where it came from? or even some kind of link to take you there in the schema? A reader cannot currently tell the schema's own words from ours. The include is expanded in `fillPlaceholders`; the block would need to survive markdown rendering as an element the CSS can style (a `<blockquote>` or a `<div>` with a data attribute), with a title like "from the BDCHM schema" and, if the generated docs URL pattern is stable, a link to that class's page.                                                                                                                                                                                                                                                                                          | [parseHelpContent.ts](../src/help/parseHelpContent.ts)                         |
 | `beats-in-map`    | **Beats in the map, and a beat `Subtitle:` field.** [sg] would like to have a beats expansion in maps: perhaps the beat count badge opens the list of beat titles; which means beat titles become meaningful text. The plan: (a) add a beat `Subtitle:` field; (b) `Subtitle:` and a `#####` heading on the first line of the description are equivalent in display; (c) if `Subtitle:` is missing, the beat title is used as the subtitle; (d) if the field appears and is empty (or `none`?), no subtitle; (e) the map's expansion uses the subtitle, so the beat title can stay a stub. Today every beat description opens with a hand-written `##### Name` heading that duplicates the beat title, which is the thing (b) and (c) would make redundant.                                                                                                                                                                                                   | [TourMap.tsx](../src/help/TourMap.tsx), [FORMAT.md](../src/help/FORMAT.md)     |
 | `elk-layering`    | **Research: what ELK lets us force about layering.** [sg] i know you can't force positioning on ELK, but can you force anything about layering? Start from what `elkLayout.ts` already uses: `elk.partitioning.activate` with a per-node `elk.partitioning.partition` (nodes in a lower partition are laid out in earlier layers, which is the ownership left-to-right), and `elk.layered.considerModelOrder.strategy: NODES_AND_EDGES` (node order within a layer follows input order). Beyond those, ELK's layered algorithm has per-node `elk.layered.layering.layerConstraint` (`FIRST`, `LAST`, `FIRST_SEPARATE`, `LAST_SEPARATE`), the `elk.layered.layering.strategy` choice, and `elk.layered.crossingMinimization.semiInteractive` with `elk.position` to fix in-layer order. The task is to write down which of these the diagram would benefit from, with an example canvas where the current layering is wrong, before changing anything.         | [elkLayout.ts](../src/explore/graph-core/elkLayout.ts)                         |
 | `show-the-change` | **Show the change instead of narrating it.** `Action:` is a past-tense receipt, which reads well when the VIEWER clicked and badly when the tour did it off-screen. Siggie's sequence: anchor the unchecked row → check it → anchor the entity that appeared. Hand-authored as a trial in tour 1 (2026-09-08) at the cost of three beats where there was one; **reverse it if it reads worse**. The feature is deriving that from one beat. Needs design: the popover must reposition BETWEEN phases, which the position model has no notion of, and a half-applied step is a state `back` cannot name. [sg] what i wanted was for one change step to be animated so it's clear to user what's going on. maybe the popover doesn't need to move? stow it on the right somewhere and go to its anchor only when the change is complete. but what the user would probably need to see is the cursor moving to the checkbox (or relation menu or attribute row). | [BACKLOG §Show the change](BACKLOG.md#show-the-change-instead-of-narrating-it) |
 | `address-readout` | **Delete the tour-address readout** once the five tours are written. A dev-only `Show content ids` item at the foot of the Help menu, gated on `import.meta.env.DEV`; it exists to make a popover on screen findable in the content file.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | [FORMAT.md](../src/help/FORMAT.md#finding-a-step-you-can-see-on-screen)        |

⚠️ **The menu is the ONLY way into a help-only entry.** The other route was help
mode's `?` hints, and `HELP_MODE_ENABLED` is false — `HelpLayer` renders them
only `if (helpMode && !inTour)`, so a `data-help-id` tag anchors and rings but
opens nothing when clicked. Checked 2026-09-05: `toolbar-siblings` (now
`merged-boxes`, unanchored since the toggle went 2026-09-10),
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

⚠️ **What the anchor tests do and do not cover.** Kind and ARGUMENT are both
checked against the live schema and the category config, so `entity-row:Participnt`
fails the build rather than degrading to an unringed popover. Since 8a
([`helpAnchors.test.tsx`](../src/test/helpAnchors.test.tsx)) every DIAGRAM anchor
is also run against the tags its own step's `Change:` would emit — which is how
three live `node-box:` anchors on merged children were caught. **The remaining gap
needs the browser**, and is two things: a step with NO `Change:` inherits whatever
selection is on screen, so there is no canvas to check it against; and whether an
element is actually in the DOM at that moment (a collapsed row, a panel in tree
mode) resolves to nothing for reasons no test can distinguish from a real bug.

---

## Next — correctness, in priority order

| Tag | Task | Est. | Where |
|---|---|---|---|
| `elk-worker` | **Stop killing a warm ELK worker; then delete the timing instrumentation.** `temp/elk-timings.jsonl` was read 2026-09-09 (347 runs): p50 153ms, p90 322ms, floor ~100ms even for 2-node graphs — and **every run was cold**, because `useGraphLayout`'s effect cleanup calls `engine.cancel()` on every spec change whether or not a run is in flight, so every click pays worker startup. Terminate only when a run is actually pending. That likely settles `SPINNER_DELAY_MS` at its current 200 (26% of runs exceed it today; almost none should once warm). Then delete `scripts/elkTimingPlugin.ts` + `src/explore/graph-core/elkTiming.ts` and the `recordElkTiming` call in [elkLayout.ts](../src/explore/graph-core/elkLayout.ts). | 30 min | [useGraphLayout.ts](../src/explore/graph-core/useGraphLayout.ts) |
| `nav-guards` | **The tour's navigation guards fail silently.** `goTo`, `goToStep` and `startTour` each bail with a bare `return`. ⚠️ **No longer hypothetical** — this swallowed BOTH tour-map dead-click bugs on 2026-09-08 (`d0519dc`); each took far longer to find than it should have, and a dead UI is what Siggie reported as *"weird state"*. Both root causes are fixed; the silence is not. **Loud is the right call** — a `console.warn` per bail naming the guard and what it was asked for, not the reverted deferral machinery. | 15 min | [BACKLOG §goTo](BACKLOG.md#gotos-silent-no-op) |
| `drop-sibs` | **Drop `sibs=0`.** Siggie: *"i never use it anyway and it really crowds the canvas."* The anchor vocabulary does not need it — `child-header:` and `node-box:` name different things in either mode. **The toolbar button and the unmerged render path went 2026-09-10** (siblings always merge now); what is left is plumbing: the `sibs` URL param and `DEFAULTS`/`toQuery`, `LS_KEYS.sibs`, the tour state stack scalar, `ExploreApp`'s `mergeSibs` state and the inert props on `OwnershipGraphView`, FORMAT.md's param table, and the tests that round-trip the param. | ? | [BACKLOG §Drop sibs=0](BACKLOG.md#drop-sibs0) |
| `edge-crossings` | **Edge crossings.** *"A lot of unnecessary edge crossings."* Cause **unmeasured** — do not speculate. Layout is `useGraphLayout`. | ? | — |
| `dead-relation-groups` | **Dead code: `buildRelationGroups`.** It feeds `countsOf` for `NodeVM`'s `relatedCount`/`shownCount`, and **nothing renders those any more** — the relation bar counts its own rows. A second layer of dead code inside a live file. | small | [BACKLOG §Dead code](BACKLOG.md#dead-code-left-by-the-relation-bar) |
| `map-jump-canvas` | **Jumping to a step from the map does not always clear the canvas.** Siggie, 2026-09-10, intermittent and withdrawn for now: "sometimes it does". Unreproduced; nothing changed. Suspects and the first probe to write are in the backlog entry. | ? | [BACKLOG §map jump](BACKLOG.md#jumping-to-a-step-from-the-map-does-not-always-clear-the-canvas) |

⚠️ **`edge-crossings` is an investigation wearing a quick win's clothes.** Its cause is
unmeasured. The standing rule is measure before proposing one.

---

## Then — cleanups with a known shape

  | Tag | Task                                                                                                                                                                                                                                                            | Where                                                                                                                        |
  |----|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------|
  | `palettes` | **Palettes that only half-exist.** Every element-type color is defined **twice** — a palette `hex` and eleven hand-picked Tailwind literals — in two forms that cannot be derived from one another. Changing `RANGE_COLORS` moves the SVG hex and nothing else. | [BACKLOG §Palettes](BACKLOG.md#palettes-that-only-half-exist)                                                                |
  | `inheritance-accessor` | **One inheritance accessor, with a required argument.** Inheritance is derived two independent ways today and neither calls the other. Decided 2026-08-24.                                                                                                      | [OWNERSHIP_CLASSIFICATION §PLANNED](OWNERSHIP_CLASSIFICATION.md#planned--one-inheritance-accessor-with-a-required-argument) |
  | `lint-baseline` | **The lint baseline is wrong, and one real bug hides in it.** [CLAUDE.md](CLAUDE.md) says 20 pre-existing errors; `npm run lint` reports 30, which makes the "compare against the baseline" instruction unusable. Two causes worth separating: **(a)** `.vite/deps/` build artifacts are being linted — add an ignore; **(b)** [`Section.tsx`](../src/components/Section.tsx) calls `useExpansionState` conditionally (`react-hooks/rules-of-hooks`), a genuine latent bug — hook order changes if `expansionKey` ever varies for a mounted Section. Fix (b), ignore (a), then re-record the real number. | [eslint.config.js](../eslint.config.js) |
 | `override-site-check` | **DISSOLVES with [`ownership-rules`](#now--finish-the-tours)** — after that work no set is keyed by slot name, so there are no sites to check. Close it there rather than doing it. Original: **a sync check that each `containmentGraph` override slot name still has exactly one site.** The sets are keyed by SLOT NAME, not `(class, slot)`, and every member happening to occur at one class is **luck, not design**.                                    | [BACKLOG §Config rot](BACKLOG.md#hand-curated-config-rot)                                                                    |
  | `intros` | **Improve the intros to README and the first tour** — they might share text. README's *Model shape* does not actually describe the model's shape; it describes how the app adjusts it for comprehension. [sg]                                                | [README](../README.md) · [§1](TOURS_AND_CONTENT.md#1-the-biodata-catalyst-harmonized-model) |
  | `md-includes` | Consider using https://github.com/cmacmackin/markdown-include or https://github.com/zimbatm/mdsh to allow shared includes                                                                                                                                       |                                                                                                                             |

---

## Waiting on Siggie

- **Should the parent's own edge in a fan render black?** Specified black; ships
  in the shared channel colour. [BACKLOG §Edge fan](BACKLOG.md#the-fan-from-observationsetobservations)
- **Obstacle-aware routing for dragged nodes** — not scoped, needs a go-ahead.
  [BACKLOG §Dragging](BACKLOG.md#dragging-is-unfinished)
- [BACKLOG §dag-browser](BACKLOG.md#dag-browser) -- dag-browser currently disabled.
  Too much work. BUT, using it in this app does a great job showing what's broken
  about it that needs fixing. So this should be added as a task for the dag-browser
  project, but when ready to work on it, the work might usefully be performed here.
  This is no longer 'waiting on siggie' but the task of adding it as a task in dag-browser
  is itself a task.

---

## Explicitly not now

Chip-strip redesign · panel resizing/detaching · the ownership legend rebuild ·
CURIE links · the bare diagonal · dragging polish · example-cases restructuring
· extracting `packages/tour-help/` · bringing help mode back.

All keep their full write-ups in [BACKLOG.md](BACKLOG.md) — nothing is lost.
