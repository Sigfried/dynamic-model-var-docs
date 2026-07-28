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
      extraLayoutOptions = {},
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
        ...extraLayoutOptions,
      },
      children: spec.nodes.map(n => ({
        id: n.id,
        width: n.width,
        height: n.height,
        ...(n.ports?.length
          ? { ports: n.ports.map(p => ({ id: p.id, x: p.x, y: p.y, width: 0, height: 0 })) }
          : {}),
        ...(usePartitions && n.partition !== undefined || n.ports?.length
          ? {
              layoutOptions: {
                ...(usePartitions && n.partition !== undefined
                  ? { 'elk.partitioning.partition': String(n.partition) }
                  : {}),
                ...(n.ports?.length ? { 'elk.portConstraints': 'FIXED_POS' } : {}),
              },
            }
          : {}),
      })),
      edges: spec.edges
        .filter(e => e.source !== e.target)
        .map(e => ({
          id: e.id,
          sources: [e.sourcePort ?? e.source],
          targets: [e.targetPort ?? e.target],
        })),
    };

    const specEdgeById = new Map(spec.edges.map(e => [e.id, e]));
    const out = await this.ensure().layout(root);

    const nodes: PlacedNode[] = (out.children ?? []).map(n => ({
      id: n.id,
      x: n.x ?? 0,
      y: n.y ?? 0,
      width: n.width ?? 0,
      height: n.height ?? 0,
    }));

    // Report spec-level node ids (ELK's sources/targets echo port ids when
    // the edge attached to a port).
    const edges: RoutedEdge[] = (out.edges ?? []).map(e => {
      const specEdge = specEdgeById.get(e.id);
      if (!specEdge) throw new Error(`ELK returned unknown edge id: ${e.id}`);
      return {
        id: e.id,
        source: specEdge.source,
        target: specEdge.target,
        sections: e.sections as EdgeSection[] | undefined,
      };
    });

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
