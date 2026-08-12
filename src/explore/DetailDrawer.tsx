/**
 * DetailDrawer — right-hand entity detail panel for the Explore SPA
 * (docs/EXPLORE_VIZ.md, "Layout" region 3 / build step 4).
 *
 * Opens on node click in the ownership graph. It reuses the Explorer card's
 * data path (DataService.getClassSummary) rather than the ClassDetailCard
 * component itself: that card is an *inline* card sized to sit between table
 * rows, which is why it caps the slot list at 8 and truncates descriptions.
 * A full-height drawer has the room those compromises were working around,
 * and the spec calls for exactly the two fixes those compromises caused:
 *
 *   1. "Referenced by" items are links (navigate the drawer to that entity).
 *   2. The Description column is fully readable — wrapped, never truncated
 *      to an inaccessible ellipsis.
 *
 * Also drops the card's dead "… N more" row: all slots are listed here.
 *
 * Architecture: src/explore/ talks to services/DataService only.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { DataService, ClassSummaryInfo } from '../services/DataService';

interface DetailDrawerProps {
  classId: string;
  dataService: DataService;
  onClose: () => void;
  /** Called when the user follows a link to another entity. */
  onNavigate: (classId: string) => void;
  /** Whether the entity is in the current graph selection. */
  isSelected: boolean;
  /** Add/remove the entity from the selection driving the graph. */
  onToggleSelect: (classId: string) => void;
}

export default function DetailDrawer({
  classId,
  dataService,
  onClose,
  onNavigate,
  isSelected,
  onToggleSelect,
}: DetailDrawerProps) {
  const summary: ClassSummaryInfo | null = useMemo(
    () => dataService.getClassSummary(classId),
    [classId, dataService],
  );

  // Back stack for link navigation within the drawer.
  const [history, setHistory] = useState<string[]>([]);
  const navigate = useCallback(
    (nextId: string) => {
      if (nextId === classId) return;
      setHistory(prev => [...prev, classId]);
      onNavigate(nextId);
    },
    [classId, onNavigate],
  );
  const goBack = useCallback(() => {
    setHistory(prev => {
      if (prev.length === 0) return prev;
      onNavigate(prev[prev.length - 1]);
      return prev.slice(0, -1);
    });
  }, [onNavigate]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const slotLabel = dataService.getTypeLabel('slot', true);

  return (
    <aside
      className="w-96 shrink-0 flex flex-col min-h-0 border-l border-gray-200 dark:border-slate-700
                 bg-white dark:bg-slate-900"
      aria-label="Entity details"
    >
      <header
        className="flex items-start gap-2 px-3 py-2 border-b border-gray-200 dark:border-slate-700
                   bg-gray-50 dark:bg-slate-800 shrink-0"
      >
        {history.length > 0 && (
          <button
            onClick={goBack}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-sm mt-0.5"
            title="Back"
          >
            ←
          </button>
        )}
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm text-blue-700 dark:text-blue-300 break-words">
            {summary?.name ?? classId}
            {summary?.isAbstract && (
              <span className="ml-1 text-xs text-purple-500 italic">(abstract)</span>
            )}
          </div>
          {summary?.parentId && (
            <div className="text-xs text-gray-400">
              is a{' '}
              <button
                onClick={() => navigate(summary.parentId!)}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                {summary.parentId}
              </button>
            </div>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-sm px-1"
          title="Close (Esc)"
        >
          ✕
        </button>
      </header>

      {!summary ? (
        <div className="p-3 text-xs text-gray-500">Entity not found: {classId}</div>
      ) : (
        <div className="flex-1 overflow-y-auto min-h-0 px-3 py-2 space-y-3">
          <button
            onClick={() => onToggleSelect(classId)}
            className={`w-full px-2 py-1 text-xs rounded border ${
              isSelected
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                : 'border-gray-300 dark:border-slate-600 hover:border-blue-400 text-gray-600 dark:text-gray-300'
            }`}
          >
            {isSelected ? '✓ In diagram — click to remove' : '+ Add to diagram'}
          </button>

          {summary.description && (
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              {summary.description}
            </p>
          )}

          {summary.referencedBy.length > 0 && (
            <section>
              <SectionLabel>Referenced by ({summary.referencedBy.length})</SectionLabel>
              <ul className="space-y-0.5">
                {summary.referencedBy.map((r, i) => (
                  <li key={`${r.classId}.${r.slotName}-${i}`} className="text-xs">
                    <button
                      onClick={() => navigate(r.classId)}
                      className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      {r.classId}
                    </button>
                    <span className="text-gray-400">.{r.slotName}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {summary.slots.length > 0 && (
            <section>
              <SectionLabel>
                {slotLabel} ({summary.slots.length})
              </SectionLabel>
              {/* Full list, wrapped descriptions — no truncation, no "N more". */}
              <ul className="divide-y divide-gray-100 dark:divide-slate-700">
                {summary.slots.map((s, i) => (
                  <li key={`${s.name}-${i}`} className="py-1.5">
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <span className="text-xs font-medium text-gray-800 dark:text-gray-100">
                        {s.name}
                      </span>
                      <RangeBadge range={s.range} onNavigate={navigate} dataService={dataService} />
                    </div>
                    {s.description && (
                      <p className="mt-0.5 text-[11px] text-gray-500 dark:text-gray-400 leading-snug break-words">
                        {s.description}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </aside>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1">
      {children}
    </div>
  );
}

/**
 * Range badge. Entity ranges are links (navigate the drawer); primitives and
 * enums are plain badges. Colors mirror ClassDetailCard's RangeBadgeMini so
 * the two read as the same language, but the range is never abbreviated here.
 */
function RangeBadge({
  range,
  onNavigate,
  dataService,
}: {
  range: string;
  onNavigate: (id: string) => void;
  dataService: DataService;
}) {
  const isEntity = dataService.itemExists(range) && !range.endsWith('Enum');
  const primitives = new Set([
    'string', 'integer', 'boolean', 'float', 'double', 'decimal',
    'date', 'datetime', 'time', 'uri', 'uriorcurie', 'ncname',
  ]);

  const color = primitives.has(range.toLowerCase())
    ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
    : range.endsWith('Enum')
      ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
      : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300';

  const cls = `inline-block px-1 py-0 rounded text-[11px] font-medium ${color}`;

  return isEntity ? (
    <button onClick={() => onNavigate(range)} className={`${cls} hover:underline cursor-pointer`}>
      {range}
    </button>
  ) : (
    <span className={cls}>{range}</span>
  );
}
