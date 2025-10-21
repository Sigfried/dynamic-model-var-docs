# Phase 3c: Refactoring for Element-Based Architecture + SVG Link Visualization

## Overview

Before implementing SVG links, we need to refactor the codebase to use an element-based architecture with class inheritance. This will:
1. Eliminate type-specific code duplication
2. Make link rendering generic and maintainable
3. Properly handle LinkML slots, attributes, and slot_usage
4. Provide a clean foundation for future features

## Part 1: Understanding LinkML Concepts

### Slots vs Attributes vs Slot_Usage

**Key Concepts** (see CLAUDE.md for detailed documentation):

1. **Slots** (top-level definitions): Reusable property definitions that can be used across multiple classes
   - Example: BDCHM has 7 top-level slots like `id`, `identifier`, etc.
   - Defined once, referenced by multiple classes

2. **Attributes**: Class-specific inline slot declarations (syntactic sugar for defining slots)
   - Example: `Specimen.specimen_type`, `Condition.condition_concept`
   - BDCHM has hundreds of attributes across 47 classes
   - Attributes are really just inline slot definitions

3. **Slot_Usage**: Class-specific refinements/constraints on inherited or referenced slots
   - Example: Abstract class `QuestionnaireResponseValue` has a `value` slot
   - Concrete subclasses use `slot_usage` to specify range constraints (string vs integer vs etc)
   - Allows inheritance hierarchy to progressively refine slot definitions

**UI Implications**:
- Merge attributes and slots in class detail views (both are "slots")
- Indicate slot source: inline (attribute) vs inherited vs top-level
- Show slot_usage customizations
- Display inherited slots (collapsed by default) with links to parent classes

### Updating Data Extraction

**Modify `download_source_data.py`** to capture `slot_usage`:

```python
# In generate_metadata(), update class extraction:
for class_name, class_def in schema.get("classes", {}).items():
    metadata["classes"][class_name] = {
        "name": class_name,
        "description": class_def.get("description", ""),
        "parent": class_def.get("is_a"),
        "abstract": class_def.get("abstract", False),
        "attributes": class_def.get("attributes", {}),
        "slots": class_def.get("slots", []),
        "slot_usage": class_def.get("slot_usage", {})  # ADD THIS LINE
    }
```

After modifying, run: `python3 scripts/download_source_data.py --metadata-only`

## Part 2: Element Class Hierarchy

### Base Class: `Element`

**Note**: Using "Element" instead of "Entity" to avoid confusion with LinkML's Entity class.

```typescript
// src/models/Element.ts

export interface Relationship {
  type: 'inherits' | 'property' | 'uses_enum' | 'references_class';
  label?: string;           // Property name (for property relationships)
  target: string;           // Target element name
  targetType: 'class' | 'enum' | 'slot' | 'variable';
  isSelfRef?: boolean;      // True if target === this.name
}

export abstract class Element {
  abstract readonly type: 'class' | 'enum' | 'slot' | 'variable';
  abstract readonly name: string;
  abstract readonly description: string | undefined;

  // Panel rendering (with depth for tree structures)
  abstract renderPanelSection(depth: number, onSelect: (entity: any) => void): JSX.Element;

  // Detail view rendering
  abstract renderDetails(onNavigate: (target: string, targetType: string) => void): JSX.Element;

  // Relationship extraction for SVG links
  abstract getRelationships(): Relationship[];

  // DOM helpers for SVG positioning
  getBoundingBox(): DOMRect | null {
    return document.getElementById(`${this.type}-${this.name}`)?.getBoundingClientRect() || null;
  }

  // Shared utility: render element name
  protected renderName(): JSX.Element {
    return <span className="font-semibold">{this.name}</span>;
  }
}
```

### Class Element

