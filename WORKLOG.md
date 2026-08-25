# WORKLOG

Reasoning, dead ends, and corrections — the history that would clutter the live
docs. Live docs state *current* state; this states *how it got there* and what
was tried and rejected. Read this when a doc or convention looks arbitrary.

Newest first.

---

## 2026-08-25 (later) — Inheritance as adjacency, not edges

**Context: 90 minutes, then a stakeholder demo.** Siggie asked for a few
minutes of brainstorming and then implementation, on a branch off
`induced-slots-and-ownership`. That budget shaped every call below; several are
defaults chosen to be reversible rather than settled answers.

**The design question was already answered before the session started.** The
previous handoff framed inheritance as "should we draw is-a edges, given 37
classes hang off Entity" and left it open. Siggie's `[sg]` note in TASKS.md had
already closed it: no Entity inheritance, and *don't assume edges at all* —
they would crowd the graph out of legibility. So the work was never "route the
is-a edges we already compute"; it was "render is-a as ADJACENCY." Reading the
note before designing saved the whole wrong branch.

Of the options in that note — cascaded vs merged — Siggie said "merged is
definitely better," so cascaded was NOT built. The toggle is merged/off, not
merged/cascaded. If cascading is wanted later it is a second render mode over
the same `mergeSiblings` grouping, not a rewrite.

**Why the merge is a ViewModel pass and not a subgraph change.** Everything
downstream addresses nodes by id and rows by slot NAME — `buildSpec`'s ports,
`rowY`, the renderer, the drag/pin machinery. So folding siblings into one
NodeVM and rewriting edge endpoints to the merged id makes a merged box
indistinguishable from an ordinary node to layout and routing. ELK never learns
it happened. Doing it in `ownershipSubgraph` instead would have meant teaching
the DAG, the layering, and `hiddenOwners` about a node kind that is not a
class — much more surface for the same picture.

**Row dedup by slot name is forced, not chosen.** `rowY(node, slot)` finds a
row by name and throws if there isn't exactly one. Two siblings that each
declare `quantity` (Device/DrugExposure do) MUST become one row, or the anchor
is ambiguous. That turned out to be the right rendering anyway — one row with
two swatches — but the constraint came first.

**Swatch ABSENCE is the "shared" signal.** Marking parent rows with their own
colour was considered and dropped: it makes the common case the noisy one, and
the parent rows are the majority in every real group (Observation: 14 shared vs
9 own). Parent rows get weight and darkness instead, matching Siggie's "parent
gets solid black type."

**`inheritedFrom` already carried the shared/own test**, so nothing had to
re-derive the class hierarchy in the view. It only needed adding to
`AttributeSummary` — it was computed in the pipeline and dropped at the service
boundary. Note `exactOptionalPropertyTypes` is on: `inheritedFrom: x` where x
may be undefined does NOT satisfy `inheritedFrom?: string`; it must be spread
conditionally.

**Merged ids are namespaced `merged::Parent`** and must never reach anything
expecting a class id. Two leaks were found and fixed by inspection, not by
tests: `onNodeClick` (would have opened a detail drawer on nothing — now
resolves to the parent) and the dismiss ✕ (suppressed; dismissing a merged box
means dismissing several classes, a different feature). Anything else that
consumes node ids is a candidate for the same bug.

**Corrected mid-session: `npx tsc --noEmit` is NOT the typecheck.**
`docs/CLAUDE.md` says to use `npm run typecheck` (= `tsc -b --noEmit`) and says
plainly that bare `--noEmit` is less strict. Bare `--noEmit` was green here
while `tsc -b` had four real errors — two of mine, and two PRE-EXISTING
never-comparisons of exactly the kind the induced-slots handoff warned about:

- `DataService.ts:924` guarded on `e.kind === 'ref'`, which is not a
  `ContainmentEdgeKind` at all (`has-a | association | subclass`). The guard
  never fired, so **association edges were creating parent links** in
  `getContainmentNodes` — a live bug, not just dead code. Fixed to
  `'association'`.
- `DataService.ts:795` had a dead `|| verdict === 'association'` arm, harmless
  because the guard above it already excludes associations.

Both had survived because the previous session verified with bare `--noEmit`
too. **The stale-literal trap is not hypothetical and not once-off — it has now
bitten twice. Use `npm run typecheck`.**

### Revision, same session, after Siggie saw the first render

**Swatches lost to per-child headers.** The swatch scheme (a colour chip per
row, siblings listed in a legend strip) failed on contact with 5 children: the
legend truncated after 2½ names. That is not a width bug to fix — a legend is a
fixed-width channel and the child count is unbounded, so the scheme could not
scale. Headers grow downward with the list instead. The swatch survives in one
place only: a row several children declare independently sits under the first
of them, and the others are marked on the row.

**The parent-absorption bug is worth remembering as a class of bug.** With
`Observation` selected AND its children selected, the canvas drew Observation
twice — once as itself, once as the merged box titled by it. `groupSiblings`
only ever considered the CHILDREN, so the parent stayed an ordinary node.
Anything that synthesises a node standing for an existing one has to decide
what happens when the original is also present; I did not, and the default was
wrong.

**"+N more" on merged boxes never worked, and this took a correction to get
right.** I first told Siggie it was broken without saying which box, and my
explanation ("rows are filtered before the merge sees them") describes
something that could never have worked — which contradicted "it worked
recently" and rightly got challenged. Resolution: the ordinary-node expand path
is byte-identical to `3ee8965` (verified with `git diff 3ee8965 HEAD~2 -- src/`,
empty), so nothing regressed; only merged boxes were broken, and they were
hours old. **The lesson is about the report, not the code — "X is broken" needs
to say which X, or it reads as a regression claim.** The fix: NodeVM carries
`allRows` (everything it could show) so the merge can re-derive its own
visible/hidden split, instead of unioning members' already-filtered `rows`.

**Colours: "don't hard code colors (ever)."** Siggie's rule, mid-session. Moved
the sibling palette AND the pre-existing channel colours (`#d97706` ownership,
`#64748b` reference, which were hex literals inline in `stroke=` and `fill=`
before this work) into `GRAPH_COLORS` in appConfig, beside the element-type
palette. Widened 8 → 12: recycling matters only INSIDE one box, where two
children would share a header colour, so the palette must exceed the largest
group the schema can produce, not the largest it produces today.
`siblingColor` wraps rather than throwing — a repeated colour is a legibility
problem, a crash is a dead canvas.

**One hop needed no new machinery.** `ownerCap` already existed and already
meant "draw at most N owners per node, else make them chips." Siggie's ask —
one hop back, slot-clicking to reveal more — is `ownerCap: 0` plus the
`owned by` chips that were already there. Worth checking for an existing knob
before building a scope system; I nearly wrote one.

**`withChildHeaders` moved to `siblingMerge.ts` and takes a `makeHeader`
callback.** It started in the view because it built a RowVM. Parameterising the
row constructor kept the grouping policy testable without the view's types —
and the multi-owner ordering rule (a row two children declare is headed by the
first in member order) is exactly the kind of thing that needs a unit test
rather than a squint at the canvas.

