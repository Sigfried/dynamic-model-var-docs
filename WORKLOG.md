# WORKLOG

Reasoning, dead ends, and corrections — the history that would clutter the live
docs. Live docs state *current* state; this states *how it got there* and what
was tried and rejected. Read this when a doc or convention looks arbitrary.

Newest first.

---

## 2026-08-21 — The bare diagonal explained; comparison harness + ownership legend

Siggie arrived with the diagnosis already made, from screenshots rather than
code, and it was right. Worth recording because the previous session made three
wrong guesses at this by theorising from the source.

### The bare diagonal: `bend` is undefined on a corner-less route

`mergeDistFor(mode, pts)` returns, for `'bend'`, the length of the **last routed
segment** — the distance back to ELK's final corner. That is well-defined only
if there IS a final corner. When ELK routes an approach as a single straight
run, `pts.length === 2` and the "last segment" is the entire edge. `mergeCut`
then walks back past the source, `cut` lands at index 0, the routed head is
empty, and the whole path becomes one straight line from the source anchor to
the shared arrowhead base. The bare diagonal is not ELK declining to step; it
is the merge code discarding a perfectly good horizontal route.

Confirmed numerically before touching anything: a 2-point route 1020px long
gives `mergeDist = 1020`, `cut = 0`. `near`/`far` never do this because their
distance is a fixed 40/120px, so the cut always lands on the long horizontal
run near the node.

This is why `merge-near` looked fine on the same layout. It is **not** that
near is better here — `bend` simply has nothing to bend from. It also explains
why it hits the TOP approach of a big convergence: that is where the outermost
fan lane happens to line up with the source row, so ELK has no reason to step.

**The fix, not yet implemented** (Siggie chose harness-first): clamp `bend` to
`Math.min(lastSegment, nearDistance)`, or fall back to `near` when
`pts.length < 3`. Siggie half-remembered wanting to "combine merge-near with
merge-from-last-corner" but could not recall the motivating cases. The
motivation is better than remembered — this is a **guard on a degenerate
input**, not a compromise between two aesthetics, so it does not need those
cases to justify it.

Do NOT re-try overshooting the cut by `CORNER_R*1.5` to swallow the corner;
2026-08-19 established that is worse (short last segments push the cut onto the
long run before the corner). Different problem, same function.

### Harness before fix — and why the legend was the valuable half

Siggie asked for the case harness first, then mid-build added upcoming-thoughts
#1 (a legend of every ownership pair type) explicitly *"to help me find cases
you may miss"*. That framing turned out to be the whole point.

The curated case set had been built from the **convergence ranking** — how many
ownership edges arrive at each class. That ranking structurally cannot show FK
hubs, because flipped edges reverse direction: an edge that reads
`Condition.associated_participant -> Participant` is drawn as Participant
owning Condition, so Participant appears as an *owner*, never as a target. The
case set therefore had a hole exactly where the schema is densest.

The legend, which groups by classification rule rather than by target, put 43
pairs in a single `own-flip / fk-inversion` bucket and made the hole obvious.
Measured: **Participant fans out to 22 targets (21 flipped), Visit to 19,
Organization to 11** — Participant's outbound fan is larger than the largest
inbound convergence in the schema (Quantity, 19 edges). And because flipped
edges keep their attribute-row anchor and never merge, these are precisely the
fans the merge code deliberately does not touch, hence the ones no constant has
ever been tuned against. Four cases added for them.

Lesson for the next session: a ranking is a projection, and this codebase has
two directions of ownership. Ranking by target alone hides half the graph.

### Legend derives from the classifier; it does not restate it

`classifySlotEdge` now delegates to a new `classifySlotEdgeExplained`, which
returns the verdict **plus which rule fired** (`excluded` / `override` /
`multivalued` / `value-object` / `fk-inversion`). The legend renders that.

The alternative — hand-writing the rule listing in the UI — was rejected
outright. `OWNERSHIP_OVERRIDES` and `VALUE_OBJECTS` are hand-curated and go
stale silently on every schema sync (this is already a tracked hazard). A
legend built from a second copy of the rules would conceal exactly the rot it
exists to reveal. A test asserts the legend's pair list equals the containment
graph's actual has-a/ref edges, so the two cannot drift.

