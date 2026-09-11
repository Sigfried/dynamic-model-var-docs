# One declaration for rules and edge kinds

The plan for TASKS [`drop-association`](TASKS.md) and
[`ownership-rules-declarative`](TASKS.md). Decisions here are Siggie's,
2026-09-11.

**Delete this file when both tasks close.** The durable content — what the
rules are and why — belongs in
[OWNERSHIP_CLASSIFICATION.md](OWNERSHIP_CLASSIFICATION.md); this file is the
sequencing argument and the design sketch, which stop being interesting once
the work is done.

---

## The two tasks are one task

They arrived as separate rows and they are not separable, because of a
constraint that only became visible once the goal for `association` was stated:

> **If association comes back, it comes back from a specification — not from
> git history.** Ideally by adding configuration to the rules and edge types,
> not by restoring a code path. (Siggie, 2026-09-11.)

That makes `association` the **only live test case** for the declarative
design. Ownership has exactly two other edge kinds, `own-fwd` and `own-bkwd`,
and they differ only in direction. A configuration system generalised over
those two alone would almost certainly be unable to express association — a
third kind that is dashed, arrowed at *both* ends, makes no ownership claim,
and yet layers like `own-bkwd`. Nothing would have forced the design to handle
any of that.

So the ordering is: **keep association alive as the reference case while the
declaration is designed, and delete it afterwards.**

### What that ordering costs

Removing the machinery first would make the config work marginally easier —
fewer branches to carry while restructuring (Siggie raised this, and it is
real, not a phantom). The judgement is that the cost is small: the association
branches are shallow (one `if` in the classifier, one entry in each of four
tables) and deleting them saves less than having a worked example is worth.
Recorded here so it is a decision rather than an oversight.

---

## Sequence

| step | what | unblocks |
|---|---|---|
| **1** | **Classification only.** Flip the three slots so the schema has **zero** association edges. Machinery stays, unexercised. | The Ownership tour — one fewer edge kind to explain |
| **2** | **The declaration.** Rules and edge kinds in one table. Acceptance criterion: *it can express association as configuration.* | — |
| **3** | **Deletion.** Remove the association machinery. The restore recipe is the config block's own documentation. | `ownership-doc-cleanup` |

Step 1 is well-specified and its outcome is already measured (below). Step 2 is
the one that needs a plausibility decision before it starts. Step 3 is
mechanical once step 2 exists.

---

## Step 1 — the classification flip

Three slots change verdict. Two are the `ASSOCIATION_SLOTS` members; the third
is the one that makes the result clean.

| slot | today | becomes | why |
|---|---|---|---|
| `Specimen.related_document` | `association` | `own-fwd`, Rule 1 | Document connects to nothing but Specimen and its own `focus`, so a document belongs to its specimen |
| `SpecimenStorageActivity.container` | `association` | `own-fwd`, Rule 1 | No clear direction between container and activity, but not important enough for a whole edge type |
| `Specimen.contained_in` | `own-bkwd`, Rule 2 | `own-fwd`, Exception 2a | A container has no independent existence from its specimen: it is an Exception 2a **target**, not an owner |

The third is not optional cosmetics. Measured against live schema data
(throwaway probe, 2026-09-11):

| variant | self-loops | layering edges | non-self cycles |
|---|---|---|---|
| all three flipped | 6 | 153 | **0** |
| association dropped, `contained_in` left backward | 6 | 153 | **1** |

The surviving cycle in the second row is exactly the one association existed to
break: `Specimen → SpecimenStorageActivity → SpecimenContainer → Specimen`, via
`Specimen.contained_in`. Flipping `contained_in` forward is what dissolves it,
and it is independently justified by Exception 2a — the two arguments happen to
agree.

Siggie's position is that **a cycle would not have been a blocker** even if one
survived (2026-09-11). Recorded because it changes what a future reader should
conclude if the count moves: a cycle appearing here is information, not an
emergency, and the layering code tolerates it.

