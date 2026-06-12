# Demo Script — BDCHM Interactive Documentation

**Target length:** ≤ 10 minutes. **App:** http://localhost:5173/dynamic-model-var-docs

**Recording tool: Snagit** (better than macOS native here — it has a trim/cut editor,
so a fluffed click can be snipped out instead of forcing a full retake; cursor
highlighting; clean export). Capture the browser window region only. Do one silent
practice pass for click rhythm, then a real take; trim mistakes after.

---

## Terminology note (a rename shipped for this demo)

In the **Entity Explorer** (default view), the old word "Slots" now reads
**"Props" / "Properties"** so it lands for a non-technical viewer. The **Kitchen
Sink** (legacy) view still says "Slots" — that's fine, it's framed as the old
version. When you talk, use **property** (a field), **value set** (a controlled
vocabulary / enum), **entity** (a thing in the model). Avoid "slot," "enum,"
"LinkML," "DTO" unless a technical peer raises them.

---

## Before you hit record (setup, 2 min)

1. **Reset to a clean state.** In the app tab's DevTools console run `localStorage.clear()`
   then reload. Restores default pins (Demography, Condition, MeasurementObservation)
   and collapsed categories. *(Do this BEFORE recording — never show DevTools on camera.)*
2. Browser at default zoom (Cmd-0), window wide enough that the Props/Cls/Enm/Typ/Vars
   columns aren't cramped. Hide the bookmarks bar.
3. Start on the **Entity Explorer**, collapsed, nothing drilled in.
4. Have this script on a second screen/phone — don't read it on camera.

---

## The story (hold this in your head)

> *"BDCHM is a big harmonized data model. Our first pass showed all of it at once —
> people found it overwhelming. So we rebuilt it around progressive disclosure: start
> from the things you care about, open up just the detail you need."*

---

## Beat-by-beat

### 0. Open (0:00–0:40) — what this is

*Start on the Entity Explorer, collapsed.*

- "This is interactive documentation for the BioData Catalyst Harmonized LinkML Model."
- "It's large — roughly 47 entities, 40 value sets, ~150 study variables, almost 4000
- lines of LinkML specifications. A flat spec is hard to navigate, so the tool is built
- to let you go from the big picture down to one detail without losing your place."

### 1. The honest backstory — Kitchen Sink (0:40–1:35) — ~45–60s, keep it brief

*Toggle to Kitchen Sink (header toggle, or `?view=kitchen-sink`).*

- "I want to show you our **first** pass, quickly — because it's fancier, and it may
  be closer to what some of you initially pictured."
- Let the panels + connecting links be visible; maybe drag one panel or open one
  detail. "Everything's on screen at once — classes, value sets, variables — with
  lines connecting what relates to what. People liked how it *looked*."
- "But in early testing it overwhelmed people — too much at once, hard to know where
  to start. So that feedback drove the redesign I'll show you now." *Toggle back to
  the Explorer.* **Don't linger — this is context, not the pitch.**

### 2. The categorized list (1:35–2:30) — orientation

*Back on the Entity Explorer.*

- "Now everything starts as a simple categorized list — Clinical, Observations,
  Lab/Biospecimen, Survey — with the entities people use most **pinned at the top**."
- "The numbers are a quick profile of each entity." Hover a row so badge tooltips
  show. Read them once: **Props** = how many fields it has · **Cls / Enm / Typ** =
  what those fields point to (another entity, a value set, or a basic type like a
  number) · **Vars** = how many real study variables map to it.
- "So before opening anything, you can see *shape* — some entities are simple, and one
  in particular, **MeasurementObservation**, carries most of the study's variables
  (about 100 of the ~150). That's the workhorse, so let's open it."
- `MeasurementObservation` is in the default **Pinned** set, so it's already at the
  top — you can click it there. (Or expand **Observations / Measurements** to show it
  in context; look for the big **Vars** badge.)

### 3. Drill into an entity (2:30–4:15) — the core move

- Click **`MeasurementObservation`**. The detail opens inline under the row.
- Read the top: "Plain-language definition — *a single observation with a type and a
  value — like the hematocrit component of a blood-count panel.*" (It *extends
  Observation* — note the inheritance.)
