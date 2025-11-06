/**
 * FloatingBoxManager - Manages floating boxes in both transitory and persistent modes
 *
 * Key features:
 * - Single FloatingBox component supporting transitory (auto-dismiss) and persistent (draggable) modes
 * - FIFO stack management for multiple boxes
 * - Click/drag/resize brings box to front
 * - ESC closes boxes (transitory first, then oldest persistent)
 * - Mode-aware positioning (stacked vs floating layout)
 * - Content agnostic - works with any React component
 *
 * Architecture: Maintains view/model separation - uses item IDs, never model-layer instances
 * UI layer uses "item" terminology
 */

import { useState, useRef, useEffect, type ReactNode } from 'react';

// Metadata for FloatingBox display (view/model separation)
export interface FloatingBoxMetadata {
  title: string;        // e.g., "Class: Specimen" or "Relationships: Specimen"
  color: string;        // Tailwind classes for header (e.g., "bg-blue-700 border-blue-800")
}

// FloatingBox data structure
export interface FloatingBoxData {
  id: string;
  mode: 'transitory' | 'persistent';
  metadata: FloatingBoxMetadata;
  content: ReactNode;
  itemId: string;  // Item identifier for callbacks and state management
  position?: { x: number; y: number };
  size?: { width: number; height: number };
}

interface FloatingBoxManagerProps {
  boxes: FloatingBoxData[];
  displayMode: 'dialog' | 'stacked';
  onClose: (id: string) => void;
  onChange?: (id: string, position: { x: number; y: number }, size: { width: number; height: number }) => void;
  onBringToFront?: (id: string) => void;
  onUpgradeToPersistent?: (id: string) => void;
}

type ResizeHandle = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw' | null;

export default function FloatingBoxManager({
  boxes,
  displayMode,
  onClose,
  onChange,
  onBringToFront,
  onUpgradeToPersistent
}: FloatingBoxManagerProps) {
  // Handle ESC key - close transitory boxes first, then oldest persistent
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && boxes.length > 0) {
        // Find first transitory box
        const transitoryBox = boxes.find(b => b.mode === 'transitory');
        if (transitoryBox) {
          onClose(transitoryBox.id);
          return;
        }

        // No transitory boxes - close oldest persistent box (index 0)
        const persistentBoxes = boxes.filter(b => b.mode === 'persistent');
        if (persistentBoxes.length > 0) {
          onClose(persistentBoxes[0].id);
        }
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [boxes, onClose]);

  // Render boxes based on display mode
  if (displayMode === 'stacked') {
    // Stacked layout - boxes in vertical stack (newest at top)
    const reversedBoxes = [...boxes].reverse();

    return (
      <div className="h-full overflow-y-auto flex flex-col gap-4 p-4 bg-gray-50 dark:bg-slate-900">
        {reversedBoxes.map((box, index) => (
          <FloatingBox
            key={box.id}
            box={box}
            index={index}
            totalBoxes={boxes.length}
            onClose={() => onClose(box.id)}
            onChange={onChange ? (pos, size) => onChange(box.id, pos, size) : undefined}
            onBringToFront={onBringToFront ? () => onBringToFront(box.id) : undefined}
            onUpgradeToPersistent={onUpgradeToPersistent ? () => onUpgradeToPersistent(box.id) : undefined}
            isStacked={true}
          />
        ))}
      </div>
    );
  }

  // Dialog mode - floating draggable boxes
  return (
    <>
      {boxes.map((box, index) => (
        <FloatingBox
          key={box.id}
          box={box}
          index={index}
          totalBoxes={boxes.length}
          onClose={() => onClose(box.id)}
          onChange={onChange ? (pos, size) => onChange(box.id, pos, size) : undefined}
          onBringToFront={onBringToFront ? () => onBringToFront(box.id) : undefined}
          onUpgradeToPersistent={onUpgradeToPersistent ? () => onUpgradeToPersistent(box.id) : undefined}
          isStacked={false}
        />
      ))}
    </>
  );
}

/**
 * FloatingBox - Single floating box component supporting transitory and persistent modes
 */
interface FloatingBoxProps {
  box: FloatingBoxData;
  index: number;
  totalBoxes: number;
  onClose: () => void;
  onChange?: (position: { x: number; y: number }, size: { width: number; height: number }) => void;
  onBringToFront?: () => void;
  onUpgradeToPersistent?: () => void;
  isStacked: boolean;
}

