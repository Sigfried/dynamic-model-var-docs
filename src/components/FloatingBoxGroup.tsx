/**
 * FloatingBoxGroup - Container for grouped floating boxes
 *
 * Renders a draggable/resizable container that holds multiple collapsible item boxes.
 * Two instances are used: one for Details, one for Relationships.
 *
 * Features:
 * - Group header with title, collapse-all, popout, close buttons
 * - Stacked child boxes (vertical layout)
 * - Each child box has expand/collapse toggle and close button
 * - Group-level drag/resize
 * - Default position: right edge at viewport edge, Y from appConfig
 */

import { useState, useRef, useEffect } from 'react';
import type { FloatingBoxData, GroupId } from '../contracts/ComponentData';
import { APP_CONFIG } from '../config/appConfig';

interface FloatingBoxGroupProps {
  groupId: GroupId;
  title: string;
  boxes: FloatingBoxData[];
  highlightedBoxId?: string | null;  // ID of box to highlight (hover feedback)
  position?: { x: number; y: number };
  size?: { width: number; height: number };
  zIndex: number;
  onClose: () => void;  // Close entire group
  onCloseBox: (boxId: string) => void;  // Close individual box
  onToggleBoxCollapse: (boxId: string) => void;  // Toggle box collapse
  onCollapseAll: () => void;
  onExpandAll: () => void;
  onPopout?: () => void;  // Optional popout handler
  onChange?: (position: { x: number; y: number }, size: { width: number; height: number }) => void;
  onBringToFront?: () => void;
}

type ResizeHandle = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw' | null;

