import { describe, test, expect } from 'vitest';
import {
  parseTourChange, pushStep, popStep, compose, tick, untick,
  startTour, endTour, survivingSelection, NO_TOUR, type TourState,
} from '../explore/tourStateStack';
import { DEFAULTS, type ExploreState } from '../explore/exploreState';
import { ENTITY_CATEGORIES } from '../config/entityCategories';
import { categoryView } from '../config/categoryView';

/**
 * Tour state on the `held`/`temp_held` model (Siggie 2026-09-07). The model is
 * documented in `tourStateStack.ts`'s header; how it was arrived at, and the one
 * case its design note got wrong, are in WORKLOG 2026-09-07.
 *
 * Two models preceded it. The first made every step a FULL absolute query
 * applied with `url.search = query`, so the tour had to snapshot and restore
 * the viewer's state, a mid-tour edit was clobbered, and any field a step did
 * not name snapped back to its default. The second made steps additive deltas
 * on a refcounted stack, which fixed all three but derived the viewer's half
 * (selection minus what the tour holds) instead of storing it — and so needed a
 * per-frame `displaced` snapshot and whole-stack surgery on an untick.
 *
 * Here both halves are stored. The tests below are organised around the four
 * things that buys: the composition, viewer edits landing in a named set,
 * `back` as a plain read, and exit as a read of the viewer's half.
 */

const base = (over: Partial<ExploreState> = {}): ExploreState => ({ ...DEFAULTS, ...over });

/** The composed selection, sorted — these tests are about membership, not order. */
const shown = (state: TourState, viewer = base()) =>
  [...compose(viewer, state).sel].sort();

/** Walk forward through a tour, `Change:` unless the query is wrapped in `only()`. */
const only = (q: string) => ({ q, replace: true });
function walk(from: TourState, ...steps: Array<string | { q: string; replace: boolean }>) {
  return steps.reduce((s, step) => {
    const { q, replace } = typeof step === 'string' ? { q: step, replace: false } : step;
    return pushStep(s, parseTourChange(q, replace));
  }, from);
}

describe('parseTourChange', () => {
  test('an absent field means "leave it alone", not "use the default"', () => {
    // THE inversion. Under absolute state, `sel=X` also meant sibs/dir/merge
    // back to their defaults; here it means only "add X".
    const change = parseTourChange('sel=MeasurementObservation');
    expect(change.sel).toEqual(['MeasurementObservation']);
    expect(change.scalars).toEqual({});
  });

  test('an empty change touches nothing at all', () => {
    // Under absolute state an empty `State:` was a REAL state — the default
    // view, everything cleared. Here it is a step that changes nothing, which
    // is what an exposition step actually wants.
    expect(parseTourChange('')).toEqual({ sel: [], scalars: {} });
  });

  test('multiple ids split on ~, matching the link format', () => {
    expect(parseTourChange('sel=BodySite~Participant').sel)
      .toEqual(['BodySite', 'Participant']);
  });

  test('a scalar is recorded only when the query names it', () => {
    expect(parseTourChange('dir=DOWN').scalars).toEqual({ dir: 'DOWN' });
    expect(parseTourChange('sibs=0').scalars).toEqual({ sibs: false });
    expect(parseTourChange('roots=1').scalars).toEqual({ roots: true });
  });

  test('an unknown scalar value is dropped, not passed to the renderer', () => {
    expect(parseTourChange('dir=SIDEWAYS').scalars).toEqual({});
    expect(parseTourChange('merge=nope').scalars).toEqual({});
  });

  test('an Only: query parses identically except for the flag', () => {
    // Same text, same shape; the authoring field is the only difference, and
    // interpreting it is this module's job rather than the parser's.
    expect(parseTourChange('sel=Visit', true))
      .toEqual({ sel: ['Visit'], scalars: {}, replace: true });
  });
});

