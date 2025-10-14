import type { ClassNode } from '../types';

interface DetailViewProps {
  selectedClass?: ClassNode;
}

export default function DetailView({ selectedClass }: DetailViewProps) {
  if (!selectedClass) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <p className="text-lg">Select a class from the tree to view details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-white dark:bg-slate-800 text-left">
      <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-6 py-4">
        <h1 className="text-2xl font-bold text-left">{selectedClass.name}</h1>
        {selectedClass.parent && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 text-left">
            extends {selectedClass.parent}
          </p>
        )}
      </div>

      <div className="p-6 space-y-6 text-left">
        {/* Description */}
        {selectedClass.description && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-gray-700 dark:text-gray-300">{selectedClass.description}</p>
          </div>
        )}

        {/* Properties */}
        {selectedClass.properties && Object.keys(selectedClass.properties).length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Properties</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-slate-700">
                    <th className="border border-gray-300 dark:border-slate-600 px-4 py-2 text-left">
                      Property
                    </th>
                    <th className="border border-gray-300 dark:border-slate-600 px-4 py-2 text-left">
                      Type
                    </th>
                    <th className="border border-gray-300 dark:border-slate-600 px-4 py-2 text-left">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(selectedClass.properties).map(([propName, propDef]) => (
                    <tr key={propName} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                      <td className="border border-gray-300 dark:border-slate-600 px-4 py-2 font-mono text-sm">
                        {propName}
                      </td>
                      <td className="border border-gray-300 dark:border-slate-600 px-4 py-2 text-sm">
                        {Array.isArray(propDef.type) ? propDef.type.join(' | ') : propDef.type}
                      </td>
                      <td className="border border-gray-300 dark:border-slate-600 px-4 py-2 text-sm">
                        {propDef.description || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Variables */}
        {selectedClass.variables && selectedClass.variables.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-2">
              Mapped Variables ({selectedClass.variables.length})
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-slate-700">
                    <th className="border border-gray-300 dark:border-slate-600 px-4 py-2 text-left">
                      Label
                    </th>
                    <th className="border border-gray-300 dark:border-slate-600 px-4 py-2 text-left">
                      Data Type
                    </th>
                    <th className="border border-gray-300 dark:border-slate-600 px-4 py-2 text-left">
                      Unit
                    </th>
                    <th className="border border-gray-300 dark:border-slate-600 px-4 py-2 text-left">
                      CURIE
                    </th>
                    <th className="border border-gray-300 dark:border-slate-600 px-4 py-2 text-left">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedClass.variables.map((variable, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                      <td className="border border-gray-300 dark:border-slate-600 px-4 py-2 text-sm font-medium">
                        {variable.variableLabel}
                      </td>
                      <td className="border border-gray-300 dark:border-slate-600 px-4 py-2 text-sm">
                        {variable.dataType}
                      </td>
                      <td className="border border-gray-300 dark:border-slate-600 px-4 py-2 text-sm font-mono">
                        {variable.ucumUnit || '-'}
                      </td>
                      <td className="border border-gray-300 dark:border-slate-600 px-4 py-2 text-sm font-mono">
                        {variable.curie || '-'}
                      </td>
                      <td className="border border-gray-300 dark:border-slate-600 px-4 py-2 text-sm">
                        {variable.variableDescription || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* No variables message */}
        {(!selectedClass.variables || selectedClass.variables.length === 0) && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Mapped Variables</h2>
            <p className="text-gray-500 dark:text-gray-400">No variables mapped to this class</p>
          </div>
        )}
      </div>
    </div>
  );
}
