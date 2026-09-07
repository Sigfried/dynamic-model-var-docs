/**
 * ExploreApp — shell for the Explorer SPA (docs/ARCHITECTURE.md), the default
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

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useModelData } from '../hooks/useModelData';
import { DataService } from '../services/DataService';
import SelectionTable from './SelectionTable';
import SelectionTree from './SelectionTree';
import OwnershipGraphView from './OwnershipGraphView';
import DetailDrawer from './DetailDrawer';
import ExampleCasesPane from './ExampleCasesPane';
import OwnershipLegend from './OwnershipLegend';
import HelpMenu from './HelpMenu';
import TourChooser from './TourChooser';
import type { ExampleCase } from './exampleCases';
import { HelpProvider } from '../help/HelpProvider';
import { useHelp, HELP_MODE_ENABLED } from '../help/helpContext';
import HelpLayer from '../help/HelpLayer';
import { helpResolvers } from './helpResolvers';
import helpMarkdown from './help-content.md?raw';
/* dmvd's popover overrides. MUST come after the HelpLayer import above, which
   is what pulls in the package's `help.css` — these rules have the same
   specificity, so source order is what decides. */
import './helpTheme.css';

import {
  readExploreState, writeExploreState, buildShareURL, readTourRequest,
  type Direction, type ExploreState, type MergeMode,
} from './exploreState';
import {
  parseTourChange, pushStep, popStep, compose, tick, untick,
  startTour as beginTour, endTour as finishTour, survivingSelection,
  NO_TOUR, type TourState,
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
   * Marks the NEXT URL write as a back-button stop (`pushState`), for an
   * action that jumps to a whole new canvas rather than adjusting the current
   * one. Set at the click; consumed by the write effect. See that effect and
   * `writeExploreState`'s `push` option.
   */
  const pushNextWrite = useRef(false);
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
  /*
   * The two help panels, independently open (2026-09-04). They used to be tabs
   * of one pane, which meant closing the legend closed the cases with it — the
   * concrete cost of treating a permanent feature and a working set as peers.
   * Both are opened from HelpMenu.
   */
  const [casesOpen, setCasesOpen] = useState(false);
  const [legendOpen, setLegendOpen] = useState(false);
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
   *
   * **The browser's back button is a third caller of that same path.** A
   * `popstate` means the address bar now holds a state this app wrote earlier,
   * which is exactly the situation `apply` exists for — so back and forward
   * cost one listener rather than a parallel implementation.
   *
   * The write effect below reacts to the setState calls `apply` makes and
   * writes the URL again. That write is a `replaceState` of the entry the
   * browser just navigated TO, with the state it already holds, so it is a
   * no-op in content and leaves the history stack alone. It must NOT be a
   * push: pushing while restoring would grow the stack on every back press
   * and the button would never reach the start.
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
    window.addEventListener('popstate', apply);
    window.addEventListener('explore:state-from-url', apply);
    return () => {
      window.removeEventListener('popstate', apply);
      window.removeEventListener('explore:state-from-url', apply);
    };
  }, []);

  /*
   * Single writer for the URL.
   *
   * It used to fold viewer edits into the tour's stack here as well, by reading
   * the resulting state: an id the tour was holding that had gone missing was
   * an untick. That inference is gone — every click reports itself through
   * `reportViewerEdit` at the moment it happens, because which of `held`,
   * `tempHeld` and `tour` gives a class up cannot be read back off a set that
   * may hold it for two of them at once.
   */
  useEffect(() => {
    const state: ExploreState = {
      sel: [...selectedIds], detail: detailId, roots: pathToRoot,
      sibs: mergeSibs, dir: direction, merge: mergeMode,
    };
    /*
     * The flag is CONSUMED here, not read: it marks one write, and this is the
     * write it marked. Leaving it set would turn the next unrelated checkbox
     * click into a history entry too.
     *
     * A ref rather than state because setting it must not itself trigger a
     * render — the render it would trigger is this very effect.
     */
    const push = pushNextWrite.current;
    pushNextWrite.current = false;
    writeExploreState(state, { push });
  }, [selectedIds, detailId, pathToRoot, mergeSibs, direction, mergeMode]);

  const toggleSelect = useCallback((id: string) => {
    /*
     * Both directions are reported to the tour, and both need saying out loud:
     * a tick of something a step also drew leaves no trace in the state, and an
     * untick does not say WHICH of the tour's three sets should give the class
     * up. Outside a tour it is a no-op.
     *
     * Read from the URL rather than from `selectedIds`, and NOT from inside the
     * updater. Depending on `selectedIds` would rebuild this callback — and
     * every row that takes it — on each selection change; reporting from inside
     * the updater would run it twice under StrictMode (main.tsx), and `untick`
     * is not idempotent: a second call takes the class out of the NEXT set
     * holding it, which is a record the viewer never spoke to.
     */
    reportViewerEdit(id, !readExploreState().sel.includes(id));
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
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
    reportViewerEdit(id, true);   // same reasoning as toggleSelect
    setSelectedIds(prev => (prev.has(id) ? prev : new Set(prev).add(id)));
  }, []);

  const removeFromCanvas = useCallback((id: string) => {
    // The mirror of `addToCanvas`, and it needs the report for the same reason:
    // the tour has to be told which set gives the class up. This path used to
    // say nothing, which was correct only while unticks were inferred from the
    // resulting state.
    reportViewerEdit(id, false);
    setSelectedIds(prev => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  /**
   * Draw a category's content view — its members plus its pins.
   *
   * **Replaces the canvas; does not add to it.** Cumulative state makes the
   * picture stop matching the label, which is the failure the tour's `Change:`
   * verb already has (help-content.md TODO: step 4 adds to step 3's canvas, so
   * the copy reads as if it were showing a clean two-box example when it is
   * not). A view named "Clinical" has to BE Clinical.
   *
   * Reported to the tour as a batch of viewer edits — a tick for every id the
   * view names, an untick for everything it drops — for the reason
   * `reportViewerEdit` gives: neither direction is legible from the resulting
   * state.
   *
   * **This is the one action that creates a history entry.** Replacing the
   * whole canvas is the only thing the viewer does that they would expect
   * `back` to undo in one press — every other change adjusts the canvas in
   * front of them, and making those history stops would mean pressing back
   * once per checkbox. The flag is consumed by the write effect.
   */
  const showCategoryView = useCallback((classIds: string[]) => {
    setSelectedIds(prev => {
      /*
       * Re-drawing the view already on screen must not push a SECOND identical
       * entry — back would then need two presses to go anywhere and would look
       * broken on the first. Returning `prev` also skips the effect entirely,
       * so the flag must not be set in that case: it would survive to make the
       * viewer's next checkbox click a history stop.
       *
       * Writing the ref inside an updater is a side effect in a function
       * StrictMode deliberately runs twice (main.tsx). Safe only because it is
       * idempotent — `true` twice is `true`, and the early return writes
       * nothing — so keep it that way if this grows.
       */
      if (prev.size === classIds.length && classIds.every(id => prev.has(id))) return prev;
      pushNextWrite.current = true;
      return new Set(classIds);
    });
    const wanted = new Set(classIds);
    for (const id of readExploreState().sel) if (!wanted.has(id)) reportViewerEdit(id, false);
    for (const id of classIds) reportViewerEdit(id, true);
  }, []);

  // Clicking the app title clears everything back to the empty canvas, matching
  // the previous app's title-click reset. Every piece of shareable state goes:
  // selection, expansions, and the open drawer (the URL follows via the write
  // effect); the table is re-opened since a collapsed panel over an empty
  // canvas looks like breakage.
  const resetApp = useCallback(() => {
    // Clearing the canvas is an untick of everything on it, and the tour has to
    // hear each one — otherwise a class it was holding for the viewer comes
    // straight back on the next step.
    for (const id of readExploreState().sel) reportViewerEdit(id, false);
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
        <TourChooser />
        <HelpMenu
          onOpenLegend={() => setLegendOpen(v => !v)}
          onOpenCases={() => setCasesOpen(v => !v)}
          legendOpen={legendOpen}
          casesOpen={casesOpen}
        />
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

      {legendOpen && (
        <OwnershipLegend
          onClose={() => setLegendOpen(false)}
          onSelect={ids => applyCase({ name: 'ad hoc', note: '', sel: ids })}
          dataService={dataService}
        />
      )}
      {casesOpen && (
        <ExampleCasesPane
          onClose={() => setCasesOpen(false)}
          onApply={applyCase}
          selectedIds={selectedIds}
          dataService={dataService}
          offset={legendOpen}
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
                  onShowCategory={showCategoryView}
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
 * The tour's live state. Module-level for the same reason the functions are: it
 * belongs to the URL bridge, not to a React subtree, and every half of the
 * bridge plus the viewer-edit reporting has to see the same one.
 */
let tourState: TourState = NO_TOUR;

/**
 * The viewer clicked a class on or off, mid-tour.
 *
 * BOTH directions are reported here, which is the change from the version this
 * replaced. That one inferred unticks from the state — an id the tour held that
 * had gone missing — and needed only ticks announced. Under `held`/`tempHeld`
 * an untick has to say WHICH class, because the answer decides which of three
 * sets gives it up; and the state cannot say, since a class can be in two of
 * them at once.
 *
 * Outside a tour both are no-ops, so the click handlers can call unconditionally.
 */
function reportViewerEdit(id: string, on: boolean): void {
  tourState = on ? tick(tourState, id) : untick(tourState, id);
}

/** Push the composed result to the URL and let the app re-read it. */
function publish(state: ExploreState): void {
  writeExploreState(state);
  window.dispatchEvent(new Event('explore:state-from-url'));
}

/**
 * A tour is starting: whatever is on the canvas right now is the viewer's.
 *
 * The provider has to say this out loud, because "a step has pushed something"
 * is not the same question as "a tour is running" — a tour whose opening
 * position carries no `Change:` records nothing, and the first tour in the
 * content file is exactly that. Without the signal a viewer tick during those
 * opening steps would be filed as nobody's.
 */
function onTourStart(): void {
  tourState = beginTour(readExploreState().sel);
}

/**
 * A tour is ending, by any exit (done, ✕, Escape, `?`).
 *
 * The canvas becomes `held ∪ tempHeld`: everything the viewer ticked, before or
 * during, minus anything they unticked, and none of what the tour drew. That
 * replaces both the old entry snapshot and the "your changes will be discarded"
 * warning it needed — a mid-tour edit is simply still there afterwards.
 */
function onTourEnd(): void {
  /*
   * Guarded, even though the provider only calls this with a tour running (all
   * four exits check `tourIndex !== null` first). Without the guard a spurious
   * call would publish `NO_TOUR`'s empty `held` over the canvas and wipe the
   * viewer's selection — a bad enough failure to be worth one line, and the
   * kind of coupling to a caller's internal guard that quietly rots.
   */
  if (!tourState.inTour) return;
  const kept = survivingSelection(tourState);
  const live = readExploreState();
  tourState = finishTour();
  publish({ ...live, sel: kept });
}

/**
 * Record a position's `Change:` (or `Only:`).
 *
 * The change is composed ON TOP of the live state rather than replacing it, so
 * a field the step does not name keeps whatever the viewer had. That is the bug
 * this whole area exists to fix: Siggie had a non-default setting and every step
 * with a `State:` silently reset it, because no step wrote that param.
 */
function pushTourChange(query: string, replace = false): void {
  tourState = pushStep(tourState, parseTourChange(query, replace));
  publish(compose(readExploreState(), tourState));
}

/**
 * Step back one position.
 *
 * Called once per `back` — and, unlike the version this replaced, NOT once per
 * remaining frame at the end of the tour. Unwinding is `onTourEnd` now: the
 * viewer's half is stored rather than derived, so ending is a read of it and
 * not a walk back down the stack.
 */
function popTourChange(): void {
  tourState = popStep(tourState);
  publish(compose(readExploreState(), tourState));
}

export default function ExploreApp() {
  return (
    <HelpProvider
      markdown={helpMarkdown}
      onPushChange={pushTourChange}
      onPopChange={popTourChange}
      onTourStart={onTourStart}
      onTourEnd={onTourEnd}
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
        THE `take the tour` PILL IS GONE (docs/tasks.md item 2). It was a second
        entry point to the same thing as Help ▾ → Tours, and two of those drift
        apart — the pill could only ever start the FIRST tour, so once there
        were several it was quietly the wrong way in.

        What the pill was solving is still real: it was deliberately not
        another underlined blue link, because as one of five identical ones in
        this header it read as chrome rather than as the way in. That job now
        belongs to the Help menu's own styling; if the menu stops being
        findable, make IT prominent rather than adding a second door.
      */}
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
