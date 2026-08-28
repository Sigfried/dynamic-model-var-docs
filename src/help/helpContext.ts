/**
 * The help context and its hook, kept out of HelpProvider.tsx so that file
 * exports only a component — Fast Refresh cannot hot-reload a module that
 * mixes components with other exports.
 */

import { createContext, useContext } from 'react';
import type { HelpAnchor, HelpContent, TourPosition } from './parseHelpContent';

/**
 * Resolves a host-specific anchor kind to the element it names.
 *
 * The parser splits `entity-row:Participant` into `{ kind, arg }` and stops
 * there; knowing what a dmvd entity row IS belongs to the host app, not to
 * the help package (docs/HELP_PACKAGE_PLAN.md). The host passes a table of
 * these to `<HelpProvider resolvers={...}>`; `help-id` and `none` are built in
 * and need no resolver.
 *
 * Returning null is normal, not an error: the anchor's element may simply not
 * be on screen yet. The layer degrades to an unringed popover.
 */
export type AnchorResolver = (arg: string) => Element | null;

/**
 * Help MODE is off; the tour is not.
 *
 * Turned off 2026-08-27 after Siggie reviewed it (the whole help system was
 * written before the tour work and never reviewed). It was not one bug but a
 * cluster, several of them structural — see the "Help mode: switched off"
 * section of docs/HELP_PACKAGE_PLAN.md for the full list and the fix plan.
 *
 * NOTHING is deleted: every entry, anchor, resolver and popover still works,
 * and the tour reads the same registry. This flag only removes the way IN to
 * help mode — the `help mode` toggle and the `?` shortcut. Set it back to
 * true to get the mode back exactly as it was, which is the point: the fixes
 * are worth doing, just not before the tour ships.
 */
export const HELP_MODE_ENABLED = false;

export interface HelpApi {
  helpMode: boolean;
  toggleHelpMode: () => void;
  exitHelpMode: () => void;
  /**
   * Index into `positions`, or null when no tour is running. This counts
   * BEATS, not steps: a four-step tour whose third step has three beats has
   * six positions. The displayed counter comes from `position.step`.
   */
  tourIndex: number | null;
  startTour: () => void;
  endTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  /**
   * Every navigable position in the tour, flattened by the parser. The
   * mechanism navigates this list and never handles nesting; `back` is
   * `positions[i - 1]`, reached by POPPING what the position being left
   * pushed rather than by re-applying anything.
   */
  positions: TourPosition[];
  /** The position now showing, or undefined outside a tour. */
  position: TourPosition | undefined;
  /** Total number of tour STEPS, for the `4.2 / 6` counter's denominator. */
  stepCount: number;
  content: HelpContent;
  activeId: string | null;
  showEntry: (id: string) => void;
  dismissEntry: () => void;
  /** Resolve an anchor to its element, using the host's resolvers. */
  resolveAnchor: (anchor: HelpAnchor | undefined) => Element | null;
}

export const HelpContext = createContext<HelpApi | null>(null);

export function useHelp(): HelpApi {
  const ctx = useContext(HelpContext);
  if (!ctx) throw new Error('useHelp must be used inside <HelpProvider>');
  return ctx;
}
