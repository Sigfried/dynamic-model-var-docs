# Link Information vs Detail Box Information Analysis

> **Purpose:** Document what information is shown by links vs detail boxes to inform UI design decisions.
>
> **Date:** 2025-11-04
>
> **Context:** We're deciding how to display relationship information. Links are hard to hover over (too thin), so we need alternative approaches.

---

## Summary of Findings

**Key insight:** Most information shown by links is already in detail boxes, BUT there's a critical asymmetry:
- **Source element detail boxes** show attribute/slot names + targets
- **Target element detail boxes** show "Used By Classes" but NOT which specific attributes reference them
- **Links** show the connection visually but don't display attribute names

---

## Detailed Breakdown by Element Type

### 1. ClassElement

**Detail Box Shows:**
- **Inheritance:** "Inherits from: ParentClass" (text)
- **Slots Table:** Name, Source, Range, Required, Multivalued, Description
  - Name = attribute/slot name (e.g., `specimen_type`)
  - Range = target element (e.g., `SpecimenTypeEnum`, `Specimen`)
- **Variables Table:** Full variable details

**Links Show:**
- class → parent class (inheritance, e.g., `Specimen` → `Entity`)
- class → enum (property relationship, e.g., `Specimen` → `SpecimenTypeEnum`)
- class → class (property relationship, e.g., `Specimen` → `Specimen` for self-ref)
- class → slot (property relationship)

**Redundancy:** ✅ YES - The Slots table already shows attribute names and their ranges

**Example from actual data:**
```
Specimen detail box shows:
  Slots table:
    specimen_type | Attribute | SpecimenTypeEnum | No | No | ...
    parent_specimen | Attribute | Specimen | No | No | ...
```

---

### 2. EnumElement

**Detail Box Shows:**
- **Permissible Values Table:** Value names and descriptions
- **Used By Classes List:** Which classes reference this enum (REVERSE relationship)
  - Example: `SpecimenTypeEnum` shows "Used By Classes: Specimen"

**Links Show:**
- Nothing outgoing (getRelationships returns [])
- Classes show links TO this enum

**What's Missing:** ❌ The "Used By Classes" list shows *which* classes use the enum, but NOT *which specific attributes* in those classes point to it

**Example from actual data:**
```
SpecimenTypeEnum detail box shows:
  Used By Classes:
    Specimen

  But doesn't show:
    Specimen.specimen_type → SpecimenTypeEnum
```

---

### 3. SlotElement

**Detail Box Shows:**
- **Properties Table:** Range, Required, Multivalued, Identifier, Slot URI
  - Range = target (enum/class) if non-primitive
- **Used By Classes List:** Which classes reference this slot (REVERSE relationship)

**Links Show:**
- slot → enum/class (if range is non-primitive)

**What's Missing:** ❌ Similar to enums - "Used By Classes" shows which classes, but NOT which attributes/slots in those classes reference this slot

---

### 4. VariableElement

**Detail Box Shows:**
- **Properties Table:** "Mapped to" (target class), Data Type, Unit, CURIE

**Links Show:**
- variable → class

**Redundancy:** ✅ YES - "Mapped to" field shows the same info as the link

---

## Critical Missing Information

When viewing an **Enum** or **Slot** detail box:
- ✅ Can see: Which classes use it (list of class names)
- ❌ Cannot see: Which specific attributes/properties in those classes point to it
- ❌ Cannot see: The property names that create the relationships

**Real example scenario:**
- You open `SpecimenTypeEnum` detail box
- It shows "Used By Classes: Specimen"
- But you don't know:
  - Which attribute in `Specimen` uses it? (Answer: `specimen_type`)
  - You have to open `Specimen` detail box to find this out

---

## What Links Add That Detail Boxes Don't Have

1. **Visual indication** of relationships without opening boxes
2. **Spatial proximity** showing related elements
3. **Bidirectional context** - can see forward and reverse relationships simultaneously
4. **At-a-glance connectivity** - quickly see which elements are connected

But links themselves don't solve the "which attribute?" problem either.

---

## Possible Solutions

### Option 1: Enhanced "Used By" sections
In Enum/Slot detail boxes, show attribute/slot names:
```
Used By:
  Specimen
    - specimen_type (Attribute)
```

**Pros:**
- Complete information in one place
- No interaction required

**Cons:**
- More verbose detail boxes
- Requires computing reverse relationships with attribute names

---

### Option 2: Element hover shows outgoing relationships
When hovering over a Class element in the tree, show tooltip:
```
Specimen relationships:
  - inherits from: Entity
  - specimen_type → SpecimenTypeEnum
  - parent_specimen → Specimen
```

**Pros:**
- Quick access to relationship info
- Doesn't require opening detail boxes

**Cons:**
- Only shows outgoing relationships (from source)
- Doesn't help when hovering on target (enum/slot)

---

### Option 3: Element hover shows incoming relationships
When hovering over an Enum/Slot in the tree, show tooltip:
```
SpecimenTypeEnum used by:
  - Specimen.specimen_type
```

**Pros:**
- Solves the "which attribute?" problem
- Shows information at the target element

**Cons:**
- Only shows incoming relationships
- Requires computing reverse relationships

---

### Option 4: Interactive link highlighting with sidebar ⭐
When hovering over an element:
- Highlight all connected links (already implemented)
- Show a sidebar/tooltip listing all connections with attribute names:
  ```
  Specimen connections:
    Outgoing:
      - specimen_type → SpecimenTypeEnum
      - parent_specimen → Specimen (self-ref)
      - inherits from: Entity
    Incoming:
      - 15 variables mapped to this class
  ```

**Pros:**
- Most comprehensive - shows both directions
- Works for all element types
- Provides full context at once
- Easier to trigger than hovering on thin links

**Cons:**
- More complex to implement
- Requires screen real estate for sidebar
- May be overwhelming for highly-connected elements

---

## Recommendation

**Option 4** (Interactive link highlighting with sidebar) seems most promising because:
1. It solves the "hard to hover on links" problem
2. It shows attribute/slot names for both directions
3. It provides complete relationship context
4. It works well with the existing visual link system

The sidebar could be:
- Fixed position (e.g., top-right corner)
- Or floating near the hovered element
- Or integrated into the detail panel stack

---

## Next Steps

1. Decide on sidebar approach and position
2. Design sidebar component
3. Implement relationship aggregation (with attribute names)
4. Test with real data (e.g., Specimen, MeasurementObservation)
