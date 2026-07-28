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

  const [layout, setLayout] = useState<LayoutResult | null>(null);
  const [inProgress, setInProgress] = useState(false);
  const optsKey = JSON.stringify(opts);

  useEffect(() => {
    const engine = engineRef.current!;
    if (!spec || spec.nodes.length === 0) {
      setLayout(null);
      setInProgress(false);
      return;
    }
    let cancelled = false;
    setInProgress(true);
    engine.layout(spec, JSON.parse(optsKey) as LayoutEngineOptions).then(
      result => {
        if (cancelled) return;
        setLayout(result);
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

  return { layout, inProgress };
}
