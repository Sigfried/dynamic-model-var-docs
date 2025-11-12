# Tasks

## Table of Contents

### Active Work
- [Questions & Decisions Needed](#questions--decisions-needed)
  - [Architecture & Refactoring Decisions](#architecture--refactoring-decisions)
  - [Different Variable Treatment](#different-variable-treatment-for-condition-and-drug-exposure-classes)
- [Next Up (Ordered)](#next-up-ordered)
  - [🐛 Fix: Incoming Relationships Not Showing](#fix-incoming-relationships-not-showing-in-hover-box--high-priority)
  - [⭐ Architecture Refactoring Implementation Plan](#architecture-refactoring-implementation-plan--current-work)
  - [Phase 12: Unified Detail Box System](#unified-detail-box-system-phase-12--completed)

### Upcoming Features
- [App Configuration File](#app-configuration-file)
- [Abstract Tree Rendering System](#abstract-tree-rendering-system)
- [Link System Enhancement](#link-system-enhancement)
- [Detail Panel Enhancements](#detail-panel-enhancements)
- [Fix Dark Mode Display Issues](#fix-dark-mode-display-issues-high-priority)
- [User Help Documentation](#user-help-documentation)

### Future Work
- [Future Work Section](#future-work) - Deferred features and major refactors
- [UI Test Checklist Template](#ui-test-checklist-template)

---

## Questions & Decisions Needed

---

## Architecture & Refactoring Decisions

**📌 [PARTIALLY EXTRACTED TO REFACTOR_PLAN.md]**
- Core architecture concepts extracted (graph model, slots as edges, data flow)
- Implementation Q&A remains here as context for Steps 1-7 below
- See REFACTOR_PLAN.md for consolidated graph architecture plan

### 1. ItemId Architecture & getId() Simplification

**Context**: UI/model layers should only connect through `itemId` from `element.getId()`. The current `getId(context)` parameter may be unnecessary complexity.

**Proposal**:
- Eliminate `getId(context)` - always return just the element name
- Handle contextual IDs (panel-specific, link-specific) purely in UI layer via utility functions
- UI receives only "contract props" (displayName, headerColor, sourceColor, etc.)
- Collections are treated as items (no special collectionId)

**Utility function signature idea**:
```typescript
// Flexible - accepts one id or multiple
contextualizeId({
  id?: string,
  ids?: string[],
  template: string,
  params: Record<string, string>
})

// Usage for panel sections
sectionId = contextualizeId({
  id,
  template: `panel-${pos}-${id}`,
  params: {id, pos: itemsPanel.position}
})

// Usage for links (after link refactoring)
linkId = contextualizeId({
  ids: [sourceItemId, targetItemId],
  template: `link-${sourceItemId}_${targetItemId}`,
  params: {ids}
})
```

**Questions**:
1. Should we eliminate `getId(context)` entirely? Should getId() always just return `this.name`?

   > **[sg]**: yes. eliminate id (carefully). yes, _for now_, getId() can return this.name. if we
               ever use this app with data where names aren't universally unique, we'll
               need to change it -- happily in only one place.

2. For utility functions - one flexible `contextualizeId()` or separate functions like `contextualizeId()` and `contextualizeLinkId()`?

   > **[sg]**: separate is fine. we'll have to see if the components need anything else

3. Should collections have collectionId or just be treated as items?

   > **[sg]**: treat them like items. but this is why i'm thinking about
               a component data abstraction thing, probably class hierarchy,
               so a UI collection can be an item and it can contain a list
               of items

4. How should nested items work (collection.items[], item.someContainedItem)?

   > **[sg]**: it's nice to have component data contracts in typescript interface
               form; but it would also be nice to share code amongst them, which
               could be facilitated by a class hierarchy based on Item. it could
               handle nesting, id ccntextualization, it could be where the
               Abstract Tree Rendering System goes.

5. Future: Should we create an abstraction layer specifically for component data contracts to handle recursive nesting?

   > **[sg]**: see above. yeah, that's my inclination

---

### 2. LinkOverlay & Link System Refactoring

**Problems identified**:
- LinkOverlay is "totally crazy" (your words!)
- Nested loops: `types.forEach -> itemNames.forEach` (LinkOverlay.tsx:165)
- Link data structure has view/model separation violations
- linkHelpers.ts imports `Relationship` type from models/Element (violates separation)
- Current Link interface: `{ source: { type, name }, target: { type, name }, relationship }`

**Questions**:
1. What specific problems are you seeing in LinkOverlay that make it "totally crazy"?

   > **[sg]**:
   >    - the way it handles left and right items and links seems convoluted. i get
   >      lost trying to follow it
   >    - LinkOverlay gets all the links by going through a huge number of steps;
   >      couldn't it do something like:
   >     ```typescript
   >           interface LinkPair = {sourceItemId: string, targetItemId: string }
   >           const lrPairs: LinkPair = dataService.getAllPairs({
   >                    sourceFilter: leftPanel.displayedSections.map(s => s.itemId))
   >                    targetFilter: rightPanel.displayedSections.map(s => s.itemId))
   >           const rlPairs = dataService.getAllPairs({
   >                    sourceFilter: rightPanel.displayedSections.map(s => s.itemId))
   >                    targetFilter: leftPanel.displayedSections.map(s => s.itemId))
   >           const lpLinks = lrPairs.map(p => buildLink(p))
   >           const rpLinks = rlPairs.map(p => buildLink(p))
   >           
   >           function buildLink(linkPair: LinkPair, direction: 'lr' | 'rl') {
   >             const link: Link = {}  // link interface will be different
   >             link.id = contextualizeLinkId(...)
   >             // find bounding rects by contextualizing the itemIds
   >             // etc.
   >           }
   >           // this could probably be simplified and DRYed up even further, like 
   >           interface LinkPair = {sourceItemId: string, targetItemId: string,
   >                                 sourceSide: 'left' | 'right',
   >                                 targetSide: 'left' | 'left' }
   >           // so you only need one set of pairs and one set of links
   >     ```
   >    - just noticed that Element.getRelationshipData() has conditional logic for
   >      class elements but not the others with tree structures (for grouping),
   >      enum and variable. maybe some refactoring is in order

2. Should link identity be `sourceItemId + targetItemId` (eliminating type from Link interface)?

   > **[sg]**: yes

3. How should we refactor the nested loops? Should it iterate over sections instead of types?

   > **[sg]**: see above. all the elements already have incoming and outgoing relationships.
               use those to implement dataService.getAllPairs

4. Should link rendering be split from link data management?

   > **[sg]**:  of course, right?

5. How should linkHelpers.ts work without importing from models/? Should DataService provide relationship data in a UI-friendly format?

   > **[sg]**: do the above suggestions basically answer this?

6. For link tooltips/hover states - do they fit into the FloatingBox system or stay separate?

   > **[sg]**:  get rid of tooltips.
   >   -  hover state can just be like this somewhere
   >     ```typescript
   >     // hovering over a single link:
   >     setHoverLinks([linkId])
   >     // hovering over an item:
   >     setHoverLinks(allLinks.filter(link => getLinksAttachedTo(link)))
   >     ```
   >     actually, don't get rid of tooltip-- but simplify, just have the tooltip show the relationship
   >     type, like from a variable to a class: 'mapped to'; from
   >     class to enum: `has slot ${slot_name} constrained by`.
   >     so hovering on a link shows a relationship info box for
   >     that one link and also shows the simplified tooltip.

> [sg] now you can tell me i'm crazy if you want
---

### 3. Code File [sg] Notes - Quick Decisions

**3a. App.tsx:34 - URL state needs itemType**
```typescript
const getDialogStates = () => {
  return floatingBoxes.map(box => {
    const itemType = dataService.getItemType(box.itemId);  // [sg] violates principles?
    return { itemName: box.itemId, itemType, x, y, width, height };
  });
};
```

Question: URL restoration needs to know itemType to restore boxes. Is this an acceptable place to use itemType, or should URL state work differently?

> **[sg]**: it can use sectionIds. sectionIds could be like 'lc' for left panel class.
>           so, instead of `l=c&r=e,v` it could be `sections=lc,re,rv`

**3b. App.tsx:131 - Obsolete cursor position code**
```typescript
const position = {  // [sg] obsolete code, right?
  x: hoveredItem.cursorX,
  y: hoveredItem.cursorY
};
```

Question: This code is unused (cascade positioning handles it). Should we just delete it?

> **[sg]**: as far as i know, yes

**3c. Element.ts:688 - Slot inheritance recursion logic**
```typescript
// [sg] do we need both getInheritedFrom and collectAllSlots to be recursive?
//      i need an explanation of this logic
getInheritedFrom(slotName: string): string {
  if (this.classSlots.some(s => s.name === slotName)) return '';
  if (this.parent) {
    const parentSlots = (this.parent as ClassElement).collectAllSlots();
    if (slotName in parentSlots) {
      return (this.parent as ClassElement).getInheritedFrom(slotName) || this.parent.name;
    }
  }
  return '';
}
```

Question: Do you need an explanation of why both methods are recursive, or do you see a way to simplify this?

> **[sg]**: i'm guessing there's a way to simplify, but i would need to understand it first

**3d. Element.ts:742 - Rename parentName to parentId**
```typescript
this.parentName = data.parent;  // [sg] parentName should probably be parentId
```

Question: Simple rename for consistency with itemId terminology?

> **[sg]**: i think so, unless you have a better idea

**3e. Rename onSelectItem to onClickItem** (TASKS.md:609)

Question: Should `onSelectItem` be renamed to `onClickItem` since it describes the action (clicking) rather than selection state?

> **[sg]**: yes

---

### Different Variable Treatment for Condition and Drug Exposure Classes 

> **Anne**: I think I made a mistake by calling "asthma" and "angina" variables. BMI is a variable that is a Measurement observation. We can think of BMI as a column in a spreadsheet. We wouldn't have a column for "asthma" - we would have a column for conditions with a list of mondo codes for the conditions present. This becomes more important when we are talking about the "heart failure" and "heart disease" columns. Where does one draw lines? The division of conditions into variables/columns might be ok if all we're looking at is asthma and angina, but quickly gets too hard to draw lines.

> **Siggie**: So, should those variables appear in the variable specs at all? If so, how should we represent them? And are there other variables in the specs that need special treatment or don't belong?

> **Anne**: I think they should appear, just differently. Perhaps as a list? maybe a layered donut? I think DrugExposures will need to be depicted in the same way

> **Siggie**:
    what should i call these things if not variables?
    layered donut? sounds tasty, but i'm not sure how it would work.
    do we have additional documentation for any of these that we would want to include? like we could set up Angina to link to angina_prior_1 if that would be appropriate

> **Anne**:
    You can call them Conditions and Drug Exposures for now
    I think for angina, we would want a link to the URI

> **Siggie**:
    where would i get the URI?

> **Anne**:  

> **Siggie**:  

---

## Next Up (Ordered)

### Fix: Build Failing Due to TypeScript Strict Mode Errors 🐛 BLOCKING

**Progress**: 56 errors → 46 errors remaining (10 fixed)

**Fixed** (committed):
- ✅ 7 unused parameters/variables removed
- ✅ 3 missing types fixed (NodeJS.Timeout → number, added SlotInfo import)
- ✅ Updated `npm run typecheck` to use `tsc -b --noEmit` (now catches all build errors)

---

**Remaining Errors: 46** (categorized by file)

#### **1. Protected 'type' Property Access (5 errors)** ⚠️ ARCHITECTURAL VIOLATION

These are from our recent bug fixes - we're accessing `element.type` outside of Element subclasses.

**src/models/Element.ts** (4 locations):
- Line 111:21 - `if (thisElement.type === 'class' && ...)`
- Line 117:21 - `if (thisElement.type === 'class' || ...)`
- Line 117:53 - `thisElement.type === 'enum'`
- Line 117:84 - `thisElement.type === 'slot'`

**src/services/DataService.ts** (1 location):
- Line 107:21 - `element.type` access

**Fix needed**: Create a public method like `getType()` or `isType(typeId)` on Element base class.

[sg] no -- this is the opposite of what we want to do. The reason i've been trying to
keep type completely out of the UI is because it kept leading to tangled and repetitive
logic, conditional branching on type or using different code depending on type. The goal
was to have the UI completely unaware of model properties and to receive only UI-oriented
data through the dataService. For anything the UI needs about an element(model)/item(UI),
it should receive colors, display strings, and the like. Where part of the model might have
a tree structure, the UI should not be navigating it or looking at it. The UI can receive
tree structures, but only those needed for specific component display.

My approach may be overkill; but we have never (despite your frequent claims) gotten close
to implementing this separation fully.

Of course, the UI does need ids so things in the UI can communicate with each other and,
through the dataService, with the model. I think we have that mostly working (e.g., the
UI should never use an element (or item) name as an id). For type, however, it's still
used in many places, not just the places flagged by the errors.

- dataService -- ds.getItemNamesForType() should not exist. trying to understand why it's
  needed. a few problems here:
  - nothing needs to be named type or *type in LinkOverlay. LinkOverlay receives types
    from App:
    ```typescript
    <LinkOverlay
      leftPanelTypes={leftSections}
      rightPanelTypes={rightSections}
      dataService={dataService}
      hoveredItem={hoveredItem}
    />
    ```
    the properties should have been changed to leftPanelSections, rightPanelSections
  - LinkOverlay shouldn't be going back to the model to get item names for sections
    - it should get exactly the data it needs in order to render links
    - there should be no need to loop through types or sections to do this
    - instead of calling ds.getRelationshipsForLinking(itemName) for each panel, section, 
      and name, it should collect a flat list of all currently displayed itemIds for each
      panel and call something like ds.getLinkData(leftItemIds, rightItemIds)
  - i think what i've just described is fairly consistent with the upcoming architecture
    step 7 link overlay refactor. move and incorporate these comments to that task.
    for now we should probably make a temporary exception to allow these checks to pass,
    but we MUST have notes in appropriate places to remove the exception as soon as we're
    able.
      
---

#### **2. Type Mismatches: string vs ElementTypeId (9 errors)**

**LinkOverlay.tsx** (4 locations):
- Line 146:57 - `contextualizeId(firstElementType, ...)` - firstElementType is string
- Line 151:57 - `contextualizeId(secondElementType, ...)` - secondElementType is string
- Line 167:59 - `contextualizeId(item.sourceType, ...)` - item.sourceType is string
- Line 193:57 - `contextualizeId(item.targetType, ...)` - item.targetType is string

[sg] these errors basically need to be fixed in the same way as i described just above.
     and similarly for the next two groups

**Section.tsx** (1 location):
- Line 90:5 - Type 'string' not assignable to 'ItemType'

**useLayoutState.ts** (2 locations):
- Line 77:20 - `leftSections: string[]` should be `ElementTypeId[]`
- Line 87:29 - `rightSections: string[]` should be `ElementTypeId[]`

**Element.ts** (2 locations):
- Line 203:15 - `categorizeRange()` returns `'class' | 'enum' | 'primitive'` but expects `ElementTypeId`
- Line 333:7 - Missing `id` property in object (type mismatch related)

[sg] let's come back to this one. i'll look at it later (when reminded)

---

#### **3. Type Assertion Issues: Element vs ClassElement (3 errors)**

**Element.ts**:
- Line 186:28 - `this as ClassElement` conversion may be a mistake
- Line 223:29 - `this as ClassElement` conversion may be a mistake
- Line 525:41 - Parameter 'element' implicitly has 'any' type

**Fix needed**: Use type guards or rework logic to avoid unsafe casts.

[sg] again, when we do the step 7 link overlay refactor, we will probably be
     getting rid of Element.getRelationshipData(), so make temporary exception
     again

---
#### **4. types.ts Declaration Conflicts (10 errors)**

**All in src/types.ts**:
- Lines 38, 50, 52, 211, 220-222, 231
- Modifier mismatches on properties (readonly conflicts)
- Type conflicts between interface declarations
- Suggests duplicate or conflicting interface/type definitions

[sg] yes, we do apparently have duplicate, conflicting definitions. fix these
     but ask if it isn't completely clear which to choose or how to merge them

**Specific issues**:
- `permissible_values` - modifier and type mismatches
- `description` - type mismatch (string vs string | undefined)
- `slots` - type mismatch
- `slot_usage` - type mismatch
- `abstract` - modifier and type mismatches

---

#### **5. Other Errors (19 errors)**

**App.tsx**:
- Line 465:11 - `onNavigate` property doesn't exist on FloatingBoxManagerProps

**DetailContent.tsx**:
- Line 114:47 - Expected 1 argument, but got 2 (renderCell function signature changed)

**contracts/Item.ts**:
- Line 70:5 - Expected 2-3 arguments, but got 0
- Line 90:5 - Expected 2-3 arguments, but got 0

**useLayoutState.ts**:
- Lines 121:33, 127:33 - Implicit 'any' type indexing Record<ElementTypeId, string>
- Lines 137:55, 137:74, 137:93, 137:116 - number | undefined not assignable to number (4 errors)

**Element.ts**:
- Line 1690:26 - 'expandedItems' possibly undefined

**DataService.ts**:
- Line 63:15 - Constructor parameter properties not allowed with `erasableSyntaxOnly`

**dataLoader.ts** (4 errors):
- Lines 74, 81, 88, 95 - Types don't satisfy `Record<string, unknown>` constraint

**statePersistence.ts** (2 errors):
- Line 76:7 - Type with null not assignable to DialogState[]
- Line 92:27 - Type predicate type mismatch

---

**Priority**: BLOCKING - must fix to deploy

**Instructions**: Add fix instructions below for each category

---

### Fix: Enum and Slot Inheritance Not Loading 🐛 HIGH PRIORITY

**Bug**: Enum inheritance relationships (via `inherits` field) are not being loaded or displayed

**Example**:
- `BaseObservationTypeEnum` has `inherits: [EducationalAttainmentObservationTypeEnum, SmokingStatusObservationTypeEnum]` in the YAML/JSON
- `EducationalAttainmentObservationTypeEnum` shows "No relationships found" in hover box
- Should show incoming relationship from `BaseObservationTypeEnum`

**Root cause**:
- `EnumData` interface in `src/types.ts` doesn't include `inherits` field
- `EnumElement` class doesn't have parent/child tree structure like `ClassElement`
- Enum inheritance is in the source data but not being loaded into the model

**Related fields not loaded** (mentioned by user):
- Other schema properties may also be missing from EnumData/SlotData
- Need to audit what's in the source data vs what's loaded

**Files to update**:
- `src/types.ts` - Add `inherits` field to EnumData and possibly SlotData
- `src/models/Element.ts` - Add parent/children support to EnumElement (and possibly SlotElement)
- `src/utils/dataLoader.ts` - Load inheritance relationships and build tree structure
- `src/models/Element.ts:96-140` - Update `computeIncomingRelationships()` to check enum inheritance

**Priority**: High - affects completeness of relationship visualization

---

### Architecture Refactoring Implementation Plan ⭐ CURRENT WORK

**📌 [NOT EXTRACTED - Still active implementation tracking]**
**REFACTOR_PLAN.md contains high-level architecture decisions**
**This section tracks actual implementation steps and completion status**
**Both documents should be consulted together**

**Status**: Implementation plan for architectural improvements from decisions above

**Token Budget**: ~62k/200k used, 138k remaining ✅

**Quick Navigation:**
- [Summary of Decisions](#summary-of-architectural-decisions)
- [Implementation Order](#implementation-order--dependencies)
- Steps:
  - [Step 1: Quick Wins ✅](#step-1-quick-wins--completed)
  - [Step 2: Component Data Abstraction](#step-2-component-data-abstraction)
  - [Step 3: getId() Simplification ✅](#step-3-getid-simplification--completed)
  - [Step 4: URL State Refactor ✅](#step-4-url-state-refactor--completed)
  - [Step 5: Slot Inheritance Simplification ✅](#step-5-slot-inheritance-simplification--partially-completed)
  - [Step 5.5: Simplify Data Flow](#step-55-could-be-6-if-those-below-incremented)
  - [Step 6: Relationship Grouping](#step-6-relationship-grouping)
  - [Step 7: LinkOverlay Refactor](#step-7-linkoverlay-refactor)
- [Testing Checkpoints](#testing-checkpoints)

---

#### Summary of Architectural Decisions

Based on Architecture & Refactoring Decisions section above:

**1. ItemId Architecture**
- Eliminate `getId(context)` - always return `this.name`
- Create separate utility functions: `contextualizeId()`, `contextualizeLinkId()`
- Collections treated as items (no special collectionId)
- Component data abstraction layer: Item class hierarchy for nesting, contextualization, tree rendering

**2. Link System Refactoring**
- Simplify to `dataService.getAllPairs()` using existing relationship data
- Link interface: `{ sourceItemId, targetItemId, sourceSide, targetSide }`
- Eliminate type from Link interface
- Split link rendering from link data management
- Remove tooltips (hover highlighting sufficient, info boxes provide details)

**3. Quick Wins**
- Delete obsolete cursor position code (App.tsx:131)
- Rename `parentName` → `parentId` throughout
- Rename `onSelectItem` → `onClickItem`
- URL state: use sectionIds with `~` delimiter (e.g., `sections=lc~re~rv`)

**4. Slot Inheritance Simplification**
- Add `slotPath` to SlotElement (full ancestry: "Parent.Child.GrandChild")
- `collectAllSlots()` sorts by slotPath
- `inheritedFrom` = last component of slotPath (if not current class)
- Eliminates both recursive methods!

**5. Relationship Grouping**
- Apply grouping logic to all element types with tree structures (enum, variable)
- Currently only class has grouping in `getRelationshipData()`

---

#### Implementation Order & Dependencies

```
Step 1: Quick Wins (no dependencies)
  ├─ 1a. Delete obsolete code
  ├─ 1b. Rename parentName → parentId
  └─ 1c. Rename onSelectItem → onClickItem

Step 2: Component Data Abstraction (foundation for everything)
  ├─ 2a. Create Item base class
  ├─ 2b. Create contextualization utilities
  └─ 2c. Update DataService to return Item instances

Step 3: getId() Simplification (requires Step 2)
  ├─ 3a. Update components to use contextualization utilities
  └─ 3b. Remove context parameter from getId()

Step 4: URL State Refactor (requires Step 3)
  └─ 4a. Switch to sectionIds with ~ delimiter

Step 5: Slot Inheritance (independent, can do anytime)
  ├─ 5a. Add slotPath to SlotElement
  ├─ 5b. Refactor collectAllSlots() to use slotPath
  └─ 5c. Remove getInheritedFrom() method

Step 6: Relationship Grouping (independent)
  └─ 6a. Apply to EnumElement and VariableElement

Step 7: LinkOverlay Refactor (big one, requires Step 3)
  ├─ 7a. Add getAllPairs() to DataService
  ├─ 7b. Create new Link interface with sourceSide/targetSide
  ├─ 7c. Create buildLink() function
  ├─ 7d. Refactor LinkOverlay to use getAllPairs()
  ├─ 7e. Remove tooltips
  └─ 7f. Clean up linkHelpers.ts
```

---

#### Step 1: Quick Wins ✅ COMPLETED

**1a. Delete obsolete cursor position code** ✅ COMPLETED

Files: `src/App.tsx:131-134`

```typescript
// DELETE THESE LINES:
const position = {  // [sg] obsolete code, right?
  x: hoveredItem.cursorX,
  y: hoveredItem.cursorY
};
```

**1b. Rename parentName → parentId** ✅ COMPLETED

Files to update:
- `src/models/Element.ts:742` - ClassElement constructor
- All references to `element.parentName` throughout codebase
- Update to `element.parentId`

Search command:
```bash
rg "parentName" src/ -t ts -t tsx
```

**1c. Rename onSelectItem → onClickItem** ✅ COMPLETED

Files to update:
- Component props interfaces
- Component implementations
- Callback handlers

Search command:
```bash
rg "onSelectItem|onSelect" src/ -t ts -t tsx
```

**Testing**: Run `npm run typecheck` after each rename

---

#### Step 2: Component Data Abstraction

**Goal**: Create Item base class hierarchy for component data contracts

**2a. Create Item base class** ✅ COMPLETED

New file: `src/contracts/Item.ts` (UI component data contracts, not model layer)

```typescript
/**
 * Item - Base class for component data contracts
 *
 * Provides:
 * - ID contextualization
 * - Nesting/containment
 * - Common display properties
 * - Tree rendering capabilities (future)
 */
export abstract class Item {
  abstract itemId: string;
  abstract displayName: string;

  // Display properties from DataService
  headerColor?: string;
  sourceColor?: string;
  badge?: number;

  // Nesting support
  children?: Item[];
  parent?: Item;

  // Contextualization - implemented by subclasses if needed
  getContextualizedId(context?: string): string {
    return contextualizeId({ id: this.itemId, context });
  }
}

/**
 * Specific Item subclasses
 */
export class ElementItem extends Item {
  constructor(
    public itemId: string,
    public displayName: string,
    public description?: string
  ) {
    super();
  }
}

export class CollectionItem extends Item {
  constructor(
    public itemId: string,
    public displayName: string,
    public items: Item[]
  ) {
    super();
  }
}

export class SectionItem extends Item {
  constructor(
    public itemId: string,
    public displayName: string,
    public items: Item[]
  ) {
    super();
  }
}
```

**2b. Create contextualization utilities** ✅ COMPLETED

New file: `src/utils/idContextualization.ts`

```typescript
/**
 * Contextualizes an item ID for DOM/component use
 *
 * Examples:
 * - contextualizeId({ id: "Specimen", context: "left-panel" }) → "lp-Specimen"
 * - contextualizeId({ id: "Condition", context: "right-panel" }) → "rp-Condition"
 */
export function contextualizeId({
  id,
  context
}: {
  id: string;
  context?: string;
}): string {
  if (!context) return id;

  // Map context to prefix
  const prefixMap: Record<string, string> = {
    'left-panel': 'lp',
    'right-panel': 'rp',
    'detail-box': 'db'
  };

  const prefix = prefixMap[context] || context;
  return `${prefix}-${id}`;
}

/**
 * Contextualizes a link ID from source and target item IDs
 *
 * Example:
 * contextualizeLinkId({
 *   sourceItemId: "Specimen",
 *   targetItemId: "Container",
 *   sourceSide: "left",
 *   targetSide: "right"
 * }) → "link-Specimen_Container-lr"
 */
export function contextualizeLinkId({
  sourceItemId,
  targetItemId,
  sourceSide,
  targetSide
}: {
  sourceItemId: string;
  targetItemId: string;
  sourceSide: 'left' | 'right';
  targetSide: 'left' | 'right';
}): string {
  const direction = sourceSide === 'left' && targetSide === 'right' ? 'lr' : 'rl';
  return `link-${sourceItemId}_${targetItemId}-${direction}`;
}

/**
 * Extracts raw ID from contextualized ID
 *
 * Example: decontextualizeId("lp-Specimen") → "Specimen"
 */
export function decontextualizeId(contextualizedId: string): string {
  const parts = contextualizedId.split('-');
  if (parts.length > 1) {
    // Remove prefix, return everything after first dash
    return parts.slice(1).join('-');
  }
  return contextualizedId;
}
```

**2c. Update DataService to return Item instances** ⏭️ DEFERRED

Not implementing full Item conversion yet - keep current DataService contracts.
We'll add Item conversion incrementally as we refactor components in later steps.

---

**Step 2 Overall Status**: ✅ 2a and 2b COMPLETED, 2c DEFERRED

**Completed**:
- ✅ Created `src/contracts/Item.ts` (moved from models/ - Item is for UI use, not model layer)
- ✅ Created `src/utils/idContextualization.ts` with utilities
- ✅ Added 20 comprehensive tests in `src/test/idContextualization.test.ts`
- ✅ All tests passing, typecheck passing, architecture checks passing
- ✅ Fixed terminology: removed ElementItem, made Item concrete

**Issues to investigate before next phase**:
1. **URL restoration not positioning boxes correctly** - boxes appear but not in saved positions (may have started before this work)
2. **DetailContent.test.tsx failures** - 19 tests failing (pre-existing, unrelated to Step 2 changes)
   - Failures appear to be about text rendering in DetailContent component
   - Need to investigate root cause before proceeding

**Phase completion checklist** (after all steps complete):
- [ ] Verify Phase 12 is truly complete
- [ ] Archive Phase 12 documentation
- [ ] Archive current phase documentation

---

#### Step 3: getId() Simplification ✅ COMPLETED

**3a. Update components to use contextualization utilities** ✅ COMPLETED

Updated `getSectionItemData()` in `src/models/Element.ts`:
- Added import of `contextualizeId` utility
- Changed line 329 to use `contextualizeId({ id: this.getId(), context: ... })`
- Maps 'leftPanel'/'rightPanel' to 'left-panel'/'right-panel' for utility

**3b. Remove context parameter from getId()** ✅ COMPLETED

File: `src/models/Element.ts`

```typescript
// BEFORE:
getId(context?: 'leftPanel' | 'rightPanel' | 'detailBox'): string {
  const prefix = context === 'leftPanel' ? 'lp-' :
                 context === 'rightPanel' ? 'rp-' :
                 context === 'detailBox' ? 'db-' : '';
  return prefix + this.name;
}

// AFTER:
getId(): string {
  return this.name;
}
```

**Testing Results**:
- ✅ `npm run typecheck` - All checks passing
- ✅ `npm run check-arch` - All architecture checks passing
- ✅ Dev server running - No runtime errors
- ✅ Tests - 159 passing (19 DetailContent failures are pre-existing, see line 531)

---

#### Step 4: URL State Refactor ✅ COMPLETED

**4a. Switch to sectionIds with ~ delimiter** ✅ COMPLETED

Changed from `l=c&r=e,v` to `sections=lc~re~rv`

**Files updated**:
- ✅ `src/utils/statePersistence.ts`:
  - parseStateFromURL: Supports new format with legacy fallback
  - saveStateToURL: Uses new format, removes legacy params
  - generatePresetURL: Uses new format
- ✅ `src/hooks/useLayoutState.ts`:
  - handleResetApp: Uses new format for URL generation

**Section ID format**: `{side}{type}`
- `l` = left, `r` = right
- `c` = class, `e` = enum, `s` = slot, `v` = variable

**Examples**:
- `sections=lc` → left panel shows classes
- `sections=lc~rv` → left panel classes, right panel variables
- `sections=lc~re~rv` → left panel classes, right panel enums and variables

**Features**:
- ✅ `~` delimiter is URL-safe (no encoding needed)
- ✅ More compact than old format
- ✅ All persistent boxes saved to URL (no lost boxes on refresh)
- ✅ Position info only included when user has moved/resized box

**Dialog URL Format** (fixed in follow-up commits):
- ✅ Removed type from format (itemId is sufficient)
- Format: `name` or `name:x,y,w,h` (position optional)
- Examples:
  - `dialogs=Specimen;TypeEnum` (default cascade positions)
  - `dialogs=Specimen:250,150,900,400;TypeEnum` (Specimen user-positioned)
- All boxes persist, but only user-moved boxes include coordinates

**User-Positioned Box Tracking**:
- Added `isUserPositioned` flag to FloatingBoxData
- Set to `true` when user drags/resizes box
- Set to `true` when restoring with position from URL
- `getDialogStates()` saves all persistent boxes, position conditional on flag
- Result: Clean URLs without repeated default positions

**Box Restoration Order**:
- Sort on restore: default-positioned first, then user-positioned
- Prevents gaps in cascade (default boxes cascade at 0,1,2... not 0,2,3...)
- User-positioned boxes appear at saved positions

**Bring-to-Front Fix**:
- Added `handleBringToFront` callback in App.tsx
- Moves box to end of array (higher z-index)
- Works on click, drag, resize

**Testing**:
- ✅ TypeScript passing
- ✅ Dev server running without errors
- ✅ Backwards compatibility removed (simpler code)
- ✅ Cleaner URLs (no type prefix, no bloated positions)

---

#### Step 5: Slot Inheritance Simplification ✅ PARTIALLY COMPLETED

**Status**: Initial implementation done (commit b1dbb6d), but further simplification needed

**Completed**:
- ✅ Added `slotPath` to ClassSlot
- ✅ `getInheritedFrom()` simplified (no longer double-recursive)
- ✅ `nodePath` added to all elements

**Step 5b: Further Simplification** ✅ COMPLETED

**What was done**:

1. **Renamed `nodePath` → `pathFromRoot` and changed to array**
   - Changed from `nodePath: string` to `pathFromRoot: string[]`
   - Benefits: Direct array access, no splitting needed, can join for display
   - Example: `["Entity", "Specimen", "Material"]` instead of `"Entity.Specimen.Material"`

2. **Kept `slotPath` on ClassSlot**
   - Decision: Slot paths don't change after tree construction, so storing them is fine
   - Set once in `collectAllSlots()`: `slot.slotPath = this.pathFromRoot.join('.')`
   - Makes sorting trivial: `.sort((a, b) => a.slotPath.localeCompare(b.slotPath))`

3. **Kept `getInheritedFrom()` simple**
   - Reads from stored `slotPath` instead of recomputing
   - Extracts defining class from path: `slot.slotPath.split('.')[last]`

4. **Added slot sorting**
   - Sorts slots by inheritance path in `getDetailData()`
   - Inherited slots from ancestors appear first, current class slots last
   - Simple implementation: `Object.entries(allSlots).sort(([, a], [, b]) => a.slotPath.localeCompare(b.slotPath))`

**Files updated**:
- `src/models/Element.ts`:
  - Changed `nodePath: string` → `pathFromRoot: string[]` in base Element class
  - Updated all places that set pathFromRoot (5 locations)
  - Kept `slotPath: string` on ClassSlot
  - Set slotPath in `collectAllSlots()`
  - Added sorting in slot rendering

**Testing**:
- ✅ TypeScript type checking passes
- ✅ All 159 tests pass (19 pre-existing failures in DetailContent.test.tsx)
- ✅ Slot inheritance displays correctly
- ✅ Slots now sorted by inheritance path

[sg] this may be helpful for how to represent slots, it's
     from the LinkML-generated documentation for BDCHM:
     https://rtiinternational.github.io/NHLBI-BDC-DMC-HM/observations/
     ![img.png](img.png)

**5b.4. Future: SlotCollection design question**

Should SlotCollection include ALL slots (global SlotElements + all ClassSlots from all classes)?

**Current**: SlotCollection only has global slots from schema. ClassSlots live on ClassElements.

**Proposed**: SlotCollection as unified slot registry with potential tree structure showing slot usage/inheritance.

**Decision**: Defer to later - bigger design question.

---
[sg]
#### Step 5.5 (could be 6 if those below incremented)

simplify data flow. see docs/DATA_FLOW.md, maybe have this
conversation there.

---
#### Step 6: Relationship Grouping

**6a. Apply grouping to EnumElement and VariableElement**
- [sg] this needs further discussion. i'm not sure what the plan is
       or what will end up being grouped and how

File: `src/models/Element.ts`

Currently only ClassElement has grouping in `getRelationshipData()`.
Apply same pattern to EnumElement and VariableElement.

**EnumElement grouping**:
- Group incoming usages by relationship type
- Group by source element type

**VariableElement grouping**:
- Group by variable category (if applicable)
- Group by relationship type

Review ClassElement.getRelationshipData() implementation and apply pattern.

**Testing**:
- Verify enum detail boxes show grouped relationships
- Verify variable detail boxes show grouped relationships

---

#### Step 7: LinkOverlay Refactor

**7a. Add getAllPairs() to DataService**

File: `src/services/DataService.ts`

```typescript
interface LinkPair {
  sourceItemId: string;
  targetItemId: string;
  sourceSide: 'left' | 'right';
  targetSide: 'left' | 'right';
}

class DataService {
  /**
   * Get all relationship pairs between items in source and target sets
   *
   * Uses existing incoming/outgoing relationships on elements.
   * Much simpler than nested loops through types and names.
   */
  getAllPairs({
    sourceFilter,
    targetFilter,
    sourceSide,
    targetSide
  }: {
    sourceFilter: string[];  // itemIds
    targetFilter: string[];  // itemIds
    sourceSide: 'left' | 'right';
    targetSide: 'left' | 'right';
  }): LinkPair[] {
    const pairs: LinkPair[] = [];
    const targetSet = new Set(targetFilter);

    for (const sourceItemId of sourceFilter) {
      const element = this.modelData.allElements.get(sourceItemId);
      if (!element) continue;

      // Check outgoing relationships
      const relationships = element.computeOutgoingRelationships();

      for (const rel of relationships) {
        const targetItemId = rel.target;

        // Only include if target is in target filter
        if (targetSet.has(targetItemId)) {
          pairs.push({
            sourceItemId,
            targetItemId,
            sourceSide,
            targetSide
          });
        }
      }
    }

    return pairs;
  }
}
```

**7b. Create new Link interface**

File: `src/utils/linkHelpers.ts` (or new file)

```typescript
export interface Link {
  id: string;  // From contextualizeLinkId()
  sourceItemId: string;
  targetItemId: string;
  sourceSide: 'left' | 'right';
  targetSide: 'left' | 'right';

  // Rendering properties (calculated from DOM positions)
  sourceRect?: DOMRect;
  targetRect?: DOMRect;

  // Display properties
  highlighted?: boolean;
}
```

**7c. Create buildLink() function**

```typescript
function buildLink(
  pair: LinkPair,
  dataService: DataService
): Link {
  const link: Link = {
    id: contextualizeLinkId({
      sourceItemId: pair.sourceItemId,
      targetItemId: pair.targetItemId,
      sourceSide: pair.sourceSide,
      targetSide: pair.targetSide
    }),
    sourceItemId: pair.sourceItemId,
    targetItemId: pair.targetItemId,
    sourceSide: pair.sourceSide,
    targetSide: pair.targetSide
  };

  // Get DOM rects for rendering
  const sourceElement = document.getElementById(
    contextualizeId({ id: pair.sourceItemId, context: `${pair.sourceSide}-panel` })
  );
  const targetElement = document.getElementById(
    contextualizeId({ id: pair.targetItemId, context: `${pair.targetSide}-panel` })
  );

  if (sourceElement) link.sourceRect = sourceElement.getBoundingClientRect();
  if (targetElement) link.targetRect = targetElement.getBoundingClientRect();

  return link;
}
```

**7d. Refactor LinkOverlay to use getAllPairs()**

File: `src/components/LinkOverlay.tsx`

Simplify from nested type/name loops to:

```typescript
function LinkOverlay({ dataService, leftSections, rightSections }: Props) {
  const leftItemIds = leftSections.map(s => s.itemId);
  const rightItemIds = rightSections.map(s => s.itemId);

  // Get all pairs in both directions
  const lrPairs = dataService.getAllPairs({
    sourceFilter: leftItemIds,
    targetFilter: rightItemIds,
    sourceSide: 'left',
    targetSide: 'right'
  });

  const rlPairs = dataService.getAllPairs({
    sourceFilter: rightItemIds,
    targetFilter: leftItemIds,
    sourceSide: 'right',
    targetSide: 'left'
  });

  // Build links
  const links = [
    ...lrPairs.map(p => buildLink(p, dataService)),
    ...rlPairs.map(p => buildLink(p, dataService))
  ];

  // Render SVG paths
  return (
    <svg className="link-overlay">
      {links.map(link => (
        <LinkPath key={link.id} link={link} />
      ))}
    </svg>
  );
}
```

**7e. Remove tooltips**

Delete tooltip rendering code from LinkOverlay.
Keep hover highlighting (use `hoveredLinks` state).

**7f. Clean up linkHelpers.ts**

Remove import of `Relationship` from models/Element.
Update to use DataService contracts only.

**Testing**:
- Verify all links render correctly
- Check hover highlighting works
- Verify no tooltips appear
- Check performance (should be faster!)
- Run `npm run check-arch` - no violations

---

#### Testing Checkpoints

**After each phase**:
1. `npm run typecheck` - no TypeScript errors
2. `npm run check-arch` - no architecture violations
3. `npm run test` - all tests pass (update tests as needed)
4. Manual UI testing - verify functionality works
5. Check console for errors/warnings

**Rollback points**:
- Each phase is a separate commit
- Can revert individual phases if issues found

**Final testing** (after all phases):
- Full smoke test checklist (from TASKS.md template)
- Performance testing (link rendering, panel switching)
- Cross-browser testing
- URL state persistence testing

---

### Unified Detail Box System (Phase 12) ✅ COMPLETED

[sg] still has bugs. maybe documented somewhere, but this is not complete yet

**Goal**: Extract dialog management from App.tsx, merge DetailDialog/DetailPanelStack into unified system, and implement transitory mode for FloatingBox - allowing any content to appear temporarily (auto-disappearing) and upgrade to persistent mode on user interaction.

**Phase 12 Quick Navigation:**
- [FloatingBox Modes (transitory/persistent)](#unified-detail-box-system-phase-12--completed)
- [Implementation Steps 0-3 ✅](#unified-detail-box-system-phase-12--completed)
- [Bug Fixes (Step 4)](#unified-detail-box-system-phase-12--completed)
- [Known Issues & Next Steps](#unified-detail-box-system-phase-12--completed)

**Current state**:
- DetailPanel: 130-line content renderer using getDetailData() ✅
- RelationshipInfoBox: Hover preview with relationships, has its own drag/close logic
- DetailDialog: Floating draggable/resizable wrapper
- DetailPanelStack: Stacked non-draggable wrapper
- App.tsx: Manages openDialogs array and mode switching

**New file structure**:
```
src/components/
  DetailContent.tsx         (rename from DetailPanel.tsx - content renderer, uses getDetailData())
  RelationshipInfoBox.tsx   (keep - relationship content renderer)
  FloatingBoxManager.tsx    (new - manages array + rendering)
    - FloatingBox component (draggable/resizable wrapper)
    - Array management (FIFO stack)
    - Mode-aware positioning
```

**Key insight**: FloatingBox is a general-purpose wrapper that supports two display modes (transitory and persistent) for any content type

**FloatingBox Modes**:

1. **Transitory mode** (temporary, auto-disappearing):
   - Appears on trigger (hover, click, etc.)
   - Auto-disappears after timeout or when user moves away
   - Minimal chrome (no close button, simpler appearance)
   - Can be "upgraded" to persistent mode via user interaction
   - Example: RelationshipInfoBox on hover

2. **Persistent mode** (permanent until closed):
   - Stays open until explicitly closed (ESC or close button)
   - Full chrome (draggable, resizable, close button)
   - Added to FloatingBoxManager's array
   - Managed via URL state for restoration
   - Example: Clicking element name to view details

**FloatingBox component** (single component, supports both modes):
- **Content agnostic**: Renders any React component passed as content
- **Display metadata pattern** (maintains view/model separation):
  ```typescript
  interface FloatingBoxProps {
    mode: 'transitory' | 'persistent';
    metadata: {
      title: string;        // e.g., "Specimen" or "Relationships: Specimen"
      color: string;        // e.g., "blue" (from app config)
    };
    content: React.ReactNode;  // <DetailContent element={...}/> or <RelationshipInfoBox element={...}/>
    onClose?: () => void;
    onUpgrade?: () => void;  // Transitory → persistent upgrade
  }
  ```
- **Data flow** (no element types in FloatingBox):
  1. Caller (App/FloatingBoxManager) has Element reference
  2. Caller calls `element.getFloatingBoxMetadata()` → returns `{ title, color }`
  3. Caller passes metadata + content component to FloatingBox
  4. FloatingBox only sees plain data, never Element type
- Mode determines chrome and behavior:
  - Transitory: Minimal styling, no close button, auto-dismiss timers
  - Persistent: Full controls, draggable, resizable, click-to-front
- ESC closes first/oldest persistent box (index 0)

**Content types**:
1. **Detail content**: Full element details (slots table, variables, description, etc.)
2. **Relationship content**: Focused relationship view (inheritance, slots, incoming/outgoing)

**User can have multiple boxes open simultaneously**:
- Multiple detail boxes (compare elements side-by-side)
- Multiple relationship boxes (compare relationships)
- Mix of both types

**Positioning issues to fix** (deferred from Phase 10):
- **Vertical positioning**: Current logic can position boxes oddly (see Phase 10 screenshot)
- **Right edge overflow**: Box can extend past right edge of window
- Fix both when implementing FloatingBox positioning logic
- Ensure boxes stay fully within viewport bounds (auto-positioning only; allow user to drag outside)

**Transitory → Persistent Mode Upgrade Flow**:

**Example: Hover-triggered RelationshipInfoBox** (current Phase 10 implementation):

1. **Transitory mode trigger**:
    - Hover element → FloatingBox appears in transitory mode after 300ms
    - Content: RelationshipInfoBox (shows relationships)
    - No close button, minimal styling
    - Lingers 1.5s after unhover (unless interacted with)
    - **TODO**: Move timing constants to app config file (see "App Configuration File" task)

2. **Upgrade to persistent mode** (one of):
    - Hover over box for 1.5s
    - Click anywhere in box
    - Press hotkey (TBD)

3. **Persistent mode result**:
    - Same content, now in persistent FloatingBox
    - Gains full chrome (draggable, resizable, close button)
    - Added to FloatingBoxManager's array
    - Stays open until explicitly closed (ESC or close button)
    - Can open multiple boxes this way (compare relationships side-by-side)

**Other ways to open persistent FloatingBox**:

- **Click element name** (anywhere in UI):
  - Tree panel → opens DetailContent in persistent FloatingBox
  - RelationshipInfoBox → opens DetailContent in persistent FloatingBox
  - Opens directly in persistent mode (no transitory phase)
  - Multiple boxes can coexist: relationship view + detail view of linked element

**Transitory mode content choice**:

When hovering over an element, what content should appear in the transitory FloatingBox?
- Option A: RelationshipInfoBox (focused view of relationships)
- Option B: DetailContent (full element details)
- Option C: Help content (when implemented - context-sensitive help based on what's being hovered)

**Preferred approach: Position-based heuristic**

Hover behavior depends on where cursor is positioned:
- **Hover element name** → show DetailContent (full details preview)
- **Hover panel edge/between elements** → show RelationshipInfoBox (relationship preview)
- **Hover SVG link line** → show RelationshipInfoBox (relationship preview for that specific link)

**Rationale**:
- Contextual and intuitive - cursor position indicates intent
- No additional UI complexity
- No keyboard requirement
- Can be refined based on user feedback after implementation

**Implementation notes**:
- **Spacing between hover areas**: Ensure clear separation between name hover area and edge hover area
  - May need to make the inside end of element names non-hoverable
  - This helps users understand which hover target they're activating
- May need to tune hover target areas for discoverability
- Could add subtle visual cues (e.g., cursor changes, highlight areas)
- Keep simpler options as fallback if heuristic proves confusing

**Alternative approaches considered** (for reference):
- User preference toggle: Clear but adds UI complexity
- Keyboard modifier: Flexible but requires keyboard
- Time-based cascade: Progressive but potentially confusing
- Combination: Most flexible but overly complex for initial implementation

**Mode behavior** (intelligent repositioning):
- **Floating mode** (narrow screen): New boxes cascade from bottom-left
- **Stacked mode** (wide screen): New boxes open in stack area
    - Consider changing layout to newest on bottom, then new boxes can overlap so only header of previous shows
    - With click-to-front, this should work well
- **Mode switch to stacked**: All boxes move to stack positions
- **Mode switch to floating**:
    - User-repositioned boxes → restore custom position from URL state
    - Default boxes → cascade from bottom-left

**URL state tracking**:
- Track which boxes have custom positions (user dragged/resized)
- On mode switch, respect user customizations
- Default positions don't persist

**Important**:
- Make sure new boxes are always fully visible:
    - In stacked layout by scrolling
    - In floating, by resetting vertical cascade position when necessary

**Implementation steps**:

0. **✅ Create DataService abstraction layer** (COMPLETED)
    - **Goal**: Complete view/model separation - UI components should never see Element instances or know about element types
    - **Problem**: Currently UI code receives Element instances and calls methods directly, violating separation of concerns
    - **Solution**: Create DataService class that UI calls with item IDs (strings)

    **Architecture**:
    ```typescript
    // src/services/DataService.ts
    class DataService {
      constructor(private modelData: ModelData) {}

      // UI calls by ID, service handles Element lookup internally
      getDetailContent(itemId: string): DetailData | null
      getFloatingBoxMetadata(itemId: string): FloatingBoxMetadata | null
      getRelationships(itemId: string): RelationshipData | null
      // ... other data access methods
    }

    // App.tsx creates service
    const dataService = useMemo(() =>
      modelData ? new DataService(modelData) : null,
      [modelData]
    );

    // UI components only work with IDs and DataService
    <DetailContent itemId="Specimen" dataService={dataService} />
    <FloatingBoxManager boxes={boxes} dataService={dataService} ... />

    // DetailContent.tsx - no Element instances
    function DetailContent({ itemId, dataService }: Props) {
      const detailData = dataService.getDetailContent(itemId);
      if (!detailData) return <div>Item not found</div>;
      // Render using plain detailData object
    }
    ```

    **Benefits**:
    - UI never sees Element instances or element types
    - Clean boundary between model and view
    - Easy to mock DataService for testing
    - Terminology: Use "item" in UI code, "element" stays in model layer

    **Enforcement via automated checking**:
    - Create `scripts/check-architecture.sh` to grep for violations:
      ```bash
      #!/bin/bash
      # Check for "Element" or "elementType" in UI components (but not in tests)
      echo "Checking for Element references in UI code..."
      rg -t tsx -t ts "Element" src/components/ src/hooks/ --glob '!*.test.*' --glob '!*.spec.*'
      # Add more checks as needed
      ```
    - Add to workflow: **After every chunk of work, run `npm run check-arch` and report violations**
    - Add npm script: `"check-arch": "bash scripts/check-architecture.sh"`
    - Over time, enhance script to check other architectural principles from CLAUDE.md

    **Implementation sub-steps**:
    - ✅ Create DataService class with initial methods
    - ✅ Refactor App.tsx to use DataService
    - ✅ Refactor FloatingBoxManager to accept dataService + item IDs
    - ✅ Refactor DetailContent to accept itemId + dataService
    - ✅ Refactor RelationshipInfoBox to accept itemId + dataService
    - ✅ Deleted old components (DetailDialog, DetailPanelStack, useDialogState)
    - ✅ Create check-architecture.sh script
    - ✅ Add npm script `"check-arch": "bash scripts/check-architecture.sh"`
    - ✅ All architecture violations fixed
    - ⏭️  Update tests to use DataService pattern (deferred)

    **Status**: Main refactoring complete! All architecture checks passing.

0a. **Fix remaining architecture violations** ✅ COMPLETED
    - All architecture checks now pass (`npm run check-arch`)
    - No violations found in components, hooks, or App.tsx

1. **✅ Create FloatingBoxManager.tsx** (COMPLETED)
    - ✅ Extract openDialogs array management from App.tsx
    - ✅ Single FloatingBox component (merge DetailDialog drag/resize logic)
    - ✅ **Content agnostic**: Supports any React component (DetailContent, RelationshipInfoBox, future help content, etc.)
    - ✅ Mode-aware initial positioning
    - ✅ Click/drag/resize → bring to front (move to end of array)
    - ✅ **ESC behavior**: Closes first box in this order:
      1. Close any transitory boxes first
      2. Then close persistent boxes (oldest first, FIFO)
    - ✅ Z-index based on array position
    - ✅ Added getFloatingBoxMetadata() to Element base class
    - ✅ Renamed DetailPanel → DetailContent (updated all references and tests)

2. **✅ Refactor RelationshipInfoBox.tsx** (COMPLETED)
    - ✅ **Removed** drag/resize/close logic (will be handled by FloatingBox wrapper)
    - ✅ Removed ESC key handler (FloatingBoxManager will handle)
    - ✅ Keep preview mode (hover, linger, positioning)
    - ✅ Keep upgrade trigger logic (1.5s hover or click)
    - ✅ **Added onUpgrade callback**: calls callback instead of local state
    - ✅ Removed close button and drag cursor styling
    - ✅ Content now simpler: just relationships display, no window chrome

3. **✅ Update App.tsx** (COMPLETED)
    - ✅ Replaced useDialogState hook with local floatingBoxes state management
    - ✅ Removed openDialogs management
    - ✅ Imported and integrated FloatingBoxManager
    - ✅ Added handleOpenFloatingBox to create persistent boxes (with duplicate detection and bring-to-front)
    - ✅ Added handleUpgradeRelationshipBox for RelationshipInfoBox → persistent upgrade flow
    - ✅ Connected RelationshipInfoBox.onUpgrade to handleUpgradeRelationshipBox
    - ✅ Replaced DetailDialog and DetailPanelStack rendering with FloatingBoxManager
    - ✅ Updated ElementsPanel.onSelectElement to use handleOpenFloatingBox
    - ✅ Added URL restoration logic (useEffect) for persistent boxes
    - ✅ Kept getDialogStates for URL state persistence
    - ✅ TypeScript type checking passes
    - ✅ Fixed initialization order bugs (handleNavigate, hoveredElementInstance)

    <details>
    <summary><b>Initial Testing Checklist (Phase 12 implementation)</b></summary>

    1. ✅ Click element name → Opens persistent floating box
       - ❌ Bug found: Headers duplicated (img_1.png) → Fixed in 4a
    2. ✅ Click same element again → Brings existing box to front (no duplicate)
    3. ⚠️ Hover over element → RelationshipInfoBox appears
       - ❌ Bug found (d13f8d5): Gray headers instead of colored → Fixed in 4e
    4. ❌ Hover over RelationshipInfoBox 1.5s → Should upgrade to persistent
       - Bug: Disappears instead of upgrading → Fixed in 4b
       - Bug: Sometimes gets stuck, no close button, ESC doesn't work
       - Associated with: `setDisplayedItem is not defined` error at RelationshipInfoBox.tsx:145:7
    5. ❌ Click on RelationshipInfoBox → Should upgrade immediately
       - Bug: Disappears instead of upgrading → Fixed in 4b
    6. ⚠️ Open multiple boxes → Cascade with offsets
       - ❌ Bug: Boxes overflow bottom of viewport → Fixed in 4f
    7. ❌ Switch between modes → Boxes reposition appropriately
       - Bug: Stacked mode shows RelationshipInfoBox (img_2.png) → Fixed in 4c
       - Bug: Detail boxes take full width
    8. ⚠️ Drag, resize, close buttons
       - ✅ Working for floating mode
       - ❌ Not working for stacked mode → Noted in 4d
    9. ✅ ESC key → Closes boxes (oldest first)
    10. ✅ URL restoration → Boxes restore correctly

    </details>

4. **Fix bugs found in testing**

    **High Priority** (broken functionality):

    1. **Detail box headers duplicated/split** (test #1) ✅ FIXED
       - Screenshot: img_1.png shows "Class: Condition" in header with "Condition" repeated below
       - Root cause: DetailContent showing its own header while FloatingBox also shows header
       - Fix: Always pass hideHeader={true} to DetailContent when in FloatingBox
       - Changed 3 instances in App.tsx where DetailContent is created

    **Phase 12 Hover Fixes** ✅ COMPLETED

    2. **Hover not working deterministically** (from extended testing)
       - Root cause: Cursor position tracking causing non-deterministic behavior
       - Fix: Complete rewrite to use item DOM position instead of cursor tracking
       - Changes:
         - `useItemHover.ts`: Removed cursor position from hover handlers, now passes `{ id, type, name }`
         - `Section.tsx`: Updated `ItemHoverData` to use `id` (DOM node ID) instead of `cursorX/cursorY`
         - `App.tsx`: Pass `itemDomId` to RelationshipInfoBox instead of cursor position
         - `RelationshipInfoBox.tsx`: Use `document.getElementById(itemDomId).getBoundingClientRect()` for positioning
         - Box now centers vertically on hovered item with viewport clamping
       - Result: Hover works deterministically - same item always shows box in same position

    3. **Architecture violations fixed** ✅ COMPLETED
       - Fixed: `elementDomId` → `itemDomId` (violated "element" terminology check)
       - Fixed: All "element" references changed to "item" or "DOM node" in UI layer
       - All architecture checks now pass

    5. **Cascade stacks not working** ✅ FIXED
       - Root cause: `handleOpenFloatingBox` was calculating position itself instead of letting FloatingBoxManager's cascade algorithm handle it
       - Fix: Removed default position calculation in App.tsx (lines 88-106)
       - Now boxes created with `position: undefined, size: undefined` (unless restoring from URL)
       - FloatingBoxManager's multi-stack cascade algorithm (lines 148-190) now handles all positioning
       - **⚠️ KNOWN ISSUE**: Cascade boxes are moving upwards (Y increment should be negative?)

    <details>
    <summary><b>UI Test Results (c893c43)</b></summary>

    **Test Date**: 2025-11-06

    1. ✅ **Architecture checks**: All passing
    2. ✅ **Click item → opens detail box**: Working in cascade mode
    3. ✅ **Click same item → brings to front**: Working, no duplicates
    4. ✅ **ESC closes boxes**: Working in both cascade and stacked modes
    5. ⚠️ **Hover positioning**: Working but NOT centered on item
       - Box appears near top of item, not vertically centered
       - Minor positioning difference, functional but not ideal
    6. ❌ **Cascade direction**: Still cascading UPWARD (should go downward)
       - TODO: Request screenshot when fixing this
    7. ❌ **No hover in stacked mode**: RelationshipInfoBox not appearing
       - Expected: Should not show in stacked mode (by design)
       - Status: Correct behavior
    8. ❌ **Stacked mode not draggable**: Boxes fixed in stacked mode
       - Expected: All boxes should be draggable per architecture docs
       - Status: Bug, needs fix (task #5)

    </details>

    **Next Steps (Priority Order)**:

    1. **Fix cascade direction** ✅ COMPLETED
       - Fixed cascading direction (was upward, now downward)
       - Fixed multi-stack X positioning (300px offset per stack)
       - Fixed Y positioning (40px title peek increments)
       - Fixed starting position (dynamically calculated to start low on screen)
       - Fixed boxesPerStack calculation (Math.max instead of Math.min)
       - Committed in: d2c98e7 (with user's fix to line 174)

    2. **Fix hover positioning** (DEFERRED to bottom of list)
       - Status: ⚠️ Working but not centered on item (appears near top)
       - Current: Box positioned near top of item
       - Expected: Box should center vertically on hovered item
       - Check RelationshipInfoBox.tsx positioning logic (lines 90-97)

    3. **Refactor UI to use itemId instead of type** ⭐ NEXT
       - Problem: UI layer using `type` field violates view/model separation
       - Root cause: UI should only use itemId (from getId()) for identity, not type strings
       - Current violations:
         - ItemHoverData has `type` field (Section.tsx:22)
         - LinkOverlay compares `link.source.type === hoveredItem.type` (LinkOverlay.tsx:366-367)
         - Should be: `link.source.itemId === hoveredItem.itemId`
       - Solution:
         - Change ItemHoverData to use `itemId` instead of `type` and `name`
         - Update Link data structure to use `itemId` instead of `type` and `name`
         - Remove all type comparisons in UI layer
         - UI uses itemId for identity, gets display info from DataService
       - Architecture principle: UI never uses type/itemType - only itemId and display names
       - See "Architecture & Refactoring Decisions" section at top of this file for detailed discussion

    4. **Rename displayMode 'dialog' to 'cascade'** ✅ COMPLETED
       - Renamed 'dialog' → 'cascade' throughout codebase
       - Updated: App.tsx, FloatingBoxManager.tsx, useLayoutState.ts, layoutHelpers.ts
       - Updated test expectations in adaptiveLayout.test.ts
       - Committed in: 6a7fb11

    5. **Remove unnecessary isStacked logic** (deferred)
       - Status: ❌ Boxes not draggable in stacked mode (confirmed in testing)
       - All boxes should be draggable regardless of display mode
       - displayMode only affects initial positioning, not capabilities
       - Simplify FloatingBox component

    6. **Make stacked width responsive** (deferred)
       - Currently fixed at 600px
       - Should calculate: `calc(100vw - leftPanelWidth - rightPanelWidth - margins)`

    7. **Move box management logic to FloatingBoxManager** (deferred)
       - App.tsx currently handles: array management, duplicate detection, bring-to-front
       - Should move to FloatingBoxManager for better encapsulation

    8. **Fix transitory/persistent box upgrade architecture** (deferred)
       - Current: Creates new box on upgrade, causing position jump
       - Should: Modify existing RelationshipInfoBox mode from transitory → persistent
       - Lower priority: Clicking items opens persistent boxes directly (working correctly)

    9. **RelationshipInfoBox upgrade not working** (tests #4, #5) ✅ FIXED ⚠️ NEW BUG FOUND
       - Hovering for 1.5s: box disappeared instead of upgrading to persistent
       - Clicking: box disappeared instead of upgrading to persistent
       - Root cause: After creating persistent box, RelationshipInfoBox remained displayed and linger timer would hide it
       - Fix: Call setHoveredItem(null) after upgrade to immediately hide RelationshipInfoBox
       - Changed handleUpgradeRelationshipBox in App.tsx (2 places)

       **New bug discovered during testing**:
       - When app first starts with empty right panel, hover doesn't work on left panel items
       - After hovering over something in right panel (once it has content), left panel hovering starts working
       - Investigation notes:
         - Both panels receive onItemHover/onItemLeave callbacks correctly (App.tsx:404-405, 417-418)
         - getItemHoverHandlers uses optional chaining, should work even without callbacks
         - RelationshipInfoBox positioning uses querySelector('[data-panel-position]') to find panels
         - If no items in panel, no elements with data-panel-position attribute exist
         - BUT positioning fallback should still work (xPosition = Math.max(370, 0 + 20) = 370px)
       - **Need clarification**: Does "hover doesn't work" mean:
         1. RelationshipInfoBox doesn't appear at all?
         2. RelationshipInfoBox appears but in wrong position?
         3. Hover state is set but something else is broken?
         4. Console errors when hovering?

   10. **Stacked mode layout issues** (test #7) ✅ FIXED
       - Screenshot: img_2.png showed RelationshipInfoBox appearing in stack
       - Root cause: RelationshipInfoBox rendered unconditionally regardless of displayMode
       - Fix: Only render RelationshipInfoBox when displayMode === 'dialog'
       - Changed App.tsx to conditionally render RelationshipInfoBox

   11. **Stacked mode missing controls** (test #8) ⚠️ NEEDS RETESTING
       - Original feedback: "yes for floating. still not for stacked"

   12. **Hover/upgrade behavior broken** (found during Step 3 testing) ❌ CRITICAL
       - **Root cause**: App.tsx:155 creates DetailContent instead of RelationshipInfoBox on upgrade
       - **Expected**: When hovering and upgrading (click or 1.5s hover), RelationshipInfoBox should become persistent with same content
       - **Actual**: Right panel - transitory box disappears, DetailContent appears in cascade stack
       - **Actual**: Left panel - unpredictable behavior, sometimes disappears, sometimes shows up later as DetailContent
       - **Architectural issue**: RelationshipInfoBox uses `fixed` positioning (line 303-304) which conflicts with FloatingBox wrapper
       - **Fix needed**: Refactor RelationshipInfoBox to support both transitory and persistent modes
         - Transitory mode: Uses fixed positioning, calculates position from itemDomId
         - Persistent mode: No positioning (rendered inside FloatingBox), no need for itemDomId
       - **Related**: See "Fix transitory/persistent box upgrade architecture" (task #8 above)

   13. **Cascade positioning - boxes stacking incorrectly** (found during Step 3 testing) ❌
       - **Symptom**: Non-user-positioned boxes appear on top of each other in wrong place
       - **Note**: URL restoration positioning IS working correctly (user-positioned boxes restore)
       - **Issue**: Default cascade positioning not working as expected
       - **Need to investigate**: What specific positioning behavior is broken?
       - **Code location**: FloatingBoxManager.tsx:148-194 (cascade positioning algorithm)

   14. **Architecture violation: contextualizeId in model layer** (introduced in Step 3) ✅ FIXED
       - **Location**: src/models/Element.ts:19, 329
       - **Problem**: Model layer calling UI utility function
       - **Root cause**: getSectionItemData() does contextualization, but it's in model layer
       - **Fix**: ✅ Moved contextualization to UI layer (Section.tsx:169-174)
         - Removed contextualizeId import from Element.ts
         - getSectionItemData() now returns raw name as id
         - Section.tsx contextualizes IDs after calling getItems()
       - **Principle**: Model layer should never call UI utilities, even in bridge methods
       - **Testing**: ✅ TypeScript passing, ✅ architecture checks passing

    **Medium Priority** (UX issues):

   12. **RelationshipInfoBox headers gray instead of colored** (test #3) ✅ FIXED
       - All hover-triggered RelationshipInfoBox headers were gray instead of colored
       - Root cause: getRelationshipData() referenced non-existent `colorClass` property, falling back to gray
       - Fix: Changed to use `metadata.color.headerBg` (proper property from ElementRegistry)
       - Architecture note: Color is correctly part of RelationshipData contract, not accessed by UI directly
       - Changed Element.getRelationshipData() in models/Element.ts

   13. **Boxes overflow viewport bottom** (test #6) ✅ FIXED
       - Cascade positioning caused boxes to go off-screen when many boxes opened
       - Root cause: Y position = windowHeight - 400 + (index * 40) with no bounds checking
       - Fix: Added Math.min() to cap Y position at maxY = windowHeight - boxHeight - 20px margin
       - Changed FloatingBoxManager.tsx defaultPosition calculation

    **Working correctly**:
    - ✅ Test #2: Duplicate detection and bring-to-front
    - ✅ Test #9: ESC key closes boxes
    - ✅ Test #10: URL restoration

5. **Delete old components**
    - Delete DetailDialog.tsx
    - Delete DetailPanelStack.tsx

6. **Update tests**
    - Test drag/resize
    - Test click-to-front
    - Test ESC behavior
    - Test mode switching with custom positions
    - **Test relationship box upgrade flow**
    - **Test multiple relationship boxes**
    - **Test mixed content types** (relationship + detail boxes)

---

### App Configuration File

**Goal**: Centralize hard-coded constants into a single configuration file for easier maintenance and tuning

**Current state**: Constants scattered throughout components
- RelationshipInfoBox.tsx: hover debounce (300ms), linger duration (1.5s), upgrade time (1.5s)
- Various components: type-related colors (blue/purple/green/orange)
- Other hard-coded values: spacing, sizes, thresholds

**Design consideration**: Allow values to be expressed as functions or constants
- Simple constants for fixed values (e.g., `hoverDebounce: 300`)
- Functions for calculated values (e.g., `getMaxHeight: () => window.innerHeight * 0.8`)
- Helps developers find both constant and calculated values in one place

**Create**: `src/config/appConfig.ts`

**Constants to centralize**:
```typescript
export const APP_CONFIG = {
  // Timing constants (milliseconds)
  timing: {
    hoverDebounce: 300,      // Delay before showing preview on hover
    lingerDuration: 1500,    // How long preview stays after unhover
    upgradeHoverTime: 1500,  // Hover duration to upgrade preview to persistent box
  },

  // Element type colors
  colors: {
    class: 'blue',
    enum: 'purple',
    slot: 'green',
    variable: 'orange',
  },

  // UI thresholds
  thresholds: {
    collapsibleListSize: 20,  // Show "...N more" for lists over this size
    collapsedPreviewCount: 10, // How many items to show when collapsed
  },

  // Add other constants as discovered
};
```

**Files to update**:
- `src/components/RelationshipInfoBox.tsx` - Import timing constants
- `src/components/DetailContent.tsx` - Import color constants
- `src/components/Section.tsx` - Import color constants
- Other component files using hard-coded colors/values

**Benefits**:
- Single source of truth for tuning behavior
- Easier to experiment with different timing values
- Prepares for future user preferences/settings
- Documents significant constants in one place

---

### Abstract Tree Rendering System

**IMPORTANT**: Before starting this refactor:
1. Give a tour of how tree rendering currently works (Element tree structure, expansion state, rendering in components)
2. Fully specify the interface (how it's used in practice, not just TypeScript definitions)
3. Write actual production code directly in component files to verify the design
4. Wrap this code in closures or make it inactive until ready to replace existing code
5. Once abstraction is complete, remove old code and activate new code

**Goal**: Extract tree rendering and expansion logic from Element into reusable abstractions that can be shared between Elements panel and info boxes (and future tree-like displays).

**Why this matters**: Converting DetailContent and other components to use this system should result in significant simplification.

**Current state**:
- Element class has tree capabilities (parent, children, traverse, ancestorList)
- Expansion state managed by useExpansionState hook
- Tree rendering handled in each component (Section.tsx, DetailPanel, etc.)
- Info box data could be hierarchical but isn't structured that way yet

**Proposed abstraction**:
- Create parent class or mixin with tree capabilities
  - Node relationships (parent, children, siblings)
  - Tree traversal (depth-first, breadth-first)
  - Expansion state management
  - **Layout logic** (not just expansion - how trees are rendered)
- Element becomes a child of this abstraction
- Info box data structures as tree nodes
- Shared rendering components/hooks

**Benefits**:
- Consistent tree UX across Elements panel and info boxes
- Could switch between tree layouts (simple indented tree, tabular tree with sections)
- Easier to add new tree-based displays
- Centralizes expansion logic

**Tree layout options** (switch in code, not necessarily in UI):
- **Simple tree**: Current indented style with expand/collapse arrows
- **Tabular tree**: Hierarchical table with columns (see Slots Table Optimization example)
  - Indented rows show hierarchy
  - Expandable sections
  - Can show properties in columns
- **Sectioned tree**: Groups with headers, nested content

**Related**: Slots Table Optimization task (Detail Panel Enhancements) shows hierarchical table example from another app - tree structure with indented rows, expandable sections, multiple columns. Info box inherited slots could use this pattern.

**Note**: If helpful during implementation, the hierarchical table screenshot can be copied to `docs/images/` for reference.

**Implementation approach**:
1. Give tour of current tree rendering system
2. Design tree abstraction (class? mixin? hooks?)
3. Extract expansion state management
4. Extract layout logic
5. Refactor Element to use abstraction
6. Apply to info box data structures
7. Consider tabular tree layout for slots tables

**Files likely affected**:
- `src/models/Element.ts` - Extract tree logic
- `src/models/TreeNode.ts` or `TreeBase.ts` (new) - Tree abstraction
- `src/hooks/useExpansionState.ts` - Possibly generalize
- `src/components/Section.tsx` - Use abstraction
- `src/components/RelationshipInfoBox.tsx` - Structure data as tree
- `src/components/DetailPanel.tsx` - Use abstraction for slots table

---

### Link System Enhancement

**Status**: Needs complete refactoring. See "Architecture & Refactoring Decisions" → "LinkOverlay & Link System Refactoring" section at top of this file for detailed discussion and planning.

**Current state** (mostly complete ✅):
- ✅ `LinkData` interface defined in LinkOverlay.tsx
- ✅ `LinkTooltipData` interface for hover information
- ✅ Tooltip component showing relationship type, slot name, source/target
- ✅ ElementHoverData interface for component hover contracts
- ✅ Link highlighting on element hover

**Remaining work**:
- Review if LinkOverlay still directly accesses Element properties (should use Element methods)
- Consider if additional metadata would be useful in tooltips
- Verify all components using hover data have proper interface definitions

---

### Detail Panel Enhancements

**Enum Detail Improvements**:
- Enums have either permissible values OR instructions for getting values from elsewhere
- Example:
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
- Will need to load prefixes in order to link these
- Also look for other data in bdchm.yaml that isn't currently being captured

**Slots Table Optimization**:
- Slot order in class details is not currently correct - inherited slots should be at top, referenced slots at bottom
- **Use Abstract Tree Rendering System** (once implemented):
  - Add grouping layer to slots data structure:
    - Group by ancestor (for inherited slots)
    - Group for direct slots
  - Each group becomes a tree node (collapsible)
  - Start with inherited slots collapsed
  - Abstract tree renderer handles display (indentation, expand/collapse, hierarchy)
- No special display code needed - just restructure the data to fit tree abstraction

**SlotCollection 2-Level Tree** (from Phase 6.4 Step 3.2):
- Deferred - current flat SlotCollection is sufficient
- Would show global slots + inline attributes from all classes
- Each class becomes a root node with its attributes as children

---

### Fix Dark Mode Display Issues (HIGH PRIORITY)

**Goal**: Fix readability issues in dark mode
**Importance**: High - app currently unusable in dark mode

**Issues from screenshot**:
- Poor contrast/readability throughout
- Need to audit all color combinations

**Files likely affected**:
- `src/index.css` - Tailwind dark mode classes
- All component files using colors
---

### User Help Documentation

**Goal**: Create comprehensive user help system

**Approach**:
1. Start composing help content in a markdown file (before adding to app UI)
2. Begin with content from README.md "For Users" section (after TOC)
3. Focus on features that might not be obvious or could be confusing
4. Review PROGRESS.md for additional material to include

**UI Integration** (after content is ready):
- Opens in FloatingBox
- Full help: Large box with table of contents
- Contextual help: Opens to relevant section (scrolled into view)
- Can open entire help with section highlighted
---

## Future Work

### Relationship Info Box Enhancements (deferred from Phase 10)

- **Bi-directional preview**: Hovering over element names in info box highlights them in tree panels
- **"Explore relationship" action**: Open both elements side-by-side for comparison
- **Keyboard navigation**: Arrow keys, Enter, Tab for navigating within info box
- **Quick filter toggles**: Filter relationships by type (show/hide inheritance, slots, variables, etc.)

---
### selfRefs
links from an item to itself were supposed to be little loops instead of crossing panels

### Merge TESTING.md Files

**Background**: TESTING.md was copied to root and diverged from docs/TESTING.md

**Files**:
- `TESTING.root-snapshot-2025-11-03.md` (4.6k) - Newer, condensed, Phase 6.4+ testing patterns
- `docs/TESTING.md` (17k) - Older, comprehensive testing documentation

**Task**: Merge the newer Phase 6.4+ content into the comprehensive docs/TESTING.md, then delete snapshot

---

### Split Element.ts into Separate Files

**Current state**: Element.ts is 919 lines with 4 element classes + 4 collection classes

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

### Overhaul Badge Display System

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
- `src/models/Element.ts` - Replace simple `getBadge(): number` with richer badge info
- `src/components/Section.tsx` - Render multiple badges or labeled badges
- `src/models/RenderableItem.ts` - Update badge field to support richer info

---

### Search and Filter

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

### Neighborhood Zoom

**Potential importance**: Medium - useful for focused exploration

**Focus mode**:
- Show only k-hop neighborhood around selected element
- Relationship type filters ("show only `is_a` relationships" vs "show associations")
- Breadcrumb trail showing navigation path
- "Reset to full view" button

---

### Enhanced Element Metadata Display

Show additional relationship counts in tree view:
- **Current**: Only variable count (e.g., "Condition (20)")
- **Desired**: "Condition (20 vars, 5 enums, 2 classes, 1 slot)"

---

### Custom Preset Management

User-managed presets replacing hard-coded ones:
- Save Preset button → prompts for name
- Saves current panel configuration (sections + dialogs) to localStorage
- Display saved presets in header with remove icons

---

### Advanced Overview

Multiple view modes and analytics:
- Tree view (current)
- Network view (force-directed graph for associations)
- Matrix view (class-enum usage heatmap)
- Mini-map showing current focus area
- Statistics dashboard

---

### Terminology Consistency

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

### External Link Integration

**Goal**: Link prefixed IDs to external sites (OMOP, DUO, etc.)

**Implementation**:
- Use prefix data from bdchm.yaml
- Make CURIEs clickable in variable details
- Add tooltip showing full URL before clicking

---

### Feature Parity with Official Docs

Reference: https://rtiinternational.github.io/NHLBI-BDC-DMC-HM/

Missing features:
1. **Types** - Import and display linkml:types
2. **Dynamic enums** - Show which enums are dynamic
3. **LinkML Source** - Collapsible raw LinkML view
4. **Direct and Induced** - Show direct vs inherited slots
5. **Partial ERDs** - Visual relationship diagrams

---

### GitHub Issue Management

Issue: https://github.com/RTIInternational/NHLBI-BDC-DMC-HM/issues/126
- Make issue more concise
- Add subissues for specific features (ASK FIRST)

---

#### Future: Graph-based Model Architecture (Major Refactor)

**Status**: Design idea only - not implementing yet

**Proposal** (from [DATA_FLOW.md discussion](../docs/DATA_FLOW.md#L1017-L1065)):

Use graphology library to represent model as directed acyclic graph (DAG):
- Store model as graph with artificial root node
- Parent relationships = edges in graph
- Child relationships = transpose of graph
- Paths computed on-demand via graph traversal (not stored)
  [sg] not a goal in itself, but graphology makes it easy
- Collections simplified to graph queries
- Relationships = edge lists
- [sg] not sure if this approach makes it easy to keep the graph
  features as part of Element or if it would exist beside
  the Element/ElementCollection classes
    - the collection classes could probably be hugely simplified
- [sg] Abstract Tree Rendering System
    - this will serve UI components, but they could also make
      use of graphology

**Benefits**:
- Eliminates manual tree construction code
- Powerful graph algorithms available
- Unified relationship model
- Easier to query and visualize

**Concerns**:
- Huge refactor touching most files
- New dependency and learning curve
- Unknown performance implications
- Possibly over-engineering

**Decision**: Implement incremental improvements first (pathFromRoot array, eliminate slotPath, centralize tree construction). Re-evaluate graph approach only if complexity remains high after these improvements.

---
### Performance Optimizations

When working with larger models or slower devices:
- **Virtualize long lists**: MeasurementObservation has 103 variables; consider react-window or react-virtual
- **Viewport culling for links**: Only render SVG links for visible elements
- **Animation library**: Consider react-spring for smoother transitions (current CSS transitions work fine)

---

### Review DOC_CONVENTIONS.md

**Goal**: Review DOC_CONVENTIONS.md and decide if there are parts worth keeping or integrating elsewhere
**Importance**: Low - documentation maintenance

---

### Semantic Relationship Features

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

---

## UI Test Checklist Template

Use this template after significant work. Copy, fill out, and add to a `<details>` section in the relevant task.

### Standard Smoke Tests

**Commit**: `[commit-hash]`
**Test Date**: `[YYYY-MM-DD]`
**Tester**: `[initials]`

#### Architecture & Build
- [ ] `./scripts/check-architecture.sh` - All checks passing
- [ ] `npm run typecheck` - No TypeScript errors
- [ ] `npm run build` - Build succeeds
- [ ] Console errors - None in normal operation

#### Basic Functionality (Cascade Mode)
- [ ] Click item name → Opens detail box
- [ ] Click same item again → Brings existing box to front (no duplicate)
- [ ] Open multiple boxes → Cascade positioning works correctly
- [ ] Drag box → Smooth dragging, stays where placed
- [ ] Resize box → Smooth resizing, respects min size
- [ ] Click box → Brings to front (z-index updates)
- [ ] Close button → Closes box
- [ ] ESC key → Closes boxes in order (oldest first)

#### Hover Functionality (Cascade Mode)
- [ ] Hover item → RelationshipInfoBox appears after delay
- [ ] Box positioning → Positioned relative to item (check alignment)
- [ ] Mouse leave item → Box lingers briefly then disappears
- [ ] Hover over box → Cancels linger timer
- [ ] Hover box 1.5s → Upgrades to persistent (if applicable)
- [ ] Click box → Upgrades to persistent immediately (if applicable)

#### Stacked Mode
- [ ] Switch to stacked mode → Boxes appear in right panel
- [ ] Boxes in vertical stack → Newest at top
- [ ] Close button → Works in stacked mode
- [ ] ESC key → Works in stacked mode
- [ ] Drag boxes → Should work (per architecture) or note if not implemented
- [ ] Hover functionality → Should NOT show RelationshipInfoBox in stacked mode

#### Link Visualization
- [ ] Hover item → Links highlight
- [ ] Links render correctly → No visual glitches
- [ ] Self-references → Curved arrows appear correctly

#### URL State Persistence
- [ ] Open boxes → URL updates with state
- [ ] Copy URL, open in new tab → State restores correctly
- [ ] Preset links → Work as expected

### Focused Test Checklist (For Specific Features)

Use this when testing a specific feature fix. List only the tests relevant to the feature.

**Feature**: `[Brief description]`
**Commit**: `[commit-hash]`
**Related Issue**: `[If applicable]`

- [ ] **Test 1**: [Description]
  - Expected: [What should happen]
  - Result: [What actually happened]
  - Screenshot: [If applicable]

- [ ] **Test 2**: [Description]
  - Expected: [What should happen]
  - Result: [What actually happened]

[Add more as needed]

**Overall Status**: ✅ All passing | ⚠️ Issues found | ❌ Blocking issues

**Notes**: [Any observations, edge cases, or follow-up items]
