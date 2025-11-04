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


---

### 🔒 Phase 6.5: Complete View/Model Separation

**Status**: ✅ COMPLETE

**Goal**: Truly separate view from model. Components define their own data contracts, Element adapts to provide that data. Components never know about element types, ElementRegistry, or model structure.

**Problem**: Phase 9 attempted to make `element.type` protected and add `getType()` method, but this doesn't achieve true separation - components still need `ElementTypeId` knowledge. `getType()` is just `type` with extra steps.

**Core Principle**: Each component defines what data it needs with property names that make sense for that component. Element implements methods to provide that data. Components are completely ignorant of the model structure.

**The Pattern**:

```typescript
// In component file - component defines its contract
interface CollectionItemData {
  id: string;                // from element.getId(panelContext)
  displayName: string;       // "Specimen"
  badgeColor?: string;
  badgeText?: string;
  indicators?: Array<{ text: string; color: string }>;
}

// In Element.tsx - Element adapts to component's needs
import type { CollectionItemData } from '../components/CollectionSection';
getCollectionItemData(context: PanelContext): CollectionItemData { ... }
```

**Naming Changes**:
- `Section` → `CollectionSection` (displays items from one collection)
- `ElementsPanel` → `CollectionsPanel` (displays multiple CollectionSections)
- Avoid "Element" in component names to reduce confusion with model Elements

**ID System**:
```typescript
// Element base class
type IdContext = 'leftPanel' | 'rightPanel' | 'detailBox' | undefined;

getId(context?: IdContext): string {
  const prefix = context === 'leftPanel' ? 'lp-'
    : context === 'rightPanel' ? 'rp-'
    : context === 'detailBox' ? 'db-'
    : '';
  return prefix + this.name;
}
```

**Collection Identity**:
Collections have their own `id` property (currently matches ElementTypeId string value, but no type coupling):
```typescript
abstract class ElementCollection {
  abstract readonly id: string;      // "class", "enum", "slot", "variable"
  abstract getLabel(): string;        // "Classes", "Enums", "Slots", "Variables"
  abstract getIcon(): string;         // "C", "E", "S", "V"
  // ...
}
```

**Component Data Contracts**:

1. **CollectionSection** (renamed from Section):
```typescript
interface CollectionItemData {
  id: string;                // from element.getId(panelContext)
  displayName: string;       // "Specimen"
  badgeColor?: string;       // tailwind classes
  badgeText?: string;        // "103"
  indicators?: Array<{       // replaces isAbstractClass() check
    text: string;            // "abstract"
    color: string;           // tailwind classes
  }>;
  level: number;             // nesting depth
  hasChildren?: boolean;
  isExpanded?: boolean;
  isClickable: boolean;
}
```

2. **DetailBox** (currently DetailPanel):
```typescript
// Already good - uses getDetailData()
interface DetailData {
  titlebarTitle: string;
  title: string;
  subtitle?: string;
  titleColor: string;
  description?: string;
  sections: DetailSection[];
}
```

3. **LinkOverlay**:
```typescript
// Will need refactoring - defer link ID pattern for now
interface LinkData {
  startId: string;           // TBD during LinkOverlay refactor
  endId: string;
  startColor: string;
  endColor: string;
  hoverData?: {
    label?: string;
    relationshipType: string;
  };
}
```

**Progress** (commit 0653a6c):

✅ **Step 1: Revert Phase 9 & Add ID System**
   - ✅ Removed `getType()`, `getParentName()`, `isAbstractClass()` methods
   - ✅ Made `type` protected (NOT public - components blocked from accessing)
   - ✅ Added `getId(context?: IdContext)` to Element base class
   - ✅ Added `id: string` property to all ElementCollection classes
   - **Result**: Build errors in Section.tsx (5 errors) and ElementsPanel.tsx (1 error) - expected and good!

**Remaining Steps**:

✅ **Step 2: Move field name changes to declarative mapping spec** (COMPLETE)
   - ✅ Created FIELD_MAPPINGS in types.ts with FieldMapping interface
   - ✅ Created generic transformWithMapping() function in dataLoader.ts
   - ✅ Updated all transform functions to use mapping specs
   - **Result**: Transformations now declarative and maintainable
   - **Tests**: 158 passing, type checking passes

3. **Rename components**: ❌ SKIPPED
   - Keep current names: Section.tsx, ElementsPanel.tsx
   - Add clear documentation at top of each file explaining purpose

