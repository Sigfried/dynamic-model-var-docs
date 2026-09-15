/**
 * OwnershipLegend — what the diagram's ink means, then every ownership pair in
 * the schema grouped by the rule that classified it.
 *
 * A PERMANENT feature, and its own panel since 2026-09-04. It used to be a tab
 * of the example-cases pane, which said the two were peers; they are not. The
 * cases are a working set that keeps shrinking. This explains the diagram.
 *
 * Everything in the pair listing is derived live from `classifySlotEdgeExplained`
 * via DataService — the same call the graph builder makes. Nothing is restated.
 * That is deliberate and load-bearing: `REFERRED_TO_ENTITIES` and
 * `NAMED_BACK_POINTERS` are hand-curated and go stale silently on every schema
 * sync, so a legend built from a second copy of the rules would conceal the
 * drift it exists to reveal. If a pair looks wrong here, the classification is
 * wrong, not the legend.
 *
 * **Four pivots per rule, over one set of pairs** (docs/LEGEND_ORIENTATION.md).
 * Every count and the tree it opens read off the same key function
 * (`ownershipPivots.ts`), so a number cannot disagree with its own list.
 *
 * Every section groups **owner → attribute → owned**, so the top-level row
 * means the owner everywhere. It used to group on `p.range` in every section —
 * but `own-bkwd` flips ownership, so one key landed on opposite roles depending
 * on the section, at the same visual level with no cue.
 *
 * The colors are read from the SAME constants the canvas strokes, never a
 * Tailwind approximation of them, for the same reason: a legend that can drift
 * from the thing it explains is worse than none.
 *
 * "Biggest fans" moved OUT of here and into the example cases (TASKS,
 * "example-cases pane needs restructuring", item 3). It ranks convergences so
 * one can be loaded as a selection, which is case-finding, not legend.
 *
 * Clicking any class name selects it, so the listing doubles as a way to build
 * an ad-hoc case from whatever it turned up.
 */

import { useMemo, useState } from 'react';
import { cardinalityLabel } from '../models/containmentGraph';
import {
  PIVOTS, PIVOT_LABEL, STARTS_OPEN, pivotCount, pivotTree, shapeOf,
  type Field, type Pivot, type PivotNode, type PivotShape,
} from './ownershipPivots';
import './legendTable.css';
import type { DataService, OwnershipPair, OwnershipPairGroup } from '../services/DataService';
import { EDGE_COLORS, RANGE_COLORS, SIBLING_COLORS } from '../config/appConfig';
import HelpMarkdown from '../help/HelpMarkdown';
import { fillPlaceholders } from '../help/parseHelpContent';
import { helpTextResolvers } from './helpTextResolvers';
import HelpPanel from './HelpPanel';
import { PANEL_WIDTH_REM } from './panelLayout';
import EdgeSample, { type DrawnKind } from './EdgeSample';
import { EDGE_STYLE } from './edgeStyle';

interface OwnershipLegendProps {
  dataService: DataService;
  onClose: () => void;
  /** Select a set of classes — used to jump from a listed pair to the canvas. */
  onSelect: (classIds: string[]) => void;
  /** Step aside for the example-cases panel when both are open. */
  offset?: boolean;
}

/**
 * The panel's body-text class, used by every explanatory paragraph here.
 *
 * Siggie, 2026-09-11: "styling should occur in css and config files, not
 * inline." One constant is the smaller half of that — it stops the same
 * `text-[11px] text-gray-500 …` string being retyped at a dozen call sites and
 * gives a real move to CSS one place to start from.
 */
const NOTE = 'text-[11px] leading-snug text-gray-500 dark:text-gray-400 mb-2';

