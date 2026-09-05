# Tours, the Help menu, and category content views

**Replaces `TOUR_SOURCE_MATERIAL.md`** (deleted; its drafted prose is inlined
below, at the steps that use it) and `NEXT_SESSION_EDGE_DISPLAY.md` §2.3 (that
file is archived). **Delete this one once the tours ship.**

Decisions here are Siggie's, 2026-09-04, in an interactive session. Where a
decision reversed something already written down, the reversal is noted so the
old text is not restored by someone reading the older doc.

---

## The problem this fixes

Every tour step and every example case in the app today is about **app
features** — what a checkbox does, where an edge anchors, how a merged box is
built. Most visitors do need that. But the target users are **researchers**, and
what they want first is *what the model contains*, not how the diagram is
constructed.

The evidence is in the example-cases pane itself: four of its six groups are
named after rendering behaviour ("The bare diagonal", "Pathological
convergences", "Flipped divergences", "Normal cases (a fix must not break
these)"). Those are debugging cases. Nothing in the app answers "where do
specimens live in this model, and what hangs off them."

The six entity categories already group the schema into content areas. They are
the skeleton for the fix.

---

## 1. Category content views (the ⊞ button)

✅ **§1 is shipped** — pins, the ⊞ control, replace-not-add, and the back
button. Nothing in §1 is open.

**Decision:** each category header in the left panel gets a small display
control that draws that category's content view on the canvas.

**The glyph is `⊞`, not `▶`.** The draft said "▶ or similar" without knowing
that the panel it lands in — `SelectionTable`, the *list* selector, not the
`SelectionTree` DAG the plan seems to have pictured — already spends `▶` on the
collapsed-category chevron one column to the left, and spends it again on the
collapsed-panel expand button. Three meanings for one glyph in one panel. `⊞`
is unused and reads as "put this on the canvas".

⚠️ **The control is on `SelectionTable` only.** The left panel has two modes
(`selectorMode` in `ExploreApp.tsx`); the list is the default and the DAG tree
sits behind a switch, deferred rather than dropped (2026-08-27). The tree has
no category headers at all — it is the whole containment graph — so there is
nowhere to hang this. If the tree ever becomes the default, the content views
need a different home and this section needs rewriting, not porting.

This replaces an earlier plan to add six "content" example cases. Putting the
control on the category header puts the content one click from where the reader
is already looking, instead of Help → Example cases → scroll → find
"Laboratory". The cases pane then stays what its own header comment says it is:
routing and inheritance situations for judging the diagram.

### 1.1 What a content view contains

**Category members plus pins.**

- A **member** is a class the category lists in `entityCategories.ts`. It is
  drawn because it belongs there.
- A **pin** is a class from *another* category, drawn alongside the members
  **because the category does not make sense without it.**

⚠️ **The test for a pin is explanatory, not structural.** An earlier draft of
this section derived pins mechanically — every outside class a member's slot
points at, so that no row was left drawing a hollow dot. **That rule is wrong**
and produced a table Siggie rejected (2026-09-04):

> *"I 'pinned' Person, Participant, Visit to Clinical because that category
> doesn't make sense without them. Do NOT pin TimePoint/TimePeriod to Admin. It
> clutters up the diagram and gives it no additional explanatory value."*

Clinical needs Participant and Visit because a condition is a condition **of
someone**, recorded at **some encounter** — take them away and the category is
a pile of disconnected records. Admin does not need TimePoint, even though
`Consent.valid_from`, `Consent.valid_to` and `ResearchStudy.associated_timepoint`
all point at it: a consent having a validity date explains nothing about study
administration, and the two extra boxes are clutter.

**A hollow dot is an acceptable outcome, not a defect to be fixed.** The row
still reads `→ TimePoint 0..1`, which tells the reader everything the drawn
edge would have. Completeness is not the goal; the goal is a picture that says
what the category *is*.

The rule of thumb this suggests: **value types are not pinned.** `TimePoint`,
`TimePeriod`, `Quantity` and `Context` are things attributes hold, not things a
category is about. **Actors and contexts are pinned** — `Participant`, `Visit`,
`Person` — when the category's records are records *of* or *about* them.

`BodySite` is the informative near-miss. It looks like a value type (small,
leaf-ish, held by an attribute) but it is a **domain concept with content** —
`site: AnatomicSiteEnum`, plus a qualifier — and "where on the body" is part of
what a measurement or a condition *is*, not bookkeeping about it. So it is
pinned where it is used. Size is not the test; whether the category's story
needs it is.

| Category | Members | Pins | Why those, and nothing else |
|---|---|---|---|
| **Admin / Study** | 8 | *(none)* | The category the others pin. It reaches outward only at `TimePoint` (3 slots), `TimePeriod` (2) and `CauseOfDeath` (1) — all value-ish, none explanatory. Draw it alone. |
| **Clinical** | 8 | `Participant`, `Visit`, `Person` | Siggie's screenshot, and the reference for the whole feature: these records are *of* a participant, *at* a visit. `Person` completes the pair Participant belongs to (and `Person.cause_of_death` points in at Clinical's `CauseOfDeath`). `BodySite` is a **member** now, dual-listed with Laboratory. `Quantity` is deliberately not pinned. |
| **Observations** | 12 | `Participant`, `Visit`, `BodySite` | An observation is of someone, at an encounter, and often *somewhere on a body*. `Organization` is NOT pinned despite 10 `performed_by` slots — who performed it is bookkeeping (Siggie, 2026-09-04, by the same argument that unpinned TimePoint from Admin). `Quantity` and `Context` stay unpinned as value types. `Quantity` is no longer a member either — moved to Other. |
| **Laboratory** | 12 | `Participant` | A specimen comes *from* someone; that is the one outside fact the category needs. Everything else it reaches (`Quantity` 8, `TimePoint` 8, `Organization` 5, `Visit` 2, `Document` 1) is measurement and bookkeeping — which is why the old mechanical rule made this row unreadable. `BodySite` stays a member here (dual-listed) for `SpecimenCreationActivity.collection_site`. |
| **Survey** | 10 | *(none)* | Ten classes, two outward references. Genuinely self-contained — a real content fact worth stating in the tour rather than papering over with pins. |
| **Files / Other** | 6 | `Participant` | Files are associated with a participant. `BodySite` and `ImagingStudy` are one slot each and not what the category is about. Now also holds `Quantity` — see below. |