**Not done, deliberately:** scrollable/resizable boxes (Siggie raised them with
the header design; a fully-expanded merged Observation is tall), a class
appearing in several boxes (SpecimenQuality/QuantityObservation — explicitly
deferred, and the real question there is whether the second grouping is
inheritance at all or a different axis), the own-bkwd/association verdict merge (Siggie is
taking it to stakeholders rather than deciding before the demo), and
header-side merging (0b, gated on that decision).

---

## 2026-08-25 — Cardinality on undrawn rows; `association` and slot storage challenged

> ⚠️ **REVIEW CAVEAT, stated by Siggie: this session's work was not reviewed
> closely and should be treated as suspect.** That covers the A→B commit
> (`6671166`) as well as the cardinality fix below. Verification was thorough
> in the mechanical sense — tests confirmed failing before fixing, byte-identical
> transform re-runs, before/after measurements — but *thorough verification is
> not the same as human review*, and the design judgements (especially the slot
> id scheme) had far less scrutiny than the test counts suggest. Treat
> conclusions here as provisional; re-derive rather than cite.

### The cardinality gap: mostly NOT the `Entity` exclusion

Siggie's screenshot: `Document.focus` renders `Entity` with no cardinality.
My first answer called it "a third symptom of the same `Entity` exclusion" —
too neat, and wrong. Checking properly: of Document's six rows, only `focus`
would gain a cardinality when `EXCLUDE_HAS_A_TARGETS` is removed. The other
five are scalar/enum-ranged, never become edges, and would have stayed blank
forever. `Document.url` is `1..*` and showed nothing.

Root cause, two layers:

1. Cardinality was attached to **edges**. Rows without a drawn edge got a
   hardcoded `cardinality: ''`.
2. `getClassSummary` re-parsed the RENDERED attributes table, which prints
   required/multivalued as `'Yes'`/`'No'` — so the booleans were already gone
   before the view could use them.

Fix: `getAttributeSummaries()`, a polymorphic method on `Element` returning
`{name, range, description, required, multivalued}`, overridden in
`ClassElement`. Deliberately NOT `instanceof ClassElement` in DataService —
docs/CLAUDE.md prescribes a polymorphic method for exactly this. `getClassSummary`
now reads the model instead of re-parsing its own output, and `cardinalityLabel`
is exported so the view labels undrawn rows the same way edges do rather than
reimplementing it.

### A test gap I could not close cleanly — recorded because it is a real hole

The tests cover the data thoroughly but NOT the single line in
`OwnershipGraphView` that calls `cardinalityLabel`. Two routes tried and
rejected:

- **Export `buildViewModel`** — trips `react-refresh/only-export-components`.
  Real rule, no precedent in this repo for suppressing it, and I was not willing
  to invent one for a test.
- **Render the component in jsdom** — produces no rows at all. Layout is async
  via an ELK worker (see the reasoning already recorded in
  `useGraphLayout.test.ts`), so nothing settles.

Verified the gap is real: reverting the view line leaves the whole suite green.
The proper fix is extracting `buildViewModel` plus the five node-geometry
constants it uses (`HEADER_H`, `ROW_H`, `FOOTER_H`, `hostOf`, `ownersStripHFor`)
into their own module — which is precisely what the lint rule was pointing at.
Not done here because it would ripple through the render code, and this was
meant to be a contained fix. Noted in the test file too.

### Slot storage moving onto classes — and why it deletes 6671166's machinery

Siggie's call, recorded not implemented: the `slots:` section of
`bdchm.processed.json` has been a recurring source of problems, and induced slot
definitions should live **with the class definitions**, at least for Explorer.
Kitchen Sink still wants all slots together, so a slot-oriented view survives in
some form.

Siggie proposed the mechanism; I verified it runs before writing it down
(`linkml_runtime` 1.9.5, already in `scripts/.venv`):

```python
sv = SchemaView(".../bdchm.yaml")
classes = {cls: sv.induced_class(cls) for cls in sv.all_classes()}
```

**Every case that broke `transform_schema.py` comes out right natively** —
`items` splits Questionnaire/QuestionnaireResponse correctly, `part_of`
self-loops on QuestionnaireItem, `focus` is multivalued on the sets and
single-valued on the scalars, `quantity` is Quantity vs float. That is precisely
what `resolve_slot_ids()` was built to reconstruct.

**So this deletes rather than adds.** With definitions on the class there is no
shared slot entry for two declarations to collide in, so the conflict detection,
the qualified ids, the majority/tie rules and the Part 2 name-keyed metadata fix
— everything added in `6671166` — stop being necessary. Worth stating plainly
because I built that machinery yesterday and it would be easy to defend it out
of sunk cost; the id scheme was also the least-reviewed part of it.

Two things checked that a future session should not have to rediscover:

- **Metadata survives.** `slot_uri`, `identifier`, `description`, `alias`,
  `inlined`, `comments`, `examples` are all on the induced attribute — including
  the `slot_uri` whose loss forced the Part 2 fix.
- **`domain_of` is NOT `inherited_from`.** I nearly wrote that it was. It is the
  list of *every* declaring class (`DrugExposure.identity.domain_of` has 14
  entries), not the nearest ancestor: 54 of 432 sites disagree. The nearest
  declaring ancestor still needs computing, via `sv.class_ancestors()`.

Does not block the classification work — the classifier reads only bare
`slotName`, `range`, `multivalued`, `required` (verified at
`containmentGraph.ts:221-230`), none of which depends on where slots are stored.

### `association — 8 edges` challenged (Siggie)

Not implemented — recorded for the classification session. Siggie's objection,
and it holds up against the data:

- The **six single-valued** members do not obviously need the verdict. Rule 2
  already gives them `own-bkwd`, and `association` layers IDENTICALLY, so the
  override changes only rendering. Checked whether Exception 2a would intercept
  them instead: it would not — none of the six ranges (`Organization`, `Assay`,
  `QuestionnaireItem`) is in `VALUE_OBJECTS`. So deleting them from the set
  sends all six to Rule 2 with no other effect.
- The **two multivalued** members (`related_document`, `container`) are the real
  associations: they exist to defeat Rule 1, which would otherwise read
  multivalued as ownership.

The doc's own table already encodes the asymmetry without naming it — the two
multivalued rows argue "Rule 1 would claim X, but it doesn't" (a correction),
while the six single-valued rows argue "it's a role, not membership", which is
what `own-bkwd` already means.

If it resolves this way the association set is **2 edges, not 8**, and the open
"merge `own-bkwd` and `association`?" question shrinks a lot — it is currently
framed as moving 57 edges out of "ownership".

---

## 2026-08-24 (later) — Option A→B implemented

> ⚠️ **Not closely reviewed by Siggie — treat as suspect.** See the review
> caveat in the 2026-08-25 entry above; it applies to this work too. The slot
> id scheme in particular (qualify every site of a conflicting name, 220 → 337
> ids) is a design decision that got far less human scrutiny than the volume of
> verification here implies.

