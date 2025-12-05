/**
 * FloatingBoxManager - Manages floating boxes in cascade layout
 *
 * Key features:
 * - Single FloatingBox component supporting transitory (auto-dismiss) and persistent (draggable) modes
 * - FIFO stack management for multiple boxes
 * - Click/drag/resize brings box to front
 * - ESC closes boxes (transitory first, then auto-positioned, then user-positioned)
 * - All boxes are draggable/resizable (except transitory)
 * - Content agnostic - works with any React component
 *
 * Architecture: Maintains view/model separation - uses item IDs, never model-layer instances
 * UI layer uses "item" terminology
 */

import { useState, useRef, useEffect } from 'react';
import type { FloatingBoxMetadata, FloatingBoxData } from '../contracts/ComponentData';
import { APP_CONFIG } from '../config/appConfig';

// Re-export for backward compatibility
export type { FloatingBoxMetadata, FloatingBoxData };

interface FloatingBoxManagerProps {
  boxes: FloatingBoxData[];
  onClose: (id: string) => void;
  onChange?: (id: string, position: { x: number; y: number }, size: { width: number; height: number }) => void;
  onBringToFront?: (id: string) => void;
  onUpgradeToPersistent?: (id: string) => void;
}

type ResizeHandle = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw' | null;

export default function FloatingBoxManager({
  boxes,
  onClose,
  onChange,
  onBringToFront,
  onUpgradeToPersistent
}: FloatingBoxManagerProps) {
  // Handle ESC key - close in order: transitory, then auto-positioned (FIFO), then user-positioned (FIFO)
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && boxes.length > 0) {
        // 1. First close transitory boxes
        const transitoryBox = boxes.find(b => b.mode === 'transitory');
        if (transitoryBox) {
          onClose(transitoryBox.id);
          return;
        }

        // 2. Then close auto-positioned persistent boxes (FIFO - oldest first)
        const autoPositionedBoxes = boxes.filter(b => b.mode === 'persistent' && !b.isUserPositioned);
        if (autoPositionedBoxes.length > 0) {
          onClose(autoPositionedBoxes[0].id);
          return;
        }

        // 3. Finally close user-positioned persistent boxes (FIFO - oldest first)
        const userPositionedBoxes = boxes.filter(b => b.mode === 'persistent' && b.isUserPositioned);
        if (userPositionedBoxes.length > 0) {
          onClose(userPositionedBoxes[0].id);
        }
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [boxes, onClose]);

  // Determine if persistent boxes should be dimmed (when transitory box is showing)
  const hasTransitoryBox = boxes.some(b => b.mode === 'transitory');

  // Cascade layout - floating draggable boxes with multi-stack cascade positioning
  // CRITICAL: Render boxes in stable DOM order (sorted by ID) to prevent React from
  // reordering DOM elements. DOM reordering breaks CSS transitions because the browser
  // loses the "old" computed style to transition from. Only styles (position, z-index) change.

  // For z-index, use position in full array
  const boxIndexMap = new Map(boxes.map((box, index) => [box.id, index]));

  // For cascade positioning, only count auto-positioned boxes (user-positioned boxes float independently)
  const autoPositionedBoxes = boxes.filter(b => !b.isUserPositioned);
  const cascadeIndexMap = new Map(autoPositionedBoxes.map((box, index) => [box.id, index]));

  const sortedBoxes = [...boxes].sort((a, b) => a.id.localeCompare(b.id));

  return (
    <>
      {sortedBoxes.map((box) => {
        const zIndex = boxIndexMap.get(box.id)!;
        // Cascade index only for auto-positioned boxes; user-positioned boxes use stored position
        const cascadeIndex = cascadeIndexMap.get(box.id) ?? 0;
        // Dim persistent boxes when a transitory box is showing
        const shouldDim = hasTransitoryBox && box.mode === 'persistent';
        return (
          <FloatingBox
            key={box.id}
            box={box}
            index={cascadeIndex}
            totalBoxes={autoPositionedBoxes.length}
            onClose={() => onClose(box.id)}
            onChange={onChange ? (pos, size) => onChange(box.id, pos, size) : undefined}
            onBringToFront={onBringToFront ? () => onBringToFront(box.id) : undefined}
            onUpgradeToPersistent={onUpgradeToPersistent ? () => onUpgradeToPersistent(box.id) : undefined}
            isDimmed={shouldDim}
            zIndexOverride={zIndex}
          />
        );
      })}
    </>
  );
}

