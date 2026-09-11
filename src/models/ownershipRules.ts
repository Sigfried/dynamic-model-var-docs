/**
 * **One declaration for every ownership rule and every edge kind.**
 *
 * Before this module the definition of a single rule was spread across five
 * unrelated places: a branch in `classifySlotEdgeExplained`, a hand-curated
 * `Set`, a string in `OWNERSHIP_RULE_TEXT`, an entry in `EDGE_STYLE.kinds`,
 * and a row in `RelationBar`'s `POSITION_AXIS`. Adding a rule meant editing
 * five files and hoping; adding an edge KIND meant editing more.
 *
 * Everything about a rule now lives in one entry of `OWNERSHIP_RULES`, and
 * everything about how its edge is drawn lives in one entry of
 * `OWNERSHIP_VERDICTS`. The old exports are projections of these, so nothing
 * downstream had to change.
 *
 * See docs/OWNERSHIP_RULES_PLAN.md for the design and its acceptance
 * criterion; docs/OWNERSHIP_CLASSIFICATION.md for what the rules MEAN, which
 * is the thing to read first.
 *
 * ---
 *
 * **The acceptance criterion, and why it is written down here.**
 *
 * `association` — an edge kind that is dashed, arrowed at BOTH ends, claims no
 * ownership, and yet layers exactly like `own-bkwd` — must be expressible by
 * adding one entry to `OWNERSHIP_VERDICTS` and one to `OWNERSHIP_RULES`, and
 * touching nothing else. That is what makes the current (empty) association
 * category restorable from a specification rather than from git history.
 *
 * It is the reason `claimsOwnership` and `layering` are separate fields: for
 * the two live kinds they are perfectly correlated, and a design that had only
 * ever seen those two would have collapsed them into one. `ownershipRules.test.ts`
 * proves the criterion by building the association entry and checking it
 * classifies and draws correctly.
 */

import { EDGE_COLORS } from '../config/appConfig';

/** The universal root. Both a drawn range node and an excluded inheritance parent. */
export const ENTITY_ROOT = 'Entity';

export type OwnershipVerdict = 'own-fwd' | 'own-bkwd' | 'association' | 'excluded';

/** Which end of an edge is drawn first, and so lands in the earlier layer. */
export type Layering = 'source-first' | 'target-first';

/** Where arrowheads sit: at the path's end, or at both ends. */
export type HeadPlacement = 'end' | 'both';

/** The head at the END points along the path (forward) or back down it. */
export type HeadDirection = 'forward' | 'backward';

/**
 * Everything about one verdict: what it claims, how it layers, how it is drawn.
 *
 * The style fields are `EdgeKindStyle` as `edgeStyle.ts` already defined it —
 * this absorbs that record rather than inventing a parallel shape.
 */
export interface VerdictSpec {
  /** Does this verdict assert that one end owns the other? */
  claimsOwnership: boolean;
  /**
   * Which end layers first. **Independent of `claimsOwnership`** — association
   * layers target-first while claiming nothing, which is the whole reason
   * these are two fields. Changing an edge between two verdicts that share a
   * layering moves nothing on screen except its stroke and arrowheads.
   */
  layering: Layering;
  color: string;
  heads: HeadPlacement;
  headDirection: HeadDirection;
  dashed: boolean;
  /** Reference edges are secondary: thinner stroke, slightly smaller head. */
  secondary: boolean;
  /** The legend's and the tour's name for it, in A/B form. */
  label: string;
  /** How the relation bar names this relationship from one end's point of view. */
  relationLabel: string;
}

/**
 * The drawn verdicts. `excluded` is absent deliberately: it means "no edge",
 * so it has nothing to draw and no layering.
 *
 * `association` is absent because no slot classifies as it (2026-09-11). The
 * kind survives in `edgeStyle.ts` and its restoration entry is written out in
 * `ownershipRules.test.ts`, which is what proves this table can express it.
 */
export const OWNERSHIP_VERDICTS = {
  'own-fwd': {
    claimsOwnership: true,
    layering: 'source-first',
    color: EDGE_COLORS.ownFwd,
    heads: 'end',
    headDirection: 'forward',
    dashed: false,
    secondary: false,
    label: 'A owns B',
    relationLabel: 'owns',
  },
  'own-bkwd': {
    claimsOwnership: true,
    layering: 'target-first',
    color: EDGE_COLORS.ownBkwd,
    heads: 'end',
    headDirection: 'backward',
    dashed: false,
    secondary: false,
    label: 'A belongs to B',
    relationLabel: 'belongs to',
  },
} as const satisfies Record<string, VerdictSpec>;

