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
    defaultExpanded: false,
  },
];
