# Testing Documentation

> **Comprehensive guide to the test suite for BDCHM Interactive Documentation**

## Quick Start

```bash
# Run tests in watch mode (recommended during development)
npm test

# Run all tests once (useful for CI or verification)
npm test -- --run

# Run specific test file
npm test -- adaptiveLayout --run

# Run tests with verbose output
npm test -- --reporter=verbose

# Generate coverage report
npm test:coverage
```

---

## Testing Philosophy

### Core Principles

**Extract logic into testable utilities**
- ❌ **Don't test**: React components with complex interactions, visual styling, animations
- ✅ **Do test**: Pure functions, data transformations, filtering logic, calculations

**Use TDD for non-visual features**
- Write tests first for data transformations, state management, filtering
- Let tests guide the API design of utility functions

**Hybrid approach for visual features**
- Test logic layer separately (calculations, data processing)
- Verify visual correctness manually in browser

**Aim for regression prevention, not just coverage**
- Focus on edge cases and critical paths
- Document expected behavior through tests
- Make tests readable and maintainable

### What We Test vs. What We Verify Visually

✅ **Tested with automated tests:**
- Pure functions (space calculations, duplicate detection)
- Data transformations (entity name extraction, type detection)
- Filtering logic (relationship filtering, visibility checks)
- Geometric calculations (SVG path generation, anchor points)
- JSX structure (correct elements, props passed correctly)

👁️ **Verified manually in browser:**
- SVG rendering quality and performance
- Colors, gradients, animations
- Layout aesthetics and spacing
- User interactions (drag, resize, hover effects)
- Responsive behavior across screen sizes

---

## Current Test Coverage

**Total: 134 tests across 8 test files** (all passing ✅)

### Test Files

#### 1. **data-integrity.test.ts** (1 test)
**Purpose**: Data pipeline completeness reporting

Reports on the health of the data pipeline without failing tests:
- YAML → Metadata.json transformation
- Metadata → ModelData loading
- Variable specifications loading

**Run**: `npm test -- data-integrity`

#### 2. **dataLoader.test.ts** (9 tests)
**Purpose**: Core data loading and processing

Tests:
- Model data loading and structure validation
- Hierarchical class tree construction from flat list
- Reverse index building (enum→classes, slot→classes)
- Variable mapping validation
- Slot and enum definition parsing
- Abstract class detection
- Data consistency checks (no duplicates, valid properties)

**Run**: `npm test -- dataLoader`

#### 3. **ClassSection.test.tsx** (4 tests)
**Purpose**: Component rendering verification

Tests:
- Class hierarchy rendering with nested structure
- Selected class highlighting
- Data attributes for element identification (used for SVG links)
- Empty state handling

**Run**: `npm test -- ClassSection`

#### 4. **linkLogic.test.ts** (26 tests)
**Purpose**: Element relationship detection

Tests all element types for relationship discovery:
- **ClassElement**: inheritance, enum properties, class references, self-references
- **SlotElement**: range detection for enums and classes
- **VariableElement**: class mapping
- **EnumElement**: no outgoing relationships (as expected)
- **Filtering**: by type, target type, visibility, self-refs
- **Combined filtering**: multiple criteria simultaneously

**Run**: `npm test -- linkLogic`

#### 5. **linkHelpers.test.ts** (27 tests)
**Purpose**: SVG link rendering utilities

Tests:
- **Relationship filtering**: showInheritance, showProperties, onlyEnums, onlyClasses, visibility
- **Link building**: converting relationships to renderable link objects
- **Geometric calculations**: center points, anchor point selection, edge detection
- **SVG path generation**: bezier curves, self-referential loops
- **Visual styling**: color mapping, stroke width by relationship type

**Run**: `npm test -- linkHelpers`

#### 6. **adaptiveLayout.test.ts** (23 tests)
**Purpose**: Adaptive detail panel display logic

