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
 * **Two counts per rule, over one grouping** (TASKS `legend-two-counts`):
 * `N entities` and `M attributes` both read off `byTargetEntity`, so they
 * cannot disagree. Grouping by the TARGET is what makes the exception lists
 * legible — a rule keyed by range is a list of five entities, and a flat
 * listing of its 55 attributes buries that.
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
import { parentRuleOf } from '../services/DataService';
import { cardinalityLabel } from '../models/containmentGraph';
import type { DataService, OwnershipPair, OwnershipPairGroup } from '../services/DataService';
import { EDGE_COLORS, RANGE_COLORS, SIBLING_COLORS } from '../config/appConfig';
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
 * One drawn edge on its OWN line, captioned with what it means — the shape the
 * tour uses for `{{edge:own-fwd}}`, indented so it reads as an example
 * interrupting the sentence rather than a word inside it.
 *
 * The caption is `EDGE_STYLE`'s own label ("A owns B"), never a second copy of
 * it, so a legend example cannot say something different from what the canvas
 * draws.
 */
function EdgeExample({ kind }: { kind: DrawnKind }) {
  const style = EDGE_STYLE.kinds[kind];
  return (
    <span className="flex items-center gap-1.5 my-1 ml-4">
      <EdgeSample kind={kind} width={56} />
      <span className="font-medium" style={{ color: style.color }}>{style.label}</span>
    </span>
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

/** Which depth of a rule's one list is open, if either. */
type Depth = 'entities' | 'attributes';

/**
 * One rule's pairs, grouped by the TARGET entity — the range, which is the end
 * the rule is about — and sorted by name.
 *
 * Both of a rule's counts read off this one structure: `N entities` is its
 * size, `M attributes` the total of its values. Deriving them together is the
 * point; two independent counts computed two ways is how they come to disagree.
 */
function byTargetEntity(pairs: readonly OwnershipPair[]) {
  const m = new Map<string, OwnershipPair[]>();
  for (const p of pairs) {
    const list = m.get(p.range);
    if (list) list.push(p); else m.set(p.range, [p]);
  }
  return [...m.entries()]
    .map(([entity, ps]) => ({ entity, pairs: ps }))
    .sort((a, b) => a.entity.localeCompare(b.entity));
}

/** One count with its own disclosure triangle: `N entities ⌄`. */
function CountToggle({ n, noun, open, onClick }: {
  n: number; noun: string; open: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-expanded={open}
      title={open ? `Hide these ${noun}` : `List these ${noun}`}
      className="group cursor-pointer rounded px-1 -mx-1 text-[11px]
                 hover:bg-gray-100 dark:hover:bg-slate-700"
    >
      <span className="text-gray-600 dark:text-gray-300">{n}</span>
      <span className="ml-1 text-gray-500 dark:text-gray-400">&nbsp;{noun}</span>
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
 * The one list both counts open, at two depths.
 *
 * `N entities` and `M attributes` are not two listings — they are the SAME
 * rows, collapsed and expanded (Siggie, 2026-09-13). Each row is a target
 * entity carrying its own `M attributes` badge; `showAttributes` decides
 * whether the attributes under it are revealed. Rendering two different lists
 * here was the thing that made one look like a list that would not close, and
 * it also cost the entity view the per-entity counts that are its point.
 *
 * **A single attribute sits on the entity's own line** — `Entity: Class.slot`
 * — and only a genuine list indents. Most entities here are named by exactly
 * one attribute, so a heading plus one indented row doubled the height of the
 * list to say nothing.
 *
 * `Class.slot` only, never the range: that is the row it sits under.
 */
function EntityRows({ entities, showAttributes, openRows, onToggleRow, classLink }: {
  entities: ReadonlyArray<{ entity: string; pairs: OwnershipPair[] }>;
  showAttributes: boolean;
  /** Entities whose own state differs from the rule-level depth. */
  openRows: ReadonlySet<string>;
  onToggleRow: (entity: string) => void;
  classLink: (id: string) => React.ReactNode;
}) {
  /*
   * Cardinality on EVERY attribute, in the `0..1` notation the Cardinality
   * section below defines and the diagram's own attribute rows use (Siggie,
   * 2026-09-13).
   *
   * It replaced a lone `↠` on multivalued rows, which marked half the rows
   * with a glyph nothing else on the panel explained — and which read as
   * arbitrary now that the plain `→` it used to contrast against is gone with
   * the range. Cardinality decides no ownership any more, so it is shown as
   * what it is: a fact about the attribute, spelled the one way.
   */
  const attr = (p: OwnershipPair) => (
    <>
      {classLink(p.declaredOn)}
      <span className="text-gray-400">.{p.slotName}</span>
      <span className="ml-1.5 text-gray-400">&nbsp;{cardinalityLabel(p.required, p.multivalued)}</span>
      {p.isLoop && (
        <span className="ml-1" style={{ color: RANGE_COLORS.entity }}>loop</span>
      )}
    </>
  );
  return (
    <ul className="mt-1 mb-1.5 space-y-0.5 font-mono text-[10px]
                   text-gray-600 dark:text-gray-400">
      {entities.map(e => {
        /*
         * A row's own state is an OVERRIDE of the rule-level depth, not a
         * separate switch: `openRows` holds the rows that differ. So the two
         * counts still set every row at once — which is what they are for —
         * and a row the reader has opened or closed by hand keeps that state
         * until the next time they click a count.
         */
        const open = openRows.has(e.entity) ? !showAttributes : showAttributes;
        const inline = open && e.pairs.length === 1;
        return (
          <li key={e.entity}>
            <span className="text-gray-500 dark:text-gray-400">{classLink(e.entity)}</span>
            {inline && (
              <>
                <span className="text-gray-400">: </span>
                {attr(e.pairs[0])}
              </>
            )}
            {/* The badge is the row's own count AND its disclosure. It is what
                makes the collapsed view worth reading, and clicking the entity
                name itself cannot serve: that selects the class on the canvas. */}
            {!inline && (
              <button
                onClick={() => onToggleRow(e.entity)}
                aria-expanded={open}
                title={open ? `Hide ${e.entity}'s attributes` : `List ${e.entity}'s attributes`}
                className="group cursor-pointer rounded px-1 -mx-0.5 text-[9px] text-gray-400
                           hover:bg-gray-100 dark:hover:bg-slate-700"
              >
                &nbsp;{e.pairs.length}&nbsp;{e.pairs.length === 1 ? 'attribute' : 'attributes'}
                <span className="ml-0.5 group-hover:text-gray-700 dark:group-hover:text-gray-200">
                  {open ? '⌃' : '⌄'}
                </span>
              </button>
            )}
            {open && !inline && (
              <ul className="ml-3">
                {e.pairs.map(p => (
                  <li key={`${p.declaredOn}.${p.slotName}`}>{attr(p)}</li>
                ))}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
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
   * The induced pass is NOT a slot rule and is no longer listed as one
   * (Siggie, 2026-09-13). It reads no attribute — it walks the subclasses of a
   * range something already owns — so a reader who found it beside two rules
   * about attributes would look for the attribute behind it and find none.
   *
   * It keeps its listing, in its own section below: those edges are on the
   * canvas, they are derived live like everything else here, and this is the
   * only place their pairs can be seen. Explaining what they ARE is the tour's
   * job; showing WHICH ones is still the legend's.
   */
  const slotRules = groups.filter(g => g.rule !== 'child-following-parent');
  const induced = groups.find(g => g.rule === 'child-following-parent');
  const inducedEntities = induced ? byTargetEntity(induced.pairs) : [];
  /*
   * Which disclosures are open, keyed `${group}:${which}`. A SET, not a single
   * key: each rule has two independent counts (TASKS `legend-two-counts`), and
   * a reader comparing entity counts across rules wants several open at once.
   *
   * **Everything starts collapsed** (Siggie, 2026-09-13). The panel opens as
   * four rules and their counts, which is the summary; opening a list is the
   * reader asking a question. An attribute list open by default also read as a
   * collapse FAILURE when the entity list was opened above it — both lists
   * name the same entities, so two open lists look like one that would not
   * close.
   */
  const [open, setOpen] = useState<ReadonlyMap<string, Depth>>(() => new Map());
  /*
   * Opening one count closes the other on the SAME rule: they are two depths
   * of one list, so holding both would be holding one list in two states.
   * Across rules they stay independent — comparing entity counts is exactly
   * what the collapsed view is for.
   */
  /** Per rule, the entity rows whose state differs from the rule's depth. */
  const [rowOverrides, setRowOverrides] =
    useState<ReadonlyMap<string, ReadonlySet<string>>>(() => new Map());
  const toggleRow = (group: string, entity: string) => setRowOverrides(prev => {
    const next = new Map(prev);
    const rows = new Set(next.get(group) ?? []);
    if (!rows.delete(entity)) rows.add(entity);
    next.set(group, rows);
    return next;
  });
  const NO_ROWS: ReadonlySet<string> = new Set();

  const setDepth = (group: string, depth: Depth) => {
    setOpen(prev => {
      const next = new Map(prev);
      if (next.get(group) === depth) next.delete(group); else next.set(group, depth);
      return next;
    });
    // A count sets every row in its rule, so per-row overrides are cleared:
    // otherwise "show me all the attributes" would leave some rows shut.
    setRowOverrides(prev => {
      const next = new Map(prev);
      next.delete(group);
      return next;
    });
  };


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
            <EdgeExample kind="own-fwd" />
            in which case, B appears to the right of A and the edge points forward.
          </p>
          <p className={NOTE}>
            Or it can target an entity that it <b>belongs to</b>
            <EdgeExample kind="own-bkwd" />
            in which case, B appears to the left of A and the edge points backward.
          </p>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-1.5">
            An attribute owns the entity it points at, with two kinds of exception.
            Click a count to list what the rule applies to.
          </p>
          <ul className="space-y-1">
            {slotRules.map(g => {
              const key = `${g.verdict}/${g.rule}`;
              const color = VERDICT_COLOR[g.verdict];
              const entities = byTargetEntity(g.pairs);
              // An exception renders BENEATH the rule it revises, not beside
              // it: the groups arrive in the rules' own order, so the parent is
              // always the entry above. Nesting is the only thing that says
              // these two are a rule and its exception rather than peers.
              const isException = parentRuleOf(g.rule) !== undefined;
              return (
                <li
                  key={key}
                  className={`border-l-2 pl-2 border-gray-200 dark:border-slate-600${
                    isException ? ' ml-4' : ''}`}
                >
                  <div
                    className={color ? 'font-medium' : 'font-medium text-gray-400'}
                    style={color ? { color } : undefined}
                  >
                    {g.ruleLabel}
                  </div>
                  <div className="flex gap-3 mt-0.5">
                    <CountToggle
                      n={entities.length}
                      noun="entities"
                      open={open.get(key) === 'entities'}
                      onClick={() => setDepth(key, 'entities')}
                    />
                    <CountToggle
                      n={g.pairs.length}
                      noun="attributes"
                      open={open.get(key) === 'attributes'}
                      onClick={() => setDepth(key, 'attributes')}
                    />
                  </div>
                  <p className="text-[11px] leading-snug text-gray-600 dark:text-gray-400 mt-0.5">
                    {g.ruleText}
                  </p>
                  {open.has(key) && (
                    <EntityRows
                      entities={entities}
                      showAttributes={open.get(key) === 'attributes'}
                      openRows={rowOverrides.get(key) ?? NO_ROWS}
                      onToggleRow={entity => toggleRow(key, entity)}
                      classLink={classLink}
                    />
                  )}
                </li>
              );
            })}
          </ul>
        </Section>

        {induced && (
          <Section title="Edges with no attribute behind them">
            <p className={NOTE}>
              An attribute whose target has subclasses accepts any of them, so
              whatever owns the target owns each subclass too. These edges are
              induced from a declared one rather than read from an attribute of
              their own — which is why you can see an edge on the diagram that
              no attribute row points at.
            </p>
            <div className="flex gap-3">
              <CountToggle
                n={inducedEntities.length}
                noun="entities"
                open={open.get('induced') === 'entities'}
                onClick={() => setDepth('induced', 'entities')}
              />
              <CountToggle
                n={induced.pairs.length}
                noun="attributes"
                open={open.get('induced') === 'attributes'}
                onClick={() => setDepth('induced', 'attributes')}
              />
            </div>
            {open.has('induced') && (
              <EntityRows
                entities={inducedEntities}
                showAttributes={open.get('induced') === 'attributes'}
                openRows={rowOverrides.get('induced') ?? NO_ROWS}
                onToggleRow={entity => toggleRow('induced', entity)}
                classLink={classLink}
              />
            )}
          </Section>
        )}

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
