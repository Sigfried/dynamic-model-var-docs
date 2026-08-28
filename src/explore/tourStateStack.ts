/**
 * The tour's state stack: how a tour position contributes to the app's state
 * without owning it.
 *
 * **Why this exists.** A tour step used to carry a FULL absolute query and
 * `applyExploreQuery` did `url.search = query`, replacing everything. Three
 * consequences, all fixed here: the tour had to snapshot the viewer's state on
 * entry and restore it on exit; a mid-tour viewer edit was clobbered (hence
 * the yellow "your changes will be discarded" warning); and **any field a step
 * did not name snapped back to its default** — invisible from a default view,
 * baffling from any other.
 *
 * **The model (Siggie, 2026-08-27).** A step declares only what it ADDS, as a
 * `Change:` delta. Each position PUSHES a frame; `back` POPS one; leaving the
 * tour by any exit unwinds whatever is left. **A value already present is
 * pushed anyway** — that second copy is a reference count, so popping removes
 * only the tour's copy and the viewer's own selection survives untouched.
 *
 * **Every field pushes and pops the same way.** I proposed a hybrid —
 * refcounted pushes for the set-like `sel` plus previous-value frames for the
 * five scalars — and Siggie rejected it: *"you're overcomplicating for the sake
 * of probably rare edge cases. just do the stack. if scalar settings clobber
 * user actions, don't worry about it. easy enough for the user to reclick the
 * button."* So a scalar push overwrites and a scalar pop restores nothing; only
 * `sel` is refcounted, because only `sel` has room to hold two copies.
 *
 * **Where the second copy actually lives.** Not in `sel` — that is a set, and a
 * set cannot hold two copies of anything, which is the trap this file exists to
 * avoid. The tour's contribution is kept HERE as a counted multiset
 * (`TourStack.counts`) and the app's selection is composed as *viewer ∪ tour*.
 * So an id the viewer ticked AND a step pushed is count 1 in the tour and 1 in
 * the viewer's set; the pop takes the tour's and the viewer's tick is still
 * standing. That is the whole mechanism.
 */

import { type Direction, type ExploreState, type MergeMode } from './exploreState';

/** One position's contribution, parsed out of its `Change:` query. */
export interface TourFrame {
  /** Ids this position adds to the selection. */
  sel: string[];
  /**
   * Scalars this position sets. Only fields the delta actually named appear; a
   * field absent here is a field the step never touches, which is the whole
   * point of the change from absolute state.
   */
  scalars: Partial<Omit<ExploreState, 'sel'>>;
}

/**
 * The tour's live contribution to the app state.
 *
 * `frames` is the stack proper (what to undo, and in what order); `counts` is
 * its selection contribution flattened into a refcount, so `pushed`/`popped`
 * do not have to re-walk every frame. They are maintained together and are
 * always consistent: `counts` is exactly the multiset union of `frames[*].sel`.
 */
export interface TourStack {
  frames: TourFrame[];
  counts: ReadonlyMap<string, number>;
}

export const EMPTY_STACK: TourStack = { frames: [], counts: new Map() };

const IDS_SEP = '~';

function oneOf<T extends string>(value: string | null, allowed: readonly T[]): T | null {
  return value && (allowed as readonly string[]).includes(value) ? (value as T) : null;
}

/**
 * Parse a step's `Change:` query into a frame.
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
export function parseTourChange(query: string): TourFrame {
  const p = new URLSearchParams(query);
  const scalars: TourFrame['scalars'] = {};

  if (p.has('detail')) scalars.detail = p.get('detail') || null;
  if (p.has('roots')) scalars.roots = p.get('roots') === '1';
  if (p.has('sibs')) scalars.sibs = p.get('sibs') === '1';
  const dir = oneOf<Direction>(p.get('dir'), ['RIGHT', 'DOWN']);
  if (dir) scalars.dir = dir;
  const merge = oneOf<MergeMode>(p.get('merge'), ['near', 'far', 'bend', 'off']);
  if (merge) scalars.merge = merge;

  const raw = p.get('sel');
  return { sel: raw ? raw.split(IDS_SEP).filter(Boolean) : [], scalars };
}

function bump(counts: ReadonlyMap<string, number>, ids: string[], by: 1 | -1): Map<string, number> {
  const next = new Map(counts);
  for (const id of ids) {
    const n = (next.get(id) ?? 0) + by;
    if (n > 0) next.set(id, n);
    else next.delete(id);
  }
  return next;
}

/** Push a frame. The duplicate-push rule is just `by: 1` with no membership test. */
export function pushFrame(stack: TourStack, frame: TourFrame): TourStack {
  return {
    frames: [...stack.frames, frame],
    counts: bump(stack.counts, frame.sel, 1),
  };
}

