import { describe, test, expect } from 'vitest';
import {
  OWNERSHIP_RULES, OWNERSHIP_VERDICTS, OWNERSHIP_RULE_TEXT,
  OWNERSHIP_RULE_LABEL, parentRuleOf,
  classify, ASSOCIATION_SLOTS, SINGLE_VALUE_OWNER_TARGETS, ENTITY_ROOT,
  type RuleSpec, type VerdictSpec, type SlotFacts, type OwnershipRule,
  type OwnershipVerdict,
} from '../models/ownershipRules';
import { EDGE_STYLE } from '../explore/edgeStyle';

/**
 * The declaration that replaced five hand-maintained copies of the same rule
 * (TASKS `ownership-rules`). See docs/OWNERSHIP_RULES_PLAN.md.
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

  test('classify() always resolves, whatever it is handed', () => {
    // There is a total rule, so the throw at the end of classify() is dead.
    // It no longer has to be LAST: since 2026-09-11 the table is in teaching
    // order and Rule 2 sits in the middle, ahead of its own exception.
    for (const multivalued of [true, false]) {
      expect(() => classify({ slotName: 'zzz', range: 'Nothing', multivalued }))
        .not.toThrow();
    }
    expect(classify({ slotName: 'zzz', range: 'Nothing', multivalued: false }).rule)
      .toBe('single-value-belongs-to-bkwd');
  });

  test('child-following-parent carries text but is NOT evaluated by the classifier', () => {
    // Rule 3 is a second pass in buildContainmentGraph, not a branch. If it
    // ever gained a `when`, it would start intercepting declared slots and
    // silently change classification.
    const r = (OWNERSHIP_RULES as readonly RuleSpec[])
      .find(x => x.id === 'child-following-parent')!;
    expect(r.when).toBeUndefined();
    expect(r.text).toContain('Rule 3');
  });

  /*
   * Three classifier rules, down from seven (TASKS `ownership-rules`,
   * 2026-09-11). `entity-ranged`, `cardinality-split` and
   * `backward-multivalued` were deleted: the first two because putting their
   * ranges in SINGLE_VALUE_OWNER_TARGETS gives the identical verdict, and the
   * third because its only member is a self-loop, whose verdict is never
   * observable. See docs/OWNERSHIP_CLASSIFICATION.md.
   */
  test('three classifier rules plus Rule 3, in the order they are taught', () => {
    expect(OWNERSHIP_RULES.map(r => r.id)).toEqual([
      'multivalue-owns-fwd',
      'single-value-belongs-to-bkwd',
      'single-value-owns-fwd',          // its exception, indented in the legend
      'child-following-parent',
    ]);
  });

  /*
   * What each rule actually classifies. The ORDER these depend on is asserted
   * separately, below.
   */
  describe('the rules classify what they say they do', () => {
    const facts = (o: Partial<SlotFacts>): SlotFacts =>
      ({ slotName: 'x', range: 'SomeClass', multivalued: false, ...o });

    test('Rule 1 beats the single-value exception', () => {
      const range = [...SINGLE_VALUE_OWNER_TARGETS][0];
      expect(classify(facts({ range, multivalued: true })).rule).toBe('multivalue-owns-fwd');
      expect(classify(facts({ range, multivalued: false })).rule).toBe('single-value-owns-fwd');
    });

    test('an ordinary single-valued class slot falls through to Rule 2', () => {
      expect(classify(facts({})))
        .toEqual({ verdict: 'own-bkwd', rule: 'single-value-belongs-to-bkwd' });
    });

    /*
     * What the deleted `entity-ranged` rule bought, now bought by a range
     * membership instead. Both cardinalities must come out forward, or Entity
     * — the universal root — is drawn as the owner of Document and Observation.
     */
    test('Entity is forward at BOTH cardinalities, via the range set', () => {
      expect(SINGLE_VALUE_OWNER_TARGETS.has(ENTITY_ROOT)).toBe(true);
      expect(classify(facts({ range: ENTITY_ROOT, multivalued: false })))
        .toEqual({ verdict: 'own-fwd', rule: 'single-value-owns-fwd' });
      expect(classify(facts({ range: ENTITY_ROOT, multivalued: true })))
        .toEqual({ verdict: 'own-fwd', rule: 'multivalue-owns-fwd' });
    });

    /*
     * `required` is carried on SlotFacts but read by no rule (step 5 of the
     * plan). If a rule ever starts reading it, this fails and whoever added it
     * gets to say so out loud.
     */
    test('required changes no verdict', () => {
      for (const range of ['SomeClass', ENTITY_ROOT, [...SINGLE_VALUE_OWNER_TARGETS][0]]) {
        for (const multivalued of [true, false]) {
          expect(classify(facts({ range, multivalued, required: true })))
            .toEqual(classify(facts({ range, multivalued, required: false })));
        }
      }
    });
  });

  /*
   * ONE order now (Siggie, 2026-09-11). The table is in the order the rules are
   * TAUGHT, and `classify` matches a rule then lets that rule's exceptions
   * revise the verdict — so an exception no longer has to jump the queue, and
   * there is no second order to derive.
   */
  describe('an exception revises its parent rather than preceding it', () => {
    test('the table is in teaching order, exception BELOW its parent', () => {
      const ids = OWNERSHIP_RULES.map(r => r.id);
      expect(ids.indexOf('single-value-owns-fwd'))
        .toBeGreaterThan(ids.indexOf('single-value-belongs-to-bkwd'));
    });

    test('the exception still wins, even though it runs later', () => {
      // The whole point: ordering it after Rule 2 must not cost it the slot.
      const range = [...SINGLE_VALUE_OWNER_TARGETS][0];
      expect(classify({ slotName: 'x', range, multivalued: false }))
        .toEqual({ verdict: 'own-fwd', rule: 'single-value-owns-fwd' });
    });

    test('an exception is never offered a slot its parent did not claim', () => {
      /*
       * `single-value-owns-fwd` tests only the RANGE — it says nothing about
       * cardinality, because by the time it runs "single-valued" is already
       * established. That is only safe while exceptions are gated on their
       * parent, so a multivalued slot with a value-object range must come out
       * Rule 1, not the exception.
       */
      const range = [...SINGLE_VALUE_OWNER_TARGETS][0];
      expect(classify({ slotName: 'x', range, multivalued: true }))
        .toEqual({ verdict: 'own-fwd', rule: 'multivalue-owns-fwd' });
    });

    test('a parentRule always names a rule that exists, and never itself', () => {
      const ids = new Set(OWNERSHIP_RULES.map(r => r.id as OwnershipRule));
      for (const r of OWNERSHIP_RULES as readonly RuleSpec[]) {
        if (r.parentRule === undefined) continue;
        expect(ids.has(r.parentRule)).toBe(true);
        expect(r.parentRule).not.toBe(r.id);
        // The accessor the legend indents on must agree with the table.
        expect(parentRuleOf(r.id)).toBe(r.parentRule);
      }
      // ...and reports nothing for a rule that is not an exception.
      expect(parentRuleOf('multivalue-owns-fwd')).toBeUndefined();
    });

    test('an exception never nests under another exception', () => {
      // classify() offers exceptions one level deep. A chain would silently
      // stop firing rather than fail, so it is refused here instead.
      const byId = new Map(OWNERSHIP_RULES.map(r => [r.id as OwnershipRule, r]));
      for (const r of OWNERSHIP_RULES as readonly RuleSpec[]) {
        if (r.parentRule === undefined) continue;
        expect(byId.get(r.parentRule)!.parentRule, r.id).toBeUndefined();
      }
    });

    test('exactly one rule is total, and it is not an exception', () => {
      const total = (OWNERSHIP_RULES as readonly RuleSpec[]).filter(
        r => r.when?.({ slotName: 'zzz', range: 'Nothing', multivalued: false })
          && r.when?.({ slotName: 'zzz', range: 'Nothing', multivalued: true }));
      expect(total.map(r => r.id)).toEqual(['single-value-belongs-to-bkwd']);
      expect(total[0].parentRule).toBeUndefined();
    });
  });

  describe('every rule has a human-readable name', () => {
    test('each label is prose, unique, and matches the projection', () => {
      const labels = OWNERSHIP_RULES.map(r => r.label);
      for (const r of OWNERSHIP_RULES) {
        expect(r.label, r.id).toMatch(/^[A-Z]/);       // a name, not an id
        expect(r.label, r.id).toContain(' ');
        expect(OWNERSHIP_RULE_LABEL[r.id], r.id).toBe(r.label);
      }
      expect(new Set(labels).size).toBe(labels.length);
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
   * THE ACCEPTANCE CRITERION for TASKS `ownership-rules`.
   * ===================================================================
   *
   * `association` is the one edge kind this schema no longer produces and the
   * one a future schema is most likely to want back. Its rule entry is
   * COMMENTED OUT at the foot of OWNERSHIP_RULES (Siggie, 2026-09-11) rather
   * than deleted, so restoring it is: uncomment, move it above Rule 1, refill
   * ASSOCIATION_SLOTS, add one entry to OWNERSHIP_VERDICTS, put `association`
   * back on the OwnershipRule union. No new code path.
   *
   * These tests build the two objects that restoration needs and check they
   * work, which is what makes "restore from the spec rather than from git
   * history" a checkable claim instead of an intention.
   *
   * NOTE ON ORDER: association is NOT an exception — it does not refine
   * another rule's verdict, it defeats Rule 1 outright for its slots. So it
   * carries no `parentRule` and must simply be placed FIRST in the table. That
   * is the one thing the reclassify-exceptions design did not make automatic,
   * and the last test here is what says so.
   */
  describe('acceptance: association is expressible as configuration', () => {
    /** The rule ids plus the one this schema does not currently produce. */
    type RestorableRule = OwnershipRule | 'association';
    type RestorableSpec = Omit<RuleSpec, 'id' | 'verdict'>
      & { id: RestorableRule; verdict: OwnershipVerdict };

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

    /* Kept in step with the commented-out entry in ownershipRules.ts. */
    const ASSOCIATION_RULE: RestorableSpec = {
      id: 'association',
      label: 'Neither owns the other',
      when: ({ slotName }) => new Set(['related_document', 'container']).has(slotName),
      verdict: 'association',
      text: 'A named association: the slot connects two things without either owning '
        + 'the other. Both ends are arrowed. Listed explicitly, because every other rule '
        + 'would read it as ownership.',
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

    /**
     * `classify`, reimplemented over an arbitrary table: match a rule, then
     * let that rule's exceptions revise it. Deliberately a COPY of the live
     * fold rather than a call to it, because what is under test is a table the
     * live one does not contain.
     */
    const classifyWith = (rules: readonly RestorableSpec[], facts: SlotFacts) => {
      for (const rule of rules) {
        if (rule.parentRule !== undefined) continue;
        if (!rule.when?.(facts)) continue;
        const exc = rules.find(r => r.parentRule === rule.id && r.when?.(facts));
        return exc
          ? { verdict: exc.verdict, rule: exc.id }
          : { verdict: rule.verdict, rule: rule.id };
      }
      throw new Error('no rule matched');
    };

    test('restored at the FRONT of the table, it classifies its two slots', () => {
      const restored: readonly RestorableSpec[] =
        [ASSOCIATION_RULE, ...(OWNERSHIP_RULES as readonly RuleSpec[])];

      // Both are multivalued, so Rule 1 would claim them — association wins.
      for (const slotName of ['related_document', 'container']) {
        expect(classifyWith(restored, { slotName, range: 'Document', multivalued: true }))
          .toEqual({ verdict: 'association', rule: 'association' });
      }
      // And with the rule absent (today), Rule 1 does claim them.
      expect(classify({ slotName: 'related_document', range: 'Document', multivalued: true }))
        .toEqual({ verdict: 'own-fwd', rule: 'multivalue-owns-fwd' });
    });

    test('restored at the BACK it would never fire — so placement is not free', () => {
      /*
       * The caveat that has to be written down somewhere. Exceptions revise
       * their parent and so can go anywhere; association DEFEATS Rule 1 and so
       * must precede it. Whoever restores the rule has to move it, not just
       * uncomment it — the commented entry sits at the foot of the table.
       */
      const misplaced: readonly RestorableSpec[] =
        [...(OWNERSHIP_RULES as readonly RuleSpec[]), ASSOCIATION_RULE];
      expect(classifyWith(misplaced, {
        slotName: 'related_document', range: 'Document', multivalued: true,
      })).toEqual({ verdict: 'own-fwd', rule: 'multivalue-owns-fwd' });
    });

    test('today the set is empty, so nothing classifies as association', () => {
      expect(ASSOCIATION_SLOTS.size).toBe(0);
      expect(OWNERSHIP_RULES.map(r => r.id as string)).not.toContain('association');
      expect(classify({ slotName: 'related_document', range: 'Document', multivalued: true }).verdict)
        .not.toBe('association');
    });
  });
});
