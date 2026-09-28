# Help/Tour packages — plan

**How to read this for review.** Boxes marked **DECIDE** need a call from
Siggie; boxes marked **PROPOSED** are Claude's recommendation, waiting for a
yes/no. Everything else is either decided (§1) or a fact about the current code.

---

## 1. Goal and what is decided

Pull the help/tour system out of dmvd into **npm packages**, and use them first
in **vs-hub** (`../personal/vs-hub`, the TermHub revival). The work happens in a
new monorepo, `personal/in-app` (§4), into which dmvd and vs-hub are absorbed
temporarily and split back out when stable.

Decided (Siggie, 2026-09-28):

- **Help and tour are separate packages.** They do different jobs: a tour walks
  the viewer through steps in order and changes app state as it goes; context
  help explains whatever the viewer points at.
- **The prose dialect is its own package**, usable for anything that renders
  authored text — the legend today, not just help and tour.
- **A fourth package holds anchoring and the popover**, which help and tour
  both need (§2).
- **vs-hub needs tours only.** So the first release is three packages:
  markdown, anchor/popover, tour. The help package comes later (§6).
- **Published to npm under `@sigfried`**, named `@sigfried/in-app-*` (§4).
  While the apps sit in the monorepo they use the packages as workspace
  dependencies; they consume the published versions once split back out.
- **The live sites freeze** while their apps are in the monorepo. vs-hub
  (GitHub Actions) and dmvd (`npm run deploy`) are not redeployed until each is
  split back out to its own repo.

---

## 2. The four packages

Short names in this doc: **markdown**, **anchor**, **tour**, **help**.

| package | npm name | what it does | depends on |
|---|---|---|---|
| **markdown** | `@sigfried/in-app-markdown` | Renders authored markdown with the extensions below, on any string, in any component. | react-markdown, remark-directive |
| **anchor** | `@sigfried/in-app-anchor` | Finds the element a piece of content points at, and draws a popover beside it: placement, mount points, dragging, highlight/spotlight. | markdown |
| **tour** | `@sigfried/in-app-tour` | Tours: parsing steps and beats, the prev/next chrome, the tour map, driving app state through host callbacks. | markdown, anchor |
| **help** | `@sigfried/in-app-help` | Help mode: hint dots, click-an-element-to-see-its-entry. | markdown, anchor |

### What the markdown dialect is

These are the extensions dmvd's prose already uses. Each is specified in
[`src/help/FORMAT.md`](../src/help/FORMAT.md):

- `{{kind:arg}}` placeholders, filled by **host-supplied text resolvers** (dmvd
  uses them for live counts and names from the model).
- Inline widgets — an image whose URL is `widget:name:arg` — drawn by **host-supplied widget
  renderers**.
- `:s[text]{color=… size=…}` and `:::s{…} … :::` for styling a span or a block
  ([`styleDirectives.ts`](../src/help/styleDirectives.ts)).
- `{{target:replace}}` on a link: open in place instead of a new tab
  ([`linkTarget.ts`](../src/help/linkTarget.ts)).
- Alerts: `>` blockquotes, optionally dismiss-once.

Today's entry point is `<HelpMarkdown>`
([`HelpMarkdown.tsx`](../src/help/HelpMarkdown.tsx)); dmvd's legend already
renders through it.

> **DECIDE — who owns the content-file format?** Today one file
> ([`help-content.md`](../src/explore/help-content.md)) holds `## sections` of
> `### entries`, each with `- **Field:** value` lines, and **one entry can be a
> help topic and a tour step at once**. With separate packages, something has
> to own that section/entry/field structure.
>
> **PROPOSED:** the markdown package owns the *document* structure (sections,
> entries, fields, `Description:` blocks) as a generic parser; tour and help
> each declare the fields they read (`Change:`, `Anchor:`, beats, …). The
> alternative —
> each package parses its own file — is simpler per package but means an
> element that is both explained and toured is written twice.

---

## 3. The extraction is a disentangling, not a move

The in-app code was written on the premise that help and tour are **one
registry with two navigation modes** (header of
[`HelpProvider.tsx`](../src/help/HelpProvider.tsx)). Splitting them reverses
that, so most large files have to be cut apart:

