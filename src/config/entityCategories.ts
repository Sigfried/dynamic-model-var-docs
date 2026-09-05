/**
 * Entity category definitions for the Entity Explorer view.
 *
 * Categories are hand-curated groupings of BDCHM classes.
 *
 * **A class MAY appear in more than one category** (since 2026-09-04).
 * Categories don't live in the schema — they are imposed to make the app
 * easier to navigate — so a second listing is a navigation aid, NOT a second
 * superclass and not sibling merging.
 *
 * Today exactly two classes are dual-listed: `SpecimenQualityObservation` and
 * `SpecimenQuantityObservation`, under both `observation` and `lab`. Without
 * the `observation` listing the only route to them was clicking a Specimen row
 * on the canvas, which left the Observation hierarchy looking like it had
 * three children instead of five.
 *
 * Dual-listing is an ALLOWLIST, not a free-for-all: `entityCategories.test.ts`
 * fails on an undeclared duplicate, and on an allowlisted class that is not
 * actually listed twice. Add to `DUAL_LISTED` there when adding a listing.
 *
 * Consumers walk categories → classes; the reverse (class → its categories)
 * exists nowhere. `getCategorySelectorSection` counts DISTINCT classes and
 * qualifies its item ids by category so two listings do not collide, while
 * selection keys off the bare class id so both rows toggle together.
 */

export interface EntityCategory {
  readonly id: string;
  readonly label: string;
  readonly classIds: string[];
  /**
   * Classes from OTHER categories drawn alongside the members in this
   * category's content view (the ▶ control on the category header).
   *
   * **Not `DEFAULT_PINS`.** That constant, below, is the unrelated
   * first-visit canvas selection. Same word, different feature.
   *
   * **The test for a pin is explanatory, not structural** (Siggie,
   * 2026-09-04). An earlier draft derived pins mechanically — every outside
   * class a member's slot points at, so no row was left drawing a hollow dot
   * — and it was rejected:
   *
   *   "I 'pinned' Person, Participant, Visit to Clinical because that
   *    category doesn't make sense without them. Do NOT pin
   *    TimePoint/TimePeriod to Admin. It clutters up the diagram and gives it
   *    no additional explanatory value."
   *
   * A hollow dot is an acceptable outcome, not a defect: the row still reads
   * `→ TimePoint 0..1`, which says everything the drawn edge would. The rule
   * of thumb: **value types are not pinned** (TimePoint, TimePeriod,
   * Quantity, Context are things attributes hold); **actors and contexts are**
   * (Participant, Visit, Person) when the records are records OF them.
   * `BodySite` is the near-miss — it looks like a value type but carries
   * domain content, and "where on the body" is part of what a measurement IS
   * — so it is pinned where used. Size is not the test.
   *
   * ⚠️ Hand-curated, and it rots on an upstream schema sync exactly like
   * `classIds` and the `containmentGraph` override sets — but INVISIBLY,
   * since a stale pin just draws one extra box rather than failing. Re-read
   * `docs/TOURS_AND_CONTENT.md` §1.1 after a sync; do not re-derive by query.
   */
  readonly pins: string[];
  readonly defaultExpanded: boolean;
}

/**
 * Subclass relationships to show with indentation in the entity table.
 * Key is the child class, value is its parent class.
 *
 * Indentation renders only when the parent is in the SAME category as the
 * child (EntityTable guards with classIdSet.has(parentId)); list the parent
 * first there so the ↳ row follows it. Cross-category pairs are allowed and
 * simply render unindented — e.g. SpecimenQualityObservation lives in `lab`
 * while its parent Observation lives in `observation`.
 */
