import type { ClusterNode, NodeStatus } from "./node.js";

export interface FailureDetectorOptions {
  unhealthyAfterMs: number;
  deadAfterMs: number;
}

export interface FailureScanResult {
  scannedAt: string;
  scannedNodes: number;
  transitionedNodes: Array<{
    nodeId: string;
    from: NodeStatus;
    to: NodeStatus;
    reason: string;
  }>;
  healthyNodes: number;
  unhealthyNodes: number;
  deadNodes: number;
}

export interface NodeHealthEvaluation {
  node: ClusterNode;
  nextStatus: NodeStatus;
  shouldTransition: boolean;
  reason: string;
}
