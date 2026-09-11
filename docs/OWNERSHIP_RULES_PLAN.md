# Ownership rules: simplify, then document

Implementation plan for TASKS `ownership-rules` — the merged task covering what
were `drop-association`, `ownership-rules-declarative` and
`ownership-doc-cleanup`. Decisions are Siggie's, 2026-09-11.

**Delete this file when the task closes.** Everything here that should outlive
it belongs in [OWNERSHIP_CLASSIFICATION.md](OWNERSHIP_CLASSIFICATION.md), which
is rewritten as part of the same work.

---

## Already done

Two commits, both reviewed 2026-09-11:

- `6531af5` — `ASSOCIATION_SLOTS` emptied. `related_document` and `container`
  became Rule 1 forward; `SpecimenContainer` joined
  `SINGLE_VALUE_OWNER_TARGETS`, flipping `Specimen.contained_in` forward.
- `16234a0` — the declaration exists:
  [`src/models/ownershipRules.ts`](../src/models/ownershipRules.ts) holds
  `OWNERSHIP_RULES` (ordered, each entry carrying predicate + verdict + text)
  and `OWNERSHIP_VERDICTS` (how each verdict is drawn). `OWNERSHIP_RULE_TEXT`
  and `EDGE_STYLE.kinds` are projections of it.

What follows is the simplification that review produced.

---

## 1 — Collapse seven classifier rules to three

| rule id today | becomes |
|---|---|
| `multivalued` | `multivalue-owns-fwd` |
| `fk-inversion` | `single-value-belongs-to-bkwd` |
| `value-object` | `single-value-owns-fwd` |
| `range-subtree` | `child-following-parent` |
| `entity-ranged` | **deleted** — `Entity` joins `SINGLE_VALUE_OWNER_TARGETS` |
| `cardinality-split` | **deleted** — its two ranges join `SINGLE_VALUE_OWNER_TARGETS` |
| `backward-multivalued` | **deleted** — see below |
| `association` | unchanged: empty, category retained |

Names are Siggie's, from the `why-ownership` comment in
[help-content.md](../src/explore/help-content.md).

**Why each deletion is safe** (all measured against live schema data,
2026-09-11):

- **`entity-ranged`.** Only three slots range on `Entity`: `focus` (11 sites,
  mixed cardinality), `associated_evidence` (multivalued),
  `associated_artifact` (single). The multivalued ones are already Rule 1, so
  the rule exists solely to catch the single-valued sites — which putting
  `Entity` in `SINGLE_VALUE_OWNER_TARGETS` does.
- **`cardinality-split`.** `SpecimenCreationActivity` and
  `DimensionalObservationSet` are each referenced by exactly one slot — the one
  in question. Nothing else points at them, so they are value-object targets by
  the ordinary test. Range-keyed entries replace a slot-keyed rule.
- **`backward-multivalued`.** Its only member, `Specimen.parent_specimen`, is a
  **self-loop** — rendered as a `⟲` marker on its own row and never emitted as
  a layering edge. Its verdict is unobservable, so the rule earns nothing.

**Delete these two categories outright**, sets and all. Only `ASSOCIATION_SLOTS`
stays as an empty set, because it is still the worked example proving edge kinds
are expressible as configuration (see step 4).

After this, **`SINGLE_VALUE_OWNER_TARGETS` is the only set with members.**

---

## 2 — Regroup `SINGLE_VALUE_OWNER_TARGETS`

Range-keyed throughout. Three groups, each with a comment giving that group's
shared reason:

1. **Value leaves, widely reused** — `Quantity` (16 referrers), `TimePoint`
   (15), `BodySite` (6). No outgoing class edges.
2. **Value leaves, single referrer** — `CauseOfDeath`, `BiologicProduct`,
   `QuestionnaireResponseValue` + its 5 typed subclasses.
3. **Holds other value objects** — `Substance`, `TimePeriod`, `Activity`,
   `SpecimenContainer`, plus the new arrivals `Entity`,
   `SpecimenCreationActivity`, `DimensionalObservationSet`.

