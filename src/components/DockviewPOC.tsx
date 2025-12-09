/**
 * DockviewPOC - Proof of concept for Dockview integration
 *
 * Architecture:
 * - Single Dockview panel for main content (Classes | Slots | Ranges with gutters)
 * - Paneview stacks for collapsible detail/relationship boxes on right
 * - LinkOverlay renders over everything
 *
 * The main content uses the original 3-panel flex layout from LayoutManager.
 * Dockview's value here is for the detail/relationship panes, not the main panels.
 */

import { useCallback, useRef, useState, useEffect, useMemo } from 'react';
import { DockviewReact, PaneviewReact, type IPaneviewPanelProps } from 'dockview';
import type {
  DockviewReadyEvent,
  IDockviewPanelProps,
  DockviewApi,
  DockviewTheme,
  PaneviewApi,
} from 'dockview-core';
import 'dockview/dist/styles/dockview.css';

import ItemsPanel from './ItemsPanel';
import LinkOverlay from './LinkOverlay';
import DetailContent from './DetailContent';
import { RelationshipInfoContent } from './RelationshipInfoBox';
import type { SectionData, ItemHoverData, ToggleButtonData } from '../contracts/ComponentData';
import type { DataService } from '../services/DataService';

// Custom theme - minimal gap since main content is in single panel
const customTheme: DockviewTheme = {
  name: 'lightSpacedWide',
  className: 'dockview-theme-light-spaced',
  gap: 8,
  dndOverlayMounting: 'absolute',
  dndPanelOverlay: 'group',
};

interface DockviewPOCProps {
  dataService: DataService;
  leftSections: string[];
  middleSections: string[];
  rightSections: string[];
}

// Panel dimensions (matching LayoutManager)
const EMPTY_PANEL_WIDTH = 180;
const MAX_PANEL_WIDTH = 450;
const GUTTER_WIDTH = 160; // Width for link gutters between panels

// =============================================================================
// Main Content Panel - Contains the original 3-panel layout
// =============================================================================

interface MainContentParams {
  dataService: DataService;
  leftSections: string[];
  middleSections: string[];
  rightSections: string[];
  leftSectionData: Map<string, SectionData>;
  middleSectionData: Map<string, SectionData>;
  rightSectionData: Map<string, SectionData>;
  rightPanelToggleButtons: ToggleButtonData[];
  onClickItem: (hoverData: ItemHoverData) => void;
  onItemHover: (hoverData: ItemHoverData) => void;
  onItemLeave: () => void;
  onMiddleSectionsChange: (sections: string[]) => void;
  onRightSectionsChange: (sections: string[]) => void;
}

