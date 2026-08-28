# Help/Tour Package — implementation plan

**Status:** decided 2026-08-26; **STARTED, not extracted.** The help system is
implemented in-app under `src/help/` (`HelpProvider.tsx`, `helpContext.ts`,
`HelpLayer.tsx`, `parseHelpContent.ts`, `help-content.md`, `help.css`) on branch
`tweaking-expand-prune`. It has NOT been extracted into a standalone package.

**Two deliberate departures from the plan below** — recorded so they are not
re-litigated:
1. **No native-title swapping.**
2. **Measured positioning** (`getBoundingClientRect`) rather than CSS anchor
   positioning; the plan prefers `anchor-name`/`position-anchor`, which remains
   the right end state. See the header comment in `HelpLayer.tsx`.

   **Reasoning revised 2026-08-27** — Siggie questioned this decision and the
   original justification did not survive the check. It said CSS anchoring
   "needs a CSS property set on each anchor, and the anchors here are ordinary
   elements tagged only with `data-help-id`", implying per-anchor assignment
   from script. That is not required: one blanket rule keyed on the attribute
   assigns anchor names for every tagged element with no script at all.

   **What migrating would actually delete:** the `resize` and capture-phase
   `scroll` listeners, the **250ms `setInterval` that polls while any popover
   is open**, the flip/clamp arithmetic in `placePopover`, its `EST_H`
   *estimate* of the popover's own height (`position-try` uses the real one),
   and the smooth-scroll settling race. The polling in particular re-renders on
   a timer whether or not anything moved.

   **The real blocker, and why it is still deferred:** S3a's resolver-backed
   anchor kinds (`entity-row`, `slot-row`, `node-box`, `entity-checkbox`) point
   at elements created and destroyed as the diagram redraws, and those do NOT
   carry `data-help-id` — so the blanket rule does not reach them. Migrating
   before S3b's resolvers exist means designing anchor-name assignment twice.
   **Do it as one focused change after S3b lands**, not during.

**Known gaps, scoped 2026-08-26 — CLOSED by S3b 2026-08-27** (details in the
PLANNING section of TASKS.md): tour steps performed state changes invisibly;
`back` did not undo them; the spotlight could only ring a whole `data-help-id`
element, so it could not highlight a single ROW inside the dag-browser tree.
State snapshots per step were the chosen mechanism; porting
icd11-playground's history-carrying state was considered and rejected as
overkill. **Superseded 2026-08-27:** absolute-per-step state was replaced by a
push/pop STACK — a step declares only what it ADDS (`Change:`), `back` pops, and
exit unwinds. `back` is still exact, but by inversion rather than by re-applying
a whole world; see the `Change` section of `help-content.md` and
`src/explore/tourStateStack.ts`. **Still open:** popover dragging, wanted as an
escape hatch (task 8).

**Authoring format extended 2026-08-27 (S3a). The format spec is the header
comment of [`src/help/help-content.md`](../src/help/help-content.md)** — keep it
there, and keep it current. The format now expresses what the gaps above need,
though the mechanism acting on it is still S3b's work:

- **`Anchor:` separates identity from DOM target.** `### <id>` is identity
  only; `Anchor:` says what to point at. Omitting it means
  `help-id:<the entry id>`, so every entry written before this parses
  unchanged. `Anchor: none` centres the popover and rings nothing.
- **Anchor kinds are host-registered, not parser-known.** The parser splits
  `kind:argument` and stops there — resolving `entity-row:Participant` means
  knowing what a dmvd entity row is, which this package must not.
  **This is an extraction constraint: do not "simplify" it back into the
  parser.** dmvd's kinds: `help-id`, `entity-row`, `entity-checkbox`,
  `slot-row`, `node-box`. **All implemented as of S3b** — `help-id` and `none`
  in `HelpProvider.resolveAnchor`, the other four in
  `src/explore/helpResolvers.ts`, handed in as
  `<HelpProvider resolvers={...}>`. That prop IS the seam; nothing under
  `src/help/` names a dmvd concept.
- **`Beats:` gives a step ordered sub-steps.** One popover advancing through
  several beats — this covers both nested sub-steps and
  reveal-the-next-bullet, which Siggie asked for separately but which are one
  mechanism. A step with no `Beats:` is one implicit beat, so pre-beat steps
  behave identically.