/**
 * The panel's opening accounting, as markdown so its counts can be LIVE.
 *
 * Authored here rather than in `ownershipRules.ts` because it is about the rule
 * SET — how 149 splits three ways — and no single rule owns that sentence.
 * (TASKS `markdown-everywhere` item (b) would move all of this to a content
 * file; until then this is the one place it lives.)
 *
 * ⚠️ **Do not hand-type a number into this string.** Every count resolves
 * through `{{ownership-count:…}}` off `getOwnershipCounts()`. That is the whole
 * point of item (c): the tour's hand-copied "38 of the attributes in this
 * model" was falsified by a rule change and nothing caught it.
 *
 * **Resolved HERE, against this panel's own `dataService`, rather than left to
 * the provider's resolvers.** The legend already holds the data these counts
 * come from, and its own numbers should not depend on a tour being mounted —
 * rendered without a `<HelpProvider>` (as the tests do) the placeholders would
 * otherwise stand visibly, which is the right behaviour for a NAME the schema
 * lost and the wrong one for a number this component can answer itself.
 */
const INTRO = `
Of the {{ownership-count:declared}} attributes in the schema that point from one
entity to another,

- **{{ownership-count:forward}} point forward**, from owner to owned — the default, and
- **{{ownership-count:backward}} point backward**, from owned to owner — in two lists:
  - **{{ownership-count:belongs-to-target-backward-by-entity.total}}** whose target is one of
    **{{ownership-count:belongs-to-target-backward-by-entity.owners}} entities** that are only ever belonged to
  - **{{ownership-count:belongs-to-target-backward-by-attribute.total}}** named individually, because their
    targets are owned by some *other* attribute

Each rule below counts the same pairs four ways. Click a count to group them by
it — always **owner → attribute → owned**, so the top row means the owner in
every list.
`.trim();

/**
 * One drawn edge on its OWN line, captioned with what it means — the shape the
 * tour uses for `{{edge:own-fwd}}`, indented so it reads as an example
 * interrupting the sentence rather than a word inside it.
 *
 * The caption is `EDGE_STYLE`'s own label ("A owns B"), never a second copy of
 * it, so a legend example cannot say something different from what the canvas
 * draws.
 */
function EdgeExample({ kind, example }: { kind: DrawnKind; example?: string }) {
  const style = EDGE_STYLE.kinds[kind];
  return (
    <>
      <span className="flex items-center gap-1.5 my-1 ml-4">
        <EdgeSample kind={kind} width={56} />
        <span className="font-medium" style={{ color: style.color }}>{style.label}</span>
      </span>
      {/* A REAL attribute from the schema beneath the abstract A/B, formatted
          like the listing rows below so the two read as the same kind of thing
          (Siggie, 2026-09-14). The abstract sample says what the ink means; the
          example says where to go look at one. */}
      {example && (
        <span className="block ml-4 font-mono text-[10px] text-gray-400">
          e.g. {example}
        </span>
      )}
    </>
  );
}

/**
 * The colour a rule's name is written in: the verdict it produces, in the SAME
 * hex the canvas strokes. `own-fwd` and `own-bkwd` sit one step apart on P2's
 * Blues ramp because they are the same relation seen from two ends.
 *
 * The rule's NAME now carries what the verdict is ("Owns because multivalued"),
 * so the badge that used to spell it out again alongside is gone (Siggie,
 * 2026-09-11) and only the colour is left to say it.
 *
 * `excluded` names an edge that is NOT drawn, so it takes grey rather than a
 * stroke colour it does not have.
 */
const VERDICT_COLOR: Record<string, string | undefined> = {
  'own-fwd': EDGE_COLORS.ownFwd,
  'own-bkwd': EDGE_COLORS.ownBkwd,
  'excluded': undefined,
};

/** Toolbar buttons, in the order the toolbar shows them. */
const TOOLBAR: ReadonlyArray<{ glyph: string; what: string }> = [
  { glyph: '⇱ roots', what: 'Also draw everything on the path up to a root.' },
  { glyph: 'LR / TB', what: 'Lay the diagram out left-to-right or top-down.' },
  { glyph: '⋙ ⋙⋙ ⌙ ≡', what: 'Where converging edges join before their shared arrowhead — near the box, early, at the last corner, or not at all. Temporary, for picking one by eye.' },
  { glyph: '+ − 1:1 ⛶', what: 'Zoom in, out, reset, fit to view.' },
];

