# Archived Completed Tasks

This file contains detailed documentation of completed work that was previously in TASKS.md.

---

## Phase 1: UI Layer Cleanup ✅ COMPLETED

**Goal**: Clarify model/UI separation before other refactors

### Step 1: Move UI types out of Element.ts ✅

- **What**: Moved `ItemInfo`, `EdgeInfo`, `RelationshipData` to ComponentData.ts
- **Why**: Element.ts should contain only model-layer types
- **Result**: Clear separation between model and UI layers
- **Dependencies**: None

### Step 2: Rename types.ts → import_types.ts ✅

- **What**: Renamed types.ts to import_types.ts
- **Why**: Clarifies these are DTOs for raw data transformation, used ONLY by dataLoader
- **Result**: Name now clearly indicates purpose (DTO import transformations)
- **Dependencies**: None

---

## Phase 1.5: Complete Type Organization ✅ COMPLETED

### Problem Identified

import_types.ts should ONLY be imported by dataLoader, but 7+ files were importing ModelData from it.

### Root Cause

ModelData is not a DTO - it's the core application data structure. It belongs in its own file, not in import_types.ts.

### Step 2.5: Extract all non-DTO types from import_types.ts ✅

**What was moved:**
- **ModelData** → `models/ModelData.ts` (core app data structure)
- **Transformed types** → `models/SchemaTypes.ts`:
  - ClassData, EnumData, SlotData, TypeData
  - VariableSpec, SchemaData, EnumValue, FieldMapping
- **SlotDefinition**: Stays in import_types.ts (part of DTO structure, used in ClassDTO) but re-exported from SchemaTypes for convenience

**What stays in import_types.ts** (DTOs only):
- SlotDefinition, SlotDTO, EnumDTO, TypeDTO, ClassDTO, SchemaDTO, TypesSchemaDTO, VariableSpecDTO
- FIELD_MAPPINGS

**Files updated**:
- 7 files + Element.ts + Graph.ts + dataLoader.ts

**Architecture achieved**:
- Only dataLoader, Element (for DTOs), SchemaTypes (re-export), and tests import from import_types.ts
- Clear separation: DTOs (import_types) vs transformed types (SchemaTypes) vs core data (ModelData)

**Result**: ✅ All typechecks pass

---

## ElementRegistry.ts Cleanup ✅ COMPLETED

**What**: Removed 83 lines of commented-out code
- Deleted: RelationshipPair, RelationshipTypeMetadata, RELATIONSHIP_TYPES registry
- Deleted: getElementType(), getRelationshipType(), isValidElementType() functions
- Kept: ElementTypeId, RelationshipTypeId types, ElementTypeMetadata interface, ELEMENT_TYPES registry, getAllElementTypeIds() helper

**Result**: File now contains only actively used code

---

## App Configuration File ✅ COMPLETED

### Problem

Configuration was scattered across multiple files:
- Element metadata in ElementRegistry.ts
- Timing constants hard-coded in RelationshipInfoBox.tsx (300ms, 1500ms, 400px, etc.)
- Link colors hard-coded in components (text-blue-600, text-purple-600, etc.)
- Layout constants hard-coded (20 item threshold, 10 preview count)

### Solution

Created single source of truth: `src/config/appConfig.ts`

### Key Architectural Decisions

1. **Consolidate ElementRegistry.ts → appConfig.ts**
   - ElementRegistry was just configuration data, not an actual registry
   - No registration logic, just metadata
   - Better to have all config in one place

2. **Link colors derived from element colors**
   - Don't configure link colors separately
   - Links use element type colors dynamically
   - Example: Link to enum uses enum's purple color
   - Implemented via helper: `getElementLinkColor(elementType)`

3. **Consistent element type usage**
   - Added `type` field to ItemInfo interfaces containing ElementTypeId ('class', 'enum', etc.)
   - `typeDisplayName` is user-facing only ("Class", "Enumeration", etc.)
   - Never use typeDisplayName for logic - always use type field

### Implementation

**Created `src/config/appConfig.ts`:**

