/**
 * Example cases — a curated set of selections, ordered simple to complex.
 *
 * ORDERING IS THE POINT: groups get progressively denser and end at the routing
 * stress cases, which are for debugging rather than explaining. When adding a
 * case, put it where its complexity belongs, not at the end.
 *
 * A case earns its place by either (a) showing off a feature or setting up a
 * state worth playing with, or (b) covering a distinct semantic area of the
 * model, so the set as a whole gives a feel for what the model spans. A
 * debugging case usually passes (a) as well.
 *
 * **The introductory group is gone (2026-09-04).** Six cases explained the app
 * to a first-time reader — what a row is, what an edge anchor means, owns vs.
 * belongs-to, the three edge types on one class. The guided tour does that job
 * now, and doing it twice in two voices is how the two drift apart. Their prose
 * was not thrown away: it is `docs/TOUR_SOURCE_MATERIAL.md`, waiting to become
 * tour steps (NEXT_SESSION_EDGE_DISPLAY §2.3). Do not re-add them here.
 *
 * Why the later groups exist: the merge-mode buttons (⋙ ⋙⋙ ⌙ ≡) and the routing
 * constants can only be judged by looking at real convergences, and
 * reconstructing a case by hand (click seven classes, expand four more) is
 * slow enough that comparisons got made against whatever happened to be on
 * screen. These are the cases worth comparing, named, so a mode can be flipped
 * against a fixed target.
 *
 * The cases are grounded in the actual schema, not invented: owner counts were
 * computed from `classifySlotEdge` over bdchm.processed.json (2026-08-21).
 * Ownership convergence sizes, by distinct owning class:
 *   Quantity 16, TimePoint 8, BodySite 6, Context 6, then a tail of 4s.
 * By slot-edge (what actually crowds a corridor, since one class can own the
 * same target through several slots): Quantity 19, TimePoint 16, BodySite 6.
 * TimePoint is the interesting one — half as many owners as Quantity but
 * nearly as many edges, because the four Specimen*Activity classes each own it
 * twice (date_started, date_ended).
 *
 * `sel` is the whole content of the canvas — there is no separate expanded
 * tier since adding a class selects it (2026-08-27). `roots` turns on
 * path-to-root. Keep these as ids, not URLs — the
 * pane applies them to app state in place rather than navigating, so the merge
 * mode (localStorage) and the scroll position survive a case switch.
 */

export interface ExampleCase {
  /** Short name, shown as the link text. */
  name: string;
  /** One line on what this case is for — what to look at, not what it is. */
  note: string;
  sel: string[];
  roots?: boolean;
}

export interface ExampleCaseGroup {
  heading: string;
  cases: ExampleCase[];
}

