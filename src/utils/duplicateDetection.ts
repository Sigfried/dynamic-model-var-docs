/**
 * Utilities for detecting duplicate elements in dialog/panel lists
 */

import type { Element } from '../models/Element';
import type { ElementTypeId } from '../models/ElementRegistry';

export interface ElementDescriptor {
  element: Element;
  elementType: ElementTypeId;
}

/**
 * Get the unique identifier for an element (just returns element.name)
 */
export function getElementName(element: Element, _elementType: ElementTypeId): string {
  return element.name;
}

/**
 * Find the index of a duplicate element in a list
 * Returns -1 if no duplicate is found
 */
export function findDuplicateIndex(
  elements: ElementDescriptor[],
  targetElement: Element,
  targetElementType: ElementTypeId
): number {
  const targetName = getElementName(targetElement, targetElementType);

  return elements.findIndex(descriptor => {
    const existingName = getElementName(descriptor.element, descriptor.elementType);
    return existingName === targetName && descriptor.elementType === targetElementType;
  });
}

/**
 * Check if an element already exists in a list
 */
export function isDuplicate(
  elements: ElementDescriptor[],
  targetElement: Element,
  targetElementType: ElementTypeId
): boolean {
  return findDuplicateIndex(elements, targetElement, targetElementType) !== -1;
}
