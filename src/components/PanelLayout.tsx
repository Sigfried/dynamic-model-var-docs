import { useState, useRef, useEffect, type ReactNode } from 'react';

interface PanelLayoutProps {
  leftPanel?: ReactNode;
  detailPanel?: ReactNode;
  rightPanel?: ReactNode;
  leftPanelEmpty?: boolean;
  rightPanelEmpty?: boolean;
  initialWidths?: { left: number; middle: number; right: number };
  onWidthsChange?: (widths: { left: number; middle: number; right: number }) => void;
}

export default function PanelLayout({
  leftPanel,
  detailPanel,
  rightPanel,
  leftPanelEmpty = false,
  rightPanelEmpty = false,
  initialWidths = { left: 30, middle: 40, right: 30 },
  onWidthsChange
}: PanelLayoutProps) {
  const [widths, setWidths] = useState(initialWidths);
  const [isDragging, setIsDragging] = useState<'left' | 'right' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const MIN_WIDTH = 15; // Minimum panel width percentage
  const EMPTY_PANEL_WIDTH = 60; // Fixed width in pixels for empty panels

  // Determine which panels are visible
  const showLeft = !!leftPanel;
  const showDetail = !!detailPanel;
  const showRight = !!rightPanel;

  // Calculate actual widths based on visible panels
  const getActualWidths = () => {
    const visiblePanels = [showLeft, showDetail, showRight].filter(Boolean).length;

    if (visiblePanels === 0) return { left: 0, middle: 0, right: 0 };
    if (visiblePanels === 1) {
      if (showLeft) return { left: 100, middle: 0, right: 0 };
      if (showDetail) return { left: 0, middle: 100, right: 0 };
      return { left: 0, middle: 0, right: 100 };
    }
    if (visiblePanels === 2) {
      if (showLeft && showDetail) return { left: widths.left, middle: 100 - widths.left, right: 0 };
      if (showLeft && showRight) return { left: widths.left, middle: 0, right: 100 - widths.left };
      return { left: 0, middle: widths.middle, right: 100 - widths.middle };
    }

    // All 3 panels visible
    return widths;
  };

  const actualWidths = getActualWidths();

  const handleMouseDown = (divider: 'left' | 'right') => {
    setIsDragging(divider);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - containerRect.left;
    const percentage = (mouseX / containerRect.width) * 100;

    setWidths(prevWidths => {
      let newWidths = { ...prevWidths };

      if (isDragging === 'left') {
        // Dragging left divider (between left and middle)
        const constrainedLeft = Math.max(MIN_WIDTH, Math.min(100 - MIN_WIDTH * 2, percentage));

        if (showRight) {
          // 3 panels: adjust left and middle, keep right fixed
          newWidths = {
            left: constrainedLeft,
            middle: 100 - constrainedLeft - prevWidths.right,
            right: prevWidths.right
          };

          // Ensure middle doesn't go below minimum
          if (newWidths.middle < MIN_WIDTH) {
            newWidths.middle = MIN_WIDTH;
            newWidths.left = 100 - MIN_WIDTH - prevWidths.right;
          }
        } else {
          // 2 panels: left and middle
          newWidths = {
            left: constrainedLeft,
            middle: 100 - constrainedLeft,
            right: 0
          };
        }
      } else if (isDragging === 'right') {
        // Dragging right divider (between middle and right)
        const rightPercentage = 100 - percentage;
        const constrainedRight = Math.max(MIN_WIDTH, Math.min(100 - MIN_WIDTH * 2, rightPercentage));

        // 3 panels: adjust right and middle, keep left fixed
        newWidths = {
          left: prevWidths.left,
          middle: 100 - prevWidths.left - constrainedRight,
          right: constrainedRight
        };

        // Ensure middle doesn't go below minimum
        if (newWidths.middle < MIN_WIDTH) {
          newWidths.middle = MIN_WIDTH;
          newWidths.right = 100 - prevWidths.left - MIN_WIDTH;
        }
      }

      return newWidths;
    });
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(null);
      onWidthsChange?.(widths);
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, widths]);

  // If no panels are visible, render nothing
  if (!showLeft && !showDetail && !showRight) {
    return <div className="flex-1 flex items-center justify-center text-gray-500">No panels active</div>;
  }

  return (
    <div ref={containerRef} className="flex-1 flex overflow-hidden">
      {/* Left Panel */}
      {showLeft && (
        <>
          <div
            className="overflow-hidden border-r border-gray-200 dark:border-slate-700 transition-all duration-500 flex-shrink-0"
            style={{ width: leftPanelEmpty ? `${EMPTY_PANEL_WIDTH}px` : `${actualWidths.left}%` }}
          >
            {leftPanel}
          </div>

          {/* Left Divider */}
          {(showDetail || showRight) && (
            <div
              className={`w-1 bg-gray-200 dark:bg-slate-700 hover:bg-blue-400 dark:hover:bg-blue-600 cursor-col-resize transition-colors ${
                isDragging === 'left' ? 'bg-blue-500' : ''
              }`}
              onMouseDown={() => handleMouseDown('left')}
            />
          )}
        </>
      )}

      {/* Detail Panel */}
      {showDetail && (
        <>
          <div
            className="overflow-hidden transition-all duration-500 flex-1"
            style={{
              width: (showLeft && !leftPanelEmpty) || (showRight && !rightPanelEmpty)
                ? `${actualWidths.middle}%`
                : undefined
            }}
          >
            {detailPanel}
          </div>

          {/* Right Divider */}
          {showRight && (
            <div
              className={`w-1 bg-gray-200 dark:bg-slate-700 hover:bg-blue-400 dark:hover:bg-blue-600 cursor-col-resize transition-colors ${
                isDragging === 'right' ? 'bg-blue-500' : ''
              }`}
              onMouseDown={() => handleMouseDown('right')}
            />
          )}
        </>
      )}

      {/* Gutter between left and right when no detail panel */}
      {!showDetail && showLeft && showRight && (
        <div className="w-8 bg-gray-100 dark:bg-slate-800 border-x border-gray-200 dark:border-slate-700 flex-shrink-0" />
      )}

      {/* Right Panel */}
      {showRight && (
        <div
          className="overflow-hidden border-l border-gray-200 dark:border-slate-700 transition-all duration-500 flex-shrink-0"
          style={{ width: rightPanelEmpty ? `${EMPTY_PANEL_WIDTH}px` : `${actualWidths.right}%` }}
        >
          {rightPanel}
        </div>
      )}
    </div>
  );
}
