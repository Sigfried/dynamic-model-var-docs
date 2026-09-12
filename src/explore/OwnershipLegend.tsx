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
 * That is deliberate and load-bearing: SINGLE_VALUE_OWNER_TARGETS is
 * hand-curated and goes stale silently on every schema sync, so a legend built
 * from a second copy of the rules would conceal the drift it exists to reveal.
 * If a pair looks wrong here, the classification is wrong, not the legend.
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
import type { DataService, OwnershipPairGroup } from '../services/DataService';
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

export default function OwnershipLegend({
  dataService, onClose, onSelect, offset,
}: OwnershipLegendProps) {
  const groups: OwnershipPairGroup[] = useMemo(
    () => dataService.getOwnershipPairGroups(),
    [dataService],
  );
  const [open, setOpen] = useState<string | null>(null);

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
            Ownership direction is governed by three rules and one set of exceptions.
            Click any rule to view the attributes it applies to.
          </p>
          <ul className="space-y-1">
            {groups.map(g => {
              const key = `${g.verdict}/${g.rule}`;
              const color = VERDICT_COLOR[g.verdict];
              const isOpen = open === key;
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
                  <button
                    onClick={() => setOpen(isOpen ? null : key)}
                    aria-expanded={isOpen}
                    title={isOpen ? 'Hide these attributes' : 'List the attributes this rule applies to'}
                    className="group w-full text-left cursor-pointer rounded px-1 -mx-1
                               hover:bg-gray-100 dark:hover:bg-slate-700"
                  >
                    <span
                      className={color ? 'font-medium' : 'font-medium text-gray-400'}
                      style={color ? { color } : undefined}
                    >
                      {g.ruleLabel}
                    </span>
                    <span className="ml-1 text-gray-400">{g.pairs.length}</span>
                    {/* The chevron darkens too: the row tint is deliberately
                        faint, and on a wide panel the pointer is often nowhere
                        near it when the row lights up. */}
                    <span className="ml-1 text-gray-400 group-hover:text-gray-700
                                     dark:group-hover:text-gray-200">
                      {isOpen ? '▾' : '▸'}
                    </span>
                  </button>
                  <p className="text-[11px] leading-snug text-gray-600 dark:text-gray-400 mt-0.5">
                    {g.ruleText}
                  </p>
                  {isOpen && (
                    /* `Class.slot → Range`, always in DECLARATION order —
                       which end owns is what the rule above says, so the
                       per-row `(owner: X)` that used to sit here only ever
                       repeated the range printed two tokens earlier (checked
                       across all 60 backward pairs, 2026-09-11). */
                    <ul className="mt-1 mb-1.5 space-y-0.5 font-mono text-[10px]">
                      {g.pairs.map(p => (
                        <li key={`${p.declaredOn}.${p.slotName}`} className="text-gray-600 dark:text-gray-400">
                          {classLink(p.declaredOn)}
                          <span className="text-gray-400">.{p.slotName}</span>
                          <span className="mx-1 text-gray-400">
                            {p.multivalued ? '↠' : '→'}
                          </span>
                          {classLink(p.range)}
                          {p.isLoop && (
                            <span className="ml-1" style={{ color: RANGE_COLORS.entity }}>loop</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
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