```typescript
export class ClassElement extends Element {
  readonly type = 'class' as const;
  private data: ClassNode;
  private slotDefinitions: Map<string, SlotDefinition>; // For looking up inherited slots

  constructor(data: ClassNode, slotDefinitions: Map<string, SlotDefinition>) {
    super();
    this.data = data;
    this.slotDefinitions = slotDefinitions;
  }

  get name() { return this.data.name; }
  get description() { return this.data.description; }

  renderPanelSection(depth: number, onSelect: (entity: any) => void): JSX.Element {
    // Handles indentation, expansion toggle, recursive children rendering
    const indent = depth * 16;
    return (
      <div key={this.name}>
        <div
          id={`class-${this.name}`}
          data-entity-type="class"
          data-entity-name={this.name}
          style={{ paddingLeft: `${indent}px` }}
          className="cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700"
          onClick={() => onSelect(this.data)}
        >
          <span>{this.name}</span>
          {this.data.variableCount > 0 && (
            <span className="text-xs text-gray-500 ml-2">({this.data.variableCount})</span>
          )}
        </div>

        {/* Recursively render children */}
        {this.data.children.map(childData =>
          new ClassElement(childData, this.slotDefinitions).renderPanelSection(depth + 1, onSelect)
        )}
      </div>
    );
  }

  renderDetails(onNavigate: (target: string, targetType: string) => void): JSX.Element {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{this.name}</h1>
            {this.data.abstract && (
              <span className="px-2 py-1 text-xs bg-gray-200 dark:bg-slate-700 rounded">
                Abstract
              </span>
            )}
          </div>
          {this.description && (
            <p className="text-gray-600 dark:text-gray-300 mt-2">{this.description}</p>
          )}
        </div>

        {/* Inherited Slots (collapsed by default) */}
        {this.data.parent && (
          <details className="border border-gray-300 dark:border-slate-600 rounded p-2">
            <summary className="cursor-pointer font-semibold">
              Inherited Slots (from {this.data.parent})
            </summary>
            {/* TODO: Render inherited slots */}
          </details>
        )}

        {/* Slots (merged from attributes + slots + slot_usage) */}
        {this.renderSlotsTable(onNavigate)}

        {/* Variables */}
        {this.data.variables && this.data.variables.length > 0 && (
          <DetailTable
            title="Variables"
            data={this.data.variables}
            columns={this.getVariableColumns()}
            splitThreshold={1700}  // Element-specific threshold
          />
        )}
      </div>
    );
  }

  private renderSlotsTable(onNavigate: (target: string, targetType: string) => void): JSX.Element {
    // Merge attributes, inherited slots, and slot_usage
    const slots = this.getMergedSlots();

    return (
      <DetailTable
        title="Slots"
        data={slots}
        columns={[
          { key: 'name', label: 'Slot' },
          { key: 'range', label: 'Type', clickable: true, onNavigate },
          { key: 'source', label: 'Source' },  // "Inline" | "Inherited from X" | "Slot: slotName"
          { key: 'description', label: 'Description' }
        ]}
        splitThreshold={1400}
      />
    );
  }

  private getMergedSlots(): SlotData[] {
    const slots: SlotData[] = [];

    // Add inline attributes (shown as "Inline" source)
    Object.entries(this.data.properties || {}).forEach(([name, def]) => {
      slots.push({
        name,
        range: def.range,
        required: def.required,
        multivalued: def.multivalued,
        description: def.description,
        source: 'Inline',
        customizedBy: this.data.slot_usage?.[name] ? 'slot_usage' : undefined
      });
    });

    // Add referenced top-level slots
    (this.data.slots || []).forEach(slotName => {
      const slotDef = this.slotDefinitions.get(slotName);
      if (slotDef) {
        slots.push({
          name: slotName,
          range: slotDef.range,
          description: slotDef.description,
          source: `Slot: ${slotName}`,  // Clickable link
          customizedBy: this.data.slot_usage?.[slotName] ? 'slot_usage' : undefined
        });
      }
    });

    // TODO: Add inherited slots from parent classes

    return slots;
  }

  private getVariableColumns() {
    return [
      { key: 'variableLabel', label: 'Variable' },
      { key: 'dataType', label: 'Data Type' },
      { key: 'ucumUnit', label: 'Unit' },
      { key: 'curie', label: 'CURIE' },
      { key: 'variableDescription', label: 'Description' }
    ];
  }

  getRelationships(): Relationship[] {
    /**
     * Returns all relationships this class has to other elements.
     * Used by LinkOverlay to draw SVG connections.
     *
     * Relationship types:
     * - 'inherits': parent class (is_a)
     * - 'property': class/enum referenced in a property's range
     *
     * Self-referential relationships (isSelfRef: true) are rendered as
     * looping SVG curves instead of cross-panel links.
     */
    const rels: Relationship[] = [];

    // Inheritance
    if (this.data.parent) {
      rels.push({
        type: 'inherits',
        target: this.data.parent,
        targetType: 'class',
        isSelfRef: false
      });
    }

    // Properties with non-primitive ranges
    Object.entries(this.data.properties || {}).forEach(([propName, propDef]) => {
      const range = propDef.range;
      const targetType = this.categorizeRange(range);

      if (targetType !== 'primitive') {
        rels.push({
          type: 'property',
          label: propName,
          target: range,
          targetType,
          isSelfRef: range === this.name
        });
      }
    });

    return rels;
  }

  private categorizeRange(range: string): 'class' | 'enum' | 'primitive' {
    if (['string', 'integer', 'float', 'boolean', 'date', 'datetime', 'uri', 'uriorcurie'].includes(range)) {
      return 'primitive';
    }
    if (range.endsWith('Enum')) {
      return 'enum';
    }
    return 'class';
  }
}
```

