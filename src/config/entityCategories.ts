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
 * Key is the child class, value is its parent class. Both must appear
 * in the same category's classIds list, with the parent listed first.
 */
export const SUBCLASS_OF: Record<string, string> = {
  DrugExposure: 'Exposure',
  DeviceExposure: 'Exposure',
  ImagingFile: 'File',
  DimensionalObservation: 'Observation',
  DimensionalObservationSet: 'ObservationSet',
  MeasurementObservationSet: 'ObservationSet',
  SdohObservationSet: 'ObservationSet',
  SpecimenQualityObservation: 'Observation',
  SpecimenQuantityObservation: 'Observation',
};

/** Default pinned entities shown on first visit */
export const DEFAULT_PINS = ['Demography', 'Condition', 'MeasurementObservation'];

/** Category definitions (order determines display order) */
export const ENTITY_CATEGORIES: EntityCategory[] = [
  {
    id: 'admin',
    label: 'Admin / Study',
    classIds: [
      'Person',
      'Participant',
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
      'ObservationSet',
      'Observation',
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
    id: 'measurement',
    label: 'Measurement / Observation',
    classIds: [
      'MeasurementObservation',
      'MeasurementObservationSet',
      'SdohObservation',
      'SdohObservationSet',
      'DimensionalObservation',
      'DimensionalObservationSet',
      'Quantity',
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
