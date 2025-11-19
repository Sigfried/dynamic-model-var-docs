/**
 * ID Contextualization Utilities
 *
 * Provides functions to contextualize item IDs for DOM/component use.
 * This layer handles the view-specific ID transformations, keeping the
 * model layer (Element.getId()) simple and context-free.
 *
 * Architecture principle: Element.getId() always returns just the element name.
 * UI layer uses these utilities to add context-specific prefixes when needed.
 */

/**
 * Contextualizes an item ID for DOM/component use
 *
 * @param id - The raw item ID (from element.getId())
 * @param context - Optional context for ID prefixing
 * @returns Contextualized ID string
 *
 * @example
 * contextualizeId({ id: "Specimen", context: "left-panel" }) → "lp-Specimen"
 * contextualizeId({ id: "Condition", context: "right-panel" }) → "rp-Condition"
 * contextualizeId({ id: "Specimen" }) → "Specimen"
 */

// [sg] with new ItemInfo and EdgeInfo interfaces, i don't think we need any of this anymore

export function contextualizeId({
  id,
  context
}: {
  id: string;
  context?: string;
}): string {
  if (!context) return id;

  // Map context to prefix
  const prefixMap: Record<string, string> = {
    'left-panel': 'lp',
    'right-panel': 'rp',
    'detail-box': 'db'
  };

  const prefix = prefixMap[context] || context;
  return `${prefix}-${id}`;
}

/**
 * Contextualizes a link ID from source and target item IDs
 *
 * @param sourceItemId - The source item ID
 * @param targetItemId - The target item ID
 * @param sourceSide - The side where the source item appears ('left' or 'right')
 * @param targetSide - The side where the target item appears ('left' or 'right')
 * @returns Contextualized link ID string
 *
 * @example
 * contextualizeLinkId({
 *   sourceItemId: "Specimen",
 *   targetItemId: "Container",
 *   sourceSide: "left",
 *   targetSide: "right"
 * }) → "link-Specimen_Container-lr"
 */
export function contextualizeLinkId({
  sourceItemId,
  targetItemId,
  sourceSide,
  targetSide
}: {
  sourceItemId: string;
  targetItemId: string;
  sourceSide: 'left' | 'right';
  targetSide: 'left' | 'right';
}): string {
  const direction = sourceSide === 'left' && targetSide === 'right' ? 'lr' : 'rl';
  return `link-${sourceItemId}_${targetItemId}-${direction}`;
}

/**
 * Extracts raw ID from contextualized ID
 *
 * @param contextualizedId - The contextualized ID (e.g., "lp-Specimen")
 * @returns The raw ID without context prefix
 *
 * @example
 * decontextualizeId("lp-Specimen") → "Specimen"
 * decontextualizeId("Specimen") → "Specimen"
 */
export function decontextualizeId(contextualizedId: string): string {
  const parts = contextualizedId.split('-');
  if (parts.length > 1) {
    // Remove prefix, return everything after first dash
    return parts.slice(1).join('-');
  }
  return contextualizedId;
}
