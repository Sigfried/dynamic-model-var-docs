# temp.md - Immediate Next Steps

> **Quick reference for current session work**
> - **PROGRESS.md** - Completed work for reporting
> - **CLAUDE.md** - Architecture, philosophy, design decisions
> - **TESTING.md** - Testing philosophy and practices
> - **README.md** - User-facing documentation

---

## 🔄 CURRENT WORK: Move renderItems to Section.tsx

**Status**: Step 1 complete (Tree and RenderableItem types created), Step 2 in progress

**What's done:**
- ✅ Created `Tree.ts` with generic TreeNode<T> and Tree<T> classes
- ✅ Created `RenderableItem.ts` interface
- ✅ Added `getRenderableItems()` abstract method to ElementCollection
- ✅ Implemented `getRenderableItems()` for EnumCollection and SlotCollection
- ✅ Created DetailPanel.test.tsx (10/26 tests failing - need to fix expectations)

**What remains:**
1. Fix DetailPanel tests to match actual rendering
2. Implement `getRenderableItems()` for ClassCollection (tree structure)
3. Implement `getRenderableItems()` for VariableCollection (grouped structure)
4. Move variable grouping logic to dataLoader
5. Update Section.tsx to use `getRenderableItems()` and render RenderableItems generically
6. Remove old `renderItems()` method once Section uses new approach

**Key decision made**: Variable group headers will use actual ClassElement instances (not null or special type)

See CLAUDE.md "Core Insight" section for full plan and rationale.

---

## 📋 BACKGROUND: Refactoring Tasks (Task 3.6)

### Task 3.6: Collections Store Elements, Not Raw Data

**Progress**: EnumCollection complete, others pending

**Current problem**: Collections store raw data (EnumDefinition, ClassNode, etc.) and wrap them on-demand. This is redundant - Element instances already contain all the data.

**Completed**:
1. ✅ EnumCollection fully converted to store EnumElement instances
2. ✅ Updated ElementCollection base class signatures (getElement returns Element, not ElementData)

**Remaining conversions**:
1. **SlotCollection** - Convert to store SlotElement instances
2. **VariableCollection** - Convert to store VariableElement instances
3. **ClassCollection** - Convert to store ClassElement instances (tricky: currently stores ClassNode[] tree)

**Then cleanup**:
4. Pre-compute relationships - Move getRelationships() into Element constructors
5. Remove createElement() factory - No longer needed
6. Remove getElementName() helper - Use element.name directly
7. Replace categorizeRange() duck typing - Use elementLookup map
8. Remove ElementData type - Once collections store Elements, this union type becomes obsolete

---

## 🔮 FUTURE WORK

See CLAUDE.md for detailed future plans:
- Phase 4: Search and Filter
- Phase 5: Neighborhood Zoom
- Enhanced metadata display
- Custom preset management

### Lower Priority Issues

**Terminology consistency**:
- Stop using "Property" - use "Attribute" and "Slot"
- Document terminology guidelines in CLAUDE.md to prevent regression

**External link integration**:
- Link prefixed IDs (OMOP, DUO, etc.) to external sites
- Use prefix data from bdchm.yaml

**Feature parity with official docs** (https://rtiinternational.github.io/NHLBI-BDC-DMC-HM/):
1. Import and display linkml:types
2. Show which enums are dynamic
3. Collapsible raw LinkML view
4. Show direct vs inherited slots
5. Partial ERD visualizations

**File organization**:
- Element.tsx is large (919 lines) - split into separate files (Task 4)
- App.tsx is large (600+ lines) - extract hooks (Task 5)

---

## 📝 NOTES

- All completed work from previous sessions documented in PROGRESS.md Phase 3g
- selectedElement removed entirely (was highlighting first dialog, decided not worth complexity)
- DetailPanel tests created to catch when sections disappear (like slots bug)
- Tree<T> naming chosen over Hierarchy<T> for consistency
