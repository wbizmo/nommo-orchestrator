import { describe, expect, it } from "vitest";
import { NodeRegistry } from "../../src/core/registry/node-registry.js";
import { Router } from "../../src/core/routing/router.js";
import { ServiceRegistry } from "../../src/core/services/service-registry.js";

describe("Weighted Routing", () => {
  it("honors service weights", () => {
    const nodes =
      new NodeRegistry();

    const services =
      new ServiceRegistry(
        nodes
      );

    nodes.register({
      id: "node-1",
      name: "worker-1",
      host: "10.0.0.1",
      port: 7001
    });

    nodes.register({
      id: "node-2",
      name: "worker-2",
      host: "10.0.0.2",
      port: 7002
    });

    nodes.updateStatus(
      "node-1",
      "healthy"
    );

    nodes.updateStatus(
      "node-2",
      "healthy"
    );

    services.register({
      name: "api",
      nodeId: "node-1",
      host: "10.0.0.1",
      port: 4000,
      weight: 3
    });

    services.register({
      name: "api",
      nodeId: "node-2",
      host: "10.0.0.2",
      port: 4000,
      weight: 1
    });

    const router =
      new Router(
        services
      );

    const sequence = [
      router.route("api")
        .selected?.nodeId,
      router.route("api")
        .selected?.nodeId,
      router.route("api")
        .selected?.nodeId,
      router.route("api")
        .selected?.nodeId
    ];

    expect(sequence).toEqual([
      "node-1",
      "node-1",
      "node-1",
      "node-2"
    ]);
  });
});