describe('outside a tour nothing composes', () => {
  test('compose is the identity', () => {
    const viewer = base({ sel: ['Visit'], dir: 'DOWN' });
    expect(compose(viewer, NO_TOUR)).toEqual(viewer);
  });

  test('a viewer edit is not recorded', () => {
    // The click handlers call unconditionally, so this has to be a no-op rather
    // than quietly filling `held` for a tour that is not running.
    expect(tick(NO_TOUR, 'Visit')).toEqual(NO_TOUR);
    expect(untick(NO_TOUR, 'Visit')).toEqual(NO_TOUR);
  });
});

describe('the tour draws on top of the viewer', () => {
  test('a step adds its ids to whatever the viewer had', () => {
    const state = walk(startTour(['Visit']), 'sel=Participant');
    expect(shown(state)).toEqual(['Participant', 'Visit']);
  });

  test('back removes only what that step added', () => {
    const state = walk(startTour(['Visit']), 'sel=Participant', 'sel=BodySite');
    expect(shown(popStep(state))).toEqual(['Participant', 'Visit']);
  });

  test('a step that changes nothing leaves the view exactly as it was', () => {
    // The exposition step. Under absolute state this was the case that required
    // an empty `State:` and cleared the canvas.
    const state = walk(startTour(['Visit']), 'sel=Participant', '');
    expect(shown(state)).toEqual(['Participant', 'Visit']);
  });

  test("a class in both halves survives the tour's own pop", () => {
    /*
     * What the refcount used to be for. `sel` is a set and cannot hold the
     * tour's copy beside the viewer's — so the two are not in one set at all
     * any more. `held` keeps its record whatever the tour does with `tour`.
     */
    const state = walk(startTour(['Participant']), 'sel=Participant');
    expect(shown(state)).toEqual(['Participant']);
    expect(shown(popStep(state))).toEqual(['Participant']);
  });

  test('a class only the tour drew goes when the tour is done with it', () => {
    const state = walk(startTour([]), 'sel=Participant');
    expect(shown(popStep(state))).toEqual([]);
  });

  test('popping past the bottom is a no-op, so exit paths can just unwind', () => {
    const state = startTour(['Visit']);
    expect(popStep(state)).toEqual(state);
  });
});

describe('scalars overwrite and do not restore', () => {
  test("a step sets a scalar over the viewer's value", () => {
    const state = walk(startTour([]), 'dir=DOWN');
    expect(compose(base({ dir: 'RIGHT' }), state).dir).toBe('DOWN');
  });

  test("popping does NOT put the viewer's scalar back", () => {
    /*
     * Deliberate, and decided rather than overlooked. Siggie, 2026-08-27:
     * "you're overcomplicating for the sake of probably rare edge cases. just
     * do the stack. if scalar settings clobber user actions, don't worry about
     * it. easy enough for the user to reclick the button."
     */
    const state = walk(startTour([]), 'dir=DOWN');
    expect(compose(base({ dir: 'RIGHT' }), popStep(state)).dir).toBe('DOWN');
  });

  test('the most recent step naming a scalar wins', () => {
    const state = walk(startTour([]), 'dir=DOWN', 'dir=RIGHT');
    expect(compose(base(), state).dir).toBe('RIGHT');
  });

  test('a step that never names a field never touches it', () => {
    // The live bug this whole area exists to fix: Siggie had a non-default
    // setting and every step carrying a `State:` reset it, because no step
    // wrote that param. Nothing warned; the canvas just changed mid-tour.
    const viewer = base({ sibs: false, merge: 'far', roots: true });
    const composed = compose(viewer, walk(startTour([]), 'sel=Participant'));
    expect(composed.sibs).toBe(false);
    expect(composed.merge).toBe('far');
    expect(composed.roots).toBe(true);
  });
});