function FloatingBox({
  box,
  index,
  totalBoxes,
  onClose,
  onChange,
  onBringToFront,
  onUpgradeToPersistent,
  isStacked
}: FloatingBoxProps) {
  const CASCADE_OFFSET = 40;
  const MIN_WIDTH = 400;
  const MIN_HEIGHT = 200;

  // Default position for floating boxes (cascade by index)
  const defaultPosition = {
    x: 100 + (index * CASCADE_OFFSET),
    y: window.innerHeight - 400 + (index * CASCADE_OFFSET)
  };
  const defaultSize = { width: 900, height: 350 };

  const [position, setPosition] = useState(box.position ?? defaultPosition);
  const [size, setSize] = useState(box.size ?? defaultSize);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState<ResizeHandle>(null);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0, posX: 0, posY: 0 });

  const boxRef = useRef<HTMLDivElement>(null);

  // Handle dragging start
  const handleDragStart = (e: React.MouseEvent) => {
    if (box.mode === 'transitory') return; // Transitory boxes can't be dragged

    if (boxRef.current) {
      const rect = boxRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
    }

    // Bring to front on drag start
    onBringToFront?.();
  };

  // Handle resizing start
  const handleResizeStart = (e: React.MouseEvent, handle: ResizeHandle) => {
    if (box.mode === 'transitory') return; // Transitory boxes can't be resized

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

    // Bring to front on resize start
    onBringToFront?.();
  };

  // Handle mouse move for dragging/resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
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

        // Handle different resize directions
        if (isResizing.includes('e')) {
          newWidth = Math.max(MIN_WIDTH, resizeStart.width + deltaX);
        }
        if (isResizing.includes('w')) {
          const proposedWidth = resizeStart.width - deltaX;
          if (proposedWidth >= MIN_WIDTH) {
            newWidth = proposedWidth;
            newX = resizeStart.posX + deltaX;
          }
        }
        if (isResizing.includes('s')) {
          newHeight = Math.max(MIN_HEIGHT, resizeStart.height + deltaY);
        }
        if (isResizing.includes('n')) {
          const proposedHeight = resizeStart.height - deltaY;
          if (proposedHeight >= MIN_HEIGHT) {
            newHeight = proposedHeight;
            newY = resizeStart.posY + deltaY;
          }
        }

        setSize({ width: newWidth, height: newHeight });
        setPosition({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      const wasDraggingOrResizing = isDragging || isResizing;
      setIsDragging(false);
      setIsResizing(null);

      // Notify parent of position/size change
      if (wasDraggingOrResizing && onChange) {
        onChange(position, size);
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
  }, [isDragging, isResizing, dragOffset, resizeStart, position, size, onChange]);

  // Click anywhere to bring to front (persistent mode only)
  const handleClick = () => {
    if (box.mode === 'persistent') {
      onBringToFront?.();
    } else if (box.mode === 'transitory' && onUpgradeToPersistent) {
      // Click on transitory box upgrades it
      onUpgradeToPersistent();
    }
  };

  // Z-index based on position in array (later = higher z-index)
  const zIndex = 50 + index;

  // Stacked mode rendering (non-draggable, fixed in panel)
  if (isStacked) {
    return (
      <div
        className="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-300 dark:border-slate-600 flex flex-col"
        style={{ minHeight: '300px', maxHeight: '500px' }}
        onClick={handleClick}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-4 py-2 ${box.metadata.color} text-white border-b rounded-t-lg`}>
          <div className="min-w-0 flex-1">
            <div className="font-semibold truncate">{box.metadata.title}</div>
          </div>
          {box.mode === 'persistent' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="ml-2 flex-shrink-0 hover:opacity-70 transition-opacity text-xl font-bold w-8 h-8 flex items-center justify-center rounded hover:bg-black hover:bg-opacity-20"
            >
              ×
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {box.content}
        </div>
      </div>
    );
  }

  // Dialog mode rendering (draggable, floating)
  return (
    <div
      ref={boxRef}
      className={`fixed bg-white dark:bg-slate-800 rounded-lg shadow-2xl border-2 ${
        box.mode === 'transitory' ? 'border-gray-400 dark:border-slate-500' : 'border-gray-300 dark:border-slate-600'
      } flex flex-col`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        minWidth: `${MIN_WIDTH}px`,
        minHeight: `${MIN_HEIGHT}px`,
        zIndex
      }}
      onClick={handleClick}
    >
      {/* Resize handles (persistent mode only) */}
      {box.mode === 'persistent' && (
        <>
          <div className="absolute -top-1 -left-1 w-3 h-3 cursor-nw-resize" onMouseDown={(e) => handleResizeStart(e, 'nw')} />
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-3 cursor-n-resize" onMouseDown={(e) => handleResizeStart(e, 'n')} />
          <div className="absolute -top-1 -right-1 w-3 h-3 cursor-ne-resize" onMouseDown={(e) => handleResizeStart(e, 'ne')} />
          <div className="absolute top-1/2 -translate-y-1/2 -left-1 w-3 h-8 cursor-w-resize" onMouseDown={(e) => handleResizeStart(e, 'w')} />
          <div className="absolute top-1/2 -translate-y-1/2 -right-1 w-3 h-8 cursor-e-resize" onMouseDown={(e) => handleResizeStart(e, 'e')} />
          <div className="absolute -bottom-1 -left-1 w-3 h-3 cursor-sw-resize" onMouseDown={(e) => handleResizeStart(e, 'sw')} />
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-3 cursor-s-resize" onMouseDown={(e) => handleResizeStart(e, 's')} />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 cursor-se-resize" onMouseDown={(e) => handleResizeStart(e, 'se')} />
        </>
      )}

      {/* Header */}
      <div
        className={`flex items-center justify-between px-4 py-2 ${box.metadata.color} text-white border-b ${
          box.mode === 'persistent' ? 'cursor-move' : 'cursor-default'
        } rounded-t-lg`}
        onMouseDown={handleDragStart}
      >
        <div className="min-w-0 flex-1">
          <div className="font-semibold truncate">{box.metadata.title}</div>
        </div>
        {box.mode === 'persistent' && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="ml-2 flex-shrink-0 hover:opacity-70 transition-opacity text-xl font-bold w-8 h-8 flex items-center justify-center rounded hover:bg-black hover:bg-opacity-20"
          >
            ×
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {box.content}
      </div>
    </div>
  );
}
