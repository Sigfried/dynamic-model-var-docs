import { useState, useEffect, useMemo } from 'react';
import ElementsPanel from './components/ElementsPanel';
import DetailDialog from './components/DetailDialog';
import DetailPanelStack from './components/DetailPanelStack';
import PanelLayout from './components/PanelLayout';
import LinkOverlay from './components/LinkOverlay';
import { loadModelData } from './utils/dataLoader';
import { getInitialState, saveStateToURL, saveStateToLocalStorage, generatePresetURL, type DialogState } from './utils/statePersistence';
import type { ClassNode, EnumDefinition, SlotDefinition, VariableSpec, ModelData } from './types';

type SelectedEntity = ClassNode | EnumDefinition | SlotDefinition | VariableSpec;
type SectionType = 'classes' | 'enums' | 'slots' | 'variables';

// Helper to flatten class hierarchy into a list
function flattenClassHierarchy(nodes: ClassNode[]): ClassNode[] {
  const result: ClassNode[] = [];
  const visit = (node: ClassNode) => {
    result.push(node);
    node.children.forEach(visit);
  };
  nodes.forEach(visit);
  return result;
}

interface OpenDialog {
  id: string;
  entity: SelectedEntity;
  entityType: 'class' | 'enum' | 'slot' | 'variable';
  x: number;
  y: number;
  width: number;
  height: number;
}

