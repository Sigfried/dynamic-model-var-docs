import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import LayoutManager from './components/LayoutManager';
import { getInitialState, type DialogState } from './utils/statePersistence';
import { useModelData } from './hooks/useModelData';
import { useLayoutState } from './hooks/useLayoutState';
import { DataService } from './services/DataService';

function App() {
  const [hasRestoredFromURL, setHasRestoredFromURL] = useState(false);

  // Load model data
  const { modelData, loading, error } = useModelData();

  // Create DataService for view/model separation
  const dataService = useMemo(() =>
    modelData ? new DataService(modelData) : null,
    [modelData]
  );

  // Dialog states getter - will be set by LayoutManager
  const getDialogStatesRef = useRef<() => DialogState[]>(() => []);

  // Callback for LayoutManager to provide its dialog states getter
  const setDialogStatesGetter = useCallback((getter: () => DialogState[]) => {
    getDialogStatesRef.current = getter;
  }, []);

  // Manage layout state (URL and localStorage persistence)
  const {
    leftSections,
    middleSections,
    rightSections,
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
  } = useLayoutState({
    hasRestoredFromURL,
    getDialogStates: getDialogStatesRef.current
  });

  // Mark as restored after data loads (coordination with LayoutManager)
  useEffect(() => {
    if (!hasRestoredFromURL && dataService) {
      setHasRestoredFromURL(true);
    }
  }, [dataService, hasRestoredFromURL]);

  // Get initial dialogs from URL
  const initialDialogs = useMemo(() => {
    const urlState = getInitialState();
    return urlState.dialogs ?? [];
  }, []);

  // TEMPORARY HACK BECAUSE DARK MODE IS UNREADABLE
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  let darkModeWarning = null;
  if (isDarkMode) {
    darkModeWarning = (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: '#fff3cd',
          color: '#856404',
          padding: '16px',
          textAlign: 'center',
          zIndex: 9999,
          borderBottom: '2px solid #ffc107',
          fontSize: '14px',
        }}>
          ⚠️ <strong>Dark mode is not yet supported.</strong> This app may look broken.
          Please switch your browser/system to light mode for the best experience.
        </div>
    );
  }

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

  if (!dataService) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen">
      {darkModeWarning}
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
            {/* TODO: Restore presets after Stage 4 layout changes complete */}
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

      {/* Main content: LayoutManager handles everything */}
      <LayoutManager
        dataService={dataService}
        leftSections={leftSections}
        middleSections={middleSections}
        rightSections={rightSections}
        setMiddleSections={setMiddleSections}
        setRightSections={setRightSections}
        initialDialogs={initialDialogs}
        setDialogStatesGetter={setDialogStatesGetter}
        onDialogsChange={triggerURLSave}
      />
    </div>
  );
}

export default App;
