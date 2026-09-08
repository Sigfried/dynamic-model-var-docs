/**
 * The help context and its hook, kept out of HelpProvider.tsx so that file
 * exports only a component — Fast Refresh cannot hot-reload a module that
 * mixes components with other exports.
 */

import { createContext, useContext } from 'react';
import type { HelpAnchor, HelpContent, TextResolver, TourMeta, TourPosition } from './parseHelpContent';

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

/**
 * TEMPORARY authoring aid (2026-09-07, docs/TASKS.md item 3c).
 *
 * Siggie: *"there needs to be an easy way to find a given tour step/beat as
 * shown in the app in the help-content."* With it on, every popover shows the
 * `###` slug it was authored under, click-to-copy.
 *
 * Gated on `import.meta.env.DEV` at its one entry point (the Help menu item in
 * `HelpMenu.tsx`), so the deployed build has no way to switch it on and the
 * viewer-facing menu does not carry an authoring switch. `?ids=1` seeds it in
 * dev too, for a link that arrives with ids already showing.
 *
 * Delete this and everything referencing it once the five tours are written.
 */
export const ADDRESS_TOGGLE_ENABLED = import.meta.env.DEV;

export interface HelpApi {
  /**
   * Register the host's `{{kind:arg}}` text resolvers once it can answer them.
   *
   * A prop would be simpler, and `textResolvers` on `<HelpProvider>` is still
   * the way for a host that has its data up front. dmvd does not: the provider
   * WRAPS the component that loads the model, so at the point the prop would
   * be passed there is nothing to resolve against yet. Rather than move the
   * provider inside (it also owns the tour, which outlives any one view) or
   * load the model twice, the host calls this when its data arrives and the
   * content is refilled.
   *
   * Pass a STABLE object — the content is reparsed and refilled whenever this
   * identity changes, so a fresh object every render would reparse the help
   * file every render.
   */
  setTextResolvers: (resolvers: Record<string, TextResolver> | undefined) => void;
  helpMode: boolean;
  toggleHelpMode: () => void;
  exitHelpMode: () => void;
  /**
   * Index into `positions`, or null when no tour is running. This counts
   * BEATS, not steps: a four-step tour whose third step has three beats has
   * six positions. The displayed counter comes from `position.step`.
   */
  tourIndex: number | null;
  /**
   * Start a tour by name; no name runs the first one in the file.
   *
   * The name is one of `tours`. An unknown name yields an empty tour and so
   * starts nothing — it cannot half-enter.
   */
  startTour: (tour?: string) => void;
  endTour: () => void;
  /** Every tour in the content file, in file order. The Help menu lists these. */
  tours: string[];
  /**
   * A one-line description per tour, from the `TourMetadata:` block in the
   * section that declares it. Missing for a tour whose section carries none —
   * the chooser then shows the name alone.
   */
  tourMeta: Map<string, TourMeta>;
  /** Which tour is running, or undefined for the file's first. */
  tourName: string | undefined;
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
  /**
   * Whether popovers show their content-file address. TEMPORARY — see
   * `ADDRESS_TOGGLE_ENABLED`. Always false in a production build.
   */
  showAddresses: boolean;
  /** Flip `showAddresses` and remember it. TEMPORARY. */
  toggleAddresses: () => void;
  content: HelpContent;
  activeId: string | null;
  showEntry: (id: string) => void;
  dismissEntry: () => void;
  /** Resolve an anchor to its element, using the host's resolvers. */
  resolveAnchor: (anchor: HelpAnchor | undefined) => Element | null;
  /**
   * Rect of the region an UNANCHORED popover centres on, measured now, or null
   * to centre on the viewport. Set by `<HelpProvider centerOn={...}>`.
   */
  centerRect: () => DOMRect | null;
}

export const HelpContext = createContext<HelpApi | null>(null);

export function useHelp(): HelpApi {
  const ctx = useContext(HelpContext);
  if (!ctx) throw new Error('useHelp must be used inside <HelpProvider>');
  return ctx;
}