| current file | lines | goes to |
|---|---|---|
| [`parseHelpContent.ts`](../src/help/parseHelpContent.ts) | 1447 | split: document structure + placeholders → markdown; `parseAnchor`, highlight/placement fields → anchor; tours, beats, positions → tour |
| [`HelpLayer.tsx`](../src/help/HelpLayer.tsx) | 1389 | split: popover + placement → anchor; prev/next chrome, address readout → tour; hint dots → help |
| [`HelpProvider.tsx`](../src/help/HelpProvider.tsx) | 694 | split: anchor resolution → anchor; tour state stack + `onApplyState`/`onReadState` → tour; help-mode toggle, `?` key → help |
| [`helpContext.ts`](../src/help/helpContext.ts) | 182 | split per package; each gets its own context/hook |
| [`help.css`](../src/help/help.css) | 1061 | split along the same lines |
| [`FORMAT.md`](../src/help/FORMAT.md) | 1339 | split into one spec per package, **and its examples rewritten**: they are dmvd's (41 mentions of BDCHM, entities, ownership). BDCHM references go. *Entity / attribute / permissible value* are right for the BDCHM tour content, but FORMAT and code say **class / slot / enum** — a code change too (e.g. dmvd's anchor kinds `entity-row`, `entity-checkbox`). |
| [`HelpMarkdown.tsx`](../src/help/HelpMarkdown.tsx), [`markdownParts.tsx`](../src/help/markdownParts.tsx), [`styleDirectives.ts`](../src/help/styleDirectives.ts), [`linkTarget.ts`](../src/help/linkTarget.ts) | ~410 | markdown, whole |
| [`mountPoints.ts`](../src/help/mountPoints.ts), [`useDragged.ts`](../src/help/useDragged.ts) | ~200 | anchor, whole; `useDragged` is **exported** (dmvd's legend frame uses it) |
| [`TourMap.tsx`](../src/help/TourMap.tsx) | 291 | tour, whole |

What already holds and makes this tractable: nothing under `src/help/` imports
from dmvd, and dmvd's content, anchor tags, resolvers and style overrides all
live in `src/explore/`.

**Order of work.** Because dmvd is absorbed into the monorepo, the split
happens there with dmvd's app and tests to check against:

1. Create the monorepo; absorb dmvd and vs-hub (§4).
2. Carve `apps/dmvd/src/help/` into `packages/in-app-{markdown,anchor,tour}`;
   dmvd imports them by package name. dmvd's tests and build stay green at each
   step.
3. vs-hub adopts `in-app-tour`, and its first tour gets written.
4. `in-app-help` later (§6).

---

## 4. The monorepo

Decided (Siggie, 2026-09-28): repo `personal/in-app`, pnpm + Nx, npm scope
`@sigfried`, package names `@sigfried/in-app-*`, apps dmvd and vs-hub absorbed
for now. **§4.1–4.6 become the monorepo's `CLAUDE.md`** when it is created.

> **CHECK before creating it:** whether `sigfried` is free as an npm username
> (a scope is a username or an npm org).

### 4.1 Context

- pnpm + Nx monorepo for shared packages under the `@sigfried/` npm scope.
- Existing apps (dmvd, vs-hub) are brought in temporarily **with full git
  history**, so they can be refactored alongside the packages. When stable,
  each is split back out to its original GitHub repo. Everything below serves
  that round trip.

### 4.2 Layout

- `packages/*` — shared packages, eventually published to npm.
- `apps/*` — absorbed apps, one directory per original repo.
- `pnpm-workspace.yaml` lists the workspaces. One root `pnpm-lock.yaml`.
  **vs-hub's app is in `frontend/`**, not at its repo root, so its workspace
  entry is `apps/vs-hub/frontend`, not a bare `apps/*`.

### 4.3 Bringing an app in

- `git subtree add --prefix=apps/<name> <repo-url> main` **without**
  `--squash`. Both apps' default branch is `main`.
- Do not rewrite, rebase, or squash any commits under `apps/<name>` afterward.
- Delete the app's own lockfile after absorbing (both have a
  `package-lock.json`); the root lockfile replaces it.

### 4.4 Nx

- Package-based mode: tasks come from each package's `package.json` scripts.
- Do not convert projects to integrated style, and do not let generators add
  `tsconfig` `paths` aliases, root-level `project.json` conventions, or shared
  config that an app would need to function.

### 4.5 Rules that keep apps extractable

- Apps import shared packages **only by package name**
  (`@sigfried/in-app-tour`), declared in the app's `package.json` as
  `"workspace:*"`. No relative imports that leave the app's directory, no
  tsconfig path aliases into `packages/`.
- Each app's tsconfig, ESLint, Prettier and Vite configs stay self-contained
  inside `apps/<name>/`. They do not extend root-level configs.
- Every dependency an app uses is declared in that app's own `package.json`,
  even if it is already installed at the root.
- Shared packages declare React (and other framework libraries) as
  `peerDependencies`, not `dependencies`.

### 4.6 Hard limits and reporting

- Do NOT push to, open PRs against, or change settings on the original app
  repos.
- Do NOT run `git subtree push` or `git subtree split` to extract an app unless
  Siggie explicitly asks for it in that session.
- Do NOT publish packages to npm unless Siggie explicitly asks.
- After any change, say what was actually run to verify it (install, build,
  typecheck, tests, dev server) and what was not. Report failures, warnings and
  skipped steps plainly; "builds, but I didn't run the app" is the kind of
  report wanted.

### 4.7 Known traps for the first session

- **pnpm's `node_modules` is symlinks.** A symlinked `node_modules` has broken
  vitest under the Claude Code sandbox before (dmvd worktrees): the sandbox's
  allowed paths are matched against *real* paths. Expect to resolve real paths
  (`pwd -P`) and adjust the allowlist.