`verdict/rule` is the group key, not verdict alone: they are not one-to-one. An
override can yield any verdict, and `own-fwd` arrives by three separate routes.

### Cases apply in place, not by navigation

Clicking a case sets `selectedIds`/`expandedIds`/`pathToRoot` directly rather
than changing `location`. A reload would re-read the merge mode from
localStorage and reset zoom/scroll — i.e. it would destroy the very state being
held constant while flipping modes on one case. The URL still updates via the
existing write effect, so a case remains shareable.

### Siggie's verdict at the end of the session: the classification is suspect

The legend was built to find edge-routing cases. It did that, then did
something more useful: reading its own listing made Siggie doubt the
classification underneath it. Four questions came out of that reading, each was
checked against the code, and **all four were real problems** — not
misunderstandings of a sound design:

1. No rule separates fk-inversion from value-object; `VALUE_OBJECTS` is 14
   hand-typed names checked before the FK fallthrough.
2. `performed_by` and `associated_participant` are the same kind of
   relationship in different groups, purely because the former used to be
   pinned to `ref` and needed an entry to change. `OWNERSHIP_OVERRIDES` is an
   edit log presented as a category.
3. Excluding `focus`/`associated_evidence` → Entity conflates the sound
   inheritance reason (every class is-a Entity) with ownership, where the
   polymorphic pointer carries real meaning. The old doc already flagged this
   and it was never revisited.
4. Three of eight `ref` overrides rest on the slot being *named* `related_*`.

Siggie's call: stop, save, and start a fresh session on what the rules SHOULD
be — explicitly **not** derived from the current code or the 2026-07-13
adjudication. Written up at the time in `docs/OWNERSHIP_RETHINK.md`,
which deliberately proposed no answer.

**Follow-up 2026-08-24:** the rethink doc has been removed. Its still-necessary
content — the instruction not to start from the code, and the note to keep
`classifySlotEdgeExplained` — moved into `docs/OWNERSHIP_CLASSIFICATION.md`
(Part 4); everything else it held was either duplicated in this entry already or
superseded by the rewrite. One live document again.

**Consequence for the routing work:** the bare-diagonal fix is still correct
and still worth doing (it is a guard on a degenerate input, independent of
classification). But aesthetic tuning against convergence sizes may be tuning
against the wrong graph — Participant's 22-edge fan, the largest structure in
the diagram, is produced entirely by the FK-inversion rule now in question.

**Process note worth keeping:** what exposed all four problems was
`classifySlotEdgeExplained` reporting *which rule fired*, then rendering the
pairs grouped by rule. Neither the graph nor the old doc made the groupings
visible, so their incoherence was invisible too. Whatever replaces the rules,
keep the property that the classifier can explain itself.

### Environment note

`npm test` / `npx vitest` fail under the repo's default node (v16 on PATH):
vite imports `constants` from `node:fs/promises`. Run with
`PATH="$HOME/.nvm/versions/node/v22.20.0/bin:$PATH"`. Full suite: 216 pass.
`npm run lint` reports 18 pre-existing errors in files untouched here.

---

## 2026-08-19/21 — Arrowhead merge finished; schema order; node dragging

Picked up the unfinished single-arrowhead spec, finished it, then spent most of
the session on edge geometry and a failed attempt at interactive routing.

### The arrowhead spec — what "one arrowhead" actually required

`a5f54c4` had all three points wrong; the fix was structural, not cosmetic.
Merged edges now carry **no `markerEnd` at all** — the "blobby wedge" was ~6
identical SVG markers stacked at one point, not one fat arrow. One head per
convergence is drawn as its own path, and edges terminate at the **centre of
its base**, one `ARROW_LEN` further out than the tip.

Sizing off the title text (`TITLE_EM = 12`) made the LR/TB swap free: the
arrow's base is built from the *perpendicular* of its direction vector, so an
LR arrow gets a vertical base and a TB arrow a horizontal one with no direction
branch. Worth preserving — an earlier instinct was to branch on direction.

