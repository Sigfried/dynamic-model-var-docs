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
  createContext, useCallback, useContext, useEffect, useMemo, useState,
  type ReactNode,
} from 'react';
import { parseHelpContent, tourSteps, type HelpContent, type HelpEntry } from './parseHelpContent';

interface HelpApi {
  helpMode: boolean;
  toggleHelpMode: () => void;
  exitHelpMode: () => void;
  /** Tour step index, or null when no tour is running. */
  tourStep: number | null;
  startTour: () => void;
  endTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  steps: HelpEntry[];
  content: HelpContent;
  activeId: string | null;
  showEntry: (id: string) => void;
  dismissEntry: () => void;
}

const HelpContext = createContext<HelpApi | null>(null);

export function useHelp(): HelpApi {
  const ctx = useContext(HelpContext);
  if (!ctx) throw new Error('useHelp must be used inside <HelpProvider>');
  return ctx;
}

/** True when focus is in a text field, so `?` types instead of toggling. */
function isInputFocused(): boolean {
  const el = document.activeElement;
  return el instanceof HTMLInputElement
    || el instanceof HTMLTextAreaElement
    || el?.getAttribute('contenteditable') === 'true';
}

export function HelpProvider({
  markdown, onApplyState, children,
}: {
  markdown: string;
  /**
   * Apply a step's `State:` query string. The provider does not know how the
   * host app stores its state, so the host supplies this; without it, steps
   * that need a selection simply show their popover against whatever is
   * on screen.
   */
  onApplyState?: (query: string) => void;
  children: ReactNode;
}) {
  const content = useMemo(() => parseHelpContent(markdown), [markdown]);
  const steps = useMemo(() => tourSteps(content), [content]);

  const [helpMode, setHelpMode] = useState(false);
  const [tourStep, setTourStep] = useState<number | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const exitHelpMode = useCallback(() => {
    setHelpMode(false);
    setActiveId(null);
  }, []);
  const toggleHelpMode = useCallback(() => {
    setTourStep(null);
    setActiveId(null);
    setHelpMode(v => !v);
  }, []);
  const dismissEntry = useCallback(() => setActiveId(null), []);
  const showEntry = useCallback((id: string) => setActiveId(id), []);

  const goTo = useCallback((i: number) => {
    const step = steps[i];
    if (!step) return;
    setTourStep(i);
    setActiveId(step.id);
    if (step.state && onApplyState) onApplyState(step.state);
  }, [steps, onApplyState]);

  const startTour = useCallback(() => {
    setHelpMode(false);
    goTo(0);
  }, [goTo]);
  const endTour = useCallback(() => {
    setTourStep(null);
    setActiveId(null);
  }, []);
  const nextStep = useCallback(() => {
    if (tourStep === null) return;
    if (tourStep + 1 >= steps.length) endTour();
    else goTo(tourStep + 1);
  }, [tourStep, steps.length, goTo, endTour]);
  const prevStep = useCallback(() => {
    if (tourStep !== null && tourStep > 0) goTo(tourStep - 1);
  }, [tourStep, goTo]);

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
      if (e.key === '?' && !isInputFocused()) {
        e.preventDefault();
        toggleHelpMode();
        return;
      }
      if (e.key === 'Escape' && (helpMode || tourStep !== null)) {
        e.preventDefault();
        e.stopPropagation();
        // Two-stage: close the popover first, leave the mode only if there is
        // no popover to close.
        if (activeId && tourStep === null) dismissEntry();
        else if (tourStep !== null) endTour();
        else toggleHelpMode();
        return;
      }
      if (tourStep === null) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); nextStep(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); prevStep(); }
    }
    document.addEventListener('keydown', onKeyDown, true);
    return () => document.removeEventListener('keydown', onKeyDown, true);
  }, [helpMode, tourStep, activeId, toggleHelpMode, dismissEntry, endTour,
      nextStep, prevStep]);

  const api = useMemo<HelpApi>(() => ({
    helpMode, toggleHelpMode, exitHelpMode,
    tourStep, startTour, endTour, nextStep, prevStep, steps,
    content, activeId, showEntry, dismissEntry,
  }), [helpMode, toggleHelpMode, exitHelpMode, tourStep, startTour, endTour,
       nextStep, prevStep, steps, content, activeId, showEntry, dismissEntry]);

  return <HelpContext.Provider value={api}>{children}</HelpContext.Provider>;
}
