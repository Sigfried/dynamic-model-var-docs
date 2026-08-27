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
  markdown, onApplyState, onReadState, resolvers, children,
}: {
  markdown: string;
  /**
   * Apply a step's `State:` query string. The provider does not know how the
   * host app stores its state, so the host supplies this; without it, steps
   * that need a selection simply show their popover against whatever is
   * on screen.
   */
  onApplyState?: (query: string) => void;
  /**
   * Read the host's current state back as a query string, in the same
   * vocabulary `onApplyState` accepts. Used ONLY for the entry snapshot: the
   * tour records the viewer's own state when it starts and feeds it back
   * through `onApplyState` when it ends.
   *
   * Round-tripping through the host's own query format is what keeps this
   * host-agnostic — the provider never learns what a selection is.
   */
  onReadState?: () => string;
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
  const [viewerEdited, setViewerEdited] = useState(false);

  /**
   * The viewer's own state at the moment the tour started, captured as a query
   * string. A ref rather than state: nothing renders from it, and it must not
   * be a dependency of the navigation callbacks or every move would rebuild
   * them.
   */
  const enterSnapshot = useRef<string | null>(null);
  /**
   * The state the tour itself last applied. Any state the host reports that
   * differs from this is the VIEWER's doing, which is what `viewerEdited`
   * warns about.
   */
  const appliedState = useRef<string | null>(null);

  const exitHelpMode = useCallback(() => {
    setHelpMode(false);
    setActiveId(null);
  }, []);
  const dismissEntry = useCallback(() => setActiveId(null), []);
  const showEntry = useCallback((id: string) => setActiveId(id), []);

  /**
   * Move to a position. Every position carries a FULL absolute `State:`, never
   * a diff, so this is the whole of `back`: arriving at position i from either
   * direction applies the same query and therefore lands in the same view.
   *
   * A position with no `State:` deliberately applies nothing — it inherits
   * whatever the previous one set, which is what lets a multi-beat step avoid
   * repeating a long `sel=` on every beat.
   */
  const goTo = useCallback((i: number) => {
    const pos = positions[i];
    if (!pos) return;
    setTourIndex(i);
    setActiveId(pos.entry.id);
    setViewerEdited(false);
    /*
     * `!= null`, not truthiness. `State:` with an empty value is a REAL
     * state — the default view, nothing selected — exactly as `endTour`'s
     * snapshot of `''` is. Testing truthiness treated it as "no state" and
     * applied nothing, so stepping BACK to an exposition step left the
     * following step's selection on screen (Siggie, 2026-08-27: "backwards
     * tour step doesn't undo anything"). Steps 1 and 2 now carry an empty
     * `State:` for exactly this reason.
     *
     * A step with NO `State:` field at all is still inheritance, which is
     * what lets a multi-beat step avoid repeating a long `sel=` per beat.
     */
    if (pos.state != null && onApplyState) {
      onApplyState(pos.state);
      appliedState.current = pos.state;
    }
  }, [positions, onApplyState]);

  const startTour = useCallback(() => {
    setHelpMode(false);
    // Snapshot BEFORE the first position applies its own state, or the
    // snapshot is of the tour rather than of the viewer.
    enterSnapshot.current = onReadState ? onReadState() : null;
    appliedState.current = null;
    goTo(0);
  }, [goTo, onReadState]);

  /**
   * Ending the tour puts the viewer back where they were when it started —
   * Siggie, 2026-08-27: "if tour starts when state is not default, record
   * state; when tour ends/is exited, restore prior state."
   *
   * Restoring runs on every exit path (done, ✕, Escape, `?`), because they are
   * all the same event from the viewer's side: the tour is over and its
   * selections are not theirs.
   */
  const endTour = useCallback(() => {
    setTourIndex(null);
    setActiveId(null);
    setViewerEdited(false);
    const snapshot = enterSnapshot.current;
    enterSnapshot.current = null;
    appliedState.current = null;
    // `snapshot` is '' when the tour started from the default view. That is a
    // real state to restore, not a missing one, so test for null.
    if (snapshot !== null && onApplyState) onApplyState(snapshot);
  }, [onApplyState]);

  const nextStep = useCallback(() => {
    if (tourIndex === null) return;
    if (tourIndex + 1 >= positions.length) endTour();
    else goTo(tourIndex + 1);
  }, [tourIndex, positions.length, goTo, endTour]);
  const prevStep = useCallback(() => {
    if (tourIndex !== null && tourIndex > 0) goTo(tourIndex - 1);
  }, [tourIndex, goTo]);

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
   * The host reports that the viewer changed something. Only interesting
   * during a tour, and only when the new state is not the one the tour just
   * applied — the host cannot always tell its own echo apart from a real edit,
   * so that check lives here.
   */
  const noteViewerEdit = useCallback(() => {
    if (tourIndex === null) return;
    if (onReadState && onReadState() === appliedState.current) return;
    setViewerEdited(true);
  }, [tourIndex, onReadState]);

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
      if (e.key === '?' && !isInputFocused() && HELP_MODE_ENABLED) {
        e.preventDefault();
        toggleHelpMode();
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
      nextStep, prevStep]);

  const api = useMemo<HelpApi>(() => ({
    helpMode, toggleHelpMode, exitHelpMode,
    tourIndex, startTour, endTour, nextStep, prevStep,
    positions, position: tourIndex === null ? undefined : positions[tourIndex],
    stepCount, viewerEdited, noteViewerEdit,
    content, activeId, showEntry, dismissEntry, resolveAnchor,
  }), [helpMode, toggleHelpMode, exitHelpMode, tourIndex, startTour, endTour,
       nextStep, prevStep, positions, stepCount, viewerEdited, noteViewerEdit,
       content, activeId, showEntry, dismissEntry, resolveAnchor]);

  return <HelpContext.Provider value={api}>{children}</HelpContext.Provider>;
}
