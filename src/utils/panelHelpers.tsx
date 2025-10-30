/**
 * Utilities for panel title generation and styling
 */

import { type ReactElement } from 'react';
import type { Element, ClassElement } from '../models/Element';
import { ELEMENT_TYPES, type ElementTypeId } from '../models/ElementRegistry';

/**
 * Get header color classes based on element type
 * Returns Tailwind CSS classes for background and border colors
 */
export function getHeaderColor(elementType: ElementTypeId): string {
  const metadata = ELEMENT_TYPES[elementType];

  // Safety check - if invalid type, return default gray
  if (!metadata) {
    console.error(`Invalid elementType: ${elementType}`);
    return 'bg-gray-700 dark:bg-gray-700 border-gray-800 dark:border-gray-600';
  }

  const { color } = metadata;
  return `${color.headerBg} ${color.headerBorder}`;
}

/**
 * Generate descriptive title JSX for panel header
 * Returns styled ReactElement with bold titles and inheritance info
 */
export function getPanelTitle(element: Element, elementType: ElementTypeId): ReactElement {
  const metadata = ELEMENT_TYPES[elementType];

  if (elementType === 'class') {
    const classElement = element as ClassElement;
    return (
      <span className="text-base">
        <span className="font-bold">Class:</span> <span className="font-bold">{element.name}</span>
        {classElement.parent && <span className="ml-1 text-sm">extends {classElement.parent}</span>}
      </span>
    );
  } else if (elementType === 'enum') {
    // Don't show "Enum:" prefix since name ends with "Enum"
    return <span className="text-base font-bold">{element.name}</span>;
  } else {
    // For slot and variable, show type prefix
    return (
      <span className="text-base">
        <span className="font-bold">{metadata.label}:</span> <span className="font-bold">{element.name}</span>
      </span>
    );
  }
}
