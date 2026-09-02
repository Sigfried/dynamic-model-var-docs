# Tasks

> **Active planning document — open work only.** Completed and superseded
> rounds are in [docs/archive/tasks-2026-08.md](archive/tasks-2026-08.md),
> which was cut twice: 2026-08-27 and again 2026-08-28.
> Architectural rules and workflow are in [CLAUDE.md](../CLAUDE.md).
> Reasoning and dead ends are in [WORKLOG.md](../WORKLOG.md) — written for the
> next session, not for Siggie.

**Everything listed here is still to do.** If a section names a status, it is
open, deferred, or waiting on Siggie — nothing on this page is finished. The
canvas-content task and the tour-state push/pop stack both shipped and are in
the archive along with the S3a/S3b briefs and the 2026-08-26 planning round.

---

## 🗓️ THE LIST

  | # | Task                                                                                                                                                                                                                                                                                                                                            | Est.     | Status                  | Detail                                                                                        |
  |---|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|-------------------------|-----------------------------------------------------------------------------------------------|
  | 1 | Tour format — remaining bits after the 2026-08-28 pass: multi-line for the *other* prose fields, and moving help-only entries below the tour steps                                                                                                                                              | ~small   | 🟨 mostly done          | [§](#-the-tour--copy-is-what-remains)                                                         |
  | 2 | **Legend from a single entity's perspective** — describe it to them first. (carry-forward #3)                                                                                                                                                                                                                                                   | ~unknown | ⬜                      | [§](#smaller-items-raised)                                                                    |
  | 3 | **Re-render regression** — "most clicks refresh the main panel". **Measure, don't guess**                                                                                                                                                                                                                                                       | ~unknown | ⬜ still uninvestigated | [§](#still-not-investigated--the-one-thing-that-is-not-understood)                            |
  | 4 | **Edge crossings.** Cause unmeasured                                                                                                                                                                                                                                                                                                            | ~unknown | ⬜                      | [§](#smaller-items-raised)                                                                    |
  | 5 | **Drag the tour popover.** [sg] apparently popover gets repositioned every 250ms, so dragging won't work. think about this more later.                                                                                                                                                                                                          | ~0.5 day | ⬜                      | [§](#tour-and-help)                                                                           |
  | 6 | **Migrate positioning to CSS anchor positioning** — deletes the 250ms poll, the flip/clamp, and the `EST_H` guess. **UNBLOCKED: S3b's resolvers landed.** Note `slot-row` selects on a PAIR of attributes, which no single `anchor-name` rule expresses                                                                                         | ~0.5 day | ⬜ ready                | [HelpLayer.tsx header](../src/help/HelpLayer.tsx) · [HELP_PACKAGE_PLAN](HELP_PACKAGE_PLAN.md) |
  | 7 | **`goTo` fails silently when the tour has no positions** — `startTour()` before the content is ready does nothing at all, with no error. Not currently reachable; a landmine for the next programmatic caller                                                                                                                                     | ~15 min  | ⬜ ready                | [§](#gotos-silent-no-op)                                                                       |
  | 8 | **Palettes that only half-exist** — `elementTypes` carries a `hex` from the palette AND eleven hand-picked Tailwind literals per type. Every color is defined twice, in two incompatible forms                                                                                                                                                | ~unknown | ⬜                      | [§](#palettes-that-only-half-exist)                                                            |

---

### 🍒 QUICK WINS

Both 2026-08-28 quick wins are **done** (`1e4d8f6`) and archived: the dark-gray
box headers, and the `entityCol` tooltips that said "ranges".

One follow-up was found while doing them and deliberately **not** fixed:
`EntityTable.tsx:152-158` carries its own hardcoded `"…ranges"` badge tooltips
that bypass the vocab config entirely. They render in the **Nested Tabular**
view (`previous.html`), not the Explore SPA. Left alone; Siggie saw them and
said it was fine.

**Deliberately NOT quick wins**, though they look small: edge crossings and the
re-render regression (item 3) — both have **unmeasured causes**, and the
standing rule is measure before proposing one. They are investigations wearing a
quick win's clothes.

### Explicitly NOT this week

Panel resizing/detaching · categories in the tree (design question, not a bug) ·
the ownership legend (postponed by Siggie) · multi-category membership ·
CURIE links · the bare diagonal · dragging polish · example-cases restructuring.
These keep their write-ups below so nothing is lost.

---

### No horizontal scroll in the tree

Siggie, 2026-08-26: *"i don't see any horizontal scroll capability"*. MEASURED
by reading the mount site, and re-verified 2026-08-28 (the line moved, the
structure did not): `selectionTree.css:21` puts `overflow-x: auto` on
`.dbw-root`, but `ExploreApp.tsx:301` wraps it in
`<div className="flex-1 overflow-y-auto min-h-0">` — **that** ancestor is the
one sized to the fixed `w-96` panel, so it clips first and the inner scroll
container never has anything to scroll.

The row overlap that used to accompany this went away because of the 18ch xref
clamp, not because scrolling started working. Fix belongs on the ancestor — but
see the chip-strip work first; scroll may not be the answer.

---

## 🚦 THE TOUR — copy is what remains

### Format pass done 2026-08-28 — what changed, and what is left

Siggie wrote a `## TODO` section into the help content file (then
`src/help/help-content.md`, now `src/explore/help-content.md`) listing five
complaints and asked for a discussion first (*"i have to deliver in four hours
and still have a tour to author"*). Done in that session:

- **`Tour:` names a tour; ORDER COMES FROM THE FILE.** `Tour: Walkthrough`, not
  `Tour: 3`. Inserting a step is a paste — nothing renumbers. Multiple tours can
  share the file (`Tour: Deep dive`). Siggie's design, better than either option
  offered.
- **`Description:` is a multi-line markdown block** — paragraphs, bullet lists,
  links. `app-title` is back in the draft's order; `selection-tree`'s bullets
  render (they were in the file, the parser was dropping them).
- **Links render as links** — was a missing `a` rule in `help.css`, never a
  parser bug. Open in a new tab so following one does not drop the tour state.
- **Lists have markers again** — Tailwind's preflight resets `list-style: none`
  and nothing set it back, so `Interactions:` bullets have been unmarked since
  the popover shipped.
- **The `## TODO` section no longer breaks the parser** (it did; its `###`
  headings parsed as entries).

**Left open, both small and both Siggie's call:**

1. **Multi-line for `Context:` / `Action:` / beat text.** Deliberately not done
   — *"1 for now; may need 2 soon"*. `extractBlockField` is generic, so each is
   a one-line change.

**Done in the second pass (same day):** help-only entries moved below the tour
steps *per section* (Siggie's choice, so each entry stays beside the topic it
explains — only `selection-tree-mechanics` was actually interleaved), and every
`## ` section wrapped in `<details>` so the file folds on GitHub. The wrapping
exposed two parser bugs, both fixed and tested: `</details>` was being swallowed
into the last entry's `Description:`, and `parseSection` read its title from
line 0 so every section became `'Unknown'` (latent regardless — `title` is
unused). The `<summary>` repeats the `## Heading` on purpose; the parser
identifies sections by `^## `.

The spec is still long — 8 `###` sections, now 9. **Which parts read badly has
still not been diagnosed**; the format changes above may have removed the
confusing part or may not have touched it. Ask before rewriting.

**Editing the tour is safe — the tests catch the real mistakes.** Verified by
deliberately breaking the content and confirming each failure, so these are
demonstrated, not assumed:

| Mistake | Caught by | Message |
|---|---|---|
| Typo'd anchor kind (`entity_row:`) | `every anchor names a known kind` | names the entry and the bad kind |
| Step changes state with no `Action:` | `a step that changes state says what it did` | names the exact position |
| `help-id` anchor with no tagged element | `every help-id anchor is actually tagged` | lists untagged ids |
| Leftover numeric `Tour: 3` | `no entry still carries an old numeric Tour:` | names the entry and its value |
| Unknown `State:` param | `every State: field is a parseable query string` | names entry and param |

So: edit freely and run `npx vitest run src/test/helpContent.test.ts` (fast,
~700ms). A green run means the content is structurally sound; it says nothing
about whether the copy reads well, which is the part only you can judge.

**Resolver anchors are the exception** — `entity-row`, `slot-row`,
`entity-checkbox` and `node-box` are checked for *known kind* but cannot be
checked for *actually resolving*, since there is no attribute to grep. A typo in
the ARGUMENT (`entity-row:Participnt`) passes every test and degrades silently
to an unringed popover. Those need the browser.

### Deferred — authoring notes and draft preview

Raised by Siggie 2026-08-27 while reviewing the S3a format, deferred the same
day for time: *"i want all the options and maybe an ability to view the draft
version of a tour, but no time now."*

Four distinct needs, all currently served by HTML comments:

| Want | Sketched as | Renders? |
|---|---|---|
| Notes to self | `- **Note:** ...` | never |
| Half-written copy | `- **Draft:** ...` | yes, marked loudly as unfinished |
| Instructions to Claude | `- **ForClaude:** ...` | never |
| A step written but not ready | `- **_Tour:** 4` | **shipped** — see below |

**The parking half is already done.** Prefixing any field with `_` parks it:
`_Tour:` drops an entry out of the tour while keeping it as help. That covers
the "not ready yet" case; the three note fields are what remains.

**The interesting part is the draft preview**, and it is why this is a task
rather than three fields: viewing a tour *including* its parked steps and
unfinished `Draft:` text means a second rendering mode, not just a parser
change. Worth designing rather than bolting on.

Until then: HTML comments work, never render, and are what the S3a translation
already uses (`TODO(siggie):` beside each entry with a gap).

---

### Current tour unfinished draft


## 🧱 CANVAS AND LAYOUT

### Deferred — "hide all" leaves boxes behind with nothing shown

Siggie, 2026-08-27, on seeing it: *"i guess this is correct but a little
surprising. maybe consider dealing with eventually."* **Filed, not scheduled.**

Repro: select MeasurementObservation → on it, `add all` *belong to me by my
attribute* → on BodySite, `add all` *I belong to, by their attribute* → on
Observation/MeasurementObservation, `hide all` *belong to me by my attribute*.

What you get: Condition, Procedure, ImagingStudy, SpecimenCreationActivity and
Observation still drawn, each reading **`N related · 0 shown`**, several with no
edges at all — boxes with no visible reason to be there.

**It is correct, and that is the point.** Those classes were added a second
time by BodySite's `add all`, so they are selected in their own right; the
`hide all` on Observation removed only what *Observation's* group named. Nothing
is tracking "who asked for this", by design — that is exactly the provenance
the selected/expanded merge deleted, and reintroducing it to make `hide all`
cascade would undo the simplification.

So the surprise is not the removal semantics, it is that **a box can survive
with `0 shown` and no edges**, which reads as breakage even when it is right.
Options if this gets picked up, cheapest first:

1. Do nothing. It is self-consistent and the checkboxes explain it.
2. Style the `0 shown` / edgeless case so it reads as deliberate rather than
   stranded.
3. Have `hide all` offer to drop the boxes it just orphaned — a follow-up
   action, still no provenance tracking.

**Do not** solve it by making `hide all` cascade through provenance.

---

### ✅ MOSTLY DONE — Edge rendering — the fan from `ObservationSet.observations`

> **The source-row half shipped 2026-08-31 (`4bd5755`).** The rule below —
> one edge per declaring class, coloured by that class — is what the fix
> delivers: each `…ObservationSet.observations` edge now leaves its OWN row
> instead of all of them sharing one.
>
> The cause was not the merge logic. The view model was always right; the row
> port id in `buildSpec` was keyed on the slot NAME alone, so the parent row and
> every child override claimed one port and `addPort` kept only the first — every
> later edge silently inherited the first one's y. Which row won depended on
> enumeration order, so it looked like two different bugs. Regression test in
> `src/test/mergedEdges.test.ts` asserts on the PORTS, since the pre-existing
> anchor assertion passed throughout the bug's life.
>
> **Still open here:** the parent's own edge renders in the shared channel
> colour, not black as specified below. Confirm whether black is still wanted.
>
> **The target half is separate and still open** — see the narrowed-edge section
> below, whose design question is now void.

img-3 shows ~5 colored edges leaving one source row and landing on one target
header. Siggie's three options were: one black edge / colored edges to child
headers / keep-and-explain. **They then specified what they actually want, which is
neither of the first two as stated:**

> *"ObservationSet.observations should be one black edge;
> DimensionalObservationSet.observations should be one blue edge (ideally to
> DimensionalObservation but could be Observation because of edge crossings),
> etc."*

I.e. **one edge per DECLARING class, colored by that class**, black for the
parent's own slot. This resolves the fan at the source rather than the target,
so it avoids both the tangle and the crossings their objection to option 1 raised
(*"the problem with option 1 is there would probably be a lot of edge crossing.
easier to read with colors, but not ideal"*).

Rejected: **keep-and-explain** — it needs explaining *because* it is not
working; documentation is not a fix for an unreadable diagram. Rejected as a
blanket rule: **one black edge for everything** — it loses genuine modeling
content, because `observations` is narrowed per subclass (DimensionalObservation**Set**
→ DimensionalObservation, etc.), and one black edge drops the fact that each set
holds its own kind. That answers Siggie's carry-forward question *"with option
2, is there information we'd be losing when there's slot_usage involved?"* —
**yes, real loss.**

**⚠️ ObservationSet — Siggie's carry-forward #2 needs REVISING, the premise is
wrong.** Siggie said: *"I guess if it's abstract then there's no case in which an
ObservationSet could own Observations, only in subclasses. so, yeah, i think
suppress."* MEASURED against `public/source_data/HM/bdchm.yaml`:

- **`ObservationSet` is NOT abstract.** No `abstract: true`; it is
  `is_a: Entity` with a plain description. Neither are Observation,
  DimensionalObservationSet, MeasurementObservationSet or SdohObservationSet.
- **But ObservationSet DOES declare `observations`** — its slots are `category,
  focus, method_type, performed_by, observations, associated_visit,
  associated_participant` — and the subclasses each *narrow* it
  (DimensionalObservationSet → DimensionalObservation, etc.).

So the conditional they attached their decision to ("if it's abstract") is false,
and suppression cannot be justified on those grounds. The black
`ObservationSet.observations → Observation` edge represents a real slot on a
real instantiable class.

> ✅ **ANSWERED (Siggie, 2026-08-27): don't suppress.** Asked again with the
> corrected premise — "ObservationSet is concrete and declares `observations`;
> do you still want its edge hidden?" — and the answer was no. So the edge is
> drawn, and this section's rule stands unqualified: **one edge per declaring
> class**, black for the parent's own slot.

**Also in scope here:** the missing `Specimen.quality_measure` edge (item 4
above) — same subsystem, same merge-suppression cause.

### Chip strips → relation counts + menu (the main redesign)

Siggie: *"i think we need something other than chip strips. we should talk about
it. they're ugly and also tend to have text overlap."* Confirmed by img-3
(Observation carries 13 `owned by` chips over three wrapped lines plus an `owns`
strip plus `add all`; the box is mostly chips before it is mostly content).

**Keep the underlying model.** "Relations that exist but are not drawn" is
sound and is what stops Organization being a dead end (img-4). It is the
*presentation* as inline wrapped chip strips that fails — and it fails
structurally, per item 2 above.

#### How many relationship types — CORRECTED

An earlier answer in-session said "only two, `owns` / `owned by`, and
`hiddenOwned` is not a new type" on the grounds that the DAG flips `own-bkwd`
at build (`containmentGraph.ts:267`) so `parents`/`children` are pure direction.
**Siggie rejected this, correctly:**

> *"i'm not sure i'm happy with the new `hiddenOwned` getting merged with owns.
> the distinction is sort of like 'mine because i say so' and 'mine because it
> says so'."*

That distinction is real and user-visible: whether the relationship is declared
on my class or on theirs changes what you would edit to change it. From a single
entity's perspective there are **four** ownership positions plus association:

| | declared on me | declared on them |
|---|---|---|
| **I own it** | own-fwd (my attribute) | own-bkwd flipped (their FK) |
| **it owns me** | own-bkwd (my FK) | own-fwd (their attribute) |

Siggie's own labels, which are better than anything currently in the code:
*"N belong to me by my attribute," "N belong to me by their attribute," "N I
belong to," "N associated with."* Compare `OwnershipLegend.tsx:33`, which has
`'owns (forward)'` / `'belongs to (backward)'` / `'association (no ownership)'`
— those describe the **classifier**, not the reader's situation.

**⚠️ Implementation consequence, know this before designing:** the DAG **flips
`own-bkwd` at graph-build time** (`containmentGraph.ts:267`), so by the time you
hold `parents`/`children` the declaring side has been erased. Recovering it for
the chips means **carrying the verdict through the DAG**, not just the
direction. Not deep, but not free either.

**Associations must be surfaced.** Siggie: *"there are only two association
edges currently. but they shouldn't be hidden from user. i guess they get their
own `associated with 1`."* They currently appear in neither strip.
`ASSOCIATION_SLOTS` = `related_document`, `container`
(`containmentGraph.ts:68`).

#### Shape

Replace N inline chips with a **count per relation type**, expanding to a menu:

> *"i was thinking each gets its own row. or it could be a cascading menu
> starting from something sort of like 'N related' and branching to 'N belong to
> me by my attribute,' 'N belong to me by their attribute,' 'N I belong to,'
> and 'N associated with'."*

Rows and the cascade are compatible — the rows **are** the top level of the
cascade. Rows are the safer default because a fixed-height row per category is
what makes box height predictable (item 2).

**Re-hiding: yes, include it.** Siggie: *"on the menu level with the individual
related entities, clicking displays it, but if it's displayed it could be grayed
out, and is there any reason not to allow clicking one of these (or a red x next
to it) to re-hide it?"* No reason not to. This is strictly better than today's
chips and it preserves the drawn/undrawn state that would otherwise be lost when
chips collapse to counts. It also gives the fan-out control (below) somewhere to
live: pick one, several, or all, with the count showing the cost before you
click.

#### Fan-out — why `add all` is dangerous today

MEASURED. `expand` (`ExploreApp.tsx:164`) adds exactly one id, so the extra
boxes are not the click — they come from `ownershipSubgraph.ts:290`, where
**one-hop-up is applied to every core node including newly expanded ones**,
capped at 5.

Probe, Participant selected alone → 4 boxes:
`Participant:selected, Organization:context, Person:context, ResearchStudy:context`.
Then expanding DimensionalObservation → **7 boxes**, adding
`DimensionalObservation, DimensionalObservationSet, Visit`. Cause:
DimensionalObservation's parents are `Organization, DimensionalObservationSet,
Participant, Visit`; Organization and Participant are already drawn, so the
other two arrive uninvited. **One chip clicked, three boxes appeared.**

`add all` multiplies the same rule: ~4 ids each pulling up to 5 owners, drawn
from across the graph so they barely overlap — roughly 4 requested, up to ~20
drawn. On Organization's 14-item strip it is far worse.

**Siggie is inclined to distinguish selection from expansion** (expanded nodes
arrive bare; their owners appear as counts to expand from) — *"I'm inclined to
agree about distinguishing selection from expansion. But let's see where we end
up with chip strip replacement before implementing."* **Deferred deliberately:
the redesign may dissolve the question.**

### ▶️ OPEN — a narrowed edge should point at the CHILD's header, not the box

> Restored 2026-08-26 — deleted in `0c9db03` while NEXT UP still pointed
> at it, same as the multi-category write-up below. Original:
> `git show 4f33c23:docs/TASKS.md` lines 69–99.

Siggie, 2026-08-25, deferred deliberately: *"IF the container is also a merged
box (e.g., ObservationSet, MeasurementObservationSet), then the edge points at
the appropriate header."*

**The case.** `MeasurementObservationSet.observations` narrows its range from
`Observation` to `MeasurementObservation` (verified: all three ObservationSet
children narrow `observations` to their matching Observation subtype). Both
ends are merged boxes. The edge leaves the `MeasurementObservationSet` block
of one box and should ARRIVE at the `MeasurementObservation` header inside the
other — today it lands on the target box's header band like every other edge.

**Why the entity end is different.** It has never carried row meaning. From the
file header: *"the ENTITY END attaches to a header-level port on the target
class, which has no corresponding row, so edges point at the entity name."*
That assumption is load-bearing for the fan (`freeEndTotal`/`freeEndSlot` spread
ports across the header band). Pointing at a child header means the entity end
sometimes anchors on a ROW.

> **~~Design question to settle first: every edge, or only `slot_usage`-narrowed?~~
> VOID (Siggie, 2026-08-31) — it was a false choice.** Without `slot_usage` a
> child's slot is identical to the inherited one, so it merges onto the PARENT's
> row and there is no child-specific row to anchor on. **Only narrowed slots can
> pose the question at all.** Do not reopen.

> **Cost was OVERSTATED.** This section used to say convergence merging and the
> single shared arrowhead both had to learn about row anchors. Measured
> 2026-08-31: **no member or parent of any multi-child family has more than one
> inbound edge.** The ObservationSet case spreads over FOUR arrival rows — the
> three children plus `Observation` itself, which carries
> `ObservationSet.observations` on the parent row — with exactly one edge each.
> So convergence merging is a **no-op** for those rows: a row-targeted edge can
> simply opt out of `mergeTargets` and draw its own arrowhead. `mergeTargets`
> needs no change and its `HEADER_H / 2` geometry is untouched. The fan passes
> DO still need to skip row-targeted edges, or the fan reserves lanes for edges
> no longer using it and mis-centres the rest.
>
> **That property is schema-dependent.** The implementation sketch and the guard
> test it needs live in the `mergeTargets` doc comment in
> `OwnershipGraphView.tsx` (`8f367da`), next to the code that relies on it. A
> guard failure means the schema grew a second narrowing to the same child and
> the shortcut is void — not that the assertion should be deleted.

**Siggie, 2026-08-31: worth doing, but LATER.** Crossings will increase, but
*"the colors would make them legible"* — the sibling colours already match at
both ends.

Note the row machinery is already in place: rows carry `declaringClass`, header
rows are real rows with a y-position, and `rowY(node, slot, declaringClass)`
resolves an anchor. What is missing is a port on the entity side that targets
a header row, and the fan rules knowing about it.

---

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

---

### ▶️ One-hop default

> **⚠️ Largely OBSOLETE as of 2026-08-27.** [Task 1](archive/tasks-2026-08.md)
> removes automatic one-hop-up owners and the cap entirely, so the behaviour
> analysed below stops existing. The Organization diagnosis is still worth
> reading — it is *why* the automatic hop was never enough — and the warning
> about the second chip strip changing box height still applies to any strip
> work.

Siggie: *"after refresh and selecting organization, just get the box on its
own."*

**Diagnosed by probe, and it is real:** Organization has **no owners** (it is a
DAG root) and **no un-flipped ownership slots** — it owns 14 things, but every
edge is stored on the other class (`Observation.performed_by → Organization`).
So one-hop-up finds nothing and there are no rows to expand downward. A genuine
dead end, while the tree shows "14" beside it.

`0c6cfdc` adds `hiddenOwned` to the subgraph and an "owns" chip strip. The
model half has tests; **the rendered strip does not, and it adds a second chip
strip to boxes, which changes box height and therefore edge anchoring.** That
is the part most likely to be subtly wrong — check that edges still point at
the right rows on a box that has both strips.

---

### ▶️ dag-browser — the biggest open area

Siggie's list, verbatim:
- *"writing on top of itself (or the rows are anyway)"* (img-1)
- *"needs horizontal scroll"*
- *"needs panel resizing"*
- *"maybe should allow panel to be detached and moved"*
- *"what happened to categories"* (img-3)

**Diagnosis for the first two (confirmed by reading the widget's CSS):** the
widget ships `.dbw-row { white-space: nowrap }` with no overflow handling, so
its own cross-reference text ("★ also under Organization/MeasurementObservation,
…") runs past the panel edge and paints over neighbouring rows. `renderRow`
truncates the class NAME, but the xref markup belongs to the widget, so it
cannot be fixed there.

`0c6cfdc` attempts a CSS-only fix in `src/explore/selectionTree.css`
(horizontal scroll on `.dbw-root`, `width: max-content` on rows, xref notes
clamped to 18ch). **Unverified visually. Check it before trusting it**, and if
it does not hold, the honest options are to patch the widget upstream
(`~/github-repos/personal/` has no copy; it is an npm dep at `^0.2.0`) or to
stop using its default row chrome.

**"What happened to categories" — genuinely unanswered.** The tree is built
from `getContainmentNodes()`, i.e. the OWNERSHIP graph, which has 7 roots
(Assay, Document, Organization, Person, Questionnaire, ResearchStudyCollection,
SpecimenContainer). It has **nothing to do with `ENTITY_CATEGORIES`** — those
are the hand-curated navigation groups (Admin/Study, Clinical, Observations/
Measurements, Laboratory/Biospecimen, Survey/Questionnaire, Files/Other) the
old flat list showed. So categories did not break; they were never in the tree.

That is a design question for Siggie, not a bug to fix:
- Categories as an expanded TOP LAYER above the ownership roots (their own
  earlier idea, and they predicted the consequence: *"a lot more duplicates will
  appear, across categories"*), or
- Two separate trees, or
- Keep the flat category list as the primary selector after all.

The flat list is still available behind the `☰ flat list` / `⑃ tree` toggle at
the bottom of the panel, so this is comparable side by side right now.

**Panel resizing / detaching: NOT attempted.** Resizing is small; detaching is
not, and `dockview-poc` (an old branch, 153 behind) suggests this was explored
before — read it before designing anything.

---

### Smaller items raised

- **Unnecessary edge crossings.** *"there are a lot of unnecessary edge
  crossings. i don't know how much we can do to fix them, but we should try."*
  Layout is `useGraphLayout`. Not investigated — do not speculate on cause
  without measuring.
- **Legend regrouping.** Siggie noticed the legend really has 7 pair types and
  *"might be easier to read if all the owns (forward) were grouped together."*
  They also asked *"what would it look like if we just gave the types from the
  perspective of a single entity"* — i.e. the same four-position table above.
  **Carry-forward #3: they want this DESCRIBED to them before deciding.** Deferred;
  they were *"too tired to work it all out."* Note the legend is separately
  postponed (item H).

---

### Palettes that only half-exist

Raised by Siggie 2026-09-01, looking at `APP_CONFIG.elementTypes.type` right
after the three-palette system landed:

> *what's the point of even using palettes if the color is hard-coded all
> around it anyway.*

The entry reads `hex: RANGE_COLORS.dataType` — the palette — and then eleven
hand-picked Tailwind literals beside it (`bg-green-700`, `text-green-700
dark:text-green-400`, `border-green-800 dark:border-green-600`, …). So each
element type's color exists **twice**, in two forms that cannot be derived from
one another, and only one of them is the palette. Changing `RANGE_COLORS` moves
the SVG hex and nothing else; the panels, badges, links and toggles keep
whatever Tailwind family someone typed. That is the opposite of a single source
of truth, and it is why the P1 swap needed a by-hand rewrite of two whole color
blocks (`type` cyan→green, `slot` green→amber) instead of an edit to one array.

The trap: `ElementTypeMetadata.color` is shaped for Tailwind class strings, and
Tailwind v4 only emits classes it finds **literally** in the source, so the
strings cannot be built at runtime from a hex. Any fix has to pick a lane:

- **generate the CSS from the palette** — emit CSS custom properties (one per
  role per type) from `RANGE_COLORS` and have components read `var(--…)`
  instead of Tailwind color utilities. Kills the duplication outright; costs a
  pass over every consumer of `color.link` / `.headerBg` / `.badgeBg` / etc.
- **keep Tailwind, derive the hex from it** — invert the dependency so the
  Tailwind family is the source and `hex` is looked up from it. Cheaper, but
  leaves the palette named after ColorBrewer while actually being Tailwind's
  approximation of it, which is its own lie.
- **narrow what the config carries** — most of the eleven roles may not be
  needed. Worth counting real usages before designing anything.

Not urgent, and deliberately not fixed while landing the palettes — but the
duplication is now load-bearing in a way it was not before, since the palettes
document an intent (`Set1`, `Blues`, `Pastel1`) that the Tailwind half quietly
does not honor.

---

## 🔬 UNINVESTIGATED

### STILL NOT INVESTIGATED — the one thing that is not understood

> **[sg] actually, before trying to fix anything, let's review all the changes**
> made in the last commit. i see that the writing on top of itself
> bug is fixed at least.
>
> **That review HAPPENED — see the PLANNING section immediately above.** The
> item below was deferred by it, not dropped, and is still the most serious
> unexplained report. It was NOT investigated in the planning session either.

**"Most clicks (chip, selection, +N attributes, etc.) cause at least the main
panel to refresh. didn't used to do that i don't think."**

This is a **regression report that was never investigated**, and it is the most
serious item on the list because it affects every interaction. Everything else
is a visual defect in one feature.

Likely suspects, in order — but **measure before believing any of them**:
1. `ExploreApp` now owns the four toolbar settings (`82039a6`). Every one is a
   `useState` in the top-level component, so any change re-renders the whole
   tree including `OwnershipGraphView`.
2. The new `writeExploreState` effect depends on nine values instead of four.
3. `HelpProvider` wraps the app and its `api` useMemo depends on ~13 values, so
   it may be invalidating on every render.
4. `SelectionTree` recomputes `counts` over all 54 classes via `useMemo` keyed
   on `[nodes, dataService]` — should be stable, but verify.

**Do not fix by guessing.** Add a render counter or use the React DevTools
profiler and find out which component re-renders and why. The standing process
note in this file exists because four bugs in an earlier session came from
reasoning about the render instead of measuring it.

---

---

## 💬 TOUR AND HELP — smaller items

### `goTo`'s silent no-op

`HelpProvider.tsx`, in `goTo`:

```js
const pos = positions[i];
if (!pos) return;
```

`startTour()` calls `goTo(0)`. When `positions` is empty the call **does
nothing and says nothing** — no error, no warning, no retry when the positions
later arrive.

**Not a live bug today.** `positions` comes from `tourPositions(content)`, and
`content` is parsed from a STATIC markdown import, so it is populated on the
first render and no caller can lose the race. Both current callers (the `take
the tour` button, and `?tour=1`) are safe.

**Why it is still worth fixing.** It is a trap sized exactly to the next person
who calls `startTour()` from somewhere new — an effect that runs early, a
deep-link handler, a test that mounts the provider without content. It cost
real time on 2026-08-28: `?tour=1` was not working, this looked like a
satisfying explanation, and a deferral was built in `HelpProvider` for it before
instrumentation showed the actual cause was URL timing (see WORKLOG, "a wrong
diagnosis, recorded so it is not repeated"). A silent failure that *looks* like
the answer is worse than one that does not.

**The fix, roughly.** Either make it loud (`console.warn` on the empty case,
which is enough — a developer sees it the first time) or make it correct
(latch the request in a ref and fire it from an effect keyed on
`positions.length`). The deferral version was written and reverted on
2026-08-28; `git show 996dffd..fb706bb -- src/help/HelpProvider.tsx` is not it —
it never got committed, so it would have to be written again. **Loud is
probably the right call**: the deferral adds real state for a case that cannot
currently happen, and the whole complaint here is the silence, not the
behaviour.

Left alone deliberately when found, on the grounds that fixing an unrelated
landmine while chasing a live bug is how a small change turns into a large one.

---

### Tour and help

Siggie's report: *"need to be more careful about placement (in img-2 it should
be on right) or ability to drag or both"*, and *"getting no highlighting or
indication of what's going on between steps"*.

`0c6cfdc` attempts both — placement now picks the side with more room rather
than defaulting right, plus a `.help-spotlight` ring around the current
anchor. Also adds hover-to-preview / click-to-pin on the hint dots, which
Siggie asked for. **All three unverified visually.**

**Dragging the popover was NOT built** and is probably worth it regardless of
whether the placement heuristic holds — it is the escape hatch for every case
the geometry gets wrong.

Where things live: `src/help/` — `HelpProvider.tsx` (modes, keyboard),
`helpContext.ts`, `HelpLayer.tsx` (all rendering + positioning),
`parseHelpContent.ts` (ported from icd11), `FORMAT.md` (the authoring spec),
`help.css`. The CONTENT is app-specific and lives at
`src/explore/help-content.md` (moved there 2026-08-29). Tests in
`src/test/helpContent.test.ts` check the content parses,
the tour is numbered 1..n, and every entry id is actually tagged in the app.

---

---

## 🧊 PARKED — write-ups kept so nothing is lost

*Explicitly not this week; each keeps its full write-up.*

### ▶️ OPEN — a class should appear in SEVERAL CATEGORIES

Restored 2026-08-26. This write-up was deleted in `0c9db03` while the NEXT UP
pointer to it survived, leaving item 3 dangling. Original text is at
`git show 4f33c23:docs/TASKS.md` (lines 100–121).

Siggie, 2026-08-25, looking at the first merged render: *"SpecimenQua...
Observation should appear in both categories — don't fix now, leave as task."*

**The modelling question is now ANSWERED (2026-08-26).** Siggie: *"they should
appear in both Observation/Measurements and Laboratory/Specimens. these
categories don't live in the schema. we imposed them to make the app easier to
navigate."*

That picks the second branch the original write-up posed. The second grouping
is **`entityCategories`, an imposed navigation aid — not a second superclass.**
So this is **not sibling merging at all**; it is general multi-category
membership, and sibling merging is one case of it. The `absorbed` /
`groupSiblings` work the original write-up described is NOT the place to start.

**Measured 2026-08-26 (probe over `ENTITY_CATEGORIES`, since deleted):**

- 53 classes, 53 memberships — **no class is in two categories today.**
- `SpecimenQualityObservation` and `SpecimenQuantityObservation` are in `lab`
  ONLY. They are children of `Observation`, which sits in `observation`.
- The two category labels involved are `observation` = "Observations /
  Measurements" and `lab` = "Laboratory / Biospecimen".

**Single-membership is an ENFORCED INVARIANT, not an accident.**
`src/test/entityCategories.test.ts:60` — *"no class is listed in two
categories"* — fails the build on exactly the change being asked for. That test
must be deliberately retired as part of this work, not worked around.

**The file header comment is already wrong.** `entityCategories.ts:3-6` says
*"An entity can appear in multiple categories (e.g., Condition appears in both
Pinned and Clinical)"* — true only of the special DYNAMIC `Pinned` category.
No static class is dual-listed, and the test above forbids it. Fix the comment
whichever way this lands.

**What breaks under dual-listing — audited, not guessed:**

| site | behaviour | severity |
|---|---|---|
| `DataService.ts:622` `getCategorySelectorSection` | `totalClasses` sums `classIds.length` across groups → **double-counts** the class in the header | real, cosmetic |
| `DataService.ts:643` same fn | emits `SectionItemData` with `id: classId` once per category → **duplicate ids in one section** | real; duplicate ids are what caused the LinkOverlay bug |
| `entityCategories.test.ts:100` | `ENTITY_CATEGORIES.find(c => c.classIds.includes(child))` takes the FIRST match → silently picks one category | latent |
| `EntityTable.tsx:49` `classIdSet` | per-table set; indentation guard still correct in each table | fine |
| `EntityExplorer.tsx:52` | maps categories → classes, never the reverse | fine |

The reverse direction (class → its categories) does not exist anywhere in the
codebase. Every consumer walks categories → classes, which is why
multi-membership was never exercised.

**Open design questions — Siggie's call:**
- Does a dual-listed class render identically in both places, or does the
  secondary appearance get marked (dimmed, an italic "also in Observations"
  note) so it does not read as two different classes?
- Is the pin state per-class or per-(class, category)? Pinning
  `SpecimenQualityObservation` from `lab` presumably pins the class.
- Which other classes deserve dual listing? Doing this for exactly two classes
  is a config edit; doing it as a general feature invites an audit of all 53.
  **Recommend: build the mechanism, dual-list only the two Siggie named, and
  leave the rest for a later pass.**

**Knock-on for item 9 (dag-browser-widget in Explorer).** Siggie already
predicted this from the other direction: *"with whole graph populated, a lot
more duplicates will appear, across categories."* If categories become a
dag-browser layer, that widget needs a class-appears-N-times story regardless.
These two items should be designed together, or item 9 will re-solve it.

---

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

---

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

---

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

---

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

-

---

---

## 📄 DOCS

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

---

## 🧭 PROCESS — read before running anything

### Rules learned the hard way — keep these

1. **NEVER `git add -A`, `git add .`, or `git commit -a`.** Stage explicit paths.
   A single such mistake put ~1128 lines of two sessions' implementation inside
   `b17db08`, a commit whose message claims it is docs-only. That commit is now
   in `main`'s history; its message still does not describe its contents.

### ⚠️ PROCESS NOTE FOR THE NEXT SESSION — read this one

Four bugs this session came from **reasoning about the render instead of
measuring the data**, and each was settled in ~30 seconds by a throwaway probe
test once I bothered. Wrong guesses included: "context nodes shouldn't merge"
(they should), "DimensionalObservation narrows observation_type" (it does not —
it is `BaseEnum`, identical to the parent), and a claim that "+N more" was
broken generally when only merged boxes were affected.

**When a render looks wrong, write a probe test that prints the actual view
model before proposing a cause.** The pipeline is
`getOwnershipSubgraph → buildViewModel → mergeSiblings`, and all three are now
exported specifically so a probe can call them (see
`src/test/mergedEdges.test.ts`, which is that pattern made permanent).

Also: `npm run typecheck` (= `tsc -b --noEmit`), never bare `npx tsc --noEmit`.
It caught four real errors this session that the bare form did not.

---

### 🚧 Gotchas — read before running anything

- **`npx vitest` needs node 22+.** The default `node` is v16 and fails with a
  `node:fs/promises` export error that looks like a broken test setup but is
  not. Use
  `export PATH="$HOME/.nvm/versions/node/v22.20.0/bin:$PATH"`.
- **Never run `npm run dev`** — Siggie keeps the app running themselves.
- `npm run typecheck` (`tsc -b --noEmit`), never bare `npx tsc --noEmit`.
  It caught four real errors in one session that the bare form did not.
  (In a sandbox `tsc -b` fails EPERM on `node_modules/.tmp`; the workaround is
  `npx tsc --noEmit -p tsconfig.app.json --tsBuildInfoFile "$TMPDIR/app.tsbuildinfo"`.)
- **`tsc` will NOT catch a stale union comparison.** When `'own-flip'` left the
  `OwnershipVerdict` union, every surviving `x === 'own-flip'` narrowed to
  `never` instead of erroring — so the typecheck stayed green while two live
  sites silently stopped matching (edge emission, and the legend's
  `flippedCount`). **Grep for the old literal; do not trust tsc for this.**
  Hit again later: `MergeMode` is `'bend'`, not `'full'`.
- **`console.log` is swallowed in vitest here.** To surface a value, assert it
  against a sentinel string and read the diff.
- Lint baseline is **20 errors**, all pre-existing (a missing `react-hooks` rule
  definition plus `.vite/deps` cache files). Compare against the baseline rather
  than expecting zero.
- jsdom does not do layout — see [TESTING.md](TESTING.md) before writing a test
  that measures element positions.

---