### Enum Element

```typescript
export class EnumElement extends Element {
  readonly type = 'enum' as const;
  private data: EnumDefinition;

  constructor(data: EnumDefinition) {
    super();
    this.data = data;
  }

  get name() { return this.data.name; }
  get description() { return this.data.description; }

  renderPanelSection(depth: number, onSelect: (entity: any) => void): JSX.Element {
    // Simple flat list (no depth/indentation)
    return (
      <div
        key={this.name}
        id={`enum-${this.name}`}
        data-entity-type="enum"
        data-entity-name={this.name}
        className="cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 px-2 py-1"
        onClick={() => onSelect(this.data)}
      >
        {this.name}
      </div>
    );
  }

  renderDetails(onNavigate: (target: string, targetType: string) => void): JSX.Element {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{this.name}</h1>
          {this.description && <p className="mt-2">{this.description}</p>}
        </div>

        {/* Enum values */}
        <DetailTable
          title="Permissible Values"
          data={Object.entries(this.data.permissible_values || {}).map(([value, def]) => ({
            value,
            description: def.description,
            meaning: def.meaning
          }))}
          columns={[
            { key: 'value', label: 'Value' },
            { key: 'description', label: 'Description' },
            { key: 'meaning', label: 'Meaning' }
          ]}
          splitThreshold={1000}
        />

        {/* Used by classes */}
        {this.data.usedByClasses && this.data.usedByClasses.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Used By Classes</h2>
            <ul className="list-disc list-inside">
              {this.data.usedByClasses.map(className => (
                <li key={className}>
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => onNavigate(className, 'class')}
                  >
                    {className}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  getRelationships(): Relationship[] {
    // Enums don't have outgoing relationships in current model
    // (Could add reverse relationships: enum → classes that use it)
    return [];
  }
}
```

### Slot and Variable Elements

```typescript
// Similar structure for SlotElement and VariableElement
// SlotElement: shows slot definition, which classes use it
// VariableElement: shows variable spec, which class it maps to
```

### Factory Function

```typescript
/**
 * Creates Element instances from raw data.
 *
 * @param data - Raw entity data (ClassNode | EnumDefinition | etc)
 * @param source - Explicit type indicator ('class' | 'enum' | 'slot' | 'variable')
 * @param context - Additional data needed (e.g., slot definitions for classes)
 */
export function createElement(
  data: any,
  source: 'class' | 'enum' | 'slot' | 'variable',
  context?: { slotDefinitions?: Map<string, SlotDefinition> }
): Element {
  switch (source) {
    case 'class':
      return new ClassElement(data, context?.slotDefinitions || new Map());
    case 'enum':
      return new EnumElement(data);
    case 'slot':
      return new SlotElement(data);
    case 'variable':
      return new VariableElement(data);
  }
}
```

## Part 3: Unified DetailTable Component

Instead of separate `AttributeTable`, `SlotUsageTable`, `VariableTable`, create a single generic table:

```typescript
// src/components/DetailTable.tsx

interface Column<T> {
  key: keyof T;
  label: string;
  clickable?: boolean;
  onNavigate?: (value: string) => void;
  renderer?: (value: any, row: T) => JSX.Element;
}

interface DetailTableProps<T> {
  title: string;
  data: T[];
  columns: Column<T>[];
  splitThreshold?: number;  // Width at which to split table horizontally
}

export function DetailTable<T>({ title, data, columns, splitThreshold = 1400 }: DetailTableProps<T>) {
  const [containerWidth, setContainerWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setContainerWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const shouldSplit = splitThreshold && containerWidth >= splitThreshold;

  if (shouldSplit) {
    // Render two side-by-side tables
    const midpoint = Math.ceil(data.length / 2);
    return (
      <div>
        <h2 className="text-lg font-semibold mb-2">{title} ({data.length})</h2>
        <div className="grid grid-cols-2 gap-4">
          <Table data={data.slice(0, midpoint)} columns={columns} />
          <Table data={data.slice(midpoint)} columns={columns} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">{title} ({data.length})</h2>
      <Table data={data} columns={columns} />
    </div>
  );
}

function Table<T>({ data, columns }: { data: T[], columns: Column<T>[] }) {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-gray-50 dark:bg-slate-700">
          {columns.map(col => (
            <th key={String(col.key)} className="border px-4 py-2 text-left">
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i} className="hover:bg-gray-50 dark:hover:bg-slate-700">
            {columns.map(col => {
              const value = row[col.key];
              return (
                <td key={String(col.key)} className="border px-4 py-2">
                  {col.renderer
                    ? col.renderer(value, row)
                    : col.clickable && col.onNavigate
                    ? <button onClick={() => col.onNavigate!(String(value))} className="underline">{String(value)}</button>
                    : String(value)
                  }
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

**Usage in Element classes:**

```typescript
// ClassElement
<DetailTable
  title="Slots"
  data={mergedSlots}
  columns={[
    { key: 'name', label: 'Slot' },
    {
      key: 'range',
      label: 'Type',
      clickable: true,
      renderer: (range, row) => (
        <ClickableType
          range={range}
          required={row.required}
          multivalued={row.multivalued}
          onNavigate={onNavigate}
        />
      )
    },
    { key: 'source', label: 'Source' },
    { key: 'description', label: 'Description' }
  ]}
  splitThreshold={1400}
/>
```

## Part 4: SVG Link Visualization

### Architecture Overview

```
App.tsx
  └─ PanelLayout.tsx
       ├─ ElementsPanel (left)
       ├─ ElementsPanel (right)
       └─ LinkOverlay.tsx (NEW)
            ├─ Tracks element positions
            ├─ Computes links via Element.getRelationships()
            └─ Renders SVG paths
```

### LinkOverlay Component

```typescript
// src/components/LinkOverlay.tsx

interface LinkOverlayProps {
  leftPanelSections: SectionType[];
  rightPanelSections: SectionType[];
  classHierarchy: ClassNode[];
  enums: Map<string, EnumDefinition>;
  // ... other data
}

