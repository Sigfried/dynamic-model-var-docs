/**
 * Tour state: who put what on the canvas.
 *
 * **The problem.** The app has ONE selection — a set of class ids. Two parties
 * write to it: the viewer (ticking checkboxes) and the tour (steps that need
 * something drawn). A set cannot remember who put what in it, so when a step's
 * contribution is taken back, something has to stop it taking a class the
 * viewer ticked themselves.
 *
 * **The model (Siggie, 2026-09-07).** Store both halves outright rather than
 * deriving either:
 *
 *  - `held` — the viewer's selection, as the tour found it and as they edit it.
 *  - `tempHeld` — classes the viewer ticked while a replace was suppressing
 *    `held`. Empty until the first `Only:`.
 *  - `tour` — what the current step draws, cumulative, computed FORWARD.
 *  - `region` — how many `Only:` steps are in force; 0 outside any replace.
 *
 * ```
 * displayed = tour ∪ tempHeld ∪ (region === 0 ? held : ∅)
 * ```
 *
 * **`Only:` — the one thing that subtracts.** Everything else adds. A replace
 * cannot DELETE the viewer's selection (`back` could not restore it, and
 * exiting would have eaten it), so it SUPPRESSES: `held` stops contributing
 * while `region > 0` and is otherwise untouched. `tempHeld` is NOT suppressed
 * — a class ticked during a replaced step stays on screen; `Only:` is about
 * clearing the canvas the tour built, not about fighting the viewer.
 *
 * **`held` returns at the crossing back to region 0, not at exit.** The rule is
 * *back into a step shows what that step showed*, and going forward a region-0
 * step displayed `held`. Waiting until exit would make region 0 the one region
 * whose suppression a pop does not lift.
 *
 * **Viewer edits.** A tick goes to whichever set is the viewer's right now:
 * `held` at region 0, `tempHeld` while a replace is in force. So a class ticked
 * both before and during a replace has TWO records, one in each — two ticks,
 * two facts, undone separately. (The tidier alternative, MOVING the id into
 * `tempHeld`, was rejected: `+A` then `−A` during a replace would then destroy
 * a class that was never on screen, and a cancelling pair of clicks must be a
 * no-op. See WORKLOG 2026-09-07.)
 *
 * An untick edits EVERY set currently DISPLAYING the class — usually just one,
 * but `tour` and `held` both display at region 0. Every set is editable, so an
 * untick always lands somewhere and the checkbox always stays off. What it does
 * NOT do is reach into a SUPPRESSED set: inside a replace `held` is off screen,
 * so an untick has not spoken to it and it returns at the crossing. See
 * `untick` for why "the first set holding it" is not the same rule.
 *
 * **A recorded step holds only the tour's half, and is cumulative.** It is a
 * snapshot of `tour` at the moment the step was pushed. The usual objection
 * to cumulative state — that a snapshot captures the viewer's selection too, so
 * `back` reinstates a tick they have since removed — does not apply, because
 * `held`/`tempHeld` live OUTSIDE the recorded steps and are composed in at read
 * time. That is what makes the untick rule free: an untick edits the live
 * `tour` and rewrites nothing, so a step recorded before it still shows what
 * it showed.
 *
 * `region` rides on the recorded step rather than being counted beside them, so
 * stepping back across a replace is a read (the previous step's region IS the
 * region to return to) rather than a decrement to get wrong.
 *
 * **What this replaced, and why.** The previous version kept `counts` (a
 * refcount whose number nothing ever read — every use was `counts.has(id)`) and
 * `displaced` (a per-frame snapshot of what a replace hid), and `reconcile`
 * rewrote every frame on a viewer untick to make it permanent. `displaced`
 * existed only because the viewer's half was DERIVED (selection minus what the
 * tour holds) rather than stored; storing it removes the snapshot's reason to
 * exist. The lesson worth keeping: **do not store two views of one fact** —
 * both bugs in this area were exactly that.
 *
 * ---
 *
 * **Worked example.** Siggie's trace, and the one place every rule meets: a
 * replace, ticks on both sides of it, a class with two records, unticks against
 * all three sets, and a `back` walk that crosses the region boundary. `Only:`
 * at state 5; viewer edits at 3, 4, 6, 7, 9, 11. The `t-step` column is the
 * recorded step (`region-step`) that the `back` rows read — note that the
 * viewer rows have none, because a viewer edit records nothing, which is why
 * `back` skips over them.
 *
 * ```
 * state_step         mode     region  t-step  held         temp_held  tour           displayed
 * 0.  start [A,B,C]  regular  -       -       —            —                         [A,B,C                           ]
 * 1.  tour +U        tour     0       0       [A,B,C]      -          [U          ]  [A,B,C,       U                  ]
 * 2.  tour +V        tour     0       1       "            -          [U,V        ]  [A,B,C,       U,V                ]
 * 3.  user +D,+E     tour     0               [A,B,C,D,E]  -          [U,V        ]  [A,B,C,D,E,   U,V,               ]
 * 4.  user -B        tour     0               [A,  C,D,E]  -          [U,V        ]  [A,  C,D,E,   U,V,               ]
 * 5.  Only: C,W,X    tour     1       0       "            -          [  C,W,X    ]  [               C,W,X            ]
 * 6.  user +D,+E,+F  tour     1               "            [D,E,F]    [  C,W,X    ]  [               C,W,X,      D,E,F]
 * 7.  user −C        tour     1               "            "          [    W,X    ]  [                 W,X,      D,E,F]
 * 8.  tour +Y        tour     1       1       "            "          [    W,X,Y  ]  [                 W,X,Y,    D,E,F]
 * 9.  user −W        tour     1               "            "          [      X,Y  ]  [                   X,Y,    D,E,F]
 * 10. tour +Z        tour     1       2       "            "          [      X,Y,Z]  [                   X,Y,Z,  D,E,F]
 * 11. user −E        tour     1               "            [D,  F]    [      X,Y,Z]  [                   X,Y,Z,  D,  F]
 *
 * 8.  back to 1-1    tour     1       1       "            "          [    W,X,Y  ]  [                 W,X,Y,    D,  F]  ← W returns
 * 5.  back to 1-0    tour     1       0       "            "          [  C,W,X    ]  [               C,W,X,      D,  F]  ← C returns
 * 2.  back to 0-1    tour     0       1       "            "          [U,V        ]  [A,  C,D,E,  F, U,V,             ]  ← crossing: held back
 * 1.  back to 0-0    tour     0       0       "            "          [U          ]  [A,  C,D,E,  F, U                ]
 * 0.  exit           regular  -       -       —            —          —              [A,  C,D,E,F                     ]  # held ∪ temp_held
 * ```
 *
 * The recorded steps, which is what the `back` rows read:
 *
 * ```
 * 0-0: U          0-1: U,V
 * 1-0: C,W,X      1-1: W,X,Y      1-2: X,Y,Z
 * ```
 *
 * `1-0` holds `C` and `1-1` does not, without anything having removed it: `1-0`
 * was recorded at state 5 and `1-1` at state 8, with the untick at state 7 in
 * between. Likewise `W` survives in `1-1` and is absent from `1-2`. That is the
 * whole of why an untick needs no surgery on the recorded steps.
 *
 * Four rows to read against the untick rule:
 *
 *  - **4, `−B`** — `B` is in `held` at region 0, where `held` is displayed, so
 *    `held` gives it up. This is the case that makes `held` EDITABLE rather
 *    than frozen: the untick has to stick, or the checkbox bounces back.
 *  - **6, `+D,+E,+F`** — a tick during a replace goes to `temp_held`. `D` and
 *    `E` are ALSO in `held`, and the second record is deliberate.
 *  - **7, `−C`** — `C` is in `tour` and in `held`, but `held` is SUPPRESSED
 *    here, so only `tour` gives it up and `held` keeps its copy for the
 *    crossing.
 *  - **11, `−E`** — `E` is in `temp_held` and in `held`; `temp_held` is the one
 *    displaying it. So `E` is on screen again at `back to 0-1` and survives to
 *    exit. This is the only row where `back` reaches past the tour's own
 *    contribution into the viewer's, and it follows from the same rule: back
 *    into a step shows what that step showed, and `0-1` genuinely showed `E`.
 *
 * The table is pinned row by row in `tourStateStack.test.ts`, so it cannot
 * drift from the code. **One case it does not exercise**: every untick above
 * has exactly one DISPLAYING set, so none of them distinguishes "remove from
 * the first set holding it" from "remove from every set displaying it". Those
 * differ only at region 0, where `held` is not suppressed and a class can be
 * displayed by `tour` and `held` at once. See `untick`.
 */