describe('viewer edits land in a named set', () => {
  test('a tick outside a replace goes to held and survives the tour', () => {
    let state = walk(startTour(['Visit']), 'sel=Participant');
    state = tick(state, 'Specimen');
    expect(shown(state)).toEqual(['Participant', 'Specimen', 'Visit']);
    expect(survivingSelection(state).sort()).toEqual(['Specimen', 'Visit']);
  });

  test('unticking a class the tour drew takes it from the tour, not the viewer', () => {
    // Without this the next compose would put it straight back and the checkbox
    // would refuse to stay off.
    let state = walk(startTour([]), 'sel=Participant~BodySite');
    state = untick(state, 'Participant');
    expect(shown(state)).toEqual(['BodySite']);
  });

  test('unticking a class only the viewer had takes it from held, and it sticks', () => {
    /*
     * The case that makes `held` EDITABLE rather than frozen, and the gap in
     * the first draft of the design note: at region 0 `held` is displayed, so
     * the viewer can untick one of its classes — and if the untick did nothing,
     * the next compose would put it back.
     */
    let state = walk(startTour(['Visit', 'Specimen']), 'sel=Participant');
    state = untick(state, 'Visit');
    expect(shown(state)).toEqual(['Participant', 'Specimen']);
    // Gone for the rest of the tour, and absent at exit.
    expect(shown(walk(state, 'sel=BodySite'))).toEqual(['BodySite', 'Participant', 'Specimen']);
    expect(survivingSelection(state)).toEqual(['Specimen']);
  });

  test('at region 0, an untick reaches BOTH tour and held', () => {
    /*
     * The only shape where two sets display one class, and so the only place
     * the "remove from the first set holding it" shorthand differs from the
     * rule ("remove from every set DISPLAYING it"). Nothing is suppressed at
     * region 0, so stopping at `tour` leaves `held` holding Participant and the
     * next compose puts it back — the checkbox bounces, which is the exact
     * failure that made `held` editable in the first place.
     *
     * Paired with the test below: same two sets, but at region 1, where the
     * answer is the opposite because `held` is suppressed. Neither test alone
     * pins the guard — one of them passes under the wrong rule.
     */
    let state = walk(startTour(['Participant']), 'sel=Participant');
    state = untick(state, 'Participant');
    expect(shown(state)).toEqual([]);
    expect(survivingSelection(state)).toEqual([]);
  });

  test('...but a SUPPRESSED held is not reached, which is what the note turns on', () => {
    // Inside a replace `held` is off screen, so the untick has not spoken to
    // it: worked-example state 7, where `−C` takes C from `tour` and `held`
    // keeps its copy for the crossing back to region 0.
    let state = walk(startTour(['C']), only('sel=C~W'));
    state = untick(state, 'C');
    expect(shown(state)).toEqual(['W']);
    expect(state.held).toEqual(['C']);
    expect(shown(popStep(state))).toEqual(['C']);
  });

  test('a re-tick of a class the tour is drawing records it as the viewer\'s', () => {
    // The old refcount from the other end: without a record of their own, the
    // pop would take the class away under them.
    let state = walk(startTour([]), 'sel=Participant');
    state = tick(state, 'Participant');
    expect(shown(popStep(state))).toEqual(['Participant']);
  });

  test('an untick of a class nobody is holding changes nothing', () => {
    const state = walk(startTour(['Visit']), 'sel=Participant');
    expect(untick(state, 'Nowhere')).toEqual(state);
  });
});