**Sign error worth remembering:** the first version drew every head backwards.
One flag was doing two jobs — which *border* the head sits on (from whether the
entity is the drawn source) and which way it *points*. Those are independent:
the head always points INTO the node, so `dir` is the negation of the side sign.
Four regression tests now pin this across both borders in LR and TB.

### The curved merge tail was doing nothing

`mergeTail` built a cubic whose control points were laid along the incoming
direction — so it rendered visually straight anyway, while its seam with the
routed head could not be rounded (`roundedPath` only rounds corners with
segments on *both* sides). That seam was the source of the hard right angles in
`bend` mode.

Siggie's observation ("since the final leg is showing up straight anyway, could
we just draw it as a diagonal with a rounded corner?") was correct and the fix
was a net deletion: append the target as one more *point*, and the cut becomes
an ordinary interior corner that rounds like any other.

**Failed first attempt, don't retry:** adding `CORNER_R * 1.5` to the merge
distance so the cut lands *before* ELK's corner. When the last routed segment is
short the cut lands past the corner onto the long run before it, and the
approaches bunch into a cramped parallel bundle. Fix the rounding at the seam,
not the cut distance.

### Fan ordering: two wrong turns

The Consent `valid_to`/`valid_from` crossing prompted two failed fixes.

1. **Sorting fan ports by row y (pre-layout).** Made it worse: the top row got
   the topmost port — the straightest shot — and every lower edge had to climb
   over it. Which approach arrives from where is ELK's decision and is *not*
   knowable in `buildSpec`; any pre-layout proxy is a guess.
2. **Re-ordering at render time by arrival direction.** Correct in principle,
   but it was implemented as a spread of the *arrival points* across the
   arrowhead base — Siggie had asked for more spread at the **penultimate**
   points (the last bend), not the final ones. Reverted entirely.

Fan slot index is therefore deliberately meaningless — just a distinct lane per
edge. Both attempts are recorded in the `buildSpec` comment so they are not
retried.

**Still unexplained:** why one approach in a convergence arrives as a bare
diagonal with no steps while its neighbours step once or twice. `?dbg=1` logs
each convergence's routed approaches (point count, bend count, diagonal flag,
endpoints) to answer this from real geometry. Three guesses were made and all
three were wrong; the next attempt should start from that log.

### Schema order — two separate discard sites

Attributes rendered alphabetically, inverting `date_started`/`date_ended` and
`period_start`/`period_end` and hoisting `id` to the top.

- `Element.ts` sorted a class's attribute table with `localeCompare`. Removed.
  The other six `localeCompare` sorts in that file order browsable *lists*
  (enums, types, variables, tree children) where alphabetical is correct.
- `ownershipSubgraph`'s node slots come from a walk over the edge set, so they
  inherit graphology's insertion order. **Its doc comment claimed "schema
  order", which sent the first fix looking in the wrong place.** Corrected.

`getClassSummary`'s slot list is the authoritative index (every attribute, in
declaration order); the view sorts both row kinds against it. Source order
survives ingestion intact — see `slots` in `bdchm.processed.json`.

`DataService.subsetSection` (Focus/relationships) keeps its alphabetical sort:
it orders slot names gathered across *several* classes, where no single class's
schema order applies. Siggie's instruction: don't fix previous views unless the
fix pertains to Explore.

### ELK cannot route for a hand-placed arrangement

Node dragging was added as a probe and Siggie then wanted it permanent. The
question became whether ELK can re-route edges around a node the user moved.
**It cannot**, and each avenue was checked rather than assumed:

- **`elk.noLayout`** — exists in elkjs, but ELK's own description is "No layout
  is done for the associated element ... to avoid their inclusion in the layout
  graph, or to ... prevent layout engines from processing them." It EXCLUDES the
  node; its edges are not routed either. It is not a pin. (A recommendation to
  use it for exactly this was checked and is wrong.)
- **`Fixed Layout` algorithm** — keeps positions but requires `elk.bendPoints`
  supplied by the caller. A no-op router.
