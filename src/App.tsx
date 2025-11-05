import { useState, useMemo, useCallback, useEffect } from 'react';
import ElementsPanel, { type ToggleButtonData } from './components/ElementsPanel';
import type { SectionData, ElementHoverData } from './components/Section';
import FloatingBoxManager, { type FloatingBoxData } from './components/FloatingBoxManager';
import DetailContent from './components/DetailContent';
import PanelLayout from './components/PanelLayout';
import LinkOverlay from './components/LinkOverlay';
import RelationshipInfoBox from './components/RelationshipInfoBox';
import { generatePresetURL, getInitialState, type DialogState } from './utils/statePersistence';
import { ELEMENT_TYPES, getAllElementTypeIds, type ElementTypeId } from './models/ElementRegistry';
import type { ElementCollection } from './models/Element';
import { useModelData } from './hooks/useModelData';
import { useLayoutState } from './hooks/useLayoutState';
import { getElementName, findDuplicateIndex } from './utils/duplicateDetection';

function App() {
  const [hoveredElement, setHoveredElement] = useState<ElementHoverData | null>(null);
  const [floatingBoxes, setFloatingBoxes] = useState<FloatingBoxData[]>([]);
  const [nextBoxId, setNextBoxId] = useState(0);
  const [hasRestoredFromURL, setHasRestoredFromURL] = useState(false);

  // Load model data
  const { modelData, loading, error } = useModelData();

  // Convert floating boxes to dialog states for persistence
  const getDialogStates = useCallback((): DialogState[] => {
    return floatingBoxes.map(box => {
      const elementName = getElementName(box.element, box.element.type);
      return {
        elementName,
        elementType: box.element.type,
        x: box.position?.x ?? 100,
        y: box.position?.y ?? 100,
        width: box.size?.width ?? 900,
        height: box.size?.height ?? 350
      };
    });
  }, [floatingBoxes]);

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
    if (!modelData) return;

    const element = modelData.elementLookup.get(hoverData.name);
    if (!element) {
      console.warn(`Element "${hoverData.name}" not found in elementLookup`);
      return;
    }

    // Check if this element is already open
    const existingIndex = findDuplicateIndex(
      floatingBoxes.map(b => ({ element: b.element, elementType: b.element.type })),
      element,
      element.type
    );

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

    const metadata = element.getFloatingBoxMetadata();
    const newBox: FloatingBoxData = {
      id: `box-${nextBoxId}`,
      mode: 'persistent',
      metadata,
      content: <DetailContent element={element} hideHeader={displayMode === 'stacked'} />,
      element,
      position: position ?? defaultPosition,
      size: size ?? defaultSize
    };

    setFloatingBoxes(prev => [...prev, newBox]);
    setNextBoxId(prev => prev + 1);
  }, [modelData, floatingBoxes, nextBoxId, displayMode]);

  // Get Element instance for hovered element (for RelationshipInfoBox)
  const hoveredElementInstance = useMemo(() => {
    if (!hoveredElement || !modelData) return null;
    const collection = modelData.collections.get(hoveredElement.type as ElementTypeId);
    if (!collection) return null;
    return collection.getElement(hoveredElement.name);
  }, [hoveredElement, modelData]);

  // Navigation handler - opens a new floating box
  const handleNavigate = useCallback((elementName: string, elementType: 'class' | 'enum' | 'slot' | 'variable') => {
    handleOpenFloatingBox({ type: elementType, name: elementName });
  }, [handleOpenFloatingBox]);

  // Handle RelationshipInfoBox upgrade to persistent floating box
  const handleUpgradeRelationshipBox = useCallback(() => {
    if (!hoveredElement || !hoveredElementInstance) return;

    // Use cursor position for the new persistent box
    const position = {
      x: hoveredElement.cursorX,
      y: hoveredElement.cursorY
    };

    // Check if already open
    const existingIndex = findDuplicateIndex(
      floatingBoxes.map(b => ({ element: b.element, elementType: b.element.type })),
      hoveredElementInstance,
      hoveredElementInstance.type
    );

    // If already open, just bring to front
    if (existingIndex !== -1) {
      setFloatingBoxes(prev => {
        const updated = [...prev];
        const [existing] = updated.splice(existingIndex, 1);
        return [...updated, existing];
      });
      return;
    }

    // Create new persistent box with relationship content
    const metadata = hoveredElementInstance.getFloatingBoxMetadata();
    const newBox: FloatingBoxData = {
      id: `box-${nextBoxId}`,
      mode: 'persistent',
      metadata,
      content: <DetailContent element={hoveredElementInstance} hideHeader={displayMode === 'stacked'} />,
      element: hoveredElementInstance,
      position,
      size: { width: 700, height: 400 }
    };

    setFloatingBoxes(prev => [...prev, newBox]);
    setNextBoxId(prev => prev + 1);
  }, [hoveredElement, hoveredElementInstance, floatingBoxes, nextBoxId, displayMode]);

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
    if (!modelData) return;

    // Mark as restored
    setHasRestoredFromURL(true);

    const urlState = getInitialState();

    // Restore floating boxes from URL dialog state
    if (urlState.dialogs && urlState.dialogs.length > 0) {
      const restoredBoxes: FloatingBoxData[] = [];
      let boxIdCounter = 0;

      urlState.dialogs.forEach(dialogState => {
        // Look up element using generic collection interface
        const collection = modelData.collections.get(dialogState.elementType);
        const element = collection?.getElement(dialogState.elementName) || null;

        if (element) {
          const metadata = element.getFloatingBoxMetadata();
          restoredBoxes.push({
            id: `box-${boxIdCounter}`,
            mode: 'persistent',
            metadata,
            content: <DetailContent element={element} hideHeader={displayMode === 'stacked'} />,
            element,
            position: { x: dialogState.x, y: dialogState.y },
            size: { width: dialogState.width, height: dialogState.height }
          });
          boxIdCounter++;
        }
      });

      // Set all boxes at once
      if (restoredBoxes.length > 0) {
        setFloatingBoxes(restoredBoxes);
        setNextBoxId(boxIdCounter);
      }
    }
  }, [modelData, hasRestoredFromURL, displayMode]);

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
              onSelectElement={handleOpenFloatingBox}
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
              onSelectElement={handleOpenFloatingBox}
              onElementHover={setHoveredElement}
              onElementLeave={() => setHoveredElement(null)}
            />
          }
          rightPanelEmpty={rightSections.length === 0}
          showSpacer={displayMode === 'dialog'}
        />

        {/* SVG Link Overlay */}
        {modelData && (
          <LinkOverlay
            leftPanel={leftPanelData}
            rightPanel={rightPanelData}
            hoveredElement={hoveredElement}
          />
        )}

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
          element={hoveredElementInstance}
          cursorPosition={hoveredElement ? { x: hoveredElement.cursorX, y: hoveredElement.cursorY } : null}
          onNavigate={handleNavigate}
          onUpgrade={handleUpgradeRelationshipBox}
        />
      </div>
    </div>
  );
}

export default App;
