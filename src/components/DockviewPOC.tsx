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
import { DockviewReact, PaneviewReact } from 'dockview';
import type {
  DockviewReadyEvent,
  IDockviewPanelProps,
  DockviewApi,
  DockviewTheme,
  PaneviewApi,
} from 'dockview-core';
import type { IPaneviewPanelProps, PaneviewReadyEvent } from 'dockview';
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
// Paneview Components for Detail/Relationship Stacks
// =============================================================================

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      className={`w-4 h-4 transition-transform ${expanded ? 'rotate-90' : ''}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function getHeaderColors(itemType: string): { bg: string; hoverBg: string } {
  switch (itemType) {
    case 'class':
      return { bg: 'bg-blue-600', hoverBg: 'hover:bg-blue-700' };
    case 'slot':
      return { bg: 'bg-green-600', hoverBg: 'hover:bg-green-700' };
    case 'enum':
      return { bg: 'bg-purple-600', hoverBg: 'hover:bg-purple-700' };
    case 'variable':
      return { bg: 'bg-orange-600', hoverBg: 'hover:bg-orange-700' };
    default:
      return { bg: 'bg-gray-600', hoverBg: 'hover:bg-gray-700' };
  }
}

function DetailPaneHeader({ api, title, containerApi, params }: IPaneviewPanelProps<{ itemType?: string }>) {
  const [isExpanded, setIsExpanded] = useState(api.isExpanded);
  const colors = getHeaderColors(params?.itemType || 'class');

  useEffect(() => {
    const disposable = api.onDidExpansionChange(() => {
      setIsExpanded(api.isExpanded);
    });
    return () => disposable.dispose();
  }, [api]);

  const handleClose = () => {
    const panel = containerApi.getPanel(api.id);
    if (panel) containerApi.removePanel(panel);
  };

  const handleToggle = () => {
    api.setExpanded(!api.isExpanded);
  };

  return (
    <div
      className={`flex items-center justify-between px-3 py-3 ${colors.bg} text-white cursor-pointer select-none min-h-[44px]`}
      onClick={handleToggle}
    >
      <div className="flex items-center gap-2 min-w-0">
        <ChevronIcon expanded={isExpanded} />
        <span className="font-medium text-sm truncate">{title}</span>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); handleClose(); }}
        className={`p-1 ${colors.hoverBg} rounded flex-shrink-0`}
        title="Close"
      >
        <CloseIcon />
      </button>
    </div>
  );
}

function RelationshipPaneHeader({ api, title, containerApi, params }: IPaneviewPanelProps<{ itemType?: string }>) {
  const [isExpanded, setIsExpanded] = useState(api.isExpanded);
  const colors = getHeaderColors(params?.itemType || 'class');

  useEffect(() => {
    const disposable = api.onDidExpansionChange(() => {
      setIsExpanded(api.isExpanded);
    });
    return () => disposable.dispose();
  }, [api]);

  const handleClose = () => {
    const panel = containerApi.getPanel(api.id);
    if (panel) containerApi.removePanel(panel);
  };

  const handleToggle = () => {
    api.setExpanded(!api.isExpanded);
  };

  return (
    <div
      className={`flex items-center justify-between px-3 py-3 ${colors.bg} text-white cursor-pointer select-none min-h-[44px]`}
      onClick={handleToggle}
    >
      <div className="flex items-center gap-2 min-w-0">
        <ChevronIcon expanded={isExpanded} />
        <span className="font-medium text-sm truncate">{title}</span>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); handleClose(); }}
        className={`p-1 ${colors.hoverBg} rounded flex-shrink-0`}
        title="Close"
      >
        <CloseIcon />
      </button>
    </div>
  );
}

function DetailPaneContent({ params }: IPaneviewPanelProps<{
  dataService: DataService;
  itemId: string;
}>) {
  const { dataService, itemId } = params;

  return (
    <div className="h-full overflow-auto bg-white">
      <DetailContent
        itemId={itemId}
        dataService={dataService}
        hideHeader={true}
      />
    </div>
  );
}

function RelationshipPaneContent({ params }: IPaneviewPanelProps<{
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

// Paneview component registries
const detailPaneComponents = {
  detailPane: DetailPaneContent,
};

const detailPaneHeaderComponents = {
  detailHeader: DetailPaneHeader,
};

const relationshipPaneComponents = {
  relationshipPane: RelationshipPaneContent,
};

const relationshipPaneHeaderComponents = {
  relationshipHeader: RelationshipPaneHeader,
};

// =============================================================================
// Dockview Stack Panels (contain Paneviews)
// =============================================================================

function DetailStackPanel({ params }: IDockviewPanelProps<{
  onPaneviewReady: (api: PaneviewApi) => void;
}>) {
  const { onPaneviewReady } = params;

  const handleReady = useCallback((event: PaneviewReadyEvent) => {
    onPaneviewReady(event.api);
  }, [onPaneviewReady]);

  return (
    <div className="h-full">
      <PaneviewReact
        className="dockview-theme-light"
        onReady={handleReady}
        components={detailPaneComponents}
        headerComponents={detailPaneHeaderComponents}
      />
    </div>
  );
}

function RelationshipStackPanel({ params }: IDockviewPanelProps<{
  onPaneviewReady: (api: PaneviewApi) => void;
}>) {
  const { onPaneviewReady } = params;

  const handleReady = useCallback((event: PaneviewReadyEvent) => {
    onPaneviewReady(event.api);
  }, [onPaneviewReady]);

  return (
    <div className="h-full">
      <PaneviewReact
        className="dockview-theme-light"
        onReady={handleReady}
        components={relationshipPaneComponents}
        headerComponents={relationshipPaneHeaderComponents}
      />
    </div>
  );
}

// Component registry for Dockview
const components = {
  mainContent: MainContentPanel,
  detailStack: DetailStackPanel,
  relationshipStack: RelationshipStackPanel,
};

// =============================================================================
// Main Component
// =============================================================================

export default function DockviewPOC({
  dataService,
  leftSections: initialLeftSections,
  middleSections: initialMiddleSections,
  rightSections: initialRightSections,
}: DockviewPOCProps) {
  const apiRef = useRef<DockviewApi | null>(null);
  const detailPaneApiRef = useRef<PaneviewApi | null>(null);
  const relationshipPaneApiRef = useRef<PaneviewApi | null>(null);

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

  // Callbacks for Paneview initialization
  const handleDetailPaneReady = useCallback((api: PaneviewApi) => {
    detailPaneApiRef.current = api;
  }, []);

  const handleRelationshipPaneReady = useCallback((api: PaneviewApi) => {
    relationshipPaneApiRef.current = api;
  }, []);

  // Navigation handler for relationship links
  const handleNavigate = useCallback((itemName: string, itemSection: string) => {
    const paneApi = detailPaneApiRef.current;
    if (!paneApi) return;

    const paneId = `detail-${itemName}`;
    const existingPane = paneApi.getPanel(paneId);
    if (existingPane) {
      existingPane.api.setExpanded(true);
      return;
    }

    const itemType = itemSection === 'slot' ? 'slot' : itemSection === 'enum' ? 'enum' : 'class';

    paneApi.addPanel({
      id: paneId,
      component: 'detailPane',
      headerComponent: 'detailHeader',
      title: itemName,
      headerSize: 44,
      params: {
        dataService,
        itemId: itemName,
        itemType,
      },
      isExpanded: true,
      index: 0,
    });
  }, [dataService]);

  // Click handler - adds to appropriate Paneview stack
  const handleClickItem = useCallback((hoverData: ItemHoverData) => {
    const isRelationship = hoverData.hoverZone === 'badge';
    const itemType = hoverData.type;

    if (isRelationship) {
      const paneApi = relationshipPaneApiRef.current;
      if (!paneApi) return;

      const paneId = `rel-${hoverData.name}`;
      const existingPane = paneApi.getPanel(paneId);
      if (existingPane) {
        existingPane.api.setExpanded(true);
        return;
      }

      paneApi.addPanel({
        id: paneId,
        component: 'relationshipPane',
        headerComponent: 'relationshipHeader',
        title: `${hoverData.name} Rels`,
        headerSize: 44,
        params: {
          dataService,
          itemId: hoverData.name,
          onNavigate: handleNavigate,
          itemType,
        },
        isExpanded: true,
        index: 0,
      });
    } else {
      const paneApi = detailPaneApiRef.current;
      if (!paneApi) return;

      const paneId = `detail-${hoverData.name}`;
      const existingPane = paneApi.getPanel(paneId);
      if (existingPane) {
        existingPane.api.setExpanded(true);
        return;
      }

      paneApi.addPanel({
        id: paneId,
        component: 'detailPane',
        headerComponent: 'detailHeader',
        title: hoverData.name,
        headerSize: 44,
        params: {
          dataService,
          itemId: hoverData.name,
          itemType,
        },
        isExpanded: true,
        index: 0,
      });
    }
  }, [dataService, handleNavigate]);

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

    // Add detail stack panel
    event.api.addPanel({
      id: 'detail-stack',
      component: 'detailStack',
      title: 'Details',
      initialWidth: 350,
      minimumWidth: 250,
      maximumWidth: 500,
      params: {
        onPaneviewReady: handleDetailPaneReady,
      },
      position: { referencePanel: 'main-content', direction: 'right' },
    });

    // Add relationship stack panel below details
    event.api.addPanel({
      id: 'relationship-stack',
      component: 'relationshipStack',
      title: 'Relationships',
      params: {
        onPaneviewReady: handleRelationshipPaneReady,
      },
      position: { referencePanel: 'detail-stack', direction: 'below' },
    });

    // Listen for layout changes
    event.api.onDidLayoutChange(() => {
      setTimeout(() => setLayoutVersion(v => v + 1), 50);
      setTimeout(() => setLayoutVersion(v => v + 1), 150);
    });

  }, [dataService, initialLeftSections, initialMiddleSections, initialRightSections, leftSectionData, middleSectionData, rightSectionData, rightPanelToggleButtons, handleClickItem, handleItemHover, handleItemLeave, handleMiddleSectionsChange, handleRightSectionsChange, handleDetailPaneReady, handleRelationshipPaneReady]);

  return (
    <div className="flex-1 relative">
      {/* Custom styles */}
      <style>{`
        .dockview-theme-light-spaced {
          --dv-background-color: #f3f4f6;
          --dv-tabs-and-actions-container-height: 0px;
        }
        /* Hide tab bar for all panels */
        .dockview-theme-light-spaced .dv-tabs-and-actions-container {
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