describe('Only: replaces the canvas', () => {
  /*
   * `Change:` is additive, which is right for a step that grows a picture one
   * box at a time and wrong for one whose copy names a SPECIFIC canvas: the
   * category content views, and the two/three-box examples in the Ownership
   * tour. Those accumulated into each other, so a step captioned "Clinical"
   * drew Clinical on top of everything before it.
   *
   * A replace SUPPRESSES the viewer's selection rather than deleting it. It
   * cannot delete: `back` could not restore it and exiting would have eaten it.
   */
  test('a replacing step draws exactly what it names', () => {
    const state = walk(startTour([]), 'sel=Person~Participant', only('sel=Visit'));
    expect(shown(state)).toEqual(['Visit']);
  });

  test("it hides the viewer's own selection too", () => {
    const state = walk(startTour(['Specimen']), only('sel=Visit~TimePeriod'));
    expect(shown(state)).toEqual(['TimePeriod', 'Visit']);
  });

  test('...but hiding is not deleting: held is intact and comes back', () => {
    const state = walk(startTour(['Specimen']), only('sel=Visit'));
    expect(state.held).toEqual(['Specimen']);
    expect(shown(popStep(state))).toEqual(['Specimen']);
  });

  test('a later Change: adds to the replaced canvas rather than reviving the old one', () => {
    // What lets a step name a clean picture and its next beat grow it.
    const state = walk(startTour(['Specimen']), only('sel=Visit'), 'sel=TimePeriod');
    expect(shown(state)).toEqual(['TimePeriod', 'Visit']);
  });

  test('a second Only: replaces again, and back lands on the first', () => {
    const state = walk(startTour([]), only('sel=Person~Participant'), only('sel=Specimen'));
    expect(shown(state)).toEqual(['Specimen']);
    expect(shown(popStep(state))).toEqual(['Participant', 'Person']);
  });

  test('scalars still merge across a replace', () => {
    // `Only:` replaces the SELECTION, not the app. Reinstating the absolute
    // model's "any field a step did not name snaps back" is the thing to avoid.
    const state = walk(startTour([]), 'dir=DOWN', only('sel=Visit'));
    expect(compose(base(), state).dir).toBe('DOWN');
    expect(shown(state)).toEqual(['Visit']);
  });

  test('a tick during a replace goes to temp_held and shows immediately', () => {
    // `temp_held` is NOT suppressed: `Only:` clears the canvas the tour built,
    // it does not fight the viewer while they use it.
    let state = walk(startTour([]), only('sel=Visit'));
    state = tick(state, 'Specimen');
    expect(shown(state)).toEqual(['Specimen', 'Visit']);
    expect(state.tempHeld).toEqual(['Specimen']);
  });

  test('held returns at the crossing back to region 0, not at exit', () => {
    /*
     * The rule is "back into a step shows what that step showed". Going forward
     * the region-0 step displayed `held`, so stepping back into it without
     * `held` would show a step something it never showed — and region 0 would
     * be the one region whose suppression a pop does not lift.
     */
    const state = walk(startTour(['Specimen']), 'sel=Person', only('sel=Visit'));
    expect(shown(state)).toEqual(['Visit']);
    expect(shown(popStep(state))).toEqual(['Person', 'Specimen']);
  });

  test('a cancelling pair of clicks during a replace is a no-op', () => {
    /*
     * The constraint that killed the tidier alternative. Making the tick MOVE a
     * suppressed class out of `held` into `temp_held` gives every class exactly
     * one record — but `+A` then `−A` then DESTROYS `A`, on a class that was
     * suppressed throughout and never appeared on screen. Copying gives the
     * no-op for free. (WORKLOG 2026-09-07; do not reopen.)
     */
    const start = walk(startTour(['Specimen']), only('sel=Visit'));
    const after = untick(tick(start, 'Specimen'), 'Specimen');
    expect(after.held).toEqual(['Specimen']);
    expect(shown(popStep(after))).toEqual(['Specimen']);
    expect(survivingSelection(after)).toEqual(['Specimen']);
  });
});

describe('leaving the tour', () => {
  test('exit keeps what the viewer ticked and drops what the tour drew', () => {
    // Replaces both the entry snapshot and the restore-on-exit: nothing was
    // overwritten, so there is nothing to restore.
    const state = walk(startTour(['Visit']), 'sel=Participant', 'sel=BodySite');
    expect(survivingSelection(state)).toEqual(['Visit']);
    expect(endTour()).toEqual(NO_TOUR);
  });

  test('an edit made mid-tour survives the exit', () => {
    // Under absolute state this was the "your changes will be discarded"
    // warning. Now there is nothing to warn about.
    let state = walk(startTour([]), 'sel=Participant');
    state = tick(state, 'Visit');
    expect(survivingSelection(state)).toEqual(['Visit']);
  });

  test('a tick made during a replace survives too', () => {
    let state = walk(startTour(['Specimen']), only('sel=Visit'));
    state = tick(state, 'TimePeriod');
    expect(survivingSelection(state).sort()).toEqual(['Specimen', 'TimePeriod']);
  });

  test('exit does not need the tour unwound first', () => {
    // The provider used to pop once per pushed frame, which meant keeping a
    // depth count of the host's state. The viewer's half is stored, so exit
    // reads it whatever the tour left on screen.
    const deep = walk(startTour(['Visit']), only('sel=A'), 'sel=B', only('sel=C'));
    expect(survivingSelection(deep)).toEqual(['Visit']);
  });
});

