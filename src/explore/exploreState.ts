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
 *  - **Personal preference** — zoom, pan, pins, drags, which panel is
 *    collapsed. These describe how one person is looking at the diagram, not
 *    what it shows, and pinning them into a link would fight the recipient's
 *    window size.
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
}

export const DEFAULTS: ExploreState = {
  sel: [], detail: null, roots: false, sibs: true, dir: 'RIGHT', merge: 'near',
};

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

  return {
    sel: readIds(p, 'sel'),
    detail: p.get('detail') || null,
    roots: p.get('roots') === '1',
    sibs,
    dir,
    merge,
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
  url.search = keep.toString();
  return url.toString();
}
