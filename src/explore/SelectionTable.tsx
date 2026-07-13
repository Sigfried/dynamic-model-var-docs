/**
 * SelectionTable — category-grouped entity multi-select for the Explore SPA.
 *
 * v0: category headers + checkbox rows, flat within each category. The
 * Explorer-style count columns and in-category is-a nesting (see
 * docs/EXPLORE_VIZ.md, "Layout") layer on top of this without changing the
 * selection contract: `selectedIds` + `onToggle(classId)`.
 */

import { useMemo, useState } from 'react';
import type { DataService } from '../services/DataService';

interface SelectionTableProps {
  dataService: DataService;
  selectedIds: Set<string>;
  onToggle: (classId: string) => void;
}

export default function SelectionTable({ dataService, selectedIds, onToggle }: SelectionTableProps) {
  const groups = useMemo(() => dataService.getCategoryGroups(), [dataService]);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const toggleCategory = (id: string) =>
    setCollapsed(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const total = groups.reduce((n, g) => n + g.classIds.length, 0);

  return (
    <div className="text-sm">
      <div className="px-3 py-2 font-semibold border-b border-gray-200 dark:border-slate-700">
        {dataService.getConceptLabel('entity', true)} ({total})
      </div>
      {groups.map(group => {
        const isCollapsed = collapsed.has(group.id);
        const selectedInGroup = group.classIds.filter(id => selectedIds.has(id)).length;
        return (
          <div key={group.id}>
            <button
              type="button"
              onClick={() => toggleCategory(group.id)}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-left font-medium
                         bg-gray-50 dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700
                         hover:bg-gray-100 dark:hover:bg-slate-700"
            >
              <span className="text-xs text-gray-400">{isCollapsed ? '▶' : '▼'}</span>
              <span className="flex-1">{group.label}</span>
              <span className="text-xs text-gray-400">
                {selectedInGroup > 0 ? `${selectedInGroup} / ` : ''}{group.classIds.length}
              </span>
            </button>
            {!isCollapsed && group.classIds.map(classId => (
              <label
                key={classId}
                className={`flex items-center gap-2 px-3 py-1 cursor-pointer
                            hover:bg-blue-50 dark:hover:bg-slate-800
                            ${selectedIds.has(classId) ? 'bg-blue-50 dark:bg-slate-800' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={selectedIds.has(classId)}
                  onChange={() => onToggle(classId)}
                />
                <span className="font-mono text-xs">{classId}</span>
              </label>
            ))}
          </div>
        );
      })}
    </div>
  );
}
