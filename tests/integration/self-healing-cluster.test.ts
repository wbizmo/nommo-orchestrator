import { describe, expect, it } from "vitest";
import { SelfHealingCluster } from "../../src/core/cluster/self-healing-cluster.js";

describe("SelfHealingCluster", () => {
  it("fails over away from a dead node and restores it after recovery", () => {
    const cluster = new SelfHealingCluster();

    const result = cluster.simulate();

    expect(result.initialNodes).toHaveLength(3);
    expect(result.initialRoute.selected?.nodeId).toBe("node-1");

    expect(result.afterFailureRoute.selected?.nodeId).not.toBe("node-1");
    expect(["node-2", "node-3"]).toContain(result.afterFailureRoute.selected?.nodeId);

    const failed = cluster.nodes.findById("node-1");

    expect(failed?.status).toBe("healthy");

    expect(result.afterRecoveryRoute.healthyInstances).toBe(3);
    expect(["node-1", "node-2", "node-3"]).toContain(result.afterRecoveryRoute.selected?.nodeId);
  });

  it("keeps dead nodes out of healthy service discovery", () => {
    const cluster = new SelfHealingCluster();

    cluster.bootstrap();

    cluster.detector.scan(new Date("2026-06-19T00:00:35.000Z"));

    cluster.heartbeats.receive({
      nodeId: "node-2",
      observedAt: new Date("2026-06-19T00:00:35.000Z")
    });

    cluster.heartbeats.receive({
      nodeId: "node-3",
      observedAt: new Date("2026-06-19T00:00:35.000Z")
    });

    const healthy = cluster.services.discoverHealthy("nommo-demo-api");

    expect(healthy.instances.map((instance) => instance.nodeId)).toEqual(["node-2", "node-3"]);
  });
});
