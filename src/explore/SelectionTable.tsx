/**
 * SelectionTable — category-grouped entity multi-select for the Explore SPA.
 *
 * Category headers + checkbox rows with the Explorer's five count badges
 * (Props / Cls / Enm / Typ / Vars), from the same DataService accessors and
 * the same vocab-driven headers, so the two tables read as one language.
 *
 * Within a category, classes nest by inheritance (`getCategoryTrees()`).
 * Nesting is presentation only — the selection contract is unchanged:
 * `selectedIds` + `onToggle(classId)`, one checkbox per class, no cascade from
 * a parent to its subclasses. `Entity` never appears: it is uncategorized by
 * design (entityCategories.ts, UNCATEGORIZED_BY_DESIGN), so the classes that
 * extend it are category roots.
 */

import { useMemo, useState } from 'react';
import type { CategoryTreeNode, DataService } from '../services/DataService';

interface SelectionTableProps {
  dataService: DataService;
  selectedIds: Set<string>;
  onToggle: (classId: string) => void;
}

interface Counts {
  props: number;
  cls: number;
  enm: number;
  typ: number;
  vars: number;
}

export default function SelectionTable({ dataService, selectedIds, onToggle }: SelectionTableProps) {
  const groups = useMemo(() => dataService.getCategoryTrees(), [dataService]);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  // Same five counts the Explorer's entity table shows (Props / Cls / Enm /
  // Typ / Vars), from the same DataService accessors, so the two tables read
  // as one language. Headers/tooltips come from getEntityColumns() so they
  // stay vocab-driven.
  const col = useMemo(() => dataService.getEntityColumns(), [dataService]);
  const countsById = useMemo(() => {
    const map = new Map<string, Counts>();
    for (const group of groups) {
      for (const id of group.classIds) {
        const ranges = dataService.getRangeCountsByType(id);
        map.set(id, {
          props: dataService.getSlotCount(id),
          cls: ranges.cls,
          enm: ranges.enm,
          typ: ranges.typ,
          vars: dataService.getVariableCount(id),
        });
      }
    }
    return map;
  }, [groups, dataService]);

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
      <div className="flex items-baseline gap-2 px-3 py-2 border-b border-gray-200 dark:border-slate-700">
        <span className="font-semibold flex-1">
          {dataService.getConceptLabel('entity', true)} ({total})
        </span>
        {/* Column key for the per-row badges — the rows are too narrow for a
            real <thead>, so the legend carries the headers and tooltips. */}
        <span className="flex items-center gap-1 text-[10px] uppercase tracking-wide shrink-0">
          <span className="text-gray-500" title={col.props.tip}>{col.props.header}</span>
          <span className="text-blue-500" title={col.cls.tip}>{col.cls.header}</span>
          <span className="text-purple-500" title={col.enm.tip}>{col.enm.header}</span>
          <span className="text-green-600" title={col.typ.tip}>{col.typ.header}</span>
          <span className="text-amber-600" title={col.vars.tip}>{col.vars.header}</span>
        </span>
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
            {!isCollapsed && group.roots.map(node => (
              <ClassRows
                key={node.classId}
                node={node}
                depth={0}
                countsById={countsById}
                col={col}
                selectedIds={selectedIds}
                onToggle={onToggle}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}

/**
 * One class row plus its is-a subclasses, recursively.
 *
 * Subclasses are indented and marked with `↳`; a root whose is-a parent sits
 * in another category gets the same marker as a muted "↳ Parent" hint instead,
 * since it cannot be nested without duplicating that parent across categories.
 * Depth is measured (2026-08-27) to reach 1, so indentation stays linear.
 */
function ClassRows({
  node,
  depth,
  countsById,
  col,
  selectedIds,
  onToggle,
}: {
  node: CategoryTreeNode;
  depth: number;
  countsById: Map<string, Counts>;
  col: ReturnType<DataService['getEntityColumns']>;
  selectedIds: Set<string>;
  onToggle: (classId: string) => void;
}) {
  const { classId } = node;
  const counts = countsById.get(classId);
  return (
    <>
      <label
        data-class-row={classId}
        className={`flex items-center gap-2 pr-3 py-1 cursor-pointer
                    hover:bg-blue-50 dark:hover:bg-slate-800
                    ${selectedIds.has(classId) ? 'bg-blue-50 dark:bg-slate-800' : ''}`}
        style={{ paddingLeft: `${0.75 + depth * 1}rem` }}
      >
        <input
          type="checkbox"
          checked={selectedIds.has(classId)}
          onChange={() => onToggle(classId)}
        />
        <span className="flex-1 min-w-0 truncate">
          {depth > 0 && <span className="text-gray-300 dark:text-slate-600 mr-1">↳</span>}
          <span className="font-mono text-xs">{classId}</span>
          {node.outOfCategoryParent && (
            <span
              className="ml-1 text-[10px] text-gray-400 dark:text-slate-500"
              title={`Extends ${node.outOfCategoryParent}, which is in another category`}
            >
              ↳ {node.outOfCategoryParent}
            </span>
          )}
        </span>
        {counts && (
          <span className="flex items-center gap-1 shrink-0 tabular-nums">
            <CountBadge n={counts.props} title={col.props.tip} className="text-gray-500" />
            <CountBadge n={counts.cls} title={col.cls.tip} className="text-blue-500" />
            <CountBadge n={counts.enm} title={col.enm.tip} className="text-purple-500" />
            <CountBadge n={counts.typ} title={col.typ.tip} className="text-green-600" />
            <CountBadge n={counts.vars} title={col.vars.tip} className="text-amber-600" />
          </span>
        )}
      </label>
      {node.children.map(child => (
        <ClassRows
          key={child.classId}
          node={child}
          depth={depth + 1}
          countsById={countsById}
          col={col}
          selectedIds={selectedIds}
          onToggle={onToggle}
        />
      ))}
    </>
  );
}

/**
 * One count cell. Zero renders as a muted dash rather than "0" so the eye
 * lands on entities that actually have something of that kind.
 */
function CountBadge({ n, title, className }: { n: number; title: string; className: string }) {
  return (
    <span
      title={title}
      data-count-badge=""
      className={`w-5 text-right text-[11px] ${n === 0 ? 'text-gray-300 dark:text-slate-600' : className}`}
    >
      {n === 0 ? '·' : n}
    </span>
  );
}