export function LinkOverlay(props: LinkOverlayProps) {
  const [elementPositions, setElementPositions] = useState<Map<string, DOMRect>>(new Map());
  const [links, setLinks] = useState<ComputedLink[]>([]);
  const [hoveredLink, setHoveredLink] = useState<number | null>(null);

  // Track element positions
  useEffect(() => {
    const updatePositions = () => {
      const positions = new Map<string, DOMRect>();
      const elements = document.querySelectorAll('[data-entity-type]');

      elements.forEach(el => {
        const type = el.getAttribute('data-entity-type')!;
        const name = el.getAttribute('data-entity-name')!;
        const rect = el.getBoundingClientRect();
        positions.set(`${type}:${name}`, rect);
      });

      setElementPositions(positions);
    };

    // Update on mount, resize, scroll
    updatePositions();
    const observer = new ResizeObserver(updatePositions);
    const panels = document.querySelectorAll('[data-panel]');
    panels.forEach(panel => observer.observe(panel));

    window.addEventListener('scroll', updatePositions, true);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', updatePositions, true);
    };
  }, [props.leftPanelSections, props.rightPanelSections]);

  // Compute links
  useEffect(() => {
    const computed: ComputedLink[] = [];

    // Get all class elements
    props.classHierarchy.forEach(classNode => {
      const classElement = new ClassElement(classNode, props.slotDefinitions);
      const relationships = classElement.getRelationships();

      relationships.forEach(rel => {
        // Skip self-referential links (handled separately)
        if (rel.isSelfRef) return;

        const sourceKey = `class:${classNode.name}`;
        const targetKey = `${rel.targetType}:${rel.target}`;

        const sourcePos = elementPositions.get(sourceKey);
        const targetPos = elementPositions.get(targetKey);

        // Only render if both elements are visible
        if (sourcePos && targetPos) {
          computed.push({
            source: { x: sourcePos.right, y: sourcePos.top + sourcePos.height / 2 },
            target: { x: targetPos.left, y: targetPos.top + targetPos.height / 2 },
            relationshipType: rel.type,
            label: rel.label
          });
        }
      });
    });

    setLinks(computed);
  }, [elementPositions, props.classHierarchy]);

  return (
    <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
        </marker>
      </defs>

      {links.map((link, i) => {
        const path = computeBezierPath(link.source, link.target);
        return (
          <path
            key={i}
            d={path}
            stroke={getLinkColor(link.relationshipType)}
            strokeWidth={hoveredLink === i ? 2 : 1}
            fill="none"
            opacity={hoveredLink === i ? 1 : 0.3}
            className="pointer-events-auto cursor-pointer transition-all"
            onMouseEnter={() => setHoveredLink(i)}
            onMouseLeave={() => setHoveredLink(null)}
            markerEnd="url(#arrowhead)"
          />
        );
      })}
    </svg>
  );
}
```

### Viewport Culling - Partial Links

When one end of a link is out of viewport, show a "trailing" link to the edge:

```typescript
function computeLinkEndpoints(
  sourceBox: DOMRect,
  targetBox: DOMRect | null,
  panelViewport: DOMRect
): { start: Point, end: Point, isPartial: boolean } {

  const start = {
    x: sourceBox.right,
    y: sourceBox.top + sourceBox.height / 2
  };

  if (!targetBox) {
    // Target out of viewport - determine if above or below
    // (Need to track scroll position or element order)
    const isAbove = /* logic to determine if target scrolled above */;

    return {
      start,
      end: {
        x: panelViewport.left,
        y: isAbove ? panelViewport.top : panelViewport.bottom
      },
      isPartial: true
    };
  }

  return {
    start,
    end: { x: targetBox.left, y: targetBox.top + targetBox.height / 2 },
    isPartial: false
  };
}

// Render partial links with dashed stroke
<path
  d={path}
  stroke="gray"
  strokeDasharray={isPartial ? "4 2" : "none"}
  opacity={isPartial ? 0.4 : 0.2}
