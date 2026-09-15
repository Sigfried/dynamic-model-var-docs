# Legend list orientation — design

TASKS [`legend-list-orientation`](TASKS.md). Settles which end every ownership
rule is spoken from, and so unblocks the wording of `ownership-doc-rewrite`.

## The problem

Siggie, 2026-09-13, reading the rendered panel: *"the legend dropdowns are just
really incomprehensible."*

`OwnershipLegend.tsx`'s `byTargetEntity` groups every section on `p.range`. But
`range` is the target of the DECLARATION, and `own-bkwd` flips ownership — so
one key lands on opposite roles depending on the section:

| section | rows by `range` | the row IS |
|---|---|---|
| Owns target / fwd / by default | 30 | the **owned** thing |
| …backward / by entity | 5 | the **owner** |
| …backward / by attribute | 2 | the **owner** |
| …forward / induced | — | the **owned** thing (the subclass) |

Same visual level, opposite meaning, no cue.

Two fixes suggest themselves and both are wrong. Grouping everything by
`owned` takes the by-entity section from 5 rows to 25 — destroying the
five-entity list that IS the rule's key. Grouping everything by `owner` takes
the default section to 38 rows of "classes that have attributes." Each section
is already grouped sensibly for its own rule; the sections just do not agree
with each other.

## What the exploration showed

Siggie loaded the 149 declared attributes into `treelike` and produced trees in
every column order, merged and unmerged. Recorded because the conclusions are
not recoverable from the code:

- **Forward reads best as `source → attribute → target`.** `MeasurementObservation
  (7)` fanning to its seven attributes is informative.
- **Backward reads best as `target → attribute → source`.** `Organization (14)
  → performed_by (11) → {11 classes}` is a sentence. Source-first on backward
  is 25 rows of declaring classes whose middle column is near-constant —
  `associated_participant → Participant` twenty times.
- **These are the same arrangement.** Both run **owner → attribute → owned**.
  Forward, the source owns; backward, the target owns. The range/declaring-class
  distinction was never what mattered — ownership order was.
- **A merged column must be adjacent to what it groups.** Merging the attribute
  column when it sits LAST (`target → source → attribute`) pulls twenty edges
  backward across the source column into one node and makes a hairball. Merging
  it in the middle, next to the owner, is what produces `performed_by (11)`.

## The design

**Group every section `owner → attribute → owned`.** The top-level row then
means the same thing everywhere — the owner — and no per-section caption is
needed, because the role no longer varies with the section.

Each rule's heading is followed by one line of counts, each of which is a
**pivot**: clicking it regroups the same set of pairs with that field at the top.

```
Belongs to target / backward arrow / by entity
  5 owners⌄ — 9 attrs⌄ — 25 owned⌄ — 55 total
```

The labels are settled in §The pivot labels below; the long forms in the
[sg] block that follows were the working draft that led to them.
### [sg] we did not discuss how the pivots would work now

first, we're already not going to be able to fit that whole thing on one line.
we need concise abbreviation, i guess, and then title text (popover may be
better) for full. which i think needs a little more clarity:
```
Owns target ...
  30 source entities⌄ — n source attribute names⌄ — n owned (target) entities⌄ — 89 attributes⌄
Belongs to target / backward arrow / by entity (+ by attribute)
  5 owner (target) entities⌄ — 9 attribute names⌄ — 25 owned (source) entities⌄ — 55 attributes⌄
```

expandable tree order:
- owns
  - source entities:
    - src
      - attr | tgt  (where only one row in expansion, goes on same line)
  - attribute names:
    - attr
      - src.attr (entity included) | tgt
  - owned:
    - tgt
      - src.attr
  - attributes: no dropdown (would be same as attribute names)
- belongs to:
  - owner/target entities:
    - tgt
      - attr
        - src.attr
  - attribute names:
    - attr
      - tgt
        - src.attr
  - owned:
    - src
      - attr | tgt
  - attributes:
    - attr
      - src.attr | tgt

### end of [sg] section

Always owner-first and owned-last, in every section, so the line itself teaches
the direction. Measured values:

| rule | owners | attribute names | owned | attributes |
|---|---|---|---|---|
| `owns-target-forward-by-default` | 38 | 52 | 30 | 89 |
| `belongs-to-target-backward-by-entity` | 5 | 9 | 25 | 55 |
| `belongs-to-target-backward-by-attribute` | 2 | 4 | 5 | 5 |

**Opening a pivot replaces the previous expansion** — one grouping at a time
(Siggie). Two simultaneous expansions would rebuild the ambiguity this removes.

`owner` and `owned` are already computed as-drawn on every `OwnershipPair`
(`DataService.ts:995`) and are currently unused by the legend, so no new
derivation is needed.

### What this fixes for free

- **The by-attribute section stops matching nothing.** Its 2 range-rows looked
  arbitrary; under owner-first those two entities ARE the owners, and the
  section reads `2 owner entities — 5 owned entities` consistently with the rest.
- **`inducedFrom` gets a use** in the legend's induced section, which lists the
  10 induced edges separately from the three slot rules. ⚠️ This is NOT an
  argument for surfacing induced edges elsewhere — TASKS `induced-clutter`
  (2026-09-14) takes them OUT of the relation bar and its counts.

### The attribute-name pivot is not uniformly useful

On backward, 9 names cover 55 attributes and `performed_by (11)` is the insight
that no other view in the app offers. On forward, 52 names cover 89 attributes
and 39 appear exactly once — clicking it yields a list nearly 1:1 with the
attributes, which is a re-sort, not a grouping.

