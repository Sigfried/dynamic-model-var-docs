/**
 * ExploreApp — shell for the Explorer SPA (docs/EXPLORE_VIZ.md), the default
 * app (index.html entry). The previous app lives at previous.html.
 *
 * Three regions: selection table (left, collapsible), viz canvas (main), and
 * detail drawer (right, opens on node click). Selection and the open drawer
 * are owned here and encoded in the URL (?sel=A~B~C&detail=X) so a view is
 * shareable.
 *
 * Architecture: same rules as the previous app — this file and everything
 * under src/explore/ talks to services/DataService only, never models/ or DTOs.
 * The graph-core/ engine (ported from icd11-playground's NodeLinkView) is the
 * one exception by design: it is pure layout/interaction code with zero app
 * imports (the future package-extraction boundary).
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useModelData } from '../hooks/useModelData';
import { DataService } from '../services/DataService';
import SelectionTable from './SelectionTable';
import OwnershipGraphView from './OwnershipGraphView';
import DetailDrawer from './DetailDrawer';

const SEL_PARAM = 'sel';
const DETAIL_PARAM = 'detail';
const EXP_PARAM = 'exp';
const ROOTS_PARAM = 'roots';

function readIdsFromURL(param: string): Set<string> {
  const raw = new URLSearchParams(window.location.search).get(param);
  return new Set(raw ? raw.split('~').filter(Boolean) : []);
}

function readDetailFromURL(): string | null {
  return new URLSearchParams(window.location.search).get(DETAIL_PARAM) || null;
}

/** Path-to-root is off by default; only its non-default state is in the URL. */
function readPathToRootFromURL(): boolean {
  return new URLSearchParams(window.location.search).get(ROOTS_PARAM) === '1';
}

/** Single writer for every param so they never clobber each other. */
function writeStateToURL(
  sel: Set<string>,
  expanded: Set<string>,
  detailId: string | null,
  pathToRoot: boolean,
) {
  const url = new URL(window.location.href);
  const setIds = (param: string, ids: Set<string>) => {
    if (ids.size === 0) url.searchParams.delete(param);
    else url.searchParams.set(param, [...ids].sort().join('~'));
  };
  setIds(SEL_PARAM, sel);
  setIds(EXP_PARAM, expanded);
  if (detailId) url.searchParams.set(DETAIL_PARAM, detailId);
  else url.searchParams.delete(DETAIL_PARAM);
  if (pathToRoot) url.searchParams.set(ROOTS_PARAM, '1');
  else url.searchParams.delete(ROOTS_PARAM);
  window.history.replaceState(null, '', url);
}

