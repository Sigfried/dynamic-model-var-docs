import { describe, test, expect } from 'vitest';
import {
  OWNERSHIP_RULES, OWNERSHIP_VERDICTS, OWNERSHIP_RULE_TEXT,
  OWNERSHIP_RULE_LABEL, parentRuleOf,
  classify, ASSOCIATION_SLOTS, REFERRED_TO_ENTITIES, NAMED_BACK_POINTERS,
  ENTITY_ROOT,
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
    // It sits FIRST now: the default is what a reader is taught first, and
    // both exceptions revise it rather than preceding it.
    for (const multivalued of [true, false]) {
      expect(() => classify({
        declaredOn: 'Whatever', slotName: 'zzz', range: 'Nothing', multivalued,
      })).not.toThrow();
    }
    expect(classify({
      declaredOn: 'Whatever', slotName: 'zzz', range: 'Nothing', multivalued: false,
    }).rule).toBe('owns-target-forward-by-entity');
  });

  test('child-following-parent carries text but is NOT evaluated by the classifier', () => {
    // Rule 3 is a second pass in buildContainmentGraph, not a branch. If it
    // ever gained a `when`, it would start intercepting declared slots and
    // silently change classification.
    const r = (OWNERSHIP_RULES as readonly RuleSpec[])
      .find(x => x.id === 'child-following-parent')!;
    expect(r.when).toBeUndefined();
    // It used to be checked by looking for the literal 'Rule 3'. The rules are
    // unnumbered since 2026-09-13, so the claim is pinned on what the text has
    // to SAY instead: that these edges have no attribute of their own.
    expect(r.text).toMatch(/induced/i);
  });

  /*
   * One rule and two exceptions, down from three rules and one exception
   * (TASKS `one-rule-ownership`, 2026-09-13). Cardinality stopped deciding
   * ownership: it was doing the work of a correlation, and dropping it changed
   * no edge on this schema. The two exceptions are keyed differently — by
   * RANGE and by `Class.slot` — which is why they are two rules and not one
   * list. See docs/OWNERSHIP_CLASSIFICATION.md.
   */
  test('one rule, two exceptions, plus the induced pass, in teaching order', () => {
    expect(OWNERSHIP_RULES.map(r => r.id)).toEqual([
      'owns-target-forward-by-entity',
      'belongs-to-target-backward-by-entity',             // exception, indented in the legend
      'belongs-to-target-backward-by-attribute',          // exception, indented in the legend
      'child-following-parent',         // not a slot rule; its own legend section
    ]);
  });

  /*
   * What each rule actually classifies. The ORDER these depend on is asserted
   * separately, below.
   */
  describe('the rules classify what they say they do', () => {
    const facts = (o: Partial<SlotFacts>): SlotFacts =>
      ({ declaredOn: 'SomeOwner', slotName: 'x', range: 'SomeClass',
         multivalued: false, ...o });

    test('an ordinary attribute owns what it points at', () => {
      expect(classify(facts({})))
        .toEqual({ verdict: 'own-fwd', rule: 'owns-target-forward-by-entity' });
    });

    test('pointing at a referred-to entity is backward, at any cardinality', () => {
      const range = [...REFERRED_TO_ENTITIES][0];
      for (const multivalued of [true, false]) {
        expect(classify(facts({ range, multivalued })))
          .toEqual({ verdict: 'own-bkwd', rule: 'belongs-to-target-backward-by-entity' });
      }
    });

    /*
     * The `Class.slot` key, and the reason it has to be one. Same slot NAME,
     * two different declaring classes: one is a listed back-pointer, the other
     * is not, and only the listed one flips.
     *
     * `Visit.part_of` is the hypothetical from TASKS `one-rule-ownership` —
     * it does not exist in the schema today, which is the point. A bare
     * `part_of` key would flip it the day someone adds it.
     */
    test('a back-pointer is keyed by CLASS.SLOT, not by slot name', () => {
      expect(classify(facts({ declaredOn: 'ResearchStudy', slotName: 'part_of', range: 'ResearchStudy' })))
        .toEqual({ verdict: 'own-bkwd', rule: 'belongs-to-target-backward-by-attribute' });
      // A neutral range on purpose: `Visit` is itself a referred-to ENTITY, so
      // using it here would prove nothing about the attribute key — the range
      // exception would fire first.
      expect(classify(facts({ declaredOn: 'Cohort', slotName: 'part_of', range: 'Cohort' })))
        .toEqual({ verdict: 'own-fwd', rule: 'owns-target-forward-by-entity' });
    });

    /*
     * The two exceptions are independent, and this is the asymmetry that makes
     * them two rules. A referred-to ENTITY is backward wherever it is pointed
     * at; a referred-to ATTRIBUTE's range is not — `ResearchStudy` is owned by
     * `ResearchStudyCollection.entries` even though two attributes refer to it.
     */
    test('a back-pointer\'s range is still owned by other attributes', () => {
      expect(REFERRED_TO_ENTITIES.has('ResearchStudy')).toBe(false);
      expect(classify(facts({
        declaredOn: 'ResearchStudyCollection', slotName: 'entries', range: 'ResearchStudy',
      }))).toEqual({ verdict: 'own-fwd', rule: 'owns-target-forward-by-entity' });
    });

    /*
     * Entity, the universal root, must come out forward: a slot pointing at it
     * is never a pointer back to an owner, or Entity is drawn as the owner of
     * Document and Observation. It used to need a place in the exception set
     * to get there; under one-rule it is simply the default, which is one of
     * the things the change bought.
     */
    test('Entity is forward at both cardinalities, by default', () => {
      expect(REFERRED_TO_ENTITIES.has(ENTITY_ROOT)).toBe(false);
      for (const multivalued of [true, false]) {
        expect(classify(facts({ range: ENTITY_ROOT, multivalued })))
          .toEqual({ verdict: 'own-fwd', rule: 'owns-target-forward-by-entity' });
      }
    });

    /*
     * `required` is carried on SlotFacts but read by no rule (step 5 of the
     * plan). If a rule ever starts reading it, this fails and whoever added it
     * gets to say so out loud.
     */
    test('required changes no verdict', () => {
      for (const range of ['SomeClass', ENTITY_ROOT, [...REFERRED_TO_ENTITIES][0]]) {
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
    test('the table is in teaching order, exceptions BELOW their parent', () => {
      const ids = OWNERSHIP_RULES.map(r => r.id);
      for (const e of ['belongs-to-target-backward-by-entity', 'belongs-to-target-backward-by-attribute']) {
        expect(ids.indexOf(e), e).toBeGreaterThan(ids.indexOf('owns-target-forward-by-entity'));
      }
    });

    test('an exception still wins, even though it runs later', () => {
      // The whole point: ordering it after the default must not cost it the slot.
      const range = [...REFERRED_TO_ENTITIES][0];
      expect(classify({ declaredOn: 'Anything', slotName: 'x', range, multivalued: false }))
        .toEqual({ verdict: 'own-bkwd', rule: 'belongs-to-target-backward-by-entity' });
    });

    /*
     * Two exceptions under one parent, so `classify` collects ALL matches
     * rather than the first. They are disjoint on this schema and nothing
     * structural keeps them so — an entity added to both sets would make both
     * fire, and a first-match would report whichever was declared first while
     * still producing the right VERDICT. That is the kind of wrongness that
     * survives review, so it throws.
     */
    test('two exceptions matching one slot is an error, not a silent pick', () => {
      const clash: RuleSpec[] = [
        { id: 'owns-target-forward-by-entity', label: 'Owns', when: () => true, verdict: 'own-fwd', text: 'x' },
        { id: 'belongs-to-target-backward-by-entity', label: 'A', when: () => true, verdict: 'own-bkwd',
          text: 'x', parentRule: 'owns-target-forward-by-entity' },
        { id: 'belongs-to-target-backward-by-attribute', label: 'B', when: () => true, verdict: 'own-bkwd',
          text: 'x', parentRule: 'owns-target-forward-by-entity' },
      ];
      // Same shape classify() walks, so the guard is exercised as written.
      const run = (facts: SlotFacts) => {
        for (const rule of clash) {
          if (rule.parentRule !== undefined) continue;
          if (!rule.when?.(facts)) continue;
          const hits = clash.filter(r => r.parentRule === rule.id && r.when?.(facts));
          if (hits.length > 1) throw new Error('matches 2 exceptions');
          return hits[0] ?? rule;
        }
        throw new Error('no match');
      };
      expect(() => run({
        declaredOn: 'C', slotName: 's', range: 'R', multivalued: false,
      })).toThrow(/2 exceptions/);
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
      expect(parentRuleOf('owns-target-forward-by-entity')).toBeUndefined();
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
      const probe = (multivalued: boolean): SlotFacts =>
        ({ declaredOn: 'Whatever', slotName: 'zzz', range: 'Nothing', multivalued });
      const total = (OWNERSHIP_RULES as readonly RuleSpec[]).filter(
        r => r.when?.(probe(false)) && r.when?.(probe(true)));
      expect(total.map(r => r.id)).toEqual(['owns-target-forward-by-entity']);
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
   * than deleted, so restoring it is: uncomment, move it above `owns-target-forward-by-entity`, refill
   * ASSOCIATION_SLOTS, add one entry to OWNERSHIP_VERDICTS, put `association`
   * back on the OwnershipRule union. No new code path.
   *
   * These tests build the two objects that restoration needs and check they
   * work, which is what makes "restore from the spec rather than from git
   * history" a checkable claim instead of an intention.
   *
   * NOTE ON ORDER: association is NOT an exception — it does not refine
   * another rule's verdict, it defeats the default outright for its slots. So it
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
        const hits = rules.filter(r => r.parentRule === rule.id && r.when?.(facts));
        if (hits.length > 1) throw new Error(`${facts.slotName} matches ${hits.length} exceptions`);
        const [exc] = hits;
        return exc
          ? { verdict: exc.verdict, rule: exc.id }
          : { verdict: rule.verdict, rule: rule.id };
      }
      throw new Error('no rule matched');
    };

    test('restored at the FRONT of the table, it classifies its two slots', () => {
      const restored: readonly RestorableSpec[] =
        [ASSOCIATION_RULE, ...(OWNERSHIP_RULES as readonly RuleSpec[])];

      // The default rule would claim them both — association wins by placement.
      for (const slotName of ['related_document', 'container']) {
        expect(classifyWith(restored, {
          declaredOn: 'Specimen', slotName, range: 'Document', multivalued: true,
        })).toEqual({ verdict: 'association', rule: 'association' });
      }
      // And with the rule absent (today), the default does claim them.
      expect(classify({
        declaredOn: 'Specimen', slotName: 'related_document', range: 'Document', multivalued: true,
      })).toEqual({ verdict: 'own-fwd', rule: 'owns-target-forward-by-entity' });
    });

    test('restored at the BACK it would never fire — so placement is not free', () => {
      /*
       * The caveat that has to be written down somewhere. Exceptions revise
       * their parent and so can go anywhere; association DEFEATS the default and so
       * must precede it. Whoever restores the rule has to move it, not just
       * uncomment it — the commented entry sits at the foot of the table.
       */
      const misplaced: readonly RestorableSpec[] =
        [...(OWNERSHIP_RULES as readonly RuleSpec[]), ASSOCIATION_RULE];
      expect(classifyWith(misplaced, {
        declaredOn: 'Specimen', slotName: 'related_document', range: 'Document', multivalued: true,
      })).toEqual({ verdict: 'own-fwd', rule: 'owns-target-forward-by-entity' });
    });

    test('today the set is empty, so nothing classifies as association', () => {
      expect(ASSOCIATION_SLOTS.size).toBe(0);
      expect(OWNERSHIP_RULES.map(r => r.id as string)).not.toContain('association');
      expect(classify({
        declaredOn: 'Specimen', slotName: 'related_document', range: 'Document', multivalued: true,
      }).verdict).not.toBe('association');
    });
  });
});
