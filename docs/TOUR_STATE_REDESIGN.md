# Tour state: the `held` / `temp_held` model

A design note, settled with Siggie 2026-09-07, to be implemented in a fresh
session. It **replaces the state-stack half** of commit `458c10d` — the `Only:`
authoring field, the tour chooser, `TourMetadata:` and the content work all
stay; only `src/explore/tourStateStack.ts` and its callers change.

> **`Only:` already works.** It shipped in `458c10d`, and what a viewer sees
> walking a tour forward is unchanged by this rewrite. Two behaviours DO change,
> both on paths the shipped code got wrong: an untick of a class the viewer had
> selected before the tour now sticks (today the checkbox bounces back), and an
> untick is permanent for the steps recorded after it rather than for the whole
> tour, so `back` shows what each step showed. To see `Only:`: **Guided tours →
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
| `held` | the viewer's selection, as the tour found it and as they edit it | live |
| `temp_held` | classes the viewer ticked while a replace was suppressing `held` | live; empty until the first `Only:` |
| `tour` | what the current tour step draws, cumulative | recomputed per step |
| `region` | how many `Only:` steps are in force | 0 outside any replace |

```
displayed = tour ∪ temp_held ∪ (region === 0 ? held : ∅)
```

Transitions:

- **Tour starts** — `held` = the current selection. `temp_held` = ∅.
  `region` = 0.
- **Ordinary step** — recompute `tour`.
- **`Only:` step** — `region` += 1; `tour` = exactly what the step names.
- **Back** — into the previous step, whose frame carries both the `tour` set
  and the `region` to return to, so crossing out of a replace is a read rather
  than a decrement.
- **Exit** — selection becomes `held ∪ temp_held`.

### Viewer edits

**A tick goes to whichever set is the viewer's right now**: `held` at region 0,
`temp_held` while a replace is in force. So `temp_held` does not exist until
the first `Only:` — before that, "the viewer's selection" is just `held`, which
is the model that governed before `Only:` existed.

A class ticked both before and during a replace therefore has TWO records, one
in each. That is two ticks and two facts, not one fact stored twice; see the
worked example's step 6, and the rejected alternative under it.

An untick edits **whichever set is currently DISPLAYING the class** — the same
order the composition reads them in:

- in `tour` → remove it from `tour`
- else in `temp_held` → remove it from `temp_held`
- else in `held` → remove it from `held`

Every set is editable, so an untick always lands somewhere and the checkbox
always stays off. What it does NOT do is reach into a set that is suppressed: a
class in `temp_held` and `held` loses only the `temp_held` copy, and the `held`
one comes back at the crossing to region 0.

**Which set, never which moment.** Two viewer ticks differ only in when they
happened, so timing cannot decide what an untick means; which set is displaying
the class can, and that is the whole basis of the rule.

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
and exiting the tour would have eaten it. So it suppresses: `held` stops
contributing while `region > 0` but is otherwise untouched, and the only thing
that ever removes from it is the viewer unticking a class it is displaying.

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

So at state 7 the untick makes `tour` `[W,X]`, and when step `1-1` arrives at
state 8 it adds `Y` to give `[W,X,Y]`. `C` is not in frame `1-1` because it was
already gone when that frame was recorded. There is nothing to strip.

`back to 1-0` shows `C` because frame `1-0` genuinely holds `C` — it was
recorded before the untick. Back into a step shows what that step showed; no
exception, no rule.

> **A behaviour change from what ships.** Today an untick is permanent for the
> rest of the tour, enforced by `reconcile` rewriting every frame. Here it is
> permanent for every step recorded after it, and stepping back to a step
> recorded BEFORE it shows the state that step had — which is what back means
> everywhere else.

## Worked example

`Only:` at state 5; viewer edits at 3, 4, 6, 7, 9, 11. The `t-step` column is
the frame label (`region-step`) that the `back` rows read.

```
state_step         mode     region  t-step  held           temp_held  tour             displayed
0.  start [A,B,C]  regular  -       -       —              —                           [A,B,C                             ]
1.  tour +U        tour     0       0       [A,B,C]        -          [U            ]  [A,B,C,       U                    ]
2.  tour +V        tour     0       1       "              -          [U,V          ]  [A,B,C,       U,V                  ]
3.  user +D,+E     tour     0               [A,B,C,D,E]    -          [U,V          ]  [A,B,C,D,E,   U,V,                 ]
4.  user -B        tour     0               [A,  C,D,E]    -          [U,V          ]  [A,  C,D,E,   U,V,                 ]
5.  Only: C,W,X    tour     1       0       "              -          [    C,W,X    ]  [                 C,W,X            ]
6.  user +D,+E,+F  tour     1               "              [D,E,F]    [    C,W,X    ]  [                 C,W,X,      D,E,F]
7.  user −C        tour     1               "              "          [      W,X    ]  [                   W,X,      D,E,F]
8.  tour +Y        tour     1       1       "              "          [      W,X,Y  ]  [                   W,X,Y,    D,E,F]
9.  user −W        tour     1               "              "          [        X,Y  ]  [                     X,Y,    D,E,F]
10. tour +Z        tour     1       2       "              "          [        X,Y,Z]  [                     X,Y,Z,  D,E,F]
11. user −E        tour     1               "              [D,  F]    [        X,Y,Z]  [                     X,Y,Z,  D,  F]
                                                                                                    
8.  back to 1-1    tour     1       1       "              "          [      W,X,Y  ]  [                   W,X,Y,    D,  F]  ← W returns               
5.  back to 1-0    tour     1       0       "              "          [    C,W,X    ]  [                 C,W,X,      D,  F]  ← C returns               
2.  back to 0-1    tour     0       1       "              "          [U,V          ]  [A,  C,D,E,  F, U,V,               ]  ← crossing: held back 
1.  back to 0-0    tour     0       0       "              "          [U            ]  [A,  C,D,E,  F, U                  ]
0.  exit           regular  -       -       —              —           —               [A,  C,D,E,F                       ]  # held + temp_held
```

