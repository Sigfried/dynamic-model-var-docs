import { useState, useMemo } from 'react';
import ElementsPanel, { type ToggleButtonData } from './components/ElementsPanel';
import type { SectionData } from './components/Section';
import DetailDialog from './components/DetailDialog';
import DetailPanelStack from './components/DetailPanelStack';
import PanelLayout from './components/PanelLayout';
import LinkOverlay from './components/LinkOverlay';
import { generatePresetURL } from './utils/statePersistence';
import { ELEMENT_TYPES, getAllElementTypeIds, type ElementTypeId } from './models/ElementRegistry';
import type { ElementCollection } from './models/Element';
import { useModelData } from './hooks/useModelData';
import { useDialogState } from './hooks/useDialogState';
import { useLayoutState } from './hooks/useLayoutState';

function App() {
  const [hoveredElement, setHoveredElement] = useState<{ type: string; name: string } | null>(null);

  // Load model data
  const { modelData, loading, error } = useModelData();

  // Manage dialog state
  const {
    openDialogs,
    hasRestoredFromURL,
    handleOpenDialog,
    handleCloseDialog,
    handleDialogChange,
    getDialogStates
  } = useDialogState({ modelData });

  // Manage layout state
  const {
    leftSections,
    rightSections,
    setLeftSections,
    setRightSections,
    displayMode,
    showUrlHelp,
    setShowUrlHelp,
    showSaveConfirm,
    hasLocalStorage,
    handleSaveLayout,
    handleResetLayout,
    handleResetApp
  } = useLayoutState({ hasRestoredFromURL, getDialogStates });

  // Navigation handler - opens a new dialog
  const handleNavigate = (elementName: string, elementType: 'class' | 'enum' | 'slot') => {
    handleOpenDialog({ type: elementType, name: elementName });
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

  // Build toggle button data from ELEMENT_TYPES registry (must be before early returns)
  const toggleButtons = useMemo<ToggleButtonData[]>(() => {
    return getAllElementTypeIds().map(typeId => {
      const metadata = ELEMENT_TYPES[typeId];
      return {
        id: typeId,
        icon: metadata.icon,
        label: metadata.pluralLabel,
        activeColor: metadata.color.toggleActive,
        inactiveColor: metadata.color.toggleInactive
      };
    });
  }, []);

  // Build section data maps for left and right panels (must be before early returns)
  const leftSectionData = useMemo<Map<string, SectionData>>(() => {
    if (!modelData) return new Map();
    const map = new Map<string, SectionData>();
    modelData.collections.forEach((collection, typeId) => {
      map.set(typeId, collection.getSectionData('left'));
    });
    return map;
  }, [modelData]);

  const rightSectionData = useMemo<Map<string, SectionData>>(() => {
    if (!modelData) return new Map();
    const map = new Map<string, SectionData>();
    modelData.collections.forEach((collection, typeId) => {
      map.set(typeId, collection.getSectionData('right'));
    });
    return map;
  }, [modelData]);

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
              sectionData={leftSectionData}
              toggleButtons={toggleButtons}
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
              sectionData={rightSectionData}
              toggleButtons={toggleButtons}
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
