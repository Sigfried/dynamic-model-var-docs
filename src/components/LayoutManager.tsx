/**
 * LayoutManager Component
 *
 * Consolidates all layout logic for the three-panel interface:
 * - Panel section state management (left, middle, right)
 * - Floating box management (groups for persistent, transitory for hover)
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
import FloatingBoxManager from './FloatingBoxManager';
import type { FloatingBoxData, FloatingBoxGroupData, GroupId } from '../contracts/ComponentData';
import DetailContent from './DetailContent';
import LinkOverlay from './LinkOverlay';
import { RelationshipInfoContent } from './RelationshipInfoBox';
import { APP_CONFIG, getFloatSettings } from '../config/appConfig';
import { type DialogState, contentTypeToGroupId } from '../utils/statePersistence';
import { type DataService } from '../services/DataService';
import {
  openPopout,
  closeAllPopouts,
} from '../utils/popoutWindow';
import { createPortal } from 'react-dom';
import PopoutContent from './PopoutContent';

interface LayoutManagerProps {
  dataService: DataService;
  leftSections: string[];
  middleSections: string[];
  rightSections: string[];
  setMiddleSections: (sections: string[]) => void;
  setRightSections: (sections: string[]) => void;
  initialDialogs?: DialogState[];
  setDialogStatesGetter: (getter: () => DialogState[]) => void;
  onDialogsChange?: () => void;  // Called when persistent dialogs change (for URL persistence)
}

export default function LayoutManager({
  dataService,
  leftSections,
  middleSections,
  rightSections,
  setMiddleSections,
  setRightSections,
  initialDialogs = [],
  setDialogStatesGetter,
  onDialogsChange
}: LayoutManagerProps) {
  // Hover state
  const [hoveredItem, setHoveredItem] = useState<ItemHoverData | null>(null);

  // Highlighted box ID (when hovering an item with an open box)
  const [highlightedBoxId, setHighlightedBoxId] = useState<string | null>(null);

  // Transitory box (only one at a time, for hover preview)
  const [transitoryBox, setTransitoryBox] = useState<FloatingBoxData | null>(null);

  // Track scrolling state to suppress transitory boxes during scroll
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<number | null>(null);


  // Groups containing persistent boxes
  const [groups, setGroups] = useState<FloatingBoxGroupData[]>([]);

  // Track popout containers for React portals (groupId -> container element)
  const [popoutContainers, setPopoutContainers] = useState<Map<GroupId, HTMLElement>>(new Map());

  const [hasRestoredDialogs, setHasRestoredDialogs] = useState(false);

  // Convert groups to dialog states for persistence (item names and content types)
  const getDialogStatesFromGroups = useCallback((): DialogState[] => {
    const states: DialogState[] = [];
    for (const group of groups) {
      for (const box of group.boxes) {
        states.push({ itemName: box.itemId, contentType: box.contentType });
      }
    }
    return states;
  }, [groups]);

  // Provide dialog states getter to parent (for URL/localStorage persistence)
  useEffect(() => {
    setDialogStatesGetter(getDialogStatesFromGroups);
  }, [getDialogStatesFromGroups, setDialogStatesGetter]);

  // Notify parent when persistent dialogs change (for URL persistence)
  const groupsStateJson = useMemo(() => {
    return JSON.stringify(groups.map(g => ({
      id: g.id,
      boxes: g.boxes.map(b => ({ itemId: b.itemId, contentType: b.contentType, isCollapsed: b.isCollapsed }))
    })));
  }, [groups]);

  useEffect(() => {
    if (!hasRestoredDialogs && initialDialogs.length > 0) return;
    const timer = setTimeout(() => {
      onDialogsChange?.();
    }, APP_CONFIG.timing.boxTransition + 50);
    return () => clearTimeout(timer);
  }, [groupsStateJson, hasRestoredDialogs, initialDialogs.length, onDialogsChange]);

  // Ref for navigate handler (used by restored relationship boxes)
  const navigateRef = useRef<(itemName: string, itemSection: string) => void>(undefined);

  // Restore floating boxes from initial dialogs (runs once after data loads)
  useEffect(() => {
    if (hasRestoredDialogs) return;
    if (initialDialogs.length === 0) return;

    setHasRestoredDialogs(true);

    // Build groups from restored dialogs, respecting contentType
    const detailsBoxes: FloatingBoxData[] = [];
    const relationshipsBoxes: FloatingBoxData[] = [];

    initialDialogs.forEach((dialogState, index) => {
      const itemId = dialogState.itemName;
      const contentType = dialogState.contentType ?? 'detail';
      const isRelationship = contentType === 'relationship';

      if (dataService.itemExists(itemId)) {
        const metadata = isRelationship
          ? dataService.getRelationshipBoxMetadata(itemId)
          : dataService.getFloatingBoxMetadata(itemId);
        if (metadata) {
          const box: FloatingBoxData = {
            id: `restored-${Date.now()}-${index}`,
            mode: 'persistent',
            contentType,
            metadata,
            content: isRelationship
              ? <RelationshipInfoContent itemId={itemId} dataService={dataService} onNavigate={(name, section) => navigateRef.current?.(name, section)} />
              : <DetailContent itemId={itemId} dataService={dataService} hideHeader={true} />,
            itemId,
            isCollapsed: false  // Restored boxes start expanded (could use heuristic later)
          };
          if (isRelationship) {
            relationshipsBoxes.push(box);
          } else {
            detailsBoxes.push(box);
          }
        }
      }
    });

    const newGroups: FloatingBoxGroupData[] = [];

    // Create details group if we have detail boxes
    if (detailsBoxes.length > 0) {
      const detailsSettings = getFloatSettings('details');
      const restoreMode = detailsSettings.restoreExpansionMode;
      let shouldExpand = restoreMode !== 'all-collapsed';

      newGroups.push({
        id: 'details',
        title: detailsSettings.title,
        boxes: detailsBoxes.map(box => ({ ...box, isCollapsed: !shouldExpand }))
      });
    }

    // Create relationships group if we have relationship boxes
    if (relationshipsBoxes.length > 0) {
      const relSettings = getFloatSettings('relationships');
      const restoreMode = relSettings.restoreExpansionMode;
      let shouldExpand = restoreMode !== 'all-collapsed';

      newGroups.push({
        id: 'relationships',
        title: relSettings.title,
        boxes: relationshipsBoxes.map(box => ({ ...box, isCollapsed: !shouldExpand }))
      });
    }

    if (newGroups.length > 0) {
      setGroups(newGroups);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- handleNavigate changes but content uses it via closure
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

  // Navigation handler for relationship links
  const handleNavigate = useCallback((itemName: string, _itemSection: string) => {
    handleOpenFloatingBox({ type: _itemSection, name: itemName });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep navigateRef in sync with handleNavigate
  navigateRef.current = handleNavigate;

  // Add a box to a group (creates group if it doesn't exist)
  // Boxes are stored in groups state; if group is popped out, React portal renders them there
  const addBoxToGroup = useCallback((box: FloatingBoxData) => {
    const groupId = contentTypeToGroupId(box.contentType);
    const groupSettings = getFloatSettings(groupId);

    setGroups(prev => {
      const existingGroupIndex = prev.findIndex(g => g.id === groupId);

      if (existingGroupIndex !== -1) {
        // Group exists - add box and collapse others
        const updatedGroups = [...prev];
        const group = { ...updatedGroups[existingGroupIndex] };

        // Check if box for this item already exists
        const existingBoxIndex = group.boxes.findIndex(b =>
          b.itemId === box.itemId && b.contentType === box.contentType
        );

        if (existingBoxIndex !== -1) {
          // Box exists - expand it, collapse others, move to end
          group.boxes = group.boxes.map((b, i) => ({
            ...b,
            isCollapsed: i !== existingBoxIndex
          }));
          // Move to end
          const [existingBox] = group.boxes.splice(existingGroupIndex, 1);
          group.boxes.push({ ...existingBox, isCollapsed: false });
        } else {
          // New box - collapse existing, add new expanded at end
          group.boxes = [
            ...group.boxes.map(b => ({ ...b, isCollapsed: true })),
            { ...box, isCollapsed: false }
          ];
        }

        updatedGroups[existingGroupIndex] = group;

        // Move this group to end (most recently used)
        const [movedGroup] = updatedGroups.splice(existingGroupIndex, 1);
        return [...updatedGroups, movedGroup];
      } else {
        // Create new group
        const newGroup: FloatingBoxGroupData = {
          id: groupId,
          title: groupSettings.title,
          boxes: [{ ...box, isCollapsed: false }]
        };
        return [...prev, newGroup];
      }
    });
  }, []);

  // Open a floating box (click handler)
  const handleOpenFloatingBox = useCallback((hoverData: { type: string; name: string; hoverZone?: 'name' | 'badge' }) => {
    const itemId = hoverData.name;
    const contentType = hoverData.hoverZone === 'badge' ? 'relationship' : 'detail';

    if (!dataService.itemExists(itemId)) {
      console.warn(`Item "${itemId}" not found`);
      return;
    }

    const isRelationship = contentType === 'relationship';
    const metadata = isRelationship
      ? dataService.getRelationshipBoxMetadata(itemId)
      : dataService.getFloatingBoxMetadata(itemId);

    if (!metadata) {
      console.warn(`Could not get metadata for item "${itemId}"`);
      return;
    }

    const newBox: FloatingBoxData = {
      id: `box-${Date.now()}`,
      mode: 'persistent',
      contentType,
      metadata,
      content: isRelationship
        ? <RelationshipInfoContent itemId={itemId} dataService={dataService} onNavigate={handleNavigate} />
        : <DetailContent itemId={itemId} dataService={dataService} hideHeader={true} />,
      itemId,
      isCollapsed: false
    };

    addBoxToGroup(newBox);
    setTransitoryBox(null);
    setHoveredItem(null);
  }, [dataService, addBoxToGroup, handleNavigate]);

  // Effect to highlight box when hovering item that has an open box
  useEffect(() => {
    const hoveredItemId = hoveredItem?.name ?? null;
    const hoveredItemZone = hoveredItem?.hoverZone ?? null;

    if (!hoveredItemId || !hoveredItemZone) {
      setHighlightedBoxId(null);
      return;
    }

    const contentType = hoveredItemZone === 'badge' ? 'relationship' : 'detail';
    const groupId = contentTypeToGroupId(contentType);
    const existingGroup = groups.find(g => g.id === groupId);
    const existingBox = existingGroup?.boxes.find(b =>
      b.itemId === hoveredItemId && b.contentType === contentType
    );

    if (!existingBox) {
      setHighlightedBoxId(null);
      return;
    }

    // Delay highlight to avoid flashing
    const timer = setTimeout(() => {
      setHighlightedBoxId(existingBox.id);
    }, APP_CONFIG.floats.hoverHighlightDelay);

    return () => {
      clearTimeout(timer);
      setHighlightedBoxId(null);
    };
  }, [hoveredItem, groups]);

  // Effect to detect scrolling and suppress transitory boxes during scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);
      setTransitoryBox(null);

      // Clear any existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Reset scrolling state after scroll stops (150ms debounce)
      scrollTimeoutRef.current = window.setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, true);

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Effect to create/update transitory box on hover
  useEffect(() => {
    // Don't show transitory boxes while scrolling
    if (isScrolling) return;

    const hoveredItemId = hoveredItem?.name ?? null;
    const hoveredItemDomId = hoveredItem?.id ?? null;
    const hoveredItemZone = hoveredItem?.hoverZone ?? null;

    if (hoveredItemId && hoveredItemDomId && hoveredItemZone) {
      const contentType = hoveredItemZone === 'badge' ? 'relationship' : 'detail';
      const groupId = contentTypeToGroupId(contentType);

      // Check if there's already a persistent box for this item in the appropriate group
      const existingGroup = groups.find(g => g.id === groupId);
      const existingBox = existingGroup?.boxes.find(b =>
        b.itemId === hoveredItemId && b.contentType === contentType
      );

      if (existingBox) {
        // Already have persistent box - don't show transitory
        setTransitoryBox(null);
        return;
      }

      const isRelationship = contentType === 'relationship';
      const metadata = isRelationship
        ? dataService.getRelationshipBoxMetadata(hoveredItemId)
        : dataService.getFloatingBoxMetadata(hoveredItemId);

      if (!metadata) {
        setTransitoryBox(null);
        return;
      }

      // Use Floating UI for positioning - pass the reference element ID
      setTransitoryBox({
        id: `transitory-${hoveredItemId}`,
        mode: 'transitory',
        contentType,
        metadata,
        content: isRelationship
          ? <RelationshipInfoContent itemId={hoveredItemId} dataService={dataService} onNavigate={handleNavigate} />
          : <DetailContent itemId={hoveredItemId} dataService={dataService} hideHeader={true} />,
        itemId: hoveredItemId,
        referenceElementId: hoveredItemDomId,
      });
    } else {
      setTransitoryBox(null);
    }
  }, [hoveredItem, groups, dataService, handleNavigate, isScrolling]);

  // Close transitory box
  const handleCloseTransitory = useCallback(() => {
    setTransitoryBox(null);
  }, []);

  // Close entire group
  const handleCloseGroup = useCallback((groupId: GroupId) => {
    setGroups(prev => prev.filter(g => g.id !== groupId));
  }, []);

  // Close individual box in a group
  const handleCloseBox = useCallback((groupId: GroupId, boxId: string) => {
    setGroups(prev => {
      const groupIndex = prev.findIndex(g => g.id === groupId);
      if (groupIndex === -1) return prev;

      const group = prev[groupIndex];
      const newBoxes = group.boxes.filter(b => b.id !== boxId);

      // If no boxes left, remove the group
      if (newBoxes.length === 0) {
        return prev.filter(g => g.id !== groupId);
      }

      const updatedGroups = [...prev];
      updatedGroups[groupIndex] = { ...group, boxes: newBoxes };
      return updatedGroups;
    });
  }, []);

  // Toggle box collapse state
  const handleToggleBoxCollapse = useCallback((groupId: GroupId, boxId: string) => {
    setGroups(prev => {
      const groupIndex = prev.findIndex(g => g.id === groupId);
      if (groupIndex === -1) return prev;

      const group = prev[groupIndex];
      const newBoxes = group.boxes.map(b =>
        b.id === boxId ? { ...b, isCollapsed: !b.isCollapsed } : b
      );

      const updatedGroups = [...prev];
      updatedGroups[groupIndex] = { ...group, boxes: newBoxes };
      return updatedGroups;
    });
  }, []);

  // Collapse all boxes in a group
  const handleCollapseAll = useCallback((groupId: GroupId) => {
    setGroups(prev => {
      const groupIndex = prev.findIndex(g => g.id === groupId);
      if (groupIndex === -1) return prev;

      const group = prev[groupIndex];
      const newBoxes = group.boxes.map(b => ({ ...b, isCollapsed: true }));

      const updatedGroups = [...prev];
      updatedGroups[groupIndex] = { ...group, boxes: newBoxes };
      return updatedGroups;
    });
  }, []);

  // Expand all boxes in a group
  const handleExpandAll = useCallback((groupId: GroupId) => {
    setGroups(prev => {
      const groupIndex = prev.findIndex(g => g.id === groupId);
      if (groupIndex === -1) return prev;

      const group = prev[groupIndex];
      const newBoxes = group.boxes.map(b => ({ ...b, isCollapsed: false }));

      const updatedGroups = [...prev];
      updatedGroups[groupIndex] = { ...group, boxes: newBoxes };
      return updatedGroups;
    });
  }, []);

  // Update group position/size
  const handleGroupChange = useCallback((groupId: GroupId, position: { x: number; y: number }, size: { width: number; height: number }) => {
    setGroups(prev => {
      const groupIndex = prev.findIndex(g => g.id === groupId);
      if (groupIndex === -1) return prev;

      const updatedGroups = [...prev];
      updatedGroups[groupIndex] = { ...prev[groupIndex], position, size };
      return updatedGroups;
    });
  }, []);

  // Bring group to front
  const handleBringGroupToFront = useCallback((groupId: GroupId) => {
    setGroups(prev => {
      const groupIndex = prev.findIndex(g => g.id === groupId);
      if (groupIndex === -1 || groupIndex === prev.length - 1) return prev;

      const updated = [...prev];
      const [group] = updated.splice(groupIndex, 1);
      return [...updated, group];
    });
  }, []);

  // Popout a group to a new window using React portal
  const handlePopoutGroup = useCallback((groupId: GroupId) => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return;

    // Get actual rendered size from DOM (for fitContent groups that haven't been resized)
    const groupElement = document.querySelector(`[data-group-id="${groupId}"]`);
    const renderedSize = groupElement
      ? { width: groupElement.clientWidth, height: groupElement.clientHeight }
      : group.size;
    const renderedPosition = groupElement
      ? { x: groupElement.getBoundingClientRect().left, y: groupElement.getBoundingClientRect().top }
      : group.position;

    const container = openPopout(
      groupId,
      group.title,
      renderedSize,      // Use actual rendered size
      renderedPosition,  // Use actual rendered position
      () => {
        // Called when popout window closes - discard the boxes for this group
        setPopoutContainers(prev => {
          const next = new Map(prev);
          next.delete(groupId);
          return next;
        });
        // Remove the group entirely (discard boxes)
        setGroups(prev => prev.filter(g => g.id !== groupId));
      }
    );

    if (container) {
      setPopoutContainers(prev => new Map(prev).set(groupId, container));
    }
  }, [groups]);

  // Clean up popouts when component unmounts or page unloads
  useEffect(() => {
    const handleBeforeUnload = () => {
      closeAllPopouts();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      closeAllPopouts();
    };
  }, []);

  // Handle item leave - clear hover state
  const handleItemLeave = useCallback(() => {
    setHoveredItem(null);
  }, []);

  // Panel dimensions
  const EMPTY_PANEL_WIDTH = 180;
  const MAX_PANEL_WIDTH = 450;
  const MIN_GUTTER_WIDTH = 80;  // Minimum gutter width for link visibility

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

  // Calculate minimum width based on visible panels
  const minLayoutWidth = useMemo(() => {
    const leftWidth = leftPanelEmpty ? EMPTY_PANEL_WIDTH : 300;
    const rightWidth = rightPanelEmpty ? EMPTY_PANEL_WIDTH : 300;
    if (!middlePanelEmpty) {
      // Three panels: left + gutter + middle + gutter + right
      return leftWidth + MIN_GUTTER_WIDTH + 300 + MIN_GUTTER_WIDTH + rightWidth;
    }
    // Two panels: left + gutter + right
    return leftWidth + MIN_GUTTER_WIDTH + rightWidth;
  }, [leftPanelEmpty, rightPanelEmpty, middlePanelEmpty]);

  return (
    <div className="flex-1 flex relative overflow-x-auto overflow-y-hidden">
      {/* Three-panel layout: panels are fixed/constrained, gutters flex to fill remaining space */}
      <div
        className="flex-1 flex"
        style={{ minWidth: `${minLayoutWidth}px` }}
      >
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
            onSectionsChange={() => {}}
            sectionData={leftSectionData}
            toggleButtons={[]}
            onClickItem={handleOpenFloatingBox}
            onItemHover={setHoveredItem}
            onItemLeave={handleItemLeave}
          />
        </div>

        {/* Middle section: either Slots panel with gutters, or a single gutter with toggle */}
        {!middlePanelEmpty ? (
          <>
            {/* Left-Middle gutter */}
            <div
              className="flex-1 bg-gray-100 dark:bg-slate-800"
              style={{ minWidth: `${MIN_GUTTER_WIDTH}px` }}
            />

            {/* Middle Panel - Slots */}
            <div
              className="h-full overflow-hidden border-x border-gray-200 dark:border-slate-700 flex-shrink-0 relative"
              style={{
                maxWidth: `${MAX_PANEL_WIDTH}px`,
                minWidth: '300px'
              }}
            >
              <ItemsPanel
                position="middle"
                sections={['slot']}
                onSectionsChange={() => {}}
                sectionData={middleSectionData}
                toggleButtons={[]}
                onClickItem={handleOpenFloatingBox}
                onItemHover={setHoveredItem}
                onItemLeave={handleItemLeave}
                title="Slots"
              />
              <button
                onClick={handleToggleMiddlePanel}
                className="absolute top-2 right-2 w-6 h-6 rounded bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-600 dark:text-gray-300 flex items-center justify-center text-xs transition-colors z-10"
                title="Hide Slots panel"
              >
                ✕
              </button>
            </div>

            {/* Middle-Right gutter */}
            <div
              className="flex-1 bg-gray-100 dark:bg-slate-800"
              style={{ minWidth: `${MIN_GUTTER_WIDTH}px` }}
            />
          </>
        ) : (
          /* Center gutter / toggle button (when middle panel hidden) */
          !leftPanelEmpty && !rightPanelEmpty && (
            <button
              onClick={handleToggleMiddlePanel}
              className="flex-1 bg-gray-100 dark:bg-slate-800 border-x border-gray-200 dark:border-slate-700 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center group"
              style={{ minWidth: `${MIN_GUTTER_WIDTH}px` }}
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
          )
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
          <ItemsPanel
            position="right"
            sections={rightSections}
            onSectionsChange={setRightSections}
            sectionData={rightSectionData}
            toggleButtons={rightPanelToggleButtons}
            onClickItem={handleOpenFloatingBox}
            onItemHover={setHoveredItem}
            onItemLeave={handleItemLeave}
            title="Ranges:"
          />
        </div>
      </div>

      {/* SVG Link Overlay */}
      <LinkOverlay
        leftSections={leftSections}
        rightSections={rightSections}
        dataService={dataService}
        hoveredItem={hoveredItem}
      />

      {/* Floating Box Manager - filter out popped-out groups */}
      <FloatingBoxManager
        transitoryBox={transitoryBox}
        groups={groups.filter(g => !popoutContainers.has(g.id))}
        highlightedBoxId={highlightedBoxId}
        onCloseTransitory={handleCloseTransitory}
        onCloseGroup={handleCloseGroup}
        onCloseBox={handleCloseBox}
        onToggleBoxCollapse={handleToggleBoxCollapse}
        onCollapseAll={handleCollapseAll}
        onExpandAll={handleExpandAll}
        onGroupChange={handleGroupChange}
        onBringGroupToFront={handleBringGroupToFront}
        onPopoutGroup={handlePopoutGroup}
      />

      {/* Render popped-out groups via React portals */}
      {groups.filter(g => popoutContainers.has(g.id)).map(group => {
        const container = popoutContainers.get(group.id);
        if (!container) return null;
        return createPortal(
          <PopoutContent
            key={group.id}
            group={group}
            dataService={dataService}
            onCloseBox={(boxId) => handleCloseBox(group.id, boxId)}
            onToggleBoxCollapse={(boxId) => handleToggleBoxCollapse(group.id, boxId)}
          />,
          container
        );
      })}
    </div>
  );
}
