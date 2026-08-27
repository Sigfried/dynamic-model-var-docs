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
   the right end state but needs a CSS property set on each anchor, and the
   anchors here are ordinary elements tagged only with `data-help-id`. See the
   header comment in `HelpLayer.tsx`.

**Known gaps, scoped 2026-08-26** (details in the PLANNING section of TASKS.md):
tour steps perform state changes invisibly; `back` does not undo them; the
spotlight can only ring a whole `data-help-id` element, so it cannot highlight a
single ROW inside the dag-browser tree — which is what step 2 needs. Popover
dragging is wanted as an escape hatch. State snapshots per step are the chosen
mechanism; porting icd11-playground's history-carrying state was considered and
rejected as overkill.

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
  `slot-row`, `node-box`. Only `help-id` is implemented (in `HelpLayer.tsx`);
  the others resolve to null and degrade to an unringed popover until S3b
  builds them.
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
them. That is S3b's to build.
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
