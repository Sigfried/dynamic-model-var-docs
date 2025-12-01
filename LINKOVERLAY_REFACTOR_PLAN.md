# LinkOverlay Refactor Plan v3 - Updated for Current Architecture

**Status:** Phase 2 - Ready for implementation
**Date Updated:** 2025-12-01
**Related:** TASKS.md Phase 2, ComponentData.ts (EdgeInfo/ItemInfo), DataService.ts (getEdgesForItem)

---

## Current State Analysis (Dec 2025)

### What's Already Done ✅

1. **EdgeInfo/ItemInfo types exist** (ComponentData.ts:182-188)
   - No longer "Proposal" - these are the real types
   - EdgeInfo has: edgeType, sourceItem, targetItem, label, inheritedFrom
   - ItemInfo has: id, displayName, typeDisplayName, color, badge

2. **getEdgesForItem() implemented** (DataService.ts:181-188)
   - Takes itemId and EdgeType[] filter
   - Returns EdgeInfo[] from graph
   - This is the NEW API we need to use

3. **Old API deprecated** (DataService.ts:236-242)
   - getRelationshipsForLinking() marked @deprecated
   - Returns old Relationship[] format
   - Will be removed after LinkOverlay migration

### Current LinkOverlay Issues 🐛

**Current implementation** (LinkOverlay.tsx, 596 lines):

1. **Double queries** - calls getRelationshipsForLinking() twice:
   - Line 247: In buildLinkPairs() to find targets
   - Line 392: In renderLinks() to get relationship details

2. **Complex filtering logic**:
   - Panel adjacency rules (lines 269-278)
   - Same-panel filtering (lines 263-267)
   - DOM queries for finding targets (lines 257-258)

3. **Uses deprecated API** throughout

**Known bugs** (from TASKS.md):
- Class→slot links pointing wrong direction (3-panel mode)
- Specimen→analyte_type link missing
- Links don't update when showing/hiding middle panel

### Updated Refactor Strategy

**Key insight from current architecture:**
- We DON'T need getAllEdgesForLinking()
- We already have getEdgesForItem() which works per-item
- Current DOM-based approach is correct - just needs to use new API

**Simple migration path:**
1. Replace getRelationshipsForLinking() with getEdgesForItem()
2. Use EdgeInfo.sourceItem/targetItem instead of Relationship.target
3. Remove double queries - get edge info once per pair
4. Fix filtering logic to handle all edge types correctly

---

## Implementation Plan - Phase 2 Step 3

### Step 1: Update buildLinkPairs() to use EdgeInfo

**Current approach** (simplified):
```typescript
// buildLinkPairs() - current (lines 229-288)
items.forEach(item => {
  const itemId = decontextualizeId(item.id);
  const relationships = dataService.getRelationshipsForLinking(itemId); // ❌ OLD API

  relationships.forEach(rel => {
    const targetName = rel.target; // ❌ Just a string
    const targetElement = document.querySelector(`[id="lp-${targetName}"], ...`);
    if (targetElement) {
      // Filter logic, store pair...
    }
  });
});
```

**New approach**:
```typescript
// buildLinkPairs() - new
const buildLinkPairs = (): Map<string, EdgeInfo> => {  // Return Map of edgeKey → EdgeInfo
  if (!dataService) return new Map();

  const items = document.querySelectorAll('.item');
  const edgeMap = new Map<string, EdgeInfo>();
  const middlePanelVisible = document.querySelector('[data-panel-position="middle"]') !== null;

  items.forEach(item => {
    const contextualizedId = item.id;
    const itemId = decontextualizeId(contextualizedId);
    const sourcePanel = item.getAttribute('data-panel-position');

    // ✅ NEW API: Get edges with explicit source/target
    const edges = dataService.getEdgesForItem(itemId, [
      EDGE_TYPES.SLOT,
      EDGE_TYPES.MAPS_TO
    ]);

    edges.forEach(edge => {
      // Find target in DOM
      const targetName = edge.targetItem.id;
      const targetSelector = `[id="lp-${targetName}"], [id="mp-${targetName}"], [id="rp-${targetName}"]`;
      const targetElement = document.querySelector(targetSelector);

      if (targetElement) {
        const targetPanel = targetElement.getAttribute('data-panel-position');

        // Same filtering logic as before
        if (sourcePanel === targetPanel && contextualizedId !== targetElement.id) {
          return; // Skip same-panel non-self-ref links
        }

        if (middlePanelVisible) {
          if (sourcePanel === 'left' && targetPanel === 'right') return;
          if (sourcePanel === 'right' && targetPanel === 'left') return;
        }

        // ✅ Store EdgeInfo with contextualized IDs
        const edgeKey = `${contextualizedId}→${targetElement.id}`;
        edgeMap.set(edgeKey, {
          ...edge,
          // Add contextualized IDs for DOM lookup
          _sourceContextId: contextualizedId,
          _targetContextId: targetElement.id
        });
      }
    });
  });

  return edgeMap;
};
```