- **`Action:`** is where a step says what it just did to the app. This is the
  format half of the "tour applies the state *and says so*" decision recorded
  below under *Tour steps need per-step state* — settled 2026-08-26 but never
  implemented, which is the bug that made Siggie misread step 2 in review.
- **`tourPositions()` is the seam with the mechanism.** It flattens steps and
  beats into one ordered list, each position carrying resolved
  text/anchor/action/state, so the tour navigator never handles nesting.
  `back` is `positions[i - 1]`.
- **Test contract changed deliberately.** `helpContent.test.ts` used to assert
  every entry *id* was tagged with a `data-help-id` — the very coupling this
  format breaks. It now asserts every `help-id` *anchor* is tagged and that
  anchor kinds are known, and replaces "every step after the first brings its
  own state" with the stronger "a position that changes state carries an
  `Action:`".

Entry/exit state snapshots are runtime, not format — nothing is authored for
them.

## Mechanism shipped 2026-08-27 (S3b)

The three gaps above are closed. What the extraction now has to carry:

- **The provider navigates `tourPositions()`, not entries.** `tourIndex` is an
  index into that flat list, so it counts BEATS; `position.step` supplies the
  displayed `4.2 / 6`. Only `HelpButton` consumed the old `steps` API, which is
  why replacing it was cheap.
- **Two host callbacks, not one.** `onApplyState(query)` was already there;
  `onReadState()` is its inverse and is what makes restore possible. dmvd
  implements both against the URL, because `writeExploreState` keeps
  `location.search` authoritative — so reading it back IS reading live state,
  and the tour never learns what a selection is.
- **Restore runs on EVERY exit path** (done, ✕, Escape, `?`): they are one
  event from the viewer's side. The snapshot is taken before the first
  position applies its state, or it would snapshot the tour.
- **`viewerEdited` is derived, not tracked.** The host calls `noteViewerEdit()`
  from the same effect that writes the URL; the provider ignores anything equal
  to the state it just applied, so the tour's own write is not mistaken for the
  viewer's click. That is what gates the "your changes will be discarded" line
  — it appears only once there is something to discard.
- **The action band is deliberately unlike the body** — tinted, ruled, checked,
  chrome-sized. The bug it fixes is that "I ticked this for you" read as "here
  is what you are looking at", and two kinds of sentence that look alike is
  exactly how that happened.
- **The popover no longer requires a resolved anchor to show.** It used to gate
  on `rect`, which meant an `Anchor: none` step displayed nothing at all. An
  unresolved anchor now centres it.
- **Scrolling the anchor into view is retried, not done once.** A step pushes
  its `Change:`, and the row it points at is created by the render that change
  causes — so at first measure the element usually does not exist yet.

## Help mode: switched off 2026-08-27, tour unaffected

`HELP_MODE_ENABLED` in `src/help/helpContext.ts` is `false`. That hides the
`help mode` toggle and disables the `?` shortcut — the only two ways in.
**Nothing is deleted**: entries, anchors, resolvers, hints and the popover all
still work, and the tour drives the same registry. Flip the flag to get the
mode back exactly as it was.

Why: Siggie reviewed help mode for the first time on 2026-08-27 (the whole help
system was written before the tour work and never reviewed) and it did not
survive contact. The problems are a cluster, several structural, and fixing
them properly is a project competing with shipping the tour. The tour is the
deliverable; help mode is the thing that can wait.

### What is actually broken

**1. No visible way out — the trap.** Exits exist (`Escape`, `?` again,
clicking an untagged element, window blur) and *none* is discoverable. Worse:
- `close` on the popover closes the POPOVER, not the mode, so the viewer
  believes they have left and has not. Their next ordinary click is then eaten
  by the capture-phase interceptor.
- "Click outside a tagged element" barely exists as a target: `graph-canvas`
  and `selection-tree` tag the two big regions, so nearly the whole screen is
  tagged. Siggie: *"the whole screen is tagged."*
- Clicking the `help mode` toggle while in help mode did nothing, because the
  toggle sits inside `data-help-id="help-button"` — the interceptor resolved
  the click to "show the help-button entry" instead of letting it toggle. The
  one control that looks like the way out was disabled by the mode it exits.

**Fix:** the toggle already renders state (`✓ help mode`); make it read as the
exit (`✕ exit help`) and let its click through the interceptor. Then drop
exit-on-blur (Siggie: *"actually kind of annoying"* — you switch windows to
read something and come back to a silently changed mode), and collapse the
two-stage Escape to one (*"two escapes is a lot"*); the popover already has
`close` and click-away.

