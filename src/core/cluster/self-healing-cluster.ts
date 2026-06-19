import { FailureDetector } from "../failure/failure-detector.js";
import { HeartbeatService } from "../heartbeat.js";
import { NodeRegistry } from "../registry/node-registry.js";
import { Router } from "../routing/router.js";
import { ServiceRegistry } from "../services/service-registry.js";
import type { ClusterSimulationResult } from "../../types/cluster.js";

export class SelfHealingCluster {
  readonly nodes = new NodeRegistry();
  readonly services = new ServiceRegistry(this.nodes);
  readonly heartbeats = new HeartbeatService(this.nodes);
  readonly router = new Router(this.services);
  readonly detector = new FailureDetector(this.nodes, {
    unhealthyAfterMs: 10_000,
    deadAfterMs: 30_000
  });

  bootstrap(): void {
    for (const index of [1, 2, 3]) {
      const nodeId = `node-${index}`;

      this.nodes.register({
        id: nodeId,
        name: `worker-${index}`,
        host: `10.0.0.${index}`,
        port: 7000 + index,
        region: "local"
      });

      this.heartbeats.receive({
        nodeId,
        observedAt: new Date("2026-06-19T00:00:00.000Z")
      });

      this.services.register({
        name: "nommo-demo-api",
        nodeId,
        host: `10.0.0.${index}`,
        port: 4000
      });
    }
  }

  simulate(): ClusterSimulationResult {
    this.bootstrap();

    const initialNodes = this.nodes.list();
    const initialRoute = this.router.route("nommo-demo-api");

    this.detector.scan(new Date("2026-06-19T00:00:35.000Z"));

    this.heartbeats.receive({
      nodeId: "node-2",
      observedAt: new Date("2026-06-19T00:00:35.000Z")
    });

    this.heartbeats.receive({
      nodeId: "node-3",
      observedAt: new Date("2026-06-19T00:00:35.000Z")
    });

    const afterFailureRoute = this.router.route("nommo-demo-api");

    this.heartbeats.receive({
      nodeId: "node-1",
      observedAt: new Date("2026-06-19T00:00:40.000Z")
    });

    const afterRecoveryRoute = this.router.route("nommo-demo-api");

    return {
      initialNodes,
      initialRoute,
      afterFailureRoute,
      afterRecoveryRoute,
      failedNodeId: "node-1",
      recoveredNodeId: "node-1"
    };
  }
}
