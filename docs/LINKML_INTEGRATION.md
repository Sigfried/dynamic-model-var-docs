# LinkML Integration: Analysis and Options

> Research notes on using LinkML tooling instead of custom transforms.
> Context: Our `transform_schema.py` has a bug where same-named attributes on
> different classes get collapsed into one slot definition (first class wins).
> 20 of 43 shared attributes are affected. See [TASKS.md](../TASKS.md).

---

## Background: How LinkML Resolves Per-Class Slots

LinkML has three mechanisms for associating properties with classes:

1. **Top-level slots** (`slots:`) — reusable, first-class definitions
2. **Inline attributes** (`attributes:` on a class) — class-owned, internally mangled as `class__slot`
3. **Slot usage** (`slot_usage:` on a class) — refinements of existing slots (narrower range, required, etc.)

The canonical way to get a slot's effective definition for a specific class is **`SchemaView.induced_slot(slot_name, class_name)`**, which merges all layers (class attributes, slot_usage, parent class contributions, mixins, top-level definition, schema defaults). All LinkML generators use this.

---

## Option 1: Use `induced_slot()` in Python Transform

Fix `transform_schema.py` to use Python `linkml-runtime`'s `SchemaView.induced_slot()` instead of our custom slot collection logic.

**What changes:**
- `transform_slots()` Part 1 currently takes the first class's definition for each attribute name and drops the rest
- Replace with: for each class, call `induced_slot(slot_name, class_name)` to get the correct per-class definition
- Produce per-class slot entries in `bdchm.processed.json` (e.g., `quantity-Procedure`, `quantity-DrugExposure`)

**Pros:**
- Targeted fix — only changes the Python transform step
- Uses the authoritative LinkML resolution logic
- Minimal downstream changes (TypeScript code already handles `overrides` field)

**Cons:**
- Still maintaining a custom transform pipeline
- Doesn't address the broader question of whether we should use more LinkML tooling

---

## Option 2: Use `linkml-runtime.js` in the Browser