/** Pop the top frame. A no-op on an empty stack, so exit paths can just unwind. */
export function popFrame(stack: TourStack): TourStack {
  const top = stack.frames[stack.frames.length - 1];
  if (!top) return stack;
  return {
    frames: stack.frames.slice(0, -1),
    counts: bump(stack.counts, top.sel, -1),
  };
}

/** Unwind the whole stack at once — every tour exit (done, ✕, Escape, `?`). */
export function clearStack(): TourStack {
  return EMPTY_STACK;
}

/**
 * The app state the viewer should see: their own state with the tour's
 * contribution composed on top.
 *
 * `sel` unions the tour's refcounted ids into the viewer's set — a count of 2
 * and a count of 1 both mean "on the canvas", since the count only decides what
 * survives a pop. Scalars are last-write-wins down the stack, which is the same
 * "the tour's copy sits on top of the viewer's" rule for a field with one slot.
 */
export function composeState(viewer: ExploreState, stack: TourStack): ExploreState {
  const sel = new Set(viewer.sel);
  for (const id of stack.counts.keys()) sel.add(id);
  let scalars: TourFrame['scalars'] = {};
  for (const frame of stack.frames) scalars = { ...scalars, ...frame.scalars };
  return { ...viewer, ...scalars, sel: [...sel] };
}

/**
 * Split a composed state back into the viewer's half — the inverse of
 * `composeState` for `sel`, and the identity for everything else.
 *
 * Needed because the app holds ONE state (the composed one) and that is what
 * the viewer edits. Anything selected that the tour is not holding is theirs,
 * whether they ticked it before the tour started or during it.
 *
 * The scalars are NOT split back out, per the decision above: once a step sets
 * `dir`, that value is simply the state's, and popping does not restore the
 * viewer's.
 */
export function viewerState(composed: ExploreState, stack: TourStack): ExploreState {
  return { ...composed, sel: composed.sel.filter(id => !stack.counts.has(id)) };
}

/**
 * Fold a viewer's mid-tour edit into the stack, so that their intent outlives
 * the next pop.
 *
 * **Why the stack has to change at all.** `sel` is a set: it cannot hold the
 * tour's copy and the viewer's copy of the same id side by side, which is
 * exactly what the duplicate push assumes. So when the two collide, the tour
 * yields its claim and the id becomes plainly the viewer's. Both collisions
 * reduce to the same move — *drop every tour copy of an id the viewer acted
 * on* — but for opposite-looking reasons:
 *
 *  - **They unticked something a step pushed.** They have overruled the tour.
 *    Without dropping the claim the very next compose would put it back and
 *    the checkbox would refuse to stay off.
 *  - **They ticked something a step had already pushed.** Their tick is a
 *    second copy that the set silently swallowed. Dropping the tour's claim
 *    makes the surviving copy theirs, so the pop cannot take it from under
 *    them.
 *
 * `ticked` is supplied by the caller because a tick of an already-selected id
 * is invisible in the resulting state — nothing about `composed` records that
 * it happened. An untick needs no such help: the id's absence is the evidence.
 *
 * Returns the state unchanged; only the stack moves. It is returned alongside
 * so callers read one result rather than pairing two calls in the right order.
 */
export function reconcile(
  composed: ExploreState, stack: TourStack, edit: { ticked?: readonly string[] },
): { state: ExploreState; stack: TourStack } {
  const selected = new Set(composed.sel);
  const yielded = new Set<string>();
  for (const id of stack.counts.keys()) {
    if (!selected.has(id)) yielded.add(id);              // overruled by an untick
  }
  for (const id of edit.ticked ?? []) {
    if (stack.counts.has(id)) yielded.add(id);           // claimed by a tick
  }
  if (yielded.size === 0) return { state: composed, stack };

  const counts = new Map(stack.counts);
  for (const id of yielded) counts.delete(id);
  return {
    state: composed,
    // The frames keep their text — they are still the tour's record of what
    // each step declared — but they no longer hold these ids, so neither a pop
    // nor the final unwind can act on them.
    stack: { frames: stack.frames.map(f => ({ ...f, sel: f.sel.filter(id => !yielded.has(id)) })), counts },
  };
}
