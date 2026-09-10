# Help/Tour package — the remaining plan

**Status:** the help/tour system is **built and shipping**, in-app under
`src/help/`. It has **not** been extracted into a package, and **help mode is
switched off**. This file is what is left to do; the record of how it got here
is in `WORKLOG.md` and `docs/archive/`.

Content lives at `src/explore/help-content.md` (dmvd's, app-specific); the
authoring format is `src/help/FORMAT.md` (the package's, and knows nothing about
BDCHM). Tasks are indexed in [TASKS.md](TASKS.md) and [BACKLOG.md](BACKLOG.md).

---

## 1. Positioning — CSS anchor positioning ✅ SHIPPED 2026-09-08

**Done.** `HelpLayer.tsx` no longer reads any element's screen position. The
popover, the spotlight ring and the hint dots are placed by `anchor-name` /
`position-anchor` / `position-area` / `position-try-fallbacks` in
[`help.css`](../src/help/help.css), and the browser keeps them true through
scrolls, resizes and canvas relayouts.

Siggie, 2026-09-08, on why it was worth doing: *"i generally think that finding
the screen position of one thing and then using that to set the position of
another thing is kludgy and css should make it so we don't have to do that."*

### How the active anchor is named

`position-anchor` names ONE anchor, but a step's anchor is dynamic — whichever
element `resolveAnchor` returns. **The active element is tagged
`data-help-anchor` as the step changes**, and one rule gives that attribute
`anchor-name: --help-anchor`; the popover and the ring both point at it.

That is a write to one element per step, not a per-frame read of positions.

⚠️ **There are deliberately NO per-kind `anchor-name` rules** — no
`[data-help-id]` blanket rule, no `[data-node-id]` rule. This was the plan's
open design question and it resolved better than either sketched option: the
element is looked up once per step and tagged, so one rule covers every kind at
once, and `src/help/` names none of dmvd's kinds.

**`slot-row` works here** because the lookup returns the element and the tag goes
on whatever comes back, so nothing about it has to be expressible as a selector.
§1a then removed the pair at the source, so there is no longer a pair to express.

**Hint dots are the exception**, and take the other shape: many are on screen at
once pointing at different elements, so each gets its own `--help-hint-<n>`,
written into `data-help-hint` and read back by a fixed run of rules (`HINT_MAX`
in `HelpLayer.tsx` is that run's length — the two must agree).

### What went

- the `resize` and capture-phase `scroll` listeners,
- the 250ms `setInterval` that polled while any popover was open,
- `rect` state and the re-render it forced,
- the flip/clamp arithmetic in `popoverPosition` (now `position-try-fallbacks`,
  working against the popover's REAL height),
- `EST_H = 260` and `estHeight` — the guesses at that height,
- the `overlaps()` rect test against the canvas. The question was only ever "is
  this element in the canvas", which `closest()` answers from the tree — and
  answers correctly for a box scrolled out of view, which the overlap test did
  not.
- the smooth-scroll settling race and the `WAIT_MS = 600` hold's reason for
  existing. (The hold itself stays: it waits for a step's `Change:` to produce
  the element, which is a different question from where the element is.)

### What stayed

**`autoWidth`, `navMinWidth`, `CHAR_W`/`LINE_H`.** They size the popover itself
— a deliberate design lever (pick a width so prose is not a tall thin column),
not a measurement of anything on screen — and anchoring does not answer them.

### Re-resolution, and why it is not a poll

The tagging effect uses a `MutationObserver`, not a timer. Two things make
re-resolution necessary:

- the element often does not exist when the step opens (a step applies its
  `State:` and the row it points at is created by the render that state causes);
- **a box leaves the document when the selection changes under a step**, so a
  tag written on it goes with it. A relayout alone does not: boxes are
  `key={n.id}`, so React moves the same element rather than replacing it.

The difference from the poll it replaced is that "has the element been replaced"
is an event the DOM announces, while "where is it now" was only answerable by
asking again and again.

### Browser support — the decision, recorded

MDN: Baseline **"newly available", January 2026** — not "widely available".
Chrome/Edge 125+, Safari 18.2+, Firefox 147+. Roughly 91% of global traffic.

**Decided (Siggie, 2026-09-08): current browsers only.** *"i'm fine only
supporting current browsers."* So there is no `@supports` guard, no retained
measured fallback and no Floating UI path — the measured code was deleted, not
demoted, which is what made this a simplification rather than a second
implementation living beside the first. Do not reintroduce a fallback branch
"just in case": if support turns out to be a real problem that is a new decision
with new evidence.

### Still open, downstream of this

- **Dragging** shipped as §1b — nothing recomputes the popover's position, so a
  dragged `left`/`top` has nothing to stomp it, and the ring follows a dragged box
  on its own.
- Two further platform features land on the rest of the help system:
  **`popover="hint"`** (hint popovers do not close other popovers the way `auto`
  does) and **interest invokers (`interestfor`)**, which is most of the current
  `onMouseEnter`/`onMouseLeave`/`pinned` logic, declaratively.

---

## 1a. Flat anchor tags ✅ SHIPPED 2026-09-08

**Done.** Every anchorable element carries its whole anchor string in one
`data-help-id`, and `resolveAnchor` is one `querySelector` for it:

```jsx
data-help-id={nodeBoxAnchor(n)}          // node-box:ObservationSet
data-help-id={slotRowAnchor(n, r)}       // slot-row:MeasurementObservation.observation_type
```

`helpResolvers.ts`, the `resolvers` prop, `AnchorResolver` and `resolveAnchor`'s
host branch are gone. The tags are built in
[`src/explore/helpAnchors.ts`](../src/explore/helpAnchors.ts), which is where the
kind vocabulary now lives.

⚠️ **This does not breach the §2 seam.** See the seam table: the parser still
splits `kind:arg` and stops, and the host still decides what each kind means —
by choosing what to interpolate. The package matches a string it never
interprets.

### What it bought

- **The `slot-row` pair problem is solved at the source.** `slot-row` used to
  pick a row by the PAIR `(data-row, data-declaring-class)`, which no single
  selector expresses, so a resolver did it in two steps. Flattened into one
  string the pair is just an attribute value, and both marks are deleted.
- **Uniform shape across all kinds.** One schema-driven test checks every anchor
  argument.
- **The package watches its own attribute.** `HelpLayer`'s `MutationObserver` is
  `childList` **plus** `attributeFilter: ['data-help-id']` now — the filter used
  to be impossible because it would have meant naming dmvd's `data-node-id` /
  `data-class-row` in package code.
- Four downstream consumers (icd11-playground, vs-hub, lifeflow) stop having to
  register anything.

### The tags, and where they are written

| site | tag |
|---|---|
| `OwnershipGraphView` node box | `node-box:<Class>` — **strips the `merged::` prefix**, so a merged parent's box is `node-box:ObservationSet` |
| `OwnershipGraphView` child header | `child-header:<Class>` — **new**; the header strip had no addressable attribute before |
| `OwnershipGraphView` slot row | `slot-row:<DeclaringClass>.<slot>` |
| `SelectionTable` class row | `entity-row:<Class>` |
| `SelectionTable` row checkbox | `entity-checkbox:<Class>` |
| `SelectionTable` category row | `category-row:<id>` |

**`entity-checkbox` is TAGGED, not derived.** The plan had it staying derived as
"the input inside that row", which was right while a host function did the
deriving. With flat tags the only place left to do it is the package —
`[data-help-id="entity-row:X"] input` is the package knowing that
`entity-checkbox` MEANS an input nested in an `entity-row`, which is the kind
interpretation the seam forbids. One interpolation at the render site keeps the
package matching a string it never reads.

### Two deliberate behaviour changes

**`node-box:` on a merged CHILD stops resolving, and that is the point.**
Siggie, 2026-09-08: *"it's not a nodeBox, there's no reason to try to look for
it as if it were."* `nodeBox()` used to fall back to finding a row that declares
the class and returning **the containing box** — i.e. the merged PARENT's box,
silently mislabelled. For a subclass that narrows nothing
(`SpecimenQualityObservation`, which has no rows of its own) it returned null
instead. Same anchor, different meanings, failing silently either way. There is
no fallback chain now: the box tags itself, the header tags itself, and an
anchor either matches or it does not. A merged child is addressed
`child-header:`.

**Tree-mode `entity-row` no longer resolves.** The tree path walked up to
`.dbw-row`, an element inside the third-party DagBrowser widget that dmvd does
not render and cannot tag. Siggie, 2026-09-08: DagBrowser *"is totally useless
right now — everything appears a million times"*, and is not to drive design
decisions. So list mode (the default, where every live `entity-row` /
`entity-checkbox` anchor is authored) gets a flat tag and the tree path degrades
to "anchor did not resolve", the documented normal case.

### Three live anchors were migrated with it

`node-box:` on a merged child stopping is not only hypothetical: three anchors in
`help-content.md` were exactly that case, each silently ringing the parent's box
or nothing. They are `child-header:` now.

- `relationship-kinds`, two beats — `node-box:MeasurementObservation`
- `lab-biospecimen`, one beat — `node-box:SpecimenQualityObservation`

[`helpAnchors.test.tsx`](../src/test/helpAnchors.test.tsx) is what found them and
what keeps them found: it runs the real `buildViewModel → mergeSiblings` pipeline
for each step's own `Change:` and checks every diagram anchor against the tags
that step would actually emit. Steps with no `Change:` are skipped — they inherit
whatever selection is on screen, so there is no canvas to check them against, and
that gap needs the browser.

The one live `slot-row` anchor —
`slot-row:MeasurementObservation.observation_type`, a merged child's narrowed row
and the case §1a was written around — **resolves unchanged**.

### Not doing: drop `sibs=0`

BACKLOG § "Anchor kinds" pairs the `child-header:` vocabulary with removing the
`sibs=0` toggle, on the grounds that while it exists a merged child is a box in
one mode and a header in the other. **`child-header:` does not need that** — the
two kinds name different things in either mode, so the vocabulary is unambiguous
without it. Removing `sibs=0` touches a URL param, a localStorage key, the tour
state stack, the toolbar, and the unmerged render path; it stays filed as its
own work. (The toolbar button and the unmerged path went 2026-09-10 with the
Rule 3 ownership work; the plumbing is still TASKS 8d.)

---

## 1b. Dragging ✅ SHIPPED 2026-09-08

**Done.** Scoped down from BACKLOG § "Overlays" (Siggie: *"don't do any heavy
lifting for the overlays"*). One hook,
[`useDragged.ts`](../src/help/useDragged.ts), serves both surfaces. **No state
persistence** — a dragged position lasts as long as the thing is open.

| surface | done? | how |
|---|---|---|
| legend, example cases | **yes, together** | both render into ONE frame, [`HelpPanel.tsx`](../src/explore/HelpPanel.tsx). The handle is its header, so both panels got it from one change, and CSS `resize: both` is the free native resizer. The `offset` prop that staggers the second panel still applies until one is dragged. |
| step popover | **yes** | the handle is `.help-popover-title`. §1 removed everything that recomputed its position, so a dragged `left`/`top` survives — and it RESETS on every step change, because the next step points somewhere else and a stranded popover has no visible cause. |
| `TourMap` | **no** | a centred modal over a dimmed backdrop that closes as soon as you pick a step. Its own CSS calls it *"a chooser, not an inspector you keep open beside your work"*. |
| detail drawer | **no** | in-flow `w-96 shrink-0` flex column. Dragging it means making it an overlay first, which IS the layout change BACKLOG § "Overlays" is about. |

⚠️ **This does not fix the symptom that opened the overlay item** — the legend
still covers the drawer, because the drawer is still in flow. What it buys is
that you can drag the legend off it.

### The two things that are easy to get wrong

**`position-area` has to go when inline coordinates arrive.** Left set, the
browser keeps aligning the popover within its anchor cell, so an inline `left` is
measured from that cell and not from the viewport — the popover lands somewhere
other than where it was dropped. The dragged style therefore also clears
`margin` (the 12px anchor gap) and `transform` (the unanchored branch's centring
translate): all three are offsets from a placement the box no longer has.

**A 3px slop, and no drag from a control.** `pointerdown` fires before `click`, so
a handle that captures the pointer on every press eats the clicks of the × and
the tour nav inside it — the same bug the diagram's node drag hit in 2026-08.

### What is NOT verified

Whether the dragged popover lands exactly where it was dropped **needs a
browser.** jsdom does no layout, so [`useDragged.test.tsx`](../src/test/useDragged.test.tsx)
pins the arithmetic (deltas from the element's real box, the clamps, the click
contract) and nothing about placement. `resize: both` on the panel is likewise
unverified here.

---

## 2. Extract `src/help/` → `packages/tour-help/`

Siggie picked that name over `siggies-tour-and-help-pkg` and over leaving it in
place. **§1, §1a and §1b are all done**, which was the prerequisite: §1a deleted a
prop and a whole file from the package's surface, so extracting before it would
have moved code that was about to go.

The package/app split is **already done on the content side** (2026-08-29):
`src/help/` is package material only; dmvd's content, anchor tags and styling
overrides live in `src/explore/`. Nothing under `src/help/` names a dmvd
concept. So the extraction is a move, not a disentangling.

### Seams that must survive the move

These are the things a "simplification" would break. Each exists because the
package must not learn what a BDCHM entity row is.

| seam | contract |
|---|---|
| anchor **kinds** | Kinds are **host-defined, not parser-known**. The parser splits `kind:argument` and stops; it never learns what a BDCHM entity row is. dmvd's kinds live in [`helpAnchors.ts`](../src/explore/helpAnchors.ts): `entity-row`, `entity-checkbox`, `category-row`, `node-box`, `child-header`, `slot-row`, plus the package's own `help-id`. **Do not fold resolution back into the parser** — i.e. do not give the parser a table of kinds or any code that interprets one. ⚠️ Writing the whole `kind:arg` string into a `data-help-id` at the host's render sites does NOT breach this, and is what §1a did: the package matches a string it never interprets, and the host still decides what every kind means. The seam is about *who knows what a kind means*, not about *how the element is found*. The concrete test: `entity-checkbox` is TAGGED at the render site rather than found as "the input inside the `entity-row`", because the latter would put the meaning of a kind in package code. |
| `centerOn` prop | Where an unanchored popover centres is host configuration. dmvd currently passes nothing (viewport-centred) — a host **declining** a capability is not the capability going away. |
| `--help-font-size` | The package sizes everything in `em` off one custom property; hosts override that one value. dmvd's override is [`src/explore/helpTheme.css`](../src/explore/helpTheme.css), imported *after* `HelpLayer` so source order decides. |
| `onApplyState` / `onReadState` | Two host callbacks, not one. dmvd implements both against the URL, so the tour never learns what a selection is. |
| `SPEC_SECTION = 'Format'` | Stays in the parser even though no file here uses it — an app may keep its spec inline. |

### Consumers

dmvd, icd11-playground, vs-hub, lifeflow. API is context by default
(`<HelpProvider content={md}>` + `useHelp()`), with primitives exported as an
escape hatch so icd11 can keep its Zustand `helpSlice`.

Loose ends to settle during extraction: `isInputFocused` is a 4-line util to
inline; persistence (e.g. `tourSeen` in localStorage) is unbuilt and is a
package concern; and [`useDragged`](../src/help/useDragged.ts) is package material
that dmvd's `HelpPanel` also imports, so it needs to be an EXPORT of the package
rather than an internal.

---

## 3. Help mode: bring it back, in this order

`HELP_MODE_ENABLED` in [`src/help/helpContext.ts`](../src/help/helpContext.ts)
is `false`, which hides the toggle and disables the `?` shortcut — the only two
ways in. **Nothing is deleted**; entries, anchors, hints and the popover all
still work, and the tour drives the same registry.

⚠️ **Do not just flip the flag.** That restores help mode exactly as it was,
and it has the six defects below — several structural, and the first one traps
the viewer with no visible way out.

**Fix them in this order — the first one deletes the worst of the rest:**

1. **CSS anchor positioning** (§1). Kills defect 5 below.
2. **Exit affordance.** The toggle already renders state (`✓ help mode`); make
   it read as the exit (`✕ exit help`) and let its click through the
   interceptor. Drop exit-on-blur (*"actually kind of annoying"* — you switch
   windows to read something and come back to a silently changed mode) and
   collapse the two-stage Escape to one (*"two escapes is a lot"*).
3. **`(i)` instead of `?`.** Siggie's call: call them info buttons, freeing `?`
   for the shortcut alone.
4. **Tag rows and controls, and write their entries.** The largest piece, and
   content work rather than code.
5. **Decide what help mode does about interactions it must block** (defect 2):
   soften the text under help mode, or let some controls through.

### The defects, as measured

1. **No visible way out — the trap.** Exits exist (`Escape`, `?` again, clicking
   an untagged element, window blur) and *none* is discoverable. `close` on the
   popover closes the POPOVER, not the mode, so the viewer believes they have
   left and has not — their next ordinary click is then eaten by the
   capture-phase interceptor. "Click outside a tagged element" barely exists as
   a target: `graph-canvas` and `selection-tree` tag the two big regions, so
   *"the whole screen is tagged."* And clicking the `help mode` toggle did
   nothing, because it sits inside `data-help-id="help-button"` — **the one
   control that looks like the way out was disabled by the mode it exits.**
2. **Help mode forbids the interactions its own text describes.** The
   selection-panel entry says *"Tick a checkbox to put an entity on the
   diagram"* — and in help mode ticking it cannot work, because the
   capture-phase handler cancels the click by design. Nothing catches the
   contradiction.
3. **Click resolution is far too coarse.** `showEntry` uses
   `target.closest('[data-help-id]')`, and **no row, checkbox or disclosure
   arrow is tagged** — the nearest tagged ancestor of all 53 rows is the whole
   `selection-tree` panel. It is not choosing the wrong entry; there is only one
   entry for that entire region.
4. **Coverage is wherever tags happened to land.** 11 `data-help-id` tags exist,
   placed for the TOUR's needs. Hence help for `close` and the relation bar but
   nothing for attribute rows or edge types — and no help for *reading* the
   diagram, which is what a newcomer most needs. Nobody has walked the UI asking
   "what does a first-timer need explained here?"
5. **Hints have no viewport test.** The dot is drawn wherever its element is,
   and the check is only that the element EXISTS — so an entry anchored at a
   `node-box` scrolled off-canvas still gets a dot, which is why dots pile onto
   the first entity drawn.

   The other half of this — **stale positions**, *"it moves when i hover over
   it"* — is FIXED by §1: a dot is anchored to its element in CSS and has no
   position of its own to go stale.
6. **`?` is overloaded three ways** — hint glyph, keyboard shortcut, and the `?`
   on the help/tour buttons. Fixed by item 3 above.

---

## 4. Settled decisions

- **No native-`title` swapping.** That mechanism exists to show which elements
  have help; **hints do that job**, and it was the most intricate code in
  icd11's `useHelpMode` (SVG `<title>` injection, restore-on-exit React race).
- ⚠️ **No native `title` on anything that opens a hover panel** — native
  tooltips render *above* the panel, covering it. Use `aria-label` and put the
  words in the panel. **This one keeps coming back**; it was reintroduced in the
  relation bar minutes after that bar shipped.
- **No new popovers for now** (settled 2026-09-02). Entity-title and row
  popovers belong to a larger pass on getting all the detail into one place,
  which comes *after* the tour is authored. Whenever they do land they want to be **one
  primitive** (positioning, delay, dismissal, z-order above both the SVG and the
  node divs) with different content per trigger, or the two will drift apart.

## 5. Open question

**Backdrop:** plain `::backdrop` dim, or a cutout around the current element?
The cutout is the familiar "spotlight" look but needs an SVG mask or four rects
recomputed on scroll/resize.