### Step 2: Update renderLinks() to use EdgeInfo map

**Current approach**:
```typescript
// renderLinks() - current (lines 363-500+)
const linkPairs = buildLinkPairs(); // Returns [sourceId, targetId][]

linkPairs.forEach(([sourceId, targetId]) => {
  const sourceName = decontextualizeId(sourceId);
  const targetName = decontextualizeId(targetId);

  // ❌ QUERY AGAIN - wasteful!
  const relationships = dataService.getRelationshipsForLinking(sourceName);
  const relationship = relationships.find(r => r.target === targetName);

  // Extract info from relationship...
  const sourceType = /* complex logic */;
  const targetType = relationship.targetSection;
  // ...
});
```

**New approach**:
```typescript
// renderLinks() - new
const renderLinks = () => {
  const allRenderedLinks: (React.JSX.Element | null)[] = [];

  const svgRect = svgRef.current?.getBoundingClientRect();
  if (!svgRect || !dataService) return allRenderedLinks;

  // ✅ Get EdgeInfo map - contains all we need!
  const edgeMap = buildLinkPairs();

  edgeMap.forEach((edge, edgeKey) => {
    // ✅ Use stored contextualized IDs
    const sourceId = edge._sourceContextId;
    const targetId = edge._targetContextId;

    const sourceItem = document.getElementById(sourceId);
    const targetItem = document.getElementById(targetId);
    if (!sourceItem || !targetItem) return;

    const sourceRect = sourceItem.getBoundingClientRect();
    const targetRect = targetItem.getBoundingClientRect();

    // ✅ All info available in EdgeInfo!
    const sourceType = edge.sourceItem.typeDisplayName.toLowerCase(); // "Class", "Enum" → "class", "enum"
    const targetType = edge.targetItem.typeDisplayName.toLowerCase();
    const sourceColor = edge.sourceItem.color;
    const targetColor = edge.targetItem.color;
    const relationshipType = edge.edgeType; // EDGE_TYPES.SLOT, etc.
    const relationshipLabel = edge.label;

    // Same path generation logic...
    const isSelfRef = sourceId === targetId;
    let pathData: string;
    if (isSelfRef) {
      // ... same as before
    } else {
      // ... same as before
    }

    // Render with all edge info available
    const linkKey = edgeKey;
    const isHovered = /* hover logic using edge.sourceItem.id, edge.targetItem.id */;

    allRenderedLinks.push(
      <path
        key={linkKey}
        d={pathData}
        stroke={getLinkGradientId(sourceColor, targetColor, isLeftToRight)}
        // ... rest same as before but using edge.sourceItem/targetItem
      />
    );
  });

  return allRenderedLinks;
};
```

### Step 3: Benefits of This Approach

1. **Single query** - getEdgesForItem() called once per item
2. **All info in EdgeInfo** - no need to query again for relationship details
3. **Type safety** - EdgeInfo has sourceItem/targetItem with all properties
4. **Simpler code** - no more finding relationships in arrays
5. **Fixes bugs** - EdgeInfo has correct source/target, fixing direction issues

### Step 4: Testing Strategy

1. **Test 2-panel mode** (left + right, no middle)
   - Verify all links render correctly
   - Check self-refs work

