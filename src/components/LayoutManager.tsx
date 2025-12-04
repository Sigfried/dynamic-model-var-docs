/**
 * LayoutManager Component
 *
 * Consolidates all layout logic for the three-panel interface:
 * - Panel section state management (left, middle, right)
 * - Display mode calculation (stacked vs cascade)
 * - Floating box management
 * - LinkOverlay conditional rendering
 * - Panel visibility and sizing
 *
 * Responsibilities moved from App.tsx:
 * - Section state (leftSections, middleSections, rightSections)
 * - Floating box state and handlers
 * - Hovered item state
 * - Building section data maps
 * - Building toggle button data
 * - Conditional LinkOverlay rendering (1 or 2 based on middle panel)
 *
 * App.tsx simplified to: load data, create DataService, render LayoutManager
 */

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import ItemsPanel, { type ToggleButtonData } from './ItemsPanel';
import type { SectionData, ItemHoverData } from './Section';
import FloatingBoxManager, { type FloatingBoxData } from './FloatingBoxManager';
import DetailContent from './DetailContent';
import LinkOverlay from './LinkOverlay';
import { RelationshipInfoContent } from './RelationshipInfoBox';
import { APP_CONFIG } from '../config/appConfig';
import { type DialogState } from '../utils/statePersistence';
import { calculateDisplayMode } from '../utils/layoutHelpers';
import { type DataService } from '../services/DataService';

interface LayoutManagerProps {
  dataService: DataService;
  leftSections: string[];
  middleSections: string[];
  rightSections: string[];
  setMiddleSections: (sections: string[]) => void;
  setRightSections: (sections: string[]) => void;
  initialDialogs?: DialogState[];
  setDialogStatesGetter: (getter: () => DialogState[]) => void;
}