```typescript
export const APP_CONFIG = {
  // Element type metadata (from ElementRegistry.ts)
  elementTypes: {
    class: {
      id: 'class',
      label: 'Class',
      pluralLabel: 'Classes',
      icon: 'C',
      color: {
        name: 'blue',
        hex: '#3b82f6',
        link: 'text-blue-600 dark:text-blue-400',
        linkTooltip: 'text-blue-300',
        toggleActive: 'bg-blue-500',
        toggleInactive: 'bg-gray-300 dark:bg-gray-600',
        headerBg: 'bg-blue-700 dark:bg-blue-700',
        headerText: 'text-white',
        headerBorder: 'border-blue-800 dark:border-blue-600',
        selectionBg: 'bg-blue-100 dark:bg-blue-900',
        badgeBg: 'bg-gray-200 dark:bg-slate-600',
        badgeText: 'text-gray-700 dark:text-gray-300'
      }
    },
    enum: { ... },
    slot: { ... },
    type: { ... },
    variable: { ... }
  },

  // Timing constants (from RelationshipInfoBox.tsx)
  timing: {
    hoverDebounce: 300,        // Delay before showing preview
    lingerDuration: 1500,      // How long preview stays after unhover
    upgradeHoverTime: 1500,    // Hover duration to upgrade to persistent
  },

  // UI layout constants
  layout: {
    estimatedBoxHeight: 400,   // For positioning calculations
    collapsibleListSize: 20,   // Show "...N more" threshold
    collapsedPreviewCount: 10, // Items to show when collapsed
  },
};

// Helper functions
export function getElementLinkColor(type: ElementTypeId): string {
  return APP_CONFIG.elementTypes[type].color.link;
}

export function getElementLinkTooltipColor(type: ElementTypeId): string {
  return APP_CONFIG.elementTypes[type].color.linkTooltip;
}

export function getAllElementTypeIds(): ElementTypeId[] {
  return Object.keys(APP_CONFIG.elementTypes) as ElementTypeId[];
}
```

**Updated imports across codebase (7 files):**
- src/utils/duplicateDetection.ts
- src/utils/panelHelpers.tsx
- src/utils/statePersistence.ts
- src/models/ModelData.ts
- src/models/Element.ts
- src/services/DataService.ts

**Replaced hard-coded values in components:**
- **RelationshipInfoBox.tsx**:
  - Line 109: `300` → `APP_CONFIG.timing.hoverDebounce`
  - Line 114, 147: `1500` → `APP_CONFIG.timing.lingerDuration`
  - Line 134: `1500` → `APP_CONFIG.timing.upgradeHoverTime`
  - Line 74: `400` → `APP_CONFIG.layout.estimatedBoxHeight`
  - Line 218, 252: `20` → `APP_CONFIG.layout.collapsibleListSize`
  - Line 222, 256: `10` → `APP_CONFIG.layout.collapsedPreviewCount`
  - All hard-coded link colors → `getElementLinkColor(edge.otherItem.type)`

- **LinkOverlay.tsx**:
  - Lines 63, 68: `text-blue-300` → `getElementLinkTooltipColor(data.sourceType/targetType)`

**Added `type` field to ItemInfo interfaces:**
- Updated ItemInfoDeprecated and ItemInfo in ComponentData.ts
- Added `type: string` field containing ElementTypeId
- Updated all ItemInfo object creation in Element.ts to populate `type` field
- Updated RelationshipInfoBox.tsx to use `edge.otherItem.type` instead of parsing `typeDisplayName`

**Deleted:**
- src/models/ElementRegistry.ts

**Result**:
- ✅ All typechecks pass
- ✅ Single source of truth for all configuration
- ✅ No hard-coded values in components
- ✅ Type-safe color and timing constants
- ✅ Consistent element type usage throughout codebase

---

## Summary of Phase 1 & 1.5 Accomplishments

**Architecture Improvements:**
1. ✅ Clear separation of DTOs (import_types) vs transformed types (SchemaTypes) vs core data (ModelData)
2. ✅ UI types separated from model types
3. ✅ Single source of truth for all configuration (appConfig.ts)
4. ✅ Eliminated hard-coded values in components
5. ✅ Consistent element type IDs used throughout (no more parsing display names)
6. ✅ Type-safe configuration with TypeScript

**Files Created:**
- src/models/ModelData.ts
- src/models/SchemaTypes.ts
- src/config/appConfig.ts
- src/contracts/ComponentData.ts (UI types)

**Files Renamed:**
- types.ts → import_types.ts

**Files Deleted:**
- src/models/ElementRegistry.ts

**Files Modified:**
- 10+ files updated with new import paths and configuration usage

**Code Removed:**
- 83 lines of commented-out code from ElementRegistry.ts
- All hard-coded timing and layout constants
- All hard-coded color class strings