**The shape is what matters, not exact category membership** (Siggie): a view may
pin whatever makes it read, and need not correspond one-to-one with the category
listing. Pins are a curatorial judgement about what a category *means* — they
cannot be derived, which is why §1.2 stores them rather than computing them.

**`Participant`, `Visit` and `Organization` are the model's universal joints** —
they are the outside classes categories actually depend on, and the
"Flipped divergences" debugging group was measuring exactly this (Participant
22-way, Visit 19-way, Organization 11) without framing it as content.

**Slot counts** cited above are the number of member attributes ranging on that
class, and are evidence *for the discussion*, not the pin rule. To recompute
after a schema sync: for each category, take the entity-ranged slots of its
members (`classes[c].slots` is a list of `{id}`; ranges live in the flat
`s.slots` index of `public/source_data/HM/bdchm.processed.json`), group by
target, drop `Entity` and the category's own members, and count.

### 1.2 Where pin sets live ✅

`pins` is a field on `EntityCategory` in `src/config/entityCategories.ts`,
beside the `classIds` it belongs to, and threaded through `CategoryGroup` →
`CategoryTree` in `DataService` (filtered by `itemExists` like `classIds`, so a
pin naming a class an upstream sync removed drops out instead of reaching the
canvas as a phantom id). It cannot be computed, since the criterion is "does
the category make sense without it" (§1.1); storing it beside the category
keeps the judgement next to the thing judged.

⚠️ **Do not confuse `pins` with `DEFAULT_PINS`** in the same file. Same word,
unrelated features: `DEFAULT_PINS` is the first-visit canvas selection.

⚠️ Pins are hand-curated and will rot on an upstream schema sync, exactly like
`classIds` and the `containmentGraph` override sets already do — and unlike
those, a stale pin set is invisible, because a wrong pin just draws an extra box.
Re-read this section after a sync rather than re-running a query.

