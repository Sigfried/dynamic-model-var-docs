/**
 * ID Contextualization Utilities
 *
 * Provides functions to contextualize item IDs for DOM/component use.
 * This layer handles the view-specific ID transformations, keeping the
 * model layer (Element.getId()) simple and context-free.
 *
 * Architecture principle: Element.getId() always returns just the element name.
 * UI layer uses these utilities to add context-specific prefixes when needed.
 *
 * Delimiter: Uses '::' to separate prefix from ID, allowing hyphens in element IDs
 * (e.g., override slot IDs like 'category-SdohObservation').
 */

export const CONTEXT_DELIMITER = '::';
export const panelPrefixes = ['lp', 'mp', 'rp']
export type PanelPrefix = 'lp' | 'mp' | 'rp'
/**
 * Contextualizes an item ID for DOM/component use
 *
 * @param id - The raw item ID (from element.getId())
 * @param context - Optional context for ID prefixing
 * @returns Contextualized ID string
 *
 * @example
 * contextualizeId({ id: "Specimen", context: "left-panel" }) → "lp::Specimen"
 * contextualizeId({ id: "Condition", context: "right-panel" }) → "rp::Condition"
 * contextualizeId({ id: "category-SdohObservation", context: "middle-panel" }) → "mp::category-SdohObservation"
 * contextualizeId({ id: "Specimen" }) → "Specimen"
 */
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
    'middle-panel': 'mp',
    'right-panel': 'rp',
    'detail-box': 'db'
  };

  const prefix = prefixMap[context] || context;
  return `${prefix}${CONTEXT_DELIMITER}${id}`;
}

/**
 * Extracts raw ID from contextualized ID
 *
 * @param contextualizedId - The contextualized ID (e.g., "lp::Specimen")
 * @returns The raw ID without context prefix
 *
 * @example
 * decontextualizeId("lp::Specimen") → "Specimen"
 * decontextualizeId("mp::category-SdohObservation") → "category-SdohObservation"
 * decontextualizeId("Specimen") → "Specimen"
 */
export function decontextualizeId(contextualizedId: string): string {
  const parts = contextualizedId.split(CONTEXT_DELIMITER);
  if (parts.length > 1) {
    // Remove prefix, return everything after delimiter
    return parts.slice(1).join(CONTEXT_DELIMITER);
  }
  return contextualizedId;
}
/**
 * Split context and id
 *
 * @param contextualizedId - The contextualized ID (e.g., "lp::Specimen")
 * @returns [prefix, decontextualizedId]
 *
 * @example
 * splitId("lp::Specimen") → ["lp", "Specimen"]
 * splitId("mp::category-SdohObservation") → ["mp", "category-SdohObservation"]
 */
export function splitId(contextualizedId: string): [PanelPrefix, string] {
  const parts = contextualizedId.split(CONTEXT_DELIMITER);
  if (parts.length !== 2) {
    throw new Error(`don't call splitId without a contextualized id: ${contextualizedId}`);
  }
  const prefix = parts[0] as PanelPrefix;
  if (!panelPrefixes.includes(prefix)) {
    throw new Error(`invalid prefix in contextualizedId: ${contextualizedId}`);
  }
  return [prefix, parts[1]];
}
