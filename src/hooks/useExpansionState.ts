import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for managing expansion state with URL persistence
 * Only persists to URL when state differs from default (keeps URLs clean)
 *
 * @param key - Unique key for URL parameter (e.g., 'lve', 'rve', 'lce', 'rce')
 * @param defaultExpanded - Set of items that should be expanded by default
 * @returns [expandedItems, toggleItem] - Current expanded set and toggle function
 *
 * @example
 * // Variables (default: nothing expanded)
 * const [expandedClasses, toggleClass] = useExpansionState('rve', new Set());
 *
 * // Classes (default: first 2 levels expanded)
 * const [expandedNodes, toggleNode] = useExpansionState('lce', getDefaultExpandedNodes());
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

  // Persist to URL whenever expanded items change (but only if different from default)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    // Check if current state matches default
    const isDefaultState =
      expandedItems.size === defaultExpanded.size &&
      Array.from(expandedItems).every(item => defaultExpanded.has(item));

    if (isDefaultState) {
      // State matches default, remove parameter to keep URL clean
      params.delete(key);
    } else {
      // State differs from default, persist to URL
      params.set(key, Array.from(expandedItems).join(','));
    }

    const newURL = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    window.history.replaceState({}, '', newURL);
  }, [key, expandedItems, defaultExpanded]);

  return [expandedItems, toggleItem];
}