Both shipped together in one working tree, as `docs/TASKS.md` insisted: A alone
tidies the screen while leaving `focus` collapsed, and B alone is the December
2025 repeat. Baseline before starting: 216 tests / 18 files green, typecheck
clean.

### A: the fix is one field, but there were 3 more display sites than documented

`docs/TASKS.md` named `Element.ts:466` (attributes table) and `:940` (titlebar).
An inventory of every `.name` read that can reach a `SlotElement` found three
more, all rendering the qualified id today:

- `Element.getSectionItemData` (`:164`) — `displayName: this.name`, the left and
  middle panel section rows.
- `panelHelpers.getPanelTitle` (`:48`) — the `else` branch explicitly handles
  slot and variable.
- Two sort sites — `SlotCollection.fromData` and `DataService.subsetSection` —
  sorted the user-visible list by qualified id, filing
  `value-QuestionnaireResponseValueBoolean` under its class suffix instead of
  next to the other `value` slots.

**Shape chosen: `displayName` as a getter on the base `Element`, defaulting to
`name`, overridden in `SlotElement`.** Rejected: adding a `displayName` field to
`SlotElement` only. The base already *emits* a `displayName` key in
`getSectionItemData`, and `Element.ts:119-129` already has `getId()`/`get id()`
delegating to `name` — so the base was already the place where identity and
label are distinguished. A getter on the base makes the section-row site correct
for free and gives every future subclass a sane default. Also: the codebase
already uses `displayName` for exactly this distinction in `contracts/Item.ts`
and `contracts/ComponentData.ts`, and `DataService.getItemInfo` already returns
`{id: nodeId, displayName: nodeAttrs.name}` — the graph layer never had this bug.
Only the Element layer collapsed the two.

`name` stays the qualified id everywhere. That is load-bearing and was verified
rather than assumed: `elementLookup`, `getClassesUsingSlot`, `SlotCollection.
getSlots()`, `getElement()`, and `subsetSection`'s `names.has(el.name)` filter
all join on it. `subsetSection` is the trap — `names` holds *graph node ids*, so
switching that filter to the bare name silently yields zero rows.

**`OwnershipGraphView.tsx` needed no edit at all.** TASKS.md listed `:147` and
`:161` as separate fixes. They aren't: both read
`getClassSummary().slots[].name`, which is `row[0]` of the attributes table —
i.e. `Element.ts:466`. Fixing 466 fixes them. The underlying mismatch was that
`row[0]` was qualified while the graph's `slotName` (`Graph.ts:509`,
`slotData.name`) has always been bare, and `OwnershipGraphView` joins across
both. Confirmed by measurement, not reading: before, `ObservationSet`'s plain
(scalar) rows contained `observations-ObservationSet`,
`associated_visit-ObservationSet` and `associated_participant-ObservationSet`
*in addition to* their connected rows — the phantom duplicates — and all three
were missing from `schemaOrder`, so they hit the `?? MAX_SAFE_INTEGER` fallback
and sorted last. After: plain rows are `category`, `focus`, `method_type`, `id`
only, and nothing is missing from `schemaOrder`.

### B: the handoff's blast-radius estimate was wrong, and it changed the design

TASKS.md predicted "~11 additional names". Measured against
`bdchm.expanded.json` with the specified comparison (`range`/`multivalued`/
`required`, `None` ≡ `False`): **46 slot names are declared on more than one
class, and 18 of those conflict on a load-bearing field.** Three strategies were
possible and the choice mattered:

- Qualify every site of a conflicted slot → **165** sites, 337 ids.
- Qualify only divergent sites, one variant keeping the bare id → 60 sites, 249.
- Qualify only the DAG-corrupting slots → ~6.

**Final rule: qualify every site. One rule, no exceptions.** If two sites
disagree on a load-bearing field they are not the same slot, so neither has a
claim on the short name.

#### The majority rule was implemented first, and was wrong. Why it was wrong

The first implementation picked one variant to keep the bare id, by a headcount
of sites. Siggie challenged it — "I don't get why you'd be looking at majorities
of anything at all" — and the challenge was correct. Recording the diagnosis
because the failure mode is subtle and repeatable:

- **It answers the wrong question.** The modeling question is "which of these
  sites are distinct slots?", and the answer is simply "all of them, that's what
  disagreeing means". Majority instead answers "which id gets to be short",
  which is cosmetic. Presenting a cosmetic choice as a modeling decision is the
  same defect the ownership docs complain about: a category produced by a
  hand-wavy rule rather than derived from the question.
- **It needed two exceptions to stop misbehaving**, and that was the tell,
  noticed and then patched over instead of heeded:
  1. Globals had to outrank the count, because `observations` has four
     all-distinct sites — its "majority" was a 1-1-1-1 tie that handed the bare
     id to `SdohObservation` while the schema plainly says `Observation`.
  2. Ties had to qualify everything, because 7 slots have no majority —
     including `items` and `part_of`, precisely the two whose collapse drew the
     wrong edges. A coin-flip deciding those was indefensible.

  Needing two patches to make a rule stop producing nonsense means the rule is
  wrong, not that it needs patches.
- **The 165-id fear was a dead constraint.** It came from December 2025, where
  ~109 qualified ids made the branch unshippable. But that was a *display* bug,
  and Option A — landed hours earlier in the same session — fixed it. With
  `displayName` rendering bare names, qualified ids never reach the screen, so
  the count is internal plumbing. A resolved constraint was still driving a live
  decision.

**Verified the two strategies are equivalent for the user**: dumped every drawn
edge across every class under both and diffed. **Byte-identical, all 86 edges.**
The id scheme moves nothing visible; class-ranged edge sites are 150 either way
(153 before, the drop being the wrong edges removed), and the 12 `Entity` sites
are unchanged.

#### Two consequences that had to be fixed with it

**`transform_classes`, easy to miss.** It decides slot ids independently of
`transform_slots`, keyed only on `slot_usage`. If the two disagree, a class
references a slot id with no entry in `slots`. Fixed by computing the decision
once in `resolve_slot_ids` and passing it to both. Guarded by a test asserting
every class slot-ref resolves.

**Part 2 of `transform_slots` silently lost metadata.** It keyed global-slot
handling on the bare id, which conflicted global slots no longer have. Caught by
checking rather than assuming: `id` lost its schema.org `slot_uri`, and
`associated_visit`/`associated_participant`/`id` lost the `global` flag that
drives the "Source: global" label. Now looks entries up by NAME and applies
identity metadata to every site — but **only** the identity metadata. The
canonical `range`/`required`/`multivalued` restore stays on the unqualified
entry, because applying it to a qualified entry would overwrite the per-class
definition that entry exists to record, undoing the whole fix. `slot_url`
coverage 2 → 55, `global` 5 → 77. This latent bug would have bitten the majority
version too.

### The open question in TASKS.md, answered

*"Whether plain-attribute conflicts propagate qualified ids into subclasses the
way `slot_usage` conflicts do — this decides whether the fix covers 4 `focus`
sites or 1."*

