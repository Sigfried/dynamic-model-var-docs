# Explorer help

Help + tour content for the dmvd Explorer. The **Format** section below is the
spec; everything from *Getting started* onward is the content itself.

Parsed by `parseHelpContent.ts`; pinned by `src/test/helpContent.test.ts`.
Package-level design lives in [docs/HELP_PACKAGE_PLAN.md](../../docs/HELP_PACKAGE_PLAN.md).

---
<details>
<summary><b>TODO</b></summary>

### Done

- **`take the tour` is a filled white pill now**, not a sixth blue underlined
  link. That was the actual reason it read as chrome: nothing distinguished it
  from `copy link` / `example cases` / the rest, so there was no visual reason
  for a first-time visitor to pick it. Did NOT auto-open the tour — that is the
  other half of your bullet and it is a real decision (it fires on every visit,
  including yours, and on every share link), so say the word if you want it.
- **Alerts: write a markdown `>` blockquote** in any `Description:` or beat and
  it renders as an amber ruled-left band with a `!`. Deliberately not an
  `Alert:` field — an alert is part of the prose, so it has to be placeable
  before it, after it, or as the whole block, and a field can only sit in one
  slot. Amber-and-`!` vs. the action band's blue-and-`✓`: "read this" vs. "the
  tour did this to your app". Your intro text is authored on step 1.
- **`Once:` gives an alert a "Don't show this again" checkbox**, stored as
  `help-once-<key>`; on a later visit the alert is stripped from the entry
  before it renders. Chose the explicit checkbox over the silent show-once
  counter you offered as the alternative: with a counter a reader who wanted
  the note back cannot get it, and one who never looked has already spent their
  single showing. Step 1 carries `- **Once:** intro`.
  - The key is authored, not derived from the entry id, so two entries can
    share one and renaming an entry does not resurrect a dismissed note.
  - **To see the note again** after ticking it: clear `help-once-intro` from
    localStorage (devtools → Application → Local Storage).
- **One fix to your own edits** to keep the build green: `selection-tree` beat 2
  carried `Change: sel=Person` with no `Action:`, which trips the "a position
  that changes something says what it did" test. Added a one-line beat
  `Action:`; the beat text is still your placeholder.

### Still open

- **open the app at the start of the tour** — the other half of bullet one, left
  alone pending your call on whether it should auto-fire.

<details>
<summary><b>Original unfinished draft text</b></summary>

