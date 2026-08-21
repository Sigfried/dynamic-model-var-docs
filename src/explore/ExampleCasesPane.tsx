/**
 * ExampleCasesPane — floating list of named routing test cases.
 *
 * Opened from the header. Clicking a case applies its selection to app state
 * IN PLACE rather than navigating: a reload would drop the merge mode (it is
 * in localStorage, read once at mount) and reset the scroll/zoom, which is
 * exactly the state you want held constant while flipping modes on one case.
 *
 * The cases themselves, and why each is in the set, are in exampleCases.ts.
 *
 * Temporary in the same sense as the merge-mode buttons: this exists to settle
 * the routing questions. Unlike those buttons it is probably worth keeping —
 * see TASKS "upcoming thoughts" #1, which wants a permanent legend explaining
 * ownership pairs, toolbar buttons, colours and dashed edges; this pane is the
 * natural place for that to land.
 */

import { useEffect, useState } from 'react';
import { EXAMPLE_CASES, type ExampleCase } from './exampleCases';
import OwnershipLegend from './OwnershipLegend';
import type { DataService } from '../services/DataService';

interface ExampleCasesPaneProps {
  onClose: () => void;
  /** Apply a case to the live selection/expansion/roots state. */
  onApply: (c: ExampleCase) => void;
  /** Ids currently selected, so the active case can be marked. */
  selectedIds: Set<string>;
  /** Backs the legend tab, which derives every pair from the live classifier. */
  dataService: DataService;
}

/** Same membership test the pane uses to tick a case: selection is the case's,
 *  exactly. Expansions are ignored — two cases never differ only by them. */
function isActive(c: ExampleCase, selectedIds: Set<string>): boolean {
  return c.sel.length === selectedIds.size && c.sel.every(id => selectedIds.has(id));
}

export default function ExampleCasesPane({
  onClose,
  onApply,
  selectedIds,
  dataService,
}: ExampleCasesPaneProps) {
  // Two tabs rather than two panes: the curated cases and the exhaustive pair
  // listing are the same workflow — you read the legend to find a fan the case
  // list missed, then select it. Splitting them would put a window between.
  const [tab, setTab] = useState<'cases' | 'legend'>('cases');
  // Escape closes, matching the drawer.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="absolute top-14 right-4 z-30 w-[26rem] max-h-[80vh] overflow-y-auto
                 rounded-lg border border-gray-300 dark:border-slate-600
                 bg-white dark:bg-slate-800 shadow-xl text-gray-900 dark:text-gray-100"
    >
      <div className="sticky top-0 flex items-baseline justify-between gap-2 px-4 py-2
                      border-b border-gray-200 dark:border-slate-700
                      bg-white dark:bg-slate-800">
        <div>
          <h2 className="text-sm font-semibold">Example cases</h2>
          <p className="text-[11px] text-gray-500 dark:text-gray-400">
            Fixed targets for comparing merge modes and routing constants.
          </p>
        </div>
        <button
          onClick={onClose}
          title="Close (Esc)"
          className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-lg leading-none"
        >
          ×
        </button>
      </div>

      <div className="sticky top-[3.25rem] flex gap-1 px-4 py-1.5 border-b
                      border-gray-200 dark:border-slate-700
                      bg-white dark:bg-slate-800">
        {([['cases', 'Cases'], ['legend', 'Ownership legend']] as const).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`px-2 py-0.5 text-xs rounded border ${tab === id
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
              : 'border-transparent text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-700'}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="px-4 py-2">
        {tab === 'legend' && (
          <OwnershipLegend
            dataService={dataService}
            onSelect={ids => onApply({ name: 'ad hoc', note: '', sel: ids })}
          />
        )}
        {tab === 'cases' && EXAMPLE_CASES.map(group => (
          <section key={group.heading} className="mb-3 last:mb-1">
            <h3 className="text-[11px] font-semibold uppercase tracking-wider
                           text-gray-400 dark:text-gray-500 mb-1">
              {group.heading}
            </h3>
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
                        {c.exp?.length ? `+${c.exp.length}` : ''}
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
      </div>
    </div>
  );
}