function MainContentPanel({ params }: IDockviewPanelProps<MainContentParams>) {
  const {
    leftSections,
    middleSections,
    rightSections,
    leftSectionData,
    middleSectionData,
    rightSectionData,
    rightPanelToggleButtons,
    onClickItem,
    onItemHover,
    onItemLeave,
    onMiddleSectionsChange,
    onRightSectionsChange,
  } = params;

  const leftPanelEmpty = leftSections.length === 0;
  const middlePanelEmpty = middleSections.length === 0;
  const rightPanelEmpty = rightSections.length === 0;

  // Toggle middle panel (show/hide slots)
  const handleToggleMiddlePanel = useCallback(() => {
    if (middlePanelEmpty) {
      onMiddleSectionsChange(['slot']);
    } else {
      onMiddleSectionsChange([]);
    }
  }, [middlePanelEmpty, onMiddleSectionsChange]);

  return (
    <div className="flex-1 flex h-full overflow-hidden">
      {/* Left Panel - Classes */}
      <div
        className="h-full overflow-hidden border-r border-gray-200 flex-shrink-0"
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
          onClickItem={onClickItem}
          onItemHover={onItemHover}
          onItemLeave={onItemLeave}
        />
      </div>

      {/* Left-Middle gutter */}
      {!middlePanelEmpty && (
        <div className="bg-gray-100 flex-shrink-0" style={{ width: `${GUTTER_WIDTH}px` }} />
      )}

      {/* Middle Panel - Slots (toggleable) */}
      {!middlePanelEmpty && (
        <div
          className="h-full overflow-hidden border-x border-gray-200 flex-shrink-0 relative"
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
            onClickItem={onClickItem}
            onItemHover={onItemHover}
            onItemLeave={onItemLeave}
            title="Slots"
          />
          {/* Hide button */}
          <button
            onClick={handleToggleMiddlePanel}
            className="absolute top-2 right-2 w-6 h-6 rounded bg-gray-200 hover:bg-gray-300 text-gray-600 flex items-center justify-center text-xs transition-colors z-10"
            title="Hide Slots panel"
          >
            ✕
          </button>
        </div>
      )}

      {/* Middle-Right gutter */}
      {!middlePanelEmpty && (
        <div className="bg-gray-100 flex-shrink-0" style={{ width: `${GUTTER_WIDTH}px` }} />
      )}

      {/* Center gutter / toggle button - show when middle panel hidden */}
      {!leftPanelEmpty && !rightPanelEmpty && middlePanelEmpty && (
        <button
          onClick={handleToggleMiddlePanel}
          className="bg-gray-100 border-x border-gray-200 flex-shrink-0 hover:bg-gray-200 transition-colors flex items-center justify-center group"
          style={{ width: `${GUTTER_WIDTH}px` }}
          title="Click to show Slots panel"
        >
          <div className="text-center">
            <div className="text-gray-500 group-hover:text-gray-700 text-sm font-medium">
              Show Slots
            </div>
            <div className="text-gray-400 text-xs mt-1">
              ▶
            </div>
          </div>
        </button>
      )}

      {/* Right Panel - Ranges */}
      <div
        className="h-full overflow-hidden border-l border-gray-200 flex-shrink-0"
        style={{
          width: rightPanelEmpty ? `${EMPTY_PANEL_WIDTH}px` : undefined,
          maxWidth: rightPanelEmpty ? undefined : `${MAX_PANEL_WIDTH}px`,
          minWidth: rightPanelEmpty ? undefined : '300px'
        }}
      >
        <ItemsPanel
          position="right"
          sections={rightSections}
          onSectionsChange={onRightSectionsChange}
          sectionData={rightSectionData}
          toggleButtons={rightPanelToggleButtons}
          onClickItem={onClickItem}
          onItemHover={onItemHover}
          onItemLeave={onItemLeave}
          title="Ranges:"
        />
      </div>
    </div>
  );
}


// =============================================================================
// Paneview Panel Components (for detail and relationship panes)
// =============================================================================

// Detail pane content for Paneview
function DetailPaneContent({ params }: IPaneviewPanelProps<{
  dataService: DataService;
  itemId: string;
}>) {
  const { dataService, itemId } = params;

  return (
    <div className="h-full overflow-auto bg-white p-2">
      <DetailContent
        itemId={itemId}
        dataService={dataService}
        hideHeader={true}
      />
    </div>
  );
}

// Relationship pane content for Paneview
function RelationshipPaneContent({ params }: IPaneviewPanelProps<{
  dataService: DataService;
  itemId: string;
  onNavigate: (itemName: string, itemSection: string) => void;
}>) {
  const { dataService, itemId, onNavigate } = params;

  return (
    <div className="h-full overflow-auto bg-white p-2">
      <RelationshipInfoContent
        itemId={itemId}
        dataService={dataService}
        onNavigate={onNavigate}
      />
    </div>
  );
}

// Paneview component registry
const paneviewComponents = {
  detailPane: DetailPaneContent,
  relationshipPane: RelationshipPaneContent,
};

// =============================================================================
// Paneview Container - Hosts a PaneviewReact inside a Dockview floating panel
// =============================================================================

interface PaneItem {
  id: string;
  title: string;
  component: 'detailPane' | 'relationshipPane';
  params: Record<string, unknown>;
}

interface PaneviewContainerProps {
  items: PaneItem[];
  onRemoveItem: (id: string) => void;
}