**All changes verified with `npm run typecheck` ✅**

---

<a id="type-system-cleanup"></a>
## Type System Cleanup ✅ COMPLETED

**Goal**: Simplify edge types and retire deprecated interfaces before Phase 3 Step 5.

### Step 1: EdgeType Simplification ✅
- Added EDGE_TYPES constants enum in SchemaTypes.ts
- Updated EdgeInfo to use `edgeType: EdgeType` from SchemaTypes
- Removed UI edge type mapping in DataService.getEdgeInfo()
- Replaced string literals with EDGE_TYPES constants throughout codebase
- **Result**: Single source of truth for edge types

### Step 2: Retire EdgeInfoDeprecated ✅
- Migrated RelationshipInfoBox to use EdgeInfo with sourceItem/targetItem
- Updated Element.ts `getRelationshipsFromGraph()` to return RelationshipData
- Removed EdgeInfoDeprecated and RelationshipDataDeprecated
- **Result**: Cleaner edge representation with explicit source/target

### Step 3: Deprecate Relationship-based functions ✅
- Marked getRelationshipsForLinking() as @deprecated in DataService
- Marked test-only linkHelpers functions as @deprecated
- **Result**: Old Relationship-based API marked deprecated, new EdgeInfo API ready

---

<a id="phase-3-data-flow"></a>
## Phase 3: Data Flow Refactor ✅ COMPLETED

### Step 5: Refactor data flow ✅
- Graph now built FIRST in initializeModelData() before creating Elements
- Element usage inventory created (ELEMENT_INVENTORY.md)
- Quick wins: getUsedByClasses() methods now use O(1) graph queries
  - EnumElement.getUsedByClasses(): O(n) → O(1), 73% code reduction
  - SlotElement.getUsedByClasses(): O(n×m) → O(edges), 75% code reduction
  - TypeElement.getUsedByClasses(): Added (was missing)
- See commits: 32ebd1f, 43b2ba6, 0ade234

### Step 6: Remove DTO imports from Element.ts ✅
- Element.ts has no DTO imports
- Only dataLoader uses DTOs (correct!)
- SchemaTypes just re-exports SlotDefinition

---

<a id="phase-2-linkoverlay-migration"></a>
## Phase 2: LinkOverlay Migration ✅ COMPLETED

**Goal**: Migrate LinkOverlay and RelationshipInfoBox to graph-based queries.

### Step 3: Migrate LinkOverlay to graph-based relationships ✅
- LinkOverlay now uses `getEdgesForItem()` with EdgeInfo directly
- Added three edge types for panel modes:
  - `CLASS_RANGE`: class→range (2-panel mode, direct links)
  - `CLASS_SLOT`: class→slot (3-panel mode, first hop)
  - `SLOT_RANGE`: slot→range (3-panel mode, second hop)
- `getEdgeTypesForLinks(middlePanelShown)` returns appropriate types per mode
- `buildLinkPairs()` returns EdgeInfo with each link pair for rendering
- Removed dependency on `getRelationshipsForLinking()`
- See commits: 1b42665, 6c41795

### Step 3b: Migrate RelationshipInfoBox to graph-based queries ✅
- RelationshipInfoBox now uses `getEdgesForItem()` + `getItemInfo()` directly
- No Element lookup needed - works for all node types including slot overrides
- Added support for CLASS_SLOT and SLOT_RANGE edge types
- Fixed "No relationships found" bug for slot hover

### Code Removed
- `getRelationshipsNew()` from DataService (~12 lines)
- `getRelationshipsFromGraph()` from Element.ts (~120 lines)
- `RelationshipData` type from SchemaTypes.ts (~8 lines)
- Net reduction: ~95 lines

### Bug Fixes
- ✅ Slot hover shows "No relationships found" - Fixed by adding CLASS_SLOT/SLOT_RANGE edge support
- ✅ Slot override nodes missing - Graph now creates nodes for all slotDefIds

### Link Rendering Issues
1. **Class→slot links pointing wrong direction** (3-panel mode) [sg] fixed
2. **Specimen→analyte_type link missing** (see screenshot in old TASKS.md:107) [sg] fixed
3.  ✅ Complete
    - **SVG path NaN errors** - Console shows `<path> attribute d: Expected number, "M NaN NaN C NaN Na..."`
        - **Location**: LinkOverlay.tsx:448 (path element at line 450: `d={pathData}`)
        - something is wrong with the self-ref code on lines 403-412

