# Canvas transitions

> The design for TASKS item 5b: how the ownership canvas animates from one
> layout to the next. What is settled, what is being decided, and where the
> ideas are. History and dead ends are in [WORKLOG.md](../WORKLOG.md)
> (2026-09-09 entries).

---

## Where things stand

| Piece | State |
|---|---|
| Zoom (discrete steps, fit) | **Done.** Animated, on `ANIM_MS`. |
| Boxes moving to new positions | **Done.** Same DOM elements ease to ELK's new coordinates; they stay mounted across the layout gap. |
| Boxes entering | Works; fades in after `ENTER_DELAY_MS`. |
| Boxes leaving | **Broken — assume so.** Hand-rolled retention (`outgoingRef`, `shownVmRef`, `departing`, `arrived`, `setRetired`, a retirement timer) in [OwnershipGraphView.tsx](../src/explore/OwnershipGraphView.tsx). To be ripped out, not repaired. |
| Edges | Fade out, snap to the new route, fade in after `EDGE_ARRIVE_MS`. No movement. |
| Choreography (what moves when) | Open — see below. |

All durations are in [anim.ts](../src/explore/graph-core/anim.ts).

## Settled constraints

Decided in the 2026-09-09 sessions; do not reopen without Siggie.

- **No duration is a fraction of another, and none is inline.** Every knob in
  `anim.ts`, each turnable alone. The one linked set is the three MOVEMENT
  durations (boxes, wrapper rescale, fit scroll), which must agree or the boxes
  finish sliding inside a still-moving frame.
- **Edges arrive on their own knob** (`EDGE_ARRIVE_MS`), not gated on the box
  animation finishing.
- **A departing box is the real box**, live and interactive, not an inert
  silhouette. If the user clicks the ✕ on a box that is already leaving,
  *"that's their problem."*
- **d3 is out, entirely.** `d3-transition`/`d3-selection` own the DOM they
  animate and fight React for it; `d3-interpolate` was the last module still
  under consideration and is closed too (2026-09-09).
- **`motion/react`** for enter/exit. `<AnimatePresence>` keeps a removed
  child mounted until its exit animation finishes, which is the one thing React
  alone cannot do and the reason every piece of the hand-rolled retention
  exists. Not yet installed.
- **ELK owns placement on every relayout.** Drag is a local override between
  relayouts; pins clear on `layout`. Not an animation question but easy to
  trip over while touching this code.
- **The corner spinner, not a sheet.** A full-canvas "Computing layout…" cover
  defeats an animation it sits on top of. The spinner waits `SPINNER_DELAY_MS`.

## The generation invariant

ELK is async. On the render where a new `spec` arrives, the hook's stored
result is still the OLD spec's, and its node/edge ids must never be joined
against the NEW `vm`: a just-deselected class's edge is gone from `edgeById`
and the edge loop throws. [useGraphLayout.ts](../src/explore/graph-core/useGraphLayout.ts)
encodes this by returning `layout: null` until the result matches the current
spec, and exposing the superseded result separately as `previous` so the view
can keep boxes at their old coordinates.

**For 5b:** keep the invariant, consider simplifying the encoding. The hook
now returns one state object on two channels and the view reassembles it
(`geom = layout ?? previous?.layout`). A single `{ spec, layout }` result,
with `result.spec === spec` checked at the one site that joins ids (the edge
loop), would carry the same guarantee. Content always comes from `vm`;
positions from whatever layout exists; routed edges only from a layout that
matches the current spec.

## Choreography: what moves when

Two ideas, both Siggie's, neither yet tried in a browser.

### A. Staged: exit in place → move → enter

Departing boxes fade out where they stand; then survivors slide; then arrivals
fade in. No second layout. `ENTER_DELAY_MS` already does the last half.

- Pro: one ELK run per click, survivors move once, cheap to build on
  `<AnimatePresence>` (its exit phase *is* the first stage).
- Con: arrivals can still land on a path a survivor is sliding through; the
  enter delay is the only defence.

### B. Intermediate layout: old ∪ new as a waypoint

