/**
 * EnumDetailCard - Inline card showing enum details when clicking an enum range badge.
 *
 * Must only import from services/DataService, never from models/.
 */

import { useMemo } from 'react';
import type { DataService, EnumDetailInfo } from '../services/DataService';

interface EnumDetailCardProps {
  enumId: string;
  dataService: DataService;
  onClose: () => void;
  onNavigate?: (classId: string) => void;
}

export function EnumDetailCard({ enumId, dataService, onClose, onNavigate }: EnumDetailCardProps) {
  const detail: EnumDetailInfo | null = useMemo(
    () => dataService.getEnumDetail(enumId),
    [enumId, dataService]
  );

  if (!detail) {
    return (
      <div className="mx-2 my-1 p-3 border border-purple-300 rounded-md bg-white text-xs text-gray-500">
        Enum not found: {enumId}
      </div>
    );
  }

  const MAX_SHOWN = 15;
  const shownValues = detail.permissibleValues.slice(0, MAX_SHOWN);
  const remaining = detail.totalValues - MAX_SHOWN;

  return (
    <div className="mx-2 my-1 border border-purple-400 rounded-md bg-white">
      {/* Header */}
      <div className="flex items-baseline justify-between px-3 py-2 border-b border-purple-200 bg-purple-50/50">
        <span className="font-semibold text-sm text-purple-700">{detail.name}</span>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-sm px-1"
          title="Close enum detail"
        >
          ✕
        </button>
      </div>

      <div className="px-3 py-2 space-y-2">
        {/* Description */}
        {detail.description && (
          <p className="text-xs text-gray-500 leading-relaxed">{detail.description}</p>
        )}

        {/* Inherits */}
        {detail.inherits && detail.inherits.length > 0 && (
          <div className="text-xs text-gray-500">
            <span className="font-medium">Inherits from:</span>{' '}
            {detail.inherits.join(', ')}
          </div>
        )}

        {/* Used by */}
        {detail.usedBy.length > 0 && (
          <div className="text-xs">
            <span className="font-medium text-gray-500">Used by:</span>{' '}
            {detail.usedBy.map((u, i) => (
              <span key={i}>
                {i > 0 && ', '}
                <button
                  onClick={() => onNavigate?.(u.classId)}
                  className="text-blue-600 hover:underline cursor-pointer"
                >
                  {u.classId}
                </button>
                <span className="text-gray-400">.{u.slotName}</span>
              </span>
            ))}
          </div>
        )}

        {/* Permissible values table */}
        {shownValues.length > 0 && (
          <div>
            <div className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1">
              Permissible Values ({detail.totalValues})
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left px-2 py-0.5 text-[10px] font-medium text-gray-400 uppercase">Value</th>
                  <th className="text-left px-2 py-0.5 text-[10px] font-medium text-gray-400 uppercase">Description</th>
                </tr>
              </thead>
              <tbody>
                {shownValues.map((v, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    <td className="px-2 py-0.5 font-mono text-purple-700">{v.key}</td>
                    <td className="px-2 py-0.5 text-gray-500 max-w-[300px] truncate">{v.description ?? ''}</td>
                  </tr>
                ))}
                {remaining > 0 && (
                  <tr>
                    <td colSpan={2} className="px-2 py-1 text-gray-400 italic cursor-pointer">
                      … {remaining} more values
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {detail.totalValues === 0 && (
          <div className="text-xs text-gray-400 italic">No permissible values defined (values may be dynamic)</div>
        )}
      </div>
    </div>
  );
}
