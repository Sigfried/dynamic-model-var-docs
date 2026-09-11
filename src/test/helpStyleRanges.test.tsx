import { describe, test, expect, afterEach, beforeAll } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { HelpProvider } from '../help/HelpProvider';
import HelpLayer from '../help/HelpLayer';
import { useHelp } from '../help/helpContext';
import { styleOf } from '../help/styleRanges';

/**
 * `{{size:.7em; bg:pink}} … {{size:clear}}` styles a span or a block of help
 * prose, with the prose between still rendered as markdown (Siggie,
 * 2026-09-11). Placeholders whose kind no resolver claims reach the markdown
 * intact, and the remark plugin wraps what lies between them.
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
  test('the first declaration takes its property from the kind; the rest are prop:value', () => {
    expect(styleOf('size', '.7em; bg-color:pink; opacity:.4'))
      .toBe('font-size:.7em;background-color:pink;opacity:.4');
    expect(styleOf('style', 'color:blue; nowrap:1')).toBe('color:blue;white-space:nowrap');
  });

  test('unknown properties and unsafe values are dropped, not passed through', () => {
    expect(styleOf('size', '.7em; position:fixed; color:url(x)')).toBe('font-size:.7em');
    // The junk declaration is dropped; the sound one before it survives.
    expect(styleOf('size', 'red; }evil{')).toBe('font-size:red');
  });
});

describe('style ranges in help markdown', () => {
  afterEach(cleanup);

  test('inline: a span around the range, markdown inside intact', () => {
    setup('  Plain {{size:.7em; bg:pink}}small **bold** `code`{{size:clear}} plain again.');
    const span = body().querySelector('span.help-styled')!;
    expect(span).toBeTruthy();
    // React re-serialises the style: `0.7em`, spaces after colons.
    expect(span.getAttribute('style')).toMatch(/font-size:\s*0?\.7em/);
    expect(span.getAttribute('style')).toMatch(/background-color:\s*pink/);
    expect(span.querySelector('strong')?.textContent).toBe('bold');
    expect(span.querySelector('code')?.textContent).toBe('code');
    // Markers are gone; the text around the range is untouched.
    expect(body().textContent).toBe('Plain small bold code plain again.');
  });

  test('block: markers on their own lines wrap the paragraphs between in a div', () => {
    setup('  Before.\n\n  {{color:blue}}\n\n  One.\n\n  Two.\n\n  {{color:clear}}\n\n  After.');
    const div = body().querySelector('div.help-styled')!;
    expect(div).toBeTruthy();
    expect(div.getAttribute('style')).toMatch(/color:\s*blue/);
    expect([...div.querySelectorAll('p')].map(p => p.textContent)).toEqual(['One.', 'Two.']);
    // Everything else is still there, in order, outside the div.
    expect([...body().querySelectorAll('p')].map(p => p.textContent))
      .toEqual(['Before.', 'One.', 'Two.', 'After.']);
  });

  test('an unclosed range runs to the end of its paragraph; a stray clear is dropped', () => {
    setup('  A {{nowrap:1}}b c d\n\n  {{size:clear}} e');
    const span = body().querySelector('span.help-styled')!;
    expect(span.textContent).toBe('b c d');
    expect(body().textContent?.replace(/\s+/g, ' ').trim()).toBe('A b c d e');
  });
});
