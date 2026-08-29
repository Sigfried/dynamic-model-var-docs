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
import { useHelp, HELP_MODE_ENABLED } from '../help/helpContext';
import HelpLayer from '../help/HelpLayer';
import { helpResolvers } from './helpResolvers';
import helpMarkdown from './help-content.md?raw';

import {
  readExploreState, writeExploreState, buildShareURL, readTourRequest,
  type Direction, type ExploreState, type MergeMode,
} from './exploreState';
import {
  parseTourChange, pushFrame, popFrame, composeState, viewerState, reconcile,
  EMPTY_STACK, type TourStack,
} from './tourStateStack';

/**
 * Applying a tour step's `State:` query. The help package has no idea how this
 * app stores its state, so it hands the query string back and we translate it
 * into the same setters a click would use -- reusing readExploreState so a
 * step's query is validated exactly like a link's.
 */
function ExploreAppInner() {
  const { modelData, loading, error } = useModelData();
  const dataService = useMemo(
    () => (modelData ? new DataService(modelData) : null),
    [modelData],
  );

  // One read at mount resolves URL > stored preference > default for every
  // piece of shareable state, so no two useStates can disagree about it.
  const initial = useMemo(() => readExploreState(), []);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set(initial.sel));
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
  const [casesOpen, setCasesOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  /*
   * Applying a case replaces every piece of graph state at once.
   *
   * This used to carry a warning that it was deliberately NOT a navigation,
   * "because the merge mode lives in localStorage and is read once at mount,
   * so a reload would reset the very thing being compared". **That constraint
   * is gone (2026-08-26):** the toolbar settings are URL state now, so a case
   * CAN be expressed as a plain link — which is most of what the guided tour
   * needs. Left as a state update for now because the cases do not yet say
   * which settings they depend on; giving ExampleCase optional sibs/dir/merge
   * fields is the next step, and then a case is just a share URL.
   */
  const applyCase = useCallback((c: ExampleCase) => {
    setSelectedIds(new Set(c.sel));
    setPathToRoot(!!c.roots);
    setDetailId(null);
  }, []);

  /**
   * A tour step writes its `State:` query to the URL and fires this event;
   * we re-read it through the SAME parser a link uses. One code path for
   * "put the app into this state", whether it came from a link or a step.
   */
  useEffect(() => {
    const apply = () => {
      const next = readExploreState();
      setSelectedIds(new Set(next.sel));
      setDetailId(next.detail);
      setPathToRoot(next.roots);
      setMergeSibs(next.sibs);
      setDirection(next.dir);
      setMergeMode(next.merge);
    };
    window.addEventListener('explore:state-from-url', apply);
    return () => window.removeEventListener('explore:state-from-url', apply);
  }, []);

  /*
   * Single writer for the URL — and the point where a viewer's mid-tour edit
   * is folded into the tour's stack.
   *
   * `reconcile` matters because `sel` is a SET and cannot hold the tour's copy
   * of an id beside the viewer's. When the two collide the tour yields its
   * claim, so an untick stays unticked instead of being restored by the next
   * compose, and a tick of something a step also pushed is not taken away by
   * the next pop. Outside a tour the stack is empty and this is a no-op.
   *
   * This replaced a `noteViewerEdit()` call that only set a flag, to show the
   * "your changes will be discarded" warning. Now the changes are not
   * discarded, so there is nothing to warn about and the reconciliation does
   * real work instead.
   */
  useEffect(() => {
    const state: ExploreState = {
      sel: [...selectedIds], detail: detailId, roots: pathToRoot,
      sibs: mergeSibs, dir: direction, merge: mergeMode,
    };
    writeExploreState(state);
    // Only unticks are detectable here; ticks announce themselves through
    // `claimForViewer` at the click, for the reason given there.
    setTourStack(reconcile(state, tourStack, {}).stack);
  }, [selectedIds, detailId, pathToRoot, mergeSibs, direction, mergeMode]);

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    // The viewer has spoken for this class either way, so the tour gives up its
    // claim on it. A TICK needs saying out loud like this: the tour's copy and
    // the viewer's collapse into one member of `sel`, so the click leaves no
    // trace in the state for the write effect to notice. An untick is
    // self-evident there and needs no help.
    claimForViewer(id);
  }, []);

  /**
   * Put a class on the canvas from a diagram affordance — an attribute row or
   * a relation-menu item.
   *
   * **Expanding IS selecting** (Siggie, 2026-08-27). There used to be a second
   * `expandedIds` set for classes pulled in this way, distinct from the
   * selection and from the owners drawn automatically by the cap, so a class
   * could be on the canvas for three different reasons and every removal path
   * had to try all three. Ticking the checkbox instead makes the left panel's
   * checkboxes the single record of what is drawn — note it may be scrolled
   * out of view when the click came from the diagram.
   */
  const addToCanvas = useCallback((id: string) => {
    setSelectedIds(prev => (prev.has(id) ? prev : new Set(prev).add(id)));
    claimForViewer(id);   // same reasoning as toggleSelect
  }, []);

  const removeFromCanvas = useCallback(
    (id: string) => setSelectedIds(prev => {
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
    setDetailId(null);
    setTableCollapsed(false);
    setPathToRoot(false);
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
        <HelpButton />
        <button
          data-help-id="example-cases"
          onClick={() => setCasesOpen(v => !v)}
          className={`text-sm underline hover:text-white ${casesOpen ? 'text-white' : 'text-blue-100'}`}
          title="Named selections for comparing edge routing"
        >
          example cases
        </button>
        <button
          onClick={async () => {
            const url = buildShareURL({
              sel: [...selectedIds], detail: detailId, roots: pathToRoot,
              sibs: mergeSibs, dir: direction, merge: mergeMode,
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
              onAdd={addToCanvas}
              onRemove={removeFromCanvas}
              pathToRoot={pathToRoot}
              onTogglePathToRoot={() => setPathToRoot(v => !v)}
              direction={direction}
              setDirection={setDirection}
              mergeMode={mergeMode}
              setMergeMode={setMergeMode}
              mergeSibs={mergeSibs}
              setMergeSibs={setMergeSibs}
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
 * The tour's state bridge: push a step's `Change:`, pop it on `back`.
 *
 * The provider must wrap the app (it owns help/tour state) but knows nothing
 * about how this app stores its own -- so the app supplies the pair below and
 * the provider calls them. They are module-level rather than bound to
 * `ExploreAppInner` because both go through the URL, which is authoritative for
 * every piece of shareable state; neither needs a setter.
 *
 * **What replaced what.** This used to be `onApplyState`/`onReadState`: a step
 * carried a FULL absolute query, `url.search = query` replaced everything, and
 * the tour snapshotted the viewer's state on entry to put it back on exit.
 * Under the stack a step declares only what it ADDS, so nothing is overwritten
 * and there is nothing to restore -- see `tourStateStack.ts` for the model and
 * why the duplicate push matters.
 */

/**
 * The tour's live contribution. Module-level for the same reason the functions
 * are: it belongs to the URL bridge, not to a React subtree, and both halves of
 * the bridge plus the viewer-edit reconciliation have to see the same one.
 */
let tourStack: TourStack = EMPTY_STACK;

/** Replace the stack after a viewer edit has been folded into it. */
function setTourStack(next: TourStack): void {
  tourStack = next;
}

/**
 * The viewer clicked a class on or off: the tour gives up its claim on it.
 *
 * Only a TICK needs reporting this way. The tour's copy and the viewer's
 * collapse into one member of `sel`, so a tick of something a step already
 * pushed leaves no trace in the state — without this the next pop would take
 * it away under them. An untick IS visible in the state, and the write effect
 * catches it.
 */
function claimForViewer(id: string): void {
  tourStack = reconcile(
    readExploreState(), tourStack, { ticked: [id] },
  ).stack;
}

/** Push the composed result to the URL and let the app re-read it. */
function publish(state: ExploreState): void {
  writeExploreState(state);
  window.dispatchEvent(new Event('explore:state-from-url'));
}

/**
 * Push a position's `Change:` onto the stack.
 *
 * The delta is composed ON TOP of the live state rather than replacing it, so
 * a field the step does not name keeps whatever the viewer had. That is the
 * bug this whole change exists to fix: Siggie had a non-default setting and
 * every step with a `State:` silently reset it, because no step wrote that
 * param.
 */
function pushTourChange(query: string): void {
  // Split the viewer's half off against the stack as it stands BEFORE the
  // push. Doing it after would subtract the ids this very step is adding, so a
  // class the viewer already had ticked would be counted as the tour's — the
  // exact ownership confusion the duplicate push exists to prevent.
  const viewer = viewerState(readExploreState(), tourStack);
  tourStack = pushFrame(tourStack, parseTourChange(query));
  publish(composeState(viewer, tourStack));
}

/**
 * Pop one frame. Called once per `back`, and once per remaining frame when the
 * tour ends by any exit.
 *
 * The viewer's half is recovered from the LIVE state before the pop, not from
 * anything remembered: what is selected and not held by the stack is theirs,
 * including anything they ticked mid-tour.
 */
function popTourChange(): void {
  const viewer = viewerState(readExploreState(), tourStack);
  tourStack = popFrame(tourStack);
  publish(composeState(viewer, tourStack));
}

export default function ExploreApp() {
  return (
    <HelpProvider
      markdown={helpMarkdown}
      onPushChange={pushTourChange}
      onPopChange={popTourChange}
      /* Resolvers for the row-level anchor kinds. They live here, not in
         src/help/, because knowing what a dmvd entity row is is exactly what
         the extractable package must not know. */
      resolvers={helpResolvers}
      /* NO `centerOn`: unanchored steps centre on the VIEWPORT, both axes.
         It was `centerOn="graph-canvas"` — the intro popover, centred on the
         window, sat half over the left panel it was describing. That fixed
         the overlap and traded it for a worse one: `popoverPosition` can only
         centre HORIZONTALLY on a region (the popover's height is unknown at
         placement time, so the vertical stays on the viewport midline), so a
         region-centred popover is off-centre on one axis and not the other.
         Siggie, 2026-08-29: "i think the off-window-center placement is
         bugging me more ... vertical should center on the viewport also, but
         i don't care if it centers on the graph panel."

         The PROP STAYS in the package — this is dmvd declining to use it, not
         the capability going away. Pass a region name here to get it back. */
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

  /*
   * `?tour=1` opens the tour on arrival, for a link that drops someone
   * straight into it (Siggie, 2026-08-28).
   *
   * Read in a `useState` initialiser, which runs during the first RENDER --
   * before any effect, and so before `writeExploreState` strips the param
   * (it has to strip it; see ONE_SHOT_PARAMS). Reading it in the effect itself
   * would race that write, and reading it at module load would bind the answer
   * to import time, which is wrong for anything that navigates.
   *
   * Fires once: the ref survives the StrictMode double-invoke, and since the
   * param is gone by then a reload does NOT restart the tour -- following the
   * link again is what asks for it.
   */
  useEffect(() => {
    if (readTourRequest()) startTour();
    // Mount only. `readTourRequest` LATCHES its answer on the first call, so
    // it does not matter that the param has been stripped from the URL by
    // now -- and a reload does not restart the tour, since the link is what
    // puts the param back. `startTour` copes with being called before the
    // help content has parsed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <span className="flex items-center gap-2" data-help-id="help-button">
      {/*
        NOT another underlined blue link. It was one of five identical ones in
        this header, which is the whole reason it read as chrome rather than as
        the way in: a first-time viewer has no reason to pick it out of `copy
        link`, `example cases` and the rest. A filled pill is the one thing in
        the bar that does not look like the others.
      */}
      <button
        onClick={startTour}
        className="text-sm font-semibold px-2.5 py-1 rounded-full bg-white/95 text-blue-700 shadow-sm hover:bg-white hover:shadow"
        title="A short guided walk through the app (press ? anywhere)"
      >
        take the tour
      </button>
      {/*
        The help-mode toggle is hidden while HELP_MODE_ENABLED is false — it
        was the only way in, and the mode is off pending the fixes listed in
        docs/HELP_PACKAGE_PLAN.md. Kept rather than deleted so turning the
        flag back on restores the button with it.
      */}
      {HELP_MODE_ENABLED && (
        <button
          onClick={toggleHelpMode}
          className={`text-sm underline hover:text-white ${helpMode ? 'text-white font-semibold' : 'text-blue-100'}`}
          title="Show a dot on everything that has help (press ? anywhere)"
        >
          {helpMode ? '✓ help mode' : 'help'}
        </button>
      )}
    </span>
  );
}
