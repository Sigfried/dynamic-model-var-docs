# Help/Tour package — the remaining plan

**Status:** the help/tour system is **built and shipping**, in-app under
`src/help/`. It has **not** been extracted into a package, and **help mode is
switched off**. This file is what is left to do; the record of how it got here
is in `WORKLOG.md` and `docs/archive/`.

Content lives at `src/explore/help-content.md` (dmvd's, app-specific); the
authoring format is `src/help/FORMAT.md` (the package's, and knows nothing about
BDCHM). Tasks are indexed in [TASKS.md](TASKS.md) and [BACKLOG.md](BACKLOG.md).

---

## 1. Migrate positioning to CSS anchor positioning

**The single highest-value item here**, and it is unblocked — S3b's resolvers
landed 2026-08-27.

Placement is measured today (`getBoundingClientRect` in [`HelpLayer.tsx`](../src/help/HelpLayer.tsx)).
Migrating to `anchor-name` / `position-anchor` **deletes**:

- the `resize` and capture-phase `scroll` listeners,
- the **250ms `setInterval` that polls while any popover is open** — it
  re-renders on a timer whether or not anything moved,
- the flip/clamp arithmetic in `placePopover`,
- its `EST_H` *estimate* of the popover's own height (`position-try` uses the
  real one),
- the smooth-scroll settling race.

It also **deletes the stale-hint bug outright** rather than patching it: hint
dots go stale because *React* owns their repositioning and only does it on
re-render. Hand that to the browser and a dot tracks its anchor through scrolls
and relayouts with no measurement and no re-render.

No per-anchor scripting is needed: one blanket rule keyed on `[data-help-id]`
assigns anchor names for every tagged element.

⚠️ The blanket rule does not reach the **resolver-backed** anchor kinds
(`entity-row`, `slot-row`, `node-box`, `entity-checkbox`), whose elements the
diagram creates and destroys as it relayouts. Those need anchor names assigned
where the rows render.

**That is much smaller than it reads** — counted 2026-09-08 against the live
content file:

| kind | uses in `help-content.md` |
|---|---|
| `node-box:` | 44 |
| `entity-row:` | 3 |
| `entity-checkbox:` | 1 |
| `slot-row:` | **0** |

So 44 of 48 resolve to ONE element that already carries `data-node-id={n.id}`
at a single render site in `OwnershipGraphView.tsx`. One `anchor-name` there
covers 92% of the anchors in the app. And `slot-row` — the kind whose
`(data-row, data-declaring-class)` PAIR no single `anchor-name` rule can
express — is used by nothing. It is a real constraint on the DESIGN of that
kind, not a blocker on the migration; solve it if and when a step needs it (the
flattened-string form under BACKLOG § "Anchor kinds" is one way).

### The principle this serves

Siggie, 2026-09-08: *"i generally think that finding the screen position of one
thing and then using that to set the position of another thing is kludgy and
css should make it so we don't have to do that."* That is the whole item, and
it is worth reading `popoverPosition` with it in mind — the UNANCHORED branch is
already clean (`top: 50%` + `translateY(-50%)` + `maxHeight`, whose own comment
says *"the browser knows and this function does not — no measurement, no
re-render, exact at any height"*), while the anchored branch is 100+ lines of
arithmetic that all exists to guess values the browser already has: `EST_H`,
`estHeight`, `CHAR_W`/`LINE_H`, the flip/clamp, the poll. They are not five
problems. They are one.

### Browser support — re-checked 2026-09-08

MDN: **Baseline "newly available", January 2026** — NOT "widely available".
Chrome/Edge 125+, Safari 18.2+ (`@position-try` flipping wants 18.4+), and
Firefox only by default in **147** (2026-01-13), which is what sets the
Baseline date. Roughly 91% of global traffic.

A previous note here said "Baseline 2026" without the newly/widely distinction;
that mattered, because "newly available" means current versions only, and this
app's audience includes institutional browsers that lag. Vite has no
`browserslist` configured here, so the default target does not decide it for us.
`@supports (anchor-name: --x)` with the existing measured path as the fallback
is the honest shape, and Floating UI is already a dependency if the fallback
needs to be better than what is there now.

Two further platform features land on the rest of it: **`popover="hint"`** (hint
popovers do not close other popovers the way `auto` does) and **interest
invokers (`interestfor`)**, which is most of the current
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
5. **Hints are misplaced until hovered.** Two defects: **stale positions**
   (`hintIds` and each dot's `left/top` are computed during render, and the
   250ms re-measure only runs while `activeId` is set — so with no popover open
   dots are placed once and never updated, which is why *"it moves when i hover
   over it"*); and **no viewport test** (`rectOf` only checks the element
   EXISTS, so an entry anchored at a `node-box` scrolled off-canvas still gets a
   dot at those off-screen coordinates — this is why dots pile onto the first
   entity drawn).
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
