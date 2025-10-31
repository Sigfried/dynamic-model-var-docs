// Must only import Element from models/, never concrete subclasses or DTOs
import React from 'react';
import type { Element } from '../models/Element';

interface DetailPanelProps {
  element?: Element;
  onNavigate?: (elementName: string, elementType: string) => void;
  onClose?: () => void;
  hideHeader?: boolean;  // Hide the element name header (when shown in dialog/panel header)
  hideCloseButton?: boolean;  // Hide the internal close button (when handled externally)
}

export default function DetailPanel({
  element,
  onNavigate,
  onClose,
  hideHeader = false,
  hideCloseButton = false
}: DetailPanelProps) {
  if (!element) {
    return null; // Hide panel when nothing is selected
  }

  const data = element.getDetailData();

  return (
    <div className="h-full overflow-y-auto bg-white dark:bg-slate-800 text-left">
      {!hideHeader && (
        <div className={`sticky top-0 ${data.titleColor} text-white border-b px-4 py-3`}>
          <div className="flex justify-between items-start">
            <div className="min-w-0 flex-1">
              <h1 className="text-lg font-bold text-left truncate">{data.title}</h1>
              {data.subtitle && (
                <p className="text-sm mt-0.5 opacity-90">{data.subtitle}</p>
              )}
            </div>
            {onClose && !hideCloseButton && (
              <button
                onClick={onClose}
                className="ml-2 flex-shrink-0 hover:opacity-70 transition-opacity"
                title="Close detail panel"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}

      <div className="p-4 space-y-3 text-left">
        {/* Title (when header is hidden) */}
        {hideHeader && (
          <div>
            <h1 className="text-2xl font-bold">{data.title}</h1>
            {data.subtitle && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{data.subtitle}</p>
            )}
          </div>
        )}

        {/* Description */}
        {data.description && (
          <div>
            <p className="text-gray-700 dark:text-gray-300">{data.description}</p>
          </div>
        )}

        {/* Sections */}
        {data.sections.map((section, idx) => (
          <div key={idx}>
            <h2 className="text-lg font-semibold mb-1">{section.name}</h2>

            {/* Text content */}
            {section.text && (
              <p className="text-gray-700 dark:text-gray-300">{section.text}</p>
            )}

            {/* Table content */}
            {section.tableHeadings && section.tableContent && (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-slate-700">
                      {section.tableHeadings.map((heading, headingIdx) => (
                        <th
                          key={headingIdx}
                          className="border border-gray-300 dark:border-slate-600 px-4 py-2 text-left font-semibold text-sm"
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {section.tableContent.map((row, rowIdx) => (
                      <tr key={rowIdx} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                        {(row as unknown[]).map((cell, cellIdx) => (
                          <td
                            key={cellIdx}
                            className="border border-gray-300 dark:border-slate-600 px-4 py-2 text-sm"
                          >
                            {renderCell(cell, onNavigate)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Helper function to render table cells (handles clickable links in the future)
function renderCell(cell: unknown, onNavigate?: (elementName: string, elementType: string) => void): React.ReactNode {
  if (cell === null || cell === undefined) {
    return '';
  }

  // For now, just render as text
  // TODO: Add navigation support for range values, class names, etc.
  return String(cell);
}
