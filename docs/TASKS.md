# Tasks

## Questions & Decisions Needed

### Boss Question: Variable Treatment for Condition Class

**Context**: My boss said that "variables" for Condition should be treated differently.

**Her explanation**:
> I think I made a mistake by calling "asthma" and "angina" variables. BMI is a variable that is a Measurement observation. We can think of BMI as a column in a spreadsheet. We wouldn't have a column for "asthma" - we would have a column for conditions with a list of mondo codes for the conditions present. This becomes more important when we are talking about the "heart failure" and "heart disease" columns. Where does one draw lines? The division of conditions into variables/columns might be ok if all we're looking at is asthma and angina, but quickly gets too hard to draw lines.

**My question**: I still don't understand. Do you? Can you try to explain?

---

## Upcoming Work

Listed in intended implementation order (top = next):

### Phase 9: ✨ Give Right-Side Stacked Detail Panels Same Features as Floating Dialogs

**Goal**: Feature parity between stacked panels (wide screens) and floating dialogs (narrow screens)
**Importance**: Low - minor UX polish, not a major feature

**Missing features in stacked panels**:
- TBD: Need to compare and document differences

---

### 🔴 🪲 Fix Dark Mode Display Issues

**Goal**: Fix readability issues in dark mode
**Importance**: High - app currently unusable in dark mode

**Issues from screenshot**:
- Poor contrast/readability throughout
- Need to audit all color combinations

**Files likely affected**:
- `src/index.css` - Tailwind dark mode classes
- All component files using colors

---

### 🔒 Make element.type Private

**Goal**: Encapsulate element.type property to enforce architectural patterns

**Why**: Currently `element.type` is public, allowing direct access. This can lead to type-checking anti-patterns in view code. Making it private forces use of polymorphic methods.

**Implementation**:
1. Change `element.type` from public to private in Element base class
2. Add public `getType(): ElementTypeId` method for debugging/logging
3. Fix any broken code (if substantial breakage, reassess approach)

**Expected impact**:
- May break code that currently does `if (element.type === 'class')` checks
- Forces developers to use polymorphic methods instead
- Caught violations should be refactored to proper polymorphism

**When to do this**: After DetailPanel refactor is complete and working

---

### ✨ Enhanced Link Hover Information

**Goal**: Display richer information when hovering over links between elements

**Current state**: Links show basic info in console.log on hover (source → target with relationship)

**Desired features**:
- Tooltip or overlay showing:
  - Relationship type (is_a, property, etc.)
  - Slot name (for property relationships)
  - Source element (name + type)
  - Target element (name + type)
  - Additional metadata as appropriate

**Implementation approach**:
- Add tooltip component that follows cursor or attaches to link
- Extract relationship details from Link object
- Style appropriately to be readable but not intrusive

**Files likely affected**:
- `src/components/LinkOverlay.tsx` - Add tooltip rendering
- `src/utils/linkHelpers.ts` - May need additional metadata extraction

---

### 🔄 Split Element.tsx into Separate Files

**Current state**: Element.tsx is 919 lines with 4 element classes + 4 collection classes

**Target structure** (keep element class with its collection class in same file):
- `models/Element.ts` (base Element and ElementCollection classes)
- `models/ClassElement.ts` (ClassElement + ClassCollection)
- `models/EnumElement.ts` (EnumElement + EnumCollection)
- `models/SlotElement.ts` (SlotElement + SlotCollection)
- `models/VariableElement.ts` (VariableElement + VariableCollection)
- `models/index.ts` (barrel export)

**Benefits**:
- Each element/collection pair stays together (easier to maintain)
- Smaller, more focused files
- Easier to understand each element type in isolation

---

### 🔄 Refactor App.tsx

**Current state**: App.tsx is 600+ lines, too long

**Extract logic into hooks**:
- `hooks/useModelData.ts` - Data loading
- `hooks/useDialogState.ts` - Dialog management
- `hooks/useLayoutState.ts` - Panel layout + expansion state (consolidate useExpansionState)
- Keep App.tsx focused on composition

**Additional cleanup**:
- Consolidate expansion state: Move from useExpansionState hook into statePersistence.ts
- Remove dead code: Delete evc/ecn params from statePersistence.ts (replaced by lve/rve/lce/rce)

**Files to create**:
- `src/hooks/useModelData.ts`
- `src/hooks/useDialogState.ts`
- `src/hooks/useLayoutState.ts`

**Files to modify**:
- `src/App.tsx`
- `src/utils/statePersistence.ts`

---

### 🔄 Overhaul Badge Display System

**Goal**: Make badges more informative and clear about what counts they represent

**Current problems**:
- Badges show single counts (enum values, slot usage, variable count) but it's unclear what they mean
- Users might want to see multiple counts per element (e.g., class shows variable count but not enum/slot counts)
- No labels on badges - just numbers in colored pills

**Potential improvements**:
- Multi-badge display: Show multiple counts per element (e.g., "103 vars, 5 enums, 2 slots")
- Badge labels or tooltips: Make it clear what each number represents
- Configurable: Let users choose which counts to display
- Contextual: Different badge types for different views

**Implementation approach TBD** - Need to design before implementing

