import { describe, test, expect, beforeEach } from 'vitest';
import {
  readExploreState, buildShareURL, DEFAULTS, rememberPreference,
  type ExploreState,
} from '../explore/exploreState';

/**
 * Shareable state. The bug this prevents: a link reproduced the SELECTION but
 * rendered it with the recipient's localStorage settings, so a link showing
 * off the sibling merge looked, to a first-time visitor, like the feature did
 * not exist.
 *
 * The precedence rule under test is URL > localStorage > default.
 */
describe('explore state', () => {
  beforeEach(() => localStorage.clear());

  const read = (search: string) => readExploreState(search);

  test('a bare URL gives the defaults', () => {
    expect(read('')).toEqual(DEFAULTS);
  });

  test('URL beats a conflicting stored preference', () => {
    // The whole point: the link wins, or shared links are unreliable.
    rememberPreference('sibs', false);
    rememberPreference('dir', 'DOWN');
    expect(read('?sibs=1&dir=RIGHT').sibs).toBe(true);
    expect(read('?sibs=1&dir=RIGHT').dir).toBe('RIGHT');
  });

  test('stored preference is used when the URL is silent', () => {
    // A bare visit still remembers a returning user's settings.
    rememberPreference('merge', 'far');
    rememberPreference('owners', 'all');
    expect(read('').merge).toBe('far');
    expect(read('').owners).toBe('all');
  });

  test('?sibs=0 is distinguishable from an absent sibs param', () => {
    // The three-state trap: sibs defaults to TRUE, so a naive
    // `get('sibs') === '1'` would read an absent param as "off" and silently
    // disable the sibling merge on every bare visit.
    expect(read('?sibs=0').sibs).toBe(false);
    expect(read('').sibs).toBe(true);
    expect(read('?sibs=1').sibs).toBe(true);
  });

  test('an invalid value falls through instead of poisoning the state', () => {
    // A hand-edited link must not put the renderer into a state it cannot
    // handle, so values are validated against their allowed sets, not cast.
    expect(read('?merge=nonsense').merge).toBe(DEFAULTS.merge);
    expect(read('?dir=sideways').dir).toBe(DEFAULTS.dir);
    expect(read('?owners=lots').owners).toBe(DEFAULTS.owners);
  });

  test('a corrupt stored preference also falls through', () => {
    localStorage.setItem('explore-nl-merge', 'garbage');
    expect(read('').merge).toBe(DEFAULTS.merge);
  });

  test('id lists round-trip through a share URL', () => {
    const state: ExploreState = {
      ...DEFAULTS,
      sel: ['Participant', 'BodySite'],
      exp: ['Condition'],
      hidden: ['Procedure'],
      detail: 'BodySite',
    };
    const url = buildShareURL(state, 'https://example.org/explore');
    const back = read(new URL(url).search);
    expect(back.sel.sort()).toEqual(['BodySite', 'Participant']);
    expect(back.exp).toEqual(['Condition']);
    expect(back.hidden).toEqual(['Procedure']);
    expect(back.detail).toBe('BodySite');
  });

  test('every non-default setting survives a full round-trip', () => {
    const state: ExploreState = {
      sel: ['Specimen'], exp: [], hidden: [], detail: null,
      roots: true, sibs: false, dir: 'DOWN', merge: 'bend', owners: 'none',
    };
    const back = read(new URL(buildShareURL(state, 'https://x.test/')).search);
    expect(back).toEqual(state);
  });

  test('defaults are omitted from the URL, so links stay short', () => {
    const url = buildShareURL({ ...DEFAULTS, sel: ['Person'] }, 'https://x.test/');
    const q = new URL(url).searchParams;
    expect(q.get('sel')).toBe('Person');
    for (const k of ['sibs', 'dir', 'merge', 'owners', 'roots', 'detail']) {
      expect(q.has(k), `${k} should be omitted at its default`).toBe(false);
    }
  });

  test('a share URL drops params Explore does not own', () => {
    // Otherwise an unrelated param (a tracking tag, another app's state)
    // rides along into every shared link.
    const url = buildShareURL({ ...DEFAULTS, sel: ['Person'] },
      'https://x.test/?utm_source=slack&stale=1');
    const q = new URL(url).searchParams;
    expect(q.has('utm_source')).toBe(false);
    expect(q.has('stale')).toBe(false);
    expect(q.get('sel')).toBe('Person');
  });

  test('following a link does not overwrite the visitor stored preference', () => {
    // rememberPreference is only called by a deliberate toolbar click, so
    // reading a link's settings must leave localStorage untouched.
    rememberPreference('dir', 'DOWN');
    read('?dir=RIGHT');
    expect(localStorage.getItem('explore-nl-dir')).toBe('DOWN');
  });
});
