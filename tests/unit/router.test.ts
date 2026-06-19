import { describe, expect, it } from "vitest";
import { NodeRegistry } from "../../src/core/registry/node-registry.js";
import { ServiceRegistry } from "../../src/core/services/service-registry.js";
import { Router } from "../../src/core/routing/router.js";

describe("Router", () => {
  function setup() {
    const nodes =
      new NodeRegistry();

    const services =
      new ServiceRegistry(nodes);

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

    nodes.register({
      id: "node-3",
      name: "worker-3",
      host: "10.0.0.3",
      port: 7003
    });

    nodes.updateStatus(
      "node-1",
      "healthy"
    );

    nodes.updateStatus(
      "node-2",
      "healthy"
    );

    nodes.updateStatus(
      "node-3",
      "dead"
    );

    services.register({
      name: "vaultbox-api",
      nodeId: "node-1",
      host: "10.0.0.1",
      port: 4000
    });

    services.register({
      name: "vaultbox-api",
      nodeId: "node-2",
      host: "10.0.0.2",
      port: 4000
    });

    services.register({
      name: "vaultbox-api",
      nodeId: "node-3",
      host: "10.0.0.3",
      port: 4000
    });

    return {
      router:
        new Router(services)
    };
  }

  it("routes only healthy nodes", () => {
    const { router } = setup();

    const decision =
      router.route("vaultbox-api");

    expect(
      decision.selected?.nodeId
    ).not.toBe("node-3");
  });

  it("round robins between healthy nodes", () => {
    const { router } = setup();

    const first =
      router.route("vaultbox-api");

    const second =
      router.route("vaultbox-api");

    const third =
      router.route("vaultbox-api");

    expect(
      first.selected?.nodeId
    ).toBe("node-1");

    expect(
      second.selected?.nodeId
    ).toBe("node-2");

    expect(
      third.selected?.nodeId
    ).toBe("node-1");
  });

  it("returns null when no healthy instances exist", () => {
    const nodes =
      new NodeRegistry();

    const services =
      new ServiceRegistry(nodes);

    const router =
      new Router(services);

    const decision =
      router.route("missing-service");

    expect(
      decision.selected
    ).toBeNull();
  });

  it("can reset routing state", () => {
    const { router } = setup();

    router.route("vaultbox-api");
    router.route("vaultbox-api");

    router.reset("vaultbox-api");

    const decision =
      router.route("vaultbox-api");

    expect(
      decision.selected?.nodeId
    ).toBe("node-1");
  });
});