export default function FloatingBoxGroup({
  groupId,
  title,
  boxes,
  highlightedBoxId,
  position: propPosition,
  size: propSize,
  zIndex,
  onClose,
  onCloseBox,
  onToggleBoxCollapse,
  onCollapseAll,
  onExpandAll,
  onPopout,
  onChange,
  onBringToFront
}: FloatingBoxGroupProps) {
  const groupConfig = APP_CONFIG.floatingGroups;
  const groupSettings = groupConfig[groupId];

  // Calculate dimensions from viewport percentages (width is per-group)
  const defaultWidth = Math.floor(window.innerWidth * groupSettings.defaultWidthPercent);
  const defaultHeight = Math.floor(window.innerHeight * groupConfig.defaultHeightPercent);
  const minWidth = Math.floor(window.innerWidth * groupConfig.minWidthPercent);
  const minHeight = Math.floor(window.innerHeight * groupConfig.minHeightPercent);
  const rightMargin = Math.floor(window.innerWidth * groupConfig.rightMarginPercent);

  // Calculate default position (right edge at viewport edge, Y from config)
  const defaultPosition = {
    x: window.innerWidth - defaultWidth - rightMargin,
    y: Math.floor(window.innerHeight * groupSettings.defaultYPercent)
  };
  const defaultSize = { width: defaultWidth, height: defaultHeight };

  // Local state for dragging/resizing - tracks position during interaction
  const [localPosition, setLocalPosition] = useState<{ x: number; y: number } | null>(null);
  const [localSize, setLocalSize] = useState<{ width: number; height: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState<ResizeHandle>(null);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0, posX: 0, posY: 0 });

  const groupRef = useRef<HTMLDivElement>(null);

  // During drag/resize, use local state; otherwise use props or defaults
  const position = (isDragging || isResizing) && localPosition
    ? localPosition
    : (propPosition ?? defaultPosition);
  const size = (isDragging || isResizing) && localSize
    ? localSize
    : (propSize ?? defaultSize);

  // Handle dragging start
  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent text selection
    if (groupRef.current) {
      const rect = groupRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      // Initialize local position from current position
      setLocalPosition(propPosition ?? defaultPosition);
      setLocalSize(propSize ?? defaultSize);
      setIsDragging(true);
    }
    onBringToFront?.();
  };

  // Handle resizing start
  const handleResizeStart = (e: React.MouseEvent, handle: ResizeHandle) => {
    e.preventDefault(); // Prevent text selection
    e.stopPropagation();
    const currentPos = propPosition ?? defaultPosition;
    const currentSize = propSize ?? defaultSize;
    setLocalPosition(currentPos);
    setLocalSize(currentSize);
    setIsResizing(handle);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: currentSize.width,
      height: currentSize.height,
      posX: currentPos.x,
      posY: currentPos.y
    });
    onBringToFront?.();
  };

  // Handle mouse move for dragging/resizing
  useEffect(() => {
    if (!isDragging && !isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault(); // Prevent text selection during drag
      if (isDragging) {
        setLocalPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        });
      } else if (isResizing) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;

        let newWidth = resizeStart.width;
        let newHeight = resizeStart.height;
        let newX = resizeStart.posX;
        let newY = resizeStart.posY;

        if (isResizing.includes('e')) {
          newWidth = Math.max(minWidth, resizeStart.width + deltaX);
        }
        if (isResizing.includes('w')) {
          const proposedWidth = resizeStart.width - deltaX;
          if (proposedWidth >= minWidth) {
            newWidth = proposedWidth;
            newX = resizeStart.posX + deltaX;
          }
        }
        if (isResizing.includes('s')) {
          newHeight = Math.max(minHeight, resizeStart.height + deltaY);
        }
        if (isResizing.includes('n')) {
          const proposedHeight = resizeStart.height - deltaY;
          if (proposedHeight >= minHeight) {
            newHeight = proposedHeight;
            newY = resizeStart.posY + deltaY;
          }
        }

        setLocalSize({ width: newWidth, height: newHeight });
        setLocalPosition({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      if (onChange && localPosition && localSize) {
        onChange(localPosition, localSize);
      }
      setIsDragging(false);
      setIsResizing(null);
    };

    // Add listeners to window to capture mouse even outside the element
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragOffset, resizeStart, localPosition, localSize, onChange, minWidth, minHeight]);

  // Check if all boxes are collapsed
  const allCollapsed = boxes.length > 0 && boxes.every(b => b.isCollapsed);

  // Animation settings - don't animate during drag/resize
  const shouldAnimate = !isDragging && !isResizing;

  // Group header color based on type
  const headerColor = groupId === 'details'
    ? 'bg-slate-700 dark:bg-slate-700'
    : 'bg-indigo-700 dark:bg-indigo-700';

  // Resize handle thickness from config
  const handleSize = groupConfig.resizeHandleSize;

  return (
    <div
      ref={groupRef}
      className="fixed bg-white dark:bg-slate-800 rounded-lg shadow-2xl border-2 border-gray-300 dark:border-slate-600 flex flex-col"
      style={{
        left: 0,
        top: 0,
        transform: `translate(${position.x}px, ${position.y}px)`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        zIndex,
        transition: shouldAnimate
          ? `transform ${APP_CONFIG.timing.boxTransition}ms ease-out, width ${APP_CONFIG.timing.boxTransition}ms ease-out, height ${APP_CONFIG.timing.boxTransition}ms ease-out`
          : undefined,
        userSelect: (isDragging || isResizing) ? 'none' : undefined
      }}
      onClick={() => onBringToFront?.()}
    >
      {/* Resize handles - full edges */}
      {/* Corners */}
      <div
        className="absolute cursor-nw-resize"
        style={{ top: -handleSize/2, left: -handleSize/2, width: handleSize*2, height: handleSize*2 }}
        onMouseDown={(e) => handleResizeStart(e, 'nw')}
      />
      <div
        className="absolute cursor-ne-resize"
        style={{ top: -handleSize/2, right: -handleSize/2, width: handleSize*2, height: handleSize*2 }}
        onMouseDown={(e) => handleResizeStart(e, 'ne')}
      />
      <div
        className="absolute cursor-sw-resize"
        style={{ bottom: -handleSize/2, left: -handleSize/2, width: handleSize*2, height: handleSize*2 }}
        onMouseDown={(e) => handleResizeStart(e, 'sw')}
      />
      <div
        className="absolute cursor-se-resize"
        style={{ bottom: -handleSize/2, right: -handleSize/2, width: handleSize*2, height: handleSize*2 }}
        onMouseDown={(e) => handleResizeStart(e, 'se')}
      />
      {/* Edges - full length minus corners */}
      <div
        className="absolute cursor-n-resize"
        style={{ top: -handleSize/2, left: handleSize*1.5, right: handleSize*1.5, height: handleSize }}
        onMouseDown={(e) => handleResizeStart(e, 'n')}
      />
      <div
        className="absolute cursor-s-resize"
        style={{ bottom: -handleSize/2, left: handleSize*1.5, right: handleSize*1.5, height: handleSize }}
        onMouseDown={(e) => handleResizeStart(e, 's')}
      />
      <div
        className="absolute cursor-w-resize"
        style={{ left: -handleSize/2, top: handleSize*1.5, bottom: handleSize*1.5, width: handleSize }}
        onMouseDown={(e) => handleResizeStart(e, 'w')}
      />
      <div
        className="absolute cursor-e-resize"
        style={{ right: -handleSize/2, top: handleSize*1.5, bottom: handleSize*1.5, width: handleSize }}
        onMouseDown={(e) => handleResizeStart(e, 'e')}
      />

      {/* Group Header */}
      <div
        className={`flex items-center justify-between px-3 py-2 ${headerColor} text-white cursor-move rounded-t-lg select-none`}
        onMouseDown={handleDragStart}
      >
        <div className="font-semibold">{title}</div>
        <div className="flex items-center gap-1">
          {/* Collapse/Expand all toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (allCollapsed) {
                onExpandAll();
              } else {
                onCollapseAll();
              }
            }}
            className="hover:bg-black hover:bg-opacity-20 rounded p-1 transition-colors"
            title={allCollapsed ? 'Expand all' : 'Collapse all'}
          >
            {allCollapsed ? '⊞' : '⊟'}
          </button>
          {/* Popout button */}
          {onPopout && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPopout();
              }}
              className="hover:bg-black hover:bg-opacity-20 rounded p-1 transition-colors"
              title="Pop out to new window"
            >
              ⧉
            </button>
          )}
          {/* Close button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="hover:bg-black hover:bg-opacity-20 rounded p-1 transition-colors text-lg font-bold"
            title="Close group"
          >
            ×
          </button>
        </div>
      </div>

      {/* Boxes container - scrollable */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {boxes.length === 0 ? (
          <div className="text-gray-400 dark:text-gray-500 text-center py-4 text-sm">
            No items open
          </div>
        ) : (
          <BoxesWithEvenHeight boxes={boxes} highlightedBoxId={highlightedBoxId} onCloseBox={onCloseBox} onToggleBoxCollapse={onToggleBoxCollapse} />
        )}
      </div>
    </div>
  );
}

