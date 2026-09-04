# BDCHM Explorer help

Help + tour content for the dmvd Explorer. This file is dmvd's content; the
authoring format it is written in is specified in
[`src/help/FORMAT.md`](../help/FORMAT.md), which belongs to the help package
and knows nothing about BDCHM.

Parsed by [`parseHelpContent.ts`](../help/parseHelpContent.ts); pinned by
`src/test/helpContent.test.ts`. Package-level design lives in
[docs/HELP_PACKAGE_PLAN.md](../../docs/HELP_PACKAGE_PLAN.md).

---
<details>
<summary><b>TODO</b></summary>

- ~~i asked to have anchor: none content centered horizontally in the graph panel
  because the "Select entities on the left to build the ownership subgraph."
  message was sticking out annoyingly, but i think the off-window-center
  placement is bugging me more. don't necessarily undo the controls for it,
  but i think there should be a place to control this in the dmvd (not
  tour-help) code, right?~~
  **DONE 2026-08-29** — and yes, that place already existed: `centerOn` is a
  prop, so it was always dmvd's call. `ExploreApp.tsx` no longer passes it, so
  unanchored steps centre on the viewport both ways. The prop and its tests
  stay in the package. Why it can only ever centre horizontally is now written
  up in [FORMAT.md](../help/FORMAT.md#placement).

<details>
<summary><b>Original unfinished draft text</b></summary>

3. select MeasurementObservation and highlight observation_type. text:
   - While the relationship between an entity and its enumerations and raw
     data attributes is direct (e.g.,
     `MeasurementObservation.observation_type` ==> `MeasurementObservationTypeEnum`
     or `MeasurementObservation.age_at_observation` ==> `integer`), it can be
     related to other entities in more complex ways
     [can we animate this so that step 4 keeps this popover but shows the next bullet, etc?
     not sure best way to represent this in my outline...well, we're going to need a reasonably
     human-readable/writable format for the full tour specs anyway]
     - inheritance, known in modeling parlance as IS_A relationships,
       e.g., `MeasurementObservation.is_a` ==> `Observation`, or
     - association / ownership / containment, known in modeling parlance as HAS_A relationships,
       e.g., `Visit.associated_participant` ==> `Participant`.
     A primary goal 
   - Entities can be related to each other through
4. goal is to show all the relationship types. if there are any entities
   that use all four, select one of those, otherwise will have to select
   one that has most and then select another that has the others. steps:
   1. **Selecting an entity** Select an entity by clicking its checkbox;
      the entity will appear in the main panel along with directly related
      entities. There are five ways an entity can be related to another.
   2. highlight row
   3. click checkbox.
</details>


### following steps not finished yet. ignore
- **Make better Change, Action, Beat implementation**
  - When relationship-kinds (Tour 3.1) pops up the action has already
    occurred and the Action: text does not make the step more legible.
    A better sequence of events would be:
    - anchor on unchecked MeasurementObservation selection row
    - actually would be better if this were not 
- **Change: allow add, remove, clear.** The authoring
  format has an additive `Change:` and no remove verb. Consequence
  today: tour step 4 ADDS to step 3's canvas instead of replacing it,
  so the canvas is cumulative where the copy reads as if it were
  showing a clean two-box example. Notes about this also in
  `help-content.md`
- **Tour authoring notes + draft preview** — `Note:` / `Draft:`
  / `ForClaude:` fields, and a way to view a tour *including* its
  parked and unfinished steps. deferred 2026-08-27 for time
- **Multi-line for the OTHER fields** (`Context:`, `Action:`, beat text).
  Deliberately not done: you said "1 for now; may need 2 soon". The block
  reader (`extractBlockField`) is written generically, so each field is a
  one-line change when you want it.
- **Multi-line for the OTHER fields** (`Context:`, `Action:`, beat text) —
  still parked at your "1 for now". Also listed below.


</details>
---
<details open>
<summary><b>Getting started</b></summary>

## Getting started

What this app is and how to move around it.

### intro

- **Title:** BDCHM Explorer
- **Tour:** Walkthrough
- **Description:** 
  BioData Catalyst ([BDC](https://biodatacatalyst.nhlbi.nih.gov/))
  is a cloud-based ecosystem where researchers can find and work with
  [NHLBI](https://www.nhlbi.nih.gov/) data resources. Studies arrive with
  their own terminologies, units and file structures, which are
  transformed by the Data Model-Based Ingestion Pipeline
  ([dm-bip](https://linkml.io/dm-bip/)) into a common **BDC Harmonized
  Model (BDCHM)** schema. Nine priority [TOPMed](https://topmed.nhlbi.nih.gov/)
  cohorts (e.g., the Framingham Heart Study and Women's Health Initiative)
  and the [INCLUDE Data Hub](https://portal.includedcc.org/) have been
  harmonized to it so far with more on their way.

  BDCHM and the ingestion pipeline are built using [LinkML](https://linkml.io/).
  Neither the raw LinkML [YAML file](https://github.com/RTIInternational/NHLBI-BDC-DMC-HM/blob/main/src/bdchm/schema/bdchm.yaml)
  nor the LinkML [generated documentation](https://rtiinternational.github.io/NHLBI-BDC-DMC-HM/)
  are easy to grasp given that BDCHM's over 4,000-line schema includes around
  225 total attributes, 55 distinct class entities, 50 permissible value sets,
  7 primitive data types, and 80 relationships between class entities. 
  Yet doing almost anything involving BDCHM would require a basic, overall
  understanding of its structure. You may want to use BDCHM:
  - to analyze data harmonized to it (using [BDC's tools](https://biodatacatalyst.nhlbi.nih.gov/use-bdc/analyze-data/)
    or otherwise);
  - to harmonize your own data to it;
  - design new studies pre-harmonized to it; or
  - use it for ideas or inspiration in designing your own data models.

  The **BDCHM Explorer** provides a single-page, highly interactive interface
  allowing you to easily see details of and relationships between specific
  entities or neighborhoods around entities you select.

  > This tour will introduce you to all of BDCHM Explorer's major features.
  > - Click the ✕ or hit **Esc** any time to exit.
  > - Use arrow keys or next/back buttons to navigate.
- **Anchor:** none
- **Once:** intro
- **Change:**
- **Width:** 700

### selection-tree

- **Title:** Entities
- **Tour:** Walkthrough
- **Anchor:** selection-tree
- **Description:** A LinkML schema defines classes representing a data model's
  entities. The left panel lists them, grouped into categories for convenience,
  though these categories are not actually part of the schema.
- **Beats:** <!-- these are just copied from below, need to get beats working
              right before authoring -->
  1. In order to select an entity for display, click its checkbox
     - Anchor: entity-row:Person
  2. The Person box shows the entity name, a dismiss (x) icon, a menu
     for displaying boxes for related entities, and a list of this entity's
     attributes.
     - Anchor: node-box:Person
     - Change: sel=Person
     - Action: I clicked the Person checkbox and the Person entity appeared in the viewing panel.
  3. Hover over the `← 2` or `1 →` counts to list the entities related to this
     one, and click any of them to display it.
     - Anchor: node-box:Person
     - Highlight: none

### entities

- **Title:** Entities
- **Tour:** Walkthrough
- **Anchor:** selection-tree
- **Description:** A LinkML schema defines classes representing a data model's
  entities. A class defines a set of slots or attributes (like columns in
  a database table) which can hold
  - other entities,
  - permissible value sets (enumerations),
  - or raw data types (strings, integers, etc.)

<!--
  TODO(siggie): translated faithfully, but note what this replaced. The
  entry that used to sit at tour position 2 was different copy entirely
  ("Choosing what to look at" — ownership nesting, what the checkbox vs the
  arrow vs the name each do, and a Context about an entity appearing in
  more than one place). Your draft's step 2 does not cover any of that.
  It is preserved verbatim as `selection-tree-mechanics` below, help-only,
  so nothing is lost. Decide whether your step 2 should absorb it.
-->

### relationship-kinds

- **Title:** How entities relate
- **Tour:** Walkthrough
- **Description:** While the relationship between an entity and its enumerations and raw data attributes is direct (e.g., `MeasurementObservation.observation_type` → `MeasurementObservationTypeEnum`, or `MeasurementObservation.age_at_observation` → `integer`), it can be related to other entities in more complex ways.
- **Action:** Selected MeasurementObservation for you, and highlighted its `observation_type` attribute.
- **Anchor:** slot-row:MeasurementObservation.observation_type
- **Change:** sel=MeasurementObservation
- **Beats:**
  1. **Inheritance**, known in modeling parlance as IS_A relationships — e.g. `MeasurementObservation.is_a` → `Observation`.
     - Anchor: node-box:MeasurementObservation
  2. **Association / ownership / containment**, known in modeling parlance as HAS_A relationships — e.g. `Visit.associated_participant` → `Participant`.
     - Anchor: node-box:MeasurementObservation
  3. A primary goal
     - Anchor: none
  4. Entities can be related to each other through
     - Anchor: none

<!--
  TODO(siggie): beats 4 and 5 are your two truncated sentences, carried
  over exactly as they trail off. Nothing invented. They will render as
  broken fragments in the tour until you finish them — that is deliberate,
  so they cannot ship unnoticed.

  [sg] the "solutions" below are not good

  TODO(siggie): this step is where you asked "can we animate this so that
  step 4 keeps this popover but shows the next bullet, etc?" Beats are the
  answer, and as of 2026-08-28 they ADD rather than replace, which is what
  you actually asked for: the Description stays on screen and each beat
  appears below it, earlier ones dimmed. The old beat 1 existed only to
  repeat the Description so it would not vanish -- deleted, with its
  `slot-row` anchor moved up to the entry where the step now starts.

  TODO(siggie): your draft numbers this "3" and puts "select
  MeasurementObservation and highlight observation_type" in the step title.
  The Action: field now says that out loud, which is the fix for the bug
  where a step changed the app silently.
-->

### selection-tree-mechanics

- **Title:** Choosing what to look at
- **Description:** Entities are arranged by **ownership**: an entity is nested under whatever owns it. Tick a checkbox to put an entity on the diagram. The checkbox is the only thing that selects — clicking the row or the arrow just opens and closes the tree.
- **Interactions:**
  - Checkbox — add or remove that entity from the diagram.
  - Arrow — expand or collapse, without changing the selection.
  - Name — open the details panel without changing the selection.
- **Context:** An entity can sit in more than one place in the tree, because things can be owned by more than one kind of thing. The widget marks the duplicates for you.
- **Anchor:** selection-tree

</details>
---
<details open>
<summary><b>Reading the diagram</b></summary>

## Reading the diagram

What the boxes and lines mean.

### graph-canvas

- **Title:** Selecting an entity
- **Tour:** Walkthrough
- **Description:** Select an entity by clicking its checkbox and it appears in the main panel. Only what you select is drawn — related entities are reached from the box's relation bar. There are five ways an entity can be related to another.
- **Action:** Added Participant and BodySite to what is already on the diagram. You would normally do this by ticking them in the tree on the left.
- **Change:** sel=BodySite~Participant
- **Beats:**
  1. Select an entity by clicking its checkbox and it appears in the main panel. Only what you select is drawn. There are five ways an entity can be related to another.
     - Anchor: selection-tree
  2. This is the entity's row in the selection panel.
     - Anchor: entity-row:Participant
  3. Clicking the checkbox is what puts it on the diagram.
     - Anchor: entity-checkbox:Participant

<!--
  TODO(siggie): your draft's step 4 says "goal is to show all the
  relationship types. if there are any entities that use all four, select
  one of those, otherwise will have to select one that has most and then
  select another that has the others." That is an instruction to yourself,
  not copy — it is NOT translated into a beat. The `Change:` above still
  carries the old `sel=BodySite~Participant`; pick the entity or entities
  that actually demonstrate all five once you have checked which do.

  Note this step now ADDS to the diagram rather than replacing it, so
  MeasurementObservation from step 3 is still drawn beside Participant and
  BodySite. The Action: says so. If the step wants a clean two-box diagram
  instead, the format has no "remove" verb — say so and it can gain one.

  Note the count: your draft says "five ways" here and you confirmed five
  is right (four ownership kinds + associations). The stale "four" note is
  gone.

  TODO(siggie): this entry kept the id `graph-canvas` so its help-only
  content is not orphaned, but your draft's step 4 is about the SELECTION
  panel, not the canvas. The old canvas copy is preserved as
  `graph-canvas-reading` below. Consider renaming this entry.
-->

### graph-canvas-reading

- **Title:** The diagram
- **Description:** Each box is an entity; each row inside it is one of that entity's attributes. Lines run from an owner to the thing it owns, so reading left to right is reading "contains".
- **Interactions:**
  - Click a box to open its details.
  - Drag a box to move it; drag the background to pan.
  - Click an attribute row that names an entity to pull that entity onto the diagram.
- **Anchor:** graph-canvas

### relation-menu

- **Title:** The relation bar
- **Description:** Every entity related to this one, split by which side of the diagram it sits on. **← N** counts the entities this one belongs to, drawn to its left; **M →** counts the ones it owns, drawn to its right. Hovering either opens the list.
- **Interactions:**
  - Hover **← N** or **M →** to list the relationships on that side.
  - Each row names the attribute that creates the relationship, draws the edge the way the diagram draws it, and gives the cardinality and the entity at the other end.
  - Click a row to put that entity on the diagram — which also ticks its checkbox on the left. Click it again to take it off; entities already drawn are dimmed.
  - "add all N" / "hide all N" draws or clears the whole side at once. "hide all" removes every entity on that side, including ones you had selected yourself.
  - **ⓘ** opens an entity's details without adding it to the diagram.
- **Context:** Entities are laid out so that owners come first, so everything that owns this one is to its left and everything it owns is to its right — that is all the two counts mean. The little edge on each row says something different: **which end carries the arrowhead**, and so which entity declares the attribute. Both kinds turn up on both sides. Of the four entities that own an Observation, three do because Observation points at them, and one because ObservationSet collects it. Organization is the extreme case: it owns thirteen kinds of thing and declares no attribute for any of them, so every row on its owned side points back at it.

### node-dismiss

- **Title:** Closing a box
- **Description:** Removes this entity from the diagram and unticks its checkbox on the left. A merged box removes every entity in it at once.

### toolbar-siblings

- **Title:** Merged inheritance boxes
- **Description:** When several entities on the diagram share a parent, they collapse into one box titled by that parent. Rows the parent defines come first, then a coloured header per child followed by the rows that child adds.
- **Interactions:**
  - Toggle off to draw each entity as its own separate box.
- **Context:** Lines leaving a child's rows take that child's colour, so you can trace a line back to the block it came from.

</details>
---
<details open>
<summary><b>Sharing what you see</b></summary>

## Sharing what you see

### copy-link

- **Title:** Copy link
- **Tour:** Walkthrough
- **Description:** Copies a link that reproduces **exactly** this view — the selection and the toolbar settings. Anyone opening it sees what you see.
- **Interactions:**
  - Click to copy; the URL bar always holds the same link.
- **Context:** Settings travel in the link, so a diagram you set up deliberately does not get redrawn with someone else's preferences.
- **Change:**

### help-menu

- **Title:** Help
- **Description:** Everything explaining the diagram, in one menu.
  - **Ownership legend** — what the arrows, colors and toolbar buttons mean, and every relationship in the schema grouped by the rule that classified it.
  - **Example cases** — named selections that show particular routing and inheritance situations. Useful for seeing what the diagram does with the awkward cases.

  The two open as separate panels, so you can keep the legend up while you flip through cases.

### help-button

- **Title:** Help and tour
- **Description:** **Take the tour** for a short guided walk through the app. Press `?` anywhere to start it, and again (or `Esc`) to leave.
- **Shortcut:** ?

</details>