import { type Direction, type ExploreState, type MergeMode, PANEL_KEYS } from './exploreState';

/** One position's contribution, parsed out of its `Change:` or `Only:` query. */
export interface TourChange {
  /** Ids this position adds to the selection, or IS the selection when `replace`. */
  sel: string[];
  /**
   * Scalars this position sets. Only fields the delta actually named appear; a
   * field absent here is a field the step never touches, which is the whole
   * point of the change from absolute state.
   */
  scalars: Partial<Omit<ExploreState, 'sel'>>;
  /**
   * `Only:` rather than `Change:` — `sel` is the WHOLE canvas from here, not an
   * addition to what was already there.
   *
   * Applies to the selection alone. The scalars in the same query still merge
   * exactly as an additive change's do.
   */
  replace?: boolean;
}

/**
 * One recorded step: what the tour was drawing when the step was pushed, and
 * which region it was pushed in.
 *
 * `sel` is CUMULATIVE — the whole of `tour` at that moment, not the delta the
 * step declared. That is what lets `back` be a plain read.
 */
export interface TourStep {
  sel: readonly string[];
  scalars: TourChange['scalars'];
  region: number;
}

/** The whole of the tour's state. Immutable; every operation returns a new one. */
export interface TourState {
  /** False outside a tour, when every set is empty and nothing composes. */
  inTour: boolean;
  /** The viewer's selection. Suppressed while `region > 0`, never emptied. */
  held: readonly string[];
  /** Viewer ticks made while `held` was suppressed. Empty until the first `Only:`. */
  tempHeld: readonly string[];
  /** What the tour is drawing right now, cumulative. */
  tour: readonly string[];
  /** How many `Only:` steps are in force. */
  region: number;
  /** Recorded steps, oldest first. `back` reads the previous one. */
  tourStates: TourStep[];
  /** Merged scalars, last-write-wins in push order. */
  scalars: TourChange['scalars'];
}