function App() {
  const [modelData, setModelData] = useState<ModelData>();
  const [openDialogs, setOpenDialogs] = useState<OpenDialog[]>([]);
  const [classMap, setClassMap] = useState<Map<string, ClassNode>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [showUrlHelp, setShowUrlHelp] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [hasLocalStorage, setHasLocalStorage] = useState(false);
  const [hasRestoredFromURL, setHasRestoredFromURL] = useState(false);
  const [nextDialogId, setNextDialogId] = useState(0);
  const [displayMode, setDisplayMode] = useState<'stacked' | 'dialog'>('dialog');

  // Load initial state from URL or localStorage
  const initialState = getInitialState();
  const [leftSections, setLeftSections] = useState<SectionType[]>(initialState.leftSections);
  const [rightSections, setRightSections] = useState<SectionType[]>(initialState.rightSections);

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

        // Build flat map of class names to class nodes for navigation
        const map = new Map<string, ClassNode>();
        const addClassToMap = (node: ClassNode) => {
          map.set(node.name, node);
          node.children.forEach(addClassToMap);
        };
        data.classHierarchy.forEach(addClassToMap);
        setClassMap(map);

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
    if (!modelData || classMap.size === 0) return;

    // Mark as restored
    setHasRestoredFromURL(true);

    const urlState = getInitialState();

    // Restore dialogs from new format
    if (urlState.dialogs && urlState.dialogs.length > 0) {
      const restoredDialogs: OpenDialog[] = [];
      let dialogIdCounter = 0;

      urlState.dialogs.forEach(dialogState => {
        let entity: SelectedEntity | null = null;

        if (dialogState.entityType === 'class') {
          entity = classMap.get(dialogState.entityName) || null;
        } else if (dialogState.entityType === 'enum') {
          entity = modelData.enums.get(dialogState.entityName) || null;
        } else if (dialogState.entityType === 'slot') {
          entity = modelData.slots.get(dialogState.entityName) || null;
        } else if (dialogState.entityType === 'variable') {
          entity = modelData.variables.find(v => v.variableLabel === dialogState.entityName) || null;
        }

        if (entity) {
          restoredDialogs.push({
            id: `dialog-${dialogIdCounter}`,
            entity,
            entityType: dialogState.entityType,
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
  }, [modelData, classMap, hasRestoredFromURL]);

  // Measure available space and set display mode
  useEffect(() => {
    const PANEL_MAX_WIDTH = 450;
    const EMPTY_PANEL_WIDTH = 180;
    const GUTTER_WIDTH = 160;
    const SPACE_THRESHOLD = 600;

    const measureSpace = () => {
      const windowWidth = window.innerWidth;

      // Calculate panel widths
      const leftWidth = leftSections.length === 0 ? EMPTY_PANEL_WIDTH : PANEL_MAX_WIDTH;
      const rightWidth = rightSections.length === 0 ? EMPTY_PANEL_WIDTH : PANEL_MAX_WIDTH;
      const gutterWidth = (leftSections.length > 0 && rightSections.length > 0) ? GUTTER_WIDTH : 0;

      // Calculate remaining space
      const usedSpace = leftWidth + rightWidth + gutterWidth;
      const remaining = windowWidth - usedSpace;

      setDisplayMode(remaining >= SPACE_THRESHOLD ? 'stacked' : 'dialog');
    };

    measureSpace();
    window.addEventListener('resize', measureSpace);
    return () => window.removeEventListener('resize', measureSpace);
  }, [leftSections, rightSections]);

  // Convert OpenDialog to DialogState
  const getDialogStates = (): DialogState[] => {
    return openDialogs.map(dialog => {
      // Extract entity name (variables use 'variableLabel', others use 'name')
      const entityName = dialog.entityType === 'variable'
        ? (dialog.entity as VariableSpec).variableLabel
        : (dialog.entity as ClassNode | EnumDefinition | SlotDefinition).name;

      return {
        entityName,
        entityType: dialog.entityType,
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
        setLeftSections(state.leftSections || []);
        setRightSections(state.rightSections || []);

        // Restore dialogs if they were in the saved state
        if (state.dialogs && state.dialogs.length > 0 && modelData && classMap.size > 0) {
          const restoredDialogs: OpenDialog[] = [];
          let dialogIdCounter = nextDialogId;

          state.dialogs.forEach((dialogState: DialogState) => {
            let entity: SelectedEntity | null = null;

            if (dialogState.entityType === 'class') {
              entity = classMap.get(dialogState.entityName) || null;
            } else if (dialogState.entityType === 'enum') {
              entity = modelData.enums.get(dialogState.entityName) || null;
            } else if (dialogState.entityType === 'slot') {
              entity = modelData.slots.get(dialogState.entityName) || null;
            } else if (dialogState.entityType === 'variable') {
              entity = modelData.variables.find(v => v.variableLabel === dialogState.entityName) || null;
            }

            if (entity) {
              restoredDialogs.push({
                id: `dialog-${dialogIdCounter}`,
                entity,
                entityType: dialogState.entityType,
                x: dialogState.x,
                y: dialogState.y,
                width: dialogState.width,
                height: dialogState.height
              });
              dialogIdCounter++;
            }
          });

          setOpenDialogs(restoredDialogs);
          setNextDialogId(dialogIdCounter);
        } else {
          setOpenDialogs([]);
        }
      } catch (err) {
        console.error('Failed to parse stored state:', err);
      }
    } else {
      // Reset to default (classes only preset)
      setLeftSections(['classes']);
      setRightSections([]);
      setOpenDialogs([]);
    }
  };

  // Helper to determine entity type
  const getEntityType = (entity: SelectedEntity): 'class' | 'enum' | 'slot' | 'variable' => {
    if ('children' in entity) return 'class';
    if ('permissible_values' in entity) return 'enum';
    if ('slot_uri' in entity) return 'slot';
    return 'variable';
  };

  // Dialog management
  const handleOpenDialog = (entity: SelectedEntity, position?: { x: number; y: number }, size?: { width: number; height: number }) => {
    const entityType = getEntityType(entity);

    // Get entity name (variables use 'variableLabel', others use 'name')
    const entityName = entityType === 'variable'
      ? (entity as VariableSpec).variableLabel
      : (entity as ClassNode | EnumDefinition | SlotDefinition).name;

    // Check if this entity is already open
    const existingIndex = openDialogs.findIndex(d => {
      const existingName = d.entityType === 'variable'
        ? (d.entity as VariableSpec).variableLabel
        : (d.entity as ClassNode | EnumDefinition | SlotDefinition).name;
      return existingName === entityName && d.entityType === entityType;
    });

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
      entity,
      entityType,
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
  const handleNavigate = (entityName: string, entityType: 'class' | 'enum' | 'slot') => {
    if (entityType === 'enum') {
      const enumDef = modelData?.enums.get(entityName);
      if (enumDef) handleOpenDialog(enumDef);
    } else if (entityType === 'slot') {
      const slotDef = modelData?.slots.get(entityName);
      if (slotDef) handleOpenDialog(slotDef);
    } else if (entityType === 'class') {
      const classNode = classMap.get(entityName);
      if (classNode) handleOpenDialog(classNode);
    }
  };

  // Memoize panel data to prevent infinite re-renders in LinkOverlay
  const leftPanelData = useMemo(() => ({
    classes: leftSections.includes('classes') && modelData
      ? flattenClassHierarchy(modelData.classHierarchy)
      : [],
    enums: leftSections.includes('enums') && modelData
      ? modelData.enums
      : new Map(),
    slots: leftSections.includes('slots') && modelData
      ? modelData.slots
      : new Map(),
    variables: leftSections.includes('variables') && modelData
      ? modelData.variables
      : []
  }), [leftSections, modelData]);

  const rightPanelData = useMemo(() => ({
    classes: rightSections.includes('classes') && modelData
      ? flattenClassHierarchy(modelData.classHierarchy)
      : [],
    enums: rightSections.includes('enums') && modelData
      ? modelData.enums
      : new Map(),
    slots: rightSections.includes('slots') && modelData
      ? modelData.slots
      : new Map(),
    variables: rightSections.includes('variables') && modelData
      ? modelData.variables
      : []
  }), [rightSections, modelData]);

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
                      <span className="ml-2">Selected entity name</span>
                    </div>
                    <div>
                      <span className="font-mono bg-gray-100 dark:bg-slate-800 px-1 py-0.5 rounded">selType=class</span>
                      <span className="ml-2">Entity type (class/enum/slot/variable)</span>
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
              classHierarchy={modelData?.classHierarchy || []}
              enums={modelData?.enums || new Map()}
              slots={modelData?.slots || new Map()}
              variables={modelData?.variables || []}
              selectedEntity={openDialogs.length > 0 ? openDialogs[0].entity : undefined}
              onSelectEntity={handleOpenDialog}
            />
          }
          leftPanelEmpty={leftSections.length === 0}
          rightPanel={
            <ElementsPanel
              position="right"
              sections={rightSections}
              onSectionsChange={setRightSections}
              classHierarchy={modelData?.classHierarchy || []}
              enums={modelData?.enums || new Map()}
              slots={modelData?.slots || new Map()}
              variables={modelData?.variables || []}
              selectedEntity={openDialogs.length > 0 ? openDialogs[0].entity : undefined}
              onSelectEntity={handleOpenDialog}
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
                entity: d.entity,
                entityType: d.entityType
              }))}
              onNavigate={handleNavigate}
              onClose={handleCloseDialog}
              enums={modelData?.enums}
              slots={modelData?.slots}
              classes={classMap}
            />
          </div>
        )}

        {/* SVG Link Overlay */}
        {modelData && (
          <LinkOverlay
            leftPanel={leftPanelData}
            rightPanel={rightPanelData}
          />
        )}
      </div>

      {/* Detail dialogs - only render when in dialog mode */}
      {displayMode === 'dialog' && openDialogs.map((dialog, index) => (
        <DetailDialog
          key={dialog.id}
          selectedEntity={dialog.entity}
          onNavigate={handleNavigate}
          onClose={() => handleCloseDialog(dialog.id)}
          onChange={(position, size) => handleDialogChange(dialog.id, position, size)}
          enums={modelData?.enums}
          slots={modelData?.slots}
          classes={classMap}
          dialogIndex={index}
          initialPosition={{ x: dialog.x, y: dialog.y }}
          initialSize={{ width: dialog.width, height: dialog.height }}
        />
      ))}
    </div>
  );
}

export default App;
