import { useState, useEffect } from 'react';
import ClassTree from './components/ClassTree';
import EnumPanel from './components/EnumPanel';
import SlotPanel from './components/SlotPanel';
import VariablesSection from './components/VariablesSection';
import DetailView from './components/DetailView';
import { loadModelData } from './utils/dataLoader';
import type { ClassNode, EnumDefinition, SlotDefinition, VariableSpec, ModelData } from './types';

type SelectedEntity = ClassNode | EnumDefinition | SlotDefinition | VariableSpec | undefined;

interface PanelToggles {
  showClasses: boolean;
  showEnums: boolean;
  showSlots: boolean;
  showVariables: boolean;
}

function App() {
  const [modelData, setModelData] = useState<ModelData>();
  const [selectedEntity, setSelectedEntity] = useState<SelectedEntity>();
  const [classMap, setClassMap] = useState<Map<string, ClassNode>>(new Map());
  const [panelToggles, setPanelToggles] = useState<PanelToggles>({
    showClasses: true,
    showEnums: true,
    showSlots: true,
    showVariables: true
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

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
            <span className="font-semibold">Show Panels:</span>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={panelToggles.showClasses}
                onChange={(e) => setPanelToggles({ ...panelToggles, showClasses: e.target.checked })}
                className="w-4 h-4"
              />
              <span>Classes</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={panelToggles.showEnums}
                onChange={(e) => setPanelToggles({ ...panelToggles, showEnums: e.target.checked })}
                className="w-4 h-4"
              />
              <span>Enums</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={panelToggles.showSlots}
                onChange={(e) => setPanelToggles({ ...panelToggles, showSlots: e.target.checked })}
                className="w-4 h-4"
              />
              <span>Slots</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={panelToggles.showVariables}
                onChange={(e) => setPanelToggles({ ...panelToggles, showVariables: e.target.checked })}
                className="w-4 h-4"
              />
              <span>Variables</span>
            </label>
          </div>
        </div>
      </header>

      {/* Main content: Multi-panel layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar: Collapsible panels */}
        {panelToggles.showClasses && (
          <div className="flex flex-col w-1/4 min-w-[250px] max-w-[400px]">
            {/* Class panel */}
            <div className="flex-1 overflow-hidden">
              <ClassTree
                nodes={modelData?.classHierarchy || []}
                onSelectClass={(node) => setSelectedEntity(node)}
                selectedClass={selectedEntity && 'children' in selectedEntity ? selectedEntity as ClassNode : undefined}
              />
            </div>
          </div>
        )}

        {/* Middle sidebar: Enum, Slot, and Variable sections */}
        {(panelToggles.showEnums || panelToggles.showSlots || panelToggles.showVariables) && (
          <div className="flex flex-col w-1/4 min-w-[250px] max-w-[400px]">
            {/* Enum panel */}
            {panelToggles.showEnums && (
              <div className={`flex-1 overflow-hidden ${(panelToggles.showSlots || panelToggles.showVariables) ? 'border-b border-gray-200 dark:border-slate-700' : ''}`}>
                <EnumPanel
                  enums={modelData?.enums || new Map()}
                  onSelectEnum={(enumDef) => setSelectedEntity(enumDef)}
                  selectedEnum={selectedEntity && 'permissible_values' in selectedEntity ? selectedEntity as EnumDefinition : undefined}
                />
              </div>
            )}
            {/* Slot panel */}
            {panelToggles.showSlots && (
              <div className={`flex-1 overflow-hidden ${panelToggles.showVariables ? 'border-b border-gray-200 dark:border-slate-700' : ''}`}>
                <SlotPanel
                  slots={modelData?.slots || new Map()}
                  onSelectSlot={(slotDef) => setSelectedEntity(slotDef)}
                  selectedSlot={selectedEntity && 'slot_uri' in selectedEntity ? selectedEntity as SlotDefinition : undefined}
                />
              </div>
            )}
            {/* Variables section */}
            {panelToggles.showVariables && (
              <div className="flex-1 overflow-hidden">
                <VariablesSection
                  variables={modelData?.variables || []}
                  onSelectVariable={(variable) => setSelectedEntity(variable)}
                  selectedVariable={selectedEntity && 'variableLabel' in selectedEntity ? selectedEntity as VariableSpec : undefined}
                />
              </div>
            )}
          </div>
        )}

        {/* Right panel: Detail view */}
        <div className="flex-1">
          <DetailView
            selectedEntity={selectedEntity}
            onNavigate={handleNavigate}
            enums={modelData?.enums}
            slots={modelData?.slots}
            classes={classMap}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
