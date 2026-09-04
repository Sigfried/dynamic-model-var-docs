import { describe, test, expect, afterEach } from 'vitest';
import { render, fireEvent, cleanup, screen } from '@testing-library/react';
import { RelationBar, type RelationRowVM } from '../explore/RelationBar';

/**
 * Where the relation popover opens, and that it stays on screen.
 *
 * ⚠️ READ `docs/TESTING.md`, "Testing code that measures layout", BEFORE
 * EDITING. jsdom has no layout engine, so a test like this passes vacuously
 * unless every property the component reads is stubbed — and an unstubbed one
 * makes a CORRECT fix look broken.
 *
 * Ported from `RelationMenuPlacement.test.tsx` when the cascading menu was
 * replaced by the bar (2026-09-04). The component changed; the hazard did not.
 * `useClamped` measures the panel and pulls it back inside the viewport, and a
 * box near the right edge is not a rare case — the canvas pans.
 *
 * Kept in its own file because it patches shared prototypes
 * (`Element.prototype.getBoundingClientRect`). Mixing that with behavioural
 * tests would silently run those under fake geometry.
 *
 * The numbers below are the component's own Tailwind values (`max-w-[34rem]` =
 * 544px). Nothing here reads the real CSS, so keep them in sync by hand.
 */

const PANEL_W = 400;
const PANEL_H = 200;
const VIEW_H = 800;
const PAD = 8;          // useClamped's margin

const origRect = Element.prototype.getBoundingClientRect;

/** Fake enough layout that the clamp has something real to read. */
function stubLayout(innerWidth: number, chipLeft: number) {
  Object.defineProperty(window, 'innerWidth', { value: innerWidth, configurable: true });
  Object.defineProperty(window, 'innerHeight', { value: VIEW_H, configurable: true });

  Element.prototype.getBoundingClientRect = function (this: Element) {
    const el = this as HTMLElement;
    /*
     * The panel is the DIV carrying data-relation-bar; the chips are BUTTONs
     * carrying it too, so the tag is what separates them.
     *
     * An earlier version of this stub keyed on `el.style.position !== ''`,
     * reasoning that the popover is `fixed`. It is — but from a Tailwind
     * CLASS, not an inline style, so the branch never matched, every rect came
     * back 0×0, and `useClamped`'s `r.width` was 0, which makes the clamp a
     * no-op that silently agrees with an unclamped expectation. Exactly the
     * failure docs/TESTING.md warns about, hit while porting this file.
     */
    if (el.tagName === 'DIV' && el.hasAttribute('data-relation-bar')) {
      const left = parseFloat(el.style.left || '0');
      const top = parseFloat(el.style.top || '0');
      return { left, top, right: left + PANEL_W, bottom: top + PANEL_H,
               width: PANEL_W, height: PANEL_H } as DOMRect;
    }
    if (el.tagName === 'BUTTON') {
      return { left: chipLeft, right: chipLeft + 40, top: 100, bottom: 120,
               width: 40, height: 20 } as DOMRect;
    }
    return { left: 0, right: 0, top: 0, bottom: 0, width: 0, height: 0 } as DOMRect;
  };
}

const ROWS: RelationRowVM[] = [
  { other: 'Participant', position: 'owned-mine', slot: 'associated_participant',
    declaredBy: 'Observation', cardinality: '1..1', drawn: false },
  { other: 'ObservationSet', position: 'owned-theirs', slot: 'observations',
    declaredBy: 'ObservationSet', cardinality: '1..*', drawn: false },
];

/** The popover element, or null. Identified by the inline position style
 *  useClamped writes — the chips carry the same data attribute. */
function panel(): HTMLElement | null {
  return document.querySelector('div[data-relation-bar]');
}

function openLeft() {
  render(
    <RelationBar label="Observation" rows={ROWS}
      onAdd={() => {}} onRemove={() => {}} />,
  );
  fireEvent.mouseEnter(screen.getByLabelText(/classes Observation belongs to/));
}

describe('RelationBar row rendering', () => {
  afterEach(() => {
    cleanup();
    Element.prototype.getBoundingClientRect = origRect;
  });

  /** Text of each row, cells joined — enough to see order and qualification. */
  function rowTexts(): string[] {
    return [...document.querySelectorAll('table tr')].map(tr =>
      [...tr.querySelectorAll('td')]
        .map(td => (td.textContent || '').trim())
        .filter(Boolean)
        .join(' '));
  }

  test('the declaring end keeps its slot name on a MERGED box', () => {
    /*
     * The box is titled `Observation` but its rows are declared by
     * `MeasurementObservation`. Naming this end by the box TITLE made `End`
     * fail its `cls === declaredBy` test, so every slot name vanished and the
     * rows read `Organization ──< Observation` (Siggie, screenshot
     * 2026-09-04). The end has to be named by the DECLARER.
     */
    stubLayout(1400, 300);
    render(
      <RelationBar
        label="Observation"
        rows={[{
          other: 'Organization', position: 'owned-mine', slot: 'performed_by',
          declaredBy: 'MeasurementObservation', cardinality: '0..1', drawn: false,
        }]}
        onAdd={() => {}} onRemove={() => {}}
      />,
    );
    fireEvent.mouseEnter(screen.getByLabelText(/classes Observation belongs to/));
    expect(rowTexts()[0]).toContain('MeasurementObservation.performed_by');
  });

  test('rows follow the BOX\'s slot order, with declared-elsewhere rows last', () => {
    stubLayout(1400, 300);
    render(
      <RelationBar
        label="Observation"
        rows={ROWS}
        slotOrder={['associated_participant', 'performed_by']}
        onAdd={() => {}} onRemove={() => {}}
      />,
    );
    fireEvent.mouseEnter(screen.getByLabelText(/classes Observation belongs to/));
    const texts = rowTexts();
    // `associated_participant` is first in slotOrder; `observations` is
    // declared by ObservationSet, has no row on this box, and sorts last.
    expect(texts[0]).toContain('associated_participant');
    expect(texts[texts.length - 1]).toContain('observations');
  });
});

