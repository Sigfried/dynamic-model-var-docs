/**
 * Jumping several tour positions at once lands exactly where stepping would.
 *
 * The tour map (`src/help/TourMap.tsx`) lets a viewer skip from step 2 to step
 * 7. That is `pushStep` five times, folded into ONE host update so the canvas
 * does not churn through four intermediate selections.
 *
 * **The claim this file pins is an equivalence**, because that is the whole
 * argument for the fold being safe: `pushStep`/`popStep` are pure
 * `TourState -> TourState`, the only other writers are `tick`/`untick`, and a
 * viewer cannot click during a jump — so N folded pushes ARE N sequential
 * pushes with the renders elided. Every test below asserts a jumped state
 * against a stepped one rather than against a literal, so the pair cannot
 * drift apart even if the state shape changes.
 *
 * ⚠️ **Not tested here, because it is not true**: scalars do not restore on a
 * backward jump. `popStep` does not restore them by standing decision
 * (2026-08-27, *"easy enough for the user to reclick the button"*), and a jump
 * inherits that. The forward-scalar test below pins the half that IS true.
 */

import { describe, test, expect } from 'vitest';
import {
  startTour, pushStep, popStep, parseTourChange, tick, compose,
  type TourState,
} from '../explore/tourStateStack';
import { DEFAULT_EXPLORE_STATE } from '../explore/exploreState';

/** The changes a tour's steps would push, as authored queries. */
const STEPS: { query: string; replace?: boolean }[] = [
  { query: 'sel=Person' },
  { query: 'sel=Participant' },
  { query: 'sel=Visit~Demography', replace: true },
  { query: 'sel=Consent' },
  { query: 'sel=Organization' },
];

const step = (s: TourState, i: number) =>
  pushStep(s, parseTourChange(STEPS[i].query, STEPS[i].replace));

/**
 * Walk forward one at a time, the way `next` does — INCLUDING the publish
 * between steps, which is the only thing that differs from a jump.
 *
 * `publish` in ExploreApp writes the composed selection to the URL and lets
 * the app re-read it, so it reads `tourState` and does not write it. Modelled
 * here as a compose whose result is discarded: if composing ever mutated the
 * state, this walk would diverge from the fold and the equivalence test would
 * catch it. That divergence is the whole risk the fold takes.
 */
function stepped(from: TourState, upTo: number): TourState {
  let s = from;
  for (let i = 0; i < upTo; i++) {
    s = step(s, i);
    compose(DEFAULT_EXPLORE_STATE, s);
  }
  return s;
}

/** Fold the same run in one go, with no publish until the end — the map. */
function jumped(from: TourState, upTo: number): TourState {
  let s = from;
  for (const c of STEPS.slice(0, upTo)) s = pushStep(s, parseTourChange(c.query, c.replace));
  compose(DEFAULT_EXPLORE_STATE, s);
  return s;
}

describe('jumping forward', () => {
  test('a folded run equals the same run stepped, at every length', () => {
    // Every length, not just one: a replace sits at index 2, so runs that stop
    // short of it, land on it and cross it are three different cases and the
    // loop covers all of them without three near-identical tests.
    for (let n = 0; n <= STEPS.length; n++) {
      const base = startTour(['Specimen']);
      expect(jumped(base, n), `run of ${n}`).toEqual(stepped(base, n));
    }
  });

  test('the viewer\'s selection is untouched by a jump', () => {
    // The premise the fold rests on: `held` is written only by tick/untick,
    // so no number of pushes can move it. If this ever fails, the fold is
    // unsafe and the map has to step instead.
    const base = startTour(['Specimen', 'Assay']);
    const after = jumped(base, STEPS.length);
    expect(after.held).toEqual(base.held);
    expect(after.tempHeld).toEqual(base.tempHeld);
  });

  test('a jump across a replace lands in the right region', () => {
    // `region` is what suppresses `held`, so an off-by-one here shows up as
    // the viewer's own selection wrongly appearing or wrongly vanishing --
    // the failure the whole state model exists to prevent.
    const base = startTour(['Specimen']);
    expect(jumped(base, 2).region).toBe(0);   // before the replace
    expect(jumped(base, 3).region).toBe(1);   // onto it
    expect(jumped(base, 5).region).toBe(1);   // past it
  });

  test('scalars accumulate across a jump, last write winning', () => {
    const run = ['dir=DOWN', 'sibs=1', 'dir=RIGHT'];
    let s = startTour([]);
    for (const q of run) s = pushStep(s, parseTourChange(q));
    // Asserted against the authored queries rather than against a second
    // identical loop, which would only prove the loop equals itself.
    expect(s.scalars.sibs).toBe(true);
    expect(s.scalars.dir).toBe('RIGHT');
  });
});

describe('jumping backward', () => {
  test('popping back to a step equals having stepped only that far', () => {
    const base = startTour(['Specimen']);
    for (let target = 0; target < STEPS.length; target++) {
      let s = stepped(base, STEPS.length);
      for (let i = 0; i < STEPS.length - target; i++) s = popStep(s);
      // `scalars` is the known exception -- it is not restored by a pop -- so
      // the comparison is of the selection state, which is what a jump has to
      // get right.
      const want = stepped(base, target);
      expect({ tour: s.tour, region: s.region, tourStates: s.tourStates },
        `back to ${target}`)
        .toEqual({ tour: want.tour, region: want.region, tourStates: want.tourStates });
    }
  });

  test('a viewer tick made mid-tour survives a backward jump', () => {
    // The case a naive "restart and replay" implementation would lose, and
    // the reason the map pops rather than restarting.
    let s = stepped(startTour(['Specimen']), 2);
    s = tick(s, 'BodySite');
    let back = s;
    for (let i = 0; i < 2; i++) back = popStep(back);
    expect(back.held).toContain('BodySite');
    expect(compose(DEFAULT_EXPLORE_STATE, back).sel).toContain('BodySite');
  });
});
