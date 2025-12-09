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

import { useCallback, useRef, useState, useEffect } from 'react';
import { DockviewReact } from 'dockview';
import type {
  DockviewReadyEvent,
  IDockviewPanelProps,
  DockviewApi,
  DockviewTheme,
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
// Floating Panel Components (for detail and relationship info)
// =============================================================================

function FloatingDetailPanel({ params }: IDockviewPanelProps<{
  dataService: DataService;
  itemId: string;
}>) {
  const { dataService, itemId } = params;

  return (
    <div className="h-full overflow-auto bg-white">
      <DetailContent
        itemId={itemId}
        dataService={dataService}
        hideHeader={false}
      />
    </div>
  );
}

function FloatingRelationshipPanel({ params }: IDockviewPanelProps<{
  dataService: DataService;
  itemId: string;
  onNavigate: (itemName: string, itemSection: string) => void;
}>) {
  const { dataService, itemId, onNavigate } = params;

  return (
    <div className="h-full overflow-auto bg-white">
      <RelationshipInfoContent
        itemId={itemId}
        dataService={dataService}
        onNavigate={onNavigate}
      />
    </div>
  );
}

// Component registry for Dockview
const components = {
  mainContent: MainContentPanel,
  floatingDetail: FloatingDetailPanel,
  floatingRelationship: FloatingRelationshipPanel,
};

// =============================================================================
// Main Component
// =============================================================================

// Floating group dimensions and positions
const FLOATING_WIDTH = 400;
const RELATIONSHIP_HEIGHT = 300;
const DETAIL_HEIGHT = 400;

// Track floating groups by finding first panel of each type
type FloatingGroupType = 'detail' | 'relationship';

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

  // Find existing floating group by looking for panels with matching prefix
  const findFloatingGroup = useCallback((groupType: FloatingGroupType) => {
    const api = apiRef.current;
    if (!api) return null;

    const prefix = groupType === 'detail' ? 'detail-' : 'rel-';

    // Look through all panels to find one matching our type
    for (const panel of api.panels) {
      if (panel.id.startsWith(prefix)) {
        // Check if this panel's group is floating
        if (panel.group?.api.location.type === 'floating') {
          return panel.group;
        }
      }
    }
    return null;
  }, []);

  // Helper to add panel to floating group (creates group if needed)
  const addToFloatingGroup = useCallback((
    groupType: FloatingGroupType,
    panelId: string,
    component: string,
    title: string,
    params: Record<string, unknown>,
    groupOptions: { x: number; y: number; width: number; height: number }
  ) => {
    const api = apiRef.current;
    if (!api) return;

    // Check if panel already exists
    const existingPanel = api.getPanel(panelId);
    if (existingPanel) {
      existingPanel.api.setActive();
      return;
    }

    // Check if a floating group for this type already exists
    const existingGroup = findFloatingGroup(groupType);

    if (existingGroup) {
      // Add panel to existing floating group
      api.addPanel({
        id: panelId,
        component,
        title,
        params,
        position: { referenceGroup: existingGroup },
      });
    } else {
      // Create first panel, then convert to floating group
      const panel = api.addPanel({
        id: panelId,
        component,
        title,
        params,
      });

      // Now make it a floating group
      api.addFloatingGroup(panel, groupOptions);
    }
  }, [findFloatingGroup]);

  // Navigation handler for relationship links - opens a floating detail panel
  const handleNavigate = useCallback((itemName: string, _itemSection: string) => {
    const viewportWidth = window.innerWidth;
    const x = viewportWidth - FLOATING_WIDTH - 20;
    const y = RELATIONSHIP_HEIGHT + 100; // Below relationship group

    addToFloatingGroup(
      'detail',
      `detail-${itemName}`,
      'floatingDetail',
      itemName,
      { dataService, itemId: itemName },
      { x, y, width: FLOATING_WIDTH, height: DETAIL_HEIGHT }
    );
  }, [dataService, addToFloatingGroup]);

  // Click handler - adds to appropriate floating group
  const handleClickItem = useCallback((hoverData: ItemHoverData) => {
    const viewportWidth = window.innerWidth;
    const isRelationship = hoverData.hoverZone === 'badge';

    if (isRelationship) {
      // Relationship panels go to top-right
      const x = viewportWidth - FLOATING_WIDTH - 20;
      const y = 80;

      addToFloatingGroup(
        'relationship',
        `rel-${hoverData.name}`,
        'floatingRelationship',
        `${hoverData.name} Rels`,
        { dataService, itemId: hoverData.name, onNavigate: handleNavigate },
        { x, y, width: FLOATING_WIDTH, height: RELATIONSHIP_HEIGHT }
      );
    } else {
      // Detail panels go below relationships
      const x = viewportWidth - FLOATING_WIDTH - 20;
      const y = RELATIONSHIP_HEIGHT + 100;

      addToFloatingGroup(
        'detail',
        `detail-${hoverData.name}`,
        'floatingDetail',
        hoverData.name,
        { dataService, itemId: hoverData.name },
        { x, y, width: FLOATING_WIDTH, height: DETAIL_HEIGHT }
      );
    }
  }, [dataService, handleNavigate, addToFloatingGroup]);

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
