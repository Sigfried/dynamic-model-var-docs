import { describe, test, expect, afterEach, beforeAll } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { HelpProvider } from '../help/HelpProvider';
import HelpLayer from '../help/HelpLayer';
import { useHelp } from '../help/helpContext';
import { styleOf } from '../help/styleDirectives';

/**
 * `:s[text]{size=.7em bg=pink}` styles a span, `:::s{color=blue} … :::` a
 * block, with the markdown inside intact (Siggie, 2026-09-11). Parsed by
 * remark-directive; `styleDirectives` gives `s` its meaning.
 */

beforeAll(() => {
  Object.assign(HTMLElement.prototype, { showPopover() {}, hidePopover() {} });
});

function Open() {
  const { showEntry } = useHelp();
  return <button onClick={() => showEntry('e')}>open</button>;
}

const body = () => document.querySelector('[data-help-popover] .help-popover-body')!;

const setup = (description: string) => {
  render(
    <HelpProvider markdown={`\n## S\n\n### e\n\n- Title: T\n- Description:\n${description}\n`}>
      <Open />
      <HelpLayer />
    </HelpProvider>,
  );
  fireEvent.click(screen.getByRole('button', { name: 'open' }));
};

describe('styleOf', () => {
  test('whitelisted attributes become declarations; others are dropped', () => {
    expect(styleOf({ size: '.7em', bg: 'pink', opacity: '.4' }))
      .toBe('font-size:.7em;background-color:pink;opacity:.4');
    expect(styleOf({ nowrap: '', color: 'blue' })).toBe('white-space:nowrap;color:blue');
    expect(styleOf({ size: '.7em', position: 'fixed', color: 'url(x)' })).toBe('font-size:.7em');
    expect(styleOf(null)).toBe('');
  });
});

describe('style directives in help markdown', () => {
  afterEach(cleanup);

  test('inline: :s[…]{…} is a styled span with its markdown intact', () => {
    setup('  Plain :s[small **bold** `code`]{size=.7em bg=pink} plain again.');
    const span = body().querySelector('span.help-styled')!;
    expect(span).toBeTruthy();
    // React re-serialises the style: `0.7em`, spaces after colons.
    expect(span.getAttribute('style')).toMatch(/font-size:\s*0?\.7em/);
    expect(span.getAttribute('style')).toMatch(/background-color:\s*pink/);
    expect(span.querySelector('strong')?.textContent).toBe('bold');
    expect(span.querySelector('code')?.textContent).toBe('code');
    expect(body().textContent).toBe('Plain small bold code plain again.');
  });

  test('block: :::s{…} … ::: wraps the paragraphs between in a styled div', () => {
    setup('  Before.\n\n  :::s{color=blue}\n  One.\n\n  Two.\n  :::\n\n  After.');
    const div = body().querySelector('div.help-styled')!;
    expect(div).toBeTruthy();
    expect(div.getAttribute('style')).toMatch(/color:\s*blue/);
    expect([...div.querySelectorAll('p')].map(p => p.textContent)).toEqual(['One.', 'Two.']);
    expect([...body().querySelectorAll('p')].map(p => p.textContent))
      .toEqual(['Before.', 'One.', 'Two.', 'After.']);
  });

  test('a directive of another name, or with no usable attributes, keeps its text unstyled', () => {
    setup('  A :typo[kept]{size=.5em} and :s[plain]{position=fixed} here.');
    expect(body().querySelector('.help-styled')).toBeNull();
    expect(body().textContent).toBe('A kept and plain here.');
  });
});
