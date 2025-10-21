import { useState, useEffect } from 'react';
import ElementsPanel from './components/ElementsPanel';
import DetailPanel from './components/DetailPanel';
import PanelLayout from './components/PanelLayout';
import { loadModelData } from './utils/dataLoader';
import { getInitialState, saveStateToURL, saveStateToLocalStorage, generatePresetURL } from './utils/statePersistence';
import type { ClassNode, EnumDefinition, SlotDefinition, VariableSpec, ModelData } from './types';

type SelectedEntity = ClassNode | EnumDefinition | SlotDefinition | VariableSpec | undefined;
type SectionType = 'classes' | 'enums' | 'slots' | 'variables';

function App() {
  const [modelData, setModelData] = useState<ModelData>();
  const [selectedEntity, setSelectedEntity] = useState<SelectedEntity>();
  const [classMap, setClassMap] = useState<Map<string, ClassNode>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [showUrlHelp, setShowUrlHelp] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);

  // Load initial state from URL or localStorage
  const initialState = getInitialState();
  const [leftSections, setLeftSections] = useState<SectionType[]>(initialState.leftSections);
  const [rightSections, setRightSections] = useState<SectionType[]>(initialState.rightSections);
  const [widths, setWidths] = useState(initialState.widths);

  // Redirect to add trailing slash if missing
  useEffect(() => {
    const path = window.location.pathname;
    const base = '/dynamic-model-var-docs';
    if (path === base) {
      // Redirect to add trailing slash
      window.location.replace(base + '/' + window.location.search);
    }
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

  // Restore selected entity from initial state after data loads
  useEffect(() => {
    if (modelData && !selectedEntity && initialState.selectedEntityName && initialState.selectedEntityType) {
      const { selectedEntityName, selectedEntityType } = initialState;

      if (selectedEntityType === 'class') {
        // Build flat map to find class
        const map = new Map<string, ClassNode>();
        const addClassToMap = (node: ClassNode) => {
          map.set(node.name, node);
          node.children.forEach(addClassToMap);
        };
        modelData.classHierarchy.forEach(addClassToMap);
        const classNode = map.get(selectedEntityName);
        if (classNode) setSelectedEntity(classNode);
      } else if (selectedEntityType === 'enum') {
        const enumDef = modelData.enums.get(selectedEntityName);
        if (enumDef) setSelectedEntity(enumDef);
      } else if (selectedEntityType === 'slot') {
        const slotDef = modelData.slots.get(selectedEntityName);
        if (slotDef) setSelectedEntity(slotDef);
      } else if (selectedEntityType === 'variable') {
        const variable = modelData.variables.find(v => v.variableLabel === selectedEntityName);
        if (variable) setSelectedEntity(variable);
      }
    }
  }, [modelData]);

  // Determine selected entity name and type for state persistence
  const getSelectedEntityInfo = () => {
    if (!selectedEntity) return { name: undefined, type: undefined };
    if ('children' in selectedEntity) return { name: selectedEntity.name, type: 'class' as const };
    if ('permissible_values' in selectedEntity) return { name: selectedEntity.name, type: 'enum' as const };
    if ('slot_uri' in selectedEntity) return { name: selectedEntity.name, type: 'slot' as const };
    if ('variableLabel' in selectedEntity) return { name: selectedEntity.variableLabel, type: 'variable' as const };
    return { name: undefined, type: undefined };
  };

  // Save state when it changes
  useEffect(() => {
    const { name, type } = getSelectedEntityInfo();
    const state = {
      leftSections,
      rightSections,
      widths,
      selectedEntityName: name,
      selectedEntityType: type
    };
    saveStateToURL(state);
  }, [leftSections, rightSections, widths, selectedEntity]);

  // Save current layout to localStorage
  const handleSaveLayout = () => {
    const { name, type } = getSelectedEntityInfo();
    const state = {
      leftSections,
      rightSections,
      widths,
      selectedEntityName: name,
      selectedEntityType: type
    };
    saveStateToLocalStorage(state);
    setShowSaveConfirm(true);
    setTimeout(() => setShowSaveConfirm(false), 2000);
  };

  // Navigation handler
  const handleNavigate = (entityName: string, entityType: 'class' | 'enum' | 'slot') => {
    if (entityType === 'enum') {
      const enumDef = modelData?.enums.get(entityName);
      if (enumDef) setSelectedEntity(enumDef);
    } else if (entityType === 'slot') {
      const slotDef = modelData?.slots.get(entityName);
      if (slotDef) setSelectedEntity(slotDef);
    } else if (entityType === 'class') {
      const classNode = classMap.get(entityName);
      if (classNode) setSelectedEntity(classNode);
    }
  };

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
            <h1 className="text-2xl font-bold">BDCHM Interactive Documentation</h1>
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

      {/* Main content: Panel layout */}
      <PanelLayout
        leftPanel={
          modelData ? (
            <ElementsPanel
              position="left"
              sections={leftSections}
              onSectionsChange={setLeftSections}
              forceSingleColumn={rightSections.length > 0}
              classHierarchy={modelData.classHierarchy}
              enums={modelData.enums}
              slots={modelData.slots}
              variables={modelData.variables}
              selectedEntity={selectedEntity}
              onSelectEntity={setSelectedEntity}
            />
          ) : undefined
        }
        leftPanelEmpty={leftSections.length === 0}
        detailPanel={
          selectedEntity ? (
            <DetailPanel
              selectedEntity={selectedEntity}
              onNavigate={handleNavigate}
              onClose={() => setSelectedEntity(undefined)}
              enums={modelData?.enums}
              slots={modelData?.slots}
              classes={classMap}
            />
          ) : undefined
        }
        rightPanel={
          modelData ? (
            <ElementsPanel
              position="right"
              sections={rightSections}
              onSectionsChange={setRightSections}
              forceSingleColumn={leftSections.length > 0}
              classHierarchy={modelData.classHierarchy}
              enums={modelData.enums}
              slots={modelData.slots}
              variables={modelData.variables}
              selectedEntity={selectedEntity}
              onSelectEntity={setSelectedEntity}
            />
          ) : undefined
        }
        rightPanelEmpty={rightSections.length === 0}
        initialWidths={widths}
        onWidthsChange={setWidths}
      />
    </div>
  );
}

export default App;
