# Tasks

> **Active planning document** - Completed work archived to [docs/archive/tasks.md](docs/archive/tasks.md)
>
> **Development principles** - See [CLAUDE.md](CLAUDE.md) for architectural rules and workflow

---

## 🎯 Target release: 2026-07-30 — **PASSED, not renegotiated**

This date is three weeks past as of 2026-08-19 and no new one has been set.
Work has continued without a deadline; treat "before the release" language
elsewhere in the docs as stale. **Needs Siggie: set a new target or drop it.**

---

## 🔁 HANDOFF — start here next session (updated 2026-08-24)

> The single-arrowhead merge is **DONE** (`0950472`). Schema-order attributes
> are **DONE** (`4b2adf6`). Node dragging is **DONE but incomplete**
> (`c483912`). Full reasoning and every rejected approach: `WORKLOG.md`,
> entry 2026-08-19/21.

### 📍 Two independent tracks are ready to implement (2026-08-24)

Both are fully specified. They touch **different files** and can be done in
either order, or by two sessions in parallel:

1. **Option A→B — slot identity and the collapsed-slot data bug.** ~1 day for
   both; A alone is ~2-4h but **should not ship alone** (see the callout under
   "READY TO IMPLEMENT"). A repairs a display regression shipping since Dec 2025
   (`Element.ts`, `OwnershipGraphView.tsx`); B repairs the transform
   (`transform_schema.py`, regenerated `bdchm.processed.json`).
2. **Ownership classification.** The larger piece, immediately below. Files:
   `containmentGraph.ts`, `Graph.ts`, `OwnershipGraphView.tsx`, components.

Only overlap is `OwnershipGraphView.tsx`, in different regions (A: `:146-161`;
classification: `:1091-1102` + header comment). Coordinate if run in parallel.

**Sequencing note:** A is a **prerequisite for B, not an alternative to it** —
they fix two different bugs and A does nothing for `focus`. Plan on A→B as one
job (~1 day). B interacts with the classification work: removing
`EXCLUDE_HAS_A_TARGETS` is what turns `focus` from a panel bug into a graph bug.

### 🛑 OPEN — ownership classification: rules decided, implementation pending

**THIS IS THE CURRENT WORK.** Finish and implement this before returning to
routing/formatting.

**[docs/OWNERSHIP_CLASSIFICATION.md](OWNERSHIP_CLASSIFICATION.md) is the live
document** — rewritten 2026-08-21/24 to read as a permanent end-user doc plus
temporary implementation instructions. **Start there, not in the code.** (The
diagnosis of what was wrong is in `WORKLOG.md`, 2026-08-21; the interim
`OWNERSHIP_RETHINK.md` was folded in and removed.)

**Status: proposed target, not yet implemented.** The doc describes where we are
going; its Appendix records what the code does today and is deleted once the
rules ship. Ownership classification is Siggie's call — the open questions below
were decided 2026-08-24 across two rounds; where the rounds disagree, the second
(marked "superseding") wins.

#### What was wrong

Of five classification rules, only `multivalued` read the schema — the other
four were hand-typed lists of names. `OWNERSHIP_OVERRIDES` is an edit log
presented as a category, which is why `performed_by` and
`associated_participant` landed in different groups despite being the same kind
of relationship.

#### The rules now

Three edge categories: `own-fwd` (owns), `own-bkwd` (belongs to — renamed from
`own-flip` for symmetry), `association` (no ownership claim, both ends arrowed,
but still ordered like `own-bkwd`).

- **Rule 1** — multivalued ⇒ `own-fwd` (31 edges)
- **Rule 2** — single-valued ⇒ `own-bkwd` (57 edges)
- **Exception 2a** — single-valued to a target with no independent existence ⇒
  `own-fwd` (41 edges). The `single_value_owner_slots` list, 14 classes.
- **Exception 2b** — cardinality splits a family ⇒ `own-fwd` (2 edges):
  `creation_activity`, `dimensional_measures`.
- **`Entity`-ranged** ⇒ `own-fwd` (12 edges)
- **`association`** — 8 named slots

**Decided 2026-08-24 (Siggie), superseding the earlier round:**

- **`Entity`-ranged edges point FORWARD**, not association. `Entity` must be a
  range node while staying out of inheritance. Removing `EXCLUDE_HAS_A_TARGETS`
  is sufficient — `Entity` is already in `classIds` and is only dropped by
  `pruneIsolated` because nothing touches it. Expect a 12-edge convergence.
- **The inheritance exclusion moves into the inheritance-tree accessors**
  (`getParentClass`/`getSubclasses`, `Graph.ts:398,416`), not a set the
  containment builder consults. Side-by-side sets are what conflated the two
  `Entity` cases in the first place. **But there is no single choke point yet**
  — the older views (`RelationshipInfoBox`, `LinkOverlay`) derive inheritance by
  filtering `getEdgesForItem` on `EDGE_TYPES.INHERITANCE` and never call those
  accessors, so the move would not affect them.
- **Build the single route (decided).** One accessor for all inheritance
  derivation, taking a **REQUIRED** `includeEntity` argument — not optional, not
  defaulted. A default is exactly what let this rot: two silent `Set<string>`s
  side by side, no call site ever stating which it wanted. Required makes intent
  explicit at each call and makes a new caller fail to compile rather than
  quietly inherit the wrong answer. Replaces `SKIP_SUBCLASS_EXPANSION`.
  Drawing sites pass `false`; `RelationshipInfoBox` passes `true` (stating
  "Parent class: Entity" is a useful fact — the fan is the noise, not the fact).
  **The components must stop filtering `getEdgesForItem` on
  `EDGE_TYPES.INHERITANCE` directly** — that filtering IS the second derivation
  path, and leaving it means there is still no single route.
- **`creation_activity` and `dimensional_measures` stay `own-fwd`** as
  Exception 2b — an earlier draft dropped them as "warts drawn honestly". Both
  have multivalued siblings that are `own-fwd`; `dimensional_measures` also
  ranges on a `*Set`. Asserted, not derived: a structural "collection class"
  test over-collects (`Person`, `Questionnaire`, `ResearchStudyCollection`).
- **`association` renders slate dashed `#64748b`**, dash `5 4`, both ends
  arrowed. Today's gray `#9ca3af` is too faint to see.
- **`own-bkwd` vs `association` kept separate FOR NOW, deliberately.** Siggie is
  leaning toward merging them but wants the implications visible first. They
  already layer identically, so a merge is rendering + vocabulary only — but it
  moves 57 edges, the largest group, out of "ownership".

**Counts corrected.** The old figures (59/40/150) predate pulling out the
association set and 2b, and 150 could not be reproduced. Verified against the
live code path 2026-08-24: **153** = every class-ranged slot in the processed
JSON; **141** = what the builder emits today (12 `Entity` edges excluded before
classification); **151** = the target. 5 self-loops, unchanged. Any count should
say which denominator it means.

#### Implementation checklist

- [ ] Rename `own-flip` → `own-bkwd` throughout.
- [ ] Add the `association` verdict; drop `ref` and the `reference` channel.
- [ ] Replace `OWNERSHIP_OVERRIDES` (15 entries) with the 8-slot association set
      **plus the 2-slot Exception 2b set**. Add a sync check that each of the 8
      still has exactly one site — the set is keyed by slot NAME, and all 8
      having one class each is luck, not design. That is what made
      `performed_by` (11 sites) so damaging.
- [ ] Delete `EXCLUDE_HAS_A_TARGETS` so the 12 `Entity`-ranged edges are drawn
      as `own-fwd`. `src/test/containmentGraph.test.ts:102` asserts the rejected
      behavior and must be updated. Update the comment at
      `src/config/entityCategories.ts:56`, which names both sets.
