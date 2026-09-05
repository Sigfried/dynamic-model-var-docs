# Testing Documentation

> Testing philosophy, patterns, and how to write tests for this project.

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

**Total: 500 tests + 3 skipped, across 40 test files** (all passing ✅,
verified 2026-09-05 — run `npx vitest run` for the live figure).


### Regression tests added 2026-08-24/25

Three files worth knowing about, because each guards a bug that shipped for months:

- **[`slotDisplayName.test.ts`](../src/test/slotDisplayName.test.ts)** — a slot's `.name` is its (possibly qualified)
  identity and `.displayName` is the bare name the user reads. The key assertion
  is that **the attributes-table Name column equals the graph's edge label**;
  no such check existed, which is why qualified ids rendered on screen from Dec
  2025 to Aug 2026.
- **[`slotConflictResolution.test.ts`](../src/test/slotConflictResolution.test.ts)** — conflicting slot declarations must not
  collapse. Pins the two edges that were drawn wrong (`items`, `part_of`), the
  `focus` multivalued distinction, and a structural guard that every class
  slot-reference resolves to a slot element.

- **[`attributeCardinality.test.ts`](../src/test/attributeCardinality.test.ts)** — every attribute row carries a
  cardinality, whether or not it is drawn as an edge. The label used to come
  from the edge, so scalar-ranged rows (never drawn) showed a blank and
  `Document.url` read as having no cardinality when it is `1..*`.

Both slot-identity files were confirmed to **fail** against the pre-fix state
before being accepted (3-of-7 and 4-of-6). A regression test that has never
failed proves nothing — see "Aim for regression prevention" above.

> **Known gap in `attributeCardinality.test.ts`:** it pins the data the rows are
> built from, but not the line in `OwnershipGraphView` that applies the label.
> Exporting `buildViewModel` to reach it trips
> `react-refresh/only-export-components`, and rendering the component in jsdom
> yields no rows (layout is async via an ELK worker). Closing this properly
> means extracting `buildViewModel` and its node-geometry constants into their
> own module — which is what the lint rule is pointing at. Verified the gap is
> real: reverting the view line leaves the suite green.

### Some test files, and what each is for

Not a complete list — `src/test/` holds 40 files. These four are described
because their *purpose* is not obvious from the filename.

#### 1. **data-integrity.test.ts** (1 test)
**Purpose**: Data pipeline completeness reporting

Reports on the health of the data pipeline without failing tests:
- YAML → Metadata.json transformation
- Metadata → ModelData loading
- Variable specifications loading

**Run**: `npm test -- data-integrity`

#### 2. **dataLoader.test.ts** (10 tests)
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

#### 3. **duplicateDetection.test.ts** (24 tests)
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

#### 4. **panelHelpers.test.tsx** (16 tests)
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

## Gaps worth filling

No end-to-end tests exist. Everything runs in jsdom, which has **no layout
engine**, so nothing verifies that the diagram actually renders correctly in a
browser — the edge-routing and merged-box tests assert on the view model and
the computed ports, not on pixels. That is a deliberate trade (see *Testing code
that measures layout* below), but it means a whole class of visual regression
is uncaught.

Also untested: state persistence round-trips (save → reload from URL → verify),
and full navigation flows across panels.


## Troubleshooting

### Tests Failing After Changes

**If tests fail unexpectedly:**

1. **Read the error message carefully** - Vitest provides clear stack traces
2. **Check if the API changed** - Did you modify function signatures?
3. **Verify test assumptions** - Are mock data structures still valid?
4. **Run single test file** - Isolate the failing test: `npm test -- filename`
5. **To see `console.log`, pass `--disableConsoleIntercept`.** Plain
   `npx vitest run` swallows it, and `--silent=false` does **not** bring it
   back — measured both ways, 2026-08-27. Writing to a file with
   `appendFileSync` and `cat`ing it afterwards also works and survives a crash.
   (Do not reach for `--reporter=basic`: that reporter no longer exists in
   vitest 4 and the error it throws looks unrelated to what you asked for.)

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

### Testing code that measures layout

**jsdom has no layout engine.** Every element reports `0×0`, every
`getBoundingClientRect()` returns all zeroes, `offsetWidth`/`offsetHeight` are
`0`, and `offsetParent` is `null`. Nothing throws — you just get zeroes.

This makes a whole class of test **pass vacuously**: a component that clamps,
flips, or repositions itself sees `0` everywhere, takes some arbitrary branch,
and the assertion agrees with it. The test is green and pins nothing.

Worse, it corrupts *debugging*. While fixing the relation submenu's overflow
(2026-08-27), a correct fix appeared to make things **worse** — the menu never
flipped at all — purely because the new code read `offsetParent`/`offsetWidth`,
which were unstubbed, so its condition collapsed to `false`. The measurement was
reporting on the harness, not the code.

**Rule: stub every property the code under test reads, not just the obvious
one.** Before trusting a layout measurement in a test, check what the component
actually touches — `getBoundingClientRect` is rarely the only one.

[`src/test/RelationBarPlacement.test.tsx`](../src/test/RelationBarPlacement.test.tsx) is the worked example: it stubs
`getBoundingClientRect`, `window.innerWidth` and `window.innerHeight`, using the
component's own Tailwind widths as the numbers so the fake geometry stays
honest. (It was ported from a placement test for the cascading relation menu
that this replaced; that version also stubbed `offsetParent` and `offsetWidth`,
which the flip logic read and this clamp does not. Stub what the code reads —
no more, and never less.)

**A second way to pass vacuously, hit while porting it:** the stub branched on
`el.style.position !== ''`, on the reasoning that the popover is `fixed`. It
is — from a Tailwind CLASS, not an inline style. The branch never matched, every
rect came back 0×0, the clamp computed against a zero width and became a no-op,
and its result then agreed with an unclamped expectation. **Identify elements in
a layout stub by something structural** — a tag name or a data attribute — never
by a style the framework might be setting a different way.

Two conventions from that file worth copying:

- **Keep layout-faking tests in their own file.** They patch shared prototypes
  (`Element.prototype`, `HTMLElement.prototype`), and mixing them with ordinary
  behavioural tests means those silently run under fake geometry. Restore the
  originals in `afterEach` regardless — vitest isolates files today, but that is
  not something a test should depend on.
- **Verify the test fails against the old code.** A layout test that has never
  been seen red is the most likely kind to be pinning nothing at all. Revert the
  fix, watch it fail, restore it. This is the only thing that distinguishes a
  real regression test from a vacuous one here.

**When *not* to reach for this.** Faking geometry is a lot of scaffolding and it
can drift from the real CSS. If the behaviour is decidable from data rather than
pixels, test it there instead — [`relationPositions.test.ts`](../src/test/relationPositions.test.ts) covers what the menu
*contains* with no layout at all, and only *where it opens* needed the stubs.

**Known gap (2026-08-27).** Five other components measure layout and have no
placement test between them: `FloatingBoxGroup`, `Tooltip`, `LayoutManager`,
`LinkOverlay`, and `help/HelpLayer`. Any positioning bug in those is currently
found by looking at the screen. Not a call to go write five test files — but if
one of them misbehaves, this section plus [`RelationBarPlacement.test.tsx`](../src/test/RelationBarPlacement.test.tsx) is
the pattern to reach for rather than re-deriving it.

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

Architecture context is in [CLAUDE.md](CLAUDE.md).
