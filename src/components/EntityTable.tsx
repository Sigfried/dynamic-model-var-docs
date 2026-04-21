/**
 * EntityTable - Renders a table of entities within a category.
 *
 * Must only import from services/DataService, never from models/.
 */

import { useMemo, useState } from 'react';
import { SlotDrilldown } from './SlotDrilldown';
import { SUBCLASS_OF } from '../config/entityCategories';
import type { DataService } from '../services/DataService';

interface EntityTableProps {
  classIds: string[];
  dataService: DataService;
  isPinned: (id: string) => boolean;
  onTogglePin: (id: string) => void;
}

interface ClassRowData {
  id: string;
  description: string;
  slotCount: number;
  rangeCounts: { cls: number; enm: number; typ: number };
  varCount: number;
}

function CountBadge({ count, colorClass, title }: {
  count: number;
  colorClass: string;
  title?: string;
}) {
  return (
    <span
      className={`inline-flex items-center justify-center min-w-[24px] px-1.5 py-0 rounded-full text-xs font-semibold ${
        count === 0 ? 'opacity-25' : ''
      } ${colorClass}`}
      title={title}
    >
      {count}
    </span>
  );
}

export function EntityTable({ classIds, dataService, isPinned, onTogglePin }: EntityTableProps) {
  const [expandedEntity, setExpandedEntity] = useState<string | null>(null);

  const rows: ClassRowData[] = useMemo(() => {
    return classIds
      .filter(id => dataService.itemExists(id))
      .map(id => ({
        id,
        description: dataService.getClassDescription(id),
        slotCount: dataService.getSlotCount(id),
        rangeCounts: dataService.getRangeCountsByType(id),
        varCount: dataService.getVariableCount(id),
      }));
  }, [classIds, dataService]);

  const toggleDrilldown = (id: string) => {
    setExpandedEntity(prev => prev === id ? null : id);
  };

  return (
    <div className="border-x border-b border-gray-200 rounded-b-md pl-5">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="text-left px-3 py-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide">Entity</th>
            <th className="text-center px-2 py-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide" title="Total slots (own + inherited)">Slots</th>
            <th className="text-center px-2 py-1.5 text-xs font-medium text-blue-500 uppercase tracking-wide" title="Entity-typed ranges">Cls</th>
            <th className="text-center px-2 py-1.5 text-xs font-medium text-purple-500 uppercase tracking-wide" title="Enum-typed ranges">Enm</th>
            <th className="text-center px-2 py-1.5 text-xs font-medium text-green-600 uppercase tracking-wide" title="Primitive-typed ranges">Typ</th>
            <th className="text-center px-2 py-1.5 text-xs font-medium text-amber-600 uppercase tracking-wide" title="Mapped study variables">Vars</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <EntityRow
              key={row.id}
              row={row}
              isExpanded={expandedEntity === row.id}
              isPinned={isPinned(row.id)}
              onTogglePin={() => onTogglePin(row.id)}
              onToggleDrilldown={() => toggleDrilldown(row.id)}
              dataService={dataService}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}


interface EntityRowProps {
  row: ClassRowData;
  isExpanded: boolean;
  isPinned: boolean;
  onTogglePin: () => void;
  onToggleDrilldown: () => void;
  dataService: DataService;
}

function EntityRow({ row, isExpanded, isPinned, onTogglePin, onToggleDrilldown, dataService }: EntityRowProps) {
  const isSubclass = row.id in SUBCLASS_OF;

  return (
    <>
      <tr
        className={`border-b border-gray-100 hover:bg-blue-50/50 ${
          isExpanded ? 'bg-blue-50 border-b-0' : ''
        }`}
      >
        <td className="px-3 py-1.5" style={isSubclass ? { paddingLeft: '2rem' } : undefined}>
          <span className="flex items-center gap-1.5">
            {isSubclass && <span className="text-gray-400 text-xs">↳</span>}
            <button
              onClick={onToggleDrilldown}
              className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer"
              title={row.description || 'Click to expand'}
            >
              {row.id}
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onTogglePin(); }}
              className={`text-xs ${
                isPinned
                  ? 'text-amber-500 opacity-100'
                  : 'text-gray-300 opacity-0 hover:opacity-100'
              } hover:text-amber-500 transition-opacity group-hover:opacity-100`}
              title={isPinned ? 'Unpin' : 'Pin to top'}
              style={{ opacity: isPinned ? 1 : undefined }}
            >
              {isPinned ? '📌' : '○'}
            </button>
          </span>
        </td>
        <td className="text-center px-2 py-1.5">
          <CountBadge count={row.slotCount} colorClass="bg-blue-100 text-blue-700" title={`${row.slotCount} slots`} />
        </td>
        <td className="text-center px-2 py-1.5">
          <CountBadge count={row.rangeCounts.cls} colorClass="bg-blue-100 text-blue-700" title={`${row.rangeCounts.cls} entity-typed ranges`} />
        </td>
        <td className="text-center px-2 py-1.5">
          <CountBadge count={row.rangeCounts.enm} colorClass="bg-purple-100 text-purple-700" title={`${row.rangeCounts.enm} enum-typed ranges`} />
        </td>
        <td className="text-center px-2 py-1.5">
          <CountBadge count={row.rangeCounts.typ} colorClass="bg-green-100 text-green-700" title={`${row.rangeCounts.typ} primitive-typed ranges`} />
        </td>
        <td className="text-center px-2 py-1.5">
          <CountBadge count={row.varCount} colorClass="bg-amber-100 text-amber-700" title={`${row.varCount} variables`} />
        </td>
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan={6} className="p-0 pl-4">
            <SlotDrilldown
              classId={row.id}
              dataService={dataService}
              onClose={onToggleDrilldown}
              depth={0}
            />
          </td>
        </tr>
      )}
    </>
  );
}