export const SUBCLASS_OF: Record<string, string> = {
  // Clinical
  DrugExposure: 'Exposure',
  DeviceExposure: 'Exposure',
  // Observation hierarchy
  MeasurementObservation: 'Observation',
  SdohObservation: 'Observation',
  DimensionalObservation: 'Observation',
  MeasurementObservationSet: 'ObservationSet',
  SdohObservationSet: 'ObservationSet',
  DimensionalObservationSet: 'ObservationSet',
  SpecimenQualityObservation: 'Observation',
  SpecimenQuantityObservation: 'Observation',
  // Files
  ImagingFile: 'File',
};

/** Default pinned entities shown on first visit */
export const DEFAULT_PINS = ['Demography', 'Condition', 'MeasurementObservation'];

/**
 * Classes deliberately kept out of every category, with the reason.
 *
 * ENTITY_CATEGORIES is an allowlist: a class in no category renders nowhere.
 * That is correct for a handful of classes but a silent bug for the rest, so
 * every omission must be recorded here and the rest are asserted against the
 * live schema (see assertAllClassesCategorized + entityCategories.test.ts).
 */
export const UNCATEGORIZED_BY_DESIGN: Record<string, string> = {
  // Universal root; in SKIP_SUBCLASS_EXPANSION (kept out of the inheritance
  // tree). It IS drawn as a range node now — EXCLUDE_HAS_A_TARGETS is gone.
  // (containmentGraph.ts) because it would attach to everything as noise.
  Entity: 'Universal root class — too general to be a browsable entity.',
};

/**
 * Fail loudly when the schema gains a class nobody categorized.
 *
 * ENTITY_CATEGORIES is hand-curated, so an upstream schema sync can add
 * classes that then silently vanish from the UI — this is what happened to
 * Context and Activity in the 2026-08-12 sync (`778afca`), found only because
 * someone noticed Context missing from the entity list.
 *
 * Returns the offending class ids so callers can throw (tests) or warn (dev
 * console) as appropriate.
 */
export function findUncategorizedClasses(allClassIds: readonly string[]): string[] {
  const categorized = new Set(ENTITY_CATEGORIES.flatMap(cat => cat.classIds));
  return allClassIds.filter(
    id => !categorized.has(id) && !(id in UNCATEGORIZED_BY_DESIGN),
  );
}

