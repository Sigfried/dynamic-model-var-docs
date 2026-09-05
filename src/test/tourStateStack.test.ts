import { describe, test, expect } from 'vitest';
import {
  parseTourChange, pushFrame, popFrame, pendingRestore, clearStack, composeState,
  viewerState, reconcile, EMPTY_STACK, type TourStack,
} from '../explore/tourStateStack';
import { DEFAULTS, type ExploreState } from '../explore/exploreState';

/**
 * The tour's state stack (docs/TASKS.md item 2, Siggie 2026-08-27).
 *
 * The model being replaced: every step carried a FULL absolute query, applied
 * with `url.search = query`. So the tour had to snapshot and restore the
 * viewer's state, a mid-tour edit was clobbered, and any field a step did not
 * name snapped back to its default. Under the stack a step declares only what
 * it ADDS, `back` pops, and exit unwinds.
 */

const base = (over: Partial<ExploreState> = {}): ExploreState => ({ ...DEFAULTS, ...over });

/** Push a sequence of `Change:` queries, as walking forward through a tour. */
function walk(...queries: string[]): TourStack {
  return queries.reduce((s, q) => pushFrame(s, parseTourChange(q)), EMPTY_STACK);
}

describe('parseTourChange', () => {
  test('an absent field means "leave it alone", not "use the default"', () => {
    // THE inversion. Under absolute state, `sel=X` also meant sibs/dir/merge
    // back to their defaults; under the stack it means only "add X".
    const frame = parseTourChange('sel=MeasurementObservation');
    expect(frame.sel).toEqual(['MeasurementObservation']);
    expect(frame.scalars).toEqual({});
  });

  test('an empty change touches nothing at all', () => {
    // Under absolute state an empty `State:` was a REAL state — the default
    // view, everything cleared. Under the stack it is a step that changes
    // nothing, which is what an exposition step actually wants.
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
});

describe('push and pop', () => {
  test('a step adds its ids to whatever the viewer had', () => {
    const stack = walk('sel=Participant');
    expect(composeState(base({ sel: ['Visit'] }), stack).sel.sort())
      .toEqual(['Participant', 'Visit']);
  });

  test('back removes only what that step added', () => {
    const stack = walk('sel=Participant', 'sel=BodySite');
    const after = popFrame(stack);
    expect(composeState(base({ sel: ['Visit'] }), after).sel.sort())
      .toEqual(['Participant', 'Visit']);
  });

  test('a step that changes nothing leaves the view exactly as it was', () => {
    // The exposition step. Under absolute state this was the case that
    // required an empty `State:` and cleared the canvas.
    const viewer = base({ sel: ['Visit'], dir: 'DOWN' });
    const stack = walk('sel=Participant', '');
    expect(composeState(viewer, stack).sel.sort()).toEqual(['Participant', 'Visit']);
    expect(composeState(viewer, stack).dir).toBe('DOWN');
  });
});

describe('the duplicate push is a reference count', () => {
  test("popping the tour's copy leaves the viewer's selection standing", () => {
    // Siggie's core case: "if the new piece of state is already in the state,
    // add it a second time, so back can just pop off the stack and the user's
    // actions remain untouched."
    const viewer = base({ sel: ['Participant'] });
    const stack = walk('sel=Participant');
    expect(composeState(viewer, stack).sel).toEqual(['Participant']);
    expect(composeState(viewer, popFrame(stack)).sel).toEqual(['Participant']);
  });

  test('two steps wanting the same class both have to pop before it goes', () => {
    const stack = walk('sel=Participant', 'sel=Participant~BodySite');
    const once = popFrame(stack);
    expect(composeState(base(), once).sel).toEqual(['Participant']);
    expect(composeState(base(), popFrame(once)).sel).toEqual([]);
  });

  test('a class the tour pushed goes when the tour is done with it', () => {
    const stack = walk('sel=Participant');
    expect(composeState(base(), popFrame(stack)).sel).toEqual([]);
  });
});

describe('scalars overwrite and do not restore', () => {
  test('a step sets a scalar over the viewer\'s value', () => {
    const stack = walk('dir=DOWN');
    expect(composeState(base({ dir: 'RIGHT' }), stack).dir).toBe('DOWN');
  });

  test('popping does NOT put the viewer\'s scalar back', () => {
    /*
     * Deliberate, and decided rather than overlooked. Siggie: "you're
     * overcomplicating for the sake of probably rare edge cases. just do the
     * stack. if scalar settings clobber user actions, don't worry about it.
     * easy enough for the user to reclick the button." Carrying a second frame
     * type for the five scalars costs more than the click it saves.
     */
    const stack = walk('dir=DOWN');
    expect(composeState(base({ dir: 'RIGHT' }), popFrame(stack)).dir).toBe('RIGHT');
  });

  test('the topmost frame naming a scalar wins', () => {
    const stack = walk('dir=DOWN', 'dir=RIGHT');
    expect(composeState(base(), stack).dir).toBe('RIGHT');
    // ...and popping that one exposes the frame beneath, not the default.
    expect(composeState(base(), popFrame(stack)).dir).toBe('DOWN');
  });

  test('a step that never names a field never touches it', () => {
    // The live bug this design fixes: Siggie had a non-default setting and
    // every step carrying a `State:` reset it, because no step wrote that
    // param. Nothing warned; the canvas just changed mid-tour.
    const viewer = base({ sibs: false, merge: 'far', roots: true });
    const composed = composeState(viewer, walk('sel=Participant'));
    expect(composed.sibs).toBe(false);
    expect(composed.merge).toBe('far');
    expect(composed.roots).toBe(true);
  });
});

describe('leaving the tour', () => {
  test('exit unwinds everything the tour added and nothing else', () => {
    // Replaces the entry snapshot AND the restore-on-exit: there is nothing to
    // restore, because the viewer's state was never overwritten.
    const viewer = base({ sel: ['Visit'], dir: 'DOWN' });
    const stack = walk('sel=Participant', 'sel=BodySite');
    expect(composeState(viewer, clearStack()).sel).toEqual(['Visit']);
    expect(composeState(viewer, clearStack()).dir).toBe('DOWN');
    expect(stack.frames).toHaveLength(2); // unchanged; clearStack is not a mutation
  });

  test('an edit made mid-tour survives the exit', () => {
    // Under absolute state this was the "your changes will be discarded"
    // warning. Now there is nothing to warn about.
    const stack = walk('sel=Participant');
    const composed = composeState(base(), stack);
    const edited = { ...composed, sel: [...composed.sel, 'Visit'] };
    const viewer = viewerState(edited, stack);
    expect(composeState(viewer, clearStack()).sel).toEqual(['Visit']);
  });
});

describe('viewerState — splitting a composed state back apart', () => {
  test("what the tour is holding is not the viewer's", () => {
    const stack = walk('sel=Participant');
    const composed = composeState(base({ sel: ['Visit'] }), stack);
    expect(viewerState(composed, stack).sel).toEqual(['Visit']);
  });

  test('a mid-tour tick of a class the tour also pushed becomes the viewer\'s', () => {
    /*
     * The refcount from the other end. The tour pushed Participant; the viewer
     * then ticks it too. `sel` is a set and cannot hold two copies, so the
     * second copy is recorded by `reconcile` promoting the id — otherwise the
     * next pop would take it away under them.
     */
    const stack = walk('sel=Participant');
    const composed = composeState(base(), stack);
    // The viewer's click is a no-op on the set; reconcile is what notices.
    const { stack: next } = reconcile(composed, stack, { ticked: ['Participant'] });
    expect(composeState(viewerState(composed, next), popFrame(next)).sel)
      .toEqual(['Participant']);
  });
});

describe('reconcile — the viewer overrules the tour', () => {
  test('unticking a class the tour pushed keeps it gone across the next pop', () => {
    // Without this the stack would still be holding the id and the next
    // compose would put it straight back, so the checkbox would not stay off.
    const stack = walk('sel=Participant', 'sel=BodySite');
    const composed = composeState(base(), stack);
    const unticked = { ...composed, sel: composed.sel.filter(id => id !== 'Participant') };
    const { stack: next } = reconcile(unticked, stack, {});
    expect(composeState(viewerState(unticked, next), next).sel).toEqual(['BodySite']);
    expect(composeState(viewerState(unticked, next), popFrame(next)).sel).toEqual([]);
  });

  test('unticking drops every tour copy, not just the top one', () => {
    // Two steps wanted it; the viewer said no. One click should mean no, not
    // "no until the older frame pops".
    const stack = walk('sel=Participant', 'sel=Participant');
    const composed = composeState(base(), stack);
    const unticked = { ...composed, sel: [] };
    const { stack: next } = reconcile(unticked, stack, {});
    expect(next.counts.has('Participant')).toBe(false);
  });

  test('a viewer tick of an unrelated class does not disturb the stack', () => {
    const stack = walk('sel=Participant');
    const composed = composeState(base(), stack);
    const edited = { ...composed, sel: [...composed.sel, 'Visit'] };
    const { stack: next } = reconcile(edited, stack, {});
    expect(next).toEqual(stack);
    expect(viewerState(edited, next).sel).toEqual(['Visit']);
  });
});

/**
 * `Only:` — the replacing frame (docs/tasks.md item 3).
 *
 * `Change:` is additive, which is right for a step that grows a picture one
 * box at a time and wrong for one whose copy names a SPECIFIC canvas: the
 * category content views, and the two/three-box examples in the Ownership
 * tour. Those accumulated into each other, so a step captioned "Clinical"
 * drew Clinical on top of everything before it.
 *
 * A replacing frame is a HORIZON — nothing beneath it shows while it stands —
 * and it records what it hid so its own pop puts that back.
 */
describe('Only: replaces the canvas', () => {
  /** Walk forward, marking which queries were authored as `Only:`. */
  const only = (q: string) => ({ q, replace: true });
  const add = (q: string) => ({ q, replace: false });
  function walkMixed(
    viewer: ExploreState, ...steps: Array<{ q: string; replace: boolean }>
  ): TourStack {
    return steps.reduce((s, { q, replace }) => {
      const live = composeState(viewer, s);
      return pushFrame(s, parseTourChange(q, replace), live.sel);
    }, EMPTY_STACK);
  }

  test('a replacing step draws exactly what it names', () => {
    const stack = walkMixed(base(), add('sel=Person~Participant'), only('sel=Visit'));
    expect(composeState(base(), stack).sel).toEqual(['Visit']);
  });

  test("it hides the viewer's own selection too", () => {
    const viewer = base({ sel: ['Specimen'] });
    const stack = walkMixed(viewer, only('sel=Visit~TimePeriod'));
    expect(composeState(viewer, stack).sel).toEqual(['Visit', 'TimePeriod']);
  });

  test('popping it restores what it displaced', () => {
    // The property that makes `back` exact. The old absolute model got this by
    // snapshotting the whole world on tour entry; this remembers one frame's
    // worth and throws it away with the frame.
    const viewer = base({ sel: ['Specimen'] });
    const stack = walkMixed(viewer, only('sel=Visit'));
    const popped = popFrame(stack);
    const restored = [...new Set([
      ...composeState(viewerState(composeState(viewer, stack), stack), popped).sel,
      ...pendingRestore(stack),
    ])];
    expect(restored.sort()).toEqual(['Specimen']);
  });

  test('a lower frame comes back on its own, and is not double-restored', () => {
    // A tour frame beneath the horizon is already written down: popping the
    // replace puts it back above the horizon and `composeState` re-adds it.
    // Recording it as displaced as well would restore a second copy that
    // outlived the tour.
    const stack = walkMixed(base(), add('sel=Person'), only('sel=Visit'));
    expect(stack.frames[1].displaced).toEqual([]);
    expect(composeState(base(), popFrame(stack)).sel).toEqual(['Person']);
  });

  test('a later Change: adds to the replaced canvas rather than reviving the old one', () => {
    // What lets a step name a clean canvas and a following beat grow it.
    const stack = walkMixed(
      base({ sel: ['Specimen'] }), only('sel=Visit'), add('sel=TimePeriod'),
    );
    expect(composeState(base({ sel: ['Specimen'] }), stack).sel)
      .toEqual(['Visit', 'TimePeriod']);
  });

  test('a second Only: moves the horizon up', () => {
    const stack = walkMixed(base(), only('sel=Person~Participant'), only('sel=Specimen'));
    expect(composeState(base(), stack).sel).toEqual(['Specimen']);
    // ...and popping it lands back on the first replace, not on the empty canvas.
    expect(composeState(base(), popFrame(stack)).sel).toEqual(['Person', 'Participant']);
  });

  test('scalars still merge across the horizon', () => {
    // `Only:` replaces the SELECTION, not the app. A step that set the
    // direction three steps ago is still setting it — reinstating the absolute
    // model's "any field a step did not name snaps back" is the thing to avoid.
    const stack = walkMixed(base(), add('dir=DOWN'), only('sel=Visit'));
    const composed = composeState(base(), stack);
    expect(composed.dir).toBe('DOWN');
    expect(composed.sel).toEqual(['Visit']);
  });

  test('an id the replace also names is not treated as displaced', () => {
    // It never left the canvas, so restoring it on the pop would add a copy
    // that was never taken away.
    const viewer = base({ sel: ['Visit', 'Specimen'] });
    const stack = walkMixed(viewer, only('sel=Visit'));
    expect(stack.frames[0].displaced).toEqual(['Specimen']);
  });

  test('a class hidden by a replace is not mistaken for a viewer untick', () => {
    // `reconcile` reads absence as an overrule. A replace makes ids absent
    // without the viewer touching anything, so it must read the DERIVED counts
    // (frames above the horizon) rather than every frame ever pushed.
    const stack = walkMixed(base(), add('sel=Person'), only('sel=Visit'));
    const composed = composeState(base(), stack);
    const { stack: next } = reconcile(composed, stack, {});
    expect(next.frames[0].sel).toEqual(['Person']);
    expect(composeState(base(), popFrame(next)).sel).toEqual(['Person']);
  });

  test('a viewer claim survives the restore', () => {
    // They unticked something the replace was holding for them; the pop must
    // not hand it back.
    const viewer = base({ sel: ['Specimen'] });
    const stack = walkMixed(viewer, only('sel=Visit'));
    // The viewer unticks Visit, which the tour is showing.
    const composed = composeState(viewer, stack);
    const unticked = { ...composed, sel: composed.sel.filter(id => id !== 'Visit') };
    const { stack: next } = reconcile(unticked, stack, {});
    expect(next.counts.has('Visit')).toBe(false);
  });
});