4. **Define component data interfaces and refactor component data access**:

   **Investigation findings**:

   1. ✅ `toRenderableItems()` - Still needed, used by Collections
   2. ❌ `renderPanelSection()` and `renderDetails()` - DEAD CODE, not called anywhere
   3. ✅ `getDetailData()` - Already correct pattern in DetailPanel.tsx

   **Component model access audit**:

   **Section.tsx** accesses:
   - `item.element.type` (lines 23, 47, 48, 49) - Used for: color lookup, DOM IDs, hover handlers
   - `item.element.name` (lines 27, 37, 45, 49, 74) - Used for: hover handlers, display, toggle state
   - `element.isAbstract()` (line 77) - Used for: "abstract" indicator
   - `ELEMENT_TYPES[element.type]` (line 23) - Used for: color lookup
   - `item.level`, `item.hasChildren`, `item.isExpanded`, `item.isClickable`, `item.badge` from RenderableItem

   **ElementsPanel.tsx** accesses:
   - `ElementTypeId` type (lines 3, 8, 10, 11, 17) - Strongly coupled to model types
   - `ELEMENT_TYPES` registry (line 4, 23) - For icons, colors, labels
   - `element.type` (line 97) - Passed to onSelectElement callback

   **DetailPanel.tsx**:
   - ✅ Only uses `element.getDetailData()` - already correct!

   **Refactoring approach**:

   Components define their own data interfaces with UI-focused property names:

   ```typescript
   // Section.tsx - Component defines what it needs for one item
   interface SectionItemData {
     // Identity (used for both DOM id and React key)
     id: string;                     // "lp-Specimen" (from element.getId(context))

     // Display
     displayName: string;            // "Specimen"
     level: number;                  // Indentation depth

     // Visual styling
     badgeColor?: string;            // Tailwind: "bg-blue-100 text-blue-800"
     badgeText?: string;             // "103"
     indicators?: Array<{            // Replaces isAbstract() check
       text: string;                 // "abstract"
       color: string;                // Tailwind: "text-purple-600"
     }>;

     // Interaction
     hasChildren?: boolean;
     isExpanded?: boolean;
     isClickable: boolean;

     // Event data (opaque to component, passed through to callbacks)
     hoverData: {
       type: string;                 // "class" (component treats as opaque)
       name: string;                 // "Specimen"
     };
   }

   // Section.tsx - Component defines what data it needs for the whole section
   interface SectionData {
     id: string;                     // "class"
     label: string;                  // "Classes"
     items: SectionItemData[];       // The tree/list items
     expansionKey?: string;          // For state persistence ("lp-class")
     defaultExpansion?: Set<string>; // Default expanded items
   }
   ```

   Element adapts to provide this data:

   ```typescript
   // Element.tsx
   import type { SectionItemData } from '../components/Section';

   abstract class Element {
     // Expose id as getter that calls getId() with appropriate context
     get id(): string {
       return this.getId();
     }

     // Context-aware ID generation (already exists, just not used yet)
     getId(context?: 'leftPanel' | 'rightPanel' | 'detailBox'): string {
       const prefix = context === 'leftPanel' ? 'lp-'
         : context === 'rightPanel' ? 'rp-'
         : context === 'detailBox' ? 'db-'
         : '';
       return prefix + this.name;
     }

     getSectionItemData(context: 'leftPanel' | 'rightPanel'): SectionItemData {
       const typeInfo = ELEMENT_TYPES[this.type];
       return {
         id: this.getId(context),
         displayName: this.name,
         level: 0, // Set by tree traversal
         badgeColor: `${typeInfo.color.badgeBg} ${typeInfo.color.badgeText}`,
         badgeText: this.getBadge()?.toString(),
         indicators: this.getIndicators(),
         hasChildren: this.children.length > 0,
         isExpanded: false, // Set by tree traversal
         isClickable: true,
         hoverData: {
           type: this.type,
           name: this.name
         }
       };
     }

     // New polymorphic method - replaces isAbstract() check in component
     getIndicators(): Array<{ text: string; color: string }> {
       return []; // Override in subclasses
     }
   }

   class ClassElement extends Element {
     getIndicators(): Array<{ text: string; color: string }> {
       if (this.isAbstract()) {
         return [{ text: 'abstract', color: 'text-purple-600 dark:text-purple-400' }];
       }
       return [];
     }
   }
   ```

   **ElementsPanel.tsx refactoring**:

   ```typescript
   // ElementsPanel.tsx - Component defines what it needs for toggle buttons
   interface ToggleButtonData {
     id: string;                     // "class" (not ElementTypeId!)
     icon: string;                   // "C"
     label: string;                  // "Classes"
     activeColor: string;            // Tailwind: "bg-blue-500"
     inactiveColor: string;          // Tailwind: "bg-gray-300"
   }

   interface ElementsPanelProps {
     position: 'left' | 'right';
     visibleSections: string[];                   // IDs of visible sections (order matters)
     onVisibleSectionsChange: (sections: string[]) => void;
     sectionData: Map<string, SectionData>;       // Data for each section
     toggleButtons: ToggleButtonData[];           // Metadata for toggle buttons (from App)
     onSelectElement: (element: Element, elementType: string) => void;
     onElementHover?: (element: { type: string; name: string }) => void;
     onElementLeave?: () => void;
   }
   ```

   **Implementation steps**:

   a. **Delete dead JSX methods from Element.tsx**:
      - Remove abstract methods: `renderPanelSection()`, `renderDetails()`
      - Remove implementations in ClassElement, EnumElement, SlotElement, VariableElement
      - Rename Element.tsx → Element.ts (no more JSX)

   b. **Add indicators system and id getter**:
      - Add `get id()` getter that calls `getId()` (expose existing method)
      - Add `getIndicators()` method to Element base class
      - Implement in ClassElement for "abstract" indicator
      - Keep `isAbstract()` protected (used internally by getIndicators)

   c. **Refactor Section.tsx**:
      - Define `SectionItemData` interface in Section.tsx (item display data)
      - Define `SectionData` interface in Section.tsx (full section data)
      - Update component to accept `SectionData` instead of `ElementCollection`
      - Update ItemRenderer to only use SectionItemData properties
      - Remove direct access to element.type, element.isAbstract(), ELEMENT_TYPES
      - Element.tsx imports: `import type { SectionItemData } from '../components/Section'`
      - Add `Element.getSectionItemData(context)` method
      - Update Collections to build SectionData (with getSectionItemData() for items)

   d. **Refactor ElementsPanel.tsx**:
      - Define `ToggleButtonData` interface (toggle button metadata)
      - Change all `ElementTypeId` → `string`
      - Change `collections: Map<ElementTypeId, ElementCollection>` → `sectionData: Map<string, SectionData>`
      - Accept `toggleButtons: ToggleButtonData[]` from App.tsx
      - Remove all imports of ElementTypeId, ELEMENT_TYPES, ElementRegistry
      - Component becomes fully type-agnostic

   e. **Update App.tsx**:
      - Build `ToggleButtonData[]` from ELEMENT_TYPES registry (one-time coupling at app level)
      - Convert Collections to `Map<string, SectionData>` before passing to ElementsPanel
      - Update all ElementTypeId types to string

   f. **Consider RenderableItem.ts**:
      - Evaluate if this is redundant with SectionItemData
      - If kept, clarify it's an internal Collection structure, not a component interface
      - If removed, Collections build SectionItemData directly

   **Files to modify**:
   - `src/models/Element.tsx` → `Element.ts` (delete JSX, add getSectionItemData, getIndicators, id getter)
   - `src/components/Section.tsx` (define SectionItemData/SectionData, use them)
   - `src/components/ElementsPanel.tsx` (remove ElementTypeId coupling, use ToggleButtonData)
   - `src/App.tsx` (build toggle button data, convert collections to SectionData)
   - All Collection classes in Element.tsx (build SectionData)
   - `src/models/RenderableItem.ts` (possibly delete or clarify purpose)

