# LinkOverlay Refactor Plan v2 - USING YOUR PROPOSAL

**Status:** Awaiting approval before implementation
**Related:** Element.ts lines 132-156 (EdgeInfoProposal), UI_REFACTOR.md Section 1, Section 9 (Grouped Slots Panel)

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


## PREREQUISITE: Add Class→Slot and Slot→Range Edges to Graph

**Problem:** Current graph only has Class→Range edges (with slot metadata). For 3-panel layout, we need separate Class→Slot and Slot→Range edges.

**Current:**
```
MeasurementObservation --[slotName: range_high]--> Quantity
(Single edge of type 'slot')
```

**What we're adding:**
```
1. MeasurementObservation --> range_high  (NEW: Class→Slot edge)
2. range_high --> Quantity                (NEW: Slot→Range edge)
3. MeasurementObservation --[range_high]--> Quantity  (KEEP: existing edge)
```

**Implementation:**

1. **Modify Graph.ts edge types:**
   ```typescript
   export type EdgeType = 'inheritance' | 'slot' | 'maps_to' | 'class_to_slot' | 'slot_to_range';

   export interface ClassToSlotEdgeAttributes extends BaseEdgeAttributes {
     type: 'class_to_slot';
     slotName: string;
     slotDefId: string;
     required: boolean;
     multivalued: boolean;
     inheritedFrom?: string;
   }

   export interface SlotToRangeEdgeAttributes extends BaseEdgeAttributes {
     type: 'slot_to_range';
     slotName: string;  // For reference
   }
   ```

2. **Add helper functions in Graph.ts:**
   ```typescript
   export function addClassToSlotEdge(
     graph: SchemaGraph,
     classId: string,
     slotDefId: string,
     slotName: string,
     required: boolean,
     multivalued: boolean,
     inheritedFrom?: string
   ): void {
     const edgeKey = `${classId}-->${slotDefId}`;
     graph.addEdgeWithKey(edgeKey, classId, slotDefId, {
       type: 'class_to_slot',
       slotName,
       slotDefId,
       required,
       multivalued,
       inheritedFrom
     });
   }

   export function addSlotToRangeEdge(
     graph: SchemaGraph,
     slotDefId: string,
     rangeId: string,
     slotName: string
   ): void {
     const edgeKey = `${slotDefId}-->${rangeId}`;
     // Use { multi: false } to prevent duplicates (same slot→range from multiple classes)
     if (!graph.hasEdge(slotDefId, rangeId)) {
       graph.addEdgeWithKey(edgeKey, slotDefId, rangeId, {
         type: 'slot_to_range',
         slotName
       });
     }
   }
   ```

3. **Modify buildGraphFromSchemaData() in Graph.ts:**
   ```typescript
   // 2. Slot edges - THREE edges per class attribute:
   // - Class → Range (existing, keep for backward compat)
   // - Class → Slot (NEW)
   // - Slot → Range (NEW, deduplicated)

   // Track which Slot→Range edges we've already added
   const addedSlotToRange = new Set<string>();

   schemaData.classes.forEach((classData) => {
     if (classData.attributes) {
       Object.entries(classData.attributes).forEach(([attrName, attrDef]) => {
         const range = attrDef.range || 'string';
         const slotDefId = attrDef.slotId;

         // Existing Class→Range edge (KEEP)
         addSlotEdge(
           graph,
           classData.name,
           range,
           attrName,
           slotDefId,
           attrDef.required ?? false,
           attrDef.multivalued ?? false,
           attrDef.inherited_from
         );

         // NEW: Class→Slot edge
         addClassToSlotEdge(
           graph,
           classData.name,
           slotDefId,
           attrName,
           attrDef.required ?? false,
           attrDef.multivalued ?? false,
           attrDef.inherited_from
         );

         // NEW: Slot→Range edge (deduplicated)
         const slotRangeKey = `${slotDefId}-->${range}`;
         if (!addedSlotToRange.has(slotRangeKey)) {
           addSlotToRangeEdge(graph, slotDefId, range, attrName);
           addedSlotToRange.add(slotRangeKey);
         }
       });
     }
   });
   ```

4. **Current Workaround ("fudge"):**
   - Multiple classes using `range_high` all point to same slot definition node
   - Example:
     ```
     MeasurementObservation --> range_high
     SdohObservation --> range_high
     (Both point to same range_high node)
     ```

5. **Future (Grouped Slots - later):**
   - Create per-class slot nodes (e.g., `range_high#MeasurementObservation`)
     - [sg] i think we are currently using - or _ as the special slot/class id delimiters.
            i don't care, as long as it stays consistent
   - Each class gets its own slot instance
   - No more convergence on shared nodes

**Testing:**
- Verify Class→Slot edges exist for all attributes
- Verify Slot→Range edges deduplicated (one per unique slot/range pair)
- Verify existing Class→Range edges still present
- Verify graph edge counts correct

---

## Current Problems

Same as v1, but now properly addressing them with your EdgeInfoProposal design.

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