2. **Test 3-panel mode** (left + middle + right)
   - Verify adjacency filtering (no left→right links)
   - Check class→slot→range chains render correctly
   - Verify problematic links (Specimen→analyte_type, etc.)

3. **Test panel transitions**
   - Hide middle panel → links should update
   - Show middle panel → links should update
   - No stale links should remain

4. **Test hover behavior**
   - Links highlight correctly
   - Tooltip shows correct relationship info from EdgeInfo

---

## Original Plan (v2) - ARCHIVED

*Note: The sections below are from the original plan. Some details are outdated (e.g., EdgeInfoProposal → EdgeInfo), but the core design ideas remain valid.*

---
## [sg] think we need to this next


### Design (from REFACTOR_PLAN Stage 5)

**Goal**: Show slots organized by source (Global + per-class sections)

**Structure**:
```
Global Slots (7)
  - id
  - associated_participant
  - observations
  - ...

Entity (1 slot)
  - id (global reference)

Observation (12 slots)
  - id (inherited from Entity)
  - category (defined here)
  - associated_visit (global reference)
  - value_string (defined here)
  - ...

SdohObservation (13 slots)
  - id (inherited from Entity)
  - category (inherited from Observation) ⚠️ overridden
  - value_string (inherited from Observation)
  - related_questionnaire_item (defined here)
  - ...
```

**Behavior**:
- Inherited slots appear under each class that uses them (repetition across classes is OK)
- Always show base slot name (never "category-SdohObservation")
- Click/hover navigates to that class's version (with overrides if any)
- Visual indicators for
   - defined here vs gobal ref vs inherited vs inherited overridden

**Implementation**:
- DataService: Provide grouped slot data
- Section.tsx: Support nested grouping (class headers with slot items)
- Already done: Filter out slot_usage instances (Stage 4.5 Part 3)

**Priority**: Medium - nice to have for demo, not blocking

---

## Your Proposal (Element.ts lines 132-156)

```typescript
// Generalized EdgeInfo without single-item focus
export interface EdgeInfoProposal { // [sg] i only put 'Proposal' in the names in order not to break stuff in Elements.ts
                                    //      no need to keep it here
  edgeType: 'inheritance' | 'property' | 'variable_mapping';
  sourceItem: ItemInfoProposal;
  targetItem: ItemInfoProposal;
  label?: string;
  inheritedFrom?: string;
}

export interface ItemInfoProposal {
  id: string;
  displayName: string;
  typeDisplayName: string;  // "Class", "Enum", "Slot", "Variable"
  color: string;
  panelPosition: 'left' | 'right';  // Logical: which side of this link
  panelId: 'left' | 'middle' | 'right'; // Physical: DOM panel location
}

// Proposed LinkOverlay usage:
<LinkOverlay
  edges={/* EdgeInfoProposal instances for all currently displayed items */}
  leftPanelId={'left'}
  rightPanelId={'middle'}
  hoveredItem={hoveredItem}
/>
```

**Key design insights:**
1. **Logical/Physical separation**: panelPosition (left/right of edge) vs panelId (physical DOM location)
2. **Reusable edges**: Same edge data works for multiple LinkOverlay instances
3. **LinkOverlay filters**: Each instance only renders edges connecting its two panels
4. **No DataService**: LinkOverlay is pure rendering, no data queries

---

## Architecture

### LayoutManager Responsibilities
- Query DataService for all edges
- Fill in panelId based on which items are in which physical panels
- Pass complete edge list to LinkOverlay(s)
- **Does NOT** pre-filter edges - LinkOverlay filters itself

### LinkOverlay Responsibilities
- Filter to only edges connecting its leftPanelId and rightPanelId
- Find DOM elements (using id + panelId, no type needed per your note)
- Render SVG paths
- Handle hover state
- Log errors if DOM elements not found (per your note)

---

## Implementation Steps

### Phase 1: Implement `getAllEdgesForLinking()` in DataService

**Goal:** Return EdgeInfoProposal[] with panelPosition set, panelId empty