**It covers all 4.** gen-linkml materializes inherited attributes into every
subclass's `attributes`, so each `*ObservationSet` is its own site and gets its
own id (`focus-ObservationSet`, `focus-DimensionalObservationSet`,
`focus-MeasurementObservationSet`, `focus-SdohObservationSet`), each multivalued.
The scalar `Observation` family keeps its single-valued declaration on its own
per-class ids. The collapse had made every `focus` site look single-valued.

### Verified, not assumed

Every claim above was checked by running something. Specifically, both new test
files were confirmed to FAIL against the pre-fix state — `slotDisplayName`
3-of-7 failing when `bareName` is set to the map key, `slotConflictResolution`
4-of-6 failing against `git show HEAD:…/bdchm.processed.json`. A test that has
never failed proves nothing, and "no test asserted this" is exactly why the
display bug shipped for nine months.

Transform re-run confirmed byte-identical (deterministic). Orphaned slot entries
went 3 → 1; the remaining one (`associated_person`) predates this work.

### Note for the ownership-classification track

`Entity`-ranged slot *definitions* went 2 → 6, but the **12 class sites are
unchanged** — so the "expect a 12-edge convergence" figure still holds. What
changed is that those 12 now split **5 multivalued / 7 single-valued**, where
the collapse previously made every `focus` site look single-valued. Under Rule 1
vs Rule 2 those classify differently, so any count derived from the old data
needs re-deriving.

---

## 2026-08-24 — Ownership rules settled; four assumptions found wrong on inspection

Session was doc + investigation only; no code changed. Siggie left mid-session,
twice. Everything below is written into `docs/OWNERSHIP_CLASSIFICATION.md` and
`docs/TASKS.md` as current state — this records *why*, and what was wrong first.

### The pattern of the session: verify before writing

Four things that "everyone knew" turned out false when actually checked. Each was
believed by the doc, by me, or by both. Recording them because the failure mode
is uniform — plausible reasoning from code shape, never executed.

**1. The edge counts were all wrong and 150 was unreproducible.** The doc said
31/59/40/150. Real numbers, from running the live code path
(`getSlotEdgesForClass` over the in-scope class set in a throwaway vitest file,
since the raw-JSON walk uses a different denominator): R2 is **57**, 2a is **41**.
And there are three legitimate denominators, which is how 150 got in and stuck:
**153** = every class-ranged slot in the processed JSON; **141** = what the
builder emits today (12 `Entity` edges excluded before classification); **151** =
the target under the new rules. The doc's 150 matches none of them. Any future
count must say which it means — this is now stated in both docs.