export const NO_TOUR: TourState = {
  inTour: false, held: [], tempHeld: [], tour: [], region: 0, tourStates: [], scalars: {},
};

const IDS_SEP = '~';

function oneOf<T extends string>(value: string | null, allowed: readonly T[]): T | null {
  return value && (allowed as readonly string[]).includes(value) ? (value as T) : null;
}

/**
 * Parse a step's `Change:` (or `Only:`) query into a change.
 *
 * Same vocabulary as a share link — one set of param names for links and for
 * the tour — but read as a DELTA: a param that is absent means "leave it
 * alone", where in a link it means "use the default". That inversion is the
 * whole migration, and it is invisible in the text of the steps that already
 * existed, which is why every one of them had to be re-read rather than left
 * alone.
 *
 * Values are validated against their allowed sets, so an authoring typo
 * (`dir=SIDEWAYS`) is dropped rather than pushed into the renderer.
 */
export function parseTourChange(query: string, replace = false): TourChange {
  const p = new URLSearchParams(query);
  const scalars: TourChange['scalars'] = {};

  /*
   * `panels=0` closes every overlay. It is a SWEEP, so it is applied before
   * the explicit keys below and they overwrite it: `panels=0&legend=1` clears
   * the screen and then opens the legend, which is how a step names a clean
   * picture with one thing left up.
   *
   * Unlike every other param here, absent does not mean "leave it alone" —
   * present means "set all of these to false". That is safe because it can
   * only ever CLOSE things, so a step that sweeps and a step that says nothing
   * are still both deltas, never a snap-back to defaults.
   */
  if (p.get('panels') === '0') {
    for (const k of PANEL_KEYS) scalars[k] = false;
    scalars.detail = null;
  }

  if (p.has('detail')) scalars.detail = p.get('detail') || null;
  if (p.has('roots')) scalars.roots = p.get('roots') === '1';
  if (p.has('sibs')) scalars.sibs = p.get('sibs') === '1';
  if (p.has('legend')) scalars.legend = p.get('legend') === '1';
  if (p.has('cases')) scalars.cases = p.get('cases') === '1';
  const dir = oneOf<Direction>(p.get('dir'), ['RIGHT', 'DOWN']);
  if (dir) scalars.dir = dir;
  const merge = oneOf<MergeMode>(p.get('merge'), ['near', 'far', 'bend', 'off']);
  if (merge) scalars.merge = merge;

  const raw = p.get('sel');
  const sel = raw ? raw.split(IDS_SEP).filter(Boolean) : [];
  // `replace: undefined` rather than `false` on the common path, so an additive
  // change serialises and compares the way it always did.
  return replace ? { sel, scalars, replace: true } : { sel, scalars };
}

