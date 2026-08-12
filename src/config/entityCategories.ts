/**
 * Entity category definitions for the Entity Explorer view.
 *
 * Categories are hand-curated groupings of BDCHM classes. An entity can
 * appear in multiple categories (e.g., Condition appears in both Pinned
 * and Clinical). The Pinned category is special — it's populated
 * dynamically from user pin state.
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
  // Universal root; also in EXCLUDE_HAS_A_TARGETS / SKIP_SUBCLASS_EXPANSION
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
      'ObservationSet',
      'MeasurementObservationSet',
      'SdohObservationSet',
      'DimensionalObservationSet',
      'Quantity',
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
      'Organization',
      'TimePoint',
      'TimePeriod',
    ],
    defaultExpanded: false,
  },
];
