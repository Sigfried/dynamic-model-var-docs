/**
 * SelectionTree — the ownership DAG as the Explore selector, replacing the
 * flat category checkbox list (SelectionTable).
 *
 * Siggie, 2026-08-26: "dag-browser-widget instead of current checkbox list --
 * ok to lose the attr counts but need a selection mechanism that doesn't
 * interfere with widget controls, expand/collapse etc."
 *
 * **How selection stays out of the widget's way.** The widget owns nesting,
 * expand/collapse, polyhierarchy and cycle handling, and it is explicit that it
 * does NOT own what "selected" means:
 *
 *   "The widget does NOT own the meaning of 'selected' or its highlight
 *    styling — do that in renderRow."                      (DagBrowserProps)
 *
 * So the whole selection affordance lives inside `renderRow`, and the widget's
 * own controls are untouched. Two rules keep them from competing:
 *
 *  1. **The checkbox is the only selection target.** Clicking the row body does
 *     NOT select — that keeps the row free for the widget's chevron and its
 *     cross-reference links ("★ also under …", "⟲ loops back to …"). A row that
 *     both selects and expands is the interference Siggie warned about.
 *  2. **Clicks on our controls stop propagating**, so a checkbox click can
 *     never reach a row handler and toggle expansion as a side effect.
 *
 * The counts are kept (they were offered as expendable but cost one call
 * each), minus the per-category totals that only made sense in a flat list.
 *
 * `selected` is still passed to the widget: it opens the path to each selected
 * node and offers a "reveal at" breadcrumb when one is collapsed off-screen —
 * navigation help that does not imply ownership of the selection itself.
 */

import { useMemo } from 'react';
import { DagBrowser } from 'dag-browser-widget';
import 'dag-browser-widget/styles.css';
import './selectionTree.css';
import type { DataService } from '../services/DataService';

interface SelectionTreeProps {
  dataService: DataService;
  selectedIds: Set<string>;
  onToggle: (classId: string) => void;
  /** Reveal a class in the detail drawer without changing the selection. */
  onShowDetail?: (classId: string) => void;
}

export default function SelectionTree({
  dataService, selectedIds, onToggle, onShowDetail,
}: SelectionTreeProps) {
  // The whole graph, so every class is reachable by walking the tree rather
  // than only the ones a category happened to list.
  const nodes = useMemo(() => dataService.getContainmentNodes(), [dataService]);
  const col = useMemo(() => dataService.getEntityColumns(), [dataService]);

  const counts = useMemo(() => {
    const map = new Map<string, { props: number; cls: number; vars: number }>();
    for (const n of nodes) {
      const ranges = dataService.getRangeCountsByType(n.id);
      map.set(n.id, {
        props: dataService.getSlotCount(n.id),
        cls: ranges.cls,
        vars: dataService.getVariableCount(n.id),
      });
    }
    return map;
  }, [nodes, dataService]);

  return (
    <div className="text-sm selection-tree">
      <div className="flex items-baseline gap-2 px-3 py-2 border-b border-gray-200 dark:border-slate-700">
        <span className="font-semibold flex-1">
          {dataService.getConceptLabel('entity', true)} ({nodes.length})
        </span>
        <span className="flex items-center gap-1 text-[10px] uppercase tracking-wide shrink-0">
          <span className="text-gray-500" title={col.props.tip}>{col.props.header}</span>
          <span className="text-blue-500" title={col.cls.tip}>{col.cls.header}</span>
          <span className="text-amber-600" title={col.vars.tip}>{col.vars.header}</span>
        </span>
      </div>

      <DagBrowser
        nodes={nodes}
        selected={[...selectedIds]}
        // "try populating it with the whole graph, all collapsed to start"
        levelsExpanded={0}
        renderRow={({ node, isSelected }) => {
          const c = counts.get(node.id);
          return (
            <span
              /* Names the row so the tour can ring it (`entity-row:<Entity>`).
                 The DagBrowser widget's own row wrapper carries no node id, and
                 this span is the only host-controlled element in the row — the
                 resolver walks up to `.dbw-row` from here for the full-width
                 rect. See `entityRowResolvers` in help/resolvers.ts. */
              data-entity-row={node.id}
              className={`flex items-center gap-2 flex-1 min-w-0 px-1 rounded
                          ${isSelected ? 'bg-blue-100 dark:bg-sky-900/50' : ''}`}
            >
              {/* The ONLY selection target. Kept off the row body so the row
                  stays available to the widget's own controls. */}
              <input
                type="checkbox"
                checked={isSelected}
                title={`${isSelected ? 'Remove' : 'Add'} ${node.id} ${isSelected ? 'from' : 'to'} the canvas`}
                onClick={ev => ev.stopPropagation()}
                onChange={ev => { ev.stopPropagation(); onToggle(node.id); }}
              />
              <button
                type="button"
                title={`Show details for ${node.id}`}
                onClick={ev => { ev.stopPropagation(); onShowDetail?.(node.id); }}
                className={`font-mono text-xs flex-1 min-w-0 truncate text-left
                            hover:underline ${isSelected ? 'font-semibold' : ''}`}
              >
                {node.name ?? node.id}
              </button>
              {c && (
                <span className="flex items-center gap-1 shrink-0 tabular-nums">
                  <CountBadge n={c.props} title={col.props.tip} className="text-gray-500" />
                  <CountBadge n={c.cls} title={col.cls.tip} className="text-blue-500" />
                  <CountBadge n={c.vars} title={col.vars.tip} className="text-amber-600" />
                </span>
              )}
            </span>
          );
        }}
      />
    </div>
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
