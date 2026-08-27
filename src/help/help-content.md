# Explorer help

Help + tour content for the dmvd Explorer. The **Format** section below is the
spec; everything from *Getting started* onward is the content itself.

Parsed by `parseHelpContent.ts`; pinned by `src/test/helpContent.test.ts`.
Package-level design lives in [docs/HELP_PACKAGE_PLAN.md](../../docs/HELP_PACKAGE_PLAN.md).

---

## Format

> This section is the spec, and it is deliberately part of the document so it
> renders wherever the file is read. The parser skips it by name — see
> `SPEC_SECTION` in `parseHelpContent.ts`. Keep it current when the format
> changes.

### Structure

```
## Section Title          — groups entries; body text before the first ###
### entry-id              — one entry: a help topic and/or a tour step
```

Sections are separated by `---` lines.

**Sections organise the source file; they do not appear in the app.** Neither
a section's title nor its body text is rendered anywhere today — the popover
shows one entry at a time, and both the tour and help mode reach entries
through the flat registry, never through sections. So:

- **Prose written as section body text is invisible to the reader.** If you
  want it in the tour, it belongs in an entry's `Description:`.
- **Section boundaries do not constrain tour order.** `Tour:` is sorted across
  the whole file, so consecutive steps may sit in different sections and steps
  can be renumbered without moving entries.

They are still doing two jobs, so do not remove them: they group entries
legibly in this file, and the `---` separators between them are what the
parser splits on. `HelpSection.body` is parsed and available if a future help
mode wants to show section intros — it is unused, not unsupported.

### Entry fields