✅ **Step 5: Update Element methods** (COMPLETE)
   - ✅ Added: `getSectionItemData(context, level, isExpanded, isClickable, hasChildren?)`
   - ✅ Added: `toSectionItems()` for tree traversal with expansion state
   - ✅ Added: `get id()` getter for convenient ID access
   - ✅ Added: `getIndicators()` method returning badges array
   - ✅ Removed: `renderPanelSection()`, `renderDetails()`, `renderName()` (obsolete JSX)
   - Keep: `getDetailData()` (already correct)
   - Keep: `getRelationships()` (defer LinkOverlay refactor to later phase)

✅ **Step 6: Update Collections** (COMPLETE)
   - ✅ Added: `getSectionData(position)` returns SectionData with getItems() function
   - ✅ Keep: `getRenderableItems()` (still used internally, marked in RenderableItem.ts as internal)
   - ✅ Keep: `id` property on each collection class (added in Step 1)

✅ **Step 7: Remove type coupling from components** (COMPLETE)
   - ✅ ElementsPanel: Changed `sections: ElementTypeId[]` → `sections: string[]`
   - ✅ App.tsx: Changed `leftSections/rightSections: ElementTypeId[]` → `string[]`
   - ✅ Removed all `ElementTypeId` imports from Section.tsx and ElementsPanel.tsx
   - ✅ Removed all `ELEMENT_TYPES` imports from Section.tsx and ElementsPanel.tsx
   - ✅ App.tsx builds ToggleButtonData and SectionData from ELEMENT_TYPES (one-time coupling)

