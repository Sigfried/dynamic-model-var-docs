# The treelike exploration, 2026-09-14

The arrangements that decided [LEGEND_ORIENTATION.md](../../archive/LEGEND_ORIENTATION.md).
Siggie ran these in `treelike` (`sigfried.github.io/treelike/demo.html`,
source `~/github-repos/personal/treelike`) against
[`ownership-attributes.csv`](../../../ownership-attributes.csv) in the repo root.

**The screenshots themselves were pasted into the session and never landed on
disk, so they are gone.** This records what each showed, well enough to
regenerate: load the CSV, set the column order, toggle merge where noted.

The CSV's columns are `rule_id, target_entity, source_entity, attribute_name,
qualified_attribute_name`. `target`/`source` are the DECLARATION direction, so
for the two `belongs-to` rules the target is the owner.

## Forward rule (`owns-target-forward-by-default`, 89), filtered to /observation/

| arrangement | what it showed |
|---|---|
| `source → attribute(both cols) → target`, unmerged | the baseline; readable |
| `source → attribute → target`, target merged | **the winner on this side.** `MeasurementObservation (7)` fanning to its seven attributes, targets collapsed at the far end |
| `source → attribute → target`, attribute AND target merged | `context (1)`, `focus (1)` collapse across five sources — shows the repeated-name pattern, at the cost of crossing edges |
| `target → source → attribute`, unmerged | mimics the CURRENT legend. `Entity (13)`, `Quantity (16)` are undifferentiated fans — the worst of the forward set |
| `target → attribute → source`, middle merged | hairball: merging a middle column whose neighbours are both large |

## Backward rule (`belongs-to-target-backward-by-entity`, 55)

| arrangement | what it showed |
|---|---|
| `source → attribute → target`, unmerged | **collapses.** 25 rows of declaring classes, middle column near-constant: `associated_participant → Participant` twenty times. No structure |
| `source → attribute → target`, target merged | no better; 55 lines into four fat nodes |
| `target → source → attribute`, unmerged | 55 flat rows, `associated_participant` printed twenty times |
| `target → source → attribute`, attribute merged | **the failure case.** Merging the LAST column drags twenty edges backward across the source column. This is the evidence for "a merged column must be adjacent to what it groups" |
| `target → attribute → source`, attribute merged | **the winner, and the best image in either batch.** `Organization (14) → performed_by (11) → {11 classes}`; `Participant (21) → associated_participant (20)`; `Visit (18) → associated_visit (18)`. Reads as a sentence |

## The attribute-name pivot, both backward rules

| arrangement | verdict |
|---|---|
| `attr → owner → qualified → owned` | **rejected.** The owner column duplicates the owned column's content (`performed_by (11) → Organization (11) → …`), and printing `performed_by → Organization` invites the reader to think the attribute is declared on Organization |
| `attr → qualified → owned` | **chosen.** The qualified names carry the declaring class, so nothing is lost, and the repeated `Organization` on the right correctly reads as "all eleven land here" |

## The relation-bar screenshot

One image was the app itself, not treelike: `ObservationSet belongs to 4
distinct entities through 13 attributes`, with 9 of the 13 rows being induced
repetitions of `performed_by → Organization` etc., one per subclass. That is
the evidence behind TASKS `induced-clutter`.
