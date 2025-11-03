# Testing Guide

## Test Structure

The project uses Vitest for unit and component testing. Tests are organized by functionality in `src/test/`.

**Test Count**: 152 tests passing, 2 skipped (awaiting Phase 5 implementation)

## Creating Mock Elements

### Constructor Signatures (Post-Phase 6.4)

After Phase 6.4 Step 4, Element constructors use Metadata interfaces instead of DTOs:

```typescript
import { ClassElement, EnumElement, SlotElement, VariableElement } from '../models/Element';
import type { ClassMetadata, EnumMetadata, SlotMetadata, VariableSpec, ModelData } from '../types';

// Helper to create minimal ModelData for testing
const createMockModelData = (): ModelData => ({
  collections: new Map(),
  elementLookup: new Map(),
});

// ClassElement - requires name via metadata, plus ModelData
const mockClass = new ClassElement({
  name: 'Specimen',
  description: 'A sample class',
  parent: 'Entity',
  abstract: false,
  attributes: {
    specimen_type: {
      range: 'SpecimenTypeEnum',
      description: 'The type of specimen'
    }
  }
}, createMockModelData());

// EnumElement - name as first parameter, metadata as second
const mockEnum = new EnumElement('SpecimenTypeEnum', {
  description: 'Specimen types',
  permissible_values: {
    blood: { description: 'Blood sample' },
    tissue: { description: 'Tissue sample' }
  }
});

// SlotElement - name as first parameter, metadata as second
const mockSlot = new SlotElement('identifier', {
  description: 'A unique identifier',
  range: 'string',
  slot_uri: 'http://example.org/identifier',
  required: true
});

// VariableElement - unchanged, uses VariableSpec directly
const mockVariable = new VariableElement({
  bdchmElement: 'Specimen',
  variableLabel: 'specimen_type',
  dataType: 'string',
  ucumUnit: '',
  curie: 'LOINC:12345',
  variableDescription: 'The type of specimen'
});
```

### Important Property Access Patterns

**ClassElement**:
- `element.name` - class name
- `element.parentName` - parent class name (string)
- `element.parent` - parent Element reference (set by Collection.fromData)
- `element.attributes` - attribute definitions (NOT `properties`)
- `element.variableCount` - computed getter

**EnumElement**:
- `element.name` - enum name
- `element.permissibleValues` - array of `{key, description}` (NOT `values`)

**SlotElement**:
- `element.name` - slot name
- `element.range` - value type

**VariableElement**:
- `element.name` - maps from `variableLabel`
- `element.bdchmElement` - class name this variable maps to

## Test Organization

### Unit Tests

**linkLogic.test.ts** (26 tests)
- Element relationship detection
- Link filtering logic
- Tests Element.getRelationships() method

**linkHelpers.test.ts** (27 tests)
- Link categorization utilities
- Link type detection

**duplicateDetection.test.ts** (24 tests)
- Element duplicate detection
- Name extraction and comparison

**panelHelpers.test.tsx** (16 tests)
- Panel title generation
- Header color selection

**adaptiveLayout.test.ts** (23 tests)
- Responsive layout calculations
- Display mode determination

**appReset.test.ts** (5 tests)
- Layout reset functionality

### Integration Tests

**dataLoader.test.ts** (8 tests)
- Full data loading pipeline
- Collection creation
- Hierarchy building

**data-integrity.test.ts** (1 test)
- Data completeness validation
- Pipeline verification

### Component Tests

**DetailPanel.test.tsx** (22 passing, 2 skipped)
- Detail panel rendering for all element types
- Header visibility controls
- **Skipped tests**: "Used By Classes" sections (awaiting Phase 5 `getUsedByClasses()` implementation)

## Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- src/test/linkLogic.test.ts

# Run tests in watch mode
npm test -- --watch

# Run type checking
npm run typecheck
```

## Future Testing Improvements

### Planned for Later (from PHASE_6.4_PLAN.md)

**Option (b)**: Use `Collection.fromData()` factories instead of mock objects
- More realistic test setup
- Tests actual data transformation logic
- Better integration coverage
- **Note**: Currently using mock objects (option a) which works well

### After Phase 5

Re-enable skipped tests once `getUsedByClasses()` is implemented:
- `DetailPanel.test.tsx` - EnumElement "should render used by classes section"
- `DetailPanel.test.tsx` - SlotElement "should render used by classes section"

### After Phase 6 (Tree.ts removal)

Update tests that use Tree/TreeNode:
- Remove Tree-specific tests
- Add tests for Element.traverse() and Element.ancestorList()
- Update collection tests to use Element.children directly
