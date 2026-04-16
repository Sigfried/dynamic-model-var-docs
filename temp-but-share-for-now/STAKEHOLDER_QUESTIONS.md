# BDCHM Interactive Documentation: Plans for Further Development

**Target release: 2026-07-30**

**Open question: primary audience.** Should the release target non-technical users,
technical/model-designer users, or serve both via progressive disclosure? Planning for
both; the answer affects defaults and terminology.

Recent stakeholder feedback converged on a single theme: the current UI shows too much
at once. The direction below is a progressive-disclosure approach captured in a
[tabular drilldown mockup](https://sigfried.github.io/dynamic-model-var-docs/tabular-drilldown-mockup.html).

---

## Feedback on the tabular drilldown mockup

- Progressive disclosure is welcomed — it's an improvement over the current "everything
  at once" view.
- Basic terms like "slot" need to be defined somewhere (glossary, tooltips, or links to
  LinkML documentation). See terminology notes below.
- Enum detail cards (Example 4) should show CURIE labels and definitions, not just the
  CURIE identifiers.
- The variable drilldowns in Examples 6 and 7 will mostly be obsoleted by the coming
  Variable Library — no need to invest further effort in those.
- Idea raised in mockup review AND in the has-a hierarchy discussion (see below):
  let users pin a set of entities of interest and generate a model diagram just for
  those.

---

## Model structure — is-a vs has-a

- `ResearchStudyCollection` is actually the top-level container for everything else in
  the model — it's not just a peer class. The inheritance view doesn't make this
  visible.
- So far we've been showing the inheritance (is-a) hierarchy. The has-a hierarchy is
  probably of interest too, but may be big and overwhelming.
  - **Plan:** try building a whole-model has-a visualization and see what it looks
    like.
  - Then: can the "pin a set of entities, generate a diagram just for those" idea
    serve as a more focused way to view has-a relationships?
- The [LinkML-generated docs](https://rtiinternational.github.io/NHLBI-BDC-DMC-HM/Assay/)
  already render per-class Mermaid diagrams that distinguish the two:
  hollow-triangle arrowheads (`<|--`) for is-a, chevron arrows with cardinality
  (`-->` with `*`, `0..1`, `1`) for has-a. Worth considering for reuse or as a
  convention to match.

---

## Are links worth all the screen real estate they occupy?

- Links have value for their flashiness — they make users feel like they're looking at
  something sophisticated, and they give an immediate sense of structure.
- But only if you consider slots and ranges important on their own. If slots and ranges
  are just properties of classes, they don't need elevation to class-level in a
  bi/tri-partite graph.
- Slot reuse and override is probably of interest, at least to model designers. And enum
  hierarchy hasn't been dealt with either.
- In the new progressive-disclosure design, inline entity-summary cards and
  "Referenced by" lists cover the relationship-viewing need in a more compact way. Links
  could become an optional overlay or separate "Relationships" tab.

---

## Interface clean-up (for the current app, and principles for the refactor)

- Hide unhighlighted range items.
- Type at top of range panel (fix order to type, enum, class).
- Make classes start collapsed.
- In ranges, only include classes that appear as ranges.
- Recommended starter classes to lead with: Condition, Demography, MeasurementObservation.
- Make table sections collapsible, start collapsed.
- Make descriptions in tables collapsible — start as single line with full text in title
  text / tooltip.

---

## New interface ideas

These could be separate SPAs sharing code, or tabs within a single app. Worth
considering features from [`../icd11-playground/web`](https://sigfried.github.io/icd11-playground/)
for code reuse.

- **Non-technical user-oriented vocabulary.** Avoid LinkML-specific language.
  - "Permissible values" / "value sets" instead of "enumeration."
  - Something other than "classes" and "slots." Possibilities: *entity* /
    *property*, or *entity* / *attribute*.
  - Support showing LinkML-native terms via tooltips or a config toggle for users
    who want them.
- **Progressive disclosure** (captured in the
  [tabular drilldown mockup](https://sigfried.github.io/dynamic-model-var-docs/tabular-drilldown-mockup.html)):
  - Start with entities.
  - Drill down through inline slot / variable tables.
  - Drill down further into inline enum and class detail cards.
- **Feature-toggle widget** that explains each feature and lets users turn them on.
- **Tabs (not separate SPAs).** The current app could become a "Kitchen Sink" tab.

---

## Features from the ICD-11 Foundation Explorer worth incorporating

- Contextual help.
- Resizable panel layout.
- Cross-panel interactions (highlighting, …).
- Light / dark mode.

---

## Known bugs

- From Observation there's no way to see it's connected to ObservationSet. In the other
  direction, ObservationSet only points to DimensionalObservation.
  `ObservationSet.observations` should point to Observation. This bug is part of what
  inspired the current redesign discussion.
