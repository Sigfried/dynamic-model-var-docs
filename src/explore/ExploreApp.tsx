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
import SelectionTree from './SelectionTree';
import OwnershipGraphView from './OwnershipGraphView';
import DetailDrawer from './DetailDrawer';
import ExampleCasesPane from './ExampleCasesPane';
import type { ExampleCase } from './exampleCases';
import { HelpProvider } from '../help/HelpProvider';
import { useHelp } from '../help/helpContext';
import HelpLayer from '../help/HelpLayer';
import { helpResolvers } from './helpResolvers';
import helpMarkdown from '../help/help-content.md?raw';

import {
  readExploreState, writeExploreState, buildShareURL,
  type Direction, type MergeMode, type OwnerScope,
} from './exploreState';

/**
 * Applying a tour step's `State:` query. The help package has no idea how this
 * app stores its state, so it hands the query string back and we translate it
 * into the same setters a click would use -- reusing readExploreState so a
 * step's query is validated exactly like a link's.
 */
function ExploreAppInner() {
  const { modelData, loading, error } = useModelData();
  // Tells the tour the viewer changed the app themselves; see the URL-writing
  // effect below. A no-op outside a tour.
  const { noteViewerEdit } = useHelp();
  const dataService = useMemo(
    () => (modelData ? new DataService(modelData) : null),
    [modelData],
  );

  // One read at mount resolves URL > stored preference > default for every
  // piece of shareable state, so no two useStates can disagree about it.
  const initial = useMemo(() => readExploreState(), []);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set(initial.sel));
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set(initial.exp));
  const [detailId, setDetailId] = useState<string | null>(initial.detail);
  const [tableCollapsed, setTableCollapsed] = useState(false);
  /**
   * 'list' is the default selector: the category list, nested by inheritance.
   * 'tree' is the dag-browser, kept reachable but no longer default — Siggie
   * 2026-08-27 deferred fixing it (it needs horizontal scroll and panel resize
   * before it can even be evaluated) rather than dropping it.
   */
  const [selectorMode, setSelectorMode] = useState<'tree' | 'list'>('list');
  const [pathToRoot, setPathToRoot] = useState<boolean>(initial.roots);
  /**
   * Toolbar settings, lifted out of OwnershipGraphView. They used to live in
   * localStorage only, so a shared link reproduced the selection and then drew
   * it with the RECIPIENT's settings -- a link showing off the sibling merge
   * looked, to a first-time visitor, like the feature did not exist.
   */
  const [mergeSibs, setMergeSibs] = useState<boolean>(initial.sibs);
  const [direction, setDirection] = useState<Direction>(initial.dir);
  const [mergeMode, setMergeMode] = useState<MergeMode>(initial.merge);
  const [ownerScope, setOwnerScope] = useState<OwnerScope>(initial.owners);
  const [casesOpen, setCasesOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  /**
   * Owners dismissed by clicking a lit `owned by` chip. Separate from
   * `expandedIds` because a capped-in owner was never expanded — there is no
   * expansion to remove, only a dismissal to record.
   */
  const [hiddenOwnerIds, setHiddenOwnerIds] = useState<Set<string>>(
    () => new Set(initial.hidden),
  );

  /*
   * Applying a case replaces every piece of graph state at once.
   *
   * This used to carry a warning that it was deliberately NOT a navigation,
   * "because the merge mode lives in localStorage and is read once at mount,
   * so a reload would reset the very thing being compared". **That constraint
   * is gone (2026-08-26):** the toolbar settings are URL state now, so a case
   * CAN be expressed as a plain link — which is most of what the guided tour
   * needs. Left as a state update for now because the cases do not yet say
   * which settings they depend on; giving ExampleCase optional sibs/dir/merge/
   * owners fields is the next step, and then a case is just a share URL.
   */
  const applyCase = useCallback((c: ExampleCase) => {
    setSelectedIds(new Set(c.sel));
    setExpandedIds(new Set(c.exp ?? []));
    setPathToRoot(!!c.roots);
    setHiddenOwnerIds(new Set());
    setDetailId(null);
  }, []);

  // Expansions only mean something relative to a selection — with nothing
  // selected the canvas shows its empty state, so keeping ?exp= would strand
  // ids that are invisible and never dismissable.
  useEffect(() => {
    if (selectedIds.size === 0 && expandedIds.size > 0) setExpandedIds(new Set());
  }, [selectedIds, expandedIds]);

  // Same reasoning for dismissals: with nothing selected there is no canvas to
  // have dismissed anything from, so a stale ?hidden= would silently suppress
  // owners on the next selection.
  useEffect(() => {
    if (selectedIds.size === 0 && hiddenOwnerIds.size > 0) setHiddenOwnerIds(new Set());
  }, [selectedIds, hiddenOwnerIds]);

  /**
   * A tour step writes its `State:` query to the URL and fires this event;
   * we re-read it through the SAME parser a link uses. One code path for
   * "put the app into this state", whether it came from a link or a step.
   */
  useEffect(() => {
    const apply = () => {
      const next = readExploreState();
      setSelectedIds(new Set(next.sel));
      setExpandedIds(new Set(next.exp));
      setHiddenOwnerIds(new Set(next.hidden));
      setDetailId(next.detail);
      setPathToRoot(next.roots);
      setMergeSibs(next.sibs);
      setDirection(next.dir);
      setMergeMode(next.merge);
      setOwnerScope(next.owners);
    };
    window.addEventListener('explore:state-from-url', apply);
    return () => window.removeEventListener('explore:state-from-url', apply);
  }, []);

  /*
   * Single writer for the URL — and, during a tour, the signal that the viewer
   * changed something themselves.
   *
   * `noteViewerEdit` reads the state back and ignores anything equal to what
   * the tour just applied, so the step's own write does not count as an edit;
   * only a click of the viewer's does. That is what puts the "your changes will
   * be discarded" line in the popover, and only when there is something to
   * discard.
   */
  useEffect(() => {
    writeExploreState({
      sel: [...selectedIds], exp: [...expandedIds], hidden: [...hiddenOwnerIds],
      detail: detailId, roots: pathToRoot,
      sibs: mergeSibs, dir: direction, merge: mergeMode, owners: ownerScope,
    });
    noteViewerEdit();
  }, [selectedIds, expandedIds, detailId, pathToRoot, hiddenOwnerIds,
      mergeSibs, direction, mergeMode, ownerScope, noteViewerEdit]);

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

  const expand = useCallback((id: string) => {
    setExpandedIds(prev => (prev.has(id) ? prev : new Set(prev).add(id)));
    // An explicit request outranks an earlier dismissal. Without this, clicking
    // a dismissed owner's chip would add an expansion the suppression set then
    // immediately filtered back out, and the chip would look broken.
    setHiddenOwnerIds(prev => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  /**
   * Dismiss a DRAWN owner. Records a suppression rather than removing an
   * expansion, since a capped-in owner has none; also drops any expansion so
   * an owner that was both expanded and capped-in actually disappears.
   */
  const hideOwner = useCallback((id: string) => {
    setHiddenOwnerIds(prev => (prev.has(id) ? prev : new Set(prev).add(id)));
    setExpandedIds(prev => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);
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
    // Dismissals are per-canvas. Left behind, they would silently suppress
    // owners on the next selection with no visible cause.
    setHiddenOwnerIds(new Set());
    // Toolbar settings are deliberately NOT reset: they are how this user
    // prefers to read the diagram, not part of the view being cleared.
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
    <div className="relative flex flex-col h-screen bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100">
      <header className="flex items-center justify-between px-4 py-2 bg-blue-600 text-white shrink-0">
        <div>
          <h1
            data-help-id="app-title"
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
        <div className="flex items-center gap-4">
        <button
          onClick={async () => {
            const url = buildShareURL({
              sel: [...selectedIds], exp: [...expandedIds],
              hidden: [...hiddenOwnerIds], detail: detailId, roots: pathToRoot,
              sibs: mergeSibs, dir: direction, merge: mergeMode, owners: ownerScope,
            });
            try {
              await navigator.clipboard.writeText(url);
              setCopied(true);
              window.setTimeout(() => setCopied(false), 1500);
            } catch {
              // Clipboard needs a secure context and permission; if it is
              // refused the URL bar already holds the same state, so say so
              // rather than failing silently.
              setCopied(false);
              window.prompt('Copy this link:', url);
            }
          }}
          data-help-id="copy-link"
          className="text-sm underline text-blue-100 hover:text-white"
          title="Copy a link that reproduces exactly this view, settings included"
        >
          {copied ? '✓ copied' : 'copy link'}
        </button>
        <HelpButton />
        <button
          data-help-id="example-cases"
          onClick={() => setCasesOpen(v => !v)}
          className={`text-sm underline hover:text-white ${casesOpen ? 'text-white' : 'text-blue-100'}`}
          title="Named selections for comparing edge routing"
        >
          example cases
        </button>
        <a
          href={`${import.meta.env.BASE_URL}previous.html`}
          className="text-sm underline text-blue-100 hover:text-white"
        >
          previous views
        </a>
        </div>
      </header>

      {casesOpen && (
        <ExampleCasesPane
          onClose={() => setCasesOpen(false)}
          onApply={applyCase}
          selectedIds={selectedIds}
          dataService={dataService}
        />
      )}

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
          // w-80 is sized to the longest class id (QuestionnaireResponseValue-
          // TimePoint, 35 chars) at depth-1 indent. Narrowed from w-96 on
          // 2026-08-27 once the count columns came out of SelectionTable: the
          // panel is a name list now, so it only needs to fit the widest name.
          <div className="w-80 shrink-0 flex flex-col min-h-0 border-r border-gray-200 dark:border-slate-700">
            <div className="flex-1 overflow-y-auto min-h-0" data-help-id="selection-tree">
              {selectorMode === 'tree' ? (
                <SelectionTree
                  dataService={dataService}
                  selectedIds={selectedIds}
                  onToggle={toggleSelect}
                  onShowDetail={setDetailId}
                />
              ) : (
                <SelectionTable
                  dataService={dataService}
                  selectedIds={selectedIds}
                  onToggle={toggleSelect}
                />
              )}
            </div>
            {/*
              The category list is now the default; the DAG tree stays behind
              this switch for after the deadline. Reversed 2026-08-27: the
              tree was going to replace the list, but it needs horizontal
              scroll + panel resize before it can be judged, and there is no
              runway for that. Do not delete the tree -- the decision is
              "deferred", not "dropped".
            */}
            <button
              onClick={() => setSelectorMode(m => (m === 'tree' ? 'list' : 'tree'))}
              title="Switch between the ownership tree and the flat category list"
              className="shrink-0 px-3 py-1 text-xs text-gray-400 border-t border-gray-200
                         dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 text-left"
            >
              {selectorMode === 'tree' ? '☰ flat list' : '⑃ tree'}
            </button>
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
        <div className="flex-1 min-w-0" data-help-id="graph-canvas">
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
              onHideOwner={hideOwner}
              onDeselect={toggleSelect}
              hiddenOwnerIds={hiddenOwnerIds}
              pathToRoot={pathToRoot}
              onTogglePathToRoot={() => setPathToRoot(v => !v)}
              direction={direction}
              setDirection={setDirection}
              mergeMode={mergeMode}
              setMergeMode={setMergeMode}
              mergeSibs={mergeSibs}
              setMergeSibs={setMergeSibs}
              ownerScope={ownerScope}
              setOwnerScope={setOwnerScope}
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

/**
 * The two halves of the tour's state bridge.
 *
 * The provider must wrap the app (it owns help/tour state), but it knows
 * nothing about how this app stores its own state -- so the app supplies the
 * pair below and the provider calls them. They are module-level rather than
 * bound to ExploreAppInner because both go through the URL, which is
 * authoritative for every piece of shareable state; neither needs a setter.
 */

/**
 * Put the app into a state given as a query string.
 *
 * A step's `State:` is the same vocabulary as a share link, so it is applied by
 * writing it to the URL and letting the app re-read it. That keeps ONE parser
 * for both, instead of a second code path that can drift from the first.
 */
function applyExploreQuery(query: string): void {
  const url = new URL(window.location.href);
  url.search = query;
  window.history.replaceState(null, '', url);
  window.dispatchEvent(new Event('explore:state-from-url'));
}

/**
 * Read the app's state back out as a query string — the inverse of
 * `applyExploreQuery`, and the reason the tour can restore what the viewer had.
 *
 * The URL is authoritative: `ExploreAppInner` writes the whole state to it on
 * every change through `writeExploreState`, so reading `location.search` is
 * reading the live state, not a stale copy.
 */
function readExploreQuery(): string {
  return window.location.search.replace(/^\?/, '');
}

export default function ExploreApp() {
  return (
    <HelpProvider
      markdown={helpMarkdown}
      onApplyState={applyExploreQuery}
      onReadState={readExploreQuery}
      /* Resolvers for the row-level anchor kinds. They live here, not in
         src/help/, because knowing what a dmvd entity row is is exactly what
         the extractable package must not know. */
      resolvers={helpResolvers}
    >
      <ExploreAppInner />
      <HelpLayer />
    </HelpProvider>
  );
}

/**
 * Entry point for both modes. Separate component because it needs useHelp(),
 * which is only available inside the provider.
 */
function HelpButton() {
  const { helpMode, toggleHelpMode, startTour } = useHelp();
  return (
    <span className="flex items-center gap-2" data-help-id="help-button">
      <button
        onClick={startTour}
        className="text-sm underline text-blue-100 hover:text-white"
        title="A short guided walk through the app"
      >
        take the tour
      </button>
      <button
        onClick={toggleHelpMode}
        className={`text-sm underline hover:text-white ${helpMode ? 'text-white font-semibold' : 'text-blue-100'}`}
        title="Show a dot on everything that has help (press ? anywhere)"
      >
        {helpMode ? '✓ help mode' : 'help'}
      </button>
    </span>
  );
}