**Rename the criterion.** "NO INDEPENDENT EXISTENCE" over-claims for group 3.
Use something the whole list satisfies — *the holder is where this is found*.

**Move per-member decision history to WORKLOG**, including the long `Activity`
comment. Group comments state the current reason; they do not re-argue past
decisions.

### `SpecimenContainer` — settled, do not reopen

It stays in the list. Siggie's argument, which replaces the old
container-reuse hedge:

> A container has no reason to exist without its specimen. Even if containers
> are physically reused, this schema gives no way to track that — no identity
> beyond `id`, no history, nothing linking a container across specimens. A
> model that tracked reusable labware would look different.

By the criterion that matters it is an ordinary member of group 3: it points
only at `Substance` (itself a value object) and itself (self-loop, `⟲`, never a
layering edge) — the same shape as `TimePeriod` and `Substance`.

**Rejected:** flipping `SpecimenStorageActivity.container` backward so
`SpecimenContainer` could leave the list. That slot is *multivalued*, so the
flip asserts "many containers own one storage activity", which reads wrong; and
it would revive `BACKWARD_DESPITE_MULTIVALUED` plus add a second slot-name
override. It is acyclic — the cycle is not the objection — but it costs two
overrides to save one.

---

## 3 — Legend: nested, in teaching order

Order is **Rule 1 → Rule 2 → its exception → Rule 3**, and the exception renders
**indented beneath** `single-value-belongs-to-bkwd`, not as a peer.

Needs a `parentRule` field on `RuleSpec` and layout work in
[OwnershipLegend.tsx](../src/explore/OwnershipLegend.tsx).

**Classifier order is precedence, not pedagogy.** They are different orders for
different purposes and must not be conflated — say so in a code comment where
`OWNERSHIP_RULES` is declared.

---

## 4 — Rewrite OWNERSHIP_CLASSIFICATION.md

Do this **with** the code changes, not after. The doc currently documents seven
rules, five sets and a rule-numbering scheme that steps 1–3 make obsolete;
rewriting it separately means rewriting it twice.

What must survive the rewrite:

- **What an association edge is and what it must be able to express** — the
  test is *"Rule 1 would claim ownership here, and it is wrong"*, not the two
  slot names. A future schema needs the test.
- **That the memberships cannot be derived from the schema.** Verified
  exhaustively 2026-08-21; every candidate discriminator failed. Do not
  re-litigate.
- **Why `Entity` is drawn as a range but excluded from the inheritance tree** —
  `SKIP_SUBCLASS_EXPANSION` is a *separate concern* from classification and
  stays in `containmentGraph.ts`. Conflating the two is what went wrong with
  `EXCLUDE_HAS_A_TARGETS`.
- **Rule 3 is not a classifier branch.** It is a second pass in
  `buildContainmentGraph` over the forward edges, with a matching walk in
  `getOwnershipPairGroups`; `ownershipLegend.test.ts` pins the two equal.

Counts must be **re-measured** after the changes, not adjusted by hand. The
current table (159 total) is measured from `getOwnershipPairGroups`.

---

## 5 — `required` on `SlotFacts`

Add it. It is already carried on every slot edge, so the cost is a field.

**Open question, deliberately unresolved:** Siggie recalls a case where
`required` indicated ownership direction but cannot place it. Sweeping this
schema found **no slot whose verdict `required` would change** — so nothing
here motivates a rule today. Add the field as available-and-unused, documented
as such, so the case can be recognised if it resurfaces.

Full inventory of slot properties the schema actually uses, for anyone looking
for other signal: `range` 225, `description` 223, `required` 220, `multivalued`
104, `comments` 39, `name` 23, `examples` 20, `unit` 12, `inlined_as_list` 8,
`inlined` 1, `any_of` 1. `inlined`/`inlined_as_list` were investigated and
rejected 2026-08-21 (inconsistent with ownership); `unit` is presentational.

---

## What this closes

`override-site-check` dissolves: it exists because the override sets are keyed
by slot name and every member having exactly one site is luck. After step 1 the
only set left is range-keyed, so there are no slot-name overrides to check.
Close it as part of this work, noting why.
