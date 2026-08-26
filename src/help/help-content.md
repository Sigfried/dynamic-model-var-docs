<!--
  Help + tour content for the dmvd Explorer.

  FORMAT (parsed by parseHelpContent.ts):
    ## Section Title          — groups entries; body text before the first ###
    ### element-id            — MUST match a data-help-id attribute in the app
      - **Title:** short name shown as the popover heading
      - **Description:** one or two sentences; markdown allowed
      - **Interactions:** bullet list of what you can do
      - **Shortcut:** key hint, rendered as a <kbd>
      - **Context:** smaller footnote text
      - **State:** URL query applied before this step (tour steps only)
      - **Tour:** 1-based position in the guided tour; omit for help-only

  Sections are separated by `---` lines.

  The tour is written for someone who arrives from a LINK with no one
  explaining it — the program manager case. So step 1 assumes nothing, and any
  step that needs a selection brings its own via `State:` rather than asking
  the visitor to click first.
-->

# Explorer help

---

## Getting started

What this app is and how to move around it.

### app-title

- **Title:** BDCHM Explorer
- **Description:** An interactive map of the **BioData Catalyst Harmonized Model** — the classes it defines and how they relate. Pick some entities on the left and the diagram shows how they fit together.
- **Interactions:**
  - Click the title to clear everything and start over.
- **Tour:** 1

### selection-tree

- **Title:** Choosing what to look at
- **Description:** Entities are arranged by **ownership**: an entity is nested under whatever owns it. Tick a checkbox to put an entity on the diagram. The checkbox is the only thing that selects — clicking the row or the arrow just opens and closes the tree.
- **Interactions:**
  - Checkbox — add or remove that entity from the diagram.
  - Arrow — expand or collapse, without changing the selection.
  - Name — open the details panel without changing the selection.
- **Context:** An entity can sit in more than one place in the tree, because things can be owned by more than one kind of thing. The widget marks the duplicates for you.
- **State:** sel=Participant
- **Tour:** 2

---

## Reading the diagram

What the boxes and lines mean.

### graph-canvas

- **Title:** The diagram
- **Description:** Each box is an entity; each row inside it is one of that entity's attributes. Lines run from an owner to the thing it owns, so reading left to right is reading "contains".
- **Interactions:**
  - Click a box to open its details.
  - Drag a box to move it; drag the background to pan.
  - Click an attribute row that names an entity to pull that entity onto the diagram.
- **Context:** I have selected **Participant** and **BodySite** for you. You would normally do this by ticking them in the tree on the left.
- **State:** sel=BodySite~Participant
- **Tour:** 3

### owner-chips

- **Title:** "owned by" chips
- **Description:** Everything that owns this entity, listed as chips. A **filled** chip is on the diagram — click it to take it off. A **dashed** chip is not — click it to add it.
- **Interactions:**
  - Click any chip to toggle that owner on or off.
  - "add all" — draw every remaining owner at once.
- **Context:** Only a few owners are drawn by default, to keep things readable; the rest wait as chips. Removing a drawn owner promotes one of the waiting ones into its place.

### node-dismiss

- **Title:** Closing a box
- **Description:** Removes this entity from the diagram. What that means depends on why it is here: a selected entity is deselected, and one that arrived as context is simply hidden.

### toolbar-owners

- **Title:** How many owners to draw
- **Description:** Sets how many owning entities are drawn per box: **0** draws none (all become chips), **≤5** draws up to five, **all** draws every one.
- **Context:** "all" can pull a lot onto the diagram at once — a value type like Quantity is owned by around twenty entities.

### toolbar-siblings

- **Title:** Merged inheritance boxes
- **Description:** When several entities on the diagram share a parent, they collapse into one box titled by that parent. Rows the parent defines come first, then a coloured header per child followed by the rows that child adds.
- **Interactions:**
  - Toggle off to draw each entity as its own separate box.
- **Context:** Lines leaving a child's rows take that child's colour, so you can trace a line back to the block it came from.

---

## Sharing what you see

### copy-link

- **Title:** Copy link
- **Description:** Copies a link that reproduces **exactly** this view — the selection, what is expanded, and the toolbar settings. Anyone opening it sees what you see.
- **Interactions:**
  - Click to copy; the URL bar always holds the same link.
- **Context:** Settings travel in the link, so a diagram you set up deliberately does not get redrawn with someone else's preferences.
- **State:** sel=BodySite~Participant
- **Tour:** 4

### example-cases

- **Title:** Example cases
- **Description:** Named selections that show particular routing and inheritance situations. Useful for seeing what the diagram does with the awkward cases.

### help-button

- **Title:** Help and tour
- **Description:** **Take the tour** for a short guided walk, or turn on **help mode** to explore at your own pace — every part of the screen with help attached gets a dot you can click.
- **Shortcut:** ?