- **INTERACTIVE layering/crossing/cycle-breaking** — tried first. These read
  coordinates as ORDERING HINTS: ELK infers which layer a node belongs in, then
  re-places it there. Dropping BodySite far right moved it somewhere else
  entirely, and one graph hung. Fully reverted.
- **libavoid** — ELK's own answer ("routing edges without changing node
  positions has been a highly requested feature for several years"), algorithm
  id `org.eclipse.elk.alg.libavoid`. It is C++ wrapped as a Java plugin; elkjs
  is GWT-compiled Java and ships eleven algorithms (box, fixed, force, layered,
  mrtree, radial, random, rectpacking, sporeCompaction, sporeOverlap, stress).
  libavoid is absent and structurally cannot be ported.

So edges touching a moved node are re-routed by `smoothStepPath`, matching what
React Flow and Cytoscape do (engine places nodes, renderer computes edge paths).
**Neither of those libraries has obstacle-aware routing either** — React Flow's
`smoothstep` and Cytoscape's `taxi` both compute from endpoints alone. Switching
renderers would not fix this and would cost the fanned ports and merged
arrowhead. The missing piece is an orthogonal obstacle router, independent of
who draws the SVG.

### A correction to how the fan was described

The fan was documented as "deliberately tight, not meant to be seen." Siggie
pointed out that 4px is plainly visible — it shows up as the staircase of nested
arcs sweeping into the arrowhead. The "settled, don't touch" status of
`ENTITY_FAN_GAP` was therefore decided on a premise that does not hold. Not
changed, but no longer settled.

### Process note

Several wrong calls this session came from reasoning over a stale mental model
rather than re-reading the code: the arrowhead sign error, the row-y sort, the
`CORNER_R * 1.5` overshoot, the ELK pinning, and a set of line numbers quoted
from memory that were ~25 lines stale. Two claims to Siggie were also wrong —
the owner-chip count (raw slot ranges, ignoring `classifySlotEdge`, so eight
classes instead of the real four) and "React Flow's dagre example handles drag
continuously" (it does not re-run the layout engine; it recomputes its own edge
geometry). **Check before asserting; the file is cheap to read.**

## 2026-08-19 (later) — Edge rendering: fan, corners, arrowheads

Second session of the day. Siggie listed a round of work (edge improvements,
self-loop markers, drawer headers, cross-view state, amber, owner cap 5, docs
cleanup); most of it is still untouched because the edge work absorbed the
session and ended with the arrowhead spec still not met. Ended with Siggie
saying "not understanding each other… maybe we need a new session."

### The NUL byte, and why it mattered more than it looks

`ownershipSubgraph.ts` had a literal 0x00 byte in `buildOwnershipDag`'s dedup
key (`${e.source}<NUL>${e.target}`) — committed, longstanding, functionally
harmless. It made `file` report the module as `data`, so **every grep-family
tool silently skipped it**. Fixed by writing it as the `\0` escape (`54f70b8`).

This surfaced only because searches for `ownerCap` kept returning nothing while
`sed -n '102p'` clearly showed the text. Chasing that also uncovered a *second*
tooling problem: `grep` in the non-interactive shell is a shell function (from
Claude Code's setup, not Siggie's dotfiles) that execs `ugrep -I --ignore-files`;
this ugrep build **rejects both flags and exits silently**, so every
`grep pattern file` call returns a false negative. Two independent causes of
the same symptom, stacked. Use `command grep`. This produced a real wrong claim
to Siggie — that colours weren't config-driven — which had to be retracted.

### Curved mode was broken in a way nobody had diagnosed

The docs recorded "curved edges look poor" and deferred retuning them. The
actual cause wasn't tuning: `curvedFromSections` built the full point list and
then used the bend points **only to pick two directions**, drawing a single
cubic between the endpoints. ELK's entire route was discarded, so curves sailed
through whatever the orthogonal path had been routing around. No tension value
could fix that.

