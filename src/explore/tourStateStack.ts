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
 *
 * **`Only:` — the one frame that subtracts.** Added for the tours, where most
 * steps describe a SPECIFIC small canvas: a category content view, or a
 * two-box example. Additive frames made those cumulative, so a step captioned
 * "Clinical" drew Clinical on top of everything before it. A replacing frame
 * is a HORIZON: while it is on the stack, nothing selected beneath it shows,
 * and it records what it hid in `displaced` so its own pop puts that back.
 *
 * Three properties keep this from being the absolute-state model in disguise:
 *
 *  - **It is scoped to `sel`.** Scalars still merge down the whole stack, so a
 *    replace does not reset the viewer's direction or merge mode.
 *  - **It hides rather than deletes.** The frames below stay on the stack and
 *    come back as it pops, so `back` is still exact.
 *  - **It remembers one frame's worth, not the world.** The old model
 *    snapshotted everything on tour ENTRY and restored it on exit, which is
 *    what discarded mid-tour edits. `displaced` is per-frame and dies with it,
 *    and `reconcile` strips from it anything the viewer has since claimed.
 */

import { type Direction, type ExploreState, type MergeMode } from './exploreState';

/** One position's contribution, parsed out of its `Change:` or `Only:` query. */
export interface TourFrame {
  /** Ids this position adds to the selection. */
  sel: string[];
  /**
   * Scalars this position sets. Only fields the delta actually named appear; a
   * field absent here is a field the step never touches, which is the whole
   * point of the change from absolute state.
   */
  scalars: Partial<Omit<ExploreState, 'sel'>>;
  /**
   * `Only:` rather than `Change:` — `sel` is the WHOLE canvas for as long as
   * this frame is on the stack, not an addition to what was already there.
   *
   * Applies to the selection alone. The scalars in the same query still merge
   * exactly as an additive frame's do.
   */
  replace?: boolean;
  /**
   * What this frame's replace pushed out of view, so that popping can put it
   * back. Empty or absent on an additive frame, which displaces nothing.
   *
   * **This is the only place the stack remembers state rather than deriving
   * it, and the narrowness is deliberate.** The model this file replaced
   * snapshotted the ENTIRE app state on tour entry and restored it on exit,
   * which is what discarded a viewer's mid-tour edits (see the header). A
   * replace has to record something — the ids it hid are not recoverable from
   * anything else once they are off the canvas — but it records only those
   * ids, only for one frame, and only until that frame pops. No scalar, no
   * other frame's contribution, and nothing the viewer does afterwards.
   *
   * Filled in by `pushFrame`, which is the only caller that can see the
   * viewer's selection at the moment of the push. Authors never write it.
   */
  displaced?: string[];
}

/**
 * The tour's live contribution to the app state.
 *
 * `frames` is the stack proper (what to undo, and in what order); `counts` is
 * its selection contribution flattened into a refcount, so callers do not have
 * to re-walk every frame to ask "is the tour holding this id".
 *
 * **`counts` is DERIVED from `frames`, not maintained beside it.** It used to
 * be incremented on push and decremented on pop, which was exactly equivalent
 * while every frame was additive. `Only:` broke that equivalence: a replacing
 * frame hides the frames below it, so the multiset union of every
 * `frames[*].sel` is no longer what the tour is showing. Two sources of truth
 * that agreed by construction would then have had to be kept agreeing by hand,
 * and the failure would have been silent — `reconcile` reads `counts` and
 * would have taken every displaced id for a viewer untick, dropping the tour's
 * claim on ids it had merely hidden. Deriving both from `frames` makes the
 * disagreement unrepresentable.
 */
export interface TourStack {
  frames: TourFrame[];
  counts: ReadonlyMap<string, number>;
}

export const EMPTY_STACK: TourStack = { frames: [], counts: new Map() };

/**
 * Index of the last REPLACING frame — the horizon below which nothing shows.
 * -1 when the stack is all additive, which is the whole-stack case.
 */
function horizon(frames: readonly TourFrame[]): number {
  for (let i = frames.length - 1; i >= 0; i--) if (frames[i].replace) return i;
  return -1;
}

/**
 * The frames that currently contribute: everything from the last replace up.
 * Frames below it are still on the stack — they are what `back` unwinds into —
 * but they contribute nothing while the replace stands.
 */
function visibleFrames(frames: readonly TourFrame[]): readonly TourFrame[] {
  const cut = horizon(frames);
  return cut === -1 ? frames : frames.slice(cut);
}

/** The tour's live selection contribution, refcounted, as a function of `frames`. */
function countsOf(frames: readonly TourFrame[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const frame of visibleFrames(frames)) {
    for (const id of frame.sel) counts.set(id, (counts.get(id) ?? 0) + 1);
  }
  return counts;
}

