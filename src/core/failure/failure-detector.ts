import { NodeRegistry } from "../registry/node-registry.js";
import type {
  FailureDetectorOptions,
  FailureScanResult,
  NodeHealthEvaluation
} from "../../types/failure.js";
import type { ClusterNode, NodeStatus } from "../../types/node.js";

export class FailureDetector {
  constructor(
    private readonly registry: NodeRegistry,
    private readonly options: FailureDetectorOptions
  ) {
    if (options.unhealthyAfterMs <= 0) {
      throw new Error("unhealthyAfterMs must be greater than 0");
    }

    if (options.deadAfterMs <= options.unhealthyAfterMs) {
      throw new Error("deadAfterMs must be greater than unhealthyAfterMs");
    }
  }

  evaluateNode(node: ClusterNode, now: Date = new Date()): NodeHealthEvaluation {
    if (!node.lastSeenAt) {
      return {
        node,
        nextStatus: node.status,
        shouldTransition: false,
        reason: "node has not sent a heartbeat yet"
      };
    }

    const lastSeen = new Date(node.lastSeenAt).getTime();
    const elapsedMs = now.getTime() - lastSeen;

    if (elapsedMs >= this.options.deadAfterMs) {
      return this.toEvaluation(node, "dead", `last heartbeat was ${elapsedMs}ms ago`);
    }

    if (elapsedMs >= this.options.unhealthyAfterMs) {
      return this.toEvaluation(node, "unhealthy", `last heartbeat was ${elapsedMs}ms ago`);
    }

    return this.toEvaluation(node, "healthy", `last heartbeat was ${elapsedMs}ms ago`);
  }

  scan(now: Date = new Date()): FailureScanResult {
    const transitionedNodes: FailureScanResult["transitionedNodes"] = [];

    for (const node of this.registry.list()) {
      const evaluation = this.evaluateNode(node, now);

      if (evaluation.shouldTransition) {
        const updated = this.registry.updateStatus(node.id, evaluation.nextStatus);

        if (updated) {
          transitionedNodes.push({
            nodeId: node.id,
            from: node.status,
            to: evaluation.nextStatus,
            reason: evaluation.reason
          });
        }
      }
    }

    const nodes = this.registry.list();

    return {
      scannedAt: now.toISOString(),
      scannedNodes: nodes.length,
      transitionedNodes,
      healthyNodes: nodes.filter((node) => node.status === "healthy").length,
      unhealthyNodes: nodes.filter((node) => node.status === "unhealthy").length,
      deadNodes: nodes.filter((node) => node.status === "dead").length
    };
  }

  private toEvaluation(
    node: ClusterNode,
    nextStatus: NodeStatus,
    reason: string
  ): NodeHealthEvaluation {
    return {
      node,
      nextStatus,
      shouldTransition: node.status !== nextStatus,
      reason
    };
  }
}