- **Node 24.** dmvd pins 24.2.0 in `.nvmrc`; on node 26, 41 of its tests fail
  (jsdom `localStorage`). vs-hub's deploy workflow also uses 24. The monorepo
  should pin 24 at the root.
- **vs-hub brings its data.** Absorbing the whole repo includes `data/` (~45 MB
  of committed Parquet).

---

## 5. Seams the extraction must keep

These are the places where the package deliberately knows nothing about the
host app. A change that "simplifies" one of them usually does so by teaching
the package something about dmvd.

| seam | package | contract |
|---|---|---|
| **anchor kinds** | anchor | Content says `Anchor: kind:arg` (e.g. `entity-row:Specimen`). The package matches that string against a `data-help-id` the host wrote on the element, and never interprets it. The host decides what each kind means by choosing which elements to tag. So a checkbox inside a row gets its **own** tag rather than being found as "the input inside the row" — the latter would put knowledge of rows into the package. |
| **text resolvers, widgets, colors** | markdown | `{{kind:arg}}`, `widget:name:arg` and color names are all looked up in tables the host passes in. |
| **`onApplyState` / `onReadState`** | tour | Two callbacks: the tour asks the host to apply a step's state change, and asks it for the current state. dmvd implements both against the URL, so the tour never learns what a selection is. |
| **`centerOn`** | anchor | Where a popover with no anchor is centred. dmvd passes nothing (viewport-centred). |
| **`--help-font-size`** | anchor | Everything is sized in `em` off this one CSS custom property; a host overrides it. dmvd's override is [`helpTheme.css`](../src/explore/helpTheme.css). |

> **CHECK for vs-hub** (Claude, before starting): vs-hub is plain JSX, not
> TypeScript, so the packages must ship compiled JS plus `.d.ts`. It already
> uses React 19 and react-markdown 10, which matches. Whether its app state is
> in the URL — which decides how much work `onApplyState` is there — is not yet
> checked.

Also package work, not yet built: remembering that a viewer has seen a tour
(`tourSeen` in localStorage) belongs in **tour**.

---

## 6. Help mode — later, in the help package

Help mode is switched off in dmvd (`HELP_MODE_ENABLED = false` in
[`helpContext.ts`](../src/help/helpContext.ts)), which hides its toggle and
disables the `?` key. The code still works. It has the defects below, so
**turning the flag back on is not enough**; they get fixed when the help
package is built, in this order:

1. **Exit affordance.** Make the toggle read `✕ exit help` and let its click
   through. Drop exit-on-window-blur; make one Escape exit, not two.
2. **`(i)` info buttons instead of `?` hints** (Siggie's call), leaving `?` for
   the keyboard shortcut only.
3. **Tag rows and controls and write their entries** — mostly content work.
4. **Decide what help mode does about clicks it has to block** (defect 2).

### The defects

1. **No visible way out.** Escape, `?`, clicking an untagged element and
   window blur all exit, and none is discoverable. Closing the popover closes
   the popover, not the mode, so the viewer's next click is silently eaten.
   Almost nothing is untagged to click on. And the toggle itself was disabled,
   because it sits inside a tagged element.
2. **It blocks what its own text describes.** An entry says "tick a checkbox
   to put an entity on the diagram," and help mode swallows that click.
3. **Clicks resolve far too coarsely.** A click shows the entry of the nearest
   tagged ancestor, and no row, checkbox or disclosure arrow is tagged — so
   every row shows the whole panel's entry.
4. **Coverage is accidental.** The tags were placed for the tour. Nothing
   explains attribute rows, edge types, or how to read the diagram.
5. **Hint dots ignore the viewport.** A dot is drawn for any element that
   exists, including ones scrolled out of view, so dots pile up at the edge.
6. **`?` means three things** — hint glyph, shortcut, button label. Fixed by
   step 2.

`isInputFocused` (4 lines, [`HelpProvider.tsx`](../src/help/HelpProvider.tsx))
exists only for the `?` shortcut, so it goes with help, inlined.

---

## 7. Settled constraints

- **Current browsers only** (Siggie, 2026-09-08). Placement is CSS anchor
  positioning, with no `@supports` guard and no measured fallback. Adding one
  would need new evidence of a support problem.
- **No native `title` on anything that opens a hover panel.** The browser's
  tooltip draws on top of the panel. Use `aria-label` and put the words in the
  panel. This one keeps getting reintroduced.
- **No `title`-swapping to show which elements have help.** Hint dots (or info
  buttons) do that job.

## 8. Worth a look, not planned

- **Two platform features** could replace hand-written popover code:
  `popover="hint"` (a popover that doesn't close other popovers) and interest
  invokers (`interestfor`), which would replace most of the
  hover/leave/pinned logic.
- **Backdrop:** plain `::backdrop` dim, or a spotlight cutout around the
  current element? The cutout needs an SVG mask or four rectangles recomputed
  on scroll/resize.