```typescript
import {itemTypeToCode} from "./statePersistence";

class DataService {
   // [sg] is there a reason to query for all edges?
   //      also, my EdgeInfo proposal is supposed to be generic and work
   //      for detail and hover boxes (_maybe_ for hierarchical sections as well)
   //      i'll put some alternative ideas below

   getAllEdgesForLinking(): EdgeInfoProposal[] {
      const edges: EdgeInfoProposal[] = [];

      // Query graph for all property edges
      this.modelData.graph.forEachEdge((edgeKey, attrs, sourceId, targetId) => {
         if (attrs.edgeType !== 'property') return;

         const sourceEl = this.modelData.elementLookup.get(sourceId);
         const targetEl = this.modelData.elementLookup.get(targetId);
         if (!sourceEl || !targetEl) return;

         edges.push({
            edgeType: 'property',
            sourceItem: {
               id: sourceId,
               displayName: sourceEl.name,
               typeDisplayName: this.getTypeDisplayName(sourceEl.type),
               color: this.getColorForItemType(sourceEl.type),
               panelPosition: 'left',  // Source always on left of edge
               panelId: ''  // Filled by LayoutManager
            },
            targetItem: {
               id: targetId,
               displayName: targetEl.name,
               typeDisplayName: this.getTypeDisplayName(targetEl.type),
               color: this.getColorForItemType(targetEl.type),
               panelPosition: 'right',  // Target always on right of edge
               panelId: ''  // Filled by LayoutManager
            },
            label: attrs.label,
            inheritedFrom: attrs.inheritedFrom
         });
      });

      return edges;
   }
   // [sg] stuff below is meant to replace getAllEdgesForLinking; check for problems
   //      but with this, we don't even have to go to Element at this point

   // maintain a list of all currently displayed items
   // can be populated in Section maybe?
   currentlyDisplayedItems = new Map<string, ItemInfo> // send to Section for populating?
   currentEdgeIds = new Set<string>
   currentEdges = new Map<string, EdgeInfo>
   getEdgesForDisplayedItems(items: ItemInfo[]): EdgeInfo[] {
       this.currentlyDisplayedItems.values().forEach((item: ItemInfo) => {
           const eids: string[] = graph.edges(item.id)
           eids.forEach(edgeId => this.currentEdgeIds.add(edgeId))
       })
       const edges: EdgeInfo[] = Array.from(this.currentEdgeIds.values().map((edgeId) => {
           const sourceId = graph.source(edgeId)
           const targetId = graph.target(edgeId)
           if (!(this.currentlyDisplayedItems.has(sourceId) && this.currentlyDisplayedItems.has(targetId))) {
               return
           }
           const sourceItem = this.currentlyDisplayedItems.get(sourceId)
           const targetItem = this.currentlyDisplayedItems.get(targetId)
           const edge: EdgeInfo = {
               edgeType: graph.getEdgeAttributes(edgeId),
               sourceItem,
               targetItem,
               label: notSure, // edgeId? something else?
               id: edgeId, // EdgeInfo ought to have an id field, right?
               inheritedFrom: notSure
           }
           return edge
       })).filter(e => e) // get rid of nulls from returning nothing
       return edges
   }
}
```

**Testing:**
- Verify all property edges returned
- Verify class→slot and slot→range both present (two edges per attribute)
- Verify associated_visit → 18 edges (one per class using it)
- Verify self-refs work (sourceId === targetId)

---

### Phase 2: Fill panelId in LayoutManager

**Goal:** Map items to physical panels, fill in panelId fields

