/**
 * Explore's shareable state: one place that knows every URL parameter.
 *
 * **The problem this solves.** Selection lived in the URL but the toolbar
 * settings lived in localStorage, so a shared link reproduced the SELECTION
 * and then rendered it with whatever settings happened to be in the
 * recipient's browser — or, for a first-time visitor, the defaults. The
 * sibling merge that the whole inheritance feature is about was a localStorage
 * flag, so a link showing it off looked like the feature did not exist.
 *
 * **The split, and why.** Not everything belongs in a link:
 *
 *  - **Shareable** — anything that changes WHAT the diagram says: the
 *    selection, sibling merge, path-to-root, layout direction, edge merge
 *    mode, the open drawer.
 *  - **Personal preference** — zoom, pan, pins, drags, which side panel is
 *    collapsed. These describe how one person is looking at the diagram, not
 *    what it shows, and pinning them into a link would fight the recipient's
 *    window size.
 *
 * The legend and example-cases OVERLAYS are shareable (Siggie, 2026-09-08),
 * which looks like an exception to that rule and is not: they carry content —
 * the legend explains the very edges a link is trying to show — so "here is
 * the diagram, with the key open" is a different thing to say than "here is
 * the diagram". A collapsed side panel says nothing.
 *
 * Layout direction is a borderline case, filed as shareable: LR vs TB changes
 * how the diagram reads, and a tour step that depends on the shape would break
 * under the other setting.
 *
 * **localStorage stays, as a FALLBACK.** A param that is absent falls back to
 * the stored preference, then to the default — so a bare visit still remembers
 * a returning user's settings, while a link is authoritative for anything it
 * names. That ordering is what lets a tour link pin the settings it cares
 * about without flattening everything else the visitor chose.
 *
 * **Defaults are omitted from the URL.** Keeps links short and readable. The
 * cost is that a later change to a default silently changes old links; the
 * alternative (write everything explicitly) makes every link carry every param.
 * Chosen deliberately — revisit if links start being embedded somewhere
 * long-lived.
 */

import { ENTITY_CATEGORIES } from '../config/entityCategories';
import { categoryView } from '../config/categoryView';

export type Direction = 'RIGHT' | 'DOWN';
export type MergeMode = 'near' | 'far' | 'bend' | 'off';

/**
 * Everything a link can carry.
 *
 * `sel` is the whole content of the canvas: since expanding became selecting
 * (2026-08-27) there is no separate `exp`, and with no owners drawn unasked
 * there is nothing to dismiss, so `hidden` and the `owners` scope went too.
 */
export interface ExploreState {
  sel: string[];
  detail: string | null;
  roots: boolean;
  sibs: boolean;
  dir: Direction;
  merge: MergeMode;
  legend: boolean;
  cases: boolean;
}

export const DEFAULTS: ExploreState = {
  sel: [], detail: null, roots: false, sibs: true, dir: 'RIGHT', merge: 'near',
  legend: false, cases: false,
};

/**
 * The overlay panels, as one list.
 *
 * Exists so `panels=0` (close everything) and any future "all panels" operation
 * enumerate themselves instead of being hand-maintained in several places. A
 * panel added here is picked up by the shorthand automatically — the failure
 * this avoids is the one the docs call config rot: a key whose meaning silently
 * stops covering everything it claims to.
 *
 * `detail` is deliberately NOT here. It is a drawer showing one named element,
 * so it is addressed by that name (`detail=Specimen`), and a boolean list is
 * the wrong shape for it. `panels=0` closes it anyway — see `applyPanelsParam`.
 */
/**
 * Params that are INSTRUCTIONS rather than state: they are resolved on read and
 * never written back. `tour=1` starts the tour; `panels=0` sweeps the overlays.
 *
 * Kept beside `DEFAULTS` so anything validating "is this a real param" can ask
 * for both halves instead of keeping its own copy — a hand-kept list is what
 * let `panels` be valid everywhere except the content test.
 */
export const INSTRUCTION_PARAMS = ['tour', 'panels', 'cat'] as const;

export const PANEL_KEYS = ['legend', 'cases'] as const;
export type PanelKey = typeof PANEL_KEYS[number];

