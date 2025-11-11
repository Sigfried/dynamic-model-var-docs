# Data Flow Architecture

**Purpose**: Document the complete data flow from app loading through tree construction, slot/path handling, and link rendering.

**Related documents**:
- [COMPONENT_FLOW.md](./COMPONENT_FLOW.md) - UI component interaction flow
- [CLAUDE.md](../CLAUDE.md) - Architectural principles
- [TASKS.md](../TASKS.md) - Current work and refactoring plans

**Recent refactoring** (commits `b1dbb6d` through `e57e888`):
- Step 5: Slot inheritance simplification using `slotPath` ([commit b1dbb6d](https://github.com/sigfried/dynamic-model-var-docs/commit/b1dbb6d))
- Steps 1-4: getId() simplification, URL state refactor ([TASKS.md:328-638](../TASKS.md#L328-L638))

---

## Overview: App Startup Data Pipeline

```
┌──────────────────────────────────────────────────────────────────┐
│ 1. BROWSER STARTUP                                               │
│    React renders App.tsx                                         │
└────────────────┬─────────────────────────────────────────────────┘
                 │
                 v
┌──────────────────────────────────────────────────────────────────┐
│ 2. DATA LOADING (useModelData hook)                              │
│    • Fetches JSON/TSV files via fetch()                          │
│    • src/utils/dataLoader.ts:loadModelData()                     │
└────────────────┬─────────────────────────────────────────────────┘
                 │
                 v
┌──────────────────────────────────────────────────────────────────┐
│ 3. DTO TRANSFORMATION                                            │
│    • snake_case → camelCase (bdchm_element → bdchmElement)       │
│    • Field renames via FIELD_MAPPINGS                            │
│    • Creates: SchemaData { classes, enums, slots, variables }    │
└────────────────┬─────────────────────────────────────────────────┘
                 │
                 v
┌──────────────────────────────────────────────────────────────────┐
│ 4. MODEL INITIALIZATION (initializeModelData)                    │
│    • src/models/Element.ts:501                                   │
│    • Creates Element collections via fromData() methods          │
│    • Builds tree structures                                      │
│    • Computes nodePath, slotPath, relationships                  │
└────────────────┬─────────────────────────────────────────────────┘
                 │
                 v
┌──────────────────────────────────────────────────────────────────┐
│ 5. DATA SERVICE ABSTRACTION                                      │
│    • Wraps ModelData for UI consumption                          │
│    • src/services/DataService.ts                                 │
│    • UI uses itemId strings, never Element instances directly    │
└────────────────┬─────────────────────────────────────────────────┘
                 │
                 v
┌──────────────────────────────────────────────────────────────────┐
│ 6. COMPONENT RENDERING                                           │
│    • ItemsPanel → Section → tree display                         │
│    • LinkOverlay → relationship visualization                    │
│    • FloatingBoxManager → detail boxes                           │
└──────────────────────────────────────────────────────────────────┘
```

---

## Detailed Flow: Step by Step

[sg] a lot of hopping around between app, hook, dataLoader,
initializeModelData, fromData.

could be consolidated at all or made easier to follow?
while keeping specific element class code (e.g., fromData)
with classes and shared code elsewhere

maybe stuff is where it belongs but is confusing because of
similar naming all over the place

i'm not seeing obvious ways to simplify yet, but probably
will once we get to fromData methods

i'm not finding this layout easy to follow. trying to map it
out a bit more like a code graph

but let's review my proposal at the bottom before getting
deeper into this

```
App
   ==> hooks/useModelData()
      ==> utils/dataLoader.loadModelData()
         ==> schemaData = utils/dataLoader.loadRawData()
            ==> utils/dataLoader.loadSchemaDTO()
                - loads `source_data/HM/bdchm.metadata.json`
            ==> utils/dataLoader/loadVariableSpecDTOs()
                - loads `source_data/HV/variable-specs-S1.tsv`
         ==> Elements.initializeModelData(schemaData)
         ...
```


### Step 1: Browser Startup

**File**: [src/App.tsx:1-27](../src/App.tsx#L1-L27)

```typescript
function App() {
  // Load model data via hook
  const { modelData, loading, error } = useModelData();

  // Create DataService for view/model separation
  const dataService = useMemo(() =>
    modelData ? new DataService(modelData) : null,
    [modelData]
  );
  // ...
}
```

**useModelData hook**: [src/hooks/useModelData.tsx](../src/hooks/useModelData.tsx)
- Calls `loadModelData()` on mount
- Returns `{ modelData, loading, error }`

---

### Step 2: Data Loading

**File**: [src/utils/dataLoader.ts:128-131](../src/utils/dataLoader.ts#L128-L131)

```typescript
export async function loadModelData(): Promise<ModelData> {
  const schemaData = await loadRawData();  // Fetch + transform DTOs
  return initializeModelData(schemaData);  // Create Element collections
}
```

**loadRawData()** [dataLoader.ts:102-122](../src/utils/dataLoader.ts#L102-L122):
1. **Fetch files**:
   - `bdchm.metadata.json` → SchemaDTO (classes, enums, slots)
   - `variable-specs-S1.tsv` → VariableSpecDTO[]

2. **Transform DTOs to Data types**:
   - Uses `transformWithMapping<T>()` with `FIELD_MAPPINGS`
   - [src/types.ts:FIELD_MAPPINGS](../src/types.ts) defines snake_case → camelCase mappings
   - Example: `is_a` → `isA`, `slot_usage` → `slotUsage`

3. **Returns SchemaData**:
   ```typescript
   {
     classes: ClassData[],
     enums: Map<string, EnumData>,
     slots: Map<string, SlotData>,
     variables: VariableSpec[]
   }
   ```

---

### Step 3: Model Initialization

**File**: [src/models/Element.ts:501-535](../src/models/Element.ts#L501-L535)

```typescript
export function initializeModelData(schemaData: SchemaData): ModelData {
  // Create collections in dependency order
  const enumCollection = EnumCollection.fromData(schemaData.enums);
  const slotCollection = SlotCollection.fromData(schemaData.slots);
  const classCollection = ClassCollection.fromData(schemaData.classes, slotCollection);
  const variableCollection = VariableCollection.fromData(schemaData.variables, classCollection);

  // Initialize global references for relationships
  initializeClassCollection(classCollection);

  // Return ModelData
  return {
    collections: Map { 'class' → classCollection, 'enum' → enumCollection, ... },
    elementLookup: Map { 'Specimen' → ClassElement, 'TypeEnum' → EnumElement, ... }
  };
}
```

**Dependency order** (why this order matters):
1. **EnumCollection** - No dependencies (flat list)
2. **SlotCollection** - No dependencies (flat list)
3. **ClassCollection** - Needs `slotCollection` for ClassSlot validation
4. **VariableCollection** - Needs `classCollection` to group variables by class

**🔗 Upcoming work**: [TASKS.md:746-806](../TASKS.md#L746-L806) - LinkOverlay refactor will add `dataService.getAllPairs()` using relationship data

---

## Collection Creation: fromData() Methods

Each collection type has a static `fromData()` factory method that creates Element instances and builds tree structures.

### EnumCollection.fromData()

**File**: [src/models/Element.ts:1317-1328](../src/models/Element.ts#L1317-L1328)

**Structure**: Flat list (no hierarchy)

```typescript
static fromData(enumData: Map<string, EnumData>): EnumCollection {
  const roots = Array.from(enumData.entries())
    .map(([name, data]) => {
      const element = new EnumElement(name, data);
      element.nodePath = element.name;  // ← Flat list: nodePath = name
      return element;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  return new EnumCollection(roots);
}
```

**Key points**:
- No parent/child relationships
- `nodePath` set to element name (no ancestry)
- Sorted alphabetically

---

### SlotCollection.fromData()

**File**: [src/models/Element.ts:1392-1403](../src/models/Element.ts#L1392-L1403)

**Structure**: Flat list (no hierarchy)

```typescript
static fromData(slotData: Map<string, SlotData>): SlotCollection {
  const roots = Array.from(slotData.entries())
    .map(([name, data]) => {
      const element = new SlotElement(name, data);
      element.nodePath = element.name;  // ← Flat list: nodePath = name
      return element;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  return new SlotCollection(roots);
}
```

**Note**: Currently flat list. **Future work** ([TASKS.md:1632-1636](../TASKS.md#L1632-L1636)) discusses potential 2-level tree showing global slots + inline attributes grouped by class.

---

### ClassCollection.fromData() - Tree Construction

**File**: [src/models/Element.ts:1477-1521](../src/models/Element.ts#L1477-L1521)

**Structure**: Hierarchical tree (inheritance hierarchy)

This is where the main tree structure gets built!

```typescript
static fromData(classData: ClassData[], slotCollection: SlotCollection): ClassCollection {
  // 1. Create all ClassElements
  const elementMap = new Map<string, ClassElement>();
  classData.forEach(metadata => {
    const element = new ClassElement(metadata, tempModelData, slotCollection);
    elementMap.set(element.name, element);
  });

  // 2. Wire up parent-child relationships
  const roots: ClassElement[] = [];
  elementMap.forEach(element => {
    if (element.parentId) {
      const parentElement = elementMap.get(element.parentId);
      if (parentElement) {
        element.parent = parentElement;           // ← Set Element.parent
        parentElement.children.push(element);     // ← Add to parent's children
      } else {
        roots.push(element);  // Parent not found, treat as root
      }
    } else {
      roots.push(element);    // No parent = root element
    }
  });

  // 3. Sort children and compute nodePath recursively
  const sortAndComputePath = (element: Element, parentPath: string = '') => {
    // Compute nodePath: "Entity" or "Entity.Specimen" or "Entity.Specimen.Material"
    element.nodePath = parentPath ? `${parentPath}.${element.name}` : element.name;

    // Sort children alphabetically
    element.children.sort((a, b) => a.name.localeCompare(b.name));

    // Recurse to children
    element.children.forEach(child => sortAndComputePath(child, element.nodePath));
  };
  roots.forEach(root => sortAndComputePath(root));

  return new ClassCollection(roots);
}
```

**Tree properties set here**:
- `element.parent` - Reference to parent Element (or undefined for roots)
- `element.children` - Array of child Elements
- `element.nodePath` - Full path from root (e.g., `"Entity.Specimen.Material"`)

**Related**: [Element.ts:342-378](../src/models/Element.ts#L342-L378) defines tree navigation methods:
- `ancestorList()` - Walk up to root
- `traverse(fn)` - Depth-first traversal
- `toRenderableItems()` - Convert tree to flat list with indentation

---

### VariableCollection.fromData()

**File**: [src/models/Element.ts:1668-1720](../src/models/Element.ts#L1668-L1720)

**Structure**: Hierarchical tree (grouped by class)

Variables are grouped under their associated class, creating a tree structure.

```typescript
static fromData(variables: VariableSpec[], classCollection: ClassCollection): VariableCollection {
  // Group variables by bdchmElement (class name)
  const grouped = new Map<string, VariableSpec[]>();
  variables.forEach(varSpec => {
    const className = varSpec.bdchmElement;
    if (!grouped.has(className)) {
      grouped.set(className, []);
    }
    grouped.get(className)!.push(varSpec);
  });

  // Create tree: ClassNode parents with VariableElement children
  const roots: Element[] = [];
  grouped.forEach((varSpecs, className) => {
    // Get the actual class element for this group
    const classElement = classCollection.getElement(className);

    // Create parent node (VariableClassNode)
    const parent = new VariableClassNode(className, classElement);
    parent.nodePath = className;  // ← nodePath for parent

    // Create children (VariableElements)
    varSpecs.forEach(varSpec => {
      const child = new VariableElement(varSpec);
      child.parent = parent;
      child.nodePath = `${className}.${varSpec.variableLabel}`;  // ← nodePath for child
      parent.children.push(child);
    });

    // Sort children
    parent.children.sort((a, b) => a.name.localeCompare(b.name));
    roots.push(parent);
  });

  return new VariableCollection(roots);
}
```

**Tree structure**:
```
VariableCollection
├─ VariableClassNode: "Condition"
│  ├─ VariableElement: "angina_prior_1"
│  ├─ VariableElement: "asthma_ever_1"
│  └─ VariableElement: "copd_emphysema_1"
├─ VariableClassNode: "Measurement"
│  ├─ VariableElement: "bmi_baseline_1"
│  └─ VariableElement: "height_baseline_1"
└─ ...
```

**nodePath values**:
- Parent: `"Condition"`
- Child: `"Condition.angina_prior_1"`

---

## Slot System: ClassSlot, slotPath, and Inheritance

**🎯 This is the complex part you asked about!**

### Overview

Classes can have slots from 3 sources:
1. **Inline attributes** (`attributes` field in ClassDTO)
2. **Global slot references** (`slots` field references SlotElement by name)
3. **Inherited slots** (from parent classes via inheritance chain)

The slot system handles overrides, inheritance, and tracking "where was this slot defined?"

---

### ClassSlot: Wrapping Slots with Class-Specific Overrides

**File**: [src/models/Element.ts:566-648](../src/models/Element.ts#L566-L648)

```typescript
export class ClassSlot {
  readonly name: string;
  readonly baseSlot: SlotElement;  // Reference to global slot or synthetic slot
  readonly source: 'attribute' | 'slot_usage' | 'slot_reference';
  slotPath: string = '';  // ← SET DURING collectAllSlots() - full ancestry path

  // Override values (undefined = use base slot value)
  private readonly _range?: string;
  private readonly _required?: boolean;
  // ...

  // Getters return override value if set, else base slot value
  get range(): string {
    return this._range ?? this.baseSlot.range;
  }
  // ...
}
```

**Created in ClassElement constructor** [Element.ts:769-817](../src/models/Element.ts#L769-L817):

```typescript
constructor(data: ClassData, dataModel: ModelData, slotCollection: SlotCollection) {
  // ...

  // 1. Create ClassSlots for inline attributes
  Object.entries(this.attributes).forEach(([attrName, attrDef]) => {
    const syntheticSlot = new SlotElement(attrName, { range: attrDef.range, ... });
    classSlots.push(new ClassSlot(
      attrName,
      syntheticSlot,
      'attribute',  // source
      attrDef.range,  // range override
      attrDef.required  // required override
    ));
  });

  // 2. Create ClassSlots for global slot references
  this.slots.forEach(slotName => {
    const globalSlot = slotCollection.getElement(slotName);
    classSlots.push(new ClassSlot(
      slotName,
      globalSlot,
      'slot_reference'  // source
    ));
  });

  // 3. Apply slot_usage overrides
  if (this.slot_usage) {
    Object.entries(this.slot_usage).forEach(([slotName, usage]) => {
      const existing = classSlots.find(s => s.name === slotName);
      if (existing) {
        // Replace with overridden version
        const idx = classSlots.indexOf(existing);
        classSlots[idx] = new ClassSlot(
          slotName,
          existing.baseSlot,
          'slot_usage',  // source
          usage.range,  // range override
          usage.required  // required override
        );
      }
    });
  }

  this.classSlots = classSlots;
}
```

**🔗 Related commit**: Step 1b renamed `parentName` → `parentId` ([commit bf611bc](https://github.com/sigfried/dynamic-model-var-docs/commit/bf611bc))

---

### collectAllSlots(): Building the Full Slot Map with Inheritance

**File**: [src/models/Element.ts:725-746](../src/models/Element.ts#L725-L746)

**🎯 THIS IS WHERE slotPath GETS SET!**

```typescript
collectAllSlots(): Record<string, ClassSlot> {
  const slots = new Map<string, ClassSlot>();

  // 1. Add slots from THIS class and set slotPath
  this.classSlots.forEach(slot => {
    slot.slotPath = this.nodePath;  // ← SET slotPath to THIS class's path
    slots.set(slot.name, slot);
  });

  // 2. Inherit from parent (only add if not already present = override)
  if (this.parent) {
    const parentSlots = (this.parent as ClassElement).collectAllSlots();  // ← RECURSIVE
    Object.entries(parentSlots).forEach(([name, parentSlot]) => {
      if (!slots.has(name)) {  // ← Child overrides parent
        slots.set(name, parentSlot);  // ← Parent slot already has its slotPath set
      }
    });
  }

  return Object.fromEntries(slots);
}
```

**How slotPath gets its value**:

Example class hierarchy:
```
Entity (nodePath: "Entity")
└─ Specimen (nodePath: "Entity.Specimen")
   └─ Material (nodePath: "Entity.Specimen.Material")
```

If `Entity` defines slot `"id"`:
- `Entity.collectAllSlots()` sets `slot.slotPath = "Entity"`

If `Specimen` inherits `"id"` without override:
- `Specimen.collectAllSlots()` calls `parent.collectAllSlots()`
- Gets back slot with `slotPath = "Entity"` (already set by Entity)
- Adds to map without modifying slotPath

If `Material` overrides `"id"`:
- `Material.classSlots` includes new `ClassSlot` for `"id"`
- `Material.collectAllSlots()` sets `slot.slotPath = "Entity.Specimen.Material"`
- This overridden slot masks the inherited one

**Result**: `slotPath` tells you exactly where in the hierarchy this slot was defined!

**🔗 Recent work**: Commit b1dbb6d simplified this ([TASKS.md:640-718](../TASKS.md#L640-L718))

---

### getInheritedFrom(): Using slotPath to Determine Inheritance

**File**: [src/models/Element.ts:696-716](../src/models/Element.ts#L696-L716)

```typescript
getInheritedFrom(slotName: string): string {
  // Get all slots (including inherited)
  const allSlots = this.collectAllSlots();
  const slot = allSlots[slotName];

  if (!slot || !slot.slotPath) {
    return '';  // Slot not found
  }

  // Extract class name from slotPath (last component)
  // e.g., "Entity.Specimen" → "Specimen"
  const pathComponents = slot.slotPath.split('.');
  const definingClass = pathComponents[pathComponents.length - 1];

  // If defining class is this class, not inherited
  if (definingClass === this.name) {
    return '';
  }

  return definingClass;  // Return name of class where slot was defined
}
```

**Example**:
- Class: `Material` (nodePath: `"Entity.Specimen.Material"`)
- Slot: `"id"` with slotPath: `"Entity"`
- Result: `getInheritedFrom("id")` returns `"Entity"`

**Used in UI**: [src/components/DetailContent.tsx](../src/components/DetailContent.tsx) shows "(from Entity)" label next to inherited slots

---

### Complexity Analysis: Is There Redundancy?

**Your question**: "paths, collectAllSlots, and related stuff. i think some of it is redundant maybe"

Let's analyze:

#### 1. nodePath vs slotPath

**nodePath** ([Element.ts:360](../src/models/Element.ts#L360)):
- Property on Element base class
- Full ancestry path for THE ELEMENT itself
- Set during tree construction in `fromData()`
- Example: `"Entity.Specimen.Material"` for the Material class

**slotPath** ([Element.ts:570](../src/models/Element.ts#L570)):
- Property on ClassSlot
- Full ancestry path WHERE THE SLOT WAS DEFINED
- Set during `collectAllSlots()` traversal
- Example: `"Entity"` for id slot defined in Entity and inherited by Material

**Are they redundant?** ❌ NO
- They serve different purposes
- nodePath: "where is this element in the hierarchy?"
- slotPath: "where was this slot defined in the hierarchy?"
- For inherited slots, they differ!

#### 2. collectAllSlots() recursion

**Current behavior**:
- Recursively walks up parent chain
- Each call sets slotPath for its own slots
- Collects parent slots (already with slotPath set)

**Is recursion needed?** 🤔 MAYBE NOT

**Alternative approach** (potential simplification):
```typescript
collectAllSlots(): Record<string, ClassSlot> {
  const slots = new Map<string, ClassSlot>();

  // Walk up ancestor chain (no recursion)
  const ancestors = this.ancestorList().reverse();  // Root to this
  ancestors.forEach(ancestor => {
    if (ancestor instanceof ClassElement) {
      ancestor.classSlots.forEach(slot => {
        if (!slots.has(slot.name)) {  // First seen wins (override)
          slot.slotPath = ancestor.nodePath;
          slots.set(slot.name, slot);
        }
      });
    }
  });

  // Add this class's slots last (override ancestors)
  this.classSlots.forEach(slot => {
    slot.slotPath = this.nodePath;
    slots.set(slot.name, slot);  // Overrides ancestor slots
  });

  return Object.fromEntries(slots);
}
```

**Pros of non-recursive approach**:
- More explicit about order (root → leaf)
- Doesn't call collectAllSlots() multiple times on same class
- Uses existing `ancestorList()` method

**Cons**:
- Slightly more code
- Current recursive approach is more elegant

**Recommendation**: Current code is fine, but non-recursive would be clearer. Worth discussing before changing.

#### 3. getInheritedFrom() - Does it need to call collectAllSlots()?

**Current**: Calls `collectAllSlots()` to get slot, then extracts definingClass from slotPath

**Alternative**: Could cache the result of collectAllSlots() on ClassElement

```typescript
private _allSlots?: Record<string, ClassSlot>;  // Cache

get allSlots(): Record<string, ClassSlot> {
  if (!this._allSlots) {
    this._allSlots = this.collectAllSlots();
  }
  return this._allSlots;
}

getInheritedFrom(slotName: string): string {
  const slot = this.allSlots[slotName];  // ← Use cached version
  // ... rest of logic
}
```

**Trade-off**: Memory (caching) vs CPU (recomputing). Current approach recomputes on demand.

**Recommendation**: Add caching if performance becomes an issue. Current approach is fine for now.

---

## Redundancy Summary

| Item | Status | Recommendation |
|------|--------|----------------|
| nodePath vs slotPath | ✅ Not redundant | Keep both - different purposes |
| collectAllSlots() recursion | 🤔 Could simplify | Consider non-recursive, but not urgent |
| getInheritedFrom() calling collectAllSlots() | 🤔 Could cache | Add caching if performance issue |

**Overall**: The complexity is mostly necessary. Main opportunity for simplification is making collectAllSlots() non-recursive.

---

## LinkOverlay Refactoring Plan

**Current state**: [src/components/LinkOverlay.tsx](../src/components/LinkOverlay.tsx)

**Problem** ([TASKS.md:76-148](../TASKS.md#L76-L148)):
- Nested loops over types and items
- Link data structure mixes view/model concerns
- linkHelpers imports from models/ (architectural violation)

**Planned refactor** ([TASKS.md:746-923](../TASKS.md#L746-L923)):

### Current flow (convoluted):

```
LinkOverlay
├─ leftPanelTypes = ['class', 'enum']
├─ rightPanelTypes = ['variable']
│
├─ FOR EACH type in leftPanelTypes:
│  ├─ Get all item names of that type
│  ├─ FOR EACH itemName:
│  │  ├─ Get Element instance
│  │  ├─ Compute relationships
│  │  ├─ FOR EACH relationship:
│  │  │  └─ If target in rightPanelTypes, create Link
│  │  └─ Render SVG path
│  └─ ...
│
└─ FOR EACH type in rightPanelTypes:
   └─ (repeat similar nested logic)
```

### Proposed flow (simplified):

```
LinkOverlay
├─ leftItemIds = ['Specimen', 'Container', 'TypeEnum', ...]
├─ rightItemIds = ['angina_prior_1', 'bmi_baseline_1', ...]
│
├─ lrPairs = dataService.getAllPairs({
│    sourceFilter: leftItemIds,
│    targetFilter: rightItemIds,
│    sourceSide: 'left',
│    targetSide: 'right'
│  })
│
├─ rlPairs = dataService.getAllPairs({
│    sourceFilter: rightItemIds,
│    targetFilter: leftItemIds,
│    sourceSide: 'right',
│    targetSide: 'left'
│  })
│
├─ links = [...lrPairs, ...rlPairs].map(buildLink)
│
└─ Render SVG paths from links
```

### New interfaces:

```typescript
interface LinkPair {
  sourceItemId: string;
  targetItemId: string;
  sourceSide: 'left' | 'right';
  targetSide: 'left' | 'right';
}

interface Link {
  id: string;  // From contextualizeLinkId()
  sourceItemId: string;
  targetItemId: string;
  sourceSide: 'left' | 'right';
  targetSide: 'left' | 'right';
  sourceRect?: DOMRect;  // Rendering properties
  targetRect?: DOMRect;
  highlighted?: boolean;
}
```

### DataService.getAllPairs() implementation:

```typescript
class DataService {
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
      const element = this.modelData.elementLookup.get(sourceItemId);
      if (!element) continue;

      // Use existing relationship computation
      const relationships = element.computeOutgoingRelationships();

      for (const rel of relationships) {
        if (targetSet.has(rel.target)) {
          pairs.push({
            sourceItemId,
            targetItemId: rel.target,
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

**Key benefits**:
- No nested type loops
- UI layer uses itemIds only (no Element instances)
- Reuses existing `computeOutgoingRelationships()` logic
- Clean view/model separation

**🔗 Implementation plan**: [TASKS.md:746-923](../TASKS.md#L746-L923)

**🔗 Recent discussion**: Your TASKS.md notes from [lines 88-148](../TASKS.md#L88-L148)

---

## Data Handoff: Model → DataService → Components

### Current Architecture (after Phase 12 refactoring)

```
┌─────────────────────────────────────────────────────────────┐
│ MODEL LAYER (src/models/)                                   │
│                                                              │
│ • Element, ClassElement, EnumElement, etc.                  │
│ • ElementCollection subclasses                              │
│ • Business logic: relationships, inheritance, etc.          │
│                                                              │
│ ❌ UI components NEVER import from models/                  │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ ModelData
                        v
┌─────────────────────────────────────────────────────────────┐
│ ABSTRACTION LAYER (src/services/DataService.ts)             │
│                                                              │
│ class DataService {                                          │
│   constructor(private modelData: ModelData) {}              │
│                                                              │
│   // UI calls by itemId (string), returns plain data        │
│   getDetailContent(itemId: string): DetailData | null       │
│   getFloatingBoxMetadata(itemId: string): Metadata | null   │
│   getRelationships(itemId: string): RelationshipData | null │
│   itemExists(itemId: string): boolean                       │
│   // ... other data access methods                          │
│ }                                                            │
│                                                              │
│ ✅ UI receives plain objects, never Element instances       │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ itemId strings + plain data objects
                        v
┌─────────────────────────────────────────────────────────────┐
│ UI LAYER (src/components/, src/hooks/)                      │
│                                                              │
│ • Receives DataService instance as prop                     │
│ • Calls DataService methods with itemId strings             │
│ • Renders based on plain data objects                       │
│                                                              │
│ Example:                                                     │
│   const detailData = dataService.getDetailContent(itemId);  │
│   return <div>{detailData.title}</div>;                     │
│                                                              │
│ ❌ Never: import { Element } from '../models/Element'       │
│ ✅ Always: import { DataService } from '../services/...'    │
└─────────────────────────────────────────────────────────────┘
```

### Architectural enforcement

**ESLint rules** ([CLAUDE.md:22-74](../CLAUDE.md#L22-L74)):
- Ban DTO imports in components/
- Ban concrete Element subclass imports in components/
- Run `npm run check-arch` to verify

**Architecture script**: [scripts/check-architecture.sh](../scripts/check-architecture.sh)

---

## Tree Management: Expansion State & Rendering

**Not using Item abstraction yet** - Components still use Element instances via DataService

### Expansion State

**Where it lives**: URL query params + local state

**Encoding**: `lce=Specimen,Container,Material` (left class expansion)

**Hook**: [src/hooks/useExpansionState.ts](../src/hooks/useExpansionState.ts)
- Manages `Set<string>` of expanded item names
- Syncs with URL via statePersistence utils

### Tree Rendering Flow

```
Element tree
  ↓
element.toRenderableItems(expandedItems)
  ↓
RenderableItem[] (flat list with `level` and `hasChildren`)
  ↓
Section component
  ↓
Indented tree display with expand/collapse
```

**toRenderableItems()** [Element.ts:389-418](../src/models/Element.ts#L389-L418):
- Traverses tree respecting expansion state
- Flattens to array with indentation level
- Each item: `{ id, element, level, hasChildren, isExpanded, isClickable, badge }`

**Section component** [src/components/Section.tsx](../src/components/Section.tsx):
- Renders flat list with indentation (`ml-${level * 4}`)
- Chevrons for expandable items
- Click handlers for expand/collapse

**🔗 Future work**: [TASKS.md:1523-1580](../TASKS.md#L1523-L1580) - Abstract Tree Rendering System

---

## Upcoming Work That Will Change This

### Step 5 (Current) - Slot Inheritance Simplification

**Status**: ✅ Completed ([commit b1dbb6d](https://github.com/sigfried/dynamic-model-var-docs/commit/b1dbb6d))

**Changes made**:
- Added `slotPath` to ClassSlot
- Simplified `getInheritedFrom()` to use slotPath (no recursion)
- `collectAllSlots()` sets slotPath as it builds map

**Testing**: [TASKS.md:714-718](../TASKS.md#L714-L718)

### Step 6 - Relationship Grouping

**Status**: Not started

**File**: [TASKS.md:720-743](../TASKS.md#L720-L743)

**Changes**: Apply grouping logic (currently only in ClassElement) to EnumElement and VariableElement

### Step 7 - LinkOverlay Refactor

**Status**: Not started (the big one!)

**File**: [TASKS.md:746-923](../TASKS.md#L746-L923)

**Changes**:
- Add `dataService.getAllPairs()` method
- New Link interface with sourceSide/targetSide
- Eliminate nested type loops
- Remove tooltips (use hover highlighting instead)
- Clean up linkHelpers.ts architectural violation

**Impact**: Major simplification of link rendering logic

### Future: Item Abstraction

**Status**: Foundation laid (Item.ts created), deferred

**File**: [TASKS.md:369-540](../TASKS.md#L369-L540)

**Created**:
- `src/contracts/Item.ts` - Base class for component data
- `src/utils/idContextualization.ts` - ID utilities

**Not yet done**:
- Converting DataService to return Item instances
- Updating components to use Item instead of Element
- Tree rendering with Item abstraction

**Why deferred**: Refactoring works without full Item conversion. Will revisit when needed.

### Future: Abstract Tree Rendering System

**Status**: Design phase only

**File**: [TASKS.md:1523-1580](../TASKS.md#L1523-L1580)

**Goal**: Extract tree rendering from Element into reusable system

**Approach**:
1. Design interface by writing production code in closures
2. Once design proven, extract into abstraction
3. Apply to Elements panel, info boxes, slots tables

**Impact**: Could significantly simplify DetailContent and other tree displays

---

## Code Location Quick Reference

### Data Loading
- Entry point: [src/hooks/useModelData.tsx](../src/hooks/useModelData.tsx)
- Loader: [src/utils/dataLoader.ts:128-131](../src/utils/dataLoader.ts#L128-L131)
- Initialization: [src/models/Element.ts:501-535](../src/models/Element.ts#L501-L535)

### Tree Construction
- Base tree methods: [src/models/Element.ts:342-418](../src/models/Element.ts#L342-L418)
- ClassCollection.fromData(): [src/models/Element.ts:1477-1521](../src/models/Element.ts#L1477-L1521)
- VariableCollection.fromData(): [src/models/Element.ts:1668-1720](../src/models/Element.ts#L1668-L1720)

### Slot System
- ClassSlot class: [src/models/Element.ts:566-648](../src/models/Element.ts#L566-L648)
- ClassSlot creation: [src/models/Element.ts:769-817](../src/models/Element.ts#L769-L817)
- collectAllSlots(): [src/models/Element.ts:725-746](../src/models/Element.ts#L725-L746)
- getInheritedFrom(): [src/models/Element.ts:696-716](../src/models/Element.ts#L696-L716)

### Abstraction Layer
- DataService: [src/services/DataService.ts](../src/services/DataService.ts)
- Item abstraction: [src/contracts/Item.ts](../src/contracts/Item.ts)
- ID utilities: [src/utils/idContextualization.ts](../src/utils/idContextualization.ts)

### UI Components
- App entry: [src/App.tsx:1-27](../src/App.tsx#L1-L27)
- LinkOverlay: [src/components/LinkOverlay.tsx](../src/components/LinkOverlay.tsx)
- Section (tree display): [src/components/Section.tsx](../src/components/Section.tsx)

### Documentation
- Tasks: [docs/TASKS.md](../TASKS.md)
- Architecture: [docs/CLAUDE.md](../CLAUDE.md)
- Component flow: [docs/COMPONENT_FLOW.md](../COMPONENT_FLOW.md)

### Git Commits (Recent)
- b1dbb6d: [Implement Step 5: Slot Inheritance Simplification](https://github.com/sigfried/dynamic-model-var-docs/commit/b1dbb6d)
- 884c6ea: [Implement Step 3: Simplify getId()](https://github.com/sigfried/dynamic-model-var-docs/commit/884c6ea)
- bf611bc: [Rename parentName to parentId](https://github.com/sigfried/dynamic-model-var-docs/commit/bf611bc)

---

## Questions for Discussion

Based on this analysis, here are questions for refactoring Step 5:

1. **collectAllSlots() recursion**: Should we convert to non-recursive approach using `ancestorList()`?
   - **Pro**: More explicit, avoids repeated calls
   - **Con**: Slightly more code

2. **collectAllSlots() caching**: Should we cache results on ClassElement?
   - **Pro**: Better performance if called multiple times
   - **Con**: More memory, invalidation complexity

3. **classPath property**: Do we need a separate `classPath` on ClassElement (like `slotPath` on ClassSlot)?
   - Current: `nodePath` serves this purpose
   - Alternative: Add `classPath` for symmetry with `slotPath`

4. **Slot system complexity**: Are there other redundancies or simplifications you see that I missed?

5. **LinkOverlay priority**: Should Step 7 (LinkOverlay refactor) come before Step 6 (relationship grouping)?
   - LinkOverlay is "totally crazy" and touches many areas
   - Might reveal other issues to address

Let me know which aspects you'd like to dig into further!

## [sg] New proposal

- just set up parentIds in fromData, don't set paths till later;
  should be able to do it with shared code once the tree structures
  are defined by parentIds.
  - for variables, variable.parentId = variable.classId
    (or forget classId and just transform bdchmElement
     directly to parentId)
  - Class.fromData might not be needed at all, classElement
    already has parentId
  - generate incoming relationships and node.children lists
    just from the parentId on the nodes
- what if we stored the whole model as a DAG?
  - could make an artificial root node (maybe Element becomes
    a concrete class?). so:
    - root
      - enums
        - AnalyteTypeEnum
        - ...
      - variables
        - ...
      - ...
  - in a diagram with the root at top, parent relationships
    would point up
  - for child relationships we transpose the graph
  - with the graph (or its transposition), it will be 
    simple to generate paths from root
    - as arrays of element ids
    - or as arrays of element instances
    - ~~or use graphology to get these on the fly?~~

**[sg] we decided to defer graphology because it would be
     too big a refactor. but we still want to simplify
     data flow and some of these ideas can help**

  -
    - __collectAllSlots and root.slots__
        - the whole slot hierarchy might live under root.slots
        - ClassSlots could be children of SlotElements? not sure if
          that helps with anything
        - classes would have ClassSlot children which would each
          have a SlotElement parent

### [sg] Graph structures for all relationships

this would be a typed digraph -- nodes and edges have specific types. it doesn't matter if they all have a shared root
or if we keep root nodes as they are now. the
point is to get rid of as much element-class-specific code as possible. so, yes, variables will have class ids as
parentId (coming from bdchmElement), but the link type should be 'uses' (or uses class, or instantiates); classes have '
inherits from' (is-a) but also have slots (link type 'has' maybe?) with --- let's think this
through -- can we encode all the relationships we have using link type? or maybe a compound link type -- like for an
enum slot:
- Person 'has slot' species 'constrained by' CellularOrganismSpeciesEnum.
- Person 'has slot' year_of_birth 'constrained by' integer.
- Person 'has slot' cause_of_death 'uses' (or 'instantiated by') CauseOfDeath.

sorry, this is a little involved and will be some work to sort out, but i think it's worth it.

start making a table here of all the relationships along with how we will represent them in the graph and in the UI.

---

## Relationship Type Analysis

### Current Implementation (Element.ts)

**Current relationship types in code:**
1. `'inherits'` - Class → Parent Class
2. `'property'` - Used for multiple semantic relationships:
   - Class attribute → range (Class/Enum/Slot)
   - Slot → range (Class/Enum)
   - Variable → Class (with label='mapped_to')

**Current code structure:**
- Each Element subclass implements `getRelationships()` returning `Relationship[]`
- `Relationship` interface: `{ type, label?, target, targetType, isSelfRef? }`
- `computeIncomingRelationships()` scans all classes to find reverse relationships

---

### Proposed Graph-Based Relationship Types

This table maps semantic relationships to graph edges with typed links:

| **From** | **To** | **Current Type** | **Proposed Edge Type** | **Edge Label (UI)** | **Notes** |
|----------|--------|------------------|------------------------|---------------------|-----------|
| Class | Parent Class | `inherits` | `inherits` | "inherits from" / "is_a" | Tree structure (parent/child) |
| Class | Subclass | *(computed incoming)* | `has_subclass` | "has subclass" | Reverse of inherits |
| Class | Enum (via attribute) | `property` | `has_attribute` + `constrained_by` | "has attribute {name} constrained by {enum}" | Compound: Class→Attribute→Enum |
| Class | Class (via attribute) | `property` | `has_attribute` + `references` | "has attribute {name} referencing {class}" | Compound: Class→Attribute→Class |
| Class | Slot (via slot reference) | *(implicit in slots[])* | `uses_slot` | "uses slot" | Class references global slot |
| Class | Slot (via slot_usage override) | *(implicit in slot_usage{})* | `overrides_slot` | "overrides slot" | Class overrides global slot |
| Slot | Class/Enum (via range) | `property` | `constrained_by` | "constrained by" | Slot's range restriction |
| Enum | Class (via usage) | *(computed incoming)* | `constrains_attribute` | "constrains attribute {name} in {class}" | Reverse: Enum→Class that uses it |
| Variable | Class | `property` (label='mapped_to') | `instantiates` / `maps_to` | "instantiates" / "maps to" | Variable is instance of Class |
| Class | Variables | *(via VariableCollection grouping)* | `has_instances` | "has instances" | Reverse: Class→Variables |

### Semantic Relationship Patterns

**Tree relationships (parent/child in graph):**
- Class inheritance: `Entity ← Specimen ← Material`
- Variable grouping: `Condition ← angina_prior_1, asthma_ever_1, ...`
- Collection hierarchy (if using artificial root): `root ← classes, enums, slots, variables`

**Cross-reference relationships (edges, not parent/child):**
- Attribute self-reference: `Specimen.parent_specimen → Specimen`
- Attribute cross-class: `Specimen.source_participant → Participant`
- Attribute enum constraint: `Specimen.specimen_type → SpecimenTypeEnum`
- Slot range constraint: `SlotElement.range → Entity` (e.g., global slots referencing classes)

**Compound relationships (need decomposition):**

Your example: `Person 'has slot' species 'constrained by' CellularOrganismSpeciesEnum`

Could be represented as:
1. **Simple approach** - Single edge with metadata:
   ```
   Edge: Specimen → SpecimenTypeEnum
   Type: has_constrained_attribute
   Metadata: { attributeName: 'specimen_type', slotSource: 'inline' }
   ```

2. **Explicit approach** - Three nodes + two edges:
   ```
   Specimen → [Attribute: specimen_type] → SpecimenTypeEnum
   Edge1: has_attribute
   Edge2: constrained_by
   ```

3. **Hybrid approach** - Edge attributes:
   ```
   Edge: Specimen → SpecimenTypeEnum
   Type: has_attribute
   Attributes: { name: 'specimen_type', constraint_type: 'enum' }
   ```

**Question for you:** Which compound relationship approach do you prefer?
- Simple: Easier to implement, less graph complexity
- Explicit: Attributes become first-class nodes (can be queried, have properties)
- Hybrid: Balance between simplicity and expressiveness

---

### Implementation Questions

1. **Edge directionality:**
   - Should all edges be stored in one direction with reverse computed?  [sg] Yes
   - Or store bidirectional edges explicitly?
   - Example: `Class inherits Parent` vs. both `Class→Parent` and `Parent→Class`

2. **Attribute representation:**
   - Should inline attributes (like `parent_specimen`, `source_participant`) become nodes?
   - Or remain as edge metadata?
   - Impact: If nodes, can have their own relationships; if metadata, simpler graph
   - [sg] actually we already have a plan to make them nodes: they are slots and
          will be combined with the reusable slots in SlotCollection (or whatever
          we end up doing with collections)
   - [sg] actually slots always represent relationships. they have a lot of complexity
     (inheritance, global, inline, usage overrides). so we should discuss whether
     they should exist as relationships with their own metadata/attributes/properties
     or as nodes with two edges: class --> slot --> range (enum/class/type [types are either
     primitives or custom-defined refined primitives]). anyway, a slot defines the
     relationship between a class and a range. (i wish i had realized this earlier before
     establishing them as being Elements in the same way as classes, enums, and variables.)
   - so -- i think it would be weird to do classElement --> slotElement --> (rangeElement),
     so it would be better to have slots as complex edges. does that seem feasible?
   - this also makes me think there should be an abstract RangeElement class as a parent
     for classes, enums, and types
   - crap, i'm realizing that we should be importing linkml:types and treating those as
     elements

3. **Slot system:**
   - ClassSlot instances: Should they be graph nodes?
     - [sg] they can continue using the same class in our OOP model;
            but, actually, making them edges might simplify things slightly.
            
   - Relationship to SlotElement: Parent/child or just reference?
     - I don't understand the question
   - Current collectAllSlots() logic: How to represent in graph?
       - [sg] well, with the direction i'm suggesting, there
              would be an edge between a class and each of its
              slots. maybe we don't even need relationships between
              classes and SlotElements but only between classes and
              ClassSlots.

4. **Variable-Class relationship:**
   - Current: Variable→Class via `classId`/`bdchmElement`
   - Is this `instantiates`, `maps_to`, `belongs_to`, or something else?
     - 'mapped to' is probably good. 
     - based on conversation with Anne, variable is not the right label
       for condition and drug exposure variables. they should be called
       conditions and drug exposures. don't implement this before discussion
       and planning. for naming things in different contexts we may want
       a config table, sort of like the table above
   - Should this be a parent/child edge (tree structure) or cross-reference?
     - [sg] a directed edge is a directed edge, whether representing a 
            parent-child or cross-reference relationships. either way,
            edges arrange nodes/vertices into tree-like (dag, etc.) structures.

5. **Collection nodes:**
   - Should ClassCollection, EnumCollection, etc. be graph nodes?
   - Or just convenience wrappers around graph queries?
   - [sg] don't know. not ready to think about that yet