/**
 * BoxesWithEvenHeight - Distributes available height evenly among expanded boxes
 * Boxes that don't need their full allocation give space back to others
 */
interface BoxesWithEvenHeightProps {
  boxes: FloatingBoxData[];
  highlightedBoxId?: string | null;
  onCloseBox: (boxId: string) => void;
  onToggleBoxCollapse: (boxId: string) => void;
}

function BoxesWithEvenHeight({ boxes, highlightedBoxId, onCloseBox, onToggleBoxCollapse }: BoxesWithEvenHeightProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(0);
  // Track natural content heights for each expanded box
  const [naturalHeights, setNaturalHeights] = useState<Record<string, number>>({});

  // Observe container height changes
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerHeight(entry.contentRect.height);
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const reportNaturalHeight = (boxId: string, height: number) => {
    setNaturalHeights(prev => {
      if (prev[boxId] === height) return prev;
      return { ...prev, [boxId]: height };
    });
  };

  // Constants for height calculation
  const collapsedBoxHeight = 32; // Collapsed box header height
  const gapHeight = 8; // space-y-2 = 0.5rem = 8px
  const totalGaps = (boxes.length - 1) * gapHeight;

  // Calculate available space
  const expandedBoxes = boxes.filter(b => !b.isCollapsed);
  const collapsedCount = boxes.length - expandedBoxes.length;
  const collapsedSpace = collapsedCount * collapsedBoxHeight;
  const totalAvailable = containerHeight - collapsedSpace - totalGaps;

  // Calculate heights with redistribution
  const calculateHeights = (): Record<string, number> => {
    if (expandedBoxes.length === 0) return {};

    const result: Record<string, number> = {};
    let remaining = totalAvailable;
    let needsMore: string[] = [];

    // First pass: give boxes their natural height if it's less than equal share
    const equalShare = totalAvailable / expandedBoxes.length;

    for (const box of expandedBoxes) {
      const natural = naturalHeights[box.id];
      const naturalWithHeader = natural ? natural + collapsedBoxHeight : undefined;

      if (naturalWithHeader !== undefined && naturalWithHeader < equalShare) {
        // This box doesn't need its full share
        result[box.id] = natural;
        remaining -= naturalWithHeader;
      } else {
        // This box needs at least equal share (or we don't know yet)
        needsMore.push(box.id);
      }
    }

    // Second pass: distribute remaining space to boxes that need more
    if (needsMore.length > 0) {
      const perBox = Math.max(68, Math.floor(remaining / needsMore.length) - collapsedBoxHeight); // 68 = 100 min - 32 header
      for (const boxId of needsMore) {
        result[boxId] = perBox;
      }
    }

    return result;
  };

  const heights = calculateHeights();

  // When highlighting, determine which boxes should appear expanded vs collapsed
  const hasHighlight = highlightedBoxId != null;

  return (
    <div ref={containerRef} className="flex flex-col gap-2 h-full">
      {boxes.map((box) => {
        const isHighlighted = box.id === highlightedBoxId;
        // When hovering, temporarily show highlighted box expanded, others collapsed
        const visuallyCollapsed = hasHighlight
          ? !isHighlighted  // Highlight mode: only highlighted box expanded
          : box.isCollapsed;  // Normal mode: use actual state

        return (
          <CollapsibleBox
            key={box.id}
            box={box}
            isHighlighted={isHighlighted}
            isDimmed={hasHighlight && !isHighlighted}
            visuallyCollapsed={visuallyCollapsed}
            maxContentHeight={heights[box.id]}
            onReportNaturalHeight={(h) => reportNaturalHeight(box.id, h)}
            onClose={() => onCloseBox(box.id)}
            onToggleCollapse={() => onToggleBoxCollapse(box.id)}
          />
        );
      })}
    </div>
  );
}

