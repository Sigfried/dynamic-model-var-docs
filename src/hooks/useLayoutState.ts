import { useState, useEffect, useCallback } from 'react';
import { getInitialState, saveStateToURL, saveStateToLocalStorage, itemTypeToCode, type DialogState } from '../utils/statePersistence';

interface UseLayoutStateOptions {
  hasRestoredFromURL: boolean;
  getDialogStates: () => DialogState[];
}

interface UseLayoutStateResult {
  leftSections: string[];
  middleSections: string[];
  rightSections: string[];
  setLeftSections: (sections: string[]) => void;
  setMiddleSections: (sections: string[]) => void;
  setRightSections: (sections: string[]) => void;
  showUrlHelp: boolean;
  setShowUrlHelp: (show: boolean) => void;
  showSaveConfirm: boolean;
  hasLocalStorage: boolean;
  handleSaveLayout: () => void;
  handleResetLayout: () => void;
  handleResetApp: () => void;
  triggerURLSave: () => void;  // Called when dialogs change to update URL
}

/**
 * Hook to manage panel layout state including:
 * - Left/middle/right section configuration
 * - Layout persistence (URL and localStorage)
 * - Save/reset/restore layout actions
 */
export function useLayoutState({ hasRestoredFromURL, getDialogStates }: UseLayoutStateOptions): UseLayoutStateResult {
  // Load initial state from URL or localStorage
  const initialState = getInitialState();
  const [leftSections, setLeftSections] = useState<string[]>(initialState.leftSections);
  const [middleSections, setMiddleSections] = useState<string[]>(initialState.middleSections);
  const [rightSections, setRightSections] = useState<string[]>(initialState.rightSections);
  const [showUrlHelp, setShowUrlHelp] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [hasLocalStorage, setHasLocalStorage] = useState(false);

  // Check if localStorage has saved state
  useEffect(() => {
    const checkLocalStorage = () => {
      try {
        const stored = localStorage.getItem('bdchm-app-state');
        setHasLocalStorage(!!stored);
      } catch {
        setHasLocalStorage(false);
      }
    };
    checkLocalStorage();
  }, []);

  // Function to save current state to URL
  const triggerURLSave = useCallback(() => {
    if (!hasRestoredFromURL) return; // Don't save until we've restored from URL

    const state = {
      leftSections,
      middleSections,
      rightSections,
      dialogs: getDialogStates()
    };
    // @ts-expect-error TEMPORARY: string[] vs ElementTypeId[] - will be removed in Step 7 (Link Overlay Refactor)
    // TODO: See TASKS.md Step 7 - eliminate type exposure to UI
    saveStateToURL(state);
  }, [leftSections, middleSections, rightSections, getDialogStates, hasRestoredFromURL]);

  // Save state when sections change (but only after initial restoration)
  useEffect(() => {
    triggerURLSave();
  }, [triggerURLSave]);

  // Save current layout to localStorage
  const handleSaveLayout = () => {
    const state = {
      leftSections,
      middleSections,
      rightSections,
      dialogs: getDialogStates()
    };
    // @ts-expect-error TEMPORARY: string[] vs ElementTypeId[] - will be removed in Step 7 (Link Overlay Refactor)
    // TODO: See TASKS.md Step 7 - eliminate type exposure to UI
    saveStateToLocalStorage(state);
    setHasLocalStorage(true);
    setShowSaveConfirm(true);
    setTimeout(() => setShowSaveConfirm(false), 2000);
  };

  // Reset layout (clear localStorage)
  const handleResetLayout = () => {
    try {
      localStorage.removeItem('bdchm-app-state');
      setHasLocalStorage(false);
      setShowSaveConfirm(true);
      setTimeout(() => setShowSaveConfirm(false), 2000);
    } catch (err) {
      console.error('Failed to clear localStorage:', err);
    }
  };

  // Reset application to saved layout or default
  const handleResetApp = () => {
    const stored = localStorage.getItem('bdchm-app-state');
    if (stored) {
      // Reset to saved layout (including dialogs if present)
      try {
        const state = JSON.parse(stored);

        // Build clean URL with only saved state params (no expansion params)
        const params = new URLSearchParams();

        // Build section IDs array using new format
        const sectionIds: string[] = [];

        if (state.leftSections && state.leftSections.length > 0) {
          for (const section of state.leftSections) {
            // @ts-expect-error TEMPORARY: any indexing into Record<ElementTypeId, string>
            // TODO: See TASKS.md Step 7 - eliminate type exposure to UI
            sectionIds.push(`l${itemTypeToCode[section]}`);
          }
        }

        if (state.middleSections && state.middleSections.length > 0) {
          for (const section of state.middleSections) {
            // @ts-expect-error TEMPORARY: any indexing into Record<ElementTypeId, string>
            // TODO: See TASKS.md Step 7 - eliminate type exposure to UI
            sectionIds.push(`m${itemTypeToCode[section]}`);
          }
        }

        if (state.rightSections && state.rightSections.length > 0) {
          for (const section of state.rightSections) {
            // @ts-expect-error TEMPORARY: any indexing into Record<ElementTypeId, string>
            // TODO: See TASKS.md Step 7 - eliminate type exposure to UI
            sectionIds.push(`r${itemTypeToCode[section]}`);
          }
        }

        if (sectionIds.length > 0) {
          params.set('sections', sectionIds.join('~'));
        }

        if (state.dialogs && state.dialogs.length > 0) {
          const dialogsStr = state.dialogs.map((d: DialogState) =>
            `${d.itemType}:${d.itemName}:${Math.round(d.x ?? 0)},${Math.round(d.y ?? 0)},${Math.round(d.width ?? 400)},${Math.round(d.height ?? 300)}`
          ).join(';');
          params.set('dialogs', dialogsStr);
        }

        // Navigate to clean URL (clears expansion params and triggers reload)
        const newURL = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
        window.location.href = newURL;
      } catch (err) {
        console.error('Failed to parse stored state:', err);
      }
    } else {
      // Reset to default (classes only preset)
      // Navigate to clean default URL (clears all params and triggers reload)
      const newURL = `${window.location.pathname}?sections=lc`;
      window.location.href = newURL;
    }
  };

  return {
    leftSections,
    middleSections,
    rightSections,
    setLeftSections,
    setMiddleSections,
    setRightSections,
    showUrlHelp,
    setShowUrlHelp,
    showSaveConfirm,
    hasLocalStorage,
    handleSaveLayout,
    handleResetLayout,
    handleResetApp,
    triggerURLSave
  };
}