### How the flip is spelled

`contained_in` is handled by adding **`SpecimenContainer` to
`SINGLE_VALUE_OWNER_TARGETS`** — a *range*-keyed entry, not a slot-keyed one.
That catches every single-valued slot ranging on `SpecimenContainer`, which is
`contained_in` and `parent_container`. `parent_container` is a self-loop and
renders as a `⟲` marker on its own row, so nothing about it changes. No
collateral.

The other two need only `ASSOCIATION_SLOTS` to empty; Rule 1 already claims
them once nothing intercepts it.

### What else the probe established

- Only `Specimen.related_document` ranges on `Document`, and `Document`'s only
  outgoing class edge is `focus → Entity`. The Rule 1 argument holds with
  nothing else attached to it.
- Three slots range on `SpecimenContainer`: `Specimen.contained_in` (single),
  `SpecimenContainer.parent_container` (single, self-loop),
  `SpecimenStorageActivity.container` (multivalued).
- The self-loop count stays **6**, matching the 2026-08-31 measurement.

### Tests this step needs

`docs/OWNERSHIP_CLASSIFICATION.md` §Layering already names two properties worth
pinning and not pinned anywhere. Step 1 is the moment to add them, because it
is the step that changes both numbers:

- the self-loop count (6), which has drifted once already;
- that `SpecimenStorageActivity.container` as `own-fwd` **with `contained_in`
  left backward** reintroduces the one non-self cycle — i.e. a test that
  records *why* the third flip is part of the set, so a later session cannot
  quietly revert it.

Both belong in `src/test/containmentGraph.test.ts`.

---

## Step 2 — the declaration

### What is wrong now