/** A verdict that produces a drawn edge. */
export type DrawnVerdict = keyof typeof OWNERSHIP_VERDICTS;

/**
 * Which rule decided a slot's verdict.
 *
 * Kept as a named union rather than derived from the array, because it is a
 * public type that DataService, the legend and several tests are written
 * against. `RULE_IDS_MATCH_UNION` below fails the build if the two drift.
 */
export type OwnershipRule =
  | 'association'                 // slot in ASSOCIATION_SLOTS (empty since 2026-09-11)
  | 'multivalue-owns-fwd'         // Rule 1: multi-valued slot → class
  | 'single-value-owns-fwd'       // Rule 2's exception: range is where the value lives
  | 'single-value-belongs-to-bkwd' // Rule 2: single-valued slot → other entity
  | 'child-following-parent';     // Rule 3: an own-fwd slot's range includes its subclasses

/** What the classifier knows about one slot. */
export interface SlotFacts {
  slotName: string;
  range: string;
  multivalued: boolean;
  /**
   * Whether the schema marks the slot required.
   *
   * **Available and deliberately unused.** Siggie recalls a case where
   * `required` indicated ownership direction but could not place it; sweeping
   * this schema (2026-09-11) found no slot whose verdict `required` would
   * change, so nothing motivates a rule today. The field is carried so the
   * case can be recognised if it resurfaces, and so a rule that wants it does
   * not have to re-thread the plumbing. It is already on every slot edge, so
   * the cost is a field.
   */
  required?: boolean;
}

export interface RuleSpec {
  id: OwnershipRule;
  /**
   * Fires when this returns true. `undefined` means the rule is not evaluated
   * by the classifier at all — see `child-following-parent`, a second pass in
   * `buildContainmentGraph` and carries an entry here only for its text and
   * its legend group.
   */
  when?: (facts: SlotFacts) => boolean;
  verdict: OwnershipVerdict;
  /** Human-readable statement of the rule, for the legend. */
  text: string;
  /**
   * The rule this one is an EXCEPTION to. Presentation only — the legend
   * renders it indented beneath its parent, so a reader meets the default
   * before the case that defeats it.
   *
   * It has no effect on classification: array order alone decides that, and an
   * exception necessarily precedes the rule it names here.
   */
  parentRule?: OwnershipRule;
}

/*
 * The hand-curated memberships. These CANNOT be derived from the schema —
 * verified exhaustively 2026-08-21; every candidate discriminator failed. See
 * OWNERSHIP_CLASSIFICATION.md. They go stale silently on every schema sync
 * (BACKLOG "Hand-curated config rot"), and collecting them here gives that
 * sync check ONE place to look, which is all this module claims to do about
 * the problem.
 *
 * Two sets, and only one has members. Both are keyed by RANGE — the class
 * being pointed AT — not by slot name. That is the whole reason TASKS
 * `override-site-check` dissolved with this work: a slot-name key silently
 * applies at every class declaring that slot, which is how `performed_by`
 * (11 sites) did damage when it sat in the old override list. A range key has
 * no such hazard: the range IS the thing being classified.
 */

// Empty since 2026-09-11 (TASKS `ownership-rules`). Kept as the worked example
// proving edge kinds are expressible as configuration — see the module header,
// and OWNERSHIP_CLASSIFICATION.md on when a schema needs an association edge.
export const ASSOCIATION_SLOTS = new Set<string>([]);

/**
 * Ranges whose instances live INSIDE whatever holds them: **the holder is
 * where this is found.** A single-valued slot pointing at one of these is
 * forward ownership, never flipped into a foreign key.
 *
 * The criterion is deliberately not "no independent existence" — that
 * over-claims for group 3, whose members do hold other things. What every
 * member satisfies is the weaker, truer statement: you find one of these by
 * starting at its holder, so the holder is drawn first.
 *
 * Per-member decision history lives in WORKLOG. The group comments below say
 * why each group is here NOW; they do not re-argue what was settled.
 */
