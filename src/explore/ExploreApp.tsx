/**
 * ExploreApp — shell for the Explorer SPA (docs/EXPLORE_VIZ.md), the default
 * app (index.html entry). The previous app lives at previous.html.
 *
 * Three regions: selection table (left), viz canvas (main), detail drawer
 * (right). Selection is owned here and encoded in the URL (?sel=A~B~C) from
 * day one.
 *
 * Architecture: same rules as the previous app — this file and everything
 * under src/explore/ talks to services/DataService only, never models/ or DTOs.
 * The graph-core/ engine (ported from icd11-playground's NodeLinkView) is the
 * one exception by design: it is pure layout/interaction code with zero app
 * imports (the future package-extraction boundary).
 */

import { useEffect, useMemo, useState } from 'react';
import { useModelData } from '../hooks/useModelData';
import { DataService } from '../services/DataService';
import SelectionTable from './SelectionTable';
import OwnershipGraphView from './OwnershipGraphView';

const SEL_PARAM = 'sel';

function readSelectionFromURL(): Set<string> {
  const raw = new URLSearchParams(window.location.search).get(SEL_PARAM);
  return new Set(raw ? raw.split('~').filter(Boolean) : []);
}

function writeSelectionToURL(sel: Set<string>) {
  const url = new URL(window.location.href);
  if (sel.size === 0) url.searchParams.delete(SEL_PARAM);
  else url.searchParams.set(SEL_PARAM, [...sel].sort().join('~'));
  window.history.replaceState(null, '', url);
}

export default function ExploreApp() {
  const { modelData, loading, error } = useModelData();
  const dataService = useMemo(
    () => (modelData ? new DataService(modelData) : null),
    [modelData],
  );

  const [selectedIds, setSelectedIds] = useState<Set<string>>(readSelectionFromURL);
  useEffect(() => writeSelectionToURL(selectedIds), [selectedIds]);

  const toggleSelect = (id: string) =>
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

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
          <h1 className="text-lg font-bold leading-tight">BDCHM Explorer</h1>
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
        {/* Selection table */}
        <div className="w-96 shrink-0 border-r border-gray-200 dark:border-slate-700 overflow-y-auto">
          <SelectionTable
            dataService={dataService}
            selectedIds={selectedIds}
            onToggle={toggleSelect}
          />
        </div>

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
            />
          )}
        </div>
      </div>
    </div>
  );
}
