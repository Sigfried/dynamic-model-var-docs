# Tasks

> **Active planning document** - Completed work archived to [docs/archive/tasks.md](docs/archive/tasks.md)
>
> **Development principles** - See [CLAUDE.md](CLAUDE.md) for architectural rules and workflow

---

## 📋 Upcoming Work (Ordered by Priority)

### Grouped/Collapsible Floating Panels ✅ **COMPLETE**

**Goal**: Two group containers (Details, Relationships) with collapsible item boxes.

**Completed**:
- [x] Phases 1-4: Grouped floating panels with drag/resize
- [x] Hover highlight: When hovering item with open box, highlight box + dim others + auto-expand
- [x] Phase 5: Popout window support via `window.open()` + postMessage

**Known issues** (tolerated for now):
- Transitory box uses `pointer-events: none`, so hovering items behind it triggers new previews
- [sg] URL state for open boxes doesn't distinguish details from relationships (reload turns relationship boxes into detail boxes)
- Popout: if main window is at right edge of screen, popout may overlap and hide behind it (could improve positioning logic)
- Popout: browsers may not honor request to keep focus on main window after opening popout

---

### [sg] Improve main panel layout
- Gutters between panels could shrink - use `justify-content: space-between` instead of hardcoded gap widths
- Gutters need minimum width for links to be visible
- When viewport too narrow, allow horizontal scrolling

### LinkOverlay fixes
- Edge labels: show on hover; tooltip display needs improvement

### URLs as clickable links
- Display URIs as clickable links in detail panels
- Infrastructure already set up

### Item names as hover/links
- In detail and relationship boxes, make all item references act like panel items

---

## 📚 Larger Refactoring Tasks

### Reduce Element subclass code
- Most behavior should move to graph queries
- Element classes become thinner wrappers around graph data
- **Blocked by**: Abstract Tree system
- See [detailed plan](#reduce-element-subclass-code-details) below

### Abstract Tree Rendering System
- Extract tree rendering and expansion logic from Element
- Enables consistent tree UX across Elements panel and info boxes
- See [detailed plan](#abstract-tree) below

### Enum inheritance and other fields
- LinkML enums use `inherits` field (not `is_a` like classes)
- Currently dataLoader/Element ignores enum `inherits` and other fields
- Need to audit EnumInput for all fields and surface in UI

### Grouped Slots Panel
- Display slots grouped by Global + per-class sections
- Show inheritance (inherited vs defined here vs overridden)
- Visual indicators for slot origin
- **Uses**: Abstract Tree system for rendering

---

## 🔧 Medium Priority

### Overhaul Badge Display System
- Show multiple counts per element (e.g., "103 vars, 5 enums, 2 slots")
- Add labels or tooltips to clarify what counts mean

### Detail Panel Enhancements
- Show reachable_from info for enums
- Show inheritance
- Slot order: Inherited slots at top

### Change "attribute" to "slot" terminology
- Throughout codebase

### Condition/DrugExposure Variable Display
- Show message that these are handled as records, not specific variables

---

## 🔮 Low Priority / Future Ideas

### Search and Filter
- Search: Important for exploring large schemas
- Filtering: Grouping provides a lot already

### LayoutManager rename
- No longer about "whitespace monitoring" - it's now MainLayout/AppLayout
- Consider renaming to better reflect current purpose

### Animation library
- Fix funkiness in interactions including link movement with scrolling

### Viewport culling for links
- Don't show links when both endpoints off screen

### Responsive panel widths
- Currently fixed: MAX_PANEL_WIDTH=450px, EMPTY_PANEL_WIDTH=180px

### Relationship Info Box - Keyboard navigation

### Neighborhood Zoom + Feature Parity with Official Docs
- See archived REFACTOR_PLAN for full details

---

## 📝 Detailed Plans

<a id="reduce-element-subclass-code-details"></a>
### Reduce Element Subclass Code - Details

**Implementation Plan:**
1. Simplify `getDetailData()` via tree abstraction (BLOCKED: needs Abstract Tree)
2. Move tree methods to Abstract Tree system
3. Consolidate flat collections (Enum, Type, Slot)
4. Simplify Element subclass constructors
5. Graph as primary for relationship queries (partially done)
6. Fix remaining "DTO" terminology in codebase

**Target state:**
- Element subclasses: ~30-50 lines each
- Presentation logic: components layer
- Tree logic: Abstract Tree system
- Relationship queries: Graph module

<a id="abstract-tree"></a>
### Abstract Tree Rendering System - Details

**Goal**: Extract tree rendering and expansion logic from Element into reusable abstractions.

**Current state**:
- Element class has tree capabilities (parent, children, traverse, ancestorList)
- Expansion state managed by useExpansionState hook
- Tree rendering handled in each component

**Proposed abstraction**:
- Create parent class or mixin with tree capabilities
- Element becomes a child of this abstraction
- Info box data structures as tree nodes
- Shared rendering components/hooks

**Key insight**: All presentation data should be tree-shaped.

**Methods to extract from Element:**
- `toRenderableItems()` - tree → flat list with expansion
- `toSectionItems()` - tree → SectionItemData list
- `getSectionItemData()` - single element → SectionItemData
- `ancestorList()` - walk up parent chain
- `traverse()` - depth-first traversal

---

## 🧹 Documentation & Technical Debt

### Implement devError() utility
- Throws in development, logs quietly in production
- Replace silent `return null` patterns

### Incorporate Unused Schema Fields into UI
- Check console for "Unexpected fields" warnings
- Add to UI or document why ignored
