/**
 * TransitoryBox - Hover preview box that appears near hovered item
 *
 * Features:
 * - Appears at specified position (near hovered item)
 * - Click upgrades to persistent (adds to group)
 * - Not draggable/resizable
 * - Fit-content sizing with max constraints
 * - Uses same settings as target group (details or relationships)
 */

import type { FloatingBoxData } from '../contracts/ComponentData';
import { getFloatSettings, type FloatGroupId } from '../config/appConfig';
import { contentTypeToGroupId } from '../utils/statePersistence';

interface TransitoryBoxProps {
  box: FloatingBoxData;
  zIndex: number;
}

export default function TransitoryBox({
  box,
  zIndex,
}: TransitoryBoxProps) {
  const position = box.position ?? { x: 100, y: 100 };
  const groupId: FloatGroupId = contentTypeToGroupId(box.contentType) as FloatGroupId;
  const settings = getFloatSettings(groupId);

  // Calculate dimensions from viewport percentages using group settings
  const minWidth = Math.floor(window.innerWidth * settings.minWidthPercent);
  const maxWidth = Math.floor(window.innerWidth * settings.defaultWidthPercent);
  const maxHeight = Math.floor(window.innerHeight * settings.fitContentMaxHeightPercent);

  return (
    <div
      className="fixed bg-white dark:bg-slate-800 rounded-lg shadow-2xl border-2 border-gray-400 dark:border-slate-500 flex flex-col"
      style={{
        left: 0,
        top: 0,
        transform: `translate(${position.x}px, ${position.y}px)`,
        width: 'fit-content',
        minWidth: `${minWidth}px`,
        maxWidth: `${maxWidth}px`,
        maxHeight: `${maxHeight}px`,
        zIndex,
        pointerEvents: 'none',
      }}
    >
      {/* Header */}
      <div
        className={`flex items-center justify-between px-4 py-2 ${box.metadata.color} text-white border-b rounded-t-lg`}
      >
        <div className="min-w-0 flex-1">
          <div className="font-semibold">{box.metadata.title}</div>
          {box.metadata.subtitle && (
            <div className="text-sm opacity-90">{box.metadata.subtitle}</div>
          )}
        </div>
      </div>

      {/* Content - scrollable when content exceeds max height */}
      <div className="flex-1 overflow-y-auto">
        {box.content}
      </div>
    </div>
  );
}
