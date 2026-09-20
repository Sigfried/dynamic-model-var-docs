# Ownership / containment / has-a relationships

How every class-ranged slot in the schema becomes an edge in the diagram, and
what each kind of edge means.

**This is the technical reference.** User-facing wording lives in
[help-content.md](../src/explore/help-content.md) (help entries and the guided
tour) and in the Ownership legend, which derives itself from the live
classifier. Where the same thing has to be said in both places, this file states
the rule and help states it in the second person; neither restates the other at
length.

How the diagram is *drawn* — colors, edge geometry, the relation bar, layering —
is in [ARCHITECTURE.md](ARCHITECTURE.md). Decision history is in
[WORKLOG.md](../WORKLOG.md). This file states what is true now.

Classes are arranged so that if `A` is drawn **before** `B`, a reader should
conclude **`B` is reached through `A`** — `A` is where you start if you want to
find `B`. (The layout runs left-to-right by default, so "before" usually means
to the left.)

## Why there are rules at all

**The schema does not say what belongs to what.** It expresses has-a
relationships several different ways, following no strict rule, so ownership
cannot be looked up — it has to be *read out*. These rules are **invented** for
that purpose: they are a curated interpretation imposed on the schema to convey
what logically belongs to what, and the exceptions exist because the rule itself
gives the wrong answer in specific places.

That matters for how to treat this file. A rule here is not a fact about BDCHM
that a test could confirm against the source; it is a judgement that has to keep
earning its place, and **the exception sets are editorial** — which is why a
schema sync can silently invalidate one and why classification calls are
Siggie's, not mechanical. Where a reading turns out wrong, the fix is to change
the rule or add an exception, not to look for what the schema "really" meant.

The clearest instance is that the schema states these relationships **both ways
round**. `ObservationSet` stores its `observations` **owner-side** — the owner
holds a collection. `Observation.associated_participant` stores the same kind of
relationship **member-side** — the member holds a pointer to what it belongs to.
Both say "X belongs to Y"; they differ only in which end the schema put the slot
on. **Storage direction is normalized before drawing**, or every observation,
exposure and procedure lands before the Participant it describes.