export const SINGLE_VALUE_OWNER_TARGETS = new Set<string>([
  // 1. Value leaves, widely reused. No outgoing class edges at all: a Quantity
  //    of 5 mg is not something you look up, it is part of its holder.
  'Quantity',                           // 16 referrers
  'TimePoint',                          // 15
  'BodySite',                           // 6

  // 2. Value leaves, single referrer. Same shape as group 1, but named by
  //    exactly one slot, so they could never be shared even in principle.
  'CauseOfDeath', 'BiologicProduct',
  'QuestionnaireResponseValue',
  'QuestionnaireResponseValueDecimal', 'QuestionnaireResponseValueBoolean',
  'QuestionnaireResponseValueInteger', 'QuestionnaireResponseValueTimePoint',
  'QuestionnaireResponseValueString',

  // 3. Holds other value objects. Not leaves — these point at further value
  //    objects, and at themselves (self-loops, drawn as ⟲, never layered) —
  //    but still found only by way of their holder.
  'Substance', 'TimePeriod', 'Activity', 'SpecimenContainer',
  // `Entity` is the universal root, so a slot pointing AT it is never a
  // foreign key back to an owner; without this, Rule 2 would reverse the
  // single-valued `focus`/`associated_artifact` sites and draw Entity as the
  // owner of Document and Observation, which is backwards. Its multivalued
  // sites are Rule 1 already, which is why this replaced a rule of its own.
  'Entity',
  // Each named by exactly one slot and referenced by nothing else, so they are
  // group-2 value targets by the ordinary test. They were a slot-keyed rule
  // ("cardinality splits a family") until 2026-09-11; range keys say the same
  // thing without a second way to spell an override.
  'SpecimenCreationActivity',           // Specimen.creation_activity
  'DimensionalObservationSet',          // Specimen.dimensional_measures
]);

/**
 * **ORDER IS SEMANTIC, AND IT IS PRECEDENCE — NOT PEDAGOGY.** The first entry
 * whose `when` returns true decides.
 *
 * These are two different orders for two different purposes and must not be
 * conflated. Here, an exception has to come BEFORE the rule it defeats or it
 * never fires. Taught, the default comes first and the exception second, so a
 * reader meets the ordinary case before the one that breaks it — that order is
 * the legend's, reconstructed from `parentRule`.
 *
 * What precedence encodes:
 *   - `association` precedes Rule 1 because it exists to DEFEAT it.
 *   - `single-value-owns-fwd` precedes `single-value-belongs-to-bkwd` for the
 *     same reason: it is that rule's exception.
 *   - `single-value-belongs-to-bkwd` is last and total: it is the default.
 *
 * Reordering entries silently changes classification. `tsc` cannot catch that;
 * the schema-sweeping tests in `containmentGraph.test.ts` can, and do.
 */
export const OWNERSHIP_RULES = [
  {
    id: 'association',
    when: ({ slotName }) => ASSOCIATION_SLOTS.has(slotName),
    verdict: 'association',
    text: 'A named association: the slot connects two things without either owning '
      + 'the other. Both ends are arrowed. Listed explicitly, because every other rule '
      + 'would read it as ownership.',
  },
  {
    id: 'multivalue-owns-fwd',
    when: ({ multivalued }) => multivalued,
    verdict: 'own-fwd',
    text: 'Rule 1: a multi-valued slot pointing at a class means the owner has-a '
      + 'collection of them, so ownership runs forward: owner → range.',
  },
  {
    id: 'single-value-owns-fwd',
    when: ({ range }) => SINGLE_VALUE_OWNER_TARGETS.has(range),
    verdict: 'own-fwd',
    parentRule: 'single-value-belongs-to-bkwd',
    text: 'Exception to Rule 2: a single-valued slot pointing at a range that is found '
      + 'only by way of its holder (Quantity, TimePoint, and the like) is forward ownership '
      + '— the holder is where the value lives, so it is not a pointer out to something else.',
  },
  {
    id: 'single-value-belongs-to-bkwd',
    when: () => true,                   // the default; must stay last
    verdict: 'own-bkwd',
    text: 'Rule 2: a single-valued slot pointing at another ENTITY reads as a foreign key, '
      + 'so ownership runs BACKWARD: the target owns the source, not the other way round.',
  },
  {
    /*
     * Rule 3 is NOT a classifier branch and must not become one: it is a
     * second pass in `buildContainmentGraph` over the forward edges the
     * classifier produced, walking `subtreeOf(range)`. It appears here only so
     * its text and legend group come from the same table as every other rule.
     * `when` is deliberately absent — see RuleSpec.
     */
    id: 'child-following-parent',
    verdict: 'own-fwd',
    text: 'Rule 3: a slot whose range is a parent class accepts any of its subclasses, so '
      + 'whatever owns the parent through that slot owns each subclass too. These '
      + 'edges are induced from the declared one, not read from a slot of their own.',
  },
] as const satisfies readonly RuleSpec[];

