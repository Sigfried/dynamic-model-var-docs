/**
 * OwnershipLegend — every ownership pair in the schema, grouped by the rule
 * that classified it (TASKS "upcoming thoughts" #1).
 *
 * The point is finding cases the curated example set missed. It already did
 * that once: the example set was built off the CONVERGENCE ranking, which
 * hides FK hubs because flipped edges reverse direction — so Participant's
 * 22-edge outbound fan, the largest in the schema, was absent until this
 * listing showed 43 `own-bkwd / fk-inversion` pairs sitting in one group.
 *
 * Everything here is derived live from `classifySlotEdgeExplained` via
 * DataService — the same call the graph builder makes. Nothing is restated.
 * That is deliberate and load-bearing: ASSOCIATION_SLOTS and SINGLE_VALUE_OWNER_TARGETS
 * are hand-curated and go stale silently on every schema sync, so a legend
 * built from a second copy of the rules would conceal the drift it exists to
 * reveal. If a pair looks wrong here, the classification is wrong, not the
 * legend.
 *
 * Clicking any class name selects it, so the legend doubles as a way to build
 * an ad-hoc case from whatever the listing turned up.
 */

import { useMemo, useState } from 'react';
import type { DataService, OwnershipPairGroup } from '../services/DataService';
import { EDGE_COLORS, RANGE_COLORS } from '../config/appConfig';

interface OwnershipLegendProps {
  dataService: DataService;
  /** Select a set of classes — used to jump from a listed pair to the canvas. */
  onSelect: (classIds: string[]) => void;
}

/**
 * Short label + colour per verdict.
 *
 * The three live verdicts take P2's Blues ramp — the SAME hex values the
 * canvas strokes, not a Tailwind approximation of them, so the legend and the
 * thing it explains cannot drift apart. `own-fwd` and `own-bkwd` sit one step
 * apart because they are the same relation seen from two ends.
 *
 * `excluded` is not a relation kind and stays outside the ramp: it names an
 * edge that is NOT drawn, so giving it a stroke colour would be a lie.
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

export default function OwnershipLegend({ dataService, onSelect }: OwnershipLegendProps) {
  const groups: OwnershipPairGroup[] = useMemo(
    () => dataService.getOwnershipPairGroups(),
    [dataService],
  );
  const convergences = useMemo(
    () => dataService.getConvergenceRanking(),
    [dataService],
  );
  const divergences = useMemo(
    () => dataService.getDivergenceRanking(),
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
    <div className="text-xs">
      {/* Rankings first: these are what a case is chosen from. */}
      <section className="mb-4">
        <h3 className="text-[11px] font-semibold uppercase tracking-wider
                       text-gray-400 dark:text-gray-500 mb-1">
          Biggest fans
        </h3>
        <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-1.5">
          Counted in slot-edges, not classes: one class owning a target through
          two slots crowds the corridor twice. Click a row to load just that fan.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {([
            ['Converging (in)', convergences.slice(0, 6).map(c =>
              ({ entity: c.entity, n: c.edgeCount, peers: c.owners, flipped: 0 }))],
            ['Diverging (out)', divergences.slice(0, 6).map(d =>
              ({ entity: d.entity, n: d.edgeCount, peers: d.owned, flipped: d.flippedCount }))],
          ] as const).map(([heading, rows]) => (
            <div key={heading}>
              <h4 className="text-[10px] font-medium text-gray-500 dark:text-gray-400 mb-0.5">
                {heading}
              </h4>
              <ul className="space-y-0.5">
                {rows.map(r => (
                  <li key={r.entity}>
                    <button
                      onClick={() => onSelect([r.entity, ...r.peers])}
                      title={`Select ${r.entity} and all ${r.peers.length} peers`}
                      className="w-full text-left hover:bg-gray-50 dark:hover:bg-slate-700 rounded px-1"
                    >
                      <span className="text-blue-600 dark:text-blue-400">{r.entity}</span>
                      <span className="text-gray-400 ml-1">
                        {r.n}
                        {r.flipped > 0 ? ` (${r.flipped} flipped)` : ''}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-[11px] font-semibold uppercase tracking-wider
                       text-gray-400 dark:text-gray-500 mb-1">
          Every ownership pair, by rule
        </h3>
        <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-1.5">
          Derived live from the classifier the graph itself uses, so this cannot
          drift from what is drawn. Overrides and value-object membership are
          hand-curated — if a pair looks wrong, the classification is.
        </p>
        <ul className="space-y-1">
          {groups.map(g => {
            const key = `${g.verdict}/${g.rule}`;
            const v = VERDICT_LABEL[g.verdict] ?? VERDICT_LABEL.ref;
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
      </section>
    </div>
  );
}
