import { describe, test, expect } from 'vitest';
import {
  OWNERSHIP_RULES, OWNERSHIP_VERDICTS, OWNERSHIP_RULE_TEXT,
  classify, ASSOCIATION_SLOTS, SINGLE_VALUE_OWNER_TARGETS,
  CARDINALITY_SPLIT_OWN_FWD, BACKWARD_DESPITE_MULTIVALUED, ENTITY_ROOT,
  type RuleSpec, type VerdictSpec, type SlotFacts, type OwnershipRule,
} from '../models/ownershipRules';
import { EDGE_STYLE } from '../explore/edgeStyle';

/**
 * The declaration that replaced five hand-maintained copies of the same rule
 * (TASKS `ownership-rules-declarative`). See docs/OWNERSHIP_RULES_PLAN.md.
 *
 * These tests are about the TABLE — that it is well-formed, that order is
 * honoured, and above all that it can express an edge kind it does not
 * currently contain. What the rules MEAN, and how they classify the real
 * schema, is `containmentGraph.test.ts`, which sweeps live slot data.
 */
describe('the ownership rule declaration', () => {
  test('every rule has text, and the projection matches the table', () => {
    for (const r of OWNERSHIP_RULES) {
      expect(r.text.length, r.id).toBeGreaterThan(20);
      expect(OWNERSHIP_RULE_TEXT[r.id], r.id).toBe(r.text);
    }
    expect(Object.keys(OWNERSHIP_RULE_TEXT).sort())
      .toEqual(OWNERSHIP_RULES.map(r => r.id).sort());
  });

  test('rule ids are unique', () => {
    const ids = OWNERSHIP_RULES.map(r => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test('the last classifier rule is total, so classify() always resolves', () => {
    const evaluated = (OWNERSHIP_RULES as readonly RuleSpec[]).filter(r => r.when);
    const last = evaluated[evaluated.length - 1];
    expect(last.id).toBe('fk-inversion');
    // Whatever it is handed, it fires.
    expect(last.when!({ slotName: 'zzz', range: 'Nothing', multivalued: false })).toBe(true);
    expect(last.when!({ slotName: 'zzz', range: 'Nothing', multivalued: true })).toBe(true);
  });

  test('range-subtree carries text but is NOT evaluated by the classifier', () => {
    // Rule 3 is a second pass in buildContainmentGraph, not a branch. If it
    // ever gained a `when`, it would start intercepting declared slots and
    // silently change classification.
    const r = (OWNERSHIP_RULES as readonly RuleSpec[]).find(x => x.id === 'range-subtree')!;
    expect(r.when).toBeUndefined();
    expect(r.text).toContain('Rule 3');
  });

  /*
   * Order is semantic: each of these overrides fires only because it precedes
   * the cardinality rule that would otherwise claim the slot. A reorder would
   * pass every other test in this file.
   */
  describe('order is honoured', () => {
    const facts = (o: Partial<SlotFacts>): SlotFacts =>
      ({ slotName: 'x', range: 'SomeClass', multivalued: false, ...o });

    test('backward-multivalued beats Rule 1', () => {
      const slotName = [...BACKWARD_DESPITE_MULTIVALUED][0];
      expect(classify(facts({ slotName, multivalued: true })))
        .toEqual({ verdict: 'own-bkwd', rule: 'backward-multivalued' });
    });

    test('cardinality-split beats Rule 2', () => {
      const slotName = [...CARDINALITY_SPLIT_OWN_FWD][0];
      expect(classify(facts({ slotName, multivalued: false })))
        .toEqual({ verdict: 'own-fwd', rule: 'cardinality-split' });
    });

    test('entity-ranged beats BOTH cardinality rules', () => {
      // Single-valued would be fk-inversion; multivalued would be Rule 1.
      // Entity must win either way, or Entity is drawn as an owner.
      expect(classify(facts({ range: ENTITY_ROOT, multivalued: false })))
        .toEqual({ verdict: 'own-fwd', rule: 'entity-ranged' });
      expect(classify(facts({ range: ENTITY_ROOT, multivalued: true })))
        .toEqual({ verdict: 'own-fwd', rule: 'entity-ranged' });
    });

    test('Rule 1 beats the value-object exception', () => {
      const range = [...SINGLE_VALUE_OWNER_TARGETS][0];
      expect(classify(facts({ range, multivalued: true })).rule).toBe('multivalued');
      expect(classify(facts({ range, multivalued: false })).rule).toBe('value-object');
    });

    test('an ordinary single-valued class slot falls through to Rule 2', () => {
      expect(classify(facts({})))
        .toEqual({ verdict: 'own-bkwd', rule: 'fk-inversion' });
    });
  });

  describe('verdict specs', () => {
    test('claimsOwnership and layering are SEPARATE fields', () => {
      // For the two live verdicts they happen to correlate, which is exactly
      // the trap: a design that only ever saw these two would collapse them
      // into one field and then be unable to express association.
      for (const [id, v] of Object.entries(OWNERSHIP_VERDICTS)) {
        expect(v.claimsOwnership, id).toBe(true);
      }
      expect(OWNERSHIP_VERDICTS['own-fwd'].layering).toBe('source-first');
      expect(OWNERSHIP_VERDICTS['own-bkwd'].layering).toBe('target-first');
    });

    test('edgeStyle draws from the declaration, not a second copy', () => {
      for (const id of ['own-fwd', 'own-bkwd'] as const) {
        expect(EDGE_STYLE.kinds[id]).toBe(OWNERSHIP_VERDICTS[id]);
      }
    });
  });

  /*
   * ===================================================================
   * THE ACCEPTANCE CRITERION for TASKS `ownership-rules-declarative`.
   * ===================================================================
   *
   * `association` is the one edge kind this schema no longer produces
   * (ASSOCIATION_SLOTS emptied 2026-09-11) and the one a future schema is most
   * likely to want back. The whole point of the declaration is that restoring
   * it is DATA, not a code path: one entry in OWNERSHIP_VERDICTS, one in
   * OWNERSHIP_RULES, nothing else.
   *
   * This test builds those two entries and checks they work. It is what makes
   * "restore from the spec rather than from git history" a checkable claim
   * instead of an intention — and it is why step 3 (deleting the association
   * machinery) is allowed to proceed.
   *
   * If you are restoring association for real: copy the two objects below into
   * ownershipRules.ts, refill ASSOCIATION_SLOTS, and delete this test's
   * scaffolding. Nothing else should need to change.
   */
  describe('acceptance: association is expressible as configuration', () => {
    const ASSOCIATION_VERDICT: VerdictSpec = {
      // The load-bearing pair: claims nothing, yet layers like own-bkwd.
      claimsOwnership: false,
      layering: 'target-first',
      color: '#64748b',                 // slate, EDGE_COLORS.association
      heads: 'both',                    // arrowheads at BOTH ends
      headDirection: 'forward',
      dashed: true,
      secondary: true,
      label: 'A and B are associated',
      relationLabel: 'associated with',
    };

    const ASSOCIATION_RULE: RuleSpec = {
      id: 'association',
      // Must precede `multivalued`, which it exists to defeat.
      when: ({ slotName }) => new Set(['related_document', 'container']).has(slotName),
      verdict: 'association',
      text: OWNERSHIP_RULE_TEXT['association'],
    };

    test('the verdict spec is a well-formed VerdictSpec', () => {
      // Typing it as VerdictSpec above is half the proof; this asserts the
      // fields that make association DIFFERENT are actually representable.
      expect(ASSOCIATION_VERDICT.claimsOwnership).toBe(false);
      expect(ASSOCIATION_VERDICT.layering).toBe('target-first');
      expect(ASSOCIATION_VERDICT.heads).toBe('both');
      expect(ASSOCIATION_VERDICT.dashed).toBe(true);
    });

    test('a verdict can claim no ownership while still layering target-first', () => {
      // The combination no live verdict exhibits. If VerdictSpec ever
      // collapses these two fields, this stops compiling.
      expect(ASSOCIATION_VERDICT.claimsOwnership).toBe(false);
      expect(ASSOCIATION_VERDICT.layering)
        .toBe(OWNERSHIP_VERDICTS['own-bkwd'].layering);
    });

    test('its style matches what edgeStyle still draws for association', () => {
      // Proof that moving this object into OWNERSHIP_VERDICTS would change
      // nothing on screen: it already equals the live association style.
      const live = EDGE_STYLE.kinds.association;
      expect(live.color).toBe(ASSOCIATION_VERDICT.color);
      expect(live.heads).toBe(ASSOCIATION_VERDICT.heads);
      expect(live.headDirection).toBe(ASSOCIATION_VERDICT.headDirection);
      expect(live.dashed).toBe(ASSOCIATION_VERDICT.dashed);
      expect(live.secondary).toBe(ASSOCIATION_VERDICT.secondary);
      expect(live.label).toBe(ASSOCIATION_VERDICT.label);
    });

    test('inserting the rule ahead of Rule 1 classifies the two slots', () => {
      // Simulate the restored table: association first, then the live rules.
      const restored: readonly RuleSpec[] =
        [ASSOCIATION_RULE, ...(OWNERSHIP_RULES as readonly RuleSpec[]).filter(
          r => r.id !== 'association')];

      const classifyWith = (rules: readonly RuleSpec[], facts: SlotFacts) => {
        for (const r of rules) if (r.when?.(facts)) return { verdict: r.verdict, rule: r.id };
        throw new Error('no rule matched');
      };

      // Both are multivalued, so Rule 1 would claim them — association wins.
      for (const slotName of ['related_document', 'container']) {
        expect(classifyWith(restored, { slotName, range: 'Document', multivalued: true }))
          .toEqual({ verdict: 'association', rule: 'association' });
      }
      // And with the rule absent (today), Rule 1 does claim them.
      expect(classify({ slotName: 'related_document', range: 'Document', multivalued: true }))
        .toEqual({ verdict: 'own-fwd', rule: 'multivalued' });
    });

    test('today the set is empty, so nothing classifies as association', () => {
      expect(ASSOCIATION_SLOTS.size).toBe(0);
      const ids: OwnershipRule[] = ['association'];
      // The rule entry still exists (it carries the text the legend would
      // use); it simply never fires.
      expect(OWNERSHIP_RULES.map(r => r.id)).toEqual(expect.arrayContaining(ids));
      expect(classify({ slotName: 'related_document', range: 'Document', multivalued: true }).rule)
        .not.toBe('association');
    });
  });
});