**2. `Entity` needs no node-set change.** I assumed making `Entity` a range node
meant adding it to `classIds`, and asked Siggie to weigh a node-set change. Wrong:
`Entity` is *already* in `classIds`. It vanishes only because
`SKIP_SUBCLASS_EXPANSION` kills its is-a edges and `EXCLUDE_HAS_A_TARGETS` kills
its 12 inbound edges, leaving it touching nothing, so `pruneIsolated` drops it —
and the comment at `containmentGraph.ts:193` says so outright ("the universal
root"). Deleting `EXCLUDE_HAS_A_TARGETS` alone makes it a node. The question put
to Siggie was more consequential than the actual change.

**3. Rule 1b cannot be derived structurally.** Siggie proposed promoting the
`*Set` case to its own rule ("range is a collection class ⇒ forward"), which
reads well. Tested it: "class whose only class-ranged slot is one multivalued
collection" also catches `Person`, `Questionnaire`, `ResearchStudyCollection`.
The only clean discriminator for the four `*Set` classes is the **name suffix**,
and exactly one slot in the whole schema ranges single-valued on one
(`dimensional_measures`). So 1b would be a rule with a single member resting on a
naming convention. Rejected in favour of Exception 2b: two asserted entries with
stated reasons, which is more honest than a rule that *looks* derived and is not.

**4. The inheritance accessors are not a choke point.** Siggie said the `Entity`
inheritance exclusion belongs "wherever inheritance trees are derived" — correct
in principle. But `getSubclasses` (`Graph.ts:416`) has **zero callers** and
`getParentClass` has exactly one. The older views derive inheritance a completely
different way: `RelationshipInfoBox.tsx:68,85` and `LinkOverlay.tsx:48,365,375`
filter `getEdgesForItem` on `EDGE_TYPES.INHERITANCE`. Two independent paths over
the same edges, neither calling the other. So the instruction as stated would not
have reached the old views at all.

Siggie's resolution: **build the single route, with a REQUIRED `includeEntity`
argument.** The reasoning is worth preserving — a default is precisely what let
this rot. `EXCLUDE_HAS_A_TARGETS` and `SKIP_SUBCLASS_EXPANSION` sat side by side
as two silent `Set<string>`s, and no call site ever had to say which behaviour it
wanted, so the ranges case picked up the inheritance case's answer by accident. A
required argument forces intent at the call and makes a new caller fail to
compile rather than inherit the wrong default.

Also settled there: **the problem is never the fact, it is the fan.** A detail
panel stating "Parent class: Entity" is true and useful; drawing 53 of them is
noise. So `RelationshipInfoBox` passes `true`, drawing sites pass `false`.

### Decisions superseding the earlier round

- **`Entity`-ranged edges point FORWARD**, not `association` as previously
  proposed. Nice side effect: it makes the classifier immune to the `focus`
  cardinality defect below, since all 12 go forward regardless of cardinality.
- **`creation_activity` / `dimensional_measures` stay `own-fwd`** (Exception 2b).
  The previous draft dropped them as "warts drawn honestly". Siggie's argument
  won: their multivalued siblings are `own-fwd`, and splitting a family of five
  on an incidental `0..1` vs `0..*` is itself the wart. `dimensional_measures`
  has a second reason the doc never had — its range is a `*Set`, so the singular
  cardinality is only apparent.
- **`association` renders slate `#64748b` dashed**, both ends arrowed. Today's
  gray `#9ca3af` is too faint to see. Dashed kept — it correctly reads as the
  weaker claim.
- **`own-bkwd` vs `association` kept separate DELIBERATELY**, though Siggie is
  leaning toward merging. They already layer identically, so a merge is
  rendering + vocabulary only — but it moves 57 edges, the largest group, out of
  "ownership". Not a change to make as a side effect.

### Doc restructuring

The old "Exception 1a" / "Exception 2b" split existed only so each rule's
exception list looked complete; it made one set of 8 association slots read as
two concepts. Collapsed. **Beware:** "Exception 2b" now names something entirely
different (the cardinality-split pair). Old references will mislead.

Also killed: `Specimen.parent_specimen` as a "Known wart". It is a self-loop
rendered as a `⟲` row marker, never a routed edge — nothing about its direction
is visible. Siggie: "just forget about this."

### The `focus` investigation — bigger and different than expected

Dispatched an agent at what looked like a narrow data bug. Three things came back
that changed the picture. **My stated hypothesis was wrong**: I guessed the
conflict detector only compared `description`. It compares *all* fields
(`transform_schema.py:280-291`), warns to stderr, then `continue`s and keeps the
first-seen definition anyway. The `continue` is the bug. Worse, the comparison is
so strict that `owner`/`domain_of` alone make nearly every repeated slot
"differ", so the warning fires constantly and is noise — presumably why nobody
acted on it.

**`find_conflicting_slot_definitions()` does not exist.** It lives only in
orphaned commit `41313ed` (not an ancestor of HEAD) and in the TASKS.md prose
describing the December attempt. The machinery that *does* exist fires only on
`slot_usage` blocks — and the three `focus` declarations are plain `attributes`,
which is the entire reason it never fired.

**`owner: "DimensionalObservation"` is a red herring.** Pure dict iteration
order, and inert anyway: `dataLoader.ts:153-154` explicitly ignores
`owner`/`domain_of`. A useful symptom of first-wins collapse, nothing more.

**The headline finding was not `focus`.** Of 13 slots disagreeing on a
load-bearing field, only **two produce wrong edges in the shipped diagram**, both
via wrong `range`: `items` (draws `QuestionnaireResponse → QuestionnaireItem`,
should be `→ QuestionnaireResponseItem`) and `part_of` (spurious
`QuestionnaireItem ↔ ResearchStudy` instead of a self-loop). `focus` is *not*
among them, because range `Entity` hits `EXCLUDE_HAS_A_TARGETS` at
`containmentGraph.ts:127` before `multivalued` is read at `:130`. So `focus` is a
panel bug today — **but removing that exclusion makes it a graph bug**, which is
why Option B is sequenced after the classification work.

**The December regression is live at HEAD.** Verified by running the real loader,
not by reading: `ObservationSet`'s attribute table renders
`observations-ObservationSet` etc. Its TASKS.md status ("NOT WORKING") has been
accurate for nine months. Root cause is one place — `Element.ts:845-847` assigns
the map key (qualified id) to `this.name` and discards `data.name`, so the bare
name never reaches the element. Same root cause produces a second live defect:
`OwnershipGraphView.tsx:157-161` filters bare `entityNames` against qualified
`s.name`, so those slots render twice, once as a phantom disconnected row.

Why it survived nine months: **no test asserts the attributes-table Name column
matches the graph's edge label.** That test is on the Option A checklist.

Option C (key everything by `class.slot`) was rejected for now — it forces
decisions on `OWNERSHIP_OVERRIDES`/`VALUE_OBJECTS`, which are bare-name-keyed by
design and are exactly what the classification rewrite is changing. Wrong moment.

### A/B framing — corrected by Siggie at the end of the session

I first wrote these up as "A fixes the display, B fixes the data", and offered A
as a standalone track. Siggie: *"i don't see how it makes sense to fix focus in
display while leaving it broken in the incoming data."* Correct, and the framing
was the error — it implied two halves of one fix. They are fixes for two
unrelated bugs that happen to share a file:

- **Qualified ids on screen** — data correct (`id` AND `name` both present), UI
  reads the wrong field. A is the entire fix.
- **`focus` collapsed** — data wrong, information destroyed in the transform.
  **A does nothing here**; there is no second field for the UI to fall back on.

The sequencing reason was mechanical, not principled: B adds ~11 qualified ids,
which land on screen if the display bug is still live — that is what sank
December. That argues for A *before* B, not for shipping A and stopping.

Recorded because stopping after A is actively worse than today: `focus` still
collapsed, `items`/`part_of` still drawing wrong edges, but on a screen that now
looks tidy — removing the visible symptom that anything is wrong. Docs now say
**B is the job, A is its prerequisite.**

### Invariant to protect

`containmentGraph.ts:128` looks up `OWNERSHIP_OVERRIDES` by **bare** `slotName`
(from `Graph.ts:505`, bare regardless of ids). Load-bearing for the
classification work. Anything qualifying slot identity must leave it alone.

---

## 2026-08-21 — The bare diagonal explained; comparison harness + ownership legend

Siggie arrived with the diagnosis already made, from screenshots rather than
code, and it was right. Worth recording because the previous session made three
wrong guesses at this by theorising from the source.

### The bare diagonal: `bend` is undefined on a corner-less route

`mergeDistFor(mode, pts)` returns, for `'bend'`, the length of the **last routed
segment** — the distance back to ELK's final corner. That is well-defined only
if there IS a final corner. When ELK routes an approach as a single straight
run, `pts.length === 2` and the "last segment" is the entire edge. `mergeCut`
then walks back past the source, `cut` lands at index 0, the routed head is
empty, and the whole path becomes one straight line from the source anchor to
the shared arrowhead base. The bare diagonal is not ELK declining to step; it
is the merge code discarding a perfectly good horizontal route.

Confirmed numerically before touching anything: a 2-point route 1020px long
gives `mergeDist = 1020`, `cut = 0`. `near`/`far` never do this because their
distance is a fixed 40/120px, so the cut always lands on the long horizontal
run near the node.

This is why `merge-near` looked fine on the same layout. It is **not** that
near is better here — `bend` simply has nothing to bend from. It also explains
why it hits the TOP approach of a big convergence: that is where the outermost
fan lane happens to line up with the source row, so ELK has no reason to step.

**The fix, not yet implemented** (Siggie chose harness-first): clamp `bend` to
`Math.min(lastSegment, nearDistance)`, or fall back to `near` when
`pts.length < 3`. Siggie half-remembered wanting to "combine merge-near with
merge-from-last-corner" but could not recall the motivating cases. The
motivation is better than remembered — this is a **guard on a degenerate
input**, not a compromise between two aesthetics, so it does not need those
cases to justify it.

Do NOT re-try overshooting the cut by `CORNER_R*1.5` to swallow the corner;
2026-08-19 established that is worse (short last segments push the cut onto the
long run before the corner). Different problem, same function.

### Harness before fix — and why the legend was the valuable half

Siggie asked for the case harness first, then mid-build added upcoming-thoughts
#1 (a legend of every ownership pair type) explicitly *"to help me find cases
you may miss"*. That framing turned out to be the whole point.

The curated case set had been built from the **convergence ranking** — how many
ownership edges arrive at each class. That ranking structurally cannot show FK
hubs, because flipped edges reverse direction: an edge that reads
`Condition.associated_participant -> Participant` is drawn as Participant
owning Condition, so Participant appears as an *owner*, never as a target. The
case set therefore had a hole exactly where the schema is densest.

The legend, which groups by classification rule rather than by target, put 43
pairs in a single `own-flip / fk-inversion` bucket and made the hole obvious.
Measured: **Participant fans out to 22 targets (21 flipped), Visit to 19,
Organization to 11** — Participant's outbound fan is larger than the largest
inbound convergence in the schema (Quantity, 19 edges). And because flipped
edges keep their attribute-row anchor and never merge, these are precisely the
fans the merge code deliberately does not touch, hence the ones no constant has
ever been tuned against. Four cases added for them.

Lesson for the next session: a ranking is a projection, and this codebase has
two directions of ownership. Ranking by target alone hides half the graph.

### Legend derives from the classifier; it does not restate it

`classifySlotEdge` now delegates to a new `classifySlotEdgeExplained`, which
returns the verdict **plus which rule fired** (`excluded` / `override` /
`multivalued` / `value-object` / `fk-inversion`). The legend renders that.

The alternative — hand-writing the rule listing in the UI — was rejected
outright. `OWNERSHIP_OVERRIDES` and `VALUE_OBJECTS` are hand-curated and go
stale silently on every schema sync (this is already a tracked hazard). A
legend built from a second copy of the rules would conceal exactly the rot it
exists to reveal. A test asserts the legend's pair list equals the containment
graph's actual has-a/ref edges, so the two cannot drift.

`verdict/rule` is the group key, not verdict alone: they are not one-to-one. An
override can yield any verdict, and `own-fwd` arrives by three separate routes.

### Cases apply in place, not by navigation

Clicking a case sets `selectedIds`/`expandedIds`/`pathToRoot` directly rather
than changing `location`. A reload would re-read the merge mode from
localStorage and reset zoom/scroll — i.e. it would destroy the very state being
held constant while flipping modes on one case. The URL still updates via the
existing write effect, so a case remains shareable.

### Siggie's verdict at the end of the session: the classification is suspect

The legend was built to find edge-routing cases. It did that, then did
something more useful: reading its own listing made Siggie doubt the
classification underneath it. Four questions came out of that reading, each was
checked against the code, and **all four were real problems** — not
misunderstandings of a sound design:

1. No rule separates fk-inversion from value-object; `VALUE_OBJECTS` is 14
   hand-typed names checked before the FK fallthrough.
2. `performed_by` and `associated_participant` are the same kind of
   relationship in different groups, purely because the former used to be
   pinned to `ref` and needed an entry to change. `OWNERSHIP_OVERRIDES` is an
   edit log presented as a category.
3. Excluding `focus`/`associated_evidence` → Entity conflates the sound
   inheritance reason (every class is-a Entity) with ownership, where the
   polymorphic pointer carries real meaning. The old doc already flagged this
   and it was never revisited.
4. Three of eight `ref` overrides rest on the slot being *named* `related_*`.

Siggie's call: stop, save, and start a fresh session on what the rules SHOULD
be — explicitly **not** derived from the current code or the 2026-07-13
adjudication. Written up at the time in `docs/OWNERSHIP_RETHINK.md`,
which deliberately proposed no answer.

**Follow-up 2026-08-24:** the rethink doc has been removed. Its still-necessary
content — the instruction not to start from the code, and the note to keep
`classifySlotEdgeExplained` — moved into `docs/OWNERSHIP_CLASSIFICATION.md`
(Part 4); everything else it held was either duplicated in this entry already or
superseded by the rewrite. One live document again.

**Consequence for the routing work:** the bare-diagonal fix is still correct
and still worth doing (it is a guard on a degenerate input, independent of
classification). But aesthetic tuning against convergence sizes may be tuning
against the wrong graph — Participant's 22-edge fan, the largest structure in
the diagram, is produced entirely by the FK-inversion rule now in question.

**Process note worth keeping:** what exposed all four problems was
`classifySlotEdgeExplained` reporting *which rule fired*, then rendering the
pairs grouped by rule. Neither the graph nor the old doc made the groupings
visible, so their incoherence was invisible too. Whatever replaces the rules,
keep the property that the classifier can explain itself.

### Environment note

`npm test` / `npx vitest` fail under the repo's default node (v16 on PATH):
vite imports `constants` from `node:fs/promises`. Run with
`PATH="$HOME/.nvm/versions/node/v22.20.0/bin:$PATH"`. Full suite: 216 pass.
`npm run lint` reports 18 pre-existing errors in files untouched here.

---

## 2026-08-19/21 — Arrowhead merge finished; schema order; node dragging

Picked up the unfinished single-arrowhead spec, finished it, then spent most of
the session on edge geometry and a failed attempt at interactive routing.

### The arrowhead spec — what "one arrowhead" actually required

`a5f54c4` had all three points wrong; the fix was structural, not cosmetic.
Merged edges now carry **no `markerEnd` at all** — the "blobby wedge" was ~6
identical SVG markers stacked at one point, not one fat arrow. One head per
convergence is drawn as its own path, and edges terminate at the **centre of
its base**, one `ARROW_LEN` further out than the tip.

Sizing off the title text (`TITLE_EM = 12`) made the LR/TB swap free: the
arrow's base is built from the *perpendicular* of its direction vector, so an
LR arrow gets a vertical base and a TB arrow a horizontal one with no direction
branch. Worth preserving — an earlier instinct was to branch on direction.

**Sign error worth remembering:** the first version drew every head backwards.
One flag was doing two jobs — which *border* the head sits on (from whether the
entity is the drawn source) and which way it *points*. Those are independent:
the head always points INTO the node, so `dir` is the negation of the side sign.
Four regression tests now pin this across both borders in LR and TB.

### The curved merge tail was doing nothing

`mergeTail` built a cubic whose control points were laid along the incoming
direction — so it rendered visually straight anyway, while its seam with the
routed head could not be rounded (`roundedPath` only rounds corners with
segments on *both* sides). That seam was the source of the hard right angles in
`bend` mode.

Siggie's observation ("since the final leg is showing up straight anyway, could
we just draw it as a diagonal with a rounded corner?") was correct and the fix
was a net deletion: append the target as one more *point*, and the cut becomes
an ordinary interior corner that rounds like any other.

**Failed first attempt, don't retry:** adding `CORNER_R * 1.5` to the merge
distance so the cut lands *before* ELK's corner. When the last routed segment is
short the cut lands past the corner onto the long run before it, and the
approaches bunch into a cramped parallel bundle. Fix the rounding at the seam,
not the cut distance.

### Fan ordering: two wrong turns

The Consent `valid_to`/`valid_from` crossing prompted two failed fixes.

1. **Sorting fan ports by row y (pre-layout).** Made it worse: the top row got
   the topmost port — the straightest shot — and every lower edge had to climb
   over it. Which approach arrives from where is ELK's decision and is *not*
   knowable in `buildSpec`; any pre-layout proxy is a guess.
2. **Re-ordering at render time by arrival direction.** Correct in principle,
   but it was implemented as a spread of the *arrival points* across the
   arrowhead base — Siggie had asked for more spread at the **penultimate**
   points (the last bend), not the final ones. Reverted entirely.

Fan slot index is therefore deliberately meaningless — just a distinct lane per
edge. Both attempts are recorded in the `buildSpec` comment so they are not
retried.

**Still unexplained:** why one approach in a convergence arrives as a bare
diagonal with no steps while its neighbours step once or twice. `?dbg=1` logs
each convergence's routed approaches (point count, bend count, diagonal flag,
endpoints) to answer this from real geometry. Three guesses were made and all
three were wrong; the next attempt should start from that log.

