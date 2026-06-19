import { describe, expect, it } from "vitest";
import { NodeRegistry } from "../../src/core/registry/node-registry.js";

describe("NodeRegistry", () => {
  it("registers a node", () => {
    const registry = new NodeRegistry();

    const node = registry.register({
      id: "node-1",
      name: "worker-1",
      host: "127.0.0.1",
      port: 7001,
      region: "local"
    });

    expect(node.id).toBe("node-1");
    expect(node.status).toBe("registered");
    expect(node.region).toBe("local");
    expect(registry.size()).toBe(1);
  });

  it("finds a node by id", () => {
    const registry = new NodeRegistry();

    registry.register({
      id: "node-1",
      name: "worker-1",
      host: "127.0.0.1",
      port: 7001
    });

    const node = registry.findById("node-1");

    expect(node?.name).toBe("worker-1");
  });

  it("lists registered nodes", () => {
    const registry = new NodeRegistry();

    registry.register({
      id: "node-1",
      name: "worker-1",
      host: "127.0.0.1",
      port: 7001
    });

    registry.register({
      id: "node-2",
      name: "worker-2",
      host: "127.0.0.1",
      port: 7002
    });

    expect(registry.list()).toHaveLength(2);
  });

  it("updates node status", () => {
    const registry = new NodeRegistry();

    registry.register({
      id: "node-1",
      name: "worker-1",
      host: "127.0.0.1",
      port: 7001
    });

    const updated = registry.updateStatus("node-1", "healthy");

    expect(updated?.status).toBe("healthy");
  });

  it("returns null when updating a missing node", () => {
    const registry = new NodeRegistry();

    const updated = registry.updateStatus("missing-node", "healthy");

    expect(updated).toBeNull();
  });

  it("removes a node", () => {
    const registry = new NodeRegistry();

    registry.register({
      id: "node-1",
      name: "worker-1",
      host: "127.0.0.1",
      port: 7001
    });

    expect(registry.remove("node-1")).toBe(true);
    expect(registry.findById("node-1")).toBeNull();
  });
});