/**
 * The worked example, row by row. The table it encodes is in
 * `tourStateStack.ts`'s header; this is what stops the two drifting apart.
 *
 * It is the one place every rule meets: a replace, ticks on both sides of it, a
 * class with two records, unticks against all three sets, and a `back` walk
 * that crosses the region boundary. Siggie built and verified it by simulation;
 * this pins it so the implementation cannot drift from the note.
 */
describe('worked example', () => {
  /** Every state the forward walk passes through, indexed by the note's row. */
  function forward() {
    const s: TourState[] = [];
    s[0] = startTour(['A', 'B', 'C']);
    s[1] = pushStep(s[0], parseTourChange('sel=U'));            // tour +U
    s[2] = pushStep(s[1], parseTourChange('sel=V'));            // tour +V
    s[3] = tick(tick(s[2], 'D'), 'E');                          // user +D,+E
    s[4] = untick(s[3], 'B');                                   // user -B
    s[5] = pushStep(s[4], parseTourChange('sel=C~W~X', true));  // Only: C,W,X
    s[6] = tick(tick(tick(s[5], 'D'), 'E'), 'F');               // user +D,+E,+F
    s[7] = untick(s[6], 'C');                                   // user -C
    s[8] = pushStep(s[7], parseTourChange('sel=Y'));            // tour +Y
    s[9] = untick(s[8], 'W');                                   // user -W
    s[10] = pushStep(s[9], parseTourChange('sel=Z'));           // tour +Z
    s[11] = untick(s[10], 'E');                                 // user -E
    return s;
  }

  test('the forward walk shows what the note says it shows', () => {
    const s = forward();
    expect(shown(s[1])).toEqual(['A', 'B', 'C', 'U']);
    expect(shown(s[2])).toEqual(['A', 'B', 'C', 'U', 'V']);
    expect(shown(s[3])).toEqual(['A', 'B', 'C', 'D', 'E', 'U', 'V']);
    expect(shown(s[4])).toEqual(['A', 'C', 'D', 'E', 'U', 'V']);
    // The replace: `held` is suppressed, so D and E leave with A and C.
    expect(shown(s[5])).toEqual(['C', 'W', 'X']);
    expect(shown(s[6])).toEqual(['C', 'D', 'E', 'F', 'W', 'X']);
    // −C hits `tour` (which is displaying it), not the `held` copy.
    expect(shown(s[7])).toEqual(['D', 'E', 'F', 'W', 'X']);
    expect(shown(s[8])).toEqual(['D', 'E', 'F', 'W', 'X', 'Y']);
    expect(shown(s[9])).toEqual(['D', 'E', 'F', 'X', 'Y']);
    expect(shown(s[10])).toEqual(['D', 'E', 'F', 'X', 'Y', 'Z']);
    // −E hits `temp_held`; the suppressed `held` copy is untouched.
    expect(shown(s[11])).toEqual(['D', 'F', 'X', 'Y', 'Z']);
  });

  test('the two records of D and E are two facts, not one stored twice', () => {
    const s = forward();
    expect([...s[6].held].sort()).toEqual(['A', 'C', 'D', 'E']);
    expect([...s[6].tempHeld].sort()).toEqual(['D', 'E', 'F']);
  });

  test('back walks out through the tourStates the note lists', () => {
    /*
     * The whole point of tourStates holding only the tour's half. Each `back` shows
     * the tour set as it stood when that step was RECORDED — so W and C come
     * back, having been unticked after their tourStates were written — while the
     * viewer's half stays current, so the −E from state 11 is still in force.
     */
    const s = forward();
    const b1 = popStep(s[11]);          // back to frame 1-1
    expect(shown(b1)).toEqual(['D', 'F', 'W', 'X', 'Y']);
    const b2 = popStep(b1);             // back to frame 1-0
    expect(shown(b2)).toEqual(['C', 'D', 'F', 'W', 'X']);
    const b3 = popStep(b2);             // the crossing: region 0, `held` back
    expect(shown(b3)).toEqual(['A', 'C', 'D', 'E', 'F', 'U', 'V']);
    const b4 = popStep(b3);
    expect(shown(b4)).toEqual(['A', 'C', 'D', 'E', 'F', 'U']);
  });

  test('exit keeps held ∪ temp_held and nothing the tour drew', () => {
    const s = forward();
    expect(survivingSelection(s[11]).sort()).toEqual(['A', 'C', 'D', 'E', 'F']);
  });

  test('an untick rewrites no frame — the ones recorded before it keep the class', () => {
    // The property the whole no-frame-surgery argument rests on: `tour` is
    // LIVE, tourStates are written only at push time. The version this replaced
    // made an untick permanent by rewriting every frame, and `back` then showed
    // the post-untick state rather than what the step had shown.
    const s = forward();
    expect(s[11].tourStates.map(f => [...f.sel])).toEqual([
      ['U'], ['U', 'V'], ['C', 'W', 'X'], ['W', 'X', 'Y'], ['X', 'Y', 'Z'],
    ]);
  });

  test('the region rides on the frame, so crossing back is a read', () => {
    const s = forward();
    expect(s[11].tourStates.map(f => f.region)).toEqual([0, 0, 1, 1, 1]);
  });
});

