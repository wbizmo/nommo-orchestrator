import { describe, expect, it } from "vitest";
import { FailureDetector } from "../../src/core/failure/failure-detector.js";
import { HeartbeatService } from "../../src/core/heartbeat.js";
import { NodeRegistry } from "../../src/core/registry/node-registry.js";

function createRegistryWithHealthyNode() {
  const registry = new NodeRegistry();
  const heartbeat = new HeartbeatService(registry);

  registry.register({
    id: "node-1",
    name: "worker-1",
    host: "127.0.0.1",
    port: 7001
  });

  heartbeat.receive({
    nodeId: "node-1",
    observedAt: new Date("2026-06-19T00:00:00.000Z")
  });

  return registry;
}

describe("FailureDetector", () => {
  it("rejects invalid timeout options", () => {
    const registry = new NodeRegistry();

    expect(
      () =>
        new FailureDetector(registry, {
          unhealthyAfterMs: 0,
          deadAfterMs: 10_000
        })
    ).toThrow("unhealthyAfterMs must be greater than 0");

    expect(
      () =>
        new FailureDetector(registry, {
          unhealthyAfterMs: 10_000,
          deadAfterMs: 5_000
        })
    ).toThrow("deadAfterMs must be greater than unhealthyAfterMs");
  });

  it("keeps a recently seen node healthy", () => {
    const registry = createRegistryWithHealthyNode();

    const detector = new FailureDetector(registry, {
      unhealthyAfterMs: 10_000,
      deadAfterMs: 30_000
    });

    const result = detector.scan(new Date("2026-06-19T00:00:05.000Z"));

    expect(result.healthyNodes).toBe(1);
    expect(result.unhealthyNodes).toBe(0);
    expect(result.deadNodes).toBe(0);
    expect(result.transitionedNodes).toHaveLength(0);
  });

  it("marks a stale node as unhealthy", () => {
    const registry = createRegistryWithHealthyNode();

    const detector = new FailureDetector(registry, {
      unhealthyAfterMs: 10_000,
      deadAfterMs: 30_000
    });

    const result = detector.scan(new Date("2026-06-19T00:00:15.000Z"));
    const node = registry.findById("node-1");

    expect(node?.status).toBe("unhealthy");
    expect(result.transitionedNodes).toEqual([
      {
        nodeId: "node-1",
        from: "healthy",
        to: "unhealthy",
        reason: "last heartbeat was 15000ms ago"
      }
    ]);
  });

  it("marks a very stale node as dead", () => {
    const registry = createRegistryWithHealthyNode();

    const detector = new FailureDetector(registry, {
      unhealthyAfterMs: 10_000,
      deadAfterMs: 30_000
    });

    const result = detector.scan(new Date("2026-06-19T00:00:35.000Z"));
    const node = registry.findById("node-1");

    expect(node?.status).toBe("dead");
    expect(result.deadNodes).toBe(1);
    expect(result.transitionedNodes[0]?.to).toBe("dead");
  });

  it("recovers a dead node when a heartbeat returns", () => {
    const registry = createRegistryWithHealthyNode();

    const detector = new FailureDetector(registry, {
      unhealthyAfterMs: 10_000,
      deadAfterMs: 30_000
    });

    detector.scan(new Date("2026-06-19T00:00:35.000Z"));

    const heartbeat = new HeartbeatService(registry);

    heartbeat.receive({
      nodeId: "node-1",
      observedAt: new Date("2026-06-19T00:00:40.000Z")
    });

    const node = registry.findById("node-1");

    expect(node?.status).toBe("healthy");
    expect(node?.heartbeatCount).toBe(2);
  });

  it("does not transition nodes that have never sent a heartbeat", () => {
    const registry = new NodeRegistry();

    registry.register({
      id: "node-1",
      name: "worker-1",
      host: "127.0.0.1",
      port: 7001
    });

    const detector = new FailureDetector(registry, {
      unhealthyAfterMs: 10_000,
      deadAfterMs: 30_000
    });

    const result = detector.scan(new Date("2026-06-19T00:01:00.000Z"));
    const node = registry.findById("node-1");

    expect(node?.status).toBe("registered");
    expect(result.transitionedNodes).toHaveLength(0);
  });
});
