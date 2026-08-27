import { describe, test, expect, beforeEach } from 'vitest';
import { helpResolvers } from '../explore/helpResolvers';

/**
 * The row-level anchor resolvers (S3b gap 2).
 *
 * These are the one place in the tour that depends on the app's MARKUP rather
 * than on its data, so they break silently: renaming `data-class-row` or
 * dropping `data-declaring-class` costs nothing at compile time and yields an
 * unringed popover at runtime, which is exactly the failure the resolvers
 * exist to fix. The DOM below is copied from the real render sites, named in
 * each test, so a markup change fails here instead of in front of a
 * stakeholder.
 */

const { 'entity-row': entityRow, 'entity-checkbox': entityCheckbox,
  'slot-row': slotRow, 'node-box': nodeBox } = helpResolvers;

beforeEach(() => { document.body.innerHTML = ''; });

/** The left panel in table mode — SelectionTable.tsx's `<label data-class-row>`. */
function mountTable(...classIds: string[]) {
  document.body.innerHTML = `
    <div data-help-id="selection-tree">
      ${classIds.map(id => `
        <label data-class-row="${id}">
          <input type="checkbox" />
          <span>${id}</span>
        </label>`).join('')}
    </div>`;
}

/**
 * The left panel in tree mode — the DagBrowser widget's `.dbw-row` wrapper
 * around the span dmvd marks with `data-entity-row` (SelectionTree.tsx).
 */
function mountTree(...rows: { id: string; height?: number }[]) {
  document.body.innerHTML = `
    <div data-help-id="selection-tree">
      ${rows.map(r => `
        <div class="dbw-row" data-h="${r.height ?? 24}">
          <span data-entity-row="${r.id}">
            <input type="checkbox" />
            <button>${r.id}</button>
          </span>
        </div>`).join('')}
    </div>`;
  // jsdom gives everything a zero rect, so height is faked per element -- the
  // collapsing-row case below turns on it.
  for (const el of document.querySelectorAll<HTMLElement>('.dbw-row')) {
    const h = Number(el.dataset.h);
    el.getBoundingClientRect = () => ({ height: h, width: 200, top: 0, left: 0,
      right: 200, bottom: h, x: 0, y: 0, toJSON: () => ({}) }) as DOMRect;
  }
}

/** A diagram box — OwnershipGraphView.tsx's `data-node-id` div and its rows. */
function box(id: string, rows: { slot: string; declaring?: string }[]): string {
  return `
    <div data-node-id="${id}">
      ${rows.map(r => `<div data-row="${r.slot}"${
        r.declaring ? ` data-declaring-class="${r.declaring}"` : ''}></div>`).join('')}
    </div>`;
}

describe('entity-row', () => {
  test('finds the row in table mode, which is the panel default', () => {
    mountTable('Participant', 'BodySite');
    expect(entityRow('Participant')?.getAttribute('data-class-row'))
      .toBe('Participant');
  });

  test('finds the row in tree mode, and rings the WHOLE row', () => {
    // The marked span is only part of the row; the ring should cover the
    // widget's full-width wrapper, which is what "the participant row
    // highlighted, not the whole tree" asks for.
    mountTree({ id: 'Participant' });
    expect(entityRow('Participant')?.className).toBe('dbw-row');
  });

  test('skips a collapsing row that is still mounted at zero height', () => {
    // The widget keeps a collapsed row in the DOM until its animation ends.
    // Ringing it draws a line across the panel at an arbitrary place.
    mountTree({ id: 'Participant', height: 0 }, { id: 'Participant', height: 24 });
    const rect = entityRow('Participant')!.getBoundingClientRect();
    expect(rect.height).toBe(24);
  });

  test('is scoped to the selection panel', () => {
    // A second DagBrowser lives in the Focus view; an unscoped query would
    // happily ring that one instead.
    document.body.innerHTML = `
      <div class="focus-view">
        <div class="dbw-row"><span data-entity-row="Participant"></span></div>
      </div>`;
    expect(entityRow('Participant')).toBeNull();
  });

  test('an entity that is not on screen resolves to null, not an error', () => {
    mountTable('BodySite');
    expect(entityRow('Participant')).toBeNull();
  });

  test('an anchor argument cannot break the selector', () => {
    mountTable('Participant');
    expect(() => entityRow('"] , [data-class-row="BodySite')).not.toThrow();
    expect(entityRow('"] , [data-class-row="BodySite')).toBeNull();
  });
});

