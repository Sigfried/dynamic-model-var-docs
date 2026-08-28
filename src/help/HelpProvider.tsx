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
  useCallback, useEffect, useMemo, useRef, useState, type ReactNode,
} from 'react';
import { parseHelpContent, tourPositions, tourSteps } from './parseHelpContent';
import type { HelpAnchor } from './parseHelpContent';
import {
  HelpContext, HELP_MODE_ENABLED, type AnchorResolver, type HelpApi,
} from './helpContext';

/** True when focus is in a text field, so `?` types instead of toggling. */
function isInputFocused(): boolean {
  const el = document.activeElement;
  return el instanceof HTMLInputElement
    || el instanceof HTMLTextAreaElement
    || el?.getAttribute('contenteditable') === 'true';
}

export function HelpProvider({
  markdown, onPushChange, onPopChange, resolvers, children,
}: {
  markdown: string;
  /**
   * Push a position's `Change:` query onto the host's state stack.
   *
   * The provider does not know how the host stores its state, and under the
   * stack it does not need to know what a push MEANS either — it counts
   * frames and the host composes them. Without this, steps that need a
   * selection simply show their popover against whatever is on screen.
   */
  onPushChange?: (query: string) => void;
  /**
   * Pop one frame off the host's stack. Called once per `back`, and once per
   * remaining frame when the tour ends.
   *
   * This pair REPLACED an apply/read pair that made every step absolute. The
   * provider used to snapshot the viewer's state on entry and feed it back on
   * exit; there is nothing to restore now, because nothing was overwritten.
   */
  onPopChange?: () => void;
  /**
   * Resolvers for the host's own anchor kinds. `help-id` and `none` are built
   * in; everything else in an `Anchor:` field is looked up here. An
   * unregistered kind resolves to null, which degrades to an unringed popover
   * rather than throwing.
   */
  resolvers?: Record<string, AnchorResolver>;
  children: ReactNode;
}) {
  const content = useMemo(() => parseHelpContent(markdown), [markdown]);
  const positions = useMemo(() => tourPositions(content), [content]);
  const stepCount = useMemo(() => tourSteps(content).length, [content]);

  const [helpMode, setHelpMode] = useState(false);
  const [tourIndex, setTourIndex] = useState<number | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  /**
   * How many frames the tour has pushed and not yet popped.
   *
   * The provider's whole share of the stack: it counts, the host composes. A
   * ref rather than state — nothing renders from it, and as a dependency of the
   * navigation callbacks it would rebuild every one of them on every move.
   *
   * Kept even though the host also knows its own depth, because the provider is
   * the one that decides when to unwind: `endTour` fires from four different
   * exits and must not leave a frame behind on any of them.
   */
  const depth = useRef(0);

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
    if (pos.change != null && onPushChange) {
      onPushChange(pos.change);
      depth.current += 1;
    }
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
    if (leaving?.change != null && onPopChange && depth.current > 0) {
      onPopChange();
      depth.current -= 1;
    }
    const pos = positions[i];
    if (!pos) return;
    setTourIndex(i);
    setActiveId(pos.entry.id);
  }, [positions, onPopChange]);

  const startTour = useCallback(() => {
    setHelpMode(false);
    // No entry snapshot: the tour composes on top of the viewer's state instead
    // of replacing it, so there is nothing to record and nothing to restore.
    depth.current = 0;
    goTo(0);
  }, [goTo]);

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
    if (onPopChange) for (let i = 0; i < depth.current; i++) onPopChange();
    depth.current = 0;
  }, [onPopChange]);

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
   * Resolve an anchor to its element. `none` points at nothing by definition;
   * `help-id` is the built-in; everything else is the host's.
   */
  const resolveAnchor = useCallback((anchor: HelpAnchor | undefined): Element | null => {
    // Destructured rather than narrowed on `anchor.kind`: the union's second
    // member is `{ kind: string; arg: string }`, so `kind === 'none'` does not
    // exclude it and TS keeps `arg` off the narrowed type.
    if (!anchor) return null;
    const { kind } = anchor;
    if (kind === 'none') return null;
    const { arg } = anchor as { kind: string; arg: string };
    if (kind === 'help-id') {
      return document.querySelector(`[data-help-id="${CSS.escape(arg)}"]`);
    }
    return resolvers?.[kind]?.(arg) ?? null;
  }, [resolvers]);

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
      if (e.key === 'Escape' && (helpMode || tourIndex !== null)) {
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

  const api = useMemo<HelpApi>(() => ({
    helpMode, toggleHelpMode, exitHelpMode,
    tourIndex, startTour, endTour, nextStep, prevStep,
    positions, position: tourIndex === null ? undefined : positions[tourIndex],
    stepCount,
    content, activeId, showEntry, dismissEntry, resolveAnchor,
  }), [helpMode, toggleHelpMode, exitHelpMode, tourIndex, startTour, endTour,
       nextStep, prevStep, positions, stepCount,
       content, activeId, showEntry, dismissEntry, resolveAnchor]);

  return <HelpContext.Provider value={api}>{children}</HelpContext.Provider>;
}
