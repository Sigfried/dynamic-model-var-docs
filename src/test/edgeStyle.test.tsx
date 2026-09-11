import { describe, test, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import EdgeSample from '../explore/EdgeSample';
import { EDGE_STYLE, DRAWN_KINDS, headGlyph, headMarker, headTrim } from '../explore/edgeStyle';
import { helpTextResolvers, helpWidgets } from '../explore/helpTextResolvers';
import type { DataService } from '../services/DataService';

/**
 * One edge style, drawn from one place (Siggie, 2026-09-10: "any edge feature
 * changes [should be] always reflected in the svgs ... defined declaratively in
 * the same config area"). These pin that the sample is the config, and that
 * the two head directions are the same size — the forward head used to read
 * bigger because the canvas drew converging heads at one size and per-edge
 * markers at another.
 */
describe('edgeStyle is the single source for how an edge looks', () => {
  afterEach(cleanup);

  test('both head directions have identical geometry; only the glyph differs', () => {
    const f = headMarker('forward');
    const b = headMarker('backward');
    const { d: df, ...gf } = f;
    const { d: db, ...gb } = b;
    expect(gf).toEqual(gb);
    expect(gf.markerWidth).toBe(EDGE_STYLE.head.len);
    expect(gf.markerHeight).toBe(EDGE_STYLE.head.span);
    // x=0 sits on the path's end for both: the forward glyph's BASE, the
    // backward glyph's TIP. So the head always lies beyond the line.
    expect(gf.refX).toBe(0);
    expect(df).toBe(headGlyph('forward'));
    expect(db).toBe(headGlyph('backward'));
    expect(df).toMatch(/^M0,0/);      // base at x=0, tip at x=10
    expect(db).toMatch(/^M10,0/);     // base at x=10, tip at x=0
  });

  test('a path is trimmed by exactly the head it carries', () => {
    expect(headTrim('own-fwd')).toBe(EDGE_STYLE.head.len + EDGE_STYLE.gap);
    expect(headTrim('own-bkwd')).toBe(headTrim('own-fwd'));
    expect(headTrim('association'))
      .toBe(EDGE_STYLE.head.len * EDGE_STYLE.secondaryScale + EDGE_STYLE.gap);
  });

  test.each(DRAWN_KINDS)('EdgeSample(%s) draws the config, not its own copy', kind => {
    const style = EDGE_STYLE.kinds[kind];
    const { container } = render(<EdgeSample kind={kind} />);
    const marker = container.querySelector('marker')!;
    const path = marker.querySelector('path')!;
    const line = container.querySelector('line')!;
    expect(path.getAttribute('d')).toBe(headGlyph(style.headDirection));
    expect(path.getAttribute('fill')).toBe(style.color);
    expect(line.getAttribute('stroke')).toBe(style.color);
    expect(line.getAttribute('stroke-dasharray')).toBe(style.dashed ? EDGE_STYLE.dash : null);
    expect(line.hasAttribute('marker-start')).toBe(style.heads === 'both');
    expect(line.hasAttribute('marker-end')).toBe(true);
    // Half-size canvas head; the two proportions are the canvas's.
    const w = Number(marker.getAttribute('markerWidth'));
    const h = Number(marker.getAttribute('markerHeight'));
    expect(w / h).toBeCloseTo(EDGE_STYLE.head.len / EDGE_STYLE.head.span, 5);
  });

  test('{{edge:kind}} resolves to a widget image labelled like the legend', () => {
    const r = helpTextResolvers({} as unknown as DataService);
    expect(r.edge('own-bkwd')).toBe('![A belongs to B](widget:edge:own-bkwd)');
    expect(r.edge('nonsense')).toBeUndefined();   // placeholder stays visible
    const { container } = render(<>{helpWidgets.edge('association')}</>);
    expect(container.querySelector('svg.help-inline-widget')).toBeTruthy();
    expect(helpWidgets.edge('nonsense')).toBeNull();
  });

  test('{{relation:kind:Left:Right}} is one unwrappable row: code, arrow, code', () => {
    const r = helpTextResolvers({} as unknown as DataService);
    const arg = 'own-fwd:Condition.affected_body_site:BodySite';
    expect(r.relation(arg)).toBe(`![Condition.affected_body_site BodySite](widget:relation:${arg})`);
    expect(r.relation('own-fwd:only-one-end')).toBeUndefined();
    expect(r.relation('nonsense:A:B')).toBeUndefined();
    const { container } = render(<>{helpWidgets.relation(arg)}</>);
    const row = container.querySelector('.help-inline-relation')!;
    expect(row).toBeTruthy();
    expect([...row.querySelectorAll('code')].map(c => c.textContent))
      .toEqual(['Condition.affected_body_site', 'BodySite']);
    expect(row.querySelector('svg')).toBeTruthy();
  });
});
