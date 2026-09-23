# BDCHM Explorer help

Help + tour content for the dmvd Explorer. This file is dmvd's content; the
authoring format it is written in is specified in
[`src/help/FORMAT.md`](../help/FORMAT.md), which belongs to the help package
and knows nothing about BDCHM.

Parsed by [`parseHelpContent.ts`](../help/parseHelpContent.ts); pinned by
`src/test/helpContent.test.ts`. Package-level design lives in
[docs/HELP_PACKAGE_PLAN.md](../../docs/HELP_PACKAGE_PLAN.md).

**Terminology.** The things in the boxes are **entities**, and their rows are
**attributes**. Say "class" only when talking about LinkML itself or about
inheritance (subclass, parent class), where the word is the signal that we
mean is-a and not ownership — "parent" alone is ambiguous in an app whose
left panel nests entities under their owners. Ownership is owner/owned. No
hybrids ("entity class"): state the LinkML equivalence once where the term is
introduced and then use one word.

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
- **TourAbbr:** BDCHM Data Categories
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
- **Width:** 500
- **Description:** 
  BioData Catalyst ([BDC](https://biodatacatalyst.nhlbi.nih.gov/)) is a cloud-based ecosystem where researchers can find and work
  with [NHLBI](https://www.nhlbi.nih.gov/) data resources. **BDCHM** currently harmonizes nine priority [TOPMed](https://topmed.nhlbi.nih.gov/)
  cohorts (e.g., the Framingham Heart Study and Women's Health Initiative)
  and the [INCLUDE Data Hub](https://portal.includedcc.org/), with more on their way.

### model-categories

- **Title:** Categories of data in the model
- **Tour:** The BioData Catalyst Harmonized Model
- Only: panels=0
- **Anchor:** selection-tree
-  **Position:** right
- **OffsetX:** anchor.width * .3
- **Highlight:** selection-tree
- **Width:** 500
- **Description:** 
  What's in the model?

  The BDCHM schema provides a flexible, general purpose structure
  for storing clinical trials data. BDCHM Explorer categorizes the
  entities specified in the model into six areas to make it easier
  to browse and comprehend. This tour will walk you through each
  category.


### admin-study

- **Title:** Admin / Study
- **Tour:** The BioData Catalyst Harmonized Model
- **Anchor:** category-row:admin
- **Description:**
  These are the entities around which study data — describing
  clinical events and observations, specimens, surveys —
  are organized.

  ###### Clicking the **⊞** button by the category title draws the whole category on the canvas.
<!-- - **Action:** Drew the whole Admin / Study category, the same as pressing its ⊞ button.-->
- Beats:
  1. Walk through
     - Description:
       We will now walk through each entity in the category. If you would like to skip
       to another category, click ⊞ below.
     - Only: cat=admin
  2. ResearchStudyCollection
     - Description:
       A **ResearchStudyCollection** contains a list of **ResearchStudies**
       and, through them, owns every other entity in the model.

       *{{model-description:ResearchStudyCollection}}*
     - Anchor: node-box:ResearchStudyCollection
  3. ResearchStudy
     - Description:
       ##### ResearchStudy
       *{{model-description:ResearchStudy}}*

       `part_of` points at ResearchStudy itself — the loop on this box — so a
       study can be a sub-study of another.
     - Anchor: node-box:ResearchStudy
  4. Organization
     - Description:
       ##### Organization
       *{{model-description:Organization}}*

       It declares no attribute pointing at anything here. Everything that
       names an Organization — `Participant.originating_site`, and the
       `performed_by` that Observation, ObservationSet and
       SpecimenCreationActivity declare and their subclasses inherit — is
       declared elsewhere and drawn back at it.
     - Anchor: node-box:Organization
  5. Person
     - Description:
       ##### Person
       *{{model-description:Person}}*
     - Anchor: node-box:Person
  6. Participant
     - Description:
       ##### Participant
       *{{model-description:Participant}}*
     - Anchor: node-box:Participant
  7. person vs participant
     - Description:
       ##### One person, several participants
       Person and Participant are the first genuinely modelling-flavoured
       distinction in the schema, and it is worth slowing down for. A
       **Person** is generally a human being. A **Participant** is that person's role in
       one study, and `associated_person` is the link. The same person enrolled
       in three studies is three Participants — usually de-identified and
       deliberately untraceable back to the actual person.
     - Anchor: node-box:Participant
  8. Consent
     - Description:
       ##### Consent
       *{{model-description:Consent}}*

       Both Participant and ResearchStudy own a list of them, so consent is
       recorded per person and per study.
     - Anchor: node-box:Consent
  9. Visit
     - Description:
       ##### Visit
       *{{model-description:Visit}}*
     - Anchor: node-box:Visit
  10. Demography
     - Description:
       ##### Demography
       *{{model-description:Demography}}*

       Sex, ethnicity and race sit here rather than on Person. Demography
       points at a Participant, and optionally at the Visit it was recorded
       at — so it is a record ABOUT a participant, not a fixed property of the
       human being.
     - Anchor: node-box:Demography


### clinical-records

- **Title:** Clinical
- **Tour:** The BioData Catalyst Harmonized Model
- **Description:**
  Eight entities record *what happened to a participant medically*. Every one of
  them is a record **of** someone, usually **at** an encounter — which is why Person,
  Participant and Visit are drawn here too even though they belong to Admin.
  Take them away and Clinical is a pile of disconnected records.
- **Anchor:** category-row:clinical
- Only: cat=clinical
<!-- - **Action:** Drew the whole Clinical category, the same as pressing its ⊞ button. -->
- Beats:
  1. three boxes on loan
     - Description:
       ##### Three boxes on loan
       Person, Participant and Visit are Admin entities, pinned into this view
       because the category does not mean anything without them. Read the rest
       of the diagram as hanging off Participant: everything to its right is a
       record about that participant.
     - Anchor: node-box:Participant
  2. CauseOfDeath
     - Description:
       ##### CauseOfDeath
       *{{model-description:CauseOfDeath}}*

       It belongs to Person rather than to Participant — the one clinical
       fact recorded about the human being rather than about a study role,
       and the reason Person is drawn on this canvas at all.
     - Anchor: node-box:CauseOfDeath
  3. Condition
     - Description:
       ##### Condition
       *{{model-description:Condition}}*
     - Anchor: node-box:Condition
  4. Procedure
     - Description:
       ##### Procedure
       *{{model-description:Procedure}}*
     - Anchor: node-box:Procedure
  5. Exposure
     - Description:
       ##### Exposure
       *{{model-description:Exposure}}*

       DrugExposure and DeviceExposure are its subclasses — a medication and a
       foreign object respectively — and the diagram draws them merged into
       Exposure's box rather than as three separate boxes joined by edges.
     - Anchor: node-box:Exposure
  6. ImagingStudy
     - Description:
       ##### ImagingStudy
       *{{model-description:ImagingStudy}}*
     - Anchor: node-box:ImagingStudy
  7. BodySite
     - Description:
       ##### BodySite
       *{{model-description:BodySite}}*

       Condition, Procedure and ImagingStudy all point at it — *where* is part
       of what those records are. Anatomy belongs to Laboratory too, where a
       specimen's collection site names one, so the Explorer lists BodySite in
       both categories rather than choosing.
     - Anchor: node-box:BodySite


### observation-measurement

- **Title:** Observations / Measurements
- **Tour:** The BioData Catalyst Harmonized Model
- **Description:**
  This is where the numbers live. Twelve entities, but only four ideas: an
  **Observation** (one measured thing), an **ObservationSet** (a group of them
  taken together, like a blood panel), and the **Context** an observation was
  made in. Participant, Visit and BodySite are borrowed from elsewhere, because
  an observation is *of* someone, *at* an encounter, and often *somewhere* on a
  body.
- **Anchor:** category-row:observation
- Only: cat=observation
<!-- - **Action:** Drew the whole Observations / Measurements category, the same as pressing its ⊞ button. -->
- Beats:
  1. ObservationSet
     - Description:
       ##### ObservationSet
       *{{model-description:ObservationSet}}*

       A complete blood count is one ObservationSet holding a dozen
       Observations. `observations` is the attribute that owns them, which is
       the edge running rightward out of this box.
     - Anchor: node-box:ObservationSet
  2. Observation
     - Description:
       ##### Observation
       *{{model-description:Observation}}*

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
       *{{model-description:Context}}* {{model-description:Activity}}

       Every kind of observation can carry a list of Contexts, and a Context
       points at the Activity that produced it — fasting, exercise, a dose
       administered. These are the circumstances that make a number
       interpretable.
     - Anchor: node-box:Context


### lab-biospecimen

- **Title:** Laboratory / Biospecimen
- **Tour:** The BioData Catalyst Harmonized Model
- **Description:**
  Twelve entities about *physical material* — what was collected from a
  participant, what was done to it, and what was measured on it. Specimen sits
  in the middle and almost everything here is attached to it. Participant is
  the one borrowed entity: a specimen comes FROM someone, and that is the only
  outside fact the category needs.
- **Anchor:** category-row:lab
- Only: cat=lab
<!-- - **Action:** Drew the whole Laboratory / Biospecimen category, the same as pressing its ⊞ button. -->
- Beats:
  1. Specimen
     - Description:
       ##### Specimen
       *{{model-description:Specimen}}*

       `parent_specimen` points back at Specimen itself — the loop on this box
       — because an aliquot or a portion is a specimen derived from another
       specimen.
     - Anchor: node-box:Specimen
  2. SpecimenContainer
     - Description:
       ##### SpecimenContainer
       *{{model-description:SpecimenContainer}}*

       It nests the same way specimens do: `parent_container` is a loop, so a
       well sits in a plate.
     - Anchor: node-box:SpecimenContainer
  3. Assay
     - Description:
       ##### Assay
       *{{model-description:Assay}}*
     - Anchor: node-box:Assay
  4. the four activities
     - Description:
       ##### Four activities
       A specimen owns a history, and each stage is its own entity:
       **SpecimenCreationActivity** (collected or derived),
       **SpecimenProcessingActivity** (changed without becoming something new),
       **SpecimenStorageActivity** (kept somewhere) and
       **SpecimenTransportActivity** (moved between places). Four edges leave
       Specimen for them, one per stage.
     - Anchor: node-box:SpecimenCreationActivity
  5. BiologicProduct
     - Description:
       ##### BiologicProduct
       *{{model-description:BiologicProduct}}*

       `derived_product` makes it something a specimen produced — a culture
       grown from a sample rather than the sample itself.
     - Anchor: node-box:BiologicProduct
  6. the specimen observations
     - Description:
       ##### Measuring the specimen
       SpecimenQualityObservation and SpecimenQuantityObservation hang off
       Specimen through `quality_measure` and `quantity_measure`. They are
       Observations — the same entity you just met — pointed at material rather
       than at a person, which is why they are listed in both categories.
     - Anchor: child-header:SpecimenQualityObservation
  7. Substance
     - Description:
       ##### Substance
       *{{model-description:Substance}}*

       Three different things reach it: an Assay's reagent, a container's
       additive, and an additive used during collection or processing.
     - Anchor: node-box:Substance


### survey-questionnaire

- **Title:** Survey / Questionnaire
- **Tour:** The BioData Catalyst Harmonized Model
- **Description:**
  This section contains the defining data for surveys
- **Anchor:** category-row:survey
- Only: 
<!-- - **Action:** Drew the whole Survey / Questionnaire category, the same as pressing its ⊞ button. -->
- Beats:
  1. Questionnaire
     - Keep: true
     - Only: cat=survey
     - Description:
       - **Questionnaire** — the title, description, etc.
       - **QuestionnaireItem** — sections, subsections, question text
     - Anchor: node-box:Questionnaire
  1. Questionnaire
     - Keep: true
     - Description:
       and the responses: 
       - **QuestionnaireResponse** — a holder for answers and pointer to the visit
         where the survey was administered
       - **QuestionnaireResponseItem** — a pointer to the QuestionnaireItem definition
       - **QuestionnairResponseValue** — the respondent's answers.
     - Anchor: node-box:Questionnaire
  1. Questionnaire
     - Description:
       ##### Questionnaire
       *{{model-description:Questionnaire}}*
     - Anchor: node-box:Questionnaire
     - Only: cat=survey
  2. QuestionnaireItem
     - Description:
       ##### QuestionnaireItem
       *{{model-description:QuestionnaireItem}}*

       Using `part_of`, QuestionnaireItems can serve as sections to
       hold other sections or specific items.
     - Anchor: node-box:QuestionnaireItem
  3. QuestionnaireResponse
     - Description:
       ##### QuestionnaireResponse
       *{{model-description:QuestionnaireResponse}}*
     - Anchor: node-box:QuestionnaireResponse
  4. QuestionnaireResponseItem
     - Description:
       ##### QuestionnaireResponseItem
       *{{model-description:QuestionnaireResponseItem}}*
     - Anchor: node-box:QuestionnaireResponseItem
  5. the typed values
     - Description:
       ##### One answer, five types
       *{{model-description:QuestionnaireResponseValue}}*
     - Anchor: node-box:QuestionnaireResponseValue
  6. SdhohObservations
     - Change: sel=SdohObservation
     - Spotlight: child-header:SdohObservation, node-box:Participant, node-box:QuestionnaireResponse
     - Highlight: ring
     - Anchor: node-box:QuestionnaireItem
     - Description:
       Social Determinants of Health observations can be tied
       to QuestionnaireItems
  6. Visit connection
     - Change: sel=Visit~Participant
     - Anchor: node-box:QuestionnaireResponse
     - Spotlight: node-box:Visit, node-box:QuestionnaireItem
     - Highlight: ring
     - Description:
       Responses must be attached to Participants through **Visits**

### other-files

- **Title:** Files / Other
- **Tour:** The BioData Catalyst Harmonized Model
- **Description:**
  The leftovers, and they are leftovers of two quite different kinds: **files**
  attached to a participant, and **value types** — the small structured entities
  that other entities use to hold a number or a date. Both were pulled out here
  because they belong to no one category; they are used by all of them.
- **Anchor:** category-row:other
- Only: cat=other
<!-- - **Action:** Drew the whole Files / Other category, the same as pressing its ⊞ button. -->
- Beats:
  1. Document
     - Description:
       ##### Document
       *{{model-description:Document}}*

       It stands alone on this canvas. Its `focus` attribute points at the
       root of the whole model, a class named Entity that the Explorer does not draw, and
       `related_document` reaches it from Specimen — so both of its edges land
       outside this category.
     - Anchor: node-box:Document
  2. File
     - Description:
       ##### File
       *{{model-description:File}}*

       `derived_from` is a loop: a converted or processed file remembers the
       one it came from.
     - Anchor: node-box:File
  3. ImagingFile
     - Description:
       ##### ImagingFile
       *{{model-description:ImagingFile}}*

       It is File's only subclass today, so the diagram merges it into File's
       box rather than drawing two. Its extra rows — modality, series, an
       anatomical site — are the DICOM metadata a plain file has no room for,
       and `related_imaging_study` ties it back to Clinical's ImagingStudy,
       which is off this canvas.
     - Anchor: node-box:File
  4. Quantity
     - Description:
       ##### Quantity
       *{{model-description:Quantity}}*

       This is the most reused entity in BDCHM. Observations of every kind hold
       their value in one; so do an assay's detection limits, a substance's
       amount, a procedure's quantity and a processing step's duration. It has
       no edges here because everything that points at it lives in another
       category.
     - Anchor: node-box:Quantity
  5. TimePoint and TimePeriod
     - Description:
       ##### TimePoint and TimePeriod
       *{{model-description:TimePoint}}*

       A TimePeriod is just a start and an end, both TimePoints — the two edges
       between those boxes. And `index_time_point` is a loop on TimePoint,
       which is what makes "six months after enrolment" expressible without
       knowing the calendar date.
     - Anchor: node-box:TimePoint

</details><!-- end of BDCHM tour -->
</div>

<div style="margin-left: 40px">
<details open>
<summary><b>Using the Explorer</b></summary>

## Using the Explorer
- **TourMetadata:**
- **TourAbbr:** The Explorer
- **Description:** What the Explorer is for, and how to use it: the panel, what a box shows, how to read a row, and how to grow a diagram one hop at a time

### bdchm-entities

- **Title:** What this is for
- **Tour:** Using the Explorer
- Only: panels=0
- **Anchor:** none
- **Highlight:** none
- **Width:** 700
- **Description:**
  The **BioData Catalyst Harmonized Model** (BDCHM) is a general-purpose
  schema for describing and storing clinical trial data (the
  [BDCHM tour](./?tour=the-biodata-catalyst-harmonized-model){{target:replace}}
  walks through its contents). It is a complex model and this **BDCHM
  Explorer** app provides a way to navigate through it and understand its
  parts and how they relate to each other. This tour walks you through the
  app's features: how to put entities on the canvas, what a box shows, and how
  to move from one entity to the ones it is connected to. It grows one small
  diagram a step at a time, illustrating the steps for examining a
  neighborhood of model entities you are interested in.

  You may want to use BDCHM:
  - to analyze data harmonized to it (using [BDC's tools](https://biodatacatalyst.nhlbi.nih.gov/use-bdc/analyze-data/)
    or otherwise);
  - to harmonize your own data to it;
  - to design new studies pre-harmonized to it; or
  - for ideas or inspiration in designing your own data models.
- **Beats:**
  1. the panel
     - Description:
       ##### Every entity is in the panel
       The left panel lists every entity in the model, grouped into six
       categories. The grouping is the Explorer's, not the schema's — it is
       there to make {{schema-count:panelEntities}} entities browsable.
     - Anchor: entity-row:Person
     - Highlight: ring
     - Width: 420
  2. display
     - Description: Ticking one draws it. Person is now on the canvas.
     - Change: sel=Person
     - Action: Ticked Person for you.
     - Anchor: node-box:Person


### entity-box

- **Title:** What a box shows
- **Tour:** Using the Explorer
- **Only:** sel=Person
- **Anchor:** node-box:Person
- **Description:**
  A box is one entity. Its header carries the entity name and, at the far
  right, a ✕ that takes it off the canvas again. Below the header there is
  one row per attribute: its name on the left, and on the right what it holds
  and how many.
- **Beats:**
  1. how many
     - Description:
       ##### How many
       The small grey figure after the type is the cardinality: `1..1`
       exactly one, `0..1` at most one, `0..*` any number, `1..*` at least
       one. The left digit says whether the attribute is required, the right
       whether it is a list.
     - Anchor: slot-row:Person.year_of_birth
     - Position: right


### rows-and-dots

- **Title:** Three kinds of row
- **Tour:** Using the Explorer
- **Only:** sel=Person
- Anchor: slot-row:Person.year_of_birth
- Position: right
- **Description:**
  The dot at a row's left and the label at its right share a color, and the
  color says what KIND of thing the attribute holds. There are three, and the
  difference that matters is whether what it holds is another **entity** — one
  of the things the panel lists, which can therefore get a box of its own.
- **Beats:**
  1. a data type
     - Description:
       ##### Green: a data value
       `year_of_birth` is an integer. Green rows hold plain data — strings,
       numbers, dates. Nothing to draw: a number is not an entity.
     - Anchor: slot-row:Person.year_of_birth
  2. a value set
     - Description:
       ##### Purple: a value set
       `vital_status` holds one code from a fixed list of permitted values, an
       enumeration. The Explorer does not yet display enumeration values.
     - Anchor: slot-row:Person.vital_status
  3. an entity
     - Description:
       ##### Blue: another entity
       `cause_of_death` holds CauseOfDeath, another entity, which also
       appears in the Entities panel. on the canvas yet. Clicking the row
       (or ticking its checkbox in the panel) will add it to the canvas.
     - Anchor: node-box:Person
     - Position: bottom
     - Spotlight: slot-row:Person.cause_of_death, entity-row:CauseOfDeath
     - Highlight: ring
  4. click cause_of_death
     - **Action:** Clicked Person.cause_of_death row
     - Description: 
       #### Clicking the row has
       - Added CauseOfDeath to the canvas
       - Drawn a forward-pointing arrow {{edge:own-fwd}}
         from the `Person.cause_of_death`
         attribute to the CauseOfDeath box, meaning that
         *Person **owns** CauseOfDeath through this attribute*
         :::s{center color=own-fwd}
           {{relation:own-fwd:Person.cause_of_death:CauseOfDeath}}
         :::
       - Ticked CauseOfDeath in the panel
       - Moved the row to the top of the Person attributes, and
       - Made the dot to the left of the attribute solid
     - Change: sel=CauseOfDeath
     - Anchor: node-box:Person
     - Position: bottom
     - Spotlight: slot-row:Person.cause_of_death, entity-row:CauseOfDeath, node-box:CauseOfDeath
     - Highlight: ring


### relation-bar-step

- **Title:** The relation bar
- **Tour:** Using the Explorer
- Only: sel=Person~CauseOfDeath
- **Anchor:** node-box:Person
- Position: bottom
- **Spotlight:** relation-bar:Person
- Highlight: ring
- **Description:**
  #### Connecting to non-attribute relations
  The attribute list only shows attributes declared on this entity, but an entity can also be related to other entities through that entity's attributes. In order to make those apparent and reachable, there's a row above the attributes showing counts of all RELATED entities on the left and right.

  **← N** is how many entities this one belongs to, which the layout draws to its left; **:s[M →]{white-space:nowrap}** how many it owns, drawn to its right. **Hover either count for the list, and click a row in that list to draw it.**

  Person does not belong to any other entity but, in addition to CauseOfDeath,
  it owns Participant through `Participant.associated_person`. We will add
  that now.
- **Beats:**
  1. the row that made the line
     - **Change:** sel=Participant
     - Anchor: node-box:Participant
     - Position: right
     - **Spotlight:** relation-bar:Person, slot-row:Participant.associated_person
     - **Action:** Clicked `Participant.associated_person` through **Person**'s RELATED menu
     - Description:
       :::s{center color=own-bkwd}
         {{relation:own-bkwd:Person:Participant.associated_person}}
       :::
       Participant :s[belongs to]{color=own-bkwd} Person, but since the attribute that relates them is declared on Participant, we had to find and show Participant through Person's forward-pointing RELATED menu.
  2. owners on the left
     - Anchor: node-box:Participant
     - Position: right
     - Spotlight: node-box:Person, node-box:Participant
     - Description:
       ##### Owners on the left
       The canvas is laid out by ownership: owners on the left, what they own to the right. A **Person** is a human being; a **Participant** is that person's role in one study, and the same person in three studies is three Participants. The [Ownership tour](./?tour=ownership){{target:replace}} explains how the Explorer decides which end owns which.
  3. the row that made the line
     - Anchor: node-box:Participant
     - Position: right
     - Spotlight: slot-row:Participant.associated_person, node-box:Person
     - Description:
       ##### A line leaves its attribute row
       The line starts at Participant's `associated_person` row, not at the box, so you can always see which attribute connects two entities. It ends on the Person box as a whole.


### grow-visit

- **Title:** Visits and observations
- **Tour:** Using the Explorer
- **Only:** sel=Person~Participant~Visit
- **Action:** Added Visit from Participant's → list.
- **Anchor:** node-box:Visit
- **Description:**
  A **Visit** is an encounter with the healthcare system, and most of what is recorded about a participant is recorded at one. Visit belongs to Participant the way Participant belongs to Person, through an attribute declared on Visit:
  :::s{center color=entity}
    {{relation:own-bkwd:Participant:Visit.associated_participant}}
  :::
- **Beats:**
  1. an observation
     - Change: sel=Observation
     - Action: Added Observation from Visit's → list.
     - Anchor: node-box:Observation
     - Position: span-left bottom
     - Description:
       ##### Observation
       *{{model-description:Observation}}*

       Its `associated_participant` and `associated_visit` rows name the Participant it is about and the Visit it was made at, so it has a line to each.
  2. the value
     - Change: sel=Quantity
     - Action: Added Quantity, the same as clicking the `value_quantity` row.
     - Anchor: node-box:Quantity
     - Description:
       ##### Quantity
       *{{model-description:Quantity}}*
       :::s{center color=entity}
         {{relation:own-fwd:Observation.value_quantity:Quantity}}
       :::


### detail-panel

- **Title:** Details, and moving around
- **Tour:** Using the Explorer
- **Change:** detail=Observation
- **Action:** Opened the details panel for Observation, the same as clicking its box header.
- **Anchor:** none
- **Description:**
  Clicking a box header opens the entity's details: its description, every attribute with its type, and the entities that refer to it. Entity names in the panel are links, so you can read about a related entity without drawing it. The **ⓘ** beside an entry in the relation bar opens the same panel.
- **Beats:**
  1. moving around
     - Change: panels=0
     - Action: Closed the details panel.
     - Anchor: graph-canvas
     - Highlight: ring
     - Description:
       ##### Moving around
       - Drag the background to pan.
       - Zoom with Ctrl+wheel (⌘+wheel on a Mac, or a pinch), or with the `+` `−` `1:1` `⛶` buttons at the top right; `⛶` fits the whole diagram.
       - `LR` / `TB` lay the diagram out left to right or top down.
       - Hover a box to fade everything not connected to it.
       - Drag a box out of the way; the next change to the selection lays everything out again.


### where-next

- **Title:** Where to go from here
- **Tour:** Using the Explorer
- **Anchor:** none
- **Description:**
  To grow a diagram, tick an entity in the panel, click an entity row in a box, or pick from a box's relation bar.
- **Beats:**
  1. category views
     - Anchor: category-row:admin
     - Description:
       ##### A whole category
       The ⊞ on a category header draws every entity in that category, plus the few outside entities it depends on. It replaces whatever is on the canvas.
  2. copy link
     - Anchor: copy-link
     - Description:
       ##### Sharing a view
       **Copy link** copies a URL that reproduces this canvas for anyone who opens it.
  3. the other tours
     - Anchor: tour-chooser
     - Description:
       ##### Other tours
       - [The BioData Catalyst Harmonized Model](./?tour=the-biodata-catalyst-harmonized-model){{target:replace}} walks the six categories and what is in them.
       - [Ownership](./?tour=ownership){{target:replace}} explains which way each line points and where boxes land.
       - [Inheritance](./?tour=inheritance){{target:replace}} explains boxes that hold several entities at once.


</details><!-- end of Using the Explorer tour -->
</div>

<!--
<div style="margin-left: 40px">
<details open>
<summary><b>What BDCHM is built with</b></summary>

## What BDCHM is built with
- **TourMetadata:**
- **TourAbbr:** Built with
- **Description:** The schema behind the diagrams: LinkML, the size of the model, and how studies get harmonized into it

### linkml-context

- **Title:** A LinkML schema
- **Tour:** What BDCHM is built with
- Only: panels=0
- **Anchor:** none
- **Highlight:** none
- **Width:** 700
- **Description:**
  Everything the Explorer draws is read out of one schema. BDCHM and the
  ingestion pipeline are built using [LinkML](https://linkml.io/), and the
  model is a single [YAML file](https://github.com/RTIInternational/NHLBI-BDC-DMC-HM/blob/main/src/bdchm/schema/bdchm.yaml)
  of several thousand lines.

  What the Explorer shows you is that file, rearranged: an entity box is a
  LinkML **class**, a row is a **slot**, a purple row's value set is an
  **enum**, and a line is a slot whose `range` is another class.
- **Beats:**
  1. how big
     - Description:
       ##### How big it is
       {{schema-count:classes}} classes, {{schema-count:slots}} attributes,
       {{schema-count:enums}} permissible value sets and
       {{schema-count:types}} primitive types. Of those attributes,
       {{schema-count:classRangedSlots}} have another class as their range —
       those are every line the canvas could ever draw.
     - Anchor: selection-tree
     - Highlight: ring
  2. the generated docs
     - Description:
       ##### Why not just read it
       LinkML also produces [generated documentation](https://rtiinternational.github.io/NHLBI-BDC-DMC-HM/)
       from that file, a page per class. Both it and the raw YAML are
       authoritative and neither shows you a *shape*: to see that a Visit
       belongs to a Participant and owns a TimePeriod you have to hold several
       pages in your head at once. That is the gap this app fills.

### harmonization

- **Title:** How data gets into it
- **Tour:** What BDCHM is built with
- **Anchor:** none
- **Highlight:** none
- **Width:** 700
- **Description:**
  Studies arrive with their own terminologies, units and file structures.
  They are transformed into this common schema by the Data Model-Based
  Ingestion Pipeline ([dm-bip](https://linkml.io/dm-bip/)), which is also
  LinkML-driven — so the mapping from a study's own columns to BDCHM's
  classes and slots is itself a schema artifact rather than a script.

  That is why the structure in this app is worth learning even if you never
  write a line of LinkML: it is the shape your harmonized data will have.

</details><!-- end of What BDCHM is built with tour -- >
</div>
-->

<div style="margin-left: 40px">
<details open>
<summary><b>Ownership</b></summary>

## Ownership
- **TourMetadata:**
- **Description:** How to read a line's direction, why boxes land where they do, and the rule the Explorer decides it by

<!--
The structure, which the steps below now follow:
- which-way -- read a line's direction off the canvas, and learn that the two
  arrow kinds are the only two there are. Carries the whole of what an arrow
  means; `why-ownership` and `edge-types` were folded into it 2026-09-20.
- the rule and its exceptions, in teaching order, each step ending at the
  Legend block that counts it (`Spotlight: legend-rule:<rule-id>`):
  - the-legend -- introduces the Legend and the scale of the problem
  - owns-target -- the default rule itself, an attribute owns what it points
    at, with its four counts. Its beats split the rule's attributes into
    multivalued and single-valued ("Facts") and then say that the split
    decides NOTHING: those were two separate rules once, and collapsing them
    is why there are three rules and not more. Rationale for modelers, not
    machinery -- no code reads cardinality.
  - belongs-to-target-backward-by-entity -- exception, by entity: referred-to entities
  - belongs-to-target-backward-by-attribute -- exception, by attribute: named back-pointers
- then what the rules look like once they are all running at once:
  - bar-sides -- one side of a box, reached by two different rules
  - loops -- an attribute whose range is its own entity
  - rules-recap
- (association edges are a commented-out appendix at the end, or not)

The induced pass (`child-following-parent`) is deliberately NOT a step here,
and is not in the legend either: induced edges serve LAYOUT only, so there is
nothing for a reader to do with them. Documented for maintainers in
OWNERSHIP_CLASSIFICATION.md.

Every count below is LIVE — an `ownership-count` placeholder, resolved against
the classifier at render — and the rule names are the legend's own `label`
strings from `OWNERSHIP_RULES`, so tour, legend and classifier say one thing.
If a label changes there, change it here. Do not hand-type a count.

⚠️ There is no live key for the multivalued/single-valued split — only
`owners`/`attrs`/`owned`/`total` — so `owns-target`'s beats say "the other
group" rather than a number. Do not hand-type one.

⚠️ Be sparing with `Position:` here. The automatic rule puts the popover BELOW
the anchored box and knows about the diagram's growth axis; an override throws
that away, and on a left-to-right chain there is usually nowhere better for it
to go. `Position: left` on a beat anchored to the RIGHTMOST box sent the
popover across the canvas onto the box holding its own spotlit row.

⚠️ These steps currently fight for room with the Legend, which draws OVER the
canvas instead of beside it (TASKS `panel-refit`). Do not author around that by
adding `Position:` overrides — when the canvas learns to fit beside the panel,
every such override becomes wrong, and the tour would need unpicking rather
than just re-reading.
-->

### which-way

- **Title:** Which way an arrow points
- **Tour:** Ownership
- **Only:** sel=Participant~Visit~TimePeriod
- **~~Action:~~** Drew Participant, Visit and TimePeriod.
- **Anchor:** node-box:Visit
- **Spotlight:** slot-row:Visit.year_range, node-box:TimePeriod, node-box:Participant
- **Description:**
  Visit defines two entity attributes, `year_range` and `associated_participant`.
  Arrows from these point at their targets in opposite directions, conveying
  an **ownership**:s[*]{sup} relationship. The direction of this relationship is not specified in the
  BDCHM schema but in the Explorer's configuration.

  This tour will explain the rules determining that direction after quickly describing
  the arrows.

  :s[*]{sup} :s[Also called containment, composition, 'has-a', or `has-part`/`part-of`.]{size=0.7em}
- **Beats:**
  1. forward
     - **Description:**
       ##### Visit *:s[owns]{color=own-fwd}* TimePeriod
       When the Explorer reads an attribute as :s[owning]{color=own-fwd} what it
       points at, it draws the target to the **right** and gives the line a
       forward-pointing arrow {{edge:own-fwd}}:
       :::s{center color=entity}
         {{relation:own-fwd:Visit.year_range:TimePeriod}}
       :::

  2. the other way
     - Keep: true
     - **Spotlight:** slot-row:Visit.associated_participant, node-box:TimePeriod, node-box:Participant
     - Description:
       ##### Visit *:s[belongs to]{color=own-bkwd}* Participant
       When it reads the attribute the other way — the entity declaring it
       :s[belongs to]{color=own-bkwd} the target — it draws the target to the
       **left** and points the arrow back at it {{edge:own-bkwd}}.
       :::s{center color=entity}
         {{relation:own-bkwd:Participant:Visit.associated_participant}}
       :::

  3. only-two-kinds
     - Keep: true
     - **Only:** sel=Participant~Visit~TimePeriod&panels=0
     - **Spotlight:** node-box:TimePeriod, node-box:Participant
     - Highlight: none
     - Description:
       Those two are the only kinds of line on the canvas. Everything that
       follows is about which one an attribute gets.

### the-legend

- **Title:** Ownership rules
- **Tour:** Ownership
- **Only:** sel=Participant~Visit~TimePeriod&legend=1
- **Action:** Opened the Legend panel — it is always in the Help menu.
- **Anchor:** legend-section:ownership-rules
- **Description:**
  Across the {{schema-count:panelEntities}} entities in the BDCHM schema there
  are {{ownership-count:declared}} attributes pointing from one entity to
  another. The schema doesn't say which end owns which, so the Explorer decides.
  The rules are laid out in the **Legend**.

### owns-target

- **Title:** Rules — Owns target
- **Tour:** Ownership
- **Only:** sel=Participant~Visit~TimePeriod&legend=1
- **Anchor:** node-box:Participant
- **Position:** span-right bottom
- **Spotlight:** legend-rule:owns-target-forward-by-default
- **Highlight:** ring
- **Description:**
  The default rule is **:s[Owns target]{color=own-fwd}** — an attribute owns what it points at. Of the {{ownership-count:declared}} attributes in the schema, {{ownership-count:owns-target-forward-by-default.total}} fall into this group, including, :s[{{relation:own-fwd:Visit.year_range:TimePeriod}}]{center color=entity}.
    
  The {{ownership-count:owns-target-forward-by-default.total}} :s[Owns target]{color=own-fwd} attributes 
  - are defined on {{ownership-count:owns-target-forward-by-default.owners}} distinct source entities (owners),
  - have {{ownership-count:owns-target-forward-by-default.attrs}} distinct attribute names,
  - and point to {{ownership-count:owns-target-forward-by-default.owned}} distinct targets.
  
  You can explore each of these using the `owners`, `attrs`, `owned`, and `total` dropdowns.
- Beats:
  1. two-groups-of-owners-multivalued
     - Only: sel=ResearchStudyCollection~ResearchStudy&legend=1
     - Anchor: node-box:ResearchStudy
     - Position: span-left bottom
     - Spotlight: slot-row:ResearchStudyCollection.entries
     - Description:
       Attributes classified as :s[Owns target]{color=own-fwd} fall into two general groups.
       ##### Multivalued targets
       In most cases, if an attribute holds a list of things, those things are part of the source entity. For instance, a ResearchStudyCollection holds one or more (`1..*`) ResearchStudy entries.
       :::s{center color=entity}
         {{relation:own-fwd:ResearchStudyCollection.entries:ResearchStudy}}
       :::
  2. two-groups-of-owners-characteristics
     - Keep: true
     - **Only:** sel=Participant~Visit~TimePeriod&legend=1
     - Anchor: node-box:Participant
     - Position: span-right bottom
     - OffsetX: anchor.width * .5
     - Spotlight: slot-row:Visit.year_range
     - Description:
       ##### Facts
       Attribute targets that are not meaningful on their own and are used to describe or qualify the source entity are also :s[owned by]{color=own-fwd} the source. TimePeriod is a fact about a Visit.
       :::s{center color=entity}
         {{relation:own-fwd:Visit.year_range:TimePeriod}}
       :::
  3. one rule, not two
     - Description:
       To explore these relationships, you can distinguish lists from facts by looking at the cardinality of :s[Owns target]{color=own-fwd} attributes in the legend's `{{ownership-count:owns-target-forward-by-default.owned}} owned` dropdown which is grouped by target.

### belongs-to-target-backward-by-entity

- **Title:** Rules — Belongs to target, by entity
- **Tour:** Ownership
- **Only:** sel=Participant~Visit~TimePeriod&legend=1
- **Anchor:** node-box:Participant
- **Position:** span-right bottom
- **Spotlight:** legend-rule:belongs-to-target-backward-by-entity
- **Highlight:** ring
- **Description:**
  The first exception is **:s[Belongs to target]{color=own-bkwd}** — the attribute's source entity belongs to what it points at, so ownership runs backward. Of the {{ownership-count:declared}} attributes in the schema, {{ownership-count:belongs-to-target-backward-by-entity.total}} fall into this group, including :s[{{relation:own-bkwd:Participant:Visit.associated_participant}}]{center color=entity}.

  This group is decided **by entity**: any attribute that points at one of five target entities — **Participant**, **Visit**, **Organization**, **ImagingStudy** or **Person** — is classified :s[Belongs to target]{color=own-bkwd}. Since ownership runs backward, those five targets are the owners here. The {{ownership-count:belongs-to-target-backward-by-entity.total}} attributes
  - point to {{ownership-count:belongs-to-target-backward-by-entity.owners}} distinct target entities (owners),
  - have {{ownership-count:belongs-to-target-backward-by-entity.attrs}} distinct attribute names,
  - and are defined on {{ownership-count:belongs-to-target-backward-by-entity.owned}} distinct source entities (owned).
- Beats:
  1. who-and-when
     - Only: sel=Participant~Visit~Condition&legend=1
     - Anchor: node-box:Condition
     - Position: span-left bottom
     - Spotlight: slot-row:Condition.associated_participant
     - Description:
       ##### Who and when
       Most of these attributes say which participant a record is about and which visit it was collected at. A Condition doesn't contain its Participant. The Participant exists on its own, and the Condition is one of many records that belong to it.
       :::s{center color=entity}
         {{relation:own-bkwd:Participant:Condition.associated_participant}}
       :::
       Nearly every clinical record has an `associated_participant` and an `associated_visit`, which is why Participant and Visit end up on the left edge of most diagrams.
  2. by-entity
     - Description:
       Because the rule is keyed by the target entity, it also applies to any attribute added to the schema later that points at one of these five. The schema itself doesn't mark these entities; the list is the Explorer's own choice. You can see all five, and the attributes that point at each, in the legend's `{{ownership-count:belongs-to-target-backward-by-entity.owners}} owners` dropdown.

### belongs-to

- **Title:** Rules — Belongs to target, by attribute
- **Tour:** Ownership
- **Only:** sel=ResearchStudyCollection~ResearchStudy~Participant&legend=1
- **Anchor:** node-box:ResearchStudy
- **Position:** bottom
- **Spotlight:** legend-rule:belongs-to-target-backward-by-attribute
- Position: left top
- **Highlight:** ring
- **Description:**
  The second exception is also **:s[Belongs to target]{color=own-bkwd}**, but it is decided **by attribute**: the Explorer lists individual attributes, and only those are classified :s[Belongs to target]{color=own-bkwd}. Of the {{ownership-count:declared}} attributes in the schema, {{ownership-count:belongs-to-target-backward-by-attribute.total}} fall into this group, including :s[{{relation:own-bkwd:ResearchStudy:Participant.member_of_research_study}}]{center color=entity}.

  The {{ownership-count:belongs-to-target-backward-by-attribute.total}} attributes
  - point to {{ownership-count:belongs-to-target-backward-by-attribute.owners}} distinct target entities (owners),
  - have {{ownership-count:belongs-to-target-backward-by-attribute.attrs}} distinct attribute names,
  - and are defined on {{ownership-count:belongs-to-target-backward-by-attribute.owned}} distinct source entities (owned).
- Beats:
  1. owned-and-pointed-back-at
     - Anchor: node-box:ResearchStudy
     - Spotlight: slot-row:ResearchStudyCollection.entries
     - Description:
       ##### Owned, and pointed back at
       ResearchStudy can't go on the previous step's list, because it is owned: a ResearchStudyCollection holds its ResearchStudy entries.
       :::s{center color=entity}
         {{relation:own-fwd:ResearchStudyCollection.entries:ResearchStudy}}
       :::
       Putting ResearchStudy on the list would flip that attribute too. So the exception names the attribute that points back at ResearchStudy, not ResearchStudy itself. A Participant belongs to the study it is a member of, and the collection still owns the study.
  2. by-attribute
     - Description:
       The only other target is QuestionnaireItem, owned by `Questionnaire.items` and pointed back at by a response item's `has_questionnaire_item`, which says which question was answered.

       Each attribute is listed together with the entity that defines it — `ResearchStudy.part_of`, not just `part_of` — because QuestionnaireItem has a `part_of` too, and a new `part_of` elsewhere in the schema shouldn't be classified this way by accident. You can see all {{ownership-count:belongs-to-target-backward-by-attribute.total}} in the legend's `{{ownership-count:belongs-to-target-backward-by-attribute.total}} total` dropdown.

### loops

- **Title:** An entity that names itself
- **Tour:** Ownership
- **Action:** Drew ResearchStudy on its own.
- **Only:** sel=ResearchStudy&panels=0
- **Anchor:** node-box:ResearchStudy
- Position: right
- **Spotlight:** slot-row:ResearchStudy.part_of
- **Description:**
  Entities can also have attributes pointing to themselves. `ResearchStudy.part_of` holds a ResearchStudy, so a study can be a sub-study of another. An attribute pointing to its own defining entity means that an instance of this entity can *belong to* another instance of the same kind. We indicate this with a loop mark {{loop}} on the attribute row.

  Studies, specimens, containers, questionnaire items, files and time points all nest this way.

### rules-recap

- **Title:** Summary
- **Tour:** Ownership
- **Only:** legend=1
- **Anchor:** legend-section:ownership-rules
- **Position:** left
- **Highlight:** ring
- **Description:**
  Every attribute that points from one entity to another is classified by one rule and two exceptions:

  - **:s[Owns target]{color=own-fwd}** — by default, an attribute owns what it points at: a list of things that are part of the source entity, or a fact about it. ({{ownership-count:owns-target-forward-by-default.total}} attributes)
  - **:s[Belongs to target]{color=own-bkwd}, by entity** — an attribute pointing at **Participant**, **Visit**, **Organization**, **ImagingStudy** or **Person** belongs to it instead. ({{ownership-count:belongs-to-target-backward-by-entity.total}} attributes)
  - **:s[Belongs to target]{color=own-bkwd}, by attribute** — a few individual attributes point back at an entity that some other attribute owns. ({{ownership-count:belongs-to-target-backward-by-attribute.total}} attributes)

  The Legend counts each rule against the current schema, and its dropdowns list every attribute under each one.

<!--
APPENDIX, parked: association edges.

No slot classifies as `association` any more (ASSOCIATION_SLOTS is empty since
2026-09-11), so there is nothing on the canvas to point at and the step below
would be describing a line a reader can never see. Kept as a comment because
the KIND still exists and the schema could need it again; see
OWNERSHIP_CLASSIFICATION.md §When a schema needs an association edge.

### association-appendix

- **Title:** When neither one owns the other
- **Tour:** Ownership
- **Anchor:** none
- **Width:** 520
- **Description:**
  A third kind of line exists, though this model currently has none: an
  **association**, drawn dashed and arrowed at both ends. It says two entities
  are related and makes **no ownership claim in either direction**.

  It is what a schema needs when the default rule would overclaim — when one
  entity points at another (so it would be read as owning it) but the target
  plainly outlives it and is reachable on its own, and no exception fits
  because the claim is about this one pairing rather than about either end.
-->

</details><!-- end of Ownership tour -->
</div>

<div style="margin-left: 40px">
<details open>
<summary><b>Inheritance</b></summary>

## Inheritance
- **TourMetadata:**
- **Description:** Subclasses, and the boxes that hold several entities at once

### one-child

- **Title:** An entity and its parent class, one box
- **Tour:** Inheritance
- **Only:** panels=0
- **Action:** Cleared the canvas.
- **Anchor:** entity-row:MeasurementObservation
- **Width:** 420
- **Description:**
  Start from the panel, with nothing drawn. **MeasurementObservation** is the
  entity we are about to tick — watch what the box it draws is called.
- **Beats:**
  1. the box that appears
     - Change: sel=MeasurementObservation
     - Action: Ticked MeasurementObservation for you.
     - Anchor: node-box:Observation
     - Width: 560
     - Description:
       You asked for MeasurementObservation and the box is titled
       **Observation**. MeasurementObservation is a subclass — an Observation
       with a few extra attributes — and the Explorer draws a subclass INSIDE
       its parent's box rather than as a second box joined by a line. The
       `⑃ 1` in the header says one subclass is merged in.
  2. inherited rows
     - Description:
       ##### What it inherits
       The bold rows at the top are Observation's: the four `value_`
       attributes, who performed it, the participant and the visit.
       MeasurementObservation has all of them.
     - Anchor: slot-row:Observation.associated_participant
  3. the child's header
     - Description:
       ##### What it adds
       Below them a colored header names the subclass, and the rows under
       it are the ones it adds: a normal range, a body site, the instrument.
       Everything under this header is MeasurementObservation's alone.
     - Anchor: child-header:MeasurementObservation
  4. one is enough
     - Description:
       ##### Merged even alone
       This happens with a single subclass, not only when siblings are drawn
       together. An entity should not change shape depending on what else you
       happen to have selected.
     - Anchor: node-box:Observation


### add-nothing

- **Title:** Subclasses that add nothing
- **Tour:** Inheritance
- **Only:** sel=SpecimenQualityObservation~SpecimenQuantityObservation
- **Action:** Drew the two specimen observations.
- **Anchor:** child-header:SpecimenQualityObservation
- **Description:**
  Two subclasses of Observation, and neither declares a single attribute of
  its own: two headers with nothing under them. That is not a gap. "An
  Observation made about a specimen rather than a person, adding nothing"
  is the whole definition of these subclasses, and an empty header is the
  honest picture of it.


### narrowing

- **Title:** Same attribute, narrower type
- **Tour:** Inheritance
- **Only:** sel=QuestionnaireResponseValueBoolean~QuestionnaireResponseValueDecimal~QuestionnaireResponseValueInteger~QuestionnaireResponseValueString~QuestionnaireResponseValueTimePoint
- **Action:** Drew the five typed questionnaire answers.
- **Anchor:** slot-row:QuestionnaireResponseValue.value
- **Position:** right
- **Description:**
  A QuestionnaireResponseValue has a `value`, declared as a string. Its five
  subclasses exist for one reason each: to say that `value` is a boolean, a
  decimal, an integer, a string or a TimePoint. LinkML calls this narrowing
  `slot_usage`.
- **Beats:**
  1. a narrowed row
     - Description:
       ##### The child's own row
       So each child keeps its OWN `value` row under its header, with the
       narrower type, instead of sharing the parent's — the one case where a
       shared row would be a lie.
     - Anchor: slot-row:QuestionnaireResponseValueBoolean.value
  2. the one that doesn't
     - Description:
       ##### The one that adds nothing
       The String child's `value` is a string, exactly as the parent declared
       it, so it has no row of its own: the header alone. Compare its
       TimePoint sibling, whose `value` is another entity and gets a blue dot.
     - Anchor: child-header:QuestionnaireResponseValueString


### full-family

- **Title:** The whole family
- **Tour:** Inheritance
- **Only:** cat=observation
- **Action:** Drew the Observations / Measurements category, the same as pressing its ⊞ button.
- **Anchor:** node-box:Observation
- **Position:** right
- **Description:**
  The largest hierarchy in the model, and the best picture of what merging
  buys. One box holds Observation and all five subclasses; the rows they
  share are stated once, at the top, and each subclass adds its own beneath
  its colored header. Drawn as six separate boxes, the shared rows would be
  repeated six times.
- **Beats:**
  1. colors
     - Description:
       ##### Colours
       Each subclass has a color, worn by its header and by any line leaving
       one of its rows, so a line can be traced back to the subclass that
       declares it. A line from a shared row is drawn once, not once per
       subclass.
     - Anchor: child-header:MeasurementObservation
  2. the sets
     - Description:
       ##### The sets mirror them
       ObservationSet has the same shape: three subclasses in one box, one
       per kind of observation being grouped.
     - Anchor: node-box:ObservationSet
  3. a narrowed line
     - Description:
       ##### A line that lands on a header
       `MeasurementObservationSet.observations` is a narrowed `observations`:
       a measurement set holds MeasurementObservations specifically, not
       Observations in general. So its line does not land on the Observation
       box as a whole but on the **MeasurementObservation header** inside
       it, in that subclass's color.
     - Anchor: slot-row:MeasurementObservationSet.observations
  4. the landing
     - Description:
       ##### Where it lands
       Here. The plain `ObservationSet.observations` line, one row up in the
       other box, lands on this box's header as usual.
     - Anchor: child-header:MeasurementObservation


### families

- **Title:** Where inheritance lives in the model
- **Tour:** Inheritance
- **Anchor:** none
- **Description:**
  BDCHM uses inheritance in five places, and you have now seen the two big
  ones: Observation with five subclasses and ObservationSet with three. The
  others are Exposure (a drug or a device), File (an imaging file), and the
  five typed questionnaire answers. Everywhere else, an entity stands on its
  own.

  The categories in the left panel are not inheritance: a category is a
  browsing aid, and an entity listed in two of them is one entity, not two.

</details><!-- end of Inheritance tour -->
</div>

</details><!-- end of Tours -->

<details>
<summary><b>Non-tour help items</b></summary>

### selection-tree-mechanics

- **Title:** Choosing what to look at
- **Description:**
  The panel has two modes. **List** groups every entity under the six
  categories; **tree** arranges them by **ownership**, nesting an entity under
  whatever owns it. Either way, tick a checkbox to put an entity on the
  diagram — the checkbox is the only thing that selects.
- **Interactions:**
  - Checkbox — add or remove that entity from the diagram.
  - Arrow — expand or collapse, without changing the selection.
  - Name — open the details panel without changing the selection.
- **Context:** In tree mode an entity can sit in more than one place, because things can be owned by more than one kind of thing. The widget marks the duplicates for you.
- **Anchor:** selection-tree

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
- **Anchor:** none
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

### merged-boxes

- **Title:** Merged inheritance boxes
- **Anchor:** none
- **Description:** When several entities on the diagram share a parent class, they collapse into one box titled by that parent. Rows the parent defines come first, then a colored header per child followed by the rows that child adds. Whatever owns the parent owns every child too, so a line into the box header is a line to the whole family.
- **Context:** Lines leaving a child's rows take that child's color, so you can trace a line back to the block it came from.

</details>

<details>
<summary><b>Sharing what you see</b></summary>

## Sharing what you see

### copy-link

- **Title:** Copy link
- **Description:** Copies a link that reproduces **exactly** this view — the selection and the toolbar settings. Anyone opening it sees what you see.
- **Interactions:**
  - Click to copy; the URL bar always holds the same link.
- **Context:** Settings travel in the link, so a diagram you set up deliberately does not get redrawn with someone else's preferences.
- **Change:**

</details>
