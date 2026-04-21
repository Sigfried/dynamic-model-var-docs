/**
 * SlotDrilldown - Inline panel showing slots and variables for a class.
 * Supports recursive drilldown: clicking a class-range badge opens another
 * SlotDrilldown nested inline below that slot row. Clicking an enum-range
 * badge opens an EnumDetailCard.
 *
 * Must only import from services/DataService, never from models/.
 */

import { useState, useMemo } from 'react';
import type { DataService } from '../services/DataService';
import { EnumDetailCard } from './EnumDetailCard';

interface SlotDrilldownProps {
  classId: string;
  dataService: DataService;
  onClose: () => void;
  depth?: number;
}

type Tab = 'slots' | 'variables';

export function SlotDrilldown({ classId, dataService, onClose, depth = 0 }: SlotDrilldownProps) {
  const [activeTab, setActiveTab] = useState<Tab>('slots');
  const [openCard, setOpenCard] = useState<{ type: 'enum' | 'class'; id: string; afterRow: number } | null>(null);

  const detail = useMemo(
    () => dataService.getDetailContent(classId),
    [classId, dataService]
  );

  const referencedBy = useMemo(
    () => dataService.getReferencedBy(classId),
    [classId, dataService]
  );

  const slotsSection = detail.sections.find(s => s.name === 'Slots');
  const variablesSection = detail.sections.find(s => s.name?.startsWith('Variables'));

  const slotCount = slotsSection?.tableContent?.length ?? 0;
  const varCount = variablesSection?.tableContent?.length ?? 0;

  const handleRangeClick = (range: string, rowIndex: number) => {
    if (openCard?.id === range && openCard?.afterRow === rowIndex) {
      setOpenCard(null);
      return;
    }
    if (range.endsWith('Enum')) {
      setOpenCard({ type: 'enum', id: range, afterRow: rowIndex });
    } else if (dataService.itemExists(range)) {
      setOpenCard({ type: 'class', id: range, afterRow: rowIndex });
    }
  };

  return (
    <div
      className="mb-2 border border-blue-300 border-t-2 border-t-blue-500 rounded-b-md bg-blue-50/30"
      style={depth > 0 ? { marginLeft: `${depth * 12}px` } : undefined}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-1.5">
        <div className="text-xs">
          <span className="font-semibold text-gray-700">{detail.title}</span>
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

      {/* Referenced by */}
      {referencedBy.length > 0 && (
        <div className="px-3 pb-2 text-xs">
          <span className="font-medium text-gray-500">Referenced by: </span>
          {referencedBy.map((r, i) => (
            <span key={i}>
              {i > 0 && ', '}
              <span className="text-blue-600">{r.classId}</span>
              <span className="text-gray-400">.{r.slotName}</span>
            </span>
          ))}
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
          <SlotTableWithInlineCards
            headings={slotsSection.tableHeadings ?? []}
            rows={slotsSection.tableContent as string[][]}
            openCard={openCard}
            onRangeClick={handleRangeClick}
            onCloseCard={() => setOpenCard(null)}
            dataService={dataService}
            depth={depth}
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
        active ? activeColor : 'text-gray-400 border-transparent hover:text-gray-600'
      }`}
    >
      {label} <span className="opacity-50">{count}</span>
    </button>
  );
}


function RangeBadge({ range, onClick }: { range: string; onClick?: () => void }) {
  const primitives = new Set([
    'string', 'integer', 'boolean', 'float', 'double', 'decimal',
    'date', 'datetime', 'time', 'uri', 'uriorcurie', 'ncname',
  ]);

  let colorClass: string;
  const isClickable = !primitives.has(range.toLowerCase());
  if (primitives.has(range.toLowerCase())) {
    colorClass = 'bg-green-100 text-green-700';
  } else if (range.endsWith('Enum')) {
    colorClass = 'bg-purple-100 text-purple-700';
  } else {
    colorClass = 'bg-blue-100 text-blue-700';
  }

  return (
    <span
      className={`inline-block px-1.5 py-0 rounded text-xs font-medium ${colorClass} ${
        isClickable ? 'cursor-pointer hover:ring-1 hover:ring-current' : ''
      }`}
      onClick={isClickable ? onClick : undefined}
      title={isClickable ? `Click to see ${range} details` : range}
    >
      {range.length > 30 ? range.slice(0, 28) + '…' : range}
    </span>
  );
}


function SlotTableWithInlineCards({ headings, rows, openCard, onRangeClick, onCloseCard, dataService, depth }: {
  headings: string[];
  rows: string[][];
  openCard: { type: 'enum' | 'class'; id: string; afterRow: number } | null;
  onRangeClick: (range: string, rowIndex: number) => void;
  onCloseCard: () => void;
  dataService: DataService;
  depth: number;
}) {
  return (
    <div>
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
            <SlotRowWithCard
              key={ri}
              row={row}
              rowIndex={ri}
              openCard={openCard}
              onRangeClick={onRangeClick}
              onCloseCard={onCloseCard}
              dataService={dataService}
              depth={depth}
              colCount={headings.length}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}


function SlotRowWithCard({ row, rowIndex, openCard, onRangeClick, onCloseCard, dataService, depth, colCount }: {
  row: string[];
  rowIndex: number;
  openCard: { type: 'enum' | 'class'; id: string; afterRow: number } | null;
  onRangeClick: (range: string, rowIndex: number) => void;
  onCloseCard: () => void;
  dataService: DataService;
  depth: number;
  colCount: number;
}) {
  const isCardTarget = openCard?.afterRow === rowIndex;

  return (
    <>
      <tr className={`border-b border-gray-100/50 hover:bg-blue-50/30 ${isCardTarget ? 'bg-blue-50' : ''}`}>
        {row.map((cell, ci) => (
          <td key={ci} className={`px-2 py-1 ${ci === row.length - 1 ? 'text-gray-400 max-w-[300px] truncate' : ''}`}>
            {ci === 2 && cell ? (
              <RangeBadge range={cell} onClick={() => onRangeClick(cell, rowIndex)} />
            ) : ci === 1 && cell.includes('Inherited') ? (
              <span className="text-gray-400">{cell}</span>
            ) : (
              cell
            )}
          </td>
        ))}
      </tr>
      {isCardTarget && openCard && (
        <tr>
          <td colSpan={colCount} className="p-0">
            {openCard.type === 'enum' && (
              <EnumDetailCard
                enumId={openCard.id}
                dataService={dataService}
                onClose={onCloseCard}
              />
            )}
            {openCard.type === 'class' && (
              <SlotDrilldown
                classId={openCard.id}
                dataService={dataService}
                onClose={onCloseCard}
                depth={depth + 1}
              />
            )}
          </td>
        </tr>
      )}
    </>
  );
}


function VariableTable({ headings, rows }: { headings: string[]; rows: string[][] }) {
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