Tests:
- **Space calculation**: remaining space with various panel configurations
- **Mode determination**: 'stacked' vs 'dialog' based on available space
- **Edge cases**: empty panels, exact threshold, negative space
- **Real-world scenarios**: common screen sizes (desktop 1920px, laptop 1366px, tablet 1024px, 4K 3840px)

**Example test:**
```typescript
it('typical desktop monitor (1920x1080) with both panels should use stacked mode', () => {
  const result = calculateDisplayMode(1920, 1, 1);
  expect(result.mode).toBe('stacked'); // 860px remaining > 600px threshold
});

it('laptop screen (1366x768) with both panels should use dialog mode', () => {
  const result = calculateDisplayMode(1366, 1, 1);
  expect(result.mode).toBe('dialog'); // 140px remaining < 600px threshold
});
```

**Run**: `npm test -- adaptiveLayout`

#### 7. **duplicateDetection.test.ts** (28 tests)
**Purpose**: Entity duplicate prevention

Tests:
- **Entity name extraction**: classes use `name`, variables use `variableLabel`
- **Entity type detection**: structural property checks (`children`, `permissible_values`, `slot_uri`)
- **Duplicate finding**: by name and type, cross-type disambiguation
- **Edge cases**: empty arrays, multiple duplicates, same names across different types

**Example test:**
```typescript
it('distinguishes same name across different entity types', () => {
  const sameNameClass = { name: 'SameName', children: [] };
  const sameNameEnum = { name: 'SameName', permissible_values: {} };

  // Should find class duplicate at index 0 (not confused with enum)
  const classIndex = findDuplicateIndex([class, enum], sameNameClass, 'class');
  expect(classIndex).toBe(0);

  // Should find enum duplicate at index 1 (not confused with class)
  const enumIndex = findDuplicateIndex([class, enum], sameNameEnum, 'enum');
  expect(enumIndex).toBe(1);
});
```

**Run**: `npm test -- duplicateDetection`

#### 8. **panelHelpers.test.tsx** (16 tests)
**Purpose**: Panel title and header color utilities

Tests:
- **Header colors**: type-based color selection (blue for classes, purple for enums, green for slots, orange for variables)
- **Title generation**: JSX rendering for all entity types
- **Styling verification**: bold text, font sizes, inheritance display
- **React rendering**: ensures valid JSX structure can be rendered

**Example test:**
```typescript
it('renders class title with parent', () => {
  const title = getPanelTitle({ name: 'Specimen', parent: 'Entity' });
  const { container } = render(title);

  expect(container.textContent).toContain('Class:');
  expect(container.textContent).toContain('Specimen');
  expect(container.textContent).toContain('extends Entity');
});
```

**Run**: `npm test -- panelHelpers`

---

## Writing New Tests

### Example: Testing a Pure Function

**Utility function** (src/utils/myUtility.ts):
```typescript
export function calculateSomething(input: number): number {
  return input * 2 + 10;
}
```

**Test file** (src/test/myUtility.test.ts):
```typescript
import { describe, it, expect } from 'vitest';
import { calculateSomething } from '../utils/myUtility';

describe('calculateSomething', () => {
  it('doubles input and adds 10', () => {
    expect(calculateSomething(5)).toBe(20); // 5 * 2 + 10 = 20
  });

  it('handles zero', () => {
    expect(calculateSomething(0)).toBe(10);
  });

  it('handles negative numbers', () => {
    expect(calculateSomething(-5)).toBe(0); // -5 * 2 + 10 = 0
  });
});
```

### Example: Testing a React Component (Rendering)

**Component** (src/components/MyComponent.tsx):
```typescript
export function MyComponent({ name }: { name: string }) {
  return <div className="greeting">Hello, {name}!</div>;
}
```

**Test file** (src/test/MyComponent.test.tsx):
```typescript
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { MyComponent } from '../components/MyComponent';

describe('MyComponent', () => {
  it('renders greeting with name', () => {
    const { container } = render(<MyComponent name="Alice" />);
    expect(container.textContent).toBe('Hello, Alice!');
  });

  it('applies correct CSS class', () => {
    const { container } = render(<MyComponent name="Bob" />);
    const div = container.querySelector('div');
    expect(div?.className).toContain('greeting');
  });
});
```

