import { describe, test, expect, afterEach, beforeAll } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';

// jsdom has no Popover API; the layer calls showPopover() when an entry opens.
beforeAll(() => {
  Object.assign(HTMLElement.prototype, { showPopover() {}, hidePopover() {} });
});
import { HelpProvider } from '../help/HelpProvider';
import HelpLayer from '../help/HelpLayer';
import { useHelp } from '../help/helpContext';

/**
 * `![alt](widget:<name>:<arg>)` in content is drawn by the host's widget of
 * that name; without one the alt text stands in. The package knows the URL
 * shape only — what an `edge` is stays the host's business.
 */
const MD = `
## S

### e

- Title: T
- Description: A owns B ![A owns B](widget:edge:own-fwd) and that is that.
`;

function Open() {
  const { showEntry } = useHelp();
  return <button onClick={() => showEntry('e')}>open</button>;
}

const setup = (widgets?: Record<string, (arg: string) => React.ReactNode>) => {
  render(
    <HelpProvider markdown={MD} widgets={widgets}>
      <Open />
      <HelpLayer />
    </HelpProvider>,
  );
  fireEvent.click(screen.getByRole('button', { name: 'open' }));
};

describe('inline widgets in help markdown', () => {
  afterEach(cleanup);

  test('a widget: image is drawn by the host widget, with the arg', () => {
    const seen: string[] = [];
    setup({ edge: arg => { seen.push(arg); return <svg data-testid="edge-widget" />; } });
    expect(screen.getByTestId('edge-widget')).toBeTruthy();
    expect(seen).toEqual(['own-fwd']);
    // The prose around it survives, inline.
    expect(document.querySelector('[data-help-popover]')!.textContent).toMatch(/A owns B .*and that is that/);
  });

  test('without a widget of that name, the alt text stands in', () => {
    setup({});
    expect(screen.queryByTestId('edge-widget')).toBeNull();
    expect(document.querySelector('[data-help-popover]')!.textContent).toMatch(/A owns B A owns B and that is that/);
    // No dangling <img> pointing at a URL nothing can load.
    expect(document.querySelector('[data-help-popover] img')).toBeNull();
  });
});
