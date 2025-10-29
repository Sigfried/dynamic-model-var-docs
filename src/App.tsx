import { useState, useEffect, useMemo } from 'react';
import ElementsPanel from './components/ElementsPanel';
import DetailDialog from './components/DetailDialog';
import DetailPanelStack from './components/DetailPanelStack';
import PanelLayout from './components/PanelLayout';
import LinkOverlay from './components/LinkOverlay';
import { loadModelData } from './utils/dataLoader';
import { getInitialState, saveStateToURL, saveStateToLocalStorage, generatePresetURL, elementTypeToCode, type DialogState } from './utils/statePersistence';
import { calculateDisplayMode } from './utils/layoutHelpers';
import { getElementName, findDuplicateIndex } from './utils/duplicateDetection';
import type { ModelData, SelectedElement } from './types';
import type { ElementTypeId } from './models/ElementRegistry';
import type { ElementCollection } from './models/Element';

interface OpenDialog {
  id: string;
  element: SelectedElement;
  elementType: ElementTypeId;
  x: number;
  y: number;
  width: number;
  height: number;
}

function App() {
  const [modelData, setModelData] = useState<ModelData>();
  const [openDialogs, setOpenDialogs] = useState<OpenDialog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [showUrlHelp, setShowUrlHelp] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [hasLocalStorage, setHasLocalStorage] = useState(false);
  const [hasRestoredFromURL, setHasRestoredFromURL] = useState(false);
  const [nextDialogId, setNextDialogId] = useState(0);
  const [displayMode, setDisplayMode] = useState<'stacked' | 'dialog'>('dialog');
  const [hoveredElement, setHoveredElement] = useState<{ type: ElementTypeId; name: string } | null>(null);

  // Load initial state from URL or localStorage
  const initialState = getInitialState();
  const [leftSections, setLeftSections] = useState<ElementTypeId[]>(initialState.leftSections);
  const [rightSections, setRightSections] = useState<ElementTypeId[]>(initialState.rightSections);

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

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await loadModelData();
        setModelData(data);

        // Make modelData accessible in console for debugging
        (window as any).modelData = data;
        console.log('ModelData loaded and available as window.modelData:', data);
        console.log('Collections:', Array.from(data.collections.keys()));
        console.log('Total elements:', data.elementLookup.size);

        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
        setLoading(false);
      }
    }

    loadData();
  }, []);

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

  // Measure available space and set display mode
  useEffect(() => {
    const measureSpace = () => {
      const windowWidth = window.innerWidth;
      const { mode } = calculateDisplayMode(windowWidth, leftSections.length, rightSections.length);
      setDisplayMode(mode);
    };

    measureSpace();
    window.addEventListener('resize', measureSpace);
    return () => window.removeEventListener('resize', measureSpace);
  }, [leftSections, rightSections]);

  // Convert OpenDialog to DialogState
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

  // Save state when it changes (but only after initial restoration)
  useEffect(() => {
    if (!hasRestoredFromURL) return; // Don't save until we've restored from URL

    const state = {
      leftSections,
      rightSections,
      dialogs: getDialogStates()
    };
    saveStateToURL(state);
  }, [leftSections, rightSections, openDialogs, hasRestoredFromURL]);

  // Save current layout to localStorage
  const handleSaveLayout = () => {
    const state = {
      leftSections,
      rightSections,
      dialogs: getDialogStates()
    };
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

        if (state.leftSections && state.leftSections.length > 0) {
          const sectionCodes = state.leftSections.map((s: ElementTypeId) => elementTypeToCode[s]).join(',');
          params.set('l', sectionCodes);
        }

        if (state.rightSections && state.rightSections.length > 0) {
          const sectionCodes = state.rightSections.map((s: ElementTypeId) => elementTypeToCode[s]).join(',');
          params.set('r', sectionCodes);
        }

        if (state.dialogs && state.dialogs.length > 0) {
          const dialogsStr = state.dialogs.map((d: DialogState) =>
            `${d.elementType}:${d.elementName}:${Math.round(d.x)},${Math.round(d.y)},${Math.round(d.width)},${Math.round(d.height)}`
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
      const newURL = `${window.location.pathname}?l=c`;
      window.location.href = newURL;
    }
  };

  // Dialog management
  const handleOpenDialog = (element: SelectedElement, elementType: ElementTypeId, position?: { x: number; y: number }, size?: { width: number; height: number }) => {

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

  // Navigation handler - now opens a new dialog
  const handleNavigate = (elementName: string, elementType: 'class' | 'enum' | 'slot') => {
    const collection = modelData?.collections.get(elementType);
    const element = collection?.getElement(elementName);
    if (element) handleOpenDialog(element, elementType);
  };

  // Memoize panel data to prevent infinite re-renders in LinkOverlay
  // Filter collections to only visible sections
  const leftPanelData = useMemo(() => {
    if (!modelData) return new Map<ElementTypeId, ElementCollection>();

    const filtered = new Map<ElementTypeId, ElementCollection>();
    leftSections.forEach(sectionId => {
      const collection = modelData.collections.get(sectionId);
      if (collection) {
        filtered.set(sectionId, collection);
      }
    });
    return filtered;
  }, [leftSections, modelData]);

  const rightPanelData = useMemo(() => {
    if (!modelData) return new Map<ElementTypeId, ElementCollection>();

    const filtered = new Map<ElementTypeId, ElementCollection>();
    rightSections.forEach(sectionId => {
      const collection = modelData.collections.get(sectionId);
      if (collection) {
        filtered.set(sectionId, collection);
      }
    });
    return filtered;
  }, [rightSections, modelData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="text-xl font-semibold mb-2">Loading BDCHM Model...</div>
          <div className="text-gray-500">Please wait</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="text-xl font-semibold mb-2 text-red-600">Error</div>
          <div className="text-gray-700">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-blue-600 text-white px-6 py-4 border-b border-blue-700">
        <div className="flex items-center justify-between">
          <div>
            <h1
              className="text-2xl font-bold cursor-pointer hover:opacity-80 transition-opacity"
              onClick={handleResetApp}
              title="Click to reset application to saved layout or default"
            >
              BDCHM Interactive Documentation
            </h1>
            <p className="text-sm text-blue-100">BioData Catalyst Harmonized Model Explorer</p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="font-semibold">Presets:</span>
            <a
              href={generatePresetURL('classesOnly')}
              className="px-3 py-1 bg-blue-700 hover:bg-blue-800 rounded transition-colors"
              title="Show only classes"
            >
              Classes
            </a>
            <a
              href={generatePresetURL('classesAndEnums')}
              className="px-3 py-1 bg-blue-700 hover:bg-blue-800 rounded transition-colors"
              title="Classes on left, enums on right"
            >
              Classes + Enums
            </a>
            <a
              href={generatePresetURL('allSections')}
              className="px-3 py-1 bg-blue-700 hover:bg-blue-800 rounded transition-colors"
              title="Show all sections"
            >
              All
            </a>
            <a
              href={generatePresetURL('variableExplorer')}
              className="px-3 py-1 bg-blue-700 hover:bg-blue-800 rounded transition-colors"
              title="Variables on left, classes on right"
            >
              Variables
            </a>
            <div className="relative">
              {hasLocalStorage ? (
                <button
                  onClick={handleResetLayout}
                  className="px-3 py-1 bg-orange-600 hover:bg-orange-700 rounded transition-colors relative"
                  title="Clear saved layout from browser storage"
                >
                  Reset Layout
                  {showSaveConfirm && (
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-orange-700 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      Layout reset!
                    </span>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleSaveLayout}
                  className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded transition-colors relative"
                  title="Save current layout to browser storage"
                >
                  Save Layout
                  {showSaveConfirm && (
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-green-700 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      Layout saved!
                    </span>
                  )}
                </button>
              )}
            </div>
            <div className="relative">
              <button
                onMouseEnter={() => setShowUrlHelp(true)}
                onMouseLeave={() => setShowUrlHelp(false)}
                className="px-2 py-1 bg-blue-700 hover:bg-blue-800 rounded transition-colors"
                title="URL format help"
              >
                ?
              </button>
              {showUrlHelp && (
                <div className="absolute right-0 top-full mt-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-white border border-gray-300 dark:border-slate-600 rounded-lg shadow-lg p-4 text-xs w-80 z-50">
                  <h4 className="font-semibold mb-2">Shareable URL Format</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="font-mono bg-gray-100 dark:bg-slate-800 px-1 py-0.5 rounded">?l=c,e</span>
                      <span className="ml-2">Left panel sections</span>
                    </div>
                    <div>
                      <span className="font-mono bg-gray-100 dark:bg-slate-800 px-1 py-0.5 rounded">r=s,v</span>
                      <span className="ml-2">Right panel sections</span>
                    </div>
                    <div>
                      <span className="font-mono bg-gray-100 dark:bg-slate-800 px-1 py-0.5 rounded">w=30,40,30</span>
                      <span className="ml-2">Panel widths (%)</span>
                    </div>
                    <div>
                      <span className="font-mono bg-gray-100 dark:bg-slate-800 px-1 py-0.5 rounded">sel=Condition</span>
                      <span className="ml-2">Selected element name</span>
                    </div>
                    <div>
                      <span className="font-mono bg-gray-100 dark:bg-slate-800 px-1 py-0.5 rounded">selType=class</span>
                      <span className="ml-2">Element type (class/enum/slot/variable)</span>
                    </div>
                    <div className="mt-3 pt-2 border-t border-gray-200 dark:border-slate-600">
                      <div className="font-semibold mb-1">Section codes:</div>
                      <div className="grid grid-cols-2 gap-1">
                        <span><span className="font-mono bg-gray-100 dark:bg-slate-800 px-1 rounded">c</span> = classes</span>
                        <span><span className="font-mono bg-gray-100 dark:bg-slate-800 px-1 rounded">e</span> = enums</span>
                        <span><span className="font-mono bg-gray-100 dark:bg-slate-800 px-1 rounded">s</span> = slots</span>
                        <span><span className="font-mono bg-gray-100 dark:bg-slate-800 px-1 rounded">v</span> = variables</span>
                      </div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-gray-200 dark:border-slate-600 text-gray-600 dark:text-gray-400">
                      Configuration is automatically saved to the URL. Click "Save Layout" to persist to browser storage.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content: Panel layout with link overlay */}
      <div className="flex relative overflow-hidden">
        <PanelLayout
          leftPanel={
            <ElementsPanel
              position="left"
              sections={leftSections}
              onSectionsChange={setLeftSections}
              collections={modelData?.collections || new Map()}
              onSelectElement={handleOpenDialog}
              onElementHover={setHoveredElement}
              onElementLeave={() => setHoveredElement(null)}
            />
          }
          leftPanelEmpty={leftSections.length === 0}
          rightPanel={
            <ElementsPanel
              position="right"
              sections={rightSections}
              onSectionsChange={setRightSections}
              collections={modelData?.collections || new Map()}
              onSelectElement={handleOpenDialog}
              onElementHover={setHoveredElement}
              onElementLeave={() => setHoveredElement(null)}
            />
          }
          rightPanelEmpty={rightSections.length === 0}
          showSpacer={displayMode === 'dialog'}
        />

        {/* Stacked detail panels (when enough space) */}
        {displayMode === 'stacked' && openDialogs.length > 0 && (
          <div className="flex-1 border-l border-gray-200 dark:border-slate-700">
            <DetailPanelStack
              panels={openDialogs.map(d => ({
                id: d.id,
                element: d.element,
                elementType: d.elementType
              }))}
              onNavigate={handleNavigate}
              onClose={handleCloseDialog}
            />
          </div>
        )}

        {/* SVG Link Overlay */}
        {modelData && (
          <LinkOverlay
            leftPanel={leftPanelData}
            rightPanel={rightPanelData}
            hoveredElement={hoveredElement}
            allSlots={(modelData.collections.get('slot') as any)?.getSlots?.() || new Map()}
          />
        )}
      </div>

      {/* Detail dialogs - only render when in dialog mode */}
      {displayMode === 'dialog' && openDialogs.map((dialog, index) => (
        <DetailDialog
          key={dialog.id}
          element={dialog.element}
          onNavigate={handleNavigate}
          onClose={() => handleCloseDialog(dialog.id)}
          onChange={(position, size) => handleDialogChange(dialog.id, position, size)}
          dialogIndex={index}
          initialPosition={{ x: dialog.x, y: dialog.y }}
          initialSize={{ width: dialog.width, height: dialog.height }}
        />
      ))}
    </div>
  );
}

export default App;