Run ELK twice: first on the union of exiting and current nodes, animate there,
then on the new spec alone. Survivors and arrivals find places without being
driven through boxes that are still leaving.

- Pro: no collisions at all, by construction.
- Con: an extra ELK run per click (~100–300ms today, less once the worker stays
  warm — TASKS 5c); every survivor moves twice; and ELK's layout of the union is
  its own arrangement, which can resemble neither endpoint — so the user may
  watch two unrelated rearrangements. Siggie: *"maybe it will be confusing to
  users … but _maybe_ it's worth a try."*

**Plan:** build A first, since it falls out of `<AnimatePresence>` almost for
free. Try B if A looks bad. Keep the choice behind one switch so both can be
compared in the browser rather than argued about.

## Edges

Edges are SVG `d` attributes recomputed per layout, so today they snap; the
fades only decide when the snap is revealed.

**Approach:** ELK gives the endpoints and corner points of both the old and the
new route, so animate by interpolating each point from its old position to its
new one — no path guessing. A few lines; no library.

**The hard case:** a route whose corner count changes between layouts, where
the points do not pair up 1:1. Options:

- Resample both routes to a common point count before interpolating (loses
  exact orthogonality mid-flight, which may not matter at these durations).
- Pad the shorter route with degenerate points collapsed onto a real corner,
  so extra corners grow out of an existing one.
- **Siggie's bezier idea** (quarter-baked, their words): draw the edge as a
  bezier *during* the transition — a curve between the moving endpoints that
  needs no corner pairing at all — and hand back to the orthogonal route when
  the move lands. Sidesteps the pairing problem entirely, at the cost of the
  edge briefly not looking like an ELK edge.

Siggie has ideas here beyond these; do not invent a scheme without asking.

## Notes from the outside session

Siggie has motion/react implementation code and edge-transition ideas from a
session outside this repo. **They belong here** — paste below or drop a file
next to this one and fold it in. Until then this section is the placeholder.

<!-- outside-session material goes here -->

After recommending a hand-built approach and then i brought it the
suggestion to use motion/react:
```
import { motion, AnimatePresence } from "motion/react";
const T = { duration: 0.3, ease: [0.65, 0, 0.35, 1] };

<AnimatePresence initial={false}>
  {layout.nodes.map((n) => (
    <motion.div key={n.id} className="box" transition={T}
      initial={{ opacity: 0, x: n.x, y: n.y }}
      animate={{ opacity: 1, x: n.x, y: n.y }}
      exit={{ opacity: 0 }}>
      <EntityBox node={n} />
    </motion.div>
  ))}
</AnimatePresence>

<svg><AnimatePresence initial={false}>
  {layout.edges.map((e) => (
    <motion.path key={e.id} transition={T}
      initial={{ opacity: 0, d: toPath(resample(e.points)) }}
      animate={{ opacity: 1, d: toPath(resample(e.points)) }}
      exit={{ opacity: 0 }} />
  ))}
</AnimatePresence></svg>
```
What it doesn't solve: mismatched path structure. Motion interpolates strings by pairing up the numbers, and when the count differs it snaps (the docs send you to flubber for morphing). ELK changes bend counts, so the resampling step stays; it just moves into the d you hand to animate. Since there's no t=1 swap to ELK's exact route in this setup, change resample to keep the original vertices and pad extra points along the segments up to N, rather than spacing evenly. Then the at-rest path is exact, structure is always N points, and motion does the rest. That refinement improves the hand-rolled version too.

Quirks worth knowing: children of AnimatePresence must be motion components with unique stable keys; exiting children don't receive new props (fine here); initial={false} skips the first-mount fade; mode="wait" is for single-child swaps, so staging exit→update→enter on a list is done with transition.delay. pathLength on motion.path gives you draw-in edges on enter for one extra prop.

Trade-off: roughly a third of the code, two fewer hacks, and per-frame DOM writes instead of React renders, against a dependency of tens of kB and an animation runtime you don't control when something looks wrong. If the diagram is the only thing animating, either is fine. If you'll want panel transitions, hover states, or drag elsewhere in the app, motion pays for itself
