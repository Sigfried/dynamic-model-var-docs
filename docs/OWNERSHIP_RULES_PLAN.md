# Ownership rules: simplify, then document

Implementation plan for TASKS `ownership-rules` — the merged task covering what
were `drop-association`, `ownership-rules-declarative` and
`ownership-doc-cleanup`. Decisions are Siggie's, 2026-09-11.

**Two goals, and the second is not a tidy-up.** Simplify the rules (steps 1–3),
then use that simplification to make
[OWNERSHIP_CLASSIFICATION.md](OWNERSHIP_CLASSIFICATION.md) **much shorter and
easier to follow** (step 4). It is 943 lines, of which the three rules that are
its subject occupy 146. Cutting it is the point, not a consequence.

**Delete this file when the task closes.** Everything here that should outlive
it belongs in OWNERSHIP_CLASSIFICATION.md.

---

## Already done

**Steps 1, 2, 3 and 5 shipped 2026-09-11** — see WORKLOG for the measurements
and the before/after verdict diff that proved the collapse behaviour-preserving
(exactly one verdict changed, `Specimen.parent_specimen`, a self-loop whose
direction is never drawn). **Step 4 is not started**, deliberately: Siggie wants
to be asked about each chunk considered for KEEPING, and wants a draft of the
Ownership tour past `why-ownership`/`edge-types` before the doc overhaul.

Earlier, two commits, both reviewed 2026-09-11:

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

~~**Classifier order is precedence, not pedagogy.**~~ **Superseded the same
day.** There is only ONE order now. `classify` matches a rule and then lets
that rule's exceptions revise the verdict, so an exception no longer has to run
before the rule it modifies, and `OWNERSHIP_RULES` is simply in the order the
rules are taught (Siggie: "would it complicate the algorithm much to just run
the rules in pedagogy order and on the rule 2 exceptions just reclassify?" — it
does not; it simplifies it). `parentRule` became structural rather than
presentational as a result. Rules also gained a human-readable `label`, which
is what the legend shows. See WORKLOG.

---

## 4 — Cut OWNERSHIP_CLASSIFICATION.md down

**The goal is a much shorter, much easier doc — not an updated one.** At 943
lines it is the biggest obstacle to understanding the rules it documents, and
steps 1–3 are what make cutting it possible: seven rules become three, five sets
become one, and the Rule/Exception numbering goes away.

Do this **with** the code changes, not after, or it gets rewritten twice.

Where the bulk actually is, measured 2026-09-11:

| lines | section | what to do |
|---|---|---|
| 135 | The relation vocabulary | Three kinds, five positions, a phrasing table and a rejected-wordings list. Keep the kinds and the two axes; the phrasing table is copy for a feature that does not exist yet, and the rejected wordings are WORKLOG material. |
| 127 | How edges are drawn | Rendering, not classification. Much of it belongs with the code it describes. |
| 126 | Appendix — implementation notes | Already says "do not start implementation from this appendix." Cut hard; the declaration is now self-describing. |
| 122 | The color system | Its own subject. Strong candidate to become its own file. |
| 86 | `Entity`-ranged slots | **Step 1 deletes this rule.** Keep only why `Entity` is drawn as a range but skipped in the inheritance tree. |
| 77 | Rule 2 + exceptions | Exception 2b disappears (step 1); 2a is renamed and regrouped (step 2). |
| 65 | `any_of` — not handled | N=1, low priority, decided. A short note, not a section. |
| 146 | Rules 1–3 combined | **This is the actual subject and it is a sixth of the file.** |

A reader wanting "how does a slot become an edge" should find it in the first
screen or two. Aim to at least halve the file; anything that survives should be
there because a reader needs it *now*, not because it records a decision —
that goes to WORKLOG, per [CLAUDE.md](CLAUDE.md).

What must survive the cut:

- **When a schema needs an association edge** — the *condition*, not the two
  slot names, which step 1 deleted. Already written:
  [§When a schema needs it](OWNERSHIP_CLASSIFICATION.md#when-a-schema-needs-it).
  Keep it symmetric: association is not a Rule 1 override.
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