/**
 * `cat=<id>` in a step's `Change:`/`Only:` query.
 *
 * REGRESSION. `cat` first shipped understood only by `readExploreState`, which
 * reads the URL at startup — but a tour step's query goes through
 * `parseTourChange` instead, and that had its own `sel` reader. So
 * `Only: cat=admin` parsed to an EMPTY selection and, `Only:` being a replace,
 * cleared the canvas rather than filling it: the step rendered a correctly
 * ringed category header beside a blank diagram.
 *
 * Both readers now share one expansion. These pin the parser that was missing
 * it.
 */
describe('cat= in a tour change', () => {
  const admin = ENTITY_CATEGORIES.find(c => c.id === 'admin')!;

  test('Only: cat=<id> selects the whole category', () => {
    expect(parseTourChange('cat=admin', true).sel).toEqual(categoryView(admin));
  });

  test('Change: cat=<id> adds the whole category', () => {
    expect(parseTourChange('cat=admin').sel).toEqual(categoryView(admin));
  });

  test('it draws what the ⊞ button draws, for every category', () => {
    // The same equivalence `exploreState.test.ts` pins for the URL reader —
    // asserted here too, because the whole bug was these two disagreeing.
    for (const cat of ENTITY_CATEGORIES) {
      expect(parseTourChange(`cat=${cat.id}`, true).sel, `category ${cat.id}`)
        .toEqual(categoryView(cat));
    }
  });

  test('an explicit sel still wins', () => {
    expect(parseTourChange('cat=admin&sel=Visit', true).sel).toEqual(['Visit']);
  });

  test('an unknown category selects nothing', () => {
    expect(parseTourChange('cat=nosuch', true).sel).toEqual([]);
  });

  test('it composes onto the canvas like any other change', () => {
    // End to end: the step's query, pushed, composed into the state the app
    // renders. This is the assertion closest to what the screenshot showed.
    const state = pushStep(startTour([]), parseTourChange('cat=admin', true));
    const composed = compose({ ...DEFAULTS }, state);
    expect(composed.sel).toEqual(categoryView(admin));
  });
});
