/**
 * PopoutContent - Content rendered in a popout window via React portal
 *
 * This component renders the boxes for a popped-out group.
 * It's designed to be rendered via createPortal into the popout window's DOM.
 */

import type { FloatingBoxGroupData } from '../contracts/ComponentData';
import type { DataService } from '../services/DataService';
import DetailContent from './DetailContent';
import { RelationshipInfoContent } from './RelationshipInfoBox';

interface PopoutContentProps {
  group: FloatingBoxGroupData;
  dataService: DataService;
  onCloseBox: (boxId: string) => void;
  onToggleBoxCollapse: (boxId: string) => void;
}

export default function PopoutContent({
  group,
  dataService,
  onCloseBox,
  onToggleBoxCollapse,
}: PopoutContentProps) {
  return (
    <div className="flex flex-col gap-2">
      {group.boxes.length === 0 ? (
        <div className="text-gray-400 dark:text-gray-500 text-center py-8">
          No items open
        </div>
      ) : (
        group.boxes.map((box) => (
          <PopoutBox
            key={box.id}
            box={box}
            dataService={dataService}
            onClose={() => onCloseBox(box.id)}
            onToggleCollapse={() => onToggleBoxCollapse(box.id)}
          />
        ))
      )}
    </div>
  );
}

interface PopoutBoxProps {
  box: FloatingBoxGroupData['boxes'][0];
  dataService: DataService;
  onClose: () => void;
  onToggleCollapse: () => void;
}

function PopoutBox({ box, dataService, onClose, onToggleCollapse }: PopoutBoxProps) {
  const isCollapsed = box.isCollapsed ?? false;

  // Render the actual content based on contentType
  const renderContent = () => {
    if (box.contentType === 'relationship') {
      return (
        <RelationshipInfoContent
          itemId={box.itemId}
          dataService={dataService}
          onNavigate={() => {}} // Navigation from popout not supported yet
        />
      );
    }
    return (
      <DetailContent
        itemId={box.itemId}
        dataService={dataService}
        hideHeader={true}
        onNavigate={() => {}} // Navigation from popout not supported yet
      />
    );
  };

  return (
    <div className="border border-gray-200 dark:border-slate-600 rounded-lg overflow-hidden bg-white dark:bg-slate-800">
      {/* Box header */}
      <div
        className={`flex items-center justify-between px-3 py-1.5 ${box.metadata.color} text-white cursor-pointer select-none`}
        onClick={onToggleCollapse}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="text-sm">{isCollapsed ? '▶' : '▼'}</span>
          <span className="font-medium truncate text-sm">{box.metadata.title}</span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="hover:bg-black hover:bg-opacity-20 rounded p-0.5 transition-colors text-sm font-bold ml-2"
          title="Close"
        >
          ×
        </button>
      </div>

      {/* Box content */}
      {!isCollapsed && (
        <div
          className="overflow-y-auto"
          style={{ maxHeight: '400px' }}
        >
          {renderContent()}
        </div>
      )}
    </div>
  );
}
