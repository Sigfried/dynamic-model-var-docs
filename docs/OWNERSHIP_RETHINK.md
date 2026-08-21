# Ownership classification — start over

> **Status: OPEN QUESTION, nothing decided.** Opened 2026-08-21 by Siggie after
> reading the ownership legend (the new pane in Explore) and finding the
> categories it lists incoherent.
>
> **This document deliberately does not propose an answer.** It records what
> broke and why, so the next session starts from the modeling question rather
> than from the existing code. See "How to approach this" at the bottom —
> the one instruction that matters is *do not start from the code*.

---

## Siggie's verdict (2026-08-21, verbatim)

> i think ownership graph stuff may be totally broken -- certainly the
> OWNERSHIP_CLASSIFICATION.md doc is broken. let's save and then get a new
> session to figure out what the right rules SHOULD be -- not based on the code
> or previous decisions. i don't know if the code really has all the different
> categories listed in the dialog's ownership rules, but it shouldn't

And on the existing rationale doc:

> maybe i never read OWNERSHIP_CLASSIFICATION.md because totally fails as an
> explanatory document and seems to have just captured history of decisions
> without a rationale even for why the decisions needed to be made in the first
> place

**Note on "categories listed in the dialog":** the legend pane shows seven
`verdict/rule` groups. Those are not seven designed categories — they are the
cross-product of 4 verdicts × 5 rules, filtered to combinations that happen to
occur. Siggie's instinct that there shouldn't be that many is correct: the
number is an artifact of how the code is structured, not a modeling decision
anyone made.

---

## What prompted this

The legend (built 2026-08-21 to help find edge-routing test cases) lists every
class-ranged slot grouped by the rule that classified it. Reading that listing
raised four questions. Each was investigated against the code and
`docs/OWNERSHIP_CLASSIFICATION.md`, and **each turned out to be a real problem,
not a misunderstanding.**

### 1. What rule distinguishes fk-inversion from value-object?

> fk-inversion vs. value-object: what/where is the rule that says that
> Activity.time_duration→Quantity goes forward and
> Condition.associated_participant→Participant goes backward?

**There is no rule. It is a hand-typed list of 14 class names** (`VALUE_OBJECTS`
in `src/models/containmentGraph.ts`), consulted before the FK fallthrough.
`Quantity` is forward because someone typed "Quantity" into that list;
`Participant` is backward because nobody typed it.

The list's *intended* principle is "a class with no identity of its own," but
nothing computes that — not identifier presence, not inbound reference count,
not `is_a` depth. The legend text stating the principle is therefore misleading:
it describes an intent the code does not implement.

`OWNERSHIP_CLASSIFICATION.md` concedes the mechanism is fragile — the FK
fallthrough "is the one that misfires" — and `Activity` had to be hand-added in
August 2026 after it produced a false root at layer 0.

**The underlying question that was never asked: is "value object" the right
concept here at all, and if so should membership be derived rather than
enumerated?**

### 2. Why is `performed_by` an override but `associated_participant` isn't?

> fk-inversion vs. override: Observation.associated_participant and
> Observation.performed_by seem to be the same kind of relationship. why is one
> in the override list and not the other?

They *are* the same kind of relationship. Both are single-valued entity-ranged
slots that end up own-flip. The difference is purely historical:

- `associated_participant` — the heuristic already produced own-flip, so no
  entry was needed (`OWNERSHIP_CLASSIFICATION.md` §C, "Uncontested — heuristic
  verdict stands").
- `performed_by` — was pinned to `ref` by the old `NO_FLIP_SLOTS` set, so
  changing it to own-flip required an explicit override entry.

**`OWNERSHIP_OVERRIDES` is not a semantic category.** It is "slots where the
heuristic was wrong, or where a previous override had to be undone" — an edit
log that the legend presents as if it were a classification rule. That is why
the grouping reads as arbitrary: it is arbitrary, in the precise sense that
membership depends on the order in which past decisions were made.

### 3. Excluding Entity ownership edges is wrong

> excluded: Not a confusion but issue: it makes sense to exclude Entity from
> inheritance relationships because it would be everywhere, but the ownership
> relationships are important

Correct, and the code conflates two different reasons to skip `Entity`:

- `SKIP_SUBCLASS_EXPANSION` — every class `is_a` Entity, so is-a edges to it
  are pure noise. Sound.
- `EXCLUDE_HAS_A_TARGETS` — drops the 12 `focus` / `associated_evidence` slots
  that *range on* Entity. **Different situation.** These are deliberate
  polymorphic pointers carrying real meaning ("this observation is about
  *something*"), and dropping them silently removes information.

`OWNERSHIP_CLASSIFICATION.md` §C already flags this: *"Revisit later: could
render as a wildcard port instead of disappearing."* Never revisited.

The 12 affected slots: `Condition.associated_evidence`, and `focus` on
Document, Observation, ObservationSet, MeasurementObservation,
MeasurementObservationSet, DimensionalObservation, DimensionalObservationSet,
SdohObservation, SdohObservationSet, SpecimenQualityObservation,
SpecimenQuantityObservation.

### 4. The reference overrides don't make sense

> reference override: not sure any of these make sense to me

The eight `ref` overrides are the weakest calls in the adjudication, and the
doc self-flags several. Three rest substantially on the slot being *named*
`related_*` — a naming convention doing semantic work:

| slot | doc's own reasoning |
|---|---|
| `related_imaging_study` | (listed as own-flip) "Weak preference; 'related_' naming argues ref" |
| `related_document` | "'related_' = association. **Weak preference.**" |
| `related_questionnaire_item` | "Cross-reference, not ownership." |
| `container` | "The activity *uses* containers; it doesn't own them." |
| `originating_site` | "Site of origin is provenance, not ownership." |
| `associated_assay` | "Assay is method metadata." |
| `has_questionnaire_item` | "A response item *points at* its question." |
| `transport_origin` / `transport_destination` | (no reasoning recorded) |

Several of these may be individually defensible. The problem is that no stated
criterion separates them from the own-flip slots — "uses but doesn't own" and
"provenance, not ownership" are restatements of the conclusion, not tests that
could be applied to a slot not already on the list.

---

## Why OWNERSHIP_CLASSIFICATION.md fails

Siggie's read is accurate. The document is structured as an **adjudication
worklist frozen mid-process**: §A Decided, §B Contested — needs a call, §C
Uncontested. It was written to run a decision meeting, then left in place as
the rationale record.

What it never states:

- **What ownership means** in this model — what question "does A own B?" is
  answering, and what the diagram is trying to show a reader.
- **Why the question needed deciding at all.** The FK-inversion heuristic is
  presented as the starting point with no argument for why edge direction
  should be inverted, or what breaks if it isn't.
- **What the verdicts are for.** `own-fwd`/`own-flip`/`ref`/`excluded` are
  defined by how they render, not by what distinction they draw.
- **Any test a reader could apply** to a slot the doc doesn't list.

Consequence: it is only legible to someone who was in the original
conversation. Siggie, who *made* those decisions, could not reconstruct the
reasoning from it thirteen months later.

---

## What exists today (reference only — not a starting point)

Recorded so the next session need not re-derive it. **Do not treat this
structure as the thing to fix; treat it as the thing to replace.**

Resolution order in `classifySlotEdge` (`src/models/containmentGraph.ts`):

```
1. range ∈ EXCLUDE_HAS_A_TARGETS  → excluded          (1 entry: Entity)
2. slotName ∈ OWNERSHIP_OVERRIDES → that verdict      (15 entries)
3. multivalued                    → own-fwd
4. range ∈ VALUE_OBJECTS          → own-fwd           (14 entries)
5. otherwise                      → own-flip
```

Live counts (2026-08-21, from `getOwnershipPairGroups`):

| verdict / rule | pairs |
|---|---|
| own-flip / fk-inversion | 43 |
| own-fwd / value-object | 41 |
| own-fwd / multivalued | 32 |
| own-flip / override | 15 |
| excluded / excluded | 12 |
| ref / override | 8 |
| own-fwd / override | 2 |

Two of the five rules (`override`, `excluded`) are lookup tables of hand-typed
names; a third (`value-object`) is a hand-typed table of range names. **Only
`multivalued` reads a property of the schema itself.**

### Where the classification is reachable in code

- `src/models/containmentGraph.ts` — `classifySlotEdge`,
  `classifySlotEdgeExplained` (returns verdict + which rule fired),
  `OWNERSHIP_RULE_TEXT`, and the three hand-curated sets.
- `src/services/DataService.ts` — `getOwnershipPairGroups()` enumerates every
  pair grouped by `verdict/rule`; `getConvergenceRanking()` /
  `getDivergenceRanking()` count edges in/out.
- `src/explore/OwnershipLegend.tsx` — renders the above.
- `src/test/ownershipLegend.test.ts` — asserts the legend cannot drift from
  the graph's actual edges.

`classifySlotEdgeExplained` is worth keeping through any rewrite: whatever the
rules become, having the classifier report *which* rule fired is what made
these four problems visible in the first place.

---

## Facts worth having (measured, not inferred)

Both directions matter, and ranking by target alone hides half the graph —
flipped edges reverse direction, so FK hubs never appear as convergence targets.

**Converging (edges in):** Quantity 19 (16 classes), TimePoint 16 (8),
BodySite 6, Context 6.

**Diverging (edges out):** Participant 22 (21 flipped), Visit 19 (18 flipped),
Organization 11 (11 flipped), Specimen 8 (0 flipped).

Participant's outbound fan is larger than the largest inbound convergence in
the schema. Nearly all of it is `associated_participant` — i.e. produced by the
FK-inversion rule that is question #1 above. **If that rule changes, the
largest structure in the diagram changes.**

Ownership alone is acyclic apart from 5 self-loops (`TimePoint.index_time_point`,
`File.derived_from`, `Specimen.parent_specimen`, `ResearchStudy.part_of`,
`SpecimenContainer.parent_container`). One genuine 3-node cycle exists once refs
join in: `Specimen → SpecimenStorageActivity → SpecimenContainer → Specimen`.

---

## How to approach this

**Do not start from the code, and do not start from
`OWNERSHIP_CLASSIFICATION.md`.** Both encode the accumulated result of
decisions whose reasoning is lost; reading them first will anchor the answer to
the thing being replaced. That is Siggie's explicit instruction: *"figure out
what the right rules SHOULD be -- not based on the code or previous
decisions."*

Start instead from the modeling question, roughly in this order:

1. **What is the diagram for?** What should a reader be able to conclude from
   "A is drawn above B"? Ownership as *lifecycle* (B cannot exist without A),
   as *composition* (B is part of A), and as *navigation convenience* are three
   different diagrams. The current code does not distinguish them.
2. **Does edge direction need inverting at all?** FK inversion is assumed
   everywhere and argued nowhere. What actually breaks if `Condition.associated_participant`
   is drawn as declared? (It affects 43 pairs — the single largest group.)
3. **How few categories can express it?** Siggie: *"i don't know if the code
   really has all the different categories listed in the dialog's ownership
   rules, but it shouldn't."*
4. **Can membership be derived rather than enumerated?** Three of five current
   rules are hand-typed lists that go stale silently on every schema sync —
   a tracked, recurring hazard (see `docs/TASKS.md`, hand-curated config rot).
   LinkML may carry usable signal here; Siggie prefers Python linkml libraries
   and moving toward linkml-conventional formats.
5. **Only then** compare against the current output to see what would change,
   using the legend pane and the case set.

Siggie has said repeatedly that ownership classification is **their call**, not
something to be settled unilaterally. Bring the modeling question back with
options and trade-offs rather than arriving with a rewritten heuristic.

The successor to `OWNERSHIP_CLASSIFICATION.md` should lead with what ownership
*means* and what test decides it, and record per-slot adjudications only as
consequences of that — the inverse of the current structure.
