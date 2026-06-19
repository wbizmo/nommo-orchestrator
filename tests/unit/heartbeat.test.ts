import { describe, expect, it } from "vitest";
import { HeartbeatService } from "../../src/core/heartbeat.js";
import { NodeRegistry } from "../../src/core/registry/node-registry.js";

describe("HeartbeatService", () => {
  it("accepts heartbeat from a registered node", () => {
    const registry = new NodeRegistry();
    const heartbeat = new HeartbeatService(registry);

    registry.register({
      id: "node-1",
      name: "worker-1",
      host: "127.0.0.1",
      port: 7001
    });

    const result = heartbeat.receive({
      nodeId: "node-1",
      observedAt: new Date("2026-06-19T00:00:00.000Z")
    });

    expect(result).toEqual({
      nodeId: "node-1",
      accepted: true,
      status: "healthy",
      lastSeenAt: "2026-06-19T00:00:00.000Z",
      heartbeatCount: 1
    });
  });

  it("rejects heartbeat from an unknown node", () => {
    const registry = new NodeRegistry();
    const heartbeat = new HeartbeatService(registry);

    const result = heartbeat.receive({
      nodeId: "missing-node"
    });

    expect(result).toBeNull();
  });

  it("increments heartbeat count", () => {
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

    const second = heartbeat.receive({
      nodeId: "node-1",
      observedAt: new Date("2026-06-19T00:00:05.000Z")
    });

    expect(second?.heartbeatCount).toBe(2);
    expect(second?.lastSeenAt).toBe("2026-06-19T00:00:05.000Z");
  });
});
