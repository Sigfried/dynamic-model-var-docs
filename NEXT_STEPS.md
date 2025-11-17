# NEXT STEPS - Slots-as-Edges Refactor

## Current Status

✅ **Stage 1 Infrastructure Complete:**
- Element.ts has explicit export roadmap
- UI_REFACTOR.md defines all target data shapes
- Design decisions documented

## Next: Complete Stage 1 - Define New Interfaces

### Context
Read UI_REFACTOR.md sections 1-2 for interface designs:
- Section 1: LinkOverlay → `LinkPair` interface
- Section 2: RelationshipInfoBox → `ItemInfo` and `EdgeInfo` interfaces

### Task: Add new interface definitions to Element.ts

**Location:** `/Users/sgold15/github-repos/dynamic-model-var-docs/src/models/Element.ts`

**What to add** (after the existing type exports, before Element base class):

```typescript
// ============================================================================
// New Interfaces for Slots-as-Edges (Stage 1)
// ============================================================================

/**
 * Item metadata for relationship displays
 * Used in RelationshipInfoBox and other components
 */
export interface ItemInfo {
  id: string;
  displayName: string;
  typeDisplayName: string;  // "Class", "Enum", "Slot", "Variable"
  color: string;  // Tailwind color classes for styling
}

/**
 * Edge information for unified relationship representation
 * Replaces separate SlotInfo, inheritance tracking, etc.
 */
export interface EdgeInfo {
  edgeType: 'inheritance' | 'property' | 'variable_mapping';
  otherItem: ItemInfo;  // The connected item (target for outgoing, source for incoming)
  label?: string;       // For property: slot/attribute name; for variable_mapping: "mapped_to"
  inheritedFrom?: string; // For property edges only: ancestor name that defined this slot
}

/**
 * Link pair for LinkOverlay rendering
 * Only includes property edges (inheritance/variable_mapping shown in detail views)
 */
export interface LinkPair {
  sourceId: string;
  targetId: string;
  sourceColor: string;  // For line gradient/styling
  targetColor: string;
  label?: string;  // slot/attribute name for property edges
}

/**
 * Relationship data for RelationshipInfoBox
 * Simplified from old SlotInfo-based structure
 */
export interface RelationshipData {
  thisItem: ItemInfo;
  outgoing: EdgeInfo[];
  incoming: EdgeInfo[];
}
```

### After adding interfaces:

1. Run typecheck: `npm run typecheck`
2. Verify no errors
3. Update Element.ts checklist:
   - Mark `[x] Define new interfaces based on UI_REFACTOR.md`
4. Commit with message: "refactor: Define new edge-based interfaces in Element.ts"

### Then proceed to:

**Stage 1 remaining:** Update DataService.ts to use new interfaces
- Add new method signatures (getAllPairs, updated getRelationships)
- Keep old methods for backward compatibility (mark deprecated)
- Add stub implementations that return empty data

See UI_REFACTOR.md Section 6 for DataService method signatures.

---

## Prompt to Resume

After `/clear`:

```
Continue Slots-as-Edges refactor Stage 1.

Read UI_REFACTOR.md sections 1-2 for context, then add the new interfaces
(ItemInfo, EdgeInfo, LinkPair, RelationshipData) to src/models/Element.ts.

See NEXT_STEPS.md for complete instructions and code to add.
```
