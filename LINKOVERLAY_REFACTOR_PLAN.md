# LinkOverlay Refactor Plan - DRAFT FOR REVIEW

**Status:** Awaiting approval before implementation
**Related:** UI_REFACTOR.md Section 1, Element.ts lines 132-156

---

## Current Problems

1. **Architecture issues:**
   - LinkOverlay has too many responsibilities (querying data, filtering, finding items, positioning)
   - Tight coupling to sections and panel concepts
   - Complex logic in useMemo for building links
   - Uses old relationship format instead of graph-based edges

2. **Rendering bugs:**
   - No links from slots → ranges in 3-panel mode
   - Vertical endpoints misaligned (range_high connects to wrong class)
   - Duplicate slot usage not shown (associated_visit used by 18 classes, only 1 link shown)
   - Class→class links going left→left instead of left→right in 2-panel mode
   - Self-referential links not implemented (should be circular arrows)

3. **Forgotten work from Stage 3:**
   - Steps 4-5 completed (getRelationshipsFromGraph, getRelationshipsNew in DataService)
   - **Step 6 NOT done:** Migrate UI components to use new format
   - **Step 7 NOT done:** Clean up after migration
   - getAllPairs() stubbed but not implemented

---

## Proposed Architecture

### Separation of Concerns

**LayoutManager (parent):**
- Knows which items are in which physical panels
- Computes edge data with panel information
- Passes ready-to-render edge list to LinkOverlay
- Responsible for: data fetching, filtering, panel logic

**LinkOverlay (child):**
- Receives pre-computed edge data with all necessary info
- Only responsible for: SVG rendering, hit detection, hover state
- No knowledge of: sections, types, relationships, DataService
- Pure rendering component

---

## New Interface Design

Based on Element.ts proposal (lines 132-156) with refinements:

```typescript
/**
 * EdgeForRendering - Complete edge data for LinkOverlay rendering
 * Computed by LayoutManager, consumed by LinkOverlay
 */
export interface EdgeForRendering {
  // Identity
  key: string;  // Unique key for React (e.g., "slot-associated_visit-MeasurementObservation")

  // Source item
  sourceId: string;
  sourceName: string;
  sourceType: string;
  sourceColor: string;
  sourcePanelId: string;  // DOM panel ID where source item lives

  // Target item
  targetId: string;
  targetName: string;
  targetType: string;
  targetColor: string;
  targetPanelId: string;  // DOM panel ID where target item lives

  // Edge metadata
  edgeType: 'inheritance' | 'property' | 'variable_mapping';
  label?: string;  // Slot/attribute name for property edges
  isSelfRef: boolean;  // true if source === target (render as circular arrow)
}

/**
 * LinkOverlay - Pure SVG rendering component
 */
interface LinkOverlayProps {
  edges: EdgeForRendering[];
  hoveredItem?: ItemHoverData | null;
}
```

---

## Implementation Steps

### Phase 1: Implement getAllPairs() in DataService

**Goal:** Get all edges from graph with basic metadata (no panel info yet)

```typescript
class DataService {
  /**
   * Get all property edges for rendering as links
   * Returns edges with item IDs and colors, but no panel positions
   */
  getAllPairs(): EdgeForRendering[] {
    const edges: EdgeForRendering[] = [];

    // Query graph for all property edges
    this.modelData.graph.forEachEdge((edge, attrs, source, target) => {
      if (attrs.edgeType !== 'property') return; // Skip inheritance, variable_mapping

      const sourceElement = this.modelData.elementLookup.get(source);
      const targetElement = this.modelData.elementLookup.get(target);
      if (!sourceElement || !targetElement) return;

      edges.push({
        key: `${attrs.label || 'prop'}-${source}-${target}`,
        sourceId: source,
        sourceName: sourceElement.name,
        sourceType: sourceElement.type,
        sourceColor: this.getColorForItemType(sourceElement.type),
        sourcePanelId: '', // Filled in by LayoutManager
        targetId: target,
        targetName: targetElement.name,
        targetType: targetElement.type,
        targetColor: this.getColorForItemType(targetElement.type),
        targetPanelId: '', // Filled in by LayoutManager
        edgeType: 'property',
        label: attrs.label,
        isSelfRef: source === target
      });
    });

    return edges;
  }
}
```

**Testing:**
- Verify all property edges returned
- Verify each class→slot→range becomes TWO edges (class→slot, slot→range)
- Verify duplicate slots create multiple edges (associated_visit → 18 edges)
- Verify self-refs detected correctly

---

### Phase 2: Enhance edges with panel info in LayoutManager

**Goal:** LayoutManager knows panel layout, adds panel IDs to edges

