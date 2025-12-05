/**
 * DockviewPOC - Proof of concept for Dockview integration
 *
 * Goals:
 * 1. Test basic DockviewReact setup with our existing components
 * 2. Verify LinkOverlay can render over Dockview panels
 * 3. Test floating groups for detail boxes
 */

import { useCallback, useRef, useState } from 'react';
import { DockviewReact } from 'dockview';
import type { DockviewReadyEvent, IDockviewPanelProps, DockviewApi, DockviewTheme } from 'dockview-core';
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

// Panel component for detail boxes
function DetailPanelContent({ params }: IDockviewPanelProps<{
  dataService: DataService;
  itemId: string;
}>) {
  const { dataService, itemId } = params;

  return (
    <div className="h-full overflow-auto">
      <DetailContent
        itemId={itemId}
        dataService={dataService}
        hideHeader={false}
      />
    </div>
  );
}

// Panel component for relationship info boxes
function RelationshipPanelContent({ params }: IDockviewPanelProps<{
  dataService: DataService;
  itemId: string;
  onNavigate: (itemName: string, itemSection: string) => void;
}>) {
  const { dataService, itemId, onNavigate } = params;

  // RelationshipInfoContent already has p-4 padding
  return (
    <div className="h-full overflow-auto">
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
  mainPanel: MainPanelContent,
  detailPanel: DetailPanelContent,
  relationshipPanel: RelationshipPanelContent,
};

export default function DockviewPOC({
  dataService,
  leftSections,
  middleSections,
  rightSections,
}: DockviewPOCProps) {
  const apiRef = useRef<DockviewApi | null>(null);

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

  // Navigation handler for relationship links
  const handleNavigate = useCallback((itemName: string, _itemSection: string) => {
    const api = apiRef.current;
    if (!api) return;

    const panelId = `detail-${itemName}`;
    const existingPanel = api.getPanel(panelId);
    if (existingPanel) {
      existingPanel.api.setActive();
      return;
    }

    api.addPanel({
      id: panelId,
      component: 'detailPanel',
      title: itemName,
      params: {
        dataService,
        itemId: itemName,
      },
      floating: { width: 500, height: 400 },
    });
  }, [dataService]);

  // Track floating panel positions for cascade effect
  const nextDetailPosition = useRef({ x: 100, y: 100 });
  const nextRelPosition = useRef({ x: 150, y: 150 });

  // Click handler - opens floating panel (detail or relationship based on hoverZone)
  // Each panel is independent (no tabs/grouping)
  const handleClickItem = useCallback((hoverData: ItemHoverData) => {
    const api = apiRef.current;
    if (!api) return;

    const isRelationship = hoverData.hoverZone === 'badge';
    const panelId = isRelationship ? `rel-${hoverData.name}` : `detail-${hoverData.name}`;

    // Check if panel already exists
    const existingPanel = api.getPanel(panelId);
    if (existingPanel) {
      existingPanel.api.setActive();
      return;
    }

    // Get position and update for next panel (cascade effect)
    const posRef = isRelationship ? nextRelPosition : nextDetailPosition;
    const pos = { ...posRef.current };
    posRef.current = { x: pos.x + 30, y: pos.y + 30 };

    // Reset cascade if going off screen
    if (posRef.current.x > 500 || posRef.current.y > 400) {
      posRef.current = isRelationship ? { x: 150, y: 150 } : { x: 100, y: 100 };
    }

    if (isRelationship) {
      api.addPanel({
        id: panelId,
        component: 'relationshipPanel',
        title: `${hoverData.name} Rels`,
        params: {
          dataService,
          itemId: hoverData.name,
          onNavigate: handleNavigate,
        },
        floating: { width: 450, height: 400, x: pos.x, y: pos.y },
      });
    } else {
      api.addPanel({
        id: panelId,
        component: 'detailPanel',
        title: hoverData.name,
        params: {
          dataService,
          itemId: hoverData.name,
        },
        floating: { width: 500, height: 450, x: pos.x, y: pos.y },
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

  }, [dataService, leftSections, middleSections, rightSections, leftSectionData, middleSectionData, rightSectionData, handleClickItem, handleItemHover, handleItemLeave]);

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