**2. Help mode forbids the interactions its own text describes.** The
selection-panel entry says *"Tick a checkbox to put an entity on the
diagram"* — and in help mode ticking it cannot work, because the capture-phase
handler cancels the click by design. Content and mode contradict each other and
nothing catches it.

**3. Click resolution is far too coarse.** `showEntry` uses
`target.closest('[data-help-id]')`, and **no row, checkbox or disclosure arrow
is tagged** — the nearest tagged ancestor of all 53 rows is the whole
`selection-tree` panel. So clicking any row, any checkbox, any arrow returns
the same panel-level entry. It is not choosing the wrong entry; there is only
one entry for that entire region. Siggie: *"not even one that seems to match
what i clicked on."*

**4. Coverage is wherever tags happened to land.** 11 `data-help-id` tags
exist, placed for the TOUR's needs. Hence help for `close` and the relation
menu but nothing for attribute rows, the related-count pill, or the edge
types — and no help for *reading* the diagram, which is the thing a newcomer
most needs. Nobody has yet walked the UI asking "what does a first-timer need
explained here?"

**5. Hints are misplaced until hovered.** Two distinct defects:
- **Stale positions.** `hintIds` and each dot's `left/top` are computed
  **during render** in `HelpLayer`, and the 250ms re-measure interval only runs
  while `activeId` is set. With no popover open, dots are placed once and never
  updated, so any relayout strands them. Hovering calls `showEntry`, which
  re-renders, which is why *"it moves when i hover over it"*.
- **No viewport test.** `rectOf` is `getBoundingClientRect()` and tests only
  that the element EXISTS. An entry anchored at a `node-box` scrolled far
  outside the visible canvas still gets a dot, drawn at that off-screen
  element's coordinates. This is why dots pile onto the first entity drawn.

**6. `?` is overloaded three ways.** The hint glyph, the keyboard shortcut, and
the `?` on the help/tour buttons are all `?` meaning different things.
**Siggie's call: use `(i)` and call them info buttons**, freeing `?` for the
shortcut alone. The hint `title` should say "info button", not "dot".

### The CSS anchor API is the right fix for the hint bugs

Siggie, 2026-08-27: *"anchor api should help — the hints are supposed to be
popovers themselves."* Correct, and this note previously undersold it by
treating anchor positioning as only a popover-follows-anchor concern.

Defect 5 is exactly what `anchor-name` / `position-anchor` removes. The dots go
stale because **React** is responsible for repositioning them and only does so
on re-render. Hand that to the browser and the dot tracks its anchor through
scrolls, relayouts and canvas redraws with no measurement, no interval, and no
re-render — deleting the stale-position bug rather than patching it.

Two related platform features land on the rest of it:
- **`popover="hint"`** — hint popovers do not close other popovers the way
  `auto` does, which is the wanted behaviour when a hint opens during help mode.
- **Interest invokers (`interestfor`)** — hover-to-preview, declaratively.
  That is most of the current `onMouseEnter`/`onMouseLeave`/`pinned` logic.

**Caveat, unchanged:** the blanket `[data-help-id] { anchor-name }` rule does
not reach resolver-backed anchors (`entity-row`, `slot-row`, `node-box`,
`entity-checkbox`), whose elements the diagram creates and destroys as it
relayouts. Those need anchor names assigned where the rows are rendered. That
is the same reason the migration was deferred until after S3b, and it is still
the one piece of real design work in it.

### Order to do this in, when help mode comes back

1. Migrate to CSS anchor positioning (kills defect 5, and the popover's
   `setInterval` / flip-clamp arithmetic with it).
2. Exit affordance + drop blur-exit + single Escape (defect 1).
3. `(i)` instead of `?` (defect 6).
4. Tag rows and controls, and write the entries for them (defects 3 and 4) —
   the largest piece, and the one that is content work rather than code.
5. Decide what help mode does about interactions it must block (defect 2):
   either soften the text under help mode or let some controls through.

**Goal:** a gh-pages-hosted product tour for dmvd Explorer (not a video), built on
a reusable help package shared across products.

## What to build

Extract the icd11-playground help system into a standalone npm package, and add
**hints** (visible markers on helpable elements) and a **sequenced tour**.

## Source material (icd11-playground/web)

