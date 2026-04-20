/**
 * SlotDrilldown - Inline panel showing slots and variables for a class.
 *
 * Must only import from services/DataService, never from models/.
 */

import { useState, useMemo } from 'react';
import type { DataService } from '../services/DataService';
import { EnumDetailCard } from './EnumDetailCard';
import { ClassDetailCard } from './ClassDetailCard';

interface SlotDrilldownProps {
  classId: string;
  dataService: DataService;
  onClose: () => void;
}

type Tab = 'slots' | 'variables';

export function SlotDrilldown({ classId, dataService, onClose }: SlotDrilldownProps) {
  const [activeTab, setActiveTab] = useState<Tab>('slots');
  const [openCard, setOpenCard] = useState<{ type: 'enum' | 'class'; id: string } | null>(null);

  const detail = useMemo(
    () => dataService.getDetailContent(classId),
    [classId, dataService]
  );

  // Extract slots section and variables section from DetailData
  const slotsSection = detail.sections.find(s => s.name === 'Slots');
  const variablesSection = detail.sections.find(s => s.name?.startsWith('Variables'));

  const slotCount = slotsSection?.tableContent?.length ?? 0;
  const varCount = variablesSection?.tableContent?.length ?? 0;

  return (
    <div className="mx-2 mb-2 border border-blue-300 border-t-2 border-t-blue-500 rounded-b-md bg-blue-50/30">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-1.5">
        <div className="text-xs text-gray-500">
          {detail.title}
          {detail.subtitle && <span className="ml-1 text-gray-400">({detail.subtitle})</span>}
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-sm px-1"
          title="Close"
        >
          ✕
        </button>
      </div>

      {/* Description */}
      {detail.description && (
        <div className="px-3 pb-2 text-xs text-gray-500 leading-relaxed">
          {detail.description}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-0.5 px-3 border-b border-gray-200">
        <TabButton
          label="Slots"
          count={slotCount}
          active={activeTab === 'slots'}
          onClick={() => setActiveTab('slots')}
          activeColor="text-blue-600 border-blue-600"
        />
        {varCount > 0 && (
          <TabButton
            label="Variables"
            count={varCount}
            active={activeTab === 'variables'}
            onClick={() => setActiveTab('variables')}
            activeColor="text-amber-600 border-amber-600"
          />
        )}
      </div>

      {/* Tab content */}
      <div className="p-3">
        {activeTab === 'slots' && slotsSection?.tableContent && (
          <SlotTable
            headings={slotsSection.tableHeadings ?? []}
            rows={slotsSection.tableContent as string[][]}
            onRangeClick={(range) => {
              // Classify: if ends in Enum → enum card, if exists as class → class card
              if (range.endsWith('Enum')) {
                setOpenCard(openCard?.id === range ? null : { type: 'enum', id: range });
              } else if (dataService.itemExists(range)) {
                setOpenCard(openCard?.id === range ? null : { type: 'class', id: range });
              }
            }}
          />
        )}

        {/* Inline detail card */}
        {openCard?.type === 'enum' && (
          <EnumDetailCard
            enumId={openCard.id}
            dataService={dataService}
            onClose={() => setOpenCard(null)}
          />
        )}
        {openCard?.type === 'class' && (
          <ClassDetailCard
            classId={openCard.id}
            dataService={dataService}
            onClose={() => setOpenCard(null)}
          />
        )}

        {activeTab === 'variables' && variablesSection?.tableContent && (
          <VariableTable
            headings={variablesSection.tableHeadings ?? []}
            rows={variablesSection.tableContent as string[][]}
          />
        )}
        {activeTab === 'slots' && !slotsSection?.tableContent && (
          <div className="text-xs text-gray-400 italic">No slots defined</div>
        )}
        {activeTab === 'variables' && !variablesSection?.tableContent && (
          <div className="text-xs text-gray-400 italic">No variables mapped</div>
        )}
      </div>
    </div>
  );
}


function TabButton({ label, count, active, onClick, activeColor }: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
  activeColor: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-xs font-medium border-b-2 transition-colors ${
        active
          ? activeColor
          : 'text-gray-400 border-transparent hover:text-gray-600'
      }`}
    >
      {label} <span className="opacity-50">{count}</span>
    </button>
  );
}


function RangeBadge({ range, onClick }: { range: string; onClick?: () => void }) {
  // Classify range by name heuristic: if it ends in Enum → enum, if capitalized and not a primitive → class
  const primitives = new Set([
    'string', 'integer', 'boolean', 'float', 'double', 'decimal',
    'date', 'datetime', 'time', 'uri', 'uriorcurie', 'ncname',
  ]);

  let colorClass: string;
  if (primitives.has(range.toLowerCase())) {
    colorClass = 'bg-green-100 text-green-700';
  } else if (range.endsWith('Enum')) {
    colorClass = 'bg-purple-100 text-purple-700';
  } else {
    colorClass = 'bg-blue-100 text-blue-700';
  }

  return (
    <span
      className={`inline-block px-1.5 py-0 rounded text-xs font-medium cursor-pointer hover:ring-1 hover:ring-current ${colorClass}`}
      onClick={onClick}
      title={`Click to see ${range} details`}
    >
      {range.length > 30 ? range.slice(0, 28) + '…' : range}
    </span>
  );
}


function SlotTable({ headings, rows, onRangeClick }: { headings: string[]; rows: string[][]; onRangeClick?: (range: string) => void }) {
  // Columns: Name, Source, Range, Required, Multivalued, Description
  return (
    <table className="w-full text-xs">
      <thead>
        <tr className="border-b border-gray-200">
          {headings.map((h, i) => (
            <th key={i} className="text-left px-2 py-1 text-[10px] font-medium text-gray-400 uppercase tracking-wider">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, ri) => (
          <tr key={ri} className="border-b border-gray-100/50 hover:bg-blue-50/30">
            {row.map((cell, ci) => (
              <td key={ci} className={`px-2 py-1 ${ci === row.length - 1 ? 'text-gray-400 max-w-[300px] truncate' : ''}`}>
                {ci === 2 && cell ? ( // Range column
                  <RangeBadge range={cell} onClick={() => onRangeClick?.(cell)} />
                ) : ci === 1 && cell.includes('Inherited') ? ( // Source column with inherited
                  <span className="text-gray-400">
                    {cell}
                  </span>
                ) : (
                  cell
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}


function VariableTable({ headings, rows }: { headings: string[]; rows: string[][] }) {
  // Columns: Label, Data Type, Unit, CURIE, Description
  return (
    <table className="w-full text-xs">
      <thead>
        <tr className="border-b border-gray-200">
          {headings.map((h, i) => (
            <th key={i} className="text-left px-2 py-1 text-[10px] font-medium text-gray-400 uppercase tracking-wider">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, ri) => (
          <tr key={ri} className="border-b border-gray-100/50 hover:bg-amber-50/30">
            {row.map((cell, ci) => (
              <td key={ci} className={`px-2 py-1 ${ci === row.length - 1 ? 'text-gray-400 max-w-[300px] truncate' : ''} ${ci === 3 ? 'font-mono text-xs text-blue-600' : ''}`}>
                {ci === 1 && cell ? <RangeBadge range={cell} /> : cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
