/**
 * DockviewPOC - Proof of concept for Dockview integration
 *
 * Goals:
 * 1. Test basic DockviewReact setup with our existing components
 * 2. Verify LinkOverlay can render over Dockview panels
 * 3. Test Paneview for collapsible detail/relationship stacks
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

// Custom theme with wider gaps between panels
// TODO: Move gap value to appConfig
const customTheme: DockviewTheme = {
  name: 'lightSpacedWide',
  className: 'dockview-theme-light-spaced',
  gap: 75,
  dndOverlayMounting: 'absolute',
  dndPanelOverlay: 'group',
};

import ItemsPanel from './ItemsPanel';
import LinkOverlay from './LinkOverlay';
import DetailContent from './DetailContent';
import { RelationshipInfoContent } from './RelationshipInfoBox';
import type { SectionData, ItemHoverData, ToggleButtonData } from '../contracts/ComponentData';
import type { DataService } from '../services/DataService';

interface DockviewPOCProps {
  dataService: DataService;
  leftSections: string[];
  middleSections: string[];
  rightSections: string[];
}

// Panel component for the main sections (Classes, Slots, Ranges)
function MainPanelContent({ params }: IDockviewPanelProps<{
  dataService: DataService;
  sections: string[];
  position: 'left' | 'middle' | 'right';
  sectionData: Map<string, SectionData>;
  onClickItem: (hoverData: ItemHoverData) => void;
  onItemHover: (hoverData: ItemHoverData) => void;
  onItemLeave: () => void;
  onSectionsChange: (sections: string[]) => void;
  toggleButtons: ToggleButtonData[];
  title?: string;
}>) {
  const { sections, position, sectionData, onClickItem, onItemHover, onItemLeave, onSectionsChange, toggleButtons, title } = params;

  return (
    <div className="h-full overflow-auto">
      <ItemsPanel
        position={position}
        sections={sections}
        onSectionsChange={onSectionsChange}
        sectionData={sectionData}
        toggleButtons={toggleButtons}
        onClickItem={onClickItem}
        onItemHover={onItemHover}
        onItemLeave={onItemLeave}
        title={title}
      />
    </div>
  );
}

// Chevron icon for expand/collapse
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

// Close icon
function CloseIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

// Get header color based on item type
// TODO: Move to appConfig
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

// Custom header component for detail panes - color based on item type
function DetailPaneHeader({ api, title, containerApi, params }: IPaneviewPanelProps<{ itemType?: string }>) {
  const [isExpanded, setIsExpanded] = useState(api.isExpanded);
  const colors = getHeaderColors(params?.itemType || 'class');

  // Sync state with API
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
      className={`flex items-center justify-between px-3 py-2 ${colors.bg} text-white cursor-pointer select-none min-h-[36px]`}
      onClick={handleToggle}
    >
      <div className="flex items-center gap-2 min-w-0">
        <ChevronIcon expanded={isExpanded} />
        <span className="font-medium text-sm truncate">{title}</span>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={(e) => { e.stopPropagation(); handleClose(); }}
          className={`p-1 ${colors.hoverBg} rounded`}
          title="Close"
        >
          <CloseIcon />
        </button>
      </div>
    </div>
  );
}

// Custom header component for relationship panes - color based on item type
function RelationshipPaneHeader({ api, title, containerApi, params }: IPaneviewPanelProps<{ itemType?: string }>) {
  const [isExpanded, setIsExpanded] = useState(api.isExpanded);
  const colors = getHeaderColors(params?.itemType || 'class');

  // Sync state with API
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
      className={`flex items-center justify-between px-3 py-2 ${colors.bg} text-white cursor-pointer select-none min-h-[36px]`}
      onClick={handleToggle}
    >
      <div className="flex items-center gap-2 min-w-0">
        <ChevronIcon expanded={isExpanded} />
        <span className="font-medium text-sm truncate">{title}</span>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={(e) => { e.stopPropagation(); handleClose(); }}
          className={`p-1 ${colors.hoverBg} rounded`}
          title="Close"
        >
          <CloseIcon />
        </button>
      </div>
    </div>
  );
}

// Paneview panel component for detail boxes (collapsible)
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

// Paneview panel component for relationship info boxes (collapsible)
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

// Dockview panel that contains a Paneview for details
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

// Dockview panel that contains a Paneview for relationships
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
  mainPanel: MainPanelContent,
  detailStack: DetailStackPanel,
  relationshipStack: RelationshipStackPanel,
};

export default function DockviewPOC({
  dataService,
  leftSections: initialLeftSections,
  middleSections: initialMiddleSections,
  rightSections: initialRightSections,
}: DockviewPOCProps) {
  const apiRef = useRef<DockviewApi | null>(null);
  const detailPaneApiRef = useRef<PaneviewApi | null>(null);
  const relationshipPaneApiRef = useRef<PaneviewApi | null>(null);

  // Section state - can change when toggles are clicked
  const [currentLeftSections, setCurrentLeftSections] = useState(initialLeftSections);
  // currentMiddleSections used for future LinkOverlay middle panel support
  const [currentMiddleSections, setCurrentMiddleSections] = useState(initialMiddleSections);
  void currentMiddleSections; // Suppress unused warning - will be used when LinkOverlay supports middle panel
  const [currentRightSections, setCurrentRightSections] = useState(initialRightSections);

  // Track if middle panel (Slots) is visible
  const [middlePanelVisible, setMiddlePanelVisible] = useState(initialMiddleSections.length > 0);

  // Build section data
  const leftSectionData = dataService.getAllSectionsData('left');
  const middleSectionData = dataService.getAllSectionsData('middle');
  const rightSectionData = dataService.getAllSectionsData('right');

  // Get toggle button data
  const allToggleButtons = dataService.getToggleButtonsData();
  const rightPanelToggleButtons = allToggleButtons.filter(btn =>
    btn.id === 'class' || btn.id === 'enum' || btn.id === 'type'
  );

  // Hover state for LinkOverlay (must be state to trigger re-renders)
  const [hoveredItem, setHoveredItem] = useState<ItemHoverData | null>(null);

  const handleItemHover = useCallback((hoverData: ItemHoverData) => {
    setHoveredItem(hoverData);
  }, []);

  const handleItemLeave = useCallback(() => {
    setHoveredItem(null);
  }, []);

  // Section change handlers - update state AND Dockview panel params
  const handleLeftSectionsChange = useCallback((sections: string[]) => {
    setCurrentLeftSections(sections);
    const panel = apiRef.current?.getPanel('left-panel');
    if (panel) {
      panel.api.updateParameters({ sections });
    }
  }, []);

  const handleMiddleSectionsChange = useCallback((sections: string[]) => {
    setCurrentMiddleSections(sections);
    const panel = apiRef.current?.getPanel('middle-panel');
    if (panel) {
      panel.api.updateParameters({ sections });
    }
  }, []);

  const handleRightSectionsChange = useCallback((sections: string[]) => {
    setCurrentRightSections(sections);
    const panel = apiRef.current?.getPanel('right-panel');
    if (panel) {
      panel.api.updateParameters({ sections });
    }
  }, []);

  // Callbacks for Paneview initialization
  const handleDetailPaneReady = useCallback((api: PaneviewApi) => {
    detailPaneApiRef.current = api;
  }, []);

  const handleRelationshipPaneReady = useCallback((api: PaneviewApi) => {
    relationshipPaneApiRef.current = api;
  }, []);

  // Navigation handler for relationship links - adds to detail pane stack
  const handleNavigate = useCallback((itemName: string, itemSection: string) => {
    const paneApi = detailPaneApiRef.current;
    if (!paneApi) return;

    const paneId = `detail-${itemName}`;
    const existingPane = paneApi.getPanel(paneId);
    if (existingPane) {
      // Expand and scroll to it
      existingPane.api.setExpanded(true);
      return;
    }

    // Determine item type from section
    const itemType = itemSection === 'slot' ? 'slot' : itemSection === 'enum' ? 'enum' : 'class';

    // Add new pane at the top (index 0), expanded, NO auto-collapse
    paneApi.addPanel({
      id: paneId,
      component: 'detailPane',
      headerComponent: 'detailHeader',
      title: itemName,
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
    // Item type comes directly from hoverData
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

      // Add new pane at the top, expanded, NO auto-collapse
      paneApi.addPanel({
        id: paneId,
        component: 'relationshipPane',
        headerComponent: 'relationshipHeader',
        title: `${hoverData.name} Rels`,
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

      // Add new pane at the top, expanded, NO auto-collapse
      paneApi.addPanel({
        id: paneId,
        component: 'detailPane',
        headerComponent: 'detailHeader',
        title: hoverData.name,
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

  // Toggle middle panel visibility (show/hide Slots)
  const handleToggleMiddlePanel = useCallback(() => {
    const api = apiRef.current;
    if (!api) return;

    if (middlePanelVisible) {
      // Hide: remove the panel
      const panel = api.getPanel('middle-panel');
      if (panel) {
        api.removePanel(panel);
      }
      setMiddlePanelVisible(false);
      setCurrentMiddleSections([]);
    } else {
      // Show: add the panel back
      api.addPanel({
        id: 'middle-panel',
        component: 'mainPanel',
        title: 'Slots',
        params: {
          dataService,
          sections: ['slot'],
          position: 'middle' as const,
          sectionData: middleSectionData,
          onClickItem: handleClickItem,
          onItemHover: handleItemHover,
          onItemLeave: handleItemLeave,
          onSectionsChange: handleMiddleSectionsChange,
          toggleButtons: [],
          title: 'Slots',
        },
        position: { referencePanel: 'left-panel', direction: 'right' },
      });

      // Lock the new panel to prevent center drops
      const middlePanel = api.getPanel('middle-panel');
      if (middlePanel?.group) middlePanel.group.locked = true;

      setMiddlePanelVisible(true);
      setCurrentMiddleSections(['slot']);
    }
  }, [middlePanelVisible, dataService, middleSectionData, handleClickItem, handleItemHover, handleItemLeave, handleMiddleSectionsChange]);

  // Setup panels when Dockview is ready
  const onReady = useCallback((event: DockviewReadyEvent) => {
    apiRef.current = event.api;

    // Add left panel (Classes) - no toggles, just displays classes
    event.api.addPanel({
      id: 'left-panel',
      component: 'mainPanel',
      title: 'Classes',
      params: {
        dataService,
        sections: initialLeftSections,
        position: 'left' as const,
        sectionData: leftSectionData,
        onClickItem: handleClickItem,
        onItemHover: handleItemHover,
        onItemLeave: handleItemLeave,
        onSectionsChange: handleLeftSectionsChange,
        toggleButtons: [], // No toggles for left panel
      },
    });

    // Add middle panel (Slots) if visible - no toggles currently
    if (initialMiddleSections.length > 0) {
      event.api.addPanel({
        id: 'middle-panel',
        component: 'mainPanel',
        title: 'Slots',
        params: {
          dataService,
          sections: initialMiddleSections,
          position: 'middle' as const,
          sectionData: middleSectionData,
          onClickItem: handleClickItem,
          onItemHover: handleItemHover,
          onItemLeave: handleItemLeave,
          onSectionsChange: handleMiddleSectionsChange,
          toggleButtons: [], // TODO: Add slots toggle
          title: 'Slots',
        },
        position: { referencePanel: 'left-panel', direction: 'right' },
      });
    }

    // Add right panel (Ranges) - with C/E/T toggles
    event.api.addPanel({
      id: 'right-panel',
      component: 'mainPanel',
      title: 'Ranges',
      params: {
        dataService,
        sections: initialRightSections,
        position: 'right' as const,
        sectionData: rightSectionData,
        onClickItem: handleClickItem,
        onItemHover: handleItemHover,
        onItemLeave: handleItemLeave,
        onSectionsChange: handleRightSectionsChange,
        toggleButtons: rightPanelToggleButtons,
        title: 'Ranges:',
      },
      position: {
        referencePanel: initialMiddleSections.length > 0 ? 'middle-panel' : 'left-panel',
        direction: 'right'
      },
    });

    // Add detail stack panel (Paneview for collapsible details)
    event.api.addPanel({
      id: 'detail-stack',
      component: 'detailStack',
      title: 'Details',
      params: {
        onPaneviewReady: handleDetailPaneReady,
      },
      position: { referencePanel: 'right-panel', direction: 'right' },
    });

    // Add relationship stack panel (Paneview for collapsible relationships)
    event.api.addPanel({
      id: 'relationship-stack',
      component: 'relationshipStack',
      title: 'Relationships',
      params: {
        onPaneviewReady: handleRelationshipPaneReady,
      },
      position: { referencePanel: 'detail-stack', direction: 'below' },
    });

    // Lock main panels to prevent center drops while keeping edge drops
    // This allows panels to be reordered but not merged into tab groups
    const leftPanel = event.api.getPanel('left-panel');
    const middlePanel = event.api.getPanel('middle-panel');
    const rightPanel = event.api.getPanel('right-panel');

    if (leftPanel?.group) leftPanel.group.locked = true;
    if (middlePanel?.group) middlePanel.group.locked = true;
    if (rightPanel?.group) rightPanel.group.locked = true;

  }, [dataService, initialLeftSections, initialMiddleSections, initialRightSections, leftSectionData, middleSectionData, rightSectionData, handleClickItem, handleItemHover, handleItemLeave, handleNavigate, handleDetailPaneReady, handleRelationshipPaneReady, handleLeftSectionsChange, handleMiddleSectionsChange, handleRightSectionsChange, rightPanelToggleButtons]);

  return (
    <div className="flex-1 relative">
      {/* Custom styles - theme handles most spacing via gap: 10 */}
      <style>{`
        .dockview-theme-light-spaced {
          --dv-background-color: #f3f4f6;
        }
      `}</style>

      {/* Slots toggle button - positioned in top-left corner */}
      <button
        onClick={handleToggleMiddlePanel}
        title={middlePanelVisible ? 'Hide Slots panel' : 'Show Slots panel'}
        className={`absolute top-2 left-2 z-10 px-3 py-1.5 rounded text-white text-sm font-medium transition-all ${
          middlePanelVisible
            ? 'bg-green-600 hover:bg-green-700'
            : 'bg-gray-400 hover:bg-gray-500'
        }`}
      >
        S
      </button>

      {/* Dockview container */}
      <DockviewReact
        theme={customTheme}
        onReady={onReady}
        components={components}
      />

      {/* LinkOverlay - positioned absolutely over Dockview */}
      {/* This tests whether we can draw SVG links across panels */}
      <LinkOverlay
        leftSections={currentLeftSections}
        rightSections={currentRightSections}
        dataService={dataService}
        hoveredItem={hoveredItem}
      />
    </div>
  );
}
