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

import { useState, useRef, useEffect } from 'react';
import type { FloatingBoxMetadata, FloatingBoxData } from '../contracts/ComponentData';
import { APP_CONFIG } from '../config/appConfig';

// Re-export for backward compatibility
export type { FloatingBoxMetadata, FloatingBoxData };

interface FloatingBoxManagerProps {
  boxes: FloatingBoxData[];
  displayMode: 'cascade' | 'stacked';
  stackedWidth?: number; // Width for stacked mode (defaults to 600)
  onClose: (id: string) => void;
  onChange?: (id: string, position: { x: number; y: number }, size: { width: number; height: number }) => void;
  onBringToFront?: (id: string) => void;
  onUpgradeToPersistent?: (id: string) => void;
}

type ResizeHandle = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw' | null;

export default function FloatingBoxManager({
  boxes,
  displayMode,
  stackedWidth = 600,
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
  // Transitory boxes always float (never stacked) - they're interactive tooltips
  const transitoryBoxes = boxes.filter(b => b.mode === 'transitory');
  const persistentBoxes = boxes.filter(b => b.mode === 'persistent');

  // Determine if persistent boxes should be dimmed (when transitory box is showing)
  const hasTransitoryBox = transitoryBoxes.length > 0;

  if (displayMode === 'stacked') {
    // Stacked layout - only persistent boxes in vertical stack (newest at top)
    const reversedPersistent = [...persistentBoxes].reverse();

    return (
      <>
        {/* Stacked persistent boxes */}
        <div
          className="absolute right-0 top-0 h-full overflow-y-auto flex flex-col gap-4 p-4 bg-gray-50 dark:bg-slate-900 z-40"
          style={{ width: `${stackedWidth}px` }}
        >
          {reversedPersistent.map((box, index) => (
            <FloatingBox
              key={box.id}
              box={box}
              index={index}
              totalBoxes={persistentBoxes.length}
              onClose={() => onClose(box.id)}
              onChange={onChange ? (pos, size) => onChange(box.id, pos, size) : undefined}
              onBringToFront={onBringToFront ? () => onBringToFront(box.id) : undefined}
              onUpgradeToPersistent={onUpgradeToPersistent ? () => onUpgradeToPersistent(box.id) : undefined}
              isStacked={true}
              isDimmed={hasTransitoryBox}
            />
          ))}
        </div>
        {/* Transitory boxes always float */}
        {transitoryBoxes.map((box, index) => (
          <FloatingBox
            key={box.id}
            box={box}
            index={index}
            totalBoxes={transitoryBoxes.length}
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

  // Cascade mode - floating draggable boxes with multi-stack cascade positioning
  // CRITICAL: Render boxes in stable DOM order (sorted by ID) to prevent React from
  // reordering DOM elements. DOM reordering breaks CSS transitions because the browser
  // loses the "old" computed style to transition from. Only styles (position, z-index) change.
  const boxIndexMap = new Map(boxes.map((box, index) => [box.id, index]));
  const sortedBoxes = [...boxes].sort((a, b) => a.id.localeCompare(b.id));

  return (
    <>
      {sortedBoxes.map((box) => {
        const originalIndex = boxIndexMap.get(box.id)!;
        // Dim persistent boxes when a transitory box is showing
        const shouldDim = hasTransitoryBox && box.mode === 'persistent';
        return (
          <FloatingBox
            key={box.id}
            box={box}
            index={originalIndex}
            totalBoxes={boxes.length}
            onClose={() => onClose(box.id)}
            onChange={onChange ? (pos, size) => onChange(box.id, pos, size) : undefined}
            onBringToFront={onBringToFront ? () => onBringToFront(box.id) : undefined}
            onUpgradeToPersistent={onUpgradeToPersistent ? () => onUpgradeToPersistent(box.id) : undefined}
            isStacked={false}
            isDimmed={shouldDim}
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
  index: number;
  totalBoxes: number;
  onClose: () => void;
  onChange?: (position: { x: number; y: number }, size: { width: number; height: number }) => void;
  onBringToFront?: () => void;
  onUpgradeToPersistent?: () => void;
  isStacked: boolean;
  isDimmed?: boolean; // Reduce opacity when another box (transitory) is in focus
}

function FloatingBox({
  box,
  index,
  onClose,
  onChange,
  onBringToFront,
  onUpgradeToPersistent,
  isStacked,
  isDimmed = false
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
   * TODO: Move these values to appConfig when implemented
   */
  const cascadeIncrement = {x: 40, y: 40}; // Offset for each successive box in a stack (title bar peek)
  const defaultSize = { width: 900, height: 350 };
  const bottomMargin = 20;
  const minBoxesInStack = 3; // Minimum boxes we want to fit in cascade

  // Calculate starting Y - low on screen but with room for minimum boxes
  // Aim for bottom 1/3 to 1/4 of screen, ensuring at least minBoxesInStack fit
  const spaceNeededForMinBoxes = defaultSize.height + (minBoxesInStack * cascadeIncrement.y) + bottomMargin;
  const preferredBottomPortion = window.innerHeight / 3.5;
  const cascadeStartY = window.innerHeight - Math.max(spaceNeededForMinBoxes, preferredBottomPortion);

  const cascadeStart = {x: 100, y: cascadeStartY};

  // Calculate how many boxes fit vertically in one stack
  const availableHeight = window.innerHeight - cascadeStart.y - bottomMargin;
  const yOffsetPerBox = cascadeIncrement.y; // Just title bar peek, not full box
  const boxesPerStack = Math.max(1, Math.floor((availableHeight - defaultSize.height) / yOffsetPerBox) + 1);

  // Determine which stack and position within stack
  const currentStackNumber = Math.floor(index / boxesPerStack);
  const positionInStack = index % boxesPerStack;

  // Calculate X position
  // Each new stack offsets to show 1/3 of previous box (300px for 900px box)
  const amountOfBoxWidthVisibleUnderNextStack = 1/3;
  const stackOffsetX = defaultSize.width * amountOfBoxWidthVisibleUnderNextStack;
  const cascadeX = cascadeStart.x + (currentStackNumber * stackOffsetX) + (positionInStack * cascadeIncrement.x);

  // Calculate Y position (downward cascade - offset by full box height + peek)
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
            <div className="font-semibold">{box.metadata.title}</div>
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

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {box.content}
        </div>
      </div>
    );
  }

  // Cascade mode rendering (draggable, floating, cascading positions)
  // Transitory boxes use fit-content width (sizes to header/content) and flexible height
  const widthStyle = box.mode === 'transitory'
    ? { width: 'fit-content' as const, minWidth: '300px', maxWidth: '600px' }
    : { width: `${size.width}px`, minWidth: `${MIN_WIDTH}px` };

  // Transitory boxes fit content up to 2/3 viewport height; persistent boxes have fixed height
  const heightStyle = box.mode === 'transitory'
    ? { maxHeight: `${Math.floor(window.innerHeight * 2 / 3)}px` }
    : { height: `${size.height}px`, minHeight: `${MIN_HEIGHT}px` };

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

      {/* Content */}
      <div className={`flex-1 ${box.mode === 'transitory' ? 'overflow-y-auto' : 'overflow-hidden'}`}>
        {box.content}
      </div>
    </div>
  );
}