export default function ExploreApp() {
  const { modelData, loading, error } = useModelData();
  const dataService = useMemo(
    () => (modelData ? new DataService(modelData) : null),
    [modelData],
  );

  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => readIdsFromURL(SEL_PARAM));
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => readIdsFromURL(EXP_PARAM));
  const [detailId, setDetailId] = useState<string | null>(readDetailFromURL);
  const [tableCollapsed, setTableCollapsed] = useState(false);
  const [pathToRoot, setPathToRoot] = useState<boolean>(readPathToRootFromURL);

  // Expansions only mean something relative to a selection — with nothing
  // selected the canvas shows its empty state, so keeping ?exp= would strand
  // ids that are invisible and never dismissable.
  useEffect(() => {
    if (selectedIds.size === 0 && expandedIds.size > 0) setExpandedIds(new Set());
  }, [selectedIds, expandedIds]);

  useEffect(
    () => writeStateToURL(selectedIds, expandedIds, detailId, pathToRoot),
    [selectedIds, expandedIds, detailId, pathToRoot],
  );

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    // Selecting a class supersedes having expanded it: it becomes a first-class
    // node rather than dimmed context, and a stale id would linger in ?exp=.
    setExpandedIds(prev => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const expand = useCallback(
    (id: string) => setExpandedIds(prev => (prev.has(id) ? prev : new Set(prev).add(id))),
    [],
  );
  const collapse = useCallback(
    (id: string) =>
      setExpandedIds(prev => {
        if (!prev.has(id)) return prev;
        const next = new Set(prev);
        next.delete(id);
        return next;
      }),
    [],
  );

  // Clicking the app title clears everything back to the empty canvas, matching
  // the previous app's title-click reset. Every piece of shareable state goes:
  // selection, expansions, and the open drawer (the URL follows via the write
  // effect); the table is re-opened since a collapsed panel over an empty
  // canvas looks like breakage.
  const resetApp = useCallback(() => {
    setSelectedIds(new Set());
    setExpandedIds(new Set());
    setDetailId(null);
    setTableCollapsed(false);
    setPathToRoot(false);
  }, []);

  if (error) {
    return (
      <div className="p-8 text-red-600">
        Failed to load model data: {String(error)}
      </div>
    );
  }
  if (loading || !dataService) {
    return <div className="p-8 text-gray-400">Loading model…</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100">
      <header className="flex items-center justify-between px-4 py-2 bg-blue-600 text-white shrink-0">
        <div>
          <h1
            className="text-lg font-bold leading-tight cursor-pointer hover:opacity-80 transition-opacity"
            onClick={resetApp}
            title="Click to clear the selection and reset the view"
          >
            BDCHM Explorer
          </h1>
          <p className="text-xs text-blue-100">
            BioData Catalyst Harmonized Model
          </p>
        </div>
        <a
          href={`${import.meta.env.BASE_URL}previous.html`}
          className="text-sm underline text-blue-100 hover:text-white"
        >
          previous views
        </a>
      </header>

      <div className="flex-1 flex min-h-0">
        {/* Selection table (collapsible) */}
        {tableCollapsed ? (
          <button
            onClick={() => setTableCollapsed(false)}
            title="Show entity selection"
            className="shrink-0 w-8 border-r border-gray-200 dark:border-slate-700
                       bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700
                       flex flex-col items-center gap-2 py-2 text-gray-400"
          >
            <span className="text-xs">▶</span>
            <span className="text-[10px] uppercase tracking-wider [writing-mode:vertical-rl]">
              {dataService.getConceptLabel('entity', true)}
              {selectedIds.size > 0 ? ` (${selectedIds.size})` : ''}
            </span>
          </button>
        ) : (
          <div className="w-96 shrink-0 flex flex-col min-h-0 border-r border-gray-200 dark:border-slate-700">
            <div className="flex-1 overflow-y-auto min-h-0">
              <SelectionTable
                dataService={dataService}
                selectedIds={selectedIds}
                onToggle={toggleSelect}
              />
            </div>
            <button
              onClick={() => setTableCollapsed(true)}
              title="Hide entity selection"
              className="shrink-0 px-3 py-1 text-xs text-gray-400 border-t border-gray-200
                         dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 text-left"
            >
              ◀ Hide
            </button>
          </div>
        )}

        {/* Viz canvas — layered ownership DAG */}
        <div className="flex-1 min-w-0">
          {selectedIds.size === 0 ? (
            <div className="h-full flex items-center justify-center text-sm text-gray-400 p-8">
              Select entities on the left to build the ownership subgraph.
            </div>
          ) : (
            <OwnershipGraphView
              dataService={dataService}
              selectedIds={selectedIds}
              onNodeClick={setDetailId}
              expandedIds={expandedIds}
              onExpand={expand}
              onCollapse={collapse}
              pathToRoot={pathToRoot}
              onTogglePathToRoot={() => setPathToRoot(v => !v)}
            />
          )}
        </div>

        {/* Detail drawer — opens on node click */}
        {detailId && (
          <DetailDrawer
            classId={detailId}
            dataService={dataService}
            onClose={() => setDetailId(null)}
            onNavigate={setDetailId}
            isSelected={selectedIds.has(detailId)}
            onToggleSelect={toggleSelect}
          />
        )}
      </div>
    </div>
  );
}