```typescript
// In LayoutManager
const fillPanelIds = (
  edges: EdgeInfoProposal[],
  leftSections: string[],
  middleSections: string[],
  rightSections: string[]
): EdgeInfoProposal[] => {
  // Build map: itemId → physical panelId
  const itemIdToPanelId = new Map<string, 'left' | 'middle' | 'right'>();

  // Get all items in each physical panel
  [
    { sections: leftSections, panelId: 'left' as const },
    { sections: middleSections, panelId: 'middle' as const },
    { sections: rightSections, panelId: 'right' as const }
  ].forEach(({ sections, panelId }) => {
    sections.forEach(typeId => {
      const itemNames = dataService.getItemNamesForType(typeId);
      itemNames.forEach(itemName => {
        itemIdToPanelId.set(itemName, panelId);
      });
    });
  });

  // Fill in panelId for each edge
  return edges
    .map(edge => ({
      ...edge,
      sourceItem: {
        ...edge.sourceItem,
        panelId: itemIdToPanelId.get(edge.sourceItem.id) || ''
      },
      targetItem: {
        ...edge.targetItem,
        panelId: itemIdToPanelId.get(edge.targetItem.id) || ''
      }
    }))
    .filter(edge =>
      // Only keep edges where both items are visible
      edge.sourceItem.panelId && edge.targetItem.panelId
    );
};

// Usage in LayoutManager render
const allEdges = dataService.getAllEdgesForLinking();
const edgesWithPanelIds = fillPanelIds(
  allEdges,
  leftSections,
  middleSections,
  rightSections
);

// Pass to LinkOverlay(s)
{middlePanelEmpty ? (
  <LinkOverlay
    edges={edgesWithPanelIds}
    leftPanelId="left"
    rightPanelId="right"
    hoveredItem={hoveredItem}
  />
) : (
  <>
    <LinkOverlay
      edges={edgesWithPanelIds}
      leftPanelId="left"
      rightPanelId="middle"
      hoveredItem={hoveredItem}
    />
    <LinkOverlay
      edges={edgesWithPanelIds}
      leftPanelId="middle"
      rightPanelId="right"
      hoveredItem={hoveredItem}
    />
  </>
)}
```

---

### Phase 3: Simplify LinkOverlay

**Goal:** Pure rendering component, filters edges, finds DOM nodes, renders SVG

```typescript
interface LinkOverlayProps {
  edges: EdgeInfoProposal[];
  leftPanelId: 'left' | 'middle' | 'right';
  rightPanelId: 'left' | 'middle' | 'right';
  hoveredItem?: ItemHoverData | null;
}

function LinkOverlay({ edges, leftPanelId, rightPanelId, hoveredItem }: LinkOverlayProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredLinkKey, setHoveredLinkKey] = useState<string | null>(null);

  // Filter to only edges connecting OUR two panels
  const myEdges = edges.filter(edge => {
    // Check if this edge connects our panels
    const connectsMyPanels =
      (edge.sourceItem.panelPosition === 'left' && edge.sourceItem.panelId === leftPanelId &&
       edge.targetItem.panelPosition === 'right' && edge.targetItem.panelId === rightPanelId);

    // Also include self-refs if in one of our panels
    const isSelfRefInMyPanel =
      edge.sourceItem.id === edge.targetItem.id &&
      (edge.sourceItem.panelId === leftPanelId || edge.sourceItem.panelId === rightPanelId);

    return connectsMyPanels || isSelfRefInMyPanel;
  });

  // Helper: Find DOM element (using id + panelId per your note - no type needed)
  const findItem = (itemId: string, panelId: string): HTMLElement | null => {
    return document.querySelector(
      `[data-item-name="${itemId}"][data-panel-position="${panelId}"]`
    );
  };

  return (
    <svg ref={svgRef} className="absolute inset-0 pointer-events-none" ...>
      <defs>
        {/* Gradients and markers */}
      </defs>

      {myEdges.map(edge => {
        const isSelfRef = edge.sourceItem.id === edge.targetItem.id;

        const sourceEl = findItem(edge.sourceItem.id, edge.sourceItem.panelId);
        const targetEl = findItem(edge.targetItem.id, edge.targetItem.panelId);

        if (!sourceEl || !targetEl) {
          // Per your note: log error instead of silent return
          console.error('LinkOverlay: DOM element not found', {
            sourceId: edge.sourceItem.id,
            sourcePanelId: edge.sourceItem.panelId,
            targetId: edge.targetItem.id,
            targetPanelId: edge.targetItem.panelId,
            label: edge.label
          });
          return null;
        }

        const sourceRect = sourceEl.getBoundingClientRect();
        const targetRect = targetEl.getBoundingClientRect();
        const svgRect = svgRef.current!.getBoundingClientRect();

        // Generate path
        const path = isSelfRef
          ? generateSelfRefPath(sourceRect, svgRect)
          : generateBezierPath(sourceRect, targetRect, svgRect);

        const linkKey = `${edge.sourceItem.id}-${edge.targetItem.id}-${edge.label || ''}`;
        const isHovered = hoveredLinkKey === linkKey ||
          matchesHoveredItem(edge, hoveredItem);

        return (
          <path
            key={linkKey}
            d={path}
            stroke={getGradient(edge.sourceItem.color, edge.targetItem.color)}
            opacity={isHovered ? 1.0 : 0.2}
            strokeWidth={isHovered ? 3 : 2}
            markerEnd={isSelfRef ? undefined : getArrow(edge.targetItem.color, isHovered)}
            onMouseEnter={() => setHoveredLinkKey(linkKey)}
            onMouseLeave={() => setHoveredLinkKey(null)}
          />
        );
      })}
    </svg>
  );
}
```