/** Category definitions (order determines display order) */
export const ENTITY_CATEGORIES: EntityCategory[] = [
  {
    id: 'admin',
    label: 'Admin / Study',
    classIds: [
      'Person',
      'Participant',
      'Demography',
      'Visit',
      'Consent',
      'ResearchStudy',
      'ResearchStudyCollection',
      // Moved here from `other` (2026-09-04, Siggie). Organization is a study
      // administration concept, not a file: it is what `performed_by`,
      // `originating_site` and the transport endpoints point at, and those
      // arrive from Observations, Laboratory and Admin alike. Sitting in
      // "Files / Other" it read as a leftover.
      'Organization',
    ],
    // The category the others pin, so it pins nothing itself. It reaches
    // outward only at TimePoint (3 slots), TimePeriod (2) and CauseOfDeath
    // (1) — all value-ish, none explanatory. Draw it alone.
    pins: [],
    defaultExpanded: false,
  },
  {
    id: 'clinical',
    label: 'Clinical',
    classIds: [
      'Condition',
      'Procedure',
      'Exposure',
      'DrugExposure',
      'DeviceExposure',
      'CauseOfDeath',
      'ImagingStudy',
      // Dual-listed with `lab` (2026-09-04, Siggie). Usage is mostly clinical
      // -- Condition.affected_body_site, Procedure.affected_body_site and
      // ImagingStudy.body_part_examined against a single lab use
      // (SpecimenCreationActivity.collection_site) -- but anatomy genuinely
      // belongs to both, so neither listing is dropped. Add to DUAL_LISTED in
      // entityCategories.test.ts alongside this.
      'BodySite',
    ],
    // The reference case for the whole feature (Siggie's screenshot): these
    // records are OF a participant, AT a visit — take them away and the
    // category is a pile of disconnected records. Person completes the pair
    // Participant belongs to, and Person.cause_of_death points back in at
    // Clinical's CauseOfDeath. Quantity is deliberately NOT pinned.
    pins: ['Participant', 'Visit', 'Person'],
    defaultExpanded: false,
  },
  {
    id: 'observation',
    label: 'Observations / Measurements',
    classIds: [
      'Observation',
      'MeasurementObservation',
      'SdohObservation',
      'DimensionalObservation',
      // Also listed under `lab`, which is where someone browsing specimen
      // concepts looks for them. They are here too because this is the only
      // place the Observation hierarchy is shown WHOLE — without them, the
      // only route to these two is clicking a Specimen row on the canvas.
      // First deliberate multi-category membership; see the note on
      // EntityCategory.classIds.
      'SpecimenQualityObservation',
      'SpecimenQuantityObservation',
      'ObservationSet',
      'MeasurementObservationSet',
      'SdohObservationSet',
      'DimensionalObservationSet',
      // Added by the 2026-08-12 upstream sync (778afca). Observation.context
      // is multivalued → Context, and Context.activity → Activity; both are
      // small helper classes describing the circumstances of an observation,
      // so they sit here beside Quantity rather than in their own category.
      'Context',
      'Activity',
    ],
    // An observation is of someone, at an encounter, and often somewhere on a
    // body. Organization is NOT pinned despite 10 `performed_by` slots
    // pointing at it — who performed an observation is bookkeeping, not what
    // the category is about (Siggie, 2026-09-04, by the same argument that
    // kept TimePoint out of Admin). Context is a member here, not a pin.
    pins: ['Participant', 'Visit', 'BodySite'],
    defaultExpanded: false,
  },
  {
    id: 'lab',
    label: 'Laboratory / Biospecimen',
    classIds: [
      'Specimen',
      'Assay',
      'BiologicProduct',
      'Substance',
      'SpecimenContainer',
      'SpecimenCreationActivity',
      'SpecimenProcessingActivity',
      'SpecimenStorageActivity',
      'SpecimenTransportActivity',
      'SpecimenQualityObservation',
      'SpecimenQuantityObservation',
      'BodySite',
    ],
    // A specimen comes FROM someone; that is the one outside fact the
    // category needs. Everything else it reaches — Quantity (8), TimePoint
    // (8), Organization (5), Visit (2), Document (1) — is measurement and
    // bookkeeping, and pinning all of it is what made the mechanically
    // derived version of this row unreadable.
    pins: ['Participant'],
    defaultExpanded: false,
  },
  {
    id: 'survey',
    label: 'Survey / Questionnaire',
    classIds: [
      'Questionnaire',
      'QuestionnaireItem',
      'QuestionnaireResponse',
      'QuestionnaireResponseItem',
      'QuestionnaireResponseValue',
      'QuestionnaireResponseValueDecimal',
      'QuestionnaireResponseValueBoolean',
      'QuestionnaireResponseValueInteger',
      'QuestionnaireResponseValueTimePoint',
      'QuestionnaireResponseValueString',
    ],
    // Ten classes, two outward references. Genuinely self-contained — a real
    // content fact the tour gets to state, rather than something to paper
    // over with pins.
    pins: [],
    defaultExpanded: false,
  },
  {
    id: 'other',
    label: 'Files / Other',
    classIds: [
      'File',
      'ImagingFile',
      'Document',
      'TimePoint',
      'TimePeriod',
      // Moved here from `observation` (2026-09-04, Siggie). Quantity is a
      // generic value type, not an observation concept: 16 slots across 13
      // classes in four categories, including Substance.substance_quantity,
      // Assay.lower_limit_of_detection and SpecimenProcessingActivity.duration,
      // none of which are observations. It belongs beside TimePoint (15 slots,
      // 9 classes), which is the same kind of thing and already lives here.
      'Quantity',
    ],
    // Files are associated with a participant. BodySite and ImagingStudy are
    // one slot each and not what the category is about.
    pins: ['Participant'],
    defaultExpanded: false,
  },
];
