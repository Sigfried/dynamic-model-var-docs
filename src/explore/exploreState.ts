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
 *    selection, expansions, dismissed owners, sibling merge, owner scope,
 *    path-to-root, layout direction, edge merge mode, the open drawer.
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
 * alternative (write everything explicitly) makes every link carry nine params.
 * Chosen deliberately — revisit if links start being embedded somewhere
 * long-lived.
 */

export type Direction = 'RIGHT' | 'DOWN';
export type MergeMode = 'near' | 'far' | 'bend' | 'off';
export type OwnerScope = 'none' | 'some' | 'all';

/** Everything a link can carry. */
export interface ExploreState {
  sel: string[];
  exp: string[];
  hidden: string[];
  detail: string | null;
  roots: boolean;
  sibs: boolean;
  dir: Direction;
  merge: MergeMode;
  owners: OwnerScope;
}

export const DEFAULTS: ExploreState = {
  sel: [], exp: [], hidden: [], detail: null,
  roots: false, sibs: true, dir: 'RIGHT', merge: 'near', owners: 'some',
};

/** localStorage keys, unchanged so existing preferences survive the move. */
const LS_KEYS = {
  dir: 'explore-nl-dir',
  merge: 'explore-nl-merge',
  sibs: 'explore-nl-sibs',
  owners: 'explore-nl-owners',
} as const;

const IDS_SEP = '~';

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
  const owners = oneOf(p.get('owners'), ['none', 'some', 'all'] as const)
    ?? oneOf(lsGet(LS_KEYS.owners), ['none', 'some', 'all'] as const)
    ?? DEFAULTS.owners;

  // Booleans need three states: present-in-URL, stored, unset. `has` before
  // value, or `?sibs=0` would be indistinguishable from absent.
  const sibs = p.has('sibs')
    ? p.get('sibs') === '1'
    : lsGet(LS_KEYS.sibs) !== null
      ? lsGet(LS_KEYS.sibs) !== '0'
      : DEFAULTS.sibs;

  return {
    sel: readIds(p, 'sel'),
    exp: readIds(p, 'exp'),
    hidden: readIds(p, 'hidden'),
    detail: p.get('detail') || null,
    roots: p.get('roots') === '1',
    sibs,
    dir,
    merge,
    owners,
  };
}

/**
 * Write the whole state to the URL in one pass. Single writer, so no two
 * effects can clobber each other's params — the failure mode when each piece
 * of state wrote its own.
 */
export function writeExploreState(state: ExploreState): void {
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

  setIds('sel', state.sel);
  setIds('exp', state.exp);
  setIds('hidden', state.hidden);
  if (state.detail) q.set('detail', state.detail);
  else q.delete('detail');
  setIf('roots', '1', !state.roots);
  setIf('sibs', state.sibs ? '1' : '0', state.sibs === DEFAULTS.sibs);
  setIf('dir', state.dir, state.dir === DEFAULTS.dir);
  setIf('merge', state.merge, state.merge === DEFAULTS.merge);
  setIf('owners', state.owners, state.owners === DEFAULTS.owners);

  window.history.replaceState(null, '', url);
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
  if (state.exp.length) set('exp', [...state.exp].sort().join(IDS_SEP));
  if (state.hidden.length) set('hidden', [...state.hidden].sort().join(IDS_SEP));
  if (state.detail) set('detail', state.detail);
  if (state.roots) set('roots', '1');
  if (state.sibs !== DEFAULTS.sibs) set('sibs', state.sibs ? '1' : '0');
  if (state.dir !== DEFAULTS.dir) set('dir', state.dir);
  if (state.merge !== DEFAULTS.merge) set('merge', state.merge);
  if (state.owners !== DEFAULTS.owners) set('owners', state.owners);
  url.search = keep.toString();
  return url.toString();
}