/**
 * Apply the `panels` shorthand to an already-parsed set of panel values.
 *
 * `panels=0` closes every overlay, INCLUDING the `detail` drawer, because a
 * step that says "clear the panels" means the screen, not a subset of it that
 * happens to be booleans.
 *
 * Explicit keys win over the shorthand, so `panels=0&legend=1` closes
 * everything and then opens the legend. That ordering is what makes the
 * shorthand useful in a tour step: name the sweep, then name the exception.
 * The caller applies its explicit keys AFTER calling this.
 */
export function applyPanelsParam<T extends { legend?: boolean; cases?: boolean; detail?: string | null }>(
  params: URLSearchParams, into: T,
): T {
  if (params.get('panels') !== '0') return into;
  for (const k of PANEL_KEYS) into[k] = false as T[PanelKey];
  into.detail = null as T['detail'];
  return into;
}

/** localStorage keys, unchanged so existing preferences survive the move. */
const LS_KEYS = {
  dir: 'explore-nl-dir',
  merge: 'explore-nl-merge',
  sibs: 'explore-nl-sibs',
} as const;

const IDS_SEP = '~';

/**
 * Params Explore used to write. `exp` and `hidden` died when expanding became
 * selecting (2026-08-27) and nothing was left drawn unasked to dismiss;
 * `owners` was the cap that bounded that automatic draw.
 */
const RETIRED_PARAMS = ['exp', 'hidden', 'owners'] as const;

/**
 * Params that are read once at startup and then removed from the URL.
 *
 * `tour=1` sends someone straight into the tour (Siggie, 2026-08-28, for
 * sharing a link that opens it). It is a one-shot INSTRUCTION, not view state,
 * and the difference matters here: `writeExploreState` mutates the live URL
 * rather than rebuilding it, so a param nobody deletes sits in the address bar
 * forever. Left there, `tour=1` would survive a reload and restart the tour
 * every time the page was refreshed, and would be copied into every `copy
 * link` the visitor shared afterwards.
 *
 * Distinct from RETIRED_PARAMS, which are dead spellings being swept up. These
 * are live and meaningful -- they are just consumed rather than reflected.
 */
export const ONE_SHOT_PARAMS = ['tour'] as const;

/**
 * Is this a `?tour=1` link?
 *
 * LATCHED on first call, because the answer has to outlive the URL. The param
 * is stripped by the first `writeExploreState` (it must be -- see
 * ONE_SHOT_PARAMS), which runs in a mount effect, and the component that acts
 * on the answer is a sibling that has not necessarily asked yet. Latching
 * makes "did this page load ask for the tour?" a fact about the page load
 * rather than a question about the address bar right now.
 *
 * `resetTourRequest` exists for tests, which drive several page loads through
 * one module instance.
 */
let tourRequest: boolean | undefined;

export function readTourRequest(search = window.location.search): boolean {
  if (tourRequest === undefined) {
    tourRequest = new URLSearchParams(search).get('tour') === '1';
  }
  return tourRequest;
}

/** Forget the latched answer. Tests only: one module, many simulated loads. */
export function resetTourRequest(): void {
  tourRequest = undefined;
}

function readIds(params: URLSearchParams, key: string): string[] {
  const raw = params.get(key);
  return raw ? raw.split(IDS_SEP).filter(Boolean) : [];
}

/**
 * `cat=<id>` — every entity in a category, exactly what the ⊞ control draws.
 *
 * Shared by BOTH readers of the vocabulary: the URL read here, and
 * `parseTourChange` in `tourStateStack.ts`, which parses a step's `Change:`/
 * `Only:` query. Exported for exactly that reason — `cat` first shipped
 * understood only here, so `Only: cat=admin` parsed to an EMPTY `sel` and, an
 * `Only:` being a replace, cleared the canvas instead of filling it. One
 * expansion, two callers.
 *
 * An INSTRUCTION param like `panels=0`: resolved on read, never written back.
 * The canonical state is still the `sel` list it expands to, so a link the
 * viewer copies afterwards names the classes and does not depend on the
 * category still meaning what it meant.
 *
 * **It expands to members PLUS PINS**, through the same `categoryView` the
 * button uses, rather than to `classIds` alone. A tour step that says "show me
 * this category" and a viewer who presses ⊞ have to land on the same canvas —
 * two definitions of "the category's view" would drift the moment a pin was
 * added, and the pins are exactly the borrowed context that makes the view
 * make sense.
 *
 * Unknown category ids expand to nothing rather than throwing: a stale link is
 * a link that draws nothing, not a broken app.
 *
 * More than one category can be named, separated by a comma or by the `~` that
 * `sel` uses (`cat=lab,survey`). BOTH are accepted because this param is hand-
 * written in tour content and in shared links, where a comma is what anyone
 * reaches for — splitting only on `~` silently yielded an EMPTY canvas for
 * `cat=lab,survey`, which looked like the category was missing rather than
 * like the separator was wrong. Members are deduped, in order.
 */
