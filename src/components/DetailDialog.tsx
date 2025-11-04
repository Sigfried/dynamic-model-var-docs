// Must only import Element from models/, never concrete subclasses or DTOs
import { useState, useRef, useEffect } from 'react';
import DetailPanel from './DetailPanel';
import type { Element } from '../models/Element';
import type { ElementTypeId } from '../models/ElementRegistry';

interface DetailDialogProps {
  element: Element;
  onNavigate?: (elementName: string, elementType: ElementTypeId) => void;
  onClose: () => void;
  onChange?: (position: { x: number; y: number }, size: { width: number; height: number }) => void;
  dialogIndex?: number;
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
}

type ResizeHandle = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw' | null;

export default function DetailDialog({
  element,
  onNavigate,
  onClose,
  onChange,
  dialogIndex = 0,
  initialPosition,
  initialSize
}: DetailDialogProps) {
  // Position and size state - cascade dialogs by index
  const CASCADE_OFFSET = 40;
  const defaultPosition = {
    x: 100 + (dialogIndex * CASCADE_OFFSET),
    y: window.innerHeight - 400 + (dialogIndex * CASCADE_OFFSET)
  };
  const defaultSize = { width: 900, height: 350 };

  const [position, setPosition] = useState(initialPosition ?? defaultPosition);
  const [size, setSize] = useState(initialSize ?? defaultSize);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState<ResizeHandle>(null);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0, posX: 0, posY: 0 });

  const dialogRef = useRef<HTMLDivElement>(null);
  const MIN_WIDTH = 400;
  const MIN_HEIGHT = 200;

  // Close on Escape key (only for the oldest/bottommost dialog)
  useEffect(() => {
    if (dialogIndex !== 0) return; // Only the first/oldest/bottommost dialog handles Escape

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose, dialogIndex]);

  // Handle dragging
  const handleDragStart = (e: React.MouseEvent) => {
    if (dialogRef.current) {
      const rect = dialogRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
    }
  };

  // Handle resizing
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
  };

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
  }, [isDragging, isResizing, dragOffset, resizeStart, position, size]);

  // Get detail data once (not in render multiple times)
  const detailData = element.getDetailData();

  return (
    <div
      ref={dialogRef}
      className="fixed bg-white dark:bg-slate-800 rounded-lg shadow-2xl border-2 border-gray-300 dark:border-slate-600 flex flex-col z-50"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        minWidth: `${MIN_WIDTH}px`,
        minHeight: `${MIN_HEIGHT}px`
      }}
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

      {/* Draggable header */}
      <div
        className={`flex items-center justify-between px-4 py-2 ${detailData.titleColor} text-white border-b cursor-move rounded-t-lg`}
        onMouseDown={handleDragStart}
      >
        <div className="min-w-0 flex-1">
          <div className="font-semibold truncate">{detailData.title}</div>
          {detailData.subtitle && (
            <div className="text-sm opacity-90">{detailData.subtitle}</div>
          )}
        </div>
        <button
          onClick={onClose}
          className="ml-2 flex-shrink-0 hover:opacity-70 transition-opacity text-xl font-bold w-8 h-8 flex items-center justify-center rounded hover:bg-black hover:bg-opacity-20"
        >
          ×
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <DetailPanel
          element={element}
          onNavigate={onNavigate}
          onClose={onClose}
          hideHeader={true}
        />
      </div>
    </div>
  );
}
