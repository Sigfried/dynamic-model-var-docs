# BDCHM Explorer help

Help + tour content for the dmvd Explorer. This file is dmvd's content; the
authoring format it is written in is specified in
[`src/help/FORMAT.md`](../help/FORMAT.md), which belongs to the help package
and knows nothing about BDCHM.

Parsed by [`parseHelpContent.ts`](../help/parseHelpContent.ts); pinned by
`src/test/helpContent.test.ts`. Package-level design lives in
[docs/HELP_PACKAGE_PLAN.md](../../docs/HELP_PACKAGE_PLAN.md).

<details>
<summary><b>TODO</b></summary>

> Check old draft text and make sure it all got included

3. select MeasurementObservation and highlight observation_type. text:
   - While the relationship between an entity and its enumerations and raw
     data attributes is direct (e.g.,
     `MeasurementObservation.observation_type` ==> `MeasurementObservationTypeEnum`
     or `MeasurementObservation.age_at_observation` ==> `integer`), it can be
     related to other entities in more complex ways
     [can we animate this so that step 4 keeps this popover but shows the next bullet, etc?
     not sure best way to represent this in my outline...well, we're going to need a reasonably
     human-readable/writable format for the full tour specs anyway]
     - inheritance, known in modeling parlance as IS_A relationships,
       e.g., `MeasurementObservation.is_a` ==> `Observation`, or
     - association / ownership / containment, known in modeling parlance as HAS_A relationships,
       e.g., `Visit.associated_participant` ==> `Participant`.
     A primary goal 
   - Entities can be related to each other through
4. goal is to show all the relationship types. if there are any entities
   that use all four, select one of those, otherwise will have to select
   one that has most and then select another that has the others. steps:
   1. **Selecting an entity** Select an entity by clicking its checkbox;
      the entity will appear in the main panel along with directly related
      entities. There are five ways an entity can be related to another.
   2. highlight row
   3. click checkbox.

</details><!-- end of todo -->

<details open>
<summary><b>Tours</b></summary>

<div style="margin-left: 40px">
<details open>
<summary><b>The BioData Catalyst Harmonized Model</b></summary>

## The BioData Catalyst Harmonized Model
- **TourMetadata:**
- **Description:** Introduction to the model: what it contains and what it's for

### bdchm

> *Introduces the BDCHM, its general context, and the types of data it
> holds. Content only. No app mechanics. adf*
>
> Category steps: one per category, each loading its ⊞ view, with beats
> revealing the story rather than the whole canvas at once. Survey's step
> gets to say the thing the numbers show — it is a self-contained subtree
> that barely touches the rest of the model.