/** Cardinality, as it appears at the right of every attribute row. */
const CARDINALITY: ReadonlyArray<[string, string]> = [
  ['0..1', 'optional, at most one'],
  ['1..1', 'required, exactly one'],
  ['0..*', 'optional, any number'],
  ['1..*', 'required, one or more'],
];

/**
 * One pivot on the count line: `5 owners⌄`.
 *
 * The short label is what fits — the full phrasing is in the `title`, because
 * four counts with their long forms do not come close to one panel width
 * (Siggie: *"we're already not going to be able to fit that whole thing on one
 * line"*).
 *
 * All four expand. `total` briefly had no dropdown on the owns side, on the
 * grounds that it duplicates `attrs`; reversed 2026-09-15 — the two ARE the
 * same list, and what distinguishes them is that `total` opens expanded
 * (`STARTS_OPEN`).
 */
function PivotToggle({ n, pivot, forward, open, onClick }: {
  n: number; pivot: Pivot; forward: boolean; open: boolean; onClick: () => void;
}) {
  const { short, long } = PIVOT_LABEL[pivot];
  const label = `${n} ${long(forward)}`;
  return (
    <button
      onClick={onClick}
      aria-expanded={open}
      title={open ? `Hide these ${label}` : `List these ${label}`}
      className="group cursor-pointer rounded px-1 -mx-1 text-[11px]
                 hover:bg-gray-100 dark:hover:bg-slate-700"
    >
      <span className="text-gray-600 dark:text-gray-300">{n}</span>
      <span className="ml-1 text-gray-500 dark:text-gray-400">&nbsp;{short}</span>
      {/* The chevron darkens on hover too: the row tint is deliberately faint,
          and on a wide panel the pointer is often nowhere near it. */}
      <span className="ml-0.5 text-gray-400 group-hover:text-gray-700
                       dark:group-hover:text-gray-200">
        {open ? '⌃' : '⌄'}
      </span>
    </button>
  );
}

/**
 * The arrow in a pivot table, drawn the way the canvas draws it.
 *
 * The SAME `EdgeSample` the intro examples and the tour use, not a text glyph
 * (Siggie, 2026-09-15) — a legend that can drift from the thing it explains is
 * worse than none, and a `—▶` cannot carry a verdict's colour, dash or head
 * shape. Shorter than the intro's 56px: it sits in a 34px column between two
 * text columns.
 *
 * ⚠️ **Never mirrored.** Siggie's rule, 2026-09-15, and it is the whole rule:
 * *owns points forward `———▶`, belongs to points back `———◀`.* That is exactly
 * the verdict's own geometry (`headDirection` in `OWNERSHIP_VERDICTS`), so the
 * same call draws the right arrow everywhere and `EdgeSample`'s `flip` is not
 * wanted here.
 *
 * Two earlier cuts mirrored it — first on `!forward`, then per shape — to make
 * `owns: owned` read right. Both were treating a column-ORDER problem as an
 * arrow problem: that pivot groups by the owned end, so the fix is
 * `rightAlignLabel`, not a backwards arrow on a forward edge.
 */
const ARROW_W = 30;
function TableArrow({ kind }: { kind: DrawnKind }) {
  return <EdgeSample kind={kind} width={ARROW_W} className="lt-edge" />;
}

/**
 * The CSS grid track list for one pivot — one 16px indent per nesting level,
 * then the content-sized leaf columns.
 *
 * Written inline because it varies per pivot and `legendTable.css` cannot know
 * the shape; everything else about the alignment lives there. See that file's
 * header for how the subgrid chain works.
 */
