/**
 * React hook around ElkLayoutEngine: recompute layout when the spec changes,
 * cancelling any in-flight run (the icd11 NodeLinkView cancellation pattern:
 * effect cleanup kills the worker; the engine recreates it lazily).
 */

import { useEffect, useRef, useState } from 'react';
import { ElkLayoutEngine } from './elkLayout';
import type { GraphSpec, LayoutEngineOptions, LayoutResult } from './types';

/**
 * A completed layout, paired with the spec it was computed from.
 *
 * Layout is async (ELK runs in a worker), so the latest completed result can
 * belong to a spec the caller has already replaced. Its node and edge ids must
 * then NOT be joined against the caller's current view model — a deselected
 * class's edge is gone from that model, and looking it up crashed with
 * "Routed edge edge-80 missing from view model" (useGraphLayout.test.ts pins
 * it). The pairing is what lets a caller tell: `latest.spec === spec` means
 * the ids are current; otherwise only the COORDINATES are safe to use, as
 * the positions boxes hold while the next layout is computed.
 */
export interface LayoutGeneration {
  spec: GraphSpec;
  layout: LayoutResult;
}

export function useGraphLayout(
  spec: GraphSpec | null,
  opts: LayoutEngineOptions = {},
): {
  /** The most recent completed layout, current or superseded — see above. */
  latest: LayoutGeneration | null;
  inProgress: boolean;
} {
  const engineRef = useRef<ElkLayoutEngine | null>(null);
  if (!engineRef.current) engineRef.current = new ElkLayoutEngine();

  const [latest, setLatest] = useState<LayoutGeneration | null>(null);
  const [inProgress, setInProgress] = useState(false);
  const optsKey = JSON.stringify(opts);

  useEffect(() => {
    const engine = engineRef.current!;
    if (!spec || spec.nodes.length === 0) {
      setLatest(null);
      setInProgress(false);
      return;
    }
    let cancelled = false;
    setInProgress(true);
    engine.layout(spec, JSON.parse(optsKey) as LayoutEngineOptions).then(
      result => {
        if (cancelled) return;
        setLatest({ spec, layout: result });
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

  // An empty spec is not pending — the effect above short-circuits it without
  // ever calling the engine, so it must not read as perpetually in progress.
  const pending = !!spec && spec.nodes.length > 0;
  const stale = !latest || latest.spec !== spec;
  return { latest, inProgress: (inProgress || stale) && pending };
}
