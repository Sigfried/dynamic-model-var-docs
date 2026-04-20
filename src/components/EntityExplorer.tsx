/**
 * EntityExplorer - Progressive disclosure entity browser
 *
 * Must only import from services/DataService and config/, never from models/.
 * Uses DataService for all data access.
 */

import { useState, useCallback, useMemo } from 'react';
import { ENTITY_CATEGORIES } from '../config/entityCategories';
import { usePinState } from '../hooks/usePinState';
import { EntityTable } from './EntityTable';
import type { DataService } from '../services/DataService';

interface EntityExplorerProps {
  dataService: DataService;
}

export default function EntityExplorer({ dataService }: EntityExplorerProps) {
  const { pinnedIds, togglePin, isPinned } = usePinState();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    () => new Set(['pinned'])
  );

  const toggleCategory = useCallback((categoryId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  }, []);

  const expandAll = useCallback(() => {
    setExpandedCategories(new Set([
      'pinned',
      ...ENTITY_CATEGORIES.map(c => c.id),
    ]));
  }, []);

  const collapseAll = useCallback(() => {
    setExpandedCategories(new Set());
  }, []);

  // Build the pinned category from current pin state
  const pinnedClassIds = useMemo(() => [...pinnedIds], [pinnedIds]);

  // Filter categories to only include classes that exist in the data
  const validCategories = useMemo(() => {
    return ENTITY_CATEGORIES.map(cat => ({
      ...cat,
      classIds: cat.classIds.filter(id => dataService.itemExists(id)),
    })).filter(cat => cat.classIds.length > 0);
  }, [dataService]);

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      {/* Controls bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-3 text-sm">
        <div className="flex items-center gap-1">
          <span className="text-gray-500 font-medium">Expand:</span>
          <button
            onClick={expandAll}
            className="px-2 py-0.5 border border-gray-300 rounded text-xs hover:border-blue-500 hover:text-blue-600"
          >
            All
          </button>
          <button
            onClick={() => setExpandedCategories(new Set(['pinned']))}
            className="px-2 py-0.5 border border-gray-300 rounded text-xs hover:border-blue-500 hover:text-blue-600"
          >
            Pinned only
          </button>
          <button
            onClick={collapseAll}
            className="px-2 py-0.5 border border-gray-300 rounded text-xs hover:border-blue-500 hover:text-blue-600"
          >
            None
          </button>
        </div>
      </div>

      {/* Category list */}
      <div className="max-w-5xl mx-auto px-4 py-3 space-y-0.5">
        {/* Pinned category */}
        {pinnedClassIds.length > 0 && (
          <CategoryGroup
            id="pinned"
            label="Pinned"
            icon="★"
            classIds={pinnedClassIds}
            isExpanded={expandedCategories.has('pinned')}
            onToggle={() => toggleCategory('pinned')}
            dataService={dataService}
            isPinned={isPinned}
            onTogglePin={togglePin}
          />
        )}

        {/* Regular categories */}
        {validCategories.map(cat => (
          <CategoryGroup
            key={cat.id}
            id={cat.id}
            label={cat.label}
            classIds={cat.classIds}
            isExpanded={expandedCategories.has(cat.id)}
            onToggle={() => toggleCategory(cat.id)}
            dataService={dataService}
            isPinned={isPinned}
            onTogglePin={togglePin}
          />
        ))}
      </div>
    </div>
  );
}


interface CategoryGroupProps {
  id: string;
  label: string;
  icon?: string;
  classIds: string[];
  isExpanded: boolean;
  onToggle: () => void;
  dataService: DataService;
  isPinned: (id: string) => boolean;
  onTogglePin: (id: string) => void;
}

function CategoryGroup({
  label,
  icon,
  classIds,
  isExpanded,
  onToggle,
  dataService,
  isPinned,
  onTogglePin,
}: CategoryGroupProps) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-2 px-3 py-2 bg-blue-50 border border-gray-200 rounded-md hover:bg-blue-100 transition-colors text-left"
      >
        <span
          className={`text-xs text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
        >
          ▶
        </span>
        {icon && <span className="text-sm">{icon}</span>}
        <span className="font-semibold text-sm">{label}</span>
        <span className="text-xs text-gray-400 ml-1">
          {classIds.length} {classIds.length === 1 ? 'entity' : 'entities'}
        </span>
      </button>

      {isExpanded && (
        <EntityTable
          classIds={classIds}
          dataService={dataService}
          isPinned={isPinned}
          onTogglePin={onTogglePin}
        />
      )}
    </div>
  );
}
