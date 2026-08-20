# WORKLOG

Reasoning, dead ends, and corrections — the history that would clutter the live
docs. Live docs state *current* state; this states *how it got there* and what
was tried and rejected. Read this when a doc or convention looks arbitrary.

Newest first.

---

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
