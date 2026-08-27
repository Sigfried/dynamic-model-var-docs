/**
 * Title-click reset for the Explore SPA.
 *
 * The previous app resets when its title is clicked (App.tsx handleResetApp);
 * the Explore header was inert text. Reset has to clear every piece of
 * shareable state — the selection and the open drawer — and the URL has to
 * follow, since a leftover ?sel=/?detail= would resurrect the old view on
 * reload.
 *
 * There is no ?exp= any more: expanding IS selecting since 2026-08-27, so the
 * selection is the whole content of the canvas.
 */

import { describe, test, expect, beforeAll, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { loadModelData } from '../utils/dataLoader';
import ExploreApp from '../explore/ExploreApp';

const params = () => new URLSearchParams(window.location.search);

describe('Explore title-click reset', () => {
  beforeAll(async () => {
    // ExploreApp loads through useModelData; warm the same cache the hook uses.
    await loadModelData();
  });

  beforeEach(() => {
    window.history.replaceState(null, '', '/dynamic-model-var-docs/');
  });

  const renderApp = async () => {
    const utils = render(<ExploreApp />);
    await screen.findByRole('heading', { name: /BDCHM Explorer/i });
    return utils;
  };

  test('clears selection and the URL when the title is clicked', async () => {
    window.history.replaceState(null, '', '/dynamic-model-var-docs/?sel=BodySite~Person');
    await renderApp();

    await waitFor(() => expect(params().get('sel')).toBe('BodySite~Person'));

    fireEvent.click(screen.getByRole('heading', { name: /BDCHM Explorer/i }));

    await waitFor(() => expect(params().get('sel')).toBeNull());
    // Checkboxes follow the cleared selection.
    const boxes = screen.getAllByRole('checkbox') as HTMLInputElement[];
    expect(boxes.some(b => b.checked)).toBe(false);
  });

  test('clears the open drawer too, and drops a stale ?exp=', async () => {
    // ?exp= is a dead param from before expanding became selecting. An old
    // link carrying one must not strand an id the URL writer never rewrites.
    window.history.replaceState(
      null, '', '/dynamic-model-var-docs/?sel=Person&exp=Participant&detail=Person',
    );
    await renderApp();

    await waitFor(() => expect(params().get('detail')).toBe('Person'));
    expect(params().get('exp')).toBeNull();

    fireEvent.click(screen.getByRole('heading', { name: /BDCHM Explorer/i }));

    await waitFor(() => {
      expect(params().get('sel')).toBeNull();
      expect(params().get('detail')).toBeNull();
    });
  });

  test('re-opens the selection table if it was collapsed', async () => {
    window.history.replaceState(null, '', '/dynamic-model-var-docs/?sel=Person');
    await renderApp();

    // Collapse, then reset: an empty canvas behind a collapsed panel reads as
    // breakage, so reset restores the table.
    fireEvent.click(screen.getByTitle(/Hide entity selection/i));
    await waitFor(() =>
      expect(screen.queryByTitle(/Hide entity selection/i)).toBeNull());

    fireEvent.click(screen.getByRole('heading', { name: /BDCHM Explorer/i }));

    await waitFor(() =>
      expect(screen.getByTitle(/Hide entity selection/i)).toBeInTheDocument());
  });

  test('is a no-op on an already-empty view', async () => {
    await renderApp();
    fireEvent.click(screen.getByRole('heading', { name: /BDCHM Explorer/i }));

    await waitFor(() => {
      expect(params().get('sel')).toBeNull();
      expect(params().get('detail')).toBeNull();
    });
    expect(screen.getByRole('heading', { name: /BDCHM Explorer/i })).toBeInTheDocument();
  });
});