```typescript
// In LayoutManager
const enhanceEdgesWithPanelInfo = (
  edges: EdgeForRendering[],
  leftSections: string[],
  middleSections: string[],
  rightSections: string[]
): EdgeForRendering[] => {
  // Build lookup: itemType → panelId
  const typeToPanelId = new Map<string, string>();
  leftSections.forEach(type => typeToPanelId.set(type, 'left'));
  middleSections.forEach(type => typeToPanelId.set(type, 'middle'));
  rightSections.forEach(type => typeToPanelId.set(type, 'right'));

  return edges.map(edge => ({
    ...edge,
    sourcePanelId: typeToPanelId.get(edge.sourceType) || '',
    targetPanelId: typeToPanelId.get(edge.targetType) || ''
  }))
  .filter(edge =>
    // Only keep edges where both items are visible in panels
    edge.sourcePanelId && edge.targetPanelId
  );
};

// Usage when middle panel hidden (2-panel mode)
const allEdges = dataService.getAllPairs();
const visibleEdges = enhanceEdgesWithPanelInfo(
  allEdges,
  leftSections,
  [],  // middle empty
  rightSections
);

// Usage when middle panel visible (3-panel mode)
const allEdges = dataService.getAllPairs();
const visibleEdges = enhanceEdgesWithPanelInfo(
  allEdges,
  leftSections,
  middleSections,
  rightSections
);
```

**Testing:**
- Verify panel IDs assigned correctly
- Verify edges filtered when items not visible
- Verify works in both 2-panel and 3-panel modes

---

### Phase 3: Simplify LinkOverlay to pure rendering

**Goal:** LinkOverlay only renders lines, no data logic

```typescript
function LinkOverlay({ edges, hoveredItem }: LinkOverlayProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredLinkKey, setHoveredLinkKey] = useState<string | null>(null);
  const [tooltipData, setTooltipData] = useState<TooltipData | null>(null);

  // Helper: find DOM element by type, name, and panel ID
  const findItem = (type: string, name: string, panelId: string) => {
    return document.querySelector(
      `[data-item-type="${type}"][data-item-name="${name}"][data-panel-position="${panelId}"]`
    );
  };

  // Render each edge
  return (
    <svg ref={svgRef} className="absolute inset-0 pointer-events-none" ...>
      <defs>
        {/* Gradients and arrow markers */}
      </defs>

      {edges.map(edge => {
        const sourceEl = findItem(edge.sourceType, edge.sourceName, edge.sourcePanelId);
        const targetEl = findItem(edge.targetType, edge.targetName, edge.targetPanelId);

        if (!sourceEl || !targetEl) return null;

        const sourceRect = sourceEl.getBoundingClientRect();
        const targetRect = targetEl.getBoundingClientRect();

        // Generate path (self-ref gets circular arrow)
        const path = edge.isSelfRef
          ? generateSelfRefPath(sourceRect)
          : generateBezierPath(sourceRect, targetRect);

        const isHovered = hoveredLinkKey === edge.key ||
          matchesHoveredItem(edge, hoveredItem);

        return (
          <path
            key={edge.key}
            d={path}
            stroke={getGradientId(edge.sourceColor, edge.targetColor)}
            opacity={isHovered ? 1.0 : 0.2}
            strokeWidth={isHovered ? 3 : 2}
            markerEnd={edge.isSelfRef ? undefined : getArrowMarkerId(edge.targetColor, isHovered)}
            onMouseEnter={() => setHoveredLinkKey(edge.key)}
            onMouseLeave={() => setHoveredLinkKey(null)}
          />
        );
      })}

      {tooltipData && <LinkTooltip {...tooltipData} />}
    </svg>
  );
}
```

**Key simplifications:**
- No useMemo with complex link building logic
- No section filtering or cross-panel logic
- No relationship queries to DataService
- Just: receive edges, find DOM elements, draw lines

**Testing:**
- Verify all edges render in 2-panel mode
- Verify all edges render in 3-panel mode (classes→slots, slots→ranges)
- Verify self-refs render as circular arrows
- Verify vertical positioning correct (endpoints on correct classes)
- Verify hover highlights work
- Verify tooltips show correct info

---

### Phase 4: Implement self-referential links

**Goal:** Classes that reference themselves get circular arrow

```typescript
// New helper function in LinkOverlay
function generateSelfRefPath(itemRect: DOMRect): string {
  // Circular arrow from right edge, curving out and back
  const cx = itemRect.right;
  const cy = itemRect.top + itemRect.height / 2;
  const radius = 20;

  // SVG arc: start at right edge, curve out, arc around, come back to right edge below
  return `
    M ${cx} ${cy}
    L ${cx + radius} ${cy}
    A ${radius} ${radius} 0 1 1 ${cx + radius} ${cy + radius * 2}
    L ${cx} ${cy + radius}
  `;
}
```

