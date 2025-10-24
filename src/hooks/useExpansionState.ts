import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for managing expansion state with URL persistence
 *
 * @param key - Unique key for URL parameter (e.g., 'var-classes', 'class-nodes')
 * @param defaultExpanded - Optional set of items that should be expanded by default
 * @returns [expandedItems, toggleItem] - Current expanded set and toggle function
 *
 * @example
 * // In VariablesSection:
 * const [expandedClasses, toggleClass] = useExpansionState('evc', new Set());
 *
 * // In ClassSection:
 * const [expandedNodes, toggleNode] = useExpansionState('ecn', getDefaultExpandedNodes());
 */
export function useExpansionState(
  key: string,
  defaultExpanded: Set<string> = new Set()
): [Set<string>, (item: string) => void] {
  // Initialize from URL or default
  const [expandedItems, setExpandedItems] = useState<Set<string>>(() => {
    const params = new URLSearchParams(window.location.search);
    const paramValue = params.get(key);
    if (paramValue) {
      return new Set(paramValue.split(',').filter(Boolean));
    }
    return defaultExpanded;
  });

  // Toggle an item's expansion state
  const toggleItem = useCallback((item: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(item)) {
        newSet.delete(item);
      } else {
        newSet.add(item);
      }

      // Dispatch custom event to trigger link redraw
      // This allows LinkOverlay to know when DOM elements appear/disappear
      window.dispatchEvent(new CustomEvent('expansionStateChanged'));

      return newSet;
    });
  }, []);

  // Persist to URL whenever expanded items change
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (expandedItems.size > 0) {
      params.set(key, Array.from(expandedItems).join(','));
    } else {
      params.delete(key);
    }

    const newURL = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    window.history.replaceState({}, '', newURL);
  }, [key, expandedItems]);

  return [expandedItems, toggleItem];
}
