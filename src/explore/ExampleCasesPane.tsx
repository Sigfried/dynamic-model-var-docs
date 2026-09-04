/**
 * ExampleCasesPane — the named selections, opened from the Help menu.
 *
 * Clicking a case applies its selection to app state IN PLACE rather than
 * navigating: a reload would reset the scroll/zoom, which is exactly the state
 * you want held constant while flipping merge modes on one case.
 *
 * The cases themselves, and why each is in the set, are in exampleCases.ts.
 *
 * **BIGGEST FANS lives here now**, not in the legend (TASKS, "example-cases
 * pane needs restructuring", item 3). It ranks the schema's densest
 * convergences and divergences and loads one as a selection — which is
 * case-FINDING, the same job as the curated list beneath it. It sat in the
 * legend only because that is where it was first needed.
 *
 * The tabs are gone (2026-09-04): the ownership legend is its own panel, opened
 * from the same menu. See HelpMenu.
 */

import { EXAMPLE_CASES, type ExampleCase } from './exampleCases';
import HelpPanel from './HelpPanel';
import type { DataService } from '../services/DataService';
import { useMemo } from 'react';

interface ExampleCasesPaneProps {
  onClose: () => void;
  /** Apply a case to the live selection/roots state. */
  onApply: (c: ExampleCase) => void;
  /** Ids currently selected, so the active case can be marked. */
  selectedIds: Set<string>;
  /** Backs "Biggest fans", which ranks convergences from the live classifier. */
  dataService: DataService;
  /** Step aside for the legend panel when both are open. */
  offset?: boolean;
}

/** Same membership test the pane uses to tick a case: selection is the case's,
 *  exactly. */
function isActive(c: ExampleCase, selectedIds: Set<string>): boolean {
  return c.sel.length === selectedIds.size && c.sel.every(id => selectedIds.has(id));
}

export default function ExampleCasesPane({
  onClose, onApply, selectedIds, dataService, offset,
}: ExampleCasesPaneProps) {
  const convergences = useMemo(
    () => dataService.getConvergenceRanking(),
    [dataService],
  );
  const divergences = useMemo(
    () => dataService.getDivergenceRanking(),
    [dataService],
  );

  /** Loading a fan is an ad-hoc case: a selection with no curated note. */
  const loadFan = (ids: string[]) =>
    onApply({ name: 'ad hoc', note: '', sel: ids });

  return (
    <HelpPanel
      title="Example cases"
      subtitle="Selections worth looking at, simple to dense."
      onClose={onClose}
      offset={offset}
    >
      <section className="mb-4">
        <SectionHeading>Biggest fans</SectionHeading>
        <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-1.5">
          Counted in slot-edges, not classes: one class owning a target through
          two slots crowds the corridor twice. Click a row to load just that fan.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {([
            ['Converging (in)', convergences.slice(0, 6).map(c =>
              ({ entity: c.entity, n: c.edgeCount, peers: c.owners, flipped: 0 }))],
            ['Diverging (out)', divergences.slice(0, 6).map(d =>
              ({ entity: d.entity, n: d.edgeCount, peers: d.owned, flipped: d.flippedCount }))],
          ] as const).map(([heading, rows]) => (
            <div key={heading}>
              <h4 className="text-[10px] font-medium text-gray-500 dark:text-gray-400 mb-0.5">
                {heading}
              </h4>
              <ul className="space-y-0.5">
                {rows.map(r => (
                  <li key={r.entity}>
                    <button
                      onClick={() => loadFan([r.entity, ...r.peers])}
                      title={`Select ${r.entity} and all ${r.peers.length} peers`}
                      className="w-full text-left text-xs hover:bg-gray-50 dark:hover:bg-slate-700 rounded px-1"
                    >
                      <span className="text-blue-600 dark:text-blue-400">{r.entity}</span>
                      <span className="text-gray-400 ml-1">
                        {r.n}
                        {r.flipped > 0 ? ` (${r.flipped} flipped)` : ''}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {EXAMPLE_CASES.map(group => (
        <section key={group.heading} className="mb-3 last:mb-1">
          <SectionHeading>{group.heading}</SectionHeading>
          <ul className="space-y-1.5">
            {group.cases.map(c => {
              const active = isActive(c, selectedIds);
              return (
                <li key={c.name}>
                  <button
                    onClick={() => onApply(c)}
                    className={`block w-full text-left rounded px-2 py-1 border
                      ${active
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                        : 'border-transparent hover:bg-gray-50 dark:hover:bg-slate-700'}`}
                  >
                    <span className={`text-xs font-medium ${active
                      ? 'text-blue-700 dark:text-blue-300'
                      : 'text-blue-600 dark:text-blue-400'}`}>
                      {c.name}
                    </span>
                    <span className="ml-1.5 text-[10px] text-gray-400">
                      {c.sel.length}
                      {c.roots ? ' ⇱' : ''}
                    </span>
                    <p className="text-[11px] leading-snug text-gray-600 dark:text-gray-400 mt-0.5">
                      {c.note}
                    </p>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </HelpPanel>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[11px] font-semibold uppercase tracking-wider
                   text-gray-400 dark:text-gray-500 mb-1">
      {children}
    </h3>
  );
}
