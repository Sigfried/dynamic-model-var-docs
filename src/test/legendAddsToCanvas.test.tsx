/**
 * Following a name out of the legend ADDS to the canvas.
 *
 * It used to run `applyCase`, which clears the selection first, so clicking a
 * class in the legend wiped the diagram the reader had the legend open to
 * understand (Siggie, 2026-09-13). The legend lists ownership pairs, and a
 * pair is worth seeing next to what is already drawn.
 *
 * This goes through the real ExploreApp rather than the panel alone: the bug
 * was entirely in the WIRING, and a test of OwnershipLegend's own onSelect
 * would have passed throughout.
 */

import { describe, test, expect, beforeAll, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { loadModelData } from '../utils/dataLoader';
import ExploreApp from '../explore/ExploreApp';

const sel = () => new URLSearchParams(window.location.search).get('sel');

describe('legend selection adds to the canvas', () => {
  beforeAll(async () => { await loadModelData(); });
  beforeEach(() => {
    window.history.replaceState(null, '', '/dynamic-model-var-docs/?sel=Person&legend=1');
  });

  test('clicking a class in the legend keeps what was already drawn', async () => {
    render(<ExploreApp />);
    await screen.findByRole('heading', { name: /BDCHM Explorer/i });
    await waitFor(() => expect(sel()).toBe('Person'));

    // Open a rule's entity list, then follow one of its names.
    const counts = () => screen.getAllByRole('button')
      .filter(b => /\d+\s*entities/.test(b.textContent ?? ''));
    await waitFor(() => expect(counts().length).toBeGreaterThan(0));
    fireEvent.click(counts()[0]);

    const row = Array.from(document.querySelectorAll('ul.font-mono > li'))
      .find(li => li.textContent!.startsWith('BodySite'))!;
    fireEvent.click(row.querySelector('button')!);

    // Person is still there; BodySite joined it.
    await waitFor(() => {
      const ids = (sel() ?? '').split('~');
      expect(ids).toContain('Person');
      expect(ids).toContain('BodySite');
    });
  });
});