/>
```

### Self-Referential Links

Render as looping curves within the element's panel section:

```typescript
function SelfRefLink({ element, label }: { element: Element, label: string }) {
  const bbox = element.getBoundingBox();
  if (!bbox) return null;

  const startX = bbox.right;
  const startY = bbox.top + bbox.height / 2;

  // Quadratic bezier loop
  const controlX = startX + 30;
  const controlY = startY - 25;
  const endY = startY - 5;

  const path = `M ${startX} ${startY} Q ${controlX} ${controlY}, ${startX} ${endY}`;

  return (
    <g>
      <path
        d={path}
        fill="none"
        stroke="#2563eb"
        strokeWidth="1.5"
        markerEnd="url(#arrowhead)"
      />
      <text
        x={controlX}
        y={controlY - 5}
        className="text-xs fill-gray-600"
        textAnchor="middle"
      >
        {label}
      </text>
    </g>
  );
}
```

Self-referential links are rendered inline with the element, not in the cross-panel LinkOverlay.

## Implementation Plan

### Phase 1: Data Pipeline Updates
1. ✅ Add `--metadata-only` flag to download script
2. Modify `generate_metadata()` to extract `slot_usage`
3. Run `python3 scripts/download_source_data.py --metadata-only`
4. Update TypeScript types to include `slot_usage`

### Phase 2: Element Class Hierarchy
1. Create `src/models/Element.ts` with base class and all subclasses
2. Create `createElement()` factory function
3. Add unit tests for Element classes (optional but recommended)

### Phase 3: DetailTable Component
1. Create `src/components/DetailTable.tsx`
2. Implement responsive split logic
3. Add generic column rendering with custom renderers

### Phase 4: Refactor Existing Components
1. Update `ClassSection.tsx` to use `ClassElement.renderPanelSection()`
2. Update `EnumSection.tsx` to use `EnumElement.renderPanelSection()`
3. Update `DetailPanel.tsx` to use `Element.renderDetails()`
4. Remove old table components (merge into DetailTable)

### Phase 5: Add Data Attributes for Links
1. Ensure all panel sections render `data-entity-type` and `data-entity-name`
2. Test: Inspect DOM and verify attributes are present

### Phase 6: LinkOverlay Component
1. Create `LinkOverlay.tsx`
2. Implement position tracking with ResizeObserver
3. Implement link computation using `Element.getRelationships()`
4. Render SVG paths with hover interactions
5. Add viewport culling for partial links

### Phase 7: Self-Referential Links
1. Detect self-refs in `ClassElement.getRelationships()`
2. Render looping SVG curves inline in panel sections

### Phase 8: Testing & Polish
1. Test all link types render correctly
2. Test hover/click interactions
3. Test performance with all sections visible
4. Add link color legend
5. Add toggle to show/hide links

## Files to Create

- `src/models/Element.ts` - Base class and all element subclasses
- `src/components/DetailTable.tsx` - Generic table component
- `src/components/LinkOverlay.tsx` - SVG link rendering
- `src/components/SelfRefLink.tsx` - Looping curve for self-references

## Files to Modify

- `scripts/download_source_data.py` - Add slot_usage extraction
- `src/types.ts` - Add slot_usage to ClassMetadata interface
- `src/utils/dataLoader.ts` - Pass slot_usage to ClassNode
- `src/components/ClassSection.tsx` - Use ClassElement
- `src/components/EnumSection.tsx` - Use EnumElement
- `src/components/SlotSection.tsx` - Use SlotElement
- `src/components/VariablesSection.tsx` - Use VariableElement
- `src/components/DetailPanel.tsx` - Use Element.renderDetails()
- `src/components/PanelLayout.tsx` - Add LinkOverlay
- `src/App.tsx` - Pass data to LinkOverlay

## Success Criteria

1. ✅ Code is DRY - no duplication across element types
2. ✅ LinkML concepts properly understood and documented
3. ✅ Slots and attributes merged in UI (labeled by source)
4. ✅ Inherited slots shown (collapsed) with parent links
5. ✅ SVG links show relationships between panels
6. ✅ Self-referential links render as looping curves
7. ✅ Partial links visible when one end is scrolled out of view
8. ✅ Performance remains smooth
9. ✅ Codebase is maintainable and extensible

## Questions Answered

### Q: How does `getRelationships()` work?

A: Each Element subclass implements `getRelationships()` to return an array of `Relationship` objects describing connections to other elements. The LinkOverlay component calls this method for each visible element, then uses the relationship data to:

1. Determine which elements to connect
2. Look up DOM positions via `elementPositions` map
3. Compute SVG path coordinates
4. Render connecting lines with appropriate styling

Example flow:
```
ClassElement("Specimen").getRelationships() returns:
  [
    { type: 'property', label: 'specimen_type', target: 'SpecimenTypeEnum', targetType: 'enum' },
    { type: 'property', label: 'parent_specimen', target: 'Specimen', targetType: 'class', isSelfRef: true },
    ...
  ]

LinkOverlay iterates these relationships:
  - For SpecimenTypeEnum: looks up positions, draws line if both visible
  - For parent_specimen: skips (isSelfRef=true), handled by inline SelfRefLink component
```

### Q: Why pass source type to factory instead of duck typing?

A: Good point! Duck typing works but has disadvantages:
- Less explicit (relies on property detection)
- Error-prone (what if multiple types have overlapping properties?)
- Harder to debug (ambiguous type detection errors)

Passing explicit `source` parameter makes the intent clear and prevents type confusion. The caller already knows what type of data they have (from which Map/array it came from), so passing that information is straightforward.

### Q: Should we consolidate tables into single DetailTable?

A: Yes! Benefits:
- Single component to maintain
- Consistent styling across all entity types
- Element classes configure columns/data/thresholds
- Easy to add new features (sorting, filtering) in one place

The Element classes specify table configuration, DetailTable handles rendering.