function PaneviewContainer({ items, onRemoveItem: _onRemoveItem }: PaneviewContainerProps) {
  const paneviewApiRef = useRef<PaneviewApi | null>(null);
  // Keep a ref to track items that were available when onReady is called
  const itemsRef = useRef(items);
  itemsRef.current = items;

  // Handle Paneview ready - add all initial items
  const onPaneviewReady = useCallback((event: { api: PaneviewApi }) => {
    paneviewApiRef.current = event.api;
    // Add all current items when ready
    for (const item of itemsRef.current) {
      event.api.addPanel({
        id: item.id,
        component: item.component,
        title: item.title,
        params: item.params,
        isExpanded: true,
      });
    }
  }, []);

  // Add/remove panes when items change (after initial setup)
  useEffect(() => {
    const api = paneviewApiRef.current;
    if (!api) return;

    // Get current panel IDs
    const currentPanelIds = new Set(api.panels.map(p => p.id));
    const newItemIds = new Set(items.map(item => item.id));

    // Remove panels that are no longer in items
    for (const panel of api.panels) {
      if (!newItemIds.has(panel.id)) {
        api.removePanel(panel);
      }
    }

    // Add new panels
    for (const item of items) {
      if (!currentPanelIds.has(item.id)) {
        api.addPanel({
          id: item.id,
          component: item.component,
          title: item.title,
          params: item.params,
          isExpanded: true,
        });
      }
    }
  }, [items]);

  // Memoize components to avoid re-renders
  const components = useMemo(() => paneviewComponents, []);

  return (
    <div className="h-full w-full">
      <PaneviewReact
        className="dockview-theme-light"
        onReady={onPaneviewReady}
        components={components}
      />
    </div>
  );
}

// =============================================================================
// Floating Panel that wraps PaneviewContainer
// =============================================================================

interface FloatingPaneviewPanelParams {
  items: PaneItem[];
  onRemoveItem: (id: string) => void;
}

function FloatingPaneviewPanel({ params }: IDockviewPanelProps<FloatingPaneviewPanelParams>) {
  const { items, onRemoveItem } = params;

  return (
    <div className="h-full w-full bg-gray-50">
      <PaneviewContainer items={items} onRemoveItem={onRemoveItem} />
    </div>
  );
}

// Component registry for Dockview
const components = {
  mainContent: MainContentPanel,
  floatingPaneview: FloatingPaneviewPanel,
};

// =============================================================================
// Main Component
// =============================================================================

// Floating group dimensions and positions (in pixels for now, TODO: viewport percentages)
const FLOATING_WIDTH = 400;
const FLOATING_HEIGHT = 500; // Height for the paneview container