Siggie guessed this unprompted ("if you anchored along all the ELK points,
maybe the curved lines wouldn't be totally ugly"). Correct. `smoothPath` now
runs Catmull-Rom through every routed point; `simplifyPoints` drops collinear
runs first, because following ELK's many near-collinear points faithfully
produces a wobble instead of one sweep.

### The fan: a fix that became a new bug

Earlier (2026-08-19 morning) each node had one `::hdr:in` port, so N converging
edges overlapped and six owners of `BodySite` read as one edge between unrelated
owners. The fix fanned ports across `HEADER_H + (total-1)*9`, capped at
`height - 6` — which **deliberately spilled below the header**. That traded the
overlap bug for a semantic lie: an arrow landing beside the `site` row implies
"this edge is about `site`", borrowing meaning the entity end never had.

Resolution: keep the fan but make it **tight** (4px, header-centred) and treat
it as a pure *routing* device — ELK needs distinct port coordinates, the user
should never see them. Drawing then merges the tails back together.

Worth preserving: **only the attribute end names a slot.** The entity end is
the peer class, which has no corresponding row. The old code called these
*host*/*storage* and *free*/*peer*; Siggie didn't understand any of those words,
so they're being retired for **attribute end** / **entity end**.

### Arrowheads — three wrong attempts, spec still unmet

Image evidence from Siggie each round. Two real bugs found and fixed: markers
had no `markerUnits` so they scaled by stroke width (9 × 1.8px ≈ 16px wedge),
and `refX="9"` pushed the tip past the path end, burying the body in the border
— which read as *no arrowhead at all*. `LinkOverlay.tsx:506` already had the
`userSpaceOnUse` precedent.

But the merge itself is still wrong, and the mistake is worth recording: I read
"single arrowhead" as *converge to one point and let the markers coincide*, and
kept `markerEnd` on every edge. N markers stack into a blob. Siggie's actual
spec is that **edges carry no markers at all**, one arrowhead is drawn
separately, sized in `em` off the title text (~1em base, ~1.5em to point,
swapped for TB), and edges terminate at the **centre of its base**. I had also
aimed `mergeTargets` at roughly the tip rather than the base. Left committed as
WIP (`a5f54c4`) with the spec in TASKS.md rather than guessing a fourth time.

I'd also proposed "let them land a few px apart, honest to the routing" — that
directly contradicts a single shared arrowhead and was withdrawn.

### Process notes

- Siggie asked for the three merge distances as **switchable options** rather
  than one commit each ("can implement and let me look one-at-a-time"). Built as
  four toolbar buttons, explicitly temporary. **No option was ever chosen** —
  ask before deleting the losers.
- The owner cap 8→5 flipped an existing test: `BodySite` has exactly 6 owners,
  so it now falls back to chips by default. The test asserted the *drawn* case
  while relying on the default, conflating behaviour with a constant. Split into
  one test at an explicit cap of 8 and one pinning `DEFAULT_OWNER_CAP`.
- `git stash push -- <paths>` to isolate the NUL commit silently split a coupled
  change (the cap constant stayed, its test left), leaving a failing test on the
  intermediate commit. Caught by running the suite before committing. Isolate by
  reverting the unrelated hunk instead.
- Playwright still isn't installed. Every visual claim this session needed
  Siggie's eyes; jsdom sees no SVG geometry. Three rounds of screenshots is the
  cost of that gap.

---

## 2026-08-19 — Explore SPA visual pass

Siggie drove the real page for the first time since the drawer/expand work and
reported bugs directly. **Several were invisible to the test suite**, which is
the main lesson of the session: 158 jsdom tests passed while pan did not work
at all and unchecking an entity crashed the app.

### The uncheck crash, and why the `throw` stayed

`OwnershipGraphView.tsx` threw `Routed edge edge-80 missing from view model`
when unchecking one of two selected entities. Cause: ELK layout is async (web
worker) while the view model is a synchronous `useMemo`. React re-rendered with
the *new* view model while `useGraphLayout` still held the *previous* spec's
result, so the render mapped over stale routed-edge ids.

The tempting fix — soften the throw to `return null` — was rejected. A routed
edge genuinely missing from the current view model *is* a real invariant
violation and should fail loudly (repo convention: fail loudly in dev). The fix
instead makes the situation unreachable: the hook stores each result alongside
the spec it was computed from and returns null unless they match.

Writing the third test for this caught a bug in the fix itself: `specOf([])`
produces a non-null spec with zero nodes, and the pending check
`!!spec && !fresh` reported `inProgress` forever, because the effect
short-circuits empty specs without ever calling the engine. Worth remembering
that "spec exists" and "spec will be laid out" are different conditions.

### Path-to-root: two wrong designs before the right one

**Wrong analysis first.** I probed the cost of paths-to-root using mid-level
classes (Participant, Condition, MeasurementObservation), measured 4–8 context
nodes, and concluded it was "not a volume problem" — recommending a *depth cap*.
Siggie posted a screenshot of `?sel=BodySite` showing a canvas full of boxes.

Re-probing at the leaf end:

| selection | nodes | context | edges | layers |
|---|---|---|---|---|
| Organization | 1 | 0 | 0 | 3..3 |
| Visit | 5 | 4 | 5 | 0..3 |
| **BodySite** | **16** | **15** | **32** | **0..6** |
| **Quantity** | **30** | **29** | **87** | **0..8** |

The lesson: **sample the extremes, not the typical case.** The mechanism is
fan-*out*, not depth — a value object is owned by everything that stores one,
and each owner drags its own path to root, making the walk a reverse-
reachability closure. A depth cap would not have helped at all: at N=1,
BodySite still pulls all six owners. Depth was the wrong axis.

**Second wrong design.** Turned path-to-root off by default and summarized
owners as clickable chips. Siggie: too little context, truncated chips with an
unclickable "+3", and clicking every chip is bad. The error was treating owners
as a footnote. For a value object, *its owners are the answer to what it is* —
BodySite's six owners are the content of the diagram.

**Landed:** draw direct owners (one hop, cap 8) as real nodes; chips only above
the cap, listing every owner with an "add all", never truncated. Transitive
path-to-root survives as opt-in (`⇱ roots` / `?roots=1`) because it is
occasionally what you want and it was already built.

### The "missing arrow" that wasn't

Siggie reported Condition and MeasurementObservation looking linked with a
missing arrowhead, then corrected: there is *no* arrow between them, it just
looks like one. Diagnosis: every incoming edge shared a single `::hdr:in` port,
so six edges converging on BodySite landed on one point and their orthogonal
runs overlapped into an apparent Condition↔MeasurementObservation edge. Each
edge now gets its own port fanned along the border.

Orthogonal routing is **our** choice (`elk.edgeRouting: 'ORTHOGONAL'`), not an
ELK default — worth knowing before blaming the layout engine. Curved edges look
poor at current spacing; Siggie explicitly deferred retuning them
("try to fix orthogonal, don't worry about curved now"). **Don't fix curved
unprompted.**

### Activity classification

Adjudicated: `Activity` is a value object. Full rationale in
`docs/OWNERSHIP_CLASSIFICATION.md`. Worth noting here is the *shape* of the
bug: the FK-inversion default treats any single-valued entity range as a
foreign key, so an identity-less value object missing from `VALUE_OBJECTS` gets
read as owning its holder. This is the second time hand-curated config went
stale after an upstream sync (the first: `ENTITY_CATEGORIES` hiding Context and
Activity from the entity list entirely). Expect it again.

I also briefly misread `git diff main..proposal/activity-value-object` as
showing the branch *reverting* expand-on-demand, and warned Siggie about it.
That was a two-dot-diff artifact — the branch was cut before that work landed,
so the diff reported main's later commits as "removed." The branch only ever
touched one file.

### Process notes

- Committing was deferred too long; Siggie interrupted with "wait — commit
  first" while a third change was in flight. Commit at each verified boundary.
- Node: a non-interactive shell falls back to a system Node 16 where Vite 7
  cannot start (`node:fs/promises` has no `constants` export before 18).
  Siggie's interactive shell has v24 via nvm. Export the nvm bin path.
- `npm run typecheck` (`tsc -b --noEmit`) is stricter than bare
  `tsc --noEmit`, which I had been running for most of the session. Both were
  clean here, but use the npm script.

---

## Before 2026-08-19

No worklog was kept. History for that period lives in commit messages, in
`docs/archive/tasks.md`, and in the design docs themselves.