export default function LayoutManager({
  dataService,
  leftSections,
  middleSections,
  rightSections,
  setMiddleSections,
  setRightSections,
  initialDialogs = [],
  setDialogStatesGetter
}: LayoutManagerProps) {
  // LayoutManager is now a controlled component - receives state from parent

  // Floating box state
  const [hoveredItem, setHoveredItem] = useState<ItemHoverData | null>(null);
  const [floatingBoxes, setFloatingBoxes] = useState<FloatingBoxData[]>([]);
  const [nextBoxId, setNextBoxId] = useState(0);
  const [hasRestoredDialogs, setHasRestoredDialogs] = useState(false);

  // Display mode calculation
  const [displayMode, setDisplayMode] = useState<'stacked' | 'cascade'>('cascade');
  const [stackedWidth, setStackedWidth] = useState(600);

  // Hover timing refs
  const hoverTimerRef = useRef<number | null>(null);
  const lingerTimerRef = useRef<number | null>(null);

  // Measure available space and set display mode
  useEffect(() => {
    const measureSpace = () => {
      const windowWidth = window.innerWidth;
      const middleVisible = middleSections.length > 0;
      const { mode, spaceInfo } = calculateDisplayMode(windowWidth, leftSections.length, rightSections.length, middleVisible);
      setDisplayMode(mode);
      // Use remaining space for stacked width, with minimum of 400px
      if (mode === 'stacked') {
        setStackedWidth(Math.max(400, spaceInfo.remainingSpace - 20)); // 20px for padding
      }
    };

    measureSpace();
    window.addEventListener('resize', measureSpace);
    return () => window.removeEventListener('resize', measureSpace);
  }, [leftSections, rightSections, middleSections]);

  // Convert floating boxes to dialog states for persistence
  const getDialogStatesFromBoxes = useCallback((): DialogState[] => {
    return floatingBoxes
      .filter(box => box.mode === 'persistent')
      .map(box => {
        const state: DialogState = {
          itemName: box.itemId
        };

        if (box.isUserPositioned && box.position && box.size) {
          state.x = box.position.x;
          state.y = box.position.y;
          state.width = box.size.width;
          state.height = box.size.height;
        }

        return state;
      });
  }, [floatingBoxes]);

  // Provide dialog states getter to parent (for URL/localStorage persistence)
  useEffect(() => {
    setDialogStatesGetter(getDialogStatesFromBoxes);
  }, [getDialogStatesFromBoxes, setDialogStatesGetter]);

  // Restore floating boxes from initial dialogs (runs once after data loads)
  useEffect(() => {
    if (hasRestoredDialogs) return;
    if (initialDialogs.length === 0) return;

    setHasRestoredDialogs(true);

    const restoredBoxes: FloatingBoxData[] = [];
    let boxIdCounter = 0;

    initialDialogs.forEach(dialogState => {
      const itemId = dialogState.itemName;

      if (dataService.itemExists(itemId)) {
        const metadata = dataService.getFloatingBoxMetadata(itemId);
        if (metadata) {
          const box: FloatingBoxData = {
            id: `box-${boxIdCounter}`,
            mode: 'persistent',
            metadata,
            content: <DetailContent itemId={itemId} dataService={dataService} hideHeader={true} />,
            itemId
          };

          if (dialogState.x !== undefined && dialogState.y !== undefined &&
              dialogState.width !== undefined && dialogState.height !== undefined) {
            box.position = { x: dialogState.x, y: dialogState.y };
            box.size = { width: dialogState.width, height: dialogState.height };
            box.isUserPositioned = true;
          }

          restoredBoxes.push(box);
          boxIdCounter++;
        }
      }
    });

    if (restoredBoxes.length > 0) {
      const sortedBoxes = restoredBoxes.sort((a, b) => {
        const aPositioned = a.isUserPositioned ? 1 : 0;
        const bPositioned = b.isUserPositioned ? 1 : 0;
        return aPositioned - bPositioned;
      });

      setFloatingBoxes(sortedBoxes);
      setNextBoxId(boxIdCounter);
    }
  }, [dataService, initialDialogs, hasRestoredDialogs]);

  // Build toggle button data
  const allToggleButtons = useMemo<ToggleButtonData[]>(() => {
    return dataService.getToggleButtonsData();
  }, [dataService]);

  const rightPanelToggleButtons = useMemo<ToggleButtonData[]>(() => {
    return allToggleButtons.filter(btn =>
      btn.id === 'class' || btn.id === 'enum' || btn.id === 'type'
    );
  }, [allToggleButtons]);

  // Build section data maps
  const leftSectionData = useMemo<Map<string, SectionData>>(() => {
    return dataService.getAllSectionsData('left');
  }, [dataService]);

  const middleSectionData = useMemo<Map<string, SectionData>>(() => {
    return dataService.getAllSectionsData('middle');
  }, [dataService]);

  const rightSectionData = useMemo<Map<string, SectionData>>(() => {
    return dataService.getAllSectionsData('right');
  }, [dataService]);

  // Open a new floating box (or bring existing one to front)
  const handleOpenFloatingBox = useCallback((hoverData: { type: string; name: string }, position?: { x: number; y: number }, size?: { width: number; height: number }) => {
    const itemId = hoverData.name;

    if (!dataService.itemExists(itemId)) {
      console.warn(`Item "${itemId}" not found`);
      return;
    }

    const existingIndex = floatingBoxes.findIndex(b => b.itemId === itemId);

    if (existingIndex !== -1) {
      setFloatingBoxes(prev => {
        const updated = [...prev];
        const [existing] = updated.splice(existingIndex, 1);
        return [...updated, existing];
      });
      return;
    }

    const metadata = dataService.getFloatingBoxMetadata(itemId);
    if (!metadata) {
      console.warn(`Could not get metadata for item "${itemId}"`);
      return;
    }

    const newBox: FloatingBoxData = {
      id: `box-${nextBoxId}`,
      mode: 'persistent',
      metadata,
      content: <DetailContent itemId={itemId} dataService={dataService} hideHeader={true} />,
      itemId,
      position,
      size
    };

    setFloatingBoxes(prev => [...prev, newBox]);
    setNextBoxId(prev => prev + 1);
  }, [dataService, floatingBoxes, nextBoxId]);

  // Get item ID and DOM ID for hovered item (for RelationshipInfoBox)
  const hoveredItemId = useMemo(() => {
    return hoveredItem?.name ?? null;
  }, [hoveredItem]);

  const hoveredItemDomId = useMemo(() => {
    return hoveredItem?.id ?? null;
  }, [hoveredItem]);

  // Navigation handler - opens a new floating box (defined early for use in hover effect)
  const handleNavigate = useCallback((itemName: string, itemSection: string) => {
    handleOpenFloatingBox({ type: itemSection, name: itemName });
  }, [handleOpenFloatingBox]);

  // Helper to calculate position for transitory box based on DOM node
  const calculateTransitoryBoxPosition = useCallback((domId: string): { x: number; y: number } | null => {
    const itemNode = document.getElementById(domId);
    if (!itemNode) return null;

    const itemRect = itemNode.getBoundingClientRect();
    const estimatedBoxHeight = APP_CONFIG.layout.estimatedBoxHeight;
    const maxBoxHeight = window.innerHeight * 0.8;

    // Find the rightmost edge of visible panels
    const leftPanel = document.querySelector('[data-panel-position="left"]')?.parentElement?.parentElement;
    const rightPanel = document.querySelector('[data-panel-position="right"]')?.parentElement?.parentElement;

    let rightmostEdge = 0;
    if (rightPanel) {
      rightmostEdge = rightPanel.getBoundingClientRect().right;
    } else if (leftPanel) {
      rightmostEdge = leftPanel.getBoundingClientRect().right;
    }

    const idealX = Math.max(370, rightmostEdge + 20);
    const boxWidth = 500;
    const maxX = window.innerWidth - boxWidth - 10;
    const xPosition = Math.min(idealX, maxX);

    const itemCenterY = itemRect.top + (itemRect.height / 2);
    const idealY = itemCenterY - (estimatedBoxHeight / 2);
    const minY = 10;
    const maxY = window.innerHeight - maxBoxHeight - 10;
    const yPosition = Math.max(minY, Math.min(idealY, maxY));

    return { x: xPosition, y: yPosition };
  }, []);

  // Effect to create/update transitory floating box on hover
  useEffect(() => {
    // Clear any existing timers
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    if (lingerTimerRef.current) {
      clearTimeout(lingerTimerRef.current);
      lingerTimerRef.current = null;
    }

    if (hoveredItemId && hoveredItemDomId) {
      // Item hovered - show after short delay
      hoverTimerRef.current = window.setTimeout(() => {
        // Check if there's already a persistent box for this item
        const existingPersistent = floatingBoxes.find(
          b => b.itemId === hoveredItemId && b.mode === 'persistent'
        );
        if (existingPersistent) return; // Don't show transitory if persistent exists

        const position = calculateTransitoryBoxPosition(hoveredItemDomId);
        if (!position) return;

        const metadata = dataService.getFloatingBoxMetadata(hoveredItemId);
        if (!metadata) return;

        // Remove any existing transitory box for different item
        setFloatingBoxes(prev => {
          const filtered = prev.filter(b => b.mode !== 'transitory');
          const newBox: FloatingBoxData = {
            id: `transitory-${hoveredItemId}`,
            mode: 'transitory',
            metadata,
            content: <RelationshipInfoContent itemId={hoveredItemId} dataService={dataService} onNavigate={handleNavigate} />,
            itemId: hoveredItemId,
            position,
            size: { width: 500, height: 400 }
          };
          return [...filtered, newBox];
        });
      }, APP_CONFIG.timing.hoverDebounce);
    } else {
      // Item unhovered - start linger timer then remove transitory box
      lingerTimerRef.current = window.setTimeout(() => {
        setFloatingBoxes(prev => prev.filter(b => b.mode !== 'transitory'));
      }, APP_CONFIG.timing.lingerDuration);
    }

    return () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
      if (lingerTimerRef.current) clearTimeout(lingerTimerRef.current);
    };
  }, [hoveredItemId, hoveredItemDomId, dataService, floatingBoxes, calculateTransitoryBoxPosition, handleNavigate]);

  // Handle upgrade: change transitory box to persistent (no new box creation)
  const handleUpgradeToPersistent = useCallback((boxId: string) => {
    setFloatingBoxes(prev => prev.map(box => {
      if (box.id === boxId && box.mode === 'transitory') {
        // Upgrade to persistent - same content, same position, new mode
        return {
          ...box,
          id: `box-${nextBoxId}`, // Give it a proper persistent ID
          mode: 'persistent' as const
        };
      }
      return box;
    }));
    setNextBoxId(prev => prev + 1);
    setHoveredItem(null);
  }, [nextBoxId]);

  // Close a floating box
  const handleCloseFloatingBox = useCallback((id: string) => {
    setFloatingBoxes(prev => prev.filter(b => b.id !== id));
  }, []);

  // Update floating box position/size (marks box as user-positioned)
  const handleFloatingBoxChange = useCallback((id: string, position: { x: number; y: number }, size: { width: number; height: number }) => {
    setFloatingBoxes(prev => prev.map(b =>
      b.id === id ? { ...b, position, size, isUserPositioned: true } : b
    ));
  }, []);

  // Bring floating box to front (move to end of array for higher z-index)
  const handleBringToFront = useCallback((id: string) => {
    setFloatingBoxes(prev => {
      const index = prev.findIndex(b => b.id === id);
      if (index === -1 || index === prev.length - 1) return prev;

      const updated = [...prev];
      const [box] = updated.splice(index, 1);
      return [...updated, box];
    });
  }, []);

  // Panel dimensions
  const EMPTY_PANEL_WIDTH = 180;
  const MAX_PANEL_WIDTH = 450;

  // Panel visibility
  const leftPanelEmpty = leftSections.length === 0;
  const middlePanelEmpty = middleSections.length === 0;
  const rightPanelEmpty = rightSections.length === 0;

  // Toggle middle panel (show/hide slots)
  const handleToggleMiddlePanel = useCallback(() => {
    if (middlePanelEmpty) {
      setMiddleSections(['slot']);
    } else {
      setMiddleSections([]);
    }
  }, [middlePanelEmpty, setMiddleSections]);

  return (
    <div className="flex-1 flex relative overflow-hidden">
      {/* Three-panel layout */}
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
          <ItemsPanel
            position="left"
            sections={leftSections}
            onSectionsChange={() => {}} // No-op - left panel fixed
            sectionData={leftSectionData}
            toggleButtons={[]} // No toggles for left panel
            onClickItem={handleOpenFloatingBox}
            onItemHover={setHoveredItem}
            onItemLeave={() => setHoveredItem(null)}
          />
        </div>

        {/* Left-Middle gutter - show when middle panel visible */}
        {!middlePanelEmpty && (
          <div className="w-40 bg-gray-100 dark:bg-slate-800 flex-shrink-0" />
        )}

        {/* Middle Panel - Slots (toggleable) */}
        {!middlePanelEmpty && (
          <div
            className="h-full overflow-hidden border-x border-gray-200 dark:border-slate-700 flex-shrink-0 relative"
            style={{
              maxWidth: `${MAX_PANEL_WIDTH}px`,
              minWidth: '300px'
            }}
          >
            <ItemsPanel
              position="middle"
              sections={['slot']} // Always 'slot' when visible
              onSectionsChange={() => {}} // No-op - middle panel fixed
              sectionData={middleSectionData}
              toggleButtons={[]} // No toggles for middle panel
              onClickItem={handleOpenFloatingBox}
              onItemHover={setHoveredItem}
              onItemLeave={() => setHoveredItem(null)}
              title="Slots"
            />
            {/* Hide button */}
            <button
              onClick={handleToggleMiddlePanel}
              className="absolute top-2 right-2 w-6 h-6 rounded bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-600 dark:text-gray-300 flex items-center justify-center text-xs transition-colors z-10"
              title="Hide Slots panel"
            >
              ✕
            </button>
          </div>
        )}

        {/* Middle-Right gutter - show when middle panel visible */}
        {!middlePanelEmpty && (
          <div className="w-40 bg-gray-100 dark:bg-slate-800 flex-shrink-0" />
        )}

        {/* Center gutter / toggle button - show when middle panel hidden */}
        {!leftPanelEmpty && !rightPanelEmpty && middlePanelEmpty && (
          <button
            onClick={handleToggleMiddlePanel}
            className="w-40 bg-gray-100 dark:bg-slate-800 border-x border-gray-200 dark:border-slate-700 flex-shrink-0 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center group"
            title="Click to show Slots panel"
          >
            <div className="text-center">
              <div className="text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 text-sm font-medium">
                Show Slots
              </div>
              <div className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                ▶
              </div>
            </div>
          </button>
        )}

        {/* Right Panel - Ranges only */}
        <div
          className="h-full overflow-hidden border-l border-gray-200 dark:border-slate-700 flex-1"
          style={{
            width: rightPanelEmpty ? `${EMPTY_PANEL_WIDTH}px` : undefined,
            maxWidth: rightPanelEmpty ? undefined : `${MAX_PANEL_WIDTH}px`,
            minWidth: rightPanelEmpty ? undefined : '300px'
          }}
        >
          <ItemsPanel
            position="right"
            sections={rightSections}
            onSectionsChange={setRightSections}
            sectionData={rightSectionData}
            toggleButtons={rightPanelToggleButtons} // Only C, E, T
            onClickItem={handleOpenFloatingBox}
            onItemHover={setHoveredItem}
            onItemLeave={() => setHoveredItem(null)}
            title="Ranges:"
          />
        </div>

        {/* Spacer to push remaining space to the right - only in cascade mode */}
        {displayMode === 'cascade' && <div className="flex-1" />}
      </div>

      {/* SVG Link Overlay - single instance queries DOM for all visible items */}
      <LinkOverlay
        leftSections={leftSections}
        rightSections={rightSections}
        dataService={dataService}
        hoveredItem={hoveredItem}
      />

      {/* Floating Box Manager */}
      <FloatingBoxManager
        boxes={floatingBoxes}
        displayMode={displayMode}
        stackedWidth={stackedWidth}
        onClose={handleCloseFloatingBox}
        onChange={handleFloatingBoxChange}
        onBringToFront={handleBringToFront}
        onUpgradeToPersistent={handleUpgradeToPersistent}
      />

    </div>
  );
}
