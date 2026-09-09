/**
 * Help + tour, as two modes over one registry.
 *
 * Per docs/HELP_PACKAGE_PLAN.md, hints and tour are not two features: they are
 * two navigation states over the same content, the same `data-help-id`
 * anchoring, and the same popover.
 *
 *  - **help mode** — every anchor is marked; click any; self-directed.
 *  - **tour mode** — one anchor at a time, ordered, prev/next.
 *
 * Deliberate departures from the icd11-playground original, both from the plan:
 *
 * 1. **No native-`title` swapping.** The original replaced every tagged
 *    element's `title` and suppressed everyone else's, which is the most
 *    intricate code in `useHelpMode` (SVG `<title>` injection, plus a
 *    restore-on-exit race against React rewriting the attribute). It existed
 *    only because there was no visible way to see which elements have help.
 *    **Hints do that job now**, so the whole mechanism is dropped.
 * 2. **The platform does the overlay plumbing.** Top-layer rendering and
 *    light-dismiss come from the Popover API instead of a portal plus a
 *    deferred-`mousedown` dance.
 *
 * Kept from the original because they are real edge cases, not incidental:
 * capture-phase click interception (so a help click doesn't fall through and
 * actually operate the app), `?` guarded by an input-focus check, two-stage
 * Escape (close the popover, then leave the mode), and exit-on-window-blur.
 */

import {
  useCallback, useEffect, useMemo, useState, type ReactNode,
} from 'react';
import {
  fillPlaceholders, parseAnchor, parseHelpContent, tourNames, tourPositions, tourSteps,
} from './parseHelpContent';
import type { HelpAnchor, HelpContent, TextResolver } from './parseHelpContent';
import {
  HelpContext, HELP_MODE_ENABLED, ADDRESS_TOGGLE_ENABLED,
  type HelpApi,
} from './helpContext';

/** Where the TEMPORARY address toggle remembers itself. See `showAddresses`. */
const ADDRESS_KEY = 'dmvd.help.showAddresses';

/** True when focus is in a text field, so `?` types instead of toggling. */
function isInputFocused(): boolean {
  const el = document.activeElement;
  return el instanceof HTMLInputElement
    || el instanceof HTMLTextAreaElement
    || el?.getAttribute('contenteditable') === 'true';
}

/**
 * Fill `{{kind:arg}}` placeholders everywhere PROSE can appear in the content.
 *
 * Which fields those are is a judgement, not "all strings": the viewer-facing
 * text (descriptions, beat text, the action band, context, interactions, tour
 * blurbs) is filled, while ids, titles, anchors and queries are not. A
 * placeholder in a `Change:` query would be substituting into a URL, and one
 * in an id would break the address tags — neither is a thing to support by
 * accident.
 *
 * Returns the content UNCHANGED when there are no resolvers, so a host that
 * passes none pays nothing and behaves exactly as before.
 */
function resolveText(
  content: HelpContent,
  textResolvers: Record<string, TextResolver> | undefined,
): HelpContent {
  if (!textResolvers) return content;
  const fill = (s: string) => fillPlaceholders(s, textResolvers);
  const fillOpt = (s: string | undefined) => (s === undefined ? undefined : fill(s));

  const entries = new Map(
    [...content.entries].map(([id, e]) => [id, {
      ...e,
      description: fill(e.description),
      interactions: e.interactions.map(fill),
      action: fillOpt(e.action),
      context: fillOpt(e.context),
      beats: e.beats?.map(b => ({ ...b, description: fillOpt(b.description), action: fillOpt(b.action) })),
    }]),
  );

  return {
    // Sections hold the SAME entry objects as the map, so they are rebuilt
    // from it rather than filled a second time — otherwise a step reached
    // through a section would be a different object from the one the map
    // returns, and identity comparisons between them would silently stop
    // holding.
    sections: content.sections.map(s => ({
      ...s,
      entries: s.entries.map(e => entries.get(e.id) ?? e),
      tourMeta: s.tourMeta && { ...s.tourMeta, description: fill(s.tourMeta.description) },
    })),
    entries,
    tourMeta: new Map(
      [...content.tourMeta].map(([name, m]) => [name, { ...m, description: fill(m.description) }]),
    ),
  };
}