describe('RelationBar row controls', () => {
  afterEach(() => {
    cleanup();
    Element.prototype.getBoundingClientRect = origRect;
  });

  const DRAWN: RelationRowVM[] = [
    { other: 'Quantity', position: 'owns-mine', slot: 'value_quantity',
      declaredBy: 'Observation', cardinality: '0..1', drawn: true },
    { other: 'Context', position: 'owns-mine', slot: 'context',
      declaredBy: 'Observation', cardinality: '0..*', drawn: false },
  ];

  function open(onAdd = () => {}, onRemove = () => {}, onInspect = () => {}) {
    stubLayout(1400, 300);
    render(
      <RelationBar label="Observation" rows={DRAWN}
        onAdd={onAdd} onRemove={onRemove} onInspect={onInspect} />,
    );
    fireEvent.mouseEnter(screen.getByLabelText(/classes Observation owns/));
  }

  test('add/hide is a per-row button, not a click on the row', () => {
    /*
     * The row used to be the toggle, which left nowhere to click for detail
     * and forced drawn rows to be dimmed just to signal "clicking me removes
     * it" (Siggie, 2026-09-04). Two actions, two targets.
     */
    const removed: string[] = [];
    const added: string[] = [];
    open(id => added.push(id), id => removed.push(id));

    fireEvent.click(screen.getByLabelText('Remove Quantity from the diagram'));
    expect(removed).toEqual(['Quantity']);

    fireEvent.click(screen.getByLabelText('Add Context to the diagram'));
    expect(added).toEqual(['Context']);

    // And a drawn row is NOT washed out any more — the button carries the state.
    expect(document.querySelectorAll('tr.opacity-55')).toHaveLength(0);
  });

  test('the class name opens details; the slot suffix is not a target', () => {
    const inspected: string[] = [];
    open(() => {}, () => {}, id => inspected.push(id));
    fireEvent.click(screen.getByTitle("Open Quantity's details"));
    expect(inspected).toEqual(['Quantity']);
  });

  test('the header counts entities AND attributes when they differ', () => {
    // "add all 4 is correct but confusing because there are more than four
    // rows" — one entity can be reached through several attributes.
    stubLayout(1400, 300);
    const rows: RelationRowVM[] = [
      { other: 'Quantity', position: 'owns-mine', slot: 'range_low',
        declaredBy: 'Observation', cardinality: '0..1', drawn: false },
      { other: 'Quantity', position: 'owns-mine', slot: 'range_high',
        declaredBy: 'Observation', cardinality: '0..1', drawn: false },
    ];
    render(
      <RelationBar label="Observation" rows={rows}
        onAdd={() => {}} onRemove={() => {}} />,
    );
    fireEvent.mouseEnter(screen.getByLabelText(/classes Observation owns/));
    const header = document.querySelector('div[data-relation-bar] div div')!;
    expect(header.textContent).toContain('1 entity');
    expect(header.textContent).toContain('through 2 attributes');
  });
});

describe('RelationBar popover placement', () => {
  afterEach(() => {
    cleanup();
    Element.prototype.getBoundingClientRect = origRect;
  });

  test('opens below its chip when there is room', () => {
    stubLayout(1400, 300);
    openLeft();
    const p = panel();
    expect(p).not.toBeNull();
    // Aligned to the chip's left edge, just under its bottom.
    expect(parseFloat(p!.style.left)).toBe(300);
    expect(parseFloat(p!.style.top)).toBe(122);
  });

  test('a chip near the right edge does not open a popover off-screen', () => {
    // The case that motivates useClamped at all: the canvas pans, so "near the
    // edge" is normal rather than exceptional.
    const view = 1000;
    stubLayout(view, 900);
    openLeft();
    const p = panel();
    expect(p).not.toBeNull();
    const left = parseFloat(p!.style.left);
    // Pulled back so the whole panel fits, not merely nudged.
    expect(left).toBe(view - PANEL_W - PAD);
    expect(left + PANEL_W).toBeLessThanOrEqual(view - PAD);
  });

  test('never clamps to a negative offset in a viewport narrower than the panel', () => {
    // Degenerate but reachable: the clamp must floor at the padding rather
    // than push the panel off the LEFT edge chasing the right one.
    stubLayout(300, 250);
    openLeft();
    expect(parseFloat(panel()!.style.left)).toBe(PAD);
  });
});
