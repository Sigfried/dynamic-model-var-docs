import type { ElementTypeId } from '../models/ElementRegistry';

export interface DialogState {
  itemName: string;
  itemType?: ElementTypeId;  // Optional - only needed for localStorage compatibility
  x?: number;      // Optional - if missing, use default cascade position
  y?: number;      // Optional - if missing, use default cascade position
  width?: number;  // Optional - if missing, use default size
  height?: number; // Optional - if missing, use default size
}

interface AppState {
  leftSections: ElementTypeId[];
  rightSections: ElementTypeId[];
  dialogs?: DialogState[];
}

const STORAGE_KEY = 'bdchm-app-state';

// Item type mappings for URL (single character codes)
export const itemTypeToCode: Record<ElementTypeId, string> = {
  class: 'c',
  enum: 'e',
  slot: 's',
  variable: 'v'
};

const codeToItemType: Record<string, ElementTypeId> = {
  c: 'class',
  e: 'enum',
  s: 'slot',
  v: 'variable'
};

/**
 * Parse state from URL query string
 * Format: sections=lc~re~rv (left-class~right-enum~right-variable)
 */
export function parseStateFromURL(): Partial<AppState> | null {
  const params = new URLSearchParams(window.location.search);
  const state: Partial<AppState> = {};

  // Parse sections parameter: sections=lc~re~rv
  const sectionsParam = params.get('sections');
  if (sectionsParam) {
    const leftSections: ElementTypeId[] = [];
    const rightSections: ElementTypeId[] = [];

    // Split by ~ delimiter
    const sectionIds = sectionsParam.split('~');
    for (const sectionId of sectionIds) {
      if (sectionId.length !== 2) continue; // Must be 2 characters: side + type

      const side = sectionId[0]; // 'l' or 'r'
      const typeCode = sectionId[1]; // 'c', 'e', 's', 'v'
      const itemType = codeToItemType[typeCode];

      if (!itemType) continue; // Invalid type code

      if (side === 'l') {
        leftSections.push(itemType);
      } else if (side === 'r') {
        rightSections.push(itemType);
      }
    }

    if (leftSections.length > 0) state.leftSections = leftSections;
    if (rightSections.length > 0) state.rightSections = rightSections;
  }

  // Parse dialogs
  // Format: name or name:x,y,w,h (position optional)
  const dialogsParam = params.get('dialogs');
  if (dialogsParam) {
    try {
      state.dialogs = dialogsParam.split(';').map(dialogStr => {
        const parts = dialogStr.split(':');
        if (parts.length < 1) return null;

        const itemName = parts[0];

        // Position is optional (parts[1])
        if (parts.length >= 2 && parts[1]) {
          const [x, y, width, height] = parts[1].split(',').map(Number);
          if (!isNaN(x) && !isNaN(y) && !isNaN(width) && !isNaN(height)) {
            return { itemName, x, y, width, height } as DialogState;
          }
        }

        // No position info - use defaults
        return { itemName } as DialogState;
      }).filter((d): d is DialogState => d !== null) as DialogState[];
    } catch (e) {
      console.warn('Failed to parse dialogs from URL:', e);
    }
  }

  return Object.keys(state).length > 0 ? state : null;
}

/**
 * Save state to URL query string using new format: sections=lc~re~rv
 * Preserves existing URL parameters that are not managed by this function
 */
export function saveStateToURL(state: AppState): void {
  // Start with existing URL params to preserve parameters managed by other systems
  // (e.g., lve, rve, lce, rce from useExpansionState hook)
  const params = new URLSearchParams(window.location.search);

  // Remove legacy format params if present
  params.delete('l');
  params.delete('r');

  // Build section IDs array: lc, re, rv, etc.
  const sectionIds: string[] = [];

  for (const section of state.leftSections) {
    sectionIds.push(`l${itemTypeToCode[section]}`);
  }

  for (const section of state.rightSections) {
    sectionIds.push(`r${itemTypeToCode[section]}`);
  }

  // Update sections parameter with ~ delimiter
  if (sectionIds.length > 0) {
    params.set('sections', sectionIds.join('~'));
  } else {
    params.delete('sections');
  }

  // Update dialogs
  // Format: name or name:x,y,w,h (position optional)
  if (state.dialogs && state.dialogs.length > 0) {
    const dialogsStr = state.dialogs.map(d => {
      // If box has explicit position, include it
      if (d.x !== undefined && d.y !== undefined && d.width !== undefined && d.height !== undefined) {
        return `${d.itemName}:${Math.round(d.x)},${Math.round(d.y)},${Math.round(d.width)},${Math.round(d.height)}`;
      }
      // Otherwise just save item identity
      return d.itemName;
    }).join(';');
    params.set('dialogs', dialogsStr);
  } else {
    params.delete('dialogs');
  }

  // Update URL without page reload
  const newURL = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
  window.history.replaceState({}, '', newURL);
}

/**
 * Load state from localStorage
 */
export function loadStateFromLocalStorage(): Partial<AppState> | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to load state from localStorage:', error);
    return null;
  }
}

/**
 * Save state to localStorage
 */
export function saveStateToLocalStorage(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save state to localStorage:', error);
  }
}

/**
 * Get initial state with fallback priority: URL -> localStorage -> defaults
 */
export function getInitialState(): AppState {
  const urlState = parseStateFromURL();
  const localState = loadStateFromLocalStorage();

  const defaultState: AppState = {
    leftSections: ['class'],
    rightSections: []
  };

  const state: AppState = {
    leftSections: urlState?.leftSections ?? localState?.leftSections ?? defaultState.leftSections,
    rightSections: urlState?.rightSections ?? localState?.rightSections ?? defaultState.rightSections
  };

  // Include dialogs if present in URL or localStorage
  const dialogs = urlState?.dialogs ?? localState?.dialogs;
  if (dialogs && dialogs.length > 0) {
    state.dialogs = dialogs;
  }

  return state;
}

/**
 * Preset configurations for example links
 */
export const PRESETS = {
  classesOnly: {
    leftSections: ['class'] as ElementTypeId[],
    rightSections: [] as ElementTypeId[]
  },
  classesAndEnums: {
    leftSections: ['class'] as ElementTypeId[],
    rightSections: ['enum'] as ElementTypeId[]
  },
  allSections: {
    leftSections: ['class', 'enum'] as ElementTypeId[],
    rightSections: ['slot', 'variable'] as ElementTypeId[]
  },
  variableExplorer: {
    leftSections: ['variable'] as ElementTypeId[],
    rightSections: ['class'] as ElementTypeId[]
  }
};

/**
 * Generate URL for a preset configuration using new format
 */
export function generatePresetURL(presetKey: keyof typeof PRESETS): string {
  const preset = PRESETS[presetKey];
  const params = new URLSearchParams();

  // Build section IDs array
  const sectionIds: string[] = [];

  for (const section of preset.leftSections) {
    sectionIds.push(`l${itemTypeToCode[section]}`);
  }

  for (const section of preset.rightSections) {
    sectionIds.push(`r${itemTypeToCode[section]}`);
  }

  if (sectionIds.length > 0) {
    params.set('sections', sectionIds.join('~'));
  }

  return `${window.location.pathname}?${params.toString()}`;
}
