/**
 * React hook around ElkLayoutEngine: recompute layout when the spec changes,
 * cancelling any in-flight run (the icd11 NodeLinkView cancellation pattern:
 * effect cleanup kills the worker; the engine recreates it lazily).
 */

import { useEffect, useRef, useState } from 'react';
import { ElkLayoutEngine } from './elkLayout';
import type { GraphSpec, LayoutEngineOptions, LayoutResult } from './types';

export function useGraphLayout(
  spec: GraphSpec | null,
  opts: LayoutEngineOptions = {},
): { layout: LayoutResult | null; inProgress: boolean } {
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

  // Hand back nothing while a new spec is still being laid out, rather than
  // the previous spec's result: a stale layout references node/edge ids the
  // caller's current view model no longer contains.
  //
  // An empty spec is not pending — the effect above short-circuits it without
  // ever calling the engine, so it must not read as perpetually in progress.
  const pending = !!spec && spec.nodes.length > 0;
  const fresh = state && state.spec === spec ? state.layout : null;
  return { layout: fresh, inProgress: (inProgress || !fresh) && pending };
}
