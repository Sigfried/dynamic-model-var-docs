type SectionType = 'classes' | 'enums' | 'slots' | 'variables';
type EntityType = 'class' | 'enum' | 'slot' | 'variable';

interface AppState {
  leftSections: SectionType[];
  rightSections: SectionType[];
  selectedEntityName?: string;
  selectedEntityType?: EntityType;
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

  // Parse selected entity
  const selectedName = params.get('sel');
  const selectedType = params.get('selType') as EntityType | null;
  if (selectedName && selectedType && ['class', 'enum', 'slot', 'variable'].includes(selectedType)) {
    state.selectedEntityName = selectedName;
    state.selectedEntityType = selectedType;
  }

  return Object.keys(state).length > 0 ? state : null;
}

/**
 * Save state to URL query string
 */
export function saveStateToURL(state: AppState): void {
  const params = new URLSearchParams();

  // Save left panel sections
  if (state.leftSections.length > 0) {
    params.set('l', state.leftSections.map(s => sectionToCode[s]).join(','));
  }

  // Save right panel sections
  if (state.rightSections.length > 0) {
    params.set('r', state.rightSections.map(s => sectionToCode[s]).join(','));
  }

  // Save selected entity
  if (state.selectedEntityName && state.selectedEntityType) {
    params.set('sel', state.selectedEntityName);
    params.set('selType', state.selectedEntityType);
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

  return {
    leftSections: urlState?.leftSections ?? localState?.leftSections ?? defaultState.leftSections,
    rightSections: urlState?.rightSections ?? localState?.rightSections ?? defaultState.rightSections
  };
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