describe('entity-checkbox', () => {
  test('finds the checkbox inside the row, in either mode', () => {
    mountTable('Participant');
    expect((entityCheckbox('Participant') as HTMLInputElement)?.type)
      .toBe('checkbox');
    mountTree({ id: 'Participant' });
    expect((entityCheckbox('Participant') as HTMLInputElement)?.type)
      .toBe('checkbox');
  });

  test('null when the row itself is not there', () => {
    mountTable('BodySite');
    expect(entityCheckbox('Participant')).toBeNull();
  });
});

describe('node-box', () => {
  test('finds a box by its own id', () => {
    document.body.innerHTML = box('MeasurementObservation', []);
    expect(nodeBox('MeasurementObservation')?.getAttribute('data-node-id'))
      .toBe('MeasurementObservation');
  });

  test('falls back to the merged box a class is drawn in', () => {
    // Merged siblings share one box named `merged::<parent>`; an anchor naming
    // the parent must still find it.
    document.body.innerHTML = box('merged::Observation', []);
    expect(nodeBox('Observation')?.getAttribute('data-node-id'))
      .toBe('merged::Observation');
  });

  test('finds the box a merged CHILD is drawn inside', () => {
    // A merged child has no box of its own -- only rows that name it.
    document.body.innerHTML = box('merged::Observation', [
      { slot: 'observation_type', declaring: 'MeasurementObservation' },
    ]);
    expect(nodeBox('MeasurementObservation')?.getAttribute('data-node-id'))
      .toBe('merged::Observation');
  });
});

describe('slot-row', () => {
  test('finds one attribute row inside its box', () => {
    document.body.innerHTML = box('MeasurementObservation', [
      { slot: 'age_at_observation' }, { slot: 'observation_type' },
    ]);
    const el = slotRow('MeasurementObservation.observation_type');
    expect(el?.getAttribute('data-row')).toBe('observation_type');
  });

  test('picks the right duplicate row inside a merged box', () => {
    // THE case data-declaring-class exists for: a merged box holds the
    // parent's slot and each child's narrowed override, all named the same.
    document.body.innerHTML = box('merged::Observation', [
      { slot: 'observation_type' },
      { slot: 'observation_type', declaring: 'MeasurementObservation' },
    ]);
    const el = slotRow('MeasurementObservation.observation_type');
    expect(el?.getAttribute('data-declaring-class')).toBe('MeasurementObservation');
  });

  test('splits on the LAST dot, so a slot name keeps its underscores', () => {
    document.body.innerHTML = box('MeasurementObservation', [
      { slot: 'age_at_observation' },
    ]);
    expect(slotRow('MeasurementObservation.age_at_observation')).not.toBeNull();
  });

  test('an argument with no dot names no row', () => {
    document.body.innerHTML = box('MeasurementObservation', [{ slot: 'x' }]);
    expect(slotRow('MeasurementObservation')).toBeNull();
  });

  test('null when the box is not on the diagram', () => {
    document.body.innerHTML = box('BodySite', [{ slot: 'observation_type' }]);
    expect(slotRow('MeasurementObservation.observation_type')).toBeNull();
  });
});

describe('every anchor kind the content uses has a resolver', () => {
  test('the table covers the four dmvd kinds', () => {
    // `help-id` and `none` are built into the provider, not registered here.
    expect(Object.keys(helpResolvers).sort()).toEqual(
      ['entity-checkbox', 'entity-row', 'node-box', 'slot-row'],
    );
  });
});