**Files likely affected**:
- `src/models/Element.tsx` - Replace simple `getBadge(): number` with richer badge info
- `src/components/Section.tsx` - Render multiple badges or labeled badges
- `src/models/RenderableItem.ts` - Update badge field to support richer info

---

## Future Ideas (Unprioritized)

### 🔴 ✨ Search and Filter

**Potential importance**: High - major usability feature for exploring large schemas

**Search functionality**:
- Search bar with full-text search across all elements
- Highlight search results in tree/sections
- Quick navigation: search results open in new dialogs

**Filter controls**:
- Checkboxes for class families
- Variable count slider
- Relationship type toggles

---

### 🟡 ✨ Neighborhood Zoom

**Potential importance**: Medium - useful for focused exploration

**Focus mode**:
- Show only k-hop neighborhood around selected element
- Relationship type filters ("show only `is_a` relationships" vs "show associations")
- Breadcrumb trail showing navigation path
- "Reset to full view" button

---

### ✨ Enhanced Element Metadata Display

Show additional relationship counts in tree view:
- **Current**: Only variable count (e.g., "Condition (20)")
- **Desired**: "Condition (20 vars, 5 enums, 2 classes, 1 slot)"

---

### ✨ Custom Preset Management

User-managed presets replacing hard-coded ones:
- Save Preset button → prompts for name
- Saves current panel configuration (sections + dialogs) to localStorage
- Display saved presets in header with remove icons

---

### ✨ Advanced Overview

Multiple view modes and analytics:
- Tree view (current)
- Network view (force-directed graph for associations)
- Matrix view (class-enum usage heatmap)
- Mini-map showing current focus area
- Statistics dashboard

---

### 📖 Terminology Consistency

**Goal**: Use consistent terminology throughout app
**Importance**: Low - internal consistency improvement

**Problem**: Still using "Property" to denote attributes and slots

**Action needed**:
- Use "Attribute" and "Slot" consistently
- Document terminology guidelines to prevent regression

**Terminology guidelines**:
- ✅ **Attribute** or **Slot** - NOT "Property"
- ✅ **Element** - NOT "Entity" (entity was old term)
- ✅ **Class**, **Enum**, **Slot**, **Variable** - Capitalize when referring to element types

**Terminology configuration**:
- It might be better for some people to see "<current class> is_a <base class>" and other people to see "<current class> inherits from <base class>". Allow that to be a (probably) user-configurable option.
- I don't know how software with internationalization capabilities handle this, or with configurable display themes, but we could try similar approaches.

---

### ✨ External Link Integration

**Goal**: Link prefixed IDs to external sites (OMOP, DUO, etc.)

**Implementation**:
- Use prefix data from bdchm.yaml
- Make CURIEs clickable in variable details
- Add tooltip showing full URL before clicking

---

### ✨ Feature Parity with Official Docs

Reference: https://rtiinternational.github.io/NHLBI-BDC-DMC-HM/

Missing features:
1. **Types** - Import and display linkml:types
2. **Dynamic enums** - Show which enums are dynamic
3. **LinkML Source** - Collapsible raw LinkML view
4. **Direct and Induced** - Show direct vs inherited slots
5. **Partial ERDs** - Visual relationship diagrams

---

### 📖 GitHub Issue Management

Issue: https://github.com/RTIInternational/NHLBI-BDC-DMC-HM/issues/126
- Make issue more concise
- Add subissues for specific features (ASK FIRST)

---

### ⚡ Performance Optimizations

When working with larger models or slower devices:
- **Virtualize long lists**: MeasurementObservation has 103 variables; consider react-window or react-virtual
- **Viewport culling for links**: Only render SVG links for visible elements
- **Animation library**: Consider react-spring for smoother transitions (current CSS transitions work fine)

---

### 📖 Review DOC_CONVENTIONS.md

**Goal**: Review DOC_CONVENTIONS.md and decide if there are parts worth keeping or integrating elsewhere
**Importance**: Low - documentation maintenance

---

### ✨ Semantic Relationship Features

**Context**: Semantic relationship patterns identified during analysis could be valuable for user-facing features

**Semantic patterns identified**:
1. **Containment/Part-of**: `parent_specimen`, `parent_container`, `part_of`
2. **Association**: `associated_participant`, `source_participant`, `performed_by`
3. **Activity/Process**: `creation_activity`, `processing_activity`, `storage_activity`
4. **Measurement**: `value_quantity`, `range_low`, `range_high`, `quantity_measure`
5. **Provenance**: `*_provenance`, `derived_from`
6. **Organization/Study**: `member_of_research_study`, `originating_site`

**Potential features**:
- User-facing documentation/tooltips
- Search result grouping by semantic category
- Suggested exploration paths ("Show specimen workflow", "Show participant data")
- AI-assisted query answering
- Smart search: "find containment relationships" could match `parent_*` and `part_of` patterns

**Implementation approach when ready**:
- Extract patterns from attribute names (regex/keyword matching)
- Make patterns configurable (JSON/YAML file of patterns)
- Use for suggestions/enhancements, not core functionality
- Keep structural navigation as primary interface

**Note**: This is a future enhancement - current structural approach (categorize by range: primitive/enum/class) is stable and schema-change-safe.