/** Rebuild a stack's derived half. The only way a `TourStack` is constructed. */
function restack(frames: readonly TourFrame[]): TourStack {
  return { frames: [...frames], counts: countsOf(frames) };
}

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
export function parseTourChange(query: string, replace = false): TourFrame {
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
  const sel = raw ? raw.split(IDS_SEP).filter(Boolean) : [];
  // `replace: undefined` rather than `false` on the common path, so an additive
  // frame serialises and compares the way it always did.
  return replace ? { sel, scalars, replace: true } : { sel, scalars };
}

/**
 * Push a frame. The duplicate-push rule is just `by: 1` with no membership test.
 *
 * A REPLACING frame additionally records what it pushed off the canvas, in
 * `displaced`, so that popping it can restore exactly that. `visible` is the
 * selection as the viewer sees it right now — everything the replace is about
 * to hide, whether the viewer ticked it or an earlier frame pushed it.
 *
 * The ids the frame itself draws are excluded: a class that is on the canvas
 * before the replace AND named by it never leaves, so restoring it on the pop
 * would add a copy that was never taken away.
 */
export function pushFrame(
  stack: TourStack, frame: TourFrame, visible: readonly string[] = [],
): TourStack {
  if (!frame.replace) return restack([...stack.frames, frame]);
  /*
   * Only the VIEWER's ids are recorded. An id a lower frame is holding is
   * already written down — that frame comes back above the horizon when this
   * one pops, and `composeState` re-adds its `sel` unaided. Recording it here
   * as well would restore it twice: once as the tour's, once as the viewer's,
   * and the second copy would outlive the tour.
   */
  const held = stack.counts;
  const displaced = visible.filter(id => !held.has(id) && !frame.sel.includes(id));
  return restack([...stack.frames, { ...frame, displaced }]);
}

/**
 * Pop the top frame. A no-op on an empty stack, so exit paths can just unwind.
 *
 * A replacing frame's `displaced` ids come back as part of the pop. They are
 * returned rather than folded into `counts`, because they are not the tour's
 * to hold: they were the VIEWER's selection (or a lower frame's) before the
 * replace hid them, and putting them into the tour's refcount would mean the
 * next pop took them away again.
 */
export function popFrame(stack: TourStack): TourStack {
  if (stack.frames.length === 0) return stack;
  return restack(stack.frames.slice(0, -1));
}

/**
 * The ids the top frame will restore when popped — its `displaced` set, empty
 * for an additive frame.
 *
 * Read by the host BEFORE calling `popFrame`, and unioned back into the
 * viewer's half. Separate from `popFrame` so the stack stays a pure function of
 * itself and the caller decides where the restored ids land.
 */
export function pendingRestore(stack: TourStack): readonly string[] {
  return stack.frames[stack.frames.length - 1]?.displaced ?? [];
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
  /*
   * A REPLACING frame is a horizon: nothing selected before it shows while it
   * is on the stack. So the composition starts at the LAST replace rather than
   * at the viewer's set — everything below is hidden, not lost, and comes back
   * as each replace pops and restores its `displaced`.
   *
   * Frames pushed AFTER a replace still add to it. That is what lets a step
   * name a clean canvas with `Only:` and a following beat grow it with
   * `Change:`, which is the shape the spine steps want.
   */
  const cut = horizon(stack.frames);
  const sel = cut === -1 ? new Set(viewer.sel) : new Set<string>();
  for (const frame of visibleFrames(stack.frames)) {
    for (const id of frame.sel) sel.add(id);
  }
  /*
   * Scalars are NOT cut off at the horizon: `Only:` replaces the selection, not
   * the whole app state. A step that set `dir=DOWN` three steps ago is still
   * setting it, exactly as it would be under an additive frame.
   */
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
 * **An id hidden by a replace is not an untick.** "Absence is evidence" holds
 * only for ids the tour is actually showing, which is why this reads `counts`
 * (derived from the frames above the last `Only:`) rather than walking every
 * frame. A class a replace pushed off the canvas is absent from `composed.sel`
 * without the viewer having touched it; counting that as an overrule would
 * drop the tour's claim on ids it means to restore when the replace pops.
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

  return {
    state: composed,
    // The frames keep their text — they are still the tour's record of what
    // each step declared — but they no longer hold these ids, so neither a pop
    // nor the final unwind can act on them. `displaced` is filtered too: an id
    // the viewer has spoken for must not be restored by a later pop either.
    stack: restack(stack.frames.map(f => ({
      ...f,
      sel: f.sel.filter(id => !yielded.has(id)),
      ...(f.displaced ? { displaced: f.displaced.filter(id => !yielded.has(id)) } : {}),
    }))),
  };
}
