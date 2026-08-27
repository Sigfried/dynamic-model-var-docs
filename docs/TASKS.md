# Tasks

> **Active planning document.** Completed and superseded rounds are in
> [docs/archive/tasks-2026-08.md](archive/tasks-2026-08.md).
> Architectural rules and workflow are in [CLAUDE.md](../CLAUDE.md).
> Reasoning and dead ends are in [WORKLOG.md](../WORKLOG.md) — written for the
> next session, not for Siggie.

---

## 🗓️ ONE DAY LEFT — the list

**Restructured 2026-08-27 for Siggie to edit.** Everything below the fold is
detail; this table is the whole plan. **S1 and S2 are merged to `main` and all
tests pass; nothing is deployed.**

**Siggie: edit this table.** Reorder, delete, or mark what you actually want.
The estimates assume the code is already understood and exclude review cycles.

### Must decide before building (blocking, minutes not hours)

 | #  | Decision                                                                                                                          | Why it blocks                                                        | Detail                                                                     |
 |----|-----------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------|----------------------------------------------------------------------------|
 | D1 | Tour `back`: restore whole state, only tour-set keys, or lock interaction during a tour?                                          | Determines the tour's state mechanism; wrong pick means rewriting it | [Tour rework](#the-tour-the-problem-was-never-placement)                  |
 | D2 | `ObservationSet.observations` — still suppress its edge? **Your premise was wrong**: it is NOT abstract and DOES declare the slot | Changes what the edge redesign builds                                | [Edge rendering](#edge-rendering-the-fan-from-observationsetobservations) |
 | D3 | Chip-strip replacement: rows-per-relation-type vs cascading menu                                                                  | The single largest build item; everything visual depends on it       | [Chip strips](#chip-strips-relation-counts-menu-the-main-redesign)       |

- D1: if tour starts when state is not default, record state; 
  when tour ends/is exited, restore prior state; every step of tour is prespecified
  so navigation either way gives exact state. allow interaction, but explain to user
  that their changes will be undone by each step on tour
- D2: don't suppress 
- D3: cascading menu

### Build, in recommended order

**[sg] quicker for me to make my own list. you can integrate into the table or whatever**

1. **selection panel**: i wrote the below about deciding whether to keep dag-browser. we just don't have
   time to fix it. but keeping it for after deadline if we have time to work on it then.
   so, for now, go back to "flat" list but structure it by inheritance like in the
   kitchen sink view, except categories at top level and no Entity
   1. **dag-browser**: need to determine if we keep it. i can't even explore it
      until we have horizontal scrolling and at least panel resize (drag right edge)
      1. top level must be by our made-up categories; maybe second level also follows
         flat tree order. i'm not sure what happens with roots -- but in order to get
         top level to be categories, the dag will need, just for browser, to add the
         categories as parents of entities
      2. let's bang this out as quickly as possible and make determination
      3. if we do go back to flat list, structure it by inheritance like in the
         kitchen sink view, but categories at top level and no Entity. tour description
         below should work either way
2. replace chips with cascading menus. need this to go fast. tour depends on it
3. **create the actual tour**:
   1. current first step sort of highlights the title but doesn't dim the rest. fix
      only if it takes less than a minute. text:
      - **BDCHM Explorer**
      - An interactive map of the [BioData Catalyst Harmonized Model](https://rtiinternational.github.io/NHLBI-BDC-DMC-HM/)
        [add a phrase/sentence about the overall project; i'm trying to find a
        good link for that]
        — the ~55 entities defined by its [LinkML schema](https://linkml.io/)
        and how they relate to each other. You can use it to more quickly and thoroughly
        understand the relationships than with the static [LinkML documentation](https://rtiinternational.github.io/NHLBI-BDC-DMC-HM/).
        It is meant to help researchers who:
        - Have access to data in BDCHM format and want to understand its structure;
        - Have data that they want to harmonize to BDCHM format; or
        - Are designing studies and want to model them using BDCHM or want to use
          BDCHM for ideas or inspiration for their own efforts.
      - Pick some entities on the left and the diagram shows how they fit
        together. Click the title to clear everything and start over.
   2. highlight selection panel. text:
      - **Entities**
      - A LinkML schema defines classes representing a data model's entities.
        A class defines a set of slots or attributes (like columns in a database table)
        which can hold
        - other entities,
        - permissible value sets (enumerations),
        - or raw data types (strings, integers, etc.)
   3. select MeasurementObservation and highlight observation_type. text:
      - While the relationship between an entity and its enumerations and raw
        data attributes is direct (e.g.,
        `MeasurementObservation.observation_type` --> `MeasurementObservationTypeEnum`
        or `MeasurementObservation.age_at_observation` --> `integer`), it can be
        related to other entities in more complex ways
        [can we animate this so that step 4 keeps this popover but shows the next bullet, etc?
        not sure best way to represent this in my outline...well, we're going to need a reasonably
        human-readable/writable format for the full tour specs anyway]
        - inheritance, known in modeling parlance as IS_A relationships,
          e.g., `MeasurementObservation.is_a` --> `Observation`, or
        - association / ownership / containment, known in modeling parlance as HAS_A relationships,
          e.g., `Visit.associated_participant` --> `Participant`.
        A primary goal 
      - Entities can be related to each other through
   4. goal is to show all the relationship types. if there are any entities
      that use all four, select one of those, otherwise will have to select
      one that has most and then select another that has the others. steps:
      1. **Selecting an entity** Select an entity by clicking its checkbox;
         the entity will appear in the main panel along with directly related
         entities. There are five ways an entity can be related to another.
      2. highlight row
      3. click checkbox. 

**Status 2026-08-27, after the parallel round.** Items 1 and 2 are built and
merged to `main`; tests pass; both reviewed. See the
[handoff](#handoff-start-here-2026-08-27-after-the-parallel-session-round).

| # | Task | Est. | Status | Detail |
|---|---|---|---|---|
| 1 | **Selection panel → flat list, nested by inheritance, categories on top, no `Entity`.** dag-browser kept behind the toggle | ~0.5 day | ✅ done | `SelectionTable.tsx` 140→211 lines |
| 2 | **Chips → cascading menus.** Also fixes the box-height/text-overlap bug | ~0.5–1 day | ✅ done | `RelationMenu.tsx` · [design](#chip-strips-relation-counts-menu-the-main-redesign) |
| 3 | **The tour** — format (S3a) + mechanism (S3b) + copy (Siggie's) | ~0.5–1 day | ▶️ **NEXT — S3a first, then S3b** | [format](#s3a-tour-authoring-format-brief) · [mechanism](#s3b-tour-mechanism-brief) |
| 4 | **Drop the duplicate header badge** — `⑃` and `▷` identical by construction on a merged box | ~10 min | ✅ merged — S2 took it | `OwnershipGraphView.tsx` (suppressed on merged boxes only) |
| 5 | **Dark-gray box headers, white text** | ~10 min | ⬜ | [quick wins](#quick-wins-one-session-no-design-decisions) |
| 6 | **Edge rendering** — one edge per declaring class; fixes the missing `Specimen.quality_measure` edge. **D2: do not suppress** | ~0.5 day | ⬜ | [§](#edge-rendering-the-fan-from-observationsetobservations) |
| 7 | **Re-render regression** — "most clicks refresh the main panel". **Measure, don't guess** | ~unknown | ⬜ still uninvestigated | [§](#still-not-investigated-the-one-thing-that-is-not-understood) |
| 8 | **Drag the tour popover.** Placement itself was exonerated | ~0.5 day | ⬜ | [§](#tour-and-help) |
| 9 | **Edge crossings.** Cause unmeasured | ~unknown | ⬜ | [§](#smaller-items-raised) |

### 🍒 QUICK WINS — one session, no design decisions

Small, self-contained, and none of them blocks or is blocked by the tour work.
Each has an exact location and a decided outcome, so this list can be worked
top-to-bottom without stopping to ask anything. Nothing here needs a browser
first except confirming it looks right afterwards.

| Item | Where | Est. |
|---|---|---|
| **Dark-gray box headers, white text** (table item 5) — currently `bg-slate-100 dark:bg-slate-700`; makes the colored child headers read as a family rather than anomalies | `OwnershipGraphView.tsx:1882` | ~10 min |
| **`entityCol` tooltips say "ranges"** — LinkML jargon in researcher-facing text. Replace with *"Attributes whose value is an entity"* / *"...comes from a permissible value set"* / *"...is a data type"*, which also makes the three read as a partition of the attribute count. **`researcher` vocab only** — the `linkml` vocab keeps "ranges" legitimately | `appConfig.ts:126-128` (and `:203` for the short vocab) | ~10 min |
| **First tour step doesn't dim the rest** while highlighting the title. Siggie: fix *only* if it takes under a minute — otherwise leave it for S3b | `HelpLayer.tsx` | ~1 min or skip |

**Deliberately NOT in this list**, though they look small: edge crossings and
the re-render regression (item 7) — both have **unmeasured causes**, and the
standing rule is measure before proposing one. They are not quick wins; they are
investigations wearing a quick win's clothes.

### Explicitly NOT this week

Panel resizing/detaching · categories in the tree (design question, not a bug) ·
the ownership legend (postponed by Siggie) · multi-category membership ·
CURIE links · the bare diagonal · dragging polish · example-cases restructuring.
These keep their write-ups below so nothing is lost.

## 🔁 HANDOFF — start here (2026-08-27, after the parallel-session round)

**S1 and S2 are done** — merged to `main`, tests pass, reviewed. What is left
below is the part that outlived the merge: the rules and a few loose ends.

### Rules learned the hard way — keep these

1. **NEVER `git add -A`, `git add .`, or `git commit -a`.** Stage explicit paths.
   A single such mistake put ~1128 lines of two sessions' implementation inside
   `b17db08`, a commit whose message claims it is docs-only. That commit is now
   in `main`'s history; its message still does not describe its contents.
2. **One working tree per concurrent session**, via `git worktree`. Sessions
   sharing a checkout will `git checkout` the filesystem out from under each
   other — no amount of care prevents it.
3. **Do not move the coordinating session off the branch the work is on.**
   Doing that hid S1's and S2's work from Siggie in the running app and cost
   real time looking for work that was already done.
4. Ask before committing another session's work.

### Loose ends

- The `entityCol` "ranges" tooltips moved to [Quick wins](#quick-wins-one-session-no-design-decisions).
  Note the write-up used to say `EntityTable.tsx`; they actually live in
  `appConfig.ts:126-128`.
- Worktrees removed and the S1/S2 branches deleted, 2026-08-27.

### Open questions for Siggie

- Your tour draft says *"five ways an entity can be related"* while surrounding
  text says four. S2 built four positions plus association. **Which is right?**
- Two sentences in the tour draft trail off (`A primary goal`, `Entities can be
  related to each other through`), and two bracketed notes-to-self remain.
- `~55 entities` in the draft vs `Entities (54)` in the app header.

---

## 🚦 THE TOUR — S3a and S3b, next up

> **This is the current work.** S1 and S2 are done and merged; their briefs are
> gone. S3a (format) and S3b (mechanism) are unstarted and neither is blocked.
>
> **They are no longer parallel sessions.** Run them in one session, S3a first:
> S3a defines the parsed shape that S3b builds against, so doing them in order
> removes the "agree the interface early" coordination the briefs below assume.
> Where a brief says "coordinate with S1/S2", that is now moot — read it as
> describing the merged code in `main`.

### S3a — Tour authoring format (brief)

> **NOT blocked; do this first.** Siggie, 2026-08-27: *"the tour can be broken
> up into two or three sessions, only the authoring is blocked but these can
> proceed."*

**Goal: design the format Siggie will write the tour in, then translate their
current draft into it — gaps, mistakes and all — so they can keep writing.**

> *"create tour authoring spec/format; and translate current tour contents —
> with their gaps and mistakes — into it for me to continue from"*

**You are not writing tour copy and not fixing their copy.** Translate it
faithfully. Where their draft is unfinished, carry the gap into the new format as
a visible TODO rather than completing it — they are continuing from your output,
and a plausible-looking invented sentence is worse than an obvious hole. Two
sentences literally trail off (`A primary goal` and `Entities can be related to
each other through`); keep them as-is and mark them.

**What the current format is.** `src/help/help-content.md`, parsed by
`src/help/parseHelpContent.ts` into `HelpEntry`
(`id, title, description, interactions[], shortcut?, context?, state?, tour?`).
The format is documented in a comment at the top of `help-content.md`.

**Why it does not stretch — the specific constraints to break.** Read these
before designing; each is a real limit in today's parser, not a guess:

1. **An entry's `id` is BOTH its DOM anchor and its identity.** `### <id>` must
   match a `data-help-id` attribute. So two tour steps cannot point at the same
   element, and a step cannot point at something that has no tagged element.
   Siggie's draft needs both.
2. **`tour:` is a flat 1-based integer.** Their draft is nested — step 4 has
   sub-steps 1/2/3 ("Selecting an entity" → highlight row → click checkbox).
   There is no representation for that.
3. **No progressive disclosure within a step.** Siggie asked directly:
   *"can we animate this so that step 4 keeps this popover but shows the next
   bullet, etc? not sure best way to represent this in my outline...well, we're
   going to need a reasonably human-readable/writable format for the full tour
   specs anyway"* — that last clause is this brief.
4. **`state:` is a URL query applied before the step.** D1 (below) needs every
   step to carry its FULL state, not a diff, and needs an entry/exit snapshot.
   Check whether `state:` as-is already satisfies "full state" — it may.
5. **A step cannot describe an ACTION it performs.** This is what confused
   Siggie in review: step 2 silently selects Participant and nothing says the
   tour did it. The format needs somewhere to say "we just ticked this for you."
6. **Anchors are whole elements.** Siggie needs to highlight *a row*
   ("the participant row highlighted, not the whole tree") and *a slot row*
   (`observation_type`). Whether that is a format problem or purely S3b's
   problem is yours to determine — but the format has to be able to EXPRESS it.

**D1 is decided; design to it.** Siggie:

> *"if tour starts when state is not default, record state; when tour ends/is
> exited, restore prior state; every step of tour is prespecified so navigation
> either way gives exact state. allow interaction, but explain to user that
> their changes will be undone by each step on tour"*

**Constraints on your design:**
- **Markdown, hand-writable.** Siggie writes this; it is not a config file. Their
  draft is nested markdown lists and that is a strong hint at what they find
  natural. Do not invent YAML/JSON front-matter unless markdown genuinely cannot
  express it.
- **The help-only entries must keep working.** `help-content.md` serves BOTH
  help mode and the tour. Do not break the help half to serve the tour.
- **`src/test/helpContent.test.ts` pins the current contract** (content parses,
  tour numbered 1..n, every entry id is tagged in the app). Expect to change it
  deliberately, and say what you changed.

**Deliverables:**
1. The format, documented in the header comment of `help-content.md` the way the
   current one is (that comment IS the spec — keep that convention).
2. Siggie's draft translated into it, faithfully, with gaps marked.
3. A parser that reads it. If S3b is running separately, agree the TypeScript
   shape with them first — that interface is your seam.
4. A short note in chat on what you could not express and why.

**Ask Siggie, do not guess:** their draft says *"There are five ways an entity can
be related to another"* while the surrounding text says four, and the
chip-strip design has four positions plus association. Five may be right and
four the typo. Ask — it is one of the open questions in the handoff.

---

### S3b — Tour mechanism (brief)

> **NOT blocked on S1/S2 for the mechanism itself.** Siggie: *"implement the
> mechanisms. parts of the tour as currently written will work, but how
> selection happens will change with S1 and material i haven't written yet
> depends on S2."*
>
> **So: build the machinery, do not hard-code against today's selection UI.**
> S1 is replacing the selection panel underneath you.

**Goal: close the three known gaps in the tour machinery.** All are in
`src/help/HelpLayer.tsx` and `HelpProvider.tsx`.

**1. Steps must visibly perform their actions.** Today a step carries
`**State:** sel=Participant`, the canvas changes, and nothing says the tour did
it. **This is the bug that made Siggie misread the entire step** — they read the
popover as describing the Participant box that had just appeared. Whatever form
this takes (a line in the popover, a beat before the change, an animation), the
user must be able to tell that the tour acted.

**2. The spotlight must be able to ring a ROW, not just a panel.** Siggie: *"the
participant row highlighted, not the whole tree."* Today
`document.querySelector('[data-help-id="..."]')` finds one element, and the
tagged elements are whole panels. Siggie also wants to highlight a slot row
(`observation_type`) inside a box. **This is a real capability gap, not a
tweak** — it needs anchors that can address a row.

> ⚠️ **S1's markup is already in `main`** — the rows to highlight are
> `SelectionTable.tsx`'s, not the old dag-browser rows. Tag against what is
> there now; nothing is about to be deleted underneath you.

**3. `back` must restore exactly, per D1** (quoted in S3a above). Snapshot on
tour entry, restore on exit; every step sets its full state absolutely so
navigation either way is exact; interaction allowed, but the popover must SAY
that stepping will discard it.

**Do NOT do:**
- **Do not "fix" popover placement.** It was investigated and **exonerated** —
  the geometry did the right thing; the bug was the invisible action (gap 1).
  See [The tour](#the-tour-the-problem-was-never-placement). Popover
  **dragging** is still wanted as an escape hatch, but it is item 8, not this.
- Do not author tour copy — that is Siggie's, via S3a's format.

**Seam with S3a:** S3a defines the format and its parsed shape. Doing S3a first
means that shape exists before you start — build against it directly. Keep the
state/anchor logic behind small functions anyway; the shape will still move once
Siggie writes real copy against it.

**Definition of done:** a tour step can announce that it acted, ring a specific
row, and be navigated backwards into an exact prior state — demonstrated on the
existing 4-step tour, even though its copy is about to be replaced.

---

## 🎯 Dates

- **Explorer demo: 2026-08-25 — DONE.** Held a couple of hours after the
  session that shipped the induced-slot migration and the ownership rules; the
  merged-sibling inheritance work was built in the ~90 minutes before it. The
  big program manager was NOT there, which is what drives the sharing work.
- **Development wrap-up: ~2026-08-28/29 — ONE DAY LEFT as of 2026-08-27.**
  Siggie, 2026-08-27: *"i need to focus on the upcoming tasks. only have a day
  left."* The list at the top of this file is scoped to that.
- **Sharing / presentation (video demo + non-video guided tour):** asked for by
  the stakeholders on 2026-08-25, to be scoped in its OWN session before
  further development. See the handoff.
- **Target release 2026-07-30 passed and was never renegotiated.** Treat
  "before the release" language elsewhere in the docs as stale.
  **Needs Siggie: set a new target or drop it.**

---

## 📋 PLANNING — 2026-08-26 review of `0c6cfdc` (session 2)

> **This was a PLANNING session. Siggie: *"this whole session should be
> considered planning at this point, btw; not fixing."*** Nothing below was
> implemented. Three screenshots were reviewed against the code and several
> answers were **measured with throwaway probes**, not reasoned — those are
> marked MEASURED and can be trusted without re-deriving them.

### Verdict on `0c6cfdc`: keep it, fix forward

Do **not** revert. Of the six changes, four are settled: the owner-cap
suppression rule (uncontested), the CSS overlap fix (**Siggie confirmed the
row-overlap bug is gone**), the spotlight, and the hint hover-pin. The two that
need work are design conversations, not bad code. See below.

### What is confirmed BROKEN, in priority order

1. **No horizontal scroll in the tree** (Siggie: *"i don't see any horizontal
   scroll capability"*). MEASURED by reading the mount site: `selectionTree.css`
   puts `overflow-x: auto` on `.dbw-root`, but `ExploreApp.tsx:319` wraps it in
   `<div className="flex-1 overflow-y-auto min-h-0">` — **that** ancestor is the
   one sized to the fixed `w-96` panel, so it clips first and the inner scroll
   container never has anything to scroll. The overlap went away because of the
   18ch xref clamp, not because scrolling started working. Fix belongs on the
   ancestor — but see the chip-strip work first; scroll may not be the answer.

2. **Box-height / text overlap inside boxes.** Confirmed by img-1 (Participant:
   `+ 7 more attributes` colliding with `associated_person` / `Visit add all`)
   and img-3 (Observation: chip strips colliding with each other and with
   `Spec…`/`Context`). **Root cause, and it is structural:** `nodeHeight` now
   adds a second `ownersStripHFor(owned)` band, and both strips are
   `flex-wrap` with a height *estimated in JS* while the browser does the real
   wrapping. When the estimate and the actual wrap count disagree, the reserved
   band and the drawn band diverge and rows below overlap. Same root cause as
   the edge-anchoring risk the commit message flagged. **This is the strongest
   argument for the count-plus-menu redesign below: a fixed-size count badge
   makes box height predictable and kills this bug as a side effect rather than
   as a patch.**

3. **Duplicate header badges — MEASURED.** `⑃ {n.members.length}` (line 1784)
   and `▷ {n.subclassCount}` (line 1796) show the same number on a merged box,
   because `mergeSiblings` sets `subclassCount: members.length` at line 485.
   They can only differ on an *unmerged* box, where `subclassCount` counts drawn
   is-a edges (line 206) and `members` is empty — so only one renders anyway.
   **On a merged box they are identical by construction.** Drop one (probably
   `▷`, keeping `⑃` for "merged"). This also frees header room for the relation
   counts.

4. **`Specimen.quality_measure → SpecimenQualityObservation` is missing from the
   canvas — MEASURED, and it is NOT a classification bug.** The edge exists:
   `quality_measure` is `multivalued: true, range: SpecimenQualityObservation`
   → Rule 1 → own-fwd, and a probe confirms `Specimen --quality_measure
   [ownership]--> SpecimenQualityObservation` is in the subgraph, with SQO's
   parents being `Visit, Participant, Organization, Specimen, Observation`.
   It vanishes in img-3 because SQO is **absorbed into the merged Observation
   box**, and `mergeSiblings` filters owners with `notSelfOrMember` (line 452),
   folding member ownership into the merged box's chip strip instead of drawing
   it. Note SQO has exactly 5 owners against `DEFAULT_OWNER_CAP = 5`, so the cap
   is also live here. **Fix inside the edge-rendering redesign, not by raising
   the cap.**

### The tour — the problem was never placement

Siggie initially read this as a popover-placement bug. It is not. MEASURED:
step 2's entry id is `selection-tree` (`help-content.md:41`), and
`ExploreApp.tsx:319` tags the **left panel** with `data-help-id="selection-tree"`.
Nothing is anchored to Participant. The geometry in `HelpLayer.tsx:203` computed
`roomRight ≈ 640` vs `roomLeft ≈ -12` and placed the popover right of the tree —
**exactly as designed.**

The confusion came from step 2 carrying `**State:** sel=Participant`
(`help-content.md:48`): **the step silently performs an action**, a Participant
box appears, and nothing in the popover says the tour did it. Siggie: *"i was
totally misreading the step 2/4 popover... the reason is that Participant
appears in this step. So the problem isn't/wasn't with placement, it's with the
tour itself."*

Two requirements, both Siggie's:

- **T1. An action in a step must be visibly performed.** *"if the tour includes
  an action, the action needs to be very visibly performed, maybe broken into
  steps so the user follows what's going on."* And specifically: **highlight the
  Participant ROW, not the whole tree** — the current spotlight rings the entire
  left panel, which is why the action reads as ambient rather than as a thing
  that just happened. That means help anchors need to address a row inside the
  tree, not only whole panels.
- **T2. `back` must undo actions taken since that step.** Currently `State:` is
  applied forward with no inverse.

**Proposed mechanism (cheap, because item D already paid for it):** snapshot the
serializable state on entering each step; `back` restores the snapshot. All the
graph state already round-trips (`sel`/`exp`/`hidden`/`sibs`/`dir`/`merge`/
`owners`), so a step becomes literally a URL — which is what the guided-tour
half of B wanted anyway.

**Siggie's note on prior art:** *"didn't we talk about extracting
icd11-playground's state management as well as its help system? i guess we
didn't do it. it handles this in a complex but effective way. though its ability
to share a state with all its history is overkill for this app (and maybe for
that one too). but your solution is probably easier."* The earlier note is at
TASKS.md ~L458 (*"icd11-playground has a state system for this"*). **Decision:
go with per-step snapshots; do not port icd11's history-carrying state.** Record
this so it is not re-litigated.

**OPEN — Siggie's carry-forward #1, needs an answer before building:** *"can
restoring only tour actions work? it couldn't just be revert to previous url at
that point."* He is right that it cannot be a plain URL revert. If the user
interacts freely mid-tour, a whole-state snapshot restore discards **their**
changes too, which is surprising. The alternatives:
  - whole-state snapshot (simple, clobbers user edits on `back`);
  - track only the keys the tour itself set and restore just those (matches what
    they asked for, but "the tour set `sel=Participant` and then the user added
    Condition" has no obviously right answer);
  - soft-lock interaction during a tour (sidesteps it; may be too restrictive).
  This is also entangled with the still-open question of whether the user may
  interact at all during a tour. **Needs Siggie.**

### Edge rendering — the fan from `ObservationSet.observations`

img-3 shows ~5 colored edges leaving one source row and landing on one target
header. Siggie's three options were: one black edge / colored edges to child
headers / keep-and-explain. **They then specified what they actually want, which is
neither of the first two as stated:**

> *"ObservationSet.observations should be one black edge;
> DimensionalObservationSet.observations should be one blue edge (ideally to
> DimensionalObservation but could be Observation because of edge crossings),
> etc."*

I.e. **one edge per DECLARING class, colored by that class**, black for the
parent's own slot. This resolves the fan at the source rather than the target,
so it avoids both the tangle and the crossings their objection to option 1 raised
(*"the problem with option 1 is there would probably be a lot of edge crossing.
easier to read with colors, but not ideal"*).

Rejected: **keep-and-explain** — it needs explaining *because* it is not
working; documentation is not a fix for an unreadable diagram. Rejected as a
blanket rule: **one black edge for everything** — it loses genuine modeling
content, because `observations` is narrowed per subclass (DimensionalObservation**Set**
→ DimensionalObservation, etc.), and one black edge drops the fact that each set
holds its own kind. That answers Siggie's carry-forward question *"with option
2, is there information we'd be losing when there's slot_usage involved?"* —
**yes, real loss.**

**⚠️ ObservationSet — Siggie's carry-forward #2 needs REVISING, the premise is
wrong.** Siggie said: *"I guess if it's abstract then there's no case in which an
ObservationSet could own Observations, only in subclasses. so, yeah, i think
suppress."* MEASURED against `public/source_data/HM/bdchm.yaml`:

- **`ObservationSet` is NOT abstract.** No `abstract: true`; it is
  `is_a: Entity` with a plain description. Neither are Observation,
  DimensionalObservationSet, MeasurementObservationSet or SdohObservationSet.
- **But ObservationSet DOES declare `observations`** — its slots are `category,
  focus, method_type, performed_by, observations, associated_visit,
  associated_participant` — and the subclasses each *narrow* it
  (DimensionalObservationSet → DimensionalObservation, etc.).

So the conditional they attached their decision to ("if it's abstract") is false,
and suppression cannot be justified on those grounds. The black
`ObservationSet.observations → Observation` edge represents a real slot on a
real instantiable class. **Do not suppress it without asking them again** —
the honest question is now "ObservationSet is concrete and declares
`observations`; do you still want its edge hidden?", which is a modeling
judgement, not a mechanical consequence.

**Also in scope here:** the missing `Specimen.quality_measure` edge (item 4
above) — same subsystem, same merge-suppression cause.

### Chip strips → relation counts + menu (the main redesign)

Siggie: *"i think we need something other than chip strips. we should talk about
it. they're ugly and also tend to have text overlap."* Confirmed by img-3
(Observation carries 13 `owned by` chips over three wrapped lines plus an `owns`
strip plus `add all`; the box is mostly chips before it is mostly content).

**Keep the underlying model.** "Relations that exist but are not drawn" is
sound and is what stops Organization being a dead end (img-4). It is the
*presentation* as inline wrapped chip strips that fails — and it fails
structurally, per item 2 above.

#### How many relationship types — CORRECTED

An earlier answer in-session said "only two, `owns` / `owned by`, and
`hiddenOwned` is not a new type" on the grounds that the DAG flips `own-bkwd`
at build (`containmentGraph.ts:267`) so `parents`/`children` are pure direction.
**Siggie rejected this, correctly:**

> *"i'm not sure i'm happy with the new `hiddenOwned` getting merged with owns.
> the distinction is sort of like 'mine because i say so' and 'mine because it
> says so'."*

That distinction is real and user-visible: whether the relationship is declared
on my class or on theirs changes what you would edit to change it. From a single
entity's perspective there are **four** ownership positions plus association:

| | declared on me | declared on them |
|---|---|---|
| **I own it** | own-fwd (my attribute) | own-bkwd flipped (their FK) |
| **it owns me** | own-bkwd (my FK) | own-fwd (their attribute) |

Siggie's own labels, which are better than anything currently in the code:
*"N belong to me by my attribute," "N belong to me by their attribute," "N I
belong to," "N associated with."* Compare `OwnershipLegend.tsx:33`, which has
`'owns (forward)'` / `'belongs to (backward)'` / `'association (no ownership)'`
— those describe the **classifier**, not the reader's situation.

**⚠️ Implementation consequence, know this before designing:** the DAG **flips
`own-bkwd` at graph-build time** (`containmentGraph.ts:267`), so by the time you
hold `parents`/`children` the declaring side has been erased. Recovering it for
the chips means **carrying the verdict through the DAG**, not just the
direction. Not deep, but not free either.

**Associations must be surfaced.** Siggie: *"there are only two association
edges currently. but they shouldn't be hidden from user. i guess they get their
own `associated with 1`."* They currently appear in neither strip.
`ASSOCIATION_SLOTS` = `related_document`, `container`
(`containmentGraph.ts:68`).

#### Shape

Replace N inline chips with a **count per relation type**, expanding to a menu:

> *"i was thinking each gets its own row. or it could be a cascading menu
> starting from something sort of like 'N related' and branching to 'N belong to
> me by my attribute,' 'N belong to me by their attribute,' 'N I belong to,'
> and 'N associated with'."*

Rows and the cascade are compatible — the rows **are** the top level of the
cascade. Rows are the safer default because a fixed-height row per category is
what makes box height predictable (item 2).

**Re-hiding: yes, include it.** Siggie: *"on the menu level with the individual
related entities, clicking displays it, but if it's displayed it could be grayed
out, and is there any reason not to allow clicking one of these (or a red x next
to it) to re-hide it?"* No reason not to. This is strictly better than today's
chips and it preserves the drawn/undrawn state that would otherwise be lost when
chips collapse to counts. It also gives the fan-out control (below) somewhere to
live: pick one, several, or all, with the count showing the cost before you
click.

#### Fan-out — why `add all` is dangerous today

MEASURED. `expand` (`ExploreApp.tsx:164`) adds exactly one id, so the extra
boxes are not the click — they come from `ownershipSubgraph.ts:290`, where
**one-hop-up is applied to every core node including newly expanded ones**,
capped at 5.

Probe, Participant selected alone → 4 boxes:
`Participant:selected, Organization:context, Person:context, ResearchStudy:context`.
Then expanding DimensionalObservation → **7 boxes**, adding
`DimensionalObservation, DimensionalObservationSet, Visit`. Cause:
DimensionalObservation's parents are `Organization, DimensionalObservationSet,
Participant, Visit`; Organization and Participant are already drawn, so the
other two arrive uninvited. **One chip clicked, three boxes appeared.**

`add all` multiplies the same rule: ~4 ids each pulling up to 5 owners, drawn
from across the graph so they barely overlap — roughly 4 requested, up to ~20
drawn. On Organization's 14-item strip it is far worse.

**Siggie is inclined to distinguish selection from expansion** (expanded nodes
arrive bare; their owners appear as counts to expand from) — *"I'm inclined to
agree about distinguishing selection from expansion. But let's see where we end
up with chip strip replacement before implementing."* **Deferred deliberately:
the redesign may dissolve the question.**

### Smaller items raised

- **Box headers should be dark-gray with white text**, to match the (infrequent)
  colored child headers. Siggie: *"been meaning to say."* Currently
  `bg-slate-100 dark:bg-slate-700` (`OwnershipGraphView.tsx:1882`). Trivial, and
  it makes the child-header colors read as a family rather than as anomalies.
- **Unnecessary edge crossings.** *"there are a lot of unnecessary edge
  crossings. i don't know how much we can do to fix them, but we should try."*
  Layout is `useGraphLayout`. Not investigated — do not speculate on cause
  without measuring.
- **Dragging the tour popover** is still wanted as the escape hatch (*"yes,
  dragging is the escape hatch"*), even though placement was exonerated.
- **Legend regrouping.** Siggie noticed the legend really has 7 pair types and
  *"might be easier to read if all the owns (forward) were grouped together."*
  He also asked *"what would it look like if we just gave the types from the
  perspective of a single entity"* — i.e. the same four-position table above.
  **Carry-forward #3: they want this DESCRIBED to them before deciding.** Deferred;
  they were *"too tired to work it all out."* Note the legend is separately
  postponed (item H).

### 🔓 Still open — needs Siggie

1. **Tour `back` semantics** — restore whole state, restore only tour-set keys,
   or soft-lock interaction during a tour? (carry-forward #1, discussed above)
2. **ObservationSet edge** — their "suppress" was premised on it being abstract,
   **and it is not**. Re-ask. (carry-forward #2, corrected above)
3. **Legend from a single entity's perspective** — describe it to them first.
   (carry-forward #3)
4. Everything already open in the handoff: the re-render regression (still
   uninvestigated), "what happened to categories", panel resizing/detaching.

---

### STILL NOT INVESTIGATED — the one thing that is not understood

> **[sg] actually, before trying to fix anything, let's review all the changes**
> made in the last commit. i see that the writing on top of itself
> bug is fixed at least.
>
> **That review HAPPENED — see the PLANNING section immediately above.** The
> item below was deferred by it, not dropped, and is still the most serious
> unexplained report. It was NOT investigated in the planning session either.

**"Most clicks (chip, selection, +N attributes, etc.) cause at least the main
panel to refresh. didn't used to do that i don't think."**

This is a **regression report that was never investigated**, and it is the most
serious item on the list because it affects every interaction. Everything else
is a visual defect in one feature.

Likely suspects, in order — but **measure before believing any of them**:
1. `ExploreApp` now owns the four toolbar settings (`82039a6`). Every one is a
   `useState` in the top-level component, so any change re-renders the whole
   tree including `OwnershipGraphView`.
2. The new `writeExploreState` effect depends on nine values instead of four.
3. `HelpProvider` wraps the app and its `api` useMemo depends on ~13 values, so
   it may be invalidating on every render.
4. `SelectionTree` recomputes `counts` over all 54 classes via `useMemo` keyed
   on `[nodes, dataService]` — should be stable, but verify.

**Do not fix by guessing.** Add a render counter or use the React DevTools
profiler and find out which component re-renders and why. The standing process
note in this file exists because four bugs in an earlier session came from
reasoning about the render instead of measuring it.

---

### ▶️ dag-browser — the biggest open area

Siggie's list, verbatim:
- *"writing on top of itself (or the rows are anyway)"* (img-1)
- *"needs horizontal scroll"*
- *"needs panel resizing"*
- *"maybe should allow panel to be detached and moved"*
- *"what happened to categories"* (img-3)

**Diagnosis for the first two (confirmed by reading the widget's CSS):** the
widget ships `.dbw-row { white-space: nowrap }` with no overflow handling, so
its own cross-reference text ("★ also under Organization/MeasurementObservation,
…") runs past the panel edge and paints over neighbouring rows. `renderRow`
truncates the class NAME, but the xref markup belongs to the widget, so it
cannot be fixed there.

`0c6cfdc` attempts a CSS-only fix in `src/explore/selectionTree.css`
(horizontal scroll on `.dbw-root`, `width: max-content` on rows, xref notes
clamped to 18ch). **Unverified visually. Check it before trusting it**, and if
it does not hold, the honest options are to patch the widget upstream
(`~/github-repos/personal/` has no copy; it is an npm dep at `^0.2.0`) or to
stop using its default row chrome.

**"What happened to categories" — genuinely unanswered.** The tree is built
from `getContainmentNodes()`, i.e. the OWNERSHIP graph, which has 7 roots
(Assay, Document, Organization, Person, Questionnaire, ResearchStudyCollection,
SpecimenContainer). It has **nothing to do with `ENTITY_CATEGORIES`** — those
are the hand-curated navigation groups (Admin/Study, Clinical, Observations/
Measurements, Laboratory/Biospecimen, Survey/Questionnaire, Files/Other) the
old flat list showed. So categories did not break; they were never in the tree.

That is a design question for Siggie, not a bug to fix:
- Categories as an expanded TOP LAYER above the ownership roots (their own
  earlier idea, and they predicted the consequence: *"a lot more duplicates will
  appear, across categories"*), or
- Two separate trees, or
- Keep the flat category list as the primary selector after all.

The flat list is still available behind the `☰ flat list` / `⑃ tree` toggle at
the bottom of the panel, so this is comparable side by side right now.

**Panel resizing / detaching: NOT attempted.** Resizing is small; detaching is
not, and `dockview-poc` (an old branch, 153 behind) suggests this was explored
before — read it before designing anything.

---

### Tour and help

Siggie's report: *"need to be more careful about placement (in img-2 it should
be on right) or ability to drag or both"*, and *"getting no highlighting or
indication of what's going on between steps"*.

`0c6cfdc` attempts both — placement now picks the side with more room rather
than defaulting right, plus a `.help-spotlight` ring around the current
anchor. Also adds hover-to-preview / click-to-pin on the hint dots, which
Siggie asked for. **All three unverified visually.**

**Dragging the popover was NOT built** and is probably worth it regardless of
whether the placement heuristic holds — it is the escape hatch for every case
the geometry gets wrong.

Where things live: `src/help/` — `HelpProvider.tsx` (modes, keyboard),
`helpContext.ts`, `HelpLayer.tsx` (all rendering + positioning),
`parseHelpContent.ts` (ported from icd11), `help-content.md` (the content),
`help.css`. Tests in `src/test/helpContent.test.ts` check the content parses,
the tour is numbered 1..n, and every entry id is actually tagged in the app.

---

### ▶️ One-hop default

Siggie: *"after refresh and selecting organization, just get the box on its
own."*

**Diagnosed by probe, and it is real:** Organization has **no owners** (it is a
DAG root) and **no un-flipped ownership slots** — it owns 14 things, but every
edge is stored on the other class (`Observation.performed_by → Organization`).
So one-hop-up finds nothing and there are no rows to expand downward. A genuine
dead end, while the tree shows "14" beside it.

`0c6cfdc` adds `hiddenOwned` to the subgraph and an "owns" chip strip. The
model half has tests; **the rendered strip does not, and it adds a second chip
strip to boxes, which changes box height and therefore edge anchoring.** That
is the part most likely to be subtly wrong — check that edges still point at
the right rows on a box that has both strips.

---

### ✅ IMPLEMENTED 2026-08-26 — merged to `main` 2026-08-27

Siggie asked for five things, in their words:

| # | ask | status |
|---|---|---|
| 1 | "all the tweaking (item 2.iii)" | **partly** — see below |
| 2 | "make sure all slots visible" | **done** — nothing was unreachable; verified + one dead control fixed |
| 3 | "dag-browser-widget instead of current checkbox list" | **done** — flat list kept behind a toggle for comparison |
| 4 | "serializable state" | **done** — toolbar settings now travel in the link |
| 5 | "tour/help system" | **done** — 4-step tour + help mode + hints |

Commits: `fb6d6a7` `8dd93aa` `319e58c` `39c9695` `82039a6` `9d477e6` `7fe1999`.
292 tests pass, typecheck clean, lint at the pre-existing baseline, production
build succeeds. **Nothing merged, nothing deployed.**

Reasoning, dead ends and the things that surprised me are in WORKLOG.md.

**What is still open on item 1 (tweaking).** The *upward* half is done — the
owner cap is a real cap, chips add AND remove, every box has a close button.
Two pieces are not:
- **The downward equivalent of owner chips**: seeing from a box what it owns
  without expanding rows one at a time. Measured first: "one hop either
  direction" is ALREADY true of what is reachable (every entity-ranged row
  whose range is off-canvas is a click-to-add affordance); the gap is only that
  there is no summary of them. Needs a design call about where those chips sit
  on a box that already has an `owned by` strip.
- **Boxes connected at both ends collapsing to a `+` stub** — Siggie's specific
  suggestion, not attempted.

**Two follow-ups this unblocked:**
- Example cases can now be plain links (the localStorage constraint that
  prevented it is gone). Cases need optional sibs/dir/merge/owners fields first.
- The flat category list and its `SelectionTable` import should be deleted once
  the tree is confirmed.

---

### 📐 Row visibility — ANSWERED 2026-08-26 (was NEXT UP item 4)

Siggie: *"Must be able to show every slot that should appear in a box. Not sure
if that is happening now."* Read the code rather than guessing:

- **Merged boxes show EVERY row, always** — no connected/hidden split and no
  footer (`OwnershipGraphView.tsx:405`, shipped 2026-08-25 to Siggie's *"show
  all of them. let the box flow over bottom of page if needed"*).
- **Ordinary boxes collapse by default** (`:236`, `:242`). Hidden =
  rows with **no edge on the current canvas** + **all plain (non-entity) rows**.
- Hidden rows are reachable via the `+ N more` footer (`:1851`), and a box whose
  rows are ALL unconnected **auto-expands** (`:241`) — so the empty-box failure
  that motivated the merged-box change cannot recur on ordinary boxes either.

**So nothing is unreachable.** What remains is whether collapsed-by-default is
the right default — a tweaking/UX question, folded into item A.

The original "scrollable / resizable boxes" concern is still real in principle:
edge anchors are computed from row positions, so scrolling content *inside* a
fixed-height box would point its edges at the wrong rows. But boxes currently
grow instead of scrolling, so no edge mis-anchors today. Only revisit if a
fixed height is introduced.

---

### 🔗 NEW — make all important parts of app state serializable
- to allow sending links and for loading state in step-by-step tour
- icd11-playground has a state system for this. maybe, like help/tour
  system, could be packaged for use in other apps
  - **DECIDED 2026-08-26, do not re-litigate:** NOT porting it. Siggie: *"its
    ability to share a state with all its history is overkill for this app (and
    maybe for that one too)."* The tour gets per-step state snapshots instead —
    see the PLANNING section near the top of this file.

**Current split, measured 2026-08-25:**

 | in the URL (`ExploreApp.writeStateToURL`) | in localStorage only (`OwnershipGraphView`) |
 |-------------------------------------------|---------------------------------------------|
 | `sel` selected ids                        | `explore-nl-dir` — LR / TB                  |
 | `exp` expanded ids                        | `explore-nl-merge` — merge mode (⋙ ⋙⋙ ⌙ ≡)  |
 | `detail` open drawer                      | `explore-nl-sibs` — ⑃ siblings on/off       |
 | `roots` path-to-root                      | `explore-nl-owners` — 0 / ≤5 / all          |

Not persisted anywhere: per-node expand state (`expandedNodes`), node pins and
drags, zoom/pan, table collapse, which example case is open.

**So a shared link today reproduces the SELECTION but renders it with whatever
settings happen to be in the recipient's browser — or, for a first-time
visitor, the defaults.** The sibling merge that the whole inheritance feature
is about is a localStorage flag, so a link showing it off looks like the
feature does not exist.

**Known knock-on, worth fixing at the same time:** `ExploreApp.tsx:81` carries
a comment explaining that applying an example case is deliberately NOT a
navigation, *because* the merge mode lives in localStorage and is read once at
mount, so a reload would reset the thing being compared. That workaround exists
only because toolbar state is not in the URL; once it is, example cases can
become plain links — which is most of what a "non-video guided tour" needs.

**Design questions to settle when implementing:**
- Which controls are genuinely shareable state vs. personal preference? (Zoom
  probably preference; ⑃ siblings definitely shareable.)
- Omit defaults from the URL, as `roots` already does, or write everything so a
  link is explicit and immune to a later default change? For embeds, explicit
  is safer.
- `replaceState` (today) or real history entries, so Back steps through a tour?
- Keep localStorage as the fallback when a param is absent, so a bare visit
  still remembers a returning user's preferences.

---

### ▶️ OPEN — a narrowed edge should point at the CHILD's header, not the box

> Restored 2026-08-26 — deleted in `0c9db03` while NEXT UP still pointed
> at it, same as the multi-category write-up below. Original:
> `git show 4f33c23:docs/TASKS.md` lines 69–99.

Siggie, 2026-08-25, deferred deliberately: *"IF the container is also a merged
box (e.g., ObservationSet, MeasurementObservationSet), then the edge points at
the appropriate header."*

**The case.** `MeasurementObservationSet.observations` narrows its range from
`Observation` to `MeasurementObservation` (verified: all three ObservationSet
children narrow `observations` to their matching Observation subtype). Both
ends are merged boxes. The edge leaves the `MeasurementObservationSet` block
of one box and should ARRIVE at the `MeasurementObservation` header inside the
other — today it lands on the target box's header band like every other edge.

**Why this is not a tweak.** The entity end has never carried row meaning. From
the file header: *"the ENTITY END attaches to a header-level port on the target
class, which has no corresponding row, so edges point at the entity name."*
That assumption is load-bearing for the fan (`freeEndTotal`/`freeEndSlot`
spread ports across the header band), for convergence merging, and for the
single shared arrowhead. Pointing at a child header means the entity end
sometimes anchors on a ROW, so all three need to handle both.

**Design question to settle first:** does EVERY edge into a merged box target
the child header matching its range, or only a `slot_usage`-narrowed one? The
first is one rule; the second leaves existing edges untouched but means the
entity end means different things on different edges. Siggie has not chosen.

Note the row machinery is already in place: rows carry `declaringClass`, header
rows are real rows with a y-position, and `rowY(node, slot, declaringClass)`
resolves an anchor. What is missing is a port on the entity side that targets
a header row, and the fan/merge rules knowing about it.

---

### ▶️ OPEN — a class should appear in SEVERAL CATEGORIES

Restored 2026-08-26. This write-up was deleted in `0c9db03` while the NEXT UP
pointer to it survived, leaving item 3 dangling. Original text is at
`git show 4f33c23:docs/TASKS.md` (lines 100–121).

Siggie, 2026-08-25, looking at the first merged render: *"SpecimenQua...
Observation should appear in both categories — don't fix now, leave as task."*

**The modelling question is now ANSWERED (2026-08-26).** Siggie: *"they should
appear in both Observation/Measurements and Laboratory/Specimens. these
categories don't live in the schema. we imposed them to make the app easier to
navigate."*

That picks the second branch the original write-up posed. The second grouping
is **`entityCategories`, an imposed navigation aid — not a second superclass.**
So this is **not sibling merging at all**; it is general multi-category
membership, and sibling merging is one case of it. The `absorbed` /
`groupSiblings` work the original write-up described is NOT the place to start.

**Measured 2026-08-26 (probe over `ENTITY_CATEGORIES`, since deleted):**

- 53 classes, 53 memberships — **no class is in two categories today.**
- `SpecimenQualityObservation` and `SpecimenQuantityObservation` are in `lab`
  ONLY. They are children of `Observation`, which sits in `observation`.
- The two category labels involved are `observation` = "Observations /
  Measurements" and `lab` = "Laboratory / Biospecimen".

**Single-membership is an ENFORCED INVARIANT, not an accident.**
`src/test/entityCategories.test.ts:60` — *"no class is listed in two
categories"* — fails the build on exactly the change being asked for. That test
must be deliberately retired as part of this work, not worked around.

**The file header comment is already wrong.** `entityCategories.ts:3-6` says
*"An entity can appear in multiple categories (e.g., Condition appears in both
Pinned and Clinical)"* — true only of the special DYNAMIC `Pinned` category.
No static class is dual-listed, and the test above forbids it. Fix the comment
whichever way this lands.

**What breaks under dual-listing — audited, not guessed:**

| site | behaviour | severity |
|---|---|---|
| `DataService.ts:622` `getCategorySelectorSection` | `totalClasses` sums `classIds.length` across groups → **double-counts** the class in the header | real, cosmetic |
| `DataService.ts:643` same fn | emits `SectionItemData` with `id: classId` once per category → **duplicate ids in one section** | real; duplicate ids are what caused the LinkOverlay bug |
| `entityCategories.test.ts:100` | `ENTITY_CATEGORIES.find(c => c.classIds.includes(child))` takes the FIRST match → silently picks one category | latent |
| `EntityTable.tsx:49` `classIdSet` | per-table set; indentation guard still correct in each table | fine |
| `EntityExplorer.tsx:52` | maps categories → classes, never the reverse | fine |

The reverse direction (class → its categories) does not exist anywhere in the
codebase. Every consumer walks categories → classes, which is why
multi-membership was never exercised.

**Open design questions — Siggie's call:**
- Does a dual-listed class render identically in both places, or does the
  secondary appearance get marked (dimmed, an italic "also in Observations"
  note) so it does not read as two different classes?
- Is the pin state per-class or per-(class, category)? Pinning
  `SpecimenQualityObservation` from `lab` presumably pins the class.
- Which other classes deserve dual listing? Doing this for exactly two classes
  is a config edit; doing it as a general feature invites an audit of all 53.
  **Recommend: build the mechanism, dual-list only the two Siggie named, and
  leave the rest for a later pass.**

**Knock-on for item 9 (dag-browser-widget in Explorer).** Siggie already
predicted this from the other direction: *"with whole graph populated, a lot
more duplicates will appear, across categories."* If categories become a
dag-browser layer, that widget needs a class-appears-N-times story regardless.
These two items should be designed together, or item 9 will re-solve it.

---

### 🔗 OPEN — CURIE → external definition links (deferred, Siggie 2026-08-25)

**The goal:** every CURIE in the schema should link to its external source
definition. Raised because `transform_schema.py` looked like it expanded only
`id`/`identity`. **It doesn't** — that impression was wrong, and the real gap is
elsewhere. Measured against `bdchm.yaml`, 2026-08-25.

`expand_uri()` already has 8 call sites: `class_uri` (`:335`), `slot_uri`
(`:406`), enum `permissible_values.meaning` (`:492`), `reachable_from` nodes
(`:516`) and relationships (`:527`), type `uri` (`:589`), type `mappings`
(`:598`).

It only *looks* id-only because of what the source schema contains:

| location | CURIEs present |
|---|---|
| enum `permissible_values.meaning` | **611** |
| attribute `slot_uri` | 71 — every one is `schema:identifier` |
| class `class_uri` | 1 — `Entity` → `schema:Thing` |
| `exact_/close_/related_/narrow_/broad_mappings`, `see_also` | **0** |

16 prefixes declared: BAO, DUO, HP, ICD10CM, MMO, MONDO, OBA, OMOP, UBERON,
UOM, VBO, bdchm, linkml, ncbitaxon, rxnorm, schema.

**So the real questions are not "which fields get expanded":**

1. The 611 expanded enum-value URLs are the bulk of the external references.
   Are they reaching the UI as clickable links, or only stored? That is where
   the user-facing win is.
2. Slots carry no external mappings at all — only `schema:identifier`. If slots
   should link out to ontology terms, the `*_mappings` fields have to be
   populated **upstream** in bdchm.yaml; no transform change can invent them.
3. `expand_uri` does a live HTTP `HEAD` per prefix (`validate=True`). Under the
   schema-sync Action that is network I/O in CI on every run. `sv.expand_curie`
   would drop the hand-rolled prefix walk; decide separately whether to keep
   validation, and if so cache it rather than re-probing.

**Do not fold this into the induced-slots migration** — it is orthogonal to
where slot definitions are stored.

---

### ▶️ OPEN — the bare diagonal

One approach in a convergence arrives as a **straight diagonal with no steps**
while its neighbours step once or twice, cutting across other boxes. Reproduce:

```
?sel=BodySite~Condition~Consent~Demography~Exposure~Observation~Procedure
&exp=ImagingFile~ImagingStudy~MeasurementObservation~SpecimenCreationActivity
```

Siggie's reframing, which is the better question: *why does the second edge step
up twice then dive, when the others step once?* Adding `TimePoint → add all`
makes the diagonal disappear but introduces many crossings — so ELK appears to
trade one against the other by corridor crowding.

**Three guesses were made and all three were wrong.** Do not theorise from the
code. `?dbg=1` logs each convergence's routed approaches (point count, bend
count, diagonal flag, endpoints); start there.

#### ✅ Root cause found (2026-08-21) — Siggie's diagnosis, confirmed

**`bend` mode degenerates when there is no corner to bend from.**
`mergeDistFor(mode, pts)` returns, for `bend`, the length of the LAST ROUTED
SEGMENT. When ELK routes an approach as a single straight run — which happens
whenever the outermost fan lane lines up with the source row, i.e. to the
TOP approach of a large convergence — that "last segment" is the whole edge.
`mergeCut` then walks back past the source, `cut` lands at index 0, and the
entire path is replaced by one straight line from the source anchor to the
shared arrowhead base. That is the bare diagonal.

Verified numerically: a 2-point route 1020px long yields `mergeDist = 1020`,
`cut = 0`. `near`/`far` are immune because their distance is a fixed 40/120px,
so the cut always lands on the horizontal run near the node.

So `merge-near` is not "better here" in general — `bend` is simply undefined on
a corner-less route. The fix Siggie half-remembered (combine near with
from-last-corner) is well-founded, but as a **guard**, not a compromise: clamp
`bend` to `Math.min(lastSegment, nearDistance)`, or fall back to `near` when the
route has fewer than 3 points. **Not yet implemented** — Siggie chose to build
the comparison harness first.

---

### ▶️ OPEN — example-cases pane needs restructuring

Siggie, 2026-08-21. **Items 3 and 4 are done as of `a18d78b`** — the cases were
reordered simple→complex, edge-type cases were added, and the rule text was
rewritten (`OWNERSHIP_RULE_TEXT` in `containmentGraph.ts`). What remains:

1. **Reuse the DetailDrawer panel** rather than the floating box, for
   consistency. (First thought was draggable/resizable; Siggie revised to
   "just use the same panel as the details drawer".)
2. **Un-nest the legend from cases.** The **Ownership legend is meant to be
   permanent**; example cases serve a different purpose and may not be. Using
   the legend to find routing cases was a *temporary* use, not its reason to
   exist. They should not be tabs of one pane.
3. **BIGGEST FANS belongs with example cases**, not the legend — it serves the
   case-finding purpose.

Still owed from upcoming-thoughts #1: toolbar buttons, colours, dashed edges.

> ⚠️ Siggie has asked for **"fix the ownership legend"** (2026-08-25) without
> saying what is wrong. It may or may not mean the items above. **Ask first.**

---

### [sg] upcoming thoughts
1. i need this for current experimentation but should probably be permanent
   feature: a help or legend listing every type of ownership pair, the rules
   and overrides for assigning them and the entity.slot-->entity pairs for
   each
   - should also explain all toolbar buttons, colors, dashed edges, etc.
2. i don't know why OwnershipGraphView.tsx ended up with everything that
   should be a constant hardcoded instead of living somewhere like appConfig.ts.
   - i want to be able to change the dim-other-while-something-is-hightlighted
     opacity but don't know where to find it

-

---

### ▶️ OPEN — dragging is unfinished

Works: drag, drop-in-place, edges re-routed, amber border, double-click to
release, drawer no longer pops open mid-drag.

Missing:
1. **No obstacle awareness.** `smoothStepPath` routes between two anchors and
   knows nothing about other nodes, so a moved node's edges cross boxes ELK
   would have routed around. **ELK cannot fix this** — see WORKLOG for why
   `noLayout`, `Fixed Layout`, INTERACTIVE, and libavoid are all dead ends.
   The real fix is an orthogonal obstacle router (A*/visibility graph), pure
   geometry, testable in `paths.ts`. **Not scoped — needs Siggie's go-ahead.**
2. **No URL persistence.** Moves live in `OwnershipGraphView` and vanish on
   reload. Siggie wants dragging permanent, so they should lift to
   `ExploreApp` and encode alongside `?sel=`/`?exp=`. Note coordinates are
   layout-dependent — a move saved against one selection may land oddly in
   another.

---

### 📄 DOCS ARE STALE — Siggie, 2026-08-26: *"TASKS.md (and other docs) is at least partly out of date"*

**Two of the four items below were FIXED 2026-08-27** — kept with their
resolutions so the remaining two are not lost among them.

- ~~**This file below the handoff** (the A–I "NEXT UP" list Siggie never
  saw)~~ — **DONE 2026-08-27.** Moved to
  [archive/tasks-2026-08.md](archive/tasks-2026-08.md) and replaced by the
  one-day list at the top of this file.
- ~~**The tail of this file** ("Current round (post-2026-06-11 feedback)"
  onward, ~470 lines)~~ — **DONE 2026-08-27.** Archived with the rest; the
  keep/drop calls were made conservatively, so nothing was deleted, only moved.
- **`docs/EXPLORE_VIZ.md`** was audited 2026-08-24 as "~20–25% stale" and has
  **still not been revised**; the ownership-chip and selector changes since then
  make that worse. See the dedicated section below.
- ~~**`docs/HELP_PACKAGE_PLAN.md`** says "not yet started"~~ — **DONE
  2026-08-27.** Its status now records that the system is built in `src/help/`
  but not extracted, plus the two deliberate departures from the plan (no
  native-title swapping; measured positioning rather than CSS anchor
  positioning) and the gaps scoped in the PLANNING section.
- **Dates section at the top** still lists the wrap-up as "~2026-08-28/29" and
  carries a "**Needs Siggie**: set a new target or drop it" note from an older
  release date. Still needs Siggie.

---

### 📄 OPEN — EXPLORE_VIZ.md is ~20–25% stale (audited 2026-08-24)

The doc's own rule is "where this document and the code disagree, the code wins
and the doc is the bug." Audited claim-by-claim against the code. Staleness is
**concentrated, not spread** — Architecture, Data layer, Renderer and Build
order are in good shape.

**Cluster 1 — the "Core visual-design conclusions" list (lines 31–76) is the
worst section**, and the most damaging, because it reads as settled design law
and is written in the present indicative. 3 of 7 items are wrong:

- **Item 2** — "direction is encoded by vertical position (owners above
  members)". The default is LR: `OwnershipGraphView.tsx:444-445` reads
  `'explore-nl-dir'` defaulting to `'RIGHT'`. Owners are to the *left*. (TB is
  a toggle, `:956-958`.)
- **Item 3** — is-a as an "expandable stack (▸ 3 subclasses)". Ships as header
  chips `⊳ {parent}` / `▷ {n.subclassCount}` (`:1171-1180`).
- **Item 5** — flipped edges get a "re-verbed label". **Never built.** No SVG
  text exists on the edge layer at all; the intent survives only as a comment
  at `ownershipSubgraph.ts:80-81`. What actually marks a flipped edge is the
  back-pointing arrowhead (`:1091` `arrow-own-back`).
- **Item 1** (owner-side/member-side normalization) is CURRENT — it is the one
  `OWNERSHIP_CLASSIFICATION.md` builds Rule 2 on.

**The doc contradicts itself twice**: items 3 and 5 assert as fact what lines
230 and 232 correctly list as still-wanted. A reader who stops after the
numbered list comes away materially wrong.

**Cluster 2 — the owner cap 8→5 change (2026-08-19) was never propagated.**
Wrong at line 55 and again at line 118. `DEFAULT_OWNER_CAP = 5`
(`ownershipSubgraph.ts:103`), locked by `ownershipSubgraph.test.ts:84`.
Knock-on: the doc's flagship BodySite example (lines 69–74, "six owners are the
content of the diagram; drawing them is the right default") now demonstrates
the **opposite** of what ships — 6 > 5, so BodySite falls back to chips, as the
test says outright.

**Cluster 3 — vertical language survived a horizontal default.** Lines 37–38
and 131–133 ("owners sink to one above their topmost owning child; leaf classes
dangle below"). The *algorithm* is current (`computeSunkLayers`,
`ownershipSubgraph.ts:176-195`); only the orientation words are wrong. **Note
this is not doc-only rot** — the same idiom is in the code's own comment
(`ownershipSubgraph.ts:168-175`), so a rename should probably cover both.
Interestingly line 205 says owners sit *beside* their topmost member, which
survives LR and is the better wording.

**Largest gap is omission, not contradiction.** Shipped 2026-08-19→21 and
absent from the doc entirely: node dragging + edge re-routing, merge-mode
routing probes, the example-cases pane, the ownership legend,
one-arrowhead-per-convergence, thinner strokes.

Also: `exploreReset.test.ts` is actually `.tsx`, and five Explore-relevant tests
are unlisted (`ownershipExpansion`, `ownershipLegend`, `paths`, `DetailDrawer`,
`SelectionTable`).

**Fix the numbered list and the two `ownerCap` mentions first** — by the doc's
own rule those are the bugs.

---

### ⚠️ PROCESS NOTE FOR THE NEXT SESSION — read this one

Four bugs this session came from **reasoning about the render instead of
measuring the data**, and each was settled in ~30 seconds by a throwaway probe
test once I bothered. Wrong guesses included: "context nodes shouldn't merge"
(they should), "DimensionalObservation narrows observation_type" (it does not —
it is `BaseEnum`, identical to the parent), and a claim that "+N more" was
broken generally when only merged boxes were affected.

**When a render looks wrong, write a probe test that prints the actual view
model before proposing a cause.** The pipeline is
`getOwnershipSubgraph → buildViewModel → mergeSiblings`, and all three are now
exported specifically so a probe can call them (see
`src/test/mergedEdges.test.ts`, which is that pattern made permanent).

Also: `npm run typecheck` (= `tsc -b --noEmit`), never bare `npx tsc --noEmit`.
It caught four real errors this session that the bare form did not.

---

### 🚧 Gotchas — read before running anything

- **`npx vitest` needs node 22+.** The default `node` is v16 and fails with a
  `node:fs/promises` export error that looks like a broken test setup but is
  not. Use
  `export PATH="$HOME/.nvm/versions/node/v22.20.0/bin:$PATH"`.
- **Never run `npm run dev`** — Siggie keeps the app running themselves.
- `npm run typecheck` (`tsc -b --noEmit`), never bare `npx tsc --noEmit`.
  It caught four real errors in one session that the bare form did not.
  (In a sandbox `tsc -b` fails EPERM on `node_modules/.tmp`; the workaround is
  `npx tsc --noEmit -p tsconfig.app.json --tsBuildInfoFile "$TMPDIR/app.tsbuildinfo"`.)
- **`tsc` will NOT catch a stale union comparison.** When `'own-flip'` left the
  `OwnershipVerdict` union, every surviving `x === 'own-flip'` narrowed to
  `never` instead of erroring — so the typecheck stayed green while two live
  sites silently stopped matching (edge emission, and the legend's
  `flippedCount`). **Grep for the old literal; do not trust tsc for this.**
  Hit again later: `MergeMode` is `'bend'`, not `'full'`.
- **`console.log` is swallowed in vitest here.** To surface a value, assert it
  against a sentinel string and read the diff.
- Lint baseline is **20 errors**, all pre-existing (a missing `react-hooks` rule
  definition plus `.vite/deps` cache files). Compare against the baseline rather
  than expecting zero.
- jsdom does not do layout — see [TESTING.md](TESTING.md) before writing a test
  that measures element positions.

---
