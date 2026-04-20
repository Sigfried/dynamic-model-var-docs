/**
 * usePinState - Manages pinned entity IDs with localStorage persistence.
 */

import { useState, useCallback } from 'react';
import { DEFAULT_PINS } from '../config/entityCategories';

const STORAGE_KEY = 'bdchm-pinned-entities';

function loadPins(): Set<string> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as string[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        return new Set(parsed);
      }
    }
  } catch { /* ignore */ }
  return new Set(DEFAULT_PINS);
}

function savePins(pins: Set<string>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...pins]));
  } catch { /* ignore */ }
}

export function usePinState() {
  const [pinnedIds, setPinnedIds] = useState<Set<string>>(loadPins);

  const togglePin = useCallback((id: string) => {
    setPinnedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      savePins(next);
      return next;
    });
  }, []);

  const isPinned = useCallback((id: string) => pinnedIds.has(id), [pinnedIds]);

  return { pinnedIds, togglePin, isPinned };
}