/**
 * Classify one slot, reporting which rule fired.
 *
 * A fold over `OWNERSHIP_RULES`. **The classifier must always explain itself**
 * — having it report which rule fired, and the legend render pairs grouped by
 * rule, is what made the original incoherence visible in the first place.
 */
export function classify(facts: SlotFacts): { verdict: OwnershipVerdict; rule: OwnershipRule } {
  for (const rule of OWNERSHIP_RULES as readonly RuleSpec[]) {
    if (rule.when?.(facts)) return { verdict: rule.verdict, rule: rule.id };
  }
  // Unreachable: `single-value-belongs-to-bkwd` matches everything. Thrown
  // rather than defaulted, per CLAUDE.md "fail loudly" — a miss here means
  // someone removed or reordered the total rule.
  throw new Error(
    `No ownership rule matched ${facts.slotName}: ${facts.range}`
    + ` (multivalued=${facts.multivalued}). The last rule must be total.`,
  );
}

/** Human-readable statement of each rule, for the legend. A projection. */
export const OWNERSHIP_RULE_TEXT = Object.fromEntries(
  OWNERSHIP_RULES.map(r => [r.id, r.text]),
) as Record<OwnershipRule, string>;

/**
 * The rules in TEACHING order: each default followed by its exceptions.
 *
 * The other projection of the same table, and the counterpart to the array's
 * own order. `OWNERSHIP_RULES` is PRECEDENCE — an exception has to come before
 * the rule it defeats or it never fires. A reader wants the opposite: the
 * ordinary case, then the case that breaks it. So:
 *
 *   precedence  association, Rule 1, Rule 2's exception, Rule 2, Rule 3
 *   teaching    association, Rule 1, Rule 2, its exception, Rule 3
 *
 * Derived rather than written out, so a rule added to the table appears here
 * without a second list to keep in step. Exceptions are lifted out and
 * re-inserted after their `parentRule`; anything without one keeps its
 * relative position.
 */
export const OWNERSHIP_RULES_TEACHING_ORDER: readonly RuleSpec[] = (() => {
  const all = OWNERSHIP_RULES as readonly RuleSpec[];
  const out: RuleSpec[] = [];
  for (const r of all.filter(x => x.parentRule === undefined)) {
    out.push(r, ...all.filter(x => x.parentRule === r.id));
  }
  return out;
})();

/**
 * Where a rule sits when the rules are TAUGHT rather than applied. Backs the
 * legend's ordering; see `OWNERSHIP_RULES_TEACHING_ORDER`.
 */
export function teachingRank(rule: OwnershipRule): number {
  const i = OWNERSHIP_RULES_TEACHING_ORDER.findIndex(r => r.id === rule);
  return i < 0 ? OWNERSHIP_RULES_TEACHING_ORDER.length : i;
}

/** The rule an entry is an exception TO, if any. Backs the legend's indent. */
export function parentRuleOf(rule: OwnershipRule): OwnershipRule | undefined {
  return (OWNERSHIP_RULES as readonly RuleSpec[]).find(r => r.id === rule)?.parentRule;
}

/**
 * Compile-time proof that `OwnershipRule` and the array's ids stay in step.
 * Adding a rule to the union without adding an entry breaks this; the reverse
 * is caught by `RuleSpec['id']`.
 */
type RuleIdsInArray = (typeof OWNERSHIP_RULES)[number]['id'];
type AssertEqual<A, B> = [A] extends [B] ? ([B] extends [A] ? true : never) : never;
export const RULE_IDS_MATCH_UNION: AssertEqual<RuleIdsInArray, OwnershipRule> = true;