The official [`linkml-runtime`](https://www.npmjs.com/package/linkml-runtime) npm package (v0.2.0) includes a TypeScript `SchemaView` with `inducedSlot()`. Load the schema in the browser and resolve slots at runtime.

**What it provides:**
- `SchemaView.inducedSlot(slotName, className)` — per-class slot resolution
- `SchemaView.classInducedSlots(className)` — all induced slots for a class
- `SchemaView.classAncestors()` / `slotAncestors()` — inheritance traversal
- `SchemaView.allClasses()` / `allSlots()` / `allEnums()` — iteration
- MetaModel types (ClassDefinition, SlotDefinition, EnumDefinition, etc.)

**What's missing vs Python `SchemaView`:**

The JS implementation is ~30 lines vs ~100 in Python. Missing features:

| Feature | Used in BDCHM? | Impact if missing |
|---------|----------------|-------------------|
| `default_range` fallback | Yes (set to `string`) | Slots without explicit range get `undefined` instead of `string`. Mitigated if feeding expanded JSON where ranges are already resolved. |
| `identifier`/`key` → `required` inference | Yes (`id` slot) | `id` wouldn't be marked required automatically. Minor — expanded JSON already has this resolved. |
| `inlined`/`inlined_as_list` inference | Yes (12 attributes) | Only matters when not explicitly declared. Expanded JSON has explicit values. |
| `min_value`/`max_value` mixing | No | Not used in BDCHM. |
| `_inherited_slots` (metaslot inheritance) | Unlikely | Advanced feature, probably not relevant. |
| Name mangling (`class__slot`) | Relevant to our bug | But expanded JSON already has per-class definitions in `attributes`, so `inducedSlot()` has the data it needs. |
| `domain_of` population | Yes, but we compute our own | We use graph-based "Used By" which is more complete than `domain_of` anyway. |

**Key insight:** If we feed `SchemaView` the expanded JSON (where LinkML CLI has already resolved inheritance, merged slot_usage into attributes, etc.), most missing inference features don't matter — the data is already materialized.

**Package status:**
- Written by a LinkML core developer who is open to expanding it
- Labeled experimental/alpha, last real development Sept 2022
- 12 monthly npm downloads
- Functional for basic cases, incomplete for advanced ones

**Pros:**
- Could eliminate `transform_schema.py` entirely
- Could replace portions of `dataLoader.ts` transform functions
- Schema-aware queries at runtime (no pre-computation)
- Aligns with LinkML ecosystem

**Cons:**
- Experimental package with minimal adoption
- Missing inference features (may not matter for our data, see above)
- Adds a runtime dependency for schema processing
- Need to verify it can be initialized from our data formats

---

## Option 3: Use `gen-typescript` for Type Generation

LinkML's `gen-typescript` generates TypeScript interfaces from a schema.

**What it produces:**
- `export interface` for each class (with `extends` for inheritance)
- Enum declarations
- Type aliases for identifier references
- Optional type guards (`-u` flag)
- JSDoc comments from descriptions
- Per-class slot types via `induced_slot()` internally

**Known bugs:**
- Enums are generated but **never referenced** by slot types (fall through to `string`)
- `date` type is lowercase (invalid TS — should be `Date`)
- Limited type mapping (only str/int/Bool/float/XSDDate → TS types)

**What it could replace:**
- `input_types.ts` DTO interfaces (~100 lines)
- `SchemaTypes.ts` data interfaces (~50 lines)

**What it can't replace:**
- Graph types in `SchemaTypes.ts` (edge types, node attributes — ~210 lines)
- Element classes in `Element.ts` (domain logic — 1396 lines)
- DataLoader orchestration and validation (~292 lines)
- DataService layer (~271 lines)

**Net savings: ~150 lines of boilerplate** out of ~2200 total. Not the "delete a lot, replace with a little" we'd want.

**Verdict:** Not worth it as a standalone change. The bugs (especially enums-never-referenced) mean we'd need to post-process the output anyway. Could become useful if combined with Option 2 (runtime SchemaView replaces more of the pipeline).

---

## Considerations for Any Option

### Variable Specs

Variable specifications come from a separate TSV, not from LinkML. They're bolted onto the schema model via `MapsTo` edges. Any LinkML integration would only cover the schema side — variables remain a separate concern. It might make sense to more clearly separate the variable interface from the schema explorer in the architecture.

### Graph Layer

The graphology graph currently serves two purposes:

1. **Relationship queries** — "which classes use this enum?", "what are this class's slots?", edge traversal
2. **Link visualization** — SVG lines between panels use edge data

If `SchemaView` were available at runtime (Option 2), it could answer many relationship queries (`classAncestors`, `classInducedSlots`, etc.). But the link visualization is spatial/panel-aware and would still need some data structure for visual relationships.

**Performance:** Graph queries are O(degree) lookups. `SchemaView` traversals walk the class hierarchy each time — probably negligible for ~50 classes, but worth benchmarking if we go that route. The bigger concern is initial load time if `SchemaView` needs to process the full schema.

**Could we drop graphology?** Possibly, if `SchemaView` + a simpler data structure for visual links covered all our needs. The graph is most valuable for multi-hop queries and the bidirectional "used by" lookups. Worth prototyping before committing.

---

## Recommended Path

1. **Short term (bug fix):** Option 1 — use `induced_slot()` in Python transform. Targeted, low risk, fixes the immediate problem.
2. **Medium term (explore):** Prototype Option 2 — try loading the schema into JS `SchemaView` and see if `inducedSlot()` produces correct results for our data. Evaluate what it could replace.
3. **Long term (if Option 2 works):** Incrementally migrate from custom transforms to `SchemaView` at runtime. Potentially drop `transform_schema.py`, simplify `dataLoader.ts`, and evaluate whether graphology is still needed.