/**
 * CollapsibleBox - Individual box within a group
 */
interface CollapsibleBoxProps {
  box: FloatingBoxData;
  isHighlighted?: boolean;
  isDimmed?: boolean;
  visuallyCollapsed?: boolean;  // Override collapsed state during highlight
  maxContentHeight?: number;
  onReportNaturalHeight?: (height: number) => void;
  onClose: () => void;
  onToggleCollapse: () => void;
}

function CollapsibleBox({ box, isHighlighted, isDimmed, visuallyCollapsed, maxContentHeight, onReportNaturalHeight, onClose, onToggleCollapse }: CollapsibleBoxProps) {
  // Use visual override if provided, otherwise use actual state
  const isCollapsed = visuallyCollapsed ?? box.isCollapsed ?? false;
  const contentRef = useRef<HTMLDivElement>(null);

  // Measure and report natural content height
  useEffect(() => {
    if (isCollapsed || !contentRef.current || !onReportNaturalHeight) return;

    const measureHeight = () => {
      if (contentRef.current) {
        onReportNaturalHeight(contentRef.current.scrollHeight);
      }
    };

    // Measure after render
    measureHeight();

    // Also observe for content changes
    const observer = new ResizeObserver(measureHeight);
    observer.observe(contentRef.current);
    return () => observer.disconnect();
  }, [isCollapsed, onReportNaturalHeight]);

  // Highlight and dim styles for hover feedback
  const highlightClasses = isHighlighted
    ? 'ring-2 ring-yellow-400 dark:ring-yellow-300 ring-offset-1'
    : '';
  const dimStyle = isDimmed
    ? { opacity: 0.5, filter: 'grayscale(30%)' }
    : undefined;

  return (
    <div
      className={`border border-gray-200 dark:border-slate-600 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-200 ${highlightClasses}`}
      style={dimStyle}
    >
      {/* Box header */}
      <div
        className={`flex items-center justify-between px-3 py-1.5 ${box.metadata.color} text-white cursor-pointer select-none`}
        onClick={onToggleCollapse}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="text-sm">{isCollapsed ? '▶' : '▼'}</span>
          <span className="font-medium truncate text-sm">{box.metadata.title}</span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="hover:bg-black hover:bg-opacity-20 rounded p-0.5 transition-colors text-sm font-bold ml-2"
          title="Close"
        >
          ×
        </button>
      </div>

      {/* Box content - only show when expanded */}
      {!isCollapsed && (
        <div
          ref={contentRef}
          className="overflow-y-auto"
          style={{ maxHeight: maxContentHeight ? `${maxContentHeight}px` : undefined }}
        >
          {box.content}
        </div>
      )}
    </div>
  );
}