### Hover/Detail Box Issues
4. ✅ **Slot hover shows "No relationships found"** - Fixed by adding CLASS_SLOT/SLOT_RANGE edge support


### ✅ Slot Data Consolidation - COMPLETE (Dec 2024)

Consolidated slot data structure:
- Classes now have `slots: SlotReference[]` instead of `attributes` dict
- All slot data lives in slots section with `global` and `overrides` flags
- SlotReference is minimal: `{ id, inheritedFrom? }`
- Removed obsolete Relationship code (~2000 lines deleted)
- All 122 tests passing

LinkOverlay and RelationshipInfoBox now use graph-based queries directly. See [archive/tasks.md#phase-2-linkoverlay-migration](archive/tasks.md#phase-2-linkoverlay-migration) for details.

**Step 4: Remove old getRelationships() methods** ✅ COMPLETE (Dec 2024)
- Deleted from ClassElement, EnumElement, SlotElement, VariableElement
- Removed ClassSlot class (replaced by graph slot edges)
- Removed `getRelationshipsForLinking()` from DataService
- Removed Relationship interface, categorizeRange(), and related code

---

## Grouped/Collapsible Floating Panels ✅ MOSTLY COMPLETE (Dec 2024)

**Goal**: Replace cascade layout with two group containers (Details, Relationships) containing collapsible item boxes.

### Completed (Phases 1-4):

**Phase 1: Data Model** ✅
- Added `GroupId` type: `'details' | 'relationships'`
- Added `FloatingBoxGroupData` interface for group containers
- Extended `FloatingBoxData` with `isCollapsed`
- Added group config to appConfig (positions, sizing as viewport percentages)

**Phase 2: FloatingBoxGroup Component** ✅
- New component renders group container with header
- Header: title, collapse-all, popout, close buttons
- Contains stacked child boxes (vertical layout)
- Each child: expand/collapse toggle, close button, content
- Group-level drag/resize with full-side handles

**Phase 3: FloatingBoxManager Changes** ✅
- Manages two groups (created lazily on first box)
- Removed cascade positioning algorithm
- Simplified to: groups + transitory boxes only
- Deleted obsolete cascade code

**Phase 4: LayoutManager Integration** ✅
- `handleOpenFloatingBox` adds boxes to groups
- Auto-collapse previous boxes when new one opens
- Group close removes all boxes in group

**Bug Fixes** ✅
- Fixed text selection during drag (e.preventDefault, select-none)
- Fixed drag/resize lag (initialize local state from props at drag start)
- Made full-side resize handles
- Moved all sizing to viewport percentages (not hardcoded pixels)
- Removed max width constraint
- Fixed box height distribution (expanded boxes split space evenly, give back unused)
- Fixed transitory box positioning (appears to left when right would overflow)
- Added pointer-events: none to transitory box to prevent hover interference

**Remaining** (see TASKS.md):
- Hover highlight for open boxes
- Phase 5: Popout window support

---

## Badge-Based Hover/Click Interaction ✅ COMPLETE (Dec 2024)

**Goal**: Replace complex timing-based hover with explicit badge/name hover areas

**Completed:**
- Added relationship badge showing `↘N ↗M` (incoming/outgoing counts) to each item
- Hover badge → shows relationship info box immediately (no timing)
- Hover item name → shows detail box immediately (no timing)
- Click while hovering → upgrades transitory box to persistent
- Removed all debounce/linger timers from LayoutManager
- URL persistence updates when dialogs open/close/move/resize
- Removed legacy RelationshipInfoBox component (~160 lines)

**Animation fixes:**
- Fixed bring-to-front animation by rendering boxes in stable DOM order
- Fixed infinite loop error by moving state lookups inside setState callbacks
- Using CSS transform instead of left/top for smoother animations

---

## Floating Box Issues ✅ COMPLETE (Dec 2024)

- Responsive stacked width
- Transitory→persistent upgrade
- RelationshipInfoContent extracted for FloatingBox use
- Transitory boxes managed by FloatingBoxManager
- Title/subtitle support with relationship counts
- Fit-content width for transitory boxes
- Fixed ID collision (rel- vs box- prefixes)
- Relationship metadata moved to DataService
- Transitory box height: fit-content up to 2/3 viewport
- Fixed slots not showing in class details
- Removed stacked mode entirely - all boxes now draggable
- Fit-content sizing for all boxes

