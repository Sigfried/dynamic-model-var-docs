/**
 * Utilities for panel title generation and styling
 */

import { type ReactElement } from 'react';
import type { ClassNode, EnumDefinition, SlotDefinition, VariableSpec } from '../types';

export type SelectedElement = ClassNode | EnumDefinition | SlotDefinition | VariableSpec;

/**
 * Get header color classes based on element type
 * Returns Tailwind CSS classes for background and border colors
 */
export function getHeaderColor(element: SelectedElement): string {
  if ('children' in element) {
    // ClassNode
    return 'bg-blue-700 dark:bg-blue-700 border-blue-800 dark:border-blue-600';
  } else if ('permissible_values' in element) {
    // EnumDefinition
    return 'bg-purple-700 dark:bg-purple-700 border-purple-800 dark:border-purple-600';
  } else if ('slot_uri' in element) {
    // SlotDefinition
    return 'bg-green-700 dark:bg-green-700 border-green-800 dark:border-green-600';
  } else {
    // VariableSpec
    return 'bg-orange-600 dark:bg-orange-600 border-orange-700 dark:border-orange-500';
  }
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
