import { type ReactNode } from 'react';

interface PanelLayoutProps {
  leftPanel: ReactNode;
  rightPanel: ReactNode;
  leftPanelEmpty?: boolean;
  rightPanelEmpty?: boolean;
}

export default function PanelLayout({
  leftPanel,
  rightPanel,
  leftPanelEmpty = false,
  rightPanelEmpty = false
}: PanelLayoutProps) {
  const EMPTY_PANEL_WIDTH = 180; // Fixed width in pixels for empty panels (enough for 4 icon buttons)

  return (
    <div className="flex-1 flex overflow-hidden justify-between">
      {/* Left Panel */}
      <div
        className="overflow-hidden border-r border-gray-200 dark:border-slate-700 flex-shrink-0"
        style={{ width: leftPanelEmpty ? `${EMPTY_PANEL_WIDTH}px` : undefined, flex: leftPanelEmpty ? undefined : 1 }}
      >
        {leftPanel}
      </div>

      {/* Center gutter - only show when both panels have content */}
      {!leftPanelEmpty && !rightPanelEmpty && (
        <div className="w-8 bg-gray-100 dark:bg-slate-800 border-x border-gray-200 dark:border-slate-700 flex-shrink-0" />
      )}

      {/* Right Panel */}
      <div
        className="overflow-hidden border-l border-gray-200 dark:border-slate-700 flex-shrink-0"
        style={{ width: rightPanelEmpty ? `${EMPTY_PANEL_WIDTH}px` : undefined, flex: rightPanelEmpty ? undefined : 1 }}
      >
        {rightPanel}
      </div>
    </div>
  );
}
