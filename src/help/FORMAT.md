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

<!-- Keep this current when the format changes — the prose AND the table of
     contents just below, which lists every heading in the file;
     `src/test/helpContent.test.ts` pins the behaviour it describes. `make
     test-help-content` runs the tests that check `help-content.md` against it.

     Table of contents: one line per ##/###/#### heading, in file order,
     nested as the headings are. When you add, rename, move or remove a
     heading, change its line here too. Links are GitHub heading slugs:
     lowercase, punctuation dropped, spaces to hyphens.

     The parts run from the file outward: what the file looks like, what can
     go inside a field, how entries become tours, what a step does to the
     screen, what it does to the app, and how one step spans several screens.
     Put a new section in the part it belongs to rather than at the end. -->

- [The content file](#the-content-file)
  - [Structure](#structure) — `## ` sections, `### ` entries, `<details>` folding, prose sections
  - [Entry fields](#entry-fields) — the field table and how a field is spelled
  - [Disabling a field](#disabling-a-field) — strike a field through to park it; unknown field names are reported
- [Prose inside a field](#prose-inside-a-field)
  - [`Description:` — the multi-line markdown block](#description--the-multi-line-markdown-block) — the one field that spans lines; what ends it
  - [Pulling text from the model — `{{kind:arg}}`](#pulling-text-from-the-model--kindarg) — placeholders filled by host-registered resolvers
  - [Inline widgets](#inline-widgets) — `![alt](widget:name:arg)` drawn by a host widget
  - [Styling a span or a block — `:s[…]{…}`](#styling-a-span-or-a-block--s) — the `s` directive, its closed attribute list, and the host's colour names
  - [Where a link opens — `{{target:…}}`](#where-a-link-opens--target) — a link opens in a new tab unless it says otherwise
  - [Subtitles inside a description](#subtitles-inside-a-description) — `### text` in a description renders as a subtitle; every level looks the same
  - [Alerts](#alerts) — a `>` blockquote is an amber alert band
    - [`Once:` — an alert you can put away](#once--an-alert-you-can-put-away) — an authored storage key for dismiss-for-good
  - [Font size is CSS, not a field](#font-size-is-css-not-a-field) — `--help-font-size`, set in the host's stylesheet
- [Tours](#tours)
  - [Who the tour is for](#who-the-tour-is-for) — the arrive-by-link reader
  - [Tours and order](#tours-and-order) — `Tour:` names the tour; order comes from the file, not a number; several tours per file
  - [`TourMetadata:` — describing a tour, not a step](#tourmetadata--describing-a-tour-not-a-step) — a section-body block naming and describing a tour; `TourAbbr:`
  - [Linking into a tour](#linking-into-a-tour) — `?tour=<slug>` and `?step=<n>`; one-shot params; slugs are derived
  - [Selecting a tour](#selecting-a-tour) — `startTour(name)` and `tourNames()`
  - [Finding a step you can see on screen](#finding-a-step-you-can-see-on-screen) — the dev-only content-id readout; duplicate ids
- [Pointing at the screen](#pointing-at-the-screen)
  - [Anchors](#anchors) — `Anchor:` grammar: tagged landmarks vs. generated element kinds
  - [Highlight](#highlight) — `ring`, `dim`, `none`: how hard to point at the anchor
    - [Spotlight](#spotlight) — `Spotlight:` rings something other than the anchor without moving the popover
  - [Placement](#placement) — where the popover goes; `Position:`, `OffsetX:`, centring with no anchor, `Width:`
    - [The default width is automatic](#the-default-width-is-automatic) — sized from text area, 320–800, floored by the nav row
- [Changing the app](#changing-the-app)
  - [Change](#change) — `Change:` is a delta in share-link vocabulary; entering pushes, `back` pops
    - [The params you can set](#the-params-you-can-set) — the full param table
    - [`cat=<id>` — a whole category, like the ⊞ button](#catid--a-whole-category-like-the--button)
    - [`panels=0` — clear the screen](#panels0--clear-the-screen) — the one param that is not a delta
  - [`Only:` — a step that names the whole canvas](#only--a-step-that-names-the-whole-canvas) — replaces the selection instead of adding
  - [Actions](#actions) — `Action:` says what the step just did; required with a real `Change:` or `Only:`
- [Steps with several screens](#steps-with-several-screens)
  - [Beats](#beats) — sub-steps of one popover; each beat replaces the last unless `Keep:`
  - [A beat's numbered line is a label, not its text](#a-beats-numbered-line-is-a-label-not-its-text)
  - [`Width:` is sticky across beats](#width-is-sticky-across-beats)

## The content file

### Structure

```
## Section Title          — groups entries; body text before the first ###
### entry-id              — one entry: a help topic and/or a tour step
```

A section runs from its `## ` heading to the next one; the heading is the
boundary. A `---` line is decorative and means nothing to the parser.

**Sections organise the source file; almost nothing about them appears in the
app.** The popover shows one entry at a time, and both the tour and help mode
reach entries through the flat registry, never through sections. The ONE
exception is a `TourMetadata:` block in a section's body, which names and
describes a tour for the chooser — see
[TourMetadata](#tourmetadata--describing-a-tour-not-a-step). So:

- **Prose written as section body text is invisible to the reader**, unless it
  is a `TourMetadata:` block. If you want it in the tour, it belongs in an
  entry's `Description:`.
- **Section boundaries do not constrain tour order, but file order IS tour
  order.** A tour's steps run in the order they appear in this file, counting
  across sections — so consecutive steps may sit in different sections, and
  moving a step means moving its block.

They are doing three jobs now, so do not remove them: they group entries legibly
in this file, their `## ` headings are what the parser splits on, and a section
body is where a tour's metadata is written. `HelpSection.body` is
also kept whole, for a future help mode that wants to show section intros.

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
| `Description:` | the step's prose; a multi-line markdown block — see [`Description:`](#description--the-multi-line-markdown-block) |
| `Interactions:` | bullet list of what you can do |
| `Shortcut:` | key hint, rendered as a `<kbd>` |
| `Context:` | smaller footnote text |
| `Anchor:` | what to point at — see [Anchors](#anchors) |
| `Action:` | one sentence saying what the tour just DID — see [Actions](#actions) |
| `Once:` | storage key letting this entry's alerts be dismissed for good — see [Alerts](#alerts) |
| `Change:` | what this step ADDS to the app state, as a URL query — see [Change](#change) |
| `Only:` | the same query, but it REPLACES the selection instead of adding — see [Change](#change) |
| | *(both take the same params — see [the params you can set](#the-params-you-can-set))* |
| `Highlight:` | how hard to point at the anchor: `ring`, `dim`, `none` — see [Highlight](#highlight) |
| `Spotlight:` | ring a DIFFERENT element than the anchor, or several separated by `,`/`~`, same grammar as `Anchor:` — see [Spotlight](#spotlight) |
| `Width:` | popover width in pixels; defaults to a width picked from the text (320–800); STICKY across beats — see [Placement](#placement) |
| `Position:` | force the popover to a side: any CSS `position-area`, usually `left`, `right`, `top`, `bottom` — see [Placement](#placement) |
| `OffsetX:` | nudge it horizontally — see [Placement](#placement) |
| `Tour:` | which tour this is a step of, e.g. `Walkthrough`; omit for help-only |
| `TourMetadata:` | **section-body field**: marks the section as describing a tour — see [TourMetadata](#tourmetadata--describing-a-tour-not-a-step) |
| `TourAbbr:` | **section-body field**: a short form of the tour's name for the popover's title prefix — see [TourMetadata](#tourmetadata--describing-a-tour-not-a-step) |
| `Beats:` | ordered sub-steps, each REPLACING the last — see [Beats](#beats) |

Written as `- **Field:** value`. The `**` is optional and field names are
case-insensitive, so `- width: 500` works as well as `- **Width:** 500` — a
field copied from a beat is not silently dropped. Only `Title` and
`Description` are required. A name that is none of the above is reported as a
misspelling — see [Disabling a field](#disabling-a-field).
An entry with no `Tour:` is help-only: reachable in help mode, never visited by
a tour.

Every field is one line except `Description:`, which is a multi-line markdown
block — see [`Description:`](#description--the-multi-line-markdown-block) and
the rest of [Prose inside a field](#prose-inside-a-field) for what can go in
it.

### Disabling a field

**Strike a field through to park it.** The field is still parsed, but treated
as absent. Any of these spellings works, with the bold inside or outside the
tildes:

```markdown
- ~~**Tour:**~~ Walkthrough   <- entry drops out of the tour, stays as help
- **~~Change~~:** sel=X       <- change not pushed
- ~~**Width:** 500~~          <- the whole line after the bullet
```

Use it for a step that is written but not ready to appear. The step simply
drops out of the sequence — parking one of six leaves a working 5-step tour,
and since order comes from the file there is nothing to renumber. A parked
`Beats:` takes its beats with it, and a beat's own field can be parked the
same way.

Strikethrough rather than a prefix because it renders as what it means; a
`_Tour:` prefix reads as the start of italics in a markdown editor, and is
reported as a misspelling like any other unknown name (below).

**A field name the format does not know is reported, not ignored**, so a typo
(`- Anchr: none`) cannot look like a parked field. Every `- Name: value` line
at entry level, beat level or in a section body whose name is not a field of
that level lands in `HelpContent.problems`, the parser logs them, and
`helpContent.test.ts` fails on any. A prose bullet inside a `Description:` block is indented, so it is not
a field line and is never checked.

## Prose inside a field

### `Description:` — the multi-line markdown block

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
only the next `- **Field:**` does (or the structural markup listed under
[Structure](#structure)).

Because the description can carry its own bullets, `Interactions:` and
`Context:` are now optional structure rather than the only way to get a second
paragraph. Use them when you want a step's furniture set apart from its prose;
put the prose in `Description:`.

The rest of this part is what can go in that block beyond plain markdown: text
[pulled from the model](#pulling-text-from-the-model--kindarg),
[inline widgets](#inline-widgets), [styled spans and blocks](#styling-a-span-or-a-block--s),
[subtitles](#subtitles-inside-a-description) and [alerts](#alerts). A beat's
`Description:` takes all of the same — see
[Beats](#a-beats-numbered-line-is-a-label-not-its-text).

### Pulling text from the model — `{{kind:arg}}`

Prose fields can quote the underlying data instead of restating it. A
`{{kind:arg}}` placeholder is replaced with whatever the host looks up for that
kind:

```markdown
- **Description:** The model's own words for this entity:

  {{model-description:Participant}}
```

| Kind | Fills with |
|---|---|
| `{{model-description:<Class>}}` | that class's `description` from the schema |
| `{{enum-description:<Enum>}}` | that enumeration's `description` |
| `{{category-label:<id>}}` | a category's display label (`admin` → "Admin / Study") |
| `{{edge:<kind>}}` | the arrow for `own-fwd`, `own-bkwd` or `association`, drawn inline exactly as the canvas and legend draw it — see [Inline widgets](#inline-widgets) |
| `{{relation:<kind>:<Left>:<Right>}}` | a whole relation on one line, as the relation popover writes a row: `` `Left` `` arrow `` `Right` ``, never wrapped, slightly smaller — e.g. `{{relation:own-fwd:Condition.affected_body_site:BodySite}}` |
| `{{loop}}` | the self-loop mark a row carries when an attribute points at its own entity — see [Inline widgets](#inline-widgets); no argument |
| `{{ownership-count:<key>}}` | a live count of classified attributes: `declared`, `forward`, `backward`, or `<rule-id>.<owners\|attrs\|owned\|total>` |
| `{{schema-count:<key>}}` | a live whole-schema total: `classes`, `concreteClasses`, `slots`, `enums`, `types`, `classRangedSlots` |

⚠️ **Never hand-type a number a schema sync can move.** Both count kinds exist
because hand-typed ones had already rotted — see the note under "An unresolved
name stays visible" below, and the `SchemaCounts`/`getOwnershipCounts` doc
comments for the specific numbers that were wrong and for how long.

Like anchor kinds, these are **registered by the host, not known to the
parser** — dmvd's live in `src/explore/helpTextResolvers.tsx` and are handed in
as `<HelpProvider textResolvers={...}>`. Substitution happens once, after
parsing, so everything downstream sees finished prose.

Three things to know:

- **It composes.** The placeholder is replaced in place, so a step can frame
  the model's words with its own — a sentence of setup, then the description,
  then a point about it. This is why the format is a placeholder rather than a
  field that replaces the whole description.
- **An unresolved name stays visible.** `{{model-description:Gone}}` renders as
  those literal characters rather than as nothing, so a class renamed by an
  upstream schema sync names itself on screen instead of silently leaving a
  hole. `helpTextResolvers.test.ts` asserts every placeholder in the content
  file resolves, so drift fails a test first.
- **Substituted text is markdown**, and it counts toward the automatic width
  and height ([Placement](#placement)) like any other prose — a step that pulls
  in a long class description gets a wider popover, and one placed beside a
  low anchor slides up to fit rather than running off the bottom.

### Inline widgets

A markdown image whose URL is `widget:<name>:<arg>` is drawn by the host's
widget of that name instead of loading a picture:

```markdown
A owns B ![A owns B](widget:edge:own-fwd) when the schema puts the list on A.
```

dmvd registers three, each drawing the same component the app itself draws, so
a mark in the prose cannot drift from the mark on the canvas:

 | widget | drawn by | authored as |
 |---|---|---|
 | `edge` | `EdgeSample`, as the legend and relation popover draw it | `{{edge:own-fwd}}` |
 | `relation` | a whole relation on one line | `{{relation:own-fwd:Condition.affected_body_site:BodySite}}` |
 | `loop` | `LoopIcon`, the self-loop mark a row carries | `{{loop}}` |

Authors normally write the `{{…}}` form and let the resolver produce the image
rather than hand-writing a `widget:` URL. The alt text is what a reader sees if
a host has no such widget. Widgets are handed to `<HelpProvider widgets={...}>`;
the package knows the URL shape and nothing about what any widget draws.

**A widget needing no argument** is written `{{loop}}`, with no colon — its
resolver receives `''`. `loop` is the case: on the canvas the mark names the
entity and attribute of the row it sits on, and in prose there is no row, so it
carries a generic title instead.

### Styling a span or a block — `:s[…]{…}`

Markdown directives (`remark-directive`) style a run of prose or a block of it,
with the markdown inside still working:

```markdown
Plain, then :s[small, **bold**, `code`]{size=.7em bg=pink opacity=.4} plain again.

:::s{color=blue}
A whole paragraph, or several, in blue.

Still blue.
:::
```

`:s[content]{attrs}` is inline (a `<span>`); `:::s{attrs}` … `:::` on lines of
their own is a block (a `<div>` around everything between). Attributes are
`name=value`, space-separated; a bare name (`nowrap`) needs no value.

 | attribute | becomes                                                                                             |
 |-----------|-----------------------------------------------------------------------------------------------------|
 | `size`    | `font-size`                                                                                         |
 | `color`   | `color`                                                                                             |
 | `bg`      | `background-color`                                                                                  |
 | `opacity` | `opacity`                                                                                           |
 | `nowrap`  | `white-space: nowrap`                                                                               |
 | `sup`     | a **footnote marker**: raised, smaller and bold. Bold is part of the attribute, because a superscript `*` at .75em is otherwise easy to miss. Write the same `:s[*]{sup}` at the marker and at the head of the note |
 | `center`  | `text-align: center` — **block form only**; on `:s[…]` it is dropped, since an inline span has no line of its own to centre within, and forcing one would stop the span sharing a line with other text |

**`color` and `bg` take a name from the host's palette as well as a CSS
colour.** The host hands `<HelpProvider colors={{name: css}}>` the colours it
draws with, so prose about an edge or a range kind can wear the same colour
the canvas and legend use, and follows the palette when it changes. A name not
in the map is passed through as CSS, so `color=blue` still works. dmvd
registers these in `src/explore/helpTextResolvers.tsx`:

| name | colour of |
|---|---|
| `own-fwd`, `own-bkwd`, `association` | the three edge kinds, as the canvas draws them (`EDGE_COLORS`) |
| `entity`, `enum`, `data-type`, `variable`, `slot` | the range kinds (`RANGE_COLORS`) |
| `sibling-<n>`, `sibling-<n>-fill` | a merged sibling's ink and band, `n` from 0 (`SIBLING_COLORS`) |

```markdown
An :s[owner]{color=own-fwd} declares the slot; the :s[owned]{color=own-bkwd} thing stores the key.
```

**A footnote** is two `:s[*]{sup}` and a sized note; there is no numbering
machinery, so pick a marker (`*`, `†`) and repeat it:

```markdown
conveying an ownership:s[*]{sup} relationship.

:s[*]{sup}:s[Also called containment, composition, 'has-a', or `has-part`/`part-of`.]{size=.7em}
```

That list is the whole of it, on purpose: any other attribute, and any value
with characters outside the plain CSS value set, is dropped, so the content
file does not become a general CSS surface. A directive of another name renders
as plain content, so a typo loses the styling and not the text. Heading levels
do NOT size text — every level renders as the one subtitle style; see
[Subtitles](#subtitles-inside-a-description). The `s` directive gets its meaning
in [`styleDirectives.ts`](styleDirectives.ts); a text resolver could not do this,
since it runs before markdown and could neither wrap formatted text nor know
where a range ends.

### Where a link opens — `{{target:…}}`

**A link opens in a new tab by default.** Following one in the same tab leaves
the app, and the tour's state stack goes with it.

That default is wrong for a link back INTO the app — another tour, a share
link — which wants to navigate in place. Write the target after the link:

```markdown
this [tour](./?tour=the-biodata-catalyst-harmonized-model){{target:replace}}
walks through its contents
```

| Written | Means |
|---|---|
| *(nothing)* | opens in a new tab — the default |
| `{{target:replace}}` | navigates in place, in the same tab |
| `{{target:_blank}}` | a new tab, said explicitly |
| `{{target:<name>}}` | any other value is passed through as the `target` attribute |

- **The marker may be on the next line.** Content is hand-wrapped, so a link
  and its marker routinely end up on separate lines; any whitespace between
  them is consumed.
- **A marker that follows no link is left visible**, like an unresolved
  placeholder — so writing one where it does nothing is something you can see.
- **A title you wrote is kept.** `[x](url "hi"){{target:replace}}` still has
  the `hi` tooltip.

⚠️ **This is not a `{{kind:arg}}` placeholder**, despite the spelling. It
annotates the link before it rather than resolving to text, so it has no
resolver and is consumed before the resolver pass. It also cannot be a remark
plugin: `remark-directive` parses the `:replace` as a text directive, so by
parse time the marker no longer exists. See `linkTarget.ts`.

### Subtitles inside a description

Write `### text` in a `Description:` (a step's or a beat's) and it renders as a
**subtitle** — set apart from the body, and clearly below the popover's own
title.

```markdown
- **Description:**
  ### What you are looking at
  Rows are attributes. The dot says what KIND of thing the attribute points at.
```

Use it to break a long description into named parts. For emphasis inside a
sentence, `**bold**` is still the right tool — a subtitle is a heading, not a
loud run of text.

**Every heading level renders identically.** `###` and `######` look the same,
so pick whichever reads best in the file. The popover is a few short paragraphs,
not a document: a real heading hierarchy inside it would compete with the tour's
own structure, and a level the reader cannot see is a distinction not worth
authoring.

⚠️ **The step title is bigger than any subtitle, and `**bold**` is smaller than
both**, so a bolded phrase opening a description does not read as a second
title.

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

### Font size is CSS, not a field

There is no `FontSize:` field, because text size is a property of the whole
popover rather than of one step. Everything inside the popover is sized in `em`
off `--help-font-size`, so one value scales the title, prose, action band,
alert, context and tour nav together.

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

## Tours

### Who the tour is for

Someone who arrives from a **link** with no one explaining it — the program
manager case. So step 1 assumes nothing, and any step that needs a selection
brings its own via `Change:` rather than asking the visitor to click first.

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

The counter the viewer sees (`4 / 6`) is computed from rank at parse time.

**Several tours can share this file.** Entries with different `Tour:` names are
different walks: `Tour: Walkthrough` and `Tour: Deep dive` interleave freely in
the file and each tour sees only its own steps, in file order. One entry belongs
to at most one tour; a topic two tours both want is written twice, or written
once as a help-only entry that both link to.

### `TourMetadata:` — describing a tour, not a step

A tour needs a name and a sentence saying what it is, for a chooser offering
several. That belongs to the tour as a whole, and a tour has no entry of its
own — its steps are entries — so it is written in the **section body**, between
the `## ` heading and the first `### ` entry:

```markdown
## Ownership
- **TourMetadata:**
- **Description:** What the arrows mean, and why the diagram is laid out this way

### owns-vs-belongs-to
...
```

**Leave `TourMetadata:` empty and the section's `## ` heading is the name.**
Write a value only when the tour's name differs from its heading. The name would
otherwise appear three times per tour — in the `<summary>`, the `## ` heading
and here — all of which have to agree; the first two are already pinned to each
other, so the bare form removes the copy that nothing checked.

`Description:` is a block, like an entry's, so it can run to a paragraph.

**Every step's popover names its tour above the title**, so a reader who
arrived by link knows which walk they are on. `TourAbbr:` in the same block
replaces the full name there when the name is too long to sit over a title:

```markdown
## The BioData Catalyst Harmonized Model
- **TourMetadata:**
- **TourAbbr:** BDCHM
- **Description:** Introduction to the model: what it contains and what it's for
```

On a step's BEATS the tour name and the step title share one line, separated by
a dot and set in the same size, weight and colour — the tour name keeps its
uppercase, which is what still marks it as a label. The step's opening position
keeps the title stacked and prominent instead. A step title repeats itself
unchanged through a run of beats while the prose under it moves, so on the
beats it steps out of the way.

### Linking into a tour

`?tour=<slug>` opens a tour on arrival, for a link that drops someone straight
into it. The slug is the tour's name lowercased with every run of
non-alphanumerics replaced by `-`:

| tour | link |
|---|---|
| Ownership | `?tour=ownership` |
| Using the Explorer | `?tour=using-the-explorer` |
| The BioData Catalyst Harmonized Model | `?tour=the-biodata-catalyst-harmonized-model` |

A valueless `?tour` opens whichever tour comes first in the file.

`?step=<n>` opens the tour at its nth step, counting from 1 the way the
popover's `n / N` counter does. It lands on the step's opening position, before
any beat is revealed, and is ignored without a `tour`.

```
?tour=ownership&step=4
?tour=using-the-explorer&sel=Person~Visit
```

Both params are **one-shot**: they are consumed at load and stripped from the
URL, so a reload does not restart the tour and neither rides along into a link
the viewer copies afterwards.

The slug is DERIVED from the tour name, not authored, so there is no third
spelling to keep in agreement — but **renaming a tour invalidates links to
it**. An unrecognised slug opens the first tour rather than guessing at a near
match. If tour names start churning, the fix is an authored `TourSlug:` field.

It is a label, not a second name: the chooser and the map still show the full
name. A test keeps it under 16 characters.

The name ties the description to the walk: it must match the `Tour:` field on
the steps. **A test enforces both directions** — metadata naming a tour with no
steps, and a tour with steps and no metadata. Without it a renamed tour parses
cleanly and the chooser silently shows no description, which is the same shape
of failure as the unreachable second tour below.

A section with no `TourMetadata:` is an ordinary grouping section.

### Selecting a tour

**The host picks which tour runs**, by passing a name to `startTour(name)`; no
name runs the FIRST tour in the file. `tourNames(content)` lists them in file
order, which is what a host builds a tour chooser from — dmvd's is the `Tours`
submenu in `HelpMenu.tsx`. An unknown name yields an empty tour, so a typo
starts nothing rather than silently running whichever tour is first.

### Finding a step you can see on screen

The counter is a viewer's progress bar, not an address: `4 / 6` moves when you
insert a step above it, so it cannot be used to say *which block produced this
popover*. The **entry id** can — it is unique, required, and unaffected by
reordering.

So every popover can show where it is written, as its `### ` slug plus the
1-based beat ordinal when a beat is showing:

```
relationship-kinds        <- the step's own text (its opening position)
relationship-kinds ▸2     <- the second item under that step's `Beats:`
```

**Clicking the tag copies `### relationship-kinds`** — the markdown header, not
the address as shown. That is the string that pastes into a file search and
matches exactly one line: a bare `relationship-kinds` also hits every prose
mention of it, and one carrying the beat ordinal matches nothing. So: paste,
then count two bullets down.

This is **dev-only, and on by default there**: toggle it with `Show content ids` at
the bottom of the app's Help menu, or per-link with `?ids=1` / `?ids=0`. The
menu item appears only when the host passes `authoringAids`, so a deployed
build has no way to show it and an e2e run does not get it. Both the tag
and the toggle are a temporary authoring aid (docs/TASKS.md item 3c) and are
meant to be deleted once the tours are written.

**The machine-readable twin is `data-step-address`** on the popover
(`relationship-kinds~2`), ungated and present in every build; the placement
tests navigate by it. ⚠️ **It stays when the visible tag goes.**

> ⚠️ **Two entries with the same `### ` id is a silent bug**, and now a wrong
> address as well. Entries are stored in a Map keyed by id, so the second one
> OVERWRITES the first — its popover, its menu item and every `Anchor:` aimed
> at it all resolve to whichever came last. `helpContent.test.ts` fails on a
> duplicate.

## Pointing at the screen

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

**Generated tags — `<kind>:<argument>`.** A diagram row or a panel row is not
worth hand-writing a tag for: there are hundreds, and the diagram destroys and
rebuilds its boxes on every relayout. So the host INTERPOLATES the tag at the
render site — `data-help-id={`node-box:${classId}`}` — and the anchor is matched
against it with the same one `querySelector`. `entity-row:Participant` finds
whatever is wearing exactly that string, right now.

| Form | Meaning |
|---|---|
| *(omitted)* | `help-id:<the entry id>` — the common case, when the entry explains a tagged element and shares its name |
| `<bare-id>` | `help-id:<bare-id>` — for an entry pointing at a tagged element under some other name |
| `<kind>:<argument>` | the element tagged `data-help-id="<kind>:<argument>"` |
| `none` | point at nothing; the popover is centred and nothing is ringed |

| Kind | Points at |
|---|---|
| `help-id:<id>` | the element tagged `data-help-id="<id>"` |
| `entity-row:<Entity>` | that entity's row in the selection panel |
| `entity-checkbox:<Entity>` | that row's checkbox |
| `category-row:<id>` | a category's header bar in the selection panel |
| `slot-row:<DeclaringClass>.<slot>` | one attribute row inside a diagram box |
| `node-box:<Entity>` | a whole entity box on the diagram — **not** a merged child |
| `child-header:<Entity>` | a merged child's header strip inside its parent's box |
| `relation-bar:<Entity>` | the `← N … M →` band at the top of that entity's box |
| `legend-panel` | the whole Legend panel — needs `legend=1` |
| `legend-section:<id>` | one Legend section (`arrow-direction`, `ownership-rules`, `cardinality`, `colors`, `toolbar`) — needs `legend=1` |
| `legend-rule:<rule-id>` | one rule's block in the Ownership legend — needs `legend=1` |

Only `help-id` and `none` are built in. **The other kinds belong to the host app
and are unknown to the parser**, which splits `kind:argument` and stops: knowing
what an entity row IS means knowing what a dmvd entity is, which the help package
must not. The host decides what each kind means by choosing which elements to tag
with it; dmvd's tags are built in `src/explore/helpAnchors.ts`.

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

Some kinds have an edge worth knowing when you author:

- **`entity-row` / `entity-checkbox`** resolve in the panel's **list mode only**,
  which is the default. Tree mode hands its rows to the DagBrowser widget, and
  the full-width row rect there is the widget's own element, which dmvd does not
  render and cannot tag — so a step anchored this way shows an unringed popover in
  tree mode.
- **`node-box:<E>` does NOT resolve for a merged child.** Merged siblings share
  one box, titled by their parent, and a child has no box of its own — only a
  header strip inside the parent's. Address it `child-header:<E>` instead. (There
  is deliberately no fallback to the PARENT's box: under the child's name it
  would look like it worked.)
- **`relation-bar:<E>` needs its entity.** Every box on the canvas has a
  relation bar, so a bare `relation-bar` names all of them; the resolver takes
  the first visible match in document order, which is whichever box the layout
  happened to put first. The content test rejects the argless form rather than
  letting it ring an arbitrary box (Siggie, 2026-09-18). `relation-bar:E` and
  `node-box:E` always name the same box, including for a merged box, where `E`
  is the parent that titles it.
- **`slot-row:<E>.<slot>`** splits on the LAST dot, and `<E>` is the class that
  DECLARES the row — for a child that narrows an inherited slot, the child, not
  the parent. That is what picks between the several rows a merged box can hold
  under one slot name. Verified against the live merged `ObservationSet` box,
  which holds four rows named `observations`:
  `slot-row:ObservationSet.observations` finds the shared one (→ `Observation`)
  and `slot-row:MeasurementObservationSet.observations` the child's override
  (→ `MeasurementObservation`).
- **`category-row:<id>`** takes the category's **id**, not its label:
  `category-row:admin`, not `category-row:admin-study` for "Admin / Study". The
  ids are the short slugs in `config/entityCategories.ts` (`admin`, `clinical`,
  `observation`, `lab`, `survey`, `other`). It also resolves in LIST MODE ONLY
  — the tree renders the ownership DAG, where every row is a class and no
  category exists to ring — so in tree mode such a step shows an unringed
  popover.

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

#### Spotlight

**`Spotlight:` moves the ring without moving the popover.** By default the
ring surrounds the anchor. A step or beat that wants the popover to stay on one
element while the emphasis goes to another names the second one:

```
- **Anchor:** node-box:Condition
- Beats:
  1. Attributes
     - Highlight: ring
     - Spotlight: slot-row:Condition.affected_body_site
```

The popover stays attached to the Condition box; the ring surrounds its
`affected_body_site` row. Same grammar as `Anchor:`, and the same anchor tests
check it. A beat's `Spotlight:` overrides its step's and is inherited by later
beats like `Anchor:`. If the spotlit element is not on screen the ring falls
back to the anchor. `Highlight:` still decides how hard to draw it — a step
with `Highlight: none` draws no ring anywhere, so a beat that adds a
`Spotlight:` under such a step also sets `Highlight: ring` or `dim`.

Use `ring` when the anchor is one control among several the reader is meant to
compare — dimming the rest hides the context the step is talking about.

**Several elements at once**, separated by a comma or `~`:

```
  1. SdohObservations
     - Highlight: ring
     - Spotlight: child-header:SdohObservation, node-box:Participant
```

One rule, enforced by `helpContent.test.ts`, and one choice:

- **Every entry carries its own `kind:`.** A bare name is shorthand for
  `help-id:<name>`, so `node-box:Visit, QuestionnaireItem` silently rings only
  Visit — the second resolves to a `help-id` that nothing wears. Write
  `node-box:Visit, node-box:QuestionnaireItem`.
- **`Highlight: ring` is a look, not a requirement.** Without it each ring
  carries its own `0 0 0 9999px` scrim, so N rings give N layers of dimming and
  each ring's hole is darkened by the others. That was treated as a bug until
  Siggie looked at it (2026-09-17): *"the dimming with two spotlights is a
  little weird, but i actually like it better than the legal behavior"*. The
  uneven vignette reads as depth and both targets stay legible, so pick
  whichever suits the step — `ring` for no dimming at all, the default for the
  stacked look. The test only warns. A single scrim with several holes
  (`clip-path`) is BACKLOG `multi-hole-scrim`.

At most eight resolve (`SPOTLIGHT_MAX` in `HelpLayer.tsx`, matched by a run of
rules in `help.css`); the rest are dropped.

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

`Position:` is a CSS [`position-area`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/position-area),
passed through verbatim — usually `left`, `right`, `top` or `bottom`, which are
values of that property and need no translation here. Anything else the
property takes works too: `center`, `span-all`, `block-end span-inline-start`.

A bare keyword means `span-all` on the cross axis, so `bottom` centres the
popover along the anchor's width. Write both tokens to pin it to one end
(`block-end span-inline-start`).

**A corner or `center` cell is only as big as the space it names**, and a
popover that does not fit it falls back somewhere else:

- `bottom left` is the space below the anchor AND entirely left of it. On an
  anchor near the canvas's left edge there is none, so `flip-inline` mirrors it
  and it renders exactly like `bottom right`.
- `bottom center` confines the popover to the anchor's own width. A popover
  wider than one entity box overflows it and drops to the last fallback.

For a wide popover, use a `span-*` value — `span-right bottom` starts at the
anchor's left edge and grows right, `span-left bottom` ends at its right edge —
and nudge it with `OffsetX:`. Measured on a box anchored at the canvas's left,
`span-right bottom` with `OffsetX: anchor.width * .5` lands halfway between
where `bottom` and `bottom right` put it.

A value CSS rejects is dropped by the browser and the popover falls back to
automatic placement — so a typo costs the override rather than the tour, and
`e2e/placement.spec.ts` checks every authored value with `CSS.supports` so it
fails a test rather than only looking wrong.

`OffsetX:` shifts the popover horizontally after placing it. It takes either a
pixel count (`260`, `-40`) or a multiple of the anchor's own size
(`anchor.width * 1.3`, `anchor.height`, `-anchor.width`). `parentBox` works as
a synonym for `anchor`.

**Prefer the relative form.** Every entity box is the same width, so
`anchor.width * 1.3` clears one box plus a gutter — which is how you leave room
for a box the step is about to add — and it stays right if the box width
changes. It is a closed grammar, not an expression: `anchor.width + 10` and
`anchor.left` do not parse.

Both `Position:` and `OffsetX:` are clamped to the viewport. An override can
pick a bad side; it cannot push the popover off-screen.

A beat inherits its step's `Position:`, `OffsetX:` and `Width:` and can override
each independently, the same way it inherits `Anchor:`.

**With no anchor** (`Anchor: none`) the popover is centred on its real height —
so a long step stays centred rather than sitting low. One taller than the
screen scrolls its body and keeps the back/next row in view.

`Position: bottom` on an unanchored step pins it to the bottom of the viewport
instead, still centred horizontally — for a step about the diagram as a whole,
which a centred popover would cover. Any other `Position:` value is ignored
when there is no anchor.

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

`Width:` sets the popover's width in pixels for one step. A step carrying real
exposition — the intro, which explains what the app is — reads badly in a
narrow column, so:

```
- **Width:** 480
```

Values under 240 are ignored (the prose becomes a column of single words), and
the width is capped to the viewport, so a wide popover still fits on a small
screen. Note that an ignored value is not a fallback to some fixed default —
it means the step never set a width at all, so it gets the automatic one below.

#### The default width is automatic

A step with no `Width:` is sized from how much text it is showing. Short steps
get 320 — the flat default this replaced, so an ordinary one- or two-sentence
beat looks exactly as it always did — and longer ones widen from there, up to
800.

The reasoning is that the popover's real failure mode is HEIGHT: text that
overflows either scrolls inside a clamped box or shoves the popover away from
the thing it is pointing at. Width is the only lever that trades height away.
So the width is picked from the AREA the text needs rather than from its length
in buckets, which keeps the growth smooth — one character more never jumps the
width 150px the way a threshold would.

Two consequences worth knowing:

- **Beats can change the width mid-step.** Because a `Keep:` beat adds to what
  is showing, the text grows and the popover may widen as the beats reveal.
  This is deliberate for now; if it reads as jumpy the fix is to size the whole
  step by its widest position rather than to go back to a fixed default.
- **Author a `Width:` whenever the width is making a point.** The automatic
  width only knows how much text there is, not what the step is doing. A step
  that wants to be a wide slab despite saying very little — or a narrow one
  pointing at a single checkbox despite saying a lot — has to say so. Several
  steps in dmvd's content do exactly this, which is why `Width:` stays.

The same text estimate also decides **placement**: how tall the popover is
likely to be governs whether it fits below a diagram box or has to go beside
it, and how far up it slides when its anchor sits low. Every anchored popover
is capped to the room below its top edge, so one that is genuinely too tall for
any position scrolls inside itself rather than off the screen.

**The automatic width has a second floor: the nav row.** A one-line beat wants
the 320 minimum, but the row under it carries the counter, the reveal dots, the
map ⊞ and three buttons, none of which shrink with the text. So an unauthored
width is the LARGER of what the prose wants and what that row needs — about
390px — however short the beat is.

The floor is a constant, not a per-beat sum: the dots **wrap**, so a step with
twenty of them shows two short rows rather than a wider popover. Authored
`Width:` is not second-guessed, so **a `Width:` well under 400 on a step in a
tour will mangle its own nav row** — that was the bug this floor fixed
(2026-09-08).

## Changing the app

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

**Scalars overwrite, and step back with the step.** A step that sets `dir=DOWN`
over a viewer's `dir=RIGHT` shows `DOWN`, and `back` out of that step puts
`RIGHT` back. A panel a step opened — or swept away with `panels=0` — is
likewise the step's, so stepping off it takes it away. Backing out of the first
recorded step restores the state the tour STARTED in, not a blank screen: a
legend the viewer opened before starting is theirs.

Scalars are still not refcounted the way `sel` is; each frame simply carries
the merged value, and the pop reads the previous frame's.

**Beats: only the first pushes the step's change.** Pushing the same delta once
per beat would stack four frames on a four-beat step, and `back` would crawl
out of them one useless pop at a time. So a step's `Change:` belongs to its
first beat, and a later beat pushes only a change it declares itself.

#### The params you can set

The full vocabulary, shared with share links. Anything not listed is not
settable from a step.

| Param | Values | Sets |
|---|---|---|
| `sel` | ids joined by `~` | what is on the canvas |
| `detail` | an id, or empty to close | the detail drawer |
| `roots` | `1` / `0` | path-to-root |
| `sibs` | `1` / `0` | sibling merge — still parsed, but there is no UI for it since 2026-09-10 and siblings always merge; pending removal (TASKS `drop-sibs`) |
| `dir` | `RIGHT` / `DOWN` | layout direction |
| `merge` | `near` / `far` / `bend` / `off` | edge merge mode |
| `legend` | `1` / `0` | the ownership legend panel |
| `cases` | `1` / `0` | the example-cases panel |
| `panels` | `0` only | **closes every overlay** — see below |
| `cat` | a category id | **a whole category on the canvas** — see below |

An invalid value is dropped rather than applied, so an authoring typo
(`dir=SIDEWAYS`) leaves the setting alone instead of reaching the renderer.

#### `cat=<id>` — a whole category, like the ⊞ button

`cat=admin` puts every entity in a category on the canvas: exactly what
pressing that category's ⊞ control draws, which is its members **plus its
pins** — the borrowed classes that make the view make sense.

```markdown
- **Only:** cat=admin
```

Pair it with `Only:` rather than `Change:` unless you mean to add a category to
what is already drawn: ⊞ replaces the canvas, so `Only:` is the verb that
matches it.

- Takes the category's **id**, not its label: `admin`, `clinical`,
  `observation`, `lab`, `survey`, `other` (see `config/entityCategories.ts`).
- Name several with a comma or a `~`: `cat=lab,survey`.
- An explicit `sel` wins over it, the way `legend=1` wins over `panels=0`.
- Like `panels`, it is an INSTRUCTION: it expands into `sel` on read and is
  stripped from the URL, so a link the viewer copies afterwards names the
  classes. That keeps an old link right even if the category is later
  redefined.
- An unknown id draws nothing rather than failing.

#### `panels=0` — clear the screen

`panels=0` closes the legend, the example cases and the detail drawer together.
It is the one param that is not a delta: every other absent param means "leave
it alone", and `panels` has no form that opens anything.

```markdown
- **Only:** sel=Visit~TimePeriod&panels=0        <- two boxes, nothing else up
- **Change:** panels=0&legend=1                  <- clear, then open the legend
```

**The sweep runs first, so explicit keys override it.** That ordering is the
point: name the sweep, then name the exception. Writing `legend=1&panels=0`
means the same thing as the second line above — the position in the query does
not matter, only that `panels` is a sweep and the named keys are exceptions.

It is safe as a delta because it can only ever CLOSE things. A step that sweeps
and a step that says nothing are both still deltas; neither snaps a setting back
to a default.

### `Only:` — a step that names the whole canvas

`Change:` adds. `Only:` **replaces**: the selection becomes exactly what the
query names, whatever was drawn before.

```markdown
- **Change:** sel=TimePeriod     <- TimePeriod joins what is already there
- **Only:**   sel=Visit~TimePeriod   <- the canvas IS Visit and TimePeriod
```

Use it for a step whose copy describes a specific picture — "this is the
Clinical category", "here are two boxes and one edge". Under an additive
`Change:` those steps piled onto each other, so a step captioned *Clinical*
drew Clinical on top of everything before it, and a two-box example was a
two-box caption over a twelve-box diagram.

Three things bound what it replaces:

- **It replaces the SELECTION only.** `Only: sel=A&dir=DOWN` sets `dir` exactly
  as `Change:` would, and a scalar set by an earlier step stays set. Nothing a
  step does not name snaps back to a default.
- **It hides rather than deletes.** The steps below it are still on the stack;
  `back` restores what the replace displaced, including the viewer's own
  selection, so the two directions are still inverses.
- **It gives up its claim like any other frame.** A class the viewer unticks
  during a replaced step is theirs, and the pop does not hand it back.

A following `Change:` adds to the replaced canvas rather than reviving what was
displaced — which is how a step names a clean picture and its next beat grows
it.

**`Only:` needs an `Action:`** for the same reason `Change:` does, and the same
test enforces it. A step that silently swaps the whole canvas is worse than one
that silently adds to it.

Writing both fields on one entry keeps the `Change:` — decided by which field is
PRESENT, not by which value is non-empty, since an empty `Change:` is
meaningful.

### Actions

When a step changes the app for the viewer, it **must** say so:

```markdown
- **Action:** Ticked MeasurementObservation for you in the panel on the left.
```

Write it as a plain sentence in the tour's own voice. This exists because a step
that silently changes the diagram reads as a description of whatever just
appeared. The popover renders `Action:` text in its own band, visually distinct
from the description.

**Markdown works in a field's value**, `Action:` included — `**bold**`,
`` `code` ``, a link. The `**` around a field NAME is the format's own
punctuation and is removed; anything after the colon is yours and reaches the
renderer untouched.

**Rule of thumb:** if the step carries a `Change:` that actually changes
something, it needs an `Action:`. A test enforces this.

## Steps with several screens

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
indented `- Field: value` lines. They follow the same spelling rules as entry
fields: `**` optional, case-insensitive. What keeps a beat's fields apart from
the entry fields after the block is **indent** — a beat's are indented under
their beat, an entry's sit at the margin, and a field at the margin ends any
open block (a `Description:` included). A beat that omits `Anchor:` or
`Action:` inherits the step's.

**Replacing is the settled default** (Siggie, 2026-08-28), after
accumulating was tried and left the newest text buried at the bottom of a
growing block. The description has its own opening position, so it never has
to be repeated in beat one.

A step with no `Beats:` is exactly one position. `next` advances beat by beat, then
to the next step.

**The counter always counts STEPS** — `2 / 6` for the whole of step 2, however
many beats it has — and beat progress is shown beside it as **reveal dots**,
one per beat, filled as they appear. Two scales, two widgets: a fraction that
mixes them cannot be read, which is what was wrong with the old `2.1 / 6`
(`2.1` is not a position out of 6). A step with no beats shows no dots.

⚠️ **"Beat" is authoring vocabulary and never appears in the UI.** Siggie,
2026-09-08: *"don't use the term 'beats' in the title text"*. It is this file's
field name — the right word here, in the parser and in a comment — but a viewer
has no reason to meet it, so the dots' tooltip and the tour map's badge both
say **screens** instead, and both COUNT the step's opening position: a step
with two beats is three screens. Keep the two vocabularies apart rather than
reconciling them.

### A beat's numbered line is a label, not its text

```markdown
- **Beats:**
  1. tick a checkbox
     - Description: In order to select an entity, click its checkbox.
     - Anchor: entity-row:Person
  2. the box that appears
     - Description:
       The box shows the entity name, a dismiss (x) icon, and its attributes.
     - Anchor: node-box:Person
     - Change: sel=Person
```

The numbered line names the beat **in the file** and is never rendered. Write it
for whoever is editing: terse, repetitive, whatever helps you find the beat.
Everything the viewer reads goes in `Description:`, which may run to several
lines — continuation is by indent, so a beat can hold paragraphs and lists.

**A beat with no `Description:` shows no text**, which is the point: a beat that
only moves the anchor or pushes a `Change:` is a legitimate step in a sequence,
and the label does not leak in to fill the gap.

### `Width:` is sticky across beats

A beat that sets `Width:` governs every LATER beat too, until one changes it
again. Only `Width:` behaves this way; `Anchor:`, `Position:` and `OffsetX:`
inherit from the step whenever a beat does not set them.

```markdown
- **Width:** 800
- **Beats:**
  1. …            <- 800, from the step
     - Width: 300
  2. …            <- still 300, NOT back to 800
  3. …
     - Width: 800 <- back to 800 from here on
```

The difference is what each field describes. A width belongs to the PICTURE a
run of beats is building, so a step that narrows to point at a checkbox and
keeps narrating that checkbox should not snap back on the next beat. An anchor
belongs to ONE popover, so a stale one would strand it pointing at something the
beat is no longer about.

Stickiness governs AUTHORED widths only. A step where nobody writes `Width:`
never enters this rule — every position simply gets the automatic width for
whatever it is showing. But once any beat sets one, it sticks, and later beats
stop being sized from their text until another `Width:` releases it.