function tracksFor(shape: PivotShape): string {
  const indents = shape.levels.map(() => '16px').join(' ');
  // A leaf with a target column needs name | arrow | target; otherwise one cell.
  // The arrow track fits the EdgeSample (30px) plus a little breathing room.
  // A right-aligned-label shape has a one-field leaf but still needs the arrow
  // and the label columns — the label IS the third track, shared by the group.
  const leaf = shape.leaf.length > 1 || shape.rightAlignLabel
    ? 'max-content 38px max-content'
    : 'max-content';
  return `${indents} ${leaf}`;
}

/**
 * Which grid track a header caption sits in.
 *
 * A LEVEL's caption spans from its own indent track to the end, because the
 * rows it describes are nested under it. A LEAF column sits in exactly one
 * track, and the leaf's tracks start after the indents — with the arrow
 * occupying the one between a two-field leaf's halves.
 */
function headerColumn(shape: PivotShape, i: number): string {
  const lvl = shape.levels.length;
  /*
   * A right-aligned-label shape inverts the usual reading: its LEVEL caption
   * describes the last track (the shared label) and its leaf field the first,
   * so the two captions are authored in that order — `[SRC_ATTR, ENTITY]` —
   * and land in tracks lvl+1 and lvl+3.
   */
  if (shape.rightAlignLabel) return String(i === 0 ? lvl + 1 : lvl + 3);
  if (i < lvl) return `${i + 1} / -1`;
  const nth = i - lvl;                    // 0 = first leaf field, 1 = the target
  // Track lvl+1 is the leaf's first field; lvl+2 is the arrow; lvl+3 the target.
  return String(nth === 0 ? lvl + 1 : lvl + 3);
}

/**
 * One pivot's expansion: a nested tree that is also an aligned table.
 *
 * Recursive, because a shape is 1 or 2 levels deep and the difference is data
 * (`PivotShape.levels`) rather than two layouts. Each level renders as a
 * subgrid so its leaf cells land in the same tracks as the header's.
 */
