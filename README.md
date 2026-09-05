# BDCHM Interactive Documentation

Interactive documentation browser for the [BioData Catalyst Harmonized Model (BDCHM)](https://github.com/RTIInternational/NHLBI-BDC-DMC-HM) - a LinkML data model connecting clinical/observational classes to variable specifications.

**Live Demo**: https://sigfried.github.io/dynamic-model-var-docs/

---

## For Users

### What is BDCHM?

The BioData Catalyst Harmonized Model (BDCHM) is a LinkML schema that defines:
- **47 classes** organized by inheritance (e.g., `MeasurementObservation is_a Observation`)
- **40 enums** (constrained value sets like condition types, specimen types)
- **7 slots** (reusable attribute definitions shared across classes)
- **151 variables** (specific measurements/observations mapped to classes)

**Model Statistics**:
- Multiple root classes (no single "Entity" superclass)
- 68% of variables (103) map to MeasurementObservation class
- Rich graph structure with multiple relationship types

### Two apps

Since 2026-08-12 the repo builds **two entry points**:

- **`index.html` (default)** — the **Explore SPA**: pick entities from a
  selection table and see them as a layered ownership diagram with a detail
  drawer. Design notes: `docs/EXPLORE_VIZ.md`.
- **`previous.html`** — the previous app, holding the Entity Explorer, Kitchen
  Sink, and Focus views. Linked from the Explore header and vice versa.

Most of the feature description below refers to the previous app.

### What You Can Explore

**Browse relationships**:
- Inheritance chains (which classes extend which)
- Class→Enum usage (which classes use which value sets)
- Class→Class associations (participant relationships, specimen lineage, activity workflows)
- Slot definitions shared across multiple classes

**Investigate specific elements**:
- Which variables map to which classes (e.g., 103 variables map to MeasurementObservation)
- Class attributes and their value ranges (primitives, enums, or other classes)
- Full variable specifications (data type, units, CURIE identifiers)
- Inheritance chains with attribute overrides

### Features

**Dual Panel Layout**:
- Show different sections (Classes, Enums, Slots, Variables) side-by-side
- Each panel independently configurable
- SVG links visualize relationships between elements across panels
- Multiple preset layouts for common exploration tasks

**Interactive Navigation**:
- Click any class, enum, or slot to open its detail view
- Multiple detail dialogs can be open simultaneously
- Drag and resize dialogs for custom layouts
- Bidirectional "used by" lists (e.g., which classes use this enum?)

**State Persistence**:
- Shareable URLs preserve panel layout, open dialogs, and expansion state
- Browser localStorage saves your last session
- Copy URL to share exact view with collaborators

**Responsive Design**:
- Wide screens: Stacked detail panels on right side
- Narrow screens: Draggable/resizable dialogs
- Responsive tables split into columns for easier viewing

---

## For Developers

### Developer Documentation

- **[docs/CLAUDE.md](docs/CLAUDE.md)** — Development principles, architectural rules, and the gotchas to read before running anything
- **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** — Technical architecture, data flow, design patterns
- **[docs/TASKS.md](docs/TASKS.md)** — What is next, in priority order
- **[docs/BACKLOG.md](docs/BACKLOG.md)** — Deferred work, with full write-ups
- **[docs/TESTING.md](docs/TESTING.md)** — Testing strategy and documentation

Design and reference docs: [OWNERSHIP_CLASSIFICATION.md](docs/OWNERSHIP_CLASSIFICATION.md)
(the ownership rules, the colour system, how edges are drawn) ·
[TOURS_AND_CONTENT.md](docs/TOURS_AND_CONTENT.md) (the tour plan) ·
[EXPLORE_VIZ.md](docs/EXPLORE_VIZ.md) (Explore SPA design) ·
[HELP_PACKAGE_PLAN.md](docs/HELP_PACKAGE_PLAN.md) ·
[FOCUS_VIEW.md](docs/FOCUS_VIEW.md)

### Data Sources

- **Model Schema**: [bdchm.yaml](https://github.com/RTIInternational/NHLBI-BDC-DMC-HM/blob/main/src/bdchm/schema/bdchm.yaml) → processed into `public/source_data/HM/bdchm.processed.json`
- **Variable Specs**: [Table S1 (Google Sheet)](https://docs.google.com/spreadsheets/d/1PDaX266_H0haa0aabMYQ6UNtEKT5-ClMarP0FvNntN8/edit?gid=0#gid=0) → `variable-specs-S1.tsv`

**To update data manually**: `npm run download-data`

The schema is read straight from `bdchm.yaml` by `scripts/transform_schema.py`
via LinkML's `SchemaView` (`scripts/induced_schema.py`), which resolves imports
and merges inherited slots. There is no intermediate expanded-JSON artifact.

### Keeping the model in sync with upstream (maintainers)

**This is largely automatic — but it needs a human to merge.**

A GitHub Action (`.github/workflows/schema-sync.yml`) checks the upstream BDCHM
schema **daily at 07:00 UTC**, and can also be run on demand from the Actions
tab. When upstream `main` has moved past the commit pinned in
`scripts/download_source_data.py`, it bumps the pin, re-downloads, regenerates
`bdchm.processed.json`, and **opens a pull request** on the branch
`schema-sync/upstream-update`.

It never pushes to `main`. If nobody merges the PR, the app keeps serving the
older schema indefinitely and nothing breaks or warns — so **the PR is the
thing to watch.** `CODEOWNERS` requests review automatically; check open PRs
with `gh pr list` if you are unsure.

**To review and merge one:**

```bash
gh pr list                      # find the sync PR
gh pr diff <n> -- scripts/download_source_data.py   # see just the pin bump
gh pr checkout <n>              # test locally before merging
npm run build && npx vitest run
gh pr merge <n> --delete-branch
```

The Action **force-pushes** its branch on every run, so if a newer sync lands
while you are testing, re-run `gh pr checkout <n>` rather than `git pull` — a
pull on a force-pushed branch will try to merge the old and new versions
together.

**What to check before merging** (the PR body repeats this):

- The `bdchm.processed.json` diff looks like intended schema changes.
- `npm run build` and `npx vitest run` pass. `entityCategories.test.ts` in
  particular catches classes that upstream added but nobody categorised — an
  uncategorised class renders **nowhere** in the UI, silently.
- Ownership-classification edge cases still hold. Several hand-curated sets in
  `src/models/containmentGraph.ts` are keyed on schema **slot names**, so an
  upstream rename can silently change how edges are drawn without failing any
  test. See [docs/OWNERSHIP_CLASSIFICATION.md](docs/OWNERSHIP_CLASSIFICATION.md).

A real example of that last point: the 2026-08 sync renamed
`associated_assay` → `associated_artifact` and widened its range, which left the
`Assay` class with no inbound edges at all. Nothing failed; the diagram just
quietly got worse. **Look at the rendered ownership graph after a sync**, not
only at the test output.

### Getting Started

```bash
# Install dependencies
npm install

# Download/update source data
npm run download-data

# Run development server
npm run dev

# Run tests
npm test

# Type checking
npm run typecheck

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

### Testing

The project has 500 tests across 40 test files covering:
- Data loading & processing
- Element relationships & SVG links
- Adaptive layout logic
- Duplicate detection
- Panel helpers & styling
- Component rendering

See [TESTING.md](docs/TESTING.md) for complete documentation on testing philosophy, strategies, and how to write tests.

### Contributing

When adding new features:
1. Extract testable logic into utility functions
2. Write tests for data transformations and calculations
3. Run full test suite before committing: `npm test -- --run`
4. Run type checking: `npm run typecheck`

See [Developer Documentation](#developer-documentation) above for links to all docs.

---

## Credits

Developed by Sigfried Gold with AI assistance from Claude (Anthropic).
