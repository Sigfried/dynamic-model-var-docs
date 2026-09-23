# Tour content: the traps, and what is deliberately out

The tours live in
[`src/explore/help-content.md`](../src/explore/help-content.md); the authoring
format is [`src/help/FORMAT.md`](../src/help/FORMAT.md). This file holds what
the content file does not: the recipe for a category step, anchoring traps,
and two standing out-of-scope decisions.

---

## The recipe for a category step

Should a seventh category ever want one. The six that exist were built this
way.

`Only: cat=<id>` and an `Action:` saying it drew the category; then a beat per
class, a `#####` subtitle with the class name and `{{model-description:X}}`
beneath it, anchored `node-box:<Class>`. Frame with a sentence of your own
where the schema's description does not stand alone, and close with a beat
saying what the category is FOR rather than what is in it.

`cat=<id>` draws members **plus pins**, so a pinned outside class is on the
canvas and can be anchored — `clinical`, `observation`, `lab` and `other` all
pin `Participant`. Members and pins are in
[`entityCategories.ts`](../src/config/entityCategories.ts).

⚠️ **`Only:` already clears the canvas.** It REPLACES the selection, so
`Only: cat=survey` is a clean category view with nothing carried over. Adding
`panels=0` closes the legend, cases and detail drawer as well; the two compose
(`Only: cat=survey&panels=0`). A step whose `Only:` names no selection at all
inherits the previous step's canvas, which is a silent way to anchor at
nothing.

⚠️ **A beat's `Change:`/`Only:` moves the canvas too.** Anchors are checked
per position, so a beat that adds a class can anchor at it, and a beat that
does not inherits what the beat before it left.

⚠️ **Order the beats by the DRAWN layout, left to right, not by `classIds`.**
The canvas is layered by ownership, so config order jumps around the screen.
Get the order by probing the containment graph — **not by reading the YAML**,
which misses the top-level `slots` (`associated_participant`,
`associated_visit`, `associated_person`) that carry most of the structure.

⚠️ **A class whose description is identical to its parent's cannot get a beat
of its own.** Five of the observation classes and three of the observation-set
classes share their parent's text verbatim, so `{{model-description:X}}` per
subclass would print the same paragraph repeatedly. Those steps name the
subclasses in one framing beat instead.

⚠️ **A merged subclass has no `node-box`.** `node-box:<Subclass>` resolves to
the box its rows were merged INTO, so anchor `child-header:<Subclass>` to ring
the subclass itself.

⚠️ **Do not copy a count out of a source comment or an older doc.** Several
were stale in both directions. Probe, or say it without a number.

⚠️ **Only panel anchors resolve in jsdom.** `entity-row:`, `entity-checkbox:`
and `category-row:` point into the selection panel, which renders in tests;
every `node-box:` and `slot-row:` needs the ELK layout, which does not run
there. A test that walks a tour looking for a ringed popover can only stop on
a panel-anchored position — [`tourStack.integration.test.tsx`](../src/test/tourStack.integration.test.tsx)
carries the worked case.

⚠️ **An anchor kind with no argument cannot be written bare.** `legend-panel`
parses as `help-id:legend-panel` and fails the content test; anchor a
`legend-section:<id>` instead.

⚠️ **Anchor on something short.** A popover beside an element taller than the
screen (the whole Example cases pane) is placed against the part the tour
scrolled to, which can be off screen. Pick a heading or a section.

⚠️ **Probe placement before changing it.** `make e2e-probe` runs against the
probe browser Siggie starts with `make probe-browser`; a throwaway spec using
`e2e/helpers/tour.ts` (`openStep`, `goToAddress`, `placement`) prints the
popover and anchor rects in seconds. A popover at the canvas's top-left means
the anchor resolved to nothing (`placement().anchor` is `null`).

---

## Not in scope, deliberately

**Enums and entity details.** There is material in previous views (enum
contents, per-entity detail) that researchers would want and that the Explorer
does not yet carry. Siggie: get a good, working tour first. Design so an
"entity details" step drops in later without restructuring — do not claim
completeness in the diagram tours.

**Per-user attribute display preference.** `ROW_BUDGET` is `Infinity` as of
2026-09-04, so every box shows every attribute and the `+ N more` / `− fewer`
footer never renders. The budget machinery is intact for the intended end state:
a preference like "Default to show top [6] attributes" that puts the footer
back. See [`OwnershipGraphView.tsx`](../src/explore/OwnershipGraphView.tsx) and [`rowBudget.test.ts`](../src/test/rowBudget.test.ts).
