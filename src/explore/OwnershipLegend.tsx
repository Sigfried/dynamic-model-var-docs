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
 * That is deliberate and load-bearing: ASSOCIATION_SLOTS and
 * SINGLE_VALUE_OWNER_TARGETS are hand-curated and go stale silently on every
 * schema sync, so a legend built from a second copy of the rules would conceal
 * the drift it exists to reveal. If a pair looks wrong here, the classification
 * is wrong, not the legend.
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
import type { DataService, OwnershipPairGroup } from '../services/DataService';
import { EDGE_COLORS, RANGE_COLORS, SIBLING_COLORS } from '../config/appConfig';
import HelpPanel from './HelpPanel';
import EdgeSample, { type DrawnKind } from './EdgeSample';

interface OwnershipLegendProps {
  dataService: DataService;
  onClose: () => void;
  /** Select a set of classes — used to jump from a listed pair to the canvas. */
  onSelect: (classIds: string[]) => void;
  /** Step aside for the example-cases panel when both are open. */
  offset?: boolean;
}

/**
 * Short label + color per verdict.
 *
 * The three live verdicts take P2's Blues ramp — the SAME hex values the canvas
 * strokes. `own-fwd` and `own-bkwd` sit one step apart because they are the
 * same relation seen from two ends.
 *
 * `excluded` is not a relation kind and stays outside the ramp: it names an
 * edge that is NOT drawn, so giving it a stroke color would be a lie.
 */
const VERDICT_LABEL: Record<string, { text: string; color?: string; cls?: string }> = {
  'own-fwd': { text: 'owns (forward)', color: EDGE_COLORS.ownFwd },
  'own-bkwd': { text: 'belongs to (backward)', color: EDGE_COLORS.ownBkwd },
  'association': { text: 'association (no ownership)', color: EDGE_COLORS.association },
  'excluded': {
    text: 'dropped',
    cls: 'text-gray-400 dark:text-gray-500 border-gray-300',
  },
};

/**
 * The three relation kinds as prose, paired with a drawn sample of the edge.
 *
 * "Owns" and "belongs to" are different claims, not synonyms — see
 * docs/OWNERSHIP_CLASSIFICATION.md. The wording here is that doc's, in the
 * second person.
 */
const EDGE_KINDS: ReadonlyArray<{
  kind: DrawnKind; color: string; title: string; body: string;
}> = [
  {
    kind: 'own-fwd',
    color: EDGE_COLORS.ownFwd,
    title: 'A owns B',
    body: 'The arrow runs from the owner to what it holds. A owns B when the '
      + 'schema puts the collection on A, or when B has no independent '
      + 'existence — a Quantity of 5 mg is not something you look up.',
  },
  {
    kind: 'own-bkwd',
    color: EDGE_COLORS.ownBkwd,
    title: 'A belongs to B',
    body: 'The same relationship stored at the other end: A carries a pointer '
      + 'to one B that exists without it. Drawn B → A, so you still read '
      + '"start at B to find A". A Participant carries on existing whether or '
      + 'not any observation points at it.',
  },
  {
    kind: 'association',
    color: EDGE_COLORS.association,
    title: 'A and B are associated',
    body: 'Neither owns the other. Dashed, with arrowheads at both ends. Only '
      + 'two edges in the schema are this — a slot the ownership rules would '
      + 'otherwise claim, wrongly.',
  },
];

/** Toolbar buttons, in the order the toolbar shows them. */
const TOOLBAR: ReadonlyArray<{ glyph: string; what: string }> = [
  { glyph: '⇱ roots', what: 'Also draw everything on the path up to a root.' },
  { glyph: '⑃ siblings', what: 'Draw classes that share a parent as one merged box.' },
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
      className="hover:underline text-blue-600 dark:text-blue-400"
      title={`Select ${id}`}
    >
      {id}
    </button>
  );

  return (
    <HelpPanel
      title="Ownership legend"
      subtitle="What the diagram's arrows, colors and buttons mean."
      onClose={onClose}
      offset={offset}
    >
      <div className="text-xs">
        <Section title="The three kinds of relationship">
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-2">
            Every edge is a class-valued attribute. Classes are placed so that
            if <b>A</b> is drawn before <b>B</b>, you reach <b>B</b> through{' '}
            <b>A</b> — so an edge always tells you where to start.
          </p>
          <ul className="space-y-2">
            {EDGE_KINDS.map(k => (
              <li key={k.title} className="flex gap-2">
                <EdgeSample kind={k.kind} className="mt-0.5" />
                <div className="min-w-0">
                  <div className="font-medium" style={{ color: k.color }}>{k.title}</div>
                  <p className="text-[11px] leading-snug text-gray-600 dark:text-gray-400">
                    {k.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <p className="text-[11px] leading-snug text-gray-500 dark:text-gray-400 mt-2">
            An edge leaves the <b>attribute's row</b>, not the box — that is how
            you tell which attribute made it. A <b>⟲</b> on a row is a slot
            pointing back at its own class.
          </p>
          <p className="text-[11px] leading-snug text-gray-500 dark:text-gray-400 mt-2">
            Owners are drawn first, so a box's <b>← N</b> counts what it belongs
            to (on its left) and <b>M →</b> what it owns (on its right). Hover
            either to list them. The little edge on each row is the one above:
            it says which end holds the arrowhead, and so which entity declares
            the attribute — and <i>both</i> kinds turn up on <i>both</i> sides.
          </p>
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
            caption="Inside a merged box, a color says which class an attribute belongs to."
            items={SIBLING_COLORS.slice(0, 4).map((c, i) => ({
              color: c.text,
              swatch: c.fill,
              label: i === 0 ? 'the parent' : `child ${i}`,
            }))}
          />
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

        <Section title="Every relationship, by rule">
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-1.5">
            Derived live from the classifier the graph itself uses, so this
            cannot drift from what is drawn. Overrides and value-object
            membership are hand-curated — if a pair looks wrong, the
            classification is. Click any class to select it.
          </p>
          <ul className="space-y-1">
            {groups.map(g => {
              const key = `${g.verdict}/${g.rule}`;
              const v = VERDICT_LABEL[g.verdict] ?? VERDICT_LABEL.excluded;
              const isOpen = open === key;
              return (
                <li key={key} className="border-l-2 pl-2 border-gray-200 dark:border-slate-600">
                  <button
                    onClick={() => setOpen(isOpen ? null : key)}
                    className="w-full text-left"
                  >
                    <span
                      className={`inline-block px-1 rounded border text-[10px] ${v.cls ?? ''}`}
                      style={v.color ? { color: v.color, borderColor: v.color } : undefined}
                    >
                      {v.text}
                    </span>
                    <span className="ml-1.5 font-medium">{g.rule}</span>
                    <span className="ml-1 text-gray-400">{g.pairs.length}</span>
                    <span className="ml-1 text-gray-400">{isOpen ? '▾' : '▸'}</span>
                  </button>
                  <p className="text-[11px] leading-snug text-gray-600 dark:text-gray-400 mt-0.5">
                    {g.ruleText}
                  </p>
                  {isOpen && (
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
                          {(g.verdict === 'own-bkwd' || g.verdict === 'association') && (
                            <span className="ml-1 text-gray-400">
                              (owner: {p.owner})
                            </span>
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

        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-3">
          A box's <b>“N related”</b> count is of distinct classes{' '}
          <i>outside</i> it, so selecting a class that folds into a merged box
          can make the number go <i>down</i>. Correct, if counter-intuitive.
        </p>
      </div>
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
