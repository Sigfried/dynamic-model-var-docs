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
element arrives from the HOST's resolver, so tagging it covers every kind at
once. `src/help/` still names none of dmvd's kinds, which is the §2 seam intact.

**`slot-row` therefore works, and was never a special case.** The kind whose
`(data-row, data-declaring-class)` PAIR no single `anchor-name` rule can
express does not need one: its resolver already returns the element, and the
tag goes on whatever comes back. The flattened-string form drafted under
BACKLOG § "Anchor kinds" is not needed for this.

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
re-resolution necessary, and they are the same two the resolvers' own docs give
for being queried live:

- the element often does not exist when the step opens (a step applies its
  `State:` and the row it points at is created by the render that state causes);
- **the diagram destroys and rebuilds boxes as it relayouts**, so a tag written
  on the old element goes with it.

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

- **Dragging** (BACKLOG § Overlays) is now unblocked: nothing recomputes the
  popover's position, so a dragged `left`/`top` has nothing to stomp it, and the
  ring follows a dragged box on its own.
- Two further platform features land on the rest of the help system:
  **`popover="hint"`** (hint popovers do not close other popovers the way `auto`
  does) and **interest invokers (`interestfor`)**, which is most of the current
  `onMouseEnter`/`onMouseLeave`/`pinned` logic, declaratively.

---

## 2. Extract `src/help/` → `packages/tour-help/`

Siggie picked that name over `siggies-tour-and-help-pkg` and over leaving it in
place. **Do §1 first** — the plan's own prerequisite.

The package/app split is **already done on the content side** (2026-08-29):
`src/help/` is package material only; dmvd's content, resolvers and styling
overrides live in `src/explore/`. Nothing under `src/help/` names a dmvd
concept. So the extraction is a move, not a disentangling.

### Seams that must survive the move

These are the things a "simplification" would break. Each exists because the
package must not learn what a BDCHM entity row is.

| seam | contract |
|---|---|
| `resolvers` prop | Anchor kinds are **host-registered, not parser-known**. The parser splits `kind:argument` and stops. dmvd's kinds: `help-id`, `entity-row`, `entity-checkbox`, `slot-row`, `node-box`. **Do not fold resolution back into the parser.** |
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
package concern.

---

## 3. Help mode: bring it back, in this order

`HELP_MODE_ENABLED` in [`src/help/helpContext.ts`](../src/help/helpContext.ts)
is `false`, which hides the toggle and disables the `?` shortcut — the only two
ways in. **Nothing is deleted**; entries, anchors, resolvers, hints and the
popover all still work, and the tour drives the same registry.

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
