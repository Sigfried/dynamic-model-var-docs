/**
 * Utilities for detecting duplicate elements in dialog/panel lists
 */

import type { ClassNode, EnumDefinition, SlotDefinition, VariableSpec } from '../types';

export type SelectedElement = ClassNode | EnumDefinition | SlotDefinition | VariableSpec;

export interface ElementDescriptor {
  element: SelectedElement;
  elementType: 'class' | 'enum' | 'slot' | 'variable';
}

/**
 * Get the unique identifier for an element (name or variableLabel)
 */
export function getElementName(element: SelectedElement, elementType: 'class' | 'enum' | 'slot' | 'variable'): string {
  if (elementType === 'variable') {
    return (element as VariableSpec).variableLabel;
  }
  return (element as ClassNode | EnumDefinition | SlotDefinition).name;
}

/**
 * Find the index of a duplicate element in a list
 * Returns -1 if no duplicate is found
 */
export function findDuplicateIndex(
  elements: ElementDescriptor[],
  targetElement: SelectedElement,
  targetElementType: 'class' | 'enum' | 'slot' | 'variable'
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
  targetElement: SelectedElement,
  targetElementType: 'class' | 'enum' | 'slot' | 'variable'
): boolean {
  return findDuplicateIndex(elements, targetElement, targetElementType) !== -1;
}
