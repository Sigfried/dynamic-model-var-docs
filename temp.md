# temp.md - Current Session Notes

> **Quick reference for immediate next steps**
> See CLAUDE.md for complete architecture and implementation history

---

## Next: Expand Test Suite for Phase 3e

### Context

**Last test expansion**: Phase 3d (SVG link visualization)
- 26 tests in `linkLogic.test.ts` (relationship detection)
- 27 tests in `linkHelpers.test.ts` (SVG rendering utilities)

**Untested since then**: Phase 3e (adaptive detail panel display)
- DetailPanelStack component
- Adaptive layout switching logic
- Duplicate prevention
- Panel header styling
- App title reset functionality

### Testing Philosophy Reminder

From CLAUDE.md:
- ✅ Test data/logic layers separately from visual/rendering layers
- ✅ Use TDD for non-visual features (data transformations, filtering, state management)
- ✅ Use hybrid approach for visual features (test logic first, verify rendering manually)
- ✅ Aim for tests that prevent regressions, not just achieve coverage

**What we test vs. what we verify visually:**
- ✅ **Test**: Pure functions, data transformations, filtering logic, state calculations
- 👁️ **Visual verification**: Colors, animations, layout aesthetics, user interactions

---

## Test Plan for Phase 3e

### Priority 1: Testable Logic (Add Tests)

#### 1. **Space Measurement Logic** (`App.tsx:143-169`)

**Test file**: `src/test/adaptiveLayout.test.ts` (new)

Test cases:
- Calculate remaining space with both panels populated
- Calculate remaining space with one panel empty
- Calculate remaining space with no panels
- Determine 'stacked' mode when space ≥ threshold
- Determine 'dialog' mode when space < threshold
- Handle edge case at exact threshold (600px)

**Implementation approach**:
- Extract space calculation to utility function in `src/utils/layoutHelpers.ts`
- Test utility function in isolation
- Mock window.innerWidth for deterministic tests

#### 2. **Duplicate Detection** (`App.tsx:236-281`)

**Test file**: `src/test/duplicateDetection.test.ts` (new)

Test cases:
- Detect duplicate class by name
- Detect duplicate enum by name
- Detect duplicate slot by name
- Detect duplicate variable by variableLabel
- Handle non-duplicate entities correctly
- Find existing entity index correctly
- Handle empty openDialogs array

**Implementation approach**:
- Extract duplicate detection to utility function
- Test with mock entity data
- Verify index finding logic

#### 3. **Panel Title Generation** (`DetailPanelStack.tsx:36-59`)

**Test file**: `src/test/panelTitles.test.ts` (new)

Test cases:
- Generate title for class without parent
- Generate title for class with parent (includes "extends")
- Generate title for enum (no "Enum:" prefix)
- Generate title for slot
- Generate title for variable
- Render correct JSX structure (bold elements, text sizes)

**Implementation approach**:
- Test that function returns ReactElement
- Use React Testing Library to render and verify text content
- Check className attributes for styling

#### 4. **Header Color Selection** (`DetailPanelStack.tsx:23-33`)

**Test file**: `src/test/headerColors.test.ts` (new)

Test cases:
- Return blue color for ClassNode
- Return purple color for EnumDefinition
- Return green color for SlotDefinition
- Return orange color for VariableSpec
- Verify color strings include both light and dark variants

**Implementation approach**:
- Pure function test with mock entities
- String matching for expected Tailwind classes

### Priority 2: Component Rendering (Selective Tests)

#### 5. **DetailPanelStack Rendering**

**Test file**: `src/test/DetailPanelStack.test.tsx` (new)

Test cases:
- Render null when panels array is empty
- Render panels in reversed order (newest first)
- Apply correct header color for each entity type
- Render close button for each panel
- Pass hideHeader and hideCloseButton props to DetailPanel

**Implementation approach**:
- Use React Testing Library
- Mock DetailPanel component to verify props
- Test array reversal logic

### Priority 3: Integration Tests (Future)

#### 6. **Adaptive Mode Switching**

**Test file**: `src/test/adaptiveModeIntegration.test.tsx` (new)

Test cases:
- Switch from 'dialog' to 'stacked' when resizing window wider
- Switch from 'stacked' to 'dialog' when resizing window narrower
- Preserve dialog data when switching modes
- Maintain panel order across mode switches

**Challenges**:
- Requires mocking window.innerWidth and resize events
- Needs full component tree (App + PanelLayout + panels)
- May be slow / flaky
- **Decision**: Defer to future if time-constrained

### Priority 4: Not Testing (Visual Verification Only)

These features are best verified manually in browser:
- 👁️ Colored header backgrounds (visual correctness)
- 👁️ Panel height constraints (300px-500px)
- 👁️ Scrolling behavior in stacked mode
- 👁️ Smooth transitions when resizing
- 👁️ Hover effects on close button
- 👁️ Typography (bold, text sizes, alignment)

---

## Implementation Order

1. **Session 1**: Extract logic, write Priority 1 tests
   - Create `src/utils/layoutHelpers.ts` with space calculation function
   - Create `src/utils/duplicateDetection.ts` (or add to existing utils)
   - Write tests for extracted functions
   - Refactor App.tsx to use utility functions

2. **Session 2**: Write Priority 2 component tests
   - Create `DetailPanelStack.test.tsx`
   - Create `panelTitles.test.ts` and `headerColors.test.ts`
   - Test rendering and prop passing

3. **Session 3** (optional): Integration tests
   - Only if time allows
   - Focus on critical user flows

---

## Success Criteria

**Minimum viable test coverage**:
- All pure functions tested (space calc, duplicate detection, color selection)
- DetailPanelStack component rendering tested
- Title generation tested
- Test count: ~15-20 new tests

**Stretch goals**:
- Integration tests for mode switching
- Round-trip tests for state persistence
- Test count: ~30+ new tests

**Current baseline**: 67 tests passing

---

## Quick Commands

```bash
# Run tests in watch mode
npm test

# Run specific test file
npm test -- adaptiveLayout

# Run all tests once
npm test -- --run

# Type check
npm run build
```
