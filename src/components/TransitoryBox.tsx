/**
 * TransitoryBox - Hover preview box positioned using Floating UI
 *
 * Features:
 * - Uses Floating UI for smart positioning relative to hovered item
 * - Automatically flips and shifts to avoid viewport overflow
 * - Positioned to the right of the reference element by default
 * - Click upgrades to persistent (adds to group)
 * - Not draggable/resizable
 * - Fit-content sizing with max constraints
 */

import { useEffect, useState } from 'react';
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
  type Placement,
} from '@floating-ui/react';
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
  const groupId: FloatGroupId = contentTypeToGroupId(box.contentType) as FloatGroupId;
  const settings = getFloatSettings(groupId);

  // Get reference element from DOM
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (box.referenceElementId) {
      const el = document.getElementById(box.referenceElementId);
      setReferenceElement(el);
    } else {
      setReferenceElement(null);
    }
  }, [box.referenceElementId]);

  // Calculate dimensions from viewport percentages using group settings
  const minWidth = Math.floor(window.innerWidth * settings.minWidthPercent);
  const maxWidth = Math.floor(window.innerWidth * settings.defaultWidthPercent);
  const maxHeight = Math.floor(window.innerHeight * settings.fitContentMaxHeightPercent);

  // Use Floating UI for positioning
  const { refs, floatingStyles, placement } = useFloating({
    elements: {
      reference: referenceElement,
    },
    placement: 'right-start' as Placement,
    middleware: [
      // Offset from the reference element
      offset(20),
      // Flip to opposite side if not enough space
      flip({
        fallbackPlacements: ['left-start', 'bottom-start', 'top-start'],
        padding: 10,
      }),
      // Shift along axis to stay in viewport
      shift({
        padding: 10,
        crossAxis: true,
      }),
    ],
    whileElementsMounted: autoUpdate,
  });

  // Fall back to legacy position if no reference element
  const useLegacyPosition = !referenceElement && box.position;
  const legacyStyles = useLegacyPosition ? {
    position: 'fixed' as const,
    left: 0,
    top: 0,
    transform: `translate(${box.position!.x}px, ${box.position!.y}px)`,
  } : {};

  // Don't render if we have neither reference element nor legacy position
  if (!referenceElement && !box.position) {
    return null;
  }

  return (
    <div
      ref={refs.setFloating}
      className="fixed bg-white dark:bg-slate-800 rounded-lg shadow-2xl border-2 border-gray-400 dark:border-slate-500 flex flex-col"
      style={{
        ...(useLegacyPosition ? legacyStyles : floatingStyles),
        width: 'fit-content',
        minWidth: `${minWidth}px`,
        maxWidth: `${maxWidth}px`,
        maxHeight: `${maxHeight}px`,
        zIndex,
        pointerEvents: 'none',
      }}
      data-placement={placement}
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