Read the viewer edits against the untick rule:

- **4, `−B`** — `B` is in `held` and region is 0, so `held` is what is
  displaying it and `held` is what gives it up. Nothing else ever had it, so it
  is gone for the rest of the tour and absent at exit. This is the case that
  makes `held` editable rather than frozen: an untick here has to stick, or the
  checkbox bounces back on the next compose.
- **6, `+D,+E,+F`** — a tick during a replace goes to `temp_held`. `D` and `E`
  are ALSO in `held`, and that second record is deliberate: two ticks are two
  facts, and the one in `held` is what the viewer did before the tour started.
- **7, `−C`** — `C` is in `tour` (the `Only:` drew it) AND in `held`. `tour`
  wins: it leaves the screen and `held` keeps it. Frames `1-1` and `1-2` are
  recorded afterwards and so never contain it; frame `1-0` predates it and
  does, which is why `back to 1-0` shows `C`.
- **9, `−W`** — `W` is only ever tour-drawn. Frame `1-2` is recorded after the
  untick and lacks it; `1-1` and `1-0` predate it and hold it, so stepping back
  into either shows `W` again.
- **11, `−E`** — `E` is in `temp_held` and in `held`. `temp_held` is the one
  displaying it, so that is the record removed; the `held` one is suppressed
  and untouched, and returns at the crossing to region 0. So `E` is on screen
  again at `back to 0-1` and survives to exit.

That last case is the one to be sure about, because it is the only place where
`back` reaches past the tour's own contribution into the viewer's. It follows
from the same rule as `C` and `W` — back into a step shows what that step
showed — and `0-1` genuinely showed `E`.

**The alternative was considered and rejected.** Making the step-6 tick MOVE
`D` and `E` out of `held` rather than copying them gives every class exactly
one record, and `−E` then sticks. But it breaks a stronger property: a viewer
who ticks a suppressed class and immediately unticks it would DESTROY it —
`+A` then `−A` during the replace takes `A` out of `held`, puts it in
`temp_held`, then removes it from there, and `A` is gone at the crossing and at
exit, having never been visible in between. A cancelling pair of clicks must be
a no-op, which the copying rule gives for free.

The frames this records, which is what the back rows read:

```
0-0: U          0-1: U,V
1-0: C,W,X      1-1: W,X,Y      1-2: X,Y,Z
```

`1-0` holds `C` and `1-1` does not, without anything having removed it: `1-0`
was recorded at state 5 and `1-1` at state 8, with the untick at state 7 in
between. Likewise `W` survives in `1-1` and is absent from `1-2`.

`F`, ticked at state 6 during a replace, survives to exit. `temp_held` is not
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

The same class appearing in `held` and `temp_held` is NOT an instance of that,
and the distinction is what the rejected alternative turns on. Those are two
ticks — two things the viewer did, at two moments, with different meanings —
and each is undone separately. Collapsing them into one record is what breaks
the cancelling pair.

## Open

Nothing blocking.

**`region` rides on the frame**, rather than being a counter kept beside the
stack. Each frame records the region it was pushed in, so stepping back across
a replace is a read — the previous frame's region IS the region to return to —
and there is no decrement to get wrong. It also keeps the "two views of one
fact" rule: a counter beside the frames would be derivable from them.

**`temp_held` does not exist before the first replace**, which settles the
other question the same way: at `region === 0` there is one viewer set, `held`,
edited both ways, and that is the pre-`Only:` mechanism unchanged. `temp_held`
is created by the first `Only:` and is the only thing the two-path worry was
about.

**The host needs an explicit tour-START signal**, which the provider does not
send today — it has `onPushChange`/`onPopChange` and nothing else. A tour whose
opening position carries no `Change:` pushes no frame (the first tour in the
content file is exactly that), so "the stack is non-empty" is not the same
question as "a tour is running", and a viewer tick during those opening steps
must land in `held` as the tour's rather than be missed entirely. Add
`onTourStart`/`onTourEnd` alongside the existing pair.
