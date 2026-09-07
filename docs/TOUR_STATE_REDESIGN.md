# Tour state: the `held` / `temp_held` model

A design note, settled with Siggie 2026-09-07, to be implemented in a fresh
session. It **replaces the state-stack half** of commit `458c10d` — the `Only:`
authoring field, the tour chooser, `TourMetadata:` and the content work all
stay; only `src/explore/tourStateStack.ts` and its callers change.

> **`Only:` already works.** It shipped in `458c10d` and this rewrite does not
> change its behaviour — only how it is implemented. To see it: **Guided tours →
> Walkthrough → step 5 of 6** ("Selecting an entity"), where the canvas goes
> from `MeasurementObservation, Person` to exactly `BodySite, Participant`, and
> `back` restores them. Note it is step **5**, and roughly the 11th `next`
> press: the Walkthrough's steps carry beats, so there are ~12 positions across
> its 6 steps. An earlier version of this note said "step 4", which is a
> position that has not reached the replace yet and looks like the feature
> failing.

**Delete this file once the rewrite ships.** Its reasoning belongs in
`tourStateStack.ts`'s header and in WORKLOG; this exists so the next session can
start from a settled design rather than re-deriving one.

---

## The problem

The app has ONE selection — a set of classes on the canvas. Two parties write to
it: the viewer (ticking checkboxes) and the tour (steps that need something
drawn). A set cannot remember who put what in it, so when a step's contribution
is taken back, something has to stop it taking a class the viewer ticked
themselves.

Everything below is that problem plus one complication: `Only:`, a step that
says "the canvas is exactly these classes" and therefore has to hide things
without losing them.

## The model

Three sets and a counter.

| | what it is | lifetime |
|---|---|---|
| `held` | the viewer's selection as it was when the tour STARTED | frozen for the whole tour |
| `temp_held` | classes the viewer has ticked DURING the tour | live; edited by viewer ticks |
| `tour` | what the current tour step draws, cumulative | recomputed per step |
| `region` | how many `Only:` steps are in force | 0 outside any replace |

```
displayed = tour ∪ temp_held ∪ (region === 0 ? held : ∅)
```

Transitions:

- **Tour starts** — `held` = the current selection, frozen. `temp_held` = ∅.
  `region` = 0.
- **Ordinary step** — recompute `tour`.
- **`Only:` step** — `region` += 1; `tour` = exactly what the step names.
- **Back** — into the previous step; crossing out of a replace decrements
  `region`.
- **Exit** — selection becomes `held ∪ temp_held`.

### Viewer edits

A tick adds to `temp_held`.

An untick edits **whichever set the class is in**:

- in `tour` → remove it from `tour`
- in `temp_held` → remove it from `temp_held`
- in `held` → nothing (`held` is frozen)

This is the rule that resolves the asymmetry Siggie caught while tracing: an
earlier draft removed a pre-tour class from `held` but a during-tour class from
everywhere, which treated two viewer ticks differently according to WHEN they
happened. There is no distinction between viewer ticks other than when they
appeared, so timing cannot be the basis. Which SET the class lives in can.

### Frames are cumulative, and hold only the tour's half

A frame is a snapshot of `tour` at the moment the step was recorded — cumulative,
not a delta. That is what makes the untick rule free.

The usual objection to cumulative state is that a snapshot captures the viewer's
selection too, so stepping back reinstates a tick they have since removed, or
drops one they have since added. That was the defect in the absolute `State:`
model this whole area replaced.

It does not apply here, because **a frame never holds the viewer's half.**
`held` and `temp_held` live outside the frames and are composed in at read time,
so they are always current. A frame records only what the tour drew.

## Why `held` is suppressed rather than emptied

`Only:` is the only thing in the system that subtracts; everything else adds.
Outside a replace the rule is plainly `tour ∪ everything the viewer has`, which
is the model that shipped before `Only:` existed and is still what governs at
`region === 0`.

A replace cannot DELETE the viewer's selection — `back` could not restore it,
and exiting the tour would have eaten it. So it suppresses: `held` stays whole
and stops contributing while `region > 0`.

`temp_held` is NOT suppressed. A class ticked during a replaced step stays on
screen; `Only:` is about clearing the canvas the tour built, not about fighting
the viewer while they use it.

## Why `held` returns at the crossing, not at exit

Both were considered. The rule is **back into a step shows what that step
showed**, and it decides it:

Going forward, a region-0 step displayed `held`. If `held` waited until exit,
stepping back into that step would show it WITHOUT `held` — a step displaying
something it never displayed. Exit-only would also make region 0 the one region
whose suppression is not lifted by popping it, so one rule would gain an
exception.

`held` returns exactly once, at `region` 0, however many replaces the tour had:
`region` is a counter, so there is only one boundary where the condition flips.

## An untick edits nothing but the live state

Unticking a tour-drawn class removes it from `tour`. That is the whole rule.
No frame is rewritten, in this region or any other.

This works because **a step's set is computed FORWARD from the live state, not
re-derived from what the step's text names**:

```
tour(next step) = tour(current) + what the step adds
```

So at state 6 the untick makes `tour` `[W,X]`, and when step `1-1` arrives at
state 7 it adds `Y` to give `[W,X,Y]`. `C` is not in frame `1-1` because it was
already gone when that frame was recorded. There is nothing to strip.

An earlier draft of this note had the untick reaching back through the region's
steps to remove the id. That was reconstructing by hand what forward computation
gives for free — it came from treating a frame as the AUTHORED text of its step
(`Only: C,W,X` plus `Y`, hence `C,W,X,Y`) rather than as a record of what was
drawn. Siggie: *"frame 1-1, step 7 has no C in it. why would C ever return
there?"*

