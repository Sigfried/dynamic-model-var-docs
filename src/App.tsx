import { useState, useEffect } from 'react';
import ClassTree from './components/ClassTree';
import DetailView from './components/DetailView';
import { loadSchema, loadVariableSpecs, buildClassHierarchy } from './utils/dataLoader';
import type { ClassNode } from './types';

function App() {
  const [classHierarchy, setClassHierarchy] = useState<ClassNode[]>([]);
  const [selectedClass, setSelectedClass] = useState<ClassNode>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [schema, variables] = await Promise.all([
          loadSchema(),
          loadVariableSpecs()
        ]);

        const hierarchy = buildClassHierarchy(schema, variables);
        setClassHierarchy(hierarchy);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
        setLoading(false);
      }
    }

    loadData();
  }, []);

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
        <h1 className="text-2xl font-bold">BDCHM Interactive Documentation</h1>
        <p className="text-sm text-blue-100">BioData Catalyst Harmonized Model Explorer</p>
      </header>

      {/* Main content: Two-panel layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel: Class tree */}
        <div className="w-1/3 min-w-[300px] max-w-[500px]">
          <ClassTree
            nodes={classHierarchy}
            onSelectClass={setSelectedClass}
            selectedClass={selectedClass}
          />
        </div>

        {/* Right panel: Detail view */}
        <div className="flex-1">
          <DetailView selectedClass={selectedClass} />
        </div>
      </div>
    </div>
  );
}

export default App;