export default function DockviewPOC({
  dataService,
  leftSections: initialLeftSections,
  middleSections: initialMiddleSections,
  rightSections: initialRightSections,
}: DockviewPOCProps) {
  const apiRef = useRef<DockviewApi | null>(null);

  // Section state
  const [currentLeftSections] = useState(initialLeftSections);
  const [currentMiddleSections, setCurrentMiddleSections] = useState(initialMiddleSections);
  const [currentRightSections, setCurrentRightSections] = useState(initialRightSections);

  // Pane items state - these are displayed in PaneviewReact containers
  const [detailPanes, setDetailPanes] = useState<PaneItem[]>([]);
  const [relationshipPanes, setRelationshipPanes] = useState<PaneItem[]>([]);

  // Build section data
  const leftSectionData = dataService.getAllSectionsData('left');
  const middleSectionData = dataService.getAllSectionsData('middle');
  const rightSectionData = dataService.getAllSectionsData('right');

  // Get toggle button data
  const allToggleButtons = dataService.getToggleButtonsData();
  const rightPanelToggleButtons = allToggleButtons.filter(btn =>
    btn.id === 'class' || btn.id === 'enum' || btn.id === 'type'
  );

  // Hover state for LinkOverlay
  const [hoveredItem, setHoveredItem] = useState<ItemHoverData | null>(null);

  // Layout version for LinkOverlay redraw
  const [layoutVersion, setLayoutVersion] = useState(0);

  const handleItemHover = useCallback((hoverData: ItemHoverData) => {
    setHoveredItem(hoverData);
  }, []);

  const handleItemLeave = useCallback(() => {
    setHoveredItem(null);
  }, []);

  // Remove handlers for panes
  const handleRemoveDetailPane = useCallback((id: string) => {
    setDetailPanes(prev => prev.filter(p => p.id !== id));
  }, []);

  const handleRemoveRelationshipPane = useCallback((id: string) => {
    setRelationshipPanes(prev => prev.filter(p => p.id !== id));
  }, []);

  // Navigation handler for relationship links - opens a detail pane
  const handleNavigate = useCallback((itemName: string, _itemSection: string) => {
    setDetailPanes(prev => {
      // Check if already exists
      if (prev.some(p => p.id === `detail-${itemName}`)) {
        return prev;
      }
      return [...prev, {
        id: `detail-${itemName}`,
        title: itemName,
        component: 'detailPane' as const,
        params: { dataService, itemId: itemName },
      }];
    });
  }, [dataService]);

  // Click handler - adds pane to appropriate list
  const handleClickItem = useCallback((hoverData: ItemHoverData) => {
    const isRelationship = hoverData.hoverZone === 'badge';

    if (isRelationship) {
      setRelationshipPanes(prev => {
        // Check if already exists
        if (prev.some(p => p.id === `rel-${hoverData.name}`)) {
          return prev;
        }
        return [...prev, {
          id: `rel-${hoverData.name}`,
          title: `${hoverData.name} Relationships`,
          component: 'relationshipPane' as const,
          params: { dataService, itemId: hoverData.name, onNavigate: handleNavigate },
        }];
      });
    } else {
      setDetailPanes(prev => {
        // Check if already exists
        if (prev.some(p => p.id === `detail-${hoverData.name}`)) {
          return prev;
        }
        return [...prev, {
          id: `detail-${hoverData.name}`,
          title: hoverData.name,
          component: 'detailPane' as const,
          params: { dataService, itemId: hoverData.name },
        }];
      });
    }
  }, [dataService, handleNavigate]);

  // Manage floating groups for paneview containers
  const floatingGroupsCreatedRef = useRef({ detail: false, relationship: false });

  // Create or update floating groups when panes change
  useEffect(() => {
    const api = apiRef.current;
    if (!api) return;

    const viewportWidth = window.innerWidth;
    const x = viewportWidth - FLOATING_WIDTH - 20;

    // Handle detail panes floating group
    if (detailPanes.length > 0 && !floatingGroupsCreatedRef.current.detail) {
      // Create floating group with paneview
      const panel = api.addPanel({
        id: 'detail-paneview-container',
        component: 'floatingPaneview',
        title: 'Details',
        params: { items: detailPanes, onRemoveItem: handleRemoveDetailPane },
      });
      api.addFloatingGroup(panel, {
        x,
        y: Math.round(window.innerHeight * 0.1), // 10% from top
        width: FLOATING_WIDTH,
        height: FLOATING_HEIGHT,
      });
      floatingGroupsCreatedRef.current.detail = true;
    } else if (detailPanes.length > 0) {
      // Update existing panel params
      const panel = api.getPanel('detail-paneview-container');
      if (panel) {
        panel.api.updateParameters({ items: detailPanes });
      }
    } else if (detailPanes.length === 0 && floatingGroupsCreatedRef.current.detail) {
      // Remove floating group when no panes
      const panel = api.getPanel('detail-paneview-container');
      if (panel) {
        api.removePanel(panel);
      }
      floatingGroupsCreatedRef.current.detail = false;
    }

    // Handle relationship panes floating group
    if (relationshipPanes.length > 0 && !floatingGroupsCreatedRef.current.relationship) {
      // Create floating group with paneview
      const panel = api.addPanel({
        id: 'relationship-paneview-container',
        component: 'floatingPaneview',
        title: 'Relationships',
        params: { items: relationshipPanes, onRemoveItem: handleRemoveRelationshipPane },
      });
      api.addFloatingGroup(panel, {
        x,
        y: Math.round(window.innerHeight * 0.55), // 55% from top (below details)
        width: FLOATING_WIDTH,
        height: FLOATING_HEIGHT,
      });
      floatingGroupsCreatedRef.current.relationship = true;
    } else if (relationshipPanes.length > 0) {
      // Update existing panel params
      const panel = api.getPanel('relationship-paneview-container');
      if (panel) {
        panel.api.updateParameters({ items: relationshipPanes });
      }
    } else if (relationshipPanes.length === 0 && floatingGroupsCreatedRef.current.relationship) {
      // Remove floating group when no panes
      const panel = api.getPanel('relationship-paneview-container');
      if (panel) {
        api.removePanel(panel);
      }
      floatingGroupsCreatedRef.current.relationship = false;
    }
  }, [detailPanes, relationshipPanes, handleRemoveDetailPane, handleRemoveRelationshipPane]);

  // Update main content panel when sections change
  const updateMainContentParams = useCallback(() => {
    const panel = apiRef.current?.getPanel('main-content');
    if (panel) {
      panel.api.updateParameters({
        middleSections: currentMiddleSections,
        rightSections: currentRightSections,
      });
    }
  }, [currentMiddleSections, currentRightSections]);

  useEffect(() => {
    updateMainContentParams();
  }, [updateMainContentParams]);

  // Section change handlers
  const handleMiddleSectionsChange = useCallback((sections: string[]) => {
    setCurrentMiddleSections(sections);
  }, []);

  const handleRightSectionsChange = useCallback((sections: string[]) => {
    setCurrentRightSections(sections);
  }, []);

  // Setup panels when Dockview is ready
  const onReady = useCallback((event: DockviewReadyEvent) => {
    apiRef.current = event.api;

    // Add main content panel (contains the 3-panel layout)
    // This is the only docked panel - detail/relationship panels open as floating
    event.api.addPanel({
      id: 'main-content',
      component: 'mainContent',
      title: 'Main',
      params: {
        dataService,
        leftSections: initialLeftSections,
        middleSections: initialMiddleSections,
        rightSections: initialRightSections,
        leftSectionData,
        middleSectionData,
        rightSectionData,
        rightPanelToggleButtons,
        onClickItem: handleClickItem,
        onItemHover: handleItemHover,
        onItemLeave: handleItemLeave,
        onMiddleSectionsChange: handleMiddleSectionsChange,
        onRightSectionsChange: handleRightSectionsChange,
      },
    });

    // Listen for layout changes
    event.api.onDidLayoutChange(() => {
      setTimeout(() => setLayoutVersion(v => v + 1), 50);
      setTimeout(() => setLayoutVersion(v => v + 1), 150);
    });

  }, [dataService, initialLeftSections, initialMiddleSections, initialRightSections, leftSectionData, middleSectionData, rightSectionData, rightPanelToggleButtons, handleClickItem, handleItemHover, handleItemLeave, handleMiddleSectionsChange, handleRightSectionsChange]);

  return (
    <div className="flex-1 relative">
      {/* Custom styles */}
      <style>{`
        .dockview-theme-light-spaced {
          --dv-background-color: #f3f4f6;
        }
        /* Hide tab bar only for the main docked panel, not for floating panels */
        .dockview-theme-light-spaced > .dv-dockview > .dv-gridview-container > .dv-branch-node > .dv-groupview > .dv-tabs-and-actions-container {
          display: none;
        }
      `}</style>

      {/* Dockview container */}
      <DockviewReact
        theme={customTheme}
        onReady={onReady}
        components={components}
        disableDnd={true}
      />

      {/* LinkOverlay */}
      <LinkOverlay
        leftSections={currentLeftSections}
        rightSections={currentRightSections}
        dataService={dataService}
        hoveredItem={hoveredItem}
        layoutVersion={layoutVersion}
      />
    </div>
  );
}
