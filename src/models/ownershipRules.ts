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
 * The acceptance criterion is below and pinned by `ownershipRules.test.ts`;
 * see docs/OWNERSHIP_CLASSIFICATION.md for what the rules MEAN, which is the
 * thing to read first. (⚠️ that doc still describes the pre-2026-09-13 scheme
 * — rewriting it is TASKS `ownership-doc-rewrite`.)
 *
 * ---
 *
 * **The acceptance criterion, and why it is written down here.**
 *
 * `association` — an edge kind that is dashed, arrowed at BOTH ends, claims no
 * ownership, and yet layers exactly like `own-bkwd` — must be expressible by
 * adding one entry to `OWNERSHIP_VERDICTS` and one to `OWNERSHIP_RULES`, and
 * touching nothing else. That is what makes it restorable from a specification
 * rather than from git history. Its rule entry is COMMENTED OUT at the foot of
 * `OWNERSHIP_RULES` rather than deleted; restoring it means uncommenting it
 * AND moving it to the front, because unlike an exception it defeats Rule 1
 * outright and so has to be reached first.
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
 * Note it is still an `OwnershipVerdict` and an edge kind — only the RULE of
 * that name is gone, so `verdict === 'association'` comparisons stay live.
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
  | 'owns-target-forward-by-entity'            // the default: an attribute owns what it points at
  | 'belongs-to-target-backward-by-entity'     // exception, keyed by RANGE: referred-to entities
  | 'belongs-to-target-backward-by-attribute'  // exception, keyed by CLASS.SLOT: named back-pointers
  | 'child-following-parent';     // induced, not a slot rule: a range includes its subtree
// `association` is NOT here: the rule is commented out in OWNERSHIP_RULES
// (2026-09-11) because no slot classifies as it. The VERDICT of the same name
// survives on `OwnershipVerdict`, which is a different thing — `=== 'association'`
// comparisons against a verdict or an edge kind are still live and correct.