/** Union preserving insertion order, so the canvas does not reshuffle on a push. */
function union(a: readonly string[], b: readonly string[]): string[] {
  return [...new Set([...a, ...b])];
}

/**
 * Begin a tour. `selection` is what is on the canvas right now — the viewer's,
 * by definition, since the tour has drawn nothing yet.
 *
 * The host must call this, because "the stack is non-empty" is NOT the same
 * question as "a tour is running": a tour whose opening position carries no
 * `Change:` records nothing (the first tour in the content file is exactly
 * that), and a viewer tick during those opening steps has to land in `held`.
 */
export function startTour(selection: readonly string[]): TourState {
  return { ...NO_TOUR, inTour: true, held: [...selection] };
}

/**
 * End a tour. The selection the viewer is left with is `held ∪ tempHeld` —
 * everything they ticked, before or during, minus anything they unticked, and
 * none of what the tour drew.
 */
export function endTour(): TourState {
  return NO_TOUR;
}

/** What the viewer keeps when the tour ends. Read before `endTour` resets. */
export function survivingSelection(state: TourState): string[] {
  return union(state.held, state.tempHeld);
}

/**
 * Record a step.
 *
 * An additive change grows `tour`; a replace makes `tour` exactly what the step
 * names and pushes the region up one. Either way the resulting `tour` is
 * recorded as a step, so `back` is a read.
 */
export function pushStep(state: TourState, change: TourChange): TourState {
  const region = change.replace ? state.region + 1 : state.region;
  const tour = change.replace ? [...change.sel] : union(state.tour, change.sel);
  const scalars = { ...state.scalars, ...change.scalars };
  return {
    ...state,
    tour,
    region,
    scalars,
    tourStates: [...state.tourStates, { sel: tour, scalars, region }],
  };
}

/**
 * Step back: drop the last recorded step and return to what the one before it
 * recorded.
 *
 * `tour` and `region` both come from that previous step, which is why crossing
 * out of a replace needs no decrement — it simply says which region it was in.
 * With no earlier step, the tour is back to having drawn
 * nothing, at region 0.
 *
 * Scalars are NOT restored, per the standing decision: a step overwrites them
 * and a pop leaves them (Siggie, 2026-08-27 — *"easy enough for the user to
 * reclick the button"*).
 */
