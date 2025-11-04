import { useState, useEffect } from 'react';
import { getInitialState, type DialogState } from '../utils/statePersistence';
import { getElementName, findDuplicateIndex } from '../utils/duplicateDetection';
import type { ModelData } from '../types';
import type { Element } from '../models/Element';

export interface OpenDialog {
  id: string;
  element: Element;
  elementType: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface UseDialogStateOptions {
  modelData: ModelData | undefined;
}

interface UseDialogStateResult {
  openDialogs: OpenDialog[];
  hasRestoredFromURL: boolean;
  handleOpenDialog: (hoverData: { type: string; name: string }, position?: { x: number; y: number }, size?: { width: number; height: number }) => void;
  handleCloseDialog: (id: string) => void;
  handleDialogChange: (id: string, position: { x: number; y: number }, size: { width: number; height: number }) => void;
  getDialogStates: () => DialogState[];
}

/**
 * Hook to manage dialog state including:
 * - Opening, closing, and positioning dialogs
 * - Restoring dialogs from URL state
 * - Duplicate detection
 * - Converting to/from persisted state
 */
export function useDialogState({ modelData }: UseDialogStateOptions): UseDialogStateResult {
  const [openDialogs, setOpenDialogs] = useState<OpenDialog[]>([]);
  const [nextDialogId, setNextDialogId] = useState(0);
  const [hasRestoredFromURL, setHasRestoredFromURL] = useState(false);

  // Restore dialogs from URL after data loads (runs once)
  useEffect(() => {
    // Only run once after data loads
    if (hasRestoredFromURL) return;
    if (!modelData) return;

    // Mark as restored
    setHasRestoredFromURL(true);

    const urlState = getInitialState();

    // Restore dialogs from new format
    if (urlState.dialogs && urlState.dialogs.length > 0) {
      const restoredDialogs: OpenDialog[] = [];
      let dialogIdCounter = 0;

      urlState.dialogs.forEach(dialogState => {
        // Look up element using generic collection interface
        const collection = modelData.collections.get(dialogState.elementType);
        const element = collection?.getElement(dialogState.elementName) || null;

        if (element) {
          restoredDialogs.push({
            id: `dialog-${dialogIdCounter}`,
            element,
            elementType: dialogState.elementType,
            x: dialogState.x,
            y: dialogState.y,
            width: dialogState.width,
            height: dialogState.height
          });
          dialogIdCounter++;
        }
      });

      // Set all dialogs at once
      if (restoredDialogs.length > 0) {
        setOpenDialogs(restoredDialogs);
        setNextDialogId(dialogIdCounter);
      }
    }
  }, [modelData, hasRestoredFromURL]);

  const handleOpenDialog = (hoverData: { type: string; name: string }, position?: { x: number; y: number }, size?: { width: number; height: number }) => {
    // Look up the element from modelData
    if (!modelData) return;

    const element = modelData.elementLookup.get(hoverData.name);
    if (!element) {
      console.warn(`Element "${hoverData.name}" not found in elementLookup`);
      return;
    }

    const elementType = hoverData.type;

    // Check if this element is already open using utility function
    const existingIndex = findDuplicateIndex(
      openDialogs.map(d => ({ element: d.element, elementType: d.elementType })),
      element,
      elementType
    );

    // If already open, bring to top (move to end of array, which renders last = on top)
    if (existingIndex !== -1) {
      setOpenDialogs(prev => {
        const updated = [...prev];
        const [existing] = updated.splice(existingIndex, 1);
        return [...updated, existing];
      });
      return;
    }

    // Otherwise, create new dialog
    const CASCADE_OFFSET = 40;
    const defaultPosition = {
      x: 100 + (openDialogs.length * CASCADE_OFFSET),
      y: window.innerHeight - 400 + (openDialogs.length * CASCADE_OFFSET)
    };
    const defaultSize = { width: 900, height: 350 };

    const newDialog: OpenDialog = {
      id: `dialog-${nextDialogId}`,
      element,
      elementType,
      x: position?.x ?? defaultPosition.x,
      y: position?.y ?? defaultPosition.y,
      width: size?.width ?? defaultSize.width,
      height: size?.height ?? defaultSize.height
    };
    setOpenDialogs(prev => [...prev, newDialog]);
    setNextDialogId(prev => prev + 1);
  };

  const handleCloseDialog = (id: string) => {
    setOpenDialogs(prev => prev.filter(d => d.id !== id));
  };

  const handleDialogChange = (id: string, position: { x: number; y: number }, size: { width: number; height: number }) => {
    setOpenDialogs(prev => prev.map(d =>
      d.id === id ? { ...d, x: position.x, y: position.y, width: size.width, height: size.height } : d
    ));
  };

  // Convert OpenDialog to DialogState for persistence
  const getDialogStates = (): DialogState[] => {
    return openDialogs.map(dialog => {
      const elementName = getElementName(dialog.element, dialog.elementType);

      return {
        elementName,
        elementType: dialog.elementType,
        x: dialog.x,
        y: dialog.y,
        width: dialog.width,
        height: dialog.height
      };
    });
  };

  return {
    openDialogs,
    hasRestoredFromURL,
    handleOpenDialog,
    handleCloseDialog,
    handleDialogChange,
    getDialogStates
  };
}
