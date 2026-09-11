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
  | 'association'           // slot in ASSOCIATION_SLOTS (empty since 2026-09-11)
  | 'entity-ranged'         // range is Entity: always forward
  | 'backward-multivalued'  // slot in BACKWARD_DESPITE_MULTIVALUED
  | 'cardinality-split'     // slot in CARDINALITY_SPLIT_OWN_FWD (Exception 2b)
  | 'multivalued'           // Rule 1: multi-valued slot → class
  | 'value-object'          // Exception 2a: single-valued → no independent existence
  | 'fk-inversion'          // Rule 2: single-valued slot → other entity
  | 'range-subtree';        // Rule 3: an own-fwd slot's range includes its subclasses

/** What the classifier knows about one slot. */
export interface SlotFacts {
  slotName: string;
  range: string;
  multivalued: boolean;
}

export interface RuleSpec {
  id: OwnershipRule;
  /**
   * Fires when this returns true. `undefined` means the rule is not evaluated
   * by the classifier at all — see `range-subtree`, which is a second pass in
   * `buildContainmentGraph` and carries an entry here only for its text and
   * its legend group.
   */
  when?: (facts: SlotFacts) => boolean;
  verdict: OwnershipVerdict;
  /** Human-readable statement of the rule, for the legend. */
  text: string;
}

/*
 * The hand-curated memberships. These CANNOT be derived from the schema —
 * verified exhaustively 2026-08-21, see OWNERSHIP_CLASSIFICATION.md
 * "Exception 2a". They go stale silently on every schema sync (TASKS
 * `override-site-check`, BACKLOG "Hand-curated config rot"); collecting them
 * here gives that sync check ONE place to look instead of five, which is all
 * this module claims to do about the problem.
 *
 * Still keyed by slot name, not (class, slot) pair. Every member happening to
 * occur at exactly one class is luck, not design — it is exactly how
 * `performed_by` (11 sites) did damage when it sat in the old override list.
 */

// Empty since 2026-09-11 (TASKS `ownership-rules`). See the
// module header for why the category is kept, and OWNERSHIP_CLASSIFICATION.md
// "association — 0 edges" for what it is for.
export const ASSOCIATION_SLOTS = new Set<string>([]);

// Multivalued slots that still point UP: parent_specimen walks the derivation
// tree, so the parent owns the child.
export const BACKWARD_DESPITE_MULTIVALUED = new Set<string>(['parent_specimen']);

// Exception 2b: cardinality splits a family. Both have multivalued siblings
// that are own-fwd; dimensional_measures also ranges on a *Set. Asserted, not
// derived — a structural "collection class" test over-collects (Person,
// Questionnaire, ResearchStudyCollection).
export const CARDINALITY_SPLIT_OWN_FWD = new Set<string>([
  'creation_activity',                  // cf. processing/storage/transport_activity
  'dimensional_measures',               // cf. quality/quantity_measure
]);

// Value-object classes: single-valued slots pointing to these are forward
// ownership (the owner has-a value object), never flipped.
export const SINGLE_VALUE_OWNER_TARGETS = new Set<string>([
  'Quantity', 'TimePoint', 'TimePeriod', 'BodySite', 'CauseOfDeath',
  'QuestionnaireResponseValue',
  'QuestionnaireResponseValueDecimal', 'QuestionnaireResponseValueBoolean',
  'QuestionnaireResponseValueInteger', 'QuestionnaireResponseValueTimePoint',
  'QuestionnaireResponseValueString',
  'Substance', 'BiologicProduct',
  // Adjudicated 2026-08-19. Activity is is_a: Entity but has no identity of
  // its own (activity_type + time_duration only) and nothing references it
  // except Context.activity — so the FK-inversion default misfires on it:
  // single-valued + entity range alone made it own-bkwd ("Activity owns
  // Context"), stranding Activity at layer 0 as a false root while Context
  // sank to layer 6. Forward now: Context -> Activity, Activity at layer 7.
  'Activity',
  // Added 2026-09-11 with TASKS `ownership-rules`. A container has no
  // independent existence from the specimen in it, so `Specimen.contained_in`
  // is an Exception 2a target rather than an owner. Keyed by RANGE, so it also
  // catches `SpecimenContainer.parent_container` — a self-loop, drawn as a ⟲
  // marker, so nothing about it changes. This is also what keeps the graph
  // acyclic now that ASSOCIATION_SLOTS is empty; see containmentGraph.test.ts,
  // "contained_in must stay forward".
  'SpecimenContainer',
]);

