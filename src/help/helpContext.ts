/**
 * The help context and its hook, kept out of HelpProvider.tsx so that file
 * exports only a component — Fast Refresh cannot hot-reload a module that
 * mixes components with other exports.
 */

import { createContext, useContext, type ReactNode } from 'react';
import type { HelpAnchor, HelpContent, TextResolver, TourMeta, TourPosition } from './parseHelpContent';

/**
 * Draws an inline widget the content embeds as `![alt](widget:<name>:<arg>)`.
 * Returning null falls back to the image's alt text. The package knows the
 * URL shape and nothing about what a widget draws — the same seam as text
 * resolvers and anchor kinds.
 */
export type WidgetRenderer = (arg: string) => ReactNode;

/**
 * Help MODE is off; the tour is not.
 *
 * Turned off 2026-08-27 after Siggie reviewed it (the whole help system was
 * written before the tour work and never reviewed). It was not one bug but a
 * cluster, several of them structural — see the "Help mode: switched off"
 * section of docs/HELP_PACKAGE_PLAN.md for the full list and the fix plan.
 *
 * NOTHING is deleted: every entry, anchor and popover still works, and the
 * tour reads the same registry. This flag only removes the way IN to
 * help mode — the `help mode` toggle and the `?` shortcut. Set it back to
 * true to get the mode back exactly as it was, which is the point: the fixes
 * are worth doing, just not before the tour ships.
 */
export const HELP_MODE_ENABLED = false;

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
  /**
   * The resolvers now in force — whichever of the prop and the registered set
   * won. Exposed for `<HelpMarkdown>`, which fills placeholders at RENDER
   * because its string comes from a caller rather than from the content file
   * (the provider fills that once, at parse time). Nothing else should read
   * these: content reaching the popover is already filled.
   */
  textResolvers?: Record<string, TextResolver>;
  /** Host-provided inline widgets, by name. */
  widgets?: Record<string, WidgetRenderer>;
  /** Host-provided colour names for `:s[…]{color=…}` / `{bg=…}`. */
  colors?: Record<string, string>;
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
   *
   * `at` deep-links to a position other than the opening one, replaying every
   * change up to it — what the Overview map's "start this tour there" needs.
   * It belongs here rather than in a `startTour` + `goToStep` pair because
   * everything outside this call reads a `positions` memo that still holds the
   * OUTGOING tour until React re-renders. Out of range clamps to the opening.
   */
  startTour: (tour?: string, at?: number) => void;
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
  /**
   * The all-tours Overview (TourMap scope "all"). Held here rather than in the
   * chooser so the `?` shortcut can open it (Siggie, 2026-09-10: "instead of
   * having ? bring up tour 1 have it bring up the tour overview").
   */
  overviewOpen: boolean;
  setOverviewOpen: (open: boolean) => void;
  nextStep: () => void;
  prevStep: () => void;
  /**
   * Jump to any position in the running tour, in one move — what the tour map
   * clicks. Index into `positions`, like `tourIndex`.
   *
   * A no-op outside a tour, and for a host that did not pass `onJumpChanges`
   * (the popover moves but the canvas would not follow, so it does not move
   * either).
   */
  goToStep: (i: number) => void;
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
   * Whether the host offers the authoring aids at all — today, the popover's
   * content-file address and the menu item that toggles it.
   *
   * ⚠️ **The host decides this**, via `<HelpProvider authoringAids>`. This
   * package ships as an external dependency, so the consuming app's build
   * environment is not its to read — and "is this a dev build" is the wrong
   * question anyway, since the e2e suite drives a dev server.
   */
  authoringAids: boolean;
  /**
   * Whether popovers are currently showing their content-file address. False
   * whenever `authoringAids` is. TEMPORARY.
   */
  showAddresses: boolean;
  /** Flip `showAddresses` and remember it. TEMPORARY. */
  toggleAddresses: () => void;
  content: HelpContent;
  activeId: string | null;
  showEntry: (id: string) => void;
  dismissEntry: () => void;
  /**
   * Resolve an anchor to the element it names: one `querySelector` for the
   * `data-help-id` the host wrote at its own render site.
   */
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

/**
 * The help context if there is one, or undefined — for a component that can do
 * something useful without a provider.
 *
 * `useHelp` throws, and rightly: a tour control outside the provider is a bug,
 * and silently rendering nothing would hide it. But `<HelpMarkdown>` is not a
 * tour control. It renders a string the way the popover renders prose, and
 * every host-supplied part of that (resolvers, widgets, colours) is an
 * ENRICHMENT — without them the markdown still renders, placeholders stay
 * visible exactly as they do for an unresolved name, and a `widget:` image
 * falls back to its alt text. Throwing instead would make any component that
 * renders prose untestable without a provider, which is a real cost for no
 * safety: the legend needs the markdown, not the tour.
 */
export function useHelpIfAny(): HelpApi | undefined {
  return useContext(HelpContext) ?? undefined;
}
