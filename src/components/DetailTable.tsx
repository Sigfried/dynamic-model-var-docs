// Must only import Element from models/, never concrete subclasses or DTOs
//
// Generic table component for element details
// Supports responsive split layout, custom renderers, and clickable cells

import * as React from 'react';
import { useState, useEffect } from 'react';

export interface Column<T> {
  key: keyof T | string;
  label: string;
  clickable?: boolean;
  renderer?: (value: unknown, row: T) => React.ReactElement;
  className?: string;
}

interface DetailTableProps<T> {
  title: string;
  data: T[];
  columns: Column<T>[];
  splitThreshold?: number;  // Width at which to split table into two columns
  onNavigate?: (value: string, type: string) => void;
}

export function DetailTable<T extends Record<string, unknown>>({
  title,
  data,
  columns,
  splitThreshold = 1400,
  onNavigate
}: DetailTableProps<T>) {
  const [containerWidth, setContainerWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setContainerWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const shouldSplit = splitThreshold && containerWidth >= splitThreshold && data.length > 10;

  if (shouldSplit) {
    // Split into two side-by-side tables
    const midpoint = Math.ceil(data.length / 2);
    return (
      <div>
        <h2 className="text-lg font-semibold mb-2">{title} ({data.length})</h2>
        <div className="grid grid-cols-2 gap-4">
          <Table
            data={data.slice(0, midpoint)}
            columns={columns}
            onNavigate={onNavigate}
            compact={true}
          />
          <Table
            data={data.slice(midpoint)}
            columns={columns}
            onNavigate={onNavigate}
            compact={true}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">{title} ({data.length})</h2>
      <Table data={data} columns={columns} onNavigate={onNavigate} compact={false} />
    </div>
  );
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  onNavigate?: (value: string, type: string) => void;
  compact: boolean;
}

function Table<T extends Record<string, unknown>>({
  data,
  columns,
  onNavigate,
  compact
}: TableProps<T>) {
  const cellPadding = compact ? 'px-2 py-2' : 'px-4 py-2';
  const fontSize = compact ? 'text-sm' : '';

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50 dark:bg-slate-700">
            {columns.map((col, idx) => (
              <th
                key={idx}
                className={`border border-gray-300 dark:border-slate-600 ${cellPadding} text-left ${fontSize}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => (
            <tr key={rowIdx} className="hover:bg-gray-50 dark:hover:bg-slate-700">
              {columns.map((col, colIdx) => {
                const value = row[col.key as keyof T];
                let cellContent: React.ReactElement | string;

                if (col.renderer) {
                  cellContent = col.renderer(value, row);
                } else if (col.clickable && onNavigate && value) {
                  cellContent = (
                    <button
                      onClick={() => onNavigate(String(value), 'auto')}
                      className="underline hover:opacity-70 transition-opacity"
                    >
                      {String(value)}
                    </button>
                  );
                } else {
                  cellContent = String(value || '-');
                }

                return (
                  <td
                    key={colIdx}
                    className={`border border-gray-300 dark:border-slate-600 ${cellPadding} ${fontSize} ${col.className || ''}`}
                  >
                    {cellContent}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
