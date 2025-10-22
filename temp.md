# Next Steps: Phase 6 - Link Overlay Component

## Context
See CLAUDE.md for full implementation context and architecture decisions.

## Current Status
- ✅ Element architecture complete (ClassElement, EnumElement, SlotElement, VariableElement)
- ✅ All panel sections have data-element-type and data-element-name attributes
- ✅ Element.getRelationships() implemented for all element types
- ✅ Element.getBoundingBox() can locate elements via unique IDs

## Objective
Create LinkOverlay component to draw SVG connections between related elements across panels.

## Implementation Steps

### 1. Create LinkOverlay.tsx Component
Create `src/components/LinkOverlay.tsx` with:
- SVG overlay positioned absolutely over PanelLayout
- Track element positions using `document.querySelectorAll('[data-element-type]')`
- Use ResizeObserver to update positions on layout changes
- Listen to scroll events to update positions

### 2. Compute Links
- Query all visible elements with data attributes
- For each element, call `Element.getRelationships()` to get relationship data
- Build list of ComputedLink objects with source/target positions
- Filter out links where either end is not visible

### 3. Render SVG Paths
- Draw bezier curves between source and target positions
- Color code by relationship type:
  - Inheritance (`is_a`): one color
  - Property references: another color
  - Enum usage: another color
- Default opacity: 0.2-0.3
- Hover opacity: 1.0
- Add arrowheads with SVG markers

### 4. Interactions
- On hover over link: increase opacity
- On hover over element: highlight all connected links
- On click: navigate to linked element (open dialog)

### 5. Performance
- Only render links for elements in viewport (viewport culling)
- For elements scrolled out of view, show partial links to panel edge
- Use dashed stroke for partial links
- Debounce position updates

### 6. Integration
- Add LinkOverlay to PanelLayout.tsx
- Pass necessary props: classHierarchy, enums, slots, variables
- Ensure z-index layering is correct (links below dialogs, above panels)

## Self-Referential Links (Phase 7)
Defer to next step. These should be rendered as looping curves inline within the element, not in LinkOverlay.

## Testing Checklist
- [ ] Links appear between related elements
- [ ] Links update when panels scroll
- [ ] Links update when panels resize
- [ ] Hover interactions work
- [ ] Performance is acceptable with all sections visible
- [ ] Links are color-coded correctly
- [ ] Partial links show when elements scroll out of view

## Files to Create
- `src/components/LinkOverlay.tsx`

## Files to Modify
- `src/components/PanelLayout.tsx` - add LinkOverlay component
- `src/App.tsx` - pass data to LinkOverlay if needed

## Notes
- Start with simple straight lines, then enhance to bezier curves
- Can add link type filters later
- Can add toggle to show/hide links later