| File | Lines | Role |
|---|---|---|
| `src/assets/help-content.md` | 510 | Authored content, documented schema |
| `src/utils/parseHelpContent.ts` | 119 | Markdown → typed `HelpContent`. Pure. |
| `src/hooks/useHelpMode.ts` | 161 | Mode behavior, DOM interception |
| `src/components/HelpPopover.tsx` | 98 | Portal popover, hand-rolled positioning |
| `src/store/slices/helpSlice.ts` | 44 | Zustand state (3 fields, 4 actions) |
| `src/components/HelpPopover.css` | — | Styling |

### Design to preserve

- **Content as markdown, parsed to typed data.** Two levels: `##` section
  articles (long-form) and `###` element entries keyed by element id, with
  fields Title / Description / Interactions / Shortcut / Context.
- **Anchoring via `data-help-id` attributes, not CSS selectors.** A marker that
  greps and survives refactors, rather than one that breaks silently on restyle.
- **A help *mode*, not permanent clutter.** Press `?`, cursor changes, tagged
  elements advertise themselves, click one for the popover.
- **Keep the DOM edge cases already handled in `useHelpMode`** — clicks are
  intercepted capture-phase so they don't fall through to the app; SVG elements
  need `<title>` children for native tooltips; non-help `title` attributes get
  suppressed so they don't compete; restore-on-exit checks whether React already
  rewrote a title before restoring it.

  Caveat: the whole native-`title` mechanism exists because there was no visible
  way to see which elements have help. **Hints replace that job.** Decide whether
  to keep title-swapping as a complement or drop it — dropping it removes the
  most intricate code in the file (the SVG `<title>` injection and the
  restore-on-exit React race). Lean toward dropping.

### Existing state

- `helpMode: boolean` — everything keys off it; when false, no listeners mount.
- `activeHelpEntry: { id, rect } | null` — which popover is open + anchor rect
  captured at click time. Drives two-stage Escape (close popover, then exit mode).
- `helpContent` — parsed once at module load, never changes.

Nothing currently persists.

## Package design

### Repo and distribution

New standalone repo, published to npm. Consumed as a normal dependency by dmvd,
icd11-playground, vs-hub, and lifeflow.

### API: context by default, primitives exported

```tsx
// Common path — dmvd.
<HelpProvider content={helpMarkdown}>
  <ExploreApp />
</HelpProvider>

const { toggleHelpMode, startTour, helpMode } = useHelp();
```

```tsx
// Escape hatch — icd11 keeps its existing Zustand helpSlice.
import { useHelpMode, HelpPopover, parseHelpContent } from 'pkg/primitives';
```

Tour state is package-owned (`activeTour: { id, step } | null`).

### Modes over one registry

Hints and tour are **two modes over one registry, not two features**:

- **Help mode** — all anchors marked, click any, self-directed.
- **Tour mode** — one anchor at a time, ordered, prev/next.

Same content, same anchoring, same popover, different navigation state.

### New features

Both assume the Popover API + CSS anchor positioning described below, which is
what makes them small.

- **Hints.** `useHelpMode` already queries every `[data-help-id]` at help-mode
  entry and iterates them; hints render a dot per anchor from that same
  iteration. Click handling already exists. With `anchor-name` on the tagged
  element the browser keeps each dot placed — no rect math, no `ResizeObserver`.
  Look at `popover="hint"` and interest invokers (`interestfor`) first: much of
  this may be declarative.
- **Tour.** The registry is already ordered (`sections[].entries[]`). Needs an
  ordered list of ids, an index, prev/next, scroll-into-view, per-step state
  application, and the popover with nav buttons.

Earlier line-count estimates (~40 / ~60) were made assuming hand-rolled
positioning. Don't treat them as budgets.

### Extraction work

1. `helpSlice.ts` — imports content via `?raw` at module level and is Zustand-
   shaped. Package must take content as a parameter and not assume a store.
2. `HelpPopover.tsx` — **take the content rendering, drop the plumbing.** Of its
   98 lines, the flip/clamp positioning effect and the deferred-`mousedown`
   dismiss effect are both replaced by the platform. What's worth keeping is the
   entry rendering (title / description / interactions / shortcut / context via
   `react-markdown`) and the CSS. Rebuild the shell as a `popover` element with
   `position-anchor`.
3. `isInputFocused` — 4-line util; inline it. Guards the `?` shortcut so typing
   a question mark into a search box doesn't toggle help mode (checks for
   input/textarea/contenteditable focus).
4. `react-markdown` — real dependency. dmvd already has it.
5. Persistence — add localStorage (e.g. `tourSeen`) as a package concern.