function PivotTable({ nodes, shape, forward, isOpen: nodeOpen, onToggle, path = '', classLink }: {
  nodes: readonly PivotNode[];
  shape: PivotShape;
  forward: boolean;
  /** Node paths the viewer has flipped away from the pivot's default state. */
  /** Is this node path open? Prefixing is the caller's business. */
  isOpen: (path: string) => boolean;
  onToggle: (path: string) => void;
  path?: string;
  classLink: (id: string) => React.ReactNode;
}) {
  const kind = (forward ? 'own-fwd' : 'own-bkwd') as DrawnKind;
  const cell = (p: OwnershipPair, f: Field) =>
    f === 'srcAttr' ? <>{classLink(p.declaredOn)}<span>.{p.slotName}</span></>
    : f === 'attr' ? p.slotName
    : classLink(p.range);

  return (
    <>
      {nodes.map(n => {
        const key = path ? `${path}/${n.key}` : n.key;
        // A node's state is an OVERRIDE of the pivot's default (`STARTS_OPEN`),
        // so opening a pivot still sets every row at once — which is what the
        // count line is for — and a row the reader flipped keeps that state.
        const isOpen = nodeOpen(key);
        const depth = path.split('/').filter(Boolean).length;
        const labelArrow = shape.arrow === `label:${depth}`;
        return (
          <div key={key} className="lt-node" {...(isOpen ? { 'data-open': '1' } : {})}>
            <div className={`lt-label${shape.rightAlignLabel ? ' lt-label-right' : ''}`}>
              <button
                className="lt-toggle"
                onClick={() => onToggle(key)}
                aria-expanded={isOpen}
                aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${n.key}`}
              >{isOpen ? '▾' : '▸'}</button>
              {/* On a right-aligned label the arrow comes BEFORE the name, so
                  the row reads `——▶ BodySite` and the entity still ends the
                  line. Everywhere else it follows the name (`Organization ——◀`),
                  where it means "arrows arrive here". */}
              {labelArrow && shape.rightAlignLabel && (
                <span className="lt-arrow"><TableArrow kind={kind} />&nbsp;</span>
              )}
              {/* Only an ENTITY label is a class you can select; an attribute
                  name is not a thing the canvas can draw. */}
              {shape.levels[depth] === 'entity' ? classLink(n.key) : n.key}
              {labelArrow && !shape.rightAlignLabel && (
                <span className="lt-arrow">&nbsp;<TableArrow kind={kind} /></span>
              )}
              {n.pairs.length > 1 && <span className="lt-count">{n.pairs.length}</span>}
            </div>
            <div className="lt-kids">
              {n.children
                ? <PivotTable
                    nodes={n.children} shape={shape} forward={forward}
                    isOpen={nodeOpen} onToggle={onToggle} path={key} classLink={classLink}
                  />
                : n.pairs.map(p => (
                    <div key={`${p.declaredOn}.${p.slotName}`} className="lt-leaf">
                      <span className="lt-c1">
                        {cell(p, shape.leaf[0])}
                        <span className="lt-card">
                          {cardinalityLabel(p.required, p.multivalued)}
                        </span>
                        {p.isLoop && (
                          <span className="lt-card" style={{ color: RANGE_COLORS.entity }}>
                            &nbsp;loop
                          </span>
                        )}
                      </span>
                      {/* Only a two-field leaf draws an arrow of its own. A
                          right-aligned-label shape puts its single arrow on the
                          LABEL row instead — repeating it per leaf said the
                          same thing N times (Siggie, 2026-09-15). */}
                      {shape.leaf.length > 1 && (
                        <span className="lt-arrow"><TableArrow kind={kind} /></span>
                      )}
                      {shape.leaf.length > 1 && (
                        <span className="lt-c2">{cell(p, shape.leaf[1])}</span>
                      )}
                    </div>
                  ))}
            </div>
          </div>
        );
      })}
    </>
  );
}

export default function OwnershipLegend({
  dataService, onClose, onSelect, offset,
}: OwnershipLegendProps) {
  const groups: OwnershipPairGroup[] = useMemo(
    () => dataService.getOwnershipPairGroups(),
    [dataService],
  );
  /*
   * The induced pass is NOT a slot rule and is not shown at all. It reads no
   * attribute — it walks the subclasses of a range something already owns — so
   * a reader who found it beside rules about attributes would look for the
   * attribute behind it and find none. Those edges serve LAYOUT only, which
   * leaves a reader nothing to do with a list of them.
   *
   * `getOwnershipPairGroups` still builds the group; what it means is recorded
   * in OWNERSHIP_CLASSIFICATION.md §Rule 3 and in `OWNERSHIP_RULES`.
   */
  const slotRules = groups.filter(g => g.rule !== 'child-following-parent');
  /* The intro's counts, filled from this panel's own data — see `INTRO`. */
  const intro = useMemo(
    () => fillPlaceholders(INTRO, helpTextResolvers(dataService)),
    [dataService],
  );
  /*
   * Which pivot is open per rule, if any. `undefined` means collapsed.
   *
   * **Opening a pivot REPLACES the previous expansion** — one grouping at a
   * time (Siggie, 2026-09-14). Two simultaneous expansions of the same pairs
   * would rebuild exactly the ambiguity this rewrite removes: the reader would
   * again be looking at two lists of the same things, keyed differently, at the
   * same visual level.
   *
   * Across RULES they stay independent — comparing one rule's shape against
   * another's is what the collapsed count line is for.
   *
   * **Everything starts collapsed** (Siggie, 2026-09-13). The panel opens as
   * three rules and their counts, which is the summary; opening a list is the
   * reader asking a question.
   */
  const [open, setOpen] = useState<ReadonlyMap<string, Pivot>>(() => new Map());
  /*
   * Per-node disclosure, keyed `${rule}:${pivot}:${node/path}`.
   *
   * Every node in a nested list opens and closes on its own (Siggie,
   * 2026-09-15) — which is what makes `STARTS_OPEN` meaningful as a DEFAULT
   * rather than a fixed state. The set holds the nodes currently open; opening
   * a pivot seeds it from that pivot's default, so `total` lands expanded and
   * `attrs` — the identical tree — lands collapsed.
   */
  const [openNodes, setOpenNodes] = useState<ReadonlySet<string>>(() => new Set());

  const togglePivot = (group: string, pivot: Pivot, nodes: readonly PivotNode[]) => {
    const closing = open.get(group) === pivot;
    setOpen(prev => {
      const next = new Map(prev);
      if (closing) next.delete(group); else next.set(group, pivot);
      return next;
    });
    /*
     * Seed this pivot's rows at its default state, at EVERY depth — a two-level
     * pivot seeded only at the top still made the reader click into each owner
     * to reach the attribute names beneath it.
     *
     * Done on OPEN rather than at render so a viewer's per-row choices survive
     * until they switch pivots.
     */
    setOpenNodes(prev => {
      const next = new Set([...prev].filter(k => !k.startsWith(`${group}:`)));
      if (!closing && STARTS_OPEN[pivot]) {
        const seed = (ns: readonly PivotNode[], path: string) => {
          for (const n of ns) {
            const key = path ? `${path}/${n.key}` : n.key;
            next.add(`${group}:${pivot}:${key}`);
            if (n.children) seed(n.children, key);
          }
        };
        seed(nodes, '');
      }
      return next;
    });
  };
  const toggleNode = (group: string, pivot: Pivot, path: string) =>
    setOpenNodes(prev => {
      const next = new Set(prev);
      const k = `${group}:${pivot}:${path}`;
      if (!next.delete(k)) next.add(k);
      return next;
    });

  const classLink = (id: string) => (
    <button
      onClick={() => onSelect([id])}
      className="cursor-pointer hover:underline text-blue-600 dark:text-blue-400"
      title={`Select ${id}`}
    >
      {id}
    </button>
  );

  return (
    <HelpPanel
      title="Legend"
      subtitle="What the diagram's arrows, colors and buttons mean."
      onClose={onClose}
      offset={offset}
      widthRem={PANEL_WIDTH_REM.legend}
    >
      <div className="text-xs">
        <Section title="Arrow direction and ownership">
          <p className={NOTE}>
            Edges connect entities in ownership (i.e., containment or has-a)
            relationships. They start at attribute rows that point to other
            entities and end at the header of the target entity's box.
          </p>
          <p className={NOTE}>
            An attribute can target an entity that it <b>owns</b>
            <EdgeExample kind="own-fwd" example="Condition.affected_body_site" />
            in which case, B appears to the right of A and the edge points forward.
          </p>
          <p className={NOTE}>
            Or it can target an entity that it <b>belongs to</b>
            <EdgeExample kind="own-bkwd" example="Condition.associated_participant" />
            in which case, B appears to the left of A and the edge points backward.
          </p>
          {/*
            The accounting that makes 149 the anchor, and so makes `total`
            legible as the fourth pivot. It REPLACED a "two kinds of exception"
            paragraph that named no numbers.
            Every count is LIVE (`{{ownership-count:…}}`, TASKS
            `markdown-everywhere` item (c)) — hand-copied counts in help text
            have already gone stale twice, and this panel now quotes nine of
            them.
            ⚠️ The two backward numbers count DIFFERENT KINDS of thing and must
            not be given parallel phrasing: the first list is keyed by 5
            ENTITIES covering 55 attributes, the second is 5 ATTRIBUTES over 2
            entities. An earlier draft read "55 owner entities / 5 source
            attributes", which reads as one kind.
            ⚠️ What distinguishes the by-attribute five is NOT that their
            sources point both ways — `SdohObservation` does too and is not in
            the list. It is that their TARGETS are themselves owned by another
            attribute, which is why the key is `Class.slot`.
            This prose also carries what the dropped rule indent used to say:
            that the two backward rules are EXCEPTIONS, not peers of the first.
          */}
          <div className="help-prose text-[11px] leading-snug text-gray-500 dark:text-gray-400 mb-2">
            <HelpMarkdown>{intro}</HelpMarkdown>
          </div>
          <ul className="space-y-2.5">
            {slotRules.map(g => {
              const key = `${g.verdict}/${g.rule}`;
              const color = VERDICT_COLOR[g.verdict];
              const pivot = open.get(key);
              // Which structural end plays the owner. Drives the pivot popovers
              // (`(target)` vs `(source)`) and which levels a tree nests.
              const forward = g.verdict === 'own-fwd';
              return (
                /*
                 * NO INDENT on the exceptions (2026-09-14). `parentRule` used
                 * to push the two backward rules right, which was the only
                 * visual signal that they revise the first rather than sit
                 * beside it — the new intro prose carries that in words
                 * instead. The rules are now three peers on the page and a
                 * rule-and-its-exceptions in the prose above.
                 */
                <li key={key} className="border-l-2 pl-2 border-gray-200 dark:border-slate-600">
                  <div className="flex items-baseline gap-1.5">
                    <div
                      className={color ? 'font-medium' : 'font-medium text-gray-400'}
                      style={color ? { color } : undefined}
                    >
                      {g.ruleLabel}
                    </div>
                    {/* The arrow on the rule line itself, in the verdict's own
                        colour — so the heading shows the ink it is about
                        without the reader carrying it down from the samples
                        above (Siggie, 2026-09-14). */}
                    {color && <EdgeSample kind={g.verdict as DrawnKind} width={34} />}
                  </div>
                  <div className="flex flex-wrap items-baseline gap-x-1 mt-0.5">
                    {PIVOTS.map((pv, i) => (
                      <span key={pv} className="flex items-baseline">
                        {/* Spaces around the separator, not just a margin: the
                            count and its label are one token to the eye, and
                            `38 owners⌄—52 attrs⌄` runs them together. */}
                        {i > 0 && <span className="text-gray-300 mx-1">&nbsp;—&nbsp;</span>}
                        <PivotToggle
                          n={pivotCount(g.pairs, pv)}
                          pivot={pv}
                          forward={forward}
                          open={pivot === pv}
                          onClick={() => togglePivot(
                            key, pv, pivotTree(g.pairs, pv, forward))}
                        />
                      </span>
                    ))}
                  </div>
                  {/* MARKDOWN, not a plain string (TASKS `markdown-everywhere`
                      item (a)): the rule text is prose about edges sitting
                      beside drawn edge samples, and until now it was the one
                      body of help prose in the app that could not say
                      `{{edge:own-fwd}}` or wear a verdict's colour. */}
                  <div className="help-prose text-[11px] leading-snug text-gray-600 dark:text-gray-400 mt-0.5">
                    <HelpMarkdown>{g.ruleText}</HelpMarkdown>
                  </div>
                  {pivot && (() => {
                    const shape = shapeOf(pivot, forward);
                    const verdict = g.verdict as DrawnKind;
                    return (
                      <div className="lt" style={{ gridTemplateColumns: tracksFor(shape) }}>
                        {/* The header names the columns the rows land in. Its
                            cells span the same tracks, which is what the
                            subgrid chain in `legendTable.css` keeps true at
                            every depth. */}
                        <div className="lt-head">
                          {shape.headers.map((h, i) => (
                            <div
                              key={h}
                              className="lt-h"
                              style={{ gridColumn: headerColumn(shape, i) }}
                            >
                              {h}
                              {shape.arrow === `label:${i}` && (
                                <span className="lt-arrow">
                                  &nbsp;<TableArrow kind={verdict} />
                                </span>
                              )}
                            </div>
                          ))}
                          {/* The arrow column's own header, in the track the
                              leaves put their arrow in — `levels + 2`, NOT
                              `levels + 1`: the leaf's first field takes that
                              one. Getting this wrong put the arrow on top of
                              the attribute-name caption and shifted every
                              caption after it one track left. */}
                          {shape.leaf.length > 1 && (
                            <div
                              className="lt-h lt-h-arrow lt-arrow"
                              style={{ gridColumn: shape.levels.length + 2 }}
                            ><TableArrow kind={verdict} /></div>
                          )}
                        </div>
                        <PivotTable
                          nodes={pivotTree(g.pairs, pivot, forward)}
                          shape={shape}
                          forward={forward}
                          isOpen={path => openNodes.has(`${key}:${pivot}:${path}`)}
                          onToggle={path => toggleNode(key, pivot, path)}
                          classLink={classLink}
                        />
                      </div>
                    );
                  })()}
                </li>
              );
            })}
          </ul>
        </Section>

        <Section title="Cardinality">
          <ul className="flex flex-wrap gap-x-4 gap-y-1">
            {CARDINALITY.map(([g, w]) => (
              <li key={g} className="flex items-center gap-1.5">
                <span className="font-mono text-[11px] text-gray-700 dark:text-gray-300">{g}</span>
                <span className="text-[11px] text-gray-500 dark:text-gray-400">{w}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Colors">
          <Swatches
            caption="A row's dot and its range label say what KIND of thing the attribute points at."
            items={[
              { color: RANGE_COLORS.entity, label: 'another entity' },
              { color: RANGE_COLORS.enum, label: 'a value set' },
              { color: RANGE_COLORS.dataType, label: 'a data type' },
            ]}
          />
          <p className="text-[11px] leading-snug text-gray-600 dark:text-gray-400 mt-2">
            A <b>filled</b> dot draws an edge; a <b>hollow</b> one does not,
            because what it points at is not on the canvas. Only entity ranges
            can draw edges at all.
          </p>
          <Swatches
            className="mt-3"
            caption="Inside a merged box, a color says which entity an attribute belongs to."
            items={SIBLING_COLORS.slice(0, 4).map((c, i) => ({
              color: c.text,
              swatch: c.fill,
              label: i === 0 ? 'the parent' : `child ${i}`,
            }))}
          />
        </Section>

        <Section title="The toolbar">
          <ul className="space-y-1">
            {TOOLBAR.map(t => (
              <li key={t.glyph} className="flex gap-2">
                <span className="shrink-0 font-mono text-[11px] text-gray-700 dark:text-gray-300 w-20">
                  {t.glyph}
                </span>
                <span className="text-[11px] leading-snug text-gray-600 dark:text-gray-400">
                  {t.what}
                </span>
              </li>
            ))}
          </ul>
        </Section>

      </div>
      <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-3">
        A box's <b>“N related”</b> count is of distinct classes{' '}
        <i>outside</i> it, so selecting a class that folds into a merged box
        can make the number go <i>down</i>. Correct, if counter-intuitive.
      </p>
    </HelpPanel>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-4 last:mb-1">
      <h3 className="text-[11px] font-semibold uppercase tracking-wider
                     text-gray-400 dark:text-gray-500 mb-1">
        {title}
      </h3>
      {children}
    </section>
  );
}

function Swatches({ caption, items, className }: {
  caption: string;
  items: ReadonlyArray<{ color: string; swatch?: string; label: string }>;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-1">{caption}</p>
      <ul className="flex flex-wrap gap-x-3 gap-y-1">
        {items.map(it => (
          <li key={it.label} className="flex items-center gap-1">
            <span
              className="inline-block w-3 h-3 rounded-sm border"
              style={{
                background: it.swatch ?? it.color,
                borderColor: it.color,
              }}
            />
            <span className="text-[11px]" style={{ color: it.color }}>{it.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
