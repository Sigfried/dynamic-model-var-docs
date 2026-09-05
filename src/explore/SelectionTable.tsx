/**
 * SelectionTable — category-grouped entity multi-select for the Explore SPA.
 *
 * Category headers + checkbox rows. The five count badges the Explorer's
 * entity table shows (Props / Cls / Enm / Typ / Vars) were REMOVED here on
 * 2026-08-27: in a panel whose job is finding an entity by name, five
 * always-on numeric columns cost ~120px of the name column while three of
 * them read mostly "·". The counts still live in the Explorer's entity table
 * and the detail panel; see WORKLOG.md for the full reasoning.
 *
 * Within a category, classes nest by inheritance (`getCategoryTrees()`).
 * Nesting is presentation only — the selection contract is unchanged:
 * `selectedIds` + `onToggle(classId)`, one checkbox per class, no cascade from
 * a parent to its subclasses. `Entity` never appears: it is uncategorized by
 * design (entityCategories.ts, UNCATEGORIZED_BY_DESIGN), so the classes that
 * extend it are category roots.
 *
 * Each header also carries a CONTENT VIEW control (`⊞`) that replaces the
 * canvas with that category's members plus its pins — the "what does this part
 * of the model contain" answer the app had nowhere else. See
 * `docs/TOURS_AND_CONTENT.md` §1 and `EntityCategory.pins`.
 */

import { useMemo, useState } from 'react';
import type { CategoryTreeNode, DataService } from '../services/DataService';
import { categoryView } from '../config/categoryView';

interface SelectionTableProps {
  dataService: DataService;
  selectedIds: Set<string>;
  onToggle: (classId: string) => void;
  /**
   * Draw a category's content view: REPLACE the canvas with that category's
   * members plus its pins. Optional so the component still renders in tests
   * and in any host that has no canvas to replace.
   */
  onShowCategory?: (classIds: string[]) => void;
}

export default function SelectionTable({
  dataService, selectedIds, onToggle, onShowCategory,
}: SelectionTableProps) {
  const groups = useMemo(() => dataService.getCategoryTrees(), [dataService]);
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
      <div className="flex items-baseline gap-2 px-3 py-2 border-b border-gray-200 dark:border-slate-700">
        <span className="font-semibold flex-1">
          {dataService.getConceptLabel('entity', true)} ({total})
        </span>
      </div>
      {groups.map(group => {
        const isCollapsed = collapsed.has(group.id);
        const selectedInGroup = group.classIds.filter(id => selectedIds.has(id)).length;
        return (
          <div key={group.id}>
            {/*
              Two controls, deliberately separate buttons rather than one
              header button with a nested control (invalid HTML, and the
              nested click would have to fight its way out of the parent's
              handler). The row is the flex container; each button owns only
              what it is for.
            */}
            <div
              className="w-full flex items-stretch font-medium
                         bg-gray-50 dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700"
            >
              <button
                type="button"
                onClick={() => toggleCategory(group.id)}
                className="flex-1 min-w-0 flex items-center gap-2 px-3 py-1.5 text-left
                           hover:bg-gray-100 dark:hover:bg-slate-700"
              >
                <span className="text-xs text-gray-400">{isCollapsed ? '▶' : '▼'}</span>
                <span className="flex-1 truncate">{group.label}</span>
                {/* Selected-of-total only, and only once something in this group
                    is selected. The bare category total was dropped 2026-08-27
                    (SG): it is a fact about the model, not about the task, and
                    the rows are right there to count. The selected count earns
                    its place — it is the only way to see where selections live
                    when a group is collapsed. */}
                {selectedInGroup > 0 && (
                  <span className="text-xs text-gray-400">
                    {selectedInGroup} / {group.classIds.length}
                  </span>
                )}
              </button>
              {/*
                The content view. NOT the `▶` the plan drafted: that glyph is
                already the collapsed-chevron one column to the left, and two
                `▶`s on one row meaning different things is the collision the
                draft did not know about (SelectionTable predates it). `⊞`
                reads as "put this on the canvas", which is what it does.
              */}
              {onShowCategory && (
                <button
                  type="button"
                  data-show-category={group.id}
                  title={`Draw the ${group.label} content view — replaces the canvas`}
                  onClick={() => onShowCategory(categoryView(group))}
                  className="px-2.5 shrink-0 text-gray-400 border-l border-gray-100
                             dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700
                             hover:text-blue-600 dark:hover:text-sky-400"
                >
                  ⊞
                </button>
              )}
            </div>
            {!isCollapsed && group.roots.map(node => (
              <ClassRows
                key={node.classId}
                node={node}
                depth={0}
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
 * Subclasses are shown by indentation alone (a leading `↳` was redundant with
 * it, per SG 2026-08-27). A root whose is-a parent sits in another category
 * keeps a muted "↳ Parent" hint, which indentation cannot express: that parent
 * cannot be nested here without duplicating it across categories.
 * Depth is measured (2026-08-27) to reach 1, so indentation stays linear.
 */
function ClassRows({
  node,
  depth,
  selectedIds,
  onToggle,
}: {
  node: CategoryTreeNode;
  depth: number;
  selectedIds: Set<string>;
  onToggle: (classId: string) => void;
}) {
  const { classId } = node;
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
      </label>
      {node.children.map(child => (
        <ClassRows
          key={child.classId}
          node={child}
          depth={depth + 1}
          selectedIds={selectedIds}
          onToggle={onToggle}
        />
      ))}
    </>
  );
}
