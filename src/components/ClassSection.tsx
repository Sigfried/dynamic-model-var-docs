import { useState } from 'react';
import type { ClassNode } from '../types';

interface ClassSectionProps {
  nodes: ClassNode[];
  onSelectClass: (node: ClassNode) => void;
  selectedClass?: ClassNode;
  position?: 'left' | 'right';
}

interface ClassTreeNodeProps {
  node: ClassNode;
  onSelectClass: (node: ClassNode) => void;
  selectedClass?: ClassNode;
  level: number;
  position?: 'left' | 'right';
}

function ClassTreeNode({ node, onSelectClass, selectedClass, level, position }: ClassTreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2); // Auto-expand first 2 levels
  const hasChildren = node.children.length > 0;
  const isSelected = selectedClass?.name === node.name;

  return (
    <div className="select-none">
      <div
        id={`class-${node.name}`}
        data-element-type="class"
        data-element-name={node.name}
        data-panel-position={position}
        className={`flex items-center gap-2 px-2 py-1 cursor-pointer rounded hover:bg-gray-100 dark:hover:bg-slate-700 ${
          isSelected ? 'bg-blue-100 dark:bg-blue-900' : ''
        }`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => onSelectClass(node)}
      >
        {hasChildren && (
          <button
            className="w-4 h-4 flex items-center justify-center text-gray-500 hover:text-gray-700"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? '▼' : '▶'}
          </button>
        )}
        {!hasChildren && <span className="w-4" />}
        <span className="flex-1 text-sm font-medium">{node.name}</span>
        {node.abstract && (
          <span className="text-xs text-purple-600 dark:text-purple-400 italic mr-2">
            abstract
          </span>
        )}
        {node.variableCount > 0 && (
          <span className="text-xs px-2 py-0.5 rounded bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-gray-300">
            {node.variableCount}
          </span>
        )}
      </div>
      {hasChildren && isExpanded && (
        <div>
          {node.children.map((child) => (
            <ClassTreeNode
              key={child.name}
              node={child}
              onSelectClass={onSelectClass}
              selectedClass={selectedClass}
              level={level + 1}
              position={position}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ClassSection({ nodes, onSelectClass, selectedClass, position }: ClassSectionProps) {
  return (
    <div className="bg-white dark:bg-slate-800 text-left">
      <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-4 py-3 z-10">
        <h2 className="text-lg font-semibold text-left">Classes</h2>
      </div>
      <div className="p-2">
        {nodes.map((node) => (
          <ClassTreeNode
            key={node.name}
            node={node}
            onSelectClass={onSelectClass}
            selectedClass={selectedClass}
            level={0}
            position={position}
          />
        ))}
      </div>
    </div>
  );
}
