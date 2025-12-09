/**
 * FloatingBoxManager - Manages floating boxes with grouped layout
 *
 * Key features:
 * - Two groups: Details and Relationships (persistent boxes)
 * - Transitory boxes: still appear near hovered item (not in groups)
 * - Groups are draggable/resizable containers with collapsible items
 * - ESC closes: transitory first, then most recent item in most recent group
 * - Content agnostic - works with any React component
 *
 * Architecture: Maintains view/model separation - uses item IDs, never model-layer instances
 */

import { useEffect } from 'react';
import type { FloatingBoxMetadata, FloatingBoxData, FloatingBoxGroupData, GroupId } from '../contracts/ComponentData';
import FloatingBoxGroup from './FloatingBoxGroup';
import TransitoryBox from './TransitoryBox';

// Re-export for backward compatibility
export type { FloatingBoxMetadata, FloatingBoxData, FloatingBoxGroupData, GroupId };

interface FloatingBoxManagerProps {
  // Transitory box (only one at a time)
  transitoryBox: FloatingBoxData | null;
  // Groups containing persistent boxes
  groups: FloatingBoxGroupData[];
  // Transitory box handlers
  onCloseTransitory: () => void;
  onUpgradeToPersistent: () => void;
  // Group handlers
  onCloseGroup: (groupId: GroupId) => void;
  onCloseBox: (groupId: GroupId, boxId: string) => void;
  onToggleBoxCollapse: (groupId: GroupId, boxId: string) => void;
  onCollapseAll: (groupId: GroupId) => void;
  onExpandAll: (groupId: GroupId) => void;
  onGroupChange?: (groupId: GroupId, position: { x: number; y: number }, size: { width: number; height: number }) => void;
  onBringGroupToFront?: (groupId: GroupId) => void;
  onPopoutGroup?: (groupId: GroupId) => void;
}

export default function FloatingBoxManager({
  transitoryBox,
  groups,
  onCloseTransitory,
  onUpgradeToPersistent,
  onCloseGroup,
  onCloseBox,
  onToggleBoxCollapse,
  onCollapseAll,
  onExpandAll,
  onGroupChange,
  onBringGroupToFront,
  onPopoutGroup
}: FloatingBoxManagerProps) {
  // Handle ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // 1. First close transitory box
        if (transitoryBox) {
          onCloseTransitory();
          return;
        }

        // 2. Then close most recent box in most recent group with boxes
        // Groups are ordered by most recent interaction (last in array = most recent)
        for (let i = groups.length - 1; i >= 0; i--) {
          const group = groups[i];
          if (group.boxes.length > 0) {
            // Close the most recent box (last in array)
            const lastBox = group.boxes[group.boxes.length - 1];
            onCloseBox(group.id, lastBox.id);
            return;
          }
        }
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [transitoryBox, groups, onCloseTransitory, onCloseBox]);

  // Base z-index for groups (transitory box is always on top)
  const baseZIndex = 50;

  return (
    <>
      {/* Render groups */}
      {groups.map((group, index) => (
        <FloatingBoxGroup
          key={group.id}
          groupId={group.id}
          title={group.title}
          boxes={group.boxes}
          position={group.position}
          size={group.size}
          zIndex={baseZIndex + index}
          onClose={() => onCloseGroup(group.id)}
          onCloseBox={(boxId) => onCloseBox(group.id, boxId)}
          onToggleBoxCollapse={(boxId) => onToggleBoxCollapse(group.id, boxId)}
          onCollapseAll={() => onCollapseAll(group.id)}
          onExpandAll={() => onExpandAll(group.id)}
          onChange={onGroupChange ? (pos, size) => onGroupChange(group.id, pos, size) : undefined}
          onBringToFront={onBringGroupToFront ? () => onBringGroupToFront(group.id) : undefined}
          onPopout={onPopoutGroup ? () => onPopoutGroup(group.id) : undefined}
        />
      ))}

      {/* Render transitory box (always on top) */}
      {transitoryBox && (
        <TransitoryBox
          box={transitoryBox}
          zIndex={baseZIndex + groups.length + 10}
          onUpgrade={onUpgradeToPersistent}
          dimGroups={groups.length > 0}
        />
      )}
    </>
  );
}
