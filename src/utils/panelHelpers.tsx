/**
 * Utilities for panel title generation and styling
 */

import { type ReactElement } from 'react';
import type { ClassNode, EnumDefinition, SlotDefinition, VariableSpec } from '../types';
import { ELEMENT_TYPES, type ElementTypeId } from '../models/ElementRegistry';

export type SelectedElement = ClassNode | EnumDefinition | SlotDefinition | VariableSpec;

/**
 * Determine element type from SelectedElement union
 */
function getElementTypeId(element: SelectedElement): ElementTypeId {
  if ('children' in element) {
    return 'class';
  } else if ('permissible_values' in element) {
    return 'enum';
  } else if ('slot_uri' in element) {
    return 'slot';
  } else {
    return 'variable';
  }
}

/**
 * Get header color classes based on element type
 * Returns Tailwind CSS classes for background and border colors
 */
export function getHeaderColor(element: SelectedElement): string {
  const typeId = getElementTypeId(element);
  const { color } = ELEMENT_TYPES[typeId];

  return `${color.headerBg} ${color.headerBorder}`;
}

/**
 * Generate descriptive title JSX for panel header
 * Returns styled ReactElement with bold titles and inheritance info
 */
export function getPanelTitle(element: SelectedElement): ReactElement {
  if ('children' in element) {
    // ClassNode
    const classNode = element as ClassNode;
    return (
      <span className="text-base">
        <span className="font-bold">Class:</span> <span className="font-bold">{classNode.name}</span>
        {classNode.parent && <span className="ml-1 text-sm">extends {classNode.parent}</span>}
      </span>
    );
  } else if ('permissible_values' in element) {
    // EnumDefinition - don't show "Enum:" prefix since name ends with "Enum"
    const enumDef = element as EnumDefinition;
    return <span className="text-base font-bold">{enumDef.name}</span>;
  } else if ('slot_uri' in element) {
    // SlotDefinition
    const slotDef = element as SlotDefinition;
    return <span className="text-base"><span className="font-bold">Slot:</span> <span className="font-bold">{slotDef.name}</span></span>;
  } else {
    // VariableSpec
    const varSpec = element as VariableSpec;
    return <span className="text-base"><span className="font-bold">Variable:</span> <span className="font-bold">{varSpec.variableLabel}</span></span>;
  }
}
