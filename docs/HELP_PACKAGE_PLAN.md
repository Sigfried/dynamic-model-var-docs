# Help/Tour package — the remaining plan

**Status:** the help/tour system is **built and shipping**, in-app under
`src/help/`. It has **not** been extracted into a package, and **help mode is
switched off**. This file is what is left to do; the record of how it got here
is in `WORKLOG.md` and `docs/archive/`.

Content lives at `src/explore/help-content.md` (dmvd's, app-specific); the
authoring format is `src/help/FORMAT.md` (the package's, and knows nothing about
BDCHM). Tasks are indexed in [TASKS.md](TASKS.md) and [BACKLOG.md](BACKLOG.md).

---

## 2. Extract `src/help/` → `packages/tour-help/`

Siggie picked that name over `siggies-tour-and-help-pkg` and over leaving it in
place. Its prerequisites — CSS anchor positioning, flat anchor tags and
dragging — shipped 2026-09-08
([archive](archive/help-package-shipped-2026-09-08.md)).

The package/app split is **already done on the content side** (2026-08-29):
`src/help/` is package material only; dmvd's content, anchor tags and styling
overrides live in `src/explore/`. Nothing under `src/help/` names a dmvd
concept. So the extraction is a move, not a disentangling.

### Seams that must survive the move

These are the things a "simplification" would break. Each exists because the
package must not learn what a BDCHM entity row is.

| seam | contract |
|---|---|
| anchor **kinds** | Kinds are **host-defined, not parser-known**. The parser splits `kind:argument` and stops; it never learns what a BDCHM entity row is. dmvd's kinds live in [`helpAnchors.ts`](../src/explore/helpAnchors.ts): `entity-row`, `entity-checkbox`, `category-row`, `node-box`, `child-header`, `slot-row`, plus the package's own `help-id`. **Do not fold resolution back into the parser** — i.e. do not give the parser a table of kinds or any code that interprets one. ⚠️ Writing the whole `kind:arg` string into a `data-help-id` at the host's render sites does NOT breach this, and is what the flat anchor tags do: the package matches a string it never interprets, and the host still decides what every kind means. The seam is about *who knows what a kind means*, not about *how the element is found*. The concrete test: `entity-checkbox` is TAGGED at the render site rather than found as "the input inside the `entity-row`", because the latter would put the meaning of a kind in package code. |
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

1. **Exit affordance.** The toggle already renders state (`✓ help mode`); make
   it read as the exit (`✕ exit help`) and let its click through the
   interceptor. Drop exit-on-blur (*"actually kind of annoying"* — you switch
   windows to read something and come back to a silently changed mode) and
   collapse the two-stage Escape to one (*"two escapes is a lot"*).
2. **`(i)` instead of `?`.** Siggie's call: call them info buttons, freeing `?`
   for the shortcut alone.
3. **Tag rows and controls, and write their entries.** The largest piece, and
   content work rather than code.
4. **Decide what help mode does about interactions it must block** (defect 2):
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

6. **`?` is overloaded three ways** — hint glyph, keyboard shortcut, and the `?`
   on the help/tour buttons. Fixed by item 2 above.

---

## 4. Settled decisions

- **Current browsers only** (Siggie, 2026-09-08). Placement is CSS anchor
  positioning with no `@supports` guard and no measured fallback. Do not add one
  "just in case": support problems would be a new decision with new evidence.
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

## 5. Open questions

**Two platform features** could take over more of the help system:
`popover="hint"` (hint popovers that do not close other popovers the way
`auto` does) and interest invokers (`interestfor`), which would replace most of
the `onMouseEnter`/`onMouseLeave`/`pinned` logic declaratively.

**Backdrop:** plain `::backdrop` dim, or a cutout around the current element?
The cutout is the familiar "spotlight" look but needs an SVG mask or four rects
recomputed on scroll/resize.
