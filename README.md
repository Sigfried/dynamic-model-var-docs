# BDCHM Interactive Documentation

Interactive documentation browser for the [BioData Catalyst Harmonized Model (BDCHM)](https://github.com/RTIInternational/NHLBI-BDC-DMC-HM) - a LinkML data model connecting clinical/observational classes to variable specifications.

**Live Demo**: https://sigfried.github.io/dynamic-model-var-docs/

---

## For Users

### What is BDCHM?

The BioData Catalyst Harmonized Model (BDCHM) is a LinkML schema that defines:
- **54 classes** organized by inheritance (e.g., `MeasurementObservation is_a Observation`)
- **52 enums** (constrained value sets like condition types, specimen types)
- **337 induced slots** (attributes, resolved per class through the inheritance chain)
- **155 variables** (specific measurements/observations mapped to classes)

Counts are from `public/source_data/HM/bdchm.processed.json` and the variable
spec sheet, and move whenever the schema sync lands — see *Keeping the model in
sync* below.

**Model shape**:
- `Entity` is a range node, not a common superclass — the class hierarchy has
  several roots
- 69% of variables (107 of 155) map to `MeasurementObservation`
- Most relationships are **ownership** edges derived from slot ranges; the rules
  for deriving them are the app's central idea, and are not in the schema
  ([OWNERSHIP_CLASSIFICATION.md](docs/OWNERSHIP_CLASSIFICATION.md))

### Two apps

The repo builds **two entry points**:

- **`index.html` (default)** — the **Explore SPA**, described below.
- **`previous.html`** — the previous app, holding the Entity Explorer, Kitchen
  Sink and Focus views. Linked from the Explore header and vice versa. It is
  kept because it still shows things Explore does not (enum contents, per-entity
  detail).

### The Explore SPA

**Pick entities, and see how they fit together.** Tick classes in the left
panel — as a category list or as an ownership tree — and they are drawn on the
canvas as a layered diagram, owners to the left of what they own.

- **Rows are attributes.** Each box lists its class's attributes with range and
  cardinality. A coloured dot says what KIND of thing the attribute points at
  (entity, value set, data type); a filled dot means that target is drawn, a
  hollow one means it is not.
- **Edges leave the ROW, not the box**, so an edge tells you *which attribute*
  made it.
- **Ownership is derived, not declared.** The schema does not say what owns
  what; the app works it out from cardinality, range and a small set of curated
  overrides. Three edge kinds — owns, belongs-to, and association (dashed,
  arrowed both ends).
- **A class and its subclasses draw as one merged box**, with a header per
  child, so the Observation family is one box rather than six.
- **The relation bar** (`← N   M →`) on each box counts what it belongs to and
  what it owns, and opens a list of each — the way to navigate outward from
  what is already on screen.
- **Category views.** The `⊞` on a category header draws that whole content
  area at once.
- **A guided tour and a legend**, under Help.
- **Shareable URLs.** The whole canvas is one `?sel=` list, so a view can be
  sent to someone; the browser back button steps through canvases.

### The previous app (`previous.html`)

Three views over the same data: the **Entity Explorer** (dual panels of
Classes / Enums / Slots / Variables with SVG links drawn between them, and
draggable detail dialogs), the **Kitchen Sink**, and **Focus**. State persists
in the URL and in localStorage.

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

The project has 500 tests across 40 test files, covering schema loading and
transformation, ownership classification, the subgraph and merged-box view
models, edge routing and ports, help/tour content, and component rendering.

Several are **regression tests guarding bugs that shipped for months** — they
pin behaviour that no earlier test asserted, so a failure there usually means
the schema changed rather than the code broke. `mergedEdges.test.ts` says which.

See [TESTING.md](docs/TESTING.md) for testing philosophy and how to write tests.

⚠️ `npx vitest` needs **node 22+**; the default `node` is v16 and fails with a
`node:fs/promises` error that looks like a broken setup but is not.

### Contributing

1. Extract testable logic into utility functions
2. Write tests for data transformations and calculations
3. **Verify with `npm run build`** — `npx tsc --noEmit` is too weak and has let
   breakage through
4. Run the suite: `npx vitest run`

More rules, and the traps worth knowing before you run anything, are in
[docs/CLAUDE.md](docs/CLAUDE.md).

---

## Credits

Developed by Sigfried Gold with AI assistance from Claude (Anthropic).