**Decision: show all four COUNTS everywhere, but `total` gets no dropdown on
the owns side** (Siggie, 2026-09-14) — expanding it there would reproduce the
`attrs` tree exactly, since `src.attr` always wants a name above it. So the
weak pivot costs a number, not a redundant expansion.

The number stays informative even where the expansion is dropped: "52 names for
89 attributes" says the forward rule is mostly one-off naming; "9 names for 55"
says the backward rule is a few repeated patterns. That contrast is real content
and is invisible today. Suppressing a whole COUNT per section would reintroduce
per-section shape differences, which is the class of inconsistency this task
exists to remove — which is why only the expansion is dropped, never the count.

The 13 repeated forward names are concentrated in two families: the observation
attributes (`focus` 11, `context` 6, `value_quantity` 6, `observations` 4) and
the specimen-activity ones (`date_started` 4, `date_ended` 4, `additive` 3).

## Consequences for wording

*[sg] i'm not sure i understand what's being said here but it was motivated
by a general complaint on my part: i think 'reference' language tends to be
confusing and can ideally be retired -- relationships between attribute source and
target already have a lot of terms:*
- *owns / owned / owned by / belongs to*
- *source / target*
- *forward / backward**

*Referred to* names a property of an ARRIVAL, not of an entity. Siggie's
counter-example settles it: `QuestionnaireItem` is owned by `Questionnaire.items`
and referred to by three other attributes — not a contradiction, so the term
describes how you arrived. `REFERRED_TO_ENTITIES` survives only as *entities
every arrival at which is a reference*, which `ownershipRules.ts` already
half-concedes ("a contingent fact about this schema, not a property of the
vocabulary").

So the by-entity rule may keep *entities that are only ever referred to* as
shorthand, but not *referred-to entities* as if it named a kind of thing — the
by-attribute rule's whole content is that one entity is owned by one arrival and
referred to by another.

⚠️ Do not re-assert the premise/synonym argument without answering the
QuestionnaireItem case.

## Not doing

- **Uniform grouping by `owned` or by `owner` alone** — each breaks a section
  (above).
- **Renaming the rule labels to describe the grouping.** The labels correctly
  describe the ATTRIBUTE and are quoted by the tour and `OWNERSHIP_RULES[].label`.
  The rows underneath were the problem.
- **A per-section caption naming the rows.** Made redundant by owner-first
  ordering; the annotation only reads as necessary if the layout is wrong.

## The panel's copy and layout

Siggie, 2026-09-14, authoring against the rendered panel. The legend is not
authored content today (`OWNERSHIP_RULES[].text` is a plain string — see TASKS
`markdown-everywhere`), so this records the intended copy.

**The two intro lines each get an inline example**, formatted like the
dropdowns, on a new line beneath:

```
An attribute can target an entity that it owns
  e.g., Condition.affected_body_site:   Condition ———▶ BodySite
Or it can target an entity that it belongs to
  e.g., Condition.associated_participant:   Participant ◀——— Condition
```

**Replace the "two kinds of exception" paragraph** with an accounting that
makes 149 the anchor — which is also what makes `total` legible as the fourth
pivot:

> Of the 149 attributes in the schema,
> - **89 point forward**, from owner to owned — the default, and
> - **60 point backward**, from owned to owner — in two lists:
>   - **55** whose target is one of **5 entities** that are only ever belonged to
>   - **5** named individually, because their targets are owned by some *other*
>     attribute

⚠️ The two backward numbers count different kinds of thing and must not be
given parallel phrasing: the first list is keyed by 5 ENTITIES covering 55
attributes, the second is 5 ATTRIBUTES over 2 entities. An earlier draft read
"55 owner entities / 5 source attributes", which reads as one kind.

⚠️ What distinguishes the by-attribute five is NOT that their sources have
attributes pointing both ways — `SdohObservation` does too, and is not in the
list. It is that their TARGETS (QuestionnaireItem, ResearchStudy) are
themselves owned by another attribute, so the exception cannot be stated about
the entity without stripping it of ownership it has. That is the
QuestionnaireItem case, and it is why the key is `Class.slot`.

**Other layout changes:** arrows on each rule line; no rule indenting.

Dropping the indent removes the only visual signal that the two backward rules
are EXCEPTIONS to the forward one rather than three peers (`parentRule` drives
the indent today). The new intro carries that in prose instead.

### The pivot labels

`total` rather than a fourth noun, because it counts the same things the
`attrs` pivot counts distinctly — a fourth noun reads as a fourth category:

```
5 owners⌄ — 9 attrs⌄ — 25 owned⌄ — 55 total
30 owners⌄ — 52 attrs⌄ — 30 owned⌄ — 89 total
```

Rejected: `owners — attrs — owned — owner.attrs`. `owner.attrs` is wrong for
belongs-to, where the attribute is declared on the OWNED entity — the
misattribution trap again. The popover carries the full phrasing with
`(target)`/`(source)`.

## Verification

- `npx vitest run src/test/ownershipLegend.test.ts` — pins the two-counts
  invariant and re-implements `byTargetEntity` at line 126, so a grouping change
  must update it deliberately.
- `npx vitest run src/test/helpContent.test.ts` if any rule text changes.
- `npm run build` (`tsc --noEmit` is too weak here).
- Read the panel in the browser — the complaint was visual and no test sees it.
