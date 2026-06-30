/**
 * FocusView — the "Focus" view (subset visualization).
 *
 * A compact, selection-driven view:
 *  - top-left: category-grouped class multi-select selector
 *  - bottom-left: containment digraph for the selected subset (dag-browser-widget)
 *  - middle/right: the selected classes' slots and ranges
 *  - a node-link diagram available as a floating box
 *
 * Architecture: imports only from services/DataService, other components, and
 * utils/ — never from models/ or config/ (see CLAUDE.md). Selection state is
 * owned here and shared across the selector, the containment widget, and the
 * middle/right scoping.
 */

import { useMemo, useState } from 'react';
import { DagBrowser } from 'dag-browser-widget';
import 'dag-browser-widget/styles.css';
import ItemsPanel from './ItemsPanel';
import type { DataService } from '../services/DataService';
import type { SectionData, ItemHoverData } from '../contracts/ComponentData';

interface FocusViewProps {
  dataService: DataService;
}

export default function FocusView({ dataService }: FocusViewProps) {
  // The selected subset of classes — drives the containment widget and the
  // middle/right panel scoping. Owned here; shared downstream.
  const [selectedClassIds, setSelectedClassIds] = useState<Set<string>>(new Set());

  const toggleSelect = (name: string) => {
    setSelectedClassIds(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  // Category-grouped selector section (memoized: stable identity for the panel).
  const selectorSectionData = useMemo<Map<string, SectionData>>(() => {
    const section = dataService.getCategorySelectorSection();
    return new Map([[section.id, section]]);
  }, [dataService]);

  // Clicking a class name (not the checkbox) toggles selection too, for now.
  const handleClickItem = (hoverData: ItemHoverData) => {
    if (hoverData.type === 'class') toggleSelect(hoverData.name);
  };

  // Containment digraph nodes for the selected subset. Memoized so the widget
  // doesn't remount unless the selection actually changes (new array identity =
  // "start over" per the widget contract).
  const selectedKey = [...selectedClassIds].sort().join(',');
  const selectedOrder = [...selectedClassIds];
  const containmentNodes = useMemo(
    () => dataService.getContainmentNodes(selectedOrder),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dataService, selectedKey],
  );

  // Middle (slots) and right (ranges) sections, one per selected class.
  const middle = useMemo(
    () => dataService.getFocusPanelSections(selectedOrder, 'slots'),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dataService, selectedKey],
  );
  const right = useMemo(
    () => dataService.getFocusPanelSections(selectedOrder, 'ranges'),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dataService, selectedKey],
  );

  return (
    <div className="flex-1 flex min-h-0">
      {/* Left column: selector (top) + containment widget (bottom) */}
      <div className="flex flex-col w-80 flex-shrink-0 border-r border-gray-200 dark:border-slate-700 min-h-0">
        <div className="flex-1 min-h-0 border-b border-gray-200 dark:border-slate-700">
          <ItemsPanel
            position="left"
            sections={['focus-categories']}
            onSectionsChange={() => {}}
            sectionData={selectorSectionData}
            toggleButtons={[]}
            onClickItem={handleClickItem}
            selectedIds={selectedClassIds}
            onToggleSelect={toggleSelect}
          />
        </div>
        <div className="flex-1 min-h-0 overflow-auto p-2">
          {selectedClassIds.size === 0 ? (
            <div className="p-2 text-sm text-gray-400">
              Containment digraph — select classes to populate
            </div>
          ) : (
            <DagBrowser
              nodes={containmentNodes}
              selected={[...selectedClassIds]}
              levelsExpanded={1}
            />
          )}
        </div>
      </div>

      {selectedClassIds.size === 0 ? (
        <div className="flex-1 flex items-center justify-center text-gray-400 text-sm min-h-0">
          Select classes to see their slots and ranges
        </div>
      ) : (
        <>
          {/* Middle: selected classes' slots (stacked per class) */}
          <div className="flex-1 min-h-0 border-r border-gray-200 dark:border-slate-700">
            <ItemsPanel
              position="middle"
              sections={middle.sectionIds}
              onSectionsChange={() => {}}
              sectionData={middle.sectionData}
              toggleButtons={[]}
              onClickItem={handleClickItem}
              title={dataService.getTypeLabel('slot', true)}
            />
          </div>
          {/* Right: ranges those slots point to (stacked per class) */}
          <div className="flex-1 min-h-0">
            <ItemsPanel
              position="right"
              sections={right.sectionIds}
              onSectionsChange={() => {}}
              sectionData={right.sectionData}
              toggleButtons={[]}
              onClickItem={handleClickItem}
              title={dataService.getConceptLabel('attributeType', true)}
            />
          </div>
        </>
      )}
    </div>
  );
}