- Point at the **Properties** table, walking the columns that matter:
  - **Source** — "this tells you where each field comes from: *Defined here* means
    it's specific to this entity; *Global* or *Global (from …)* means it's inherited /
    shared. So you can see what's unique vs. common at a glance."
  - **Range** (the colored badges) — "what each field holds. **Green** is a basic
    type — a number, a date. **Blue** points to another entity. **Purple** is a
    controlled value set." Point at one of each colour on screen.
- Click the **Variables** tab: "and these are the concrete study variables that map to
  MeasurementObservation — real measurements, each with a **data type, a unit**
  (mg/dL, pg/mL…), and a **source code** (an OMOP / OBA identifier). This is the bridge
  from the abstract model to data someone actually collected." *(MeasurementObservation
  is the entity where this tab really shines — its variables are fully specified.)*

### 4. Recursive drilldown — the payoff (4:15–6:00)

*The moment that sells progressive disclosure. Slow down.*

- Back on **Properties**, click a **purple** Range badge (a value set, e.g. a `…Enum`).
  "When a field uses a controlled vocabulary, click it — the value set opens right
  here: the permitted values, and which entities use it."
- Then click a **blue** badge (a field pointing to another entity). "When a field
  points to another entity, that entity's detail opens **nested right here** — I can
  keep following the structure as deep as I want without ever opening a new screen or
  losing my place."
- Close a nested card with its ✕. "And it collapses back. You're never more than a
  click from where you started — that's the whole idea."

### 5. Pinning / personalization (6:00–6:40)

- Hover a row to reveal the **○** control; pin one entity (e.g. `Specimen`). Scroll up
  — it appears under **Pinned**.
- "Everyone cares about a different slice of the model. You pin what matters to you and
  it sticks between visits."
- *(To the lead stakeholder:)* "If there's a set your reviewers always start from, we
  can make that the default."

### 6. Where it's heading (6:40–7:45) — optional, watch the clock

*Skip / shorten if past ~6:45. Good bait for the technical folks; don't let it eat the
client's airtime.*

- "A couple of directions we're exploring —" (mention, don't deep-dive):
  - **Containment views** — "showing what *contains* what across the model. The full
    picture is dense, so we're leaning toward 'pick a few entities, generate a focused
    diagram.'" *(Mockups: `/containment-tree-mockup.html`, `/has-a-mockup.html` — only
    open if a technical peer asks.)*
  - **Plain-language toggle** — "a switch between everyday terms and the exact
    technical vocabulary, so both audiences are served."

### 7. Close + the ask (7:45–9:30) — hand the client the floor

*The most important 90 seconds — why the call exists.*

- "That's the core. What I most want from this call is to shape the next stage around
  what's actually useful to **you**."
- Put 2–3 concrete questions to the client:
  - "When you look at a model like this, what's the first question you're trying to
    answer — *what data is in here*, *how do two things relate*, or something else?"
  - "Who do you picture using it — your reviewers, data submitters, the public? That
    changes how much we hide vs. show by default."
  - "Is the priority *understanding* the model, or *checking the quality* of the data
    it describes?" *(These pull different features forward.)*
- Then to the technical peers, name the three open design tensions (don't solve them
  on the call — just surface them):
  - **is-a vs. has-a** — for a "what contains what" view we invert the model's
    foreign-key references. The heuristic needs a designer's eye.
  - **Where do the connecting links fit?** — keep Kitchen Sink's curving connections
    as an optional overlay, or is the inline "drill down + referenced-by" enough?
  - **Terminology** — how far to push general-audience terms vs. exact technical ones,
    and whether to offer a toggle.
- **Leave-behind:** "I'll drop a link to a one-page status & open-questions writeup" —
  that's `overview.html` (the app's `/overview.html`). Don't show it on screen as your
  closing slide; send it as the follow-up so the detail lives somewhere without
  ending the demo on a roadmap wall.

---

## If you only have 5 minutes (cut list)

Keep **0, 2, 3, 4, 7**. Compress Kitchen Sink (1) to one sentence, drop pinning (5) to
a sentence, skip 6. The recursive drilldown (4) + the ask (7) are non-negotiable.

## Don't do on camera

- No DevTools / `localStorage` reset on screen (do it before).
- Don't say "slot / enum / LinkML / DTO" to non-technical viewers without translating
  to *property / value set / entity*.
- Don't apologize for unfinished work — frame it as "next, and I want your input."
- Don't free-navigate. Every click here is one you've rehearsed.