- **Title:** The BioData Catalyst Harmonized Model (BDCHM)
- **Tour:** The BioData Catalyst Harmonized Model
- Only: panels=0
- **Anchor:** none
- **Highlight:** selection-tree
- **Width:** 800
- **Description:** 
  ### Context
  BioData Catalyst ([BDC](https://biodatacatalyst.nhlbi.nih.gov/))
  is a cloud-based ecosystem where researchers can find and work with
  [NHLBI](https://www.nhlbi.nih.gov/) data resources. Studies arrive with
  their own terminologies, units, and file structures, which are
  transformed by the Data Model-Based Ingestion Pipeline
  ([dm-bip](https://linkml.io/dm-bip/)) into a common, harmonized
  [LinkML schema](https://rtiinternational.github.io/NHLBI-BDC-DMC-HM/).
- **Beats:**
  1. sources
     - Keep: true
     - Description:
       ##### Sources
       Nine priority [TOPMed](https://topmed.nhlbi.nih.gov/)
       cohorts (e.g., the Framingham Heart Study and Women's Health Initiative)
       and the [INCLUDE Data Hub](https://portal.includedcc.org/) have been
       harmonized to it so far with more on their way.
  2. contents
     - Keep: true
     - Description:
       ##### Contents
       The model includes 56 entity classes (left panel) with ~340 total attributes
       falling into one of three attribute types:
       - primitive data values (e.g., strings, integers)
       - 52 permissible value sets (e.g., visit categories, units of
         measure, condition codes)
       - about 80 links to other entities indicating ownership or
         containment relationships (e.g., multiple Participant entities
         can "belong" to a single Person entity)


### app-model-mods

- **Title:** What's in the model?
- **Tour:** The BioData Catalyst Harmonized Model
- **Description:** 
  The BDCHM schema provides a flexible, general purpose structure
  for storing clinical trials data. This Explorer categorizes the
  entities specified in the model into six areas to make it easier
  to browse and comprehend. This tour will walk you through each
  category.
- **Anchor:** category-row:admin


### admin-study

- **Title:** Category: Admin / Study
- **Tour:** The BioData Catalyst Harmonized Model
- **Description:**
  Eight classes answer *who was studied, by whom, and under what agreement*.
  Nothing here is a measurement — these are the records every other category
  hangs off. Read the diagram left to right: the study comes first, the
  individual next, and what happened to them last.
- **Anchor:** category-row:admin
- Only: cat=admin
- **Action:** Drew the whole Admin / Study category, the same as pressing its ⊞ button.
- Beats:
  1. ResearchStudyCollection
     - Description:
       ##### ResearchStudyCollection
       {{model-description:ResearchStudyCollection}}
     - Anchor: node-box:ResearchStudyCollection
  2. ResearchStudy
     - Description:
       ##### ResearchStudy
       {{model-description:ResearchStudy}}

       `part_of` points at ResearchStudy itself — the loop on this box — so a
       study can be a sub-study of another.
     - Anchor: node-box:ResearchStudy
  3. Organization
     - Description:
       ##### Organization
       {{model-description:Organization}}

       It declares no attribute pointing at anything here. Everything that
       names an Organization — `Participant.originating_site`, and the
       `performed_by` that Observation, ObservationSet and
       SpecimenCreationActivity declare and their subclasses inherit — is
       declared elsewhere and drawn back at it.
     - Anchor: node-box:Organization
  4. Person
     - Description:
       ##### Person
       {{model-description:Person}}
     - Anchor: node-box:Person
  5. Participant
     - Description:
       ##### Participant
       {{model-description:Participant}}
     - Anchor: node-box:Participant
  6. person vs participant
     - Description:
       ##### One person, several participants
       Person and Participant are the first genuinely modelling-flavoured
       distinction in the schema, and it is worth slowing down for. A
       **Person** is generally a human being. A **Participant** is that person's role in
       one study, and `associated_person` is the link. The same person enrolled
       in three studies is three Participants — usually de-identified and
       deliberately untraceable back to the actual person.
     - Anchor: node-box:Participant
  7. Consent
     - Description:
       ##### Consent
       {{model-description:Consent}}

       Both Participant and ResearchStudy own a list of them, so consent is
       recorded per person and per study.
     - Anchor: node-box:Consent
  8. Visit
     - Description:
       ##### Visit
       {{model-description:Visit}}
     - Anchor: node-box:Visit
  9. Demography
     - Description:
       ##### Demography
       {{model-description:Demography}}

       Sex, ethnicity and race sit here rather than on Person. Demography
       points at a Participant, and optionally at the Visit it was recorded
       at — so it is a record ABOUT a participant, not a fixed property of the
       human being.
     - Anchor: node-box:Demography
  10. the spine
     - Description:
       ##### The spine
       Person → Participant → Visit is the path the rest of the model hangs
       off. Clinical, Observations, Laboratory and Files all point back at a
       Participant, a Visit, or both — which is why those categories borrow
       Participant and Visit into their own views. Survey is the exception:
       ten classes and almost no outward references, a self-contained subtree.
     - Anchor: none


### clinical-records

- **Title:** Category: Clinical
- **Tour:** The BioData Catalyst Harmonized Model
- **Description:**
  Eight classes record *what happened to a participant medically*. Every one of
  them is a record OF someone, usually AT an encounter — which is why Person,
  Participant and Visit are drawn here too even though they belong to Admin.
  Take them away and Clinical is a pile of disconnected records.
- **Anchor:** category-row:clinical
- Only: cat=clinical
- **Action:** Drew the whole Clinical category, the same as pressing its ⊞ button.
- Beats:
  1. the borrowed spine
     - Description:
       ##### Three boxes on loan
       Person, Participant and Visit are Admin classes, pinned into this view
       because the category does not mean anything without them. Read the rest
       of the diagram as hanging off Participant: everything to its right is a
       record about that participant.
     - Anchor: node-box:Participant
  2. CauseOfDeath
     - Description:
       ##### CauseOfDeath
       {{model-description:CauseOfDeath}}

       It hangs off Person rather than Participant — the one clinical fact
       recorded about the human being rather than about a study role.
     - Anchor: node-box:CauseOfDeath
  3. Condition
     - Description:
       ##### Condition
       {{model-description:Condition}}
     - Anchor: node-box:Condition
  4. Procedure
     - Description:
       ##### Procedure
       {{model-description:Procedure}}
     - Anchor: node-box:Procedure
  5. Exposure
     - Description:
       ##### Exposure
       {{model-description:Exposure}}

       DrugExposure and DeviceExposure are its subclasses — a medication and a
       foreign object respectively — and the diagram draws them merged into
       Exposure's box rather than as three separate boxes joined by edges.
     - Anchor: node-box:Exposure
  6. ImagingStudy
     - Description:
       ##### ImagingStudy
       {{model-description:ImagingStudy}}
     - Anchor: node-box:ImagingStudy
  7. BodySite
     - Description:
       ##### BodySite
       {{model-description:BodySite}}

       Condition, Procedure and ImagingStudy all point at it — *where* is part
       of what those records are. Anatomy belongs to Laboratory too, where a
       specimen's collection site names one, so the Explorer lists BodySite in
       both categories rather than choosing.
     - Anchor: node-box:BodySite
  8. what the category is for
     - Description:
       ##### What this category is for
       Clinical is the participant's medical history: diagnoses, procedures,
       exposures and imaging, each anchored to a person, a study role, and
       usually a point of contact with the health system. It says what was
       *found* or *done*. What was *measured* is the next category.
     - Anchor: none


### observation-measurement

- **Title:** Category: Observations / Measurements
- **Tour:** The BioData Catalyst Harmonized Model
- **Description:**
  This is where the numbers live. Twelve classes, but only four ideas: an
  **Observation** (one measured thing), an **ObservationSet** (a group of them
  taken together, like a blood panel), and the **Context** an observation was
  made in. Participant, Visit and BodySite are borrowed from elsewhere, because
  an observation is *of* someone, *at* an encounter, and often *somewhere* on a
  body.
- **Anchor:** category-row:observation
- Only: cat=observation
- **Action:** Drew the whole Observations / Measurements category, the same as pressing its ⊞ button.
- Beats:
  1. ObservationSet
     - Description:
       ##### ObservationSet
       {{model-description:ObservationSet}}

       A complete blood count is one ObservationSet holding a dozen
       Observations. `observations` is the attribute that owns them, which is
       the edge running rightward out of this box.
     - Anchor: node-box:ObservationSet
  2. Observation
     - Description:
       ##### Observation
       {{model-description:Observation}}

       Key and value: `observation_type` says *what was measured*, and one of
       four `value_` attributes holds the answer — `value_quantity` for a number
       with a unit, plus string, boolean and coded forms. Nearly every measured
       fact in BDCHM is one of these.
     - Anchor: node-box:Observation
  3. the five kinds
     - Description:
       ##### Five kinds of observation
       Observation has five subclasses, and the diagram merges them into one
       box rather than drawing five: **MeasurementObservation** (a clinical
       measurement), **SdohObservation** (social determinants of health),
       **DimensionalObservation** (length, width, area), and
       **SpecimenQualityObservation** and **SpecimenQuantityObservation**,
       which describe a specimen rather than a person. The last two are also
       listed under Laboratory.
     - Anchor: node-box:Observation
  4. sets mirror observations
     - Description:
       ##### The sets mirror them
       ObservationSet has its own subclasses — MeasurementObservationSet,
       SdohObservationSet, DimensionalObservationSet — one per kind of thing
       being grouped. Each owns observations of its matching type. The two
       hierarchies run in parallel, which is why the left of this diagram is
       two stacked merged boxes rather than one.
     - Anchor: node-box:ObservationSet
  5. Context and Activity
     - Description:
       ##### Context and Activity
       {{model-description:Context}} {{model-description:Activity}}

       Every kind of observation can carry a list of Contexts, and a Context
       points at the Activity that produced it — fasting, exercise, a dose
       administered. These are the circumstances that make a number
       interpretable.
     - Anchor: node-box:Context
  6. what the category is for
     - Description:
       ##### What this category is for
       Observations are the measured facts a researcher actually analyses.
       Everything else in the model exists to say *whose* they are, *when* they
       were taken, and *what they mean*. The subclass hierarchy here is the
       largest in BDCHM, and how the diagram draws inheritance gets a tour of
       its own.
     - Anchor: none


### lab-biospecimen

- **Title:** Category: Laboratory / Biospecimen
- **Tour:** The BioData Catalyst Harmonized Model
- **Description:**
  Twelve classes about *physical material* — what was collected from a
  participant, what was done to it, and what was measured on it. Specimen sits
  in the middle and almost everything here is attached to it. Participant is
  the one borrowed class: a specimen comes FROM someone, and that is the only
  outside fact the category needs.
- **Anchor:** category-row:lab
- Only: cat=lab
- **Action:** Drew the whole Laboratory / Biospecimen category, the same as pressing its ⊞ button.
- Beats:
  1. Specimen
     - Description:
       ##### Specimen
       {{model-description:Specimen}}

       `parent_specimen` points back at Specimen itself — the loop on this box
       — because an aliquot or a portion is a specimen derived from another
       specimen.
     - Anchor: node-box:Specimen
  2. SpecimenContainer
     - Description:
       ##### SpecimenContainer
       {{model-description:SpecimenContainer}}

       It nests the same way specimens do: `parent_container` is a loop, so a
       well sits in a plate.
     - Anchor: node-box:SpecimenContainer
  3. Assay
     - Description:
       ##### Assay
       {{model-description:Assay}}
     - Anchor: node-box:Assay
  4. the four activities
     - Description:
       ##### Four activities
       A specimen owns a history, and each stage is its own class:
       **SpecimenCreationActivity** (collected or derived),
       **SpecimenProcessingActivity** (changed without becoming something new),
       **SpecimenStorageActivity** (kept somewhere) and
       **SpecimenTransportActivity** (moved between places). Four edges leave
       Specimen for them, one per stage.
     - Anchor: node-box:SpecimenCreationActivity
  5. BiologicProduct
     - Description:
       ##### BiologicProduct
       {{model-description:BiologicProduct}}

       `derived_product` makes it something a specimen produced — a culture
       grown from a sample rather than the sample itself.
     - Anchor: node-box:BiologicProduct
  6. the specimen observations
     - Description:
       ##### Measuring the specimen
       SpecimenQualityObservation and SpecimenQuantityObservation hang off
       Specimen through `quality_measure` and `quantity_measure`. They are
       Observations — the same class you just met — pointed at material rather
       than at a person, which is why they are listed in both categories.
     - Anchor: node-box:SpecimenQualityObservation
  7. Substance
     - Description:
       ##### Substance
       {{model-description:Substance}}

       Three different things reach it: an Assay's reagent, a container's
       additive, and an additive used during collection or processing.
     - Anchor: node-box:Substance
  8. what the category is for
     - Description:
       ##### What this category is for
       Laboratory is the chain of custody: material comes off a participant,
       gets created, processed, stored and transported, and has assays and
       quality measures recorded against it. It is the only category that is
       mostly about *things* rather than about records.
     - Anchor: none


### survey-questionnaire

- **Title:** Category: Survey / Questionnaire
- **Tour:** The BioData Catalyst Harmonized Model
- **Description:**
  Ten classes, and almost no connection to the rest of the model. This is the
  one category you can read entirely on its own — nothing outside it needs to
  be borrowed in, and only a couple of attributes reach out. It is two mirrored
  halves: the **questions** on the left, the **answers** on the right.
- **Anchor:** category-row:survey
- Only: cat=survey
- **Action:** Drew the whole Survey / Questionnaire category, the same as pressing its ⊞ button.
- Beats:
  1. Questionnaire
     - Description:
       ##### Questionnaire
       {{model-description:Questionnaire}}
     - Anchor: node-box:Questionnaire
  2. QuestionnaireItem
     - Description:
       ##### QuestionnaireItem
       {{model-description:QuestionnaireItem}}

       `part_of` is a loop on this box, which is how a questionnaire nests
       sections inside sections: an item can be a group holding other items.
     - Anchor: node-box:QuestionnaireItem
  3. QuestionnaireResponse
     - Description:
       ##### QuestionnaireResponse
       {{model-description:QuestionnaireResponse}}

       It is the mirror of Questionnaire — one filled-in form against one
       blank one.
     - Anchor: node-box:QuestionnaireResponse
  4. QuestionnaireResponseItem
     - Description:
       ##### QuestionnaireResponseItem
       {{model-description:QuestionnaireResponseItem}}

       And this mirrors QuestionnaireItem. `has_questionnaire_item` is the edge
       joining the two halves: an answer knows which question it answers.
     - Anchor: node-box:QuestionnaireResponseItem
  5. the typed values
     - Description:
       ##### One answer, five types
       QuestionnaireResponseValue is a *single-valued answer*, and it has five
       subclasses — one each for a decimal, a boolean, an integer, a TimePoint
       and a string. The diagram merges them into one box. A model can either
       carry one loosely-typed value column or a class per type; BDCHM chose
       the second.
     - Anchor: node-box:QuestionnaireResponseValue
  6. self-contained
     - Description:
       ##### A subtree of its own
       Look at how few edges leave this picture. Almost the only thing Survey
       reaches outward for is the TimePoint a timed answer holds, and the Visit
       a response was collected at. Everywhere else in BDCHM, drawing a
       category means borrowing Participant and Visit to make it legible; here
       it does not.
     - Anchor: none
  7. what the category is for
     - Description:
       ##### What this category is for
       Survey holds instruments and their responses: the form as designed, and
       the form as filled in, kept deliberately apart so the same questionnaire
       can be answered many times. Its shape is borrowed from
       [FHIR](https://www.hl7.org/fhir/questionnaire.html), which is why it
       reads differently from the rest of the model.
     - Anchor: none


### other-files

- **Title:** Category: Files / Other
- **Tour:** The BioData Catalyst Harmonized Model
- **Description:**
  The leftovers, and they are leftovers of two quite different kinds: **files**
  attached to a participant, and **value types** — the small structured classes
  that other classes use to hold a number or a date. Both were pulled out here
  because they belong to no one category; they are used by all of them.
- **Anchor:** category-row:other
- Only: cat=other
- **Action:** Drew the whole Files / Other category, the same as pressing its ⊞ button.
- Beats:
  1. File
     - Description:
       ##### File
       {{model-description:File}}

       `derived_from` is a loop: a converted or processed file remembers the
       one it came from.
     - Anchor: node-box:File
  2. ImagingFile
     - Description:
       ##### ImagingFile
       {{model-description:ImagingFile}}

       It is File's only subclass today, so the diagram merges it into File's
       box rather than drawing two. Its extra rows — modality, series, an
       anatomical site — are the DICOM metadata a plain file has no room for,
       and `related_imaging_study` ties it back to Clinical's ImagingStudy,
       which is off this canvas.
     - Anchor: node-box:File
  3. Document
     - Description:
       ##### Document
       {{model-description:Document}}

       It stands alone on this canvas. Its `focus` attribute points at the
       universal root class, which the Explorer does not draw, and
       `related_document` reaches it from Specimen — so both of its edges land
       outside this category.
     - Anchor: node-box:Document
  4. Quantity
     - Description:
       ##### Quantity
       {{model-description:Quantity}}

       This is the most reused class in BDCHM. Observations of every kind hold
       their value in one; so do an assay's detection limits, a substance's
       amount, a procedure's quantity and a processing step's duration. It has
       no edges here because everything that points at it lives in another
       category.
     - Anchor: node-box:Quantity
  5. TimePoint and TimePeriod
     - Description:
       ##### TimePoint and TimePeriod
       {{model-description:TimePoint}}

       A TimePeriod is just a start and an end, both TimePoints — the two edges
       between those boxes. And `index_time_point` is a loop on TimePoint,
       which is what makes "six months after enrolment" expressible without
       knowing the calendar date.
     - Anchor: node-box:TimePoint
  6. what the category is for
     - Description:
       ##### What this category is for
       Nothing here is a subject of study. These are the building blocks
       everything else is made of — a number with a unit, a moment in time, a
       file on disk. A researcher reading the model meets them constantly and
       rarely needs to think about them, which is exactly why they were given
       their own corner rather than left scattered through the other five.
     - Anchor: none


### why

- **Title:** BDCHM Explorer
- **Tour:** The BioData Catalyst Harmonized Model
- **Description:** 
  BDCHM and the ingestion pipeline are built using [LinkML](https://linkml.io/).
  Neither the raw LinkML [YAML file](https://github.com/RTIInternational/NHLBI-BDC-DMC-HM/blob/main/src/bdchm/schema/bdchm.yaml)
  nor the LinkML [generated documentation](https://rtiinternational.github.io/NHLBI-BDC-DMC-HM/)
  are easy to grasp given that BDCHM's over 4,000-line schema includes around
  225 total attributes, 55 distinct class entities, 50 permissible value sets,
  7 primitive data types, and 80 relationships between class entities. 
  Yet doing almost anything involving BDCHM would require a basic, overall
  understanding of its structure. You may want to use BDCHM:
  - to analyze data harmonized to it (using [BDC's tools](https://biodatacatalyst.nhlbi.nih.gov/use-bdc/analyze-data/)
    or otherwise);
  - to harmonize your own data to it;
  - design new studies pre-harmonized to it; or
  - use it for ideas or inspiration in designing your own data models.

  The **BDCHM Explorer** provides a single-page, highly interactive interface
  allowing you to easily see details of and relationships between specific
  entities or neighborhoods around entities you select.
- **Anchor:** none
- **Change:**
- **Width:** 700

</details><!-- end of BDCHM tour -->
</div>

<div style="margin-left: 40px">
<details open>
<summary><b>Getting oriented</b></summary>

## Getting oriented
- **TourMetadata:**
- **Description:** How to use the BDCHM Explorer

### bdchm-entities

- **Title:** Model entities
- **Tour:** Getting oriented
- Only: panels=0
- **Anchor:** none
- **Highlight:** selection-tree
- **Width:** 800
- **Description:** [put some intro text here]
- **Beats:**
  1. selection
     - Description: The left panel lists every class in the model.
     - Anchor: entity-row:Person
     - Width: 300
  2. display
     - Keep: true
     - Description: Ticking one draws it. Person is now on the canvas.
     - Change: sel=Person
     - Anchor: node-box:Person
  3. relationships
     - Description:
       Entities can be related to each other in a variety of ways.
     - Change: sel=Participant~Visit~Observation
     - Anchor: node-box:Observation

</details><!-- end of Getting oriented tour -->
</div>

<div style="margin-left: 40px">
<details>
<summary><b>Walkthrough</b></summary>

## Walkthrough
- **TourMetadata:**
- **Description:** The original tour. Parts will be used for specific tours now.

### selection-tree

- **Title:** Entities
- **Tour:** Walkthrough
- **Anchor:** selection-tree
- **Description:** A LinkML schema defines classes representing a data model's
  entities. The left panel lists them, grouped into categories for convenience,
  though these categories are not actually part of the schema.
- **Beats:** <!-- these are just copied from below, need to get beats working
              right before authoring -->
  1. tick a checkbox
     - Description: In order to select an entity for display, click its checkbox
     - Anchor: entity-row:Person
  2. the box that appears
     - Description:
       The Person box shows the entity name, a dismiss (x) icon, a menu
       for displaying boxes for related entities, and a list of this entity's
       attributes.
     - Anchor: node-box:Person
     - Change: sel=Person
     - Action: I clicked the Person checkbox and the Person entity appeared in the viewing panel.
  3. the related counts
     - Description:
       Hover over the `← 2` or `1 →` counts to list the entities related to this
       one, and click any of them to display it.
     - Anchor: node-box:Person
     - Highlight: none

### entities

- **Title:** Entities
- **Tour:** Walkthrough
- **Anchor:** selection-tree
- **Description:** A LinkML schema defines classes representing a data model's
  entities. A class defines a set of slots or attributes (like columns in
  a database table) which can hold
  - other entities,
  - permissible value sets (enumerations),
  - or raw data types (strings, integers, etc.)

<!--
  TODO(siggie): translated faithfully, but note what this replaced. The
  entry that used to sit at tour position 2 was different copy entirely
  ("Choosing what to look at" — ownership nesting, what the checkbox vs the
  arrow vs the name each do, and a Context about an entity appearing in
  more than one place). Your draft's step 2 does not cover any of that.
  It is preserved verbatim as `selection-tree-mechanics` below, help-only,
  so nothing is lost. Decide whether your step 2 should absorb it.
-->

### relationship-kinds

- **Title:** How entities relate
- **Tour:** Walkthrough
- **Description:** 
  **[sg] this text is terrible. do we have something better?**
  While the relationship between an entity and its
  enumerations and raw data attributes is direct (e.g.,
  `MeasurementObservation.observation_type`
  → `MeasurementObservationTypeEnum`, or
  `MeasurementObservation.age_at_observation` → `integer`), it can be
  related to other entities in more complex ways.
 
- **Action:** Selected MeasurementObservation for you, and highlighted its `observation_type` attribute.
- **Anchor:** slot-row:MeasurementObservation.observation_type
- **Change:** sel=MeasurementObservation
- **Beats:**
  1. inheritance
     - Description: **Inheritance**, known in modeling parlance as IS_A relationships — e.g. `MeasurementObservation.is_a` → `Observation`.
     - Anchor: node-box:MeasurementObservation
  2. has-a
     - Description: **Association / ownership / containment**, known in modeling parlance as HAS_A relationships — e.g. `Visit.associated_participant` → `Participant`.
     - Anchor: node-box:MeasurementObservation
  3. UNFINISHED
     - Description: A primary goal
     - Anchor: none
  4. UNFINISHED
     - Description: Entities can be related to each other through
     - Anchor: none

<!--
  TODO(siggie): beats 4 and 5 are your two truncated sentences, carried
  over exactly as they trail off. Nothing invented. They will render as
  broken fragments in the tour until you finish them — that is deliberate,
  so they cannot ship unnoticed.

  [sg] the "solutions" below are not good

  TODO(siggie): this step is where you asked "can we animate this so that
  step 4 keeps this popover but shows the next bullet, etc?" Beats are the
  answer, and as of 2026-08-28 they ADD rather than replace, which is what
  you actually asked for: the Description stays on screen and each beat
  appears below it, earlier ones dimmed. The old beat 1 existed only to
  repeat the Description so it would not vanish -- deleted, with its
  `slot-row` anchor moved up to the entry where the step now starts.

  TODO(siggie): your draft numbers this "3" and puts "select
  MeasurementObservation and highlight observation_type" in the step title.
  The Action: field now says that out loud, which is the fix for the bug
  where a step changed the app silently.
-->

### selection-tree-mechanics

- **Title:** Choosing what to look at
- **Description:** Entities are arranged by **ownership**: an entity is nested under whatever owns it. Tick a checkbox to put an entity on the diagram. The checkbox is the only thing that selects — clicking the row or the arrow just opens and closes the tree.
- **Interactions:**
  - Checkbox — add or remove that entity from the diagram.
  - Arrow — expand or collapse, without changing the selection.
  - Name — open the details panel without changing the selection.
- **Context:** An entity can sit in more than one place in the tree, because things can be owned by more than one kind of thing. The widget marks the duplicates for you.
- **Anchor:** selection-tree

### graph-canvas

- **Title:** Selecting an entity
- **Tour:** Walkthrough
- **Description:** Select an entity by clicking its checkbox and it appears in the main panel. Only what you select is drawn — related entities are reached from the box's relation bar. There are five ways an entity can be related to another.
- **Action:** Cleared the diagram and drew just Participant and BodySite. You would normally do this by ticking them in the tree on the left.
- **Only:** sel=BodySite~Participant
- **Beats:**
  1. only what you select
     - Description: Select an entity by clicking its checkbox and it appears in the main panel. Only what you select is drawn. There are five ways an entity can be related to another.
     - Anchor: selection-tree
  2. the row
     - Description: This is the entity's row in the selection panel.
     - Anchor: entity-row:Participant
  3. the checkbox
     - Description: Clicking the checkbox is what puts it on the diagram.
     - Anchor: entity-checkbox:Participant

<!--
  TODO(siggie): your draft's step 4 says "goal is to show all the
  relationship types. if there are any entities that use all four, select
  one of those, otherwise will have to select one that has most and then
  select another that has the others." That is an instruction to yourself,
  not copy — it is NOT translated into a beat. The `Change:` above still
  carries the old `sel=BodySite~Participant`; pick the entity or entities
  that actually demonstrate all five once you have checked which do.

  This step now REPLACES the diagram (`Only:` rather than `Change:`, added
  2026-09-05), so MeasurementObservation from the previous step is gone and
  the canvas is the clean two-box example the copy reads as. Stepping BACK
  restores it.

  Note the count: your draft says "five ways" here and you confirmed five
  is right (four ownership kinds + associations). The stale "four" note is
  gone.

  TODO(siggie): this entry kept the id `graph-canvas` so its help-only
  content is not orphaned, but your draft's step 4 is about the SELECTION
  panel, not the canvas. The old canvas copy is preserved as
  `graph-canvas-reading` below. Consider renaming this entry.
-->

</details><!-- end of Walkthrough tour -->
</div>

</details><!-- end of Tours -->

<details>
<summary><b>Non-tour help items</b></summary>

### graph-canvas-reading

- **Title:** The diagram
- **Description:** Each box is an entity; each row inside it is one of that entity's attributes. Lines run from an owner to the thing it owns, so reading left to right is reading "contains".
- **Interactions:**
  - Click a box to open its details.
  - Drag a box to move it; drag the background to pan.
  - Click an attribute row that names an entity to pull that entity onto the diagram.
- **Anchor:** graph-canvas

### relation-bar

- **Title:** The relation bar
- **Description:** Every entity related to this one, split by which side of the diagram it sits on. **← N** counts the entities this one belongs to, drawn to its left; **M →** counts the ones it owns, drawn to its right. Hovering either opens the list.
- **Interactions:**
  - Hover **← N** or **M →** to list the relationships on that side.
  - Each row names the attribute that creates the relationship, draws the edge the way the diagram draws it, and gives the cardinality and the entity at the other end.
  - Click a row to put that entity on the diagram — which also ticks its checkbox on the left. Click it again to take it off; entities already drawn are dimmed.
  - "add all N" / "hide all N" draws or clears the whole side at once. "hide all" removes every entity on that side, including ones you had selected yourself.
  - **ⓘ** opens an entity's details without adding it to the diagram.
- **Context:** Entities are laid out so that owners come first, so everything that owns this one is to its left and everything it owns is to its right — that is all the two counts mean. The little edge on each row says something different: **which end carries the arrowhead**, and so which entity declares the attribute. Both kinds turn up on both sides. Of the four entities that own an Observation, three do because Observation points at them, and one because ObservationSet collects it. Organization is the extreme case: it owns thirteen kinds of thing and declares no attribute for any of them, so every row on its owned side points back at it.

### node-dismiss

- **Title:** Closing a box
- **Description:** Removes this entity from the diagram and unticks its checkbox on the left. A merged box removes every entity in it at once.

### toolbar-siblings

- **Title:** Merged inheritance boxes
- **Description:** When several entities on the diagram share a parent, they collapse into one box titled by that parent. Rows the parent defines come first, then a coloured header per child followed by the rows that child adds.
- **Interactions:**
  - Toggle off to draw each entity as its own separate box.
- **Context:** Lines leaving a child's rows take that child's colour, so you can trace a line back to the block it came from.

</details>

<details>
<summary><b>Sharing what you see</b></summary>

## Sharing what you see

### copy-link

- **Title:** Copy link
- **Tour:** Walkthrough
- **Description:** Copies a link that reproduces **exactly** this view — the selection and the toolbar settings. Anyone opening it sees what you see.
- **Interactions:**
  - Click to copy; the URL bar always holds the same link.
- **Context:** Settings travel in the link, so a diagram you set up deliberately does not get redrawn with someone else's preferences.
- **Change:**

<!--  probably not necessary; you'd already be there by the time you can display them, right?
### help-menu

- **Title:** Help
- **Description:** Everything explaining the diagram, in one menu.
  - **Tours** — guided walks, simplest first. Start anywhere: each one stands on its own, and you can leave with **Esc**.
  - **Ownership legend** — what the arrows, colors and toolbar buttons mean, and every relationship in the schema grouped by the rule that classified it.
  - **Example cases** — named selections that show particular routing and inheritance situations. Useful for seeing what the diagram does with the awkward cases.

  The legend and the cases open as separate panels, so you can keep the legend up while you flip through cases.

### help-button

- **Title:** Help and tour
- **Description:** **Take the tour** for a short guided walk through the app. Press `?` anywhere to start it, and again (or `Esc`) to leave.
- **Shortcut:** ?
-->

</details>