**The memberships cannot be derived from the schema.** Verified exhaustively
2026-08-21: every candidate discriminator — `identifier`, `inlined` /
`inlined_as_list`, `required`, `abstract`, `is_a` depth, "class with no
class-ranged slots of its own" — fails, several of them against our own reading.
So they must be asserted. Do not re-litigate this; the sweep is in
[WORKLOG.md](../WORKLOG.md). What *can* change is where the assertions live —
see BACKLOG [§Let the schema say it](BACKLOG.md#let-the-schema-say-it-a-has_part--part_of-slot-hierarchy).

## The rules

**One rule, two exceptions, and an induced pass that is not a slot rule.** The
order below is the order you would teach them in, which is also the order
[`classify`](../src/models/ownershipRules.ts) applies them: state the rule, then
say when it does not hold.

**The rules are named, not numbered.** The default is total and the two
exceptions never compete with each other, so there is no precedence for a number
to carry. The legend and the tour quote each rule's `label`, which stays correct
if the order changes.

An exception is only ever offered a slot its parent already claimed, so it does
not restate the parent's condition — it revises the verdict already reached. The
two exceptions are checked **together** rather than first-match, so a future
overlap fails loudly instead of resolving to whichever was declared first.

| kind | rule | when | drawn |
|---|---|---|---|
| `own-fwd` | **`owns-target-forward-by-default`** — source **owns** range | the default; total, keyed by nothing | forward: source before range |
| ↳ `own-bkwd` | **`belongs-to-target-backward-by-entity`** — source **belongs to** range | range ∈ [`REFERRED_TO_ENTITIES`](../src/models/ownershipRules.ts) | back: range before source, edge reversed |
| ↳ `own-bkwd` | **`belongs-to-target-backward-by-attribute`** — source **belongs to** range | `Class.slot` ∈ [`NAMED_BACK_POINTERS`](../src/models/ownershipRules.ts) | back: range before source, edge reversed |
| `own-fwd` | **`child-following-parent`** — induced, not a slot rule | second pass over forward edges; see below | forward |
| `association` | neither owns the other | [`ASSOCIATION_SLOTS`](../src/models/ownershipRules.ts), empty since 2026-09-11 | back: range before source, both ends arrowed |

**"Owns" and "belongs to" are different claims, not synonyms.** A class *owns*
what it holds — the target is part of what the source *is*, a value with no
independent existence (a `Quantity` of `5 mg` is not something you look up). A
class *belongs to* something that exists independently of it: an `Organization`,
a `Participant`, a `Visit` carry on existing whether or not any particular
observation points at them, so saying the observation *owns* them overclaims.
**"Belongs to" is the correct verb for `own-bkwd`** wherever it appears.

`association` makes **no ownership claim in either direction**. It layers the
same way `own-bkwd` does — target first — but that is geometry, not meaning.

⚠️ **Cardinality decides nothing.** It used to *be* the rule — multivalued meant
forward, single-valued backward — and 51 of the 60 single-valued sites then had
to be flipped back by an exception list. `SlotFacts.multivalued` is still
carried and deliberately unused; dropping it changed no edge on this schema.

### Why the two exception sets are keyed differently

`REFERRED_TO_ENTITIES` is keyed by **range**; `NAMED_BACK_POINTERS` by
**`Class.slot`**. This is the subtlest thing about the scheme and the easiest to
"simplify" wrongly.

A **range** key makes the stronger claim: *every* arrival at this entity is a
reference. That is true of Participant, Visit, Organization, ImagingStudy and
Person, and it is the safe key — it cannot silently capture an unrelated slot
the way a bare slot name can.

A **`Class.slot`** key says "this one attribute is a back-pointer" and says
nothing about its range — which matters, because both ranges in that set are
genuinely **owned** by exactly one other attribute: `QuestionnaireItem` by
`Questionnaire.items`, `ResearchStudy` by `ResearchStudyCollection.entries`. A
range key would not merely be risky here, it would strip those two entities of
the ownership they do have. Being referred to is a property of the **arrival**,
not of the entity.

The fully-qualified key is also what keeps `part_of` honest: two different
classes declare one, and a bare `part_of` would flip any future third site
silently.

### The induced pass is not a classifier branch

`child-following-parent` must not become one. It is a **second pass** in
[`buildContainmentGraph`](../src/models/containmentGraph.ts) over the forward
edges the classifier produced, walking `subtreeOf(range)`, with a matching walk
in `getOwnershipPairGroups`; [`ownershipLegend.test.ts`](../src/test/ownershipLegend.test.ts)
pins the two equal. It carries an entry in `OWNERSHIP_RULES` only so its text
and legend group come from the same table as every other rule.

In LinkML a slot ranged on `P` accepts an instance of any subclass of `P`, so
whatever owns `P` owns each subclass through the same slot. The graph carries
one induced edge per subclass, labelled with the same slot and marked
`inducedFrom: P`.

Scope, deliberately:

- **Forward edges only.** No `own-bkwd` edge in the schema has a range with
  subclasses, so the backward case is undefined rather than decided. All five
  `REFERRED_TO_ENTITIES` are leaf classes, which is what keeps this true —
  re-check after a schema sync.
- **`Entity` is skipped**, for the reason `SKIP_SUBCLASS_EXPANSION` exists: its
  subtree is every class.
- **A merged box collapses them**, so the canvas shows ONE line into the box,
  landing on its header — the relationship is with the family, not with a child.

**They serve layout only and are invisible in the UI.** Nothing user-facing
lists an induced edge: `collectRelations` filters them out of the relation bar,
and neither the legend nor the Ownership tour mentions them. An induced edge is
an **inference, not a declaration** — `response_value →
QuestionnaireResponseValueBoolean` says a subclass *may* fill the slot; no
attribute says it does, so listing one beside declared relations would assert a
relationship the schema does not contain. Their whole purpose is the layering —
put a subclass after the attribute that reaches its parent — and having served
it they have nothing to tell a reader.

⚠️ **Do not confuse this with LinkML's `inherited_from`.** That is a different
mechanism with the opposite character: `SchemaView.induced_class()` copies a
parent's slot onto each subclass of the **declaring** class, and those
subclasses genuinely hold it. Those rows are REDUNDANT — the same fact twice —
where induced edges are SPECULATIVE. `buildRelationRows` collapses the first and
`collectRelations` drops the second, for those different reasons.

### When a schema needs an association edge

**Use association when no ownership claim is right in either direction** — not
when one particular rule's claim is wrong. A slot whose objection is "it's a
role, not membership" is `own-bkwd`, which already says only "belongs to".

Association is not an override of the default rule. It is symmetric with it: any
rule that claims ownership is one association could have to defeat, so restoring
it means putting it *first*, ahead of the default — see the acceptance criterion
in [`ownershipRules.ts`](../src/models/ownershipRules.ts), which
[`ownershipRules.test.ts`](../src/test/ownershipRules.test.ts) proves by building
the entry and checking it classifies and draws correctly.

## Positions: side and kind are independent

`RelationPosition` ([`ownershipSubgraph.ts`](../src/models/ownershipSubgraph.ts))
is the edge kind crossed with **who declares the slot**. Two independent facts
are folded into those five names, and the UI reads them separately — keeping
them apart is the thing to get right:

- **SIDE** — where the class sits on the canvas. Layout is owner-first, so
  everything that **owns me** is drawn to my **left**, everything **I own** to
  my **right**.
- **KIND** — the edge's verdict: which end carries the arrowhead, and therefore
  which class declares the slot.

| position | side | kind | glyph | label (`RELATION_POSITION_LABEL`) |
|---|---|---|---|---|
| `owns-mine` | right | `own-fwd` | `-->` | belong to me by my attribute |
| `owns-theirs` | right | `own-bkwd` | `--<` | belong to me by their attribute |
| `owned-mine` | left | `own-bkwd` | `--<` | I belong to, by my attribute |
| `owned-theirs` | left | `own-fwd` | `-->` | I belong to, by their attribute |
| `association` | left | `association` | `<-->` | associated with |

**Both kinds appear on both sides**, which is why they are independent rather
than two names for one thing. Of the four classes that own `Observation`, three
do so because Observation points at them (`own-bkwd`) and one because
`ObservationSet` collects it (`own-fwd`). A reader cannot infer the kind from
the side, nor the side from the kind. [`relationBar.test.ts`](../src/test/relationBar.test.ts)
asserts exactly this, against the real schema.

`association` does not split by declarer, because neither end declares
ownership; it sits on the left because the layout orders its target first,
exactly as `own-bkwd` does.

The personal language was picked (2026-08-27) because all four name the
declaring side the same way — "by my attribute" / "by their attribute" — so they
read as one paradigm rather than two unrelated pairs. `RELATION_POSITION_LABEL`
is the config; it carries singular forms for the two `owns-*` rows, since only
those have a subject that inflects.

## `Entity` is the universal root, and we draw it only as a range

`Entity` is `abstract: true` and every one of the other 53 classes descends from
it. It plays three roles, and they need keeping apart:

- **As an inheritance parent** — drawing those edges adds a fan of 53 with no
  explanatory value. **Suppressed for clutter, not because the relationship is
  not real**, by `SKIP_SUBCLASS_EXPANSION` in
  [containmentGraph.ts](../src/models/containmentGraph.ts). This holds for any
  future inheritance view too.
- **As a slot range** — a deliberate polymorphic pointer that means something.
  Entity-ranged edges classify normally, by the default rule, always forward.
  They must not be dropped: `focus` carries real meaning ("this observation is
  about *something*") and deleting it silently removes information.
- **As a node** — `Entity` is in `classIds` and, since its inbound range edges
  are drawn, it touches edges and survives `pruneIsolated`.

**The problem is never the fact, it is the fan.** `RelationshipInfoBox` saying
"Parent class: Entity" is true and useful; `LinkOverlay` rendering every
`is_a Entity` link, and the containment graph fanning 53 of them, is the noise.

⚠️ `SKIP_SUBCLASS_EXPANSION` is a **separate concern from classification** and
stays in `containmentGraph.ts`. Conflating the two is what went wrong with
`EXCLUDE_HAS_A_TARGETS`.

Entity-ranged slots grow whenever upstream generalizes a range, so treat the
list as measured rather than fixed. A convergence that keeps growing is worth
watching: it is the kind of thing that turns a readable diagram into a hairball.

## `any_of` ranges — not handled (low priority)

**The app ignores `any_of` entirely.** Exactly **one** slot in the schema uses
it: `MeasurementObservation.associated_artifact`, `range: Entity`, `any_of:
[Assay, File, QuestionnaireResponse]`.

It is harmless today because the slot also declares `range: Entity`, so it draws
forward — the correct verdict. LinkML convention is for an `any_of` slot to
carry a `range` that is the common ancestor of the alternatives, so the declared
range stays a truthful (if vague) statement. **We lose precision, not
correctness.** What is lost: the diagram says "points at some Entity" where the
schema names three classes, and **`Assay` became a false root** — nothing ranges
on it since the `28007df` rename, so it sits at layer 0, a class you cannot
navigate *to*.

**Decision (option 1, taken): leave it; assert it stays small.** A test fails
when a *second* slot grows an `any_of`, so this gets revisited on evidence
rather than rotting silently. The alternatives, and the cheap middle option that
fans out for reachability only, are in BACKLOG
[§`any_of`](BACKLOG.md#any_of-ranges--the-alternatives).

**If this is picked up:** check whether `range` on an `any_of` slot is reliably
the common ancestor. If it can be absent, the safety net disappears and the slot
falls through to a rule that may draw it backward — wrong. A test for "every
`any_of` slot has a class-valued `range`" would catch it cheaply.

## Where it lives

| file | what |
|---|---|
| [`ownershipRules.ts`](../src/models/ownershipRules.ts) | **the one declaration**: `OWNERSHIP_RULES`, `OWNERSHIP_VERDICTS`, `classify`, the exception sets, `OWNERSHIP_RULE_TEXT` (a projection) |
| [`containmentGraph.ts`](../src/models/containmentGraph.ts) | `classifySlotEdge`, `classifySlotEdgeExplained`, `buildContainmentGraph`, `subtreeOf`, `SKIP_SUBCLASS_EXPANSION` |
| [`ownershipSubgraph.ts`](../src/models/ownershipSubgraph.ts) | `RelationPosition`, `RELATION_POSITION_LABEL`, `buildOwnershipDag`, `computeSunkLayers` |
| [`DataService.ts`](../src/services/DataService.ts) | `getOwnershipPairGroups` — **the source for every count** |
| [`OwnershipLegend.tsx`](../src/explore/OwnershipLegend.tsx) | renders every slot grouped by rule, counted live |
| [`ownershipRules.test.ts`](../src/test/ownershipRules.test.ts) | the table is well-formed, order is honoured, **association is expressible as configuration** |
| [`ownershipLegend.test.ts`](../src/test/ownershipLegend.test.ts) | the legend cannot drift from the graph's actual edges |
| [`relationBar.test.ts`](../src/test/relationBar.test.ts) | pins the two axes — both kinds on both sides |

⚠️ **Counts are re-measured, never adjusted by hand.** `getOwnershipPairGroups`
is the source and the legend prints them live. Any count written into prose
should say which denominator it means and how it was obtained — earlier drafts
used three different ones, which is why their figures do not reconcile.

**Do not start implementation from the code.** It is the accumulated result of
decisions whose reasoning is in [WORKLOG.md](../WORKLOG.md). Start from the
rules above.

## See also

- [WORKLOG.md](../WORKLOG.md) — decision history: what was tried, rejected, why.
- [TASKS.md](TASKS.md) — open work. [BACKLOG.md](BACKLOG.md) — deferred plans.
- [help-content.md](../src/explore/help-content.md) — user-facing wording.
- [ARCHITECTURE.md](ARCHITECTURE.md) — how the diagram is drawn: the color
  system, edge geometry, the relation bar, layering and cycles.