### Schema order — two separate discard sites

Attributes rendered alphabetically, inverting `date_started`/`date_ended` and
`period_start`/`period_end` and hoisting `id` to the top.

- `Element.ts` sorted a class's attribute table with `localeCompare`. Removed.
  The other six `localeCompare` sorts in that file order browsable *lists*
  (enums, types, variables, tree children) where alphabetical is correct.
- `ownershipSubgraph`'s node slots come from a walk over the edge set, so they
  inherit graphology's insertion order. **Its doc comment claimed "schema
  order", which sent the first fix looking in the wrong place.** Corrected.

`getClassSummary`'s slot list is the authoritative index (every attribute, in
declaration order); the view sorts both row kinds against it. Source order
survives ingestion intact — see `slots` in `bdchm.processed.json`.

`DataService.subsetSection` (Focus/relationships) keeps its alphabetical sort:
it orders slot names gathered across *several* classes, where no single class's
schema order applies. Siggie's instruction: don't fix previous views unless the
fix pertains to Explore.

### ELK cannot route for a hand-placed arrangement

Node dragging was added as a probe and Siggie then wanted it permanent. The
question became whether ELK can re-route edges around a node the user moved.
**It cannot**, and each avenue was checked rather than assumed:

- **`elk.noLayout`** — exists in elkjs, but ELK's own description is "No layout
  is done for the associated element ... to avoid their inclusion in the layout
  graph, or to ... prevent layout engines from processing them." It EXCLUDES the
  node; its edges are not routed either. It is not a pin. (A recommendation to
  use it for exactly this was checked and is wrong.)