/** What the classifier knows about one slot. */
export interface SlotFacts {
  slotName: string;
  range: string;
  /**
   * The class the slot is DECLARED on. Required, because
   * `belongs-to-target-backward-by-attribute` is keyed `Class.slot`: a bare slot name would
   * apply at every class declaring it, which is the hazard that made the old
   * slot-name overrides dangerous (`performed_by`, 11 sites). Two of the five
   * back-pointers are named `part_of`, so this is load-bearing today, not a
   * precaution — keying on the name alone would flip a future `Visit.part_of`
   * silently.
   */
  declaredOn: string;
  /**
   * Whether the slot is multi-valued.
   *
   * **Available and deliberately unused, since 2026-09-13.** Cardinality used
   * to BE the rule — multi-valued meant forward, single-valued meant backward,
   * and 51 of the 60 single-valued sites then had to be flipped back by an
   * exception list. Dropping it changed no edge on this schema (149 declared,
   * 10 induced, verified both ways), so what it was really encoding was a
   * correlation, not the ownership itself. Carried for the same reason as
   * `required`: a future rule that wants it finds the plumbing here.
   */
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
  /** The rule's name, as the legend and the tour say it. */
  label: string;
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
   * The rule this one is an EXCEPTION to: it REVISES that rule's verdict for
   * the slots it matches, rather than competing for them.
   *
   * Both structural and presentational, and the two agree because they are the
   * same claim. `classify` applies an exception only to a slot its parent
   * already claimed, so a rule can be stated plainly and refined afterwards;
   * the legend indents on the same field, so what a reader sees nested is
   * exactly what the classifier treats as a refinement.
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
 * **Two exception sets, keyed differently on purpose**, and the difference is
 * the whole reason there are two rules rather than one list of ten. A RANGE
 * key says "this entity is always referred to, wherever it is pointed at". A
 * `Class.slot` key says "this one attribute is a back-pointer", and says
 * nothing about its range — which matters, because both ranges in the second
 * set are OWNED by some other attribute (see that set's comment). Merging them
 * would need the entity key to carry an exception of its own.
 */

// Empty since 2026-09-11 (TASKS `ownership-rules`). Kept as the worked example
// proving edge kinds are expressible as configuration — see the module header,
// and OWNERSHIP_CLASSIFICATION.md on when a schema needs an association edge.
export const ASSOCIATION_SLOTS = new Set<string>([]);

/**
 * **Entities that are referred to rather than contained.** Pointing at one of
 * these never means owning it: they are the shared, independently-existing
 * things of this model, looked up rather than held. 55 attributes point at the
 * five of them.
 *
 * Keyed by RANGE, so the claim is about the ENTITY and holds at every site.
 * That is the safe key — it cannot silently capture an unrelated slot the way
 * a bare slot name can.
 *
 * All five are leaf classes (no subclasses), which is what keeps the induced
 * rule forward-only: there is no subtree under a referred-to entity for
 * ownership to be induced across. Re-check that after a schema sync — a
 * subclass added under any of these is the one change that would invalidate
 * `child-following-parent`'s restriction.
 */
export const REFERRED_TO_ENTITIES = new Set<string>([
  'Participant',      // 21 attributes point at it
  'Visit',            // 18
  'Organization',     // 14
  'ImagingStudy',     // 1
  'Person',           // 1
]);

/**
 * **Individual attributes that point back at an owner.** Five named
 * back-pointers: the attribute refers, and the entity it is declared on is the
 * one being owned.
 *
 * Keyed `Class.slot` and NOT by range, because these ranges are not
 * referred-to entities — each is genuinely owned, by exactly one other
 * attribute:
 *
 *   - `QuestionnaireItem`  is owned by `Questionnaire.items`, and referred to
 *     by the three entries below.
 *   - `ResearchStudy`      is owned by `ResearchStudyCollection.entries`, and
 *     referred to by the two entries below.
 *
 * So a range key would be wrong here, not merely risky: it would strip those
 * two entities of the ownership they do have. The fully-qualified key is also
 * what keeps `part_of` honest — two different classes declare one, and a bare
 * `part_of` would flip any future third site silently.
 */
export const NAMED_BACK_POINTERS = new Set<string>([
  'QuestionnaireItem.part_of',                        // → QuestionnaireItem (self)
  'QuestionnaireResponseItem.has_questionnaire_item', // → QuestionnaireItem
  'SdohObservation.related_questionnaire_item',       // → QuestionnaireItem
  'ResearchStudy.part_of',                            // → ResearchStudy (self)
  'Participant.member_of_research_study',             // → ResearchStudy
]);

/**
 * **One rule, two exceptions, and an induced pass that is not a slot rule.**
 *
 * The order is the order you would teach them in, which is also the order
 * `classify` applies: state the rule, then say when it does not hold. An
 * exception is only ever offered a slot its parent already claimed, so it does
 * not restate the parent's condition — it revises the verdict already reached
 * (Siggie, 2026-09-11).
 *
 * **The rules are not numbered.** They were, when cardinality decided ownership
 * and the numbers encoded which test ran first. Now the default is total and
 * the two exceptions never compete with each other, so there is no precedence
 * for a number to carry — and `child-following-parent` is not a slot rule at
 * all, so numbering three of four sections would invite the reader to look for
 * a fourth. The legend and the tour quote `label` instead, which stays correct
 * if the order ever changes again.
 *
 * Reordering the entries still changes classification — `tsc` cannot catch
 * that; the schema-sweeping tests in `containmentGraph.test.ts` can, and do.
 */
export const OWNERSHIP_RULES = [
  {
    id: 'owns-target-forward-by-entity',
    label: 'Owns target / forward arrow / by entity',
    when: () => true,                   // the default: total, so it matches anything
    verdict: 'own-fwd',
    text: 'An attribute owns the entity it points at: the thing it points at is part of '
      + 'it, so ownership runs forward, from the entity declaring the attribute to its '
      + 'target.',
  },
  {
    id: 'belongs-to-target-backward-by-entity',
    label: 'Belongs to target / backward arrow / by entity',
    when: ({ range }) => REFERRED_TO_ENTITIES.has(range),
    verdict: 'own-bkwd',
    parentRule: 'owns-target-forward-by-entity',
    text: 'Referred-to entities are pointed at rather than contained — a Participant or a '
      + 'Visit exists in its own right and is looked up, not held. Pointing at one means '
      + 'belonging to it, so ownership runs backward. This is said about the ENTITY, so it '
      + 'holds wherever that entity is pointed at.',
  },
  {
    id: 'belongs-to-target-backward-by-attribute',
    label: 'Belongs to target / backward arrow / by attribute',
    when: ({ declaredOn, slotName }) => NAMED_BACK_POINTERS.has(`${declaredOn}.${slotName}`),
    verdict: 'own-bkwd',
    parentRule: 'owns-target-forward-by-entity',
    text: 'Named back-pointers are individual attributes that point back at an owner rather '
      + 'than down at something owned. This is said about the ATTRIBUTE, not its target: '
      + 'these targets are themselves owned, each by one other attribute, so the same entity '
      + 'is both owned and referred to depending on which attribute you arrive by.',
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
    label: 'Owns target / forward arrow / induced',
    verdict: 'own-fwd',
    text: 'An attribute whose target has subclasses accepts any of them, so whatever owns '
      + 'the target owns each subclass too. These edges are induced from a declared one '
      + 'rather than read from an attribute of their own, which is why they appear on the '
      + 'diagram with no attribute behind them.',
  },
  /* {
    id: 'association',
    label: 'Neither owns the other',
    when: ({ slotName }) => ASSOCIATION_SLOTS.has(slotName),
    verdict: 'association',
    text: 'A named association: the slot connects two things without either owning '
      + 'the other. Both ends are arrowed. Listed explicitly, because every other rule '
      + 'would read it as ownership.',
  }, */
] as const satisfies readonly RuleSpec[];

/**
 * Classify one slot, reporting which rule fired.
 *
 * **Match a rule, then let that rule's exceptions revise it.** Two passes, and
 * they are the two halves of how the rules are stated: a rule says what is
 * ordinarily true, an exception says when it is not. Running them that way is
 * what lets `OWNERSHIP_RULES` be in the order the rules are TAUGHT rather than
 * an order contrived so that exceptions get first refusal (Siggie, 2026-09-11).
 *
 * An exception is only ever offered a slot its parent already claimed, so it
 * does not need to restate its parent's condition. The two exceptions are
 * checked together rather than first-match, so a future overlap between them
 * fails loudly instead of resolving to whichever was declared first.
 *
 * **The classifier must always explain itself** — having it report which rule
 * fired, and the legend render pairs grouped by rule, is what made the original
 * incoherence visible in the first place. An exception reports ITSELF, not its
 * parent: the legend groups by the rule that settled the verdict.
 */
export function classify(facts: SlotFacts): { verdict: OwnershipVerdict; rule: OwnershipRule } {
  const rules = OWNERSHIP_RULES as readonly RuleSpec[];
  for (const rule of rules) {
    if (rule.parentRule !== undefined) continue;      // offered only via its parent
    if (!rule.when?.(facts)) continue;
    /*
     * ALL matching exceptions, not the first — there are two now, and they are
     * keyed differently (by range, by `Class.slot`). They are disjoint on this
     * schema, but nothing structural makes them so: adding a referred-to
     * ENTITY that some ATTRIBUTE entry also names would make both fire, and a
     * `find()` would pick one silently and report the wrong rule to the legend.
     * The verdict would happen to be right, which is what makes it the kind of
     * bug that survives. Fail instead.
     */
    const hits = rules.filter(r => r.parentRule === rule.id && r.when?.(facts));
    if (hits.length > 1) {
      throw new Error(
        `${facts.declaredOn}.${facts.slotName} → ${facts.range} matches `
        + `${hits.length} exceptions to ${rule.id} (${hits.map(h => h.id).join(', ')}). `
        + 'Exceptions to one rule must be disjoint; drop the redundant entry.',
      );
    }
    const [exception] = hits;
    return exception
      ? { verdict: exception.verdict, rule: exception.id }
      : { verdict: rule.verdict, rule: rule.id };
  }
  // Unreachable: `owns-target-forward-by-entity` matches everything. Thrown rather than
  // defaulted, per CLAUDE.md "fail loudly" — a miss here means someone removed
  // the total rule or gave it a `parentRule`.
  throw new Error(
    `No ownership rule matched ${facts.declaredOn}.${facts.slotName}: ${facts.range}.`
    + ' One rule must be total.',
  );
}

/** Human-readable statement of each rule, for the legend. A projection. */
export const OWNERSHIP_RULE_TEXT = Object.fromEntries(
  OWNERSHIP_RULES.map(r => [r.id, r.text]),
) as Record<OwnershipRule, string>;

/** Each rule's name, for the legend. A projection. */
export const OWNERSHIP_RULE_LABEL = Object.fromEntries(
  OWNERSHIP_RULES.map(r => [r.id, r.label]),
) as Record<OwnershipRule, string>;

/**
 * Where a rule sits in the listing — which is just where it sits in the table,
 * now that there is only one order (see `OWNERSHIP_RULES`).
 */
export function ruleRank(rule: OwnershipRule): number {
  const i = (OWNERSHIP_RULES as readonly RuleSpec[]).findIndex(r => r.id === rule);
  return i < 0 ? OWNERSHIP_RULES.length : i;
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