✅ **Step 8: Cleanup** (COMPLETE)
   - ✅ Removed obsolete JSX methods: `renderPanelSection()`, `renderDetails()`, `renderName()`
   - ✅ Renamed Element.tsx → Element.ts (no more JSX in model layer)
   - ✅ Removed React import from Element.ts
   - ✅ Marked RenderableItem.ts as deprecated/internal
   - ✅ Fixed JSDoc comment reference (Element.tsx → Element.ts)
   - ✅ Added toggleActive/toggleInactive to ElementRegistry for Tailwind JIT compiler
   - ✅ Tree.ts already deleted in Phase 6.4

✅ **Step 9: Verify architectural compliance** (COMPLETE)
   - ✅ No component imports ElementTypeId (verified)
   - ✅ No component imports ELEMENT_TYPES from components (App.tsx uses it to build data)
   - ✅ No component imports ElementRegistry from components
   - ✅ All 158 tests passing
   - ✅ Type checking passes
   - ✅ Components use SectionItemData/SectionData/ToggleButtonData interfaces
   - ✅ True view/model separation achieved

✅ **Step 10: Make element.type protected** (COMPLETE)
   - ✅ Changed `type` from public to `protected` in Element.ts
   - ✅ Removed TODO comment about making type protected
   - ✅ Verified no components access `element.type` directly
   - ✅ Type checking passes (no errors)
   - ✅ All 158 tests passing
   - **Result**: Complete architectural separation - view layer cannot access model type information

✅ **Step 11: Optimize DetailDialog getDetailData() calls** (COMPLETE)
   - ✅ Fixed DetailDialog to call `element.getDetailData()` once instead of 3 times
   - ✅ Cached result in `detailData` variable at component top
   - ✅ Type checking passes
   - **Result**: More efficient rendering, reduced method calls

**Files to modify**:
- `src/models/Element.tsx`
- ~~`src/models/Tree.ts`~~ (deleted in Phase 6.4)
- `src/components/Section.tsx` → `src/components/CollectionSection.tsx`
- `src/components/ElementsPanel.tsx` → `src/components/CollectionsPanel.tsx`
- `src/components/DetailPanel.tsx` → `src/components/DetailBox.tsx`
- `src/utils/panelHelpers.tsx`
- `src/App.tsx`
- `src/utils/dataLoader.ts`
- All test files that reference renamed components

**Future work** (defer to separate phase):
- LinkOverlay refactoring to use new patterns
- Component files define their own hover handler contracts
- **Step 3.2 from Phase 6.4**: Convert SlotCollection to 2-level tree
  - Deferred - current flat SlotCollection is sufficient
  - Would show global slots + inline attributes from all classes
  - Each class becomes a root node with its attributes as children
- DetailBox Slots table should put inherited slots at the top and
  (already the case?) referenced slots at the bottom

---

### 🔒 Phase 9: Make element.type Private

**Status**: ⚠️ ATTEMPTED BUT FLAWED - Reverted in Phase 6.5

**Problem**: This phase made `element.type` protected and added `getType()` method, but this doesn't achieve true separation. Components calling `getType()` still know about `ElementTypeId`. This is just `type` with extra steps.

**Committed as WIP** (commit cdb2f03) to preserve the work, but will be reverted in Phase 6.5.

---

### Phase 10a: ✅ Add getDetailData() to Element Classes
**Status**: ✅ COMPLETED (see Phase 7 in progress.md)