Four guards in `entityCategories.test.ts` catch what is catchable: pins name
real classes, a category never pins its own members, pins are unique, and **no
value type is ever pinned** (`TimePoint`, `TimePeriod`, `Quantity`, `Context`)
— that last one asserts the §1.1 rule rather than merely writing it down, so
reinstating the rejected mechanical derivation turns the suite red. None of
them can catch a pin that is merely *unhelpful*; that stays a reading.

`categoryView()` in `src/config/categoryView.ts` composes members-then-pins and dedupes
— a pin can also be a member of another category (`BodySite` is a member of
`clinical` and `lab` and a pin of `observation`), and a duplicate id in the
selection would toggle two rows for one class.

### 1.3 Replace, and the back button ✅

**Clicking ⊞ replaces the canvas**, it does not add to it — shipped, as
`showCategoryView` in `ExploreApp.tsx`. Cumulative state makes the picture stop
matching the label — the same failure the tour's `Change:` verb already has
(`help-content.md` TODO: "tour step 4 ADDS to step 3's canvas instead of
replacing it, so the canvas is cumulative where the copy reads as if it were
showing a clean two-box example").

Every drawn id is reported to `reconcile` as a viewer *tick*, for the reason
`claimForViewer` gives: a tick of something a tour step also pushed leaves no
trace in the resulting state, so the write effect cannot detect it. The unticks
— everything the replace dropped — that effect sees on its own.

**The browser back button returns to the previous canvas.** Three pieces:

- `writeExploreState(state, { push })` chooses the history verb.
  **`replaceState` stays the default**, deliberately: if ordinary writes
  pushed, back would replay the session one checkbox at a time and never leave
  the page. Only a whole-canvas jump passes `push` — today ⊞ alone.
- `pushNextWrite`, a ref in `ExploreApp`, marks *one* write. Set at the click,
  **consumed** by the write effect — left set, it would turn the viewer's next
  unrelated click into a history stop.
- `popstate` is a third caller of the existing `apply`, the function the tour's
  `explore:state-from-url` event already used to put the app into a state read
  from the URL. Back and forward cost one listener, not a parallel path.

Three consequences worth keeping:

1. **The restore's own write must not push.** `apply` sets state, which runs
   the write effect, which writes the URL again — a `replaceState` of the entry
   just navigated to, with the state it already holds. Harmless. A push there
   would grow the stack on every back press and the button would never reach
   the start.
2. **Re-drawing the view already on screen pushes nothing.** `showCategoryView`
   compares against the live selection and bails early; without that, back
   needs two presses to go anywhere and looks broken on the first.
3. **The flag is set inside a state updater**, which StrictMode runs twice. Safe
   only because it is idempotent — keep it that way.

⚠️ **Test the checkboxes, not just `sel`.** jsdom's `history.back()` moves
`window.location` whether or not anything reacts, so URL-only assertions pass
with the `popstate` listener deleted — measured: five of six such tests stayed
green under that sabotage. `categoryViewHistory.test.tsx` reads the ticked rows
instead, and both sabotages then fail five of six.

---

## 2. The Help menu

**Decision:** make Help prominent (roughly as the "take the tour" pill is now)
and **delete the pill**. Two entry points to the same thing drift apart.

```
Help ▾
  Tours →
    What BDCHM covers          (needs a better title)
    Getting oriented
    Reading the diagram
    Ownership
    Inheritance
  Legend
  Example cases
```

- **The other menu items are dropped.** The tours cover them now.
  ⚠️ Before deleting: `node-dismiss`, `toolbar-siblings`, `relation-bar` and
  `graph-canvas-reading` are help-only entries surfaced contextually (ⓘ /
  hover). Confirm they stay reachable in context, or dropping them from the
  menu makes them unreachable rather than merely unlisted.
- **Legend and Example cases are mutually exclusive.** Best framed as *one panel
  slot with two possible contents* rather than "opening one closes the other" —
  no half-open state, no z-order question.
  ⚠️ The shipped `help-menu` help text promises the opposite ("The two open as
  separate panels, so you can keep the legend up while you flip through
  cases"). Rewrite it.
- **Entry point:** with the pill gone, decide whether Help → Tours opens a
  chooser or the first tour. A returning reader who wants "Inheritance" should
  not have to walk "What BDCHM covers".

---

## 3. The five tours

Order is fixed: **complexity rising, each tour using what the last established.**

### 3.1 What BDCHM covers — ⚠️ needs a better title

*Content only. No app mechanics. The tour that does not exist today and matters
most to the target reader.*

Two halves. **The spine first**, grown one hop at a time — never more than five
boxes on screen — then **a step per category**, using the ⊞ views, with beats
for progressive reveal.

Siggie named the spine: `Person → Participant → Visit → Observation →
Quantity`. It is the path from "a person in a study" to "a number you would
analyse", and four of six categories hang off it.

The class descriptions in the schema are good enough to build on with light
editing — checked, not assumed (`Person`, `Participant`, `Visit`,
`Observation`, `Quantity`, `Specimen`, `Organization` all have real ones). In
particular Person vs. Participant is self-explaining:

> **Person** — "Administrative information about an individual or animal
> receiving care or other health-related services."
> **Participant** — "A Participant is the entity of interest in a research
> study… Human research subjects are usually not traceable to a particular
> person to protect the subject's privacy."

That distinction — one human being, potentially several study participants — is
the first genuinely modelling-flavoured idea a researcher meets, and it is worth
a step of its own.

Spine steps: `Person, Participant` → `+ Visit` → `+ Observation` (the merged box
appears; note there are five kinds) → `+ Quantity` (a value and a unit; sixteen
classes point at it).

Category steps: one per category, each loading its ⊞ view, with beats revealing
the story rather than the whole canvas at once. Survey's step gets to say the
thing the numbers show — it is a self-contained subtree that barely touches the
rest of the model.

### 3.2 Getting oriented

*The app, minimally.* Tree → checkbox → canvas → relation bar → copy link.

This is where today's tour steps 2, 3 and 5 collapse into two or three, and
where the duplicate "Entities" title dies (`selection-tree` and `entities` share
it). **The relation bar belongs here**, not in "Reading the diagram": it is how
you *navigate*, not how you *read*.

### 3.3 Reading the diagram

*Rows, dots, and row anchoring.* Two steps, both drafted:

**Rows and the dot convention.** Selection: `Organization`.

> A single class. Rows are its attributes: name, then range and cardinality on
> the right. The dot and the range label share a color that says what KIND of
> thing the attribute points at — blue for an entity, purple for a permissible
> value set, green for a data type. A filled dot draws an edge; a hollow one
> does not, because nothing it could point at is on the canvas.

Covers P1 (the range palette) and filled-vs-hollow, which is the one a reader
cannot guess. (Organization is an Admin class now, which makes it a better
example, not a worse one.)

**One edge, row-anchored.** Selection: `Visit`, `TimePeriod`.

> Visit owns TimePeriod. The edge leaves the `year_range` ROW, not the box, and
> the arrowhead lands on the owned class. This anchoring is the whole idea: an
> edge tells you WHICH attribute made it.

Row anchoring is the most load-bearing idea in the diagram and the cheapest to
show — one edge, two boxes, nothing else on canvas.

⚠️ **This tour may be too thin to stand alone.** Its other two drafted steps are
ownership content and have moved to §3.4. If two steps is not a tour, merge
these into "Getting oriented" and drop this entry.

### 3.4 Ownership

*Siggie's case for why this tour exists, and it is the strongest in the set:*

> Ownership is what the whole diagram is about. It's not available in the
> generated docs. It can't even be discovered from the schema — we had to come
> up with a bunch of rules to make it clear.

It is also load-bearing: the layered left-to-right layout, the arrowheads and
the relation bar's two sides do not parse without it. Hence **before**
Inheritance, whose merged boxes anchor edges on child rows and child headers —
unreadable until you know what an edge anchor means.

Two drafted steps, moved here from §3.3:

**Owns vs. belongs-to.** Selection: `Specimen`, `Participant`,
`SpecimenCreationActivity`.

> Opposite directions. Specimen OWNS its creation activity (forward). Specimen
> BELONGS TO a Participant — declared as `source_participant` on Specimen, but
> drawn Participant → Specimen, because a single-valued pointer at an entity is
> a foreign key. `parent_specimen` is also here as a self-loop.

Covers own-fwd / own-bkwd *and* storage-direction normalization — the thing most
likely to look like a bug to someone who has read the schema. Throws in a
self-loop for free.

**All three edge types at once.** Selection: `SpecimenContainer`, `Specimen`,
`Substance`, `SpecimenStorageActivity`.

> THE DECISION CASE. `SpecimenContainer.additive` → Substance is own-fwd;
> `Specimen.contained_in` → SpecimenContainer is own-bkwd; `container` →
> SpecimenStorageActivity is an association (dashed, arrowed BOTH ends).
> Compare own-bkwd against association here — they layer identically and differ
> only in ink.

⚠️ Two corrections already applied above, both verified 2026-09-04 — do not
reintroduce them from an older draft:

1. **`contained_in` is declared on `Specimen`, not `SpecimenContainer`.**
   Verified against `bdchm.yaml` and the live classifier. The verdict and the
   point of the case are unaffected; the earlier sentence named the wrong
   declaring class.
2. **Association is slate**, not a faint blue — P2 is three hues, not a Blues
   ramp. Say the **dash and the two arrowheads** carry the distinction, not
   faintness.

The three slots are not all declared on the same class, which is worth saying
out loud rather than glossing — it is exactly the distinction the relation
bar's row glyphs encode.

Remaining material: the "One rule at a time" case group, reframed for a reader
rather than a debugger — why `Quantity` draws forward despite being
single-valued (no independent existence), what an association is and why the
schema has exactly two.

### 3.5 Inheritance

*Last, because it is the most complicated part of the diagram (Siggie) and
because it depends on ownership's edge-anchor vocabulary.*

Material, largely unharvested and good as written, from the "Inheritance (the ⑃
siblings toggle)" case group:

- **One child, merged with its parent** (`MeasurementObservation` alone) — it
  still merges; merging does not wait for a second sibling, because a class must
  not change shape because of what else you happen to select.
- **Children that add nothing** (`SpecimenQuality-` / `SpecimenQuantity-
  Observation`) — "this subclass adds nothing" is the answer to what they are.
- **`slot_usage` — same name, different type** (the five
  `QuestionnaireResponseValue` children) — the narrowing is the entire reason
  the classes exist.
- **The full Observation family** — one box where there would be six.
- **A narrowed edge pointing at a child header** —
  `MeasurementObservationSet.observations` → the `MeasurementObservation`
  header. Shipped 2026-09-02.

**Load the Observations ⊞ view for this tour.** It is the best
merged-inheritance picture in the app and it shows the narrowed child-header
edge for free, so both of the ideas above are on screen without building a
selection by hand.

---

## 4. Not in scope, deliberately

**Enums and entity details.** There is material in previous views (enum
contents, per-entity detail) that researchers would want and that the Explorer
does not yet carry. Siggie: get a good, working tour first. Design so an
"entity details" step drops in later without restructuring — do not claim
completeness in the diagram tours.

**Per-user attribute display preference.** `ROW_BUDGET` is `Infinity` as of
2026-09-04, so every box shows every attribute and the `+ N more` / `− fewer`
footer never renders. The budget machinery is intact for the intended end state:
a preference like "Default to show top [6] attributes" that puts the footer
back. See `OwnershipGraphView.tsx` and `rowBudget.test.ts`.

---

## 5. Shipped in this session

- **`ROW_BUDGET = Infinity`** — every box shows every attribute; no footer.
  `rowBudget.test.ts` updated (it deliberately hardcodes the numbers so a budget
  change fails loudly, and it did).
- **`Organization` moved from `other` to `admin`** — it is a study
  administration concept, not a file: it is what `performed_by`,
  `originating_site` and the transport endpoints point at, from Observations,
  Laboratory and Admin alike.
- **`Quantity` moved from `observation` to `other`** — a generic value type,
  not an observation concept. 16 slots across 13 classes in four categories,
  including `Substance.substance_quantity`, `Assay.lower_limit_of_detection`
  and `SpecimenProcessingActivity.duration`, none of them observations. It now
  sits beside `TimePoint` (15 slots, 9 classes), which is the same kind of
  thing.
- **`BodySite` dual-listed into `clinical`**, keeping its `lab` listing. Usage
  is 3 clinical (`Condition`, `Procedure`, `ImagingStudy`) against 1 lab
  (`SpecimenCreationActivity.collection_site`), but anatomy belongs to both.
  Third entry in `DUAL_LISTED` (`entityCategories.test.ts`), which the test
  requires and which is why the allowlist exists.