### Test Organization Best Practices

1. **Group related tests** with `describe` blocks
2. **Use descriptive test names** that explain the expected behavior
3. **Test edge cases** (empty inputs, null values, boundary conditions)
4. **Keep tests focused** - one assertion per test when possible
5. **Use setup helpers** for repeated mock data (see test files for examples)

---

## Testing Strategy by Phase

### Phase 3d: SVG Link Visualization (53 tests)

**Approach**: Test-driven development (TDD)
1. Created `linkLogic.test.ts` first with relationship detection tests
2. Implemented Element classes to pass tests
3. Created `linkHelpers.test.ts` for SVG rendering utilities
4. Implemented rendering logic to pass tests

**Result**: All link logic fully tested before visual implementation

### Phase 3e: Adaptive Detail Panel Display (67 tests)

**Approach**: Extract and test
1. Identified testable logic embedded in components
2. Extracted pure functions to utility files
3. Wrote comprehensive tests (23 + 28 + 16 = 67 tests)
4. Refactored components to use tested utilities

**Result**: Doubled test suite size (67 → 134), improved code quality

---

## Future Testing Priorities

### Optional (Next Steps)

**DetailPanelStack rendering tests**
- Test panels render in reversed order (newest first)
- Verify correct props passed to DetailPanel
- Test close button functionality
- Mock DetailPanel to isolate testing

**DetailDialog interaction tests**
- Drag and resize functionality
- Escape key closes oldest dialog
- Dialog stacking order (z-index)

### Future Enhancements

**State persistence round-trip tests**
- Save state → load from URL → verify match
- Dialog positions preserved correctly
- Panel configurations restored

**Search and filter tests** (when implemented)
- Full-text search across entities
- Faceted filtering logic
- Search result highlighting

**Integration tests**
- Full navigation flows (click class → dialog opens → links appear)
- Cross-panel navigation
- State transitions

**E2E tests** (Playwright or Cypress)
- Full user workflows
- Multi-step interactions
- Visual regression testing

**Performance tests**
- Large model handling (many classes, variables)
- Rendering speed with many links/dialogs
- Memory usage tracking

---

## Troubleshooting

### Tests Failing After Changes

**If tests fail unexpectedly:**

1. **Read the error message carefully** - Vitest provides clear stack traces
2. **Check if the API changed** - Did you modify function signatures?
3. **Verify test assumptions** - Are mock data structures still valid?
4. **Run single test file** - Isolate the failing test: `npm test -- filename`
5. **Add console.log** in tests to debug - Vitest shows console output

### Common Test Issues

**"Cannot find module" errors**
- Check import paths are correct (relative paths from test to source)
- Ensure the file being imported exists

**"Expected X but received Y"**
- Double-check the expected value matches actual implementation
- Use `console.log` to inspect actual values

**Tests pass locally but fail in CI**
- Check for timing issues (async operations)
- Verify environment differences (window.innerWidth mocking)

**React Testing Library issues**
- Ensure you're using `render()` from `@testing-library/react`
- Check that components are properly exported

---

## Resources

### Vitest Documentation
- [Getting Started](https://vitest.dev/guide/)
- [API Reference](https://vitest.dev/api/)
- [Expect Matchers](https://vitest.dev/api/expect.html)

### React Testing Library
- [Queries](https://testing-library.com/docs/queries/about)
- [User Interactions](https://testing-library.com/docs/user-event/intro)
- [Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

### Testing Patterns
- [Test-Driven Development](https://www.testdrivendevelopment.io/)
- [Testing JavaScript](https://testingjavascript.com/)

---

## Contributing

When adding new features:

1. **Extract testable logic** into utility functions
2. **Write tests first** for data transformations and calculations
3. **Refactor components** to use tested utilities
4. **Document test coverage** in this file
5. **Run full test suite** before committing: `npm test -- --run`

For questions about testing strategy, see [CLAUDE.md](CLAUDE.md) for architecture context.