1. current first step sort of highlights the title but doesn't dim the rest. fix
   only if it takes less than a minute. text:
   - **BDCHM Explorer**
   - An interactive map of the [BioData Catalyst Harmonized Model](https://rtiinternational.github.io/NHLBI-BDC-DMC-HM/)
     — the ~55 entities defined by its [LinkML schema](https://linkml.io/)
     and how they relate to each other. You can use it to more quickly and thoroughly
     understand the relationships than with the static [LinkML documentation](https://rtiinternational.github.io/NHLBI-BDC-DMC-HM/).
     It is meant to help researchers who:
     - Have access to data in BDCHM format and want to understand its structure;
     - Have data that they want to harmonize to BDCHM format; or
     - Are designing studies and want to model them using BDCHM or want to use
       BDCHM for ideas or inspiration for their own efforts.
   - Pick some entities on the left and the diagram shows how they fit
     together. Click the title to clear everything and start over.
2. highlight selection panel. text:
   - **Entities**
   - A LinkML schema defines classes representing a data model's entities.
     A class defines a set of slots or attributes (like columns in a database table)
     which can hold
     - other entities,
     - permissible value sets (enumerations),
     - or raw data types (strings, integers, etc.)
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

<details>
<summary><b>Format</b></summary>

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
- **Section boundaries do not constrain tour order, but file order IS tour
  order.** A tour's steps run in the order they appear in this file, counting
  across sections — so consecutive steps may sit in different sections, and
  moving a step means moving its block.

They are still doing two jobs, so do not remove them: they group entries
legibly in this file, and the `---` separators between them are what the
parser splits on. `HelpSection.body` is parsed and available if a future help
mode wants to show section intros — it is unused, not unsupported.

**Each section is wrapped in `<details>` so the file folds when read on
GitHub**, which is what makes a 600-line document navigable. Two things about
that wrapper are deliberate:

- **The `<summary>` repeats the `## Heading` below it.** That looks redundant
  and is load-bearing: the parser identifies a section by `^## ` and matches
  `PROSE_SECTIONS` on that text, so deleting the heading in favour of the
  summary makes the section invisible to the parser.
- **The content sections are `<details open>`; `Format` and `TODO` are not.**
  Collapsing the tour while you are editing it would hide the work; the long
  reference material is what benefits from folding.

A multi-line field stops at `<details>`, `</details>` or `<summary>` as well as
at the next `- **Field:**`, so the closing tag after a section's last entry
does not get swallowed into that entry's `Description:`.

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
| `Once:` | storage key letting this entry's alerts be dismissed for good — see [Alerts](#alerts) |
| `Change:` | what this step ADDS to the app state, as a URL query — see [Change](#change) |
| `Tour:` | which tour this is a step of, e.g. `Walkthrough`; omit for help-only |
| `Beats:` | ordered sub-steps that ADD to the description — see [Beats](#beats) |

Written as `- **Field:** value`. Only `Title` and `Description` are required.
An entry with no `Tour:` is help-only: reachable in help mode, never visited by
a tour.

**`Description:` is a multi-line markdown block; every other field is one
line.** The description runs from the colon to the next `- **Field:**`, so it
can hold paragraphs, bullet lists and links — write the step's prose the way
you want it read, in the order you want it read:

```markdown
- **Description:** An interactive map of the [BDCHM](https://example.org)
  — what it is, in a sentence or two.

  It is meant to help researchers who:

  - have data in this format;
  - want to harmonize to it.
- **Anchor:** app-title
```

Continuation lines are indented to show they belong to the field; the indent is
stripped before the markdown is rendered. **Blank lines do not end the block** —
only the next `- **Field:**` does.

Because the description can carry its own bullets, `Interactions:` and
`Context:` are now optional structure rather than the only way to get a second
paragraph. Use them when you want a step's furniture set apart from its prose;
put the prose in `Description:`.

### Tours and order

`Tour:` does two jobs: it marks an entry as a step, and it names **which tour**
the step belongs to.

```markdown
- **Tour:** Walkthrough    <- a step of the Walkthrough tour
- **Tour:**                <- bare: joins the default tour, also "Walkthrough"
  (field absent)           <- help-only, never visited by a tour
```

**Order comes from the file, not from the field.** A tour's steps run top to
bottom in the order their entries appear here. So:

- **Inserting a step is a paste.** Write the entry where you want it to happen.
  Nothing else in the file changes.
- **Moving a step is moving its block.** Cut, paste, done.
- **There is no number to get wrong** — no duplicates, no gaps, no renumbering
  a tail of steps because one went in the middle.

The counter the viewer sees (`4.2 / 6`) is computed from rank at parse time.

**Several tours can share this file.** Entries with different `Tour:` names are
different walks: `Tour: Walkthrough` and `Tour: Deep dive` interleave freely in
the file and each tour sees only its own steps, in file order. One entry belongs
to at most one tour; a topic two tours both want is written twice, or written
once as a help-only entry that both link to.

> **What this replaced.** `Tour:` was a 1-based number until 2026-08-28.
> Inserting a step between 3 and 4 meant renumbering every step after it, and a
> duplicate or a gap silently reordered the tour rather than failing. Siggie,
> 2026-08-28: *"make it easy to add/move steps without having to renumber
> everything."* Note the two forms are distinguishable on sight — `Tour: 3` is
> not a tour name — so an unmigrated entry is visible rather than silently
> wrong, unlike the `State:`/`Change:` rename.

### Disabling a field

**Prefix any field name with `_` to park it.** The field is still parsed, but
treated as absent:

```markdown
- **_Tour:** Walkthrough  <- entry drops out of the tour, stays as help
- **_Change:** sel=X      <- change not pushed
```

Use it for a step that is written but not ready to appear. The step simply
drops out of the sequence — parking one of six leaves a working 5-step tour,
and since order comes from the file there is nothing to renumber.

### Anchors

`Anchor:` says which element on screen the popover points at and rings. It is
separate from the entry's `### id`, which is only identity: the registry key
that tests, `Beats:` and cross-links use.

There are two ways to name an element, and they differ in *when* the element
has to exist.

**Tagged elements — `data-help-id`.** Dmvd hand-writes
`data-help-id="<name>"` on the dozen or so landmarks worth explaining (the
title, the left panel, the graph canvas, the toolbar toggles). The attribute is
not only for anchoring: in help mode a click anywhere inside a tagged element
opens that element's entry, so the tag is what makes a region clickable-for-help
in the first place. Anchoring reuses it. Grep for `data-help-id=` to see every
one.

**Runtime lookups — `<kind>:<argument>`.** A diagram row or tree row cannot
carry a stable tag: the diagram destroys and rebuilds its boxes on every
relayout, and one class can be drawn in several places. So instead of naming an
element the anchor names a **question** — `entity-row:Participant` means "ask
the host where Participant's row is, right now" — and a resolver function
answers it at the moment the popover is placed.

| Form | Meaning |
|---|---|
| *(omitted)* | `help-id:<the entry id>` — the common case, when the entry explains a tagged element and shares its name |
| `<bare-id>` | `help-id:<bare-id>` — for an entry pointing at a tagged element under some other name |
| `<kind>:<argument>` | run the host's `<kind>` resolver on `<argument>` |
| `none` | point at nothing; the popover is centred and nothing is ringed |

| Kind | Points at |
|---|---|
| `help-id:<id>` | the element tagged `data-help-id="<id>"` |
| `entity-row:<Entity>` | that entity's row in the selection panel |
| `entity-checkbox:<Entity>` | that row's checkbox |
| `slot-row:<Entity>.<slot>` | one attribute row inside a diagram box |
| `node-box:<Entity>` | a whole entity box on the diagram |

Only `help-id` and `none` are built in. **The other kinds are registered by the
host app, not known to the parser**, which splits `kind:argument` and stops:
resolving "entity row" means knowing what a dmvd entity row is, which the help
package must not. They are handed in as `<HelpProvider resolvers={...}>`; dmvd's
live in `src/explore/helpResolvers.ts`.

**Why an attribute rather than a CSS selector or a plain `id`.** A selector
anchor (`.left-panel > div:nth-child(2)`) would resolve fine — `help-id` is a
`querySelector` underneath — but it breaks silently on any restyle, and nothing
in the styled file hints that help depends on it. `data-help-id` greps, survives
refactors, and is visible at the point of use. A plain `id` would anchor, but it
is a page-wide namespace shared with anything else that wants one, and it does
not mark "this region is help-clickable" the way the dedicated attribute does.

An anchor whose element is not on screen — a collapsed tree row, a box the
current selection does not include — degrades to an unringed, centred popover
rather than failing.

Two kinds have an edge worth knowing when you author:


- **`entity-row` / `entity-checkbox`** work in both left-panel modes (table and
  tree). In tree mode everything starts collapsed, so a deeply nested entity's
  row may not exist in the DOM when the step fires; give such a step a
  `Change:` that selects the entity, or anchor it at the diagram instead.
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

**Rule of thumb:** if the step carries a `Change:` that actually changes
something, it needs an `Action:`. A test enforces this.

### Alerts

**A markdown blockquote is an alert.** Write `>` in any `Description:` or beat
and it renders as an amber, ruled-left band with a `!` — for the thing a reader
has to notice rather than read past:

```markdown
- **Description:** Ordinary prose.

  > This tour will introduce you to all of the Explorer's major features.
  > Click the ✕ or hit **Esc** any time to leave.
```

An alert is part of a step's prose, not a property of the step, which is why it
is markdown rather than an `Alert:` field. A field can sit in only one place;
`>` goes wherever the sentence belongs — before the text, after it, or as the
whole block — and works in every beat without each one declaring a field.

**Prefix every line with `>`.** Markdown's lazy continuation would let you drop
it on later lines, but a dismissed alert is removed line by line, so an
unprefixed line stays behind after the rest of the note has gone.

Don't confuse it with the `Action:` band, which is also tinted and ruled. Blue
and `✓` is the tour reporting what it just did to your app; amber and `!` is
the tour telling you something. Two different sentences, two different bands.

#### `Once:` — an alert you can put away

An alert is permanent by default, which is right for a caution that is true
every time you read the step. For the other kind — the orientation note a
first-time visitor needs and a returning one should not have to dismiss again —
give the entry a `Once:`:

```markdown
- **Once:** intro
```

Every alert in that entry then carries a **Don't show this again** checkbox,
and ticking it stores `help-once-intro` in `localStorage`; on the next visit
those alerts are stripped from the entry before it renders.

An explicit checkbox rather than a silent show-once counter, deliberately: with
a counter a reader who wanted the note back cannot get it, and a reader who
never looked has already spent their one showing.

**The key is authored, not derived from the entry id.** Two entries can share a
key so that one tick silences the same note in both, and renaming an entry does
not resurrect a note the viewer already put away.

### Change

`Change:` is a **delta**, in the same vocabulary as a share link: it says what
the step ADDS to the app state, and a param it does not name is a param it does
not touch.

```markdown
- **Change:** sel=BodySite~Participant
```

**Entering a position pushes its change; `back` pops it.** That is what makes
`back` exact without every step having to describe the whole world, and it is
why leaving the tour needs no restore — the tour unwinds only what it added, so
anything the viewer did during it is simply still there.

**A value already present is pushed anyway.** The second copy is a reference
count: if the viewer had `Participant` ticked and a step also wants it, popping
removes the tour's copy and leaves theirs. You never author this; it is what the
mechanism does with a change you wrote.

| Written | Means |
|---|---|
| `- **Change:** sel=Participant` | add Participant to whatever is drawn |
| `- **Change:** dir=DOWN` | set the direction; leave the selection alone |
| `- **Change:**` (no value) | change nothing, but occupy a slot on the stack |
| *(field absent)* | push nothing at all — see the beats note below |

The empty form is what an exposition step wants. It is not the same as omitting
the field: an empty `Change:` pushes an empty frame, so stepping back into it
pops the step after it; omitting the field pushes nothing, so back through the
position is a plain move.

**Scalars overwrite and are not restored.** A step that sets `dir=DOWN` over a
viewer's `dir=RIGHT` keeps `DOWN` after the pop. Deliberate, and decided rather
than overlooked — Siggie, 2026-08-27: *"if scalar settings clobber user actions,
don't worry about it. easy enough for the user to reclick the button."* Only
`sel` is refcounted, because only `sel` has room to hold two copies.

**There is no "remove" verb.** A step can add a class to the diagram; it cannot
take one away. If a step needs a clean diagram rather than a cumulative one,
that is a format addition, not something to fake with the fields that exist.

**Beats: only the first pushes the step's change.** Under the old model every
beat re-applied its step's full state, which was harmless because re-applying
the same absolute state twice does nothing. Pushing the same delta once per beat
is not: a four-beat step would stack four frames and `back` would crawl out of
them one useless pop at a time. So a step's `Change:` belongs to its first beat,
and a later beat pushes only a change it declares itself.

> **What this replaced.** `State:` was a **full, absolute** query, applied with
> `url.search = query`. So the tour had to snapshot the viewer's state on entry
> and restore it on exit; a mid-tour edit was clobbered, which is what the
> yellow *"your changes will be discarded"* warning was for; and **any field a
> step did not name snapped back to its default** — Siggie had a non-default
> setting and every step with a `State:` silently reset it, because no step
> wrote that param. All three are gone. Note the two forms look identical in the
> file: `State: sel=X` and `Change: sel=X` are the same text meaning opposite
> things, so an old value cannot be migrated by leaving it alone.

### Beats

A tour step is one popover that can advance through several **beats** without
moving on to the next step. Use beats for sub-steps of one idea, and for
revealing a list one item at a time.

**The step's own `Description:` is the first beat, and beats ADD to what is
showing rather than replacing it.** The step OPENS on its description alone;
each `next` then appends a beat below what is already there, with everything
but the newest block dimmed, so the reader sees what just arrived without
losing the setup.

So a step with N beats has **N+1 positions**: the opening, then one per beat.
(A step whose `Description:` is empty has no opening position — there would be
nothing to show — and starts on beat 1.)

```markdown
- **Description:** The setup. This is beat one — it stays on screen.
- **Beats:**
  1. Appears below the setup, at full strength; the setup dims.
     - Anchor: selection-tree
  2. Appears below both. Markdown allowed.
     - Anchor: entity-row:MeasurementObservation
     - Action: Ticked it for you.
     - Change: sel=MeasurementObservation
```

So **do not repeat the description in beat one** — it is already showing. A
step whose beats reveal a list needs only the list items as beats.

**`Clear:` starts over.** A beat that is a fresh thought rather than a
continuation drops everything before it:

```markdown
  3. A new idea, alone in the popover.
     - Clear: true
```

Accumulation resumes from there: a beat after the cleared one adds below it. A
bare `- Clear:` counts as true (it is a marker, not a setting); `Clear: false`
is not a clear.

Each beat may carry its own `Anchor:`, `Action:`, `Change:` and `Clear:` as
indented `- Field: value` lines. Note these are **plain, not bold** — that is
what keeps a beat's own fields distinguishable from the entry fields that
follow the block. A beat that omits `Anchor:` or `Action:` inherits the step's.

> **What this replaced.** Beats used to REPLACE the body with each beat's text.
> That forced an author to repeat the description in beat one or watch it
> vanish the moment the step advanced — `relationship-kinds` did exactly that,
> and the note beside it asked whether the repetition "reads as a stutter". It
> was not a stutter to fix; it was a beat that only existed to work around the
> model. Siggie, 2026-08-28: *"the stuff outside the Beats section is actually
> the first beat / by default, the beat text is additive on top of that / in
> order to clear previous text add a 'clear' marker or field."*

A step with no `Beats:` is exactly one position, so steps written before beats
existed still parse and behave identically. `next` advances beat by beat, then
to the next step.

**The counter always counts STEPS** — `2 / 6` for the whole of step 2, however
many beats it has — and beat progress is shown beside it as **reveal dots**,
one per beat, filled as they appear. Two scales, two widgets: a fraction that
mixes them cannot be read, which is what was wrong with the old `2.1 / 6`
(`2.1` is not a position out of 6). A step with no beats shows no dots.

### Who the tour is for

Someone who arrives from a **link** with no one explaining it — the program
manager case. So step 1 assumes nothing, and any step that needs a selection
brings its own via `Change:` rather than asking the visitor to click first.

</details>
---
<details open>
<summary><b>Getting started</b></summary>

## Getting started

What this app is and how to move around it.

### app-title

- **Title:** BDCHM Explorer
- **Tour:** Walkthrough
- **Description:** An interactive map of the **BioData Catalyst Harmonized Model**
  — the ~55 entities defined by its [LinkML schema](https://linkml.io/) and how
  they relate to each other. You can use it to more quickly and thoroughly
  understand the relationships than with the static
  [LinkML documentation](https://rtiinternational.github.io/NHLBI-BDC-DMC-HM/).
  It is meant to help researchers who:

  - Have access to data in BDCHM format and want to understand its structure;
  - Have data that they want to harmonize to BDCHM format; or
  - Are designing studies and want to model them using BDCHM or want to use
    BDCHM for ideas or inspiration for their own efforts.

  Pick some entities on the left and the diagram shows how they fit together.
  Click the title to clear everything and start over.

  > This tour will introduce you to all of BDCHM Explorer's major features.
  > Click the ✕ or hit **Esc** any time to exit.
- **Anchor:** app-title
- **Once:** intro
- **Change:**

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
  2. I clicked the Person checkbox and the Person entity appeared in the
     viewing panel.
     - Anchor: node-box:Person
     - Change: sel=Person
     - Action: Ticked Person for you.

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
- **Description:** Select an entity by clicking its checkbox and it appears in the main panel. Only what you select is drawn — related entities are reached from the box's relation menu. There are five ways an entity can be related to another.
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

- **Title:** The relation menu
- **Description:** Every entity related to this one, grouped by how it is related. The trigger says how many there are and how many are already on the diagram; opening it branches into the five kinds of relationship, and each branch lists the entities in it.
- **Interactions:**
  - Hover **☰ N related · M shown** to open the menu, then a branch to list its entities.
  - Click an entity to put it on the diagram — which also ticks its checkbox on the left. Click it again — or its ✕ — to take it off; entities already drawn are greyed out.
  - "add all N" / "hide all N" at the top of a branch — draw or clear the whole branch at once. Both counts are shown before you click. "hide all" removes every entity in the branch, including ones you had selected yourself.
  - **ⓘ** opens an entity's details without adding it to the diagram.
- **Context:** From one entity's point of view there are five ways to be related. Four are ownership, and each names which side declares the attribute that creates it. Running *outward*: things that **belong to me by my attribute** (this entity declares the slot) and things that **belong to me by their attribute** (they declare it, pointing back here). Organization is entirely the second kind — it owns thirteen kinds of thing and declares no slot for any of them. Running *inward*, the same split: entities **I belong to, by my attribute** and entities **I belong to, by their attribute**. Fifth are **associations**, where neither entity owns the other.

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

### example-cases

- **Title:** Example cases
- **Description:** Named selections that show particular routing and inheritance situations. Useful for seeing what the diagram does with the awkward cases.

### help-button

- **Title:** Help and tour
- **Description:** **Take the tour** for a short guided walk, or turn on **help mode** to explore at your own pace — every part of the screen with help attached gets a dot you can click.
- **Shortcut:** ?

</details>
