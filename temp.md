# temp.md - Current Session Notes

> **Quick reference for immediate next steps**
> See CLAUDE.md for complete architecture and implementation history

---

## Current Task: Phase 3e - Adaptive Detail Panel Display

### Goal
Improve detail display by adapting to available screen space:
- **Wide screens (≥600px empty)**: Stack detail panels vertically in the right space
- **Narrow screens (<600px)**: Use current draggable DetailDialog system

### Requirements

**1. Measure Available Space**
- Calculate empty horizontal space after left panel, gutter, and right panel
- Recalculate on window resize
- Threshold: 600px

**2. Stacked Panel Mode (when space available)**
- Display details as fixed panels in the right space
- Stack vertically with newest at top
- Scrollable if total height exceeds viewport
- Not draggable/resizable (fixed in layout)

**3. Dialog Mode (when space limited)**
- Use current DetailDialog implementation
- Draggable and resizable
- Positioned freely by user

**4. Duplicate Prevention**
Currently allows opening same element multiple times. Fix by choosing one approach:
- **Option A**: If element already open, bring that panel/dialog to top
- **Option B**: Create new panel/dialog but close the old duplicate

### Implementation Steps

1. Add `useEffect` to measure available space on mount and resize
2. Add state for display mode: `'stacked' | 'dialog'`
3. Create `DetailPanelStack` component for stacked mode
4. Modify `handleOpenDialog` to:
   - Check if element already open (compare type + name)
   - If duplicate: bring to top OR close old one
   - Use stacked panel when space available, dialog otherwise
5. Update PanelLayout or App to render DetailPanelStack when in stacked mode
6. Test transition between modes on window resize

### Design Decisions to Consider

- Should stacked panels persist position in URL like dialogs?
  - Probably not - they're auto-positioned
- How to handle transition when resizing across threshold?
  - Convert dialogs → stacked panels smoothly
  - Preserve order (dialog z-index → stack position)
- Close button behavior in stacked mode?
  - Same as dialog mode - remove from openDialogs array

---

## Quick Commands

```bash
# Run tests
npm test              # Watch mode
npm test -- --run     # Single run

# Dev server
npm run dev

# Type check
npm run build
```

---

## Notes from Previous Session (Phase 3d)

Phase 3d (SVG Link Visualization) is now complete with all bugs fixed:
- ✅ Scrolling works (added `h-full` to panels, `flex` to main content)
- ✅ Icon order consistent (C E S V in both panels)
- ✅ Link positioning accurate (SVG coordinate adjustment)
- ✅ Dynamic section ordering (most recent at top)
- ✅ Links redraw on section changes (`requestAnimationFrame`)
- ✅ All 67 tests passing

See CLAUDE.md § Phase 3d for complete implementation details.