export function popStep(state: TourState): TourState {
  if (state.tourStates.length === 0) return state;
  const tourStates = state.tourStates.slice(0, -1);
  const prev = tourStates[tourStates.length - 1];
  return {
    ...state,
    tourStates,
    tour: prev ? prev.sel : [],
    region: prev ? prev.region : 0,
  };
}

/** True while `held` is suppressed — i.e. inside a replace. */
function suppressed(state: TourState): boolean {
  return state.region > 0;
}

/**
 * The viewer ticked a class on.
 *
 * It goes to whichever set is the viewer's right now: `held` at region 0,
 * `tempHeld` inside a replace. A class already in that set is left alone, so a
 * tick of something the tour is also drawing is recorded once and survives the
 * pop that takes the tour's copy away.
 */
export function tick(state: TourState, id: string): TourState {
  if (!state.inTour) return state;
  const key = suppressed(state) ? 'tempHeld' : 'held';
  if (state[key].includes(id)) return state;
  return { ...state, [key]: [...state[key], id] };
}

/**
 * The viewer ticked a class off.
 *
 * It is removed from every set that is currently DISPLAYING it, and from no
 * other. A SUPPRESSED set keeps its record: inside a replace, `held` is not on
 * screen, so an untick has not spoken to it and it returns at the crossing back
 * to region 0.
 *
 * **Every displaying set, not the first one.** The rule is often written as an
 * if/else chain — `tour`, else `tempHeld`, else `held` — which stops at the
 * first match. That is equivalent only while ONE set is displaying, which is
 * true of every untick in the worked example above. Two sets display the same
 * class only at region 0, where nothing is suppressed:
 *
 * ```
 * start [P]      held=[P]  tour=[ ]   shown: P
 * tour  +P       held=[P]  tour=[P]   shown: P
 * user  −P    <- region 0: `tour` and `held` are BOTH displaying it
 * ```
 *
 * Stopping at `tour` leaves `held` holding `P`, and since `held` is not
 * suppressed the next compose puts it straight back — the checkbox bounces,
 * which is the exact failure that made `held` editable in the first place.
 *
 * **Worked-example state 7 is not this case.** `−C` happens at region 1, where
 * `held` IS suppressed and so is not displaying; `tour` is the only set the
 * untick reaches, and `held` rightly keeps its copy for the crossing. The
 * discriminator is suppressed-vs-displaying, never which set is checked first
 * — which is why the `held` guard below is on `suppressed()` and not on
 * whether an earlier set already matched.
 *
 * Nothing else moves: no recorded step is rewritten, in this region or any
 * other. A step recorded BEFORE the untick still holds the class and shows it
 * again on `back` — which is what back means everywhere else. (The version this
 * replaced made an untick permanent for the whole tour by rewriting every
 * frame; that was a policy choice, not a requirement, and dropping it dropped
 * the code.)
 */
export function untick(state: TourState, id: string): TourState {
  if (!state.inTour) return state;
  const drop = (set: readonly string[]) => set.filter(x => x !== id);
  return {
    ...state,
    tour: drop(state.tour),
    tempHeld: drop(state.tempHeld),
    // Suppressed inside a replace, so an untick there has not reached it.
    held: suppressed(state) ? state.held : drop(state.held),
  };
}

/**
 * The app state the viewer should see.
 *
 * `sel` is the composition: what the tour draws, plus what the viewer ticked
 * during a replace, plus — only outside a replace — their own selection.
 *
 * Scalars are last-write-wins across every step so far. They are NOT cut off by
 * a replace: `Only:` replaces the selection, not the app. A step that set
 * `dir=DOWN` three steps ago is still setting it, exactly as it would be under
 * an additive change; reinstating the absolute model's "any field a step did
 * not name snaps back" is the thing to avoid.
 */
export function compose(viewer: ExploreState, state: TourState): ExploreState {
  if (!state.inTour) return viewer;
  const sel = suppressed(state)
    ? union(state.tour, state.tempHeld)
    : union(union(state.tour, state.tempHeld), state.held);
  return { ...viewer, ...state.scalars, sel };
}
