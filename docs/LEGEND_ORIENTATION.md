# Legend list orientation

`legend-list-orientation`, **shipped 2026-09-15** ([archived
row](archive/tasks-2026-09-15.md)). The design argument, the alternatives
rejected and the rounds of review are in WORKLOG (2026-09-14, and 2026-09-15
"the legend's pivots, then its columns").
What is left here is the part still being read FROM.

## The pivot spec

Each rule's counts are pivots: clicking one regroups the same pairs with that
field on top. Every section runs **owner → attribute → owned**, so the
top-level row means the owner everywhere.

⚠️ `SHAPES` in [ownershipPivots.ts](../src/explore/ownershipPivots.ts) is a
TRANSCRIPTION of the block below. Two transcription errors have been caught
already, so check one against the other before trusting either;
`ownershipLegendDisclosure.test.tsx` pins the rules that come out of it.

expandable tree order, with the arrow each line carries:
```
- owns (own-fwd, ---->):
  - source entities:
    - src
      - attr ----> tgt
  - attribute names:  (start collapsed)
    - attr
      - src ----> tgt
  - owned:
    - ----> tgt          (label right-aligned; the arrow points AT it)
      - src.attr
  - attributes: (start expanded)
    - attr
      - src ----> tgt
- belongs to (own-bkwd, ----<):
  - owner/target entities:
    - tgt ----<
      - attr
        - src.attr
  - attribute names:
    - attr
      - tgt ----<
        - src.attr
  - owned:
    - src
      - attr ----< tgt
  - attributes:
    - attr
      - tgt ----<
        - src.attr
```

The header captions are the same field names in the same order, so they are a
lookup rather than a second spec — `headers` in `SHAPES`:

| pivot | owns | belongs to |
|---|---|---|
| source/owner entities | Source entity · Attribute name · Target entity | Target entity · Attribute name · Source entity |
| attribute names | Attribute name · Source entity · Target entity | Attribute name · Target entity · Source.attribute |
| owned | Source.attribute · Target entity | Source entity · Attribute name · Target entity |
| attributes (total) | Attribute name · Source entity · Target entity | Attribute name · Target entity · Source.attribute |

**A leaf never repeats what its immediate parent said.** That is the whole rule
behind `src` vs `src.attr`: a leaf under an `attr` level is the bare source
class, and one under an `entity` level keeps the qualified `src.attr`, because
the attribute name has not been said there.

⚠️ `belongs to: attribute names` looks like an exception and is not. Its levels
are `attr → tgt`, so the attribute is TWO levels up with the target in between,
and the leaf has to name it again.

⚠️ `owns: owned` is the one layout that does not read owner-first down the
page: it groups by the OWNED end. Its label is right-aligned into the last
column with the arrow on that row, so the group still reads owner → owned
across the line:

```
                         ----> BodySite
  Condition.affected_body_site
  ImagingFile.anatomical_site
```

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
