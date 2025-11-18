import { type ReactNode } from 'react';

interface PanelLayoutProps {
  leftPanel: ReactNode;
  middlePanel?: ReactNode;  // Optional middle panel
  rightPanel: ReactNode;
  leftPanelEmpty?: boolean;
  middlePanelEmpty?: boolean;
  rightPanelEmpty?: boolean;
  showSpacer?: boolean;
}

export default function PanelLayout({
  leftPanel,
  middlePanel,
  rightPanel,
  leftPanelEmpty = false,
  middlePanelEmpty = true,  // Middle panel hidden by default
  rightPanelEmpty = false,
  showSpacer = true
}: PanelLayoutProps) {
  const EMPTY_PANEL_WIDTH = 180; // Fixed width in pixels for empty panels (enough for 4 icon buttons)
  const MAX_PANEL_WIDTH = 450; // Max width for non-empty panels to keep them compact

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Left Panel - Classes only */}
      <div
        className="h-full overflow-hidden border-r border-gray-200 dark:border-slate-700 flex-shrink-0"
        style={{
          width: leftPanelEmpty ? `${EMPTY_PANEL_WIDTH}px` : undefined,
          maxWidth: leftPanelEmpty ? undefined : `${MAX_PANEL_WIDTH}px`,
          minWidth: leftPanelEmpty ? undefined : '300px'
        }}
      >
        {leftPanel}
      </div>

      {/* Middle Panel - Slots (toggleable) */}
      {!middlePanelEmpty && middlePanel && (
        <div
          className="h-full overflow-hidden border-r border-gray-200 dark:border-slate-700 flex-shrink-0"
          style={{
            maxWidth: `${MAX_PANEL_WIDTH}px`,
            minWidth: '300px'
          }}
        >
          {middlePanel}
        </div>
      )}

      {/* Center gutter - show when appropriate */}
      {!leftPanelEmpty && !rightPanelEmpty && middlePanelEmpty && (
        <div className="w-40 bg-gray-100 dark:bg-slate-800 border-x border-gray-200 dark:border-slate-700 flex-shrink-0" />
      )}

      {/* Right Panel - Ranges only */}
      <div
        className="h-full overflow-hidden border-l border-gray-200 dark:border-slate-700 flex-shrink-0"
        style={{
          width: rightPanelEmpty ? `${EMPTY_PANEL_WIDTH}px` : undefined,
          maxWidth: rightPanelEmpty ? undefined : `${MAX_PANEL_WIDTH}px`,
          minWidth: rightPanelEmpty ? undefined : '300px'
        }}
      >
        {rightPanel}
      </div>

      {/* Spacer to push remaining space to the right - only show when not using stacked panels */}
      {showSpacer && <div className="flex-1" />}
    </div>
  );
}
