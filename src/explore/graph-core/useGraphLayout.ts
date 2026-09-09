/**
 * React hook around ElkLayoutEngine: recompute layout when the spec changes,
 * cancelling any in-flight run (the icd11 NodeLinkView cancellation pattern:
 * effect cleanup kills the worker; the engine recreates it lazily).
 */

import { useEffect, useRef, useState } from 'react';
import { ElkLayoutEngine } from './elkLayout';
import type { GraphSpec, LayoutEngineOptions, LayoutResult } from './types';

/**
 * The previous generation's layout, kept alive so a caller can animate out of
 * it. NOT joinable against the caller's current view model — that is the whole
 * point of the staleness guard — so it carries the spec it was computed from
 * and is only safe to render as a SNAPSHOT (positions and ids, nothing looked
 * up elsewhere).
 */
export interface PreviousLayout {
  spec: GraphSpec;
  layout: LayoutResult;
}

export function useGraphLayout(
  spec: GraphSpec | null,
  opts: LayoutEngineOptions = {},
): {
  layout: LayoutResult | null;
  inProgress: boolean;
  previous: PreviousLayout | null;
} {
  const engineRef = useRef<ElkLayoutEngine | null>(null);
  if (!engineRef.current) engineRef.current = new ElkLayoutEngine();

  // The spec is stored alongside its result: layout is async (ELK runs in a
  // worker), so a re-render with a new spec arrives while `layout` still holds
  // the previous run's nodes/edges. Callers that join layout output back to
  // their own view model must not consume a result computed from a different
  // spec — see the staleness guard in OwnershipGraphView.
  const [state, setState] = useState<{ spec: GraphSpec; layout: LayoutResult } | null>(null);
  const [inProgress, setInProgress] = useState(false);
  const optsKey = JSON.stringify(opts);

  useEffect(() => {
    const engine = engineRef.current!;
    if (!spec || spec.nodes.length === 0) {
      setState(null);
      setInProgress(false);
      return;
    }
    let cancelled = false;
    setInProgress(true);
    engine.layout(spec, JSON.parse(optsKey) as LayoutEngineOptions).then(
      result => {
        if (cancelled) return;
        setState({ spec, layout: result });
        setInProgress(false);
      },
      (err: unknown) => {
        if (cancelled) return;  // worker was terminated on purpose
        setInProgress(false);
        console.error('graph-core layout failed:', err);
      },
    );
    return () => {
      cancelled = true;
      engine.cancel();
    };
  }, [spec, optsKey]);

  useEffect(() => () => engineRef.current?.dispose(), []);

  // `layout` is CURRENT-GENERATION ONLY, and null while a new spec is still
  // being laid out. Handing back the previous spec's result here caused a real
  // crash ("Routed edge edge-80 missing from view model", see
  // useGraphLayout.test.ts): the caller joins these ids against a view model
  // that no longer contains them.
  //
  // An empty spec is not pending — the effect above short-circuits it without
  // ever calling the engine, so it must not read as perpetually in progress.
  const pending = !!spec && spec.nodes.length > 0;
  const fresh = state && state.spec === spec ? state.layout : null;

  /*
   * The superseded result, exposed SEPARATELY so the caller can keep boxes on
   * screen at their old positions instead of unmounting them (which is what
   * made every selection change flash). Bundled with its own spec precisely so
   * it cannot be mistaken for something joinable against the current view
   * model.
   *
   * Non-null only while ELK is running, i.e. exactly the gap it exists to
   * cover. A caller that needs the outgoing generation AFTER the new layout
   * lands (to tell an arriving box from one that merely moved) must retain it
   * itself — that is animation bookkeeping, and this hook owns layout, not
   * animation.
   */
  const previous = state && state.spec !== spec ? state : null;

  return { layout: fresh, inProgress: (inProgress || !fresh) && pending, previous };
}
