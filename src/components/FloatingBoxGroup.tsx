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

  // Calculate default position (right edge at viewport edge, Y from config)
  const defaultWidth = 500;
  const defaultPosition = {
    x: window.innerWidth - defaultWidth - groupConfig.rightMargin,
    y: window.innerHeight * groupSettings.defaultYPercent
  };
  const defaultSize = { width: defaultWidth, height: 400 };

  // Local state for dragging/resizing
  const [localPosition, setLocalPosition] = useState<{ x: number; y: number } | null>(null);
  const [localSize, setLocalSize] = useState<{ width: number; height: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState<ResizeHandle>(null);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0, posX: 0, posY: 0 });

  const groupRef = useRef<HTMLDivElement>(null);

  // Derive actual position/size
  const position = propPosition ?? localPosition ?? defaultPosition;
  const size = propSize ?? localSize ?? defaultSize;

  // Handle dragging start
  const handleDragStart = (e: React.MouseEvent) => {
    if (groupRef.current) {
      const rect = groupRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
    }
    onBringToFront?.();
  };

  // Handle resizing start
  const handleResizeStart = (e: React.MouseEvent, handle: ResizeHandle) => {
    e.stopPropagation();
    setIsResizing(handle);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
      posX: position.x,
      posY: position.y
    });
    onBringToFront?.();
  };

  // Handle mouse move for dragging/resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
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
          newWidth = Math.max(groupConfig.minWidth, Math.min(groupConfig.maxWidth, resizeStart.width + deltaX));
        }
        if (isResizing.includes('w')) {
          const proposedWidth = resizeStart.width - deltaX;
          if (proposedWidth >= groupConfig.minWidth && proposedWidth <= groupConfig.maxWidth) {
            newWidth = proposedWidth;
            newX = resizeStart.posX + deltaX;
          }
        }
        if (isResizing.includes('s')) {
          newHeight = Math.max(groupConfig.minHeight, resizeStart.height + deltaY);
        }
        if (isResizing.includes('n')) {
          const proposedHeight = resizeStart.height - deltaY;
          if (proposedHeight >= groupConfig.minHeight) {
            newHeight = proposedHeight;
            newY = resizeStart.posY + deltaY;
          }
        }

        setLocalSize({ width: newWidth, height: newHeight });
        setLocalPosition({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      const wasDraggingOrResizing = isDragging || isResizing;
      setIsDragging(false);
      setIsResizing(null);

      if (wasDraggingOrResizing && onChange) {
        const finalPos = localPosition ?? position;
        const finalSize = localSize ?? size;
        onChange(finalPos, finalSize);
      }
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, dragOffset, resizeStart, position, size, localPosition, localSize, onChange, groupConfig]);

  // Check if all boxes are collapsed
  const allCollapsed = boxes.length > 0 && boxes.every(b => b.isCollapsed);

  // Animation settings
  const shouldAnimate = !isDragging && !isResizing;

  // Group header color based on type
  const headerColor = groupId === 'details'
    ? 'bg-slate-700 dark:bg-slate-700'
    : 'bg-indigo-700 dark:bg-indigo-700';

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
          ? `transform ${APP_CONFIG.timing.boxTransition}ms ease-out`
          : undefined
      }}
      onClick={() => onBringToFront?.()}
    >
      {/* Resize handles */}
      <div className="absolute -top-1 -left-1 w-3 h-3 cursor-nw-resize" onMouseDown={(e) => handleResizeStart(e, 'nw')} />
      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-3 cursor-n-resize" onMouseDown={(e) => handleResizeStart(e, 'n')} />
      <div className="absolute -top-1 -right-1 w-3 h-3 cursor-ne-resize" onMouseDown={(e) => handleResizeStart(e, 'ne')} />
      <div className="absolute top-1/2 -translate-y-1/2 -left-1 w-3 h-8 cursor-w-resize" onMouseDown={(e) => handleResizeStart(e, 'w')} />
      <div className="absolute top-1/2 -translate-y-1/2 -right-1 w-3 h-8 cursor-e-resize" onMouseDown={(e) => handleResizeStart(e, 'e')} />
      <div className="absolute -bottom-1 -left-1 w-3 h-3 cursor-sw-resize" onMouseDown={(e) => handleResizeStart(e, 'sw')} />
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-3 cursor-s-resize" onMouseDown={(e) => handleResizeStart(e, 's')} />
      <div className="absolute -bottom-1 -right-1 w-3 h-3 cursor-se-resize" onMouseDown={(e) => handleResizeStart(e, 'se')} />

      {/* Group Header */}
      <div
        className={`flex items-center justify-between px-3 py-2 ${headerColor} text-white cursor-move rounded-t-lg`}
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
        className={`flex items-center justify-between px-3 py-1.5 ${box.metadata.color} text-white cursor-pointer`}
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