**Testing:**
- Find classes with self-refs (e.g., parent: Specimen)
- Verify circular arrow renders from item to itself
- Verify arrow doesn't occlude item text
- Verify hover works on circular arrows

---

## Migration Strategy

1. **Create new implementations alongside old:**
   - Add getAllPairs() to DataService (don't remove getRelationshipsForLinking yet)
   - Create new simplified LinkOverlay as LinkOverlayNew.tsx
   - Keep old LinkOverlay.tsx working

2. **Test in parallel:**
   - Render both overlays simultaneously with `display: none` on new one
   - Console.log to compare edge counts
   - Visually inspect both (toggle display)

3. **Switch over:**
   - Once new version working, switch LayoutManager to use it
   - Remove old LinkOverlay.tsx
   - Remove getRelationshipsForLinking from DataService

4. **Clean up:**
   - Remove unused link building helpers (buildLinks, etc.)
   - Remove old relationship format support

---

## Benefits

1. **Fixes all current bugs:**
   - ✅ Slots→ranges render (graph has all edges)
   - ✅ Vertical positioning correct (edges point to actual users, not first alphabetically)
   - ✅ Duplicate edges shown (graph has one edge per usage)
   - ✅ Class→class correct direction (graph edges have explicit direction)
   - ✅ Self-refs implemented (detected by sourceId === targetId)

2. **Simpler architecture:**
   - LinkOverlay becomes ~200 lines instead of ~500
   - No complex filtering logic
   - No section/panel logic in rendering layer
   - Clear separation of concerns

3. **Performance:**
   - getAllPairs() computed once, cached
   - No per-panel loops in useMemo
   - Graph queries are O(1) lookups

4. **Maintainability:**
   - Easy to add new edge types (just add to graph)
   - Easy to filter edges (filter EdgeForRendering[] in LayoutManager)
   - Easy to style edges (all metadata in EdgeForRendering)
   - Easy to debug (can console.log edges array)

---

## Open Questions

1. **Should EdgeForRendering live in Element.ts or ComponentData.ts?**
   - Pro Element.ts: Related to EdgeInfo
   - Pro ComponentData.ts: UI-specific interface
   - **Recommendation:** ComponentData.ts (it's for UI rendering, not model data)

2. **Should getAllPairs() return all edge types or just property?**
   - Current plan: Only property (inheritance/variable_mapping shown in detail views)
   - Alternative: Return all, let LayoutManager filter
   - **Recommendation:** Just property (follows UI_REFACTOR.md design note line 114)

3. **How to handle hover state coupling?**
   - Problem: hoveredItem needs to match against edge source/target
   - Current: Pass ItemHoverData, LinkOverlay matches
   - Better?: Pass hoveredItemId, simpler matching
   - **Recommendation:** Keep ItemHoverData for now, revisit after this refactor

4. **Should we rename panels to have DOM IDs?**
   - Current: data-panel-position="left|middle|right"
   - Proposal: Add id="panel-left" to panel divs
   - Benefit: More explicit querying
   - **Recommendation:** Not necessary, data-panel-position works fine

---

## Timeline Estimate

- **Phase 1 (getAllPairs):** 1-2 hours
  - Implement in DataService
  - Write tests
  - Verify edge counts

- **Phase 2 (enhance edges):** 1 hour
  - Add helper in LayoutManager
  - Test 2-panel and 3-panel modes

- **Phase 3 (new LinkOverlay):** 2-3 hours
  - Write new component
  - Test all rendering cases
  - Fix any positioning issues

- **Phase 4 (self-refs):** 1 hour
  - Implement circular arrow path
  - Test and adjust styling

- **Migration/cleanup:** 1 hour
  - Switch over
  - Remove old code
  - Update docs

**Total: 6-8 hours**

---

## Next Steps

1. **Review this plan** - Get approval on architecture
2. **Implement Phase 1** - getAllPairs() with tests
3. **Implement Phase 2** - Panel enhancement logic
4. **Implement Phase 3** - New LinkOverlay component
5. **Implement Phase 4** - Self-referential links
6. **Migrate and clean up** - Remove old code

---

## Related Files

- `src/models/Element.ts` - EdgeInfo interfaces, proposal at lines 132-156
- `src/services/DataService.ts` - getAllPairs() stubbed at line 218
- `src/components/LinkOverlay.tsx` - Current implementation (to be replaced)
- `src/components/LayoutManager.tsx` - Will call new APIs
- `UI_REFACTOR.md` - Section 1 (LinkOverlay Refactor)