export function readCategoryParam(params: URLSearchParams): string[] {
  const raw = params.get('cat');
  if (!raw) return [];
  const wanted = raw.split(new RegExp(`[,${IDS_SEP}]`)).filter(Boolean);
  return [...new Set(
    wanted.flatMap(id => {
      const cat = ENTITY_CATEGORIES.find(c => c.id === id);
      return cat ? categoryView(cat) : [];
    }),
  )];
}

/** localStorage can throw (private mode, disabled site data), so never let a
 *  preference read break the app — fall through to the default instead. */
function lsGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function lsSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* preference is best-effort; the URL is the source of truth */
  }
}

function oneOf<T extends string>(value: string | null, allowed: readonly T[]): T | null {
  return value && (allowed as readonly string[]).includes(value) ? (value as T) : null;
}

/**
 * Resolve the starting state: URL param, else stored preference, else default.
 *
 * Values are validated against their allowed sets rather than cast, so a
 * hand-edited link or a stale localStorage value cannot put the app into a
 * state the renderer does not handle.
 */
export function readExploreState(search = window.location.search): ExploreState {
  const p = new URLSearchParams(search);
  const dir = oneOf(p.get('dir'), ['RIGHT', 'DOWN'] as const)
    ?? oneOf(lsGet(LS_KEYS.dir), ['RIGHT', 'DOWN'] as const)
    ?? DEFAULTS.dir;
  const merge = oneOf(p.get('merge'), ['near', 'far', 'bend', 'off'] as const)
    ?? oneOf(lsGet(LS_KEYS.merge), ['near', 'far', 'bend', 'off'] as const)
    ?? DEFAULTS.merge;
  // Booleans need three states: present-in-URL, stored, unset. `has` before
  // value, or `?sibs=0` would be indistinguishable from absent.
  const sibs = p.has('sibs')
    ? p.get('sibs') === '1'
    : lsGet(LS_KEYS.sibs) !== null
      ? lsGet(LS_KEYS.sibs) !== '0'
      : DEFAULTS.sibs;

  const sel = readIds(p, 'sel');

  // Sweep first, then let explicit keys override it — `panels=0&legend=1`
  // means "clear the screen, then open the legend".
  const panels = applyPanelsParam(p, {
    legend: p.get('legend') === '1',
    cases: p.get('cases') === '1',
    detail: p.get('detail') || null,
  });
  if (p.has('legend')) panels.legend = p.get('legend') === '1';
  if (p.has('cases')) panels.cases = p.get('cases') === '1';
  if (p.has('detail')) panels.detail = p.get('detail') || null;

  return {
    /* Explicit `sel` wins over the `cat` shorthand, matching how `panels=0`
       yields to an explicit panel key: name the sweep, then the exception. */
    sel: sel.length ? sel : readCategoryParam(p),
    detail: panels.detail,
    roots: p.get('roots') === '1',
    sibs,
    dir,
    merge,
    legend: panels.legend,
    cases: panels.cases,
  };
}

/**
 * Write the whole state to the URL in one pass. Single writer, so no two
 * effects can clobber each other's params — the failure mode when each piece
 * of state wrote its own.
 *
 * **`push` decides whether this write becomes a back-button stop.** Almost
 * every write must NOT: ticking a checkbox, toggling the toolbar, opening the
 * drawer and each individual step of a tour are all `replaceState`, or `back`
 * would replay the session one click at a time and never leave the page. Only
 * a deliberate jump between whole canvases passes `push` — today that is the
 * category content view (⊞) alone.
 *
 * The pushed entry holds the NEW state, and the entry it pushes on top of
 * already holds the old one, put there by the previous write. So the history
 * stack stays "one entry per canvas the viewer chose" with no bookkeeping
 * beyond this flag.
 */