export const EXAMPLE_CASES: ExampleCaseGroup[] = [
  {
    heading: 'One rule at a time',
    cases: [
      {
        name: 'Rule 1 — multivalued owns forward',
        note: 'A multivalued slot means the owner has-a collection, so ownership '
          + 'runs forward: Questionnaire.items and ResearchStudy.consents. The two '
          + '`part_of` self-loops are the counterexample — multivalued but drawn '
          + 'backward, because they walk UP a tree.',
        sel: ['ResearchStudy', 'Consent', 'Questionnaire', 'QuestionnaireItem'],
      },
      {
        name: 'Rule 2 — single-valued belongs backward',
        note: 'The largest group (70 edges). Participant fans OUT to 22 targets, '
          + 'nearly all reversed: each target declares `associated_participant` '
          + 'and is drawn as belonging to Participant. This is the group that '
          + 'would move if own-bkwd merges into association.',
        sel: ['Participant', 'Condition', 'Demography', 'Exposure', 'Procedure',
          'Visit'],
      },
      {
        name: 'Exception 2a — no independent existence',
        note: 'Single-valued, but forward anyway: Quantity, TimePoint and the like '
          + 'have no identity of their own, so the value belongs to whoever holds '
          + 'it rather than owning the holder.',
        sel: ['SpecimenStorageActivity', 'Quantity', 'TimePoint', 'Activity'],
      },
      {
        name: 'Entity-ranged — always forward',
        note: 'The twelve focus / associated_evidence slots range on Entity, the '
          + 'universal root. A pointer AT the root is never a foreign key back to '
          + 'an owner, so these run forward whatever their cardinality. Both '
          + 'single- and multi-valued focus sites are here — all should point '
          + 'AT Entity.',
        sel: ['Observation', 'ObservationSet', 'MeasurementObservation', 'Document',
          'Condition', 'SdohObservation', 'Entity'],
      },
      {
        name: 'Association — no ownership claim',
        note: 'Both associations in the schema: Document.related_document → '
          + 'Specimen, and SpecimenContainer.container → SpecimenStorageActivity. '
          + 'Slate and dashed, arrowed at both ends. They are listed explicitly '
          + 'because they are multivalued, so Rule 1 would otherwise call them '
          + 'ownership.',
        sel: ['Document', 'Specimen', 'SpecimenContainer',
          'SpecimenStorageActivity'],
      },
      {
        name: 'Self-loops',
        note: 'The five self-owning slots (TimePoint.index_time_point, '
          + 'File.derived_from, Specimen.parent_specimen, ResearchStudy.part_of, '
          + 'SpecimenContainer.parent_container) — loop markers, not routed edges. '
          + 'ResearchStudy also pulls in its TimePoint edges; the loops are the '
          + 'circular arrows on the rows.',
        sel: ['TimePoint', 'File', 'Specimen', 'ResearchStudy',
          'SpecimenContainer'],
      },
    ],
  },
  {
    heading: 'Inheritance (the ⑃ siblings toggle)',
    cases: [
      {
        name: 'One child, merged with its parent',
        note: 'MeasurementObservation alone. It still merges: the box is titled '
          + 'Observation, its 13 inherited rows sit at the top in black, and '
          + "MeasurementObservation's own 9 follow under its coloured header. "
          + 'Merging does not wait for a second sibling — a class must not '
          + 'change shape because of what else you happen to select.',
        sel: ['MeasurementObservation'],
      },
      {
        name: 'Children that add nothing',
        note: 'SpecimenQuality- and SpecimenQuantityObservation declare no '
          + 'slots of their own. Both still get a header under the shared rows, '
          + 'because "this subclass adds nothing" is the answer to what they '
          + 'are — and without the headers the selection would leave no trace '
          + 'in the box at all.',
        sel: ['SpecimenQualityObservation', 'SpecimenQuantityObservation'],
      },
      {
        name: 'slot_usage — same name, different type',
        note: "QuestionnaireResponseValue's five children each narrow `value` "
          + 'to a different type (boolean, decimal, integer, TimePoint, and the '
          + "parent's string). That narrowing is the entire reason the five "
          + 'classes exist, so each keeps its OWN row rather than merging into '
          + "the parent's — the one place a shared row would be a lie.",
        sel: ['QuestionnaireResponseValueBoolean', 'QuestionnaireResponseValueDecimal',
          'QuestionnaireResponseValueInteger', 'QuestionnaireResponseValueString',
          'QuestionnaireResponseValueTimePoint'],
      },
      {
        name: 'The full Observation family',
        note: 'All five Observation subclasses plus the parent. One box where '
          + 'there would be six, and the shared rows are stated once. Turn ⑃ '
          + 'siblings off to see what it replaces. Note each edge leaves in the '
          + "colour of the child that owns its row; inherited slots' edges are "
          + "the parent's and are drawn once, not once per child.",
        sel: ['Observation', 'MeasurementObservation', 'SdohObservation',
          'DimensionalObservation', 'SpecimenQualityObservation',
          'SpecimenQuantityObservation'],
      },
    ],
  },
  {
    heading: 'The bare diagonal',
    cases: [
      {
        name: 'BodySite 6-way (the original)',
        note: 'The reproducer from the handoff. In ⌙ (bend) the top approach '
          + 'arrives as a straight diagonal with no steps; in ⋙ (near) it keeps '
          + 'its horizontal run. This is the case the fix has to fix.',
        sel: ['BodySite', 'Condition', 'Consent', 'Demography', 'Exposure',
          'Observation', 'Procedure', 'ImagingFile', 'ImagingStudy',
          'MeasurementObservation', 'SpecimenCreationActivity'],
      },
      {
        name: 'BodySite, owners only',
        note: 'The same convergence with nothing else on canvas — six owners, '
          + 'no unrelated boxes for a diagonal to cut across. Shows whether the '
          + 'degeneracy is about the convergence itself or about crowding.',
        sel: ['BodySite', 'Condition', 'ImagingFile', 'ImagingStudy',
          'MeasurementObservation', 'Procedure', 'SpecimenCreationActivity'],
      },
      {
        name: 'TimePoint 16-edge',
        note: 'Densest corridor in the schema: 8 owners but 16 slot-edges, since '
          + 'each Specimen*Activity owns date_started and date_ended. Also where '
          + 'the second-from-top edge goes diagonal and pair edges cross.',
        sel: ['TimePoint', 'Consent', 'ResearchStudy', 'TimePeriod',
          'SpecimenCreationActivity', 'SpecimenProcessingActivity',
          'SpecimenStorageActivity', 'SpecimenTransportActivity',
          'QuestionnaireResponseValueTimePoint'],
      },
      {
        name: 'TimePoint + Person (crossing)',
        note: 'Siggie\'s repro for the crossing bug: the paired date_started / '
          + 'date_ended edges from different owners cross each other on the way '
          + 'in. Compare pair ordering against the case above.',
        sel: ['TimePoint', 'Person', 'Consent', 'ResearchStudy', 'TimePeriod',
          'SpecimenCreationActivity', 'SpecimenProcessingActivity',
          'SpecimenStorageActivity', 'SpecimenTransportActivity',
          'QuestionnaireResponseValueTimePoint'],
      },
    ],
  },
  {
    heading: 'Pathological convergences',
    cases: [
      {
        name: 'Quantity 19-edge (worst case)',
        note: 'The largest convergence in the schema: 16 owning classes, 19 '
          + 'slot-edges. The fan is squeezed hardest here, so ENTITY_FAN_GAP and '
          + 'the merge distance both show their limits.',
        sel: ['Quantity', 'Activity', 'Assay', 'DeviceExposure',
          'DimensionalObservation', 'DrugExposure', 'MeasurementObservation',
          'Observation', 'Procedure', 'SdohObservation',
          'SpecimenCreationActivity', 'SpecimenProcessingActivity',
          'SpecimenQualityObservation', 'SpecimenQuantityObservation',
          'SpecimenStorageActivity', 'SpecimenTransportActivity', 'Substance'],
      },
      {
        name: 'Context 6-way (uniform owners)',
        note: 'Six owners that are all observation classes — same size, same '
          + 'shape, similar row counts. The controlled comparison for BodySite, '
          + 'whose owners vary wildly in height.',
        sel: ['Context', 'DimensionalObservation', 'MeasurementObservation',
          'Observation', 'SdohObservation', 'SpecimenQualityObservation',
          'SpecimenQuantityObservation'],
      },
      {
        name: 'Two convergences at once',
        note: 'Quantity and TimePoint both converge from the same Specimen '
          + 'activity classes, so two corridors compete for the same space. '
          + 'Where merge distance trades off against crossings.',
        sel: ['Quantity', 'TimePoint', 'SpecimenCreationActivity',
          'SpecimenProcessingActivity', 'SpecimenStorageActivity',
          'SpecimenTransportActivity'],
      },
    ],
  },
  {
    heading: 'Flipped divergences (found via the legend)',
    cases: [
      {
        name: 'Participant 22-way (largest fan in the schema)',
        note: 'Bigger than any inbound convergence: 22 edges leaving Participant, '
          + '21 of them FLIPPED. Flipped edges keep their attribute-row anchor and '
          + 'must not merge, so this is the fan the merge code deliberately does '
          + 'not touch — and therefore the one nothing has been tuned against.',
        sel: ['Participant', 'Condition', 'Consent', 'Demography', 'DeviceExposure',
          'DrugExposure', 'Exposure', 'File', 'ImagingStudy',
          'MeasurementObservation', 'Observation', 'Procedure', 'SdohObservation',
          'Specimen', 'Visit'],
      },
      {
        name: 'Visit 19-way',
        note: 'The same shape one size down, and it overlaps Participant heavily — '
          + 'most classes carry both associated_participant and associated_visit, '
          + 'so the two fans run through the same corridor as pairs.',
        sel: ['Visit', 'Condition', 'Demography', 'DeviceExposure', 'DrugExposure',
          'Exposure', 'ImagingStudy', 'MeasurementObservation', 'Observation',
          'Procedure', 'QuestionnaireResponse', 'SdohObservation', 'TimePeriod'],
      },
      {
        name: 'Participant + Visit + Organization',
        note: 'All three FK hubs at once (22 + 19 + 11 edges, nearly all flipped). '
          + 'The densest picture the schema can produce, and the stress test for '
          + 'anything that changes routing.',
        sel: ['Participant', 'Visit', 'Organization', 'Condition', 'Demography',
          'DimensionalObservation', 'MeasurementObservation', 'Observation',
          'ObservationSet', 'Procedure', 'SdohObservation',
          'SpecimenQualityObservation', 'SpecimenQuantityObservation'],
      },
      {
        name: 'Converge and diverge at once',
        note: 'MeasurementObservation owns BodySite/Context/Quantity while being '
          + 'owned by Participant/Visit/Organization — edges fan IN and OUT of the '
          + 'same box. Where merged (entity-end) and unmerged (flipped) arrivals '
          + 'sit side by side.',
        sel: ['MeasurementObservation', 'BodySite', 'Context', 'Quantity',
          'Participant', 'Visit', 'Organization', 'MeasurementObservationSet'],
      },
    ],
  },
  {
    heading: 'Normal cases (a fix must not break these)',
    cases: [
      {
        name: 'Single edge',
        note: 'One owner, one edge, no convergence at all — merging is a no-op. '
          + 'The floor: if this looks wrong, something basic broke.',
        sel: ['Visit', 'TimePeriod'],
      },
      {
        name: 'Two owners',
        note: 'The smallest real convergence. Two approaches, one arrowhead — '
          + 'the fan is barely a fan, so a merge distance that is too long is '
          + 'obvious here first.',
        sel: ['Participant', 'Visit', 'ObservationSet'],
      },
      {
        name: 'Specimen chain (deep, not wide)',
        note: 'A long ownership chain rather than a convergence: many layers, '
          + 'few edges per node. Checks that tuning for convergences has not '
          + 'made ordinary edges worse.',
        sel: ['Specimen', 'SpecimenContainer', 'SpecimenCreationActivity',
          'SpecimenProcessingActivity', 'SpecimenStorageActivity',
          'SpecimenTransportActivity', 'Participant'],
      },
      {
        name: 'The known 3-node cycle',
        note: 'Specimen -> SpecimenStorageActivity -> SpecimenContainer -> '
          + 'Specimen: an association plus two ownership edges. Known '
          + 'and deliberately unhandled; here so it stays visible.',
        sel: ['Specimen', 'SpecimenStorageActivity', 'SpecimenContainer'],
      },
      {
        name: 'Backward ownership (own-bkwd)',
        note: 'Slots drawn backward (performed_by, associated_person, '
          + 'contained_in, related_imaging_study). These keep their '
          + 'attribute-row anchor and must NOT merge — check the arrowheads.',
        sel: ['Organization', 'Person', 'Participant', 'ImagingFile',
          'ImagingStudy', 'SpecimenContainer', 'Specimen'],
      },
      {
        name: 'Path to root',
        note: 'Path-to-root on from a single deep class, which pulls in every '
          + 'owner up the chain. The biggest graph reachable in one click.',
        sel: ['MeasurementObservation'],
        roots: true,
      },
    ],
  },
];