### Phase 10b: ✅ Refactor DetailPanel
**Status**: ✅ COMPLETED (see Phase 8 in progress.md)

~~**[sg]**: noticed that DetailPanel calls element.getDetailData() repeatedly. call it once?~~
**RESOLVED**: DetailPanel already called it once (correct). DetailDialog was calling it 3 times - fixed in Phase 6.5 Step 11.

### Phase 10c: Unified Detail Box System
**Goal**: Extract dialog management from App.tsx, merge DetailDialog/DetailPanelStack into unified system

**Current state**:
- DetailPanel: 130-line content renderer using getDetailData() ✅
- DetailDialog: Floating draggable/resizable wrapper
- DetailPanelStack: Stacked non-draggable wrapper
- App.tsx: Manages openDialogs array and mode switching

**New file structure**:
```
src/components/
  DetailPanel.tsx           (keep - content renderer, 130 lines, uses getDetailData())
  DetailBoxManager.tsx      (new - manages array + rendering)
    - DetailBox component   (draggable/resizable wrapper)
    - Array management (FIFO stack)
    - Mode-aware positioning
```

**DetailBox component** (single component, works in both modes):
- All boxes identical: draggable, resizable, colored headers
- Mode only affects initial position (not capabilities)
- Uses element.getDetailData() for header (no ElementTypeId prop needed)
- Click/drag/resize anywhere in box → bring to front (move to end of array)
- ESC closes first/oldest box (index 0)

**Mode behavior** (intelligent repositioning):
- **Floating mode** (narrow screen): New boxes cascade from bottom-left
- **Stacked mode** (wide screen): New boxes open in stack area
  - [sg] consider changing layout to newest on bottom. then new boxes
         can overlap so only header of previous shows. with step 1:click
         bring to front, this should be ok.
- **Mode switch to stacked**: All boxes move to stack positions
- **Mode switch to floating**:
  - User-repositioned boxes → restore custom position from URL state
  - Default boxes → cascade from bottom-left

**URL state tracking**:
- Track which boxes have custom positions (user dragged/resized)
- On mode switch, respect user customizations
- Default positions don't persist

**Implementation steps**:

1. **Create DetailBoxManager.tsx**
   - Extract openDialogs array management from App.tsx
   - Single DetailBox component (merge DetailDialog drag/resize logic)
   - Mode-aware initial positioning
   - Click/drag/resize → bring to front (move to end of array)
   - ESC closes first box (oldest)
   - Z-index based on array position
   - [sg] make sure new boxes are always fully visible:
     - in stacked layout by scrolling
     - in floating, by resetting vertical cascade position when necessary

2. **Update App.tsx**
   - Remove openDialogs management
   - Import and use DetailBoxManager
   - Pass display mode and callbacks

3. **Delete old components**
   - Delete DetailDialog.tsx
   - Delete DetailPanelStack.tsx

4. **Update tests**
   - Test drag/resize
   - Test click-to-front
   - Test ESC behavior
   - Test mode switching with custom positions

### [sg] Phase 10d: fix details for enums to use all the data
   - enums tend to have either permissible values or instructions for
     getting values from elsewhere, like:
     ```yaml
     CellularOrganismSpeciesEnum:
       description: >-
         A constrained set of enumerative values containing the NCBITaxon values for cellular organisms.
       reachable_from:
         source_ontology: obo:ncbitaxon
         source_nodes:
           - ncbitaxon:131567 ## Cellular Organisms
         include_self: false
         relationship_types:
           - rdfs:subClassOf
     ```
   - will need to load prefixes in order to link these
   - also look for other data in bdchm.yaml that isn't currently being captured

---

### 🔄 Phase 11: Refactor App.tsx

**Current state**: App.tsx is 600+ lines, too long

**Extract logic into hooks**:
- `hooks/useModelData.ts` - Data loading
- `hooks/useLayoutState.ts` - Panel layout + expansion state (consolidate useExpansionState)
- Keep App.tsx focused on composition

**Note**: Dialog management extracted to DetailBoxManager in Phase 10c

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

### 🔴 🪲 Phase 12: Fix Dark Mode Display Issues

**Goal**: Fix readability issues in dark mode
**Importance**: High - app currently unusable in dark mode

**Issues from screenshot**:
- Poor contrast/readability throughout
- Need to audit all color combinations

**Files likely affected**:
- `src/index.css` - Tailwind dark mode classes
- All component files using colors

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
