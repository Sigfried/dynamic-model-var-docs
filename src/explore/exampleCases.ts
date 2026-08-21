/**
 * Example cases — a curated set of selections for eyeballing edge routing.
 *
 * Why this exists: the merge-mode buttons (⋙ ⋙⋙ ⌙ ≡) and the routing
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
 * `sel` are selected (first-class) nodes; `exp` are expanded context nodes
 * (dimmed). `roots` turns on path-to-root. Keep these as ids, not URLs — the
 * pane applies them to app state in place rather than navigating, so the merge
 * mode (localStorage) and the scroll position survive a case switch.
 */

export interface ExampleCase {
  /** Short name, shown as the link text. */
  name: string;
  /** One line on what this case is for — what to look at, not what it is. */
  note: string;
  sel: string[];
  exp?: string[];
  roots?: boolean;
}

export interface ExampleCaseGroup {
  heading: string;
  cases: ExampleCase[];
}

export const EXAMPLE_CASES: ExampleCaseGroup[] = [
  {
    heading: 'The bare diagonal',
    cases: [
      {
        name: 'BodySite 6-way (the original)',
        note: 'The reproducer from the handoff. In ⌙ (bend) the top approach '
          + 'arrives as a straight diagonal with no steps; in ⋙ (near) it keeps '
          + 'its horizontal run. This is the case the fix has to fix.',
        sel: ['BodySite', 'Condition', 'Consent', 'Demography', 'Exposure',
          'Observation', 'Procedure'],
        exp: ['ImagingFile', 'ImagingStudy', 'MeasurementObservation',
          'SpecimenCreationActivity'],
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
        name: 'Self-loops',
        note: 'The five self-owning slots (TimePoint.index_time_point, '
          + 'File.derived_from, Specimen.parent_specimen, ResearchStudy.part_of, '
          + 'SpecimenContainer.parent_container) — loop markers, not routed edges.',
        sel: ['TimePoint', 'File', 'Specimen', 'ResearchStudy',
          'SpecimenContainer'],
      },
      {
        name: 'The known 3-node cycle',
        note: 'Specimen -> SpecimenStorageActivity -> SpecimenContainer -> '
          + 'Specimen: two refs plus one ownership edge. Documented as known '
          + 'and deliberately unhandled; here so it stays visible.',
        sel: ['Specimen', 'SpecimenStorageActivity', 'SpecimenContainer'],
      },
      {
        name: 'Flipped ownership',
        note: 'Slots whose ownership is flipped (performed_by, associated_person, '
          + 'contained_in, related_imaging_study). Flipped edges keep their '
          + 'attribute-row anchor and must NOT merge — check the arrowheads.',
        sel: ['Organization', 'Person', 'Participant', 'ImagingFile',
          'ImagingStudy', 'SpecimenContainer', 'Specimen'],
      },
      {
        name: 'Dropped Entity refs',
        note: 'The twelve focus / associated_evidence slots range on Entity and are '
          + 'EXCLUDED — no edge at all. These boxes should show those rows with no '
          + 'line leaving them; a line here means the exclusion regressed.',
        sel: ['Observation', 'ObservationSet', 'MeasurementObservation', 'Document',
          'Condition', 'SdohObservation'],
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
