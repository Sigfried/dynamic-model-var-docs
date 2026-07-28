/**
 * ELK layered layout in a Web Worker, with cancellation.
 *
 * Ported from icd11-playground NodeLinkView: the worker is killed and
 * lazily recreated on cancel(), so an in-flight layout of a stale graph
 * never blocks the next one. Self-loop edges are excluded from the ELK
 * graph (callers render them as badges, not routed edges).
 */

import ELK from 'elkjs/lib/elk-api';
import type { ELK as ElkInstance, ElkNode } from 'elkjs/lib/elk-api';
import elkWorkerUrl from 'elkjs/lib/elk-worker.min.js?url';
import type {
  GraphSpec, LayoutEngineOptions, LayoutResult, PlacedNode, RoutedEdge, EdgeSection,
} from './types';

export class ElkLayoutEngine {
  private elk: ElkInstance | null = null;

  private ensure(): ElkInstance {
    if (!this.elk) this.elk = new ELK({ workerUrl: elkWorkerUrl });
    return this.elk;
  }

  async layout(spec: GraphSpec, opts: LayoutEngineOptions = {}): Promise<LayoutResult> {
    const {
      direction = 'DOWN',
      nodeSpacing = 32,
      layerSpacing = 56,
      usePartitions = false,
    } = opts;

    const root: ElkNode = {
      id: 'root',
      layoutOptions: {
        'elk.algorithm': 'layered',
        'elk.direction': direction,
        'elk.spacing.nodeNode': String(nodeSpacing),
        'elk.layered.spacing.nodeNodeBetweenLayers': String(layerSpacing),
        'elk.edgeRouting': 'ORTHOGONAL',
        'elk.layered.considerModelOrder.strategy': 'NODES_AND_EDGES',
        ...(usePartitions ? { 'elk.partitioning.activate': 'true' } : {}),
      },
      children: spec.nodes.map(n => ({
        id: n.id,
        width: n.width,
        height: n.height,
        ...(usePartitions && n.partition !== undefined
          ? { layoutOptions: { 'elk.partitioning.partition': String(n.partition) } }
          : {}),
      })),
      edges: spec.edges
        .filter(e => e.source !== e.target)
        .map(e => ({ id: e.id, sources: [e.source], targets: [e.target] })),
    };

    const out = await this.ensure().layout(root);

    const nodes: PlacedNode[] = (out.children ?? []).map(n => ({
      id: n.id,
      x: n.x ?? 0,
      y: n.y ?? 0,
      width: n.width ?? 0,
      height: n.height ?? 0,
    }));

    const edges: RoutedEdge[] = (out.edges ?? []).map(e => ({
      id: e.id,
      source: e.sources[0],
      target: e.targets[0],
      sections: e.sections as EdgeSection[] | undefined,
    }));

    const width = Math.max(0, ...nodes.map(n => n.x + n.width));
    const height = Math.max(0, ...nodes.map(n => n.y + n.height));
    return { nodes, edges, width, height };
  }

  /** Kill any in-flight layout; the worker is recreated on next layout(). */
  cancel(): void {
    if (this.elk) {
      this.elk.terminateWorker();
      this.elk = null;
    }
  }

  dispose(): void {
    this.cancel();
  }
}