- **`Fixed Layout` algorithm** — keeps positions but requires `elk.bendPoints`
  supplied by the caller. A no-op router.
- **INTERACTIVE layering/crossing/cycle-breaking** — tried first. These read
  coordinates as ORDERING HINTS: ELK infers which layer a node belongs in, then
  re-places it there. Dropping BodySite far right moved it somewhere else
  entirely, and one graph hung. Fully reverted.
- **libavoid** — ELK's own answer ("routing edges without changing node
  positions has been a highly requested feature for several years"), algorithm
  id `org.eclipse.elk.alg.libavoid`. It is C++ wrapped as a Java plugin; elkjs
  is GWT-compiled Java and ships eleven algorithms (box, fixed, force, layered,
  mrtree, radial, random, rectpacking, sporeCompaction, sporeOverlap, stress).
  libavoid is absent and structurally cannot be ported.

So edges touching a moved node are re-routed by `smoothStepPath`, matching what
React Flow and Cytoscape do (engine places nodes, renderer computes edge paths).
**Neither of those libraries has obstacle-aware routing either** — React Flow's
`smoothstep` and Cytoscape's `taxi` both compute from endpoints alone. Switching
renderers would not fix this and would cost the fanned ports and merged
arrowhead. The missing piece is an orthogonal obstacle router, independent of
who draws the SVG.

### A correction to how the fan was described

The fan was documented as "deliberately tight, not meant to be seen." Siggie
pointed out that 4px is plainly visible — it shows up as the staircase of nested
arcs sweeping into the arrowhead. The "settled, don't touch" status of
`ENTITY_FAN_GAP` was therefore decided on a premise that does not hold. Not
changed, but no longer settled.

### Process note

Several wrong calls this session came from reasoning over a stale mental model
rather than re-reading the code: the arrowhead sign error, the row-y sort, the
`CORNER_R * 1.5` overshoot, the ELK pinning, and a set of line numbers quoted
from memory that were ~25 lines stale. Two claims to Siggie were also wrong —
the owner-chip count (raw slot ranges, ignoring `classifySlotEdge`, so eight
classes instead of the real four) and "React Flow's dagre example handles drag
continuously" (it does not re-run the layout engine; it recomputes its own edge
geometry). **Check before asserting; the file is cheap to read.**

## 2026-08-19 (later) — Edge rendering: fan, corners, arrowheads

Second session of the day. Siggie listed a round of work (edge improvements,
self-loop markers, drawer headers, cross-view state, amber, owner cap 5, docs
cleanup); most of it is still untouched because the edge work absorbed the
session and ended with the arrowhead spec still not met. Ended with Siggie
saying "not understanding each other… maybe we need a new session."

### The NUL byte, and why it mattered more than it looks

`ownershipSubgraph.ts` had a literal 0x00 byte in `buildOwnershipDag`'s dedup
key (`${e.source}<NUL>${e.target}`) — committed, longstanding, functionally
harmless. It made `file` report the module as `data`, so **every grep-family
tool silently skipped it**. Fixed by writing it as the `\0` escape (`54f70b8`).

This surfaced only because searches for `ownerCap` kept returning nothing while
`sed -n '102p'` clearly showed the text. Chasing that also uncovered a *second*
tooling problem: `grep` in the non-interactive shell is a shell function (from
Claude Code's setup, not Siggie's dotfiles) that execs `ugrep -I --ignore-files`;
this ugrep build **rejects both flags and exits silently**, so every
`grep pattern file` call returns a false negative. Two independent causes of
the same symptom, stacked. Use `command grep`. This produced a real wrong claim
to Siggie — that colours weren't config-driven — which had to be retracted.

### Curved mode was broken in a way nobody had diagnosed

The docs recorded "curved edges look poor" and deferred retuning them. The
actual cause wasn't tuning: `curvedFromSections` built the full point list and
then used the bend points **only to pick two directions**, drawing a single
cubic between the endpoints. ELK's entire route was discarded, so curves sailed
through whatever the orthogonal path had been routing around. No tension value
could fix that.

