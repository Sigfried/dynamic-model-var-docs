# Tour and help authoring format

The spec for the content file this package parses. It lives here, beside
`parseHelpContent.ts`, because it describes the **package**, not any one app's
content: every field, anchor kind and beat rule below is implemented by the
parser and the layer in this directory, and none of it knows what a BDCHM
entity is.

The content it specifies lives with the app that authors it — dmvd's is
[`src/explore/help-content.md`](../explore/help-content.md), handed to the
parser by `ExploreApp.tsx`. A second app writes its own file against this same
spec.

Keep this current when the format changes; `src/test/helpContent.test.ts` pins
the behaviour it describes.


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

**Wrap each section in `<details>` so the content file folds when read on
GitHub**, which is what keeps a long content file navigable. Two things about
that wrapper are deliberate:

- **The `<summary>` repeats the `## Heading` below it.** That looks redundant
  and is load-bearing: the parser identifies a section by `^## ` and matches
  `PROSE_SECTIONS` on that text, so deleting the heading in favour of the
  summary makes the section invisible to the parser.
- **Content sections are `<details open>`; a prose section is not.**
  Collapsing the tour while you are editing it would hide the work; long
  reference material is what benefits from folding.

**A prose section is a `## ` section the parser skips by name**, for notes that
belong beside the content rather than in it — dmvd's content file carries a
`## TODO` scratchpad. Its `###` sub-headings would otherwise parse as entries
pointing at nothing. Add one by name to `PROSE_SECTIONS` in
`parseHelpContent.ts`.

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
| `Highlight:` | how hard to point at the anchor: `ring`, `dim`, `none` — see [Highlight](#highlight) |
| `Width:` | popover width in pixels, default 320 — see [Placement](#placement) |
| `Position:` | force the popover to a side: `left`, `right`, `top`, `bottom` — see [Placement](#placement) |
| `OffsetX:` | nudge it horizontally — see [Placement](#placement) |
| `Tour:` | which tour this is a step of, e.g. `Walkthrough`; omit for help-only |
| `Beats:` | ordered sub-steps, each REPLACING the last — see [Beats](#beats) |

Written as `- **Field:** value`. The `**` is optional and field names are
case-insensitive, so `- width: 500` works as well as `- **Width:** 500` — a
field copied from a beat is not silently dropped. Only `Title` and
`Description` are required.
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
- **Anchor:** intro
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

### Highlight

By default an anchored step draws a blue ring around its anchor **and** dims
everything else. `Highlight:` changes that:

```
- **Highlight:** ring
```

| value | effect |
|---|---|
| (omitted) | ring + dimming — the default |
| `dim` | the same, written out |
| `ring` | the ring alone, nothing dimmed |
| `none` | draw nothing |

Use `ring` when the anchor is one control among several the reader is meant to
compare — dimming the rest hides the context the step is talking about.

**`none` still resolves the anchor**, so the anchor keeps positioning the
popover. That is the point of it: a step can aim the popover at something
without visually seizing it. (`Anchor: none` is the different thing — no anchor
at all, so the popover is centred.)

Unrecognised values are ignored, so a typo costs the override and not the tour.
A beat inherits its step's `Highlight:` and can override it.

### Placement

The popover normally places itself: **below** the anchor when the anchor is a
box on the diagram and the layout is LR, **beside** it (on whichever side has
more room) otherwise. That rule is about the diagram's growth axis — in LR the
graph grows rightwards, so a popover on the right is standing where the next
box will be laid out.

Two fields override it, on a step or on a beat:

```
- **Position:** bottom
- **OffsetX:** anchor.width * 1.3
```

`Position:` is one of `left`, `right`, `top`, `bottom`, relative to the anchor.
A value that is none of those is ignored, so a typo costs the override rather
than the tour.

`OffsetX:` shifts the popover horizontally after placing it. It takes either a
pixel count (`260`, `-40`) or a multiple of the anchor's own size
(`anchor.width * 1.3`, `anchor.height`, `-anchor.width`). `parentBox` works as
a synonym for `anchor`.

**Prefer the relative form.** Every entity box is the same width, so
`anchor.width * 1.3` clears one box plus a gutter — which is how you leave room
for a box the step is about to add — and it stays right if the box width
changes. It is a closed grammar, not an expression: `anchor.width + 10` and
`anchor.left` do not parse.

`Width:` sets the popover's width in pixels for one step; the default is 320,
sized for a step's worth of prose. A step carrying real exposition — the intro,
which explains what the app is — reads badly in a narrow column, so:

```
- **Width:** 480
```

Values under 240 are ignored (the prose becomes a column of single words), and
the width is capped to the viewport, so a wide popover still fits on a small
screen.

**Font size is CSS, not a field.** There is no `FontSize:`, because text size
is a property of the whole popover rather than of one step. Everything inside
the popover is sized in `em` off `--help-font-size`, so one value scales the
title, prose, action band, alert, context and tour nav together.

**Set it in the HOST's stylesheet, not in `help.css`.** The package default is
`13px`; an app's preferred reading size is the app's, and this file ships to
every host:

```css
/* in the host's own CSS, loaded after help.css */
.help-popover { --help-font-size: 15px; }
```

dmvd does this in [`src/explore/helpTheme.css`](../explore/helpTheme.css),
imported by `ExploreApp.tsx` *after* the `HelpLayer` import that pulls in
`help.css` — same specificity, so source order decides.

Both `Position:` and `OffsetX:` are clamped to the viewport. An override can
pick a bad side; it cannot push the popover off-screen.

**With no anchor** (`Anchor: none`) the popover is centred on its real height —
so a long step stays centred rather than sitting low. One taller than the
screen scrolls its body and keeps the back/next row in view.

Horizontally it can centre on a **region the host names** rather than the whole
window, via `<HelpProvider centerOn="…">` — so an unanchored step can be kept
clear of a panel it is describing. Vertically it always stays on the viewport's
midline: the popover's height is not known at placement time, which is what
centring on the real height buys, so a region-relative vertical centre could
not be kept on screen.

**That asymmetry is the reason to think twice before naming a region.** A
region-centred popover is off-centre on one axis and centred on the other, and
the mismatch reads worse than the overlap it fixes — dmvd used
`centerOn="graph-canvas"` until 2026-08-29 and dropped it for exactly that
(Siggie: *"the off-window-center placement is bugging me more"*). The prop is
still here and still works; it is dmvd that declines to pass it.

An app that names no region, or names one that is not mounted, gets the
viewport both ways.

A beat inherits its step's `Position:`, `OffsetX:` and `Width:` and can override
each independently, the same way it inherits `Anchor:`.

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

**The step OPENS on its `Description:` alone, and each beat REPLACES what is
showing.** One thought on screen at a time.

So a step with N beats has **N+1 positions**: the opening, then one per beat.
(A step whose `Description:` is empty has no opening position — there would be
nothing to show — and starts on beat 1.)

```markdown
- **Description:** The setup, shown alone first.
- **Beats:**
  1. Replaces the setup.
     - Anchor: selection-tree
  2. Replaces beat 1. Markdown allowed.
     - Anchor: entity-row:MeasurementObservation
     - Action: Ticked it for you.
     - Change: sel=MeasurementObservation
```

**Beat text must not be empty.** Under the old accumulating default an empty
beat was invisible, because the blocks above it filled the popover; now it is
the only block, and the position renders blank. There is a test for it.

**`Keep:` accumulates instead.** A beat that continues the previous thought
rather than starting a new one keeps what is showing and adds below it:

```markdown
  3. Adds below beat 2 instead of replacing it.
     - Keep: true
```

Everything but the newest block is then dimmed, so the reader can see what just
arrived. Use it for a genuine reveal-the-list step; the next beat without a
`Keep:` clears the accumulation again. A bare `- Keep:` counts as true (it is a
marker, not a setting); `Keep: false` is not a keep.

Each beat may carry its own `Anchor:`, `Action:`, `Change:` and `Keep:` as
indented `- Field: value` lines. Note these are **plain, not bold** — that is
what keeps a beat's own fields distinguishable from the entry fields that
follow the block. A beat that omits `Anchor:` or `Action:` inherits the step's.

> **This default has been both ways; here is why it settled here.** Beats first
> REPLACED, which forced an author to repeat the description in beat one or
> watch it vanish. So on 2026-08-28 they were made to ACCUMULATE, with the
> description as beat one — *"by default, the beat text is additive on top of
> that / in order to clear previous text add a 'clear' marker or field"*.
>
> That fixed the repetition and introduced a worse problem: the newest text sat
> at the BOTTOM of a growing block, so the reader had to find where to start.
> Dimming the old text further, a coloured rule on the new block and an
> entrance animation were all tried; none of them fixed it. Siggie, same day:
> *"the blue line isn't quite doing it. let's change the default to
> Clear: true."*
>
> So beats replace again — but the two things that made the ORIGINAL replacing
> model painful are both gone. The description now has its own opening
> position, so it is read before any beat replaces it and never has to be
> repeated; and `Keep:` is there for the steps that genuinely want to build a
> list up. The default is what most beats want, and the other case is one
> field away.

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
