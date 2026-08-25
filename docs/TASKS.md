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

### 📍 Option A→B is DONE (2026-08-24). Ownership classification is what remains.

**Option A→B shipped together**, uncommitted in the working tree. Reasoning,
rejected approaches and the corrected measurements: `WORKLOG.md`, entry
"2026-08-24 (later)". Verification: 229 tests / 20 files green, typecheck clean,
transform re-run byte-identical. Both new test files were confirmed to fail
against the pre-fix state.

Remaining work: **ownership classification**, immediately below. Files:
`containmentGraph.ts`, `Graph.ts`, `OwnershipGraphView.tsx`, components.

**Two inputs to that work changed under it — re-derive, don't reuse:**

- `Entity`-ranged slot *definitions* went 2 → 6, but the **12 class sites are
  unchanged**, so "expect a 12-edge convergence" still holds. However those 12
  now split **5 multivalued / 7 single-valued**; the collapse previously made
  every `focus` site look single-valued. Rules 1 and 2 classify them
  differently, so counts taken from the old data are stale.
- `bdchm.processed.json` now has 337 slot ids (was 220) — conflicting slots are
  qualified per class. **All three counts in the section below shift down by 3**
  (the wrong edges, now removed): 153 → **150** class-ranged sites, 141 → **138**
  emitted today, 151 → **150** target. Verified against the live data
  2026-08-24. The 12 `Entity` sites are unchanged.

### 🛑 OPEN — ownership classification: rules decided, implementation pending

**THIS IS THE CURRENT WORK.** Finish and implement this before returning to
routing/formatting.

> 🚧 **SETTLE THE `association` SET FIRST (raised 2026-08-25, Siggie).**
> Nothing else in this section is blocked, but this changes what gets built.
> Full statement in
> [OWNERSHIP_CLASSIFICATION.md](OWNERSHIP_CLASSIFICATION.md) § `association`.
>
> - The **six single-valued** members may not belong in the set: Rule 2 already
>   yields `own-bkwd`, which layers identically, so `association` changes only
>   their rendering. Verified against the data — none ranges on a
>   `VALUE_OBJECT`, so Exception 2a does not intercept, and dropping them from
>   the set sends all six to Rule 2 cleanly.
> - The **two multivalued** members (`related_document`, `container`) are the
>   real associations and should be marked explicitly as such — they exist to
>   defeat Rule 1.
>
> If that resolves as Siggie leans, the association set is **2 edges, not 8**,
> and the checklist item "replace `OWNERSHIP_OVERRIDES` with the 8-slot
> association set" becomes a 2-slot set. It also shrinks the open
> `own-bkwd`/`association` merge question, which is currently framed around
> moving 57 edges.

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
- [ ] Replace `OWNERSHIP_OVERRIDES` (15 entries) with the association set
      **plus the 2-slot Exception 2b set**. ⚠️ **The association set is 8 slots
      or 2 depending on the unsettled question above** — settle it first. Add a
      sync check that each member still has exactly one site: the set is keyed
      by slot NAME, and every member having one class each is luck, not design.
      That is what made `performed_by` (11 sites) so damaging.
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

### ✅ DONE — "Option A": slot display name vs slot id (2026-08-24)

The Dec 2025 "Class-specific slot definitions" WIP, fixed nine months on.
`SlotElement`'s constructor assigned the map key (the qualified id) to
`this.name` and discarded `data.name`, so every display path rendered
`observations-ObservationSet` where the user should read `observations`.

**Fix:** `displayName` is now a getter on the base `Element`, defaulting to
`name` and overridden in `SlotElement` to return the bare name. `name` stays the
qualified id — it is the map key and every lookup joins on it.

Display sites switched to `displayName`: attributes-table Name column, slot
panel titlebar, `getSectionItemData` (panel section rows), `getPanelTitle`, and
the two sort sites (`SlotCollection.fromData`, `DataService.subsetSection`) that
were ordering the visible list by qualified id.

`OwnershipGraphView.tsx` needed **no** edit — its `:147`/`:161` sites read
`getClassSummary().slots[].name`, which is the attributes-table cell, so fixing
that cell fixed both. The phantom duplicate rows and the lost schema order are
gone (verified by measurement, before and after).

Test: `src/test/slotDisplayName.test.ts` — confirmed to fail 3-of-7 against the
old behavior. It asserts the attributes-table Name column equals the graph's
edge label, the check whose absence let this ship for nine months.

#### Still true — do not disturb

`containmentGraph.ts:128` looks up `OWNERSHIP_OVERRIDES` by **bare** `slotName`
(from `Graph.ts`, which stays bare). Lookups keyed on the qualified id —
`getClassesUsingSlot`, `subsetSection`, `elementLookup`, CLASS_SLOT/SLOT_RANGE
edge keys — must keep using `name`. `subsetSection`'s `names.has(el.name)` is
the trap: `names` holds graph node ids, so a bare name there yields zero rows.

### ✅ DONE — two WRONG EDGES in the shipped diagram (2026-08-24)

`scripts/transform_schema.py` kept the first-seen definition when a slot was
declared on several classes with different definitions, and `continue`d past the
rest. First-seen was dict iteration order.

Both wrong edges are fixed and asserted:

- **`items`** — `QuestionnaireResponse → QuestionnaireResponseItem` (was
  `→ QuestionnaireItem`).
- **`part_of`** — `QuestionnaireItem` self-loops (was a spurious
  `QuestionnaireItem ↔ ResearchStudy`).

**Fix:** `resolve_slot_ids()` decides the id for every (class, attribute) site
once, comparing only `range`/`multivalued`/`required` with `None` ≡ `False`.
Divergent sites get `{slot}-{Class}`. Both `transform_slots` and
`transform_classes` consume that one decision — they previously decided
independently, and disagreement would leave a class referencing a slot id with
no entry.

**One rule, no exceptions:** if sites disagree, they are not the same slot, so
**every** site of that name is qualified and none keeps the bare id. A name
whose sites all agree keeps its bare id.

An earlier implementation let one variant keep the bare id, picked by a headcount
of sites, and needed two exceptions (globals outrank the count; ties qualify
everything) before it stopped producing nonsense. Siggie rejected it: a headcount
answers "which id is shortest", not "which slots are distinct", and needing
exceptions to stop a rule misbehaving means the rule is wrong. See `WORKLOG.md`.

**Measured, correcting the earlier estimate of "~11":** 46 slot names are
declared on >1 class; 18 conflict on a load-bearing field; 165 sites qualified;
220 → 337 slot ids. The larger id set is internal plumbing — `displayName`
renders the bare name, so qualified ids never reach the screen. **Verified: both
strategies draw a byte-identical graph** (all 86 edges), so the id scheme moves
nothing the user sees.

**Part 2 of `transform_slots` had to change with it.** It keyed global-slot
metadata on the bare id, which conflicted global slots no longer have — `id`
lost its schema.org `slot_uri` and three slots lost their `global` flag. It now
looks entries up by NAME and applies identity metadata (`global`, `slot_url`) to
every site, while the canonical `range`/`required`/`multivalued` restore stays
on the unqualified entry only — applying it to a qualified entry would overwrite
the per-class definition that entry exists to record. `slot_url` coverage went
2 → 55, `global` 5 → 77.

**The open question is answered: the fix covers all 4 `focus` sites, not 1.**
gen-linkml materializes inherited attributes onto every subclass, so each
`*ObservationSet` is its own site with its own id.

Test: `src/test/slotConflictResolution.test.ts` — confirmed to fail 4-of-6
against the old `bdchm.processed.json`. Includes a structural guard that every
class slot-ref resolves.

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