## Rollout

**Ship first: sequenced tour for dmvd Explorer.** Hints and help mode follow
soon after — all three are wanted.

dmvd specifics:
- Only the **Explorer** view is in scope, so no step needs to switch views
  before positioning its popover.
- Components to tag live in `src/explore/`: `ExploreApp.tsx`,
  `SelectionTable.tsx`, `OwnershipGraphView.tsx`, `DetailDrawer.tsx`,
  `OwnershipLegend.tsx`, `ExampleCasesPane.tsx`.
- No existing `data-*` convention in dmvd — clean slate for `data-help-id`.
- dmvd already deploys to gh-pages (`gh-pages -d dist`) and already has URL state
  persistence (`?sel=BodySite~Person`, `src/utils/statePersistence.ts`). Tour
  steps can jump the app to a known state, and the tour itself can be a
  permalink (`?tour=...`).

## Tour steps need per-step state — settled

The dmvd Explorer tour is roughly:

1. Intro text about the app and what it does
2. Select an entity or two
3. Examine the resulting graph — information and interaction features
4. Open example cases, click one or two

**Superseded 2026-08-27:** this four-step sketch is no longer the tour. Siggie
is authoring the real thing in `help-content.md`; their draft is longer, uses
nested beats, and highlights individual rows. Treat the sketch as history — the
authored content is the source of truth for what the tour contains.

Steps 3–4 only make sense once step 2 has happened, so **`HelpEntry` needs a
per-step state field** — a URL param string the tour applies on entry.
`statePersistence` already provides the mechanism (`?sel=BodySite~Person`).

**Who does the selecting:** tour applies the state *and says so* — "I've selected
BodySite and Person for you; you'd do this by clicking rows in the table."
Reliable (no desync, every viewer sees the same thing) while still teaching the
interaction. Letting the user drive it teaches better but means waiting on the
right state and handling them selecting something else — bad for an unattended
gh-pages demo.

## Build on the Popover API + CSS anchor positioning

Use the platform for the overlay plumbing instead of hand-rolling it. Both are
Baseline (verified on MDN 2026-08-26):

- [**Popover API**](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API)
  — Baseline 2025.
- [**CSS anchor positioning**](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/anchor-name)
  (`anchor-name` / `position-anchor` / `anchor()`) — Baseline 2026, newly
  available since January 2026.

Both pages carry "some parts of this feature may have varying levels of support" —
for anchor positioning that asterisk generally covers `position-try` fallbacks and
`anchor-size()`, not basic anchoring.

### What this replaces

- **Top layer** — popovers render above everything regardless of `z-index` or
  `overflow: hidden` ancestors. Removes the reason `HelpPopover` portals to
  `document.body`.
- **Light dismiss** — click-outside and Escape handled by the browser. Deletes
  the deferred-`mousedown` dance in `HelpPopover.tsx` (the `setTimeout(0)` that
  keeps the opening click from immediately dismissing).
- **`::backdrop`** — dimming is a CSS pseudo-element, not four computed rects.
- **Anchoring in CSS** — the big one. `anchor-name` on the tagged element +
  `position-anchor` on the popover means **no `getBoundingClientRect()` and no
  `ResizeObserver`**: the browser tracks the anchor as layout shifts. This
  removes the hint-alignment work described above, and may make Floating UI
  unnecessary. Low-risk path: CSS anchoring first, fall back to Floating UI
  (already a dmvd dep) only where support gaps show up.

### Features that map directly onto this design

- **`popover="hint"`** — a dedicated popover state for hint-style UI. Hint
  popovers don't close other popovers the way `auto` does, which is the wanted
  behavior when a hint bubble opens during help mode.
- **Interest invokers (`interestfor`)** — hover/focus-triggered popovers with no
  JavaScript. Potentially most of the hint interaction, declaratively.
- **`beforetoggle` / `toggle` events** — state changes without wiring listeners
  by hand.

## Later polish

- **Floating cursor** for steps where the tour clicks something: animate a fake
  cursor to the click point. Cheap to build, but it asserts the click happened
  *there* — if layout shifts mid-animation the cursor lands on nothing. Highlight
  + note is the honest, robust default; add this only as a flourish.

## Open questions

- Backdrop: plain `::backdrop` dim, or a cutout around the current element?
  Cutout is the familiar "spotlight" look but needs an SVG mask or four rects
  recomputed on scroll/resize.
