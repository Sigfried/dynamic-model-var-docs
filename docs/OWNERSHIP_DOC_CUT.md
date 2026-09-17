# Cut OWNERSHIP_CLASSIFICATION.md down

All that is left of TASKS `ownership-doc-rewrite`. The implementation steps
this file used to carry all shipped — the rule collapse (2026-09-11) and then
the one-rule rewrite (2026-09-13, TASKS `one-rule-ownership`) — and the
reasoning behind them is in WORKLOG, where it belongs.

**Delete this file when the cut is done.** Anything here that should outlive it
belongs in [OWNERSHIP_CLASSIFICATION.md](OWNERSHIP_CLASSIFICATION.md).

---

## The goal

**A much shorter, much easier doc — not an updated one.** At 943 lines it is
the biggest obstacle to understanding the rules it documents, and the rule
changes are what made cutting it possible: seven rules became three, then three
became one rule plus two exceptions; five hand-curated sets became two; the
Rule/Exception numbering is gone entirely.

Aim to at least halve the file. A reader wanting "how does an attribute become
an edge" should find it in the first screen or two. Anything that survives
should be there because a reader needs it *now*, not because it records a
decision — that goes to WORKLOG, per [CLAUDE.md](CLAUDE.md).

## Two process requirements, both Siggie's, both easy to get wrong

1. **Ask about each chunk you would KEEP, not each chunk you would cut.**
   Siggie does not trust a line-count inventory, and much of the file is out of
   date though parts were updated recently. The default is that material goes;
   a chunk earns its place by your making the case for it and Siggie agreeing.
2. **Settle the Ownership tour FIRST**, and go back and forth on it with Siggie
   before the big rewrite. The tour is where the explanation gets worked out at
   the length a reader will tolerate; the doc is then the same shape with more
   technical detail.

   ⚠️ The tour as drafted teaches the THREE-rule scheme and now contradicts
   both the legend and the classifier. Rewriting it is part of the same task —
   see TASKS `ownership-doc-rewrite`.

## What must survive the cut

- **When a schema needs an association edge** — the *condition*, not the two
  slot names, which are long gone. Already written:
  [§When a schema needs it](OWNERSHIP_CLASSIFICATION.md#when-a-schema-needs-it).
  Keep it symmetric: association is not an override of the default rule.
- **That the memberships cannot be derived from the schema.** Verified
  exhaustively 2026-08-21; every candidate discriminator failed. Do not
  re-litigate.
- **§PROPOSED — the `has_part` / `part_of` slot hierarchy** (2026-09-17), the
  one route by which the schema could *carry* the memberships even though it
  cannot derive them. It answers the question the previous bullet raises and
  is the plan for TASKS `ownership-slot-hierarchy`; keep it whole until that
  task closes.
- **Why the two exception sets are keyed differently.** `REFERRED_TO_ENTITIES`
  by range, `NAMED_BACK_POINTERS` by `Class.slot` — and the second MUST be, because
  both of its ranges are genuinely owned by one other attribute each. This is
  the subtlest thing about the current scheme and the easiest to "simplify"
  wrongly; `ownershipRules.ts` carries the argument.
- **Why `Entity` is drawn as a range but excluded from the inheritance tree** —
  `SKIP_SUBCLASS_EXPANSION` is a *separate concern* from classification and
  stays in `containmentGraph.ts`. Conflating the two is what went wrong with
  `EXCLUDE_HAS_A_TARGETS`.
- **The induced pass is not a classifier branch.** It is a second pass in
  `buildContainmentGraph` over the forward edges, with a matching walk in
  `getOwnershipPairGroups`; `ownershipLegend.test.ts` pins the two equal.

## Two things NOT to reintroduce

- **The four perspectives.** Siggie, on the tour draft: *"that whole
  perspectives thing is too pedantic. just forget about it."* Whether any of it
  survives in the doc is a separate question, but it does not come back as
  structure.
- **Rule numbers.** The rules are named, not numbered (2026-09-13): the default
  is total, the exceptions never compete with each other, and the induced pass
  is not a slot rule, so there is no precedence for a number to carry.

Counts must be **re-measured**, never adjusted by hand. `getOwnershipPairGroups`
is the source, and the legend prints them live — 89 / 55 / 5 declared and 10
induced as of 2026-09-13.