export function writeExploreState(state: ExploreState, { push = false } = {}): void {
  const url = new URL(window.location.href);
  const q = url.searchParams;

  const setIds = (key: string, ids: string[]) => {
    if (ids.length === 0) q.delete(key);
    else q.set(key, [...ids].sort().join(IDS_SEP));
  };
  // Defaults are omitted; see the module comment.
  const setIf = (key: string, value: string, isDefault: boolean) => {
    if (isDefault) q.delete(key);
    else q.set(key, value);
  };

  /*
   * Params that used to exist and no longer do. The write is a mutation of the
   * live URL, not a rebuild, so without this a dead param from an old link (or
   * from a session that predates the change) sits in the address bar forever
   * and gets copied along with everything else.
   */
  for (const dead of RETIRED_PARAMS) q.delete(dead);
  /*
   * One-shot params are CONSUMED here, not just deleted: this is the code that
   * destroys them, so it is the one place guaranteed to run before they can be
   * lost. Latching on the way out means a reader that asks later still gets
   * the right answer, whatever the render/effect ordering turns out to be --
   * which is what made this hard to get right by hand (2026-08-28).
   */
  if (tourRequest === undefined && q.has('tour')) tourRequest = q.get('tour') === '1';
  for (const once of ONE_SHOT_PARAMS) q.delete(once);

  setIds('sel', state.sel);
  if (state.detail) q.set('detail', state.detail);
  else q.delete('detail');
  setIf('roots', '1', !state.roots);
  setIf('sibs', state.sibs ? '1' : '0', state.sibs === DEFAULTS.sibs);
  setIf('dir', state.dir, state.dir === DEFAULTS.dir);
  setIf('merge', state.merge, state.merge === DEFAULTS.merge);
  setIf('legend', '1', state.legend === DEFAULTS.legend);
  setIf('cases', '1', state.cases === DEFAULTS.cases);
  /*
   * `panels` is an INSTRUCTION, like `tour`, not a reflection of state: it has
   * already been resolved into the individual keys by the time anything writes.
   * Left in the URL it would re-close the panels on every reload and be copied
   * into every shared link. It is not in ONE_SHOT_PARAMS because it is
   * idempotent and needs no latching — deleting it here is enough.
   */
  q.delete('panels');
  /*
   * `cat` is the same shape: it has already been expanded into `sel`, which is
   * written above, so what a viewer copies afterwards names the classes. That
   * is the point — the link stays right even if the category is later
   * redefined, and it does not silently re-expand on reload over a selection
   * the viewer has since changed.
   */
  q.delete('cat');

  /*
   * `pushState` does not fire `popstate` — only a real back/forward does — so
   * pushing here cannot loop back into the app's own popstate handler.
   */
  if (push) window.history.pushState(null, '', url);
  else window.history.replaceState(null, '', url);
}

/**
 * Persist the toolbar settings as this browser's preference.
 *
 * Deliberately separate from the URL write: a visitor who follows a link with
 * `?sibs=0` should see that link's setting without it becoming their new
 * default for every later visit. Only a deliberate toolbar click calls this.
 */
export function rememberPreference<K extends keyof typeof LS_KEYS>(
  key: K, value: ExploreState[K],
): void {
  lsSet(LS_KEYS[key], typeof value === 'boolean' ? (value ? '1' : '0') : String(value));
}

/** A shareable link to the given state, without touching the current URL. */
export function buildShareURL(state: ExploreState, base = window.location.href): string {
  const url = new URL(base);
  // Rebuild from scratch so params not owned by Explore don't leak into a
  // shared link, and so a stale param can never survive.
  const keep = new URLSearchParams();
  const set = (k: string, v: string) => keep.set(k, v);
  if (state.sel.length) set('sel', [...state.sel].sort().join(IDS_SEP));
  if (state.detail) set('detail', state.detail);
  if (state.roots) set('roots', '1');
  if (state.sibs !== DEFAULTS.sibs) set('sibs', state.sibs ? '1' : '0');
  if (state.dir !== DEFAULTS.dir) set('dir', state.dir);
  if (state.merge !== DEFAULTS.merge) set('merge', state.merge);
  if (state.legend !== DEFAULTS.legend) set('legend', '1');
  if (state.cases !== DEFAULTS.cases) set('cases', '1');
  url.search = keep.toString();
  return url.toString();
}