That also removes the apparent oddity in the trace. `back to 1-0` shows `C`
because frame `1-0` genuinely holds `C` — it was recorded before the untick.
Back into a step shows what that step showed; no exception, no rule.

> **A behaviour change from what ships.** Today an untick is permanent for the
> rest of the tour, enforced by `reconcile` rewriting every frame. Here it is
> permanent for every step recorded after it, and stepping back to a step
> recorded BEFORE it shows the state that step had — which is what back means
> everywhere else.

## Worked example

`Only:` at state 4; viewer edits at 3, 5, 6, 8, 10.

```
state              region  step  held     temp_held  tour         displayed
0.  start [A,B,C]  -       -     —        —          —            A,B,C
1.  tour +U        0       0     A,B,C    ∅          U            A,B,C,U
2.  tour +V        0       1     "        ∅          U,V          A,B,C,U,V
3.  user +D,+E     0       -     "        D,E        U,V          A,B,C,U,V,D,E
4.  Only: C,W,X    1       0     "        "          C,W,X        C,W,X,D,E
5.  user +F        1       -     "        D,E,F      C,W,X        C,W,X,D,E,F
6.  user −C        1       -     "        "          W,X          W,X,D,E,F
7.  tour +Y        1       1     "        "          W,X,Y        W,X,Y,D,E,F
8.  user −W        1       -     "        "          X,Y          X,Y,D,E,F
9.  tour +Z        1       2     "        "          X,Y,Z        X,Y,Z,D,E,F
10. user −E        1       -     "        D,F        X,Y,Z        X,Y,Z,D,F

back to 1-1        1       1     "        "          W,X,Y        W,X,Y,D,F   ← W returns
back to 1-0        1       0     "        "          C,W,X        C,W,X,D,F   ← C returns
back to 0-1        0       1     "        "          U,V          A,B,C,U,V,D,F   ← crossing: held back
back to 0-0        0       0     "        "          U            A,B,C,U,D,F
exit               -       -     —        —          —            A,B,C,D,F
```

Read the three viewer edits against the untick rule:

- **6, `−C`** — `C` is in `tour` (the `Only:` drew it) AND in `held`. `tour`
  wins: it leaves the screen and `held` keeps it. Frames `1-1` and `1-2` are
  recorded afterwards and so never contain it; frame `1-0` predates it and
  does, which is why `back to 1-0` shows `C`.
- **8, `−W`** — `W` is only ever tour-drawn. Frame `1-2` is recorded after the
  untick and lacks it; `1-1` and `1-0` predate it and hold it, so stepping back
  into either shows `W` again.
- **10, `−E`** — `E` is in `temp_held`. Removed there, and it is gone for good:
  no frame draws it and `held` never had it.

The frames this records, which is what the back rows read:

```
0-0: U          0-1: U,V
1-0: C,W,X      1-1: W,X,Y      1-2: X,Y,Z
```

`1-0` holds `C` and `1-1` does not, without anything having removed it: `1-0`
was recorded at state 4 and `1-1` at state 7, with the untick at state 6 in
between. Likewise `W` survives in `1-1` and is absent from `1-2`.

`F`, ticked at state 5 during a replace, survives to exit. `temp_held` is not
suppressed, so it is on screen throughout, and exit unions it in.

## What this deletes

| gone | why it existed |
|---|---|
| `TourStack.counts` | a refcount whose NUMBER nothing ever read — every use was `counts.has(id)`. A vestige of incremental bookkeeping |
| `TourFrame.displaced` | a per-frame snapshot of what a replace hid. `temp_held` is maintained continuously, so there is nothing to snapshot and nothing to go stale |
| `horizon` / `visibleFrames` / `countsOf` | machinery for reading a stack whose frames could be hidden. `region` is a counter now |
| `pendingRestore` | handed `displaced` back to the host on a pop |
| `reconcile`'s frame surgery | rewrote every frame on a viewer untick. Unticks edit one set now |

The API narrows to roughly: `startTour(selection)`, `pushStep(frame)`,
`popStep()`, `tick(id)`, `untick(id)`, `compose()`, `exit()`.

## Why the current implementation is being replaced after one day

Not because it is broken — 534 tests pass and the behaviour is right. Because
Siggie asked the obvious question of it (*"the counts can only be 0, 1, or 2 —
wouldn't it be easier to record user sels and tour sels?"*) and the answer was
yes.

Three things fell out of the ensuing trace, in order:

1. **Nothing reads the count.** Every use is a membership test, so `counts`
   should have been a `Set` — and once it is a set, it is just "what the tour is
   holding", which the frames already say.
2. **`displaced` exists because the viewer's selection was DERIVED** (selection
   minus what the tour holds) rather than stored. A replace had to snapshot what
   it hid because nothing else recorded it. Store `held`/`temp_held` outright
   and the snapshot is unnecessary.
3. **The remaining fiddly part — `reconcile` rewriting frames — is only needed
   to make an untick permanent**, which is a policy choice, not a requirement.
   Dropping it drops the code.

The general lesson, and the one worth keeping: **do not store two views of one
fact.** `counts` beside `frames`, and `displaced` beside the live selection,
were both that, and both were where the bugs were.

## Open

Nothing blocking. Two things to decide while implementing:

- **Where `region` lives.** A counter on the stack, or the depth of a stack of
  `tour` sets? The latter makes "back across a replace" a pop rather than a
  decrement-and-recompute, and may be the same code.
- **Whether `held` needs to exist before the first replace.** At `region === 0`
  `held ∪ temp_held` is just "the viewer's selection", so a tour with no `Only:`
  step could run on the pre-`Only:` mechanism unchanged. Worth it only if the
  two paths are cheaper than the one.