/**
 * FloatingBox - Single floating box component supporting transitory and persistent modes
 */
interface FloatingBoxProps {
  box: FloatingBoxData;
  index: number;          // Cascade position index (only counts auto-positioned boxes)
  totalBoxes: number;     // Total auto-positioned boxes for cascade calculation
  onClose: () => void;
  onChange?: (position: { x: number; y: number }, size: { width: number; height: number }) => void;
  onBringToFront?: () => void;
  onUpgradeToPersistent?: () => void;
  isDimmed?: boolean;     // Reduce brightness when another box (transitory) is in focus
  zIndexOverride?: number; // Override z-index (for maintaining z-order independent of cascade)
}

function FloatingBox({
  box,
  index,
  onClose,
  onChange,
  onBringToFront,
  onUpgradeToPersistent,
  isDimmed = false,
  zIndexOverride
}: FloatingBoxProps) {
  const MIN_WIDTH = 400;
  const MIN_HEIGHT = 200;

  /**
   * Multi-stack cascade positioning algorithm
   *
   * Creates cascading stacks of floating boxes that automatically wrap to a new stack
   * when the vertical space is exhausted. Boxes cascade with small Y offset to show
   * title bars peeking through. Starts low on screen to maximize visible content above.
   *
   * Algorithm (using browser coordinates - origin at top-left):
   * 1. Calculate starting Y position - low on screen but room for min boxes
   * 2. Calculate how many boxes fit vertically before needing a new stack
   * 3. Determine which stack this box belongs to (stackNumber = index / boxesPerStack)
   * 4. Position within stack (stackPosition = index % boxesPerStack)
   * 5. Calculate X: start + (stackNumber * stackOffset) + (stackPosition * xIncrement)
   * 6. Calculate Y: start + (stackPosition * yIncrement) - just title bar peek
   *
   * With fit-content sizing, boxes vary in size, so cascade uses expected max dimensions
   */
  const cascadeIncrement = {x: 30, y: 35}; // Offset for each successive box in a stack (title bar peek)
  const expectedMaxSize = { width: 700, height: 450 }; // Expected max for fit-content boxes
  const defaultSize = expectedMaxSize; // Used for resize state initialization
  const bottomMargin = 20;
  const minBoxesInStack = 4; // Minimum boxes we want to fit in cascade

  // Calculate starting Y - position for comfortable viewing
  const spaceNeededForMinBoxes = expectedMaxSize.height + (minBoxesInStack * cascadeIncrement.y) + bottomMargin;
  const preferredBottomPortion = window.innerHeight / 3;
  const cascadeStartY = window.innerHeight - Math.max(spaceNeededForMinBoxes, preferredBottomPortion);

  const cascadeStart = {x: 100, y: cascadeStartY};

  // Calculate how many boxes fit vertically in one stack
  const availableHeight = window.innerHeight - cascadeStart.y - bottomMargin;
  const yOffsetPerBox = cascadeIncrement.y; // Just title bar peek, not full box
  const boxesPerStack = Math.max(1, Math.floor((availableHeight - expectedMaxSize.height) / yOffsetPerBox) + 1);

  // Determine which stack and position within stack
  const currentStackNumber = Math.floor(index / boxesPerStack);
  const positionInStack = index % boxesPerStack;

  // Calculate X position
  // Each new stack offsets to show portion of previous box
  const stackOffsetX = expectedMaxSize.width * 0.4; // Show 40% of previous box
  const cascadeX = cascadeStart.x + (currentStackNumber * stackOffsetX) + (positionInStack * cascadeIncrement.x);

  // Calculate Y position (downward cascade - offset by title bar peek)
  const cascadeY = cascadeStart.y + (positionInStack * yOffsetPerBox);

  const defaultPosition = {
    x: cascadeX,
    y: cascadeY
  };

  // Position/size: use box prop if set, otherwise use local state (for dragging) or default
  // Local state only used when user drags/resizes - otherwise we derive from props
  const [localPosition, setLocalPosition] = useState<{x: number, y: number} | null>(null);
  const [localSize, setLocalSize] = useState<{width: number, height: number} | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState<ResizeHandle>(null);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0, posX: 0, posY: 0 });

  const boxRef = useRef<HTMLDivElement>(null);

  // Derive actual position: prop > local state > default cascade
  const position = box.position ?? localPosition ?? defaultPosition;
  const size = box.size ?? localSize ?? defaultSize;

  // Wrapper setters that update local state
  const setPosition = (pos: {x: number, y: number} | ((prev: {x: number, y: number}) => {x: number, y: number})) => {
    if (typeof pos === 'function') {
      setLocalPosition(prev => pos(prev ?? defaultPosition));
    } else {
      setLocalPosition(pos);
    }
  };
  const setSize = (sz: {width: number, height: number} | ((prev: {width: number, height: number}) => {width: number, height: number})) => {
    if (typeof sz === 'function') {
      setLocalSize(prev => sz(prev ?? defaultSize));
    } else {
      setLocalSize(sz);
    }
  };

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
  // Use override if provided (for separating z-order from cascade index)
  const zIndex = 50 + (zIndexOverride ?? index);

  // Cascade rendering (draggable, floating, cascading positions)
  // Boxes use fit-content sizing by default, but user-sized boxes keep explicit dimensions
  const hasUserSize = box.isUserPositioned && box.size != null;

  // Width: fit-content unless user explicitly sized
  const widthStyle = hasUserSize
    ? { width: `${size.width}px`, minWidth: `${MIN_WIDTH}px` }
    : { width: 'fit-content' as const, minWidth: '300px', maxWidth: '700px' };

  // Height: fit-content up to 2/3 viewport, unless user explicitly sized
  const maxHeight = Math.floor(window.innerHeight * 2 / 3);
  const heightStyle = hasUserSize
    ? { height: `${size.height}px`, minHeight: `${MIN_HEIGHT}px` }
    : { maxHeight: `${maxHeight}px` };

  // Animate position/size changes only when not actively dragging/resizing
  const shouldAnimate = !isDragging && !isResizing;

  // Dimmed appearance for boxes not in focus (when a transitory box is showing)
  const filterValue = isDimmed ? `brightness(${APP_CONFIG.boxAppearance.dimmedBrightness})` : 'none';
  const filterTransition = `filter ${APP_CONFIG.timing.opacityTransition}ms ease-out`;

  return (
    <div
      ref={boxRef}
      className={`fixed bg-white dark:bg-slate-800 rounded-lg shadow-2xl border-2 ${
        box.mode === 'transitory' ? 'border-gray-400 dark:border-slate-500' : 'border-gray-300 dark:border-slate-600'
      } flex flex-col`}
      style={{
        left: 0,
        top: 0,
        transform: `translate(${position.x}px, ${position.y}px)`,
        ...widthStyle,
        ...heightStyle,
        zIndex,
        filter: filterValue,
        transition: shouldAnimate
          ? `transform ${APP_CONFIG.timing.boxTransition}ms ease-out, width ${APP_CONFIG.timing.boxTransition}ms ease-out, height ${APP_CONFIG.timing.boxTransition}ms ease-out, ${filterTransition}`
          : filterTransition
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
          <div className={`font-semibold ${box.mode === 'persistent' ? 'truncate' : ''}`}>{box.metadata.title}</div>
          {box.metadata.subtitle && (
            <div className="text-sm opacity-90">{box.metadata.subtitle}</div>
          )}
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

      {/* Content - scrollable when content exceeds max height */}
      <div className="flex-1 overflow-y-auto">
        {box.content}
      </div>
    </div>
  );
}
