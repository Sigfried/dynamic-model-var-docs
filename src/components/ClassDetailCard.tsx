/**
 * ClassDetailCard - Inline card showing class details when clicking a class range badge.
 *
 * Must only import from services/DataService, never from models/.
 */

import { useMemo } from 'react';
import type { DataService, ClassSummaryInfo } from '../services/DataService';

interface ClassDetailCardProps {
  classId: string;
  dataService: DataService;
  onClose: () => void;
  onNavigate?: (classId: string) => void;
}

export function ClassDetailCard({ classId, dataService, onClose, onNavigate }: ClassDetailCardProps) {
  const summary: ClassSummaryInfo | null = useMemo(
    () => dataService.getClassSummary(classId),
    [classId, dataService]
  );

  if (!summary) {
    return (
      <div className="mx-2 my-1 p-3 border border-blue-300 rounded-md bg-white text-xs text-gray-500">
        Class not found: {classId}
      </div>
    );
  }

  const MAX_SLOTS_SHOWN = 8;
  const shownSlots = summary.slots.slice(0, MAX_SLOTS_SHOWN);
  const remainingSlots = summary.slots.length - MAX_SLOTS_SHOWN;

  return (
    <div className="mx-2 my-1 border border-blue-400 rounded-md bg-white">
      {/* Header */}
      <div className="flex items-baseline justify-between px-3 py-2 border-b border-blue-200 bg-blue-50/50">
        <span className="font-semibold text-sm text-blue-700">
          {summary.name}
          {summary.isAbstract && <span className="ml-1 text-xs text-purple-500 italic">(abstract)</span>}
        </span>
        <div className="flex items-center gap-2">
          {onNavigate && (
            <button
              onClick={() => onNavigate(classId)}
              className="text-xs text-blue-600 hover:underline cursor-pointer"
              title="Expand this entity's slots inline"
            >
              Expand slots ▼
            </button>
          )}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-sm px-1"
            title="Close class detail"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="px-3 py-2 space-y-2">
        {/* Description */}
        {summary.description && (
          <p className="text-xs text-gray-500 leading-relaxed">{summary.description}</p>
        )}

        {/* Referenced by (shown first, per feedback) */}
        {summary.referencedBy.length > 0 && (
          <div className="text-xs">
            <span className="font-medium text-gray-500">Referenced by:</span>{' '}
            {summary.referencedBy.map((r, i) => (
              <span key={i}>
                {i > 0 && ', '}
                <button
                  onClick={() => onNavigate?.(r.classId)}
                  className="text-blue-600 hover:underline cursor-pointer"
                >
                  {r.classId}
                </button>
                <span className="text-gray-400">.{r.slotName}</span>
              </span>
            ))}
          </div>
        )}

        {/* Slot summary table */}
        {shownSlots.length > 0 && (
          <div>
            <div className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1">
              Slots ({summary.slots.length})
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left px-2 py-0.5 text-[10px] font-medium text-gray-400 uppercase">Slot</th>
                  <th className="text-left px-2 py-0.5 text-[10px] font-medium text-gray-400 uppercase">Range</th>
                  <th className="text-left px-2 py-0.5 text-[10px] font-medium text-gray-400 uppercase">Description</th>
                </tr>
              </thead>
              <tbody>
                {shownSlots.map((s, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    <td className="px-2 py-0.5">{s.name}</td>
                    <td className="px-2 py-0.5">
                      <RangeBadgeMini range={s.range} />
                    </td>
                    <td className="px-2 py-0.5 text-gray-400 max-w-[250px] truncate">{s.description}</td>
                  </tr>
                ))}
                {remainingSlots > 0 && (
                  <tr>
                    <td colSpan={3} className="px-2 py-1 text-gray-400 italic cursor-pointer">
                      … {remainingSlots} more slots
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function RangeBadgeMini({ range }: { range: string }) {
  const primitives = new Set([
    'string', 'integer', 'boolean', 'float', 'double', 'decimal',
    'date', 'datetime', 'time', 'uri', 'uriorcurie', 'ncname',
  ]);

  let colorClass: string;
  if (primitives.has(range.toLowerCase())) {
    colorClass = 'bg-green-100 text-green-700';
  } else if (range.endsWith('Enum')) {
    colorClass = 'bg-purple-100 text-purple-700';
  } else {
    colorClass = 'bg-blue-100 text-blue-700';
  }

  return (
    <span className={`inline-block px-1 py-0 rounded text-[11px] font-medium ${colorClass}`}>
      {range.length > 25 ? range.slice(0, 23) + '…' : range}
    </span>
  );
}