Siggie guessed this unprompted ("if you anchored along all the ELK points,
maybe the curved lines wouldn't be totally ugly"). Correct. `smoothPath` now
runs Catmull-Rom through every routed point; `simplifyPoints` drops collinear
runs first, because following ELK's many near-collinear points faithfully
produces a wobble instead of one sweep.

### The fan: a fix that became a new bug

Earlier (2026-08-19 morning) each node had one `::hdr:in` port, so N converging
edges overlapped and six owners of `BodySite` read as one edge between unrelated
owners. The fix fanned ports across `HEADER_H + (total-1)*9`, capped at
`height - 6` — which **deliberately spilled below the header**. That traded the
overlap bug for a semantic lie: an arrow landing beside the `site` row implies
"this edge is about `site`", borrowing meaning the entity end never had.

Resolution: keep the fan but make it **tight** (4px, header-centred) and treat
it as a pure *routing* device — ELK needs distinct port coordinates, the user
should never see them. Drawing then merges the tails back together.

Worth preserving: **only the attribute end names a slot.** The entity end is
the peer class, which has no corresponding row. The old code called these
*host*/*storage* and *free*/*peer*; Siggie didn't understand any of those words,
so they're being retired for **attribute end** / **entity end**.

### Arrowheads — three wrong attempts, spec still unmet

Image evidence from Siggie each round. Two real bugs found and fixed: markers
had no `markerUnits` so they scaled by stroke width (9 × 1.8px ≈ 16px wedge),
and `refX="9"` pushed the tip past the path end, burying the body in the border
— which read as *no arrowhead at all*. `LinkOverlay.tsx:506` already had the
`userSpaceOnUse` precedent.

But the merge itself is still wrong, and the mistake is worth recording: I read
"single arrowhead" as *converge to one point and let the markers coincide*, and
kept `markerEnd` on every edge. N markers stack into a blob. Siggie's actual
spec is that **edges carry no markers at all**, one arrowhead is drawn
separately, sized in `em` off the title text (~1em base, ~1.5em to point,
swapped for TB), and edges terminate at the **centre of its base**. I had also
aimed `mergeTargets` at roughly the tip rather than the base. Left committed as
WIP (`a5f54c4`) with the spec in TASKS.md rather than guessing a fourth time.

I'd also proposed "let them land a few px apart, honest to the routing" — that
directly contradicts a single shared arrowhead and was withdrawn.

### Process notes

- Siggie asked for the three merge distances as **switchable options** rather
  than one commit each ("can implement and let me look one-at-a-time"). Built as
  four toolbar buttons, explicitly temporary. **No option was ever chosen** —
  ask before deleting the losers.
- The owner cap 8→5 flipped an existing test: `BodySite` has exactly 6 owners,
  so it now falls back to chips by default. The test asserted the *drawn* case
  while relying on the default, conflating behaviour with a constant. Split into
  one test at an explicit cap of 8 and one pinning `DEFAULT_OWNER_CAP`.
- `git stash push -- <paths>` to isolate the NUL commit silently split a coupled
  change (the cap constant stayed, its test left), leaving a failing test on the
  intermediate commit. Caught by running the suite before committing. Isolate by
  reverting the unrelated hunk instead.
- Playwright still isn't installed. Every visual claim this session needed
  Siggie's eyes; jsdom sees no SVG geometry. Three rounds of screenshots is the
  cost of that gap.

---

## 2026-08-19 — Explore SPA visual pass

Siggie drove the real page for the first time since the drawer/expand work and
reported bugs directly. **Several were invisible to the test suite**, which is
the main lesson of the session: 158 jsdom tests passed while pan did not work
at all and unchecking an entity crashed the app.

### The uncheck crash, and why the `throw` stayed

`OwnershipGraphView.tsx` threw `Routed edge edge-80 missing from view model`
when unchecking one of two selected entities. Cause: ELK layout is async (web
worker) while the view model is a synchronous `useMemo`. React re-rendered with
the *new* view model while `useGraphLayout` still held the *previous* spec's
result, so the render mapped over stale routed-edge ids.

The tempting fix — soften the throw to `return null` — was rejected. A routed
edge genuinely missing from the current view model *is* a real invariant
violation and should fail loudly (repo convention: fail loudly in dev). The fix
instead makes the situation unreachable: the hook stores each result alongside
the spec it was computed from and returns null unless they match.

Writing the third test for this caught a bug in the fix itself: `specOf([])`
produces a non-null spec with zero nodes, and the pending check
`!!spec && !fresh` reported `inProgress` forever, because the effect
short-circuits empty specs without ever calling the engine. Worth remembering
that "spec exists" and "spec will be laid out" are different conditions.

### Path-to-root: two wrong designs before the right one

**Wrong analysis first.** I probed the cost of paths-to-root using mid-level
classes (Participant, Condition, MeasurementObservation), measured 4–8 context
nodes, and concluded it was "not a volume problem" — recommending a *depth cap*.
Siggie posted a screenshot of `?sel=BodySite` showing a canvas full of boxes.

Re-probing at the leaf end:

| selection | nodes | context | edges | layers |
|---|---|---|---|---|
| Organization | 1 | 0 | 0 | 3..3 |
| Visit | 5 | 4 | 5 | 0..3 |
| **BodySite** | **16** | **15** | **32** | **0..6** |
| **Quantity** | **30** | **29** | **87** | **0..8** |

The lesson: **sample the extremes, not the typical case.** The mechanism is
fan-*out*, not depth — a value object is owned by everything that stores one,
and each owner drags its own path to root, making the walk a reverse-
reachability closure. A depth cap would not have helped at all: at N=1,
BodySite still pulls all six owners. Depth was the wrong axis.

**Second wrong design.** Turned path-to-root off by default and summarized
owners as clickable chips. Siggie: too little context, truncated chips with an
unclickable "+3", and clicking every chip is bad. The error was treating owners
as a footnote. For a value object, *its owners are the answer to what it is* —
BodySite's six owners are the content of the diagram.

**Landed:** draw direct owners (one hop, cap 8) as real nodes; chips only above
the cap, listing every owner with an "add all", never truncated. Transitive
path-to-root survives as opt-in (`⇱ roots` / `?roots=1`) because it is
occasionally what you want and it was already built.

### The "missing arrow" that wasn't

Siggie reported Condition and MeasurementObservation looking linked with a
missing arrowhead, then corrected: there is *no* arrow between them, it just
looks like one. Diagnosis: every incoming edge shared a single `::hdr:in` port,
so six edges converging on BodySite landed on one point and their orthogonal
runs overlapped into an apparent Condition↔MeasurementObservation edge. Each
edge now gets its own port fanned along the border.

Orthogonal routing is **our** choice (`elk.edgeRouting: 'ORTHOGONAL'`), not an
ELK default — worth knowing before blaming the layout engine. Curved edges look
poor at current spacing; Siggie explicitly deferred retuning them
("try to fix orthogonal, don't worry about curved now"). **Don't fix curved
unprompted.**

### Activity classification

Adjudicated: `Activity` is a value object. Full rationale in
`docs/OWNERSHIP_CLASSIFICATION.md`. Worth noting here is the *shape* of the
bug: the FK-inversion default treats any single-valued entity range as a
foreign key, so an identity-less value object missing from `VALUE_OBJECTS` gets
read as owning its holder. This is the second time hand-curated config went
stale after an upstream sync (the first: `ENTITY_CATEGORIES` hiding Context and
Activity from the entity list entirely). Expect it again.

I also briefly misread `git diff main..proposal/activity-value-object` as
showing the branch *reverting* expand-on-demand, and warned Siggie about it.
That was a two-dot-diff artifact — the branch was cut before that work landed,
so the diff reported main's later commits as "removed." The branch only ever
touched one file.

### Process notes

- Committing was deferred too long; Siggie interrupted with "wait — commit
  first" while a third change was in flight. Commit at each verified boundary.
- Node: a non-interactive shell falls back to a system Node 16 where Vite 7
  cannot start (`node:fs/promises` has no `constants` export before 18).
  Siggie's interactive shell has v24 via nvm. Export the nvm bin path.
- `npm run typecheck` (`tsc -b --noEmit`) is stricter than bare
  `tsc --noEmit`, which I had been running for most of the session. Both were
  clean here, but use the npm script.

---

## Before 2026-08-19

No worklog was kept. History for that period lives in commit messages, in
`docs/archive/tasks.md`, and in the design docs themselves.
