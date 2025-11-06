import { useState, useMemo, useCallback, useEffect } from 'react';
import ItemsPanel, { type ToggleButtonData } from './components/ItemsPanel';
import type { SectionData, ItemHoverData } from './components/Section';
import FloatingBoxManager, { type FloatingBoxData } from './components/FloatingBoxManager';
import DetailContent from './components/DetailContent';
import PanelLayout from './components/PanelLayout';
import LinkOverlay from './components/LinkOverlay';
import RelationshipInfoBox from './components/RelationshipInfoBox';
import { generatePresetURL, getInitialState, type DialogState } from './utils/statePersistence';
import { useModelData } from './hooks/useModelData';
import { useLayoutState } from './hooks/useLayoutState';
import { DataService } from './services/DataService';

function App() {
  const [hoveredItem, setHoveredItem] = useState<ItemHoverData | null>(null);
  const [floatingBoxes, setFloatingBoxes] = useState<FloatingBoxData[]>([]);
  const [nextBoxId, setNextBoxId] = useState(0);
  const [hasRestoredFromURL, setHasRestoredFromURL] = useState(false);

  // Load model data
  const { modelData, loading, error } = useModelData();

  // Create DataService for view/model separation
  const dataService = useMemo(() =>
    modelData ? new DataService(modelData) : null,
    [modelData]
  );

  // Convert floating boxes to dialog states for persistence
  const getDialogStates = useCallback((): DialogState[] => {
    if (!dataService) return [];

    return floatingBoxes.map(box => {
      // [sg] this seems to violate architectural principles. why does it need item type?
      const itemType = dataService.getItemType(box.itemId);
      return {
        itemName: box.itemId,
        itemType: itemType ?? 'class', // fallback to 'class'
        x: box.position?.x ?? 100,
        y: box.position?.y ?? 100,
        width: box.size?.width ?? 900,
        height: box.size?.height ?? 350
      };
    });
  }, [floatingBoxes, dataService]);

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

  // Open a new floating box (or bring existing one to front)
  const handleOpenFloatingBox = useCallback((hoverData: { type: string; name: string }, position?: { x: number; y: number }, size?: { width: number; height: number }) => {
    if (!dataService) return;

    const itemId = hoverData.name;

    // Verify item exists
    if (!dataService.itemExists(itemId)) {
      console.warn(`Item "${itemId}" not found`);
      return;
    }

    // Check if this item is already open
    const existingIndex = floatingBoxes.findIndex(b => b.itemId === itemId);

    // If already open, bring to top (move to end of array)
    if (existingIndex !== -1) {
      setFloatingBoxes(prev => {
        const updated = [...prev];
        const [existing] = updated.splice(existingIndex, 1);
        return [...updated, existing];
      });
      return;
    }

    // Otherwise, create new persistent box
    const CASCADE_OFFSET = 40;
    const defaultPosition = {
      x: 100 + (floatingBoxes.length * CASCADE_OFFSET),
      y: window.innerHeight - 400 + (floatingBoxes.length * CASCADE_OFFSET)
    };
    const defaultSize = { width: 900, height: 350 };

    const metadata = dataService.getFloatingBoxMetadata(itemId);
    if (!metadata) {
      console.warn(`Could not get metadata for item "${itemId}"`);
      return;
    }

    const newBox: FloatingBoxData = {
      id: `box-${nextBoxId}`,
      mode: 'persistent',
      metadata,
      content: <DetailContent itemId={itemId} dataService={dataService} hideHeader={true} />,
      itemId,
      position: position ?? defaultPosition,
      size: size ?? defaultSize
    };

    setFloatingBoxes(prev => [...prev, newBox]);
    setNextBoxId(prev => prev + 1);
  }, [dataService, floatingBoxes, nextBoxId, displayMode]);

  // Get item ID for hovered item (for RelationshipInfoBox)
  const hoveredItemId = useMemo(() => {
    return hoveredItem?.name ?? null;
  }, [hoveredItem]);

  // Navigation handler - opens a new floating box
  const handleNavigate = useCallback((itemName: string, itemType: 'class' | 'enum' | 'slot' | 'variable') => {
    handleOpenFloatingBox({ type: itemType, name: itemName });
  }, [handleOpenFloatingBox]);

  // Handle RelationshipInfoBox upgrade to persistent floating box
  const handleUpgradeRelationshipBox = useCallback(() => {
    if (!hoveredItem || !hoveredItemId || !dataService) return;

    // Use cursor position for the new persistent box
    const position = {
      x: hoveredItem.cursorX,
      y: hoveredItem.cursorY
    };

    // Check if already open
    const existingIndex = floatingBoxes.findIndex(b => b.itemId === hoveredItemId);

    // If already open, just bring to front and hide RelationshipInfoBox
    if (existingIndex !== -1) {
      setFloatingBoxes(prev => {
        const updated = [...prev];
        const [existing] = updated.splice(existingIndex, 1);
        return [...updated, existing];
      });
      setHoveredItem(null); // Hide RelationshipInfoBox after upgrade
      return;
    }

    // Create new persistent box with detail content
    const metadata = dataService.getFloatingBoxMetadata(hoveredItemId);
    if (!metadata) {
      console.warn(`Could not get metadata for item "${hoveredItemId}"`);
      return;
    }

    const newBox: FloatingBoxData = {
      id: `box-${nextBoxId}`,
      mode: 'persistent',
      metadata,
      content: <DetailContent itemId={hoveredItemId} dataService={dataService} hideHeader={true} />,
      itemId: hoveredItemId,
      position,
      size: { width: 700, height: 400 }
    };

    setFloatingBoxes(prev => [...prev, newBox]);
    setNextBoxId(prev => prev + 1);
    setHoveredItem(null); // Hide RelationshipInfoBox after upgrade
  }, [hoveredItem, hoveredItemId, dataService, floatingBoxes, nextBoxId, displayMode]);

  // Close a floating box
  const handleCloseFloatingBox = useCallback((id: string) => {
    setFloatingBoxes(prev => prev.filter(b => b.id !== id));
  }, []);

  // Update floating box position/size
  const handleFloatingBoxChange = useCallback((id: string, position: { x: number; y: number }, size: { width: number; height: number }) => {
    setFloatingBoxes(prev => prev.map(b =>
      b.id === id ? { ...b, position, size } : b
    ));
  }, []);

  // Restore floating boxes from URL after data loads (runs once)
  useEffect(() => {
    // Only run once after data loads
    if (hasRestoredFromURL) return;
    if (!dataService) return;

    // Mark as restored
    setHasRestoredFromURL(true);

    const urlState = getInitialState();

    // Restore floating boxes from URL dialog state
    if (urlState.dialogs && urlState.dialogs.length > 0) {
      const restoredBoxes: FloatingBoxData[] = [];
      let boxIdCounter = 0;

      urlState.dialogs.forEach(dialogState => {
        const itemId = dialogState.itemName;

        // Verify item exists
        if (dataService.itemExists(itemId)) {
          const metadata = dataService.getFloatingBoxMetadata(itemId);
          if (metadata) {
            restoredBoxes.push({
              id: `box-${boxIdCounter}`,
              mode: 'persistent',
              metadata,
              content: <DetailContent itemId={itemId} dataService={dataService} hideHeader={true} />,
              itemId,
              position: { x: dialogState.x, y: dialogState.y },
              size: { width: dialogState.width, height: dialogState.height }
            });
            boxIdCounter++;
          }
        }
      });

      // Set all boxes at once
      if (restoredBoxes.length > 0) {
        setFloatingBoxes(restoredBoxes);
        setNextBoxId(boxIdCounter);
      }
    }
  }, [dataService, hasRestoredFromURL, displayMode]);


  // Build toggle button data from DataService (must be before early returns)
  const toggleButtons = useMemo<ToggleButtonData[]>(() => {
    return dataService?.getToggleButtonsData() ?? [];
  }, [dataService]);

  // Build section data maps for left and right panels (must be before early returns)
  const leftSectionData = useMemo<Map<string, SectionData>>(() => {
    return dataService?.getAllSectionsData('left') ?? new Map();
  }, [dataService]);

  const rightSectionData = useMemo<Map<string, SectionData>>(() => {
    return dataService?.getAllSectionsData('right') ?? new Map();
  }, [dataService]);

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
            <ItemsPanel
              position="left"
              sections={leftSections}
              onSectionsChange={setLeftSections}
              sectionData={leftSectionData}
              toggleButtons={toggleButtons}
              onSelectItem={handleOpenFloatingBox}
              onItemHover={setHoveredItem}
              onItemLeave={() => setHoveredItem(null)}
            />
          }
          leftPanelEmpty={leftSections.length === 0}
          rightPanel={
            <ItemsPanel
              position="right"
              sections={rightSections}
              onSectionsChange={setRightSections}
              sectionData={rightSectionData}
              toggleButtons={toggleButtons}
              onSelectItem={handleOpenFloatingBox}
              onItemHover={setHoveredItem}
              onItemLeave={() => setHoveredItem(null)}
            />
          }
          rightPanelEmpty={rightSections.length === 0}
          showSpacer={displayMode === 'dialog'}
        />

        {/* SVG Link Overlay */}
        <LinkOverlay
          leftPanelTypes={leftSections}
          rightPanelTypes={rightSections}
          dataService={dataService}
          hoveredItem={hoveredItem}
        />

        {/* Floating Box Manager - handles both stacked and dialog modes */}
        <FloatingBoxManager
          boxes={floatingBoxes}
          displayMode={displayMode}
          onNavigate={handleNavigate}
          onClose={handleCloseFloatingBox}
          onChange={handleFloatingBoxChange}
        />

        {/* Relationship Info Box (transitory, follows cursor) */}
        <RelationshipInfoBox
          itemId={hoveredItemId}
          dataService={dataService}
          cursorPosition={hoveredItem ? { x: hoveredItem.cursorX, y: hoveredItem.cursorY } : null}
          onNavigate={handleNavigate}
          onUpgrade={handleUpgradeRelationshipBox}
        />
      </div>
    </div>
  );
}

export default App;
