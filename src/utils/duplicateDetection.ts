/**
 * Utilities for detecting duplicate entities in dialog/panel lists
 */

import type { ClassNode, EnumDefinition, SlotDefinition, VariableSpec } from '../types';

export type SelectedEntity = ClassNode | EnumDefinition | SlotDefinition | VariableSpec;

export interface EntityDescriptor {
  entity: SelectedEntity;
  entityType: 'class' | 'enum' | 'slot' | 'variable';
}

/**
 * Get the unique identifier for an entity (name or variableLabel)
 */
export function getEntityName(entity: SelectedEntity, entityType: 'class' | 'enum' | 'slot' | 'variable'): string {
  if (entityType === 'variable') {
    return (entity as VariableSpec).variableLabel;
  }
  return (entity as ClassNode | EnumDefinition | SlotDefinition).name;
}

/**
 * Determine entity type from the entity object structure
 */
export function getEntityType(entity: SelectedEntity): 'class' | 'enum' | 'slot' | 'variable' {
  if ('children' in entity) return 'class';
  if ('permissible_values' in entity) return 'enum';
  if ('slot_uri' in entity) return 'slot';
  return 'variable';
}

/**
 * Find the index of a duplicate entity in a list
 * Returns -1 if no duplicate is found
 */
export function findDuplicateIndex(
  entities: EntityDescriptor[],
  targetEntity: SelectedEntity,
  targetEntityType: 'class' | 'enum' | 'slot' | 'variable'
): number {
  const targetName = getEntityName(targetEntity, targetEntityType);

  return entities.findIndex(descriptor => {
    const existingName = getEntityName(descriptor.entity, descriptor.entityType);
    return existingName === targetName && descriptor.entityType === targetEntityType;
  });
}

/**
 * Check if an entity already exists in a list
 */
export function isDuplicate(
  entities: EntityDescriptor[],
  targetEntity: SelectedEntity,
  targetEntityType: 'class' | 'enum' | 'slot' | 'variable'
): boolean {
  return findDuplicateIndex(entities, targetEntity, targetEntityType) !== -1;
}