| Field | Meaning |
|---|---|
| `Title:` | short name shown as the popover heading |
| `Description:` | one or two sentences; markdown allowed |
| `Interactions:` | bullet list of what you can do |
| `Shortcut:` | key hint, rendered as a `<kbd>` |
| `Context:` | smaller footnote text |
| `Anchor:` | what to point at — see [Anchors](#anchors) |
| `Action:` | one sentence saying what the tour just DID — see [Actions](#actions) |
| `State:` | full URL query the app is put into before this step |
| `Tour:` | 1-based position in the guided tour; omit for help-only |
| `Beats:` | ordered sub-steps within one step — see [Beats](#beats) |

Written as `- **Field:** value`. Only `Title` and `Description` are required.
An entry with no `Tour:` is help-only: reachable in help mode, never visited by
the tour.

### Disabling a field

**Prefix any field name with `_` to park it.** The field is still parsed, but
treated as absent:

```markdown
- **_Tour:** 4        <- entry drops out of the tour, stays available as help
- **_State:** sel=X   <- state not applied
```

Use it for a step that is written but not ready to appear. The tour renumbers
around the gap, so parking step 4 of 6 leaves a working 5-step tour rather than
a hole.

### Anchors

An entry's `### id` is its **identity** — the key in the registry, and what
tests and links refer to. It is not required to name a DOM element. `Anchor:`
says what to point at:

| Form | Meaning |
|---|---|
| *(omitted)* | the element tagged `data-help-id="<the entry id>"` |
| `none` | no anchor; the popover is centred and nothing is ringed |
| `<kind>:<argument>` | a resolver looks the element up at runtime |
| `<bare-id>` | shorthand for `help-id:<bare-id>` |

Omitting it reproduces the old behaviour exactly, so **every help entry written
before this format keeps working untouched**.

Resolver kinds are registered by the **host app**, not by the parser — the
parser treats `kind:argument` as an opaque string so the help package can be
extracted without knowing what a dmvd "entity row" is.

| Kind | Points at |
|---|---|
| `help-id:<id>` | an element tagged `data-help-id="<id>"` |
| `entity-row:<Entity>` | that entity's row in the selection panel |
| `entity-checkbox:<Entity>` | that row's checkbox |
| `slot-row:<Entity>.<slot>` | one attribute row inside a diagram box |
| `node-box:<Entity>` | a whole entity box on the diagram |

All five resolve. An anchor whose element is not on screen — a collapsed tree
row, a box the current selection does not include — degrades to an unringed,
centred popover rather than failing.

Two of them have an edge worth knowing when you author:

- **`entity-row` / `entity-checkbox`** work in both left-panel modes (table and
  tree). In tree mode everything starts collapsed, so a deeply nested entity's
  row may not exist in the DOM when the step fires; give such a step a
  `State:` that selects the entity, or anchor it at the diagram instead.
- **`slot-row:<E>.<slot>`** splits on the LAST dot. Inside a merged sibling box
  several rows can share a slot name, and `<E>` is what picks between them.

### Actions

When a step changes the app for the viewer, it **must** say so:

```markdown
- **Action:** Ticked MeasurementObservation for you in the panel on the left.
```

Write it as a plain sentence in the tour's own voice. This exists because a step
that silently changes the diagram reads as a description of whatever just
appeared. The popover renders `Action:` text in its own band, visually distinct
from the description.

**Rule of thumb:** if the step carries a `State:` that differs from the previous
step's, it needs an `Action:`. A test enforces this.

### State

`State:` is a **full, absolute** URL query — never a diff from the previous
step. That is what makes `back` exact: every step and beat sets the whole world,
so arriving at it from either direction gives the same view.

```markdown
- **State:** sel=BodySite~Participant
```

A step or beat that changes nothing omits `State:` and inherits whatever the
previous one set.

The tour **also** snapshots the viewer's own state when it starts and restores
it when it ends. That is runtime behaviour, not format — nothing is authored
for it here.

### Beats

A tour step is one popover that can advance through several **beats** without
moving on to the next step. Use beats for sub-steps of one idea, and for
revealing a list one item at a time.

```markdown
- **Beats:**
  1. First beat's text. Markdown allowed.
     - Anchor: selection-tree
  2. Second beat's text.
     - Anchor: entity-row:MeasurementObservation
     - Action: Ticked it for you.
     - State: sel=MeasurementObservation
```

Each beat may carry its own `Anchor:`, `Action:` and `State:` as indented
`- Field: value` lines. Note these are **plain, not bold** — that is what keeps
a beat's own fields distinguishable from the entry fields that follow the block.
A beat that omits a field inherits the step's.

A step with no `Beats:` is exactly one beat, so steps written before beats
existed still parse and behave identically. `next` advances beat by beat, then
to the next step; the counter reads `4.2 / 6` — beat 2 of step 4, of six
STEPS. A step with no beats reads plain `5 / 6`, so the sub-number shows up
only where there is a beat to number.

### Who the tour is for

Someone who arrives from a **link** with no one explaining it — the program
manager case. So step 1 assumes nothing, and any step that needs a selection
brings its own via `State:` rather than asking the visitor to click first.

---

## Getting started

What this app is and how to move around it.

### app-title

- **Title:** BDCHM Explorer
- **Description:** An interactive map of the [BioData Catalyst Harmonized Model](https://rtiinternational.github.io/NHLBI-BDC-DMC-HM/) — the ~55 entities defined by its [LinkML schema](https://linkml.io/) and how they relate to each other. You can use it to understand those relationships more quickly and thoroughly than with the static [LinkML documentation](https://rtiinternational.github.io/NHLBI-BDC-DMC-HM/).
- **Context:** It is meant to help researchers who have access to data in BDCHM format and want to understand its structure; have data they want to harmonize to BDCHM format; or are designing studies and want to model them using BDCHM, or want to use BDCHM for ideas or inspiration for their own efforts.
- **Interactions:**
  - Pick some entities on the left and the diagram shows how they fit together.
  - Click the title to clear everything and start over.
- **Anchor:** app-title
- **Tour:** 1

<!--
  TODO(siggie): your draft has a bracketed note here —
  "[add a phrase/sentence about the overall project; i'm trying to find a
  good link for that]". Nothing invented in its place; the Description
  above stops where your draft stops.

  Anchor resolved 2026-08-27 (Siggie): `app-title`, not `none`. Rings the
  title AND dims the rest — the dim is the spotlight ring's outer shadow,
  so an anchorless step gets no dim by construction. This closes your
  draft's "sort of highlights the title but doesn't dim the rest".
-->

### selection-tree

- **Title:** Entities
- **Description:** A LinkML schema defines classes representing a data model's entities. A class defines a set of slots or attributes (like columns in a database table) which can hold
- **Interactions:**
  - other entities,
  - permissible value sets (enumerations),
  - or raw data types (strings, integers, etc.)
- **Tour:** 2

<!--
  TODO(siggie): translated faithfully, but note what this replaced. The
  entry that used to sit at tour position 2 was different copy entirely
  ("Choosing what to look at" — ownership nesting, what the checkbox vs the
  arrow vs the name each do, and a Context about an entity appearing in
  more than one place). Your draft's step 2 does not cover any of that.
  It is preserved verbatim as `selection-tree-mechanics` below, help-only,
  so nothing is lost. Decide whether your step 2 should absorb it.

  TODO(siggie): the three bullets are the tail of the Description sentence
  ("...which can hold: other entities, ..."), not really "Interactions" —
  they describe the schema, not things the viewer can do. Rendered as a
  bullet list under the description, which reads correctly, but if you want
  them typographically part of the sentence they should move into
  Description as inline markdown.

  TODO(siggie): no `State:`. Your draft's step 2 is pure exposition, but
  the old step 2 carried `sel=Participant`. The test that required every
  step after the first to bring its own state has been relaxed (see
  helpContent.test.ts) — but if this step should show something on the
  diagram, give it a State: and an Action:.
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

### relationship-kinds

- **Title:** How entities relate
- **Description:** While the relationship between an entity and its enumerations and raw data attributes is direct (e.g., `MeasurementObservation.observation_type` → `MeasurementObservationTypeEnum`, or `MeasurementObservation.age_at_observation` → `integer`), it can be related to other entities in more complex ways.
- **Action:** Selected MeasurementObservation for you, and highlighted its `observation_type` attribute.
- **Anchor:** none
- **State:** sel=MeasurementObservation
- **Tour:** 3
- **Beats:**
  1. While the relationship between an entity and its enumerations and raw data attributes is direct, it can be related to other entities in more complex ways.
     - Anchor: slot-row:MeasurementObservation.observation_type
  2. **Inheritance**, known in modeling parlance as IS_A relationships — e.g. `MeasurementObservation.is_a` → `Observation`.
     - Anchor: node-box:MeasurementObservation
  3. **Association / ownership / containment**, known in modeling parlance as HAS_A relationships — e.g. `Visit.associated_participant` → `Participant`.
     - Anchor: node-box:MeasurementObservation
  4. A primary goal
     - Anchor: none
  5. Entities can be related to each other through
     - Anchor: none

<!--
  TODO(siggie): beats 4 and 5 are your two truncated sentences, carried
  over exactly as they trail off. Nothing invented. They will render as
  broken fragments in the tour until you finish them — that is deliberate,
  so they cannot ship unnoticed.

  TODO(siggie): this step is where you asked "can we animate this so that
  step 4 keeps this popover but shows the next bullet, etc?" Beats are the
  answer: one popover, `next` reveals the following beat. Beat 1 repeats
  the Description because a step's Description shows before its beats do;
  if that reads as a stutter, cut one of them.

  TODO(siggie): your draft numbers this "3" and puts "select
  MeasurementObservation and highlight observation_type" in the step title.
  The Action: field now says that out loud, which is the fix for the bug
  where a step changed the app silently.
-->

---

## Reading the diagram

What the boxes and lines mean.

### graph-canvas

- **Title:** Selecting an entity
- **Description:** Select an entity by clicking its checkbox; the entity will appear in the main panel along with directly related entities. There are five ways an entity can be related to another.
- **Action:** Selected Participant and BodySite for you. You would normally do this by ticking them in the tree on the left.
- **State:** sel=BodySite~Participant
- **Tour:** 4
- **Beats:**
  1. Select an entity by clicking its checkbox; the entity will appear in the main panel along with directly related entities. There are five ways an entity can be related to another.
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
  not copy — it is NOT translated into a beat. The State: above still
  carries the old `sel=BodySite~Participant`; pick the entity or entities
  that actually demonstrate all five once you have checked which do.

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

- **Title:** The relation menu
- **Description:** Every entity related to this one, grouped by how it is related. The trigger says how many there are and how many are already on the diagram; opening it branches into the five kinds of relationship, and each branch lists the entities in it.
- **Interactions:**
  - Click **☰ N related · M shown** to open the menu, then a branch to list its entities.
  - Click an entity to put it on the diagram. Click it again — or its ✕ — to take it off; entities already drawn are greyed out.
  - "add all N" — draw a whole branch at once. The count is shown before you click. It appears only when there is more than one entity left to add.
  - **ⓘ** opens an entity's details without adding it to the diagram.
- **Context:** From one entity's point of view there are five ways to be related. Four are ownership, and each names which side declares the attribute that creates it. Running *outward*: things that **belong to me by my attribute** (this entity declares the slot) and things that **belong to me by their attribute** (they declare it, pointing back here). Organization is entirely the second kind — it owns thirteen kinds of thing and declares no slot for any of them. Running *inward*, the same split: entities **I belong to, by my attribute** and entities **I belong to, by their attribute**. Fifth are **associations**, where neither entity owns the other.

### node-dismiss

- **Title:** Closing a box
- **Description:** Removes this entity from the diagram. What that means depends on why it is here: a selected entity is deselected, and one that arrived as context is simply hidden.

### toolbar-owners

- **Title:** How many owners to draw
- **Description:** Sets how many **owning** entities are drawn per box: **0** draws none, **≤5** draws up to five, **all** draws every one.
- **Context:** This governs only the entities one hop *up* — the ones that own the boxes you selected. An entity nothing owns draws nothing extra even at **all**: Organization, for instance, is owned by nothing, so selecting it alone gives one box at every setting. Its thirteen relations all run the other way, and the relation menu is where you reach those. "all" can pull a lot onto the diagram at once — a value type like Quantity is owned by around twenty entities.

### toolbar-siblings

- **Title:** Merged inheritance boxes
- **Description:** When several entities on the diagram share a parent, they collapse into one box titled by that parent. Rows the parent defines come first, then a coloured header per child followed by the rows that child adds.
- **Interactions:**
  - Toggle off to draw each entity as its own separate box.
- **Context:** Lines leaving a child's rows take that child's colour, so you can trace a line back to the block it came from.

---

## Sharing what you see

### copy-link

- **Title:** Copy link
- **Description:** Copies a link that reproduces **exactly** this view — the selection, what is expanded, and the toolbar settings. Anyone opening it sees what you see.
- **Interactions:**
  - Click to copy; the URL bar always holds the same link.
- **Context:** Settings travel in the link, so a diagram you set up deliberately does not get redrawn with someone else's preferences.
- **State:** sel=BodySite~Participant
- **Tour:** 5

### example-cases

- **Title:** Example cases
- **Description:** Named selections that show particular routing and inheritance situations. Useful for seeing what the diagram does with the awkward cases.

### help-button

- **Title:** Help and tour
- **Description:** **Take the tour** for a short guided walk, or turn on **help mode** to explore at your own pace — every part of the screen with help attached gets a dot you can click.
- **Shortcut:** ?
