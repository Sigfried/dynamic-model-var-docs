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

  // Calculate dimensions from viewport percentages
  const defaultWidth = Math.floor(window.innerWidth * groupConfig.defaultWidthPercent);
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
          boxes.map((box) => (
            <CollapsibleBox
              key={box.id}
              box={box}
              onClose={() => onCloseBox(box.id)}
              onToggleCollapse={() => onToggleBoxCollapse(box.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

/**
 * CollapsibleBox - Individual box within a group
 */
interface CollapsibleBoxProps {
  box: FloatingBoxData;
  onClose: () => void;
  onToggleCollapse: () => void;
}

function CollapsibleBox({ box, onClose, onToggleCollapse }: CollapsibleBoxProps) {
  const isCollapsed = box.isCollapsed ?? false;

  return (
    <div className="border border-gray-200 dark:border-slate-600 rounded-lg overflow-hidden">
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
        <div className="max-h-64 overflow-y-auto">
          {box.content}
        </div>
      )}
    </div>
  );
}
