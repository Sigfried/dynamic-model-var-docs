type SectionType = 'classes' | 'enums' | 'slots' | 'variables';
type ElementType = 'class' | 'enum' | 'slot' | 'variable';

export interface DialogState {
  elementName: string;
  elementType: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface AppState {
  leftSections: SectionType[];
  rightSections: SectionType[];
  dialogs?: DialogState[];
  expandedVariableClasses?: string[]; // Variable classes that are expanded
  expandedClassNodes?: string[]; // Class tree nodes that are expanded
}

const STORAGE_KEY = 'bdchm-app-state';

// Section type mappings for URL (single character codes)
const sectionToCode: Record<SectionType, string> = {
  classes: 'c',
  enums: 'e',
  slots: 's',
  variables: 'v'
};

const codeToSection: Record<string, SectionType> = {
  c: 'classes',
  e: 'enums',
  s: 'slots',
  v: 'variables'
};

/**
 * Parse state from URL query string
 */
export function parseStateFromURL(): Partial<AppState> | null {
  const params = new URLSearchParams(window.location.search);
  const state: Partial<AppState> = {};

  // Parse left panel sections
  const leftParam = params.get('l');
  if (leftParam) {
    state.leftSections = leftParam.split(',')
      .map(code => codeToSection[code])
      .filter(Boolean) as SectionType[];
  }

  // Parse right panel sections
  const rightParam = params.get('r');
  if (rightParam) {
    state.rightSections = rightParam.split(',')
      .map(code => codeToSection[code])
      .filter(Boolean) as SectionType[];
  }

  // Parse dialogs (new format)
  const dialogsParam = params.get('dialogs');
  if (dialogsParam) {
    try {
      // Format: type:name:x,y,w,h;type:name:x,y,w,h
      state.dialogs = dialogsParam.split(';').map(dialogStr => {
        const parts = dialogStr.split(':');
        if (parts.length !== 3) return null;

        const elementType = parts[0] as ElementType;
        const elementName = parts[1];
        const [x, y, width, height] = parts[2].split(',').map(Number);

        if (!['class', 'enum', 'slot', 'variable'].includes(elementType)) return null;
        if (isNaN(x) || isNaN(y) || isNaN(width) || isNaN(height)) return null;

        return { elementType, elementName, x, y, width, height };
      }).filter((d): d is DialogState => d !== null);
    } catch (e) {
      console.warn('Failed to parse dialogs from URL:', e);
    }
  }

  // Parse expanded variable classes
  const expandedVarClassesParam = params.get('evc');
  if (expandedVarClassesParam) {
    state.expandedVariableClasses = expandedVarClassesParam.split(',').filter(Boolean);
  }

  // Parse expanded class nodes
  const expandedClassNodesParam = params.get('ecn');
  if (expandedClassNodesParam) {
    state.expandedClassNodes = expandedClassNodesParam.split(',').filter(Boolean);
  }

  return Object.keys(state).length > 0 ? state : null;
}

/**
 * Save state to URL query string
 * Preserves existing URL parameters that are not managed by this function
 */
export function saveStateToURL(state: AppState): void {
  // Start with existing URL params to preserve parameters managed by other systems
  // (e.g., lve, rve, lce, rce from useExpansionState hook)
  const params = new URLSearchParams(window.location.search);

  // Update left panel sections
  if (state.leftSections.length > 0) {
    params.set('l', state.leftSections.map(s => sectionToCode[s]).join(','));
  } else {
    params.delete('l');
  }

  // Update right panel sections
  if (state.rightSections.length > 0) {
    params.set('r', state.rightSections.map(s => sectionToCode[s]).join(','));
  } else {
    params.delete('r');
  }

  // Update dialogs
  if (state.dialogs && state.dialogs.length > 0) {
    // Format: type:name:x,y,w,h;type:name:x,y,w,h
    const dialogsStr = state.dialogs.map(d =>
      `${d.elementType}:${d.elementName}:${Math.round(d.x)},${Math.round(d.y)},${Math.round(d.width)},${Math.round(d.height)}`
    ).join(';');
    params.set('dialogs', dialogsStr);
  } else {
    params.delete('dialogs');
  }

  // Update expanded variable classes
  if (state.expandedVariableClasses && state.expandedVariableClasses.length > 0) {
    params.set('evc', state.expandedVariableClasses.join(','));
  } else {
    params.delete('evc');
  }

  // Update expanded class nodes
  if (state.expandedClassNodes && state.expandedClassNodes.length > 0) {
    params.set('ecn', state.expandedClassNodes.join(','));
  } else {
    params.delete('ecn');
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
    leftSections: ['classes'],
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

  // Include expanded variable classes if present
  const expandedVariableClasses = urlState?.expandedVariableClasses ?? localState?.expandedVariableClasses;
  if (expandedVariableClasses && expandedVariableClasses.length > 0) {
    state.expandedVariableClasses = expandedVariableClasses;
  }

  // Include expanded class nodes if present
  const expandedClassNodes = urlState?.expandedClassNodes ?? localState?.expandedClassNodes;
  if (expandedClassNodes && expandedClassNodes.length > 0) {
    state.expandedClassNodes = expandedClassNodes;
  }

  return state;
}

/**
 * Preset configurations for example links
 */
export const PRESETS = {
  classesOnly: {
    leftSections: ['classes'] as SectionType[],
    rightSections: [] as SectionType[]
  },
  classesAndEnums: {
    leftSections: ['classes'] as SectionType[],
    rightSections: ['enums'] as SectionType[]
  },
  allSections: {
    leftSections: ['classes', 'enums'] as SectionType[],
    rightSections: ['slots', 'variables'] as SectionType[]
  },
  variableExplorer: {
    leftSections: ['variables'] as SectionType[],
    rightSections: ['classes'] as SectionType[]
  }
};

/**
 * Generate URL for a preset configuration
 */
export function generatePresetURL(presetKey: keyof typeof PRESETS): string {
  const preset = PRESETS[presetKey];
  const params = new URLSearchParams();

  if (preset.leftSections.length > 0) {
    params.set('l', preset.leftSections.map(s => sectionToCode[s]).join(','));
  }

  if (preset.rightSections.length > 0) {
    params.set('r', preset.rightSections.map(s => sectionToCode[s]).join(','));
  }

  return `${window.location.pathname}?${params.toString()}`;
}