[OWNERSHIP_CLASSIFICATION §Where it lives](OWNERSHIP_CLASSIFICATION.md#where-it-lives)
lists the problem: one rule's definition is spread across four unrelated
places.

| the fact | where it lives today |
|---|---|
| the predicate that fires the rule | a branch in `classifySlotEdgeExplained` |
| which slots/ranges are exceptions | five hand-curated `Set`s in `containmentGraph.ts` |
| the human sentence explaining it | `OWNERSHIP_RULE_TEXT`, a separate `Record` |
| how the resulting edge is drawn | `EDGE_STYLE.kinds` in `edgeStyle.ts` + `EDGE_COLORS` in `appConfig.ts` |
| where it sits in the relation bar | `POSITION_AXIS` in `RelationBar.tsx` |
| how the legend groups it | `getOwnershipPairGroups`, keyed `verdict/rule` |

Adding a rule means editing five files and hoping. Adding an *edge kind* — what
restoring association would be — means editing more.

### The shape

One ordered array. Each entry carries everything about one rule, including the
appearance of the edge it produces.

```ts
// Order IS the classifier: the first entry whose `when` matches decides.
const OWNERSHIP_RULES = [
  {
    id: 'backward-multivalued',
    when: bySlot('parent_specimen'),
    verdict: 'own-bkwd',
    text: 'Multivalued, but pointing UP rather than down: …',
  },
  {
    id: 'cardinality-split',
    when: bySlot('creation_activity', 'dimensional_measures'),
    verdict: 'own-fwd',
    text: 'Cardinality splits a family. …',
  },
  {
    id: 'entity-ranged',
    when: byRange(ENTITY_ROOT),
    verdict: 'own-fwd',
    text: 'The range is Entity, the universal root. …',
  },
  { id: 'multivalued',  when: isMultivalued, verdict: 'own-fwd', text: '…' },
  { id: 'value-object', when: byRange(...VALUE_OBJECTS), verdict: 'own-fwd', text: '…' },
  { id: 'fk-inversion', when: always, verdict: 'own-bkwd', text: '…' },
] as const;
```

and, in the same file, the verdicts themselves as data:

```ts
const OWNERSHIP_VERDICTS = {
  'own-fwd': {
    layering: 'source-first', claimsOwnership: true,
    color: EDGE_COLORS.ownFwd, heads: 'end', headDirection: 'forward',
    dashed: false, secondary: false, label: 'A owns B',
  },
  'own-bkwd': {
    layering: 'target-first', claimsOwnership: true,
    color: EDGE_COLORS.ownBkwd, heads: 'end', headDirection: 'backward',
    dashed: false, secondary: false, label: 'A belongs to B',
  },
};
```

The style fields are `EdgeKindStyle` as it already exists in `edgeStyle.ts` —
this merges that record into the verdict rather than inventing a new shape.
`layering` and `claimsOwnership` are the two new ones, and they are new
precisely because association is what separates them.

### What derives from it

Everything that is a separate copy today:

- `classifySlotEdgeExplained` — a fold over the array; returns `{verdict, rule}`
  exactly as now. **`classifySlotEdgeExplained` stays** (the doc is emphatic
  about this, and rightly: the classifier reporting *which* rule fired is what
  made the original incoherence visible).
- `OWNERSHIP_RULE_TEXT` — a projection of `.text`.
- `EDGE_STYLE.kinds` / `EDGE_COLORS` — projections of `OWNERSHIP_VERDICTS`.
- `POSITION_AXIS` — **partly.** It is keyed on `RelationPosition`, which
  decomposes onto two axes (mine/theirs × owns/owned), so it is not a
  projection of the verdict table. What it needs from the declaration is the
  `kind` column — which `DrawnKind` each position draws with — and, for a
  non-owning kind, the fact that it is a **fifth position** rather than a cell
  in the 2×2. Keep `POSITION_AXIS` hand-written; derive its `kind` values and
  let the extra row appear from the verdict table. (See
  [§The five positions](OWNERSHIP_CLASSIFICATION.md#the-five-positions-and-the-two-axes-they-decompose-onto)
  for why the 2×2 is the right model and association sits outside it.)
- The legend's grouping — already keyed `verdict/rule`, so it needs the array
  only for ordering and text.
- **The rule tables in `OWNERSHIP_CLASSIFICATION.md`** — candidates for
  generation, or at minimum for a test that pins the doc's counts against the
  live array. Worth deciding, not worth blocking on.

### The acceptance criterion

**The design is done when restoring `association` is a diff that adds one
entry to `OWNERSHIP_VERDICTS` and one to `OWNERSHIP_RULES`, and touches no
other file.**

That is the whole point of the ordering, and it is checkable: write the
association entry against the design *before* step 3 deletes it, confirm the
app renders identically, then delete. The check is the deletion's own
justification.

Association's requirements, as the thing the design must express:

| requirement | what the config needs |
|---|---|
| no ownership claim | `verdict` and `layering` must be separable — association layers like `own-bkwd` but owns nothing |
| dashed stroke | `dash: true` |
| arrowheads at **both** ends | `heads: 'both'` |
| its own hue | `color` |
| appears in the relation bar as a fifth position | `POSITION_AXIS` derived, not hand-written |
| a legend row | already data-driven |

The `verdict`/`layering` separation is the non-obvious one, and it is exactly
the thing a two-kind design would have collapsed.

### Rules this cannot swallow

Honest scope, so the sketch is not read as more than it is:

- **Rule 3 (range-subtree) is not a classifier branch** and should not become
  one. It is a second pass in `buildContainmentGraph` over the forward edges
  the classifier produced, plus the matching walk in `getOwnershipPairGroups`.
  It can carry an entry in the array **for its text and its legend group**, with
  its `when` marked as not-classifier-evaluated — but folding it into the
  predicate chain would be wrong, and the two enumerations must stay pinned
  equal by `ownershipLegend.test.ts`.
- **`SKIP_SUBCLASS_EXPANSION`** is about the inheritance tree, not about
  classification. It stays where it is. Conflating it with the classification
  sets is what went wrong with `EXCLUDE_HAS_A_TARGETS` (2026-08-25).

### Cost

Moderate, and mostly mechanical. The predicates already exist as `if` bodies;
the texts already exist as strings; the styles already exist as objects. The
work is establishing the array, writing the projections, and deleting the
originals — with the type system catching the misses, since every consumer is
typed on `OwnershipRule` / `DrawnKind`.

The risk is **ordering**. The current classifier's correctness depends on its
branch order (association before `multivalued`, because it exists to defeat it;
`entity-ranged` before both). Making order into array position makes it
visible, which is an improvement, but it also makes it silently reorderable.
The array needs a comment saying order is semantic, and the existing
classification tests — which sweep the live schema — are what would catch a bad
reorder.

### Not in scope

`ownership-rules-declarative` is about **where the rules live**, not about
whether the hand-curated memberships can be derived. Those are different
problems:

- The memberships **cannot** be derived from the schema. This was verified
  2026-08-21, exhaustively, and is written up in
  [Exception 2a](OWNERSHIP_CLASSIFICATION.md#exception-2a--targets-with-no-independent-existence--own-fwd-41-edges).
  Do not re-litigate it.
- They **go stale silently on every schema sync** — that is
  [BACKLOG §Config rot](BACKLOG.md#hand-curated-config-rot) and TASKS
  `override-site-check`, and the fix is a sync check, not a declaration.

The declaration helps those tasks by giving the sync check **one place to look**
instead of five. It does not solve them. A plausible follow-on, once the array
exists, is moving the memberships to a LinkML overlay (`annotations:
is_value_object`) so they review as a schema-shaped diff — but that is a
separate decision and it is cheaper *after* this work, not instead of it.

---

## Step 3 — deletion

Mechanical once step 2 lands, and gated on the acceptance check above.

What goes: the `association` entries in `OWNERSHIP_VERDICTS` and
`OWNERSHIP_RULES`, the `ContainmentEdgeKind` member, the `RelationPosition`
member, the `{{edge:association}}` widget's kind, the tour beat in
`help-content.md`, FORMAT.md's edge-table row, and the test assertions in the
seven files that name it.

What stays: **the specification.** `OWNERSHIP_CLASSIFICATION.md`
[§association](OWNERSHIP_CLASSIFICATION.md#association--0-edges) is rewritten
from "here are the two edges" into "here is what an association edge is, what
it must be able to express, and the config entry that would restore it."
That section becomes the restore recipe — which is the whole reason the
deletion waits for step 2.

Note for whoever writes it: the section's current argument is worth keeping.
The justification for the category was never "these two slots are special" but
**"Rule 1 would claim ownership here, and it is wrong"** — and the companion
observation that a slot whose argument is instead "it's a role, not membership"
belongs in `own-bkwd`. Six single-valued slots were dropped on exactly that
reasoning (WORKLOG, 2026-08-25). A future schema that needs association back
will need that test, not the two slot names.

---

## Downstream

- **`help-finish-authoring/ownership`** unblocks after step 1: the Ownership
  tour then explains two edge kinds, not three. The tour beat at
  `help-content.md` that walks the Specimen/container/activity triangle is
  rewritten — and it gets *simpler*, since the triangle is no longer an
  exception to anything.
- **`ownership-doc-cleanup`** waits for step 3, as its row already says.
- **`override-site-check`** and **config rot** get a smaller surface after step
  2, but are not closed by it.

---

## See also

- [OWNERSHIP_CLASSIFICATION.md](OWNERSHIP_CLASSIFICATION.md) — the rules
  themselves, and the appendix mapping them to code.
- [TASKS.md](TASKS.md) — `drop-association`, `ownership-rules-declarative`,
  `ownership-doc-cleanup`.
- `WORKLOG.md` — why the association set shrank from 8 to 2 (2026-08-25), and
  the P2 palette change that gave the three kinds distinct hues (2026-09-04).