**Key points:**
- ✅ Uses id + panelId to find elements (no type needed)
- ✅ Logs console.error when elements not found
- ✅ Filters to only edges connecting its panels
- ✅ No DataService dependency
- ✅ No section/type logic
- ✅ ~150 lines vs current ~500

---

### Phase 4: Self-referential links

**Goal:** Circular arrows for items that reference themselves

```typescript
function generateSelfRefPath(itemRect: DOMRect, svgRect: DOMRect): string {
  // Adjust rect to SVG coordinates
  const x = itemRect.right - svgRect.left;
  const y = itemRect.top + itemRect.height / 2 - svgRect.top;
  const radius = 20;

  // Circular arrow looping from right edge
  return `
    M ${x} ${y}
    C ${x + radius} ${y}, ${x + radius} ${y - radius}, ${x} ${y - radius}
    A ${radius} ${radius} 0 1 1 ${x} ${y + radius}
    C ${x + radius} ${y + radius}, ${x + radius} ${y}, ${x} ${y}
  `;
}
```

---

## Benefits

1. **Uses your proposal directly** - No "simplifications" that lose the design
2. **Logical/physical separation** - Clean abstraction
3. **Fixes all bugs:**
   - ✅ Slots→ranges render (graph has all edges)
   - ✅ Vertical positioning correct (finds actual DOM elements)
   - ✅ Duplicate edges shown (18 edges for associated_visit)
   - ✅ Class→class correct direction (filtered properly)
   - ✅ Self-refs implemented
4. **Simpler code** - ~150 line LinkOverlay vs ~500 current
5. **Better errors** - Console logs when elements not found

---

## Open Questions for You

1. **Edge retrieval**: You mentioned "i haven't totally thought through how edge data should be retrieved" - does the `getAllEdgesForLinking()` approach look reasonable? Any concerns with querying the graph directly?

2. **ItemInfoProposal.panelId type**: Should this be actual DOM IDs (need to add `id` attributes to panels) or keep using data-panel-position attribute?

3. **Should we include inheritance/variable_mapping edges** or only property edges (current plan)?

4. **EdgeInfoProposal location**: Keep in Element.ts or move to ComponentData.ts?

---

## Next Steps

1. **Review this plan** - Confirm it uses your proposal correctly
2. **Answer open questions**
3. **Implement Phase 1** - getAllEdgesForLinking()
4. **Implement Phase 2** - fillPanelIds in LayoutManager
5. **Implement Phase 3** - New LinkOverlay
6. **Implement Phase 4** - Self-refs
7. **Test and migrate** - Replace old LinkOverlay

---

## Files to Modify

- `src/models/Element.ts` - Already has EdgeInfoProposal/ItemInfoProposal
- `src/services/DataService.ts` - Add getAllEdgesForLinking()
- `src/components/LayoutManager.tsx` - Add fillPanelIds(), update LinkOverlay calls
- `src/components/LinkOverlay.tsx` - Complete rewrite using new props
- `src/contracts/ComponentData.ts` - Export EdgeInfoProposal/ItemInfoProposal?
