/**
 * Utilities for panel title generation and styling
 */

import { type ReactElement } from 'react';
import type { ClassNode, EnumDefinition, SlotDefinition, VariableSpec, SelectedElement } from '../types';
import { ELEMENT_TYPES, type ElementTypeId } from '../models/ElementRegistry';

// Re-export SelectedElement for backward compatibility
export type { SelectedElement };

/**
 * Get header color classes based on element type
 * Returns Tailwind CSS classes for background and border colors
 */
export function getHeaderColor(elementType: ElementTypeId): string {
  const { color } = ELEMENT_TYPES[elementType];

  return `${color.headerBg} ${color.headerBorder}`;
}

/**
 * Generate descriptive title JSX for panel header
 * Returns styled ReactElement with bold titles and inheritance info
 */
export function getPanelTitle(element: SelectedElement, elementType: ElementTypeId): ReactElement {
  if (elementType === 'class') {
    // ClassNode
    const classNode = element as ClassNode;
    return (
      <span className="text-base">
        <span className="font-bold">Class:</span> <span className="font-bold">{classNode.name}</span>
        {classNode.parent && <span className="ml-1 text-sm">extends {classNode.parent}</span>}
      </span>
    );
  } else if (elementType === 'enum') {
    // EnumDefinition - don't show "Enum:" prefix since name ends with "Enum"
    const enumDef = element as EnumDefinition;
    return <span className="text-base font-bold">{enumDef.name}</span>;
  } else if (elementType === 'slot') {
    // SlotDefinition
    const slotDef = element as SlotDefinition;
    return <span className="text-base"><span className="font-bold">Slot:</span> <span className="font-bold">{slotDef.name}</span></span>;
  } else {
    // VariableSpec
    const varSpec = element as VariableSpec;
    return <span className="text-base"><span className="font-bold">Variable:</span> <span className="font-bold">{varSpec.variableLabel}</span></span>;
  }
}
