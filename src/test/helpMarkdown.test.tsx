/**
 * `<HelpMarkdown>` — the help system's markdown, called on a string that never
 * came from the content file.
 *
 * The extraction it pins (TASKS `markdown-everywhere` item (a)) is what lets
 * the legend's `OWNERSHIP_RULES[].text` say what a tour step can say. Each
 * capability is tested through the COMPONENT rather than through the helpers it
 * re-exports, because the failure this guards against is a caller wiring up
 * three of the four and nobody noticing the fourth is missing.
 *
 * The no-provider case is deliberate and not an edge case: it is how a panel
 * gets tested without standing up a tour.
 */
import { describe, test, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { HelpProvider } from '../help/HelpProvider';
import HelpMarkdown from '../help/HelpMarkdown';

afterEach(cleanup);

/** A provider with no content file to speak of — only the host's enrichments. */
const wrap = (
  body: string,
  opts: Parameters<typeof HelpProvider>[0] extends infer P
    ? P extends { markdown: string } ? Omit<P, 'markdown' | 'children'> : never
    : never,
) => render(
  <HelpProvider markdown="" {...opts}>
    <div data-testid="out"><HelpMarkdown>{body}</HelpMarkdown></div>
  </HelpProvider>,
);

const out = () => screen.getByTestId('out');

describe('HelpMarkdown', () => {
  test('renders ordinary markdown', () => {
    wrap('Plain **bold** text.', {});
    expect(out().querySelector('strong')?.textContent).toBe('bold');
  });

  test('fills a {{kind:arg}} placeholder from the host resolvers', () => {
    /*
     * The popover never does this — the provider fills the content file once at
     * parse time. A caller's string has been through no such pass, so filling
     * at RENDER is the thing that makes an arbitrary string work at all.
     */
    wrap('Count: {{n:things}}.', {
      textResolvers: { n: (a: string) => (a === 'things' ? '89' : undefined) },
    });
    expect(out().textContent).toBe('Count: 89.');
  });

  test('leaves an unresolved placeholder visible rather than blanking it', () => {
    // Same contract as the content file's: drift names itself on screen.
    wrap('Count: {{n:gone}}.', { textResolvers: { n: () => undefined } });
    expect(out().textContent).toBe('Count: {{n:gone}}.');
  });

  test('draws a widget: image through the host widget map', () => {
    wrap('before ![A owns B](widget:edge:own-fwd) after', {
      widgets: { edge: (kind: string) => <i data-testid="w">{kind}</i> },
    });
    expect(screen.getByTestId('w').textContent).toBe('own-fwd');
  });

  test('falls back to alt text when the host has no such widget', () => {
    wrap('![A owns B](widget:edge:own-fwd)', { widgets: {} });
    expect(out().textContent).toContain('A owns B');
    expect(out().querySelector('img')).toBeNull();
  });

  test('applies a :s[…]{color=…} directive against the host palette', () => {
    wrap(':s[owned]{color=own-fwd}', { colors: { 'own-fwd': 'rgb(1, 2, 3)' } });
    const span = out().querySelector('span[style]');
    expect(span?.textContent).toBe('owned');
    expect(span?.getAttribute('style')).toContain('rgb(1, 2, 3)');
  });

  test('opens links in a new tab', () => {
    // Following one in the same tab would throw away a running tour's state.
    wrap('[docs](https://example.org)', {});
    const a = out().querySelector('a');
    expect(a?.getAttribute('target')).toBe('_blank');
    expect(a?.getAttribute('rel')).toBe('noreferrer');
  });

  test('renders a blockquote as the alert box', () => {
    wrap('> careful', {});
    expect(out().querySelector('.help-popover-alert')).not.toBeNull();
  });

  /*
   * NOT an edge case: this is how a panel that renders prose gets tested
   * without standing up a provider, and the reason `useHelpIfAny` exists. The
   * markdown must still render; only the enrichments go missing.
   */
  describe('with no provider at all', () => {
    const bare = (body: string) => render(
      <div data-testid="out"><HelpMarkdown>{body}</HelpMarkdown></div>,
    );

    test('still renders the markdown', () => {
      bare('Plain **bold** text.');
      expect(out().querySelector('strong')?.textContent).toBe('bold');
    });

    test('leaves placeholders standing, as an unresolved name would', () => {
      bare('Count: {{n:things}}.');
      expect(out().textContent).toBe('Count: {{n:things}}.');
    });

    test('falls back to a widget image\'s alt text', () => {
      bare('![A owns B](widget:edge:own-fwd)');
      expect(out().textContent).toContain('A owns B');
    });
  });
});