- [ ] **Single inheritance route.** Replace `SKIP_SUBCLASS_EXPANSION` with one
      accessor taking a required `includeEntity` arg. Route
      `buildContainmentGraph` (`:239`, false), `LinkOverlay` (`:48,365,375`,
      false) and `RelationshipInfoBox` (`:68,85`, true) through it; delete the
      direct `EDGE_TYPES.INHERITANCE` filtering in those components.
      `getSubclasses` currently has zero callers.
- [ ] **Re-verify the cycle check.** The zero-non-self-cycles result predates the
      `Entity`-forward decision, and `Entity` with 12 live inbound edges is
      exactly the shape that could introduce cycles.
- [ ] Rename `VALUE_OBJECTS` → `single_value_owner_slots`; consider moving it to
      a LinkML overlay + add a sync check for pure-leaf drift.
- [ ] Keep `classifySlotEdgeExplained` and the legend's group-by-rule rendering.
- [ ] Association: both ends arrowed, slate dashed. `OwnershipGraphView.tsx`
      `:1095-1102` switches on `isOwn` today and becomes a three-way switch on
      the verdict. Update the module header comment (`:14-20`), which documents
      the old two-channel scheme, and the legend text.
- [ ] Delete the doc's Appendix once shipped.

This blocks nothing mechanically, but the diagram's largest structure
(Participant's 22-edge outbound fan) is produced by Rule 2, so **routing work
tuned against today's classification may be tuned against the wrong graph.**
Adding `Entity` as a node with a 12-edge convergence changes the layout too.

### 🛠️ READY TO IMPLEMENT — "Option A": slot display name vs slot id

**Promoted out of LATER 2026-08-24** after investigation. Independent of the
ownership classification work — can be done first, in parallel, or by a
different session. ~2-4 hours.

> **A and B fix two DIFFERENT bugs, on two DISJOINT sets of slots.**
>
> This is the fact that makes the ordering make sense, and it is easy to miss:
>
> - **A's 31 slots have CORRECT data.** `associated_participant` (9 classes),
>   `associated_visit` (8), `observations` (4), `value` (6), `category` (2),
>   `associated_person`, `observation_type`. Every one carries a qualified `id`
>   AND a correct `name` in `processed.json`; the per-class distinctions came
>   through the transform intact. They render wrong ONLY because
>   `Element.ts:845-847` discards `data.name`. This is a plain frontend bug that
>   would exist even if the transform were perfect.
> - **B's 13 slots have BROKEN data** — `focus`, `items`, `part_of`, etc. Their
>   declarations were collapsed and information destroyed.
>
> **A is not "fixing the display of the broken data."** It never touches B's
> slots. The two sets do not overlap.
>
> An earlier framing here said "A fixes the display, B fixes the data", which
> wrongly implies they are two halves of one fix. They are not:
>
> - **Qualified ids on screen** (`observations-ObservationSet`) — the DATA IS
>   CORRECT. `processed.json` carries both `id` and `name`; the UI renders the
>   wrong field. A is the complete fix.
> - **`focus` collapsed** — the DATA IS WRONG. There is ONE `focus` entry with
>   `multivalued: false`; the multivalued `ObservationSet` declaration was
>   destroyed in the transform. **A does nothing for this** — there is no second
>   field for the UI to render instead. Only B recovers it.
>
> A does not change `bdchm.processed.json` or `transform_schema.py`. The
> qualified ids stay in the data, and should — they are what `elementLookup`,
> `getClassesUsingSlot`, `subsetSection` and the CLASS_SLOT/SLOT_RANGE edge keys
> join on.
>
> **Why A first — one reason only, and it is not a principle.** B qualifies ~11
> more slots. Every slot B qualifies starts rendering as `focus-ObservationSet`
> the moment it appears, because the display bug is live. That is precisely the
> December failure: that build qualified ~109 slots, the screen filled with ids,
> and the branch was abandoned having fixed nothing. Doing A first means B's new
> ids display correctly as they land.
>
> B-first is defensible if you accept temporary ugliness; one branch containing
> both never shows an intermediate state at all. **What must not happen is
> B-without-A** — that is the December repeat.
>
> **And do not ship A alone.** It leaves `focus` collapsed and `items`/`part_of`
> drawing wrong edges, on a screen that now looks tidy — removing the visible
> symptom that anything is wrong. Worse than today.

#### The bug, as actually diagnosed

The Kitchen Sink attributes table and detail panels display **qualified slot
ids** — `observations-ObservationSet`, `associated_visit-ObservationSet` — where
the user should see `observations`, `associated_visit`. Verified live at HEAD by
running the real loader (not by reading code): `ObservationSet`'s attribute table
renders `[["observations-ObservationSet","Observation","Yes"], …]`.

**This is the December 15 2025 "Class-specific slot definitions" WIP, still
broken.** Its status line ("NOT WORKING - still shows wrong names in UI") is
accurate at HEAD, nine months on. See that section below for the original
attempt. Do not start a new investigation — it is fully diagnosed here.

**Root cause, one place:** `Element.ts:1186-1188` constructs
`new SlotElement(name, data)` where `name` is the **map key** — the qualified id
set at `dataLoader.ts:290`. `SlotElement`'s constructor (`:845-847`) assigns that
to `this.name` and **discards `data.name`**, so the bare name is never stored on
the element. `Element.ts:466` then renders `slot.name` into the Name column and
`Element.ts:940` into the panel titlebar.

The data is not at fault: `bdchm.processed.json` carries `id`,
`name` and `alias` side by side. The UI has the right value available and
renders the wrong field.

#### A second live defect, same root cause

`OwnershipGraphView.tsx:157-161` builds `entityNames` from **bare** names and
filters it against **qualified** `s.name`. A qualified entity-ranged slot
therefore renders **twice** — once connected, once as a phantom disconnected
scalar row. Live today on `observations-ObservationSet` and the
`value-QuestionnaireResponseValue*` family.

Related: `OwnershipGraphView.tsx:146-151` builds `schemaOrder` keys from
qualified names but looks them up with bare edge labels, so those slots lose
schema order and sort last. The `?? MAX_SAFE_INTEGER` fallback hides it.

#### Checklist

- [ ] `Element.ts:845-847` — stop discarding `data.name`. Keep `this.id` = map
      key (qualified) for all lookups; add `this.displayName` = bare name.
- [ ] `Element.ts:466` (Name column) and `Element.ts:940` (titlebar) — render
      `displayName`.
- [ ] `OwnershipGraphView.tsx:147` and `:161` — join on the bare name.
- [ ] Add a test asserting **the attributes-table Name column equals the graph's
      edge label**. No such test exists, which is why this survived nine months.

#### Do not disturb

`containmentGraph.ts:128` looks up `OWNERSHIP_OVERRIDES` by **bare** `slotName`
(sourced from `Graph.ts:505`, which stays bare regardless of ids). This is
load-bearing for the ownership classification work. Lookups keyed on the
qualified id — `getClassesUsingSlot`, `subsetSection`, `elementLookup`,
CLASS_SLOT/SLOT_RANGE edge keys — must keep using the id.

Tests keyed on qualified ids (`getUsedByClasses`, `data-integrity`,
`idContextualization`) auto-adapt. Tests keyed on bare `slotName`
(`containmentGraph`, `ownershipLegend`, `ownershipSubgraph`,
`ownershipExpansion`) are unaffected.

### 🐞 OPEN — two WRONG EDGES in the shipped diagram (found 2026-08-24)

Higher severity than the display bug above: these are edges a viewer would act
on, and they are simply incorrect.

`scripts/transform_schema.py:280-291` detects when a slot is declared on several
classes with different definitions, prints a stderr warning, then `continue`s and
**keeps the first-seen definition regardless**. The `continue` is the bug. First
seen = dict iteration order, nothing meaningful.

Consequences in the DAG (both via wrong `range`, not cardinality):

- **`items`** — collapsed to `range: QuestionnaireItem`. The DAG draws
  `QuestionnaireResponse → QuestionnaireItem`; it should be
  `QuestionnaireResponse → QuestionnaireResponseItem`.
- **`part_of`** — collapsed to `range: ResearchStudy`. `QuestionnaireItem.part_of`
  should self-loop to `QuestionnaireItem`; instead it emits a spurious
  `QuestionnaireItem ↔ ResearchStudy` edge.

**Blast radius: 13 slots** disagree on a load-bearing field
(`multivalued`/`range`/`required`); 22 if description-only disagreements are
counted. But only the two above corrupt the graph — the rest are scalar/enum
ranged, or range on a `VALUE_OBJECT` where both branches give the same verdict
(`duration`, `quantity`), so only the displayed cardinality is wrong.

**Fix ("Option B", ~1 day incl. Option A, which is a prerequisite):** add a
conflict detector to `transform_schema.py` comparing **only** `range`,
`multivalued`, `required` — normalizing `None` ≡ `False`, ignoring `owner`,
`domain_of`, `alias`, `from_schema`, `description`. Also replace the useless
warning at `:285-287` with the same normalized comparison, so remaining warnings
mean something.

This will NOT reproduce the December explosion: that attempt compared nearly
every field and produced ~109 qualified ids out of 260 slots, which is what made
the display bug unmissable and got the branch abandoned. Load-bearing-only
comparison qualifies ~11 additional names.

**Unresolved, must be checked by running it:** whether plain-attribute conflicts
propagate qualified ids into subclasses the way `slot_usage` conflicts do
(gen-linkml materializes `observations-DimensionalObservationSet` for the
`slot_usage` case). If they do not, the three `*ObservationSet` subclasses keep
pointing at bare `focus` and stay wrong — this decides whether the fix covers 4
`focus` sites or 1.

#### The `focus` case specifically

`bdchm.yaml` declares `focus` three times with different cardinality:
`Document.focus` (line 862, `multivalued: false`), `ObservationSet.focus`
(line 1468, **`multivalued: true`**, `inlined_as_list: true`), `Observation.focus`
(line 1529, `multivalued: false`). All collapse to one `multivalued: false` entry
owned by `DimensionalObservation` — a class that is not one of the three, chosen
purely by iteration order. (`owner` is inert: `dataLoader.ts:153-154` ignores it.)

**`focus` does not currently corrupt the graph**, because its range `Entity` hits
`EXCLUDE_HAS_A_TARGETS` at `containmentGraph.ts:127` before `multivalued` is read
at `:130`. It is a panel-display bug today.

**But the ownership work changes that.** Removing `EXCLUDE_HAS_A_TARGETS` — which
is on that checklist — makes the 12 `Entity` edges live, at which point `focus`'s
wrong cardinality starts mattering. Sequence B after the classification lands.

#### Note on prior art

`find_conflicting_slot_definitions()` referred to in the December WIP below
**does not exist in the codebase**. It survives only in orphaned commit
`41313ed`, which is not an ancestor of HEAD. What exists today qualifies slots
**only** when a class carries a `slot_usage` block
(`transform_schema.py:222-228`, `:320-341`) — and none of the `focus`
declarations use `slot_usage`; they are plain `attributes`. That is the whole
reason the existing machinery never fired for it.

### 🎨 OPEN — own-fwd arrowheads are on the wrong end (formatting round)

Noticed 2026-08-24 from a screenshot (Participant / Visit / Condition). On
forward ownership edges the arrowhead renders at the **source**, not the target.
`Visit.associated_participant` draws its head pointing back into Participant.

**Deferred to the formatting round on purpose** — do not fix mid-classification.
The classification rewrite renames `own-flip` → `own-bkwd` and adds
`association` (which needs heads at *both* ends), so the marker selection at
`OwnershipGraphView.tsx:1091` (`flipped ? 'arrow-own-back' : 'arrow-own'`) is
being rewritten anyway. Fixing it twice wastes the work.

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

### ✅ DONE — the comparison harness (2026-08-21)

"example cases" in the header opens a two-tab pane.

**Cases tab** — 20 named selections in four groups (`src/explore/exampleCases.ts`),
each with a note saying what to look at. Clicking one applies it to app state
IN PLACE, deliberately not as a navigation: a reload would drop the merge mode
(localStorage, read once at mount), which is the thing being compared.

**Ownership legend tab** — every class-ranged slot in the schema grouped by the
rule that classified it, plus the convergence/divergence rankings. Derived live
from `classifySlotEdgeExplained` (new; `classifySlotEdge` now delegates to it),
so it cannot drift from what is drawn — which matters because
`OWNERSHIP_OVERRIDES`/`VALUE_OBJECTS` are hand-curated and rot on every schema
sync. A test asserts the legend's pairs equal the graph's actual edges.

**The legend immediately earned its keep.** The case set had been built off the
convergence ranking, which hides FK hubs because flipped edges reverse
direction. The listing showed 43 pairs in one `own-flip / fk-inversion` group,
which is how these turned up:

- **Participant fans OUT to 22 targets (21 flipped)** — larger than any inbound
  convergence, including Quantity's 19.
- **Visit fans out to 19**, Organization to 11, both almost entirely flipped.
- Flipped edges keep their attribute-row anchor and **must not merge**, so
  these are precisely the fans the merge code never touches, and therefore the
  ones nothing has ever been tuned against.

Real numbers now on record (slot-edges / distinct classes): converging —
Quantity 19/16, TimePoint 16/8, BodySite 6/6, Context 6/6. Diverging —
Participant 22, Visit 19, Organization 11, Specimen 8.

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

### ▶️ OPEN — connections are invisible until attributes are expanded

Siggie, 2026-08-21, with screenshots:

- Selecting **Participant** alone shows a box with no indication that 22 classes
  connect to it (21 flipped). The connections exist; nothing on the node hints
  at them.
- **Specimen** likewise gives no indication of its connections without expanding
  attributes.

There is an existing owners strip (`ownersStripHFor`, shown for classes with >5
hidden owners — Quantity, TimePoint, BodySite, Context) which is the obvious
mechanism to extend, but it currently covers only inbound owners and only above
a threshold. **Options were drafted and NOT chosen — Siggie dismissed the
question; do not pick one unilaterally.**

Note this interacts with the rethink above: what counts as a connection worth
advertising depends on what ownership means.

### ▶️ OPEN — example-cases pane needs restructuring

Siggie, 2026-08-21, on the pane built this session:

1. **Reuse the DetailDrawer panel** rather than the new floating box, for
   consistency. (First thought was draggable/resizable; Siggie revised to
   "just use the same panel as the details drawer".)
2. **Un-nest the legend from cases.** The **Ownership legend is meant to be
   permanent**; example cases serve a different purpose and may not be. Using
   the legend to find routing cases was a *temporary* use, not its reason to
   exist. They should not be tabs of one pane.
3. **BIGGEST FANS belongs with example cases**, not the legend — it serves the
   case-finding purpose and *"may be redundant with those -- more on those
   later."* (Siggie has more to say about the cases; wait for it.)
4. **fk-inversion text is too verbose.** Siggie's suggested wording:
   *'Ownership arrows can go "backwards" when a single-valued ENTITY (A)
   attribute points at another ENTITY (B). We can interpret this as A belongs
   to B."* — but see the rethink doc: the rule itself may not survive.

Still owed from upcoming-thoughts #1: toolbar buttons, colours, dashed edges.

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
3. bring dag-browser-widget into Explorer 
   - change inheritance rail color to entity/inheritance/blue and ownnership
     color to amber
   - try populating it with the whole graph, all collapsed to start
   - try including categories as top layer (expanded) -- hmm...inheritance
     pairs should all fit within categories i think, but not ownership; so,
     with whole graph populated, a lot more duplicates will appear, across 
     categories
   - the idea is that, unlike in Focus (which needed changing anyway), there
     wouldn't be one pane for selection and another for dag-browser. everything
     becomes accessible through dag-browser including some kind of selection
     affordance

-

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

### ⚠️ Un-settled: the fan is visible

`ENTITY_FAN_GAP = 4` (`OwnershipGraphView.tsx:222`) was documented as "a routing
device, not meant to be seen" and marked settled. **Siggie pointed out that 4px
is plainly visible** — it renders as the staircase of nested arcs sweeping into
the arrowhead. The settled status rested on a false premise.

Two knobs, pulling opposite ways: a smaller gap (1–2px) nests less but risks
ELK collapsing the lanes back into overlapping runs (the bug the fan fixed);
a longer merge distance cuts before the arcs splay. Siggie has the code map
and may experiment. `ARROW_GAP` is currently **0** in the working tree —
Siggie's experiment, deliberately uncommitted.

### 🧹 Temporary scaffolding still in place

- **Four merge-mode buttons** (`⋙ ⋙⋙ ⌙ ≡`). Siggie picked **`bend`** (the ⌙,
  "merge at last corner") after seeing all four. Not yet hardcoded — the
  diagonal work may still want the comparison.
- **"example cases" pane.** The Cases tab is scaffolding for the routing work.
  The Ownership legend tab is NOT — it is upcoming-thoughts #1 delivered, and
  should stay. It still needs the rest of #1: toolbar buttons, colours, dashed
  edges.
- **`?dbg=1` routing log** — keep until the diagonal is understood.

### ✅ Answered this session

- **Which classes show owner chips** (>5 direct owners, per `classifySlotEdge`,
  which is what an earlier raw-slot count got wrong): **Quantity 16, TimePoint
  9, BodySite 6, Context 6.** Below the cap: 4 owners — the observation family
  and Substance; 3 — File, Specimen, QuestionnaireItem, the three
  `*ObservationSet`s; 2 — twelve classes, mostly Participant+Visit pairs; 1 —
  eleven, including TimePeriod (owner: Visit); 0 — thirteen, including
  Organization, Person, Assay, Document. `Participant`/`Visit`/`Organization`
  own heavily and are owned by almost nothing.
- **Curved edges: removed.** `smoothPath` survives in graph-core unused.
- **Stroke widths**: ownership 0.8 / 1.6 hover, references 0.67× those.

### ✅ Settled this session — don't redo

- **Terminology.** An edge joins **an attribute on one class** to **another
  class as a whole**. Call these the **attribute end** and the **entity end**.
  The old code words *host* / *storage side* (= attribute end) and *free* /
  *peer* (= entity end) confused Siggie and are being retired. In LR the
  attribute end is on the **right** border at its slot's row, the entity end on
  the **left** border of the target — swapped when ownership is flipped.
- **Only the attribute end names a slot.** The entity end never did; the peer
  class has no corresponding row. An earlier fan spilled below the header so
  arrows landed beside unrelated attribute rows and implied otherwise. The three
  stale "the row an edge lands on names the slot" claims were **deleted
  2026-08-19** and rewritten in attribute-end / entity-end terms.
- **The fan stays, but is NO LONGER "settled".** 4px, centred on the header, so
  ELK gives each approach its own lane. It was justified as invisible; Siggie
  observed on 2026-08-21 that it plainly is not (see the handoff). Reverting
  to a single shared port still brings back the bug where six owners of `BodySite`
  rendered as one edge between two unrelated owners.

### 🔁 Loops: answered with data (2026-08-19)

Probed the live schema (throwaway test, not kept). Ownership alone (`has-a`,
133 edges) is **acyclic apart from 5 self-loops** — `TimePoint.index_time_point`,
`File.derived_from`, `Specimen.parent_specimen`, `ResearchStudy.part_of`,
`SpecimenContainer.parent_container`. The layered DAG's assumption holds.

**One genuine multi-node cycle exists**, but only once reference edges join in:
`Specimen --storage_activity--> SpecimenStorageActivity --container-->
SpecimenContainer --contained_in (has-a)--> Specimen`. Two refs plus one
ownership edge. Siggie's call: **self-loop markers only; document this cycle as
known and deliberately unhandled** — a self-loop badge won't cover it, and a
3-node cycle drawn across layers is what a user would actually notice as odd.

(A third apparent cycle, `File → ImagingFile --derived_from--> File`, is an
artifact of mixing is-a into the traversal — `ImagingFile` inherits
`derived_from`. Not real; noted so nobody "fixes" it.)

### ⚠️ Tooling gotcha that cost this session real time

`grep` in the non-interactive shell is shadowed by a **shell function** (from
Claude Code's own setup, not Siggie's dotfiles — it is invisible in an
interactive shell, where `which grep` shows only a normal `--color=auto` alias).
It execs the `claude` binary as `ugrep` with `-I --ignore-files`; **this ugrep
build rejects both flags and exits non-zero printing nothing**, which is
indistinguishable from "no matches found".

**Use `command grep`.** Several searches this session returned false negatives,
including one that led to a wrong claim to Siggie about colours not being
config-driven. Also note zsh eats unquoted `--include=*.ts` — quote the globs.

### 🎨 Amber collision — decided, not yet built

Siggie: **keep amber = ownership**; move **variable counts** to brown/maroon.
Wants colours driven by config shared between Explore and the previous views
"if true, otherwise make this an upcoming task" — **it's the otherwise branch.**
`appConfig.ts` has an `elementTypes[].color` config, but it is keyed by element
*type* (class=blue, enum=purple…) and has no notion of "amber = ownership". All
amber is hardcoded Tailwind:

- **variable counts** (→ brown/maroon): `SelectionTable.tsx:71,113`,
  `EntityTable.tsx:79,161`, `SlotDrilldown.tsx:111` (Variables tab)
- **ownership** (stays amber): `OwnershipGraphView.tsx`
- **pin star** — a *third* amber meaning, `EntityTable.tsx:138,140`. Surfaced
  after Siggie's decision, so it is undecided; fold it into the semantic layer
  but **don't recolour it without asking.**

Plan: add a semantic colour layer to `appConfig.ts` (`ownership` / `variables` /
`pinned`) and point both apps at it, rather than sprinkling maroon in 5 places.

### 📋 Rest of the round Siggie listed (not started)

Ordered as given: edge improvements (**cardinality markers at endpoints** +
**label/title text on links**, re-verbed for flipped — *not* curved retuning),
self-loop markers, **drawer section headers** (10px gray uppercase, too
recessive), **cross-view state preservation** (Explore already URL-encodes
state; mostly a matter of nav links carrying the query string), amber, and then
a **real docs cleanup** — leave only current state / actual plans, moving
previous-view plans to `docs/old` or `docs/previous_views` linked from the
appropriate places. Siggie also wants to **discuss the remaining Known-imperfect
items** (curved edges, chip-strip height estimate, expand-on-demand
discoverability, no-expand-downward) *after* the buildable work.

### 📌 Older context (pre-edge session)

**is-a side-stacks** (EXPLORE_VIZ.md step 3 remainder) were the previously
agreed next piece, deferred behind the edge work. Inheritance renders as header
chips ⊳/▷ and little else; the spec wants an expandable subclass stack on the
parent node. **Note every class is `is_a: Entity`**, so naive rendering adds
noise.

- **Step 5 polish** — selection-change animation, self-loop badges.

### 🐛 Fixed this session (2026-08-19)

- **Crash on uncheck.** Select Person + Participant, uncheck Participant →
  `Routed edge edge-80 missing from view model`. ELK layout is async while the
  view model is a sync `useMemo`, so React rendered fresh nodes against the
  previous spec's routed edges. `useGraphLayout` now stores each result with
  the spec it came from and returns null unless they match. The throw was kept
  (it is a real invariant) and made unreachable instead of softened.
- **Pan did not work at all.** `useZoomPan` relied entirely on native
  scrollbars, but fit-to-view clamps content to fit, leaving nothing to
  scroll. Added drag-to-pan; nodes/toolbar carry `data-pan-ignore`.
- **Fit-to-view is now the default** until the user takes manual zoom control.
- **Title-click reset** — parity with the previous app; clears selection,
  expansions, drawer, and re-opens the table.
- **Path-to-root blowup.** Selecting one class could draw most of the schema
  (`Quantity`: 29 of 53 classes, 87 edges). Now one-hop direct owners, capped
  at 8; transitive is opt-in via `⇱ roots` / `?roots=1`. Full reasoning in
  EXPLORE_VIZ.md §6 — including the intermediate chips-only design that was
  also wrong.
- **Phantom edge** between Condition and MeasurementObservation: a routing
  artifact, not missing data. All incoming edges shared one `::hdr:in` port;
  each edge now gets its own fanned port.
- **Empty node box.** `BodySite` (all-scalar attributes) rendered as an empty
  box whose only content was a "+3 more attributes" collapser. Auto-expands now.
- **`Activity` misclassification** — adjudicated and merged; see
  OWNERSHIP_CLASSIFICATION.md.

### ⚠️ Known-imperfect, not yet addressed

- **Chip-strip height is estimated** from label lengths (ELK needs a height
  before the browser wraps). Rounded up, so a wide set leaves blank px rather
  than clipping — but the estimate could be wrong for unusual names.
- **Amber collision**: variable counts, ownership dots, AND owner chips are all
  amber. Flagged by Siggie; unresolved. Owner chips arguably *should* be amber
  (they are ownership), which makes the count badges the thing to move.
- **Drawer section headers** ("Referenced by", "Attributes") are 10px gray
  uppercase — too recessive to show panel structure.
- **Cross-view state preservation** — navigating to the previous app and back
  loses context. Explore already URL-encodes its state, so this is mostly a
  matter of nav links carrying the query string.
- **Expand-on-demand discoverability** — a dimmed row gives no signal that it
  is clickable, and expandable rows often hide inside "+N more attributes".
- **No expand downward** — chips and rows only reach owners/ranges, never
  "what does this class own".

### ⚖️ Needs Siggie's decision

- **Owner cap is 5** (`DEFAULT_OWNER_CAP`, lowered from 8 on 2026-08-19). Four
  classes exceed it and show chips: Quantity 16, TimePoint 9, BodySite 6,
  Context 6. Still never explicitly ratified.
- **Chips are one-way** — a chip adds an owner and vanishes; there is no way to
  remove one from the strip. Siggie raised this and had no preference among the
  options offered (persistent toggling chips / removal via the node's ×). Open.
- **Category placement of `Context` / `Activity`** — parked in `observation`
  beside `Quantity`; trivial to move.
- **EXPLORE_VIZ.md language** — Siggie: "a lot of the language doesn't make
  sense to me." Terms like sunk layers, storage direction, own-flip are doing
  real work but were written for their author. A rewrite pass is wanted, **as a
  conversation, not a solo edit.**

### 📌 Also worth knowing

- **Node version**: the repo needs Node ≥18 (Vite 7). Siggie's interactive
  shell has v24 via nvm, but a non-interactive shell falls back to a system
  v16, where `npx vitest` dies at startup with
  `node:fs/promises does not provide an export named 'constants'`. Export the
  nvm bin path first. No `.nvmrc` yet — worth adding.
- **Use `npm run typecheck`** (`tsc -b --noEmit`), not bare `tsc --noEmit`;
  the latter is less strict and has hidden dozens of build-breaking errors
  before.
- **Playwright is still not installed**; the spec's probe rig was never built.
  Everything above the data layer is jsdom-tested only. Both the pan bug and
  the uncheck crash were invisible to the suite and found by looking at the page.
- The upstream variables sheet gained columns (`var_name`, `status`,
  `Ontology CURIE`, `OMOP Concept ID`, `Deprecated Codes`); loaded but **not
  yet surfaced in the UI**.
- `npm run lint` reports 22 pre-existing problems (test files,
  `popoutWindow.ts`), untouched and unrelated.

---

## 🧭 Current round (post-2026-06-11 feedback) — TOP PRIORITY

Team-facing plan: [STAKEHOLDER_QUESTIONS.md](../temp-but-share-for-now/STAKEHOLDER_QUESTIONS.md).
Read that first — it holds the audience reframing and the **open questions for the
team** (view architecture, audience, links, terminology). This section is the
implementation backlog for the four new priorities. Items lower in this file are
re-tagged **[FEEDS]** (supports this round), **[LATER]**, or **[PARKED]/[OBSOLETE]**.

> **Audience reframing:** much of the real audience is **researchers** — data users
> ("what's in here / what does this mean?") and study designers pre-harmonizing their
> own study with BDCHM ("where would my variable fit?") — not only modelers/LinkML
> people. The four priorities below bend toward them.

**Dependency note:** once the Variable Library is live, the variable-drilldown portion
of the Explorer can be simplified — no deep variable views needed inside it.

### Priority 1 — Configurable terminology (was subtask 8)

Default to general-audience terms; LinkML term on demand.
- *property* (slot), *value set* / *permissible values* (enum), *property type*
  (range), *entity* (class).
- A vocabulary **config toggle**: general user vs. LinkML/modeler (possibly a
  data-modeler middle setting). LinkML equivalents in tooltips + links to LinkML docs.
- Status: **partially built.** The vocabulary is centralized as code config in
  `src/config/appConfig.ts` (`VOCAB` per audience, `ACTIVE_VOCAB`, `defaultVocab`);
  components read it via `DataService.getConceptLabel()` / `getTypeLabel()` /
  `getSectionLabel()`, and badge abbreviations are vocab-driven. The `researcher`
  vocab is active; a `modeler` vocab is filled in but INACTIVE (`defaultVocab =
  'researcher'`), with unresolved-term notes in appConfig.ts. **Remaining:** the
  in-app UI **toggle** to switch vocab at runtime (lowest priority — the machinery
  is the hook, no UI yet), and LinkML tooltips/links.

### Priority 2 + 3 — NOW: subgraph-viz SPA (supersedes the Focus direction)

**Current phase (2026-07-13):** the subset-visualization goal is being rebuilt
as a **new SPA** (same repo, new Vite entry): Explorer-style selection table →
layered ownership DAG with expand-on-demand, renderer adapted from
icd11-playground's NodeLinkView. Full design + build order:
**[EXPLORE_VIZ.md](EXPLORE_VIZ.md)** (step 1 is the ownership-classification
review). Terminology going forward: say **ownership**, not "containment."

The Focus view below stays in place for stakeholder comparison; its remaining
items are re-tagged **[LATER]**.

#### Focus view (compact selector + subset visualization) — [LATER]

Priorities 2 ("compact Kitchen Sink + multi-select") and 3 ("subset
visualization") turned out to be **one feature** and are now built as a third
view, **Focus**. Full design/semantics: **[FOCUS_VIEW.md](FOCUS_VIEW.md)**.

Focus = the Kitchen Sink with minimal differences: category-grouped multi-select
left panel, a containment digraph widget (`dag-browser-widget`) below it, and
middle/right panels scoped to the selected entities. Selection drives everything.

**Shipped:**
- ✅ Containment foundation (`c76fdcf`): `src/models/containmentGraph.ts`
  (FK-inversion heuristic, ported from `scripts/extract_containment_tree.py`),
  `DataService.getContainmentGraph()` (live-derived `{nodes,edges}`),
  `getCategoryGroups()`, 10 property-based tests.
- ✅ Focus scaffold + category multi-select selector + containment widget +
  panel-scroll regression fix (`d9f4cc8`).

**Shipped (this round):**
- ✅ **Middle/right now reuse the Kitchen Sink rendering path, scoped to the
  subset.** Deleted the bespoke `getFocusPanelSections`/`getClassSummary`-based
  item building; middle = the `slot` section, right = the `class`/`enum`/`type`
  (Ent/PVS/DT) sections, each a flat list filtered to the selected classes'
  slots / range targets and rendered via the elements' own `getSectionItemData`.
  Filtering flattens via `getAllElements()` (deep subclasses included) with
  subset-accurate section counts. New DataService helpers `getFocusSubsetSections`
  + `subsetTargets`/`subsetSection` (graph `CLASS_SLOT`/`CLASS_RANGE` edges).
  Select/unselect no longer leaks into middle/right (inert click handlers until
  floating boxes land). **Deferred:** per-entity nesting in the right panel —
  range rows from different selected classes intermix within a section for now.

**Remaining (ordered) — all [LATER], superseded by EXPLORE_VIZ.md:**
1. **Per-entity grouping/nesting in the right panel** (deferred from the reuse
   work above) — group range rows under the selected entity they belong to.
   Revisit how to implement once the flat version has been demoed.
2. ~~**Restore inter-panel gutters** + **add `<LinkOverlay>`** to FocusView~~
   Shipped 2026-07-13 (gutters + working links; the duplicate-id LinkOverlay
   fixes benefit Kitchen Sink too). Known-imperfect: flex/gutter model, link
   anchors under the widget, hover highlighting unwired — left as-is.
3. **Extract `useFloatingBoxes` hook** from LayoutManager; consume in both
   LayoutManager (no behavior change) and FocusView → working detail/relationship
   boxes in Focus. Then wire the now-inert middle/right click handlers to it.
4. **Widget select/unselect** shared bidirectionally with the left selector.
5. **Widget "show all entities"** option (full graph, not just the subset).
6. **Resizable panels** (draggable edges; Kitchen Sink uses flex gutters — likely
   `react-resizable-panels`).
7. **Floating Cytoscape diagram** (summonable node-link view of the subset;
   promote `public/has-a-mockup.html`).
8. **URL persistence** of `selectedClassIds` (`?focus=...`).

Then: retire stale mockups (`has-a-mockup.html`, `containment-graph.json`,
`has-a-graph.json`, `extract_has_a_graph.py`) once the in-app diagram replaces
them — see [PARKED] below.

### Priority 4 — Help mode (port from icd11-playground)

DOM-driven contextual help: `data-help-id` attributes + markdown content file +
`?`-toggled mode. Source in `../icd11-playground/web/src`: `hooks/useHelpMode.ts`,
`components/HelpPopover.tsx`, `utils/parseHelpContent.ts`, `assets/help-content.md`.
- Status: **not started.** Low-pri open question: extract as a shared package?
  Default: copy in now, extract later.

### Supporting / housekeeping for the release

- **URL state encoding** — deep-linking + working browser back button. Current app
  encodes some state but the back button is reportedly buggy; investigate root cause.
  States to encode: expanded entity, drilldown tab (slots / vars), open inline card.
- **Release checklist** for 2026-07-30 (QA, deploy path, feedback loop).

### Done (shipped — kept for reference)

- ✅ Entity Explorer as default view (progressive disclosure).
- ✅ Categorized entity list (`entityCategories.ts`) + subclass indentation.
- ✅ Default pinning (Demography, Condition, MeasurementObservation) + localStorage.
- ✅ Inline slot drilldown (Slots/Variables tabs, inherited/overridden tags, range
  badges, recursive nested drilldown).
- ✅ Inline enum detail card (permissible values, "used by"). **[FEEDS]** still TODO:
  CURIE *labels + definitions*, not just identifiers.
- ✅ Inline class detail card (merged into SlotDrilldown).

---

## 🅿️ PARKED — Containment heuristic de-fragility (revisit after demo)

**No longer parked: the containment graph itself.** The FK-inversion heuristic is
ported to TypeScript and live (`src/models/containmentGraph.ts`,
`DataService.getContainmentGraph()`), driving the Focus containment widget. The
Python mockups/scripts are now the *legacy* version; the in-app graph derives live
from the loaded model so it can't drift.

**Still parked — making the heuristic less fragile.** The override sets
(`VALUE_OBJECTS`, `NO_FLIP_SLOTS`, `EXCLUDE_HAS_A_TARGETS`, `SKIP_SUBCLASS_EXPANSION`)
are hand-curated and rot silently when the schema changes. Planned (after the demo
proves value): per-slot LinkML `annotations: { containment_direction: contains |
contained_by | ? }`, auto-generated from the current heuristic then human-reviewed
(Brian only touches new/ambiguous), plus a CI check that fails on un-annotated new
single-valued entity slots. `owns`/`owned_by` floated as broader vocab for the
`performed_by` family. See [FOCUS_VIEW.md](FOCUS_VIEW.md#containment-digraph-semantics-settled-enough-to-demo).

**Retire once the in-app Cytoscape diagram lands:** `public/has-a-mockup.html`,
`public/containment-graph.json`, `public/has-a-graph.json`, and the now-redundant
`scripts/extract_has_a_graph.py`. (`containment-tree-mockup.html` was superseded by
the `dag-browser-widget`.)

---

## 📋 Secondary backlog (supports the current round; not itself a priority)

> The ordered priorities for this round are in "Current round" up top. The items
> here are smaller polish/enablement tasks — tagged **[FEEDS]** where they directly
> support a current-round priority.

### Render markdown in schema fields  **[FEEDS]**
- e.g., `UnitOfMeasurementEnum.description` contains markdown but is rendered as plain
  text in detail views.
- Feeds the inline **enum detail card** (which still needs CURIE labels/definitions —
  see Done list up top).

### Slot names in class detail Slots table should be linked  **[FEEDS]**
- Should behave like other element refs (hover + click navigation).
- Feeds the inline **class detail card**.

### Incorporate Unused Schema Fields into UI
- Enum inheritance and other fields
    - LinkML enums use `inherits` field (not `is_a` like classes)
    - Currently dataLoader/Element ignores enum `inherits` and other fields
    - Need to audit EnumInput for all fields and surface in UI
- Check console for "Unexpected fields" warnings. Currently seeing:
  ```
    dataLoader.ts:97 Unexpected fields in processed JSON (not yet used in UI):
        dataLoader.ts:100   SlotInput: alias, comments, designates_type, domain_of, examples, from_schema, global, inlined, inlined_as_list, overrides, owner, unit, values_from
        dataLoader.ts:100   EnumInput: comments, include, inherits, parent, reachable_from, see_also
        dataLoader.ts:100   TypeInput: exact_mappings_urls
        dataLoader.ts:100   ClassInput: class_url
  ```
- Add to UI or document why ignored
- For each field:
  - Show me some examples and give me stats (e.g., x of y SlotInputs have alias. example1, example 2...)
  - I decide if we add / ignore / deal with later
  - For add and ignore, add to expected fields; make clear which are ignored
  - For add, document plans for incorporating 
#### Unused Schema Fields Workspace

check claude's work:

      SlotInput fields:
      - ✅ comments - shown under description as "Comments:"
      - ✅ examples - shown under description as "Examples: value1, value2..."
      - ✅ inlined / inlinedAsList - shown as properties when true
      - ✅ domain_of / owner - investigated and marked as IGNORE (domain_of misses inherited slots)

      EnumInput fields:
      - ✅ comments - shown under description
      - ✅ inherits - new section "Inherits Values From" with clickable enum links
      - ✅ reachable_from - new section "Reachable From (Dynamic Values)" with source ontology, nodes, etc.

      Still TODO (marked as LATER):
      - unit - ask team
      - include, parent, see_also for enums

      Files changed:
      - src/models/SchemaTypes.ts - added new field types
      - src/input_types.ts - added input field definitions
      - src/utils/dataLoader.ts - transform functions
      - src/models/Element.ts - SlotElement and EnumElement classes
      - docs/TASKS.md - updated workspace with completion status
##### SlotInput (180 total slots)

 | Field              | Count          | Decision                                                                     | Notes                                                                                                           |
 |--------------------|----------------|------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------|
 | `alias`            | 181/181 (100%) | **IGNORE** - all same as name (verified)                                      | Same as name (ex: `id`→`id`, `species`→`species`)                                                               |
 | `comments`         | 25/180 (14%)   | ✅ **DONE** - shown under description                                         | Array of strings. ex: `days_supply`="The field should be left empty if..."                                      |
 | `designates_type`  | 1/180 (0.6%)   | **IGNORE** - note to revisit if generalizing app                             | Only `type` slot has this (=true)                                                                               |
 | `domain_of`        | 180/180 (100%) | **IGNORE** - incomplete (misses inherited slots), keep computed "Used By"    | Array of class names that use this slot. ex: `id`→`['Entity', 'Person', ...]`                                   |
 | `examples`         | 16/180 (9%)    | ✅ **DONE** - shown under description                                         | Array of {value} objects. ex: `specimen_type`=[{value:'Fresh Specimen'},...]                                    |
 | `from_schema`      | 180/180 (100%) | **IGNORE** - always same value                                               | Always `https://w3id.org/bdchm` - schema URL                                                                    |
 | `global`           | 7/181 (4%)     | **ALREADY USED** - just missing from EXPECTED_SLOT_FIELDS                     | Boolean. Slots: id, identity, associated_participant, entries, derived_product, value, member_of_research_study |
 | `inlined`          | 1/180 (0.6%)   | ✅ **DONE** - shown as property when true                                     | Only `entries` slot (=true)                                                                                     |
 | `inlined_as_list`  | 4/180 (2%)     | ✅ **DONE** - shown as property when true                                     | parent_specimen, derived_product, duration, +1                                                                  |
 | `overrides`        | 10/181 (6%)    | **ALREADY USED** - just missing from EXPECTED_SLOT_FIELDS                     | String (slot name being overridden). ex: `value`→`value` (10 different `value` slots)                           |
 | `owner`            | 180/180 (100%) | **IGNORE** - arbitrary (first domain_of class), not useful                   | Class that defines this slot. ex: `id`→`Entity`, `species`→`Person`                                             |
 | `unit`             | 12/180 (7%)    | **LATER** - need to ask team about it                                        | Object with ucum_code. ex: `age_at_death`={ucum_code:'d'}                                                       |
 | `values_from`      | 0/181 (0%)     | **GONE** in new data - removed from schema                                    | Was: Array of enum references                                                                                   |

- **inlined/inlined_as_list**: [LinkML docs](https://linkml.io/linkml/schemas/inlining.html) - info for devs writing ingestion code
- **domain_of**: Investigated - misses inherited slots (e.g., CauseOfDeath←Entity.id) and overrides. Computed "Used By Classes" is more complete.
- **owner**: Just first domain_of class - not meaningful. Already ignored in EXPECTED_SLOT_FIELDS.
  

##### EnumInput (41 total enums)

 | Field            | Count      | Decision                                                                                                                              | Notes                                                                                                          |
 |------------------|------------|---------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------|
 | `comments`       | 3/41 (7%)  | ✅ **DONE** - shown under description                                                                                                  | Array. ex: DrugExposureProvenanceEnum="Taken from OMOP Drug Type values..."                                    |
 | `include`        | 1/41 (2%)  | **LATER** - complex structure for including other enum values                                                                         | Complex structure for including other enum values                                                              |
 | `inherits`       | 3/41 (7%)  | ✅ **DONE** - shown as "Inherits Values From" section with clickable links                                                             | Array of parent enum names. ex: ConditionConceptEnum→['MondoHumanDiseaseEnum', 'HpoPhenotypicAbnormalityEnum'] |
 | `parent`         | 1/41 (2%)  | **LATER** - single parent (different from inherits)                                                                                   | Single parent string. ex: HistoricalStatusEnum→StatusEnum                                                      |
 | `reachable_from` | 9/41 (22%) | ✅ **DONE** - shown as "Reachable From (Dynamic Values)" section                                                                       | Complex: {source_ontology, include_self, source_nodes, ...}. Defines dynamic enum values from ontology         |
 | `see_also`       | 2/41 (5%)  | **LATER** - array of reference URLs                                                                                                   | Array of URLs. ex: DrugExposureConceptEnum→['https://bioregistry.io/registry/rxnorm', ...]                     |

##### TypeInput (7 total types)

 | Field                 | Count     | Decision                        | Notes                                                  |
 |-----------------------|-----------|---------------------------------|--------------------------------------------------------|
 | `exact_mappings_urls` | 5/7 (71%) | **ALREADY USED** - expanded from `exact_mappings` CURIEs, just missing from expected | Array of URLs. ex: `string`→['http://schema.org/Text'] |

##### ClassInput (51 total classes)

 | Field       | Count     | Decision                                                                                     | Notes                                             |
 |-------------|-----------|----------------------------------------------------------------------------------------------|---------------------------------------------------|
 | `class_url` | 1/51 (2%) | **Found**: comes from `class_uri: schema:Thing` in YAML, expanded by transform_schema | URL string. Only Entity→'http://schema.org/Thing' |

---
### ⚠️ WIP: Class-specific slot definitions (Dec 15, 2025) - INCOMPLETE

**Problem reported**: DrugExposure's `quantity` slot showed Procedure's description ("The quantity of procedures ordered or administered.") instead of the drug-specific description.

**Root cause**: When multiple classes define the same slot name with different descriptions (e.g., Procedure, DrugExposure, DeviceExposure all define `quantity`), transform_schema.py was using the first definition and ignoring the rest.

**Instructions given**:
1. User showed screenshot of wrong description
2. Asked to fix so DrugExposure shows its own quantity description
3. Suggested adding `name` field to slot references in bdchm.processed.json to simplify UI code

**Changes attempted** (NOT WORKING - still shows wrong names in UI):
1. `scripts/transform_schema.py`:
   - Added `find_conflicting_slot_definitions()` to detect slots with different definitions across classes
   - Modified `transform_classes()` to create class-specific slot IDs (e.g., `quantity-DrugExposure`)
   - Modified `transform_slots()` to create class-specific slot instances
   - Added `name` field to slot references when ID differs from display name

2. `src/models/SchemaTypes.ts`:
   - Added `name?: string` to SlotReference interface

3. `src/models/Element.ts`:
   - Updated ClassElement.getDetailData() to use `slotRef.name || slot.name` for display

4. `src/components/DetailContent.tsx`:
   - Added `renderMarkdown()` function for table cell content
   - Updated `renderCell()` to render markdown in all string cells

5. `public/source_data/HM/bdchm.processed.json`:
   - Regenerated with class-specific slots

**Status**: UI still shows `quantity-DrugExposure` instead of `quantity`. The `slotRef.name` change is not being picked up. Needs debugging - possibly the dataLoader transform is not reading the `name` field from slot references.

**Second instance found 2026-08-21 — `focus` shows the wrong cardinality.** Same
root cause, different symptom: it's not just descriptions that collapse, it's
*properties that change the meaning of the edge.*

`focus` has no top-level slot definition. It is declared as an `attributes`
entry on three classes, and the other 8 sites inherit via `is_a`:

| declared on | multivalued | inherited by |
|---|---|---|
| `Document.focus` | No | — |
| `Observation.focus` | No | DimensionalObservation, MeasurementObservation, SdohObservation, SpecimenQualityObservation, SpecimenQuantityObservation |
| `ObservationSet.focus` | **Yes** (+ `inlined_as_list`) | DimensionalObservationSet, MeasurementObservationSet, SdohObservationSet |

The Kitchen Sink detail panel shows **one** `focus` element with
"Multivalued: No" and all 11 classes pooled under "Used By Entities (11)" — so
the 4 multivalued sites (ObservationSet + its 3 Set subclasses) are silently
misreported as single-valued.

Mechanism: `SlotElement.getUsedByClasses()` (`src/models/Element.ts`) calls
`getClassesUsingSlot(globalGraph, this.name)` — **keyed by slot name only**. The
rendering in `getDetailData()` is fine; it faithfully prints whatever
`this.multivalued` holds, which came from whichever declaration won ingestion.

Why this one matters more than the `quantity` description bug: cardinality is
the input to ownership classification (see
[OWNERSHIP_CLASSIFICATION.md](OWNERSHIP_CLASSIFICATION.md) — multivalued vs
single-valued decides edge direction). A viewer reading this panel would draw
the wrong conclusion about 4 edges.

Not a quick fix — needs attribute elements keyed by `class.slot`, or a
"varies by class" treatment in the Used By table. Both ripple through
everything that resolves attributes by name. **Left as a known bug 2026-08-21**
(Siggie: fix if super-easy, otherwise defer — it isn't).

---
### LinkOverlay fixes  **[LATER — gated on an open question]**
- Edge labels: show on hover; tooltip display needs improvement.
- **Gated on open question B** in [STAKEHOLDER_QUESTIONS.md](../temp-but-share-for-now/STAKEHOLDER_QUESTIONS.md)
  ("are the connecting links worth their screen real estate?"). Inline entity-summary
  cards + "Referenced by" lists may replace most of what links communicate; links may
  become an optional overlay / "Relationships" tab. Don't invest in link polish until
  this resolves.

---

## 📚 Larger Refactoring Tasks

### Abstract Tree Rendering System
- Extract tree rendering and expansion logic from Element
- Enables consistent tree UX across Elements panel and info boxes
- See [detailed plan](#abstract-tree) below

### Reduce Element subclass code
- Most behavior should move to graph queries
- Element classes become thinner wrappers around graph data
- **Blocked by**: Abstract Tree system
- See [detailed plan](#reduce-element-subclass-code-details) below

### Grouped Slots Panel  **[OBSOLETE]**
- Was: display slots grouped by Global + per-class sections, with inheritance origin.
- **Superseded** — the Explorer shipped; slot grouping now lives in the inline
  per-entity drilldown (inherited / defined-here / overridden tags). Remove unless a
  Kitchen-Sink-specific need resurfaces.

---

## 🔧 Medium Priority

### Overhaul Badge Display System  **[MOSTLY OBSOLETE]**
- Was: show multiple counts per element with clarifying labels/tooltips.
- The Explorer entity table shipped with separate Props / Cls / Enm / Typ / Vars
  columns, which serves most of this. Any remaining gap is just badge tooltips.

### Detail Panel Enhancements
- Show reachable_from info for enums  *(note: reachable_from already shown in enum
  detail card per the unused-fields workspace — confirm and close if done)*
- Show inheritance
- Slot order: Inherited slots at top

### ~~Change "attribute" to "slot" terminology~~  **[OBSOLETE — REVERSED]**
- ⚠️ This is now **backwards** relative to Priority 1 (configurable terminology),
  which moves *away* from "slot" toward general-audience "property." Do not act on
  this. The codebase-internal naming cleanup ("attribute" vs "slot") is a separate,
  low-value concern from the user-facing vocabulary.

### Condition/DrugExposure Variable Display
- Show message that these are handled as records, not specific variables

---

## 🔮 Low Priority / Future Ideas

### Search and Filter
- Search: Important for exploring large schemas
- Filtering: Grouping provides a lot already

### LayoutManager rename
- No longer about "whitespace monitoring" - it's now MainLayout/AppLayout
- Consider renaming to better reflect current purpose

### Animation library
- Smooth animations for various interactions

### Initial render performance
- Chrome warning: `requestAnimationFrame handler took 75ms`
- Likely from element tree or link overlay calculations on page load

### Viewport culling for links
- Don't show links when both endpoints off screen

### Responsive panel widths
- Currently fixed: MAX_PANEL_WIDTH=450px, EMPTY_PANEL_WIDTH=180px

### Relationship Info Box - Keyboard navigation

### Neighborhood Zoom + Feature Parity with Official Docs
- See archived REFACTOR_PLAN for full details

---

## 📝 Detailed Plans

<a id="abstract-tree"></a>
### Abstract Tree Rendering System - Details

**Goal**: Extract tree rendering and expansion logic from Element into reusable abstractions.

**Current state**:
- Element class has tree capabilities (parent, children, traverse, ancestorList)
- Expansion state managed by useExpansionState hook
- Tree rendering handled in each component

**Proposed abstraction**:
- Create parent class or mixin with tree capabilities
- Element becomes a child of this abstraction
- Info box data structures as tree nodes
- Shared rendering components/hooks

[sg] i'm not sure when this was written, but it's not how i was thinking about
     it. the abstract tree is for rendering -- it's in the UI so it probably
     shouldn't be (closely) tied to Element. need to discuss before implementing

**Key insight**: All presentation data should be tree-shaped.

**Methods to extract from Element:**
- `toRenderableItems()` - tree → flat list with expansion
- `toSectionItems()` - tree → SectionItemData list
- `getSectionItemData()` - single element → SectionItemData
- `ancestorList()` - walk up parent chain
- `traverse()` - depth-first traversal

<a id="reduce-element-subclass-code-details"></a>
### Reduce Element Subclass Code - Details

**Implementation Plan:**
1. Simplify `getDetailData()` via tree abstraction (BLOCKED: needs Abstract Tree)
2. Move tree methods to Abstract Tree system
3. Consolidate flat collections (Enum, Type, Slot)
4. Simplify Element subclass constructors
5. Graph as primary for relationship queries (partially done)
6. Fix remaining "DTO" terminology in codebase

**Target state:**
- Element subclasses: ~30-50 lines each
- Presentation logic: components layer
- Tree logic: Abstract Tree system
- Relationship queries: Graph module

---

## 🧹 Documentation & Technical Debt

### Implement devError() utility
- Throws in development, logs quietly in production
- Replace silent `return null` patterns

