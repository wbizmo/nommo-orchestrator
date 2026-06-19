import type { RouteDecision } from "./routing.js";
import type { ClusterNode } from "./node.js";

export interface ClusterSimulationResult {
  initialNodes: ClusterNode[];
  initialRoute: RouteDecision;
  afterFailureRoute: RouteDecision;
  afterRecoveryRoute: RouteDecision;
  failedNodeId: string;
  recoveredNodeId: string;
}
