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
import type { SectionData, ItemHoverData } from './Section';
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
  title?: string;
}>) {
  const { sections, position, sectionData, onClickItem, onItemHover, onItemLeave, title } = params;

  return (
    <div className="h-full overflow-auto">
      <ItemsPanel
        position={position}
        sections={sections}
        onSectionsChange={() => {}}
        sectionData={sectionData}
        toggleButtons={[]}
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

// Custom header component for detail panes
// TODO: Move colors to appConfig
function DetailPaneHeader({ api, title, containerApi }: IPaneviewPanelProps) {
  const [isExpanded, setIsExpanded] = useState(api.isExpanded);

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
      className="flex items-center justify-between px-3 py-2 bg-blue-600 text-white cursor-pointer select-none"
      onClick={handleToggle}
    >
      <div className="flex items-center gap-2">
        <ChevronIcon expanded={isExpanded} />
        <span className="font-medium text-sm truncate">{title}</span>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={(e) => { e.stopPropagation(); handleClose(); }}
          className="p-1 hover:bg-blue-700 rounded"
          title="Close"
        >
          <CloseIcon />
        </button>
      </div>
    </div>
  );
}

// Custom header component for relationship panes
function RelationshipPaneHeader({ api, title, containerApi }: IPaneviewPanelProps) {
  const [isExpanded, setIsExpanded] = useState(api.isExpanded);

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
      className="flex items-center justify-between px-3 py-2 bg-purple-600 text-white cursor-pointer select-none"
      onClick={handleToggle}
    >
      <div className="flex items-center gap-2">
        <ChevronIcon expanded={isExpanded} />
        <span className="font-medium text-sm truncate">{title}</span>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={(e) => { e.stopPropagation(); handleClose(); }}
          className="p-1 hover:bg-purple-700 rounded"
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
  leftSections,
  middleSections,
  rightSections,
}: DockviewPOCProps) {
  const apiRef = useRef<DockviewApi | null>(null);
  const detailPaneApiRef = useRef<PaneviewApi | null>(null);
  const relationshipPaneApiRef = useRef<PaneviewApi | null>(null);

  // Build section data
  const leftSectionData = dataService.getAllSectionsData('left');
  const middleSectionData = dataService.getAllSectionsData('middle');
  const rightSectionData = dataService.getAllSectionsData('right');

  // Hover state for LinkOverlay (must be state to trigger re-renders)
  const [hoveredItem, setHoveredItem] = useState<ItemHoverData | null>(null);

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

  // Navigation handler for relationship links - adds to detail pane stack
  const handleNavigate = useCallback((itemName: string, _itemSection: string) => {
    const paneApi = detailPaneApiRef.current;
    if (!paneApi) return;

    const paneId = `detail-${itemName}`;
    const existingPane = paneApi.getPanel(paneId);
    if (existingPane) {
      // Expand and scroll to it
      existingPane.api.setExpanded(true);
      return;
    }

    // Add new pane at the top (index 0), expanded, collapse others
    paneApi.panels.forEach(p => p.api.setExpanded(false));
    paneApi.addPanel({
      id: paneId,
      component: 'detailPane',
      headerComponent: 'detailHeader',
      title: itemName,
      params: {
        dataService,
        itemId: itemName,
      },
      isExpanded: true,
      index: 0,
    });
  }, [dataService]);

  // Click handler - adds to appropriate Paneview stack
  const handleClickItem = useCallback((hoverData: ItemHoverData) => {
    const isRelationship = hoverData.hoverZone === 'badge';

    if (isRelationship) {
      const paneApi = relationshipPaneApiRef.current;
      if (!paneApi) return;

      const paneId = `rel-${hoverData.name}`;
      const existingPane = paneApi.getPanel(paneId);
      if (existingPane) {
        existingPane.api.setExpanded(true);
        return;
      }

      // Add new pane at the top, expanded, collapse others
      paneApi.panels.forEach(p => p.api.setExpanded(false));
      paneApi.addPanel({
        id: paneId,
        component: 'relationshipPane',
        headerComponent: 'relationshipHeader',
        title: `${hoverData.name} Rels`,
        params: {
          dataService,
          itemId: hoverData.name,
          onNavigate: handleNavigate,
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

      // Add new pane at the top, expanded, collapse others
      paneApi.panels.forEach(p => p.api.setExpanded(false));
      paneApi.addPanel({
        id: paneId,
        component: 'detailPane',
        headerComponent: 'detailHeader',
        title: hoverData.name,
        params: {
          dataService,
          itemId: hoverData.name,
        },
        isExpanded: true,
        index: 0,
      });
    }
  }, [dataService, handleNavigate]);

  // Setup panels when Dockview is ready
  const onReady = useCallback((event: DockviewReadyEvent) => {
    apiRef.current = event.api;

    // Add left panel (Classes)
    event.api.addPanel({
      id: 'left-panel',
      component: 'mainPanel',
      title: 'Classes',
      params: {
        dataService,
        sections: leftSections,
        position: 'left' as const,
        sectionData: leftSectionData,
        onClickItem: handleClickItem,
        onItemHover: handleItemHover,
        onItemLeave: handleItemLeave,
      },
    });

    // Add middle panel (Slots) if visible
    if (middleSections.length > 0) {
      event.api.addPanel({
        id: 'middle-panel',
        component: 'mainPanel',
        title: 'Slots',
        params: {
          dataService,
          sections: middleSections,
          position: 'middle' as const,
          sectionData: middleSectionData,
          onClickItem: handleClickItem,
          onItemHover: handleItemHover,
          onItemLeave: handleItemLeave,
          title: 'Slots',
        },
        position: { referencePanel: 'left-panel', direction: 'right' },
      });
    }

    // Add right panel (Ranges)
    event.api.addPanel({
      id: 'right-panel',
      component: 'mainPanel',
      title: 'Ranges',
      params: {
        dataService,
        sections: rightSections,
        position: 'right' as const,
        sectionData: rightSectionData,
        onClickItem: handleClickItem,
        onItemHover: handleItemHover,
        onItemLeave: handleItemLeave,
        title: 'Ranges:',
      },
      position: {
        referencePanel: middleSections.length > 0 ? 'middle-panel' : 'left-panel',
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

  }, [dataService, leftSections, middleSections, rightSections, leftSectionData, middleSectionData, rightSectionData, handleClickItem, handleItemHover, handleItemLeave, handleNavigate, handleDetailPaneReady, handleRelationshipPaneReady]);

  return (
    <div className="flex-1 relative">
      {/* Custom styles - theme handles most spacing via gap: 10 */}
      <style>{`
        .dockview-theme-light-spaced {
          --dv-background-color: #f3f4f6;
        }
      `}</style>

      {/* Dockview container */}
      <DockviewReact
        theme={customTheme}
        onReady={onReady}
        components={components}
      />

      {/* LinkOverlay - positioned absolutely over Dockview */}
      {/* This tests whether we can draw SVG links across panels */}
      <LinkOverlay
        leftSections={leftSections}
        rightSections={rightSections}
        dataService={dataService}
        hoveredItem={hoveredItem}
      />
    </div>
  );
}