/**
 * **ORDER IS SEMANTIC.** The first entry whose `when` returns true decides.
 *
 * The order encodes real dependencies, not preference:
 *   - `association` precedes `multivalued` because it exists to DEFEAT it.
 *   - `backward-multivalued` and `cardinality-split` likewise override the
 *     cardinality rules that would otherwise claim their slots.
 *   - `entity-ranged` precedes both cardinality rules: Entity is the universal
 *     root, so a slot pointing AT it is never a foreign key back to an owner.
 *     Without this, Rule 2 would reverse the single-valued `focus` sites and
 *     draw Entity as the owner of Document/Observation, which is backwards.
 *   - `fk-inversion` is last and total: it is the default.
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
    id: 'backward-multivalued',
    when: ({ slotName }) => BACKWARD_DESPITE_MULTIVALUED.has(slotName),
    verdict: 'own-bkwd',
    text: 'Multivalued, but pointing UP rather than down: parent_specimen '
      + 'walks the derivation tree, so the parent owns the child and ownership runs backward.',
  },
  {
    id: 'cardinality-split',
    when: ({ slotName }) => CARDINALITY_SPLIT_OWN_FWD.has(slotName),
    verdict: 'own-fwd',
    text: 'Cardinality splits a family. These are single-valued but have '
      + 'multivalued siblings that are forward-owned, so they are forced forward to keep the '
      + 'family consistent (Exception 2b).',
  },
  {
    id: 'entity-ranged',
    when: ({ range }) => range === ENTITY_ROOT,
    verdict: 'own-fwd',
    text: 'The range is Entity, the universal root. A slot pointing at Entity is '
      + 'never a foreign key back to an owner, so ownership always runs forward regardless of '
      + 'cardinality — otherwise single-valued sites would draw Entity as the owner.',
  },
  {
    id: 'multivalued',
    when: ({ multivalued }) => multivalued,
    verdict: 'own-fwd',
    text: 'A multi-valued slot pointing at a class means the owner has-a collection '
      + 'of them, so ownership runs forward: owner → range.',
  },
  {
    id: 'value-object',
    when: ({ range }) => SINGLE_VALUE_OWNER_TARGETS.has(range),
    verdict: 'own-fwd',
    text: 'A single-valued slot pointing at a target with NO INDEPENDENT EXISTENCE '
      + '(Quantity, TimePoint, and the like) is forward ownership — the value belongs to '
      + 'whoever holds it (Exception 2a).',
  },
  {
    id: 'fk-inversion',
    when: () => true,                   // the default; must stay last
    verdict: 'own-bkwd',
    text: 'A single-valued slot pointing at another ENTITY reads as a foreign key, so '
      + 'ownership runs BACKWARD: the target owns the source, not the other way round.',
  },
  {
    /*
     * Rule 3 is NOT a classifier branch and must not become one: it is a
     * second pass in `buildContainmentGraph` over the forward edges the
     * classifier produced, walking `subtreeOf(range)`. It appears here only so
     * its text and legend group come from the same table as every other rule.
     * `when` is deliberately absent — see RuleSpec.
     */
    id: 'range-subtree',
    verdict: 'own-fwd',
    text: 'A slot whose range is a parent class accepts any of its subclasses, so '
      + 'whatever owns the parent through that slot owns each subclass too (Rule 3). These '
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
  // Unreachable: `fk-inversion` matches everything. Thrown rather than
  // defaulted, per CLAUDE.md "fail loudly" — a miss here means someone removed
  // or reordered the total rule.
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
 * Compile-time proof that `OwnershipRule` and the array's ids stay in step.
 * Adding a rule to the union without adding an entry breaks this; the reverse
 * is caught by `RuleSpec['id']`.
 */
type RuleIdsInArray = (typeof OWNERSHIP_RULES)[number]['id'];
type AssertEqual<A, B> = [A] extends [B] ? ([B] extends [A] ? true : never) : never;
export const RULE_IDS_MATCH_UNION: AssertEqual<RuleIdsInArray, OwnershipRule> = true;