export function HelpProvider({
  markdown, onPushChange, onPopChange, onJumpChanges, onTourStart, onTourEnd,
  textResolvers, centerOn, children,
}: {
  markdown: string;
  /**
   * Push a position's `Change:` query onto the host's state stack.
   *
   * The provider does not know how the host stores its state, and under the
   * stack it does not need to know what a push MEANS either — it counts
   * frames and the host composes them. Without this, steps that need a
   * selection simply show their popover against whatever is on screen.
   *
   * `replace` distinguishes a position authored with `Only:` from one authored
   * with `Change:`: the query is the same shape either way, and the flag says
   * whether it ADDS to the selection or IS the selection. Interpreting it is
   * the host's job — the provider still just counts frames.
   */
  onPushChange?: (query: string, replace?: boolean) => void;
  /**
   * Step the host back one position, undoing whatever the position being LEFT
   * contributed. Called once per `back`, and not on exit — `onTourEnd` does
   * that in one move.
   *
   * This pair REPLACED an apply/read pair that made every step absolute. The
   * provider used to snapshot the viewer's state on entry and feed it back on
   * exit; there is nothing to restore now, because nothing was overwritten.
   */
  onPopChange?: () => void;
  /**
   * Move the host several positions at once, in ONE update.
   *
   * What the tour map needs: jumping from step 2 to step 7 is five pushes, and
   * driving them through `onPushChange` one at a time would make the host
   * publish five times, churning the canvas through four selections nobody
   * asked to see. `pops` first, then `changes` — a jump is only ever one
   * direction, so exactly one of them is non-empty.
   *
   * Optional like the rest: a host that does not implement it simply has no
   * jumping, and `goToStep` falls back to nothing rather than to a loop of
   * single steps that would churn.
   */
  onJumpChanges?: (changes: { query: string; replace?: boolean }[], pops: number) => void;
  /**
   * A tour is beginning: whatever is on screen belongs to the viewer.
   *
   * The provider has to say this out loud rather than let the host infer it
   * from the first push, because a tour whose opening position carries no
   * `Change:` pushes nothing — the first tour in dmvd's content file is exactly
   * that — so "something has been pushed" is not the same question as "a tour
   * is running", and a viewer edit during those opening steps would be filed as
   * nobody's.
   */
  onTourStart?: () => void;
  /**
   * A tour is over, by any exit (done, ✕, Escape, `?`). The host restores the
   * viewer's canvas in one move.
   *
   * This REPLACED unwinding by calling `onPopChange` once per pushed frame,
   * which required the provider to keep a depth count of the host's state — a
   * second view of a fact the host already had.
   */
  onTourEnd?: () => void;
  /**
   * Resolvers for the host's own TEXT kinds: what a `{{kind:arg}}` placeholder
   * in a description is replaced with. The same seam as the anchor kinds and
   * for the same reason — `{{model-description:Participant}}` means knowing what
   * a class is, which this package must not.
   *
   * An unregistered kind, or one returning undefined, leaves the placeholder
   * visible rather than blanking it; see `fillPlaceholders`.
   */
  textResolvers?: Record<string, TextResolver>;
  /**
   * Where an UNANCHORED popover (`Anchor: none`, or an anchor that did not
   * resolve) is centred. Written in the same `kind:arg` grammar as `Anchor:`,
   * so `graph-canvas` means the element tagged `data-help-id="graph-canvas"`.
   *
   * Centring on the whole viewport puts the popover half over the left panel,
   * which the tour is usually talking ABOUT — the reader cannot see what the
   * step refers to. Naming the region the app wants a popover to sit over
   * keeps that decision on the host's side of the seam; the package still
   * knows nothing about what a graph canvas is.
   *
   * Omitted, or resolving to null (region not mounted yet), falls back to the
   * viewport — the previous behaviour exactly.
   */
  centerOn?: string;
  children: ReactNode;
}) {
  /*
   * Text resolvers can arrive either way: as a PROP, for a host whose data is
   * ready before the provider mounts, or through `setTextResolvers` once it
   * loads. dmvd needs the second — the provider wraps the component that loads
   * the model — and the prop is kept because it is the simpler path and the
   * one a test or a smaller host wants.
   *
   * The registered set wins when both are present, since it is by definition
   * the later news.
   */
  const [registered, setRegistered] = useState<Record<string, TextResolver>>();
  const activeResolvers = registered ?? textResolvers;

  /*
   * Parsed, then FILLED — `{{kind:arg}}` placeholders replaced with whatever
   * the resolvers return.
   *
   * Done here, once, rather than at render: everything downstream (the
   * popover, the tour positions, the address tag that copies a step's text)
   * then sees finished prose and none of it has to know placeholders exist.
   * The parser stays pure — it never calls a resolver — so its tests keep
   * pinning the format rather than the host's data.
   */
  const content = useMemo(
    () => resolveText(parseHelpContent(markdown), activeResolvers),
    [markdown, activeResolvers],
  );

  const [helpMode, setHelpMode] = useState(false);
  const [tourIndex, setTourIndex] = useState<number | null>(null);
  /**
   * Which tour is running, or about to. `undefined` means the first one in the
   * file, which is what `tourSteps`/`tourPositions` already fall back to.
   *
   * **The provider used to have no such state**, so it always navigated
   * `tourPositions(content)` with no name — the first tour in the file, and
   * only ever that one. The parser has supported named tours since 2026-08-28;
   * nothing could select one, so a second `Tour:` name parsed cleanly, passed
   * every test, and was unreachable. Held here rather than passed to
   * `startTour` alone because the positions the whole provider navigates have
   * to follow it.
   */
  const [tourName, setTourName] = useState<string | undefined>(undefined);

  /** Every tour the content file declares, in file order. Drives the Help menu. */
  const tours = useMemo(() => tourNames(content), [content]);
  const positions = useMemo(() => tourPositions(content, tourName), [content, tourName]);
  const stepCount = useMemo(() => tourSteps(content, tourName).length, [content, tourName]);
  const [activeId, setActiveId] = useState<string | null>(null);

  /*
   * TEMPORARY authoring aid (docs/TASKS.md item 3c). See
   * `ADDRESS_TOGGLE_ENABLED` in helpContext.ts for what this is and when to
   * delete it.
   *
   * Persisted because editing help-content.md hot-reloads this provider, and a
   * flag that reset on every save would be off for most of an authoring
   * session -- which is the only session it exists for. `?ids=1` seeds it too,
   * so a link can arrive with ids already showing.
   *
   * Both reads are guarded: `localStorage` throws in a browser set to block
   * site data, and this is an authoring convenience, not something worth
   * taking the app down for.
   */
  const [showAddresses, setShowAddresses] = useState(() => {
    if (!ADDRESS_TOGGLE_ENABLED) return false;
    try {
      if (new URLSearchParams(window.location.search).get('ids') === '1') return true;
      if (new URLSearchParams(window.location.search).get('ids') === '0') return false;
      /*
       * ON by default in dev (Siggie, 2026-09-08). The only reason to turn it
       * off is to see exactly what a popover looks like without the authoring
       * furniture, which is the rarer need — so an unset key means on, and
       * only an explicit '0' means off.
       */
      return window.localStorage.getItem(ADDRESS_KEY) !== '0';
    } catch {
      return ADDRESS_TOGGLE_ENABLED;
    }
  });
  const toggleAddresses = useCallback(() => {
    setShowAddresses(v => {
      const next = !v;
      try {
        window.localStorage.setItem(ADDRESS_KEY, next ? '1' : '0');
      } catch { /* blocked site data: the toggle still works for this session */ }
      return next;
    });
  }, []);

  /*
   * The provider used to keep a `depth` ref — how many frames it had pushed and
   * not popped — so that `endTour` could unwind by calling `onPopChange` that
   * many times. It is gone: the host is told when the tour ENDS and restores
   * the viewer's canvas in one move, so the provider no longer keeps a count of
   * the host's own state. (Second view of one fact; see
   * `tourStateStack.ts`'s header.)
   */

  const exitHelpMode = useCallback(() => {
    setHelpMode(false);
    setActiveId(null);
  }, []);
  const dismissEntry = useCallback(() => setActiveId(null), []);
  const showEntry = useCallback((id: string) => setActiveId(id), []);

  /**
   * Move to a position, pushing its `Change:` onto the host's stack.
   *
   * Forward only — `back` is `prevStep`, which pops instead. Under the old
   * absolute model both directions did the same thing (apply the target's full
   * state), which is why this function used to be the whole of navigation.
   *
   * A position with no `Change:` field pushes NOTHING and so has no frame to
   * pop. That is inheritance: it lets a multi-beat step avoid repeating a long
   * `sel=` on every beat. Distinct from an EMPTY `Change:`, which pushes an
   * empty frame — a step that deliberately changes nothing but still occupies
   * a slot on the stack, so `back` into it is symmetric.
   */
  const goTo = useCallback((i: number) => {
    const pos = positions[i];
    if (!pos) return;
    setTourIndex(i);
    setActiveId(pos.entry.id);
    if (pos.change != null && onPushChange) onPushChange(pos.change, pos.replace);
  }, [positions, onPushChange]);

  /**
   * Move back a position, popping whatever the position we are LEAVING pushed.
   *
   * The asymmetry with `goTo` is the point of the whole design: forward adds,
   * back removes what was added, and anything the viewer did in between is
   * neither. A position that pushed nothing pops nothing, so back through an
   * inheriting beat lands exactly where forward through it did.
   */
  const goBack = useCallback((i: number) => {
    const leaving = positions[i + 1];
    if (leaving?.change != null && onPopChange) onPopChange();
    const pos = positions[i];
    if (!pos) return;
    setTourIndex(i);
    setActiveId(pos.entry.id);
  }, [positions, onPopChange]);

  /**
   * Jump to any position in the running tour, in one move. What the map does.
   *
   * **Why this is not `goTo` in a loop.** `goTo` pushes one change and renders;
   * looping it walks the canvas through every intermediate selection. The host
   * gets the whole run instead and applies it as one update.
   *
   * Direction decides the shape. Forward, the positions BETWEEN here and there
   * contribute their changes — a position with no `Change:` contributes
   * nothing, which is inheritance working exactly as it does one step at a
   * time. Backward, the positions being LEFT are popped, on the same rule
   * `goBack` uses: a position that pushed nothing pops nothing.
   *
   * Landing on the target's own position is a push like any other, so the
   * forward run INCLUDES it and the backward run does not pop it.
   */
  const goToStep = useCallback((i: number) => {
    if (tourIndex === null || i === tourIndex) return;
    const pos = positions[i];
    if (!pos) return;
    /*
     * No host handler, no jump — deliberately, rather than moving the popover
     * anyway. A tour is the popover and the canvas together; advancing one
     * without the other lands on a step whose copy describes a diagram that
     * was never drawn, which is worse than the button doing nothing.
     */
    if (!onJumpChanges) return;
    if (i > tourIndex) {
      const changes = positions.slice(tourIndex + 1, i + 1)
        .filter(p => p.change != null)
        .map(p => ({ query: p.change!, replace: p.replace }));
      onJumpChanges(changes, 0);
    } else {
      const pops = positions.slice(i + 1, tourIndex + 1)
        .filter(p => p.change != null).length;
      onJumpChanges([], pops);
    }
    setTourIndex(i);
    setActiveId(pos.entry.id);
  }, [tourIndex, positions, onJumpChanges]);

  /**
   * Start a tour, by name. No name runs the first tour in the file.
   *
   * **It does not call `goTo(0)`.** `goTo` reads the `positions` memo through
   * its closure, and when this call is also CHANGING which tour is running,
   * that memo still holds the outgoing tour's positions — React has not
   * re-rendered yet. Routing the opening step through it would push the wrong
   * tour's first `Change:` and open on the wrong entry. So the first position
   * is computed here, from the name being switched to, and `goTo` is left for
   * the moves that happen once `positions` is settled.
   *
   * An empty tour (a name with no steps, or a content file with none) sets the
   * name and stops, with `startTour` a visible no-op rather than a half-entered
   * tour. See docs/TASKS.md item 7 for the silent-`goTo` case this deliberately
   * does not paper over.
   */
  const startTour = useCallback((name?: string, at = 0) => {
    setHelpMode(false);
    setTourName(name);
    const all = tourPositions(content, name);
    /*
     * `at` deep-links to a later step, for the Overview map's "start this tour
     * THERE". It is applied here, for exactly the reason the opening position
     * is: everything downstream of this call reads the `positions` memo, which
     * still holds the OUTGOING tour until React re-renders.
     *
     * The first attempt lived in the map and deferred with
     * `requestAnimationFrame(() => goToStep(i))` after `startTour`. That never
     * worked: the deferred closure captured the PRE-start `goToStep`, whose
     * `tourIndex` was still null, so it returned at its own guard and the jump
     * vanished silently. Found 2026-09-08 while tracing a different dead-click.
     *
     * Out of range clamps to the opening rather than refusing: a stale deep
     * link should start the tour, not nothing.
     */
    const start = Math.min(Math.max(at, 0), Math.max(all.length - 1, 0));
    const first = all[start];
    if (!first) return;
    /*
     * Announced BEFORE the first push, and unconditionally: what is on the
     * canvas at this instant is the viewer's, and the host has to have that
     * recorded before a step adds to it. Not an entry snapshot in the old sense
     * — nothing is restored from it on exit; it is simply the host learning
     * which half of the selection is whose.
     */
    onTourStart?.();
    setTourIndex(start);
    setActiveId(first.entry.id);
    /*
     * Deep-linking replays every change up to the target, not just its own:
     * a step's canvas is what the steps before it built, and a step whose own
     * `Change:` is absent inherits entirely. Same fold `goToStep` uses, and
     * the host applies it as one update.
     */
    const changes = all.slice(0, start + 1)
      .filter(p => p.change != null)
      .map(p => ({ query: p.change!, replace: p.replace }));
    if (start > 0 && onJumpChanges) onJumpChanges(changes, 0);
    else if (first.change != null && onPushChange) onPushChange(first.change, first.replace);
  }, [content, onPushChange, onJumpChanges, onTourStart]);

  /**
   * Ending the tour unwinds every frame it still has pushed.
   *
   * This REPLACED a snapshot-and-restore. Restoring an entry snapshot put the
   * viewer back where they started but threw away anything they did during the
   * tour — the thing the yellow "your changes will be discarded" warning was
   * apologising for. Unwinding removes only what the tour added, so a mid-tour
   * edit is simply still there afterwards.
   *
   * Runs on every exit path (done, ✕, Escape, `?`): they are the same event
   * from the viewer's side, and any one of them that skipped the unwind would
   * strand the tour's selections in their canvas.
   */
  const endTour = useCallback(() => {
    setTourIndex(null);
    setActiveId(null);
    /*
     * The NAME goes too, or "which tour is running" answers a tour that ended.
     *
     * It survived every exit until 2026-09-08, harmlessly while the only
     * reader was the popover (which does not render outside a tour anyway).
     * The tour map reads it to decide whether a clicked step needs
     * `startTour` first or is a jump within the running tour — so a stale
     * name sent every step of the last tour down the jump path, into a
     * `goToStep` that returns immediately on `tourIndex === null`. The map
     * closed and no tour began: Siggie, *"clicking a step just dismisses the
     * overview map but brings up no tour"*.
     */
    setTourName(undefined);
    onTourEnd?.();
  }, [onTourEnd]);

  const nextStep = useCallback(() => {
    if (tourIndex === null) return;
    if (tourIndex + 1 >= positions.length) endTour();
    else goTo(tourIndex + 1);
  }, [tourIndex, positions.length, goTo, endTour]);
  const prevStep = useCallback(() => {
    if (tourIndex !== null && tourIndex > 0) goBack(tourIndex - 1);
  }, [tourIndex, goBack]);

  const toggleHelpMode = useCallback(() => {
    // Leaving a tour by pressing `?` is still leaving the tour, so it has to
    // restore like every other exit.
    if (tourIndex !== null) endTour();
    setActiveId(null);
    // Gated rather than removed: with help mode off this is the only door,
    // so closing it here means no caller can open the mode by accident.
    if (!HELP_MODE_ENABLED) return;
    setHelpMode(v => !v);
  }, [tourIndex, endTour]);

  /**
   * Resolve an anchor to its element: ONE `querySelector` for the whole anchor
   * string, whatever kind it names.
   *
   * Every anchorable element carries its own anchor in `data-help-id` --
   * `node-box:Participant`, `slot-row:MeasurementObservation.observation_type`
   * -- written by the host at its render site. This REPLACED a table of host
   * `resolvers`, one function per kind, and it keeps the seam exactly: the
   * parser still splits `kind:arg` and stops, the host still decides what every
   * kind means (by choosing what to interpolate), and this matches a string it
   * never interprets. `help-id:<id>` is the degenerate case where the kind
   * prefix is the anchor -- hence the shape below.
   *
   * Returning null is normal, not an error: the row may be collapsed, the box on
   * a diagram the current selection does not include, or the element simply not
   * rendered yet. The layer degrades to an unringed popover; nothing throws.
   *
   * `CSS.escape` because a hand-authored anchor is arbitrary text and must not
   * be able to break out of the selector.
   */
  const resolveAnchor = useCallback((anchor: HelpAnchor | undefined): Element | null => {
    // Destructured rather than narrowed on `anchor.kind`: the union's second
    // member is `{ kind: string; arg: string }`, so `kind === 'none'` does not
    // exclude it and TS keeps `arg` off the narrowed type.
    if (!anchor) return null;
    const { kind } = anchor;
    if (kind === 'none') return null;
    const { arg } = anchor as { kind: string; arg: string };
    const tag = kind === 'help-id' ? arg : `${kind}:${arg}`;
    return document.querySelector(`[data-help-id="${CSS.escape(tag)}"]`);
  }, []);

  // Cursor affordance; also what the hint dots key off in CSS.
  useEffect(() => {
    document.body.classList.toggle('help-mode', helpMode);
    return () => { document.body.classList.remove('help-mode'); };
  }, [helpMode]);

  // Leaving the window while in help mode strands the user in a mode they
  // cannot see the entry point for. Tour mode deliberately survives a blur:
  // it is a deliberate sequence, not a transient inspection.
  useEffect(() => {
    if (!helpMode) return;
    window.addEventListener('blur', exitHelpMode);
    return () => window.removeEventListener('blur', exitHelpMode);
  }, [helpMode, exitHelpMode]);

  /*
   * Capture-phase interception. Without capture, a help-mode click on a button
   * would ALSO press the button — you would be operating the app while trying
   * to read about it.
   */
  useEffect(() => {
    if (!helpMode) return;
    function onClick(e: MouseEvent) {
      const target = e.target as Element | null;
      if (!target) return;
      const el = target.closest('[data-help-id]');
      if (el) {
        e.stopPropagation();
        e.preventDefault();
        showEntry(el.getAttribute('data-help-id')!);
      } else if (!target.closest('[data-help-popover]')) {
        dismissEntry();
      }
    }
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [helpMode, showEntry, dismissEntry]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      /*
       * `?` starts the tour (Siggie, 2026-08-28).
       *
       * It used to toggle HELP MODE, which has been disabled
       * (`HELP_MODE_ENABLED === false`), so the key did nothing at all — the
       * most discoverable shortcut on the page bound to the one feature that
       * is turned off. The tour is what a reader pressing `?` wants.
       *
       * A TOGGLE rather than a plain start: `startTour` resets to step 0, so
       * binding it raw would make a second `?` silently restart a tour in
       * progress. Ending on the second press matches Escape, which already
       * ends the tour.
       */
      if (e.key === '?' && !isInputFocused()) {
        e.preventDefault();
        if (tourIndex === null) startTour(); else endTour();
        return;
      }
      /*
       * `activeId` is in the condition because a popover opened from the Help
       * MENU is neither help mode nor a tour — with help mode off that is the
       * only way most entries are reachable, so Escape did nothing for the
       * commonest popover in the app.
       */
      if (e.key === 'Escape' && (helpMode || tourIndex !== null || activeId)) {
        e.preventDefault();
        e.stopPropagation();
        // Two-stage: close the popover first, leave the mode only if there is
        // no popover to close.
        if (activeId && tourIndex === null) dismissEntry();
        else if (tourIndex !== null) endTour();
        else toggleHelpMode();
        return;
      }
      if (tourIndex === null) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); nextStep(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); prevStep(); }
    }
    document.addEventListener('keydown', onKeyDown, true);
    return () => document.removeEventListener('keydown', onKeyDown, true);
  }, [helpMode, tourIndex, activeId, toggleHelpMode, dismissEntry, endTour,
      startTour, nextStep, prevStep]);

  /**
   * The centring region's rect, measured NOW.
   *
   * A function rather than a captured element for the same reason anchors are
   * looked up live: the region can mount after the tour starts, and it resizes
   * when the window does or the left panel is collapsed. A value read once would
   * centre on a stale box.
   */
  const centerRect = useCallback((): DOMRect | null => {
    if (!centerOn) return null;
    return resolveAnchor(parseAnchor(centerOn, centerOn))?.getBoundingClientRect() ?? null;
  }, [centerOn, resolveAnchor]);

  const api = useMemo<HelpApi>(() => ({
    setTextResolvers: setRegistered,
    helpMode, toggleHelpMode, exitHelpMode,
    tourIndex, startTour, endTour, nextStep, prevStep, goToStep,
    positions, position: tourIndex === null ? undefined : positions[tourIndex],
    stepCount, tours, tourName, tourMeta: content.tourMeta,
    showAddresses, toggleAddresses,
    content, activeId, showEntry, dismissEntry, resolveAnchor, centerRect,
  }), [helpMode, toggleHelpMode, exitHelpMode, tourIndex, startTour, endTour,
       nextStep, prevStep, goToStep, positions, stepCount, tours, tourName,
       showAddresses, toggleAddresses,
       content, activeId, showEntry, dismissEntry, resolveAnchor, centerRect]);
  /* `setRegistered` is a useState setter: React guarantees it stable, so it is
     deliberately absent from the dependency list above. */

  return <HelpContext.Provider value={api}>{children}</HelpContext.Provider>;
}
